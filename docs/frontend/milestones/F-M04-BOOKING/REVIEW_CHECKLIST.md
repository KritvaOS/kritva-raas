# F-M04-BOOKING — Review Checklist

Milestone: F-M04 — Booking

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7. Test and Verification Plan

## 7.1 Test Pyramid

    Unit Tests
        |
        v
    Service Tests
        |
        v
    Repository/DB Tests
        |
        v
    API Contract Tests
        |
        v
    Booking Concurrency Tests
        |
        v
    UI Integration Tests
        |
        v
    E2E
        |
        v
    Financial/Security Qualification

## 7.2 Platform Catalog Tests

Test:

- active platform;
- inactive platform;
- deprecated version;
- retired platform;
- missing capability;
- incompatible architecture;
- invalid configuration;
- empty catalog;
- authorization failure.

## 7.3 Availability Tests

Test:

- completely available interval;
- partially available interval;
- fully booked interval;
- maintenance interval;
- resource fault;
- lab offline;
- capacity exhaustion;
- timezone conversion;
- stale availability;
- simultaneous requests.

## 7.4 Concurrency Test

Two clients request the same resource:

    Client A ----\
                  \
                   > Booking Transaction
                  /
    Client B ----/

Expected:

- at most one succeeds;
- no overlapping confirmed allocation;
- losing request receives conflict;
- losing request does not consume credits;
- database remains consistent.

## 7.5 Credit Tests

Test:

- sufficient balance;
- exact balance;
- insufficient balance;
- reservation;
- reservation release;
- refund;
- duplicate reservation request;
- concurrent reservation;
- wallet update failure;
- ledger consistency.

The core invariant is:

    Available Balance
    =
    Wallet Balance
    -
    Active Reservations
    -
    Other Authorized Holds

The exact accounting implementation must follow the credit domain design.

## 7.6 Quote Tests

Test:

- normal quote;
- different duration;
- different configuration;
- different platform;
- quote expiration;
- rate-card change;
- invalid platform;
- insufficient balance.

## 7.7 Booking Transaction Tests

Verify that booking confirmation atomically coordinates:

- authorization;
- availability;
- credit reservation;
- booking;
- time slot;
- resource allocation;
- state history.

No partial success is acceptable.

## 7.8 Cancellation Tests

Test:

- full credit return;
- partial credit return;
- no refund;
- system cancellation;
- lab cancellation;
- robot fault;
- already cancelled booking;
- completed booking;
- concurrent cancellation.

## 7.9 Tenant Isolation Tests

Test:

- organization A cannot see organization B bookings;
- organization A cannot access organization B wallets;
- organization A cannot access organization B invoices;
- project membership is enforced;
- API filters cannot be bypassed;
- resource metadata is exposed only according to policy.

## 7.10 Billing Tests

Test:

- invoice list;
- invoice detail;
- payment status;
- failed payment;
- refunded payment;
- missing invoice;
- unauthorized invoice access.

## 7.11 E2E Test

Primary scenario:

    Login
      |
      v
    Select Platform
      |
      v
    Select Version
      |
      v
    Select Configuration
      |
      v
    View Availability
      |
      v
    Select Time
      |
      v
    Request Credit Quote
      |
      v
    Confirm Booking
      |
      v
    Reserve Credits
      |
      v
    View Booking
      |
      v
    Cancel Booking
      |
      v
    Verify Credit Release

## 7.12 Billing E2E

    Login
      |
      v
    Billing
      |
      v
    Invoice List
      |
      v
    Invoice Detail
      |
      v
    Payment History

## 7.13 Regression

F-M01 and F-M02 regression must pass:

- login;
- session;
- navigation;
- projects;
- project settings;
- platform selection;
- local workspace;
- build/artifact integration.

## 7.14 Evidence

Required evidence includes:

- screenshots;
- API traces;
- database assertions;
- booking conflict test;
- wallet/ledger reconciliation;
- tenant isolation results;
- E2E result;
- CI result;
- security review;
- UI review.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate that a user can discover a robot, verify availability, obtain an
authoritative credit quote, reserve a resource, manage the booking and inspect
the resulting credit/billing records.

## 8.2 Preparation

- [ ] Test organization exists.
- [ ] Test user is authorized.
- [ ] At least one platform is ACTIVE.
- [ ] At least one platform version is ACTIVE.
- [ ] At least one configuration is ACTIVE.
- [ ] Test resource is AVAILABLE.
- [ ] Credit wallet has sufficient balance.
- [ ] Rate card is configured.
- [ ] Test billing records exist.

## 8.3 Step 1 — Platform Discovery

Open Platforms.

Expected:

- platform cards/list appears;
- type is visible;
- capabilities are visible;
- availability entry point is available.

## 8.4 Step 2 — Platform Detail

Open a platform.

Expected:

- version;
- architecture;
- KritvaOS;
- SDK;
- capabilities;
- configurations;
- credit information.

## 8.5 Step 3 — Select Configuration

Select a compatible configuration.

Expected:

- invalid configurations are unavailable;
- selected configuration is explicit.

## 8.6 Step 4 — View Availability

Select a future booking window.

Expected:

- available slots appear;
- unavailable periods are distinct;
- maintenance is visible where appropriate.

## 8.7 Step 5 — Request Quote

Select a 30-minute interval.

Expected:

    Rate = 15 credits/minute
    Duration = 30 minutes
    Required = 450 credits

The displayed rate and total must come from the server quote.

## 8.8 Step 6 — Confirm Booking

Review:

- project;
- platform;
- configuration;
- time;
- duration;
- credits;
- wallet balance;
- cancellation policy.

Confirm.

Expected:

- booking is created;
- resource is allocated;
- credits are reserved;
- confirmation is shown.

## 8.9 Step 7 — View Booking

Open booking details.

Expected:

- booking ID;
- status CONFIRMED;
- time;
- platform;
- resource;
- credit reservation;
- cancellation option.

## 8.10 Step 8 — Verify Wallet

Open wallet.

Expected:

- available balance reflects reservation;
- reserved credits are visible;
- ledger contains reservation entry.

## 8.11 Step 9 — Cancel

Cancel the booking.

Expected:

- policy shown;
- confirmation required;
- booking becomes CANCELLED;
- resource allocation released;
- credit release/refund appears.

## 8.12 Step 10 — Billing

Open Billing History.

Expected:

- invoices appear;
- monetary amounts are distinct from credits;
- payment status is visible.

## 8.13 Step 11 — Conflict Demonstration

Two sessions attempt the same resource/time.

Expected:

- one succeeds;
- one receives conflict;
- no double allocation;
- no incorrect credit deduction.

## 8.14 Demo Success Criteria

The demo passes when:

- catalog works;
- availability works;
- quote works;
- booking works;
- credits reserve correctly;
- booking management works;
- cancellation works;
- credits release/refund correctly;
- billing history works;
- concurrency protection works.

---
