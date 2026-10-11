//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/config/config.test.ts
// Description : Positive and negative tests of configuration validation that check no supplied value appears in an error
//
// Component   : Control Plane
// Module      : Configuration Test
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
import { ConfigError, loadConfig } from "../../src/config/config.js";

const SENTINEL = "SENTINEL-VALUE-9f3a";

function failure(env: Record<string, string>): ConfigError {
  try {
    loadConfig(env);
  } catch (error) {
    assert.ok(error instanceof ConfigError);
    return error;
  }
  assert.fail("expected the configuration to be rejected");
}

test("only the port is required and the other settings take explicit defaults", () => {
  const config = loadConfig({ KRITVA_HTTP_PORT: "8080" });
  assert.deepEqual(config, { http: { host: "127.0.0.1", port: 8080, shutdownGraceMs: 10000, bodyLimitBytes: 1048576 } });
});

test("every setting can be supplied", () => {
  const config = loadConfig({
    KRITVA_HTTP_HOST: "::1",
    KRITVA_HTTP_PORT: "65535",
    KRITVA_HTTP_SHUTDOWN_GRACE_MS: "0",
    KRITVA_HTTP_BODY_LIMIT_BYTES: "2048",
  });
  assert.deepEqual(config.http, { host: "::1", port: 65535, shutdownGraceMs: 0, bodyLimitBytes: 2048 });
});

test("valid hostnames are accepted as the host", () => {
  for (const good of ["api.internal", "localhost", "a", "a-b.c-d.example", "node1.lab-2.example.com", "a".repeat(63), "1.2.3.4", "10.0.0.1"]) {
    assert.equal(loadConfig({ KRITVA_HTTP_PORT: "1", KRITVA_HTTP_HOST: good }).http.host, good, good);
  }
});

test("the result is frozen", () => {
  const config = loadConfig({ KRITVA_HTTP_PORT: "8080" });
  assert.ok(Object.isFrozen(config));
  assert.ok(Object.isFrozen(config.http));
});

test("a missing port is rejected and named", () => {
  const error = failure({});
  assert.deepEqual(error.issues, [{ setting: "KRITVA_HTTP_PORT", problem: "missing" }]);
  assert.equal(error.message, "Configuration is invalid: KRITVA_HTTP_PORT (missing).");
});

test("an empty value is rejected, including for a setting that has a default", () => {
  assert.deepEqual(failure({ KRITVA_HTTP_PORT: "" }).issues, [{ setting: "KRITVA_HTTP_PORT", problem: "empty" }]);
  const error = failure({ KRITVA_HTTP_PORT: "80", KRITVA_HTTP_HOST: "", KRITVA_HTTP_SHUTDOWN_GRACE_MS: "" });
  assert.deepEqual(error.issues.map((i) => i.setting).sort(), ["KRITVA_HTTP_HOST", "KRITVA_HTTP_SHUTDOWN_GRACE_MS"]);
});

test("malformed numbers are rejected", () => {
  for (const bad of ["abc", "80a", "-1", "1.5", " 80", "80 ", "0x50", "1e3", "٨٠"]) {
    assert.deepEqual(failure({ KRITVA_HTTP_PORT: bad }).issues, [{ setting: "KRITVA_HTTP_PORT", problem: "malformed" }], bad);
  }
});

test("numbers outside the allowed range are rejected", () => {
  for (const bad of ["0", "65536", "99999999999999999999"]) {
    assert.deepEqual(failure({ KRITVA_HTTP_PORT: bad }).issues, [{ setting: "KRITVA_HTTP_PORT", problem: "out of range" }], bad);
  }
  assert.equal(failure({ KRITVA_HTTP_PORT: "80", KRITVA_HTTP_BODY_LIMIT_BYTES: "0" }).issues[0]?.problem, "out of range");
  assert.equal(failure({ KRITVA_HTTP_PORT: "80", KRITVA_HTTP_SHUTDOWN_GRACE_MS: "300001" }).issues[0]?.problem, "out of range");
});

test("a malformed host is rejected", () => {
  const longLabel = "a".repeat(64);
  const longName = `${"a".repeat(60)}.`.repeat(5) + "com";
  for (const bad of ["bad host", "host/path", "http://x", "-leading", "trailing-", "a_b", "[::1]", "api..internal", "api.-internal", "api-.internal", ".api", "api.", "api.internal.", longLabel, longName]) {
    assert.deepEqual(failure({ KRITVA_HTTP_PORT: "80", KRITVA_HTTP_HOST: bad }).issues, [{ setting: "KRITVA_HTTP_HOST", problem: "malformed" }], bad);
  }
});

test("a misspelled KRITVA_ setting is rejected instead of ignored", () => {
  const error = failure({ KRITVA_HTTP_PORT: "80", KRITVA_HTTP_PROT: "81" });
  assert.deepEqual(error.issues, [{ setting: "KRITVA_HTTP_PROT", problem: "unknown setting" }]);
});

test("settings without the KRITVA_ prefix are ignored", () => {
  assert.equal(loadConfig({ KRITVA_HTTP_PORT: "80", PATH: "/usr/bin", HOME: "/home/x" }).http.port, 80);
});

test("all problems are reported together", () => {
  const error = failure({ KRITVA_HTTP_HOST: "bad host", KRITVA_HTTP_BODY_LIMIT_BYTES: "x" });
  assert.deepEqual(error.issues.map((i) => i.setting).sort(), ["KRITVA_HTTP_BODY_LIMIT_BYTES", "KRITVA_HTTP_HOST", "KRITVA_HTTP_PORT"]);
});

test("no error message, issue or serialization contains a supplied value", () => {
  const error = failure({
    KRITVA_HTTP_HOST: `${SENTINEL} host`,
    KRITVA_HTTP_PORT: SENTINEL,
    KRITVA_HTTP_SHUTDOWN_GRACE_MS: SENTINEL,
    KRITVA_HTTP_BODY_LIMIT_BYTES: SENTINEL,
  });
  const rendered = [error.message, JSON.stringify(error.issues), String(error), error.stack ?? ""].join("\n");
  assert.ok(!rendered.includes(SENTINEL));
  const unknown = failure({ KRITVA_HTTP_PORT: "80", KRITVA_HTTP_PORT_X: SENTINEL });
  assert.ok(!`${unknown.message}${JSON.stringify(unknown.issues)}`.includes(SENTINEL));
});
