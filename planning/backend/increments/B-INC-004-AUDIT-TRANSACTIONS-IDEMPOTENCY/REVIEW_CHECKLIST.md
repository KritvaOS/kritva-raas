# B-INC-004 — AUDIT-TRANSACTIONS-IDEMPOTENCY Review Checklist

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY Review Checklist |
| Path | `planning/backend/increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/REVIEW_CHECKLIST.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION |

## Related documents

- [Milestone](MILESTONE.md)
- [Tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)

## 1. Review instructions

Use this checklist before recommending B-INC-004 for acceptance or closure.

- Mark a checkbox only after the item has been inspected and its required evidence is available.
- Use `N/A` only with a written rationale and reviewer approval.
- Record unresolved items as blockers; do not treat missing evidence as a pass.
- Verify the implementation revision and actual test results rather than relying solely on task descriptions or commit subjects.
- `ACCEPTANCE_CRITERIA.md` is the single source of truth for AC-to-BAC/BTS/SEC-GATE traceability.
- Do not mark KR-CA-025 complete; coding-agent policy audit remains deferred.

## 2. Document and scope integrity

- [ ] All four Part A documents are present at the documented paths.
- [ ] Document Control tables contain exactly the required five fields.
- [ ] Relative links resolve within the repository.
- [ ] The phase is recorded as `P3 CONTROL PLANE`.
- [ ] B-M01 CONTROL PLANE is identified as the official parent milestone.
- [ ] DB-M01 FOUNDATION coordination is explicitly recorded.
- [ ] Migration-tool decision KR-BINC-001-004 is referenced and remains authoritative.
- [ ] Task IDs, titles, estimates, owners, and dependencies match the supplied B-M01 register.
- [ ] Shared-task estimates are not counted as additional increment effort.
- [ ] KR-CA-025 is explicitly deferred and excluded from closure claims.

## 3. Acceptance criteria and traceability

- [ ] `ACCEPTANCE_CRITERIA.md` is the single source of truth for acceptance traces.
- [ ] All 16 acceptance criteria have unique IDs and explicit pass/fail conditions.
- [ ] Each AC includes evidence, backend acceptance trace, test trace, security-gate trace, and owner.
- [ ] All BAC identifiers use canonical IDs and meanings.
- [ ] All BTS identifiers use canonical IDs and meanings.
- [ ] All SEC-GATE identifiers use canonical IDs and meanings.
- [ ] Every task links to the correct ACs.
- [ ] Each task's `Linked tests` is the exact union of the linked AC test traces.
- [ ] Each task's `Linked security gates` is the exact union of the linked AC security-gate traces.
- [ ] No task has missing or extra test identifiers.
- [ ] No task has missing or extra security-gate identifiers.
- [ ] `Not applicable` is used only when no linked AC contributes a concrete gate.
- [ ] The acceptance record remains TBD until actual evidence is reviewed.
- [ ] The canonical IDs are not silently redefined in increment documentation.

## 4. Migration baseline and database coordination

- [ ] The migration implementation follows KR-BINC-001-004.
- [ ] DB-M01 FOUNDATION ownership and interfaces are respected.
- [ ] Migration ordering, versioning, and execution procedures are explicit.
- [ ] Applicable repeated-execution behavior is tested.
- [ ] Applicable migration failure/rollback behavior is tested against the approved tool's capabilities.
- [ ] Existing migration history and baseline compatibility are reviewed.
- [ ] Schema/version verification is recorded.
- [ ] Migration tests identify the database environment and implementation revision.
- [ ] Database credentials are obtained through the approved secret/configuration mechanism.
- [ ] Credentials are absent from source, logs, test output, and committed evidence.
- [ ] Migration results are reviewed by the appropriate Database/QA owners.

## 5. Transaction boundaries and consistency

- [ ] Transaction ownership and boundaries are explicit.
- [ ] Operations requiring atomicity use the approved transaction pattern.
- [ ] Rollback behavior is tested for applicable failures.
- [ ] Persisted-state assertions verify the result after failure.
- [ ] Retry behavior is tested where required.
- [ ] Audit consistency with transaction success/failure is defined and tested.
- [ ] The implementation does not assume external side effects automatically roll back with a database transaction.
- [ ] External side effects, if any, follow an explicitly approved consistency/recovery design.
- [ ] Failure semantics are reviewed rather than inferred from successful-path tests.

## 6. Idempotency

- [ ] Idempotency key scope and request identity rules are explicit.
- [ ] Equivalent requests follow the approved replay contract.
- [ ] Conflicting reuse of an idempotency key is handled deterministically.
- [ ] Repeated requests do not cause unintended duplicate effects.
- [ ] Applicable concurrent-request behavior is tested.
- [ ] Failure and retry behavior is tested.
- [ ] Persistence behavior is tested against the approved schema and transaction model.
- [ ] Idempotency data does not become an uncontrolled store for credentials, sensitive request bodies, or prohibited response data.
- [ ] Errors and diagnostic output do not expose sensitive idempotency payloads.
- [ ] API-level tests exercise the real middleware/service integration path.

## 7. Audit repository, service, and data protection

- [ ] Audit record schema and required event metadata are documented.
- [ ] AuditRepository conforms to the approved persistence contract.
- [ ] AuditService emits the required event representation.
- [ ] Audit records exclude credentials.
- [ ] Audit records exclude authentication secrets and private signing keys.
- [ ] Audit records exclude sensitive request payloads.
- [ ] Audit behavior follows the approved data classification and retention rules.
- [ ] Log and diagnostic paths are inspected for sensitive-value leakage.
- [ ] Audit failure behavior is explicit and follows an approved policy.
- [ ] Audit failure and retry paths are tested.
- [ ] Transaction and audit consistency is verified using actual persisted-state evidence.
- [ ] Evidence includes sanitized event records rather than secret-bearing payloads.

## 8. Audit-hook coverage

### Identity operations

- [ ] Required identity audit events are listed in the coverage matrix.
- [ ] Applicable identity success/failure paths are verified.
- [ ] Audit hooks preserve identity authorization and transaction boundaries.
- [ ] Event fields are checked for prohibited secret material.

### Project operations

- [ ] Required project audit events are listed in the coverage matrix.
- [ ] Applicable project operation outcomes are verified.
- [ ] Project authorization and tenant-context behavior are preserved.
- [ ] Audit records do not expose credentials or sensitive payloads.

### Platform administration

- [ ] Required platform-administration audit events are listed in the coverage matrix.
- [ ] Applicable administrative outcomes are verified.
- [ ] Audit hooks preserve the platform-administration authorization boundary.
- [ ] Administrative audit records do not expose credentials or sensitive payloads.

### Cross-cutting verification

- [ ] Audit verification tests cover all three operation groups.
- [ ] Missing-event, malformed-event, and data-safety cases are covered as required.
- [ ] Failure behavior has actual results and a reviewed disposition.
- [ ] Test results identify the tested revision and exercised scope.

## 9. Shared verification tasks

- [ ] KR-BE-1-046 covers the B-INC-004 audit verification slice.
- [ ] KR-BE-1-047 covers the approved migration baseline regression slice.
- [ ] KR-BE-1-048 covers the applicable API integration slice.
- [ ] KR-BE-1-049 covers the approved Control Plane primary product path.
- [ ] Shared-task estimates remain the original whole-task estimates.
- [ ] Each shared-task record identifies its increment-specific scope.
- [ ] Other increments' obligations remain separately tracked.
- [ ] No shared-task slice is used to claim unrelated work has passed.

## 10. Security-gate review

- [ ] SEC-GATE-009 logging-redaction requirements are reviewed where traced.
- [ ] SEC-GATE-011 database credential-handling requirements are reviewed where traced.
- [ ] SEC-GATE-012 secret-safe-evidence requirements are reviewed where traced.
- [ ] SEC-GATE-013 execution and review requirements are completed where traced.
- [ ] Each applicable gate has an actual execution/review record.
- [ ] Gate records identify the implementation revision, result, evidence, reviewer, and unresolved blockers.
- [ ] A successful functional test is not used as a substitute for required gate review.
- [ ] No gate is marked passed without the required execution and review evidence.
- [ ] Unresolved mandatory security findings block acceptance unless an authorized disposition explicitly permits otherwise.

## 11. Documentation and evidence quality

- [ ] Test evidence identifies actual commands or test cases and results.
- [ ] Test reports identify the implementation revision and relevant environment.
- [ ] Failed, skipped, and unexecuted tests are represented accurately.
- [ ] Evidence references are real and accessible to authorized reviewers.
- [ ] Evidence is sanitized and contains no credentials, private keys, or sensitive request payloads.
- [ ] Changelog entries distinguish planned from completed work.
- [ ] Implementation and acceptance status are not conflated.
- [ ] Review findings have evidence-supported dispositions.
- [ ] Documentation permits independent review of the delivered scope.
- [ ] No unsupported claim of test, security-gate, or E2E success remains.

## 12. Final disposition

- [ ] All linked tasks have an accurate implementation status.
- [ ] All 16 ACs have evidence-supported results or an explicitly authorized disposition consistent with project policy.
- [ ] Migration baseline alignment and database coordination are confirmed.
- [ ] Transaction, idempotency, and audit consistency requirements are verified.
- [ ] Required audit events are verified across identity, project, and platform-administration operations.
- [ ] Audit data safety and database credential handling are reviewed.
- [ ] Migration, audit, API integration, and E2E tests have recorded actual outcomes.
- [ ] Applicable security gates have reviewed records.
- [ ] Task-level trace unions have been checked against the AC source of truth.
- [ ] KR-CA-025 remains deferred.
- [ ] Closing evidence and unresolved-risk dispositions are reviewed.

**Final disposition:** TBD

**Reviewer:** TBD

**Review date:** TBD

**Implementation revision:** TBD

**Unresolved blockers:** TBD

## 13. Status

**Status: Proposed.**

This checklist defines the review required for acceptance. It does not assert that implementation, testing, or security review has passed.
