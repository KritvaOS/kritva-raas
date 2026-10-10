# F-M05 — Execution

## Milestone Dossier

**Milestone ID:** F-M05-EXECUTION  
**Product:** Kritva RaaS  
**Primary Phase:** P5 EXECUTION  
**Primary Surface:** RaaS Studio + Control Plane  
**Technology:** Tauri + Rust + React + TypeScript + WebSocket/REST  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `docs/planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** A production-grade remote execution workflow that creates
Jobs from validated artifacts and confirmed bookings, displays Job and Run
lifecycle state, provides controlled software execution commands, streams
execution logs, and presents robot safety state without confusing software stop
with the physical emergency stop.

---

# 1. Objective

## 1.1 Milestone Objective

F-M05 establishes the remote execution control plane between the user's
validated `.krv` artifact, a confirmed booking, the simulated Lab Agent, and the
Kritva Runtime executing on a simulated robotic resource.

F-M05 belongs to P5 EXECUTION, which is limited to remote execution through a
simulated Lab Agent and simulated robots. Physical Lab Agent and physical robot
integration, physical emergency-stop qualification, and hardware safety review
are owned by P6 LAB & ROBOT and are not acceptance requirements for F-M05.

The primary workflow is:

    Project
       |
       v
    Signed .krv Artifact
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
       +------> Live Logs
       |
       +------> Telemetry
       |
       +------> Safety State
       |
       v
    Stop / Complete / Fail
       |
       v
    Results

F-M05 does not redefine the artifact, booking or physical safety architecture.
It integrates those previously established contracts.

## 1.2 Product Intent

The user experience must make remote execution understandable and controlled.

The user should be able to answer:

1. What artifact am I executing?
2. Which project owns it?
3. Which platform and configuration will execute it?
4. Which booking authorizes execution?
5. What is the current Job state?
6. What is the current Run state?
7. Is the application actually running?
8. What are the latest execution logs?
9. Is the robot operational?
10. Is the robot in a safe state?
11. Can I request a software stop?
12. Has the software stopped?
13. Is the physical emergency stop active?
14. What happens if the cloud connection is lost?

The UI must never imply that a software stop is equivalent to a physical
emergency stop.

## 1.3 Primary Success Definition

F-M05 is successful when an authorized user can:

1. select a validated artifact;
2. select a confirmed booking;
3. verify platform compatibility;
4. create a Job;
5. observe Job state transitions;
6. observe Run state transitions;
7. observe deployment/start progress;
8. view execution logs;
9. issue an authorized software stop;
10. observe stop acknowledgement;
11. observe robot/lab safety state;
12. clearly distinguish software stop from physical E-stop;
13. handle disconnect/reconnect;
14. inspect failure conditions;
15. prevent duplicate Job creation;
16. preserve auditability of execution control operations.

## 1.4 Architectural Objective

The execution architecture is:

    RaaS Studio
         |
         | REST / WebSocket
         v
    Control Plane
         |
         +--> Job Service
         +--> Run Service
         +--> Artifact Service
         +--> Booking Service
         +--> Authorization
         +--> Audit
         |
         v
    Lab Protocol
         |
         v
    Lab Agent
         |
         v
    Kritva Runtime
         |
         +--> Application
         +--> Robot Control
         +--> Safety Monitor
         |
         v
    Robot / Simulator

The Control Plane coordinates execution.

The Lab Agent is the cloud-to-lab boundary.

The local Kritva Runtime and physical safety systems remain authoritative for
robot safety.

## 1.5 Job and Run Separation

A Job represents the requested remote execution operation.

A Run represents an execution instance produced by the Job.

Conceptually:

    Job
     |
     +--> validation
     +--> allocation
     +--> deployment
     +--> lifecycle control
     |
     v
    Run
     |
     +--> runtime instance
     +--> execution state
     +--> logs
     +--> telemetry
     +--> safety state
     +--> results

The distinction is mandatory.

A Job may fail before a Run begins.

A Job may produce a Run that later fails.

A Run may be stopped independently through the execution lifecycle while the
Job remains the durable orchestration record.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M05 includes:

- Job creation;
- artifact selection;
- booking association;
- compatibility validation;
- Job lifecycle;
- Run lifecycle;
- execution state display;
- deployment state display;
- start control;
- software stop control;
- retry where policy permits;
- cancellation where policy permits;
- execution logs;
- log streaming;
- log filtering;
- connection status;
- Lab Agent health;
- runtime health;
- software safety state;
- physical E-stop state presentation;
- safety-state differentiation;
- execution authorization;
- execution audit events;
- WebSocket event handling;
- reconnect/resynchronization;
- idempotent execution commands;
- failure handling;
- timeout handling;
- operator feedback;
- automated tests;
- simulation-lab execution.

## 2.2 Explicitly Out of Scope

F-M05 does not implement:

- physical robot safety controller design;
- physical E-stop hardware;
- motor-controller firmware;
- safety PLC implementation;
- robot certification;
- autonomous safety policy;
- advanced telemetry analytics;
- video recording/analysis;
- experiment comparison;
- result analysis;
- fleet deployment;
- multi-robot orchestration;
- production auto-scaling;
- billing calculation;
- credit pricing;
- artifact creation;
- source-code upload;
- remote compilation.

F-M05 consumes these capabilities from earlier or later domains.

## 2.3 Execution Control Scope

Execution controls include only operations explicitly authorized by the execution
contract.

Expected initial controls:

- Start;
- Software Stop;
- Cancel before execution;
- Retry where safe and supported.

The UI must not expose a fake "Emergency Stop" action unless it is directly
connected to an authoritative physical safety interface and its semantics are
explicitly defined.

## 2.4 Safety Scope

F-M05 presents safety state.

It does not create the physical safety system.

The distinction is:

    Software Stop
        |
        v
    Application / Runtime Stop Request
        |
        v
    Controlled Application Shutdown

versus:

    Physical E-Stop
        |
        v
    Safety Hardware / Safety Controller
        |
        v
    Actuation Inhibition

A software stop must never be described as an emergency stop.

## 2.5 Execution Environment

F-M05 must support:

- simulated robot;
- reference/simulation lab;
- simulated Lab Agent;
- Kritva Runtime;
- controlled test environment.

Physical robot execution is out of scope for F-M05 and P5 EXECUTION. It is
introduced in P6 LAB & ROBOT and may be enabled only after the applicable
safety gate and human safety review are satisfied.

F-M05 defines the user-interface contract for safety-state presentation
(including the E-stop state indicator) and verifies it using simulated or
injected state. That contract is reused, not re-accepted, when P6 LAB & ROBOT
connects an authoritative physical safety interface.

---

# 3. Dependencies

## 3.1 Milestone Dependencies

F-M05 depends on:

- F-M01 Studio Foundation;
- F-M02 Projects;
- F-M03 Build & Artifact;
- F-M04 Booking;
- authentication;
- authorization;
- artifact validation;
- booking validation;
- Job/Run database model;
- Lab Protocol;
- Lab Agent;
- Kritva Runtime;
- WebSocket/event infrastructure;
- audit logging.

## 3.2 Primary Documentation Dependencies

| Document | Relationship |
|---|---|
| `docs/frontend/milestones/F-M03-BUILD-ARTIFACT/MILESTONE.md` | Artifact |
| `docs/frontend/milestones/F-M04-BOOKING/MILESTONE.md` | Booking |
| `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Persistence |
| `docs/database/schema/PLATFORMS.md` | Platform/resource |
| `docs/database/schema/BOOKINGS.md` | Booking |
| `docs/security/AUTHENTICATION.md` | Authentication |
| `docs/security/AUTHORIZATION.md` | Execution authorization |
| `docs/security/ARTIFACT_SECURITY.md` | Artifact trust |
| `docs/security/AUDIT_LOGGING.md` | Execution audit |
| `docs/security/TENANT_ISOLATION.md` | Tenant isolation |
| `docs/planning/INTEGRATION_PLAN.md` | Lab integration |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | UI acceptance |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | UI review |

