# Kritva RaaS Error Code Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Error Code Specification |
| Path | `docs/protocol/ERROR_CODES.md` |
| Product | Kritva Robotics-as-a-Service |
| Protocol Model | Versioned, machine-readable error contract |
| Primary API | REST `/api/v1/` |
| Realtime | WebSocket |
| Lab Boundary | Secure Lab Channel |
| Desktop Boundary | Tauri IPC |
| Shared Contracts | `packages/contracts` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production error model and complete error code
registry for Kritva RaaS.

Error codes provide stable machine-readable meaning for failures across:

- Studio;
- Web Console;
- Control Plane;
- workers;
- Lab Agent;
- robot/runtime integration;
- REST APIs;
- WebSocket;
- Tauri IPC;
- asynchronous jobs;
- booking;
- credits;
- artifacts;
- execution;
- results.

The primary principle is:

> **HTTP status describes transport/API semantics; Kritva error codes describe domain meaning.**

Example:

    HTTP 409
    code = BOOKING_CONFLICT

The HTTP status tells the client that a conflict occurred.

The Kritva code tells the client which conflict occurred and what it should do.

## 3. Scope

This document defines:

- error terminology;
- error envelope;
- error-code naming;
- code categories;
- registry;
- HTTP mapping;
- transport mapping;
- retryability;
- user-facing messages;
- remediation guidance;
- validation errors;
- authentication errors;
- authorization errors;
- project errors;
- platform errors;
- artifact errors;
- booking errors;
- credit errors;
- job errors;
- run errors;
- result errors;
- Lab Agent errors;
- resource errors;
- telemetry errors;
- protocol errors;
- infrastructure errors;
- timeout errors;
- safety-related errors;
- rate-limit errors;
- idempotency errors;
- asynchronous failure handling;
- phase mapping;
- compatibility rules.

## 4. Goals

The error system shall:

1. provide stable machine-readable error codes;
2. provide deterministic client behavior;
3. distinguish retryable and non-retryable failures;
4. provide actionable remediation;
5. preserve security boundaries;
6. distinguish transport failure from domain failure;
7. support REST;
8. support WebSocket;
9. support Lab Agent communication;
10. support Tauri IPC;
11. support asynchronous jobs;
12. support production diagnostics;
13. support protocol evolution;
14. prevent leakage of internal implementation details.

## 5. Non-Goals

This document does not define:

- database error internals;
- SQLSTATE mappings in the public contract;
- cloud-provider-specific exception names;
- compiler-specific diagnostics;
- robot vendor-specific raw fault formats;
- physical emergency-stop implementation;
- internal stack traces;
- private infrastructure topology.

Internal failures may be logged internally but must be translated to stable
public error codes.

# 6. Error Model

The standard error response is:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "CONFLICT",
        "code": "BOOKING_CONFLICT",
        "message": "The selected robot is no longer available for this time slot.",
        "data": null,
        "error": {
            "details": {},
            "retryable": false,
            "field_errors": []
        }
    }

## 7. Error Fields

| Field | Required | Purpose |
|---|---:|---|
| `protocol_version` | Yes | Contract version |
| `request_id` | Yes | Request correlation |
| `timestamp` | Yes | Error response timestamp |
| `status` | Yes | High-level application status |
| `code` | Yes | Stable machine-readable error |
| `message` | Yes | Human-readable message |
| `data` | Yes | Normally `null` for failures |
| `error` | Yes | Structured error information |

## 8. Error Object

The standard error object is:

    {
        "details": {},
        "retryable": false,
        "field_errors": []
    }

Optional fields may include:

- `retry_after_seconds`;
- `documentation`;
- `operation_id`;
- `resource`;
- `conflict`;
- `causes`.

Sensitive internal details must never be returned.

## 9. Error Code

An error code is a stable identifier describing the semantic cause of failure.

Example:

    ARTIFACT_INCOMPATIBLE

Error codes are part of the protocol contract.

Clients must not parse `message` to determine behavior.

## 10. Error Code Naming

All error codes use:

    DOMAIN_REASON

Examples:

    INVALID_REQUEST
    AUTH_REQUIRED
    ARTIFACT_INCOMPATIBLE
    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    JOB_NOT_FOUND
    AGENT_OFFLINE

Rules:

- uppercase;
- underscore-separated;
- ASCII;
- stable;
- concise;
- no dynamic values;
- no HTTP status embedded in the code;
- no implementation class names;
- no vendor-specific exception names.

## 11. Error Code Stability

Once published, a code must not change meaning.

If semantics change incompatibly:

- introduce a new code;
- update documentation;
- preserve the old code during compatibility period where required.

## 12. Error Categories

Primary categories are:

| Category | Prefix |
|---|---|
| Generic | `GENERIC` or no prefix |
| Validation | `VALIDATION` |
| Authentication | `AUTH` |
| Authorization | `AUTHZ` |
| Organization | `ORG` |
| Project | `PROJECT` |
| Platform | `PLATFORM` |
| Artifact | `ARTIFACT` |
| Booking | `BOOKING` |
| Credit | `CREDIT` |
| Payment | `PAYMENT` |
| Job | `JOB` |
| Run | `RUN` |
| Result | `RESULT` |
| Experiment | `EXPERIMENT` |
| Lab Agent | `AGENT` |
| Resource | `RESOURCE` |
| Telemetry | `TELEMETRY` |
| Protocol | `PROTOCOL` |
| Rate Limit | `RATE_LIMIT` |
| Idempotency | `IDEMPOTENCY` |
| Infrastructure | `INFRA` |
| Safety | `SAFETY` |
| Local Runtime | `LOCAL` |

## 13. Retryability

Every operational error must define retry semantics.

Recommended values:

    retryable = true
    retryable = false

A retryable error means a retry may succeed without changing the request's
business meaning.

It does not mean the client should immediately retry in a tight loop.

## 14. Retry Classes

| Class | Meaning |
|---|---|
| `NO_RETRY` | Retry will not fix the condition |
| `RETRY_IMMEDIATE` | Short retry may succeed |
| `RETRY_BACKOFF` | Retry with exponential backoff |
| `RETRY_AFTER` | Retry after specified delay |
| `RECONCILE` | Query authoritative state before retry |
| `USER_ACTION` | User must change input/action |
| `ADMIN_ACTION` | Administrator intervention required |
| `SAFETY_STOP` | Do not automatically retry execution |

The public contract may expose the simpler `retryable` field while clients use
code-specific policies.

## 15. Retry Decision Flow

    Error
      |
      v
    Error Code
      |
      v
    Retry Policy
      |
      +--> NO_RETRY ------> Show remediation
      |
      +--> BACKOFF -------> Retry
      |
      +--> RETRY_AFTER ---> Wait
      |
      +--> RECONCILE -----> Query state
      |
      +--> SAFETY_STOP ----> Stop automatic execution

## 16. HTTP Mapping

| HTTP | Typical Status | Example |
|---:|---|---|
| 400 | `INVALID_REQUEST` | `INVALID_REQUEST` |
| 401 | `UNAUTHORIZED` | `AUTH_REQUIRED` |
| 403 | `FORBIDDEN` | `AUTHZ_DENIED` |
| 404 | `NOT_FOUND` | `JOB_NOT_FOUND` |
| 409 | `CONFLICT` | `BOOKING_CONFLICT` |
| 412 | `CONFLICT` | `VERSION_CONFLICT` |
| 413 | `REJECTED` | `ARTIFACT_TOO_LARGE` |
| 415 | `INVALID_REQUEST` | `UNSUPPORTED_CONTENT_TYPE` |
| 422 | `REJECTED` | `ARTIFACT_INVALID` |
| 429 | `UNAVAILABLE` | `RATE_LIMIT_EXCEEDED` |
| 500 | `FAILED` | `INTERNAL_ERROR` |
| 502 | `UNAVAILABLE` | `UPSTREAM_UNAVAILABLE` |
| 503 | `UNAVAILABLE` | `SERVICE_UNAVAILABLE` |
| 504 | `TIMEOUT` | `UPSTREAM_TIMEOUT` |

