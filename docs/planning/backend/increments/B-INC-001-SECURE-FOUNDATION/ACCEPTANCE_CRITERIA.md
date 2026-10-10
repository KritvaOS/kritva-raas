# B-INC-001 — SECURE FOUNDATION Acceptance Criteria

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 SECURE FOUNDATION Acceptance Criteria |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/ACCEPTANCE_CRITERIA.md` |
| Status | Proposed |
| Canonical phase | P3 CONTROL PLANE |
| Parent milestone | B-M01 CONTROL PLANE |
| Owner role | Backend Technical Lead |
| Backend acceptance source | [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md) |
| Backend test strategy | [Backend test strategy](../../BACKEND_TEST_STRATEGY.md) |
| Backend security gate | [Backend security gate](../../BACKEND_SECURITY_GATE.md) |
| Task register | [Increment tasks](TASKS.md) |
| Review checklist | [Review checklist](REVIEW_CHECKLIST.md) |

## 1. Purpose

This document defines the increment-specific pass/fail conditions and evidence requirements for B-INC-001 SECURE FOUNDATION.

The criteria use the unique prefix `B-INC-001-AC-nn`. They trace to the program-level backend acceptance criteria (`BAC-*`), backend test strategy (`BTS-*`), and security gates (`SEC-GATE-*`).

The increment is not accepted merely because its source files exist or a developer reports that a check passed. Evidence must be retained and reviewed.

## 2. Acceptance Rules

1. Each criterion must have an explicit pass/fail condition.
2. Each criterion must identify the evidence to retain.
3. Required tests must run in the documented environment or an approved equivalent.
4. A test that was not run is not a pass.
5. A scanner error, skipped required check, or missing result is not a clean result.
6. Security evidence must not contain real secret values.
7. Mandatory security failures block increment acceptance.
8. Open technology decisions required by the implementation must be approved before the dependent work is accepted.
9. The acceptance owner must record the final disposition of every criterion.
10. Passing this increment does not mean B-M01 CONTROL PLANE or P3 CONTROL PLANE is complete.

## 3. Acceptance Criteria

### B-INC-001-AC-01 — Approved toolchain decisions

- **Pass condition:** Runtime/language versions, package manager, HTTP framework, migration tool, and scanner decisions needed for this increment are recorded with options considered, recommendation, rationale, owner, and approval. No dependent implementation relies on an undocumented choice.
- **Fail condition:** A required choice is unrecorded, silently assumed, incompatible with the approved environment, or has no accountable decision owner.
- **Evidence to retain:** Decision records; reviewed tool/version policy; reviewer disposition.
- **Backend acceptance trace:** BAC-002, BAC-035.
- **Test trace:** BTS-001, BTS-036.
- **Security-gate trace:** SEC-GATE-004, SEC-GATE-013.
- **Owner:** Backend Technical Lead; Database Technical Lead and Security Owner approve their respective decisions.

### B-INC-001-AC-02 — Reproducible clean checkout

- **Pass condition:** A clean checkout installs dependencies using the approved lockfile and package-manager workflow and runs the documented baseline build and tests without relying on undeclared local state.
- **Fail condition:** Installation depends on undocumented manual steps, unpinned dependencies, committed credentials, or untracked local artifacts.
- **Evidence to retain:** Sanitized command transcript or CI result; tool versions; lockfile review; clean-checkout checklist.
- **Backend acceptance trace:** BAC-001, BAC-037.
- **Test trace:** BTS-001.
- **Security-gate trace:** SEC-GATE-003.
- **Owner:** Backend Technical Lead and QA Owner.

### B-INC-001-AC-03 — Module boundaries reviewed

- **Pass condition:** Initial module responsibilities and allowed dependency directions are documented and reviewed; identified cycles or prohibited cross-domain dependencies are resolved or explicitly dispositioned.
- **Fail condition:** Module ownership is ambiguous, an unreviewed dependency violates the agreed architecture, or material review findings remain unowned.
- **Evidence to retain:** Architecture decision/update; review record; findings and disposition.
- **Backend acceptance trace:** BAC-002, BAC-035.
- **Test trace:** BTS-004.
- **Security-gate trace:** Not applicable.
- **Owner:** Architecture Owner.

### B-INC-001-AC-04 — Configuration validation and startup behavior

- **Pass condition:** Required configuration is validated at startup; invalid required values prevent readiness; validation is covered by positive and negative tests.
- **Fail condition:** Invalid required configuration is silently accepted, the application reports readiness prematurely, or required settings are scattered without a documented configuration boundary.
- **Evidence to retain:** Configuration schema; positive/negative test results; sanitized startup/readiness results.
- **Backend acceptance trace:** BAC-003.
- **Test trace:** BTS-002, BTS-003.
- **Security-gate trace:** SEC-GATE-008.
- **Owner:** Backend Technical Lead.

### B-INC-001-AC-05 — Safe configuration examples

- **Pass condition:** Configuration examples use unmistakably nonfunctional placeholders and explain how developers supply local values outside tracked files. The DEVELOPMENT_SETUP placeholder finding is corrected where present and rescanned.
- **Fail condition:** A tracked example contains a real or credential-shaped usable URL/password, or the placeholder correction is claimed without inspecting the actual diff and scan evidence.
- **Evidence to retain:** File diff; safe-example review; sanitized working-tree scan result; history-scan scope and result; exposure disposition if applicable.
- **Backend acceptance trace:** BAC-009.
- **Test trace:** BTS-003, BTS-010.
- **Security-gate trace:** SEC-GATE-003.
- **Owner:** Backend Technical Lead; Security Owner approves the finding disposition.

### B-INC-001-AC-06 — HTTP transport and API v1 routing

- **Pass condition:** The HTTP server lifecycle and API v1 routing follow the approved contract; unknown routes/methods and transport failures have tested behavior.
- **Fail condition:** Routing is unversioned or inconsistent with the approved API contract, or startup/shutdown/request behavior is not testable.
- **Evidence to retain:** Framework decision; route tests; lifecycle tests; reviewed API routing.
- **Backend acceptance trace:** BAC-004.
- **Test trace:** BTS-007, BTS-032.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead.

### B-INC-001-AC-07 — Request context and correlation

- **Pass condition:** Each request receives appropriate request-scoped context and a correlation identifier, and the identifier is propagated through the documented request path without leaking sensitive values.
- **Fail condition:** Context leaks between requests, correlation is inconsistent, or user-supplied correlation data can inject sensitive or misleading log content.
- **Evidence to retain:** Request-context and correlation test results; sanitized log samples.
- **Backend acceptance trace:** BAC-004.
- **Test trace:** BTS-005, BTS-006.
- **Security-gate trace:** SEC-GATE-009.
- **Owner:** Backend Technical Lead.

### B-INC-001-AC-08 — API error and validation contract

- **Pass condition:** Invalid requests and unknown routes produce the documented error format; internal exceptions are handled without exposing credentials or sensitive implementation details.
- **Fail condition:** Error payloads are inconsistent, secrets appear in responses, or unhandled failures return sensitive internal details.
- **Evidence to retain:** Contract tests; negative request results; sanitized error samples.
- **Backend acceptance trace:** BAC-004.
- **Test trace:** BTS-007.
- **Security-gate trace:** SEC-GATE-009.
- **Owner:** Backend Technical Lead.

### B-INC-001-AC-09 — Request validation is testable

- **Pass condition:** Representative invalid inputs exercise the agreed validation behavior and tests assert status, response schema, and prohibited-data handling.
- **Fail condition:** Validation exists only as an undocumented implementation detail or negative cases are not verified.
- **Evidence to retain:** Validation test suite and sanitized results.
- **Backend acceptance trace:** BAC-004, BAC-031.
- **Test trace:** BTS-007.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead with QA Owner.

### B-INC-001-AC-10 — Request correlation is reflected in structured logs

- **Pass condition:** Structured log events include the approved correlation field where applicable and do not copy credentials or sensitive request payloads into logs.
- **Fail condition:** Correlation is missing where required, or raw request data/credentials are logged.
- **Evidence to retain:** Sanitized captured log output; automated assertions; logging configuration review.
- **Backend acceptance trace:** BAC-006.
- **Test trace:** BTS-006, BTS-009.
- **Security-gate trace:** SEC-GATE-009.
- **Owner:** Backend Technical Lead with Security Owner review.

### B-INC-001-AC-11 — Health and readiness semantics

- **Pass condition:** Health and readiness endpoints have distinct documented semantics, are tested across startup and invalid-configuration cases, and disclose no sensitive configuration.
- **Fail condition:** Readiness reports success before required startup checks complete or endpoint responses disclose secrets.
- **Evidence to retain:** Lifecycle test results; endpoint contract; sanitized response samples.
- **Backend acceptance trace:** BAC-005.
- **Test trace:** BTS-008.
- **Security-gate trace:** SEC-GATE-008.
- **Owner:** Backend Technical Lead.

### B-INC-001-AC-12 — Structured logging redaction

- **Pass condition:** Automated tests inject synthetic credential-like values into representative logging paths and prove prohibited values are not emitted in clear text or transformed output.
- **Fail condition:** A synthetic secret is present in retained logs, test output, or diagnostics, or redaction behavior is untested.
- **Evidence to retain:** Redaction tests; sanitized test output; reviewed logging configuration.
- **Backend acceptance trace:** BAC-006.
- **Test trace:** BTS-003, BTS-009.
- **Security-gate trace:** SEC-GATE-009.
- **Owner:** Security Owner with Backend Technical Lead and QA Owner.

### B-INC-001-AC-13 — Database and migration-tool readiness

- **Pass condition:** The migration-tool choice is approved; the documented test procedure can connect to the controlled test database using externally supplied credentials; migration checks are reproducible.
- **Fail condition:** Migration tooling remains silently assumed, tests require committed credentials, or database readiness is claimed without executing the procedure.
- **Evidence to retain:** Decision record; sanitized connection/test result; migration test output; setup instructions.
- **Backend acceptance trace:** BAC-014, BAC-015.
- **Test trace:** BTS-011, BTS-012, BTS-013.
- **Security-gate trace:** SEC-GATE-011.
- **Owner:** Database Technical Lead.

### B-INC-001-AC-14 — Repository protection rules

- **Pass condition:** Reviewed ignore rules cover real environment files and prohibited secret-bearing artifacts; safe examples remain trackable; existing tracked files are inspected separately.
- **Fail condition:** Required patterns are absent, existing tracked credentials are assumed protected by ignore rules, or the changes exclude required safe examples.
- **Evidence to retain:** `.gitignore` diff; pattern review; tracked-file verification; test output where available.
- **Backend acceptance trace:** BAC-008.
- **Test trace:** BTS-010.
- **Security-gate trace:** SEC-GATE-002.
- **Owner:** Repository/CI Owner with Security Owner review.

### B-INC-001-AC-15 — DEVELOPMENT_SETUP finding disposition

- **Pass condition:** The reported credential-shaped PostgreSQL URL in `docs/development/DEVELOPMENT_SETUP.md` is inspected and replaced with a nonfunctional placeholder if still present; the agreed rescan is retained; any possible real credential exposure is assessed.
- **Fail condition:** The file is not inspected, a usable credential remains, the rescan is missing, or a possible real exposure is closed without Security Owner disposition.
- **Evidence to retain:** Actual file diff; sanitized scan output; scope and refs scanned; finding disposition; rotation/revocation evidence if required, without storing the secret.
- **Backend acceptance trace:** BAC-007, BAC-009, BAC-011.
- **Test trace:** BTS-010.
- **Security-gate trace:** SEC-GATE-001, SEC-GATE-003, SEC-GATE-011.
- **Owner:** Security Owner.

### B-INC-001-AC-16 — Local secret scanner is operational

- **Pass condition:** The approved scanner is versioned and documented; a developer can execute it locally; synthetic prohibited material triggers detection; scanner errors are visible and cannot be mistaken for a clean result.
- **Fail condition:** Scanner choice is unresolved, instructions are not reproducible, synthetic detection fails, or scanner errors are silently ignored.
- **Evidence to retain:** Scanner decision; version/configuration; sanitized positive and negative test output.
- **Backend acceptance trace:** BAC-007, BAC-010.
- **Test trace:** BTS-010.
- **Security-gate trace:** SEC-GATE-004, SEC-GATE-010.
- **Owner:** Security Owner with Repository/CI Owner.

### B-INC-001-AC-17 — CI secret scanning is blocking

- **Pass condition:** The required CI check passes on clean test material and fails on synthetic prohibited material; scanner execution errors fail closed; required-check enforcement is verified.
- **Fail condition:** The check is advisory when it must block, synthetic material does not fail the job, scanner errors pass, or the check can be skipped without an approved exception.
- **Evidence to retain:** Workflow diff; clean and failing CI run identifiers; required-check configuration evidence; sanitized logs.
- **Backend acceptance trace:** BAC-010.
- **Test trace:** BTS-010.
- **Security-gate trace:** SEC-GATE-005, SEC-GATE-010.
- **Owner:** Repository/CI Owner with Security Owner.

### B-INC-001-AC-18 — History scan and exposure-response readiness

- **Pass condition:** The agreed repository-history scope is scanned; scope and findings are recorded without exposing secret values; findings are dispositioned; the response procedure identifies containment and revocation/rotation assessment.
- **Fail condition:** History scope is ambiguous, required refs are unscanned without disclosure, findings lack owners, or potential real credential exposure is treated as resolved solely by editing the current file.
- **Evidence to retain:** Sanitized scan record; refs and commit range; findings/dispositions; response-procedure review.
- **Backend acceptance trace:** BAC-011, BAC-012.
- **Test trace:** BTS-010.
- **Security-gate trace:** SEC-GATE-006, SEC-GATE-007.
- **Owner:** Security Owner.

### B-INC-001-AC-19 — Documentation and workflow match actual behavior

- **Pass condition:** Setup, scanner, CI, logging, and security instructions match the reviewed implementation; links resolve; open decisions are explicitly labelled open; a clean-checkout verification record is available.
- **Fail condition:** Documentation describes unimplemented controls as operational, contains prohibited credentials, has broken required links, or omits required verification steps.
- **Evidence to retain:** Documentation diff; link/checker result; clean-checkout record; review disposition.
- **Backend acceptance trace:** BAC-037.
- **Test trace:** BTS-001, BTS-036.
- **Security-gate trace:** SEC-GATE-003.
- **Owner:** Backend Technical Lead with Documentation Owner.

### B-INC-001-AC-20 — Increment evidence and disposition

- **Pass condition:** All applicable criteria have recorded results and evidence; failures and blockers have owners; mandatory security gates are passed; required reviews are completed; no prohibited secret finding is implicitly accepted.
- **Fail condition:** Any mandatory gate is missing, failed, skipped without an approved disposition, or supported only by an unverified assertion.
- **Evidence to retain:** Completed acceptance matrix; test and scanner run references; review records; open-issue list; explicit acceptance decision.
- **Backend acceptance trace:** BAC-013, BAC-031, BAC-034, BAC-035, BAC-036, BAC-038.
- **Test trace:** BTS-032, BTS-035, BTS-036.
- **Security-gate trace:** SEC-GATE-012, SEC-GATE-013.
- **Owner:** Backend Technical Lead; acceptance authority follows B-M01 governance.

### B-INC-001-AC-21 — Source header standard enforced

- **Pass condition:** `docs/development/SOURCE_HEADER_STANDARD.md` is linked from the development documentation; `scripts/lint/check_source_headers.py` enforces the proprietary SPDX identifier, copyright line, required fields, valid `Created` date, `File` match and the controlled Component and Layer vocabularies; its unit tests cover every supported comment style, classification and failure rule; every in-scope tracked file passes in strict mode; and the `Source Header Check` workflow and `.githooks/pre-commit` run the same command.
- **Fail condition:** A required rule is unenforced or untested, an in-scope file fails, an exemption is broader than the documented list, or the workflow is missing or red for the tested revision.
- **Evidence to retain:** Checker and unit-test output for the revision; Actions run reference; exemption list review.
- **Backend acceptance trace:** BAC-031, BAC-037, BAC-039.
- **Test trace:** BTS-037.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead.

## 4. Mandatory Blocking Conditions

The following conditions block B-INC-001 acceptance:

- Real or suspected credential exposure has no Security Owner disposition.
- A required secret-scanning check is missing, nonblocking, or not verified.
- A scanner execution failure can result in a passing required check.
- Required configuration validation permits readiness with invalid required settings.
- Sensitive values are emitted in logs, test output, or API error responses.
- Required technology decisions remain unapproved while dependent implementation relies on them.
- Clean-checkout verification cannot be reproduced.
- Required evidence is missing or cannot be reviewed safely.

## 5. Acceptance Record

Complete this table during the review.

| Criterion | Result | Evidence reference | Finding/issue | Reviewer | Date |
|---|---|---|---|---|---|
| B-INC-001-AC-01 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-02 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-03 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-04 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-05 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-06 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-07 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-08 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-09 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-10 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-11 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-12 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-13 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-14 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-15 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-16 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-17 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-18 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-19 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-20 | TBD | TBD | TBD | TBD | TBD |
| B-INC-001-AC-21 | PASS | Source Header Check runs 38063027471 (`main` at `3a0d7e5`) and 38062983863 (PR #1); negative-path run 38052486010 (HEADER-008, exit 1); ruleset 24843399; `BACKEND_CHANGELOG.md` PB-006 and PB-007 | None open. Strict up-to-date checks and integration pinning are tracked as optional hardening. | Repository owner | 2026-10-10 |

## 6. Status

Status: Proposed.

The criteria define intended acceptance behavior. No criterion is marked passed until the required evidence is produced and reviewed.
