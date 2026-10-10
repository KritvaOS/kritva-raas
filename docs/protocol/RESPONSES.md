# Kritva RaaS Response Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Response Specification |
| Path | `docs/protocol/RESPONSES.md` |
| Product | Kritva Robotics-as-a-Service |
| Protocol Model | Contract-driven command/response |
| Public API | REST + WebSocket |
| Desktop IPC | Tauri IPC |
| Lab Protocol | Secure Lab Channel |
| Contract Package | `packages/contracts` |
| API Client | `packages/api-client` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the standard response model for Kritva RaaS.

A response communicates the immediate processing outcome of a command or query.
It provides a consistent structure across:

- Studio;
- Control Plane;
- Lab Agent;
- local Studio Runtime;
- workers where applicable.

The response model defines:

- status values;
- machine-readable codes;
- human-readable messages;
- data payloads;
- error objects;
- pagination;
- partial results;
- asynchronous acceptance;
- completion semantics;
- correlation;
- versioning;
- examples;
- error handling.

## 3. Scope

This document covers responses returned by:

- authentication;
- user and organization operations;
- project operations;
- platform operations;
- local builds;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- experiments;
- Lab Agent commands;
- Studio IPC.

It also defines response behavior for:

- synchronous operations;
- asynchronous operations;
- validation failures;
- conflicts;
- partial results;
- pagination;
- retries;
- duplicate requests;
- disconnected clients.

## 4. Goals

The response architecture shall:

1. provide a predictable response shape;
2. distinguish transport status from application status;
3. distinguish acceptance from completion;
4. provide stable machine-readable codes;
5. provide structured errors;
6. support typed data payloads;
7. support pagination;
8. support partial results;
9. support asynchronous workflows;
10. preserve request correlation;
11. support idempotent retries;
12. remain forward-compatible.

## 5. Non-Goals

This document does not define:

- database schemas;
- internal repository interfaces;
- UI presentation styling;
- physical robot safety protocols;
- video streaming payloads;
- exact cloud-provider responses;
- SQL errors exposed directly to clients.

Internal implementation errors must be translated into protocol-level errors.

## 6. Response Model

The logical response model is:

    Request
       |
       v
    Authentication
       |
       v
    Validation
       |
       v
    Authorization
       |
       v
    Domain Operation
       |
       +--------------------+
       |                    |
       v                    v
    Immediate            Async Operation
    Outcome                   |
       |                      v
       v                  ACCEPTED
    RESPONSE                   |
                              v
                           Events
                              |
                              v
                          COMPLETED

## 7. Standard Response Envelope

The standard response envelope is:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "SUCCESS",
        "code": "PROJECT_CREATED",
        "message": "Project created",
        "data": {},
        "error": null
    }

Every response should preserve the request correlation identifier where the
transport supports request/response correlation.

## 8. Response Fields

| Field | Required | Purpose |
|---|---:|---|
| `protocol_version` | Yes | Protocol contract version |
| `request_id` | Yes | Correlation with request |
| `timestamp` | Yes | Response creation time |
| `status` | Yes | Application-level outcome |
| `code` | Yes | Stable machine-readable code |
| `message` | Yes | Human-readable explanation |
| `data` | Conditional | Successful result payload |
| `error` | Conditional | Structured failure information |

## 9. Field Ownership

The server owns:

- status;
- code;
- message;
- timestamp;
- error;
- authoritative data.

Clients must not infer successful completion merely because an HTTP request
returned successfully.

## 10. Protocol Version

`protocol_version` identifies the response contract version.

Example:

    "protocol_version": "1.0"

Protocol versioning is independent of the business resource version.

For example:

    protocol_version = "1.0"
    artifact_format_version = "2"

## 11. Request ID

Every command request has a `request_id`.

The response echoes the same value:

    request_id:
        req-12345

This allows:

- client correlation;
- distributed tracing;
- support diagnostics;
- audit correlation;
- retry analysis.

## 12. Timestamp

Response timestamps use UTC.

Example:

    "timestamp": "2026-10-08T00:00:01Z"

Server-generated timestamps are authoritative for response processing.

## 13. Status

`status` is the high-level application outcome.

The status is independent from HTTP transport status.

Supported standard values are:

- `SUCCESS`;
- `ACCEPTED`;
- `REJECTED`;
- `PENDING`;
- `IN_PROGRESS`;
- `COMPLETED`;
- `FAILED`;
- `CANCELLED`;
- `TIMEOUT`;
- `UNAUTHORIZED`;
- `FORBIDDEN`;
- `NOT_FOUND`;
- `CONFLICT`;
- `INVALID_REQUEST`;
- `UNAVAILABLE`.

Not every status is valid for every operation.

## 14. Status Categories

| Status | Category | Meaning |
|---|---|---|
| SUCCESS | Terminal | Request completed successfully |
| ACCEPTED | Non-terminal | Request accepted for asynchronous processing |
| REJECTED | Terminal | Request explicitly rejected |
| PENDING | Non-terminal | Operation accepted but waiting |
| IN_PROGRESS | Non-terminal | Operation is actively executing |
| COMPLETED | Terminal | Long-running operation completed |
| FAILED | Terminal | Operation failed |
| CANCELLED | Terminal | Operation was cancelled |
| TIMEOUT | Terminal | Operation exceeded allowed time |
| UNAUTHORIZED | Terminal | Authentication required/invalid |
| FORBIDDEN | Terminal | Authentication exists but access is denied |
| NOT_FOUND | Terminal | Resource does not exist or is inaccessible |
| CONFLICT | Terminal | Current resource state conflicts with request |
| INVALID_REQUEST | Terminal | Request is syntactically or semantically invalid |
| UNAVAILABLE | Terminal/temporary | Required service/resource is unavailable |

## 15. SUCCESS

`SUCCESS` means the requested operation completed successfully within the
current request/response interaction.

Example:

    {
        "status": "SUCCESS",
        "code": "PROJECT_RETRIEVED",
        "message": "Project retrieved",
        "data": {
            "project_id": "project-001",
            "name": "Robot Vision"
        },
        "error": null
    }

For synchronous operations, `SUCCESS` generally means completion.

