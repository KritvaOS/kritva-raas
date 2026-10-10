# Kritva RaaS Message Envelope Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Message Envelope Specification |
| Path | `docs/protocol/ENVELOPES.md` |
| Product | Kritva Robotics-as-a-Service |
| Protocol Model | Versioned message-envelope contract |
| REST API | `/api/v1/` |
| Realtime | WebSocket |
| Lab Boundary | Secure Lab Channel |
| Desktop Boundary | Tauri IPC |
| Shared Contracts | `packages/contracts` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the common message envelope used by Kritva RaaS
protocols.

The envelope provides a consistent structure for:

- requests;
- responses;
- events;
- errors;
- correlation;
- tracing;
- timestamps;
- resource identity;
- tenant context;
- protocol versioning;
- metadata;
- payload validation.

The envelope is the common protocol foundation shared by the command, response,
event, and error specifications.

The governing principle is:

> **Transport carries messages; envelopes provide consistent protocol semantics; payloads provide domain meaning.**

## 3. Scope

This specification covers:

- request envelopes;
- response envelopes;
- event envelopes;
- common headers;
- metadata;
- request IDs;
- correlation IDs;
- operation IDs;
- trace IDs;
- span IDs;
- timestamps;
- protocol versions;
- schema versions;
- resource references;
- tenant context;
- actor context;
- idempotency keys;
- pagination metadata;
- retry metadata;
- error metadata;
- payload limits;
- encoding;
- JSON representation;
- validation;
- compatibility;
- tracing;
- transport mapping;
- examples;
- phase implementation.

## 4. Goals

The envelope architecture shall:

1. provide a uniform message structure;
2. distinguish requests, responses, and events;
3. support REST;
4. support WebSocket;
5. support Lab Agent communication;
6. support Tauri IPC;
7. support correlation across distributed components;
8. support distributed tracing;
9. support asynchronous operations;
10. support idempotency;
11. support protocol evolution;
12. support bounded message sizes;
13. support schema validation;
14. prevent sensitive metadata leakage;
15. allow transport-independent domain contracts.

## 5. Non-Goals

This document does not define:

- individual domain commands;
- individual domain events;
- complete error-code semantics;
- database schemas;
- cloud-provider-specific headers;
- video transport;
- bulk telemetry storage;
- binary artifact format;
- physical safety protocols.

Those concerns are defined by their respective protocol and architecture
documents.

# 6. Protocol Layering

Kritva RaaS separates transport, envelope, and payload:

    +----------------------------------+
    | Transport                        |
    | HTTP / WebSocket / IPC / Lab    |
    +----------------------------------+
                    |
                    v
    +----------------------------------+
    | Message Envelope                 |
    | identity / version / context     |
    | correlation / tracing / metadata |
    +----------------------------------+
                    |
                    v
    +----------------------------------+
    | Domain Payload                   |
    | command / response / event data  |
    +----------------------------------+

This separation prevents transport-specific implementation details from
becoming application-level contracts.

# 7. Message Types

The platform defines three primary message types:

| Message | Purpose |
|---|---|
| Request | Ask a component to perform an operation |
| Response | Report the result of a request |
| Event | Notify that something happened |

Errors are represented within responses or asynchronous operation state and use
the common error model.

# 8. Request Envelope

The canonical request envelope is:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:00Z",
        "command": "project.create",
        "actor": {
            "type": "user",
            "id": "user-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": null
        },
        "correlation": {
            "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
            "span_id": "00f067aa0ba902b7"
        },
        "metadata": {},
        "payload": {
            "name": "Vision Experiment"
        }
    }

# 9. Response Envelope

The canonical response envelope is:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "SUCCESS",
        "code": "PROJECT_CREATED",
        "message": "Project created",
        "correlation": {
            "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
            "span_id": "00f067aa0ba902b7",
            "parent_span_id": "8a1b2c3d4e5f6789"
        },
        "metadata": {},
        "data": {
            "project_id": "project-001"
        },
        "error": null
    }

# 10. Event Envelope

The canonical event envelope is:

    {
        "protocol_version": "1.0",
        "event_id": "evt-12345",
        "timestamp": "2026-10-08T00:00:02Z",
        "event": "project.created",
        "resource": {
            "type": "project",
            "id": "project-001"
        },
        "context": {
            "organization_id": "org-001"
        },
        "sequence": 1,
        "correlation": {
            "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
            "span_id": "0af7651916cd43dd"
        },
        "metadata": {},
        "data": {
            "project_id": "project-001",
            "name": "Vision Experiment"
        }
    }

# 11. Envelope Comparison

| Field | Request | Response | Event |
|---|---:|---:|---:|
| `protocol_version` | Required | Required | Required |
| `request_id` | Required | Required | No |
| `event_id` | No | No | Required |
| `timestamp` | Required | Required | Required |
| `command` | Required | No | No |
| `event` | No | No | Required |
| `status` | No | Required | No |
| `code` | Optional | Required | Optional |
| `message` | No | Required | Optional |
| `actor` | Optional | Optional | Optional |
| `context` | Required | Optional | Required where applicable |
| `resource` | Optional | Optional | Required |
| `sequence` | No | No | Conditional |
| `correlation` | Recommended | Recommended | Recommended |
| `metadata` | Optional | Optional | Optional |
| `payload/data` | Required | Required | Required |
| `error` | No | Conditional | No |

# 12. Envelope Invariants

Every message must satisfy:

1. exactly one message semantic type;
2. valid protocol version;
3. valid timestamp;
4. valid message-specific identifier;
5. schema-valid payload;
6. bounded message size;
7. valid correlation metadata where present;
8. no secret material;
9. no transport-specific semantics in domain payload;
10. no undocumented required fields.

# 13. Protocol Version

`protocol_version` identifies the envelope and protocol compatibility generation.

Example:

    "protocol_version": "1.0"

The format is:

    MAJOR.MINOR

Rules:

- MAJOR changes may break compatibility;
- MINOR changes must remain backward compatible;
- optional fields may be added in a compatible minor release;
- required field removal requires a major version.

# 14. Schema Version

Individual payload contracts may additionally define a schema version.

Example:

    "metadata": {
        "schema_version": "artifact.v2"
    }

Schema versioning is only required where protocol version alone is insufficient.

The implementation must avoid unnecessary duplication of version fields.

# 15. Request ID

`request_id` uniquely identifies an individual request message.

Example:

    "request_id": "req-01J..."

Requirements:

- unique within the required operational scope;
- opaque;
- immutable;
- returned unchanged in the response;
- included in relevant downstream correlation.

A request ID must not encode sensitive information.

# 16. Response Request ID

A response must echo the request ID:

    Request:
        request_id = req-123

    Response:
        request_id = req-123

This allows clients to correlate the immediate response without relying on
network ordering.

# 17. Event ID

`event_id` uniquely identifies an event.

Example:

    "event_id": "evt-01J..."

Event IDs support:

- deduplication;
- replay;
- tracing;
- support;
- audit.

An event ID is not a resource ID.

# 18. Resource ID

Resource identity identifies the business object affected by a message.

Example:

    "resource": {
        "type": "job",
        "id": "job-001"
    }

Resource IDs should be opaque stable identifiers.

# 19. Correlation ID

Correlation identifies related messages belonging to the same logical
operation.

The recommended correlation structure is:

    "correlation": {
        "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
        "span_id": "00f067aa0ba902b7",
        "parent_span_id": "8a1b2c3d4e5f6789",
        "operation_id": "op-001"
    }

