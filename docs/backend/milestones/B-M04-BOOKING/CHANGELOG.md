# B-M04-BOOKING — Changelog

Milestone: B-M04 — Booking

# 11 Changelog

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

- Initial B-M04 milestone dossier.
- No implementation is implied by this document.
- Availability is not booking confirmation.
- Booking confirmation is server-authoritative.
- Credit balances are not authoritative without ledger evidence.
- Ledger history is append-oriented and corrections use compensating entries.
- Payment-provider identity is separate from Kritva business identity.
- Physical safety remains outside the booking and commercial authority boundary.

---

# Appendix A — Phase Mapping

The canonical mapping for B-M04 BOOKING (P4) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Upstream dependency; outputs consumed by this milestone |  |
| P4 BOOKING & COMMERCIAL | Owning phase |  |
| P5 EXECUTION | Downstream consumer of this milestone's outputs | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Downstream consumer of this milestone's outputs | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Downstream consumer of this milestone's outputs |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Booking Architecture

    +-------------------+
    | Availability      |
    +---------+---------+
              |
              v
    +-------------------+
    | Credit Quote      |
    +---------+---------+
              |
              v
    +-------------------+
    | Credit Reservation|
    +---------+---------+
              |
              v
    +-------------------+
    | Resource Allocation|
    +---------+---------+
              |
              v
    +-------------------+
    | Booking Confirmed |
    +---------+---------+
              |
              v
    +-------------------+
    | Job / Execution   |
    +-------------------+

Every transition must preserve its domain-specific invariants.

---

# Appendix C — Booking State Machine

    DRAFT
      |
      v
    PENDING
      |
      +----------> REJECTED
      |
      v
    CONFIRMED
      |
      +----------> CANCELLED
      |
      v
    ACTIVE
      |
      +----------> FAILED
      |
      v
    COMPLETED

Additional expiration path:

    PENDING
      |
      v
    EXPIRED

A transition is permitted only when its preconditions are satisfied.

---

# Appendix D — Booking Confirmation Transaction

Conceptual transaction:

    BEGIN

    Lock / validate booking
    Validate resource
    Validate time range
    Validate maintenance
    Validate availability
    Validate credit reservation
    Create allocation
    Protect against overlap
    Update booking = CONFIRMED
    Record state history
    Record audit event

    COMMIT

The implementation may use multiple coordinated transactions only where the
architecture explicitly guarantees equivalent invariants.

---

# Appendix E — Availability Architecture

    Resource State
         |
    Lab State
         |
    Maintenance
         |
    Availability Window
         |
    Existing Allocations
         |
    Platform Eligibility
         |
         v
    Availability Service
         |
         v
    Candidate Slots

Availability output is a candidate set.

It does not reserve anything.

---

# Appendix F — Credit Architecture

    +----------------------+
    |     Credit Type      |
    +----------+-----------+
               |
               v
    +----------------------+
    |      Credit Plan     |
    +----------+-----------+
               |
               v
    +----------------------+
    |      Rate Card       |
    +----------+-----------+
               |
               v
    +----------------------+
    |     Credit Quote     |
    +----------+-----------+
               |
               v
    +----------------------+
    |        Wallet        |
    +----------+-----------+
               |
               v
    +----------------------+
    |   Credit Reservation |
    +----------+-----------+
               |
               v
    +----------------------+
    |     Consumption      |
    +----------+-----------+
               |
               v
    +----------------------+
    |        Ledger        |
    +----------------------+

---

# Appendix G — Wallet and Ledger

The wallet is the current operational projection.

The ledger is the financial evidence.

Conceptually:

    Ledger
       |
       v
    Projection
       |
       v
    Wallet

If:

    Wallet != Ledger Projection

then:

    RECONCILIATION FINDING

The system must not silently modify historical ledger entries to make the
numbers appear consistent.

---

# Appendix H — Double-Entry Credit Model

Conceptual reservation:

    Transaction: RESERVE-001

    Credit Wallet Available
        -450

    Credit Wallet Reserved
        +450

Conceptual consumption:

    Transaction: CONSUME-001

    Reserved
        -450

    Consumed
        +450

Conceptual release:

    Transaction: RELEASE-001

    Reserved
        -450

    Available
        +450

The exact account model may use separate ledger accounts or entry dimensions,
but each transaction must remain balanced.

---

# Appendix I — Credit Quote Model