## 16. ACCEPTED

`ACCEPTED` means:

> The system accepted responsibility for the requested operation, but the
> requested operation has not necessarily completed.

Example:

    {
        "status": "ACCEPTED",
        "code": "JOB_ACCEPTED",
        "message": "Job accepted for execution",
        "data": {
            "job_id": "job-001",
            "operation_id": "op-001",
            "state": "QUEUED"
        },
        "error": null
    }

`ACCEPTED` is non-terminal.

## 17. ACCEPTED Is Not COMPLETED

The following interpretation is mandatory:

    ACCEPTED
        !=
    COMPLETED

For example:

    job.start
       |
       v
    HTTP 202
       |
       v
    status = ACCEPTED
       |
       v
    QUEUED
       |
       v
    VALIDATING
       |
       v
    DEPLOYING
       |
       v
    RUNNING
       |
       v
    COMPLETED

The initial response must not contain a false claim that execution completed.

## 18. COMPLETED

`COMPLETED` is used when a long-running operation has actually reached its
successful terminal state.

Example:

    {
        "status": "COMPLETED",
        "code": "JOB_COMPLETED",
        "message": "Job completed successfully",
        "data": {
            "job_id": "job-001",
            "run_id": "run-001",
            "result_id": "result-001"
        },
        "error": null
    }

The durable job/run state remains authoritative.

## 19. PENDING

`PENDING` indicates that an operation is waiting for a condition before active
execution.

Examples:

- waiting for resource;
- waiting for booking start;
- waiting for approval;
- waiting for dependency.

`PENDING` is non-terminal.

## 20. IN_PROGRESS

`IN_PROGRESS` indicates active processing.

Examples:

- artifact validation;
- deployment;
- result processing;
- local build;
- resource provisioning.

It is non-terminal.

## 21. FAILED

`FAILED` means the operation reached a terminal failure state.

Example:

    {
        "status": "FAILED",
        "code": "JOB_FAILED",
        "message": "Robot execution failed",
        "data": {
            "job_id": "job-001",
            "run_id": "run-001"
        },
        "error": {
            "code": "RUNTIME_UNAVAILABLE",
            "message": "Kritva Runtime became unavailable",
            "details": {}
        }
    }

## 22. CANCELLED

`CANCELLED` means the operation was intentionally stopped before successful
completion.

Cancellation is different from failure.

Example:

    {
        "status": "CANCELLED",
        "code": "JOB_CANCELLED",
        "message": "Job cancelled",
        "data": {
            "job_id": "job-001"
        },
        "error": null
    }

## 23. TIMEOUT

`TIMEOUT` means a defined operation exceeded its allowed execution window.

Timeout does not necessarily mean the underlying physical system stopped
immediately.

For robot operations, reconciliation may be required.

## 24. REJECTED

`REJECTED` means the system explicitly refused the requested operation.

Examples:

- incompatible artifact;
- policy violation;
- unsupported platform;
- unsafe configuration.

`REJECTED` differs from `INVALID_REQUEST` because the request may be structurally
valid but unacceptable under domain policy.

## 25. UNAUTHORIZED

`UNAUTHORIZED` means the caller is not authenticated or the supplied
authentication credential is invalid or expired.

It must not reveal sensitive authentication details.

## 26. FORBIDDEN

`FORBIDDEN` means the caller is authenticated but does not have permission to
perform the requested operation.

The response should not disclose resources the caller is not authorized to know
about.

## 27. NOT_FOUND

`NOT_FOUND` means the requested resource cannot be accessed as requested.

Depending on security policy, the server may deliberately return `NOT_FOUND`
rather than revealing that a protected resource exists.

## 28. CONFLICT

`CONFLICT` indicates that the operation conflicts with current state.

Examples:

- booking already taken;
- job already running;
- resource already locked;
- stale version;
- idempotency key mismatch.

## 29. INVALID_REQUEST

`INVALID_REQUEST` indicates that the request cannot be processed because its
shape or semantics are invalid.

Examples:

- missing required field;
- invalid enum;
- invalid identifier format;
- invalid time range.

## 30. UNAVAILABLE

`UNAVAILABLE` indicates that a dependency or resource is temporarily
unavailable.

Examples:

- Lab Agent offline;
- temporary service outage;
- unavailable robot.

The client may retry if the error contract marks the failure retryable.

# 31. Response Codes

The `code` field is a stable machine-readable identifier.

Examples:

    PROJECT_CREATED
    PROJECT_RETRIEVED
    ARTIFACT_ACCEPTED
    ARTIFACT_INCOMPATIBLE
    BOOKING_CONFIRMED
    BOOKING_CONFLICT
    CREDIT_CONSUMED
    INSUFFICIENT_CREDITS
    JOB_ACCEPTED
    JOB_COMPLETED
    JOB_FAILED
    RESULT_AVAILABLE
    AGENT_OFFLINE

## 32. Code Rules

Response codes shall:

- use uppercase letters;
- use underscores;
- remain stable;
- describe the specific condition;
- be documented;
- not contain dynamic IDs.

Bad:

    JOB_FAILED_job_123

Good:

    JOB_FAILED

## 33. Code Versus Status

Status provides broad semantic classification.

Code provides precise machine-readable meaning.

Example:

    status = "CONFLICT"
    code = "BOOKING_CONFLICT"

Another example:

    status = "FAILED"
    code = "RUNTIME_UNAVAILABLE"

Clients should branch primarily on stable codes and defined status classes,
not human-readable messages.

## 34. Message

`message` is intended for:

- UI display where appropriate;
- logs;
- diagnostics;
- support.

It is not a stable machine contract.

The UI should not parse the message to determine behavior.

## 35. Data

`data` contains the successful or informational result.

Example:

    "data": {
        "project_id": "project-001",
        "name": "Vision Experiment"
    }

The data schema is command-specific.

## 36. Data on Errors

Error responses may contain limited `data` when it is useful and safe.

Example:

    {
        "status": "CONFLICT",
        "code": "BOOKING_CONFLICT",
        "data": {
            "requested_start": "2026-10-10T10:00:00Z",
            "requested_end": "2026-10-10T11:00:00Z"
        },
        "error": {
            "code": "BOOKING_CONFLICT",
            "message": "Requested resource is already booked",
            "details": {}
        }
    }

