//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/shared/request-context.ts
// Description : Defines the request context, creates a server-generated request ID and carries the context through async calls
//
// Component   : Control Plane
// Module      : Request Context
// Layer       : Service
//
// Requirements: KR-BE-1-005, B-INC-001-AC-07
// API         : createRequestContext, runWithRequestContext, currentRequestContext, requireRequestContext
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

// Shared kernel and shared infrastructure (KR-BE-1-002 Sections 5.2 and 5.5): request-context types with no
// domain meaning, no framework import and no dependency on any module. Any module may use them.
//
// This task covers the request ID only. Correlation (KR-BE-1-008), the authenticated principal and the tenant
// are added to the context by later tasks, once the identity decisions exist.

export interface RequestContext {
  // Server-generated, opaque and unique. It never comes from the client and encodes no user data.
  readonly requestId: string;
}

export const REQUEST_ID_PATTERN = /^req-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export class RequestContextMissingError extends Error {
  constructor() {
    super("No request context is active.");
    this.name = "RequestContextMissingError";
  }
}

const storage = new AsyncLocalStorage<RequestContext>();

export function createRequestContext(): RequestContext {
  return Object.freeze({ requestId: `req-${randomUUID()}` });
}

// Runs fn, and everything it starts asynchronously, with this context. Each request gets its own context, so
// concurrent requests never see each other's.
export function runWithRequestContext<T>(context: RequestContext, fn: () => T): T {
  return storage.run(context, fn);
}

export function currentRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function requireRequestContext(): RequestContext {
  const context = storage.getStore();
  if (!context) throw new RequestContextMissingError();
  return context;
}
