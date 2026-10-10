# Kritva RaaS Protocol Overview

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Protocol Overview |
| Path | `docs/protocol/PROTOCOL_OVERVIEW.md` |
| Product | Kritva Robotics-as-a-Service |
| Protocol Model | Layered, contract-driven |
| Public API | REST + WebSocket |
| Desktop IPC | Tauri IPC |
| Lab Connectivity | Secure Lab Channel |
| Contract Package | `packages/contracts` |
| API Client | `packages/api-client` |
| Status | Architecture Baseline |

## 2. Purpose

This document provides the production-grade overview of the Kritva RaaS protocol
architecture.

It defines the boundaries, protocol layers, transports, message semantics,
naming conventions, versioning principles, and phase evolution that govern
communication across the RaaS platform.

The protocol architecture is based on one fundamental principle:

> **Every system boundary has an explicit contract, explicit ownership, explicit security, and explicit failure semantics.**

The protocol must allow the Kritva RaaS Studio, Control Plane, cloud services,
Lab Agent, Kritva Runtime, and robotic resources to evolve independently while
maintaining interoperability.

## 3. Scope

This document covers:

- protocol boundaries A-D;
- protocol layering;
- transport selection;
- commands;
- responses;
- events;
- message envelopes;
- naming conventions;
- identifiers;
- authentication context;
- authorization context;
- versioning;
- idempotency;
- asynchronous operations;
- REST;
- WebSocket;
- Tauri IPC;
- Lab Channel;
- internal worker communication;
- shared contracts;
- protocol testing;
- phase mapping;
- protocol risks;
- acceptance criteria.

## 4. Protocol Boundaries

Kritva RaaS defines four primary protocol boundaries:

| Boundary | Name | Primary Participants | Transport |
|---|---|---|---|
| A | Desktop IPC | Studio UI ↔ Rust Local Runtime | Tauri IPC |
| B | Cloud API | Studio ↔ Control Plane | HTTPS REST + WebSocket |
| C | Lab Channel | Control Plane ↔ Lab Agent | Secure Lab Channel |
| D | Runtime Channel | Lab Agent ↔ Kritva Runtime/robot services | Local secure/runtime interface |

These boundaries are deliberately separated.

Boundary A protects the desktop native privilege boundary.

Boundary B is the principal public RaaS application API.

Boundary C is the secure cloud-to-lab execution boundary.

Boundary D is the local robot execution boundary.

## 5. High-Level Protocol Architecture

    +------------------------------+
    | Kritva RaaS Studio            |
    | React / TypeScript            |
    +---------------+--------------+
                    |
                    | Boundary A
                    | Tauri IPC
                    v
    +------------------------------+
    | Rust Local Runtime            |
    | Files / Build / Artifact      |
    +---------------+--------------+
                    |
                    | Boundary B
                    | HTTPS + WebSocket
                    v
    +------------------------------+
    | RaaS Control Plane            |
    | API + Domain Services         |
    +---------------+--------------+
                    |
                    | Boundary C
                    | Secure Lab Channel
                    v
    +------------------------------+
    | Lab Agent                     |
    | Resource / Deploy / Runtime   |
    +---------------+--------------+
                    |
                    | Boundary D
                    | Local Runtime Channel
                    v
    +------------------------------+
    | Kritva Runtime / Robot        |
    +------------------------------+

## 6. Protocol Layering

The logical protocol stack is:

    Application Semantics
          |
          +-- Identity
          +-- Project
          +-- Platform
          +-- Artifact
          +-- Booking
          +-- Credit
          +-- Job
          +-- Run
          +-- Result
          +-- Lab
          |
          v
    Message Semantics
          |
          +-- Command
          +-- Response
          +-- Event
          |
          v
    Common Envelope
          |
          +-- Version
          +-- Request/Event ID
          +-- Timestamp
          +-- Actor
          +-- Context
          +-- Payload
          |
          v
    Transport
          |
          +-- Tauri IPC
          +-- HTTPS
          +-- WebSocket
          +-- Lab Channel
          +-- Runtime Channel

Transport and application semantics remain separate.

## 7. Architectural Principles

The protocol follows these principles:

1. Contracts are explicit.
2. Commands request actions.
3. Responses report outcomes.
4. Events report state changes.
5. REST is authoritative for durable cloud state.
6. WebSocket provides realtime notification.
7. Lab communication is authenticated and encrypted.
8. Side-effecting commands are idempotent.
9. Protocol versions are explicit.
10. Database schemas are not API contracts.
11. Security context is validated server-side.
12. Long-running operations are asynchronous.
13. Reconnect must not cause state loss.
14. Physical safety is independent of cloud connectivity.
15. Shared contracts are maintained in `packages/contracts`.

## 8. Boundary A — Desktop IPC

Boundary A connects:

    React / TypeScript
           |
           | Tauri IPC
           v
    Rust Local Runtime

The boundary exists because the React application should not directly access
native filesystem, process, credential, or OS capabilities.

## 9. Boundary A Responsibilities

The Rust Local Runtime owns:

- filesystem access;
- project workspace access;
- process execution;
- toolchain discovery;
- local builds;
- local tests;
- artifact packaging;
- artifact validation;
- secure credential access;
- OS integration;
- application update integration.

The React layer owns presentation and workflow orchestration.

## 10. Boundary A Transport

Transport:

> **Tauri IPC**

The transport is implementation-specific, but the logical command and response
contracts should remain explicit.

## 11. Boundary A Commands

Examples:

    project.create
    project.open
    project.list
    toolchain.detect
    build.configure
    build.start
    build.cancel
    build.status
    build.logs
    test.start
    artifact.package
    artifact.validate
    system.info

## 12. Boundary A Events

Examples:

    build.started
    build.progress
    build.completed
    build.failed
    test.completed
    artifact.packaged

Events allow the UI to observe local asynchronous operations.

## 13. Boundary B — Cloud API

Boundary B connects:

    Kritva RaaS Studio
           |
           | HTTPS REST
           | WebSocket
           v
    RaaS Control Plane

Boundary B is the primary product API boundary.

## 14. Boundary B Responsibilities

Boundary B supports:

- authentication;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- realtime events.

## 15. Boundary B Transports

Two transports are used:

