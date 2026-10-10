# F-M06-LIVE — Tasks

Milestone: F-M06 — Live Execution
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-3-044 | Define Live Run information architecture | 1.5d | UX/UI | F-M05 | [ ] |
| KR-FE-3-045 | Define live-session API contract | 2.0d | Architect/Backend | F-M05 | [ ] |
| KR-FE-3-046 | Define WebRTC signaling contract | 3.0d | Architect/Backend/Media | 045 | [ ] |
| KR-FE-3-047 | Define telemetry event contract | 2.0d | Architect/Robotics | 045 | [ ] |
| KR-FE-3-048 | Define live log/event contract | 2.0d | Architect/Backend | 045 | [ ] |
| KR-FE-3-049 | Implement live-session authorization | 2.0d | Backend/Security | 045 | [ ] |
| KR-FE-3-050 | Implement WebRTC signaling service | 3.0d | Backend/Media | 046 | [ ] |
| KR-FE-3-051 | Implement STUN/TURN adapter | 2.5d | DevOps/Media | 050 | [ ] |
| KR-FE-3-052 | Implement Lab Agent media adapter | 4.0d | Robotics/Media | 050 | [ ] |
| KR-FE-3-053 | Implement WebRTC Studio client | 3.0d | Frontend | 050 | [ ] |
| KR-FE-3-054 | Implement video state manager | 2.0d | Frontend | 053 | [ ] |
| KR-FE-3-055 | Implement video reconnect | 2.0d | Frontend/Media | 054 | [ ] |
| KR-FE-3-056 | Implement video quality indicators | 2.0d | Frontend | 053 | [ ] |
| KR-FE-3-057 | Implement telemetry subscription | 2.5d | Frontend/Rust | 047 | [ ] |
| KR-FE-3-058 | Implement telemetry state store | 2.0d | Frontend | 057 | [ ] |
| KR-FE-3-059 | Implement telemetry dashboard | 3.0d | Frontend | 058 | [ ] |
| KR-FE-3-060 | Implement telemetry freshness | 1.5d | Frontend | 058 | [ ] |
| KR-FE-3-061 | Implement realtime log stream | 2.5d | Frontend/Backend | 048 | [ ] |
| KR-FE-3-062 | Implement log filtering | 1.5d | Frontend | 061 | [ ] |
| KR-FE-3-063 | Implement event subscription | 2.0d | Frontend | 048 | [ ] |
| KR-FE-3-064 | Implement event deduplication | 1.5d | Frontend | 063 | [ ] |
| KR-FE-3-065 | Implement sequence-gap detection | 1.5d | Frontend/Backend | 063 | [ ] |
| KR-FE-3-066 | Implement reconnect/resync manager | 3.0d | Frontend/Backend | 063-065 | [ ] |
| KR-FE-3-067 | Implement Lab Agent status panel | 1.5d | Frontend | 066 | [ ] |
| KR-FE-3-068 | Implement robot status panel | 1.5d | Frontend | 067 | [ ] |
| KR-FE-3-069 | Implement safety freshness display | 2.0d | Frontend/Safety | 068 | [ ] |
| KR-FE-3-070 | Implement live connection status | 1.5d | Frontend | 054,066 | [ ] |
| KR-FE-3-071 | Implement live-session cleanup | 1.5d | Backend/Frontend | 049,066 | [ ] |
| KR-FE-3-072 | Build simulation live environment | 3.0d | Robotics | 052,057 | [ ] |
| KR-FE-3-073 | Add network fault injection | 2.0d | QA/DevOps | 072 | [ ] |
| KR-FE-3-074 | Add WebRTC tests | 3.0d | QA/Media | 053-056 | [ ] |
| KR-FE-3-075 | Add telemetry tests | 2.0d | QA | 057-060 | [ ] |
| KR-FE-3-076 | Add log/event tests | 2.0d | QA | 061-065 | [ ] |
| KR-FE-3-077 | Add reconnect/resync tests | 2.5d | QA | 066 | [ ] |
| KR-FE-3-078 | Add safety freshness tests | 2.0d | QA/Safety | 069 | [ ] |
| KR-FE-3-079 | Add live E2E tests | 3.0d | QA | 053-072 | [ ] |
| KR-FE-3-080 | Add tenant/isolation tests | 2.0d | Security/QA | 049,071 | [ ] |
| KR-FE-3-081 | Performance/load qualification | 3.0d | QA/DevOps | 074-079 | [ ] |
| KR-FE-3-082 | Complete security/media review | 2.5d | Security/Media | All | [ ] |
| KR-FE-3-083 | Complete UI/accessibility review | 2.0d | UX/UI | All | [ ] |
| KR-FE-3-084 | Complete milestone documentation | 1.5d | Documentation | All | [ ] |
| KR-FE-3-085 | Milestone acceptance and evidence | 1.0d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Live Session Interface

