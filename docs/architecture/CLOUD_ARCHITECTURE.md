# Kritva RaaS Cloud Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Cloud Architecture |
| Path | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Cloud Scope | Control Plane supporting infrastructure |
| Architecture Style | Provider-neutral cloud architecture |
| Application Model | Modular monolith |
| Compute Model | Stateless API + asynchronous workers |
| Database | Managed PostgreSQL |
| Object Storage | S3-compatible abstraction |
| Queue | Managed/provider-neutral queue abstraction |
| Secrets | Managed secret store |
| Observability | Logs + metrics + traces + alerts |
| Lab Connectivity | Secure outbound Lab Agent connection |
| Environments | Local, Development, Staging, Production |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the production-grade cloud architecture for Kritva RaaS.

The cloud environment provides the infrastructure required to operate the RaaS Control
Plane and connect it securely to robotic laboratories.

The cloud architecture is intentionally separated from the application architecture.

The application defines:

- users;
- projects;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- labs.

The cloud architecture defines:

- where those services execute;
- how they communicate;
- where persistent data is stored;
- how asynchronous work is processed;
- how secrets are protected;
- how environments are separated;
- how labs connect;
- how failures are detected;
- how deployments are performed;
- how the system remains provider-neutral.

The core principle is:

    Cloud
      |
      +--> Control Plane
      +--> Workers
      +--> PostgreSQL
      +--> Object Storage
      +--> Queue
      +--> Secrets
      +--> Observability
      |
      v
    Secure Lab Connectivity
      |
      v
    Lab Agent
      |
      v
    Robot / Simulator

## 3. Scope

This document covers:

1. Cloud topology.
2. Network architecture.
3. Compute architecture.
4. API deployment.
5. Worker deployment.
6. Managed PostgreSQL.
7. Object storage.
8. Queue infrastructure.
9. Secret management.
10. Identity integration boundary.
11. Observability.
12. Monitoring.
13. Alerting.
14. Lab connectivity.
15. Environment separation.
16. Infrastructure-as-Code.
17. Deployment architecture.
18. Backup integration.
19. Disaster recovery architecture.
20. Cost controls.
21. Provider neutrality.
22. Scaling.
23. Availability.
24. Security boundaries.
25. Phase 0-8 mapping.

This document does not define:

- React/Tauri implementation;
- Control Plane business logic;
- PostgreSQL schema details;
- robot firmware;
- Lab Agent internal implementation;
- physical robot safety systems.

Those responsibilities belong to their respective architecture documents.

## 4. Architectural Goals

The cloud architecture shall:

1. Provide reliable hosting for the Control Plane.
2. Separate API compute from asynchronous workers.
3. Use managed PostgreSQL as the authoritative database.
4. Use object storage for large files.
5. Use queues for asynchronous work.
6. Protect secrets using managed secret storage.
7. Provide structured observability.
8. Isolate environments.
9. Support horizontal scaling.
10. Support secure lab connectivity.
11. Minimize direct public exposure.
12. Avoid provider-specific application dependencies.
13. Support automated deployments.
14. Support backup and recovery.
15. Support staging before production.
16. Provide operational visibility.
17. Provide cost controls.
18. Allow future cloud-provider migration without redesigning application domains.

## 5. Non-Goals

The cloud architecture is not intended to:

- execute hard real-time robot control;
- directly connect cloud compute to motor controllers;
- make the cloud a physical safety system;
- store customer source code as part of the normal execution flow;
- require a specific cloud provider;
- introduce Kubernetes solely for architectural fashion;
- introduce microservices prematurely;
- expose PostgreSQL publicly;
- expose internal queues publicly;
- treat object storage as a relational database;
- use the queue as authoritative business state.

## 6. Cloud Architecture Principles

The architecture follows these principles:

1. Private by default.
2. Public only where necessary.
3. Stateless application compute.
4. Managed persistence.
5. Asynchronous long-running work.
6. Least privilege.
7. Environment isolation.
8. Infrastructure as code.
9. Provider-neutral application interfaces.
10. Observable by default.
11. Recoverable by design.
12. Safe degradation.
13. Explicit trust boundaries.
14. No cloud dependency in robot real-time control.
15. Physical safety remains local to the robot/lab.

## 7. High-Level Cloud Topology

    Internet
       |
       v
    +----------------------+
    | DNS / Edge / TLS     |
    +----------+-----------+
               |
               v
    +----------------------+
    | Load Balancer / API  |
    | Gateway              |
    +----------+-----------+
               |
       +-------+-------+
       |               |
       v               v
    API Instance    API Instance
       |               |
       +-------+-------+
               |
      +--------+---------+
      |        |         |
      v        v         v
    PostgreSQL Queue  Object Storage
                 |
                 v
              Workers
                 |
                 v
            Lab Gateway
                 |
                 v
             Lab Agent
                 |
                 v
              Robot

## 8. Trust Zones

The cloud environment is divided into logical trust zones.

| Zone | Purpose | Exposure |
|---|---|---|
| Public Edge | TLS/API entry | Public |
| Application | Control Plane/workers | Restricted |
| Data | PostgreSQL | Private |
| Storage | Object storage | Private/API-authorized |
| Messaging | Queue | Private |
| Secrets | Secret management | Restricted |
| Operations | Monitoring/logging | Restricted |
| Lab | Lab connectivity | Controlled |

Public network access should terminate at the minimum required edge boundary.

## 9. Public Edge

The public edge provides:

- DNS;
- TLS termination where appropriate;
- load balancing;
- API routing;
- rate limiting;
- request filtering;
- optional WAF;
- health routing.

The public edge must not expose:

- PostgreSQL;
- queue endpoints;
- internal worker endpoints;
- secret stores;
- internal administrative services.

## 10. DNS Architecture

Recommended logical names include:

    api.<environment>.<domain>
    studio.<environment>.<domain>
    console.<environment>.<domain>
    ws.<environment>.<domain>

Production names should not expose implementation-specific infrastructure names.

The exact DNS provider remains an infrastructure decision.

## 11. TLS

External communication must use TLS.

Required paths include:

    Studio <----TLS----> Control Plane
    Web Console <----TLS----> Control Plane
    Control Plane <----TLS----> Lab Agent

Internal encryption should also be used where provider/platform support makes it
practical and appropriate.

## 12. Network Architecture

The production network should separate:

- public ingress;
- application compute;
- data services;
- workers;
- management.

