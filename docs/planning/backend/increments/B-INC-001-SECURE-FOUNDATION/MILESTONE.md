# B-INC-001 — SECURE FOUNDATION

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 SECURE FOUNDATION |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/MILESTONE.md` |
| Status | Proposed |
| Canonical phase | P3 CONTROL PLANE |
| Prerequisite phase | P0 FOUNDATION |
| Parent milestone | B-M01 CONTROL PLANE |
| Owner role | Backend Technical Lead |
| Review roles | Architecture Owner, Security Owner, Database Technical Lead, Repository/CI Owner, QA Owner |
| Scope authority | [B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md) |
| Task register | [B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md) |
| Backend implementation plan | [Implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md) |
| Backend task register | [Backend task register](../../BACKEND_TASK_REGISTER.md) |
| Backend security gate | [Backend security gate](../../BACKEND_SECURITY_GATE.md) |
| Backend test strategy | [Backend test strategy](../../BACKEND_TEST_STRATEGY.md) |
| Backend acceptance criteria | [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md) |
| Dependency map | [Backend dependency map](../../BACKEND_DEPENDENCY_MAP.md) |
| Risk register | [Backend risk register](../../BACKEND_RISK_REGISTER.md) |
| Resource plan | [Backend resource plan](../../BACKEND_RESOURCE_PLAN.md) |

## 1. Purpose

B-INC-001 establishes the secure, reproducible foundation required for controlled implementation of B-M01 CONTROL PLANE.

The increment covers application structure, module boundaries, configuration, HTTP/API foundations, request context and correlation, health/readiness, structured logging, repository protection, secret-scanning controls, and reproducible local setup.

It is a planning and implementation increment within B-M01 CONTROL PLANE. It does not create a new canonical phase or replace the parent milestone.

## 2. Objective

Deliver a backend foundation that can be installed, configured, started, tested, reviewed, and checked in CI without relying on committed credentials or unresolved implementation assumptions.

The increment must demonstrate that:

- Application and tooling decisions required for implementation are recorded and approved.
- The application structure and module boundaries are reproducible.
- Configuration is validated at startup and fails safely when required settings are invalid.
- HTTP behavior, API versioning, request context, errors, correlation, health, and readiness have testable contracts.
- Structured logs do not disclose credentials or other prohibited sensitive values.
- Repository rules and automated scanning detect prohibited secret material.
- Required secret-scanning CI checks are blocking and demonstrably fail when a synthetic prohibited value is introduced.
- The reported DEVELOPMENT_SETUP placeholder finding has been inspected, corrected if necessary, and rescanned.
- Database connectivity and migration tooling are selected and testable without storing database credentials in the repository.
- Required acceptance evidence is retained.

## 3. Scope

### 3.1 Included work

1. Create the backend application structure using the approved runtime and language configuration.
2. Define backend module boundaries and dependency direction.
3. Establish typed configuration and startup validation.
4. Establish the HTTP transport and API v1 routing foundation.
5. Establish request context, request correlation, and the validation/error contract.
6. Implement health and readiness endpoints with documented semantics.
7. Implement structured logging and sensitive-data redaction.
8. Decide and record the package manager, HTTP framework, migration tooling, and secret scanner.
9. Establish repository ignore rules and safe configuration examples.
10. Establish local secret-scanning behavior and blocking CI enforcement.
11. Assess the agreed Git history for prohibited secret material and record the scope and findings.
12. Document the exposure-response process.
13. Correct and verify the DEVELOPMENT_SETUP placeholder finding.
14. Establish a reproducible clean-checkout workflow and retain test and review evidence.

### 3.2 Explicitly excluded

The following work is outside this increment unless an approved scope change states otherwise:

- Full authentication-provider implementation.
- Complete user, organization, membership, and role services.
- Project and platform-catalog APIs.
- Booking, credits, execution, results, or production services.
- Cloud production secret-manager deployment or workload-identity implementation owned by C-M01 FOUNDATION or C-M02 DEVELOPMENT.
- Production signing-key provisioning or cryptographic key custody.
- Physical robot operation or safety qualification.
- Coding-agent policy persistence and APIs whose architecture or database dependencies remain unresolved.
- Any change to the frozen phase or milestone model.

A local configuration interface or development substitute does not count as production cloud integration.

## 4. Source Task Mapping

The increment reuses existing B-M01 task IDs:

- KR-BE-1-001 through KR-BE-1-009.
- KR-BE-1-041.

New secure-foundation tasks use `KR-BINC-001-nnn`, as listed in `TASKS.md` and the parent `BACKEND_TASK_REGISTER.md`.

Existing task estimates remain unchanged. New-task estimates remain TBD until refinement.

## 5. Dependencies

| Dependency | Required input | Owner role | Required before |
|---|---|---|---|
| Canonical phase and milestone model | Approved names and parent scope | Program Planning Owner | All work |
| Backend architecture | Module boundaries and dependency rules | Architecture Owner | Application structure is frozen |
| Runtime/tooling choices | Approved versions and tooling decisions | Backend Technical Lead | Stack-dependent implementation |
| HTTP/API contract | API v1, error, and request conventions | Backend Technical Lead | HTTP/API foundation |
| PostgreSQL and migrations | Approved connection and migration approach | Database Technical Lead | Database integration verification |
| Secret-handling requirements | Configuration, scanning, redaction, and exposure-response requirements | Security Owner | Security controls |
| CI and repository controls | Required-check capability and scanner execution | Repository/CI Owner | Automated enforcement |
| Test environment | Reproducible unit and integration test commands | QA Owner | Acceptance testing |
| Cloud ownership boundary | Secret delivery and workload identity responsibilities | Cloud/Infrastructure Owner | Deployment integration planning |

Unresolved dependencies must be recorded and assigned. A recommendation is not an approved decision.

## 6. Open Technology Decisions

The following decisions remain open until their designated owner records an approval.

| Decision | Options to evaluate | Recommendation for review | Decision owner | Required evidence |
|---|---|---|---|---|
| Runtime and language version | Supported Node.js LTS and compatible TypeScript version combinations | Select a supported LTS runtime and a compatible pinned TypeScript toolchain; record exact versions only after compatibility review | Backend Technical Lead | Decision record, clean install, build and test evidence |
| Package manager | npm, pnpm, or another approved Node.js package manager | Prefer one package manager with a committed lockfile and reproducible CI installation; choose based on repository conventions and team tooling | Backend Technical Lead | Decision record and clean-checkout install |
| HTTP framework | Fastify, NestJS, Express, or another reviewed framework | Prefer a framework that supports schema validation, typed handlers, testability, and clear module boundaries without unnecessary framework coupling | Backend Technical Lead | Comparison, decision record, representative route test |
| Database migration tool | Prisma Migrate, Drizzle migrations, Knex migrations, node-pg-migrate, or another reviewed option | Select one migration authority that supports reviewable SQL changes, reproducible test execution, and CI verification | Database Technical Lead with Backend Technical Lead | Decision record, test migration, rollback/recovery approach |
| Secret scanner | detect-secrets, Gitleaks, or another reviewed scanner | Select a maintained scanner that supports local use and blocking CI; verify detection using synthetic test material | Security Owner with Repository/CI Owner | Tool/version record and demonstrated detection |
| CI platform and required checks | Existing repository-supported CI capability | Reuse the repository's supported CI platform and configure the security checks as required checks where the platform permits | Repository/CI Owner | Workflow review and demonstrated blocking behavior |
| Configuration library | Typed application configuration with startup validation; reviewed library or small internal layer | Prefer explicit typed validation and fail-fast startup over ad hoc environment-variable reads distributed across modules | Backend Technical Lead | Configuration schema and negative tests |

These options are candidates, not a statement that the repository already uses any of them. No task may silently freeze an option through implementation.

## 7. Security Invariants

The following requirements are mandatory:

1. No real secrets or security-key material may be stored in the repository.
2. Prohibited material includes private keys, private certificates, access tokens, passwords, API keys, database credentials, OAuth secrets, service-account keys, encryption/signing key material, real `.env` files, and logs or fixtures containing credentials.
3. `.env.example` and other examples must contain unmistakably nonfunctional placeholders.
4. Scanner findings must not be suppressed through broad exceptions that conceal real credentials.
5. Any exception must be narrow, documented, justified, reviewed, and covered by a test or other appropriate evidence.
6. Required security CI checks must fail closed if the scanner cannot execute or returns an error.
7. Secret values must not appear in logs, test reports, CI output, screenshots, or retained evidence.
8. If a real credential is discovered, follow the exposure-response process; deleting the value from the current file is not sufficient.
9. Production secret delivery and workload identity remain owned by the relevant cloud/infrastructure scope.
10. Repository scanning does not replace production key management or authorization controls.

## 8. Deliverables

- Reproducible backend application structure.
- Reviewed module-boundary decision.
- Recorded runtime, package manager, HTTP framework, migration tool, and scanner decisions.
- Typed configuration and startup validation.
- HTTP transport, API v1 routing, request context, request correlation, and error/validation contract.
- Health and readiness endpoints.
- Structured logging with redaction tests.
- Reviewed `.gitignore` and safe configuration examples.
- Local secret-scanning configuration.
- Blocking CI secret-scanning check.
- Agreed-scope history scan record.
- Exposure-response instructions.
- DEVELOPMENT_SETUP placeholder correction and rescan evidence.
- Clean-checkout verification.
- Completed acceptance matrix and review evidence.

## 9. Exit Criteria

The increment may be proposed for acceptance only when:

- All in-scope tasks are complete or have an explicitly approved disposition.
- Open decisions required for implementation have recorded decisions.
- A clean checkout can install dependencies and execute the documented verification commands.
- Required configuration validation and negative tests pass.
- API foundation behavior conforms to the reviewed contract.
- Structured logging passes sensitive-data redaction tests.
- Repository protections and blocking CI scanning are demonstrated.
- The DEVELOPMENT_SETUP finding is resolved or explicitly blocked with a recorded owner and no false pass.
- The agreed history scan has been performed and findings dispositioned.
- No known prohibited secret material is left unresolved in the reviewed scope.
- Database test connectivity and migration prerequisites are reproducible without committed credentials.
- Acceptance criteria, test evidence, and review findings are traceable.
- No unresolved critical security finding is accepted implicitly.
- The parent B-M01 CONTROL PLANE milestone remains governed by its own acceptance requirements.

## 10. Review and Acceptance Authority

| Area | Responsible role |
|---|---|
| Implementation completeness | Backend Technical Lead |
| Architecture and module boundaries | Architecture Owner |
| Secret policy and security-gate disposition | Security Owner |
| Repository checks and CI enforcement | Repository/CI Owner |
| Database and migration readiness | Database Technical Lead |
| Test evidence | QA Owner |
| Product/milestone acceptance coordination | Product Owner or designated milestone approver |

A single role may perform multiple responsibilities only where the program's review policy permits it. Required independent review must not be self-approved by the implementer.

## 11. Status

Status: Proposed.

This dossier defines intended scope and acceptance conditions. It does not assert that the work is implemented, that scans pass, or that B-INC-001 has been accepted.