Inputs:

    organization_id
    project_id
    platform_id
    platform_version_id
    configuration_id
    resource_type
    duration_seconds
    requested_start_at

Processing:

    Validate Access
        |
        v
    Select Credit Type
        |
        v
    Select Effective Rate Card
        |
        v
    Apply Configuration
        |
        v
    Calculate Required Credits
        |
        v
    Return Quote

The quote should identify the policy/rate-card version used.

---

# Appendix J — Platform-Specific Credit Principle

Example:

    Platform A
       |
       v
    Credit Type A

    Platform B
       |
       v
    Credit Type B

Wallets:

    Org-001 + Credit Type A = 2,000
    Org-001 + Credit Type B = 1,000

The system must not silently use Credit Type B to satisfy a Platform A booking.

Any future conversion must be an explicit product decision and ledger
transaction.

---

# Appendix K — Cancellation Model

    Cancel Request
         |
         v
    Authorization
         |
         v
    Booking State Check
         |
         v
    Cancellation Policy
         |
      +--+--+
      |     |
      v     v
    Refund  No Refund
      |
      v
    Credit Release
      |
      v
    Booking CANCELLED

Cancellation policy may depend on:

- time before start;
- booking state;
- resource type;
- customer plan;
- administrative cancellation;
- robot fault;
- lab failure.

---

# Appendix L — Robot/Lab Failure Cancellation

Operational failure example:

    Booking CONFIRMED
          |
          v
    Robot FAULT
          |
          v
    Lab / Resource Service
          |
          v
    Booking Review
          |
          v
    Cancellation Policy
          |
       +--+--+
       |     |
       v     v
    Credit  Refund
    Return  Decision

A robot fault should not be treated as a customer cancellation.

The cancellation actor/type must identify the operational cause.

---

# Appendix M — Payment Architecture

    Customer
       |
       v
    Control Plane
       |
       v
    Payment Service
       |
       v
    Provider Adapter
       |
       v
    Payment Provider

Provider callback:

    Provider
       |
       v
    Webhook Endpoint
       |
       v
    Signature Verification
       |
       v
    Idempotency
       |
       v
    Payment State
       |
       v
    Credit Grant / Refund

External provider state must not directly mutate wallet state without passing
through controlled business logic.

---

# Appendix N — Payment State

    CREATED
       |
       v
    PENDING
       |
       +------> FAILED
       |
       v
    AUTHORIZED
       |
       v
    CAPTURED
       |
       v
    COMPLETED
       |
       v
    REFUNDED

Provider-specific states must be mapped to this normalized internal model.

---

# Appendix O — Billing Model

    Invoice
       |
       +--> Invoice Lines
       |      |
       |      +--> Subscription
       |      +--> Credits
       |      +--> Usage
       |      +--> Adjustment
       |
       +--> Payment
       |
       +--> Refund

Invoices provide commercial presentation/evidence.

The credit ledger remains authoritative for credit movement.

---

# Appendix P — Reconciliation Architecture

## Booking

    Booking
       |
       +--> Allocation
       +--> Reservation
       +--> State History

Check:

    Confirmed booking
      =>
    valid allocation
      +
    valid credit reservation

## Credits

    Ledger
       |
       v
    Wallet

Check balances.

## Payments

    Provider
       |
       v
    Payment Record
       |
       v
    Invoice
       |
       v
    Credit Grant

Check all references.

---

# Appendix Q — Audit Events

Booking events:

    booking.created
    booking.pending
    booking.confirmed
    booking.rejected
    booking.active
    booking.completed
    booking.cancelled
    booking.failed
    booking.expired

Credit events:

    credit.quote_created
    credit.reservation_created
    credit.reservation_released
    credit.consumed
    credit.refunded
    credit.adjusted

Payment events:

    payment.created
    payment.authorized
    payment.captured
    payment.failed
    payment.refunded

Financial operations require strong audit evidence.

---

# Appendix R — API Surface

Initial conceptual endpoints:

    GET  /api/v1/availability
    POST /api/v1/bookings
    GET  /api/v1/bookings
    GET  /api/v1/bookings/:bookingId
    POST /api/v1/bookings/:bookingId/confirm
    POST /api/v1/bookings/:bookingId/cancel
    GET  /api/v1/credits/quote
    GET  /api/v1/credits/wallets
    GET  /api/v1/credits/ledger
    GET  /api/v1/billing/invoices
    GET  /api/v1/billing/invoices/:invoiceId
    GET  /api/v1/payments
    POST /api/v1/payments
    POST /api/v1/payments/webhooks/:provider