| Transport | Purpose |
|---|---|
| HTTPS REST | Commands, queries, durable resources |
| WebSocket | Realtime events, live state, telemetry notifications |

REST remains authoritative.

WebSocket is a notification and observation channel.

## 16. REST Principle

REST APIs expose business resources, not database tables.

Examples:

    /api/v1/projects
    /api/v1/platforms
    /api/v1/artifacts
    /api/v1/bookings
    /api/v1/jobs
    /api/v1/runs
    /api/v1/results

The Control Plane may change its internal database representation without
breaking the API contract.

## 17. WebSocket Principle

WebSocket is used when latency matters.

Examples:

- job state;
- run state;
- robot status;
- logs;
- telemetry;
- result notifications.

A client that misses an event can recover by querying REST.

## 18. Boundary C — Lab Channel

Boundary C connects:

    RaaS Control Plane
           |
           | Secure Lab Channel
           v
       Lab Agent

The Lab Agent is the controlled gateway between cloud services and the physical
robotics environment.

## 19. Boundary C Responsibilities

The Lab Channel supports:

- agent registration;
- authentication;
- heartbeat;
- capabilities;
- resource discovery;
- artifact retrieval;
- deployment;
- job control;
- resource allocation;
- telemetry;
- logs;
- results;
- reconciliation.

## 20. Boundary C Security

The Lab Channel must provide:

- authenticated Lab Agent identity;
- encrypted transport;
- authorization;
- protocol version validation;
- command validation;
- replay protection where required;
- auditability.

The cloud must not directly expose the robot network.

## 21. Boundary D — Runtime Channel

Boundary D connects:

    Lab Agent
       |
       | Local Runtime Channel
       v
    Kritva Runtime
       |
       v
    Robot services / hardware

This is a local lab execution boundary.

## 22. Boundary D Responsibilities

Boundary D may provide:

- deployment;
- process lifecycle;
- runtime control;
- resource status;
- health;
- telemetry;
- logs;
- result collection.

The exact transport depends on the robot/platform architecture.

## 23. Boundary D Safety

Boundary D must not replace physical safety systems.

The architecture distinguishes:

- application stop;
- job stop;
- runtime stop;
- robot safety state;
- physical emergency stop.

A cloud protocol outage must not disable required local safety mechanisms.

## 24. Protocol Participants

Primary participants are:

| Participant | Role |
|---|---|
| Studio UI | User interaction |
| Local Runtime | Native/local execution |
| Control Plane | Cloud authority |
| Worker | Asynchronous processing |
| Lab Agent | Lab boundary |
| Kritva Runtime | Robot execution environment |
| Robot | Physical resource |

## 25. Message Model

The RaaS protocol uses three primary message semantics:

    COMMAND
       |
       v
    RESPONSE

and:

    COMMAND
       |
       v
    ASYNCHRONOUS OPERATION
       |
       +--> EVENT
       +--> EVENT
       +--> EVENT

A command asks the system to do something.

A response reports processing of that request.

An event reports that something happened.

## 26. Command Semantics

Commands are imperative.

Examples:

    booking.create
    artifact.upload
    job.create
    job.start
    job.stop
    deployment.start

Commands may be synchronous or asynchronous.

## 27. Query Semantics

Queries retrieve current state.

Examples:

    project.get
    platform.get
    artifact.get
    booking.get
    job.get
    run.get
    result.get

Queries should not have unintended side effects.

## 28. Response Semantics

Responses communicate the immediate processing result.

A response may indicate:

- success;
- rejection;
- acceptance;
- conflict;
- invalid request;
- authorization failure;
- temporary unavailability.

## 29. Event Semantics

Events communicate state transitions or significant occurrences.

Examples:

    artifact.accepted
    booking.confirmed
    job.queued
    job.running
    job.completed
    robot.online
    robot.offline
    result.available

Events are not commands.

## 30. Common Envelope

Logical command envelope:

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

## 31. Response Envelope

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

## 32. Event Envelope

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
            "organization_id": "org-001"
        },
        "data": {}
    }

## 33. Envelope Fields

| Field | Command | Response | Event | Purpose |
|---|---:|---:|---:|---|
| `protocol_version` | Yes | Yes | Yes | Contract version |
| `request_id` | Yes | Yes | Optional | Correlation |
| `event_id` | No | No | Yes | Event identity |
| `timestamp` | Yes | Yes | Yes | Message time |
| `command` | Yes | No | No | Command name |
| `event` | No | No | Yes | Event name |
| `actor` | Yes | Optional | Optional | Identity |
| `context` | Yes | Optional | Yes | Tenant/resource context |
| `status` | No | Yes | No | Outcome |
| `code` | Optional | Yes | Optional | Stable machine code |
| `data` | Yes | Yes | Yes | Payload |
| `error` | No | Optional | Optional | Failure details |

## 34. Request Identity

Every request must have a unique `request_id`.

The identifier supports:

- tracing;
- logging;
- debugging;
- support;
- request correlation.

It must not be used as an authentication credential.

## 35. Event Identity

Every event should have a unique `event_id`.

Event identity enables:

- deduplication;
- diagnostics;
- replay handling;
- event tracing.

## 36. Resource Identity

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

Identifiers should be opaque and implementation-independent.

## 37. Context

Context may contain:

- organization;
- project;
- resource;
- actor;
- execution;
- lab.

Context provides correlation and routing information.

Context supplied by the client never replaces server-side authorization.

## 38. Timestamp Convention

Protocol timestamps use UTC.

Example:

    2026-10-08T00:00:00Z

Server-side timestamps remain authoritative for business ordering.

## 39. Status Convention

Application status is distinct from transport status.

Supported logical statuses include:

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

## 40. HTTP Status Mapping

| HTTP | Typical Meaning |
|---|---|
| 200 | Successful operation/query |
| 201 | Resource created |
| 202 | Accepted asynchronous operation |
| 204 | Successful no-content operation |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Authorization failure |
| 404 | Resource not found |
| 409 | State conflict |
| 422 | Semantic validation failure |
| 429 | Rate limited |
| 500 | Internal failure |
| 503 | Temporarily unavailable |

## 41. Error Convention

Errors use stable machine-readable codes.

Example:

    ARTIFACT_INCOMPATIBLE
    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    RESOURCE_UNAVAILABLE
    JOB_INVALID_STATE
    IDEMPOTENCY_CONFLICT
    UNSUPPORTED_PROTOCOL_VERSION