Conceptually:

    +---------------------------------------------------------+
    |                       VPC / VNet                       |
    |                                                         |
    |  Public Subnet / Edge                                   |
    |      |                                                  |
    |      v                                                  |
    |  Load Balancer                                          |
    |      |                                                  |
    |  Private Application Subnets                            |
    |      +--> API                                           |
    |      +--> Workers                                       |
    |      +--> Internal services                             |
    |                                                         |
    |  Private Data Subnets                                   |
    |      +--> PostgreSQL                                    |
    |                                                         |
    +---------------------------------------------------------+

## 13. Network Segmentation

Production should use logical network segmentation.

Application compute should have access to:

- PostgreSQL;
- queue;
- object storage;
- secret store;
- observability endpoints;
- Lab connectivity boundary.

It should not have unrestricted outbound access.

## 14. Inbound Rules

Public inbound access should be limited to required endpoints.

Typical allowed paths:

    HTTPS :443
    WebSocket over TLS :443

Administrative access should use controlled management channels rather than exposing
SSH or equivalent management ports publicly.

## 15. Outbound Rules

Application outbound access may include:

- managed database;
- object storage;
- queue;
- identity provider;
- observability;
- Lab Agent connectivity.

Outbound traffic should be controlled according to environment and security requirements.

## 16. Compute Architecture

Compute is divided into:

1. API compute.
2. Worker compute.
3. Optional scheduled-job compute.
4. Operational/admin compute only if required.

The application should remain stateless.

## 17. API Compute

API instances run the Control Plane application.

Responsibilities:

- HTTP API;
- authentication context;
- authorization;
- application services;
- synchronous business operations;
- WebSocket endpoint where appropriate.

API instances must not rely on local persistent filesystem state.

## 18. Worker Compute

Worker instances execute asynchronous jobs.

Responsibilities may include:

- artifact validation;
- artifact processing;
- scheduler tasks;
- job dispatch;
- result processing;
- cleanup;
- reconciliation.

Workers should be independently scalable.

## 19. Compute Scaling

API scaling should be based on:

- request rate;
- CPU;
- memory;
- latency;
- concurrent connections.

Worker scaling should consider:

- queue depth;
- message age;
- processing duration;
- failure rate.

Scaling must not create duplicate business operations.

## 20. Stateless Application Model

API instances must not keep authoritative state in local memory.

Persistent state belongs in:

- PostgreSQL;
- object storage;
- queue;
- external identity system.

This allows:

    API Instance A
          |
          +----\
          |     \
    API Instance B ---> Same Authoritative State
          |     /
          +----/

## 21. Worker State

Workers may maintain ephemeral execution state in memory.

They must persist authoritative progress through the Control Plane.

A worker restart must not make the system permanently lose the operation state.

## 22. Compute Packaging

The cloud application should be packaged as an immutable deployable artifact.

Examples include:

- container image;
- VM image;
- managed application package.

The architecture does not mandate one provider-specific runtime.

Containers are a suitable default if supported by the selected deployment environment.

## 23. Kubernetes Position

Kubernetes is not required for the initial deployment.

The initial cloud architecture should prefer the simplest managed compute platform
that supports:

- multiple API instances;
- workers;
- health checks;
- rolling deployments;
- secrets;
- networking;
- autoscaling.

Kubernetes may be introduced if operational requirements justify it.

## 24. Managed PostgreSQL

PostgreSQL is the authoritative structured-data store.

The preferred production model is managed PostgreSQL.

Required capabilities should include, where available:

- automated backups;
- point-in-time recovery;
- encryption;
- high availability;
- monitoring;
- controlled network access;
- maintenance management.

## 25. Database Topology

Conceptually:

    Application
        |
        v
    Private DB Endpoint
        |
        v
    Managed PostgreSQL
        |
        +--> Primary
        |
        +--> Standby / HA
        |
        +--> Backups

The application should connect through a stable database endpoint rather than directly
to individual database nodes.

## 26. Database Security

The database must:

- remain private;
- require authentication;
- use encryption in transit;
- use encryption at rest;
- use least-privilege database credentials;
- restrict network access;
- expose no public administrative endpoint.

## 27. Database Availability

Production should use managed high availability where the selected provider supports it.

The application must tolerate database failover through:

- connection retry;
- transaction retry where safe;
- health checking;
- controlled degradation.

## 28. Database Connection Management

API and worker processes should use bounded connection pools.

The architecture must prevent:

    many API instances
        +
    many workers
        +
    unbounded connections
        |
        v
    PostgreSQL exhaustion

Connection limits must be part of capacity planning.

## 29. Database Backups

Production PostgreSQL should have:

- scheduled backups;
- point-in-time recovery where available;
- encrypted backup storage;
- retention policy;
- access controls;
- restore testing.

A backup that has never been restored is not sufficient evidence of recoverability.

## 30. Object Storage

Object storage is the primary store for large unstructured data.

Examples:

- `.krv` artifacts;
- videos;
- execution logs;
- telemetry exports;
- result files;
- diagnostic bundles.

## 31. Object Storage Topology

    Control Plane
          |
          | Metadata
          v
      PostgreSQL

    Studio / Lab Agent
          |
          | Authorized transfer
          v
      Object Storage

The binary itself should not unnecessarily pass through the API server.

## 32. Object Storage Buckets

Logical separation should exist for:

    artifacts
    results
    videos
    logs
    diagnostics
    backups

Whether these become separate buckets/containers or prefixes is provider-specific.

## 33. Object Storage Security

Object storage should:

- block public access by default;
- encrypt data at rest;
- enforce access policies;
- support object versioning where required;
- support lifecycle policies;
- provide integrity checks;
- support audit logging where appropriate.

## 34. Signed Object Access

Authorized temporary access may use signed URLs.

Typical flow:

    Studio
      |
      v
    Control Plane
      |
      v
    Authorization
      |
      v
    Short-lived Signed URL
      |
      v
    Object Storage

The object storage URL itself is not an authorization mechanism.

## 35. Artifact Upload Path

Preferred flow:

    Studio
      |
      | artifact.create
      v
    Control Plane
      |
      v
    Upload Authorization
      |
      v
    Studio
      |
      | HTTPS
      v
    Object Storage
      |
      v
    Artifact Validation Worker
      |
      v
    PostgreSQL
      |
      v
    ACCEPTED / REJECTED

## 36. Result Upload Path

    Lab Agent
       |
       | result object
       v
    Object Storage
       |
       v
    Result Worker
       |
       +--> PostgreSQL metadata
       |
       v
    Result Available

## 37. Queue Architecture

The queue provides asynchronous work transport.

It decouples:

- API request handling;
- long-running processing;
- scheduling;
- lab execution;
- result processing.

The queue should support:

