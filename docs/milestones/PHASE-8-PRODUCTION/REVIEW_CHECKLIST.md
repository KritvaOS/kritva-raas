# PHASE-8-PRODUCTION — Review Checklist

Milestone: PHASE-8-PRODUCTION — Production Hardening, Scale and Launch Readiness

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

### 7.1 Verification model

Production readiness follows:

    Static Verification
          |
          v
    Unit / Integration
          |
          v
    Staging Qualification
          |
          v
    Security Qualification
          |
          v
    Performance Qualification
          |
          v
    Failure Injection
          |
          v
    DR Qualification
          |
          v
    Internal Production
          |
          v
    Canary
          |
          v
    Pilot
          |
          v
    Go / No-Go

### 7.2 Functional regression

Run the complete primary path:

    Login
      |
      v
    Project
      |
      v
    Build Locally
      |
      v
    .krv
      |
      v
    Platform
      |
      v
    Booking
      |
      v
    Credits
      |
      v
    Job
      |
      v
    Run
      |
      v
    Video / Telemetry / Logs
      |
      v
    Result
      |
      v
    Experiment / Comparison
      |
      v
    Rerun

### 7.3 Security verification

Test:

- authentication;
- MFA;
- authorization;
- tenant isolation;
- session management;
- API abuse;
- rate limits;
- secrets;
- key management;
- artifact signing;
- source privacy;
- object access;
- WebSocket authorization;
- WebRTC authorization;
- audit.

### 7.4 Vulnerability management

Production qualification shall identify:

- critical vulnerabilities;
- high vulnerabilities;
- medium vulnerabilities;
- low vulnerabilities.

Critical vulnerabilities block launch.

High vulnerabilities require:

- remediation;
- compensating control;
- documented risk acceptance by authorized owner.

### 7.5 Dependency verification

Verify:

- dependency versions;
- vulnerability status;
- license policy;
- transitive dependencies;
- SBOM;
- build provenance.

### 7.6 Penetration testing

Test at minimum:

- authentication;
- authorization;
- tenant isolation;
- API;
- object storage;
- WebSocket;
- WebRTC signaling;
- artifact upload;
- download;
- administrative APIs.

### 7.7 Load testing

Test realistic production scenarios:

    100s of API sessions
    concurrent Studio users
    concurrent WebSocket sessions
    concurrent video sessions
    concurrent telemetry streams
    simultaneous bookings
    simultaneous Jobs
    result processing
    downloads

The final concurrency numbers shall be based on the initial commercial capacity target.

### 7.8 Stress testing

Push the system beyond expected operating load to identify:

- saturation;
- graceful degradation;
- queue growth;
- database pressure;
- worker exhaustion;
- memory leaks;
- connection leaks.

### 7.9 Soak testing

Run representative production workloads for an extended period.

Verify:

- memory stability;
- connection stability;
- queue stability;
- database growth;
- telemetry storage growth;
- object-storage growth;
- log growth;
- worker recovery.

### 7.10 Failure injection

Inject failures into:

- API instance;
- worker;
- queue;
- PostgreSQL connection;
- PostgreSQL node;
- object storage;
- WebSocket service;
- media service;
- Lab Agent;
- network;
- secrets service where safely testable.

Expected behavior shall be documented before testing.

### 7.11 Database failover

Procedure:

    Primary Database
          |
          v
    Simulated Failure
          |
          v
    Failover
          |
          v
    Application Reconnect
          |
          v
    Validate Data
          |
          v
    Resume Operations

Verify:

- no unacceptable data loss;
- application reconnect;
- transaction integrity;
- booking integrity;
- credit integrity.

### 7.12 Backup/restore

Perform:

- full restore;
- point-in-time restore;
- selective object recovery;
- infrastructure recreation.

Measure:

- RPO;
- RTO;
- manual effort;
- automation gaps.

### 7.13 Queue recovery

Kill workers during:

- artifact processing;
- result processing;
- notification;
- reconciliation.

Verify idempotent recovery.

### 7.14 WebSocket recovery

Kill or restart live infrastructure.

Verify:

- clients reconnect;
- state rehydrates;
- events resume;
- execution is unaffected.

### 7.15 WebRTC recovery

Test:

- media server restart;
- TURN failure;
- network transition;
- camera disconnect.

Verify video failure remains isolated from execution truth and safety.

### 7.16 Lab failure

Test:

- Lab Agent disconnect;
- Runtime failure;
- robot fault;
- network loss.

Verify local safety remains authoritative.

### 7.17 Financial verification

Run:

- concurrent credit reservation;
- booking cancellation;
- partial consumption;
- refund;
- payment callback replay;
- reconciliation.

Expected:

    Ledger Balanced = TRUE
    Wallet Consistent = TRUE
    Booking Consistent = TRUE

