//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/run.ts
// Description : Composes configuration, the HTTP server and shutdown handling and reports startup failures safely
//
// Component   : Control Plane
// Module      : Application Composition
// Layer       : Service
//
// Requirements: KR-BE-1-003, KR-BE-1-004, B-INC-001-AC-04
// API         : start(env, signals, log, onExit)
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { ConfigError, loadConfig, type Environment } from "./config/config.js";
import { buildHttpServer } from "./transport/http-server.js";
import {
  HttpStartupError,
  installShutdownHandlers,
  startHttpServer,
  type RunningHttpServer,
  type SignalSource,
} from "./transport/lifecycle.js";

export interface Log {
  info(line: string): void;
  error(line: string): void;
}

// Invalid configuration fails here, before the server is built or any port is opened, so the service
// is never ready with bad settings. Output carries setting names and reasons, never values.
export async function start(
  env: Environment,
  signals: SignalSource,
  log: Log,
  onExit: (code: number) => void,
): Promise<RunningHttpServer | undefined> {
  try {
    const config = loadConfig(env);
    const app = buildHttpServer({ bodyLimitBytes: config.http.bodyLimitBytes });
    const server = await startHttpServer(app, {
      host: config.http.host,
      port: config.http.port,
      shutdownGraceMs: config.http.shutdownGraceMs,
    });
    installShutdownHandlers(server, signals, (error) => {
      if (error) {
        log.error("The HTTP server did not stop cleanly.");
        onExit(1);
      } else {
        log.info("The HTTP server stopped.");
        onExit(0);
      }
    });
    log.info(`The HTTP server is listening on ${server.host}:${server.port}.`);
    return server;
  } catch (error) {
    if (error instanceof ConfigError || error instanceof HttpStartupError) {
      log.error(error.message);
    } else {
      log.error("The service could not start because of an unexpected error.");
    }
    onExit(1);
    return undefined;
  }
}
