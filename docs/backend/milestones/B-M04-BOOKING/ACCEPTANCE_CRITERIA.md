# B-M04-BOOKING — Acceptance Criteria

Milestone: B-M04 — Booking

# 6 Acceptance Criteria

## 6.1 Availability

- [ ] Availability API exists.
- [ ] Availability is resource-aware.
- [ ] Availability considers lab state.
- [ ] Availability considers resource state.
- [ ] Availability considers maintenance.
- [ ] Availability considers availability windows.
- [ ] Availability considers existing allocations.
- [ ] Availability considers platform eligibility.
- [ ] Availability considers requested duration.
- [ ] Availability is timezone-aware.
- [ ] Availability clearly distinguishes tentative from confirmed state.
- [ ] Stale availability cannot be presented as confirmed booking.
- [ ] Availability queries are tenant-authorized.

## 6.2 Booking Creation

- [ ] Booking can be created.
- [ ] Booking belongs to an Organization.
- [ ] Booking references a Project.
- [ ] Booking references a Platform.
- [ ] Booking references Platform Version where required.
- [ ] Booking references configuration where required.
- [ ] Booking duration is validated.
- [ ] Requested start/end are validated.
- [ ] Timezone is recorded.
- [ ] Booking has stable identity.
- [ ] Booking has idempotency support.
- [ ] Booking actor is recorded.

## 6.3 Booking State Machine

- [ ] State transitions are explicit.
- [ ] Invalid transitions are rejected.
- [ ] State history is recorded.
- [ ] CONFIRMED requires required allocation.
- [ ] CONFIRMED requires required credit reservation.
- [ ] CANCELLED is terminal unless explicit policy allows otherwise.
- [ ] COMPLETED is terminal.
- [ ] REJECTED is terminal.
- [ ] FAILED is represented.
- [ ] EXPIRED is represented.
- [ ] ACTIVE transition is controlled.
- [ ] State changes are auditable.

## 6.4 Resource Allocation

- [ ] Allocation is linked to Booking.
- [ ] Allocation is linked to Resource.
- [ ] Allocation has time range.
- [ ] Allocation status is explicit.
- [ ] Resource conflicts are prevented.
- [ ] PostgreSQL conflict protection exists.
- [ ] Concurrent booking attempts are tested.
- [ ] Allocation release is supported.
- [ ] Historical allocation remains traceable.

## 6.5 Time Slots

- [ ] SETUP is supported.
- [ ] EXECUTION is supported.
- [ ] TEARDOWN is supported.
- [ ] MAINTENANCE_BUFFER is supported.
- [ ] Slot ranges are validated.
- [ ] Slot status is explicit.
- [ ] Slot cancellation is supported.
- [ ] Slot relationships are auditable.

## 6.6 Credit Types

- [ ] Credit types exist.
- [ ] Credit type is platform-specific.
- [ ] Credit type identity is stable.
- [ ] Credit types cannot be silently interchanged.
- [ ] Credit type lifecycle is explicit.
- [ ] Platform relationship is explicit.

## 6.7 Credit Plans

- [ ] Credit plans exist.
- [ ] Student/Developer/Research plans can be represented.
- [ ] Plan eligibility is explicit.
- [ ] Included credits can be represented.
- [ ] Plan validity can be represented.
- [ ] Plan status is explicit.
- [ ] Plan changes are auditable.

## 6.8 Rate Cards

- [ ] Rate cards exist.
- [ ] Rate cards reference Platform/Credit Type.
- [ ] Configuration can influence rate.
- [ ] Resource type can influence rate.
- [ ] Duration can influence rate.
- [ ] Effective start is recorded.
- [ ] Effective end is recorded where applicable.
- [ ] Rate-card version is identifiable.
- [ ] Historical bookings retain their applied rate.
- [ ] Rate changes do not retroactively change completed bookings.

## 6.9 Quote

- [ ] Quote API exists.
- [ ] Quote identifies credit type.
- [ ] Quote identifies rate.
- [ ] Quote identifies duration.
- [ ] Quote identifies configuration.
- [ ] Quote identifies rate-card version.
- [ ] Quote is not treated as reservation.
- [ ] Quote does not mutate wallet state.
- [ ] Quote is reproducible under the same policy inputs.

## 6.10 Wallet

