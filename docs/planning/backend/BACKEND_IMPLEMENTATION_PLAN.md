# Backend Implementation Plan

## Document Control

| Field | Value |
|---|---|
| Document | Backend Implementation Plan |
| Path | `docs/planning/backend/BACKEND_IMPLEMENTATION_PLAN.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; C-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM |

## 1. Purpose

This document defines the proposed implementation sequence for the Kritva RaaS backend and the conditions required to move from planning into controlled implementation.

The plan organizes backend work into reviewable implementation increments while preserving existing program phases, official milestones, task identifiers, contract ownership, and security requirements.

The initial scope is the B-M01 CONTROL PLANE implementation foundation. The plan does not authorize unrelated product features or redefine the scope of existing milestone dossiers.

## 2. Objectives

The backend implementation must establish a foundation that is:

- Structured around explicit application-module boundaries.
- Configured and validated before the service becomes ready.
- Built on the established TypeScript/Node.js, PostgreSQL, and REST API v1 baseline.
- Testable locally and in CI.
- Observable through structured, appropriately redacted logs and operational endpoints.
- Protected against accidental introduction of secrets into source control.
- Designed to enforce identity, authorization, and tenant boundaries.
- Integrated with the database and cloud workstreams without taking over their ownership.
- Traceable from requirements and tasks to tests, reviews, and acceptance evidence.
- Compatible with the approved API and coding-agent integration contracts.

## 3. Scope

### 3.1 Included

The planned backend implementation covers:

1. Application structure and module boundaries.
2. Configuration, startup validation, and safe configuration examples.
3. HTTP transport, request context, API v1 routing, validation, and error handling.
4. Request correlation, structured logging, health, and readiness.
5. Database connectivity and migration-tool integration boundaries.
6. Repository-level secret-protection controls and CI enforcement.
7. Identity, organization, membership, roles, permissions, and tenant context.
8. Project metadata and platform-catalog services.
9. Transaction boundaries, idempotency, and audit foundations.
10. Unit, contract, authorization, tenant-isolation, migration, integration, and end-to-end verification.
11. Security, architecture, performance-baseline, documentation, and milestone-acceptance evidence.

The task-level scope is governed by the existing B-M01 register and the applicable database and cloud milestone dossiers.

### 3.2 Excluded from this implementation plan

The following are not automatically included in B-M01 implementation work:

- Redefining canonical program phases or official milestone names.
- Implementing the complete cloud infrastructure owned by C-M01 FOUNDATION or C-M02 DEVELOPMENT.
- Implementing DB-M02 CORE DATA deliverables without the relevant database milestone authorization.
- Implementing B-M03 PLATFORM deliverables merely because B-M01 exposes a platform-catalog boundary.
- Launching coding agents or managing coding-agent execution sessions in the backend.
- Uploading or retaining user source code, prompts, or agent transcripts by default.
- Storing provider credentials or real security-key material in the repository.
- Treating the presence of a database schema, API endpoint, or commit as sufficient proof of acceptance.
- Changing an approved public contract without its required review.

Any proposed expansion must be recorded, assessed for milestone ownership and dependencies, and approved by the appropriate decision owner.

## 4. Canonical Baseline

The implementation must comply with these established rules.

| Area | Baseline or authority |
|---|---|
| Program phase definitions | `docs/planning/PHASES.md` |
| Backend milestone | B-M01 CONTROL PLANE |
| Database foundation | DB-M01 FOUNDATION |
| Backend architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| API contract | `docs/protocol/API_CONTRACT.md` |
| Secret-management requirements | `docs/security/SECRETS_MANAGEMENT.md` |
| Key-management requirements | `docs/security/KEY_MANAGEMENT.md` |
| Testing guidance | `docs/development/TESTING_STRATEGY.md` |
| Coding-agent integration | `docs/architecture/CODING_AGENT_INTEGRATION.md` |

The implementation baseline is TypeScript/Node.js, PostgreSQL, and REST API v1.

Exact language and runtime versions, package manager, HTTP framework, migration tool, and secret scanner remain open decisions for B-INC-001 review. This plan does not silently select them.

## 5. Implementation Model

Work is divided into four proposed increments.

The increments are execution and review boundaries within the existing milestone structure. They are not new phases, official milestones, or substitutes for milestone acceptance.

| Increment | Proposed name | Primary objective | Main milestone alignment |
|---|---|---|---|
| B-INC-001 | SECURE FOUNDATION | Establish the service skeleton, validated configuration, HTTP/API foundation, logging, operational endpoints, repository secret-protection controls, and foundational tests | B-M01 CONTROL PLANE; coordinated with DB-M01 FOUNDATION and C-M01 FOUNDATION |
| B-INC-002 | IDENTITY-ORGANIZATION | Implement identity, organizations, memberships, roles, authorization, and tenant context | B-M01 CONTROL PLANE; coordinated with DB-M01 FOUNDATION |
| B-INC-003 | PROJECTS-PLATFORM-CATALOG | Implement organization-scoped project metadata and the platform-catalog boundary | B-M01 CONTROL PLANE; coordinate any work assigned to B-M03 PLATFORM |
| B-INC-004 | AUDIT-TRANSACTIONS-IDEMPOTENCY | Implement and verify transaction boundaries, idempotency, audit behavior, and associated cross-cutting tests | B-M01 CONTROL PLANE; coordinated with DB-M01 FOUNDATION |

### 5.1 Sequencing rule

B-INC-001 is the first increment proposed for detailed review and implementation.

B-INC-002 through B-INC-004 have Proposed dossiers. Their implementation must not start until the preceding increment is accepted and the contracts, dependencies and decisions recorded in each dossier are satisfied.

A dependency may be implemented earlier or later only when the change is explicitly recorded and does not violate milestone ownership, required contract gates, or acceptance dependencies.

## 6. B-INC-001 — SECURE FOUNDATION

### 6.1 Objective

Establish a reproducible, testable backend application foundation with secure configuration handling, basic service operation, and enforceable repository safeguards.

### 6.2 Planned work

The detailed task dossier must cover:

- Application bootstrap and module boundaries.
- Typed configuration and startup validation.
- HTTP transport and REST API v1 routing foundation.
- Request context and correlation identifiers.
- Validation and standardized error responses.
- Health and readiness behavior.
- Structured logging and sensitive-data redaction.
- PostgreSQL connection and migration-tool integration boundaries.
- Safe environment/configuration examples.
- Repository ignore rules for sensitive files and generated artifacts.
- Secret scanning and blocking CI controls.
- Appropriate baseline and history-scan assessment.
- Tests for configuration failure, API behavior, logging safety, and foundational integration.
- Architecture, security, and documentation review evidence.

The increment must not implement identity, project, or catalog business functionality prematurely merely to demonstrate that the service starts.

### 6.3 Open technology decisions

The B-INC-001 review must evaluate and record decisions for:

| Decision | Options to evaluate | Recommendation to assess | Decision owner |
|---|---|---|---|
| Node.js version | Supported LTS releases compatible with the deployment baseline | Select a supported LTS release with a documented support window | Backend Technical Lead |
| TypeScript version | Supported versions compatible with the chosen runtime and toolchain | Select a stable version and pin it consistently | Backend Technical Lead |
| Package manager | npm, pnpm, or another justified option | Prefer reproducible installs, committed lockfile, and CI consistency | Backend Technical Lead |
| HTTP framework | Lightweight supported Node.js HTTP frameworks | Prefer a maintained framework with explicit validation, testability, and error-handling support | Backend Technical Lead |
| Migration tool | Supported PostgreSQL migration tools | Prefer deterministic, version-controlled migrations with CI verification | Backend Technical Lead, with Database Technical Lead review |
| Secret scanner | Supported repository scanners | Prefer a maintained scanner with local and blocking CI enforcement | Security Owner |
| CI enforcement | Existing repository CI or an approved extension | Fail the relevant check on confirmed secret findings and retain safe evidence | Repository/CI Owner |
| History scanning | Approved scanner and scope for Git history | Assess the complete available history and document limitations | Security Owner |

These are recommendations for evaluation, not approved technology selections. The review record must identify the chosen option, rejected alternatives, rationale, consequences, and owner approval.

### 6.4 Exit conditions

B-INC-001 may be proposed for acceptance only when:

1. The application can be installed and tested using documented, reproducible instructions.
2. Invalid or missing required configuration causes safe startup failure.
3. Health and readiness semantics are implemented and tested.
4. API errors and request correlation follow the approved contract.
5. Logs do not expose credentials, tokens, private key material, or other prohibited sensitive values.
6. Safe configuration examples contain placeholders only.
7. Repository ignore rules and secret-scanning controls are installed and reviewed.
8. CI blocks the defined class of confirmed secret findings.
9. The history-scan scope and results are recorded; any limitations and findings have explicit disposition.
10. Foundational tests pass and their results are retained.
11. Architecture, security, and documentation reviews are complete.
12. Any unresolved issue that blocks the increment is explicitly recorded and prevents acceptance.

A scan result is evidence only for the files, branches, history, and scanner configuration actually examined. A clean scan does not prove that secrets were never exposed outside the scanned scope.

## 7. B-INC-002 — IDENTITY-ORGANIZATION

Dossier: [`increments/B-INC-002-IDENTITY-ORGANIZATION/`](increments/B-INC-002-IDENTITY-ORGANIZATION/MILESTONE.md), with 18 acceptance criteria, 14 tasks and per-task commit text. The dossier's `ACCEPTANCE_CRITERIA.md` is authoritative for acceptance and traceability; this section is a summary.

### 7.1 Objective

Implement the identity and organization foundation required for authenticated, tenant-scoped access.

### 7.2 Planned work

The dossier addresses:

- Provider-neutral identity and authentication boundaries.
- Principal and user representations.
- User repository behavior.
- Organization and membership models.
- Organization repository and service behavior.
- Role and permission definitions.
- Authorization policy enforcement.
- Current-user and organization API behavior.
- Tenant-context propagation and enforcement.
- Negative authorization and cross-tenant tests.

The task breakdown must reuse the applicable existing B-M01 task IDs rather than minting replacement identifiers.

### 7.3 Dependencies and gates

This increment depends on the B-INC-001 service foundation and the relevant DB-M01 FOUNDATION schema and migration contracts.

Database enforcement requirements must be coordinated with the Database Technical Lead. Application-level authorization must not be treated as a substitute for required database-level tenant protection.

### 7.4 Exit conditions

The dossier defines evidence demonstrating that:

- Authentication integration follows the approved boundary.
- Unauthenticated and unauthorized requests are rejected appropriately.
- Authorization defaults to deny where no permission is granted.
- Cross-organization access is rejected.
- Tenant context cannot be selected or overridden by an untrusted request without authorization.
- Database tenant-isolation controls are verified where required.
- Tests cover both permitted and denied operations.
- Review findings are dispositioned before acceptance.

These conditions are refined into measurable criteria in the B-INC-002 dossier.

## 8. B-INC-003 — PROJECTS-PLATFORM-CATALOG

Dossier: [`increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/`](increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/MILESTONE.md), with 17 acceptance criteria, 13 tasks and per-task commit text. The dossier's `ACCEPTANCE_CRITERIA.md` is authoritative for acceptance and traceability; this section is a summary.

### 8.1 Objective

Implement project metadata and platform-catalog operations within their approved ownership boundaries.

### 8.2 Planned work

The dossier addresses:

- Organization-owned project metadata.
- Project repository and service behavior.
- Project API operations and authorization.
- Platform-catalog model, repository, service, and API behavior.
- Platform-administration authorization.
- Validation, error behavior, and integration tests.
- Data classification and request/response review.

### 8.3 Data and ownership constraints

Project APIs must not become a path for uploading or storing source code, private credentials, signing keys, or other prohibited material.

Platform-catalog functionality must remain aligned with the established milestone boundary. Work belonging to B-M03 PLATFORM must not be silently moved into B-M01 CONTROL PLANE.

### 8.4 Exit conditions

The dossier defines evidence that:

- Project operations enforce organization ownership and authorization.
- Platform-catalog operations enforce the intended access policy.
- Request and response schemas match the approved API contract.
- Data validation rejects disallowed payloads.
- Tests exercise authorized, unauthorized, malformed, and cross-tenant cases.
- Milestone ownership and acceptance are clear.

## 9. B-INC-004 — AUDIT-TRANSACTIONS-IDEMPOTENCY

Dossier: [`increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/`](increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/MILESTONE.md), with 16 acceptance criteria, 13 tasks and per-task commit text. The dossier's `ACCEPTANCE_CRITERIA.md` is authoritative for acceptance and traceability; this section is a summary.

### 9.1 Objective

Establish and verify the cross-cutting persistence behaviors required for safe backend operations.

### 9.2 Planned work

The dossier addresses:

- Transaction boundary conventions.
- Idempotency persistence and request handling.
- Audit persistence and service behavior.
- Audit hooks for the applicable business operations.
- Migration and transaction tests.
- API integration and end-to-end verification.
- Failure-path and replay behavior.
- Operational evidence and documentation.

### 9.3 Dependencies

The increment must coordinate transaction and schema requirements with DB-M01 FOUNDATION. It must not introduce an alternative transaction or audit model without reconciling the authoritative database and backend architecture documents.

### 9.4 Exit conditions

The dossier defines evidence that:

- Transaction failures roll back the expected changes.
- Idempotent retries behave according to the approved contract.
- Audit records are generated for the required actions.
- Audit data excludes prohibited credentials and sensitive payloads.
- Migration behavior is reproducible and tested.
- Integration tests cover failure, retry, and replay paths.
- Required review findings are resolved or formally dispositioned.

## 10. Coding-Agent Integration Boundary

Coding-agent integration is subject to the approved contract and its recorded decisions.

The backend may expose and persist approved organization policy metadata and policy-version information when authorized by the relevant contract and schema. It must not become the default storage location for provider credentials, source code, prompts, or execution transcripts.

The following rules apply:

- Agent launching and session management belong to the appropriate Studio Local Runtime boundary unless an approved architecture decision changes that ownership.
- Provider metadata registry work must align with B-M03 PLATFORM where that milestone owns the capability.
- Coding-agent policy API work must not bypass SYS-ADR-007 or the applicable DB-M02 CORE DATA dependency and KR-CA-031 gate.
- Existing coding-agent tasks must retain their established identifiers.
- A change to policy behavior, persistence, or authorization must be reviewed against `docs/architecture/CODING_AGENT_INTEGRATION.md` and the applicable API and database contracts.

Until the required gates are resolved, the affected work remains blocked. This plan does not infer an approval from the existence of revision 3 documentation alone.

## 11. Cross-Workstream Dependencies

| Workstream | Dependency | Required coordination |
|---|---|---|
| Backend | Service structure, API behavior, configuration, application security | Backend Technical Lead |
| Database | Schema, migrations, transactions, tenant-isolation enforcement | Database Technical Lead |
| Cloud | Secret injection, IAM, workload identities, production secret-manager integration | Cloud/Infrastructure Owner |
| Frontend/Studio | API contracts, authentication boundary, error and request-correlation behavior | Frontend Technical Lead and Backend Technical Lead |
| Security | Secret scanning, logging redaction, credential exposure response, security review | Security Owner |
| Repository/CI | Lockfile policy, required checks, protected branches, evidence retention | Repository/CI Owner |
| Coding-agent integration | Policy API, provider metadata, storage boundary, unresolved decisions | Coding-Agent Architecture Owner |

A dependency is not satisfied merely because a related document exists. The implementation must identify the relevant approved contract, schema, decision, or tested integration.

## 12. Global Security Requirements

The following invariant applies to every increment:

**No real secrets or security-key material may be committed to the repository.**

Examples of prohibited content include:

- Private keys and private certificates.
- Signing or encryption key material.
- API keys, access tokens, passwords, and OAuth secrets.
- Database passwords and credential-bearing connection strings.
- Service-account keys and cloud credentials.
- Populated `.env` files and equivalent local secret files.
- Logs, fixtures, snapshots, test reports, or crash output containing secrets.

Permitted content includes schemas, variable names, interfaces, secret-manager references, documented workflows, obvious nonfunctional placeholders, and tests using ephemeral runtime-generated key material that is not persisted.

The control strategy must include:

1. Ignore rules for known sensitive local files and generated output.
2. Safe example configuration.
3. Local secret detection before commit where supported.
4. Blocking CI secret scanning.
5. Baseline and history assessment with documented scope.
6. Safe handling of scanner output and diagnostic artifacts.
7. A response process for suspected exposure, including revocation or rotation where applicable.

Scanner configuration must be reviewed to avoid silently suppressing meaningful findings. Exceptions must be narrow, justified, reviewed, and auditable; they must not permit actual secret values into the repository.

A detected credential must be treated as potentially exposed. Removing it from the current file does not remove it from Git history or external copies.

## 13. Testing and Evidence Strategy

Testing must be defined at task and increment level. The test strategy must distinguish code-level results from end-to-end evidence.

Expected categories include:

- Unit tests for configuration, validation, request context, and module behavior.
- API contract tests for routes, schemas, error responses, and compatibility.
- Integration tests for PostgreSQL and migration behavior.
- Authorization and tenant-isolation tests.
- Audit and idempotency tests.
- Startup and readiness tests.
- Logging-redaction and secret-protection tests.
- End-to-end tests for the approved primary product path as applicable.
- Security and architecture review evidence.
- Performance-baseline results when required by the existing milestone register.

Evidence must be reproducible, identify the relevant commit and test command, and avoid embedding secrets or sensitive production data. Test output should report enough information to diagnose failure without exposing credentials.

A test suite that passes on a developer machine does not by itself establish CI enforcement, repository-history safety, or production readiness.

## 14. Review and Acceptance Gates

Each increment must pass its own review gates before being proposed for acceptance.

| Gate | Required evidence | Decision owner |
|---|---|---|
| Scope and architecture | Confirmed task mapping, boundaries, and dependency disposition | Backend Technical Lead |
| Technology decisions | Recorded options, rationale, chosen values, and approval | Relevant technical decision owner |
| Functional verification | Required automated tests and retained results | Backend Technical Lead |
| Database coordination | Reviewed schema, migration, transaction, and isolation dependencies | Database Technical Lead |
| Security | Findings, scanner configuration, scan scope, remediation, and review outcome | Security Owner |
| Repository/CI | Required checks enabled and failure behavior demonstrated | Repository/CI Owner |
| Documentation | Setup, configuration, testing, operational behavior, and decisions documented | Documentation Owner |
| Milestone acceptance | Evidence mapped to the authoritative milestone criteria | Milestone Owner |

Any mandatory gate that is unresolved blocks acceptance. A finding may be deferred only when the relevant authority explicitly permits it, the risk is documented, and the deferral does not violate a non-negotiable security invariant.

## 15. Planning and Estimation Rules

No dates, budgets, or staffing figures are fixed by this plan.

Effort estimates must be maintained in the task register or increment dossier and must state their assumptions. Estimates should be refined after the technology decisions, repository state, dependencies, and acceptance evidence are understood.

The resource plan must use owner roles rather than named individuals and must mark unknown capacity or schedule inputs as TBD, with the responsible decision owner identified.

A task estimate is not a delivery commitment. Dependencies, review time, security remediation, CI integration, and documentation must be included when refining the plan.

## 16. Change Control

The following changes require explicit review:

- Reassignment of an existing task to a different milestone owner.
- Creation, renaming, or reuse of task identifiers.
- Changes to an approved API, database, security, or coding-agent contract.
- Changes to the primary product path or its acceptance criteria.
- Selection of an open technology decision.
- Modification of the secret-scanning policy or CI blocking behavior.
- Waiver of a required test, security review, or acceptance gate.
- Changes to the ownership boundary between backend, database, cloud, and frontend work.

Changes must be recorded in the appropriate decision or changelog document before they are treated as part of the accepted planning baseline.

## 17. Definition of Ready for B-INC-001

B-INC-001 is ready to enter controlled implementation only when:

- The increment dossier has been reviewed.
- Existing B-M01 tasks and new B-INC-001 tasks are mapped without ID collisions.
- Technology decisions have been approved or the unresolved decisions are explicitly accepted as prerequisites for the relevant tasks.
- Repository and CI constraints are understood.
- The secret-protection approach is defined and its enforcement tasks are assigned.
- Dependencies on DB-M01 FOUNDATION and C-M01 FOUNDATION are recorded.
- Acceptance criteria and evidence expectations are testable.
- The coding-agent contract and its decision gates are not bypassed by the foundation work.
- The owner roles for implementation and review are identified.

## 18. Definition of Done for an Increment

An increment is complete only when:

1. Its approved scope is implemented.
2. Required tests pass and evidence is retained.
3. Required security and architecture reviews are complete.
4. Mandatory dependencies and cross-workstream interfaces are verified.
5. Documentation reflects the actual implementation.
6. The review checklist is complete.
7. No prohibited secret or security-key material has been introduced into tracked files.
8. Required repository checks have been executed and inspected.
9. Open findings have an explicit disposition.
10. The relevant milestone owner has accepted the evidence against the authoritative milestone criteria.

Completion of an increment does not automatically mean that B-M01 CONTROL PLANE, DB-M01 FOUNDATION, or another official milestone is complete. Official milestone acceptance remains governed by the relevant milestone dossier.

## 19. Current Status and Next Action

**Current planning status: Proposed.**

All four increment dossiers (B-INC-001 to B-INC-004) are prepared, with status Proposed. Their documentation traceability has been validated (see `BACKEND_CHANGELOG.md` PB-003). That is planning validation only: no increment has implementation evidence, executed tests or a security-review decision, and every acceptance record remains TBD.

Next actions, in order:

1. Review and freeze the B-INC-001 SECURE FOUNDATION dossier and approve its open technology decisions (`KR-BINC-001-001` to `KR-BINC-001-004` and `KR-BINC-001-008`).
2. Implement B-INC-001, including the blocking CI secret scan, and record real evidence against `B-INC-001-AC-01` to `AC-21`.
3. Authorize B-INC-002 to B-INC-004 in order, each only after its predecessor is accepted and the dependencies recorded in its dossier are satisfied.

## 20. Increment IDs and Git Commit Conventions

Backend implementation increments are subordinate implementation units. They do not create, rename, or replace the frozen official milestones defined by `docs/planning/PHASES.md`.

Each increment must have a stable ID, a dedicated branch, a closing commit, and an annotated closure tag. Use the repository's existing milestone Git convention, adapted to the increment ID and slug.

| Increment ID | Name | Parent milestone | Branch | Closing commit subject | Tag |
|---|---|---|---|---|---|
| B-INC-001 | Secure Foundation | B-M01 CONTROL PLANE | `increment/b-inc-001-secure-foundation` | `increment(b-inc-001-secure-foundation): close B-INC-001 — Secure Foundation` | `b-inc-001-secure-foundation-closed` |
| B-INC-002 | Identity and Organization | B-M01 CONTROL PLANE | `increment/b-inc-002-identity-organization` | `increment(b-inc-002-identity-organization): close B-INC-002 — Identity and Organization` | `b-inc-002-identity-organization-closed` |
| B-INC-003 | Projects and Platform Catalog | B-M01 CONTROL PLANE | `increment/b-inc-003-projects-platform-catalog` | `increment(b-inc-003-projects-platform-catalog): close B-INC-003 — Projects and Platform Catalog` | `b-inc-003-projects-platform-catalog-closed` |
| B-INC-004 | Audit, Transactions and Idempotency | B-M01 CONTROL PLANE | `increment/b-inc-004-audit-transactions-idempotency` | `increment(b-inc-004-audit-transactions-idempotency): close B-INC-004 — Audit, Transactions and Idempotency` | `b-inc-004-audit-transactions-idempotency-closed` |

**Note:** B-INC-002 to B-INC-004 names and slugs follow their planned dossier folder names (`B-INC-002-IDENTITY-ORGANIZATION`, `B-INC-003-PROJECTS-PLATFORM-CATALOG`, `B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY`) in Sections 7 to 9. They are confirmed when each dossier is created.

### 20.1 Per-task commits and closure requirements

- Each task must have one atomic commit, with its task ID in the subject.
- Each task commit must include `Tasks`, `Acceptance`, `Tests`, `Security-Gates`, and `Evidence` trailers.
- Acceptance, test, and security-gate IDs must be taken from the saved canonical definitions. Task-level mappings must derive from the linked acceptance criteria.
- Do not invent or silently remap IDs. If a trace is missing or inconsistent, resolve it in the saved source documents before preparing the commit.
- Evidence references must identify actual sanitized evidence. A placeholder is not evidence, and a test must not be reported as passing unless it was run and its result was inspected.
- Each increment's closing commit must summarize accepted tasks, acceptance results, review, and tracking updates.
- Create the annotated `*-closed` tag only after the closing commit has been reviewed and the increment's closure requirements are satisfied.
- Mandatory unresolved acceptance criteria or security gates block closure.

### 20.2 Per-task commit-text ownership

Ready-to-use per-task commit messages are defined in each increment's `GIT_COMMIT_STEP.md`, for example:

`docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/GIT_COMMIT_STEP.md`

Per-task commit text for every increment is in the per-task commit section of each increment's `GIT_COMMIT_STEP.md` (Section 9 in B-INC-001 and B-INC-002; Section 6 in B-INC-003 and B-INC-004, whose Section 9 holds the branch, closing commit and tag).

Do not reuse B-INC-001 task traces for another increment. The increment dossier and saved canonical definitions are the sources for each increment's commit text.