Exact REST semantics are subject to API contract review.

---

# Appendix S — Booking Request

Conceptual request:

    {
        "project_id": "project-001",
        "platform_id": "platform-001",
        "platform_version_id": "platform-version-001",
        "configuration_id": "config-001",
        "requested_start_at": "2026-10-15T10:00:00Z",
        "requested_duration_seconds": 1800,
        "timezone": "Asia/Kolkata",
        "purpose": "robot experiment"
    }

The backend derives:

- resource eligibility;
- credit type;
- rate;
- required credits;
- allocation;
- booking state.

The client does not directly set those authoritative values.

---

# Appendix T — Booking Response

Conceptual response:

    {
        "booking_id": "booking-001",
        "status": "CONFIRMED",
        "project_id": "project-001",
        "platform_id": "platform-001",
        "resource_id": "resource-001",
        "requested_start_at": "2026-10-15T10:00:00Z",
        "requested_end_at": "2026-10-15T10:30:00Z",
        "credit_type": "CREDIT-KR-REFBOT",
        "credits_reserved": 450,
        "allocation_status": "CONFIRMED"
    }

Actual response fields must follow API v1 conventions.

---

# Appendix U — Financial Invariants

The following must always hold:

1. A confirmed booking has a valid allocation.
2. A confirmed booking has required credit reservation where policy requires.
3. A credit reservation cannot exceed available wallet balance.
4. A wallet cannot become negative unless explicitly supported by policy.
5. Ledger transactions are balanced.
6. Ledger entries are immutable.
7. Financial corrections use compensating entries.
8. Duplicate payment events cannot duplicate credit grants.
9. Duplicate refunds cannot duplicate refunds.
10. Historical rates remain associated with historical bookings.
11. Payment state does not become successful from unverified client input.
12. Credit consumption has ledger evidence.
13. Credit release has ledger evidence.
14. Refunds have ledger/payment evidence.
15. Tenant boundaries apply to every financial object.

---

# Appendix V — Operational Metrics

Recommended metrics:

- availability queries;
- availability latency;
- booking requests;
- booking conflicts;
- booking confirmations;
- booking cancellations;
- booking failures;
- active bookings;
- resource utilization;
- quote requests;
- credit reservations;
- credit releases;
- credit consumption;
- refund count;
- wallet reconciliation discrepancies;
- ledger reconciliation discrepancies;
- payment success rate;
- payment failure rate;
- webhook duplication rate;
- payment reconciliation discrepancies;
- invoice generation latency.

Financial metrics must be access-controlled and tenant-safe.

---

# Appendix W — Open Questions

1. What is the exact first-release cancellation policy?
2. Are credits consumed for setup/teardown time?
3. Is billing based on booked time or actual execution time?
4. What is the minimum billable duration?
5. Are partial minutes rounded up?
6. What happens when execution starts late?
7. What happens when execution ends early?
8. What happens when a robot fails during execution?
9. What happens when a Lab becomes unavailable?
10. What happens when the cloud loses connectivity?
11. Can bookings be extended?
12. Can bookings be shortened?
13. Is extension subject to real-time availability?
14. Is extension subject to additional credit reservation?
15. Can customers queue for unavailable resources?
16. Are recurring bookings supported?
17. Are multi-resource bookings supported?
18. Can a booking reserve multiple robots?
19. Are setup and teardown buffers customer-visible?
20. Are maintenance buffers charged?
21. Which resources are exclusive?
22. Can a resource support concurrent workloads?
23. How are platform-specific credit types created?
24. Are credits transferable between projects?
25. Are credits transferable between organizations?
26. Do credits expire?
27. What happens to expired credits?
28. Are refunds returned as credits or money?
29. Can purchased credits be refunded?
30. How are promotional credits represented?
31. Can promotional and purchased credits have different priority?
32. What is the exact Student/Developer/Research plan behavior?
33. Can an organization have multiple active plans?
34. How are plan upgrades prorated?
35. How are plan downgrades handled?
36. Which payment providers are supported at launch?
37. Is payment required before credit issuance?
38. Are credits granted immediately after payment capture?
39. What happens after payment authorization but before capture?
40. How are chargebacks handled?
41. How are failed payments retried?
42. What invoice numbering scheme is required?
43. Which taxes must be calculated?
44. Which jurisdictions are supported?
45. What legal entity issues invoices?
46. How long are financial records retained?
47. What is the financial reconciliation schedule?
48. What is the acceptable reconciliation discrepancy window?
49. Who can perform manual credit adjustments?
50. Are manual adjustments double-approved?
51. What approval is required for refunds?
52. Can support personnel issue credits?
53. How are payment provider outages communicated?
54. What is the authoritative payment event?
55. How are provider disputes represented?
56. How are booking and credit migrations handled?
57. What happens to bookings when a platform is retired?
58. How are rate-card changes approved?
59. Are rates cached?
60. What commercial data is visible to Project viewers?
61. Which billing records are organization-admin only?
62. What financial data is exposed to support personnel?
63. What is the exact ledger account model?
64. Is double-entry implemented at the first production release or a
    transaction-balanced single-ledger model?
