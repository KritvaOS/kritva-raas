//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/transport/lifecycle.test.ts
// Description : Startup, shutdown, port-in-use and signal handling tests that listen on 127.0.0.1 with an OS-assigned port
//
// Component   : Control Plane
// Module      : HTTP Transport Test
// Layer       : API
//
// Requirements: KR-BE-1-004, BTS-007, BTS-032
// API         : No callable API; tests of the HTTP transport
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { request, type IncomingMessage } from "node:http";
import { buildHttpServer } from "../../src/transport/http-server.js";
import { HttpStartupError, installShutdownHandlers, startHttpServer } from "../../src/transport/lifecycle.js";

const HOST = "127.0.0.1";

function get(port: number, path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = request({ host: HOST, port, path, method: "GET", agent: false }, (res: IncomingMessage) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c: string) => { body += c; });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

function slowApp(delayMs: number) {
  return buildHttpServer({
    groups: [{ name: "slow", prefix: "/slow", register: (api) => {
      api.get("/", async () => { await new Promise((r) => setTimeout(r, delayMs)); return { done: true }; });
    } }],
  });
}

test("the server starts on an OS-assigned port, answers a request and stops", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0 });
  assert.ok(server.port > 0);
  const res = await get(server.port, "/api/v1/none");
  assert.equal(res.status, 404);
  assert.equal(JSON.parse(res.body).code, "RESOURCE_NOT_FOUND");
  await server.stop();
  await assert.rejects(get(server.port, "/api/v1/none"));
});

test("stop is idempotent", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0 });
  await Promise.all([server.stop(), server.stop()]);
  await server.stop();
});

test("a port already in use fails startup with a sanitized error", async () => {
  const first = await startHttpServer(buildHttpServer(), { host: HOST, port: 0 });
  await assert.rejects(startHttpServer(buildHttpServer(), { host: HOST, port: first.port }), (e: unknown) => {
    assert.ok(e instanceof HttpStartupError);
    assert.equal(e.reason, "EADDRINUSE");
    assert.ok(!String(e.message).includes(HOST));
    return true;
  });
  await first.stop();
});

test("an in-flight request finishes before stop resolves", async () => {
  const server = await startHttpServer(slowApp(150), { host: HOST, port: 0, shutdownGraceMs: 5000 });
  const pending = get(server.port, "/api/v1/slow");
  await new Promise((r) => setTimeout(r, 30));
  await server.stop();
  const res = await pending;
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(res.body), { done: true });
});

test("a request still open after the grace period is closed and stop resolves", async () => {
  const server = await startHttpServer(slowApp(5000), { host: HOST, port: 0, shutdownGraceMs: 50 });
  const pending = get(server.port, "/api/v1/slow").then(() => "completed", () => "closed");
  await new Promise((r) => setTimeout(r, 30));
  const started = Date.now();
  await server.stop();
  assert.ok(Date.now() - started < 3000);
  assert.equal(await pending, "closed");
});

test("the first shutdown signal stops the server once and the handlers can be removed", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0 });
  const source = new EventEmitter();
  const results: (Error | undefined)[] = [];
  const stopped = new Promise<void>((resolve) => {
    installShutdownHandlers(server, source, (e) => { results.push(e); resolve(); });
  });
  assert.equal(source.listenerCount("SIGTERM"), 1);
  source.emit("SIGTERM");
  source.emit("SIGINT");
  await stopped;
  assert.deepEqual(results, [undefined]);
  await assert.rejects(get(server.port, "/api/v1/none"));
});

test("removing the handlers leaves no listener", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0 });
  const source = new EventEmitter();
  const dispose = installShutdownHandlers(server, source, () => undefined);
  dispose();
  assert.equal(source.listenerCount("SIGTERM"), 0);
  assert.equal(source.listenerCount("SIGINT"), 0);
  await server.stop();
});
