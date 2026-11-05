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
// Requirements: KR-BE-1-004, KR-BE-1-009, BTS-007, BTS-032
// API         : No callable API; tests of the HTTP transport
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { request, type IncomingMessage } from "node:http";
import { createReadinessState } from "../../src/transport/health.js";
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

test("stop calls onStopping once, before the server stops accepting connections", async () => {
  const calls: string[] = [];
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0, onStopping: () => calls.push("stopping") });
  assert.deepEqual(calls, []);
  await Promise.all([server.stop(), server.stop()]);
  await server.stop();
  assert.deepEqual(calls, ["stopping"]);
});

test("a throwing onStopping does not keep the server from stopping, and stop reports the error after cleanup", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0, onStopping: () => { throw new Error("notify failed"); } });
  await assert.rejects(server.stop(), /notify failed/);
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

// ---------------------------------------------------------------------------------------------------------------
// Shutdown drain (decision record KR-BE-1-009-readiness-check-policy.md, decision 4)

function drainingApp(state = createReadinessState(), delayMs = 150) {
  return buildHttpServer({
    readiness: { state, resultCacheMs: 0 },
    groups: [{ name: "slow", prefix: "/slow", register: (api) => {
      api.get("/", async () => { await new Promise((r) => setTimeout(r, delayMs)); return { done: true }; });
    } }],
  });
}

test("during the drain the listener stays open: readiness answers 503 over a real socket, other routes are still served", async () => {
  const state = createReadinessState();
  const server = await startHttpServer(drainingApp(state), { host: HOST, port: 0, shutdownDrainMs: 400, shutdownGraceMs: 5000, onStopping: () => state.beginDraining() });
  assert.equal((await get(server.port, "/health/ready")).status, 200);
  const stopping = server.stop();
  await new Promise((r) => setTimeout(r, 80));
  const ready = await get(server.port, "/health/ready");
  assert.equal(ready.status, 503);
  assert.equal(JSON.parse(ready.body).code, "SERVICE_UNAVAILABLE");
  assert.equal((await get(server.port, "/health/live")).status, 200);
  assert.equal((await get(server.port, "/api/v1/none")).status, 404);
  assert.equal((await get(server.port, "/api/v1/slow")).status, 200);
  await stopping;
  await assert.rejects(get(server.port, "/health/ready"));
});

test("stop takes at least the drain period, and onStopping runs at the start of it", async () => {
  const events: string[] = [];
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0, shutdownDrainMs: 250, onStopping: () => events.push("stopping") });
  const started = Date.now();
  const stopping = server.stop();
  assert.deepEqual(events, ["stopping"]);
  assert.equal((await get(server.port, "/api/v1/none")).status, 404, "still accepting connections");
  await stopping;
  assert.ok(Date.now() - started >= 240, "stop waited for the drain period");
});

test("the grace period starts after the drain: a request that starts during the drain finishes even with a short grace", async () => {
  const state = createReadinessState();
  const server = await startHttpServer(drainingApp(state, 200), { host: HOST, port: 0, shutdownDrainMs: 400, shutdownGraceMs: 60, onStopping: () => state.beginDraining() });
  const stopping = server.stop();
  await new Promise((r) => setTimeout(r, 50));
  const res = await get(server.port, "/api/v1/slow");
  assert.equal(res.status, 200, "a grace period counted from the start of the drain would have closed this request");
  await stopping;
});

test("a second signal during the drain is ignored and does not shorten it", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0, shutdownDrainMs: 300 });
  const source = new EventEmitter();
  const started = Date.now();
  const stopped = new Promise<void>((resolve) => { installShutdownHandlers(server, source, () => resolve()); });
  source.emit("SIGTERM");
  await new Promise((r) => setTimeout(r, 50));
  source.emit("SIGINT");
  source.emit("SIGTERM");
  await stopped;
  assert.ok(Date.now() - started >= 290);
});

test("a drain of 0 stops at once, as before", async () => {
  const server = await startHttpServer(buildHttpServer(), { host: HOST, port: 0, shutdownDrainMs: 0 });
  const started = Date.now();
  await server.stop();
  assert.ok(Date.now() - started < 1000);
});

test("a throwing onStopping with a drain period still drains, closes the server, and surfaces the error afterwards", async () => {
  const state = createReadinessState();
  const server = await startHttpServer(drainingApp(state), {
    host: HOST, port: 0, shutdownDrainMs: 250,
    onStopping: () => { state.beginDraining(); throw new Error("notify failed"); },
  });
  const started = Date.now();
  const stopping = server.stop();
  const outcome = stopping.then(() => "resolved", (e: unknown) => String((e as Error).message));
  await new Promise((r) => setTimeout(r, 60));
  assert.equal((await get(server.port, "/health/ready")).status, 503, "readiness is draining although the hook threw");
  assert.equal(await outcome, "notify failed");
  assert.ok(Date.now() - started >= 240, "the drain period was not skipped");
  await assert.rejects(get(server.port, "/health/ready"));
});