Human-readable messages may change.

Machine codes should remain stable.

## 42. Error Structure

    {
        "status": "ERROR",
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is not compatible with selected platform",
        "error": {
            "details": {
                "required_runtime": "2.x",
                "available_runtime": "1.x"
            }
        }
    }

Error details must not expose secrets or internal infrastructure information.

## 43. Naming Convention

Protocol names use:

    <domain>.<operation>

Examples:

    auth.login
    project.create
    platform.list
    artifact.upload
    booking.create
    credit.balance
    job.start
    run.status
    result.get

## 44. Event Naming

Events use:

    <domain>.<state-or-event>

Examples:

    artifact.uploaded
    artifact.accepted
    booking.confirmed
    job.running
    job.completed
    robot.online
    result.available

Event names describe occurrences, not commands.

## 45. Resource Naming

Resources use singular domain names:

    project
    platform
    artifact
    booking
    job
    run
    result
    lab
    agent
    resource

REST collection names may use plural nouns.

## 46. Versioning

The protocol uses explicit versioning at multiple levels.

Examples:

    /api/v1/
    protocol_version = "1.0"
    artifact_format_version = "1"
    lab_protocol_version = "1.0"

Each versioned contract has its own compatibility rules.

## 47. API Versioning

Public REST APIs are versioned through the URL:

    /api/v1/

Breaking API changes require a new major version.

Compatible additions remain within the current major version.

## 48. Envelope Versioning

Message envelopes carry:

    protocol_version

This allows protocol compatibility to be negotiated independently where
necessary.

## 49. Lab Versioning

Lab Agent and Control Plane exchange supported protocol versions.

Conceptually:

    Agent
      |
      | supported_versions = ["1.0"]
      v
    Control Plane
      |
      v
    negotiated_version = "1.0"

Unsupported versions are rejected explicitly.

## 50. Compatibility

Compatibility is evaluated across:

    Studio
       |
       v
    API
       |
       v
    Control Plane
       |
       v
    Lab Agent
       |
       v
    Kritva Runtime
       |
       v
    Artifact

Compatibility includes:

- protocol;
- API;
- artifact;
- runtime;
- SDK;
- platform;
- architecture.

## 51. Backward Compatibility

Compatible changes include:

- optional fields;
- additional metadata;
- new resources;
- new event types.

Consumers should tolerate unknown optional fields.

## 52. Breaking Changes

Breaking changes require:

1. New version.
2. Migration documentation.
3. Compatibility testing.
4. Client migration.
5. Deprecation policy.
6. Controlled retirement.

## 53. Unknown Fields

Clients should ignore unknown optional fields.

Servers should reject:

- malformed required fields;
- invalid field types;
- unsupported required semantics.

## 54. Unknown Events

Clients should safely ignore unknown events unless the event is explicitly
required for correctness.

Current state remains recoverable through REST.

## 55. Unknown Commands

Unsupported commands return:

    UNSUPPORTED_COMMAND

The server must never infer or partially execute an unknown operation.

## 56. Idempotency

Side-effecting commands require idempotency where duplicate execution could
cause harm or inconsistent state.

Examples:

- booking creation;
- job creation;
- artifact completion;
- credit operations;
- payment operations;
- resource allocation.

## 57. Idempotency Key

The client supplies:

    Idempotency-Key: <unique-value>

The Control Plane stores the key and resulting outcome for the defined retention
period.

## 58. Idempotency Behavior

Repeated equivalent requests with the same key should return the original
logical result.

A reused key with a different semantic payload should produce:

    IDEMPOTENCY_KEY_REUSE_MISMATCH

## 59. Retry Convention

Retryable operations include:

- transient network failures;
- temporary service failures;
- 429 responses;
- explicitly retryable 5xx failures.

Side-effecting requests must use idempotency keys before retry.

## 60. Timeout Convention

Every network operation has a bounded timeout.

Long-running operations use asynchronous semantics.

Example:

    job.start
       |
       v
    202 Accepted
       |
       v
    job_id
       |
       +--> events
       |
       +--> GET /jobs/{job_id}

## 61. Asynchronous Operations

Long-running operations include:

- artifact validation;
- artifact processing;
- booking allocation;
- job start;
- deployment;
- result processing.

The initial response confirms acceptance, not completion.

## 62. Durable State

Asynchronous state is stored in authoritative systems.

Examples:

- booking state in PostgreSQL;
- job state in PostgreSQL;
- run state in PostgreSQL;
- artifact state in PostgreSQL/object storage metadata.

Events do not replace durable state.

## 63. WebSocket Reconnection

When a WebSocket connection is lost:

    Connection Lost
       |
       v
    Reconnect
       |
       v
    Authenticate
       |
       v
    Query Current State
       |
       v
    Resume Subscriptions

This prevents UI state corruption.

## 64. WebSocket Delivery

WebSocket event delivery should be treated as at-least-once notification.

Consumers must tolerate:

- duplicate events;
- disconnects;
- missed events;
- reconnects.

## 65. Event Ordering

Events should provide resource-level ordering where required.

Possible mechanisms include:

- sequence number;
- event timestamp;
- event ID.

Global ordering across all resources is not required.

## 66. Event Subscription

Conceptual subscription:

    {
        "command": "subscribe",
        "request_id": "req-900",
        "payload": {
            "resource_type": "job",
            "resource_id": "job-001"
        }
    }

The server verifies authorization before creating the subscription.

## 67. Event Categories

Events are organized by domain:

| Domain | Example Events |
|---|---|
| Auth | session.expiring |
| Project | project.updated |
| Artifact | artifact.validating |
| Booking | booking.confirmed |
| Credit | credit.consumed |
| Job | job.running |
| Run | run.completed |
| Lab | agent.online |
| Robot | robot.offline |
| Result | result.available |

## 68. Protocol Commands

The principal command inventory includes:

### Identity

    auth.login
    auth.logout
    auth.refresh
    auth.me

### Projects

    project.create
    project.list
    project.get
    project.update
    project.archive
    project.delete

### Platforms

    platform.list
    platform.get
    platform.capabilities
    platform.compatibility

