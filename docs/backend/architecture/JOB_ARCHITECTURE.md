# Kritva RaaS Job Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Job and Run Architecture |
| Path | `docs/backend/architecture/JOB_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Services | Job, Run, Lab, Result |
| Execution Model | Asynchronous |
| Queue | Durable job queue |
| Scheduler | Control Plane scheduler/resource allocator |
| Runtime Boundary | Lab Agent |
| Execution Artifact | Signed `.krv` |
| Job State Authority | Job Service |
| Run State Authority | Run Service |
| Physical Safety | Local Lab/Robot Boundary |

## 2. Purpose

This document defines the production-grade architecture for job creation,
scheduling, dispatch, execution, cancellation, failure recovery and completion
within Kritva RaaS.

The architecture separates:

- **Job** — the user's requested execution intent;
- **Run** — the actual execution instance;
- **Resource** — the robot/execution capacity;
- **Lab Agent** — the physical-lab control boundary.

The system must support:

- asynchronous execution;
- deterministic scheduling;
- durable state;
- retries;
- timeouts;
- cancellation;
- crash recovery;
- reconciliation;
- event publication;
- resource locking;
- credit integration;
- artifact validation;
- result processing.

## 3. Scope

This document covers:

- Job lifecycle;
- Run lifecycle;
- Job vs Run separation;
- state machines;
- queue architecture;
- worker architecture;
- scheduler;
- resource allocation;
- artifact validation;
- booking validation;
- credit authorization;
- dispatch;
- execution;
- cancellation;
- timeout;
- retry;
- crash recovery;
- reconciliation;
- event delivery;
- observability;
- testing;
- phase mapping.

## 4. Non-Goals

This document does not define:

- robot firmware;
- physical emergency-stop implementation;
- detailed Lab Agent internals;
- detailed WebRTC media transport;
- database physical schema;
- frontend UI implementation;
- payment-provider internals.

## 5. Goals

The Job architecture must:

1. provide durable execution state;
2. distinguish requested work from actual execution;
3. guarantee deterministic state transitions;
4. prevent duplicate execution;
5. tolerate worker crashes;
6. tolerate queue redelivery;
7. support controlled cancellation;
8. support bounded retries;
9. handle external timeouts safely;
10. reconcile uncertain robot state;
11. preserve auditability;
12. integrate with Booking, Credit, Artifact, Lab and Result services.

## 6. Architectural Principle

The core execution path is:

    User
      |
      v
    Job
      |
      v
    Queue
      |
      v
    Scheduler
      |
      v
    Resource Allocation
      |
      v
    Lab Agent
      |
      v
    Run
      |
      v
    Robot Runtime
      |
      v
    Result

The Control Plane owns execution intent and orchestration.

The Lab Agent owns the cloud-to-lab execution boundary.

The robot runtime owns actual physical execution.

## 7. Job and Run Separation

The most important architectural distinction is:

> A Job is a request to perform work. A Run is an actual execution instance of that request.

Example:

    Job J001
       |
       +--> Run R001 FAILED
       |
       +--> Run R002 COMPLETED

One Job may therefore have multiple Run records when retry or explicit rerun
semantics permit it.

A Run must never be confused with a user's original Job request.

## 8. Job Definition

A Job represents:

- project;
- artifact;
- platform;
- booking;
- requested execution;
- user;
- organization;
- execution policy;
- scheduling information;
- lifecycle state.

The Job is the authoritative representation of execution intent.

## 9. Run Definition

A Run represents:

- actual execution attempt;
- allocated resource;
- Lab Agent;
- deployment;
- runtime;
- start/stop time;
- runtime status;
- execution outcome;
- runtime diagnostics.

A Run is created only when the system has reached the execution-attempt stage.

## 10. Job Ownership

Job Service owns:

- Job ID;
- requested artifact;
- booking;
- platform;
- execution parameters;
- Job lifecycle;
- retry policy;
- cancellation state;
- terminal outcome.

## 11. Run Ownership

Run Service owns:

- Run ID;
- execution attempt;
- assigned resource;
- Lab Agent;
- execution state;
- runtime timestamps;
- runtime failure;
- reconciliation state.

## 12. Resource Ownership

Lab Service owns:

- physical resource identity;
- resource capabilities;
- resource health;
- resource availability;
- resource allocation;
- Lab Agent association.

Job must never directly own robot health.

## 13. State Model

Canonical Job states:

    CREATED
    QUEUED
    VALIDATING
    ALLOCATING
    DEPLOYING
    STARTING
    RUNNING
    STOPPING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

These states are externally observable through REST and realtime events.

## 14. State Categories

| Category | States |
|---|---|
| Initial | CREATED |
| Pending | QUEUED, VALIDATING, ALLOCATING |
| Execution preparation | DEPLOYING, STARTING |
| Active | RUNNING |
| Termination | STOPPING |
| Terminal success | COMPLETED |
| Terminal failure | FAILED, TIMEOUT |
| Terminal user action | CANCELLED |

Terminal states must not transition back to active states.

## 15. Job State Machine

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
       +-------> COMPLETED
       |
       +-------> FAILED
       |
       +-------> CANCELLED
       |
       +-------> TIMEOUT

Failure may also occur from preparation states where appropriate.

## 16. Job State Transition Rules

| From | To | Condition |
|---|---|---|
| CREATED | QUEUED | Job accepted |
| QUEUED | VALIDATING | Worker begins validation |
| VALIDATING | ALLOCATING | Validation passed |
| VALIDATING | FAILED | Validation failed |
| ALLOCATING | DEPLOYING | Resource acquired |
| ALLOCATING | FAILED | Allocation failed |
| DEPLOYING | STARTING | Deployment accepted |
| DEPLOYING | FAILED | Deployment failed |
| STARTING | RUNNING | Runtime confirmed |
| STARTING | FAILED | Runtime failed |
| RUNNING | STOPPING | Stop requested |
| RUNNING | COMPLETED | Normal completion |
| RUNNING | FAILED | Runtime failure |
| RUNNING | TIMEOUT | Execution timeout |
| STOPPING | COMPLETED | Clean stop |
| STOPPING | FAILED | Stop failure |
| STOPPING | CANCELLED | Cancellation confirmed |

The implementation may allow additional controlled transitions such as
`QUEUED -> CANCELLED`.

## 17. Cancellation Before Execution

A Job may be cancelled before physical execution.

Example:

    CREATED
       |
       v
    CANCELLED

or:

    QUEUED
       |
       v
    CANCELLED

Cancellation must release any reserved resources and reconcile any reserved
credits.

## 18. Cancellation During Execution

During RUNNING:

    RUNNING
       |
       v
    STOPPING
       |
       v
    CANCELLED

The system must request a controlled stop from the Lab Agent.

A UI/API stop command is not a physical emergency stop.

## 19. Cancellation Failure

If the stop request cannot be confirmed:

    RUNNING
       |
       v
    STOPPING
       |
       v
    STOP_UNCONFIRMED
       |
       v
    RECONCILIATION_REQUIRED

The exact externally visible state may remain `STOPPING` while reconciliation
runs.

The system must not falsely report the robot as stopped.

## 20. Timeout Classes

At minimum, define:

- queue timeout;
- validation timeout;
- allocation timeout;
- deployment timeout;
- start timeout;
- execution timeout;
- stop timeout;
- result timeout.

Each timeout has independent remediation.

## 21. Queue Architecture

The queue decouples API requests from execution.

    API
      |
      v
    Job Record
      |
      v
    Queue Message
      |
      v
    Worker
      |
      v
    Application Service

The queue is not the authoritative Job state.

PostgreSQL remains authoritative.

## 22. Queue Message

Conceptual:

    {
        "message_id": "msg-001",
        "operation_id": "op-001",
        "job_id": "job-001",
        "command": "job.process",
        "attempt": 1,
        "created_at": "2026-10-08T00:00:00Z",
        "trace_id": "trace-001"
    }

Messages should contain identifiers rather than large domain objects.

## 23. Queue Delivery

The queue should support:

- durable delivery;
- acknowledgement;
- retry;
- visibility timeout;
- dead-lettering;
- message identity.

The worker must be safe against duplicate delivery.

## 24. Worker Architecture

    Queue
      |
      v
    Worker Pool
      |
      +--> Job Worker
      +--> Scheduler Worker
      +--> Deployment Worker
      +--> Reconciliation Worker
      +--> Result Worker
      |
      v
    Application Services

Workers should be stateless with durable state in PostgreSQL.

## 25. Worker Responsibilities

Workers:

- consume messages;
- load authoritative state;
- validate state;
- execute one bounded step;
- persist transition;
- publish event;
- acknowledge message.

Workers must not assume that queue delivery implies current Job state.

## 26. Worker Idempotency

A worker may receive the same message multiple times.

Therefore:

    Message M001
       |
       +--> Worker A
       |
       +--> Worker B

must not cause duplicate execution.

The worker checks durable state before performing side effects.

## 27. Worker Processing Pattern

Preferred:

    Receive Message
         |
         v
    Load Job
         |
         v
    Check Current State
         |
         +--> Already Completed --> ACK
         |
         +--> Valid Transition --> Process
         |
         +--> Invalid/Obsolete --> ACK/Discard
         |
         v
    Persist State
         |
         v
    Publish Event
         |
         v
    ACK

## 28. Scheduler

The scheduler determines when a Job may proceed.

It considers:

- Job state;
- booking;
- platform;
- resource capability;
- resource availability;
- resource health;
- execution priority;
- credit authorization;
- lab availability.

## 29. Scheduling Flow

    QUEUED
       |
       v
    Booking Valid?
       |
       v
    Platform Compatible?
       |
       v
    Resource Eligible?
       |
       v
    Resource Available?
       |
       v
    Credits Authorized?
       |
       v
    Allocate
       |
       v
    ALLOCATING

## 30. Deterministic Scheduling

Given the same authoritative state and policy, scheduling should produce a
deterministic choice where practical.

Selection factors may include:

1. booking validity;
2. platform compatibility;
3. required capabilities;
4. health;
5. availability;
6. resource priority;
7. queue priority;
8. fairness policy.

## 31. Resource Allocation

Resource allocation is owned by Lab Service.

Job requests:

    AllocateResource(job_requirements)

Lab returns:

    allocation_id
    resource_id
    agent_id
    allocation_expiry

The Job service does not modify resource tables directly.

## 32. Allocation Lock

An allocation must prevent competing jobs from using the same resource.

    Resource
       |
       v
    Available
       |
       v
    RESERVED
       |
       v
    BUSY
       |
       v
    RELEASED

Allocation state must be durable.

## 33. Allocation Expiry

If a Job fails to proceed within its allocation window:

    Allocation
       |
       v
    Expired
       |
       v
    Release Resource
       |
       v
    Requeue / Fail

The decision depends on failure class and retry policy.

## 34. Artifact Validation

Before allocation or deployment:

- artifact exists;
- artifact is accepted;
- digest is valid;
- signature is valid;
- platform is compatible;
- architecture is compatible;
- runtime is compatible;
- required capabilities exist.

## 35. Booking Validation

The Job must verify:

- booking exists;
- booking belongs to organization;
- booking is confirmed;
- booking time is valid;
- booking is not cancelled;
- requested platform matches booking;
- resource is eligible.

## 36. Credit Validation

The Job workflow must confirm:

- correct platform credit type;
- sufficient balance or reservation;
- valid credit policy;
- no duplicate consumption.

Credit Service remains authoritative.

## 37. Deployment Flow

    Artifact
       |
       v
    Lab Agent
       |
       v
    Verify Digest
       |
       v
    Verify Signature
       |
       v
    Prepare Runtime
       |
       v
    DEPLOYING
       |
       v
    STARTING

## 38. Run Creation

A Run should be created when an execution attempt becomes concrete.

    Job
       |
       v
    Resource Allocated
       |
       v
    Run Created
       |
       v
    Deployment
       |
       v
    Start

A Run must contain a reference to the parent Job.

## 39. Run Identity

Run identity must be unique.

Recommended relationship:

    job_id
       |
       +--> run_id_001
       +--> run_id_002
       +--> run_id_003

Multiple runs are permitted only under explicit retry/rerun policy.

## 40. Retry Policy

Retries must be classified.

### Retryable

Potentially:

- transient network failure;
- temporary Lab Agent unavailable;
- queue failure;
- transient storage failure;
- temporary resource contention.

### Non-Retryable

Normally:

- invalid artifact;
- incompatible platform;
- authorization failure;
- insufficient credits;
- invalid booking;
- policy rejection.

## 41. Retry Limits

Each operation has:

- maximum attempts;
- retry delay;
- exponential backoff;
- jitter;
- retryable error set.

Example:

    Attempt 1
       |
       v
    1 second
       |
       v
    Attempt 2
       |
       v
    5 seconds
       |
       v
    Attempt 3
       |
       v
    Dead Letter / FAILED

Exact values are deployment configuration.

## 42. Retry Safety

Never automatically retry an operation that could cause duplicate physical
execution unless the system can prove idempotency or reconcile state first.

Particularly sensitive:

- deployment;
- start;
- stop;
- resource allocation.

## 43. Start Retry

If `start` times out:

    STARTING
       |
       v
    Timeout
       |
       v
    UNKNOWN
       |
       v
    Reconcile Lab Agent
       |
       +--> Not Started --> Retry
       |
       +--> Running -----> RUNNING
       |
       +--> Unknown -----> RECONCILIATION_REQUIRED

Do not blindly send a second start command.

## 44. Stop Retry

If stop times out:

    STOPPING
       |
       v
    Timeout
       |
       v
    Query Runtime
       |
       +--> Stopped --> COMPLETED/CANCELLED
       |
       +--> Running --> Controlled Retry
       |
       +--> Unknown --> Reconciliation

## 45. Execution Timeout

Execution timeout is distinct from network timeout.

    RUNNING
       |
       v
    Execution Deadline
       |
       v
    STOPPING
       |
       v
    TIMEOUT

The final state is `TIMEOUT` only after the execution termination semantics are
handled according to policy.

## 46. Crash Recovery

Workers can crash at any point.

Recovery principle:

> Durable database state is the source of truth; queue delivery is recoverable.

Example:

    Worker
      |
      v
    STARTING
      |
      X
    Crash
      |
      v
    Queue Redelivery
      |
      v
    Load Job State
      |
      v
    Reconcile
      |
      v
    Continue / Fail / Recover

## 47. Crash During Database Transaction

If the worker crashes before commit:

    Transaction
       |
       X
    Crash
       |
       v
    Rollback

The queue message is retried.

## 48. Crash After Commit

If the worker commits state but crashes before acknowledgement:

    DB Commit
       |
       X
    Worker Crash
       |
       v
    Queue Redelivery
       |
       v
    Detect Existing State
       |
       v
    Safe ACK

This is a required idempotency property.

## 49. Crash During External Execution

Most dangerous case:

    Control Plane
       |
       v
    Lab Agent
       |
       v
    Start Robot
       |
       X
    Control Plane Crash

After restart:

    Load Job
       |
       v
    Query Lab Agent
       |
       v
    Determine Actual State
       |
       v
    Reconcile Job/Run

Never assume the robot stopped because the Control Plane crashed.

## 50. Reconciliation

Reconciliation compares:

- Job state;
- Run state;
- Lab Agent state;
- resource state;
- runtime state;
- result state.

    Control Plane State
            |
            +---------+
                      |
                      v
                 Reconciliation
                      ^
                      |
            +---------+
            |
    Lab Actual State

## 51. Reconciliation Outcomes

Possible outcomes:

- confirmed running;
- confirmed stopped;
- confirmed completed;
- confirmed failed;
- resource unavailable;
- unknown;
- manual intervention required.

## 52. Recovery Worker

A dedicated recovery/reconciliation worker should periodically inspect:

- stale Jobs;
- stale Runs;
- expired allocations;
- missing heartbeats;
- incomplete deployments;
- incomplete results.

## 53. Stale Job Detection

A Job is stale if:

- state has not changed within expected timeout;
- worker heartbeat expired;
- operation deadline passed;
- associated resource disappeared.

The system should transition it into recovery processing rather than directly
marking it failed.

## 54. Worker Heartbeats

Long-running worker operations should have an execution heartbeat.

Example:

    operation_id
    worker_id
    last_heartbeat
    current_step
    deadline

This helps distinguish active work from abandoned work.

## 55. Job Deadlines

Each Job should have:

- created_at;
- queued_at;
- validation deadline;
- allocation deadline;
- deployment deadline;
- start deadline;
- execution deadline;
- stop deadline;
- final deadline.

Deadlines are preferable to indefinite waits.

## 56. Queue Timeout vs Job Timeout

A queue visibility timeout controls message processing.

A Job execution timeout controls business behavior.

They must not be conflated.

    Queue Visibility Timeout
        = worker delivery mechanism

    Job Execution Timeout
        = business execution policy

## 57. Event Architecture

Job events:

    job.created
    job.queued
    job.validating
    job.allocating
    job.deploying
    job.starting
    job.running
    job.stopping
    job.completed
    job.failed
    job.cancelled
    job.timeout

Run events:

    run.created
    run.starting
    run.running
    run.telemetry
    run.metrics.updated
    run.logs.available
    run.stopping
    run.completed
    run.failed
    run.cancelled
    run.reconciliation_required

## 58. Event Production

The service that owns the state transition produces the event.

    Job State Change
         |
         v
    Job Service
         |
         v
    Event
         |
         +--> WebSocket
         +--> Audit
         +--> Notification
         +--> Other Consumers

## 59. Event Delivery

Events should use:

- unique event ID;
- request ID;
- operation ID;
- trace ID;
- resource ID;
- organization context;
- sequence number where applicable.

Events are delivered at least once.

## 60. Event Ordering

Ordering is required per Job/Run resource where state transitions depend on
sequence.

Global ordering is unnecessary.

Example:

    job.validating
        |
        v
    job.allocating
        |
        v
    job.running

A later state must not be overwritten by an older event.

## 61. Event Persistence

For business-critical state changes:

    DB Transaction
         |
         +--> Job State
         +--> Outbox Event
         |
         v
       Commit
         |
         v
    Event Publisher
         |
         v
      Consumers

An outbox is recommended for reliable publication.

## 62. Queue and Event Separation

Queue:

    "Please process this operation."

Event:

    "This state change occurred."

They must remain conceptually distinct.

## 63. Job API Interfaces

Representative commands:

    job.create
    job.start
    job.stop
    job.cancel

Queries:

    job.get
    job.list
    job.status
    job.logs

## 64. Run API Interfaces

Representative commands:

    run.start
    run.stop
    run.reconcile

Queries:

    run.get
    run.list
    run.status
    run.metrics
    run.telemetry
    run.logs

## 65. Internal Job Interfaces

Conceptual:

    JobService
        create(command)
        enqueue(job_id)
        validate(job_id)
        allocate(job_id)
        deploy(job_id)
        start(job_id)
        stop(job_id)
        cancel(job_id)
        reconcile(job_id)

## 66. Internal Run Interfaces

Conceptual:

    RunService
        create(job_id, allocation)
        start(run_id)
        stop(run_id)
        recordTelemetry(run_id, data)
        recordFailure(run_id, error)
        complete(run_id)
        reconcile(run_id)

These interfaces are logical contracts and should not expose infrastructure
types.

## 67. Lab Interface

Conceptual:

    LabService
        allocate(requirements)
        release(allocation_id)
        prepareDeployment(...)
        start(...)
        stop(...)
        getRuntimeState(...)
        reconcile(...)

The actual implementation communicates through the Lab Protocol.

## 68. Job-to-Run Interface

The Job Service requests Run creation:

    CreateRun
        job_id
        artifact_id
        platform_id
        allocation_id
        execution_parameters

The Run Service returns:

    run_id
    initial_state

Job remains the parent lifecycle owner.

## 69. Result Integration

Run completion produces:

    run.completed
          |
          v
    Result.create/process
          |
          v
    result.processing
          |
          v
    result.available

A completed Run does not automatically imply result processing has completed.

## 70. Credit Integration

Credit policy must be explicit.

Possible lifecycle:

    Job Created
         |
         v
    Credit Authorization
         |
         v
    Resource Execution
         |
         v
    Actual Usage
         |
         v
    Credit Consumption
         |
         v
    Reconciliation / Refund

Credit Service owns the ledger.

## 71. Booking Integration

Job requires a valid booking unless explicitly configured otherwise.

    Job Create
        |
        v
    Booking Validation
        |
        +--> Invalid --> FAILED
        |
        +--> Valid --> QUEUED

A booking must not be silently extended beyond its authorized window.

## 72. Artifact Integration

The Job must reference an immutable artifact.

Artifact changes after acceptance should produce a new artifact identity.

    Artifact A
       |
       v
    Digest X

A modified binary must not continue to use the same artifact identity.

## 73. Resource Compatibility

Allocation checks:

- platform ID;
- platform version;
- architecture;
- runtime;
- SDK compatibility;
- capabilities;
- health;
- booking constraints.

## 74. Job Priority

Priority may be introduced through policy.

Possible factors:

- booking schedule;
- subscription;
- organization;
- job priority;
- fairness;
- queue age.

Priority must not allow unauthorized resource access.

## 75. Fairness

The scheduler should avoid indefinite starvation.

Potential strategy:

- weighted priority;
- aging;
- reservation windows;
- organization quotas.

The exact policy is a commercial/operational decision.

## 76. Resource Reservation

A booking reserves a time/resource entitlement.

A Job allocation reserves actual execution capacity.

These are distinct:

    Booking
       |
       v
    Entitlement to Use

    Job Allocation
       |
       v
    Actual Resource Reservation

## 77. Job Admission Control

Before entering QUEUED, validate:

- authenticated user;
- organization;
- project;
- artifact;
- platform;
- booking;
- credit policy;
- job limits.

Rejected requests must not enter execution queues.

## 78. Queue Admission

Only valid Jobs should be enqueued.

    API
      |
      v
    Admission Validation
      |
      +--> Reject
      |
      v
    Persist CREATED
      |
      v
    QUEUED
      |
      v
    Queue

## 79. Duplicate Job Prevention

Client retries may submit the same Job creation request.

Use idempotency.

    Request
       |
       v
    Idempotency Key
       |
       v
    Existing Job?
       |
       +--> Yes --> Return Existing Job
       |
       +--> No --> Create Job

## 80. Job Cancellation Queue Handling

If a queued Job is cancelled:

    Queue Message
        |
        v
    Worker Loads Job
        |
        v
    State = CANCELLED
        |
        v
    Do Not Execute
        |
        v
    ACK

The queue does not necessarily need immediate physical deletion.

## 81. Cancellation During Allocation

    ALLOCATING
        |
        v
    Cancel Request
        |
        v
    Release Allocation
        |
        v
    CANCELLED

Resource release must be idempotent.

## 82. Cancellation During Deployment

    DEPLOYING
        |
        v
    Cancel
        |
        v
    Stop / Cleanup
        |
        v
    CANCELLED

If deployment state is uncertain, reconcile before finalizing.

## 83. Cancellation During Starting

    STARTING
        |
        v
    Cancel
        |
        v
    Query Runtime
        |
        +--> Not Started --> CANCELLED
        |
        +--> Running --> STOPPING

## 84. Cancellation During Running

    RUNNING
       |
       v
    Stop Command
       |
       v
    Lab Agent
       |
       v
    Runtime Stop
       |
       v
    STOPPING
       |
       v
    CANCELLED

The final state depends on successful termination.

## 85. Timeout Recovery

When a timeout occurs:

1. record timeout event;
2. prevent new work;
3. initiate safe stop where applicable;
4. query actual state;
5. release resources only after safe confirmation;
6. finalize Job state;
7. reconcile credits;
8. process results if available.

## 86. Failure Classification

Failures should distinguish:

- validation;
- scheduling;
- deployment;
- runtime;
- infrastructure;
- timeout;
- cancellation;
- resource;
- protocol;
- reconciliation.

Stable error codes should be attached.

## 87. Failure Example

    Artifact Incompatible
          |
          v
    VALIDATING
          |
          v
        FAILED
          |
          v
    job.failed
          |
          +--> Notification
          +--> Audit
          +--> WebSocket

No retry is required.

## 88. Transient Failure Example

    Lab Agent Timeout
          |
          v
    STARTING
          |
          v
    Reconciliation
          |
          +--> Not Started
          |       |
          |       v
          |     Retry
          |
          +--> Running
          |       |
          |       v
          |     RUNNING
          |
          +--> Unknown
                  |
                  v
             Manual/Recovery

## 89. Dead-Letter Jobs

A Job should not automatically enter dead-letter state as a business state.

Instead:

- queue message goes to dead-letter;
- Job remains in a recoverable state;
- recovery worker evaluates it;
- Job becomes FAILED only when business failure is established.

## 90. Manual Intervention

Manual intervention may be required when:

- robot state is unknown;
- Lab Agent is permanently offline;
- resource cannot be safely released;
- execution state cannot be reconciled;
- payment/credit state is uncertain.

Manual intervention must be auditable.

## 91. Recovery After Backend Restart

On startup:

    Control Plane Restart
          |
          v
    Load stale Jobs/Runs
          |
          v
    Find active operations
          |
          v
    Reconcile Lab State
          |
          v
    Requeue Safe Work
          |
          v
    Resume

The backend must not assume that all active operations were terminated.

## 92. Recovery After Lab Agent Restart

    Lab Agent Restart
          |
          v
    Reconnect
          |
          v
    Register / Heartbeat
          |
          v
    Report Resource State
          |
          v
    Control Plane Reconciliation
          |
          v
    Resume / Recover / Fail

## 93. Recovery After Robot Runtime Restart

The Lab Agent reports:

- runtime state;
- active run;
- runtime identity;
- execution metadata.

The Run Service reconciles against its durable state.

## 94. Recovery After Network Partition

During partition:

- new cloud-authorized jobs should normally be blocked;
- local safety remains active;
- local runtime state continues according to policy;
- Lab Agent buffers relevant data;
- reconnect triggers reconciliation.

The exact offline execution policy must be explicitly configured.

## 95. Result Recovery

If a Run completed but Result creation failed:

    RUN COMPLETED
         |
         v
    Result Missing
         |
         v
    Result Recovery Worker
         |
         v
    Fetch/verify result
         |
         v
    Result Available

Run completion must not be rewritten solely because result processing failed.

## 96. Job Completion

Normal completion requires:

- runtime stopped;
- result state captured;
- resource released;
- credit consumption reconciled;
- terminal Job state persisted;
- completion event emitted.

## 97. Terminal State

Terminal states:

    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

Terminal states must be immutable except for explicit administrative
reconciliation records.

## 98. Rerun

A user rerun should create a new execution Job or explicitly defined rerun
request.

Preferred:

    Job J001
       |
       v
    Rerun
       |
       v
    Job J002
       |
       v
    Run R002

This preserves auditability.

## 99. Job History

The system should retain:

- state transitions;
- timestamps;
- actor;
- reason;
- worker;
- operation ID;
- error code;
- resource;
- run references.

## 100. Observability

Minimum metrics:

- Jobs created;
- Jobs queued;
- Jobs by state;
- queue latency;
- scheduling latency;
- allocation latency;
- deployment latency;
- start latency;
- execution duration;
- cancellation latency;
- timeout count;
- retry count;
- worker failures;
- reconciliation count.

## 101. Structured Job Logs

Every log should include where applicable:

    job_id
    run_id
    operation_id
    allocation_id
    resource_id
    agent_id
    organization_id
    request_id
    trace_id
    state
    error_code

Secrets and credentials must never be logged.

## 102. Audit Events

Audit should capture:

- job creation;
- job cancellation;
- job start;
- job stop;
- terminal outcome;
- resource allocation;
- administrative intervention.

Audit is not the primary Job state store.

## 103. Notification Events

User-visible notifications may be generated for:

- job accepted;
- job started;
- job completed;
- job failed;
- job cancelled;
- timeout;
- result available.

Notification delivery is asynchronous.

## 104. API Semantics

Job API:

    POST /api/v1/jobs
        |
        v
    201/202
        |
        v
    Job ID

Start:

    POST /api/v1/jobs/{job_id}/start
        |
        v
    202 ACCEPTED
        |
        v
    operation_id

Stop:

    POST /api/v1/jobs/{job_id}/stop
        |
        v
    202 ACCEPTED

Status:

    GET /api/v1/jobs/{job_id}
    GET /api/v1/runs/{run_id}

## 105. WebSocket Job Events

Example:

    job.queued
    job.validating
    job.allocating
    job.deploying
    job.starting
    job.running
    job.stopping
    job.completed
    job.failed
    job.cancelled
    job.timeout

Clients must use REST to recover authoritative state after missed events.

## 106. Security

Job execution must enforce:

- authenticated user;
- organization membership;
- project access;
- artifact access;
- booking access;
- platform eligibility;
- credit authorization;
- resource authorization.

No client may directly address a robot resource outside Control Plane policy.

## 107. Safety

The Job architecture must explicitly distinguish:

- job cancellation;
- runtime stop;
- robot safety state;
- physical E-stop.

A successful API stop response means the requested application operation was
accepted or completed according to the API contract.

It does not certify physical safety.

## 108. Testing Strategy

Job architecture testing includes:

- state-machine tests;
- application-service tests;
- queue tests;
- worker tests;
- idempotency tests;
- scheduler tests;
- allocation tests;
- retry tests;
- timeout tests;
- cancellation tests;
- crash-recovery tests;
- reconciliation tests;
- event tests;
- end-to-end tests.

## 109. State Machine Testing

Every allowed transition must be tested.

Every prohibited transition must also be tested.

Example:

    RUNNING -> COMPLETED       allowed
    RUNNING -> FAILED         allowed
    RUNNING -> CANCELLED      controlled
    COMPLETED -> RUNNING      prohibited
    FAILED -> RUNNING         prohibited

## 110. Worker Crash Testing

Test crashes:

- before DB commit;
- after DB commit;
- before queue acknowledgement;
- after external request;
- during retry;
- during reconciliation.

Expected result is no duplicate physical execution.

## 111. Scheduler Testing

Test:

- no resources;
- one resource;
- multiple resources;
- incompatible resources;
- unhealthy resources;
- booking mismatch;
- expired booking;
- competing jobs;
- priority;
- fairness;
- allocation timeout.

## 112. Cancellation Testing

Test cancellation from:

- CREATED;
- QUEUED;
- VALIDATING;
- ALLOCATING;
- DEPLOYING;
- STARTING;
- RUNNING;
- STOPPING.

Each state must have explicit semantics.

## 113. Timeout Testing

Test:

- queue timeout;
- validation timeout;
- allocation timeout;
- deployment timeout;
- start timeout;
- execution timeout;
- stop timeout;
- result timeout.

Timeouts must never leave resources permanently locked.

## 114. Reconciliation Testing

Test mismatches:

    Control Plane RUNNING
    Lab Agent STOPPED

    Control Plane STOPPING
    Lab Agent RUNNING

    Control Plane STARTING
    Lab Agent RUNNING

    Control Plane COMPLETED
    Result MISSING

Each mismatch requires a defined recovery outcome.

## 115. Phase Mapping

| Phase | Job Architecture Focus |
|---|---|
| Phase 0 | Job domain foundation |
| Phase 1 | API/job records |
| Phase 2 | Artifact/booking prerequisites |
| Phase 3 | Queue and worker infrastructure |
| Phase 4 | Credit-aware job admission |
| Phase 5 | Full Job/Run execution |
| Phase 6 | Lab/robot orchestration |
| Phase 7 | Results and realtime execution |
| Phase 8 | Production recovery and hardening |

## 116. Phase 0

Establish:

- Job domain;
- Run domain;
- state machine;
- repository interfaces;
- errors;
- tests.

No physical execution is required.

## 117. Phase 1

Implement:

- Job API;
- Job persistence;
- authorization;
- project relationship;
- basic lifecycle.

## 118. Phase 2

Integrate:

- Artifact validation;
- Platform compatibility;
- Booking validation;
- admission control.

## 119. Phase 3

Implement:

- durable queue;
- workers;
- idempotency;
- asynchronous operations;
- event publication;
- retry framework.

## 120. Phase 4

Integrate:

- Credit authorization;
- credit reservation/consumption;
- billing dependencies;
- booking lifecycle.

Financial correctness becomes a release blocker.

## 121. Phase 5

Implement full:

    Job
      |
      v
    Run
      |
      v
    Scheduler
      |
      v
    Allocation
      |
      v
    Deployment
      |
      v
    Start
      |
      v
    Execute
      |
      v
    Stop
      |
      v
    Complete

## 122. Phase 6

Integrate real Lab Agent boundaries:

- agent registration;
- resource allocation;
- deployment;
- runtime control;
- telemetry;
- failure;
- reconciliation.

Human safety review remains a separate gate.

## 123. Phase 7

Integrate:

- results;
- live events;
- telemetry;
- logs;
- notifications;
- rerun.

The complete developer workflow becomes operational.

## 124. Phase 8

Harden:

- crash recovery;
- disaster recovery;
- load testing;
- queue scaling;
- scheduler fairness;
- timeout policy;
- operational dashboards;
- incident runbooks;
- reconciliation tooling.

## 125. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Duplicate robot execution | Idempotency + reconciliation |
| Worker crash | Durable state + queue redelivery |
| Lost event | Outbox + replay/reconciliation |
| Resource leak | Allocation expiry + recovery worker |
| Incorrect timeout | Separate network/business timeout |
| Blind retry | Retry classification |
| Job/Run confusion | Explicit separate entities |
| Stale state | Reconciliation |
| Booking race | Transactional booking/resource locks |
| Credit inconsistency | Credit service authority |
| Lab outage | Offline state + reconciliation |
| Stop ambiguity | Query actual runtime state |
| Queue overload | Backpressure and scaling |
| Starvation | Scheduler fairness |
| Result loss | Durable object storage + recovery |
| Unsafe cancellation | Local safety boundary |
| Event reordering | Sequence numbers/state checks |
| Manual recovery gaps | Audited operator tooling |

## 126. Open Questions

1. What exact queue technology will be used?
2. What visibility timeout will be configured?
3. What retry/backoff values will be standard?
4. What exact scheduler fairness policy will be used?
5. Will Job creation immediately reserve credits or only at execution?
6. Will credit reservations expire automatically?
7. How long may a Job remain QUEUED?
8. How long may a resource remain ALLOCATING?
9. What exact execution timeout defaults will each platform have?
10. What is the maximum number of Runs per Job?
11. Can a failed Run automatically create a new Run?
12. Which failures are safe for automatic retry?
13. How will Lab Agent runtime state be queried?
14. What reconciliation interval will be used?
15. How will unknown physical state be escalated?
16. What result-retention period will apply?
17. What priority/fairness model will be commercialized?
18. Will Job scheduling become a separate service?
19. Will Run execution become independently scalable?
20. What exact SLOs will govern job acceptance, scheduling and execution?

## 127. Full Acceptance Criteria

### Job Model

- [ ] Job is distinct from Run.
- [ ] Job has a stable ID.
- [ ] Job references project.
- [ ] Job references artifact.
- [ ] Job references platform.
- [ ] Job references booking where required.
- [ ] Job is organization-scoped.
- [ ] Job state is durable.
- [ ] Job lifecycle is auditable.

### Run Model

- [ ] Run has a stable ID.
- [ ] Run references parent Job.
- [ ] Run represents an execution attempt.
- [ ] Run references resource.
- [ ] Run references Lab Agent where applicable.
- [ ] Run state is durable.
- [ ] Multiple Runs per Job are controlled by policy.
- [ ] Run lifecycle is auditable.

### State Machine

- [ ] CREATED exists.
- [ ] QUEUED exists.
- [ ] VALIDATING exists.
- [ ] ALLOCATING exists.
- [ ] DEPLOYING exists.
- [ ] STARTING exists.
- [ ] RUNNING exists.
- [ ] STOPPING exists.
- [ ] COMPLETED exists.
- [ ] FAILED exists.
- [ ] CANCELLED exists.
- [ ] TIMEOUT exists.
- [ ] Invalid transitions are rejected.
- [ ] Terminal states cannot restart.
- [ ] State transitions are persisted atomically.

### Queue

- [ ] Queue is durable.
- [ ] Queue messages have IDs.
- [ ] Queue messages reference Job/operation IDs.
- [ ] Queue supports acknowledgement.
- [ ] Queue supports retry.
- [ ] Queue supports dead-lettering.
- [ ] Duplicate delivery is safe.
- [ ] Queue is not authoritative business state.

### Workers

- [ ] Workers load authoritative state.
- [ ] Workers validate current state before side effects.
- [ ] Workers are idempotent.
- [ ] Workers support bounded processing.
- [ ] Worker crashes are recoverable.
- [ ] Worker heartbeat is available for long operations.
- [ ] Worker metrics are available.
- [ ] Worker failures are observable.

### Scheduler

- [ ] Scheduler validates booking.
- [ ] Scheduler validates platform compatibility.
- [ ] Scheduler validates capabilities.
- [ ] Scheduler validates resource health.
- [ ] Scheduler respects resource availability.
- [ ] Scheduler prevents conflicting allocations.
- [ ] Scheduler has deterministic behavior where practical.
- [ ] Scheduler does not starve jobs indefinitely.
- [ ] Scheduler decisions are auditable.

### Allocation

- [ ] Resource allocation is durable.
- [ ] Resource locking prevents duplicate use.
- [ ] Allocation has an expiration policy.
- [ ] Allocation release is idempotent.
- [ ] Failed allocations do not leak resources.
- [ ] Allocation state can be reconciled.

### Artifact

- [ ] Artifact is validated before deployment.
- [ ] Digest is verified.
- [ ] Signature is verified.
- [ ] Platform compatibility is verified.
- [ ] Architecture compatibility is verified.
- [ ] Runtime compatibility is verified.
- [ ] Required capabilities are verified.

### Booking

- [ ] Booking exists before execution where required.
- [ ] Booking is confirmed.
- [ ] Booking is not cancelled.
- [ ] Booking window is valid.
- [ ] Booking platform matches Job.
- [ ] Expired bookings block execution.
- [ ] Booking changes are reflected in scheduling.

### Credits

- [ ] Credit platform matches platform.
- [ ] Credit authorization is validated.
- [ ] Credit operations are idempotent.
- [ ] Credit ledger remains authoritative.
- [ ] Duplicate consumption is prevented.
- [ ] Cancellation/refund behavior is defined.
- [ ] Failed execution is reconciled correctly.

### Retry

- [ ] Retryable errors are classified.
- [ ] Non-retryable errors are classified.
- [ ] Maximum attempts are enforced.
- [ ] Backoff is implemented.
- [ ] Jitter is supported where appropriate.
- [ ] Physical execution commands are not blindly retried.
- [ ] Retry state is observable.

### Timeout

- [ ] Queue timeout is distinguished from Job timeout.
- [ ] Validation timeout exists.
- [ ] Allocation timeout exists.
- [ ] Deployment timeout exists.
- [ ] Start timeout exists.
- [ ] Execution timeout exists.
- [ ] Stop timeout exists.
- [ ] Result timeout exists where required.
- [ ] Timeout triggers safe recovery.
- [ ] Timeout does not leak resources.

### Cancellation

- [ ] Cancellation from QUEUED is supported.
- [ ] Cancellation from ALLOCATING is supported.
- [ ] Cancellation from DEPLOYING is defined.
- [ ] Cancellation from STARTING is defined.
- [ ] Cancellation from RUNNING is defined.
- [ ] Stop commands are idempotent.
- [ ] Cancellation releases resources.
- [ ] Credit reconciliation occurs.
- [ ] Physical E-stop is not confused with API cancellation.

### Crash Recovery

- [ ] Crash before DB commit is recoverable.
- [ ] Crash after DB commit is idempotent.
- [ ] Crash before queue ACK is safe.
- [ ] Crash during deployment is recoverable.
- [ ] Crash during start is reconciled.
- [ ] Crash during RUNNING is reconciled.
- [ ] Backend restart triggers stale-work recovery.
- [ ] Lab Agent restart triggers reconciliation.
- [ ] Robot runtime restart is detectable.

### Reconciliation

- [ ] Job state can be reconciled.
- [ ] Run state can be reconciled.
- [ ] Resource state can be reconciled.
- [ ] Lab Agent state can be reconciled.
- [ ] Unknown state is represented.
- [ ] Manual intervention is supported.
- [ ] Reconciliation is auditable.
- [ ] Reconciliation is idempotent.

### Events

- [ ] Job lifecycle events are produced.
- [ ] Run lifecycle events are produced.
- [ ] Events have unique IDs.
- [ ] Events carry correlation information.
- [ ] Events have resource identity.
- [ ] Event delivery is at least once.
- [ ] Consumers tolerate duplicates.
- [ ] Sequence numbers are used where required.
- [ ] WebSocket clients can reconcile after event loss.

### Results

- [ ] Run completion triggers result processing.
- [ ] Result processing is independent of Run terminal state.
- [ ] Missing results are recoverable.
- [ ] Result files use durable storage.
- [ ] Result availability is explicit.

### Observability

- [ ] Job metrics exist.
- [ ] Run metrics exist.
- [ ] Queue metrics exist.
- [ ] Worker metrics exist.
- [ ] Scheduler metrics exist.
- [ ] Allocation metrics exist.
- [ ] Retry metrics exist.
- [ ] Timeout metrics exist.
- [ ] Reconciliation metrics exist.
- [ ] Correlation IDs appear in logs.

### Testing

- [ ] Every valid state transition is tested.
- [ ] Every invalid transition is tested.
- [ ] Queue retry is tested.
- [ ] Duplicate delivery is tested.
- [ ] Worker crash is tested.
- [ ] Scheduler conflicts are tested.
- [ ] Allocation races are tested.
- [ ] Cancellation is tested.
- [ ] Timeout is tested.
- [ ] Reconciliation is tested.
- [ ] End-to-end Job-to-Result flow is tested.

## 128. Final Architectural Invariants

1. Job represents execution intent.
2. Run represents an actual execution attempt.
3. Job and Run are separate authoritative entities.
4. Job Service owns Job state.
5. Run Service owns Run state.
6. Lab Service owns physical resource state.
7. PostgreSQL is authoritative for durable Job/Run state.
8. Queue delivery is not authoritative state.
9. Workers are idempotent.
10. Queue redelivery must be safe.
11. Critical physical operations are never blindly retried.
12. Scheduling is deterministic where practical.
13. Resource allocation is transactional and exclusive.
14. Booking validity is checked before execution.
15. Artifact compatibility is checked before deployment.
16. Credit authorization is checked before execution.
17. Credit state is owned by Credit Service.
18. Billing state is owned by Billing Service.
19. Long-running execution is asynchronous.
20. Network timeout does not equal physical execution failure.
21. Crash recovery always reconciles external state.
22. Terminal Job states are durable.
23. A Job may have multiple Runs only under explicit policy.
24. Rerun should preserve historical execution records.
25. WebSocket events are supplementary to REST state.
26. Events are at-least-once and consumers tolerate duplicates.
27. Result processing is independent of Job terminalization.
28. Cancellation is not physical emergency stop.
29. Physical safety remains local to the robot/lab.
30. Every execution path is observable and auditable.

## 129. Completion Condition

The Job architecture is complete when the platform can safely execute:

    Create Job
       |
       v
    Admit
       |
       v
    QUEUED
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
    RUNNING
       |
       +----------+
       |          |
       v          v
    Complete    Stop
       |          |
       v          v
    Result     STOPPING
                  |
                  v
             CANCELLED/
             COMPLETED/
             FAILED/
             TIMEOUT

while surviving:

- queue redelivery;
- worker crash;
- backend restart;
- Lab Agent restart;
- network partition;
- resource contention;
- transient failures;
- timeouts;
- cancellation;
- missing events;
- delayed results.

The resulting architecture must preserve the core RaaS execution principle:

> **Build locally. Book remotely. Run on real robots.**

and the execution-control principle:

> **The Job records what the user asked to execute; the Run records what actually happened; the Lab owns the physical resource; and reconciliation is mandatory whenever distributed state becomes uncertain.**
