# DB-M01-FOUNDATION — Tasks

Milestone: DB-M01-FOUNDATION — PostgreSQL Database Foundation
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-DB-0-001 | Confirm PostgreSQL foundation architecture | 1.0d | Database Architect | DATABASE_ARCHITECTURE | [ ] |
| KR-DB-0-002 | Define PostgreSQL version policy | 0.5d | Database Engineer | 001 | [ ] |
| KR-DB-0-003 | Define database environment naming | 0.5d | Database Engineer | 001 | [ ] |
| KR-DB-0-004 | Define schema ownership conventions | 1.0d | Database Architect | 001 | [ ] |
| KR-DB-0-005 | Define naming/type conventions | 1.0d | Database Engineer | 004 | [ ] |
| KR-DB-0-006 | Select and configure migration tooling | 1.5d | Database Engineer | 002 | [ ] |
| KR-DB-0-007 | Establish migration directory structure | 0.5d | Database Engineer | 006 | [ ] |
| KR-DB-0-008 | Implement baseline migration | 1.0d | Database Engineer | 007 | [ ] |
| KR-DB-0-009 | Configure migration CI checks | 1.0d | DevOps Engineer | 008 | [ ] |
| KR-DB-0-010 | Configure disposable CI PostgreSQL | 1.0d | DevOps Engineer | 009 | [ ] |
| KR-DB-0-011 | Define database roles and privileges | 1.5d | Database/Security Engineer | 004 | [ ] |
| KR-DB-0-012 | Create identity schema | 1.5d | Database Engineer | 005,008 | [ ] |
| KR-DB-0-013 | Create users table | 1.0d | Database Engineer | 012 | [ ] |
| KR-DB-0-014 | Create organizations table | 1.0d | Database Engineer | 012 | [ ] |
| KR-DB-0-015 | Create memberships table | 1.5d | Database Engineer | 013,014 | [ ] |
| KR-DB-0-016 | Create roles/permissions baseline | 1.5d | Database/Security Engineer | 015 | [ ] |
| KR-DB-0-017 | Define user lifecycle constraints | 0.5d | Database Engineer | 013 | [ ] |
| KR-DB-0-018 | Define membership constraints | 0.5d | Database Engineer | 015 | [ ] |
| KR-DB-0-019 | Create project schema | 1.0d | Database Engineer | 005,008 | [ ] |
| KR-DB-0-020 | Create projects table | 1.5d | Database Engineer | 019,014 | [ ] |
| KR-DB-0-021 | Create project settings table | 1.0d | Database Engineer | 020 | [ ] |
| KR-DB-0-022 | Create project members table | 1.5d | Database Engineer | 015,020 | [ ] |
| KR-DB-0-023 | Create project platform bindings table | 1.0d | Database Engineer | 020 | [ ] |
| KR-DB-0-024 | Add project constraints/indexes | 1.0d | Database Engineer | 020-023 | [ ] |
| KR-DB-0-025 | Create audit schema | 1.0d | Database Engineer | 005,008 | [ ] |
| KR-DB-0-026 | Create audit records table | 1.5d | Database Engineer | 025 | [ ] |
| KR-DB-0-027 | Create audit indexes | 0.5d | Database Engineer | 026 | [ ] |
| KR-DB-0-028 | Define tenant context mechanism | 1.0d | Database/Security Engineer | 014,015 | [ ] |
| KR-DB-0-029 | Enable RLS baseline | 1.5d | Database/Security Engineer | 028 | [ ] |
| KR-DB-0-030 | Implement tenant RLS policies | 2.0d | Database/Security Engineer | 020,022,023,029 | [ ] |
| KR-DB-0-031 | Define privileged/service-role behavior | 1.0d | Database/Security Engineer | 029 | [ ] |
| KR-DB-0-032 | Create system/idempotency foundation | 1.5d | Database Engineer | 005,008 | [ ] |
| KR-DB-0-033 | Define transaction conventions | 1.0d | Database Architect | 020,026 | [ ] |
| KR-DB-0-034 | Define repository interfaces | 1.5d | Backend Architect | 013-026 | [ ] |
| KR-DB-0-035 | Implement repository foundation | 2.0d | Backend Engineer | 034 | [ ] |
| KR-DB-0-036 | Implement seed data | 1.0d | Database Engineer | 015,020,016 | [ ] |
| KR-DB-0-037 | Add schema documentation | 1.5d | Database Engineer | 013-026 | [ ] |
| KR-DB-0-038 | Add migration rollback/recovery tests | 1.5d | Database/QA Engineer | 008-036 | [ ] |
| KR-DB-0-039 | Add RLS negative tests | 1.5d | Security/QA Engineer | 029-031 | [ ] |
| KR-DB-0-040 | Add audit integrity tests | 1.0d | QA Engineer | 026 | [ ] |
| KR-DB-0-041 | Add tenant isolation integration tests | 1.5d | Security/QA Engineer | 030,035 | [ ] |
| KR-DB-0-042 | Validate clean database bootstrap | 1.0d | QA Engineer | 008-041 | [ ] |
| KR-DB-0-043 | Validate upgrade from previous migration | 1.0d | Database Engineer | 042 | [ ] |
| KR-DB-0-044 | Validate CI migration workflow | 1.0d | DevOps Engineer | 009,042 | [ ] |
| KR-DB-0-045 | Review privileges and grants | 1.0d | Security Engineer | 011,031 | [ ] |
| KR-DB-0-046 | Complete database foundation review | 1.0d | Database Architect | 037-045 | [ ] |

### 5.2 Estimation convention

Estimates are person-days and represent implementation effort.

Tasks may execute in parallel after dependencies are satisfied.

### 5.3 Status rules

A task shall progress through the repository-wide lifecycle:

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

The checkbox in this dossier is the milestone planning indicator.

### 5.4 Required evidence

Every accepted task shall identify:

- commit;
- migration version where applicable;
- tests;
- reviewer;
- documentation update;
- acceptance result.

---