### Artifacts

    artifact.create
    artifact.upload
    artifact.get
    artifact.list
    artifact.validate
    artifact.delete
    artifact.download

### Booking

    availability.query
    booking.quote
    booking.create
    booking.get
    booking.list
    booking.modify
    booking.cancel

### Credits

    credit.balance
    credit.quote
    credit.transaction.list
    credit.consumption
    credit.refund

### Jobs

    job.create
    job.get
    job.list
    job.start
    job.stop
    job.cancel
    job.status
    job.logs

### Runs

    run.get
    run.list
    run.status
    run.metrics
    run.telemetry
    run.logs
    run.stop

### Results

    result.get
    result.list
    result.files
    result.download
    result.summary
    result.metrics

## 69. Lab Commands

The Lab Channel reserves:

    agent.register
    agent.heartbeat
    agent.status
    agent.capabilities
    agent.resources
    agent.configure
    artifact.fetch
    deployment.prepare
    deployment.start
    deployment.stop
    job.start
    job.stop
    job.cancel
    resource.lock
    resource.release

## 70. Lab Events

The Lab Channel reserves:

    agent.online
    agent.offline
    resource.available
    resource.busy
    resource.error
    deployment.started
    deployment.completed
    job.running
    job.completed
    telemetry.updated
    logs.available
    result.available

## 71. Internal Worker Protocol

Control Plane workers communicate through queue contracts.

Examples:

    artifact.validate
    booking.reconcile
    job.schedule
    job.dispatch
    result.process
    cleanup.execute

Queue messages are internal contracts and are not public API commands.

## 72. Queue Message

    {
        "protocol_version": "1.0",
        "message_id": "msg-001",
        "type": "artifact.validate",
        "created_at": "2026-10-08T00:00:00Z",
        "payload": {
            "artifact_id": "artifact-001"
        }
    }

Queue messages must be safe to process more than once.

## 73. Contracts Package

The monorepo provides:

    packages/contracts/

This package is the shared source for:

- request schemas;
- response schemas;
- event schemas;
- enums;
- error codes;
- resource models;
- version definitions.

## 74. Contracts Consumers

    packages/contracts
          |
          +--> Studio
          +--> api-client
          +--> Control Plane
          +--> Lab Agent
          +--> Tests
          +--> Documentation

The contract package must remain implementation-neutral.

## 75. API Client

The monorepo provides:

    packages/api-client/

It provides typed access to:

- REST endpoints;
- authentication;
- errors;
- pagination;
- WebSocket events.

Feature components should not independently construct HTTP requests.

## 76. Contract Source of Truth

Each externally visible message shape should have one authoritative definition.

Generated artifacts may include:

- TypeScript types;
- OpenAPI definitions;
- validation schemas;
- client code;
- test fixtures.

Generated code must not become a competing source of truth.

## 77. OpenAPI

OpenAPI defines:

- paths;
- methods;
- request parameters;
- request bodies;
- responses;
- authentication;
- errors;
- pagination.

The REST API implementation must be tested against the OpenAPI contract.

## 78. Event Schemas

Events must define:

- event name;
- version;
- envelope;
- payload;
- required fields;
- optional fields;
- authorization scope.

## 79. Schema Validation

CI should validate:

- schema syntax;
- generated types;
- OpenAPI consistency;
- backward compatibility;
- event payloads;
- API implementation.

## 80. Protocol Testing

Protocol tests include:

1. Schema tests.
2. Serialization tests.
3. Contract tests.
4. Authentication tests.
5. Authorization tests.
6. Idempotency tests.
7. Retry tests.
8. Compatibility tests.
9. Integration tests.
10. End-to-end tests.

## 81. Contract Testing

The contract relationship is:

    Producer
       |
       v
    Contract
       ^
       |
    Consumer

Producer and consumer implementations must not silently diverge.

## 82. Security Context

Protocol requests are associated with:

- authenticated identity;
- organization;
- project;
- resource.

The server derives effective authorization from authenticated context and stored
relationships.

Client-supplied context is not trusted automatically.

## 83. Tenant Isolation

Organization context is mandatory for tenant-scoped operations.

The Control Plane must verify:

    authenticated user
          |
          v
    organization membership
          |
          v
    resource authorization

A valid API token does not imply access to another organization.

## 84. Authentication

Authentication is transport- and deployment-aware.

Studio-to-Control Plane communication uses the configured user authentication
system.

Lab communication uses Lab Agent identity.

These are separate trust models.

## 85. Authorization

Authorization must be enforced at the resource boundary.

Examples:

- user can access permitted projects;
- user can access organization credits;
- user can submit jobs only for permitted resources;
- Lab Agent can execute only authorized jobs.

## 86. Lab Agent Identity

Each Lab Agent has a unique identity.

Identity supports:

- registration;
- authentication;
- authorization;
- revocation;
- audit;
- capability association.

## 87. Secure Lab Transport

The Lab Channel must use encrypted communication.

The exact implementation may use:

- mTLS;
- secure WebSocket;
- gRPC over mTLS;
- another approved secure transport.

The logical contract is independent of transport.

## 88. Protocol Security Boundary

The security architecture is:

    User
      |
      v
    Studio
      |
      | Authenticated API
      v
    Control Plane
      |
      | Authenticated Lab Channel
      v
    Lab Agent
      |
      | Local authenticated interface
      v
    Runtime

No layer should bypass the preceding authorization boundary.

## 89. Physical Safety

Protocol correctness is not physical safety.

The architecture requires:

- local robot safety;
- physical emergency stop;
- local safety controller;
- safe failure behavior.

Cloud commands may request application or job operations but cannot be the sole
physical safety mechanism.

## 90. Data Flow — Local Build

    Source
       |
       v
    Studio Local Runtime
       |
       +--> Toolchain
       |
       +--> Build
       |
       +--> Test
       |
       v
    .krv Artifact
       |
       v
    Upload

Source code does not cross Boundary B as source.

## 91. Data Flow — Artifact Upload

    .krv
       |
       v
    Local Validation
       |
       v
    artifact.create
       |
       v
    Upload Authorization
       |
       v
    Object Storage
       |
       v
    Artifact Validation
       |
       v
    artifact.accepted

## 92. Data Flow — Booking

    Studio
       |
       v
    availability.query
       |
       v
    booking.quote
       |
       v
    booking.create
       |
       +--> Booking
       +--> Credit Reservation
       +--> Audit
       |
       v
    booking.confirmed

