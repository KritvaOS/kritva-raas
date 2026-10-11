# Backend Planning

## Document Control

| Field | Value |
|---|---|
| Document | Backend Planning README |
| Path | `planning/backend/README.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; C-M01 FOUNDATION |

## 1. Purpose

This directory contains the program-level planning documents for implementing the Kritva RaaS backend. It defines implementation sequencing, cross-increment task tracking, dependencies, security gates, test strategy, acceptance criteria, risks, and resource-planning decisions.

The planning model separates three levels of control:

1. **Program planning** defines the backend implementation approach and its dependencies on other Kritva RaaS workstreams.
2. **Implementation increments** organize work into reviewable, independently gated delivery units.
3. **Existing milestone dossiers** remain authoritative for the scope and acceptance of their established milestones.

This directory does not introduce new program phases or official milestones.

## 2. Canonical Planning Authority

The following rules apply to every document maintained under this directory:

- `planning/PHASES.md` is the authority for canonical phase names and definitions.
- B-M01 CONTROL PLANE remains the authoritative backend milestone for its established scope.
- DB-M01 FOUNDATION remains the authoritative database milestone for its established scope.
- C-M01 FOUNDATION remains the authoritative cloud milestone for its established scope.
- An implementation increment is a planning and execution unit, not a replacement for an official milestone.
- The primary product path is the end-to-end user journey through local development, artifact creation, remote booking, execution, observation, and results. It is not a phase, milestone, or stage.
- Existing task IDs must be retained when work is reorganized. New tasks must use an approved, non-colliding namespace.
- A planning document marked Proposed does not authorize implementation where a required contract, architecture decision, or security review remains unresolved.

## 3. Program-Level Documents

The program-level document set is intended to cover the following responsibilities.

| Document | Responsibility |
|---|---|
| `README.md` | Directory entry point, planning authority, and navigation |
| `BACKEND_IMPLEMENTATION_PLAN.md` | Implementation strategy, sequencing, increment boundaries, and exit gates |
| `BACKEND_TASK_REGISTER.md` | Cross-increment task inventory, existing-ID mapping, dependencies, and status |
| `BACKEND_DEPENDENCY_MAP.md` | Backend dependencies on database, cloud, frontend, and shared contracts |
| `BACKEND_SECURITY_GATE.md` | Mandatory security requirements and repository secret-protection gates |
| `BACKEND_TEST_STRATEGY.md` | Unit, contract, integration, migration, authorization, tenant-isolation, and end-to-end testing |
| `BACKEND_ACCEPTANCE_CRITERIA.md` | Backend-level readiness and acceptance requirements |
| `BACKEND_RISK_REGISTER.md` | Backend risks, mitigations, decision owners, and escalation conditions |
| `BACKEND_RESOURCE_PLAN.md` | Owner roles, capacity assumptions, estimates, and unresolved resource decisions |
| `BACKEND_CHANGELOG.md` | Controlled record of changes to the backend planning baseline |
| `decisions/README.md` | Backend decision-approval workflow, canonical decision records, and approval-package navigation |

The document set is being prepared in batches. Until a document has been created and reviewed, it must not be treated as an approved source of requirements.

## 4. Implementation Increment Dossiers

Implementation increments will use the following identifiers and proposed names:

| Increment | Proposed name | Planning boundary |
|---|---|---|
| B-INC-001 | SECURE FOUNDATION | Application skeleton, module boundaries, configuration, HTTP/API foundation, observability, secret-protection controls, and foundational verification |
| B-INC-002 | IDENTITY-ORGANIZATION | Identity, organization, membership, role, authorization, and tenant-context implementation |
| B-INC-003 | PROJECTS-PLATFORM-CATALOG | Project metadata and platform-catalog implementation |
| B-INC-004 | AUDIT-TRANSACTIONS-IDEMPOTENCY | Transaction boundaries, idempotency, audit behavior, and associated verification |

These are proposed implementation increments, not official milestones. B-INC-002 through B-INC-004 must not be treated as frozen or implementation-ready until the preceding work and dependencies have been reviewed.

All four increment dossiers exist under `planning/backend/increments/`. Each has the same eight files: `MILESTONE.md`, `TASKS.md`, `ACCEPTANCE_CRITERIA.md`, `REVIEW_CHECKLIST.md`, `TEST_PLAN.md`, `SECURITY_REVIEW.md`, `CHANGELOG.md` and `GIT_COMMIT_STEP.md`.

| Increment | Dossier | Acceptance criteria | Tasks | Branch | Closure tag |
|---|---|---|---|---|---|
| B-INC-001 | [SECURE-FOUNDATION](increments/B-INC-001-SECURE-FOUNDATION/MILESTONE.md) | 21 | 29 | `increment/b-inc-001-secure-foundation` | `b-inc-001-secure-foundation-closed` |
| B-INC-002 | [IDENTITY-ORGANIZATION](increments/B-INC-002-IDENTITY-ORGANIZATION/MILESTONE.md) | 18 | 14 | `increment/b-inc-002-identity-organization` | `b-inc-002-identity-organization-closed` |
| B-INC-003 | [PROJECTS-PLATFORM-CATALOG](increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/MILESTONE.md) | 17 | 13 | `increment/b-inc-003-projects-platform-catalog` | `b-inc-003-projects-platform-catalog-closed` |
| B-INC-004 | [AUDIT-TRANSACTIONS-IDEMPOTENCY](increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/MILESTONE.md) | 16 | 13 | `increment/b-inc-004-audit-transactions-idempotency` | `b-inc-004-audit-transactions-idempotency-closed` |

Traceability rules for every dossier:

- `ACCEPTANCE_CRITERIA.md` is the single source for each criterion's `BAC-*`, `BTS-*` and `SEC-GATE-*` trace.
- A task's linked tests and security gates in `TASKS.md` are exactly the union of its linked criteria's traces.
- The `TEST_PLAN.md` matrix reproduces the acceptance-criteria traces exactly.
- The per-task commit section of each increment's `GIT_COMMIT_STEP.md` (Section 9 in B-INC-001 and B-INC-002; Section 6 in B-INC-003 and B-INC-004, whose Section 9 holds the branch, closing commit and tag) gives a ready-to-use commit message for every task, with trailers identical to `TASKS.md`, plus the branch, closing commit and annotated tag.
- Shared tasks (`KR-BE-1-043` to `KR-BE-1-045`) keep their whole-task B-M01 estimates; each increment commits only its scoped slice.

All dossiers are Proposed. Dossier completeness and trace validation confirm documentation consistency only, not implementation, test or acceptance results.

## 5. Existing Milestone Dossiers

The implementation plan must remain aligned with the established milestone dossiers:

- [B-M01 CONTROL PLANE](../../docs/backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)
- [DB-M01 FOUNDATION](../../docs/database/milestones/DB-M01-FOUNDATION/MILESTONE.md)

The backend implementation may establish interfaces and integration points needed by the database and cloud workstreams. It must not silently take ownership of their milestone deliverables.

In particular:

- Database schema, migration, transaction, and tenant-isolation requirements must remain coordinated with DB-M01 FOUNDATION.
- Cloud IAM, workload identity, secret-manager integration, and production infrastructure requirements must remain coordinated with C-M01 FOUNDATION and its established scope.
- Coding-agent policy implementation must respect the approved coding-agent integration contract and its outstanding decision gates.

## 6. Technical Baseline and Open Decisions

The established B-M01 baseline is:

- TypeScript and Node.js.
- PostgreSQL.
- REST API v1.

The following implementation choices remain open until B-INC-001 review:

- Exact Node.js version.
- Exact TypeScript version.
- Package manager and lockfile policy.
- HTTP framework.
- Database migration tool.
- Secret-scanning tool and enforcement configuration.
- CI execution and failure-reporting details.

Each decision must record the available options, recommendation, rationale, consequences, validation requirements, and decision owner. A recommendation is not a final decision until the designated owner approves it.

## 7. Security Invariant

**No real secrets or security-key material may be stored in the repository.**

This prohibition includes private keys, private certificates, signing or encryption key material, passwords, access tokens, API keys, database credentials, OAuth secrets, service-account credentials, populated environment files, and logs or test artifacts that expose credentials.

Permitted repository content includes configuration schemas, secret names, documented secret-manager interfaces, clearly nonfunctional placeholders, and tests that generate ephemeral key material at runtime without persisting it.

The implementation must establish preventive and detective controls, including:

- Repository ignore rules for sensitive local files and generated artifacts.
- Safe configuration examples containing placeholders only.
- Secret scanning before commit where supported.
- Blocking CI enforcement.
- Appropriate review of the existing repository history and baseline findings.
- Safe fixtures, logs, test output, and failure diagnostics.
- A documented response process for suspected credential exposure, including revocation or rotation where applicable.

No claim that the repository is clean, the history is safe, or a scanner passes may be made without execution and inspection of the relevant evidence.

## 8. Task and Evidence Rules

Every implementation task must:

1. Have a unique task identifier.
2. Identify its owner role and dependencies.
3. Define observable acceptance criteria.
4. Identify required tests, reviews, and retained evidence.
5. Preserve the ownership boundary of the relevant milestone.
6. Avoid introducing real credentials or other prohibited material into tracked files.
7. Be accepted on evidence, not merely on code completion or the existence of a commit.

Existing B-M01 task identifiers must be reused for the work already represented in the B-M01 register. New B-INC-001 tasks must use the `KR-BINC-001-nnn` namespace and must be checked for repository-wide uniqueness before assignment.

## 9. Change Control

Changes to the implementation sequence, task mapping, security gates, or acceptance criteria must be reviewed by the relevant owner roles.

A change that affects an established milestone, public API contract, database contract, security invariant, or ownership boundary must be reconciled with its authoritative document before implementation proceeds.

The following conditions require explicit review rather than informal interpretation:

- A technology choice that changes the implementation baseline.
- A dependency that changes milestone sequencing.
- A task that crosses backend, database, cloud, or frontend ownership.
- A security finding that may indicate actual or historical credential exposure.
- A change to coding-agent policy behavior or its contract.
- An acceptance exception that would weaken a required security or tenant-isolation control.

## 10. Current Planning Status

This planning directory is being established in controlled batches.

The ten program-level documents and the four increment dossiers (B-INC-001 to B-INC-004) are in place, with status Proposed. The next steps are to review and freeze B-INC-001, approve its open technology decisions, and then authorize implementation in increment order.

No implementation task is considered authorized solely because it appears in a Proposed planning document. The applicable review and decision gates must be satisfied first.