HTTP mapping is indicative, not the error-code contract itself.

## 17. Transport vs Application Status

The system distinguishes:

    HTTP transport
        |
        v
    Application status
        |
        v
    Error code

Example:

    HTTP 409
    status = CONFLICT
    code = BOOKING_CONFLICT

Another example:

    HTTP 503
    status = UNAVAILABLE
    code = AGENT_OFFLINE

## 18. WebSocket Errors

WebSocket errors use the same error-code registry.

Example:

    {
        "type": "error",
        "request_id": "req-123",
        "status": "FORBIDDEN",
        "code": "AUTHZ_DENIED",
        "message": "You are not authorized to subscribe to this resource.",
        "error": {
            "retryable": false
        }
    }

The transport remains WebSocket while the semantic code remains unchanged.

## 19. Lab Protocol Errors

The Lab Agent uses the same semantic registry where applicable.

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "status": "UNAVAILABLE",
        "code": "AGENT_OFFLINE",
        "message": "The lab agent is unavailable.",
        "data": null,
        "error": {
            "retryable": true
        }
    }

Vendor-specific robot faults may be represented in `details` while the public
Kritva code remains stable.

## 20. Local IPC Errors

Tauri IPC uses the same semantic model.

Example:

    {
        "status": "FAILED",
        "code": "LOCAL_TOOLCHAIN_NOT_FOUND",
        "message": "The required local toolchain was not found.",
        "error": {
            "retryable": false
        }
    }

## 21. User-Facing Messages

Messages must be:

- understandable;
- actionable where possible;
- safe;
- concise;
- free of internal implementation details.

Good:

    "The selected robot is no longer available for this time slot."

Bad:

    "Postgres exclusion constraint robot_booking_no_overlap failed."

## 22. User Message vs Diagnostic Detail

The client sees:

    BOOKING_CONFLICT
    "The selected robot is no longer available for this time slot."

Operators may see:

    booking_id
    resource_id
    transaction ID
    database constraint
    scheduler trace

Internal diagnostic information must not be exposed merely for convenience.

## 23. Field Validation Errors

Validation errors may include:

    {
        "field_errors": [
            {
                "field": "start_time",
                "code": "FIELD_INVALID",
                "message": "Start time must be in the future."
            }
        ]
    }

Field paths should be stable.

Example:

    booking.start_time

## 24. Error Details

`details` may contain structured remediation information.

Example:

    {
        "required_platform": "humanoid-a",
        "artifact_platform": "humanoid-b"
    }

Details must be:

- non-sensitive;
- documented where contractually relevant;
- machine-readable where clients depend on them.

# 25. Generic Error Registry

## 25.1 `INVALID_REQUEST`

Meaning:

The request is malformed or violates generic request requirements.

HTTP: 400.

Retryable: No.

User message:

    "The request is invalid. Check the provided information and try again."

Remediation:

- validate request;
- correct fields;
- resubmit.

Phase: 0.

## 25.2 `MISSING_REQUIRED_FIELD`

Meaning:

A required field was not provided.

HTTP: 400.

Retryable: No.

Message:

    "A required field is missing."

Remediation:

    Provide the missing field and try again.

Phase: 0.

## 25.3 `FIELD_INVALID`

Meaning:

A supplied field has an invalid value or format.

HTTP: 400.

Retryable: No.

Message:

    "One or more fields contain invalid values."

Remediation:

    Correct the indicated fields.

Phase: 0.

## 25.4 `UNSUPPORTED_CONTENT_TYPE`

Meaning:

The request content type is not supported.

HTTP: 415.

Retryable: No.

Message:

    "This content type is not supported."

Remediation:

    Use the documented content type.

Phase: 0.

## 25.5 `RESOURCE_NOT_FOUND`

Meaning:

Requested resource does not exist or is not visible.

HTTP: 404.

Retryable: No.

Message:

    "The requested resource was not found."

Remediation:

    Verify the resource ID and access permissions.

Phase: 0.

## 25.6 `VERSION_CONFLICT`

Meaning:

The client attempted to modify stale resource state.

HTTP: 409 or 412.

Retryable: Reconcile.

Message:

    "The resource has changed. Refresh and try again."

Remediation:

    Reload current state and retry using the latest version.

Phase: 0.

## 25.7 `INTERNAL_ERROR`

Meaning:

Unexpected server-side failure.

HTTP: 500.

Retryable: Retry with backoff.

Message:

    "An unexpected error occurred. Please try again."

Remediation:

    Retry with backoff. Contact support if the problem persists.

Phase: 8.

## 25.8 `SERVICE_UNAVAILABLE`

Meaning:

The service cannot currently process the request.

HTTP: 503.

Retryable: Yes.

Message:

    "The service is temporarily unavailable. Please try again shortly."

Remediation:

    Retry with backoff.

Phase: 8.

## 25.9 `UPSTREAM_UNAVAILABLE`

Meaning:

A required dependent service is unavailable.

HTTP: 502/503.

Retryable: Yes.

Message:

    "A required service is temporarily unavailable."

Remediation:

    Retry with backoff.

Phase: 8.

## 25.10 `UPSTREAM_TIMEOUT`

Meaning:

A required dependent service did not respond within the allowed time.

HTTP: 504.

Retryable: Reconcile.

Message:

    "The requested operation timed out while waiting for a dependent service."

Remediation:

    Check current operation state before retrying.

Phase: 8.

# 26. Validation Error Registry

## 26.1 `VALIDATION_FAILED`

Meaning:

The request failed domain validation.

HTTP: 422.

Retryable: No.

Message:

    "The request could not be completed because the provided information is invalid."

Phase: 0.

## 26.2 `VALIDATION_CONSTRAINT`

Meaning:

A domain constraint was violated.

HTTP: 422.

Retryable: No.

Message:

    "The requested operation violates a system requirement."

Phase: 0.

# 27. Authentication Error Registry

## 27.1 `AUTH_REQUIRED`

Meaning:

Authentication is required.

HTTP: 401.

Retryable: No.

Message:

    "Please sign in to continue."

Remediation:

    Authenticate and retry.

Phase: 1.

## 27.2 `AUTH_INVALID_CREDENTIALS`

Meaning:

Credentials are invalid.

HTTP: 401.

Retryable: No.

Message:

    "The sign-in information is incorrect."

Remediation:

    Verify credentials and retry.

Phase: 1.

## 27.3 `AUTH_SESSION_EXPIRED`

Meaning:

The session is no longer valid.

HTTP: 401.

Retryable: No.

Message:

    "Your session has expired. Please sign in again."

Remediation:

    Refresh authentication or sign in again.

Phase: 1.

## 27.4 `AUTH_TOKEN_INVALID`

Meaning:

The supplied authentication token is invalid.

HTTP: 401.

Retryable: No.

Message:

    "Your authentication session is invalid."

Phase: 1.

## 27.5 `AUTH_TOKEN_REVOKED`

Meaning:

The authentication token has been revoked.

HTTP: 401.

Retryable: No.

Message:

    "Your authentication session has been revoked."

Phase: 1.

# 28. Authorization Error Registry

## 28.1 `AUTHZ_DENIED`

Meaning:

Authenticated user lacks permission.

HTTP: 403.

Retryable: No.

Message:

    "You do not have permission to perform this operation."

Remediation:

    Request the required permission.

Phase: 1.

## 28.2 `AUTHZ_RESOURCE_DENIED`

Meaning:

User cannot access the specified resource.

HTTP: 403.

Retryable: No.

Message:

    "You do not have access to this resource."

Phase: 1.

## 28.3 `AUTHZ_ORGANIZATION_DENIED`

Meaning:

User is not authorized for the organization.

HTTP: 403.

Retryable: No.

Message:

    "You are not authorized for this organization."

Phase: 3.

## 28.4 `AUTHZ_ROLE_REQUIRED`

Meaning:

A specific role is required.

HTTP: 403.

Retryable: No.

Message:

    "Your account does not have the required role."

Phase: 3.

# 29. Organization Error Registry

## 29.1 `ORG_NOT_FOUND`

Meaning:

Organization does not exist or is not visible.

HTTP: 404.

Retryable: No.

Message:

    "The organization could not be found."

Phase: 3.

## 29.2 `ORG_MEMBER_NOT_FOUND`

Meaning:

Specified organization member does not exist.

HTTP: 404.

Retryable: No.

Message:

    "The organization member could not be found."

Phase: 3.

## 29.3 `ORG_MEMBER_EXISTS`

Meaning:

User is already a member.

HTTP: 409.

Retryable: No.

Message:

    "This user is already a member of the organization."

Phase: 3.

## 29.4 `ORG_MEMBER_LIMIT`

Meaning:

Organization has reached its membership limit.

HTTP: 409.

Retryable: No.

Message:

    "The organization has reached its member limit."

Phase: 3.

# 30. Project Error Registry

## 30.1 `PROJECT_NOT_FOUND`

Meaning:

Project does not exist or is not visible.

HTTP: 404.

Retryable: No.

Message:

    "The project could not be found."

Phase: 1.

## 30.2 `PROJECT_ARCHIVED`

Meaning:

The project is archived and cannot accept the requested modification.

HTTP: 409.

Retryable: No.

Message:

    "This project is archived and cannot be modified."

Phase: 1.

## 30.3 `PROJECT_NAME_CONFLICT`

Meaning:

Project name conflicts within the required scope.

HTTP: 409.

Retryable: No.

Message:

    "A project with this name already exists."

Phase: 1.

# 31. Platform Error Registry

## 31.1 `PLATFORM_NOT_FOUND`

Meaning:

Requested robot platform does not exist or is not visible.

HTTP: 404.

Retryable: No.

Message:

    "The selected robot platform could not be found."

Phase: 3.

## 31.2 `PLATFORM_VERSION_UNSUPPORTED`

Meaning:

Requested platform version is not supported.

HTTP: 422.

Retryable: No.

Message:

    "The selected platform version is not supported."

Phase: 3.

## 31.3 `PLATFORM_UNAVAILABLE`

Meaning:

Platform currently has no usable resources.

HTTP: 503.

Retryable: Yes.

Message:

    "This robot platform is currently unavailable."

Remediation:

    Try another time or platform.

Phase: 4.

## 31.4 `PLATFORM_CAPABILITY_MISSING`

Meaning:

Selected platform lacks a required capability.

HTTP: 422.

Retryable: No.

Message:

    "The selected robot does not provide a required capability."

Phase: 3.

## 31.5 `PLATFORM_INCOMPATIBLE`

Meaning:

Requested operation is incompatible with platform requirements.

HTTP: 422.

Retryable: No.

Message:

    "The selected platform is not compatible with this operation."

Phase: 3.

# 32. Artifact Error Registry

## 32.1 `ARTIFACT_NOT_FOUND`

Meaning:

Artifact does not exist or is not accessible.

HTTP: 404.

Retryable: No.

Message:

    "The artifact could not be found."

Phase: 2.

## 32.2 `ARTIFACT_INVALID`

Meaning:

Artifact package is structurally invalid.

HTTP: 422.

Retryable: No.

Message:

    "The artifact is invalid and cannot be executed."

Remediation:

    Rebuild and package the artifact using the supported SDK/toolchain.

Phase: 2.

## 32.3 `ARTIFACT_TOO_LARGE`

Meaning:

Artifact exceeds the permitted size.

HTTP: 413.

Retryable: No.

Message:

    "The artifact is larger than the permitted size."

Phase: 2.

## 32.4 `ARTIFACT_DIGEST_MISMATCH`

Meaning:

Uploaded content does not match declared digest.

HTTP: 422.

Retryable: No.

Message:

    "The uploaded artifact failed integrity verification."

Remediation:

    Recreate and upload the artifact.

Phase: 2.

## 32.5 `ARTIFACT_SIGNATURE_INVALID`

Meaning:

Artifact signature is missing, invalid, or untrusted.

HTTP: 422.

Retryable: No.

Message:

    "The artifact signature could not be verified."

Phase: 2.

## 32.6 `ARTIFACT_UNSIGNED`

Meaning:

Artifact requires signing but is unsigned.

HTTP: 422.

Retryable: No.

Message:

    "This artifact must be signed before it can be executed."

Phase: 8.

## 32.7 `ARTIFACT_INCOMPATIBLE`

Meaning:

Artifact requirements do not match selected platform/runtime.

HTTP: 422.

Retryable: No.

Message:

    "The artifact is not compatible with the selected robot platform."

Remediation:

    Build for the selected platform and supported runtime.

Phase: 2.

## 32.8 `ARTIFACT_RUNTIME_UNSUPPORTED`

Meaning:

Artifact requires an unsupported Kritva Runtime version.

HTTP: 422.

Retryable: No.

Message:

    "The artifact requires an unsupported Kritva Runtime version."

Phase: 2.

## 32.9 `ARTIFACT_SDK_UNSUPPORTED`

Meaning:

Artifact was built against an unsupported SDK version.

HTTP: 422.

Retryable: No.

Message:

    "The artifact was built with an unsupported SDK version."

Phase: 2.

## 32.10 `ARTIFACT_CAPABILITY_MISSING`

Meaning:

Artifact requires capabilities unavailable on the selected resource.

HTTP: 422.

Retryable: No.

Message:

    "The selected robot does not provide all capabilities required by the artifact."

Phase: 2.

## 32.11 `ARTIFACT_REJECTED`

Meaning:

Artifact failed policy or validation.

HTTP: 422.

Retryable: No.

Message:

    "The artifact was rejected by the execution policy."

Phase: 2.

## 32.12 `ARTIFACT_REVOKED`

Meaning:

Artifact has been revoked and cannot be executed.

HTTP: 409.

Retryable: No.

Message:

    "This artifact has been revoked and cannot be executed."

Phase: 8.

## 32.13 `ARTIFACT_EXPIRED`

Meaning:

Artifact is outside its permitted lifecycle.

HTTP: 409.

Retryable: No.

Message:

    "This artifact has expired and cannot be executed."

Phase: 8.

## 32.14 `ARTIFACT_UPLOAD_INCOMPLETE`

Meaning:

Artifact upload has not completed.

HTTP: 409.

Retryable: Yes.

Message:

    "The artifact upload has not completed."

Remediation:

    Resume or restart the upload.

Phase: 2.

# 33. Booking Error Registry

## 33.1 `BOOKING_NOT_FOUND`

Meaning:

Booking does not exist or is not accessible.

HTTP: 404.

Retryable: No.

Message:

    "The booking could not be found."

Phase: 4.

## 33.2 `BOOKING_CONFLICT`

Meaning:

Requested slot conflicts with another allocation.

HTTP: 409.

Retryable: No.

Message:

    "The selected robot is no longer available for this time slot."

Remediation:

    Select another time or robot.

Phase: 4.

## 33.3 `BOOKING_INVALID_WINDOW`

Meaning:

Requested booking duration/window is invalid.

HTTP: 422.

Retryable: No.

Message:

    "The selected booking time is invalid."

Phase: 4.

## 33.4 `BOOKING_TOO_SHORT`

Meaning:

Booking is shorter than the permitted minimum.

HTTP: 422.

Retryable: No.

Message:

    "The booking duration is shorter than the minimum allowed duration."

Phase: 4.

## 33.5 `BOOKING_TOO_LONG`

Meaning:

Booking exceeds the permitted maximum.

HTTP: 422.

Retryable: No.

Message:

    "The booking duration exceeds the maximum allowed duration."

Phase: 4.

## 33.6 `BOOKING_OUTSIDE_AVAILABILITY`

Meaning:

Requested time is outside platform/resource availability.

HTTP: 409.

Retryable: No.

Message:

    "The selected robot is not available during this time."

Phase: 4.

## 33.7 `BOOKING_CANCELLED`

Meaning:

Requested operation requires an active booking, but booking is cancelled.

HTTP: 409.

Retryable: No.

Message:

    "This booking has been cancelled."

Phase: 4.

## 33.8 `BOOKING_EXPIRED`

Meaning:

Booking window has expired.