- [ ] Wallet exists.
- [ ] Wallet belongs to Organization.
- [ ] Wallet belongs to Credit Type.
- [ ] Wallet has available balance.
- [ ] Wallet has reserved balance.
- [ ] Wallet has consumed/issued accounting as required.
- [ ] Wallet updates are transactionally controlled.
- [ ] Wallet cannot become negative except explicit controlled states.
- [ ] Wallet is not treated as the sole financial evidence.

## 6.11 Ledger

- [ ] Ledger transaction exists.
- [ ] Ledger entries exist.
- [ ] Ledger is append-oriented.
- [ ] Each transaction is balanced.
- [ ] Debit/credit semantics are explicit.
- [ ] Booking references can be recorded.
- [ ] Payment references can be recorded.
- [ ] Refund references can be recorded.
- [ ] Ledger entries are immutable.
- [ ] Corrections use compensating transactions.
- [ ] Ledger is auditable.

## 6.12 Credit Reservation

- [ ] Reservation can be created.
- [ ] Reservation references Booking.
- [ ] Reservation references Wallet.
- [ ] Reservation amount is explicit.
- [ ] Reservation state is explicit.
- [ ] Reservation reduces available credit.
- [ ] Reservation does not immediately imply consumption.
- [ ] Reservation can be released.
- [ ] Reservation can be consumed.
- [ ] Reservation can expire according to policy.
- [ ] Duplicate reservation requests are idempotent.

## 6.13 Consumption

- [ ] Consumption policy is documented.
- [ ] Consumption references Booking.
- [ ] Consumption references Reservation.
- [ ] Consumption is ledger-backed.
- [ ] Consumption cannot exceed policy limits.
- [ ] Consumption is idempotent.
- [ ] Consumption preserves historical rate information.
- [ ] Failed execution handling is explicit.

## 6.14 Cancellation and Refunds

- [ ] Cancellation API exists.
- [ ] Cancellation policy is explicit.
- [ ] Cancellation actor is recorded.
- [ ] Cancellation reason is recorded.
- [ ] Refund eligibility is calculated server-side.
- [ ] Reservation release is performed where applicable.
- [ ] Credit refund is ledger-backed.
- [ ] Monetary refund is payment-backed.
- [ ] Partial refund is supported where policy requires.
- [ ] No-refund outcome is explicit.
- [ ] Cancellation is auditable.

## 6.15 Billing

- [ ] Invoice model exists.
- [ ] Invoice lines exist.
- [ ] Booking references can be included.
- [ ] Credit references can be included.
- [ ] Payment references can be included.
- [ ] Adjustments can be represented.
- [ ] Invoice state is explicit.
- [ ] Invoice records are immutable after finalization except controlled
  correction workflows.
- [ ] Billing history is tenant-scoped.

## 6.16 Payments

- [ ] Payment abstraction exists.
- [ ] Provider identity is separated from business identity.
- [ ] Payment lifecycle is explicit.
- [ ] Provider callbacks are authenticated.
- [ ] Provider callbacks are idempotent.
- [ ] Duplicate callbacks do not duplicate credits.
- [ ] Failed payment does not grant credits.
- [ ] Successful payment can trigger authorized credit issuance.
- [ ] Refund state is represented.
- [ ] Payment events are audited.

## 6.17 Reconciliation

- [ ] Booking reconciliation exists.
- [ ] Credit reconciliation exists.
- [ ] Payment reconciliation exists.
- [ ] Wallet can be reconciled against ledger.
- [ ] Payment state can be reconciled against provider evidence.
- [ ] Booking allocations can be reconciled.
- [ ] Reconciliation discrepancies are recorded.
- [ ] Reconciliation never silently edits financial history.

## 6.18 Security and Authorization

- [ ] Cross-tenant booking access is denied.
- [ ] Cross-tenant wallet access is denied.
- [ ] Cross-tenant ledger access is denied.
- [ ] Cross-tenant invoice access is denied.
- [ ] Credit administration requires elevated permissions.
- [ ] Refund administration requires elevated permissions.
- [ ] Payment administration is restricted.
- [ ] Booking cancellation follows authorization.
- [ ] All sensitive financial operations are audited.

## 6.19 Concurrency and Idempotency

- [ ] Concurrent booking conflict is prevented.
- [ ] Concurrent credit reservation is serialized correctly.
- [ ] Wallet cannot be overspent.
- [ ] Duplicate booking request is idempotent.
- [ ] Duplicate reservation request is idempotent.
- [ ] Duplicate payment callback is idempotent.
- [ ] Duplicate refund request is idempotent.
- [ ] State transitions are concurrency-safe.

---