# 20. Trace ID

`trace_id` identifies the end-to-end distributed operation.

Example flow:

    Studio
       |
       | trace_id=T1
       v
    Control Plane
       |
       | trace_id=T1
       v
    Worker
       |
       | trace_id=T1
       v
    Lab Agent
       |
       | trace_id=T1
       v
    Runtime

All components may therefore correlate logs and traces.

# 21. Span ID

`span_id` identifies a single processing span.

Example:

    trace_id = T1

    Studio span      S1
    API span         S2
    Worker span      S3
    Agent span       S4

Each span has its own span ID while sharing the trace ID.

# 22. Parent Span ID

`parent_span_id` identifies the parent processing span where distributed tracing
is available.

This creates:

    S1
     |
     +--> S2
           |
           +--> S3
                 |
                 +--> S4

# 23. Operation ID

`operation_id` identifies a logical long-running operation.

Example:

    job.start
        |
        operation_id = op-001
        |
        +--> job.queued
        +--> job.validating
        +--> job.running
        +--> job.completed

An operation ID may span multiple requests, workers, and events.

# 24. Correlation Rules

The following rules apply:

| Identifier | Primary Purpose |
|---|---|
| Request ID | One request |
| Event ID | One event |
| Resource ID | One domain resource |
| Operation ID | One logical async operation |
| Trace ID | Distributed execution trace |
| Span ID | One trace processing span |
| Idempotency Key | Duplicate side-effect protection |

These identifiers must not be conflated.

# 25. Idempotency Key

Side-effecting requests may require:

    "metadata": {
        "idempotency_key": "idem-01J..."
    }

Required for operations such as:

- booking creation;
- job creation;
- credit operations;
- payment operations;
- resource allocation;
- deployment;
- physical execution.

# 26. Idempotency Rules

For the same idempotency key:

    same request
        |
        v
    return original result

For:

    same key
        +
    different request
        |
        v
    IDEMPOTENCY_KEY_REUSED

The server must not execute the second conflicting request.

# 27. Actor Metadata

Where authorization context is required, the envelope may contain:

    "actor": {
        "type": "user",
        "id": "user-001"
    }

Supported actor types may include:

    user
    service
    lab_agent
    system

Actor metadata is informational and must not replace authentication.

# 28. Context Metadata

`context` identifies tenant and domain scope.

Example:

    "context": {
        "organization_id": "org-001",
        "project_id": "project-001",
        "lab_id": "lab-001"
    }

Only relevant identifiers should be included.

# 29. Tenant Context

Organization-scoped messages should carry:

    organization_id

Tenant context enables:

- tracing;
- auditing;
- authorization checks;
- diagnostics.

Tenant context is never trusted solely because it appears in a client message.

The server derives or verifies authorization from authenticated identity.

# 30. Resource Context

Messages may identify related resources.

Example:

    "context": {
        "organization_id": "org-001",
        "project_id": "project-001",
        "booking_id": "booking-001",
        "job_id": "job-001",
        "run_id": "run-001"
    }

Only applicable context should be populated.

# 31. Metadata

Metadata is non-domain information supporting transport, correlation,
idempotency, pagination, or diagnostics.

Examples:

    request metadata:
        idempotency_key
        client_version
        client_platform

    response metadata:
        server_version
        rate_limit
        retry_after

    event metadata:
        schema_version
        source
        delivery

Metadata must not become an uncontrolled secondary payload.

# 32. Headers vs Envelope Metadata

Transport-specific headers should carry transport concerns.

Example HTTP headers:

    Authorization
    Content-Type
    Accept
    Idempotency-Key
    Traceparent

The envelope carries application-level semantics.

Do not duplicate every HTTP header into JSON.

# 33. HTTP Header Mapping

Recommended mapping:

| HTTP Header | Envelope/Meaning |
|---|---|
| `Authorization` | Authentication context |
| `Content-Type` | Transport encoding |
| `Accept` | Requested representation |
| `Idempotency-Key` | `metadata.idempotency_key` |
| `traceparent` | Trace context |
| `tracestate` | Trace vendor state |
| `X-Request-ID` | Request correlation if adopted |

The implementation should define one canonical strategy and avoid conflicting
duplicate values.

# 34. Header Precedence

If both a transport header and envelope field represent the same semantic:

1. validate consistency;
2. reject conflicting values where security-relevant;
3. use authenticated/transport-derived values for security decisions.

For example, an untrusted `organization_id` in a JSON envelope must not override
the organization established by authorization.

# 35. Timestamp Model

Every request, response, and event has a `timestamp`.

Format:

    ISO 8601 / RFC 3339 UTC

Example:

    2026-10-08T00:00:01.123Z

# 36. Timestamp Precision

The platform should support millisecond precision.

Example:

    2026-10-08T00:00:01.123Z

Higher precision may be used internally where required, but clients should not
depend on nanosecond precision.

# 37. Timestamp Semantics

Envelope `timestamp` means:

> Time at which the message was created by the sending component.

It does not necessarily mean:

- physical observation time;
- database commit time;
- client display time.

# 38. Observed Timestamp

Telemetry and robot events may include:

    "observed_at": "2026-10-08T00:00:01.123Z"

This represents when the physical/runtime measurement occurred.

Example:

    {
        "timestamp": "2026-10-08T00:00:01.500Z",
        "data": {
            "observed_at": "2026-10-08T00:00:01.123Z"
        }
    }

# 39. Received Timestamp

Infrastructure may internally record:

    received_at

This need not be part of the public envelope.

It is useful for measuring:

    observed_at
        |
        v
    received_at
        |
        v
    published_at
        |
        v
    delivered_at

# 40. Clock Skew

Components should synchronize clocks using standard infrastructure.

The protocol must not rely solely on timestamps for correctness.

Correctness must instead use:

- resource state;
- sequence numbers;
- database state;
- operation state.

# 41. Sequence Number

Events that require ordering may include:

    "sequence": 42

Sequence is normally scoped to:

    resource + event stream

It is not a global ordering guarantee.

# 42. Sequence Rules

Consumers should:

- accept increasing sequence;
- detect gaps;
- ignore stale events where safe;
- request replay;
- reconcile from authoritative state.

Example:

    40
    41
    43

The missing `42` should trigger gap handling where the stream requires strict
ordering.

# 43. Envelope Size

Production message sizes must be bounded.

Recommended baseline:

| Message | Recommended Maximum |
|---|---:|
| Request | 1 MiB |
| Response | 1 MiB |
| Event | 256 KiB |
| Error response | 64 KiB |
| Telemetry batch | 256 KiB |
| Local IPC message | 1 MiB |

These are baseline limits and may be refined during implementation.

# 44. Large Payload Rule

Large data must not be embedded in envelopes.

Use:

- object storage;
- signed download URLs;
- result APIs;
- dedicated telemetry channels;
- log streaming;
- artifact upload/download protocols.

Example:

    result.available
         |
         v
    result_id
         |
         v
    result.files
         |
         v
    object storage

# 45. Artifact Payload Rule

`.krv` artifacts must not be embedded in JSON envelopes.

The envelope carries:

- artifact ID;
- upload metadata;
- digest;
- validation state;
- storage reference where appropriate.

Binary content uses the artifact transfer mechanism.

# 46. Video Payload Rule

Video frames must not be embedded in standard event envelopes.

Use the dedicated live-video transport.

The envelope may communicate:

    video.started
    video.stopped
    video.unavailable

The media stream remains separate.