HTTP: 409.

Retryable: No.

Message:

    "This booking has expired."

Phase: 4.

## 33.9 `BOOKING_MODIFICATION_NOT_ALLOWED`

Meaning:

Booking cannot be modified in its current state.

HTTP: 409.

Retryable: No.

Message:

    "This booking can no longer be modified."

Phase: 4.

## 33.10 `BOOKING_CANCELLATION_NOT_ALLOWED`

Meaning:

Booking cannot be cancelled under the current policy.

HTTP: 409.

Retryable: No.

Message:

    "This booking can no longer be cancelled."

Phase: 4.

# 34. Credit Error Registry

## 34.1 `CREDIT_WALLET_NOT_FOUND`

Meaning:

Required platform-specific wallet does not exist.

HTTP: 404.

Retryable: No.

Message:

    "The required credit wallet could not be found."

Phase: 4.

## 34.2 `INSUFFICIENT_CREDITS`

Meaning:

Wallet balance is insufficient.

HTTP: 409.

Retryable: No.

Message:

    "You do not have enough credits for this operation."

Remediation:

    Add credits or choose a shorter/less expensive execution.

Phase: 4.

## 34.3 `CREDIT_PLATFORM_MISMATCH`

Meaning:

Credits belong to a different robotic platform.

HTTP: 409.

Retryable: No.

Message:

    "These credits cannot be used for the selected robot platform."

Phase: 4.

## 34.4 `CREDIT_PLAN_INVALID`

Meaning:

Selected credit plan is not applicable.

HTTP: 422.

Retryable: No.

Message:

    "The selected credit plan cannot be used for this operation."

Phase: 4.

## 34.5 `CREDIT_CONSUMPTION_FAILED`

Meaning:

Credit consumption could not be completed.

HTTP: 503 or 500.

Retryable: Reconcile.

Message:

    "Credit consumption could not be completed. Please check your balance before retrying."

Phase: 4.

## 34.6 `CREDIT_REFUND_FAILED`

Meaning:

Refund could not be completed.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The refund could not be completed. Your account will be reconciled automatically."

Phase: 4.

## 34.7 `CREDIT_TRANSACTION_CONFLICT`

Meaning:

Credit operation conflicts with an existing transaction.

HTTP: 409.

Retryable: Reconcile.

Message:

    "This credit operation conflicts with an existing transaction."

Phase: 4.

# 35. Payment Error Registry

## 35.1 `PAYMENT_REQUIRED`

Meaning:

Payment is required before access can continue.

HTTP: 402 or application-specific equivalent.

Retryable: No.

Message:

    "Payment is required to continue."

Phase: 4.

## 35.2 `PAYMENT_FAILED`

Meaning:

Payment provider rejected or failed the payment.

HTTP: 402.

Retryable: No.

Message:

    "The payment could not be completed."

Remediation:

    Verify payment details or use another payment method.

Phase: 4.

## 35.3 `PAYMENT_PENDING`

Meaning:

Payment is still being processed.

HTTP: 202.

Retryable: No immediate retry.

Message:

    "Your payment is still being processed."

Phase: 4.

## 35.4 `PAYMENT_PROVIDER_UNAVAILABLE`

Meaning:

Payment provider is temporarily unavailable.

HTTP: 503.

Retryable: Yes.

Message:

    "The payment service is temporarily unavailable."

Phase: 8.

# 36. Job Error Registry

## 36.1 `JOB_NOT_FOUND`

Meaning:

Job does not exist or is not accessible.

HTTP: 404.

Retryable: No.

Message:

    "The requested job could not be found."

Phase: 5.

## 36.2 `JOB_INVALID_STATE`

Meaning:

Requested operation is invalid for the current job state.

HTTP: 409.

Retryable: No.

Message:

    "This operation is not allowed in the job's current state."

Phase: 5.

## 36.3 `JOB_BOOKING_REQUIRED`

Meaning:

A valid booking is required.

HTTP: 409.

Retryable: No.

Message:

    "A valid robot booking is required before this job can start."

Phase: 5.

## 36.4 `JOB_BOOKING_EXPIRED`

Meaning:

Associated booking has expired.

HTTP: 409.

Retryable: No.

Message:

    "The booking for this job has expired."

Phase: 5.

## 36.5 `JOB_ARTIFACT_REQUIRED`

Meaning:

No executable artifact is associated with the job.

HTTP: 422.

Retryable: No.

Message:

    "An executable artifact is required before the job can start."

Phase: 5.

## 36.6 `JOB_ARTIFACT_REJECTED`

Meaning:

Associated artifact cannot be executed.

HTTP: 409.

Retryable: No.

Message:

    "The selected artifact cannot be executed."

Phase: 5.

## 36.7 `JOB_RESOURCE_UNAVAILABLE`

Meaning:

No suitable robot resource is currently available.

HTTP: 503.

Retryable: Yes.

Message:

    "A suitable robot resource is currently unavailable."

Phase: 5.

## 36.8 `JOB_DEPLOYMENT_FAILED`

Meaning:

Artifact deployment failed.

HTTP: 502/503.

Retryable: Reconcile.

Message:

    "The application could not be deployed to the robot."

Phase: 5.

## 36.9 `JOB_START_FAILED`

Meaning:

Execution could not be started.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The job could not be started on the robot."

Phase: 5.

## 36.10 `JOB_STOP_FAILED`

Meaning:

Requested application/job stop could not be confirmed.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The job stop could not be confirmed. Robot state is being reconciled."

Phase: 5.

## 36.11 `JOB_TIMEOUT`

Meaning:

Job exceeded its permitted execution time.

HTTP: 504.

Retryable: Reconcile.

Message:

    "The job exceeded its permitted execution time."

Phase: 8.

## 36.12 `JOB_FAILED`

Meaning:

Job reached terminal failure.

HTTP: 409 or 500 depending on cause.

Retryable: Reconcile.

Message:

    "The job failed during execution."

Phase: 5.

# 37. Run Error Registry

## 37.1 `RUN_NOT_FOUND`

Meaning:

Run does not exist or is not accessible.

HTTP: 404.

Retryable: No.

Message:

    "The requested run could not be found."

Phase: 7.

## 37.2 `RUN_INVALID_STATE`

Meaning:

Requested run operation is invalid for its current state.

HTTP: 409.

Retryable: No.

Message:

    "This operation is not allowed in the run's current state."

Phase: 7.

## 37.3 `RUN_START_FAILED`

Meaning:

Runtime could not start execution.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The robot runtime could not start the application."

Phase: 7.

## 37.4 `RUN_STOP_FAILED`

Meaning:

Run stop could not be confirmed.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The run stop could not be confirmed. The system is checking robot state."

Phase: 7.

## 37.5 `RUN_RUNTIME_FAILURE`

Meaning:

Application/runtime failed during execution.

HTTP: 409.

Retryable: No automatic retry.

Message:

    "The application runtime failed during execution."

Phase: 7.

## 37.6 `RUN_RECONCILIATION_REQUIRED`

Meaning:

Control Plane cannot determine the final physical run state.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The robot state could not be confirmed. The system is reconciling the run."

Phase: 6–8.

# 38. Result Error Registry

## 38.1 `RESULT_NOT_FOUND`

Meaning:

Result does not exist or is not accessible.

HTTP: 404.

Retryable: No.

Message:

    "The requested result could not be found."

Phase: 7.

## 38.2 `RESULT_NOT_READY`

Meaning:

Result is not yet available.

HTTP: 409.

Retryable: Yes.

Message:

    "The result is still being processed."

Phase: 7.

## 38.3 `RESULT_PROCESSING_FAILED`

Meaning:

Result processing failed.

HTTP: 500/503.

Retryable: Yes.

Message:

    "The result could not be processed."

Phase: 7.

## 38.4 `RESULT_FILE_NOT_FOUND`

Meaning:

Expected result file is unavailable.

HTTP: 404/503.

Retryable: Reconcile.

Message:

    "The requested result file is currently unavailable."

Phase: 7.

## 38.5 `RESULT_DOWNLOAD_FAILED`

Meaning:

Result download could not be completed.

HTTP: 503.

Retryable: Yes.

Message:

    "The result could not be downloaded. Please try again."

Phase: 7.

# 39. Experiment Error Registry

## 39.1 `EXPERIMENT_NOT_FOUND`

Meaning:

Experiment does not exist or is inaccessible.

HTTP: 404.

Retryable: No.

Message:

    "The experiment could not be found."

Phase: 7.

## 39.2 `EXPERIMENT_INVALID_STATE`

Meaning:

Experiment operation is invalid in current state.

HTTP: 409.

Retryable: No.

Message:

    "This operation is not allowed for the experiment's current state."

Phase: 7.

## 39.3 `EXPERIMENT_RUN_LIMIT`

Meaning:

Experiment has reached its permitted run count.

HTTP: 409.

Retryable: No.

Message:

    "This experiment has reached its run limit."

Phase: 7.

# 40. Lab Agent Error Registry

## 40.1 `AGENT_NOT_FOUND`

Meaning:

Lab Agent is not registered.

HTTP: 404.

Retryable: No.

Message:

    "The lab agent could not be found."

Phase: 5.

## 40.2 `AGENT_OFFLINE`

Meaning:

Lab Agent is not currently reachable.

HTTP: 503.

Retryable: Yes.

Message:

    "The lab is currently offline."

Remediation:

    Retry after the lab reconnects.

Phase: 5.

## 40.3 `AGENT_UNHEALTHY`

Meaning:

Agent is connected but not healthy enough for requested operation.

HTTP: 503.

Retryable: Yes.

Message:

    "The lab is currently not healthy enough to run this operation."

Phase: 6.

## 40.4 `AGENT_VERSION_UNSUPPORTED`

Meaning:

Agent version is incompatible with the Control Plane protocol.

HTTP: 409.

Retryable: No until upgraded.

Message:

    "The lab agent version is not supported."

Remediation:

    Upgrade the Lab Agent.

Phase: 6.

## 40.5 `AGENT_AUTHENTICATION_FAILED`

Meaning:

Lab Agent identity could not be authenticated.

HTTP: 401.

Retryable: No.

Message:

    "The lab agent could not be authenticated."

Phase: 6.

## 40.6 `AGENT_CAPABILITY_MISSING`

Meaning:

Agent does not provide a required capability.

HTTP: 422.

Retryable: No.

Message:

    "The lab does not provide a required capability."

Phase: 6.

## 40.7 `AGENT_CONFIGURATION_INVALID`

Meaning:

Agent configuration is invalid.

HTTP: 422.

Retryable: No.

Message:

    "The lab agent configuration is invalid."

Phase: 6.

## 40.8 `AGENT_HEARTBEAT_TIMEOUT`

Meaning:

Expected heartbeat was not received.

HTTP: 503.

Retryable: Yes.

Message:

    "The lab connection has timed out."

Phase: 6.

# 41. Resource Error Registry

## 41.1 `RESOURCE_NOT_FOUND`

Meaning:

Robot or execution resource does not exist.

HTTP: 404.

Retryable: No.

Message:

    "The requested robot resource could not be found."

Phase: 5.

## 41.2 `RESOURCE_UNAVAILABLE`

Meaning:

Resource is not currently available.

HTTP: 503.

Retryable: Yes.

Message:

    "The robot resource is currently unavailable."

Phase: 5.

## 41.3 `RESOURCE_RESERVED`

Meaning:

Resource is already reserved.

HTTP: 409.

Retryable: No.

Message:

    "The robot resource is already reserved."

Phase: 5.

## 41.4 `RESOURCE_BUSY`

Meaning:

Resource is currently executing another job.

HTTP: 409.

Retryable: No.

Message:

    "The robot resource is currently busy."

Phase: 5.

## 41.5 `RESOURCE_LOCK_FAILED`

Meaning:

Required resource lock could not be acquired.

HTTP: 409/503.

Retryable: Yes with backoff.

Message:

    "The robot resource could not be reserved."

Phase: 5.

## 41.6 `RESOURCE_RELEASE_FAILED`

Meaning:

Resource release could not be confirmed.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The robot resource release could not be confirmed."

Phase: 5.

## 41.7 `RESOURCE_FAULT`

Meaning:

Robot resource has entered a fault state.

HTTP: 503.

Retryable: No automatic execution retry.

Message:

    "The robot is reporting a fault and cannot run this operation."

Phase: 6.

## 41.8 `RESOURCE_MAINTENANCE`

Meaning:

Robot resource is under maintenance.

HTTP: 503.

Retryable: Yes.

Message:

    "The robot is currently under maintenance."

Phase: 6.

# 42. Telemetry Error Registry

## 42.1 `TELEMETRY_UNAVAILABLE`

Meaning:

Telemetry is temporarily unavailable.

HTTP: 503.

Retryable: Yes.

Message:

    "Live telemetry is temporarily unavailable."

Phase: 7.

## 42.2 `TELEMETRY_DEGRADED`

Meaning:

Telemetry is available but incomplete or degraded.

HTTP: 200 with event/data status, not normally a request failure.

Retryable: Yes.

Message:

    "Live telemetry is currently degraded."

Phase: 7.

## 42.3 `TELEMETRY_INVALID`

Meaning:

A telemetry measurement failed quality validation.

HTTP: 200 for data streams.

Retryable: No for the individual sample.

Message:

    "A telemetry measurement is invalid."

Phase: 7.

## 42.4 `TELEMETRY_RATE_LIMITED`

Meaning:

Telemetry delivery was reduced because of rate limits.

HTTP: 429 where request-based.

Retryable: Yes.

Message:

    "Telemetry delivery has been temporarily reduced."

Phase: 7.

# 43. Protocol Error Registry

## 43.1 `PROTOCOL_VERSION_UNSUPPORTED`

Meaning:

Peer protocol version is not supported.

HTTP: 400 or 409.

Retryable: No until compatibility is restored.

Message:

    "The protocol version is not supported."

Phase: 0.

## 43.2 `PROTOCOL_MESSAGE_INVALID`

Meaning:

Protocol message cannot be parsed or validated.

HTTP: 400.

Retryable: No.

Message:

    "The message format is invalid."

Phase: 0.

## 43.3 `PROTOCOL_COMMAND_UNKNOWN`

Meaning:

Requested command is not recognized.

HTTP: 400.

Retryable: No.

Message:

    "The requested operation is not supported."

Phase: 0.

## 43.4 `PROTOCOL_EVENT_UNKNOWN`

Meaning:

Consumer received an unsupported event type.

HTTP: Not applicable.

Retryable: No.

Message:

    "The event type is not supported by this client."

Phase: 0.

## 43.5 `PROTOCOL_SCHEMA_UNSUPPORTED`

Meaning:

Payload schema version is unsupported.

HTTP: 409.

Retryable: No until upgraded.

Message:

    "The message schema is not supported."

Phase: 0.

# 44. Rate Limit Error Registry

## 44.1 `RATE_LIMIT_EXCEEDED`

Meaning:

Client exceeded an allowed request or event rate.

HTTP: 429.

Retryable: Yes.

Message:

    "Too many requests. Please try again later."

Remediation:

    Wait for the specified retry interval.

Phase: 8.

## 44.2 `RATE_LIMIT_SUBSCRIPTION`

Meaning:

Client exceeded realtime subscription limits.

HTTP: 429.

Retryable: Yes after reducing subscriptions.

Message:

    "Too many realtime subscriptions are active."

Phase: 8.

## 44.3 `RATE_LIMIT_TELEMETRY`

Meaning:

Telemetry rate exceeds the permitted limit.

HTTP: 429 or stream-level status.

Retryable: Yes after reducing rate.

Message:

    "Telemetry rate exceeds the permitted limit."

Phase: 7.

# 45. Idempotency Error Registry

## 45.1 `IDEMPOTENCY_KEY_REQUIRED`

Meaning:

Operation requires an idempotency key.

HTTP: 400.

Retryable: No until key is supplied.

Message:

    "An idempotency key is required for this operation."

Phase: 4.

