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

function app(readiness?: HealthOptions) {
  return buildHttpServer(readiness === undefined ? {} : { readiness });
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
