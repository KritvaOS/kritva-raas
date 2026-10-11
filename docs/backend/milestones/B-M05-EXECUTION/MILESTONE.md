# B-M05 — Execution

## Milestone Dossier

**Milestone ID:** B-M05-EXECUTION  
**Product:** Kritva RaaS  
**Primary Phase:** P5 EXECUTION  
**Supporting Phases:** None  
**Primary Surface:** RaaS Control Plane / Backend  
**Technology:** TypeScript/Node.js, PostgreSQL, REST API v1, WebSocket events, provider-neutral queue/worker adapters  
**Architecture:** Production-oriented Modular Monolith with asynchronous workers  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** Establish the authoritative Job and Run execution system that validates a confirmed booking and compatible artifact, allocates the target resource, deploys through a simulated Lab Agent, executes a workload, enforces lifecycle and timeout rules, records durable execution state, and provides the foundation for later physical robot execution.

---

# 1 Objective

## 1.1 Milestone Objective

B-M05 establishes the execution control plane for Kritva RaaS.

The milestone connects the previously established domains:

    Project
       |
       v
    Artifact
       |
       v
    Platform Compatibility
       |
       v
    Confirmed Booking
       |
       v
    Resource Allocation
       |
       v
    Job
       |
       v
    Queue
       |
       v
    Worker
       |
       v
    Execution Service
       |
       v
    Lab Agent
       |
       v
    Runtime
       |
       v
    Run
       |
       v
    Result

The first implementation uses a simulated Lab Agent and simulated execution
environment.

The architecture must nevertheless be production-oriented so that the
simulated Lab Agent can later be replaced or supplemented by a real Lab Agent
without changing the Job/Run domain contracts.

## 1.2 Product Goal

The user must be able to submit an eligible execution request against a
confirmed booking and observe the workload progress through a deterministic
execution lifecycle.

The backend must establish:

- Job identity;
- Run identity;
- execution eligibility;
- queueing;
- worker dispatch;
- resource allocation;
- Lab Agent interaction;
- timeout enforcement;
- cancellation;
- failure handling;
- durable state;
- audit evidence;
- idempotent commands.

## 1.3 Job vs Run Principle

A Job represents the control-plane execution request.

A Run represents an actual execution attempt.

Therefore:

    Job
      |
      +--> Run 1
      |
      +--> Run 2
      |
      +--> Run 3

A Job may be retried or may result in multiple Run attempts where policy
permits.

A Run must preserve the execution attempt's historical context.

## 1.4 Job Objective

A Job captures:

- Organization;
- Project;
- artifact;
- booking;
- target platform;
- target platform version;
- resource;
- execution request;
- policy;
- requested timeout;
- lifecycle state;
- idempotency identity.

The Job is the authoritative execution orchestration object.

## 1.5 Run Objective

A Run captures:

- execution attempt;
- resolved artifact;
- resolved platform;
- resolved resource;
- runtime information;
- start/end times;
- exit status;
- failure information;
- timeout information;
- execution metadata.

Historical Run data must remain meaningful even if the platform or resource
catalog changes later.

## 1.6 Execution Eligibility

Before execution begins:

    Job Request
         |
         v
    Authorization
         |
         v
    Project
         |
         v
    Artifact
         |
         v
    Artifact Trust
         |
         v
    Booking
         |
         v
    Resource Allocation
         |
         v
    Compatibility
         |
         v
    Resource State
         |
         v
    Execution Policy
         |
         v
    QUEUED / REJECTED

No single UI state may be treated as sufficient authorization to execute.

## 1.7 Queue Objective

The queue separates:

- request acceptance;
- durable Job state;
- scheduling;
- worker execution.

The queue is not authoritative business state.

Conceptually:

    API
      |
      v
    Job CREATED
      |
      v
    Queue
      |
      v
    Worker
      |
      v
    Execution Service

If the queue is unavailable, durable Job state remains available for recovery.