Sensitive information must not be returned.

# 37. Error Object

The standard error object is:

    {
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is incompatible with the selected platform",
        "details": {}
    }

The outer `status` and `code` describe the response.

The `error` object provides structured failure detail.

## 38. Error Fields

| Field | Required | Purpose |
|---|---:|---|
| `code` | Yes | Stable error code |
| `message` | Yes | Human-readable explanation |
| `details` | Optional | Structured diagnostic information |
| `retryable` | Optional | Whether retry may be appropriate |
| `field_errors` | Optional | Field-level validation errors |

## 39. Error Details

Example:

    {
        "code": "VALIDATION_FAILED",
        "message": "Request validation failed",
        "details": {
            "field_errors": [
                {
                    "field": "end_time",
                    "code": "INVALID_TIME_RANGE",
                    "message": "End time must be after start time"
                }
            ]
        }
    }

Field-level errors are especially useful for Studio forms.

## 40. Retryability

Where useful, errors may identify whether retry is appropriate.

Example:

    "retryable": true

Retryability does not override idempotency requirements.

A side-effecting command must still use an idempotency key before retry.

## 41. Error Categories

| Category | Examples |
|---|---|
| Authentication | `UNAUTHORIZED` |
| Authorization | `FORBIDDEN` |
| Validation | `INVALID_REQUEST`, `VALIDATION_FAILED` |
| Resource | `NOT_FOUND`, `RESOURCE_UNAVAILABLE` |
| State | `INVALID_STATE`, `CONFLICT` |
| Artifact | `ARTIFACT_INVALID`, `ARTIFACT_INCOMPATIBLE` |
| Commercial | `INSUFFICIENT_CREDITS` |
| Execution | `JOB_FAILED`, `RUNTIME_UNAVAILABLE` |
| Transport/dependency | `SERVICE_UNAVAILABLE`, `TIMEOUT` |
| Protocol | `VERSION_UNSUPPORTED` |

## 42. HTTP Mapping

| HTTP Status | Typical Response Status |
|---:|---|
| 200 | `SUCCESS` |
| 201 | `SUCCESS` |
| 202 | `ACCEPTED` |
| 204 | `SUCCESS` |
| 400 | `INVALID_REQUEST` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `REJECTED` or validation-specific status |
| 429 | `UNAVAILABLE` or rate-limit-specific code |
| 500 | `FAILED` |
| 503 | `UNAVAILABLE` |

HTTP status is transport-level.

Application status and code provide business semantics.

# 43. Successful Query Response

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "SUCCESS",
        "code": "PROJECT_RETRIEVED",
        "message": "Project retrieved",
        "data": {
            "project_id": "project-001",
            "name": "Humanoid Vision",
            "status": "ACTIVE"
        },
        "error": null
    }

# 44. Successful Create Response

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-002",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "SUCCESS",
        "code": "PROJECT_CREATED",
        "message": "Project created",
        "data": {
            "project_id": "project-002",
            "name": "Robot Control"
        },
        "error": null
    }

# 45. Accepted Job Response

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-003",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "ACCEPTED",
        "code": "JOB_ACCEPTED",
        "message": "Job accepted for execution",
        "data": {
            "operation_id": "op-001",
            "job_id": "job-001",
            "state": "QUEUED"
        },
        "error": null
    }

This response does not mean the robot has started.

# 46. In-Progress Response

For APIs that explicitly return current asynchronous state:

    {
        "status": "IN_PROGRESS",
        "code": "ARTIFACT_VALIDATION_IN_PROGRESS",
        "message": "Artifact validation is in progress",
        "data": {
            "artifact_id": "artifact-001",
            "state": "VALIDATING",
            "progress_percent": 60
        },
        "error": null
    }

This is non-terminal.

# 47. Completed Response

Example:

    {
        "status": "COMPLETED",
        "code": "ARTIFACT_VALIDATION_COMPLETED",
        "message": "Artifact validation completed",
        "data": {
            "artifact_id": "artifact-001",
            "valid": true,
            "checks_passed": 12
        },
        "error": null
    }

# 48. Validation Error

Example:

    {
        "status": "INVALID_REQUEST",
        "code": "VALIDATION_FAILED",
        "message": "Request validation failed",
        "data": null,
        "error": {
            "code": "VALIDATION_FAILED",
            "message": "One or more fields are invalid",
            "details": {
                "field_errors": [
                    {
                        "field": "platform_id",
                        "code": "REQUIRED",
                        "message": "Platform is required"
                    }
                ]
            }
        }
    }

# 49. Authorization Error

Example:

    {
        "status": "FORBIDDEN",
        "code": "PROJECT_ACCESS_DENIED",
        "message": "You do not have access to this project",
        "data": null,
        "error": {
            "code": "PROJECT_ACCESS_DENIED",
            "message": "Project access denied",
            "details": {}
        }
    }

# 50. Resource Conflict

Example:

    {
        "status": "CONFLICT",
        "code": "BOOKING_CONFLICT",
        "message": "Requested booking conflicts with an existing booking",
        "data": {
            "platform_id": "humanoid-a"
        },
        "error": {
            "code": "BOOKING_CONFLICT",
            "message": "Requested time slot is unavailable",
            "details": {
                "retryable": true
            }
        }
    }

# 51. Insufficient Credits

Example:

    {
        "status": "REJECTED",
        "code": "INSUFFICIENT_CREDITS",
        "message": "Insufficient credits for this booking",
        "data": {
            "required_credits": 450,
            "available_credits": 300
        },
        "error": {
            "code": "INSUFFICIENT_CREDITS",
            "message": "The selected platform wallet does not have enough credits",
            "details": {}
        }
    }

# 52. Artifact Incompatibility

Example:

    {
        "status": "REJECTED",
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is incompatible with the selected robot platform",
        "data": {
            "artifact_id": "artifact-001",
            "platform_id": "humanoid-a"
        },
        "error": {
            "code": "ARTIFACT_INCOMPATIBLE",
            "message": "Runtime requirements are not satisfied",
            "details": {
                "required_runtime": "2.0",
                "available_runtime": "1.5"
            }
        }
    }

