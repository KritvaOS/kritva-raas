# F-M06 — Live Execution

## Milestone Dossier

**Milestone ID:** F-M06-LIVE  
**Product:** Kritva RaaS  
**Primary Phase:** P7 LIVE & RESULTS  
**Primary Surface:** RaaS Studio + Control Plane + Lab  
**Technology:** Tauri + Rust + React + TypeScript + WebRTC + WebSocket  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** A production-grade live execution experience providing
low-latency robot video, realtime telemetry, execution logs/events, lab and
robot status, and robust reconnect/resynchronization behavior.

---

# 1. Objective

## 1.1 Milestone Objective

F-M06 establishes the live observation layer for Kritva RaaS.

F-M05 establishes remote execution control. F-M06 makes that execution
observable in real time.

The primary workflow is:

    Confirmed Booking
          |
          v
       Job / Run
          |
          +--------------------+
          |                    |
          v                    v
       Video              Telemetry
          |                    |
          +---------+----------+
                    |
                    v
              Live Execution UI
                    |
          +---------+---------+
          |                   |
          v                   v
       Logs              Robot/Lab Status
          |
          v
      Reconnect / Resync

The live experience must allow a user to understand what is happening on the
remote resource without requiring the user to be physically present at the
lab.

## 1.2 Product Intent

The live execution screen should answer:

1. Is the Job currently running?
2. Is the Run currently running?
3. Is the robot/lab connected?
4. Is live video available?
5. What is the robot doing?
6. What is the latest telemetry?
7. Are logs/events arriving?
8. Is the resource healthy?
9. Is the safety state current?
10. What happened if the connection is interrupted?
11. Has the UI recovered the authoritative state after reconnect?

The live experience is an observation and operational-awareness layer.

It is not a replacement for local robot safety controls.

## 1.3 Primary Success Definition

F-M06 is successful when an authorized user can:

1. open an active Run;
2. establish a live video session;
3. view the remote robot/lab camera;
4. receive realtime telemetry;
5. receive realtime execution logs/events;
6. view Lab Agent status;
7. view robot/resource status;
8. view safety state freshness;
9. detect connectivity degradation;
10. recover from WebSocket interruption;
11. recover from WebRTC interruption;
12. resynchronize telemetry and execution state;
13. continue observing after reconnect;
14. distinguish stale data from current data;
15. stop relying on live streams as authoritative business state.

## 1.4 Architectural Objective

The architecture is:

    RaaS Studio
       |
       +---------------- HTTPS ----------------+
       |                                       |
       +---------------- WebSocket ------------> Control Plane
       |                                       |
       +---------------- WebRTC ----------------+
                                               |
                                               v
                                          Lab Gateway
                                               |
                                               v
                                           Lab Agent
                                               |
                         +---------------------+--------------------+
                         |                     |                    |
                         v                     v                    v
                      Camera              Telemetry             Runtime
                         |                     |                    |
                         +----------+----------+--------------------+
                                    |
                                    v
                              Robot / Simulator

The Control Plane remains authoritative for durable business state.

WebRTC is optimized for realtime media.

WebSocket/event transport is optimized for realtime application events,
telemetry and logs.

Neither replaces PostgreSQL or other authoritative persistence.

## 1.5 Transport Separation

F-M06 intentionally separates transport responsibilities.

| Data | Primary Transport | Authoritative Source |
|---|---|---|
| Job/Run state | REST + WebSocket events | Control Plane |
| Video | WebRTC | Lab camera/media service |
| Telemetry | WebSocket/specialized realtime transport | Lab/Runtime |
| Logs | WebSocket + durable retrieval | Control Plane/Lab |
| Safety state | WebSocket + durable snapshot | Safety/Runtime/Lab |
| Lab status | WebSocket + REST snapshot | Lab Agent |
| Robot status | WebSocket + REST snapshot | Lab Agent/Robot |
| Historical state | REST | Control Plane |