## 93. Data Flow — Execution

    Artifact
       +
    Booking
       |
       v
    job.create
       |
       v
    QUEUED
       |
       v
    Scheduler
       |
       v
    Lab Agent
       |
       v
    Artifact Fetch
       |
       v
    Deployment
       |
       v
    Runtime
       |
       v
    Robot

## 94. Data Flow — Live Execution

    Robot / Runtime
       |
       v
    Lab Agent
       |
       v
    Lab Channel
       |
       v
    Control Plane
       |
       v
    WebSocket
       |
       v
    Studio

Video may use a specialized media path.

## 95. Data Flow — Results

    Robot / Runtime
       |
       v
    Lab Agent
       |
       +--> Result Metadata
       |
       +--> Object Storage
       |
       v
    Control Plane
       |
       v
    Result API
       |
       v
    Studio

## 96. Command/Response/Event Example

    Studio
       |
       | job.start
       v
    Control Plane
       |
       | 202 Accepted
       | job_id=job-001
       v
    Studio
       |
       | WebSocket
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

## 97. State Recovery Example

    Studio
       |
       | WebSocket disconnected
       X
       |
       v
    Reconnect
       |
       v
    GET /api/v1/jobs/job-001
       |
       v
    Current State
       |
       v
    Resume UI

The system does not require every historical event to restore current state.

## 98. Resource State

Resource state is authoritative in the Control Plane.

Typical states:

    AVAILABLE
    RESERVED
    DEPLOYING
    RUNNING
    MAINTENANCE
    OFFLINE
    FAULT

The Lab Agent provides observed local state.

## 99. Job State

Job states include:

    CREATED
    QUEUED
    VALIDATING
    ALLOCATING
    DEPLOYING
    STARTING
    RUNNING
    STOPPING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

Invalid state transitions must be rejected.

## 100. State-Machine Principle

Commands request state transitions.

Events report successful transitions.

Example:

    job.start
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       v
    job.running

The event does not itself cause the state transition.

## 101. Protocol Observability

Every important protocol operation should be traceable.

Observability fields include:

- request ID;
- event ID;
- message ID;
- actor;
- organization;
- resource;
- command/event;
- protocol version;
- outcome;
- latency.

## 102. Distributed Tracing

Correlation may propagate:

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

This enables diagnosis of long-running remote execution.

## 103. Logging Rules

Protocol logs must not include:

- access tokens;
- refresh tokens;
- private keys;
- passwords;
- secrets;
- sensitive source content.

Logs may include safe identifiers and stable error codes.

## 104. Rate Limiting

The Control Plane may rate-limit by:

- user;
- organization;
- IP;
- token;
- endpoint;
- operation.

Rate limiting protects the service and prevents abusive clients from consuming
execution or infrastructure resources.

## 105. Backpressure

Streaming protocols must support bounded buffering.

The system must prevent unlimited accumulation of:

- telemetry;
- logs;
- events;
- reconnect queues.

## 106. Telemetry

Telemetry may contain:

- CPU;
- memory;
- temperature;
- battery;
- joint state;
- sensor data;
- application metrics.

High-frequency telemetry should use sampling, aggregation, batching, or a
specialized transport where required.

## 107. Video

Video is a media stream, not an ordinary API payload.

The protocol architecture should provide session control and authorization while
allowing a suitable media transport.

The exact video technology is a separate implementation decision.

## 108. Large Objects

Large binaries should not be transferred through ordinary JSON API payloads.

Examples:

- `.krv` artifacts;
- result archives;
- recorded video.

Object storage or dedicated streaming paths are preferred.

## 109. Protocol Boundaries and Authority

| Boundary | Primary Authority |
|---|---|
| A | Local Runtime for native operations |
| B | Control Plane for cloud business state |
| C | Control Plane for authorization; Lab Agent for local execution |
| D | Lab/Runtime for local execution and safety |

This avoids ambiguous ownership.

## 110. Failure Handling

A protocol failure should identify:

- transport failure;
- authentication failure;
- authorization failure;
- validation failure;
- state conflict;
- dependency failure;
- timeout;
- unavailable resource.

Failures should not be collapsed into generic "operation failed" messages.

## 111. Network Partition

If Studio loses cloud connectivity:

- local development may continue;
- cached remote state is marked stale;
- booking cannot be assumed valid;
- execution cannot be assumed authorized;
- reconnect performs synchronization.

## 112. Lab Partition

If the Lab Agent loses cloud connectivity:

- local safety continues;
- active runtime follows local policy;
- new cloud-authorized jobs are blocked by default;
- state is buffered where appropriate;
- reconnect triggers reconciliation.

## 113. Reconciliation

Reconciliation compares:

    Control Plane State
           |
           | compare
           v
    Lab Agent State
           |
           v
    Runtime Observed State

Reconciliation applies to:

- jobs;
- resources;
- artifacts;
- results;
- agent status.

## 114. Protocol Conventions

General conventions:

- UTF-8 for textual messages;
- UTC timestamps;
- stable opaque identifiers;
- explicit versions;
- explicit status;
- structured errors;
- deterministic naming;
- no secrets in payloads unless explicitly required;
- bounded payload sizes;
- explicit pagination.

## 115. Payload Conventions

Payloads should be:

- domain-specific;
- minimally sufficient;
- schema validated;
- version compatible.

Payloads should not include unnecessary database columns.

## 116. Optional Fields

Optional fields should be used for forward-compatible additions.

Required fields should be stable.

A new required field is normally a breaking change.

## 117. Boolean Semantics

Boolean fields should use explicit true/false semantics.

Avoid ambiguous string representations such as:

    "yes"
    "no"

## 118. Null Semantics

The contract must define whether an absent field and explicit null have different
meanings.

Clients should not infer semantics not specified by the contract.

## 119. Date and Time Semantics

Use UTC timestamps for machine-readable protocol times.

Human-facing timezone conversion belongs to the UI.

## 120. Numeric Precision

Financial values and credit operations should use explicitly defined precision
and units.

Protocol fields must not rely on floating-point ambiguity for financial state.

## 121. Units

Telemetry fields must define units.

Examples:

    temperature_celsius
    battery_percent
    cpu_percent

