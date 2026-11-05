//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/health.ts
// Description : Liveness and readiness endpoints with separate semantics and no disclosure of internal state
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-009, B-INC-001-AC-11, BTS-008, SEC-GATE-008
// API         : GET /health/live, GET /health/ready (outside /api/v1)
//
// Author      : KritvaOS
// Created     : 01-11-2026
//==============================================================================

import type { FastifyInstance } from "fastify";
import { ERRORS, errorBody } from "./error-contract.js";
import { requestIdOf } from "./request-context.js";
import { successBody } from "./response-contract.js";

export const HEALTH_LIVE_PATH = "/health/live";
export const HEALTH_READY_PATH = "/health/ready";
// Owner decision of 2026-11-04: 2000 ms per check, a fixed value. It is not an environment setting; it can be changed
// through the checkTimeoutMs option (tests and controlled use). A check that has not answered by then counts as unavailable.
export const DEFAULT_READINESS_CHECK_TIMEOUT_MS = 2_000;
// The largest delay a Node.js timer accepts. A larger value would make the timer fire almost at once.
export const MAX_READINESS_CHECK_TIMEOUT_MS = 2_147_483_647;
// How long the outcomes of a finished readiness run are reused (decision record KR-BE-1-009-readiness-check-policy.md,
// decision 3). 0 turns the reuse off.
export const DEFAULT_READINESS_RESULT_CACHE_MS = 1_000;
// An engineering bound on the option, not an owner decision: a very long reuse period would hide an outage.
export const MAX_READINESS_RESULT_CACHE_MS = 60_000;

// A required dependency of readiness. It reports true when the dependency is usable. Anything else counts as
// unavailable: false, a thrown error, a rejected promise, a non-boolean result or no answer within the timeout.
//
// The signal is aborted when the check's own timeout fires and when shutdown begins. Aborting asks the operation to
// stop; it does not prove that it stopped. A check must honor the signal and, for a real dependency, also set its own
// operation timeout in the client (a database statement timeout shorter than the runner timeout) and release what it
// holds (a connection) on success, error, timeout and cancellation. A check that takes no argument is still valid.
//
// Limits. The runner stops waiting at the timeout or at shutdown, but it cannot stop an operation that ignores the
// signal. Such a check is remembered as unsettled: it is not invoked again until its operation settles, so unfinished
// work is bounded to one operation per check, and a check that never settles keeps readiness unavailable for the life
// of the process (owner decision of 2026-11-05: fail closed). A check must be non-blocking: a synchronous loop stops
// every timer, so the request hangs.
export type ReadinessCheck = (signal: AbortSignal) => boolean | Promise<boolean>;

// Draining starts when shutdown begins. The service then reports itself not ready so no new traffic is sent to it,
// while liveness stays up until the process exits. The state only ever moves from serving to draining. The signal is
// aborted when draining begins so that active checks are told to stop.
export interface ReadinessState {
  readonly draining: boolean;
  readonly signal: AbortSignal;
  beginDraining(): void;
}

export function createReadinessState(): ReadinessState {
  const controller = new AbortController();
  let draining = false;
  return {
    get draining() { return draining; },
    get signal() { return controller.signal; },
    beginDraining() {
      if (draining) return;
      draining = true;
      controller.abort();
    },
  };
}

export interface HealthOptions {
  readonly checks?: readonly ReadinessCheck[];
  readonly state?: ReadinessState;
  readonly checkTimeoutMs?: number;
  // How long the outcomes of a finished run are reused, in milliseconds. Default 1000; 0 turns the reuse off.
  readonly resultCacheMs?: number;
  // A monotonic clock in milliseconds that returns finite numbers. It exists so tests can control the reuse period. A
  // clock that throws or returns a number that is not finite only disables the reuse for that read or write: the
  // checks run and their result is returned, so a clock failure never changes the readiness answer.
  readonly now?: () => number;
}

