# B-M05-EXECUTION — Changelog

Milestone: B-M05 — Execution

# 11 Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Fixed

- Date:
- Issue:
- Task:
- Author:
- Evidence:

## Removed

- Date:
- Change:
- Reason:
- Task:
- Author:
- Evidence:

## Notes

- Initial B-M05 milestone dossier.
- No implementation is implied by this document.
- Job represents execution orchestration.
- Run represents an execution attempt.
- Durable Job/Run state is authoritative.
- Queue is a delivery mechanism, not business truth.
- Workers execute through domain services.
- The first Lab Agent is simulated.
- Physical safety remains local and authoritative.
- Software Stop is not Emergency Stop.
- Execution must remain compatible with the future physical Lab Agent boundary.

---

# Appendix A — Phase Mapping

## Phase 0 — FOUNDATION

B-M05 consumes:

- API foundation;
- PostgreSQL;
- authentication;
- authorization;
- testing;
- queue infrastructure abstraction;
- observability.

## Phase 1 — STUDIO

B-M05 consumes:

- Project;
- Organization;
- repository foundation;
- API contracts;
- platform/resource catalog.

## Phase 2 — BUILD & ARTIFACT

B-M05 consumes:

- artifacts;
- artifact security;
- compatibility;
- basic platform discovery.

## Phase 3 — CONTROL PLANE

B-M05 is the primary backend milestone for:

- Job;
- Run;
- queue;
- worker;
- execution service;
- Lab Agent;
- simulated execution;
- timeout;
- cancellation.

## Phase 4 — BOOKING & COMMERCIAL

B-M05 integrates:

- credit reservation;
- credit consumption;
- booking enforcement;
- resource allocation;
- execution billing evidence.

## Phase 5 — EXECUTION

B-M05 evolves from:

    Simulated Lab Agent

to:

    Real Lab Agent
        |
        v
    Kritva Runtime
        |
        v
    Physical Robot

## Phase 6 — LAB & ROBOT

B-M05 gains:

- hardened execution isolation;
- stronger artifact verification;
- production worker controls;
- security monitoring;
- safety qualification.

## Phase 7 — LIVE & RESULTS

B-M05 evolves toward:

- worker pools;
- resource-aware scheduling;
- queue scaling;
- execution quotas;
- fleet-level orchestration;
- high availability.

## Phase 8 — PRODUCTION

Execution becomes a production service supporting controlled real-robot
execution.

---

# Appendix B — End-to-End Execution Architecture

    +--------------------+
    |       Studio       |
    +---------+----------+
              |
              | REST
              v
    +--------------------+
    |    Control Plane   |
    +---------+----------+
              |
              v
        +-----------+
        | JobService|
        +-----+-----+
              |
              v
        +-----------+
        |   Queue   |
        +-----+-----+
              |
              v
        +-----------+
        |  Worker   |
        +-----+-----+
              |
              v
      +---------------+
      | Execution     |
      | Service       |
      +-------+-------+
              |
              v
       +-------------+
       | Lab Agent   |
       +------+------+ 
              |
              v
       +-------------+
       | Runtime     |
       +------+------+ 
              |
              v
       +-------------+
       | Simulator / |
       | Robot       |
       +-------------+

Durable state:

    PostgreSQL
        |
        +--> Job
        +--> Run
        +--> Audit
        +--> Execution Evidence

---

# Appendix C — Job/Run Relationship

    Job J-001
       |
       +-------------------+
       |                   |
       v                   v
    Run R-001            Run R-002
    FAILED               COMPLETED

Each Run preserves:

- artifact identity;
- platform identity;
- resource identity;
- runtime;
- SDK;
- start/end;
- result status.

The historical snapshot protects against later catalog changes.

---

# Appendix D — Execution Eligibility Architecture

    Create Job
        |
        v
    Authorization
        |
        v
    Artifact Access
        |
        v
    Artifact Trust
        |
        v
    Booking Validation
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
    ELIGIBLE

Any mandatory failure:

    NOT_ELIGIBLE

The reason must be machine-readable and human-readable.

---

# Appendix E — Queue Architecture

    Job Created
        |
        v
    Durable Job State
        |
        v
    Enqueue
        |
        v
    Queue
        |
        +--> Worker A
        |
        +--> Worker B
        |
        +--> Worker C

