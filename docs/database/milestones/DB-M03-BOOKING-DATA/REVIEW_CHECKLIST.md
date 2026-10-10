# DB-M03-BOOKING-DATA — Review Checklist

Milestone: DB-M03-BOOKING-DATA — Booking, Availability, Credits and Commercial Data

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

Testing shall cover:

    Schema
      |
      v
    Constraints
      |
      v
    Concurrency
      |
      v
    Booking
      |
      v
    Credits
      |
      v
    Ledger
      |
      v
    Billing
      |
      v
    Reconciliation
      |
      v
    Tenant Isolation
      |
      v
    Integration

### 7.2 Booking overlap test

Create:

    Resource R1
    Booking A
    10:00 - 11:00

Attempt:

    Booking B
    10:30 - 11:30

Expected:

    REJECTED

Then test:

    Booking B
    11:00 - 12:00

Expected:

    ACCEPTED

### 7.3 Concurrent booking test

Two transactions simultaneously attempt to reserve the same resource/time.

Expected:

- one succeeds;
- one fails with conflict;
- no double allocation;
- database remains consistent.

### 7.4 Cancellation release test

Create confirmed booking.

Cancel booking.

Verify:

- allocation becomes RELEASED/CANCELLED;
- resource becomes eligible;
- credit reservation is released according to policy;
- audit evidence exists.

### 7.5 Credit reservation test

Wallet:

    Available = 1000
    Reserved  = 0

Reserve:

    450

Expected:

    Available = 550
    Reserved  = 450

The exact representation may use available balance as a derived value, but the financial invariant must remain correct.

### 7.6 Insufficient-credit test

Wallet:

    Available = 100

Request:

    450

Expected:

    Reservation rejected.

No ledger mutation occurs.

### 7.7 Double-reservation test

Submit the same idempotency key twice.

Expected:

- one reservation;
- same business result returned;
- no duplicate ledger transaction.

### 7.8 Ledger balance test

Post a transaction:

    Debit = 450
    Credit = 450

Expected:

    Balanced = TRUE

Attempt:

    Debit = 450
    Credit = 400

Expected:

    POST rejected.

### 7.9 Consumption test

Reserve 450.

Consume 450.

Verify:

- reservation becomes CONSUMED;
- wallet reflects consumption;
- ledger records consumption;
- duplicate consumption is rejected/idempotent.

### 7.10 Partial consumption test

Reserve 450.

Consume 300.

Verify:

- remaining reservation is 150 if partial consumption is supported;
- ledger remains balanced;
- remaining credits are handled according to lifecycle.

### 7.11 Refund test

Consume 450.

Refund 450.

Verify:

- refundable amount is not exceeded;
- refund creates ledger evidence;
- wallet increases appropriately;
- duplicate refund does not double-credit.

### 7.12 Rate-card test

Create rate:

    Platform = P1
    Configuration = C1
    Resource Type = ROBOT
    Rate = 15 credits/minute
    Effective = Jan 1 - Mar 31

Create second rate effective April 1.

Verify historical booking uses the historical rate.

### 7.13 Invoice reconciliation test

Create invoice lines:

    Line 1 = 450
    Line 2 = 150
    Discount = 50
    Tax = applicable

Verify invoice total equals the defined calculation.

### 7.14 Payment idempotency test

Simulate duplicate provider callback.

Expected:

- one authoritative payment state transition;
- no duplicate invoice settlement;
- no duplicate credit mutation.

### 7.15 Reconciliation test

Introduce controlled inconsistency.

Examples:

- wallet mismatch;
- missing ledger entry;
- reservation without booking;
- booking without reservation where reservation is required.

Expected:

- discrepancy detected;
- discrepancy recorded;
- no silent repair;
- controlled reconciliation path available.

### 7.16 Tenant tests

Organization A:

    Wallet A
    Booking A
    Invoice A

Organization B:

    Wallet B
    Booking B
    Invoice B

Verify:

    A -> B = DENIED
    B -> A = DENIED

### 7.17 Performance tests

Measure:

- availability lookup;
- booking lookup;
- allocation conflict check;
- wallet lookup;
- reservation;
- ledger posting;
- invoice lookup.

Initial targets should align with backend performance targets:

- booking operations p95 < 1 second excluding external dependencies;
- credit operations p95 < 1 second.

### 7.18 Migration tests

Verify:

- clean migration;
- upgrade;
- constraints;
- exclusion index;
- RLS;
- ledger integrity;
- seed plans/rates.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate an end-to-end transactional booking and credit flow using PostgreSQL as the authoritative source of truth.

### 8.2 Step 1 — Create platform/resource

Create:

    Platform P1
    Platform Version P1-V1
    Configuration C1
    Lab L1
    Resource R1

### 8.3 Step 2 — Configure credit type

Create:

    Credit Type = P1-CREDIT

Expected:

Credit type is linked to Platform P1.

### 8.4 Step 3 — Configure plan

Create:

    Plan = Developer

Expected:

Plan is active.

### 8.5 Step 4 — Configure rate

Create:

    Rate = 15 credits/minute
    Configuration = C1
    Resource Type = ROBOT

### 8.6 Step 5 — Fund wallet

Create wallet:

    Organization = Org1
    Credit Type = P1-CREDIT
    Balance = 1000

### 8.7 Step 6 — Request quote

Request:

    Duration = 30 minutes

Expected:

    Required = 450 credits

No wallet or ledger mutation occurs.

### 8.8 Step 7 — Reserve credits

Reserve 450.

Expected:

    Available = 550
    Reserved = 450

### 8.9 Step 8 — Create booking

Create booking for R1.

Expected:

Booking becomes CONFIRMED and resource allocation is active/confirmed.

### 8.10 Step 9 — Attempt overlap

Attempt another booking for R1 with overlapping time.

Expected:

    CONFLICT

The PostgreSQL exclusion constraint rejects the overlap.

### 8.11 Step 10 — Complete booking

Transition:

    CONFIRMED
        -> ACTIVE
        -> COMPLETED

### 8.12 Step 11 — Consume credits

Consume 450.

Expected:

- reservation becomes CONSUMED;
- ledger records consumption;
- wallet decreases appropriately.

### 8.13 Step 12 — Generate invoice

Create invoice and line.

Expected:

Invoice references the booking and commercial amount.

### 8.14 Step 13 — Cancel/refund scenario

Run a second booking and cancel it according to a refundable policy.

Expected:

- booking becomes CANCELLED;
- allocation released;
- eligible credits returned;
- refund evidence created.

### 8.15 Step 14 — Reconciliation

Run reconciliation.

Expected:

No unexplained mismatch exists.

### 8.16 Demo completion

The milestone passes the demo when:

> A customer can obtain a quote, reserve platform-specific credits, confirm a resource booking without overlap, consume or release credits, generate commercial records, and reconcile all financial/resource state using authoritative PostgreSQL transactions.

---
