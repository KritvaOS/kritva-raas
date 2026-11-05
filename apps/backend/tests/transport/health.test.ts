//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/health.test.ts
// Description : Liveness and readiness tests: separate semantics, required checks, draining, timeout and no disclosure
//
// Component   : Control Plane
// Module      : HTTP Transport Test
// Layer       : API
//
// Requirements: KR-BE-1-009, BTS-008, B-INC-001-AC-11, SEC-GATE-008
// API         : No callable API; tests of the health endpoints
//
// Author      : KritvaOS
// Created     : 01-11-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildHttpServer } from "../../src/transport/http-server.js";
import { createReadinessState, MAX_READINESS_CHECK_TIMEOUT_MS, type HealthOptions, type ReadinessCheck } from "../../src/transport/health.js";
import { REQUEST_ID_PATTERN } from "../../src/shared/request-context.js";

const SENTINEL = "SENTINEL-DB-PASSWORD-7c1e";

// The tests of the earlier behavior expect fresh results, so the reuse period is off unless a test asks for it.
function app(readiness?: HealthOptions) {
  return buildHttpServer({ readiness: { resultCacheMs: 0, ...readiness } });
}

const ok: ReadinessCheck = () => true;
const down: ReadinessCheck = () => false;

test("liveness answers 200 with the response envelope and a request ID", async () => {
  const res = await app().inject({ method: "GET", url: "/health/live" });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.status, "SUCCESS");
  assert.equal(body.code, "SERVICE_LIVE");
  assert.equal(body.error, null);
  assert.match(body.request_id, REQUEST_ID_PATTERN);
  assert.equal(res.headers["x-request-id"], body.request_id);
  assert.equal(res.headers["cache-control"], "no-store");
});

test("readiness answers 200 with the envelope when no check is required", async () => {
  const res = await app().inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.status, "SUCCESS");
  assert.equal(body.code, "SERVICE_READY");
  assert.equal(body.request_id, res.headers["x-request-id"]);
  assert.equal(res.headers["cache-control"], "no-store");
});

test("readiness answers 200 when every required check passes, including an async check", async () => {
  const res = await app({ checks: [ok, async () => true] }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 200);
});

test("readiness answers 503 with the registered envelope when a required check reports unavailable", async () => {
  const res = await app({ checks: [down] }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 503);
  const body = res.json();
  assert.equal(body.status, "UNAVAILABLE");
  assert.equal(body.code, "SERVICE_UNAVAILABLE");
  assert.equal(body.error.retryable, true);
  assert.equal(body.data, null);
  assert.equal(body.request_id, res.headers["x-request-id"]);
  assert.equal(res.headers["cache-control"], "no-store");
});

test("readiness is 503 when one of several checks fails and 200 when all pass", async () => {
  const failing = await app({ checks: [ok, down, ok] }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(failing.statusCode, 503);
  const passing = await app({ checks: [ok, ok, ok] }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(passing.statusCode, 200);
});

test("liveness stays 200 while readiness is 503", async () => {
  const server = app({ checks: [down] });
  assert.equal((await server.inject({ method: "GET", url: "/health/ready" })).statusCode, 503);
  assert.equal((await server.inject({ method: "GET", url: "/health/live" })).statusCode, 200);
});

test("a check that throws or rejects makes readiness 503 and nothing from the error reaches the response", async () => {
  const throwing: ReadinessCheck = () => { throw new Error(`connect failed postgres://app:${SENTINEL}@db.internal/raas at /srv/app/db.js`); };
  const rejecting: ReadinessCheck = async () => { throw new Error(`password=${SENTINEL}`); };
  for (const check of [throwing, rejecting]) {
    const res = await app({ checks: [check] }).inject({ method: "GET", url: "/health/ready" });
    assert.equal(res.statusCode, 503);
    const text = `${res.body}${JSON.stringify(res.headers)}`;
    for (const leaked of [SENTINEL, "postgres://", "db.internal", "/srv/app", "connect failed", "Error:", " at "]) {
      assert.ok(!text.includes(leaked), `response must not contain ${leaked}`);
    }
    assert.equal(res.json().code, "SERVICE_UNAVAILABLE");
  }
});

test("a check that returns anything other than true is unavailable (fail closed)", async () => {
  for (const value of ["yes", 1, {}, undefined, null]) {
    const check = (() => value) as unknown as ReadinessCheck;
    const res = await app({ checks: [check] }).inject({ method: "GET", url: "/health/ready" });
    assert.equal(res.statusCode, 503, `value ${String(value)} must not count as ready`);
  }
});

test("a check that never answers is unavailable once the timeout passes and does not hold the request", async () => {
  const hanging: ReadinessCheck = () => new Promise<boolean>(() => undefined);
  const started = Date.now();
  const res = await app({ checks: [hanging], checkTimeoutMs: 30 }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 503);
  assert.ok(Date.now() - started < 2000, "the request must end shortly after the timeout");
});

test("readiness is 503 while draining and liveness stays 200", async () => {
  const state = createReadinessState();
  const server = app({ state });
  assert.equal((await server.inject({ method: "GET", url: "/health/ready" })).statusCode, 200);
  state.beginDraining();
  const res = await server.inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 503);
  assert.equal(res.json().code, "SERVICE_UNAVAILABLE");
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal((await server.inject({ method: "GET", url: "/health/live" })).statusCode, 200);
});

test("draining that begins while the checks run still gives 503, never a stale 200", async () => {
  const state = createReadinessState();
  const check: ReadinessCheck = async () => { state.beginDraining(); return true; };
  const res = await app({ state, checks: [check] }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 503);
});

test("a draining service does not run its checks", async () => {
  const state = createReadinessState();
  state.beginDraining();
  let ran = 0;
  const res = await app({ state, checks: [() => { ran += 1; return true; }] }).inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 503);
  assert.equal(ran, 0);
});

