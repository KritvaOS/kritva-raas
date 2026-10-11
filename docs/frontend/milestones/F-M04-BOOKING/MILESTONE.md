# F-M04 — Booking

## Milestone Dossier

**Milestone ID:** F-M04-BOOKING  
**Product:** Kritva RaaS  
**Primary Phase:** P4 BOOKING & COMMERCIAL  
**Primary Surface:** RaaS Studio + Control Plane  
**Technology:** Tauri + Rust + React + TypeScript + Backend API  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** A production-grade platform discovery, resource availability,
booking, credit quote, wallet visibility, booking management, and billing
history workflow.

---

# 1. Objective

## 1.1 Milestone Objective

F-M04 establishes the resource reservation and platform access workflow for
Kritva RaaS.

The milestone connects the locally generated `.krv` artifact from F-M03 to a
specific robotic platform and allocatable resource through a controlled
booking workflow.

The primary workflow is:

    Project
       |
       v
    Platform Catalog
       |
       v
    Platform Version
       |
       v
    Configuration
       |
       v
    Resource Availability
       |
       v
    Booking Request
       |
       v
    Credit Quote
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
    Booking Management
       |
       v
    Job / Execution Handoff

F-M04 does not execute the artifact on a robot. It establishes the
authoritative reservation and financial preconditions required by later remote
execution milestones.

## 1.2 Product Intent

The booking experience must answer four questions clearly:

1. What robotic platforms are available?
2. When and where can the selected resource be used?
3. How many platform-specific credits will the booking require?
4. What happens to the user's wallet and booking if the booking changes,
   fails, or is cancelled?

The user must never need to infer availability or credit requirements from
stale client-side calculations.

## 1.3 Primary Success Definition

F-M04 is successful when an authorized user can:

1. browse the platform catalog;
2. inspect platform versions and capabilities;
3. inspect platform configurations;
4. select an eligible platform;
5. view resource availability;
6. select an available time range;
7. receive an authoritative credit quote;
8. verify wallet balance;
9. confirm a booking;
10. reserve the required credits;
11. receive a booking confirmation;
12. inspect booking details;
13. manage upcoming bookings;
14. cancel a booking according to policy;
15. observe credit reservation/refund effects;
16. view credit wallet history;
17. view billing/payment history where applicable;
18. distinguish credits from monetary billing;
19. handle conflicts and stale availability safely.

## 1.4 Architectural Objective

The architecture is:

    React Studio
         |
         | HTTPS / API Client
         v
    Control Plane
         |
         +--> Platform Service
         +--> Availability Service
         +--> Booking Service
         +--> Credit Service
         +--> Billing Service
         |
         +--> PostgreSQL
         |
         +--> Resource/Lab State
         |
         v
    Authoritative Booking

The client may display availability and quote information, but the server is
authoritative for:

- resource availability;
- booking conflicts;
- credit balances;
- credit reservations;
- pricing/rates;
- booking confirmation;
- cancellation/refund policy;
- billing records.

## 1.5 Financial Principle

Kritva RaaS uses the following product rule:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine consumption.

Credits are platform-specific.

A user's credits for Platform A cannot automatically be used for Platform B.

The initial design treats credits as non-transferable unless a future commercial
decision explicitly introduces transfer/conversion rules.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M04 includes:

- platform catalog;
- platform versions;
- architecture information;
- capabilities;
- platform configurations;
- platform discovery;
- platform detail;
- resource availability;
- availability filtering;
- booking creation;
- credit quote;
- credit wallet display;
- credit reservation;
- booking confirmation;
- booking details;
- booking list;
- booking cancellation;
- cancellation policy display;
- credit reservation release/refund;
- booking state history;
- resource allocation;
- billing history;
- invoice/payment history display where available;
- booking error handling;
- stale availability handling;
- idempotent booking submission;
- financial transaction visibility;
- audit-friendly UI state;
- automated tests;
- integration tests;
- E2E tests.

## 2.2 Explicitly Out of Scope

