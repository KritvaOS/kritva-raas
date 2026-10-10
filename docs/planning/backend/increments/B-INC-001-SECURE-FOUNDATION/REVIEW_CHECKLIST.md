# B-INC-001 — SECURE FOUNDATION Review Checklist

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 SECURE FOUNDATION Review Checklist |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/REVIEW_CHECKLIST.md` |
| Status | Proposed |
| Canonical phase | P3 CONTROL PLANE |
| Parent milestone | B-M01 CONTROL PLANE |
| Owner role | Backend Technical Lead |
| Tasks | [Increment task register](TASKS.md) |
| Acceptance criteria | [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md) |
| Test plan | [Increment test plan — Batch 5](TEST_PLAN.md) |
| Security review | [Security review — Batch 5](SECURITY_REVIEW.md) |
| Backend security gate | [Backend security gate](../../BACKEND_SECURITY_GATE.md) |

## 1. Purpose

Use this checklist to review implementation quality, architecture alignment, repository protection, test evidence, and acceptance readiness for B-INC-001 SECURE FOUNDATION.

A checked item means that the reviewer inspected the required evidence. It must not be checked solely because an implementation task or document exists.

## 2. Review Outcome

Record one outcome:

- **ACCEPT:** All mandatory criteria and reviews pass; no blocking finding remains.
- **ACCEPT WITH TRACKED NON-BLOCKING ACTIONS:** Permitted only when the acceptance authority confirms that remaining actions do not violate mandatory gates or increment scope.
- **REJECT:** One or more required criteria fail or evidence is insufficient.
- **BLOCKED:** Required decisions, dependencies, test environments, or reviewers are unavailable.

Record the outcome and rationale in the review evidence.

## 3. Scope and Traceability

- [ ] Canonical phase is P3 CONTROL PLANE.
- [ ] Parent milestone is B-M01 CONTROL PLANE.
- [ ] The increment does not introduce a new official phase or milestone.
- [ ] Existing KR-BE-1-001 through KR-BE-1-009 and KR-BE-1-041 retain their established IDs and estimates.
- [ ] New task IDs use the `KR-BINC-001-nnn` namespace.
- [ ] New task IDs are unique in `BACKEND_TASK_REGISTER.md`.
- [ ] Every in-scope task has inputs, outputs, dependencies, owner role, estimate, definition of done, and linked AC/test/SEC-GATE IDs.
- [ ] Every acceptance criterion has a pass/fail condition and evidence requirement.
- [ ] References to B-M01 CONTROL PLANE and DB-M01 FOUNDATION preserve their authoritative scope.
- [ ] Coding-agent work remains gated by its approved architecture and database decisions.
- [ ] No documentation implies implementation or acceptance that has not been evidenced.

## 4. Open Technology Decisions

- [ ] Runtime and language version options are documented.
- [ ] Package manager and lockfile policy options are documented.
- [ ] HTTP framework options are documented.
- [ ] Database migration-tool options are documented.
- [ ] Secret-scanner options are documented.
- [ ] Each decision identifies a recommendation, rationale, owner, and required evidence.
- [ ] No open decision is described as approved.
- [ ] Dependent implementation does not silently freeze an unapproved choice.
- [ ] Approved decisions are reflected consistently in setup instructions, task register, and CI.

## 5. Application Structure and Architecture

- [ ] A clean checkout follows the documented installation process.
- [ ] Tool versions and dependency installation are reproducible.
- [ ] The application entry point and startup/shutdown lifecycle are clear.
- [ ] Module ownership and dependency direction are documented.
- [ ] Prohibited cycles and cross-domain direct writes are addressed.
- [ ] HTTP framework use matches the approved decision.
- [ ] API v1 routing matches the reviewed contract.
- [ ] Request context is scoped to each request.
- [ ] Request correlation behavior is tested.
- [ ] Validation and error responses match the contract.
- [ ] Internal errors do not disclose credentials or sensitive implementation details.
- [ ] Health and readiness semantics are distinct and documented.
- [ ] Readiness does not report success before required startup validation finishes.

## 6. Configuration and Secret Handling

- [ ] Required configuration is validated at startup.
- [ ] Invalid required settings fail safely.
- [ ] Error output does not reveal secret values.
- [ ] Configuration access uses the approved boundary.
- [ ] Safe configuration examples contain unmistakably nonfunctional placeholders.
- [ ] No real `.env` file or equivalent credential-bearing configuration is tracked.
- [ ] Repository ignore rules cover the required prohibited file classes.
- [ ] Existing tracked files were inspected separately from ignore-rule verification.
- [ ] No private key, private certificate, token, password, API key, database credential, OAuth secret, service-account key, or other prohibited secret is present in reviewed content.
- [ ] Logs, fixtures, test output, screenshots, and retained evidence do not contain credentials.
- [ ] Production secret delivery and workload identity remain assigned to the cloud/infrastructure owner.
- [ ] No production key material is generated and committed as a shortcut for local testing.
- [ ] Any potential real exposure has a Security Owner disposition.

## 7. DEVELOPMENT_SETUP Placeholder Finding

- [ ] The actual `docs/development/DEVELOPMENT_SETUP.md` content and diff were inspected.
- [ ] The reported credential-shaped PostgreSQL URL was corrected if still present.
- [ ] The replacement is unmistakably nonfunctional.
- [ ] The setup instructions explain how to supply local values outside tracked files.
- [ ] The agreed working-tree scan was rerun after the correction.
- [ ] The agreed history scan scope is recorded.
- [ ] The scan results are retained in sanitized form.
- [ ] Any possible real credential exposure was assessed by the Security Owner.
- [ ] Rotation/revocation action was considered where appropriate.
- [ ] No reviewer has treated deletion from the current file as proof that historical exposure is resolved.

## 8. Secret-Scanning and CI Enforcement

- [ ] The scanner choice and version are recorded.
- [ ] Scanner configuration is reviewable and reproducible.
- [ ] Local scanner invocation is documented.
- [ ] A synthetic prohibited value triggers detection.
- [ ] A clean synthetic fixture produces the expected result.
- [ ] Scanner execution errors are distinguishable from clean results.
- [ ] Required CI scanning is configured as a blocking check.
- [ ] A clean test run passes.
- [ ] A synthetic prohibited value causes the required check to fail.
- [ ] Scanner failure causes the required check to fail closed.
- [ ] Required-check enforcement is verified on the actual repository CI platform.
- [ ] Exceptions are narrow, justified, reviewed, and do not hide real secrets.
- [ ] No broad ignore rule or scanner exception has been added to silence an unresolved finding.
- [ ] CI logs and test evidence do not print secret values.
- [ ] History-scan scope and findings are documented.
- [ ] Findings have an explicit disposition and owner.
- [ ] The exposure-response procedure is reviewed and actionable.

## 9. Logging and Operational Diagnostics

- [ ] Structured logging follows the approved implementation decision.
- [ ] Request correlation is present where required.
- [ ] Synthetic credential values are used to exercise redaction.
- [ ] Tests check for exact and transformed secret leakage.
- [ ] Error and startup diagnostics do not disclose sensitive configuration.
- [ ] Test evidence uses sanitized output.
- [ ] Health/readiness responses do not expose internal secret-bearing settings.

## 10. Database and Migration Readiness

- [ ] PostgreSQL connection configuration is supplied externally.
- [ ] No database credential is stored in the repository or migration source.
- [ ] Migration-tool decision is recorded.
- [ ] Clean-database migration verification is documented.
- [ ] Database tests are reproducible in the approved test environment.
- [ ] Migration failure behavior is understood.
- [ ] Database and backend ownership boundaries are clear.
- [ ] DB-M01 FOUNDATION dependencies are recorded and assigned.
- [ ] Database readiness is not claimed without executed evidence.

## 11. Test Evidence

- [ ] Unit/build checks are executed and results retained.
- [ ] Configuration positive and negative tests pass.
- [ ] HTTP lifecycle and API routing tests pass.
- [ ] Error and validation contract tests pass.
- [ ] Request-context and correlation tests pass.
- [ ] Health/readiness tests pass.
- [ ] Logging redaction tests pass.
- [ ] Local secret-scanner tests pass.
- [ ] Blocking CI scanner tests pass.
- [ ] Scanner-error and exception-policy behavior is tested.
- [ ] History-scan results are recorded with explicit scope.
- [ ] Clean-checkout verification is completed.
- [ ] Test evidence is traceable to BTS and acceptance criterion IDs.
- [ ] Skipped or blocked tests are recorded as such, not counted as passing.

## 12. Documentation and Repository Quality

- [ ] Every file's `Path` row contains the full `docs/` path.
- [ ] Relative links from this increment folder use the correct path depth.
- [ ] Links to B-M01 use `../../../../backend/milestones/B-M01-CONTROL-PLANE/...`.
- [ ] Links to backend planning files use `../../BACKEND_...`.
- [ ] Required documents exist at the referenced paths.
- [ ] Task IDs, acceptance IDs, test IDs, and security-gate IDs are unique in their respective namespaces.
- [ ] Canonical phase and milestone names match `docs/planning/PHASES.md`.
- [ ] Documentation accurately distinguishes Proposed, approved, implemented, tested, and accepted states.
- [ ] Repository documentation checker is run and its actual result is retained.
- [ ] Checker findings are resolved or dispositioned according to the repository's policy.
- [ ] No checker pass is claimed without a run result.

## 13. Resource and Estimate Review

- [ ] Existing task estimates are unchanged.
- [ ] New secure-foundation task estimates remain TBD until refinement.
- [ ] Shared test and review work is not double-counted.
- [ ] Engineering-day effort is not presented as a calendar duration.
- [ ] No FTE, hiring date, delivery date, or cost is invented.
- [ ] Every commitment field remains TBD until approved by its decision owner.
- [ ] Resource assumptions align with `docs/planning/RESOURCE_PLAN.md`, Section 23.2.
- [ ] Role availability and shared-specialist bottlenecks are identified.

## 14. Risk Review

- [ ] Backend-specific risks use the `R-BE-nnn` namespace.
- [ ] Program risks are cross-referenced rather than duplicated.
- [ ] Each backend risk has a canonical phase.
- [ ] Each backend risk has an owner role, likelihood, impact, mitigation, trigger, and linked gate.
- [ ] Security and tenant-isolation risks are treated as blocking where required.
- [ ] Materialized risks have corresponding issues and corrective tasks.
- [ ] Risk scores and dispositions reflect current evidence.

## 15. Mandatory Acceptance Gate

Do not accept the increment if any of the following is true:

- [ ] A prohibited secret remains in the reviewed scope without an approved security disposition.
- [ ] The required secret scanner is not selected or reproducibly configured.
- [ ] Blocking CI secret scanning is not demonstrated.
- [ ] Scanner execution errors can result in a passing required check.
- [ ] The DEVELOPMENT_SETUP placeholder finding is unresolved or lacks required evidence.
- [ ] Sensitive values appear in logs, responses, or retained test evidence.
- [ ] Invalid required configuration can still result in readiness.
- [ ] Required decisions are silently assumed rather than approved.
- [ ] Required acceptance or test evidence is missing.
- [ ] A mandatory security gate is failed, skipped, or not verified.
- [ ] A material review finding lacks an owner and disposition.

## 16. Review Record

| Field | Value |
|---|---|
| Review outcome | TBD |
| Backend Technical Lead | TBD |
| Architecture Owner | TBD |
| Security Owner | TBD |
| Database Technical Lead | TBD |
| Repository/CI Owner | TBD |
| QA Owner | TBD |
| Evidence location | TBD |
| Blocking findings | TBD |
| Non-blocking actions | TBD |
| Review date | TBD |
| Acceptance authority | TBD |

## 17. Status

Status: Proposed.

This checklist is a review instrument. Checking items and recording an acceptance outcome requires actual implementation, test, scan, and review evidence.