# 47. Telemetry Payload Rule

Low-frequency telemetry may be included in events.

High-frequency telemetry should use:

- batching;
- streaming;
- dedicated transport;
- bounded WebSocket channels.

The standard envelope remains the control-plane metadata model.

# 48. JSON Encoding

JSON is the baseline control-plane message representation.

Requirements:

- UTF-8;
- valid JSON;
- no comments;
- no duplicate object keys;
- stable field names;
- documented nullable behavior.

# 49. Field Naming

JSON field names use `snake_case`.

Examples:

    protocol_version
    request_id
    event_id
    operation_id
    organization_id
    retry_after_seconds

Domain payloads follow the same convention unless a specific external contract
requires another format.

# 50. Null Handling

Required fields must not be omitted.

Optional fields may be omitted when not applicable.

Use `null` only where the contract explicitly permits a nullable value.

Example:

    "error": null

For an absent optional metadata value, omission is generally preferred.

# 51. Empty Collections

Collections should be represented as arrays.

Example:

    "items": []

An empty array means a successful empty collection, not an error.

# 52. Boolean Fields

Boolean values must use JSON booleans:

    true
    false

Do not use:

    "true"
    "false"
    1
    0

# 53. Enumerations

Enumerated values must be stable uppercase strings unless a domain contract
explicitly specifies another convention.

Example:

    "status": "ACCEPTED"

# 54. Request Schema

Conceptual JSON Schema:

    {
        "type": "object",
        "required": [
            "protocol_version",
            "request_id",
            "timestamp",
            "command",
            "payload"
        ],
        "properties": {
            "protocol_version": {
                "type": "string"
            },
            "request_id": {
                "type": "string"
            },
            "timestamp": {
                "type": "string",
                "format": "date-time"
            },
            "command": {
                "type": "string"
            },
            "actor": {
                "type": "object"
            },
            "context": {
                "type": "object"
            },
            "correlation": {
                "type": "object"
            },
            "metadata": {
                "type": "object"
            },
            "payload": {
                "type": "object"
            }
        },
        "additionalProperties": false
    }

# 55. Response Schema

Conceptual JSON Schema:

    {
        "type": "object",
        "required": [
            "protocol_version",
            "request_id",
            "timestamp",
            "status",
            "code",
            "message",
            "data",
            "error"
        ],
        "properties": {
            "protocol_version": {
                "type": "string"
            },
            "request_id": {
                "type": "string"
            },
            "timestamp": {
                "type": "string",
                "format": "date-time"
            },
            "status": {
                "type": "string"
            },
            "code": {
                "type": "string"
            },
            "message": {
                "type": "string"
            },
            "correlation": {
                "type": "object"
            },
            "metadata": {
                "type": "object"
            },
            "data": {},
            "error": {}
        },
        "additionalProperties": false
    }

# 56. Event Schema

Conceptual JSON Schema:

    {
        "type": "object",
        "required": [
            "protocol_version",
            "event_id",
            "timestamp",
            "event",
            "resource",
            "data"
        ],
        "properties": {
            "protocol_version": {
                "type": "string"
            },
            "event_id": {
                "type": "string"
            },
            "timestamp": {
                "type": "string",
                "format": "date-time"
            },
            "event": {
                "type": "string"
            },
            "resource": {
                "type": "object"
            },
            "context": {
                "type": "object"
            },
            "sequence": {
                "type": "integer",
                "minimum": 0
            },
            "correlation": {
                "type": "object"
            },
            "metadata": {
                "type": "object"
            },
            "data": {}
        },
        "additionalProperties": false
    }

# 57. Correlation Schema

Conceptual structure:

    {
        "type": "object",
        "properties": {
            "trace_id": {
                "type": "string"
            },
            "span_id": {
                "type": "string"
            },
            "parent_span_id": {
                "type": "string"
            },
            "operation_id": {
                "type": "string"
            }
        },
        "additionalProperties": false
    }

# 58. Resource Schema

    {
        "type": "object",
        "required": [
            "type",
            "id"
        ],
        "properties": {
            "type": {
                "type": "string"
            },
            "id": {
                "type": "string"
            }
        },
        "additionalProperties": false
    }

# 59. Metadata Schema

Conceptual:

    {
        "type": "object",
        "properties": {
            "idempotency_key": {
                "type": "string"
            },
            "schema_version": {
                "type": "string"
            },
            "client_version": {
                "type": "string"
            },
            "client_platform": {
                "type": "string"
            },
            "retry_after_seconds": {
                "type": "integer",
                "minimum": 0
            }
        },
        "additionalProperties": false
    }

# 60. Request Flow

    Studio
       |
       | Request Envelope
       v
    API Gateway
       |
       | validate transport
       v
    Authentication
       |
       | establish identity
       v
    Authorization
       |
       | validate context
       v
    Domain Service
       |
       v
    Durable State
       |
       v
    Response Envelope

# 61. Asynchronous Request Flow

    Studio
       |
       | job.start
       v
    Control Plane
       |
       v
    Response
       |
       | ACCEPTED
       v
    operation_id
       |
       v
    Queue
       |
       v
    Worker
       |
       v
    Lab Agent
       |
       v
    Events
       |
       v
    Studio

# 62. Event Flow

    Domain Service
         |
         v
    Durable State
         |
         v
    Event Publisher
         |
         v
    Event Envelope
         |
         +----> WebSocket
         |
         +----> Lab Channel
         |
         +----> Operational Consumers

# 63. Request Correlation Flow

    request_id = R1
    operation_id = O1
    trace_id = T1

    Studio
      |
      | R1 / O1 / T1
      v
    API
      |
      | T1
      v
    Worker
      |
      | T1 / O1
      v
    Lab Agent
      |
      | T1 / O1
      v
    Event

All relevant components can therefore associate the same logical operation.

# 64. Response Correlation

Example:

    Request:
        request_id = req-100
        operation_id = op-200
        trace_id = trace-300

    Response:
        request_id = req-100
        operation_id = op-200
        trace_id = trace-300

The request ID must be echoed.

# 65. Event Correlation

Example:

    job.start
        request_id = req-100
        operation_id = op-200
        trace_id = T1

    job.running
        event_id = evt-500
        operation_id = op-200
        trace_id = T1

    job.completed
        event_id = evt-501
        operation_id = op-200
        trace_id = T1

# 66. Trace Propagation

Distributed trace context should propagate through:

    Studio
       |
       v
    Control Plane
       |
       v
    Queue/Worker
       |
       v
    Lab Agent
       |
       v
    Runtime

The platform should support standard trace propagation such as W3C Trace
Context where practical.

# 67. Trace Security

Trace metadata must not contain:

- access tokens;
- passwords;
- source code;
- financial secrets;
- private keys.

Trace IDs may be exposed to users as support/correlation identifiers.

# 68. Support Correlation

A user-facing failure may expose:

    request_id
    operation_id

Example:

    "The job could not be started.
     Reference: req-12345"

The reference allows support to locate the operation without exposing internal
implementation details.

# 69. Correlation Persistence

Durable entities may store:

- creation operation ID;
- originating request ID;
- relevant trace ID.

Trace retention is normally shorter than business data retention.

# 70. Security Context

The envelope must not be treated as an authentication mechanism.

Authentication comes from:

- HTTP authentication;
- WebSocket authentication;
- Lab Agent identity;
- Tauri application/runtime trust boundary.

The envelope provides context after identity has been established.

# 71. Envelope Validation Order

