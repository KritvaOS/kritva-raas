# DB-M03-BOOKING-DATA — Acceptance Criteria

Milestone: DB-M03-BOOKING-DATA — Booking, Availability, Credits and Commercial Data

## 6 Acceptance criteria

### 6.1 Booking schema

- [ ] `booking.bookings` exists.
- [ ] Booking has stable identifier.
- [ ] Booking belongs to an organization.
- [ ] Booking references a project.
- [ ] Booking references platform.
- [ ] Booking may reference platform version.
- [ ] Booking may reference configuration.
- [ ] Booking key is unique in its intended scope.
- [ ] Booking status is constrained.
- [ ] Requested start/end are `timestamptz`.
- [ ] End is after start.
- [ ] Requested duration is consistent with time range.
- [ ] Timezone is retained where required.
- [ ] Actual start/end are represented.
- [ ] Credit reservation reference is represented.
- [ ] Idempotency key is represented.
- [ ] Created/updated timestamps exist.

### 6.2 Booking lifecycle

- [ ] DRAFT is supported.
- [ ] PENDING is supported.
- [ ] CONFIRMED is supported.
- [ ] ACTIVE is supported.
- [ ] COMPLETED is supported.
- [ ] CANCELLED is supported.
- [ ] EXPIRED is supported.
- [ ] REJECTED is supported.
- [ ] FAILED is supported.
- [ ] Invalid transitions are rejected.
- [ ] State changes are recorded.
- [ ] Terminal states cannot silently return to active states.

### 6.3 Time slots

- [ ] Time-slot table exists.
- [ ] Slot references booking.
- [ ] Slot type is constrained.
- [ ] Slot start/end are validated.
- [ ] Slot range is generated or consistently represented.
- [ ] Setup slot is distinguishable.
- [ ] Execution slot is distinguishable.
- [ ] Teardown slot is distinguishable.
- [ ] Maintenance buffer is distinguishable.
- [ ] Slot cancellation/release state is represented.

### 6.4 Resource allocations

- [ ] Allocation table exists.
- [ ] Allocation references booking.
- [ ] Allocation references resource.
- [ ] Robot reference is supported where required.
- [ ] Slot reference is supported.
- [ ] Allocation type is constrained.
- [ ] Allocation status is constrained.
- [ ] Allocation time range is validated.
- [ ] Active allocation overlap is prevented.
- [ ] Released allocations no longer block future bookings.
- [ ] Cancelled allocations no longer block future bookings.
- [ ] Historical allocations remain queryable.

### 6.5 Exclusion constraint

The database shall implement a PostgreSQL range exclusion constraint equivalent to:

    ALTER TABLE booking.resource_allocations
    ADD CONSTRAINT allocations_resource_no_overlap
    EXCLUDE USING GIST (
        resource_id WITH =,
        allocation_range WITH &&
    )
    WHERE (
        status IN (
            'HELD',
            'CONFIRMED',
            'ACTIVE'
        )
    );

The implementation shall verify:

- [ ] concurrent overlapping allocation is rejected;
- [ ] non-overlapping allocation succeeds;
- [ ] different resources can overlap;
- [ ] released allocation no longer blocks;
- [ ] cancelled allocation no longer blocks;
- [ ] exclusion constraint remains authoritative under concurrency.

### 6.6 Availability

- [ ] Resource state is considered.
- [ ] Lab state is considered.
- [ ] Maintenance is considered.
- [ ] Availability windows are considered.
- [ ] Existing active allocations are considered.
- [ ] Platform eligibility is considered.
- [ ] Availability queries are indexed.
- [ ] Availability results are treated as potentially stale until booking transaction.
- [ ] Booking confirmation revalidates authoritative availability.

### 6.7 Booking state history

- [ ] State-history table exists.
- [ ] From-state is recorded.
- [ ] To-state is recorded.
- [ ] Reason is recorded.
- [ ] Actor type is recorded.
- [ ] Actor ID is recorded where available.
- [ ] Timestamp is recorded.
- [ ] State history is append-oriented.
- [ ] History cannot be silently rewritten by normal users.

