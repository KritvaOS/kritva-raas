# PHASE-5-EXECUTION — Review Checklist

Milestone: PHASE-5-EXECUTION — Remote Execution, Jobs, Runs and Simulated Robot Environment

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

### 7.1 Test architecture

    Unit
      |
      v
    State Machine
      |
      v
    Repository
      |
      v
    Service
      |
      v
    Queue / Worker
      |
      v
    Simulated Lab
      |
      v
    Sandbox
      |
      v
    Full E2E
      |
      v
    Failure / Recovery

### 7.2 Job state tests

Test every legal transition.

Attempt every major illegal transition.

Expected:

    Illegal Transition -> REJECTED

### 7.3 Run state tests

Verify:

- Run cannot start without Job;
- Run cannot start without eligible artifact;
- Run cannot start without resource allocation;
- Run cannot become RUNNING before STARTING;
- terminal Run cannot restart.

### 7.4 Eligibility tests

Test:

- invalid artifact;
- unsigned artifact;
- revoked artifact;
- incompatible architecture;
- incompatible runtime;
- expired booking;
- cancelled booking;
- missing allocation;
- resource fault;
- unauthorized user.

Every failure must block execution.

### 7.5 Queue tests

Test:

- normal delivery;
- duplicate delivery;
- delayed delivery;
- negative acknowledgement;
- retry;
- dead-letter;
- worker crash.

### 7.6 Worker recovery tests

Simulate:

    Worker
      |
      v
    CLAIMED
      |
      X
    Worker Crash

Expected:

    stale claim detected
          |
          v
    recovery policy
          |
          v
    execution continues OR
    execution safely fails

No duplicate Run is created.

### 7.7 Sandbox tests

Attempt:

- host filesystem access;
- host process inspection;
- environment-variable access;
- credential access;
- unrestricted network;
- excessive CPU;
- excessive memory;
- excessive disk;
- fork/process abuse;
- oversized logs.

Expected policy enforcement.

### 7.8 Fault injection

Required simulated faults:

    SUCCESS
    DEPLOY_FAILURE
    START_FAILURE
    RUNTIME_FAILURE
    TIMEOUT
    DISCONNECT
    RESOURCE_FAULT
    STOP_DELAY
    CLEANUP_FAILURE

Each fault shall map to deterministic Job/Run behavior.

### 7.9 Timeout tests

Test:

- short execution;
- exact timeout boundary;
- execution overrun;
- stop delay;
- cleanup delay.

Verify timeout state and resource release.

### 7.10 Cancellation tests

Test cancellation at:

- CREATED;
- QUEUED;
- VALIDATING;
- ALLOCATING;
- DEPLOYING;
- STARTING;
- RUNNING.

Verify legal behavior for each state.

### 7.11 Stop tests

Test:

    RUNNING
       |
       v
    STOPPING
       |
       v
    STOPPED

Test delayed stop and stop retry.

### 7.12 Credit tests

Verify:

- one consumption;
- duplicate consumption;
- failed execution;
- cancelled execution;
- timeout;
- resource fault.

No credit operation may be duplicated.

### 7.13 Tenant tests

Test execution access across two organizations.

Expected:

    Org A artifact + Org B identity = DENIED

Repeat for Job, Run and logs.

### 7.14 API tests

Validate:

- create Job;
- get Job;
- cancel Job;
- get Run;
- stop Run;
- events;
- authorization;
- idempotency.

### 7.15 Reconnect tests

Disconnect Studio during RUNNING.

Expected:

- Run continues;
- robot continues according to execution policy;
- Studio reconnects;
- durable state is recovered;
- no second Run is created.

### 7.16 Lab Agent disconnect tests

Disconnect Lab Agent during:

- deployment;
- startup;
- execution;
- cleanup.

Expected behavior is explicit and safe.

Unknown physical state shall not be treated as safe physical state in future implementations.

### 7.17 Performance tests

Initial targets:

| Operation | Target |
|---|---:|
| Job create | p95 < 750 ms |
| Job status | p95 < 500 ms |
| Run status | p95 < 500 ms |
| Stop request | p95 < 750 ms excluding execution stop |
| Eligibility validation | p95 < 1 s |
| Queue enqueue | p95 < 250 ms |
| Worker claim | p95 < 500 ms |