Recommended processing:

    Receive Message
         |
         v
    Transport Validation
         |
         v
    Size Validation
         |
         v
    Encoding Validation
         |
         v
    Envelope Schema Validation
         |
         v
    Authentication
         |
         v
    Authorization
         |
         v
    Payload Schema Validation
         |
         v
    Domain Processing

# 72. Invalid Envelope

Malformed envelope should return:

    PROTOCOL_MESSAGE_INVALID

Example:

    {
        "status": "INVALID_REQUEST",
        "code": "PROTOCOL_MESSAGE_INVALID",
        "message": "The message format is invalid.",
        "error": {
            "retryable": false
        }
    }

# 73. Unsupported Version

If a client sends an unsupported major version:

    PROTOCOL_VERSION_UNSUPPORTED

The response should identify supported versions where safe.

# 74. Payload Validation

An envelope may be valid while its payload is invalid.

Example:

    Envelope valid
        |
        v
    booking.create
        |
        v
    Payload invalid
        |
        v
    VALIDATION_FAILED

This distinction helps diagnose protocol versus domain validation failures.

# 75. Unknown Fields

For forward compatibility, consumers should tolerate unknown optional fields
where the schema policy allows it.

Security-sensitive fields must not be silently interpreted.

The canonical schema policy should be explicit for each contract.

# 76. Required Fields

Required envelope fields cannot be removed within a compatible minor version.

A new required field requires a compatibility strategy.

# 77. Additional Properties

The baseline schemas show `additionalProperties: false` for canonical
contracts to detect accidental schema drift.

Where forward compatibility requires extensions, a dedicated metadata or
extensions object should be used instead of arbitrary top-level fields.

# 78. Extensions

If extensions are required:

    "metadata": {
        "extensions": {
            "vendor.example": {
                "key": "value"
            }
        }
    }

Extensions must not redefine standard fields.

# 79. Vendor Metadata

Vendor-specific metadata should be:

- namespaced;
- optional;
- non-authoritative;
- documented;
- excluded from core semantics.

Vendor extensions must not change the meaning of a Kritva error, command, or
event.

# 80. REST Mapping

REST request:

    POST /api/v1/jobs

contains the request payload/envelope according to the selected API convention.

REST response:

    HTTP status
    +
    response envelope

The API must maintain a consistent mapping between HTTP and application
semantics.

# 81. WebSocket Mapping

WebSocket messages carry envelope semantics directly.

Example:

    {
        "type": "event",
        "event": "job.running",
        ...
    }

The WebSocket framing field `type` may be transport-specific.

The domain event remains defined by the common event envelope.

# 82. WebSocket Control Messages

Subscription control messages may use a separate transport envelope:

    {
        "type": "subscribe",
        "request_id": "req-sub-001",
        "payload": {
            "resource_type": "job",
            "resource_id": "job-001"
        }
    }

Subscription control is not a domain event.

# 83. Lab Channel Mapping

Lab communication uses the common envelope model.

Typical flow:

    Control Plane
       |
       | request envelope
       v
    Lab Agent
       |
       | response envelope
       v
    Control Plane

Observed state returns as events or state messages.

# 84. Tauri IPC Mapping

Studio UI communicates with privileged Rust local runtime through Tauri IPC.

Example:

    React UI
       |
       | IPC request envelope
       v
    Rust Local Runtime
       |
       | IPC response envelope
       v
    React UI

IPC messages should use the same command/response semantics while respecting
the local runtime boundary.

# 85. Envelope and Command Contract

A command payload is nested inside the request envelope.

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "command": "artifact.validate",
        "payload": {
            "artifact_id": "artifact-001"
        }
    }

The envelope does not redefine command-specific fields.

# 86. Envelope and Response Contract

The response envelope wraps command result semantics.

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "SUCCESS",
        "code": "ARTIFACT_ACCEPTED",
        "message": "Artifact accepted.",
        "data": {
            "artifact_id": "artifact-001"
        },
        "error": null
    }

# 87. Envelope and Error Contract

Errors are carried in the response envelope.

Example:

    {
        "status": "CONFLICT",
        "code": "BOOKING_CONFLICT",
        "message": "The selected robot is no longer available for this time slot.",
        "data": null,
        "error": {
            "retryable": false
        }
    }

The full error-code registry is defined in `ERROR_CODES.md`.

# 88. Envelope and Event Contract

Events use the same correlation and context concepts as requests and responses.

Example:

    {
        "protocol_version": "1.0",
        "event_id": "evt-001",
        "timestamp": "2026-10-08T00:00:05Z",
        "event": "job.running",
        "resource": {
            "type": "job",
            "id": "job-001"
        },
        "correlation": {
            "operation_id": "op-001",
            "trace_id": "trace-001"
        },
        "data": {
            "run_id": "run-001"
        }
    }

# 89. Pagination Metadata

List responses may contain pagination metadata:

    {
        "data": {
            "items": [],
            "next_cursor": "cursor-abc",
            "has_more": true
        }
    }

Pagination belongs inside domain response data unless the API contract
explicitly standardizes it in metadata.

# 90. Retry Metadata

Retry guidance may appear in `error`:

    {
        "error": {
            "retryable": true,
            "retry_after_seconds": 30
        }
    }

This avoids placing domain failure semantics into HTTP headers alone.

# 91. Rate Limit Metadata

Rate-limit information may appear in transport headers and/or response metadata.

Example:

    "metadata": {
        "rate_limit": {
            "limit": 100,
            "remaining": 10,
            "reset_at": "2026-10-08T00:01:00Z"
        }
    }

Exact fields remain subject to API gateway implementation.

# 92. Envelope and Durable State

Envelopes do not replace database state.

For example:

    job.running event
          |
          v
    UI state

while:

    PostgreSQL
          |
          v
    Authoritative job state

If they differ, the durable state and reconciliation rules determine the final
state.

# 93. Envelope and Object Storage

Large content is referenced, not embedded.

Example:

    {
        "data": {
            "result_id": "result-001",
            "file_count": 3
        }
    }

The client then calls:

    result.files
    result.download

# 94. Envelope and Queue

Queue messages may contain the same correlation information.

Example:

    {
        "operation_id": "op-001",
        "trace_id": "trace-001",
        "job_id": "job-001"
    }

Queue implementation details remain internal.

# 95. Envelope and Database Transactions

A domain transaction may produce:

    business state
        +
    outbox event

The event envelope is created from committed domain state.

This supports reliable event publication.

# 96. Event Ordering

Events use:

    sequence

when ordering is required.

Example:

    job.queued       sequence 10
    job.validating   sequence 11
    job.deploying    sequence 12
    job.running      sequence 13

No global ordering is implied.

# 97. Delivery Metadata

Delivery-specific metadata may include:

    "metadata": {
        "delivery": {
            "attempt": 2,
            "replayed": true
        }
    }

Delivery metadata should be generated by the delivery layer and must not alter
the event's business identity.

# 98. Replay

Replay may use:

    event_id
    sequence
    cursor

A replayed event retains its original:

    event_id
    timestamp
    resource
    sequence

The delivery metadata may indicate that it was replayed.

# 99. Duplicate Delivery

The same event may be delivered multiple times.

Consumers identify duplicates using:

    event_id

They should not use timestamp or payload equality as the primary deduplication
mechanism.

# 100. Event Identity Preservation

Replay must not create a new event ID.

Example:

    Original:
        event_id = evt-100

    Replay:
        event_id = evt-100

This allows deterministic deduplication.

