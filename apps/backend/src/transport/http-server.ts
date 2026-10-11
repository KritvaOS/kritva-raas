//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/http-server.ts
// Description : Builds the Fastify application with API v1 routing, one error handler and a not-found handler
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-004, KR-BE-1-005, KR-BE-1-006, KR-BINC-001-003, B-INC-001-AC-06
// API         : buildHttpServer(options); route groups are mounted under /api/v1
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import Fastify, { type FastifyInstance } from "fastify";
import { API_V1_PREFIX, mountApiV1, validateRouteGroups, type RouteGroup } from "./api-v1.js";
import { ERRORS, classifyError, errorBody } from "./error-contract.js";
import { registerRequestContext } from "./request-context.js";

export { API_V1_PREFIX };
// Provisional limit; the configuration framework (KR-BE-1-003) may make it configurable.
export const DEFAULT_BODY_LIMIT_BYTES = 1_048_576;

export interface HttpServerOptions {
  // Route groups mounted under /api/v1 (see api-v1.ts). Domain modules supply groups later; none exist yet.
  readonly groups?: readonly RouteGroup[];
  readonly bodyLimitBytes?: number;
}

function pathMatcher(url: string): RegExp {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/:[A-Za-z0-9_]+/g, "[^/]+")}$`);
}

// The framework constraint "API layer only" (KR-BINC-001-003): nothing outside src/transport imports fastify.
export function buildHttpServer(options: HttpServerOptions = {}): FastifyInstance {
  const groups = options.groups ?? [];
  validateRouteGroups(groups);
  const app = Fastify({
    logger: false, // Logging is KR-BE-1-041.
    bodyLimit: options.bodyLimitBytes ?? DEFAULT_BODY_LIMIT_BYTES,
    // Fastify's default validator coerces types ("2" becomes 2) and silently removes unknown properties.
    // Both hide client errors, so they are switched off: input that does not match the schema is rejected.
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false, useDefaults: false } },
  });

  registerRequestContext(app);

  const registered: { matcher: RegExp; method: string }[] = [];
  app.addHook("onRoute", (route) => {
    const methods = Array.isArray(route.method) ? route.method : [route.method];
    for (const method of methods) registered.push({ matcher: pathMatcher(route.url), method });
  });

  // Paths are matched exactly. The router would otherwise let "/api/v1/widgets/" match "/:widget_id" with an
  // empty identifier, and identifiers must be non-empty (API_CONTRACT.md Section 6). A trailing slash or an
  // empty path segment is therefore "not found".
  app.addHook("onRequest", async (request, reply) => {
    const path = request.url.split("?")[0] ?? "";
    if (path.includes("//") || (path.length > 1 && path.endsWith("/"))) {
      return reply.code(404).send(errorBody(ERRORS.notFound, [], request.requestContext?.requestId ?? null));
    }
    return undefined;
  });

  app.setErrorHandler((error, request, reply) => {
    const { spec, details } = classifyError(error);
    return reply.code(spec.status).send(errorBody(spec, details, request.requestContext?.requestId ?? null));
  });

  app.setNotFoundHandler((request, reply) => {
    const id = request.requestContext?.requestId ?? null;
    const path = request.url.split("?")[0] ?? "";
    const allowed = [...new Set(registered.filter((r) => r.matcher.test(path)).map((r) => r.method))].sort();
    if (allowed.length > 0) {
      return reply.code(405).header("Allow", allowed.join(", ")).send(errorBody(ERRORS.methodNotAllowed, [], id));
    }
    return reply.code(404).send(errorBody(ERRORS.notFound, [], id));
  });

  mountApiV1(app, groups);
  return app;
}