# 53. Lab Agent Offline

Example:

    {
        "status": "UNAVAILABLE",
        "code": "AGENT_OFFLINE",
        "message": "The selected lab agent is currently offline",
        "data": {
            "agent_id": "agent-001",
            "last_seen": "2026-10-08T00:00:00Z"
        },
        "error": {
            "code": "AGENT_OFFLINE",
            "message": "Execution cannot currently be dispatched",
            "details": {
                "retryable": true
            }
        }
    }

# 54. Runtime Failure

Example:

    {
        "status": "FAILED",
        "code": "JOB_FAILED",
        "message": "Robot execution failed",
        "data": {
            "job_id": "job-001",
            "run_id": "run-001"
        },
        "error": {
            "code": "RUNTIME_UNAVAILABLE",
            "message": "Runtime stopped responding",
            "details": {
                "recovery_required": true
            }
        }
    }

# 55. Pagination

Collection responses use a standard pagination structure.

Example:

    {
        "status": "SUCCESS",
        "code": "PROJECTS_RETRIEVED",
        "message": "Projects retrieved",
        "data": {
            "items": [
                {
                    "project_id": "project-001",
                    "name": "Vision"
                },
                {
                    "project_id": "project-002",
                    "name": "Navigation"
                }
            ],
            "next_cursor": "cursor-abc",
            "has_more": true
        },
        "error": null
    }

## 56. Pagination Fields

| Field | Meaning |
|---|---|
| `items` | Current page |
| `next_cursor` | Cursor for next page |
| `has_more` | Whether another page exists |

Cursor-based pagination is preferred for changing datasets.

## 57. Pagination Request

Typical request:

    GET /api/v1/projects?cursor=cursor-abc&limit=50

The exact REST encoding is API-specific, while the logical response remains
consistent.

## 58. Pagination Rules

The server controls:

- maximum page size;
- cursor format;
- cursor validity;
- ordering.

Clients must not construct or modify opaque cursor contents.

## 59. Empty Pagination

An empty result is still a successful response.

Example:

    {
        "status": "SUCCESS",
        "code": "PROJECTS_RETRIEVED",
        "message": "Projects retrieved",
        "data": {
            "items": [],
            "next_cursor": null,
            "has_more": false
        },
        "error": null
    }

Empty results are not `NOT_FOUND`.

## 60. Pagination Errors

Invalid cursors should return a stable code.

Example:

    {
        "status": "INVALID_REQUEST",
        "code": "INVALID_CURSOR",
        "message": "The supplied pagination cursor is invalid",
        "data": null,
        "error": {
            "code": "INVALID_CURSOR",
            "message": "Cursor cannot be used",
            "details": {}
        }
    }

# 61. Partial Results

A response may contain partial results when the operation explicitly supports
partial completion.

Partial results must never be represented as full success without indication.

Example:

    {
        "status": "SUCCESS",
        "code": "RESULTS_PARTIAL",
        "message": "Results retrieved with some data unavailable",
        "data": {
            "items": [],
            "partial": true,
            "missing": [
                "telemetry"
            ]
        },
        "error": null
    }

## 62. Partial Result Rules

Partial results must define:

- what succeeded;
- what is missing;
- whether retry is possible;
- whether the result is authoritative;
- whether additional data may appear later.

## 63. Partial Versus Failed

A partial response is appropriate when the requested operation explicitly permits
partial data.

A hard dependency failure should normally return an error instead.

Example:

    requested:
        metadata + telemetry + logs

    available:
        metadata + logs

If the contract allows partial observation:

    SUCCESS + partial=true

If telemetry is required for correctness:

    FAILED + TELEMETRY_UNAVAILABLE

## 64. Partial Collection Example

    {
        "status": "SUCCESS",
        "code": "RUN_DATA_PARTIAL",
        "message": "Run data retrieved partially",
        "data": {
            "run_id": "run-001",
            "metrics": [],
            "telemetry": [],
            "logs": [],
            "partial": true,
            "missing": [
                "telemetry"
            ],
            "retryable": true
        },
        "error": null
    }

# 65. ACCEPTED Versus PENDING

`ACCEPTED` answers:

> Has the system accepted this command for processing?

`PENDING` answers:

> Is the operation currently waiting rather than actively executing?

Example:

    job.start
       |
       v
    ACCEPTED
       |
       v
    PENDING
       |
       v
    IN_PROGRESS
       |
       v
    COMPLETED

The exact state machine determines which response is returned by a given
endpoint.

# 66. ACCEPTED Versus IN_PROGRESS

`ACCEPTED` generally describes the initial command response.

`IN_PROGRESS` describes an operation already known to be executing.

Example:

    POST /jobs/job-001/start
        -> 202 ACCEPTED

    GET /jobs/job-001
        -> 200 IN_PROGRESS

# 67. ACCEPTED Versus COMPLETED

The following is invalid:

    job.start
        -> 202 ACCEPTED
        -> message = "Job completed successfully"

The accepted response must accurately communicate non-terminal state.

# 68. COMPLETED Versus SUCCESS

`SUCCESS` is normally used for immediate synchronous operations.

`COMPLETED` is appropriate when a previously asynchronous operation has reached
its successful terminal state.

This distinction allows clients to reason about lifecycle semantics.

# 69. Event Completion

Asynchronous operations may also complete through events.

Example:

    job.start
       |
       v
    ACCEPTED
       |
       +--> job.queued
       +--> job.validating
       +--> job.deploying
       +--> job.running
       +--> job.completed

The event payload should include the affected resource ID and sufficient
correlation information.

# 70. Response and Durable State

The response is not always the final authority.

For asynchronous operations:

    Initial Response
          |
          v
    Durable Job/Run State
          |
          v
    Event Notification

If a client receives:

    ACCEPTED

and later disconnects, it can recover the operation from durable state.

# 71. Response and WebSocket

WebSocket events do not replace REST responses.

The relationship is:

    REST
      |
      +--> Command
      +--> Current State
      |
      v
    WebSocket
      |
      +--> State Notification

