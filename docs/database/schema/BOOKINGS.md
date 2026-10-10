# Kritva RaaS Bookings Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Bookings Schema |
| Path | `docs/database/schema/BOOKINGS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `booking` |
| Primary Domain Owner | Booking Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Time Standard | UTC `timestamptz` |
| Conflict Protection | PostgreSQL exclusion constraints |
| Financial Integration | Credit Reservation |
| Execution Integration | Job |
| Platform Authority | Platform Domain |
| Resource Authority | Lab Domain |
| Phase Coverage | Phase 0–Phase 8 |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for Kritva RaaS
resource bookings.

A Booking represents an organization's authorized reservation of a robotic
resource or eligible execution resource for a defined time interval.

The Booking domain is responsible for:

- booking identity;
- tenant ownership;
- requested platform;
- resource eligibility;
- requested time;
- allocated resource;
- booking state;
- conflict protection;
- cancellation;
- credit reservation linkage;
- booking history;
- audit evidence.

The core flow is:

    User
      |
      v
    Project
      |
      v
    Platform Selection
      |
      v
    Availability Check
      |
      v
    Credit Pricing
      |
      v
    Credit Reservation
      |
      v
    Booking
      |
      v
    Resource Allocation
      |
      v
    Job
      |
      v
    Run

# 3. Scope

This document defines:

- booking records;
- booking time slots;
- booking resource allocations;
- booking state history;
- cancellation records;
- conflict constraints;
- resource eligibility;
- platform relationships;
- credit reservation relationships;
- project relationships;
- organization tenancy;
- lifecycle;
- retention;
- audit;
- concurrency;
- repository interfaces;
- application services;
- booking creation;
- booking confirmation;
- booking cancellation;
- booking rescheduling;
- resource allocation;
- Phase 0–Phase 8 mapping;
- risks;
- open questions;
- acceptance criteria.

# 4. Non-Goals

This document does not define:

- Platform catalog ownership;
- Robot hardware identity;
- Resource operational state;
- Credit ledger implementation;
- Job execution lifecycle;
- Run lifecycle;
- Artifact validation;
- payment processing;
- customer source-code storage;
- physical emergency-stop behavior.

The Booking domain references these domains through stable identifiers and
application-service boundaries.

# 5. Goals

The Booking domain must provide:

1. deterministic booking identity;
2. organization isolation;
3. project ownership;
4. platform eligibility;
5. explicit time intervals;
6. conflict-free allocation;
7. resource-level exclusion protection;
8. booking lifecycle management;
9. cancellation policy;
10. rescheduling support;
11. credit reservation integration;
12. auditability;
13. historical state tracking;
14. concurrency safety;
15. idempotency;
16. operational reconciliation.

# 6. Booking Definition

A Booking is a customer's reservation request that becomes an authoritative
reservation of one or more eligible execution resources for a defined time
interval.

The logical model is:

    Booking
       |
       +--> requested Platform
       |
       +--> requested Configuration
       |
       +--> Time Slot
       |
       +--> Resource Allocation
       |
       +--> Credit Reservation
       |
       +--> Job(s)

# 7. Resource Definition

A Resource is the allocatable operational unit defined by the Lab domain.

Examples:

- physical robot;
- simulator;
- GPU execution environment;
- dedicated workstation.

The Booking domain does not own Resource state.

The Lab domain remains authoritative for:

- Resource identity;
- Resource lifecycle;
- operational availability;
- maintenance;
- Robot association;
- Lab association.

# 8. Booking Ownership

Every customer Booking belongs to exactly one Organization.

The normal ownership chain is:

    Organization
         |
         v
      Project
         |
         v
      Booking
         |
         v
      Resource

The Organization is the tenant boundary.

# 9. Booking Lifecycle

Recommended Booking state machine:

    DRAFT
      |
      v
    PENDING
      |
      v
    CONFIRMED
      |
      +------> CANCELLED
      |
      +------> EXPIRED
      |
      v
    ACTIVE
      |
      v
    COMPLETED

Alternative terminal states:

    PENDING --> REJECTED
    CONFIRMED --> CANCELLED
    CONFIRMED --> EXPIRED
    ACTIVE --> FAILED
    ACTIVE --> CANCELLED

# 10. Booking Status Definitions

| Status | Meaning |
|---|---|
| DRAFT | Client-side/server draft not yet submitted |
| PENDING | Booking request being validated |
| CONFIRMED | Resource/time reservation established |
| ACTIVE | Booking interval has started |
| COMPLETED | Booking interval and service completed |
| CANCELLED | Booking explicitly cancelled |
| EXPIRED | Booking was not started within policy |
| REJECTED | Booking request failed validation |
| FAILED | Booking failed due to operational/system condition |

# 11. Booking Table

`booking.bookings` is the aggregate root for the Booking domain.

It contains customer intent, platform selection, Project ownership and current
booking lifecycle state.

# 12. `booking.bookings` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| booking_id | uuid | No | UUIDv7 | Booking ID |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| platform_id | uuid | No | None | Requested Platform |
| platform_version_id | uuid | Yes | NULL | Requested Platform Version |
| platform_configuration_id | uuid | Yes | NULL | Requested Configuration |
| booking_key | varchar(100) | No | None | Project-scoped key |
| status | booking_status | No | `DRAFT` | Lifecycle |
| purpose | varchar(2000) | Yes | NULL | Booking purpose |
| requested_start_at | timestamptz | No | None | Requested start |
| requested_end_at | timestamptz | No | None | Requested end |
| timezone | varchar(64) | No | `'UTC'` | User timezone |
| requested_duration_seconds | integer | No | None | Requested duration |
| actual_start_at | timestamptz | Yes | NULL | Actual start |
| actual_end_at | timestamptz | Yes | NULL | Actual end |
| credit_reservation_id | uuid | Yes | NULL | Credit Reservation |
| idempotency_key | varchar(255) | No | None | Retry key |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Creator |
| updated_by | uuid | Yes | NULL | Last updater |
| confirmed_at | timestamptz | Yes | NULL | Confirmation |
| cancelled_at | timestamptz | Yes | NULL | Cancellation |
| completed_at | timestamptz | Yes | NULL | Completion |

# 13. Booking DDL

    CREATE SCHEMA IF NOT EXISTS booking;

    CREATE EXTENSION IF NOT EXISTS btree_gist;

    CREATE TYPE booking.booking_status AS ENUM (
        'DRAFT',
        'PENDING',
        'CONFIRMED',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED',
        'EXPIRED',
        'REJECTED',
        'FAILED'
    );

    CREATE TABLE booking.bookings (
        booking_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        platform_version_id UUID NULL,
        platform_configuration_id UUID NULL,
        booking_key VARCHAR(100) NOT NULL,
        status booking.booking_status
            NOT NULL DEFAULT 'DRAFT',
        purpose VARCHAR(2000) NULL,
        requested_start_at TIMESTAMPTZ NOT NULL,
        requested_end_at TIMESTAMPTZ NOT NULL,
        timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
        requested_duration_seconds INTEGER NOT NULL,
        actual_start_at TIMESTAMPTZ NULL,
        actual_end_at TIMESTAMPTZ NULL,
        credit_reservation_id UUID NULL,
        idempotency_key VARCHAR(255) NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        confirmed_at TIMESTAMPTZ NULL,
        cancelled_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        CONSTRAINT bookings_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT bookings_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT bookings_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT bookings_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT bookings_configuration_fk
            FOREIGN KEY (platform_configuration_id)
            REFERENCES platform.platform_configurations(platform_configuration_id)
            ON DELETE RESTRICT,
        CONSTRAINT bookings_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT bookings_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT bookings_key_unique
            UNIQUE (project_id, booking_key),
        CONSTRAINT bookings_idempotency_unique
            UNIQUE (organization_id, idempotency_key),
        CONSTRAINT bookings_time_check
            CHECK (requested_end_at > requested_start_at),
        CONSTRAINT bookings_duration_check
            CHECK (requested_duration_seconds > 0),
        CONSTRAINT bookings_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 14. Booking Indexes

    CREATE INDEX bookings_org_status_idx
        ON booking.bookings(organization_id, status);

    CREATE INDEX bookings_project_status_idx
        ON booking.bookings(project_id, status);

    CREATE INDEX bookings_platform_time_idx
        ON booking.bookings(
            platform_id,
            requested_start_at,
            requested_end_at
        );

    CREATE INDEX bookings_start_idx
        ON booking.bookings(requested_start_at);

    CREATE INDEX bookings_end_idx
        ON booking.bookings(requested_end_at);

# 15. Tenant Integrity

A Booking's `organization_id` must match the Organization owning the Project.

Where supported by the Project schema, the preferred integrity relationship is:

    (organization_id, project_id)
        ->
    project.projects(organization_id, project_id)

The application service must enforce this invariant even if PostgreSQL cannot
represent the composite reference in the initial migration.

# 16. Time Slot Table

`booking.time_slots` represents the normalized time interval used for conflict
and availability operations.

A Booking normally has one primary time slot.

Separate time slots allow future support for:

- setup time;
- execution time;
- teardown time;
- multi-resource intervals;
- staged reservations.

# 17. `booking.time_slots` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| time_slot_id | uuid | No | UUIDv7 | Time Slot ID |
| booking_id | uuid | No | None | Booking |
| slot_type | booking_slot_type | No | `EXECUTION` | Slot purpose |
| start_at | timestamptz | No | None | Start |
| end_at | timestamptz | No | None | End |
| slot_range | tstzrange | No | Generated | PostgreSQL interval |
| status | time_slot_status | No | `ACTIVE` | Slot state |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 18. Time Slot Types

    CREATE TYPE booking.booking_slot_type AS ENUM (
        'SETUP',
        'EXECUTION',
        'TEARDOWN',
        'MAINTENANCE_BUFFER'
    );

    CREATE TYPE booking.time_slot_status AS ENUM (
        'ACTIVE',
        'CANCELLED',
        'RELEASED'
    );

# 19. Time Slot DDL

    CREATE TABLE booking.time_slots (
        time_slot_id UUID PRIMARY KEY,
        booking_id UUID NOT NULL,
        slot_type booking.booking_slot_type
            NOT NULL DEFAULT 'EXECUTION',
        start_at TIMESTAMPTZ NOT NULL,
        end_at TIMESTAMPTZ NOT NULL,
        slot_range TSTZRANGE
            GENERATED ALWAYS AS (
                tstzrange(start_at, end_at, '[)')
            ) STORED,
        status booking.time_slot_status
            NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT time_slots_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES booking.bookings(booking_id)
            ON DELETE RESTRICT,
        CONSTRAINT time_slots_time_check
            CHECK (end_at > start_at)
    );

# 20. Time Slot Indexes

    CREATE INDEX time_slots_booking_idx
        ON booking.time_slots(booking_id);

    CREATE INDEX time_slots_range_gist_idx
        ON booking.time_slots
        USING GIST(slot_range);

# 21. Primary Booking Slot

The initial implementation requires exactly one `EXECUTION` slot per
Confirmed Booking.

Setup and teardown slots are optional extensions.

The application service must prevent multiple active execution slots unless
multi-stage booking support is explicitly enabled.

# 22. Resource Allocation

A Booking does not itself imply a specific Resource until allocation.

`booking.resource_allocations` records the Resource assigned to a Booking and
the exact interval during which that Resource is reserved.

This is the primary conflict-protection boundary.

# 23. `booking.resource_allocations` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| allocation_id | uuid | No | UUIDv7 | Allocation ID |
| booking_id | uuid | No | None | Booking |
| organization_id | uuid | No | None | Tenant |
| resource_id | uuid | No | None | Allocated Resource |
| robot_id | uuid | Yes | NULL | Physical Robot if applicable |
| slot_id | uuid | No | None | Time Slot |
| allocation_type | allocation_type | No | `PRIMARY` | Allocation purpose |
| start_at | timestamptz | No | None | Allocation start |
| end_at | timestamptz | No | None | Allocation end |
| allocation_range | tstzrange | No | Generated | Conflict range |
| status | allocation_status | No | `HELD` | Allocation state |
| allocated_at | timestamptz | No | `now()` | Allocation time |
| released_at | timestamptz | Yes | NULL | Release |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Actor |
| metadata | jsonb | No | `'{}'` | Evidence |

# 24. Allocation Types

    CREATE TYPE booking.allocation_type AS ENUM (
        'PRIMARY',
        'SECONDARY',
        'SETUP',
        'TEARDOWN'
    );

# 25. Allocation Status

    CREATE TYPE booking.allocation_status AS ENUM (
        'HELD',
        'CONFIRMED',
        'ACTIVE',
        'RELEASED',
        'CANCELLED',
        'EXPIRED'
    );

# 26. Resource Allocation DDL

    CREATE TABLE booking.resource_allocations (
        allocation_id UUID PRIMARY KEY,
        booking_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        resource_id UUID NOT NULL,
        robot_id UUID NULL,
        slot_id UUID NOT NULL,
        allocation_type booking.allocation_type
            NOT NULL DEFAULT 'PRIMARY',
        start_at TIMESTAMPTZ NOT NULL,
        end_at TIMESTAMPTZ NOT NULL,
        allocation_range TSTZRANGE
            GENERATED ALWAYS AS (
                tstzrange(start_at, end_at, '[)')
            ) STORED,
        status booking.allocation_status
            NOT NULL DEFAULT 'HELD',
        allocated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        released_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT allocations_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES booking.bookings(booking_id)
            ON DELETE RESTRICT,
        CONSTRAINT allocations_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT allocations_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT allocations_robot_fk
            FOREIGN KEY (robot_id)
            REFERENCES lab.robots(robot_id)
            ON DELETE RESTRICT,
        CONSTRAINT allocations_slot_fk
            FOREIGN KEY (slot_id)
            REFERENCES booking.time_slots(time_slot_id)
            ON DELETE RESTRICT,
        CONSTRAINT allocations_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT allocations_time_check
            CHECK (end_at > start_at),
        CONSTRAINT allocations_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 27. Resource Allocation Indexes

    CREATE INDEX allocations_booking_idx
        ON booking.resource_allocations(booking_id);

    CREATE INDEX allocations_resource_time_idx
        ON booking.resource_allocations(
            resource_id,
            start_at,
            end_at
        );

    CREATE INDEX allocations_resource_range_gist_idx
        ON booking.resource_allocations
        USING GIST(resource_id, allocation_range);

    CREATE INDEX allocations_status_idx
        ON booking.resource_allocations(status);

# 28. Resource Conflict Constraint

PostgreSQL exclusion constraints provide database-level protection against
overlapping allocations for the same Resource.

The conceptual rule is:

    same resource_id
        AND
    overlapping allocation_range
        AND
    active allocation
        =
    conflict

The recommended initial implementation is:

    ALTER TABLE booking.resource_allocations
    ADD CONSTRAINT allocations_resource_no_overlap
    EXCLUDE USING GIST (
        resource_id WITH =,
        allocation_range WITH &&
    )
    WHERE (
        status IN (
            'HELD',
            'CONFIRMED',
            'ACTIVE'
        )
    );

This is a critical production constraint.

# 29. Exclusion Constraint Rationale

Application-level availability checks are insufficient because:

    Request A checks availability
             |
             v
        available
             |
    Request B checks availability
             |
             v
        available
             |
       both allocate
             |
             v
          conflict

The PostgreSQL exclusion constraint makes the database the final concurrency
boundary.

# 30. Half-Open Intervals

Booking intervals use:

    [start, end)

This means:

    Booking A: 10:00 -> 11:00
    Booking B: 11:00 -> 12:00

do not overlap.

This permits contiguous bookings without artificial conflicts.

# 31. Allocation and Resource State

A Resource may be:

    AVAILABLE
    RESERVED
    BUSY
    MAINTENANCE
    OFFLINE
    FAULT
    RETIRED

The Lab domain owns these states.

Booking allocation must reject resources that are not eligible for reservation.

# 32. Platform Eligibility

A resource is eligible only when:

- Resource supports requested Platform;
- Platform Version is compatible;
- Architecture is compatible;
- Configuration is compatible;
- Resource is operationally eligible;
- Lab is operational;
- no maintenance conflict exists;
- no booking conflict exists.

# 33. Availability Model

Availability is derived from:

    Resource State
        +
    Lab State
        +
    Maintenance Windows
        +
    Availability Windows
        +
    Existing Allocations
        +
    Requested Platform
        +
    Configuration
        +
    Booking Policy
        =
    Availability

There is no single authoritative `is_available` boolean.

# 34. Booking State History

Every significant Booking state transition must be recorded.

# 35. `booking.booking_state_history` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| state_history_id | uuid | No | UUIDv7 | History ID |
| booking_id | uuid | No | None | Booking |
| organization_id | uuid | No | None | Tenant |
| from_status | booking_status | Yes | NULL | Previous state |
| to_status | booking_status | No | None | New state |
| reason_code | varchar(64) | Yes | NULL | Reason |
| reason | varchar(2000) | Yes | NULL | Explanation |
| actor_type | booking_actor_type | No | `USER` | Actor class |
| actor_id | uuid | Yes | NULL | Actor |
| created_at | timestamptz | No | `now()` | Transition time |
| metadata | jsonb | No | `'{}'` | Evidence |

# 36. State History Actor Types

    CREATE TYPE booking.booking_actor_type AS ENUM (
        'USER',
        'SYSTEM',
        'ADMIN',
        'LAB_AGENT'
    );

# 37. State History DDL

    CREATE TABLE booking.booking_state_history (
        state_history_id UUID PRIMARY KEY,
        booking_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        from_status booking.booking_status NULL,
        to_status booking.booking_status NOT NULL,
        reason_code VARCHAR(64) NULL,
        reason VARCHAR(2000) NULL,
        actor_type booking.booking_actor_type
            NOT NULL DEFAULT 'USER',
        actor_id UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT booking_history_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES booking.bookings(booking_id)
            ON DELETE RESTRICT,
        CONSTRAINT booking_history_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT booking_history_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 38. State History Indexes

    CREATE INDEX booking_history_booking_time_idx
        ON booking.booking_state_history(
            booking_id,
            created_at
        );

    CREATE INDEX booking_history_org_time_idx
        ON booking.booking_state_history(
            organization_id,
            created_at
        );

# 39. State Transition Rules

Valid initial transition:

    NULL -> DRAFT

Normal progression:

    DRAFT -> PENDING
    PENDING -> CONFIRMED
    CONFIRMED -> ACTIVE
    ACTIVE -> COMPLETED

Cancellation:

    DRAFT -> CANCELLED
    PENDING -> CANCELLED
    CONFIRMED -> CANCELLED
    ACTIVE -> CANCELLED

Other terminal transitions:

    PENDING -> REJECTED
    CONFIRMED -> EXPIRED
    ACTIVE -> FAILED

Invalid transitions must be rejected.

# 40. Cancellation Table

Cancellation is separate from Booking state because the cancellation record
contains commercial and operational evidence.

# 41. `booking.cancellations` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| cancellation_id | uuid | No | UUIDv7 | Cancellation ID |
| booking_id | uuid | No | None | Booking |
| organization_id | uuid | No | None | Tenant |
| cancellation_type | cancellation_type | No | None | Cancellation source |
| reason_code | varchar(64) | No | None | Reason |
| reason | varchar(2000) | Yes | NULL | Explanation |
| policy_result | cancellation_policy_result | No | None | Policy decision |
| refundable_amount | numeric(20,6) | No | `0` | Refundable credits |
| refund_id | uuid | Yes | NULL | Credit Refund |
| cancelled_at | timestamptz | No | `now()` | Cancellation time |
| cancelled_by | uuid | Yes | NULL | Actor |
| metadata | jsonb | No | `'{}'` | Evidence |

# 42. Cancellation Types

    CREATE TYPE booking.cancellation_type AS ENUM (
        'CUSTOMER',
        'ADMIN',
        'SYSTEM',
        'LAB',
        'ROBOT_FAULT'
    );

# 43. Cancellation Policy Result

    CREATE TYPE booking.cancellation_policy_result AS ENUM (
        'FULL_REFUND',
        'PARTIAL_REFUND',
        'NO_REFUND',
        'CREDIT_RETURN',
        'PENDING_REVIEW'
    );

# 44. Cancellation DDL

    CREATE TABLE booking.cancellations (
        cancellation_id UUID PRIMARY KEY,
        booking_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        cancellation_type booking.cancellation_type NOT NULL,
        reason_code VARCHAR(64) NOT NULL,
        reason VARCHAR(2000) NULL,
        policy_result booking.cancellation_policy_result NOT NULL,
        refundable_amount NUMERIC(20,6) NOT NULL DEFAULT 0,
        refund_id UUID NULL,
        cancelled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        cancelled_by UUID NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT cancellations_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES booking.bookings(booking_id)
            ON DELETE RESTRICT,
        CONSTRAINT cancellations_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT cancellations_actor_fk
            FOREIGN KEY (cancelled_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT cancellations_amount_check
            CHECK (refundable_amount >= 0),
        CONSTRAINT cancellations_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 45. Cancellation Indexes

    CREATE INDEX cancellations_booking_idx
        ON booking.cancellations(booking_id);

    CREATE INDEX cancellations_org_time_idx
        ON booking.cancellations(
            organization_id,
            cancelled_at
        );

# 46. Cancellation Uniqueness

A Booking may have at most one final cancellation record.

Recommended:

    CREATE UNIQUE INDEX cancellations_booking_unique
        ON booking.cancellations(booking_id);

Multiple cancellation attempts may be retained as audit events, but only one
successful cancellation record is authoritative.

# 47. Credit Reservation Relationship

Booking may reference the Credit domain reservation:

    booking.bookings.credit_reservation_id
             |
             v
    credit.reservations

The Credit domain owns the reservation state.

Booking owns the fact that a reservation is required for the Booking.

# 48. Booking Confirmation Preconditions

A Booking may transition to `CONFIRMED` only when:

1. Organization is authorized;
2. Project is active;
3. Platform is active;
4. Platform Version is eligible;
5. requested interval is valid;
6. Resource is eligible;
7. Resource has no conflicting allocation;
8. maintenance does not conflict;
9. required credits can be reserved;
10. required policy checks pass.

# 49. Confirmation Transaction

Conceptual transaction:

    BEGIN

    lock booking

    validate booking state

    resolve eligible resource

    lock / allocate resource

    reserve credits

    insert resource allocation

    transition booking -> CONFIRMED

    insert state history

    create outbox events

    COMMIT

The exact lock order must be standardized to minimize deadlocks.

# 50. Recommended Lock Order

Where multiple domains participate, use a deterministic sequence:

    Booking
      |
      v
    Wallet
      |
      v
    Resource Allocation
      |
      v
    Booking State

The implementation may use a different order if documented and consistently
applied across all callers.

# 51. Booking Creation

Creation may begin as:

    DRAFT

or directly as:

    PENDING

depending on API workflow.

For production, externally submitted bookings should normally enter `PENDING`
so validation is explicit.

# 52. Booking Availability Query

Conceptual request:

    findAvailability(
        platform_id,
        platform_version_id,
        configuration_id,
        requested_start,
        requested_end
    )

The service returns eligible resources and available intervals.

# 53. Availability Query Result

Conceptual:

    {
        "platform_id": "platform-001",
        "requested_start": "2026-10-10T10:00:00Z",
        "requested_end": "2026-10-10T10:30:00Z",
        "resources": [
            {
                "resource_id": "resource-001",
                "available": true
            }
        ]
    }

Availability is advisory until allocation succeeds transactionally.

# 54. Booking Creation Interface

Conceptual:

    createBooking(
        organization_id,
        project_id,
        platform_id,
        platform_version_id,
        configuration_id,
        start_at,
        end_at,
        idempotency_key
    )

The service validates:

- tenant;
- Project;
- platform;
- time;
- policy;
- requested duration.

# 55. Booking Confirmation Interface

Conceptual:

    confirmBooking(
        booking_id
    )

The operation must be idempotent.

Repeated confirmation of an already confirmed Booking should return the
existing authoritative state.

# 56. Booking Cancellation Interface

Conceptual:

    cancelBooking(
        booking_id,
        reason_code,
        reason
    )

The service:

1. locks Booking;
2. checks lifecycle;
3. evaluates cancellation policy;
4. releases Resource Allocation;
5. releases Credit Reservation;
6. creates cancellation record;
7. transitions Booking;
8. writes audit/outbox evidence.

# 57. Booking Rescheduling

Rescheduling must not mutate historical allocation evidence.

Preferred flow:

    Existing Booking
          |
       Cancel/Release
          |
          v
    New Time Slot
          |
          v
    New Allocation

Alternatively, a dedicated rescheduling workflow may preserve one Booking ID
with a full historical schedule trail.

The final product decision remains open.

# 58. Booking Time Zone

All persisted times use:

    TIMESTAMPTZ

The user timezone is retained separately.

Example:

    requested_start_at = 2026-10-10T04:30:00Z
    timezone = Asia/Kolkata

Display conversion occurs at the UI layer.

# 59. Booking Duration

Duration is persisted for deterministic commercial and reporting purposes.

It should correspond to:

    requested_end_at - requested_start_at

The application service must reject inconsistent input.

# 60. Resource Allocation Duration

Allocation may include operational buffers.

Example:

    Customer booking:
      10:00 -> 10:30

    Resource allocation:
      09:55 -> 10:35

This permits setup/teardown protection.

The billable duration remains controlled by Credit policy.

# 61. Maintenance Conflict

A Resource Allocation must not overlap a blocking maintenance window.

The Lab domain remains authoritative for maintenance.

The Booking service must perform a conflict check during confirmation.

# 62. Availability Window

A Resource may only be booked during an active availability window.

Availability windows are Lab-domain records.

Booking confirmation must reject allocations outside eligible availability.

# 63. Resource Configuration

A Booking may request:

- platform configuration;
- robot configuration;
- simulator configuration;
- execution profile.

The requested configuration must be compatible with the Resource.

# 64. Resource Allocation Eligibility

Allocation requires:

    resource.platform_id == booking.platform_id

and, where applicable:

    resource.configuration supports requested configuration

and:

    resource state is operationally reservable

# 65. Robot Relationship

For physical robot resources:

    Resource
       |
       v
    Robot

The Allocation may snapshot the Robot ID.

Historical Robot identity should remain available even if the current Resource
mapping changes.

# 66. Historical Snapshot

Allocation should retain:

- Resource ID;
- Robot ID;
- start;
- end;
- platform;
- configuration through referenced Booking.

Future versions may add explicit snapshots if Resource metadata can change
materially during long retention periods.

# 67. Booking and Job

A confirmed Booking may later produce one or more Jobs depending on product
policy.

Typical relationship:

    Booking
       |
       v
    Job
       |
       v
    Run

The Job domain owns execution.

# 68. Booking and Credits

Typical relationship:

    Booking
       |
       v
    Credit Reservation
       |
       v
    Consumption

A Booking cancellation should release unused reserved credits.

A completed Job should settle the reservation into consumption plus release.

# 69. Booking and Results

Results belong to Runs.

Booking remains provenance:

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

# 70. Booking Events

Recommended events:

    booking.created
    booking.pending
    booking.confirmed
    booking.active
    booking.completed
    booking.cancelled
    booking.expired
    booking.rejected
    booking.failed

Resource events:

    booking.resource.held
    booking.resource.confirmed
    booking.resource.released
    booking.resource.conflict

# 71. Booking Event Example

    {
        "protocol_version": "1.0",
        "event_id": "evt-booking-001",
        "timestamp": "2026-10-10T04:00:00Z",
        "event": "booking.confirmed",
        "resource": {
            "type": "booking",
            "id": "booking-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "data": {
            "resource_id": "resource-001",
            "start_at": "2026-10-10T04:30:00Z",
            "end_at": "2026-10-10T05:00:00Z"
        }
    }

# 72. Audit Requirements

Booking actions requiring audit include:

- create;
- submit;
- confirm;
- allocate;
- reschedule;
- cancel;
- expire;
- reject;
- activate;
- complete;
- resource reassignment;
- administrative override.

The Audit domain remains authoritative for immutable audit history.

# 73. Booking Idempotency

The following operations require idempotency:

- create;
- confirm;
- cancel;
- allocation;
- reschedule;
- release;
- expiration.

The Booking `idempotency_key` protects creation.

Domain-specific idempotency records may be used for subsequent operations.

# 74. Conflict Handling

If the exclusion constraint rejects an allocation:

    PostgreSQL exclusion violation
             |
             v
       booking conflict
             |
             v
    CONFLICT response

The service should not convert this to a generic server error.

Recommended protocol code:

    RESOURCE_UNAVAILABLE

or:

    BOOKING_CONFLICT

# 75. Booking Conflict Race

Two requests may simultaneously select the same resource.

The sequence may be:

    Request A -> availability check -> available
    Request B -> availability check -> available
    Request A -> allocation insert -> success
    Request B -> allocation insert -> exclusion violation

Request B must return a conflict and may retry resource selection.

# 76. Exclusion Constraint Scope

Only resource allocations in reserving states participate in the exclusion
constraint.

Terminal states such as:

    RELEASED
    CANCELLED
    EXPIRED

do not block future bookings.

# 77. Allocation State Transitions

    HELD
      |
      v
    CONFIRMED
      |
      v
    ACTIVE
      |
      v
    RELEASED

Alternative:

    HELD -> CANCELLED
    HELD -> EXPIRED
    CONFIRMED -> CANCELLED

# 78. Allocation Hold

`HELD` is a short-lived transactional reservation state.

A held allocation should have a timeout.

If confirmation fails:

    HELD -> RELEASED / CANCELLED

Stale held allocations must be reconciled.

# 79. Booking Expiration

A pending booking may expire if:

- user does not complete confirmation;
- payment/credit reservation times out;
- allocation hold expires;
- booking window has passed.

Expiration is system-generated and audited.

# 80. Cancellation Policy

Cancellation may depend on:

- time before start;
- booking status;
- actual usage;
- credit reservation state;
- platform policy;
- administrative override.

The Booking schema stores the policy outcome, while policy calculation
belongs to the application service.

# 81. Cancellation and Credits

Example:

    Booking
      |
      +-- reserved 450 credits
      |
      +-- cancellation before execution
                  |
                  v
             release 450

Another example:

    Booking
      |
      +-- reserved 450
      |
      +-- 150 consumed
      |
      +-- cancellation
                  |
                  +--> consume 150
                  +--> release 300

# 82. Booking Retention

Booking metadata should generally be retained long-term.

Recommended:

| Data | Retention |
|---|---|
| Booking | Long-term / policy |
| Time Slot | Long-term |
| Resource Allocation | Long-term |
| State History | Long-term |
| Cancellation | Long-term |
| Conflict evidence | Policy-based |
| Operational metadata | Policy-based |

Bookings may form commercial and operational evidence and should not be
hard-deleted casually.

# 83. Privacy

Booking data may include:

- user identity;
- organization;
- project;
- purpose text;
- robot usage history.

Privacy controls must include:

- tenant isolation;
- authorization;
- retention;
- actor anonymization where permitted;
- export;
- audit.

# 84. Booking Deletion

Generic deletion is not recommended.

A Booking should normally become:

    CANCELLED
    COMPLETED
    EXPIRED

rather than being physically deleted.

# 85. Historical Resource Data

Historical allocations must remain queryable after:

- Resource retirement;
- Robot retirement;
- Platform deprecation.

Foreign keys therefore use `ON DELETE RESTRICT`.

# 86. Repository Interfaces

Recommended repositories:

    BookingRepository
    TimeSlotRepository
    ResourceAllocationRepository
    BookingStateHistoryRepository
    CancellationRepository

# 87. Booking Repository

Operations:

    create
    get
    list_by_project
    list_by_organization
    get_for_update
    transition_state
    complete
    expire

# 88. Time Slot Repository

Operations:

    create
    get
    update
    cancel
    list_by_booking
    find_overlaps

The actual final conflict authority remains the PostgreSQL exclusion
constraint.

# 89. Resource Allocation Repository

Operations:

    create
    get
    get_for_update
    release
    activate
    find_conflicts
    list_by_resource
    list_by_booking

Allocation insertion must surface exclusion violations as domain conflicts.

# 90. State History Repository

Operations:

    append
    list_by_booking
    latest

History is append-only.

# 91. Cancellation Repository

Operations:

    create
    get_by_booking
    list_by_organization

Cancellation records are append-oriented and should not be updated after
finalization except through explicitly defined administrative corrections.

# 92. Application Services

Recommended:

    BookingService
    AvailabilityService
    BookingAllocationService
    BookingCancellationService
    BookingSchedulingService
    BookingPolicyService
    BookingReconciliationService

# 93. Booking Service Responsibilities

BookingService owns:

- creation;
- submission;
- lifecycle transition;
- authorization;
- orchestration.

It does not own:

- resource operational state;
- credit ledger;
- Job execution.

# 94. Availability Service Responsibilities

AvailabilityService resolves:

- eligible resources;
- available intervals;
- platform compatibility;
- maintenance conflicts;
- existing allocations.

Its answer is advisory until a transaction creates an allocation.

# 95. Allocation Service Responsibilities

AllocationService:

1. validates Resource;
2. validates interval;
3. inserts allocation;
4. relies on exclusion constraint;
5. handles conflict;
6. returns authoritative allocation.

# 96. Cancellation Service Responsibilities

CancellationService:

1. locks Booking;
2. validates state;
3. evaluates policy;
4. releases allocation;
5. releases credits;
6. records cancellation;
7. transitions state;
8. emits event.

# 97. Reconciliation Service

Reconciliation checks:

    Booking
       |
       +--> Allocation
       |
       +--> Credit Reservation
       |
       +--> Job
       |
       v
    Consistency

Examples:

    CONFIRMED booking without allocation
    allocation without confirmed booking
    booking without credit reservation
    stale HELD allocation
    completed booking with unreleased reservation

# 98. Database Transaction Boundaries

Booking confirmation should atomically establish:

- Booking state;
- Resource Allocation;
- Credit Reservation linkage;
- state history;
- outbox event.

Cross-domain financial operations should use the Credit application service
rather than direct table writes.

# 99. Cross-Domain Write Rule

Booking code must not directly update:

    credit.wallets
    credit.ledger_entries
    credit.reservations

Instead:

    Booking Service
          |
          v
    CreditReservationService

Similarly, Booking does not directly modify Lab Resource state.

# 100. Transaction Failure

If confirmation fails:

    Booking
       |
       v
    rollback

No partial confirmed state may remain.

If an external side effect is involved, reconciliation must resolve the
intermediate state.

# 101. Availability Query Performance

Primary access patterns:

- resource availability by time range;
- booking list by Organization;
- booking list by Project;
- allocation list by Resource;
- active allocations by interval;
- booking history by Booking.

The GiST range index is required for efficient overlap queries.

# 102. Conflict Query

Conceptual SQL:

    SELECT allocation_id
    FROM booking.resource_allocations
    WHERE resource_id = :resource_id
      AND status IN ('HELD', 'CONFIRMED', 'ACTIVE')
      AND allocation_range && tstzrange(
          :start_at,
          :end_at,
          '[)'
      );

This query is advisory.

The exclusion constraint remains authoritative.

# 103. Resource-Level Exclusion

The final database rule is:

    resource_id + overlapping active range
        =
    prohibited

This is stronger than an application-only uniqueness check.

# 104. Multi-Resource Booking

The schema supports multiple allocations per Booking.

Example:

    Booking
      |
      +--> Resource A
      |
      +--> Resource B

This supports future workflows such as:

- robot + GPU;
- robot + workstation;
- robot + simulator;
- multi-resource experiments.

The initial MVP may restrict a Booking to one PRIMARY allocation.

# 105. Allocation Type Policy

Initial MVP:

    one PRIMARY allocation

Future:

    PRIMARY
    SECONDARY
    SETUP
    TEARDOWN

Each allocation independently participates in conflict protection.

# 106. Booking Slot Policy

Initial MVP:

    one EXECUTION slot

Future:

    SETUP
    EXECUTION
    TEARDOWN

This enables operational buffers without changing the core Booking identity.

# 107. Example Booking

    booking_id:
      0194c7d0-8b00-7abc-9def-800000000001

    organization_id:
      0194c7d0-8b00-7abc-9def-200000000001

    project_id:
      0194c7d0-8b00-7abc-9def-300000000001

    platform_id:
      0194c7d0-8b00-7abc-9def-500000000001

    booking_key:
      vision-test-001

    status:
      CONFIRMED

    requested_start_at:
      2026-10-10T04:30:00Z

    requested_end_at:
      2026-10-10T05:00:00Z

# 108. Example Time Slot

    time_slot_id:
      0194c7d0-8b00-7abc-9def-800000000002

    booking_id:
      0194c7d0-8b00-7abc-9def-800000000001

    slot_type:
      EXECUTION

    start_at:
      2026-10-10T04:30:00Z

    end_at:
      2026-10-10T05:00:00Z

# 109. Example Allocation

    allocation_id:
      0194c7d0-8b00-7abc-9def-800000000003

    resource_id:
      0194c7d0-8b00-7abc-9def-600000000001

    allocation_type:
      PRIMARY

    status:
      CONFIRMED

    start_at:
      2026-10-10T04:30:00Z

    end_at:
      2026-10-10T05:00:00Z

# 110. Example State History

    from_status:
      PENDING

    to_status:
      CONFIRMED

    actor_type:
      USER

    reason_code:
      RESOURCE_ALLOCATED

# 111. Example Cancellation

    cancellation_type:
      CUSTOMER

    reason_code:
      USER_CANCELLED

    policy_result:
      FULL_REFUND

    refundable_amount:
      450

# 112. Complete Booking Relationship Diagram

    organization.organizations
              |
              v
       project.projects
              |
              v
       booking.bookings
          |       |
          |       +--> booking.booking_state_history
          |
          +--> booking.time_slots
          |
          +--> booking.resource_allocations
          |
          +--> booking.cancellations
          |
          +--> credit.reservations
          |
          +--> execution.jobs

# 113. Platform Relationship

    booking.bookings
          |
          +--> platform.platforms
          |
          +--> platform.platform_versions
          |
          +--> platform.platform_configurations

The Platform domain remains authoritative.

# 114. Resource Relationship

    booking.resource_allocations
          |
          +--> lab.resources
          |
          +--> lab.robots

The Lab domain remains authoritative.

# 115. Credit Relationship

    booking.bookings
          |
          v
    credit.reservations
          |
          v
    credit.wallets
          |
          v
    credit.ledger_transactions

# 116. Execution Relationship

    booking.bookings
          |
          v
    execution.jobs
          |
          v
    execution.runs
          |
          v
    result.results

# 117. Booking Availability Flow

    User
      |
      v
    Select Platform
      |
      v
    Select Configuration
      |
      v
    Request Time
      |
      v
    Availability Service
      |
      +--> Platform validation
      +--> Resource validation
      +--> Maintenance check
      +--> Allocation conflict check
      |
      v
    Candidate Resources

# 118. Booking Confirmation Flow

    Candidate Resource
          |
          v
    Booking PENDING
          |
          v
    Price Credits
          |
          v
    Reserve Credits
          |
          v
    Insert Allocation
          |
          +---- conflict --> retry / reject
          |
          v
    Booking CONFIRMED

# 119. Booking Execution Flow

    CONFIRMED
        |
        v
    Start Time
        |
        v
    ACTIVE
        |
        v
    Job
        |
        v
    Run
        |
        v
    COMPLETE
        |
        v
    Release Allocation
        |
        v
    Settle Credit Reservation

# 120. Booking Cancellation Flow

    CONFIRMED
        |
    cancel request
        |
        v
    Cancellation Policy
        |
        +--> Refund decision
        |
        v
    Release Allocation
        |
        v
    Release Credit Reservation
        |
        v
    CANCELLED

# 121. Phase 0 Mapping

Phase 0 establishes:

- Booking domain ownership;
- Organization tenancy;
- PostgreSQL authority;
- UTC time storage;
- resource allocation boundary;
- exclusion-constraint strategy.

# 122. Phase 1 Mapping

Phase 1 implements:

- Organization;
- Project;
- Booking identity;
- authorization;
- basic Booking lifecycle.

# 123. Phase 2 Mapping

Phase 2 implements:

- Platform relationship;
- Platform Version;
- Configuration;
- Time Slots;
- basic availability.

# 124. Phase 3 Mapping

Phase 3 implements:

- Resource Allocation;
- PostgreSQL exclusion constraints;
- state history;
- concurrency protection;
- reconciliation.

# 125. Phase 4 Mapping

Phase 4 is the primary Booking/Credit phase:

- credit pricing;
- credit reservation;
- Booking confirmation;
- cancellation;
- refund policy;
- resource conflict handling.

# 126. Phase 5 Mapping

Phase 5 integrates:

- Booking with Job;
- execution start;
- resource activation;
- actual usage;
- credit consumption;
- release.

# 127. Phase 6 Mapping

Phase 6 integrates:

- physical robot scheduling;
- Lab Agent;
- maintenance;
- resource health;
- robot fault cancellation;
- operational booking policies.

# 128. Phase 7 Mapping

Phase 7 integrates:

- Results;
- Experiments;
- booking provenance;
- usage analytics;
- customer booking history;
- audit.

# 129. Phase 8 Mapping

Phase 8 completes:

- production scheduling;
- retention;
- privacy;
- capacity;
- reconciliation;
- operational monitoring;
- disaster recovery;
- performance hardening.

# 130. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Double booking | Critical | PostgreSQL exclusion constraint |
| Race condition | Critical | Transactional allocation |
| Cross-tenant booking | Critical | Organization constraints |
| Wrong platform | Critical | Platform compatibility validation |
| Resource unavailable | High | Availability + allocation validation |
| Maintenance conflict | High | Maintenance-window validation |
| Credit reservation failure | High | Transactional Credit service |
| Stale allocation | High | Expiration/reconciliation |
| Incorrect cancellation refund | High | Credit policy + transactional refund |
| Time-zone error | High | UTC `timestamptz` + explicit timezone |
| Booking mutation | Medium | State machine + history |
| Resource retirement | Medium | Restrictive historical references |
| Duplicate booking request | High | Idempotency |
| Deadlock | High | Deterministic lock order |
| Availability race | Critical | Database exclusion constraint |
| Partial confirmation | Critical | Transaction boundary |
| Lab outage | High | Resource health validation |
| Robot fault | High | Operational cancellation/refund |
| Capacity overload | Medium | Availability and rate limits |

# 131. Open Questions

1. Final booking minimum duration.
2. Final maximum booking duration.
3. Whether users can book arbitrary future dates.
4. Final booking lead time.
5. Final cancellation cutoff.
6. Final cancellation refund policy.
7. Final no-show policy.
8. Final grace period.
9. Final setup/teardown buffers.
10. Whether setup/teardown are billable.
11. Whether one Booking may contain multiple Resources in MVP.
12. Final resource allocation policy.
13. Whether users select a specific Resource or only a Platform.
14. Whether automatic resource selection is default.
15. Final scheduling priority policy.
16. Whether enterprise customers receive priority.
17. Final waitlist model.
18. Whether rescheduling preserves Booking ID.
19. Final over-consumption policy.
20. Final booking extension policy.
21. Final booking timezone display policy.
22. Final maintenance buffer policy.
23. Final no-show credit handling.
24. Final robot-fault refund policy.
25. Whether simulator bookings use the same model.
26. Whether GPU/workstation bookings use the same model.
27. Whether multi-resource bookings are required for MVP.
28. Final scheduling horizon.
29. Final reconciliation frequency.
30. Final calendar integration requirements.

# 132. Acceptance Criteria — Booking Identity

- [ ] `booking` schema exists.
- [ ] `bookings` table exists.
- [ ] Booking uses UUIDv7.
- [ ] Organization ownership is mandatory.
- [ ] Project ownership is mandatory.
- [ ] Platform is mandatory.
- [ ] Booking key is unique within Project.
- [ ] Idempotency key is unique within Organization.
- [ ] Booking lifecycle is implemented.
- [ ] Creation/update audit fields exist.
- [ ] Requested start and end are mandatory.
- [ ] End must be after start.
- [ ] Duration must be positive.

# 133. Acceptance Criteria — Time Slots

- [ ] Time Slot table exists.
- [ ] Time Slot references Booking.
- [ ] Start/end are stored as `timestamptz`.
- [ ] End is after start.
- [ ] PostgreSQL `tstzrange` is used.
- [ ] Half-open `[)` intervals are used.
- [ ] Execution slot is supported.
- [ ] Setup slot is supported.
- [ ] Teardown slot is supported.
- [ ] GiST range index exists.
- [ ] Initial MVP enforces one active execution slot.

# 134. Acceptance Criteria — Resource Allocation

- [ ] Resource Allocation table exists.
- [ ] Allocation references Booking.
- [ ] Allocation references Organization.
- [ ] Allocation references Resource.
- [ ] Allocation can reference Robot.
- [ ] Allocation references Time Slot.
- [ ] Allocation lifecycle is implemented.
- [ ] Allocation range uses `tstzrange`.
- [ ] Allocation timestamps are validated.
- [ ] Allocation status is constrained.
- [ ] Allocation creation is transactional.

# 135. Acceptance Criteria — Conflict Protection

- [ ] `btree_gist` is available.
- [ ] Resource allocation has GiST range support.
- [ ] Resource/time exclusion constraint exists.
- [ ] HELD allocations participate in conflict detection.
- [ ] CONFIRMED allocations participate.
- [ ] ACTIVE allocations participate.
- [ ] RELEASED allocations do not block.
- [ ] CANCELLED allocations do not block.
- [ ] EXPIRED allocations do not block.
- [ ] Adjacent `[start,end)` bookings do not conflict.
- [ ] Concurrent allocation tests pass.

# 136. Acceptance Criteria — Booking Lifecycle

- [ ] DRAFT state exists.
- [ ] PENDING state exists.
- [ ] CONFIRMED state exists.
- [ ] ACTIVE state exists.
- [ ] COMPLETED state exists.
- [ ] CANCELLED state exists.
- [ ] EXPIRED state exists.
- [ ] REJECTED state exists.
- [ ] FAILED state exists.
- [ ] Invalid transitions are rejected.
- [ ] State transitions are audited.
- [ ] State history is append-only.

# 137. Acceptance Criteria — State History

- [ ] State history table exists.
- [ ] Every significant transition creates history.
- [ ] Previous state is stored.
- [ ] New state is stored.
- [ ] Reason code is supported.
- [ ] Reason text is supported.
- [ ] Actor type is supported.
- [ ] Actor identity is supported.
- [ ] Timestamp is stored.
- [ ] History cannot be silently deleted.

# 138. Acceptance Criteria — Cancellation

- [ ] Cancellation table exists.
- [ ] Cancellation references Booking.
- [ ] Organization ownership is stored.
- [ ] Cancellation type is constrained.
- [ ] Reason code is required.
- [ ] Policy result is stored.
- [ ] Refundable amount is stored.
- [ ] Credit Refund can be referenced.
- [ ] Cancellation actor is stored.
- [ ] One authoritative cancellation exists per Booking.
- [ ] Cancellation releases resource allocation.
- [ ] Cancellation releases unused credits.
- [ ] Cancellation is audited.

# 139. Acceptance Criteria — Availability

- [ ] Platform eligibility is checked.
- [ ] Platform Version compatibility is checked.
- [ ] Configuration compatibility is checked.
- [ ] Resource state is checked.
- [ ] Lab state is checked.
- [ ] Maintenance windows are checked.
- [ ] Existing allocations are checked.
- [ ] Availability query is advisory.
- [ ] Final allocation is transactionally authoritative.

# 140. Acceptance Criteria — Credit Integration

- [ ] Booking can reference Credit Reservation.
- [ ] Confirmation requires sufficient credit reservation.
- [ ] Booking does not directly mutate wallet balances.
- [ ] Credit Reservation Service owns reservation logic.
- [ ] Cancellation releases unused reservation.
- [ ] Job completion settles reservation.
- [ ] Consumption is linked to execution.
- [ ] Refund policy is preserved.

# 141. Acceptance Criteria — Tenancy

- [ ] Every customer Booking has Organization ownership.
- [ ] Project and Booking Organizations must match.
- [ ] Allocation tenant matches Booking tenant.
- [ ] State history tenant matches Booking tenant.
- [ ] Cancellation tenant matches Booking tenant.
- [ ] Cross-tenant Booking access is rejected.
- [ ] Cross-tenant allocation is rejected.
- [ ] Tenant isolation tests pass.

# 142. Acceptance Criteria — Concurrency

- [ ] Booking confirmation is transactional.
- [ ] Resource allocation is concurrency-safe.
- [ ] Exclusion violations become domain conflicts.
- [ ] Duplicate requests are idempotent.
- [ ] Concurrent cancellation is safe.
- [ ] Concurrent confirmation is safe.
- [ ] Concurrent allocation is safe.
- [ ] Stale holds are reconciled.
- [ ] Deadlock scenarios are tested.

# 143. Acceptance Criteria — Time Handling

- [ ] All persisted booking times use UTC-capable `timestamptz`.
- [ ] User timezone is retained.
- [ ] Interval comparison is timezone-safe.
- [ ] DST transitions are tested.
- [ ] Half-open intervals are used.
- [ ] Adjacent intervals are permitted.
- [ ] Duration consistency is validated.

# 144. Acceptance Criteria — Retention

- [ ] Bookings are not generically hard-deleted.
- [ ] State history follows retention policy.
- [ ] Resource allocations remain historically resolvable.
- [ ] Cancellation evidence is retained.
- [ ] Financially relevant booking evidence is retained.
- [ ] Privacy policy is documented.
- [ ] Export supports Booking history.
- [ ] Retention jobs are idempotent.

# 145. Acceptance Criteria — Integration

- [ ] Organization integration passes.
- [ ] Project integration passes.
- [ ] Platform integration passes.
- [ ] Lab Resource integration passes.
- [ ] Credit Reservation integration passes.
- [ ] Job integration passes.
- [ ] Run provenance passes.
- [ ] Result provenance passes.
- [ ] Audit integration passes.
- [ ] Outbox integration passes.

# 146. Acceptance Criteria — Operations

- [ ] Booking migrations are version controlled.
- [ ] CI validates migrations.
- [ ] Exclusion constraints are tested.
- [ ] Availability queries are indexed.
- [ ] Booking conflict metrics exist.
- [ ] Allocation failure metrics exist.
- [ ] Reconciliation exists.
- [ ] Backup/restore includes Booking state.
- [ ] Production migration procedure exists.

# 147. Acceptance Criteria — Security

- [ ] Booking APIs require authentication.
- [ ] Organization authorization is enforced.
- [ ] Project membership is checked.
- [ ] Administrative cancellation is authorized.
- [ ] Resource identifiers are not authorization boundaries.
- [ ] Cross-tenant resource allocation is prevented.
- [ ] Booking history is protected.
- [ ] Cancellation records are protected.
- [ ] Administrative overrides are audited.

# 148. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Booking domain ownership accepted.
- [ ] UTC time model accepted.
- [ ] Resource allocation boundary accepted.
- [ ] Exclusion constraint strategy accepted.

Phase 1:

- [ ] Organization and Project integration complete.
- [ ] Booking identity complete.
- [ ] Basic lifecycle complete.

Phase 2:

- [ ] Platform integration complete.
- [ ] Time Slot implementation complete.
- [ ] Availability queries complete.

Phase 3:

- [ ] Resource Allocation complete.
- [ ] Exclusion constraints complete.
- [ ] State history complete.
- [ ] Concurrency tests pass.

Phase 4:

- [ ] Credit reservation integrated.
- [ ] Confirmation workflow complete.
- [ ] Cancellation/refund workflow complete.

Phase 5:

- [ ] Job integration complete.
- [ ] Execution activation complete.
- [ ] Credit consumption complete.
- [ ] Resource release complete.

Phase 6:

- [ ] Physical robot scheduling complete.
- [ ] Lab Agent integration complete.
- [ ] Maintenance/fault handling complete.

Phase 7:

- [ ] Result provenance complete.
- [ ] Usage analytics complete.
- [ ] Audit integration complete.

Phase 8:

- [ ] Production scheduling complete.
- [ ] Retention complete.
- [ ] Reconciliation complete.
- [ ] Backup/restore validated.
- [ ] Capacity/performance validated.
- [ ] Production acceptance complete.

# 149. Final Invariants

The following invariants are mandatory:

1. Every customer Booking belongs to exactly one Organization.
2. Every Booking belongs to exactly one Project.
3. Booking and Project Organizations must match.
4. Every Booking targets exactly one Platform.
5. Booking intervals are valid and end after start.
6. Persisted times use `timestamptz`.
7. User timezone is stored separately.
8. Resource allocation is the authoritative scheduling reservation.
9. Active allocations cannot overlap for the same Resource.
10. PostgreSQL exclusion constraints enforce the final conflict boundary.
11. Availability checks are advisory until allocation succeeds.
12. Booking state transitions are validated.
13. State history is append-only.
14. Cancellation is separately recorded.
15. Cancellation releases eligible resource allocations.
16. Cancellation releases unused Credit Reservations.
17. Booking does not directly modify Credit Wallet balances.
18. Booking does not directly modify Lab Resource state.
19. Historical Resource and Robot identities remain resolvable.
20. Confirmed Bookings require eligible resources.
21. Confirmed Bookings require required credit authorization.
22. Duplicate Booking creation is idempotent.
23. Concurrent Booking requests cannot double allocate a Resource.
24. Stale allocations are recoverable.
25. Financially relevant Booking history is retained.
26. Cross-tenant Booking access is prohibited.
27. Administrative actions are audited.
28. Resource state remains owned by the Lab domain.
29. Platform state remains owned by the Platform domain.
30. Execution state remains owned by the Job/Run domain.
31. Credit state remains owned by the Credit domain.
32. Booking is the authoritative customer scheduling record.

# 150. Final Architecture Statement

> **A Kritva RaaS Booking is the authoritative scheduling contract between an
> Organization and an eligible robotic resource for a defined time interval.
> The Booking domain owns customer scheduling state, while Platform, Lab,
> Credit and Execution domains retain ownership of their respective concerns.**
>
> **Availability is derived rather than represented by a single boolean. It
> combines Platform eligibility, Resource state, Lab state, maintenance
> windows, existing allocations, configuration compatibility and booking
> policy. Availability queries are advisory; the PostgreSQL resource-allocation
> exclusion constraint is the final concurrency boundary.**
>
> **Resource allocations use half-open UTC time ranges and PostgreSQL GiST
> exclusion constraints so two concurrent requests cannot reserve the same
> Resource for overlapping intervals. This prevents double booking even when
> multiple clients perform availability checks simultaneously.**
>
> **Credit reservation is coordinated through the Credit domain rather than
> through direct wallet mutation. A confirmed Booking protects the required
> credits, while execution converts the reservation into consumption and
> releases unused capacity. Cancellation applies explicit policy and preserves
> both scheduling and financial evidence.**
>
> **The Booking domain therefore provides the scheduling foundation for the
> Kritva RaaS flow:
> Discover Platform → Check Availability → Reserve Credits → Confirm Booking
> → Allocate Resource → Execute Job → Run Robot → Consume Credits → Release
> Resource → Complete or Cancel.**