65. What accounting system, if any, integrates later?

These questions must become explicit product, architecture, financial or legal
decisions before they affect production behavior.

---

# Appendix X — Definition of Done

B-M04 is Done when this complete flow works:

    Discover Resource
          |
          v
    Query Availability
          |
          v
    Calculate Quote
          |
          v
    Check Wallet
          |
          v
    Reserve Credits
          |
          v
    Allocate Resource
          |
          v
    Confirm Booking
          |
          v
    Execute Later
          |
          v
    Consume / Release Credits
          |
          v
    Complete / Cancel
          |
          v
    Refund if Applicable
          |
          v
    Reconcile
          |
          v
    Billing Evidence

The flow must remain consistent under concurrent requests, failures, retries
and duplicate external events.

---

# Appendix Y — Final Milestone Invariants

1. Availability is not booking confirmation.
2. Booking confirmation is server-authoritative.
3. Booking belongs to an Organization and Project.
4. Resource allocation is explicit.
5. Resource conflicts are prevented transactionally.
6. Booking state transitions are explicit.
7. Booking history is preserved.
8. Cancellation policy is explicit.
9. Credit type is platform-specific.
10. Credit types are not silently interchangeable.
11. Credit plans are distinct from rate cards.
12. Rate cards are effective-dated.
13. Historical bookings retain applied pricing evidence.
14. Quote does not mutate wallet state.
15. Reservation mutates available/reserved credit state.
16. Consumption is distinct from reservation.
17. Release is distinct from refund.
18. Wallet is a current-state projection.
19. Ledger is the financial evidence.
20. Ledger entries are append-oriented and immutable.
21. Financial corrections use compensating transactions.
22. Wallet cannot be overspent.
23. Payment callbacks are authenticated.
24. Payment callbacks are idempotent.
25. Successful payment does not bypass controlled credit issuance.
26. Refunds are idempotent.
27. Billing is distinct from the credit ledger.
28. Cross-tenant commercial access is denied.
29. Financial operations are audited.
30. Reconciliation is required for booking, credit and payment domains.
31. UI calculations are not authoritative.
32. Booking availability can become stale before confirmation.
33. Booking confirmation must survive concurrent requests safely.
34. Execution must validate booking eligibility later.
35. Booking cannot override physical safety.
36. Payment-provider-specific identities do not become business identities.
37. Provider outages produce explicit pending/error states.
38. Historical financial evidence is never silently deleted.
39. Production commercial behavior requires security and financial review.
40. B-M04 provides the authoritative reservation and commercial foundation for
    the RaaS execution path.
41. Completion requires implementation, automated tests, reconciliation
    evidence, security review, financial controls review and acceptance.

# Appendix Z — Milestone Principle

> B-M04 establishes the authoritative resource reservation and commercial
> foundation of Kritva RaaS. Availability identifies possible resource
> capacity, while booking provides the transactional reservation of a resource
> for a defined interval. Platform-specific credit types separate the cost
> model of different robotic platforms, while plans define access and
> commercial entitlements and rate cards determine consumption. Wallets
> provide current operational balance, but the append-oriented ledger remains
> the financial evidence. Credit reservations bridge bookings and financial
> state without prematurely consuming credits. Billing and payments remain
> separate but integrated domains, using provider-neutral interfaces and
> idempotent callbacks. PostgreSQL transactionality, time-range conflict
> protection, strong consistency and reconciliation preserve the critical
> invariants under concurrency and failure. The resulting foundation supports
> the core RaaS promise: discover a robot, reserve a real execution window,
> pay or consume the correct platform credits, execute within the authorized
> booking, and preserve trustworthy commercial evidence throughout the
> lifecycle.
