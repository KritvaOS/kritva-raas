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
// Requirements: KR-BE-1-004, KR-BINC-001-003, B-INC-001-AC-06
// API         : buildHttpServer(options); routes are mounted under /api/v1
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import Fastify, { type FastifyInstance } from "fastify";
import { ERRORS, classifyError, errorBody } from "./error-contract.js";

export const API_V1_PREFIX = "/api/v1";
// Provisional limit; the configuration framework (KR-BE-1-003) may make it configurable.
export const DEFAULT_BODY_LIMIT_BYTES = 1_048_576;

export interface HttpServerOptions {
  // Mounts routes under /api/v1. Domain modules supply routes later; this task adds none.
  readonly routes?: (api: FastifyInstance) => void;
  readonly bodyLimitBytes?: number;
}

function pathMatcher(url: string): RegExp {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/:[A-Za-z0-9_]+/g, "[^/]+")}$`);
}

// The framework constraint "API layer only" (KR-BINC-001-003): nothing outside src/transport imports fastify.
export function buildHttpServer(options: HttpServerOptions = {}): FastifyInstance {
  const app = Fastify({
    logger: false, // Logging is KR-BE-1-041.
    bodyLimit: options.bodyLimitBytes ?? DEFAULT_BODY_LIMIT_BYTES,
    // Fastify's default validator coerces types ("2" becomes 2) and silently removes unknown properties.
    // Both hide client errors, so they are switched off: input that does not match the schema is rejected.
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false, useDefaults: false } },
  });

  const registered: { matcher: RegExp; method: string }[] = [];
  app.addHook("onRoute", (route) => {
    const methods = Array.isArray(route.method) ? route.method : [route.method];
    for (const method of methods) registered.push({ matcher: pathMatcher(route.url), method });
  });

  app.setErrorHandler((error, _request, reply) => {
    const { spec, details } = classifyError(error);
    return reply.code(spec.status).send(errorBody(spec, details));
  });

  app.setNotFoundHandler((request, reply) => {
    const path = request.url.split("?")[0] ?? "";
    const allowed = [...new Set(registered.filter((r) => r.matcher.test(path)).map((r) => r.method))].sort();
    if (allowed.length > 0) {
      return reply.code(405).header("Allow", allowed.join(", ")).send(errorBody(ERRORS.methodNotAllowed));
    }
    return reply.code(404).send(errorBody(ERRORS.notFound));
  });

  const routes = options.routes;
  if (routes) {
    app.register(async (api) => { routes(api); }, { prefix: API_V1_PREFIX });
  }
  return app;
}