Worker concurrency must be bounded by:

- global capacity;
- worker capacity;
- resource capacity;
- tenant quota;
- execution policy.

---

# Appendix F — Worker Claim Model

Conceptually:

    Job
      |
      | status = QUEUED
      v
    Claim
      |
      +--> worker_id
      +--> claimed_at
      +--> lease_until
      |
      v
    VALIDATING

If:

    current_time > lease_until

then:

    claim = stale

and reconciliation may recover the Job.

The system must not assume a stale worker claim means the underlying physical
execution has stopped.

---

# Appendix G — Execution Service Contract

Conceptual interface:

    createJob(request)
    validateJob(jobId)
    allocateJob(jobId)
    deployJob(jobId)
    startJob(jobId)
    stopJob(jobId)
    cancelJob(jobId)
    getJobStatus(jobId)
    getRunStatus(runId)
    reconcileJob(jobId)
    cleanupJob(jobId)

The service must enforce domain state transitions rather than allowing
callers to write state arbitrarily.

---

# Appendix H — Lab Agent Contract

Conceptual request:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "job_id": "job-001",
        "run_id": "run-001",
        "command": "deploy",
        "resource_id": "resource-001",
        "artifact_id": "artifact-001"
    }

Conceptual response:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "status": "SUCCESS",
        "code": "DEPLOYED",
        "job_id": "job-001",
        "run_id": "run-001"
    }

The protocol must be versioned independently from product release versioning.

---

# Appendix I — Simulated Lab Agent

The simulated Lab Agent should support deterministic modes:

    SUCCESS
    DEPLOY_FAILURE
    START_FAILURE
    RUNTIME_FAILURE
    TIMEOUT
    DISCONNECT
    RESOURCE_FAULT
    STOP_DELAY
    CLEANUP_FAILURE

Each mode must be explicitly selectable by test configuration.

Simulation must never silently emulate physical safety.

---

# Appendix J — Execution Timeout Model

    Requested Timeout
          |
          v
    Validate Policy
          |
          v
    Persist Deadline
          |
          v
    Monitor
          |
       +--+--+
       |     |
    Finish  Deadline
       |     |
       v     v
    Normal  TIMEOUT
              |
              v
             STOP
              |
              v
           CLEANUP

The deadline must be durable so worker restarts cannot reset it.

---

# Appendix K — Cancellation Model

    Cancellation Request
           |
           v
    Authorization
           |
           v
    Current State
           |
           v
    STOPPING
           |
           v
    Lab Agent Stop
           |
       +---+---+
       |       |
    ACK       Timeout
       |       |
       v       v
    CANCELLED  Escalate

A cancellation request must not falsely report success before the system has
received the appropriate execution acknowledgement.

---

# Appendix L — Failure Model

Failure categories:

| Category | Example | Typical Action |
|---|---|---|
| Validation | incompatible artifact | FAILED |
| Authorization | forbidden | REJECT |
| Queue | unavailable | Retry/recover |
| Worker | crash | Recover |
| Deployment | artifact rejected | FAILED |
| Startup | runtime failed | FAILED |
| Runtime | application crash | FAILED |
| Timeout | deadline reached | TIMEOUT |
| Cancellation | user stop | CANCELLED |
| Infrastructure | Lab Agent unavailable | Policy-dependent |

Failure classification must be explicit.

---

# Appendix M — Retry Safety

Retry is safe only when the operation is known to be idempotent.

Examples:

    Queue receive
    State read
    Status read

Potentially unsafe:

    Physical start
    Physical reset
    Motion command
    Hardware initialization

Therefore:

> Uncertain physical execution state must not trigger an automatic retry that
> could create duplicate physical action.

This is a mandatory physical-safety boundary.

---

# Appendix N — Execution and Credit Integration

    Booking
       |
       v
    Credit Reservation
       |
       v
    Job
       |
       v
    Run
       |
       +--> Completed
       |       |
       |       v
       |    Consume
       |
       +--> Failed
       |       |
       |       v
       |    Policy
       |
       +--> Cancelled
               |
               v
             Release /
             Refund Policy

B-M05 invokes Credit application services.