Avoid ambiguous fields such as:

    temperature
    battery

unless their units are separately specified.

## 122. Protocol Documentation

Recommended protocol documentation:

    docs/protocol/
      PROTOCOL_OVERVIEW.md
      IPC_PROTOCOL.md
      REST_API.md
      WEBSOCKET_PROTOCOL.md
      LAB_PROTOCOL.md
      VERSIONING.md
      ERROR_CODES.md

The current document is the top-level protocol overview.

## 123. Protocol Change Workflow

    Proposed Change
       |
       v
    Contract Update
       |
       v
    Compatibility Check
       |
       v
    Implementation
       |
       v
    Contract Tests
       |
       v
    Integration Tests
       |
       v
    Review
       |
       v
    Release

## 124. Compatibility Gates

CI should prevent:

- accidental removal of required fields;
- incompatible type changes;
- breaking enum changes;
- undocumented API changes;
- event schema breakage.

## 125. Protocol Deprecation

Deprecated operations should have:

- explicit documentation;
- replacement;
- deprecation status;
- usage monitoring;
- retirement plan.

Old semantics should not silently change.

## 126. Protocol Security Testing

Security tests should include:

- unauthorized command;
- unauthorized subscription;
- tenant boundary violation;
- invalid token;
- expired session;
- replayed command;
- malformed payload;
- oversized payload;
- rate-limit abuse;
- invalid protocol version.

## 127. Protocol Performance Testing

Performance tests should measure:

- REST latency;
- WebSocket event latency;
- artifact upload throughput;
- command processing latency;
- Lab Channel latency;
- event throughput;
- reconnect behavior.

## 128. Protocol Availability

The Control Plane should remain operational independently of individual Studio
instances.

Lab connectivity failures should not bring down the global Control Plane.

Individual Lab Agents may become unavailable without invalidating other labs.

## 129. Protocol Isolation

A failure in:

- one user's WebSocket;
- one job;
- one Lab Agent;
- one resource;

must not corrupt unrelated users, organizations, jobs, or resources.

## 130. Protocol Resource Limits

The protocol should define limits for:

- request body;
- artifact size;
- result size;
- event rate;
- telemetry rate;
- log rate;
- subscription count;
- concurrent jobs.

Exact production values are operational configuration.

## 131. Boundary A Interface Summary

| Interface | Direction | Transport | Purpose |
|---|---|---|---|
| IPC Command | UI → Runtime | Tauri IPC | Native operation |
| IPC Response | Runtime → UI | Tauri IPC | Operation result |
| IPC Event | Runtime → UI | Tauri IPC | Local progress |

## 132. Boundary B Interface Summary

| Interface | Direction | Transport | Purpose |
|---|---|---|---|
| REST Query | Studio → Control Plane | HTTPS | Current state |
| REST Command | Studio → Control Plane | HTTPS | Business operation |
| REST Response | Control Plane → Studio | HTTPS | Operation result |
| Event | Control Plane → Studio | WebSocket | Realtime notification |

## 133. Boundary C Interface Summary

| Interface | Direction | Transport | Purpose |
|---|---|---|---|
| Agent Registration | Agent ↔ Control Plane | Lab Channel | Identity |
| Heartbeat | Agent → Control Plane | Lab Channel | Health |
| Command | Control Plane → Agent | Lab Channel | Execution |
| Event | Agent → Control Plane | Lab Channel | State |
| Telemetry | Agent → Control Plane | Lab Channel | Observation |
| Result | Agent → Control Plane | Lab Channel | Execution output |

## 134. Boundary D Interface Summary

| Interface | Direction | Purpose |
|---|---|---|
| Deployment | Agent → Runtime | Install artifact |
| Start/Stop | Agent → Runtime | Process lifecycle |
| Health | Runtime → Agent | Runtime health |
| Telemetry | Runtime → Agent | Execution data |
| Logs | Runtime → Agent | Diagnostics |
| Result | Runtime → Agent | Output |

## 135. Phase Mapping

| Phase | Protocol Work | Primary Result |
|---|---|---|
| Phase 0 | Protocol foundation | Contracts and conventions |
| Phase 1 | Desktop/API | Studio communication |
| Phase 2 | Artifact | `.krv` transfer |
| Phase 3 | Control Plane | Domain API |
| Phase 4 | Commercial | Booking and credits |
| Phase 5 | Lab | Remote execution |
| Phase 6 | Robot | Physical integration |
| Phase 7 | Live | Realtime observation |
| Phase 8 | Production | Hardening and governance |

## 136. Phase 0 — Foundation

Deliver:

- common envelopes;
- identifiers;
- errors;
- naming;
- versioning;
- contracts package;
- OpenAPI foundation.

Acceptance:

- schemas compile;
- naming is documented;
- version rules exist;
- contract tests execute.

## 137. Phase 1 — Studio

Deliver:

- Boundary A;
- authentication;
- REST client;
- WebSocket foundation.

Acceptance:

- typed IPC works;
- API client works;
- authentication works;
- realtime connection works.

## 138. Phase 2 — Artifact

Deliver:

- artifact commands;
- upload;
- validation;
- status;
- compatibility metadata.

Acceptance:

- `.krv` uploads;
- digest is preserved;
- validation is observable;
- source remains local.

## 139. Phase 3 — Control Plane

Deliver:

- project API;
- platform API;
- artifact API;
- worker contracts;
- durable state.

Acceptance:

- API contracts are enforced;
- asynchronous workflows are recoverable;
- error model is consistent.

## 140. Phase 4 — Booking and Credits

Deliver:

- availability;
- quotes;
- bookings;
- credits.

Acceptance:

- booking operations are idempotent;
- credit operations are safe;
- conflicts are explicit.

## 141. Phase 5 — Execution

Deliver:

- Lab Channel;
- agent registration;
- resource discovery;
- artifact fetch;
- deployment;
- job lifecycle.

Acceptance:

- agent authenticates;
- job reaches runtime;
- state events work;
- reconciliation works.

## 142. Phase 6 — Physical Robot

Deliver:

- platform capabilities;
- robot state;
- runtime compatibility;
- local safety integration.

Acceptance:

- incompatible execution is rejected;
- safety state remains local;
- cloud loss does not disable safety.