## 45.2 `IDEMPOTENCY_KEY_REUSED`

Meaning:

Idempotency key is being reused with different request data.

HTTP: 409.

Retryable: No.

Message:

    "This idempotency key has already been used for a different request."

Phase: 4.

## 45.3 `IDEMPOTENCY_RESULT_UNAVAILABLE`

Meaning:

Previous idempotent operation exists but its result cannot currently be retrieved.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The previous operation is being reconciled. Please try again later."

Phase: 4.

# 46. Infrastructure Error Registry

## 46.1 `INFRA_DATABASE_UNAVAILABLE`

Meaning:

Required database service is unavailable.

HTTP: 503.

Retryable: Yes with backoff.

Message:

    "The service is temporarily unable to access its data store."

Phase: 8.

## 46.2 `INFRA_STORAGE_UNAVAILABLE`

Meaning:

Object storage is unavailable.

HTTP: 503.

Retryable: Yes.

Message:

    "File storage is temporarily unavailable."

Phase: 8.

## 46.3 `INFRA_QUEUE_UNAVAILABLE`

Meaning:

Asynchronous queue is unavailable.

HTTP: 503.

Retryable: Yes.

Message:

    "Background processing is temporarily unavailable."

Phase: 8.

## 46.4 `INFRA_SECRET_UNAVAILABLE`

Meaning:

Required secret could not be retrieved.

HTTP: 503.

Retryable: Yes.

Message:

    "A required service configuration is temporarily unavailable."

Phase: 8.

## 46.5 `INFRA_CONFIGURATION_INVALID`

Meaning:

Required runtime configuration is invalid.

HTTP: 500.

Retryable: No until corrected.

Message:

    "The service is incorrectly configured."

Phase: 8.

# 47. Safety Error Registry

Safety errors require special handling.

Automatic retry must not create an unsafe robot condition.

## 47.1 `SAFETY_INTERLOCK_ACTIVE`

Meaning:

A local safety interlock prevents operation.

HTTP: 409.

Retryable: No automatic retry.

Message:

    "The robot safety interlock is active."

Remediation:

    Resolve the local safety condition according to approved procedures.

Phase: 6.

## 47.2 `SAFETY_ESTOP_ACTIVE`

Meaning:

Physical or approved local emergency stop is active.

HTTP: 409.

Retryable: Safety stop.

Message:

    "The robot emergency stop is active."

Phase: 6.

## 47.3 `SAFETY_OPERATION_BLOCKED`

Meaning:

Safety policy prevents execution.

HTTP: 409.

Retryable: No automatic retry.

Message:

    "The operation is blocked by the robot safety policy."

Phase: 6.

## 47.4 `SAFETY_STATE_UNKNOWN`

Meaning:

The system cannot confirm the robot safety state.

HTTP: 503.

Retryable: Reconcile.

Message:

    "The robot safety state could not be confirmed."

Phase: 6.

This code must be treated as a fail-safe condition.

# 48. Local Runtime Error Registry

## 48.1 `LOCAL_TOOLCHAIN_NOT_FOUND`

Meaning:

Required local compiler/toolchain is unavailable.

HTTP: Not applicable.

IPC status: FAILED.

Retryable: No.

Message:

    "The required local toolchain was not found."

Phase: 1.

## 48.2 `LOCAL_BUILD_FAILED`

Meaning:

Local build failed.

IPC status: FAILED.

Retryable: No.

Message:

    "The local build failed. Review the build diagnostics."

Phase: 1.

## 48.3 `LOCAL_TEST_FAILED`

Meaning:

Local tests failed.

IPC status: FAILED.

Retryable: No.

Message:

    "One or more local tests failed."

Phase: 1.

## 48.4 `LOCAL_ARTIFACT_PACKAGE_FAILED`

Meaning:

The `.krv` artifact could not be created.

IPC status: FAILED.

Retryable: No.

Message:

    "The execution artifact could not be packaged."

Phase: 2.

## 48.5 `LOCAL_ARTIFACT_SOURCE_DETECTED`

Meaning:

The package contains disallowed source or development files.

IPC status: REJECTED.

Retryable: No.

Message:

    "The artifact contains files that are not allowed in an execution package."

Phase: 2.

# 49. Error Response Examples

## 49.1 Invalid Request

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "INVALID_REQUEST",
        "code": "MISSING_REQUIRED_FIELD",
        "message": "A required field is missing.",
        "data": null,
        "error": {
            "retryable": false,
            "field_errors": [
                {
                    "field": "platform_id",
                    "code": "MISSING_REQUIRED_FIELD",
                    "message": "Platform is required."
                }
            ]
        }
    }

## 49.2 Booking Conflict

    {
        "protocol_version": "1.0",
        "request_id": "req-002",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "CONFLICT",
        "code": "BOOKING_CONFLICT",
        "message": "The selected robot is no longer available for this time slot.",
        "data": null,
        "error": {
            "retryable": false,
            "details": {
                "platform_id": "humanoid-a"
            }
        }
    }

## 49.3 Insufficient Credits

    {
        "protocol_version": "1.0",
        "request_id": "req-003",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "CONFLICT",
        "code": "INSUFFICIENT_CREDITS",
        "message": "You do not have enough credits for this operation.",
        "data": null,
        "error": {
            "retryable": false,
            "details": {
                "required": 450,
                "available": 200
            }
        }
    }

## 49.4 Agent Offline

    {
        "protocol_version": "1.0",
        "request_id": "req-004",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "UNAVAILABLE",
        "code": "AGENT_OFFLINE",
        "message": "The lab is currently offline.",
        "data": null,
        "error": {
            "retryable": true,
            "retry_after_seconds": 30
        }
    }

## 49.5 Safety State Unknown

    {
        "protocol_version": "1.0",
        "request_id": "req-005",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "UNAVAILABLE",
        "code": "SAFETY_STATE_UNKNOWN",
        "message": "The robot safety state could not be confirmed.",
        "data": null,
        "error": {
            "retryable": false,
            "details": {
                "reconciliation_required": true
            }
        }
    }

# 50. Retry-After

Retryable errors may include:

    "retry_after_seconds": 30

Clients should prefer this value over locally invented retry intervals.

If absent, clients should use exponential backoff with jitter.

# 51. Retry Algorithm

Recommended:

    initial_delay = 1 second
    maximum_delay = 60 seconds
    exponential_backoff = true
    jitter = true

This is a client behavior guideline rather than a protocol requirement.

Safety-related operations are excluded from automatic retry unless explicitly
authorized by the safety design.

# 52. Reconciliation Errors

Some failures are not safe to retry blindly.

Examples:

    UPSTREAM_TIMEOUT
    CREDIT_CONSUMPTION_FAILED
    JOB_TIMEOUT
    JOB_STOP_FAILED
    RUN_RECONCILIATION_REQUIRED
    RESOURCE_RELEASE_FAILED

The client should:

    error
      |
      v
    query authoritative state
      |
      +--> completed
      +--> failed
      +--> still running
      +--> unknown
      |
      v
    decide next action

# 53. Error Correlation

Every API error should include:

    request_id

Where asynchronous processing exists, it may also include:

    operation_id
    job_id
    run_id

This allows operators to trace:

    Request
       |
       v
    Error
       |
       v
    Worker
       |
       v
    Lab Agent
       |
       v
    Robot

# 54. Error Logging

Server logs should include:

- request ID;
- event ID where applicable;
- error code;
- operation ID;
- organization ID;
- user ID where permitted;
- resource ID;
- timestamp;
- retryability;
- internal cause.

Logs must not expose secrets.

# 55. Error Metrics

Recommended operational metrics:

    errors_total
    errors_by_code
    retryable_errors_total
    non_retryable_errors_total
    reconciliation_errors_total
    safety_errors_total
    auth_errors_total
    booking_conflicts_total
    insufficient_credits_total
    agent_offline_total

# 56. Error Monitoring

Critical alerts should include:

- spike in `INTERNAL_ERROR`;
- spike in `INFRA_DATABASE_UNAVAILABLE`;
- spike in `AGENT_OFFLINE`;
- repeated `SAFETY_STATE_UNKNOWN`;
- repeated `RUN_RECONCILIATION_REQUIRED`;
- credit transaction failures;
- excessive job failures;
- event delivery failures.