It does not directly modify ledger tables.

---

# Appendix O — Execution and Booking Integration

Before Job start:

    Booking status = CONFIRMED / ACTIVE
    Allocation status = CONFIRMED / ACTIVE
    Resource = eligible
    Current time = within allowed window

If these conditions fail:

    Execution = NOT_ELIGIBLE

Booking confirmation alone does not permanently guarantee execution if the
resource later becomes faulted or unavailable.

---

# Appendix P — Audit Events

Recommended Job events:

    job.created
    job.queued
    job.validating
    job.validated
    job.allocating
    job.allocated
    job.deploying
    job.deployed
    job.starting
    job.running
    job.stopping
    job.completed
    job.failed
    job.cancelled
    job.timeout

Recommended Run events:

    run.created
    run.preparing
    run.starting
    run.running
    run.stopping
    run.completed
    run.failed
    run.cancelled
    run.timeout

Audit events must identify:

- actor;
- source;
- Job;
- Run;
- Organization;
- timestamp;
- correlation ID.

---

# Appendix Q — Operational Metrics

Control Plane metrics:

- Job creation rate;
- queued Job count;
- queue depth;
- Job age;
- claim latency;
- worker count;
- worker utilization;
- execution concurrency;
- validation failures;
- deployment failures;
- startup failures;
- Run success rate;
- Run failure rate;
- timeout rate;
- cancellation rate;
- cleanup failures;
- retry count;
- dead-letter count;
- Lab Agent latency;
- Lab Agent failure rate;
- execution duration;
- resource utilization.

These metrics must be separated from financial and safety metrics.

---

# Appendix R — Observability Correlation

A single execution should be traceable:

    request_id
        |
        v
    job_id
        |
        v
    run_id
        |
        v
    queue_message_id
        |
        v
    worker_id
        |
        v
    lab_agent_request_id
        |
        v
    execution_id

Correlation metadata must not expose secrets.

---

# Appendix S — Open Questions

1. Does the first release permit multiple Runs per Job?
2. What retry policy is allowed for simulation?
3. What retry policy is allowed for physical robots?
4. Is Job timeout separate from Run timeout?
5. What is the default maximum execution duration?
6. Can users specify custom timeout?
7. What limits apply by subscription?
8. What limits apply by platform?
9. What limits apply by resource?
10. What happens if a booking expires while a Run is active?
11. Can execution continue slightly beyond booking end for teardown?
12. Who owns the teardown buffer?
13. What happens when a robot faults during a Run?
14. What is the exact Lab Agent heartbeat interval?
15. What is the execution lease duration?
16. What happens when Lab Agent heartbeat is lost?
17. When is automatic recovery permitted?
18. When is human intervention required?
19. Which failures are retryable?
20. Which failures require immediate terminal state?
21. Should failed deployment consume credits?
22. Should failed startup consume credits?
23. Should timeout consume full or partial credits?
24. How is actual execution duration measured?
25. Is billing based on actual runtime or reserved time?
26. What is the result of an uncertain stop?
27. What happens when the Lab Agent reports RUNNING but the Control Plane
    believes the Run is FAILED?
28. Which system wins reconciliation conflicts?
29. Can Jobs be queued before their booking starts?
30. How early can Jobs be submitted?
31. Can Jobs be cancelled while QUEUED?
32. Can Jobs be cancelled while DEPLOYING?
33. Can Jobs be cancelled while STARTING?
34. Can a Job be manually retried by an administrator?
35. What approval is required for manual retry?
36. Should worker pools be platform-specific?
37. Should worker pools be resource-specific?
38. What is the first production queue technology?
39. Is an outbox required for Job-to-queue publication?
40. What is the recovery scan interval?
41. What is the dead-letter retention period?
42. How are permanently failed Jobs surfaced?
43. What execution logs are persisted?
44. What result metadata is generated by the execution service?
45. Which execution metadata may contain customer data?
46. How are artifacts removed from Lab Agent temporary storage?
47. What sandboxing is required for simulated execution?
48. What sandboxing is required for physical execution?
49. How is the runtime identity established?
50. How are Lab Agent identities provisioned?
51. How is execution authorization propagated to the Lab Agent?
52. How does the Lab Agent reject revoked artifacts?
53. What happens if artifact revocation occurs while a Run is active?
54. Can the Control Plane remotely terminate a Run?
55. Which stop command is software-only?
56. How is physical E-stop state surfaced later?
57. What safety review is mandatory before HIL execution?
58. What safety review is mandatory before physical execution?
59. What execution evidence is required for release qualification?
60. How are execution state migrations handled?