This separation prevents a failure in one realtime channel from being
interpreted as failure of the execution itself.

## 1.6 Live Experience Principle

> Live data is for observation; durable state is for truth.

A disconnected video stream does not mean the Run stopped.

A disconnected telemetry stream does not mean the robot stopped.

A disconnected WebSocket does not mean the robot is safe.

A stale safety signal must be represented as stale or unknown.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M06 includes:

- Live Run screen;
- WebRTC video;
- camera discovery;
- camera selection where permitted;
- video connection state;
- video quality indicators;
- telemetry subscription;
- telemetry display;
- realtime logs;
- realtime execution events;
- Lab Agent status;
- robot/resource status;
- runtime status;
- safety-state freshness;
- realtime connection status;
- WebSocket reconnect;
- WebRTC reconnect;
- telemetry resynchronization;
- log resynchronization;
- event sequence handling;
- stale-data indication;
- stream lifecycle;
- stream authorization;
- stream session management;
- resource cleanup;
- simulation-lab live mode;
- fault injection;
- live-session tests.

## 2.2 Explicitly Out of Scope

F-M06 does not implement:

- physical camera hardware;
- robot camera firmware;
- video analytics;
- computer vision;
- object detection;
- autonomous control;
- motor control;
- physical E-stop implementation;
- robot safety-controller implementation;
- advanced telemetry analytics;
- long-term data science;
- experiment comparison;
- result analysis;
- billing;
- credit calculation;
- artifact creation;
- booking creation;
- Job creation.

F-M06 consumes the corresponding contracts from previous milestones.

## 2.3 Video Scope

The P0 video implementation uses WebRTC.

The Studio should receive a controlled live media stream from the lab environment.

The architecture should avoid routing high-bandwidth raw video through the normal
Control Plane application servers where direct or mediated WebRTC can be used.

## 2.4 Telemetry Scope

Telemetry includes operational signals required to understand the current Run.

Examples may include:

- robot state;
- joint positions;
- joint velocities;
- joint temperatures;
- battery state;
- CPU utilization;
- memory utilization;
- network health;
- runtime state;
- application state.

The exact signal set is platform-specific.

## 2.5 Realtime Logs Scope

Realtime logs include:

- runtime logs;
- application logs;
- Lab Agent logs where authorized;
- execution events;
- warnings;
- errors.

Logs must be associated with Job and Run identity.

## 2.6 Lab and Robot Status

The live screen should show:

- Lab Agent connectivity;
- resource state;
- robot state;
- runtime state;
- safety state;
- last update;
- data freshness.

Status presentation must distinguish:

    RUNNING
    CONNECTED
    HEALTHY
    SAFE

These are different concepts and must not be collapsed into one indicator.

---

# 3. Dependencies

## 3.1 Milestone Dependencies

F-M06 depends on:

- F-M01 Studio Foundation;
- F-M02 Projects;
- F-M03 Build & Artifact;
- F-M04 Booking;
- F-M05 Execution;
- authentication;
- authorization;
- Job/Run lifecycle;
- Lab Protocol;
- Lab Agent;
- Kritva Runtime;
- event infrastructure;
- audit infrastructure.

## 3.2 Documentation Dependencies