F-M04 does not implement:

- robot execution;
- Job creation/execution;
- Run lifecycle;
- live video;
- telemetry;
- remote logs;
- physical robot control;
- emergency stop;
- robot safety controls;
- robot fleet deployment;
- experiment management;
- result analysis;
- subscription purchase flow;
- payment-provider integration;
- tax calculation;
- payout processing;
- credit transfer between platforms;
- automatic credit conversion;
- dynamic pricing unless separately approved;
- physical lab provisioning.

Later milestones may consume F-M04 booking and credit contracts.

## 2.3 Platform Catalog Scope

The platform catalog represents the products and execution targets that users
can select.

The catalog includes:

- Platform;
- Platform Version;
- Architecture;
- Capability;
- Configuration.

Operational resources are represented separately.

## 2.4 Resource Scope

A resource is the allocatable operational unit.

Resource types include:

- ROBOT;
- SIMULATOR;
- GPU;
- WORKSTATION.

A Robot represents physical identity.

A Resource represents the unit that can be reserved.

The distinction is:

    Platform
       |
       v
    Platform Version
       |
       v
    Resource
       |
       +--> Robot identity
       |
       +--> Configuration
       |
       +--> Lab

## 2.5 Credit Scope

F-M04 establishes:

- credit type;
- credit plan;
- wallet;
- balance;
- quote;
- reservation;
- consumption preparation;
- refund/release;
- ledger visibility.

Actual execution consumption may be finalized by later Job/Run workflows.

## 2.6 Billing Scope

Billing history is visibility-oriented in F-M04.

The user can inspect:

- invoice;
- invoice date;
- billing status;
- amount;
- currency;
- payment status;
- transaction reference;
- credit-related records where appropriate.

Credits and money must not be conflated.

---

# 3. Dependencies

## 3.1 Milestone Dependencies

F-M04 depends on:

- F-M01 Studio Foundation;
- F-M02 Projects;
- F-M03 Build & Artifact;
- authentication;
- authorization;
- project membership;
- platform catalog;
- PostgreSQL database;
- booking schema;
- credit domain;
- billing data contract;
- API client;
- UI component library.

## 3.2 Primary Documentation Dependencies

