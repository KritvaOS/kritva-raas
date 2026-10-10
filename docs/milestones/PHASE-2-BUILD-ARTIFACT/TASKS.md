# PHASE-2-BUILD-ARTIFACT — Tasks

Milestone: PHASE-2-BUILD-ARTIFACT — Local Build and Secure `.krv` Artifact
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-2-001 | Define Build/Artifact UX architecture | 1.0d | Frontend Architect | Phase 1 | [ ] |
| KR-FE-2-002 | Implement Build route | 1.0d | Frontend Engineer | 001 | [ ] |
| KR-FE-2-003 | Implement build configuration UI | 1.0d | Frontend Engineer | 002 | [ ] |
| KR-FE-2-004 | Implement build progress UI | 1.0d | Frontend Engineer | 002 | [ ] |
| KR-FE-2-005 | Implement build diagnostics UI | 1.0d | Frontend Engineer | 004 | [ ] |
| KR-FE-2-006 | Implement test execution UI | 1.0d | Frontend Engineer | 002 | [ ] |
| KR-FE-2-007 | Implement artifact detail UI | 1.0d | Frontend Engineer | 010 | [ ] |
| KR-FE-2-008 | Implement artifact upload UI | 1.0d | Frontend Engineer | 007 | [ ] |
| KR-FE-2-009 | Implement artifact validation UI | 1.0d | Frontend Engineer | 007 | [ ] |
| KR-FE-2-010 | Implement artifact list | 1.0d | Frontend Engineer | Phase 1 | [ ] |
| KR-FE-2-011 | Define Local Runtime build interface | 1.0d | Desktop Architect | Phase 1 | [ ] |
| KR-FE-2-012 | Implement toolchain discovery IPC | 1.0d | Desktop Engineer | 011 | [ ] |
| KR-FE-2-013 | Implement build-start IPC | 1.0d | Desktop Engineer | 011 | [ ] |
| KR-FE-2-014 | Implement build-progress IPC | 1.0d | Desktop Engineer | 013 | [ ] |
| KR-FE-2-015 | Implement build-cancel IPC | 0.5d | Desktop Engineer | 013 | [ ] |
| KR-FE-2-016 | Implement test IPC | 1.0d | Desktop Engineer | 011 | [ ] |
| KR-FE-2-017 | Implement artifact-package IPC | 1.0d | Desktop Engineer | 013,016 | [ ] |
| KR-FE-2-018 | Implement local build executor | 2.0d | Build Engineer | 011 | [ ] |
| KR-FE-2-019 | Implement target/toolchain validation | 1.5d | Build Engineer | 018 | [ ] |
| KR-FE-2-020 | Implement build profiles | 1.0d | Build Engineer | 018 | [ ] |
| KR-FE-2-021 | Implement build diagnostics | 1.0d | Build Engineer | 018 | [ ] |
| KR-FE-2-022 | Implement local test runner | 1.5d | Build Engineer | 018 | [ ] |
| KR-FE-2-023 | Implement package builder | 1.5d | Build Engineer | 018,022 | [ ] |
| KR-FE-2-024 | Implement deterministic package ordering | 1.0d | Build Engineer | 023 | [ ] |
| KR-FE-2-025 | Implement manifest generator | 1.0d | Artifact Engineer | 023 | [ ] |
| KR-FE-2-026 | Implement digest generation | 0.5d | Artifact Engineer | 023,025 | [ ] |
| KR-FE-2-027 | Implement privacy scanner | 2.0d | Security Engineer | 023 | [ ] |
| KR-FE-2-028 | Implement secret scanner integration | 1.0d | Security Engineer | 027 | [ ] |
| KR-FE-2-029 | Implement prohibited-content scanner | 1.0d | Security Engineer | 027 | [ ] |
| KR-FE-2-030 | Implement dependency metadata scanner | 1.0d | Security Engineer | 018 | [ ] |
| KR-FE-2-031 | Implement signing interface | 1.0d | Security Engineer | 026 | [ ] |
| KR-FE-2-032 | Implement development signing adapter | 1.0d | Security Engineer | 031 | [ ] |
| KR-FE-2-033 | Implement artifact validation | 1.5d | Artifact Engineer | 025-032 | [ ] |
| KR-FE-2-034 | Implement artifact upload API | 1.5d | Backend Engineer | DB-M02 | [ ] |
| KR-FE-2-035 | Implement artifact registry integration | 1.5d | Backend Engineer | 034 | [ ] |
| KR-FE-2-036 | Implement compatibility validation | 1.5d | Backend Engineer | 033,035 | [ ] |
| KR-FE-2-037 | Implement artifact authorization | 1.0d | Backend/Security Engineer | 035 | [ ] |
| KR-FE-2-038 | Implement upload idempotency | 1.0d | Backend Engineer | 034 | [ ] |
| KR-FE-2-039 | Implement artifact audit events | 1.0d | Backend Engineer | 035,037 | [ ] |
| KR-FE-2-040 | Implement artifact retention metadata | 0.5d | Database Engineer | DB-M02 | [ ] |
| KR-FE-2-041 | Add build unit tests | 1.5d | QA Engineer | 018-024 | [ ] |
| KR-FE-2-042 | Add packaging tests | 1.5d | QA Engineer | 023-026 | [ ] |
| KR-FE-2-043 | Add privacy regression tests | 1.5d | Security/QA Engineer | 027-030 | [ ] |
| KR-FE-2-044 | Add signing/validation tests | 1.5d | Security/QA Engineer | 031-033 | [ ] |
| KR-FE-2-045 | Add upload integration tests | 1.5d | QA Engineer | 034-039 | [ ] |
| KR-FE-2-046 | Add source-isolation E2E test | 1.5d | Security/QA Engineer | 027,034 | [ ] |
| KR-FE-2-047 | Add artifact compatibility tests | 1.0d | QA Engineer | 036 | [ ] |
| KR-FE-2-048 | Add Studio build E2E tests | 1.5d | QA Engineer | 002-010 | [ ] |
| KR-FE-2-049 | Add cross-domain build demo | 1.0d | Integration Engineer | 041-048 | [ ] |
| KR-FE-2-050 | Execute performance benchmark | 1.0d | Build Engineer | 041-048 | [ ] |
| KR-FE-2-051 | Complete security review | 1.0d | Security Architect | 027-046 | [ ] |
| KR-FE-2-052 | Complete architecture review | 1.0d | System Architect | 001-050 | [ ] |
| KR-FE-2-053 | Complete Phase 2 acceptance | 0.5d | Tech Lead | 051,052 | [ ] |

### 5.2 Estimation convention

Estimates are person-days.

Indicative effort:

    Studio build UX:              8–12 person-days
    Local build/runtime:          12–16 person-days
    Artifact/security:            12–16 person-days
    Backend/registry:              8–12 person-days
    Testing/review/integration:    8–12 person-days
    Total indicative effort:     48–68 person-days

Actual effort shall be tracked against accepted task evidence.

### 5.3 Definition of Ready

A task shall not enter READY unless:

- build/artifact boundary is defined;
- affected contract is identified;
- security impact is understood;
- source-privacy impact is assessed;
- acceptance criteria exist;
- owner is assigned;
- dependencies are known.

---