## 3.3 Artifact Dependency

A Job may execute only an artifact that satisfies the required artifact
security state.

At minimum:

- artifact exists;
- artifact belongs to the organization/project;
- artifact is not revoked;
- artifact is not expired;
- checksum is valid;
- signature is valid;
- platform is compatible;
- architecture is compatible;
- KritvaOS is compatible;
- SDK/runtime constraints are satisfied.

## 3.4 Booking Dependency

Execution requires a valid booking.

The booking must be:

- authorized;
- applicable to the selected platform;
- within its execution window;
- not cancelled;
- not expired;
- associated with an eligible resource.

## 3.5 Lab Dependency

The Lab Agent must provide:

- authenticated identity;
- connectivity;
- resource state;
- runtime state;
- execution capability;
- safety-state reporting.

## 3.6 Safety Dependency

Physical execution depends on:

- lab safety approval;
- robot readiness;
- local safety state;
- physical E-stop state;
- operator policy.

Cloud software cannot override local safety authority.

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M05 shall deliver:

1. Job creation workflow.
2. Job detail screen.
3. Job lifecycle display.
4. Run lifecycle display.
5. Execution control panel.
6. Start control.
7. Software stop control.
8. Cancel control where applicable.
9. Retry control where permitted.
10. Execution log viewer.
11. Live log streaming.
12. Connection status.
13. Lab Agent status.
14. Runtime status.
15. Software safety state.
16. Physical E-stop state presentation.
17. Safety-state warnings.
18. Execution error handling.
19. Reconnect/resynchronization.
20. Idempotent command handling.
21. Audit event integration.
22. Simulation-lab execution.
23. Execution E2E tests.
24. Safety presentation review.

