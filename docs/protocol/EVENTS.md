# Kritva RaaS Event Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Event Specification |
| Path | `docs/protocol/EVENTS.md` |
| Product | Kritva Robotics-as-a-Service |
| Protocol Model | Contract-driven event notification |
| Primary Transport | WebSocket |
| Lab Transport | Secure Lab Channel |
| Desktop Transport | Tauri IPC events |
| Contract Package | `packages/contracts` |
| API Client | `packages/api-client` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production event model for Kritva RaaS.

Events communicate that something has happened or that an authoritative resource
state has changed.

Events are distinct from commands and responses:

    COMMAND
        |
        | "Please do this"
        v
    Service
        |
        +---- RESPONSE
        |      "Here is the immediate outcome"
        |
        +---- EVENT
               "This happened"

Events provide realtime notification while durable resource state remains
authoritative in the Control Plane.

## 3. Scope

This document defines:

- event naming;
- event categories;
- event envelope;
- event identity;
- event correlation;
- ordering;
- delivery guarantees;
- subscription;
- authorization;
- replay;
- reconnection;
- deduplication;
- event retention;
- event payload schemas;
- job events;
- run events;
- artifact events;
- booking events;
- credit events;
- platform events;
- lab events;
- resource events;
- telemetry events;
- result events;
- experiment events;
- Studio IPC events;
- implementation phases.

## 4. Goals

The event architecture shall:

1. provide consistent event semantics;
2. provide stable event names;
3. provide unique event IDs;
4. provide resource-level ordering;
5. support at-least-once delivery;
6. tolerate duplicate events;
7. support reconnect and recovery;
8. support authorized subscriptions;
9. support replay where required;
10. keep durable state authoritative;
11. support asynchronous execution;
12. support realtime robot observation;
13. support bounded telemetry delivery;
14. support protocol versioning;
15. support complete lifecycle tracing.

## 5. Non-Goals

This document does not define:

- database event schemas;
- SQL implementation;
- physical emergency-stop signaling;
- video codec or media transport;
- cloud-provider-specific messaging services;
- internal implementation class hierarchies;
- arbitrary application logging.

High-frequency telemetry and video may use specialized transports while remaining
represented by the event architecture at the control level.

## 6. Event Definition

An event is an immutable notification that an occurrence or state transition has
taken place.

Examples:

    job.queued
    job.running
    job.completed
    artifact.accepted
    booking.confirmed
    agent.offline
    result.available

Events are facts, not requests.

## 7. Event Principles

The event architecture follows these rules:

1. Commands request actions.
2. Responses report immediate outcomes.
3. Events report occurrences.
4. Durable state remains authoritative.
5. Events should be immutable.
6. Events should be uniquely identifiable.
7. Events should be safely repeatable by consumers.
8. Events should carry enough context for routing.
9. Events should not contain unnecessary sensitive data.
10. Event ordering is scoped to a resource where required.
11. WebSocket delivery is at-least-once.
12. Reconnect must not permanently lose authoritative state.

## 8. Event Architecture

    +-----------------------+
    | Control Plane         |
    | Domain Services       |
    +-----------+-----------+
                |
                v
        Durable State Change
                |
                v
          Event Publisher
                |
                v
          Event Stream
                |
        +-------+--------+
        |                |
        v                v
    WebSocket         Lab Channel
        |                |
        v                v
    Studio/Web       Lab Agent

Events may also originate from:

    Lab Agent
        |
        v
    Control Plane
        |
        v
    WebSocket
        |
        v
    Studio

## 9. Event Sources

Primary event producers are:

| Producer | Event Categories |
|---|---|
| Identity | authentication/session |
| Project | project lifecycle |
| Platform | platform/resource state |
| Artifact | upload/validation |
| Booking | booking lifecycle |
| Credit | financial state |
| Job | execution lifecycle |
| Run | runtime lifecycle |
| Lab Agent | agent/resource state |
| Runtime | robot/run telemetry |
| Result | result lifecycle |
| Experiment | experiment lifecycle |
| Local Runtime | build/test/artifact IPC events |

## 10. Event Consumers

Consumers include:

- Kritva RaaS Studio;
- Web Console;
- Admin Console;
- Control Plane modules;
- asynchronous workers;
- Lab Agent;
- monitoring systems;
- audit/observability systems.

A consumer only receives events for which it has authorization.

# 11. Standard Event Envelope