- durable messages;
- acknowledgements;
- retries;
- dead-letter handling;
- visibility timeout or equivalent;
- monitoring.

## 38. Queue Topology

    Control Plane
        |
        v
    Primary Queue
        |
        +--> Artifact Worker
        +--> Scheduler Worker
        +--> Job Worker
        +--> Result Worker
        +--> Cleanup Worker

The exact number of queues depends on workload and isolation requirements.

## 39. Queue Isolation

Separate queues should be considered when workloads have materially different:

- latency requirements;
- retry policies;
- throughput;
- failure characteristics;
- scaling profiles.

Do not create separate queues solely for organizational naming.

## 40. Queue Reliability

A message should be acknowledged only after the associated operation is durably
completed or safely handed off.

Duplicate delivery must be expected.

Workers must use idempotency.

## 41. Dead-Letter Queue

Messages exceeding retry policy should be moved to a dead-letter queue.

Dead-letter monitoring should produce operational alerts.

Recovery must require explicit operator or automated reconciliation rather than blind
replay.

## 42. Secrets Architecture

Secrets must be managed outside source code and ordinary application configuration.

Examples:

- database credentials;
- object-storage credentials;
- queue credentials;
- identity provider secrets;
- signing credentials;
- Lab Agent trust credentials.

## 43. Secret Store

The cloud provider's managed secret service should be used where available.

Conceptually:

    Application
        |
        v
    Secret Identity
        |
        v
    Managed Secret Store
        |
        v
    Runtime Credential

Application instances should receive only the secrets they require.

## 44. Secret Rotation

Production secrets should support rotation.

Rotation should cover:

- database credentials;
- API credentials;
- service identities;
- Lab Agent credentials;
- signing credentials.

The rotation process must be documented and tested.

## 45. Secret Exposure Rules

Secrets must not appear in:

- Git;
- container images;
- source files;
- application logs;
- metrics;
- traces;
- crash reports;
- diagnostic bundles.

## 46. Identity and Access Management

Cloud resources should use workload identities or equivalent managed identities
rather than long-lived static credentials where possible.

Example:

    API Workload Identity
        |
        +--> PostgreSQL
        +--> Object Storage
        +--> Queue
        +--> Secret Store

Access must follow least privilege.

## 47. Observability Architecture

Cloud observability consists of:

- logs;
- metrics;
- traces;
- dashboards;
- alerts;
- audit events.

Conceptually:

    API / Workers / DB / Queue / Lab
                  |
                  v
             Observability
                  |
          +-------+-------+
          |       |       |
          v       v       v
        Logs    Metrics  Traces
          |       |       |
          +-------+-------+
                  |
                  v
               Alerts

## 48. Centralized Logging

All cloud application components should emit structured logs.

Required fields should include:

    timestamp
    environment
    component
    module
    level
    request_id
    correlation_id
    organization_id
    job_id
    run_id
    message
    error_code

Sensitive information must be filtered.

## 49. Metrics

Cloud metrics should cover:

### API

- request count;
- latency;
- error rate;
- saturation;
- concurrent connections.

### Compute

- CPU;
- memory;
- instance count;
- restart count.

### Database

- connections;
- CPU;
- storage;
- replication health;
- query latency;
- errors.

### Queue

- depth;
- message age;
- retries;
- dead-letter count.

### Object Storage

- request errors;
- capacity;
- transfer volume.

### Lab

- agents online;
- agents offline;
- heartbeat age;
- active resources;
- execution failures.

## 50. Distributed Tracing

Tracing should connect:

    Studio
      |
      v
    API
      |
      v
    Application Service
      |
      +--> PostgreSQL
      +--> Queue
      +--> Object Storage
      |
      v
    Worker
      |
      v
    Lab Agent

Correlation identifiers must survive asynchronous boundaries.

## 51. Alerting

Alerts should be:

- actionable;
- owned;
- deduplicated;
- severity-classified;
- linked to runbooks.

Suggested severities:

| Severity | Meaning |
|---|---|
| P1 | Critical production outage/safety-impacting service failure |
| P2 | Major degraded service |
| P3 | Limited degradation |
| P4 | Informational/maintenance |

Cloud alerts must not imply that cloud monitoring replaces physical robot safety monitoring.

## 52. Example Critical Alerts

Potential P1/P2 conditions:

- production API unavailable;
- database unavailable;
- queue unavailable;
- widespread artifact validation failure;
- widespread job dispatch failure;
- all lab connectivity lost;
- credit transaction integrity failure;
- object storage unavailable;
- critical security event.

## 53. Health Monitoring

Every major component should expose or provide health information.

Examples:

    API
    Workers
    Database
    Queue
    Object Storage
    Lab Gateway
    Lab Agents

Health status should distinguish:

- healthy;
- degraded;
- unavailable;
- unknown.

## 54. Environment Architecture

Kritva RaaS requires separate environments:

    Local
      |
      v
    Development
      |
      v
    Staging
      |
      v
    Production

Each environment has independent:

- database;
- object storage;
- queue;
- secrets;
- configuration;
- application deployment.

Production data must not be used in lower environments unless explicitly sanitized
and approved.

## 55. Local Environment

Local development should provide:

- Control Plane;
- PostgreSQL;
- object storage emulator;
- queue emulator;
- mock Lab Agent.

The local environment should support the complete software workflow without requiring
production infrastructure.

## 56. Development Environment

Development provides a shared cloud environment for active engineering.

Characteristics:

- non-production;
- isolated credentials;
- disposable test data;
- automated deployment;
- relaxed scale;
- basic monitoring.

Development must not have access to production secrets or production data.

## 57. Staging Environment

Staging should approximate production architecture.

It should validate:

- release candidates;
- database migrations;
- object storage;
- queues;
- workers;
- authentication;
- Lab Agent connectivity;
- end-to-end workflows.

Staging must not silently share production state.

## 58. Production Environment

Production provides:

- high availability;
- secure networking;
- managed PostgreSQL;
- production object storage;
- durable queues;
- managed secrets;
- observability;
- backups;
- alerts;
- controlled deployments.

Production changes require explicit release controls.

## 59. Environment Isolation

Isolation should exist at:

- cloud project/account/subscription;
- network;
- database;
- object storage;
- queue;
- secrets;
- identity configuration.

The strongest practical isolation should be used for production.

## 60. Infrastructure as Code

Cloud infrastructure should be defined through Infrastructure-as-Code.

IaC should manage:

- network;
- compute;
- database;
- storage;
- queues;
- IAM;
- secrets references;
- monitoring;
- alerts;
- DNS;
- deployment configuration.

Manual production configuration should be minimized.