## 4.2 Job Lifecycle

The baseline Job lifecycle is:

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

- FAILED;
- CANCELLED;
- TIMEOUT.

## 4.3 Run Lifecycle

A Run represents the actual execution instance.

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
       +----> STOPPING
       |          |
       |          v
       |       STOPPED
       |
       +----> FAILED
       |
       v
    COMPLETED

The exact final state vocabulary must remain aligned with the execution
contract.

## 4.4 Job Detail

The Job detail screen should display:

- Job ID;
- project;
- artifact;
- artifact version;
- booking;
- platform;
- configuration;
- resource;
- robot where permitted;
- creation time;
- scheduled time;
- current state;
- Run ID;
- Lab Agent state;
- runtime state;
- safety state;
- controls;
- logs;
- failure information.

## 4.5 Execution Control Panel

The control panel must expose only valid actions.

Example:

    Job: RUNNING

    [ Software Stop ]

    Safety:
      Runtime: RUNNING
      Software Stop: AVAILABLE
      Physical E-Stop: RELEASED
      Robot: READY

If the physical E-stop is active:

    Job: RUNNING

    [ Software Stop ]

    Safety:
      Runtime: UNKNOWN
      Physical E-Stop: ACTIVE
      Robot: SAFETY_STOP

The UI must not imply that pressing Software Stop releases or replaces the
physical E-stop.

## 4.6 Start

Start is permitted only when:

- Job is in a startable state;
- booking is valid;
- resource is allocated;
- artifact is valid;
- Lab Agent is connected;
- runtime is ready;
- safety policy allows execution.

Start must be idempotent.

## 4.7 Software Stop

Software Stop means:

> Request the Kritva Runtime/application to stop execution through the
> controlled software execution path.

The sequence is:

    User
      |
      v
    Software Stop Request
      |
      v
    Authorization
      |
      v
    Control Plane
      |
      v
    Lab Agent
      |
      v
    Kritva Runtime
      |
      v
    Application Stop
      |
      v
    Stop Acknowledgement
      |
      v
    Run STOPPED

If acknowledgement is unavailable, the UI must show that the stop request is
pending or unconfirmed.

## 4.8 Physical E-Stop

The physical emergency stop is a separate safety mechanism.

Conceptual flow:

    Physical E-Stop
          |
          v
    Safety Hardware
          |
          v
    Robot Safety Controller
          |
          +--> Motor/Actuator Inhibit
          |
          v
    Lab Agent / Safety Monitor
          |
          v
    RaaS UI Presentation

The cloud cannot create or release a physical E-stop.

The UI may display its state if the Lab Agent provides a trusted signal.

## 4.9 Safety State Model

The UI should distinguish at least:

| State | Meaning |
|---|---|
| UNKNOWN | Safety state unavailable/untrusted |
| SAFE | System reports safe state |
| READY | Robot is ready for controlled operation |
| RUNNING | Application is executing |
| SOFTWARE_STOPPING | Software stop requested |
| SOFTWARE_STOPPED | Software execution stopped |
| PHYSICAL_ESTOP_ACTIVE | Physical emergency stop active |
| FAULT | Safety/runtime fault |
| DISCONNECTED | Safety state unavailable due to connectivity |