The standard event envelope is:

    {
        "protocol_version": "1.0",
        "event_id": "evt-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "event": "job.running",
        "resource": {
            "type": "job",
            "id": "job-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "sequence": 12,
        "correlation": {
            "request_id": "req-12345",
            "operation_id": "op-001"
        },
        "data": {}
    }

## 12. Envelope Fields

| Field | Required | Purpose |
|---|---:|---|
| `protocol_version` | Yes | Event contract version |
| `event_id` | Yes | Globally unique event identity |
| `timestamp` | Yes | Event creation time |
| `event` | Yes | Stable event name |
| `resource` | Yes | Primary affected resource |
| `context` | Yes | Tenant and correlation context |
| `sequence` | Conditional | Resource-scoped ordering |
| `correlation` | Optional | Request/operation relationship |
| `data` | Yes | Event-specific payload |

## 13. Event ID

Every event must have a unique `event_id`.

Example:

    "event_id": "evt-01J..."

Event IDs are opaque.

They are used for:

- deduplication;
- tracing;
- support;
- replay;
- audit correlation.

Event IDs must not encode business meaning.

## 14. Event Timestamp

Event timestamps use UTC.

Example:

    "timestamp": "2026-10-08T00:00:01Z"

Timestamp describes event creation time.

It is not necessarily the exact time the underlying physical event occurred.

Where physical observation time matters, the event payload may contain a separate
`observed_at` timestamp.

## 15. Event Name

Event names use:

    <domain>.<event>

Examples:

    artifact.uploaded
    artifact.validating
    artifact.accepted
    booking.confirmed
    job.running
    run.completed
    agent.offline

Event names describe something that happened.

They must not be imperative commands.

## 16. Event Naming Rules

Event names shall:

- use lowercase;
- use dot-separated components;
- identify the domain;
- use stable terminology;
- avoid implementation-specific names;
- describe a state transition or occurrence.

Good:

    job.completed

Bad:

    execute_job_now

## 17. Resource Reference

Every event identifies its primary resource.

Example:

    "resource": {
        "type": "job",
        "id": "job-001"
    }

For compound events, additional resource references may appear inside `data`.

## 18. Context

Typical context includes:

    {
        "organization_id": "org-001",
        "project_id": "project-001"
    }

Additional context may include:

- lab ID;
- platform ID;
- booking ID;
- job ID;
- run ID;
- actor ID where appropriate.

Context must not be used as a substitute for authorization.

## 19. Correlation

Events should preserve relevant operation correlation.

Example:

    "correlation": {
        "request_id": "req-12345",
        "operation_id": "op-001"
    }

This allows:

    User Request
         |
         v
    API Response
         |
         v
    Worker
         |
         v
    Lab Agent
         |
         v
    Event

to be traced as one logical operation.

## 20. Sequence

Where ordering matters, events include a resource-scoped sequence.

Example:

    job.queued      sequence=10
    job.validating  sequence=11
    job.deploying   sequence=12
    job.running     sequence=13

Sequence values need not be globally ordered across all resources.

## 21. Ordering Model

The system guarantees ordering only within defined scopes.

Recommended scope:

> **Per resource identity and event stream.**

For example, events for `job-001` may be ordered, while no ordering is guaranteed
between:

    job-001
    job-002

## 22. Global Ordering

Global event ordering is not required.

A system must not assume:

    job-001 event
        <
    job-002 event

based solely on timestamps or event IDs.

## 23. Resource Ordering

For lifecycle resources, ordering should be monotonic.

Example:

    CREATED
       |
       v
    QUEUED
       |
       v
    RUNNING
       |
       v
    COMPLETED

An event with a lower sequence number received after a higher sequence number
should be treated as delayed or duplicate.

## 24. Delivery Guarantee

The baseline WebSocket guarantee is:

> **At-least-once delivery.**

This means an event may be delivered more than once.

Consumers must be idempotent.

## 25. Exactly-Once

The platform does not rely on exactly-once network delivery.

Exactly-once business behavior is achieved through:

- event IDs;
- durable state;
- sequence numbers;
- consumer deduplication;
- idempotent handlers.

## 26. Duplicate Event

Example:

    event_id = evt-100
    sequence = 20

The same event may be received twice.

The consumer should:

    if event_id already processed:
        ignore duplicate
    else:
        process event
        record event_id

## 27. Event Processing

Recommended consumer processing:

    Receive Event
         |
         v
    Validate Schema
         |
         v
    Check Authorization Context
         |
         v
    Check Event ID
         |
         +--> duplicate --> ACK/ignore
         |
         v
    Check Sequence
         |
         v
    Process
         |
         v
    Persist Consumer State

## 28. WebSocket Event Delivery

The standard flow is:

    Studio
       |
       | WebSocket connect
       v
    Authenticate
       |
       v
    Subscribe
       |
       v
    Event Stream
       |
       v
    Consumer

The WebSocket connection is not authoritative storage.

## 29. Subscription

A subscription defines which events a client wants to receive.

Conceptual subscription request:

    {
        "type": "subscribe",
        "request_id": "req-sub-001",
        "subscription": {
            "resource_type": "job",
            "resource_id": "job-001",
            "events": [
                "job.*",
                "run.*"
            ]
        }
    }

The server validates authorization before accepting the subscription.

## 30. Subscription Response

    {
        "type": "subscription.accepted",
        "request_id": "req-sub-001",
        "subscription_id": "sub-001",
        "data": {
            "resource_type": "job",
            "resource_id": "job-001"
        }
    }

## 31. Subscription Scope

Supported scopes may include:

| Scope | Example |
|---|---|
| Resource | `job-001` |
| Project | `project-001` |
| Organization | `org-001` |
| Lab | `lab-001` |
| Platform | `humanoid-a` |
| User | authenticated user events |

The implementation must apply least-privilege filtering.

## 32. Wildcard Subscription

Wildcards may be supported:

    job.*

or:

    artifact.*

Wildcards must remain authorization-scoped.

A user subscribing to `job.*` receives only jobs they are authorized to observe.

## 33. Subscription Limits

Production deployments should limit:

- subscriptions per connection;
- subscriptions per user;
- subscriptions per organization;
- event rate;
- wildcard breadth.

Limits protect the event service from abusive consumers.

## 34. Subscription Lifecycle

    CONNECT
       |
       v
    AUTHENTICATE
       |
       v
    SUBSCRIBE
       |
       v
    ACTIVE
       |
       +--> UPDATE
       |
       +--> UNSUBSCRIBE
       |
       v
    CLOSED

## 35. Unsubscription

Conceptual request:

    {
        "type": "unsubscribe",
        "request_id": "req-unsub-001",
        "subscription_id": "sub-001"
    }

The server confirms removal.

## 36. Reconnection

The client must assume that events can be missed during disconnection.

Recovery:

    Connection Lost
         |
         v
    Reconnect
         |
         v
    Authenticate
         |
         v
    Replay if supported
         |
         v
    Query Current State
         |
         v
    Resume Subscription

## 37. Replay

Replay allows a consumer to request events after a known position.

Possible cursor:

    last_event_id
    or
    last_sequence

Replay is optional per event category.

## 38. Replay Semantics

Replay must never be interpreted as a replacement for durable state.

A client should use replay for:

- missed notifications;
- UI history;
- rebuilding local event views.

It should use REST/resource queries for authoritative current state.

## 39. Replay Request

Conceptual:

    {
        "type": "replay",
        "request_id": "req-replay-001",
        "subscription_id": "sub-001",
        "from_sequence": 100
    }

The server returns available events or indicates that the requested replay
window is no longer retained.

## 40. Replay Window

The retention period for replay is an operational policy.

If replay is unavailable:

    REPLAY_NOT_AVAILABLE

The client must then perform a state synchronization query.

## 41. Gap Detection

Example:

    received sequence=101
    received sequence=103

The client detects:

    missing sequence=102

It should request replay or query current state.

## 42. Sequence Gap Recovery

    Sequence Gap
         |
         v
    Replay Request
         |
      +--+--+
      |     |
   Found   Not Found
      |       |
      v       v
   Replay   State Query
      |       |
      +---+---+
          |
          v
      Re-synchronize

## 43. Event Retention

Event retention depends on event category.

| Event Type | Suggested Retention |
|---|---|
| Job lifecycle | Durable audit/history |
| Run lifecycle | Durable history |
| Booking lifecycle | Durable audit/history |
| Credit events | Immutable financial history |
| Artifact lifecycle | Durable history |
| Lab health | Operational retention |
| Telemetry | Shorter/optimized retention |
| UI-only IPC events | Session lifetime |

Exact retention values are deployment decisions.

## 44. Durable Events

Business-significant events should be reconstructable from durable state or
durable event/audit records.

Examples:

- booking confirmed;
- credit consumed;
- job completed;
- result available.

## 45. Ephemeral Events

Some events are informational and may be lost without affecting correctness.

Examples:

- transient telemetry update;
- local build progress;
- UI progress update.

Ephemeral events must never be the sole source of critical business state.

# 46. Artifact Events

Artifact lifecycle:

    CREATED
       |
       v
    UPLOADING
       |
       v
    UPLOADED
       |
       v
    VALIDATING
       |
       +--> REJECTED
       |
       v
    ACCEPTED
       |
       v
    READY
       |
       +--> REVOKED
       +--> EXPIRED

## 47. `artifact.created`

Payload:

    {
        "artifact_id": "artifact-001",
        "project_id": "project-001",
        "name": "vision-app",
        "version": "1.0.0"
    }

Phase: Phase 2.

## 48. `artifact.uploaded`

Payload:

    {
        "artifact_id": "artifact-001",
        "size": 10485760,
        "digest": "sha256:...",
        "uploaded_at": "2026-10-08T00:00:00Z"
    }

Phase: Phase 2.

## 49. `artifact.validating`

Payload:

    {
        "artifact_id": "artifact-001",
        "validation_id": "validation-001",
        "checks": [
            "manifest",
            "digest",
            "signature",
            "compatibility"
        ]
    }

Phase: Phase 2.

## 50. `artifact.accepted`

Payload:

    {
        "artifact_id": "artifact-001",
        "digest": "sha256:...",
        "platform_id": "humanoid-a",
        "runtime_version": "2.0"
    }

Phase: Phase 2.

## 51. `artifact.rejected`

Payload:

    {
        "artifact_id": "artifact-001",
        "reasons": [
            {
                "code": "ARTIFACT_INCOMPATIBLE",
                "message": "Required runtime is unavailable"
            }
        ]
    }

Phase: Phase 2.

## 52. `artifact.revoked`

Payload:

    {
        "artifact_id": "artifact-001",
        "reason": "SECURITY_POLICY",
        "revoked_at": "2026-10-08T00:00:00Z"
    }

Phase: Phase 8.

# 53. Booking Events

Booking lifecycle:

    CREATED
       |
       v
    CONFIRMED
       |
       +--> MODIFIED
       |
       +--> CANCELLED
       |
       v
    COMPLETED
       |
       v
    EXPIRED

## 54. `booking.created`

Payload:

    {
        "booking_id": "booking-001",
        "project_id": "project-001",
        "platform_id": "humanoid-a",
        "start_time": "2026-10-10T10:00:00Z",
        "end_time": "2026-10-10T10:30:00Z"
    }

Phase: Phase 4.

## 55. `booking.confirmed`

Payload:

    {
        "booking_id": "booking-001",
        "resource_id": "robot-001",
        "required_credits": 450
    }

Phase: Phase 4.

## 56. `booking.modified`

Payload:

    {
        "booking_id": "booking-001",
        "version": 3,
        "start_time": "2026-10-10T11:00:00Z",
        "end_time": "2026-10-10T11:30:00Z"
    }

Phase: Phase 4.

## 57. `booking.cancelled`

Payload:

    {
        "booking_id": "booking-001",
        "reason": "USER_REQUEST",
        "refund": {
            "credits": 450
        }
    }

Phase: Phase 4.

## 58. `booking.started`

Payload:

    {
        "booking_id": "booking-001",
        "resource_id": "robot-001"
    }

Phase: Phase 5.

## 59. `booking.completed`

Payload:

    {
        "booking_id": "booking-001",
        "resource_id": "robot-001"
    }

Phase: Phase 5.

# 60. Credit Events

Credit events are financially significant.

They should be durable and auditable.

## 61. `credit.consumed`

Payload:

    {
        "transaction_id": "txn-001",
        "wallet_id": "wallet-humanoid-a",
        "organization_id": "org-001",
        "amount": 450,
        "reference_type": "booking",
        "reference_id": "booking-001",
        "remaining_balance": 1250
    }

Phase: Phase 4.

## 62. `credit.refunded`

Payload:

    {
        "transaction_id": "txn-002",
        "wallet_id": "wallet-humanoid-a",
        "amount": 450,
        "reference_type": "booking",
        "reference_id": "booking-001",
        "reason": "BOOKING_CANCELLED"
    }

Phase: Phase 4.

## 63. `credit.balance_changed`

Payload:

    {
        "wallet_id": "wallet-humanoid-a",
        "previous_balance": 1700,
        "new_balance": 1250,
        "transaction_id": "txn-001"
    }

Phase: Phase 4.

# 64. Job Events

Job lifecycle:

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
       +--> STOPPING
       |      |
       |      v
       |   CANCELLED
       |
       v
    COMPLETED

Failure may occur from any executable state.

## 65. `job.created`

Payload:

    {
        "job_id": "job-001",
        "project_id": "project-001",
        "artifact_id": "artifact-001",
        "booking_id": "booking-001",
        "platform_id": "humanoid-a"
    }

Phase: Phase 5.

## 66. `job.queued`

Payload:

    {
        "job_id": "job-001",
        "queue_position": 3,
        "scheduled_at": "2026-10-10T10:00:00Z"
    }

Phase: Phase 5.

## 67. `job.validating`

Payload:

    {
        "job_id": "job-001",
        "artifact_id": "artifact-001",
        "checks": [
            "authorization",
            "artifact",
            "platform",
            "booking"
        ]
    }

Phase: Phase 5.

## 68. `job.allocating`

Payload:

    {
        "job_id": "job-001",
        "resource_id": "robot-001",
        "lab_id": "lab-001"
    }

Phase: Phase 5.

## 69. `job.deploying`

Payload:

    {
        "job_id": "job-001",
        "deployment_id": "deployment-001",
        "resource_id": "robot-001"
    }

Phase: Phase 5.

## 70. `job.starting`

Payload:

    {
        "job_id": "job-001",
        "run_id": "run-001",
        "resource_id": "robot-001"
    }

Phase: Phase 5.

## 71. `job.running`

Payload:

    {
        "job_id": "job-001",
        "run_id": "run-001",
        "resource_id": "robot-001",
        "started_at": "2026-10-10T10:01:00Z"
    }

Phase: Phase 5.

## 72. `job.stopping`

Payload:

    {
        "job_id": "job-001",
        "run_id": "run-001",
        "reason": "USER_REQUEST"
    }

Phase: Phase 5.

## 73. `job.completed`

Payload:

    {
        "job_id": "job-001",
        "run_id": "run-001",
        "result_id": "result-001",
        "completed_at": "2026-10-10T10:30:00Z"
    }

Phase: Phase 7.

## 74. `job.failed`

Payload:

    {
        "job_id": "job-001",
        "run_id": "run-001",
        "failure_code": "RUNTIME_UNAVAILABLE",
        "recoverable": true
    }

Phase: Phase 5.

## 75. `job.cancelled`

Payload:

    {
        "job_id": "job-001",
        "reason": "USER_REQUEST"
    }

Phase: Phase 5.

## 76. `job.timeout`

Payload:

    {
        "job_id": "job-001",
        "run_id": "run-001",
        "timeout_seconds": 1800,
        "reconciliation_required": true
    }

Phase: Phase 8.

# 77. Run Events

Run represents an actual execution instance.

Job and run must remain distinct.

A job expresses requested execution.

A run expresses actual execution.

## 78. Run Lifecycle

    CREATED
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       +--> STOPPING
       |
       +--> FAILED
       |
       v
    COMPLETED

## 79. `run.created`

Payload:

    {
        "run_id": "run-001",
        "job_id": "job-001",
        "resource_id": "robot-001"
    }

Phase: Phase 7.

## 80. `run.starting`

Payload:

    {
        "run_id": "run-001",
        "job_id": "job-001",
        "resource_id": "robot-001"
    }

Phase: Phase 7.

## 81. `run.running`

Payload:

    {
        "run_id": "run-001",
        "job_id": "job-001",
        "resource_id": "robot-001",
        "observed_at": "2026-10-10T10:01:00Z"
    }

Phase: Phase 7.

## 82. `run.telemetry`

Payload:

    {
        "run_id": "run-001",
        "observed_at": "2026-10-10T10:01:05Z",
        "samples": [
            {
                "name": "cpu_percent",
                "value": 62.4,
                "unit": "percent"
            },
            {
                "name": "battery_percent",
                "value": 87.2,
                "unit": "percent"
            }
        ]
    }

Phase: Phase 7.

High-frequency telemetry may use batching or a specialized channel.

## 83. `run.metrics.updated`

Payload:

    {
        "run_id": "run-001",
        "metrics": [
            {
                "name": "execution_time",
                "value": 125.3,
                "unit": "seconds"
            }
        ]
    }

Phase: Phase 7.

## 84. `run.logs.available`

Payload:

    {
        "run_id": "run-001",
        "count": 25,
        "cursor": "log-cursor-001"
    }

Phase: Phase 7.

The event may notify that logs exist without embedding all log lines.

## 85. `run.stopping`

Payload:

    {
        "run_id": "run-001",
        "reason": "USER_REQUEST"
    }

Phase: Phase 7.

## 86. `run.completed`

Payload:

    {
        "run_id": "run-001",
        "job_id": "job-001",
        "result_id": "result-001",
        "duration_seconds": 1800
    }

Phase: Phase 7.

## 87. `run.failed`

Payload:

    {
        "run_id": "run-001",
        "failure_code": "RUNTIME_UNAVAILABLE",
        "recoverable": true
    }

Phase: Phase 7.

## 88. `run.cancelled`

Payload:

    {
        "run_id": "run-001",
        "reason": "USER_REQUEST"
    }

Phase: Phase 7.

# 89. Result Events

## 90. `result.created`

Payload:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "status": "PROCESSING"
    }

