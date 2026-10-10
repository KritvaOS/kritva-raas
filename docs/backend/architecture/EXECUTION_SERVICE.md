# Kritva RaaS Execution Service

## 1. Document Control

| Item | Value |
|---|---|
| Document | Execution Service Architecture |
| Path | `docs/backend/architecture/EXECUTION_SERVICE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Capability | Remote Execution Orchestration |
| Related Services | Job, Run, Artifact, Booking, Lab, Credit, Result |
| Runtime Boundary | Lab Agent |
| Artifact | Signed `.krv` |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Durable State | PostgreSQL |
| Physical Safety Authority | Local Lab/Robot Safety System |

## 2. Purpose

The Execution Service turns an authorized artifact and booking into a controlled
remote execution on a compatible robotic resource.

It coordinates:

- execution admission;
- artifact validation;
- booking validation;
- credit authorization;
- resource allocation;
- Run creation;
- artifact deployment;
- runtime start;
- supervision;
- telemetry;
- log ingestion;
- stop;
- timeout;
- failure handling;
- reconciliation;
- result handoff.

The core execution principle is:

> **Build locally. Book remotely. Run on real robots.**

The Execution Service is the orchestration layer that connects the digital
RaaS Control Plane to the physical robotic execution environment.

## 3. Scope

This document covers:

- execution admission;
- Job-to-Run orchestration;
- artifact verification;
- booking verification;
- credit integration;
- resource allocation;
- Lab Agent communication;
- deployment;
- runtime start;
- supervision;
- stop;
- timeout;
- telemetry;
- logs;
- runtime health;
- execution safety boundaries;
- result handoff;
- crash recovery;
- reconciliation;
- events;
- observability;
- security;
- testing;
- Phase 0–8 implementation.

## 4. Non-Goals

The Execution Service does not:

- compile source code;
- own `.krv` artifact metadata;
- own bookings;
- own credit balances;
- own physical resource inventory;
- implement the robot firmware;
- replace the Lab Agent;
- implement the physical emergency stop;
- own the final result data model;
- act as a general telemetry database.

## 5. Architectural Principles

The Execution Service follows these principles:

1. Execution requires an accepted artifact.
2. Execution requires an authorized booking.
3. Execution requires an eligible resource.
4. Execution requires valid credit authorization where applicable.
5. Job and Run remain separate entities.
6. Lab Agent is the cloud-to-lab execution boundary.
7. Control Plane never directly controls robot networks.
8. Physical safety remains local to the lab/robot.
9. API Stop is not a physical E-stop.
10. Runtime state is reconciled with actual Lab Agent state.
11. Long-running execution is asynchronous.
12. Durable state is stored in PostgreSQL.
13. Queue delivery is not authoritative state.
14. Execution commands are idempotent.
15. Telemetry and logs are observable but not execution authority.
16. WebSocket events are not authoritative state.
17. Timeouts trigger controlled recovery.
18. Unknown external state requires reconciliation.
19. Results are handed off after execution state is stabilized.
20. Every execution is auditable.

## 6. Execution Definition

An execution is the controlled deployment and operation of one immutable
artifact on one eligible robotic resource under one authorized booking.

Conceptually:

    Artifact
       +
    Booking
       +
    Credit Authorization
       +
    Resource
       |
       v
    Execution
       |
       v
    Run

## 7. Job vs Run

The Execution Service must preserve the distinction:

    Job
      = execution intent

    Run
      = concrete execution attempt

Example:

    Job J001
       |
       +--> Run R001 FAILED
       |
       +--> Run R002 COMPLETED

A retry may create a new Run while preserving the original Job.

## 8. Execution Lifecycle

The canonical orchestration is:

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
       +------> COMPLETED
       +------> FAILED
       +------> CANCELLED
       +------> TIMEOUT

These states align with the Job architecture.

## 9. Execution State Authority

Job Service owns the authoritative Job lifecycle.

Run Service owns the authoritative Run lifecycle.

Execution Service orchestrates transitions through these services.

It must not create an alternative execution state machine that conflicts with
the Job/Run state models.

## 10. Admission Control

Before execution begins, the service must establish:

- authenticated principal;
- organization authorization;
- project access;
- artifact ownership/access;
- artifact acceptance;
- booking confirmation;
- booking window;
- credit authorization;
- platform compatibility;
- resource eligibility.

Failure at admission prevents execution.

## 11. Admission Flow

    Job Request
        |
        v
    Authentication
        |
        v
    Authorization
        |
        v
    Artifact Validation
        |
        v
    Booking Validation
        |
        v
    Credit Validation
        |
        v
    Platform Compatibility
        |
        v
    Execution Admission
        |
        v
    Queue

## 12. Artifact Validation

The Execution Service relies on Artifact Service for authoritative artifact
state.

Required checks:

- artifact exists;
- artifact is accepted/ready;
- artifact is not revoked;
- artifact is not expired;
- digest is known;
- signature is valid;
- platform is compatible;
- runtime is compatible;
- required capabilities exist.

The Execution Service must not bypass Artifact Service policy.

## 13. Booking Validation

Required checks:

- booking exists;
- booking belongs to the organization;
- booking is confirmed;
- booking has not been cancelled;
- booking window is valid;
- platform matches;
- execution is within authorized policy.

A cached booking state must not be treated as authoritative when starting
physical execution.

## 14. Credit Validation

Where execution requires credits:

- credit type must match platform;
- required reservation must exist;
- reservation must be active;
- reservation must cover expected usage;
- wallet must remain valid.

Credit Service remains authoritative.

## 15. Resource Eligibility

The selected resource must satisfy:

- platform;
- architecture;
- runtime;
- required capabilities;
- health;
- maintenance state;
- Lab Agent availability;
- booking constraints.

## 16. Resource Allocation

Execution requests allocation through Lab Service.

Conceptually:

    Execution Service
          |
          v
    Lab Service
          |
          v
    Resource Scheduler
          |
          v
    Eligible Resource
          |
          v
    Allocation

The Execution Service must not directly modify resource allocation tables.

## 17. Allocation Contract

An allocation should return:

    allocation_id
    resource_id
    agent_id
    platform_id
    allocated_at
    expires_at
    capabilities

The allocation is authoritative only for its defined lifetime.

## 18. Allocation Failure

If no resource is available:

    ALLOCATING
        |
        v
    RESOURCE_UNAVAILABLE
        |
        +--> Retry according to policy
        |
        +--> FAILED

A retry must not create duplicate allocations.

## 19. Resource Lock

The selected resource must be exclusively allocated where the resource has
capacity one.

    AVAILABLE
       |
       v
    RESERVED
       |
       v
    BUSY
       |
       v
    RELEASED

Resource locking is owned by Lab Service.

## 20. Run Creation

Once execution becomes a concrete attempt:

    Job
      |
      v
    Allocation
      |
      v
    Create Run
      |
      v
    Run ID
      |
      v
    Deployment

The Run references:

- Job;
- artifact;
- booking;
- allocation;
- resource;
- Lab Agent.

## 21. Run Identity

A Run must have an immutable identity.

Recommended relationship:

    job_id
       |
       +--> run_id

The Run ID must be propagated across:

- Lab Protocol;
- logs;
- telemetry;
- events;
- results;
- credit consumption;
- audit records.

## 22. Execution Command Model

Execution commands should be explicit:

    deployment.prepare
    deployment.start
    job.start
    job.stop
    job.cancel
    runtime.status
    runtime.reconcile

Commands use the established protocol envelopes.

## 23. Command Idempotency

Critical commands must be idempotent.

Particularly:

- deployment preparation;
- deployment;
- start;
- stop;
- cancel;
- resource release.

Repeated command delivery must not produce duplicate physical execution.

## 24. Lab Agent Boundary

The architecture is:

    Cloud Control Plane
          |
          | Secure Lab Protocol
          v
    Lab Agent
          |
          | Local Runtime Channel
          v
    Kritva Runtime
          |
          v
    Robot

The Control Plane does not directly access the robot network.

## 25. Lab Agent Responsibilities

The Lab Agent provides:

- secure identity;
- heartbeat;
- resource discovery;
- artifact fetch;
- artifact verification;
- deployment;
- runtime control;
- telemetry;
- logs;
- local safety-state reporting;
- result collection;
- local recovery.

## 26. Lab Agent Identity

Every Lab Agent must have unique identity.

The Control Plane validates:

- agent identity;
- authorization;
- protocol version;
- supported capabilities;
- heartbeat;
- health.

An unknown or unauthorized agent cannot execute a Run.

## 27. Artifact Fetch

Deployment begins with controlled artifact access.

    Run
      |
      v
    Artifact Authorization
      |
      v
    Lab Agent
      |
      v
    Signed Download URL
      |
      v
    Object Storage
      |
      v
    `.krv`

The Lab Agent must not receive unrestricted storage credentials.

## 28. Artifact Verification at Lab

The Lab Agent independently verifies:

- digest;
- signature;
- package structure;
- platform;
- architecture;
- runtime compatibility.

Backend acceptance does not eliminate local verification.

## 29. Deployment

Deployment prepares the runtime without necessarily starting the application.

    DEPLOYING
        |
        v
    Fetch Artifact
        |
        v
    Verify Artifact
        |
        v
    Prepare Runtime
        |
        v
    Stage Configuration
        |
        v
    Deployment Ready
        |
        v
    STARTING

## 30. Deployment Isolation

The Lab Agent should stage the artifact in an execution-specific workspace.

Example:

    /var/lib/kritva/runs/<run-id>/

The exact filesystem path is implementation-specific.

Execution workspaces must be isolated between Runs.

## 31. Deployment Cleanup

After Run completion, the Lab Agent should:

- stop runtime;
- close execution resources;
- flush logs;
- flush telemetry;
- preserve required results;
- clean temporary files.

Cleanup must not delete required result artifacts.

## 32. Start

Start requires:

- valid Run;
- valid allocation;
- valid artifact;
- valid booking;
- Lab Agent online;
- runtime prepared;
- safety preconditions satisfied.

Flow:

    STARTING
       |
       v
    Preflight
       |
       v
    Runtime Start
       |
       v
    Start Confirmation
       |
       v
    RUNNING

## 33. Start Confirmation

A successful start must be based on authoritative runtime confirmation.

The API request returning successfully does not automatically mean the robot
application is running.

The Lab Agent must report runtime state.

## 34. Start Timeout

If start times out:

    STARTING
       |
       v
    Timeout
       |
       v
    Query Runtime
       |
       +--> NOT_STARTED --> Retry if safe
       |
       +--> RUNNING -----> RUNNING
       |
       +--> UNKNOWN -----> RECONCILIATION_REQUIRED

Never blindly issue another start command when physical state is unknown.

## 35. Supervision

During RUNNING, the Execution Service supervises:

- heartbeat;
- runtime state;
- execution deadline;
- resource health;
- Lab Agent connectivity;
- telemetry flow;
- log flow;
- safety-state indicators.

Supervision does not replace the robot's local safety controller.

## 36. Heartbeat

The Lab Agent should report periodic heartbeat.

Conceptual:

    agent_id
    run_id
    resource_id
    timestamp
    runtime_state
    health
    sequence

Heartbeat timeout indicates loss of communication, not proof that the robot
has stopped.

## 37. Runtime State

Possible runtime states:

    PREPARED
    STARTING
    RUNNING
    STOPPING
    STOPPED
    FAILED
    UNKNOWN

These states must be distinct from Job states.

## 38. Execution Health

Execution health may include:

- runtime healthy;
- degraded;
- agent disconnected;
- telemetry degraded;
- resource degraded;
- safety state unknown.

Health information supports supervision and operator visibility.

## 39. Execution Timeout

Every Run must have an execution deadline.

    RUNNING
       |
       v
    Deadline Reached
       |
       v
    Stop Request
       |
       v
    STOPPING
       |
       v
    Runtime Confirmation
       |
       v
    TIMEOUT

Timeout is an execution outcome, not merely a network error.

## 40. Stop

A controlled stop follows:

    RUNNING
       |
       v
    STOP REQUEST
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
    STOP CONFIRMED

Final Job/Run state depends on the reason for the stop.

## 41. User Stop

A user-initiated stop may result in:

    RUNNING
       |
       v
    STOPPING
       |
       v
    CANCELLED

The exact mapping is owned by Job/Run policy.

## 42. Timeout Stop

A timeout may result in:

    RUNNING
       |
       v
    STOPPING
       |
       v
    TIMEOUT

The physical runtime must be stopped or reconciled before final resource
release.

## 43. Stop Failure

If stop fails:

    STOPPING
       |
       v
    Stop Timeout
       |
       v
    Runtime Reconciliation
       |
       +--> STOPPED
       |
       +--> RUNNING --> Controlled Retry
       |
       +--> UNKNOWN --> Manual Intervention

The resource must not be released based solely on a failed stop request.

## 44. Safety Boundary

The Execution Service must explicitly distinguish:

- application stop;
- Job cancellation;
- runtime stop;
- robot safety state;
- physical emergency stop.

The cloud cannot certify physical safety merely from an API response.

## 45. Physical E-Stop

Physical emergency stop remains local.

    Physical E-Stop
          |
          v
    Local Safety Controller
          |
          v
    Robot Actuation Disabled

The cloud may receive a safety-state event but is not the authoritative
mechanism for emergency stopping.

## 46. Safety Preconditions

Before starting, the Lab Agent should verify configured local preconditions
such as:

- safety interlock state;
- E-stop state;
- robot readiness;
- actuator readiness;
- local fault state.

If safety state is unknown:

    SAFETY_STATE_UNKNOWN

Execution must fail closed.

## 47. Safety During Execution

If the Lab Agent reports an active safety interlock:

    RUNNING
       |
       v
    Safety Event
       |
       v
    Local Safety Action
       |
       v
    Execution State Reconciliation

The cloud should not delay a local safety response.

## 48. Safety Events

Relevant events include:

    safety.interlock_active
    safety.estop_active
    safety.state_changed
    safety.operation_blocked

These are operational signals, not substitutes for local safety control.

## 49. Telemetry

Telemetry provides runtime observation.

Typical telemetry:

- CPU;
- memory;
- temperature;
- battery;
- joint state;
- encoder data;
- sensor values;
- application metrics;
- runtime health.

High-frequency telemetry must not overload control-plane traffic.

## 50. Telemetry Path

    Robot Sensors
        |
        v
    Kritva Runtime
        |
        v
    Lab Agent
        |
        +--> Local buffering
        |
        v
    Telemetry Gateway
        |
        v
    Control Plane / Telemetry Store
        |
        v
    Studio/Web Console

## 51. Telemetry Authority

Telemetry is observational.

It does not become the authoritative source for:

- Job state;
- Run state;
- booking state;
- credit balance.

Durable domain state remains in the respective services.

## 52. Telemetry Backpressure

The system must support:

- bounded buffers;
- sampling;
- batching;
- rate limits;
- priority classes.

Control commands must not be starved by telemetry.

## 53. Telemetry Loss

Telemetry loss does not imply:

- Job stopped;
- Run failed;
- robot stopped;
- robot safe.

Example:

    Telemetry Disconnected
         |
         v
    TELEMETRY_DEGRADED

Supervision continues through control/heartbeat channels.

## 54. Log Ingestion

Logs may include:

- application stdout/stderr;
- runtime logs;
- Lab Agent logs;
- deployment logs;
- system execution events.

Logs should be associated with:

- job_id;
- run_id;
- agent_id;
- resource_id;
- timestamp;
- severity;
- sequence.

## 55. Log Flow

    Application
       |
       v
    Runtime
       |
       v
    Lab Agent
       |
       v
    Log Stream
       |
       v
    Execution Service
       |
       v
    Durable/Streaming Log Store

## 56. Log Backpressure

Log ingestion must be bounded.

The system should:

- batch logs;
- enforce maximum line size;
- enforce maximum rate;
- truncate or sample when necessary;
- preserve critical error logs.

## 57. Secret Redaction

Logs must not expose:

- tokens;
- API keys;
- passwords;
- signing keys;
- storage credentials;
- private authentication material.

Redaction should occur as close to the source as practical.

## 58. Telemetry and Logs vs Results

Telemetry and logs are runtime observations.

Results are execution outputs intended for analysis.

They must have separate lifecycle semantics.

    Telemetry/Logs
       = operational observation

    Results
       = execution output

## 59. Result Handoff

At execution completion:

    Run
       |
       v
    Runtime Stop
       |
       v
    Flush Logs/Telemetry
       |
       v
    Collect Result Manifest
       |
       v
    Result Service
       |
       v
    RESULT PROCESSING
       |
       v
    RESULT AVAILABLE

Execution Service hands off result metadata and references rather than owning
the result lifecycle.

## 60. Result Integrity

Result handoff should include:

- Run ID;
- artifact ID;
- resource ID;
- execution timestamps;
- result manifest;
- file references;
- checksums;
- metadata.

Result files should use object storage rather than large API payloads.

## 61. Execution Completion

A Run is considered execution-complete when:

- application/runtime has stopped;
- stop state is known;
- required telemetry/logs are flushed;
- resource release is requested;
- usage is reconciled;
- result handoff is initiated.

Result processing may continue asynchronously.

## 62. Resource Release

After execution:

    Run
      |
      v
    Stop Confirmed
      |
      v
    Usage Reconciliation
      |
      v
    Resource Release
      |
      v
    Result Handoff

Resource release must be idempotent.

## 63. Credit Consumption

Execution Service obtains actual usage information from the Run.

Flow:

    Run
      |
      v
    Usage Measurement
      |
      v
    Credit Service
      |
      +--> Consume Used Credits
      |
      +--> Release Unused Reservation

Credit Service remains authoritative for the ledger.

## 64. Partial Execution

If a Run starts but terminates early:

    Reserved = 500
    Actual = 180

The execution path should request:

    Consume 180
    Release 320

according to the platform billing policy.

## 65. Execution Overrun

If:

    Reserved = 500
    Actual = 650

the Execution Service must not directly modify the wallet.

It requests Credit Service handling according to overrun policy.

Possible outcomes:

- additional reservation;
- controlled consumption;
- execution cap;
- administrative reconciliation.

## 66. Job State Integration

Execution Service drives Job/Run transitions through application services.

It must not write arbitrary Job state directly.

Example:

    Execution Service
          |
          v
    JobService.start(...)
          |
          v
    Job State = RUNNING

## 67. Run State Integration

Run Service owns actual execution state.

Example:

    Lab Agent
       |
       v
    runtime.running
       |
       v
    RunService.recordRunning(...)
       |
       v
    Run = RUNNING

## 68. Event Flow

Execution produces:

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

Run produces:

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

## 69. Event Reliability

Business-critical state transitions should use an outbox.

    State Transaction
         |
         +--> Job/Run State
         +--> Outbox Event
         |
         v
       Commit
         |
         v
    Event Publisher

Events are at-least-once.

Consumers must tolerate duplicates.

## 70. Event Ordering

Ordering should be resource-scoped and Run-scoped where required.

Example:

    run.starting
        |
        v
    run.running
        |
        v
    run.stopping
        |
        v
    run.completed

An older event must not overwrite newer durable state.

## 71. Queue Architecture

Execution is asynchronous.

    API
      |
      v
    Job
      |
      v
    Queue
      |
      v
    Execution Worker
      |
      v
    Execution Service
      |
      v
    Lab Agent

Queue messages contain identifiers, not large artifacts.

## 72. Execution Worker

Workers:

- load authoritative state;
- validate current state;
- perform one bounded orchestration step;
- persist state;
- emit event;
- acknowledge queue message.

Workers are stateless.

## 73. Worker Crash

If a worker crashes:

    Worker
      |
      X
    Crash
      |
      v
    Queue Redelivery
      |
      v
    Load Job/Run
      |
      v
    Reconcile
      |
      v
    Continue / Recover / Fail

The worker must not assume its previous external command did not execute.

## 74. Crash During Start

Dangerous case:

    Control Plane
       |
       v
    Start Command
       |
       v
    Lab Agent
       |
       v
    Runtime
       |
       X
    Control Plane Crash

Recovery:

    Restart
       |
       v
    Query Lab Agent
       |
       v
    Actual Runtime State
       |
       +--> Running --> RUNNING
       +--> Stopped --> retry/fail
       +--> Unknown --> manual recovery

## 75. Crash During Stop

If the service crashes after requesting stop:

    Restart
       |
       v
    Query Runtime
       |
       +--> Stopped
       |      |
       |      v
       |    Complete/Cancel
       |
       +--> Running
       |      |
       |      v
       |    Controlled Stop
       |
       +--> Unknown
              |
              v
         Reconciliation

## 76. Network Partition

During Control Plane ↔ Lab Agent partition:

- local robot safety remains active;
- runtime may continue according to policy;
- Lab Agent buffers required state;
- cloud must not assume stop;
- new execution should normally be blocked;
- reconnect triggers reconciliation.

## 77. Lab Agent Offline

If heartbeat expires:

    Agent ONLINE
        |
        v
    Heartbeat Timeout
        |
        v
    AGENT_OFFLINE
        |
        v
    Reconciliation

An offline agent does not necessarily imply that the robot is stopped.

## 78. Reconciliation

Reconciliation compares:

    Control Plane
       |
       +-- Job State
       +-- Run State
       +-- Allocation
       |
       v
    Lab Agent
       |
       +-- Runtime State
       +-- Resource State
       +-- Active Run

Differences require deterministic recovery.

## 79. Reconciliation Outcomes

Possible outcomes:

- confirmed running;
- confirmed stopped;
- confirmed completed;
- confirmed failed;
- resource unavailable;
- agent offline;
- unknown;
- manual intervention required.

## 80. Safety During Reconciliation

If physical state is unknown:

    UNKNOWN
       |
       v
    Do Not Declare Safe
       |
       v
    Escalate / Reconcile

The cloud must never infer physical safety from missing communication.

## 81. Timeout Classes

At minimum:

- allocation timeout;
- deployment timeout;
- start timeout;
- execution timeout;
- stop timeout;
- telemetry timeout;
- result handoff timeout.

Timeouts must have independent remediation.

## 82. Allocation Timeout

    ALLOCATING
       |
       v
    Deadline
       |
       v
    Release Allocation
       |
       v
    Retry / FAILED

No resource may remain indefinitely reserved.

## 83. Deployment Timeout

    DEPLOYING
       |
       v
    Deadline
       |
       v
    Query Agent
       |
       +--> Prepared --> Continue
       |
       +--> Not Prepared --> Cleanup/Retry
       |
       +--> Unknown --> Reconcile

## 84. Execution Timeout

    RUNNING
       |
       v
    Execution Deadline
       |
       v
    STOPPING
       |
       v
    Runtime Confirmed Stopped
       |
       v
    TIMEOUT

The resource is not released until safe termination state is established.

## 85. Result Handoff Timeout

A result handoff timeout does not necessarily invalidate the Run.

Example:

    Run = COMPLETED
        |
        v
    Result Processing
        |
        v
    Storage Failure
        |
        v
    Result Recovery

Run state and Result state remain separate.

## 86. Retry Policy

Retry only transient failures.

Retryable candidates:

- queue delivery;
- transient storage failure;
- temporary Lab Agent connectivity;
- temporary metadata dependency failure.

Non-retryable candidates:

- invalid artifact;
- revoked artifact;
- incompatible platform;
- authorization failure;
- invalid booking;
- insufficient credits.

## 87. Physical Command Retry

Physical commands require special handling.

Never blindly retry:

- start;
- stop;
- deployment activation.

First reconcile actual runtime state.

## 88. Execution Errors

Relevant stable errors include:

    JOB_NOT_FOUND
    JOB_INVALID_STATE
    JOB_BOOKING_REQUIRED
    JOB_BOOKING_EXPIRED
    JOB_ARTIFACT_REQUIRED
    JOB_ARTIFACT_REJECTED
    JOB_RESOURCE_UNAVAILABLE
    JOB_DEPLOYMENT_FAILED
    JOB_START_FAILED
    JOB_STOP_FAILED
    JOB_TIMEOUT
    JOB_FAILED

Additional execution-specific errors may include:

    EXECUTION_RECONCILIATION_REQUIRED
    EXECUTION_PREFLIGHT_FAILED
    EXECUTION_AGENT_OFFLINE
    EXECUTION_RUNTIME_UNKNOWN

## 89. Security

Execution requires:

- authenticated API request;
- organization authorization;
- project access;
- artifact access;
- booking authorization;
- credit authorization;
- Lab Agent authentication;
- resource authorization.

No client may directly command a robot.

## 90. Lab Protocol Security

The Lab Protocol should use:

- authenticated Lab Agent identity;
- encrypted transport;
- message authentication;
- protocol versioning;
- replay protection where required;
- request IDs;
- correlation IDs;
- authorization per resource/Run.

## 91. Execution Isolation

Each Run should be isolated from other Runs.

Isolation includes:

- filesystem;
- process identity;
- environment;
- ports;
- device access;
- resource assignment.

The Lab Agent must enforce local policy.

## 92. Artifact Secrets

Artifacts must not contain unmanaged secrets.

If runtime secrets are required, they should be provisioned through a secure
secret mechanism rather than embedded in the `.krv` package.

## 93. Execution Configuration

Configuration should be explicit and validated.

The Execution Service must not allow arbitrary shell commands from users.

The Lab Agent must expose structured execution operations rather than:

    shell.execute(user_input)

## 94. Process Management

The Lab Agent/runtime owns local process lifecycle.

Execution Service requests:

    prepare
    start
    stop
    status

It does not remotely manipulate operating-system processes directly.

## 95. Configuration Validation

Before start:

- configuration schema;
- allowed values;
- resource compatibility;
- security policy;
- capability requirements.

Invalid configuration fails before physical execution.

## 96. Observability

Minimum execution metrics:

- executions started;
- start success rate;
- start latency;
- deployment latency;
- execution duration;
- stop latency;
- timeout count;
- agent disconnects;
- reconciliation count;
- telemetry loss;
- log ingestion rate;
- resource utilization.

## 97. Distributed Tracing

Execution must propagate:

    trace_id
    request_id
    operation_id
    job_id
    run_id
    allocation_id
    agent_id
    resource_id

This allows a single execution to be traced across:

    API
      |
      v
    Worker
      |
      v
    Job
      |
      v
    Run
      |
      v
    Lab Agent
      |
      v
    Runtime

## 98. Execution Audit

Audit events should record:

- execution request;
- admission;
- allocation;
- deployment;
- start;
- stop;
- cancellation;
- timeout;
- failure;
- resource;
- Run;
- administrative intervention.

## 99. Data Model

Conceptual Run:

    Run
      id
      job_id
      booking_id
      artifact_id
      allocation_id
      resource_id
      agent_id
      platform_id
      state
      started_at
      stopped_at
      deadline
      failure_code
      failure_details
      usage_summary
      created_at
      updated_at

## 100. Execution Repository

Conceptual:

    ExecutionRepository
        getJobExecution(...)
        getRun(...)
        createRun(...)
        transitionRun(...)
        recordHeartbeat(...)
        recordRuntimeState(...)
        recordFailure(...)
        recordCompletion(...)
        findStaleRuns(...)

Repository interfaces must remain domain-oriented.

## 101. Execution Service Interface

Conceptual:

    ExecutionService
        admit(...)
        validate(...)
        allocate(...)
        createRun(...)
        deploy(...)
        start(...)
        supervise(...)
        stop(...)
        cancel(...)
        timeout(...)
        reconcile(...)
        complete(...)
        handoffResults(...)

These are logical application interfaces.

## 102. Lab Agent Interface

Conceptual:

    LabAgentClient
        getStatus(...)
        prepareDeployment(...)
        verifyArtifact(...)
        start(...)
        stop(...)
        runtimeStatus(...)
        collectTelemetry(...)
        collectLogs(...)
        collectResults(...)
        release(...)

Transport details remain in the Lab Protocol layer.

## 103. Artifact Interface

Conceptual:

    ArtifactServiceClient
        get(...)
        validateForExecution(...)
        authorizeDownload(...)
        getCompatibility(...)

The Execution Service does not duplicate artifact storage logic.

## 104. Booking Interface

Conceptual:

    BookingServiceClient
        get(...)
        validateExecutionWindow(...)
        markActive(...)
        complete(...)
        cancelExecution(...)

Booking remains the authoritative reservation record.

## 105. Credit Interface

Conceptual:

    CreditServiceClient
        validateReservation(...)
        consume(...)
        release(...)
        reconcile(...)

Credit Service remains the ledger authority.

## 106. Result Interface

Conceptual:

    ResultServiceClient
        create(...)
        uploadManifest(...)
        registerFiles(...)
        finalize(...)
        failProcessing(...)

Execution hands off result ownership.

## 107. Execution API

Representative APIs:

    POST /api/v1/jobs
    POST /api/v1/jobs/{job_id}/start
    POST /api/v1/jobs/{job_id}/stop
    POST /api/v1/jobs/{job_id}/cancel
    GET  /api/v1/jobs/{job_id}
    GET  /api/v1/runs/{run_id}
    GET  /api/v1/runs/{run_id}/status
    GET  /api/v1/runs/{run_id}/logs
    GET  /api/v1/runs/{run_id}/metrics
    GET  /api/v1/runs/{run_id}/telemetry

## 108. Start API Semantics

    POST /api/v1/jobs/{job_id}/start

Returns:

    HTTP 202
    status = ACCEPTED
    operation_id = ...

The operation is asynchronous.

The client observes progress through:

- WebSocket events;
- GET Job;
- GET Run.

## 109. Stop API Semantics

    POST /api/v1/jobs/{job_id}/stop

Returns an accepted operation.

The response does not claim physical E-stop.

The final state is determined after Lab Agent confirmation/reconciliation.

## 110. Reconnect Behavior

When Studio reconnects:

    Reconnect
       |
       v
    Authenticate
       |
       v
    Restore Subscriptions
       |
       v
    Replay Events
       |
       v
    GET Job
       |
       v
    GET Run
       |
       v
    Reconcile UI

The UI must not rely only on missed WebSocket events.

## 111. Phase Mapping

| Phase | Execution Service Scope |
|---|---|
| Phase 0 | Execution domain and contracts |
| Phase 1 | Job/Run APIs and orchestration foundation |
| Phase 2 | Artifact/booking/credit admission |
| Phase 3 | Queue and worker execution |
| Phase 4 | Resource scheduling and allocation |
| Phase 5 | Lab Agent deployment and execution |
| Phase 6 | Physical robot integration and supervision |
| Phase 7 | Telemetry, logs and results |
| Phase 8 | Production hardening and recovery |

## 112. Phase 0

Define:

- Job/Run relationship;
- execution states;
- commands;
- errors;
- events;
- repository interfaces;
- safety boundary.

No physical robot execution is required.

## 113. Phase 1

Implement:

- Job/Run persistence;
- REST commands;
- asynchronous operation model;
- authorization;
- idempotency;
- state transition tests.

## 114. Phase 2

Integrate:

- Artifact Service;
- Booking Service;
- Credit Service;
- compatibility validation;
- admission control.

Execution remains mockable.

## 115. Phase 3

Implement:

- durable queue;
- workers;
- retry;
- timeout;
- cancellation;
- execution event pipeline.

Use simulated Lab Agent initially.

## 116. Phase 4

Implement:

- scheduler;
- resource allocation;
- resource locking;
- allocation timeout;
- release;
- reconciliation.

This phase establishes deterministic execution capacity management.

## 117. Phase 5

Integrate the real Lab Agent:

    Artifact
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
    Stop
       |
       v
    Release

## 118. Phase 6

Integrate physical resources:

- real robot runtime;
- safety preconditions;
- local interlocks;
- telemetry;
- runtime health;
- Lab Agent failure;
- physical-state reconciliation.

Human safety review remains a separate gate for physical deployment.

## 119. Phase 7

Integrate:

- live telemetry;
- logs;
- results;
- notifications;
- experiment history;
- rerun.

This phase completes the developer-facing execution experience.

## 120. Phase 8

Harden:

- crash recovery;
- load testing;
- resource starvation;
- queue scaling;
- observability;
- reconciliation;
- incident response;
- disaster recovery;
- operational runbooks;
- production safety review.

## 121. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Duplicate execution | Idempotent commands + reconciliation |
| Start uncertainty | Query runtime before retry |
| Stop uncertainty | Do not release until state known |
| Worker crash | Durable state + redelivery |
| Agent disconnect | Heartbeat + reconciliation |
| Stale artifact | Authoritative Artifact validation |
| Booking expired | Start-time validation |
| Credit inconsistency | Credit reservation/consumption reconciliation |
| Resource leak | Allocation expiry |
| Telemetry overload | Sampling/batching/backpressure |
| Log overload | Rate limits and bounded buffers |
| Unsafe cloud stop | Local safety controller |
| E-stop confusion | Explicit safety boundary |
| Result loss | Result Service + durable storage |
| Network partition | Local operation + reconciliation |
| Cross-tenant execution | Server-side authorization |
| Unauthorized robot control | Lab Agent boundary |
| Blind retry | Retry classification |
| Unknown physical state | Fail closed and escalate |
| Resource starvation | Scheduler fairness |
| Configuration injection | Typed structured configuration |
| Secret leakage | Secret management + redaction |

## 122. Open Questions

1. What exact Lab Protocol transport will be used in production?
2. Will Lab Agent use mTLS, secure WebSocket, VPN, or a combination?
3. What is the canonical runtime status contract?
4. What heartbeat interval and timeout should be used?
5. What execution timeout defaults apply per platform?
6. What local safety preconditions are mandatory?
7. Which safety states must block execution?
8. What telemetry transport will be used for high-rate streams?
9. Will telemetry use a dedicated time-series system?
10. What log retention policy applies?
11. What result handoff protocol will be used?
12. What maximum artifact deployment time is acceptable?
13. How will large artifacts be cached at the lab?
14. Will artifact downloads be resumable?
15. How many concurrent Runs can one Lab Agent supervise?
16. What is the maximum number of robots per Lab Agent?
17. What is the scheduler fairness policy?
18. What retry policy applies to each physical command?
19. How should a robot behave during prolonged cloud disconnect?
20. What local autonomy is permitted during cloud outage?
21. How should an active Run be handled during Lab Agent restart?
22. What constitutes a manual-intervention-required state?
23. What exact execution SLOs will production guarantee?
24. What telemetry retention is required for experiments?
25. Will video recording be part of the Execution Service or a separate service?
26. How will safety events be exposed to users?
27. What operator tooling is required for reconciliation?
28. How will physical resource maintenance interact with active Runs?
29. What exact usage-metering model will determine credits?
30. What production readiness evidence is required before physical deployment?

## 123. Full Acceptance Criteria

### Admission

- [ ] Authentication is validated.
- [ ] Organization authorization is validated.
- [ ] Project authorization is validated.
- [ ] Artifact access is validated.
- [ ] Artifact is accepted and executable.
- [ ] Artifact is not revoked.
- [ ] Artifact is not expired.
- [ ] Booking exists.
- [ ] Booking is confirmed.
- [ ] Booking window is valid.
- [ ] Credit authorization is valid where required.
- [ ] Platform compatibility is validated.
- [ ] Resource requirements are validated.

### Job/Run

- [ ] Job represents execution intent.
- [ ] Run represents execution attempt.
- [ ] Run references Job.
- [ ] Run references Artifact.
- [ ] Run references Booking.
- [ ] Run references Allocation.
- [ ] Run references Resource.
- [ ] Run references Lab Agent.
- [ ] Multiple Runs per Job are controlled by policy.
- [ ] Job and Run state remain authoritative in their respective services.

### Allocation

- [ ] Resource eligibility is checked.
- [ ] Resource health is checked.
- [ ] Maintenance state is checked.
- [ ] Capability requirements are checked.
- [ ] Allocation is durable.
- [ ] Allocation is exclusive where required.
- [ ] Allocation expiration exists.
- [ ] Allocation release is idempotent.
- [ ] Resource leaks are detectable.

### Deployment

- [ ] Artifact download is authorized.
- [ ] Lab Agent identity is verified.
- [ ] Artifact digest is verified locally.
- [ ] Artifact signature is verified locally.
- [ ] Artifact compatibility is verified.
- [ ] Execution workspace is isolated.
- [ ] Deployment state is durable.
- [ ] Deployment timeout exists.
- [ ] Deployment cleanup exists.
- [ ] Deployment commands are idempotent.

### Start

- [ ] Start requires valid Run.
- [ ] Start requires valid allocation.
- [ ] Start requires valid artifact.
- [ ] Start requires valid booking.
- [ ] Safety preconditions are checked.
- [ ] Start is asynchronous.
- [ ] Runtime start confirmation is authoritative.
- [ ] Start timeout is implemented.
- [ ] Start retry requires reconciliation.
- [ ] Duplicate start cannot create duplicate execution.

### Supervision

- [ ] Lab Agent heartbeat is monitored.
- [ ] Runtime state is monitored.
- [ ] Execution deadline is monitored.
- [ ] Resource health is monitored.
- [ ] Agent connectivity is monitored.
- [ ] Safety-state signals are observed.
- [ ] Telemetry health is monitored.
- [ ] Unknown runtime state is explicitly represented.
- [ ] Supervision does not infer safety from communication alone.

### Stop

- [ ] User stop is supported.
- [ ] Job cancellation is supported.
- [ ] Timeout stop is supported.
- [ ] Stop is idempotent.
- [ ] Stop confirmation is authoritative.
- [ ] Stop timeout exists.
- [ ] Stop failure triggers reconciliation.
- [ ] Resource is not released while state is unknown.
- [ ] Stop is not presented as physical E-stop.

### Timeout

- [ ] Allocation timeout exists.
- [ ] Deployment timeout exists.
- [ ] Start timeout exists.
- [ ] Execution timeout exists.
- [ ] Stop timeout exists.
- [ ] Result handoff timeout exists.
- [ ] Timeout recovery is deterministic.
- [ ] Timeout does not leak resources.
- [ ] Timeout does not blindly retry physical commands.

### Safety

- [ ] Physical safety remains local.
- [ ] E-stop is independent of cloud control.
- [ ] Safety interlocks can block start.
- [ ] Unknown safety state blocks execution where required.
- [ ] Safety events are observable.
- [ ] Cloud communication loss does not delay local safety action.
- [ ] UI Stop is clearly distinct from physical E-stop.
- [ ] Physical deployment has an explicit safety review gate.

### Telemetry

- [ ] Telemetry is associated with Run.
- [ ] Telemetry includes timestamps.
- [ ] Telemetry supports sequence/correlation.
- [ ] Telemetry is rate limited.
- [ ] Telemetry supports batching.
- [ ] Telemetry supports backpressure.
- [ ] Telemetry loss does not imply Run failure.
- [ ] Control traffic cannot be starved by telemetry.
- [ ] High-rate telemetry is separated from durable domain state.

### Logs

- [ ] Runtime logs are captured.
- [ ] Deployment logs are captured.
- [ ] Logs reference Run.
- [ ] Logs are timestamped.
- [ ] Logs are rate limited.
- [ ] Log size is bounded.
- [ ] Secrets are redacted.
- [ ] Log loss is observable.
- [ ] Logs remain distinct from results.

### Results

- [ ] Run completion triggers result handoff.
- [ ] Logs are flushed before result finalization where required.
- [ ] Telemetry is flushed according to policy.
- [ ] Result manifest is captured.
- [ ] Result files are integrity checked.
- [ ] Result Service owns result lifecycle.
- [ ] Result processing may continue after Run completion.
- [ ] Result handoff failure is recoverable.

### Credits

- [ ] Credit type matches platform.
- [ ] Credit reservation is validated.
- [ ] Actual usage is measured.
- [ ] Consumption is idempotent.
- [ ] Unused reservation is released.
- [ ] Partial execution is supported.
- [ ] Overrun policy is explicit.
- [ ] Failed execution follows credit policy.
- [ ] Credit reconciliation exists.

### Events

- [ ] Job lifecycle events are emitted.
- [ ] Run lifecycle events are emitted.
- [ ] Telemetry events are bounded.
- [ ] Log availability events are emitted where required.
- [ ] Reconciliation events are emitted.
- [ ] Events contain Run identity.
- [ ] Events contain correlation identifiers.
- [ ] Events are at-least-once.
- [ ] Event consumers tolerate duplicates.
- [ ] REST remains authoritative after event loss.

### Recovery

- [ ] Worker crash recovery exists.
- [ ] Backend restart recovery exists.
- [ ] Lab Agent restart recovery exists.
- [ ] Network partition recovery exists.
- [ ] Start uncertainty is reconciled.
- [ ] Stop uncertainty is reconciled.
- [ ] Resource state is reconciled.
- [ ] Run state is reconciled.
- [ ] Credit state is reconciled.
- [ ] Result state is reconciled.
- [ ] Manual intervention is auditable.

### Security

- [ ] No client can directly command a robot.
- [ ] Lab Agent authentication is enforced.
- [ ] Resource authorization is enforced.
- [ ] Organization isolation is enforced.
- [ ] Artifact authorization is enforced.
- [ ] Booking authorization is enforced.
- [ ] Credit authorization is enforced.
- [ ] Execution configuration is validated.
- [ ] Arbitrary shell execution is prohibited.
- [ ] Secrets are protected.

### API

- [ ] Start API exists.
- [ ] Stop API exists.
- [ ] Cancel API exists.
- [ ] Job status API exists.
- [ ] Run status API exists.
- [ ] Logs API exists.
- [ ] Telemetry API exists.
- [ ] Long-running operations return `operation_id`.
- [ ] Critical mutations support idempotency.
- [ ] Structured errors use stable codes.

### Observability

- [ ] Execution count is measured.
- [ ] Start latency is measured.
- [ ] Deployment latency is measured.
- [ ] Execution duration is measured.
- [ ] Stop latency is measured.
- [ ] Timeout rate is measured.
- [ ] Agent disconnects are measured.
- [ ] Reconciliation rate is measured.
- [ ] Telemetry loss is measured.
- [ ] Log ingestion is measured.
- [ ] Trace IDs are propagated.
- [ ] Job/Run IDs are present in structured logs.

### Testing

- [ ] Every valid Job state transition is tested.
- [ ] Every invalid transition is tested.
- [ ] Artifact admission is tested.
- [ ] Booking validation is tested.
- [ ] Credit validation is tested.
- [ ] Resource allocation is tested.
- [ ] Deployment is tested.
- [ ] Start is tested.
- [ ] Stop is tested.
- [ ] Timeout is tested.
- [ ] Cancellation is tested.
- [ ] Duplicate commands are tested.
- [ ] Worker crashes are tested.
- [ ] Lab Agent disconnect is tested.
- [ ] Runtime uncertainty is tested.
- [ ] Telemetry backpressure is tested.
- [ ] Result handoff is tested.
- [ ] End-to-end artifact-to-result execution is tested.

## 124. Final Architectural Invariants

1. Execution requires an accepted artifact.
2. Execution requires an authorized booking.
3. Execution requires an eligible resource.
4. Execution requires credit authorization where applicable.
5. Job represents execution intent.
6. Run represents actual execution.
7. Job and Run remain separate entities.
8. Lab Service owns physical resource allocation.
9. Lab Agent is the cloud-to-lab execution boundary.
10. Control Plane never directly controls robot networks.
11. Artifact Service owns artifact trust.
12. Booking Service owns booking entitlement.
13. Credit Service owns credit accounting.
14. Result Service owns result lifecycle.
15. Execution commands are asynchronous.
16. Critical execution commands are idempotent.
17. Physical commands are never blindly retried.
18. Unknown runtime state requires reconciliation.
19. Stop is not physical E-stop.
20. Physical safety remains local.
21. Telemetry is observational, not authoritative domain state.
22. Logs are operational data, not result authority.
23. WebSocket events are not authoritative execution state.
24. PostgreSQL remains authoritative for durable Job/Run state.
25. Queue delivery is not authoritative state.
26. Execution timeouts require controlled stop/reconciliation.
27. Resources are not released while physical state is unknown.
28. Credit consumption is based on explicit usage policy.
29. Result processing is independent of Run terminal state.
30. Crash recovery reconciles external state.
31. Cross-tenant execution is prohibited.
32. Arbitrary remote shell execution is prohibited.
33. Every execution is traceable by Job ID and Run ID.
34. Every physical execution path is observable and auditable.
35. Human safety review remains a separate gate for physical deployment.
36. The Execution Service is the orchestration bridge between the RaaS Control
    Plane and the physical robotic execution environment.

## 125. Completion Condition

The Execution Service is complete when the platform can reliably execute:

    Local Development
          |
          v
    Signed .krv Artifact
          |
          v
    Confirmed Booking
          |
          v
    Credit Authorization
          |
          v
    Job Admission
          |
          v
    Resource Allocation
          |
          v
    Run Creation
          |
          v
    Artifact Deployment
          |
          v
    Runtime Start
          |
          v
    RUNNING
          |
          +--> Telemetry
          +--> Logs
          +--> Health
          +--> Supervision
          |
          v
    Stop / Complete / Timeout
          |
          v
    Usage Reconciliation
          |
          v
    Resource Release
          |
          v
    Result Handoff
          |
          v
    Results Available

while safely handling:

- invalid artifacts;
- expired bookings;
- insufficient credits;
- resource conflicts;
- Lab Agent failures;
- runtime failures;
- start uncertainty;
- stop uncertainty;
- timeouts;
- worker crashes;
- backend restarts;
- network partitions;
- telemetry loss;
- log overload;
- result-storage failures;
- safety interlocks;
- physical E-stop conditions;
- unknown physical state.

The resulting architecture must preserve the central RaaS execution principle:

> **Build locally. Book remotely. Run on real robots.**

and the execution safety principle:

> **The cloud orchestrates execution, the Lab Agent controls the local runtime boundary, and the robot's local safety system remains authoritative for physical safety.**