The exact vocabulary must align with the Lab Protocol and runtime safety model.

## 4.10 Logs

Logs must support:

- timestamp;
- severity;
- source;
- component;
- Job ID;
- Run ID;
- sequence;
- message.

Sources may include:

- Control Plane;
- Lab Agent;
- Runtime;
- Application;
- Robot integration.

The UI should clearly distinguish sources.

## 4.11 Log Streaming

Live logs use WebSocket/event streaming.

The authoritative durable execution state remains in the Control Plane.

The WebSocket is not the source of truth.

On reconnect:

    Disconnect
       |
       v
    Reconnect
       |
       v
    Fetch Durable State
       |
       v
    Resume Event Stream
       |
       v
    Detect Sequence Gap
       |
       v
    Resynchronize

## 4.12 Execution Errors

Errors must distinguish:

- authorization failure;
- artifact failure;
- booking failure;
- resource unavailable;
- Lab Agent unavailable;
- runtime unavailable;
- safety fault;
- deployment failure;
- start failure;
- stop timeout;
- network timeout.

The UI must avoid generic "Execution failed" messages when a more precise
safe explanation is available.

---

# 9. Risks

## 9.1 R-FM05-001 — Software Stop Misinterpreted as E-Stop

**Risk:** User assumes software stop guarantees physical actuation shutdown.

**Impact:** Critical.

**Mitigation:**

- explicit terminology;
- separate controls;
- separate state indicators;
- safety review;
- UI acceptance tests;
- physical E-stop state displayed independently.

## 9.2 R-FM05-002 — Cloud Disconnect Creates Unsafe Assumption

**Risk:** Loss of cloud connectivity is interpreted as robot stopped.

**Impact:** Critical.

**Mitigation:**

- cloud disconnect never implies safe state;
- Lab Agent/runtime continue locally;
- safety state has independent source;
- UI displays unknown/stale state.

## 9.3 R-FM05-003 — Duplicate Start

**Risk:** Network retry starts application multiple times.

**Impact:** High.

**Mitigation:**

- idempotency keys;
- Job/Run state machine;
- server-side command deduplication.

## 9.4 R-FM05-004 — Duplicate Stop

**Risk:** Multiple stop commands produce inconsistent state.

**Impact:** Medium.

**Mitigation:**

- idempotent stop;
- explicit command state;
- runtime command deduplication.

## 9.5 R-FM05-005 — Stale Execution State

**Risk:** UI displays outdated Job/Run state.

**Impact:** High.

**Mitigation:**

- durable REST state;
- WebSocket events;
- sequence numbers;
- reconnect resync;
- event deduplication.

## 9.6 R-FM05-006 — Lab Agent Failure

**Risk:** Cloud loses communication with lab.

**Impact:** High.

**Mitigation:**

- Lab Agent local authority;
- heartbeat;
- explicit disconnected state;
- no unsafe automatic restart;
- local runtime continues according to safety policy.

## 9.7 R-FM05-007 — Runtime Crash

**Risk:** Application/runtime crashes during robot operation.

**Impact:** High.

**Mitigation:**

- runtime supervision;
- safety monitor;
- safe local fallback;
- fault reporting;
- no unsafe auto-restart.

## 9.8 R-FM05-008 — Unauthorized Execution

**Risk:** User executes another organization's artifact or booking.

**Impact:** Critical.

**Mitigation:**

- tenant isolation;
- authorization at every boundary;
- server-side ownership checks;
- audit;
- security tests.

## 9.9 R-FM05-009 — Artifact/Booking Mismatch

**Risk:** Artifact targets a different platform than booking.

**Impact:** High.

**Mitigation:**

- server compatibility validation;
- immutable artifact metadata;
- booking platform association;
- Lab Agent validation.

## 9.10 R-FM05-010 — Unsafe Automatic Recovery

**Risk:** System automatically restarts a robot application after fault.

**Impact:** Critical.

**Mitigation:**

- no unsafe auto-restart;
- local safety authority;
- explicit operator action;
- safety review.

## 9.11 R-FM05-011 — Log Leakage

**Risk:** Execution logs expose secrets or sensitive data.

**Impact:** High.

**Mitigation:**