## 61. IaC State

IaC state must be:

- protected;
- versioned;
- access-controlled;
- backed up;
- separated by environment.

Secrets should not be stored in plaintext IaC state.

## 62. Deployment Pipeline

Recommended flow:

    Git Commit
        |
        v
    CI
        |
        +--> Build
        +--> Test
        +--> Security Scan
        +--> IaC Validation
        |
        v
    Development
        |
        v
    Staging
        |
        v
    Acceptance
        |
        v
    Production Approval
        |
        v
    Production

## 63. Immutable Deployment

Production deployments should use immutable application versions.

Each deployment should identify:

- application version;
- source revision;
- container/image digest where applicable;
- database migration version;
- configuration version.

## 64. Rollout Strategy

Production rollout may use:

- rolling deployment;
- blue/green;
- canary.

The initial implementation may use rolling deployment if supported by the selected
managed platform.

## 65. Rollback

Rollback must distinguish:

- application rollback;
- database rollback;
- configuration rollback;
- infrastructure rollback.

Database migrations should favor backward-compatible changes because application
rollback does not automatically mean schema rollback.

## 66. Cloud-to-Lab Connectivity

The cloud must not expose robot hardware directly to the Internet.

Preferred model:

    Lab Network
        |
        v
    Lab Agent
        |
        | Outbound Secure Connection
        v
    Cloud Lab Gateway / Control Plane
        |
        v
    RaaS Control Plane

The Lab Agent initiates or maintains the secure connectivity path where possible.

## 67. Why Outbound Lab Connectivity

Outbound connectivity reduces the requirement for:

- inbound firewall holes;
- public robot addresses;
- NAT traversal at every robot;
- direct Internet exposure of lab systems.

The exact transport may use secure WebSocket, mutually authenticated TLS, VPN,
or another controlled protocol.

## 68. Lab Network Boundary

The lab should isolate:

- robot control network;
- Lab Agent host;
- management network;
- general Internet access.

The cloud should communicate with the Lab Agent rather than individual robot devices.

## 69. Lab Agent Trust

Each Lab Agent requires:

- unique identity;
- credential/certificate;
- lab association;
- capability declaration;
- software version;
- heartbeat.

Revoked agents must not receive new work.

## 70. Lab Connectivity Failure

When connectivity is lost:

1. Cloud marks agent unavailable.
2. New work is prevented.
3. Existing execution state becomes uncertain if necessary.
4. Lab-side safety/runtime rules remain authoritative.
5. Reconnection triggers reconciliation.
6. Control Plane does not blindly replay commands.

## 71. Lab Connectivity Security

The lab protocol should provide:

- encryption;
- authentication;
- authorization;
- protocol versioning;
- message integrity;
- replay protection where required;
- command correlation;
- auditability.

## 72. Cloud and Physical Safety

Cloud architecture is not a physical safety architecture.

The cloud may request:

    START
    STOP
    CANCEL

But the cloud cannot replace:

    Physical E-STOP
    Local Safety Controller
    Robot Safety Firmware
    Local Motion Limits

A cloud outage must not be treated as an emergency-stop command.

## 73. Provider Neutrality

Application architecture must remain independent of:

- AWS;
- Azure;
- Google Cloud;
- OCI;
- other providers.

Provider-specific capabilities should be isolated behind infrastructure adapters.

## 74. Provider-Neutral Interfaces

Logical interfaces include:

    Database
    ObjectStorage
    JobQueue
    SecretStore
    IdentityProvider
    Observability
    LoadBalancer
    DeploymentPlatform

The application depends on the interface.

Infrastructure code selects the provider implementation.

## 75. Database Provider Abstraction

The application should depend on PostgreSQL semantics rather than a cloud vendor's
database API.

The selected provider manages:

- compute;
- storage;
- backups;
- HA;
- patching.

The schema and application remain portable across managed PostgreSQL providers.

## 76. Object Storage Abstraction

The application should target an S3-compatible or equivalent object interface.

Provider-specific features should be isolated.

Avoid embedding provider-specific object URLs into domain entities.

## 77. Queue Abstraction

The queue interface should support:

- enqueue;
- receive;
- acknowledge;
- retry;
- dead-letter.

Provider-specific delivery mechanisms remain in infrastructure code.

## 78. Secret Store Abstraction

Application code should request named secrets through a provider-neutral interface.

Example:

    SecretStore.get("database/application")

The provider implementation determines whether the source is:

- cloud secret manager;
- vault;
- key management system.

## 79. Observability Abstraction

Application instrumentation should use standard structured logging and telemetry
interfaces rather than hard-coding a provider-specific dashboard.

Provider-specific exporters remain deployment configuration.

## 80. Provider Migration

A future provider migration should require primarily:

- IaC changes;
- infrastructure adapter changes;
- deployment configuration;
- operational validation.

It should not require rewriting:

- booking logic;
- credit logic;
- artifact logic;
- job orchestration;
- project logic.

## 81. Cloud Cost Architecture

Cost should be controlled through:

- environment sizing;
- autoscaling;
- object lifecycle policies;
- database sizing;
- queue sizing;
- log retention;
- video retention;
- telemetry retention;
- non-production shutdown schedules.

## 82. Cost Attribution

Where practical, usage should be attributable to:

- organization;
- project;
- platform;
- job;
- run.

This supports both product billing and cloud cost analysis.

## 83. Storage Lifecycle

Object lifecycle rules should move or delete old objects according to policy.

Examples:

    Active Artifact
        |
        v
    Retained Artifact
        |
        v
    Archived Artifact
        |
        v
    Expired Artifact

Retention must respect:

- subscription;
- billing;
- legal;
- audit;
- research requirements.

## 84. Backup Architecture

Backups cover:

- PostgreSQL;
- critical configuration;
- IaC state;
- required object data;
- operational metadata.

Backups must be:

- encrypted;
- access-controlled;
- retained;
- periodically tested.

## 85. Disaster Recovery

Disaster recovery should restore in this order:

    1. Cloud infrastructure
    2. Secrets/configuration
    3. PostgreSQL
    4. Object storage
    5. Queue
    6. Control Plane
    7. Workers
    8. Lab connectivity
    9. Reconciliation

Physical robot execution requires separate lab-side recovery procedures.

## 86. RPO and RTO

Production must define:

- Recovery Point Objective;
- Recovery Time Objective.

Initial targets should be documented before production launch.

The targets may differ for:

- business metadata;
- credit transactions;
- artifacts;
- results;
- videos;
- telemetry.

## 87. Active Job Recovery

Active jobs require special handling.