# 101. Request Replay

Clients must not automatically repeat a side-effecting request solely because
the response was lost.

Instead:

    response lost
       |
       v
    operation status query
       |
       v
    authoritative state

Idempotency keys provide additional protection.

# 102. Lost Response Flow

    Client
       |
       | job.create
       v
    Control Plane
       |
       v
    Database COMMIT
       |
       X
    Response lost
       |
       v
    Client reconnects
       |
       v
    Query by idempotency key
       |
       v
    Original result

# 103. Timeout Semantics

A transport timeout does not necessarily mean the operation failed.

Example:

    Client
       |
       | request
       v
    Server
       |
       v
    Operation committed
       |
       X
    network timeout

The client must reconcile before retrying side-effecting operations.

# 104. Transport Failure

Transport failures include:

- connection reset;
- DNS failure;
- TLS failure;
- timeout;
- WebSocket disconnect.

They are not automatically domain failures.

The client should distinguish:

    Transport Failure
        vs
    Application Error
        vs
    Domain State

# 105. Envelope Security

Envelope validation must protect against:

- oversized messages;
- malformed JSON;
- injection;
- unauthorized context;
- spoofed identity;
- trace manipulation;
- replay abuse;
- resource enumeration.

# 106. Message Size Enforcement

Size limits should be enforced:

    network ingress
        |
        v
    gateway
        |
        v
    application
        |
        v
    schema validator

Oversized messages should be rejected before expensive processing.

# 107. Compression

Compression may be supported for transport efficiency.

Compression must not bypass message-size protections.

The effective decompressed payload size must remain within limits.

# 108. Content Negotiation

REST APIs should explicitly define supported content types.

Baseline:

    application/json

Binary transfers should use dedicated content types and protocols rather than
embedding binary data into JSON.

# 109. Character Encoding

JSON messages use:

    UTF-8

Invalid encoding must be rejected before JSON parsing.

# 110. Envelope Validation Performance

Validation should be bounded and efficient.

Recommended processing:

    size check
      |
      v
    JSON parse
      |
      v
    envelope schema
      |
      v
    authentication
      |
      v
    authorization
      |
      v
    domain schema

This avoids unnecessary domain processing for malformed messages.

# 111. Schema Registry

The canonical contracts should be maintained in:

    packages/contracts/

Suggested structure:

    packages/contracts/
        envelopes/
            request/
            response/
            event/
            common/

The exact schema technology may be JSON Schema or a typed schema framework
that generates equivalent validation artifacts.

# 112. Contract Generation

Where practical:

    Contract Schema
          |
          +--> TypeScript types
          |
          +--> Rust types
          |
          +--> API validation
          |
          +--> Test fixtures

This minimizes divergence between Studio, backend, and Lab Agent.

# 113. Contract Testing

CI must validate:

- required fields;
- field types;
- enum values;
- timestamp format;
- identifier format;
- compatibility;
- maximum size;
- serialization;
- deserialization.

# 114. Producer Contract Testing

Every producer must be tested for:

- valid envelope;
- correct protocol version;
- correct correlation;
- correct resource;
- correct event/request identity;
- payload schema.

# 115. Consumer Contract Testing

Every consumer must be tested for:

- valid message handling;
- unknown optional fields;
- duplicate events;
- out-of-order events;
- unsupported versions;
- malformed messages;
- oversized messages.

# 116. Backward Compatibility

A new compatible version must allow existing clients to continue operating.

Compatible changes include:

- optional metadata;
- optional payload fields;
- new event types;
- additional diagnostics.

# 117. Breaking Changes

Breaking changes include:

- changing field type;
- removing required field;
- changing field meaning;
- changing identifier semantics;
- changing timestamp semantics;
- changing status semantics.

These require versioning and migration.

# 118. Forward Compatibility

Clients should tolerate:

- unknown optional metadata;
- new event types;
- new optional response fields.

Clients must not assume every possible event type is known.

# 119. Version Negotiation

Where necessary, a client may advertise supported versions.

Example:

    "metadata": {
        "supported_protocol_versions": [
            "1.0",
            "1.1"
        ]
    }

The exact negotiation mechanism will be finalized during Phase 0.

# 120. Protocol Downgrade

Automatic downgrade should not occur silently.

If a downgrade affects:

- security;
- execution;
- artifact compatibility;
- physical robot behavior;

the system must explicitly validate compatibility.

# 121. Message Size Error

Oversized messages should produce a stable protocol error such as:

    PROTOCOL_MESSAGE_TOO_LARGE

HTTP:

    413

Retryable:

    false

User message:

    "The message is larger than the permitted size."

# 122. Message Size Registry

The following code should be added to the error registry:

    PROTOCOL_MESSAGE_TOO_LARGE

Meaning:

    Message exceeds the configured envelope or transport limit.

Phase:

    Phase 0.

# 123. Correlation Validation Error

If a message contains invalid correlation metadata:

    PROTOCOL_CORRELATION_INVALID

HTTP:

    400

Retryable:

    false

Message:

    "The message correlation information is invalid."

Phase:

    Phase 0.

# 124. Timestamp Validation Error

Invalid timestamps should return:

    PROTOCOL_TIMESTAMP_INVALID

HTTP:

    400

Retryable:

    false

Message:

    "The message timestamp is invalid."

Phase:

    Phase 0.

# 125. Request ID Validation Error

Invalid or missing request IDs should return:

    PROTOCOL_REQUEST_ID_INVALID

HTTP:

    400

Retryable:

    false

Message:

    "The request identifier is invalid."

Phase:

    Phase 0.

# 126. Event ID Validation Error

Invalid event IDs should return:

    PROTOCOL_EVENT_ID_INVALID

HTTP:

    400

Retryable:

    false

Message:

    "The event identifier is invalid."

Phase:

    Phase 0.

# 127. Envelope Lifecycle

    CREATE
       |
       v
    SERIALIZE
       |
       v
    TRANSMIT
       |
       v
    RECEIVE
       |
       v
    VALIDATE
       |
       v
    AUTHORIZE
       |
       v
    PROCESS
       |
       v
    CORRELATE
       |
       v
    OBSERVE
       |
       v
    RETAIN / DISCARD

# 128. Request Lifecycle

    Application Action
          |
          v
    Create Request ID
          |
          v
    Create Trace Context
          |
          v
    Add Context
          |
          v
    Add Payload
          |
          v
    Validate
          |
          v
    Send

# 129. Response Lifecycle

    Receive Request
          |
          v
    Process
          |
          v
    Create Response
          |
          v
    Echo Request ID
          |
          v
    Propagate Trace
          |
          v
    Send

# 130. Event Lifecycle

    State Change
          |
          v
    Commit Durable State
          |
          v
    Create Event
          |
          v
    Assign Event ID
          |
          v
    Assign Sequence
          |
          v
    Publish
          |
          v
    Deliver
          |
          v
    Replay if needed

# 131. Complete Job Trace

    Studio
       |
       | request_id=R1
       | operation_id=O1
       | trace_id=T1
       v
    Control Plane
       |
       | response: ACCEPTED
       v
    Worker
       |
       | trace_id=T1
       v
    Lab Agent
       |
       | trace_id=T1
       v
    Runtime
       |
       v
    job.running
       |
       | event_id=E1
       | operation_id=O1
       | trace_id=T1
       v
    Studio

# 132. Artifact Flow

    Local Build
       |
       v
    .krv Artifact
       |
       v
    artifact.create
       |
       v
    artifact.upload
       |
       v
    artifact.validating
       |
       v
    artifact.accepted
       |
       v
    Booking
       |
       v
    Job