## 1.8 Worker Objective

Workers perform asynchronous execution orchestration.

Workers must:

- claim Jobs safely;
- enforce concurrency;
- validate execution state;
- invoke Execution Service;
- report progress;
- handle retries;
- handle timeouts;
- release resources;
- preserve idempotency.

Workers must not directly bypass domain services.

## 1.9 Execution Service Objective

The Execution Service coordinates:

- artifact validation;
- resource validation;
- Lab Agent dispatch;
- runtime start;
- Run lifecycle;
- timeout;
- stop;
- cleanup;
- result handoff.

The service is the backend boundary between the control plane and execution
environment.

## 1.10 Simulated Lab Agent Objective

The simulated Lab Agent reproduces the contract expected from a real Lab Agent.

It must support:

- registration;
- authentication abstraction;
- resource discovery;
- deploy;
- start;
- stop;
- status;
- execution result;
- timeout/fault simulation.

The simulator must not introduce contracts that cannot reasonably be supported
by the physical Lab Agent.

## 1.11 Timeout Objective

Execution must have explicit timeout semantics.

Timeouts must protect:

- robot/resource capacity;
- worker capacity;
- user expectations;
- credit accounting;
- system availability.

Timeouts must be represented as durable state.

## 1.12 Safety Boundary

B-M05 controls software execution.

It does not own physical safety authority.

Therefore:

    Software Stop
        !=
    Emergency Stop

The backend must never claim that a successful Job cancellation means the
physical E-stop has been activated.

The local runtime/Lab Agent/physical safety system remains authoritative for
physical safety.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M05 includes:

- Job domain;
- Run domain;
- Job state machine;
- Run state machine;
- execution API;
- execution eligibility;
- queue abstraction;
- queue persistence/recovery;
- worker abstraction;
- worker concurrency;
- Job claiming;
- execution service;
- simulated Lab Agent;
- simulated runtime;
- deploy/start/stop/status contract;
- Run lifecycle;
- timeout handling;
- cancellation;
- retry policy;
- failure handling;
- resource cleanup;
- booking validation;
- artifact validation;
- compatibility validation;
- authorization;
- execution audit;
- execution events;
- idempotency;
- reconciliation;
- execution metrics;
- integration tests.

## 2.2 Explicitly Out of Scope

B-M05 does not implement:

- physical robot deployment;
- real Lab Agent production deployment;
- motor control;
- E-stop hardware;
- WebRTC;
- production telemetry streaming;
- production result analytics;
- experiment comparison;
- billing UI;
- subscription management;
- local Studio build;
- source-code upload.

## 2.3 Simulated First Principle

The first execution environment is:

    Control Plane
         |
         v
    Queue
         |
         v
    Worker
         |
         v
    Execution Service
         |
         v
    Simulated Lab Agent
         |
         v
    Simulated Runtime
         |
         v
    Simulated Resource

The contract must remain compatible with:

    Control Plane
         |
         v
    Real Lab Agent
         |
         v
    Kritva Runtime
         |
         v
    Physical Robot

## 2.4 Durable State vs Queue

The queue provides delivery.

PostgreSQL provides authoritative Job/Run state.

Therefore:

    Queue message lost
         |
         v
    Recovery from durable Job state

The system must not depend on an in-memory queue for business truth.

## 2.5 Execution Command vs State

A command requests a transition.

A state records the authoritative result.

For example:

    job.start
       |
       v
    STARTING
       |
       v
    RUNNING

The presence of a start request does not mean the Job is RUNNING.

---

# 3 Dependencies

## 3.1 Upstream Milestones

B-M05 depends on:

- B-M01 Control Plane;
- B-M02 Artifact;
- B-M03 Platform;
- B-M04 Booking;
- PostgreSQL;
- authentication;
- authorization;
- audit;
- idempotency;
- queue abstraction;
- object storage for artifacts.

## 3.2 Artifact Dependency

B-M02 provides:

- artifact identity;
- artifact status;
- checksum;
- signature;
- platform;
- architecture;
- runtime;
- SDK;
- capabilities;
- execution metadata.

B-M05 must validate artifact eligibility before deployment.

## 3.3 Booking Dependency

B-M04 provides:

- confirmed booking;
- time interval;
- resource allocation;
- credit reservation;
- cancellation state.

Execution cannot proceed against an invalid or cancelled booking.

## 3.4 Platform Dependency

B-M03 provides:

- Platform;
- Platform Version;
- Architecture;
- Capability;
- Resource;
- Robot;
- Lab;
- resource state;
- compatibility service.

## 3.5 Credit Dependency

B-M04 provides:

- credit reservation;
- consumption policy;
- release;
- refund;
- billing references.

B-M05 must not directly mutate credit tables without the credit application
service.

## 3.6 Live Dependency

F-M06 later consumes B-M05 events for:

- Job status;
- Run status;
- logs;
- telemetry;
- Lab status;
- safety status.

B-M05 establishes the durable state and event semantics.

---

# 4 Deliverables

## 4.1 Job Domain

The Job domain owns:

- Job identity;
- Organization;
- Project;
- Booking;
- Artifact;
- Platform;
- Resource;
- lifecycle;
- policy;
- timeout;
- retry;
- execution request.

## 4.2 Job Lifecycle

Baseline lifecycle:

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
       |
       v
    STOPPING
       |
       v
    COMPLETED

Alternative terminal states:

    FAILED
    CANCELLED
    TIMEOUT

The implementation may use additional internal states only if they are
explicitly documented and do not weaken the public contract.

## 4.3 Run Lifecycle

Conceptual lifecycle:

    CREATED
       |
       v
    PREPARING
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       v
    STOPPING
       |
       v
    STOPPED

Alternative terminal states:

    COMPLETED
    FAILED
    TIMEOUT
    CANCELLED

The exact mapping between Job and Run terminal states must be explicit.

## 4.4 Job/Run Relationship

A Job represents the requested execution.

A Run represents an attempt.

Example:

    Job J1
      |
      +--> Run R1 FAILED
      |
      +--> Run R2 COMPLETED

The first implementation may allow one Run per Job if retry is not yet
enabled, but the domain must not structurally prevent future multiple Runs.

## 4.5 Execution Request

Conceptual:

    {
        "booking_id": "booking-001",
        "artifact_id": "artifact-001",
        "execution_policy": {
            "timeout_seconds": 1800,
            "retry_policy": "NO_RETRY"
        },
        "metadata": {}
    }

The server derives the authoritative:

- platform;
- resource;
- configuration;
- runtime;
- SDK;
- execution constraints.

## 4.6 Execution Eligibility

Eligibility checks:

    Authorization
         |
         v
    Booking Status
         |
         v
    Booking Window
         |
         v
    Resource Allocation
         |
         v
    Artifact Status
         |
         v
    Artifact Signature
         |
         v
    Compatibility
         |
         v
    Resource State
         |
         v
    Policy
         |
         v
    ELIGIBLE

Any mandatory failure prevents execution.

## 4.7 Queue Abstraction

Conceptual interface:

    Queue.publish(JobExecutionMessage)
    Queue.receive()
    Queue.ack(message)
    Queue.nack(message)
    Queue.retry(message)
    Queue.deadLetter(message)

The queue implementation is provider-neutral.

## 4.8 Queue Message

Conceptual:

    {
        "message_id": "msg-001",
        "job_id": "job-001",
        "attempt": 1,
        "created_at": "2026-10-08T20:00:00Z",
        "trace_id": "trace-001",
        "protocol_version": "1.0"
    }

The message contains references, not a duplicate copy of authoritative Job
state.

## 4.9 Worker

Worker lifecycle:

    STARTING
       |
       v
    READY
       |
       v
    CLAIMING
       |
       v
    EXECUTING
       |
       v
    RELEASING
       |
       v
    READY

