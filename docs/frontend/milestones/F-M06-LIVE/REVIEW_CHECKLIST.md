# F-M06-LIVE — Review Checklist

Milestone: F-M06 — Live Execution

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
    Transport
      |
      v
    WebRTC Integration
      |
      v
    Telemetry Integration
      |
      v
    Realtime Event Tests
      |
      v
    Fault Injection
      |
      v
    Live E2E
      |
      v
    Performance Qualification

## 7.2 WebRTC Tests

Test:

- successful negotiation;
- failed negotiation;
- ICE failure;
- STUN unavailable;
- TURN fallback;
- camera unavailable;
- camera disconnect;
- media track restart;
- packet loss;
- bandwidth reduction;
- reconnect;
- session expiration.

## 7.3 Telemetry Tests

Test:

- normal telemetry;
- high-rate telemetry;
- missing samples;
- duplicate samples;
- out-of-order samples;
- sequence gap;
- stale sample;
- reconnect;
- subscription failure.

## 7.4 Log Tests

Test:

- normal logs;
- high-volume logs;
- duplicate logs;
- missing logs;
- sequence gaps;
- reconnect;
- filtering;
- redaction.

## 7.5 Event Tests

Test:

- duplicate event;
- out-of-order event;
- missing event;
- sequence gap;
- replay;
- resynchronization;
- stale event.

## 7.6 Reconnect Tests

Simulate:

    WebSocket Down
    WebRTC Down
    Telemetry Down
    Lab Agent Down
    Control Plane Timeout

Expected:

- affected channel becomes degraded;
- unrelated channels remain correctly represented;
- durable state remains authoritative;
- reconnect occurs according to policy;
- no execution restart occurs.

## 7.7 Safety Freshness Tests

Test:

    Safety = READY
    Last Update = Recent

Expected:

    READY / CURRENT

Then stop safety updates.

Expected:

    UNKNOWN or STALE

The system must not continue showing the old state as current indefinitely.

## 7.8 Tenant Isolation Tests

Verify that one organization cannot:

- access another Run's video;
- subscribe to another Run's telemetry;
- retrieve another Run's logs;
- observe another organization's robot state;
- create a live session for another organization's Job.

## 7.9 Resource Cleanup Tests

Open and close many live sessions.

Verify:

- WebRTC peer connections close;
- WebSocket subscriptions close;
- timers stop;
- telemetry subscriptions close;
- memory does not continuously grow;
- server session records expire/close.

## 7.10 Simulation Environment

The P0 live test environment should include:

    Simulated Lab
       |
       +--> Simulated Robot
       +--> Simulated Camera
       +--> Simulated Runtime
       +--> Simulated Telemetry
       +--> Simulated Logs
       +--> Simulated Safety
       +--> Fault Injection

The simulator must provide deterministic test signals.

## 7.11 E2E Live Test

Primary scenario:

    Login
      |
      v
    Active Run
      |
      v
    Open Live
      |
      +--> WebRTC Video
      +--> Telemetry
      +--> Logs
      +--> Events
      +--> Lab Status
      +--> Robot Status
      +--> Safety
      |
      v
    Disconnect
      |
      v
    Reconnect
      |
      v
    Resync
      |
      v
    Continue Observation

## 7.12 Performance Qualification

Measure:

- video startup time;
- video reconnect time;
- telemetry latency;
- event latency;
- log latency;
- CPU usage;
- memory usage;
- WebSocket message rate;
- telemetry message rate;
- number of concurrent live sessions.

Initial targets:

| Metric | Initial Target |
|---|---:|
| Video startup | p95 <= 5 s |
| Video reconnect | p95 <= 10 s |
| Telemetry display latency | p95 <= 2 s |
| Event display latency | p95 <= 2 s |
| Log display latency | p95 <= 2 s |
| UI recovery after WebSocket reconnect | p95 <= 5 s |
| Memory growth during 30-min session | bounded |
| Session cleanup | 100% |

Targets must be validated and refined using measured results.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate a complete live execution session using a simulated robot with
video, telemetry, logs, events, lab status and reconnect handling.

## 8.2 Preparation

- [ ] Authenticated user.
- [ ] Active Run exists.
- [ ] Simulation Lab is operational.
- [ ] Simulated camera is available.
- [ ] Telemetry generator is active.
- [ ] Runtime is active.
- [ ] WebSocket is available.
- [ ] WebRTC signaling is available.

## 8.3 Step 1 — Open Run

Open an active Run from F-M05.

Expected:

- Run status is RUNNING;
- Live action is available.

## 8.4 Step 2 — Open Live View

Open Live.

Expected:

- live session is authorized;
- connection indicators appear;
- video begins connecting.

## 8.5 Step 3 — Establish Video

Expected:

    Video: CONNECTED

Live camera view appears.

## 8.6 Step 4 — Inspect Telemetry

Expected values appear:

    Robot State: RUNNING
    Battery: 82.5%
    CPU: 34%
    Joint Temperature: 41.2 C

Values update continuously.

## 8.7 Step 5 — Inspect Logs

Expected:

    10:21:01 INFO runtime Application started
    10:21:02 INFO robot   Target accepted
    10:21:03 INFO runtime Control loop active

Logs arrive without page refresh.

## 8.8 Step 6 — Inspect Lab Status

Expected:

    Lab Agent: CONNECTED
    Runtime: CONNECTED
    Robot: RUNNING
    Safety: READY / CURRENT

## 8.9 Step 7 — Simulate Network Loss

Disable the WebSocket connection.

Expected:

- connection becomes DEGRADED;
- logs stop updating temporarily;
- Run is not shown as stopped;
- video may remain active.

## 8.10 Step 8 — Reconnect

Restore WebSocket.

Expected:

- connection restores;
- durable Run state is fetched;
- missed events are reconciled;
- logs resume;
- telemetry resumes;
- no duplicate data corruption occurs.

## 8.11 Step 9 — Simulate Video Failure

Drop WebRTC.

Expected:

    Video: RECONNECTING

The Run remains:

    RUNNING

Telemetry and logs remain independently represented.

## 8.12 Step 10 — Recover Video

Restore media connectivity.

Expected:

    Video: CONNECTED

The Run is unchanged.

## 8.13 Step 11 — Simulate Stale Safety

Stop safety updates.

Expected:

    Safety: UNKNOWN / STALE

The UI does not continue displaying the previous state as current.

## 8.14 Step 12 — Resume Safety

Restore safety updates.

Expected:

    Safety: READY / CURRENT

## 8.15 Demo Success Criteria

The demo passes when:

- video works;
- telemetry works;
- logs work;
- events work;
- lab status works;
- robot status works;
- safety freshness works;
- WebSocket reconnect works;
- WebRTC reconnect works;
- telemetry resync works;
- independent channels remain correctly represented.

---
