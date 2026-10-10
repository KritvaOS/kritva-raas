# Kritva RaaS Backend Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Backend Architecture |
| Path | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Backend | RaaS Control Plane |
| Architecture | Modular Monolith |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Database | PostgreSQL |
| Object Storage | S3-compatible abstraction |
| Queue | Provider-neutral queue abstraction |
| Workers | Asynchronous background workers |
| Lab Boundary | Secure Lab Agent protocol |
| Primary Authority | Control Plane |
| Initial Deployment | Cloud-hosted modular application |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the production-grade backend architecture for the Kritva RaaS
Control Plane.

The Control Plane is the authoritative backend responsible for managing:

- users;
- organizations;
- authentication context;
- projects;
- robotic platforms;
- artifacts;
- artifact compatibility;
- bookings;
- availability;
- credit wallets;
- credit transactions;
- jobs;
- runs;
- resources;
- labs;
- Lab Agents;
- results;
- audit records;
- realtime events.

The Control Plane coordinates the complete RaaS workflow while keeping robotic real-time
control outside the cloud.

The architectural principle is:

    Studio
      |
      v
    Control Plane
      |
      +--> Database
      +--> Object Storage
      +--> Queue
      +--> Workers
      +--> Lab Agent
      |
      v
    Robot

The Control Plane owns business state and authorization.

It does not own the robot's real-time control loop.

## 3. Scope

This document covers:

1. Backend application architecture.
2. Modular monolith structure.
3. Application layers.
4. Domain modules.
5. Services.
6. Repository interfaces.
7. Database access boundaries.
8. Object storage abstraction.
9. Queue abstraction.
10. Asynchronous workers.
11. REST API.
12. WebSocket/realtime architecture.
13. Authentication and authorization integration.
14. Artifact management.
15. Booking.
16. Credits.
17. Job orchestration.
18. Run tracking.
19. Lab Agent integration.
20. Results.
21. Audit logging.
22. Error handling.
23. Idempotency.
24. Transactions.
25. Concurrency.
26. Observability.
27. Reliability.
28. Scaling.
29. Security.
30. Phase 0-8 implementation mapping.

The following are outside this document's detailed implementation scope:

- React/Tauri implementation;
- PostgreSQL physical infrastructure;
- cloud provider-specific infrastructure;
- robot firmware;
- robot motor-control loops;
- physical emergency-stop implementation;
- Lab Agent hardware internals.

Those areas are defined by their respective architecture documents.

## 4. Architectural Goals

The backend shall:

1. Provide one authoritative Control Plane.
2. Start as a modular monolith.
3. Avoid premature microservice decomposition.
4. Maintain strict module boundaries.
5. Separate transport from business logic.
6. Separate business logic from persistence.
7. Support asynchronous operations.
8. Support horizontal application scaling.
9. Maintain PostgreSQL as authoritative business state.
10. Use object storage for large binary objects.
11. Use queues for asynchronous work.
12. Support secure Lab Agent communication.
13. Provide idempotent side-effecting operations.
14. Provide structured errors.
15. Provide auditability.
16. Provide observability.
17. Support multiple organizations.
18. Support multiple robotic platforms.
19. Support multiple labs.
20. Support simulation and physical execution.
21. Preserve future microservice extraction boundaries.
22. Support production-grade failure recovery.

## 5. Non-Goals

The initial backend is not intended to:

- become a microservice mesh;
- execute robot control loops;
- directly access motor hardware;
- compile arbitrary customer source code;
- expose the database as a public API;
- use the queue as the source of truth;
- use WebSocket state as the source of truth;
- provide direct cloud-to-motor control;
- place business logic inside HTTP handlers;
- tightly couple business logic to a cloud vendor.

## 6. Core Architectural Principle

The backend is a modular monolith.

This means:

    One Deployable Application
              |
              +--------------------------------------+
              |                                      |
        Shared Runtime                         Shared Infrastructure
              |
        +-----+-----+-----+-----+-----+
        |     |     |     |     |     |
       IAM  Project Artifact Booking Credit Job
        |     |     |     |     |     |
        +-----+-----+-----+-----+-----+
              |
        Shared Domain Infrastructure
              |
        PostgreSQL / Storage / Queue

Modules are logically isolated even though they initially execute in the same process.

## 7. Why Modular Monolith

A modular monolith is preferred because:

- the product is early-stage;
- domain boundaries are still evolving;
- transactional consistency is important;
- deployment complexity should remain low;
- debugging is easier;
- local development is simpler;
- infrastructure cost is lower;
- cross-module transactions are easier;
- future service extraction remains possible.

Microservices may be introduced later when there is measurable operational or scaling
justification.

## 8. Backend Layer Architecture

The Control Plane uses these logical layers:

    API / Transport
          |
          v
    Application Services
          |
          v
    Domain Modules
          |
          v
    Repository / Port Interfaces
          |
          +------------------+
          |                  |
          v                  v
    PostgreSQL          External Adapters
                         |      |      |
                       Storage Queue  Lab

The layers are logical boundaries, not necessarily separate deployment units.

## 9. Transport Layer

The transport layer handles:

- HTTP;
- request parsing;
- authentication context;
- authorization invocation;
- validation;
- request IDs;
- response serialization;
- error translation;
- API versioning.

It must not contain business rules.

An HTTP handler should primarily:

1. validate transport input;
2. construct an application request;
3. call an application service;
4. map the result to an API response.

## 10. Application Layer

Application services implement use cases.

Examples:

- CreateProject;
- UploadArtifact;
- ValidateArtifact;
- QuoteBooking;
- CreateBooking;
- CreateJob;
- StartJob;
- StopJob;
- GetRun;
- CreateRefund.

Application services coordinate domain operations and external ports.

They are responsible for:

- workflow orchestration;
- transaction boundaries;
- authorization checks;
- idempotency;
- event publication;
- queue scheduling.

## 11. Domain Layer

Domain modules contain business concepts and rules.

Examples:

- booking cannot overlap;
- artifact must be compatible;
- credits must be sufficient;
- job must reference a valid booking;
- resource must be available;
- cancelled booking cannot start a job;
- completed job cannot be restarted in place.

Business rules must not depend directly on HTTP or cloud SDKs.

## 12. Infrastructure Layer

Infrastructure implements technical ports:

- PostgreSQL repositories;
- object storage;
- queue;
- secrets;
- identity integration;
- observability;
- WebSocket event delivery;
- external Lab Agent transport.

Infrastructure may depend on vendor SDKs.

Domain/application code should not.

## 13. Module Map

The initial Control Plane modules are:

| Module | Primary Responsibility |
|---|---|
| Identity | Authentication context and users |
| Organizations | Tenancy and membership |
| Projects | User project metadata |
| Platforms | Robot/platform catalog |
| Artifacts | Artifact lifecycle |
| Booking | Availability and reservations |
| Credits | Wallets and transactions |
| Jobs | Job lifecycle |
| Scheduler | Queueing and scheduling |
| Resource Allocation | Lab/resource locking |
| Runs | Execution state |
| Results | Execution outputs |
| Lab | Lab Agent management |
| Audit | Security/business audit |
| Events | Internal/realtime event propagation |

