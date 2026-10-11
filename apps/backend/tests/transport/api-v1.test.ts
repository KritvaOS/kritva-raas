//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/api-v1.test.ts
// Description : Tests of the API v1 mount point, route-group rules and unknown route and method behavior
//
// Component   : Control Plane
// Module      : API v1 Routing Test
// Layer       : API
//
// Requirements: KR-BE-1-006, BTS-007, BTS-032
// API         : No callable API; tests of API v1 routing
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  RouteRegistrationError,
  validateRouteGroups,
  type RouteGroup,
} from "../../src/transport/api-v1.js";
import { buildHttpServer } from "../../src/transport/http-server.js";
import { HttpStartupError, startHttpServer } from "../../src/transport/lifecycle.js";

const widgets: RouteGroup = {
  name: "widgets",
  prefix: "/widgets",
  register: (api) => {
    api.get("/", async () => ({ list: true }));
    api.get("/:widget_id", async (request) => ({ id: (request.params as { widget_id: string }).widget_id }));
    api.get("/extra", async () => ({ extra: true }));
  },
};

function app() {
  return buildHttpServer({ groups: [widgets] });
}

test("a group route is served under /api/v1 plus the group root, and path parameters work", async () => {
  const a = app();
  assert.deepEqual((await a.inject({ method: "GET", url: "/api/v1/widgets" })).json(), { list: true });
  assert.deepEqual((await a.inject({ method: "GET", url: "/api/v1/widgets/abc" })).json(), { id: "abc" });
  assert.deepEqual((await a.inject({ method: "GET", url: "/api/v1/widgets/extra" })).json(), { extra: true });
  await a.close();
});

test("a group route cannot be reached outside its root", async () => {
  const a = app();
  assert.equal((await a.inject({ method: "GET", url: "/api/v1/extra" })).statusCode, 404);
  assert.equal((await a.inject({ method: "GET", url: "/widgets" })).statusCode, 404);
  await a.close();
});

test("other API versions and the bare prefix are not served", async () => {
  const a = app();
  for (const url of ["/api/v2/widgets", "/api/v0/widgets", "/api", "/api/", "/api/v1", "/api/v1/", "/v1/widgets"]) {
    const res = await a.inject({ method: "GET", url });
    assert.equal(res.statusCode, 404, url);
    assert.equal(res.json().error.code, "RESOURCE_NOT_FOUND", url);
  }
  await a.close();
});

test("matching is exact: no trailing slash, no case folding, no doubled slash", async () => {
  const a = app();
  for (const url of ["/api/v1/widgets/", "/API/V1/widgets", "/api/v1/Widgets", "/api/v1//widgets", "/api/v1/widgets//abc"]) {
    assert.equal((await a.inject({ method: "GET", url })).statusCode, 404, url);
  }
  await a.close();
});

test("a known path with an unsupported method returns 405 with Allow, including OPTIONS", async () => {
  const a = app();
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const) {
    const res = await a.inject({ method, url: "/api/v1/widgets/abc" });
    assert.equal(res.statusCode, 405, method);
    assert.equal(res.json().error.code, "METHOD_NOT_ALLOWED", method);
    assert.equal(res.headers["allow"], "GET, HEAD", method);
  }
  await a.close();
});

test("an unsupported method on an unknown path is 404, not 405", async () => {
  const a = app();
  assert.equal((await a.inject({ method: "DELETE", url: "/api/v1/nothing" })).statusCode, 404);
  await a.close();
});

test("HEAD on a GET route succeeds with no body", async () => {
  const a = app();
  const res = await a.inject({ method: "HEAD", url: "/api/v1/widgets" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, "");
  await a.close();
});

test("404 and 405 responses are JSON", async () => {
  const a = app();
  for (const [method, url] of [["GET", "/api/v1/none"], ["POST", "/api/v1/widgets"]] as const) {
    const res = await a.inject({ method, url });
    assert.match(String(res.headers["content-type"]), /^application\/json/);
  }
  await a.close();
});

test("a hook added in one group does not run for another group", async () => {
  const a = buildHttpServer({
    groups: [
      { name: "one", prefix: "/one", register: (api) => {
        api.addHook("onSend", async (_req, reply) => { reply.header("x-one", "1"); });
        api.get("/", async () => ({}));
      } },
      { name: "two", prefix: "/two", register: (api) => { api.get("/", async () => ({})); } },
    ],
  });
  assert.equal((await a.inject({ method: "GET", url: "/api/v1/one" })).headers["x-one"], "1");
  assert.equal((await a.inject({ method: "GET", url: "/api/v1/two" })).headers["x-one"], undefined);
  await a.close();
});

test("a server built with no groups serves nothing", async () => {
  const a = buildHttpServer();
  for (const url of ["/api/v1/health", "/api/v1/projects", "/health", "/"]) {
    assert.equal((await a.inject({ method: "GET", url })).statusCode, 404, url);
  }
  await a.close();
});

const noop = () => undefined;

test("valid group roots are accepted, including nested roots and similar names", () => {
  validateRouteGroups([
    { name: "a", prefix: "/projects", register: noop },
    { name: "b", prefix: "/credits", register: noop },
    { name: "c", prefix: "/credits-extra", register: noop },
    { name: "d", prefix: "/auth/sessions", register: noop },
  ]);
});

test("invalid group roots are rejected", () => {
  for (const prefix of ["", "/", "projects", "/Projects", "/a//b", "/a/", "/a_b", "/-a", "/a-", "/a b", "/a/../b", "/api/v1/x?"]) {
    assert.throws(() => validateRouteGroups([{ name: "x", prefix, register: noop }]), RouteRegistrationError, prefix);
  }
});

test("empty and repeated group names are rejected", () => {
  assert.throws(() => validateRouteGroups([{ name: "", prefix: "/a", register: noop }]), RouteRegistrationError);
  assert.throws(
    () => validateRouteGroups([{ name: "x", prefix: "/a", register: noop }, { name: "x", prefix: "/b", register: noop }]),
    RouteRegistrationError,
  );
});

test("groups with the same or nested roots are rejected and the error names the groups only", () => {
  for (const [first, second] of [["/credits", "/credits"], ["/credits", "/credits/accounts"], ["/credits/accounts", "/credits"]] as const) {
    assert.throws(
      () => buildHttpServer({ groups: [{ name: "g1", prefix: first, register: noop }, { name: "g2", prefix: second, register: noop }] }),
      (e: unknown) => e instanceof RouteRegistrationError && e.message === 'Route registration is invalid: groups "g1" and "g2" have overlapping path roots.',
    );
  }
});

test("a group that registers the same route twice stops startup with a sanitized error", async () => {
  const bad = buildHttpServer({
    groups: [{ name: "dup", prefix: "/dup", register: (api) => {
      api.get("/", async () => ({}));
      api.get("/", async () => ({}));
    } }],
  });
  await assert.rejects(startHttpServer(bad, { host: "127.0.0.1", port: 0 }), (e: unknown) => {
    assert.ok(e instanceof HttpStartupError);
    assert.ok(!e.message.includes("/dup"));
    return true;
  });
});