Phase: Phase 7.

## 91. `result.processing`

Payload:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "progress_percent": 70
    }

Phase: Phase 7.

## 92. `result.available`

Payload:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "file_count": 4,
        "summary_available": true
    }

Phase: Phase 7.

## 93. `result.failed`

Payload:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "failure_code": "RESULT_PROCESSING_FAILED"
    }

Phase: Phase 7.

# 94. Lab Agent Events

Lab events describe infrastructure and execution state.

## 95. `agent.registered`

Payload:

    {
        "agent_id": "agent-001",
        "lab_id": "lab-001",
        "agent_version": "1.0.0",
        "protocol_version": "1.0"
    }

Phase: Phase 5.

## 96. `agent.online`

Payload:

    {
        "agent_id": "agent-001",
        "lab_id": "lab-001",
        "last_seen": "2026-10-08T00:00:00Z"
    }

Phase: Phase 5.

## 97. `agent.offline`

Payload:

    {
        "agent_id": "agent-001",
        "lab_id": "lab-001",
        "last_seen": "2026-10-08T00:00:00Z",
        "reason": "HEARTBEAT_TIMEOUT"
    }

Phase: Phase 5.

## 98. `agent.health_changed`

Payload:

    {
        "agent_id": "agent-001",
        "previous_state": "HEALTHY",
        "new_state": "DEGRADED",
        "details": {}
    }

