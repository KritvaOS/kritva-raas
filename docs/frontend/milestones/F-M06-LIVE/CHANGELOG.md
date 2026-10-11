# F-M06-LIVE — Changelog

Milestone: F-M06 — Live Execution

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

- Initial F-M06 milestone dossier.
- No implementation is implied by this document.
- F-M06 establishes live observation for remote execution.
- Video uses WebRTC.
- Telemetry, logs and events use realtime application transports.
- Durable execution state remains authoritative over live streams.
- Safety state requires explicit freshness semantics.
- Physical E-stop remains a separate local safety mechanism.

---

# Appendix A — Phase Mapping

The canonical mapping for F-M06 LIVE (P7) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Upstream dependency; outputs consumed by this milestone |  |
| P4 BOOKING & COMMERCIAL | Upstream dependency; outputs consumed by this milestone |  |
| P5 EXECUTION | Upstream dependency; outputs consumed by this milestone | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Upstream dependency; outputs consumed by this milestone | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Owning phase |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Live Data Architecture

    +--------------------+
    |   Kritva Runtime   |
    +----------+---------+
               |
       +-------+-------+
       |       |       |
       v       v       v
    Logs   Telemetry  State
       |       |       |
       +-------+-------+
               |
               v
          Lab Agent
               |
        +------+------+
        |             |
        v             v
    WebSocket       Control Plane
        |             |
        |             v
        |       Durable State
        |
        v
    RaaS Studio

    Camera
       |
       v
    Media Endpoint
       |
       v
    WebRTC
       |
       v
    RaaS Studio

The two major live paths are intentionally separate.

---

# Appendix C — WebRTC Architecture

    Studio
      |
      | HTTPS: authorize live session
      v
    Control Plane
      |
      | signaling
      v
    Media Endpoint
      |
      | SDP / ICE
      v
    Peer Connection
      |
      | RTP/SRTP media
      v
    Video Element

STUN/TURN services support connectivity where required.

Video media should not be persisted by default.

Recording is outside F-M06 unless separately enabled by policy.

---

# Appendix D — WebSocket Architecture

    Studio
      |
      | WebSocket
      v
    Realtime Gateway
      |
      +--> Job Events
      +--> Run Events
      +--> Telemetry
      +--> Logs
      +--> Safety
      +--> Resource Status
      |
      v
    Studio State Stores

The gateway is a delivery mechanism.

Durable state remains authoritative.

---

# Appendix E — Connection State Model

Each connection is independently tracked.

    Control Plane
        |
        +--> CONNECTED
        +--> DEGRADED
        +--> DISCONNECTED

    WebSocket
        |
        +--> CONNECTING
        +--> CONNECTED
        +--> RECONNECTING
        +--> FAILED

    WebRTC
        |
        +--> CONNECTING
        +--> CONNECTED
        +--> DEGRADED
        +--> RECONNECTING
        +--> FAILED

    Telemetry
        |
        +--> SUBSCRIBING
        +--> ACTIVE
        +--> STALE
        +--> RECONNECTING
        +--> FAILED

The UI must not reduce these to one boolean.

---

# Appendix F — Freshness Model

Conceptual freshness function:

    age = current_time - observed_at

Possible states:

    age <= current_threshold
        -> CURRENT

    current_threshold < age <= stale_threshold
        -> AGING / DEGRADED

    age > stale_threshold
        -> STALE

    source unavailable
        -> UNKNOWN

Safety signals may use stricter thresholds than ordinary telemetry.

---

# Appendix G — Telemetry Model

Conceptual structure:

    TelemetryStream
        |
        +-- signal
        +-- timestamp
        +-- sequence
        +-- value
        +-- unit
        +-- quality
        +-- source

Example:

    {
        "run_id": "run-001",
        "sequence": 5001,
        "timestamp": "2026-10-10T10:21:05.120Z",
        "signal": "joint.1.position",
        "value": 1.204,
        "unit": "rad",
        "quality": "GOOD",
        "source": "runtime"
    }

The schema must support platform-specific telemetry without allowing arbitrary
unbounded payloads to destabilize the client.

---

# Appendix H — Realtime Log Model

Conceptual structure:

    {
        "run_id": "run-001",
        "sequence": 1201,
        "timestamp": "2026-10-10T10:21:05Z",
        "severity": "INFO",
        "source": "runtime",
        "component": "controller",
        "message": "Control loop active"
    }

Log messages are untrusted application data and must be rendered safely.

HTML/script injection through log messages must be prevented.

---

# Appendix I — Event Ordering

Events use:

- event ID;
- sequence;
- timestamp;
- Job ID;
- Run ID;
- correlation ID.

