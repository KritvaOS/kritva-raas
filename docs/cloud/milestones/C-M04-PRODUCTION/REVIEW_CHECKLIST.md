# C-M04-PRODUCTION — Review Checklist

Milestone: C-M04-PRODUCTION — Production Environment and Go-Live

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

Production qualification follows:

    Staging Evidence
          |
          v
    Infrastructure Validation
          |
          v
    Security Validation
          |
          v
    HA Validation
          |
          v
    Performance Validation
          |
          v
    DR Validation
          |
          v
    Operational Validation
          |
          v
    Go-Live Rehearsal
          |
          v
    Controlled Launch
          |
          v
    Post-Launch Validation

### 7.2 Infrastructure verification

Verify:

- IaC;
- network;
- IAM;
- compute;
- database;
- storage;
- queue;
- secrets;
- KMS;
- DNS;
- TLS;
- observability.

### 7.3 HA testing

At minimum test:

1. API instance failure;
2. API deployment restart;
3. worker failure;
4. worker pool reduction;
5. database failover;
6. queue consumer failure;
7. WebSocket instance failure;
8. object-storage temporary failure.

Expected result:

- service remains available where HA is promised;
- durable state is preserved;
- recovery is observable;
- no duplicate financial or physical action is introduced.

### 7.4 Database failover

Test:

    Application
        |
        v
    Primary DB
        |
    FAILOVER
        |
        v
    Standby / New Primary
        |
        v
    Connection Recovery
        |
        v
    Application Validation

Verify:

- application reconnect;
- transaction behavior;
- no silent data corruption;
- Job/Run state;
- credit ledger integrity;
- booking integrity.

### 7.5 Scaling tests

Test:

- API horizontal scale;
- worker horizontal scale;
- queue backlog;
- concurrent execution;
- database connection pressure;
- WebSocket connections.

Measure:

- latency;
- throughput;
- error rate;
- CPU;
- memory;
- queue depth;
- database connections;
- worker utilization.

### 7.6 Backup verification

Verify:

- scheduled backup;
- backup completion;
- retention;
- integrity;
- restore;
- representative data;
- application connectivity.

### 7.7 DR rehearsal

The Production DR rehearsal shall demonstrate the recovery path without depending on undocumented manual knowledge.

    Failure
       |
       v
    Declare Incident
       |
       v
    Stabilize
       |
       v
    Recover Infrastructure
       |
       v
    Recover Database
       |
       v
    Recover Application
       |
       v
    Recover Storage/Queue Dependencies
       |
       v
    Restore Connectivity
       |
       v
    Validate Data
       |
       v
    Validate Product
       |
       v
    Resume Service

### 7.8 RPO verification

The test shall identify:

- latest valid recovery point;
- failure time;
- recovered state;
- missing transactions, if any.

The observed data loss must be compared against the <=15 minute target.

### 7.9 RTO verification

Measure:

- incident declaration;
- recovery initiation;
- infrastructure restoration;
- database restoration/failover;
- application restoration;
- validation;
- service availability.

The measured value must be compared against the <=4 hour target.

### 7.10 Security verification

Production security tests shall include:

- external attack-surface review;
- authentication;
- authorization;
- tenant isolation;
- secrets;
- IAM;
- object storage;
- database network exposure;
- TLS;
- API rate limiting;
- artifact integrity;
- signing;
- audit;
- dependency vulnerabilities.

### 7.11 Monitoring verification

Each critical alert must be tested or otherwise validated.

For every alert verify:

- trigger;
- severity;
- destination;
- owner;
- acknowledgement;
- escalation;
- resolution;
- audit trail.

### 7.12 Incident simulation

At least one controlled Production incident simulation shall validate:

- detection;
- alerting;
- on-call response;
- triage;
- escalation;
- mitigation;
- recovery;
- communication;
- post-incident evidence.

### 7.13 Go-live rehearsal

The release team shall rehearse:

    Pre-check
       |
       v
    Backup
       |
       v
    Deploy
       |
       v
    Migrate
       |
       v
    Health Check
       |
       v
    Smoke Test
       |
       v
    Canary
       |
       v
    Observe
       |
       v
    Expand Traffic
       |
       v
    Validate
       |
       v
    Close Launch

### 7.14 Post-go-live validation

Immediately after launch verify:

- authentication;
- project access;
- platform catalog;
- artifact upload;
- booking;
- credit state;
- Job creation;
- Run execution;
- live telemetry;
- logs;
- results;
- audit;
- monitoring.

### 7.15 Evidence requirements

Production acceptance evidence shall include:

- release identifier;
- deployment logs;
- migration logs;
- infrastructure version;
- monitoring snapshots;
- security report;
- performance report;
- DR report;
- rollback report;
- go-live checklist;
- incident evidence;
- final approval.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate that Kritva RaaS Production is a live, highly available, observable, secure, recoverable, and operationally controlled service.

### 8.2 Step 1 — Show Production architecture

Display:

- network;
- load balancer;
- API instances;
- workers;
- PostgreSQL;
- queue;
- object storage;
- secrets;
- observability;
- Lab Agent.

Expected result:

All Production components and trust boundaries are visible.

### 8.3 Step 2 — Show deployment provenance

Display:

- release version;
- Git commit;
- artifact digest;
- database migration;
- infrastructure version.

Expected result:

The running Production release is fully traceable.

### 8.4 Step 3 — Show HA

Terminate or remove one API instance.

Expected result:

Traffic continues through healthy capacity.

### 8.5 Step 4 — Show worker recovery

Restart one worker.

Expected result:

Durable Job state remains intact and another worker can continue processing according to execution semantics.

### 8.6 Step 5 — Show database resilience

Execute an approved failover test in the controlled qualification window.

Expected result:

Database availability recovers within the tested operational target.

### 8.7 Step 6 — Show monitoring

Display:

- availability;
- latency;
- errors;
- database;
- queue;
- workers;
- Lab Agent;
- security;
- cost.

Expected result:

Operators can determine system health without direct server inspection.

### 8.8 Step 7 — Show alerting

Trigger a controlled alert.

Expected result:

Alert is generated, routed, acknowledged, and visible in the incident workflow.

### 8.9 Step 8 — Execute customer workflow

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
    Run
      |
      v
    Live Observation
      |
      v
    Result

Expected result:

Complete Production workflow succeeds.

### 8.10 Step 9 — Show financial integrity

Demonstrate:

- wallet;
- reservation;
- consumption;
- ledger;
- refund path where applicable.

Expected result:

Financial state remains transactionally consistent.

### 8.11 Step 10 — Show backup/recovery evidence

Display recent backup and restore evidence.

Expected result:

Production recovery capability is demonstrable.

### 8.12 Step 11 — Show DR rehearsal evidence

Display:

- failure scenario;
- recovery timeline;
- measured RPO;
- measured RTO;
- integrity validation.

Expected result:

Recovery objectives are evidence-based.

### 8.13 Step 12 — Show incident response

Trigger a controlled service fault.

Expected result:

Detection, alerting, response, mitigation, and recovery operate according to the runbook.

### 8.14 Step 13 — Show rollback

Perform a controlled rollback in an approved window.

Expected result:

Application returns to the known-good version without corrupting authoritative state.

### 8.15 Step 14 — Show go-live controls

Display:

- release approval;
- change record;
- deployment evidence;
- monitoring;
- on-call;
- rollback readiness.

Expected result:

Production operation is governed rather than ad hoc.

---