Phase: Phase 6.

## 99. `agent.capabilities.updated`

Payload:

    {
        "agent_id": "agent-001",
        "platforms": [
            "humanoid-a"
        ],
        "runtimes": [
            "kritva-runtime-2"
        ],
        "capabilities": [
            "vision",
            "motion"
        ]
    }

Phase: Phase 6.

# 100. Resource Events

## 101. `resource.available`

Payload:

    {
        "resource_id": "robot-001",
        "lab_id": "lab-001",
        "platform_id": "humanoid-a"
    }

Phase: Phase 5.

## 102. `resource.reserved`

Payload:

    {
        "resource_id": "robot-001",
        "allocation_id": "allocation-001",
        "job_id": "job-001",
        "expires_at": "2026-10-10T10:30:00Z"
    }

Phase: Phase 5.

## 103. `resource.busy`

Payload:

    {
        "resource_id": "robot-001",
        "job_id": "job-001",
        "run_id": "run-001"
    }

Phase: Phase 5.

## 104. `resource.released`

Payload:

    {
        "resource_id": "robot-001",
        "allocation_id": "allocation-001"
    }

Phase: Phase 5.

## 105. `resource.maintenance`

Payload:

    {
        "resource_id": "robot-001",
        "reason": "SCHEDULED_MAINTENANCE",
        "expected_until": "2026-10-11T00:00:00Z"
    }

Phase: Phase 6.

## 106. `resource.fault`

Payload:

    {
        "resource_id": "robot-001",
        "fault_code": "MOTOR_CONTROLLER_FAULT",
        "severity": "CRITICAL"
    }

Phase: Phase 6.

# 107. Platform Events

Platform metadata changes are administrative events.

## 108. `platform.updated`

Payload:

    {
        "platform_id": "humanoid-a",
        "version": "2.0",
        "changed_fields": [
            "capabilities"
        ]
    }

Phase: Phase 6.

## 109. `platform.availability_changed`

Payload:

    {
        "platform_id": "humanoid-a",
        "availability": "LIMITED",
        "available_resources": 2
    }

Phase: Phase 4.

# 110. Project Events

## 111. `project.created`

Payload:

    {
        "project_id": "project-001",
        "organization_id": "org-001",
        "name": "Vision Experiment"
    }

Phase: Phase 1.

## 112. `project.updated`

Payload:

    {
        "project_id": "project-001",
        "version": 3,
        "changed_fields": [
            "description"
        ]
    }

Phase: Phase 1.

## 113. `project.archived`

Payload:

    {
        "project_id": "project-001",
        "archived_at": "2026-10-08T00:00:00Z"
    }

Phase: Phase 1.

# 114. Organization Events

## 115. `organization.member_added`

Payload:

    {
        "organization_id": "org-001",
        "user_id": "user-002",
        "role": "MEMBER"
    }

Phase: Phase 3.

## 116. `organization.member_removed`

Payload:

    {
        "organization_id": "org-001",
        "user_id": "user-002"
    }

Phase: Phase 3.

## 117. `organization.updated`

Payload:

    {
        "organization_id": "org-001",
        "changed_fields": [
            "name"
        ]
    }

Phase: Phase 3.

# 118. Authentication Events

## 119. `session.created`

Payload:

    {
        "user_id": "user-001",
        "session_id": "session-001",
        "expires_at": "2026-10-08T12:00:00Z"
    }

Phase: Phase 1.

