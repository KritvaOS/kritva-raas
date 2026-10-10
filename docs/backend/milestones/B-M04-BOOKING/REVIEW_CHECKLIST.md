# B-M04-BOOKING — Review Checklist

Milestone: B-M04 — Booking

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

## 7.1 Test Pyramid

    Unit Tests
       |
       v
    Repository Tests
       |
       v
    Financial Invariant Tests
       |
       v
    Concurrency Tests
       |
       v
    API Contract Tests
       |
       v
    Integration Tests
       |
       v
    Payment Adapter Tests
       |
       v
    End-to-End Booking Tests
       |
       v
    Reconciliation Tests

## 7.2 Availability Tests

Test:

- available resource;
- maintenance;
- fault;
- offline lab;
- existing allocation;
- overlapping request;
- timezone;
- minimum duration;
- unavailable platform;
- incompatible configuration.

Expected availability must be deterministic.

## 7.3 Booking State Tests

Test every allowed transition.

Example:

    DRAFT -> PENDING
    PENDING -> CONFIRMED
    PENDING -> REJECTED
    CONFIRMED -> ACTIVE
    CONFIRMED -> CANCELLED
    ACTIVE -> COMPLETED
    ACTIVE -> FAILED

Attempt invalid transitions.

Expected:

    CONFLICT / INVALID_STATE_TRANSITION

## 7.4 Concurrency Tests

Two clients request:

    Resource R1
    10:00 - 11:00

simultaneously.

Expected:

    Booking A -> CONFIRMED
    Booking B -> REJECTED / CONFLICT

The database must provide the final protection.

## 7.5 Credit Reservation Concurrency

Wallet:

    Available = 500

Two bookings request:

    300
    300

Expected:

    First reservation = 300
    Second reservation = rejected

Final:

    Available = 200
    Reserved = 300

No negative available balance.

## 7.6 Ledger Tests

Verify:

- balanced transaction;
- immutable entries;
- reservation transaction;
- release transaction;
- consumption transaction;
- refund transaction;
- compensating correction.

## 7.7 Wallet Reconciliation

Calculate:

    Expected Wallet
      =
    Opening Balance
    + Credits
    - Reservations
    - Consumption
    + Releases
    + Refunds
    +/- Adjustments

Compare against wallet projection.

Any mismatch is a reconciliation finding.

## 7.8 Rate Card Tests

Test:

- current rate;
- future rate;
- expired rate;
- configuration-specific rate;
- resource-specific rate;
- duration tier;
- effective-date boundary.

Historical booking must retain applied pricing evidence.

## 7.9 Cancellation Tests

Test:

- full refund;
- partial refund;
- no refund;
- credit release;
- monetary refund;
- cancellation after start;
- cancellation after completion;
- unauthorized cancellation.

## 7.10 Payment Tests

Test:

- payment success;
- payment failure;
- timeout;
- duplicate webhook;
- out-of-order webhook;
- invalid webhook signature;
- refund;
- partial refund;
- provider outage.

## 7.11 Tenant Isolation Tests

Create:

    Organization A
      |
      +--> Wallet A
      +--> Booking A
      +--> Invoice A

    Organization B
      |
      +--> Wallet B
      +--> Booking B
      +--> Invoice B

Verify A cannot access B's commercial data.

## 7.12 Idempotency Tests

Repeat:

    createBooking
    reserveCredits
    consumeCredits
    cancelBooking
    createPayment
    processWebhook
    createRefund

with the same idempotency key.

Expected:

- one business operation;
- deterministic response;
- no duplicate financial effect.

## 7.13 Failure Recovery

Inject:

- database transaction rollback;
- object/service timeout;
- payment provider outage;
- worker crash;
- queue duplication;
- booking allocation failure.

Verify no impossible state such as:

    CONFIRMED booking
    +
    no allocation

or:

    credits consumed
    +
    no ledger evidence

## 7.14 End-to-End Booking Test