After cloud recovery:

    Unknown Job State
          |
          v
    Query Lab Agent
          |
          +--> RUNNING
          |
          +--> COMPLETED
          |
          +--> FAILED
          |
          +--> UNKNOWN
          |
          v
    Reconcile Control Plane

The system must not assume that a missing cloud record means that the robot stopped.

## 88. Queue Recovery

After disaster recovery:

- reconstruct pending work from authoritative database state;
- avoid blindly replaying old queue messages;
- reconcile jobs;
- reconcile artifact validation;
- reconcile lab resources.

## 89. Database Disaster Recovery

Recovery must include:

- latest valid backup;
- point-in-time recovery where supported;
- migration validation;
- application compatibility;
- integrity checks.

## 90. Object Disaster Recovery

Critical artifacts and results should have an appropriate durability/backup policy.

The exact strategy may include:

- versioning;
- replication;
- cross-region copies;
- lifecycle retention.

## 91. Multi-Region Architecture

Initial production may be single-region.

Multi-region should not be introduced until justified by:

- availability requirements;
- user geography;
- disaster recovery targets;
- operational maturity.

If multi-region is later introduced:

    Global Edge
       |
       +--> Region A
       |
       +--> Region B

Data consistency and robot-lab locality must be explicitly addressed.

## 92. Regional Lab Locality

Where physical labs exist in different regions, the cloud may need region-aware scheduling.

Example:

    User
      |
      v
    Control Plane
      |
      v
    Scheduler
      |
      +--> Lab A
      +--> Lab B
      +--> Lab C

Scheduling must account for:

- platform;
- availability;
- booking;
- network locality;
- lab health;
- capacity.

## 93. Security Boundaries

The principal cloud boundaries are:

    Internet
       |
       v
    Public Edge
       |
       v
    Application
       |
       +--> Data
       +--> Storage
       +--> Queue
       +--> Secrets
       |
       v
    Lab Connectivity
       |
       v
    Lab Network
       |
       v
    Robot

Each boundary requires explicit authentication and authorization appropriate to
the data/control crossing it.

## 94. Administrative Access

Administrative access should use:

- centralized identity;
- MFA;
- least privilege;
- short-lived credentials;
- audited access;
- controlled management endpoints.

Direct production database access should be restricted.

## 95. Cloud Security Monitoring

Security monitoring should detect:

- unexpected access;
- authentication failures;
- privilege changes;
- secret access anomalies;
- public storage exposure;
- network anomalies;
- suspicious deployment;
- unexpected Lab Agent behavior.

## 96. Data Classification

Suggested classification:

| Data | Classification |
|---|---|
| Public platform metadata | Public/controlled |
| Project metadata | Private |
| Artifact | Private/IP-sensitive |
| Results | Private/IP-sensitive |
| Credit transactions | Sensitive |
| User identity | Sensitive |
| Authentication data | Highly sensitive |
| Secrets | Highly sensitive |
| Audit records | Sensitive |

The cloud architecture must apply controls according to classification.

## 97. Source Code Protection

The cloud should not require customer source code.

The normal workflow is:

    Customer Source
        |
        v
    Local Build
        |
        v
    .krv
        |
        v
    Cloud

This reduces cloud source-code exposure and simplifies backend build infrastructure.

## 98. Artifact IP Protection

Artifacts may still contain proprietary binary IP.

Therefore:

- access must be authorized;
- object storage must be private;
- download URLs must expire;
- artifact metadata must be protected;
- audit records should track access;
- Lab Agents should verify integrity.

## 99. Cloud API Protection

The API should use:

- TLS;
- authentication;
- authorization;
- rate limiting;
- input validation;
- request size limits;
- audit logging.

Expensive operations should use asynchronous processing.

## 100. API Availability

The public API should have:

- health checks;
- load balancing;
- multiple instances in production where required;
- graceful shutdown;
- bounded request timeouts;
- connection draining during deployment.

## 101. Graceful Shutdown

Application instances must:

1. stop accepting new work;
2. finish or safely terminate active requests;
3. stop accepting new worker messages;
4. acknowledge only completed work;
5. close connections;
6. exit.

This prevents avoidable duplicate processing.

## 102. Deployment Availability

Rolling deployments should maintain sufficient healthy capacity.

Production deployment must include:

- health checks;
- readiness;
- rollback criteria;
- migration compatibility.

## 103. Maintenance

Managed services may require maintenance.

The architecture should account for:

- database maintenance windows;
- compute replacement;
- queue maintenance;
- storage maintenance;
- secret rotation.

Application behavior must tolerate expected infrastructure interruptions.

## 104. Cloud Development Workflow

The recommended engineering flow is:

    Feature Branch
        |
        v
    CI
        |
        v
    Local
        |
        v
    Development
        |
        v
    Staging
        |
        v
    Production

Infrastructure changes must pass validation before production.

## 105. Cloud CI Requirements

CI should validate:

- application build;
- unit tests;
- integration tests;
- security scanning;
- dependency scanning;
- container/image scanning where applicable;
- IaC validation;
- migration validation;
- API contract tests.

## 106. Infrastructure Change Review

Infrastructure changes should be reviewed for:

- security;
- cost;
- availability;
- data impact;
- rollback;
- observability;
- environment scope.

Production infrastructure changes require explicit approval.

## 107. Configuration Management

Configuration should be separated into:

- code;
- environment configuration;
- secrets;
- runtime feature flags.

Production configuration must not be accidentally reused in development.

## 108. Environment Naming

A consistent environment naming model should be used.

Example:

    local
    dev
    staging
    prod

Cloud resources should include environment identity in their logical names/tags.

## 109. Resource Tagging

Cloud resources should be tagged with:

    product = kritva-raas
    environment = dev|staging|prod
    component = api|worker|db|storage|queue
    owner = platform
    cost_center = raas

The exact tagging model may vary by provider.

## 110. Operational Runbooks

Production operations should have runbooks for:

- API outage;
- database outage;
- queue backlog;
- object-storage failure;
- Lab Agent outage;
- deployment rollback;
- database recovery;
- secret rotation;
- certificate rotation;
- security incident;
- cloud disaster.

## 111. Capacity Planning

Capacity planning should track:

- API requests;
- concurrent users;
- artifact uploads;
- artifact sizes;
- jobs/day;
- concurrent jobs;
- result volume;
- video volume;
- telemetry volume;
- database growth;
- queue throughput.

## 112. Scaling Boundaries

Primary scaling boundaries are:

    API traffic
       |
       v
    API Compute

    Async workload
       |
       v
    Queue
       |
       v
    Workers

    Structured state
       |
       v
    PostgreSQL

    Binary volume
       |
       v
    Object Storage

