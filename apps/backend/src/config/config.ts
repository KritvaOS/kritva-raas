//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/config/config.ts
// Description : Reads and validates the non-secret settings from the environment and fails without printing any value
//
// Component   : Control Plane
// Module      : Configuration
// Layer       : Service
//
// Requirements: KR-BE-1-003, B-INC-001-AC-04
// API         : loadConfig(env); ConfigError
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { isIP } from "node:net";

// The single configuration boundary (KR-BINC-001-005 Section 6): only this module reads external
// configuration, and nothing else in the application reads process.env. This task covers non-secret
// (S0/S1) settings only. Secret-typed values and credential settings are added after the secret-handling
// policy is approved. Error output names a setting and a reason, never the value that was supplied.

export interface AppConfig {
  readonly http: {
    readonly host: string;
    readonly port: number;
    readonly shutdownGraceMs: number;
    readonly bodyLimitBytes: number;
  };
}

export interface ConfigIssue {
  readonly setting: string;
  readonly problem: "missing" | "empty" | "malformed" | "out of range" | "unknown setting";
}

export class ConfigError extends Error {
  readonly issues: readonly ConfigIssue[];
  constructor(issues: readonly ConfigIssue[]) {
    super(`Configuration is invalid: ${issues.map((i) => `${i.setting} (${i.problem})`).join(", ")}.`);
    this.name = "ConfigError";
    this.issues = issues;
  }
}

export type Environment = Readonly<Record<string, string | undefined>>;

export const SETTING_PREFIX = "KRITVA_";

interface IntegerRule {
  readonly name: string;
  readonly min: number;
  readonly max: number;
  readonly fallback?: number; // no fallback means the setting is required
}

const PORT: IntegerRule = { name: "KRITVA_HTTP_PORT", min: 1, max: 65535 };
const GRACE: IntegerRule = { name: "KRITVA_HTTP_SHUTDOWN_GRACE_MS", min: 0, max: 300_000, fallback: 10_000 };
const BODY: IntegerRule = { name: "KRITVA_HTTP_BODY_LIMIT_BYTES", min: 1, max: 104_857_600, fallback: 1_048_576 };
const HOST_NAME = "KRITVA_HTTP_HOST";
// Loopback by default. Listening on every interface has to be asked for by setting the host explicitly.
const HOST_FALLBACK = "127.0.0.1";

const KNOWN = new Set([PORT.name, GRACE.name, BODY.name, HOST_NAME]);
const HOSTNAME = /^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/;

function readInteger(env: Environment, rule: IntegerRule, issues: ConfigIssue[]): number {
  const raw = env[rule.name];
  if (raw === undefined) {
    if (rule.fallback !== undefined) return rule.fallback;
    issues.push({ setting: rule.name, problem: "missing" });
    return 0;
  }
  if (raw === "") {
    issues.push({ setting: rule.name, problem: "empty" });
    return 0;
  }
  if (!/^[0-9]+$/.test(raw)) {
    issues.push({ setting: rule.name, problem: "malformed" });
    return 0;
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < rule.min || value > rule.max) {
    issues.push({ setting: rule.name, problem: "out of range" });
    return 0;
  }
  return value;
}

function readHost(env: Environment, issues: ConfigIssue[]): string {
  const raw = env[HOST_NAME];
  if (raw === undefined) return HOST_FALLBACK;
  if (raw === "") {
    issues.push({ setting: HOST_NAME, problem: "empty" });
    return HOST_FALLBACK;
  }
  if (isIP(raw) === 0 && !HOSTNAME.test(raw)) {
    issues.push({ setting: HOST_NAME, problem: "malformed" });
    return HOST_FALLBACK;
  }
  return raw;
}

export function loadConfig(env: Environment): AppConfig {
  const issues: ConfigIssue[] = [];
  const config: AppConfig = {
    http: {
      host: readHost(env, issues),
      port: readInteger(env, PORT, issues),
      shutdownGraceMs: readInteger(env, GRACE, issues),
      bodyLimitBytes: readInteger(env, BODY, issues),
    },
  };
  // A misspelled setting would otherwise be ignored and the default used without anyone noticing.
  for (const name of Object.keys(env).sort()) {
    if (name.startsWith(SETTING_PREFIX) && !KNOWN.has(name)) {
      issues.push({ setting: name, problem: "unknown setting" });
    }
  }
  if (issues.length > 0) throw new ConfigError(issues);
  return Object.freeze({ http: Object.freeze(config.http) });
}
