# F-M05-EXECUTION — Review Checklist

Milestone: F-M05 — Execution

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7. Test and Verification Plan

## 7.1 Test Pyramid

    Unit
      |
      v
    State Machine
      |
      v
    API Contract
      |
      v
    Lab Agent Integration
      |
      v
    Simulation
      |
      v
    E2E Execution
      |
      v
    Safety Qualification

## 7.2 Job State Tests

Test every legal transition.

Test illegal transitions such as:

    COMPLETED -> RUNNING
    FAILED -> RUNNING
    CANCELLED -> RUNNING

Expected result:

- transition rejected;
- state unchanged;
- audit/error recorded where appropriate.

## 7.3 Run State Tests

Verify:

- Run created only through valid Job workflow;
- RUNNING requires successful start;
- STOPPED requires confirmed stop;
- FAILED requires execution failure;
- COMPLETED requires normal completion.

## 7.4 Start Tests

Test:

- valid start;
- invalid artifact;
- expired booking;
- cancelled booking;
- unavailable resource;
- Lab Agent disconnected;
- runtime unavailable;
- unsafe state;
- duplicate start;
- concurrent start.

## 7.5 Software Stop Tests

Test:

1. running Run;
2. issue software stop;
3. command accepted;
4. runtime receives command;
5. runtime stops application;
6. Run becomes STOPPED.

Also test:

- duplicate stop;
- stop timeout;
- runtime disconnect;
- runtime rejects stop;
- already stopped Run.

## 7.6 E-Stop Presentation Tests

Simulate:

    PHYSICAL_ESTOP_ACTIVE

Expected:

- prominent warning;
- physical E-stop state displayed;
- software execution state shown independently;
- no fake release control;
- no claim that software stop released E-stop.

Simulate:

    UNKNOWN

Expected:

- UNKNOWN displayed;
- system does not claim SAFE.

Simulate:

    DISCONNECTED

Expected:

- safety information marked stale/unavailable.

## 7.7 Safety Fault Tests

Simulate:

    RUNNING
       |
       v
    SAFETY FAULT

Expected:

- execution UI reflects fault;
- safety warning appears;
- software controls follow safety policy;
- no unsafe automatic restart;
- event is auditable.

## 7.8 WebSocket Tests

Test:

- normal connection;
- disconnect;
- reconnect;
- duplicate event;
- out-of-order event;
- sequence gap;
- stale event;
- event replay.

Expected:

- UI eventually converges on durable server state.

## 7.9 Log Tests

Test:

- high-volume logs;
- malformed log;
- duplicate logs;
- sequence gap;
- reconnect;
- filtering;
- sensitive-data redaction.

## 7.10 Tenant Isolation Tests

Test that users cannot:

- view another organization's Job;
- view another organization's Run;
- issue stop against another organization's Run;
- retrieve another organization's logs;
- infer another organization's execution state.

## 7.11 Idempotency Tests

Repeat:

    createJob()
    startJob()
    stopRun()
    cancelJob()

Expected:

- no duplicate durable operation;
- same logical operation returns consistent result.

## 7.12 Simulation Test

The first complete execution qualification should use a simulated resource.

Flow:

    Studio
      |
      v
    Control Plane
      |
      v
    Lab Agent
      |
      v
    Simulated Runtime
      |
      v
    Mock Robot
      |
      v
    Logs / Safety State

The simulation must support injected failures.

## 7.13 Fault Injection

Inject:

- artifact failure;
- resource failure;
- Lab Agent disconnect;
- runtime crash;
- network loss;
- stop timeout;
- safety fault;
- physical E-stop state;
- event loss;
- duplicate event.

Expected system behavior must be deterministic and safe.

## 7.14 E2E Qualification

Primary test:

    Login
      |
      v
    Artifact
      |
      v
    Booking
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
      +--> Safety
      |
      v
    Software Stop
      |
      v
    Stopped
      |
      v
    Result-ready state

