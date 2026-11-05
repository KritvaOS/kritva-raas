//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/correlation.test.ts
// Description : Request correlation tests: validation of the client identifier over real sockets, replacement, reflection on every response, isolation and no leak into bodies
//
// Component   : Control Plane
// Module      : HTTP Transport Test
// Layer       : API
//
// Requirements: KR-BE-1-008, B-INC-001-AC-07, BTS-005, BTS-006
// API         : No callable API; tests of the correlation identifier
//
// Author      : KritvaOS
// Created     : 05-11-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { connect } from "node:net";
import type { AddressInfo } from "node:net";
import type { FastifyInstance } from "fastify";
import {
  CLIENT_CORRELATION_ID_PATTERN,
  GENERATED_CORRELATION_ID_PATTERN,
  REQUEST_ID_PATTERN,
  currentRequestContext,
} from "../../src/shared/request-context.js";
import { createReadinessState } from "../../src/transport/health.js";
import { buildHttpServer } from "../../src/transport/http-server.js";
import type { RouteGroup } from "../../src/transport/api-v1.js";
import { correlationIdOf } from "../../src/transport/request-context.js";
import { RequestContextMissingError } from "../../src/shared/request-context.js";

const SENTINEL = "SENTINEL-CORRELATION-4d2b";

// A module-style function that never receives the request: it reads the context the way a service would.
async function serviceReadsContext(delayMs: number): Promise<{ requestId: string | undefined; correlationId: string | undefined }> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  const context = currentRequestContext();
  return { requestId: context?.requestId, correlationId: context?.correlationId };
}

