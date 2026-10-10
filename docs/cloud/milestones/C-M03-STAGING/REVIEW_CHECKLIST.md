# C-M03-STAGING — Review Checklist

Milestone: C-M03-STAGING — Production-Parity Staging Environment

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

## 7 Test and verification plan

### 7.1 Test layers

Testing shall follow:

    Unit
      |
      v
    Component
      |
      v
    Integration
      |
      v
    Security
      |
      v
    Performance
      |
      v
    Resilience
      |
      v
    DR
      |
      v
    Lab
      |
      v
    End-to-End
      |
      v
    Release Qualification

### 7.2 Functional regression

Run the complete product path:

    Login
      |
      v
    Organization
      |
      v
    Project
      |
      v
    Platform
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
    Run
      |
      v
    Live Observation
      |
      v
    Result
      |
      v
    Rerun

All authoritative state transitions must be validated.

### 7.3 Integration testing

Validate:

- API ↔ PostgreSQL;
- API ↔ object storage;
- API ↔ queue;
- worker ↔ queue;
- worker ↔ PostgreSQL;
- worker ↔ object storage;
- worker ↔ Lab Agent;
- Lab Agent ↔ runtime;
- Studio ↔ API;
- Studio ↔ WebSocket;
- result generation ↔ object storage.

### 7.4 Security testing

Security tests shall include both positive and negative cases.

Examples:

    Valid User
       |
       v
    Authorized Resource
       |
       v
    ALLOW

    User A
       |
       v
    Organization B Resource
       |
       v
    DENY

    Development Service
       |
       v
    Production Database
       |
       v
    DENY

### 7.5 Performance methodology

Performance tests shall define:

- workload;
- concurrency;
- duration;
- dataset size;
- environment size;
- warm-up period;
- measurement period;
- percentile metrics;
- error thresholds;
- saturation indicators;
- success criteria.

Tests shall distinguish:

- application latency;
- database latency;
- network latency;
- queue latency;
- Lab latency.

### 7.6 Performance scenarios

At minimum:

1. normal API traffic;
2. elevated API traffic;
3. concurrent project creation;
4. concurrent artifact operations;
5. booking contention;
6. credit reservation contention;
7. concurrent job submission;
8. worker backlog;
9. result generation;
10. large result download;
11. WebSocket concurrency;
12. telemetry ingestion;
13. log ingestion;
14. Lab Agent command concurrency.

### 7.7 Failure injection

Controlled failure tests shall include:

- API instance restart;
- worker restart;
- queue consumer restart;
- queue backlog;
- database connection exhaustion;
- object-storage temporary failure;
- Lab Agent disconnect;
- WebSocket disconnect;
- telemetry interruption;
- deployment failure;
- migration failure;
- dependency timeout.

The system shall preserve authoritative state.

### 7.8 Rollback verification

A release candidate shall be deployed, exercised, and then rolled back.

The rollback test shall verify:

- application availability;
- database compatibility;
- artifact compatibility;
- Job/Run integrity;
- audit continuity;
- object access;
- Lab connectivity.

### 7.9 DR rehearsal

The DR rehearsal shall use a documented scenario.

Example:

    Healthy Staging
          |
          v
    Capture recovery point
          |
          v
    Simulate service/database failure
          |
          v
    Restore infrastructure
          |
          v
    Restore PostgreSQL
          |
          v
    Restore/reconnect application
          |
          v
    Restore object/queue dependencies
          |
          v
    Restore Lab connectivity
          |
          v
    Validate data
          |
          v
    Execute smoke test
          |
          v
    Measure RPO/RTO

### 7.10 Data-integrity verification

After DR:

- organization records must be consistent;
- project records must be consistent;
- artifact metadata must be consistent;
- booking state must be consistent;
- credit ledger must remain balanced;
- Job/Run state must be reconstructable;
- Result metadata must remain consistent;
- audit records must remain available as required.

### 7.11 Evidence model

Every qualification test shall record:

- test ID;
- release candidate;
- environment;
- start/end time;
- input dataset;
- expected result;
- actual result;
- logs;
- metrics;
- traces where applicable;
- pass/fail;
- defect reference;
- reviewer.

### 7.12 Qualification report

The final report shall classify findings as:

- BLOCKER;
- CRITICAL;
- HIGH;
- MEDIUM;
- LOW;
- OBSERVATION.

A Production recommendation shall be one of:

- APPROVED FOR PRODUCTION REVIEW;
- CONDITIONALLY APPROVED;
- NOT APPROVED.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate that Staging provides a realistic Production qualification environment and can survive controlled operational failures.

### 8.2 Demonstration preparation

Confirm:

- release candidate identified;
- Staging deployed;
- database migrated;
- dashboards available;
- synthetic dataset loaded;
- Lab Agent connected;
- performance tooling available;
- DR procedures prepared.

### 8.3 Step 1 — Show parity

Display:

- Production architecture target;
- Staging architecture;
- documented differences.

Expected result:

Any difference is explicit, justified, and non-architectural where practical.

### 8.4 Step 2 — Show release provenance

Display:

- release version;
- Git commit;
- build artifact;
- dependency state;
- database migration;
- infrastructure version.

Expected result:

The tested release is fully traceable.

### 8.5 Step 3 — Deploy release candidate

Promote the release candidate into Staging.

Expected result:

Automated deployment completes.

### 8.6 Step 4 — Run smoke tests

Execute:

- health;
- authentication;
- project;
- platform;
- artifact;
- booking;
- execution;
- result.

Expected result:

All mandatory smoke tests pass.

### 8.7 Step 5 — Execute RaaS flow

Run:

    Login
      |
      v
    Project
      |
      v
    Platform
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
    Lab Agent
      |
      v
    Run
      |
      v
    Result

Expected result:

End-to-end execution completes.

### 8.8 Step 6 — Demonstrate observability

Show:

- request trace;
- Job ID;
- Run ID;
- worker logs;
- queue activity;
- Lab Agent events;
- result generation.

Expected result:

The complete execution path can be diagnosed.

### 8.9 Step 7 — Demonstrate security

Show:

- authorized access;
- unauthorized tenant access;
- private object access;
- service identity permissions.

Expected result:

Authorized operations succeed and unauthorized operations fail.

### 8.10 Step 8 — Demonstrate performance

Run a representative workload.

Show:

- latency;
- throughput;
- error rate;
- CPU;
- memory;
- database utilization;
- queue depth;
- worker utilization.

Expected result:

Measured behavior is within agreed qualification thresholds or deviations are formally documented.

### 8.11 Step 9 — Demonstrate failure recovery

Restart a worker during controlled execution.

Expected result:

Durable Job/Run state remains consistent and recovery follows the defined execution semantics.

### 8.12 Step 10 — Demonstrate Lab disconnect

Disconnect the Staging Lab Agent.

Expected result:

The Control Plane detects loss of connectivity and does not incorrectly represent the remote resource as safely controllable.

### 8.13 Step 11 — Demonstrate rollback

Deploy a known-good previous version.

Expected result:

Rollback completes, smoke tests pass, and state remains consistent.

### 8.14 Step 12 — Demonstrate DR

Execute the approved DR rehearsal scenario.

Expected result:

Required services and authoritative data are restored within measured RPO/RTO targets or gaps are documented.

### 8.15 Demo completion

The demo passes when:

> Staging demonstrates that a release can be deployed, exercised, observed, stress-tested, recovered, and qualified using a production-parity architecture before Production approval.

---
