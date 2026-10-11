# B-INC-001 — Secure Foundation Test Plan

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 Secure Foundation Test Plan |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/TEST_PLAN.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Increment review checklist](REVIEW_CHECKLIST.md)
- [Security review](SECURITY_REVIEW.md)
- [Commit procedure](GIT_COMMIT_STEP.md)
- [Program test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Program acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Program security gate](../../BACKEND_SECURITY_GATE.md)
- [Program task register](../../BACKEND_TASK_REGISTER.md)
- [Program risk register](../../BACKEND_RISK_REGISTER.md)
- [Program changelog](../../BACKEND_CHANGELOG.md)
- [B-M01 milestone](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## 1. Purpose and Scope

This plan defines how B-INC-001 is verified before it can be accepted as the secure runtime foundation for subsequent backend increments.

The scope covers:

- Runtime, language, package-manager, HTTP-framework, and migration-tool decisions.
- Configuration loading and startup validation.
- Secret-handling rules, repository ignore rules, and safe configuration examples.
- Secret scanning in local development and blocking CI.
- Repository-history assessment and documented leak response.
- Structured logging and sensitive-value redaction.
- Security and configuration documentation.
- Reproducible verification from a clean checkout.

The increment includes existing tasks `KR-BE-1-001` through `KR-BE-1-009` and `KR-BE-1-041`, plus new tasks `KR-BINC-001-001` through `KR-BINC-001-019`. Use `TASKS.md` for task-level ownership, dependencies, outputs, and acceptance links.

This plan does not approve an unselected technology, authorize production credentials, or claim that the application is production-ready. Technology choices remain open until recorded in an approved decision record.

## 2. Governing References and Traceability

The following documents own the canonical program-level IDs:

- `../../BACKEND_TEST_STRATEGY.md` — test IDs `BTS-001` through `BTS-037`.
- `../../BACKEND_SECURITY_GATE.md` — security-gate IDs `SEC-GATE-001` through `SEC-GATE-013`.
- `../../BACKEND_ACCEPTANCE_CRITERIA.md` — program acceptance IDs `BAC-001` through `BAC-039`.
- `ACCEPTANCE_CRITERIA.md` — increment acceptance IDs `B-INC-001-AC-01` through `B-INC-001-AC-21`.
- `TASKS.md` — task-to-acceptance, test, and security-gate traceability.
- `REVIEW_CHECKLIST.md` — human review and release-blocking checks.

Do not create replacement IDs for program-level test cases or security gates. Verify every selected ID against its canonical definition before recording it as executed or passed.

If a canonical ID does not describe the required test, record the mismatch and resolve it in the owning program document before marking the relevant acceptance criterion complete.

## 3. Test Strategy

Verification is layered:

1. **Static and repository checks:** documentation links, repository ignore rules, secret-pattern detection, configuration examples, and CI workflow inspection.
2. **Unit tests:** configuration parsing, required-value validation, safe defaults, failure behaviour, and redaction helpers.
3. **Component tests:** application bootstrap, HTTP routing, request context, error handling, request correlation, health/readiness, and structured logging.
4. **Integration tests:** startup with valid and invalid configuration, database configuration handling, and selected migration tooling once approved.
5. **Security tests:** secret-scanner positive/negative fixtures, fail-closed CI behaviour, log redaction, and history-scan triage.
6. **Clean-checkout tests:** repeatable installation, documented setup, and all available checks from a fresh checkout.
7. **Human review:** security-gate evidence, exception review, and explicit acceptance or rejection.

Run the applicable canonical `BTS-*` tests. Record the actual IDs executed in the evidence record. A test suite passing does not by itself satisfy a security gate that requires human review.

## 4. Test Environment and Safety

### 4.1 Environment

Record the following for every meaningful run:

- Repository commit SHA and working-tree status.
- Operating system and runtime/tool versions.
- Package-manager and lockfile state.
- Test command and exit code.
- Scanner name and version, configuration, and scope.
- CI run URL or immutable run identifier, when applicable.
- Timestamp and operator role.
- Sanitized summary of results and retained evidence paths.

Do not put credentials, private keys, secret-bearing environment dumps, or unsanitized logs in evidence.

### 4.2 Safe fixtures

Fixtures must use unmistakable synthetic placeholders such as `REPLACE_WITH_LOCAL_SECRET`. Scanner-positive fixtures may contain synthetic canary strings generated for the test. They must never contain copied credentials or real key material.

Private keys and certificates used by tests must be generated ephemerally at runtime where needed, stored outside the repository, and removed during cleanup. Never check them in, even if they are short-lived or intended only for testing.

### 4.3 Baseline finding

A prior baseline assessment reported a credential-shaped PostgreSQL URL in `docs/development/DEVELOPMENT_SETUP.md` at repository revision `2c51027`. Treat this as an **open finding until the current file and diff are inspected and the applicable scanner is rerun**.

Required disposition:

1. Inspect the exact current content and history.
2. Determine whether the value is a placeholder or a real credential.
3. Replace it with a clearly synthetic example if necessary.
4. If a real credential was ever exposed, follow the leak-response procedure in `SECURITY_REVIEW.md`.
5. Rerun local and CI scans and retain the results.

A previous manual scan is not evidence that automated enforcement now exists.

## 5. Test Matrix

This matrix is generated from `ACCEPTANCE_CRITERIA.md`, which is authoritative for each criterion's test trace, security-gate trace and evidence. Canonical `BTS-*` definitions are in `BACKEND_TEST_STRATEGY.md`; `SEC-GATE-*` definitions are in `BACKEND_SECURITY_GATE.md`. If this table and `ACCEPTANCE_CRITERIA.md` ever differ, `ACCEPTANCE_CRITERIA.md` wins and this table must be corrected.

| Increment AC | Criterion | Test trace | Security-gate trace | Evidence to retain |
|---|---|---|---|---|
| `B-INC-001-AC-01` | Approved toolchain decisions | BTS-001, BTS-036 | SEC-GATE-004, SEC-GATE-013 | Decision records; reviewed tool/version policy; reviewer disposition |
| `B-INC-001-AC-02` | Reproducible clean checkout | BTS-001 | SEC-GATE-003 | Sanitized command transcript or CI result; tool versions; lockfile review; clean-checkout checklist |
| `B-INC-001-AC-03` | Module boundaries reviewed | BTS-004 | Not applicable | Architecture decision/update; review record; findings and disposition |
| `B-INC-001-AC-04` | Configuration validation and startup behavior | BTS-002, BTS-003 | SEC-GATE-008 | Configuration schema; positive/negative test results; sanitized startup/readiness results |
| `B-INC-001-AC-05` | Safe configuration examples | BTS-003, BTS-010 | SEC-GATE-003 | File diff; safe-example review; sanitized working-tree scan result; history-scan scope and result; exposure disposition if applicable |
| `B-INC-001-AC-06` | HTTP transport and API v1 routing | BTS-007, BTS-032 | Not applicable | Framework decision; route tests; lifecycle tests; reviewed API routing |
| `B-INC-001-AC-07` | Request context and correlation | BTS-005, BTS-006 | SEC-GATE-009 | Request-context and correlation test results; sanitized log samples |
| `B-INC-001-AC-08` | API error and validation contract | BTS-007 | SEC-GATE-009 | Contract tests; negative request results; sanitized error samples. SEC-GATE-009 here covers error content in logs only and is not closed by these tests |
| `B-INC-001-AC-09` | Request validation is testable | BTS-007 | Not applicable | Validation test suite and sanitized results |
| `B-INC-001-AC-10` | Request correlation is reflected in structured logs | BTS-006, BTS-009 | SEC-GATE-009 | Sanitized captured log output; automated assertions; logging configuration review |
| `B-INC-001-AC-11` | Health and readiness semantics | BTS-008 | SEC-GATE-008 | Lifecycle test results; endpoint contract; sanitized response samples |
| `B-INC-001-AC-12` | Structured logging redaction | BTS-003, BTS-009 | SEC-GATE-009 | Redaction tests; sanitized test output; reviewed logging configuration |
| `B-INC-001-AC-13` | Database and migration-tool readiness | BTS-011, BTS-012, BTS-013 | SEC-GATE-011 | Decision record; sanitized connection/test result; migration test output; setup instructions |
| `B-INC-001-AC-14` | Repository protection rules | BTS-010 | SEC-GATE-002 | `.gitignore` diff; pattern review; tracked-file verification; test output where available |
| `B-INC-001-AC-15` | DEVELOPMENT_SETUP finding disposition | BTS-010 | SEC-GATE-001, SEC-GATE-003, SEC-GATE-011 | Actual file diff; sanitized scan output; scope and refs scanned; finding disposition; rotation/revocation evidence if required, without storing the secret |
| `B-INC-001-AC-16` | Local secret scanner is operational | BTS-010 | SEC-GATE-004, SEC-GATE-010 | Scanner decision; version/configuration; sanitized positive and negative test output |
| `B-INC-001-AC-17` | CI secret scanning is blocking | BTS-010 | SEC-GATE-005, SEC-GATE-010 | Workflow diff; clean and failing CI run identifiers; required-check configuration evidence; sanitized logs |
| `B-INC-001-AC-18` | History scan and exposure-response readiness | BTS-010 | SEC-GATE-006, SEC-GATE-007 | Sanitized scan record; refs and commit range; findings/dispositions; response-procedure review |
| `B-INC-001-AC-19` | Documentation and workflow match actual behavior | BTS-001, BTS-036 | SEC-GATE-003 | Documentation diff; link/checker result; clean-checkout record; review disposition |
| `B-INC-001-AC-20` | Increment evidence and disposition | BTS-032, BTS-035, BTS-036 | SEC-GATE-012, SEC-GATE-013 | Completed acceptance matrix; test and scanner run references; review records; open-issue list; explicit acceptance decision |
| `B-INC-001-AC-21` | Source header standard enforced | BTS-037 | Not applicable | Checker and unit-test output for the revision; Actions run reference; exemption list review |

**Traceability rule:** Record the exact canonical test IDs executed in the run record. Do not infer a pass merely because an unrelated test passed.

## 6. Required Security-Gate Coverage

Evaluate all relevant controls in `../../BACKEND_SECURITY_GATE.md`, using canonical IDs `SEC-GATE-001` through `SEC-GATE-013`.

The security reviewer must explicitly record which gates apply to this increment, the evidence reviewed, any exception, and the final status.

At minimum, the evidence package must address:

- No secret or key material committed.
- Safe configuration and startup failure.
- Scanner coverage and blocking CI.
- Repository-history assessment.
- Log redaction.
- Documented leak response.
- Unresolved findings and exceptions.
- Human approval for any gate that requires it.

A test result cannot override a blocking `SEC-GATE-*` status.

## 7. Execution Order

1. Inspect the working tree, task dependencies, and open technology decisions.
2. Review `DEVELOPMENT_SETUP.md`, `.gitignore`, scanner configuration, and CI workflow.
3. Run the documentation checker and inspect all reported findings.
4. Run scanner positive and negative fixture tests.
5. Run local secret scanning and review each finding; do not suppress findings merely to obtain a green result.
6. Run unit, component, and integration tests that exist.
7. Run lint and type/static checks once the selected stack and scripts exist.
8. Verify CI blocks on a deliberately introduced synthetic scanner finding in a controlled test branch or equivalent isolated test.
9. Perform a clean-checkout run.
10. Complete the security review and acceptance review.

If a required command or workflow does not yet exist, mark it **NOT IMPLEMENTED / BLOCKED**, not PASS. Document the owner and the task that will provide it.

## 8. Failure Handling

A failure must include:

- Failed test or acceptance ID.
- Command and exit status.
- Sanitized output or evidence reference.
- Expected versus actual result.
- Severity and security impact.
- Linked task and owner.
- Corrective action and retest requirement.

A confirmed secret leak is a security incident, not an ordinary test failure. Stop the affected workflow and follow `SECURITY_REVIEW.md` and `GIT_COMMIT_STEP.md`.

## 9. Evidence Package

Retain sanitized evidence under the project-approved evidence location, or reference immutable CI run records if no repository evidence directory is approved. Do not add raw secret-bearing output to Git.

The package must include:

- Repository SHA and clean/dirty status.
- Command inventory with exit codes.
- Canonical `BTS-*` IDs executed.
- `B-INC-001-AC-*` result table.
- Scanner configuration/version and sanitized findings.
- CI run identifiers and workflow review.
- Clean-checkout results.
- Open findings, exceptions, and retest results.
- Security reviewer and acceptance reviewer decisions.

## 10. Exit Conditions

The test plan is complete only when:

- Every applicable increment AC has a recorded PASS or a documented FAIL/BLOCKED result.
- All executed tests are traced to canonical `BTS-*` IDs.
- All relevant `SEC-GATE-*` controls have explicit status.
- Evidence is retained without secrets.
- No blocking finding is hidden by an exception.
- Security and acceptance reviewers have recorded their decisions.

**A green test suite is necessary but not sufficient for increment acceptance.**
