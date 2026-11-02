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
// Provisional bound for one readiness check; a check that has not answered by then counts as unavailable.
export const DEFAULT_READINESS_CHECK_TIMEOUT_MS = 2_000;
// The largest delay a Node.js timer accepts. A larger value would make the timer fire almost at once.
export const MAX_READINESS_CHECK_TIMEOUT_MS = 2_147_483_647;

// A required dependency of readiness. It reports true when the dependency is usable. Anything else counts as
// unavailable: false, a thrown error, a rejected promise, a non-boolean result or no answer within the timeout.
//
// Limits of this contract. The timeout bounds how long the HTTP request waits, not how long the operation behind
// the check runs: a check that has timed out keeps running, and a check that never settles is never cancelled.
// A check must be non-blocking: a synchronous loop stops the timer that would end the wait, so the request hangs.
// Every readiness request runs every check again, with no caching, single-flight or concurrency limit. No check
// exists yet because the backend has no database or other dependency. Before a real check is registered, its task
// must add a cancellation mechanism (for example an AbortSignal) and a concurrency policy.
export type ReadinessCheck = () => boolean | Promise<boolean>;

// Draining starts when shutdown begins. The service then reports itself not ready so no new traffic is sent to it,
// while liveness stays up until the process exits. The state only ever moves from serving to draining.
export interface ReadinessState {
  readonly draining: boolean;
  beginDraining(): void;
}

export function createReadinessState(): ReadinessState {
  let draining = false;
  return {
    get draining() { return draining; },
    beginDraining() { draining = true; },
  };
}

export interface HealthOptions {
  readonly checks?: readonly ReadinessCheck[];
  readonly state?: ReadinessState;
  readonly checkTimeoutMs?: number;
}

async function isAvailable(check: ReadinessCheck, timeoutMs: number): Promise<boolean> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<false>((resolve) => { timer = setTimeout(() => resolve(false), timeoutMs); });
  try {
    // Promise.resolve().then turns a synchronous throw into a rejection. Only the boolean true is accepted.
    return (await Promise.race([Promise.resolve().then(check), timeout])) === true;
  } catch {
    // The error is dropped on purpose: its text may carry connection details and is never sent to the caller.
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// Liveness answers one question: can the process respond. It does not look at readiness, dependencies or
// shutdown. Readiness answers whether traffic should be sent here: serving, not draining, and every required
// check available. The failure body names no check, reason or setting. The routes answer GET, and HEAD, which
// Fastify adds for every GET route: HEAD runs the same handler, so it counts as a probe and runs the checks.
export function registerHealthRoutes(app: FastifyInstance, options: HealthOptions = {}): void {
  // Array.from turns an empty slot into undefined, so validation below sees it; every() alone would skip it.
  const checks = Array.from(options.checks ?? []);
  const state = options.state ?? createReadinessState();
  const timeoutMs = options.checkTimeoutMs ?? DEFAULT_READINESS_CHECK_TIMEOUT_MS;
  // Checked when the server is built, so a bad value stops startup instead of failing a probe later.
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_READINESS_CHECK_TIMEOUT_MS) {
    throw new RangeError("The readiness check timeout is invalid.");
  }
  if (!checks.every((check) => typeof check === "function")) {
    throw new TypeError("A readiness check must be a function.");
  }

  app.get(HEALTH_LIVE_PATH, async (request, reply) => {
    return reply
      .header("cache-control", "no-store")
      .send(successBody({ status: "SUCCESS", code: "SERVICE_LIVE", message: "The service is running." }, null, requestIdOf(request)));
  });

  app.get(HEALTH_READY_PATH, async (request, reply) => {
    const requestId = requestIdOf(request);
    let ready = !state.draining;
    if (ready) {
      const results = await Promise.all(checks.map((check) => isAvailable(check, timeoutMs)));
      ready = results.every(Boolean);
    }
    // Shutdown may have begun while the checks ran, so the flag is read again when the answer is decided.
    if (ready && state.draining) ready = false;
    reply.header("cache-control", "no-store");
    if (!ready) {
      return reply.code(ERRORS.serviceUnavailable.httpStatus).send(errorBody(ERRORS.serviceUnavailable, [], requestId));
    }
    return reply.send(successBody({ status: "SUCCESS", code: "SERVICE_READY", message: "The service is ready." }, null, requestId));
  });
}
