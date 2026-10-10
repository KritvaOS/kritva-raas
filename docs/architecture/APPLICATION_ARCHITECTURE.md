# Kritva RaaS Application Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Application Architecture |
| Path | `docs/architecture/APPLICATION_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Architecture Level | Application |
| Status | Architecture Baseline |
| Primary Audience | Application, Platform, Cloud, Lab, Security, QA |
| Applications | Studio, Web Console, Control Plane, Lab Agent |
| Supporting Services | Workers, API, WebSocket, Storage, Queue, Observability |
| API Baseline | REST `/api/v1/` |
| Realtime Baseline | WebSocket |
| Execution Principle | Build locally, upload artifact, execute remotely |
| Deployment Principle | Independently deployable application units with stable contracts |

## 2. Purpose

This document defines the application-level architecture of Kritva RaaS.

It translates the product-wide system architecture into concrete application boundaries,
responsibilities, interfaces, deployment units, runtime dependencies, and interactions.

The document specifically defines:

- Kritva RaaS Studio;
- Kritva RaaS Web Console;
- Kritva RaaS Control Plane;
- Control Plane workers;
- Lab Agent;
- supporting application services;
- local runtime interaction;
- cloud service interaction;
- database and object storage interaction;
- execution orchestration;
- application ownership;
- deployment boundaries;
- scaling boundaries;
- security boundaries;
- observability boundaries;
- application lifecycle;
- phase-by-phase evolution.

The architecture is designed to support the complete product lifecycle from Phase 0
software-only development through Phase 8 production operation.

## 3. Scope

This document covers application software and its immediate runtime relationships.

Included:

1. Desktop Studio.
2. Studio Local Runtime integration boundary.
3. Web Console.
4. Control Plane API.
5. Control Plane domain modules.
6. Background workers.
7. WebSocket event service.
8. Artifact service.
9. Booking service.
10. Credit service.
11. Execution orchestration.
12. Result service.
13. Lab Agent.
14. Supporting infrastructure adapters.
15. Application configuration.
16. Application authentication and authorization.
17. Application observability.
18. Application deployment units.
19. Application-to-application interfaces.
20. Application evolution through Phase 0-8.

Excluded or delegated:

- detailed database schema;
- detailed cloud infrastructure;
- detailed robot hardware architecture;
- detailed physical safety architecture;
- detailed artifact binary format;
- detailed network topology;
- detailed UI screen specifications;
- detailed payment-provider implementation.

Those areas are covered by companion architecture documents.

## 4. Product Application Model

Kritva RaaS consists of four primary applications:

1. Studio.
2. Web Console.
3. Control Plane.
4. Lab Agent.

The supporting services are primarily backend runtime components and adapters.

The logical topology is:

    +---------------------------------------------------------------+
    |                       USER DEVICES                            |
    |                                                               |
    |  +---------------------+       +---------------------------+  |
    |  | Kritva RaaS Studio  |       | Browser / Web Console     |  |
    |  | Desktop             |       |                           |  |
    |  +----------+----------+       +-------------+-------------+  |
    |             |                                |                |
    +-------------|--------------------------------|----------------+
                  | HTTPS / WS                     | HTTPS / WS
                  |                                |
                  +----------------+---------------+
                                   |
                                   v
                       +-------------------------+
                       | Kritva RaaS Control     |
                       | Plane                   |
                       |                         |
                       | API / Auth / Domains    |
                       | Jobs / Booking / Results |
                       +-----+-----------+-------+
                             |           |
                   +---------+           +----------+
                   |                                |
                   v                                v
             +-----------+                    +-----------+
             | PostgreSQL |                    | Storage   |
             +-----------+                    +-----------+
                   |
                   v
             +-----------+
             | Queue     |
             +-----+-----+
                   |
                   v
             +-----------+
             | Workers   |
             +-----+-----+
                   |
                   | Lab Protocol
                   v
             +-----------+
             | Lab Agent |
             +-----+-----+
                   |
                   v
             +-----------+
             | Kritva    |
             | Runtime   |
             +-----+-----+
                   |
                   v
                Robot

## 5. Architectural Goals

The application architecture shall:

1. Maintain clear ownership boundaries.
2. Keep customer source code local.
3. Make the `.krv` artifact the execution boundary.
4. Provide a stable Control Plane contract.
5. Keep the backend independent of desktop UI implementation.
6. Keep the Web Console independent of Studio implementation.
7. Allow the Control Plane to remain a modular monolith initially.
8. Allow backend workers to scale independently.
9. Isolate laboratory access through the Lab Agent.
10. Keep robot real-time control local.
11. Support simulated and physical execution.
12. Support multiple robotic platforms.
13. Support multiple laboratories.
14. Support user and administrator workflows.
15. Provide strong auditability.
16. Support asynchronous execution.
17. Support application versioning.
18. Support production deployment and rollback.
19. Minimize cloud coupling.
20. Preserve the same logical architecture throughout Phase 0-8.

## 6. Non-Goals

The application architecture does not attempt to:

- make Studio a general-purpose IDE;
- provide a mandatory cloud source repository;
- build arbitrary customer source code in the cloud;
- allow direct database access from clients;
- expose arbitrary shell access to robots;
- implement physical emergency-stop behavior;
- put cloud APIs in real-time motor-control loops;
- require microservices from Phase 0;
- require Kubernetes from the beginning;
- make the Web Console a replacement for Studio;
- make the Lab Agent a general remote administration daemon;
- make WebSocket the authoritative state store.

## 7. Definitions

### 7.1 Studio

The desktop application used by developers to create projects, build applications,
manage artifacts, book resources, execute jobs, observe runs, and inspect results.

### 7.2 Studio Local Runtime

The local native execution environment used by Studio to invoke build, test, package,
signing, and toolchain operations.

### 7.3 Web Console

The browser-based application used for user account, commercial, operational, and
administrative functions.

### 7.4 Control Plane

The backend application that owns RaaS business state, authorization, orchestration,
and execution control.

### 7.5 Worker

A background process that executes asynchronous Control Plane work.

### 7.6 Lab Agent

A trusted application deployed inside a robotic laboratory that provides the controlled
interface between RaaS cloud services and local robotic resources.

### 7.7 Kritva Runtime

The robot-side runtime responsible for executing an authorized application.

### 7.8 Application Artifact

A packaged `.krv` execution unit produced by the local development environment.

### 7.9 Job

An authorized request to execute an artifact against a selected resource.

### 7.10 Run

A concrete execution instance associated with a job.

### 7.11 Platform

A supported robotic platform definition including hardware, runtime, architecture,
capabilities, and compatibility requirements.

## 8. Application Ownership

| Application | Primary Owner | Primary Users | Deployment |
|---|---|---|---|
| Studio | RaaS Application Team | Developers | User workstation |
| Web Console | RaaS Web Team | Users/Admins | Web/CDN |
| Control Plane | Backend Team | Studio/Web/Agents | Cloud |
| Workers | Backend/Platform Team | Control Plane | Cloud |
| Lab Agent | Robotics/Lab Team | Lab Operators | Lab host |
| Kritva Runtime | Kritva Runtime Team | Robot applications | Robot |
| Database | Platform Team | Control Plane | Managed/private |
| Object Storage | Platform Team | Control Plane | Cloud |
| Queue | Platform Team | Workers | Cloud |
| Observability | Platform Team | All applications | Cloud/local |

## 9. Application Deployment Units

The initial production-oriented deployment units are:

1. `studio`
2. `web-console`
3. `control-plane`
4. `worker`
5. `lab-agent`

Supporting infrastructure is not treated as a client application.

A conceptual deployment model is:

    User Machine
        |
        +--> studio
        +--> local toolchains

    Web Infrastructure
        |
        +--> web-console

    Cloud Compute
        |
        +--> control-plane
        +--> worker

    Robotic Laboratory
        |
        +--> lab-agent

    Robot
        |
        +--> kritva-runtime

The Control Plane and Worker may initially share a deployment image or process model,
but they must have separate logical responsibilities.

## 10. Studio Architecture

Studio is a Tauri-based desktop application using:

- React;
- TypeScript;
- Tauri;
- Rust native layer;
- shared UI package;
- shared API contracts;
- API client;
- WebSocket client;
- local runtime integration.

The logical structure is:

    +----------------------------------------------------+
    | Kritva RaaS Studio                                |
    |                                                    |
    |  React UI                                          |
    |      |                                             |
    |      +--> State / Query                            |
    |      |                                             |
    |      +--> API Client --------------------+         |
    |      |                                    |         |
    |      +--> Realtime Client                 |         |
    |                                           |         |
    |  Tauri/Rust Native Layer                  |         |
    |      |                                    |         |
    |      +--> Local Runtime IPC               |         |
    +-------------------------------------------|---------+
                                                |
                                                v
                                         Control Plane

## 11. Studio Responsibilities

Studio owns the developer experience.

Responsibilities include:

- authentication UI;
- dashboard;
- project management;
- platform selection;
- build control;
- artifact management;
- booking;
- job creation;
- live execution;
- logs;
- telemetry;
- results;
- rerun.

Studio does not own:

- user authorization;
- credit balance;
- booking truth;
- job truth;
- resource truth;
- artifact acceptance;
- physical safety.

## 12. Studio State Management

Studio state is divided into:

### Local UI State

Examples:

- selected project;
- active tab;
- modal state;
- form state;
- filter state.

### Server State

Examples:

- projects;
- platforms;
- bookings;
- artifacts;
- jobs;
- runs;
- results;
- credits.

Server state is retrieved through the API client.

### Realtime State

Examples:

- job transitions;
- live telemetry;
- robot status;
- logs;
- events.

Realtime state must be reconciled with authoritative server state.

## 13. Studio API Boundary

Studio uses the versioned Control Plane API.

The logical interface is:

    Studio
       |
       | HTTPS
       v
    /api/v1/

Typical operations:

    auth.login
    auth.me
    project.list
    project.create
    platform.list
    artifact.create
    artifact.validate
    booking.quote
    booking.create
    credit.balance
    job.create
    job.start
    job.stop
    run.status
    result.list

## 14. Studio Realtime Boundary

Studio receives live events through WebSocket.

Examples:

    job.queued
    job.validating
    job.deploying
    job.starting
    job.running
    job.completed
    job.failed

    robot.online
    robot.offline

    telemetry.updated

The WebSocket connection is not authoritative.

On reconnect:

    WebSocket reconnect
          |
          v
    Fetch authoritative state
          |
          v
    Resume event subscription

## 15. Studio Local Runtime Boundary

Studio uses Tauri IPC to communicate with the local runtime.

Conceptually:

    React UI
       |
       | Tauri command
       v
    Rust Native Layer
       |
       | Controlled IPC
       v
    Local Runtime
       |
       +--> Compiler
       +--> Linker
       +--> Tests
       +--> Package
       +--> Sign

The native layer provides the security boundary for local filesystem and process
operations.

## 16. Local Build Flow

    Project Source
        |
        v
    Studio
        |
        v
    Local Runtime
        |
        +--> Toolchain Check
        +--> Configure
        +--> Compile
        +--> Link
        +--> Test
        +--> Package
        +--> Manifest
        +--> Checksum
        +--> Sign
        |
        v
    .krv Artifact

The Control Plane is not required for this local build operation.

## 17. Artifact Upload Flow

    Local .krv
        |
        v
    Studio
        |
        | artifact.create
        v
    Control Plane
        |
        | upload authorization
        v
    Object Storage
        |
        v
    Control Plane validation
        |
        v
    Artifact ACCEPTED / REJECTED

Large artifact payloads should bypass the application server where practical.

## 18. Web Console Architecture

The Web Console is a browser application.

Its responsibilities include:

- user account;
- organization management;
- platform discovery;
- bookings;
- jobs;
- results;
- credits;
- billing;
- administrative operations.

It shares backend contracts with Studio but is independently deployed.

Logical topology:

    Browser
       |
       v
    Web Console
       |
       +--> REST API
       +--> WebSocket
       |
       v
    Control Plane

## 19. Web Console User Functions

The user-facing Web Console may expose:

    Dashboard
    Projects
    Robot Platforms
    Bookings
    Jobs
    Results
    Credits & Billing
    Profile

The Web Console does not replace Studio's local development workflow.

Source build remains a Studio/local-runtime responsibility.

## 20. Web Console Administrative Functions

The administrator interface includes:

    Overview
    Users
    Organizations
    Robot Platforms
    Labs
    Hardware
    Bookings
    Jobs
    Usage
    Credit Plans
    Payments
    Refunds
    Monitoring
    Audit Logs
    Settings

Administrative operations require elevated authorization.

## 21. Control Plane Architecture

The Control Plane is a production-oriented modular monolith.

It provides:

- REST API;
- authentication;
- authorization;
- domain services;
- transaction management;
- WebSocket events;
- job orchestration;
- persistence;
- integration adapters.

Conceptually:

    +-----------------------------------------------------+
    |                 Control Plane                      |
    |                                                     |
    | API Layer                                           |
    |   |                                                 |
    |   +--> Identity                                     |
    |   +--> Organizations                                |
    |   +--> Projects                                     |
    |   +--> Platforms                                    |
    |   +--> Artifacts                                    |
    |   +--> Booking                                      |
    |   +--> Credits                                      |
    |   +--> Jobs                                         |
    |   +--> Runs                                         |
    |   +--> Results                                      |
    |   +--> Lab                                          |
    |   +--> Audit                                        |
    |                                                     |
    | Repository / Adapter Layer                          |
    +----------+----------------+-------------------------+
               |                |
               v                v
          PostgreSQL       Object Storage / Queue

## 22. Modular Monolith Rationale

The Control Plane starts as a modular monolith because:

- the product is evolving rapidly;
- transactions cross multiple domains;
- deployment should remain simple;
- debugging is easier;
- infrastructure cost is lower;
- service extraction can be delayed until justified.

Logical modules remain isolated.

The codebase must not become an unstructured monolith.

## 23. Control Plane API Layer

The API layer is responsible for:

- HTTP routing;
- request validation;
- authentication;
- authorization;
- request context;
- rate limiting;
- idempotency;
- response serialization;
- error handling;
- correlation IDs.

It should not contain substantial business logic.

Business logic belongs to domain/application services.

## 24. Identity Module

The Identity module owns:

- login;
- logout;
- token/session handling;
- user identity;
- refresh;
- identity context.

It does not own project or robot-resource authorization decisions by itself.

Authorization is evaluated using identity plus organization/project/resource context.

## 25. Organization Module

The Organization module owns:

- organization records;
- membership;
- organization roles;
- organization settings.

It provides tenant context to other modules.

## 26. Project Module

The Project module owns:

- project creation;
- project metadata;
- project listing;
- project archive;
- project lifecycle.

The project references artifacts but does not own artifact binary storage.

## 27. Platform Module

The Platform module owns the supported robot catalog.

It defines:

- platform ID;
- version;
- architecture;
- runtime version;
- SDK version;
- capabilities;
- compatibility rules;
- resource requirements.

It is the authoritative source for supported platform definitions.

## 28. Artifact Module

The Artifact module owns:

- artifact metadata;
- upload authorization;
- validation;
- compatibility;
- artifact lifecycle;
- checksum;
- signature metadata;
- retention metadata.

Binary content is stored through the object-storage adapter.

## 29. Booking Module

The Booking module owns:

- availability;
- quotes;
- reservations;
- booking lifecycle;
- conflict prevention;
- cancellation;
- booking policy.

It coordinates with:

- Platform;
- Credit;
- Resource;
- Job.

## 30. Credit Module

The Credit module owns:

- credit wallets;
- plans;
- rates;
- quotes;
- consumption;
- refunds;
- ledger transactions.

The client cannot modify the credit ledger directly.

## 31. Job Module

The Job module owns execution requests.

It validates:

- user authorization;
- organization authorization;
- project;
- artifact;
- booking;
- platform;
- resource eligibility;
- credits.

It creates an execution request for the scheduler/orchestrator.

## 32. Run Module

The Run module records actual execution.

It owns:

- run status;
- timestamps;
- execution metadata;
- metrics references;
- failure information;
- result references.

Historical run records should be immutable except for controlled metadata correction.

## 33. Result Module

The Result module owns:

- result metadata;
- result files;
- result summaries;
- download authorization;
- result retention.

Large result files remain in object storage.

## 34. Lab Module

The Lab module owns:

- Lab Agent identity;
- lab registration;
- agent status;
- resource state;
- capability information;
- job dispatch;
- execution reconciliation.

The module does not directly access robot hardware.

It communicates with the Lab Agent.

## 35. Audit Module

The Audit module records significant actions.

Audit events should include:

- actor;
- organization;
- timestamp;
- action;
- target;
- outcome;
- request ID;
- correlation ID.

Audit records are not ordinary application logs.

## 36. Worker Architecture

Workers execute asynchronous operations outside the request path.

Examples:

- artifact validation;
- artifact scanning;
- booking processing;
- job scheduling;
- Lab dispatch;
- result processing;
- cleanup;
- notifications.

Conceptually:

    API
     |
     | enqueue
     v
    Queue
     |
     +--> Worker A
     +--> Worker B
     +--> Worker C
     |
     v
    Domain Services

Workers use the same domain contracts as the API where practical.

## 37. Worker Deployment

Workers should be independently scalable.

The first implementation may deploy one worker process.

Later, workloads may be separated by queue or worker class.

Examples:

    artifact-worker
    execution-worker
    result-worker
    maintenance-worker

This extraction is optional and should be driven by scale.

## 38. WebSocket Service

The realtime service may initially run inside the Control Plane.

Its responsibilities include:

- authenticated connection;
- subscription;
- event delivery;
- connection lifecycle;
- backpressure;
- reconnect support.

It must not become the source of truth.

Future scaling may separate WebSocket gateways.

## 39. Supporting Services

The application platform contains several supporting services/interfaces.

These include:

- PostgreSQL repository layer;
- object storage adapter;
- queue adapter;
- secret store adapter;
- observability adapter;
- payment adapter;
- identity adapter;
- notification adapter.

These are integration boundaries, not necessarily separate deployment units.

## 40. Repository Interfaces

The backend uses repository abstractions.

Representative interfaces:

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

The domain/application layer should not depend directly on PostgreSQL-specific APIs.

## 41. Object Storage Interface

The logical interface is:

    ObjectStorage
        put()
        get()
        delete()
        exists()
        generateDownloadUrl()

The Control Plane stores metadata separately.

This supports cloud-provider replacement and local emulation.

## 42. Queue Interface

The logical queue interface is:

    JobQueue
        enqueue()
        dequeue()
        acknowledge()
        reject()

Queue implementations may vary between:

- local;
- development;
- staging;
- production.

Business logic must not depend on a particular queue vendor.

## 43. Lab Agent Architecture

The Lab Agent is a separate deployment unit.

It runs inside the lab.

It contains logical components:

    +-------------------------------------------+
    | Lab Agent                                 |
    |                                           |
    | Protocol Client                           |
    |      |                                    |
    |      +--> Authorization                  |
    |      +--> Resource Manager               |
    |      +--> Artifact Manager               |
    |      +--> Deployment Manager             |
    |      +--> Runtime Manager                |
    |      +--> Telemetry Collector            |
    |      +--> Log Collector                  |
    |      +--> Result Collector               |
    +-------------------------------------------+
                     |
                     v
              Robot / Runtime

## 44. Lab Agent Ownership

The Lab Agent owns local lab execution operations.

It is responsible for:

- local discovery;
- local validation;
- deployment;
- lifecycle;
- resource control;
- status reporting.

It does not own:

- user identity;
- billing;
- booking policy;
- organization permissions;
- global platform catalog.

Those remain Control Plane responsibilities.

## 45. Lab Agent Communication

The preferred model is an authenticated outbound or mutually authenticated connection.

Conceptually:

    Control Plane
         ^
         | Secure Lab Protocol
         |
    Lab Agent

The architecture should minimize inbound exposure into the laboratory network.

## 46. Lab Agent to Runtime

The Lab Agent controls runtime lifecycle.

Conceptually:

    Lab Agent
        |
        +--> validate
        +--> prepare
        +--> deploy
        +--> start
        +--> monitor
        +--> stop
        +--> collect
        |
        v
    Kritva Runtime

The Lab Agent must not bypass runtime policy.

## 47. Supporting Robot Application Boundary

Customer application code runs under Kritva Runtime.

The application does not directly depend on:

- Control Plane API;
- PostgreSQL;
- cloud credentials;
- RaaS billing;
- booking database.

It uses platform/runtime APIs.

This separation improves portability.

## 48. Application Data Flow

Primary application flow:

    Studio
      |
      | API
      v
    Control Plane
      |
      +--> PostgreSQL
      +--> Object Storage
      +--> Queue
      |
      v
    Worker
      |
      | Lab Protocol
      v
    Lab Agent
      |
      v
    Kritva Runtime
      |
      v
    Robot

Observation flow:

    Robot
      |
      v
    Runtime
      |
      v
    Lab Agent
      |
      v
    Control Plane
      |
      +--> WebSocket
      +--> Telemetry Storage
      +--> Log Storage
      |
      v
    Studio / Web Console

## 49. Project-to-Execution Flow

    Project
       |
       v
    Local Source
       |
       v
    Local Build
       |
       v
    Artifact
       |
       v
    Platform Compatibility
       |
       v
    Booking
       |
       v
    Job
       |
       v
    Run
       |
       v
    Result

The project remains the logical parent of development activity.

The run is a historical execution record.

## 50. Build-Locally Boundary

The architecture explicitly prohibits making cloud compilation a required step for
normal execution.

The standard application path is:

    Source
      |
      v
    Studio Local Runtime
      |
      v
    .krv
      |
      v
    RaaS

Not:

    Source
      |
      v
    Cloud Build Farm
      |
      v
    Robot

Cloud builds may be introduced later as an optional product capability, but that would
require a separate security and source-code trust model.

## 51. Artifact-Only Boundary

Once the artifact is uploaded, the Control Plane works with artifact metadata and
binary content.

It does not require:

- Git repository access;
- source tree access;
- editor access;
- local filesystem access.

This is a core IP-protection property.

## 52. Booking-to-Job Flow

    User
      |
      v
    Web/Studio
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
      v
    CONFIRMED
      |
      v
    job.create
      |
      v
    job.start
      |
      v
    Execution

Booking and execution remain separate entities.

A confirmed booking does not automatically start a job.

## 53. Job-to-Lab Flow

    job.create
        |
        v
    Authorization
        |
        v
    Artifact validation
        |
        v
    Booking validation
        |
        v
    Resource allocation
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
    Deployment
        |
        v
    Runtime

## 54. Result Flow

    Runtime
       |
       v
    Lab Agent
       |
       +--> result metadata
       +--> result files
       |
       v
    Control Plane
       |
       +--> PostgreSQL
       +--> Object Storage
       |
       v
    Result API
       |
       v
    Studio / Web Console

## 55. Error Flow

Application errors should be represented at multiple levels.

Transport:

    HTTP 4xx / 5xx

Application:

    SUCCESS
    ACCEPTED
    REJECTED
    PENDING
    IN_PROGRESS
    FAILED
    CANCELLED
    TIMEOUT

Domain codes:

    ARTIFACT_INCOMPATIBLE
    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    RESOURCE_UNAVAILABLE
    LAB_AGENT_OFFLINE
    RUNTIME_START_FAILED

The UI should display actionable errors without exposing sensitive internal details.

## 56. Deployment Topology

Development:

    Developer
       |
       +--> Studio
       +--> Local Runtime
       |
       +--> Development Control Plane
                |
                +--> Development DB
                +--> Development Storage
                +--> Development Queue
                +--> Mock Lab Agent

Staging:

    Studio/Web
       |
       v
    Staging Control Plane
       |
       +--> Staging DB
       +--> Staging Storage
       +--> Staging Queue
       |
       v
    Staging Lab Agent
       |
       v
    Test Robot/Simulator

Production:

    Studio/Web
       |
       v
    Production Control Plane
       |
       +--> Production DB
       +--> Production Storage
       +--> Production Queue
       |
       v
    Production Lab Agents
       |
       v
    Production Robots

## 57. Deployment Unit Isolation

Each environment must isolate:

- API instances;
- worker instances;
- database;
- object storage;
- queue;
- secrets;
- Lab Agent credentials.

A development application must not be able to authenticate against production resources.

## 58. Configuration

Application configuration is environment-specific.

Examples:

    API_BASE_URL
    DATABASE_URL
    OBJECT_STORAGE_ENDPOINT
    QUEUE_ENDPOINT
    SECRET_STORE
    LAB_PROTOCOL_ENDPOINT
    TELEMETRY_ENDPOINT

Secrets must not be stored in source control.

Build-time public configuration must be distinguished from secret configuration.

## 59. Application Versioning

Each application should expose a version.

Examples:

    studio 1.0.0
    web-console 1.0.0
    control-plane 1.0.0
    worker 1.0.0
    lab-agent 1.0.0

Compatibility must be evaluated against:

- API version;
- protocol version;
- artifact version;
- runtime version;
- platform version.

## 60. Backward Compatibility

The Control Plane should support compatible Studio and Web Console versions during
normal rollout windows.

Breaking API changes require a version change.

Lab Agent protocol compatibility must be explicit.

Robot runtime compatibility must be declared by platform metadata.

## 61. Authentication Architecture

Studio and Web Console use user authentication.

Lab Agent uses machine identity.

The Control Plane uses service identities for internal dependencies.

The robot application must not receive user authentication credentials.

## 62. Authorization Architecture

Authorization is centralized at the Control Plane.

Example:

    User
      |
      v
    Identity
      |
      v
    Organization
      |
      v
    Project
      |
      v
    Artifact
      |
      v
    Booking
      |
      v
    Job
      |
      v
    Resource

Each transition is checked for authorization.

## 63. Application Security Boundary

The security model is:

    User Device
       |
       | TLS
       v
    API Boundary
       |
       | Authorization
       v
    Domain
       |
       | Controlled adapters
       v
    Infrastructure

The Lab Agent introduces another security boundary:

    Control Plane
       |
       | Authenticated protocol
       v
    Lab Agent
       |
       | Local authorization
       v
    Runtime

## 64. Observability

Each application should produce:

- structured logs;
- metrics;
- health checks;
- traces where practical;
- audit events where applicable.

Required correlation identifiers:

    request_id
    correlation_id
    project_id
    artifact_id
    booking_id
    job_id
    run_id
    resource_id
    lab_id

## 65. Studio Observability

Studio should capture:

- local build failures;
- API failures;
- connection state;
- runtime integration failures;
- crash diagnostics.

Customer source code must not be included in telemetry unless explicitly required
and consented to.

## 66. Control Plane Observability

Control Plane metrics should include:

- request latency;
- request rate;
- error rate;
- authentication failures;
- authorization failures;
- artifact validation failures;
- booking conflicts;
- job transitions;
- worker queue depth;
- database latency;
- storage errors;
- Lab Agent connectivity.

## 67. Lab Agent Observability

Lab Agent should report:

- heartbeat;
- resource state;
- runtime health;
- deployment status;
- job status;
- telemetry health;
- local errors;
- robot connectivity.

The Lab Agent must remain operational enough to report degraded state even if cloud
connectivity is impaired.

## 68. Application Lifecycle

Applications follow:

    Development
        |
        v
    Build
        |
        v
    Test
        |
        v
    Package
        |
        v
    Release Candidate
        |
        v
    Staging
        |
        v
    Production
        |
        v
    Monitor
        |
        v
    Patch / Rollback

The same lifecycle applies independently to:

- Studio;
- Web Console;
- Control Plane;
- Worker;
- Lab Agent.

## 69. Release Coordination

Application releases must identify compatibility.

A release record should include:

- application versions;
- API version;
- protocol version;
- artifact format;
- runtime compatibility;
- database migration version;
- infrastructure requirements.

A release cannot be promoted merely because one application passes its own tests.

Cross-application compatibility is required.

## 70. Database Migration Ownership

Database schema changes are owned by the Control Plane release process.

The Studio and Web Console do not run database migrations.

Migration execution should be:

- versioned;
- repeatable;
- reviewed;
- tested in staging;
- observable;
- reversible where practical.

## 71. API Contract Ownership

The Control Plane owns public API behavior.

Shared contracts are maintained in:

    packages/contracts/

The API client is maintained in:

    packages/api-client/

Studio and Web Console consume the shared contract definitions.

## 72. Shared UI Ownership

Reusable UI components belong in:

    packages/ui/

They should not contain application-specific business rules.

Studio and Web Console may use different application shells while sharing visual primitives.

## 73. API Client Ownership

The shared API client provides:

- authentication handling;
- request serialization;
- response parsing;
- error normalization;
- retry policy;
- idempotency headers;
- correlation headers.

Business workflows remain in the consuming application.

## 74. State Ownership Matrix

| State | Authority |
|---|---|
| UI selection | Studio/Web Console |
| Source code | User workstation |
| Build state | Local Runtime |
| Artifact metadata | Control Plane |
| Artifact binary | Object Storage |
| Booking | Control Plane |
| Credit ledger | Control Plane |
| Job | Control Plane |
| Run | Control Plane |
| Lab resource | Lab + Control Plane reconciliation |
| Runtime state | Runtime, reported through Lab Agent |
| Physical safety state | Robot safety system |
| Video stream state | Media system |
| Historical result | Control Plane + Object Storage |

## 75. Application Boundaries and Responsibilities

| Boundary | Left Side | Right Side | Contract |
|---|---|---|---|
| Desktop IPC | Studio UI | Local Runtime | Tauri IPC |
| Public API | Studio/Web | Control Plane | REST/OpenAPI |
| Realtime | Studio/Web | Control Plane | WebSocket |
| Storage | Control Plane | Object Storage | Storage adapter |
| Persistence | Control Plane | PostgreSQL | Repository |
| Async | Control Plane | Queue | Queue interface |
| Lab | Control Plane | Lab Agent | Lab Protocol |
| Runtime | Lab Agent | Kritva Runtime | Runtime contract |
| Robot | Runtime | Hardware | Platform API |

## 76. Application Failure Boundaries

A failure should remain localized where possible.

| Failure | Expected Impact |
|---|---|
| Studio crash | UI unavailable; job may continue |
| Web Console outage | Web UI unavailable |
| API outage | New control operations unavailable |
| Worker outage | Async processing delayed |
| Database outage | Business operations degraded/unavailable |
| Storage outage | Artifact/result transfer degraded |
| Queue outage | Async execution delayed |
| Lab Agent outage | Lab unavailable |
| Runtime crash | Current run fails |
| Robot outage | Current run fails |
| Video outage | Observation degraded |
| Telemetry outage | Monitoring degraded |
| Physical safety event | Execution must follow safety policy |

## 77. Recovery Principles

Applications must recover from transient failure without creating duplicate side effects.

Examples:

- Studio reconnects;
- WebSocket reconnects;
- Worker retries;
- Lab Agent reconnects;
- API retries idempotent requests;
- resource locks expire;
- job state is reconciled.

## 78. Scaling Boundaries

The first scaling boundary is the Control Plane process.

The second is workers.

The third may be WebSocket infrastructure.

The fourth is telemetry processing.

The fifth is Lab Agent fleet capacity.

Scaling must not introduce multiple authorities for the same state.

## 79. Horizontal Scaling

Control Plane instances should be stateless with respect to authoritative business state.

Required external state includes:

- PostgreSQL;
- object storage;
- queue;
- shared session/cache where needed.

WebSocket scaling may require a shared event distribution mechanism.

## 80. Worker Scaling

Workers scale according to queue workload.

Examples:

    artifact validation
    job scheduling
    execution dispatch
    result processing

Worker operations must be idempotent because queue delivery may be repeated.

## 81. Lab Agent Scaling

Each Lab Agent represents a lab boundary.

Multiple Lab Agents can connect to one Control Plane.

The Control Plane identifies each by:

- lab ID;
- agent ID;
- capabilities;
- resources;
- software version;
- health state.

## 82. Multi-Lab Architecture

    Control Plane
       |
       +--> Lab A Agent
       |       |
       |       +--> Robots
       |
       +--> Lab B Agent
       |       |
       |       +--> Robots
       |
       +--> Lab C Agent
               |
               +--> Robots

Scheduling selects an eligible lab/resource based on platform, booking, availability,
maintenance, and capability.

## 83. Multi-Platform Architecture

    Platform Catalog
       |
       +--> Humanoid-A
       |       |
       |       +--> Runtime A
       |
       +--> Humanoid-B
       |       |
       |       +--> Runtime B
       |
       +--> Future Platform
               |
               +--> Runtime C

The application architecture does not hard-code one robotic platform.

## 84. Simulation Architecture

Simulation uses the same logical application boundaries.

    Studio
       |
       v
    Control Plane
       |
       v
    Lab Agent / Simulator
       |
       v
    Simulated Runtime
       |
       v
    Simulated Robot

This allows Phase 0-5 development without physical hardware.

## 85. Production Robot Architecture

Production execution becomes:

    Studio/Web
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
    Physical Robot

The application boundaries remain unchanged.

## 86. Phase Mapping Overview

| Phase | Primary Application Work | Deployment State |
|---|---|---|
| 0 | Skeletons and contracts | Local |
| 1 | Studio | Local/Dev |
| 2 | Build/artifact | Local + Dev |
| 3 | Control Plane | Dev Cloud |
| 4 | Booking/commercial | Dev/Staging |
| 5 | Execution | Mock Lab |
| 6 | Lab/robot | Real Lab |
| 7 | Live/results | Real execution |
| 8 | Production | Production |

## 87. Phase 0 — Foundation

Applications:

- Studio shell;
- Local Runtime interface;
- Control Plane skeleton;
- Worker skeleton;
- Mock Lab Agent;
- simulated runtime adapter.

Objectives:

- repository structure;
- shared contracts;
- application startup;
- local integration;
- CI.

Acceptance:

- applications compile;
- interfaces are defined;
- local end-to-end skeleton runs.

## 88. Phase 1 — Studio

Studio becomes functional.

Capabilities:

- authentication;
- dashboard;
- projects;
- platform discovery;
- local runtime integration.

Control Plane remains limited but provides stable API foundations.

Web Console may begin as a minimal authenticated shell.

## 89. Phase 2 — Build and Artifact

Studio Local Runtime becomes functional.

Capabilities:

- build;
- test;
- package;
- manifest;
- checksum;
- signature.

Control Plane supports:

- artifact creation;
- upload;
- metadata;
- validation.

Object storage becomes part of the execution path.

## 90. Phase 3 — Control Plane

Control Plane domains become operational:

- identity;
- organization;
- project;
- platform;
- artifact;
- jobs;
- runs;
- results;
- audit.

Workers become real asynchronous execution infrastructure.

Web Console receives operational user features.

## 91. Phase 4 — Booking and Commercial

Applications add:

- platform availability;
- booking;
- quotes;
- credits;
- billing;
- refunds.

The Web Console becomes important for account and commercial operations.

Studio integrates the same APIs for developer workflows.

## 92. Phase 5 — Execution

The Control Plane orchestrates:

- resource allocation;
- job scheduling;
- artifact deployment;
- runtime startup;
- runtime stop;
- execution status.

The Lab Agent initially targets mock/simulated resources.

## 93. Phase 6 — Lab and Robot

The Lab Agent becomes production-capable.

Capabilities:

- secure registration;
- heartbeat;
- resource discovery;
- real artifact deployment;
- runtime management;
- telemetry;
- logs.

Physical deployment requires safety review.

## 94. Phase 7 — Live and Results

Studio adds:

- WebRTC/video;
- telemetry;
- logs;
- metrics;
- result analysis;
- rerun.

Web Console adds operational views.

The backend adds result processing and media integration.

## 95. Phase 8 — Production

All application units become production hardened.

Required:

- secure deployment;
- high availability where justified;
- backups;
- monitoring;
- alerting;
- audit;
- rollback;
- cost controls;
- operational runbooks;
- production support.

## 96. Risks and Mitigations

| Risk | Application Impact | Mitigation |
|---|---|---|
| Monolith becomes unstructured | High | Explicit modules/interfaces |
| UI duplicates backend logic | Medium | Server authority |
| API breaking changes | High | Versioning/contracts |
| Duplicate jobs | Critical | Idempotency |
| Worker retries duplicate side effects | High | Idempotent processing |
| Lab Agent compromise | Critical | Machine identity, least privilege |
| Source leakage | Critical | Local build/artifact-only |
| Stale UI | Medium | Reconciliation |
| WebSocket loss | Medium | State resync |
| Cloud dependency in robot loop | Critical | Local runtime control |
| Vendor lock-in | Medium | Adapters |
| Excessive service fragmentation | Medium | Modular monolith |
| Poor observability | High | Correlation/metrics/logs |
| Incompatible application versions | High | Compatibility matrix |
| Unsafe physical deployment | Critical | Lab/safety boundary |

## 97. Risk: Application Coupling

The main coupling risks are:

- Studio tightly coupled to backend implementation;
- Lab Agent tightly coupled to cloud internals;
- worker tightly coupled to database details;
- Web Console duplicating Studio logic.

Mitigation:

- contracts;
- API client;
- repository interfaces;
- Lab Protocol;
- domain boundaries.

## 98. Risk: Deployment Coupling

One application should not require simultaneous deployment of all applications unless
a contract-breaking change requires it.

Compatible releases should be independently deployable.

Breaking changes require coordinated release planning.

## 99. Risk: Runtime Drift

Studio, Control Plane, Lab Agent, and Runtime can evolve at different rates.

Mitigation:

- version reporting;
- compatibility matrix;
- protocol version;
- artifact metadata;
- runtime version checks.

## 100. Open Questions

1. Should Web Console and Studio use the same identity provider?
2. Which frontend hosting platform will be used for Web Console?
3. Should WebSocket initially live inside the Control Plane process?
4. Which queue implementation will be used first?
5. Which object-storage provider will be used in production?
6. Should artifact validation run in the API or dedicated workers?
7. What sandboxing mechanism will be used for artifact inspection?
8. Should Lab Agent use outbound-only connectivity?
9. Which telemetry backend will be selected?
10. Which WebRTC architecture will be selected?
11. Should workers initially use one queue or multiple queues?
12. When should WebSocket gateways be independently deployed?
13. What is the first production concurrency target?
14. What are the supported Studio OS versions?
15. Which macOS support tier is required for the first release?
16. Which authentication provider will be used?
17. Which payment integration will be selected?
18. Which notification channels are required?
19. What application-level RPO/RTO targets apply?
20. What is the first production Lab Agent hardware/software baseline?

## 101. Architectural Invariants

The following application invariants must remain true:

1. Studio does not own server business state.
2. Web Console does not own server business state.
3. Control Plane owns business state.
4. Source code remains local during the normal execution path.
5. Artifact is the remote execution boundary.
6. Lab Agent is the cloud-to-lab boundary.
7. Robot runtime remains local.
8. Physical safety remains outside application authority.
9. Database access remains backend-only.
10. Object storage access is controlled by backend policy.
11. Job execution is asynchronous.
12. Financial/resource side effects are idempotent.
13. API contracts are versioned.
14. WebSocket is not authoritative.
15. Video is not a control channel.
16. The initial backend remains a modular monolith.
17. Supporting infrastructure is abstracted behind interfaces.
18. Applications can evolve independently within compatibility constraints.

## 102. Full Acceptance Criteria

### Architecture

- [ ] All primary applications are defined.
- [ ] Supporting services are defined.
- [ ] Application ownership is documented.
- [ ] Deployment units are documented.
- [ ] Application boundaries are explicit.
- [ ] Application responsibilities are explicit.
- [ ] Trust boundaries are explicit.
- [ ] Data ownership is explicit.
- [ ] State authority is explicit.

### Studio

- [ ] Studio architecture is defined.
- [ ] Studio UI responsibilities are defined.
- [ ] Studio API integration is defined.
- [ ] Studio WebSocket integration is defined.
- [ ] Studio Local Runtime boundary is defined.
- [ ] Studio does not access PostgreSQL directly.
- [ ] Studio does not own booking truth.
- [ ] Studio does not own credit truth.
- [ ] Studio does not own job truth.
- [ ] Studio supports reconnect/resynchronization.

### Studio Local Runtime

- [ ] Local build is supported.
- [ ] Local test is supported.
- [ ] Local package is supported.
- [ ] Artifact manifest is generated.
- [ ] Artifact checksum is generated.
- [ ] Artifact signing is supported.
- [ ] Source code is not required remotely.
- [ ] Local filesystem operations are controlled.
- [ ] Toolchain failures are observable.

### Web Console

- [ ] Web Console architecture is defined.
- [ ] User functions are defined.
- [ ] Admin functions are defined.
- [ ] API integration is defined.
- [ ] WebSocket integration is defined.
- [ ] Administrative authorization is enforced.
- [ ] Web Console does not access the database directly.
- [ ] Web Console does not replace local build responsibilities.

### Control Plane

- [ ] Control Plane is a modular monolith initially.
- [ ] API layer is defined.
- [ ] Identity module is defined.
- [ ] Organization module is defined.
- [ ] Project module is defined.
- [ ] Platform module is defined.
- [ ] Artifact module is defined.
- [ ] Booking module is defined.
- [ ] Credit module is defined.
- [ ] Job module is defined.
- [ ] Run module is defined.
- [ ] Result module is defined.
- [ ] Lab module is defined.
- [ ] Audit module is defined.

### Supporting Services

- [ ] Worker architecture is defined.
- [ ] Queue interface is defined.
- [ ] Object storage interface is defined.
- [ ] Repository interfaces are defined.
- [ ] Observability interfaces are defined.
- [ ] Secret-management boundary is defined.
- [ ] Payment integration boundary is defined.

### Lab Agent

- [ ] Lab Agent is a separate deployment unit.
- [ ] Agent identity is defined.
- [ ] Heartbeat is defined.
- [ ] Capability reporting is defined.
- [ ] Resource reporting is defined.
- [ ] Artifact retrieval is defined.
- [ ] Deployment lifecycle is defined.
- [ ] Runtime lifecycle is defined.
- [ ] Telemetry collection is defined.
- [ ] Result collection is defined.
- [ ] Arbitrary shell access is prohibited.
- [ ] Lab disconnect behavior is defined.

### Runtime

- [ ] Kritva Runtime boundary is defined.
- [ ] Runtime lifecycle is defined.
- [ ] Runtime version compatibility is defined.
- [ ] Real-time control remains local.
- [ ] Runtime health is observable.
- [ ] Runtime failure is reported.
- [ ] Cloud services are not required inside control loops.

### Security

- [ ] Authentication is defined.
- [ ] Authorization is server-side.
- [ ] Machine identity is defined.
- [ ] TLS is required.
- [ ] Artifact integrity is verified.
- [ ] Artifact signatures are verified.
- [ ] Secrets are protected.
- [ ] Tenant isolation is enforced.
- [ ] Audit is implemented.
- [ ] Production access is least privilege.

### Reliability

- [ ] Application failure boundaries are defined.
- [ ] Retry behavior is defined.
- [ ] Idempotency is defined.
- [ ] Reconnection is defined.
- [ ] State reconciliation is defined.
- [ ] Resource locking is defined.
- [ ] Deployment rollback is defined.
- [ ] Disaster recovery dependencies are defined.

### Deployment

- [ ] Local deployment is defined.
- [ ] Development deployment is defined.
- [ ] Staging deployment is defined.
- [ ] Production deployment is defined.
- [ ] Application versions are tracked.
- [ ] Compatibility is tracked.
- [ ] Secrets are environment-specific.
- [ ] Production is isolated.
- [ ] Deployment units can be independently released where compatible.

### Phase Evolution

- [ ] Phase 0 architecture is defined.
- [ ] Phase 1 Studio architecture is defined.
- [ ] Phase 2 artifact architecture is defined.
- [ ] Phase 3 Control Plane architecture is defined.
- [ ] Phase 4 commercial architecture is defined.
- [ ] Phase 5 execution architecture is defined.
- [ ] Phase 6 lab architecture is defined.
- [ ] Phase 7 live/results architecture is defined.
- [ ] Phase 8 production architecture is defined.

## 103. Final Application Architecture Baseline

The Kritva RaaS application architecture is based on four primary application boundaries:

    Studio
       |
       +--> local development experience

    Web Console
       |
       +--> web, commercial, administrative experience

    Control Plane
       |
       +--> business authority and orchestration

    Lab Agent
       |
       +--> physical laboratory boundary

Supporting services provide:

    Workers
       |
       +--> asynchronous execution

    PostgreSQL
       |
       +--> authoritative business state

    Object Storage
       |
       +--> artifacts and large result objects

    Queue
       |
       +--> asynchronous work delivery

    Observability
       |
       +--> operational visibility

The execution chain is:

    Local Source
        |
        v
    Studio Local Runtime
        |
        v
    Signed .krv Artifact
        |
        v
    Control Plane
        |
        v
    Worker / Scheduler
        |
        v
    Lab Agent
        |
        v
    Kritva Runtime
        |
        v
    Robot

The observation chain is:

    Robot
        |
        v
    Kritva Runtime
        |
        v
    Lab Agent
        |
        v
    Control Plane
        |
        +--> WebSocket
        +--> Results
        +--> Telemetry
        +--> Logs
        |
        v
    Studio / Web Console

The commercial chain is:

    Platform
        |
        v
    Credit Plan
        |
        v
    Quote
        |
        v
    Booking
        |
        v
    Consumption
        |
        v
    Ledger / Billing

The architecture therefore maintains a clear separation between:

- local development and remote execution;
- source code and execution artifact;
- user applications and backend authority;
- backend orchestration and physical robot control;
- transactional state and realtime events;
- application control and video;
- cloud services and laboratory infrastructure.

This application architecture is the implementation-level expression of the Kritva RaaS
system architecture and shall remain consistent with the product-wide principle:

> Build locally. Book remotely. Upload the artifact. Run on real robots. Observe live. Analyze results. Run again.
