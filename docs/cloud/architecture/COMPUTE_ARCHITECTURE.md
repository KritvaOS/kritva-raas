# Kritva RaaS Compute Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Compute Architecture |
| Path | `docs/cloud/architecture/COMPUTE_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Workload | RaaS Control Plane |
| Application Model | Production-oriented modular monolith |
| Deployment Unit | Immutable container image |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Async | Durable Queue + Workers |
| Scheduler | Dedicated logical workload |
| Database | PostgreSQL |
| Lab Boundary | Lab Agent |
| CI/CD | External or managed runners |
| Environment Model | Local, Development, Staging, Production |
| Initial Region | Single primary region |
| Production HA | Multi-zone where supported |
| Physical Safety | Local to robot/lab |

## 2. Purpose

This document defines the production-grade compute architecture for Kritva
RaaS.

The compute architecture provides the execution environment for:

- Control Plane API;
- WebSocket connections;
- asynchronous workers;
- scheduler;
- reconciliation workers;
- artifact processing;
- result processing;
- notification processing;
- administrative workloads;
- CI/CD workloads;
- operational jobs.

The architecture is designed to support the progression from development to a
production RaaS deployment without replacing the initial modular monolith with
premature microservices.

The core principle is:

> **Scale compute independently by workload while preserving one authoritative
> Control Plane architecture.**

## 3. Scope

This document covers:

- container platform;
- Control Plane compute;
- API instances;
- WebSocket-capable instances;
- workers;
- scheduler;
- reconciliation;
- autoscaling;
- resource isolation;
- CI/CD runners;
- administrative workloads;
- health management;
- graceful shutdown;
- compute security;
- compute observability;
- deployment;
- capacity planning;
- cost controls;
- production resilience.

## 4. Non-Goals

This document does not define:

- final cloud provider;
- final Kubernetes distribution;
- complete VPC architecture;
- database architecture;
- complete application service design;
- physical robot compute;
- Kritva Runtime architecture;
- CI/CD vendor selection;
- final autoscaling thresholds.

Those decisions belong to the relevant architecture and deployment documents.

## 5. Compute Principles

The compute architecture follows these principles:

1. Containers are the primary backend deployment unit.
2. Control Plane remains a modular monolith initially.
3. API instances are stateless.
4. Workers are independently scalable.
5. Scheduler execution is controlled and duplicate-safe.
6. Reconciliation is a first-class workload.
7. Compute is distributed across availability zones where practical.
8. Workload resource limits are explicit.
9. Production workloads are isolated by role.
10. CI/CD runners are isolated from production runtime.
11. Administrative jobs do not share unrestricted production privileges.
12. Secrets are injected at runtime.
13. Images are immutable.
14. Deployments use health checks.
15. Graceful shutdown is mandatory.
16. Autoscaling must not overload PostgreSQL.
17. Physical robot safety is never delegated to cloud compute.

## 6. Logical Compute Topology

The target compute topology is:

    Internet
       |
       v
    Edge / API Gateway
       |
       v
    Load Balancer
       |
       v
    +---------------------------+
    | Control Plane API         |
    | API-1 API-2 API-N         |
    +-------------+-------------+
                  |
          +-------+-------+
          |               |
          v               v
      PostgreSQL       Queue
                          |
          +---------------+----------------+
          |               |                |
          v               v                v
       Workers         Scheduler      Reconciliation
          |
          +--> Object Storage
          +--> Lab Connectivity
          +--> Notifications
          +--> Results

    Separate:
    CI/CD Runners
    Administrative Jobs
    Operational Jobs

## 7. Container Platform

The backend should run on a managed or orchestrated container platform.

The exact platform is intentionally provider-neutral.

Candidate implementations may include:

- managed Kubernetes;
- managed container orchestration;
- equivalent managed container compute.

The architecture depends on the capabilities, not the vendor.

## 8. Container Runtime

Every production backend workload should execute from an immutable container
image.

The image contains:

- application runtime;
- backend executable;
- required libraries;
- required configuration templates;
- migration tooling where appropriate.

The image must not contain:

- production secrets;
- private signing keys;
- developer credentials;
- environment-specific passwords.

## 9. Image Identity

Production deployments must identify images by digest:

    registry.example/kritva-raas-backend@sha256:<digest>

Human-readable tags such as:

    kritva-raas-backend:1.4.0

may be used for navigation, but the digest is the deployment identity.

## 10. Container Security

Production containers should:

- run as non-root;
- use a minimal base image;
- have a read-only filesystem where practical;
- drop unnecessary Linux capabilities;
- use seccomp or equivalent restrictions;
- avoid privileged mode;
- avoid host networking;
- avoid host filesystem mounts.

Exceptions require explicit review.

## 11. Workload Classes

Compute workloads are divided into:

| Workload | Purpose |
|---|---|
| API | REST and control operations |
| WebSocket | Realtime client connections |
| Worker | Async application processing |
| Scheduler | Resource/job scheduling |
| Reconciliation | Recovery and state repair |
| Migration | Database schema evolution |
| Administrative | Controlled operator actions |
| CI/CD | Build/test/deploy automation |
| Operations | Backup/restore/maintenance |

These may initially run on one container platform while using separate workload
definitions and resource policies.

## 12. Control Plane

The Control Plane is a modular monolith.

Logical modules include:

    Identity
    Organizations
    Projects
    Platforms
    Artifacts
    Booking
    Credits
    Jobs
    Runs
    Results
    Lab
    Audit
    Notification

These modules are logically separated but initially share the Control Plane
deployment boundary.

## 13. API Compute

The API workload handles:

- REST API;
- authentication context;
- authorization;
- request validation;
- application service invocation;
- durable state operations;
- asynchronous command submission.

The API must not execute long-running work synchronously.

## 14. API Statelessness

API instances must not rely on local process memory for durable state.

State belongs in:

- PostgreSQL;
- object storage;
- durable queue;
- authorized cache if introduced.

This permits:

    Load Balancer
       |
    +--+--+--+
    |  |  |  |
    v  v  v  v
   API API API API

## 15. WebSocket Compute

WebSocket connections may be served by the same application deployment initially.

The architecture must support:

- authenticated connections;
- resource subscriptions;
- event delivery;
- reconnect;
- replay where available;
- REST reconciliation.

WebSocket capacity may later be scaled independently.

## 16. WebSocket State

WebSocket connection state is transient.

Durable state remains in PostgreSQL.

If an API instance disappears:

    WebSocket Disconnect
           |
           v
       Reconnect
           |
           v
    REST Reconciliation
           |
           v
    Event Replay / Resume

## 17. Worker Compute

Workers execute asynchronous operations.

Examples:

- artifact validation;
- artifact cleanup;
- booking processing;
- Job processing;
- Run supervision;
- result processing;
- notification delivery;
- reconciliation;
- backfill;
- usage aggregation.

Workers consume durable queue messages.

## 18. Worker Statelessness

Workers must not depend on local durable storage.

A worker may use local temporary storage for:

- temporary artifact validation;
- temporary result processing;
- compression;
- conversion.

Temporary storage must be disposable.

## 19. Worker Idempotency

Queue delivery is at-least-once.

Therefore:

    Message
       |
       +--> Worker A
       |
       +--> Duplicate Worker A

must not produce unsafe duplicate business effects.

Workers use:

- idempotency records;
- domain state checks;
- transaction boundaries;
- explicit operation IDs.

## 20. Worker Classes

Workers should be logically separated by workload characteristics.

Suggested classes:

    artifact-worker
    job-worker
    result-worker
    notification-worker
    reconciliation-worker

The initial implementation may combine some classes.

Independent scaling should be possible without redesigning the domain.

## 21. Scheduler

The Scheduler determines eligible execution opportunities.

It considers:

- confirmed booking;
- platform compatibility;
- resource availability;
- resource capabilities;
- maintenance;
- credit authorization;
- Job state;
- priority policy.

The Scheduler does not own:

- booking authority;
- credit authority;
- physical resource authority.

## 22. Scheduler Concurrency

Only one scheduler action may successfully allocate a resource for a conflicting
operation.

The architecture may use:

- database locking;
- leader election;
- partitioned scheduling;
- transactional state transitions.

The final mechanism remains an implementation decision.

## 23. Scheduler Failure

If the scheduler stops:

- durable Jobs remain;
- bookings remain;
- credits remain;
- resources remain authoritative;
- scheduling resumes after recovery.

Scheduler process failure must not corrupt business state.

## 24. Reconciliation Compute

Reconciliation workers detect inconsistent or uncertain state.

Examples:

- Job stuck in transitional state;
- Run with missing heartbeat;
- resource allocation without active Run;
- Lab Agent state mismatch;
- object storage orphan;
- credit projection mismatch;
- outbox event not published.

Reconciliation is a normal production workload, not an emergency-only mechanism.

## 25. Reconciliation Flow

    Durable State
         |
         v
    Reconciliation Worker
         |
         +--> Job State
         +--> Run State
         +--> Resource State
         +--> Lab Agent State
         +--> Credit State
         +--> Object Storage
         |
         v
    Correct / Escalate

## 26. Compute Isolation

Production workloads should be isolated using:

- namespaces or equivalent;
- workload identities;
- security policies;
- network policies;
- resource quotas;
- CPU limits;
- memory limits;
- separate service accounts.

The exact mechanism is platform-specific.

## 27. API Resource Policy

API instances require:

- CPU request;
- CPU limit;
- memory request;
- memory limit;
- replica minimum;
- replica maximum.

These values are tuned through production measurements.

## 28. Worker Resource Policy

Workers require workload-specific resources.

Artifact validation may be CPU-intensive.

Result processing may require:

- CPU;
- memory;
- temporary storage.

Therefore one generic worker pool should not be assumed to be optimal.

## 29. Scheduler Resource Policy

Scheduler workloads should be:

- small;
- highly available;
- tightly controlled;
- protected from worker starvation.

Scheduler availability is more important than raw CPU capacity.

## 30. Reconciliation Resource Policy

Reconciliation must have reserved capacity.

A production incident must not prevent reconciliation because all compute is
consumed by normal workloads.

## 31. Resource Quotas

Environment-level quotas should control:

- CPU;
- memory;
- number of workloads;
- temporary storage;
- network resources where supported.

This prevents runaway workloads from exhausting the environment.

## 32. Priority Classes

Where supported, workload priorities may be:

    Critical:
        API
        Scheduler
        Safety-related control paths

    High:
        Job workers
        Reconciliation

    Normal:
        Artifact processing
        Results

    Low:
        Cleanup
        Backfill
        Non-critical notifications

Physical safety remains outside cloud priority scheduling.

## 33. Autoscaling

Autoscaling should be workload-specific.

API scaling may use:

- CPU;
- memory;
- request rate;
- latency;
- concurrency.

Worker scaling should use:

- queue depth;
- message age;
- processing rate.

## 34. API Autoscaling

Example conceptual policy:

    Low Traffic
        |
        v
    Minimum API Instances

    Increased Load
        |
        v
    Add API Instances

    Reduced Load
        |
        v
    Scale Down

The exact thresholds are determined from measurements.

## 35. Worker Autoscaling

Worker scaling should consider queue age, not only CPU.

Example:

    Queue Depth
        |
        v
    Autoscaler
        |
        +--> Worker Count
        |
        v
    Queue Drain Rate

A small queue with expensive work may require CPU-aware scaling.

## 36. Scheduler Scaling

Scheduler scaling should be conservative.

A scheduler must not simply scale horizontally and create duplicate allocation
decisions.

Use controlled concurrency and transactional coordination.

## 37. Reconciliation Scaling

Reconciliation should be bounded.

It must avoid:

- repeated full-database scans;
- duplicate repairs;
- retry storms.

Use:

- incremental scans;
- checkpoints;
- backoff;
- partitioning where justified.

## 38. Autoscaling Safety

Autoscaling must not exceed:

- database connection capacity;
- queue service limits;
- external API rate limits;
- object storage constraints;
- cloud budget limits.

## 39. Database Connection Scaling

The key constraint is:

    API Replicas
      ×
    Connections Per Replica
      +
    Worker Replicas
      ×
    Connections Per Worker
      <
    Safe PostgreSQL Capacity

Connection pools must therefore be bounded.

## 40. Queue Scaling

Queue consumers should scale based on:

- message age;
- queue depth;
- processing duration;
- retry rate.

The queue must not become an uncontrolled source of compute expansion.

## 41. Cost-Aware Autoscaling

Autoscaling should have:

- minimum replicas;
- maximum replicas;
- cooldown;
- scale-up policy;
- scale-down policy.

Production must have explicit maximum capacity.

## 42. Availability Zones

Production compute should span multiple availability zones where supported.

Example:

    Region
      |
      +-------------------------+
      |            |            |
      v            v            v
     AZ-A         AZ-B         AZ-C
      |            |            |
     API          API          API
     Worker       Worker       Worker

The exact number depends on cloud provider and cost requirements.

## 43. Zone Failure

If one availability zone fails:

- remaining API instances serve traffic;
- workers continue processing;
- scheduler remains available;
- database uses managed failover where supported.

The deployment platform must avoid placing all replicas in one zone.

## 44. Pod/Instance Distribution

The compute platform should support:

- anti-affinity;
- topology spreading;
- zone-aware scheduling.

Critical workloads should not be concentrated in one failure domain.

## 45. Rolling Deployment

Production deployment should support rolling replacement.

Conceptually:

    Old
    Old
    Old

       |
       v

    Old
    New
    Old

       |
       v

    New
    New
    Old

       |
       v

    New
    New
    New

Health checks must prevent unhealthy instances from receiving traffic.

## 46. Canary Deployment

For material changes:

    Production
       |
       +--> Stable
       |
       +--> Canary
               |
               v
             Observe
               |
         +-----+-----+
         |           |
         v           v
       Abort      Promote

Canary deployment should use the same immutable image promoted from staging.

## 47. Graceful Shutdown

Every backend workload must handle termination signals.

Shutdown sequence:

    Termination Signal
          |
          v
    Stop New Work
          |
          v
    Drain Active Requests
          |
          v
    Commit Safe State
          |
          v
    Close Connections
          |
          v
    Exit

## 48. API Shutdown

API shutdown must:

- stop accepting new requests;
- allow active requests to complete within a bounded grace period;
- close database connections;
- close WebSocket sessions gracefully where practical.

## 49. Worker Shutdown

Worker shutdown must:

- stop receiving new work;
- finish safe in-progress work where possible;
- preserve idempotency state;
- release temporary resources;
- acknowledge only successfully completed messages.

## 50. Scheduler Shutdown

Scheduler shutdown must:

- stop creating new allocations;
- complete or safely terminate current scheduling transactions;
- preserve durable state.

It must not create partially committed allocations.

## 51. Health Management

Compute health has three layers:

    Process Health
        |
        v
    Container Health
        |
        v
    Application Readiness

A process being alive does not imply it should receive traffic.

## 52. Liveness

Liveness checks should be lightweight.

They answer:

> Is the process capable of continuing execution?

They should not perform expensive database operations.

## 53. Readiness

Readiness may verify critical dependencies such as:

- database availability;
- required configuration;
- queue connectivity where required.

Readiness must remain fast.

## 54. Startup Checks

Startup validation should detect:

- invalid configuration;
- missing required secret;
- incompatible database schema;
- unsupported protocol version;
- invalid runtime configuration.

A workload should fail fast on invalid mandatory configuration.

## 55. Dependency Failure

If a non-critical dependency fails:

- application should degrade appropriately;
- readiness behavior must be deliberate;
- retries must be bounded.

If PostgreSQL is unavailable, an API instance should not blindly accept requests
that require durable state.

## 56. Resource Exhaustion

Compute monitoring must detect:

- CPU saturation;
- memory pressure;
- disk exhaustion;
- file descriptor exhaustion;
- connection exhaustion;
- thread/task exhaustion.

## 57. Out-of-Memory

Memory limits should be explicit.

An OOM event must generate:

- alert;
- workload restart where appropriate;
- diagnostic evidence;
- capacity review.

Repeated OOM events must not be hidden by automatic restart.

## 58. CPU Saturation

Sustained CPU saturation should trigger:

- autoscaling;
- capacity review;
- workload optimization.

CPU throttling should be monitored.

## 59. Temporary Storage

Workers processing artifacts/results may require temporary storage.

Temporary storage must have:

- quota;
- cleanup;
- monitoring;
- bounded maximum size.

Temporary storage must never become an unbounded artifact repository.

## 60. Network Resource Isolation

Compute workloads should use the network policies defined by the Network
Architecture.

API workloads should not automatically have access to:

- production management endpoints;
- unrelated labs;
- arbitrary external services.

## 61. Workload Identity

Each workload class should have an appropriate identity.

Examples:

    api-service-account
    worker-service-account
    scheduler-service-account
    reconciliation-service-account
    admin-job-service-account

Permissions should be minimal.

## 62. Secret Access

Only workloads that require a secret should receive access.

Example:

    API
      |
      +--> Database Credential

    Worker
      |
      +--> Storage Credential

    Scheduler
      |
      +--> Scheduling Dependencies

The scheduler should not receive unrelated secrets.

## 63. Container Privileges

Production workloads should not:

- run privileged;
- mount host filesystem;
- access host PID namespace;
- access host network;
- access container runtime socket.

These are high-risk exceptions.

## 64. Network Policies

Network policy should restrict workload communication.

Example:

    API -> DB       ALLOW
    API -> Queue    ALLOW
    API -> Storage  ALLOW

    Worker -> DB    ALLOW
    Worker -> Queue ALLOW
    Worker -> Lab   ALLOW

    API -> CI       DENY
    Worker -> CI    DENY
    CI -> Production Runtime DENY

## 65. CI/CD Compute

CI/CD runners are separate from production compute.

CI workloads perform:

- source checkout;
- dependency installation;
- build;
- test;
- image build;
- security scanning;
- artifact publishing;
- deployment automation.

## 66. CI/CD Runner Isolation

CI runners must not share unrestricted credentials with runtime workloads.

Preferred:

    CI Runner
       |
       +--> Source Repository
       +--> Container Registry
       +--> Test Infrastructure
       |
       +--> Controlled Deployment API

Production deployment credentials should be short-lived and scoped.

## 67. Ephemeral CI Runners

Ephemeral runners are preferred for production release pipelines.

Flow:

    Job Starts
       |
       v
    Create Runner
       |
       v
    Execute Pipeline
       |
       v
    Destroy Runner

This reduces persistent credential and workspace risk.

## 68. CI Runner Network

CI runners should have access only to:

- source repository;
- dependency repositories;
- package registries;
- container registry;
- test services;
- approved cloud deployment interfaces.

They should not have unrestricted access to production database or robot networks.

## 69. CI Secrets

CI secrets must be:

- short-lived where possible;
- scoped;
- audited;
- environment-specific.

Production deployment should use workload identity or equivalent rather than
long-lived static credentials.

## 70. Administrative Workloads

Administrative workloads include:

- data correction;
- controlled backfill;
- maintenance;
- migration support;
- operational reconciliation;
- report generation.

They must be explicitly invoked and audited.

## 71. Admin Workload Isolation

Administrative jobs should run as separate workloads.

They should not require shell access to API containers.

Conceptually:

    Admin Request
        |
        v
    Authorized Operation
        |
        v
    Admin Job
        |
        v
    Controlled Application Service

## 72. Admin Authorization

Administrative operations require:

- elevated role;
- explicit authorization;
- reason;
- actor identity;
- audit record;
- idempotency where applicable.

## 73. Production Shell Access

Direct shell access to production containers should be exceptional.

Business operations should be exposed through controlled administrative tools.

This reduces the risk of bypassing domain invariants.

## 74. Migration Workloads

Database migrations should be executed by a dedicated deployment step or
controlled migration workload.

Migration execution must:

- verify schema version;
- apply versioned migration;
- record success;
- stop deployment on failure.

## 75. Backup Workloads

Backup operations should not compete with API compute unnecessarily.

Where managed database backups are available, prefer provider-managed backup
capabilities.

Application-level export jobs should be separately isolated.

## 76. Operational Jobs

Operational jobs may include:

- cleanup;
- archival;
- retention enforcement;
- reconciliation;
- data integrity checks.

They should be low priority unless they protect critical correctness.

## 77. Job Execution Compute Boundary

The backend Job Service is responsible for execution orchestration.

It does not execute arbitrary robot commands directly.

The flow is:

    Job
      |
      v
    Execution Service
      |
      v
    Lab Agent
      |
      v
    Kritva Runtime
      |
      v
    Robot

## 78. Lab Agent Is Not Cloud Compute

The Lab Agent is physically deployed near the robot.

It has separate:

- compute;
- identity;
- lifecycle;
- security boundary.

Cloud compute controls the Lab Agent through the Lab Protocol.

## 79. No Arbitrary Remote Shell

Cloud compute must not provide arbitrary shell access to:

- Lab Agent;
- robot;
- robot host.

Only explicit Lab Protocol commands are permitted.

## 80. Result Processing Compute

Result workers process:

- result metadata;
- uploaded files;
- checksums;
- derived metrics;
- summaries;
- experiment associations.

Large result processing should use object storage rather than large in-memory
payloads.

## 81. Artifact Validation Compute

Artifact validation workers verify:

- package structure;
- manifest;
- checksum;
- signature;
- compatibility;
- policy.

Validation should be isolated from API processes because artifact processing
may be resource-intensive.

## 82. Artifact Processing Limits

Artifact workers must enforce:

- maximum artifact size;
- decompression limits;
- file-count limits;
- CPU limits;
- memory limits;
- temporary storage limits;
- execution timeouts.

An uploaded artifact must never be treated as trusted executable code by the
Control Plane.

## 83. Untrusted Artifact Boundary

Artifact validation should treat input as untrusted.

Validation must not:

- execute arbitrary artifact code;
- invoke arbitrary shell commands;
- access host resources;
- access production credentials.

## 84. Worker Security

Workers processing user-controlled artifacts should have particularly strong
isolation.

Where practical:

- separate worker pool;
- restricted network;
- no production secrets;
- temporary filesystem;
- low privileges.

## 85. Queue Worker Failure

If a worker crashes:

    Message
       |
       v
    Worker Crash
       |
       v
    Message Retry
       |
       v
    Idempotent Worker
       |
       v
    Completion

Repeated failures should move to dead-letter handling.

## 86. Dead-Letter Workloads

Dead-letter processing must be isolated.

Operators should be able to:

- inspect;
- diagnose;
- retry;
- discard where safe.

Retrying a dead-letter message must preserve idempotency.

## 87. Autoscaling and Backpressure

Autoscaling is not sufficient by itself.

The system must implement backpressure through:

- queue limits;
- rate limits;
- concurrency limits;
- resource quotas;
- booking constraints.

## 88. API Backpressure

When dependencies are overloaded:

- return controlled errors;
- avoid unlimited retries;
- use `503 SERVICE_UNAVAILABLE` where appropriate;
- preserve durable state.

## 89. Worker Backpressure

Workers should not pull more work than they can safely process.

Concurrency must be bounded.

## 90. Scheduler Backpressure

Scheduler must not allocate more work than:

- resources;
- booking capacity;
- credit authorization;
- lab capacity

allow.

## 91. Compute Cost Model

Compute costs include:

- API instances;
- workers;
- scheduler;
- reconciliation;
- CI runners;
- administrative jobs;
- network transfer;
- persistent compute where applicable.

## 92. Cost Optimization

Prefer:

- horizontal scaling;
- autoscaling;
- right-sized containers;
- ephemeral CI;
- scheduled non-production shutdown;
- low-priority cleanup workloads;
- workload-specific worker pools.

## 93. Production Cost Protection

Production must have:

- maximum replicas;
- resource quotas;
- budget alerts;
- autoscaling limits;
- anomaly detection.

Autoscaling must never be allowed to create uncontrolled spend.

## 94. Compute Capacity Planning

Capacity planning should model:

- concurrent users;
- API requests;
- WebSocket connections;
- artifact uploads;
- Jobs;
- Runs;
- worker throughput;
- Lab Agents;
- result processing;
- CI workload.

## 95. Initial Capacity Model

Initial production should be sized for:

- multiple API instances;
- multiple worker instances;
- redundant scheduler capacity;
- reconciliation capacity;
- multi-zone deployment.

Exact instance sizes remain environment-specific.

## 96. Scaling Order

Preferred scaling progression:

    Optimize Application
         |
         v
    Right-size Compute
         |
         v
    Horizontal API/Worker Scaling
         |
         v
    Specialized Worker Pools
         |
         v
    Data Scaling
         |
         v
    Service Extraction

Microservice decomposition is not the default response to load.

## 97. Service Extraction

A logical module may become independently deployed only when justified by:

- independent scaling;
- fault isolation;
- deployment cadence;
- security boundary;
- operational ownership.

The initial Control Plane remains a modular monolith.

## 98. Environment Compute Model

| Environment | Compute Model |
|---|---|
| Local | Containers/processes |
| Development | Small container deployment |
| Staging | Production-like container platform |
| Production | Multi-zone container platform |

## 99. Development Compute

Development should support:

- API;
- workers;
- scheduler;
- database;
- queue;
- object storage;
- mock Lab Agent.

It should prioritize low cost and fast iteration.

## 100. Staging Compute

Staging should validate:

- image deployment;
- scaling;
- migrations;
- queue processing;
- health checks;
- graceful shutdown;
- canary;
- rollback.

## 101. Production Compute

Production requires:

- multi-zone placement where practical;
- autoscaling;
- resource quotas;
- security policies;
- immutable images;
- observability;
- graceful deployment;
- recovery.

## 102. Compute Observability

Monitor each workload for:

- availability;
- CPU;
- memory;
- restarts;
- latency;
- request rate;
- queue depth;
- processing duration;
- error rate;
- resource throttling.

## 103. Application Metrics

Important metrics:

    HTTP Requests
    HTTP Errors
    HTTP Latency
    Active WebSockets
    Job Throughput
    Worker Processing Time
    Queue Age
    Scheduler Decisions
    Reconciliation Repairs

## 104. Container Metrics

Monitor:

- CPU usage;
- CPU throttling;
- memory usage;
- memory limits;
- restart count;
- filesystem usage;
- network usage.

## 105. Workload Alerts

Alert on:

- API unavailable;
- excessive restarts;
- high error rate;
- high latency;
- queue backlog;
- worker failure;
- scheduler unavailable;
- reconciliation backlog;
- memory exhaustion.

## 106. Distributed Tracing

Trace context should flow:

    API
      |
      v
    Application Service
      |
      v
    Queue
      |
      v
    Worker
      |
      v
    Lab Agent

This enables diagnosis of end-to-end Job latency.

## 107. Compute Security Monitoring

Monitor for:

- privileged containers;
- unexpected image changes;
- unusual outbound traffic;
- excessive restart loops;
- unauthorized service-account usage;
- suspicious administrative jobs.

## 108. Image Supply Chain

Production images should be protected through:

- trusted build pipeline;
- dependency scanning;
- image scanning;
- provenance;
- SBOM;
- registry access control;
- immutable digest deployment.

## 109. Image Promotion

The same image should move through:

    Build
      |
      v
    Test
      |
      v
    Registry
      |
      v
    Staging
      |
      v
    Production

No production-specific rebuild should occur.

## 110. Deployment Health

Deployment is successful only when:

- new instances become ready;
- old instances drain;
- error rate remains normal;
- worker queues remain healthy;
- scheduler remains available;
- critical workflows pass.

## 111. Rollback

Rollback should use the previous immutable image where compatible.

The compute platform should support:

    New Version
       |
       X
    Failure
       |
       v
    Previous Image
       |
       v
    Verify

Database compatibility must be evaluated separately.

## 112. Compute Recovery

If all API instances fail:

    New Instances
         |
         v
    Read Durable State
         |
         v
    Resume API

If workers fail:

    Queue Retains Work
         |
         v
    New Workers
         |
         v
    Resume Processing

## 113. Control Plane Restart

Restarting the Control Plane must not imply:

- Job cancellation;
- Run termination;
- resource release;
- credit refund.

Those state transitions require explicit domain logic or reconciliation.

## 114. Lab Connectivity During Compute Failure

If Control Plane compute fails:

- Lab Agent may remain connected or reconnect later;
- local execution follows local policy;
- cloud state remains durable;
- reconciliation occurs after recovery.

## 115. Availability Targets

Production compute targets should be defined for:

- API;
- workers;
- scheduler;
- reconciliation;
- WebSocket.

Exact SLA values remain a business decision.

## 116. Maintenance

Maintenance should support:

- rolling updates;
- graceful drain;
- minimal service interruption;
- database compatibility;
- queue preservation.

Planned maintenance should identify active Jobs/Runs.

## 117. Compute Governance

Every production workload should have:

- owner;
- purpose;
- image;
- resource limits;
- network policy;
- identity;
- scaling policy;
- health checks;
- logging;
- alerting.

## 118. Compute Interface Table

| Interface | Purpose |
|---|---|
| Container Image | Deployment artifact |
| HTTP | API transport |
| WebSocket | Realtime transport |
| Queue | Async work |
| PostgreSQL | Durable state |
| Object Storage | Large payloads |
| Secret Store | Credentials |
| Lab Protocol | Robot-lab control |
| Observability | Monitoring/tracing |
| CI/CD | Build and deployment |

## 119. Phase Mapping

| Phase | Compute Focus |
|---|---|
| Phase 0 | Container architecture and workload boundaries |
| Phase 1 | Control Plane deployment and health |
| Phase 2 | Artifact/booking worker compute |
| Phase 3 | Queue workers, scheduler and reconciliation |
| Phase 4 | Credit/billing workloads and cost controls |
| Phase 5 | Job/Run execution orchestration |
| Phase 6 | Lab Agent integration and execution supervision |
| Phase 7 | WebSocket, results and telemetry scaling |
| Phase 8 | HA, autoscaling hardening, security, DR and optimization |

## 120. Phase 0 Acceptance

- [ ] Container deployment model defined.
- [ ] Workload classes defined.
- [ ] Modular monolith retained.
- [ ] Resource isolation principles defined.
- [ ] Provider-neutral compute boundary defined.

## 121. Phase 1 Acceptance

- [ ] Control Plane runs in containers.
- [ ] API instances are stateless.
- [ ] Health checks exist.
- [ ] Graceful shutdown exists.
- [ ] Production image is immutable.
- [ ] Multi-zone deployment is supported where practical.

## 122. Phase 2 Acceptance

- [ ] Artifact workers exist.
- [ ] Artifact processing is resource-limited.
- [ ] Artifact input is treated as untrusted.
- [ ] Booking-related workers are operational.
- [ ] Object storage access is controlled.

## 123. Phase 3 Acceptance

- [ ] Durable queue is integrated.
- [ ] Workers are idempotent.
- [ ] Scheduler is implemented.
- [ ] Reconciliation worker exists.
- [ ] Worker autoscaling is supported.
- [ ] Dead-letter processing exists.

## 124. Phase 4 Acceptance

- [ ] Credit workloads have appropriate resource controls.
- [ ] Billing integrations are isolated.
- [ ] Financial operations are idempotent.
- [ ] Cost attribution exists.
- [ ] Administrative adjustments are audited.

## 125. Phase 5 Acceptance

- [ ] Job execution workloads are deployed.
- [ ] Run supervision is operational.
- [ ] Timeouts are enforced.
- [ ] Stop/cancel semantics are preserved.
- [ ] Control Plane failure does not corrupt execution state.

## 126. Phase 6 Acceptance

- [ ] Lab Agent connectivity is operational.
- [ ] Execution orchestration is separated from physical control.
- [ ] Reconciliation is operational.
- [ ] Resource allocation state is durable.
- [ ] Physical safety remains local.

## 127. Phase 7 Acceptance

- [ ] WebSocket scaling is validated.
- [ ] Result processing scales independently.
- [ ] Telemetry processing is bounded.
- [ ] Log processing is bounded.
- [ ] Realtime reconnect is validated.

## 128. Phase 8 Acceptance

- [ ] Multi-zone production compute is operational.
- [ ] Autoscaling is validated.
- [ ] Resource quotas are enforced.
- [ ] CI/CD runners are isolated.
- [ ] Admin workloads are isolated.
- [ ] Compute security hardening is complete.
- [ ] Rollback is tested.
- [ ] Disaster recovery is tested.
- [ ] Cost controls are operational.

## 129. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| API overload | High | Autoscaling + rate limits |
| DB connection exhaustion | Critical | Bounded pools |
| Worker retry storm | High | Backoff + DLQ |
| Scheduler duplication | Critical | Transactional coordination |
| OOM | High | Resource limits |
| CI compromise | Critical | Isolated ephemeral runners |
| Privileged container | Critical | Security policy |
| Image compromise | Critical | Signing/scanning/provenance |
| Zone failure | High | Multi-zone placement |
| Run disruption | Critical | Durable state + reconciliation |
| Cost runaway | High | Autoscaling caps |
| Artifact abuse | High | Isolated validation workers |

## 130. Risk: Database Connection Exhaustion

Mitigation:

- bounded connection pools;
- autoscaling limits;
- connection monitoring;
- load testing;
- database capacity planning.

## 131. Risk: Worker Retry Storm

Mitigation:

- exponential backoff;
- maximum attempts;
- dead-letter queue;
- idempotency;
- alerting;
- circuit-breaking where appropriate.

## 132. Risk: Scheduler Double Allocation

Mitigation:

- transactional resource locking;
- explicit allocation state;
- idempotent scheduling;
- reconciliation.

## 133. Risk: CI/CD Compromise

Mitigation:

- ephemeral runners;
- short-lived credentials;
- isolated network;
- signed/provenanced images;
- protected deployment environments;
- audited approvals.

## 134. Risk: Container Escape

Mitigation:

- non-root;
- restricted capabilities;
- seccomp;
- read-only filesystem;
- no privileged mode;
- minimal images;
- security scanning;
- runtime monitoring.

## 135. Risk: Artifact Processing Abuse

Mitigation:

- untrusted input boundary;
- no arbitrary execution;
- size limits;
- CPU/memory limits;
- temporary filesystem;
- restricted network;
- isolated worker pool.

## 136. Open Questions

The following compute decisions remain open:

1. Final container orchestration platform.
2. Final cloud compute provider.
3. Final container registry.
4. Final image signing mechanism.
5. Final SBOM/provenance tooling.
6. Exact API minimum/maximum replicas.
7. Exact worker pool configuration.
8. Final scheduler coordination mechanism.
9. Final autoscaling metrics.
10. Exact CPU/memory resource limits.
11. Final WebSocket scaling mechanism.
12. Final CI/CD runner platform.
13. Final administrative job framework.
14. Final runtime security tooling.
15. Final production SLA.
16. Exact multi-zone topology.
17. Exact capacity targets.
18. Exact compute cost targets.

These decisions do not change the architectural principles established here.

## 137. Full Acceptance Criteria Checklist

### Container Platform

- [ ] Production backend runs on managed/orchestrated container compute.
- [ ] Container images are immutable.
- [ ] Production uses image digests.
- [ ] Images run without unnecessary privileges.
- [ ] Container runtime is hardened.
- [ ] Resource requests are defined.
- [ ] Resource limits are defined.

### Control Plane

- [ ] Control Plane remains a modular monolith.
- [ ] API is stateless.
- [ ] WebSocket support exists.
- [ ] Long-running work is asynchronous.
- [ ] API instances scale horizontally.
- [ ] Health checks are implemented.
- [ ] Graceful shutdown is implemented.

### Workers

- [ ] Durable queue is used.
- [ ] Workers are idempotent.
- [ ] Worker classes are logically separated.
- [ ] Worker resources are bounded.
- [ ] Worker retries are controlled.
- [ ] Dead-letter handling exists.
- [ ] Worker autoscaling is supported.

### Scheduler

- [ ] Scheduler has explicit ownership boundaries.
- [ ] Scheduler cannot double-allocate resources.
- [ ] Scheduling is transactionally safe.
- [ ] Scheduler state is durable.
- [ ] Scheduler failure is recoverable.
- [ ] Scheduler capacity is protected.

### Reconciliation

- [ ] Reconciliation worker exists.
- [ ] Stale Jobs are detected.
- [ ] Stale Runs are detected.
- [ ] Resource mismatches are detected.
- [ ] Lab Agent state can be reconciled.
- [ ] Object storage inconsistencies can be reconciled.
- [ ] Credit inconsistencies can be detected.

### Autoscaling

- [ ] API autoscaling is supported.
- [ ] Worker autoscaling is supported.
- [ ] Queue depth is monitored.
- [ ] Message age is monitored.
- [ ] Autoscaling has maximum limits.
- [ ] Autoscaling cannot overload PostgreSQL.
- [ ] Autoscaling cannot create uncontrolled cost.

### Resource Isolation

- [ ] Workloads use explicit identities.
- [ ] Network policies are enforced.
- [ ] Resource quotas exist.
- [ ] CPU limits exist.
- [ ] Memory limits exist.
- [ ] Temporary storage limits exist.
- [ ] Critical workloads have protected capacity.

### CI/CD

- [ ] CI runners are isolated from production runtime.
- [ ] Ephemeral runners are preferred.
- [ ] Production credentials are scoped.
- [ ] CI images are scanned.
- [ ] Build provenance is recorded.
- [ ] Production image is promoted, not rebuilt.
- [ ] Deployment permissions are audited.

### Administrative Workloads

- [ ] Admin workloads are separated.
- [ ] Admin authorization is enforced.
- [ ] Admin actions are audited.
- [ ] Admin jobs use application/domain services.
- [ ] Direct production shell use is exceptional.
- [ ] Administrative operations are idempotent where required.

### Health Management

- [ ] Liveness checks exist.
- [ ] Readiness checks exist.
- [ ] Startup validation exists.
- [ ] Dependency failure is handled.
- [ ] Resource exhaustion is monitored.
- [ ] Restart loops are detected.
- [ ] Health status is observable.

### Security

- [ ] Containers run with least privilege.
- [ ] Production secrets are not embedded in images.
- [ ] Workload identities are least privilege.
- [ ] Network access is restricted.
- [ ] Artifact workers are isolated.
- [ ] CI runners are isolated.
- [ ] Production deployment uses trusted images.
- [ ] Security monitoring is enabled.

### Deployment

- [ ] Rolling deployment works.
- [ ] Canary deployment is supported.
- [ ] Graceful drain works.
- [ ] Previous image is retained for rollback.
- [ ] Database compatibility is considered.
- [ ] Post-deployment health verification exists.

### Production Resilience

- [ ] Compute spans multiple zones where practical.
- [ ] API survives instance failure.
- [ ] Workers survive instance failure.
- [ ] Queue preserves unfinished work.
- [ ] Scheduler failure is recoverable.
- [ ] Reconciliation resumes after outage.
- [ ] Lab execution state survives Control Plane restart.

### Cost

- [ ] Compute cost is measurable.
- [ ] Autoscaling has limits.
- [ ] Non-production capacity can scale down.
- [ ] CI compute is controlled.
- [ ] Administrative workloads are bounded.
- [ ] Production cost alerts exist.

## 138. Final Compute Invariants

The following are mandatory:

1. The RaaS Control Plane remains a modular monolith initially.
2. Container images are the primary backend deployment unit.
3. Production images are immutable and identified by digest.
4. API instances are stateless.
5. Durable state remains outside compute instances.
6. Workers consume durable queue messages.
7. Workers are idempotent.
8. Scheduler decisions are transactionally safe.
9. Reconciliation is a first-class workload.
10. API and worker compute can scale independently.
11. Autoscaling cannot exceed safe database capacity.
12. Critical workloads have protected compute capacity.
13. Production compute is distributed across failure domains where practical.
14. Containers run with least privilege.
15. CI/CD runners are isolated from production runtime.
16. Administrative workloads are explicitly authorized and audited.
17. User-provided artifacts are treated as untrusted input.
18. Artifact processing cannot execute arbitrary user code in the Control Plane.
19. Secrets are injected at runtime.
20. Production deployment uses trusted immutable images.
21. Graceful shutdown is required.
22. Health and readiness are distinct.
23. Queue failure does not imply loss of durable business state.
24. Control Plane restart does not imply robot stop.
25. Lab Agent and physical robot safety remain outside cloud compute authority.
26. Cloud compute failure requires reconciliation when external execution state is
    uncertain.
27. Compute capacity and cost are observable.
28. Production compute has bounded autoscaling.
29. Service extraction is driven by measurable operational need.
30. Compute architecture remains provider-neutral at the application boundary.

## 139. Final Architecture

The target compute architecture is:

    ┌─────────────────────────────────────────────────────────────┐
    │                       Edge / API Gateway                    │
    └─────────────────────────────┬───────────────────────────────┘
                                  │
                                  v
          ┌───────────────────────────────────────────────┐
          │             Production Compute Cluster        │
          │                                               │
          │   ┌──────────────┐      ┌──────────────┐      │
          │   │ API / WS #1  │      │ API / WS #N  │      │
          │   └──────┬───────┘      └──────┬───────┘      │
          │          │                     │              │
          │          +----------+----------+              │
          │                     │                         │
          │                     v                         │
          │              Application Layer                │
          │                     │                         │
          │          ┌──────────┴──────────┐              │
          │          │                     │              │
          │          v                     v              │
          │      PostgreSQL             Queue             │
          │                                │              │
          │              ┌─────────────────┼────────┐     │
          │              │                 │        │     │
          │              v                 v        v     │
          │          Job Workers       Artifact   Result  │
          │                              Workers   Workers │
          │              │                 │        │     │
          │              └──────────┬──────┴────────┘     │
          │                         │                     │
          │                         v                     │
          │                  Scheduler /                 │
          │                  Reconciliation               │
          │                         │                     │
          └─────────────────────────┼─────────────────────┘
                                    │
                                    v
                             Lab Connectivity
                                    │
                                    v
                                Lab Agent
                                    │
                                    v
                              Kritva Runtime
                                    │
                                    v
                                  Robot

    Separate security boundary:

        CI/CD Runners
              |
              +--> Registry
              +--> Staging
              +--> Controlled Production Deployment

        Administrative Jobs
              |
              +--> Authorized Application Services

The compute architecture is intentionally designed so that the RaaS Control
Plane can grow from an initial production-oriented modular monolith into a
large-scale platform without prematurely introducing distributed services.

The primary scaling unit is the workload, not the business module:

    API        -> scale for user traffic
    Workers    -> scale for asynchronous work
    Scheduler  -> scale under controlled coordination
    Reconcile  -> scale for recovery workload
    Results    -> scale for data processing
    WebSocket  -> scale for realtime connections

This preserves architectural ownership while allowing compute resources to
scale independently as RaaS adoption grows.

> **Compute scales the cloud control plane; it never becomes the real-time or
> physical safety controller for the robot.**
