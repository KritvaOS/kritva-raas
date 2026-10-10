# F-M05-EXECUTION — Changelog

Milestone: F-M05 — Execution

# 11. Changelog

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

- Initial F-M05 milestone dossier.
- No implementation is implied by this document.
- F-M05 establishes remote execution orchestration and control.
- Job and Run are intentionally separate domain concepts.
- Software Stop is not an Emergency Stop.
- Physical safety remains local to the robot, safety controller, Lab Agent and
  runtime safety architecture.
- Cloud connectivity loss must never be interpreted as proof of robot safety.

---

# Appendix A — Phase Mapping

The canonical mapping for F-M05 EXECUTION (P5) is defined in `docs/planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `docs/planning/DEPENDENCY_MAP.md` and `docs/planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Upstream dependency; outputs consumed by this milestone |  |
| P4 BOOKING & COMMERCIAL | Upstream dependency; outputs consumed by this milestone |  |
| P5 EXECUTION | Owning phase | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Downstream consumer of this milestone's outputs | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Downstream consumer of this milestone's outputs |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — End-to-End Execution Flow

    User
      |
      v
    Select Artifact
      |
      v
    Select Booking
      |
      v
    Create Job
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
      +-----------------------+
      |                       |
      v                       v
    Logs                  Safety State
      |                       |
      +-----------+-----------+
                  |
                  v
            Control / Observe
                  |
                  v
             Software Stop
                  |
                  v
               Stopped
                  |
                  v
               Results

---

# Appendix C — Job/Run Architecture

    +-----------------------+
    |         JOB           |
    |                       |
    | artifact              |
    | booking               |
    | project               |
    | resource              |
    | lifecycle             |
    +-----------+-----------+
                |
                v
    +-----------------------+
    |         RUN           |
    |                       |
    | runtime instance      |
    | execution state       |
    | logs                  |
    | telemetry             |
    | safety state          |
    +-----------------------+

Job is orchestration identity.

Run is execution identity.

Neither replaces the other.

---

# Appendix D — Execution Control State Matrix

| Job/Run State | Start | Software Stop | Cancel | Retry |
|---|---:|---:|---:|---:|
| CREATED | Yes/Policy | No | Yes | No |
| QUEUED | No | No | Yes | No |
| VALIDATING | No | No | Yes | No |
| ALLOCATING | No | No | Yes | No |
| DEPLOYING | No | Policy | Yes | Policy |
| STARTING | No | Yes | Policy | No |
| RUNNING | No | Yes | Policy | Policy |
| STOPPING | No | No/Idempotent | No | No |
| COMPLETED | No | No | No | Policy |
| FAILED | No | No | No | Yes/Policy |
| CANCELLED | No | No | No | Policy |
| TIMEOUT | No | Policy | No | Policy |

The final authorization matrix must be defined by the execution service.

---

# Appendix E — Safety Architecture

    +------------------------------------------------------+
    |                 Cloud / Control Plane                |
    |                                                      |
    | Job state                                             |
    | Run state                                             |
    | Software command                                      |
    | Safety presentation                                   |
    +---------------------------+--------------------------+
                                |
                                v
                         Secure Lab Protocol
                                |
                                v
    +------------------------------------------------------+
    |                     Lab Agent                        |
    |                                                      |
    | Runtime supervision                                  |
    | Safety monitoring                                    |
    | Robot state                                          |
    +---------------------------+--------------------------+
                                |
                                v
    +------------------------------------------------------+
    |                  Kritva Runtime                      |
    |                                                      |
    | Application execution                                |
    | Local runtime safety                                 |
    | Stop handling                                        |
    +---------------------------+--------------------------+
                                |
                                v
    +------------------------------------------------------+
    |              Robot / Safety Controller               |
    |                                                      |
    | Physical E-stop                                      |
    | Actuation inhibition                                 |
    | Hardware safety                                      |
    +------------------------------------------------------+

The cloud is not the final physical safety authority.

---

# Appendix F — Software Stop Versus Physical E-Stop

| Property | Software Stop | Physical E-Stop |
|---|---|---|
| Initiator | Authorized software user/system | Physical safety mechanism |
| Path | Cloud → Lab → Runtime | Safety hardware/controller |
| Purpose | Controlled application shutdown | Emergency actuation inhibition |
| Timing | Software-dependent | Safety-system dependent |
| Cloud dependent | Usually | No |
| Requires runtime | Yes | No |
| Releases motors directly | Not necessarily | Safety system controls actuation |
| Equivalent to E-stop | No | Yes |
| UI label | Software Stop | Physical E-Stop |
| Safety authority | Runtime/application | Physical safety system |

