# PHASE-6-LAB-ROBOT — Review Checklist

Milestone: PHASE-6-LAB-ROBOT — Lab Agent, Kritva Runtime and Physical Robot Integration

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

### 7.1 Verification architecture

    Static Analysis
          |
          v
    Unit Tests
          |
          v
    Protocol Tests
          |
          v
    Simulation
          |
          v
    HIL
          |
          v
    Safety Fixture
          |
          v
    Controlled Physical Robot
          |
          v
    Human Safety Review

### 7.2 Lab Agent tests

Test:

- startup;
- provisioning;
- identity;
- authentication;
- registration;
- heartbeat;
- command validation;
- shutdown;
- restart;
- reconnect.

### 7.3 Protocol tests

Verify:

- schema;
- version;
- authentication;
- request IDs;
- correlation IDs;
- event sequence;
- error handling;
- idempotency;
- compatibility.

### 7.4 Runtime tests

Verify:

- Runtime discovery;
- version compatibility;
- application load;
- start;
- stop;
- fault;
- restart policy;
- resource cleanup.

### 7.5 Robot adapter tests

Test each hardware interface independently:

- sensor;
- actuator;
- encoder;
- motor controller;
- power;
- status;
- fault.

No physical motion shall be required for unit-level hardware adapter tests.

### 7.6 Safety fixture tests

Before robot motion:

- E-stop;
- interlock;
- safe power;
- fault injection;
- communication loss;
- runtime crash;
- Lab Agent crash;
- Control Plane disconnect.

### 7.7 E-stop test

Procedure:

    Robot READY
       |
       v
    Application RUNNING
       |
       v
    Local E-STOP
       |
       v
    Motion Inhibited
       |
       v
    Lab Agent Reports ESTOP_ACTIVE
       |
       v
    Control Plane Records Event

Expected:

- motion inhibited;
- event recorded;
- no remote reset;
- no automatic restart.

### 7.8 Software stop test

Procedure:

    Application RUNNING
       |
       v
    Remote STOP
       |
       v
    Lab Agent
       |
       v
    Runtime
       |
       v
    Controlled Stop

Expected:

- application terminates;
- robot enters configured safe operational state;
- Run transitions correctly.

### 7.9 Disconnect test

Disconnect cloud connectivity while robot is running.

Expected behavior must be predetermined by policy.

At minimum:

- safety remains local;
- no uncontrolled restart;
- local runtime continues or stops according to approved policy;
- state is reconciled after reconnect.

### 7.10 Lab Agent crash test

Terminate Lab Agent process.

Expected:

- safety system remains independent;
- Runtime behavior follows local policy;
- cloud cannot assume robot state;
- restart/recovery follows approved procedure.

### 7.11 Runtime crash test

Terminate Kritva Runtime.

Expected:

- robot reaches configured safe state;
- fault reported;
- no automatic unsafe restart;
- Run marked appropriately.

### 7.12 Network fault test

Test:

- high latency;
- packet loss;
- connection loss;
- reconnection;
- partial connectivity.

Expected:

- local control remains stable;
- cloud observation may become stale;
- stale data is marked stale;
- safety does not depend on cloud connectivity.

### 7.13 Telemetry verification

Verify:

- timestamp accuracy;
- sequence;
- loss detection;
- buffering;
- reconnect;
- ordering;
- normalization.

### 7.14 Security tests

Verify:

- certificate validation;
- identity revocation;
- artifact signature;
- tenant authorization;
- command authorization;
- replay resistance;
- credential protection;
- log redaction.

### 7.15 Physical safety tests

All physical tests require approved procedure.

Test progression:

    No Motion
       |
       v
    Powered Hardware
       |
       v
    Actuator Disabled
       |
       v
    Low-Risk Motion
       |
       v
    Controlled Application
       |
       v
    Limited Physical Run

Each stage requires explicit approval before proceeding.

### 7.16 Performance tests

Initial targets:

| Operation | Target |
|---|---:|
| Lab heartbeat processing | p95 < 500 ms |
| Lab status query | p95 < 500 ms |
| Command acknowledgement | p95 < 500 ms excluding robot action |
| Telemetry delivery | application-specific |
| Artifact validation | p95 < 2 s excluding transfer |
| Result metadata publication | p95 < 1 s |