### 6.8 Cancellation

- [ ] Cancellation table exists.
- [ ] Cancellation type is constrained.
- [ ] Customer cancellation is distinguishable.
- [ ] Admin cancellation is distinguishable.
- [ ] System cancellation is distinguishable.
- [ ] Lab cancellation is distinguishable.
- [ ] Robot fault cancellation is distinguishable.
- [ ] Refund policy result is recorded.
- [ ] Refund amount is recorded where applicable.
- [ ] Cancellation actor is recorded.
- [ ] Cancellation is idempotent.

### 6.9 Credit types

- [ ] Credit type table exists.
- [ ] Credit type has stable ID.
- [ ] Credit type references platform.
- [ ] Credit type key is unique.
- [ ] Credit type lifecycle is represented.
- [ ] Credits are not implicitly transferable across platforms.
- [ ] Historical credit types remain referenceable.

### 6.10 Credit plans

- [ ] Credit plan table exists.
- [ ] Student plan can be represented.
- [ ] Developer plan can be represented.
- [ ] Research plan can be represented.
- [ ] Plan lifecycle is represented.
- [ ] Plan eligibility is representable.
- [ ] Plan is separate from credit type.
- [ ] Plan does not directly imply a platform credit type.

### 6.11 Rate cards

- [ ] Rate-card table exists.
- [ ] Rate references platform/credit type.
- [ ] Configuration-specific rates are supported.
- [ ] Resource-type-specific rates are supported.
- [ ] Plan-specific rates are supported where required.
- [ ] Effective start/end are represented.
- [ ] Overlapping effective rates are prevented or explicitly resolved.
- [ ] Minimum duration is represented.
- [ ] Maximum duration is represented.
- [ ] Rate precision is sufficient.
- [ ] Historical rates remain queryable.
- [ ] Rate changes do not mutate historical bookings.

### 6.12 Quotes

- [ ] Quote calculation is non-mutating.
- [ ] Quote references rate-card version.
- [ ] Quote includes duration.
- [ ] Quote includes rate.
- [ ] Quote includes required credits.
- [ ] Quote identifies credit type.
- [ ] Quote expiration can be represented.
- [ ] Final booking transaction revalidates rate and balance.

### 6.13 Wallets

- [ ] Wallet table exists.
- [ ] Wallet is unique by organization and credit type.
- [ ] Current available balance is represented.
- [ ] Reserved balance is represented where required.
- [ ] Wallet cannot become negative unless explicitly supported by policy.
- [ ] Wallet updates are transactional.
- [ ] Wallet changes correspond to ledger operations.
- [ ] Wallet is not treated as immutable financial evidence.

### 6.14 Ledger

- [ ] Ledger transaction table exists.
- [ ] Ledger entries exist.
- [ ] Ledger transactions have stable IDs.
- [ ] Ledger entries reference transaction.
- [ ] Ledger entries reference wallet/account.
- [ ] Debit/credit direction is explicit.
- [ ] Amount precision is sufficient.
- [ ] Currency/unit is explicit where applicable.
- [ ] Every completed transaction balances.
- [ ] Ledger entries are append-only.
- [ ] Historical ledger entries cannot be updated by normal application roles.
- [ ] Ledger deletion is prohibited or tightly controlled.
- [ ] Ledger transaction references booking/reservation where applicable.

### 6.15 Ledger integrity

Every completed financial transaction shall satisfy:

    Total Credits = Total Debits

The implementation shall verify:

- [ ] incomplete transactions cannot affect available balance;
- [ ] balanced transactions affect balance atomically;
- [ ] unbalanced transactions cannot become POSTED;
- [ ] duplicate transaction posting is prevented;
- [ ] ledger entries cannot be silently changed.

### 6.16 Reservations

