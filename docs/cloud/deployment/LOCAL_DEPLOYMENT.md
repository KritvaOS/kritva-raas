# Kritva RaaS Local Deployment

## 1. Document Control

| Item | Value |
|---|---|
| Document | Local Deployment Specification |
| Path | `docs/cloud/deployment/LOCAL_DEPLOYMENT.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Deployment Target | Developer workstation |
| Primary Runtime | Docker Compose |
| Secondary Runtime | Local Kubernetes |
| Local Kubernetes Options | Kind / k3d / equivalent |
| Database | PostgreSQL |
| Object Storage | S3-compatible local object storage |
| Queue | Local durable queue implementation/service |
| Lab | Simulated Lab Agent |
| API | RaaS Control Plane |
| Realtime | WebSocket |
| Environment | Local |
| Phase Coverage | Phase 0–Phase 8 |
| Intended Users | Developers, QA, architecture reviewers, CI engineers |

## 2. Purpose

This document defines the complete local deployment architecture and procedure
for the Kritva RaaS platform.

The objective is to allow a developer to run a production-oriented version of
the complete RaaS software stack on a workstation without requiring:

- a public cloud account;
- a physical robot;
- a physical laboratory;
- production credentials;
- production object storage;
- production PostgreSQL;
- production queue infrastructure.

The local deployment must exercise the same major application boundaries used
by Development, Staging and Production.

The local stack is therefore not a disposable demo environment.

It is the developer execution environment for validating:

- Control Plane APIs;
- WebSocket realtime;
- PostgreSQL persistence;
- object storage;
- asynchronous workers;
- scheduler;
- reconciliation;
- artifact lifecycle;
- booking;
- credits;
- Job/Run lifecycle;
- Lab Agent communication;
- simulated robot execution;
- telemetry;
- logs;
- results.

## 3. Scope

This document covers:

- workstation prerequisites;
- repository configuration;
- Docker Compose deployment;
- optional local Kubernetes deployment;
- local service topology;
- PostgreSQL;
- object storage;
- queue;
- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- simulated Lab Agent;
- simulated robot resources;
- seed data;
- local authentication;
- local configuration;
- ports;
- volumes;
- health checks;
- startup/shutdown;
- reset procedures;
- troubleshooting;
- local testing;
- observability;
- security boundaries;
- data lifecycle;
- Phase 0–8 mapping.

## 4. Non-Goals

Local deployment does not provide:

- production availability;
- production security posture;
- production-scale performance;
- physical robot safety validation;
- real robot control;
- real payment processing;
- production identity provider integration;
- production cloud networking;
- production DR;
- production RPO/RTO;
- production billing settlement.

Local execution may simulate these interfaces but must not represent simulation
as proof of production readiness.

## 5. Local Deployment Principles

The local environment follows these principles:

1. Local deployment should resemble production architecture.
2. PostgreSQL remains authoritative for structured state.
3. Object storage remains authoritative for large objects.
4. Queue remains asynchronous transport.
5. REST remains authoritative for durable API state.
6. WebSocket remains realtime notification transport.
7. Workers are independently executable.
8. Lab Agent remains a distinct security boundary.
9. Physical safety is not simulated as if it were a real safety system.
10. Configuration is externalized.
11. Secrets are local-development-only.
12. Services communicate through explicit interfaces.
13. The same application containers should be usable in higher environments.
14. Local infrastructure must be reproducible.
15. Seed data must be deterministic.
16. Reset must be safe and documented.
17. Developers must not need production credentials.
18. Local failures must be observable.

# 6. Local Architecture

The recommended local topology is:

    Developer Workstation
           |
           +------------------------------------------------+
           |                                                |
           |                Docker Network                  |
           |                                                |
           |   +----------------------+                     |
           |   | RaaS Studio/Web UI   |                     |
           |   +----------+-----------+                     |
           |              |                                 |
           |              v                                 |
           |   +----------------------+                     |
           |   | RaaS Control Plane   |                     |
           |   | REST + WebSocket      |                     |
           |   +----------+-----------+                     |
           |              |                                 |
           |       +------+-------+----------------+        |
           |       |              |                |        |
           |       v              v                v        |
           |   PostgreSQL    Object Storage     Queue       |
           |       |              |                |        |
           |       +--------------+----------------+        |
           |                      |                         |
           |                      v                         |
           |              +---------------+                 |
           |              | Worker        |                 |
           |              +---------------+                 |
           |                      |                         |
           |              +-------+-------+                 |
           |              | Scheduler     |                 |
           |              +---------------+                 |
           |                      |                         |
           |              +-------+-------+                 |
           |              | Reconciliation|                 |
           |              +---------------+                 |
           |                      |                         |
           |                      v                         |
           |              +---------------+                 |
           |              | Simulated      |                 |
           |              | Lab Agent      |                 |
           |              +-------+-------+                 |
           |                      |                         |
           |                      v                         |
           |              +---------------+                 |
           |              | Simulated      |                 |
           |              | Robot/Resource |                 |
           |              +---------------+                 |
           +------------------------------------------------+

## 7. Deployment Modes

Two local deployment modes are supported.

| Mode | Purpose | Priority |
|---|---|---|
| Docker Compose | Default developer environment | P0 |
| Local Kubernetes | Kubernetes/platform validation | P1 |

Docker Compose is the canonical local deployment.

Local Kubernetes exists to validate:

- container assumptions;
- service discovery;
- health checks;
- workload separation;
- secrets/configuration;
- deployment behavior;
- worker scaling;
- Kubernetes-oriented deployment artifacts.

The application architecture must not depend on Kubernetes-specific APIs.

# 8. Docker Compose as Canonical Local Runtime

The local Compose deployment should be represented conceptually by:

    docker compose
        |
        +-- raas-api
        +-- raas-websocket
        +-- raas-worker
        +-- raas-scheduler
        +-- raas-reconciler
        +-- raas-lab-agent
        +-- raas-postgres
        +-- raas-object-store
        +-- raas-queue
        +-- optional raas-web
        +-- optional observability services

The exact service split may use the same application image with different
commands rather than separate images.

The Control Plane remains a modular monolith.

Deployment separation does not imply separate domain services.

# 9. Local Service Inventory

| Service | Purpose | Persistent Data | Default |
|---|---|---|---|
| `api` | REST Control Plane | PostgreSQL | Required |
| `websocket` | Realtime channel | PostgreSQL/events | Required |
| `worker` | Async processing | PostgreSQL/queue | Required |
| `scheduler` | Resource allocation | PostgreSQL | Required |
| `reconciler` | Recovery/reconciliation | PostgreSQL | Required |
| `postgres` | Structured state | Volume | Required |
| `object-store` | Artifacts/results | Volume | Required |
| `queue` | Async transport | Volume/config | Required |
| `lab-agent` | Simulated lab | Optional state | Required |
| `simulator` | Simulated robot/resource | Optional | Required |
| `web` | Local browser console | No | Optional/P1 |
| `otel` | Telemetry collector | Optional | P1 |
| `metrics` | Metrics backend | Optional | P1 |
| `logs` | Log backend | Optional | P1 |

The API and WebSocket may be implemented by the same Control Plane process if
the backend framework supports both.

# 10. Local Network

All application services should use an internal Docker network.

Recommended logical network:

    raas-local
        |
        +-- api
        +-- websocket
        +-- worker
        +-- scheduler
        +-- reconciler
        +-- postgres
        +-- object-store
        +-- queue
        +-- lab-agent
        +-- simulator

Only explicitly required developer-facing ports are published to the host.

Database, queue and internal service ports should not be exposed unless needed
for development tools.

# 11. Default Host Ports

The following baseline port allocation is recommended.

| Service | Container Port | Host Port | Exposure |
|---|---:|---:|---|
| REST API | 8080 | 8080 | Host |
| WebSocket | 8080 | 8080 | Host |
| Web Console | 3000 | 3000 | Host |
| PostgreSQL | 5432 | 5432 | Optional |
| Object Storage API | 9000 | 9000 | Host |
| Object Storage Console | 9001 | 9001 | Optional |
| Queue | 5672/other | 5672 | Optional |
| Queue Admin | provider-specific | 15672 | Optional |
| Lab Agent | 8090 | 8090 | Optional |
| Simulator | 8091 | 8091 | Optional |
| Metrics | 9090 | 9090 | Optional |
| Telemetry Collector | 4317 | 4317 | Optional |

The exact queue and observability ports depend on the selected local
implementations.

Port conflicts must be configurable through `.env.local`.

# 12. Local API Endpoints

Baseline local URLs:

    http://localhost:8080/api/v1/
    ws://localhost:8080/api/v1/ws
    http://localhost:3000/

Health endpoints should include:

    GET /health
    GET /ready
    GET /version

The health endpoint indicates process health.

The readiness endpoint indicates whether required dependencies are usable.

## 13. Service Discovery

Containers communicate using service names rather than host loopback.

Examples:

    postgres:5432
    object-store:9000
    queue:5672
    lab-agent:8090

The following is prohibited inside application containers:

    localhost:5432
    localhost:9000
    localhost:5672

unless the service itself is intentionally running inside the same container.

## 14. PostgreSQL Local Deployment

PostgreSQL is the authoritative structured database.

Recommended baseline:

- PostgreSQL 16 or project-selected supported version;
- UTF-8;
- UTC session configuration;
- persistent Docker volume;
- non-default application database;
- separate application credentials.

Example configuration:

    POSTGRES_DB=kritva_raas
    POSTGRES_USER=raas_app
    POSTGRES_PASSWORD=<local-development-secret>

The exact password must not be committed to the repository.

## 15. PostgreSQL Local Data

The local database contains:

- users;
- organizations;
- memberships;
- projects;
- platforms;
- platform versions;
- capabilities;
- artifacts;
- artifact validations;
- bookings;
- credit plans;
- wallets;
- credit transactions;
- jobs;
- runs;
- labs;
- lab agents;
- resources;
- allocations;
- results;
- result files;
- audit events;
- idempotency records;
- outbox records where implemented.

## 16. Database Migration

Startup must not blindly recreate the database schema.

The preferred flow is:

    Container Start
         |
         v
    Database Available?
         |
         v
    Migration Runner
         |
         v
    Schema Current?
       /     \
     No       Yes
     |         |
     v         v
    Apply     Start
    Migration Services

Migrations must be version-controlled.

Production migration rules also apply locally where technically relevant:

- migrations are ordered;
- destructive changes are deliberate;
- failed migrations are visible;
- schema version is recorded.

## 17. Seed Data

Local deployment must support deterministic seed data.

Seed data is intended for:

- UI development;
- API testing;
- booking testing;
- credit testing;
- Job/Run testing;
- lab testing;
- end-to-end testing.

Seed data must never contain production credentials.

## 18. Recommended Seed Dataset

The baseline seed dataset should contain:

| Entity | Example |
|---|---|
| User | `dev@example.local` |
| Organization | `Kritva Demo Organization` |
| Member | Developer/Admin roles |
| Project | `Vision Experiment` |
| Platform | `Humanoid-A` |
| Platform Version | `humanoid-a-v1` |
| Capability | `camera`, `telemetry`, `motion` |
| Credit Plan | `Humanoid-A Developer` |
| Credit Wallet | Deterministic balance |
| Lab | `Local Simulation Lab` |
| Agent | `local-agent-001` |
| Resource | `humanoid-a-sim-001` |
| Artifact | Sample `.krv` |
| Booking | Optional active/future booking |
| Job | Optional sample job |
| Run | Optional completed sample run |
| Result | Sample result |

## 19. Seed Data Rule

Seed data must be idempotent.

Running:

    make seed

twice must not create duplicate users, organizations, platforms or wallets.

Seed scripts should use stable identifiers or deterministic lookup keys.

## 20. Seed Profiles

At least three profiles are recommended:

| Profile | Purpose |
|---|---|
| `minimal` | Smallest valid environment |
| `developer` | Normal development workflow |
| `demo` | Complete UI/E2E demonstration |

Example:

    make seed PROFILE=developer

or:

    make seed PROFILE=demo

## 21. Local Authentication

Local authentication must not require production identity infrastructure.

The local environment should support one of:

- local development identity provider;
- development-only credential authentication;
- signed local test tokens.

The selected method must use the same application authorization model as
higher environments.

Roles should include at least:

- user;
- organization administrator;
- platform/lab administrator;
- system administrator.

## 22. Local Tenant Model

The local environment must still enforce organization boundaries.

A request must not gain access merely because it runs locally.

The application must validate:

    Principal
       |
       v
    Organization Membership
       |
       v
    Role
       |
       v
    Resource Ownership
       |
       v
    Authorization Policy
       |
       v
    Allow / Deny

Local mode may simplify identity acquisition but must not remove authorization
logic.

## 23. Object Storage

An S3-compatible local object store is recommended.

The service provides:

- artifact storage;
- result files;
- logs;
- optional video;
- telemetry archives.

Example configuration:

    OBJECT_STORAGE_ENDPOINT=http://object-store:9000
    OBJECT_STORAGE_BUCKET_ARTIFACTS=raas-artifacts
    OBJECT_STORAGE_BUCKET_RESULTS=raas-results
    OBJECT_STORAGE_BUCKET_LOGS=raas-logs
    OBJECT_STORAGE_BUCKET_VIDEO=raas-video
    OBJECT_STORAGE_BUCKET_TELEMETRY=raas-telemetry

The exact variable names must match the implementation configuration contract.

## 24. Local Object Storage Security

Local object storage remains private to the Docker network unless developer
inspection requires host exposure.

Signed URLs should still be exercised locally.

The purpose is to ensure that the production authorization model is tested
rather than replaced with direct unrestricted file access.

## 25. Queue

The local queue must provide the same logical semantics required by the
application:

- durable delivery;
- acknowledgement;
- retry;
- dead-letter behavior where supported;
- consumer groups or equivalent where required;
- visibility/lease timeout where applicable.

The queue implementation is replaceable.

The application must not treat queue contents as authoritative state.

## 26. Queue Flow

    API
      |
      v
    PostgreSQL
      |
      v
    Queue
      |
      v
    Worker
      |
      +--> Database
      +--> Object Storage
      +--> Lab Agent
      |
      v
    Event / State Update

Workers must tolerate duplicate messages.

## 27. Worker Services

Local workers should cover the production logical worker classes:

- artifact validation;
- job processing;
- result processing;
- notifications where implemented;
- reconciliation.

The initial deployment may combine worker classes into one process while
retaining logical boundaries in code.

## 28. Scheduler

The scheduler is responsible for:

- selecting eligible resources;
- validating booking state;
- validating platform compatibility;
- checking resource availability;
- coordinating allocation;
- creating execution work.

It does not directly control motors or robot hardware.

The simulator remains behind the Lab Agent boundary.

## 29. Reconciliation Worker

The local reconciler exercises production recovery logic.

It should detect:

- stale Jobs;
- stale Runs;
- stale allocations;
- disconnected Lab Agents;
- incomplete artifacts;
- object/database mismatch;
- failed result processing.

The reconciler must not blindly restart physical operations.

## 30. Simulated Lab Agent

The simulated Lab Agent is a first-class local component.

It emulates the cloud-facing behavior of a real Lab Agent.

Responsibilities:

- registration;
- authentication;
- heartbeat;
- capabilities;
- resources;
- resource health;
- artifact retrieval;
- deployment;
- start;
- stop;
- cancel;
- telemetry;
- logs;
- result generation;
- reconnect;
- state reconciliation.

## 31. Simulated Lab Topology

    Control Plane
          |
       Secure Lab
        Channel
          |
          v
    Simulated Lab Agent
          |
          +--------------------+
          |                    |
          v                    v
    Simulated Resource    Simulated Robot
          |                    |
          +----------+---------+
                     |
                  Telemetry
                     |
                     v
                Control Plane

## 32. Simulated Resource Model

The simulator should expose at least:

    resource_id
    platform_id
    platform_version
    architecture
    capabilities
    health
    availability
    power_state
    execution_state

Example:

    resource_id=humanoid-a-sim-001
    platform_id=humanoid-a
    platform_version=v1
    architecture=linux-arm64
    capabilities=camera,motion,telemetry
    health=HEALTHY

## 33. Simulated Robot States

The simulator should support:

- OFFLINE;
- ONLINE;
- IDLE;
- RESERVED;
- DEPLOYING;
- STARTING;
- RUNNING;
- STOPPING;
- FAULT;
- MAINTENANCE.

Transitions should be deterministic and observable.

## 34. Simulated Execution

A local execution should follow:

    Booking Confirmed
          |
          v
    Job Created
          |
          v
    Validation
          |
          v
    Allocation
          |
          v
    Deployment
          |
          v
    Start
          |
          v
    Running
          |
          v
    Telemetry / Logs
          |
          v
    Stop
          |
          v
    Result
          |
          v
    Completed

This path should use production application services rather than a separate
demo-only backend.

## 35. Local Artifact

A sample `.krv` artifact should be provided for local development.

The artifact should contain conceptually:

    manifest.json
    application
    libraries/
    config/
    signature/
    digest

Local development may permit unsigned artifacts if explicitly configured.

Production signing requirements must not be silently weakened in staging or
production.

## 36. Artifact Validation

Local artifact validation should exercise:

- package structure;
- manifest parsing;
- platform compatibility;
- architecture compatibility;
- KritvaOS compatibility;
- SDK compatibility;
- capability requirements;
- checksum;
- signature policy.

Failure should return the same stable application error model used by higher
environments.

## 37. Booking Simulation

The local platform must allow developers to:

- query availability;
- quote credits;
- create booking;
- modify booking;
- cancel booking;
- activate booking;
- complete booking.

Booking conflicts should be enforced using the same transaction logic as the
production service.

## 38. Credit Simulation

Local credit wallets should use deterministic seed balances.

The local environment must exercise:

- quote;
- reservation;
- release;
- consumption;
- refund;
- expiration where implemented.

The credit ledger must remain immutable.

Local mode must not disable platform-specific credit rules.

## 39. Job Simulation

The local environment must support the complete Job lifecycle:

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

The simulator must be able to produce successful and failure scenarios.

## 40. Run Simulation

Runs represent actual execution attempts.

The simulator should support:

- successful run;
- failed run;
- cancelled run;
- timeout;
- telemetry generation;
- log generation;
- result generation.

Job and Run state must remain distinct.

## 41. Telemetry Simulation

The simulator should generate controlled telemetry such as:

- CPU;
- memory;
- temperature;
- battery;
- joint position;
- joint velocity;
- motor state;
- camera status;
- network state.

High-frequency telemetry should not be written indefinitely into PostgreSQL.

Local aggregation should exercise the same architecture intended for production.

## 42. Log Simulation

Simulated execution should produce structured logs containing:

- timestamp;
- severity;
- job ID;
- run ID;
- resource ID;
- component;
- message;
- correlation information.

Secrets and credentials must never be included.

## 43. Result Simulation

A successful local run should generate:

- result metadata;
- summary;
- metrics;
- output files;
- execution logs.

The result lifecycle should include:

    CREATED
       |
    PROCESSING
       |
    AVAILABLE

Failure should produce:

    PROCESSING
       |
    FAILED

## 44. Local Configuration

Configuration must be externalized.

Recommended files:

    .env.example
    .env.local
    docker-compose.yml
    docker-compose.dev.yml
    docker-compose.observability.yml
    deploy/
        compose/
        k8s-local/

`.env.local` must not be committed.

## 45. Configuration Categories

| Category | Examples |
|---|---|
| Application | API host, environment |
| Database | host, port, DB, credentials |
| Storage | endpoint, bucket, credentials |
| Queue | endpoint, credentials |
| Authentication | local issuer, signing configuration |
| Lab | Agent endpoint, identity |
| Observability | telemetry endpoint |
| Limits | upload size, request limits |
| Feature flags | local simulation features |

## 46. Configuration Example

    RAAS_ENVIRONMENT=local
    RAAS_LOG_LEVEL=INFO

    DATABASE_HOST=postgres
    DATABASE_PORT=5432
    DATABASE_NAME=kritva_raas

    OBJECT_STORAGE_ENDPOINT=http://object-store:9000

    QUEUE_ENDPOINT=<local-queue-endpoint>

    LAB_AGENT_ENDPOINT=http://lab-agent:8090

    OTEL_EXPORTER_OTLP_ENDPOINT=http://otel:4317

Actual variable names must be defined by the backend configuration contract.

## 47. Configuration Rules

- no production secrets;
- no hard-coded host paths;
- no provider-specific production credentials;
- no source-code secrets;
- defaults should be safe;
- invalid configuration should fail fast;
- configuration must be logged only in redacted form.

## 48. Local Volumes

Recommended persistent volumes:

    raas_postgres_data
    raas_object_data
    raas_queue_data

Optional:

    raas_observability_data

Application containers should remain stateless.

## 49. Startup Sequence

The recommended startup order is:

    1. Docker network
    2. PostgreSQL
    3. Object Storage
    4. Queue
    5. Migration
    6. API
    7. WebSocket
    8. Workers
    9. Scheduler
    10. Reconciler
    11. Simulated Lab Agent
    12. Simulator
    13. Web Console
    14. Seed Data

Container health checks should enforce dependency readiness.

## 50. Startup Command

The developer-facing workflow should be approximately:

    git clone <repository>
    cd kritva-raas
    cp .env.example .env.local
    docker compose --env-file .env.local up -d
    make migrate
    make seed
    make status

The exact repository scripts may evolve, but the workflow should remain
equivalent.

## 51. Shutdown

Normal shutdown:

    docker compose down

This stops services but preserves named volumes unless `-v` is used.

Developers must understand the difference between:

    docker compose down

and:

    docker compose down -v

The second command deletes local persistent volumes.

## 52. Full Local Reset

A complete reset should be available through a controlled command such as:

    make reset-local

Conceptually:

    Stop Services
        |
    Remove Containers
        |
    Remove Local Volumes
        |
    Recreate Services
        |
    Run Migrations
        |
    Seed Data

Reset must never operate against non-local environments.

## 53. Local Status

A status command should show:

    Service            Status
    --------------------------------
    api                healthy
    websocket          healthy
    worker             healthy
    scheduler          healthy
    reconciler         healthy
    postgres           healthy
    object-store       healthy
    queue              healthy
    lab-agent          healthy
    simulator          healthy

## 54. Health Checks

Every long-running service should expose an appropriate health mechanism.

Health categories:

- process health;
- dependency readiness;
- application readiness;
- Lab Agent health;
- resource health.

A healthy API does not imply a healthy simulated robot.

## 55. Local Observability

Minimum local observability:

- structured application logs;
- request IDs;
- trace IDs where enabled;
- Job/Run IDs;
- Lab Agent IDs;
- resource IDs;
- service health.

Optional local observability stack:

    Application
       |
    OpenTelemetry
       |
    Collector
       |
       +--> Metrics
       +--> Logs
       +--> Traces

The complete observability stack may be enabled through a separate Compose
profile to reduce workstation resource consumption.

## 56. Local Web Console

If the Web Console is implemented in the repository, it should run as a local
development service.

Recommended:

    http://localhost:3000/

It should connect only to the local Control Plane.

The Web Console must not require production endpoints in local mode.

## 57. Studio Integration

Kritva RaaS Studio is a desktop application and should normally run natively
on the developer workstation.

Its local configuration points to:

    API = http://localhost:8080/api/v1
    WebSocket = ws://localhost:8080/api/v1/ws

The Studio's local build process remains local.

The local Control Plane receives only the generated `.krv` artifact.

## 58. Local Build/Artifact Flow

    Developer Source
          |
          v
    Local Toolchain
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
    .krv Artifact
          |
          v
    Local RaaS API
          |
          v
    Object Storage
          |
          v
    Simulated Lab Agent

This preserves the fundamental:

> Build locally, execute remotely.

In local mode, “remote” means a separate containerized Lab boundary.

## 59. Kubernetes-Local Deployment

A Kubernetes-local deployment may be implemented under:

    deploy/k8s-local/

Recommended structure:

    deploy/k8s-local/
        namespace.yaml
        config/
        secrets/
        postgres/
        storage/
        queue/
        api/
        worker/
        scheduler/
        reconciler/
        lab-agent/
        simulator/
        web/
        ingress/

The exact resource structure may vary with the selected Kubernetes distribution.

## 60. Kubernetes-Local Namespace

All local Kubernetes workloads should run in a dedicated namespace such as:

    kritva-raas-local

The namespace prevents accidental interaction with unrelated workloads.

## 61. Kubernetes Service Discovery

Kubernetes services should use stable service names:

    api.kritva-raas-local
    postgres.kritva-raas-local
    object-store.kritva-raas-local
    queue.kritva-raas-local
    lab-agent.kritva-raas-local

Application configuration should reference service discovery rather than host
IP addresses.

## 62. Kubernetes-Local Secrets

Kubernetes Secrets may be used for local development.

They must not be treated as equivalent to production managed secret stores.

The production deployment remains governed by the cloud secrets architecture.

## 63. Kubernetes-Local Ingress

A local ingress or port-forward may expose:

    API
    Web Console
    WebSocket

For example:

    kubectl -n kritva-raas-local port-forward svc/api 8080:8080

The exact ingress mechanism is implementation-dependent.

## 64. Compose versus Kubernetes

| Capability | Compose | Kubernetes-Local |
|---|---|---|
| Developer startup | Excellent | Moderate |
| Resource usage | Lower | Higher |
| Debugging | Simple | More complex |
| Production similarity | Moderate | Higher |
| Service discovery | Basic | Native |
| Scaling tests | Limited | Strong |
| CI smoke tests | Strong | Moderate |
| P0 local target | Yes | No |
| P1 target | Optional | Yes |

Compose remains the default.

## 65. Local Security Boundary

The local environment is not production-hardened, but the architecture must
still preserve:

- authentication;
- authorization;
- tenant isolation;
- artifact verification;
- idempotency;
- audit events;
- structured errors;
- resource ownership.

The following are acceptable local simplifications:

- development identity;
- local credentials;
- unsigned development artifact mode;
- localhost exposure.

These simplifications must be explicit and impossible to confuse with
production configuration.

## 66. Local Error Model

The local stack must use the same stable error registry.

Examples:

    AUTH_REQUIRED
    AUTHZ_DENIED
    PROJECT_NOT_FOUND
    PLATFORM_INCOMPATIBLE
    ARTIFACT_INVALID
    ARTIFACT_DIGEST_MISMATCH
    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    JOB_INVALID_STATE
    JOB_RESOURCE_UNAVAILABLE
    RUN_RUNTIME_FAILURE
    AGENT_OFFLINE
    RESOURCE_BUSY
    TELEMETRY_UNAVAILABLE
    INFRA_DATABASE_UNAVAILABLE
    INFRA_STORAGE_UNAVAILABLE
    INFRA_QUEUE_UNAVAILABLE

Local implementations must not invent unrelated error semantics.

## 67. Local Event Model

The local environment must exercise the same event categories used in higher
environments.

Examples:

    project.created
    artifact.uploaded
    artifact.accepted
    booking.confirmed
    credit.reserved
    job.queued
    job.running
    run.running
    run.metrics.updated
    run.completed
    result.available
    agent.online
    agent.offline
    resource.busy
    resource.released

WebSocket delivery remains at-least-once.

Clients must deduplicate by event ID.

## 68. Local Event Replay

The local environment should support enough event replay/reconciliation to
test reconnect behavior.

At minimum:

- client disconnect;
- event generation;
- client reconnect;
- state query;
- reconciliation.

A local developer must be able to verify that a temporary WebSocket failure
does not corrupt UI state.

## 69. Local Failure Injection

The simulator should support controlled failures.

Recommended failure modes:

- Agent offline;
- resource unavailable;
- artifact rejected;
- deployment failed;
- start failed;
- runtime failed;
- stop timeout;
- telemetry degraded;
- result processing failed;
- queue delay;
- worker restart.

Failure injection must be explicitly enabled.

## 70. Local Recovery Flow

Example:

    Job RUNNING
        |
    Worker Crash
        |
    Queue Message Redelivered
        |
    Worker Restarts
        |
    Query PostgreSQL
        |
    Query Lab Agent
        |
    Reconcile State
        |
    Continue / Stop / Mark Uncertain

The system must not assume that a worker crash means the robot stopped.

## 71. Developer Workflow

Recommended workflow:

    1. Start local stack.
    2. Check health.
    3. Apply migrations.
    4. Seed developer data.
    5. Start Studio/Web Console.
    6. Create/open project.
    7. Build locally.
    8. Package `.krv`.
    9. Upload artifact.
    10. Create booking.
    11. Start Job.
    12. Observe Run.
    13. View telemetry/logs.
    14. Stop or complete Run.
    15. Inspect Result.
    16. Repeat after changing source.

## 72. Local API Testing

Developers should be able to use:

- browser;
- curl;
- Postman/Insomnia;
- automated integration tests.

Example:

    curl http://localhost:8080/health

Authenticated requests must use the local authentication mechanism.

## 73. Local Database Inspection

Developers may connect to PostgreSQL when the port is explicitly published.

Example:

    psql -h localhost -p 5432 -U raas_app -d kritva_raas

Database inspection must not replace application-level validation.

Schema changes must still use migrations.

## 74. Local Object Inspection

Developers may use the local object-store administrative interface if enabled.

Object storage inspection is useful for:

- artifact verification;
- result debugging;
- lifecycle testing;
- orphan detection.

Direct modification of production-style metadata is prohibited in normal tests.

## 75. Local Logs

Basic commands should support:

    docker compose logs -f api
    docker compose logs -f worker
    docker compose logs -f scheduler
    docker compose logs -f reconciler
    docker compose logs -f lab-agent

A project-level command such as:

    make logs

should aggregate important services.

## 76. Local Troubleshooting Matrix

| Symptom | Likely Cause | Action |
|---|---|---|
| API unavailable | API not started | Check API logs |
| API unhealthy | Dependency failure | Check readiness |
| DB connection failed | PostgreSQL unavailable | Check DB health |
| Migration failed | Schema/config issue | Inspect migration logs |
| Upload failed | Object storage unavailable | Check storage |
| Job stuck queued | Queue/worker issue | Check queue and worker |
| Job stuck allocating | Resource unavailable | Check simulator |
| Agent offline | Lab Agent failure | Check Agent logs |
| No telemetry | Simulator disabled | Check telemetry mode |
| No events | WebSocket failure | Check WS and API |
| Result missing | Result worker failure | Check result logs |
| Port conflict | Host service uses port | Change local port |
| Seed duplicate | Non-idempotent seed | Reset or repair seed |
| Slow stack | Resource pressure | Check Docker resources |

## 77. Troubleshooting: Database

If PostgreSQL is unhealthy:

    docker compose ps postgres
    docker compose logs postgres

Check:

- volume permissions;
- port conflicts;
- credentials;
- database name;
- migration status.

Do not delete the database volume until data-loss implications are understood.

## 78. Troubleshooting: Queue

If Jobs remain QUEUED:

    Check queue health
    Check worker health
    Check worker logs
    Check queue depth
    Check dead-letter messages
    Check database Job state

A queue message is not proof that a Job is running.

## 79. Troubleshooting: Lab Agent

If the Agent is offline:

    Check lab-agent container
    Check simulator container
    Check endpoint configuration
    Check Agent credentials
    Check heartbeat
    Check Control Plane connectivity

After recovery, verify reconciliation.

## 80. Troubleshooting: Artifact Upload

Check:

- API authentication;
- artifact metadata creation;
- object storage availability;
- upload authorization;
- digest;
- object existence;
- validation worker;
- platform compatibility.

The correct debugging sequence is:

    Metadata
       |
    Upload
       |
    Completion
       |
    Validation
       |
    Acceptance

## 81. Troubleshooting: WebSocket

If realtime events are missing:

1. Verify API health.
2. Verify WebSocket endpoint.
3. Verify authentication.
4. Verify subscription.
5. Check event sequence.
6. Check duplicate handling.
7. Reconcile through REST.

REST remains authoritative.

## 82. Troubleshooting: Port Conflicts

If port 8080 is already in use:

    ss -ltnp | grep 8080

Change the host mapping in `.env.local` or Compose configuration.

Do not change internal container ports unnecessarily.

## 83. Resource Requirements

Recommended developer workstation baseline:

| Resource | Recommended |
|---|---:|
| CPU | 8 cores |
| RAM | 16 GB |
| Storage | 50 GB free |
| Docker | Current supported version |
| Git | Current supported version |
| Node/pnpm | Project-defined version |
| Optional Kubernetes | 4+ CPU / 8 GB additional |

A smaller system may run the core stack with reduced observability services.

## 84. Local Resource Profiles

Recommended profiles:

    core
    developer
    demo
    observability
    k8s-local

`core` should start the minimum required application path.

`developer` should include seed data and development conveniences.

`demo` should include a complete simulated execution flow.

`observability` adds metrics/log/tracing infrastructure.

## 85. Local CI Usage

CI should use a deterministic local-style environment for integration tests.

Preferred flow:

    Checkout
       |
    Build Images
       |
    Start Compose
       |
    Migrate
       |
    Seed Test Data
       |
    Run Integration Tests
       |
    Run E2E Tests
       |
    Collect Logs
       |
    Tear Down

CI should not depend on a developer's personal local environment.

## 86. Test Isolation

Automated tests should use isolated data.

Options include:

- dedicated test database;
- transaction rollback;
- disposable Compose stack;
- unique organization IDs.

Tests must not rely on manually modified developer seed data.

## 87. Local Data Retention

Local data is disposable.

No local retention SLA exists.

Developers may remove:

- PostgreSQL volumes;
- object storage volumes;
- queue volumes;
- observability volumes.

The reset process must clearly identify destructive operations.

## 88. Local Configuration Validation

Startup should validate:

- required environment variables;
- database URL;
- object storage endpoint;
- queue endpoint;
- authentication configuration;
- Lab Agent endpoint;
- protocol version;
- artifact configuration.

Invalid configuration should fail fast with actionable error messages.

## 89. Local Version Compatibility

All services should report versions.

Example:

    API version
    Protocol version
    Database schema version
    Lab Agent version
    Simulator version

The Control Plane must reject incompatible protocol versions using the stable
protocol error model.

## 90. Local Protocol Validation

The local environment should exercise:

- request envelope;
- response envelope;
- event envelope;
- error envelope;
- request ID;
- event ID;
- operation ID;
- trace context;
- idempotency key;
- schema validation.

This prevents local development from bypassing protocol discipline.

## 91. Local Idempotency Testing

Developers must be able to submit the same idempotent request twice.

Examples:

- booking creation;
- credit reservation;
- artifact upload completion;
- Job start;
- Job stop.

Expected behavior:

    First Request
         |
    Execute Side Effect
         |
    Persist Result

    Duplicate Request
         |
    Return Same Logical Result
         |
    No Duplicate Side Effect

## 92. Local Security Testing

The local environment should validate:

- unauthorized API request;
- wrong organization access;
- wrong role;
- artifact access violation;
- result access violation;
- invalid Lab Agent identity;
- invalid command;
- expired session;
- invalid signature where enabled.

## 93. Local Production-Parity Rules

The following should remain aligned with production:

- API routes;
- response envelopes;
- error codes;
- domain state machines;
- database migrations;
- object-storage interface;
- queue semantics;
- Job/Run states;
- Lab Agent protocol;
- event names;
- authentication authorization concepts.

The following may differ:

- provider;
- scale;
- credentials;
- domain names;
- cloud networking;
- production identity provider;
- production observability backend.

## 94. Local Deployment Acceptance Flow

The complete acceptance flow is:

    Start Stack
        |
    Health Check
        |
    Migration
        |
    Seed
        |
    Login
        |
    Project Create
        |
    Platform Select
        |
    Artifact Upload
        |
    Artifact Validate
        |
    Credit Quote
        |
    Booking Create
        |
    Job Create
        |
    Job Start
        |
    Lab Allocation
        |
    Deployment
        |
    Run
        |
    Telemetry
        |
    Logs
        |
    Stop / Complete
        |
    Result
        |
    Result Download

## 95. Phase Mapping

| Phase | Local Deployment Objective |
|---|---|
| Phase 0 | Reproducible foundation |
| Phase 1 | Control Plane + DB |
| Phase 2 | Artifact/resource storage |
| Phase 3 | Queue/workers/scheduler |
| Phase 4 | Credits/booking/commercial simulation |
| Phase 5 | Remote execution simulation |
| Phase 6 | Lab Agent simulation |
| Phase 7 | Realtime/telemetry/results |
| Phase 8 | Recovery/security/production-parity tests |

## 96. Phase 0

Local deployment provides:

- Compose foundation;
- environment configuration;
- network;
- service health;
- reproducible startup.

Acceptance:

- [ ] developer can start stack;
- [ ] services have health checks;
- [ ] configuration is externalized.

## 97. Phase 1

Local deployment validates:

- API;
- WebSocket;
- PostgreSQL;
- migrations;
- authentication;
- authorization.

Acceptance:

- [ ] API is reachable;
- [ ] database is authoritative;
- [ ] migration works;
- [ ] local authentication works.

## 98. Phase 2

Local deployment validates:

- platform definitions;
- resource definitions;
- `.krv` artifacts;
- object storage.

Acceptance:

- [ ] artifact upload works;
- [ ] validation works;
- [ ] compatibility works;
- [ ] signed access works.

## 99. Phase 3

Local deployment validates:

- queue;
- worker;
- scheduler;
- reconciliation.

Acceptance:

- [ ] asynchronous Job execution works;
- [ ] duplicate messages are safe;
- [ ] worker restart is recoverable.

## 100. Phase 4

Local deployment validates:

- credit plans;
- platform-specific wallets;
- credit quote;
- reservation;
- consumption;
- refund;
- booking integration.

Acceptance:

- [ ] platform credit mismatch is rejected;
- [ ] insufficient credits are rejected;
- [ ] reservations are idempotent.

## 101. Phase 5

Local deployment validates:

- artifact deployment;
- Job lifecycle;
- Run lifecycle;
- resource allocation.

Acceptance:

- [ ] complete simulated execution works;
- [ ] failures are observable;
- [ ] stop/cancel semantics work.

## 102. Phase 6

Local deployment validates:

- Lab Agent protocol;
- Agent identity;
- heartbeat;
- resource inventory;
- secure command flow;
- reconnect;
- reconciliation.

Acceptance:

- [ ] Agent can disconnect and reconnect;
- [ ] resource state is reconciled;
- [ ] unsafe blind retry is prevented.

## 103. Phase 7

Local deployment validates:

- WebSocket;
- telemetry;
- video interface where simulated;
- logs;
- results;
- result downloads.

Acceptance:

- [ ] realtime updates work;
- [ ] event duplicates are safe;
- [ ] REST reconciliation works;
- [ ] results are available.

## 104. Phase 8

Local deployment validates:

- security;
- recovery;
- backup/restore procedures where locally testable;
- failure injection;
- reconciliation;
- operational runbooks.

Acceptance:

- [ ] failure scenarios are reproducible;
- [ ] recovery behavior is validated;
- [ ] security tests pass;
- [ ] production-parity gaps are documented.

# 105. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Local environment diverges from production | High | Reuse production containers/interfaces |
| Compose hides orchestration issues | Medium | Kubernetes-local validation |
| Developer machine resource limits | Medium | Profiles |
| Seed data drift | Medium | Version-controlled deterministic seeds |
| Local secrets leak | High | `.env.local` ignored |
| Simulator masks hardware failures | High | Separate physical-lab acceptance |
| Queue behavior differs | High | Contract/integration tests |
| Storage behavior differs | Medium | S3-compatible interface tests |
| WebSocket reconnect untested | Medium | Failure injection |
| Local DB corruption | Low | Disposable reset |
| Port conflicts | Low | Configurable host mappings |
| Observability overload | Medium | Optional profile |
| False production confidence | High | Explicit non-goals |

# 106. Open Questions

1. Exact PostgreSQL version supported by the backend.
2. Exact local object storage implementation.
3. Exact local queue implementation.
4. Exact local observability implementation.
5. Whether Web Console is included in the initial repository.
6. Exact local authentication provider.
7. Exact `.krv` signing behavior in local mode.
8. Exact Kubernetes distribution for developer validation.
9. Whether video simulation is required in the first local milestone.
10. Final simulator telemetry rates.
11. Final local resource profiles.
12. Whether local CI should use Compose exclusively or also Kubernetes.
13. Exact Makefile/task-runner command names.
14. Final API port if 8080 conflicts with another development standard.
15. Whether local artifact signing uses a deterministic development key.

These questions may be resolved during implementation without changing the
overall architecture.

# 107. Full Acceptance Criteria Checklist

## Installation

- [ ] Repository can be cloned.
- [ ] Required developer prerequisites are documented.
- [ ] `.env.example` exists.
- [ ] `.env.local` is ignored.
- [ ] Compose configuration validates.
- [ ] Local Kubernetes manifests validate where implemented.

## Startup

- [ ] Core stack starts with one documented command.
- [ ] PostgreSQL becomes healthy.
- [ ] Object storage becomes healthy.
- [ ] Queue becomes healthy.
- [ ] API becomes healthy.
- [ ] Worker becomes healthy.
- [ ] Scheduler becomes healthy.
- [ ] Reconciler becomes healthy.
- [ ] Lab Agent becomes healthy.
- [ ] Simulator becomes healthy.

## Database

- [ ] Database is persistent.
- [ ] Database migrations are version-controlled.
- [ ] Migrations execute successfully.
- [ ] Schema version is visible.
- [ ] Database reset is documented.
- [ ] Database is not required to be public.

## Seed Data

- [ ] Seed command exists.
- [ ] Seed is deterministic.
- [ ] Seed is idempotent.
- [ ] Developer profile exists.
- [ ] Demo profile exists.
- [ ] Seed contains platform data.
- [ ] Seed contains resource data.
- [ ] Seed contains credit data.
- [ ] Seed contains lab data.

## API

- [ ] REST API is reachable.
- [ ] `/health` works.
- [ ] `/ready` works.
- [ ] `/version` works.
- [ ] API version is reported.
- [ ] Authentication works.
- [ ] Authorization works.
- [ ] Tenant isolation works.
- [ ] Stable error codes are returned.

## WebSocket

- [ ] WebSocket connection works.
- [ ] Authentication is enforced.
- [ ] Subscriptions work.
- [ ] Events contain IDs.
- [ ] Events contain correlation data.
- [ ] Duplicate events are tolerated.
- [ ] Reconnect works.
- [ ] REST reconciliation works.

## Artifact

- [ ] Local `.krv` artifact exists.
- [ ] Artifact upload works.
- [ ] Object storage receives artifact.
- [ ] Digest is calculated.
- [ ] Manifest is validated.
- [ ] Platform compatibility is checked.
- [ ] Artifact acceptance state is persisted.
- [ ] Artifact download is authorized.

## Booking

- [ ] Availability query works.
- [ ] Quote works.
- [ ] Booking creation works.
- [ ] Booking conflict works.
- [ ] Booking cancellation works.
- [ ] Booking state transitions are enforced.

## Credits

- [ ] Platform-specific wallet exists.
- [ ] Credit quote works.
- [ ] Reservation works.
- [ ] Duplicate reservation is safe.
- [ ] Consumption works.
- [ ] Release works.
- [ ] Refund works.
- [ ] Insufficient credits are rejected.

## Jobs and Runs

- [ ] Job can be created.
- [ ] Job enters QUEUED.
- [ ] Validation occurs.
- [ ] Resource allocation occurs.
- [ ] Deployment occurs.
- [ ] Run starts.
- [ ] Run produces telemetry.
- [ ] Run produces logs.
- [ ] Run stops.
- [ ] Result is generated.
- [ ] Job reaches terminal state.

## Lab Agent

- [ ] Agent registers.
- [ ] Agent authenticates.
- [ ] Heartbeat works.
- [ ] Capabilities are reported.
- [ ] Resources are reported.
- [ ] Artifact fetch works.
- [ ] Deployment works.
- [ ] Start works.
- [ ] Stop works.
- [ ] Cancel works.
- [ ] Agent reconnect works.
- [ ] Reconciliation works.

## Simulator

- [ ] Resource states are modeled.
- [ ] Successful execution works.
- [ ] Runtime failure works.
- [ ] Start failure works.
- [ ] Stop timeout works.
- [ ] Resource unavailable works.
- [ ] Telemetry is generated.
- [ ] Logs are generated.
- [ ] Results are generated.

## Storage

- [ ] PostgreSQL is authoritative.
- [ ] Object storage is used for large files.
- [ ] Object access is private by default.
- [ ] Signed access works.
- [ ] Object/database metadata remains consistent.
- [ ] Local reset can remove storage safely.

## Queue and Workers

- [ ] Queue is reachable.
- [ ] Queue messages are durable according to local implementation.
- [ ] Worker consumes messages.
- [ ] Retry behavior works.
- [ ] Duplicate messages are safe.
- [ ] Dead-letter behavior works where supported.
- [ ] Worker restart is recoverable.

## Observability

- [ ] Structured logs exist.
- [ ] Request IDs exist.
- [ ] Trace IDs exist where enabled.
- [ ] Job IDs are logged.
- [ ] Run IDs are logged.
- [ ] Agent IDs are logged.
- [ ] Resource IDs are logged.
- [ ] Basic dashboards exist where enabled.

## Security

- [ ] Local secrets are not committed.
- [ ] Authentication is enforced.
- [ ] Authorization is enforced.
- [ ] Tenant isolation is enforced.
- [ ] Artifact authorization is enforced.
- [ ] Result authorization is enforced.
- [ ] Lab commands are authorized.
- [ ] No arbitrary remote shell is available.

## Recovery

- [ ] API restart is safe.
- [ ] Worker restart is safe.
- [ ] Scheduler restart is safe.
- [ ] Reconciler restart is safe.
- [ ] Lab Agent restart is safe.
- [ ] Queue redelivery is safe.
- [ ] WebSocket reconnect is safe.
- [ ] Job/Run reconciliation works.

## Developer Experience

- [ ] One documented startup path exists.
- [ ] One documented shutdown path exists.
- [ ] One documented reset path exists.
- [ ] Logs are easy to access.
- [ ] Service status is easy to inspect.
- [ ] Port configuration is documented.
- [ ] Troubleshooting guide is usable.
- [ ] Local CI workflow is reproducible.

# 108. Final Local Deployment Invariants

The following invariants are mandatory:

1. Local deployment is reproducible.
2. Docker Compose is the canonical developer runtime.
3. Kubernetes-local is a secondary validation environment.
4. The Control Plane remains a production-oriented modular monolith.
5. PostgreSQL remains authoritative.
6. Object storage remains authoritative for large binaries.
7. Queue remains asynchronous transport.
8. REST remains durable state authority.
9. WebSocket remains realtime transport.
10. Jobs and Runs remain separate.
11. Booking and resource allocation remain separate.
12. Credits remain platform-specific.
13. Artifact source code remains local to the developer.
14. `.krv` is the execution boundary.
15. Lab Agent remains the cloud/lab boundary.
16. Simulator does not replace physical safety validation.
17. Local authentication may be simplified but authorization may not be removed.
18. Seed data is deterministic and idempotent.
19. Configuration is externalized.
20. Production credentials are never required.
21. Internal service communication uses service discovery.
22. Application containers remain stateless.
23. Local failures are observable.
24. Reconciliation is exercised locally.
25. Production protocol contracts are exercised locally.
26. Local success is not equivalent to physical robot acceptance.
27. Physical safety remains a separate human-reviewed gate.

# 109. Final Developer Path

The intended developer experience is:

    git clone
         |
         v
    Configure .env.local
         |
         v
    Start Compose
         |
         v
    Migrate + Seed
         |
         v
    Open Studio / Web Console
         |
         v
    Create Project
         |
         v
    Build Locally
         |
         v
    Package .krv
         |
         v
    Upload Artifact
         |
         v
    Book Simulated Robot
         |
         v
    Start Job
         |
         v
    Observe Run
         |
         +---- Video / Telemetry
         +---- Logs
         +---- Events
         |
         v
    Complete / Stop
         |
         v
    Inspect Results
         |
         v
    Modify Source
         |
         v
    Repeat

The local deployment therefore provides the complete software-only RaaS
development loop while preserving the same architectural boundaries intended
for Development, Staging and Production.

The governing principle is:

> **A developer should be able to run the complete RaaS software path locally,
> without a cloud account or physical robot, and exercise the same contracts,
> state machines, asynchronous workflows, Lab Agent boundary and recovery
> behavior that will operate the real RaaS platform.**
