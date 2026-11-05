//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/request-context.ts
// Description : Creates a request context for every request, runs the request inside it and returns the request ID header
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-005, KR-BE-1-008, B-INC-001-AC-07
// API         : registerRequestContext(app); X-Request-ID response header
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createRequestContext, RequestContextMissingError, runWithRequestContext, type RequestContext } from "../shared/request-context.js";

declare module "fastify" {
  interface FastifyRequest {
    requestContext: RequestContext | null;
  }
}

export const REQUEST_ID_HEADER = "x-request-id";
export const CORRELATION_ID_HEADER = "x-correlation-id";

// Policy (API_CONTRACT.md Sections 12 and 13, decisions/KR-BE-1-007-response-contract.md and
// decisions/KR-BE-1-008-correlation-policy.md): the server always generates the request ID. A client-supplied
// X-Request-ID is ignored and never echoed, because an accepted value could carry misleading or injected content
// into later logs. A client X-Correlation-ID is accepted only if it has 8 to 64 characters from A-Z a-z 0-9 . _ -;
// anything else (absent, empty, invalid, repeated) is replaced by a generated cor-<uuid> and the request is served
// normally. The effective value is returned in the X-Correlation-ID response header and never in a body.
//
// This hook is registered before every other hook so that every response, including 404, 405 and error
// responses, carries both headers and runs inside the context. A request the HTTP parser rejects before the framework
// builds a request never reaches it and is outside this guarantee.
export function registerRequestContext(app: FastifyInstance): void {
  app.decorateRequest("requestContext", null);
  app.addHook("onRequest", (request, reply, done) => {
    const context = createRequestContext(request.headers[CORRELATION_ID_HEADER]);
    request.requestContext = context;
    reply.header(REQUEST_ID_HEADER, context.requestId);
    reply.header(CORRELATION_ID_HEADER, context.correlationId);
    runWithRequestContext(context, done);
  });
}

// The request ID of a request that is being handled. The hook above has run before any handler, so a missing
// context here is a programming error, not a state to paper over.
export function requestIdOf(request: FastifyRequest): string {
  if (!request.requestContext) throw new RequestContextMissingError();
  return request.requestContext.requestId;
}

// The correlation ID of a request that is being handled. Same rule as requestIdOf.
export function correlationIdOf(request: FastifyRequest): string {
  if (!request.requestContext) throw new RequestContextMissingError();
  return request.requestContext.correlationId;
}

// For error paths that can run before the hook above: a framework error such as an invalid URL is raised by the
// router before any hook runs. This creates the context once, attaches it to the request and sets both headers, so
// the body and the X-Request-ID header carry the same value and the X-Correlation-ID header is present too. Calling it
// again returns the same ID. It does not open an AsyncLocalStorage scope; nothing downstream runs for such a response.
export function ensureRequestId(request: FastifyRequest, reply: FastifyReply): string {
  // The router builds the request for a framework error without the decorations, so the property may be
  // undefined as well as null.
  if (!request.requestContext) {
    // The headers of a request built for a framework error may be missing, so the lookup is guarded.
    const context = createRequestContext(request.headers?.[CORRELATION_ID_HEADER]);
    request.requestContext = context;
    reply.header(REQUEST_ID_HEADER, context.requestId);
    reply.header(CORRELATION_ID_HEADER, context.correlationId);
    return context.requestId;
  }
  return request.requestContext.requestId;
}
