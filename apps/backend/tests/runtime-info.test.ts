//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/tests/runtime-info.test.ts
// Description : Baseline test that checks the Node.js major version parsing of the runtime info function
//
// Component   : Control Plane
// Module      : Application Structure Baseline Test
// Layer       : Service
//
// Requirements: KR-BE-1-001, BTS-001
// API         : No callable API; test of an internal function
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { runtimeInfo } from "../src/runtime-info.js";

test("parses the major version from a Node.js version string", () => {
  assert.equal(runtimeInfo("v24.21.0").major, 24);
  assert.equal(runtimeInfo("24.21.0").major, 24);
});
