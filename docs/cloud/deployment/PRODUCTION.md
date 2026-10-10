# Kritva RaaS Production Environment Deployment

## 1. Document Control

| Item | Value |
|---|---|
| Document | Production Environment Deployment |
| Path | `docs/cloud/deployment/PRODUCTION.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Environment | Production |
| Purpose | Customer-facing RaaS operation |
| Architecture | Production Control Plane |
| Deployment | Immutable containerized workloads |
| Database | Managed PostgreSQL |
| Storage | Private object storage |
| Queue | Managed durable queue |
| Compute | Managed container platform |
| Availability Model | Multi-zone where practical |
| Region Model | Single primary region initially |
| Lab Boundary | Lab Agent |
| Physical Safety | Local to robot/lab |
| Data | Customer and operational data |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the production environment for Kritva RaaS.

Production is the authoritative customer-facing environment in which real
users, organizations, projects, artifacts, bookings, credits, Jobs, Runs,
results and robotic resources are operated.

Production must provide:

- high availability;
- controlled deployment;
- predictable scaling;
- strong security;
- tenant isolation;
- durable state;
- financial correctness;
- operational observability;
- controlled robot connectivity;
- recoverability;
- auditable change management;
- safe rollback;
- production release governance.

Production is not simply a larger Staging environment.

Production introduces real customer impact, financial state, proprietary
artifacts, real resource reservations and potentially physical robots.

## 3. Scope

This document covers:

- production topology;
- high availability;
- network architecture;
- compute;
- PostgreSQL;
- object storage;
- queue;
- secrets;
- IAM;
- deployment;
- blue/green deployment;
- canary deployment;
- rolling deployment;
- change management;
- release gates;
- scaling;
- capacity management;
- database migration;
- rollback;
- disaster recovery;
- backup;
- observability;
- incident response;
- compliance;
- access control;
- Lab Agent connectivity;
- physical safety boundaries;
- production acceptance.

## 4. Non-Goals

This document does not define:

- detailed application domain models;
- detailed REST endpoint schemas;
- robot firmware;
- robot mechanical safety design;
- payment-provider implementation;
- detailed cloud-provider-specific IaC;
- multi-region active/active deployment;
- physical emergency-stop implementation;
- customer-specific contractual SLAs.

Those concerns are defined by their respective architecture documents.

## 5. Production Principles

Production follows these principles:

1. Customer data is authoritative.
2. PostgreSQL is authoritative for structured business state.
3. Object storage holds large binary data.
4. Queue is transport, not authority.
5. REST is durable-state authority.
6. WebSocket is realtime transport.
7. Immutable application artifacts are promoted.
8. Production is never rebuilt manually.
9. Infrastructure is managed through IaC.
10. Production changes require controlled review.
11. Security is deny-by-default.
12. Least privilege is mandatory.
13. High availability applies to cloud control services.
14. Physical safety remains local.
15. Reconciliation is first-class.
16. Financial operations are strongly consistent.
17. Deployments must be reversible where technically possible.
18. Database changes must support controlled application rollout.
19. Observability is part of the production system.
20. Production incidents must preserve evidence.

# 6. Production Topology

The logical production topology is:

    Internet
       |
       v
    DNS
       |
       v
    CDN / Edge / WAF
       |
       v
    Load Balancer / API Gateway
       |
       +-------------------------+
       |                         |
       v                         v
    API Pool                WebSocket Pool
       |                         |
       +------------+------------+
                    |
             Private Network
                    |
       +------------+-------------+
       |            |             |
       v            v             v
    PostgreSQL    Queue      Object Storage
       |            |             |
       +------------+-------------+
                    |
             Worker / Scheduler
                    |
             Reconciliation
                    |
                    v
             Lab Connectivity
                    |
                    v
               Lab Agent
                    |
                    v
             Robot / Resource

## 7. High Availability Objective

Production must avoid unnecessary single points of failure.

High availability applies to:

- edge;
- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- database;
- queue;
- object storage;
- secrets;
- observability.

Physical robots are a separate availability domain.

A cloud service failure must not be interpreted as a physical emergency-stop
command.

## 8. Availability Zones

Where supported by the selected provider, production workloads should span
multiple availability zones.

Preferred model:

    Zone A              Zone B              Zone C
      |                   |                   |
    API                 API                 API
    Worker              Worker              Worker
    WS                  WS                  WS
      \                   |                   /
       +---------- Load Balancer ------------+

Stateful managed services should use provider-supported HA configurations.

## 9. Single Region Strategy

Production initially uses one primary region.

This is deliberate.

The first objective is reliable operation within one region before introducing
the complexity of multi-region consistency, failover and operational
coordination.

The architecture remains multi-region-ready at logical boundaries.

## 10. Regional Failure

A complete regional failure is handled through Disaster Recovery.

The initial model is:

    Primary Region
         |
    Production
         |
    Backup / Replication
         |
    DR Strategy
         |
    Secondary Region
    or Provider Recovery

Active-active multi-region is not an initial requirement.

## 11. Edge Layer

The edge layer provides:

- DNS;
- TLS termination;
- WAF;
- request filtering;
- rate limiting;
- load balancing;
- DDoS protection where available.

Only required public interfaces should be exposed.

## 12. Public Endpoints

Expected public endpoints include:

- Web application;
- REST API;
- WebSocket;
- authentication endpoints;
- controlled artifact upload/download paths;
- controlled result download paths.

PostgreSQL, queue, internal workers and robot networks must not be publicly
accessible.

## 13. Network Segmentation

Production should use logical network zones:

| Zone | Purpose |
|---|---|
| Edge | Public ingress |
| Application | API/WebSocket |
| Worker | Async processing |
| Data | PostgreSQL |
| Private Services | Queue/storage/secrets |
| Management | Controlled operations |
| Lab Connectivity | Cloud-to-lab boundary |

Traffic between zones must be explicitly permitted.

## 14. Firewall Model

The baseline policy is:

    Internet -> Edge                    ALLOW
    Edge -> API                         ALLOW
    Edge -> WebSocket                   ALLOW
    API -> PostgreSQL                   ALLOW
    API -> Queue                        ALLOW
    API -> Object Storage               ALLOW
    Worker -> PostgreSQL                ALLOW
    Worker -> Queue                     ALLOW
    Worker -> Object Storage             ALLOW
    Agent -> Cloud Gateway               ALLOW
    Internet -> PostgreSQL              DENY
    Internet -> Queue                   DENY
    Internet -> Robot                   DENY
    Internet -> Internal Workers        DENY

## 15. Cloud-to-Lab Connectivity

The preferred connection is outbound from the Lab Agent.

    Lab Network
        |
        v
    Lab Agent
        |
    Secure Outbound Connection
        |
        v
    Cloud Lab Gateway / Control Plane

The robot should not require direct inbound Internet connectivity.

## 16. Lab Agent Identity

Every production Lab Agent must have:

- unique identity;
- credential or certificate;
- registered lab;
- registered capabilities;
- registered resources;
- health status;
- heartbeat;
- software version;
- authorization policy.

Revoked Agents must lose access.

## 17. Physical Safety Boundary

The cloud is not the physical safety authority.

The production architecture preserves:

    Cloud
      |
    Job Control
      |
    Lab Agent
      |
    Robot Runtime
      |
    Local Safety Controller
      |
    Physical E-Stop

Loss of cloud connectivity must not disable the physical safety system.

## 18. Compute Architecture

Production compute consists of:

- API workloads;
- WebSocket workloads;
- artifact workers;
- Job workers;
- result workers;
- notification workers;
- scheduler;
- reconciliation workers;
- migration jobs;
- administrative jobs.

Workloads are containerized.

## 19. Stateless Application Model

API and WebSocket application instances should remain stateless where practical.

Durable state belongs in:

- PostgreSQL;
- object storage;
- durable queue;
- appropriate external services.

In-memory state must not be required for recovery.

## 20. API High Availability

API instances should run with:

- multiple replicas;
- readiness probes;
- liveness probes;
- startup probes where required;
- graceful shutdown;
- topology spread;
- anti-affinity where supported;
- controlled autoscaling.

A single API instance failure must not cause customer-wide outage.

## 21. WebSocket High Availability

WebSocket instances should support:

- multiple replicas;
- authenticated connections;
- subscription reconstruction;
- reconnect;
- replay where supported;
- REST reconciliation.

WebSocket connection loss must not imply loss of durable Job or Run state.

## 22. Worker High Availability

Workers should run with multiple instances where workload justifies it.

Workers must be:

- idempotent;
- retry-aware;
- bounded;
- observable;
- safe under duplicate queue delivery.

## 23. Scheduler High Availability

The scheduler must avoid duplicate allocation.

Preferred mechanisms include:

- leader election;
- distributed locking;
- transactional database coordination;
- equivalent provider-managed coordination.

Only one logical scheduling decision may allocate the same exclusive resource.

## 24. Reconciliation High Availability

Reconciliation must run independently of normal request processing.

It should detect:

- stale Jobs;
- stale Runs;
- stale allocations;
- orphan artifacts;
- missing results;
- Lab Agent disconnects;
- credit mismatches;
- object/database mismatches.

## 25. PostgreSQL Production

PostgreSQL is the authoritative relational state store.

It stores:

- identity references;
- organizations;
- projects;
- platforms;
- artifacts metadata;
- bookings;
- credits;
- billing references;
- Jobs;
- Runs;
- Labs;
- resources;
- results metadata;
- audit records;
- idempotency records.

## 26. PostgreSQL HA

Production PostgreSQL should use a managed HA configuration where available.

Expected capabilities:

- automated failover;
- backups;
- point-in-time recovery;
- encryption;
- monitoring;
- controlled maintenance.

Application connection pools must tolerate failover.

## 27. Database Connection Management

The deployment must enforce a connection budget.

The fundamental constraint is:

    API Replicas * API Connections
      +
    Worker Replicas * Worker Connections
      <
    Safe PostgreSQL Connection Capacity

Connection pools must be bounded.

## 28. Database Transactions

Application services own transaction boundaries.

Transactions should be:

- short;
- explicit;
- bounded;
- isolated appropriately.

External service calls must not normally occur while holding database
transactions.

## 29. Financial State

Credit operations require strong consistency.

Production must preserve:

- immutable ledger;
- balanced transactions;
- atomic reservations;
- idempotent consumption;
- explicit refunds;
- reconciliation.

No silent credit deletion is permitted.

## 30. Booking Integrity

Production booking must prevent overbooking.

Conflict enforcement should use transactional database mechanisms.

Availability queries are advisory.

The confirmed booking transaction is authoritative.

## 31. Object Storage

Production object storage holds:

- `.krv` artifacts;
- result files;
- logs;
- video;
- telemetry;
- reports;
- backups where appropriate.

Storage must be private by default.

## 32. Artifact Storage

Accepted artifacts are immutable.

Identity includes:

- artifact ID;
- content digest.

The baseline digest algorithm is SHA-256.

Production artifacts must pass:

- manifest validation;
- checksum validation;
- signature verification;
- compatibility validation;
- policy validation.

## 33. Controlled File Access

Large files are not embedded in protocol envelopes.

Access uses short-lived, scoped authorization.

Examples:

- signed upload URL;
- signed download URL;
- controlled proxy.

Authorization must be checked before issuing access.

## 34. Durable Queue

Production queue handles asynchronous work.

Typical workloads:

- artifact validation;
- Job processing;
- result processing;
- notifications;
- reconciliation.

The queue does not own business state.

## 35. Queue Failure Model

If the queue becomes unavailable:

- durable state remains in PostgreSQL;
- new async operations may be rejected or delayed;
- existing durable state remains recoverable;
- reconciliation resumes processing when queue availability returns.

## 36. Secrets Management

Secrets must be stored in the managed secret system.

Examples:

- DB credentials;
- API secrets;
- identity secrets;
- signing keys;
- Agent credentials;
- provider credentials.

Secrets must never be committed to Git.

## 37. Key Management

Cryptographic keys should use managed KMS/HSM capabilities where available.

Key access must be:

- identity-bound;
- least privilege;
- audited;
- rotated according to policy.

Artifact signing keys require stronger controls than ordinary configuration
secrets.

# 38. Production Deployment Strategy

Production supports:

- rolling deployment;
- blue/green deployment;
- canary deployment.

The selected strategy depends on release risk.

Default principle:

> Use the least disruptive deployment strategy that provides sufficient
> confidence for the release risk.

## 39. Immutable Release Artifact

Production deployment must use an immutable artifact identified by:

- Git commit;
- version;
- container image digest;
- SBOM/provenance metadata.

Production must never rebuild the image from source during deployment.

## 40. Rolling Deployment

Rolling deployment is appropriate for:

- low-risk application changes;
- backward-compatible changes;
- routine patch releases.

Requirements:

- readiness probes;
- graceful shutdown;
- compatible database schema;
- bounded rollout;
- automatic health evaluation.

## 41. Blue/Green Deployment

Blue/green is appropriate for:

- significant application changes;
- major UI/API changes;
- releases requiring rapid application rollback;
- high-risk but operationally reversible changes.

Model:

    Load Balancer
         |
       Switch
      /      \
    BLUE     GREEN
   Current   New
      |        |
      +--- DB -+

The database must remain compatible with both application versions during
transition.

## 42. Blue/Green Promotion

Process:

    Deploy GREEN
        |
    Health Check
        |
    Smoke Test
        |
    Synthetic E2E
        |
    Optional Canary Traffic
        |
    Switch Traffic
        |
    Monitor
        |
    Retain BLUE
        |
    Finalize

BLUE must remain available for a defined rollback window.

## 43. Canary Deployment

Canary is appropriate for:

- high-risk releases;
- performance-sensitive changes;
- infrastructure changes;
- changes affecting critical execution workflows.

Traffic is gradually increased.

Example:

    1% -> 5% -> 10% -> 25% -> 50% -> 100%

The exact progression is configurable.

## 44. Canary Signals

Promotion should evaluate:

- error rate;
- latency;
- HTTP status distribution;
- application error codes;
- Job failures;
- Run failures;
- queue backlog;
- database errors;
- resource saturation;
- WebSocket disconnects.

Robot execution metrics should also be considered when the release affects
execution paths.

## 45. Canary Abort

Canary must automatically or operationally stop if:

- error budget is exceeded;
- critical error rate increases;
- data integrity issue occurs;
- Job/Run failure rate increases materially;
- database health degrades;
- security issue is detected;
- physical safety concern is identified.

## 46. Deployment Strategy Matrix

| Change | Preferred Strategy |
|---|---|
| Routine API patch | Rolling |
| Routine worker patch | Rolling |
| Major API change | Blue/Green |
| High-risk runtime change | Canary |
| Database migration | Expand/Contract |
| Security emergency | Controlled emergency deployment |
| Infrastructure change | Canary/blue-green where supported |
| WebSocket protocol change | Compatibility + controlled rollout |

## 47. Deployment Health Gates

Every deployment must verify:

- startup;
- readiness;
- database compatibility;
- queue connectivity;
- object storage connectivity;
- secrets access;
- health endpoints;
- metrics;
- logs;
- traces.

## 48. Change Management

Production changes are classified as:

- standard;
- normal;
- emergency.

Standard changes are pre-approved low-risk repeatable changes.

Normal changes require review and approval.

Emergency changes are permitted only to address urgent:

- security;
- availability;
- data integrity;
- safety;
- critical customer impact.

## 49. Change Record

Every production change must record:

- change ID;
- requester;
- approver;
- reason;
- affected components;
- release version;
- image digest;
- migration;
- risk;
- test evidence;
- deployment time;
- rollback plan;
- outcome.

## 50. Change Freeze

A production freeze may be declared for:

- major customer events;
- critical platform operations;
- infrastructure migration;
- incident response;
- financial reconciliation;
- safety-critical periods.

Only emergency changes bypass the freeze.

## 51. Release Gates

Production release gates are:

    Code Review
        |
    CI Tests
        |
    Security Scan
        |
    Development
        |
    Staging
        |
    Performance
        |
    Release Approval
        |
    Production Deployment
        |
    Canary / Blue-Green
        |
    Production Validation

## 52. Required Release Evidence

A release must include:

- test results;
- Staging acceptance;
- security results;
- performance results;
- migration validation;
- release notes;
- image digest;
- SBOM/provenance where required;
- rollback plan.

## 53. PRI-0 Promotion Rules

Production promotion is blocked by:

- unresolved PRI-0 issue;
- critical security vulnerability;
- data corruption;
- credit accounting failure;
- booking integrity failure;
- broken authentication;
- tenant isolation failure;
- unsafe robot execution;
- failed mandatory migration;
- failed recovery validation.

## 54. PRI-1 Promotion Rules

PRI-1 issues normally block promotion when they affect:

- customer execution;
- financial state;
- security;
- reliability;
- core API behavior;
- production operations.

Exceptions require explicit approval and documented mitigation.

## 55. Production Access Control

Production access follows least privilege.

No shared administrative accounts should be used.

Privileged access requires:

- individual identity;
- MFA where available;
- role-based authorization;
- audit logging;
- time-bounded elevation where possible.

## 56. Human Access Tiers

| Tier | Access |
|---|---|
| Customer | Own tenant resources |
| Support | Approved support functions |
| Developer | Minimal operational diagnostics |
| SRE | Production operations |
| DBA | Database administration |
| Security | Security systems |
| Release Manager | Deployment control |
| Administrator | Exceptional elevated access |

## 57. Production Database Access

Direct production database access should be exceptional.

Normal application operation uses repositories/application services.

Administrative database access requires:

- approved reason;
- identity;
- audit;
- least privilege;
- controlled tooling.

## 58. Production Shell Access

Direct shell access to application hosts should be minimized.

Arbitrary remote shell execution is prohibited as a normal product mechanism.

Operational access should use approved administrative mechanisms.

## 59. Customer Tenant Isolation

Every request must be authorized against:

- authenticated principal;
- organization membership;
- role;
- resource ownership;
- policy.

Client-supplied organization IDs are not trusted as authorization authority.

## 60. Object Authorization

Artifact and result access must validate:

- authenticated principal;
- organization;
- project;
- resource ownership;
- artifact/result relationship.

A valid object URL must not grant cross-tenant access.

## 61. Audit Logging

Production must record security-sensitive and business-critical actions.

Examples:

- login;
- role change;
- organization membership;
- artifact acceptance/revocation;
- booking;
- credit adjustment;
- refund;
- Job control;
- administrative access;
- configuration changes;
- production deployment.

## 62. Audit Integrity

Audit records should be append-oriented.

Audit data must not be casually deleted or modified.

Retention must satisfy operational and applicable compliance requirements.

## 63. Compliance Posture

Production must maintain a documented security and compliance posture.

The initial architecture should support:

- access control;
- auditability;
- encryption;
- data retention;
- incident response;
- vulnerability management;
- backup/recovery;
- change management;
- least privilege.

Specific certifications or regulatory frameworks remain dependent on product
market, customer requirements and legal review.

## 64. Data Classification

Production data should be classified at minimum as:

| Class | Example |
|---|---|
| Public | Public platform metadata |
| Internal | Operational configuration |
| Confidential | Customer project data |
| Restricted | Credentials, secrets, payment/security data |

Restricted information requires strongest controls.

## 65. Encryption

Production requires:

- TLS for network communication;
- encryption at rest;
- managed key management where available;
- encrypted database backups;
- protected object storage.

## 66. Vulnerability Management

Production dependencies and images must be scanned.

Security lifecycle:

    Dependency
       |
    Scan
       |
    Assess
       |
    Patch
       |
    Test
       |
    Release
       |
    Monitor

Critical vulnerabilities require defined remediation timelines.

## 67. Container Security

Production containers should:

- run non-root where possible;
- avoid privileged mode;
- avoid host mounts;
- use minimal images;
- have bounded resources;
- use signed/trusted images;
- be continuously scanned.

## 68. Scaling Model

Production scaling occurs at multiple layers:

- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- database;
- object storage;
- queue.

## 69. API Autoscaling

API scaling may use:

- CPU;
- memory;
- request rate;
- latency;
- concurrency.

Autoscaling must include:

- minimum replicas;
- maximum replicas;
- cooldown;
- scale-up threshold;
- scale-down threshold.

## 70. Worker Autoscaling

Workers may scale according to:

- queue depth;
- message age;
- processing rate;
- CPU;
- memory.

Different worker classes may scale independently.

## 71. Scheduler Scaling

Scheduler scaling must be conservative.

Scaling must never produce duplicate resource allocation.

Coordination is more important than raw throughput.

## 72. Reconciliation Scaling

Reconciliation should:

- process incrementally;
- use bounded batches;
- back off;
- partition large workloads;
- avoid overwhelming the database.

## 73. Database Scaling

Initial strategy:

- vertically scale primary PostgreSQL;
- optimize queries;
- add indexes;
- tune connection pools;
- use read replicas only where justified.

Read replicas must not become authoritative for transactional decisions.

## 74. Object Storage Scaling

Object storage is expected to scale independently.

Production must monitor:

- object count;
- bytes;
- request rate;
- egress;
- lifecycle;
- failed requests.

## 75. Queue Scaling

Queue capacity should be managed through:

- worker capacity;
- concurrency limits;
- backpressure;
- queue partitioning where required.

## 76. Capacity Planning

Capacity planning should track:

- users;
- organizations;
- concurrent Jobs;
- concurrent Runs;
- robot resources;
- artifact volume;
- result volume;
- telemetry volume;
- video volume;
- API traffic.

## 77. Resource Quotas

Production should enforce appropriate limits:

- artifact size;
- upload rate;
- API rate;
- concurrent Jobs;
- concurrent Runs;
- booking duration;
- storage;
- telemetry;
- organization usage.

## 78. Backpressure

When downstream capacity is exhausted:

- queue work;
- reject excess work safely;
- return explicit errors;
- preserve durable state.

The system must not overload PostgreSQL or physical resources to preserve
short-term throughput.

## 79. Production Observability

Production requires:

- logs;
- metrics;
- traces;
- domain events;
- Lab telemetry;
- alerts;
- dashboards.

OpenTelemetry-compatible instrumentation is the baseline.

## 80. Correlation

Production requests should correlate:

- request ID;
- trace ID;
- span ID;
- operation ID;
- organization ID;
- project ID;
- artifact ID;
- booking ID;
- Job ID;
- Run ID;
- lab ID;
- Agent ID;
- resource ID.

Sensitive values must not be placed in traces.

## 81. Production SLO Baseline

Initial targets:

| Service | Target |
|---|---:|
| API availability | 99.9% |
| API success | 99.9% |
| Normal API P95 | <500 ms |
| Job control availability | 99.9% |
| Artifact upload availability | 99.5% |
| Result availability | 99.5% |
| Control Plane WebSocket | 99.5% |
| Lab Agent cloud connectivity | 99.0% |

Robot physical availability is measured separately.

## 82. Error Budgets

SLO error budgets should guide:

- release frequency;
- risky changes;
- reliability investment;
- incident response.

If the error budget is exhausted, high-risk releases should be restricted until
reliability improves.

## 83. Production Alerts

Alerts should include:

- API availability;
- elevated error rate;
- latency;
- DB saturation;
- queue backlog;
- worker failures;
- storage failures;
- authentication anomalies;
- credit inconsistencies;
- booking conflicts;
- Lab Agent outages;
- backup failures;
- security events.

## 84. Production Incident Response

Incident lifecycle:

    Detect
      |
    Triage
      |
    Contain
      |
    Recover
      |
    Validate
      |
    Communicate
      |
    Post-Incident Review

Severity classification should determine response urgency.

## 85. Robot Incident Boundary

A cloud incident must not be assumed to stop a robot safely.

If physical safety is at risk:

- local operator controls the robot;
- local E-stop is used;
- Lab Agent enters safe local state;
- cloud incident response proceeds independently.

## 86. Production Rollback

Application rollback follows:

    Detect Failure
        |
    Stop Rollout
        |
    Preserve Evidence
        |
    Select Last Known Good
        |
    Roll Back / Switch Traffic
        |
    Validate
        |
    Monitor
        |
    Close or Escalate

## 87. Canary Rollback

If canary fails:

    Canary
      |
    Abort
      |
    Route Traffic Away
      |
    Keep Stable Version
      |
    Investigate
      |
    Correct
      |
    Re-test in Staging

## 88. Blue/Green Rollback

If Green fails after traffic switch:

    GREEN
      |
    Failure
      |
    Switch -> BLUE
      |
    Validate BLUE
      |
    Preserve GREEN Evidence
      |
    Incident Review

## 89. Database Rollback

Database rollback requires special treatment.

Application rollback must not assume that the database can simply be reverted.

Preferred strategy:

- backward-compatible migrations;
- expand/contract;
- forward fix;
- restore only when necessary.

## 90. Queue Rollback

Deployments must preserve worker message compatibility.

If an older worker receives a newer message, protocol compatibility must define
whether processing is safe.

Otherwise deployment must use coordinated worker rollout.

## 91. Artifact Rollback

Accepted artifacts are immutable.

Rolling back application software does not mutate existing artifacts.

Artifact revocation remains an explicit security operation.

## 92. Active Job Behavior During Deployment

Production deployment must define behavior for:

- queued Jobs;
- validating Jobs;
- allocating Jobs;
- deploying Jobs;
- running Jobs;
- stopping Jobs.

Running Jobs should not be interrupted by ordinary API deployment unless
required by safety or compatibility.

## 93. Worker Deployment During Jobs

Workers must use durable state.

A worker restart must not lose:

- Job;
- Run;
- credit reservation;
- resource allocation;
- result state.

Recovery must use queue redelivery and reconciliation.

## 94. Backup Strategy

Production backups must include:

- PostgreSQL backups;
- point-in-time recovery;
- required object metadata;
- critical configuration;
- IaC source;
- operational configuration.

Secrets themselves should be backed up only through the secret-management
provider's supported secure mechanisms.

## 95. Restore Validation

Backups are not considered valid merely because they completed.

Restore testing must verify:

- database restoration;
- schema consistency;
- application compatibility;
- critical data integrity;
- object references;
- operational recovery.

## 96. Disaster Recovery

DR must address:

- region failure;
- database failure;
- object storage failure;
- queue failure;
- credential compromise;
- accidental deletion;
- major deployment failure.

## 97. RPO/RTO

Final RPO and RTO values remain product-level operational decisions.

The architecture must support defining:

- database RPO;
- database RTO;
- artifact RPO;
- result RPO;
- control-plane RTO;
- Lab Agent recovery objectives.

## 98. DR Robot Reconciliation

After cloud recovery:

    Cloud Recovery
         |
    Restore Control Plane
         |
    Restore Durable State
         |
    Reconnect Lab Agents
         |
    Query Actual Resource State
         |
    Reconcile Jobs/Runs
         |
    Reconcile Allocations
         |
    Reconcile Credits
         |
    Resume Normal Operation

Cloud state must not blindly assume robot state.

## 99. Production Maintenance

Maintenance should use:

- provider-supported HA;
- controlled windows;
- compatibility;
- monitoring;
- rollback/recovery planning.

Maintenance affecting physical robots must be coordinated with Lab operations.

## 100. Production Infrastructure as Code

Production infrastructure must be managed through reviewed IaC.

Manual changes should be:

- exceptional;
- documented;
- audited;
- reconciled back into IaC.

Configuration drift must be detected.

## 101. Infrastructure Change Workflow

    IaC Change
       |
    Review
       |
    CI Validation
       |
    Staging
       |
    Security Review
       |
    Production Approval
       |
    Apply
       |
    Verify
       |
    Record

## 102. Configuration Management

Production configuration should be:

- versioned;
- environment-specific;
- validated;
- auditable.

Secrets are referenced, not embedded.

## 103. Production Feature Flags

Feature flags must support:

- controlled rollout;
- emergency disablement;
- audit;
- tenant/platform scoping where appropriate.

Critical execution features must fail safely if a flag is unavailable.

## 104. Customer Impact Controls

High-risk changes should be:

- scheduled;
- announced where necessary;
- deployed incrementally;
- monitored.

Customer-visible maintenance should use appropriate communication channels.

## 105. Production Commercial Integrity

Production must protect:

- subscriptions;
- payments;
- credit issuance;
- credit reservation;
- credit consumption;
- refunds;
- invoices.

Money and credits remain separate authorities.

## 106. Billing Boundary

Billing owns monetary transactions.

Credit Service owns usage entitlement.

Booking owns reservations.

Job/Run owns execution.

Lab owns resources.

No component may silently mutate another component's authoritative state.

## 107. Production Reconciliation

Scheduled reconciliation should compare:

- DB and object storage;
- Job and Run state;
- Booking and allocation;
- wallet and ledger;
- Billing and credit issuance;
- Lab Agent and resource state.

Reconciliation discrepancies must be visible.

## 108. Production Cost Governance

Production cost monitoring must cover:

- compute;
- database;
- storage;
- queue;
- network;
- telemetry;
- video;
- observability;
- backups.

Costs should be attributed to:

- environment;
- organization where appropriate;
- platform;
- workload;
- resource.

## 109. Production Compliance Evidence

Maintain evidence for:

- access reviews;
- deployments;
- security scans;
- vulnerability remediation;
- backups;
- restore tests;
- incidents;
- configuration changes;
- audit logs;
- data retention;
- DR tests.

## 110. Access Review

Privileged production access should be periodically reviewed.

Review should identify:

- unused accounts;
- excessive privileges;
- departed users;
- stale service identities;
- emergency access;
- role changes.

Access must be revoked promptly when no longer required.

## 111. Production Security Review

Security review should cover:

- IAM;
- network;
- database;
- storage;
- secrets;
- containers;
- dependencies;
- APIs;
- WebSockets;
- Lab Agent;
- artifacts;
- tenant isolation.

## 112. Production Acceptance Checklist

### Infrastructure

- [ ] Production account/project is isolated.
- [ ] Production network is provisioned.
- [ ] Edge/WAF is configured.
- [ ] Private application network is configured.
- [ ] Database is private.
- [ ] Queue is private.
- [ ] Object storage is private.
- [ ] Secrets are managed securely.
- [ ] HA is enabled where applicable.
- [ ] IaC is authoritative.

### High Availability

- [ ] API has multiple replicas.
- [ ] WebSocket has multiple replicas.
- [ ] Workers have appropriate redundancy.
- [ ] Scheduler coordination prevents duplicate allocation.
- [ ] Reconciliation is available.
- [ ] PostgreSQL HA is configured.
- [ ] Load balancing is validated.
- [ ] Availability-zone distribution is validated.

### Deployment

- [ ] Immutable image is used.
- [ ] Image digest is recorded.
- [ ] Release candidate passed Staging.
- [ ] Release gates passed.
- [ ] Deployment strategy selected.
- [ ] Health checks are active.
- [ ] Rollback plan is documented.
- [ ] Database migration plan is approved.
- [ ] Deployment evidence is retained.

### Blue/Green and Canary

- [ ] Blue/green path is tested where required.
- [ ] Canary path is tested where required.
- [ ] Traffic switching is controlled.
- [ ] Canary metrics are defined.
- [ ] Abort thresholds are defined.
- [ ] Rollback is operationally tested.
- [ ] Stable version can be retained during rollback.

### Change Management

- [ ] Change has an identifier.
- [ ] Change has an owner.
- [ ] Change has an approver.
- [ ] Risk is documented.
- [ ] Test evidence is attached.
- [ ] Rollback is defined.
- [ ] Change is recorded.
- [ ] Emergency change process exists.

### Access Control

- [ ] Individual identities are used.
- [ ] MFA is enabled where available.
- [ ] Least privilege is enforced.
- [ ] Privileged access is audited.
- [ ] Database access is restricted.
- [ ] Shell access is restricted.
- [ ] Customer tenant isolation passes.
- [ ] Object authorization passes.
- [ ] Access review process exists.

### Security

- [ ] TLS is enabled.
- [ ] Encryption at rest is enabled.
- [ ] Secrets are protected.
- [ ] Signing keys are protected.
- [ ] Container scans pass.
- [ ] Dependency scans pass.
- [ ] IaC scans pass.
- [ ] Secret scans pass.
- [ ] Critical vulnerabilities are resolved or formally accepted.
- [ ] Security audit logging works.

### Database

- [ ] PostgreSQL HA is enabled.
- [ ] Backups are configured.
- [ ] PITR is configured where supported.
- [ ] Connection limits are defined.
- [ ] Migration process is tested.
- [ ] Booking conflicts are protected.
- [ ] Credit transactions are strongly consistent.
- [ ] Ledger reconciliation works.
- [ ] Database monitoring works.

### Storage

- [ ] Artifact storage is private.
- [ ] Result storage is private.
- [ ] Signed access is scoped.
- [ ] Artifact digests are validated.
- [ ] Accepted artifacts are immutable.
- [ ] Lifecycle policies are active.
- [ ] Storage reconciliation is active.

### Queue and Workers

- [ ] Queue is durable.
- [ ] Workers are idempotent.
- [ ] Retry policies are defined.
- [ ] Dead-letter handling exists.
- [ ] Queue backlog is monitored.
- [ ] Worker scaling is configured.
- [ ] Worker restart recovery is validated.

### Lab

- [ ] Lab Agents have unique identity.
- [ ] Lab Agent authentication works.
- [ ] Heartbeats work.
- [ ] Capabilities are registered.
- [ ] Resources are registered.
- [ ] Cloud-to-lab connectivity is secure.
- [ ] Agent disconnect is recoverable.
- [ ] Resource reconciliation works.
- [ ] Physical E-stop remains local.
- [ ] Physical safety review is separate.

### Observability

- [ ] Logs are structured.
- [ ] Metrics are available.
- [ ] Traces are available.
- [ ] Request correlation works.
- [ ] Job/Run correlation works.
- [ ] Dashboards exist.
- [ ] Alerts exist.
- [ ] SLO monitoring exists.
- [ ] Error budgets are tracked.
- [ ] Observability itself is monitored.

### Scaling

- [ ] API autoscaling is configured.
- [ ] Worker autoscaling is configured.
- [ ] Database capacity is validated.
- [ ] Queue capacity is validated.
- [ ] Storage capacity is validated.
- [ ] Resource quotas are configured.
- [ ] Backpressure is tested.
- [ ] Capacity planning is documented.

### Backup and DR

- [ ] Database backup is enabled.
- [ ] PITR is validated.
- [ ] Restore test is completed.
- [ ] Object recovery is tested.
- [ ] DR procedure is documented.
- [ ] RPO is defined.
- [ ] RTO is defined.
- [ ] Lab Agent reconciliation after DR is tested.
- [ ] Job/Run reconciliation after DR is tested.

### Compliance

- [ ] Data classification is defined.
- [ ] Retention policy is defined.
- [ ] Access reviews are performed.
- [ ] Audit logging is retained.
- [ ] Security evidence is retained.
- [ ] Change evidence is retained.
- [ ] Incident evidence is retained.
- [ ] Backup/restore evidence is retained.
- [ ] Applicable regulatory requirements are reviewed.
- [ ] Customer contractual requirements are reviewed.

# 113. Phase Mapping

| Phase | Production Objective |
|---|---|
| Phase 0 | Define production architecture and controls |
| Phase 1 | Deploy Control Plane foundation |
| Phase 2 | Enable resources and artifacts |
| Phase 3 | Enable durable asynchronous execution |
| Phase 4 | Enable commercial operations |
| Phase 5 | Enable remote execution |
| Phase 6 | Enable production Lab connectivity |
| Phase 7 | Enable production realtime/results |
| Phase 8 | Harden production |

## 114. Phase 0

Production architecture establishes:

- network;
- IAM;
- HA strategy;
- environment boundaries;
- IaC;
- security baseline.

Acceptance:

- [ ] architecture reviewed;
- [ ] production isolation validated;
- [ ] HA strategy approved.

## 115. Phase 1

Deploy:

- API;
- WebSocket;
- PostgreSQL;
- secrets;
- storage;
- observability.

Acceptance:

- [ ] Control Plane is operational.
- [ ] database migration is controlled.
- [ ] smoke tests pass.

## 116. Phase 2

Enable:

- platforms;
- resources;
- artifact validation;
- object storage.

Acceptance:

- [ ] artifact path is production-ready.
- [ ] resource inventory is authoritative.

## 117. Phase 3

Enable:

- queue;
- workers;
- scheduler;
- reconciliation.

Acceptance:

- [ ] asynchronous Jobs are durable.
- [ ] recovery is validated.

## 118. Phase 4

Enable:

- credit plans;
- wallets;
- ledger;
- booking;
- Billing integration.

Acceptance:

- [ ] financial invariants pass.
- [ ] booking integrity passes.

## 119. Phase 5

Enable:

- production remote execution.

Acceptance:

- [ ] Job/Run lifecycle is validated.
- [ ] artifact deployment is controlled.
- [ ] resource allocation is safe.

## 120. Phase 6

Enable:

- production Lab Agent connectivity;
- approved production robotic resources.

Acceptance:

- [ ] Agent authentication passes.
- [ ] resource reconciliation passes.
- [ ] safety boundary is verified.

## 121. Phase 7

Enable:

- realtime telemetry;
- logs;
- video;
- results;
- experiment workflows.

Acceptance:

- [ ] realtime path is observable.
- [ ] durable results are available.
- [ ] reconnect/reconciliation works.

## 122. Phase 8

Complete:

- HA;
- scaling;
- security hardening;
- DR;
- compliance;
- operational maturity.

Acceptance:

- [ ] production readiness review passes.
- [ ] release gates are operational.
- [ ] incident and recovery procedures are tested.

# 123. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Region outage | Critical | DR strategy |
| Database failure | Critical | Managed HA/PITR |
| Bad deployment | Critical | Canary/blue-green |
| Migration incompatibility | Critical | Expand/contract |
| Credit corruption | Critical | Immutable ledger |
| Booking race | Critical | DB constraints |
| Tenant data leak | Critical | Server-side authorization |
| Artifact compromise | Critical | Signature/digest |
| Lab Agent compromise | Critical | Identity/revocation |
| Physical safety issue | Critical | Local safety authority |
| Queue outage | High | Durable state/recovery |
| Storage outage | High | Reconciliation |
| Scaling failure | High | Capacity/autoscaling |
| Observability failure | High | Monitor observability |
| Excess cost | Medium | Budgets/cost controls |
| Privileged access misuse | High | IAM/audit/reviews |
| Configuration drift | High | IaC |
| Dependency vulnerability | High | Continuous scanning |

# 124. Open Questions

1. Final production cloud provider.
2. Final primary region.
3. Final container platform.
4. Final IaC tooling.
5. Final PostgreSQL tier.
6. Final production replica counts.
7. Final HA topology.
8. Final canary tooling.
9. Final blue/green implementation.
10. Final traffic-management platform.
11. Final RPO.
12. Final RTO.
13. Final DR region.
14. Final compliance framework requirements.
15. Final data residency requirements.
16. Final access-review frequency.
17. Final privileged-access mechanism.
18. Final production Lab Agent gateway.
19. Final WebRTC/media infrastructure.
20. Final production physical lab topology.
21. Final customer SLA targets.
22. Final cost budgets.
23. Final incident severity definitions.
24. Final release approval authority.
25. Final emergency change authority.

# 125. Final Production Invariants

Production must preserve the following invariants:

1. Production is isolated from Development and Staging.
2. Production infrastructure is managed through reviewed IaC.
3. Production state is durable.
4. PostgreSQL is authoritative for structured business state.
5. Object storage is authoritative for large binary payloads.
6. Queue is not authoritative.
7. WebSocket is not authoritative.
8. REST remains the durable API authority.
9. Application instances are recoverable.
10. Workers are idempotent.
11. Scheduler allocation is duplicate-safe.
12. Reconciliation is first-class.
13. Booking and resource allocation remain separate.
14. Job and Run remain separate.
15. Credits use an immutable balanced ledger.
16. Financial side effects are idempotent.
17. Accepted artifacts are immutable.
18. Artifacts are verified at multiple boundaries.
19. Tenant isolation is enforced server-side.
20. Production access follows least privilege.
21. Privileged actions are auditable.
22. Production releases are immutable.
23. Production releases originate from validated Staging candidates.
24. High-risk releases use controlled rollout.
25. Failed canaries are aborted.
26. Rollback does not mutate durable business history.
27. Database migrations are compatibility-aware.
28. Backups are regularly validated through restore tests.
29. DR includes Job/Run/Lab reconciliation.
30. Cloud failure does not equal physical E-stop.
31. Physical safety remains local to the robot/lab.
32. Observability is part of the production architecture.
33. Security findings can block releases.
34. Production changes are controlled and auditable.
35. Compliance evidence is retained.
36. Capacity is monitored before saturation.
37. Customer data is protected by tenant boundaries.
38. Production readiness requires explicit approval.

# 126. Final Production Operating Path

The complete production operating model is:

    Source
      |
    Code Review
      |
    CI
      |
    Security / Tests
      |
    Development
      |
    Staging
      |
    Performance / E2E
      |
    Release Approval
      |
    Immutable Artifact
      |
    Production Canary / Blue-Green
      |
    Health Validation
      |
    Controlled Traffic Increase
      |
    Full Production
      |
    Continuous Observability
      |
    Reconciliation
      |
    Backup / DR
      |
    Continuous Improvement

The governing principle is:

> **Production is a controlled, highly available and auditable execution
> environment for real RaaS customers. Every release must arrive as an
> immutable, Staging-validated artifact; every critical state transition must
> remain durable and recoverable; every high-risk change must have a controlled
> rollout and rollback path; and physical robot safety must remain local to the
> robot and lab rather than being delegated to the cloud.**