## 143. Phase 7 — Live and Results

Deliver:

- WebSocket live events;
- telemetry;
- logs;
- results;
- video session control.

Acceptance:

- live state works;
- reconnect works;
- telemetry is bounded;
- results are traceable.

## 144. Phase 8 — Production

Deliver:

- protocol monitoring;
- rate limiting;
- compatibility gates;
- security hardening;
- deprecation;
- replay protection;
- production SLOs.

Acceptance:

- breaking changes are controlled;
- protocol health is observable;
- security tests pass;
- version retirement is controlled.

## 145. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Boundary ambiguity | Critical | Explicit A-D ownership |
| API breaking change | Critical | Versioned contracts |
| Duplicate booking | Critical | Idempotency |
| Duplicate execution | Critical | Idempotency + state machine |
| Lost WebSocket event | High | REST recovery |
| Lab impersonation | Critical | Agent identity + mTLS |
| Tenant data leakage | Critical | Server authorization |
| Event storm | High | Backpressure |
| Protocol drift | High | Shared contracts |
| Queue duplicate | High | Worker idempotency |
| Replay attack | Critical | Authenticated sessions + IDs |
| Resource stale lock | High | Lease + reconciliation |
| Safety misunderstanding | Critical | Local safety boundary |
| Oversized payload | High | Limits |
| Network partition | High | Reconciliation |
| Version proliferation | Medium | Controlled compatibility |

## 146. Risk — WebSocket as Authority

If clients depend on every event, a lost connection can create incorrect state.

Mitigation:

- REST remains authoritative;
- reconnect queries current state;
- events are notifications;
- event IDs support deduplication.

## 147. Risk — Protocol Drift

Independent implementations can diverge.

Mitigation:

- `packages/contracts`;
- OpenAPI;
- generated types;
- schema validation;
- CI compatibility tests.

## 148. Risk — Lab Protocol Compromise

A compromised Lab Channel could affect physical resources.

Mitigation:

- strong agent identity;
- authorization;
- network isolation;
- command validation;
- audit;
- local safety systems;
- agent revocation.

## 149. Risk — Duplicate Financial Operation

A retry could charge credits twice.

Mitigation:

- idempotency key;
- transactional ledger;
- immutable transaction record;
- unique operation reference;
- reconciliation.

## 150. Risk — Duplicate Robot Execution

A repeated `job.start` could cause unsafe or conflicting execution.

Mitigation:

- job state machine;
- idempotency;
- resource lock;
- execution identity;
- Lab Agent validation.

## 151. Risk — Cloud Connectivity Loss

Mitigation:

- local execution policy;
- Lab Agent buffering;
- local safety;
- cloud reconciliation;
- block new unauthorized jobs.

## 152. Risk — Protocol Version Mismatch

Mitigation:

- explicit version negotiation;
- compatibility matrix;
- rejection of unsupported versions;
- controlled upgrades.

## 153. Open Questions

1. What exact Tauri IPC schema technology will be used?
2. Will IPC contracts be generated into Rust and TypeScript?
3. What exact OpenAPI version will be pinned?
4. Will JSON Schema be canonical for events?
5. Which TypeScript schema library will be used?
6. Will Lab Channel use WebSocket or gRPC?
7. Is mTLS mandatory for all Lab Agents?
8. What exact protocol negotiation mechanism will be used?
9. What is the event replay policy?
10. What event retention is required?
11. What are the exact pagination semantics?
12. What are the production timeout values?
13. What retry limits apply?
14. What rate limits apply?
15. What ordering guarantees are required?
16. What telemetry rate is expected?
17. Will telemetry use a specialized channel?
18. Which video transport will be selected?
19. Which error codes are mandatory in v1?
20. Which operations require idempotency?
21. How long are idempotency records retained?
22. Should internal queue messages use the same envelope?
23. Which compatibility checker will be used?
24. Will consumer-driven contracts be mandatory?
25. How many protocol versions are supported concurrently?
26. What is the deprecation period?
27. How are commands handled during Lab disconnect?
28. What replay protection is required?
29. What is the exact resource lease model?
30. Which events must be durable?
31. Which events may be best-effort?
32. Which protocol metrics become production SLOs?

## 154. Full Acceptance Criteria Checklist

### Protocol Boundaries

- [ ] Boundary A is explicitly defined.
- [ ] Boundary B is explicitly defined.
- [ ] Boundary C is explicitly defined.
- [ ] Boundary D is explicitly defined.
- [ ] Ownership is defined for each boundary.
- [ ] Transport is defined for each boundary.
- [ ] Security model is defined for each boundary.
- [ ] Failure behavior is defined for each boundary.

### Layering

- [ ] Application semantics are separated from transport.
- [ ] Message semantics are defined.
- [ ] Common envelopes are defined.
- [ ] Transport-specific behavior is isolated.
- [ ] Database schema is not treated as protocol contract.

### Commands

- [ ] Command naming convention exists.
- [ ] Command semantics are documented.
- [ ] Side-effecting commands support idempotency.
- [ ] Command authorization is enforced.
- [ ] Invalid state transitions are rejected.
- [ ] Unsupported commands return stable errors.

### Responses

- [ ] Response envelope is defined.
- [ ] Application statuses are standardized.
- [ ] HTTP status mapping is documented.
- [ ] Stable error codes exist.
- [ ] Long operations return asynchronous acceptance.
- [ ] Response correlation is supported.

### Events

- [ ] Event naming convention exists.
- [ ] Event envelope is defined.
- [ ] Event IDs exist.
- [ ] Event duplication is tolerated.
- [ ] Event ordering semantics are documented.
- [ ] WebSocket reconnect is supported.
- [ ] REST state recovery exists.

### Boundary A

- [ ] Tauri IPC is defined.
- [ ] IPC commands are allowlisted.
- [ ] Filesystem access is controlled.
- [ ] Process execution is controlled.
- [ ] IPC events are supported.
- [ ] Native errors are structured.
- [ ] IPC security tests exist.

### Boundary B

- [ ] HTTPS REST is defined.
- [ ] `/api/v1/` versioning exists.
- [ ] WebSocket is defined.
- [ ] Authentication is enforced.
- [ ] Authorization is server-side.
- [ ] Pagination is standardized.
- [ ] Rate limiting is supported.
- [ ] REST remains authoritative.