Some modules may initially share implementation infrastructure.

## 14. Identity Module

Responsibilities:

- user identity;
- session context;
- external identity-provider integration;
- user status;
- authentication claims.

The Control Plane may delegate authentication to an identity provider.

The backend remains responsible for application authorization.

## 15. Organization Module

Responsibilities:

- organizations;
- memberships;
- roles;
- organization settings;
- tenant boundaries.

Typical roles may include:

- owner;
- admin;
- developer;
- researcher;
- viewer.

Exact role definitions are configurable.

## 16. Project Module

Responsibilities:

- project metadata;
- project ownership;
- organization association;
- project status;
- project archival.

A project does not contain customer source code in the normal RaaS model.

It references artifacts and remote execution history.

## 17. Platform Module

Responsibilities:

- platform catalog;
- platform versions;
- architecture;
- capabilities;
- runtime compatibility;
- supported SDK versions;
- resource profiles;
- credit-plan association.

A platform represents a robotic execution target.

## 18. Artifact Module

Responsibilities:

- artifact registration;
- metadata;
- upload lifecycle;
- checksum;
- signature metadata;
- compatibility;
- validation status;
- retention;
- deletion policy.

Artifact binary data is stored in object storage.

PostgreSQL stores authoritative metadata.

## 19. Booking Module

Responsibilities:

- availability;
- booking quotes;
- reservation;
- modification;
- cancellation;
- booking lifecycle;
- cancellation policy.

Booking is the authoritative reservation for a resource/time window.

## 20. Credit Module

Responsibilities:

- credit wallets;
- credit plans;
- platform-specific credit types;
- balances;
- reservations;
- consumption;
- refunds;
- transaction history.

Credits must be represented as immutable financial-style transactions.

Balance may be derived or maintained transactionally.

## 21. Job Module

Responsibilities:

- job creation;
- job lifecycle;
- artifact association;
- booking association;
- execution request;
- cancellation;
- timeout;
- failure.

Job represents an execution request.

## 22. Run Module

A Run represents an execution instance.

A job may produce one or more execution records depending on retry/recovery semantics.

The Run records:

- start;
- stop;
- status;
- runtime;
- platform;
- lab;
- resource;
- metrics;
- execution metadata.

## 23. Scheduler Module

The Scheduler determines when eligible jobs may execute.

Inputs include:

- booking;
- availability;
- platform;
- resource;
- lab;
- priority;
- job state.

The Scheduler must not directly manipulate robot hardware.

## 24. Resource Allocation Module

Responsibilities:

- resource discovery;
- resource reservation;
- resource locking;
- release;
- conflict prevention.

Resources may represent:

- robot;
- simulator;
- GPU host;
- lab slot;
- execution environment.

## 25. Lab Module

Responsibilities:

- Lab Agent registration;
- identity;
- capabilities;
- heartbeat;
- health;
- resource inventory;
- command dispatch;
- execution state;
- telemetry ingress;
- result ingress.

The Lab module is the Control Plane boundary to physical labs.

## 26. Results Module

Responsibilities:

- result metadata;
- result files;
- metrics;
- summaries;
- retention;
- downloads;
- run association.

Large result files are stored in object storage.

## 27. Audit Module

Audit records security-sensitive and business-critical operations.

Examples:

- login;
- role changes;
- artifact upload;
- artifact deletion;
- booking creation;
- booking cancellation;
- credit transactions;
- job start;
- job stop;
- administrative changes.

Audit records should be append-oriented and protected from ordinary mutation.

## 28. Events Module

The Events module provides internal domain/application events.

Examples:

    ArtifactAccepted
    BookingConfirmed
    CreditsReserved
    JobQueued
    JobStarted
    JobCompleted
    RunFailed
    RobotOffline

Events may be consumed by:

- WebSocket publisher;
- notifications;
- audit;
- analytics;
- workers.

## 29. Module Dependency Rules

Dependencies should generally follow:

    API
      |
      v
    Application
      |
      v
    Domain
      |
      v
    Ports
      |
      v
    Infrastructure

Modules should not directly access another module's database tables merely because they
are in the same PostgreSQL database.

Cross-module interaction should use:

- application services;
- domain interfaces;
- explicit module contracts.

## 30. Repository Pattern

Repositories abstract authoritative structured data access.

Examples:

    UserRepository
    OrganizationRepository
    ProjectRepository
    PlatformRepository
    ArtifactRepository
    BookingRepository
    CreditRepository
    JobRepository
    RunRepository
    ResultRepository
    LabRepository
    ResourceRepository

Repository interfaces belong to application/domain boundaries.

Implementations belong to infrastructure.

## 31. Repository Interface Principles

Repositories should:

- expose domain-oriented operations;
- avoid leaking SQL;
- avoid exposing ORM models;
- support explicit transaction boundaries;
- support pagination;
- support optimistic/concurrency controls;
- return domain/application models.

They should not become generic "execute SQL" wrappers.

## 32. Example Repository Interface

Conceptually:

    interface BookingRepository {
        get(id)
        findAvailability(platformId, start, end)
        create(booking)
        update(booking)
        cancel(id)
    }

The exact implementation technology is intentionally unspecified.

## 33. Transaction Boundary

Transactions should be owned by application use cases.

Example:

    CreateBooking
        |
        +--> validate user
        +--> validate platform
        +--> validate availability
        +--> reserve credits
        +--> create booking
        +--> write audit
        +--> commit
        +--> publish event

Critical business state must be committed atomically where required.

## 34. PostgreSQL Authority

PostgreSQL is the authoritative source for structured transactional state.

It owns:

- users/application identity references;
- organizations;
- projects;
- platforms;
- artifacts metadata;
- bookings;
- credit transactions;
- jobs;
- runs;
- labs;
- resources;
- results metadata;
- audit records.

Object storage is not a substitute for relational business state.

## 35. Object Storage

Object storage is used for:

- `.krv` artifacts;
- videos;
- logs;
- telemetry exports;
- result files;
- diagnostic bundles.

The backend stores:

- object key;
- size;
- checksum;
- content type;
- owner;
- lifecycle state.

## 36. Object Storage Interface

Conceptually:

    ObjectStorage
        put()
        get()
        delete()
        exists()
        head()
        generateUploadUrl()
        generateDownloadUrl()

The application does not depend on a specific cloud provider.

## 37. Queue Architecture

The queue is used for asynchronous work.

Examples:

- artifact validation;
- artifact processing;
- booking notifications;
- job scheduling;
- deployment;
- result processing;
- telemetry processing;
- cleanup;
- reconciliation.

The queue is transient infrastructure.

PostgreSQL remains authoritative.

## 38. Queue Interface

Conceptually:

    JobQueue
        enqueue(message)
        dequeue()
        acknowledge(message)
        reject(message)
        retry(message)

The implementation may use a managed queue or compatible messaging system.

## 39. Queue Message

A conceptual message:

    {
        "message_id": "msg-123",
        "type": "job.start.requested",
        "version": 1,
        "created_at": "2026-10-08T12:00:00Z",
        "correlation_id": "job-123",
        "payload": {
            "job_id": "job-123"
        }
    }

