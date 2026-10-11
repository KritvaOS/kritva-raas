//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/response-contract.test.ts
// Description : Tests that every REST API v1 response with a body uses the full response envelope
//
// Component   : Control Plane
// Module      : HTTP Transport Test
// Layer       : API
//
// Requirements: KR-BE-1-007, BTS-007, BTS-032
// API         : Component tests with app.inject; they open no port and are not the BTS-032 integration evidence
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import type { InjectOptions } from "fastify";
import { REQUEST_ID_PATTERN } from "../../src/shared/request-context.js";
import { buildHttpServer, handleFrameworkError } from "../../src/transport/http-server.js";
import { ensureRequestId, requestIdOf } from "../../src/transport/request-context.js";
import { RequestContextMissingError } from "../../src/shared/request-context.js";
import { classifyError, ERRORS } from "../../src/transport/error-contract.js";
import { PROTOCOL_VERSION, responseTimestamp, successBody } from "../../src/transport/response-contract.js";

const ENVELOPE_KEYS = ["code", "data", "error", "message", "protocol_version", "request_id", "status", "timestamp"];
const json = { "content-type": "application/json" };

function app(bodyLimitBytes?: number) {
  return buildHttpServer({
    ...(bodyLimitBytes === undefined ? {} : { bodyLimitBytes }),
    groups: [{ name: "things", prefix: "/things", register: (api) => {
      api.get("/", async (request) => successBody(
        { status: "SUCCESS", code: "THINGS_LISTED", message: "Things listed" },
        { items: [{ id: "t1" }], page: { limit: 50, has_more: false, next_cursor: null } },
        requestIdOf(request),
      ));
      api.post("/jobs", async (request, reply) => reply.code(202).send(successBody(
        { status: "ACCEPTED", code: "JOB_ACCEPTED", message: "Job accepted" }, { job_id: "j1" }, requestIdOf(request),
      )));
      api.delete("/:id", async (_request, reply) => reply.code(204).send());
      api.post<{ Body: { n: number } }>("/checked", {
        schema: { body: { type: "object", required: ["n"], additionalProperties: false, properties: { n: { type: "integer" } } } },
      }, async (request) => successBody({ status: "SUCCESS", code: "OK", message: "ok" }, { n: request.body.n }, requestIdOf(request)));
      api.get("/status/:code", async (request) => {
        const statusCode = Number((request.params as { code: string }).code);
        throw Object.assign(new Error("FRAMEWORK-DETAIL-TEXT"), { statusCode });
      });
      api.get("/boom", async () => { throw new Error("INTERNAL-SECRET-TEXT at /srv/app/secret.ts:1"); });
    } }],
  });
}

interface Envelope {
  protocol_version: string; request_id: string; timestamp: string; status: string; code: string; message: string;
  data: unknown; error: { details: unknown; retryable: boolean; field_errors: unknown[] } | null;
}

