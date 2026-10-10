# DB-M02-CORE-DATA — Tasks

Milestone: DB-M02-CORE-DATA — Platforms, Resources, Artifacts and Storage Metadata
Source of scope: [MILESTONE.md](MILESTONE.md)

## 5 Detailed task breakdown

### 5.1 Task register

| ID | Description | Estimate | Owner role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-DB-1-001 | Review DB-M01 foundation | 0.5d | Database Architect | DB-M01 | [ ] |
| KR-DB-1-002 | Confirm platform data model | 1.0d | Database Architect | 001 | [ ] |
| KR-DB-1-003 | Implement platform schema | 1.0d | Database Engineer | 002 | [ ] |
| KR-DB-1-004 | Implement platforms table | 1.0d | Database Engineer | 003 | [ ] |
| KR-DB-1-005 | Implement architectures table | 0.75d | Database Engineer | 003 | [ ] |
| KR-DB-1-006 | Implement platform versions table | 1.5d | Database Engineer | 004,005 | [ ] |
| KR-DB-1-007 | Implement capabilities table | 1.0d | Database Engineer | 003 | [ ] |
| KR-DB-1-008 | Implement capability mappings | 1.0d | Database Engineer | 006,007 | [ ] |
| KR-DB-1-009 | Implement platform configurations | 1.5d | Database Engineer | 006 | [ ] |
| KR-DB-1-010 | Implement platform indexes | 1.0d | Database Engineer | 004-009 | [ ] |
| KR-DB-1-011 | Implement platform lifecycle constraints | 1.0d | Database Engineer | 004-009 | [ ] |
| KR-DB-1-012 | Confirm Lab data model | 1.0d | Database Architect | 001 | [ ] |
| KR-DB-1-013 | Implement lab schema | 1.0d | Database Engineer | 012 | [ ] |
| KR-DB-1-014 | Implement labs table | 1.0d | Database Engineer | 013 | [ ] |
| KR-DB-1-015 | Implement robots table | 1.5d | Database Engineer | 014 | [ ] |
| KR-DB-1-016 | Implement resources table | 1.5d | Database Engineer | 015 | [ ] |
| KR-DB-1-017 | Implement maintenance windows | 1.0d | Database Engineer | 016 | [ ] |
| KR-DB-1-018 | Implement availability windows | 1.0d | Database Engineer | 016 | [ ] |
| KR-DB-1-019 | Implement lab/resource indexes | 1.0d | Database Engineer | 014-018 | [ ] |
| KR-DB-1-020 | Implement resource integrity constraints | 1.0d | Database Engineer | 015,016 | [ ] |
| KR-DB-1-021 | Confirm artifact data model | 1.0d | Database Architect | 001 | [ ] |
| KR-DB-1-022 | Implement artifact schema | 1.0d | Database Engineer | 021 | [ ] |
| KR-DB-1-023 | Implement builds table | 1.0d | Database Engineer | 022 | [ ] |
| KR-DB-1-024 | Implement artifacts table | 1.5d | Database Engineer | 022,023 | [ ] |
| KR-DB-1-025 | Implement artifact versions | 1.5d | Database Engineer | 024 | [ ] |
| KR-DB-1-026 | Implement storage objects | 1.5d | Database Engineer | 025 | [ ] |
| KR-DB-1-027 | Implement validation records | 1.0d | Database Engineer | 025 | [ ] |
| KR-DB-1-028 | Implement signature records | 1.0d | Security/DB Engineer | 025 | [ ] |
| KR-DB-1-029 | Implement compatibility records | 1.5d | Database Engineer | 006,025 | [ ] |
| KR-DB-1-030 | Implement retention policies | 1.5d | Database Engineer | 026 | [ ] |
| KR-DB-1-031 | Implement artifact indexes | 1.5d | Database Engineer | 023-030 | [ ] |
| KR-DB-1-032 | Implement storage consistency constraints | 1.0d | Database Engineer | 026 | [ ] |
| KR-DB-1-033 | Implement RLS policies for tenant artifacts | 1.5d | Security/DB Engineer | DB-M01,024 | [ ] |
| KR-DB-1-034 | Implement audit integration | 1.0d | Backend/DB Engineer | DB-M01,024 | [ ] |
| KR-DB-1-035 | Define artifact retention lifecycle | 1.0d | Database Architect | 030 | [ ] |
| KR-DB-1-036 | Define object deletion protocol | 1.0d | Storage Engineer | 030,035 | [ ] |
| KR-DB-1-037 | Implement repositories | 2.0d | Backend Engineer | 004-036 | [ ] |
| KR-DB-1-038 | Add migration tests | 1.0d | QA/DB Engineer | 003-036 | [ ] |
| KR-DB-1-039 | Add platform query tests | 1.0d | QA Engineer | 010 | [ ] |
| KR-DB-1-040 | Add resource query tests | 1.0d | QA Engineer | 019 | [ ] |
| KR-DB-1-041 | Add artifact lifecycle tests | 1.5d | QA Engineer | 031,035 | [ ] |
| KR-DB-1-042 | Add storage consistency tests | 1.0d | QA Engineer | 032,036 | [ ] |
| KR-DB-1-043 | Add retention tests | 1.0d | QA Engineer | 035 | [ ] |
| KR-DB-1-044 | Add tenant isolation tests | 1.5d | Security/QA Engineer | 033 | [ ] |
| KR-DB-1-045 | Add index/query-plan validation | 1.5d | Database Engineer | 010,019,031 | [ ] |
| KR-DB-1-046 | Validate schema documentation | 1.0d | Database Engineer | 037-045 | [ ] |
| KR-DB-1-047 | Complete DB-M02 architecture review | 1.0d | Database Architect | 046 | [ ] |

### 5.2 Estimation convention

Estimates are person-days.

Parallel execution is permitted when dependencies are satisfied.

### 5.3 Status lifecycle

Tasks follow:

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

### 5.4 Evidence requirements

Each accepted task shall retain:

- implementation commit;
- migration version;
- test evidence;
- reviewer;
- documentation update;
- acceptance result.

---
