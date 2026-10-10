# F-M04-BOOKING — Changelog

Milestone: F-M04 — Booking

# 11. Changelog

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

- Initial F-M04 milestone dossier.
- No implementation is implied by this document.
- F-M04 establishes platform discovery, availability, booking, credits and
  billing visibility.
- Booking confirmation is server-authoritative.
- Credit reservation and resource allocation must be transactionally safe.
- Physical robot safety remains outside the Studio and booking UI boundary.

---

# Appendix A — Phase Mapping

## A.1 Phase 0 — FOUNDATION

F-M04 consumes:

- Studio foundation;
- API client;
- authentication;
- UI system;
- CI;
- development environment;
- database architecture;
- security foundations.

## A.2 Phase 1 — STUDIO

F-M04 consumes:

- organizations;
- projects;
- memberships;
- platform catalog;
- platform versions;
- database repositories;
- authorization.

## A.3 Phase 2 — BUILD & ARTIFACT

F-M04 is a primary Phase 2 milestone.

It establishes the first complete customer-facing reservation and credit
workflow.

## A.4 Phase 3 — CONTROL PLANE

F-M04 provides the booking context required by:

- Job creation;
- resource allocation;
- artifact deployment;
- Lab Agent execution.

## A.5 Phase 4 — BOOKING & COMMERCIAL

F-M04 is foundational to:

- credit plans;
- rate cards;
- billing;
- subscriptions;
- usage;
- refunds;
- commercial policies.

## A.6 Phase 5 — EXECUTION

F-M04 consumes:

- real lab state;
- robot state;
- resource availability;
- maintenance windows;
- Lab Agent health.

## A.7 Phase 6 — LAB & ROBOT

F-M04 is strengthened by:

- financial audit;
- tenant isolation;
- security monitoring;
- reconciliation;
- production authorization;
- operational controls.

## A.8 Phase 7 — LIVE & RESULTS

F-M04 expands to:

- larger platform catalogs;
- more labs;
- more resources;
- concurrent bookings;
- capacity planning;
- operational scheduling.

## A.9 Phase 8 — PRODUCTION

F-M04 becomes part of the production customer journey:

    Discover
       |
       v
    Subscribe
       |
       v
    Credits
       |
       v
    Book
       |
       v
    Execute
       |
       v
    Results
       |
       v
    Rebook

---

# Appendix B — Booking Data Flow

    User
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
    Availability Query
      |
      v
    Available Slot
      |
      v
    Credit Quote
      |
      v
    Booking Confirmation
      |
      +------------------+
      |                  |
      v                  v
    Resource          Credit
    Allocation        Reservation
      |                  |
      +--------+---------+
               |
               v
          Booking Record
               |
               v
        Booking Confirmation

The two branches must reach a consistent transactional outcome.

---

# Appendix C — Credit Flow

    Wallet
      |
      v
    Available Balance
      |
      v
    Quote
      |
      v
    Reservation
      |
      v
    Booking Confirmed
      |
      +-------------------+
      |                   |
      v                   v
    Consumption       Cancellation
      |                   |
      v                   v
    Final Debit       Release/Refund
      |                   |
      +---------+---------+
                |
                v
             Ledger

F-M04 establishes reservation and cancellation behavior.

Final execution consumption belongs to the later Job/Run integration.

---

# Appendix D — Booking State Model

    DRAFT
      |
      v
    PENDING
      |
      +----> REJECTED
      |
      +----> FAILED
      |
      v
    CONFIRMED
      |
      v
    ACTIVE
      |
      v
    COMPLETED

Cancellation can occur according to policy from eligible states:

    PENDING / CONFIRMED / ACTIVE
                 |
                 v
             CANCELLED

Expired bookings:

    PENDING
       |
       v
    EXPIRED

The exact transition matrix is authoritative in the Booking domain contract.

---

# Appendix E — Availability Model

Availability is derived rather than stored as a single static boolean.

Conceptually:

    Available(resource, interval)
      =
      ResourceActive
      AND LabOperational
      AND PlatformEligible
      AND ConfigurationEligible
      AND NoMaintenanceConflict
      AND NoAllocationConflict
      AND CapacityAvailable
      AND PolicyAllowsBooking

The Studio should display the result but must not independently reproduce the
authoritative decision logic.

---

# Appendix F — Quote and Reservation Relationship

A quote is an estimate/authorization input with an expiration.

A reservation is a financial state change.