test("the health routes are outside /api/v1 and answer GET and HEAD only", async () => {
  const server = app();
  assert.equal((await server.inject({ method: "GET", url: "/api/v1/health/live" })).statusCode, 404);
  assert.equal((await server.inject({ method: "GET", url: "/health" })).statusCode, 404);
  assert.equal((await server.inject({ method: "GET", url: "/health/ready/" })).statusCode, 404);
  const post = await server.inject({ method: "POST", url: "/health/live" });
  assert.equal(post.statusCode, 405);
  assert.match(String(post.headers["allow"]), /GET/);
  assert.match(String(post.headers["allow"]), /HEAD/);
  assert.equal(post.json().code, "METHOD_NOT_ALLOWED");
});

test("existing behavior is unchanged: an unknown path is still RESOURCE_NOT_FOUND", async () => {
  const res = await app().inject({ method: "GET", url: "/api/v1/none" });
  assert.equal(res.statusCode, 404);
  assert.equal(res.json().code, "RESOURCE_NOT_FOUND");
});

test("an invalid check timeout stops the server from being built, and the largest valid one is accepted", () => {
  for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, 1.5, 2_147_483_648]) {
    assert.throws(() => app({ checkTimeoutMs: value }), RangeError, `timeout ${String(value)} must be rejected`);
  }
  assert.doesNotThrow(() => app({ checkTimeoutMs: MAX_READINESS_CHECK_TIMEOUT_MS }));
});

test("a required check that is not a function stops the server from being built", () => {
  const notAFunction = "db" as unknown as ReadinessCheck;
  assert.throws(() => app({ checks: [notAFunction] }), TypeError);
  // An empty slot in a sparse array is skipped by every(), so it must be caught explicitly.
  assert.throws(() => app({ checks: new Array<ReadinessCheck>(1) }), TypeError);
});

test("HEAD gets the same status as GET, no body and no-store, and runs the checks", async () => {
  let ran = 0;
  const server = app({ checks: [() => { ran += 1; return true; }] });
  const live = await server.inject({ method: "HEAD", url: "/health/live" });
  assert.equal(live.statusCode, 200);
  assert.equal(live.body, "");
  assert.equal(live.headers["cache-control"], "no-store");
  const ready = await server.inject({ method: "HEAD", url: "/health/ready" });
  assert.equal(ready.statusCode, 200);
  assert.equal(ready.body, "");
  assert.equal(ran, 1, "HEAD runs the readiness checks like GET");
  const failing = await app({ checks: [down] }).inject({ method: "HEAD", url: "/health/ready" });
  assert.equal(failing.statusCode, 503);
  assert.equal(failing.body, "");
  assert.equal(failing.headers["cache-control"], "no-store");
});

