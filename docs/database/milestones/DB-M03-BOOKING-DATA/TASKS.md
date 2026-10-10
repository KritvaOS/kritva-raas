# DB-M03-BOOKING-DATA — Tasks

Milestone: DB-M03-BOOKING-DATA — Booking, Availability, Credits and Commercial Data
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-DB-2-001 | Review DB-M01 and DB-M02 foundations | 0.5d | Database Architect | DB-M01, DB-M02 | [ ] |
| KR-DB-2-002 | Confirm booking aggregate model | 1.0d | Database Architect | 001 | [ ] |
| KR-DB-2-003 | Implement booking schema | 1.0d | Database Engineer | 002 | [ ] |
| KR-DB-2-004 | Implement bookings table | 1.5d | Database Engineer | 003 | [ ] |
| KR-DB-2-005 | Implement time slots | 1.0d | Database Engineer | 004 | [ ] |
| KR-DB-2-006 | Implement resource allocations | 1.5d | Database Engineer | 004,005 | [ ] |
| KR-DB-2-007 | Implement allocation exclusion constraint | 1.5d | Database Engineer | 006 | [ ] |
| KR-DB-2-008 | Implement booking state history | 1.0d | Database Engineer | 004 | [ ] |
| KR-DB-2-009 | Implement cancellations | 1.0d | Database Engineer | 004,008 | [ ] |
| KR-DB-2-010 | Implement booking indexes | 1.0d | Database Engineer | 004-009 | [ ] |
| KR-DB-2-011 | Define availability query model | 1.0d | Database Architect | 006,010 | [ ] |
| KR-DB-2-012 | Implement availability indexes | 1.0d | Database Engineer | 011 | [ ] |
| KR-DB-2-013 | Confirm credit model | 1.0d | Financial/Data Architect | 001 | [ ] |
| KR-DB-2-014 | Implement credit types | 1.0d | Database Engineer | 013 | [ ] |
| KR-DB-2-015 | Implement credit plans | 1.0d | Database Engineer | 013 | [ ] |
| KR-DB-2-016 | Implement rate cards | 1.5d | Database Engineer | 014,015 | [ ] |
| KR-DB-2-017 | Implement wallets | 1.5d | Database Engineer | 014 | [ ] |
| KR-DB-2-018 | Implement ledger transactions | 1.5d | Database Engineer | 017 | [ ] |
| KR-DB-2-019 | Implement ledger entries | 1.5d | Database Engineer | 018 | [ ] |
| KR-DB-2-020 | Implement ledger balance constraints | 1.5d | Financial/Data Architect | 018,019 | [ ] |
| KR-DB-2-021 | Implement reservations | 1.5d | Database Engineer | 016-019 | [ ] |
| KR-DB-2-022 | Implement consumption | 1.0d | Database Engineer | 021 | [ ] |
| KR-DB-2-023 | Implement refunds | 1.0d | Database Engineer | 021,022 | [ ] |
| KR-DB-2-024 | Implement credit indexes | 1.0d | Database Engineer | 014-023 | [ ] |
| KR-DB-2-025 | Implement invoice schema | 1.5d | Database Engineer | 015,016 | [ ] |
| KR-DB-2-026 | Implement invoice lines | 1.0d | Database Engineer | 025 | [ ] |
| KR-DB-2-027 | Implement payment metadata | 1.0d | Database Engineer | 025 | [ ] |
| KR-DB-2-028 | Implement reconciliation records | 1.5d | Database Engineer | 018-027 | [ ] |
| KR-DB-2-029 | Implement booking/credit idempotency | 1.5d | Database Engineer | 004,021,022 | [ ] |
| KR-DB-2-030 | Implement tenant RLS | 1.5d | Security/DB Engineer | DB-M01,004,017,025 | [ ] |
| KR-DB-2-031 | Implement audit integration | 1.0d | Backend/DB Engineer | DB-M01 | [ ] |
| KR-DB-2-032 | Implement booking repositories | 1.5d | Backend Engineer | 004-012 | [ ] |
| KR-DB-2-033 | Implement credit repositories | 2.0d | Backend Engineer | 014-024 | [ ] |
| KR-DB-2-034 | Implement billing repositories | 1.5d | Backend Engineer | 025-028 | [ ] |
| KR-DB-2-035 | Add exclusion-constraint tests | 1.5d | QA Engineer | 007 | [ ] |
| KR-DB-2-036 | Add booking concurrency tests | 1.5d | QA Engineer | 006,007 | [ ] |
| KR-DB-2-037 | Add credit concurrency tests | 2.0d | Financial/QA Engineer | 017-023 | [ ] |
| KR-DB-2-038 | Add ledger integrity tests | 1.5d | Financial/QA Engineer | 018-020 | [ ] |
| KR-DB-2-039 | Add invoice integrity tests | 1.0d | QA Engineer | 025-027 | [ ] |
| KR-DB-2-040 | Add reconciliation tests | 1.0d | QA Engineer | 028 | [ ] |
| KR-DB-2-041 | Add tenant isolation tests | 1.5d | Security/QA Engineer | 030 | [ ] |
| KR-DB-2-042 | Validate critical indexes | 1.0d | Database Engineer | 010,024,028 | [ ] |
| KR-DB-2-043 | Validate migration upgrade path | 1.0d | Database Engineer | 003-042 | [ ] |
| KR-DB-2-044 | Complete commercial data review | 1.5d | Financial Architect | 018-040 | [ ] |
| KR-DB-2-045 | Complete DB-M03 architecture review | 1.0d | Database Architect | 043,044 | [ ] |

### 5.2 Estimation convention

Estimates are person-days.

Parallel implementation is allowed after dependencies are satisfied.

Financial integrity tasks require specialist review.

### 5.3 Status lifecycle

Tasks follow:

    BACKLOG
      -> REFINED
      -> READY
      -> IN_PROGRESS
      -> IMPLEMENTED
      -> REVIEW
      -> CI
      -> ACCEPTED
      -> INTEGRATED
      -> CLOSED

### 5.4 Evidence requirements

Accepted tasks require:

- commit;
- migration version;
- test evidence;
- reviewer;
- schema documentation;
- acceptance evidence.

---
