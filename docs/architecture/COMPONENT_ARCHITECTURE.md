# Kritva RaaS Component Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Component Architecture |
| Path | `docs/architecture/COMPONENT_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Architecture Level | Component |
| Status | Architecture Baseline |
| Primary Audience | Application, Backend, Platform, Lab, Security, QA |
| Primary Applications | Studio, Web Console, Control Plane, Lab Agent |
| Backend Model | Modular Monolith |
| Public API | REST `/api/v1/` |
| Realtime API | WebSocket |
| Execution Boundary | `.krv` artifact |
| Physical Boundary | Lab Agent |
| Runtime Boundary | Kritva Runtime |

## 2. Purpose

This document defines the internal component architecture of the Kritva RaaS
applications.

The system architecture defines the overall product boundaries.

The application architecture defines the major deployable applications.

This document defines the components inside those applications and the dependencies
between them.

The primary objective is to prevent the implementation from becoming a collection of
tightly coupled modules with unclear ownership.

The architecture establishes:

- component responsibilities;
- component ownership;
- component interfaces;
- dependency direction;
- data ownership;
- state ownership;
- lifecycle responsibilities;
- synchronous and asynchronous interactions;
- application boundaries;
- shared-library boundaries;
- infrastructure adapter boundaries;
- Lab Agent components;
- Studio components;
- Control Plane components;
- supporting components.

The architecture is intended to remain valid from Phase 0 through Phase 8.

## 3. Scope

This document covers the following components.

### Studio

- Application Shell
- UI Components
- UI State
- Server State
- API Client
- Realtime Client
- Local Runtime Client
- Artifact Client
- Booking Client
- Job/Run Client
- Result Client
- Authentication Client

### Web Console

- Application Shell
- User UI
- Admin UI
- State Management
- API Client
- Realtime Client
- Authentication Client

### Control Plane

- API Gateway/HTTP Layer
- Authentication
- Authorization
- Organization
- Project
- Platform
- Artifact
- Booking
- Credit
- Job
- Run
- Result
- Lab
- Audit
- Event
- Scheduling/Resource Allocation
- Application Services
- Repository Interfaces
- Object Storage Adapter
- Queue Adapter
- Secret Adapter
- Observability Adapter

### Lab Agent

- Protocol Client
- Agent Identity
- Agent Configuration
- Resource Manager
- Artifact Manager
- Deployment Manager
- Runtime Manager
- Telemetry Collector
- Log Collector
- Result Collector
- Health/Heartbeat Manager
- Local Policy/Safety Boundary

## 4. Architectural Goals

The component architecture shall:

1. Give each component one clear primary responsibility.
2. Keep business logic out of presentation components.
3. Keep infrastructure-specific logic behind adapters.
4. Keep source code on the developer workstation.
5. Make `.krv` the remote execution boundary.
6. Keep the Control Plane authoritative for business state.
7. Keep PostgreSQL access behind repository interfaces.
8. Keep object storage behind an adapter.
9. Keep queue operations behind an adapter.
10. Keep Lab access behind the Lab Protocol.
11. Keep robot control behind Kritva Runtime.
12. Support synchronous and asynchronous workflows.
13. Make components testable in isolation.
14. Allow future service extraction.
15. Avoid premature microservice fragmentation.

## 5. Non-Goals

This document does not define:

- physical robot hardware design;
- motor-control algorithms;
- detailed database schema;
- cloud network topology;
- exact WebRTC implementation;
- exact payment provider;
- detailed artifact binary encoding;
- UI visual design;
- physical emergency-stop implementation.

Those concerns are defined by their respective architecture documents.

## 6. Component Design Principles

### 6.1 Single Responsibility

Each component should have one primary reason to change.

### 6.2 Explicit Dependencies

Dependencies must be visible through interfaces rather than hidden through global access.

### 6.3 Dependency Direction

Higher-level business policy should not depend directly on infrastructure implementations.

The preferred direction is:

    UI
      |
      v
    Application Services
      |
      v
    Domain Components
      |
      v
    Repository / Adapter Interfaces
      |
      v
    Infrastructure

### 6.4 Stable Contracts

Components crossing application boundaries require explicit versioned contracts.

### 6.5 Authoritative State

Each state category has one authoritative owner.

### 6.6 Locality of Real-Time Control

Real-time robot control remains outside cloud application components.

## 7. Component Classification

Components are classified as:

| Type | Purpose |
|---|---|
| Presentation | User interaction |
| State | Client/server state management |
| Application | Workflow orchestration |
| Domain | Business rules |
| Integration | External system interaction |
| Infrastructure | Persistence/transport |
| Runtime | Local execution |
| Observation | Telemetry/logs/events |
| Security | Identity/authorization |
| Safety Boundary | Physical execution protection |

## 8. Overall Component Diagram

    +----------------------------------------------------------------+
    |                         STUDIO                                 |
    |                                                                |
    |  UI Shell                                                      |
    |      |                                                         |
    |      +--> UI State                                             |
    |      +--> Server State                                         |
    |      +--> API Client ----------------------------------+       |
    |      +--> Realtime Client                              |       |
    |      +--> Local Runtime Client                         |       |
    |                                                           |    |
    +-----------------------------------------------------------|----+
                                                                |
                                                                v
    +----------------------------------------------------------------+
    |                       CONTROL PLANE                            |
    |                                                                |
    | API --> Auth --> Authorization                                 |
    |   |                                                            |
    |   +--> Project                                                  |
    |   +--> Platform                                                 |
    |   +--> Artifact                                                 |
    |   +--> Booking                                                  |
    |   +--> Credit                                                   |
    |   +--> Job --> Scheduler --> Lab                                |
    |   +--> Run                                                      |
    |   +--> Result                                                   |
    |   +--> Audit                                                    |
    |                                                                |
    | Repository Interfaces / Infrastructure Adapters                |
    +-------------+----------------------+----------------------------+
                  |                      |
                  v                      v
             PostgreSQL             Object Storage
                                         |
                                         v
                                      Queue
                                         |
                                         v
                                      Worker
                                         |
                                         v
    +----------------------------------------------------------------+
    |                         LAB AGENT                               |
    |                                                                |
    | Protocol --> Resource --> Artifact --> Deployment --> Runtime   |
    |     |          |             |             |           |        |
    |     +----------+-------------+-------------+-----------+        |
    |                                                                |
    | Telemetry / Logs / Results / Health                            |
    +----------------------------------------------------------------+
                                         |
                                         v
                                  Kritva Runtime
                                         |
                                         v
                                      Robot

## 9. Dependency Rules

The following dependency rules are mandatory.

1. UI components may depend on application-facing state interfaces.
2. UI components shall not access repositories.
3. Client components shall not access PostgreSQL.
4. Domain components shall not depend on React.
5. Domain components shall not depend on Tauri.
6. Domain components shall not depend directly on cloud SDKs.
7. Control Plane modules shall use repository interfaces.
8. Control Plane modules shall use integration interfaces.
9. Workers shall use application/domain services.
10. Lab Agent shall use the Lab Protocol.
11. Robot applications shall not depend on Control Plane internals.
12. Runtime control shall remain local to the robot.
13. Infrastructure adapters shall implement interfaces defined by application layers.
14. Shared contracts shall not contain application-specific UI logic.

## 10. Studio Component Architecture

The Studio is divided into presentation, state, client, and native-runtime components.

    +------------------------------------------------------+
    | Studio                                               |
    |                                                      |
    |  +---------------- Application Shell --------------+ |
    |  |                                                  | |
    |  | UI Components                                    | |
    |  +--------------------+-----------------------------+ |
    |                       |                               |
    |              +--------+--------+                      |
    |              |                 |                      |
    |          UI State        Server State                 |
    |              |                 |                      |
    |              +--------+--------+                      |
    |                       |                               |
    |                Application Hooks                     |
    |                       |                               |
    |       +---------------+----------------+              |
    |       |               |                |              |
    |    API Client    Realtime Client   Runtime Client     |
    |                                      |               |
    +--------------------------------------|---------------+
                                           |
                                           v
                                     Local Runtime

## 11. Studio Application Shell

The Application Shell owns:

- application startup;
- route initialization;
- global error handling;
- authentication bootstrap;
- application configuration;
- top-level layout;
- navigation;
- session lifecycle.

It does not implement domain business rules.

## 12. Studio UI Components

UI components render:

- projects;
- platforms;
- artifacts;
- bookings;
- jobs;
- runs;
- results;
- credits;
- account state.

Components should receive state through application hooks or view models.

They should not make raw HTTP calls.

## 13. Studio UI State

UI state includes:

- selected project;
- selected platform;
- active page;
- active tab;
- filters;
- dialogs;
- form state;
- local preferences;
- transient notifications.

UI state is not server state.

## 14. Studio Server State

Server state includes:

- user;
- organization;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

Server state should be managed through a server-state library such as TanStack Query.

The client must support invalidation and refresh after mutations.

## 15. Studio API Client

The API Client provides a typed interface to the Control Plane.

Responsibilities:

- request construction;
- authentication headers;
- serialization;
- response parsing;
- error normalization;
- retry policy;
- idempotency headers;
- correlation identifiers.

The API Client should not contain business workflow logic.

## 16. Studio Realtime Client

The Realtime Client provides:

- WebSocket connection;
- authentication;
- subscriptions;
- reconnect;
- event parsing;
- event routing;
- connection status.

It must not treat received events as authoritative without reconciliation.

## 17. Studio Local Runtime Client

The Local Runtime Client communicates with the native/local runtime.

It exposes operations such as:

    build.configure
    build.start
    build.cancel
    build.status
    build.logs
    artifact.package
    artifact.sign
    toolchain.detect

The exact IPC contract is versioned.

## 18. Studio Artifact Component

The Artifact component provides the Studio-side workflow for:

- listing artifacts;
- viewing metadata;
- initiating upload;
- validating artifact status;
- selecting an artifact for execution.

The actual binary transfer may use direct object storage access.

## 19. Studio Booking Component

The Booking component provides:

- availability;
- quote;
- booking creation;
- booking modification;
- cancellation;
- booking history.

It does not determine booking truth.

The Control Plane remains authoritative.

## 20. Studio Execution Component

The Execution component provides:

- job creation;
- start;
- stop;
- cancel;
- status;
- run observation.

The UI must distinguish:

- job stop;
- runtime stop;
- safety stop;
- physical emergency stop.

## 21. Studio Results Component

The Results component provides:

- run history;
- result summary;
- metrics;
- files;
- downloads;
- rerun.

Historical result records should be treated as immutable.

## 22. Web Console Component Architecture

The Web Console follows a similar component structure but has a different purpose.

    +---------------------------------------------------+
    | Web Console                                       |
    |                                                   |
    | Application Shell                                 |
    |       |                                           |
    |       +--> User UI                                |
    |       +--> Admin UI                               |
    |       +--> State                                  |
    |       +--> API Client                             |
    |       +--> Realtime Client                        |
    |       +--> Auth Client                            |
    +---------------------+-----------------------------+
                          |
                          v
                    Control Plane

## 23. Web Console Application Shell

The shell owns:

- route handling;
- session initialization;
- role-aware navigation;
- layout;
- global notifications;
- error boundaries.

## 24. Web Console User Components

User components expose:

- dashboard;
- projects;
- platforms;
- bookings;
- jobs;
- results;
- credits;
- billing;
- profile.

They consume the same backend contracts as Studio.

## 25. Web Console Admin Components

Admin components expose:

- users;
- organizations;
- platforms;
- labs;
- hardware;
- bookings;
- jobs;
- usage;
- credit plans;
- payments;
- refunds;
- monitoring;
- audit logs;
- settings.

Administrative permissions are enforced by the Control Plane.

## 26. Control Plane Component Architecture

The Control Plane consists of:

1. Transport layer.
2. Security layer.
3. Application services.
4. Domain modules.
5. Event subsystem.
6. Repository interfaces.
7. Infrastructure adapters.
8. Background workers.

    HTTP / WebSocket
          |
          v
    +-------------------+
    | Transport Layer   |
    +---------+---------+
              |
              v
    +-------------------+
    | Auth / Policy     |
    +---------+---------+
              |
              v
    +-------------------+
    | Application       |
    | Services          |
    +---------+---------+
              |
              v
    +-------------------+
    | Domain Modules    |
    +---------+---------+
              |
              v
    +-------------------+
    | Ports / Adapters  |
    +----+---------+----+
         |         |
         v         v
       DB       Storage/Queue

## 27. Transport Layer

The transport layer contains:

- HTTP routing;
- request parsing;
- request validation;
- response serialization;
- error mapping;
- WebSocket transport;
- request correlation.

It maps transport concepts into application commands.

It should not contain domain rules.

## 28. Authentication Component

The Authentication component:

- verifies user credentials/session;
- establishes identity;
- validates tokens;
- manages refresh;
- creates authenticated request context.

It does not decide whether a user can access a particular project or robot.

## 29. Authorization Component

Authorization evaluates:

- actor;
- organization;
- role;
- resource;
- action;
- context.

Conceptually:

    authorize(actor, action, resource, context)
        |
        +--> identity
        +--> organization membership
        +--> role
        +--> resource ownership
        +--> policy
        |
        v
    ALLOW / DENY

Authorization is mandatory for protected operations.

## 30. Organization Component

The Organization component owns:

- organization creation;
- membership;
- roles;
- organization settings;
- tenant context.

It is used by authorization and commercial workflows.

## 31. Project Component

The Project component owns:

- project creation;
- metadata;
- lifecycle;
- organization association;
- artifact references.

It does not own artifact binaries.

## 32. Platform Component

The Platform component owns:

- supported platforms;
- platform versions;
- architecture;
- capabilities;
- runtime compatibility;
- SDK compatibility;
- resource requirements.

It provides compatibility information to Artifact and Job components.

## 33. Artifact Component

The Artifact component owns:

- artifact metadata;
- manifest validation;
- checksum;
- signature metadata;
- format validation;
- compatibility validation;
- artifact lifecycle.

Dependencies:

    Artifact
       |
       +--> Platform
       +--> ObjectStorage
       +--> Security/Policy
       +--> Audit

## 34. Artifact Validation Pipeline

    Artifact Upload
         |
         v
    Format Validation
         |
         v
    Manifest Validation
         |
         v
    Checksum Validation
         |
         v
    Signature Validation
         |
         v
    Platform Compatibility
         |
         v
    Security Policy
         |
         v
    ACCEPT / REJECT

The pipeline should be deterministic and auditable.

## 35. Booking Component

The Booking component owns:

- availability;
- quotes;
- reservation;
- cancellation;
- modification;
- booking status.

Dependencies:

    Booking
       |
       +--> Platform
       +--> Resource/Scheduler
       +--> Credit
       +--> Organization
       +--> Audit

## 36. Booking Transaction Boundary

Booking creation must be transactional.

Conceptually:

    Availability Check
          |
          v
    Resource Lock
          |
          v
    Credit/Quote Validation
          |
          v
    Booking Creation
          |
          v
    Commit

If the transaction fails, the resource must not remain incorrectly reserved.

## 37. Credit Component

The Credit component owns:

- credit plans;
- platform association;
- balances;
- rates;
- quotes;
- consumption;
- refunds;
- ledger entries.

Credit operations must be idempotent.

## 38. Credit Dependency

    Booking
       |
       v
    Credit Quote
       |
       v
    Credit Authorization
       |
       v
    Job Execution
       |
       v
    Credit Consumption
       |
       v
    Ledger

Consumption must be based on authoritative execution data and policy.

## 39. Job Component

The Job component owns execution requests.

It validates:

- artifact;
- booking;
- platform;
- user authorization;
- credits;
- resource eligibility.

It coordinates with the scheduler.

## 40. Job Lifecycle

The job state machine is:

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
       +--> STOPPING --> COMPLETED
       |
       +--> FAILED
       |
       +--> CANCELLED
       |
       +--> TIMEOUT

The exact transition rules are owned by the Job component.

## 41. Scheduler Component

The Scheduler selects an eligible resource.

Inputs include:

- booking;
- platform;
- resource availability;
- capabilities;
- maintenance state;
- Lab Agent health;
- artifact compatibility.

It must not allocate resources that are:

- unavailable;
- incompatible;
- in maintenance;
- in safety fault;
- already locked.

## 42. Resource Allocation Component

Resource allocation creates a controlled reservation/lease.

A lease should include:

- resource ID;
- job ID;
- booking ID;
- owner;
- creation time;
- expiration;
- execution epoch.

Expired leases must be recoverable.

## 43. Run Component

The Run component records actual execution.

It owns:

- run creation;
- run state;
- timestamps;
- runtime metadata;
- failure information;
- metrics references;
- result references.

A run must remain traceable to:

- project;
- artifact;
- booking;
- job;
- platform;
- resource;
- lab.

## 44. Result Component

The Result component owns:

- result metadata;
- result files;
- summaries;
- metrics;
- download authorization;
- retention.

Dependencies:

    Result
       |
       +--> Run
       +--> ObjectStorage
       +--> Audit

## 45. Lab Component

The Lab component represents cloud-side knowledge of laboratory resources.

It owns:

- lab registration;
- Lab Agent registration;
- heartbeat state;
- resource inventory;
- capabilities;
- maintenance state;
- dispatch;
- reconciliation.

It does not directly manipulate hardware.

## 46. Audit Component

The Audit component records significant actions.

It is invoked by:

- Authentication;
- Authorization failures;
- Artifact;
- Booking;
- Credit;
- Job;
- Lab;
- Administration.

Audit events must not depend on client-side logging.

## 47. Event Component

The Event component creates and distributes application events.

Examples:

    artifact.uploaded
    artifact.accepted
    booking.confirmed
    job.queued
    job.running
    job.completed
    robot.online
    robot.offline
    telemetry.updated

Events are notifications of state changes.

They are not the authoritative state store.

## 48. Application Service Layer

Application services orchestrate multi-component workflows.

Examples:

- CreateBookingService;
- UploadArtifactService;
- StartJobService;
- StopJobService;
- ExecuteRunService;
- CollectResultService.

An application service may coordinate multiple domain components.

For example:

    StartJobService
        |
        +--> Authorization
        +--> Booking
        +--> Artifact
        +--> Credit
        +--> Scheduler
        +--> Job
        +--> Lab

This avoids putting cross-domain orchestration inside one domain entity.

## 49. Repository Components

Repositories abstract persistence.

Interfaces include:

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

Repositories return domain/application objects rather than leaking database-specific
implementation details.

## 50. Object Storage Component

The Object Storage adapter handles:

- artifact upload;
- artifact retrieval;
- result upload;
- result retrieval;
- deletion;
- signed URLs;
- existence checks.

The Control Plane owns authorization.

The storage provider does not define business authorization.

## 51. Queue Component

The Queue adapter handles:

- enqueue;
- dequeue;
- acknowledgment;
- rejection;
- retry metadata;
- dead-letter handling.

Workers must process messages idempotently.

## 52. Worker Components

The Worker runtime executes asynchronous application services.

Logical worker classes include:

    ArtifactWorker
    BookingWorker
    ExecutionWorker
    ResultWorker
    MaintenanceWorker

The first deployment may combine them.

The architecture permits later separation.

## 53. Worker Dependency Rules

Workers may depend on:

- application services;
- domain components;
- repositories;
- queue;
- storage;
- observability.

Workers must not:

- duplicate business rules;
- directly modify UI state;
- bypass authorization;
- directly access robot hardware.

## 54. Lab Agent Component Architecture

The Lab Agent is divided into:

    +----------------------------------------------------+
    | Lab Agent                                          |
    |                                                    |
    | Protocol Client                                    |
    |       |                                            |
    |       +--> Identity                                |
    |       +--> Configuration                           |
    |       +--> Health/Heartbeat                         |
    |       +--> Resource Manager                         |
    |       +--> Artifact Manager                         |
    |       +--> Deployment Manager                       |
    |       +--> Runtime Manager                          |
    |       +--> Telemetry Collector                      |
    |       +--> Log Collector                            |
    |       +--> Result Collector                         |
    |       +--> Local Policy                             |
    +----------------------------------------------------+

## 55. Lab Protocol Client

The Protocol Client owns:

- secure connection;
- message encoding;
- authentication;
- request correlation;
- retries;
- heartbeat transport;
- protocol version negotiation.

It does not implement robot-specific business logic.

## 56. Agent Identity Component

Agent identity provides:

- unique agent ID;
- credential/certificate;
- registration;
- authentication;
- credential rotation.

Identity is separate from user identity.

## 57. Agent Configuration Component

Configuration includes:

- lab ID;
- agent ID;
- Control Plane endpoint;
- credential location;
- supported protocol versions;
- resource mappings;
- runtime configuration;
- local policy.

Secrets must be stored securely.

## 58. Health and Heartbeat Component

The heartbeat component reports:

- agent health;
- software version;
- connectivity;
- resource summary;
- last successful communication.

The Control Plane uses heartbeat state to determine agent availability.

## 59. Resource Manager

The Resource Manager discovers and manages local resources.

Examples:

- robot;
- camera;
- compute host;
- simulator;
- test station.

It reports:

- resource ID;
- type;
- platform;
- capabilities;
- state;
- health;
- maintenance status.

## 60. Artifact Manager

The Artifact Manager:

- retrieves authorized artifacts;
- validates checksum;
- validates signature;
- stages files;
- controls local artifact lifecycle.

It must not retrieve arbitrary object-storage objects.

Artifact access must be authorized by the Lab Protocol.

## 61. Deployment Manager

The Deployment Manager:

- prepares deployment;
- validates resource;
- stages artifact;
- configures runtime;
- performs preflight;
- reports deployment status.

Deployment must be reversible where practical.

## 62. Runtime Manager

The Runtime Manager controls:

- runtime startup;
- runtime stop;
- runtime status;
- health;
- process supervision;
- execution metadata.

It communicates with Kritva Runtime through a controlled local interface.

## 63. Telemetry Collector

The Telemetry Collector receives:

- robot telemetry;
- runtime metrics;
- system metrics;
- resource metrics.

It applies:

- sampling;
- aggregation;
- filtering;
- batching.

It forwards telemetry through the Lab Protocol.

## 64. Log Collector

The Log Collector gathers:

- runtime logs;
- application logs;
- deployment logs;
- agent logs.

Logs should include:

- timestamps;
- severity;
- job ID;
- run ID;
- resource ID.

## 65. Result Collector

The Result Collector:

- identifies generated results;
- validates result completeness;
- uploads result objects;
- creates result metadata;
- reports completion.

## 66. Local Policy Component

The Local Policy component defines behavior during:

- cloud disconnect;
- Lab Agent restart;
- runtime failure;
- robot fault;
- command timeout.

It must respect physical safety systems.

It must never bypass an E-stop or safety interlock.

## 67. Component Interaction: Artifact Flow

    Studio UI
       |
       v
    Studio API Client
       |
       v
    Artifact API
       |
       v
    Artifact Component
       |
       +--> Authorization
       +--> Platform Compatibility
       +--> Object Storage
       +--> Audit

Later:

    Worker
       |
       v
    Artifact Validation
       |
       v
    ACCEPTED

## 68. Component Interaction: Booking Flow

    Studio/Web
       |
       v
    API Client
       |
       v
    Booking API
       |
       v
    Booking Component
       |
       +--> Authorization
       +--> Platform
       +--> Scheduler
       +--> Credit
       +--> Repository
       +--> Audit

Result:

    CONFIRMED Booking

## 69. Component Interaction: Job Flow

    Studio
       |
       v
    Job API
       |
       v
    Job Component
       |
       +--> Authorization
       +--> Artifact
       +--> Booking
       +--> Credit
       +--> Scheduler
       |
       v
    Queue
       |
       v
    Execution Worker
       |
       v
    Lab Component
       |
       v
    Lab Agent

## 70. Component Interaction: Execution Flow

    Execution Worker
        |
        v
    Lab Component
        |
        v
    Lab Protocol Client
        |
        v
    Lab Agent
        |
        +--> Artifact Manager
        +--> Deployment Manager
        +--> Runtime Manager
        |
        v
    Kritva Runtime
        |
        v
    Robot

## 71. Component Interaction: Observation Flow

    Robot
       |
       v
    Runtime
       |
       v
    Lab Agent
       |
       +--> Telemetry Collector
       +--> Log Collector
       |
       v
    Lab Protocol
       |
       v
    Control Plane
       |
       +--> Event Component
       +--> Run Component
       +--> Result Component
       |
       v
    WebSocket
       |
       v
    Studio / Web Console

## 72. Component Interaction: Result Flow

    Runtime
       |
       v
    Result Collector
       |
       v
    Lab Component
       |
       v
    Result Component
       |
       +--> PostgreSQL metadata
       +--> Object Storage files
       |
       v
    Result API
       |
       v
    Studio/Web

## 73. Component Interaction: Stop Flow

    User
       |
       v
    Studio
       |
       v
    Job Stop API
       |
       v
    Authorization
       |
       v
    Job Component
       |
       v
    Lab Component
       |
       v
    Lab Agent
       |
       v
    Runtime Manager
       |
       v
    Kritva Runtime

This is an application stop/control operation.

It is not equivalent to physical emergency stop.

## 74. Component Interaction: Reconnect Flow

    Studio
       |
       X WebSocket disconnect
       |
       v
    Reconnect
       |
       v
    Authenticate
       |
       v
    Query authoritative Job/Run state
       |
       v
    Subscribe to events
       |
       v
    Resume observation

The same principle applies to Lab Agent reconnect.

## 75. Component Interaction: Lab Reconciliation

    Lab Agent reconnects
          |
          v
    Report agent state
          |
          v
    Report resource state
          |
          v
    Report active runtime
          |
          v
    Control Plane reconciliation
          |
          v
    Job/Run state correction
          |
          v
    Resource state correction

No automatic continuation should occur unless policy permits it.

## 76. Dependency Matrix

| Component | Auth | Project | Platform | Artifact | Booking | Credit | Job | Run | Result | Lab | Storage | Queue |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Project | X | - | - | - | - | - | - | - | - | - | DB | - |
| Platform | X | - | - | X | X | X | X | - | - | X | DB | - |
| Artifact | X | X | X | - | - | - | X | X | X | X | X | X |
| Booking | X | X | X | - | - | X | X | - | - | X | DB | X |
| Credit | X | X | X | - | X | - | X | - | - | - | DB | - |
| Job | X | X | X | X | X | X | - | X | X | X | DB | X |
| Run | X | X | X | X | X | X | X | - | X | X | DB | X |
| Result | X | X | - | X | - | - | X | X | - | X | X | X |
| Lab | X | - | X | X | X | - | X | X | X | - | X | X |

The matrix represents logical dependency, not necessarily direct code-level dependency.

Cross-domain dependencies should generally be mediated by application services.

## 77. Dependency Direction

Preferred dependency graph:

    Presentation
        |
        v
    Client/Application Hooks
        |
        v
    API/Application Services
        |
        v
    Domain Components
        |
        v
    Ports
        |
        +--> PostgreSQL Adapter
        +--> Storage Adapter
        +--> Queue Adapter
        +--> External Provider Adapter

The reverse direction is prohibited.

Infrastructure must not import presentation code.

## 78. Shared Packages

The monorepo provides shared packages.

Relevant packages include:

    packages/ui/
    packages/contracts/
    packages/api-client/
    packages/auth/
    packages/config/
    packages/utils/

### UI

Reusable visual components.

### Contracts

API/protocol/data contracts.

### API Client

Typed client for Control Plane.

### Auth

Shared client-side authentication primitives.

### Config

Typed configuration.

### Utils

Generic utilities without business ownership.

## 79. Shared Package Rules

Shared packages must not become a dumping ground.

Rules:

- no application-specific business workflows in `packages/utils`;
- no backend database code in frontend packages;
- no React dependency in protocol contracts;
- no cloud-provider SDK in shared contracts;
- no robot-specific hardware code in UI packages.

## 80. Interface Catalog

### Studio to Control Plane

    REST /api/v1/

### Studio to Local Runtime

    Tauri IPC

### Web Console to Control Plane

    REST /api/v1/

### Studio/Web to Realtime

    WebSocket

### Control Plane to Database

    Repository Interfaces

### Control Plane to Object Storage

    ObjectStorage Interface

### Control Plane to Queue

    JobQueue Interface

### Control Plane to Lab Agent

    Lab Protocol

### Lab Agent to Runtime

    Runtime Control Interface

## 81. Synchronous Interface Rules

Synchronous operations should be used for:

- validation;
- metadata retrieval;
- availability queries;
- configuration reads;
- simple mutations.

They should return promptly.

Long-running operations must transition to asynchronous execution.

## 82. Asynchronous Interface Rules

Asynchronous operations include:

- artifact validation;
- deployment;
- job start;
- job stop;
- result processing;
- video session preparation;
- large-scale telemetry processing.

The initiating API returns an accepted/queued response.

The client observes state through:

- polling;
- WebSocket;
- result queries.

## 83. Event Ownership

Events originate from the component that owns the state transition.

For example:

    Job Component
        |
        +--> job.queued
        +--> job.running
        +--> job.completed

The Studio does not manufacture authoritative job events.

## 84. Error Ownership

Errors should be generated at the layer that detects the failure and translated at
the appropriate boundary.

Example:

    Object Storage
        |
        v
    Storage Adapter
        |
        v
    Artifact Service
        |
        v
    Application Error
        |
        v
    API Error Code

Internal implementation details should not leak to users.

## 85. Security Component Dependencies

Security-sensitive components include:

- Authentication;
- Authorization;
- Artifact validation;
- Agent identity;
- Secret adapter;
- Audit.

These components should have minimal dependencies.

Authorization must be available before protected domain operations.

## 86. Component Testing Strategy

Each component requires appropriate testing.

### Unit

- domain rules;
- state transitions;
- validators;
- policy.

### Integration

- repositories;
- object storage;
- queue;
- API;
- Lab Protocol.

### Component

- complete component with dependencies mocked or local.

### End-to-End

- Studio;
- Control Plane;
- Lab Agent;
- Runtime;
- simulated robot.

### Hardware Integration

- physical robot;
- actual runtime;
- safety-reviewed lab environment.

## 87. Component Test Boundaries

A component should be independently testable.

For example:

    Booking Component
       |
       +--> Fake Credit
       +--> Fake Scheduler
       +--> Fake Repository
       |
       v
    Booking Tests

This prevents unit tests from requiring cloud infrastructure.

## 88. Component Configuration

Each component receives typed configuration.

Examples:

    API:
        listen_address
        database
        storage
        queue
        identity
        telemetry

    Worker:
        queue
        concurrency
        retry_policy

    Lab Agent:
        control_plane
        agent_identity
        resource_config
        runtime
        local_policy

Configuration must be validated during startup.

## 89. Component Health

Components should expose internal health where useful.

Control Plane health includes:

- database;
- storage;
- queue;
- identity;
- required dependencies.

Lab Agent health includes:

- protocol;
- runtime;
- resource;
- robot;
- local storage.

A component can be healthy while one optional dependency is degraded.

## 90. Component Lifecycle

Typical component lifecycle:

    Construct
       |
       v
    Configure
       |
       v
    Validate
       |
       v
    Initialize
       |
       v
    Start
       |
       v
    Running
       |
       v
    Stop
       |
       v
    Shutdown

Startup ordering must respect dependencies.

Shutdown should generally occur in reverse dependency order.

## 91. Control Plane Startup

Recommended order:

    Configuration
        |
        v
    Logging / Observability
        |
        v
    Database Connectivity
        |
        v
    Repository Layer
        |
        v
    Domain Services
        |
        v
    Queue
        |
        v
    API
        |
        v
    WebSocket

## 92. Lab Agent Startup

Recommended order:

    Configuration
        |
        v
    Local Identity
        |
        v
    Runtime Discovery
        |
        v
    Resource Discovery
        |
        v
    Local Policy
        |
        v
    Protocol Connection
        |
        v
    Heartbeat
        |
        v
    READY

## 93. Phase Mapping

| Phase | Component Focus | Key Outcome |
|---|---|---|
| 0 | Skeleton components | Contracts and startup |
| 1 | Studio components | Developer UI |
| 2 | Runtime/artifact | Local build |
| 3 | Control Plane | Business authority |
| 4 | Booking/Credit | Commercial control |
| 5 | Job/Lab | Remote execution |
| 6 | Runtime/Robot | Physical execution |
| 7 | Observation/Result | Live operation |
| 8 | Production components | Reliability and scale |

## 94. P0 FOUNDATION

Implement:

- application shells;
- shared contracts;
- Control Plane module skeletons;
- repository interfaces;
- adapter interfaces;
- Lab Agent skeleton;
- mock runtime interface.

Acceptance:

- components compile;
- dependencies are directional;
- interfaces are documented;
- local integration succeeds.

## 95. P1 STUDIO

Implement:

- Studio shell;
- UI state;
- server state;
- API Client;
- authentication client;
- platform/project views;
- Local Runtime Client.

Acceptance:

- user can authenticate;
- project can be displayed;
- platform catalog can be displayed;
- IPC boundary works.

## 96. P2 BUILD & ARTIFACT — Artifact

Implement:

- build workflow;
- artifact component;
- object storage adapter;
- checksum/signature;
- artifact validation;
- artifact upload.

Acceptance:

- `.krv` generated locally;
- upload works;
- server validates;
- incompatible artifacts are rejected.

## 97. P3 CONTROL PLANE

Implement:

- Auth;
- Organization;
- Project;
- Platform;
- Artifact;
- Job;
- Run;
- Result;
- Audit;
- Worker;
- Event components.

Acceptance:

- business state is authoritative;
- API is versioned;
- asynchronous work functions;
- state transitions are persisted.

## 98. P4 BOOKING & COMMERCIAL — Booking and Credit

Implement:

- Booking;
- Credit;
- Scheduler;
- resource allocation.

Acceptance:

- availability works;
- booking conflicts are prevented;
- platform credits are enforced;
- ledger is auditable.

## 99. P5 EXECUTION

Implement:

- Job orchestration;
- Lab component;
- Lab Protocol;
- mock Lab Agent;
- Runtime Manager;
- simulated execution.

Acceptance:

- artifact reaches simulated runtime;
- job state transitions correctly;
- stop/cancel works;
- failures reconcile.

## 100. P6 LAB & ROBOT — Physical Lab

Implement:

- real Lab Agent;
- Agent Identity;
- Resource Manager;
- Artifact Manager;
- Deployment Manager;
- Runtime Manager;
- Health Manager.

Acceptance:

- agent registers;
- robot is discovered;
- artifact deploys;
- runtime executes;
- safety review is complete.

## 101. P7 LIVE & RESULTS

Implement:

- Telemetry Collector;
- Log Collector;
- Result Collector;
- WebSocket observation;
- video integration;
- result UI.

Acceptance:

- live telemetry works;
- logs work;
- video works;
- results are stored;
- rerun works.

## 102. P8 PRODUCTION

Harden:

- authorization;
- auditing;
- scaling;
- worker isolation;
- monitoring;
- alerting;
- recovery;
- deployment;
- configuration;
- security.

Acceptance:

- production release is reproducible;
- recovery is tested;
- application components are observable;
- rollback is demonstrated.

## 103. Component Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Domain coupling | High | Explicit interfaces |
| Circular dependencies | High | Layered dependency rules |
| Shared package bloat | Medium | Package ownership rules |
| Monolith sprawl | High | Modular boundaries |
| Duplicate business logic | High | Application service layer |
| UI business logic | Medium | Backend authority |
| Infrastructure leakage | High | Adapters |
| Worker duplication | High | Idempotency |
| Lab bypass | Critical | Lab Protocol boundary |
| Runtime/cloud coupling | Critical | Local runtime APIs |
| State inconsistency | High | Authoritative stores |
| Version drift | High | Compatibility matrix |

## 104. Risk: Circular Dependencies

Circular dependencies can occur between:

- Booking and Credit;
- Job and Booking;
- Artifact and Platform;
- Lab and Job.

Mitigation:

Use application services to orchestrate cross-domain operations.

For example:

    StartJobService
       |
       +--> Booking
       +--> Credit
       +--> Artifact
       +--> Job
       +--> Lab

Domain components should not recursively call one another without an explicit design.

## 105. Risk: Monolith Sprawl

The Control Plane must remain a modular monolith rather than a collection of globally
shared services.

Each module should have:

- owned models;
- owned business rules;
- owned interfaces;
- explicit dependencies.

Future extraction becomes possible when boundaries are already established.

## 106. Risk: Shared State Leakage

Components must not modify another component's authoritative state directly.

For example:

- Credit cannot be modified by Job SQL;
- Booking cannot be changed by Scheduler SQL;
- Run cannot be changed by Studio;
- Lab resource state cannot be changed by the UI.

Changes occur through component interfaces.

## 107. Risk: Lab Agent Overreach

The Lab Agent must not become a general-purpose administration daemon.

It should expose only:

- registered resources;
- authorized deployment;
- runtime lifecycle;
- telemetry;
- logs;
- results;
- health.

Arbitrary shell access is outside the architecture.

## 108. Risk: Real-Time Boundary Violation

No component in:

- Studio;
- Web Console;
- Control Plane;
- Worker;
- cloud infrastructure;

may become part of the robot's real-time control loop.

The real-time path remains:

    Application
        |
        v
    Kritva Runtime
        |
        v
    Local Hardware Interface
        |
        v
    Robot

## 109. Open Questions

1. Should API and WebSocket transport initially share one process?
2. Should artifact validation run in a dedicated worker from Phase 2?
3. Which runtime sandbox is required for physical execution?
4. Should scheduler and resource allocation remain one component initially?
5. Should telemetry become an independent component in Phase 7?
6. Should WebSocket gateways be extracted when concurrency grows?
7. Which component owns experiment metadata if experiments become first-class?
8. Which component owns simulation resources?
9. Should notifications become a dedicated application service?
10. When should payment operations be extracted from Credit?
11. Which Lab Agent components require independent processes?
12. What is the first production worker concurrency target?
13. Which component owns media session authorization?
14. What is the exact runtime control interface?
15. What compatibility policy applies to older Lab Agents?

## 110. Component Acceptance Checklist

### Studio

- [ ] Application Shell exists.
- [ ] UI components are separated from state.
- [ ] UI state is separated from server state.
- [ ] API Client is typed.
- [ ] Realtime Client is separate.
- [ ] Local Runtime Client is separate.
- [ ] Artifact workflow is separated.
- [ ] Booking workflow is separated.
- [ ] Execution workflow is separated.
- [ ] Result workflow is separated.
- [ ] Studio does not access backend repositories.

### Web Console

- [ ] Application Shell exists.
- [ ] User UI is separated from Admin UI.
- [ ] API Client is shared appropriately.
- [ ] Realtime Client is defined.
- [ ] Authorization is backend enforced.
- [ ] Commercial views are defined.
- [ ] Administrative views are defined.

### Control Plane

- [ ] Transport layer is separate.
- [ ] Authentication is separate.
- [ ] Authorization is separate.
- [ ] Organization component exists.
- [ ] Project component exists.
- [ ] Platform component exists.
- [ ] Artifact component exists.
- [ ] Booking component exists.
- [ ] Credit component exists.
- [ ] Job component exists.
- [ ] Run component exists.
- [ ] Result component exists.
- [ ] Lab component exists.
- [ ] Audit component exists.
- [ ] Event component exists.
- [ ] Application services orchestrate cross-domain workflows.

### Persistence

- [ ] Repository interfaces exist.
- [ ] PostgreSQL is accessed through repositories.
- [ ] Object storage is accessed through an adapter.
- [ ] Queue is accessed through an adapter.
- [ ] Business logic does not depend directly on provider SDKs.

### Workers

- [ ] Worker runtime exists.
- [ ] Workers use application services.
- [ ] Worker operations are idempotent.
- [ ] Retry behavior is defined.
- [ ] Dead-letter behavior is defined.
- [ ] Workers do not bypass authorization.

### Lab Agent

- [ ] Protocol Client exists.
- [ ] Agent Identity exists.
- [ ] Configuration component exists.
- [ ] Health/Heartbeat exists.
- [ ] Resource Manager exists.
- [ ] Artifact Manager exists.
- [ ] Deployment Manager exists.
- [ ] Runtime Manager exists.
- [ ] Telemetry Collector exists.
- [ ] Log Collector exists.
- [ ] Result Collector exists.
- [ ] Local Policy exists.
- [ ] Arbitrary shell access is prohibited.

### Interfaces

- [ ] Studio/Control Plane API is versioned.
- [ ] Studio/Local Runtime IPC is defined.
- [ ] Web Console API is defined.
- [ ] WebSocket interface is defined.
- [ ] Repository interfaces are defined.
- [ ] Object Storage interface is defined.
- [ ] Queue interface is defined.
- [ ] Lab Protocol is defined.
- [ ] Runtime interface is defined.

### State

- [ ] State authority is identified.
- [ ] Component ownership is identified.
- [ ] UI state is not treated as authoritative.
- [ ] WebSocket events are not authoritative.
- [ ] Database state is authoritative for business state.
- [ ] Physical safety state remains locally authoritative.

### Execution

- [ ] Artifact-only execution is enforced.
- [ ] Booking validation occurs before execution.
- [ ] Credit validation occurs before execution.
- [ ] Resource allocation is explicit.
- [ ] Lab Agent is the cloud-to-lab boundary.
- [ ] Runtime control is local.
- [ ] Stop/cancel semantics are defined.
- [ ] Failure reconciliation is defined.

### Security

- [ ] Authentication boundaries are defined.
- [ ] Authorization boundaries are defined.
- [ ] Machine identity is separate from user identity.
- [ ] Artifact integrity is checked.
- [ ] Artifact signatures are checked.
- [ ] Secrets are not embedded in artifacts.
- [ ] Tenant boundaries are enforced.
- [ ] Audit events are generated.

### Testing

- [ ] Components have unit tests.
- [ ] Repository adapters have integration tests.
- [ ] API components have integration tests.
- [ ] Worker flows have integration tests.
- [ ] Lab Protocol has contract tests.
- [ ] End-to-end execution is tested.
- [ ] Physical robot integration is safety reviewed.

## 111. Final Component Architecture Baseline

The Kritva RaaS component architecture is intentionally layered.

The Studio is composed of:

    UI
      |
      v
    State
      |
      v
    API / Realtime / Runtime Clients

The Control Plane is composed of:

    Transport
      |
      v
    Security
      |
      v
    Application Services
      |
      v
    Domain Components
      |
      v
    Repository / Adapter Interfaces
      |
      v
    Infrastructure

The core domain components are:

    Auth
    Organization
    Project
    Platform
    Artifact
    Booking
    Credit
    Job
    Run
    Result
    Lab
    Audit

The Lab Agent is composed of:

    Protocol
      |
      +--> Identity
      +--> Health
      +--> Resources
      +--> Artifact
      +--> Deployment
      +--> Runtime
      +--> Telemetry
      +--> Logs
      +--> Results
      +--> Local Policy

The complete execution dependency is:

    Studio
      |
      v
    API Client
      |
      v
    Control Plane
      |
      +--> Artifact
      +--> Booking
      +--> Credit
      +--> Job
      +--> Scheduler
      |
      v
    Worker
      |
      v
    Lab
      |
      v
    Lab Agent
      |
      v
    Runtime
      |
      v
    Robot

The architecture preserves the fundamental RaaS boundaries:

- source code remains local;
- `.krv` is the remote execution artifact;
- Control Plane owns business state;
- repositories own persistence abstraction;
- adapters isolate infrastructure;
- workers handle asynchronous operations;
- Lab Agent controls the cloud-to-lab boundary;
- Kritva Runtime controls local robot execution;
- physical safety remains independent of cloud application components.

The component architecture therefore provides a stable implementation foundation for the
complete Kritva RaaS product while allowing individual components to evolve, scale, or
eventually become independently deployable services without changing the fundamental
product architecture.