Queue messages should reference authoritative entities rather than duplicating large state.

## 40. Worker Architecture

Workers process asynchronous tasks.

Examples:

    ArtifactWorker
    SchedulerWorker
    JobWorker
    LabWorker
    ResultWorker
    CleanupWorker

Workers may run from the same application codebase as separate processes/deployments.

## 41. Worker Principles

Workers must:

- be idempotent;
- tolerate duplicate delivery;
- use bounded retries;
- record failures;
- acknowledge only after durable completion;
- avoid long uncontrolled transactions;
- emit state changes.

## 42. Worker Failure Model

A worker can:

- crash;
- timeout;
- lose network;
- lose database connection;
- lose Lab Agent connection;
- receive duplicate message.

The system must remain recoverable.

Example:

    Queue
      |
      v
    Worker
      |
    failure
      |
      v
    Retry
      |
      +--> success
      |
      +--> retry limit
                |
                v
             Dead Letter

## 43. Idempotency

Idempotency is mandatory for operations with side effects.

Examples:

- booking creation;
- job creation;
- job start;
- artifact upload registration;
- credit operations;
- payment operations;
- refunds.

An idempotency key should be associated with the logical request.

## 44. Idempotency Store

Idempotency state may be stored in PostgreSQL.

Conceptual data:

    idempotency_key
    actor_id
    operation
    request_hash
    status
    response_reference
    created_at
    expires_at

A reused key with a different request payload must be rejected.

## 45. Concurrency Control

The backend must protect:

- booking slots;
- credit balance;
- resource allocation;
- job state transitions.

Possible controls include:

- database constraints;
- row locking;
- optimistic version numbers;
- unique indexes;
- transactional updates.

## 46. Booking Conflict Prevention

Availability must be protected transactionally.

The backend must not rely on:

    query availability
    then later insert booking

without concurrency protection.

The reservation operation must atomically prevent conflicting bookings.

## 47. Credit Consistency

Credit operations must be transactional.

A booking or job must not consume the same credits twice.

Credit transactions should record:

- wallet;
- platform;
- operation;
- amount;
- direction;
- reference;
- timestamp;
- actor.

## 48. Platform-Specific Credits

Credit wallets are associated with platform/credit type.

Example:

    Humanoid-A Developer Credits
    Humanoid-B Research Credits

Credits are not assumed transferable between platforms.

The backend owns the authoritative credit policy.

## 49. API Architecture

The public API is versioned:

    /api/v1/

The API is REST-oriented for request/response operations.

WebSocket is used for realtime events.

Large files use object-storage transfer paths where appropriate.

## 50. API Surface

Identity:

    POST /api/v1/auth/login
    POST /api/v1/auth/logout
    POST /api/v1/auth/refresh
    GET  /api/v1/auth/me

Projects:

    POST /api/v1/projects
    GET  /api/v1/projects
    GET  /api/v1/projects/{id}
    PATCH /api/v1/projects/{id}
    POST /api/v1/projects/{id}/archive

Platforms:

    GET /api/v1/platforms
    GET /api/v1/platforms/{id}
    GET /api/v1/platforms/{id}/capabilities
    POST /api/v1/platforms/{id}/compatibility

Artifacts:

    POST /api/v1/artifacts
    GET /api/v1/artifacts
    GET /api/v1/artifacts/{id}
    POST /api/v1/artifacts/{id}/validate
    DELETE /api/v1/artifacts/{id}

Bookings:

    GET /api/v1/availability
    POST /api/v1/bookings/quote
    POST /api/v1/bookings
    GET /api/v1/bookings
    GET /api/v1/bookings/{id}
    PATCH /api/v1/bookings/{id}
    POST /api/v1/bookings/{id}/cancel

Credits:

    GET /api/v1/credits/balance
    POST /api/v1/credits/quote
    GET /api/v1/credits/transactions

Jobs:

    POST /api/v1/jobs
    GET /api/v1/jobs
    GET /api/v1/jobs/{id}
    POST /api/v1/jobs/{id}/start
    POST /api/v1/jobs/{id}/stop
    POST /api/v1/jobs/{id}/cancel

Runs:

    GET /api/v1/runs
    GET /api/v1/runs/{id}
    GET /api/v1/runs/{id}/status
    GET /api/v1/runs/{id}/metrics
    GET /api/v1/runs/{id}/logs
    POST /api/v1/runs/{id}/stop

Results:

    GET /api/v1/results
    GET /api/v1/results/{id}
    GET /api/v1/results/{id}/files
    GET /api/v1/results/{id}/download

## 51. Lab API Surface

Lab Agent communication is a separate secured protocol.

Conceptual operations:

    agent.register
    agent.heartbeat
    agent.status
    agent.capabilities
    agent.resources
    agent.job.status
    agent.telemetry
    agent.logs
    agent.result

    artifact.fetch
    deployment.prepare
    deployment.start
    deployment.stop

    job.start
    job.stop
    job.cancel

    resource.lock
    resource.release

The Lab Agent protocol is not the same as the public Studio API.

## 52. API Request Envelope

A common logical request context includes:

    protocol_version
    request_id
    timestamp
    actor
    organization_id
    correlation_id
    idempotency_key

A representative request is:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T12:00:00Z",
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

## 53. API Response Model

A representative response is:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T12:00:01Z",
        "status": "SUCCESS",
        "code": "ARTIFACT_ACCEPTED",
        "message": "Artifact accepted",
        "data": {},
        "error": null
    }

The external HTTP status code and application status remain conceptually distinct.

## 54. HTTP Status Model

Typical mappings:

| HTTP | Meaning |
|---|---|
| 200 | Successful operation |
| 201 | Resource created |
| 202 | Accepted asynchronous operation |
| 204 | Successful operation without body |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 422 | Business validation failure |
| 429 | Rate limited |
| 500 | Internal error |
| 502 | External dependency failure |
| 503 | Temporarily unavailable |
| 504 | External timeout |

## 55. Application Error Model

Errors should have stable machine-readable codes.

Examples:

    INVALID_REQUEST
    UNAUTHORIZED
    FORBIDDEN
    NOT_FOUND
    CONFLICT
    ARTIFACT_INVALID
    ARTIFACT_INCOMPATIBLE
    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    PLATFORM_UNAVAILABLE
    RESOURCE_UNAVAILABLE
    JOB_INVALID_STATE
    LAB_UNAVAILABLE
    INTERNAL_ERROR

Messages should be useful without exposing internal implementation details.

## 56. Error Structure

A representative error is:

    {
        "status": "ERROR",
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is not compatible with selected platform",
        "error": {
            "details": {
                "required_architecture": "aarch64",
                "artifact_architecture": "x86_64"
            }
        }
    }

Sensitive internal details must not be returned.

## 57. Domain Error Mapping

Domain errors should map consistently.

Example:

    BookingConflict
        |
        v
    HTTP 409
        |
        v
    BOOKING_CONFLICT

    InsufficientCredits
        |
        v
    HTTP 422
        |
        v
    INSUFFICIENT_CREDITS

The transport layer owns mapping.

