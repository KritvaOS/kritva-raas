# Kritva RaaS Protocol Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Protocol Architecture |
| Path | `docs/architecture/PROTOCOL_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| API Style | REST + WebSocket |
| Desktop IPC | Tauri IPC |
| Lab Protocol | Secure bidirectional Lab Protocol |
| Contract Source | `packages/contracts` |
| API Client | `packages/api-client` |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the communication protocols used by Kritva RaaS across
desktop, cloud, and physical-lab boundaries.

The architecture separates communication into explicit protocol layers:

1. Studio Frontend ↔ Studio Local Runtime.
2. Studio ↔ RaaS Control Plane.
3. Control Plane ↔ asynchronous workers and infrastructure.
4. Control Plane ↔ Lab Agent.
5. Lab Agent ↔ Kritva Runtime and local robot services.

The central protocol principle is:

> **Every system boundary has an explicit contract, explicit ownership, explicit versioning, and explicit failure semantics.**

## 3. Scope

This document covers:

- IPC contract;
- REST API;
- WebSocket protocol;
- Lab Protocol;
- command semantics;
- response semantics;
- event semantics;
- common envelopes;
- request IDs;
- correlation;
- idempotency;
- versioning;
- compatibility;
- authentication context;
- authorization context;
- errors;
- pagination;
- retries;
- timeouts;
- asynchronous operations;
- protocol contracts;
- `packages/contracts`;
- `packages/api-client`;
- protocol testing;
- phase mapping;
- protocol risks;
- protocol acceptance criteria.

## 4. Goals

The protocol architecture shall:

1. Define clear communication boundaries.
2. Prevent accidental coupling between layers.
3. Provide machine-readable contracts.
4. Support backward-compatible evolution.
5. Support asynchronous operations.
6. Provide deterministic correlation.
7. Provide idempotent side effects.
8. Provide structured errors.
9. Support realtime events.
10. Allow client state recovery.
11. Protect tenant boundaries.
12. Support secure Lab Agent communication.
13. Avoid exposing database schemas as APIs.
14. Keep protocol definitions centralized.
15. Enable automated contract testing.

## 5. Non-Goals

This document does not define:

- database table schemas;
- UI design;
- cloud-provider-specific APIs;
- robot mechanical interfaces;
- detailed EtherCAT protocol;
- detailed Kritva Runtime internal APIs;
- billing provider-specific APIs.

Those systems may define lower-level contracts that are outside the RaaS protocol
boundary.

## 6. Protocol Layer Model

The protocol stack is:

    Studio UI
       |
       | Tauri IPC
       v
    Studio Local Runtime
       |
       | HTTPS REST
       | WebSocket
       v
    RaaS Control Plane
       |
       | Internal application interfaces
       | Queue messages
       v
    Workers
       |
       | Lab Protocol
       v
    Lab Agent
       |
       | Local Runtime Interface
       v
    Kritva Runtime
       |
       v
    Robot

Each layer has a distinct responsibility.

## 7. Boundary 1 — Studio IPC

Studio consists of:

- React/TypeScript frontend;
- Tauri/Rust local runtime.

The frontend must not directly perform privileged local operations.

The Rust layer owns:

- filesystem operations;
- local process execution;
- local build invocation;
- artifact packaging;
- local credential protection;
- native OS integration.

## 8. IPC Transport

The initial Studio IPC mechanism is Tauri IPC.

Conceptually:

    React Component
         |
         v
    State / Workflow
         |
         v
    Tauri Command
         |
         v
    Rust Local Runtime
         |
         +--> Filesystem
         +--> Compiler
         +--> Build Tools
         +--> Artifact Packager
         +--> OS Services

## 9. IPC Contract

IPC commands should be explicitly defined rather than allowing arbitrary Rust
function invocation.

Examples:

- `project.open`;
- `project.list`;
- `build.configure`;
- `build.start`;
- `build.cancel`;
- `build.status`;
- `artifact.package`;
- `artifact.validate`;
- `system.info`.

## 10. IPC Security

The frontend must not receive unrestricted:

- filesystem access;
- shell execution;
- environment access;
- process control;
- credential access.

Each privileged operation should have a narrowly defined command contract.

## 11. IPC Request

Conceptual IPC request:

    {
        "request_id": "req-123",
        "command": "build.start",
        "payload": {
            "project_id": "project-001"
        }
    }

The exact Tauri transport encoding is implementation-specific.

## 12. IPC Response

Conceptual response:

    {
        "request_id": "req-123",
        "status": "SUCCESS",
        "data": {
            "build_id": "build-001"
        },
        "error": null
    }

## 13. IPC Events

Long-running local operations should emit events.

Example:

    build.start
       |
       v
    build.started
       |
       v
    build.progress
       |
       v
    build.completed

The UI should not poll excessively when event-driven progress is available.

## 14. IPC Ownership

The frontend owns:

- user interaction;
- presentation;
- local UI state.

The Rust runtime owns:

- privileged local operations;
- local build process lifecycle;
- filesystem policy;
- artifact packaging.

Neither should bypass the contract layer.

## 15. Boundary 2 — Studio to Control Plane

Studio communicates with the Control Plane through:

- HTTPS REST;
- WebSocket realtime events.

REST is authoritative for resource state and commands.

WebSocket is optimized for realtime notification.

## 16. REST API

The REST API is versioned:

    /api/v1/

REST provides:

- authentication;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

## 17. REST Resource Principle

REST resources represent business concepts rather than database tables.

Examples:

    /api/v1/projects
    /api/v1/platforms
    /api/v1/artifacts
    /api/v1/bookings
    /api/v1/jobs
    /api/v1/runs
    /api/v1/results

The API must not expose internal database schema merely because a table exists.

## 18. API Operations

The protocol reserves command semantics such as:

- `project.create`;
- `project.list`;
- `project.get`;
- `project.update`;
- `artifact.create`;
- `artifact.upload`;
- `booking.create`;
- `job.create`;
- `job.start`;
- `job.stop`;
- `result.get`.

REST paths and HTTP verbs are mapped to these domain operations.

## 19. REST and Command Semantics

A command means:

> **Please perform this operation.**

Examples:

- create booking;
- upload artifact;
- start job;
- stop job.

A query means:

> **Tell me the current state.**

Examples:

- get project;
- list platforms;
- get job;
- get result.

## 20. Response Semantics

A response means:

> **Here is the result of processing your request.**

Responses contain:

- request ID;
- protocol version;
- status;
- result data;
- error information where applicable.

## 21. Event Semantics

An event means:

> **Something happened in the system.**

Events are not requests.

Examples:

- `artifact.accepted`;
- `booking.confirmed`;
- `job.running`;
- `job.completed`;
- `robot.online`.

## 22. Commands, Responses, Events

The conceptual relationship is:

    COMMAND
       |
       v
    PROCESSING
       |
       v
    RESPONSE

    COMMAND
       |
       v
    ASYNCHRONOUS OPERATION
       |
       +--> EVENT
       +--> EVENT
       +--> EVENT
       |
       v
    FINAL STATE

A response does not replace durable state.

## 23. Common Envelope

All protocol messages should use a consistent logical envelope.

Conceptual command:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:00Z",
        "command": "artifact.upload",
        "actor": {
            "type": "user",
            "id": "user-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "payload": {}
    }

## 24. Common Response Envelope

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "SUCCESS",
        "code": "ARTIFACT_ACCEPTED",
        "message": "Artifact accepted",
        "data": {},
        "error": null
    }

## 25. Event Envelope

Conceptual event:

    {
        "protocol_version": "1.0",
        "event_id": "evt-001",
        "timestamp": "2026-10-08T00:00:02Z",
        "event": "job.running",
        "resource": {
            "type": "job",
            "id": "job-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "data": {}
    }

## 26. Envelope Fields

| Field | Purpose |
|---|---|
| `protocol_version` | Protocol compatibility |
| `request_id` | Request correlation |
| `event_id` | Event identity |
| `timestamp` | Message time |
| `command` | Command name |
| `event` | Event name |
| `actor` | Requesting identity |
| `context` | Tenant/resource context |
| `status` | Response outcome |
| `code` | Stable machine code |
| `data` | Payload |
| `error` | Structured failure |

Not every field is required for every message type.

## 27. Request ID

Every request receives a unique request ID.

It is used for:

- tracing;
- logging;
- debugging;
- correlation;
- support.

A request ID must not be treated as an authorization credential.

## 28. Event ID

Every event has a unique event ID.

The event ID supports:

- deduplication;
- tracing;
- replay handling;
- diagnostics.

## 29. Correlation

A command and subsequent asynchronous events should be correlatable.

Example:

    request_id = req-100

    job.created
        request_id = req-100
        job_id = job-001

    job.running
        job_id = job-001

    job.completed
        job_id = job-001

## 30. Resource Identity

Resources use stable identifiers.

Examples:

    user_id
    organization_id
    project_id
    platform_id
    artifact_id
    booking_id
    job_id
    run_id
    result_id
    lab_id
    agent_id
    resource_id

Identifiers should not expose database implementation details.

## 31. Protocol Status

Application status is distinct from HTTP transport status.

Application statuses include:

- SUCCESS;
- ACCEPTED;
- REJECTED;
- PENDING;
- IN_PROGRESS;
- COMPLETED;
- FAILED;
- CANCELLED;
- TIMEOUT;
- UNAUTHORIZED;
- FORBIDDEN;
- NOT_FOUND;
- CONFLICT;
- INVALID_REQUEST;
- UNAVAILABLE.

## 32. HTTP Status Mapping

Typical mapping:

| HTTP | Meaning |
|---|---|
| 200 | Successful query/action |
| 201 | Resource created |
| 202 | Accepted asynchronous operation |
| 204 | Successful operation without body |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Authorization failure |
| 404 | Resource not found |
| 409 | State/resource conflict |
| 422 | Semantically invalid request |
| 429 | Rate limited |
| 500 | Internal failure |
| 503 | Temporarily unavailable |

Exact mappings may evolve while maintaining API consistency.

## 33. Error Envelope

Conceptual error:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "ERROR",
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is not compatible with selected platform",
        "data": null,
        "error": {
            "details": {
                "required_runtime": "2.x",
                "available_runtime": "1.x"
            }
        }
    }

## 34. Stable Error Codes

Error codes are part of the API contract.

They should be:

- stable;
- documented;
- machine-readable;
- non-sensitive.

Human-readable messages may change.

## 35. Authentication

Studio authenticates to the Control Plane using the configured authentication
system.

The protocol must distinguish:

- authentication;
- authorization;
- tenant context.

Successful authentication does not grant unrestricted resource access.

## 36. Authorization Context

The Control Plane derives authorization from:

- authenticated user;
- organization membership;
- role;
- project ownership;
- resource policy.

The client-provided organization ID is contextual data, not proof of authorization.

## 37. Organization Context

Tenant-scoped requests should carry or derive:

    organization_id

The backend validates that the authenticated principal has access.

## 38. Project Context

Where applicable:

    project_id

is used to establish resource ownership and authorization.

## 39. Authentication Commands

Reserved operations include:

- `auth.login`;
- `auth.logout`;
- `auth.refresh`;
- `auth.me`.

Future operations may include:

- MFA;
- device registration;
- session revocation.

## 40. REST Pagination

List APIs should use a consistent pagination model.

Preferred model:

    cursor
    limit

Conceptual response:

    {
        "items": [],
        "next_cursor": "abc...",
        "has_more": true
    }

The exact pagination scheme should be consistent across resource collections.

## 41. Pagination Stability

Pagination must remain stable under concurrent updates where practical.

Cursor tokens should encode enough state to prevent accidental page duplication or
skipping.

Clients must not depend on database offsets.

## 42. Filtering and Sorting

Collection APIs may support:

- filtering;
- sorting;
- search;
- status filters;
- time ranges.

Supported fields must be explicitly defined by contract.

## 43. Idempotency

Commands with external side effects must support idempotency.

Examples:

- booking creation;
- job creation;
- payment operations;
- credit operations;
- artifact completion;
- resource allocation.

## 44. Idempotency Key

The client supplies an idempotency key.

Conceptually:

    Idempotency-Key: <unique-key>

The server records the request and resulting response.

A repeated request with the same key should return the original result where
the request is semantically identical.

## 45. Idempotency Scope

Idempotency keys should be scoped appropriately, for example by:

- organization;
- authenticated principal;
- operation;
- endpoint.

Keys should not be globally reusable across unrelated operations.

## 46. Idempotency Conflict

If a key is reused with a different request payload, the server should reject it
with a stable conflict error.

Example:

    IDEMPOTENCY_KEY_REUSE_MISMATCH

## 47. Retry Semantics

Clients may retry:

- network timeouts;
- transient 5xx errors;
- 429 responses according to server guidance;
- temporary unavailable states.

Side-effecting requests must be retried using idempotency keys.

## 48. Timeout Semantics

Every network operation has a bounded timeout.

Long-running work must not be represented as a single indefinitely open HTTP request.

Instead:

    command
       |
       v
    202 Accepted
       |
       v
    operation/job state
       |
       v
    events + queries

## 49. Asynchronous Operations

Examples:

- artifact validation;
- artifact upload processing;
- job start;
- deployment;
- result processing.

The response may be:

    202 Accepted

with a durable resource identifier.

## 50. Async State Recovery

WebSocket connectivity is not authoritative.

If a client disconnects:

    WebSocket Lost
         |
         v
    REST Query
         |
         v
    Current Durable State
         |
         v
    Resume Events

This prevents state loss due to transient network failure.

## 51. WebSocket Purpose

WebSocket provides:

- realtime job state;
- run telemetry notifications;
- log events;
- booking updates;
- robot state;
- execution events.

It does not replace REST resource retrieval.

## 52. WebSocket Authentication

The WebSocket connection must authenticate the client.

Authorization applies to every subscribed resource.

A valid connection does not imply access to every event.

## 53. WebSocket Subscription

Conceptual subscription:

    {
        "command": "subscribe",
        "request_id": "req-900",
        "payload": {
            "resource_type": "job",
            "resource_id": "job-001"
        }
    }

The server validates authorization before accepting the subscription.

## 54. WebSocket Events

Example:

    {
        "event": "job.running",
        "event_id": "evt-101",
        "timestamp": "2026-10-08T00:00:10Z",
        "resource": {
            "type": "job",
            "id": "job-001"
        },
        "data": {
            "progress": 50
        }
    }

## 55. Event Ordering

Events should include enough information to detect ordering issues.

Where strict ordering is required, events should contain:

- sequence number;
- event ID;
- resource ID.

Clients should not assume global ordering across unrelated resources.

## 56. Event Delivery

WebSocket events are best treated as at-least-once notifications.

Consumers must tolerate:

- duplicates;
- reconnects;
- missing intermediate events.

The authoritative resource state remains available through REST.

## 57. Event Deduplication

Clients may deduplicate using:

    event_id

or a resource-specific sequence.

Duplicate events must not cause duplicate financial or execution side effects.

## 58. Event Replay

A future protocol version may support:

- `last_event_id`;
- resource sequence;
- replay window.

Until then, reconnecting clients should query current resource state.

## 59. Control Plane Internal Protocol

The Control Plane communicates with workers through internal interfaces and queue
messages.

These are not public REST APIs.

Internal messages may include:

- artifact validation;
- scheduling;
- job dispatch;
- result processing;
- cleanup;
- reconciliation.

## 60. Internal Queue Message

Conceptual message:

    {
        "protocol_version": "1.0",
        "message_id": "msg-001",
        "type": "artifact.validate",
        "created_at": "2026-10-08T00:00:00Z",
        "payload": {
            "artifact_id": "artifact-001"
        }
    }

Internal queue schemas should still be versioned and tested.

## 61. Queue Semantics

Queue messages are delivery mechanisms.

They are not authoritative business state.

PostgreSQL remains authoritative for:

- artifact state;
- job state;
- booking;
- credit state;
- run state.

## 62. Worker Idempotency

Workers must safely handle duplicate messages.

Example:

    artifact.validate
        |
        +--> already ACCEPTED
        |
        v
    No destructive duplicate operation

## 63. Boundary 3 — Control Plane to Lab

The Control Plane communicates with Lab Agents through a secure Lab Protocol.

The Lab Protocol is designed for:

- job dispatch;
- artifact delivery;
- deployment;
- resource state;
- heartbeat;
- telemetry;
- logs;
- results.

## 64. Lab Protocol Transport

The exact transport may be:

- mutually authenticated TLS;
- secure WebSocket;
- gRPC over mTLS;
- another secure bidirectional transport.

The logical protocol is independent of the transport.

## 65. Lab Protocol Topology

    Cloud Control Plane
           |
           | Secure outbound/controlled connection
           v
       Lab Gateway
           |
           v
       Lab Agent
           |
           +--> Resource Manager
           +--> Artifact Manager
           +--> Deployment Manager
           +--> Runtime Manager
           |
           v
      Kritva Runtime
           |
           v
         Robot

## 66. Lab Agent Identity

Every Lab Agent has a unique identity.

Identity is used for:

- authentication;
- authorization;
- registration;
- auditing;
- revocation.

## 67. Agent Registration

Conceptual command:

    agent.register

Registration includes:

- agent identity;
- lab identity;
- software version;
- protocol version;
- capabilities;
- supported platforms;
- resources.

## 68. Agent Heartbeat

The Lab Agent periodically reports:

- agent status;
- version;
- health;
- connectivity;
- resource summary.

Heartbeat failure causes the Control Plane to mark the agent appropriately.

## 69. Agent Capability Discovery

Capabilities may include:

- supported robot platforms;
- runtime versions;
- architectures;
- available resources;
- camera support;
- telemetry;
- video;
- execution features.

## 70. Lab Commands

Reserved commands include:

- `agent.configure`;
- `artifact.fetch`;
- `deployment.prepare`;
- `deployment.start`;
- `deployment.stop`;
- `job.start`;
- `job.stop`;
- `job.cancel`;
- `resource.lock`;
- `resource.release`.

## 71. Lab Events

Lab events include:

- `agent.online`;
- `agent.offline`;
- `resource.available`;
- `resource.busy`;
- `resource.error`;
- `deployment.started`;
- `deployment.completed`;
- `job.running`;
- `job.completed`;
- `telemetry.updated`;
- `result.available`.

## 72. Lab Command Authorization

Every execution command must be bound to:

- authenticated agent;
- authorized lab;
- resource;
- job;
- artifact;
- booking/execution authorization.

A Lab Agent must not accept arbitrary commands from an authenticated but
unauthorized Control Plane identity.

## 73. Job Dispatch

Conceptual flow:

    Job Created
       |
       v
    Validate Artifact
       |
       v
    Allocate Resource
       |
       v
    Dispatch to Lab Agent
       |
       v
    deployment.prepare
       |
       v
    deployment.start
       |
       v
    job.start
       |
       v
    job.running

## 74. Artifact Fetch Protocol

The Lab Agent requests the exact artifact:

    artifact.fetch
        artifact_id
        artifact_digest
        job_id

The server validates authorization before allowing access.

## 75. Deployment Protocol

Deployment sequence:

    deployment.prepare
       |
       v
    Verify Artifact
       |
       v
    Verify Platform
       |
       v
    Verify Runtime
       |
       v
    Prepare Workspace
       |
       v
    deployment.start

## 76. Job Stop

`job.stop` means application/job termination.

It is not equivalent to physical emergency stop.

The protocol must preserve the distinction between:

- software stop;
- job cancellation;
- robot safety state;
- physical E-stop.

## 77. Physical Safety Boundary

The Lab Protocol must never be treated as the sole physical safety mechanism.

Safety-critical robot controls remain local to the robot/lab environment.

Cloud connectivity loss must not disable required local safety mechanisms.

## 78. Telemetry

Telemetry may include:

- CPU;
- memory;
- temperature;
- battery;
- joint state;
- sensor state;
- application metrics.

High-frequency telemetry should use an appropriate streaming strategy rather than
forcing all samples through ordinary REST requests.

## 79. Logs

Logs are delivered as events or streams where practical.

Log records should include:

- timestamp;
- severity;
- source;
- run ID;
- job ID;
- sequence;
- message.

Sensitive data should be filtered.

## 80. Video

Video is a specialized media path.

The control protocol may establish:

- session;
- authorization;
- stream identity;
- lifecycle.

High-bandwidth video should not be embedded directly into ordinary REST payloads.

## 81. Results

Result metadata is reported through the Lab Protocol.

Large result files should use object storage.

Flow:

    Lab Agent
       |
       +--> Result Metadata
       |
       +--> Object Storage Upload
       |
       v
    Control Plane
       |
       v
    Result Record

## 82. Offline Lab Behavior

When cloud connectivity is lost:

- heartbeat stops;
- resource state becomes stale;
- new cloud-authorized jobs are blocked by default;
- local safety continues;
- active execution follows local policy;
- logs/results may buffer locally.

## 83. Lab Reconnection

After reconnect:

    Authenticate
       |
       v
    Register
       |
       v
    Report State
       |
       v
    Reconcile Jobs
       |
       v
    Reconcile Resources
       |
       v
    Reconcile Results
       |
       v
    Resume Normal Operation

## 84. Protocol Versioning

Protocol versions are explicit.

Examples:

    REST: /api/v1/
    Envelope: protocol_version = "1.0"
    Artifact: artifact_format_version = "1"
    Lab Protocol: protocol_version = "1.0"

Each protocol evolves independently where practical.

## 85. Version Compatibility

Compatibility is checked across:

    Studio
       |
       v
    API
       |
       v
    Control Plane
       |
       v
    Lab Protocol
       |
       v
    Lab Agent
       |
       v
    Runtime
       |
       v
    Artifact

## 86. Breaking Changes

Breaking changes require:

- new major version;
- migration plan;
- compatibility period where required;
- updated contracts;
- updated clients;
- tests;
- release documentation.

## 87. Compatible Changes

Non-breaking additions may include:

- optional fields;
- new event types;
- new resources;
- additional enum values when clients are designed to tolerate them.

Clients should not crash on unknown optional fields.

## 88. Enum Evolution

Enum consumers should handle unknown values safely.

For example, a new job state should not cause older clients to terminate unexpectedly.

Unknown states should be represented as:

    UNKNOWN

or equivalent safe behavior.

## 89. Contract Package

The monorepo contains:

    packages/contracts/

This package is the central source for shared protocol contracts.

It should contain:

- request schemas;
- response schemas;
- event schemas;
- enums;
- resource models;
- error codes;
- protocol versions;
- compatibility definitions.

## 90. Contracts Ownership

`packages/contracts` owns the shape of communication.

It does not own:

- UI behavior;
- database implementation;
- business-service implementation;
- cloud provider implementation.

## 91. API Client Package

The monorepo contains:

    packages/api-client/

It provides:

- typed API client;
- request construction;
- response decoding;
- authentication integration;
- error mapping;
- WebSocket client helpers.

## 92. Contract Dependency Flow

    packages/contracts
          |
          +--> api-client
          |
          +--> Studio
          |
          +--> Backend
          |
          +--> Lab Protocol implementation
          |
          +--> Tests

The contract package should remain implementation-neutral.

## 93. Contract Source of Truth

There must be one authoritative definition for each public message shape.

Generated code should derive from the contract rather than creating competing
definitions manually.

## 94. Contract Technology

The exact contract technology may be:

- OpenAPI;
- JSON Schema;
- TypeScript schema definitions;
- generated types;
- protocol schema language.

A hybrid model may be used if one source of truth remains clear.

## 95. OpenAPI

REST API definitions should be represented through OpenAPI.

OpenAPI should define:

- paths;
- operations;
- parameters;
- request bodies;
- responses;
- authentication;
- errors;
- pagination.

## 96. Event Schemas

WebSocket and Lab Protocol events should have explicit schemas.

Each event should define:

- name;
- version;
- envelope;
- payload;
- required fields;
- optional fields;
- authorization scope.

## 97. Schema Validation

CI should validate contracts automatically.

Checks include:

- schema syntax;
- compatibility;
- generated types;
- API implementation alignment;
- event payload validation.

## 98. Contract Testing

Contract tests should verify:

    Producer
       |
       v
    Contract
       ^
       |
    Consumer

Examples:

- Studio ↔ Control Plane;
- Control Plane ↔ Lab Agent;
- worker ↔ queue;
- event producer ↔ event consumer.

## 99. Consumer-Driven Compatibility

Where practical, consumer expectations should be tested against provider contracts.

This reduces accidental breaking changes.

## 100. API Client Generation

Generated API clients may be produced from the canonical API specification.

The generated client should be versioned with the contract.

## 101. Manual API Calls

Developers may use tools such as command-line HTTP clients for debugging, but
production integrations should use the typed contract/client.

## 102. Protocol Testing Layers

Testing should include:

1. Schema validation.
2. Serialization tests.
3. Contract tests.
4. Authentication tests.
5. Authorization tests.
6. Idempotency tests.
7. Retry tests.
8. Compatibility tests.
9. Integration tests.
10. End-to-end tests.

## 103. Serialization

Protocol serialization must be deterministic enough for:

- logging;
- debugging;
- testing;
- compatibility.

The transport encoding may be JSON initially.

Binary protocols may be introduced later where justified.

## 104. Timestamp Semantics

Protocol timestamps should use UTC.

Conceptual format:

    2026-10-08T00:00:00Z

Clients must not interpret server timestamps as local time.

## 105. Clock Skew

Protocol validation should tolerate reasonable clock skew.

Server-side timestamps remain authoritative for business ordering.

## 106. Request Timeout

Clients should use bounded timeouts.

Example policy:

    Query:
        short timeout

    Create:
        bounded timeout

    Long operation:
        202 Accepted

The exact timeout values are operational configuration.

## 107. Retry Backoff

Retries should use bounded exponential backoff with jitter where appropriate.

Clients must not create retry storms.

## 108. Rate Limiting

The Control Plane may rate-limit by:

- user;
- organization;
- IP;
- token;
- endpoint;
- operation.

Rate limits should protect infrastructure without blocking normal workflows.

## 109. Rate-Limit Response

A rate-limited request should return:

    HTTP 429

and, where appropriate:

    Retry-After

Clients should respect the retry guidance.

## 110. Authentication Refresh

Long-running Studio sessions must support token/session refresh.

Refresh failures should cause controlled reauthentication rather than repeated
unauthorized requests.

## 111. Protocol Logging

Every significant protocol interaction should be traceable.

Logs should include:

- request ID;
- event ID where applicable;
- actor;
- organization;
- resource;
- operation;
- outcome;
- latency.

Sensitive credentials must never be logged.

## 112. Distributed Tracing

The protocol should support propagation of correlation metadata through:

    Studio
      |
      v
    API
      |
      v
    Worker
      |
      v
    Lab Agent
      |
      v
    Runtime

This allows end-to-end diagnosis.

## 113. Trace Context

A future implementation may use standard distributed tracing context.

The tracing context is diagnostic metadata and must not become an authorization
mechanism.

## 114. API Security

The API must enforce:

- TLS;
- authentication;
- authorization;
- input validation;
- rate limiting;
- request size limits;
- audit.

## 115. Lab Protocol Security

The Lab Protocol must enforce:

- authenticated Lab Agent identity;
- encrypted transport;
- authorization;
- protocol version checks;
- replay protection where applicable;
- command validation.

## 116. Replay Protection

Security-sensitive commands should not be accepted indefinitely.

The protocol should use:

- unique request IDs;
- authenticated sessions;
- timestamps where appropriate;
- server-side state;
- idempotency.

## 117. Command Expiration

Commands that become invalid after a state transition must be rejected.

Example:

    job.start
        |
        v
    job.completed
        |
        v
    repeated job.start
        |
        v
    CONFLICT

## 118. State-Machine Validation

The server validates legal transitions.

Example:

    QUEUED
       |
       v
    VALIDATING
       |
       v
    DEPLOYING
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       v
    COMPLETED

Invalid transitions are rejected.

## 119. Command Versus State

A command requests a transition.

An event reports a transition.

A query reports current state.

This separation prevents clients from treating event messages as commands.

## 120. Example Job Flow

    job.create
       |
       v
    201 Created
       |
       v
    job.queued
       |
       v
    job.validating
       |
       v
    job.deploying
       |
       v
    job.starting
       |
       v
    job.running
       |
       v
    job.completed

## 121. Example Failure Flow

    job.start
       |
       v
    ACCEPTED
       |
       v
    job.validating
       |
       v
    job.failed
       |
       v
    GET /jobs/{id}
       |
       v
    FAILED

The event is notification; the resource state is authoritative.

## 122. Booking Protocol

Booking commands include:

- `availability.query`;
- `booking.quote`;
- `booking.create`;
- `booking.modify`;
- `booking.cancel`.

Booking creation is idempotent.

Credit reservation and booking creation occur transactionally on the backend.

## 123. Credit Protocol

Credit operations include:

- `credit.balance`;
- `credit.quote`;
- `credit.transaction.list`;
- `credit.consumption`;
- `credit.refund`.

Financial side effects require strong idempotency.

## 124. Artifact Protocol

Artifact commands include:

- `artifact.create`;
- `artifact.upload`;
- `artifact.validate`;
- `artifact.get`;
- `artifact.download`.

Artifact content is never represented as source code in the standard protocol.

## 125. Run Protocol

Run queries include:

- `run.get`;
- `run.list`;
- `run.status`;
- `run.metrics`;
- `run.telemetry`;
- `run.logs`;
- `run.stop`.

Run state references exact:

- job;
- artifact;
- platform;
- resource;
- runtime.

## 126. Result Protocol

Result operations include:

- `result.get`;
- `result.list`;
- `result.files`;
- `result.download`;
- `result.summary`;
- `result.metrics`.

Large files use object storage rather than oversized API responses.

## 127. Lab Resource Protocol

Lab operations include:

- resource discovery;
- resource lock;
- resource release;
- resource status;
- capability query.

Resource allocation is authoritative in the Control Plane.

## 128. Lock Semantics

A resource lock must have:

- resource ID;
- owner/job ID;
- acquisition timestamp;
- expiration/lease policy;
- release semantics.

A stale connection must not permanently lock a resource.

## 129. Lease Recovery

If a Lab Agent disconnects:

    Agent Offline
       |
       v
    Lease Evaluation
       |
       +--> Active local job
       |
       +--> Resource state
       |
       v
    Reconciliation

Physical execution state is determined locally where necessary.

## 130. Protocol Backpressure

Streaming interfaces must support backpressure or bounded buffering.

The system must avoid unlimited memory growth from:

- telemetry;
- logs;
- events;
- reconnect queues.

## 131. Telemetry Sampling

High-frequency telemetry should support:

- sampling;
- aggregation;
- batching;
- rate control.

Not every raw sensor sample must cross the cloud protocol.

## 132. Event Categories

Events can be grouped into:

- identity;
- project;
- artifact;
- booking;
- credit;
- job;
- run;
- lab;
- robot;
- result;
- system.

## 133. Event Naming

Event names should use stable domain-oriented names.

Examples:

    artifact.accepted
    booking.confirmed
    job.running
    run.completed
    robot.online
    result.available

Names should not expose implementation details.

## 134. Command Naming

Commands use:

    <domain>.<operation>

Examples:

    artifact.create
    booking.create
    job.start
    run.stop

This provides consistent discovery and logging.

## 135. Contract Documentation

Each protocol contract should document:

- purpose;
- request;
- response;
- errors;
- authorization;
- idempotency;
- retry behavior;
- version;
- compatibility.

## 136. Protocol Documentation Location

Recommended repository organization:

    docs/
      protocol/
        README.md
        REST_API.md
        WEBSOCKET_PROTOCOL.md
        LAB_PROTOCOL.md
        IPC_PROTOCOL.md
        VERSIONING.md
        ERROR_CODES.md

Shared schemas remain under:

    packages/contracts/

## 137. Contract Review

Protocol changes require review for:

- compatibility;
- security;
- idempotency;
- error semantics;
- observability;
- client impact;
- migration.

## 138. Protocol Change Workflow

    Contract Change
       |
       v
    Schema Update
       |
       v
    Compatibility Check
       |
       v
    Generated Types
       |
       v
    Provider Tests
       |
       v
    Consumer Tests
       |
       v
    Review
       |
       v
    Release

## 139. Breaking Change Workflow

    Breaking Change
       |
       v
    New Version
       |
       v
    Compatibility Period
       |
       v
    Client Migration
       |
       v
    Old Version Retirement

The exact retirement policy is product-level.

## 140. Protocol Deprecation

Deprecated commands should have:

- deprecation marker;
- documentation;
- replacement;
- telemetry;
- retirement date where known.

The server should avoid silently changing old semantics.

## 141. Unknown Fields

Clients should ignore unknown optional fields.

Servers should reject malformed required fields.

This supports additive evolution.

## 142. Unknown Commands

Unsupported commands should return a stable error:

    UNSUPPORTED_COMMAND

The server should not execute unknown operations based on partial matching.

## 143. Unknown Events

Clients should safely ignore unknown events unless explicitly required for state
correctness.

Critical state should remain queryable.

## 144. Protocol Compatibility Matrix

| Producer | Consumer | Contract |
|---|---|---|
| Studio | Control Plane | REST/OpenAPI |
| Studio | Control Plane | WebSocket |
| Studio UI | Local Runtime | Tauri IPC |
| Control Plane | Worker | Queue contract |
| Control Plane | Lab Agent | Lab Protocol |
| Lab Agent | Runtime | Local execution contract |
| Control Plane | Object Storage | Storage interface |
| Control Plane | PostgreSQL | Repository interface |

## 145. Phase Mapping

| Phase | Protocol Scope | Primary Outcome |
|---|---|---|
| Phase 0 | Contracts foundation | Shared schema baseline |
| Phase 1 | IPC + API | Studio integration |
| Phase 2 | Artifact API | `.krv` transfer |
| Phase 3 | Control Plane API | Domain services |
| Phase 4 | Booking/Credits | Commercial protocol |
| Phase 5 | Lab Protocol | Remote execution |
| Phase 6 | Robot integration | Physical protocol |
| Phase 7 | WebSocket/live | Realtime execution |
| Phase 8 | Production | Protocol hardening |

## 146. Phase 0 — Protocol Foundation

Deliver:

- envelope definitions;
- IDs;
- error model;
- versioning;
- contracts package;
- OpenAPI foundation.

Acceptance:

- schemas compile;
- contract package builds;
- versioning rules are documented;
- error codes are stable.

## 147. Phase 1 — Studio Protocol

Deliver:

- Tauri IPC;
- REST client;
- authentication;
- WebSocket foundation.

Acceptance:

- frontend invokes approved native operations;
- API client is typed;
- authentication works;
- realtime connection works.

## 148. Phase 2 — Artifact Protocol

Deliver:

- artifact create;
- upload;
- validation;
- status;
- download.

Acceptance:

- `.krv` upload works;
- idempotency works;
- validation events work;
- exact artifact identity is preserved.

## 149. Phase 3 — Control Plane Protocol

Deliver:

- project;
- platform;
- artifact;
- API;
- worker contracts.

Acceptance:

- domain operations are contract-driven;
- API implementation passes contract tests;
- asynchronous workflows are recoverable.

## 150. Phase 4 — Commercial Protocol

Deliver:

- availability;
- booking;
- credits;
- billing integration interfaces.

Acceptance:

- booking creation is idempotent;
- credit side effects are idempotent;
- conflicts produce stable errors;
- state transitions are validated.

## 151. Phase 5 — Execution Protocol

Deliver:

- Lab Agent registration;
- heartbeat;
- resource discovery;
- artifact fetch;
- deployment;
- job lifecycle.

Acceptance:

- Lab Agent authenticates;
- jobs dispatch;
- state events arrive;
- reconnect/reconciliation works.

## 152. Phase 6 — Physical Robot Protocol

Deliver:

- resource capability protocol;
- runtime compatibility;
- robot state;
- deployment commands;
- safety-state reporting.

Acceptance:

- incompatible resources reject execution;
- safety state is visible;
- cloud does not replace local safety controls.

## 153. Phase 7 — Live and Results Protocol

Deliver:

- WebSocket telemetry;
- logs;
- robot status;
- result events;
- media session control.

Acceptance:

- live state updates;
- disconnect/reconnect recovery;
- telemetry bounded;
- results are traceable.

## 154. Phase 8 — Production Protocol

Deliver:

- protocol observability;
- rate limits;
- contract compatibility gates;
- security hardening;
- version deprecation;
- replay protection;
- protocol DR/recovery.

Acceptance:

- breaking changes are controlled;
- protocol metrics are monitored;
- production contracts are tested;
- old versions can be retired safely.

## 155. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Breaking API change | Critical | Versioned contracts |
| Duplicate financial operation | Critical | Idempotency |
| Duplicate job | Critical | Idempotent command + state machine |
| Lost WebSocket event | High | REST state recovery |
| Lab protocol mismatch | Critical | Version negotiation |
| Unauthorized lab command | Critical | Agent identity + authorization |
| Event storm | High | Rate control/backpressure |
| Queue duplicate | High | Worker idempotency |
| Schema drift | High | Shared contracts |
| Client/server mismatch | High | Contract tests |
| Replay attack | Critical | Authenticated sessions + IDs |
| Tenant data leakage | Critical | Server-side authorization |
| Protocol debugging difficulty | Medium | Correlation IDs/tracing |
| Stale resource lock | High | Lease/reconciliation |
| Unsafe remote stop assumptions | Critical | Local safety boundary |

## 156. Risk: WebSocket Becomes State Authority

Mitigation:

- REST remains authoritative;
- events are notifications;
- reconnect triggers state synchronization;
- event loss does not corrupt business state.

## 157. Risk: API and Database Become Coupled

Mitigation:

- resource-oriented API;
- domain services;
- repository boundaries;
- explicit contracts;
- no database schema exposure.

## 158. Risk: Protocol Version Proliferation

Mitigation:

- prefer backward-compatible additions;
- define compatibility windows;
- deprecate old versions;
- avoid unnecessary protocol variants.

## 159. Risk: Lab Agent Receives Unauthorized Commands

Mitigation:

- mTLS or equivalent authentication;
- agent identity;
- command authorization;
- job/resource binding;
- replay protection;
- audit.

## 160. Risk: Duplicate Job Execution

Mitigation:

- idempotency;
- durable job state;
- resource locks;
- unique execution identity;
- reconciliation.

## 161. Risk: Network Partition During Execution

Mitigation:

- local robot safety;
- local runtime policy;
- Lab Agent state retention;
- cloud reconciliation;
- no blind restart.

## 162. Open Questions

1. Which exact OpenAPI version will be used?
2. Will JSON Schema also be the canonical event schema?
3. Which TypeScript schema library will be used?
4. Will contracts be generated into Rust types for IPC?
5. Which WebSocket protocol will be selected?
6. Will Lab Protocol use WebSocket or gRPC?
7. Will mTLS be mandatory for every Lab Agent?
8. What is the exact Lab Protocol version negotiation mechanism?
9. What is the event retention/replay model?
10. What are the exact pagination semantics?
11. What are the standard timeout values?
12. What are the retry/backoff limits?
13. What rate limits are required?
14. What event ordering guarantees are required?
15. What telemetry throughput is expected?
16. Will telemetry use a separate transport?
17. What video signaling protocol will be used?
18. Which error codes are mandatory in v1?
19. Which operations require idempotency keys?
20. What is the exact idempotency retention period?
21. Will internal queue contracts share the public envelope?
22. Which contract compatibility tool will be used?
23. Will consumer-driven contract testing be mandatory?
24. What protocol versions will be supported simultaneously?
25. What is the deprecation period?
26. How will offline labs handle commands queued before disconnect?
27. What replay protection mechanism will be used?
28. How will resource leases be represented?
29. Which events require durable persistence?
30. Which events may be best-effort?
31. How will protocol changes be approved?
32. What protocol metrics become production SLOs?

## 163. Full Acceptance Criteria Checklist

### IPC

- [ ] Tauri IPC boundary is defined.
- [ ] IPC commands are explicitly enumerated.
- [ ] Privileged operations are not exposed generically.
- [ ] IPC requests have correlation IDs.
- [ ] IPC responses have structured status.
- [ ] Long-running operations emit progress/events.
- [ ] Filesystem access is restricted.
- [ ] Process execution is restricted.
- [ ] Local credentials are protected.

### REST API

- [ ] REST API uses `/api/v1/`.
- [ ] Resource-oriented endpoints are defined.
- [ ] OpenAPI contract exists.
- [ ] Authentication is enforced.
- [ ] Authorization is server-side.
- [ ] Pagination is standardized.
- [ ] Filtering semantics are defined.
- [ ] Error responses are structured.
- [ ] Rate limiting is supported.
- [ ] API versioning is documented.

### WebSocket

- [ ] WebSocket authentication exists.
- [ ] Authorization applies to subscriptions.
- [ ] Event envelopes are defined.
- [ ] Event IDs are unique.
- [ ] Resource correlation exists.
- [ ] Duplicate events are tolerated.
- [ ] Reconnect behavior is defined.
- [ ] REST state recovery works.
- [ ] Backpressure is defined.
- [ ] High-frequency telemetry is bounded.

### Lab Protocol

- [ ] Lab Agent identity is defined.
- [ ] Registration is defined.
- [ ] Heartbeat is defined.
- [ ] Capability discovery is defined.
- [ ] Protocol version is explicit.
- [ ] Artifact fetch is defined.
- [ ] Deployment commands are defined.
- [ ] Job lifecycle commands are defined.
- [ ] Resource lock semantics are defined.
- [ ] Reconnection/reconciliation is defined.
- [ ] Local physical safety is independent of cloud protocol.

### Envelopes

- [ ] Request envelope is defined.
- [ ] Response envelope is defined.
- [ ] Event envelope is defined.
- [ ] Protocol version is represented.
- [ ] Request IDs are represented.
- [ ] Event IDs are represented.
- [ ] Timestamps are represented.
- [ ] Actor context is defined.
- [ ] Resource context is defined.
- [ ] Error structure is defined.

### Commands

- [ ] Command naming is standardized.
- [ ] Command authorization is defined.
- [ ] Command state transitions are validated.
- [ ] Side-effecting commands support idempotency.
- [ ] Retry behavior is defined.
- [ ] Timeout behavior is defined.
- [ ] Duplicate commands are handled safely.
- [ ] Unsupported commands return stable errors.

### Responses

- [ ] Response statuses are standardized.
- [ ] HTTP and application status are distinct.
- [ ] Error codes are stable.
- [ ] Long operations use asynchronous responses.
- [ ] Responses include correlation information.
- [ ] Responses do not expose internal implementation details.

### Events

- [ ] Event naming is standardized.
- [ ] Event IDs are unique.
- [ ] Events are distinguishable from commands.
- [ ] Event ordering semantics are documented.
- [ ] Event duplication is tolerated.
- [ ] Event loss recovery is defined.
- [ ] Critical state remains queryable.

### Versioning

- [ ] API versioning is defined.
- [ ] Envelope versioning is defined.
- [ ] Lab Protocol versioning is defined.
- [ ] Artifact protocol compatibility is defined.
- [ ] Breaking-change rules are documented.
- [ ] Deprecation rules are documented.
- [ ] Compatibility windows are defined.
- [ ] Unknown fields are handled safely.
- [ ] Unknown events are handled safely.

### Idempotency

- [ ] Idempotency key semantics are defined.
- [ ] Booking creation is idempotent.
- [ ] Job creation is idempotent.
- [ ] Financial operations are idempotent.
- [ ] Artifact side effects are idempotent.
- [ ] Duplicate queue messages are safe.
- [ ] Idempotency conflicts are detectable.
- [ ] Idempotency retention is defined.

### Contracts Package

- [ ] `packages/contracts` exists.
- [ ] Public schemas are centralized.
- [ ] Error codes are centralized.
- [ ] Enums are centralized.
- [ ] Event schemas are centralized.
- [ ] Version definitions are centralized.
- [ ] OpenAPI is represented.
- [ ] Generated types are validated.
- [ ] Contract tests run in CI.

### API Client

- [ ] `packages/api-client` exists.
- [ ] API client uses shared contracts.
- [ ] Authentication is integrated.
- [ ] Errors are typed.
- [ ] Pagination is typed.
- [ ] WebSocket helpers are typed.
- [ ] Client/server compatibility is tested.

### Security

- [ ] TLS is required.
- [ ] Lab identity is authenticated.
- [ ] Authorization is enforced.
- [ ] Replay protection is defined.
- [ ] Secrets are never logged.
- [ ] Tenant isolation is enforced.
- [ ] Rate limiting is defined.
- [ ] Protocol abuse is monitored.

### Execution

- [ ] Job commands reference durable job IDs.
- [ ] Artifact identity is exact.
- [ ] Resource identity is exact.
- [ ] Runtime compatibility is checked.
- [ ] Lab authorization is checked.
- [ ] State-machine transitions are enforced.
- [ ] Execution survives transient WebSocket loss.
- [ ] Reconciliation is implemented.

### Phase Completion

- [ ] Phase 0 protocol foundation is complete.
- [ ] Phase 1 Studio IPC/API is complete.
- [ ] Phase 2 artifact protocol is complete.
- [ ] Phase 3 Control Plane protocol is complete.
- [ ] Phase 4 commercial protocol is complete.
- [ ] Phase 5 Lab Protocol is complete.
- [ ] Phase 6 physical robot protocol is complete.
- [ ] Phase 7 realtime/result protocol is complete.
- [ ] Phase 8 production protocol hardening is complete.

## 164. Final Protocol Architecture Baseline

Kritva RaaS uses explicit protocol layers rather than one universal communication
mechanism.

The final architecture is:

    React / TypeScript
          |
          | Tauri IPC
          v
    Studio Rust Runtime
          |
          | HTTPS REST
          | WebSocket
          v
    RaaS Control Plane
          |
          | Queue / Internal Contracts
          v
    Workers
          |
          | Secure Lab Protocol
          v
    Lab Agent
          |
          | Local Runtime Contract
          v
    Kritva Runtime
          |
          v
        Robot

The protocol semantics remain consistent across boundaries:

    COMMAND
       |
       v
    PROCESS
       |
       +--> RESPONSE
       |
       +--> EVENT(S)
       |
       v
    DURABLE STATE

The key architectural rules are:

1. Commands request actions.
2. Responses report processing outcomes.
3. Events report state changes.
4. REST is authoritative for durable resource state.
5. WebSocket provides realtime notification.
6. Lab Protocol is the secure cloud-to-lab execution boundary.
7. IPC protects the desktop's privileged native operations.
8. All important messages have explicit contracts.
9. Side-effecting operations are idempotent.
10. Protocol versions are explicit.
11. Breaking changes require versioned migration.
12. Unknown optional fields are tolerated.
13. Unknown events are safely ignored where possible.
14. Client reconnect does not imply loss of durable state.
15. Lab safety remains local and independent of cloud connectivity.
16. `packages/contracts` is the shared contract foundation.
17. `packages/api-client` provides typed client integration.
18. Database schemas are not exposed as protocol contracts.
19. Protocol implementation details remain behind application boundaries.
20. Every execution can be traced across Studio, Control Plane, Lab Agent, Runtime,
    and Robot.

The resulting communication model is:

    Studio
       |
       | Contracted API
       v
    Control Plane
       |
       | Contracted Lab Protocol
       v
    Lab Agent
       |
       | Contracted Runtime Interface
       v
    Robot

This protocol architecture provides the foundation for a versioned, observable,
secure, recoverable, and production-grade Kritva RaaS platform while allowing
Studio, Control Plane, Lab Agent, Runtime, and robotic platforms to evolve
independently without losing contractual compatibility.
