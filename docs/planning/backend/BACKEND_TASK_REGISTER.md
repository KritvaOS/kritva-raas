# Backend Task Register

## Document Control

| Field | Value |
|---|---|
| Document | Backend Task Register |
| Path | `docs/planning/backend/BACKEND_TASK_REGISTER.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION |

## 1. Purpose

This register provides a cross-increment view of backend implementation work. It preserves existing task identifiers, maps established B-M01 tasks to proposed implementation increments, identifies dependencies and review gates, and introduces a separate namespace for new B-INC-001 foundation tasks.

The register is a planning index. It does not replace the authoritative task descriptions, acceptance criteria, or review requirements in the existing milestone dossiers.

## 2. Register Rules

1. Existing task identifiers must not be renamed or reassigned to unrelated work.
2. Existing B-M01 task identifiers are retained exactly as recorded in the established B-M01 register.
3. New tasks introduced specifically for B-INC-001 use the namespace `KR-BINC-001-nnn`.
4. A new identifier must be checked against the repository-wide task inventory before it is accepted.
5. A task may have dependencies across increments or milestones; its mapping does not transfer ownership of those dependencies.
6. Tasks that span multiple increments must retain their existing ID and be planned so that each increment has a verifiable acceptance boundary.
7. A task is not complete merely because implementation has started, code has been committed, or a local test has passed.
8. Task status, estimates, and owner assignments must be updated only when supported by actual planning or implementation evidence.
9. Owner roles are used throughout. Individual assignments and capacity are TBD until explicitly decided.
10. The status Proposed means that the register and increment mappings require review; it does not mean that every listed task is ready to start.

## 3. Status Vocabulary

Use the following status values consistently:

| Status | Meaning |
|---|---|
| Proposed | Identified in planning but not approved for execution |
| Ready | Dependencies and acceptance requirements are sufficiently defined and the task is authorized to start |
| In Progress | Implementation has started |
| Blocked | Work cannot proceed because a dependency, decision, review, or required input is unresolved |
| In Review | Implementation is complete enough for the required verification or review |
| Accepted | Required acceptance evidence has been reviewed and approved |
| Deferred | Explicitly postponed with a recorded reason and decision owner |
| Rejected | The proposed task or implementation was rejected with a recorded rationale |

Do not infer task status from the existence of a branch, commit, pull request, or passing subset of tests.

## 4. Implementation Increment Mapping

| Increment | Proposed name | Primary task scope | Current planning status |
|---|---|---|---|
| B-INC-001 | SECURE FOUNDATION | Existing application-foundation tasks, structured logging, relevant foundation tests, and new repository security-control tasks | Proposed; first increment for review |
| B-INC-002 | IDENTITY-ORGANIZATION | Existing identity, user, organization, membership, role, authorization, and tenant-context tasks | Proposed; dossier `increments/B-INC-002-IDENTITY-ORGANIZATION/` |
| B-INC-003 | PROJECTS-PLATFORM-CATALOG | Existing project and platform-catalog tasks | Proposed; dossier `increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/` |
| B-INC-004 | AUDIT-TRANSACTIONS-IDEMPOTENCY | Existing transaction, idempotency, audit, migration, and related verification tasks | Proposed; dossier `increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/` |

This mapping defines planning boundaries only. B-M01 CONTROL PLANE remains the authoritative backend milestone. Database and cloud work must remain aligned with their respective milestone dossiers.

## 5. Existing B-M01 Task Mapping

The following mapping preserves the existing task identifiers and the established task descriptions summarized in the current B-M01 register.

### 5.1 Application foundation — B-INC-001

| Existing task ID | Existing task responsibility | Proposed increment mapping | Dependency or note |
|---|---|---|---|
| KR-BE-1-001 | Create Control Plane application structure | B-INC-001 | Application bootstrap and reproducible project structure |
| KR-BE-1-002 | Define backend module boundaries | B-INC-001 | Must align with the approved backend architecture |
| KR-BE-1-003 | Establish configuration framework | B-INC-001 | Includes typed configuration and startup validation |
| KR-BE-1-004 | Establish HTTP transport | B-INC-001 | Depends on the approved HTTP-framework decision |
| KR-BE-1-005 | Implement request context | B-INC-001 | Must support consistent request-scoped behavior |
| KR-BE-1-006 | Implement API v1 routing | B-INC-001 | Must follow the established REST API v1 contract |
| KR-BE-1-007 | Establish validation and error contract | B-INC-001 | Contract and test requirements must be explicit |
| KR-BE-1-008 | Implement request correlation | B-INC-001 | Correlation data must not expose credentials |
| KR-BE-1-009 | Implement health and readiness endpoints | B-INC-001 | Readiness must reflect required startup dependencies |
| KR-BE-1-041 | Establish structured logging | B-INC-001 | Must include sensitive-data redaction and verification |

### 5.2 Identity and organization — B-INC-002

Detailed task entries, acceptance traces and commit text: [`increments/B-INC-002-IDENTITY-ORGANIZATION/TASKS.md`](increments/B-INC-002-IDENTITY-ORGANIZATION/TASKS.md).

| Existing task ID | Existing task responsibility | Proposed increment mapping | Dependency or note |
|---|---|---|---|
| KR-BE-1-010 | Define identity model | B-INC-002 | Authentication contract and principal semantics |
| KR-BE-1-011 | Implement UserRepository | B-INC-002 | Requires the agreed persistence model |
| KR-BE-1-012 | Establish authentication adapter boundary | B-INC-002 | Must preserve provider-neutral architecture |
| KR-BE-1-013 | Implement current-user endpoint | B-INC-002 | Depends on identity and authentication behavior |
| KR-BE-1-014 | Define Organization model | B-INC-002 | Coordinate with DB-M01 FOUNDATION |
| KR-BE-1-015 | Implement OrganizationRepository | B-INC-002 | Requires the approved organization schema |
| KR-BE-1-016 | Implement MembershipRepository | B-INC-002 | Must preserve organization-membership integrity |
| KR-BE-1-017 | Implement OrganizationService | B-INC-002 | Depends on organization and membership behavior |
| KR-BE-1-018 | Implement organization APIs | B-INC-002 | Requires API contract and authorization review |
| KR-BE-1-019 | Define role and permission model | B-INC-002 | Permission semantics must be explicit |
| KR-BE-1-020 | Implement authorization policy layer | B-INC-002 | Deny-by-default behavior must be tested |
| KR-BE-1-021 | Enforce tenant context | B-INC-002 | Coordinate application and database tenant controls |

### 5.3 Projects and platform catalog — B-INC-003

Detailed task entries, acceptance traces and commit text: [`increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/TASKS.md`](increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/TASKS.md).

| Existing task ID | Existing task responsibility | Proposed increment mapping | Dependency or note |
|---|---|---|---|
| KR-BE-1-022 | Define Project model | B-INC-003 | Organization-scoped project metadata |
| KR-BE-1-023 | Implement ProjectRepository | B-INC-003 | Must use the approved schema and repository conventions |
| KR-BE-1-024 | Implement ProjectService | B-INC-003 | Must enforce business and authorization rules |
| KR-BE-1-025 | Implement project APIs | B-INC-003 | Must follow REST API v1 contracts |
| KR-BE-1-026 | Enforce project authorization | B-INC-003 | Must include unauthorized and cross-tenant tests |
| KR-BE-1-027 | Define platform-catalog model | B-INC-003 | Confirm ownership against B-M03 PLATFORM |
| KR-BE-1-028 | Implement PlatformRepository | B-INC-003 | Coordinate catalog persistence and ownership |
| KR-BE-1-029 | Implement platform-catalog service | B-INC-003 | Coordinate with the established platform boundary |
| KR-BE-1-030 | Implement platform-catalog APIs | B-INC-003 | Requires contract and validation tests |
| KR-BE-1-031 | Enforce platform-administration authorization | B-INC-003 | Administrative permissions must be tested |

The B-INC-003 mapping does not authorize moving B-M03 PLATFORM deliverables into B-M01 CONTROL PLANE. Any overlap must be reconciled with the authoritative milestone scope before implementation.

### 5.4 Transactions, idempotency, and audit — B-INC-004

Detailed task entries, acceptance traces and commit text: [`increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/TASKS.md`](increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/TASKS.md).

| Existing task ID | Existing task responsibility | Proposed increment mapping | Dependency or note |
|---|---|---|---|
| KR-BE-1-032 | Establish migration baseline | B-INC-004 | Coordinate with DB-M01 FOUNDATION and the approved migration-tool decision |
| KR-BE-1-033 | Establish transaction-boundary pattern | B-INC-004 | Must align with database transaction semantics |
| KR-BE-1-034 | Implement IdempotencyRepository | B-INC-004 | Requires the approved idempotency data contract |
| KR-BE-1-035 | Implement idempotency middleware/service | B-INC-004 | Requires defined replay and conflict behavior |
| KR-BE-1-036 | Implement AuditRepository | B-INC-004 | Audit persistence and data classification must be agreed |
| KR-BE-1-037 | Implement AuditService | B-INC-004 | Must enforce required audit behavior and safe payload handling |
| KR-BE-1-038 | Implement identity audit hooks | B-INC-004 | Depends on the identity and organization operations |
| KR-BE-1-039 | Implement project audit hooks | B-INC-004 | Depends on project operations and event semantics |
| KR-BE-1-040 | Implement platform-administration audit hooks | B-INC-004 | Depends on platform-catalog ownership and authorization |

The mapping of KR-BE-1-032 to B-INC-004 is a proposed sequencing choice, not a claim that migration-tool selection or the DB-M01 baseline can be deferred. Any migration prerequisite needed by B-INC-001 must be resolved early enough to unblock the foundation.

### 5.5 Existing verification, review, and acceptance tasks

| Existing task ID | Existing task responsibility | Proposed increment mapping | Dependency or note |
|---|---|---|---|
| KR-BE-1-042 | Repository unit tests | Cross-increment | Tests must be added with the relevant implementation; foundation coverage starts in B-INC-001 |
| KR-BE-1-043 | API contract tests | Cross-increment | Begin with the foundation API contract and extend as routes are added |
| KR-BE-1-044 | Authorization tests | B-INC-002 and B-INC-003 | Must include permitted and denied operations |
| KR-BE-1-045 | Tenant-isolation tests | B-INC-002 and B-INC-003 | Must cover application and required database enforcement |
| KR-BE-1-046 | Audit tests | B-INC-004 | Must cover required events, failure behavior, and sensitive-data exclusion |
| KR-BE-1-047 | Migration tests | B-INC-004 (sole owner) | The B-INC-001 prerequisite is migration-tool readiness, delivered by `KR-BINC-001-004` and verified by `B-INC-001-AC-13`; it is not a slice of KR-BE-1-047. KR-BE-1-047 is committed, statused and accepted only in B-INC-004. |
| KR-BE-1-048 | API integration tests | Cross-increment | Must be scoped to each increment and the integrated milestone |
| KR-BE-1-049 | End-to-end tests | Cross-increment | Must verify the applicable approved user journey and integration behavior |
| KR-BE-1-050 | Security review | Cross-increment | B-INC-001 requires an initial security review and enforceable secret controls |
| KR-BE-1-051 | Architecture review | Cross-increment | Must validate module boundaries and milestone ownership |
| KR-BE-1-052 | Performance baseline | B-INC-001 foundation and B-M01 acceptance | Baseline scope and environment must be documented |
| KR-BE-1-053 | Documentation | Cross-increment | Setup, configuration, testing, API behavior, and operational guidance |
| KR-BE-1-054 | Milestone acceptance and evidence | B-M01 CONTROL PLANE | Official milestone acceptance remains governed by the B-M01 dossier |

Cross-increment tasks must not be marked accepted based solely on an early increment's partial coverage. The task owner must identify the specific acceptance scope and evidence applicable to the increment and retain the remaining obligations until their required coverage is complete.

## 6. Existing Coding-Agent Policy Tasks

The existing coding-agent policy task identifiers are preserved. Their work is not automatically included in B-INC-001.

| Existing task ID | Existing responsibility | Planning disposition | Gate |
|---|---|---|---|
| KR-CA-022 | Organization coding-agent policy model | Deferred to the approved coding-agent implementation sequence | SYS-ADR-007 and applicable schema decisions |
| KR-CA-023 | Organization coding-agent policy API | Deferred to the approved coding-agent implementation sequence | Approved integration and API contracts |
| KR-CA-024 | Coding-agent policy validation | Deferred to the approved coding-agent implementation sequence | Approved policy semantics and validation contract |
| KR-CA-025 | Coding-agent policy audit behavior | Deferred to the approved coding-agent implementation sequence | Approved audit contract and persistence boundary |
| KR-CA-026 | Coding-agent policy tests | Deferred to the approved coding-agent implementation sequence | Policy behavior, schema, and integration gates |

These tasks must not bypass SYS-ADR-007 or the applicable DB-M02 CORE DATA and KR-CA-031 dependency gate. Their detailed implementation sequencing remains subject to the approved coding-agent integration contract and the disposition of the outstanding decision.

The backend must not default to storing provider credentials, source code, prompts, or execution transcripts. Any proposed change to that boundary requires explicit architecture, security, and data-governance review.

## 7. New B-INC-001 Tasks

The following new tasks cover foundation controls that are not adequately represented by the existing B-M01 task descriptions. Their identifiers use the dedicated `KR-BINC-001-nnn` namespace.

All tasks in this section are Proposed. Dependencies and acceptance details must be refined in the B-INC-001 dossier before authorization.

| New task ID | Task | Dependencies | Required evidence | Owner role |
|---|---|---|---|---|
| KR-BINC-001-001 | Evaluate and record runtime and language versions | Existing repository constraints and B-M01 baseline | Decision record covering supported options, recommendation, compatibility, and approval | Backend Technical Lead |
| KR-BINC-001-002 | Evaluate and record package manager and lockfile policy | Runtime and language decisions | Approved package-manager decision and reproducible-install verification | Backend Technical Lead |
| KR-BINC-001-003 | Evaluate and record HTTP framework | Runtime and API architecture requirements | Decision record covering routing, validation, error handling, maintenance, and testing | Backend Technical Lead |
| KR-BINC-001-004 | Evaluate and record PostgreSQL migration tool | Database architecture and DB-M01 requirements | Decision record and validation approach reviewed by the Database Technical Lead | Backend Technical Lead |
| KR-BINC-001-005 | Define repository secret-protection policy and scope | Security requirements and repository conventions | Reviewed list of prohibited material, permitted placeholders, scanning scope, and exception rules | Security Owner |
| KR-BINC-001-006 | Add and review sensitive-file ignore rules | Repository layout and approved secret-protection policy | Review evidence that common local secret files and generated sensitive artifacts are excluded without hiding required source files | Repository/CI Owner |
| KR-BINC-001-007 | Add safe configuration examples | Configuration framework and secret-protection policy | Examples use nonfunctional placeholders only and are tested against configuration parsing | Backend Technical Lead |
| KR-BINC-001-008 | Evaluate and select a secret-scanning tool | Security policy and repository/CI capabilities | Decision record covering detection coverage, local use, CI integration, maintenance, and false-positive handling | Security Owner |
| KR-BINC-001-009 | Integrate local pre-commit secret detection where supported | Approved scanner and repository workflow | Demonstrated detection of safe synthetic test credentials before commit | Repository/CI Owner |
| KR-BINC-001-010 | Add blocking CI secret scanning | Approved scanner and CI platform | CI fails for confirmed synthetic secret fixtures; findings are handled without exposing values | Repository/CI Owner |
| KR-BINC-001-011 | Assess repository history for secret exposure | Approved scanner and available repository history | Recorded scan scope, commit/ref coverage, findings, limitations, and disposition | Security Owner |
| KR-BINC-001-012 | Define secret-exposure response procedure | Security policy and operational ownership | Documented detection, escalation, revocation or rotation, cleanup, and verification workflow | Security Owner |
| KR-BINC-001-013 | Test configuration startup failures | Configuration framework | Automated tests for missing, malformed, and invalid required configuration; no secret values in output | Backend Technical Lead |
| KR-BINC-001-014 | Test sensitive-data redaction in logs | Structured logging implementation | Automated tests using synthetic credentials and evidence that logs do not expose the test values | Backend Technical Lead |
| KR-BINC-001-015 | Verify secret-scanner exception handling | Selected scanner and CI integration | Reviewed, narrow exception mechanism with tests or documented validation and auditable rationale | Security Owner |
| KR-BINC-001-016 | Document security-control operation and evidence | Approved scanner and CI behavior | Documentation of invocation, failure interpretation, safe evidence handling, and remediation expectations | Documentation Owner |
| KR-BINC-001-017 | Verify clean-checkout setup and foundational test workflow | Application skeleton, package-manager decision, and test commands | Reproducible setup and test results from a clean environment | Backend Technical Lead |
| KR-BINC-001-018 | Adopt source header standard and CI check | kritva-core header checker; owner license decision | `docs/development/SOURCE_HEADER_STANDARD.md`, checker, unit tests, `Source Header Check` workflow and pre-commit hook; all in-scope files carry compliant headers. **Accepted 2026-10-10 (PB-007).** | Backend Technical Lead |

### 7.1 New-task acceptance rules

For every new task:

- Its identifier must be checked for repository-wide uniqueness before use.
- Its acceptance criteria must be measurable.
- Its evidence must identify the tested commit or repository state.
- Synthetic credentials used by security tests must be clearly nonproduction and must not be usable against real services.
- Scanner reports and CI logs must not reproduce actual credential values.
- An unresolved scanner finding must be classified and dispositioned by the Security Owner.
- A finding that indicates potential real credential exposure must trigger the approved response procedure.
- A task that depends on an undecided technology choice remains Blocked until that decision is approved or an explicitly approved provisional path is recorded.

## 8. Dependency Rules

### 8.1 B-INC-001 dependencies

B-INC-001 must coordinate with:

- B-M01 CONTROL PLANE for the existing application and API requirements.
- DB-M01 FOUNDATION for database connectivity, migration prerequisites, and persistence boundaries.
- C-M01 FOUNDATION for secret-manager, workload-identity, and cloud security integration boundaries.
- Repository/CI ownership for required checks and branch-protection behavior.
- Security ownership for secret scanning, logging redaction, history assessment, and exposure response.

The increment may establish local abstractions and safe development defaults, but must not claim that cloud-managed secret injection, production IAM, or production key management is complete without evidence from the relevant cloud workstream.

### 8.2 Cross-increment dependencies

B-INC-002 depends on the foundation and approved persistence/authentication boundaries.

B-INC-003 depends on the foundation and, for organization-scoped operations, the relevant authorization and tenant-context capabilities. Platform-catalog ownership must be reconciled with B-M03 PLATFORM.

B-INC-004 depends on the database transaction and migration contracts, and on the business operations that require idempotency and audit hooks.

A task may begin only when its specific prerequisites are met. The register must not be interpreted as authorization to execute all tasks in numeric order.

## 9. Mandatory Security Gate

The repository security invariant applies to all tasks and increments:

**No real secrets or security-key material may be stored in the repository.**

This includes private keys, private certificates, signing and encryption key material, passwords, access tokens, API keys, OAuth secrets, database credentials, service-account keys, populated environment files, and logs or fixtures containing real credentials.

The implementation must distinguish:

- **Repository policy:** what may and may not be committed.
- **Local developer protection:** ignore rules and pre-commit detection.
- **CI enforcement:** blocking checks for confirmed findings.
- **History assessment:** the actual refs and history examined.
- **Runtime secret handling:** approved external injection and secret-management interfaces.
- **Exposure response:** escalation, revocation or rotation, cleanup, and verification.

Passing one scanner run does not prove that all branches, historical commits, external copies, or runtime systems are clean. The scan scope and known limitations must be documented.

No exception mechanism may authorize committing actual secret values. False-positive handling must be narrow, reviewed, and auditable.

## 10. Ownership and Decision Responsibilities

| Responsibility | Owner role |
|---|---|
| Cross-increment task register and sequencing | Backend Technical Lead |
| Backend module and API architecture | Backend Technical Lead |
| Database schema, migration, and tenant-isolation decisions | Database Technical Lead |
| Secret-management and key-management security requirements | Security Owner |
| Scanner choice and security finding disposition | Security Owner |
| Repository ignore rules, local hooks, and CI enforcement | Repository/CI Owner |
| Cloud IAM, secret-manager integration, and production infrastructure | Cloud/Infrastructure Owner |
| API and Studio integration contracts | Frontend Technical Lead and Backend Technical Lead |
| Coding-agent policy and integration gates | Coding-Agent Architecture Owner |
| Planning and operational documentation | Documentation Owner |
| Official milestone acceptance | Relevant Milestone Owner |

Specific people, capacity, and resource assignments are TBD and must be decided by the relevant owner. This register does not infer staffing or approval from repository history.

## 11. Estimate and Schedule Policy

No fixed dates, budgets, or FTE values are established in this register.

Task estimates must be recorded in the relevant task dossier after reviewing:

- Scope and acceptance complexity.
- Technology decisions and implementation constraints.
- Upstream dependencies and required coordination.
- Automated test development and execution.
- Security, architecture, and code review.
- Documentation and evidence retention.
- Expected remediation and re-review effort.

Estimates are planning inputs, not delivery commitments. Unknown inputs must be marked TBD with the decision owner identified.

## 12. Reporting and Change Control

The register should be updated when:

- An existing task is mapped to an approved increment.
- A new task is approved and its ID verified.
- A dependency or decision changes task readiness.
- A task is started, blocked, reviewed, accepted, deferred, or rejected.
- A security finding changes the execution plan.
- A review identifies a missing task or acceptance condition.
- A milestone owner changes the authorized scope.

Changes to task IDs, milestone ownership, acceptance criteria, or security gates require explicit review. A planning change must not silently weaken a security invariant or bypass a required decision.

## 13. Current Status

The task register is Proposed.

The immediate priority is B-INC-001 SECURE FOUNDATION. Its complete dossier must establish actionable task descriptions, dependencies, acceptance criteria, review requirements, and retained evidence before the increment is frozen.

Dossiers for B-INC-002 to B-INC-004 are prepared (Proposed). Their implementation remains gated on B-INC-001 being reviewed and frozen and on the dependencies recorded in each dossier.

The repository's current secret-protection status is not asserted by this document. Scanner execution, CI behavior, history assessment, and any findings must be verified against the actual repository state before a clean-status claim is made.