The envelope never contains the source tree.

# 133. Booking Flow

    availability.query
       |
       v
    booking.quote
       |
       v
    booking.create
       |
       v
    booking.confirmed
       |
       v
    credit.consumed
       |
       v
    job.create

Each message carries correlation information to connect the user workflow.

# 134. Lab Flow

    agent.register
       |
       v
    agent.online
       |
       v
    agent.capabilities
       |
       v
    resource.available
       |
       v
    job.deploying
       |
       v
    job.running
       |
       v
    telemetry

# 135. Failure Flow

    Request
       |
       v
    Envelope Validation
       |
       +--> PROTOCOL_MESSAGE_INVALID
       |
       v
    Authorization
       |
       +--> AUTHZ_DENIED
       |
       v
    Domain
       |
       +--> BOOKING_CONFLICT
       |
       +--> INSUFFICIENT_CREDITS
       |
       +--> ARTIFACT_INCOMPATIBLE
       |
       v
    Infrastructure
       |
       +--> SERVICE_UNAVAILABLE
       +--> UPSTREAM_TIMEOUT

# 136. Phase Mapping

| Phase | Envelope Work |
|---|---|
| Phase 0 | Common envelopes, schema, IDs, timestamps |
| Phase 1 | Studio IPC and authentication context |
| Phase 2 | Artifact metadata and transfer correlation |
| Phase 3 | Control Plane context and tracing |
| Phase 4 | Idempotency, commercial metadata |
| Phase 5 | Job/Lab correlation and async operations |
| Phase 6 | Physical resource and observed timestamps |
| Phase 7 | Run/telemetry/result envelopes |
| Phase 8 | Production tracing, limits, governance |

# 137. Phase 0 — Foundation

Implement:

- request envelope;
- response envelope;
- event envelope;
- common identifiers;
- timestamp model;
- protocol version;
- JSON schemas;
- size limits;
- validation;
- correlation.

Acceptance:

- all envelopes validate;
- invalid envelopes are rejected;
- IDs are unique;
- timestamps are UTC;
- size limits are enforced.

# 138. Phase 1 — Studio

Implement:

- Tauri IPC envelopes;
- build requests;
- build responses;
- local events;
- client version metadata;
- local correlation.

Acceptance:

- React/Rust communication uses consistent envelopes;
- local errors use common semantics;
- build operations can be correlated.

# 139. Phase 2 — Artifact

Implement:

- artifact request/response envelopes;
- artifact lifecycle events;
- digest metadata;
- compatibility metadata;
- upload correlation.

Acceptance:

- upload and validation are traceable;
- large binaries are not embedded;
- artifact operations preserve correlation.

# 140. Phase 3 — Control Plane

Implement:

- tenant context;
- user context;
- organization context;
- distributed tracing;
- REST response envelopes;
- API schema validation.

Acceptance:

- tenant context is verified;
- request/response correlation works;
- traces cross service boundaries.

# 141. Phase 4 — Booking and Commercial

Implement:

- idempotency keys;
- booking correlation;
- credit transaction correlation;
- payment correlation;
- retry metadata.

Acceptance:

- duplicate financial operations are prevented;
- booking operations can be reconciled;
- request and operation IDs are retained.

# 142. Phase 5 — Execution

Implement:

- job envelopes;
- operation IDs;
- Lab Agent correlation;
- resource references;
- asynchronous responses;
- execution events.

Acceptance:

- a job can be traced end-to-end;
- response loss can be reconciled;
- job events retain operation identity.

# 143. Phase 6 — Physical Robot

Implement:

- agent identity;
- observed timestamps;
- resource context;
- runtime fault context;
- safety-related metadata.

Acceptance:

- cloud timestamps are distinguished from physical observation time;
- safety state is not inferred from transport availability;
- agent identity is authenticated.

# 144. Phase 7 — Live and Results

Implement:

- run envelopes;
- telemetry envelopes;
- result envelopes;
- bounded telemetry messages;
- log/result references.

Acceptance:

- high-frequency payloads are bounded;
- large results use references;
- telemetry timestamps are explicit.

# 145. Phase 8 — Production

Implement:

- distributed tracing;
- production size limits;
- observability;
- schema compatibility;
- replay correlation;
- operational governance.

Acceptance:

- all messages are traceable;
- size violations are detected;
- schema compatibility is tested;
- production diagnostics can correlate failures.

# 146. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Missing correlation | High | Mandatory request/event IDs |
| Trace fragmentation | High | Trace propagation |
| ID collision | Critical | Strong unique ID generation |
| Clock skew | Medium | UTC + sequence/state authority |
| Oversized payload | High | Strict limits |
| Binary in JSON | High | Dedicated transfer |
| Tenant spoofing | Critical | Server-derived authorization |
| Schema drift | High | Shared contracts + CI |
| Duplicate request | Critical | Idempotency |
| Duplicate event | High | Event ID deduplication |
| Event reordering | High | Sequence + replay |
| Sensitive metadata leak | Critical | Metadata allowlist |
| Transport confusion | High | Separate transport/envelope/domain |
| Trace data exposure | Medium | No secrets in trace context |
| Replay ambiguity | High | Preserve original event ID |
| Version incompatibility | High | Explicit versioning |

# 147. Risk — Envelope as Security Context

A malicious client may attempt:

    organization_id = another-org

The server must never trust this value for authorization.

Mitigation:

    authenticated identity
          |
          v
    authorization lookup
          |
          v
    permitted organization
          |
          v
    validate envelope context

# 148. Risk — Large Messages

A malicious client may send extremely large JSON.

Mitigation:

- gateway limits;
- decompressed limits;
- parser limits;
- schema limits;
- request timeout;
- bounded memory.

# 149. Risk — Correlation Abuse

Clients may send arbitrary trace or operation IDs.

Mitigation:

- validate format;
- avoid using client correlation as authorization;
- generate server-side identifiers where required;
- sanitize logs.

# 150. Risk — Request Replay

An attacker may replay a captured request.

Mitigation:

- authentication;
- authorization;
- idempotency;
- expiration where required;
- nonce/session controls;
- TLS.

# 151. Risk — Sensitive Metadata

Metadata can accidentally become a data-exfiltration channel.

Mitigation:

- documented metadata schema;
- allowlist;
- payload size limits;
- secret scanning;
- logging redaction.

# 152. Risk — Trace Cardinality

Uncontrolled identifiers can create excessive observability cardinality.

Mitigation:

- bounded labels;
- do not use arbitrary payload fields as metric dimensions;
- sample traces where appropriate.

# 153. Risk — Envelope/Database Coupling

Exposing database fields directly in envelopes creates long-term coupling.

Mitigation:

> Envelopes expose protocol contracts, not database schemas.

# 154. Open Questions

1. What exact JSON Schema draft will be standardized?
2. Will schemas be authored directly in JSON Schema or generated from typed
   definitions?
3. What exact ID format will be adopted?
4. UUIDv7, ULID, or another identifier format?
5. Will request IDs be UUID-like or prefixed opaque IDs?
6. What exact WebSocket framing format will be standardized?
7. Will all API responses contain an explicit envelope or will HTTP resources
   use a hybrid representation?