## 7.15 Regression

F-M01 through F-M04 regression must pass:

- login;
- project;
- local workspace;
- artifact;
- platform catalog;
- availability;
- booking;
- credit wallet;
- booking state;
- cancellation.

## 7.16 Evidence

Required evidence:

- state transition tests;
- command idempotency tests;
- Lab Agent integration results;
- simulation run;
- software-stop test;
- E-stop presentation test;
- disconnect/reconnect test;
- tenant isolation test;
- security review;
- safety review;
- UI review;
- E2E run.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate a complete remote execution workflow using a simulated robot while
showing clear separation between application execution controls and physical
robot safety.

## 8.2 Preparation

- [ ] Authenticated user.
- [ ] Project exists.
- [ ] Valid signed `.krv` artifact exists.
- [ ] Confirmed booking exists.
- [ ] Simulated resource is available.
- [ ] Lab Agent is connected.
- [ ] Runtime is ready.
- [ ] Safety state is SAFE/READY.
- [ ] WebSocket is operational.

## 8.3 Step 1 — Select Artifact

Open the project and select the signed artifact.

Expected:

- artifact status VALID/APPROVED;
- platform compatibility shown;
- checksum/signature status shown.

## 8.4 Step 2 — Select Booking

Select the confirmed booking.

Expected:

- booking status CONFIRMED;
- platform/configuration match;
- resource allocation shown.

## 8.5 Step 3 — Create Job

Select "Create Job".

Expected:

    CREATED

A Job ID appears.

No execution has started.

## 8.6 Step 4 — Observe Validation

Expected:

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

The UI should show progress without falsely claiming runtime execution.

## 8.7 Step 5 — Deploy

Expected:

    ALLOCATING
       |
       v
    DEPLOYING

Artifact deployment occurs through the Lab Agent.

## 8.8 Step 6 — Start

Press Start.

Expected:

    STARTING
       |
       v
    RUNNING

Run ID appears.

## 8.9 Step 7 — View Logs

Open live logs.

Expected:

- runtime logs appear;
- timestamps are visible;
- source is visible;
- logs stream without page refresh.

## 8.10 Step 8 — View Safety

Expected:

    Runtime: RUNNING
    Robot: READY/RUNNING
    Software Stop: AVAILABLE
    Physical E-Stop: RELEASED

The UI clearly labels the physical E-stop separately.

## 8.11 Step 9 — Software Stop

Press Software Stop.

Expected:

    RUNNING
       |
       v
    STOPPING
       |
       v
    STOPPED

The UI must never label this action "Emergency Stop".

## 8.12 Step 10 — Physical E-Stop Simulation

Inject physical E-stop state through the simulated Lab Agent or test harness.
No physical robot, physical Lab Agent, or E-stop hardware is used in
P5 EXECUTION; physical E-stop qualification belongs to P6 LAB & ROBOT.

Expected:

    Physical E-Stop: ACTIVE

The UI displays a prominent safety warning.

The software stop status remains separate.

The UI does not present a release/reset operation.

## 8.13 Step 11 — Disconnect

Disconnect the WebSocket.

Expected:

- connection warning;
- execution state is not automatically changed to STOPPED;
- reconnect occurs;
- durable Job/Run state is retrieved.

## 8.14 Step 12 — Reconnect

Reconnect.

Expected:

- current Job state restored;
- Run state restored;
- log stream resynchronized;
- event sequence gap handled if present.

## 8.15 Step 13 — Failure Demonstration

Inject runtime failure.

Expected:

    RUNNING
       |
       v
    FAILED

Failure reason is shown.

No automatic unsafe restart occurs.

## 8.16 Demo Success Criteria

The demo passes when:

- Job is created;
- lifecycle is visible;
- Run is created;
- logs stream;
- software stop works;
- safety state is visible;
- physical E-stop is clearly distinct;
- disconnect/reconnect works;
- failure is correctly represented.

---
