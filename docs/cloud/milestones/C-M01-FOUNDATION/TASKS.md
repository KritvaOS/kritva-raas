# C-M01-FOUNDATION — Tasks

Milestone: C-M01 — Cloud Foundation
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5 Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-CLD-0-001 | Define cloud account/project hierarchy | 2d | Cloud Architect | Architecture | [ ] |
| KR-CLD-0-002 | Define environment isolation model | 2d | Cloud Architect | 001 | [ ] |
| KR-CLD-0-003 | Define resource naming/tagging | 1d | Cloud/SRE | 002 | [ ] |
| KR-CLD-0-004 | Select IaC framework and repository layout | 2d | Cloud Architect | 001-003 | [ ] |
| KR-CLD-0-005 | Bootstrap IaC state storage | 2d | Cloud/SRE | 004 | [ ] |
| KR-CLD-0-006 | Implement Dev IaC baseline | 3d | Cloud Engineer | 005 | [ ] |
| KR-CLD-0-007 | Implement Staging IaC baseline | 3d | Cloud Engineer | 006 | [ ] |
| KR-CLD-0-008 | Implement Production IaC baseline | 4d | Cloud Engineer | 007 | [ ] |
| KR-CLD-0-009 | Implement network foundation | 4d | Network/Cloud | 006 | [ ] |
| KR-CLD-0-010 | Implement subnet segmentation | 3d | Network/Cloud | 009 | [ ] |
| KR-CLD-0-011 | Implement routing/firewall policy | 3d | Network/Cloud | 010 | [ ] |
| KR-CLD-0-012 | Implement outbound/egress policy | 2d | Network/Security | 011 | [ ] |
| KR-CLD-0-013 | Implement DNS foundation | 2d | Cloud/SRE | 009 | [ ] |
| KR-CLD-0-014 | Implement TLS/certificate foundation | 3d | Cloud/Security | 013 | [ ] |
| KR-CLD-0-015 | Define IAM role model | 3d | Security/Cloud | 002 | [ ] |
| KR-CLD-0-016 | Implement human administrative roles | 2d | Security/Cloud | 015 | [ ] |
| KR-CLD-0-017 | Implement CI/CD identity | 3d | Security/CI | 015 | [ ] |
| KR-CLD-0-018 | Implement workload identities | 3d | Security/Cloud | 015 | [ ] |
| KR-CLD-0-019 | Implement Lab identity foundation | 2d | Security/Robotics | 018 | [ ] |
| KR-CLD-0-020 | Implement secret-store integration | 3d | Security/Cloud | 018 | [ ] |
| KR-CLD-0-021 | Implement KMS integration boundary | 3d | Security/Cloud | 020 | [ ] |
| KR-CLD-0-022 | Implement environment-specific secrets | 2d | Security/Cloud | 020 | [ ] |
| KR-CLD-0-023 | Implement cloud audit logging | 3d | Security/SRE | 015 | [ ] |
| KR-CLD-0-024 | Implement infrastructure logging | 2d | SRE | 023 | [ ] |
| KR-CLD-0-025 | Implement base metrics | 3d | SRE | 024 | [ ] |
| KR-CLD-0-026 | Implement base dashboards | 3d | SRE | 025 | [ ] |
| KR-CLD-0-027 | Implement base alerts | 3d | SRE | 026 | [ ] |
| KR-CLD-0-028 | Implement health monitoring | 2d | SRE | 025 | [ ] |
| KR-CLD-0-029 | Implement billing/cost tagging | 2d | Cloud/SRE | 003 | [ ] |
| KR-CLD-0-030 | Implement budget alerts | 2d | Cloud/SRE | 029 | [ ] |
| KR-CLD-0-031 | Implement PostgreSQL foundation | 4d | DBA/Cloud | 006-008 | [ ] |
| KR-CLD-0-032 | Implement object-storage foundation | 3d | Cloud/SRE | 006-008 | [ ] |
| KR-CLD-0-033 | Implement queue foundation | 3d | Cloud/SRE | 006-008 | [ ] |
| KR-CLD-0-034 | Implement application compute substrate | 4d | Cloud/SRE | 009-012 | [ ] |
| KR-CLD-0-035 | Implement worker compute substrate | 3d | Cloud/SRE | 034 | [ ] |
| KR-CLD-0-036 | Implement secure lab connectivity boundary | 4d | Cloud/Robotics | 009-012 | [ ] |
| KR-CLD-0-037 | Implement backup baseline | 3d | DBA/SRE | 031-033 | [ ] |
| KR-CLD-0-038 | Implement infrastructure recovery procedure | 3d | SRE | 005-037 | [ ] |
| KR-CLD-0-039 | Implement CI IaC validation | 2d | CI/Cloud | 004 | [ ] |
| KR-CLD-0-040 | Implement IaC plan pipeline | 2d | CI/Cloud | 039 | [ ] |
| KR-CLD-0-041 | Implement Development apply pipeline | 2d | CI/Cloud | 040 | [ ] |
| KR-CLD-0-042 | Implement Staging promotion | 3d | CI/Release | 041 | [ ] |
| KR-CLD-0-043 | Implement Production approval gate | 3d | CI/Release | 042 | [ ] |
| KR-CLD-0-044 | Implement infrastructure drift detection | 3d | Cloud/SRE | 040 | [ ] |
| KR-CLD-0-045 | Implement IaC security scanning | 2d | Security/CI | 039 | [ ] |
| KR-CLD-0-046 | Implement dependency/image scanning foundation | 2d | Security/CI | 039 | [ ] |
| KR-CLD-0-047 | Implement environment configuration registry | 2d | Cloud/SRE | 020 | [ ] |
| KR-CLD-0-048 | Define cloud operational runbooks | 3d | SRE | 023-047 | [ ] |
| KR-CLD-0-049 | Define access review process | 2d | Security | 015-023 | [ ] |
| KR-CLD-0-050 | Define cloud incident response | 3d | Security/SRE | 023-027 | [ ] |
| KR-CLD-0-051 | Define cost review process | 2d | SRE/Finance | 029-030 | [ ] |
| KR-CLD-0-052 | Development foundation verification | 2d | QA/Cloud | 006-051 | [ ] |
| KR-CLD-0-053 | Staging foundation verification | 3d | QA/Cloud | 007-051 | [ ] |
| KR-CLD-0-054 | Production foundation verification | 3d | QA/SRE | 008-051 | [ ] |
| KR-CLD-0-055 | Security review | 3d | Security | 015-050 | [ ] |
| KR-CLD-0-056 | Architecture review | 2d | Architect | 001-054 | [ ] |
| KR-CLD-0-057 | Operational readiness review | 2d | SRE | 048-054 | [ ] |
| KR-CLD-0-058 | Final evidence pack | 2d | Release/SRE | 055-057 | [ ] |
| KR-CLD-0-059 | Milestone acceptance | 1d | Architect/Product | 058 | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Infrastructure Dependency Graph

    Account
      |
      +--> IAM
      |
      +--> Network
      |      |
      |      +--> DNS
      |      +--> TLS
      |
      +--> Secrets / KMS
      |
      +--> Compute
      |      |
      |      +--> API
      |      +--> Workers
      |
      +--> Data
      |      |
      |      +--> PostgreSQL
      |      +--> Object Storage
      |      +--> Queue
      |
      +--> Observability
      |
      +--> CI/CD

## 5.3 Resource Lifecycle

    Define
      |
      v
    Review
      |
      v
    Provision
      |
      v
    Verify
      |
      v
    Operate
      |
      v
    Modify
      |
      v
    Retire

All lifecycle transitions should be represented in IaC or documented
operational procedures.

---
