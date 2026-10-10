# Kritva RaaS Disaster Recovery

## 1. Document Control

| Item | Value |
|---|---|
| Document | Disaster Recovery |
| Path | `docs/cloud/operations/DISASTER_RECOVERY.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Scope | Production disaster recovery |
| Primary Environment | Production |
| Initial Region Model | Single primary region |
| HA Model | Multi-zone where practical |
| DR Model | Restore/recovery-oriented |
| Primary Database | Managed PostgreSQL |
| Object Storage | Private durable object storage |
| Queue | Managed durable queue |
| Lab Boundary | Lab Agent |
| Physical Safety | Local to Lab/Robot |
| Initial RPO | ≤15 minutes for critical PostgreSQL state |
| Initial RTO | ≤4 hours for major database/recovery event |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the disaster recovery architecture, procedures and
operational requirements for Kritva RaaS.

Disaster recovery provides a controlled method to restore customer-facing
service after failures that exceed normal application recovery mechanisms.

The DR system must address:

- infrastructure failure;
- availability-zone failure;
- database failure;
- object-storage failure;
- queue failure;
- security compromise;
- destructive operator error;
- regional failure;
- major deployment failure;
- loss of production control-plane infrastructure;
- Lab connectivity disruption.

Disaster recovery must restore cloud services without compromising the safety
of physical robots.

## 3. Scope

This document covers:

- disaster scenarios;
- recovery objectives;
- multi-zone strategy;
- multi-region strategy;
- database recovery;
- object recovery;
- configuration recovery;
- secret recovery;
- infrastructure recovery;
- application recovery;
- queue recovery;
- Lab Agent recovery;
- robot-state reconciliation;
- failover;
- failback;
- DR testing;
- communications;
- incident command;
- recovery validation;
- post-DR review.

## 4. Non-Goals

This document does not define:

- robot mechanical safety design;
- physical E-stop implementation;
- detailed robot firmware recovery;
- final cloud provider selection;
- final multi-region active-active architecture;
- customer contractual SLA language;
- detailed application implementation.

## 5. Disaster Recovery Principles

DR follows these principles:

1. Safety takes precedence over availability.
2. Durable state takes precedence over transient state.
3. PostgreSQL remains authoritative for structured business state.
4. Object storage remains authoritative for large binary objects.
5. Cloud recovery does not imply robot recovery.
6. Robot physical safety remains local.
7. Recovery must be observable.
8. Recovery must be auditable.
9. Recovery must be tested.
10. Recovery must preserve idempotency.
11. Recovery must reconcile external state.
12. Financial integrity must be preserved.
13. Customer tenant isolation must be preserved.
14. Failover must be deliberate.
15. Failback must be deliberate.
16. No automatic physical robot restart is assumed.
17. Recovery must respect RPO and RTO.
18. Recovery infrastructure must be reproducible.
19. Communications must be explicit.
20. DR readiness is a continuous operational responsibility.

# 6. Disaster Recovery Model

The initial production model is:

    Primary Region
    +---------------------------------------+
    |                                       |
    |  Zone A       Zone B       Zone C     |
    |    |            |            |        |
    |   API          API          API       |
    |   Worker       Worker       Worker    |
    |   WS           WS           WS        |
    |        \         |         /          |
    |         PostgreSQL HA                 |
    |         Object Storage                |
    |         Queue                         |
    |                                       |
    +-------------------+-------------------+
                        |
                  Protected Backups
                        |
                 DR Recovery Region
                 or Recovery Target

Active-active multi-region is not the initial requirement.

## 7. Normal Failure Versus Disaster

Normal failures are handled through:

- service restart;
- replica replacement;
- autoscaling;
- database failover;
- queue recovery;
- worker retry;
- reconciliation.

A disaster is a failure where normal mechanisms cannot restore acceptable
service within the required operational window.

Examples:

- complete region loss;
- irrecoverable database corruption;
- widespread infrastructure compromise;
- destructive deployment;
- backup-region recovery required.

## 8. Disaster Classification

| Class | Example | Recovery |
|---|---|---|
| D1 | Single instance failure | Automatic |
| D2 | Availability-zone failure | HA failover |
| D3 | Major service failure | Incident recovery |
| D4 | Database corruption | PITR/restore |
| D5 | Security compromise | Isolation + clean recovery |
| D6 | Regional outage | Regional DR |
| D7 | Catastrophic data loss | Backup recovery |

# 9. Recovery Objectives

Recovery objectives include:

- Recovery Point Objective (RPO);
- Recovery Time Objective (RTO).

RPO measures recoverable data loss.

RTO measures restoration time.

## 10. Initial RPO Targets

| Data | Initial RPO |
|---|---:|
| PostgreSQL critical state | ≤15 minutes |
| Accepted artifacts | Near-zero / version-protected |
| Critical results | ≤15–60 minutes |
| Audit data | ≤15 minutes |
| Telemetry | Policy-based |
| Logs | Policy-based |
| Video | Policy-based |

These are planning targets and require production validation.

## 11. Initial RTO Targets

| Recovery Scope | Initial RTO |
|---|---:|
| Single instance | Minutes |
| Availability zone | Minutes to <1 hour |
| Control Plane major recovery | ≤4 hours |
| Database recovery | ≤4 hours |
| Regional DR | Target ≤8 hours initially |
| Full customer service | Target ≤8 hours initially |

The final approved regional RTO remains an operational decision.

## 12. RPO Measurement

RPO is measured using the latest verified recovery point.

Example:

    Incident Time
        -
    Latest Valid Recovery Point
        =
    Actual RPO

If actual RPO exceeds the approved target, the incident must record the
exposure.

## 13. RTO Measurement

RTO begins at the declared recovery start point and ends when the defined
customer service acceptance criteria are met.

It must include:

- infrastructure;
- database;
- storage;
- application;
- identity;
- validation;
- reconciliation.

# 14. Multi-Zone High Availability

Production should deploy stateless workloads across multiple zones.

Preferred model:

    Zone A              Zone B              Zone C
      |                   |                   |
     API                 API                 API
     WS                  WS                  WS
     Worker              Worker              Worker
      \                   |                   /
       +--------- Load Balancer ------------+

Stateful managed services should use provider-supported HA.

## 15. Zone Failure

If one zone fails:

1. Detect degraded zone.
2. Confirm remaining capacity.
3. Route traffic to healthy zones.
4. Replace lost workloads.
5. Validate PostgreSQL/queue/storage.
6. Validate customer journeys.
7. Continue operations.
8. Repair failed zone infrastructure.

No regional DR should be triggered for an isolated zone failure if HA remains
within acceptable limits.

## 16. Zone Recovery

After a failed zone returns:

- do not immediately rebalance all traffic;
- validate infrastructure;
- validate workloads;
- validate dependencies;
- gradually restore capacity;
- monitor for recurrence.

# 17. Regional Strategy

The initial production model uses:

- one primary operating region;
- protected backups;
- recovery capability outside the primary failure domain where practical.

The architecture remains logically compatible with future multi-region
deployment.

## 18. Multi-Region Evolution

Future stages may introduce:

- warm standby;
- pilot-light recovery;
- active/passive;
- active/active.

Active-active is not required initially because it introduces:

- distributed data consistency;
- cross-region transaction complexity;
- booking coordination;
- credit consistency;
- resource allocation complexity.

# 19. DR Region

If a secondary region is established, it should contain:

- recovery-capable network;
- compute templates;
- database recovery capability;
- object storage recovery;
- secret recovery;
- observability;
- deployment capability.

The DR region need not run the complete production workload continuously in
the initial model.

# 20. DR Readiness Levels

| Level | Description |
|---|---|
| L0 | Documentation only |
| L1 | IaC reproducible |
| L2 | Backups recoverable |
| L3 | Application restored |
| L4 | Full customer workflow restored |
| L5 | Lab integration restored |
| L6 | Full tested regional recovery |

Production should achieve at least L4 before broad customer operation and L5
before production physical robot execution.

# 21. Disaster Scenarios

DR must consider:

1. Availability-zone loss.
2. Regional outage.
3. PostgreSQL corruption.
4. Accidental deletion.
5. Object storage deletion.
6. Queue loss.
7. Credential compromise.
8. Container registry failure.
9. Bad deployment.
10. Infrastructure misconfiguration.
11. DNS failure.
12. WAF/edge failure.
13. Security breach.
14. Backup corruption.
15. Lab connectivity outage.
16. Simultaneous infrastructure failure.

# 22. Availability-Zone Scenario

Expected response:

    Zone Failure
        |
    Detect
        |
    Load Balancer Removes Unhealthy Capacity
        |
    Remaining Zones Serve Traffic
        |
    Autoscale
        |
    Validate DB / Queue / Storage
        |
    Continue Service

This is primarily HA, not regional DR.

# 23. Regional Outage Scenario

Expected response:

    Regional Failure
        |
    Confirm Scope
        |
    Declare DR
        |
    Freeze Unsafe Operations
        |
    Activate Recovery Region
        |
    Restore Database
        |
    Restore Objects
        |
    Restore Secrets
        |
    Deploy Application
        |
    Validate
        |
    Reconcile
        |
    Redirect Traffic
        |
    Monitor

# 24. Database Corruption Scenario

Preferred recovery:

    Detect Corruption
        |
    Stop Affected Writes
        |
    Determine Corruption Point
        |
    Select Valid Recovery Point
        |
    PITR
        |
    Validate
        |
    Reconcile
        |
    Resume

If corruption is application-induced, restoring to the immediately preceding
snapshot may not be sufficient; PITR to a known-good point is preferred.

# 25. Accidental Deletion Scenario

Response:

1. Identify deleted object/data.
2. Stop additional deletion.
3. Determine authoritative source.
4. Restore from version/history/backup.
5. Validate checksum.
6. Reconcile metadata.
7. Confirm customer access.

# 26. Security Compromise Scenario

Response:

    Detect Compromise
         |
    Isolate
         |
    Revoke Credentials
         |
    Preserve Evidence
         |
    Determine Trust Boundary
         |
    Establish Clean Recovery Environment
         |
    Restore Trusted Data
         |
    Rotate Secrets
         |
    Validate
         |
    Resume Carefully

Do not restore compromised executables or credentials into the recovery
environment.

# 27. Bad Deployment Scenario

A bad deployment should first use application rollback.

    Deployment
        |
    Regression
        |
    Stop Rollout
        |
    Roll Back Application
        |
    Validate
        |
    If Data Corruption
        |
    Database Recovery Procedure

Database rollback is not automatically coupled to application rollback.

# 28. Queue Failure Scenario

Queue failure should not destroy durable business state.

Response:

- determine queue availability;
- stop unsafe retries;
- preserve database state;
- recover queue;
- inspect pending operations;
- replay idempotently;
- reconcile Jobs and Runs.

# 29. Object Storage Failure

If object storage is unavailable:

- retain database authority;
- prevent operations requiring missing objects;
- restore/access alternate object copies;
- verify checksums;
- reconcile metadata;
- resume operations.

# 30. Lab Connectivity Disaster

Cloud may remain healthy while a Lab is unavailable.

Response:

- mark affected resources unavailable;
- prevent new bookings;
- preserve existing Job/Run state;
- notify affected users;
- maintain local robot safety;
- restore Lab connectivity;
- reconcile actual resource state.

# 31. Robot During Cloud Outage

A cloud outage must not automatically trigger arbitrary robot behavior.

The local system determines:

- continue safely;
- stop application;
- enter safe state;
- require operator intervention.

The Lab Agent and local runtime remain authoritative.

# 32. Robot During Regional Failover

During regional failover:

- cloud Jobs may become unavailable temporarily;
- Lab Agent maintains local safety;
- active robot motion must not depend on cloud traffic continuing;
- automatic restart of physical motion is prohibited unless explicitly
  authorized by the local safety/runtime architecture.

# 33. Safety Priority

The recovery priority is:

    Physical Safety
        >
    Data Integrity
        >
    Security
        >
    Controlled Availability
        >
    Performance

Availability must never override physical safety.

# 34. Active Job Handling

During DR, every non-terminal Job must be classified:

| State | Recovery Treatment |
|---|---|
| QUEUED | Requeue after validation |
| VALIDATING | Revalidate |
| ALLOCATING | Reconcile allocation |
| DEPLOYING | Reconcile actual state |
| STARTING | Manual/controlled review |
| RUNNING | Reconcile actual runtime |
| STOPPING | Reconcile |
| COMPLETED | Preserve |
| FAILED | Preserve |
| CANCELLED | Preserve |

# 35. Active Run Handling

Runs must be classified against actual Lab state.

Possible outcomes:

- recovered;
- stopped;
- failed;
- cancelled;
- reconciliation required.

No Run should be restarted merely because it was non-terminal before the
disaster.

# 36. Credit Recovery

During DR:

- freeze uncertain credit operations if necessary;
- restore ledger;
- reconcile payment references;
- reconcile reservations;
- reconcile consumption;
- resume only after financial integrity is established.

# 37. Booking Recovery

During DR:

- freeze new bookings if authoritative state is uncertain;
- restore booking state;
- query actual resources;
- reconcile reservations;
- re-enable booking only after consistency is confirmed.

# 38. Artifact Recovery

For each required artifact:

- verify artifact ID;
- verify SHA-256 digest;
- verify manifest;
- verify platform compatibility;
- verify signature;
- confirm object availability.

# 39. Result Recovery

Results must be reconciled with:

- Run;
- artifact;
- project;
- object storage.

Missing result files must be identified explicitly.

# 40. Configuration Recovery

Recovery configuration must come from:

- version-controlled configuration;
- IaC;
- protected configuration stores.

Manual reconstruction is a last resort.

# 41. Secret Recovery

Secret recovery requires:

- authorized operator;
- KMS/Secret Store access;
- credential rotation where compromise is suspected;
- audit evidence.

Never restore potentially compromised credentials unchanged.

# 42. DNS Recovery

Regional failover may require:

- DNS update;
- traffic manager;
- edge routing;
- certificate availability.

DNS TTLs should be compatible with planned DR requirements.

# 43. Traffic Cutover

Cutover should follow:

    Recovery Environment
          |
    Health Validation
          |
    Smoke Test
          |
    Synthetic Test
          |
    Customer Workflow Test
          |
    Approval
          |
    DNS / Traffic Switch
          |
    Monitor
          |
    Confirm

# 44. Failover Authorization

Regional failover requires explicit declaration by authorized personnel.

Automatic regional failover is not an initial requirement.

Failover authority should be defined in the incident-response model.

# 45. Failover Checklist

Before traffic cutover:

- [ ] recovery infrastructure healthy;
- [ ] database restored;
- [ ] object storage available;
- [ ] secrets available;
- [ ] application healthy;
- [ ] identity works;
- [ ] API works;
- [ ] WebSocket works;
- [ ] synthetic checks pass;
- [ ] critical data validated;
- [ ] incident commander approves;
- [ ] communication sent.

# 46. Failover Validation

Validate:

- authentication;
- organization access;
- project access;
- platform discovery;
- artifact access;
- booking query;
- credit balance;
- Job creation;
- Job status;
- result access;
- Lab Agent registration where required.

# 47. Failover Traffic Strategy

Preferred:

    0%
      |
    Recovery Validation
      |
    1–5%
      |
    Observe
      |
    25%
      |
    Observe
      |
    50%
      |
    Observe
      |
    100%

Exact progression depends on failure type.

# 48. Failback

Failback means returning from the recovery environment to the primary
environment.

Failback must not occur immediately after primary infrastructure becomes
available.

The primary environment must first be:

- rebuilt;
- secured;
- validated;
- synchronized;
- tested.

# 49. Failback Flow

    Recovery Region
          |
    Stabilize
          |
    Rebuild Primary
          |
    Restore / Synchronize Data
          |
    Validate
          |
    Controlled Traffic Test
          |
    Approval
          |
    Gradual Traffic Shift
          |
    Monitor
          |
    Complete Failback

# 50. Failback Data Authority

Exactly one authoritative write environment must exist during failback.

Avoid uncontrolled dual writes.

If both regions have accepted writes, explicit reconciliation is required.

# 51. Failback Database Strategy

Possible approaches:

- replication;
- backup restore;
- logical synchronization;
- controlled data export/import.

The selected strategy depends on the final regional architecture.

# 52. Failback Object Strategy

Object storage must be reconciled using:

- object versions;
- checksums;
- creation timestamps;
- authoritative metadata.

Do not assume object synchronization is complete without validation.

# 53. Failback Lab Strategy

Labs should reconnect only after the target Control Plane is validated.

Agent behavior:

    Agent
      |
    Current Control Plane
      |
    Failover
      |
    Approved New Endpoint
      |
    Re-authenticate
      |
    Re-register
      |
    Heartbeat
      |
    Capability Validation

# 54. Failback Robot Safety

Robots must not automatically resume physical execution during failback.

Local operators validate:

- safety state;
- robot runtime;
- resource state;
- application state.

# 55. DR Communication Plan

Communication must operate at multiple levels:

- technical responders;
- incident leadership;
- security;
- Lab Operations;
- management;
- customer support;
- customers where required.

# 56. Communication Objectives

Communication must provide:

- what happened;
- what is affected;
- current safety state;
- expected impact;
- current recovery state;
- next update time;
- actions required from stakeholders.

# 57. Internal Communication

SEV0/SEV1 incidents require immediate internal notification.

Initial message should include:

    Incident ID
    Severity
    Start Time
    Known Impact
    Affected Services
    Safety Status
    Current Action
    Incident Commander
    Next Update

# 58. Customer Communication

Customer communication is required when:

- customer access is materially affected;
- Jobs are interrupted;
- bookings are affected;
- results are delayed;
- credits may be impacted;
- customer action is required.

Do not expose internal security details.

# 59. Communication Cadence

Initial baseline:

| Severity | Update |
|---|---|
| SEV0 | Continuous / frequent |
| SEV1 | Every 30–60 minutes |
| SEV2 | Every 1–2 hours |
| SEV3 | As needed |

Final cadence is incident-dependent.

# 60. Communication Ownership

| Communication | Owner |
|---|---|
| Technical | Incident Commander |
| Security | Security Lead |
| Lab | Lab Operations |
| Customer | Support/Product |
| Executive | Incident Commander/Management |

# 61. Incident Commander

The Incident Commander:

- declares DR;
- establishes priorities;
- coordinates teams;
- approves major actions;
- controls communications;
- confirms recovery;
- authorizes failover/failback.

# 62. Recovery Team Roles

Minimum DR team:

- Incident Commander;
- SRE/Cloud;
- DBA;
- Backend;
- Security;
- Lab Integration;
- Lab Operations;
- Customer/Support representative.

# 63. Recovery Access

DR responders require controlled access to:

- cloud account/project;
- IaC;
- database;
- object storage;
- secret store;
- monitoring;
- deployment;
- incident communication.

Access must remain least privilege.

# 64. Recovery Environment Security

The recovery environment must enforce:

- separate credentials;
- private networking;
- least privilege;
- encryption;
- logging;
- monitoring;
- tenant isolation.

A disaster is not a justification for disabling security controls.

# 65. Clean-Room Recovery

For suspected compromise, recovery should use clean infrastructure.

Do not reuse:

- compromised credentials;
- compromised containers;
- untrusted binaries;
- compromised hosts.

# 66. Recovery Validation

Validation must include:

    Infrastructure
        |
    Database
        |
    Storage
        |
    Application
        |
    Authentication
        |
    Authorization
        |
    Business State
        |
    Synthetic Journey
        |
    Lab State
        |
    Robot Safety

# 67. Recovery Smoke Tests

Minimum tests:

- login;
- create/read project;
- platform listing;
- artifact lookup;
- booking query;
- credit balance;
- Job status;
- result lookup;
- WebSocket connection.

# 68. Recovery E2E Test

The recovery environment should execute:

    Login
      |
    Project
      |
    Platform
      |
    Artifact
      |
    Booking
      |
    Job
      |
    Run
      |
    Result

Physical robot execution should be excluded unless explicitly approved.

# 69. DR Testing

DR tests prove that recovery procedures work.

Types:

- tabletop;
- backup restore;
- application restore;
- zone failure simulation;
- service failure;
- regional recovery;
- security recovery.

# 70. DR Test Principles

Tests must:

- be scheduled;
- have an owner;
- have scope;
- have success criteria;
- preserve safety;
- preserve customer isolation;
- produce evidence.

# 71. Tabletop Exercise

Tabletop tests validate:

- communication;
- roles;
- decisions;
- escalation;
- recovery sequencing.

No production changes are required.

# 72. Database Restore Test

Monthly baseline:

1. Select recovery point.
2. Restore isolated database.
3. Validate schema.
4. Validate critical data.
5. Run application checks.
6. Record recovery duration.

# 73. Full DR Exercise

Quarterly baseline:

    Declare Simulated Disaster
          |
    Activate DR
          |
    Restore Infrastructure
          |
    Restore Data
          |
    Deploy Application
          |
    Validate
          |
    Simulate Traffic
          |
    Reconcile
          |
    Complete

# 74. Regional DR Test

A regional test should validate:

- recovery region;
- database recovery;
- object recovery;
- application deployment;
- DNS/traffic;
- identity;
- monitoring;
- communication.

Physical robots should not be moved into uncontrolled failover testing.

# 75. Lab DR Test

Lab testing should use:

- simulated resources;
- controlled test Lab Agent;
- designated test platform.

Validate:

- registration;
- authentication;
- heartbeat;
- capability discovery;
- resource inventory;
- disconnect/reconnect.

# 76. Robot DR Test

Physical robot DR tests require separate safety approval.

Preferred default:

- use simulation;
- use hardware-in-loop where safe;
- avoid live motion.

If physical motion is tested:

- local safety operator must be present;
- E-stop must be available;
- test scope must be bounded;
- cloud recovery must not bypass safety.

# 77. DR Test Frequency

| Test | Frequency |
|---|---|
| Tabletop | Quarterly |
| DB restore | Monthly |
| Object restore | Monthly |
| Full application recovery | Quarterly |
| Regional DR | Quarterly/biannual |
| Lab recovery | Quarterly |
| Security recovery | At least annually |
| Failback | Risk-based |

# 78. DR Test Evidence

Record:

- scenario;
- test date;
- participants;
- recovery point;
- recovery duration;
- RPO;
- RTO;
- failures;
- corrective actions;
- final result.

# 79. RPO Test

During a DR exercise:

    Declared Disaster Time
            -
    Restored Data Timestamp
            =
    Observed RPO

Observed RPO must meet the approved target.

# 80. RTO Test

Measure:

    DR Declaration
        |
    Recovery Start
        |
    Service Restored
        |
    Validation Complete

The measured time is the observed RTO.

# 81. DR Failure

If DR testing fails:

- open corrective action;
- classify risk;
- assign owner;
- establish deadline;
- retest.

Critical DR deficiencies block production readiness where appropriate.

# 82. DR Monitoring

Monitor during recovery:

- restore progress;
- database status;
- object recovery;
- application health;
- queue state;
- API;
- WebSocket;
- synthetic checks;
- Lab connectivity.

# 83. DR Alerting

DR-specific alerts include:

- restore failure;
- recovery timeout;
- backup unavailable;
- replication lag;
- recovery environment failure;
- failed health check;
- failed synthetic test.

# 84. Recovery Queue Strategy

During DR, asynchronous processing may be paused.

After durable state is validated:

- recover queue;
- resume workers;
- process messages;
- monitor duplicates;
- reconcile state.

# 85. Recovery Ordering

Strict ordering:

1. Safety.
2. Incident control.
3. Infrastructure.
4. Identity.
5. Database.
6. Object storage.
7. Secrets.
8. Application.
9. Queue/workers.
10. Business validation.
11. Lab connectivity.
12. Customer traffic.
13. Physical execution.

# 86. Customer Traffic During Recovery

Customer traffic should remain disabled or restricted until:

- database authority is confirmed;
- application is healthy;
- identity is healthy;
- critical workflows pass.

Gradual traffic is preferred.

# 87. Recovery Readiness Indicator

A DR environment should expose a readiness state:

- NOT_READY;
- RECOVERING;
- VALIDATING;
- READY_FOR_CONTROLLED_TRAFFIC;
- READY;
- DEGRADED.

# 88. Recovery State Authority

Recovery status is operational state.

It must be visible to:

- Incident Commander;
- SRE;
- relevant service owners.

Customer-facing status should be managed separately.

# 89. Data Reconciliation

After recovery compare:

- PostgreSQL/object storage;
- bookings/resources;
- credits/payments;
- Jobs/Runs;
- Labs/Agents;
- artifacts/results.

# 90. Reconciliation Failure

If reconciliation fails:

- affected subsystem remains restricted;
- incident remains open;
- customer operations may be partially blocked;
- manual review is required for financial or safety-sensitive state.

# 91. Post-Recovery Validation

After recovery:

- run synthetic tests;
- inspect error rates;
- inspect queue backlog;
- inspect DB health;
- inspect Labs;
- inspect security events;
- inspect credit/booking reconciliation.

# 92. Post-DR Monitoring

For at least the defined stabilization window:

- increase monitoring;
- monitor error budgets;
- monitor queue;
- monitor DB;
- monitor resource capacity;
- monitor customer support signals.

# 93. Failback Decision

Failback requires evidence that:

- primary environment is healthy;
- root cause is addressed;
- data is synchronized;
- security is restored;
- recovery environment is no longer required.

# 94. Failback Risk

Failback can introduce another outage.

Therefore:

- use controlled traffic;
- validate primary;
- maintain recovery copy;
- retain rollback path.

# 95. Post-Failback

After failback:

- validate;
- monitor;
- reconcile;
- preserve recovery environment until safe;
- document final state.

# 96. DR Documentation

Required documents:

- DR architecture;
- recovery runbooks;
- contact list;
- ownership matrix;
- RPO/RTO matrix;
- recovery checklist;
- communication templates;
- test evidence.

# 97. Contact Management

Contacts must be maintained for:

- SRE;
- DBA;
- Backend;
- Security;
- Cloud;
- Lab;
- Support;
- Management.

Stale contacts are a DR risk.

# 98. DR Access Review

Before each major DR exercise:

- validate accounts;
- validate MFA;
- validate permissions;
- validate credentials;
- validate emergency access.

# 99. DR Configuration Drift

Recovery environments must be compared against expected configuration.

Drift must be detected before a disaster.

# 100. Recovery Infrastructure as Code

Recovery infrastructure must be reproducible.

Preferred flow:

    Git
      |
    IaC
      |
    CI Validation
      |
    Recovery Environment
      |
    Validation

Manual infrastructure creation should be minimized.

# 101. Backup Dependency

DR depends on:

- valid PostgreSQL backups;
- valid object storage protection;
- valid configuration;
- valid secrets recovery;
- valid IaC.

Therefore DR readiness is inseparable from backup readiness.

# 102. Security Dependency

DR must preserve:

- tenant isolation;
- encryption;
- access control;
- audit;
- secret management.

Do not create an insecure "temporary" DR environment.

# 103. Compliance During DR

Recovery must maintain:

- data protection;
- retention;
- auditability;
- access controls;
- data residency requirements where applicable.

# 104. DR Cost Management

Initial DR may use:

- IaC-based reconstruction;
- warm standby for critical services;
- provider-managed recovery;
- protected backups.

Cost should be balanced against RTO/RPO.

# 105. DR Capacity

Recovery capacity must support at least:

- control plane;
- critical APIs;
- database;
- object access;
- worker processing;
- required Lab connectivity.

It does not necessarily need full peak production capacity immediately.

# 106. Recovery Scaling

After initial recovery:

    Minimum Recovery Capacity
            |
       Validate
            |
       Restore Traffic
            |
       Observe
            |
       Autoscale
            |
       Full Capacity

# 107. DR Communication Closure

Incident communication ends only after:

- service stable;
- data validated;
- safety validated;
- customer impact understood;
- monitoring stable;
- recovery decision documented.

# 108. Post-Incident Review

Every major DR event requires:

- timeline;
- root cause;
- recovery performance;
- RPO;
- RTO;
- communication assessment;
- safety assessment;
- corrective actions.

# 109. Phase Mapping

| Phase | DR Objective |
|---|---|
| Phase 0 | Define recovery model |
| Phase 1 | Establish backup/recovery foundation |
| Phase 2 | Recover artifacts/resources |
| Phase 3 | Recover asynchronous execution |
| Phase 4 | Recover commercial state |
| Phase 5 | Recover remote execution |
| Phase 6 | Recover Labs and robot state |
| Phase 7 | Recover realtime/results |
| Phase 8 | Full production DR maturity |

# 110. Phase 0

Define:

- disaster classes;
- RPO;
- RTO;
- ownership;
- communication;
- recovery architecture.

Acceptance:

- [ ] DR architecture approved.
- [ ] RPO/RTO targets documented.
- [ ] recovery owners assigned.

# 111. Phase 1

Implement:

- backup recovery;
- infrastructure recovery;
- PostgreSQL recovery;
- object recovery;
- secrets recovery.

Acceptance:

- [ ] restore test passes.
- [ ] recovery environment is reproducible.

# 112. Phase 2

Add:

- artifact recovery;
- resource metadata;
- object reconciliation.

Acceptance:

- [ ] artifacts recover.
- [ ] object metadata reconciles.

# 113. Phase 3

Add:

- queue recovery;
- outbox recovery;
- Job/Run reconciliation.

Acceptance:

- [ ] async state recovers.
- [ ] duplicate processing is prevented.

# 114. Phase 4

Add:

- booking recovery;
- credit recovery;
- financial reconciliation.

Acceptance:

- [ ] ledger is validated.
- [ ] booking state is validated.

# 115. Phase 5

Add:

- remote execution recovery;
- deployment state recovery.

Acceptance:

- [ ] Jobs are classified.
- [ ] Runs are reconciled.
- [ ] unsafe automatic restart is prevented.

# 116. Phase 6

Add:

- Lab Agent recovery;
- Lab resource reconciliation;
- robot-state validation.

Acceptance:

- [ ] Agents reconnect.
- [ ] resources reconcile.
- [ ] safety remains local.

# 117. Phase 7

Add:

- realtime recovery;
- telemetry;
- video;
- result recovery.

Acceptance:

- [ ] realtime services recover.
- [ ] critical results recover.
- [ ] telemetry resumes safely.

# 118. Phase 8

Complete:

- regional DR;
- failover;
- failback;
- full exercises;
- communication;
- compliance.

Acceptance:

- [ ] RPO passes.
- [ ] RTO passes.
- [ ] DR exercise passes.
- [ ] failback is tested.

# 119. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Region unavailable | Critical | DR recovery region |
| Backup unusable | Critical | Restore testing |
| RPO exceeded | Critical | Backup freshness monitoring |
| RTO exceeded | Critical | Repeated DR exercises |
| Data inconsistency | Critical | Reconciliation |
| Duplicate execution | Critical | Idempotency |
| Credit duplication | Critical | Immutable ledger |
| Booking duplication | High | DB constraints |
| Credential compromise | Critical | Clean recovery/rotation |
| Robot unsafe restart | Critical | Local safety authority |
| Stale DR environment | High | IaC/drift detection |
| DNS delay | Medium | Controlled TTL strategy |
| Failed failback | High | Tested failback |
| Poor communication | High | Defined incident plan |
| Insufficient capacity | High | DR capacity planning |
| Lab unavailable | High | Local safety + reconciliation |
| Monitoring unavailable | High | Independent recovery monitoring |
| Compliance violation | High | Recovery controls |
| Excessive DR cost | Medium | Tiered DR strategy |
| Human error | High | Checklists/authorization |

# 120. Open Questions

1. Final primary cloud region.
2. Final DR region.
3. Final cross-region backup strategy.
4. Final PostgreSQL replication strategy.
5. Final regional RPO.
6. Final regional RTO.
7. Final zone-failure RTO.
8. Final DR compute model.
9. Final warm-standby scope.
10. Final DNS/traffic failover mechanism.
11. Final certificate strategy.
12. Final object-storage cross-region strategy.
13. Final secret recovery mechanism.
14. Final KMS cross-region strategy.
15. Final DR cost budget.
16. Final failover authorization.
17. Final failback authorization.
18. Final customer communication templates.
19. Final incident commander policy.
20. Final DR test frequency.
21. Final physical Lab DR policy.
22. Final robot-state recovery policy.
23. Final compliance/data-residency requirements.
24. Final DR capacity target.
25. Final multi-region roadmap.

# 121. Full Acceptance Criteria

## Architecture

- [ ] Disaster scenarios are defined.
- [ ] DR architecture is documented.
- [ ] HA and DR are distinguished.
- [ ] Multi-zone strategy is documented.
- [ ] Multi-region strategy is documented.
- [ ] Recovery ordering is defined.
- [ ] Recovery ownership is defined.

## RPO/RTO

- [ ] PostgreSQL RPO is defined.
- [ ] Artifact RPO is defined.
- [ ] Result RPO is defined.
- [ ] Audit RPO is defined.
- [ ] Control Plane RTO is defined.
- [ ] Database RTO is defined.
- [ ] Regional RTO is defined.
- [ ] RPO measurement is implemented.
- [ ] RTO measurement is implemented.

## Infrastructure

- [ ] Production is multi-zone where practical.
- [ ] Recovery infrastructure is reproducible.
- [ ] IaC is available.
- [ ] Recovery network is secured.
- [ ] Recovery compute is validated.
- [ ] Recovery database is validated.
- [ ] Recovery storage is validated.

## Database

- [ ] PostgreSQL backup is available.
- [ ] PITR is available.
- [ ] Database restore is tested.
- [ ] Critical tables are validated.
- [ ] Ledger is validated.
- [ ] Booking state is validated.
- [ ] Job/Run state is validated.

## Object Storage

- [ ] Artifacts are recoverable.
- [ ] Results are recoverable.
- [ ] Object checksums are validated.
- [ ] Versioning is configured where required.
- [ ] Cross-region protection is defined where required.
- [ ] Missing objects are detectable.

## Configuration and Secrets

- [ ] IaC is recoverable.
- [ ] Configuration is recoverable.
- [ ] Secrets have secure recovery.
- [ ] KMS/key recovery is documented.
- [ ] Compromised secrets can be rotated.

## Application

- [ ] Application can be rebuilt from immutable artifacts.
- [ ] API can be deployed in recovery.
- [ ] WebSocket can be deployed.
- [ ] Workers can be deployed.
- [ ] Scheduler can be deployed.
- [ ] Reconciliation can be deployed.
- [ ] Health checks pass after recovery.

## Business State

- [ ] Bookings reconcile.
- [ ] Credits reconcile.
- [ ] Jobs reconcile.
- [ ] Runs reconcile.
- [ ] Artifacts reconcile.
- [ ] Results reconcile.
- [ ] Idempotency survives recovery.

## Lab and Robot

- [ ] Lab Agent recovery is documented.
- [ ] Agent authentication is validated.
- [ ] Resource inventory is reconciled.
- [ ] Robot state is reconciled.
- [ ] Safety state is validated.
- [ ] Physical E-stop remains local.
- [ ] Automatic unsafe robot restart is prevented.

## Failover

- [ ] Failover authority is defined.
- [ ] Failover checklist exists.
- [ ] Recovery environment can be validated.
- [ ] Controlled traffic cutover exists.
- [ ] DNS/traffic strategy is tested.
- [ ] Customer workflows are validated.

## Failback

- [ ] Primary environment rebuild is defined.
- [ ] Data synchronization is defined.
- [ ] Single write authority is maintained.
- [ ] Controlled traffic return is defined.
- [ ] Failback rollback is possible.
- [ ] Lab reconnection is validated.
- [ ] Robot safety remains local.

## Testing

- [ ] Tabletop test exists.
- [ ] Database restore test exists.
- [ ] Object restore test exists.
- [ ] Application recovery test exists.
- [ ] Regional DR test exists.
- [ ] Lab recovery test exists.
- [ ] Security recovery test exists.
- [ ] Failback test exists.
- [ ] RPO is measured.
- [ ] RTO is measured.
- [ ] Test evidence is retained.

## Communication

- [ ] Incident Commander role exists.
- [ ] Technical response path exists.
- [ ] Security response path exists.
- [ ] Lab response path exists.
- [ ] Customer communication path exists.
- [ ] Update cadence is defined.
- [ ] Closure communication is defined.

## Monitoring

- [ ] Recovery progress is monitored.
- [ ] Restore failures alert.
- [ ] RPO breaches alert.
- [ ] RTO breaches are detected.
- [ ] Recovery environment health is monitored.
- [ ] Post-recovery health is monitored.

## Production Readiness

- [ ] DR documentation is approved.
- [ ] Runbooks are approved.
- [ ] Access is tested.
- [ ] Contacts are current.
- [ ] RPO is validated.
- [ ] RTO is validated.
- [ ] Recovery exercises pass.
- [ ] Failover is tested.
- [ ] Failback is tested.
- [ ] Physical safety review is complete.

# 122. Final DR Invariants

Kritva RaaS disaster recovery must preserve these invariants:

1. Physical safety takes precedence over service availability.
2. PostgreSQL remains authoritative.
3. Object storage remains authoritative for large binary data.
4. Recovery is based on verified backups.
5. RPO is measurable.
6. RTO is measurable.
7. Multi-zone HA handles ordinary zone failures.
8. Regional DR handles catastrophic regional failure.
9. Active-active multi-region is not required initially.
10. Recovery infrastructure is reproducible.
11. Recovery state is observable.
12. Recovery actions are auditable.
13. Financial state remains consistent.
14. Booking state remains consistent.
15. Job/Run state is reconciled.
16. Lab state is reconciled.
17. Robot state is reconciled locally.
18. Physical E-stop remains independent of cloud recovery.
19. Unsafe automatic robot restart is prohibited.
20. Recovery does not create duplicate financial operations.
21. Recovery does not create duplicate resource allocation.
22. Recovery does not blindly restart non-terminal Runs.
23. Failover has explicit authorization.
24. Failback has explicit authorization.
25. One authoritative write environment exists during regional recovery.
26. Security controls remain active during recovery.
27. Tenant isolation remains active during recovery.
28. DR tests are performed regularly.
29. DR failures generate corrective actions.
30. Recovery evidence is retained.
31. Communication is part of recovery.
32. Post-DR monitoring remains elevated until stabilization.
33. Backup readiness is a prerequisite for DR readiness.
34. DR readiness is continuously maintained.

# 123. Final Disaster Recovery Operating Model

The complete operating model is:

    Detect
      |
    Assess
      |
    Declare Disaster
      |
    Protect Safety
      |
    Stabilize / Isolate
      |
    Establish Recovery Authority
      |
    Restore Infrastructure
      |
    Restore Database
      |
    Restore Object Storage
      |
    Restore Configuration
      |
    Restore Secrets
      |
    Deploy Application
      |
    Validate
      |
    Reconcile Durable and External State
      |
    Validate Labs
      |
    Validate Robot Safety
      |
    Controlled Traffic
      |
    Monitor
      |
    Stabilize
      |
    Failback When Safe
      |
    Post-Incident Review

The governing principle is:

> **Kritva RaaS disaster recovery must restore a trustworthy and observable
> control plane without compromising financial integrity, customer data,
> tenant isolation or physical robot safety. Multi-zone high availability
> should absorb ordinary infrastructure failures, while protected backups and
> a reproducible recovery environment provide the path for regional and
> catastrophic failures. Every recovery must be measured against explicit RPO
> and RTO targets, validated through testing, communicated through a defined
> incident process, and followed by reconciliation of Jobs, Runs, Labs and
> robots before normal operation is resumed.**
