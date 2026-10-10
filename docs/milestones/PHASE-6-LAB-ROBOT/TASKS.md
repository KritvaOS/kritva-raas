# PHASE-6-LAB-ROBOT — Tasks

Milestone: PHASE-6-LAB-ROBOT — Lab Agent, Kritva Runtime and Physical Robot Integration
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-LAB-6-001 | Define Lab Agent architecture | 1.0d | Robotics Architect | Phase 5 | [ ] |
| KR-LAB-6-002 | Define Lab Protocol | 2.0d | Protocol Architect | 001 | [ ] |
| KR-LAB-6-003 | Define Lab Agent identity model | 1.0d | Security Architect | 001 | [ ] |
| KR-LAB-6-004 | Implement Lab Agent bootstrap | 1.5d | Lab Engineer | 003 | [ ] |
| KR-LAB-6-005 | Implement mTLS authentication | 1.5d | Security Engineer | 003 | [ ] |
| KR-LAB-6-006 | Implement registration | 1.0d | Lab Engineer | 004,005 | [ ] |
| KR-LAB-6-007 | Implement heartbeat | 1.0d | Lab Engineer | 006 | [ ] |
| KR-LAB-6-008 | Implement local policy engine | 2.0d | Robotics Engineer | 006 | [ ] |
| KR-LAB-6-009 | Implement resource discovery | 1.5d | Lab Engineer | 008 | [ ] |
| KR-LAB-6-010 | Implement robot discovery | 1.5d | Robotics Engineer | 009 | [ ] |
| KR-LAB-6-011 | Implement safety-state adapter | 2.0d | Safety Engineer | 010 | [ ] |
| KR-LAB-6-012 | Define safety startup conditions | 1.5d | Safety Engineer | 011 | [ ] |
| KR-LAB-6-013 | Define safe-stop procedure | 1.5d | Safety Engineer | 011,012 | [ ] |
| KR-LAB-6-014 | Implement artifact validation | 1.5d | Security Engineer | Phase 2 | [ ] |
| KR-LAB-6-015 | Implement artifact deployment | 1.5d | Lab Engineer | 014 | [ ] |
| KR-LAB-6-016 | Implement Runtime adapter | 2.0d | Runtime Engineer | Phase 5 | [ ] |
| KR-LAB-6-017 | Implement Runtime health monitor | 1.0d | Runtime Engineer | 016 | [ ] |
| KR-LAB-6-018 | Implement Runtime lifecycle control | 1.5d | Runtime Engineer | 016,017 | [ ] |
| KR-LAB-6-019 | Implement robot hardware adapter | 3.0d | Robotics Engineer | 010 | [ ] |
| KR-LAB-6-020 | Implement sensor interfaces | 2.0d | Robotics Engineer | 019 | [ ] |
| KR-LAB-6-021 | Implement actuator interfaces | 2.0d | Robotics Engineer | 019,011 | [ ] |
| KR-LAB-6-022 | Implement simulated-to-physical compatibility layer | 2.0d | Runtime Architect | Phase 5,019 | [ ] |
| KR-LAB-6-023 | Implement telemetry collector | 2.0d | Robotics Engineer | 019,020 | [ ] |
| KR-LAB-6-024 | Implement telemetry buffering | 1.0d | Lab Engineer | 023 | [ ] |
| KR-LAB-6-025 | Implement log collector | 1.5d | Lab Engineer | 016 | [ ] |
| KR-LAB-6-026 | Implement log redaction | 1.0d | Security Engineer | 025 | [ ] |
| KR-LAB-6-027 | Implement result collector | 1.5d | Lab Engineer | Phase 5 | [ ] |
| KR-LAB-6-028 | Implement start command | 1.5d | Lab Engineer | 012,018 | [ ] |
| KR-LAB-6-029 | Implement controlled stop | 1.5d | Lab Engineer | 013,018 | [ ] |
| KR-LAB-6-030 | Implement fault reporting | 1.0d | Lab Engineer | 011,018 | [ ] |
| KR-LAB-6-031 | Implement cloud disconnect policy | 2.0d | Lab Architect | 007,028 | [ ] |
| KR-LAB-6-032 | Implement reconnect reconciliation | 1.5d | Lab Architect | 031 | [ ] |
| KR-LAB-6-033 | Implement Lab Agent restart recovery | 1.5d | Lab Engineer | 032 | [ ] |
| KR-LAB-6-034 | Implement resource reconciliation | 1.0d | Lab Engineer | 032 | [ ] |
| KR-LAB-6-035 | Implement audit events | 1.0d | Security Engineer | 028-034 | [ ] |
| KR-LAB-6-036 | Implement lab status API | 1.0d | API Engineer | 006-010 | [ ] |
| KR-LAB-6-037 | Implement live telemetry API | 1.5d | API Engineer | 023,024 | [ ] |
| KR-LAB-6-038 | Implement physical execution UI | 2.0d | Frontend Engineer | Phase 5 | [ ] |
| KR-LAB-6-039 | Implement safety-state UI | 1.5d | Frontend Engineer | 036,037 | [ ] |
| KR-LAB-6-040 | Implement operator approval UI | 1.0d | Frontend Engineer | 012 | [ ] |
| KR-LAB-6-041 | Integrate selected reference robot | 3.0d | Robotics Engineer | 019-022 | [ ] |
| KR-LAB-6-042 | Establish physical lab network | 2.0d | Lab Engineer | C-M03/C-M04 | [ ] |
| KR-LAB-6-043 | Establish safety test fixture | 2.0d | Safety Engineer | 011-013 | [ ] |
| KR-LAB-6-044 | Establish HIL test procedure | 2.0d | Robotics/Safety Engineer | 041,043 | [ ] |
| KR-LAB-6-045 | Establish controlled physical test procedure | 2.0d | Safety Engineer | 044 | [ ] |
| KR-LAB-6-046 | Add Lab Agent unit tests | 1.5d | QA Engineer | 004-018 | [ ] |
| KR-LAB-6-047 | Add protocol contract tests | 1.5d | QA Engineer | 002 | [ ] |
| KR-LAB-6-048 | Add robot adapter tests | 1.5d | Robotics QA | 019-022 | [ ] |
| KR-LAB-6-049 | Add telemetry tests | 1.0d | QA Engineer | 023,024 | [ ] |
| KR-LAB-6-050 | Add disconnect tests | 1.5d | QA Engineer | 031-034 | [ ] |
| KR-LAB-6-051 | Add safety tests | 2.0d | Safety QA | 011-013,043 | [ ] |
| KR-LAB-6-052 | Add E-stop observation tests | 1.0d | Safety QA | 011 | [ ] |
| KR-LAB-6-053 | Add physical fault tests | 2.0d | Robotics QA | 041,051 | [ ] |
| KR-LAB-6-054 | Add end-to-end physical tests | 2.0d | QA Engineer | 038-045 | [ ] |
| KR-LAB-6-055 | Conduct security review | 1.5d | Security Architect | 003-035 | [ ] |
| KR-LAB-6-056 | Conduct safety review | 2.0d | Safety Architect | 041-054 | [ ] |
| KR-LAB-6-057 | Conduct runtime architecture review | 1.0d | Runtime Architect | 016-022 | [ ] |
| KR-LAB-6-058 | Conduct physical deployment review | 1.0d | System Architect | 054-057 | [ ] |
| KR-LAB-6-059 | Complete Phase 6 evidence package | 1.0d | Tech Lead | 055-058 | [ ] |
| KR-LAB-6-060 | Complete Phase 6 acceptance | 0.5d | Tech Lead | 059 | [ ] |

### 5.2 Indicative effort

Estimated person-days:

    Lab Agent/platform:             12–16
    Runtime integration:             8–12
    Robot integration:              10–16
    Safety integration:              8–12
    Telemetry/log/results:            7–10
    Physical lab setup:               6–10
    Testing/review:                  12–16
    Total:                           63–92 person-days

Safety engineering effort shall not be reduced solely to meet schedule.

### 5.3 Definition of Ready

A physical execution task is READY only when:

- hardware boundary is documented;
- safety boundary is documented;
- local failure behavior is defined;
- cloud disconnect behavior is defined;
- rollback/stop procedure exists;
- test fixture exists;
- operator responsibility is defined;
- acceptance evidence is defined.

---