test("a check that rejects after the timeout has passed does not cause an unhandled rejection", async () => {
  const seen: unknown[] = [];
  const onUnhandled = (reason: unknown): void => { seen.push(reason); };
  process.on("unhandledRejection", onUnhandled);
  try {
    const late: ReadinessCheck = () => new Promise<boolean>((_, reject) => { setTimeout(() => reject(new Error(SENTINEL)), 60); });
    const res = await app({ checks: [late], checkTimeoutMs: 20 }).inject({ method: "GET", url: "/health/ready" });
    assert.equal(res.statusCode, 503);
    await new Promise((r) => setTimeout(r, 150));
    assert.deepEqual(seen, []);
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
});

// ---------------------------------------------------------------------------------------------------------------
// Cancellation, shared runs, reuse of outcomes and unsettled checks (decision record KR-BE-1-009-readiness-check-policy.md)

const sleep = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });
const ready = (server: ReturnType<typeof app>) => server.inject({ method: "GET", url: "/health/ready" });

function manualClock(start = 0) {
  let t = start;
  return { now: () => t, set: (value: number) => { t = value; } };
}

test("a check receives an AbortSignal that is not aborted while the check answers in time", async () => {
  let received: AbortSignal | undefined;
  const check: ReadinessCheck = (signal) => { received = signal; return true; };
  assert.equal((await ready(app({ checks: [check] }))).statusCode, 200);
  assert.ok(received instanceof AbortSignal);
  assert.equal(received.aborted, false);
});

test("each check receives its own signal", async () => {
  const seen: AbortSignal[] = [];
  const check: ReadinessCheck = (signal) => { seen.push(signal); return true; };
  await ready(app({ checks: [check, check] }));
  assert.equal(seen.length, 2);
  assert.notEqual(seen[0], seen[1]);
});

test("the signal is aborted when the timeout fires, and the request ends with 503", async () => {
  let aborted = false;
  const check: ReadinessCheck = (signal) => new Promise<boolean>(() => { signal.addEventListener("abort", () => { aborted = true; }); });
  const res = await ready(app({ checks: [check], checkTimeoutMs: 30 }));
  assert.equal(res.statusCode, 503);
  assert.equal(aborted, true);
});

test("a late success after the timeout never changes the answer already given", async () => {
  const late: ReadinessCheck = async () => { await sleep(80); return true; };
  const res = await ready(app({ checks: [late], checkTimeoutMs: 20 }));
  assert.equal(res.statusCode, 503);
  await sleep(120);
});

test("shutdown aborts active checks and the request ends at once with 503 even if the check ignores the signal", async () => {
  const state = createReadinessState();
  let signalSeen: AbortSignal | undefined;
  const ignoring: ReadinessCheck = (signal) => { signalSeen = signal; return new Promise<boolean>(() => undefined); };
  const server = app({ state, checks: [ignoring], checkTimeoutMs: 5000 });
  const started = Date.now();
  const pending = ready(server);
  await sleep(30);
  state.beginDraining();
  const res = await pending;
  assert.equal(res.statusCode, 503);
  assert.ok(Date.now() - started < 1500, "the request must not wait for the check timeout");
  assert.equal(signalSeen?.aborted, true);
});

test("beginDraining is idempotent and aborts the drain signal once", () => {
  const state = createReadinessState();
  let aborts = 0;
  state.signal.addEventListener("abort", () => { aborts += 1; });
  assert.equal(state.signal.aborted, false);
  state.beginDraining();
  state.beginDraining();
  assert.equal(state.draining, true);
  assert.equal(state.signal.aborted, true);
  assert.equal(aborts, 1);
});

test("fifty concurrent probes share one run: each check is called exactly once", async () => {
  let calls = 0;
  const check: ReadinessCheck = async () => { calls += 1; await sleep(40); return true; };
  const server = app({ checks: [check] });
  const responses = await Promise.all(Array.from({ length: 50 }, () => ready(server)));
  assert.ok(responses.every((r) => r.statusCode === 200));
  assert.equal(calls, 1);
});

test("HEAD and GET probes that arrive together share the run", async () => {
  let calls = 0;
  const check: ReadinessCheck = async () => { calls += 1; await sleep(30); return true; };
  const server = app({ checks: [check] });
  const [get, head] = await Promise.all([ready(server), server.inject({ method: "HEAD", url: "/health/ready" })]);
  assert.equal(get.statusCode, 200);
  assert.equal(head.statusCode, 200);
  assert.equal(calls, 1);
});

