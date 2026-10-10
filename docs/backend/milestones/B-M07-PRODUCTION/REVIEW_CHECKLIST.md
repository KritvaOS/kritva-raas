# B-M07-PRODUCTION — Review Checklist

Milestone: B-M07 — Production

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7 Test and Verification Plan

## 7.1 Verification Layers

    Static Analysis
          |
          v
    Unit Tests
          |
          v
    Integration Tests
          |
          v
    Security Tests
          |
          v
    Performance Tests
          |
          v
    Failure Injection
          |
          v
    DR Tests
          |
          v
    Staging Qualification
          |
          v
    Production Readiness Review

## 7.2 Security Testing

Perform:

- authentication bypass tests;
- authorization bypass tests;
- tenant escape tests;
- object-storage access tests;
- download manipulation tests;
- token replay tests;
- session invalidation tests;
- rate-limit tests;
- input fuzzing;
- upload abuse tests;
- secret-leak tests;
- dependency vulnerability tests.

## 7.3 Database Testing

Test:

- connection exhaustion;
- deadlocks;
- lock contention;
- transaction rollback;
- migration compatibility;
- PITR;
- restore;
- failover;
- replica lag where applicable;
- backup corruption detection.

## 7.4 Booking Concurrency Test

Execute concurrent requests:

    Resource R1
       |
       +--> Booking A
       +--> Booking B
       +--> Booking C

Expected:

- no overlapping confirmed allocations;
- one valid winner where requests conflict;
- no credit double-consumption;
- no inconsistent booking state.

## 7.5 Credit Concurrency Test

Execute:

    Wallet W1
       |
       +--> Reservation A
       +--> Reservation B
       +--> Consumption C
       +--> Refund D

Expected:

- ledger remains balanced;
- wallet projection remains correct;
- no double-spend;
- idempotent retry.

## 7.6 Execution Load Test

Measure:

- concurrent Jobs;
- concurrent Runs;
- queue latency;
- worker utilization;
- database load;
- Lab Agent connections;
- Run completion latency.

## 7.7 Telemetry Load Test

Measure:

- samples/sec;
- concurrent streams;
- burst behavior;
- persistence latency;
- CPU;
- memory;
- storage growth;
- backpressure;
- data loss.

## 7.8 WebSocket Load Test

Test:

- thousands of simulated connections where required;
- authentication;
- subscription authorization;
- reconnect storms;
- event fan-out;
- backpressure;
- server restart.

## 7.9 Failure Injection

Inject:

- API instance termination;
- worker termination;
- database failover;
- queue failure;
- object-storage failure;
- DNS failure where testable;
- Lab Agent disconnect;
- network partition;
- credential expiration;
- expired signing key;
- storage quota exhaustion.

Expected behavior must be documented per failure.

## 7.10 Database Failover Test

    API
      |
      v
    DB Primary
      |
      X
    Failure
      |
      v
    DB Failover
      |
      v
    Application Reconnect
      |
      v
    Continue

Verify:

- no corruption;
- safe transaction retry;
- no duplicate financial operation;
- no booking double allocation.

## 7.11 Disaster Recovery Test

Scenario:

    Production Database
           |
           X
        Failure
           |
           v
    Restore Environment
           |
           v
    PITR / Backup Restore
           |
           v
    Application Reconnect
           |
           v
    Validation
           |
           v
    Service Recovery

Measure:

- actual RPO;
- actual RTO;
- missing transactions;
- missing files;
- missing audit records;
- configuration recovery.

## 7.12 Deployment Test

Perform:

    Release N
       |
       v
    Release N+1
       |
       v
    Smoke Tests
       |
       +--> PASS -> Continue
       |
       +--> FAIL -> Rollback

Verify rollback does not corrupt the database.

## 7.13 Migration Test

Every migration must be tested against:

- current production-like schema;
- representative data volume;
- active application version;
- previous application version;
- next application version where required.

## 7.14 Soak Test

Run the production-like system continuously for an agreed qualification
period.

Monitor:

- memory;
- CPU;
- DB connections;
- queue depth;
- worker health;
- WebSocket count;
- telemetry ingestion;
- storage growth;
- error rate.

No unexplained resource leak may remain.

## 7.15 Security Regression

Security tests must execute on every release candidate.

Minimum:

- tenant isolation;
- authz;
- artifact access;
- result access;
- download access;
- secret scanning;
- dependency scanning.

## 7.16 Operational Readiness Test

Operators must successfully execute:

- deploy;
- rollback;
- restart;
- scale;
- inspect health;
- inspect logs;
- inspect metrics;
- acknowledge alert;
- restore backup;
- execute incident runbook.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate a production-like environment operating under normal load, failure,
security and recovery conditions.

## 8.2 Step 1 — Production Deployment

Deploy the release candidate.

Expected:

- automated deployment;
- migrations;
- health checks;
- application ready;
- dashboards populated.

## 8.3 Step 2 — Authentication

Login as:

- Organization Owner;
- Organization Member;
- Platform Operator;
- Lab Operator.

Expected:

- correct permissions;
- unauthorized actions denied.

## 8.4 Step 3 — Tenant Isolation

Create:

    Organization A
    Organization B

Attempt cross-tenant access.

Expected:

    HTTP 403 / 404 according to resource-disclosure policy

No data leakage.

## 8.5 Step 4 — Execute RaaS Flow

Run:

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
    Run
      |
      v
    Result

Expected full lifecycle completion.

## 8.6 Step 5 — Observability

Show:

- request trace;
- Job trace;
- Run trace;
- database query metrics;
- queue metrics;
- Lab Agent heartbeat;
- Result processing metrics.

## 8.7 Step 6 — Failure Injection

Terminate one API instance.

Expected:

- load balancer removes instance;
- traffic continues;
- no business-state corruption.

## 8.8 Step 7 — Worker Failure

Terminate a worker during asynchronous processing.

Expected:

- message becomes available again;
- another worker claims it;
- operation completes idempotently.

## 8.9 Step 8 — Database Failover

Perform controlled database failover.

Expected:

- application reconnects;
- transactions remain consistent;
- no duplicate booking/credit operation.

## 8.10 Step 9 — Backup and Restore

Restore a production-like database snapshot/PITR point.

Expected:

- data is restored;
- checksums/record counts are validated;
- recovery time is recorded.

## 8.11 Step 10 — Release Rollback

Deploy a deliberately failed release candidate.

Expected:

- smoke test fails;
- rollback is triggered;
- service returns to previous known-good version.

## 8.12 Step 11 — Security Alert

Trigger a controlled security policy violation.

Expected:

- event is logged;
- alert fires;
- operator can locate the event;
- audit trail is preserved.

## 8.13 Step 12 — Load

Run representative concurrent workloads.

Expected:

- SLO targets met;
- no uncontrolled queue growth;
- database remains within connection budget;
- no unacceptable resource exhaustion.

## 8.14 Demo Success Criteria

The production demo passes when:

- deployment works;
- authorization works;
- tenant isolation works;
- normal RaaS flow works;
- observability works;
- instance failure is tolerated;
- worker failure is recovered;
- database recovery is validated;
- backup restore works;
- rollback works;
- security alerting works;
- load qualification passes.

---
