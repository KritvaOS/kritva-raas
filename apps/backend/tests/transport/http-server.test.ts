//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/http-server.test.ts
// Description : Route, error contract and validation tests that use app.inject and open no port
//
// Component   : Control Plane
// Module      : HTTP Transport Test
// Layer       : API
//
// Requirements: KR-BE-1-004, BTS-007, BTS-032
// API         : No callable API; tests of the HTTP transport
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildHttpServer } from "../../src/transport/http-server.js";

// Test-only routes. The production server mounts no domain route in this task.
function testApp(bodyLimitBytes?: number) {
  return buildHttpServer({
    ...(bodyLimitBytes === undefined ? {} : { bodyLimitBytes }),
    groups: [{ name: "widgets", prefix: "/widgets", register: (api) => {
      api.get("/:id", async () => ({ ok: true }));
      api.post<{ Body: { name: string; quantity: number } }>(
        "/",
        {
          schema: {
            body: {
              type: "object",
              required: ["name", "quantity"],
              additionalProperties: false,
              properties: { name: { type: "string", minLength: 1 }, quantity: { type: "integer", minimum: 1 } },
            },
          },
        },
        async (request, reply) => reply.code(201).send({ data: { name: request.body.name } }),
      );
    } }, { name: "boom", prefix: "/boom", register: (api) => {
      api.get("/", async () => { throw new Error("secret-internal-detail"); });
    } }],
  });
}

const json = { "content-type": "application/json" };

test("a valid request on an API v1 route succeeds", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a", quantity: 2 } });
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.json(), { data: { name: "a" } });
  await app.close();
});

test("a route is not served without the /api/v1 prefix", async () => {
  const app = testApp();
  const res = await app.inject({ method: "GET", url: "/widgets/1" });
  assert.equal(res.statusCode, 404);
  assert.equal(res.json().error.code, "RESOURCE_NOT_FOUND");
  await app.close();
});

test("an unknown route returns the documented 404 body", async () => {
  const app = testApp();
  const res = await app.inject({ method: "GET", url: "/api/v1/nothing" });
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.json(), {
    error: { code: "RESOURCE_NOT_FOUND", message: "The requested resource was not found.", retryable: false, request_id: null, correlation_id: null, details: [] },
  });
  await app.close();
});

test("an unsupported method on a known path returns 405 with an Allow header", async () => {
  const app = testApp();
  const res = await app.inject({ method: "DELETE", url: "/api/v1/widgets/7?x=1" });
  assert.equal(res.statusCode, 405);
  assert.equal(res.json().error.code, "METHOD_NOT_ALLOWED");
  assert.match(String(res.headers["allow"]), /GET/);
  await app.close();
});

test("a missing field returns 400 VALIDATION_ERROR naming the field", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a" } });
  assert.equal(res.statusCode, 400);
  const body = res.json();
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(body.error.retryable, false);
  assert.deepEqual(body.error.details, [{ field: "quantity", code: "REQUIRED_FIELD", message: "The field is required." }]);
  await app.close();
});

test("an invalid value is reported without echoing the submitted value", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a", quantity: "SUBMITTED-VALUE-123" } });
  assert.equal(res.statusCode, 400);
  assert.equal(res.json().error.details[0].field, "quantity");
  assert.ok(!res.body.includes("SUBMITTED-VALUE-123"));
  await app.close();
});

test("validation does not coerce types or remove unknown fields", async () => {
  const app = testApp();
  const coerced = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a", quantity: "2" } });
  assert.equal(coerced.statusCode, 400);
  const extra = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a", quantity: 2, admin: true } });
  assert.equal(extra.statusCode, 400);
  await app.close();
});

test("malformed JSON returns 400 INVALID_JSON", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: "{not json" });
  assert.equal(res.statusCode, 400);
  assert.equal(res.json().error.code, "INVALID_JSON");
  await app.close();
});

test("an unsupported content type returns 415", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: { "content-type": "application/xml" }, payload: "<a/>" });
  assert.equal(res.statusCode, 415);
  assert.equal(res.json().error.code, "UNSUPPORTED_MEDIA_TYPE");
  await app.close();
});

test("a body over the limit returns 413", async () => {
  const app = testApp(64);
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: JSON.stringify({ name: "x".repeat(200), quantity: 1 }) });
  assert.equal(res.statusCode, 413);
  assert.equal(res.json().error.code, "PAYLOAD_TOO_LARGE");
  await app.close();
});

test("an unexpected failure returns 500 INTERNAL_ERROR and leaks no internal detail", async () => {
  const app = testApp();
  const res = await app.inject({ method: "GET", url: "/api/v1/boom" });
  assert.equal(res.statusCode, 500);
  assert.equal(res.json().error.code, "INTERNAL_ERROR");
  assert.ok(!res.body.includes("secret-internal-detail"));
  await app.close();
});

test("a server built without routes answers 404 for every path", async () => {
  const app = buildHttpServer();
  const res = await app.inject({ method: "GET", url: "/api/v1/anything" });
  assert.equal(res.statusCode, 404);
  await app.close();
});