## 120. `session.expiring`

Payload:

    {
        "session_id": "session-001",
        "expires_at": "2026-10-08T12:00:00Z"
    }

Phase: Phase 1.

## 121. `session.revoked`

Payload:

    {
        "session_id": "session-001",
        "reason": "USER_LOGOUT"
    }

Phase: Phase 1.

# 122. Experiment Events

## 123. `experiment.created`

Payload:

    {
        "experiment_id": "experiment-001",
        "project_id": "project-001",
        "name": "Walking Test"
    }

Phase: Phase 7.

## 124. `experiment.updated`

Payload:

    {
        "experiment_id": "experiment-001",
        "changed_fields": [
            "description"
        ]
    }

Phase: Phase 7.

## 125. `experiment.run_added`

Payload:

    {
        "experiment_id": "experiment-001",
        "run_id": "run-001"
    }

Phase: Phase 7.

## 126. `experiment.completed`

Payload:

    {
        "experiment_id": "experiment-001",
        "run_count": 10,
        "result_count": 10
    }

Phase: Phase 7.

# 127. Telemetry Event Model

Telemetry differs from ordinary business events because it may have very high
frequency.

The architecture therefore distinguishes:

    Business Event
        |
        | low/medium frequency
        v
    WebSocket Event

and:

    Telemetry Source
        |
        | high frequency
        v
    Telemetry Stream
        |
        +--> aggregation
        +--> sampling
        +--> persistence
        +--> selected WebSocket notifications

## 128. Telemetry Requirements

Telemetry messages should define:

- source;
- channel;
- observed time;
- sequence;
- value;
- unit;
- quality;
- sampling metadata where required.

## 129. Telemetry Sample

    {
        "name": "joint.left_knee.position",
        "value": 0.43,
        "unit": "radian",
        "quality": "GOOD",
        "observed_at": "2026-10-08T00:00:01.123Z"
    }

## 130. Telemetry Quality

Recommended values:

    GOOD
    DEGRADED
    INVALID
    UNKNOWN

Consumers must not treat `INVALID` telemetry as a valid measurement.

## 131. Telemetry Batching

A telemetry event may contain multiple samples:

    {
        "run_id": "run-001",
        "observed_at": "2026-10-08T00:00:02Z",
        "samples": [
            {
                "name": "cpu_percent",
                "value": 62.1,
                "unit": "percent"
            },
            {
                "name": "temperature_celsius",
                "value": 61.4,
                "unit": "celsius"
            }
        ]
    }

## 132. Telemetry Backpressure

The system must avoid unlimited telemetry buffering.

When overloaded, the system may:

- reduce sampling;
- aggregate;
- drop non-critical samples;
- prioritize safety-relevant state;
- persist selected measurements.

Dropped telemetry must not be represented as complete history.

## 133. Safety-Relevant Telemetry

Telemetry used for physical safety decisions must not rely solely on cloud
delivery.

Cloud telemetry is observational unless explicitly integrated with an approved
local safety system.

# 134. Local Studio IPC Events

Local Runtime events are scoped to the Studio session.

Examples:

    build.started
    build.progress
    build.completed
    build.failed
    test.started
    test.completed
    artifact.packaged

## 135. `build.started`

Payload:

    {
        "build_id": "build-001",
        "project_path": "/workspace/project",
        "target": "linux-arm64"
    }

Phase: Phase 1.

## 136. `build.progress`

Payload:

    {
        "build_id": "build-001",
        "progress_percent": 70,
        "current_step": "link"
    }

Phase: Phase 1.

## 137. `build.completed`

Payload:

    {
        "build_id": "build-001",
        "success": true,
        "outputs": [
            "bin/application"
        ],
        "duration_seconds": 92
    }

Phase: Phase 1.

## 138. `build.failed`

Payload:

    {
        "build_id": "build-001",
        "failure_code": "BUILD_FAILED",
        "diagnostics_count": 4
    }

Phase: Phase 1.

## 139. `test.completed`

Payload:

    {
        "test_id": "test-001",
        "passed": 128,
        "failed": 0,
        "skipped": 2
    }

Phase: Phase 1.

## 140. `artifact.packaged`

Payload:

    {
        "artifact_path": "/workspace/build/application.krv",
        "digest": "sha256:...",
        "size": 10485760
    }

Phase: Phase 2.

# 141. Event Authorization

Authorization is evaluated when establishing the subscription and must be
considered when resource visibility changes.

Example:

    User
      |
      v
    Subscribe to project-001
      |
      v
    Authorization
      |
      +--> allowed --> events
      |
      +--> denied --> subscription rejected

A user losing access must stop receiving events for the affected resource.

## 142. Event Tenant Isolation

Every tenant-scoped event carries sufficient context to enforce organization
isolation.

Example:

    context.organization_id

The server must never broadcast tenant-scoped events globally.

# 143. Event Filtering

Filtering may be based on:

- event type;
- resource;
- project;
- organization;
- platform;
- lab;
- job;
- run.

Filtering must occur server-side where required for security.

Client-side filtering alone is insufficient for tenant isolation.

# 144. Event Schema Versioning

Events include:

    protocol_version

Individual event payload schemas may also carry a schema version if necessary.

Breaking payload changes require a versioned compatibility strategy.

# 145. Event Evolution

Compatible changes include:

- adding optional fields;
- adding optional metadata;
- adding new event types.

Breaking changes include:

- removing required fields;
- changing field meaning;
- changing field types;
- changing event semantics.

# 146. Event Deprecation

Deprecated events require:

- documentation;
- replacement event;
- compatibility period;
- migration guidance;
- retirement date or release target.

An event must not silently change meaning.

# 147. Event Persistence

The Control Plane may implement an outbox/event-store mechanism:

    Domain Transaction
         |
         +--> Business State
         |
         +--> Outbox Event
                |
                v
             Publisher
                |
                v
             WebSocket

The exact infrastructure implementation is separate from the event contract.

# 148. Transactional Event Rule

For business-critical events:

> The event must not be published as successful if the corresponding durable state transaction did not commit.

The outbox pattern is recommended where required to guarantee this property.

# 149. Event Publication Failure

If event publication fails after business state commits:

    Durable State = committed
    Event = not yet published

The publisher must retry.

The event must not be recreated with a different business identity unless the
contract explicitly permits it.

# 150. Event Consumer Failure

If a consumer fails:

    Event
      |
      v
    Consumer
      |
      X
    Processing failure

The event may be redelivered.

The consumer must use event IDs and idempotent processing.

# 151. Event Ordering Failure

If events arrive out of order:

    sequence=15
    sequence=14

The consumer should not blindly overwrite state.

It should:

- detect the sequence relationship;
- ignore stale events where safe;
- request replay;
- query authoritative state if necessary.

# 152. Event Replay Failure

If requested replay is outside retention:

    REPLAY_NOT_AVAILABLE

The client must perform a current-state query.

Example:

    GET /api/v1/jobs/job-001

