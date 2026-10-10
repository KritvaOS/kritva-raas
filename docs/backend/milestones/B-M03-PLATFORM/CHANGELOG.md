# B-M03-PLATFORM — Changelog

Milestone: B-M03 — Platform

# 11 Changelog

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

- Initial B-M03 milestone dossier.
- No implementation is implied by this document.
- Platform is a logical catalog entity.
- Robot is a physical identity.
- Resource is an allocatable operational unit.
- Lab contains operational resources.
- Compatibility is server-authoritative.
- WebSocket is an observation/event transport, not authoritative state.
- WebSocket connectivity does not define physical robot safety.
- Physical safety remains local and authoritative.

---

# Appendix A — Phase Mapping

## Phase 0 — FOUNDATION

B-M03 consumes:

- API foundation;
- database foundation;
- authentication;
- authorization;
- testing;
- WebSocket runtime prerequisites.

## Phase 1 — STUDIO

B-M03 extends B-M01 with:

- platform catalog;
- capabilities;
- platform configuration;
- operational catalog foundations.

## Phase 2 — BUILD & ARTIFACT

B-M03 is a primary backend milestone for:

- platform discovery;
- resource discovery;
- compatibility;
- availability foundations.

## Phase 3 — CONTROL PLANE

B-M03 provides:

- execution target identity;
- resource state;
- compatibility;
- WebSocket event infrastructure.

## Phase 4 — BOOKING & COMMERCIAL

B-M03 supports:

- resource allocation;
- credit calculation inputs;
- platform-specific credit type;
- operational capacity.

## Phase 5 — EXECUTION

B-M03 expands to:

- physical labs;
- real robots;
- Lab Agent state;
- runtime status;
- hardware-specific resources.

## Phase 6 — LAB & ROBOT

B-M03 gains:

- hardened WebSocket security;
- stronger platform governance;
- audit monitoring;
- operational access controls.

## Phase 7 — LIVE & RESULTS

B-M03 evolves toward:

- large resource fleets;
- high-volume status streams;
- distributed WebSocket infrastructure;
- connection scaling;
- operational monitoring.

## Phase 8 — PRODUCTION

Platform, lab, robot, resource and WebSocket services become part of the
production RaaS operating environment.

---

# Appendix B — Platform Architecture

    +-----------------------------+
    |      Platform Catalog       |
    +--------------+--------------+
                   |
                   v
          +----------------+
          | Platform       |
          +--------+-------+
                   |
                   v
          +----------------+
          | Platform       |
          | Version        |
          +---+--------+---+
              |        |
              v        v
        Architecture  Runtime
              |
              +------> SDK
              |
              +------> Capabilities
              |
              +------> Configurations

The platform catalog defines what can be supported.

---

# Appendix C — Operational Architecture

    Platform
       |
       v
      Lab
       |
    +--+-------------------+
    |                      |
    v                      v
   Robot                Simulator
    |                      |
    v                      v
 Resource               Resource
    |                      |
    +----------+-----------+
               |
               v
        Booking / Job

The same Resource abstraction permits physical and simulated execution while
preserving different operational policies.

---

# Appendix D — Robot vs Resource

| Attribute | Robot | Resource |
|---|---|---|
| Identity | Physical identity | Allocatable identity |
| Lifecycle | Physical lifecycle | Operational lifecycle |
| Fault | Robot fault | Resource fault |
| Booking | Indirect | Direct |
| Allocation | No | Yes |
| Historical identity | Required | Required |
| Physical hardware | Yes | References robot |
| Simulator equivalent | No | Yes |

A Robot may exist while its Resource is temporarily unavailable.

---

# Appendix E — Lab Model

    Lab
      |
      +--> State
      |
      +--> Organization ownership
      |
      +--> Location metadata
      |
      +--> Robots
      |
      +--> Simulators
      |
      +--> Resources
      |
      +--> Maintenance
      |
      +--> Availability

Lab state is operational context.

Lab state is not physical safety state.

---