# 57. Error Registry Governance

Every new error code must define:

- code;
- category;
- meaning;
- status;
- HTTP mapping;
- retryability;
- user message;
- remediation;
- phase;
- owning module;
- compatibility impact.

No implementation should introduce undocumented public error codes.

# 58. Error Code Ownership

| Category | Owner |
|---|---|
| Generic | Protocol |
| Validation | Protocol/API |
| Auth | Identity |
| AuthZ | Identity/Organization |
| Organization | Organization |
| Project | Project |
| Platform | Platform |
| Artifact | Artifact |
| Booking | Booking |
| Credit | Credit |
| Payment | Commercial |
| Job | Execution |
| Run | Execution |
| Result | Result |
| Experiment | Experiment |
| Agent | Lab |
| Resource | Lab/Resource |
| Telemetry | Runtime/Observability |
| Protocol | Protocol |
| Rate Limit | API Gateway |
| Idempotency | Platform |
| Infrastructure | Cloud/Platform |
| Safety | Lab/Safety |
| Local | Studio |

# 59. Error Contract Location

The canonical error contract belongs in:

    packages/contracts/

Recommended structure:

    packages/contracts/
        errors/
            common/
            auth/
            authorization/
            organization/
            project/
            platform/
            artifact/
            booking/
            credit/
            payment/
            job/
            run/
            result/
            experiment/
            agent/
            resource/
            telemetry/
            protocol/
            infrastructure/
            safety/
            local/

# 60. Client Handling Rules

Clients must:

1. branch on `code`;
2. use `message` for display where appropriate;
3. inspect `retryable`;
4. honor `retry_after_seconds`;
5. inspect field errors for validation;
6. query authoritative state after reconciliation errors;
7. never expose internal details;
8. never treat HTTP status alone as domain meaning.

# 61. Studio Error UX

Studio should map errors into:

- inline field errors;
- build diagnostics;
- artifact validation errors;
- booking conflicts;
- insufficient credit notifications;
- execution state errors;
- live connectivity status;
- safety warnings.

Example:

    BOOKING_CONFLICT
       |
       v
    "Robot unavailable"
       |
       v
    "Choose another time"

# 62. Web Console Error UX

The Web Console should provide:

- actionable error messages;
- retry controls where safe;
- links to affected resources;
- support/reference IDs;
- admin diagnostics where authorized.

# 63. Admin Error UX

Administrators may receive additional operational context:

- error code;
- request ID;
- operation ID;
- resource ID;
- affected lab;
- retryability;
- service health;
- remediation state.

They should still not receive secrets or sensitive credentials.

# 64. Lab Agent Error Handling

Lab Agent errors must preserve:

- stable Kritva code;
- local diagnostic detail;
- robot/vendor fault code where permitted.

Example:

    Kritva code:
        RESOURCE_FAULT

    Vendor detail:
        MOTOR_CTRL_0x32

The vendor code is diagnostic metadata, not the primary RaaS contract.

# 65. Error Translation

Internal exceptions must be translated:

    DatabaseTimeoutException
             |
             v
    INFRA_DATABASE_UNAVAILABLE

    VendorMotorFault
             |
             v
    RESOURCE_FAULT

    InvalidArtifactManifest
             |
             v
    ARTIFACT_INVALID

Clients must never depend on internal exception names.

# 66. Error Translation Rules

Translation must be:

- deterministic;
- documented;
- stable;
- security-aware;
- context-preserving.

Internal cause information remains in logs/traces.

# 67. Asynchronous Error Model

Async operations may initially succeed:

    job.start
       |
       v
    HTTP 202
    status = ACCEPTED
       |
       v
    job.running
       |
       v
    job.failed

The initial API response is not a guarantee that execution succeeds.

Terminal failure is represented by durable job/run state and corresponding events.

# 68. Error Event Relationship

A terminal asynchronous error should normally result in an event:

    job.failed
       |
       +--> code = JOB_START_FAILED
       |
       +--> failure details

The exact event payload should remain consistent with the error registry.

# 69. Error and Event Separation

Errors answer:

> Why did this request/operation fail?

Events answer:

> What happened?

For example:

    POST /jobs/job-001/start
        |
        v
    409 JOB_INVALID_STATE

Later:

    job.failed

The error explains request rejection.

The event communicates execution lifecycle.

# 70. Error and Response Relationship

A response may contain:

    status = REJECTED
    code = ARTIFACT_INCOMPATIBLE

An event may later contain:

    artifact.rejected

The two contracts are related but not interchangeable.

# 71. Phase Mapping

| Phase | Error Work |
|---|---|
| Phase 0 | Generic, validation, protocol, versioning |
| Phase 1 | Auth, project, local runtime |
| Phase 2 | Artifact |
| Phase 3 | Organization, platform, authorization |
| Phase 4 | Booking, credits, payment |
| Phase 5 | Job, agent, resource |
| Phase 6 | Physical robot, safety |
| Phase 7 | Run, result, telemetry, experiment |
| Phase 8 | Infrastructure, rate limits, production governance |

# 72. Phase 0 Acceptance

The implementation must:

- define common error envelope;
- define status/code separation;
- define naming rules;
- define retryability;
- define HTTP mapping;
- define versioning;
- validate schemas.

# 73. Phase 1 Acceptance

The implementation must:

- authenticate errors correctly;
- expose project errors;
- expose local build errors;
- avoid leaking credentials;
- provide actionable Studio messages.

# 74. Phase 2 Acceptance

The implementation must:

- implement artifact error registry;
- distinguish invalid from incompatible artifacts;
- verify digest/signature errors;
- expose actionable packaging remediation;
- prevent source-package upload.

# 75. Phase 3 Acceptance

The implementation must:

- enforce organization authorization;
- implement platform errors;
- prevent tenant information leakage;
- support version conflicts.

# 76. Phase 4 Acceptance

The implementation must:

- implement booking conflicts;
- implement platform-specific credit errors;
- protect credit transactions;
- distinguish payment failure from credit failure;
- support reconciliation.

# 77. Phase 5 Acceptance

The implementation must:

- implement job lifecycle errors;
- implement agent errors;
- implement resource errors;
- distinguish unavailable from faulted resources;
- support execution reconciliation.

# 78. Phase 6 Acceptance

The implementation must:

- implement safety errors;
- treat unknown safety state as fail-safe;
- prevent automatic execution retry after safety failure;
- distinguish cloud connectivity from robot safety state.

# 79. Phase 7 Acceptance

The implementation must:

- implement run errors;
- implement result errors;
- implement telemetry errors;
- support degraded telemetry;
- distinguish incomplete results from failed runs.

# 80. Phase 8 Acceptance

The implementation must:

- implement infrastructure errors;
- implement rate limiting;
- implement operational monitoring;
- enforce registry governance;
- validate error compatibility;
- test production recovery paths.

# 81. Full Error Registry Checklist

## Envelope

- [ ] `protocol_version` is present.
- [ ] `request_id` is present.
- [ ] `timestamp` is UTC.
- [ ] `status` is present.
- [ ] `code` is present.
- [ ] `message` is present.
- [ ] `data` is present.
- [ ] `error` is present.
- [ ] Error details are structured.
- [ ] Internal details are excluded.

## Naming

- [ ] Codes use uppercase.
- [ ] Codes use underscores.
- [ ] Codes are stable.
- [ ] Codes have documented ownership.
- [ ] Codes do not encode HTTP status.
- [ ] Codes do not expose implementation classes.
- [ ] Codes have defined semantics.

## HTTP

- [ ] HTTP mappings are documented.
- [ ] 400 validation mapping works.
- [ ] 401 authentication mapping works.
- [ ] 403 authorization mapping works.
- [ ] 404 not-found mapping works.
- [ ] 409 conflict mapping works.
- [ ] 422 domain rejection mapping works.
- [ ] 429 rate-limit mapping works.
- [ ] 5xx infrastructure mappings work.

