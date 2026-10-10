# Kritva RaaS Booking Service

## 1. Document Control

| Item | Value |
|---|---|
| Document | Booking Service Architecture |
| Path | `docs/backend/architecture/BOOKING_SERVICE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Service | Booking Service |
| Resource Authority | Lab Service |
| Credit Authority | Credit Service |
| Platform Authority | Platform Service |
| Financial Authority | Billing Service |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Persistence | PostgreSQL |
| Execution Boundary | Job Service / Lab Service |

## 2. Purpose

The Booking Service manages the user's entitlement to reserve robotic
execution capacity for a defined time window.

The service provides a durable and concurrency-safe mechanism for:

- discovering availability;
- calculating booking quotes;
- creating reservations;
- preventing conflicts;
- enforcing booking windows;
- enforcing quotas;
- handling maintenance;
- modifying bookings;
- cancelling bookings;
- integrating with credits;
- publishing booking events;
- supporting Job admission.

The core principle is:

> A Booking represents an authorized reservation of robotic execution capacity
> for a defined time window; it does not represent the execution itself.

## 3. Scope

This document covers:

- resources;
- resource availability;
- platform eligibility;
- maintenance windows;
- booking windows;
- reservation;
- conflict detection;
- concurrency;
- quotas;
- booking state machine;
- booking creation;
- modification;
- cancellation;
- expiration;
- credit interaction;
- pricing/quote integration;
- events;
- audit;
- recovery;
- reconciliation;
- APIs;
- security;
- observability;
- testing;
- Phase 0–8 implementation.

## 4. Non-Goals

The Booking Service does not:

- execute applications;
- control robots;
- own physical robot health;
- own artifact metadata;
- own Job lifecycle;
- own Run lifecycle;
- own the credit ledger;
- own monetary payment transactions;
- replace Lab Service;
- replace Platform Service;
- act as a generic calendar system.

## 5. Architectural Principles

The Booking Service follows these principles:

1. Booking is durable business state.
2. Booking is separate from Job and Run.
3. Resource availability is authoritative in Lab Service.
4. Platform definitions are authoritative in Platform Service.
5. Credits are authoritative in Credit Service.
6. Monetary transactions are authoritative in Billing Service.
7. Booking conflicts are prevented transactionally.
8. Client-side availability is advisory only.
9. Booking confirmation is server-authoritative.
10. Booking modification is an explicit state-changing operation.
11. Cancellation policy is data-driven.
12. Maintenance windows override normal availability.
13. Booking windows cannot overlap prohibited maintenance.
14. Time is stored and compared in UTC.
15. Every booking is organization-scoped.
16. Financial/resource operations are idempotent.
17. Realtime events are not authoritative state.
18. Physical robot safety remains outside the Booking Service.

## 6. Booking Definition

A Booking represents an approved reservation for execution capacity.

A Booking contains:

- organization;
- user;
- project;
- platform;
- resource class or resource;
- requested start time;
- requested end time;
- status;
- credit policy;
- reservation information;
- cancellation policy.

The Booking does not itself imply that an application is running.

## 7. Resource Definition

A Resource represents execution capacity that can be reserved.

Examples:

- humanoid robot;
- robot arm;
- mobile robot;
- simulation environment;
- dedicated accelerator;
- future robotic execution resource.

The initial RaaS product primarily targets physical robotic resources.

## 8. Resource Ownership

Lab Service owns:

- resource identity;
- resource health;
- resource capabilities;
- resource operational state;
- Lab Agent association;
- maintenance state;
- actual physical availability.

Booking Service owns:

- reservation records;
- booking policy;
- reservation windows;
- booking conflicts;
- booking lifecycle.

## 9. Platform Relationship

A platform describes the robotic execution target.

Example:

    Platform
      |
      +-- Humanoid-A
      +-- Humanoid-B
      +-- Mobile-A

A platform may have multiple physical resources:

    Platform Humanoid-A
       |
       +-- Robot-001
       +-- Robot-002
       +-- Robot-003

A booking may reserve a specific resource or a resource class depending on
commercial and scheduling policy.

## 10. Resource Reservation Models

Two models are supported conceptually:

| Model | Description |
|---|---|
| Specific resource | User reserves Robot-001 |
| Resource class | User reserves any eligible Humanoid-A resource |

The initial implementation should prefer resource-class booking where practical,
allowing the scheduler to allocate an eligible resource later.

## 11. Booking vs Allocation

Booking and resource allocation are distinct.

    Booking
       |
       v
    Authorized time entitlement

    Allocation
       |
       v
    Actual resource reservation for Job execution

A booking may exist without a resource being physically allocated yet.

## 12. Availability

Availability means that a compatible execution resource can potentially be
reserved for a requested time window.

Availability depends on:

- resource;
- platform;
- resource state;
- maintenance;
- existing bookings;
- capacity;
- policy;
- quotas.

## 13. Availability Is Advisory

An availability query does not reserve anything.

Example:

    User
      |
      v
    availability.query
      |
      v
    Available
      |
      v
    User selects slot
      |
      v
    booking.create
      |
      v
    Transactional conflict check

Another user may reserve the same slot between the query and creation.

## 14. Booking Creation Principle

The only authoritative confirmation is the successful booking transaction.

    Availability Query
          |
          v
    User Selection
          |
          v
    Booking Request
          |
          v
    Transaction
          |
          +--> Conflict --> REJECT
          |
          v
    CONFIRMED

## 15. Time Model

All persisted timestamps must use UTC.

Recommended database type:

    TIMESTAMPTZ

Client-facing interfaces should use RFC3339 timestamps.

Example:

    2026-10-08T10:00:00Z

User-facing interfaces may display local timezone values, but the backend
must retain UTC as the canonical representation.

## 16. Booking Window

A booking contains:

    start_time
    end_time

The interval should be represented consistently, preferably as:

    [start_time, end_time)

This means the start is inclusive and the end is exclusive.

Adjacent bookings are therefore valid:

    Booking A: 10:00 - 11:00
    Booking B: 11:00 - 12:00

## 17. Minimum Duration

Each platform/resource class may define a minimum booking duration.

Example:

    Minimum = 15 minutes

A request for:

    10:00 - 10:05

must be rejected with:

    BOOKING_TOO_SHORT

## 18. Maximum Duration

Maximum booking duration is policy-controlled.

Example:

    Maximum = 4 hours

A request exceeding the limit returns:

    BOOKING_TOO_LONG

## 19. Booking Lead Time

The service may enforce minimum advance notice.

Example:

    Current time = 10:00
    Minimum lead time = 30 minutes

A request beginning at 10:10 is rejected.

The exact policy is platform-specific.

## 20. Availability Windows

A resource or platform may define normal operating windows.

Example:

    Monday-Friday
    09:00-18:00

A booking outside these windows must fail:

    BOOKING_OUTSIDE_AVAILABILITY

## 21. Maintenance Windows

Maintenance windows explicitly remove capacity.

Example:

    Robot-001
    Maintenance:
    2026-10-12 14:00-18:00 UTC

Bookings overlapping this window must not be confirmed.

## 22. Maintenance Priority

Maintenance overrides normal availability.

    Normal Availability
          |
          v
    Maintenance Window
          |
          v
    UNAVAILABLE

The Booking Service must not create a booking that overlaps an authoritative
maintenance window.

## 23. Planned Maintenance

Planned maintenance should be represented before the affected window.

This permits:

- availability removal;
- user notification;
- booking conflict prevention;
- rescheduling;
- cancellation policy application.

## 24. Emergency Maintenance

Emergency maintenance may occur after bookings exist.

The system must support:

    CONFIRMED
        |
        v
    MAINTENANCE_CONFLICT
        |
        +--> Rescheduled
        +--> Cancelled
        +--> Administrative handling

The exact externally visible state should be defined by policy.

## 25. Booking State Machine

Canonical states:

    DRAFT
    PENDING
    CONFIRMED
    ACTIVE
    COMPLETED
    CANCELLED
    EXPIRED
    CONFLICTED

`DRAFT` may be internal or optional if creation is atomic.

## 26. Booking State Categories

| Category | States |
|---|---|
| Pre-confirmation | DRAFT, PENDING |
| Reserved | CONFIRMED |
| Current | ACTIVE |
| Terminal success | COMPLETED |
| Terminal cancellation | CANCELLED |
| Terminal expiry | EXPIRED |
| Exceptional | CONFLICTED |

## 27. State Machine

    DRAFT
      |
      v
    PENDING
      |
      +------> CANCELLED
      |
      v
    CONFIRMED
      |
      +------> CANCELLED
      |
      +------> ACTIVE
      |
      +------> EXPIRED
      |
      v
    ACTIVE
      |
      v
    COMPLETED

Exceptional maintenance/conflict handling may transition a confirmed booking
through an explicit administrative or rescheduling path.

## 28. State Transition Rules

| From | To | Condition |
|---|---|---|
| DRAFT | PENDING | Booking submitted |
| PENDING | CONFIRMED | Reservation and policy checks succeed |
| PENDING | CANCELLED | User/system cancellation |
| CONFIRMED | ACTIVE | Start time reached |
| CONFIRMED | CANCELLED | Valid cancellation |
| CONFIRMED | EXPIRED | Window elapsed without activation |
| ACTIVE | COMPLETED | Booking window completed |
| ACTIVE | CANCELLED | Exceptional administrative cancellation |
| CONFIRMED | CONFLICTED | Maintenance/resource conflict |

Invalid transitions must be rejected.

## 29. PENDING Semantics

`PENDING` means the booking request is undergoing processing.

It must not be presented to the user as confirmed.

For an atomic reservation implementation, PENDING may be extremely short-lived.

## 30. CONFIRMED Semantics

`CONFIRMED` means:

- conflict checks passed;
- policy checks passed;
- required credit authorization succeeded;
- reservation was durably recorded.

This is the only state that should be shown as a confirmed reservation.

## 31. ACTIVE Semantics

`ACTIVE` means the current booking window has started.

It does not mean a Job is running.

The Job may still be:

- queued;
- validating;
- allocating;
- running;
- completed.

## 32. COMPLETED Semantics

`COMPLETED` means the reserved time window has ended according to Booking
policy.

It does not necessarily mean that the associated Job completed successfully.

## 33. EXPIRED Semantics

`EXPIRED` indicates the booking window ended without successful activation or
without a valid execution use.

Expiration and cancellation are different business outcomes.

## 34. Conflict Definition

A booking conflict occurs when two reservations attempt to consume the same
exclusive capacity during overlapping time windows.

Example:

    Existing: 10:00-11:00
    Requested: 10:30-11:30

Result:

    BOOKING_CONFLICT

## 35. Conflict Detection

For a resource:

    Existing.start < Requested.end
    AND
    Existing.end > Requested.start

indicates overlap.

Boundary equality is not a conflict:

    Existing: 10:00-11:00
    Requested: 11:00-12:00

## 36. Transactional Conflict Prevention

Availability queries alone are insufficient.

Booking creation must use:

- database transaction;
- locking;
- exclusion constraint where supported;
- or equivalent serialization mechanism.

Preferred conceptual model:

    Begin Transaction
          |
          v
    Lock/Serialize Resource Window
          |
          v
    Check Conflicts
          |
          +--> Conflict --> Rollback
          |
          v
    Create Booking
          |
          v
    Commit

## 37. Race Example

Two users submit:

    User A -> 10:00-11:00
    User B -> 10:00-11:00

Only one may receive:

    CONFIRMED

The other receives:

    BOOKING_CONFLICT

The outcome must be deterministic at transaction commit, not based on client
timing assumptions.

## 38. Resource Capacity

Some resources may support capacity greater than one.

For example:

    Simulation Cluster
      capacity = 10

A physical robot generally has:

    capacity = 1

The Booking Service must support a capacity model even if initial physical
robots use exclusive capacity.

## 39. Capacity Allocation

For capacity-based resources:

    Requested Units = 2
    Available Units = 5

The booking consumes two units.

For exclusive robots:

    Requested Units = 1
    Capacity = 1

Any overlapping booking conflicts.

## 40. Resource Eligibility

A resource is eligible only if:

- platform matches;
- version is compatible;
- capabilities satisfy booking requirements;
- resource is operational;
- maintenance does not overlap;
- policy permits reservation.

## 41. Resource Health

Booking availability must not expose unhealthy resources as normal capacity.

Lab Service provides health state.

Possible states:

    HEALTHY
    DEGRADED
    UNHEALTHY
    MAINTENANCE
    OFFLINE

The exact booking policy for DEGRADED resources is configurable.

## 42. Maintenance Integration

The Booking Service consumes authoritative maintenance information from Lab
Service.

It should not independently invent physical maintenance state.

Flow:

    Lab Service
        |
        v
    Maintenance Window
        |
        v
    Booking Availability
        |
        v
    Exclude Window

## 43. Booking Quotas

Quotas limit reservation consumption.

Possible quota dimensions:

- organization;
- user;
- project;
- platform;
- concurrent bookings;
- total booking minutes;
- daily minutes;
- monthly minutes;
- future booking count.

## 44. Quota Example

Organization quota:

    Maximum concurrent bookings = 5

Current:

    5 confirmed bookings

New request:

    6th booking

Result:

    BOOKING_QUOTA_EXCEEDED

A specific stable error code may be added to the error registry if not already
defined.

## 45. Quota Ownership

Booking Service owns booking quotas.

Commercial subscription configuration may define quota limits.

Billing Service owns monetary subscription state.

The Booking Service should consume effective quota policy rather than owning
payment state.

## 46. Quota Concurrency

Quota checks must be concurrency-safe.

Two simultaneous requests must not both consume the last available quota slot.

Quota accounting may use:

- transactional counters;
- row locks;
- serialized reservation records;
- database constraints.

## 47. Quota Types

Recommended initial types:

| Quota | Purpose |
|---|---|
| Concurrent bookings | Prevent excessive reservations |
| Daily minutes | Usage control |
| Monthly minutes | Plan enforcement |
| Future bookings | Prevent calendar monopolization |
| Maximum duration | Prevent one reservation consuming all capacity |

## 48. Organization Quota

Organization-level quota applies across its users.

Example:

    Organization
       |
       +-- User A
       +-- User B
       +-- User C

All contribute to the organization's booking quota.

## 49. User Quota

User-level limits may prevent one user from consuming the organization's entire
reservation allowance.

## 50. Project Quota

Optional project-level limits may support research or educational workloads.

Example:

    Project A
      monthly booking limit = 100 hours

## 51. Platform-Specific Quota

Quota may differ by platform.

Example:

    Humanoid-A:
      100 minutes/day

    Humanoid-B:
      300 minutes/day

This aligns with platform-specific commercial credits.

## 52. Credit Integration

Booking and credits are related but separate domains.

Booking Service owns:

    "Is this time slot reserved?"

Credit Service owns:

    "Does the organization have sufficient platform credits?"

## 53. Credit Reservation Principle

For paid reservations, the preferred flow is:

    Booking Request
         |
         v
    Quote
         |
         v
    Credit Authorization/Reservation
         |
         v
    Booking Confirmation
         |
         v
    Credit Reservation Held

This prevents confirmed bookings from being created without sufficient
commercial authorization.

## 54. Credit Interaction

Conceptual:

    Booking Service
         |
         | reserve credits
         v
    Credit Service
         |
         +--> Success --> Confirm Booking
         |
         +--> Failure --> Reject Booking

The Credit Service remains the authority for the wallet and ledger.

## 55. Credit Amount

Credit requirement is calculated from policy.

Example:

    Rate = 15 credits/minute
    Duration = 30 minutes

    Required = 450 credits

The rate may depend on:

- platform;
- resource;
- resource configuration;
- booking duration;
- subscription;
- effective pricing policy.

## 56. Quote

Before booking creation, the user may request:

    availability.query
    booking.quote

A quote should contain:

- requested window;
- platform;
- resource class;
- credit rate;
- required credits;
- quota impact;
- cancellation policy;
- quote expiration.

## 57. Quote Is Not Reservation

A quote does not reserve capacity.

    Quote
      |
      +--> Price/credit information
      |
      +--> No capacity guarantee

Only successful booking creation reserves capacity.

## 58. Quote Expiration

Quotes should have a limited validity period.

A booking request using an expired quote must obtain a new quote.

The final booking transaction must recalculate or revalidate the applicable
commercial terms.

## 59. Credit Reservation Failure

If credit authorization fails:

    Booking Request
        |
        v
    Credit Authorization
        |
        v
    INSUFFICIENT_CREDITS
        |
        v
    Booking Rejected

No confirmed booking may remain.

## 60. Booking Creation Transaction

Where the Credit Service is external to the Booking transaction, use a
saga/compensation pattern rather than a distributed database transaction.

Conceptual:

    Validate Booking
          |
          v
    Reserve Capacity
          |
          v
    Reserve Credits
          |
          v
    Confirm Booking
          |
          +--> Failure --> Compensate

Exact ordering depends on the chosen credit reservation semantics.

## 61. Credit Compensation

If capacity is reserved but credit reservation fails:

    Release Capacity
        |
        v
    Booking Rejected

If credits are reserved but booking creation fails:

    Release/Refund Credit Reservation
        |
        v
    Booking Rejected

All compensation operations must be idempotent.

## 62. Booking Modification

Modifiable fields may include:

- start time;
- end time;
- resource class;
- platform where policy permits.

Modification must be treated as a new reservation decision.

The system must not simply mutate the old interval without conflict checking.

## 63. Modification Flow

    CONFIRMED
       |
       v
    Modify Request
       |
       v
    Validate Policy
       |
       v
    Check New Availability
       |
       v
    Recalculate Credits
       |
       v
    Apply Change
       |
       v
    CONFIRMED

If any step fails, the original booking remains unchanged.

## 64. Atomic Modification

Preferred behavior:

    Existing Booking
          |
          v
    Transaction
          |
          +--> Validate New Window
          +--> Check Conflict
          +--> Check Quota
          +--> Reconcile Credits
          |
          v
    Commit New Booking

There must be no intermediate state visible as a valid confirmed booking with
an invalid interval.

## 65. Modification Restrictions

Modification may be prohibited:

- after start time;
- inside minimum lead time;
- after execution begins;
- after cancellation;
- after expiration.

Error:

    BOOKING_MODIFICATION_NOT_ALLOWED

## 66. Duration Extension

Extending a booking may require:

- additional capacity;
- additional credits;
- quota availability;
- no maintenance conflict;
- no subsequent booking conflict.

It must be treated as a new reservation decision.

## 67. Booking Cancellation

Cancellation is a state transition:

    CONFIRMED
       |
       v
    CANCELLED

Cancellation policy determines:

- whether cancellation is allowed;
- refund amount;
- credit release;
- administrative fees;
- minimum cancellation notice.

## 68. Cancellation Windows

Example:

    More than 24h before start
        -> 100% credit release

    1h-24h before start
        -> partial release

    Less than 1h
        -> no release

These values are examples only and must be configurable.

## 69. Cancellation and Credits

Credit behavior must be delegated to Credit Service.

Booking Service requests:

    releaseReservation(...)
    or
    refund(...)

Credit Service performs the authoritative ledger operation.

## 70. Cancellation During ACTIVE

Active booking cancellation is special.

It may require:

- Job stop;
- Run stop;
- resource release;
- credit reconciliation.

Booking Service should not directly stop the robot.

Flow:

    Booking Cancel
         |
         v
    Job/Run Stop Request
         |
         v
    Resource Release
         |
         v
    Booking CANCELLED

## 71. Booking Completion

At the end of the reserved window:

    ACTIVE
       |
       v
    COMPLETED

Completion may trigger:

- credit usage reconciliation;
- resource availability update;
- notifications;
- audit events.

It does not imply Job success.

## 72. Booking Expiration

A booking that was never used may become:

    CONFIRMED
       |
       v
    Window Ends
       |
       v
    EXPIRED

Credit policy determines whether unused reserved credits are released.

## 73. Maintenance Conflict After Confirmation

If planned maintenance is added after a booking exists:

    CONFIRMED
       |
       v
    Maintenance Conflict
       |
       +--> Notify User
       |
       +--> Reschedule
       |
       +--> Cancel/Refund

The policy must be explicit and auditable.

## 74. Automatic Rescheduling

Automatic rescheduling may be introduced later.

If enabled, it must preserve:

- platform;
- required capabilities;
- organization policy;
- credit terms;
- user authorization.

Automatic rescheduling must never silently move a booking without policy
permission.

## 75. Availability Query

Representative API:

    GET /api/v1/platforms/{platform_id}/availability
        ?start_time=...
        &end_time=...
        &duration=...

The response should distinguish:

- available;
- unavailable;
- maintenance;
- capacity exhausted.

## 76. Availability Result

Conceptual:

    {
        "platform_id": "humanoid-a",
        "window": {
            "start_time": "2026-10-10T10:00:00Z",
            "end_time": "2026-10-10T11:00:00Z"
        },
        "available": true,
        "capacity": {
            "total": 3,
            "available": 2
        }
    }

Availability is informational and may become stale immediately.

## 77. Booking API

Representative routes:

    GET    /api/v1/bookings
    POST   /api/v1/bookings
    GET    /api/v1/bookings/{booking_id}
    PATCH  /api/v1/bookings/{booking_id}
    POST   /api/v1/bookings/{booking_id}/cancel

Quote:

    POST /api/v1/bookings/quote

Availability:

    GET /api/v1/availability

## 78. Booking Creation Request

Conceptual:

    {
        "project_id": "project-001",
        "platform_id": "humanoid-a",
        "resource_class_id": "humanoid-a-standard",
        "start_time": "2026-10-10T10:00:00Z",
        "end_time": "2026-10-10T10:30:00Z",
        "required_capabilities": [
            "camera",
            "imu"
        ]
    }

The server determines authorization and effective pricing.

## 79. Booking Response

A successful confirmation should include:

    booking_id
    status
    platform_id
    resource_class_id
    start_time
    end_time
    required_credits
    credit_reservation_id
    cancellation_policy
    created_at

A resource ID may be omitted when allocation occurs later.

## 80. Idempotency

Booking creation must require or strongly recommend:

    Idempotency-Key: <opaque-key>

Same request:

    Same key + same parameters
        -> Original booking

Same key + changed parameters:

    IDEMPOTENCY_KEY_REUSED

This protects against client retries.

## 81. Booking Authorization

Creation requires:

- authenticated user;
- organization membership;
- project access;
- platform access;
- booking permission;
- quota availability.

The server derives organization identity from authentication context.

## 82. Resource Access

Users should not directly select arbitrary physical resources unless the product
explicitly exposes that capability.

The safer default is:

    User
      |
      v
    Platform / Resource Class
      |
      v
    Scheduler
      |
      v
    Eligible Physical Resource

## 83. Specific Resource Booking

If specific-resource booking is exposed, the request must validate:

- resource belongs to requested platform;
- resource is visible to organization;
- resource is reservable;
- maintenance does not overlap;
- user has permission.

## 84. Event Model

Booking events include:

    booking.created
    booking.confirmed
    booking.modified
    booking.cancelled
    booking.started
    booking.completed

Additional operational events may include:

    booking.expired
    booking.conflicted
    booking.maintenance_conflict
    booking.reschedule_required

## 85. Booking Event Example

    {
        "protocol_version": "1.0",
        "event_id": "evt-booking-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "event": "booking.confirmed",
        "resource": {
            "type": "booking",
            "id": "booking-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "sequence": 2,
        "data": {
            "booking_id": "booking-001",
            "platform_id": "humanoid-a",
            "start_time": "2026-10-10T10:00:00Z",
            "end_time": "2026-10-10T10:30:00Z"
        }
    }

## 86. Event Reliability

Critical booking events should use the outbox pattern.

    Booking Transaction
          |
          +--> Booking State
          +--> Outbox Event
          |
          v
        Commit
          |
          v
    Event Publisher
          |
          +--> WebSocket
          +--> Notification
          +--> Audit
          +--> Other Services

## 87. Event Ordering

Events should be ordered per Booking.

Example:

    booking.created
        |
        v
    booking.confirmed
        |
        v
    booking.started
        |
        v
    booking.completed

Consumers must tolerate duplicate delivery.

## 88. Realtime Behavior

WebSocket events inform the Studio/Web Console of:

- confirmation;
- modification;
- cancellation;
- start;
- completion;
- conflict;
- maintenance impact.

REST remains authoritative after reconnect.

## 89. Job Integration

The Job Service consumes confirmed booking state.

Flow:

    Booking CONFIRMED
          |
          v
    Job Create
          |
          v
    Validate Booking
          |
          v
    Allocate Resource
          |
          v
    Execute

A Job must not assume that a booking remaining in a client cache is valid.

## 90. Booking and Job Timing

A Job may be created before its booking starts.

Execution is constrained by:

- booking window;
- resource allocation;
- artifact;
- credits;
- platform compatibility.

A Job cannot execute outside its authorized booking window unless explicitly
allowed by policy.

## 91. Booking and Resource Allocation

Booking reserves entitlement.

Job allocation reserves actual execution capacity.

    Booking
       |
       v
    Time Entitlement
       |
       v
    Job
       |
       v
    Resource Allocation
       |
       v
    Run

This separation prevents long-term bookings from unnecessarily locking a
physical robot for the entire reservation period.

## 92. Scheduler Interaction

Booking Service provides:

- valid booking;
- requested window;
- platform;
- resource class;
- required capabilities.

Scheduler/Lab Service determines:

- actual resource;
- current health;
- allocation;
- physical availability.

## 93. Maintenance Interaction

Lab Service publishes or exposes maintenance windows.

Booking Service:

- removes affected availability;
- prevents new conflicting bookings;
- identifies existing conflicts;
- triggers policy handling.

## 94. Quota Interaction

Quota evaluation occurs during:

- booking creation;
- modification;
- renewal/extension.

Quota consumption should be released on cancellation or expiration according to
policy.

## 95. Credit Interaction

Credit evaluation occurs during:

- quote;
- booking creation;
- modification;
- cancellation;
- completion/reconciliation.

Credit Service remains the ledger authority.

## 96. Billing Interaction

Billing may provide subscription state or commercial entitlements.

Booking Service consumes the effective plan/policy.

It does not directly modify payment records.

## 97. Data Model

Conceptual Booking entity:

    Booking
      id
      organization_id
      user_id
      project_id
      platform_id
      resource_class_id
      resource_id nullable
      start_time
      end_time
      status
      required_credits
      credit_reservation_id
      cancellation_policy_id
      created_at
      updated_at
      confirmed_at
      started_at
      completed_at
      cancelled_at
      version

## 98. Booking Repository

Conceptual interface:

    BookingRepository
        create(...)
        get(booking_id)
        list(filter)
        update(...)
        transitionState(...)
        findConflicts(...)
        findActive(...)
        findExpired(...)
        findMaintenanceConflicts(...)

Conflict queries must be designed for concurrency-safe execution.

## 99. Availability Repository

Conceptual:

    AvailabilityRepository
        getResourceWindows(...)
        getMaintenanceWindows(...)
        getExistingBookings(...)
        getCapacity(...)
        getOperatingHours(...)

Lab-owned resource state should be accessed through a service boundary rather
than direct cross-module table mutation.

## 100. Quota Interface

Conceptual:

    BookingQuotaService
        checkCreate(...)
        checkModify(...)
        reserve(...)
        release(...)
        usage(...)

The exact implementation may use Booking records as the source for derived
usage rather than maintaining mutable counters.

## 101. Credit Interface

Conceptual:

    CreditServiceClient
        quote(...)
        reserve(...)
        release(...)
        consume(...)
        refund(...)

All calls must be idempotent.

## 102. Maintenance Interface

Conceptual:

    LabServiceClient
        getAvailability(...)
        getMaintenanceWindows(...)
        getResourceState(...)
        listEligibleResources(...)

The Booking Service must not mutate Lab resource state directly.

## 103. Booking Policy

Booking policy should be data-driven.

Configuration may include:

    minimum_duration
    maximum_duration
    minimum_lead_time
    cancellation_window
    operating_hours
    quota_limits
    credit_rate
    booking_horizon

Policies must be versioned or timestamp-effective where commercial correctness
requires it.

## 104. Booking Horizon

The platform may limit how far into the future a user may book.

Example:

    Maximum future booking = 30 days

A request outside the horizon returns a policy error.

## 105. Concurrent Booking Limit

The service may enforce:

    Maximum active/future bookings per user
    Maximum active/future bookings per organization

This prevents calendar monopolization.

## 106. Booking Fairness

The scheduler should prevent one organization from monopolizing scarce robotic
resources.

Potential mechanisms:

- quotas;
- priority;
- booking limits;
- fair scheduling;
- subscription policy.

Fairness rules must remain transparent and auditable.

## 107. Booking Priority

Priority may be derived from:

- subscription;
- research plan;
- education plan;
- enterprise SLA;
- booking age.

Priority must never bypass:

- safety;
- authorization;
- maintenance;
- resource compatibility.

## 108. Failure Modes

Important failure classes include:

- booking conflict;
- invalid window;
- outside availability;
- maintenance overlap;
- quota exceeded;
- insufficient credits;
- credit service unavailable;
- Lab service unavailable;
- database conflict;
- idempotency conflict;
- cancellation policy violation.

## 109. Conflict Failure

Expected error:

    BOOKING_CONFLICT

The response should provide enough information to allow the UI to offer
alternative availability without exposing another organization's private
booking details.

## 110. Maintenance Failure

Expected behavior:

    Requested Window
          |
          v
    Maintenance Overlap
          |
          v
    Reject Booking

The service should not expose private maintenance details beyond what is
necessary for the user.

## 111. Credit Service Failure

If Credit Service is unavailable:

    Booking Request
         |
         v
    Credit Service Unavailable
         |
         v
    No Confirmation

A booking must not be confirmed when commercial authorization is required but
cannot be established.

## 112. Database Failure

If PostgreSQL is unavailable:

- no new confirmation;
- no modification;
- no cancellation state change;
- no false success response.

The API should return:

    INFRA_DATABASE_UNAVAILABLE

## 113. Lab Service Failure

If authoritative resource availability cannot be determined:

- availability may be marked unavailable/stale;
- booking confirmation should fail closed where resource state is required.

The system must not confirm scarce physical capacity based on stale assumptions.

## 114. Recovery

Recovery workers should identify:

- pending bookings;
- expired bookings;
- incomplete credit reservations;
- maintenance conflicts;
- stale states;
- failed compensation.

Recovery must be idempotent.

## 115. Pending Booking Recovery

A booking stuck in PENDING must be examined for:

- transaction completion;
- credit reservation;
- resource reservation;
- timeout.

It must not remain indefinitely pending.

## 116. Credit Reconciliation

Periodically reconcile:

    Booking
       |
       v
    Credit Reservation
       |
       v
    Credit Ledger

Detect:

- booking confirmed but no credit reservation;
- credit reserved but booking absent;
- cancelled booking with unreleased credit;
- consumed credit without corresponding usage.

## 117. Maintenance Reconciliation

Periodically check:

    Confirmed Bookings
          |
          v
    Current Maintenance Windows
          |
          v
    Conflicts
          |
          v
    Notify / Reschedule / Cancel

## 118. Booking Audit

Audit should capture:

- booking creation;
- confirmation;
- modification;
- cancellation;
- administrative changes;
- maintenance conflicts;
- credit interactions;
- resource assignment;
- policy decisions.

Audit records should include actor and correlation IDs.

## 119. Security

Booking Service security requirements:

- TLS;
- authentication;
- organization authorization;
- project authorization;
- role checks;
- server-side tenant isolation;
- rate limiting;
- idempotency;
- audit logging;
- no sensitive tenant information in conflict responses.

## 120. Privacy

Availability APIs must not expose:

- another organization's project;
- another user's identity;
- private booking details;
- private job information.

A user should generally receive:

    unavailable

rather than:

    "Organization XYZ booked Robot-002."

## 121. Observability

Metrics:

- availability queries;
- booking requests;
- booking confirmations;
- conflicts;
- cancellations;
- modifications;
- quota rejections;
- credit failures;
- maintenance conflicts;
- booking latency;
- pending duration;
- expired bookings.

## 122. Performance

Availability queries should be optimized for:

- time-window search;
- platform filtering;
- resource class;
- capacity;
- maintenance windows.

Booking creation prioritizes correctness over raw throughput.

A slower correct transaction is preferable to an incorrect double booking.

## 123. Database Indexing

Expected indexes include combinations around:

- organization;
- project;
- platform;
- resource;
- status;
- start time;
- end time.

The exact schema must use workload measurements to refine indexes.

## 124. Time-Range Constraints

PostgreSQL range/exclusion constraints should be considered for exclusive
resource bookings.

Conceptually:

    resource_id
    +
    time_range

must not overlap for confirmed exclusive bookings.

Application checks remain necessary for policy and capacity semantics.

## 125. Booking Transaction

Preferred conceptual transaction:

    BEGIN
      |
      v
    Authenticate/Authorize
      |
      v
    Load Policy
      |
      v
    Validate Window
      |
      v
    Check Quota
      |
      v
    Serialize Resource/Capacity
      |
      v
    Check Maintenance
      |
      v
    Check Existing Booking
      |
      v
    Create Booking
      |
      v
    Commit
      |
      v
    Credit/Compensation Workflow
      |
      v
    Event Publication

Exact ordering of credit reservation and database commitment depends on the
selected saga strategy.

## 126. Avoid Long Transactions

Do not hold a database transaction open while waiting for:

- external credit service;
- external Lab Service;
- object storage;
- notification delivery.

Transactions should protect local invariants only.

## 127. Distributed Transaction Strategy

Booking, Credit and Lab are separate domains.

Do not use distributed two-phase commit initially.

Use:

- local transactions;
- idempotent commands;
- reservations;
- compensating actions;
- reconciliation.

## 128. Phase Mapping

| Phase | Booking Service Scope |
|---|---|
| Phase 0 | Booking domain and state model |
| Phase 1 | Booking API and persistence |
| Phase 2 | Platform/resource availability |
| Phase 3 | Transactional reservation |
| Phase 4 | Credits, quotas, commercial policy |
| Phase 5 | Job integration |
| Phase 6 | Real Lab resource integration |
| Phase 7 | Realtime/events/results |
| Phase 8 | Production hardening |

## 129. Phase 0

Define:

- Booking entity;
- state machine;
- booking policy;
- resource model;
- availability contract;
- conflict semantics;
- error codes;
- events.

## 130. Phase 1

Implement:

- PostgreSQL booking records;
- REST APIs;
- authorization;
- project ownership;
- list/get;
- idempotency;
- state transitions.

## 131. Phase 2

Integrate:

- Platform Service;
- Lab Service availability;
- operating windows;
- resource classes;
- maintenance windows.

## 132. Phase 3

Implement production reservation:

- transactional conflict prevention;
- capacity handling;
- concurrency tests;
- expiration;
- recovery.

## 133. Phase 4

Integrate:

- Credit Service;
- credit reservation;
- quotas;
- quote;
- cancellation policy;
- commercial plans.

This phase establishes the commercial correctness boundary.

## 134. Phase 5

Integrate Job Service:

    Booking
       |
       v
    Job
       |
       v
    Allocation
       |
       v
    Run

Execution must remain within booking policy.

## 135. Phase 6

Integrate real Lab infrastructure:

- physical resources;
- resource health;
- maintenance;
- allocation;
- offline behavior;
- resource reconciliation.

Human safety remains a separate physical deployment gate.

## 136. Phase 7

Integrate:

- WebSocket events;
- notifications;
- result lifecycle;
- experiment/rerun workflows;
- live execution status.

## 137. Phase 8

Harden:

- concurrency;
- load;
- quota enforcement;
- credit reconciliation;
- maintenance handling;
- disaster recovery;
- operational dashboards;
- runbooks;
- fairness;
- SLA enforcement.

## 138. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Double booking | Transactional conflict constraints |
| Stale availability | Server-side confirmation |
| Resource outage | Lab health integration |
| Maintenance collision | Authoritative maintenance windows |
| Credit inconsistency | Idempotent reservation + reconciliation |
| Quota race | Transactional quota enforcement |
| Client retry | Idempotency keys |
| Long transactions | Short local transactions + saga |
| Cross-tenant leakage | Server-side authorization |
| Cancellation ambiguity | Explicit policy/state |
| Timezone errors | UTC canonical storage |
| Resource monopolization | Quotas/fairness |
| Stuck pending bookings | Recovery worker |
| Event loss | Outbox + REST reconciliation |
| Scheduler mismatch | Separate booking/allocation semantics |
| Payment dependency failure | Fail closed |
| Lab dependency failure | No false confirmation |
| Maintenance after booking | Reconciliation + policy |
| Data loss | PostgreSQL backup/PITR |
| Availability overload | Caching/read optimization |

## 139. Open Questions

1. Will users book resource classes or specific robots in the MVP?
2. What exact resource capacity model is required?
3. What is the default minimum booking duration?
4. What is the default maximum duration?
5. What is the minimum lead time?
6. What is the maximum future booking horizon?
7. What cancellation windows will be commercialized?
8. What are the default refund/release policies?
9. Will credits be reserved at booking time or execution time?
10. Can credit reservations expire automatically?
11. What exact quota model applies to Student, Developer and Research plans?
12. What fairness policy should govern scarce robots?
13. Will premium users receive scheduling priority?
14. How should emergency maintenance affect confirmed bookings?
15. Will automatic rescheduling be supported?
16. What resource health states are booking-eligible?
17. How should degraded robots be treated?
18. What exact database exclusion strategy will be used?
19. Will PostgreSQL range types be used for time intervals?
20. What exact availability-cache TTL is acceptable?
21. What is the target booking creation latency?
22. What is the booking conflict SLO?
23. What is the required booking audit retention?
24. How should organization-level quotas be administratively overridden?
25. What notification policy applies to maintenance cancellations?
26. How are unused credits handled after expiration?
27. Can bookings span multiple platform resources?
28. Will recurring bookings be supported later?
29. Will group/educational bookings require capacity reservations?
30. What SLA guarantees will commercial customers receive?

## 140. Full Acceptance Criteria

### Booking Model

- [ ] Booking has a stable ID.
- [ ] Booking is organization-scoped.
- [ ] Booking references a project.
- [ ] Booking references a platform.
- [ ] Booking references a resource class or resource.
- [ ] Booking contains start and end timestamps.
- [ ] Booking uses UTC.
- [ ] Booking has a durable state.
- [ ] Booking has auditable lifecycle history.
- [ ] Booking is distinct from Job.
- [ ] Booking is distinct from Run.

### Availability

- [ ] Availability query exists.
- [ ] Availability is advisory.
- [ ] Server confirmation is authoritative.
- [ ] Platform compatibility is checked.
- [ ] Resource eligibility is checked.
- [ ] Resource health is considered.
- [ ] Operating hours are considered.
- [ ] Maintenance windows are considered.
- [ ] Capacity is considered.
- [ ] Stale availability cannot guarantee a reservation.

### Reservation

- [ ] Booking creation is transactional.
- [ ] Exclusive resources cannot be double-booked.
- [ ] Capacity resources cannot exceed capacity.
- [ ] Concurrent booking requests are serialized safely.
- [ ] Adjacent non-overlapping bookings are allowed.
- [ ] Minimum duration is enforced.
- [ ] Maximum duration is enforced.
- [ ] Booking horizon is enforced.
- [ ] Lead time is enforced.
- [ ] Booking confirmation is server-authoritative.

### State Machine

- [ ] DRAFT is defined if implemented.
- [ ] PENDING is defined.
- [ ] CONFIRMED is defined.
- [ ] ACTIVE is defined.
- [ ] COMPLETED is defined.
- [ ] CANCELLED is defined.
- [ ] EXPIRED is defined.
- [ ] CONFLICTED semantics are defined.
- [ ] Invalid transitions are rejected.
- [ ] Terminal states cannot silently reactivate.

### Maintenance

- [ ] Planned maintenance removes availability.
- [ ] New bookings cannot overlap maintenance.
- [ ] Existing booking conflicts can be detected.
- [ ] Emergency maintenance is handled.
- [ ] Maintenance conflicts are auditable.
- [ ] User notification policy is defined.
- [ ] Rescheduling policy is explicit.
- [ ] Booking Service does not invent physical maintenance state.

### Quotas

- [ ] Organization quotas are supported.
- [ ] User quotas are supported where required.
- [ ] Project quotas are supported where required.
- [ ] Concurrent booking limits are enforced.
- [ ] Duration limits are enforced.
- [ ] Time-based quotas are enforceable.
- [ ] Quota checks are concurrency-safe.
- [ ] Quota usage is auditable.
- [ ] Quota policies are data-driven.

### Credits

- [ ] Credit Service remains authoritative.
- [ ] Platform-specific credit type is enforced.
- [ ] Quote returns required credits.
- [ ] Booking creation validates credit availability.
- [ ] Credit reservation is idempotent.
- [ ] Credit release is idempotent.
- [ ] Cancellation policy affects credit release.
- [ ] Modification recalculates credit impact.
- [ ] Credit failures prevent unauthorized confirmation.
- [ ] Credit reconciliation exists.

### Modification

- [ ] Modification is explicitly authorized.
- [ ] New window is validated.
- [ ] New availability is checked.
- [ ] New conflicts are checked.
- [ ] Quota is rechecked.
- [ ] Credit impact is recalculated.
- [ ] Modification is atomic.
- [ ] Original booking remains valid if modification fails.
- [ ] Modification after start is restricted.
- [ ] Modification policy is auditable.

### Cancellation

- [ ] Cancellation API exists.
- [ ] Cancellation is idempotent.
- [ ] Cancellation policy is enforced.
- [ ] Credit release/refund is integrated.
- [ ] Resource entitlement is released.
- [ ] Active cancellation integrates with Job/Run stopping.
- [ ] Cancellation is audited.
- [ ] Cancelled bookings cannot execute.

### API

- [ ] Availability API exists.
- [ ] Quote API exists.
- [ ] Booking create API exists.
- [ ] Booking get API exists.
- [ ] Booking list API exists.
- [ ] Booking modification API exists.
- [ ] Booking cancellation API exists.
- [ ] APIs use `/api/v1/`.
- [ ] Critical mutations support idempotency.
- [ ] Cursor pagination is used where appropriate.
- [ ] Structured errors are returned.

### Events

- [ ] `booking.created` exists.
- [ ] `booking.confirmed` exists.
- [ ] `booking.modified` exists.
- [ ] `booking.cancelled` exists.
- [ ] `booking.started` exists.
- [ ] `booking.completed` exists.
- [ ] Expiration semantics are observable.
- [ ] Maintenance conflicts are observable.
- [ ] Events contain resource identity.
- [ ] Events contain organization context.
- [ ] Events are at-least-once.
- [ ] Consumers tolerate duplicates.
- [ ] REST reconciliation is supported.

### Security

- [ ] Authentication is required.
- [ ] Organization authorization is enforced.
- [ ] Project authorization is enforced.
- [ ] Tenant context is server-authoritative.
- [ ] Cross-tenant booking access is blocked.
- [ ] Private booking details are not leaked.
- [ ] Rate limiting is implemented.
- [ ] Administrative changes are audited.
- [ ] Sensitive credit/payment details are not exposed unnecessarily.

### Recovery

- [ ] Pending bookings can be recovered.
- [ ] Credit reservations can be reconciled.
- [ ] Maintenance conflicts can be reconciled.
- [ ] Expired bookings are processed.
- [ ] Orphaned reservations are detectable.
- [ ] Recovery operations are idempotent.
- [ ] Database failure fails closed.
- [ ] Credit-service failure fails closed where required.
- [ ] Lab-service uncertainty does not create false confirmation.

### Observability

- [ ] Booking creation metrics exist.
- [ ] Conflict metrics exist.
- [ ] Cancellation metrics exist.
- [ ] Modification metrics exist.
- [ ] Quota rejection metrics exist.
- [ ] Credit failure metrics exist.
- [ ] Maintenance conflict metrics exist.
- [ ] Booking latency metrics exist.
- [ ] Pending-duration metrics exist.
- [ ] Correlation IDs appear in logs.
- [ ] Secrets are not logged.

### Testing

- [ ] State transitions are unit tested.
- [ ] Invalid transitions are tested.
- [ ] Availability is tested.
- [ ] Maintenance overlap is tested.
- [ ] Double booking is tested.
- [ ] Concurrent creation is tested.
- [ ] Capacity limits are tested.
- [ ] Quotas are tested under concurrency.
- [ ] Credit reservation is tested.
- [ ] Credit compensation is tested.
- [ ] Modification is tested.
- [ ] Cancellation is tested.
- [ ] Idempotency is tested.
- [ ] Event publication is tested.
- [ ] Recovery is tested.
- [ ] End-to-end Booking-to-Job flow is tested.

## 141. Final Architectural Invariants

1. Booking represents time-based execution entitlement.
2. Booking does not represent execution.
3. Job represents execution intent.
4. Run represents execution attempt.
5. Lab Service owns physical resource state.
6. Platform Service owns platform definitions.
7. Credit Service owns credit balances and ledger.
8. Billing Service owns monetary transactions.
9. Availability is advisory.
10. Booking confirmation is authoritative.
11. Booking conflicts are prevented transactionally.
12. Exclusive resources cannot be double-booked.
13. Capacity resources cannot exceed capacity.
14. Maintenance overrides normal availability.
15. Booking state is durable.
16. Booking state transitions are explicit.
17. All timestamps are stored in UTC.
18. Client-provided tenant context is never trusted for authorization.
19. Critical booking operations are idempotent.
20. Quotes do not reserve capacity.
21. Credit authorization is required before confirmation where policy requires it.
22. Credit operations are idempotent and reconciled.
23. Booking modification is atomic.
24. Cancellation follows explicit policy.
25. Active booking cancellation does not directly control robots.
26. Job/Run orchestration remains separate from Booking.
27. Resource allocation remains separate from Booking entitlement.
28. Realtime events are not authoritative state.
29. Booking events are delivered at least once.
30. Database state remains authoritative.
31. Distributed transactions are avoided in favor of reservations and compensation.
32. Maintenance conflicts are explicitly handled.
33. Quotas are concurrency-safe.
34. Cross-tenant information is not exposed through availability/conflict APIs.
35. Every booking lifecycle is observable and auditable.
36. Physical safety remains local to the robot and lab boundary.

## 142. Completion Condition

The Booking Service is complete when a user can:

    Select Platform
         |
         v
    Query Availability
         |
         v
    Review Quote
         |
         v
    Select Time Window
         |
         v
    Create Booking
         |
         v
    Validate Quota
         |
         v
    Authorize Credits
         |
         v
    Reserve Capacity
         |
         v
    CONFIRMED
         |
         v
    Job Execution Window
         |
         v
    ACTIVE
         |
         v
    COMPLETED

while the platform reliably prevents:

- double booking;
- maintenance conflicts;
- quota violations;
- unauthorized reservations;
- insufficient-credit confirmations;
- cross-tenant access;
- stale availability from becoming false confirmation;
- inconsistent cancellation;
- unsafe modification;
- resource reservation leaks.

The resulting architecture must preserve the core RaaS principle:

> **Build locally. Book remotely. Run on real robots.**

and the booking principle:

> **Availability is advisory; reservation is transactional; credits are authoritative in the Credit Service; physical execution is owned by Job, Run and Lab services.**
