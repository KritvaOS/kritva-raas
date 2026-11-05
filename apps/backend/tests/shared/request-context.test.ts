//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/shared/request-context.test.ts
// Description : Unit tests of the request context: ID format, uniqueness, propagation through async calls and isolation
//
// Component   : Control Plane
// Module      : Request Context Test
// Layer       : Service
//
// Requirements: KR-BE-1-005, BTS-005
// API         : No callable API; tests of the request context
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CLIENT_CORRELATION_ID_PATTERN,
  GENERATED_CORRELATION_ID_PATTERN,
  REQUEST_ID_PATTERN,
  RequestContextMissingError,
  createRequestContext,
  currentRequestContext,
  requireRequestContext,
  resolveCorrelationId,
  runWithRequestContext,
} from "../../src/shared/request-context.js";

test("a request ID has the documented opaque form and is not derived from input", () => {
  const { requestId } = createRequestContext();
  assert.match(requestId, REQUEST_ID_PATTERN);
});

test("request IDs are unique", () => {
  const ids = new Set(Array.from({ length: 5000 }, () => createRequestContext().requestId));
  assert.equal(ids.size, 5000);
});

test("a context is frozen", () => {
  const context = createRequestContext();
  assert.ok(Object.isFrozen(context));
});

test("there is no context outside a run, and requiring one fails with a clear error", () => {
  assert.equal(currentRequestContext(), undefined);
  assert.throws(() => requireRequestContext(), RequestContextMissingError);
});

test("the context reaches code that is called later, across awaits and timers", async () => {
  const context = createRequestContext();
  const seen = await runWithRequestContext(context, async () => {
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 5));
    return [currentRequestContext(), await new Promise<typeof context | undefined>((r) => setImmediate(() => r(currentRequestContext())))];
  });
  assert.equal(seen[0], context);
  assert.equal(seen[1], context);
  assert.equal(currentRequestContext(), undefined);
});

test("concurrent runs each see only their own context", async () => {
  const results = await Promise.all(
    Array.from({ length: 50 }, (_, i) => {
      const context = createRequestContext();
      return runWithRequestContext(context, async () => {
        await new Promise((resolve) => setTimeout(resolve, (50 - i) % 7));
        return { expected: context.requestId, actual: requireRequestContext().requestId };
      });
    }),
  );
  for (const r of results) assert.equal(r.actual, r.expected);
});

test("a nested run uses the inner context and restores the outer one", () => {
  const outer = createRequestContext();
  const inner = createRequestContext();
  runWithRequestContext(outer, () => {
    runWithRequestContext(inner, () => assert.equal(currentRequestContext(), inner));
    assert.equal(currentRequestContext(), outer);
  });
});

test("a context has a request ID and a different correlation ID, and neither is derived from the other", () => {
  const context = createRequestContext();
  assert.match(context.requestId, REQUEST_ID_PATTERN);
  assert.match(context.correlationId, GENERATED_CORRELATION_ID_PATTERN);
  assert.notEqual(context.requestId, context.correlationId);
  assert.notEqual(context.requestId.slice(4), context.correlationId.slice(4), "independent random values");
});

test("generated correlation IDs are unique", () => {
  const ids = new Set(Array.from({ length: 5000 }, () => createRequestContext().correlationId));
  assert.equal(ids.size, 5000);
});

test("a valid client correlation ID is used exactly as sent, with its case preserved", () => {
  for (const id of ["client-req-12345", "AbC.dEf_123-xyz", "a".repeat(8), "Z".repeat(64)]) {
    assert.equal(createRequestContext(id).correlationId, id);
    assert.equal(resolveCorrelationId(id), id);
  }
  assert.ok(Object.isFrozen(createRequestContext("client-req-12345")));
});

test("anything that is not exactly one valid string is replaced, never used", () => {
  const replaced: unknown[] = [undefined, null, "", "short", "a".repeat(65), "has space", "abc/defgh", "abcdefgh\n", "abcdefg\u00e9",
    "abcdefg\u0661", ["client-req-12345"], ["a", "b"], 12345678, {}, true, "first-valid-id, second-valid-id"];
  for (const value of replaced) {
    const id = resolveCorrelationId(value);
    assert.match(id, GENERATED_CORRELATION_ID_PATTERN, JSON.stringify(value));
    assert.ok(!CLIENT_CORRELATION_ID_PATTERN.test(id) || id.startsWith("cor-"));
  }
});
