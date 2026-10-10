# PHASE-5-EXECUTION — Tasks

Milestone: PHASE-5-EXECUTION — Remote Execution, Jobs, Runs and Simulated Robot Environment
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-5-001 | Define Job/Run aggregate boundaries | 1.0d | Backend Architect | Phase 4 | [ ] |
| KR-BE-5-002 | Define Job state machine | 1.0d | Backend Architect | 001 | [ ] |
| KR-BE-5-003 | Define Run state machine | 1.0d | Backend Architect | 001 | [ ] |
| KR-BE-5-004 | Implement Job repository | 1.0d | Backend Engineer | DB foundation | [ ] |
| KR-BE-5-005 | Implement Run repository | 1.0d | Backend Engineer | DB foundation | [ ] |
| KR-BE-5-006 | Implement Job service | 1.5d | Backend Engineer | 002,004 | [ ] |
| KR-BE-5-007 | Implement Run service | 1.5d | Backend Engineer | 003,005 | [ ] |
| KR-BE-5-008 | Implement state history | 1.0d | Backend Engineer | 006,007 | [ ] |
| KR-BE-5-009 | Implement execution eligibility service | 1.5d | Backend Engineer | Phase 3,4 | [ ] |
| KR-BE-5-010 | Implement execution queue interface | 1.0d | Platform Engineer | Phase 0 | [ ] |
| KR-BE-5-011 | Implement development queue adapter | 1.0d | Platform Engineer | 010 | [ ] |
| KR-BE-5-012 | Implement worker interface | 1.0d | Backend Architect | 010 | [ ] |
| KR-BE-5-013 | Implement worker claim/heartbeat | 1.5d | Backend Engineer | 012 | [ ] |
| KR-BE-5-014 | Implement execution orchestrator | 2.0d | Execution Engineer | 006,007,009,012 | [ ] |
| KR-BE-5-015 | Implement Lab Agent contract | 1.0d | Protocol Engineer | 014 | [ ] |
| KR-BE-5-016 | Implement simulated Lab Agent | 2.0d | Robotics Engineer | 015 | [ ] |
| KR-BE-5-017 | Implement simulated robot | 2.0d | Robotics Engineer | 016 | [ ] |
| KR-BE-5-018 | Implement sandbox interface | 1.0d | Security Engineer | 016 | [ ] |
| KR-BE-5-019 | Implement filesystem isolation | 1.0d | Security Engineer | 018 | [ ] |
| KR-BE-5-020 | Implement process isolation | 1.0d | Security Engineer | 018 | [ ] |
| KR-BE-5-021 | Implement network policy | 1.0d | Security Engineer | 018 | [ ] |
| KR-BE-5-022 | Implement resource limits | 1.0d | Security Engineer | 018 | [ ] |
| KR-BE-5-023 | Implement sandbox cleanup | 1.0d | Security Engineer | 019-022 | [ ] |
| KR-BE-5-024 | Implement artifact deployment | 1.5d | Execution Engineer | 016,018 | [ ] |
| KR-BE-5-025 | Implement Run startup | 1.5d | Execution Engineer | 024 | [ ] |
| KR-BE-5-026 | Implement graceful stop | 1.0d | Execution Engineer | 025 | [ ] |
| KR-BE-5-027 | Implement cancellation | 1.0d | Backend Engineer | 006,007 | [ ] |
| KR-BE-5-028 | Implement timeout management | 1.5d | Execution Engineer | 025 | [ ] |
| KR-BE-5-029 | Implement failure classification | 1.0d | Backend Engineer | 025,028 | [ ] |
| KR-BE-5-030 | Implement cleanup orchestration | 1.5d | Execution Engineer | 026-029 | [ ] |
| KR-BE-5-031 | Implement execution result handoff | 1.0d | Backend Engineer | 030 | [ ] |
| KR-BE-5-032 | Integrate credit consumption | 1.0d | Financial/Backend Engineer | Phase 4 | [ ] |
| KR-BE-5-033 | Implement execution APIs | 1.5d | API Engineer | 006,007 | [ ] |
| KR-BE-5-034 | Implement execution WebSocket events | 1.0d | API Engineer | 008 | [ ] |
| KR-BE-5-035 | Implement execution audit | 1.0d | Security Engineer | 014 | [ ] |
| KR-BE-5-036 | Implement worker recovery | 1.5d | Platform Engineer | 013,014 | [ ] |
| KR-BE-5-037 | Implement stale claim recovery | 1.0d | Platform Engineer | 036 | [ ] |
| KR-BE-5-038 | Implement dead-letter handling | 1.0d | Platform Engineer | 011 | [ ] |
| KR-BE-5-039 | Implement idempotent start | 1.0d | Execution Engineer | 025 | [ ] |
| KR-BE-5-040 | Implement idempotent stop | 1.0d | Execution Engineer | 026 | [ ] |
| KR-BE-5-041 | Implement execution logs foundation | 1.0d | Backend Engineer | 031 | [ ] |
| KR-BE-5-042 | Implement execution status UI | 1.5d | Frontend Engineer | 033,034 | [ ] |
| KR-BE-5-043 | Implement execution controls UI | 1.0d | Frontend Engineer | 033 | [ ] |
| KR-BE-5-044 | Implement execution history UI | 1.0d | Frontend Engineer | 033 | [ ] |
| KR-BE-5-045 | Add Job lifecycle tests | 1.0d | QA Engineer | 006 | [ ] |
| KR-BE-5-046 | Add Run lifecycle tests | 1.0d | QA Engineer | 007 | [ ] |
| KR-BE-5-047 | Add queue delivery tests | 1.0d | QA Engineer | 010,011 | [ ] |
| KR-BE-5-048 | Add worker recovery tests | 1.0d | QA Engineer | 036,037 | [ ] |
| KR-BE-5-049 | Add sandbox security tests | 1.5d | Security/QA Engineer | 018-023 | [ ] |
| KR-BE-5-050 | Add timeout tests | 1.0d | QA Engineer | 028 | [ ] |
| KR-BE-5-051 | Add cancellation tests | 1.0d | QA Engineer | 027 | [ ] |
| KR-BE-5-052 | Add simulated fault tests | 1.5d | Robotics/QA Engineer | 017,029 | [ ] |
| KR-BE-5-053 | Add credit integration tests | 1.0d | QA Engineer | 032 | [ ] |
| KR-BE-5-054 | Add authorization tests | 1.0d | Security/QA Engineer | 033 | [ ] |
| KR-BE-5-055 | Add tenant isolation tests | 1.0d | Security/QA Engineer | 033 | [ ] |
| KR-BE-5-056 | Add execution E2E tests | 1.5d | QA Engineer | 042-044 | [ ] |
| KR-BE-5-057 | Execute performance baseline | 1.0d | Performance Engineer | 045-056 | [ ] |
| KR-BE-5-058 | Execute security review | 1.0d | Security Architect | 049,054,055 | [ ] |
| KR-BE-5-059 | Execute execution architecture review | 1.0d | System Architect | 001-057 | [ ] |
| KR-BE-5-060 | Complete Phase 5 acceptance | 0.5d | Tech Lead | 058,059 | [ ] |

### 5.2 Indicative effort

Estimated person-days:

    Job/Run domain:                10–14
    Execution orchestration:       12–16
    Simulated Lab/robot:            8–12
    Sandbox/security:               8–12
    Studio integration:             5–8
    Testing/review:                 9–13
    Total:                         52–75 person-days

### 5.3 Definition of Ready

A task is READY when:

- execution contract exists;
- state transition is defined;
- failure semantics are defined;
- authorization is defined;
- timeout behavior is defined;
- cleanup behavior is defined;
- owner is assigned;
- acceptance evidence is identified.

---