## 58. Async API Model

Long-running operations should return quickly.

Example:

    POST /jobs/{id}/start
          |
          v
    202 Accepted
          |
          v
    job_id
          |
          v
    background processing

State progression:

    CREATED
      |
      v
    QUEUED
      |
      v
    VALIDATING
      |
      v
    ALLOCATING
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
      +--> STOPPING
      |       |
      |       v
      |    COMPLETED
      |
      +--> FAILED
      |
      +--> CANCELLED
      |
      +--> TIMEOUT

## 59. Job State Authority

PostgreSQL is authoritative for job state.

Queue messages trigger work.

Workers update state.

WebSocket publishes state changes.

The UI reconciles against API state.

Therefore:

    Database = Authority
    Queue = Work Transport
    WebSocket = Notification Transport

## 60. WebSocket Architecture

The WebSocket service publishes:

- job state;
- run state;
- robot state;
- telemetry;
- logs;
- relevant platform/lab events.

The WebSocket service must not become a second database.

## 61. WebSocket Subscription

Subscriptions should be scoped.

Examples:

    job:{job_id}
    run:{run_id}
    project:{project_id}

Authorization must be checked before a user receives private events.

## 62. Event Ordering

Events may be delayed, duplicated, or lost during reconnect.

Events should include:

- event ID;
- timestamp;
- entity ID;
- entity version or sequence where useful.

Clients must be able to re-fetch authoritative state.

## 63. Lab Agent Architecture

The Lab Agent is the secure execution boundary between cloud services and the physical lab.

Architecture:

    Control Plane
          |
          | Secure Lab Protocol
          v
      Lab Agent
          |
          +--> Resource Manager
          +--> Artifact Manager
          +--> Deployment Manager
          +--> Runtime Manager
          +--> Telemetry
          +--> Logs
          |
          v
       Robot / Simulator

The Control Plane does not directly connect to robot hardware.

## 64. Lab Agent Authentication

Each Lab Agent must have a unique identity.

The backend should validate:

- agent identity;
- credential/certificate;
- lab membership;
- status;
- protocol version.

Revoked agents must not receive new work.

## 65. Agent Heartbeat

Lab Agents periodically report:

- agent ID;
- version;
- lab;
- health;
- resource status;
- capabilities;
- timestamp.

The Control Plane tracks last-seen state.

An agent that stops heartbeating becomes unavailable for new allocation.

## 66. Resource Locking

Resource allocation should be explicit.

Conceptually:

    Request Job
       |
       v
    Find Compatible Resource
       |
       v
    Lock Resource
       |
       v
    Dispatch
       |
       v
    Execute
       |
       v
    Release Resource

Resource locking must survive duplicate worker messages.

## 67. Artifact Deployment

Deployment flow:

    Job
      |
      v
    Validate Artifact
      |
      v
    Allocate Resource
      |
      v
    Lab Agent
      |
      v
    Fetch Artifact
      |
      v
    Verify Checksum/Signature
      |
      v
    Prepare Runtime
      |
      v
    Start

## 68. Execution Safety Boundary

The Control Plane can:

- authorize;
- schedule;
- allocate;
- start;
- stop;
- cancel.

It cannot replace physical safety systems.

Physical emergency stop remains authoritative.

A cloud failure must never be interpreted as a safe physical stop.

## 69. Result Ingestion

Result flow:

    Robot Runtime
        |
        v
    Lab Agent
        |
        v
    Control Plane
        |
        +--> PostgreSQL metadata
        |
        +--> Object Storage
        |
        v
    Result Available

Large result data should not be stored directly in PostgreSQL.

## 70. Telemetry Handling

Telemetry may be high volume.

The backend should distinguish:

- control-plane state;
- operational telemetry;
- raw telemetry;
- summarized telemetry.

The initial implementation should avoid forcing all raw high-frequency telemetry
through transactional PostgreSQL tables.

Streaming or object storage may be used where appropriate.

## 71. Observability Architecture

The backend must provide:

- structured logs;
- metrics;
- traces;
- health checks;
- dependency status;
- audit records.

Conceptually:

    Request
       |
       +--> Log
       +--> Metric
       +--> Trace
       |
       v
    Application Service
       |
       +--> Database
       +--> Queue
       +--> Storage
       +--> Lab Agent

## 72. Structured Logging

Logs should contain:

    timestamp
    level
    service
    module
    operation
    request_id
    correlation_id
    actor_id
    organization_id
    job_id
    run_id
    duration
    result
    error_code

Sensitive data must be excluded.

## 73. Metrics

Important metrics include:

### API

- request count;
- latency;
- error rate;
- status code distribution.

### Workers

- queue depth;
- processing latency;
- retry count;
- failure count.

### Booking

- booking conflicts;
- allocation latency;
- cancellation rate.

### Credits

- transactions;
- failed transactions;
- reconciliation failures.

### Jobs

- queued jobs;
- running jobs;
- success rate;
- failure rate;
- execution duration.

### Lab

- online agents;
- offline agents;
- heartbeat latency;
- resource utilization.

## 74. Distributed Tracing

Tracing should follow:

    Studio Request
        |
        v
    API
        |
        v
    Application Service
        |
        +--> DB
        +--> Queue
        |
        v
    Worker
        |
        v
    Lab Agent

Correlation IDs must cross asynchronous boundaries.

## 75. Health Endpoints

Recommended endpoints:

    GET /health/live
    GET /health/ready

Liveness indicates that the process is alive.

Readiness indicates that required dependencies are sufficiently available.

Health endpoints should not expose sensitive details.

## 76. Dependency Health

Readiness may consider:

- PostgreSQL;
- queue;
- object storage;
- required configuration.

Optional dependencies should not unnecessarily make the entire application unavailable.

## 77. Auditability

Every security-sensitive or business-critical action should produce an audit record.

Audit records should include:

- actor;
- organization;
- action;
- entity;
- timestamp;
- outcome;
- correlation ID;
- relevant metadata.

Audit data must not contain secrets or full artifact contents.

## 78. Security Architecture

Security controls include:

- TLS;
- authentication;
- authorization;
- organization isolation;
- least privilege;
- secure secrets;
- input validation;
- rate limiting;
- audit logging;
- object access controls;
- signed artifacts;
- secure Lab Agent authentication.

## 79. Multi-Tenancy

Organization ID must be present in tenant-scoped operations.

Every tenant-scoped repository query must enforce organization isolation.

A user must never be able to retrieve another organization's:

- project;
- artifact;
- booking;
- credits;
- job;
- run;
- result.

## 80. Authorization

Authorization should occur at the application/domain boundary.

Checks include:

- user identity;
- organization membership;
- role;
- resource ownership;
- project access;
- platform permissions;
- administrative privilege.

UI hiding is not authorization.

## 81. API Rate Limiting

Rate limiting should protect:

- authentication;
- expensive API operations;
- artifact operations;
- job operations;
- administrative endpoints.

Rate limits may differ by:

- user;
- organization;
- endpoint;
- IP;
- operation.

## 82. Artifact Security

Artifact validation must include:

- checksum;
- signature;
- format;
- platform;
- architecture;
- runtime compatibility;
- SDK compatibility;
- capability policy;
- size limits.

