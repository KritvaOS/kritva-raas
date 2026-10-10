# Backend Dependency Map

## Document Control

| Field | Value |
|---|---|
| Document | Backend Dependency Map |
| Path | `docs/planning/backend/BACKEND_DEPENDENCY_MAP.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION; C-M02 DEVELOPMENT |

## 1. Purpose

This document identifies the dependencies that must be resolved to implement, test, review, and accept the Kritva RaaS backend.

It defines dependency ownership, the proposed implementation sequence, required inputs, observable readiness conditions, and escalation rules. It does not redefine official milestone scope or authorize work that remains gated by an unresolved contract or decision.

## 2. Dependency Principles

1. The canonical phase model is defined by `docs/planning/PHASES.md`.
2. Existing milestone dossiers remain authoritative for milestone scope.
3. An interface is not considered integrated merely because its type, schema, or API route exists.
4. A dependency is satisfied only when the required contract, decision, environment, or tested behavior is available.
5. Cross-workstream dependencies must have an accountable owner role.
6. Dependencies must be identified before a dependent task is marked Ready.
7. Changes to an upstream contract require downstream impact assessment.
8. Security and tenant-isolation requirements cannot be bypassed to unblock implementation.
9. An increment may establish a local interface or development substitute without claiming the corresponding production integration is complete.
10. No actual secret or security-key material may be introduced into the repository to satisfy a dependency.

## 3. Canonical Phase and Milestone Alignment

| Phase | Canonical name | Backend dependency relevance |
|---|---|---|
| P0 | FOUNDATION | Architecture, repository safeguards, configuration, and engineering infrastructure |
| P1 | STUDIO | Client-facing contract and authentication integration |
| P2 | BUILD & ARTIFACT | Artifact and source-code privacy boundaries |
| P3 | CONTROL PLANE | Backend services, identity, authorization, and core data |
| P4 | BOOKING & COMMERCIAL | Future booking and commercial service dependencies |
| P5 | EXECUTION | Future execution orchestration and lifecycle dependencies |
| P6 | LAB & ROBOT | Future lab integration and physical-robot boundaries |
| P7 | LIVE & RESULTS | Future observation and result-service dependencies |
| P8 | PRODUCTION | Production security, reliability, deployment, and operations |

The initial implementation is concentrated on P3 CONTROL PLANE and its P0 FOUNDATION prerequisites. The table does not imply that later-phase features belong in B-M01 CONTROL PLANE.

## 4. Cross-Workstream Dependency Register

| ID | Dependency | Provider / owner role | Consumer / owner role | Required evidence | Blocking scope |
|---|---|---|---|---|---|
| BDEP-001 | Canonical phase and milestone scope | Program Planning Owner | Backend Technical Lead | Consistent phase and milestone mapping in the task register and increment dossiers | All increments |
| BDEP-002 | Backend architecture and module boundaries | Backend Technical Lead / Architecture Owner | Backend implementation roles | Reviewed module boundaries, allowed dependency directions, and architecture findings disposition | B-INC-001 |
| BDEP-003 | Runtime, language, package manager, and HTTP framework decisions | Backend Technical Lead | Backend implementation roles | Approved decision records, pinned configuration, reproducible installation, and CI compatibility | B-INC-001 |
| BDEP-004 | PostgreSQL access and migration tooling | Database Technical Lead with Backend Technical Lead | Backend and database implementation roles | Approved database boundary, migration decision, controlled test environment, and reproducible migration evidence | B-INC-001 prerequisite; B-INC-004 |
| BDEP-005 | REST API v1 contract | Backend Technical Lead with Frontend Technical Lead | Backend API implementation and frontend integration | Reviewed routes, request/response schemas, error semantics, and contract tests | B-INC-001 and subsequent API work |
| BDEP-006 | Secret-management requirements | Security Owner and Cloud/Infrastructure Owner | Backend Technical Lead | Approved configuration and injection boundary, safe examples, redaction requirements, and security-gate evidence | All increments |
| BDEP-007 | Repository checks and CI enforcement | Repository/CI Owner | All implementation and review roles | Required CI checks, demonstrated failure behavior, and safe retained evidence | B-INC-001 and every later increment |
| BDEP-008 | Identity and authentication integration | Identity/Authentication Owner with Backend Technical Lead | Identity and organization implementation roles | Approved authentication contract, principal semantics, and positive/negative test plan | B-INC-002 |
| BDEP-009 | Organization, membership, and tenant data model | Database Technical Lead with Backend Technical Lead | Identity and organization implementation roles | Reviewed schema and migrations, membership constraints, and tenant-context rules | B-INC-002 |
| BDEP-010 | Database tenant-isolation enforcement | Database Technical Lead with Security Owner | Backend authorization and repository roles | Approved enforcement mechanism and integration tests demonstrating cross-tenant rejection | B-INC-002 |
| BDEP-011 | Project metadata and authorization contract | Backend Technical Lead with Database Technical Lead | Project implementation roles | Approved model, API contract, organization ownership rules, and prohibited-payload tests | B-INC-003 |
| BDEP-012 | Platform-catalog ownership | B-M01 Milestone Owner and B-M03 PLATFORM Owner | Backend Technical Lead | Reviewed ownership boundary and approved contract for each catalog capability | B-INC-003 |
| BDEP-013 | Transaction and idempotency contract | Backend Technical Lead with Database Technical Lead | Transaction and idempotency implementation roles | Defined transaction scope, replay behavior, conflict semantics, and persistence contract | B-INC-004 |
| BDEP-014 | Audit contract and sensitive-data classification | Security Owner with Backend Technical Lead | Audit implementation roles | Required event inventory, fields, failure behavior, retention boundary, and data-redaction tests | B-INC-004 |
| BDEP-015 | Coding-agent integration contract | Coding-Agent Architecture Owner | Backend policy implementation roles | Approved contract and explicit disposition of SYS-ADR-007 and applicable DB-M02 CORE DATA / KR-CA-031 gates | Gated coding-agent tasks; not a B-INC-001 prerequisite unless its scope changes |
| BDEP-016 | Test environment and evidence workflow | QA Owner with Repository/CI Owner | All implementation roles | Reproducible commands, controlled database setup, sanitized output, and retained results | All increments |
| BDEP-017 | Production secret and workload identity integration | Cloud/Infrastructure Owner | Backend deployment and operations roles | Cloud-owned implementation and verification of workload identity and secret delivery | Relevant production integration; not satisfied by a local abstraction alone |

## 5. B-INC-001 SECURE FOUNDATION Dependency Sequence

B-INC-001 should follow this dependency sequence. Independent tasks may run in parallel when their prerequisites are met.

### 5.1 Repository and architecture baseline

Required inputs:

- Canonical phase and milestone definitions.
- Existing backend architecture.
- Existing B-M01 task register.
- Repository structure and available CI capabilities.
- Security requirements and the supplied scan baseline.

Readiness conditions:

- The increment scope and existing task mapping are reviewed.
- New task IDs have been checked for uniqueness.
- The technology decision owners are identified.
- The reported DEVELOPMENT_SETUP database URL example has been remediated and rescanned before the corresponding security gate is accepted.
- The absence of existing CI enforcement is treated as a gap, not as a passing control.

### 5.2 Technology decisions and application skeleton

Required inputs:

- Approved runtime and language versions.
- Package manager and lockfile policy.
- HTTP framework selection.
- Test and lint execution approach.
- PostgreSQL integration requirements.

Readiness conditions:

- A clean checkout can install dependencies.
- The selected stack is recorded and pinned consistently.
- Module boundaries and application startup behavior are testable.
- Unresolved technology decisions do not silently become implementation assumptions.

### 5.3 Configuration, HTTP, and operational foundation

Required inputs:

- Approved configuration schema.
- REST API v1 conventions.
- Request context and correlation requirements.
- Error and validation contract.
- Health and readiness requirements.
- Logging and redaction requirements.

Readiness conditions:

- Invalid required configuration fails safely.
- HTTP behavior follows the approved contract.
- Request correlation is tested.
- Health and readiness distinguish their documented purposes.
- Logs are verified not to expose synthetic credentials.

### 5.4 Repository security controls

Required inputs:

- Approved secret-scanning tool.
- Repository ignore-rule policy.
- CI execution capabilities.
- Secret-exposure response procedure.

Readiness conditions:

- Ignore rules and safe examples are reviewed.
- Local detection is demonstrated where supported.
- Required CI enforcement is blocking.
- Synthetic secret tests prove that detection and failure behavior work.
- The history scan scope and findings are documented.
- Scanner failures cannot silently produce a passing check.

### 5.5 Database integration boundary

Required inputs:

- Approved PostgreSQL connection approach.
- Migration-tool decision.
- Database test-environment setup.
- DB-M01 FOUNDATION requirements.

Readiness conditions:

- Test credentials are provided outside tracked files.
- A controlled database connection is verified.
- The required migration baseline can be exercised reproducibly.
- Database ownership and later schema obligations are documented.
- No production database credential is required for local development or CI.

## 6. Later Increment Dependencies

### 6.1 B-INC-002 IDENTITY-ORGANIZATION

The increment depends on the B-INC-001 foundation and the approved identity, organization, and database contracts.

Before the relevant tasks are Ready, the owners must confirm:

- Authentication boundary and principal semantics.
- User, organization, and membership schema.
- Role and permission model.
- Application-level tenant context.
- Required database-level tenant-isolation behavior.
- Positive and negative authorization test scenarios.

A repository or service abstraction alone does not satisfy database tenant-isolation requirements.

### 6.2 B-INC-003 PROJECTS-PLATFORM-CATALOG

The increment depends on the approved project schema, tenant authorization behavior, and platform-catalog ownership boundary.

Before the relevant tasks are Ready, the owners must confirm:

- Organization-scoped project semantics.
- Project request and response schemas.
- Authorization behavior for project operations.
- Rejection of prohibited source-code and credential payloads.
- The boundary between B-M01 CONTROL PLANE and B-M03 PLATFORM.

Catalog implementation must not take ownership of a B-M03 PLATFORM deliverable without an approved scope reconciliation.

### 6.3 B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY

The increment depends on the database transaction contract and the operations that require audit and idempotency behavior.

Before the relevant tasks are Ready, the owners must confirm:

- Transaction scope and rollback behavior.
- Idempotency-key semantics and conflict handling.
- Required audit events and fields.
- Audit-persistence failure behavior.
- Sensitive-data exclusion.
- Migration and integration test coverage.

## 7. Coding-Agent Dependency Gate

Coding-agent policy implementation is a separate gated concern.

The backend must not assume that the existence of a coding-agent integration document constitutes approval of every policy API or persistence choice.

Before coding-agent policy tasks are authorized, the responsible owner must confirm:

- The approved integration contract.
- SYS-ADR-007 disposition.
- Applicable DB-M02 CORE DATA dependencies.
- The KR-CA-031 gate.
- The intended division between backend policy metadata, provider metadata, and Studio Local Runtime execution.
- The prohibition on default backend storage of provider credentials, source code, prompts, and execution transcripts.

If these dependencies are unresolved, affected coding-agent tasks remain Blocked. Unrelated B-INC-001 foundation work may proceed if it does not assume or bypass those decisions.

## 8. Dependency Change Control

When a dependency changes, the Backend Technical Lead must record:

1. The dependency ID.
2. The affected task IDs and increment.
3. The upstream change or new finding.
4. The owner responsible for resolution.
5. The acceptance or test criteria affected.
6. The required review and evidence.
7. Whether implementation is blocked.
8. The approved resolution and its effect on sequencing.

An upstream change that affects the public API, schema, tenant isolation, secret handling, or coding-agent contract requires review by the relevant owner before dependent work resumes.

## 9. Dependency Escalation Rules

Escalate a dependency when:

- Its owner is not identified.
- Its contract or decision is required but unresolved.
- Its implementation differs from the approved contract.
- It prevents a required test from running.
- It causes a security or tenant-isolation gate to fail.
- It crosses an established milestone ownership boundary.
- It changes the expected effort or sequencing materially.

A blocked dependency must not be represented as complete in the task register. Schedule pressure does not authorize bypassing a mandatory security or contract gate.

## 10. Current Status

This map is Proposed.

B-INC-001 is the first increment for detailed review. Its technology decisions, repository protection controls, configuration foundation, and database integration prerequisites must be resolved and evidenced before the increment is accepted.

B-INC-002 through B-INC-004 remain subject to later dossier preparation and review. This map does not claim that any dependency has already been satisfied merely because the relevant document exists.