# 153. Event Reconciliation

For execution events:

    WebSocket Events
          |
          v
    Local UI State
          |
          X
    Connection Lost
          |
          v
    REST Current State
          |
          v
    Reconciled UI State

The UI must never assume that event history is complete.

# 154. Job/Run Relationship

Job events and run events are intentionally separate.

    Job
      |
      v
    Run
      |
      v
    Result

Job events describe scheduling and execution intent.

Run events describe actual execution.

Result events describe produced output.

# 155. Booking/Job Relationship

The lifecycle is:

    Booking
       |
       v
    Job
       |
       v
    Run
       |
       v
    Result

Booking events must not imply that execution occurred.

Job events must not imply successful results.

Run events must not imply result availability until the result event occurs.

# 156. Artifact/Job Relationship

An accepted artifact may be used by multiple jobs.

    Artifact
       |
       +--> Job 001
       |
       +--> Job 002
       |
       +--> Job 003

Artifact events therefore describe artifact lifecycle independently of job
events.

# 157. Event Flow — Complete Execution

    artifact.accepted
            |
            v
    booking.confirmed
            |
            v
    job.created
            |
            v
    job.queued
            |
            v
    job.validating
            |
            v
    job.allocating
            |
            v
    job.deploying
            |
            v
    job.starting
            |
            v
    run.created
            |
            v
    run.running
            |
            +--> run.telemetry
            +--> run.metrics.updated
            +--> run.logs.available
            |
            v
    run.completed
            |
            v
    result.created
            |
            v
    result.processing
            |
            v
    result.available
            |
            v
    job.completed

# 158. Event Flow — Failure

    job.running
        |
        v
    run.running
        |
        v
    runtime failure
        |
        v
    run.failed
        |
        v
    job.failed
        |
        v
    resource.released

The exact sequence depends on the failure and reconciliation state.

# 159. Event Flow — User Stop

    job.running
        |
        | job.stop
        v
    job.stopping
        |
        v
    run.stopping
        |
        v
    run.cancelled
        |
        v
    job.cancelled
        |
        v
    resource.released

This is an application/job stop, not a physical emergency stop.

# 160. Event Flow — Lab Disconnect

    job.running
        |
        v
    agent.offline
        |
        v
    Control Plane detects uncertainty
        |
        v
    Reconciliation
        |
        +--> run still active
        |
        +--> run completed
        |
        +--> run failed
        |
        +--> resource fault
        |
        v
    authoritative state

# 161. Event Flow — Studio Disconnect

    Studio
       |
       X
    WebSocket lost
       |
       v
    Job continues remotely
       |
       v
    Studio reconnects
       |
       v
    Replay if available
       |
       v
    REST state query
       |
       v
    Current job/run state

The user interface connection does not control whether the remote job exists.

# 162. Event Flow — Lab Registration

    Lab Agent
       |
       | agent.register
       v
    Control Plane
       |
       v
    agent.registered
       |
       v
    agent.online
       |
       v
    capabilities/resources
       |
       v
    platform availability

# 163. Event Flow — Resource Allocation

    resource.available
          |
          v
    resource.reserved
          |
          v
    resource.busy
          |
          v
    resource.released
          |
          v
    resource.available

Unexpected transitions should create diagnostic events or reconciliation
conditions.

# 164. Event Flow — Credits

    booking.confirmed
          |
          v
    credit.consumed
          |
          v
    execution
          |
          +--> booking.cancelled
                    |
                    v
              credit.refunded

Credit events are financially authoritative and auditable.

# 165. Phase Mapping

| Phase | Event Work | Primary Events |
|---|---|---|
| Phase 0 | Event foundation | Envelope, IDs, sequence |
| Phase 1 | Studio | project/build/session events |
| Phase 2 | Artifact | artifact lifecycle |
| Phase 3 | Control Plane | domain resource events |
| Phase 4 | Commercial | booking/credit events |
| Phase 5 | Execution | job/lab/resource events |
| Phase 6 | Physical Robot | agent/platform/resource events |
| Phase 7 | Live/Results | run/telemetry/result/experiment |
| Phase 8 | Production | replay, governance, observability |

# 166. Phase 0 — Event Foundation

Implement:

- common envelope;
- event IDs;
- naming;
- resource references;
- correlation;
- sequence semantics;
- schema registry/contracts.

Acceptance:

- event schemas validate;
- event naming is stable;
- duplicate handling is documented.

# 167. Phase 1 — Studio

Implement:

- session events;
- project events;
- build events;
- test events;
- local artifact packaging events;
- WebSocket foundation.

Acceptance:

- Studio receives local and remote lifecycle updates;
- reconnect behavior is defined.

# 168. Phase 2 — Artifact

Implement:

- artifact lifecycle events;
- validation events;
- acceptance/rejection events.

Acceptance:

- artifact state transitions are observable;
- validation completion is explicit;
- rejected artifacts expose stable reason codes.

# 169. Phase 3 — Control Plane

Implement:

- organization events;
- project events;
- platform events;
- durable event publication.

Acceptance:

- tenant filtering works;
- event publication follows committed state;
- audit correlation exists.

# 170. Phase 4 — Commercial

Implement:

- booking events;
- credit events;
- availability events.

Acceptance:

- booking lifecycle is observable;
- credit changes are durable;
- financial events are auditable.

# 171. Phase 5 — Execution

Implement:

- job lifecycle events;
- Lab Agent events;
- resource events;
- deployment events.

Acceptance:

- execution lifecycle is observable;
- job and resource states are recoverable;
- agent disconnect is detectable.

# 172. Phase 6 — Physical Robot

Implement:

- agent health;
- resource health;
- platform changes;
- runtime events;
- safety-aware state notifications.

Acceptance:

- physical state is distinguishable from application state;
- cloud disconnect does not imply safety state.

# 173. Phase 7 — Live and Results

Implement:

- run events;
- telemetry;
- metrics;
- logs;
- result lifecycle;
- experiment events.

Acceptance:

- live observation works;
- telemetry is bounded;
- result lifecycle is traceable;
- partial telemetry is explicit.

# 174. Phase 8 — Production

Implement:

- replay;
- event retention;
- event monitoring;
- delivery metrics;
- compatibility validation;
- operational alerting.

Acceptance:

- reconnect/replay works;
- event loss is recoverable;
- event delivery health is measurable.

# 175. Event Catalogue Summary

| Domain | Event Count / Category | Primary Phase |
|---|---|---|
| Session | 3 | 1 |
| Project | 3 | 1 |
| Organization | 3 | 3 |
| Artifact | 6 | 2 |
| Booking | 6 | 4–5 |
| Credit | 3 | 4 |
| Platform | 2 | 4–6 |
| Job | 11 | 5–8 |
| Run | 9 | 7 |
| Result | 4 | 7 |
| Agent | 4 | 5–6 |
| Resource | 6 | 5–6 |
| Experiment | 4 | 7 |
| Telemetry | Stream category | 7 |
| Local IPC | 6 | 1–2 |

