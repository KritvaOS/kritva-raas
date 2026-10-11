//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/lifecycle.ts
// Description : Starts and stops the HTTP server and wires shutdown signals without reading configuration
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-004, B-INC-001-AC-06
// API         : startHttpServer, installShutdownHandlers
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import type { AddressInfo } from "node:net";
import type { FastifyInstance } from "fastify";

export const DEFAULT_SHUTDOWN_GRACE_MS = 10_000;

export class HttpStartupError extends Error {
  readonly reason: string;
  constructor(reason: string) {
    // Only the error code is kept; the original message and stack are not copied into diagnostics.
    super(`The HTTP server could not start (${reason}).`);
    this.name = "HttpStartupError";
    this.reason = reason;
  }
}

export interface RunningHttpServer {
  readonly host: string;
  readonly port: number;
  // Idempotent. Stops accepting connections, lets in-flight requests finish, and after the grace period
  // closes connections that are still open.
  stop(): Promise<void>;
}

export interface StartOptions {
  readonly host: string;
  // 0 asks the operating system for a free port (used by tests).
  readonly port: number;
  readonly shutdownGraceMs?: number;
}

export async function startHttpServer(app: FastifyInstance, options: StartOptions): Promise<RunningHttpServer> {
  try {
    await app.listen({ host: options.host, port: options.port });
  } catch (error) {
    await app.close().catch(() => undefined);
    const code = (error as { code?: unknown } | null)?.code;
    throw new HttpStartupError(typeof code === "string" ? code : "UNKNOWN");
  }
  const bound = app.server.address() as AddressInfo;
  const graceMs = options.shutdownGraceMs ?? DEFAULT_SHUTDOWN_GRACE_MS;
  let stopping: Promise<void> | undefined;
  const stop = (): Promise<void> => {
    stopping ??= (async () => {
      const timer = setTimeout(() => app.server.closeAllConnections(), graceMs);
      try {
        await app.close();
      } finally {
        clearTimeout(timer);
      }
    })();
    return stopping;
  };
  return { host: bound.address, port: bound.port, stop };
}

export interface SignalSource {
  on(signal: NodeJS.Signals, listener: () => void): unknown;
  off(signal: NodeJS.Signals, listener: () => void): unknown;
}

// Stops the server on the first signal. A second signal is ignored while stopping.
// `onStopped` receives an error if stopping failed. Returns a function that removes the handlers.
export function installShutdownHandlers(
  server: RunningHttpServer,
  source: SignalSource,
  onStopped: (error?: Error) => void,
  signals: readonly NodeJS.Signals[] = ["SIGINT", "SIGTERM"],
): () => void {
  let handled = false;
  const listener = (): void => {
    if (handled) return;
    handled = true;
    server.stop().then(() => onStopped(), (e: unknown) => onStopped(e instanceof Error ? e : new Error("shutdown failed")));
  };
  for (const s of signals) source.on(s, listener);
  return () => { for (const s of signals) source.off(s, listener); };
}