Worker failure must not leave a Job permanently stuck.

## 4.10 Job Claiming

Claiming must be concurrency-safe.

Conceptually:

    Job QUEUED
       |
       v
    Worker A claims
       |
       +--> Worker B cannot claim
       |
       v
    Job VALIDATING

The claim must be represented durably or recoverably.

## 4.11 Execution Service

The service coordinates:

    Job
     |
     +--> Validate
     |
     +--> Allocate
     |
     +--> Deploy
     |
     +--> Start
     |
     +--> Monitor
     |
     +--> Stop
     |
     +--> Cleanup
     |
     +--> Complete

It owns orchestration, not physical control.

## 4.12 Lab Agent Interface

Conceptual interface:

    register()
    heartbeat()
    getResourceStatus()
    validateArtifact()
    deployArtifact()
    startRun()
    stopRun()
    getRunStatus()
    collectExecutionResult()
    cleanupRun()

The physical implementation must be able to implement equivalent semantics.

## 4.13 Simulated Lab Agent

The simulator must support:

- deterministic success;
- configurable duration;
- startup delay;
- deployment delay;
- simulated failure;
- simulated timeout;
- disconnect;
- resource fault;
- stop acknowledgement.

Fault injection is mandatory for qualification.

## 4.14 Deployment

Deployment flow:

    Job
      |
      v
    Artifact Validation
      |
      v
    Lab Agent
      |
      v
    Artifact Transfer
      |
      v
    Integrity Check
      |
      v
    Deployment Complete

Source code is never required by the execution service.

## 4.15 Start

Start flow:

    Deployment Complete
          |
          v
    Booking Window Check
          |
          v
    Resource Check
          |
          v
    Start Request
          |
          v
    Run STARTING
          |
          v
    Run RUNNING

## 4.16 Stop

Software stop flow:

    RUNNING
       |
       v
    STOP REQUEST
       |
       v
    STOPPING
       |
       v
    STOPPED / COMPLETED

Software stop is not an E-stop.

## 4.17 Timeout

Timeout types include:

- queue timeout;
- validation timeout;
- allocation timeout;
- deployment timeout;
- startup timeout;
- execution timeout;
- cleanup timeout.

The public contract must expose the meaningful timeout outcome.

## 4.18 Execution Timeout

Execution timeout example:

    Run START
       |
       v
    Deadline = T + 1800s
       |
       v
    Monitor
       |
       +--> Completed before deadline
       |
       +--> Deadline reached
                |
                v
             TIMEOUT
                |
                v
             STOP/CLEANUP

Timeout must be durable.

## 4.19 Cancellation

Cancellation is a request.

It must not instantly mutate the state to COMPLETED or STOPPED.

Conceptually:

    RUNNING
       |
       v
    CANCEL REQUEST
       |
       v
    STOPPING
       |
       v
    CANCELLED / COMPLETED

The final state depends on the actual Lab Agent acknowledgement and policy.

## 4.20 Retry

Retry must be policy-driven.

Default initial policy:

    NO_RETRY

Future policies may include:

- retry infrastructure failure;
- retry Lab Agent disconnect;
- retry transient queue failure.

Retries must never blindly repeat potentially unsafe physical actions.

## 4.21 Resource Cleanup

Cleanup must occur after:

- completion;
- failure;
- timeout;
- cancellation;
- worker crash recovery.

Cleanup includes:

- Lab Agent execution state;
- worker claim;
- temporary deployment;
- resource allocation;
- execution locks.

---

# 9 Risks

## 9.1 R-BM05-001 — Duplicate Execution

**Risk:** Retry or duplicate queue message starts the same workload twice.

**Impact:** Critical.

**Mitigation:**

- idempotent Job/Run commands;
- durable claims;
- execution identity;
- Lab Agent idempotency;
- worker recovery tests.

## 9.2 R-BM05-002 — Execution Without Booking

