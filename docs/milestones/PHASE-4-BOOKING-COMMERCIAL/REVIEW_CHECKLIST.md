# PHASE-4-BOOKING-COMMERCIAL — Review Checklist

Milestone: PHASE-4-BOOKING-COMMERCIAL — Resources, Availability, Booking, Credits and Commercial Model

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

## 7 Test and verification plan

### 7.1 Test architecture

    Unit Tests
        |
        v
    Domain Invariants
        |
        v
    Repository Tests
        |
        v
    Transaction Tests
        |
        v
    Concurrency Tests
        |
        v
    API Integration
        |
        v
    Studio E2E
        |
        v
    Commercial Reconciliation

### 7.2 Resource tests

Test:

- lab lifecycle;
- robot lifecycle;
- resource lifecycle;
- resource state transitions;
- platform eligibility;
- maintenance;
- availability windows.

### 7.3 Availability tests

Test:

- free resource;
- existing allocation;
- maintenance overlap;
- unavailable lab;
- unavailable resource;
- platform mismatch;
- configuration mismatch;
- capacity exhaustion.

### 7.4 Concurrency tests

Run concurrent booking attempts for the same:

    resource_id
    start_time
    end_time

Expected:

    Request A -> CONFIRMED
    Request B -> CONFLICT

Only one active allocation exists.

### 7.5 Transaction rollback tests

Force failure after:

- credit reservation;
- booking creation;
- allocation insertion;
- ledger posting.

Verify no partial authoritative state remains.

### 7.6 Credit tests

Test:

- credit issuance;
- wallet creation;
- quote;
- reservation;
- consumption;
- release;
- refund;
- insufficient balance;
- duplicate request;
- expired reservation.

### 7.7 Ledger tests

Verify:

    Sum(Debits) = Sum(Credits)

for every posted transaction.

Attempt mutation of posted ledger entry.

Expected:

    REJECTED

### 7.8 Rate-card tests

Test:

- active rate;
- future rate;
- expired rate;
- historical quote;
- overlapping effective dates;
- configuration-specific rate;
- plan-specific rate.

Historical bookings must retain the rate version used at the time.

### 7.9 Cancellation tests

Test:

- full refund;
- partial refund;
- no refund;
- credit return;
- robot fault;
- lab cancellation;
- duplicate cancellation.

### 7.10 Payment tests

Test:

- pending;
- authorized;
- captured;
- completed;
- failed;
- refunded;
- duplicate callback;
- out-of-order callback.

Expected payment processing is idempotent.

### 7.11 Reconciliation tests

Create deliberate inconsistencies:

    wallet != ledger
    booking != allocation
    invoice != payment
    reservation != booking

Verify reconciliation identifies each inconsistency.

### 7.12 Tenant isolation

Test:

    Organization A wallet -> Organization A = ALLOWED
    Organization A wallet -> Organization B = DENIED

Repeat for:

- bookings;
- resources;
- invoices;
- payment records;
- rate plans where tenant scoped.

### 7.13 API tests

Validate:

- authorization;
- idempotency;
- pagination;
- filtering;
- error responses;
- conflict handling;
- concurrency.

### 7.14 Performance tests

Initial targets:

| Operation | Target |
|---|---:|
| Availability query | p95 < 500 ms |
| Quote | p95 < 500 ms |
| Booking confirmation | p95 < 1 s excluding external dependencies |
| Credit reservation | p95 < 1 s |
| Credit consumption | p95 < 1 s |
| Wallet query | p95 < 300 ms |
| Booking history | p95 < 500 ms |

Performance tests shall include realistic concurrent booking traffic.

### 7.15 Security verification

Verify:

- financial authorization;
- tenant isolation;
- rate-card administration;
- payment callback authentication;
- idempotency;
- audit integrity;
- sensitive financial data handling.

### 7.16 Evidence

Required evidence:

- migration test;
- booking concurrency report;
- ledger integrity report;
- wallet/ledger reconciliation;
- refund tests;
- payment idempotency tests;
- tenant isolation report;
- Studio E2E report;
- commercial reconciliation report;
- architecture review;
- financial invariant review;
- security review.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate the complete commercial and booking lifecycle for a simulated resource.

### 8.2 Step 1 — Configure resource

Create:

    Lab: Kritva Simulation Lab
    Platform: Kritva Reference Robot
    Resource: Simulator-001
    Resource Type: SIMULATOR

Expected:

    Resource = AVAILABLE

### 8.3 Step 2 — Configure credit type

Create platform-specific credit type.

Example:

    Credit Type: KRV-SIM-CREDITS

### 8.4 Step 3 — Configure plan

Create:

    Student
    Developer
    Research

Assign appropriate access policy.

### 8.5 Step 4 — Configure rate

Example:

    Rate = 15 credits/minute

Configure effective date.

### 8.6 Step 5 — Fund wallet

Provision:

    Wallet Balance = 1000 credits

Expected:

Wallet displays 1000 available credits.

### 8.7 Step 6 — Check availability

Request:

    Resource: Simulator-001
    Duration: 30 minutes

Expected:

    AVAILABLE

### 8.8 Step 7 — Generate quote

Expected:

    Rate = 15 credits/minute
    Duration = 30 minutes
    Required = 450 credits

Wallet remains:

    Available = 1000
    Reserved = 0

### 8.9 Step 8 — Reserve credits

Reserve 450 credits.

Expected:

    Available = 550
    Reserved = 450

Ledger contains corresponding reservation transaction.

### 8.10 Step 9 — Confirm booking

Confirm booking.

Expected:

    Booking = CONFIRMED
    Allocation = CONFIRMED

Database exclusion constraint protects the time range.

### 8.11 Step 10 — Attempt conflicting booking

Attempt another booking for the same resource and overlapping interval.

Expected:

    BOOKING = REJECTED / CONFLICT

No second active allocation exists.

### 8.12 Step 11 — Start execution-ready state

Mark booking:

    CONFIRMED -> ACTIVE

Expected:

Resource:

    RESERVED -> BUSY

### 8.13 Step 12 — Complete booking

Mark:

    ACTIVE -> COMPLETED

Apply consumption.

Expected:

    Reserved Credits = 0
    Consumed Credits = 450
    Available Credits = 550

### 8.14 Step 13 — Verify ledger

Expected:

    Debits = Credits

No wallet/ledger discrepancy exists.

### 8.15 Step 14 — Cancellation demonstration

Create a second booking.

Cancel it according to configured policy.

Expected:

- allocation released;
- reservation released/refunded;
- cancellation recorded;
- audit event recorded.

### 8.16 Step 15 — Robot fault demonstration

Simulate robot/resource fault.

Expected:

- future allocation handling follows policy;
- booking is cancelled or placed into review;
- credit outcome follows configured fault policy;
- no silent financial mutation occurs.

### 8.17 Step 16 — Reconciliation

Run reconciliation.

Expected:

    Booking = Allocation = Commercial Record
    Wallet = Ledger Projection
    No Unresolved Inconsistency

### 8.18 Demo completion

The Phase 4 demo passes when:

> An organization can discover an available platform resource, receive a quote, reserve platform-specific credits, confirm a conflict-safe booking, consume or release credits according to the lifecycle, and produce auditable commercial records.

---
