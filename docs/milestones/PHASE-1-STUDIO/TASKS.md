# PHASE-1-STUDIO — Tasks

Milestone: PHASE-1-STUDIO — Desktop Studio Foundation
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-1-001 | Confirm Studio architecture and package boundaries | 0.5d | Frontend Architect | Phase 0 | [ ] |
| KR-FE-1-002 | Configure Tauri application | 1.0d | Desktop Engineer | 001 | [ ] |
| KR-FE-1-003 | Configure React/TypeScript application | 1.0d | Frontend Engineer | 001 | [ ] |
| KR-FE-1-004 | Establish Studio routing | 0.5d | Frontend Engineer | 003 | [ ] |
| KR-FE-1-005 | Implement application shell | 1.5d | Frontend Engineer | 004 | [ ] |
| KR-FE-1-006 | Implement navigation model | 1.0d | Frontend Engineer | 005 | [ ] |
| KR-FE-1-007 | Implement application state foundation | 1.0d | Frontend Architect | 003 | [ ] |
| KR-FE-1-008 | Implement configuration loading | 1.0d | Platform Engineer | 002,003 | [ ] |
| KR-FE-1-009 | Implement API client foundation | 1.5d | API/Frontend Engineer | Phase 0 contracts | [ ] |
| KR-FE-1-010 | Implement API error normalization | 1.0d | Frontend Engineer | 009 | [ ] |
| KR-FE-1-011 | Implement request correlation | 0.5d | Frontend Engineer | 009 | [ ] |
| KR-FE-1-012 | Implement authentication UI | 1.5d | Frontend Engineer | 009 | [ ] |
| KR-FE-1-013 | Implement session manager | 1.5d | Desktop Engineer | 009,012 | [ ] |
| KR-FE-1-014 | Implement secure credential storage seam | 1.5d | Security/Desktop Engineer | 002,013 | [ ] |
| KR-FE-1-015 | Implement logout/session expiry | 1.0d | Frontend Engineer | 013,014 | [ ] |
| KR-FE-1-016 | Implement organization selector | 1.0d | Frontend Engineer | 013 | [ ] |
| KR-FE-1-017 | Implement organization context propagation | 1.0d | Frontend/API Engineer | 016 | [ ] |
| KR-FE-1-018 | Implement user profile | 0.5d | Frontend Engineer | 016 | [ ] |
| KR-FE-1-019 | Implement dashboard foundation | 1.0d | Frontend Engineer | 005,016 | [ ] |
| KR-FE-1-020 | Implement project list | 1.0d | Frontend Engineer | 017 | [ ] |
| KR-FE-1-021 | Implement project creation | 1.0d | Frontend Engineer | 020 | [ ] |
| KR-FE-1-022 | Implement project detail | 1.0d | Frontend Engineer | 021 | [ ] |
| KR-FE-1-023 | Implement project target metadata | 1.0d | Frontend Engineer | 022,026 | [ ] |
| KR-FE-1-024 | Implement platform catalog view | 1.0d | Frontend Engineer | 009 | [ ] |
| KR-FE-1-025 | Implement platform detail | 1.0d | Frontend Engineer | 024 | [ ] |
| KR-FE-1-026 | Implement platform/version/architecture model | 1.0d | Frontend/API Engineer | Phase 0 contracts | [ ] |
| KR-FE-1-027 | Implement capability display | 0.5d | Frontend Engineer | 026 | [ ] |
| KR-FE-1-028 | Implement service connectivity status | 1.0d | Frontend Engineer | 009 | [ ] |
| KR-FE-1-029 | Implement Local Runtime IPC contract | 1.5d | Desktop Engineer | 002 | [ ] |
| KR-FE-1-030 | Implement Local Runtime mock | 1.0d | Desktop Engineer | 029 | [ ] |
| KR-FE-1-031 | Implement settings foundation | 1.0d | Frontend Engineer | 008 | [ ] |
| KR-FE-1-032 | Implement UI component foundation | 2.0d | UI Engineer | Phase 0 | [ ] |
| KR-FE-1-033 | Implement loading/empty/error states | 1.0d | UI Engineer | 032 | [ ] |
| KR-FE-1-034 | Implement notification/toast foundation | 0.5d | UI Engineer | 032 | [ ] |
| KR-FE-1-035 | Implement accessibility foundation | 1.0d | UI Engineer | 032 | [ ] |
| KR-FE-1-036 | Implement desktop window behavior | 0.5d | Desktop Engineer | 002 | [ ] |
| KR-FE-1-037 | Implement safe application shutdown | 0.5d | Desktop Engineer | 036 | [ ] |
| KR-FE-1-038 | Implement frontend unit tests | 1.5d | QA Engineer | 005-035 | [ ] |
| KR-FE-1-039 | Implement API-client tests | 1.0d | QA Engineer | 009-017 | [ ] |
| KR-FE-1-040 | Implement IPC tests | 1.0d | QA/Desktop Engineer | 029,030 | [ ] |
| KR-FE-1-041 | Implement authentication E2E tests | 1.0d | QA Engineer | 012-017 | [ ] |
| KR-FE-1-042 | Implement project E2E tests | 1.0d | QA Engineer | 020-023 | [ ] |
| KR-FE-1-043 | Implement platform E2E tests | 1.0d | QA Engineer | 024-027 | [ ] |
| KR-FE-1-044 | Implement desktop smoke tests | 1.5d | QA Engineer | 038-043 | [ ] |
| KR-FE-1-045 | Validate Linux x86_64 build | 0.5d | Desktop Engineer | 002,044 | [ ] |
| KR-FE-1-046 | Validate Windows x86_64 build | 1.0d | Desktop Engineer | 002,044 | [ ] |
| KR-FE-1-047 | Validate macOS Apple Silicon build path | 1.0d | Desktop Engineer | 002,044 | [ ] |
| KR-FE-1-048 | Add Studio CI pipeline | 1.0d | DevOps Engineer | 038-047 | [ ] |
| KR-FE-1-049 | Add frontend security scanning | 0.5d | Security Engineer | 048 | [ ] |
| KR-FE-1-050 | Add source-privacy regression test | 1.0d | Security/QA Engineer | 009,029 | [ ] |
| KR-FE-1-051 | Execute clean-machine Studio bootstrap | 1.0d | QA Engineer | 045-050 | [ ] |
| KR-FE-1-052 | Execute cross-domain Studio smoke test | 1.0d | Integration Engineer | 051 | [ ] |
| KR-FE-1-053 | Complete UI review | 1.0d | UI/UX Reviewer | 032-035 | [ ] |
| KR-FE-1-054 | Complete security review | 1.0d | Security Architect | 013-017,029 | [ ] |
| KR-FE-1-055 | Complete architecture review | 1.0d | System Architect | 001-052 | [ ] |
| KR-FE-1-056 | Complete Phase 1 acceptance | 0.5d | Tech Lead | 053-055 | [ ] |

### 5.2 Estimation convention

Estimates are person-days.

Indicative Phase 1 effort:

    Studio architecture/UI:       15–20 person-days
    Native/runtime integration:    7–10 person-days
    Testing/CI/security:           8–12 person-days
    Integration/review:            5–8 person-days
    Total indicative effort:      35–50 person-days

Actual effort shall be tracked against accepted task evidence.

### 5.3 Ownership

Primary roles:

- System Architect;
- Frontend Architect;
- Frontend Engineer;
- Desktop Engineer;
- UI Engineer;
- Backend/API Engineer;
- Security Engineer;
- QA Engineer;
- DevOps Engineer;
- Integration Engineer.

### 5.4 Definition of Ready

A task may enter READY only when:

- acceptance criteria exist;
- API/IPC impact is identified;
- owner is assigned;
- dependencies are known;
- security impact is reviewed;
- UI impact is identified;
- test strategy is defined.

---