This distinction is mandatory and must be preserved in all UI, API,
documentation and training material.

---

# Appendix G — Connectivity Model

    Studio
      |
      | HTTPS
      v
    Control Plane
      |
      | WebSocket
      v
    Studio Event Stream

    Control Plane
      |
      | Lab Protocol
      v
    Lab Agent
      |
      v
    Runtime

If Studio disconnects:

    Studio X Control Plane
          |
          v
    Execution continues according to local policy

If Control Plane disconnects from Lab Agent:

    Control Plane X Lab Agent
          |
          v
    Lab Agent / Runtime follow local safety policy

The system must never infer:

    disconnected == stopped
    disconnected == safe
    disconnected == E-stop

---

# Appendix H — Event Ordering

Execution events use:

- event ID;
- resource ID;
- Job/Run ID;
- timestamp;
- sequence;
- correlation ID.

Example:

    seq 41  run.state_changed  STARTING
    seq 42  run.log            Application started
    seq 43  run.state_changed  RUNNING
    seq 44  safety.state_changed READY
    seq 45  run.log            Processing frame

If the UI receives:

    41
    43
    44

it detects a gap and requests synchronization.

The UI must not permanently assume that event 42 never existed.

---

# Appendix I — Failure Model

## Artifact Failure

    Job
      |
      v
    VALIDATING
      |
      v
    FAILED

No deployment occurs.

## Booking Failure

    Job
      |
      v
    VALIDATING
      |
      v
    FAILED

No execution occurs.

## Resource Failure

    ALLOCATING
       |
       v
    FAILED

No unsafe execution occurs.

## Deployment Failure

    DEPLOYING
       |
       v
    FAILED

The resource remains governed by local safety policy.

## Runtime Failure

    RUNNING
       |
       v
    FAILED

No automatic unsafe restart.

## Safety Fault

    RUNNING
       |
       v
    SAFETY FAULT

The local safety system takes precedence over cloud execution state.

---

# Appendix J — Observability Model

Execution observability should correlate:

    Organization
        |
        v
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
        +--> Logs
        +--> Telemetry
        +--> Safety Events
        +--> Result

Correlation identifiers should be propagated across:

- Studio;
- Control Plane;
- Lab Agent;
- Runtime.

---

# Appendix K — Audit Model

Execution-control actions should produce audit records containing:

- organization ID;
- actor ID;
- actor type;
- Job ID;
- Run ID;
- action;
- previous state;
- requested state/action;
- result;
- timestamp;
- correlation ID;
- source;
- metadata.

Examples:

    JOB_CREATED
    JOB_STARTED
    RUN_STARTED
    SOFTWARE_STOP_REQUESTED
    SOFTWARE_STOP_COMPLETED
    SOFTWARE_STOP_FAILED
    JOB_CANCELLED
    RUN_FAILED
    SAFETY_STATE_CHANGED

Audit records are evidence, not the source of current Job/Run state.

---

# Appendix L — Performance Targets

Initial targets should be validated during implementation:

| Operation | Target |
|---|---:|
| Job creation API | p95 <= 500 ms excluding Lab startup |
| State update propagation | p95 <= 2 s |
| Log event display | p95 <= 2 s under normal load |
| Software stop acknowledgement | p95 <= 2 s for command acceptance |
| UI state refresh | <= 2 s after reconnect |
| E2E simulation startup | <= 30 s target |
| Duplicate command handling | deterministic |

These are initial engineering targets and may be revised using measured
qualification data.

---

# Appendix M — Open Questions

The following require explicit architectural/product decisions before
production completion:

1. Can one Job produce multiple Runs through retry?
2. Is retry automatic or always operator initiated?
3. Can a Run continue if the Studio disconnects?
4. Can a Run continue if the Control Plane loses Lab Agent connectivity?
5. What is the exact local fallback policy after cloud disconnect?
6. What Run states are exposed to customers versus operators?
7. Can customers request software stop during DEPLOYING?
8. Can customers cancel during RUNNING?
9. What happens to credits after a runtime failure?
10. What happens to credits after a physical safety fault?
11. What happens when the physical E-stop is active at Job start?
12. What happens when E-stop activates during RUNNING?
13. Does E-stop activation automatically terminate the Run record?
14. Is physical E-stop state readable from every robot platform?
15. What freshness threshold applies to physical safety state?
16. What should the UI display when safety state is unavailable?
17. Which role can issue Software Stop?
18. Are support operators allowed to stop customer Runs?
19. Which operations require step-up authentication?
20. What is the maximum Job execution duration?
21. What execution timeout applies to deployment?
22. What execution timeout applies to startup?
23. How are orphaned Jobs reconciled?
24. How are orphaned Runs reconciled?
25. How are Lab Agent restarts handled?
26. How are runtime restarts handled?
27. Is automatic recovery permitted for simulation only?
28. Which retry policies are allowed on physical robots?
29. What logs are retained permanently?
30. What logs may contain application output?
31. What log redaction rules are mandatory?
32. What maximum log rate can the UI render?
33. When should logs move to durable object storage?
34. What telemetry transport will be used in later milestones?
35. What video transport will be used in later milestones?
36. Should safety events have stronger ordering guarantees than ordinary
    events?
