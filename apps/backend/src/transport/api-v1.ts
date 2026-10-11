//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/api-v1.ts
// Description : Defines the route-group pattern and the rules for mounting groups under the /api/v1 prefix
//
// Component   : Control Plane
// Module      : API v1 Routing
// Layer       : API
//
// Requirements: KR-BE-1-006, B-INC-001-AC-06
// API         : RouteGroup, validateRouteGroups, mountApiV1; the mount point is /api/v1
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import type { FastifyInstance } from "fastify";

export const API_V1_PREFIX = "/api/v1";

// The route-registration pattern. A domain module's API layer exposes one RouteGroup; the application
// composition passes the groups to buildHttpServer. A group owns one path root below /api/v1 (for example
// "/projects" or "/credits") and registers routes relative to it, so a module can never register a route
// outside its own root. This task defines the pattern only. No domain group exists yet, so the production
// server serves no route (KR-BE-1-006: no unapproved domain API is added).
export interface RouteGroup {
  readonly name: string;
  // A path root: lower-case segments of letters and digits joined by single hyphens, for example "/projects".
  readonly prefix: string;
  register(api: FastifyInstance): void;
}

export class RouteRegistrationError extends Error {
  constructor(reason: string) {
    super(`Route registration is invalid: ${reason}.`);
    this.name = "RouteRegistrationError";
  }
}

const SEGMENT = "[a-z0-9]+(?:-[a-z0-9]+)*";
const PREFIX = new RegExp(`^/${SEGMENT}(?:/${SEGMENT})*$`);

function overlaps(a: string, b: string): boolean {
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

// Checked when the server is built, so a bad registration stops startup before any port opens.
export function validateRouteGroups(groups: readonly RouteGroup[]): void {
  const names = new Set<string>();
  for (const group of groups) {
    if (group.name === "" || names.has(group.name)) {
      throw new RouteRegistrationError(`group name "${group.name}" is empty or used twice`);
    }
    names.add(group.name);
    if (!PREFIX.test(group.prefix)) {
      throw new RouteRegistrationError(`group "${group.name}" has an invalid path root`);
    }
  }
  for (let i = 0; i < groups.length; i += 1) {
    for (let j = i + 1; j < groups.length; j += 1) {
      const a = groups[i];
      const b = groups[j];
      if (a && b && overlaps(a.prefix, b.prefix)) {
        throw new RouteRegistrationError(`groups "${a.name}" and "${b.name}" have overlapping path roots`);
      }
    }
  }
}

// Each group is mounted in its own encapsulated scope under /api/v1 + prefix. Hooks and decorators added by one
// group do not reach another. A route registered as "/" is served at the bare root without a trailing slash.
export function mountApiV1(app: FastifyInstance, groups: readonly RouteGroup[]): void {
  validateRouteGroups(groups);
  for (const group of groups) {
    app.register(
      async (scope) => {
        group.register(scope);
      },
      { prefix: `${API_V1_PREFIX}${group.prefix}`, prefixTrailingSlash: "no-slash" },
    );
  }
}
