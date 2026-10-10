# PHASE-4-BOOKING-COMMERCIAL — Tasks

Milestone: PHASE-4-BOOKING-COMMERCIAL — Resources, Availability, Booking, Credits and Commercial Model
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-4-001 | Confirm resource/robot/lab boundaries | 1.0d | Backend Architect | P3 CONTROL PLANE | [ ] |
| KR-BE-4-002 | Implement lab repository/service | 1.0d | Backend Engineer | DB-M02 | [ ] |
| KR-BE-4-003 | Implement robot repository/service | 1.0d | Backend Engineer | DB-M02 | [ ] |
| KR-BE-4-004 | Implement resource repository/service | 1.5d | Backend Engineer | 002,003 | [ ] |
| KR-BE-4-005 | Implement maintenance windows | 1.0d | Backend Engineer | 004 | [ ] |
| KR-BE-4-006 | Implement availability windows | 1.0d | Backend Engineer | 004 | [ ] |
| KR-BE-4-007 | Implement resource state transitions | 1.0d | Backend Engineer | 004 | [ ] |
| KR-BE-4-008 | Implement availability service | 2.0d | Scheduling Engineer | 004-006 | [ ] |
| KR-BE-4-009 | Implement platform/resource eligibility | 1.5d | Backend Engineer | 008, P3 CONTROL PLANE | [ ] |
| KR-BE-4-010 | Implement availability APIs | 1.0d | API Engineer | 008 | [ ] |
| KR-BE-4-011 | Implement booking aggregate | 1.5d | Backend Architect | DB-M03 | [ ] |
| KR-BE-4-012 | Implement booking state machine | 1.0d | Backend Engineer | 011 | [ ] |
| KR-BE-4-013 | Implement time slots | 1.0d | Backend Engineer | 011 | [ ] |
| KR-BE-4-014 | Implement resource allocations | 1.5d | Backend Engineer | 013 | [ ] |
| KR-BE-4-015 | Implement exclusion constraint | 0.5d | Database Engineer | 014 | [ ] |
| KR-BE-4-016 | Implement booking quote service | 1.5d | Commercial Engineer | 011 | [ ] |
| KR-BE-4-017 | Implement booking confirmation transaction | 2.0d | Backend Engineer | 012-016 | [ ] |
| KR-BE-4-018 | Implement booking cancellation | 1.5d | Backend Engineer | 017 | [ ] |
| KR-BE-4-019 | Implement booking expiration | 1.0d | Backend Engineer | 017 | [ ] |
| KR-BE-4-020 | Implement booking state history | 1.0d | Backend Engineer | 012 | [ ] |
| KR-BE-4-021 | Implement credit types | 1.0d | Commercial Engineer | DB-M03 | [ ] |
| KR-BE-4-022 | Implement credit plans | 1.0d | Commercial Engineer | 021 | [ ] |
| KR-BE-4-023 | Implement rate cards | 1.5d | Commercial Engineer | 021,022 | [ ] |
| KR-BE-4-024 | Implement rate-card effective dating | 1.0d | Commercial Engineer | 023 | [ ] |
| KR-BE-4-025 | Implement credit wallets | 1.0d | Backend Engineer | 021 | [ ] |
| KR-BE-4-026 | Implement ledger transactions | 2.0d | Financial Engineer | 025 | [ ] |
| KR-BE-4-027 | Implement ledger balancing constraints | 1.0d | Financial Engineer | 026 | [ ] |
| KR-BE-4-028 | Implement credit reservations | 1.5d | Financial Engineer | 025-027 | [ ] |
| KR-BE-4-029 | Implement credit consumption | 1.5d | Financial Engineer | 028 | [ ] |
| KR-BE-4-030 | Implement credit release | 1.0d | Financial Engineer | 028 | [ ] |
| KR-BE-4-031 | Implement refunds | 1.5d | Financial Engineer | 029,030 | [ ] |
| KR-BE-4-032 | Implement invoice records | 1.5d | Commercial Engineer | DB-M03 | [ ] |
| KR-BE-4-033 | Implement invoice lines | 1.0d | Commercial Engineer | 032 | [ ] |
| KR-BE-4-034 | Implement payment abstraction | 1.5d | Commercial Engineer | 032 | [ ] |
| KR-BE-4-035 | Implement provider callback idempotency | 1.0d | Backend Engineer | 034 | [ ] |
| KR-BE-4-036 | Implement reconciliation service | 1.5d | Financial Engineer | 017-035 | [ ] |
| KR-BE-4-037 | Implement booking APIs | 1.5d | API Engineer | 017-020 | [ ] |
| KR-BE-4-038 | Implement credit APIs | 1.5d | API Engineer | 021-031 | [ ] |
| KR-BE-4-039 | Implement commercial APIs | 1.0d | API Engineer | 032-035 | [ ] |
| KR-BE-4-040 | Implement commercial authorization | 1.0d | Security Engineer | 037-039 | [ ] |
| KR-BE-4-041 | Implement booking audit events | 1.0d | Security Engineer | 017-020 | [ ] |
| KR-BE-4-042 | Implement financial audit events | 1.0d | Security Engineer | 026-035 | [ ] |
| KR-BE-4-043 | Implement booking UI | 2.0d | Frontend Engineer | P3 CONTROL PLANE, 037 | [ ] |
| KR-BE-4-044 | Implement availability UI | 1.5d | Frontend Engineer | 010 | [ ] |
| KR-BE-4-045 | Implement credit wallet UI | 1.0d | Frontend Engineer | 038 | [ ] |
| KR-BE-4-046 | Implement quote UI | 1.0d | Frontend Engineer | 016 | [ ] |
| KR-BE-4-047 | Implement billing history UI | 1.0d | Frontend Engineer | 039 | [ ] |
| KR-BE-4-048 | Add booking unit tests | 1.5d | QA Engineer | 011-020 | [ ] |
| KR-BE-4-049 | Add concurrent booking tests | 1.5d | QA/DB Engineer | 015,017 | [ ] |
| KR-BE-4-050 | Add credit ledger tests | 1.5d | QA/Financial Engineer | 026-031 | [ ] |
| KR-BE-4-051 | Add payment idempotency tests | 1.0d | QA Engineer | 034,035 | [ ] |
| KR-BE-4-052 | Add reconciliation tests | 1.0d | QA Engineer | 036 | [ ] |
| KR-BE-4-053 | Add tenant isolation tests | 1.0d | Security/QA Engineer | 040 | [ ] |
| KR-BE-4-054 | Add Studio booking E2E tests | 1.5d | QA Engineer | 043-047 | [ ] |
| KR-BE-4-055 | Add performance tests | 1.0d | QA Engineer | 048-054 | [ ] |
| KR-BE-4-056 | Review financial invariants | 1.0d | Financial Architect | 026-036 | [ ] |
| KR-BE-4-057 | Review scheduling invariants | 1.0d | Scheduling Architect | 008-020 | [ ] |
| KR-BE-4-058 | Complete security review | 1.0d | Security Architect | 040,053 | [ ] |
| KR-BE-4-059 | Complete architecture review | 1.0d | System Architect | 001-055 | [ ] |
| KR-BE-4-060 | Complete P4 BOOKING & COMMERCIAL acceptance | 0.5d | Tech Lead | 056-059 | [ ] |

### 5.2 Indicative effort

Estimated person-days:

    Resource/availability:          10–14
    Booking/scheduling:             12–16
    Credits/ledger:                 14–18
    Commercial/payment:              8–12
    Studio integration:              6–9
    Testing/review:                  8–12
    Total:                          58–81 person-days

Financial and concurrency work shall not be compressed below the level needed to prove invariants.

### 5.3 Definition of Ready

A P4 BOOKING & COMMERCIAL task is READY only when:

- resource or financial ownership is defined;
- transaction boundary is documented;
- concurrency behavior is documented;
- authorization is defined;
- failure behavior is defined;
- acceptance criteria exist;
- owner is assigned.

---