37. Which safety events must be persisted permanently?
38. How should operator acknowledgement of safety alarms work?
39. What human safety review is required before physical execution?
40. What is the formal gate between simulation and physical robot execution?
41. What is the rollback behavior for a bad artifact?
42. How are revoked artifacts handled by queued Jobs?
43. How are expired bookings handled by queued Jobs?
44. What happens when booking expires during RUNNING?
45. How is final credit consumption reconciled with booking reservation?
46. How are results associated with multiple retry Runs?
47. What is the final Job completion definition when a Run fails?
48. What is the support workflow for execution incidents?
49. What production observability dashboard is required?
50. Which execution controls remain P0 versus P1?

Open questions must be converted into tracked decisions before implementation
depends on them.

---

# Appendix N — Definition of Done

F-M05 is Done only when the following complete flow is demonstrable:

    Valid Artifact
          |
          v
    Confirmed Booking
          |
          v
    Create Job
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
          +--> Logs
          |
          +--> Safety
          |
          v
    Software Stop
          |
          v
    Stop Confirmation
          |
          v
    Final Run State
          |
          v
    Evidence

Every execution-control operation must have verifiable evidence.

---

# Appendix O — Final Milestone Invariants

1. Job and Run are distinct entities.
2. A Job cannot execute an unauthorized artifact.
3. A Job cannot execute against an unauthorized booking.
4. Artifact compatibility is validated before execution.
5. Booking validity is validated before execution.
6. Resource eligibility is validated before execution.
7. Job creation is idempotent.
8. Start is idempotent.
9. Software Stop is idempotent.
10. Execution commands are authorization-controlled.
11. Job state is durable.
12. Run state is durable.
13. WebSocket events are not authoritative.
14. REST/durable state is authoritative.
15. Event IDs support deduplication.
16. Sequence numbers support gap detection.
17. Reconnect triggers state synchronization.
18. Disconnect does not imply execution stopped.
19. Disconnect does not imply the robot is safe.
20. Software Stop is not an Emergency Stop.
21. Physical E-stop is a separate safety mechanism.
22. Physical E-stop state is independently sourced.
23. UNKNOWN safety state is not SAFE.
24. DISCONNECTED safety state is not SAFE.
25. No unsafe automatic robot restart occurs.
26. Local safety authority overrides cloud execution control.
27. Safety state cannot be overridden by normal UI controls.
28. Execution logs are associated with Job/Run.
29. Sensitive log content is protected.
30. Execution actions are auditable.
31. Tenant isolation applies to Job, Run and logs.
32. Historical Run records are not silently overwritten.
33. Retry creates explicit execution history.
34. Failed execution cannot be displayed as successful execution.
35. Stop is not displayed as completed before authoritative confirmation.
36. Physical execution remains gated by safety review.
37. Simulation is the first execution qualification environment.
38. Cloud failure does not become a physical safety control.
39. Booking and credit state remain governed by their authoritative domains.
40. F-M05 provides the execution foundation for telemetry, video, results and
    production robot operation.

# Appendix P — Milestone Principle

> F-M05 establishes the controlled execution boundary of Kritva RaaS. A
> validated artifact and confirmed booking become an authorized Job, which is
> then validated, allocated, deployed and started through the Lab Agent and
> Kritva Runtime. The Studio observes durable Job and Run state and provides
> explicit execution controls, including a controlled Software Stop. The
> system must never confuse software execution control with physical robot
> safety. A physical Emergency Stop is a separate hardware/safety mechanism
> whose authority remains local to the robot and safety controller. Cloud
> connectivity, WebSocket state, Job state or software stop acknowledgement
> must never be represented as proof that the physical robot is safe. F-M05
> therefore establishes not merely a remote execution UI, but the state,
> command, observability and safety presentation boundary required before
> Kritva RaaS can safely progress from simulation to real robotic execution.
