# B-M07-PRODUCTION — Tasks

Milestone: B-M07 — Production
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5 Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-7-001 | Production architecture review | 3d | Architect | B-M01-B-M06 | [ ] |
| KR-BE-7-002 | Define production SLO/SLA baseline | 2d | Architect/SRE | 001 | [ ] |
| KR-BE-7-003 | Harden authentication | 3d | Security/Backend | B-M01 | [ ] |
| KR-BE-7-004 | Harden authorization | 3d | Security/Backend | B-M01 | [ ] |
| KR-BE-7-005 | Implement tenant isolation controls | 4d | Security/Backend | 004 | [ ] |
| KR-BE-7-006 | Complete tenant isolation tests | 3d | Security/QA | 005 | [ ] |
| KR-BE-7-007 | API rate limiting | 2.5d | Backend/SRE | 003 | [ ] |
| KR-BE-7-008 | Request/input hardening | 3d | Backend/Security | 003,004 | [ ] |
| KR-BE-7-009 | Upload/download hardening | 2.5d | Backend/Security | B-M02,B-M06 | [ ] |
| KR-BE-7-010 | Security headers/CORS policy | 2d | Backend/Security | 003 | [ ] |
| KR-BE-7-011 | Production secret-provider integration | 3d | Security/SRE | Security docs | [ ] |
| KR-BE-7-012 | Production key-management integration | 3d | Security/SRE | 011 | [ ] |
| KR-BE-7-013 | Artifact-signing production path | 3d | Security/Backend | 012,B-M02 | [ ] |
| KR-BE-7-014 | Token-signing key isolation | 2d | Security | 012 | [ ] |
| KR-BE-7-015 | Database hardening | 3d | DBA/SRE | B-M01 | [ ] |
| KR-BE-7-016 | Object-storage hardening | 3d | SRE/Security | B-M02,B-M06 | [ ] |
| KR-BE-7-017 | Network segmentation | 3d | Cloud/SRE | 001 | [ ] |
| KR-BE-7-018 | Lab connectivity hardening | 3d | Cloud/Robotics | B-M06 | [ ] |
| KR-BE-7-019 | Audit logging completion | 3d | Security/Backend | B-M01-B-M06 | [ ] |
| KR-BE-7-020 | Audit retention/tamper controls | 3d | Security/SRE | 019 | [ ] |
| KR-BE-7-021 | Structured logging baseline | 2d | Backend/SRE | 001 | [ ] |
| KR-BE-7-022 | Metrics instrumentation | 3d | Backend/SRE | 021 | [ ] |
| KR-BE-7-023 | Distributed tracing | 3d | Backend/SRE | 021 | [ ] |
| KR-BE-7-024 | Production dashboards | 3d | SRE | 022,023 | [ ] |
| KR-BE-7-025 | Alerting rules | 3d | SRE | 024 | [ ] |
| KR-BE-7-026 | Liveness/readiness endpoints | 2d | Backend/SRE | 021 | [ ] |
| KR-BE-7-027 | Error-budget monitoring | 2d | SRE | 002,024 | [ ] |
| KR-BE-7-028 | PostgreSQL HA deployment | 4d | DBA/SRE | 015 | [ ] |
| KR-BE-7-029 | PostgreSQL connection budgeting | 2d | DBA/Backend | 028 | [ ] |
| KR-BE-7-030 | PostgreSQL query/index review | 4d | DBA/Backend | 028 | [ ] |
| KR-BE-7-031 | Database backup/PITR | 3d | DBA/SRE | 028 | [ ] |
| KR-BE-7-032 | Database restore validation | 3d | DBA/SRE | 031 | [ ] |
| KR-BE-7-033 | Object-storage recovery | 2.5d | SRE | 016 | [ ] |
| KR-BE-7-034 | Queue HA/resilience | 3d | SRE/Backend | B-M05 | [ ] |
| KR-BE-7-035 | Worker resilience | 3d | Backend/SRE | 034 | [ ] |
| KR-BE-7-036 | WebSocket scaling | 3d | Backend/SRE | B-M06 | [ ] |
| KR-BE-7-037 | WebSocket reconnect/sequence qualification | 2.5d | QA | 036 | [ ] |
| KR-BE-7-038 | API horizontal scaling | 3d | SRE | 021,026 | [ ] |
| KR-BE-7-039 | Autoscaling policy | 3d | SRE | 038 | [ ] |
| KR-BE-7-040 | Capacity model | 4d | SRE/Architect | 028-039 | [ ] |
| KR-BE-7-041 | API performance test | 3d | QA/SRE | 040 | [ ] |
| KR-BE-7-042 | Booking contention test | 3d | QA/Backend | 040 | [ ] |
| KR-BE-7-043 | Credit transaction load test | 3d | QA/Backend | 040 | [ ] |
| KR-BE-7-044 | Execution load test | 4d | QA/Robotics | 040 | [ ] |
| KR-BE-7-045 | Result/telemetry load test | 4d | QA/Data | B-M06,040 | [ ] |
| KR-BE-7-046 | Soak test | 5d | QA/SRE | 041-045 | [ ] |
| KR-BE-7-047 | Failure-injection test | 4d | QA/SRE | 034-039 | [ ] |
| KR-BE-7-048 | Disaster recovery drill | 4d | SRE/DBA | 031-033 | [ ] |
| KR-BE-7-049 | RPO/RTO measurement | 2d | SRE | 048 | [ ] |
| KR-BE-7-050 | Incident response runbooks | 3d | SRE/Security | 024,025 | [ ] |
| KR-BE-7-051 | Security incident runbook | 2d | Security | 019,025 | [ ] |
| KR-BE-7-052 | Vulnerability management pipeline | 3d | Security/CI | CI | [ ] |
| KR-BE-7-053 | Dependency/license scanning | 2d | Security/CI | 052 | [ ] |
| KR-BE-7-054 | Container/build hardening | 3d | Build/SRE | 052 | [ ] |
| KR-BE-7-055 | SBOM generation | 2d | Security/Build | 054 | [ ] |
| KR-BE-7-056 | Supply-chain provenance | 3d | Security/Build | 055 | [ ] |
| KR-BE-7-057 | CI production gates | 3d | Build/SRE | 052-056 | [ ] |
| KR-BE-7-058 | Migration qualification | 3d | DBA/QA | 030 | [ ] |
| KR-BE-7-059 | Production deployment automation | 4d | SRE | 057,058 | [ ] |
| KR-BE-7-060 | Rollback automation | 3d | SRE | 059 | [ ] |
| KR-BE-7-061 | Release evidence generation | 2d | Release/SRE | 059 | [ ] |
| KR-BE-7-062 | Staging parity review | 3d | SRE/Architect | 059 | [ ] |
| KR-BE-7-063 | Compliance control mapping | 4d | Security/Compliance | 019-020 | [ ] |
| KR-BE-7-064 | Data retention review | 3d | Security/Data | B-M06 | [ ] |
| KR-BE-7-065 | Privacy/data-classification review | 3d | Security | 063,064 | [ ] |
| KR-BE-7-066 | Operational readiness review | 3d | SRE/Architect | All | [ ] |
| KR-BE-7-067 | Production security review | 4d | Security | All | [ ] |
| KR-BE-7-068 | Production architecture sign-off | 2d | Architect | 001-067 | [ ] |
| KR-BE-7-069 | Release candidate qualification | 4d | QA/Release | 057-068 | [ ] |
| KR-BE-7-070 | Production readiness evidence pack | 3d | Release/SRE | 069 | [ ] |
| KR-BE-7-071 | Go-live rehearsal | 3d | SRE/Release | 069,070 | [ ] |
| KR-BE-7-072 | Final milestone acceptance | 1d | Architect/Product | All | [ ] |

Estimates are engineering-day estimates for planning and must be refined during
task definition.

---