Primary flow:

    Login
      |
      v
    Project
      |
      v
    Platform
      |
      v
    Availability
      |
      v
    Quote
      |
      v
    Wallet Check
      |
      v
    Credit Reservation
      |
      v
    Resource Allocation
      |
      v
    Booking CONFIRMED
      |
      v
    Job Eligibility
      |
      v
    Execution

## 7.15 End-to-End Cancellation Test

    CONFIRMED
        |
        v
    CANCEL REQUEST
        |
        v
    Policy Evaluation
        |
        +--> Credit Release
        |
        +--> Refund
        |
        v
    CANCELLED

Verify wallet, ledger, booking and payment evidence remain consistent.

## 7.16 Performance Baseline

Initial targets:

| Operation | Target |
|---|---:|
| Availability query p95 | <1 s |
| Quote p95 | <500 ms |
| Wallet read p95 | <500 ms |
| Booking request p95 | <1 s excluding external payment |
| Credit reservation p95 | <500 ms |
| Ledger transaction p95 | <500 ms |
| Cancellation p95 | <1 s excluding external payment |
| Payment webhook acknowledgement | <500 ms |

External provider calls must not unnecessarily hold database transactions open.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate a complete authoritative booking and credit lifecycle from
availability through reservation, confirmation, cancellation and financial
reconciliation.

## 8.2 Preparation

- [ ] Organization exists.
- [ ] Project exists.
- [ ] Platform exists.
- [ ] Resource exists.
- [ ] Resource is available.
- [ ] Credit type exists.
- [ ] Rate card exists.
- [ ] Wallet has sufficient credits.

## 8.3 Step 1 — Availability

Query:

    Resource: RES-001
    Date: tomorrow
    Duration: 30 minutes

Expected:

    AVAILABLE

with candidate interval(s).

## 8.4 Step 2 — Quote

Request:

    Platform: Reference Robot
    Configuration: Standard
    Duration: 30 minutes

Expected:

    Rate: 15 credits/minute
    Required: 450 credits

## 8.5 Step 3 — Wallet

Inspect wallet.

Expected:

    Available >= 450

## 8.6 Step 4 — Booking Request

Create booking.

Expected:

    DRAFT / PENDING

depending on implementation flow.

## 8.7 Step 5 — Reservation

Reserve credits.

Expected:

    Wallet Available: previous - 450
    Wallet Reserved: previous + 450

## 8.8 Step 6 — Allocation

Allocate resource.

Expected:

    Resource allocation = CONFIRMED

No overlapping confirmed allocation exists.

## 8.9 Step 7 — Booking Confirmation

Expected:

    Booking = CONFIRMED

The booking includes:

- resource;
- time slot;
- credit reservation;
- applied rate-card version.

## 8.10 Step 8 — Inspect Ledger

Expected ledger evidence for:

    Credit Reservation

The wallet and ledger remain consistent.

## 8.11 Step 9 — Cancellation

Cancel booking before execution.

Expected according to policy:

    Booking = CANCELLED
    Credit Reservation = RELEASED

and/or:

    Refund = FULL / PARTIAL / NONE

## 8.12 Step 10 — Ledger

Verify compensating financial evidence.

Expected:

    Reservation
        |
        v
    Release / Refund

No ledger entry is deleted.

## 8.13 Step 11 — Concurrent Booking

Create two simultaneous bookings for the same interval.

Expected:

    One = CONFIRMED
    One = CONFLICT / REJECTED

## 8.14 Step 12 — Tenant Isolation

Authenticate as another organization.

Attempt to inspect:

- booking;
- wallet;
- ledger;
- invoice.

Expected:

    FORBIDDEN

or equivalent resource-not-found behavior.

## 8.15 Demo Success Criteria

The demo passes when:

- availability is correct;
- quote is correct;
- wallet is authoritative;
- credits are reserved;
- resource allocation is conflict-free;
- booking is confirmed;
- ledger evidence exists;
- cancellation follows policy;
- credits are released/refunded correctly;
- tenant isolation holds.

---
