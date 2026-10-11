//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/request-context.test.ts
// Description : Request context tests through the HTTP server: header on every response, isolation, propagation and client input ignored
//
// Component   : Control Plane
// Module      : HTTP Transport Test
// Layer       : API
//
// Requirements: KR-BE-1-005, BTS-005
// API         : No callable API; tests of the request context
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { REQUEST_ID_PATTERN, currentRequestContext } from "../../src/shared/request-context.js";
import { buildHttpServer } from "../../src/transport/http-server.js";
import type { RouteGroup } from "../../src/transport/api-v1.js";

// A service-style function that never receives the request: it reads the context the way a module would.
async function serviceReadsContext(delayMs: number): Promise<string | undefined> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return currentRequestContext()?.requestId;
}

const probe: RouteGroup = {
  name: "probe",
  prefix: "/probe",
  register: (api) => {
    api.get("/", async (request) => ({
      fromRequest: request.requestContext?.requestId,
      fromService: await serviceReadsContext(Number(new URL(request.url, "http://x").searchParams.get("d") ?? 0)),
    }));
    api.post(
      "/validated",
      { schema: { body: { type: "object", required: ["n"], properties: { n: { type: "integer" } }, additionalProperties: false } } },
      async () => ({}),
    );
    api.get("/boom", async () => { throw new Error("internal"); });
  },
};

function app() {
  return buildHttpServer({ groups: [probe] });
}

test("every kind of response carries a request ID header", async () => {
  const a = app();
  const json = { "content-type": "application/json" };
  const cases = [
    { method: "GET", url: "/api/v1/probe", status: 200 },
    { method: "GET", url: "/api/v1/nothing", status: 404 },
    { method: "GET", url: "/api/v1/probe/", status: 404 },
    { method: "DELETE", url: "/api/v1/probe", status: 405 },
    { method: "POST", url: "/api/v1/probe/validated", status: 400, headers: json, payload: { n: "x" } },
    { method: "POST", url: "/api/v1/probe/validated", status: 400, headers: json, payload: "{bad" },
    { method: "GET", url: "/api/v1/probe/boom", status: 500 },
  ] as const;
  for (const c of cases) {
    const res = await a.inject(c);
    assert.equal(res.statusCode, c.status, `${c.method} ${c.url}`);
    assert.match(String(res.headers["x-request-id"]), REQUEST_ID_PATTERN, `${c.method} ${c.url}`);
  }
  await a.close();
});

test("an error body repeats the same request ID as the header", async () => {
  const a = app();
  for (const url of ["/api/v1/nothing", "/api/v1/probe/boom", "/api/v1/probe/"]) {
    const res = await a.inject({ method: "GET", url });
    assert.equal(res.json().error.request_id, res.headers["x-request-id"], url);
  }
  const post = await a.inject({ method: "POST", url: "/api/v1/probe/validated", headers: { "content-type": "application/json" }, payload: {} });
  assert.equal(post.json().error.request_id, post.headers["x-request-id"]);
  const method = await a.inject({ method: "PUT", url: "/api/v1/probe" });
  assert.equal(method.json().error.request_id, method.headers["x-request-id"]);
  await a.close();
});

test("each request gets a different ID", async () => {
  const a = app();
  const ids = new Set<string>();
  for (let i = 0; i < 100; i += 1) ids.add(String((await a.inject({ method: "GET", url: "/api/v1/probe" })).headers["x-request-id"]));
  assert.equal(ids.size, 100);
  await a.close();
});

test("the handler and a service it calls see the same context as the header", async () => {
  const a = app();
  const res = await a.inject({ method: "GET", url: "/api/v1/probe?d=5" });
  const body = res.json();
  assert.equal(body.fromRequest, res.headers["x-request-id"]);
  assert.equal(body.fromService, res.headers["x-request-id"]);
  await a.close();
});

test("concurrent requests are isolated: each sees only its own ID", async () => {
  const a = app();
  const responses = await Promise.all(
    Array.from({ length: 40 }, (_, i) => a.inject({ method: "GET", url: `/api/v1/probe?d=${(40 - i) % 9}` })),
  );
  const ids = new Set<string>();
  for (const res of responses) {
    const id = String(res.headers["x-request-id"]);
    ids.add(id);
    assert.equal(res.json().fromService, id);
    assert.equal(res.json().fromRequest, id);
  }
  assert.equal(ids.size, 40);
  await a.close();
});

test("no context is left active after a request", async () => {
  const a = app();
  await a.inject({ method: "GET", url: "/api/v1/probe" });
  assert.equal(currentRequestContext(), undefined);
  await a.close();
});

test("a client-supplied X-Request-ID, X-Correlation-ID or newline-bearing value is ignored and never echoed", async () => {
  const a = app();
  const res = await a.inject({
    method: "GET",
    url: "/api/v1/probe",
    headers: { "x-request-id": "attacker-chosen-id", "x-correlation-id": "corr-123" },
  });
  const id = String(res.headers["x-request-id"]);
  assert.match(id, REQUEST_ID_PATTERN);
  assert.notEqual(id, "attacker-chosen-id");
  assert.ok(!res.body.includes("attacker-chosen-id"));
  assert.equal(res.headers["x-correlation-id"], undefined);
  const long = await a.inject({ method: "GET", url: "/api/v1/probe", headers: { "x-request-id": "x".repeat(5000) } });
  assert.match(String(long.headers["x-request-id"]), REQUEST_ID_PATTERN);
  await a.close();
});
