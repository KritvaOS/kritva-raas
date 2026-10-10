# F-M04-BOOKING — Tasks

Milestone: F-M04 — Booking
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-2-034 | Define catalog information architecture | 1.5d | UX/UI | F-M02 | [ ] |
| KR-FE-2-035 | Define platform catalog API contract | 2.0d | Architect/Backend | PLATFORMS | [ ] |
| KR-FE-2-036 | Implement platform catalog client | 2.0d | Frontend | 035 | [ ] |
| KR-FE-2-037 | Implement platform catalog screen | 2.5d | Frontend | 036 | [ ] |
| KR-FE-2-038 | Implement platform detail screen | 2.0d | Frontend | 036 | [ ] |
| KR-FE-2-039 | Implement version/configuration selector | 2.0d | Frontend | 038 | [ ] |
| KR-FE-2-040 | Implement capability display/filtering | 1.5d | Frontend | 038 | [ ] |
| KR-FE-2-041 | Define availability API contract | 2.0d | Architect/Backend | BOOKINGS | [ ] |
| KR-FE-2-042 | Implement availability client | 2.0d | Frontend | 041 | [ ] |
| KR-FE-2-043 | Implement availability calendar | 3.0d | Frontend | 042 | [ ] |
| KR-FE-2-044 | Implement availability refresh/revalidation | 2.0d | Frontend/Backend | 042 | [ ] |
| KR-FE-2-045 | Implement resource status presentation | 1.5d | Frontend | 043 | [ ] |
| KR-FE-2-046 | Define credit domain API contracts | 2.0d | Architect/Backend | CREDIT | [ ] |
| KR-FE-2-047 | Implement wallet API client | 2.0d | Frontend | 046 | [ ] |
| KR-FE-2-048 | Implement wallet screen | 2.0d | Frontend | 047 | [ ] |
| KR-FE-2-049 | Implement credit quote API | 2.5d | Backend | 046 | [ ] |
| KR-FE-2-050 | Implement credit quote UI | 2.0d | Frontend | 049 | [ ] |
| KR-FE-2-051 | Implement booking creation API | 3.0d | Backend | 041,049 | [ ] |
| KR-FE-2-052 | Implement booking confirmation flow | 2.5d | Frontend | 050,051 | [ ] |
| KR-FE-2-053 | Implement booking idempotency | 2.0d | Backend | 051 | [ ] |
| KR-FE-2-054 | Implement resource allocation transaction | 3.0d | Backend | 051 | [ ] |
| KR-FE-2-055 | Implement booking list | 2.0d | Frontend | 051 | [ ] |
| KR-FE-2-056 | Implement booking detail | 2.0d | Frontend | 055 | [ ] |
| KR-FE-2-057 | Implement booking cancellation | 2.5d | Backend/Frontend | 056 | [ ] |
| KR-FE-2-058 | Implement cancellation policy display | 1.5d | Frontend | 057 | [ ] |
| KR-FE-2-059 | Implement credit reservation visibility | 2.0d | Frontend | 050,052 | [ ] |
| KR-FE-2-060 | Implement credit ledger/history UI | 2.5d | Frontend | 047 | [ ] |
| KR-FE-2-061 | Implement billing history API | 2.0d | Backend | BILLING | [ ] |
| KR-FE-2-062 | Implement billing history UI | 2.0d | Frontend | 061 | [ ] |
| KR-FE-2-063 | Add booking unit/component tests | 2.5d | QA | 051-058 | [ ] |
| KR-FE-2-064 | Add availability integration tests | 2.5d | QA | 041-045 | [ ] |
| KR-FE-2-065 | Add credit consistency tests | 3.0d | QA/Finance | 046-060 | [ ] |
| KR-FE-2-066 | Add tenant isolation tests | 2.0d | Security/QA | 051-062 | [ ] |
| KR-FE-2-067 | Add booking conflict tests | 2.0d | QA/Backend | 054 | [ ] |
| KR-FE-2-068 | Add E2E booking flow | 3.0d | QA | 037-062 | [ ] |
| KR-FE-2-069 | Add cancellation/refund E2E | 2.0d | QA | 057-060 | [ ] |
| KR-FE-2-070 | Add billing visibility tests | 1.5d | QA | 061-062 | [ ] |
| KR-FE-2-071 | Update CI and test fixtures | 1.5d | DevOps/QA | 063-070 | [ ] |
| KR-FE-2-072 | Complete UI/security review | 2.0d | Architect/Security | All | [ ] |
| KR-FE-2-073 | Complete milestone documentation | 1.5d | Documentation | All | [ ] |
| KR-FE-2-074 | Milestone acceptance and evidence | 1.0d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Platform Catalog Interface