# Appendix F — Resource State Model

    PROVISIONING
          |
          v
      AVAILABLE
       /  |   \
      /   |    \
     v    v     v
 RESERVED BUSY MAINTENANCE
     |     |
     +--+--+
        |
        v
      AVAILABLE

Alternative states:

    OFFLINE
    FAULT
    RETIRED

Transitions must be controlled by operational services.

---

# Appendix G — Availability Model

Conceptually:

    Available(resource, time) =
        resource.state permits use
        AND lab.state permits use
        AND no active maintenance
        AND availability window permits use
        AND no conflicting booking
        AND capacity permits use
        AND platform eligibility permits use
        AND policy permits use

B-M03 establishes the inputs.

B-M04 owns authoritative booking confirmation.

---

# Appendix H — Compatibility Architecture

    Artifact Manifest
           |
           v
    Compatibility Service
           |
      +----+----+
      |         |
      v         v
 Platform     Resource
 Catalog      Configuration
      |         |
      +----+----+
           |
           v
    Compatibility Result

Example:

    Artifact:
      arm64
      SDK 1.0
      vision

    Target:
      arm64
      SDK 1.0
      vision

    Result:
      COMPATIBLE

---

# Appendix I — Compatibility Decision Matrix

| Check | Pass | Failure |
|---|---|---|
| Platform | Continue | Incompatible |
| Platform Version | Continue | Incompatible |
| Architecture | Continue | Incompatible |
| Runtime | Continue | Incompatible |
| SDK | Continue | Incompatible |
| Required Capability | Continue | Incompatible |
| Configuration | Continue | Incompatible |
| Artifact Status | Continue | Not Eligible |
| Resource State | Continue | Not Currently Eligible |

Compatibility and current resource availability are distinct decisions.

---

# Appendix J — WebSocket Architecture

    +------------------+
    |      Studio      |
    +--------+---------+
             |
             | WebSocket
             v
    +------------------+
    | WebSocket Gateway|
    +--------+---------+
             |
       +-----+-----+
       |           |
       v           v
    AuthZ      Subscription
       |           |
       +-----+-----+
             |
             v
        Event Router
             |
       +-----+------+
       |            |
       v            v
    Job/Run      Resource
    Events       Events
       |            |
       +------+-----+
              |
              v
           Client

The gateway delivers events but does not own domain truth.

---

# Appendix K — WebSocket Event Envelope

Conceptual event:

    {
        "protocol_version": "1.0",
        "event_id": "evt-001",
        "timestamp": "2026-10-08T20:00:02Z",
        "event": "resource.status_changed",
        "resource": {
            "type": "resource",
            "id": "resource-001"
        },
        "context": {
            "organization_id": "org-001"
        },
        "sequence": 1001,
        "correlation": {
            "trace_id": "trace-001",
            "span_id": "span-001"
        },
        "metadata": {},
        "data": {
            "from": "AVAILABLE",
            "to": "BUSY"
        }
    }

---

# Appendix L — Subscription Architecture

    Client
      |
      v
    Connect
      |
      v
    Authenticate
      |
      v
    Authorize
      |
      v
    Subscribe
      |
      v
    Topic Registry
      |
      v
    Event Stream

Topics should be resource-scoped or domain-scoped with explicit authorization.

Examples:

    resource:resource-001
    lab:lab-001
    project:project-001
    job:job-001
    run:run-001

The exact topic naming convention must be versioned.

---

# Appendix M — Reconnect Architecture

    WebSocket Lost
          |
          v
    Mark Connection Degraded
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
    Restore Subscriptions
          |
          v
    Fetch Durable Snapshot
          |
          v
    Compare Sequence
          |
       +--+--+
       |     |
      Gap   No Gap
       |     |
       v     v
    Resync  Resume
       |
       v
     Resume

Reconnect must not issue:

- start;
- stop;
- restart;
- reset;
- safety commands.

---

# Appendix N — WebSocket Failure Independence

The following failures are independent:

    Video Failure
        != Run Failure

    WebSocket Failure
        != Run Failure

    Telemetry Failure
        != Robot Stop

    Log Stream Failure
        != Job Failure

    Cloud Disconnect
        != Physical Safety State

