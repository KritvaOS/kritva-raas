//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/error-contract.ts
// Description : Builds the API error response body and maps transport failures to documented error codes
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-004, B-INC-001-AC-06
// API         : Internal functions; the error body follows API_CONTRACT.md Section 18 (provisional until KR-BE-1-007)
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

// Provisional contract. docs/protocol/API_CONTRACT.md Section 18 and docs/protocol/RESPONSES.md plus
// ERROR_CODES.md describe different error envelopes. This task follows API_CONTRACT.md because the task
// names the API contract. KR-BE-1-007 settles the final envelope and codes; only this file changes then.
// Error bodies never contain input values, stack traces or internal messages.

export interface ErrorDetail {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

export interface ErrorBody {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly retryable: boolean;
    // The request ID of the failing request; null only if no request context was created.
    readonly request_id: string | null;
    readonly correlation_id: string | null;
    readonly details: readonly ErrorDetail[];
  };
}

export interface ErrorSpec {
  readonly status: number;
  readonly code: string;
  readonly message: string;
  readonly retryable: boolean;
}

export const ERRORS = {
  validation: { status: 400, code: "VALIDATION_ERROR", message: "The request contains invalid fields.", retryable: false },
  invalidJson: { status: 400, code: "INVALID_JSON", message: "The request body is not valid JSON.", retryable: false },
  notFound: { status: 404, code: "RESOURCE_NOT_FOUND", message: "The requested resource was not found.", retryable: false },
  methodNotAllowed: { status: 405, code: "METHOD_NOT_ALLOWED", message: "The HTTP method is not supported for this path.", retryable: false },
  payloadTooLarge: { status: 413, code: "PAYLOAD_TOO_LARGE", message: "The request body exceeds the allowed size.", retryable: false },
  unsupportedMediaType: { status: 415, code: "UNSUPPORTED_MEDIA_TYPE", message: "The request content type is not supported.", retryable: false },
  internal: { status: 500, code: "INTERNAL_ERROR", message: "An unexpected error occurred. Please try again.", retryable: true },
} as const satisfies Record<string, ErrorSpec>;

export function errorBody(spec: ErrorSpec, details: readonly ErrorDetail[] = [], requestId: string | null = null): ErrorBody {
  return {
    error: {
      code: spec.code,
      message: spec.message,
      retryable: spec.retryable,
      request_id: requestId,
      correlation_id: null,
      details,
    },
  };
}

interface ValidationIssue {
  readonly instancePath?: string;
  readonly keyword?: string;
  readonly params?: { readonly missingProperty?: unknown };
}

interface TransportError {
  readonly code?: unknown;
  readonly statusCode?: unknown;
  readonly validation?: unknown;
}

function isIssueList(value: unknown): value is readonly ValidationIssue[] {
  return Array.isArray(value);
}

function detailFromIssue(issue: ValidationIssue): ErrorDetail {
  const path = (issue.instancePath ?? "").replace(/^\//, "").replace(/\//g, ".");
  const missing = issue.params?.missingProperty;
  const field = typeof missing === "string" ? (path === "" ? missing : `${path}.${missing}`) : path;
  return issue.keyword === "required"
    ? { field, code: "REQUIRED_FIELD", message: "The field is required." }
    : { field, code: "INVALID_VALUE", message: "The field is invalid." };
}

export function classifyError(error: unknown): { spec: ErrorSpec; details: readonly ErrorDetail[] } {
  const e = (typeof error === "object" && error !== null ? error : {}) as TransportError;
  if (isIssueList(e.validation)) {
    return { spec: ERRORS.validation, details: e.validation.map(detailFromIssue) };
  }
  switch (e.code) {
    case "FST_ERR_CTP_BODY_TOO_LARGE":
      return { spec: ERRORS.payloadTooLarge, details: [] };
    case "FST_ERR_CTP_INVALID_MEDIA_TYPE":
      return { spec: ERRORS.unsupportedMediaType, details: [] };
    case "FST_ERR_CTP_EMPTY_JSON_BODY":
    case "FST_ERR_CTP_INVALID_JSON_BODY":
      return { spec: ERRORS.invalidJson, details: [] };
    default:
      break;
  }
  if (typeof e.statusCode === "number" && e.statusCode >= 400 && e.statusCode < 500) {
    return { spec: ERRORS.validation, details: [] };
  }
  return { spec: ERRORS.internal, details: [] };
}
