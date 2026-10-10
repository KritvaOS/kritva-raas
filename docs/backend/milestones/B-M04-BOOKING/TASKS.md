# B-M04-BOOKING — Tasks

Milestone: B-M04 — Booking
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5 Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-4-001 | Define Booking domain model | 2d | Architect/Backend | B-M03 | [ ] |
| KR-BE-4-002 | Define Booking state machine | 1.5d | Architect | 001 | [ ] |
| KR-BE-4-003 | Define availability model | 2d | Architect/Backend | B-M03 | [ ] |
| KR-BE-4-004 | Define time-slot model | 1.5d | Backend | 001 | [ ] |
| KR-BE-4-005 | Define allocation model | 1.5d | Backend | 001,004 | [ ] |
| KR-BE-4-006 | Implement BookingRepository | 2.5d | Backend/Database | 001 | [ ] |
| KR-BE-4-007 | Implement TimeSlotRepository | 2d | Backend/Database | 004 | [ ] |
| KR-BE-4-008 | Implement ResourceAllocationRepository | 2.5d | Backend/Database | 005 | [ ] |
| KR-BE-4-009 | Implement BookingService | 3d | Backend | 006-008 | [ ] |
| KR-BE-4-010 | Implement AvailabilityService | 3d | Backend | 003 | [ ] |
| KR-BE-4-011 | Implement conflict protection | 2d | Database | 005 | [ ] |
| KR-BE-4-012 | Implement BookingStateHistory | 1.5d | Backend | 002 | [ ] |
| KR-BE-4-013 | Implement CancellationService | 2.5d | Backend | 009 | [ ] |
| KR-BE-4-014 | Implement BookingPolicyService | 2d | Backend/Product | 002,013 | [ ] |
| KR-BE-4-015 | Define CreditType model | 1.5d | Architect/Backend | B-M03 | [ ] |
| KR-BE-4-016 | Define CreditPlan model | 1.5d | Backend/Product | 015 | [ ] |
| KR-BE-4-017 | Define RateCard model | 2d | Backend/Product | 015,016 | [ ] |
| KR-BE-4-018 | Implement CreditTypeRepository | 1.5d | Backend/Database | 015 | [ ] |
| KR-BE-4-019 | Implement CreditPlanRepository | 2d | Backend/Database | 016 | [ ] |
| KR-BE-4-020 | Implement RateCardRepository | 2d | Backend/Database | 017 | [ ] |
| KR-BE-4-021 | Implement CreditQuoteService | 2.5d | Backend | 020 | [ ] |
| KR-BE-4-022 | Define Wallet model | 1.5d | Architect/Database | 015 | [ ] |
| KR-BE-4-023 | Implement WalletRepository | 2d | Backend/Database | 022 | [ ] |
| KR-BE-4-024 | Define LedgerTransaction model | 2d | Architect/Database | 022 | [ ] |
| KR-BE-4-025 | Define LedgerEntry model | 2d | Database | 024 | [ ] |
| KR-BE-4-026 | Implement LedgerRepository | 3d | Backend/Database | 024,025 | [ ] |
| KR-BE-4-027 | Implement LedgerService | 3d | Backend | 026 | [ ] |
| KR-BE-4-028 | Define CreditReservation model | 2d | Architect/Backend | 022,024 | [ ] |
| KR-BE-4-029 | Implement CreditReservationRepository | 2d | Backend/Database | 028 | [ ] |
| KR-BE-4-030 | Implement CreditReservationService | 3d | Backend | 027,029 | [ ] |
| KR-BE-4-031 | Implement CreditConsumptionService | 2.5d | Backend | 030 | [ ] |
| KR-BE-4-032 | Implement CreditReleaseService | 2d | Backend | 030 | [ ] |
| KR-BE-4-033 | Define Refund model | 1.5d | Backend/Product | 013,030 | [ ] |
| KR-BE-4-034 | Implement RefundService | 2.5d | Backend | 033 | [ ] |
| KR-BE-4-035 | Define Invoice model | 2d | Backend/Finance | 017,033 | [ ] |
| KR-BE-4-036 | Implement InvoiceRepository | 2d | Backend/Database | 035 | [ ] |
| KR-BE-4-037 | Implement InvoiceService | 2.5d | Backend/Finance | 036 | [ ] |
| KR-BE-4-038 | Define Payment abstraction | 2d | Architect/Backend | B-M01 | [ ] |
| KR-BE-4-039 | Implement PaymentRepository | 2d | Backend/Database | 038 | [ ] |
| KR-BE-4-040 | Implement PaymentService | 3d | Backend/Finance | 038,039 | [ ] |
| KR-BE-4-041 | Implement provider webhook verification | 2.5d | Security/Backend | 040 | [ ] |
| KR-BE-4-042 | Implement Booking API | 3d | Backend | 009,010 | [ ] |
| KR-BE-4-043 | Implement Availability API | 2d | Backend | 010 | [ ] |
| KR-BE-4-044 | Implement Quote API | 2d | Backend | 021 | [ ] |
| KR-BE-4-045 | Implement Wallet API | 2d | Backend | 023 | [ ] |
| KR-BE-4-046 | Implement Ledger API | 2d | Backend | 027 | [ ] |
| KR-BE-4-047 | Implement Billing API | 2.5d | Backend | 037,040 | [ ] |
| KR-BE-4-048 | Implement Cancellation API | 2d | Backend | 013 | [ ] |
| KR-BE-4-049 | Implement Booking audit events | 2d | Backend/Security | 009,013 | [ ] |
| KR-BE-4-050 | Implement Credit audit events | 2d | Backend/Security | 027,030,034 | [ ] |
| KR-BE-4-051 | Implement payment audit events | 1.5d | Finance/Security | 040 | [ ] |
| KR-BE-4-052 | Implement booking idempotency | 2d | Backend | 009 | [ ] |
| KR-BE-4-053 | Implement credit idempotency | 2d | Backend | 030 | [ ] |
| KR-BE-4-054 | Implement payment idempotency | 2d | Backend/Finance | 040 | [ ] |
| KR-BE-4-055 | Implement booking reconciliation | 2.5d | Backend | 009,030 | [ ] |
| KR-BE-4-056 | Implement credit reconciliation | 3d | Backend/Finance | 027,030 | [ ] |
| KR-BE-4-057 | Implement payment reconciliation | 2.5d | Finance/Backend | 040 | [ ] |
| KR-BE-4-058 | Add booking unit/repository tests | 3d | QA | 006-014 | [ ] |
| KR-BE-4-059 | Add credit unit/repository tests | 3d | QA | 018-032 | [ ] |
| KR-BE-4-060 | Add billing/payment tests | 3d | QA/Finance | 035-057 | [ ] |
| KR-BE-4-061 | Add conflict/concurrency tests | 3d | QA/Database | 011,052 | [ ] |
| KR-BE-4-062 | Add tenant isolation tests | 2.5d | Security/QA | All | [ ] |
| KR-BE-4-063 | Add financial invariant tests | 3d | QA/Finance | 027,030,034 | [ ] |
| KR-BE-4-064 | Add booking E2E tests | 3d | QA | 042-050 | [ ] |
| KR-BE-4-065 | Add payment webhook E2E tests | 2.5d | QA/Finance | 040,041 | [ ] |
| KR-BE-4-066 | Add reconciliation E2E tests | 2.5d | QA/Finance | 055-057 | [ ] |
| KR-BE-4-067 | Add performance/load baseline | 3d | QA/Backend | 064 | [ ] |
| KR-BE-4-068 | Security review | 3d | Security | 041,049-054 | [ ] |
| KR-BE-4-069 | Financial controls review | 3d | Finance/Architect | 024-057 | [ ] |
| KR-BE-4-070 | Architecture review | 2d | Architect | All | [ ] |
| KR-BE-4-071 | Documentation update | 1.5d | Documentation | All | [ ] |
| KR-BE-4-072 | Milestone acceptance/evidence | 1d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Booking Dependency Flow

    Availability
         |
         v
       Quote
         |
         v
    Credit Check
         |
         v
    Credit Reservation
         |
         v
    Resource Allocation
         |
         v
    Booking Confirmation

The exact transaction boundary must ensure that a booking cannot become
confirmed without the required resource and credit invariants being satisfied.

## 5.3 Financial Dependency Flow

    Payment
       |
       v
    Credit Grant
       |
       v
    Wallet
       |
       v
    Ledger

and:

    Booking
       |
       v
    Credit Reservation
       |
       v
    Consumption
       |
       v
    Ledger

---
