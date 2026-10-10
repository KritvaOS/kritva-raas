# Kritva RaaS System Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | System Architecture |
| Path | `docs/architecture/SYSTEM_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Architecture Level | Product / System |
| Status | Architecture Baseline |
| Audience | Architecture, Engineering, Product, Security, Cloud, Lab, Robotics |
| Primary Consumers | Studio, Backend, Cloud, Lab, Robot Runtime teams |
| Protocol Baseline | RaaS Protocol v1 |
| API Baseline | REST `/api/v1/` |
| Execution Model | Build locally, upload artifact, execute remotely |
| Deployment Model | Cloud Control Plane + Lab Agent + Robot |
| Primary Product Statement | Build locally. Book remotely. Run on real robots. |

## 2. Purpose

This document defines the product-wide system architecture for Kritva Robotics-as-a-Service (RaaS).

The purpose of this architecture is to establish a stable system boundary between the
developer workstation, Kritva RaaS Studio, the local build environment, the cloud control
plane, cloud persistence services, robotic laboratories, and the robot execution environment.

This document is intentionally broader than an application architecture document.

It defines:

- the complete product topology;
- major system components;
- trust boundaries;
- communication paths;
- ownership boundaries;
- artifact and source-code boundaries;
- build and execution responsibilities;
- booking and resource-control responsibilities;
- cloud and database responsibilities;
- laboratory responsibilities;
- robot-runtime responsibilities;
- security boundaries;
- data flows;
- failure boundaries;
- lifecycle and state ownership;
- phase-by-phase architectural evolution;
- production acceptance criteria.

The architecture is intended to remain valid from the first software-only demonstration
through production operation of multiple physical robotic platforms.

The initial implementation may use simplified components, mock robots, simulated lab
agents, local cloud services, or a modular monolith.

Those simplifications must not invalidate the long-term system boundaries defined here.

## 3. Architectural Intent

Kritva RaaS provides a controlled environment in which a developer can develop robotics
software locally and execute the resulting application remotely on a selected robotic
platform.

The central architectural principle is:

> Source code remains local. Only the required execution artifact crosses the RaaS boundary.

The product therefore separates development from execution.

The intended primary workflow is:

    Developer
        |
        v
    Kritva RaaS Studio
        |
        +--> Studio Local Runtime
        |       |
        |       +--> Build
        |       +--> Test
        |       +--> Package
        |       +--> Sign
        |       |
        |       v
        |    .krv Artifact
        |
        +-------------------- HTTPS / WebSocket --------------------+
                                                                     |
                                                                     v
                                                              RaaS Control Plane
                                                                     |
                              +--------------------------------------+----------------+
                              |                                      |                |
                              v                                      v                v
                         PostgreSQL                            Object Storage       Queue
                              |                                      |                |
                              +--------------------------------------+----------------+
                                                                     |
                                                                     v
                                                               Lab Agent
                                                                     |
                                                                     v
                                                              Kritva Runtime
                                                                     |
                                                                     v
                                                                   Robot

The architecture must preserve this separation throughout all implementation phases.

## 4. Product Goals

### 4.1 Primary Goals

The system shall:

1. Allow users to develop robotics applications locally.
2. Allow users to build and test source code locally.
3. Allow users to generate a portable execution artifact.
4. Allow users to validate artifact compatibility before execution.
5. Allow users to discover supported robotic platforms.
6. Allow users to book robotic resources.
7. Allow users to reserve execution time.
8. Allow users to upload execution artifacts.
9. Allow authorized artifacts to execute remotely.
10. Provide live execution visibility.
11. Provide telemetry, logs, events, and results.
12. Preserve source-code privacy.
13. Support both virtual/simulated and physical robots.
14. Support multiple robot platforms.
15. Support platform-specific credit systems.
16. Provide auditable execution history.
17. Provide administrative control over resources.
18. Provide a production path from software development to physical deployment.
19. Allow the system to evolve without redesigning the complete product.
20. Maintain explicit safety boundaries between cloud control and physical robot safety.

### 4.2 Secondary Goals

The architecture should:

- support multiple organizations;
- support individual users;
- support research and educational users;
- support different robot configurations;
- support multiple laboratories;
- support multiple cloud environments;
- support horizontal scaling of stateless services;
- support asynchronous execution;
- support versioned APIs and protocols;
- support deterministic artifact compatibility checks;
- support auditability;
- support operational monitoring;
- support controlled rollback;
- support future multi-region deployment.

## 5. Non-Goals

The following are explicitly outside the initial system architecture scope:

1. Building a general-purpose remote source-code development environment.
2. Providing a general-purpose cloud compilation farm.
3. Storing customer source repositories as a mandatory RaaS service.
4. Allowing arbitrary remote shell access to robots.
5. Allowing arbitrary cloud applications to directly control robot actuators.
6. Replacing the robot's physical emergency-stop system.
7. Making cloud infrastructure responsible for physical safety decisions.
8. Defining a universal robot hardware abstraction for every vendor.
9. Requiring microservices from the beginning.
10. Requiring Kubernetes for the initial implementation.
11. Requiring a particular cloud provider.
12. Exposing database operations as public RaaS commands.
13. Treating object storage as the authoritative business database.
14. Treating WebSocket connectivity as the source of truth for job state.
15. Treating video streaming as a transactional control channel.
16. Making source-code upload necessary for normal execution.
17. Allowing unvalidated binaries to reach a physical robot.
18. Allowing billing or credit state to be maintained only in the client.

## 6. Architectural Principles

### 6.1 Local Development

The developer owns and controls source code on the local workstation.

The RaaS platform does not require source code to execute an application.

### 6.2 Artifact-Only Remote Execution

The remote system receives a packaged execution artifact.

The canonical artifact format is `.krv`.

The artifact contains the minimum information required to execute the application.

### 6.3 Control Plane as System Authority

The Control Plane is authoritative for:

- identity;
- authorization;
- project metadata;
- platform metadata;
- artifact metadata;
- booking state;
- credit state;
- job state;
- run state;
- execution authorization;
- audit records.

### 6.4 Database as Business-State Authority

PostgreSQL is authoritative for structured transactional state.

Object storage is authoritative for large binary objects.

### 6.5 Lab Agent as Physical Boundary

The Lab Agent is the controlled boundary between cloud services and physical laboratory
resources.

Cloud infrastructure must not directly manipulate motor controllers or robot hardware.

### 6.6 Runtime Safety

Kritva Runtime is responsible for runtime-level application and platform controls.

Physical safety remains the responsibility of the robot safety system, hardware interlocks,
motor controllers, safety PLCs, emergency-stop systems, and laboratory procedures.

### 6.7 Explicit Asynchrony

Long-running operations are asynchronous.

The API must not assume that deployment, execution, video startup, telemetry acquisition,
or result generation completes within a single HTTP request.

### 6.8 Version Everything That Crosses a Boundary

The architecture versions:

- API;
- protocol;
- artifact format;
- runtime compatibility;
- SDK;
- platform definition;
- Lab Agent;
- relevant execution contracts.

### 6.9 Least Privilege

Each component receives only the permissions required for its role.

### 6.10 Fail Closed

Security, authorization, compatibility, booking, credit, and safety validation failures
must prevent execution rather than silently degrading into unauthorized execution.

## 7. System Context

At the highest level, Kritva RaaS contains six major execution domains:

1. User Workstation.
2. RaaS Control Plane.
3. Cloud Persistence and Infrastructure.
4. Robotic Laboratory.
5. Kritva Runtime.
6. Robot Hardware.

The user workstation is controlled by the developer.

The cloud is controlled by the RaaS operator.

The laboratory is controlled by the RaaS operator or an authorized lab partner.

The robot is controlled by the robot platform and runtime stack.

These ownership boundaries are important because security assumptions must not cross them
implicitly.

## 8. High-Level System Diagram

    +-----------------------------------------------------------------------+
    |                         USER WORKSTATION                              |
    |                                                                       |
    |  +----------------------+        +--------------------------------+  |
    |  | Kritva RaaS Studio   |        | Studio Local Runtime            |  |
    |  |                      |        |                                |  |
    |  | Projects             |<------>| Build / Test / Package          |  |
    |  | Platforms            |  IPC   | Artifact Validation             |  |
    |  | Booking              |        | Signing / Toolchains             |  |
    |  | Runs                 |        | Local Logs                       |  |
    |  | Results              |        +----------------+---------------+  |
    |  +----------+-----------+                         |                  |
    |             | HTTPS / WebSocket                   |                  |
    +-------------|-------------------------------------|------------------+
                  |                                     |
                  |                                     |
                  v                                     v
    +-----------------------------------------------------------------------+
    |                         RaaS CONTROL PLANE                             |
    |                                                                       |
    |  +----------------------------------------------------------------+   |
    |  | API / Authentication / Authorization                           |   |
    |  | Projects / Platforms / Artifacts / Booking / Credits           |   |
    |  | Jobs / Runs / Results / Lab / Audit                            |   |
    |  +--------------------------+----------------------+---------------+   |
    |                             |                      |                   |
    +-----------------------------|----------------------|-------------------+
                                  |                      |
                                  v                      v
                         +----------------+      +----------------------+
                         | PostgreSQL     |      | Object Storage       |
                         | Business State|      | Artifacts / Results  |
                         +----------------+      | Logs / Video / Data  |
                                                 +----------------------+
                                  |
                                  v
                         +----------------+
                         | Queue / Worker |
                         +-------+--------+
                                 |
                                 | Secure Lab Protocol
                                 v
    +-----------------------------------------------------------------------+
    |                            ROBOTIC LAB                                |
    |                                                                       |
    |  +-------------------+        +-----------------------------------+   |
    |  | Lab Agent         |<------>| Lab Resources                     |   |
    |  |                   |        | Robot Host / Network / Cameras    |   |
    |  | Validation        |        | Power / Safety / Device Adapters |   |
    |  | Deployment         |        +----------------+------------------+   |
    |  | Monitoring         |                         |                      |
    |  +---------+----------+                         |                      |
    +------------|------------------------------------|----------------------+
                 |                                    |
                 v                                    v
        +---------------------+              +-----------------------------+
        | Kritva Runtime      |              | Safety / Hardware Systems   |
        | Application         |              | E-stop / Safety PLC / Drive |
        | Lifecycle           |              | Motor Controllers / Sensors |
        +----------+----------+              +-----------------------------+
                   |
                   v
             +-----------+
             |   Robot   |
             +-----------+

## 9. Major Components

| Component | Primary Responsibility | Trust Zone | State Authority |
|---|---|---|---|
| RaaS Studio | User interaction | User | None |
| Studio Local Runtime | Build/package/local execution support | User | Local workspace |
| Control Plane | Business and execution orchestration | RaaS | PostgreSQL |
| PostgreSQL | Transactional business state | RaaS | Authoritative |
| Object Storage | Binary artifacts and large data | RaaS | Binary object authority |
| Queue | Asynchronous work delivery | RaaS | Transient |
| Lab Agent | Controlled lab boundary | Lab | Lab resource state |
| Kritva Runtime | Robot application runtime | Robot | Runtime state |
| Robot Safety System | Physical safety | Physical | Safety authority |
| Robot Hardware | Physical actuation/sensing | Physical | Hardware state |

## 10. Component Responsibilities

### 10.1 Kritva RaaS Studio

The Studio is the primary desktop application for developers.

It provides:

- authentication;
- project management;
- platform selection;
- local build initiation;
- artifact management;
- booking;
- artifact upload;
- run control;
- live execution view;
- telemetry;
- logs;
- results;
- rerun.

The Studio is not the authority for:

- credits;
- booking validity;
- authorization;
- job authorization;
- physical safety;
- robot state.

The Studio displays authoritative state received from the Control Plane.

### 10.2 Studio Local Runtime

The Studio Local Runtime is a native local service integrated with the desktop application.

It provides:

- local toolchain discovery;
- build execution;
- environment validation;
- dependency checks;
- package generation;
- artifact manifest generation;
- signing;
- checksum generation;
- local test execution;
- local logs;
- artifact inspection.

The Local Runtime must never require uploading source code to the Control Plane merely
to perform a standard build.

### 10.3 Control Plane

The Control Plane is the central RaaS business and execution orchestration service.

It exposes:

- REST API;
- WebSocket events;
- authentication;
- authorization;
- project management;
- platform management;
- artifact management;
- booking;
- credits;
- jobs;
- runs;
- results;
- lab orchestration;
- audit.

The initial architecture is a modular monolith.

The architecture must allow later extraction of modules into services without changing
external contracts.

### 10.4 PostgreSQL

PostgreSQL stores authoritative structured state.

Typical entities include:

- User;
- Organization;
- Membership;
- Project;
- Platform;
- PlatformVersion;
- PlatformCapability;
- Artifact;
- ArtifactCompatibility;
- Booking;
- CreditWallet;
- CreditPlan;
- CreditTransaction;
- Job;
- Run;
- Lab;
- LabAgent;
- Resource;
- Result;
- AuditEvent.

### 10.5 Object Storage

Object storage contains large immutable or append-oriented data.

Examples:

- `.krv` artifacts;
- result bundles;
- logs;
- telemetry exports;
- video recordings;
- generated reports;
- diagnostic bundles.

Metadata describing those objects remains in PostgreSQL.

### 10.6 Queue and Workers

The queue supports asynchronous processing.

Typical queue work includes:

- artifact validation;
- artifact scanning;
- booking processing;
- job scheduling;
- lab dispatch;
- result processing;
- cleanup;
- notification;
- archival.

Queue messages must be idempotently processed.

### 10.7 Lab Agent

The Lab Agent runs inside a robotic laboratory.

It provides a controlled interface for:

- resource discovery;
- robot health;
- artifact retrieval;
- deployment;
- runtime startup;
- runtime stop;
- job status;
- telemetry;
- logs;
- result collection.

The Lab Agent must not become a general-purpose remote shell.

### 10.8 Kritva Runtime

The Kritva Runtime executes the application on the target robot platform.

It provides:

- application lifecycle;
- capability access;
- runtime configuration;
- process supervision;
- resource controls;
- application status;
- telemetry;
- structured logs;
- runtime health.

The exact runtime implementation may vary by platform.

### 10.9 Robot

The robot contains:

- compute;
- sensors;
- actuators;
- motor controllers;
- networking;
- safety systems;
- power systems;
- platform-specific hardware.

The robot is not treated as a cloud-native component.

Its connectivity must tolerate:

- intermittent network;
- reboot;
- power loss;
- application crash;
- safety stop;
- controller fault.

## 11. Trust Zones

The system defines the following trust zones.

### Zone 0 — Physical Safety Zone

Contains:

- emergency stop;
- safety PLC;
- safety relays;
- motor drives;
- physical interlocks;
- power control.

This zone has the highest safety authority.

### Zone 1 — Robot Runtime Zone

Contains:

- Kritva Runtime;
- robot application;
- robot-side services;
- hardware interfaces.

The runtime is trusted to the extent required to execute authorized applications,
but application code is not automatically trusted.

### Zone 2 — Laboratory Zone

Contains:

- Lab Agent;
- robot hosts;
- lab network;
- cameras;
- local monitoring;
- resource controllers.

The Lab Agent is the controlled gateway between the cloud and the laboratory.

### Zone 3 — Cloud Control Zone

Contains:

- API;
- authentication;
- authorization;
- business services;
- workers;
- queue;
- PostgreSQL;
- object storage;
- audit.

### Zone 4 — User Workstation Zone

Contains:

- Studio;
- Local Runtime;
- source code;
- developer credentials;
- local toolchains;
- local artifacts.

The user workstation is not assumed to be fully trusted by the RaaS operator.

### Zone 5 — External Internet / Untrusted Zone

Contains:

- public network;
- user browsers;
- external identity providers where applicable;
- external payment providers;
- external integrations.

## 12. Trust Boundary Diagram

    [UNTRUSTED INTERNET]
             |
             | TLS
             v
    +-----------------------+
    | RaaS API Gateway/API  |
    +-----------+-----------+
                |
                | AuthN/AuthZ
                v
    +-----------------------+
    | Control Plane         |
    +----+-------------+----+
         |             |
         |             +------------------+
         v                                v
    [PostgreSQL]                    [Object Storage]
         |
         |
         v
    [Queue / Workers]
         |
         | Secure Lab Protocol
         v
    +-----------------------+
    | LAB TRUST BOUNDARY    |
    |                       |
    | Lab Agent             |
    +-----------+-----------+
                |
                v
    +-----------------------+
    | ROBOT RUNTIME         |
    |                       |
    | Kritva Runtime        |
    +-----------+-----------+
                |
                v
    +-----------------------+
    | PHYSICAL SAFETY       |
    +-----------------------+

The physical safety boundary is intentionally outside normal cloud authorization.

## 13. Communication Paths

| Path | Protocol | Direction | Purpose |
|---|---|---|---|
| Studio ↔ Local Runtime | Tauri IPC | Bidirectional | Local operations |
| Studio → Control Plane | HTTPS | Request | API commands |
| Control Plane → Studio | WebSocket | Event | State/events |
| Studio ↔ Object Storage | HTTPS signed access | Controlled | Artifact transfer |
| Control Plane ↔ PostgreSQL | Private DB protocol | Internal | Transactional state |
| Control Plane ↔ Object Storage | Provider adapter | Internal | Binary storage |
| Control Plane ↔ Queue | Queue protocol | Internal | Async work |
| Control Plane ↔ Lab Agent | Secure Lab Protocol | Bidirectional | Execution orchestration |
| Lab Agent ↔ Runtime | Local secure transport | Bidirectional | Deployment/control |
| Runtime ↔ Robot | Platform-specific | Bidirectional | Hardware control |
| Robot ↔ Safety System | Hardware/fieldbus | Bidirectional | Safety |

## 14. Studio to Local Runtime Boundary

The Studio and Local Runtime form one logical product boundary but remain separate
process responsibilities.

The Studio owns:

- presentation;
- navigation;
- user intent;
- local workflow state;
- server communication.

The Local Runtime owns:

- build;
- test;
- packaging;
- toolchain execution;
- local filesystem operations;
- signing.

The boundary uses Tauri IPC.

A typical flow is:

    Studio
      |
      | build.start
      v
    Local Runtime
      |
      +--> validate toolchain
      |
      +--> configure
      |
      +--> compile
      |
      +--> test
      |
      +--> package
      |
      +--> checksum
      |
      +--> sign
      |
      v
    .krv Artifact
      |
      v
    Studio

The Studio must not directly execute arbitrary compiler commands without the Local
Runtime's controlled interface.

## 15. Source-Code Boundary

Source code is considered customer-owned intellectual property.

The standard execution path is:

    Local Source
        |
        v
    Local Build
        |
        v
    Local Tests
        |
        v
    Local Package
        |
        v
    Signed .krv
        |
        v
    RaaS

The standard path does not include:

    Local Source
        |
        X
        |
    RaaS Control Plane

The system may support optional source-based services in the future, but such features
must be explicitly designed, consented to, and separately secured.

## 16. Artifact Architecture

The `.krv` artifact is the execution contract between local development and remote execution.

The artifact should contain:

- manifest;
- application binary;
- required runtime libraries;
- configuration;
- capability declarations;
- checksums;
- signature;
- build metadata.

A conceptual manifest is:

    {
        "artifact_format": "krv-1",
        "application": "example-controller",
        "version": "1.0.0",
        "platform_id": "humanoid-a",
        "architecture": "aarch64",
        "kritva_os_version": "1.x",
        "sdk_version": "1.x",
        "capabilities": [
            "camera",
            "imu",
            "joint-control"
        ],
        "entrypoint": "bin/application",
        "checksum": "...",
        "signature": "..."
    }

The exact schema is defined by the Artifact Architecture and protocol contracts.

## 17. Artifact Trust Model

Artifact acceptance is a layered process.

    Upload
      |
      v
    Authentication
      |
      v
    Authorization
      |
      v
    File integrity
      |
      v
    Artifact format validation
      |
      v
    Signature validation
      |
      v
    Compatibility validation
      |
      v
    Security/policy validation
      |
      v
    Booking validation
      |
      v
    Resource validation
      |
      v
    Execution authorization

Failure at any mandatory stage prevents deployment.

## 18. Build-Locally Principle

The local build model is a deliberate architectural decision.

Reasons include:

1. Source-code privacy.
2. Reduced cloud compute cost.
3. Reduced cloud build complexity.
4. User control over development environment.
5. Compatibility with proprietary source.
6. Easier offline development.
7. Faster local iteration.
8. Reduced RaaS storage requirements.
9. Clear separation between development and execution.
10. Simplified security boundary.

The Control Plane therefore does not become the developer's compilation environment.

## 19. Remote Execution Principle

Remote infrastructure is responsible for execution, not ordinary source development.

The remote flow is:

    .krv Artifact
        |
        v
    Artifact Validation
        |
        v
    Booking Validation
        |
        v
    Resource Allocation
        |
        v
    Deployment
        |
        v
    Runtime Startup
        |
        v
    Execution
        |
        +--> Telemetry
        +--> Logs
        +--> Video
        +--> Events
        |
        v
    Result Collection

## 20. Control Plane Domain Model

The Control Plane is logically divided into modules.

| Module | Responsibility |
|---|---|
| Identity | Authentication and identity |
| Authorization | Permissions and roles |
| Organizations | Organization membership |
| Projects | User project metadata |
| Platforms | Robot platform catalog |
| Artifacts | Artifact metadata and validation |
| Booking | Resource reservation |
| Credits | Wallets, plans, transactions |
| Jobs | Execution lifecycle |
| Runs | Execution instances and metrics |
| Results | Result metadata and files |
| Lab | Agent and resource orchestration |
| Audit | Security and business audit |

These modules may initially run in one process.

The logical boundaries must nevertheless remain explicit.

## 21. API Boundary

The public Control Plane API is versioned.

The initial base path is:

    /api/v1/

Representative commands include:

    auth.login
    auth.logout
    auth.refresh
    auth.me

    project.create
    project.list
    project.get
    project.update
    project.archive

    platform.list
    platform.get
    platform.capabilities
    platform.compatibility

    artifact.create
    artifact.upload
    artifact.get
    artifact.list
    artifact.validate

    availability.query
    booking.quote
    booking.create
    booking.get
    booking.list
    booking.modify
    booking.cancel

    credit.balance
    credit.quote
    credit.transaction.list
    credit.consumption
    credit.refund

    job.create
    job.get
    job.list
    job.start
    job.stop
    job.cancel

    run.get
    run.list
    run.status
    run.metrics
    run.telemetry
    run.logs

    result.get
    result.list
    result.files
    result.download

## 22. Common Command Envelope

Commands use a common conceptual envelope.

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T12:00:00Z",
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

The exact schema is maintained by the protocol contract.

## 23. Common Response Envelope

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

Transport success does not imply application success.

For example, HTTP 202 may mean that the request was accepted for asynchronous processing,
not that the job completed successfully.

## 24. Asynchronous Execution

Long-running commands must not block the API.

For example:

    job.start
        |
        v
    HTTP 202 Accepted
        |
        +--> job.validating
        +--> job.deploying
        +--> job.starting
        +--> job.running
        +--> job.completed

The Studio receives events through WebSocket and can also query authoritative state.

The database remains authoritative when event delivery is delayed or disconnected.

## 25. Event Architecture

Events communicate state transitions and operational facts.

Examples include:

    artifact.uploaded
    artifact.validating
    artifact.accepted

    booking.confirmed
    booking.cancelled

    job.queued
    job.validating
    job.deploying
    job.starting
    job.running
    job.completed
    job.failed
    job.cancelled

    robot.online
    robot.offline

    telemetry.updated

Events are not a substitute for transactional state.

An event may be lost from a live connection without losing the underlying state.

## 26. WebSocket Architecture

WebSocket is used for realtime UI updates.

Typical channels include:

- job status;
- run status;
- telemetry;
- logs;
- resource status;
- robot status;
- system notifications.

The system must support reconnect.

On reconnect, the Studio must synchronize authoritative state before resuming incremental
updates.

The architecture must not assume that a WebSocket remains continuously connected.

## 27. Lab Protocol Boundary

The Lab Protocol is the secure interface between the Control Plane and the physical lab.

It supports:

- agent registration;
- heartbeat;
- status;
- capabilities;
- resources;
- artifact retrieval;
- deployment;
- start;
- stop;
- cancellation;
- telemetry;
- logs;
- results.

The Lab Agent initiates or maintains the secure connection where practical so that the
lab does not require broad inbound Internet exposure.

## 28. Lab Agent Responsibilities

The Lab Agent shall:

1. Authenticate with the Control Plane.
2. Maintain heartbeat.
3. Advertise capabilities.
4. Advertise available resources.
5. Receive authorized execution work.
6. Retrieve authorized artifacts.
7. Validate local compatibility.
8. Prepare deployment.
9. Start Kritva Runtime workloads.
10. Monitor workload health.
11. Forward status and telemetry.
12. Collect logs.
13. Collect results.
14. Report failures.
15. Release resources.
16. Maintain safe local behavior when cloud connectivity is lost.

The Lab Agent shall not:

- expose unrestricted shell access;
- accept arbitrary unauthenticated commands;
- bypass platform validation;
- bypass booking authorization;
- bypass safety controls;
- treat the cloud as a replacement for physical E-stop.

## 29. Robot Runtime Boundary

The robot-side Kritva Runtime provides the application execution boundary.

The runtime should provide:

- application startup;
- shutdown;
- health;
- resource limits;
- capability access;
- structured logging;
- metrics;
- lifecycle status.

A robot application should not need direct knowledge of cloud APIs.

The application interacts with the Kritva Runtime and platform interfaces.

This keeps application portability separate from RaaS infrastructure.

## 30. Robot Platform Abstraction

A platform represents a supported robot configuration.

A platform definition includes:

- platform identifier;
- version;
- architecture;
- OS/runtime compatibility;
- capabilities;
- sensor set;
- actuator set;
- networking;
- resource constraints;
- supported artifact formats;
- supported SDK versions.

Example:

    platform_id:
        humanoid-a

    architecture:
        aarch64

    runtime:
        kritva-runtime-1.x

    capabilities:
        camera
        imu
        joint-control
        force-sensing

The platform catalog is authoritative in the Control Plane.

## 31. Booking Architecture

Booking is a resource reservation function.

A booking identifies:

- user;
- organization;
- platform;
- resource;
- lab;
- time window;
- credit plan;
- quoted cost;
- booking status.

The booking service must prevent conflicting reservations.

Booking state is stored transactionally.

A booking is not equivalent to a running job.

The lifecycle is conceptually:

    availability
        |
        v
    quote
        |
        v
    booking.create
        |
        v
    CONFIRMED
        |
        v
    execution window
        |
        v
    job.create
        |
        v
    job.start

## 32. Credit Architecture

Credits are platform-specific.

The system should not use one undifferentiated global humanoid-credit balance.

A wallet is associated with a platform or platform credit domain.

Conceptually:

    Platform A
        |
        +--> Student Credits
        +--> Developer Credits
        +--> Research Credits

    Platform B
        |
        +--> Student Credits
        +--> Developer Credits
        +--> Research Credits

Credit consumption is calculated using data-driven rates.

For example:

    rate = 15 credits / minute
    duration = 30 minutes
    consumption = 450 credits

The Control Plane, not the Studio, is authoritative for consumption.

## 33. Job Architecture

A job represents an authorized execution request.

A job may reference:

- project;
- artifact;
- platform;
- booking;
- lab;
- resource;
- user;
- organization;
- execution policy.

Expected job states include:

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

State transitions must be controlled by the execution orchestration logic.

## 34. Run Architecture

A run represents an actual execution instance.

A job may produce one or more run records depending on future retry semantics.

A run captures:

- run ID;
- job ID;
- artifact version;
- platform;
- resource;
- start time;
- end time;
- status;
- metrics;
- telemetry references;
- logs;
- result references;
- failure information.

Run records must remain auditable after completion.

## 35. Result Architecture

Results are separated from live execution state.

Results may include:

- application output;
- telemetry exports;
- logs;
- generated data;
- screenshots;
- video;
- metrics;
- reports;
- diagnostic bundles.

Large result files belong in object storage.

Result metadata belongs in PostgreSQL.

The user may download result files after authorization.

## 36. Video Architecture

Video is an observation path, not a command path.

The preferred production architecture is WebRTC or an equivalent low-latency media path.

Video must not carry authoritative job control.

Stopping a job must use the control channel.

A temporary implementation may use:

- local camera simulation;
- recorded video;
- lower-rate streaming;
- lab-local streaming.

The abstraction should remain compatible with WebRTC.

## 37. Telemetry Architecture

Telemetry is separate from transactional API state.

Telemetry may include:

- CPU;
- memory;
- temperature;
- battery;
- joint state;
- motor state;
- sensor state;
- network health;
- application metrics.

High-rate telemetry should not be written directly to the transactional business database
at unlimited frequency.

The architecture should use:

- streaming;
- aggregation;
- time-series storage;
- object export;
- sampled persistence;

as appropriate to the production scale.

## 38. Logging Architecture

Logs have multiple sources:

- Studio;
- Local Runtime;
- Control Plane;
- workers;
- Lab Agent;
- Kritva Runtime;
- application.

Logs should include:

- timestamp;
- source;
- severity;
- correlation ID;
- request ID where applicable;
- job ID;
- run ID;
- robot/resource ID where applicable.

Logs must not become the authoritative source of lifecycle state.

## 39. Correlation and Traceability

A request should be traceable across system boundaries.

A conceptual correlation chain is:

    request_id
        |
        +--> API request
        +--> database transaction
        +--> job
        +--> run
        +--> Lab Agent command
        +--> runtime operation
        +--> result

The system should preserve:

- request ID;
- correlation ID;
- job ID;
- run ID;
- artifact ID;
- booking ID.

This enables debugging and audit.

## 40. Database Architecture Boundary

The Control Plane owns database access.

The Studio does not access PostgreSQL directly.

The Lab Agent does not access PostgreSQL directly.

Robot applications do not access PostgreSQL directly.

The logical boundary is:

    Studio
       |
       v
    Control Plane
       |
       v
    Repository Interfaces
       |
       v
    PostgreSQL

Repository interfaces include:

    UserRepository
    OrganizationRepository
    ProjectRepository
    ArtifactRepository
    BookingRepository
    CreditRepository
    JobRepository
    RunRepository
    ResultRepository

This keeps business logic independent of database implementation details.

## 41. Object Storage Boundary

The Control Plane owns object metadata.

Binary data is stored using an object storage adapter.

Conceptual interface:

    ObjectStorage
        put(object)
        get(object)
        delete(object)
        exists(object)
        generateDownloadUrl(object)

The exact provider may change.

Application code must not depend directly on a cloud-provider SDK throughout the codebase.

## 42. Queue Boundary

The Control Plane submits asynchronous work to a queue.

Workers consume jobs.

Queue processing must support:

- retries;
- idempotency;
- visibility timeout or equivalent;
- dead-letter handling;
- operational monitoring.

The queue is not authoritative for business state.

Job state remains in PostgreSQL.

## 43. Security Architecture

Security is layered.

Required controls include:

- TLS;
- authenticated APIs;
- authorization;
- short-lived credentials where practical;
- secret management;
- encrypted storage;
- artifact integrity;
- artifact signature verification;
- audit logging;
- least privilege;
- network isolation;
- rate limiting;
- input validation;
- dependency scanning;
- vulnerability management.

Security controls must exist at every trust boundary.

## 44. Authentication

The Studio authenticates users through the Control Plane.

The system should support:

- session management;
- token refresh;
- logout;
- organization membership;
- role-based authorization.

Credentials must not be embedded in artifacts.

Robot-side execution should use separate machine identity.

## 45. Authorization

Authorization must be enforced server-side.

Examples:

- user can access only permitted projects;
- organization members can access organization resources according to role;
- users can upload only authorized artifacts;
- users can book only permitted platforms;
- users can consume only authorized credits;
- users can control only their authorized jobs;
- Lab Agents can access only assigned lab resources.

Client-side hiding of UI elements is not an authorization mechanism.

## 46. Artifact Security

Artifact security includes:

- checksum verification;
- signature verification;
- format validation;
- platform compatibility;
- policy validation;
- size limits;
- provenance;
- version metadata;
- optional malware scanning;
- revocation support where required.

An artifact that fails mandatory validation must not be deployed.

## 47. Cloud-to-Lab Security

The Control Plane must authenticate the Lab Agent.

The Lab Agent must authenticate the Control Plane.

The communication must provide:

- confidentiality;
- integrity;
- endpoint authentication;
- replay protection;
- authorization;
- protocol version negotiation.

The lab network should not expose robot control ports directly to the public Internet.

## 48. Physical Safety Boundary

The cloud architecture must never claim physical emergency-stop authority.

The following are distinct:

1. Application stop.
2. Job cancellation.
3. Runtime shutdown.
4. Robot safe-state transition.
5. Physical emergency stop.

A UI button labeled "Stop Job" must not be presented as an emergency stop.

The physical E-stop remains the authoritative emergency mechanism.

## 49. Failure Model

The architecture assumes failures can occur independently.

Examples:

- Studio crash;
- local build failure;
- network loss;
- API failure;
- database outage;
- object storage outage;
- queue outage;
- Lab Agent disconnect;
- robot reboot;
- runtime crash;
- sensor failure;
- motor controller failure;
- safety stop;
- power loss.

The system must preserve authoritative state even when a transient communication path fails.

## 50. Studio Disconnect

If Studio disconnects during execution:

- the job must continue or stop according to execution policy;
- the Control Plane remains authoritative;
- the run must not be silently terminated solely because the UI disconnected;
- the Studio must resynchronize after reconnect.

The UI must show that it is disconnected rather than displaying stale data as current.

## 51. Control Plane Failure

If the Control Plane becomes temporarily unavailable:

- existing robot safety systems remain local;
- active runtime behavior follows local policy;
- no new execution authorization should be granted;
- Lab Agents maintain controlled local behavior;
- state is reconciled after recovery.

Cloud failure must not create unsafe actuator behavior.

## 52. Lab Agent Failure

If the Lab Agent disconnects:

- active job state becomes degraded/unknown according to policy;
- no new jobs are accepted on that resource;
- the Lab Agent must not start unauthorized work;
- recovery must reconcile actual robot state before continuing.

The system must distinguish "agent unreachable" from "robot safely stopped."

## 53. Robot Failure

If the robot fails:

- the Lab Agent detects loss where possible;
- the job/run transitions to an appropriate failure state;
- resource availability is updated;
- results/logs available before failure are retained;
- billing behavior follows explicit policy.

## 54. Network Partition

The architecture assumes network partitions.

The robot and Lab Agent must not depend on continuous cloud connectivity for physical
safety.

The runtime should have explicit local policies for:

- lost cloud connection;
- lost Lab Agent connection;
- lost control heartbeat;
- command timeout.

These policies must be platform-specific where necessary.

## 55. Data Ownership

| Data | Owner | Storage |
|---|---|---|
| Source code | User | Local |
| Local build logs | User | Local |
| `.krv` artifact | User/RaaS execution service | Object storage |
| Project metadata | RaaS | PostgreSQL |
| Booking | RaaS | PostgreSQL |
| Credit ledger | RaaS | PostgreSQL |
| Job state | RaaS | PostgreSQL |
| Run state | RaaS | PostgreSQL |
| Runtime logs | RaaS | Object/log storage |
| Video | RaaS/Lab | Media/object storage |
| Telemetry | RaaS/Lab | Telemetry storage |
| Results | User/RaaS | Object storage |
| Audit records | RaaS | PostgreSQL/log store |
| Physical safety state | Lab/Robot | Local safety system |

## 56. Data Lifecycle

The general lifecycle is:

    Create
      |
      v
    Validate
      |
      v
    Store
      |
      v
    Use
      |
      v
    Observe
      |
      v
    Retain
      |
      v
    Archive
      |
      v
    Delete according to policy

Retention policies must differ by data type.

Examples:

- transactional records may require long retention;
- raw telemetry may have shorter retention;
- video may have configurable retention;
- temporary artifacts may expire;
- audit records may have mandatory retention.

## 57. Idempotency

Idempotency is required for operations that can create financial, resource, or execution
side effects.

Examples:

- booking creation;
- artifact upload where retry can duplicate state;
- job creation;
- job start;
- credit transaction;
- payment;
- refund.

A client retry must not unintentionally create two bookings or two executions.

## 58. Resource Locking

Resource allocation must be explicit.

A resource may represent:

- robot;
- robot compute;
- laboratory station;
- simulation instance;
- camera;
- specialized hardware.

A resource cannot be simultaneously allocated to incompatible jobs.

Resource locks should have:

- owner;
- lease;
- creation time;
- expiration;
- job ID;
- booking ID.

Expired locks must be recoverable.

## 59. Scheduling

The scheduler is responsible for selecting eligible resources.

Eligibility may depend on:

- platform;
- platform version;
- robot availability;
- booking;
- capabilities;
- artifact compatibility;
- lab status;
- maintenance state;
- safety state;
- credit authorization.

The scheduler must not select a resource merely because it is online.

## 60. Maintenance State

Resources can be:

- ONLINE;
- OFFLINE;
- BUSY;
- RESERVED;
- MAINTENANCE;
- FAULT;
- SAFETY_STOP;
- UNKNOWN.

A resource in maintenance or safety fault must not receive normal jobs.

## 61. Platform Compatibility

Compatibility must consider at least:

- artifact format;
- CPU architecture;
- Kritva Runtime version;
- KritvaOS version;
- SDK version;
- declared capabilities;
- resource limits;
- platform version.

Compatibility should be deterministic and explainable.

A failed compatibility check should identify the relevant mismatch.

## 62. Version Compatibility

The system contains multiple version domains:

| Domain | Example |
|---|---|
| Public API | v1 |
| Protocol | 1.0 |
| Artifact | krv-1 |
| KritvaOS | 1.x |
| Runtime | 1.x |
| SDK | 1.x |
| Platform | humanoid-a v1 |
| Lab Agent | 1.x |
| Studio | 1.x |

A deployment should be permitted only when the declared compatibility matrix allows it.

## 63. Deployment Flow

The production deployment sequence is:

    Booking confirmed
        |
        v
    Job created
        |
        v
    Artifact authorized
        |
        v
    Compatibility checked
        |
        v
    Resource locked
        |
        v
    Lab Agent notified
        |
        v
    Artifact retrieved
        |
        v
    Local validation
        |
        v
    Deployment prepared
        |
        v
    Runtime started
        |
        v
    Health confirmed
        |
        v
    RUNNING

Failure at any stage produces an auditable state transition.

## 64. Execution Flow

    User
      |
      v
    Studio
      |
      | job.start
      v
    Control Plane
      |
      +--> validate authorization
      +--> validate booking
      +--> validate credits
      +--> validate artifact
      +--> allocate resource
      |
      v
    Lab Agent
      |
      +--> retrieve artifact
      +--> validate artifact
      +--> deploy
      +--> start runtime
      |
      v
    Kritva Runtime
      |
      v
    Robot Application
      |
      +--> Sensors
      +--> Actuators
      +--> Platform Services
      |
      v
    Telemetry / Logs / Results

## 65. Execution Observation Flow

    Robot Runtime
        |
        +--> telemetry
        +--> logs
        +--> metrics
        |
        v
    Lab Agent
        |
        v
    Control Plane
        |
        +--> persistence
        +--> event stream
        |
        v
    WebSocket
        |
        v
    Studio
        |
        +--> live status
        +--> charts
        +--> console
        +--> robot state

Video follows a separate media path.

## 66. Result Flow

    Application
        |
        v
    Runtime
        |
        v
    Lab Agent
        |
        v
    Result Collection
        |
        +--> metadata -> PostgreSQL
        |
        +--> files ----> Object Storage
        |
        v
    Control Plane
        |
        v
    Studio / Web
        |
        v
    Download / Analyze / Rerun

## 67. Rerun Flow

Rerun should reuse immutable references where appropriate.

    Existing Run
        |
        v
    Rerun Request
        |
        +--> same artifact
        +--> selected platform
        +--> new booking/resource
        |
        v
    New Job
        |
        v
    New Run

A rerun must not mutate the historical run.

## 68. Audit Architecture

Audit events should record security- and business-significant actions.

Examples:

- login;
- logout;
- artifact upload;
- artifact acceptance;
- booking creation;
- booking cancellation;
- credit transaction;
- job creation;
- job start;
- job stop;
- authorization failure;
- administrative change;
- platform change;
- Lab Agent registration;
- production configuration change.

Audit events should include actor, timestamp, target, action, result, and correlation identifiers.

## 69. Administration Boundary

Administration is primarily provided by the web console.

Administrative capabilities include:

- users;
- organizations;
- platforms;
- labs;
- hardware;
- bookings;
- jobs;
- usage;
- credit plans;
- rates;
- payments;
- refunds;
- monitoring;
- audit logs;
- settings.

The Studio is optimized for developers and should not become the primary administration
surface.

## 70. Web Console Boundary

The web console is a browser-based administrative and commercial interface.

User functions may include:

- dashboard;
- projects;
- platforms;
- bookings;
- jobs;
- results;
- credits;
- billing;
- profile.

Admin functions extend into system configuration.

The Web Console and Studio share backend contracts but may have different UX and authorization
requirements.

## 71. Cloud Architecture

The cloud environment contains:

    Public/API Layer
          |
          v
    Control Plane
          |
      +---+---+----------------+
      |       |                |
      v       v                v
    DB      Storage           Queue
                                |
                                v
                              Worker

The cloud does not directly contain the robot hardware.

The lab is a separate trust and deployment zone.

## 72. Cloud Provider Independence

The application architecture should not depend on one cloud provider.

Provider-specific concerns belong behind adapters for:

- object storage;
- managed PostgreSQL;
- queue;
- secret store;
- observability;
- networking;
- compute.

Infrastructure-as-code may use a selected provider while preserving logical portability.

## 73. Environment Model

The system supports:

1. Local.
2. Development.
3. Staging.
4. Production.

Each environment has separate:

- configuration;
- credentials;
- databases;
- object storage;
- queues;
- secrets;
- deployment identity.

Production data must not be copied into development or staging without explicit approved
data handling.

## 74. Local Environment

The local environment should support the complete software flow without physical robots.

It may include:

- Control Plane;
- PostgreSQL;
- object storage emulator;
- queue emulator;
- mock Lab Agent;
- simulated robot;
- local Studio.

The local environment is intended for development and integration testing.

## 75. Development Environment

Development provides a shared cloud-like environment.

It validates:

- API;
- database;
- storage;
- queue;
- artifact flow;
- mock lab;
- CI/CD;
- observability.

It must remain isolated from staging and production.

## 76. Staging Environment

Staging is production-like.

It validates:

- release candidates;
- migrations;
- API compatibility;
- artifact compatibility;
- lab connectivity;
- execution;
- monitoring;
- backup/restore procedures;
- rollback.

Production promotion requires an explicit gate.

## 77. Production Environment

Production provides:

- hardened Control Plane;
- private database;
- protected object storage;
- queue infrastructure;
- secret management;
- monitoring;
- alerting;
- backup;
- disaster recovery;
- controlled Lab connectivity;
- audit.

Production deployment must be versioned and reproducible.

## 78. Scalability

The initial architecture uses a modular monolith.

Horizontal scaling can be introduced for:

- API instances;
- workers;
- WebSocket gateways;
- telemetry processors.

State remains externalized.

The architecture avoids process-local authoritative state.

## 79. Availability

Availability must be considered independently for:

- API;
- database;
- storage;
- queue;
- lab connectivity;
- robot connectivity;
- video;
- telemetry.

A video outage should not necessarily invalidate the job.

A WebSocket outage should not necessarily stop the job.

A database outage may prevent new execution authorization.

A physical safety fault must override normal availability goals.

## 80. Disaster Recovery

The system must support restoration of:

1. Control Plane application.
2. Database.
3. Object storage metadata and objects.
4. Queue infrastructure.
5. Configuration.
6. Secrets.
7. Lab connectivity.
8. Operational monitoring.

Active robot execution must be treated separately.

Recovery must not assume that a cloud restart automatically restores physical robot state.

Robot state must be reconciled before allowing new work.

## 81. Recovery Priority

Recommended recovery order:

    1. Physical safety assessment
    2. Lab/resource state assessment
    3. Control Plane
    4. Database
    5. Object storage
    6. Queue/workers
    7. Lab Agents
    8. Execution reconciliation
    9. User-facing services
    10. Non-critical analytics

## 82. Performance Principles

The architecture should distinguish:

- transactional requests;
- asynchronous commands;
- realtime events;
- high-rate telemetry;
- video;
- bulk artifact transfer.

Large files must not pass through the API process unnecessarily.

Realtime streams must not block transactional operations.

High-rate telemetry must not overload PostgreSQL.

## 83. Artifact Transfer Optimization

Artifact upload may use direct object-storage upload.

A conceptual flow is:

    Studio
      |
      | request upload
      v
    Control Plane
      |
      | signed upload authorization
      v
    Studio
      |
      | HTTPS
      v
    Object Storage
      |
      | completion notification
      v
    Control Plane

This avoids routing large artifact data through the API server.

The Control Plane remains authoritative for artifact metadata and acceptance.

## 84. Result Download Optimization

Large result files may use authorized signed download URLs.

The flow is:

    Studio
      |
      | result.download
      v
    Control Plane
      |
      | authorization
      v
    Signed URL
      |
      v
    Object Storage
      |
      v
    Studio

Authorization is evaluated before the URL is issued.

## 85. Configuration Architecture

Configuration is divided into:

- build-time configuration;
- deployment configuration;
- runtime configuration;
- platform configuration;
- resource configuration;
- user/project configuration.

Secrets must not be committed to source control.

Robot credentials and cloud credentials must not be embedded in `.krv` artifacts.

## 86. Secrets Architecture

Secrets are managed through a dedicated secret store where practical.

Examples:

- API signing secrets;
- database credentials;
- object storage credentials;
- Lab Agent credentials;
- machine identity keys;
- payment provider secrets.

Secret rotation must be supported without requiring source-code changes.

## 87. Observability Architecture

The system should provide:

- metrics;
- structured logs;
- traces;
- audit events;
- health checks.

Observability must cross component boundaries using correlation identifiers.

Important operational metrics include:

- API latency;
- API error rate;
- queue depth;
- worker failures;
- artifact validation failures;
- booking conflicts;
- job duration;
- job failure rate;
- Lab Agent availability;
- robot availability;
- telemetry health;
- storage usage;
- credit consumption.

## 88. Health Model

Every major component should expose an appropriate health model.

Examples:

- API health;
- database connectivity;
- queue health;
- object storage health;
- Lab Agent heartbeat;
- robot availability;
- runtime health.

Health states should distinguish:

- healthy;
- degraded;
- unhealthy;
- unknown.

A component may be operational while a dependent resource is unavailable.

## 89. Security Threat Areas

Major threats include:

1. Unauthorized artifact execution.
2. Malicious artifact content.
3. Artifact tampering.
4. Credential theft.
5. API authorization bypass.
6. Cross-organization data access.
7. Resource hijacking.
8. Credit manipulation.
9. Replay of execution commands.
10. Lab Agent compromise.
11. Robot network compromise.
12. Source-code leakage.
13. Object-storage exposure.
14. Denial of service.
15. Supply-chain compromise.

## 90. Security Mitigations

Primary mitigations include:

- signed artifacts;
- checksums;
- server-side authorization;
- tenant isolation;
- short-lived access;
- secure machine identity;
- TLS;
- private lab networking;
- audit logs;
- rate limiting;
- resource quotas;
- immutable execution records;
- secret management;
- dependency scanning;
- controlled deployment;
- runtime isolation;
- safety interlocks.

## 91. Multi-Tenancy

The system should support organization-level isolation.

Every tenant-sensitive resource should be associated with an organization or user context.

Authorization checks must occur before returning:

- project data;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

Object-storage access must also be tenant-scoped.

## 92. Privacy

The architecture minimizes customer source-code exposure.

The RaaS platform may receive:

- artifact binary;
- manifest;
- metadata;
- execution logs;
- telemetry;
- results.

The platform does not require raw source code for normal execution.

Users must understand that an executable artifact can potentially reveal implementation details through
reverse engineering.

Therefore "source code remains local" means the source repository itself is not transferred,
not that binary IP is impossible to inspect.

## 93. Intellectual Property Boundary

The architecture should minimize the amount of customer IP entering the platform.

The platform should avoid:

- unnecessary artifact duplication;
- unnecessary long-term retention;
- source-code collection;
- unrestricted staff access;
- unbounded result retention.

Administrative access to artifacts should be auditable.

## 94. Software Supply Chain

The build environment should support:

- pinned dependencies;
- reproducible builds where practical;
- compiler/toolchain version tracking;
- dependency integrity;
- artifact checksums;
- signing;
- vulnerability scanning.

The artifact manifest should identify the relevant build/runtime versions.

## 95. Deployment Safety

Production deployment must distinguish software deployment from robot deployment.

A Control Plane release must not automatically deploy arbitrary new robot software.

Robot execution requires independent authorization through:

- booking;
- artifact validation;
- compatibility;
- resource allocation;
- runtime policy.

## 96. Phase Evolution

The architecture is intentionally implemented in phases.

The phases represent increasing capability, not different architectures.

The same system boundaries should exist from the beginning, even when early components are
simulated.

## 97. P0 FOUNDATION

Primary objective:

Establish repository, architecture, contracts, local development, and basic system skeleton.

Key elements:

- monorepo;
- Studio shell;
- Local Runtime interface;
- Control Plane skeleton;
- contracts;
- database schema foundation;
- local object storage;
- local queue;
- mock Lab Agent;
- simulated robot;
- CI.

Expected topology:

    Studio
      |
      v
    Local Runtime

    Studio
      |
      v
    Control Plane
      |
      +--> PostgreSQL
      +--> Object Storage
      +--> Queue
      |
      v
    Mock Lab Agent
      |
      v
    Simulated Runtime

Phase 0 proves the architecture without requiring physical hardware.

## 98. P1 STUDIO

Primary objective:

Deliver the developer-facing Studio foundation.

Capabilities:

- authentication;
- project workspace;
- navigation;
- local runtime integration;
- platform discovery;
- basic dashboard.

The backend may use mocked or simplified execution data.

The architecture boundary between UI and Local Runtime must already exist.

## 99. P2 BUILD & ARTIFACT

Primary objective:

Make local build and artifact generation real.

Capabilities:

- toolchain validation;
- build;
- test;
- package;
- manifest;
- checksum;
- signing;
- artifact upload;
- artifact validation.

The source-code boundary becomes operational.

The remote system receives `.krv`, not source.

## 100. P3 CONTROL PLANE

Primary objective:

Make the production-oriented backend operational.

Capabilities:

- authentication;
- authorization;
- projects;
- platforms;
- artifacts;
- jobs;
- runs;
- results;
- audit;
- WebSocket events.

The modular monolith becomes the authoritative system of record.

## 101. P4 BOOKING & COMMERCIAL

Primary objective:

Introduce resource booking and commercial controls.

Capabilities:

- availability;
- quote;
- booking;
- platform-specific credits;
- consumption;
- refund;
- billing integration;
- cancellation policy.

The Control Plane becomes authoritative for resource and credit allocation.

## 102. P5 EXECUTION

Primary objective:

Execute artifacts remotely on simulated or controlled targets.

Capabilities:

- job creation;
- scheduling;
- resource locking;
- deployment;
- runtime lifecycle;
- stop/cancel;
- execution events;
- failure handling.

This phase proves the complete remote execution control path.

## 103. P6 LAB & ROBOT

Primary objective:

Connect the production execution path to a real laboratory and robot.

Capabilities:

- Lab Agent;
- secure lab protocol;
- resource discovery;
- real robot compatibility;
- artifact deployment;
- runtime monitoring;
- robot state.

Physical safety review is mandatory before physical deployment.

The cloud remains outside the physical safety authority boundary.

## 104. P7 LIVE & RESULTS

Primary objective:

Provide complete developer feedback.

Capabilities:

- live video;
- telemetry;
- logs;
- metrics;
- result collection;
- result download;
- experiment history;
- rerun.

Video and telemetry are implemented as observation paths independent of transactional control.

## 105. P8 PRODUCTION

Primary objective:

Operate the service reliably for real users.

Capabilities:

- production cloud;
- monitoring;
- alerting;
- backups;
- disaster recovery;
- security hardening;
- billing;
- admin console;
- audit;
- operational runbooks;
- capacity management;
- multi-platform support.

Production architecture must preserve all earlier boundaries.

## 106. Phase-to-Architecture Mapping

| Phase | Studio | Local Runtime | Control Plane | Cloud | Lab | Runtime | Robot |
|---|---|---|---|---|---|---|---|
| 0 | Skeleton | Interface | Skeleton | Local | Mock | Simulated | Simulated |
| 1 | Real UI | Integrated | Basic | Dev | Mock | Simulated | Simulated |
| 2 | Build UI | Real Build | Artifact | Storage | Mock | Simulated | Simulated |
| 3 | Full UI | Artifact | Full Core | PostgreSQL/Queue | Mock | Simulated | Simulated |
| 4 | Booking UI | Artifact | Booking/Credits | Commercial | Mock | Simulated | Simulated |
| 5 | Run UI | Artifact | Execution | Workers | Mock/Agent | Real Runtime | Simulated |
| 6 | Robot UI | Artifact | Lab Control | Production-like | Real Agent | Real | Real |
| 7 | Live UI | Artifact | Telemetry/Results | Media/Data | Real | Real | Real |
| 8 | Production | Production | Production | Hardened | Multi-Lab | Production | Production |

## 107. Architectural Evolution Strategy

The architecture evolves by replacing implementations behind stable boundaries.

Examples:

    Mock Lab Agent
        ->
    Real Lab Agent

    Simulated Runtime
        ->
    Kritva Runtime

    Local Object Storage
        ->
    Managed Object Storage

    Local PostgreSQL
        ->
    Managed PostgreSQL

    In-process Queue
        ->
    Managed Queue

    Recorded Video
        ->
    WebRTC

The external product contracts should change as little as possible.

## 108. Initial Modular Monolith

The Control Plane should initially remain a modular monolith because:

- development velocity is higher;
- deployment is simpler;
- transactions are easier;
- debugging is easier;
- the product is still evolving;
- premature microservices add operational overhead.

Logical boundaries must nevertheless be maintained.

Future service extraction may occur when:

- scaling requires it;
- ownership requires it;
- failure isolation requires it;
- deployment independence requires it.

## 109. Future Service Extraction

Potential future services include:

- Identity Service;
- Artifact Service;
- Booking Service;
- Credit/Billing Service;
- Execution Service;
- Lab Service;
- Result Service;
- Telemetry Service.

Service extraction must preserve public API and protocol semantics where practical.

## 110. Architectural Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Source-code leakage | High | Local build / artifact-only |
| Malicious artifact | Critical | Signature, scanning, sandboxing |
| Robot safety fault | Critical | Physical safety boundary |
| Cloud outage | High | Local safety policies, recovery |
| Lab disconnect | High | Agent heartbeat/reconciliation |
| Double booking | High | Transactional locking |
| Double charge | High | Idempotency |
| Duplicate job | High | Idempotency |
| Artifact incompatibility | High | Compatibility matrix |
| Storage loss | High | Backup/versioning |
| Database loss | Critical | Backup/PITR |
| Credential theft | Critical | Secret management |
| Tenant data leakage | Critical | Authorization/isolation |
| Queue duplication | Medium | Idempotent workers |
| WebSocket loss | Medium | State resynchronization |
| Video failure | Medium | Separate media path |
| Telemetry overload | Medium | Sampling/aggregation |
| Premature microservices | Medium | Modular monolith |
| Cloud lock-in | Medium | Provider adapters |
| Operational complexity | High | Phase-gated rollout |

## 111. Risk: Source-Code Exposure

The primary mitigation is architectural rather than contractual.

The standard system does not request source code.

Only an execution artifact is uploaded.

Additional mitigation:

- direct-to-object upload;
- short-lived upload credentials;
- encryption;
- strict access control;
- artifact retention policies;
- audit access;
- deletion policies.

## 112. Risk: Artifact Compromise

An uploaded artifact may be malicious or corrupted.

Controls include:

- cryptographic signature;
- checksum;
- format validation;
- compatibility checks;
- security scanning;
- runtime isolation;
- resource limits;
- execution authorization.

Physical robot access requires additional policy controls.

## 113. Risk: Physical Safety

Software correctness does not guarantee physical safety.

Therefore:

- cloud is not safety authority;
- Lab Agent cannot override safety systems;
- Runtime cannot override physical E-stop;
- robot controllers retain safety authority;
- physical deployment requires human safety review.

## 114. Risk: Stale State

UI state can become stale due to network failure.

Mitigation:

- database authoritative state;
- event sequence/versioning;
- reconnect synchronization;
- timestamps;
- explicit stale/offline indicators.

## 115. Risk: Split-Brain Execution

A network partition may make cloud and lab disagree about execution.

Mitigation:

- job IDs;
- run IDs;
- leases;
- heartbeat;
- execution epochs;
- reconciliation;
- no automatic restart without authoritative checks.

## 116. Risk: Double Execution

Retries may create duplicate execution.

Mitigation:

- idempotency keys;
- job uniqueness constraints;
- resource locks;
- execution epochs;
- Lab Agent deduplication.

## 117. Risk: Incompatible Artifact

An artifact built against one platform may be uploaded for another.

Mitigation:

- explicit platform ID;
- architecture;
- runtime version;
- SDK version;
- capability declarations;
- server validation;
- Lab Agent validation.

## 118. Risk: Cloud-to-Robot Latency

Robot control must not depend on cloud round-trip latency.

Cloud commands are orchestration-level operations.

Real-time motor control remains local to the robot/runtime.

This distinction is fundamental.

## 119. Real-Time Boundary

The cloud handles:

- booking;
- authorization;
- scheduling;
- deployment;
- execution lifecycle;
- monitoring.

The robot handles:

- control loops;
- sensor processing;
- actuator commands;
- real-time deadlines;
- safety-critical local behavior.

No cloud API should be placed inside a real-time motor-control loop.

## 120. Data Flow Summary

Primary data flows are:

    Source
      -> Local Build
      -> Artifact
      -> Object Storage
      -> Validation
      -> Booking
      -> Job
      -> Lab
      -> Runtime
      -> Robot
      -> Telemetry/Logs/Results
      -> Cloud
      -> Studio

Commercial flow:

    Platform
      -> Credit Plan
      -> Quote
      -> Booking
      -> Consumption
      -> Ledger
      -> Invoice/Payment

Administrative flow:

    Admin
      -> Configuration
      -> Platform
      -> Lab
      -> Resource
      -> Credit Plan
      -> Monitoring
      -> Audit

## 121. Interface Inventory

| Interface | Contract |
|---|---|
| Studio ↔ Local Runtime | Tauri IPC |
| Studio ↔ Control Plane | REST/OpenAPI |
| Studio ↔ Event Service | WebSocket |
| Studio ↔ Object Storage | Signed HTTPS |
| Control Plane ↔ Database | Repository interfaces |
| Control Plane ↔ Storage | ObjectStorage interface |
| Control Plane ↔ Queue | JobQueue interface |
| Control Plane ↔ Lab Agent | Lab Protocol |
| Lab Agent ↔ Runtime | Local runtime contract |
| Runtime ↔ Robot | Platform/runtime interfaces |
| Safety ↔ Robot | Hardware safety interfaces |

## 122. Required Contract Documents

The following architecture documents complement this system architecture:

- `APPLICATION_ARCHITECTURE.md`
- `COMPONENT_ARCHITECTURE.md`
- `DESKTOP_ARCHITECTURE.md`
- `BACKEND_ARCHITECTURE.md`
- `CLOUD_ARCHITECTURE.md`
- `DATABASE_ARCHITECTURE.md`
- `LAB_ARCHITECTURE.md`
- `API_ARCHITECTURE.md`
- `DATA_ARCHITECTURE.md`
- `SECURITY_ARCHITECTURE.md`
- `DEPLOYMENT_ARCHITECTURE.md`
- `ARTIFACT_ARCHITECTURE.md`
- `PROTOCOL_ARCHITECTURE.md`

This document defines the system-wide relationships among those documents.

## 123. Architectural Decisions

### ADR-001 — Local Build

Decision:

Build and test applications locally.

Rationale:

Protect source code and reduce remote build complexity.

### ADR-002 — Artifact-Only Remote Execution

Decision:

Upload `.krv` execution artifacts rather than source code.

Rationale:

Protect IP and create a clear execution contract.

### ADR-003 — Modular Monolith

Decision:

Start the Control Plane as a modular monolith.

Rationale:

Reduce early operational complexity while preserving logical boundaries.

### ADR-004 — PostgreSQL as Business Authority

Decision:

Use PostgreSQL for transactional business state.

Rationale:

Strong consistency and mature relational semantics.

### ADR-005 — Object Storage for Large Files

Decision:

Store artifacts, results, videos, and large logs in object storage.

Rationale:

Scalability and cost efficiency.

### ADR-006 — Lab Agent Boundary

Decision:

Use a Lab Agent between cloud orchestration and physical resources.

Rationale:

Isolation, security, local control, and protocol stability.

### ADR-007 — Runtime Locality

Decision:

Keep real-time robot control local.

Rationale:

Deterministic latency and safety.

### ADR-008 — Platform-Specific Credits

Decision:

Associate credits with robotic platforms.

Rationale:

Resource economics differ by platform.

### ADR-009 — WebSocket for Realtime Observation

Decision:

Use WebSocket for application-level realtime state and events.

Rationale:

Efficient live UI updates without coupling state authority to connection persistence.

### ADR-010 — Separate Video Path

Decision:

Treat video as a media path rather than a command path.

Rationale:

Different reliability, bandwidth, and latency requirements.

## 124. Open Questions

The following questions remain intentionally open and should be resolved during the
appropriate implementation phase.

1. Which cloud provider will host the first production environment?
2. Which identity provider will be used?
3. What exact `.krv` container format will be standardized?
4. What artifact signing authority will be used?
5. Which runtime sandboxing technology will be used?
6. Which telemetry backend will be selected?
7. Which WebRTC architecture will be used for production?
8. What exact Lab Protocol transport will be used?
9. How will Lab Agent certificates be provisioned?
10. What is the initial maximum artifact size?
11. What are default artifact retention periods?
12. What are default video retention periods?
13. What are telemetry sampling rates?
14. Which payment provider will be integrated?
15. What are cancellation/refund rules?
16. What are initial platform-specific credit rates?
17. What are production RPO and RTO targets?
18. What are maximum concurrent jobs per organization?
19. What are maximum concurrent jobs per lab?
20. Which runtime isolation mechanism is required for physical robots?
21. How will firmware compatibility be managed?
22. How will robot maintenance windows be represented?
23. How will multi-lab scheduling be prioritized?
24. Which result formats should be standardized?
25. What data residency requirements apply to customer data?

These questions must not invalidate the established system boundaries.

## 125. Future Extensions

The architecture can support future capabilities including:

- simulation before physical execution;
- digital twins;
- AI-assisted development;
- remote debugging;
- experiment templates;
- collaborative projects;
- organization-level resource pools;
- multi-lab scheduling;
- robot fleets;
- edge/cloud hybrid execution;
- marketplace robot platforms;
- external robotics SDK integrations;
- automated benchmark execution;
- experiment comparison;
- ML dataset generation.

Future extensions must preserve the source-code boundary and physical safety boundary.

## 126. Architectural Invariants

The following invariants must remain true unless explicitly changed through an architecture
decision process:

1. Source code is not required by the normal remote execution path.
2. The `.krv` artifact is the remote execution boundary.
3. The Control Plane is authoritative for business state.
4. PostgreSQL is authoritative for transactional state.
5. Object storage holds large binary objects.
6. Lab Agent is the cloud-to-lab boundary.
7. Real-time robot control is local.
8. Physical safety systems remain authoritative.
9. API contracts are versioned.
10. Long-running execution is asynchronous.
11. Job and booking operations are idempotent.
12. UI is not an authorization authority.
13. WebSocket is not the system of record.
14. Video is not a command channel.
15. Robot applications do not directly access cloud databases.
16. Production execution requires artifact and resource validation.
17. Production architecture remains compatible with multiple robot platforms.
18. The architecture supports simulated and physical execution.
19. Environment separation is maintained.
20. Auditability is preserved.

## 127. Architecture Review Checklist

### System Structure

- [ ] All major system components are identified.
- [ ] Component ownership is defined.
- [ ] Component responsibilities are explicit.
- [ ] Trust zones are defined.
- [ ] Trust boundaries are documented.
- [ ] Communication paths are documented.
- [ ] Data ownership is documented.
- [ ] State authority is documented.

### Studio

- [ ] Studio responsibilities are defined.
- [ ] Studio does not become business-state authority.
- [ ] Studio uses versioned APIs.
- [ ] Studio uses WebSocket only for realtime observation.
- [ ] Studio reconnect behavior is defined.
- [ ] Studio does not access the database directly.

### Studio Local Runtime

- [ ] Local build is supported.
- [ ] Local test execution is supported.
- [ ] Local package generation is supported.
- [ ] Artifact signing is supported.
- [ ] Toolchain validation is supported.
- [ ] Source code remains local during normal operation.
- [ ] Local Runtime is isolated from arbitrary UI command execution.

### Control Plane

- [ ] Control Plane is the central business authority.
- [ ] Modular domain boundaries are defined.
- [ ] Authentication is enforced.
- [ ] Authorization is enforced server-side.
- [ ] API versioning is defined.
- [ ] Asynchronous operations are supported.
- [ ] Idempotency is defined.
- [ ] Auditability is defined.

### Database

- [ ] PostgreSQL is authoritative for structured business state.
- [ ] Repository boundaries are defined.
- [ ] Tenant isolation is enforced.
- [ ] Transactional booking behavior is defined.
- [ ] Credit ledger behavior is defined.
- [ ] Job/run state is persisted.
- [ ] Backup requirements are defined.

### Object Storage

- [ ] Artifact storage is defined.
- [ ] Result storage is defined.
- [ ] Video/log storage is defined.
- [ ] Object metadata is stored separately.
- [ ] Signed access is supported.
- [ ] Retention policies are defined.
- [ ] Encryption is defined.

### Queue and Workers

- [ ] Asynchronous operations use queue infrastructure where appropriate.
- [ ] Worker retry behavior is defined.
- [ ] Worker idempotency is defined.
- [ ] Dead-letter handling is defined.
- [ ] Queue monitoring is defined.
- [ ] Queue is not treated as authoritative state.

### Artifact

- [ ] Artifact format is versioned.
- [ ] Artifact manifest is defined.
- [ ] Artifact checksum is defined.
- [ ] Artifact signature is defined.
- [ ] Artifact compatibility is validated.
- [ ] Artifact policy is enforced.
- [ ] Artifact retention is defined.
- [ ] Artifact access is audited.

### Booking

- [ ] Platform is part of booking identity.
- [ ] Resource is part of booking identity.
- [ ] Time window is authoritative.
- [ ] Booking conflicts are prevented.
- [ ] Booking lifecycle is defined.
- [ ] Cancellation behavior is defined.
- [ ] Booking creation is idempotent.

### Credits

- [ ] Credits are platform-specific.
- [ ] Credit balance is server authoritative.
- [ ] Credit consumption is auditable.
- [ ] Credit quote is deterministic.
- [ ] Refund behavior is defined.
- [ ] Credit operations are idempotent.
- [ ] Client cannot arbitrarily modify credit state.

### Jobs and Runs

- [ ] Job lifecycle is defined.
- [ ] Run lifecycle is defined.
- [ ] Job state is persisted.
- [ ] Run state is persisted.
- [ ] Resource locks are defined.
- [ ] Duplicate execution is prevented.
- [ ] Stop/cancel behavior is defined.
- [ ] Failure reconciliation is defined.

### Lab Agent

- [ ] Lab Agent identity is authenticated.
- [ ] Lab Agent authorization is enforced.
- [ ] Heartbeat is implemented.
- [ ] Capability discovery is implemented.
- [ ] Resource discovery is implemented.
- [ ] Artifact retrieval is authorized.
- [ ] Deployment is controlled.
- [ ] Arbitrary shell access is prohibited.
- [ ] Disconnect behavior is defined.

### Kritva Runtime

- [ ] Runtime lifecycle is defined.
- [ ] Application isolation is defined.
- [ ] Runtime compatibility is versioned.
- [ ] Local real-time behavior is preserved.
- [ ] Runtime health is reported.
- [ ] Runtime logs are structured.
- [ ] Runtime telemetry is available.
- [ ] Runtime failure behavior is defined.

### Robot

- [ ] Robot platform identity is defined.
- [ ] Hardware capabilities are defined.
- [ ] Architecture is defined.
- [ ] Runtime compatibility is defined.
- [ ] Robot safety boundary is explicit.
- [ ] Physical E-stop remains authoritative.
- [ ] Cloud cannot bypass physical safety.
- [ ] Real-time control remains local.

### Video and Telemetry

- [ ] Video is separated from control.
- [ ] Telemetry is separated from transactional state.
- [ ] WebRTC or equivalent production path is defined.
- [ ] Telemetry sampling is defined.
- [ ] High-rate telemetry does not overload PostgreSQL.
- [ ] Realtime reconnect is supported.

### Security

- [ ] TLS is required.
- [ ] Authentication is defined.
- [ ] Authorization is defined.
- [ ] Secrets are protected.
- [ ] Artifact integrity is validated.
- [ ] Artifact signatures are validated.
- [ ] Tenant isolation is enforced.
- [ ] Audit events are retained.
- [ ] Supply-chain risks are addressed.
- [ ] Lab connectivity is secured.

### Reliability

- [ ] Failure modes are documented.
- [ ] Network partition behavior is defined.
- [ ] Studio disconnect behavior is defined.
- [ ] Control Plane outage behavior is defined.
- [ ] Lab Agent outage behavior is defined.
- [ ] Robot outage behavior is defined.
- [ ] Resource reconciliation is defined.
- [ ] Disaster recovery is defined.
- [ ] Backup restoration is tested.

### Operations

- [ ] Metrics are defined.
- [ ] Logs are defined.
- [ ] Tracing/correlation is defined.
- [ ] Alerts are defined.
- [ ] Runbooks exist.
- [ ] Deployment is versioned.
- [ ] Rollback is defined.
- [ ] Production changes are auditable.

## 128. Phase Acceptance Criteria

### Phase 0

- [ ] System boundaries documented.
- [ ] Repository structure established.
- [ ] Core contracts established.
- [ ] Local Control Plane runs.
- [ ] Local PostgreSQL runs.
- [ ] Local object storage runs.
- [ ] Local queue runs.
- [ ] Mock Lab Agent runs.
- [ ] Simulated execution path works.
- [ ] CI validates the architecture.

### Phase 1

- [ ] Studio launches.
- [ ] Authentication flow works.
- [ ] Project workflow works.
- [ ] Local Runtime IPC works.
- [ ] Platform catalog can be displayed.
- [ ] Backend state is authoritative.

### Phase 2

- [ ] Local source builds.
- [ ] Local tests execute.
- [ ] `.krv` is generated.
- [ ] Manifest is generated.
- [ ] Checksum is generated.
- [ ] Signature is generated.
- [ ] Artifact uploads successfully.
- [ ] Server validates artifact.
- [ ] Source code is not uploaded during standard execution.

### Phase 3

- [ ] Control Plane domains are operational.
- [ ] PostgreSQL stores authoritative state.
- [ ] REST API is versioned.
- [ ] WebSocket events work.
- [ ] Jobs and runs are persisted.
- [ ] Audit events are persisted.
- [ ] API authorization is enforced.

### Phase 4

- [ ] Availability query works.
- [ ] Booking creation works.
- [ ] Booking conflict prevention works.
- [ ] Platform-specific credits work.
- [ ] Credit consumption is auditable.
- [ ] Cancellation/refund behavior works.
- [ ] Billing integration boundary is defined.

### Phase 5

- [ ] Job creation works.
- [ ] Artifact validation works.
- [ ] Resource locking works.
- [ ] Deployment works.
- [ ] Runtime starts.
- [ ] Runtime stops.
- [ ] Job cancellation works.
- [ ] Failure states are recorded.
- [ ] Duplicate execution is prevented.

### Phase 6

- [ ] Real Lab Agent registers.
- [ ] Lab Agent heartbeat works.
- [ ] Real resource discovery works.
- [ ] Real platform compatibility works.
- [ ] Artifact deployment works.
- [ ] Runtime health is monitored.
- [ ] Lab disconnect behavior works.
- [ ] Human safety review is completed before physical deployment.

### Phase 7

- [ ] Live video works.
- [ ] Telemetry works.
- [ ] Logs work.
- [ ] Results are persisted.
- [ ] Result files can be downloaded.
- [ ] Rerun creates a new execution.
- [ ] Historical runs remain immutable.

### Phase 8

- [ ] Production deployment is reproducible.
- [ ] Production security controls are active.
- [ ] Monitoring is active.
- [ ] Alerting is active.
- [ ] Backup is active.
- [ ] Restore has been tested.
- [ ] Disaster recovery has been exercised.
- [ ] Production audit is active.
- [ ] Operational runbooks exist.
- [ ] Cost controls exist.
- [ ] Production promotion is approval-gated.

## 129. Final System Acceptance Criteria

The Kritva RaaS system architecture is considered implemented when all of the following
are demonstrably true:

- [ ] A user can develop source code locally.
- [ ] A user can build locally.
- [ ] A user can test locally.
- [ ] A user can generate a `.krv` artifact locally.
- [ ] The source repository remains on the user's workstation during the normal flow.
- [ ] The artifact can be uploaded without uploading the source repository.
- [ ] The Control Plane validates artifact identity and compatibility.
- [ ] The user can select a supported robotic platform.
- [ ] The user can obtain an availability result.
- [ ] The user can create a booking.
- [ ] The system prevents conflicting resource allocation.
- [ ] Platform-specific credits are enforced.
- [ ] A valid job can be created from a valid artifact and booking.
- [ ] A resource is explicitly allocated.
- [ ] The Lab Agent receives only authorized execution work.
- [ ] The Lab Agent retrieves the authorized artifact.
- [ ] The artifact is validated again at the lab boundary.
- [ ] The Kritva Runtime starts the application.
- [ ] Real-time robot control remains local.
- [ ] The Control Plane does not directly control motor loops.
- [ ] Job state is persisted.
- [ ] Run state is persisted.
- [ ] Live events can be delivered to Studio.
- [ ] Studio can reconnect and resynchronize state.
- [ ] Telemetry can be observed.
- [ ] Logs can be observed.
- [ ] Video can be observed through the media path.
- [ ] Results can be collected.
- [ ] Results can be downloaded.
- [ ] A run can be repeated without mutating historical state.
- [ ] All important execution actions are auditable.
- [ ] Cloud-to-lab communication is authenticated and encrypted.
- [ ] Physical E-stop remains independent of cloud execution control.
- [ ] Network failure does not create unsafe robot behavior.
- [ ] Cloud failure does not bypass physical safety.
- [ ] Duplicate execution is prevented.
- [ ] Duplicate financial/resource side effects are prevented.
- [ ] Artifact compatibility is deterministic.
- [ ] Tenant isolation is enforced.
- [ ] Production data is isolated from development and staging.
- [ ] Backup and restore procedures are validated.
- [ ] Disaster recovery procedures are validated.
- [ ] Production deployment is versioned and reproducible.
- [ ] The architecture can support multiple robot platforms.
- [ ] The architecture can support multiple laboratories.
- [ ] The architecture can support simulated and physical robots.
- [ ] The architecture can evolve from a modular monolith without changing fundamental
      product boundaries.
- [ ] The architecture preserves the principle:

      Build locally.
      Book remotely.
      Upload the artifact.
      Run on real robots.
      Observe live.
      Analyze results.
      Run again.

## 130. Architectural Baseline Statement

The Kritva RaaS architecture establishes a deliberate separation between development,
commercial control, cloud orchestration, laboratory infrastructure, robot runtime, and
physical safety.

The developer owns the development environment and source code.

The Studio provides the developer-facing product experience.

The Studio Local Runtime provides controlled local build and packaging capabilities.

The Control Plane owns identity, authorization, projects, platforms, artifacts, bookings,
credits, jobs, runs, results, and audit.

Cloud infrastructure provides durable state, binary storage, asynchronous processing,
observability, and operational reliability.

The Lab Agent provides the controlled boundary into physical laboratory resources.

The Kritva Runtime provides the local execution environment on the robot.

The robot and its physical safety systems remain the authoritative environment for
real-time control and physical safety.

The architecture therefore separates:

    DEVELOPMENT
        from
    EXECUTION

    SOURCE CODE
        from
    ARTIFACT

    CLOUD ORCHESTRATION
        from
    ROBOT REAL-TIME CONTROL

    APPLICATION STOP
        from
    PHYSICAL EMERGENCY STOP

    TRANSACTIONAL STATE
        from
    REALTIME EVENTS

    CONTROL
        from
    VIDEO

    BUSINESS DATA
        from
    LARGE BINARY OBJECTS

This separation is the foundation on which Kritva RaaS can evolve from a software-only
demonstration into a production platform capable of serving multiple users, organizations,
robot platforms, laboratories, and physical robotic resources without fundamentally
redesigning the system architecture.