A client must be able to reconstruct current state after reconnect.

# 72. Response and Idempotency

When a repeated request uses the same valid idempotency key, the system should
return the same logical operation result.

Example:

    Request 1:
        booking.create + key=abc
        -> SUCCESS
        -> booking-001

    Request 2:
        booking.create + key=abc
        -> SUCCESS
        -> booking-001

The second request must not create `booking-002`.

# 73. Idempotency Conflict Response

Example:

    {
        "status": "CONFLICT",
        "code": "IDEMPOTENCY_CONFLICT",
        "message": "Idempotency key was previously used with different request data",
        "data": null,
        "error": {
            "code": "IDEMPOTENCY_CONFLICT",
            "message": "The request does not match the stored operation",
            "details": {}
        }
    }

# 74. Response Caching

Read-only responses may be cached according to endpoint policy.

Sensitive or rapidly changing execution responses should use appropriate cache
controls.

Durable state must not be inferred from stale client cache.

# 75. Response Freshness

Responses involving:

- robot availability;
- booking availability;
- credits;
- job state;
- resource state;

may become stale immediately after generation.

The UI should communicate freshness where relevant.

# 76. Booking Response

Successful booking:

    {
        "status": "SUCCESS",
        "code": "BOOKING_CONFIRMED",
        "message": "Booking confirmed",
        "data": {
            "booking_id": "booking-001",
            "platform_id": "humanoid-a",
            "start_time": "2026-10-10T10:00:00Z",
            "end_time": "2026-10-10T10:30:00Z",
            "required_credits": 450
        },
        "error": null
    }

# 77. Credit Response

Successful consumption:

    {
        "status": "SUCCESS",
        "code": "CREDIT_CONSUMED",
        "message": "Credits consumed",
        "data": {
            "transaction_id": "txn-001",
            "wallet_id": "wallet-humanoid-a",
            "amount": 450,
            "remaining_balance": 1250
        },
        "error": null
    }

# 78. Artifact Response

Successful artifact validation:

    {
        "status": "COMPLETED",
        "code": "ARTIFACT_VALIDATION_COMPLETED",
        "message": "Artifact validation completed",
        "data": {
            "artifact_id": "artifact-001",
            "digest": "sha256:...",
            "valid": true,
            "compatible": true
        },
        "error": null
    }

# 79. Job Response

Current job state:

    {
        "status": "IN_PROGRESS",
        "code": "JOB_RUNNING",
        "message": "Job is running",
        "data": {
            "job_id": "job-001",
            "run_id": "run-001",
            "state": "RUNNING",
            "resource_id": "robot-001"
        },
        "error": null
    }

# 80. Run Response

Successful run completion:

    {
        "status": "COMPLETED",
        "code": "RUN_COMPLETED",
        "message": "Run completed successfully",
        "data": {
            "run_id": "run-001",
            "result_id": "result-001",
            "duration_seconds": 1800
        },
        "error": null
    }

# 81. Result Response

    {
        "status": "SUCCESS",
        "code": "RESULT_RETRIEVED",
        "message": "Result retrieved",
        "data": {
            "result_id": "result-001",
            "run_id": "run-001",
            "status": "AVAILABLE",
            "files": 4
        },
        "error": null
    }

# 82. Experiment Response

    {
        "status": "SUCCESS",
        "code": "EXPERIMENT_RETRIEVED",
        "message": "Experiment retrieved",
        "data": {
            "experiment_id": "experiment-001",
            "run_count": 12,
            "result_count": 12
        },
        "error": null
    }

# 83. Lab Agent Response

Agent registration:

    {
        "status": "SUCCESS",
        "code": "AGENT_REGISTERED",
        "message": "Lab Agent registered",
        "data": {
            "agent_id": "agent-001",
            "negotiated_protocol_version": "1.0",
            "heartbeat_interval_seconds": 30
        },
        "error": null
    }

# 84. Local IPC Response

Local build:

    {
        "protocol_version": "1.0",
        "request_id": "ipc-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "ACCEPTED",
        "code": "BUILD_ACCEPTED",
        "message": "Build started",
        "data": {
            "build_id": "build-001",
            "operation_id": "op-001"
        },
        "error": null
    }

# 85. Response Serialization

JSON is the baseline representation for:

- REST request/response bodies;
- WebSocket messages;
- logical Lab Channel messages where JSON is selected;
- test fixtures.

Binary payloads such as artifacts and results use dedicated transfer mechanisms.

# 86. Response Size

Responses should remain bounded.

Large datasets should use:

- pagination;
- object storage;
- streaming;
- dedicated download endpoints;
- telemetry query windows.

A response must not attempt to return an entire high-frequency telemetry history
as one JSON object.

# 87. Large Result Responses

For large results:

    result.get
       |
       v
    metadata response
       |
       +--> result.files
                |
                v
          download reference
                |
                v
          object storage

This keeps normal API responses bounded.

# 88. Response Security

Responses must not expose:

- passwords;
- refresh tokens where not required;
- private signing keys;
- internal database credentials;
- cloud credentials;
- raw infrastructure secrets;
- unauthorized tenant information;
- unnecessary source-code content.

# 89. Multi-Tenant Response Security

The response layer must only serialize fields the caller is authorized to see.

Authorization occurs before response construction.

The serializer must not be relied upon as the primary authorization mechanism.

# 90. Response Validation

Every response type should be validated against its schema in tests.

Validation should cover:

- required fields;
- field types;
- enum values;
- nested objects;
- pagination;
- error objects;
- nullable fields;
- version compatibility.

# 91. Response Contract Tests

For each command:

    Request Fixture
         |
         v
    Handler
         |
         v
    Response
         |
         v
    Contract Validator

Contract tests should verify both successful and failure paths.

# 92. Backward Compatibility

A compatible response change may include:

- new optional data field;
- additional metadata;
- additional optional error detail.

A breaking response change includes:

- removing a required field;
- changing field type;
- changing meaning of an existing code;
- changing terminal/non-terminal semantics.

# 93. Unknown Response Fields

Clients should ignore unknown optional fields.

Clients must continue to process known required fields.