Example:

    1001 RUNNING
    1002 LOG
    1003 TELEMETRY
    1004 SAFETY
    1005 LOG

If the client receives:

    1001
    1003
    1004

it detects a sequence gap.

The recovery strategy must not blindly invent missing state.

The client requests authoritative state or replay.

---

# Appendix J — Reconnect Architecture

    Channel Failure
          |
          v
    Detect Failure
          |
          v
    Mark Channel Degraded
          |
          v
    Backoff + Jitter
          |
          v
    Reconnect
          |
          v
    Authenticate
          |
          v
    Restore Subscription
          |
          v
    Snapshot / Replay
          |
          v
    Sequence Check
          |
          v
    Current

Each channel may reconnect independently.

---

# Appendix K — Failure Independence

## Video Failure

    Video X
      |
      +--> Telemetry continues
      +--> Logs continue
      +--> Run state continues
      +--> Safety state continues

## Telemetry Failure

    Telemetry X
      |
      +--> Video may continue
      +--> Logs may continue
      +--> Run state continues
      +--> Safety becomes stale if safety uses same source

## WebSocket Failure

    WebSocket X
      |
      +--> Video may continue
      +--> Durable state remains
      +--> Reconnect required

## Control Plane Failure

    Control Plane X
      |
      +--> Local Lab Agent policy applies
      +--> Runtime policy applies
      +--> Physical safety remains local

The UI must represent these independently.

---

# Appendix L — Security Model

Live data is sensitive.

The authorization chain is:

    User
      |
      v
    Organization Membership
      |
      v
    Project Access
      |
      v
    Job/Run Access
      |
      +--> Video Authorization
      +--> Telemetry Authorization
      +--> Log Authorization
      +--> Event Authorization
      |
      v
    Live Session

Stream credentials should be:

- scoped;
- short-lived;
- revocable where practical;
- bound to the intended Run/resource;
- non-reusable across tenants.

---

# Appendix M — Performance Model

Live workload consists of different traffic classes:

    Low Rate:
      Job/Run Events
      Safety Events
      Lab Status

    Medium Rate:
      Logs
      Robot Status
      Selected Telemetry

    High Bandwidth:
      Video

Each class requires independent capacity controls.

Video bandwidth must not starve control-plane state delivery.

Telemetry volume must not prevent safety events from being delivered.

Log volume must not make the UI unusable.

---

# Appendix N — Observability

The system should measure:

- live-session count;
- active WebRTC connections;
- WebRTC connection failures;
- video startup latency;
- reconnect rate;
- telemetry rate;
- telemetry lag;
- event lag;
- log rate;
- WebSocket reconnect rate;
- stale safety observations;
- Lab Agent heartbeat failures;
- resource connection failures.

Correlations should use:

- organization;
- project;
- Job;
- Run;
- live session.

---

# Appendix O — Operational Failure Scenarios

## Scenario 1 — Video Only Fails

Expected:

- video shows RECONNECTING;
- Run remains RUNNING if durable state says so;
- telemetry/logs remain independent;
- no automatic stop.

## Scenario 2 — WebSocket Fails

Expected:

- event channel shows disconnected;
- durable state may become temporarily stale;
- video may continue;
- reconnect occurs;
- state is refreshed.

## Scenario 3 — Lab Agent Fails

Expected:

- Lab Agent status becomes unavailable;
- telemetry/safety freshness reflects source availability;
- execution state is not guessed;
- local safety policy remains authoritative.

## Scenario 4 — Safety Signal Becomes Stale

Expected:

    Safety: UNKNOWN / STALE

The previous SAFE state is not treated as current.

## Scenario 5 — User Closes Studio

Expected:

- Run continues according to execution policy;
- live session resources are cleaned;
- robot does not receive an implicit stop unless explicitly defined by policy.

---

# Appendix P — Open Questions

The following items require explicit decisions before production completion:

1. Which WebRTC topology will be used for the initial production deployment?
2. When is TURN mandatory?
3. Who operates STUN/TURN infrastructure?
4. Will video use one camera or multiple camera tracks?
5. Can users switch cameras during a Run?
6. Is camera recording supported later?
7. What is the default video resolution?
8. What is the maximum permitted video bitrate?
9. What is the target video latency?
10. What telemetry signals are P0 for each platform?
11. What is the maximum telemetry rate per Run?
12. Should telemetry be downsampled in the Control Plane?
13. Which telemetry must bypass the Control Plane?
14. Which logs are persisted?
15. What log retention applies?
16. What maximum live log rate can one Run produce?
17. What happens when the log rate exceeds the client rendering limit?
18. What is the event replay window?
19. How are telemetry gaps recovered?
20. How are log gaps recovered?
21. How are safety-event gaps recovered?
22. What is the safety freshness threshold?
23. Does each platform define its own freshness threshold?
24. Which safety signals are mandatory for physical robots?
25. What is the behavior if the safety source becomes unavailable?
26. Should the UI display "safe" only when independently confirmed?
27. How long should live sessions remain valid?
28. Can a user open the same Run from multiple Studio instances?
29. Are concurrent live viewers permitted?
30. What is the maximum number of viewers per Run?
31. Can an organization administrator observe another user's Run?
32. What happens when a user's authorization changes during an active session?
33. How quickly must media access be revoked?
34. How quickly must telemetry access be revoked?
35. Should live sessions be audited individually?
36. What privacy policy governs camera streams?
37. Is video ever stored?
38. Which jurisdictions affect video retention?
39. What operational dashboard is required for live services?
40. What alert thresholds apply to WebRTC failures?
41. What is the maximum reconnect duration before the UI declares failure?
42. Should video and telemetry reconnect independently or as a coordinated
    live-session operation?
43. What is the fallback if WebRTC cannot establish a direct media path?
44. Is browser-native WebRTC sufficient for all supported Studio platforms?
45. What native Tauri integration is required for Windows and Linux?
46. Which live features are available in simulation versus physical labs?
47. What human safety review is required before enabling live physical video?
48. What data must be retained for execution incident investigation?
49. Which telemetry is considered customer data?
50. Which live features remain P0 versus P1?

Open questions must be converted into tracked decisions before implementation
depends on them.

---

# Appendix Q — Definition of Done

F-M06 is Done when an active simulated Run can be observed through:

    Active Run
       |
       +--> WebRTC Video
       |
       +--> Telemetry
       |
       +--> Logs
       |
       +--> Events
       |
       +--> Lab Status
       |
       +--> Robot Status
       |
       +--> Safety State
       |
       v
    Network Failure
       |
       v
    Reconnect
       |
       v
    Resynchronization
       |
       v
    Continued Observation

Every live channel must have test evidence for normal operation and failure
recovery.

---

# Appendix R — Final Milestone Invariants

1. Live data is not authoritative business state.
2. Durable Job/Run state is authoritative.
3. Video is transported through WebRTC.
4. Video failure does not imply Run failure.
5. Telemetry is independently transported.
6. Log streams are independently transported.
7. Event streams are independently transported.
8. WebSocket failure does not imply robot stopped.
9. WebRTC failure does not imply robot stopped.
10. Telemetry failure does not imply robot stopped.
11. Cloud connectivity does not define physical safety.
12. Safety state has explicit freshness.
13. UNKNOWN is not SAFE.
14. STALE is not CURRENT.
15. Physical E-stop remains a separate safety mechanism.
16. Live sessions require authorization.
17. Stream authorization is tenant-aware.
18. Media sessions are scoped and time-bounded.
19. Duplicate events are safely ignored.
20. Sequence gaps trigger recovery.
21. Reconnect does not restart execution.
22. Reconnect does not issue software control commands.
23. Reconnect does not alter physical safety state.
24. Live channels can fail independently.
25. High-bandwidth video cannot starve control-plane state.
26. High-rate telemetry cannot prevent safety events from being represented.
27. High-volume logs cannot make the Studio unusable.
28. Live session resources are cleaned up.
29. Sensitive live data is access-controlled.
30. Camera access is authorized.
31. Telemetry access is authorized.
32. Log access is authorized.
33. Tenant isolation is explicitly tested.
34. Simulation is the initial qualification environment.
35. Physical live operation remains subject to safety review.
36. F-M06 provides the live observation foundation for production RaaS.
37. Live observation does not replace local robot safety.
38. Live observation does not replace durable execution state.
39. Live observation does not provide autonomous robot control.
40. Milestone completion requires evidence, review and tracking updates.

# Appendix S — Milestone Principle

> F-M06 turns remote execution into an observable robotics experience. The
> user should be able to see the robot through low-latency WebRTC video,
> understand its current operational state through telemetry, follow execution
> through realtime logs and events, and verify the health of the Lab Agent and
> robot connection. These streams are deliberately independent: a video
> failure does not mean the Run stopped, a WebSocket failure does not mean the
> robot stopped, and a telemetry failure does not mean the robot is safe.
> Durable Job and Run state remains authoritative, while every live signal has
> explicit freshness and reconnect semantics. Physical safety remains local to
> the robot and its safety system. F-M06 therefore establishes the live
> observation layer required for Kritva RaaS to provide a trustworthy "run on
> real robots" experience without turning realtime media or telemetry into an
> unsafe substitute for authoritative execution state or physical safety
> controls.