Execution duration itself is excluded from API latency targets.

### 7.18 Security tests

Verify:

- sandbox escape resistance;
- credential isolation;
- tenant isolation;
- artifact authorization;
- execution authorization;
- network restrictions;
- resource limits;
- audit.

### 7.19 Evidence

Required evidence:

- state-machine test report;
- queue test report;
- worker recovery report;
- sandbox security report;
- fault-injection report;
- timeout report;
- cancellation report;
- credit integration report;
- tenant isolation report;
- Studio E2E report;
- architecture review;
- security review.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate remote execution of a signed `.krv` artifact on a simulated robot through the real Control Plane execution path.

### 8.2 Step 1 — Prepare environment

Start:

    PostgreSQL
    Object Storage
    Queue
    Control Plane
    Execution Worker
    Simulated Lab Agent
    Simulated Robot
    Studio

Expected:

    All services = READY

### 8.3 Step 2 — Select project

Open an existing project.

Expected:

    Project = ACTIVE

### 8.4 Step 3 — Select artifact

Select:

    demo-robot-1.0.0.krv

Expected:

    Artifact = APPROVED
    Signature = VALID
    Compatibility = VALID

### 8.5 Step 4 — Select booking

Select confirmed booking.

Expected:

    Booking = CONFIRMED
    Allocation = CONFIRMED
    Resource = AVAILABLE/RESERVED

### 8.6 Step 5 — Start Job

Press:

    Run

Expected:

    Job = CREATED

Then:

    QUEUED
    VALIDATING
    ALLOCATING
    DEPLOYING
    STARTING
    RUNNING

### 8.7 Step 6 — Observe Run

Studio displays:

- Job ID;
- Run ID;
- artifact;
- platform;
- resource;
- status;
- elapsed time;
- logs;
- execution state.

### 8.8 Step 7 — Observe simulated robot

Simulated robot shows:

    READY
       |
       v
    RUNNING
       |
       v
    TASK COMPLETE

No physical hardware is involved.

### 8.9 Step 8 — Verify sandbox

Demonstrate:

- source is absent;
- host filesystem is unavailable;
- host credentials are unavailable;
- network policy is enforced.

### 8.10 Step 9 — Stop execution

Press:

    STOP EXECUTION

Expected:

    RUNNING
       |
       v
    STOPPING
       |
       v
    STOPPED

The UI must not label this operation as emergency stop.

### 8.11 Step 10 — Run completion

Repeat with a short deterministic application.

Expected:

    Job = COMPLETED
    Run = COMPLETED

### 8.12 Step 11 — Collect result

Execution result metadata is created.

Expected:

    Result Handoff = AVAILABLE

The complete Results domain may be finalized by Phase 6.

### 8.13 Step 12 — Credit verification

Expected:

    Consumption = exactly once

Wallet and ledger remain consistent.

### 8.14 Step 13 — Failure demonstration

Run an artifact configured to trigger:

    RUNTIME_FAILURE

Expected:

    Run = FAILED
    Job = FAILED
    Cleanup = EXECUTED
    Resource = RELEASED

### 8.15 Step 14 — Timeout demonstration

Configure:

    Execution Timeout = 10 seconds
    Application Runtime = 30 seconds

Expected:

    Run = TIMEOUT
    Cleanup = EXECUTED
    Resource = RELEASED

### 8.16 Step 15 — Worker failure demonstration

Terminate worker during execution.

Expected:

- durable state remains;
- stale claim is detected;
- recovery policy executes;
- no unintended duplicate Run occurs.

### 8.17 Step 16 — Tenant isolation

Log in as another organization.

Attempt to access the Run.

Expected:

    DENIED

### 8.18 Demo completion

Phase 5 demo passes when:

    Approved Artifact
          |
          v
    Confirmed Booking
          |
          v
    Job
          |
          v
    Simulated Lab Agent
          |
          v
    Sandbox
          |
          v
    Simulated Robot
          |
          v
    Run
          |
          v
    Result Handoff
          |
          v
    Credit Reconciliation

completes using real persistent state.

---