This allows additive protocol evolution.

# 94. Unknown Status Values

A client encountering an unknown status must fail safely.

It must not assume:

    unknown status = SUCCESS

For asynchronous operations, the client should preserve the operation reference
and query authoritative state when possible.

# 95. Unknown Codes

Unknown codes should be handled using the status as a fallback.

Example:

    status = FAILED
    code = NEW_SERVER_ERROR

The client can display the message and treat the operation as failed without
requiring prior knowledge of the code.

# 96. Error Localization

Server messages should not be treated as the localization source of truth.

The client may map stable error codes to localized UI messages.

Example:

    code = INSUFFICIENT_CREDITS

The Studio can display a localized equivalent.

# 97. Response Retry Guidance

The response should make retry behavior deterministic where practical.

Examples:

| Response | Retry |
|---|---|
| `UNAUTHORIZED` | Refresh/re-authenticate |
| `FORBIDDEN` | Do not retry without permission change |
| `NOT_FOUND` | Usually no |
| `CONFLICT` | Re-read state |
| `RESOURCE_UNAVAILABLE` | Retry later if marked retryable |
| `TIMEOUT` | Reconcile before retrying |
| `INVALID_REQUEST` | Correct request |
| `INSUFFICIENT_CREDITS` | Add credits/change request |
| `AGENT_OFFLINE` | Retry after agent recovery |
| `JOB_FAILED` | Diagnose/retry according to job policy |

# 98. Timeout Response

Example:

    {
        "status": "TIMEOUT",
        "code": "OPERATION_TIMEOUT",
        "message": "Operation exceeded the configured timeout",
        "data": {
            "operation_id": "op-001"
        },
        "error": {
            "code": "TIMEOUT",
            "message": "Operation timed out",
            "details": {
                "reconciliation_required": true
            }
        }
    }

A timeout does not automatically imply that a physical robot stopped.

# 99. Reconciliation After Timeout

For physical execution:

    TIMEOUT
       |
       v
    Query Job
       |
       v
    Query Run
       |
       v
    Query Agent
       |
       v
    Reconcile Resource
       |
       v
    Determine Actual State

This prevents duplicate execution after uncertain outcomes.

# 100. Response and Audit

Material operations should correlate response data with audit records.

Example:

    request_id
       |
       +--> response
       |
       +--> audit_event
       |
       +--> worker operation
       |
       +--> Lab Agent command

# 101. Response Observability

Metrics should include:

- response count;
- response status;
- response code;
- latency;
- payload size;
- retry rate;
- error rate;
- timeout rate.

Important business metrics include:

- booking conflicts;
- insufficient credits;
- artifact rejection;
- job failures;
- agent unavailable;
- runtime failures.

# 102. Phase Mapping

| Phase | Response Work |
|---|---|
| Phase 0 | Envelope, statuses, codes, errors |
| Phase 1 | Auth, projects, local IPC, basic API |
| Phase 2 | Artifact responses and validation |
| Phase 3 | Control Plane resource responses |
| Phase 4 | Booking and credit responses |
| Phase 5 | Job and Lab Agent responses |
| Phase 6 | Runtime and physical resource responses |
| Phase 7 | Run, telemetry, result, experiment responses |
| Phase 8 | Production hardening and governance |

# 103. Phase 0 — Foundation

Implement:

- standard envelope;
- status enum;
- code convention;
- error object;
- request correlation;
- pagination schema;
- asynchronous acceptance schema.

Acceptance:

- all baseline response schemas validate;
- codes are centrally defined;
- status semantics are documented.

# 104. Phase 1 — Studio

Implement:

- authentication responses;
- project responses;
- platform responses;
- local IPC responses;
- build/test responses.

Acceptance:

- Studio can distinguish success from acceptance;
- build progress is recoverable;
- local errors are structured.

# 105. Phase 2 — Artifact

Implement:

- artifact upload response;
- validation response;
- compatibility response;
- digest/signature result.

Acceptance:

- artifact acceptance is distinguishable from upload completion;
- validation completion is explicit;
- invalid artifacts provide actionable errors.

# 106. Phase 3 — Control Plane

Implement:

- user responses;
- organization responses;
- project responses;
- platform responses;
- worker operation responses.

Acceptance:

- tenant authorization is reflected correctly;
- database failures are translated to protocol errors;
- no internal SQL error leaks.

# 107. Phase 4 — Commercial

Implement:

- availability responses;
- booking responses;
- quote responses;
- credit responses;
- refund responses.

Acceptance:

- credit balances are authoritative;
- booking conflicts are explicit;
- financial errors are deterministic;
- duplicate operations are safe.

# 108. Phase 5 — Execution

Implement:

- job responses;
- Lab Agent responses;
- deployment responses;
- resource lock responses.

Acceptance:

- accepted jobs are not reported as completed;
- agent failures are explicit;
- resource conflicts are explicit;
- asynchronous state is durable.

# 109. Phase 6 — Physical Robot

Implement:

- runtime status responses;
- platform compatibility;
- physical resource state;
- agent configuration.

Acceptance:

- runtime failures are distinguishable;
- safety-related state is not confused with application state;
- cloud failure does not falsely indicate robot safety.

# 110. Phase 7 — Live and Results

Implement:

- run responses;
- telemetry responses;
- log responses;
- result responses;
- experiment responses.

Acceptance:

- large responses are bounded;
- pagination works;
- partial data is explicit;
- reconnect recovers current state.

# 111. Phase 8 — Production

Implement:

- response metrics;
- compatibility validation;
- error governance;
- rate limits;
- retry guidance;
- security hardening;
- response contract compatibility checks.

Acceptance:

- response contracts are enforced in CI;
- breaking changes are blocked;
- operational error rates are observable.

# 112. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| ACCEPTED interpreted as completed | Critical | Explicit semantics |
| HTTP 200 interpreted as success | High | Application status/code |
| Unstable error messages | High | Stable error codes |
| Missing error details | Medium | Structured errors |
| Unbounded collection response | High | Pagination |
| Partial results misinterpreted | High | Explicit partial metadata |
| Unknown status crash | Medium | Safe fallback |
| Duplicate operation | Critical | Idempotency |
| Timeout causes duplicate execution | Critical | Reconciliation |
| Sensitive data leakage | Critical | Response filtering |
| Tenant data leakage | Critical | Authorization before serialization |
| Contract drift | High | Schema tests |
| Stale response | Medium | Freshness semantics |
| Event loss | High | Durable state + REST recovery |
| Error code proliferation | Medium | Central catalogue |