- redaction;
- source privacy policy;
- log classification;
- access control.

## 9.12 R-FM05-012 — WebSocket Event Loss

**Risk:** State transitions are missed.

**Impact:** High.

**Mitigation:**

- durable state;
- sequence numbers;
- replay/resync;
- event IDs.

## 9.13 R-FM05-013 — Physical Safety Signal Staleness

**Risk:** UI displays an old E-stop state as current.

**Impact:** Critical.

**Mitigation:**

- timestamps;
- freshness thresholds;
- stale/unknown state;
- source identity;
- fail-safe presentation.

## 9.14 R-FM05-014 — Execution Scope Expansion

**Risk:** F-M05 becomes a robot-control or fleet-control project.

**Impact:** Medium.

**Mitigation:**

- explicit execution boundaries;
- no low-level actuator controls;
- physical safety remains local;
- separate future milestones.

---

# 10. Exit Criteria

## 10.1 Functional Exit

- [ ] Job creation works.
- [ ] Job lifecycle works.
- [ ] Run lifecycle works.
- [ ] Start works.
- [ ] Software Stop works.
- [ ] Cancellation works where supported.
- [ ] Retry works where supported.
- [ ] Logs stream.
- [ ] Logs remain associated with Job/Run.
- [ ] Lab Agent state is visible.
- [ ] Runtime state is visible.
- [ ] Safety state is visible.
- [ ] Physical E-stop is presented separately.
- [ ] Reconnect/resynchronization works.

## 10.2 Execution Exit

- [ ] Artifact compatibility is validated.
- [ ] Booking validity is validated.
- [ ] Resource allocation is validated.
- [ ] Lab Agent is authenticated.
- [ ] Runtime is authenticated.
- [ ] Start is idempotent.
- [ ] Stop is idempotent.
- [ ] Job/Run states are durable.
- [ ] Retry does not overwrite history.

## 10.3 Safety Exit

- [ ] Software Stop is explicitly distinct from E-stop.
- [ ] Physical E-stop state is independently sourced.
- [ ] UNKNOWN is not represented as SAFE.
- [ ] DISCONNECTED is not represented as SAFE.
- [ ] No unsafe automatic restart exists.
- [ ] Safety warnings are clear.
- [ ] Safety review is complete.
- [ ] Physical execution remains gated by human safety review where required.

## 10.4 Security Exit

- [ ] Execution authorization passes.
- [ ] Tenant isolation tests pass.
- [ ] Artifact authorization passes.
- [ ] Booking authorization passes.
- [ ] Command authorization passes.
- [ ] Logs are access-controlled.
- [ ] Audit events are generated.
- [ ] Security review passes.

## 10.5 Quality Exit

- [ ] Unit tests pass.
- [ ] State-machine tests pass.
- [ ] API contract tests pass.
- [ ] Lab Agent integration tests pass.
- [ ] Simulation tests pass.
- [ ] WebSocket tests pass.
- [ ] Idempotency tests pass.
- [ ] Software-stop tests pass.
- [ ] Safety-state tests pass.
- [ ] E2E execution test passes.
- [ ] Disconnect/reconnect tests pass.
- [ ] CI passes.

## 10.6 UI Exit

- [ ] Job detail reviewed.
- [ ] Run detail reviewed.
- [ ] Execution controls reviewed.
- [ ] Logs reviewed.
- [ ] Safety panel reviewed.
- [ ] Software Stop terminology reviewed.
- [ ] Physical E-stop presentation reviewed.
- [ ] Loading states reviewed.
- [ ] Error states reviewed.
- [ ] Disconnected states reviewed.
- [ ] Accessibility review passed.
- [ ] Dark/light themes passed.

## 10.7 Documentation Exit

- [ ] Job lifecycle documented.
- [ ] Run lifecycle documented.
- [ ] Execution commands documented.
- [ ] WebSocket events documented.
- [ ] Log model documented.
- [ ] Safety semantics documented.
- [ ] Software Stop semantics documented.
- [ ] E-stop presentation documented.
- [ ] Reconnect behavior documented.
- [ ] Test evidence recorded.
- [ ] Tracking documents updated.

## 10.8 Formal Milestone Status

F-M05 follows:

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

`COMPLETE` requires evidence, review, safety sign-off where applicable and
tracking updates.

---