test("a finished run is reused for 1000 ms and then run again, for successes and for failures", async () => {
  for (const outcome of [true, false]) {
    const clock = manualClock();
    let calls = 0;
    const check: ReadinessCheck = () => { calls += 1; return outcome; };
    const server = app({ checks: [check], resultCacheMs: 1000, now: clock.now });
    assert.equal((await ready(server)).statusCode, outcome ? 200 : 503);
    clock.set(999);
    assert.equal((await ready(server)).statusCode, outcome ? 200 : 503);
    assert.equal(calls, 1, "inside the window the outcome is reused");
    clock.set(1000);
    await ready(server);
    assert.equal(calls, 2, "after the window the checks run again");
  }
});

test("the reuse period is counted from the end of the run", async () => {
  const clock = manualClock();
  let calls = 0;
  const check: ReadinessCheck = async () => { calls += 1; clock.set(500); return true; };
  const server = app({ checks: [check], resultCacheMs: 1000, now: clock.now });
  await ready(server);
  clock.set(1499);
  await ready(server);
  assert.equal(calls, 1, "the run ended at 500, so the outcome is still reused at 1499");
  clock.set(1500);
  await ready(server);
  assert.equal(calls, 2);
});

test("the default reuse period is 1000 ms and it can be turned off with 0", async () => {
  let calls = 0;
  const check: ReadinessCheck = () => { calls += 1; return true; };
  const reused = buildHttpServer({ readiness: { checks: [check] } });
  await ready(reused);
  await ready(reused);
  assert.equal(calls, 1);
  calls = 0;
  const fresh = app({ checks: [check] });
  await ready(fresh);
  await ready(fresh);
  assert.equal(calls, 2);
});

test("reused outcomes never produce a 200 once shutdown has begun, and the checks are not run", async () => {
  const state = createReadinessState();
  let calls = 0;
  const check: ReadinessCheck = () => { calls += 1; return true; };
  const server = app({ state, checks: [check], resultCacheMs: 60_000 });
  assert.equal((await ready(server)).statusCode, 200);
  state.beginDraining();
  const res = await ready(server);
  assert.equal(res.statusCode, 503);
  assert.equal(res.json().code, "SERVICE_UNAVAILABLE");
  assert.equal(calls, 1);
});

test("a check that timed out and keeps running is not started again until it settles, and then it is", async () => {
  let calls = 0;
  const slow: ReadinessCheck = async () => { calls += 1; await sleep(120); return true; };
  const server = app({ checks: [slow], checkTimeoutMs: 20 });
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal(calls, 1);
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal(calls, 1, "the unfinished operation is not started a second time");
  await sleep(200);
  assert.equal(calls, 1);
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal(calls, 2, "after the operation settled the check is invoked again (and times out again)");
});

test("a check that recovers after settling gives 200 again", async () => {
  let calls = 0;
  const check: ReadinessCheck = async (signal) => {
    calls += 1;
    if (calls === 1) { await sleep(60); return false; }
    void signal;
    return true;
  };
  const server = app({ checks: [check], checkTimeoutMs: 20 });
  assert.equal((await ready(server)).statusCode, 503);
  await sleep(120);
  assert.equal((await ready(server)).statusCode, 200);
  assert.equal(calls, 2);
});

test("other checks still run while one check is unsettled", async () => {
  let stuckCalls = 0;
  let okCalls = 0;
  const stuck: ReadinessCheck = () => { stuckCalls += 1; return new Promise<boolean>(() => undefined); };
  const fine: ReadinessCheck = () => { okCalls += 1; return true; };
  const server = app({ checks: [stuck, fine], checkTimeoutMs: 20 });
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal(stuckCalls, 1);
  assert.equal(okCalls, 2);
});

test("a check that never settles keeps readiness at 503 for every later probe and is never started again", async () => {
  let calls = 0;
  const never: ReadinessCheck = () => { calls += 1; return new Promise<boolean>(() => undefined); };
  const server = app({ checks: [never], checkTimeoutMs: 20 });
  for (let i = 0; i < 5; i += 1) assert.equal((await ready(server)).statusCode, 503);
  assert.equal(calls, 1);
});