function assertEnvelope(res: { json(): unknown; headers: Record<string, unknown> }): Envelope {
  const body = res.json() as Envelope;
  assert.deepEqual(Object.keys(body).sort(), ENVELOPE_KEYS);
  assert.equal(body.protocol_version, PROTOCOL_VERSION);
  assert.match(body.request_id, REQUEST_ID_PATTERN);
  assert.equal(body.request_id, res.headers["x-request-id"]);
  assert.match(body.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.equal(typeof body.message, "string");
  return body;
}

test("every error response is the full envelope with the registry status and code", async () => {
  const a = app(64);
  const cases: { name: string; req: InjectOptions; http: number; status: string; code: string; retryable: boolean }[] = [
    { name: "unknown path", req: { method: "GET", url: "/api/v1/nothing" }, http: 404, status: "NOT_FOUND", code: "RESOURCE_NOT_FOUND", retryable: false },
    { name: "trailing slash", req: { method: "GET", url: "/api/v1/things/" }, http: 404, status: "NOT_FOUND", code: "RESOURCE_NOT_FOUND", retryable: false },
    { name: "method not allowed", req: { method: "PUT", url: "/api/v1/things" }, http: 405, status: "INVALID_REQUEST", code: "METHOD_NOT_ALLOWED", retryable: false },
    { name: "validation", req: { method: "POST", url: "/api/v1/things/checked", headers: json, payload: {} }, http: 400, status: "INVALID_REQUEST", code: "INVALID_REQUEST", retryable: false },
    { name: "malformed JSON", req: { method: "POST", url: "/api/v1/things/checked", headers: json, payload: "{bad" }, http: 400, status: "INVALID_REQUEST", code: "INVALID_REQUEST", retryable: false },
    { name: "media type", req: { method: "POST", url: "/api/v1/things/checked", headers: { "content-type": "application/xml" }, payload: "<a/>" }, http: 415, status: "INVALID_REQUEST", code: "UNSUPPORTED_CONTENT_TYPE", retryable: false },
    { name: "too large", req: { method: "POST", url: "/api/v1/things/checked", headers: json, payload: JSON.stringify({ n: 1, pad: "x".repeat(200) }) }, http: 413, status: "REJECTED", code: "PAYLOAD_TOO_LARGE", retryable: false },
    { name: "unexpected", req: { method: "GET", url: "/api/v1/things/boom" }, http: 500, status: "FAILED", code: "INTERNAL_ERROR", retryable: true },
  ];
  for (const c of cases) {
    const res = await a.inject(c.req);
    assert.equal(res.statusCode, c.http, c.name);
    assert.match(String(res.headers["content-type"]), /^application\/json/, c.name);
    const body = assertEnvelope(res);
    assert.equal(body.status, c.status, c.name);
    assert.equal(body.code, c.code, c.name);
    assert.equal(body.data, null, c.name);
    assert.ok(body.error, c.name);
    assert.deepEqual(Object.keys(body.error).sort(), ["details", "field_errors", "retryable"], c.name);
    assert.deepEqual(body.error.details, {}, c.name);
    assert.equal(body.error.retryable, c.retryable, c.name);
    assert.ok(Array.isArray(body.error.field_errors), c.name);
  }
  await a.close();
});

test("a 405 response lists the allowed methods", async () => {
  const a = app();
  const res = await a.inject({ method: "PUT", url: "/api/v1/things" });
  assert.equal(res.headers["allow"], "GET, HEAD");
  await a.close();
});

test("validation errors name the field and use the registry field codes without echoing values", async () => {
  const a = app();
  const missing = assertEnvelope(await a.inject({ method: "POST", url: "/api/v1/things/checked", headers: json, payload: {} }));
  assert.deepEqual(missing.error?.field_errors, [{ field: "n", code: "MISSING_REQUIRED_FIELD", message: "A required field is missing." }]);
  const res = await a.inject({ method: "POST", url: "/api/v1/things/checked", headers: json, payload: { n: "SUBMITTED-VALUE-9" } });
  const invalid = assertEnvelope(res);
  assert.deepEqual(invalid.error?.field_errors, [{ field: "n", code: "FIELD_INVALID", message: "One or more fields contain invalid values." }]);
  assert.ok(!res.body.includes("SUBMITTED-VALUE-9"));
  await a.close();
});

test("an unexpected failure leaks no exception text, path or stack", async () => {
  const a = app();
  const res = await a.inject({ method: "GET", url: "/api/v1/things/boom" });
  assertEnvelope(res);
  for (const leak of ["INTERNAL-SECRET-TEXT", "secret.ts", "/srv/app", "stack", "Error:"]) assert.ok(!res.body.includes(leak), leak);
  await a.close();
});

test("a success response is the full envelope with data and a null error", async () => {
  const a = app();
  const res = await a.inject({ method: "GET", url: "/api/v1/things" });
  assert.equal(res.statusCode, 200);
  const body = assertEnvelope(res);
  assert.equal(body.status, "SUCCESS");
  assert.equal(body.code, "THINGS_LISTED");
  assert.equal(body.error, null);
  assert.deepEqual(body.data, { items: [{ id: "t1" }], page: { limit: 50, has_more: false, next_cursor: null } });
  await a.close();
});

test("an accepted operation carries status ACCEPTED with HTTP 202", async () => {
  const a = app();
  const res = await a.inject({ method: "POST", url: "/api/v1/things/jobs" });
  assert.equal(res.statusCode, 202);
  assert.equal(assertEnvelope(res).status, "ACCEPTED");
  await a.close();
});

test("a 204 response has no body but still carries X-Request-ID", async () => {
  const a = app();
  const res = await a.inject({ method: "DELETE", url: "/api/v1/things/t1" });
  assert.equal(res.statusCode, 204);
  assert.equal(res.body, "");
  assert.match(String(res.headers["x-request-id"]), REQUEST_ID_PATTERN);
  await a.close();
});

test("a client-supplied request ID never appears in the body", async () => {
  const a = app();
  const res = await a.inject({ method: "GET", url: "/api/v1/nothing", headers: { "x-request-id": "attacker-chosen-id", "x-correlation-id": "corr-1" } });
  const body = assertEnvelope(res);
  assert.notEqual(body.request_id, "attacker-chosen-id");
  assert.ok(!res.body.includes("attacker-chosen-id") && !res.body.includes("corr-1"));
  await a.close();
});

test("the timestamp is UTC with whole seconds", () => {
  assert.equal(responseTimestamp(new Date("2026-10-11T00:00:01.987Z")), "2026-10-11T00:00:01Z");
  const body = successBody({ status: "SUCCESS", code: "X", message: "m" }, { a: 1 }, "req-1", new Date("2026-10-11T12:30:45.001Z"));
  assert.equal(body.timestamp, "2026-10-11T12:30:45Z");
});

test("transport errors map to registry codes and an undefined status is not relabeled as bad input", () => {
  assert.equal(classifyError({ code: "FST_ERR_CTP_BODY_TOO_LARGE" }).spec, ERRORS.payloadTooLarge);
  assert.equal(classifyError({ code: "FST_ERR_CTP_INVALID_MEDIA_TYPE" }).spec, ERRORS.unsupportedMediaType);
  assert.equal(classifyError({ statusCode: 400 }).spec, ERRORS.validation);
  assert.equal(classifyError({ statusCode: 401 }).spec, ERRORS.unauthorized);
  assert.equal(classifyError({ statusCode: 403 }).spec, ERRORS.forbidden);
  assert.equal(classifyError({ statusCode: 404 }).spec, ERRORS.notFound);
  assert.equal(classifyError({ statusCode: 429 }).spec, ERRORS.rateLimited);
  for (const statusCode of [408, 409, 412, 422, 431]) assert.equal(classifyError({ statusCode }).spec, ERRORS.internal, String(statusCode));
  assert.equal(classifyError(new Error("x")).spec, ERRORS.internal);
  assert.equal(classifyError(null).spec, ERRORS.internal);
});

test("HTTP status, envelope status and code agree for framework-raised statuses", async () => {
  const a = app();
  const expected: Record<number, [number, string, string]> = {
    400: [400, "INVALID_REQUEST", "INVALID_REQUEST"],
    401: [401, "UNAUTHORIZED", "AUTH_REQUIRED"],
    403: [403, "FORBIDDEN", "AUTHZ_DENIED"],
    404: [404, "NOT_FOUND", "RESOURCE_NOT_FOUND"],
    429: [429, "UNAVAILABLE", "RATE_LIMIT_EXCEEDED"],
    409: [500, "FAILED", "INTERNAL_ERROR"],
    422: [500, "FAILED", "INTERNAL_ERROR"],
  };
  for (const [code, [http, status, errCode]] of Object.entries(expected)) {
    const res = await a.inject({ method: "GET", url: `/api/v1/things/status/${code}` });
    assert.equal(res.statusCode, http, code);
    const body = assertEnvelope(res);
    assert.equal(body.status, status, code);
    assert.equal(body.code, errCode, code);
    assert.ok(!res.body.includes("FRAMEWORK-DETAIL-TEXT"), code);
  }
  await a.close();
});

test("an invalid URL, raised by the router before any hook, still returns the envelope and X-Request-ID", async () => {
  const a = app();
  for (const url of ["/api/v1/%", "/api/v1/things/%zz"]) {
    const res = await a.inject({ method: "GET", url });
    assert.equal(res.statusCode, 400, url);
    const body = assertEnvelope(res);
    assert.equal(body.status, "INVALID_REQUEST");
    assert.equal(body.code, "INVALID_REQUEST");
    assert.ok(!res.body.includes("%zz") && !res.body.includes("not a valid url"), url);
  }
  await a.close();
});

test("ensureRequestId attaches one ID to the request and the header and returns it again", () => {
  const headers: Record<string, string> = {};
  const request = { requestContext: null } as unknown as Parameters<typeof ensureRequestId>[0];
  const reply = { header: (name: string, value: string) => { headers[name] = value; return reply; } } as unknown as Parameters<typeof ensureRequestId>[1];
  const id = ensureRequestId(request, reply);
  assert.match(id, REQUEST_ID_PATTERN);
  assert.equal(headers["x-request-id"], id);
  assert.equal(request.requestContext?.requestId, id);
  assert.equal(ensureRequestId(request, reply), id);
  assert.equal(Object.keys(headers).length, 1);
});

test("requestIdOf throws when no context was created", () => {
  const request = { requestContext: null } as unknown as Parameters<typeof requestIdOf>[0];
  assert.throws(() => requestIdOf(request), RequestContextMissingError);
});

test("a framework error is classified, not always reported as 400", () => {
  function run(error: unknown) {
    const sent: { status: number; body: Record<string, unknown> } = { status: 0, body: {} };
    const headers: Record<string, string> = {};
    const reply = {
      code(n: number) { sent.status = n; return reply; },
      header(name: string, value: string) { headers[name] = value; return reply; },
      send(body: Record<string, unknown>) { sent.body = body; return reply; },
    };
    const request = {} as unknown as Parameters<typeof handleFrameworkError>[1];
    handleFrameworkError(error, request, reply as unknown as Parameters<typeof handleFrameworkError>[2]);
    return { ...sent, headers };
  }
  const badUrl = run(Object.assign(new Error("'/x%zz' is not a valid url component"), { code: "FST_ERR_BAD_URL", statusCode: 400 }));
  assert.equal(badUrl.status, 400);
  assert.equal(badUrl.body["code"], "INVALID_REQUEST");
  assert.equal(badUrl.body["request_id"], badUrl.headers["x-request-id"]);
  assert.match(String(badUrl.body["request_id"]), REQUEST_ID_PATTERN);
  const other = run(Object.assign(new Error("FRAMEWORK-INTERNAL-TEXT"), { code: "FST_ERR_ASYNC_CONSTRAINT", statusCode: 500 }));
  assert.equal(other.status, 500);
  assert.equal(other.body["code"], "INTERNAL_ERROR");
  assert.equal(other.body["status"], "FAILED");
  assert.ok(!JSON.stringify(other.body).includes("FRAMEWORK-INTERNAL-TEXT"));
  const unmapped = run(Object.assign(new Error("x"), { statusCode: 409 }));
  assert.equal(unmapped.status, 500);
  assert.equal(unmapped.body["code"], "INTERNAL_ERROR");
  assert.equal(unmapped.headers["x-request-id"], unmapped.body["request_id"]);
});
