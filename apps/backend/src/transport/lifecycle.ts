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
// Requirements: KR-BE-1-004, KR-BE-1-009, B-INC-001-AC-06
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
  // Idempotent. Starts draining, keeps serving for the drain period, then stops accepting connections, lets
  // in-flight requests finish, and after the grace period closes connections that are still open.
  stop(): Promise<void>;
}

export interface StartOptions {
  readonly host: string;
  // 0 asks the operating system for a free port (used by tests).
  readonly port: number;
  readonly shutdownGraceMs?: number;
  // How long the listener stays open after stop() first runs, so a load balancer can notice that readiness answers
  // 503 and stop sending traffic. Application routes are still served during this period. Default 0: no delay. The
  // grace period starts after it, so the longest stop is drain plus grace. A second signal does not shorten it.
  readonly shutdownDrainMs?: number;
  // Called once, before the drain period starts, when stop() first runs. Used to start draining.
  readonly onStopping?: () => void;
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
  const drainMs = options.shutdownDrainMs ?? 0;
  let stopping: Promise<void> | undefined;
  const stop = (): Promise<void> => {
    stopping ??= (async () => {
      // A failing notification must not keep the server from stopping. The error is raised after cleanup.
      let notifyError: unknown;
      try {
        options.onStopping?.();
      } catch (error) {
        notifyError = error ?? new Error("onStopping failed");
      }
      // The listener stays open while the service reports itself not ready. Nothing here ends early: a second signal
      // is ignored by installShutdownHandlers, as before.
      if (drainMs > 0) await new Promise<void>((resolve) => { setTimeout(resolve, drainMs); });
      const timer = setTimeout(() => app.server.closeAllConnections(), graceMs);
      try {
        await app.close();
      } finally {
        clearTimeout(timer);
      }
      if (notifyError !== undefined) throw notifyError;
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