8. What exact trace propagation library will be used?
9. Will W3C Trace Context be mandatory?
10. What exact maximum message sizes will be production-enforced?
11. Will event payloads have independent schema versions?
12. What metadata extensions mechanism will be finalized?
13. Will `actor` be included on all server-generated events?
14. Which context fields are mandatory for each domain?
15. What exact timestamp precision will be standardized?
16. What is the canonical server clock source?
17. How will Lab Agent clock drift be monitored?
18. Will event sequences be numeric or cursor-based?
19. How will WebSocket replay cursors be represented?
20. Which fields may be client-generated versus server-generated?
21. Which headers must be standardized across all transports?
22. How will trace IDs be exposed to end users?
23. What exact envelope compatibility tests will run in CI?
24. What compression policy will be used?
25. What exact telemetry transport will be used for high-frequency data?
26. Which message categories require durable retention?
27. What exact schema registry governance process will be adopted?
28. How will protocol versions be retired?
29. What support tooling will resolve request IDs and trace IDs?
30. What exact production SLO applies to envelope processing latency?

# 155. Implementation Checklist — Envelope Core

- [ ] Request envelope implemented.
- [ ] Response envelope implemented.
- [ ] Event envelope implemented.
- [ ] Common protocol version defined.
- [ ] Request ID defined.
- [ ] Event ID defined.
- [ ] Resource reference defined.
- [ ] Timestamp semantics defined.
- [ ] Correlation structure defined.
- [ ] Operation ID defined.
- [ ] Trace ID defined.
- [ ] Span ID defined.
- [ ] Parent span ID defined.
- [ ] Metadata rules defined.
- [ ] Actor model defined.
- [ ] Context model defined.

# 156. Implementation Checklist — Validation

- [ ] JSON UTF-8 validation implemented.
- [ ] Envelope schemas implemented.
- [ ] Required fields validated.
- [ ] Field types validated.
- [ ] Timestamp format validated.
- [ ] Identifier format validated.
- [ ] Message size limits enforced.
- [ ] Compression limits enforced.
- [ ] Unknown-field behavior tested.
- [ ] Invalid envelope behavior tested.
- [ ] Unsupported version behavior tested.
- [ ] Correlation validation tested.

# 157. Implementation Checklist — HTTP

- [ ] REST request envelopes are defined.
- [ ] REST responses are defined.
- [ ] HTTP status mapping is documented.
- [ ] Request IDs are returned.
- [ ] Trace context is propagated.
- [ ] Idempotency keys are supported.
- [ ] Rate-limit metadata is supported.
- [ ] Retry metadata is supported.
- [ ] Large payloads use dedicated transfers.
- [ ] Error responses follow `ERROR_CODES.md`.

# 158. Implementation Checklist — WebSocket

- [ ] WebSocket authentication is defined.
- [ ] Event envelope is implemented.
- [ ] Subscription control messages are defined.
- [ ] Request IDs are supported.
- [ ] Event IDs are supported.
- [ ] Sequence numbers are supported where required.
- [ ] Replay cursor is defined.
- [ ] Duplicate delivery is handled.
- [ ] Reconnect correlation is supported.
- [ ] Authorization filtering is enforced.

# 159. Implementation Checklist — Lab

- [ ] Lab Agent identity is authenticated.
- [ ] Lab messages use common envelope semantics.
- [ ] Trace context crosses Lab boundary.
- [ ] Operation IDs cross Lab boundary.
- [ ] Resource references are stable.
- [ ] Observed timestamps are supported.
- [ ] Vendor fault information is isolated from core codes.
- [ ] Message limits are enforced.
- [ ] Reconciliation is supported.
- [ ] Safety state is not inferred from envelope delivery.

# 160. Implementation Checklist — Studio

- [ ] Tauri IPC request envelope implemented.
- [ ] Tauri IPC response envelope implemented.
- [ ] Local event model implemented.
- [ ] Build correlation implemented.
- [ ] Test correlation implemented.
- [ ] Artifact packaging correlation implemented.
- [ ] Local error codes integrated.
- [ ] Client version metadata implemented.
- [ ] Local payload limits enforced.

# 161. Implementation Checklist — Distributed Tracing

- [ ] Trace ID generated or propagated.
- [ ] Span ID generated per processing span.
- [ ] Parent span propagated.
- [ ] Operation ID retained for async work.
- [ ] Queue propagation implemented.
- [ ] Lab propagation implemented.
- [ ] WebSocket correlation implemented.
- [ ] Logs contain trace correlation.
- [ ] Secrets are excluded.
- [ ] Trace cardinality is controlled.

# 162. Implementation Checklist — Reliability

- [ ] Idempotency keys implemented for required commands.
- [ ] Lost responses are recoverable.
- [ ] Duplicate events are safe.
- [ ] Out-of-order events are safe.
- [ ] Replay preserves event IDs.
- [ ] Durable state remains authoritative.
- [ ] Reconciliation paths exist.
- [ ] Timeout semantics are documented.
- [ ] Retry metadata is respected.

# 163. Implementation Checklist — Security

- [ ] Envelope context cannot override authorization.
- [ ] Tenant isolation is enforced.
- [ ] Sensitive fields are excluded.
- [ ] Secrets are not included in metadata.
- [ ] Trace context is sanitized.
- [ ] Oversized messages are rejected.
- [ ] Malformed JSON is rejected.
- [ ] Compression bombs are protected against.
- [ ] Replay abuse is controlled.
- [ ] Resource enumeration is considered.

# 164. Implementation Checklist — Compatibility

- [ ] Protocol version policy implemented.
- [ ] Schema version policy implemented.
- [ ] Backward compatibility tests implemented.
- [ ] Forward compatibility behavior documented.
- [ ] Deprecated fields documented.
- [ ] Deprecated versions documented.
- [ ] New required fields are prevented without versioning.
- [ ] Contract changes require review.
- [ ] Generated types remain synchronized.

# 165. Implementation Checklist — Observability

- [ ] Request IDs are logged.
- [ ] Event IDs are logged.
- [ ] Operation IDs are logged.
- [ ] Trace IDs are logged.
- [ ] Error codes are logged.
- [ ] Envelope processing latency is measured.
- [ ] Oversized messages are counted.
- [ ] Validation failures are counted.
- [ ] Protocol-version failures are monitored.
- [ ] Correlation failures are monitored.

# 166. Full Acceptance Criteria

## Envelope Structure

- [ ] Request envelope has a defined canonical schema.
- [ ] Response envelope has a defined canonical schema.
- [ ] Event envelope has a defined canonical schema.
- [ ] Common metadata semantics are documented.
- [ ] Request, response, and event differences are explicit.
- [ ] Every mandatory field is documented.
- [ ] Optional fields have defined semantics.
- [ ] Nullability is explicitly defined.
- [ ] Empty collections have defined semantics.
- [ ] JSON naming conventions are consistent.

## Identity

- [ ] Request IDs are unique.
- [ ] Event IDs are unique.
- [ ] Resource IDs are stable.
- [ ] Operation IDs identify async operations.
- [ ] Idempotency keys protect side effects.
- [ ] Identifier semantics are not conflated.
- [ ] Identifier generation is documented.

## Correlation

- [ ] Request ID is echoed by responses.
- [ ] Operation ID propagates across async processing.
- [ ] Trace ID propagates across distributed boundaries.
- [ ] Span IDs identify processing spans.
- [ ] Parent spans are supported.
- [ ] Correlation works through queues.
- [ ] Correlation works through Lab Agent.
- [ ] Correlation works through WebSocket.
- [ ] Correlation works through Tauri IPC.
- [ ] Correlation metadata does not provide authorization.