**Risk:** A Job executes without a valid resource reservation.

**Impact:** Critical.

**Mitigation:**

- eligibility gate;
- Booking validation;
- Resource Allocation validation;
- execution-time checks.

## 9.3 R-BM05-003 — Execution With Invalid Artifact

**Risk:** Untrusted or incompatible artifact reaches execution.

**Impact:** Critical.

**Mitigation:**

- signature validation;
- checksum;
- artifact state;
- compatibility;
- Lab Agent validation.

## 9.4 R-BM05-004 — Worker Crash

**Risk:** Job becomes stuck or is duplicated.

**Impact:** High.

**Mitigation:**

- worker heartbeat;
- durable claims;
- reconciliation;
- recovery policy;
- execution identity.

## 9.5 R-BM05-005 — Queue Loss

**Risk:** Queue message disappears.

**Impact:** High.

**Mitigation:**

- durable Job state;
- outbox/reliable enqueue where required;
- recovery scan;
- reconciliation.

## 9.6 R-BM05-006 — Timeout Failure

**Risk:** Run continues after backend timeout.

**Impact:** Critical.

**Mitigation:**

- durable deadline;
- Lab Agent stop;
- reconciliation;
- timeout escalation;
- no silent completion.

## 9.7 R-BM05-007 — Unsafe Retry

**Risk:** A physical operation is retried after uncertain execution state.

**Impact:** Critical.

**Mitigation:**

- retry classification;
- execution identity;
- no automatic retry for uncertain physical start;
- human review where required.

## 9.8 R-BM05-008 — Cancellation Misinterpreted as E-stop

**Risk:** User believes software stop provides physical emergency stopping.

**Impact:** Critical.

**Mitigation:**

- explicit terminology;
- safety review;
- separate E-stop state;
- UI acceptance criteria.

## 9.9 R-BM05-009 — Resource Leak

**Risk:** Resource remains reserved after failure.

**Impact:** High.

**Mitigation:**

- cleanup service;
- reconciliation;
- lease/timeout;
- fault injection.

## 9.10 R-BM05-010 — Credit Inconsistency

**Risk:** Execution outcome and credit consumption diverge.

**Impact:** High.

**Mitigation:**

- Credit Service boundary;
- idempotency;
- execution reconciliation;
- explicit policy.

## 9.11 R-BM05-011 — Tenant Execution Leakage

**Risk:** Organization A starts or observes Organization B's Job.

**Impact:** Critical.

**Mitigation:**

- tenant-aware repositories;
- authorization;
- resource/job checks;
- negative tests.

## 9.12 R-BM05-012 — Simulation False Confidence

**Risk:** Simulated execution behaves differently from physical systems.

**Impact:** High.

**Mitigation:**

- stable Lab Agent contract;
- explicit simulation limitations;
- HIL qualification;
- physical safety gate.

## 9.13 R-BM05-013 — State Machine Drift

**Risk:** Frontend and backend implement inconsistent lifecycle semantics.

**Impact:** High.

**Mitigation:**

- backend-authoritative state;
- versioned contracts;
- state transition tests;
- API contract tests.

## 9.14 R-BM05-014 — Queue Overload

**Risk:** Queue backlog causes unacceptable execution delay.

**Impact:** Medium/High.

**Mitigation:**

- queue depth metrics;
- concurrency controls;
- quotas;
- worker scaling;
- admission policy.

## 9.15 R-BM05-015 — Lab Agent Disconnect

**Risk:** Control Plane loses contact during execution.

**Impact:** Critical for physical deployment.

**Mitigation:**

- simulated fault testing;
- heartbeat;
- execution lease;
- local runtime authority;
- safe local behavior;
- no unsafe automatic restart.

---

# 10 Exit Criteria

## 10.1 Job Exit

- [ ] Job model implemented.
- [ ] Job lifecycle implemented.
- [ ] Job state history implemented.
- [ ] Job API implemented.
- [ ] Job authorization implemented.
- [ ] Job idempotency implemented.