An artifact that fails validation must not reach the Lab Agent.

## 83. Object Access Security

Artifacts and results should not be publicly accessible.

Preferred flow:

    Authorized API Request
          |
          v
    Authorization
          |
          v
    Short-lived Signed URL
          |
          v
    Object Storage

Object keys should not be treated as authorization.

## 84. Data Retention

Retention policies should exist for:

- artifacts;
- logs;
- videos;
- telemetry;
- results;
- audit records.

Retention may differ by:

- organization;
- plan;
- artifact type;
- regulatory requirement.

## 85. Database Migration

Database schema changes must use versioned migrations.

Migration requirements:

- forward migration;
- rollback strategy where practical;
- compatibility review;
- staging validation;
- production gate.

Destructive migrations should be carefully phased.

## 86. API Compatibility

API versioning uses:

    /api/v1/

Backward-compatible additions remain within the major version.

Breaking changes require a new major version.

The backend should avoid breaking existing Studio versions unnecessarily.

## 87. Protocol Compatibility

Compatibility applies to:

- Studio;
- Control Plane;
- Lab Agent;
- artifact format;
- KritvaOS runtime;
- SDK;
- platform version.

Compatibility must be explicit rather than assumed.

## 88. Configuration

Backend configuration should be externalized.

Examples:

- database URL;
- object storage endpoint;
- queue endpoint;
- identity configuration;
- signing configuration;
- feature flags;
- retention policy.

Secrets must come from secure secret management.

## 89. Feature Flags

Feature flags may control:

- new platform;
- new credit plan;
- beta feature;
- new execution mode;
- rollout percentage.

Flags must not be used to bypass safety or authorization.

## 90. Backend Deployment Model

Initial topology:

    +-----------------------------+
    | Load Balancer / API Gateway |
    +-------------+---------------+
                  |
          +-------+-------+
          |               |
          v               v
    Control Plane      Control Plane
       Instance           Instance
          |               |
          +-------+-------+
                  |
        +---------+----------+
        |         |          |
        v         v          v
    PostgreSQL  Queue    Object Storage
                  |
                  v
               Workers
                  |
                  v
              Lab Agents

The application remains a modular monolith even when horizontally replicated.

## 91. Worker Deployment

Workers may be deployed independently from API instances.

This allows:

- worker scaling;
- queue-based backpressure;
- different resource profiles;
- independent restart.

Workers still use the same application modules and contracts.

## 92. Horizontal Scaling

The Control Plane should remain stateless at the application layer.

Persistent state belongs in:

- PostgreSQL;
- object storage;
- queue;
- external identity system.

In-memory state should not be required for correctness.

## 93. Session State

Session/authentication state should not depend on a specific application instance.

A request may reach any healthy backend instance.

## 94. WebSocket Scaling

WebSocket delivery may require shared event propagation when multiple backend instances
are deployed.

The architecture must therefore support a shared event mechanism where necessary.

The exact implementation may use:

- broker;
- pub/sub;
- managed realtime service.

## 95. Backpressure

The backend must handle:

- high artifact upload volume;
- job bursts;
- telemetry bursts;
- result bursts.

Queues provide controlled asynchronous backpressure.

The API should reject or defer work when system capacity is exhausted.

## 96. Timeout Policy

Timeouts must exist for:

- API dependencies;
- database operations;
- object storage;
- queue operations;
- Lab Agent requests;
- worker tasks.

A timeout must produce a defined state transition where applicable.

## 97. Retry Policy

Retries should be:

- bounded;
- exponential where appropriate;
- jittered where appropriate;
- operation-aware.

Do not retry non-idempotent operations blindly.

## 98. Dead-Letter Handling

Messages that repeatedly fail should enter a dead-letter path.

Dead-letter records should contain:

- message ID;
- type;
- failure reason;
- attempt count;
- timestamps;
- correlation ID.

Operators must have a safe recovery procedure.

## 99. Scheduler Reliability

The Scheduler must tolerate:

- duplicate execution attempts;
- worker restarts;
- agent disconnection;
- resource conflicts;
- expired bookings.

A scheduled job must not execute outside an authorized booking window.

## 100. Booking Expiration

Bookings may transition through:

    CREATED
      |
      v
    CONFIRMED
      |
      +--> CANCELLED
      |
      +--> EXPIRED
      |
      v
    ACTIVE
      |
      v
    COMPLETED

Exact state model is defined by the Booking module.

## 101. Job Authorization

Before a job starts, the backend should verify:

- user authorization;
- organization access;
- booking validity;
- platform compatibility;
- artifact validity;
- sufficient credits;
- resource availability;
- Lab Agent availability;
- execution policy.

## 102. Job Start Flow

    Studio
      |
      | job.start
      v
    Control Plane
      |
      +--> Authorization
      +--> Booking Validation
      +--> Artifact Validation
      +--> Credit Validation
      |
      v
    QUEUED
      |
      v
    Scheduler
      |
      v
    Resource Allocation
      |
      v
    Lab Agent
      |
      v
    Deployment
      |
      v
    RUNNING

## 103. Credit Consumption

Credits should be handled according to a defined policy.

Possible states:

    QUOTED
      |
      v
    RESERVED
      |
      v
    CONSUMED
      |
      +--> REFUNDED

The implementation must avoid double charging.

## 104. Failure Compensation

If execution fails after credit reservation, the backend must determine whether credits:

- remain reserved;
- are partially consumed;
- are refunded;
- are forfeited according to policy.

The policy must be explicit and auditable.

## 105. Lab Disconnection

If a Lab Agent disconnects during execution:

1. mark agent health degraded/offline;
2. record the last known state;
3. stop new allocations;
4. attempt safe reconciliation;
5. determine run state;
6. avoid duplicate deployment;
7. notify Studio;
8. require physical safety procedures where appropriate.

Cloud-side state must not assume that robot hardware stopped.

## 106. Cloud Failure During Execution

If Control Plane becomes unavailable while a robot is running:

- the robot runtime continues according to its local safety/runtime policy;
- Lab Agent retains local safety authority;
- cloud recovery reconciles execution state;
- no assumption is made that cloud unavailability equals robot stop.

## 107. Data Flow: Project

    Studio
      |
      v
    Project API
      |
      v
    Project Service
      |
      v
    Project Repository
      |
      v
    PostgreSQL

## 108. Data Flow: Artifact

    Studio
      |
      v
    Create Artifact Metadata
      |
      v
    PostgreSQL
      |
      v
    Signed Upload Authorization
      |
      v
    Object Storage
      |
      v
    Validation Worker
      |
      v
    Artifact Accepted / Rejected

## 109. Data Flow: Booking

    Studio
      |
      v
    Availability
      |
      v
    Quote
      |
      v
    Booking Transaction
      |
      +--> Credit Reservation
      +--> Resource Reservation
      |
      v
    Booking Confirmed
      |
      v
    Event

## 110. Data Flow: Job

    Studio
      |
      v
    Create Job
      |
      v
    PostgreSQL
      |
      v
    Queue
      |
      v
    Scheduler Worker
      |
      v
    Allocation
      |
      v
    Lab Agent
      |
      v
    Run
      |
      v
    Result