const probe: RouteGroup = {
  name: "probe",
  prefix: "/probe",
  register: (api) => {
    api.get("/", async (request) => ({
      fromRequest: correlationIdOf(request),
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

function app(extra: { bodyLimitBytes?: number } = {}) {
  return buildHttpServer({ groups: [probe], ...extra });
}

const ACCEPTED = ["client-req-12345", "AbC.dEf_123-xyz", "12345678", "a".repeat(64), "A.b_c-D.e", "0.1.2.3.4.5"];

// ---------------------------------------------------------------------------------------------------------------
// Real sockets: the bytes of the request are written exactly as given, so repeated headers, control characters and
// non-ASCII bytes reach the HTTP parser the way a client could send them.

async function listen(server: FastifyInstance): Promise<number> {
  await server.listen({ host: "127.0.0.1", port: 0 });
  return (server.server.address() as AddressInfo).port;
}

interface RawResponse { readonly status: number; readonly headers: Record<string, string>; readonly head: string; readonly body: string }

function raw(port: number, headerLines: readonly string[], path = "/api/v1/probe", method = "GET"): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const socket = connect({ host: "127.0.0.1", port });
    const chunks: Buffer[] = [];
    socket.on("data", (c: Buffer) => chunks.push(c));
    socket.on("error", reject);
    socket.on("close", () => {
      const text = Buffer.concat(chunks).toString("latin1");
      const split = text.indexOf("\r\n\r\n");
      const head = text.slice(0, split);
      const lines = head.split("\r\n");
      const headers: Record<string, string> = {};
      for (const line of lines.slice(1)) {
        const i = line.indexOf(":");
        if (i > 0) headers[line.slice(0, i).toLowerCase()] = line.slice(i + 1).trim();
      }
      resolve({ status: Number(/^HTTP\/1\.1 (\d{3})/.exec(lines[0] ?? "")?.[1] ?? 0), headers, head, body: text.slice(split + 4) });
    });
    const request = [`${method} ${path} HTTP/1.1`, "Host: localhost", ...headerLines, "Connection: close", "", ""].join("\r\n");
    socket.write(Buffer.from(request, "latin1"));
  });
}

test("a valid client correlation ID is accepted and returned exactly as sent, over a real socket", async () => {
  const server = app();
  const port = await listen(server);
  for (const id of ACCEPTED) {
    const res = await raw(port, [`X-Correlation-ID: ${id}`]);
    assert.equal(res.status, 200, id);
    assert.equal(res.headers["x-correlation-id"], id, id);
    assert.match(String(res.headers["x-request-id"]), REQUEST_ID_PATTERN);
    assert.notEqual(res.headers["x-correlation-id"], res.headers["x-request-id"]);
  }
  await server.close();
});

test("the header name is case-insensitive and surrounding whitespace is not part of the value", async () => {
  const server = app();
  const port = await listen(server);
  assert.equal((await raw(port, ["x-CORRELATION-id: mixed-case-name"])).headers["x-correlation-id"], "mixed-case-name");
  assert.equal((await raw(port, ["X-Correlation-ID:    padded-id-123   "])).headers["x-correlation-id"], "padded-id-123");
  await server.close();
});

test("an invalid, empty or repeated client value is replaced by a generated one and the request is still served", async () => {
  const server = app();
  const port = await listen(server);
  const invalid: [string, readonly string[]][] = [
    ["7 characters", ["X-Correlation-ID: abcdefg"]],
    ["65 characters", [`X-Correlation-ID: ${"a".repeat(65)}`]],
    ["10 KB", [`X-Correlation-ID: ${"a".repeat(10_000)}`]],
    ["empty", ["X-Correlation-ID:"]],
    ["space inside", ["X-Correlation-ID: has space inside"]],
    ["slash", ["X-Correlation-ID: abc/def/ghi"]],
    ["colon", ["X-Correlation-ID: abc:def:ghi:j"]],
    ["markup", [`X-Correlation-ID: <script>${SENTINEL}</script>`]],
    ["percent-encoded CRLF", [`X-Correlation-ID: abc%0d%0aInjected-${SENTINEL}`]],
    ["quotes", ['X-Correlation-ID: "quoted-value-1"']],
    ["equals sign", ["X-Correlation-ID: abcdefgh="]],
    ["non-ASCII byte", ["X-Correlation-ID: abc\u00e9defgh"]],
    ["tab inside", ["X-Correlation-ID: abcd\tefgh"]],
    ["two valid headers (joined with a separator)", ["X-Correlation-ID: first-valid-id", "X-Correlation-ID: second-valid-id"]],
  ];
  for (const [name, lines] of invalid) {
    const res = await raw(port, lines);
    assert.equal(res.status, 200, `${name}: the request is not rejected`);
    const effective = String(res.headers["x-correlation-id"]);
    assert.match(effective, GENERATED_CORRELATION_ID_PATTERN, name);
    assert.ok(!res.head.includes(SENTINEL) && !res.body.includes(SENTINEL), `${name}: the supplied text is not echoed`);
  }
  await server.close();
});

test("an attempt to inject a header through the value does not reach the response", async () => {
  const server = app();
  const port = await listen(server);
  // The second line is parsed by the server as a separate request header, never as part of the identifier.
  const res = await raw(port, ["X-Correlation-ID: valid-id-12345", `Injected: ${SENTINEL}`]);
  assert.equal(res.headers["x-correlation-id"], "valid-id-12345");
  assert.ok(!res.head.toLowerCase().includes("injected"));
  assert.ok(!res.head.includes(SENTINEL));
  await server.close();
});

test("without a client value a generated cor-<uuid> is used, different for every request and different from the request ID", async () => {
  const a = app();
  const seen = new Set<string>();
  for (let i = 0; i < 50; i += 1) {
    const res = await a.inject({ method: "GET", url: "/api/v1/probe" });
    const id = String(res.headers["x-correlation-id"]);
    assert.match(id, GENERATED_CORRELATION_ID_PATTERN);
    assert.notEqual(id, res.headers["x-request-id"]);
    seen.add(id);
  }
  assert.equal(seen.size, 50);
  await a.close();
});

test("the client request ID is still ignored when it equals the correlation ID", async () => {
  const a = app();
  const res = await a.inject({ method: "GET", url: "/api/v1/probe", headers: { "x-request-id": "same-value-12345", "x-correlation-id": "same-value-12345" } });
  assert.equal(res.headers["x-correlation-id"], "same-value-12345");
  assert.match(String(res.headers["x-request-id"]), REQUEST_ID_PATTERN);
  await a.close();
});

test("the correlation ID is never part of a response body: the envelope is unchanged", async () => {
  const a = app();
  const withId = await a.inject({ method: "GET", url: "/api/v1/nothing", headers: { "x-correlation-id": `body-check-${SENTINEL}` } });
  const without = await a.inject({ method: "GET", url: "/api/v1/nothing" });
  assert.equal(withId.statusCode, 404);
  assert.ok(!withId.body.includes(SENTINEL));
  assert.deepEqual(Object.keys(withId.json()).sort(), Object.keys(without.json()).sort());
  assert.deepEqual(Object.keys(withId.json().error).sort(), Object.keys(without.json().error).sort());
  const ok = await a.inject({ method: "GET", url: "/api/v1/probe", headers: { "x-correlation-id": `body-check-${SENTINEL}` } });
  assert.ok(!ok.body.replace(/"fromRequest":"[^"]*"/, "").replace(/"correlationId":"[^"]*"/, "").includes(SENTINEL));
  await a.close();
});

test("every kind of response carries the effective correlation ID, a client one or a generated one", async () => {
  const a = app({ bodyLimitBytes: 64 });
  const json = { "content-type": "application/json" };
  const cases = [
    { method: "GET", url: "/api/v1/probe", status: 200 },
    { method: "GET", url: "/api/v1/nothing", status: 404 },
    { method: "GET", url: "/api/v1/probe/", status: 404 },
    { method: "DELETE", url: "/api/v1/probe", status: 405 },
    { method: "POST", url: "/api/v1/probe/validated", status: 400, headers: json, payload: { n: "x" } },
    { method: "POST", url: "/api/v1/probe/validated", status: 400, headers: json, payload: "{bad" },
    { method: "POST", url: "/api/v1/probe/validated", status: 413, headers: json, payload: JSON.stringify({ n: 1, pad: "x".repeat(200) }) },
    { method: "POST", url: "/api/v1/probe/validated", status: 415, headers: { "content-type": "application/xml" }, payload: "<a/>" },
    { method: "GET", url: "/api/v1/probe/boom", status: 500 },
    { method: "GET", url: "/api/v1/%", status: 400 },
    { method: "GET", url: "/health/live", status: 200 },
    { method: "HEAD", url: "/health/live", status: 200 },
    { method: "GET", url: "/health/ready", status: 200 },
    { method: "HEAD", url: "/health/ready", status: 200 },
    { method: "POST", url: "/health/ready", status: 405 },
  ] as const;
  for (const c of cases) {
    const supplied = `client-${c.method}-${cases.indexOf(c)}-ok`;
    const withClient = await a.inject({ ...c, headers: { ...("headers" in c ? c.headers : {}), "x-correlation-id": supplied } });
    assert.equal(withClient.statusCode, c.status, `${c.method} ${c.url}`);
    assert.equal(withClient.headers["x-correlation-id"], supplied, `${c.method} ${c.url} returns the client value`);
    const without = await a.inject(c);
    assert.match(String(without.headers["x-correlation-id"]), GENERATED_CORRELATION_ID_PATTERN, `${c.method} ${c.url} generates one`);
  }
  await a.close();
});

test("a draining readiness 503 carries the correlation ID too", async () => {
  const state = createReadinessState();
  state.beginDraining();
  const a = buildHttpServer({ readiness: { state } });
  const res = await a.inject({ method: "GET", url: "/health/ready", headers: { "x-correlation-id": "drain-check-001" } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers["x-correlation-id"], "drain-check-001");
  await a.close();
});

test("two simultaneous requests with the same valid correlation ID keep separate request contexts", async () => {
  const a = app();
  const [first, second] = await Promise.all([
    a.inject({ method: "GET", url: "/api/v1/probe?d=30", headers: { "x-correlation-id": "shared-flow-001" } }),
    a.inject({ method: "GET", url: "/api/v1/probe?d=5", headers: { "x-correlation-id": "shared-flow-001" } }),
  ]);
  for (const res of [first, second]) {
    assert.equal(res.headers["x-correlation-id"], "shared-flow-001");
    assert.equal(res.json().fromRequest, "shared-flow-001");
    assert.equal(res.json().fromService.correlationId, "shared-flow-001");
    assert.equal(res.json().fromService.requestId, res.headers["x-request-id"], "each request sees only its own request ID");
  }
  assert.notEqual(first.headers["x-request-id"], second.headers["x-request-id"]);
  await a.close();
});

test("concurrent requests are isolated: each sees only its own correlation ID across awaits", async () => {
  const a = app();
  const responses = await Promise.all(
    Array.from({ length: 40 }, (_, i) => a.inject({
      method: "GET",
      url: `/api/v1/probe?d=${(40 - i) % 9}`,
      headers: i % 2 === 0 ? { "x-correlation-id": `client-flow-${String(i).padStart(3, "0")}` } : {},
    })),
  );
  responses.forEach((res, i) => {
    const id = String(res.headers["x-correlation-id"]);
    if (i % 2 === 0) assert.equal(id, `client-flow-${String(i).padStart(3, "0")}`);
    else assert.match(id, GENERATED_CORRELATION_ID_PATTERN);
    assert.equal(res.json().fromService.correlationId, id);
    assert.equal(res.json().fromRequest, id);
    assert.equal(res.json().fromService.requestId, res.headers["x-request-id"]);
  });
  await a.close();
});

test("the correlation ID of a request is available to code that is not given the request, and no context remains afterwards", async () => {
  const a = app();
  const res = await a.inject({ method: "GET", url: "/api/v1/probe?d=5", headers: { "x-correlation-id": "service-reads-01" } });
  assert.equal(res.json().fromService.correlationId, "service-reads-01");
  assert.equal(currentRequestContext(), undefined);
  await a.close();
});

test("correlationIdOf throws when no context was created", () => {
  const request = { requestContext: null } as unknown as Parameters<typeof correlationIdOf>[0];
  assert.throws(() => correlationIdOf(request), RequestContextMissingError);
});

test("the accepted pattern is exactly 8 to 64 of A-Z a-z 0-9 . _ -", () => {
  assert.ok(CLIENT_CORRELATION_ID_PATTERN.test("a".repeat(8)));
  assert.ok(CLIENT_CORRELATION_ID_PATTERN.test("a".repeat(64)));
  for (const bad of ["a".repeat(7), "a".repeat(65), "", "abcdefg\n", "abcdefgh\n", " abcdefgh", "abcdefgh ", "abcdefg\u00e9", "abcdefg\u0661", "abcdefg+", "abcdefg~", "abcdefg\0"]) {
    assert.ok(!CLIENT_CORRELATION_ID_PATTERN.test(bad), JSON.stringify(bad));
  }
});
