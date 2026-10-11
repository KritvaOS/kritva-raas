# B-M04 — Booking

## Milestone Dossier

**Milestone ID:** B-M04-BOOKING  
**Product:** Kritva RaaS  
**Primary Phase:** P4 BOOKING & COMMERCIAL  
**Supporting Phases:** None  
**Primary Surface:** RaaS Control Plane / Backend  
**Technology:** TypeScript/Node.js, PostgreSQL, REST API v1, WebSocket events, provider-neutral payment and billing adapters  
**Architecture:** Production-oriented Modular Monolith  
**Priority:** PRI-0 (critical invariant per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** Establish authoritative resource availability, booking, reservation, platform-specific credit, wallet, ledger, billing and payment foundations required to reserve robotic resources and safely authorize paid execution.

---

# 1 Objective

## 1.1 Milestone Objective

B-M04 establishes the authoritative commercial and resource-reservation boundary
for Kritva RaaS.

The milestone connects:

    Platform
       |
       v
    Resource
       |
       v
    Availability
       |
       v
    Booking
       |
       v
    Credit Quote
       |
       v
    Credit Reservation
       |
       v
    Resource Allocation
       |
       v
    Job
       |
       v
    Execution

The commercial relationship is:

    Subscription / Access
             |
             v
       Platform Credit Type
             |
             v
        Credit Plan
             |
             v
          Rate Card
             |
             v
      Duration / Configuration
             |
             v
       Credit Requirement
             |
             v
        Wallet Balance
             |
             v
       Credit Reservation
             |
             v
           Booking

B-M04 must preserve a strict distinction between:

- access authorization;
- resource availability;
- booking;
- credit reservation;
- credit consumption;
- billing;
- payment.

These are related domains but are not the same state.

## 1.2 Product Goal

A user should be able to:

1. discover an eligible robotic resource;
2. request availability;
3. obtain a credit quote;
4. confirm a booking;
5. reserve the required credits;
6. obtain an authoritative resource allocation;
7. execute against the booking later;
8. consume credits according to actual policy;
9. receive billing records where applicable;
10. cancel according to policy;
11. receive eligible credit refunds or releases;
12. inspect transaction history.

## 1.3 Core Commercial Principle

The foundational commercial rule is:

> Subscription determines access; robotic platform determines credit type; resource configuration and duration determine consumption.

Therefore:

    Subscription
         |
         v
       Access
         |
         v
      Platform
         |
         v
    Credit Type
         |
         v
    Rate Card
         |
         +--> Configuration
         +--> Resource Type
         +--> Duration
         |
         v
    Credit Requirement
         |
         v
       Wallet

A subscription does not directly determine how many credits a robot costs.

## 1.4 Availability Objective

Availability must distinguish:

- catalog availability;
- operational availability;
- scheduled availability;
- booking availability;
- actual resource state.

A resource may be:

    AVAILABLE

but unavailable for a requested interval because of:

- existing booking;
- maintenance;
- capacity;
- lab outage;
- resource fault;
- platform restriction;
- policy.

## 1.5 Booking Objective

Booking is the authoritative reservation of a resource for a defined interval.

A booking must include:

- organization;
- Project;
- platform;
- platform version;
- configuration;
- requested time;
- timezone;
- duration;
- resource allocation;
- credit reservation;
- lifecycle state.

## 1.6 Credit Objective

Credits are the product's platform-specific execution currency.

Credits must be:

- tenant-scoped;
- platform-scoped;
- ledger-backed;
- auditable;
- strongly consistent;
- non-transferable initially.

The wallet is a current-state projection.

The ledger is the financial evidence.

## 1.7 Ledger Objective

The credit ledger provides append-oriented financial evidence.

Conceptually:

    Transaction
        |
        +--> Entry
        +--> Entry
        +--> Reference
        +--> Actor
        +--> Timestamp

The ledger must support:

- grants;
- purchases;
- reservations;
- consumption;
- releases;
- refunds;
- adjustments;
- expiration where applicable.

## 1.8 Payment Objective

Payments represent monetary transactions used to purchase subscriptions,
credits or other commercial products where enabled.

B-M04 establishes the provider-neutral payment boundary.

It does not hard-code the architecture to a single payment provider.

## 1.9 Billing Objective

Billing records provide commercial evidence for:

- credit purchases;
- subscriptions;
- usage;
- refunds;
- adjustments;
- taxes or fees where required.

Billing is distinct from the credit ledger.

## 1.10 Safety and Financial Authority

The booking system may authorize resource reservation.

It must not:

- override physical safety;
- bypass E-stop;
- start a robot without execution authorization;
- infer safety from booking status.

Likewise, the UI must not be treated as authoritative for:

- wallet balance;
- credit reservation;
- booking confirmation;
- payment status;
- refund status.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M04 includes:

- availability service;
- availability query;
- resource eligibility;
- booking creation;
- booking state machine;
- booking confirmation;
- time slots;
- resource allocations;
- conflict prevention;
- credit types;
- credit plans;
- rate cards;
- credit quote;
- wallets;
- ledger transactions;
- ledger entries;
- credit reservations;
- credit consumption;
- credit releases;
- refunds;
- invoices;
- invoice lines;
- financial transactions;
- payment-provider abstraction;
- payment state;
- billing history;
- booking cancellation;
- cancellation policy;
- booking reconciliation;
- credit reconciliation;
- audit events;
- idempotency.

## 2.2 Explicitly Out of Scope

B-M04 does not implement:

- physical robot control;
- E-stop;
- robot firmware;
- Lab Agent;
- video;
- telemetry;
- result processing;
- experiment comparison;
- local build;
- artifact packaging;
- payment-provider-specific UI;
- full subscription-management UI;
- tax/legal compliance implementation for every jurisdiction.

## 2.3 Availability vs Booking

Availability answers:

> Could this resource potentially be booked for this interval?

Booking answers:

> Has the system authoritatively reserved this resource for this interval?

Availability may become stale.

Booking confirmation must be transactional and authoritative.

## 2.4 Credit Quote vs Credit Reservation

A quote answers:

> How many credits would this booking require under the current rate policy?

A reservation answers:

> Have those credits been held against this booking?

A quote does not reduce the wallet balance.

A reservation does.

## 2.5 Reservation vs Consumption

Reservation:

    Available Credits
          |
          v
    Reserved Credits

Consumption:

    Reserved Credits
          |
          v
    Consumed Credits

Unused reservation may be released according to policy.

## 2.6 Billing vs Ledger

| Domain | Purpose |
|---|---|
| Wallet | Current credit balance |
| Ledger | Authoritative credit financial history |
| Reservation | Temporary hold against wallet |
| Consumption | Actual credit usage |
| Invoice | Commercial billing document |
| Payment | Monetary settlement |
| Booking | Resource reservation |

These records must remain separately identifiable.

---

# 3 Dependencies

## 3.1 Upstream Dependencies

B-M04 depends on:

- B-M01 Control Plane;
- B-M02 Artifact;
- B-M03 Platform;
- PostgreSQL;
- organization/Project model;
- authorization;
- audit;
- idempotency;
- platform/resource registry.

## 3.2 Platform Dependencies

B-M03 provides:

- Platform;
- Platform Version;
- Configuration;
- Resource;
- Resource state;
- Maintenance;
- Availability inputs;
- Robot;
- Lab.

B-M04 consumes those entities but does not redefine them.

## 3.3 Artifact Dependency

B-M02 provides:

- artifact identity;
- target platform;
- architecture;
- compatibility.

A booking may require an artifact compatibility check before confirmation
depending on booking policy.

## 3.4 Execution Dependency

B-M05 later consumes:

- confirmed booking;
- resource allocation;
- credit reservation;
- execution eligibility;
- booking window.

## 3.5 Database Dependency

The booking schema baseline contains:

    booking.bookings
    booking.time_slots
    booking.resource_allocations
    booking.booking_state_history
    booking.cancellations

The credit domain is expected to contain:

    credit.credit_types
    credit.credit_plans
    credit.rate_cards
    credit.wallets
    credit.ledger_transactions
    credit.ledger_entries
    credit.reservations
    credit.consumptions
    credit.refunds
    credit.invoices
    credit.invoice_lines
    credit.financial_transactions

Exact table boundaries must remain consistent with the authoritative database
architecture.

## 3.6 Payment Dependency

Payment integration uses a provider-neutral adapter.

Conceptual:

    PaymentService
         |
         v
    PaymentProvider
         |
         +--> Provider A
         +--> Provider B
         +--> Future Provider

Provider-specific identifiers must not become the primary business identity.

---

# 4 Deliverables

## 4.1 Availability Service

The availability service evaluates:

    Resource State
          +
    Lab State
          +
    Maintenance
          +
    Availability Window
          +
    Existing Allocation
          +
    Platform Eligibility
          +
    Policy
          |
          v
      Availability

Availability is evaluated for:

- resource;
- platform;
- configuration;
- requested interval;
- organization;
- Project;
- requested duration.

## 4.2 Booking Domain

The booking domain owns:

- booking identity;
- requested interval;
- confirmed interval;
- resource allocations;
- booking state;
- cancellation;
- booking history;
- credit reservation reference.

## 4.3 Booking State Machine

Baseline lifecycle:

    DRAFT
      |
      v
    PENDING
      |
      +------> REJECTED
      |
      v
    CONFIRMED
      |
      +------> CANCELLED
      |
      v
    ACTIVE
      |
      +------> FAILED
      |
      v
    COMPLETED

Other terminal/exception states:

    EXPIRED
    REJECTED
    FAILED
    CANCELLED

The state transition must be explicit.

## 4.4 Time Slots

Booking slots support:

- SETUP;
- EXECUTION;
- TEARDOWN;
- MAINTENANCE_BUFFER.

Each slot has:

- start;
- end;
- status;
- generated range;
- booking association.

## 4.5 Resource Allocation

An allocation connects:

    Booking
       |
       v
    Resource
       |
       v
    Robot
       |
       v
    Time Slot

Allocation types:

- PRIMARY;
- SECONDARY;
- SETUP;
- TEARDOWN.

## 4.6 Conflict Prevention

The database must prevent conflicting allocations.

Conceptual:

    Resource R1
       |
       +---- Booking A ----+
       |                    |
       |                10:00-11:00
       |
       +---- Booking B ----+
                            |
                        10:30-11:30

Booking B must not become confirmed for the same exclusive resource.

The PostgreSQL exclusion constraint remains the preferred database-level
protection for time-range conflicts.

## 4.7 Credit Type

A credit type identifies the platform-specific execution currency.

Example:

    CREDIT-KR-REFBOT
    CREDIT-KR-SIM
    CREDIT-KR-RESEARCH

Credit types are not interchangeable unless an explicit future conversion
policy is introduced.

## 4.8 Credit Plan

A credit plan defines commercial issuance/access rules.

Examples:

- Student;
- Developer;
- Research.

A plan may define:

- included credits;
- purchase rules;
- validity;
- limits;
- subscription relationship;
- eligibility.

## 4.9 Rate Card

Rate cards determine credit consumption.

Conceptually:

    Platform
       |
       +--> Configuration
       +--> Resource Type
       +--> Duration
       |
       v
    Rate Card
       |
       v
    Credit Requirement

Example:

    Rate = 15 credits/minute
    Duration = 30 minutes
    Required = 450 credits

Rate cards must support effective dates.

## 4.10 Quote

Quote response should contain:

    {
        "platform_id": "platform-001",
        "resource_type": "ROBOT",
        "configuration_id": "config-001",
        "duration_seconds": 1800,
        "rate": 15,
        "estimated_credits": 450,
        "credit_type": "CREDIT-KR-REFBOT",
        "rate_card_version": "rc-001"
    }

The quote is informational until reservation/confirmation.

## 4.11 Wallet

A wallet belongs to:

    Organization
        +
    Credit Type

Baseline uniqueness:

    UNIQUE (
        organization_id,
        credit_type_id
    )

The wallet exposes current available/reserved/consumed state.

## 4.12 Ledger

The ledger is append-only.

Conceptual:

    Ledger Transaction
          |
          +--> Debit Entry
          +--> Credit Entry

Each transaction must balance according to the ledger model.

The wallet is a projection and may be reconciled against ledger state.

## 4.13 Credit Reservation

Reservation lifecycle:

    REQUESTED
       |
       v
    RESERVED
       |
       +--> RELEASED
       |
       v
    CONSUMED

Alternative:

    EXPIRED
    CANCELLED

Reservation is linked to Booking.

## 4.14 Credit Consumption

Consumption occurs when policy determines the resource usage is chargeable.

Possible models:

- reservation-based full charge;
- actual duration;
- minimum duration;
- cancellation penalty;
- hybrid.

The first implementation must select and document one authoritative policy.

## 4.15 Refund

Refund may return:

- credits;
- monetary payment;
- both;
- neither.

The booking cancellation policy determines eligibility.

## 4.16 Invoice

Invoices provide commercial evidence.

Invoice structure:

    Invoice
       |
       +--> Invoice Line
       +--> Payment Reference
       +--> Credit Reference
       +--> Booking Reference
       +--> Tax / Adjustment

Invoice state must be explicit.

## 4.17 Payment

Payment lifecycle:

    CREATED
       |
       v
    PENDING
       |
       +--> FAILED
       |
       v
    AUTHORIZED
       |
       v
    CAPTURED
       |
       +--> REFUNDED
       |
       v
    COMPLETED

Provider callbacks must be verified and idempotent.

---

# 9 Risks

## 9.1 R-BM04-001 — Double Booking

**Risk:** Two customers receive the same resource interval.

**Impact:** Critical.

**Mitigation:**

- PostgreSQL exclusion constraints;
- transactional allocation;
- concurrency testing;
- authoritative booking state.

## 9.2 R-BM04-002 — Credit Overspending

**Risk:** Concurrent reservations exceed wallet balance.

**Impact:** Critical.

**Mitigation:**

- row locking;
- transactional wallet updates;
- reservation constraints;
- financial invariant tests.

## 9.3 R-BM04-003 — Ledger Corruption

**Risk:** Wallet and ledger diverge.

**Impact:** Critical.

**Mitigation:**

- append-only ledger;
- balanced transactions;
- reconciliation;
- compensating entries;
- financial review.

## 9.4 R-BM04-004 — Payment Duplication

**Risk:** Duplicate webhook grants credits twice.

**Impact:** Critical.

**Mitigation:**

- provider event IDs;
- idempotency;
- unique constraints;
- reconciliation.

## 9.5 R-BM04-005 — Payment Without Credit

**Risk:** Payment succeeds but customer receives no credit evidence.

**Impact:** High.

**Mitigation:**

- payment state;
- asynchronous processing;
- reconciliation;
- durable transaction references.

## 9.6 R-BM04-006 — Credit Without Payment

**Risk:** Credits are granted without valid commercial authorization.

**Impact:** Critical.

**Mitigation:**

- payment verification;
- authorization;
- controlled grant service;
- ledger evidence.

## 9.7 R-BM04-007 — Stale Availability

**Risk:** User sees availability that is no longer valid.

**Impact:** High.

**Mitigation:**

- availability is non-authoritative;
- transactional booking;
- conflict constraints;
- clear UI semantics.

## 9.8 R-BM04-008 — Rate Drift

**Risk:** Historical bookings change when rate cards change.

**Impact:** High.

**Mitigation:**

- effective-dated rate cards;
- persisted applied rate;
- rate-card version reference.

## 9.9 R-BM04-009 — Refund Error

**Risk:** Customer receives incorrect refund.

**Impact:** High.

**Mitigation:**

- explicit cancellation policy;
- idempotency;
- refund evidence;
- reconciliation.

## 9.10 R-BM04-010 — Tenant Financial Leakage

**Risk:** One organization sees another's wallet or billing data.

**Impact:** Critical.

**Mitigation:**

- tenant-scoped repositories;
- authorization;
- database constraints;
- security tests.

## 9.11 R-BM04-011 — Booking/Execution Drift

**Risk:** Job executes outside booking window.

**Impact:** High.

**Mitigation:**

- execution validates booking;
- resource allocation state;
- authoritative time checks.

## 9.12 R-BM04-012 — Financial State Rewritten

**Risk:** Historical ledger entries are modified.

**Impact:** Critical.

**Mitigation:**

- append-only ledger;
- compensating entries;
- restricted permissions;
- audit.

## 9.13 R-BM04-013 — Provider Outage

**Risk:** Payment provider unavailable.

**Impact:** Medium/High.

**Mitigation:**

- provider abstraction;
- asynchronous processing;
- explicit pending state;
- reconciliation.

## 9.14 R-BM04-014 — Cancellation During Execution

**Risk:** Cancellation incorrectly releases resources or credits while a
physical Job is still active.

**Impact:** Critical.

**Mitigation:**

- explicit booking/run relationship;
- cancellation policy;
- Job state validation;
- execution service coordination.

## 9.15 R-BM04-015 — Commercial Model Complexity

**Risk:** Credits, subscriptions, rate cards and payments become tightly
coupled.

**Impact:** High.

**Mitigation:**

- domain separation;
- application services;
- explicit interfaces;
- provider-neutral adapters.

---

# 10 Exit Criteria

## 10.1 Availability Exit

- [ ] Availability service works.
- [ ] Resource state is considered.
- [ ] Lab state is considered.
- [ ] Maintenance is considered.
- [ ] Existing allocations are considered.
- [ ] Availability is clearly non-authoritative for confirmation.

## 10.2 Booking Exit

- [ ] Booking creation works.
- [ ] Booking state machine works.
- [ ] Time slots work.
- [ ] Resource allocations work.
- [ ] Database conflict prevention works.
- [ ] Cancellation works.
- [ ] State history works.
- [ ] Booking audit works.

## 10.3 Credit Exit

- [ ] Credit types work.
- [ ] Credit plans work.
- [ ] Rate cards work.
- [ ] Quote works.
- [ ] Wallet works.
- [ ] Ledger works.
- [ ] Reservations work.
- [ ] Consumption works.
- [ ] Releases work.
- [ ] Refunds work.
- [ ] Credit reconciliation works.

## 10.4 Billing Exit

- [ ] Invoice works.
- [ ] Invoice lines work.
- [ ] Payment abstraction works.
- [ ] Payment lifecycle works.
- [ ] Provider webhook verification works.
- [ ] Payment idempotency works.
- [ ] Payment reconciliation works.

## 10.5 Security Exit

- [ ] Tenant isolation verified.
- [ ] Financial operations authorized.
- [ ] Payment callbacks authenticated.
- [ ] Refund operations restricted.
- [ ] Administrative operations audited.
- [ ] Ledger immutability reviewed.

## 10.6 Concurrency Exit

- [ ] Double-booking tests pass.
- [ ] Credit overspending tests pass.
- [ ] Duplicate booking tests pass.
- [ ] Duplicate payment webhook tests pass.
- [ ] Duplicate reservation tests pass.
- [ ] Duplicate refund tests pass.

## 10.7 Integration Exit

- [ ] F-M04 can consume availability.
- [ ] F-M04 can consume quote.
- [ ] F-M04 can consume wallet.
- [ ] F-M04 can create booking.
- [ ] F-M05 can validate booking before execution.
- [ ] Credit reservation can be referenced by Job.
- [ ] Resource allocation can be consumed by execution.

## 10.8 Quality Exit

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] Financial invariant tests pass.
- [ ] Concurrency tests pass.
- [ ] Integration tests pass.
- [ ] Payment adapter tests pass.
- [ ] E2E tests pass.
- [ ] Reconciliation tests pass.
- [ ] Performance baseline passes.
- [ ] CI passes.

## 10.9 Documentation Exit

- [ ] Availability rules documented.
- [ ] Booking state machine documented.
- [ ] Credit model documented.
- [ ] Rate cards documented.
- [ ] Wallet documented.
- [ ] Ledger documented.
- [ ] Refund policy documented.
- [ ] Billing model documented.
- [ ] Payment adapter documented.
- [ ] Reconciliation documented.
- [ ] Tracking documents updated.

## 10.10 Formal Milestone Status

B-M04 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

Completion requires implementation evidence, database verification, security
review, financial controls review, concurrency testing and acceptance evidence.

---