# 113. Risk — ACCEPTED Misuse

The most dangerous semantic error is treating:

    ACCEPTED

as:

    COMPLETED

Mitigation:

- explicit non-terminal status;
- operation ID;
- durable resource state;
- event lifecycle;
- client tests.

# 114. Risk — HTTP Status Confusion

A successful HTTP transport response does not necessarily mean successful
business completion.

Example:

    HTTP 202
    application status = ACCEPTED

The API client must expose both transport and application semantics.

# 115. Risk — Partial Data Ambiguity

Returning incomplete telemetry with a normal success payload can cause incorrect
scientific or engineering conclusions.

Mitigation:

- `partial=true`;
- missing-data list;
- retryability;
- authoritative-state indication.

# 116. Risk — Timeout Ambiguity

A timeout can occur after the remote operation actually started.

Mitigation:

- operation ID;
- durable state;
- reconciliation;
- no blind retry for physical execution.

# 117. Risk — Error Information Leakage

Raw infrastructure exceptions can reveal:

- hostnames;
- SQL;
- paths;
- cloud resources;
- credentials;
- internal service topology.

Mitigation:

- error translation layer;
- stable public codes;
- sanitized details;
- internal correlation IDs.

# 118. Open Questions

1. Should every response include `data: null` on errors?
2. Should `retryable` be mandatory for transient errors?
3. Should responses include an explicit `operation_id` outside `data`?
4. Should `status=COMPLETED` be reserved exclusively for asynchronous operations?
5. Should `SUCCESS` be allowed for completed asynchronous polling operations?
6. What exact pagination limits will be enforced?
7. Will pagination support snapshot consistency?
8. Should partial results use a standard `partial` envelope field?
9. Should errors include a standardized `category`?
10. Should error details include support/reference IDs?
11. What response fields should be redacted by default?
12. Should Lab Channel responses use the same envelope exactly?
13. Should IPC responses use the same envelope exactly?
14. Should binary upload/download responses use JSON metadata envelopes?
15. Which response codes require audit records?
16. What is the compatibility policy for new status values?
17. Should unknown status values be treated as protocol errors?
18. What is the maximum response payload size?
19. Should telemetry use a separate response model?
20. What exact video-session response contract will be used?
21. What are the production retry/backoff defaults?
22. How long should operation references remain queryable?
23. What is the response retention policy for audit/support?
24. Which errors are safe to expose to end users?
25. Should localized client messages be maintained centrally?

# 119. Full Acceptance Criteria Checklist

## Envelope

- [ ] `protocol_version` is defined.
- [ ] `request_id` is defined.
- [ ] `timestamp` is defined.
- [ ] `status` is mandatory.
- [ ] `code` is mandatory.
- [ ] `message` is defined.
- [ ] `data` is defined.
- [ ] `error` is defined.
- [ ] Successful responses do not require an error object.
- [ ] Error responses provide structured error information.

## Status

- [ ] `SUCCESS` is defined.
- [ ] `ACCEPTED` is defined.
- [ ] `REJECTED` is defined.
- [ ] `PENDING` is defined.
- [ ] `IN_PROGRESS` is defined.
- [ ] `COMPLETED` is defined.
- [ ] `FAILED` is defined.
- [ ] `CANCELLED` is defined.
- [ ] `TIMEOUT` is defined.
- [ ] `UNAUTHORIZED` is defined.
- [ ] `FORBIDDEN` is defined.
- [ ] `NOT_FOUND` is defined.
- [ ] `CONFLICT` is defined.
- [ ] `INVALID_REQUEST` is defined.
- [ ] `UNAVAILABLE` is defined.

## ACCEPTED/COMPLETED Semantics

- [ ] `ACCEPTED` is explicitly non-terminal.
- [ ] `COMPLETED` is explicitly terminal.
- [ ] `ACCEPTED` never implies successful execution.
- [ ] Asynchronous operations expose an operation/resource identifier.
- [ ] Durable state can be queried after acceptance.
- [ ] Completion can be observed through events or state queries.
- [ ] Client disconnect does not invalidate the operation.

## Codes

- [ ] Codes are machine-readable.
- [ ] Codes use stable naming.
- [ ] Codes do not contain dynamic identifiers.
- [ ] Codes are documented centrally.
- [ ] Client logic does not parse human messages.
- [ ] Unknown codes have safe fallback behavior.

## Data

- [ ] Successful data is command-specific.
- [ ] Data schemas are versioned.
- [ ] Error responses do not expose unauthorized data.
- [ ] Large objects are not embedded unnecessarily.
- [ ] Sensitive fields are excluded.
- [ ] Data is validated before serialization.

## Errors

- [ ] Error code is stable.
- [ ] Error message is human-readable.
- [ ] Error details are structured.
- [ ] Field-level validation errors are supported.
- [ ] Retryability is represented where necessary.
- [ ] Internal exceptions are translated.
- [ ] Secrets are never returned.
- [ ] Infrastructure details are sanitized.

## Pagination

- [ ] Collection responses use a standard structure.
- [ ] `items` is defined.
- [ ] `next_cursor` is defined.
- [ ] `has_more` is defined.
- [ ] Cursor contents are opaque.
- [ ] Empty collections return successful empty results.
- [ ] Invalid cursors return stable errors.
- [ ] Maximum page size is enforced.
- [ ] Pagination behavior is tested.

## Partial Results

- [ ] Partial responses are explicitly marked.
- [ ] Missing data is identified.
- [ ] Retryability is identified where applicable.
- [ ] Partial data is not silently represented as complete.
- [ ] Authoritative versus provisional data is distinguishable.
- [ ] Partial response schemas are tested.

## HTTP