Conceptual API operations:

    listPlatforms(filters)
    getPlatform(platformId)
    listPlatformVersions(platformId)
    listArchitectures(platformVersionId)
    listCapabilities(platformVersionId)
    listConfigurations(platformVersionId)

The response must identify whether the platform/version/configuration is
currently eligible for booking.

## 5.3 Availability Interface

Conceptual operation:

    getAvailability({
        platformId,
        platformVersionId,
        configurationId,
        startAt,
        endAt,
        timezone
    })

Response:

    {
        "platform_id": "platform-001",
        "configuration_id": "config-001",
        "requested_window": {
            "start_at": "...",
            "end_at": "..."
        },
        "slots": [],
        "generated_at": "..."
    }

Availability is advisory until booking confirmation.

## 5.4 Credit Quote Interface

Conceptual operation:

    quoteBooking({
        projectId,
        platformId,
        platformVersionId,
        configurationId,
        startAt,
        endAt
    })

Response:

    {
        "quote_id": "quote-001",
        "platform_id": "platform-001",
        "credit_type": "platform-001",
        "duration_seconds": 1800,
        "rate": 15,
        "required_credits": 450,
        "wallet_balance": 700,
        "available_after_reservation": 250,
        "expires_at": "..."
    }

The quote must have an expiration time.

Expired quotes must be re-quoted.

## 5.5 Booking Interface

Conceptual operation:

    createBooking({
        projectId,
        platformId,
        platformVersionId,
        configurationId,
        requestedStartAt,
        requestedEndAt,
        timezone,
        quoteId,
        idempotencyKey
    })

The server must atomically validate:

- authorization;
- project ownership;
- platform eligibility;
- resource availability;
- quote validity;
- credit availability;
- policy;
- allocation conflict.

## 5.6 Booking Confirmation Transaction

Conceptual transaction:

    BEGIN

      validate organization/project

      validate platform/version/configuration

      validate quote

      select eligible resource
          with required locking/concurrency control

      verify no conflicting allocation

      reserve credits

      create booking

      create time slots

      create resource allocation

      create booking state history

      commit

    END

The transaction must not rely on the client-side availability result.

## 5.7 Resource Allocation

The booking system uses resource allocation records.

The database exclusion constraint remains authoritative for overlapping active
allocations.

The UI must surface a conflict rather than attempting to resolve one locally.

## 5.8 Booking Detail Interface

Booking detail should expose:

- booking ID;
- status;
- project;
- platform;
- version;
- configuration;
- resource;
- lab where permitted;
- requested time;
- confirmed time;
- duration;
- credit reservation;
- cancellation policy;
- state history;
- creation timestamp.

## 5.9 Cancellation Interface

Conceptual operation:

    cancelBooking({
        bookingId,
        reason,
        idempotencyKey
    })

Response should include:

- final booking state;
- cancellation policy result;
- credits released;
- credits refunded;
- monetary refund status if applicable;
- effective time.

## 5.10 Wallet Interface

Conceptual operations:

    getWallets()
    getWallet(walletId)
    getWalletLedger(walletId, filters)

Wallet responses must include:

- platform;
- credit type;
- available;
- reserved;
- ledger timestamp.

## 5.11 Billing Interface

Conceptual operations:

    listInvoices(filters)
    getInvoice(invoiceId)
    listPaymentTransactions(filters)

Billing information must be restricted to authorized organization members.

---