These questions must become explicit decisions before they alter the execution
contract.

---

# Appendix T — Definition of Done

B-M05 is Done when the following software-only path is demonstrable:

    Signed Artifact
          |
          v
    Confirmed Booking
          |
          v
    Create Job
          |
          v
    Eligibility
          |
          v
    Queue
          |
          v
    Worker
          |
          v
    Allocation
          |
          v
    Deployment
          |
          v
    Start Run
          |
          v
    Simulated Execution
          |
          v
    Completion
          |
          v
    Cleanup
          |
          v
    Credit Finalization

And the following failure paths are demonstrable:

    Timeout
    Cancellation
    Deployment Failure
    Runtime Failure
    Worker Crash
    Queue Duplication
    Lab Agent Disconnect

---

# Appendix U — Final Milestone Invariants

1. Job represents execution orchestration.
2. Run represents an execution attempt.
3. Job and Run are distinct domain objects.
4. Job state is durable.
5. Run state is durable.
6. Queue is not business truth.
7. Worker claims are recoverable.
8. Queue messages are idempotently processable.
9. Execution requires authorization.
10. Execution requires valid artifact.
11. Execution requires artifact integrity.
12. Execution requires artifact trust.
13. Execution requires platform compatibility.
14. Execution requires valid booking.
15. Execution requires valid resource allocation.
16. Execution requires an eligible resource.
17. Job state transitions are explicit.
18. Run state transitions are explicit.
19. Invalid transitions are rejected.
20. Start is idempotent.
21. Stop is idempotent.
22. Cancellation is distinct from E-stop.
23. Timeout is durable.
24. Timeout initiates controlled cleanup.
25. Worker failure is recoverable.
26. Duplicate queue messages do not create duplicate execution.
27. Uncertain physical execution is not automatically retried.
28. Resource cleanup is required after terminal execution.
29. Credit mutations are delegated to the Credit Service.
30. Execution/credit outcomes are reconcilable.
31. Tenant isolation applies to Job and Run.
32. Execution events are auditable.
33. Lab Agent contract is provider-neutral.
34. Simulated Lab Agent implements the future physical contract.
35. Simulation does not imply physical safety qualification.
36. Cloud/control-plane connectivity does not define physical safety.
37. Local runtime/Lab Agent/safety system remains authoritative for physical
    safety.
38. WebSocket/live observation does not become execution truth.
39. Historical Run context remains traceable.
40. Production execution requires security review.
41. Physical execution requires separate safety review.
42. B-M05 provides the execution foundation for F-M05 and F-M06.
43. Completion requires implementation, automated testing, fault injection,
    reconciliation, security review, architecture review and acceptance
    evidence.

# Appendix V — Milestone Principle

> B-M05 establishes the authoritative execution control plane for Kritva RaaS.
> A Job represents the requested orchestration while a Run represents an
> actual execution attempt. The system validates authorization, artifact
> integrity and trust, booking eligibility, resource allocation and platform
> compatibility before execution. Durable Job and Run state remains the source
> of truth, while queues provide reliable delivery and workers provide
> asynchronous execution capacity. The simulated Lab Agent establishes the
> same contract that will later connect to a real Lab Agent and Kritva Runtime,
> allowing the software execution architecture to be qualified before
> physical robots are introduced. Timeouts, cancellation, worker recovery,
> duplicate messages and Lab Agent faults are first-class conditions rather
> than exceptional afterthoughts. Execution actions are idempotent wherever
> possible, while uncertain physical operations are never blindly retried.
> Software Stop remains distinct from Emergency Stop, and physical safety
> remains local and authoritative. This milestone therefore creates the
> controlled transition from a booked software artifact to an actual robotic
> execution attempt while preserving the security, financial, operational and
> safety boundaries established by the preceding Kritva RaaS milestones.