## 10.2 Run Exit

- [ ] Run model implemented.
- [ ] Run lifecycle implemented.
- [ ] Run state history implemented.
- [ ] Run API implemented.
- [ ] Run execution identity implemented.
- [ ] Run failure/timeout evidence implemented.

## 10.3 Queue Exit

- [ ] Queue interface implemented.
- [ ] Queue adapter implemented.
- [ ] Durable enqueue implemented.
- [ ] Acknowledgement implemented.
- [ ] Retry implemented.
- [ ] Dead-letter implemented.
- [ ] Queue recovery implemented.

## 10.4 Worker Exit

- [ ] Worker framework implemented.
- [ ] Job claiming implemented.
- [ ] Worker heartbeat implemented.
- [ ] Concurrency limits implemented.
- [ ] Worker crash recovery implemented.
- [ ] Graceful shutdown implemented.

## 10.5 Lab Agent Exit

- [ ] Lab Agent contract documented.
- [ ] Lab Agent client implemented.
- [ ] Simulated Lab Agent implemented.
- [ ] Simulated runtime implemented.
- [ ] Deploy implemented.
- [ ] Start implemented.
- [ ] Stop implemented.
- [ ] Status implemented.
- [ ] Cleanup implemented.
- [ ] Fault injection implemented.

## 10.6 Execution Exit

- [ ] Eligibility implemented.
- [ ] Booking validation implemented.
- [ ] Artifact validation implemented.
- [ ] Compatibility validation implemented.
- [ ] Resource validation implemented.
- [ ] Deployment implemented.
- [ ] Start implemented.
- [ ] Stop implemented.
- [ ] Cancellation implemented.
- [ ] Timeout implemented.
- [ ] Cleanup implemented.
- [ ] Retry policy implemented.

## 10.7 Commercial Exit

- [ ] Credit reservation integration implemented.
- [ ] Credit consumption integration implemented.
- [ ] Credit release integration implemented.
- [ ] Execution/credit reconciliation implemented.

## 10.8 Security Exit

- [ ] Tenant isolation verified.
- [ ] Artifact authorization verified.
- [ ] Resource authorization verified.
- [ ] Job authorization verified.
- [ ] Run authorization verified.
- [ ] Execution command authorization verified.
- [ ] Audit events verified.
- [ ] Secret handling verified.
- [ ] Artifact security boundary verified.

## 10.9 Safety Exit

- [ ] Software stop is explicitly distinct from E-stop.
- [ ] Safety authority is local.
- [ ] Unknown safety state is not treated as safe.
- [ ] Disconnect behavior is documented.
- [ ] Unsafe automatic restart is prohibited.
- [ ] Physical safety review is recorded where required.

## 10.10 Quality Exit

- [ ] Unit tests pass.
- [ ] State machine tests pass.
- [ ] Queue/worker tests pass.
- [ ] Lab Agent contract tests pass.
- [ ] Fault injection passes.
- [ ] Timeout tests pass.
- [ ] Cancellation tests pass.
- [ ] Idempotency tests pass.
- [ ] Tenant isolation tests pass.
- [ ] E2E tests pass.
- [ ] Performance baseline passes.
- [ ] CI passes.

## 10.11 Documentation Exit

- [ ] Job lifecycle documented.
- [ ] Run lifecycle documented.
- [ ] Queue contract documented.
- [ ] Worker contract documented.
- [ ] Lab Agent contract documented.
- [ ] Timeout semantics documented.
- [ ] Retry semantics documented.
- [ ] Cancellation semantics documented.
- [ ] Safety boundary documented.
- [ ] Execution/credit integration documented.
- [ ] Tracking documents updated.

## 10.12 Formal Milestone Status

B-M05 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

Completion requires implementation evidence, execution tests, fault-injection
evidence, security review, architecture review and safety-boundary review.

---
