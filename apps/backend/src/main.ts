//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/main.ts
// Description : Entry point of the Control Plane backend that starts the service from the process environment
//
// Component   : Control Plane
// Module      : Application Structure Baseline
// Layer       : Service
//
// Requirements: KR-BE-1-001, KR-BE-1-003, KR-BE-1-004
// API         : Process entry point; reads KRITVA_* settings and opens the HTTP port
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { start } from "./run.js";

void start(
  process.env,
  process,
  {
    info: (line) => process.stdout.write(`${line}\n`),
    error: (line) => process.stderr.write(`${line}\n`),
  },
  (code) => {
    process.exitCode = code;
  },
);
