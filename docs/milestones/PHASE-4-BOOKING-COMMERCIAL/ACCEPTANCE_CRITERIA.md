# PHASE-4-BOOKING-COMMERCIAL — Acceptance Criteria

Milestone: PHASE-4-BOOKING-COMMERCIAL — Resources, Availability, Booking, Credits and Commercial Model

## 6 Acceptance criteria

### 6.1 Resource catalog

- [ ] Labs can be created and queried.
- [ ] Robots have stable identities.
- [ ] Resources have stable identities.
- [ ] Resource types are explicit.
- [ ] Resource lifecycle is enforced.
- [ ] Robot/resource relationship is enforced.
- [ ] Platform eligibility is represented.
- [ ] Resource configuration is represented.
- [ ] Retired resources cannot be newly booked.

### 6.2 Maintenance

- [ ] Maintenance windows can be created.
- [ ] Maintenance windows remove resources from effective availability.
- [ ] Maintenance state is enforced.
- [ ] Active maintenance prevents booking.
- [ ] Emergency maintenance can invalidate future availability.
- [ ] Existing booking handling is policy-controlled.
- [ ] Maintenance events are auditable.

### 6.3 Availability

- [ ] Availability query accepts platform.
- [ ] Availability query accepts configuration.
- [ ] Availability query accepts time range.
- [ ] Availability considers resource state.
- [ ] Availability considers lab state.
- [ ] Availability considers maintenance.
- [ ] Availability considers availability windows.
- [ ] Availability considers existing allocations.
- [ ] Availability considers platform eligibility.
- [ ] Availability considers capacity.
- [ ] Availability is clearly marked advisory.
- [ ] Booking revalidates availability.

### 6.4 Booking

- [ ] Booking creation works.
- [ ] Booking lifecycle is enforced.
- [ ] Time slots are represented.
- [ ] Resource allocations are represented.
- [ ] Primary resource is identified.
- [ ] Secondary resources are supported where required.
- [ ] Booking confirmation is transactional.
- [ ] Booking state history is persisted.
- [ ] Booking cancellation is supported.
- [ ] Booking expiration is supported.
- [ ] Booking completion is supported.

### 6.5 Double-booking

- [ ] Resource allocation uses time ranges.
- [ ] Active allocations cannot overlap.
- [ ] PostgreSQL exclusion constraint is enabled.
- [ ] Concurrent booking attempts are tested.
- [ ] Exactly one conflicting booking succeeds.
- [ ] Failed transaction leaves no active allocation.
- [ ] Retried request does not create duplicate allocation.

### 6.6 Credits

- [ ] Credit types are platform-specific.
- [ ] Credit plans exist.
- [ ] Student plan is supported.
- [ ] Developer plan is supported.
- [ ] Research plan is supported.
- [ ] Rate cards are effective-dated.
- [ ] Historical rate cards remain immutable.
- [ ] Wallet exists per organization and credit type.
- [ ] Wallet balance is consistent with ledger.
- [ ] Credit reservations are supported.
- [ ] Credit consumption is supported.
- [ ] Credit release is supported.
- [ ] Credit refund is supported.

### 6.7 Quote

- [ ] Quote is calculated from authoritative rate card.
- [ ] Quote identifies platform.
- [ ] Quote identifies configuration.
- [ ] Quote identifies duration.
- [ ] Quote identifies rate version.
- [ ] Quote identifies required credits.
- [ ] Quote does not mutate wallet.
- [ ] Quote does not mutate ledger.
- [ ] Quote expiration is supported where required.

Example:

    Platform: KRV-ARM
    Rate: 15 credits/minute
    Duration: 30 minutes

    Quote = 450 credits

### 6.8 Ledger

- [ ] Ledger transactions are append-only.
- [ ] Ledger entries are immutable.
- [ ] Transactions balance.
- [ ] Debit/credit direction is explicit.
- [ ] Reservation movement is traceable.
- [ ] Consumption is traceable.
- [ ] Refund is traceable.
- [ ] Wallet updates are atomic with ledger posting.
- [ ] Corrections use compensating entries.
- [ ] Ledger cannot be silently rewritten.

### 6.9 Credit reservation

- [ ] Reservation is created atomically.
- [ ] Insufficient credit blocks reservation.
- [ ] Reservation is linked to booking.
- [ ] Reservation has expiration policy.
- [ ] Successful booking consumes/holds reservation appropriately.
- [ ] Cancellation releases or refunds according to policy.
- [ ] Duplicate reservation requests are idempotent.

