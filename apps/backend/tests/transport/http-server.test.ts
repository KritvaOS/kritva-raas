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
import { successBody } from "../../src/transport/response-contract.js";
import { requestIdOf } from "../../src/transport/request-context.js";
import { REQUEST_ID_PATTERN } from "../../src/shared/request-context.js";

// Test-only routes. The production server mounts no domain route in this task.
function testApp(bodyLimitBytes?: number) {
  return buildHttpServer({
    ...(bodyLimitBytes === undefined ? {} : { bodyLimitBytes }),
    groups: [{ name: "widgets", prefix: "/widgets", register: (api) => {
      api.get("/:id", async (request) => successBody({ status: "SUCCESS", code: "WIDGET_RETRIEVED", message: "Widget retrieved" }, { ok: true }, requestIdOf(request)));
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
        async (request, reply) => reply.code(201).send(successBody({ status: "SUCCESS", code: "WIDGET_CREATED", message: "Widget created" }, { name: request.body.name }, requestIdOf(request))),
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
  const body = res.json();
  assert.deepEqual(body.data, { name: "a" });
  assert.equal(body.status, "SUCCESS");
  assert.equal(body.error, null);
  assert.equal(body.request_id, res.headers["x-request-id"]);
  await app.close();
});

test("a route is not served without the /api/v1 prefix", async () => {
  const app = testApp();
  const res = await app.inject({ method: "GET", url: "/widgets/1" });
  assert.equal(res.statusCode, 404);
  assert.equal(res.json().code, "RESOURCE_NOT_FOUND");
  await app.close();
});

test("an unknown route returns the documented 404 body", async () => {
  const app = testApp();
  const res = await app.inject({ method: "GET", url: "/api/v1/nothing" });
  assert.equal(res.statusCode, 404);
  const body = res.json() as { request_id: string; timestamp: string };
  assert.match(body.request_id, REQUEST_ID_PATTERN);
  assert.equal(body.request_id, res.headers["x-request-id"]);
  assert.deepEqual({ ...body, timestamp: "T" }, {
    protocol_version: "1.0",
    request_id: body.request_id,
    timestamp: "T",
    status: "NOT_FOUND",
    code: "RESOURCE_NOT_FOUND",
    message: "The requested resource was not found.",
    data: null,
    error: { details: {}, retryable: false, field_errors: [] },
  });
  await app.close();
});

test("an unsupported method on a known path returns 405 with an Allow header", async () => {
  const app = testApp();
  const res = await app.inject({ method: "DELETE", url: "/api/v1/widgets/7?x=1" });
  assert.equal(res.statusCode, 405);
  assert.equal(res.json().code, "METHOD_NOT_ALLOWED");
  assert.match(String(res.headers["allow"]), /GET/);
  await app.close();
});

test("a missing field returns 400 INVALID_REQUEST with a MISSING_REQUIRED_FIELD entry", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a" } });
  assert.equal(res.statusCode, 400);
  const body = res.json();
  assert.equal(body.code, "INVALID_REQUEST");
  assert.equal(body.status, "INVALID_REQUEST");
  assert.equal(body.error.retryable, false);
  assert.deepEqual(body.error.field_errors, [{ field: "quantity", code: "MISSING_REQUIRED_FIELD", message: "A required field is missing." }]);
  await app.close();
});

test("an invalid value is reported without echoing the submitted value", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: { name: "a", quantity: "SUBMITTED-VALUE-123" } });
  assert.equal(res.statusCode, 400);
  assert.equal(res.json().error.field_errors[0].field, "quantity");
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

test("malformed JSON returns 400 INVALID_REQUEST", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: "{not json" });
  assert.equal(res.statusCode, 400);
  assert.equal(res.json().code, "INVALID_REQUEST");
  await app.close();
});

test("an unsupported content type returns 415", async () => {
  const app = testApp();
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: { "content-type": "application/xml" }, payload: "<a/>" });
  assert.equal(res.statusCode, 415);
  assert.equal(res.json().code, "UNSUPPORTED_CONTENT_TYPE");
  await app.close();
});

test("a body over the limit returns 413", async () => {
  const app = testApp(64);
  const res = await app.inject({ method: "POST", url: "/api/v1/widgets", headers: json, payload: JSON.stringify({ name: "x".repeat(200), quantity: 1 }) });
  assert.equal(res.statusCode, 413);
  assert.equal(res.json().code, "PAYLOAD_TOO_LARGE");
  await app.close();
});

test("an unexpected failure returns 500 INTERNAL_ERROR and leaks no internal detail", async () => {
  const app = testApp();
  const res = await app.inject({ method: "GET", url: "/api/v1/boom" });
  assert.equal(res.statusCode, 500);
  assert.equal(res.json().code, "INTERNAL_ERROR");
  assert.ok(!res.body.includes("secret-internal-detail"));
  await app.close();
});

test("a server built without routes answers 404 for every path", async () => {
  const app = buildHttpServer();
  const res = await app.inject({ method: "GET", url: "/api/v1/anything" });
  assert.equal(res.statusCode, 404);
  await app.close();
});