## 111. Data Flow: Realtime

    Lab Agent
      |
      v
    Control Plane
      |
      v
    Event
      |
      +--> WebSocket
      |
      +--> Audit
      |
      +--> Metrics
      |
      v
    Studio

## 112. Data Flow: Results

    Lab Agent
      |
      v
    Result Service
      |
      +--> PostgreSQL metadata
      |
      +--> Object Storage
      |
      v
    Result Available
      |
      v
    Studio

## 113. Testing Architecture

Backend testing should include:

- unit tests;
- domain tests;
- application-service tests;
- repository integration tests;
- API tests;
- worker tests;
- queue tests;
- contract tests;
- Lab Agent protocol tests;
- end-to-end tests.

## 114. Unit Testing

Unit tests should verify:

- domain rules;
- state transitions;
- validation;
- authorization decisions;
- credit calculations;
- booking rules;
- compatibility rules.

Unit tests should not require PostgreSQL unless testing persistence behavior.

## 115. Integration Testing

Integration tests should verify:

- PostgreSQL;
- migrations;
- repositories;
- object storage;
- queue;
- API;
- worker processing.

External cloud services should be replaceable by local test implementations where practical.

## 116. Contract Testing

Contract tests should verify:

- Studio ↔ API;
- Studio ↔ WebSocket;
- Control Plane ↔ Lab Agent;
- artifact schema;
- protocol versions.

Contract tests are especially important because the product consists of independently
evolving components.

## 117. End-to-End Testing

The primary end-to-end scenario is:

    Login
      |
      v
    Create Project
      |
      v
    Register Artifact
      |
      v
    Upload Artifact
      |
      v
    Validate
      |
      v
    Book Platform
      |
      v
    Create Job
      |
      v
    Start
      |
      v
    Execute
      |
      v
    Complete
      |
      v
    Result

A mock Lab Agent should support this flow before physical hardware integration.

## 118. Local Development Backend

Local development should run:

- Control Plane;
- PostgreSQL;
- object-storage emulator;
- queue emulator;
- mock Lab Agent.

The local environment must support the complete software workflow.

## 119. Development Data

Development data must be isolated from staging and production.

No production credentials should be used in local development.

Seed data may include:

- test organizations;
- users;
- platforms;
- labs;
- resources;
- credit plans;
- mock artifacts;
- mock jobs.

## 120. API Documentation

The backend API should have an OpenAPI specification.

The specification should describe:

- endpoints;
- request schemas;
- response schemas;
- error codes;
- authentication;
- pagination;
- idempotency;
- versioning.

## 121. Pagination

List endpoints should support pagination.

Examples:

    projects
    artifacts
    bookings
    jobs
    runs
    results
    audit records

Pagination must avoid unbounded database queries.

## 122. Filtering and Sorting

Where useful, list APIs should support:

- status;
- date;
- platform;
- project;
- organization;
- user;
- lab.

Filtering must be validated and implemented through indexed queries where necessary.

## 123. Database Indexing

Indexes should support common access patterns:

- organization ID;
- project ID;
- platform ID;
- booking time range;
- job status;
- run status;
- artifact status;
- lab ID;
- resource ID.

Indexes must be reviewed as data volume grows.

## 124. Data Integrity

Database constraints should enforce critical invariants.

Examples:

- unique IDs;
- unique idempotency keys;
- valid foreign keys;
- non-negative credit balances where policy requires;
- unique active resource allocation;
- valid status transitions where enforceable.

## 125. Soft Deletion

Soft deletion may be used where audit/history is required.

Examples:

- projects;
- platforms;
- artifacts.

Hard deletion should be restricted for business-critical records.

## 126. Audit and Immutable History

The following should normally remain historically traceable:

- credit transactions;
- bookings;
- job execution history;
- run history;
- audit events.

Deletion of a user-facing resource must not destroy required historical accounting.

## 127. API Security Headers

The production API should use appropriate security headers and TLS policies.

The exact policy is defined by deployment/security architecture.

## 128. Dependency Management

Backend dependencies must be:

- versioned;
- reviewed;
- scanned;
- updated regularly;
- pinned or lockfile-controlled.

Cloud SDK dependencies should remain inside infrastructure adapters.

## 129. Secrets Management

Secrets include:

- database credentials;
- storage credentials;
- queue credentials;
- identity configuration;
- signing credentials;
- Lab Agent trust credentials.

Secrets must be injected through secure infrastructure.

They must not be committed to Git.

## 130. Production Failure Priorities

When failures occur, priority is:

1. Physical safety.
2. Prevent unsafe new execution.
3. Preserve authoritative state.
4. Prevent double charging.
5. Prevent duplicate job execution.
6. Preserve artifacts/results.
7. Restore user-facing service.
8. Reconcile delayed state.

## 131. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Monolith becomes tightly coupled | High | Strict module boundaries |
| Database becomes shared-state shortcut | High | Repository/module contracts |
| Queue duplicates work | High | Idempotent workers |
| Booking race | Critical | Transactional locking |
| Double charging | Critical | Immutable transactions/idempotency |
| Lab disconnect | Critical | Agent heartbeat/reconciliation |
| WebSocket stale state | Medium | API reconciliation |
| Cloud outage during run | Critical | Local runtime safety |
| Artifact tampering | Critical | Signatures/checksums |
| Tenant data leak | Critical | Organization-scoped authorization |
| Queue overload | High | Backpressure/scaling |
| Worker failure | High | Retry/dead-letter |
| API incompatibility | High | Versioned contracts |
| Vendor lock-in | Medium | Infrastructure ports |
| Premature microservices | Medium | Modular monolith |

## 132. Risk: Monolith Coupling

Mitigations:

- module ownership;
- dependency rules;
- domain contracts;
- code review;
- architecture tests;
- no direct cross-module table access.

## 133. Risk: Database as Integration Bus

The database must not be used as a substitute for events or queues.

Do not implement:

    Module A writes arbitrary row
        |
        v
    Module B polls row

Use explicit application/event/queue mechanisms.

## 134. Risk: Queue as Source of Truth

Queue messages can be duplicated or lost.

Therefore:

    Queue = trigger/work transport

and:

    PostgreSQL = business authority

Workers must query authoritative state before irreversible actions.

## 135. Risk: Duplicate Robot Execution

Before starting a job, the worker must verify:

- job state;
- booking;
- resource lock;
- execution state;
- idempotency marker.

A duplicate queue message must not start a second physical execution.

## 136. Risk: Lab Agent Failure

Mitigations:

- heartbeat;
- secure identity;
- resource health;
- execution reconciliation;
- no new allocation to unavailable agents;
- explicit uncertain state;
- operational runbook.

## 137. Open Questions