// Runs the required checks and keeps the policy of the decision record. The returned function answers one question
// only: are the dependencies available. It says nothing about draining; the route reads that for every response.
function createReadinessRunner(
  checks: readonly ReadinessCheck[],
  state: ReadinessState,
  timeoutMs: number,
  cacheMs: number,
  now: () => number,
): () => Promise<boolean> {
  // One flag per check, set while its operation has not settled. It is cleared by the operation itself, never because
  // the wait ended, so a timed-out operation that keeps running is not started a second time.
  const unsettled = checks.map(() => false);
  let inFlight: Promise<boolean> | undefined;
  let reusable: { readonly ok: boolean; readonly at: number } | undefined;

  // The clock only serves the reuse of outcomes. A failing clock must not turn into a failing probe.
  function readClock(): number | undefined {
    try {
      const value = now();
      return Number.isFinite(value) ? value : undefined;
    } catch {
      return undefined;
    }
  }

  async function runCheck(index: number): Promise<boolean> {
    if (unsettled[index]) return false;
    const check = checks[index] as ReadinessCheck;
    const own = new AbortController();
    const signal = AbortSignal.any([state.signal, own.signal]);
    if (signal.aborted) return false;
    // A timer of this module, not AbortSignal.timeout: it keeps the event loop alive while a request waits and can be
    // cleared as soon as the check answers.
    const timer = setTimeout(() => own.abort(), timeoutMs);
    // Promise.resolve().then turns a synchronous throw into a rejection.
    const operation = Promise.resolve().then(() => check(signal));
    unsettled[index] = true;
    const settled = (): void => { unsettled[index] = false; };
    // Both branches clear the flag and also handle a late rejection, so it never becomes an unhandled rejection. The
    // error is dropped on purpose: its text may carry connection details and is never sent to the caller.
    operation.then(settled, settled);
    let onAbort: (() => void) | undefined;
    const aborted = new Promise<false>((resolve) => {
      onAbort = () => resolve(false);
      signal.addEventListener("abort", onAbort, { once: true });
    });
    try {
      // Only the boolean true counts, and only if the answer arrives before the abort. A late answer never changes it.
      return (await Promise.race([operation, aborted])) === true;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
      if (onAbort) signal.removeEventListener("abort", onAbort);
    }
  }

  async function runAll(): Promise<boolean> {
    const results = await Promise.all(checks.map((_, index) => runCheck(index)));
    return results.every(Boolean);
  }

  return async function evaluate(): Promise<boolean> {
    if (checks.length === 0) return true;
    if (reusable !== undefined) {
      const at = readClock();
      if (at !== undefined && at - reusable.at < cacheMs) return reusable.ok;
    }
    if (inFlight !== undefined) return inFlight;
    const run = runAll().then((ok) => {
      // A run that shutdown cut short says nothing about the dependencies, so it is not kept.
      if (cacheMs > 0 && !state.draining) {
        const at = readClock();
        if (at !== undefined) reusable = { ok, at };
      }
      return ok;
    }).finally(() => { inFlight = undefined; });
    inFlight = run;
    return run;
  };
}

// Liveness answers one question: can the process respond. It does not look at readiness, dependencies or
// shutdown. Readiness answers whether traffic should be sent here: serving, not draining, and every required
// check available. The failure body names no check, reason or setting. The routes answer GET, and HEAD, which
// Fastify adds for every GET route: HEAD runs the same handler, so it counts as a probe, shares the run in flight
// and the reused outcomes like any other probe.
export function registerHealthRoutes(app: FastifyInstance, options: HealthOptions = {}): void {
  // Array.from turns an empty slot into undefined, so validation below sees it; every() alone would skip it.
  const checks = Array.from(options.checks ?? []);
  const state = options.state ?? createReadinessState();
  const timeoutMs = options.checkTimeoutMs ?? DEFAULT_READINESS_CHECK_TIMEOUT_MS;
  const cacheMs = options.resultCacheMs ?? DEFAULT_READINESS_RESULT_CACHE_MS;
  const now = options.now ?? (() => performance.now());
  // Checked when the server is built, so a bad value stops startup instead of failing a probe later.
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_READINESS_CHECK_TIMEOUT_MS) {
    throw new RangeError("The readiness check timeout is invalid.");
  }
  if (!Number.isSafeInteger(cacheMs) || cacheMs < 0 || cacheMs > MAX_READINESS_RESULT_CACHE_MS) {
    throw new RangeError("The readiness result reuse period is invalid.");
  }
  if (!checks.every((check) => typeof check === "function")) {
    throw new TypeError("A readiness check must be a function.");
  }
  if (typeof now !== "function") throw new TypeError("The readiness clock must be a function.");
  const evaluate = createReadinessRunner(checks, state, timeoutMs, cacheMs, now);

  app.get(HEALTH_LIVE_PATH, async (request, reply) => {
    return reply
      .header("cache-control", "no-store")
      .send(successBody({ status: "SUCCESS", code: "SERVICE_LIVE", message: "The service is running." }, null, requestIdOf(request)));
  });

  app.get(HEALTH_READY_PATH, async (request, reply) => {
    const requestId = requestIdOf(request);
    let ready = !state.draining;
    if (ready) ready = await evaluate();
    // The draining state is read again when the answer is decided, so neither a run that took long nor reused
    // outcomes can produce a 200 after shutdown has begun.
    if (ready && state.draining) ready = false;
    reply.header("cache-control", "no-store");
    if (!ready) {
      return reply.code(ERRORS.serviceUnavailable.httpStatus).send(errorBody(ERRORS.serviceUnavailable, [], requestId));
    }
    return reply.send(successBody({ status: "SUCCESS", code: "SERVICE_READY", message: "The service is ready." }, null, requestId));
  });
}