## Time

- [ ] Envelope timestamps use UTC.
- [ ] RFC 3339/ISO 8601 representation is standardized.
- [ ] Timestamp precision is defined.
- [ ] `timestamp` semantics are documented.
- [ ] `observed_at` semantics are documented.
- [ ] Clock skew is handled safely.
- [ ] Correctness does not depend solely on timestamps.

## Size

- [ ] Request size limit is enforced.
- [ ] Response size limit is enforced.
- [ ] Event size limit is enforced.
- [ ] Error size limit is enforced.
- [ ] Telemetry size limit is enforced.
- [ ] Decompressed payload size is limited.
- [ ] Large artifacts are not embedded.
- [ ] Large result files are not embedded.
- [ ] Video is not embedded.
- [ ] High-frequency telemetry uses bounded transport.

## Validation

- [ ] UTF-8 is enforced.
- [ ] JSON parsing is bounded.
- [ ] Envelope schema validation is enforced.
- [ ] Payload validation is enforced.
- [ ] Unsupported protocol versions are rejected.
- [ ] Invalid timestamps are rejected.
- [ ] Invalid IDs are rejected.
- [ ] Invalid correlation is rejected.
- [ ] Oversized messages are rejected.
- [ ] Malformed messages do not reach domain services.

## HTTP

- [ ] HTTP transport semantics are documented.
- [ ] Application status semantics are documented.
- [ ] HTTP and application statuses are distinct.
- [ ] Request IDs are propagated.
- [ ] Trace context is propagated.
- [ ] Idempotency headers are supported.
- [ ] Error codes map to stable HTTP statuses.
- [ ] Large transfers use dedicated mechanisms.
- [ ] Error responses conform to the common envelope.

## WebSocket

- [ ] WebSocket messages use defined envelopes.
- [ ] Subscription messages are defined.
- [ ] Event messages are defined.
- [ ] Event IDs are preserved.
- [ ] Sequence handling is implemented.
- [ ] Replay preserves event identity.
- [ ] Duplicate events are tolerated.
- [ ] Reconnect is supported.
- [ ] State reconciliation is supported.
- [ ] Authorization applies to every subscription.

## Lab

- [ ] Lab Agent messages use common semantics.
- [ ] Agent identity is authenticated.
- [ ] Agent trace context is propagated.
- [ ] Resource identity is stable.
- [ ] Observed timestamps are supported.
- [ ] Vendor diagnostics are isolated.
- [ ] Agent failures map to stable codes.
- [ ] Lab disconnect is distinguishable from robot safety state.
- [ ] Safety state is fail-safe.
- [ ] Reconciliation exists for uncertain physical state.

## Studio

- [ ] Tauri IPC uses common request/response semantics.
- [ ] Local events are correlated.
- [ ] Build messages are traceable.
- [ ] Test messages are traceable.
- [ ] Artifact packaging is traceable.
- [ ] Local error codes use the common registry.
- [ ] Local message sizes are bounded.
- [ ] Source code is not transmitted as an execution artifact.

## Security

- [ ] Tenant context is authorization-checked.
- [ ] Actor metadata is not trusted as authentication.
- [ ] Secrets are excluded.
- [ ] Tokens are excluded from envelopes.
- [ ] Trace metadata is sanitized.
- [ ] Resource enumeration is controlled.
- [ ] Replay is authorized.
- [ ] Idempotency abuse is controlled.
- [ ] Oversized payload attacks are mitigated.
- [ ] Compression abuse is mitigated.

## Reliability

- [ ] Lost responses are reconciled.
- [ ] Duplicate requests are controlled.
- [ ] Duplicate events are safe.
- [ ] Out-of-order events are handled.
- [ ] Event gaps can be detected.
- [ ] Replay is supported where required.
- [ ] Durable state remains authoritative.
- [ ] Retry behavior is documented.
- [ ] Reconciliation behavior is documented.
- [ ] Safety operations are never blindly retried.

## Compatibility

- [ ] Protocol version is explicit.
- [ ] Major/minor compatibility policy is documented.
- [ ] Schema compatibility is tested.
- [ ] Breaking changes require versioning.
- [ ] Unknown optional fields are handled according to policy.
- [ ] New event types do not break existing clients.
- [ ] Deprecated versions have migration plans.
- [ ] Contract schemas are version controlled.

## Production

- [ ] Envelopes are observable.
- [ ] Request IDs are searchable.
- [ ] Event IDs are searchable.
- [ ] Operation IDs are searchable.
- [ ] Trace IDs are searchable.
- [ ] Error codes are measurable.
- [ ] Validation failures are measurable.
- [ ] Message-size violations are measurable.
- [ ] Protocol compatibility failures are measurable.
- [ ] Envelope processing latency is monitored.

# 167. Architectural Invariants

The following are mandatory Kritva RaaS protocol invariants:

1. Requests request actions.
2. Responses report request outcomes.
3. Events report occurrences.
4. Envelopes are transport-independent wherever practical.
5. Payloads contain domain semantics.
6. HTTP status does not replace domain error codes.
7. Human-readable messages are not machine contracts.
8. Request IDs uniquely identify requests.
9. Event IDs uniquely identify events.
10. Operation IDs identify logical asynchronous operations.
11. Trace IDs identify distributed traces.
12. Idempotency keys protect side-effecting operations.
13. Durable state remains authoritative.
14. Timestamps use UTC.
15. Physical observation time is distinct from message creation time.
16. Message sizes are bounded.
17. Large binaries are transferred outside JSON envelopes.
18. Tenant context is never trusted without authorization.
19. Trace context does not provide authentication.
20. Unknown optional metadata must not break compatible clients.
21. Breaking contract changes require versioning.
22. Event replay preserves event identity.
23. Duplicate events must be safe.
24. Transport failure does not imply business failure.
25. Timeout does not imply operation failure.
26. Safety state is not inferred from cloud connectivity.
27. Internal exceptions are translated to stable public contracts.
28. Envelope schemas are centrally governed.
29. Contract changes are tested in CI.
30. Every production message can be correlated to an operational trace.

# 168. Final Production Baseline

The Kritva RaaS envelope architecture establishes a single protocol foundation
across:

    Studio
       |
       | Tauri IPC
       v
    Local Runtime
       |
       | HTTPS / WebSocket
       v
    Control Plane
       |
       | Secure Lab Channel
       v
    Lab Agent
       |
       | Local Runtime Channel
       v
    Robot

Every message follows the same conceptual model:

    +------------------------------+
    | Transport                    |
    +------------------------------+
    | Envelope                     |
    | version                      |
    | identity                     |
    | timestamp                    |
    | context                      |
    | correlation                  |
    | tracing                      |
    | metadata                     |
    +------------------------------+
    | Domain Payload               |
    +------------------------------+

The complete execution trace is therefore:

    User Action
        |
        v
    Request Envelope
        |
        v
    Control Plane
        |
        v
    Response Envelope
        |
        v
    Operation
        |
        v
    Event Envelope
        |
        v
    Lab Agent
        |
        v
    Runtime
        |
        v
    Robot
        |
        v
    Observed State
        |
        v
    Event Envelope
        |
        v
    Studio

The governing principle is:

> **Every Kritva RaaS message must be identifiable, correlatable, versioned, bounded, validated, traceable, and transport-independent wherever practical.**

This envelope foundation enables the complete Kritva RaaS protocol stack to
remain consistent as the platform evolves from software-only development into
multi-lab, multi-platform, production robotic execution.
