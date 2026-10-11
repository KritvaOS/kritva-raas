//==============================================================================
// Copyright (c) 2026 KritvaOS
// SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
//
// File        : apps/backend/src/transport/error-contract.ts
// Description : Builds the error response envelope and maps transport failures to registry error codes
//
// Component   : Control Plane
// Module      : HTTP Transport
// Layer       : API
//
// Requirements: KR-BE-1-004, KR-BE-1-007, B-INC-001-AC-06, B-INC-001-AC-08
// API         : Internal functions; the error body is the full envelope of decisions/KR-BE-1-007-response-contract.md
//
// Author      : KritvaOS
// Created     : 11-10-2026
//==============================================================================

import { PROTOCOL_VERSION, responseTimestamp, type FieldError, type ResponseEnvelope, type ResponseStatus } from "./response-contract.js";

// Codes come from the ERROR_CODES.md registry. Error bodies never contain input values, stack traces or
// internal messages. status is the application outcome (RESPONSES.md Section 13) and is independent of HTTP.

export interface ErrorSpec {
  readonly httpStatus: number;
  readonly status: ResponseStatus;
  readonly code: string;
  readonly message: string;
  readonly retryable: boolean;
}

export const ERRORS = {
  validation: { httpStatus: 400, status: "INVALID_REQUEST", code: "INVALID_REQUEST", message: "The request is invalid. Check the provided information and try again.", retryable: false },
  invalidJson: { httpStatus: 400, status: "INVALID_REQUEST", code: "INVALID_REQUEST", message: "The request is invalid. Check the provided information and try again.", retryable: false },
  notFound: { httpStatus: 404, status: "NOT_FOUND", code: "RESOURCE_NOT_FOUND", message: "The requested resource was not found.", retryable: false },
  methodNotAllowed: { httpStatus: 405, status: "INVALID_REQUEST", code: "METHOD_NOT_ALLOWED", message: "The request method is not supported for this resource.", retryable: false },
  payloadTooLarge: { httpStatus: 413, status: "REJECTED", code: "PAYLOAD_TOO_LARGE", message: "The request is too large.", retryable: false },
  unsupportedMediaType: { httpStatus: 415, status: "INVALID_REQUEST", code: "UNSUPPORTED_CONTENT_TYPE", message: "This content type is not supported.", retryable: false },
  internal: { httpStatus: 500, status: "FAILED", code: "INTERNAL_ERROR", message: "An unexpected error occurred. Please try again.", retryable: true },
} as const satisfies Record<string, ErrorSpec>;

export function errorBody(spec: ErrorSpec, fieldErrors: readonly FieldError[], requestId: string, now: Date = new Date()): ResponseEnvelope<null> {
  return {
    protocol_version: PROTOCOL_VERSION,
    request_id: requestId,
    timestamp: responseTimestamp(now),
    status: spec.status,
    code: spec.code,
    message: spec.message,
    data: null,
    error: { details: {}, retryable: spec.retryable, field_errors: fieldErrors },
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

function fieldErrorFromIssue(issue: ValidationIssue): FieldError {
  const path = (issue.instancePath ?? "").replace(/^\//, "").replace(/\//g, ".");
  const missing = issue.params?.missingProperty;
  const field = typeof missing === "string" ? (path === "" ? missing : `${path}.${missing}`) : path;
  return issue.keyword === "required"
    ? { field, code: "MISSING_REQUIRED_FIELD", message: "A required field is missing." }
    : { field, code: "FIELD_INVALID", message: "One or more fields contain invalid values." };
}

export function classifyError(error: unknown): { spec: ErrorSpec; fieldErrors: readonly FieldError[] } {
  const e = (typeof error === "object" && error !== null ? error : {}) as TransportError;
  if (isIssueList(e.validation)) {
    return { spec: ERRORS.validation, fieldErrors: e.validation.map(fieldErrorFromIssue) };
  }
  switch (e.code) {
    case "FST_ERR_CTP_BODY_TOO_LARGE":
      return { spec: ERRORS.payloadTooLarge, fieldErrors: [] };
    case "FST_ERR_CTP_INVALID_MEDIA_TYPE":
      return { spec: ERRORS.unsupportedMediaType, fieldErrors: [] };
    case "FST_ERR_CTP_EMPTY_JSON_BODY":
    case "FST_ERR_CTP_INVALID_JSON_BODY":
      return { spec: ERRORS.invalidJson, fieldErrors: [] };
    default:
      break;
  }
  if (typeof e.statusCode === "number" && e.statusCode >= 400 && e.statusCode < 500) {
    return { spec: ERRORS.validation, fieldErrors: [] };
  }
  return { spec: ERRORS.internal, fieldErrors: [] };
}
