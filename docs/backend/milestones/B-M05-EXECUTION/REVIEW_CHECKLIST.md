# B-M05-EXECUTION — Review Checklist

Milestone: B-M05 — Execution

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

## 7.1 Test Pyramid

    Unit Tests
       |
       v
    State Machine Tests
       |
       v
    Repository Tests
       |
       v
    Queue/Worker Tests
       |
       v
    Lab Agent Contract Tests
       |
       v
    Integration Tests
       |
       v
    Fault Injection
       |
       v
    End-to-End Tests
       |
       v
    Load / Concurrency Tests

## 7.2 Job State Tests

Every valid transition must be tested.

Example:

    CREATED -> QUEUED
    QUEUED -> VALIDATING
    VALIDATING -> ALLOCATING
    ALLOCATING -> DEPLOYING
    DEPLOYING -> STARTING
    STARTING -> RUNNING
    RUNNING -> STOPPING
    STOPPING -> COMPLETED

Alternative:

    VALIDATING -> FAILED
    DEPLOYING -> FAILED
    STARTING -> FAILED
    RUNNING -> FAILED
    RUNNING -> TIMEOUT
    RUNNING -> CANCELLED

Invalid transitions must fail deterministically.

## 7.3 Run State Tests

Verify:

- creation;
- preparing;
- starting;
- running;
- stopping;
- completed;
- failed;
- timeout;
- cancelled.

Run state must not be inferred solely from Job state.

## 7.4 Queue Tests

Test:

- publish;
- receive;
- acknowledgement;
- retry;
- duplicate message;
- dead letter;
- consumer restart;
- queue outage.

## 7.5 Worker Tests

Test:

- worker startup;
- claim;
- concurrent claim;
- heartbeat;
- graceful shutdown;
- crash;
- stale claim;
- recovery.

## 7.6 Simulated Lab Agent Tests

Test:

- successful deployment;
- deployment failure;
- startup success;
- startup failure;
- running;
- stop;
- timeout;
- disconnect;
- resource fault;
- cleanup.

## 7.7 Eligibility Tests

Test:

- unauthorized Project;
- unauthorized artifact;
- invalid artifact;
- revoked artifact;
- incompatible platform;
- incompatible architecture;
- expired booking;
- cancelled booking;
- missing allocation;
- resource FAULT;
- resource OFFLINE.

Expected result:

    Execution Rejected

with an explicit reason.

## 7.8 Timeout Tests

Test:

    Queue timeout
    Validation timeout
    Deployment timeout
    Startup timeout
    Execution timeout
    Cleanup timeout

Verify:

- durable TIMEOUT state;
- controlled stop;
- cleanup;
- credit policy;
- audit.

## 7.9 Worker Crash Test

Scenario:

    Job RUNNING
       |
       v
    Worker Crash
       |
       v
    Worker Heartbeat Expires
       |
       v
    Recovery
       |
       v
    Reconcile Run
       |
       v
    Resume / Stop / Fail

The recovery policy must be explicit.

The system must not automatically start a duplicate physical execution merely
because a worker disappeared.

## 7.10 Duplicate Message Test

Send the same queue message twice.

Expected:

    One logical execution attempt

or a deterministic duplicate detection outcome.

No duplicate resource deployment may occur.

## 7.11 Duplicate Start Test

Send:

    startRun(run-001)

multiple times.

Expected:

- one execution;
- deterministic response;
- no duplicate Lab Agent start.

## 7.12 Duplicate Stop Test

Send:

    stopRun(run-001)

multiple times.

Expected:

- one logical stop;
- idempotent result;
- no repeated unsafe stop sequence.

## 7.13 Booking Boundary Tests

Test:

- execution before booking start;
- execution exactly at start;
- execution during booking;
- execution at end;
- execution after end.

Policy must be explicit.

## 7.14 Credit Integration Tests

Verify:

    Booking
       |
       v
    Reservation
       |
       v
    Job
       |
       v
    Run
       |
       v
    Consumption / Release

No direct mutation of credit tables from Job handlers.

## 7.15 Tenant Isolation Tests

Create:

    Organization A
       |
       +--> Booking A
       +--> Artifact A
       +--> Job A
       +--> Run A

    Organization B
       |
       +--> Booking B
       +--> Artifact B
       +--> Job B
       +--> Run B

Verify A cannot:

- read B's Job;
- read B's Run;
- start B's Run;
- stop B's Run;
- access B's artifact.

## 7.16 Execution E2E Test

Primary path:

    Login
      |
      v
    Project
      |
      v
    Artifact
      |
      v
    Confirmed Booking
      |
      v
    Create Job
      |
      v
    Queue
      |
      v
    Worker
      |
      v
    Validate
      |
      v
    Allocate
      |
      v
    Deploy
      |
      v
    Start
      |
      v
    Run
      |
      v
    Complete
      |
      v
    Cleanup

