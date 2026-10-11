//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/response-contract.ts
// Description : The REST API v1 response envelope (RESPONSES.md Section 7) and the success body builder
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-007, B-INC-001-AC-08
// API         : Internal functions; the envelope follows decisions/KR-BE-1-007-response-contract.md
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

// Every REST API v1 response that has a body uses this envelope, success or error. request_id is always a
// string: the server generates it for every request (KR-BE-1-005) and it equals the X-Request-ID header.
// Bodies never contain input values, stack traces or internal messages.

export const PROTOCOL_VERSION = "1.0";

// RESPONSES.md Section 13.
export type ResponseStatus =
  | "SUCCESS" | "ACCEPTED" | "REJECTED" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED"
  | "TIMEOUT" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "INVALID_REQUEST" | "UNAVAILABLE";

export type SuccessStatus = "SUCCESS" | "ACCEPTED" | "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface FieldError {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

// ERROR_CODES.md Section 8.
export interface ErrorObject {
  readonly details: Readonly<Record<string, unknown>>;
  readonly retryable: boolean;
  readonly field_errors: readonly FieldError[];
}

export interface ResponseEnvelope<T> {
  readonly protocol_version: typeof PROTOCOL_VERSION;
  readonly request_id: string;
  readonly timestamp: string;
  readonly status: ResponseStatus;
  readonly code: string;
  readonly message: string;
  readonly data: T | null;
  readonly error: ErrorObject | null;
}

export interface SuccessSpec {
  readonly status: SuccessStatus;
  // A stable machine-readable code. Each endpoint's contract defines its own; none is defined yet.
  readonly code: string;
  readonly message: string;
}

// UTC, whole seconds, like the examples in RESPONSES.md ("2026-10-08T00:00:01Z").
export function responseTimestamp(now: Date = new Date()): string {
  return now.toISOString().replace(/\.\d{3}Z$/, "Z");
}

// Handlers pass the request ID from request.requestContext. HTTP status is the handler's choice (200, 201, 202).
export function successBody<T>(spec: SuccessSpec, data: T, requestId: string, now: Date = new Date()): ResponseEnvelope<T> {
  return {
    protocol_version: PROTOCOL_VERSION,
    request_id: requestId,
    timestamp: responseTimestamp(now),
    status: spec.status,
    code: spec.code,
    message: spec.message,
    data,
    error: null,
  };
}
