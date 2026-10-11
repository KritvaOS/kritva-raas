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
// Requirements: KR-BE-1-005, B-INC-001-AC-07
// API         : registerRequestContext(app); X-Request-ID response header
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import type { FastifyInstance, FastifyRequest } from "fastify";
import { createRequestContext, runWithRequestContext, type RequestContext } from "../shared/request-context.js";

declare module "fastify" {
  interface FastifyRequest {
    requestContext: RequestContext | null;
  }
}

export const REQUEST_ID_HEADER = "x-request-id";

// Policy (API_CONTRACT.md Sections 12 and 13, decisions/KR-BE-1-007-response-contract.md): the server always
// generates the request ID. A client-supplied X-Request-ID is ignored and never echoed, because an accepted value
// could carry misleading or injected content into later logs. The separate correlation identifier is decided
// with KR-BE-1-008.
//
// This hook is registered before every other hook so that every response, including 404, 405 and error
// responses, carries the header and runs inside the context.
export function registerRequestContext(app: FastifyInstance): void {
  app.decorateRequest("requestContext", null);
  app.addHook("onRequest", (request, reply, done) => {
    const context = createRequestContext();
    request.requestContext = context;
    reply.header(REQUEST_ID_HEADER, context.requestId);
    runWithRequestContext(context, done);
  });
}

// The request ID for a response body. The hook above always sets the context, so the fallback is a safety net
// that keeps request_id a string (the envelope forbids null); it would not match a header in that case.
export function requestIdOf(request: FastifyRequest): string {
  return request.requestContext?.requestId ?? createRequestContext().requestId;
}