This allows each infrastructure dimension to scale independently.

## 113. Performance Architecture

Performance goals include:

- low API latency for synchronous operations;
- asynchronous handling of long tasks;
- direct object transfers;
- efficient database indexing;
- queue-based workload smoothing;
- WebSocket/event streaming for realtime state.

## 114. Large File Transfer

Large artifacts, videos, and results should not unnecessarily traverse API instances.

Preferred:

    Client
      |
      v
    Signed Object Transfer
      |
      v
    Object Storage

The API handles authorization and metadata.

## 115. Cloud Resource Isolation

Worker types may eventually require separate compute pools.

Examples:

- lightweight validation workers;
- CPU-heavy processing;
- scheduling workers;
- result processing.

Isolation should be introduced only when workloads justify it.

## 116. Simulation Infrastructure

The cloud may eventually host simulated robots for development and testing.

Simulation compute should remain separate from physical robot control.

Conceptually:

    Control Plane
       |
       +--> Physical Lab Agent
       |
       +--> Simulation Agent

Both follow compatible execution contracts where practical.

## 117. Cloud Test Lab

A cloud-hosted test environment may provide:

- mock Lab Agent;
- simulated platform;
- deterministic jobs;
- automated result generation.

This enables end-to-end CI without requiring physical robots.

## 118. Production Lab Boundary

Production physical robots should only be accessible through approved Lab Agents.

Cloud infrastructure must not provide arbitrary shell or network access to lab networks.

## 119. Lab Network Segmentation

Each lab should be treated as an independent operational boundary.

The Control Plane should identify:

- lab ID;
- region;
- agent;
- platforms;
- resources;
- health.

A compromised lab agent must not automatically expose unrelated labs.

## 120. Provider-Neutral Deployment Model

The logical architecture is:

    Managed Edge
        |
    Managed Compute
        |
    Managed PostgreSQL
        |
    Managed Object Storage
        |
    Managed Queue
        |
    Managed Secrets
        |
    Managed Observability

Each provider supplies an implementation of the logical service.

## 121. Provider-Specific Adapter Layer

Provider-specific code should live under infrastructure/deployment boundaries.

Examples:

    cloud/aws/
    cloud/azure/
    cloud/gcp/

if multiple providers are later supported.

The application should not import provider-specific SDKs into domain modules.

## 122. Vendor Lock-In Controls

Controls include:

- PostgreSQL standard SQL where practical;
- S3-compatible storage interface;
- generic queue interface;
- standard TLS;
- standard OpenTelemetry-style instrumentation;
- IaC modules;
- containerized application packaging.

Provider-specific features may still be used when their value justifies them.

## 123. Availability Strategy

Initial availability strategy:

- managed services;
- multiple API instances where required;
- durable database;
- durable queue;
- durable object storage;
- automated deployment;
- health checks.

Higher availability levels can be added incrementally.

## 124. Reliability Model

The cloud should assume:

- instance failures;
- network failures;
- database failover;
- queue duplicates;
- storage timeouts;
- Lab Agent disconnects;
- deployment failures.

Correctness must not depend on any single ephemeral compute instance.

## 125. Failure Isolation

Failure of one subsystem should not unnecessarily cascade.

Examples:

- object-storage failure should not corrupt PostgreSQL metadata;
- one worker failure should not stop API service;
- one Lab Agent failure should not stop unrelated labs;
- one organization with high workload should not exhaust all global capacity.

## 126. Tenant Resource Protection

The system should eventually support quotas for:

- API requests;
- artifact storage;
- artifact size;
- job concurrency;
- execution time;
- result storage.

This protects platform stability.

## 127. Production Readiness Gates

Before production, verify:

- security;
- backups;
- restore;
- monitoring;
- alerting;
- scaling;
- deployment;
- rollback;
- lab connectivity;
- credit integrity;
- artifact integrity.

## 128. Cloud Architecture Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Provider lock-in | Medium | Adapter interfaces |
| Cloud outage | Critical | HA + recovery |
| Database loss | Critical | Backup + PITR |
| Queue overload | High | Scaling/backpressure |
| Object storage exposure | Critical | Private access |
| Secret leakage | Critical | Managed secret store |
| Lab exposure | Critical | Agent boundary |
| Cost overrun | High | Quotas/lifecycle |
| Poor observability | High | Logs/metrics/traces |
| Deployment failure | High | CI/staging/rollback |
| Regional outage | High | DR strategy |
| Excessive complexity | Medium | Managed services/simple topology |

## 129. Risk: Provider Lock-In

Mitigation:

- logical service interfaces;
- provider adapters;
- standard data formats;
- PostgreSQL;
- S3-compatible object model;
- portable deployment artifacts.

## 130. Risk: Cloud Outage During Robot Execution

Mitigation:

- local robot runtime remains authoritative;
- Lab Agent maintains local safety;
- cloud execution state is reconciled;
- cloud outage does not imply physical stop;
- recovery procedures identify uncertain runs.

## 131. Risk: Database Corruption

Mitigation:

- managed PostgreSQL;
- backups;
- PITR;
- integrity checks;
- migration discipline;
- restore testing.

## 132. Risk: Object Storage Data Loss

Mitigation:

- provider durability;
- versioning where appropriate;
- replication where required;
- retention;
- backup strategy for critical artifacts/results.

## 133. Risk: Secret Compromise

Mitigation:

- managed secret store;
- workload identity;
- least privilege;
- rotation;
- audit;
- no secrets in source/images/logs.

## 134. Risk: Cost Explosion

Mitigation:

- budgets;
- alerts;
- resource limits;
- environment schedules;
- object lifecycle;
- log retention;
- worker autoscaling;
- platform usage accounting.

## 135. Risk: Lab Network Compromise

Mitigation:

- Lab Agent boundary;
- mutual authentication;
- least privilege;
- network segmentation;
- per-lab identity;
- no direct Internet exposure of robot networks.

## 136. Open Questions

1. Which cloud provider will host the first production deployment?
2. Which region should host the initial production environment?
3. Which managed compute platform will be selected?
4. Will containers be used from the first deployment?
5. Which PostgreSQL managed service will be used?
6. Which object-storage service will be used?
7. Which queue service will be used?
8. Which secret manager will be used?
9. Which observability platform will be used?
10. Is a WAF required for the first production release?
11. What are the production RPO and RTO targets?
12. Is multi-region required in the first year?
13. Which labs require dedicated connectivity?
14. Will Lab Agents use mTLS, VPN, or another transport?
15. Should WebSocket traffic terminate at the same edge as REST?
16. What are initial API rate limits?
17. What are storage retention periods?
18. What is the initial expected artifact volume?
19. What is the initial expected video volume?
20. What cloud budget should trigger automated alerts?
21. Is Kubernetes required at any phase?
22. Which cloud capabilities are allowed despite provider lock-in?
23. What compliance requirements apply to customer data?
24. What level of tenant isolation is required for enterprise customers?