- [ ] HTTP 200 mapping is defined.
- [ ] HTTP 201 mapping is defined.
- [ ] HTTP 202 mapping is defined.
- [ ] HTTP 204 mapping is defined.
- [ ] HTTP 400 mapping is defined.
- [ ] HTTP 401 mapping is defined.
- [ ] HTTP 403 mapping is defined.
- [ ] HTTP 404 mapping is defined.
- [ ] HTTP 409 mapping is defined.
- [ ] HTTP 422 mapping is defined.
- [ ] HTTP 429 mapping is defined.
- [ ] HTTP 500 mapping is defined.
- [ ] HTTP 503 mapping is defined.

## Idempotency

- [ ] Repeated side-effecting requests are safe.
- [ ] Idempotency conflicts are explicit.
- [ ] Original logical responses can be returned.
- [ ] Physical execution retries are reconciled.
- [ ] Financial retries are protected.
- [ ] Booking retries are protected.

## Authorization

- [ ] Response data is filtered by authorization.
- [ ] Tenant isolation is enforced.
- [ ] Project access is enforced.
- [ ] Administrative responses are protected.
- [ ] Lab responses are protected.
- [ ] Unauthorized resources are not disclosed.

## WebSocket

- [ ] WebSocket events do not replace durable state.
- [ ] Event loss can be recovered.
- [ ] Duplicate events can be tolerated.
- [ ] Current state can be queried through REST.
- [ ] Asynchronous completion can be observed.

## Lab Protocol

- [ ] Lab responses use defined semantics.
- [ ] Agent registration response is defined.
- [ ] Heartbeat response is defined.
- [ ] Deployment response is defined.
- [ ] Resource response is defined.
- [ ] Job execution response is defined.
- [ ] Runtime failures are represented.
- [ ] Agent offline is represented.
- [ ] Reconciliation is supported.

## Studio IPC

- [ ] IPC responses use defined semantics.
- [ ] Build acceptance is distinct from completion.
- [ ] Test status is queryable.
- [ ] Artifact packaging reports validation state.
- [ ] Local failures use structured errors.
- [ ] Generic shell failures are not exposed as arbitrary raw responses.

## Security

- [ ] Credentials are never exposed.
- [ ] Secrets are never logged.
- [ ] Private keys are never returned.
- [ ] Tenant information is protected.
- [ ] Error details are sanitized.
- [ ] Unauthorized resource existence is protected where required.
- [ ] Response size limits exist.

## Observability

- [ ] Request IDs are logged.
- [ ] Response status is measurable.
- [ ] Response codes are measurable.
- [ ] Latency is measurable.
- [ ] Error rates are measurable.
- [ ] Timeout rates are measurable.
- [ ] Partial-result rates are measurable.
- [ ] Async operation completion is traceable.

## Compatibility

- [ ] Response schemas are centrally defined.
- [ ] Contract tests run in CI.
- [ ] Breaking response changes are detected.
- [ ] Additive optional fields are supported.
- [ ] Unknown fields are safely ignored.
- [ ] Status compatibility is governed.
- [ ] Error-code compatibility is governed.

## Phase Completion

- [ ] Phase 0 response foundation is complete.
- [ ] Phase 1 Studio responses are complete.
- [ ] Phase 2 artifact responses are complete.
- [ ] Phase 3 Control Plane responses are complete.
- [ ] Phase 4 commercial responses are complete.
- [ ] Phase 5 execution responses are complete.
- [ ] Phase 6 physical runtime responses are complete.
- [ ] Phase 7 live/result responses are complete.
- [ ] Phase 8 production response governance is complete.

# 120. Final Response Architecture Baseline

The Kritva RaaS response model establishes the following invariant:

> **A response reports what the system actually knows about the requested operation; it never represents acceptance as completion and never hides uncertainty behind a generic success response.**

The standard synchronous path is:

    Request
       |
       v
    Validate
       |
       v
    Authorize
       |
       v
    Execute
       |
       v
    SUCCESS
       |
       v
    data

The standard asynchronous path is:

    Request
       |
       v
    Validate
       |
       v
    Authorize
       |
       v
    Accept
       |
       v
    ACCEPTED
       |
       v
    Durable State
       |
       +--> PENDING
       +--> IN_PROGRESS
       +--> COMPLETED
       |
       +--> FAILED
       +--> CANCELLED
       +--> TIMEOUT

The standard failure path is:

    Request
       |
       v
    Validation / Authorization / Domain Processing
       |
       v
    Error Classification
       |
       v
    status + code + message + error
       |
       v
    Client Recovery

The response architecture therefore guarantees:

1. `status` communicates broad application semantics.
2. `code` provides stable machine-readable meaning.
3. `message` provides human-readable context.
4. `data` contains typed operation results.
5. `error` contains structured failure information.
6. `request_id` provides correlation.
7. `ACCEPTED` is explicitly non-terminal.
8. `COMPLETED` represents actual completion of an asynchronous operation.
9. Pagination is explicit and bounded.
10. Partial results are explicit rather than silently incomplete.
11. HTTP transport status is distinct from application status.
12. Idempotency protects financial, booking, resource, and execution operations.
13. Durable state remains authoritative for asynchronous workflows.
14. WebSocket events provide realtime notification, not authoritative state.
15. Lab failures and robot execution uncertainty require reconciliation.
16. Unauthorized data is never returned merely because a resource exists.
17. Protocol errors are stable and implementation-independent.
18. Internal infrastructure failures are translated into safe protocol errors.
19. Response contracts evolve through controlled compatibility rules.
20. All response categories are testable through shared contracts.

This response model provides the common semantic foundation for the complete
Kritva RaaS protocol:

    Studio IPC
         |
         v
    REST / WebSocket
         |
         v
    Control Plane
         |
         v
    Lab Channel
         |
         v
    Runtime

and supports the complete product lifecycle:

    Build
      |
      v
    Package
      |
      v
    Upload
      |
      v
    Book
      |
      v
    Execute
      |
      v
    Observe
      |
      v
    Complete
      |
      v
    Analyze
      |
      v
    Rerun

The resulting response contract is designed to remain stable as Kritva RaaS
evolves from development infrastructure into a production multi-platform
robotics execution service.
