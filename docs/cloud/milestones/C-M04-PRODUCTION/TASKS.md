# C-M04-PRODUCTION — Tasks

Milestone: C-M04-PRODUCTION — Production Environment and Go-Live
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-CLD-3-001 | Define Production architecture baseline | 2.0d | Cloud Architect | C-M03 | [ ] |
| KR-CLD-3-002 | Define Production environment contract | 1.0d | Cloud Architect | 001 | [ ] |
| KR-CLD-3-003 | Provision Production account/project | 1.0d | Cloud Engineer | C-M01 | [ ] |
| KR-CLD-3-004 | Provision Production network | 2.0d | Network/Cloud Engineer | 003 | [ ] |
| KR-CLD-3-005 | Configure private service connectivity | 1.5d | Cloud Engineer | 004 | [ ] |
| KR-CLD-3-006 | Configure Production DNS | 1.0d | Cloud Engineer | 003 | [ ] |
| KR-CLD-3-007 | Configure Production TLS | 1.0d | Security/Cloud Engineer | 006 | [ ] |
| KR-CLD-3-008 | Configure Production IAM | 2.0d | Security Engineer | 003 | [ ] |
| KR-CLD-3-009 | Configure Production service identities | 1.5d | Security Engineer | 008 | [ ] |
| KR-CLD-3-010 | Provision redundant API compute | 2.0d | Cloud Engineer | 004,005 | [ ] |
| KR-CLD-3-011 | Configure load balancing | 1.5d | Cloud Engineer | 010 | [ ] |
| KR-CLD-3-012 | Configure API autoscaling | 1.5d | Platform Engineer | 010,011 | [ ] |
| KR-CLD-3-013 | Provision worker compute | 2.0d | Cloud Engineer | 004,005 | [ ] |
| KR-CLD-3-014 | Configure worker autoscaling | 1.5d | Platform Engineer | 013 | [ ] |
| KR-CLD-3-015 | Configure WebSocket infrastructure | 1.5d | Backend/Platform Engineer | 011 | [ ] |
| KR-CLD-3-016 | Provision Production PostgreSQL | 2.5d | Database Engineer | 004,005 | [ ] |
| KR-CLD-3-017 | Configure PostgreSQL HA | 2.0d | Database Engineer | 016 | [ ] |
| KR-CLD-3-018 | Configure database connection pooling | 1.5d | Database Engineer | 016 | [ ] |
| KR-CLD-3-019 | Configure Production migrations | 1.5d | Database/Release Engineer | 016 | [ ] |
| KR-CLD-3-020 | Configure database monitoring | 1.0d | Platform Engineer | 016 | [ ] |
| KR-CLD-3-021 | Configure Production backups | 1.5d | Database Engineer | 016 | [ ] |
| KR-CLD-3-022 | Validate PITR | 2.0d | Database Engineer | 021 | [ ] |
| KR-CLD-3-023 | Provision Production object storage | 1.5d | Cloud Engineer | 004,005 | [ ] |
| KR-CLD-3-024 | Configure artifact storage | 1.0d | Backend Engineer | 023 | [ ] |
| KR-CLD-3-025 | Configure result storage | 1.0d | Backend Engineer | 023 | [ ] |
| KR-CLD-3-026 | Configure object lifecycle | 1.0d | Cloud Engineer | 023 | [ ] |
| KR-CLD-3-027 | Provision Production queue | 1.5d | Cloud Engineer | 004,005 | [ ] |
| KR-CLD-3-028 | Configure queue retry/DLQ | 1.0d | Backend Engineer | 027 | [ ] |
| KR-CLD-3-029 | Configure queue monitoring | 1.0d | Platform Engineer | 027 | [ ] |
| KR-CLD-3-030 | Configure Production secrets | 1.5d | Security Engineer | 008 | [ ] |
| KR-CLD-3-031 | Configure Production KMS | 2.0d | Security Engineer | 030 | [ ] |
| KR-CLD-3-032 | Configure artifact signing integration | 2.0d | Security/Release Engineer | 031 | [ ] |
| KR-CLD-3-033 | Validate Production key isolation | 1.5d | Security Engineer | 031,032 | [ ] |
| KR-CLD-3-034 | Configure Production CI/CD | 2.0d | DevOps Engineer | C-M03 | [ ] |
| KR-CLD-3-035 | Configure release promotion | 1.5d | Release Engineer | 034 | [ ] |
| KR-CLD-3-036 | Configure Production deployment gates | 1.5d | Release Engineer | 035 | [ ] |
| KR-CLD-3-037 | Configure database deployment gates | 1.5d | Database/Release Engineer | 019,036 | [ ] |
| KR-CLD-3-038 | Configure Production rollback | 2.0d | DevOps Engineer | 036,037 | [ ] |
| KR-CLD-3-039 | Configure deployment provenance | 1.0d | Release Engineer | 035 | [ ] |
| KR-CLD-3-040 | Configure Production logs | 1.5d | Platform Engineer | 010,013 | [ ] |
| KR-CLD-3-041 | Configure Production metrics | 1.5d | Platform Engineer | 010,013 | [ ] |
| KR-CLD-3-042 | Configure Production traces | 1.5d | Platform Engineer | 010,013 | [ ] |
| KR-CLD-3-043 | Build Production dashboards | 2.0d | Platform Engineer | 040-042 | [ ] |
| KR-CLD-3-044 | Configure Production alerting | 2.0d | Platform Engineer | 043 | [ ] |
| KR-CLD-3-045 | Configure on-call notifications | 1.5d | Operations Engineer | 044 | [ ] |
| KR-CLD-3-046 | Configure audit monitoring | 1.5d | Security Engineer | 040,041 | [ ] |
| KR-CLD-3-047 | Define Production SLOs | 1.5d | SRE/Cloud Architect | C-M03 | [ ] |
| KR-CLD-3-048 | Define capacity thresholds | 1.5d | SRE | 047 | [ ] |
| KR-CLD-3-049 | Configure cost monitoring | 1.0d | Cloud Engineer | 003 | [ ] |
| KR-CLD-3-050 | Configure budget alerts | 1.0d | Cloud/Finance Owner | 049 | [ ] |
| KR-CLD-3-051 | Provision Production Lab Agent | 1.5d | Robotics Engineer | C-M03 | [ ] |
| KR-CLD-3-052 | Configure Production Lab identity | 1.0d | Security Engineer | 051 | [ ] |
| KR-CLD-3-053 | Establish Production Lab connectivity | 2.0d | Robotics Engineer | 052 | [ ] |
| KR-CLD-3-054 | Validate Production simulator | 1.0d | Robotics Engineer | 053 | [ ] |
| KR-CLD-3-055 | Validate approved physical robot | 2.0d | Robotics/Safety Engineer | 053,054 | [ ] |
| KR-CLD-3-056 | Define Production incident process | 1.5d | Operations Lead | C-M03 | [ ] |
| KR-CLD-3-057 | Define security incident process | 1.5d | Security Lead | 056 | [ ] |
| KR-CLD-3-058 | Define emergency change process | 1.0d | Release Lead | 056 | [ ] |
| KR-CLD-3-059 | Execute HA failure tests | 2.0d | SRE | 010-018 | [ ] |
| KR-CLD-3-060 | Execute scaling tests | 2.0d | SRE/Performance Engineer | 012,014 | [ ] |
| KR-CLD-3-061 | Execute backup/restore test | 2.0d | Database Engineer | 021,022 | [ ] |
| KR-CLD-3-062 | Execute DR rehearsal | 3.0d | SRE/Cloud Architect | 059-061 | [ ] |
| KR-CLD-3-063 | Execute security production-readiness test | 3.0d | Security Engineer | 030-033,046 | [ ] |
| KR-CLD-3-064 | Execute production load test | 2.5d | Performance Engineer | 047,048 | [ ] |
| KR-CLD-3-065 | Execute end-to-end production rehearsal | 2.0d | QA Lead | 051-055 | [ ] |
| KR-CLD-3-066 | Execute go-live rollback rehearsal | 1.5d | Release Engineer | 038,065 | [ ] |
| KR-CLD-3-067 | Prepare Go-Live Checklist | 1.0d | Release Lead | 062-066 | [ ] |
| KR-CLD-3-068 | Conduct Production Readiness Review | 2.0d | Architecture/Release Review | 067 | [ ] |
| KR-CLD-3-069 | Execute controlled go-live | 2.0d | Release/Operations Lead | 068 | [ ] |
| KR-CLD-3-070 | Execute post-go-live stabilization | 3.0d | Operations/SRE | 069 | [ ] |
| KR-CLD-3-071 | Produce Production acceptance report | 1.5d | QA/Release Lead | 070 | [ ] |
| KR-CLD-3-072 | Close C-M04 milestone | 1.0d | Cloud Architect | 071 | [ ] |

### 5.2 Estimation convention

Estimates are person-days.

Tasks may execute in parallel where dependencies permit.

Elapsed calendar duration depends on:

- team size;
- approval latency;
- cloud-provider provisioning;
- security review;
- physical-lab availability;
- release readiness.

### 5.3 Ownership model

| Role | Responsibility |
|---|---|
| Cloud Architect | Production architecture and readiness |
| Cloud Engineer | Infrastructure |
| SRE/Platform Engineer | Reliability, monitoring, scaling |
| Database Engineer | PostgreSQL, HA, backup, recovery |
| Security Engineer | IAM, keys, secrets, security operations |
| DevOps Engineer | CI/CD and deployment |
| Release Engineer | Release and change control |
| Operations Lead | Incident/on-call operations |
| Robotics Engineer | Lab connectivity |
| Safety Engineer | Physical robot safety |
| QA Lead | Production qualification |
| Finance/Business Owner | Cost and commercial controls |

---