| Document | Relationship |
|---|---|
| `docs/frontend/milestones/F-M01-STUDIO-FOUNDATION/MILESTONE.md` | Studio foundation |
| `docs/frontend/milestones/F-M02-PROJECTS/MILESTONE.md` | Project ownership |
| `docs/frontend/milestones/F-M03-BUILD-ARTIFACT/MILESTONE.md` | Artifact foundation |
| `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Database architecture |
| `docs/database/schema/PROJECTS.md` | Project ownership |
| `docs/database/schema/PLATFORMS.md` | Platform/resource catalog |
| `docs/database/schema/BOOKINGS.md` | Booking model |
| `docs/security/AUTHENTICATION.md` | Authentication |
| `docs/security/AUTHORIZATION.md` | Authorization |
| `docs/security/TENANT_ISOLATION.md` | Tenant isolation |
| `planning/INTEGRATION_PLAN.md` | Cross-system integration |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | UI acceptance |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | UI review |

## 3.3 Platform Dependencies

The Control Plane must expose authoritative:

- platforms;
- platform versions;
- architectures;
- capabilities;
- configurations;
- resource state;
- availability.

The UI must not maintain an independent authoritative platform catalog.

## 3.4 Booking Dependencies

F-M04 depends on the booking model:

- `booking.bookings`;
- `booking.time_slots`;
- `booking.resource_allocations`;
- `booking.booking_state_history`;
- `booking.cancellations`.

The booking transaction must remain server-authoritative.

## 3.5 Credit Dependencies

The credit domain must provide:

- credit type;
- credit plan;
- wallet;
- rate card;
- quote;
- reservation;
- ledger transaction;
- refund/release.

Booking must not directly modify credit ledger tables from the frontend.

## 3.6 Security Dependencies

F-M04 depends on:

- organization authorization;
- project membership;
- platform authorization;
- wallet ownership;
- tenant isolation;
- booking ownership;
- billing visibility controls.

The UI must never be treated as the security boundary.

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M04 shall deliver:

1. Platform catalog screen.
2. Platform detail screen.
3. Platform version selection.
4. Capability display.
5. Configuration selection.
6. Resource availability screen.
7. Calendar/time-slot selection.
8. Credit wallet display.
9. Credit quote display.
10. Booking confirmation workflow.
11. Booking detail screen.
12. Booking list.
13. Booking cancellation.
14. Cancellation policy display.
15. Credit reservation visibility.
16. Credit ledger/history view.
17. Billing history view.
18. Booking state synchronization.
19. Availability refresh.
20. Booking conflict handling.
21. Idempotent booking submission.
22. Financial state error handling.
23. Integration tests.
24. E2E booking tests.

## 4.2 Platform Catalog

The catalog hierarchy is:

    Platform
       |
       +--> Platform Version
       |       |
       |       +--> Architecture
       |       +--> KritvaOS Version
       |       +--> SDK Compatibility
       |       +--> Capabilities
       |
       +--> Configurations
       |
       +--> Resource Availability

The catalog must support filtering by:

- platform type;
- capability;
- architecture;
- KritvaOS version;
- availability;
- configuration;
- location/lab where exposed.

## 4.3 Platform Types

The UI must distinguish:

- PHYSICAL;
- SIMULATED;
- REFERENCE.

A physical platform must be clearly identifiable.

## 4.4 Platform Detail

Platform detail should show:

- name;
- description;
- platform type;
- version;
- architecture;
- KritvaOS;
- SDK compatibility;
- capabilities;
- configurations;
- availability;
- credit rate information;
- booking eligibility.

## 4.5 Availability

Availability must consider:

- resource state;
- lab state;
- maintenance;
- existing bookings;
- capacity;
- platform eligibility;
- configuration;
- operational policy.

The UI must not infer availability solely from a static calendar.

## 4.6 Availability Model

Conceptual flow:

    User selects platform
             |
             v
    Select version/configuration
             |
             v
    Request availability
             |
             v
    Availability Service
             |
             +--> Resource state
             +--> Maintenance
             +--> Existing allocations
             +--> Capacity
             +--> Policy
             |
             v
    Available intervals

## 4.7 Booking States

F-M04 supports:

- DRAFT;
- PENDING;
- CONFIRMED;
- ACTIVE;
- COMPLETED;
- CANCELLED;
- EXPIRED;
- REJECTED;
- FAILED.

The UI must render each state explicitly.

## 4.8 Booking Creation

Booking creation should collect:

- project;
- platform;
- platform version;
- configuration;
- requested start;
- requested end;
- timezone;
- purpose where required;
- selected resource or resource preference;
- required credit amount;
- acknowledgement of cancellation policy.

The server determines final allocation.

## 4.9 Credit Quote

The quote must be authoritative.

Conceptual example:

    Platform: Kritva Reference Robot
    Configuration: Standard
    Rate: 15 credits/minute
    Duration: 30 minutes
    Required Credits: 450
    Wallet Balance: 700
    Remaining Balance After Reservation: 250

The client may calculate an estimate for responsiveness, but the server quote
is authoritative.

## 4.10 Credit Wallet

The wallet view should show:

- platform;
- credit type;
- available balance;
- reserved balance;
- consumed balance where useful;
- pending adjustments;
- last updated timestamp.

A wallet is scoped to an organization and platform-specific credit type.

## 4.11 Booking Confirmation

The final confirmation screen must show:

- platform;
- configuration;
- resource if assigned;
- start/end;
- duration;
- credit rate;
- quoted credits;
- current balance;
- resulting reserved balance;
- cancellation policy;
- project;
- booking identifier.

The user must explicitly confirm.

## 4.12 Booking Management

Users can:

- view upcoming bookings;
- view active bookings;
- view completed bookings;
- view cancelled bookings;
- open booking details;
- cancel eligible bookings.

Modification should not silently mutate an existing confirmed booking.

Where rescheduling is supported later, it should be implemented as an explicit
transaction with quote/revalidation.

## 4.13 Cancellation

Cancellation must display:

- cancellation eligibility;
- policy;
- expected credit return;
- monetary refund if applicable;
- effective cancellation time.

The server decides the final policy result.

## 4.14 Credit Ledger

Users with sufficient authorization can see:

- transaction date;
- platform;
- credit type;
- transaction type;
- amount;
- balance effect;
- reference;
- status.

Examples:

- GRANT;
- RESERVATION;
- RELEASE;
- CONSUMPTION;
- REFUND;
- ADJUSTMENT;
- EXPIRATION if introduced.

## 4.15 Billing History

Billing history should show:

- invoice number;
- invoice date;
- status;
- amount;
- currency;
- payment status;
- payment reference;
- invoice download action where supported.

Credit transactions must remain distinguishable from monetary billing.

---

# 9. Risks

## 9.1 R-FM04-001 — Stale Availability

**Risk:** User sees an available slot that becomes unavailable before confirmation.

**Impact:** High.

**Mitigation:**

- server-side revalidation;
- transactional resource allocation;
- database exclusion constraint;
- clear conflict handling.

## 9.2 R-FM04-002 — Double Booking

**Risk:** Concurrent requests allocate the same resource.

**Impact:** Critical.

**Mitigation:**

- database range exclusion;
- transactional locking;
- deterministic allocation;
- concurrency tests.

## 9.3 R-FM04-003 — Credit Inconsistency

**Risk:** Booking is confirmed but credits are not correctly reserved.

**Impact:** Critical.

**Mitigation:**

- transactional application service;
- append-only ledger;
- wallet projection;
- reconciliation;
- idempotency.

## 9.4 R-FM04-004 — Incorrect Client Quote

**Risk:** Client displays or uses stale pricing.

**Impact:** High.

**Mitigation:**

- authoritative server quote;
- quote expiration;
- server-side recomputation;
- no client-authoritative pricing.

## 9.5 R-FM04-005 — Cross-Tenant Booking Access

**Risk:** User accesses another organization's booking or wallet.

**Impact:** Critical.

**Mitigation:**

- API authorization;
- repository tenant filtering;
- database constraints;
- integration tests;
- security review.

## 9.6 R-FM04-006 — Incorrect Refund

**Risk:** Cancellation returns an incorrect number of credits.

**Impact:** Critical.

**Mitigation:**

- centralized cancellation policy;
- immutable ledger;
- explicit policy result;
- reconciliation.

## 9.7 R-FM04-007 — Resource State Drift

**Risk:** Lab/resource operational state differs from cloud state.

**Impact:** High.

**Mitigation:**

- Lab Agent state reporting;
- freshness timestamp;
- availability revalidation;
- later reconciliation;
- fail-safe booking policy.

## 9.8 R-FM04-008 — Maintenance Conflict

**Risk:** Booking overlaps planned or emergency maintenance.

**Impact:** High.

**Mitigation:**

- maintenance windows are authoritative;
- allocation checks;
- automatic rejection where required;
- cancellation/refund policy.

## 9.9 R-FM04-009 — Billing/Credit Confusion

**Risk:** Users interpret credits as currency or invoices as credit transactions.

**Impact:** Medium.

**Mitigation:**

- separate UI sections;
- explicit units;
- clear terminology;
- separate APIs and domain records.

## 9.10 R-FM04-010 — Quote Expiration

**Risk:** User confirms an expired quote.

**Impact:** Medium.

**Mitigation:**

- quote expiry timestamp;
- server rejection;
- automatic re-quote option.

## 9.11 R-FM04-011 — Booking Retry Duplication

**Risk:** Network retry creates duplicate booking or reservation.

**Impact:** High.

**Mitigation:**

- idempotency key;
- idempotency repository;
- deterministic response replay.

## 9.12 R-FM04-012 — Platform Catalog Drift

**Risk:** Studio displays outdated platform/version/configuration data.

**Impact:** Medium.

**Mitigation:**

- authoritative API;
- cache expiry;
- versioned platform catalog;
- booking-time validation.

## 9.13 R-FM04-013 — Financial Record Mutation

**Risk:** User interface permits accidental modification of financial history.

**Impact:** Critical.

**Mitigation:**

- append-only ledger;
- read-only history UI;
- controlled adjustment service;
- audit trail.

## 9.14 R-FM04-014 — Scope Expansion

**Risk:** F-M04 expands into payments, execution, or robot control.

**Impact:** Medium.

**Mitigation:**

- explicit non-scope;
- separate milestones;
- contract-first sequencing.

---

# 10. Exit Criteria

## 10.1 Functional Exit

- [ ] Platform catalog works.
- [ ] Platform details work.
- [ ] Version/configuration selection works.
- [ ] Capability display works.
- [ ] Availability works.
- [ ] Credit wallet works.
- [ ] Credit quote works.
- [ ] Booking creation works.
- [ ] Booking confirmation works.
- [ ] Resource allocation works.
- [ ] Booking list works.
- [ ] Booking detail works.
- [ ] Cancellation works.
- [ ] Credit release/refund works.
- [ ] Credit ledger/history works.
- [ ] Billing history works.

## 10.2 Financial Exit

- [ ] Credit types are platform-specific.
- [ ] Wallet is organization-scoped.
- [ ] Quote is server-authoritative.
- [ ] Reservation is atomic with booking.
- [ ] Ledger entries are immutable.
- [ ] Cancellation follows policy.
- [ ] Refund/release is recorded.
- [ ] Booking and credit states reconcile.
- [ ] Billing records are separate from credit records.

## 10.3 Resource Exit

- [ ] Availability considers resource state.
- [ ] Maintenance is considered.
- [ ] Existing allocations are considered.
- [ ] Capacity is considered.
- [ ] Booking-time revalidation works.
- [ ] Double allocation is prevented.
- [ ] Resource conflicts are handled.

## 10.4 Security Exit

- [ ] Authentication review passes.
- [ ] Authorization review passes.
- [ ] Tenant isolation tests pass.
- [ ] Wallet isolation tests pass.
- [ ] Booking isolation tests pass.
- [ ] Billing isolation tests pass.
- [ ] Audit requirements are satisfied.
- [ ] Financial operations are not client-authoritative.

## 10.5 Quality Exit

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] API contract tests pass.
- [ ] Database/integration tests pass.
- [ ] Concurrency tests pass.
- [ ] Credit reconciliation tests pass.
- [ ] E2E booking test passes.
- [ ] Cancellation/refund E2E passes.
- [ ] Billing tests pass.
- [ ] CI passes.

## 10.6 UI Exit

- [ ] Platform catalog reviewed.
- [ ] Availability calendar reviewed.
- [ ] Booking confirmation reviewed.
- [ ] Credit quote reviewed.
- [ ] Wallet reviewed.
- [ ] Billing history reviewed.
- [ ] Loading states reviewed.
- [ ] Empty states reviewed.
- [ ] Error states reviewed.
- [ ] Conflict states reviewed.
- [ ] Accessibility review passed.
- [ ] Dark/light themes passed.

## 10.7 Documentation Exit

- [ ] API contracts documented.
- [ ] Availability semantics documented.
- [ ] Booking lifecycle documented.
- [ ] Credit quote documented.
- [ ] Wallet behavior documented.
- [ ] Cancellation policy documented.
- [ ] Billing visibility documented.
- [ ] Concurrency behavior documented.
- [ ] Test evidence recorded.
- [ ] Tracking documents updated.

## 10.8 Formal Milestone Status

F-M04 follows:

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

`COMPLETE` requires acceptance evidence and tracking updates.

---
