# Kritva RaaS Credit Service

## 1. Document Control

| Item | Value |
|---|---|
| Document | Credit Service Architecture |
| Path | `docs/backend/architecture/CREDIT_SERVICE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Service | Credit Service |
| Ledger | Immutable double-entry ledger |
| Wallet Scope | Organization + Platform Credit Type |
| Pricing Authority | Credit Plan / Rate Policy |
| Monetary Authority | Billing Service |
| Booking Consumer | Booking Service |
| Execution Consumer | Job / Run Services |
| Persistence | PostgreSQL |
| Realtime | WebSocket events |
| Currency | Billing-system monetary currency |
| Credit Transfer | Non-transferable between platform types by default |

## 2. Purpose

The Credit Service provides the authoritative accounting system for RaaS
robotic execution credits.

Credits represent a platform-specific usage entitlement that can be consumed
when customers reserve and execute robotic workloads.

The service provides:

- credit plans;
- platform-specific credit types;
- credit rates;
- organization wallets;
- immutable ledger transactions;
- credit reservations;
- consumption;
- release;
- refunds;
- expiration;
- adjustments;
- concurrency control;
- reconciliation;
- billing integration;
- auditability.

The central commercial principle is:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine credit consumption.

## 3. Scope

This document defines:

- credit types;
- platform-specific wallets;
- credit plans;
- pricing/rate policies;
- credit issuance;
- wallet balances;
- double-entry ledger;
- reservations;
- consumption;
- release;
- refunds;
- expiration;
- adjustments;
- concurrency;
- idempotency;
- booking integration;
- Job/Run integration;
- Billing integration;
- audit;
- reconciliation;
- events;
- failure handling;
- security;
- observability;
- testing;
- Phase 0–8 implementation.

## 4. Non-Goals

The Credit Service does not:

- process payment-provider transactions directly;
- own invoices;
- own subscriptions;
- own bookings;
- allocate physical robots;
- execute applications;
- own artifact storage;
- define physical resource health;
- act as a general accounting/ERP system.

Billing Service remains authoritative for monetary transactions.

## 5. Architectural Principles

The Credit Service follows these principles:

1. Credits are platform-specific.
2. Credits are not generic currency.
3. Credit balances are organization-scoped.
4. Credit types cannot be silently interchanged.
5. Ledger records are immutable.
6. Financially significant operations are idempotent.
7. Every balance-changing operation has ledger evidence.
8. Double-entry accounting is the authoritative accounting model.
9. Wallet balance is derived from ledger state or maintained as a transactional projection.
10. Reservations are distinct from consumption.
11. Reserved credits are unavailable for other commitments.
12. Consumption is tied to an authorized usage event.
13. Refunds are explicit compensating transactions.
14. Billing owns money; Credit owns usage entitlement.
15. Booking owns reservations; Credit owns credit reservations.
16. Job/Run reports actual usage; Credit determines billable consumption.
17. Concurrency must not permit overspending.
18. Audit history is append-oriented.
19. Credit operations fail closed when correctness is uncertain.
20. Reconciliation is mandatory for distributed failures.

## 6. Credit Definition

A credit is a unit of platform-specific usage entitlement.

Example:

    Humanoid-A Credit
    = entitlement to consume Humanoid-A resources
      according to the applicable rate policy

A Humanoid-A credit is not equivalent to:

- Humanoid-B credit;
- cash;
- payment currency;
- generic RaaS credit.

## 7. Platform-Specific Credit Types

The initial commercial model uses separate credit types.

Example:

| Platform | Credit Type |
|---|---|
| Humanoid-A | `HUMANOID_A_CREDIT` |
| Humanoid-B | `HUMANOID_B_CREDIT` |
| Mobile-A | `MOBILE_A_CREDIT` |

Credit type is linked to a platform.

## 8. Credit Type Identity

A credit type should have a stable identity:

    credit_type_id
    platform_id
    code
    name
    status
    unit_definition
    created_at
    updated_at

Credit type identity must not be inferred from display names.

## 9. Credit Non-Transferability

By default:

    HUMANOID_A_CREDIT
          X
    HUMANOID_B_CREDIT

Credits cannot be transferred between platform types.

Any future conversion mechanism must be an explicit, auditable business
operation rather than an implicit balance conversion.

## 10. Wallet Definition

A wallet represents an organization's balance for one credit type.

Conceptually:

    Organization
        |
        +--> Humanoid-A Wallet
        |
        +--> Humanoid-B Wallet
        |
        +--> Mobile-A Wallet

Wallets are therefore platform-specific.

## 11. Wallet Identity

Recommended:

    wallet_id
    organization_id
    credit_type_id
    status
    available_balance
    reserved_balance
    created_at
    updated_at
    version

The organization and credit type combination should be unique.

## 12. Wallet Scope

The initial wallet scope is:

    organization_id
        +
    credit_type_id

Individual users consume credits through their organization's wallet.

Optional future scopes may include:

- project wallet;
- user wallet;
- promotional wallet.

These should not weaken the organization-level accounting model.

## 13. Available vs Reserved Balance

A wallet should distinguish:

    Total Balance
       |
       +--> Available
       |
       +--> Reserved

Invariant:

    Total = Available + Reserved

Example:

    Total = 10,000
    Reserved = 2,000
    Available = 8,000

A new reservation can consume only Available credits.

## 14. Credit Plans

A credit plan defines how credits are made available commercially.

Examples:

- Student;
- Developer;
- Research;
- Enterprise.

A plan may define:

- platform;
- credit type;
- credits included;
- validity;
- purchase price;
- rate policy;
- quota relationships;
- expiration rules.

## 15. Platform-Specific Plans

Plans remain platform-specific where required.

Example:

    Student / Humanoid-A
    Developer / Humanoid-A
    Research / Humanoid-A

and independently:

    Student / Humanoid-B
    Developer / Humanoid-B
    Research / Humanoid-B

This prevents accidental cross-platform accounting.

## 16. Subscription vs Credit Plan

Subscription determines access rights.

Credit plan determines credit entitlement and commercial credit terms.

For example:

    Subscription
       |
       +--> Can access Humanoid-A

    Credit Plan
       |
       +--> Has 10,000 Humanoid-A credits

The two concepts must not be merged into a single mutable balance.

## 17. Credit Rate

A credit rate defines how much credit consumption is required for usage.

Example:

    Humanoid-A
    Rate = 15 credits/minute

For a 30-minute execution:

    15 × 30 = 450 credits

## 18. Rate Dimensions

Rates may depend on:

- platform;
- resource;
- resource configuration;
- execution mode;
- duration;
- subscription;
- credit plan;
- effective date;
- peak/off-peak period.

The rate model must be data-driven.

## 19. Rate Definition

Conceptual:

    RatePolicy
      id
      credit_type_id
      platform_id
      resource_class_id
      plan_id
      unit
      rate
      minimum_units
      effective_from
      effective_until
      status

Rates must be versioned or effective-dated.

## 20. Rate Immutability

Historical consumption must retain the rate that was actually applied.

Changing a future rate must not rewrite previous ledger transactions.

Example:

    Rate V1
      15 credits/min

    Rate V2
      18 credits/min

Existing consumption remains recorded at V1.

## 21. Quote

Before booking, the Booking Service may request a quote.

Conceptual:

    Booking Request
         |
         v
    Credit Quote
         |
         +--> Credit Type
         +--> Rate
         +--> Duration
         +--> Required Credits
         +--> Policy Version

A quote is informational unless explicitly converted into a reservation.

## 22. Quote Expiration

Quotes should have:

- quote ID;
- created time;
- expiration time;
- rate policy version;
- requested usage;
- calculated credit amount.

Expired quotes must not silently authorize a booking.

## 23. Reservation Definition

A credit reservation temporarily holds credits for an anticipated operation.

Example:

    Available
       |
       v
    Reserve 450
       |
       v
    Reserved

Reservation does not mean credits have been consumed.

## 24. Reservation Lifecycle

Recommended:

    CREATED
       |
       v
    HELD
       |
       +------> RELEASED
       |
       +------> CONSUMED
       |
       +------> EXPIRED
       |
       +------> CANCELLED

Reservation state is durable.

## 25. Reservation Purpose

Reservations protect credits from concurrent use.

Without reservation:

    Wallet = 500

Two bookings:

    Booking A -> 400
    Booking B -> 400

Both may see 500 and succeed incorrectly.

With reservation:

    A reserves 400
    Available = 100

    B requests 400
    -> INSUFFICIENT_CREDITS

## 26. Reservation Ownership

Every reservation must reference:

- organization;
- wallet;
- credit type;
- operation;
- booking/job where applicable;
- requested amount;
- reserved amount;
- expiration;
- status.

## 27. Reservation Idempotency

Reservation requests must be idempotent.

Key:

    reservation_id
    or
    Idempotency-Key

Repeated request returns the same reservation rather than creating another
hold.

## 28. Reservation Expiration

Reservations must have an expiration time.

Expired reservations are released.

A recovery worker must identify stale reservations.

## 29. Consumption

Consumption converts reserved entitlement into permanently recorded usage.

Example:

    HELD
      |
      v
    Execution Used
      |
      v
    CONSUMED

Consumption must reference actual or authorized usage.

## 30. Consumption Amount

Consumption may be based on:

- booked duration;
- actual execution duration;
- resource-specific metering;
- fixed booking amount;
- minimum billable unit.

The selected policy must be explicit.

## 31. Actual Usage

Where actual runtime duration is available:

    Job/Run
       |
       v
    Actual Usage
       |
       v
    Credit Calculation
       |
       v
    Consumption

The service must prevent double consumption for the same Run.

## 32. Minimum Billable Unit

Rates may use a minimum unit.

Example:

    Rate = 15 credits/minute
    Minimum = 5 minutes

A 2-minute execution may consume:

    5 × 15 = 75 credits

The policy must be disclosed to the customer.

## 33. Rounding

Usage calculation must define:

- unit;
- precision;
- rounding direction;
- minimum;
- maximum.

Example:

    7.2 minutes
       |
       v
    Round up to 8 minutes
       |
       v
    8 × rate

The rule must be deterministic.

## 34. Reservation vs Consumption

The distinction is:

    Reservation
        = temporary commitment

    Consumption
        = final usage accounting

This distinction is required for correct cancellation, failed execution and
partial usage handling.

## 35. Release

A release returns reserved but unconsumed credits to Available.

Example:

    Available = 1,000
    Reserved = 500

Release 500:

    Available = 1,500
    Reserved = 0

The release must be represented in the ledger.

## 36. Refund

A refund compensates previously consumed credits.

Example:

    Consumption = 500
    Refund = 200

The ledger records a separate refund transaction.

The original consumption is never rewritten.

## 37. Refund vs Release

| Operation | Applies To | Meaning |
|---|---|---|
| Release | Reserved credits | Reservation no longer needed |
| Refund | Consumed credits | Previously charged usage compensated |

These operations must not be conflated.

## 38. Refund Policy

Refunds may result from:

- user cancellation;
- system failure;
- maintenance interruption;
- platform outage;
- administrative adjustment;
- SLA policy.

Refund authority should be policy-driven and audited.

## 39. Double-Entry Ledger

The Credit Service must use an immutable double-entry ledger.

Every balance-changing transaction has at least:

    Debit Entry
    Credit Entry

The ledger must balance.

Core invariant:

    Sum(Debits) = Sum(Credits)

## 40. Ledger Accounts

Conceptual accounts include:

- customer wallet;
- reserved credit liability;
- earned/consumed credit account;
- promotional credit account;
- expired credit account;
- adjustment account.

The exact chart of accounts may evolve.

## 41. Credit Accounting Model

For a simple customer credit issuance:

    Platform Credit Pool
           |
           | credit
           v
    Customer Wallet

For consumption:

    Customer Wallet
           |
           | debit
           v
    Usage Revenue / Consumed Credit Account

The exact financial interpretation must remain separate from monetary revenue
accounting.

## 42. Reservation Accounting

A reservation should not be treated as consumption.

Conceptually:

    Available Customer Credits
           |
           v
    Reserved Customer Credits

This may be represented as an internal reclassification:

    Debit:  Available Credit Account
    Credit: Reserved Credit Account

No final usage revenue recognition occurs at reservation time.

## 43. Release Accounting

Release reverses the reservation:

    Debit:  Reserved Credit Account
    Credit: Available Credit Account

The transaction must reference the original reservation.

## 44. Consumption Accounting

On consumption:

    Debit:  Reserved Credit Account
    Credit: Consumed Credit Account

This moves the held entitlement into consumed usage.

## 45. Refund Accounting

Refunding consumed credits:

    Debit:  Refund/Adjustment Account
    Credit: Customer Available Credit Account

The exact account semantics must be defined by the final accounting policy.

The critical requirement is that the refund is an immutable compensating
entry.

## 46. Promotional Credits

Promotional credits should be separately identifiable.

Example:

    Purchased Credits
    Promotional Credits

Consumption policy may define whether promotional credits are consumed first.

Promotional credits may have:

- expiration;
- platform restriction;
- campaign ID;
- non-refundable status.

## 47. Credit Expiration

Credits may expire according to plan policy.

Expiration should be recorded explicitly.

Example:

    Customer Available
         |
         v
    Expired Credit Account

Expiration is not silent balance deletion.

## 48. Expiration Priority

If multiple credit lots exist, consumption policy may use:

- earliest-expiring-first;
- oldest-first;
- promotional-first;
- explicit lot priority.

The policy must be deterministic.

## 49. Credit Lots

A future implementation may maintain credit lots:

    Lot A
      1,000 credits
      expires 2027-01-01

    Lot B
      2,000 credits
      expires 2027-06-01

This supports correct expiration and promotional accounting.

## 50. Wallet Balance

The wallet balance may be maintained as a transactional projection.

The ledger remains authoritative.

Invariant:

    Ledger-derived balance
        =
    Wallet projection

Any mismatch is a reconciliation failure.

## 51. Wallet Concurrency

Credit operations are high-integrity operations.

The service must serialize updates to a wallet or equivalent account set.

Possible mechanism:

    SELECT wallet FOR UPDATE
          |
          v
    Validate Available Balance
          |
          v
    Write Ledger
          |
          v
    Update Projection
          |
          v
    COMMIT

## 52. Overspending Prevention

The following must never occur:

    available_balance < 0

unless an explicitly supported overdraft product exists.

The initial system should not support implicit overdraft.

## 53. Concurrent Reservation Example

Initial:

    Available = 1,000

Requests:

    A = 700
    B = 500

Correct result:

    A = HELD 700
    B = REJECTED

Final:

    Available = 300
    Reserved = 700

## 54. Concurrent Consumption

Two workers must not consume the same reservation.

The reservation must have:

- unique identity;
- state;
- consumed amount;
- remaining amount;
- version/concurrency control.

## 55. Partial Consumption

A reservation may be partially consumed.

Example:

    Reserved = 500
    Actual usage = 350

Then:

    Consume 350
    Release 150

The final ledger must represent both operations.

## 56. Over-Consumption

If actual usage exceeds reservation:

    Reserved = 500
    Actual = 650

The service must apply explicit policy:

- additional reservation;
- controlled debit from available credits;
- reject;
- administrative review.

It must never silently create negative balance.

## 57. Insufficient Credits

If sufficient credits cannot be established:

    INSUFFICIENT_CREDITS

The Booking Service must not confirm a credit-dependent booking.

## 58. Credit Platform Mismatch

A Humanoid-B booking cannot consume Humanoid-A credits.

Result:

    CREDIT_PLATFORM_MISMATCH

This is a hard validation failure.

## 59. Credit Plan

A plan may define:

    plan_id
    credit_type_id
    included_credits
    purchase_price
    currency
    validity_period
    expiration_policy
    rate_policy_id
    status

Plan definitions are versioned/effective-dated.

## 60. Plan Activation

Billing/Subscription systems may activate a credit plan.

Flow:

    Payment
       |
       v
    Billing
       |
       v
    Plan Entitlement
       |
       v
    Credit Service
       |
       v
    Issue Credits
       |
       v
    Wallet

## 61. Credit Issuance

Issuance creates an immutable ledger transaction.

Example:

    Purchase 10,000 Humanoid-A Credits

    Debit:  Credit Pool / Receivable
    Credit: Customer Humanoid-A Wallet

The transaction references:

- billing transaction;
- plan;
- order/invoice;
- organization.

## 62. Billing Integration

Billing Service owns:

- payment;
- invoice;
- refund of monetary payment;
- subscription.

Credit Service owns:

- credit issuance;
- credit reservation;
- credit consumption;
- credit refund;
- credit expiration.

## 63. Billing-to-Credit Flow

    Customer
       |
       v
    Payment
       |
       v
    Billing Service
       |
       v
    Successful Payment
       |
       v
    Credit Issuance Command
       |
       v
    Credit Service
       |
       v
    Wallet + Ledger

Credit issuance must be idempotent against the Billing transaction ID.

## 64. Payment Failure

If payment fails:

    Billing FAILED
        |
        v
    No Credit Issuance

Credits must not be issued based on a client-side payment success indication.

## 65. Payment Reversal

If a payment is later reversed:

    Billing Reversal
         |
         v
    Credit Service
         |
         v
    Compensating Credit Transaction

If the credits have already been consumed, the system needs an explicit
negative-balance/recovery policy or account adjustment workflow.

Implicitly deleting consumed credits is prohibited.

## 66. Billing Refund vs Credit Refund

A monetary refund and a credit refund are different operations.

    Billing Refund
        = money returned

    Credit Refund
        = credit entitlement restored

One may trigger the other according to commercial policy, but neither should
be assumed to be automatically identical.

## 67. Wallet Status

Possible wallet states:

    ACTIVE
    SUSPENDED
    CLOSED

Suspended wallets cannot create new reservations.

Existing reservations require policy-defined handling.

## 68. Credit Ledger Transaction

Conceptual:

    LedgerTransaction
      transaction_id
      organization_id
      credit_type_id
      reference_type
      reference_id
      idempotency_key
      transaction_type
      timestamp
      description
      policy_version

Each transaction contains ledger entries.

## 69. Ledger Entry

Conceptual:

    LedgerEntry
      entry_id
      transaction_id
      account_id
      direction
      amount
      credit_type_id
      created_at

Amounts should be non-negative.

Direction determines accounting effect.

## 70. Ledger Transaction Types

Initial transaction types:

    ISSUANCE
    RESERVATION
    RELEASE
    CONSUMPTION
    REFUND
    EXPIRATION
    ADJUSTMENT
    TRANSFER

`TRANSFER` should remain disabled unless explicitly supported.

## 71. Immutable Ledger

Ledger transactions must never be updated to change historical accounting.

Corrections are represented by new transactions.

Example:

    Incorrect Consumption
         |
         v
    Original Ledger Entry
         |
         v
    Compensating Refund
         |
         v
    Corrected Net Balance

## 72. Manual Adjustment

Administrative adjustments require:

- authorized role;
- reason;
- reference;
- actor;
- idempotency;
- audit record.

Example:

    Adjustment +500
       |
       v
    Ledger Transaction
       |
       v
    Audit Event

## 73. Audit Model

Audit must capture:

- actor;
- organization;
- wallet;
- credit type;
- operation;
- amount;
- previous relevant state;
- resulting state;
- reference;
- reason;
- timestamp;
- correlation ID.

## 74. Financial Auditability

For any wallet balance, operators must be able to answer:

- where did credits come from?
- which plan issued them?
- which bookings reserved them?
- which runs consumed them?
- which refunds returned them?
- which credits expired?
- who made adjustments?

## 75. Balance Calculation

Conceptual:

    Opening Balance
      + Issuance
      + Refund
      + Adjustments
      - Consumption
      - Expiration
      = Total Entitlement

Reservations reclassify available vs reserved balance without changing total
entitlement.

## 76. Wallet Projection

For performance, the service may maintain:

    available_balance
    reserved_balance
    total_balance

The projection is updated in the same transaction as ledger writes.

## 77. Projection Reconciliation

Periodic reconciliation:

    Ledger
      |
      v
    Recalculate Balance
      |
      v
    Compare Projection
      |
      +--> Match --> Healthy
      |
      +--> Mismatch --> ALERT + REPAIR

Projection repair must not mutate ledger history.

## 78. Credit Reservation API

Conceptual:

    reserve(
        organization_id,
        credit_type_id,
        amount,
        reference,
        expires_at,
        idempotency_key
    )

Returns:

    reservation_id
    reserved_amount
    expires_at
    wallet_balance

## 79. Credit Consumption API

Conceptual:

    consume(
        reservation_id,
        amount,
        usage_reference,
        idempotency_key
    )

Returns:

    transaction_id
    consumed_amount
    remaining_reserved
    remaining_available

## 80. Credit Release API

Conceptual:

    release(
        reservation_id,
        amount,
        reason,
        idempotency_key
    )

Returns:

    transaction_id
    released_amount
    reservation_status

## 81. Credit Refund API

Conceptual:

    refund(
        organization_id,
        credit_type_id,
        amount,
        reference,
        reason,
        idempotency_key
    )

Returns:

    transaction_id
    refunded_amount

Refund must reference the original consumption or policy decision.

## 82. Quote API

Conceptual:

    quote(
        platform_id,
        resource_class_id,
        duration,
        plan_id
    )

Returns:

    quote_id
    credit_type_id
    rate
    units
    required_credits
    expires_at
    rate_policy_version

## 83. Wallet Query API

Representative:

    GET /api/v1/credits/balance

Optional:

    GET /api/v1/credits/wallets
    GET /api/v1/credits/transactions
    GET /api/v1/credits/reservations

## 84. Credit Commands

Protocol commands include:

    credit.balance
    credit.quote
    credit.transaction.list
    credit.consumption
    credit.refund

Internal application commands additionally include:

    credit.issue
    credit.reserve
    credit.release
    credit.expire
    credit.adjust

## 85. Credit Events

Required events:

    credit.balance_changed
    credit.consumed
    credit.refunded

Additional events:

    credit.issued
    credit.reserved
    credit.released
    credit.expired
    credit.adjusted
    credit.reservation_expired

## 86. Credit Event Example

    {
        "protocol_version": "1.0",
        "event_id": "evt-credit-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "event": "credit.consumed",
        "resource": {
            "type": "wallet",
            "id": "wallet-001"
        },
        "context": {
            "organization_id": "org-001"
        },
        "sequence": 42,
        "data": {
            "wallet_id": "wallet-001",
            "credit_type_id": "HUMANOID_A_CREDIT",
            "amount": 450,
            "reference_type": "run",
            "reference_id": "run-001"
        }
    }

## 87. Event Semantics

Credit events are notifications of committed ledger state.

They are not authorization mechanisms.

Consumers must query the Credit Service when they require authoritative current
balance.

## 88. Event Reliability

Balance-changing transactions should use:

    Ledger Transaction
       +
    Wallet Projection
       +
    Outbox Event

inside one database transaction.

Then:

    Commit
      |
      v
    Event Publisher
      |
      v
    WebSocket / Consumers

## 89. Booking Integration

Booking Service uses Credit Service for:

- quote;
- reservation;
- release;
- cancellation refund;
- modification impact.

Booking Service does not mutate wallet balances directly.

## 90. Booking Creation Flow

    User
      |
      v
    Booking Quote
      |
      v
    Credit Quote
      |
      v
    Booking Create
      |
      v
    Credit Reserve
      |
      v
    Booking Confirmed

Failure at credit reservation prevents confirmation.

## 91. Booking Cancellation Flow

    CONFIRMED Booking
          |
          v
    Cancel
          |
          v
    Credit Release
          |
          v
    Booking CANCELLED

If policy requires a partial refund after consumption, the appropriate
compensating credit operation is used.

## 92. Booking Modification Flow

    Existing Reservation
          |
          v
    New Duration
          |
          v
    Recalculate Credits
          |
          v
    Additional Reserve
       OR
    Partial Release
          |
          v
    Booking Updated

The original reservation must remain auditable.

## 93. Job/Run Integration

Execution usage should reference:

- booking;
- job;
- run;
- platform;
- resource;
- usage duration;
- rate policy.

Example:

    Run R001
       |
       +-- platform = Humanoid-A
       +-- duration = 30 min
       +-- rate = 15/min
       |
       v
    Consumption = 450

## 94. Run Completion Flow

    Run Completed
         |
         v
    Actual Usage
         |
         v
    Credit Calculation
         |
         v
    Consume Reservation
         |
         v
    Release Unused Reservation
         |
         v
    credit.balance_changed

## 95. Failed Run

If a run fails before meaningful execution:

    Reserved Credits
         |
         v
    Release

If partial execution occurred:

    Actual Usage
         |
         v
    Consume Actual
         |
         v
    Refund/Release Remaining

The exact policy is platform-specific.

## 96. Timeout

A Job timeout must not automatically imply full credit consumption.

Usage must be determined according to:

- actual execution;
- minimum billable unit;
- reservation policy;
- platform commercial policy.

## 97. Cancellation Before Execution

If a booking/job is cancelled before execution:

    Reservation HELD
          |
          v
    RELEASE
          |
          v
    Available

No consumption occurs.

## 98. Cancellation During Execution

If execution has started:

    Reservation HELD
          |
          +--> Consume Actual Usage
          |
          +--> Release Remaining

Any additional refund depends on cancellation policy.

## 99. Credit Reservation Expiration

If a booking expires unused:

    HELD
      |
      v
    EXPIRED
      |
      v
    RELEASE

The operation must be recorded in the ledger.

## 100. Credit Expiration

Unused issued credits may expire independently of reservations.

Example:

    Available Credits
         |
         v
    Plan Expiration
         |
         v
    EXPIRED

Expiration is recorded as a ledger transaction.

## 101. Concurrency Model

All wallet-affecting operations require strong consistency.

Recommended transaction:

    BEGIN
      |
      v
    Lock Wallet
      |
      v
    Validate Credit Type
      |
      v
    Validate Balance
      |
      v
    Write Ledger Entries
      |
      v
    Update Projection
      |
      v
    Write Outbox Event
      |
      v
    COMMIT

## 102. Deadlock Avoidance

When multiple wallets/accounts are involved:

- lock resources in deterministic order;
- keep transactions short;
- avoid external network calls inside transactions;
- use bounded retry for serialization failures.

## 103. Idempotency Store

Financially significant operations should record:

    idempotency_key
    organization_id
    operation_type
    request_fingerprint
    transaction_id
    result
    created_at
    expires_at

A duplicate request must return the original result.

## 104. Retry Semantics

Safe retry:

    Database Serialization Failure
        |
        v
    Retry Transaction

Unsafe retry:

    External Credit Reserve Timeout
        |
        v
    Unknown Result
        |
        v
    Reconcile Before Retrying

Never blindly create a second financial transaction.

## 105. Failure Modes

Important failures include:

- insufficient credits;
- credit type mismatch;
- wallet suspended;
- duplicate request;
- database unavailable;
- billing service unavailable;
- booking service unavailable;
- ledger imbalance;
- projection mismatch;
- reservation expired;
- rate policy unavailable;
- reconciliation required.

## 106. Ledger Imbalance

A ledger transaction must never commit if:

    Sum(Debits) != Sum(Credits)

This is a hard database/application invariant.

## 107. Projection Mismatch

If:

    Ledger Balance != Wallet Projection

the system must:

- raise an alert;
- prevent unsafe balance-affecting operations if necessary;
- reconcile;
- repair projection from ledger.

The ledger itself must not be rewritten.

## 108. Billing Integration Failure

If payment succeeds but credit issuance confirmation is uncertain:

    Payment Success
         |
         X
    Credit Issuance Unknown
         |
         v
    Reconciliation

Do not issue credits twice.

Use the immutable Billing transaction ID as an idempotency reference.

## 109. Billing Reconciliation

Periodic reconciliation compares:

    Billing Transactions
           |
           v
    Credit Issuance
           |
           v
    Expected Credits
           |
           v
    Actual Credits

Mismatches require operator/recovery workflows.

## 110. Rate Policy Failure

If a booking requires a rate but the rate policy cannot be resolved:

    No Rate
       |
       v
    No Credit Quote
       |
       v
    No Booking Confirmation

The system must fail closed.

## 111. Security

Credit Service requires:

- authentication;
- organization authorization;
- role-based administrative controls;
- server-side tenant isolation;
- strict input validation;
- idempotency;
- audit;
- encryption in transit;
- protected database access.

## 112. Administrative Operations

Administrative operations include:

- issue credits;
- adjust credits;
- refund;
- expire;
- suspend wallet;
- close wallet;
- modify future rate policies.

These require elevated authorization and mandatory reason/audit data.

## 113. Customer Visibility

Customers should see:

- available balance;
- reserved balance;
- total balance;
- credit type;
- recent transactions;
- expiration;
- current rate;
- reservation impact.

They should not see internal accounting credentials or unrelated organization
data.

## 114. Transaction History

Transaction listing should expose:

- transaction ID;
- type;
- amount;
- credit type;
- reference;
- timestamp;
- status;
- description.

Pagination must be cursor-based.

## 115. Ledger Privacy

Ledger data is organization-scoped.

A user must not be able to inspect another organization's:

- wallet;
- transactions;
- credit balances;
- adjustments.

## 116. Audit vs Ledger

The ledger records accounting facts.

Audit records:

- who initiated the operation;
- why;
- administrative context;
- request/correlation identifiers.

They are complementary, not interchangeable.

## 117. Observability

Metrics include:

- wallet count;
- available credits;
- reservation count;
- reservation latency;
- consumption count;
- refund count;
- expiration count;
- issuance count;
- insufficient-credit failures;
- ledger transaction failures;
- reconciliation failures;
- projection mismatches;
- billing reconciliation failures.

## 118. Alerts

Critical alerts include:

- ledger imbalance;
- wallet projection mismatch;
- negative balance;
- repeated idempotency conflicts;
- failed credit reconciliation;
- failed billing reconciliation;
- stuck reservations;
- excessive refund rate;
- abnormal consumption.

## 119. Performance

Credit operations prioritize correctness over throughput.

Wallet updates should be short transactions.

High-volume telemetry must not directly write one ledger transaction per sensor
sample.

Only billable usage aggregates should affect credit accounting.

## 120. Usage Aggregation

For a 30-minute Run:

    Telemetry Samples
        |
        v
    Usage Meter
        |
        v
    30-minute Billable Usage
        |
        v
    One Credit Consumption

This avoids coupling high-frequency telemetry to financial accounting.

## 121. Database Model

Conceptual entities:

    credit_types
    credit_plans
    rate_policies
    wallets
    credit_lots
    reservations
    ledger_transactions
    ledger_entries
    idempotency_records
    outbox_events
    credit_adjustments

## 122. Wallet Repository

Conceptual:

    WalletRepository
        get(wallet_id)
        getByOrganizationAndType(...)
        lock(wallet_id)
        updateProjection(...)
        list(...)

## 123. Ledger Repository

Conceptual:

    LedgerRepository
        createTransaction(...)
        createEntries(...)
        getTransaction(...)
        listTransactions(...)
        calculateBalance(...)
        calculateReservedBalance(...)

Ledger repositories must not support destructive updates.

## 124. Reservation Repository

Conceptual:

    CreditReservationRepository
        create(...)
        get(...)
        lock(...)
        consume(...)
        release(...)
        expire(...)
        findExpired(...)

## 125. Rate Repository

Conceptual:

    RatePolicyRepository
        getEffectiveRate(...)
        list(...)
        createVersion(...)
        retire(...)
        findApplicable(...)

Historical rate versions must remain queryable.

## 126. Credit Service Interface

Conceptual:

    CreditService
        quote(...)
        issue(...)
        reserve(...)
        release(...)
        consume(...)
        refund(...)
        expire(...)
        adjust(...)
        getBalance(...)
        getTransactions(...)
        reconcile(...)

## 127. Booking Service Boundary

The Booking Service should call:

    quote()
    reserve()
    release()
    refund()

It should never:

    update wallet balance directly

or:

    insert ledger entries directly.

## 128. Job Service Boundary

The Job/Run subsystem should call:

    consume()
    release()
    reconcileUsage()

It should provide:

- reservation ID;
- actual usage;
- Job ID;
- Run ID;
- platform;
- resource;
- usage timestamp.

## 129. Billing Service Boundary

Billing calls:

    issue()
    or
    adjust/reverse()

using an immutable external reference.

The Credit Service returns:

    credit_transaction_id

which Billing can retain for reconciliation.

## 130. Event Consumers

Consumers may include:

- Booking Service;
- Job Service;
- Studio/Web Console;
- Notification Service;
- Audit Service;
- Billing reconciliation;
- analytics.

Consumers must tolerate duplicate events.

## 131. Phase Mapping

| Phase | Credit Service Scope |
|---|---|
| Phase 0 | Domain, ledger and credit contracts |
| Phase 1 | Wallet and balance APIs |
| Phase 2 | Plans and rate policies |
| Phase 3 | Reservation/ledger infrastructure |
| Phase 4 | Booking and billing integration |
| Phase 5 | Job/Run consumption |
| Phase 6 | Physical resource metering |
| Phase 7 | Results, analytics and notifications |
| Phase 8 | Financial hardening and reconciliation |

## 132. Phase 0

Define:

- credit type;
- wallet;
- plan;
- rate;
- reservation;
- ledger;
- transaction types;
- state models;
- error codes;
- events.

The double-entry invariant must be defined before implementation.

## 133. Phase 1

Implement:

- wallet records;
- balance queries;
- organization isolation;
- transaction history;
- API contracts;
- authorization;
- idempotency foundation.

## 134. Phase 2

Implement:

- credit plans;
- platform-specific plans;
- rate policies;
- effective dates;
- quotes;
- expiration policies.

## 135. Phase 3

Implement:

- double-entry ledger;
- reservations;
- release;
- consumption;
- refunds;
- concurrency control;
- reconciliation.

This phase establishes financial correctness.

## 136. Phase 4

Integrate:

- Booking Service;
- Billing Service;
- credit issuance;
- booking reservation;
- cancellation;
- commercial plans.

## 137. Phase 5

Integrate Job/Run:

    Booking
       |
       v
    Credit Reservation
       |
       v
    Job
       |
       v
    Run
       |
       v
    Actual Usage
       |
       v
    Consumption
       |
       v
    Release Remaining

## 138. Phase 6

Integrate physical resource usage:

- runtime metering;
- resource-specific rates;
- execution duration;
- platform/resource configuration;
- Lab Agent usage reporting.

The Lab Agent remains an execution telemetry source, not a ledger authority.

## 139. Phase 7

Integrate:

- credit events;
- realtime balance updates;
- experiment cost tracking;
- result usage summaries;
- user notifications.

## 140. Phase 8

Harden:

- accounting controls;
- key financial reconciliations;
- ledger verification;
- rate-policy governance;
- administrative approvals;
- audit retention;
- disaster recovery;
- load/concurrency testing;
- operational runbooks.

## 141. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Double spending | Transactional wallet locking |
| Ledger imbalance | Double-entry invariant |
| Duplicate consumption | Idempotency |
| Duplicate issuance | Billing transaction ID |
| Credit type mismatch | Platform-bound wallets |
| Rate changes corrupt history | Effective-dated policies |
| Reservation leak | Expiration/recovery worker |
| Refund duplication | Idempotent compensating transactions |
| Negative balance | Strong balance constraints |
| Projection mismatch | Ledger reconciliation |
| Billing inconsistency | Periodic reconciliation |
| Booking inconsistency | Saga + compensation |
| Worker retry duplication | Idempotency |
| Concurrent reservations | Wallet serialization |
| Manual fraud | RBAC + audit + approval |
| Event loss | Outbox + reconciliation |
| Telemetry overload | Aggregate usage before ledger |
| Expired credit loss ambiguity | Explicit expiration transactions |
| Cross-tenant leakage | Server-side authorization |
| Rate lookup failure | Fail closed |

## 142. Open Questions

1. What exact double-entry chart of accounts will be adopted?
2. Will credit lots be implemented in the MVP?
3. Will purchased and promotional credits be consumed in different priority?
4. What exact expiration policy applies to each plan?
5. Will credits ever be transferable between organizations?
6. Will credit conversion between platform types ever be supported?
7. What exact signature is used for commercial credit transactions?
8. What monetary currency is used for plan pricing?
9. Will rates be per minute, per second, or another unit?
10. What rounding policy will apply?
11. What minimum billable unit will each platform use?
12. Is booking duration or actual execution duration the primary billing basis?
13. How will overrun beyond a reservation be handled?
14. Can an organization purchase credits without an active subscription?
15. What happens when a subscription is suspended?
16. What happens to existing reserved credits when a wallet is suspended?
17. What happens to consumed credits after monetary payment reversal?
18. Will negative balances ever be allowed?
19. What approval workflow is required for manual adjustments?
20. What audit retention is legally/commercially required?
21. Will credit lots require FIFO/FEFO accounting?
22. What exact rate policy hierarchy applies?
23. Can rates vary by time of day?
24. Can rates vary by individual physical robot?
25. What is the maximum wallet transaction rate?
26. What reconciliation interval is required?
27. Which system owns customer-facing invoices?
28. What exact billing-to-credit issuance event contract will be used?
29. What exact accounting treatment will be used for expired credits?
30. How will credit accounting map to future financial reporting requirements?

## 143. Full Acceptance Criteria

### Credit Types

- [ ] Credit types are explicit entities.
- [ ] Credit types map to platforms.
- [ ] Credit types have stable IDs.
- [ ] Platform-specific credit types are enforced.
- [ ] Cross-platform credit use is rejected.
- [ ] Credit transfer is disabled by default.
- [ ] Credit type lifecycle is auditable.

### Plans

- [ ] Credit plans are versioned/effective-dated.
- [ ] Plans identify credit type.
- [ ] Plans define included credits.
- [ ] Plans define validity.
- [ ] Plans define expiration policy.
- [ ] Plans define applicable rate policy.
- [ ] Historical plan versions remain queryable.
- [ ] Plan changes do not rewrite historical transactions.

### Rates

- [ ] Rates are data-driven.
- [ ] Rates identify platform/credit type.
- [ ] Rates can identify resource class.
- [ ] Rates can identify plan.
- [ ] Rates have effective dates.
- [ ] Historical rates are retained.
- [ ] Quotes use a specific rate policy version.
- [ ] Rounding is deterministic.
- [ ] Minimum billable units are explicit.

### Wallet

- [ ] Wallet is organization-scoped.
- [ ] Wallet is credit-type scoped.
- [ ] Organization + credit type is unique.
- [ ] Available balance is tracked.
- [ ] Reserved balance is tracked.
- [ ] Total balance is tracked or derivable.
- [ ] Wallet cannot silently become negative.
- [ ] Wallet status is enforced.
- [ ] Wallet access is organization-isolated.

### Ledger

- [ ] Ledger is immutable.
- [ ] Ledger uses double-entry accounting.
- [ ] Every transaction has balanced entries.
- [ ] Debit and credit totals must balance.
- [ ] Historical transactions cannot be edited.
- [ ] Corrections use compensating transactions.
- [ ] Every balance change has ledger evidence.
- [ ] Ledger transactions have stable IDs.
- [ ] Ledger transactions carry references.
- [ ] Ledger transactions are auditable.

### Issuance

- [ ] Credit issuance is idempotent.
- [ ] Billing transaction reference is retained.
- [ ] Payment success is verified server-side.
- [ ] Failed payments do not issue credits.
- [ ] Duplicate billing events cannot issue credits twice.
- [ ] Promotional credits are identifiable.
- [ ] Issuance is recorded in the ledger.

### Reservation

- [ ] Reservations are separate from consumption.
- [ ] Reservations have stable IDs.
- [ ] Reservations identify wallet.
- [ ] Reservations identify credit type.
- [ ] Reservations reference booking/job where appropriate.
- [ ] Reservations have expiration.
- [ ] Reservations are idempotent.
- [ ] Reserved credits cannot be spent elsewhere.
- [ ] Reservation release is idempotent.
- [ ] Reservation expiration is recorded.

### Consumption

- [ ] Consumption references a reservation where required.
- [ ] Consumption is idempotent.
- [ ] Actual usage is represented.
- [ ] Minimum billable units are enforced.
- [ ] Rounding is deterministic.
- [ ] Partial consumption is supported.
- [ ] Unused reservations can be released.
- [ ] Over-consumption is explicitly handled.
- [ ] Duplicate Run consumption is prevented.
- [ ] Consumption is recorded in the ledger.

### Refund

- [ ] Refund is distinct from release.
- [ ] Refund is a compensating transaction.
- [ ] Original consumption is immutable.
- [ ] Refunds are idempotent.
- [ ] Refunds reference the original transaction.
- [ ] Refund policy is explicit.
- [ ] Refunds are audited.
- [ ] Administrative refunds require authorization.

### Concurrency

- [ ] Wallet-affecting transactions are strongly consistent.
- [ ] Concurrent reservations cannot overspend.
- [ ] Concurrent consumption cannot double-spend.
- [ ] Wallet locking/serialization is implemented.
- [ ] Deadlocks are handled safely.
- [ ] Serialization failures may be retried.
- [ ] External uncertain operations are reconciled before retry.

### Booking Integration

- [ ] Booking Service cannot mutate wallets directly.
- [ ] Credit quote is available.
- [ ] Booking can reserve credits.
- [ ] Booking cancellation can release credits.
- [ ] Booking modification can adjust reservations.
- [ ] Booking conflict cannot consume credits.
- [ ] Credit reservation failure prevents unauthorized confirmation.
- [ ] Compensation is idempotent.

### Job/Run Integration

- [ ] Job/Run can reference credit reservations.
- [ ] Actual usage can be reported.
- [ ] Consumption references Run.
- [ ] Failed runs follow explicit credit policy.
- [ ] Timeouts follow explicit credit policy.
- [ ] Cancellation follows explicit credit policy.
- [ ] Unused reserved credits can be released.
- [ ] Telemetry is aggregated before ledger accounting.

### Billing Integration

- [ ] Billing remains authoritative for money.
- [ ] Credit Service remains authoritative for credits.
- [ ] Successful payment can trigger issuance.
- [ ] Billing transaction IDs provide idempotency.
- [ ] Payment failures prevent issuance.
- [ ] Payment reversals have defined credit handling.
- [ ] Monetary refunds and credit refunds are distinct.
- [ ] Billing reconciliation is implemented.

### Events

- [ ] `credit.issued` exists.
- [ ] `credit.reserved` exists.
- [ ] `credit.released` exists.
- [ ] `credit.consumed` exists.
- [ ] `credit.refunded` exists.
- [ ] `credit.expired` exists.
- [ ] `credit.balance_changed` exists.
- [ ] Events contain organization context.
- [ ] Events contain credit type.
- [ ] Events contain relevant reference IDs.
- [ ] Events are at-least-once.
- [ ] Consumers tolerate duplicates.
- [ ] Events are backed by committed state.

### Expiration

- [ ] Credit expiration policy is defined.
- [ ] Expiration is explicit.
- [ ] Expiration is recorded in the ledger.
- [ ] Expired credits cannot be consumed.
- [ ] Reservation expiration is distinct from credit expiration.
- [ ] Expiration is auditable.
- [ ] Expiration processing is recoverable.

### Access Control

- [ ] Authentication is required.
- [ ] Organization authorization is enforced.
- [ ] Wallet access is tenant-isolated.
- [ ] Transaction access is tenant-isolated.
- [ ] Administrative adjustments require elevated privileges.
- [ ] Administrative actions require reasons.
- [ ] Sensitive financial information is protected.

### Reconciliation

- [ ] Wallet projection can be rebuilt from ledger.
- [ ] Ledger imbalance is detectable.
- [ ] Negative balance is detectable.
- [ ] Reservation leaks are detectable.
- [ ] Billing issuance mismatches are detectable.
- [ ] Booking reservation mismatches are detectable.
- [ ] Consumption mismatches are detectable.
- [ ] Reconciliation is idempotent.
- [ ] Reconciliation failures generate alerts.

### Observability

- [ ] Credit issuance metrics exist.
- [ ] Reservation metrics exist.
- [ ] Consumption metrics exist.
- [ ] Refund metrics exist.
- [ ] Expiration metrics exist.
- [ ] Insufficient-credit metrics exist.
- [ ] Ledger failure metrics exist.
- [ ] Reconciliation metrics exist.
- [ ] Billing reconciliation metrics exist.
- [ ] Correlation IDs are recorded.
- [ ] Secrets are never logged.

### Testing

- [ ] Double-entry balance is tested.
- [ ] Wallet balance is tested.
- [ ] Concurrent reservation is tested.
- [ ] Concurrent consumption is tested.
- [ ] Duplicate requests are tested.
- [ ] Reservation expiration is tested.
- [ ] Partial consumption is tested.
- [ ] Refund is tested.
- [ ] Billing issuance idempotency is tested.
- [ ] Booking compensation is tested.
- [ ] Run consumption is tested.
- [ ] Ledger reconciliation is tested.
- [ ] Cross-tenant access is tested.
- [ ] End-to-end booking-to-consumption flow is tested.

## 144. Final Architectural Invariants

1. Credits are platform-specific.
2. A platform determines the applicable credit type.
3. Credits are not generic currency.
4. Wallets are organization and credit-type scoped.
5. Credit plans define commercial entitlement.
6. Rate policies define usage consumption.
7. Historical rates are immutable through effective-dated versions.
8. Credit balances are backed by an immutable ledger.
9. The ledger uses double-entry accounting.
10. Every ledger transaction balances.
11. Corrections use compensating transactions.
12. Wallet projections never override the ledger.
13. Reservations are distinct from consumption.
14. Reserved credits cannot be spent twice.
15. Consumption is tied to authorized usage.
16. Release returns unused reserved entitlement.
17. Refund compensates previously consumed entitlement.
18. Reservation, consumption and refund are idempotent.
19. Concurrent wallet operations are strongly consistent.
20. Negative balances are prohibited by default.
21. Credit type mismatch is a hard failure.
22. Billing owns money.
23. Credit Service owns credit entitlement.
24. Booking Service owns bookings.
25. Job/Run owns execution state.
26. Lab owns physical resource state.
27. Billing transaction IDs provide issuance idempotency.
28. Credit events represent committed state.
29. WebSocket events are not authoritative balance state.
30. Reconciliation is mandatory after uncertain distributed operations.
31. Administrative adjustments are explicit and audited.
32. Historical ledger records are never rewritten.
33. High-frequency telemetry is aggregated before financial accounting.
34. Credit expiration is an explicit accounting transaction.
35. Platform-specific credits remain non-transferable by default.
36. Financial correctness takes precedence over execution convenience.

## 145. Completion Condition

The Credit Service is complete when the RaaS platform can reliably execute:

    Customer Purchases Plan
            |
            v
    Billing Confirms Payment
            |
            v
    Credit Issuance
            |
            v
    Platform Wallet
            |
            v
    Booking Quote
            |
            v
    Credit Reservation
            |
            v
    Booking Confirmed
            |
            v
    Job / Run
            |
            v
    Actual Usage
            |
            v
    Credit Consumption
            |
            v
    Release Unused Reservation
            |
            v
    Updated Wallet + Ledger

while guaranteeing:

- no double spending;
- no cross-platform credit consumption;
- no unbalanced ledger transaction;
- no duplicate issuance;
- no duplicate consumption;
- no unauthorized refund;
- no silent expiration;
- no false balance after concurrency;
- no untracked administrative adjustment;
- no financial state that cannot be reconciled.

The resulting service must preserve the commercial principle:

> **Subscription determines access; robotic platform determines credit type; resource configuration and duration determine credit consumption.**

and the accounting principle:

> **The ledger is immutable, every balance-changing operation is auditable, and uncertain distributed operations are reconciled rather than blindly retried.**
