# PHASE-0-FOUNDATION — Tasks

Milestone: PHASE-0-FOUNDATION — Architecture and Engineering Foundation
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-PLAT-0-001 | Create repository root structure | 0.5d | Platform Engineer | None | [ ] |
| KR-PLAT-0-002 | Configure pnpm workspace | 0.5d | Platform Engineer | 001 | [ ] |
| KR-PLAT-0-003 | Configure Turborepo/workspace orchestration | 0.5d | Platform Engineer | 002 | [ ] |
| KR-PLAT-0-004 | Establish Node/Rust version policy | 0.5d | Platform Engineer | 001 | [ ] |
| KR-PLAT-0-005 | Establish repository conventions | 0.5d | Tech Lead | 001 | [ ] |
| KR-PLAT-0-006 | Create Studio application skeleton | 1.5d | Frontend Engineer | 002-004 | [ ] |
| KR-PLAT-0-007 | Create Backend application skeleton | 1.5d | Backend Engineer | 002-004 | [ ] |
| KR-PLAT-0-008 | Create shared UI package | 1.0d | Frontend Engineer | 002 | [ ] |
| KR-PLAT-0-009 | Create contracts package | 1.5d | API Architect | 005 | [ ] |
| KR-PLAT-0-010 | Create API client package | 1.0d | Frontend Engineer | 009 | [ ] |
| KR-PLAT-0-011 | Create auth package boundary | 1.0d | Security Engineer | 009 | [ ] |
| KR-PLAT-0-012 | Create config package | 1.0d | Platform Engineer | 005 | [ ] |
| KR-PLAT-0-013 | Create utility package | 0.5d | Platform Engineer | 005 | [ ] |
| KR-PLAT-0-014 | Establish backend module structure | 1.0d | Backend Architect | 007 | [ ] |
| KR-PLAT-0-015 | Establish repository interfaces | 1.0d | Backend Architect | 014 | [ ] |
| KR-PLAT-0-016 | Establish infrastructure adapter interfaces | 1.0d | Backend Architect | 014 | [ ] |
| KR-PLAT-0-017 | Establish REST API conventions | 1.0d | API Architect | 009,014 | [ ] |
| KR-PLAT-0-018 | Establish WebSocket conventions | 1.0d | API Architect | 009,014 | [ ] |
| KR-PLAT-0-019 | Establish event envelope | 1.0d | API Architect | 009 | [ ] |
| KR-PLAT-0-020 | Establish error model | 0.5d | API Architect | 009 | [ ] |
| KR-PLAT-0-021 | Establish database migration framework | 1.0d | Database Engineer | 001 | [ ] |
| KR-PLAT-0-022 | Establish database conventions | 1.0d | Database Architect | 021 | [ ] |
| KR-PLAT-0-023 | Establish foundational database schemas | 1.0d | Database Engineer | 022 | [ ] |
| KR-PLAT-0-024 | Establish local PostgreSQL infrastructure | 0.5d | Platform Engineer | 021 | [ ] |
| KR-PLAT-0-025 | Establish database test harness | 1.0d | QA/DB Engineer | 021-024 | [ ] |
| KR-PLAT-0-026 | Establish authentication integration seam | 1.0d | Security Engineer | 011,014 | [ ] |
| KR-PLAT-0-027 | Establish authorization integration seam | 1.0d | Security Engineer | 014,026 | [ ] |
| KR-PLAT-0-028 | Establish tenant context propagation | 1.0d | Backend Engineer | 027 | [ ] |
| KR-PLAT-0-029 | Establish structured logging | 1.0d | Platform Engineer | 007 | [ ] |
| KR-PLAT-0-030 | Establish request correlation | 0.5d | Backend Engineer | 017,029 | [ ] |
| KR-PLAT-0-031 | Establish health/readiness endpoints | 0.5d | Backend Engineer | 007 | [ ] |
| KR-PLAT-0-032 | Establish unit test framework | 0.5d | QA Engineer | 006,007 | [ ] |
| KR-PLAT-0-033 | Establish integration test framework | 1.0d | QA Engineer | 025,032 | [ ] |
| KR-PLAT-0-034 | Establish E2E test skeleton | 1.0d | QA Engineer | 006,007,032 | [ ] |
| KR-PLAT-0-035 | Establish formatting and linting | 0.5d | Platform Engineer | 002,004 | [ ] |
| KR-PLAT-0-036 | Establish TypeScript/Rust type checks | 0.5d | Platform Engineer | 006,007 | [ ] |
| KR-PLAT-0-037 | Establish dependency/security scanning | 1.0d | Security Engineer | 002 | [ ] |
| KR-PLAT-0-038 | Establish CI pull-request workflow | 1.0d | DevOps Engineer | 032-037 | [ ] |
| KR-PLAT-0-039 | Establish main-branch CI workflow | 0.5d | DevOps Engineer | 038 | [ ] |
| KR-PLAT-0-040 | Establish build artifacts and provenance metadata | 1.0d | DevOps Engineer | 038 | [ ] |
| KR-PLAT-0-041 | Establish local bootstrap command | 1.0d | Platform Engineer | 024,038 | [ ] |
| KR-PLAT-0-042 | Establish documentation structure | 0.5d | Tech Lead | 001 | [ ] |
| KR-PLAT-0-043 | Establish task/milestone conventions | 0.5d | Program/Tech Lead | 042 | [ ] |
| KR-PLAT-0-044 | Establish Git branching and commit policy | 0.5d | Tech Lead | 005 | [ ] |
| KR-PLAT-0-045 | Establish object-storage interface | 0.5d | Backend Architect | 016 | [ ] |
| KR-PLAT-0-046 | Establish queue interface | 0.5d | Backend Architect | 016 | [ ] |
| KR-PLAT-0-047 | Establish secrets interface | 0.5d | Security Engineer | 016 | [ ] |
| KR-PLAT-0-048 | Establish audit interface | 0.5d | Security Engineer | 016,029 | [ ] |
| KR-PLAT-0-049 | Establish Lab Protocol skeleton | 1.0d | Protocol Architect | 019 | [ ] |
| KR-PLAT-0-050 | Establish simulated Lab Agent skeleton | 1.0d | Backend/Runtime Engineer | 049 | [ ] |
| KR-PLAT-0-051 | Establish CI database migration test | 1.0d | DevOps/DB Engineer | 025,038 | [ ] |
| KR-PLAT-0-052 | Establish CI integration test environment | 1.0d | DevOps Engineer | 033,038 | [ ] |
| KR-PLAT-0-053 | Establish baseline security gates | 1.0d | Security Engineer | 037,038 | [ ] |
| KR-PLAT-0-054 | Execute clean-machine bootstrap validation | 1.0d | QA Engineer | 041,051,052 | [ ] |
| KR-PLAT-0-055 | Execute cross-domain integration smoke test | 1.0d | Integration Engineer | 045-050,054 | [ ] |
| KR-PLAT-0-056 | Complete architecture review | 1.0d | System Architect | 001-055 | [ ] |
| KR-PLAT-0-057 | Complete security review | 1.0d | Security Architect | 026-053 | [ ] |
| KR-PLAT-0-058 | Complete CI/release readiness review | 1.0d | DevOps Lead | 038-054 | [ ] |
| KR-PLAT-0-059 | Complete Phase 0 acceptance and tracking update | 0.5d | Tech Lead | 056-058 | [ ] |

### 5.2 Task estimation

Estimates are person-days.

Phase 0 is expected to require approximately:

    Foundation implementation: 35–45 person-days
    Review/integration/testing: 15–20 person-days
    Total indicative effort: 50–65 person-days

The estimate is a planning baseline and shall be updated from actual task evidence.

### 5.3 Ownership

Primary owner roles are:

- System Architect;
- Tech Lead;
- Platform Engineer;
- Frontend Engineer;
- Backend Engineer;
- Database Engineer;
- Security Engineer;
- DevOps Engineer;
- QA Engineer;
- Integration Engineer.

No task shall enter READY without an assigned owner.

### 5.4 Definition of Ready

A Phase 0 task is READY only when:

- scope is understood;
- dependencies are known;
- acceptance criteria exist;
- owner is assigned;
- affected interfaces are identified;
- security impact is understood;
- database impact is identified where applicable;
- documentation impact is identified.

---
