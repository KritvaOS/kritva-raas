# Kritva RaaS API Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | API Architecture |
| Path | `docs/architecture/API_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Primary API | REST |
| Realtime API | WebSocket |
| External Version | `/api/v1/` |
| Contract | OpenAPI + shared domain contracts |
| Authentication | Token-based authenticated sessions |
| Data Authority | RaaS Control Plane |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the production-grade API architecture for Kritva RaaS.

The API is the formal application boundary between:

- Kritva RaaS Studio;
- Web Console;
- RaaS Control Plane;
- administrative clients;
- future integrations;
- Lab Agents where applicable.

The API architecture defines:

- resource-oriented REST APIs;
- realtime WebSocket communication;
- authentication;
- authorization;
- API versioning;
- request and response envelopes;
- resource identifiers;
- pagination;
- filtering;
- sorting;
- validation;
- error handling;
- idempotency;
- rate limiting;
- concurrency;
- asynchronous operations;
- realtime events;
- OpenAPI contracts;
- compatibility;
- observability;
- security;
- phase-by-phase implementation.

The API is a contract boundary, not merely a collection of HTTP endpoints.

## 3. Scope

This document covers:

1. REST API architecture.
2. WebSocket architecture.
3. Resource modeling.
4. API versioning.
5. Authentication.
6. Authorization.
7. Organization and tenant isolation.
8. Request validation.
9. Response conventions.
10. Pagination.
11. Filtering.
12. Sorting.
13. Errors.
14. Idempotency.
15. Rate limiting.
16. Asynchronous operations.
17. Realtime events.
18. WebSocket subscriptions.
19. OpenAPI.
20. Shared contracts.
21. API lifecycle.
22. Compatibility.
23. Observability.
24. Security.
25. Phase 0-8 implementation.

## 4. Goals

The API architecture shall:

1. Provide a stable public application contract.
2. Support Studio and Web Console.
3. Support future integrations without redesign.
4. Clearly separate synchronous and asynchronous operations.
5. Provide secure tenant-aware access.
6. Support reliable execution workflows.
7. Support realtime job and telemetry updates.
8. Provide consistent error semantics.
9. Support safe retries through idempotency.
10. Provide predictable pagination.
11. Support API evolution.
12. Generate machine-readable OpenAPI documentation.
13. Keep transport concerns separate from domain logic.
14. Prevent cloud API semantics from leaking infrastructure implementation details.
15. Support production observability.

## 5. Non-Goals

The API does not:

- expose PostgreSQL directly;
- expose object storage credentials directly;
- expose arbitrary cloud infrastructure commands;
- expose raw robot hardware protocols to normal users;
- replace the Lab Protocol;
- provide hard real-time robot control;
- use WebSocket as the authoritative data store;
- require synchronous HTTP requests for long-running jobs;
- expose internal repository interfaces as public APIs.

## 6. Architectural Principles

The API follows these principles:

1. REST for durable resource operations.
2. WebSocket for realtime observation and events.
3. HTTPS everywhere for external API access.
4. Explicit API versioning.
5. Stable opaque resource IDs.
6. Consistent response/error contracts.
7. Server-side authorization.
8. Organization-aware tenancy.
9. Idempotency for side effects.
10. Asynchronous execution for long-running work.
11. API contracts before implementation.
12. Backward compatibility within a major version.
13. No transport-specific business logic.
14. Explicit lifecycle state.
15. Auditability for sensitive operations.

## 7. High-Level API Topology

    Kritva RaaS Studio
            |
            | HTTPS REST
            | WebSocket
            v
    +--------------------------+
    |      API Gateway         |
    +------------+-------------+
                 |
                 v
    +--------------------------+
    |    Control Plane API     |
    |                          |
    | Authentication           |
    | Authorization            |
    | Resources                |
    | Application Services     |
    +------------+-------------+
                 |
        +--------+--------+
        |        |        |
        v        v        v
       DB     Queue    Object Storage
                 |
                 v
              Workers

Web Console uses the same API contract.

## 8. API Boundary

The external API is exposed through:

    /api/v1/

The API Gateway or application edge is responsible for:

- TLS termination where appropriate;
- request size limits;
- authentication forwarding;
- rate limiting;
- request correlation;
- routing;
- abuse protection.

The Control Plane remains responsible for business authorization and domain validation.

## 9. API Consumers

Primary consumers are:

| Consumer | REST | WebSocket | Primary Use |
|---|---:|---:|---|
| RaaS Studio | Yes | Yes | Developer workflow |
| Web User Console | Yes | Yes | User operations |
| Web Admin Console | Yes | Yes | Administration |
| Internal Workers | Limited/Internal | No | Async processing |
| Lab Agent | Separate protocol | Separate protocol | Robot execution |
| Future Integrations | Yes | Optional | External integration |

The Lab Protocol remains distinct from the public user API.

## 10. API Versioning

The public API uses URL versioning:

    /api/v1/

Examples:

    /api/v1/projects
    /api/v1/platforms
    /api/v1/bookings

Breaking changes require a new major API version.

Compatible additions remain within the current major version where practical.

## 11. Versioning Rules

The following are generally compatible:

- adding optional response fields;
- adding optional request fields;
- adding new resources;
- adding new enum values only where clients tolerate unknown values;
- adding new endpoints.

The following are potentially breaking:

- removing fields;
- changing field meaning;
- changing field types;
- removing enum values;
- changing required request fields;
- changing authorization semantics;
- changing lifecycle semantics.

## 12. Version Compatibility

API compatibility is one layer of a broader compatibility model:

    Studio
       |
    API version
       |
    Control Plane
       |
    Artifact format
       |
    Lab Protocol
       |
    Lab Agent
       |
    Kritva Runtime
       |
    Robot Platform

Changing one boundary must not silently break another.

## 13. Resource-Oriented API

The API models durable business entities as resources.

Primary resources include:

- users;
- organizations;
- memberships;
- projects;
- platforms;
- platform versions;
- artifacts;
- bookings;
- credit plans;
- credit wallets;
- credit transactions;
- jobs;
- runs;
- labs;
- resources;
- results;
- audit events.

## 14. Resource Naming

Collection names use plural nouns.

Examples:

    /api/v1/projects
    /api/v1/platforms
    /api/v1/artifacts
    /api/v1/bookings
    /api/v1/jobs
    /api/v1/runs
    /api/v1/results

Individual resources use opaque identifiers:

    /api/v1/projects/{project_id}
    /api/v1/jobs/{job_id}

## 15. Resource Identifiers

Resource IDs should be opaque and stable.

UUIDs are recommended.

Clients must not depend on:

- database sequence values;
- internal database layout;
- filesystem paths;
- provider-specific IDs.

## 16. Resource Lifecycle

Resources with lifecycle states should expose explicit state fields.

Example:

    {
        "id": "job-123",
        "status": "RUNNING"
    }

Lifecycle states are part of the API contract.

## 17. User API

Representative endpoints:

    GET    /api/v1/users/me
    PATCH  /api/v1/users/me

The user resource exposes user information appropriate to the authenticated user.

Sensitive authentication information is never returned.

## 18. Organization API

Representative endpoints:

    POST   /api/v1/organizations
    GET    /api/v1/organizations
    GET    /api/v1/organizations/{organization_id}
    PATCH  /api/v1/organizations/{organization_id}

Organization access is authorization-controlled.

## 19. Membership API

Representative endpoints:

    GET    /api/v1/organizations/{organization_id}/members
    POST   /api/v1/organizations/{organization_id}/members
    DELETE /api/v1/organizations/{organization_id}/members/{member_id}

Roles determine administrative permissions.

## 20. Project API

Representative endpoints:

    POST   /api/v1/projects
    GET    /api/v1/projects
    GET    /api/v1/projects/{project_id}
    PATCH  /api/v1/projects/{project_id}
    POST   /api/v1/projects/{project_id}/archive
    DELETE /api/v1/projects/{project_id}

Project ownership is organization-scoped.

## 21. Platform API

Platform discovery is generally read-only for users.

Representative endpoints:

    GET /api/v1/platforms
    GET /api/v1/platforms/{platform_id}
    GET /api/v1/platforms/{platform_id}/capabilities
    POST /api/v1/platforms/{platform_id}/compatibility-check

Administrative platform management is role-restricted.

## 22. Artifact API

Representative endpoints:

    POST   /api/v1/artifacts
    GET    /api/v1/artifacts
    GET    /api/v1/artifacts/{artifact_id}
    POST   /api/v1/artifacts/{artifact_id}/validate
    DELETE /api/v1/artifacts/{artifact_id}

Binary upload should use object-storage upload authorization where appropriate.

## 23. Artifact Upload Flow

The API should avoid proxying large binaries through the application server when
possible.

Flow:

    Studio
       |
       | POST artifact metadata
       v
    Control Plane
       |
       | upload authorization
       v
    Studio
       |
       | direct/object-storage upload
       v
    Object Storage
       |
       v
    Validation Worker
       |
       v
    Artifact Status

## 24. Artifact Download

Artifact downloads should use authorized short-lived URLs or controlled streaming.

The API must not expose permanent public object-storage URLs.

## 25. Booking API

Representative endpoints:

    GET  /api/v1/availability
    POST /api/v1/booking-quotes
    POST /api/v1/bookings
    GET  /api/v1/bookings
    GET  /api/v1/bookings/{booking_id}
    PATCH /api/v1/bookings/{booking_id}
    POST /api/v1/bookings/{booking_id}/cancel

Booking creation has financial/resource side effects and requires idempotency.

## 26. Availability API

Availability queries should support:

- platform;
- resource;
- date/time range;
- duration;
- capability requirements.

Example:

    GET /api/v1/availability?platform_id=humanoid-a&start=...&end=...

The response must not be interpreted as a guaranteed reservation.

## 27. Booking Quote

A quote may contain:

- platform;
- resource class;
- requested duration;
- credit plan;
- rate;
- required credits;
- quote expiration.

Example:

    {
        "platform_id": "humanoid-a",
        "credit_plan_id": "developer",
        "rate_per_minute": 15,
        "duration_minutes": 30,
        "required_credits": 450,
        "expires_at": "2026-10-08T12:00:00Z"
    }

## 28. Credit API

Representative endpoints:

    GET /api/v1/credit-wallets
    GET /api/v1/credit-wallets/{wallet_id}
    GET /api/v1/credit-transactions
    GET /api/v1/credit-quotes

Credit consumption and refunds are controlled server-side.

Clients cannot directly modify balances.

## 29. Job API

Representative endpoints:

    POST /api/v1/jobs
    GET  /api/v1/jobs
    GET  /api/v1/jobs/{job_id}
    POST /api/v1/jobs/{job_id}/start
    POST /api/v1/jobs/{job_id}/stop
    POST /api/v1/jobs/{job_id}/cancel

Long-running execution is asynchronous.

## 30. Job Lifecycle

Recommended states:

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

The API must expose lifecycle transitions consistently.

## 31. Run API

A run represents an execution instance.

Representative endpoints:

    GET /api/v1/runs
    GET /api/v1/runs/{run_id}
    GET /api/v1/runs/{run_id}/status
    GET /api/v1/runs/{run_id}/metrics
    GET /api/v1/runs/{run_id}/logs
    GET /api/v1/runs/{run_id}/telemetry
    POST /api/v1/runs/{run_id}/stop

A job may have one or more execution attempts depending on future retry policy.

## 32. Result API

Representative endpoints:

    GET /api/v1/results
    GET /api/v1/results/{result_id}
    GET /api/v1/results/{result_id}/files
    GET /api/v1/results/{result_id}/summary
    GET /api/v1/results/{result_id}/metrics

Large result files should be retrieved using authorized object-storage URLs.

## 33. Lab API

Lab administration APIs may include:

    GET /api/v1/labs
    GET /api/v1/labs/{lab_id}
    GET /api/v1/labs/{lab_id}/resources
    GET /api/v1/labs/{lab_id}/agents

These endpoints are generally administrative or operational.

The Lab Agent itself uses the Lab Protocol rather than the public user API.

## 34. Audit API

Audit records should generally be read-only.

Example:

    GET /api/v1/audit-events

Access should be restricted to authorized administrative roles.

## 35. HTTP Methods

The API uses conventional HTTP semantics:

| Method | Typical Use |
|---|---|
| GET | Read |
| POST | Create/action/command |
| PATCH | Partial update |
| DELETE | Delete where supported |

POST action endpoints are acceptable for domain operations that are not naturally
represented as simple CRUD updates.

## 36. Response Envelope

A successful response should use a consistent structure where appropriate.

Example:

    {
        "data": {
            "id": "project-123",
            "name": "Robot Demo"
        },
        "meta": {}
    }

Collection responses may include pagination metadata.

## 37. Collection Response

Example:

    {
        "data": [
            {
                "id": "project-001",
                "name": "Project A"
            },
            {
                "id": "project-002",
                "name": "Project B"
            }
        ],
        "meta": {
            "next_cursor": "opaque-cursor",
            "has_more": true
        }
    }

## 38. Request IDs

Every API request should receive a request ID.

Clients may provide a valid correlation/request identifier, subject to policy.

The server should return:

    X-Request-Id

or the platform's equivalent correlation header.

Request IDs must appear in logs and error responses where appropriate.

## 39. Correlation

The system should preserve:

- request ID;
- organization ID;
- project ID;
- job ID;
- run ID;
- artifact ID.

This allows a single user operation to be traced across services and workers.

## 40. Authentication

External API authentication should use a secure token-based mechanism.

Typical flow:

    User
      |
      v
    Authentication Provider
      |
      v
    Access Token
      |
      v
    RaaS API
      |
      v
    Authenticated Request

The exact identity provider may be selected during implementation.

## 41. Access Tokens

Access tokens should be:

- short-lived where practical;
- scoped;
- securely transmitted;
- revocable through session/token mechanisms;
- never exposed in URLs.

Refresh tokens, if used, require stronger storage and rotation controls.

## 42. Authentication Header

Standard bearer authentication is recommended:

    Authorization: Bearer <access-token>

Tokens must only be transmitted over HTTPS.

## 43. Session Context

The authenticated context should resolve:

- user ID;
- organization memberships;
- active organization;
- roles;
- permissions;
- token/session identity.

The application service must not trust organization IDs supplied only by the client.

## 44. Authorization

Authorization is server-side.

The API evaluates:

    Identity
       +
    Organization Membership
       +
    Role
       +
    Resource Ownership
       +
    Operation
       +
    Resource State

Authorization must be applied before sensitive operations.

## 45. Tenant Isolation

Organization-scoped resources must be filtered server-side.

A user must not be able to access another organization's:

- projects;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

Client-supplied organization IDs do not override authorization.

## 46. Roles

Initial role model may include:

    OWNER
    ADMIN
    MEMBER
    VIEWER

Additional roles may be introduced later.

Permissions should be defined independently of UI visibility.

## 47. Resource Authorization

Example:

    GET /projects/{id}

Authorization checks:

1. Authenticate user.
2. Resolve project.
3. Determine owning organization.
4. Verify membership.
5. Verify required permission.
6. Return resource.

## 48. Validation

All incoming API requests must be validated.

Validation includes:

- required fields;
- types;
- formats;
- ranges;
- enum values;
- identifiers;
- state transitions;
- business rules.

Validation errors should be deterministic and machine-readable.

## 49. Error Envelope

Recommended error structure:

    {
        "error": {
            "code": "ARTIFACT_INCOMPATIBLE",
            "message": "Artifact is not compatible with selected platform",
            "details": {},
            "request_id": "req-123"
        }
    }

The API should not expose stack traces or internal implementation details.

## 50. HTTP Status Codes

Recommended mapping:

| Status | Meaning |
|---|---|
| 200 | Successful read/update/action |
| 201 | Resource created |
| 202 | Accepted asynchronous operation |
| 204 | Successful operation with no body |
| 400 | Invalid request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | State/resource conflict |
| 412 | Preconditions failed |
| 422 | Semantic validation failure |
| 429 | Rate limited |
| 500 | Internal failure |
| 502 | Upstream failure |
| 503 | Temporarily unavailable |
| 504 | Upstream timeout |

## 51. Application Error Codes

HTTP status is not sufficient for clients.

The API also returns stable application error codes.

Examples:

    AUTH_REQUIRED
    ACCESS_DENIED
    RESOURCE_NOT_FOUND
    INVALID_REQUEST
    RESOURCE_CONFLICT
    ARTIFACT_INCOMPATIBLE
    ARTIFACT_INVALID
    BOOKING_UNAVAILABLE
    INSUFFICIENT_CREDITS
    RESOURCE_OFFLINE
    JOB_ALREADY_RUNNING
    JOB_NOT_STOPPABLE
    LAB_UNAVAILABLE
    RATE_LIMITED
    INTERNAL_ERROR

## 52. Error Code Stability

Clients may safely branch on documented error codes.

Human-readable `message` values may change.

Error codes should not encode implementation details.

## 53. Error Details

`details` may include structured validation information.

Example:

    {
        "error": {
            "code": "VALIDATION_FAILED",
            "message": "Request validation failed",
            "details": {
                "fields": {
                    "duration_minutes": "must be greater than zero"
                }
            }
        }
    }

Sensitive values must never appear in error details.

## 54. Conflict Handling

HTTP `409 Conflict` should be used when the requested operation conflicts with
current state.

Examples:

- booking slot already taken;
- resource already allocated;
- job already started;
- artifact state does not permit deletion.

## 55. Preconditions

Where concurrent modification matters, the API may support optimistic concurrency.

Possible mechanisms:

    If-Match
    ETag
    resource_version

The exact mechanism must be standardized before production.

## 56. Pagination

Collection APIs must support pagination.

Cursor-based pagination is preferred for mutable or large collections.

Example:

    GET /api/v1/jobs?limit=50&cursor=<opaque-cursor>

The cursor must be opaque to the client.

## 57. Pagination Response

Example:

    {
        "data": [],
        "meta": {
            "limit": 50,
            "next_cursor": "opaque",
            "has_more": true
        }
    }

The server controls maximum page size.

## 58. Pagination Limits

The API should define:

- default page size;
- maximum page size;
- minimum page size where needed.

Clients requesting excessive page sizes should receive either a capped result or
validation error according to the API policy.

## 59. Stable Pagination

Cursor pagination should use a deterministic ordering.

A stable unique identifier should be included in the ordering to avoid duplicates
or omissions when records share timestamps.

## 60. Filtering

Resources may support documented filters.

Examples:

    status
    platform_id
    project_id
    organization_id
    created_after
    created_before

Only supported filters should be accepted.

Unknown filters should not silently alter behavior.

## 61. Sorting

Sorting should be explicitly documented.

Example:

    GET /api/v1/jobs?sort=-created_at

Allowed fields should be constrained.

Clients must not inject arbitrary SQL expressions through sort parameters.

## 62. Search

Search may be supported for selected resources.

Search semantics must be resource-specific and documented.

Example:

    GET /api/v1/projects?search=robot

Search must be bounded and indexed appropriately.

## 63. API Rate Limiting

Rate limiting protects the Control Plane.

Limits may be applied by:

- user;
- organization;
- token;
- IP;
- endpoint;
- operation class.

Financial and execution operations require particularly strong protection.

## 64. Rate Limit Classes

Recommended categories:

| Class | Examples |
|---|---|
| Read | GET projects, jobs |
| Write | POST/PATCH resources |
| Expensive | availability/search |
| Execution | job start/stop |
| Financial | booking/credit operations |
| Realtime | WebSocket subscriptions |

Limits should be configurable.

## 65. Rate Limit Response

When limited:

    HTTP 429

The response should provide retry guidance where appropriate.

Example headers may include:

    Retry-After

The exact header strategy should be standardized.

## 66. Idempotency

Idempotency is mandatory for operations where retries can cause harmful side effects.

Examples:

- booking creation;
- job creation;
- job start;
- payment operations;
- credit operations;
- artifact registration/upload completion.

## 67. Idempotency Key

Clients send:

    Idempotency-Key: <unique-key>

The server stores the key and operation result for the defined retention period.

A repeated request with the same key and equivalent request should return the original
result.

## 68. Idempotency Scope

An idempotency key should be scoped by:

    organization
    user/client
    endpoint/operation

This prevents accidental collisions.

## 69. Idempotency Conflict

If the same idempotency key is reused with a different request payload, the API must
reject the request.

Example:

    IDEMPOTENCY_KEY_REUSED

This prevents ambiguous execution.

## 70. Idempotency Storage

Idempotency records may contain:

- key;
- operation;
- request fingerprint;
- response status;
- response body reference;
- created time;
- expiration.

Sensitive request bodies should not be stored unnecessarily.

## 71. Asynchronous APIs

Long-running operations should return:

    HTTP 202 Accepted

Example:

    POST /api/v1/jobs/{job_id}/start

Response:

    {
        "data": {
            "job_id": "job-123",
            "status": "QUEUED"
        }
    }

The client then observes state through REST or WebSocket.

## 72. Asynchronous Operation Principle

Do not hold an HTTP request open while:

- waiting for a robot;
- downloading an artifact;
- deploying;
- running an experiment;
- collecting long-duration results.

Use durable state plus asynchronous workers.

## 73. WebSocket Purpose

WebSocket provides realtime observation and event delivery.

Primary uses:

- job state;
- run state;
- booking updates;
- artifact validation updates;
- logs;
- telemetry;
- resource status;
- notifications;
- video session signaling where appropriate.

WebSocket is not the system of record.

## 74. WebSocket Connection

Conceptually:

    Studio
       |
       | WSS
       v
    Realtime Gateway
       |
       v
    Control Plane Event Service
       |
       v
    Domain Events

The connection must be authenticated.

## 75. WebSocket Authentication

Authentication may use:

- authenticated session;
- access token during connection establishment;
- secure session cookie where appropriate.

Tokens should not be placed in long-lived URLs.

## 76. WebSocket Authorization

Authentication is followed by authorization.

A client may subscribe only to events it is authorized to see.

For example:

    organization:org-001
    project:project-001
    job:job-001
    run:run-001

The server must validate ownership/permissions for every subscription.

## 77. WebSocket Subscription

A subscription request may conceptually contain:

    {
        "type": "subscribe",
        "channel": "job",
        "resource_id": "job-123"
    }

The exact wire schema is defined in the shared protocol contract.

## 78. WebSocket Events

Events should use explicit event names.

Examples:

    artifact.validating
    artifact.accepted
    booking.confirmed
    job.queued
    job.validating
    job.deploying
    job.starting
    job.running
    job.completed
    robot.online
    robot.offline
    telemetry.updated

## 79. Event Envelope

Recommended event structure:

    {
        "event_id": "evt-123",
        "event_type": "job.running",
        "protocol_version": "1.0",
        "timestamp": "2026-10-08T12:00:00Z",
        "resource": {
            "type": "job",
            "id": "job-123"
        },
        "data": {}
    }

## 80. Event IDs

Every event should have a unique event ID.

Event IDs support:

- deduplication;
- debugging;
- client-side diagnostics;
- replay mechanisms where implemented.

## 81. Event Ordering

Ordering guarantees must be defined per resource stream.

The system should not imply global ordering across all events.

For a single job, events should preserve meaningful lifecycle ordering.

## 82. Event Delivery

WebSocket delivery should be considered at-least-once unless a stronger guarantee is
explicitly implemented.

Clients should tolerate:

- duplicate events;
- reconnects;
- missed events;
- out-of-order events where permitted.

## 83. Reconnection

Studio/Web Console should automatically reconnect after WebSocket failure.

After reconnect:

1. Re-authenticate.
2. Re-establish subscriptions.
3. Query authoritative REST state.
4. Resume realtime events.

REST state is used to recover from missed events.

## 84. Event Replay

A future event replay mechanism may support:

    last_event_id

or a durable event sequence.

This is optional initially.

REST reconciliation is sufficient for early releases.

## 85. WebSocket Backpressure

The realtime layer must prevent a slow client from consuming unlimited resources.

Possible controls:

- bounded connection buffers;
- event coalescing;
- sampling;
- telemetry rate limiting;
- connection termination for abusive clients.

## 86. Telemetry Over WebSocket

High-frequency telemetry should not be sent as unlimited individual messages.

The realtime layer may:

- aggregate;
- sample;
- batch;
- compress;
- publish summaries.

Raw telemetry can use a separate optimized path if required later.

## 87. Live Logs Over WebSocket

Logs may be streamed for an active run.

The client should treat logs as a stream, not authoritative historical storage.

Historical logs remain available through the REST API.

## 88. Realtime Job Flow

    POST /jobs/{id}/start
          |
          v
    HTTP 202
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

The Studio can render the lifecycle without polling continuously.

## 89. REST and WebSocket Division

| Requirement | REST | WebSocket |
|---|---:|---:|
| Get project | Yes | No |
| Create project | Yes | No |
| Get booking | Yes | Optional event |
| Create booking | Yes | No |
| Start job | Yes | No |
| Job state | Yes | Yes |
| Live logs | Historical | Yes |
| Historical logs | Yes | No |
| Live telemetry | Optional | Yes |
| Historical telemetry | Yes | No |
| Results | Yes | Notification |
| Video | No | Signaling/metadata |

## 90. OpenAPI Contract

The REST API must be formally described using OpenAPI.

The OpenAPI specification should define:

- paths;
- methods;
- parameters;
- request schemas;
- response schemas;
- authentication;
- errors;
- status codes;
- pagination;
- examples.

## 91. OpenAPI as Contract

OpenAPI should be treated as a version-controlled contract.

Recommended location:

    docs/protocol/openapi/

or:

    packages/contracts/openapi/

The final repository location should be selected consistently during implementation.

## 92. Shared Contracts Package

The monorepo should contain:

    packages/contracts/

It should define shared API/domain types where practical.

Examples:

- Job;
- Run;
- Project;
- Artifact;
- Platform;
- Booking;
- Result;
- Error;
- Event;
- Pagination.

## 93. Generated Clients

API clients may be generated from OpenAPI.

For example:

    OpenAPI
       |
       +--> TypeScript Client
       |
       +--> Validation Schemas
       |
       +--> Documentation

Generated code should not become a substitute for domain-level API design.

## 94. Contract-First Development

Recommended development order:

    API Requirement
          |
          v
    Contract
          |
          v
    OpenAPI
          |
          v
    Server Implementation
          |
          v
    Client Integration
          |
          v
    Contract Tests

This prevents Studio and backend from independently inventing incompatible interfaces.

## 95. Schema Validation

Request and response schemas should be validated automatically where practical.

Validation should occur:

- at API boundary;
- in contract tests;
- in client integration tests.

## 96. Backward Compatibility Testing

CI should detect breaking API changes.

Examples:

- removed response field;
- changed field type;
- required request field;
- incompatible enum changes;
- removed endpoint.

A deliberate breaking change requires an explicit API version strategy.

## 97. API Documentation

OpenAPI-generated documentation should be available to developers.

Documentation should explain:

- authentication;
- resources;
- examples;
- lifecycle states;
- error codes;
- idempotency;
- pagination;
- WebSocket events.

## 98. API Security Headers

The API edge should apply appropriate security headers.

Exact headers depend on deployment architecture.

At minimum:

- TLS;
- secure cookie settings where cookies are used;
- appropriate CORS policy;
- request size limits.

## 99. CORS

CORS should allow only approved application origins.

Production must not use unrestricted wildcard CORS for authenticated APIs.

Studio desktop requests may use Tauri-specific mechanisms rather than browser CORS.

## 100. Request Size Limits

The API must define request size limits.

Large binaries should use object storage rather than bypassing request limits.

## 101. Timeout Policy

API requests should have bounded timeouts.

Long-running operations return asynchronous responses instead of increasing HTTP timeouts
indefinitely.

## 102. API Availability

The API should be stateless at the application layer where possible.

Persistent state is stored in:

- PostgreSQL;
- object storage;
- durable queues.

This allows horizontal scaling.

## 103. API Gateway

The API Gateway/edge may provide:

- TLS;
- routing;
- rate limiting;
- WAF;
- request size limits;
- access logging;
- WebSocket upgrade support.

Business authorization remains inside the Control Plane.

## 104. Internal APIs

Internal workers should prefer application services and internal interfaces rather
than calling public HTTP endpoints for every operation.

This prevents unnecessary transport coupling.

## 105. Repository Boundary

API handlers must not directly execute SQL.

The intended flow is:

    HTTP
      |
      v
    Controller
      |
      v
    Application Service
      |
      v
    Repository
      |
      v
    PostgreSQL

## 106. Transaction Boundary

Application services own transaction boundaries.

API controllers should not manually manage database transactions.

Transactions must remain short and must not wait on:

- robot execution;
- external network calls;
- large uploads;
- long worker operations.

## 107. Event Publication

Domain events should be published after durable state changes.

An outbox pattern may be used:

    DB Transaction
       |
       +--> Business State
       |
       +--> Outbox Event
       |
       COMMIT
          |
          v
       Event Publisher
          |
          v
       WebSocket / Workers

This reduces state/event inconsistency.

## 108. Event Authority

WebSocket events are derived from authoritative domain state.

If an event is missed, the client can retrieve current state through REST.

## 109. Audit Events

Security-sensitive API operations should generate audit events.

Examples:

- login;
- organization membership change;
- artifact deletion;
- booking creation;
- credit transaction;
- job execution;
- admin configuration;
- lab management;
- refund.

## 110. API Observability

Every request should be observable through:

- request ID;
- method;
- path template;
- status;
- latency;
- actor;
- organization;
- error code.

Sensitive data must not be logged.

## 111. API Metrics

Recommended metrics:

    api_requests_total
    api_request_duration
    api_errors_total
    api_rate_limited_total
    api_auth_failures_total
    api_authorization_failures_total
    websocket_connections
    websocket_disconnects
    websocket_events_sent
    websocket_subscription_count

## 112. Endpoint Metrics

Expensive operations should have dedicated metrics:

    availability_query_duration
    booking_create_duration
    artifact_validation_duration
    job_create_duration
    job_start_duration
    result_query_duration

## 113. Sensitive Logging

Never log:

- access tokens;
- refresh tokens;
- passwords;
- private keys;
- artifact signing keys;
- full credit/payment credentials;
- sensitive user information.

Request/response bodies should be logged only when explicitly safe.

## 114. API Health

The API should expose operational health separately from user resources.

Possible internal endpoints:

    /health/live
    /health/ready

These should not expose sensitive infrastructure information publicly.

## 115. Dependency Health

Readiness may check critical dependencies such as:

- PostgreSQL;
- queue;
- required configuration;
- secret availability.

A temporary lab outage should not necessarily make the entire API unhealthy.

## 116. API Failure Semantics

The API should distinguish:

    INVALID REQUEST
        = client error

    UNAUTHORIZED
        = authentication failure

    FORBIDDEN
        = authenticated but not permitted

    CONFLICT
        = current resource state prevents operation

    UNAVAILABLE
        = temporary infrastructure/resource problem

    INTERNAL ERROR
        = unexpected server failure

## 117. Retry Guidance

Clients should retry only errors that are documented as retryable.

Typical retryable cases:

- 429;
- 502;
- 503;
- 504.

Business conflicts generally require a new client decision rather than blind retry.

## 118. Retry and Idempotency

Any retry of a side-effecting operation should use the same idempotency key.

Example:

    POST /api/v1/bookings
    Idempotency-Key: booking-attempt-001

A network timeout does not mean the operation failed.

The client should retry with the same key.

## 119. API Concurrency

Concurrent modifications must be handled explicitly.

Examples:

- two users editing a project;
- two clients cancelling a booking;
- two start requests for a job;
- two users consuming credits.

The Control Plane remains authoritative.

## 120. State Transition Validation

The API must reject invalid transitions.

Example:

    COMPLETED -> STARTING

must not be accepted.

The domain service owns lifecycle transition rules.

## 121. Booking Concurrency

Booking creation requires transactional protection.

The API should not rely on:

    availability check
        +
    later insert

without a database-level conflict strategy.

The final booking operation must atomically establish the reservation.

## 122. Credit Concurrency

Credit consumption must be atomic.

The API must prevent:

    Client A consumes credits
    Client B consumes same credits

through transactional checks and immutable transaction records.

## 123. Job Concurrency

Job start must be protected against duplicate requests.

The server should validate:

- job state;
- booking;
- artifact;
- resource;
- authorization;
- idempotency.

## 124. API Resource Expansion

Resources may expose links or nested references where useful.

The API should avoid excessively deep nesting.

Preferred:

    GET /api/v1/jobs/{job_id}

rather than requiring clients to navigate multiple deeply nested URLs for every field.

## 125. Nested Resources

Nested resources are appropriate when ownership is intrinsic.

Examples:

    /organizations/{id}/members
    /projects/{id}/artifacts

But excessive nesting should be avoided.

## 126. API Naming Conventions

Use consistent `snake_case` or `camelCase` according to the selected API convention.

The convention must be standardized in OpenAPI and applied everywhere.

The current architecture recommends choosing one convention and never mixing styles
within the same API version.

## 127. Timestamp Format

Timestamps should use ISO 8601 / RFC 3339 format.

Example:

    2026-10-08T12:00:00Z

Server-side persistence uses UTC timestamps.

## 128. Enumerations

Enums should be documented.

Clients should be designed to tolerate unknown future enum values where practical.

Lifecycle enums are especially important because new states may be introduced.

## 129. Nullability

The contract should clearly distinguish:

- missing;
- null;
- empty string;
- empty array.

Ambiguous optional field behavior should be avoided.

## 130. API Filtering by Tenant

Tenant scope should normally be implicit from authentication.

For example:

    GET /api/v1/projects

should return only projects accessible to the authenticated context.

A client should not need to provide `organization_id` to establish authorization.

## 131. Administrative Cross-Tenant Access

Administrators with appropriate privileges may have cross-organization operational views.

Such access must be:

- explicitly authorized;
- auditable;
- restricted;
- visible in audit records.

## 132. Object Storage URLs

When an API returns a download/upload URL:

- it should be short-lived;
- scoped;
- non-public;
- tied to authorized object access.

The API should not return permanent bucket credentials.

## 133. Upload Completion

For artifact upload, a completion operation may confirm:

- object exists;
- expected size;
- checksum;
- artifact metadata.

Example:

    POST /api/v1/artifacts/{artifact_id}/complete

This operation should be idempotent.

## 134. Artifact Validation Status

Example states:

    CREATED
    UPLOADING
    UPLOADED
    VALIDATING
    VALID
    INVALID
    REVOKED
    DELETED

The exact lifecycle must remain consistent with the artifact architecture.

## 135. Booking State

Example states:

    QUOTED
    PENDING
    CONFIRMED
    ACTIVE
    COMPLETED
    CANCELLED
    EXPIRED

The API must define which transitions are legal.

## 136. Result State

Example states:

    PENDING
    COLLECTING
    AVAILABLE
    PARTIAL
    FAILED

Results should remain linked to the execution run.

## 137. API and Credits

Credit operations should expose enough information for the user to understand
consumption without exposing internal financial implementation.

Example:

    {
        "platform_id": "humanoid-a",
        "credits_used": 450,
        "credit_plan_id": "developer"
    }

## 138. API and Safety

The API must explicitly communicate safety semantics.

For example, job stop documentation must state:

    "Stops the RaaS application execution. This operation is not a physical
    emergency-stop command."

This distinction must be reflected in Studio UI as well.

## 139. API and Lab Protocol

The public API does not expose:

- raw EtherCAT commands;
- arbitrary robot shell commands;
- raw motor commands;
- unrestricted device access.

Instead:

    Public API
       |
       v
    Job / Run Domain
       |
       v
    Lab Protocol
       |
       v
    Lab Agent
       |
       v
    Kritva Runtime

## 140. API and Local Build

Local build remains outside the cloud API for the initial architecture.

The Studio performs:

    Source
      |
      v
    Local Build
      |
      v
    Test
      |
      v
    .krv Artifact

The cloud receives the resulting artifact.

## 141. Future Build API

The architecture reserves future commands:

    build.validate
    build.configure
    build.start
    build.status
    build.logs
    build.cancel
    build.result

These do not require the initial product to provide a remote build farm.

## 142. API Contract Testing

Contract tests should verify:

- status codes;
- schema;
- required fields;
- error codes;
- authorization;
- pagination;
- idempotency;
- lifecycle transitions.

## 143. Integration Testing

Integration tests should cover:

    Studio
       |
       v
    API
       |
       v
    Database
       |
       v
    Queue
       |
       v
    Worker

Execution tests should extend through a mock Lab Agent.

## 144. End-to-End Testing

Representative E2E flow:

    Login
      |
      v
    Create Project
      |
      v
    Register Artifact
      |
      v
    Validate Artifact
      |
      v
    Query Availability
      |
      v
    Create Booking
      |
      v
    Create Job
      |
      v
    Start Job
      |
      v
    Observe WebSocket
      |
      v
    Complete
      |
      v
    Query Results

## 145. API Contract CI

CI should validate:

- OpenAPI syntax;
- schema validity;
- generated clients;
- breaking changes;
- contract tests;
- endpoint tests;
- authentication tests.

## 146. API Security Testing

Security testing should cover:

- authentication bypass;
- authorization bypass;
- tenant isolation;
- ID enumeration;
- rate limiting;
- malformed requests;
- oversized requests;
- token misuse;
- replay;
- idempotency abuse;
- WebSocket subscription authorization.

## 147. WebSocket Security Testing

Tests should verify that a user cannot subscribe to:

- another organization's job;
- another organization's telemetry;
- another organization's logs;
- another lab's private resources.

## 148. API Abuse Protection

The API edge should protect against:

- request floods;
- repeated login attempts;
- expensive availability queries;
- WebSocket connection floods;
- oversized payloads;
- repeated execution commands.

## 149. API Deprecation

Deprecated endpoints should have:

- documented replacement;
- deprecation date;
- removal target;
- migration guidance.

Breaking removal requires major-version policy.

## 150. API Change Process

A contract change should follow:

    Requirement
       |
       v
    Architecture Review
       |
       v
    OpenAPI Update
       |
       v
    Contract Tests
       |
       v
    Implementation
       |
       v
    Client Update
       |
       v
    Compatibility Review
       |
       v
    Release

## 151. Phase Mapping

| Phase | API Scope | Primary Outcome |
|---|---|---|
| Phase 0 | Contract foundation | API baseline |
| Phase 1 | Identity/projects | Studio connectivity |
| Phase 2 | Artifacts | Artifact workflow |
| Phase 3 | Jobs/runs | Execution control |
| Phase 4 | Booking/credits | Commercial workflow |
| Phase 5 | Execution/lab | End-to-end control |
| Phase 6 | Lab/resources | Physical integration |
| Phase 7 | Realtime/results | Full observation |
| Phase 8 | Production | Hardened API |

## 152. P0 FOUNDATION — API Foundation

Deliver:

- `/api/v1/`;
- OpenAPI baseline;
- common response/error schemas;
- authentication contract;
- request IDs;
- pagination convention;
- shared contracts package.

Acceptance:

- OpenAPI validates;
- common schemas are reusable;
- API version is defined;
- contract tests run in CI.

## 153. Phase 1 — Identity and Projects

Deliver:

- authentication integration;
- user endpoint;
- organization endpoint;
- membership endpoint;
- project CRUD;
- tenant authorization.

Acceptance:

- users can authenticate;
- organizations are isolated;
- projects are accessible only to authorized users.

## 154. P2 BUILD & ARTIFACT — Artifacts

Deliver:

- artifact registration;
- upload authorization;
- upload completion;
- validation;
- artifact status;
- artifact download authorization.

Acceptance:

- artifact lifecycle works;
- unauthorized artifacts are rejected;
- large binaries do not require API proxying.

## 155. Phase 3 — Jobs and Execution

Deliver:

- job API;
- run API;
- asynchronous lifecycle;
- idempotent execution commands;
- WebSocket job events.

Acceptance:

- job creation is idempotent;
- start cannot duplicate execution;
- lifecycle events are delivered;
- REST remains authoritative.

## 156. P4 BOOKING & COMMERCIAL

Deliver:

- availability;
- quotes;
- bookings;
- credits;
- refunds where applicable.

Acceptance:

- booking conflicts are prevented;
- credit consumption is atomic;
- financial operations are idempotent;
- booking state is auditable.

## 157. P5 EXECUTION Integration

Deliver:

- job scheduling;
- resource allocation;
- Lab Protocol integration;
- run state;
- execution errors.

Acceptance:

- authorized jobs reach the Lab Agent;
- resource allocation is enforced;
- failures are represented correctly.

## 158. P6 LAB & ROBOT — Physical Lab

Deliver:

- lab resources;
- agent status;
- resource health;
- platform compatibility;
- physical execution APIs.

Acceptance:

- physical resources are discoverable;
- only compatible jobs execute;
- safety state is visible;
- physical safety review remains independent.

## 159. P7 LIVE & RESULTS

Deliver:

- realtime telemetry;
- logs;
- video signaling;
- result APIs;
- WebSocket subscriptions.

Acceptance:

- live execution can be observed;
- reconnect works;
- missed events can be reconciled through REST;
- results are downloadable.

## 160. P8 PRODUCTION

Deliver:

- API gateway hardening;
- rate limiting;
- WAF;
- audit;
- contract compatibility checks;
- production observability;
- API deprecation process;
- disaster recovery procedures.

Acceptance:

- production traffic is protected;
- API availability is monitored;
- security controls are validated;
- breaking changes are controlled.

## 161. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Breaking API change | High | Versioning + contract tests |
| Tenant data leakage | Critical | Server-side authorization |
| Duplicate booking | Critical | Idempotency + DB constraints |
| Duplicate execution | Critical | Idempotency + state validation |
| WebSocket stale state | High | REST reconciliation |
| Event loss | High | Durable state + reconciliation |
| API abuse | High | Rate limiting + WAF |
| Excessive polling | Medium | WebSocket events |
| Large binary upload | High | Object storage |
| Long HTTP request | Medium | Async operations |
| Authorization bypass | Critical | Central authorization |
| Contract drift | High | OpenAPI + CI |
| Token leakage | Critical | Secure token handling |
| WebSocket data leakage | Critical | Subscription authorization |
| Resource race | Critical | Transactional allocation |
| Credit race | Critical | Atomic ledger operations |

## 162. Risk: Contract Drift

Mitigation:

- OpenAPI source control;
- generated clients;
- contract tests;
- breaking-change detection;
- API review.

## 163. Risk: Tenant Leakage

Mitigation:

- authenticated context;
- organization-aware repositories;
- authorization checks;
- tenant isolation tests;
- optional database-level defense-in-depth.

## 164. Risk: Duplicate Execution

Mitigation:

- idempotency keys;
- durable job state;
- run identity;
- resource locks;
- reconciliation.

## 165. Risk: WebSocket Event Loss

Mitigation:

- durable domain state;
- event IDs;
- REST state recovery;
- optional future event replay.

## 166. Risk: API Abuse

Mitigation:

- rate limiting;
- WAF;
- request limits;
- endpoint-specific quotas;
- authentication throttling;
- monitoring.

## 167. Risk: API Becomes Robot Control Interface

Mitigation:

- public API exposes job/run abstractions;
- Lab Protocol remains separate;
- raw hardware operations are not exposed;
- real-time control remains local.

## 168. Risk: Excessive API Coupling

Mitigation:

- application services;
- domain contracts;
- repository boundaries;
- OpenAPI contracts;
- no direct database access from clients.

## 169. Open Questions

1. Which identity provider will be used?
2. JWT or opaque access tokens?
3. What exact token lifetime is appropriate?
4. Which roles are required initially?
5. Will organization selection be explicit in sessions?
6. Which API naming convention will be finalized?
7. Which API schema validation library will be used?
8. Where will the canonical OpenAPI document live?
9. Will TypeScript clients be generated automatically?
10. Will backend and Studio share generated schemas?
11. Which WebSocket transport implementation will be used?
12. Will event replay be required for production?
13. What is the exact default page size?
14. What is the maximum page size?
15. Which endpoints require cursor pagination?
16. What are the initial rate limits?
17. Which operations require mandatory idempotency?
18. How long will idempotency records be retained?
19. Will ETags/version fields be used for concurrency?
20. Which error codes are contractual and immutable?
21. Will API gateway or application own rate limiting?
22. What WAF will be used?
23. Will API keys be supported for future integrations?
24. Will service accounts be supported?
25. What external integration scope is planned?
26. What telemetry rate is acceptable over WebSocket?
27. Will WebRTC signaling use the same WebSocket channel?
28. What exact video authorization model will be used?
29. What event replay mechanism, if any, will be implemented?
30. What API SLA is required for production?
31. What API RPO/RTO requirements apply?
32. What exact deprecation window will be supported?

## 170. API Architectural Invariants

The following invariants must remain true:

1. Public API is versioned.
2. REST is the authoritative resource interface.
3. WebSocket is a realtime observation interface.
4. PostgreSQL remains authoritative for structured business state.
5. WebSocket events are not the system of record.
6. Long-running operations are asynchronous.
7. Side-effecting operations are idempotent where required.
8. Authorization is server-side.
9. Tenant isolation is enforced server-side.
10. Resource IDs are opaque and stable.
11. Pagination semantics are documented.
12. Error codes are machine-readable.
13. HTTP status and application error codes remain distinct.
14. Large binaries use object storage.
15. Public API does not expose raw robot control.
16. Lab Protocol remains distinct from user-facing API.
17. WebSocket subscriptions are authorization-controlled.
18. Missed realtime events can be recovered through REST.
19. API contracts are version-controlled.
20. Breaking changes require explicit versioning.
21. API handlers do not directly access PostgreSQL.
22. Application services own transaction boundaries.
23. API requests have correlation identifiers.
24. Sensitive data is never logged.
25. Physical safety is never delegated to the cloud API.

## 171. Full Acceptance Criteria Checklist

### API Foundation

- [ ] `/api/v1/` is implemented.
- [ ] OpenAPI contract exists.
- [ ] OpenAPI validates in CI.
- [ ] Common request conventions are documented.
- [ ] Common response envelope is documented.
- [ ] Request IDs are supported.
- [ ] Timestamp format is standardized.
- [ ] Identifier format is standardized.
- [ ] Naming convention is standardized.

### Authentication

- [ ] Authentication provider is integrated.
- [ ] Access tokens are validated.
- [ ] Tokens are transmitted securely.
- [ ] Expired tokens are rejected.
- [ ] Invalid tokens are rejected.
- [ ] Session context is established.
- [ ] Authentication failures use consistent errors.
- [ ] Refresh behavior is defined where applicable.

### Authorization

- [ ] Authorization is server-side.
- [ ] Organization membership is enforced.
- [ ] Resource ownership is enforced.
- [ ] Role permissions are enforced.
- [ ] Administrative operations are restricted.
- [ ] Cross-tenant access is prevented.
- [ ] Authorization failures are audited where appropriate.

### Resources

- [ ] Users are supported.
- [ ] Organizations are supported.
- [ ] Memberships are supported.
- [ ] Projects are supported.
- [ ] Platforms are supported.
- [ ] Artifacts are supported.
- [ ] Bookings are supported.
- [ ] Credits are supported.
- [ ] Jobs are supported.
- [ ] Runs are supported.
- [ ] Results are supported.
- [ ] Labs/resources are supported.
- [ ] Audit resources are supported.

### Pagination

- [ ] Collection APIs support pagination where required.
- [ ] Cursor format is opaque.
- [ ] Default page size is defined.
- [ ] Maximum page size is defined.
- [ ] Stable ordering is defined.
- [ ] `has_more` behavior is defined.
- [ ] `next_cursor` behavior is defined.

### Filtering and Sorting

- [ ] Supported filters are documented.
- [ ] Unsupported filters are rejected.
- [ ] Supported sorting fields are documented.
- [ ] Arbitrary SQL expressions cannot be injected.
- [ ] Search semantics are documented where provided.

### Errors

- [ ] Common error envelope exists.
- [ ] HTTP status mapping is documented.
- [ ] Application error codes exist.
- [ ] Validation errors are structured.
- [ ] Conflict errors are distinguishable.
- [ ] Authentication errors are distinguishable.
- [ ] Authorization errors are distinguishable.
- [ ] Internal implementation details are not exposed.

### Idempotency

- [ ] Idempotency-Key support exists.
- [ ] Booking creation is idempotent.
- [ ] Job creation is idempotent.
- [ ] Execution start is idempotent.
- [ ] Credit operations are idempotent where required.
- [ ] Artifact completion is idempotent.
- [ ] Reuse with different payload is rejected.
- [ ] Idempotency retention is defined.

### Rate Limiting

- [ ] Rate limiting exists.
- [ ] Per-user or token limits exist.
- [ ] Organization-level limits are defined where needed.
- [ ] Expensive endpoints have stricter limits.
- [ ] Execution endpoints are protected.
- [ ] Financial endpoints are protected.
- [ ] HTTP 429 behavior is defined.
- [ ] Retry guidance is provided.

### REST

- [ ] CRUD semantics are consistent.
- [ ] Action endpoints are documented.
- [ ] Long-running operations return 202.
- [ ] Resource lifecycle states are documented.
- [ ] Invalid lifecycle transitions are rejected.
- [ ] Large files use object storage.
- [ ] Object-storage URLs are short-lived.

### WebSocket

- [ ] WebSocket authentication exists.
- [ ] WebSocket authorization exists.
- [ ] Subscription model is defined.
- [ ] Event envelope is defined.
- [ ] Event IDs exist.
- [ ] Event types are documented.
- [ ] Connection reconnect exists.
- [ ] Subscriptions are restored after reconnect.
- [ ] REST reconciliation exists.
- [ ] Backpressure exists.
- [ ] Telemetry rate control exists.
- [ ] Unauthorized subscriptions are rejected.

### Events

- [ ] Artifact events are defined.
- [ ] Booking events are defined.
- [ ] Job lifecycle events are defined.
- [ ] Robot/resource events are defined.
- [ ] Telemetry events are defined.
- [ ] Event ordering semantics are documented.
- [ ] Duplicate events are tolerated by clients.
- [ ] Missed events can be reconciled.

### OpenAPI

- [ ] OpenAPI is version-controlled.
- [ ] All public endpoints are documented.
- [ ] Request schemas are documented.
- [ ] Response schemas are documented.
- [ ] Error schemas are documented.
- [ ] Authentication is documented.
- [ ] Examples are provided.
- [ ] Generated client validation is available.
- [ ] Breaking changes are detected in CI.

### Contract Testing

- [ ] REST contract tests exist.
- [ ] Error contract tests exist.
- [ ] Authentication tests exist.
- [ ] Authorization tests exist.
- [ ] Pagination tests exist.
- [ ] Idempotency tests exist.
- [ ] Rate-limit tests exist.
- [ ] WebSocket contract tests exist.
- [ ] Tenant isolation tests exist.

### Execution Integration

- [ ] Job creation works.
- [ ] Job start works.
- [ ] Job stop works.
- [ ] Job cancel works.
- [ ] Run state is exposed.
- [ ] Resource allocation is enforced.
- [ ] Lab Protocol is separate from public API.
- [ ] Physical safety semantics are documented.
- [ ] Duplicate execution is prevented.

### Observability

- [ ] Request IDs are logged.
- [ ] API latency is measured.
- [ ] API error rates are measured.
- [ ] Authentication failures are measured.
- [ ] Authorization failures are measured.
- [ ] Rate limiting is measured.
- [ ] WebSocket connections are measured.
- [ ] Event delivery is observable.
- [ ] Sensitive data is excluded from logs.

### Security

- [ ] HTTPS is mandatory in production.
- [ ] CORS is restricted.
- [ ] Request size limits exist.
- [ ] Authentication abuse protection exists.
- [ ] Rate limiting exists.
- [ ] WAF is configured where required.
- [ ] Tokens are never logged.
- [ ] Secrets are never returned.
- [ ] Tenant isolation is tested.
- [ ] WebSocket authorization is tested.

### API Lifecycle

- [ ] API deprecation policy exists.
- [ ] Breaking-change policy exists.
- [ ] Migration guidance exists.
- [ ] Version support window is defined.
- [ ] Contract changes require review.
- [ ] Release notes document API changes.

### Phase Completion

- [ ] Phase 0 API foundation is complete.
- [ ] Phase 1 identity/project APIs are complete.
- [ ] Phase 2 artifact APIs are complete.
- [ ] Phase 3 job/run APIs are complete.
- [ ] Phase 4 booking/credit APIs are complete.
- [ ] Phase 5 execution integration is complete.
- [ ] Phase 6 physical lab integration is complete.
- [ ] Phase 7 realtime/results integration is complete.
- [ ] Phase 8 production API hardening is complete.

## 172. Final API Architecture Baseline

The Kritva RaaS API architecture establishes REST as the durable resource-oriented
interface and WebSocket as the realtime observation interface.

The resulting architecture is:

    Kritva RaaS Studio
             |
             | HTTPS
             | WSS
             v
    +-----------------------+
    | API Gateway / Edge    |
    +-----------+-----------+
                |
                v
    +-----------------------+
    | Control Plane API     |
    +-----------+-----------+
                |
        +-------+-------+
        |               |
        v               v
    REST Resources   Realtime Events
        |               |
        v               v
    Application      WebSocket
    Services         Gateway
        |
        +------------------+
        |                  |
        v                  v
    PostgreSQL          Queue/Workers
        |
        +------------------+
                           |
                           v
                       Lab Protocol
                           |
                           v
                       Lab Agent
                           |
                           v
                    Kritva Runtime
                           |
                           v
                         Robot

The REST API answers:

    "What is the current authoritative state?"

The WebSocket layer answers:

    "What has changed recently?"

The application services answer:

    "Is this operation valid and authorized?"

The database answers:

    "What is the durable business state?"

The Lab Protocol answers:

    "How is an authorized execution coordinated with a lab?"

This separation prevents transport protocols from becoming accidental business
boundaries.

The intended primary user flow is:

    Login
      |
      v
    Create Project
      |
      v
    Build Locally
      |
      v
    Generate .krv
      |
      v
    Register Artifact
      |
      v
    Validate Artifact
      |
      v
    Query Availability
      |
      v
    Quote
      |
      v
    Book
      |
      v
    Create Job
      |
      v
    Start Job
      |
      +----------------------+
      |                      |
      v                      v
    REST State           WebSocket Events
      |                      |
      +----------+-----------+
                 |
                 v
             RUNNING
                 |
                 +--> Video
                 +--> Telemetry
                 +--> Logs
                 |
                 v
             COMPLETED
                 |
                 v
              Results

The architecture deliberately keeps these concerns separate:

    REST
      = durable resources and commands

    WebSocket
      = realtime observation

    OpenAPI
      = formal HTTP contract

    Shared Contracts
      = common domain/event types

    PostgreSQL
      = durable business authority

    Object Storage
      = large binary authority

    Queue
      = asynchronous work transport

    Lab Protocol
      = secure lab execution boundary

The API therefore provides the stable software contract required to grow Kritva RaaS
from a development platform into a production multi-lab robotics service.

The core architectural invariants are:

1. API versioning is explicit.
2. REST is authoritative for resource state.
3. WebSocket is not the system of record.
4. Every protected operation is authorized server-side.
5. Tenant isolation is mandatory.
6. Side-effecting operations use idempotency where required.
7. Long-running operations are asynchronous.
8. Large artifacts use object storage.
9. API contracts are version-controlled.
10. Breaking changes require deliberate versioning.
11. WebSocket clients can recover through REST.
12. Resource lifecycle transitions are validated.
13. Booking and credit operations are transactionally protected.
14. Job execution cannot be duplicated through retries.
15. Raw robot control is not exposed through the public API.
16. Lab Protocol remains a separate execution boundary.
17. Physical safety remains local to the robot and lab.
18. All significant operations remain observable and auditable.
