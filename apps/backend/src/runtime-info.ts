//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/runtime-info.ts
// Description : Pure function that reads the major version number from a Node.js version string
//
// Component   : Control Plane
// Module      : Application Structure Baseline
// Layer       : Service
//
// Requirements: KR-BE-1-001
// API         : Internal function; exported for the baseline test only
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

export function runtimeInfo(version: string): { major: number } {
  const major = Number(version.replace(/^v/, "").split(".")[0]);
  return { major };
}
