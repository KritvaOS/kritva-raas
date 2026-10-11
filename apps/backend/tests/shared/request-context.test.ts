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
  REQUEST_ID_PATTERN,
  RequestContextMissingError,
  createRequestContext,
  currentRequestContext,
  requireRequestContext,
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