1. Which backend language/framework will be used for the production implementation?
2. Which PostgreSQL access technology/ORM should be standardized?
3. Which queue technology will be used in the first deployment?
4. Which object-storage provider will be used initially?
5. Which identity provider will be used?
6. What exact Lab Agent transport will be used?
7. Should WebSocket delivery use an internal broker?
8. Which telemetry data requires time-series storage?
9. What are the initial API rate limits?
10. What are the exact booking concurrency rules?
11. What is the credit refund policy for hardware failures?
12. What is the maximum artifact size?
13. What is the result retention policy?
14. What is the video retention policy?
15. What is the telemetry retention policy?
16. Which audit records are legally retained?
17. What is the exact job retry policy?
18. What is the maximum execution duration?
19. Which resource types must the Scheduler support initially?
20. When should a module be extracted into a separate service?

## 138. Service Extraction Criteria

A module should be considered for extraction only when there is measurable justification.

Possible triggers:

- independent scaling requirement;
- independent deployment requirement;
- security isolation requirement;
- operational ownership;
- high resource consumption;
- release cadence divergence.

The default is to keep the module in the monolith.

## 139. Phase Mapping

| Phase | Backend Scope |
|---|---|
| Phase 0 | Backend foundation |
| Phase 1 | Identity, projects, platforms |
| Phase 2 | Artifacts |
| Phase 3 | Control Plane integration |
| Phase 4 | Booking and credits |
| Phase 5 | Jobs and execution |
| Phase 6 | Labs and physical execution |
| Phase 7 | Results and realtime |
| Phase 8 | Production hardening |

## 140. P0 FOUNDATION

Deliver:

- backend repository;
- modular monolith skeleton;
- API framework;
- PostgreSQL connection;
- migration framework;
- configuration;
- logging;
- health endpoints;
- repository interfaces;
- object-storage interface;
- queue interface.

Acceptance:

- application starts;
- database connects;
- migrations execute;
- health checks work;
- basic API endpoint works.

## 141. Phase 1 — Identity and Projects

Deliver:

- identity context;
- organizations;
- users;
- memberships;
- projects;
- platforms;
- authorization.

Acceptance:

- user can authenticate;
- organization isolation works;
- project CRUD works;
- platform catalog works.

## 142. P2 BUILD & ARTIFACT — Artifact

Deliver:

- artifact registration;
- object storage;
- upload authorization;
- checksum;
- signature validation;
- compatibility validation;
- artifact lifecycle.

Acceptance:

- `.krv` can be registered;
- binary can be uploaded;
- validation succeeds/fails correctly;
- incompatible artifacts are rejected.

## 143. P3 CONTROL PLANE Integration

Deliver:

- full API contract;
- Studio integration;
- WebSocket;
- event infrastructure;
- asynchronous validation;
- idempotency.

Acceptance:

- Studio can use API;
- asynchronous operations work;
- realtime state works;
- reconnect reconciliation works.

## 144. P4 BOOKING & COMMERCIAL

Deliver:

- availability;
- quote;
- booking;
- credit wallets;
- credit transactions;
- reservation;
- cancellation/refund rules.

Acceptance:

- overlapping booking is prevented;
- credits cannot be double spent;
- platform-specific credits work;
- cancellation policy is enforced.

## 145. P5 EXECUTION

Deliver:

- jobs;
- scheduler;
- resource allocation;
- worker execution;
- Lab protocol foundation;
- job lifecycle.

Acceptance:

- valid job reaches a Lab Agent;
- duplicate worker messages do not duplicate execution;
- state transitions are durable;
- failures are recoverable.

## 146. P6 LAB & ROBOT — Lab and Physical Robot

Deliver:

- agent registration;
- heartbeat;
- capabilities;
- resource inventory;
- deployment;
- execution;
- telemetry;
- logs.

Acceptance:

- real lab agent can connect;
- unavailable agents are excluded;
- physical execution follows booking and authorization;
- safety boundary remains intact.

## 147. P7 LIVE & RESULTS — Results

Deliver:

- result ingestion;
- result metadata;
- object storage;
- metrics;
- logs;
- video references;
- downloads;
- rerun.

Acceptance:

- completed run produces result;
- result files are available;
- metadata is durable;
- rerun creates a new execution.

## 148. P8 PRODUCTION

Deliver:

- horizontal scaling;
- production security;
- observability;
- alerting;
- backup/recovery integration;
- rate limiting;
- audit hardening;
- operational runbooks;
- performance optimization.

Acceptance:

- production deployment is reproducible;
- failure modes are tested;
- monitoring is operational;
- recovery procedures are documented;
- production security review is passed.

## 149. Full Acceptance Criteria Checklist

### Architecture

- [ ] Control Plane is implemented as a modular monolith.
- [ ] Module boundaries are documented.
- [ ] Layer boundaries are documented.
- [ ] Transport is separated from application logic.
- [ ] Application logic is separated from infrastructure.
- [ ] Business logic does not depend on cloud SDKs.
- [ ] Future service extraction boundaries are preserved.

### API

- [ ] `/api/v1/` versioning exists.
- [ ] API contracts are documented.
- [ ] Request validation exists.
- [ ] Response schemas are stable.
- [ ] HTTP status mapping is defined.
- [ ] Application error codes are stable.
- [ ] Pagination exists for large lists.
- [ ] Rate limiting exists.
- [ ] Idempotency exists for required operations.

### Modules

- [ ] Identity module exists.
- [ ] Organizations module exists.
- [ ] Projects module exists.
- [ ] Platforms module exists.
- [ ] Artifacts module exists.
- [ ] Booking module exists.
- [ ] Credits module exists.
- [ ] Jobs module exists.
- [ ] Scheduler exists.
- [ ] Resource Allocation exists.
- [ ] Runs module exists.
- [ ] Results module exists.
- [ ] Lab module exists.
- [ ] Audit module exists.
- [ ] Events module exists.

### Repositories

- [ ] Repository interfaces are defined.
- [ ] Infrastructure implements repositories.
- [ ] SQL/ORM details do not leak into domain logic.
- [ ] Transactions are explicit.
- [ ] Concurrency controls are implemented.
- [ ] Organization filtering is enforced.

### Database

- [ ] PostgreSQL is authoritative.
- [ ] Schema migrations are versioned.
- [ ] Foreign keys are used where appropriate.
- [ ] Unique constraints protect invariants.
- [ ] Booking conflict protection exists.
- [ ] Credit consistency is protected.
- [ ] Critical historical records are retained.

### Object Storage

- [ ] Object storage is abstracted.
- [ ] Artifacts use object storage.
- [ ] Results use object storage where appropriate.
- [ ] Upload authorization is controlled.
- [ ] Download authorization is controlled.
- [ ] Object checksums are recorded.
- [ ] Public unauthenticated access is disabled.

### Queue

- [ ] Queue interface exists.
- [ ] Workers consume queue messages.
- [ ] Duplicate messages are tolerated.
- [ ] Retries are bounded.
- [ ] Dead-letter handling exists.
- [ ] Queue is not treated as business-state authority.
- [ ] Queue depth is observable.

### Workers

- [ ] Workers are independently executable.
- [ ] Workers are idempotent.
- [ ] Worker failures are recorded.
- [ ] Worker retries are controlled.
- [ ] Worker correlation IDs are preserved.
- [ ] Worker operations use authoritative state.

### Jobs

