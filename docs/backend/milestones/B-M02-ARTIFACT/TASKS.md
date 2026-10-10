# B-M02-ARTIFACT — Tasks

Milestone: B-M02 — Artifact
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5 Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-2-001 | Define Artifact domain model | 2d | Architect/Backend | B-M01 | [ ] |
| KR-BE-2-002 | Define artifact versioning model | 1.5d | Architect | 001 | [ ] |
| KR-BE-2-003 | Define `.krv` manifest contract | 2d | Architect/Backend | 001 | [ ] |
| KR-BE-2-004 | Define artifact lifecycle/state machine | 1.5d | Architect | 001 | [ ] |
| KR-BE-2-005 | Define upload-session contract | 2d | Backend | 001,003 | [ ] |
| KR-BE-2-006 | Define validation contract | 2d | Security/Backend | 003,004 | [ ] |
| KR-BE-2-007 | Define signature verification contract | 2d | Security | 003,006 | [ ] |
| KR-BE-2-008 | Define compatibility contract | 2d | Architect/Backend | 003 | [ ] |
| KR-BE-2-009 | Define retention/revocation policy | 2d | Security/Product | 004 | [ ] |
| KR-BE-2-010 | Implement ArtifactRepository | 2.5d | Backend/Database | 001 | [ ] |
| KR-BE-2-011 | Implement ArtifactVersionRepository | 2.5d | Backend/Database | 002 | [ ] |
| KR-BE-2-012 | Implement UploadSessionRepository | 2d | Backend | 005 | [ ] |
| KR-BE-2-013 | Implement ArtifactService | 3d | Backend | 010,011 | [ ] |
| KR-BE-2-014 | Implement UploadService | 3d | Backend/Cloud | 012 | [ ] |
| KR-BE-2-015 | Implement object-storage adapter | 3d | Cloud/Backend | B-M01 | [ ] |
| KR-BE-2-016 | Implement manifest parser | 2.5d | Backend | 003 | [ ] |
| KR-BE-2-017 | Implement structural validator | 3d | Backend/Security | 016 | [ ] |
| KR-BE-2-018 | Implement checksum validator | 2d | Backend/Security | 014,017 | [ ] |
| KR-BE-2-019 | Implement signature verifier | 3d | Security/Backend | 007 | [ ] |
| KR-BE-2-020 | Implement security scanner adapter | 3d | Security | 006 | [ ] |
| KR-BE-2-021 | Implement compatibility validator | 3d | Backend | 008 | [ ] |
| KR-BE-2-022 | Implement approval service | 2d | Backend/Security | 018-021 | [ ] |
| KR-BE-2-023 | Implement revocation service | 2d | Backend/Security | 022 | [ ] |
| KR-BE-2-024 | Implement retention service | 2.5d | Backend/Cloud | 009,015 | [ ] |
| KR-BE-2-025 | Implement artifact access policy | 2d | Security/Backend | B-M01 | [ ] |
| KR-BE-2-026 | Implement artifact APIs | 3d | Backend | 013,025 | [ ] |
| KR-BE-2-027 | Implement upload APIs | 2.5d | Backend | 014 | [ ] |
| KR-BE-2-028 | Implement validation status APIs | 2d | Backend | 022 | [ ] |
| KR-BE-2-029 | Implement compatibility APIs | 2d | Backend | 021 | [ ] |
| KR-BE-2-030 | Implement artifact download metadata/API | 2d | Backend | 026 | [ ] |
| KR-BE-2-031 | Implement artifact audit events | 2d | Security/Backend | 022-024 | [ ] |
| KR-BE-2-032 | Implement artifact idempotency | 2d | Backend | B-M01 | [ ] |
| KR-BE-2-033 | Implement artifact reconciliation | 2.5d | Backend/Cloud | 015,024 | [ ] |
| KR-BE-2-034 | Add artifact repository tests | 2.5d | QA | 010-015 | [ ] |
| KR-BE-2-035 | Add manifest validation tests | 2d | QA/Security | 016,017 | [ ] |
| KR-BE-2-036 | Add checksum tests | 1.5d | QA | 018 | [ ] |
| KR-BE-2-037 | Add signature tests | 2.5d | Security/QA | 019 | [ ] |
| KR-BE-2-038 | Add compatibility tests | 2.5d | QA | 021 | [ ] |
| KR-BE-2-039 | Add access-control tests | 2.5d | Security/QA | 025,026 | [ ] |
| KR-BE-2-040 | Add retention tests | 2d | QA | 024 | [ ] |
| KR-BE-2-041 | Add revocation tests | 2d | Security/QA | 023 | [ ] |
| KR-BE-2-042 | Add tenant-isolation tests | 2d | Security/QA | 025 | [ ] |
| KR-BE-2-043 | Add upload integration tests | 3d | QA | 027,034-038 | [ ] |
| KR-BE-2-044 | Add artifact E2E tests | 3d | QA | 026-033 | [ ] |
| KR-BE-2-045 | Add object-storage failure tests | 2d | QA/Cloud | 015,033 | [ ] |
| KR-BE-2-046 | Add security scanning tests | 2d | Security/QA | 020 | [ ] |
| KR-BE-2-047 | Add execution-readiness tests | 2d | QA | 022,028,029 | [ ] |
| KR-BE-2-048 | Performance/load baseline | 2d | QA/Backend | 044 | [ ] |
| KR-BE-2-049 | Security review | 3d | Security | 017-031 | [ ] |
| KR-BE-2-050 | Architecture review | 2d | Architect | All | [ ] |
| KR-BE-2-051 | Documentation update | 1.5d | Documentation | All | [ ] |
| KR-BE-2-052 | Milestone acceptance/evidence | 1d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Task Dependency Flow

    Domain Model
         |
         +--> Manifest
         |
         +--> Lifecycle
         |
         +--> Versioning
         |
         v
    Repositories
         |
         v
    Upload
         |
         v
    Validation
         |
         +--> Checksum
         +--> Signature
         +--> Security
         +--> Compatibility
         |
         v
    Approval
         |
         +--> Retention
         +--> Revocation
         |
         v
    Execution Ready
         |
         v
    Future Job Service

## 5.3 Ownership

Backend owns artifact business implementation.

Security owns:

- signing policy;
- verification;
- scanning;
- trust;
- revocation policy.

Cloud engineering owns object-storage adapter and infrastructure integration.

Database engineering owns artifact schema and migration quality.

QA independently verifies lifecycle and security behavior.

Architecture owns cross-domain consistency.

---