Conceptual operation:

    createLiveSession({
        jobId,
        runId,
        requestedStreams
    })

Response:

    {
        "session_id": "live-001",
        "run_id": "run-001",
        "streams": [
            "VIDEO",
            "TELEMETRY",
            "LOGS",
            "EVENTS"
        ],
        "expires_at": "..."
    }

The session must be authorized and time-bounded.

## 5.3 WebRTC Signaling Interface

Conceptual flow:

    Studio
      |
      | session request
      v
    Control Plane
      |
      | authorized signaling
      v
    Lab Media Endpoint
      |
      +--> SDP offer/answer
      +--> ICE candidates
      |
      v
    WebRTC Peer Connection
      |
      v
    Video Track

The Control Plane provides signaling/control but should not become the
high-bandwidth video data path unless explicitly required by architecture.

## 5.4 WebRTC State Model

    IDLE
      |
      v
    REQUESTING
      |
      v
    CONNECTING
      |
      v
    CONNECTED
      |
      +----> DEGRADED
      |
      +----> RECONNECTING
      |          |
      |          v
      |      CONNECTED
      |
      +----> FAILED
      |
      v
    CLOSED

The UI must distinguish video state from Run state.

## 5.5 Telemetry Interface

Conceptual subscription:

    subscribeTelemetry({
        runId,
        signals: [
            "robot.state",
            "battery.level",
            "cpu.utilization"
        ]
    })

Telemetry events include:

- sequence;
- timestamp;
- signal;
- value;
- unit;
- quality.

## 5.6 Telemetry Resynchronization

When a sequence gap occurs:

    seq 101
    seq 102
    seq 105

The client detects:

    GAP = 103, 104

It requests a snapshot or replay according to the telemetry protocol.

The exact mechanism may be:

- snapshot;
- replay;
- resubscribe;
- latest-value refresh.

## 5.7 Log Interface

Conceptual subscription:

    subscribeLogs({
        runId,
        fromSequence
    })

The service should support replay from a known sequence where practical.

## 5.8 Event Interface

Conceptual subscription:

    subscribeEvents({
        jobId,
        runId,
        fromSequence
    })

Events are at-least-once.

Client deduplication uses:

    event_id

Ordering/gap detection uses:

    sequence

## 5.9 Connection Manager

The client should maintain separate states:

    Control Plane Connection
    WebSocket Connection
    WebRTC Connection
    Telemetry Subscription
    Log Subscription

A single "Connected" flag is insufficient.

## 5.10 Reconnect Strategy

Conceptual flow:

    Connection Lost
         |
         v
    Mark Channel Degraded
         |
         v
    Backoff
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
    Fetch Snapshot
         |
         v
    Resume Events
         |
         v
    Validate Sequence
         |
         v
    Current

Backoff must avoid reconnect storms.

## 5.11 Reconnect Separation

Video reconnect must not automatically:

- restart the Run;
- restart the robot;
- issue a software stop.

Telemetry reconnect must not:

- restart execution;
- change Job state.

WebSocket reconnect must not:

- alter physical safety state.

## 5.12 Live Data Freshness

Every live data class should have freshness semantics.

| Data | Freshness |
|---|---|
| Video | media connection state |
| Telemetry | sample timestamp |
| Logs | event timestamp/sequence |
| Robot status | observation timestamp |
| Safety | safety-source timestamp |
| Lab Agent | heartbeat |
| Run state | durable server state |

---
