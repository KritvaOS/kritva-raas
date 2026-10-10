# C-M02-DEVELOPMENT — Tasks

Milestone: C-M02-DEVELOPMENT — Shared Development Environment
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-CLD-1-001 | Define Development environment topology and naming | 1.0d | Cloud Architect | C-M01 | [ ] |
| KR-CLD-1-002 | Define Development environment configuration contract | 1.0d | Cloud Engineer | 001 | [ ] |
| KR-CLD-1-003 | Create Development IaC environment module | 2.0d | Cloud Engineer | 001,002 | [ ] |
| KR-CLD-1-004 | Configure Development network segmentation | 2.0d | Cloud Engineer | C-M01 | [ ] |
| KR-CLD-1-005 | Configure private service connectivity | 2.0d | Cloud Engineer | 004 | [ ] |
| KR-CLD-1-006 | Configure Development DNS | 1.0d | Cloud Engineer | C-M01 | [ ] |
| KR-CLD-1-007 | Configure Development TLS | 1.0d | Cloud Engineer | 006 | [ ] |
| KR-CLD-1-008 | Configure Development IAM identities | 2.0d | Security/Cloud Engineer | C-M01 | [ ] |
| KR-CLD-1-009 | Define service identity matrix | 1.0d | Security Engineer | 008 | [ ] |
| KR-CLD-1-010 | Configure Development compute | 2.0d | Cloud Engineer | 003,005 | [ ] |
| KR-CLD-1-011 | Configure API deployment target | 1.5d | Backend/Cloud Engineer | 010 | [ ] |
| KR-CLD-1-012 | Configure worker deployment target | 1.5d | Backend/Cloud Engineer | 010 | [ ] |
| KR-CLD-1-013 | Configure WebSocket-capable application path | 1.5d | Backend/Cloud Engineer | 011 | [ ] |
| KR-CLD-1-014 | Configure health and readiness endpoints | 1.0d | Backend Engineer | 011 | [ ] |
| KR-CLD-1-015 | Provision Development PostgreSQL | 2.0d | Database/Cloud Engineer | 003,005 | [ ] |
| KR-CLD-1-016 | Configure PostgreSQL network restrictions | 1.0d | Database Engineer | 015 | [ ] |
| KR-CLD-1-017 | Configure PostgreSQL credentials | 1.0d | Security Engineer | 008,015 | [ ] |
| KR-CLD-1-018 | Configure PostgreSQL migrations | 2.0d | Backend/Database Engineer | 015 | [ ] |
| KR-CLD-1-019 | Validate Development schema bootstrap | 1.0d | Database Engineer | 018 | [ ] |
| KR-CLD-1-020 | Configure PostgreSQL backup | 1.0d | Database Engineer | 015 | [ ] |
| KR-CLD-1-021 | Validate PostgreSQL restore | 1.5d | Database Engineer | 020 | [ ] |
| KR-CLD-1-022 | Configure Development object storage | 1.5d | Cloud Engineer | 003,005 | [ ] |
| KR-CLD-1-023 | Define object-storage namespaces | 1.0d | Backend/Cloud Engineer | 022 | [ ] |
| KR-CLD-1-024 | Configure object-storage access policy | 1.0d | Security Engineer | 022 | [ ] |
| KR-CLD-1-025 | Validate artifact object flow | 1.5d | Backend Engineer | 023,024 | [ ] |
| KR-CLD-1-026 | Validate result object flow | 1.5d | Backend Engineer | 023,024 | [ ] |
| KR-CLD-1-027 | Configure Development queue | 1.5d | Cloud Engineer | 003,005 | [ ] |
| KR-CLD-1-028 | Configure queue permissions | 1.0d | Security Engineer | 027 | [ ] |
| KR-CLD-1-029 | Configure retry/dead-letter policy | 1.0d | Backend Engineer | 027 | [ ] |
| KR-CLD-1-030 | Validate worker queue flow | 1.5d | Backend Engineer | 012,027,029 | [ ] |
| KR-CLD-1-031 | Configure Development secrets | 1.5d | Security Engineer | C-M01 | [ ] |
| KR-CLD-1-032 | Configure runtime secret injection | 1.5d | Cloud Engineer | 031 | [ ] |
| KR-CLD-1-033 | Validate secret non-exposure | 1.0d | Security Engineer | 032 | [ ] |
| KR-CLD-1-034 | Define CI Development workflow | 1.5d | DevOps Engineer | C-M01 | [ ] |
| KR-CLD-1-035 | Build backend deployment artifact | 1.5d | DevOps Engineer | 034 | [ ] |
| KR-CLD-1-036 | Build frontend deployment artifact | 1.5d | DevOps Engineer | 034 | [ ] |
| KR-CLD-1-037 | Configure automated Development deployment | 2.0d | DevOps Engineer | 035,036 | [ ] |
| KR-CLD-1-038 | Configure migration deployment stage | 1.5d | DevOps/Database Engineer | 018,037 | [ ] |
| KR-CLD-1-039 | Configure post-deployment smoke tests | 1.5d | QA/DevOps Engineer | 037 | [ ] |
| KR-CLD-1-040 | Configure deployment rollback | 2.0d | DevOps Engineer | 037,039 | [ ] |
| KR-CLD-1-041 | Configure deployment evidence | 1.0d | DevOps Engineer | 037 | [ ] |
| KR-CLD-1-042 | Configure application logging | 1.5d | Platform Engineer | 010 | [ ] |
| KR-CLD-1-043 | Configure metrics collection | 1.5d | Platform Engineer | 010 | [ ] |
| KR-CLD-1-044 | Configure distributed tracing | 1.5d | Platform Engineer | 010 | [ ] |
| KR-CLD-1-045 | Configure Development dashboards | 1.5d | Platform Engineer | 042,043,044 | [ ] |
| KR-CLD-1-046 | Configure Development alerts | 1.5d | Platform Engineer | 045 | [ ] |
| KR-CLD-1-047 | Define Development operational SLO targets | 1.0d | Platform Architect | 045 | [ ] |
| KR-CLD-1-048 | Provision Development Lab Agent identity | 1.5d | Security/Robotics Engineer | C-M01 | [ ] |
| KR-CLD-1-049 | Establish Lab Protocol connectivity | 2.0d | Robotics/Backend Engineer | 048 | [ ] |
| KR-CLD-1-050 | Register Development Lab Agent | 1.0d | Robotics Engineer | 049 | [ ] |
| KR-CLD-1-051 | Register simulated Development resource | 1.0d | Robotics Engineer | 050 | [ ] |
| KR-CLD-1-052 | Validate Lab heartbeat | 1.0d | Robotics Engineer | 050 | [ ] |
| KR-CLD-1-053 | Validate artifact deployment to Lab | 1.5d | Robotics/Backend Engineer | 025,050 | [ ] |
| KR-CLD-1-054 | Validate simulated Job/Run execution | 2.0d | Robotics/Backend Engineer | 030,053 | [ ] |
| KR-CLD-1-055 | Validate Lab disconnect/reconnect | 1.5d | Robotics/QA Engineer | 052,054 | [ ] |
| KR-CLD-1-056 | Validate tenant boundary in Development | 2.0d | Security Engineer | 008,015,022 | [ ] |
| KR-CLD-1-057 | Validate service least privilege | 1.5d | Security Engineer | 009,017,024,028 | [ ] |
| KR-CLD-1-058 | Validate cost controls | 1.0d | Cloud Engineer | 003,010,015,022,027 | [ ] |
| KR-CLD-1-059 | Execute end-to-end Development smoke test | 2.0d | QA Lead | 054,055 | [ ] |
| KR-CLD-1-060 | Execute backup/restore evidence test | 1.5d | Database Engineer | 021 | [ ] |
| KR-CLD-1-061 | Produce Development environment runbook | 1.5d | Cloud Engineer | All major infra | [ ] |
| KR-CLD-1-062 | Produce deployment/rollback runbook | 1.5d | DevOps Engineer | 040 | [ ] |
| KR-CLD-1-063 | Produce troubleshooting guide | 1.5d | Platform Engineer | 045,054 | [ ] |
| KR-CLD-1-064 | Complete C-M02 readiness review | 1.0d | Cloud Architect | All | [ ] |

### 5.2 Task status rules

A task shall not move to ACCEPTED merely because infrastructure exists.

A task requires:

- implementation evidence;
- configuration evidence;
- test evidence;
- security evidence where applicable;
- owner confirmation;
- reviewer confirmation.

The status checkbox in this dossier represents planning status only.

### 5.3 Owner roles

| Role | Primary responsibility |
|---|---|
| Cloud Architect | Environment architecture and cross-domain decisions |
| Cloud Engineer | Infrastructure and managed services |
| DevOps Engineer | CI/CD and deployment |
| Backend Engineer | Application integration |
| Database Engineer | PostgreSQL and migrations |
| Security Engineer | IAM, secrets, isolation and security validation |
| Platform Engineer | Observability and runtime platform |
| Robotics Engineer | Lab Agent and robot connectivity |
| QA Lead | End-to-end validation |
| Release Engineer | Release/deployment evidence where applicable |

---