### 6.10 Consumption

- [ ] Consumption references booking.
- [ ] Consumption references reservation.
- [ ] Consumption references rate version.
- [ ] Consumption quantity is explicit.
- [ ] Consumption is auditable.
- [ ] Consumption cannot exceed authorized policy.
- [ ] Partial consumption is supported where required.

### 6.11 Cancellation/refund

- [ ] Customer cancellation works.
- [ ] Admin cancellation works.
- [ ] System cancellation works.
- [ ] Lab cancellation works.
- [ ] Robot-fault cancellation works.
- [ ] Cancellation policy is evaluated.
- [ ] Full refund works.
- [ ] Partial refund works.
- [ ] No-refund outcome works.
- [ ] Credit return works.
- [ ] Refund is auditable.
- [ ] Refund cannot double-credit the wallet.

### 6.12 Commercial records

- [ ] Invoice exists.
- [ ] Invoice lines reference commercial events.
- [ ] Invoice totals are consistent.
- [ ] Payment metadata is provider-neutral.
- [ ] Payment callback is idempotent.
- [ ] Refund metadata is represented.
- [ ] Reconciliation detects inconsistencies.

### 6.13 Authorization

- [ ] Only authorized users can book.
- [ ] Only authorized users can view organization wallet.
- [ ] Only authorized users can modify bookings.
- [ ] Only authorized administrators can modify rate cards.
- [ ] Only authorized administrators can modify resource availability.
- [ ] Cross-tenant access fails.
- [ ] Financial records are tenant isolated.

### 6.14 Audit

- [ ] Booking creation is audited.
- [ ] Booking confirmation is audited.
- [ ] Booking cancellation is audited.
- [ ] Allocation changes are audited.
- [ ] Credit reservation is audited.
- [ ] Credit consumption is audited.
- [ ] Refund is audited.
- [ ] Rate-card changes are audited.
- [ ] Payment events are audited.
- [ ] Reconciliation findings are auditable.

### 6.15 Studio

- [ ] Platform selection works.
- [ ] Resource availability is visible.
- [ ] Booking quote is visible.
- [ ] Credit balance is visible.
- [ ] Required credits are visible.
- [ ] Remaining balance is visible.
- [ ] Booking confirmation requires authoritative server response.
- [ ] Booking history works.
- [ ] Cancellation status works.
- [ ] Commercial history is visible.

### 6.16 Financial invariants

The following must always hold:

    Ledger Debits = Ledger Credits

    Wallet Balance =
        Opening Balance
        + Credits
        - Debits
        + Refunds
        - Consumed Credits
        +/- Authorized Adjustments

    Reserved Credits <= Available Credits

    Consumed Credits <= Authorized Reservation

No operation may create negative available credit unless explicitly permitted by a future approved credit policy.

### 6.17 Scheduling invariants

- [ ] No active resource allocations overlap.
- [ ] Resource cannot be allocated while unavailable.
- [ ] Maintenance excludes new bookings.
- [ ] Retired resources cannot be booked.
- [ ] Platform-incompatible resource cannot be booked.
- [ ] Booking confirmation revalidates all constraints.
- [ ] Booking state and allocation state remain consistent.

### 6.18 Cross-domain exit

The mandatory flow is:

    Studio
      |
      v
    Organization
      |
      v
    Platform
      |
      v
    Resource
      |
      v
    Availability
      |
      v
    Quote
      |
      v
    Credit Reservation
      |
      v
    Booking Confirmation
      |
      v
    Resource Allocation
      |
      v
    Execution-Ready State
      |
      v
    Completion / Cancellation
      |
      v
    Credit Consumption / Release / Refund
      |
      v
    Commercial Record

All stages must use authoritative services.

### 6.19 No-go conditions

Phase 4 shall not close if:

- [ ] double booking is possible;
- [ ] wallet and ledger can diverge;
- [ ] ledger can be silently modified;
- [ ] credit reservation can exceed balance;
- [ ] refund can be applied twice;
- [ ] historical rate can be mutated;
- [ ] booking can bypass authorization;
- [ ] cross-tenant wallet access succeeds;
- [ ] availability is treated as booking authority;
- [ ] payment callbacks are not idempotent;
- [ ] financial state depends only on client-side calculations.

---