### 7.18 Data integrity

Run reconciliation across:

- bookings;
- allocations;
- wallets;
- ledger;
- Jobs;
- Runs;
- Results;
- object storage;
- audit.

### 7.19 Migration testing

For every production migration:

1. apply to representative staging data;
2. measure duration;
3. inspect locks;
4. verify indexes;
5. execute application compatibility tests;
6. validate rollback/forward strategy;
7. document production execution procedure.

### 7.20 Security regression

Every release shall rerun critical security checks.

Security regressions shall block production release according to severity policy.

### 7.21 Recovery verification

Recovery is accepted only when:

- procedure is executable;
- evidence exists;
- expected state is restored;
- operators can identify residual inconsistencies;
- reconciliation completes.

### 7.22 Release qualification matrix

| Area | Required |
|---|---|
| Functional regression | PASS |
| Security | PASS |
| Tenant isolation | PASS |
| Privacy | PASS |
| Performance | PASS |
| Load | PASS |
| Failure injection | PASS |
| Backup/restore | PASS |
| DR | PASS |
| Financial reconciliation | PASS |
| Booking reconciliation | PASS |
| Physical safety | PASS |
| Observability | PASS |
| Rollback | PASS |
| Support readiness | PASS |

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate that Kritva RaaS is production-operable rather than merely feature-complete.

### 8.2 Step 1 — Production health

Display:

    API = HEALTHY
    DATABASE = HEALTHY
    QUEUE = HEALTHY
    OBJECT STORAGE = HEALTHY
    WORKERS = HEALTHY
    LIVE = HEALTHY
    LAB = HEALTHY

### 8.3 Step 2 — Authenticate

Sign in using production authentication.

Verify:

- MFA where required;
- session;
- organization;
- permissions.

### 8.4 Step 3 — Create project

Create a production project.

Verify tenant ownership.

### 8.5 Step 4 — Build locally

Build application locally.

Verify:

    Source = LOCAL
    Artifact = GENERATED
    Upload = ARTIFACT ONLY

### 8.6 Step 5 — Validate artifact

Show:

    Signature = VALID
    Checksum = VALID
    Platform = COMPATIBLE
    Runtime = COMPATIBLE

### 8.7 Step 6 — Book robot

Select production platform.

Display:

- availability;
- rate;
- credit balance;
- quote.

Confirm booking.

Verify:

    Booking = CONFIRMED
    Credits = RESERVED

### 8.8 Step 7 — Execute

Start Job.

Observe:

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

### 8.9 Step 8 — Observe live operation

Display:

- video;
- telemetry;
- logs;
- safety;
- Run state.

### 8.10 Step 9 — Complete execution

Allow Run to complete.

Verify:

    Run = COMPLETED
    Resource = AVAILABLE
    Credits = CONSUMED

### 8.11 Step 10 — Results

Open Result.

Show:

- files;
- metrics;
- video;
- telemetry;
- logs.

### 8.12 Step 11 — Failure recovery

Terminate a non-critical worker.

Expected:

- worker restarts;
- queue work remains durable;
- operation continues.

### 8.13 Step 12 — Live reconnect

Restart live event infrastructure in controlled test conditions.

Expected:

- Studio reconnects;
- Run state rehydrates;
- execution continues.

### 8.14 Step 13 — Database recovery demonstration

Use staging or controlled production-rehearsal environment.

Demonstrate:

    Backup
       |
       v
    Failure
       |
       v
    Restore
       |
       v
    Validate
       |
       v
    Resume

### 8.15 Step 14 — Security demonstration

Attempt cross-tenant access.

Expected:

    ACCESS DENIED

Attempt unauthorized artifact operation.

Expected:

    ACCESS DENIED

Attempt unauthorized Result download.

Expected:

    ACCESS DENIED

### 8.16 Step 15 — Audit

Show audit records for:

- login;
- project;
- artifact;
- booking;
- credit;
- Job;
- Run;
- Result;
- administrative operation.

### 8.17 Step 16 — Canary

Deploy a new release to canary.

Monitor:

- error rate;
- latency;
- resource usage;
- queue;
- live connections;
- business metrics.

### 8.18 Step 17 — Rollback

Trigger controlled rollback.

Verify:

- previous version restored;
- data remains compatible;
- active Jobs are handled according to policy;
- monitoring returns to baseline.

### 8.19 Step 18 — Go/no-go

Review:

- security;
- performance;
- reliability;
- safety;
- support;
- financial integrity;
- customer readiness.

### 8.20 Demo completion

The P8 PRODUCTION demo passes when:

> A production candidate can be deployed, operated, monitored, recovered, rolled back and safely used through the complete RaaS lifecycle with evidence for security, reliability, scale, financial integrity and physical safety.

---