Therefore:

    Quote
      |
      | does not itself reserve credits
      v
    Booking Confirmation
      |
      v
    Credit Reservation

This prevents merely viewing an availability calendar or quote from consuming
credits.

---

# Appendix G — Booking Confirmation Transaction

The authoritative server flow is:

    Request
      |
      v
    Authenticate
      |
      v
    Authorize
      |
      v
    Validate Project
      |
      v
    Validate Platform
      |
      v
    Validate Quote
      |
      v
    Validate Availability
      |
      v
    Lock / Allocate Resource
      |
      v
    Reserve Credits
      |
      v
    Create Booking
      |
      v
    Create Time Slots
      |
      v
    Create State History
      |
      v
    Commit
      |
      v
    Return Confirmation

If any authoritative step fails, the transaction must not leave a partial
confirmed booking or orphaned credit reservation.

---

# Appendix H — UI Information Architecture

    RaaS Studio
      |
      +-- Projects
      |
      +-- Platforms
      |     |
      |     +-- Catalog
      |     +-- Platform Detail
      |     +-- Availability
      |
      +-- Bookings
      |     |
      |     +-- Upcoming
      |     +-- Active
      |     +-- History
      |     +-- Booking Detail
      |
      +-- Credits
      |     |
      |     +-- Wallets
      |     +-- Transactions
      |
      +-- Billing
            |
            +-- Invoices
            +-- Payments

The exact navigation may evolve with the Studio information architecture,
but domain ownership must remain clear.

---

# Appendix I — Booking Detail Model

| Field | Source | Authority |
|---|---|---|
| Booking ID | Booking | Server |
| Organization | Booking | Server |
| Project | Project/Booking | Server |
| Platform | Platform | Server |
| Version | Platform Version | Server |
| Configuration | Platform Configuration | Server |
| Resource | Allocation | Server |
| Robot | Resource | Server |
| Start | Booking | Server |
| End | Booking | Server |
| Duration | Booking | Server |
| Status | Booking | Server |
| Credit Reservation | Credit | Server |
| Cancellation Policy | Booking Policy | Server |
| Created At | Booking | Server |
| Updated At | Booking | Server |

---

# Appendix J — Financial Invariants

1. Credit wallets are organization-scoped.
2. Credit types are platform-specific.
3. Credits are non-transferable by default.
4. Quotes do not consume credits.
5. Reservations affect available balance.
6. Reservations must be idempotent.
7. Ledger records are append-only.
8. Financial adjustments require controlled services.
9. Booking confirmation cannot bypass credit validation.
10. Cancellation follows an explicit policy.
11. Refund/release is represented explicitly.
12. Billing money is separate from platform credits.
13. Client-side balances are informational.
14. Server-side balance is authoritative.
15. Financial state must be reconcilable.

---

# Appendix K — Resource Invariants

1. A resource has one authoritative operational state.
2. A resource can have multiple historical allocations.
3. Active allocations cannot overlap.
4. Maintenance can make a resource unavailable.
5. Lab state can make a resource unavailable.
6. Platform compatibility is mandatory.
7. Configuration compatibility is mandatory.
8. Booking does not override resource safety state.
9. Resource allocation is server-authoritative.
10. Database conflict protection is mandatory.
11. Availability results are advisory until confirmation.
12. Physical safety remains local to the robot/lab.

---

# Appendix L — Open Questions

The following items require explicit decisions before the affected functionality
is marked production-complete:

1. Should F-M04 support direct resource selection or only platform/configuration
   selection?
2. Should users see individual robot identities for physical resources?
3. Which platform configurations are exposed to end users versus administrators?
4. What is the default booking time granularity?
5. What minimum booking duration applies per platform?
6. What maximum booking duration applies per platform?
7. Are setup and teardown buffers visible to customers?
8. Which cancellation windows produce full credit return?
9. Which cancellation windows produce partial credit return?
10. What happens to credits when a robot fault interrupts an active booking?
11. Should unused booked time be automatically returned after early completion?
12. Does a confirmed booking reserve credits for the full requested duration?
13. When is final execution consumption calculated?
14. Are credits refundable when a job never starts?
15. Are credits refundable for Lab Agent/cloud failures?
16. What is the commercial relationship between subscription and credit plans?
17. Are credit plans organization-level or user-level?
18. Can organization administrators allocate credits to individual users?
19. Are credits ever transferable between projects within an organization?
20. Will future platform conversion be supported?
21. What monetary billing records are available in the initial MVP?
22. Which payment provider is used in production?
23. Are invoices generated by Kritva or an external billing system?
24. What tax information must appear on invoices?
25. What retention period applies to billing records?
26. What availability freshness threshold should trigger mandatory refresh?
27. How should emergency maintenance affect confirmed future bookings?
28. How should a Lab Agent disconnect affect availability?
29. What is the maximum acceptable booking confirmation latency?
30. What administrative override capabilities are permitted?
31. Which operations require step-up authentication?
32. Which booking information is visible to project viewers?
33. Can a project viewer cancel a booking?
34. Can an organization admin cancel another user's booking?
35. What support-role visibility exists for financial records?
36. How are refunds represented when monetary and credit refunds coexist?
37. What reconciliation frequency is required between wallet projections and
   ledger transactions?
