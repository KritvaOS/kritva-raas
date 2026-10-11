# B-INC-001 — SECURE FOUNDATION Tasks

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 SECURE FOUNDATION Tasks |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/TASKS.md` |
| Status | Proposed |
| Canonical phase | P3 CONTROL PLANE |
| Parent milestone | B-M01 CONTROL PLANE |
| Owner role | Backend Technical Lead |
| Parent task register | [B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md) |
| Backend task register | [Backend task register](../../BACKEND_TASK_REGISTER.md) |
| Acceptance criteria | [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md) |
| Test plan | [Increment test plan — Batch 5](TEST_PLAN.md) |
| Security review | [Security review — Batch 5](SECURITY_REVIEW.md) |
| Review checklist | [Review checklist](REVIEW_CHECKLIST.md) |

## 1. Purpose and Rules

This register defines the existing B-M01 tasks assigned to B-INC-001 and the proposed new secure-foundation tasks.

Existing task IDs and estimates are retained. New tasks use `KR-BINC-001-nnn`; their estimates remain TBD until refinement.

Every task identifies its description, inputs, outputs, dependencies, owner role, estimate, definition of done, and linked acceptance, test, and security-gate IDs.

The linked IDs identify the evidence required for the task. They do not imply that the criteria have passed.

## 2. Task Status Values

Use the repository's accepted task-status convention. At minimum, distinguish:

- Not started.
- Ready.
- In progress.
- Blocked.
- In review.
- Accepted.

A task must not be marked Accepted solely because files or code exist. Required evidence and reviews must be complete.

## 3. Existing B-M01 Tasks Assigned to B-INC-001

### KR-BE-1-001 — Create Control Plane application structure

- **Description:** Establish the application skeleton and reproducible project layout using the approved runtime and language decisions.
- **Inputs:** B-M01 scope; backend architecture; approved runtime/language decision; package-manager decision.
- **Outputs/files:** Application entry point, package metadata, lockfile, source/test structure, build and test scripts, setup documentation.
- **Dependencies:** P0 FOUNDATION; approved decisions KR-BINC-001-001 and KR-BINC-001-002.
- **Owner role:** Backend Engineer; Backend Technical Lead accountable.
- **Estimate:** 2d (existing estimate).
- **Definition of done:** Clean checkout installs reproducibly; build and baseline tests run; application entry point is explicit; no credentials are embedded; structure matches the reviewed architecture.
- **Linked AC:** B-INC-001-AC-01, B-INC-001-AC-02.
- **Linked tests:** BTS-001, BTS-036.
- **Linked security gates:** SEC-GATE-003, SEC-GATE-004, SEC-GATE-013.
- **Status:** Ready (2026-10-11). The approvals of `KR-BINC-001-001` and `KR-BINC-001-002` and the owner answers in [`plans/KR-BE-1-001-application-structure-plan.md`](plans/KR-BE-1-001-application-structure-plan.md) are recorded. Not started. Linked tests and gates are NOT RUN. Not Accepted.

### KR-BE-1-002 — Define backend module boundaries

- **Description:** Record module ownership, dependency direction, and prohibited cross-module coupling.
- **Inputs:** Backend architecture; B-M01 scope; domain ownership boundaries.
- **Outputs/files:** Module-boundary decision or architecture update; dependency rules; architecture review evidence.
- **Dependencies:** KR-BE-1-001; architecture review input.
- **Owner role:** Architecture Owner.
- **Estimate:** 1.5d (existing estimate).
- **Definition of done:** Each initial module has a documented responsibility; allowed dependency directions are explicit; prohibited cycles/direct cross-domain writes are documented; reviewer findings are dispositioned.
- **Linked AC:** B-INC-001-AC-02, B-INC-001-AC-03.
- **Linked tests:** BTS-001, BTS-004.
- **Linked security gates:** SEC-GATE-003.

### KR-BE-1-003 — Establish configuration framework

- **Description:** Provide a typed configuration boundary with startup validation and safe failure behavior.
- **Inputs:** Configuration requirements; secret-management requirements; approved runtime and library decisions.
- **Outputs/files:** Configuration schema/module; safe example configuration; configuration tests; setup documentation.
- **Dependencies:** KR-BE-1-001; KR-BINC-001-005; KR-BINC-001-007.
- **Owner role:** Backend Engineer.
- **Estimate:** 1.5d (existing estimate).
- **Definition of done:** Required values are validated at startup; invalid configuration fails before readiness; defaults are explicit; errors do not reveal secret values; examples contain only nonfunctional placeholders.
- **Linked AC:** B-INC-001-AC-04, B-INC-001-AC-05.
- **Linked tests:** BTS-002, BTS-003, BTS-010.
- **Linked security gates:** SEC-GATE-003, SEC-GATE-008.

### KR-BE-1-004 — Establish HTTP transport

- **Description:** Implement the initial HTTP server and lifecycle using the approved framework.
- **Inputs:** HTTP framework decision; API contract; configuration framework.
- **Outputs/files:** HTTP server setup; lifecycle integration; transport tests; documented startup/shutdown behavior.
- **Dependencies:** KR-BE-1-001; KR-BINC-001-003.
- **Owner role:** Backend Engineer.
- **Estimate:** 2d (existing estimate).
- **Definition of done:** Server starts and stops predictably; transport errors are handled; tests exercise startup and request handling; no secrets are emitted in diagnostics.
- **Linked AC:** B-INC-001-AC-06.
- **Linked tests:** BTS-007, BTS-032.
- **Linked security gates:** Not applicable.

### KR-BE-1-005 — Implement request context

- **Description:** Establish request-scoped context for downstream handlers and services.
- **Inputs:** HTTP transport; request-context requirements; API contract.
- **Outputs/files:** Request-context implementation; tests; usage guidance.
- **Dependencies:** KR-BE-1-004.
- **Owner role:** Backend Engineer.
- **Estimate:** 1.5d (existing estimate).
- **Definition of done:** Context is created per request, is not accidentally shared between requests, and is propagated through the documented request path.
- **Linked AC:** B-INC-001-AC-07.
- **Linked tests:** BTS-005, BTS-006.
- **Linked security gates:** SEC-GATE-009.

### KR-BE-1-006 — Implement API v1 routing

- **Description:** Establish versioned API routing consistent with the reviewed API contract.
- **Inputs:** HTTP transport; API v1 contract; error and validation conventions.
- **Outputs/files:** API v1 router; route-registration pattern; routing tests.
- **Dependencies:** KR-BE-1-004; KR-BINC-001-003.
- **Owner role:** Backend Engineer.
- **Estimate:** 2d (existing estimate).
- **Definition of done:** Routes are mounted under the agreed API version; unknown routes and methods have defined behavior; route registration is testable; no unapproved domain API is added.
- **Linked AC:** B-INC-001-AC-06, B-INC-001-AC-08.
- **Linked tests:** BTS-007, BTS-032.
- **Linked security gates:** SEC-GATE-009.

### KR-BE-1-007 — Implement validation/error contract

- **Description:** Implement consistent validation failures and API error responses.
- **Inputs:** API contract; validation requirements; HTTP framework.
- **Outputs/files:** Validation/error handling; response schemas; negative tests.
- **Dependencies:** KR-BE-1-006.
- **Owner role:** Backend Engineer.
- **Estimate:** 2d (existing estimate).
- **Definition of done:** Invalid requests receive the agreed error format; internal exception details and secrets are not returned; error behavior is covered by tests.
- **Linked AC:** B-INC-001-AC-08, B-INC-001-AC-09.
- **Linked tests:** BTS-007.
- **Linked security gates:** SEC-GATE-009.

### KR-BE-1-008 — Implement request correlation

- **Description:** Create or validate a request-correlation identifier and propagate it through logs and request context.
- **Inputs:** Request-context implementation; logging requirements; correlation contract.
- **Outputs/files:** Correlation middleware/helper; tests; usage documentation.
- **Dependencies:** KR-BE-1-005.
- **Owner role:** Backend Engineer.
- **Estimate:** 1d (existing estimate).
- **Definition of done:** Requests have a correlation identifier; invalid external identifiers are handled safely; the identifier is consistently propagated; credentials and payload secrets are not copied into the identifier or logs.
- **Linked AC:** B-INC-001-AC-07, B-INC-001-AC-10.
- **Linked tests:** BTS-005, BTS-006, BTS-009.
- **Linked security gates:** SEC-GATE-009.

### KR-BE-1-009 — Implement health/readiness endpoints

- **Description:** Implement health and readiness endpoints with distinct, documented semantics.
- **Inputs:** HTTP transport; configuration validation; service startup lifecycle.
- **Outputs/files:** Health/readiness routes; lifecycle tests; operational documentation.
- **Dependencies:** KR-BE-1-004; KR-BE-1-003.
- **Owner role:** Backend Engineer.
- **Estimate:** 1d (existing estimate).
- **Definition of done:** Health and readiness semantics are documented and tested; readiness does not report success before required startup validation completes; responses do not disclose credentials or internal sensitive configuration.
- **Linked AC:** B-INC-001-AC-11.
- **Linked tests:** BTS-008.
- **Linked security gates:** SEC-GATE-008.

### KR-BE-1-041 — Implement structured backend logging

- **Description:** Establish structured logging for the backend and verify that prohibited sensitive values are not emitted.
- **Inputs:** Logging requirements; request correlation; secret-handling policy; approved logging library or implementation decision.
- **Outputs/files:** Logging module/configuration; redaction rules; tests; operational guidance.
- **Dependencies:** KR-BE-1-008; KR-BINC-001-005; KR-BINC-001-014.
- **Owner role:** Backend Engineer; Security Owner reviews redaction behavior.
- **Estimate:** 1.5d (existing estimate).
- **Definition of done:** Logs are structured and correlated; prohibited secret-bearing fields are excluded or redacted; tests demonstrate redaction; failure diagnostics do not expose configuration secrets.
- **Linked AC:** B-INC-001-AC-10, B-INC-001-AC-12.
- **Linked tests:** BTS-003, BTS-006, BTS-009.
- **Linked security gates:** SEC-GATE-009.

## 4. New Secure-Foundation Tasks

All new tasks below have an estimate of **TBD**. Each must be refined and approved before its effort is included in a committed resource or schedule baseline.

### KR-BINC-001-001 — Decide runtime and language versions

- **Description:** Evaluate supported Node.js LTS and TypeScript combinations; record the selected versions without assuming a choice in advance.
- **Inputs:** Repository constraints; compatibility requirements; maintenance and support requirements.
- **Outputs/files:** Decision record; version policy; updated setup/CI requirements.
- **Dependencies:** None beyond repository and architecture context.
- **Owner role:** Backend Technical Lead.
- **Estimate:** TBD.
- **Definition of done:** Options, recommendation, compatibility evidence, decision owner, and approved version policy are recorded.
- **Linked AC:** B-INC-001-AC-01.
- **Linked tests:** BTS-001, BTS-036.
- **Linked security gates:** SEC-GATE-004, SEC-GATE-013.
- **Status:** In Review. Decision record [`decisions/KR-BINC-001-001-runtime-language.md`](decisions/KR-BINC-001-001-runtime-language.md) is Approved by the Backend Technical Lead on 2026-10-11 within the scope in its Section 9; linked tests and gates are NOT RUN. Not Accepted: acceptance is a separate step under the Definition of Done.

### KR-BINC-001-002 — Decide package manager and lockfile policy

- **Description:** Select the package manager and reproducible installation approach.
- **Inputs:** Existing repository conventions; CI capability; dependency-management requirements.
- **Outputs/files:** Decision record; package-manager policy; lockfile requirements.
- **Dependencies:** KR-BINC-001-001.
- **Owner role:** Backend Technical Lead.
- **Estimate:** TBD.
- **Definition of done:** One package manager is selected; lockfile and clean-install rules are documented; CI behavior is specified.
- **Linked AC:** B-INC-001-AC-01, B-INC-001-AC-02.
- **Linked tests:** BTS-001, BTS-036.
- **Linked security gates:** SEC-GATE-003, SEC-GATE-004, SEC-GATE-013.
- **Status:** In Review. Decision record [`decisions/KR-BINC-001-002-package-manager-lockfile.md`](decisions/KR-BINC-001-002-package-manager-lockfile.md) is Approved by the Backend Technical Lead on 2026-10-11 within the scope in its Section 8; linked tests and gates are NOT RUN. Not Accepted: acceptance is a separate step under the Definition of Done.

### KR-BINC-001-003 — Decide HTTP framework

- **Description:** Evaluate HTTP framework options against typed handlers, schema validation, testability, module boundaries, and maintenance requirements.
- **Inputs:** API contract; module-boundary requirements; supported runtime.
- **Outputs/files:** Decision record; framework selection and constraints.
- **Dependencies:** KR-BINC-001-001; KR-BE-1-002.
- **Owner role:** Backend Technical Lead.
- **Estimate:** TBD.
- **Definition of done:** Options and trade-offs are documented; a recommendation is approved; a representative route can be implemented and tested without violating architecture boundaries.
- **Linked AC:** B-INC-001-AC-03, B-INC-001-AC-06.
- **Linked tests:** BTS-004, BTS-007, BTS-032.
- **Linked security gates:** Not applicable.

### KR-BINC-001-004 — Decide database migration tool

- **Description:** Evaluate migration tooling and establish the migration authority for backend database changes.
- **Inputs:** DB-M01 FOUNDATION requirements; PostgreSQL integration needs; CI and test requirements.
- **Outputs/files:** Decision record; migration-tool policy; migration-test procedure.
- **Dependencies:** Database Technical Lead review; package/runtime compatibility.
- **Owner role:** Database Technical Lead with Backend Technical Lead.
- **Estimate:** TBD.
- **Definition of done:** Tool choice and rationale are recorded; clean-database migration verification is defined; credentials are injected externally; rollback/recovery behavior is documented.
- **Linked AC:** B-INC-001-AC-13.
- **Linked tests:** BTS-011, BTS-012, BTS-013.
- **Linked security gates:** SEC-GATE-011.

### KR-BINC-001-005 — Define secret-handling and configuration boundary

- **Description:** Define permitted secret sources, prohibited repository content, configuration ownership, and logging boundaries.
- **Inputs:** `SECRETS_MANAGEMENT.md`; `KEY_MANAGEMENT.md`; security requirements; cloud ownership boundary.
- **Outputs/files:** Reviewed policy reference or implementation-facing configuration requirements.
- **Dependencies:** Security Owner and Cloud/Infrastructure Owner review.
- **Owner role:** Security Owner.
- **Estimate:** TBD.
- **Definition of done:** Secret classes, permitted delivery boundary, prohibited storage, redaction, and escalation requirements are explicit; cloud-owned production implementation remains with the cloud workstream.
- **Linked AC:** B-INC-001-AC-04, B-INC-001-AC-12, B-INC-001-AC-14.
- **Linked tests:** BTS-002, BTS-003, BTS-009, BTS-010.
- **Linked security gates:** SEC-GATE-002, SEC-GATE-008, SEC-GATE-009.
- **Status:** In Review. Policy record [`decisions/KR-BINC-001-005-secret-handling-configuration.md`](decisions/KR-BINC-001-005-secret-handling-configuration.md) is Proposed; Security Owner approval and Cloud/Infrastructure Owner review are pending. Not Accepted.

### KR-BINC-001-006 — Establish repository ignore rules

- **Description:** Add or correct ignore rules for real environment files, credentials, key material, generated secret-bearing output, and local artifacts.
- **Inputs:** Secret-handling policy; repository layout; safe-development requirements.
- **Outputs/files:** Reviewed `.gitignore` changes; ignore-rule tests or verification evidence.
- **Dependencies:** KR-BINC-001-005.
- **Owner role:** Repository/CI Owner with Security Owner review.
- **Estimate:** TBD.
- **Definition of done:** Required prohibited file classes are covered; safe examples remain trackable; existing tracked files are inspected rather than assumed protected by ignore rules.
- **Linked AC:** B-INC-001-AC-14.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-002.

### KR-BINC-001-007 — Provide safe configuration examples and fix DEVELOPMENT_SETUP placeholder

- **Description:** Ensure configuration examples use unmistakably nonfunctional placeholders and resolve the reported credential-shaped database URL in `docs/development/DEVELOPMENT_SETUP.md`.
- **Inputs:** Existing DEVELOPMENT_SETUP content; configuration policy; scan findings.
- **Outputs/files:** Reviewed documentation diff; safe `.env.example` or equivalent where applicable; rescan evidence.
- **Dependencies:** KR-BINC-001-005; configuration framework.
- **Owner role:** Backend Technical Lead; Security Owner approves security disposition.
- **Estimate:** TBD.
- **Definition of done:** The actual file is inspected; any credential-shaped value is replaced with a nonfunctional placeholder; instructions describe external/local credential provision; the agreed scan is rerun; any real exposure is escalated.
- **Linked AC:** B-INC-001-AC-05, B-INC-001-AC-15.
- **Linked tests:** BTS-003, BTS-010.
- **Linked security gates:** SEC-GATE-001, SEC-GATE-003, SEC-GATE-011.

### KR-BINC-001-008 — Select secret scanner

- **Description:** Evaluate maintained secret-scanning options and choose a tool that supports local use and CI enforcement.
- **Inputs:** Repository size and language; CI capabilities; false-positive and exception-handling requirements.
- **Outputs/files:** Decision record; scanner version and policy; documented invocation.
- **Dependencies:** KR-BINC-001-005; Repository/CI Owner review.
- **Owner role:** Security Owner with Repository/CI Owner.
- **Estimate:** TBD.
- **Definition of done:** Options and recommendation are recorded; the selected tool is versioned; synthetic secret detection is demonstrated; scanner failure behavior is understood.
- **Linked AC:** B-INC-001-AC-16.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-004, SEC-GATE-010.

### KR-BINC-001-009 — Configure local secret scanning

- **Description:** Provide a reproducible local command or hook for scanning applicable working-tree content.
- **Inputs:** Approved scanner; repository policy; safe test fixtures.
- **Outputs/files:** Scanner configuration; local invocation instructions; synthetic detection evidence.
- **Dependencies:** KR-BINC-001-008.
- **Owner role:** Repository/CI Owner.
- **Estimate:** TBD.
- **Definition of done:** A developer can run the scanner using documented instructions; synthetic prohibited material triggers a finding; output is sanitized; failure cannot be mistaken for a clean scan.
- **Linked AC:** B-INC-001-AC-16.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-004, SEC-GATE-010.

### KR-BINC-001-010 — Add blocking CI secret scanning

- **Description:** Integrate secret scanning into CI as a required blocking check.
- **Inputs:** Approved scanner; existing CI configuration; branch/required-check capabilities.
- **Outputs/files:** CI workflow/configuration; test evidence for success and failure cases.
- **Dependencies:** KR-BINC-001-008; KR-BINC-001-009; Repository/CI Owner approval.
- **Owner role:** Repository/CI Owner.
- **Estimate:** TBD.
- **Definition of done:** A clean test passes; synthetic prohibited content fails the job; scanner execution errors fail closed; required-check behavior is verified; findings and logs contain no leaked secret value.
- **Linked AC:** B-INC-001-AC-17.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-005, SEC-GATE-010.

### KR-BINC-001-011 — Assess agreed Git history for secret exposure

- **Description:** Run the approved history-scanning procedure against the explicitly agreed commit/ref scope and record findings without reproducing secret values.
- **Inputs:** Approved scanner; scope definition; repository history; exposure-response procedure.
- **Outputs/files:** Sanitized scan record; finding dispositions; follow-up issue references where needed.
- **Dependencies:** KR-BINC-001-008; Security Owner approval of scan scope.
- **Owner role:** Security Owner.
- **Estimate:** TBD.
- **Definition of done:** Scan scope and method are recorded; findings are triaged; potential real credentials trigger exposure response; no claim is made about unscanned history or refs.
- **Linked AC:** B-INC-001-AC-18.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-006, SEC-GATE-007.

### KR-BINC-001-012 — Document secret-exposure response

- **Description:** Document how to triage, revoke/rotate, contain, remediate, and verify a suspected repository secret exposure.
- **Inputs:** Existing secrets-management requirements; Security Owner procedures; scanner workflow.
- **Outputs/files:** Exposure-response procedure or reviewed update to the authoritative security document.
- **Dependencies:** Security Owner review.
- **Owner role:** Security Owner.
- **Estimate:** TBD.
- **Definition of done:** The procedure identifies responsible roles, immediate containment, credential revocation/rotation assessment, history remediation considerations, evidence handling, and closure criteria.
- **Linked AC:** B-INC-001-AC-18.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-006, SEC-GATE-007.

### KR-BINC-001-013 — Test fail-fast configuration validation

- **Description:** Add positive and negative tests for required configuration, invalid values, and safe startup failure.
- **Inputs:** Configuration schema; approved secret boundary; startup/readiness behavior.
- **Outputs/files:** Configuration test suite; sanitized test results.
- **Dependencies:** KR-BE-1-003; KR-BINC-001-005.
- **Owner role:** Backend Engineer with QA Owner.
- **Estimate:** TBD.
- **Definition of done:** Valid configuration follows the documented path; invalid required settings prevent readiness; error output does not reveal secret values.
- **Linked AC:** B-INC-001-AC-04, B-INC-001-AC-05.
- **Linked tests:** BTS-002, BTS-003, BTS-010.
- **Linked security gates:** SEC-GATE-003, SEC-GATE-008.

### KR-BINC-001-014 — Test logging redaction

- **Description:** Exercise application logging with synthetic secret-bearing values and verify that prohibited values are not emitted.
- **Inputs:** Logging implementation; secret classification; approved synthetic test values.
- **Outputs/files:** Redaction tests; sanitized log-capture evidence.
- **Dependencies:** KR-BE-1-041; KR-BINC-001-005.
- **Owner role:** QA Owner with Security Owner review.
- **Estimate:** TBD.
- **Definition of done:** Test inputs include representative synthetic credentials; output is checked for exact and transformed leakage; retained evidence does not itself expose test values.
- **Linked AC:** B-INC-001-AC-10, B-INC-001-AC-12.
- **Linked tests:** BTS-003, BTS-006, BTS-009.
- **Linked security gates:** SEC-GATE-009.

### KR-BINC-001-015 — Verify scanner exceptions and failure behavior

- **Description:** Test the scanner's exception policy, execution-error handling, and blocking behavior.
- **Inputs:** Approved scanner configuration; exception policy; CI workflow.
- **Outputs/files:** Synthetic test fixtures or generated-at-runtime cases; test results; exception review record.
- **Dependencies:** KR-BINC-001-009; KR-BINC-001-010.
- **Owner role:** Security Owner with Repository/CI Owner.
- **Estimate:** TBD.
- **Definition of done:** Valid narrow exceptions behave as documented; broad or invalid exceptions are rejected or flagged; scanner errors and synthetic prohibited values block the required check.
- **Linked AC:** B-INC-001-AC-16, B-INC-001-AC-17.
- **Linked tests:** BTS-010.
- **Linked security gates:** SEC-GATE-004, SEC-GATE-005, SEC-GATE-010.

### KR-BINC-001-016 — Update security and setup documentation

- **Description:** Document developer setup, scanner invocation, CI behavior, secret boundaries, and exposure-response references.
- **Inputs:** Approved security policy; tool decisions; verified implementation behavior.
- **Outputs/files:** Setup and security documentation updates; links to authoritative documents.
- **Dependencies:** KR-BINC-001-005 through KR-BINC-001-012 as applicable.
- **Owner role:** Documentation Owner with Backend Technical Lead and Security Owner review.
- **Estimate:** TBD.
- **Definition of done:** Instructions match implemented behavior; no credential-bearing examples exist; links resolve; unresolved decisions are labelled open rather than described as approved.
- **Linked AC:** B-INC-001-AC-14, B-INC-001-AC-19.
- **Linked tests:** BTS-001, BTS-010, BTS-036.
- **Linked security gates:** SEC-GATE-002, SEC-GATE-003.

### KR-BINC-001-017 — Verify clean-checkout workflow and retain evidence

- **Description:** Verify that a clean checkout can install, configure using externally supplied local values, run tests, and execute required security checks.
- **Inputs:** Approved toolchain; setup instructions; test and scanner commands; CI workflow.
- **Outputs/files:** Sanitized verification record; acceptance evidence matrix; unresolved-finding list.
- **Dependencies:** All applicable B-INC-001 tasks; required owner reviews.
- **Owner role:** QA Owner; Backend Technical Lead accountable for increment readiness.
- **Estimate:** TBD.
- **Definition of done:** A clean environment follows the documented steps; required tests and security checks produce inspectable results; secrets are not committed or printed; failed or unavailable checks remain failed/blocked rather than being reported as passing.
- **Linked AC:** B-INC-001-AC-02, B-INC-001-AC-19, B-INC-001-AC-20.
- **Linked tests:** BTS-001, BTS-032, BTS-035, BTS-036.
- **Linked security gates:** SEC-GATE-003, SEC-GATE-012, SEC-GATE-013.

### KR-BINC-001-018 — Adopt source header standard and CI check

- **Description:** Adopt the KritvaOS source header standard (ported from kritva-core, rule family HEADER-001 to HEADER-008) with the proprietary RaaS SPDX identifier, the RaaS language set and the controlled Component and Layer vocabularies, enforced in CI and by an optional pre-commit hook.
- **Inputs:** kritva-core `scripts/lint/check_source_headers.py` and `.github/workflows/source-header-check.yml`; owner decision that RaaS is proprietary; approved toolchain decisions.
- **Outputs/files:** `docs/development/SOURCE_HEADER_STANDARD.md`; `scripts/lint/check_source_headers.py`; `tests/source_header_check/test_check_source_headers.py`; `.github/workflows/source-header-check.yml`; `.githooks/pre-commit`; headers on all in-scope tracked files.
- **Dependencies:** None for the checker; new source files from other tasks must carry headers when committed.
- **Owner role:** Backend Technical Lead.
- **Estimate:** TBD.
- **Definition of done:** Strict tracked-file check passes; checker unit tests pass; the workflow is green on the implementation commit; the standard documents exemptions and hook installation (`git config core.hooksPath .githooks`).
- **Linked AC:** B-INC-001-AC-21.
- **Linked tests:** BTS-037.
- **Linked security gates:** Not applicable.
- **Status:** Accepted on 2026-10-10 by the repository owner (`BACKEND_CHANGELOG.md` PB-007).

### KR-BINC-001-019 — Add repository Makefile for local validation

- **Description:** Add a root `Makefile`, modelled on the kritva-core Makefile, that gives a stable local command interface for the repository checks and reserves the application targets until the toolchain is decided.
- **Inputs:** kritva-core `Makefile`; the `Source Header Check` and `docs-check` workflows; `.githooks/pre-commit`.
- **Outputs/files:** `Makefile`; Makefile classification in `scripts/lint/check_source_headers.py`, with a test; `docs/development/SOURCE_HEADER_STANDARD.md` scope update.
- **Dependencies:** KR-BINC-001-018; existing validation scripts and CI workflows.
- **Owner role:** Repository/CI Owner.
- **Estimate:** TBD.
- **Definition of done:**
  - `make help` lists every target.
  - `make check` runs exactly the four commands of the two required CI workflows (header unit tests, strict header check, documentation check, backend traceability check) and stops with a non-zero status, without the success summary, when any of them fails.
  - `build`, `test`, `lint`, `format` and `format-check` are documented as not configured, exit non-zero, and are not part of `make check`.
  - `make clean` removes only Python caches.
  - `make info` reports the configuration accurately.
  - The Makefile header is enforced by the header checker.
  - The CI workflows and their required status-check contexts are unchanged.
- **Linked AC:** B-INC-001-AC-19.
- **Linked tests:** BTS-001, BTS-036.
- **Linked security gates:** SEC-GATE-003.
- **Status:** Accepted on 2026-10-10 by the repository owner (`BACKEND_CHANGELOG.md` PB-009). `B-INC-001-AC-19` itself stays open because other tasks also contribute to it.

## 5. Cross-Task Dependencies

The principal implementation sequence is:

1. Decide runtime/language and package manager.
2. Create the application structure and record module boundaries.
3. Decide the HTTP framework and migration tool.
4. Define secret-handling and configuration boundaries.
5. Establish safe examples, ignore rules, and scanner selection.
6. Implement configuration, transport, routing, errors, request context, correlation, health/readiness, and logging.
7. Establish local and CI scanning plus history assessment and exposure response.
8. Run focused and clean-checkout verification.
9. Complete review and acceptance evidence.

Independent documentation, scanner evaluation, and test planning may run in parallel when their inputs are available. Do not implement a technology-dependent component before the required decision is approved.

## 6. Task Completion Requirements

For each task, the owner must record:

- Status and actual implementation reference.
- Tests executed and their results.
- Linked acceptance criteria.
- Linked security gates.
- Review findings and dispositions.
- Blockers and dependencies.
- Any deviations from the approved decision.
- Evidence location that contains no secrets.

No task status or evidence is asserted as complete by this planning document.