## 137. Phase Mapping

| Phase | Cloud Scope | Primary Outcome |
|---|---|---|
| Phase 0 | Local/cloud foundation | Reproducible environment |
| Phase 1 | Development cloud | Backend development |
| Phase 2 | Artifact infrastructure | Artifact storage/validation |
| Phase 3 | Control Plane deployment | Integrated RaaS backend |
| Phase 4 | Booking/commercial infrastructure | Production-like transactions |
| Phase 5 | Workers/lab connectivity | Remote execution |
| Phase 6 | Production lab connectivity | Physical robots |
| Phase 7 | Live/results infrastructure | Full execution platform |
| Phase 8 | Production hardening | Production RaaS |

## 138. Phase 0 — Foundation

Deliver:

- cloud project/account structure;
- IaC foundation;
- local development environment;
- basic network;
- basic compute;
- PostgreSQL development instance;
- object storage development bucket;
- queue;
- secrets;
- basic monitoring.

Acceptance:

- infrastructure can be recreated;
- Control Plane starts;
- database connects;
- storage works;
- queue works;
- secrets are not committed.

## 139. Phase 1 — Development Environment

Deliver:

- development VPC/VNet;
- API deployment;
- worker deployment;
- database;
- object storage;
- queue;
- secrets;
- CI deployment;
- basic observability.

Acceptance:

- development environment is automated;
- Studio can reach API;
- asynchronous work executes;
- artifacts can be stored.

## 140. Phase 2 — Artifact Infrastructure

Deliver:

- production-like object storage;
- signed upload flow;
- artifact validation workers;
- storage lifecycle;
- checksum/integrity handling.

Acceptance:

- `.krv` upload works;
- large artifacts bypass API payload path where appropriate;
- invalid artifacts are rejected;
- object access is private.

## 141. Phase 3 — Control Plane Infrastructure

Deliver:

- stable API deployment;
- WebSocket;
- PostgreSQL migrations;
- queue workers;
- monitoring;
- alerting foundation;
- staging environment.

Acceptance:

- end-to-end software workflow works;
- API is horizontally deployable;
- worker failure is recoverable;
- staging resembles production.

## 142. Phase 4 — Booking and Commercial Infrastructure

Deliver:

- reliable PostgreSQL transactions;
- credit transaction persistence;
- booking concurrency protection;
- audit;
- backup policy.

Acceptance:

- booking conflicts are prevented;
- credit operations are durable;
- audit history exists;
- backups are configured.

## 143. Phase 5 — Execution Infrastructure

Deliver:

- worker scaling;
- scheduler;
- Lab connectivity;
- secure Lab Agent channel;
- resource allocation;
- execution observability.

Acceptance:

- jobs can reach mock/real Lab Agents;
- duplicate jobs are prevented;
- worker scaling works;
- lab disconnect is handled.

## 144. Phase 6 — Physical Lab Infrastructure

Deliver:

- production Lab Agent connectivity;
- per-lab network boundary;
- production lab credentials;
- resource monitoring;
- lab health dashboards.

Acceptance:

- approved Lab Agents connect securely;
- unauthorized agents are rejected;
- physical execution is isolated by lab;
- lab outage does not affect unrelated labs.

## 145. Phase 7 — Live and Results Infrastructure

Deliver:

- high-volume telemetry path;
- result storage;
- video storage;
- WebSocket scaling;
- result processing;
- retention policies.

Acceptance:

- live state is delivered;
- result files are durable;
- video is accessible through authorized paths;
- telemetry does not overload transactional database.

## 146. Phase 8 — Production

Deliver:

- production network;
- production compute;
- production PostgreSQL;
- production storage;
- production queue;
- managed secrets;
- monitoring;
- alerting;
- backups;
- restore validation;
- disaster recovery;
- cost controls;
- operational runbooks;
- production deployment.

Acceptance:

- production deployment is reproducible;
- security review passes;
- backup restore passes;
- monitoring is operational;
- alerts are actionable;
- rollback is documented;
- disaster recovery is tested.

## 147. Full Acceptance Criteria Checklist

### Topology

- [ ] Public edge is defined.
- [ ] API compute is defined.
- [ ] Worker compute is defined.
- [ ] Database is private.
- [ ] Object storage is private by default.
- [ ] Queue is private.
- [ ] Secret store is restricted.
- [ ] Observability is centralized.
- [ ] Lab connectivity boundary is defined.

### Networking

- [ ] Production network is isolated.
- [ ] Public ingress is minimized.
- [ ] TLS is enforced.
- [ ] Database is not publicly accessible.
- [ ] Queue is not publicly accessible.
- [ ] Administrative access is restricted.
- [ ] Outbound access is controlled.
- [ ] Lab connectivity does not expose robots directly.

### Compute

- [ ] API is stateless.
- [ ] API can scale horizontally.
- [ ] Workers are separate from API workload.
- [ ] Worker scaling is queue-aware.
- [ ] Health checks exist.
- [ ] Graceful shutdown exists.
- [ ] Immutable deployment artifacts are used.

### Database

- [ ] Managed PostgreSQL is used.
- [ ] Database is private.
- [ ] Encryption at rest is enabled.
- [ ] Encryption in transit is enabled.
- [ ] Backups are configured.
- [ ] Restore is tested.
- [ ] Connection limits are controlled.
- [ ] HA strategy is defined.

### Object Storage

- [ ] Artifacts use object storage.
- [ ] Results use object storage where appropriate.
- [ ] Video uses object storage where appropriate.
- [ ] Public access is disabled.
- [ ] Signed access is used where appropriate.
- [ ] Lifecycle policies exist.
- [ ] Integrity metadata is recorded.

### Queue

- [ ] Durable queue is configured.
- [ ] Workers consume messages.
- [ ] Duplicate delivery is handled.
- [ ] Retry policy exists.
- [ ] Dead-letter queue exists.
- [ ] Queue depth is monitored.
- [ ] Queue is not business-state authority.

### Secrets

- [ ] Managed secret storage exists.
- [ ] Workload identity is used where possible.
- [ ] Secrets are not committed.
- [ ] Secrets are not logged.
- [ ] Rotation procedure exists.
- [ ] Access is least privilege.