The execution/runtime layer remains authoritative for actual execution and
safety.

---

# Appendix O — Heartbeat Semantics

Heartbeat establishes:

> Is this communication channel responsive?

It does not establish:

> Is the robot safe?

or:

> Is the robot healthy?

Therefore:

    heartbeat = PASS
        !=
    robot_health = HEALTHY

Safety and robot-health data require their own authoritative source.

---

# Appendix P — Backpressure Model

    Event Source
         |
         v
    Event Queue
         |
      bounded
         |
         v
    Subscription
         |
         v
    Connection Queue
         |
         v
       Client

If a client cannot consume events:

1. coalesce where semantics permit;
2. drop non-authoritative transient updates where explicitly allowed;
3. retain durable state;
4. signal sequence/recovery requirements;
5. disconnect if necessary to protect the system.

Critical durable state must always be recoverable through snapshot retrieval.

---

# Appendix Q — Audit Events

Recommended platform events:

    platform.created
    platform.updated
    platform.deprecated
    platform.retired
    platform_version.created
    capability.updated
    platform_configuration.updated

Recommended operational events:

    lab.created
    lab.status_changed
    robot.created
    robot.status_changed
    resource.created
    resource.status_changed
    maintenance.created
    maintenance.activated
    maintenance.completed

Administrative actions must remain auditable.

---

# Appendix R — Operational Metrics

Control Plane metrics should include:

- platform count;
- active platform versions;
- capability count;
- lab count;
- robot count;
- resource count;
- resource state distribution;
- fault count;
- maintenance count;
- compatibility requests;
- compatibility failures;
- WebSocket connection count;
- subscription count;
- connection failures;
- reconnect rate;
- event delivery latency;
- event queue depth;
- backpressure events;
- WebSocket authorization failures.

---

# Appendix S — Security Boundary

    Internet
       |
       v
    TLS
       |
       v
    WebSocket Gateway
       |
       v
    Authentication
       |
       v
    Authorization
       |
       v
    Subscription
       |
       v
    Event Router
       |
       v
    Domain Events

No event should be delivered merely because a client knows an object ID.

Object identity is not authorization.

---

# Appendix T — Open Questions

1. Are all Labs globally managed or can customers create private Labs?
2. Which Lab fields are customer-visible?
3. Can one Robot move between Labs?
4. Can a Robot change Platform identity?
5. Can a Resource be reassigned between Robots?
6. Which Resource types are P0?
7. Are GPU and workstation resources included in the first production release?
8. What is the exact resource capacity model?
9. Can a Resource support multiple concurrent Jobs?
10. Which resources are exclusive?
11. What is the authoritative real-time resource-state source?
12. How does Lab Agent state map to Resource state?
13. How quickly must Resource state propagate?
14. What is the stale-state threshold?
15. Are availability windows recurring?
16. How are timezone rules represented?
17. What happens during emergency maintenance?
18. Can maintenance override an active booking?
19. How is physical robot fault represented?
20. Can a faulted robot automatically return to AVAILABLE?
21. What human approval is required after fault?
22. Which platform attributes are immutable?
23. Which Platform Version changes require a new version?
24. Can a platform version be retired while existing bookings remain?
25. How are deprecated platforms presented to users?
26. Which capabilities are mandatory for each platform?
27. How are optional capabilities represented?
28. How are capability version requirements represented?
29. How are platform configurations versioned?
30. What exact configuration fields participate in compatibility?
31. Can compatibility be cached?
32. What is the cache invalidation strategy?
33. What compatibility evidence must be retained?
34. Should compatibility results be persisted or calculated on demand?
35. Which WebSocket topics are P0?
36. What is the maximum connection count for initial deployment?
37. What is the maximum subscriptions per connection?
38. Which events require durable replay?
39. What is the event retention period?
40. Should WebSocket infrastructure use a message broker from the first
    production release?