## 7.17 Cancellation E2E Test

    RUNNING
       |
       v
    Cancel
       |
       v
    STOPPING
       |
       v
    Lab Agent Stop
       |
       v
    CANCELLED
       |
       v
    Cleanup

Verify credit policy and booking state.

## 7.18 Timeout E2E Test

    RUNNING
       |
       v
    Deadline
       |
       v
    TIMEOUT
       |
       v
    STOP
       |
       v
    CLEANUP
       |
       v
    Final State

## 7.19 Fault Injection Matrix

| Fault | Expected Result |
|---|---|
| Queue unavailable | Job remains durable |
| Worker crash | Job recoverable |
| Lab disconnect | Run failure/recovery policy |
| Deployment failure | FAILED |
| Startup failure | FAILED |
| Execution timeout | TIMEOUT |
| Stop timeout | Failure/escalation |
| Resource fault | Controlled failure |
| Duplicate command | Idempotent |
| Duplicate event | Safe |

## 7.20 Performance Baseline

Initial targets:

| Operation | Target |
|---|---:|
| Job creation p95 | <500 ms |
| Queue enqueue p95 | <500 ms |
| Job claim p95 | <500 ms |
| Eligibility validation p95 | <1 s |
| Start command p95 | <1 s excluding Lab Agent |
| Stop command p95 | <1 s excluding Lab Agent |
| Durable state update p95 | <500 ms |
| Worker recovery detection | <30 s |

Execution duration itself is workload-dependent.

## 7.21 Observability Verification

Verify metrics exist for:

- queued Jobs;
- active Jobs;
- Job failures;
- Run failures;
- timeout count;
- queue depth;
- worker count;
- worker utilization;
- claim latency;
- deployment latency;
- startup latency;
- execution duration;
- cleanup failures;
- Lab Agent errors;
- retry count;
- dead-letter count.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate the complete software-only execution path from a confirmed booking
through queueing, worker execution, simulated Lab Agent deployment, Run
execution, completion and cleanup.

## 8.2 Preparation

- [ ] Organization exists.
- [ ] Project exists.
- [ ] Signed artifact exists.
- [ ] Platform exists.
- [ ] Resource exists.
- [ ] Confirmed booking exists.
- [ ] Credit reservation exists.
- [ ] Simulated Lab Agent is running.
- [ ] Worker is running.

## 8.3 Step 1 — Create Job

Request:

    booking_id = booking-001
    artifact_id = artifact-001

Expected:

    Job = CREATED

## 8.4 Step 2 — Queue

Submit Job.

Expected:

    Job = QUEUED

Queue contains an execution message.

## 8.5 Step 3 — Worker Claim

Worker receives the message.

Expected:

    Job = VALIDATING

Only one worker owns the Job.

## 8.6 Step 4 — Eligibility

Validate:

- artifact;
- signature;
- compatibility;
- booking;
- resource;
- authorization.

Expected:

    Eligibility = PASS

## 8.7 Step 5 — Allocation

Expected:

    Job = ALLOCATING

Resource allocation is validated.

## 8.8 Step 6 — Deployment

Worker calls simulated Lab Agent.

Expected:

    Job = DEPLOYING

Artifact is deployed.

## 8.9 Step 7 — Start

Expected:

    Job = STARTING
    Run = STARTING

Then:

    Job = RUNNING
    Run = RUNNING

## 8.10 Step 8 — Execute

Simulated runtime executes for a deterministic period.

Observe:

- Job state;
- Run state;
- timestamps;
- resource;
- worker;
- Lab Agent.

## 8.11 Step 9 — Complete

Simulated runtime exits successfully.

Expected:

    Run = COMPLETED
    Job = COMPLETED

## 8.12 Step 10 — Cleanup

Expected:

- Lab Agent state cleaned;
- worker claim released;
- temporary execution state removed;
- resource returned to expected state.

## 8.13 Step 11 — Timeout

Repeat with simulated workload exceeding timeout.

Expected:

    Run = TIMEOUT
    Job = TIMEOUT

Then:

    Stop
    Cleanup

## 8.14 Step 12 — Cancellation

Repeat execution and issue software stop.

Expected:

    RUNNING
       |
       v
    STOPPING
       |
       v
    CANCELLED / STOPPED

The UI/backend must not claim that an E-stop occurred.

## 8.15 Step 13 — Worker Failure

Start another Job.

Terminate worker during execution.

Expected:

- worker heartbeat expires;
- Job remains recoverable;
- system reconciles execution;
- duplicate physical execution is not created.

## 8.16 Demo Success Criteria

The demo passes when:

- Job is created;
- Job is queued;
- worker claims it;
- eligibility succeeds;
- simulated Lab Agent deploys;
- Run starts;
- Run completes;
- cleanup occurs;
- timeout works;
- cancellation works;
- worker recovery works;
- no duplicate execution occurs.

---