### Observability

- [ ] Structured logs exist.
- [ ] Metrics exist.
- [ ] Distributed traces exist.
- [ ] Request IDs exist.
- [ ] Correlation IDs exist.
- [ ] Health checks exist.
- [ ] Dashboards exist.
- [ ] Alerts exist.
- [ ] Alert severity is defined.
- [ ] Runbooks exist.

### Environments

- [ ] Local environment exists.
- [ ] Development environment exists.
- [ ] Staging environment exists.
- [ ] Production environment exists.
- [ ] Production data is isolated.
- [ ] Credentials are isolated.
- [ ] Storage is isolated.
- [ ] Queue is isolated.
- [ ] Database is isolated.

### Infrastructure as Code

- [ ] Network is defined in IaC.
- [ ] Compute is defined in IaC.
- [ ] Database is defined in IaC.
- [ ] Storage is defined in IaC.
- [ ] Queue is defined in IaC.
- [ ] IAM is defined in IaC.
- [ ] Monitoring is defined in IaC.
- [ ] Alerts are defined in IaC.
- [ ] IaC state is protected.

### Deployment

- [ ] CI builds the application.
- [ ] Tests run in CI.
- [ ] Security scans run.
- [ ] IaC validation runs.
- [ ] Development deployment is automated.
- [ ] Staging deployment is controlled.
- [ ] Production deployment requires approval.
- [ ] Rollback is defined.
- [ ] Database migration compatibility is reviewed.

### Lab Connectivity

- [ ] Lab Agents have unique identities.
- [ ] Lab Agent authentication exists.
- [ ] Lab heartbeat exists.
- [ ] Lab capability reporting exists.
- [ ] Lab resources are tracked.
- [ ] Robot networks are not directly public.
- [ ] Lab connectivity is encrypted.
- [ ] Lab failures are observable.
- [ ] Lab reconnection is reconciled.

### Security

- [ ] Least privilege is enforced.
- [ ] Public exposure is minimized.
- [ ] Database is private.
- [ ] Object storage is private.
- [ ] Secrets are protected.
- [ ] Artifact integrity is verified.
- [ ] Tenant isolation is enforced by the backend.
- [ ] Administrative access is audited.
- [ ] Security events are monitored.

### Reliability

- [ ] API instance failure is tolerated.
- [ ] Worker failure is tolerated.
- [ ] Database failover is handled.
- [ ] Queue duplicates are tolerated.
- [ ] Storage failures are handled.
- [ ] Lab disconnection is handled.
- [ ] Deployment failure is recoverable.
- [ ] Disaster recovery is documented.
- [ ] RPO is defined.
- [ ] RTO is defined.

### Cost

- [ ] Cloud resources are tagged.
- [ ] Budgets exist.
- [ ] Cost alerts exist.
- [ ] Non-production resources can be scaled down.
- [ ] Object lifecycle policies exist.
- [ ] Log retention is controlled.
- [ ] Video retention is controlled.
- [ ] Telemetry retention is controlled.

### Provider Neutrality

- [ ] Database access is provider-neutral.
- [ ] Object storage is abstracted.
- [ ] Queue is abstracted.
- [ ] Secret store is abstracted.
- [ ] Observability is portable.
- [ ] Provider-specific code is isolated.
- [ ] Application modules do not import cloud SDKs directly.
- [ ] Deployment architecture can migrate providers.

### Phase Completion

- [ ] Phase 0 foundation is complete.
- [ ] Phase 1 development environment is complete.
- [ ] Phase 2 artifact infrastructure is complete.
- [ ] Phase 3 Control Plane infrastructure is complete.
- [ ] Phase 4 booking/commercial infrastructure is complete.
- [ ] Phase 5 execution infrastructure is complete.
- [ ] Phase 6 physical lab infrastructure is complete.
- [ ] Phase 7 live/results infrastructure is complete.
- [ ] Phase 8 production hardening is complete.

## 148. Final Cloud Architecture Baseline

The Kritva RaaS cloud architecture is intentionally simple at its foundation and
capable of scaling as the product grows.

The baseline topology is:

    Internet
       |
       v
    Public Edge
       |
       v
    Load Balancer
       |
       v
    Stateless Control Plane
       |
       +------------------+-------------------+
       |                  |                   |
       v                  v                   v
    PostgreSQL          Queue            Object Storage
       |                  |
       |                  v
       |               Workers
       |                  |
       |                  v
       |             Lab Connectivity
       |                  |
       |                  v
       |              Lab Agent
       |                  |
       |                  v
       |               Robot
       |
       +--> Audit / Business State

The authority model is:

    PostgreSQL
        = authoritative structured business state

    Object Storage
        = large-object storage

    Queue
        = asynchronous work transport

    Compute
        = stateless execution

    Secret Store
        = credential authority

    Observability
        = operational visibility

    Lab Agent
        = cloud-to-lab boundary

    Robot Runtime
        = real-time execution boundary

The architecture deliberately avoids putting real-time robot control into cloud
infrastructure.

The cloud schedules, authorizes, coordinates, observes, and records execution.

The robot executes locally.

The most important cloud invariant is therefore:

    CLOUD
      |
      | Control / Coordination
      v
    LAB AGENT
      |
      | Local Execution
      v
    ROBOT

and never:

    CLOUD
      |
      | Direct Motor Control
      X
    ROBOT

The cloud architecture also preserves the product's source-code protection model:

    Customer Source
          |
          | Local
          v
    Local Build
          |
          v
    Signed .krv
          |
          | Authorized Transfer
          v
    Cloud Object Storage
          |
          v
    Validated Remote Execution

This architecture provides the foundation for a production RaaS platform while keeping
the initial implementation operationally manageable.

The design can begin with a small managed cloud footprint and evolve through:

    Phase 0
      |
      v
    Development
      |
      v
    Staging
      |
      v
    Physical Labs
      |
      v
    Production
      |
      v
    Multi-Platform / Multi-Lab RaaS

without requiring the core application architecture to be rewritten.

The governing principles remain:

1. Managed services where they reduce operational burden.
2. Provider-neutral application interfaces.
3. Private infrastructure by default.
4. PostgreSQL as business-state authority.
5. Object storage for large data.
6. Queues for asynchronous work.
7. Stateless horizontally scalable compute.
8. Secure Lab Agent connectivity.
9. Strong environment isolation.
10. Infrastructure as code.
11. Observable production operations.
12. Tested backup and recovery.
13. Explicit cost controls.
14. Physical safety remains local to the robot.
15. Cloud architecture supports the product without becoming the robot itself.
