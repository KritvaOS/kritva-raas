//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/run.test.ts
// Description : Startup composition tests and a real process test of the entry point, its failure exit and signal shutdown
//
// Component   : Control Plane
// Module      : Application Composition Test
// Layer       : Service
//
// Requirements: KR-BE-1-003, BTS-002, BTS-003
// API         : No callable API; tests of configuration and startup
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { createServer, request } from "node:http";
import { fileURLToPath } from "node:url";
import { start, type Log } from "../src/run.js";

const SENTINEL = "SENTINEL-VALUE-9f3a";

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.on("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const port = (s.address() as { port: number }).port;
      s.close(() => resolve(port));
    });
  });
}

function recorder() {
  const lines: string[] = [];
  const log: Log = { info: (l) => lines.push(`info: ${l}`), error: (l) => lines.push(`error: ${l}`) };
  return { lines, log };
}

function status(port: number, path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = request({ host: "127.0.0.1", port, path, agent: false }, (res) => { res.resume(); res.on("end", () => resolve(res.statusCode ?? 0)); });
    req.on("error", reject);
    req.end();
  });
}

test("invalid configuration fails before any port is opened and prints no value", async () => {
  const { lines, log } = recorder();
  const codes: number[] = [];
  const server = await start({ KRITVA_HTTP_PORT: SENTINEL }, new EventEmitter(), log, (c) => codes.push(c));
  assert.equal(server, undefined);
  assert.deepEqual(codes, [1]);
  assert.deepEqual(lines, ["error: Configuration is invalid: KRITVA_HTTP_PORT (malformed)."]);
  assert.ok(!lines.join("\n").includes(SENTINEL));
});

test("valid configuration starts the server, answers requests and stops on a signal", async () => {
  const port = await freePort();
  const { lines, log } = recorder();
  const signals = new EventEmitter();
  const exited = new Promise<number>((resolve) => {
    void start({ KRITVA_HTTP_PORT: String(port) }, signals, log, resolve);
  });
  await new Promise((r) => setTimeout(r, 200));
  assert.equal(await status(port, "/api/v1/none"), 404);
  signals.emit("SIGTERM");
  assert.equal(await exited, 0);
  assert.deepEqual(lines, [`info: The HTTP server is listening on 127.0.0.1:${port}.`, "info: The HTTP server stopped."]);
});

test("a port already in use exits 1 with the error code only", async () => {
  const port = await freePort();
  const first = await start({ KRITVA_HTTP_PORT: String(port) }, new EventEmitter(), recorder().log, () => undefined);
  assert.ok(first);
  const { lines, log } = recorder();
  const codes: number[] = [];
  const second = await start({ KRITVA_HTTP_PORT: String(port) }, new EventEmitter(), log, (c) => codes.push(c));
  assert.equal(second, undefined);
  assert.deepEqual(codes, [1]);
  assert.deepEqual(lines, ["error: The HTTP server could not start (EADDRINUSE)."]);
  await first.stop();
});

const MAIN = fileURLToPath(new URL("../src/main.js", import.meta.url));

function runMain(env: Record<string, string>): { output: () => string; exit: Promise<number | null>; kill: (s: NodeJS.Signals) => void } {
  const child = spawn(process.execPath, [MAIN], { env: { PATH: process.env["PATH"] ?? "", ...env } });
  let out = "";
  child.stdout.on("data", (c: Buffer) => { out += c.toString(); });
  child.stderr.on("data", (c: Buffer) => { out += c.toString(); });
  const exit = new Promise<number | null>((resolve) => child.on("close", (code) => resolve(code)));
  return { output: () => out, exit, kill: (s) => child.kill(s) };
}

test("the entry point exits 1 and names the setting when the port is not configured", async () => {
  const child = runMain({});
  assert.equal(await child.exit, 1);
  assert.equal(child.output(), "Configuration is invalid: KRITVA_HTTP_PORT (missing).\n");
});

test("the entry point serves requests and exits 0 on SIGTERM", async () => {
  const port = await freePort();
  const child = runMain({ KRITVA_HTTP_PORT: String(port) });
  const deadline = Date.now() + 5000;
  while (!child.output().includes("listening") && Date.now() < deadline) await new Promise((r) => setTimeout(r, 25));
  assert.match(child.output(), new RegExp(`listening on 127\\.0\\.0\\.1:${port}`));
  assert.equal(await status(port, "/api/v1/none"), 404);
  child.kill("SIGTERM");
  assert.equal(await child.exit, 0);
  assert.match(child.output(), /stopped/);
});