### Boundary C

- [ ] Lab Agent identity exists.
- [ ] Registration exists.
- [ ] Heartbeat exists.
- [ ] Capability discovery exists.
- [ ] Secure transport exists.
- [ ] Artifact fetch is defined.
- [ ] Deployment is defined.
- [ ] Job lifecycle is defined.
- [ ] Resource locking is defined.
- [ ] Reconciliation is defined.

### Boundary D

- [ ] Runtime interface is defined.
- [ ] Deployment is defined.
- [ ] Runtime lifecycle is defined.
- [ ] Health is defined.
- [ ] Telemetry is defined.
- [ ] Logs are defined.
- [ ] Results are defined.
- [ ] Local safety remains independent.

### Versioning

- [ ] API versioning exists.
- [ ] Envelope versioning exists.
- [ ] Lab protocol versioning exists.
- [ ] Artifact compatibility is defined.
- [ ] Breaking changes require versioning.
- [ ] Additive changes remain backward compatible where possible.
- [ ] Deprecation is documented.
- [ ] Unknown optional fields are tolerated.
- [ ] Unknown events are handled safely.

### Idempotency

- [ ] Idempotency key semantics are defined.
- [ ] Booking creation is idempotent.
- [ ] Job creation is idempotent.
- [ ] Financial operations are idempotent.
- [ ] Resource operations are safe under retry.
- [ ] Queue messages are safely repeatable.
- [ ] Key reuse mismatch is detectable.

### Contracts

- [ ] `packages/contracts` exists.
- [ ] Public schemas are centralized.
- [ ] Error codes are centralized.
- [ ] Event schemas are centralized.
- [ ] Versions are centralized.
- [ ] OpenAPI is maintained.
- [ ] Generated types are validated.
- [ ] Contract tests run in CI.

### Security

- [ ] TLS is enforced.
- [ ] Authentication is enforced.
- [ ] Authorization is enforced.
- [ ] Tenant isolation is enforced.
- [ ] Lab identity is authenticated.
- [ ] Replay protection is addressed.
- [ ] Secrets are excluded from logs.
- [ ] Payload limits are enforced.
- [ ] Rate limiting exists.
- [ ] Physical safety is independent of protocol.

### Data Flows

- [ ] Local build flow is defined.
- [ ] Artifact upload flow is defined.
- [ ] Booking flow is defined.
- [ ] Credit flow is defined.
- [ ] Execution flow is defined.
- [ ] Live flow is defined.
- [ ] Result flow is defined.
- [ ] Reconnect flow is defined.
- [ ] Reconciliation flow is defined.

### Observability

- [ ] Request IDs exist.
- [ ] Event IDs exist.
- [ ] Message IDs exist where required.
- [ ] Protocol operations are logged.
- [ ] Sensitive values are redacted.
- [ ] Distributed tracing is supported.
- [ ] Latency is measurable.
- [ ] Failure rates are measurable.

### Testing

- [ ] Schema validation exists.
- [ ] Serialization tests exist.
- [ ] Contract tests exist.
- [ ] Authentication tests exist.
- [ ] Authorization tests exist.
- [ ] Idempotency tests exist.
- [ ] Retry tests exist.
- [ ] Compatibility tests exist.
- [ ] Integration tests exist.
- [ ] End-to-end tests exist.
- [ ] Security tests exist.
- [ ] Performance tests exist.

### Phase Completion

- [ ] Phase 0 protocol foundation is complete.
- [ ] Phase 1 Studio/API integration is complete.
- [ ] Phase 2 artifact protocol is complete.
- [ ] Phase 3 Control Plane protocol is complete.
- [ ] Phase 4 commercial protocol is complete.
- [ ] Phase 5 Lab Channel is complete.
- [ ] Phase 6 physical robot integration is complete.
- [ ] Phase 7 live/results protocol is complete.
- [ ] Phase 8 production hardening is complete.

## 155. Final Protocol Baseline

The Kritva RaaS protocol architecture is intentionally layered:

    Boundary A
    React / TypeScript
          |
          | Tauri IPC
          v
    Rust Local Runtime

    Boundary B
    Rust Local Runtime
          |
          | HTTPS REST
          | WebSocket
          v
    RaaS Control Plane

    Boundary C
    RaaS Control Plane
          |
          | Secure Lab Channel
          v
    Lab Agent

    Boundary D
    Lab Agent
          |
          | Runtime Channel
          v
    Kritva Runtime
          |
          v
    Robot

The semantic model remains consistent across the platform:

    COMMAND
       |
       v
    PROCESSING
       |
       +--> RESPONSE
       |
       +--> EVENT(S)
       |
       v
    DURABLE STATE

The protocol architecture therefore establishes the following invariants:

1. Boundary A controls access to desktop-native capabilities.
2. Boundary B is the authoritative RaaS application API.
3. Boundary C isolates cloud infrastructure from the physical lab network.
4. Boundary D isolates the Lab Agent from robot-runtime implementation details.
5. Commands request actions.
6. Responses report processing outcomes.
7. Events report occurrences and state transitions.
8. REST remains authoritative for durable cloud state.
9. WebSocket provides realtime notification and observation.
10. Long-running operations are asynchronous.
11. Side-effecting operations are idempotent.
12. Protocol versions are explicit.
13. Contracts are centrally maintained.
14. API and database schemas remain independently evolvable.
15. Tenant authorization is enforced server-side.
16. Lab Agent identity is independently authenticated.
17. Physical robot safety remains local.
18. Network failures do not silently become execution authorization.
19. Reconnect and reconciliation are first-class protocol behaviors.
20. Every significant operation can be correlated and diagnosed.

The resulting protocol model supports the complete Kritva RaaS lifecycle:

    Build Locally
         |
         v
    Package .krv
         |
         v
    Upload Artifact
         |
         v
    Book Robot
         |
         v
    Create Job
         |
         v
    Allocate Resource
         |
         v
    Deploy
         |
         v
    Execute
         |
         v
    Observe
         |
         v
    Collect Results
         |
         v
    Analyze / Rerun

This provides the protocol foundation for a secure, versioned, observable,
recoverable, multi-platform robotics execution service while preserving the
core Kritva RaaS principle:

> **Build locally. Book remotely. Run on real robots.**