# 176. Complete Event Name Catalogue

    session.created
    session.expiring
    session.revoked

    organization.updated
    organization.member_added
    organization.member_removed

    project.created
    project.updated
    project.archived

    platform.updated
    platform.availability_changed

    artifact.created
    artifact.uploaded
    artifact.validating
    artifact.accepted
    artifact.rejected
    artifact.revoked

    booking.created
    booking.confirmed
    booking.modified
    booking.cancelled
    booking.started
    booking.completed

    credit.consumed
    credit.refunded
    credit.balance_changed

    job.created
    job.queued
    job.validating
    job.allocating
    job.deploying
    job.starting
    job.running
    job.stopping
    job.completed
    job.failed
    job.cancelled
    job.timeout

    run.created
    run.starting
    run.running
    run.telemetry
    run.metrics.updated
    run.logs.available
    run.stopping
    run.completed
    run.failed
    run.cancelled

    result.created
    result.processing
    result.available
    result.failed

    agent.registered
    agent.online
    agent.offline
    agent.health_changed
    agent.capabilities.updated

    resource.available
    resource.reserved
    resource.busy
    resource.released
    resource.maintenance
    resource.fault

    experiment.created
    experiment.updated
    experiment.run_added
    experiment.completed

    build.started
    build.progress
    build.completed
    build.failed
    test.completed
    artifact.packaged

# 177. Event Security

Events must never be broadcast without authorization.

Security controls include:

- authenticated WebSocket sessions;
- subscription authorization;
- tenant isolation;
- resource-level access;
- Lab Agent identity;
- event filtering;
- payload minimization.

# 178. Sensitive Event Data

Events must not contain:

- passwords;
- access tokens;
- private keys;
- secrets;
- unrestricted source code;
- cloud credentials.

If an event indicates that sensitive data exists, the consumer should retrieve
it through an authorized API.

# 179. Event Payload Minimization

Example:

Prefer:

    {
        "event": "run.logs.available",
        "data": {
            "run_id": "run-001",
            "cursor": "cursor-001"
        }
    }

over embedding thousands of log lines in the event.

Events should notify; APIs and dedicated streams should retrieve large data.

# 180. Event Size Limits

Production systems should impose limits on:

- event size;
- telemetry batch size;
- subscription rate;
- event frequency.

Large payloads should use references to object storage or query APIs.

# 181. Event Performance

Metrics should include:

- publication latency;
- delivery latency;
- event throughput;
- dropped events;
- duplicate rate;
- replay requests;
- replay failures;
- WebSocket disconnects;
- subscription count.

# 182. Event Health

Operational dashboards should expose:

    events_published_total
    events_delivered_total
    events_failed_total
    events_replayed_total
    websocket_connections
    websocket_disconnects
    event_delivery_latency
    event_consumer_lag

Exact metric names are implementation details.

# 183. Event Backpressure

When consumers cannot keep up:

    Producer
       |
       v
    Event Queue
       |
       v
    Consumer
       |
       X
    Slow

The platform should use bounded queues and defined policies.

For telemetry, dropping or sampling non-critical data may be acceptable.

For business events, loss must be recoverable.

# 184. Event Retry

Publisher retry should be used for transient publication failures.

Consumer retry should be bounded and idempotent.

A permanently malformed event should not create an infinite retry loop.

# 185. Dead-Letter Handling

Failed event processing may be moved to a dead-letter mechanism.

Dead-letter records should include:

- event ID;
- event type;
- consumer;
- failure reason;
- attempt count;
- timestamp.

Critical business events require operational alerting when dead-lettered.

# 186. Event Compatibility Testing

CI should verify:

- schema validity;
- required fields;
- enum compatibility;
- payload compatibility;
- event naming;
- version compatibility.

Removing a required field must fail compatibility checks.

# 187. Consumer Compatibility

Consumers must:

- ignore unknown optional fields;
- tolerate new event types;
- handle duplicate events;
- handle out-of-order events;
- recover after reconnect;
- avoid relying on human-readable messages.

# 188. Event Contract Ownership

| Contract | Owner |
|---|---|
| Project events | Project module |
| Artifact events | Artifact module |
| Booking events | Booking module |
| Credit events | Credit module |
| Job events | Job module |
| Run events | Run module |
| Result events | Result module |
| Agent events | Lab module |
| Resource events | Lab/Resource module |
| Experiment events | Experiment module |
| Build events | Local Runtime |

The platform protocol team governs cross-domain conventions.

# 189. Event Schema Location

Shared event contracts belong in:

    packages/contracts/

Recommended organization:

    packages/contracts/
        events/
            common/
            session/
            organization/
            project/
            platform/
            artifact/
            booking/
            credit/
            job/
            run/
            result/
            experiment/
            lab/
            resource/
            local/

The exact source format is an implementation decision.

# 190. Event Testing Strategy

Each event should have:

- schema test;
- serialization test;
- producer test;
- consumer test;
- authorization test where applicable;
- compatibility test;
- duplicate test;
- ordering test where required.

# 191. Event End-to-End Test

Example:

    job.start
       |
       v
    job.queued
       |
       v
    job.validating
       |
       v
    job.deploying
       |
       v
    job.running
       |
       v
    run.running
       |
       v
    run.completed
       |
       v
    result.available
       |
       v
    job.completed

The test should verify:

- event order;
- resource IDs;
- correlation;
- authorization;
- terminal state;
- reconnect recovery.

# 192. Event Replay Test

Test scenario:

    receive sequence 100
       |
       X
    disconnect
       |
       v
    reconnect
       |
       v
    replay from 101
       |
       v
    receive 101..110
       |
       v
    query current state
       |
       v
    synchronized

# 193. Duplicate Event Test

Test:

    evt-100
    evt-100

Expected:

    process first
    ignore second

No duplicate financial, execution, or resource side effect may occur.

# 194. Out-of-Order Test

Test:

    sequence 101
    sequence 103
    sequence 102

Expected:

- detect gap;
- request replay or state synchronization;
- avoid regressing state.

# 195. Authorization Test

A user subscribed to:

    project-001

must not receive:

    project-002

events unless separately authorized.

# 196. Tenant Isolation Test

Events from:

    organization-A

must never be delivered to a subscription authorized only for:

    organization-B

# 197. Lab Isolation Test

A Lab Agent should only receive commands/events applicable to its registered
lab and authorized resources.

# 198. Event and Physical Safety

Events do not constitute physical safety controls.

For example:

    robot.e_stop_state_changed

may be informational, but the actual E-stop must remain implemented through
approved local safety mechanisms.

Cloud event delay must never create an unsafe robot state.

# 199. Event and Source-Code Protection

Events must not leak customer source code.

Build and artifact events may expose:

- artifact ID;
- digest;
- target;
- status;
- validation results.

They should not expose the customer's complete source tree.

# 200. Event and Commercial State

Credit events are authoritative business records.