Real-time robot control latency is not governed by cloud API targets.

### 7.17 Safety verification evidence

Required evidence:

- safety architecture;
- hazard analysis;
- E-stop test;
- interlock test;
- safe-start test;
- safe-stop test;
- disconnect test;
- runtime crash test;
- Lab Agent crash test;
- operator procedure;
- physical execution log.

### 7.18 Evidence retention

Physical execution evidence shall be retained according to the production safety and audit policy.

Evidence must include:

- Job ID;
- Run ID;
- artifact digest;
- robot ID;
- resource ID;
- operator;
- safety state;
- execution timestamps;
- faults;
- stop events;
- result digest.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate a controlled physical robot execution through:

    Studio
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
    Physical Robot

with safety authority remaining local.

### 8.2 Step 1 — Verify lab

Display:

    Lab = ACTIVE
    Lab Agent = CONNECTED
    Robot = ACTIVE
    Resource = AVAILABLE
    Safety = SAFE

If any condition is not satisfied, do not proceed.

### 8.3 Step 2 — Verify identity

Show:

- Lab Agent identity;
- certificate state;
- connection status;
- heartbeat.

Expected:

    Authenticated = YES
    Heartbeat = HEALTHY

### 8.4 Step 3 — Verify robot

Show:

- robot identity;
- platform;
- runtime;
- firmware;
- resource;
- safety controller;
- state.

### 8.5 Step 4 — Select artifact

Select approved `.krv`.

Expected:

    Signature = VALID
    Checksum = VALID
    Platform = COMPATIBLE
    Runtime = COMPATIBLE
    Policy = ALLOWED

### 8.6 Step 5 — Verify booking

Expected:

    Booking = CONFIRMED
    Allocation = CONFIRMED

### 8.7 Step 6 — Local safety preflight

Lab Agent checks:

- robot operational;
- E-stop released;
- interlocks satisfied;
- safety controller healthy;
- runtime healthy;
- operator approval;
- execution policy.

Expected:

    PRECHECK = PASS

### 8.8 Step 7 — Operator approval

Authorized local operator approves physical execution.

Expected:

    APPROVAL = RECORDED

### 8.9 Step 8 — Start execution

Studio requests:

    START

Control Plane sends command.

Lab Agent validates.

Runtime starts.

Expected:

    Job = RUNNING
    Run = RUNNING
    Robot = EXECUTING

### 8.10 Step 9 — Observe telemetry

Display:

- robot state;
- safety state;
- runtime state;
- selected telemetry;
- logs;
- elapsed time.

### 8.11 Step 10 — Verify source privacy

Show that the Lab Agent received:

    .krv artifact

and not:

    source repository
    source files
    compiler inputs
    developer workspace

### 8.12 Step 11 — Controlled completion

Allow test application to complete.

Expected:

    Application = COMPLETE
    Run = COMPLETED
    Resource = AVAILABLE

### 8.13 Step 12 — Result collection

Verify:

- result metadata;
- artifact digest;
- robot identity;
- Run ID;
- telemetry summary;
- logs.

### 8.14 Step 13 — Software Stop demonstration

Start another approved low-risk application.

Issue:

    STOP EXECUTION

Expected:

    RUNNING
       |
       v
    STOPPING
       |
       v
    STOPPED

### 8.15 Step 14 — E-stop demonstration

Only under approved safety procedure.

Trigger local E-stop.

Expected:

    ESTOP_ACTIVE
    Motion = INHIBITED
    Run = FAULT/STOPPED
    Audit Event = RECORDED

Do not remotely reset.

### 8.16 Step 15 — Recovery

After approved local reset procedure:

- verify safety;
- verify robot state;
- verify Lab Agent;
- verify Runtime;
- do not automatically restart previous Run.

### 8.17 Step 16 — Disconnect demonstration

Disconnect Control Plane network.

Expected:

- local safety remains active;
- robot behavior follows local policy;
- Studio shows disconnected/stale state;
- no unsafe restart occurs.

Reconnect.

Expected:

- Lab Agent authenticates;
- state is reconciled;
- historical Run remains intact.

### 8.18 Demo completion

The P6 LAB & ROBOT demo passes when:

> A real robot can execute an approved artifact through the complete RaaS path while local safety authority remains independent of cloud availability and cloud commands cannot bypass physical safety controls.

---
