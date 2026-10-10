# F-M04-BOOKING — Acceptance Criteria

Milestone: F-M04 — Booking

# 6. Acceptance Criteria

## 6.1 Platform Catalog

- [ ] Platform catalog loads from authoritative API.
- [ ] Platform name is shown.
- [ ] Platform type is shown.
- [ ] Platform version is shown.
- [ ] Architecture is shown.
- [ ] KritvaOS compatibility is shown.
- [ ] SDK compatibility is shown.
- [ ] Capabilities are shown.
- [ ] Configurations are shown.
- [ ] Inactive platforms are handled correctly.
- [ ] Deprecated versions are clearly identified.
- [ ] Retired platforms cannot be booked.
- [ ] Catalog loading errors are actionable.
- [ ] Empty catalog state is supported.
- [ ] Unauthorized catalog access is rejected.

## 6.2 Platform Selection

- [ ] User can select a platform.
- [ ] User can select a compatible version.
- [ ] User can select a configuration.
- [ ] Invalid version/configuration combinations are rejected.
- [ ] Changing platform clears incompatible dependent selections.
- [ ] Platform capability requirements are visible.
- [ ] Project/platform binding is respected.
- [ ] Backend validates all selections.

## 6.3 Availability

- [ ] Availability can be requested.
- [ ] Requested timezone is explicit.
- [ ] Available slots are displayed.
- [ ] Unavailable slots are visually distinct.
- [ ] Maintenance periods are represented.
- [ ] Resource state is represented where appropriate.
- [ ] Existing booking conflicts are represented.
- [ ] Availability timestamp is visible where useful.
- [ ] Availability can be refreshed.
- [ ] Stale availability is revalidated before booking.
- [ ] Client does not claim final availability.
- [ ] Resource allocation is server-authoritative.

## 6.4 Credit Wallet

- [ ] Platform-specific wallet is displayed.
- [ ] Credit type is displayed.
- [ ] Available balance is displayed.
- [ ] Reserved balance is displayed.
- [ ] Wallet timestamp is available.
- [ ] Wallet is scoped to the organization.
- [ ] User cannot access another organization's wallet.
- [ ] Wallet loading errors are handled.
- [ ] Zero balance is handled clearly.
- [ ] Insufficient balance is actionable.

## 6.5 Credit Quote

- [ ] Quote can be requested.
- [ ] Quote identifies platform.
- [ ] Quote identifies configuration.
- [ ] Quote identifies duration.
- [ ] Quote identifies rate.
- [ ] Quote identifies required credits.
- [ ] Quote identifies wallet balance.
- [ ] Quote identifies post-reservation balance.
- [ ] Quote expiration is visible.
- [ ] Expired quote cannot confirm booking.
- [ ] Client calculations are not authoritative.
- [ ] Rate is server-provided.
- [ ] Rate changes cannot silently alter a confirmed booking.

## 6.6 Booking Creation

- [ ] User can initiate booking.
- [ ] Project is identified.
- [ ] Platform is identified.
- [ ] Version is identified.
- [ ] Configuration is identified.
- [ ] Start time is explicit.
- [ ] End time is explicit.
- [ ] Timezone is explicit.
- [ ] Duration is visible.
- [ ] Credit quote is visible.
- [ ] Cancellation policy is visible.
- [ ] User explicitly confirms.
- [ ] Booking request has an idempotency key.
- [ ] Server revalidates availability.
- [ ] Server revalidates credits.
- [ ] Server creates booking atomically.
- [ ] Resource allocation is created.
- [ ] Credit reservation is created.
- [ ] State history is recorded.
- [ ] Confirmation is returned only after successful transaction.

## 6.7 Booking Conflicts

- [ ] Two simultaneous booking attempts cannot allocate the same resource.
- [ ] Database overlap protection is active.
- [ ] Conflict produces a clear response.
- [ ] Failed booking does not consume credits.
- [ ] Failed booking does not leave a confirmed allocation.
- [ ] Retry is safe.
- [ ] Stale UI availability cannot cause incorrect confirmation.

## 6.8 Booking Management

- [ ] User can list bookings.
- [ ] Upcoming bookings are visible.
- [ ] Active bookings are visible.
- [ ] Historical bookings are visible.
- [ ] Booking status is explicit.
- [ ] Booking detail is accessible.
- [ ] Resource assignment is shown where authorized.
- [ ] Credit reservation is shown.
- [ ] Booking state history is available where appropriate.
- [ ] Tenant filtering is enforced.

## 6.9 Cancellation

- [ ] Eligible booking can be cancelled.
- [ ] Ineligible booking cannot be cancelled.
- [ ] Cancellation policy is shown before confirmation.
- [ ] Cancellation requires explicit confirmation.
- [ ] Cancellation is idempotent.
- [ ] Booking becomes CANCELLED when successful.
- [ ] Allocation is released.
- [ ] Credit reservation is released/refunded according to policy.
- [ ] Refund status is visible.
- [ ] Cancellation reason is recorded.
- [ ] Cancellation state history is recorded.

## 6.10 Credit Ledger

- [ ] Credit transactions can be viewed.
- [ ] Transaction date is shown.
- [ ] Platform/credit type is shown.
- [ ] Amount is shown.
- [ ] Transaction type is shown.
- [ ] Reference is shown.
- [ ] Reservation is distinguishable from consumption.
- [ ] Refund is distinguishable from release.
- [ ] Ledger is not editable through UI.
- [ ] Financial records are server-authoritative.

## 6.11 Billing History

- [ ] Billing history loads.
- [ ] Invoice identity is shown.
- [ ] Invoice date is shown.
- [ ] Status is shown.
- [ ] Amount is shown.
- [ ] Currency is shown.
- [ ] Payment status is shown.
- [ ] Payment reference is shown where permitted.
- [ ] Invoice download works where supported.
- [ ] Billing records are tenant-isolated.
- [ ] Credits are not incorrectly displayed as monetary payments.

## 6.12 Security and Authorization

- [ ] Authentication is required.
- [ ] Organization membership is checked.
- [ ] Project membership is checked.
- [ ] Wallet access is authorized.
- [ ] Booking access is authorized.
- [ ] Billing access is authorized.
- [ ] Cross-tenant resource access is rejected.
- [ ] Cross-tenant booking access is rejected.
- [ ] Cross-tenant wallet access is rejected.
- [ ] Cross-tenant billing access is rejected.
- [ ] UI hiding is not relied upon for authorization.

## 6.13 UI Quality

- [ ] Loading states exist.
- [ ] Empty states exist.
- [ ] Error states exist.
- [ ] Conflict states exist.
- [ ] Expired quote state exists.
- [ ] Insufficient credits state exists.
- [ ] Booking confirmation is unambiguous.
- [ ] Cancellation consequences are visible.
- [ ] Keyboard navigation works.
- [ ] Light theme works.
- [ ] Dark theme works.
- [ ] Responsive layouts work within supported Studio sizes.

---
