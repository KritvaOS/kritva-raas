# C-M03-STAGING — Tasks

Milestone: C-M03-STAGING — Production-Parity Staging Environment
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-CLD-2-001 | Define Staging production-parity architecture | 1.5d | Cloud Architect | C-M02 | [ ] |
| KR-CLD-2-002 | Define Staging environment contract | 1.0d | Cloud Architect | 001 | [ ] |
| KR-CLD-2-003 | Create Staging IaC environment | 2.0d | Cloud Engineer | 001,002 | [ ] |
| KR-CLD-2-004 | Validate network parity with Production design | 1.5d | Network Engineer | 003 | [ ] |
| KR-CLD-2-005 | Configure Staging private connectivity | 1.5d | Cloud Engineer | 004 | [ ] |
| KR-CLD-2-006 | Configure Staging DNS/TLS | 1.0d | Cloud Engineer | 003 | [ ] |
| KR-CLD-2-007 | Configure Staging IAM | 1.5d | Security Engineer | 003 | [ ] |
| KR-CLD-2-008 | Configure Staging service identities | 1.0d | Security Engineer | 007 | [ ] |
| KR-CLD-2-009 | Provision Staging compute | 2.0d | Cloud Engineer | 003,005 | [ ] |
| KR-CLD-2-010 | Deploy Staging API | 1.5d | DevOps Engineer | 009 | [ ] |
| KR-CLD-2-011 | Deploy Staging workers | 1.5d | DevOps Engineer | 009 | [ ] |
| KR-CLD-2-012 | Configure Staging WebSocket path | 1.5d | Backend Engineer | 010 | [ ] |
| KR-CLD-2-013 | Provision Staging PostgreSQL | 2.0d | Database Engineer | 003,005 | [ ] |
| KR-CLD-2-014 | Configure database parity parameters | 1.5d | Database Engineer | 013 | [ ] |
| KR-CLD-2-015 | Configure Staging database migrations | 1.5d | Database Engineer | 013 | [ ] |
| KR-CLD-2-016 | Load representative synthetic dataset | 1.5d | QA/Database Engineer | 015 | [ ] |
| KR-CLD-2-017 | Configure database backup | 1.0d | Database Engineer | 013 | [ ] |
| KR-CLD-2-018 | Validate database restore | 1.5d | Database Engineer | 017 | [ ] |
| KR-CLD-2-019 | Provision Staging object storage | 1.5d | Cloud Engineer | 003,005 | [ ] |
| KR-CLD-2-020 | Configure artifact storage | 1.0d | Backend Engineer | 019 | [ ] |
| KR-CLD-2-021 | Configure result storage | 1.0d | Backend Engineer | 019 | [ ] |
| KR-CLD-2-022 | Validate object-storage isolation | 1.0d | Security Engineer | 019 | [ ] |
| KR-CLD-2-023 | Provision Staging queue | 1.5d | Cloud Engineer | 003,005 | [ ] |
| KR-CLD-2-024 | Configure retry/dead-letter behavior | 1.0d | Backend Engineer | 023 | [ ] |
| KR-CLD-2-025 | Validate queue durability | 1.0d | QA Engineer | 023,024 | [ ] |
| KR-CLD-2-026 | Configure Staging secrets | 1.0d | Security Engineer | 007 | [ ] |
| KR-CLD-2-027 | Configure Staging KMS integration | 1.5d | Security Engineer | 026 | [ ] |
| KR-CLD-2-028 | Validate key/secret isolation | 1.0d | Security Engineer | 027 | [ ] |
| KR-CLD-2-029 | Configure release promotion pipeline | 2.0d | DevOps Engineer | C-M02 | [ ] |
| KR-CLD-2-030 | Configure Staging deployment gates | 1.5d | Release Engineer | 029 | [ ] |
| KR-CLD-2-031 | Configure database migration gate | 1.5d | Database/Release Engineer | 015,030 | [ ] |
| KR-CLD-2-032 | Configure post-deployment qualification | 1.5d | QA/DevOps Engineer | 030 | [ ] |
| KR-CLD-2-033 | Configure rollback pipeline | 1.5d | DevOps Engineer | 030,032 | [ ] |
| KR-CLD-2-034 | Configure release provenance | 1.0d | Release Engineer | 029 | [ ] |
| KR-CLD-2-035 | Configure Staging observability | 2.0d | Platform Engineer | 009,010,011 | [ ] |
| KR-CLD-2-036 | Configure SLO/performance dashboards | 1.5d | Platform Engineer | 035 | [ ] |
| KR-CLD-2-037 | Configure Staging alerts | 1.5d | Platform Engineer | 036 | [ ] |
| KR-CLD-2-038 | Configure audit-log validation | 1.5d | Security Engineer | 035 | [ ] |
| KR-CLD-2-039 | Provision Staging Lab Agent | 1.5d | Robotics Engineer | C-M02 | [ ] |
| KR-CLD-2-040 | Configure Lab Agent identity | 1.0d | Security Engineer | 039 | [ ] |
| KR-CLD-2-041 | Establish Lab Protocol connectivity | 2.0d | Robotics Engineer | 040 | [ ] |
| KR-CLD-2-042 | Register Staging simulator | 1.0d | Robotics Engineer | 041 | [ ] |
| KR-CLD-2-043 | Validate artifact deployment to Lab | 1.5d | Robotics Engineer | 020,042 | [ ] |
| KR-CLD-2-044 | Validate Job/Run execution | 2.0d | Robotics Engineer | 043 | [ ] |
| KR-CLD-2-045 | Validate reconnect behavior | 1.5d | QA/Robotics Engineer | 044 | [ ] |
| KR-CLD-2-046 | Prepare performance workloads | 2.0d | Performance Engineer | C-M02 | [ ] |
| KR-CLD-2-047 | Execute API load test | 2.0d | Performance Engineer | 046 | [ ] |
| KR-CLD-2-048 | Execute database load test | 1.5d | Performance Engineer | 046 | [ ] |
| KR-CLD-2-049 | Execute queue/worker load test | 1.5d | Performance Engineer | 046 | [ ] |
| KR-CLD-2-050 | Execute artifact/result load test | 1.5d | Performance Engineer | 046 | [ ] |
| KR-CLD-2-051 | Execute WebSocket/load test | 1.5d | Performance Engineer | 046 | [ ] |
| KR-CLD-2-052 | Execute concurrent execution test | 2.0d | Performance Engineer | 049,051 | [ ] |
| KR-CLD-2-053 | Analyze performance bottlenecks | 2.0d | Performance Engineer | 047-052 | [ ] |
| KR-CLD-2-054 | Execute security test suite | 3.0d | Security Engineer | 010-028 | [ ] |
| KR-CLD-2-055 | Execute tenant-isolation tests | 2.0d | Security Engineer | 054 | [ ] |
| KR-CLD-2-056 | Execute artifact-security tests | 1.5d | Security Engineer | 020,054 | [ ] |
| KR-CLD-2-057 | Execute network-exposure tests | 1.5d | Security Engineer | 004,005 | [ ] |
| KR-CLD-2-058 | Execute dependency/image security scans | 1.0d | Security Engineer | 029 | [ ] |
| KR-CLD-2-059 | Prepare DR rehearsal scenario | 1.5d | Cloud Architect | 018,029 | [ ] |
| KR-CLD-2-060 | Execute PostgreSQL recovery rehearsal | 2.0d | Database Engineer | 059 | [ ] |
| KR-CLD-2-061 | Execute application recovery rehearsal | 2.0d | Cloud/DevOps Engineer | 059 | [ ] |
| KR-CLD-2-062 | Execute object-storage recovery validation | 1.5d | Cloud Engineer | 059 | [ ] |
| KR-CLD-2-063 | Execute queue recovery validation | 1.5d | Backend/Cloud Engineer | 059 | [ ] |
| KR-CLD-2-064 | Execute Lab connectivity recovery | 1.5d | Robotics Engineer | 059 | [ ] |
| KR-CLD-2-065 | Measure RPO/RTO | 1.0d | Cloud Architect | 060-064 | [ ] |
| KR-CLD-2-066 | Execute full release-candidate E2E test | 2.0d | QA Lead | 032,044 | [ ] |
| KR-CLD-2-067 | Execute rollback rehearsal | 1.5d | Release Engineer | 033,066 | [ ] |
| KR-CLD-2-068 | Execute resilience/failure-injection suite | 2.0d | QA/Platform Engineer | 035,044 | [ ] |
| KR-CLD-2-069 | Compile Staging qualification report | 2.0d | QA Lead | 053-068 | [ ] |
| KR-CLD-2-070 | Conduct Production-readiness review | 1.5d | Architecture/Release Review | 069 | [ ] |

### 5.2 Task estimation convention

Estimates are engineering effort in person-days.

They are planning estimates, not elapsed calendar duration.

Tasks may execute in parallel where dependencies permit.

### 5.3 Ownership

Each task must have:

- one accountable owner;
- identified reviewers;
- evidence location;
- dependency status;
- acceptance result.

No task shall be accepted solely because the infrastructure resource exists.

---