| Document | Relationship |
|---|---|
| `docs/frontend/milestones/F-M05-EXECUTION/MILESTONE.md` | Execution |
| `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Durable state |
| `docs/security/AUTHENTICATION.md` | Identity |
| `docs/security/AUTHORIZATION.md` | Access control |
| `docs/security/AUDIT_LOGGING.md` | Audit |
| `docs/security/TENANT_ISOLATION.md` | Tenant isolation |
| `planning/INTEGRATION_PLAN.md` | Realtime integration |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | UI acceptance |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | UI review |
| `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` | Network/cloud design |
| `docs/protocol/PROTOCOL_OVERVIEW.md` | Protocol contracts |

## 3.3 Execution Dependency

A live session is associated with:

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
       v
    Live Session

The live session cannot bypass Run authorization.

## 3.4 Lab Dependency

The Lab Agent provides:

- authenticated lab identity;
- resource state;
- robot state;
- runtime state;
- telemetry;
- logs/events;
- camera/media session information;
- safety state.

## 3.5 Network Dependency

The system must account for:

- NAT;
- firewall;
- ICE negotiation;
- STUN;
- TURN where required;
- WebSocket disconnect;
- packet loss;
- jitter;
- bandwidth variation.

Provider-specific infrastructure must remain behind adapters.

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M06 shall deliver:

1. Live Run screen.
2. WebRTC video player.
3. Video connection state.
4. Camera selection foundation.
5. Telemetry subscription.
6. Telemetry dashboard.
7. Realtime logs.
8. Realtime events.
9. Lab Agent status.
10. Robot/resource status.
11. Runtime status.
12. Safety-state freshness.
13. WebSocket connection manager.
14. WebRTC reconnect manager.
15. Telemetry resynchronization.
16. Log resynchronization.
17. Event sequence tracking.
18. Stale-data handling.
19. Live-session authorization.
20. Session cleanup.
21. Simulation live environment.
22. Network fault testing.
23. Live E2E testing.

## 4.2 Live Run Screen

Conceptual layout:

    +--------------------------------------------------------------+
    | Run: R-001                         Status: RUNNING            |
    +-----------------------------+--------------------------------+
    |                             | Robot / Lab Status            |
    |                             |                                |
    |        LIVE VIDEO           | Lab Agent: CONNECTED          |
    |                             | Robot: RUNNING                |
    |                             | Runtime: RUNNING              |
    |                             | Safety: SAFE / CURRENT        |
    |                             |                                |
    +-----------------------------+--------------------------------+
    | Telemetry                                                   |
    | Joint | Position | Velocity | Temperature | Battery | CPU   |
    +------------------------------------------------------------+
    | Live Logs                                                   |
    | 10:21:01 INFO runtime Application started                  |
    | 10:21:02 INFO control  Target reached                      |
    +------------------------------------------------------------+
    | Connection: Video CONNECTED | Events CONNECTED | Telemetry OK|
    +------------------------------------------------------------+

## 4.3 WebRTC Video

The video subsystem includes:

- session authorization;
- offer/answer negotiation;
- ICE candidate exchange;
- STUN/TURN support;
- media track management;
- video playback;
- reconnect;
- quality statistics;
- camera availability.

The media path should be independent of the normal API request path.

## 4.4 Video Quality

The UI should expose useful indicators such as:

- connected;
- connecting;
- reconnecting;
- unavailable;
- degraded.

Where supported, display:

- resolution;
- frame rate;
- packet loss;
- round-trip time;
- bitrate.

Detailed WebRTC statistics need not be exposed to every user.

## 4.5 Telemetry

Telemetry must support:

- timestamp;
- signal name;
- value;
- unit;
- quality;
- source;
- sequence;
- sample time.

Conceptual record:

    {
        "run_id": "run-001",
        "sequence": 1001,
        "timestamp": "2026-10-10T10:21:01Z",
        "signal": "battery.level",
        "value": 82.5,
        "unit": "percent",
        "quality": "GOOD"
    }

## 4.6 Telemetry Display

The UI should support:

- current values;
- units;
- update timestamp;
- stale indicator;
- selected signals;
- grouped signals;
- compact charts where appropriate.

P0 should prioritize current operational values over complex historical
visualization.

## 4.7 Realtime Logs

Logs should display:

- time;
- severity;
- source;
- message;
- sequence;
- Run.

The UI should support:

- live mode;
- pause visual auto-scroll;
- resume;
- filtering;
- severity filtering;
- source filtering;
- search where practical.

Pausing visual auto-scroll must not stop receiving logs.

## 4.8 Realtime Events

Important events include:

- Job state;
- Run state;
- resource state;
- safety state;
- Lab Agent state;
- connection state;
- execution commands;
- warnings;
- failures.

Events are at-least-once.

The client must deduplicate them.

## 4.9 Lab Status

Lab status should show:

- Lab Agent connection;
- last heartbeat;
- resource availability;
- maintenance state;
- runtime connectivity.

## 4.10 Robot Status

Robot status should show, where supported:

- robot state;
- operational mode;
- connection;
- battery;
- fault;
- safety state;
- last update.

Robot status is not equivalent to safety state.

## 4.11 Safety Freshness

Every safety presentation must have a freshness concept.

Example:

    Safety: READY
    Last confirmed: 10:21:05
    Age: 350 ms
    Status: CURRENT

If the signal becomes stale:

    Safety: UNKNOWN
    Last confirmed: 10:21:05
    Age: 8.4 s
    Status: STALE

The threshold is platform/policy configurable.

---

# 9. Risks

## 9.1 R-FM06-001 — Video Latency

**Risk:** Video latency makes remote observation ineffective.

**Impact:** High.

**Mitigation:**

- WebRTC;
- appropriate media configuration;
- network qualification;
- latency monitoring;
- TURN only when required.

## 9.2 R-FM06-002 — Video Disconnect Misinterpreted

**Risk:** User assumes robot stopped because video stopped.

**Impact:** Critical.

**Mitigation:**

- separate video state;
- Run state remains authoritative;
- explicit "Video unavailable";
- telemetry/log/status remain independent.

## 9.3 R-FM06-003 — Stale Safety State

**Risk:** Old safety information is displayed as current.

**Impact:** Critical.

**Mitigation:**

- freshness timestamps;
- stale thresholds;
- UNKNOWN state;
- independent safety source;
- safety review.

## 9.4 R-FM06-004 — Reconnect Storm

**Risk:** Many clients reconnect simultaneously and overload infrastructure.

**Impact:** High.

**Mitigation:**

- exponential backoff;
- jitter;
- bounded retry;
- session limits;
- server throttling.

## 9.5 R-FM06-005 — Telemetry Overload

**Risk:** High-rate telemetry overwhelms UI or network.

**Impact:** High.

**Mitigation:**

- signal selection;
- rate limiting;
- aggregation;
- backpressure;
- client rendering limits.

## 9.6 R-FM06-006 — Log Flood

**Risk:** Application produces excessive logs.

**Impact:** Medium.

**Mitigation:**

- rate limits;
- buffering;
- filtering;
- durable retrieval;
- UI rendering limits.

## 9.7 R-FM06-007 — Cross-Tenant Stream Leakage

**Risk:** One tenant receives another tenant's video/telemetry/logs.

**Impact:** Critical.

**Mitigation:**

- live-session authorization;
- per-stream authorization;
- tenant-scoped resource IDs;
- integration tests;
- security review.

## 9.8 R-FM06-008 — Media Session Leakage

**Risk:** A WebRTC session remains available after authorization expires.

**Impact:** High.

**Mitigation:**

- time-limited session credentials;
- session expiry;
- explicit close;
- authorization checks;
- server-side cleanup.

## 9.9 R-FM06-009 — Event Loss

**Risk:** Missed events cause incorrect UI state.

**Impact:** High.

**Mitigation:**

- sequence numbers;
- durable state;
- replay/resync;
- snapshots.

## 9.10 R-FM06-010 — Resource Leak

**Risk:** Reconnects create orphaned WebRTC/WebSocket sessions.

**Impact:** Medium.

**Mitigation:**

- explicit lifecycle management;
- session TTL;
- cleanup tests;
- server-side expiration.

## 9.11 R-FM06-011 — Network Variability

**Risk:** NAT, packet loss and jitter degrade live experience.

**Impact:** High.

**Mitigation:**

- ICE;
- STUN/TURN;
- adaptive media;
- reconnect;
- degraded-state presentation.

## 9.12 R-FM06-012 — Safety/Operational Ambiguity

**Risk:** Users confuse operational status with safety state.

**Impact:** Critical.

**Mitigation:**

- separate panels;
- explicit terminology;
- freshness;
- safety review;
- acceptance tests.

---

# 10. Exit Criteria

## 10.1 Functional Exit

- [ ] Live Run screen works.
- [ ] WebRTC video works.
- [ ] Video reconnect works.
- [ ] Telemetry works.
- [ ] Telemetry resync works.
- [ ] Realtime logs work.
- [ ] Realtime events work.
- [ ] Lab Agent status works.
- [ ] Robot status works.
- [ ] Safety freshness works.
- [ ] WebSocket reconnect works.
- [ ] Live session cleanup works.

## 10.2 Video Exit

- [ ] WebRTC negotiation works.
- [ ] STUN works where required.
- [ ] TURN fallback works where required.
- [ ] Camera authorization works.
- [ ] Video state is displayed.
- [ ] Video quality is usable.
- [ ] Video reconnect works.
- [ ] Video failure does not change Run state.

## 10.3 Telemetry Exit

- [ ] Telemetry subscription works.
- [ ] Signals display correctly.
- [ ] Units display correctly.
- [ ] Timestamps display correctly.
- [ ] Stale data is identified.
- [ ] Sequence gaps are detected.
- [ ] Resynchronization works.
- [ ] High-rate telemetry does not make the UI unusable.

## 10.4 Logs/Events Exit

- [ ] Logs stream.
- [ ] Logs are ordered.
- [ ] Duplicate logs are handled.
- [ ] Events stream.
- [ ] Duplicate events are handled.
- [ ] Sequence gaps are handled.
- [ ] Reconnect works.
- [ ] Durable state resynchronization works.

## 10.5 Safety Exit

- [ ] Safety state is separately represented.
- [ ] Safety freshness is enforced.
- [ ] UNKNOWN is not represented as SAFE.
- [ ] STALE is visible.
- [ ] Physical E-stop remains distinct.
- [ ] Video loss does not imply safety.
- [ ] WebSocket loss does not imply safety.
- [ ] Telemetry loss does not imply safety.
- [ ] Safety review is complete.

## 10.6 Security Exit

- [ ] Live session authorization passes.
- [ ] Video authorization passes.
- [ ] Telemetry authorization passes.
- [ ] Log authorization passes.
- [ ] Tenant isolation tests pass.
- [ ] Session expiry works.
- [ ] Media session cleanup works.
- [ ] Security review passes.

## 10.7 Quality Exit

- [ ] Unit tests pass.
- [ ] WebRTC tests pass.
- [ ] Telemetry tests pass.
- [ ] Log tests pass.
- [ ] Event tests pass.
- [ ] Reconnect tests pass.
- [ ] Fault-injection tests pass.
- [ ] E2E live test passes.
- [ ] Performance qualification passes.
- [ ] CI passes.

## 10.8 UI Exit

- [ ] Live layout reviewed.
- [ ] Video reviewed.
- [ ] Telemetry reviewed.
- [ ] Logs reviewed.
- [ ] Status panels reviewed.
- [ ] Safety state reviewed.
- [ ] Connection indicators reviewed.
- [ ] Stale-data states reviewed.
- [ ] Accessibility reviewed.
- [ ] Dark/light themes reviewed.

## 10.9 Documentation Exit

- [ ] WebRTC architecture documented.
- [ ] Signaling contract documented.
- [ ] Telemetry contract documented.
- [ ] Event contract documented.
- [ ] Log contract documented.
- [ ] Reconnect behavior documented.
- [ ] Freshness policy documented.
- [ ] Security model documented.
- [ ] Test evidence recorded.
- [ ] Tracking documents updated.

## 10.10 Formal Milestone Status

F-M06 follows:

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

`COMPLETE` requires evidence, review and tracking updates.

---