- [ ] Job lifecycle is defined.
- [ ] State transitions are validated.
- [ ] Job creation is idempotent.
- [ ] Job start is idempotent.
- [ ] Duplicate execution is prevented.
- [ ] Cancellation is supported.
- [ ] Timeout is supported.
- [ ] Failure states are durable.

### Booking

- [ ] Availability is authoritative.
- [ ] Booking conflicts are prevented transactionally.
- [ ] Booking cancellation is supported.
- [ ] Booking expiration is supported.
- [ ] Booking state is auditable.
- [ ] Booking is required for eligible physical execution.

### Credits

- [ ] Platform-specific credit types exist.
- [ ] Credit balance is authoritative.
- [ ] Transactions are immutable/auditable.
- [ ] Credit reservation is defined.
- [ ] Credit consumption is defined.
- [ ] Refund policy is defined.
- [ ] Double spending is prevented.

### Lab

- [ ] Lab Agents have unique identities.
- [ ] Agent authentication exists.
- [ ] Heartbeat exists.
- [ ] Capability reporting exists.
- [ ] Resource reporting exists.
- [ ] Resource allocation is transactional.
- [ ] Agent disconnection is handled.
- [ ] Lab protocol is versioned.

### Realtime

- [ ] WebSocket is available.
- [ ] Subscriptions are authorized.
- [ ] Events contain identifiers.
- [ ] Events can be reconciled.
- [ ] Reconnect behavior is defined.
- [ ] WebSocket is not authoritative state.
- [ ] Multi-instance delivery is supported.

### Security

- [ ] TLS is enforced.
- [ ] Authentication is enforced.
- [ ] Authorization is enforced.
- [ ] Organization isolation is enforced.
- [ ] Secrets are externally managed.
- [ ] Artifact signatures are validated.
- [ ] Object access is private by default.
- [ ] Audit logging exists.
- [ ] Rate limiting exists.
- [ ] Sensitive data is excluded from logs.

### Observability

- [ ] Structured logging exists.
- [ ] Metrics exist.
- [ ] Tracing exists.
- [ ] Request IDs exist.
- [ ] Correlation IDs cross worker boundaries.
- [ ] Health endpoints exist.
- [ ] Queue metrics exist.
- [ ] Lab health metrics exist.
- [ ] Job metrics exist.
- [ ] API latency/error metrics exist.

### Reliability

- [ ] Database failure behavior is defined.
- [ ] Queue failure behavior is defined.
- [ ] Object storage failure behavior is defined.
- [ ] Lab Agent failure behavior is defined.
- [ ] Timeouts exist.
- [ ] Retry policies exist.
- [ ] Dead-letter handling exists.
- [ ] State reconciliation exists.
- [ ] Duplicate operations are safe.

### Safety

- [ ] Cloud is not treated as physical E-stop.
- [ ] Control Plane does not directly control motors.
- [ ] Lab Agent is the hardware boundary.
- [ ] Real-time control remains local.
- [ ] Cloud failure does not create an unsafe control assumption.
- [ ] Job cancellation semantics are documented.

### Testing

- [ ] Unit tests exist.
- [ ] Domain tests exist.
- [ ] Application-service tests exist.
- [ ] Repository integration tests exist.
- [ ] API tests exist.
- [ ] Worker tests exist.
- [ ] Queue tests exist.
- [ ] Contract tests exist.
- [ ] Lab Agent protocol tests exist.
- [ ] End-to-end tests exist.

### Deployment

- [ ] Local development deployment exists.
- [ ] Development cloud deployment exists.
- [ ] Staging deployment exists.
- [ ] Production deployment exists.
- [ ] Database migrations are automated safely.
- [ ] Worker deployment is supported.
- [ ] Horizontal API scaling is supported.
- [ ] Configuration is externalized.

### Phase Completion

- [ ] Phase 0 foundation is complete.
- [ ] Phase 1 identity/projects/platforms is complete.
- [ ] Phase 2 artifact management is complete.
- [ ] Phase 3 Control Plane integration is complete.
- [ ] Phase 4 booking and credits are complete.
- [ ] Phase 5 execution is complete.
- [ ] Phase 6 physical lab integration is complete.
- [ ] Phase 7 results/live integration is complete.
- [ ] Phase 8 production hardening is complete.

## 150. Final Backend Architecture Baseline

The Kritva RaaS Control Plane is a modular monolith designed to provide strong domain
boundaries without prematurely introducing distributed-service complexity.

The authoritative architecture is:

    +-----------------------------------------------------------+
    |                     RaaS Control Plane                    |
    |                                                           |
    |  API / Transport                                          |
    |          |                                                |
    |          v                                                |
    |  Application Services                                     |
    |          |                                                |
    |          v                                                |
    |  Domain Modules                                           |
    |                                                           |
    |  Identity | Organizations | Projects | Platforms          |
    |  Artifacts | Booking | Credits | Jobs | Scheduler         |
    |  Resources | Runs | Results | Lab | Audit | Events        |
    |          |                                                |
    |          v                                                |
    |  Repository / Infrastructure Ports                        |
    +----------+----------------+----------------+--------------+
               |                |                |
               v                v                v
          PostgreSQL       Object Storage       Queue
                                                |
                                                v
                                             Workers
                                                |
                                                v
                                           Lab Agent
                                                |
                                                v
                                         Robot / Simulator

The critical authority model is:

    PostgreSQL
        = authoritative business state

    Object Storage
        = authoritative large-object content

    Queue
        = asynchronous work transport

    WebSocket
        = realtime notification transport

    Lab Agent
        = cloud-to-lab execution boundary

    Robot Runtime
        = local real-time execution boundary

The Control Plane therefore provides the central business and orchestration authority
for Kritva RaaS while deliberately keeping hard real-time control and physical safety
outside the cloud.

The backend must preserve these architectural invariants throughout Phase 0 through
Phase 8:

1. Modular monolith first.
2. Business logic remains domain-oriented.
3. Database remains authoritative.
4. Queue remains transient.
5. WebSocket remains non-authoritative.
6. Large binaries remain in object storage.
7. Side effects are idempotent.
8. Booking and credit operations are transactional.
9. Job execution is durable and recoverable.
10. Lab Agents are explicitly authenticated.
11. Physical robot control remains local.
12. Cloud failure never substitutes for physical safety.
13. Customer source code is not required by the Control Plane for normal execution.
14. Only compatible, validated artifacts may reach the lab.
15. Tenant isolation is enforced server-side.
16. Every production-critical operation is observable and auditable.
17. Infrastructure-provider dependencies remain behind adapters.
18. Microservice extraction occurs only when justified by measurable requirements.

The resulting backend provides the foundation for the complete Kritva RaaS product:

    Build Locally
          |
          v
    Package Artifact
          |
          v
    Upload
          |
          v
    Book Platform
          |
          v
    Reserve Credits
          |
          v
    Schedule Job
          |
          v
    Allocate Robot
          |
          v
    Deploy Through Lab Agent
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
    Analyze
          |
          v
    Run Again

This architecture is intentionally designed to support the transition from an initial
software-only demonstration to a multi-platform, multi-lab, production RaaS service
without requiring a fundamental redesign of the Control Plane.