test("concurrent probes against a check that ignores its signal do not accumulate runs", async () => {
  let calls = 0;
  const never: ReadinessCheck = () => { calls += 1; return new Promise<boolean>(() => undefined); };
  const server = app({ checks: [never], checkTimeoutMs: 20 });
  const first = await Promise.all(Array.from({ length: 20 }, () => ready(server)));
  assert.ok(first.every((r) => r.statusCode === 503));
  const second = await Promise.all(Array.from({ length: 20 }, () => ready(server)));
  assert.ok(second.every((r) => r.statusCode === 503));
  assert.equal(calls, 1);
});

test("a check that throws or rejects is not treated as unsettled: it is invoked on every run", async () => {
  let calls = 0;
  const throwing: ReadinessCheck = () => { calls += 1; throw new Error(SENTINEL); };
  const server = app({ checks: [throwing] });
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal(calls, 2);
});

test("an invalid reuse period or clock stops the server from being built, and the bounds are accepted", () => {
  for (const value of [-1, Number.NaN, 1.5, 60_001, Number.POSITIVE_INFINITY]) {
    assert.throws(() => app({ resultCacheMs: value }), RangeError, `reuse period ${String(value)} must be rejected`);
  }
  assert.doesNotThrow(() => app({ resultCacheMs: 0 }));
  assert.doesNotThrow(() => app({ resultCacheMs: 60_000 }));
  assert.throws(() => app({ now: "clock" as unknown as () => number }), TypeError);
});

test("draining that begins while reused outcomes are being read still gives 503, never a stale 200", async () => {
  const state = createReadinessState();
  let begin = false;
  // The clock is read when the reused outcomes are looked up, so shutdown can be made to begin at exactly that moment.
  const now = (): number => { if (begin) state.beginDraining(); return 0; };
  const server = app({ state, checks: [() => true], resultCacheMs: 60_000, now });
  assert.equal((await ready(server)).statusCode, 200);
  begin = true;
  assert.equal((await ready(server)).statusCode, 503);
});

test("a clock that throws when the reused outcomes are read does not change the answer: the checks run again", async () => {
  let boom = false;
  let calls = 0;
  const now = (): number => { if (boom) throw new Error("clock failed"); return 0; };
  const server = app({ checks: [() => { calls += 1; return true; }], resultCacheMs: 60_000, now });
  assert.equal((await ready(server)).statusCode, 200);
  boom = true;
  const res = await ready(server);
  assert.equal(res.statusCode, 200);
  assert.equal(calls, 2);
});

test("a clock that throws or returns a number that is not finite never makes a probe fail, and nothing is reused", async () => {
  for (const now of [(): number => { throw new Error("clock failed"); }, (): number => Number.NaN, (): number => Number.POSITIVE_INFINITY]) {
    let calls = 0;
    const server = app({ checks: [() => { calls += 1; return true; }], resultCacheMs: 60_000, now });
    assert.equal((await ready(server)).statusCode, 200);
    assert.equal((await ready(server)).statusCode, 200, "single-flight is not left stuck by the clock failure");
    assert.equal(calls, 2, "nothing was recorded for reuse, so the checks ran each time");
  }
});

test("after a timed-out check settles, the reused failure stays until its period ends, then the check is invoked again", async () => {
  const clock = manualClock();
  let calls = 0;
  const check: ReadinessCheck = async () => { calls += 1; await sleep(60); return true; };
  const server = app({ checks: [check], checkTimeoutMs: 20, resultCacheMs: 1000, now: clock.now });
  assert.equal((await ready(server)).statusCode, 503);
  await sleep(120);
  assert.equal(calls, 1, "the operation has settled");
  clock.set(500);
  assert.equal((await ready(server)).statusCode, 503);
  assert.equal(calls, 1, "the reused failure is still served inside its period, so the check is not invoked");
  clock.set(1000);
  await ready(server);
  assert.equal(calls, 2, "after the period the check is invoked again");
});

test("the timeout timer is cleared when the check answers early: the signal is not aborted later", async () => {
  let received: AbortSignal | undefined;
  const check: ReadinessCheck = (signal) => { received = signal; return true; };
  assert.equal((await ready(app({ checks: [check], checkTimeoutMs: 40 }))).statusCode, 200);
  await sleep(120);
  assert.equal(received?.aborted, false);
});
