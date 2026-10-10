# B-M03-PLATFORM — Review Checklist

Milestone: B-M03 — Platform

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

## 7.1 Verification Pyramid

    Unit Tests
       |
       v
    Repository Tests
       |
       v
    Compatibility Tests
       |
       v
    API Contract Tests
       |
       v
    WebSocket Contract Tests
       |
       v
    Security Tests
       |
       v
    Integration Tests
       |
       v
    End-to-End Tests
       |
       v
    Load / Fault Tests

## 7.2 Platform Tests

Verify:

- create;
- update;
- lifecycle;
- version;
- architecture;
- capabilities;
- configurations;
- filtering;
- authorization.

## 7.3 Lab Tests

Verify:

- creation;
- lifecycle;
- status;
- ownership;
- maintenance;
- availability.

## 7.4 Robot Tests

Verify:

- stable identity;
- Platform relationship;
- Lab relationship;
- lifecycle;
- fault state;
- maintenance state.

## 7.5 Resource Tests

Verify:

- resource creation;
- type;
- platform;
- robot relationship;
- state;
- maintenance;
- availability;
- authorization.

## 7.6 Compatibility Test Matrix

| Condition | Expected |
|---|---|
| Matching platform | COMPATIBLE |
| Wrong platform | INCOMPATIBLE |
| Matching version | COMPATIBLE |
| Unsupported version | INCOMPATIBLE |
| Matching architecture | COMPATIBLE |
| Wrong architecture | INCOMPATIBLE |
| Required capability missing | INCOMPATIBLE |
| Optional capability missing | Policy-dependent |
| Unknown target | UNKNOWN |
| Configuration mismatch | INCOMPATIBLE |
| Retired platform | REQUIRES_REVIEW/INCOMPATIBLE |

## 7.7 WebSocket Connection Tests

Test:

- valid authentication;
- invalid authentication;
- expired authentication;
- authorization failure;
- successful connection;
- heartbeat;
- idle timeout;
- graceful close;
- server restart;
- client disconnect.

## 7.8 Subscription Tests

Test:

- valid resource subscription;
- valid project subscription;
- invalid tenant subscription;
- unauthorized resource;
- duplicate subscription;
- unsubscribe;
- connection close cleanup.

## 7.9 Event Tests

Verify:

- event ID;
- sequence;
- timestamp;
- resource identity;
- correlation;
- event ordering;
- duplicate handling;
- gap detection.

## 7.10 Reconnect Tests

Scenario:

    Connected
       |
       v
    Receive Events
       |
       v
    Network Failure
       |
       v
    Disconnected
       |
       v
    Reconnect
       |
       v
    Authenticate
       |
       v
    Resubscribe
       |
       v
    Fetch Snapshot
       |
       v
    Resume Events

Verify no duplicate business action is triggered.

## 7.11 Backpressure Tests

Inject high-rate events.

Verify:

- bounded memory;
- bounded queues;
- controlled disconnect;
- event recovery;
- no server-wide resource exhaustion.

## 7.12 Tenant Isolation Tests

Create:

    Organization A
      |
      +--> Lab A
            |
            +--> Robot A
                  |
                  +--> Resource A

    Organization B
      |
      +--> Lab B
            |
            +--> Robot B
                  |
                  +--> Resource B

Verify:

- A cannot subscribe to B;
- A cannot query B;
- A cannot administer B;
- B cannot subscribe to A.

## 7.13 Fault Injection

Test:

- database unavailable;
- WebSocket server restart;
- network interruption;
- event burst;
- stale resource state;
- resource fault;
- Lab offline;
- maintenance activation.

Expected behavior must preserve durable state and fail safely.

## 7.14 E2E Platform Test

Primary path:

    Platform
       |
       v
    Platform Version
       |
       v
    Capability
       |
       v
    Lab
       |
       v
    Robot
       |
       v
    Resource
       |
       v
    Compatibility Check

## 7.15 E2E WebSocket Test

Primary path:

    Authenticate
       |
       v
    Connect WebSocket
       |
       v
    Subscribe Resource
       |
       v
    Receive Status Event
       |
       v
    Detect Disconnect
       |
       v
    Reconnect
       |
       v
    Snapshot
       |
       v
    Resume Events

## 7.16 Performance Baseline

Initial targets:

| Operation | Target |
|---|---:|
| Platform catalog p95 | <500 ms |
| Resource list p95 | <500 ms |
| Compatibility evaluation p95 | <500 ms |
| WebSocket connect p95 | <1 s |
| Subscription acknowledgement p95 | <500 ms |
| Event delivery p95 | <2 s |
| Reconnect/resync p95 | <5 s |
| Heartbeat processing | <100 ms |

Targets must be measured under representative load.

## 7.17 Coding-Agent Provider Metadata Tests

Verify:

- read and detail responses against the contract;
- operator-only writes with audit;
- platform and compatibility separation (negative tests).

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate the complete platform/resource model and prove the WebSocket
infrastructure can deliver authorized live resource status with recovery.

## 8.2 Preparation

- [ ] Platform exists.
- [ ] Platform Version exists.
- [ ] Architecture exists.
- [ ] Capabilities exist.
- [ ] Lab exists.
- [ ] Robot exists.
- [ ] Resource exists.
- [ ] Test user exists.

## 8.3 Step 1 — Platform Catalog

Open platform catalog.

Expected:

    Kritva Reference Robot
    Version 1.0
    Architecture arm64
    Runtime KritvaOS 1.0
    SDK 1.0

## 8.4 Step 2 — Capabilities

Open capabilities.

Expected:

    vision       SUPPORTED
    camera       SUPPORTED
    motion       SUPPORTED
    navigation   OPTIONAL

## 8.5 Step 3 — Lab

Open Lab.

Expected:

    Lab: Bangalore Robotics Lab
    Status: ACTIVE

## 8.6 Step 4 — Robot

Open robot.

Expected:

    Robot: RB-001
    Platform: Kritva Reference Robot
    Status: ACTIVE

## 8.7 Step 5 — Resource

Open resource.

Expected:

    Resource: RES-001
    Type: ROBOT
    State: AVAILABLE
    Robot: RB-001

## 8.8 Step 6 — Compatibility

Submit an artifact/platform compatibility request.

Expected:

    Platform: Compatible
    Architecture: Compatible
    SDK: Compatible
    Capabilities: Compatible

Result:

    COMPATIBLE

## 8.9 Step 7 — WebSocket

Connect Studio to WebSocket.

Expected:

    CONNECTED

Subscribe to resource:

    RES-001

Expected:

    SUBSCRIBED

## 8.10 Step 8 — Status Event

Change simulated resource state:

    AVAILABLE -> BUSY

Expected event:

    resource.status_changed

Studio receives:

    AVAILABLE -> BUSY

## 8.11 Step 9 — Disconnect

Simulate network interruption.

Expected:

    WebSocket = DISCONNECTED

The resource must not be shown as physically stopped merely because the
WebSocket disconnected.

## 8.12 Step 10 — Reconnect

Reconnect.

Expected:

    AUTHENTICATE
    RESUBSCRIBE
    SNAPSHOT
    RESUME EVENTS

## 8.13 Step 11 — Fault

Simulate:

    Resource = FAULT

Expected:

- durable resource state changes;
- WebSocket event is delivered;
- UI reflects FAULT;
- event can be recovered after reconnect.

## 8.14 Demo Success Criteria

The demo passes when:

- catalog works;
- capabilities work;
- lab works;
- robot works;
- resource works;
- compatibility works;
- WebSocket authentication works;
- subscription works;
- event delivery works;
- reconnect works;
- durable state remains authoritative.

---