## Retryability

- [ ] Every operational code has retry semantics.
- [ ] Retryable errors identify safe retry behavior.
- [ ] Retry-after is supported where required.
- [ ] Exponential backoff is supported.
- [ ] Jitter is supported.
- [ ] Reconciliation errors are distinguished.
- [ ] Safety errors cannot trigger unsafe automatic retry.

## Authentication

- [ ] `AUTH_REQUIRED` implemented.
- [ ] `AUTH_INVALID_CREDENTIALS` implemented.
- [ ] `AUTH_SESSION_EXPIRED` implemented.
- [ ] `AUTH_TOKEN_INVALID` implemented.
- [ ] `AUTH_TOKEN_REVOKED` implemented.

## Authorization

- [ ] `AUTHZ_DENIED` implemented.
- [ ] Resource-level authorization is enforced.
- [ ] Organization authorization is enforced.
- [ ] Role requirements are enforced.
- [ ] Unauthorized resource existence is not leaked.

## Projects

- [ ] Project not-found is defined.
- [ ] Archived-project behavior is defined.
- [ ] Name conflicts are defined.

## Platforms

- [ ] Platform not-found is defined.
- [ ] Version compatibility is defined.
- [ ] Capability mismatch is defined.
- [ ] Platform availability is defined.
- [ ] Platform incompatibility is defined.

## Artifacts

- [ ] Artifact not-found is defined.
- [ ] Invalid package is defined.
- [ ] Size violation is defined.
- [ ] Digest mismatch is defined.
- [ ] Signature failure is defined.
- [ ] Unsigned artifact is defined.
- [ ] Compatibility failure is defined.
- [ ] Runtime mismatch is defined.
- [ ] SDK mismatch is defined.
- [ ] Capability mismatch is defined.
- [ ] Revocation is defined.
- [ ] Expiration is defined.
- [ ] Incomplete upload is defined.
- [ ] Source detection is defined.

## Booking

- [ ] Booking not-found is defined.
- [ ] Booking conflict is defined.
- [ ] Invalid time window is defined.
- [ ] Minimum duration is enforced.
- [ ] Maximum duration is enforced.
- [ ] Availability violations are defined.
- [ ] Cancellation behavior is defined.
- [ ] Expiration is defined.
- [ ] Modification policy is defined.

## Credits

- [ ] Wallet not-found is defined.
- [ ] Insufficient credits is defined.
- [ ] Platform mismatch is defined.
- [ ] Credit plan errors are defined.
- [ ] Consumption failures are defined.
- [ ] Refund failures are defined.
- [ ] Transaction conflicts are defined.
- [ ] Financial operations are idempotent.
- [ ] Financial state is auditable.

## Jobs

- [ ] Job not-found is defined.
- [ ] Invalid job state is defined.
- [ ] Booking requirement is defined.
- [ ] Artifact requirement is defined.
- [ ] Resource availability is defined.
- [ ] Deployment failure is defined.
- [ ] Start failure is defined.
- [ ] Stop failure is defined.
- [ ] Timeout is defined.
- [ ] Terminal failure is defined.

## Runs

- [ ] Run not-found is defined.
- [ ] Invalid run state is defined.
- [ ] Start failure is defined.
- [ ] Stop failure is defined.
- [ ] Runtime failure is defined.
- [ ] Reconciliation-required state is defined.

## Results

- [ ] Result not-found is defined.
- [ ] Result-not-ready is defined.
- [ ] Processing failure is defined.
- [ ] File-not-found behavior is defined.
- [ ] Download failure is defined.

## Lab

- [ ] Agent not-found is defined.
- [ ] Agent offline is defined.
- [ ] Agent unhealthy is defined.
- [ ] Agent version mismatch is defined.
- [ ] Agent authentication failure is defined.
- [ ] Capability mismatch is defined.
- [ ] Configuration failure is defined.
- [ ] Heartbeat timeout is defined.

## Resources

- [ ] Resource not-found is defined.
- [ ] Resource unavailable is defined.
- [ ] Resource reserved is defined.
- [ ] Resource busy is defined.
- [ ] Lock failure is defined.
- [ ] Release failure is defined.
- [ ] Resource fault is defined.
- [ ] Maintenance is defined.

## Telemetry

- [ ] Telemetry unavailable is defined.
- [ ] Telemetry degraded is defined.
- [ ] Invalid telemetry is defined.
- [ ] Telemetry rate limiting is defined.
- [ ] Telemetry does not become a safety dependency.

## Protocol

- [ ] Unsupported protocol version is defined.
- [ ] Invalid message is defined.
- [ ] Unknown command is defined.
- [ ] Unknown event is defined.
- [ ] Unsupported schema is defined.

## Infrastructure

- [ ] Database unavailable is defined.
- [ ] Storage unavailable is defined.
- [ ] Queue unavailable is defined.
- [ ] Secret retrieval failure is defined.
- [ ] Configuration failure is defined.
- [ ] Internal errors are sanitized.

## Safety

- [ ] Safety interlock is defined.
- [ ] E-stop is defined.
- [ ] Safety policy block is defined.
- [ ] Unknown safety state is fail-safe.
- [ ] Cloud events are not treated as physical safety controls.

## Client Behavior

- [ ] Clients branch on error codes.
- [ ] Clients do not parse messages.
- [ ] Retryable errors use backoff.
- [ ] Reconciliation errors query authoritative state.
- [ ] Duplicate operations are protected by idempotency.
- [ ] Sensitive details are never displayed.
- [ ] Error messages are actionable.

## Production

- [ ] Error metrics exist.
- [ ] Error dashboards exist.
- [ ] Critical errors are alerted.
- [ ] Error registry is version controlled.
- [ ] Compatibility checks run in CI.
- [ ] New public codes require review.
- [ ] Deprecated codes have migration guidance.
- [ ] Error contracts are covered by automated tests.
- [ ] End-to-end failure scenarios are tested.
- [ ] Recovery scenarios are tested.

# 82. Architectural Invariants

The following rules are mandatory:

1. Error codes are stable protocol contracts.
2. HTTP status and Kritva error code are separate concepts.
3. Human-readable messages are not machine contracts.
4. Every public error has documented retryability.
5. Financial operations are idempotent.
6. Resource operations are idempotent where required.
7. Execution operations are idempotent where required.
8. Reconciliation is mandatory when external state is uncertain.
9. Durable state is authoritative.
10. WebSocket errors use the same semantic registry.
11. Lab errors use the same semantic registry where applicable.
12. Vendor faults are subordinate diagnostic information.
13. Internal implementation errors are never exposed directly.
14. Tenant isolation applies to error responses.
15. Error details must not leak protected resource existence where policy forbids it.
16. Safety failures are handled independently of cloud retry behavior.
17. Unknown safety state is fail-safe.
18. Telemetry quality does not imply execution success.
19. Async acceptance does not imply successful completion.
20. Error contracts are version controlled and tested.

# 83. Final Production Baseline

The Kritva RaaS error architecture establishes a single, consistent model across
Studio, Web Console, Control Plane, Lab Agent, and robot execution boundaries.

The complete relationship is:

    Request
       |
       v
    Transport
       |
       v
    Application
       |
       +--> Success
       |
       +--> Error
              |
              +--> status
              +--> code
              +--> message
              +--> retryability
              +--> remediation

For asynchronous execution:

    Request
       |
       v
    ACCEPTED
       |
       v
    Durable Operation
       |
       +--> Event
       |
       +--> Terminal State
               |
               +--> SUCCESS
               +--> FAILED
               +--> CANCELLED
               +--> TIMEOUT
               +--> RECONCILIATION_REQUIRED

For physical robot operations:

    Cloud Request
       |
       v
    Lab Agent
       |
       v
    Local Runtime
       |
       v
    Robot
       |
       +--> Observed State
       |
       +--> Fault
       |
       +--> Safety State
       |
       v
    Control Plane
       |
       v
    Stable Kritva Error/Event

The governing principle is:

> **Fail clearly, classify consistently, retry only when safe, reconcile when uncertain, and never expose internal implementation details as protocol contracts.**