A UI must not calculate final credit balance solely from transient WebSocket
events.

The current balance should be retrieved from the authoritative API.

# 201. Event and Booking State

Booking events notify changes.

The booking API remains authoritative for:

- slot;
- resource;
- duration;
- cancellation;
- refund state.

# 202. Event and Job State

Job events provide realtime lifecycle updates.

The job resource remains authoritative.

A missing `job.running` event does not mean the job did not run.

# 203. Event and Run State

Run events provide observation.

The run resource remains authoritative for:

- state;
- timestamps;
- resource;
- result relationship.

# 204. Event and Result State

`result.available` means the result is available according to the result service.

The event should not embed large result files.

Consumers retrieve files through:

    result.files
    result.download

# 205. Event and Experiment State

Experiment events provide aggregate notifications.

Experiment APIs remain authoritative for:

- associated runs;
- result sets;
- metadata;
- experiment state.

# 206. Event and API Boundary

The architectural relationship is:

    Command
       |
       v
    REST API
       |
       v
    Durable State
       |
       v
    Event
       |
       v
    WebSocket

Events therefore complement, rather than replace, the API.

# 207. Event and Lab Boundary

The relationship is:

    Control Plane
       |
       | command
       v
    Lab Agent
       |
       | observed state
       v
    Control Plane
       |
       v
    event
       |
       v
    Studio

This separates command authority from observed physical state.

# 208. Open Questions

1. What exact WebSocket library will be used?
2. Will event replay be backed by an event store or outbox history?
3. What exact replay retention period is required?
4. Will sequence numbers be generated per resource or per subscription stream?
5. Should events use monotonically increasing numeric sequences or opaque cursors?
6. What exact WebSocket subscription syntax will be standardized?
7. Should wildcard subscriptions be allowed for normal users?
8. What maximum event rate should a client receive?
9. What telemetry rates are expected from physical robots?
10. Which telemetry should be persisted?
11. Should telemetry use a dedicated streaming protocol?
12. Which events require durable audit records?
13. Which events may be ephemeral?
14. Should every event include `correlation.operation_id`?
15. Should every event include `actor`?
16. What is the exact event retention policy by category?
17. What dead-letter system will be used?
18. What replay authorization model will be used?
19. What event versioning policy applies to payload-only changes?
20. How will Lab Agent clock skew be handled?
21. Which event types require strict ordering?
22. Which event types can be dropped under backpressure?
23. What exact video control events are required?
24. Should robot safety events be a separate protocol?
25. Should experiment aggregation events be generated by the Control Plane or
    derived by clients?
26. What production SLO applies to event delivery latency?
27. What is the maximum reconnect storm protection?
28. Should event subscriptions survive authentication token refresh?
29. How should subscription state be recovered after server restart?
30. What is the exact contract for event schema registry governance?

# 209. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Event loss | Critical | Durable state + replay/recovery |
| Duplicate events | High | Event ID deduplication |
| Out-of-order events | High | Sequence + replay |
| Unauthorized events | Critical | Subscription authorization |
| Tenant leakage | Critical | Server-side filtering |
| Event storm | High | Rate limits/backpressure |
| Telemetry overload | High | Sampling/aggregation |
| Event schema drift | High | Shared contracts |
| Replay abuse | Medium | Authorization + limits |
| Consumer failure | High | Retry/dead-letter |
| Stale UI | High | REST state reconciliation |
| Financial event loss | Critical | Durable ledger |
| Job event loss | Critical | Durable job/run state |
| Lab disconnect | Critical | Reconciliation |
| Safety misunderstanding | Critical | Local safety authority |
| Large event payload | High | References/streaming |
| Version incompatibility | High | Protocol versioning |

# 210. Risk — Event as Source of Truth

Using WebSocket event delivery as the authoritative state store creates
incorrect behavior when events are lost.

Mitigation:

> REST and durable Control Plane state remain authoritative.

# 211. Risk — Telemetry Overload

High-frequency robot telemetry can overwhelm:

- Lab Agent;
- network;
- Control Plane;
- WebSocket;
- browser;
- storage.

Mitigation:

- sampling;
- aggregation;
- batching;
- rate limits;
- specialized telemetry storage;
- priority classes.

# 212. Risk — Replay Storm

Many clients reconnect simultaneously after an outage.

Mitigation:

- bounded replay;
- backoff;
- reconnect jitter;
- subscription limits;
- state synchronization endpoints;
- server-side rate limits.

# 213. Risk — Duplicate Financial Processing

A duplicate `credit.consumed` event must not create a second ledger entry.

Mitigation:

- immutable transaction ID;
- unique business reference;
- event ID;
- idempotent consumer.

# 214. Risk — Duplicate Execution State

A duplicate `job.running` event must not start a second job.

Events are notifications only.

Execution is controlled through commands and durable state.

# 215. Risk — Lab Clock Skew

Agent timestamps may differ from Control Plane time.

Mitigation:

- server receipt timestamp;
- observed timestamp;
- synchronization monitoring;
- explicit distinction between `timestamp` and `observed_at`.

# 216. Final Event Architecture Baseline

The Kritva RaaS event architecture establishes the following invariant:

> **Events are immutable, authorized notifications of occurrences or state transitions; durable resource state remains authoritative.**

The complete event flow is:

    Command
       |
       v
    Domain Service
       |
       v
    Durable State
       |
       v
    Event Publication
       |
       +--> WebSocket
       |
       +--> Lab Channel
       |
       +--> Operational Consumers
       |
       v
    Client / Agent

The event model guarantees:

1. Every event has a stable name.
2. Every event has a unique ID.
3. Every event identifies its primary resource.
4. Events carry protocol version information.
5. Relevant events carry sequence information.
6. Events support request and operation correlation.
7. WebSocket delivery is at-least-once.
8. Consumers tolerate duplicates.
9. Resource-level ordering is supported where required.
10. Replay is available where retention permits.
11. State synchronization remains available through REST.
12. Unauthorized events are never delivered.
13. Tenant isolation is enforced server-side.
14. Business-critical events are recoverable from durable state.
15. High-frequency telemetry is subject to bounded delivery policies.
16. Large payloads are transferred through appropriate data channels.
17. Event schema evolution is controlled.
18. Event publication follows committed business state.
19. Physical safety remains independent of event delivery.
20. Event loss cannot silently corrupt authoritative business state.

The event architecture supports the complete Kritva RaaS execution lifecycle:

    Artifact Accepted
          |
          v
    Booking Confirmed
          |
          v
    Job Queued
          |
          v
    Job Validating
          |
          v
    Job Deploying
          |
          v
    Job Running
          |
          v
    Run Running
          |
          +--> Telemetry
          +--> Metrics
          +--> Logs
          |
          v
    Run Completed
          |
          v
    Result Available
          |
          v
    Job Completed

This provides the realtime protocol foundation for:

> **Build locally. Book remotely. Run on real robots. Observe live. Analyze results. Rerun.**