41. What is the maximum event size?
42. What is the maximum per-client event rate?
43. Which telemetry signals may be coalesced?
44. Which events must never be dropped?
45. What is the exact reconnect backoff policy?
46. What snapshot endpoint is authoritative for each topic?
47. How are authorization changes propagated to existing connections?
48. Should an authorization change terminate active subscriptions?
49. How is multi-instance WebSocket fan-out implemented?
50. What is the production connection-distribution strategy?
51. What observability data is retained for WebSocket connections?
52. What physical safety signals may be exposed through the WebSocket layer?
53. How is stale safety data represented?
54. Which Lab Agent protocol version maps to each Resource version?
55. How are platform/resource historical snapshots retained?

Open questions must be converted into explicit decisions before they become
architecture or implementation assumptions.

---

# Appendix U — Definition of Done

B-M03 is Done when the following flow is demonstrable:

    Platform
       |
       v
    Platform Version
       |
       v
    Capabilities
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
    Compatibility
       |
       v
    WebSocket Connection
       |
       v
    Authorized Subscription
       |
       v
    Live Resource Event
       |
       v
    Disconnect
       |
       v
    Reconnect
       |
       v
    Snapshot + Resync
       |
       v
    Continue

The system must preserve durable state throughout the complete failure and
recovery flow.

---

# Appendix V — Final Milestone Invariants

1. Platform is a logical catalog entity.
2. Platform Version is versioned.
3. Architecture is explicit.
4. Runtime compatibility is explicit.
5. SDK compatibility is explicit.
6. Capabilities are globally defined.
7. Platform-version capability support is explicit.
8. Platform configuration is bounded and versioned where required.
9. Lab is operational context.
10. Robot is physical identity.
11. Resource is allocatable identity.
12. Robot and Resource are distinct.
13. Resource type is explicit.
14. Resource lifecycle is explicit.
15. Lab lifecycle is explicit.
16. Robot lifecycle is explicit.
17. Maintenance affects availability.
18. Availability does not equal booking confirmation.
19. Booking remains authoritative for confirmed allocation.
20. Compatibility is server-authoritative.
21. Compatibility considers platform.
22. Compatibility considers version.
23. Compatibility considers architecture.
24. Compatibility considers runtime.
25. Compatibility considers SDK.
26. Compatibility considers required capabilities.
27. Compatibility considers configuration where applicable.
28. Incompatible artifacts cannot become execution eligible.
29. WebSocket is a delivery mechanism.
30. PostgreSQL/durable services remain authoritative.
31. WebSocket connections require authentication.
32. WebSocket subscriptions require authorization.
33. Tenant isolation applies to WebSocket topics.
34. Event IDs support deduplication.
35. Sequence numbers support gap detection.
36. Reconnect includes snapshot resynchronization.
37. WebSocket disconnect does not imply robot failure.
38. WebSocket disconnect does not imply safety state.
39. WebSocket reconnect does not restart execution.
40. Heartbeat measures communication health, not robot safety.
41. Backpressure prevents unbounded resource consumption.
42. Critical state remains recoverable.
43. Physical safety remains local and authoritative.
44. Platform/resource administrative operations are auditable.
45. Historical platform/resource identities remain traceable.
46. B-M03 provides stable contracts for Booking, Execution and Live milestones.
47. Completion requires implementation, tests, security review, architecture
    review and acceptance evidence.

# Appendix W — Milestone Principle

> B-M03 establishes the authoritative robotic-world model of Kritva RaaS.
> Platforms describe what can be supported; Platform Versions define the
> versioned execution contract; capabilities describe supported functions;
> Labs describe operational environments; Robots identify physical machines;
> and Resources identify allocatable execution units. Compatibility connects
> the software artifact to the target platform and resource without relying on
> frontend assumptions. The milestone also establishes WebSocket as a secure,
> authenticated and authorized observation/event transport for later live
> execution. WebSocket connectivity is never treated as the source of truth:
> durable state remains authoritative, events are at-least-once, sequence gaps
> trigger resynchronization, and reconnect does not alter execution or physical
> safety. This foundation allows Kritva RaaS to progress from a software
> artifact registry toward actual robot discovery, allocation, execution and
> live operation while preserving clear domain boundaries and safety
> authority.