38. Should booking history include resource/robot identity after reassignment?
39. What historical snapshot fields must be retained permanently?
40. Which commercial policies are configurable without deployment?

Open questions must be converted into tracked decisions before they become
implementation assumptions.

---

# Appendix M — Definition of Done

F-M04 is Done only when the complete workflow is demonstrable:

    Discover Platform
          |
          v
    Select Version
          |
          v
    Select Configuration
          |
          v
    Check Availability
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
    Allocate Resource
          |
          v
    View Booking
          |
          v
    Cancel / Complete
          |
          v
    Release / Consume Credits
          |
          v
    View Ledger
          |
          v
    View Billing

Every authoritative state transition must have test evidence.

---

# Appendix N — Final Milestone Invariants

1. Platform catalog is authoritative.
2. Platform version compatibility is explicit.
3. Architecture is explicit.
4. Configuration is explicit.
5. Capabilities are discoverable.
6. Resource is distinct from Robot identity.
7. Availability is derived from operational state.
8. Availability shown in the UI is not a booking guarantee.
9. Booking confirmation revalidates availability.
10. Database allocation constraints prevent double booking.
11. Booking is organization-scoped.
12. Project authorization is enforced.
13. Credit type is platform-specific.
14. Credit wallet is organization-scoped.
15. Credits are non-transferable by default.
16. Quote is server-authoritative.
17. Quote expiration is enforced.
18. Quote does not itself consume credits.
19. Credit reservation is tied to booking confirmation.
20. Booking and credit reservation are transactionally consistent.
21. Ledger is append-only.
22. Client cannot mutate financial history.
23. Cancellation follows explicit policy.
24. Refund/release is recorded.
25. Billing is distinct from credits.
26. Billing history is tenant-isolated.
27. Booking requests are idempotent.
28. Retries cannot create duplicate bookings.
29. Stale availability cannot create double allocation.
30. Resource state can invalidate availability.
31. Maintenance can invalidate availability.
32. Physical safety state cannot be overridden by booking UI.
33. UI is not an authorization boundary.
34. Backend authorization is authoritative.
35. Financial balances displayed by the UI are not authoritative.
36. Historical booking state remains auditable.
37. Booking details retain required historical context.
38. Errors never silently create financial state.
39. Failed booking does not leave an orphaned credit reservation.
40. Failed cancellation does not falsely report refund.
41. Billing records are read-only through the customer UI.
42. All critical financial/resource operations are testable.
43. Concurrency behavior is explicitly verified.
44. Tenant isolation is explicitly verified.
45. F-M04 establishes the authoritative reservation and credit foundation
    required by remote execution.
46. Remote robot execution remains outside this milestone.
47. No booking workflow bypasses local robot/lab safety authority.
48. Milestone completion requires evidence, review and tracking updates.

# Appendix O — Milestone Principle

> F-M04 converts Kritva RaaS from a development-and-artifact workflow into a
> resource-access workflow. The user must be able to discover an eligible
> robotic platform, understand its capabilities and configuration, select an
> available time, receive an authoritative credit quote, confirm a booking,
> reserve the required platform-specific credits, manage the booking and
> inspect the associated financial history. Availability, pricing, credit
> balances and resource allocation are never client-authoritative. The
> Control Plane must revalidate every critical condition at confirmation time,
> and database-level concurrency controls must prevent double allocation.
> Credits remain distinct from monetary billing, and financial history remains
> append-only and auditable. F-M04 therefore establishes the trusted resource
> reservation boundary that later allows the F-M03 `.krv` artifact to be
> scheduled for simulation or real robotic execution without conflating
> development, resource allocation, financial state and physical safety.