- [ ] Credit reservation table exists.
- [ ] Reservation references organization.
- [ ] Reservation references wallet.
- [ ] Reservation references booking.
- [ ] Reserved amount is positive.
- [ ] Reservation lifecycle is constrained.
- [ ] Reservation expiration is represented.
- [ ] Reservation is idempotent.
- [ ] Reservation cannot exceed available credit.
- [ ] Release is atomic.
- [ ] Consumption is atomic.

### 6.17 Consumption

- [ ] Consumption table exists.
- [ ] Consumption references reservation.
- [ ] Consumption references booking.
- [ ] Consumption amount is positive.
- [ ] Consumption cannot exceed reserved amount unless explicitly authorized.
- [ ] Consumption is idempotent.
- [ ] Consumption produces ledger evidence.
- [ ] Consumption updates wallet atomically.

### 6.18 Refunds

- [ ] Refund table exists.
- [ ] Refund references source reservation/consumption.
- [ ] Refund amount is constrained.
- [ ] Refund cannot exceed refundable amount.
- [ ] Refund policy is recorded.
- [ ] Refund is idempotent.
- [ ] Refund produces ledger evidence.
- [ ] Refund updates wallet atomically.

### 6.19 Invoices

- [ ] Invoice table exists.
- [ ] Invoice belongs to organization.
- [ ] Invoice number is unique.
- [ ] Invoice lifecycle is represented.
- [ ] Invoice date is represented.
- [ ] Due date is represented where applicable.
- [ ] Currency is represented.
- [ ] Total/subtotal/tax/discount values are represented.
- [ ] Invoice state transitions are constrained.
- [ ] Historical invoices remain immutable after finalization.

### 6.20 Invoice lines

- [ ] Invoice line table exists.
- [ ] Line references invoice.
- [ ] Booking reference is supported.
- [ ] Platform reference is supported.
- [ ] Quantity is represented.
- [ ] Unit rate is represented.
- [ ] Line total is represented.
- [ ] Discounts/taxes can be represented.
- [ ] Line amounts reconcile to invoice totals.

### 6.21 Payments

- [ ] Payment metadata exists.
- [ ] Provider is represented abstractly.
- [ ] Provider transaction identifier is stored.
- [ ] Payment state is represented.
- [ ] Callback/idempotency reference is supported.
- [ ] Payment records are auditable.
- [ ] Payment credentials are never stored.

### 6.22 Reconciliation

- [ ] Reconciliation record exists.
- [ ] Reconciliation scope is represented.
- [ ] Run timestamp is represented.
- [ ] Difference type is represented.
- [ ] Difference amount is represented.
- [ ] Resolution status is represented.
- [ ] Reconciliation does not silently mutate financial history.
- [ ] Reconciliation failures are visible.

### 6.23 Tenant isolation

- [ ] Booking data is tenant isolated.
- [ ] Wallets are tenant isolated.
- [ ] Reservations are tenant isolated.
- [ ] Ledger access is tenant controlled.
- [ ] Invoices are tenant isolated.
- [ ] Payment metadata is tenant isolated.
- [ ] Cross-organization financial access fails.
- [ ] Platform catalog remains global as designed.

### 6.24 Indexes

- [ ] Resource allocation timeline is indexed.
- [ ] Booking status is indexed.
- [ ] Organization booking lookup is indexed.
- [ ] Wallet lookup is indexed.
- [ ] Reservation lookup is indexed.
- [ ] Ledger lookup is indexed.
- [ ] Invoice lookup is indexed.
- [ ] Reconciliation lookup is indexed.
- [ ] Retention/expiration processing is indexed.

### 6.25 No-go conditions

DB-M03 shall not be accepted if:

- [ ] overlapping active resource allocations are possible;
- [ ] credit balance can become inconsistent with ledger;
- [ ] ledger transactions can be unbalanced;
- [ ] duplicate reservation can consume credits twice;
- [ ] duplicate payment callback can create duplicate financial effects;
- [ ] cross-tenant financial data is accessible;
- [ ] historical rates can be silently changed;
- [ ] cancelled bookings continue blocking resources incorrectly;
- [ ] invoice totals cannot be reconciled;
- [ ] financial operations are not idempotent.

---
