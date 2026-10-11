# B-INC-004 — AUDIT-TRANSACTIONS-IDEMPOTENCY Git Commit Procedure

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY Git Commit Procedure |
| Path | `planning/backend/increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/GIT_COMMIT_STEP.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION |

## Related documents

- [Milestone](MILESTONE.md)
- [Tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Changelog](CHANGELOG.md)
- [Review checklist](REVIEW_CHECKLIST.md)

## 1. Purpose

This procedure defines the expected task commit messages, traceability trailers, evidence handling, closing commit, and annotated tag for B-INC-004.

The procedure preserves the supplied B-M01 task IDs, titles, estimates, owners, dependencies, and task-to-AC mappings. Shared verification tasks retain their original whole-task estimates.

## 2. Mandatory commit rules

1. Use the exact task ID and title recorded in `TASKS.md`.
2. Make one task commit per task unless the approved repository workflow requires otherwise.
3. Keep `Tasks`, `Acceptance`, `Tests`, and `Security-Gates` trailers identical to the corresponding task entry in `TASKS.md`.
4. `ACCEPTANCE_CRITERIA.md` is the single source of truth for AC traceability.
5. Each task's `Tests` trailer must equal the exact union of the linked AC test traces.
6. Each task's `Security-Gates` trailer must equal the exact union of the linked AC security-gate traces.
7. Do not add or remove a test or gate ID to make a commit message appear complete.
8. Replace the `Evidence` placeholder with a real, sanitized evidence reference before committing. Do not invent evidence.
9. Do not claim that tests or security gates passed unless they were actually executed and reviewed.
10. Do not commit credentials, tokens, private signing keys, sensitive request payloads, or unsanitized evidence.
11. Keep KR-CA-025 — coding-agent policy audit — deferred and outside this increment's completion claims.

## 3. Pre-commit checklist

Before each task commit:

- Confirm the task ID, title, dependencies, and linked ACs.
- Confirm the test and security-gate unions against `TASKS.md`.
- Inspect the staged diff for unrelated changes, generated artifacts, secrets, and prohibited evidence.
- Execute the relevant available checks and record actual outcomes.
- Record failures, skipped tests, and blockers accurately.
- Replace the evidence placeholder with a real, sanitized reference.
- Ensure the commit message trailers match the task register exactly.

Before the closing commit:

- Verify all 16 ACs have evidence-supported results or an explicitly authorized disposition consistent with project policy.
- Verify all 13 task commits and their traceability trailers.
- Review migration alignment with DB-M01 FOUNDATION and KR-BINC-001-004.
- Review transaction rollback, idempotency replay/conflict, and failure/retry results.
- Verify required audit events across identity, project, and platform-administration operations.
- Review applicable security-gate records and findings.
- Confirm documentation and retained evidence are sanitized.
- Confirm KR-CA-025 remains deferred.

## 4. Commit trailer contract

Use these trailer names consistently:

- `Tasks:` — exact task ID.
- `Acceptance:` — exact AC IDs linked to that task.
- `Tests:` — exact canonical test-ID union from the linked ACs.
- `Security-Gates:` — exact canonical security-gate union from the linked ACs, or `Not applicable`.
- `Evidence:` — actual sanitized evidence reference for the task commit.

The `<sanitized evidence reference>` value is a placeholder. Replace it with a real reference before committing. If evidence is not yet available, do not claim it exists; complete the required work or use the repository's approved incomplete-work procedure.

## 5. Recommended commit order

| Sequence | Task | Scope |
|---|---|---|
| 1 | KR-BE-1-032 | Database migration baseline |
| 2 | KR-BE-1-033 | Transaction boundary pattern |
| 3 | KR-BE-1-034 | IdempotencyRepository |
| 4 | KR-BE-1-035 | Idempotency middleware/service |
| 5 | KR-BE-1-036 | AuditRepository contract |
| 6 | KR-BE-1-037 | AuditService |
| 7 | KR-BE-1-038 | Identity audit hooks |
| 8 | KR-BE-1-039 | Project audit hooks |
| 9 | KR-BE-1-040 | Platform-administration audit hooks |
| 10 | KR-BE-1-046 | Audit verification tests |
| 11 | KR-BE-1-047 | Migration tests |
| 12 | KR-BE-1-048 | API integration tests |
| 13 | KR-BE-1-049 | Control Plane E2E test |

Follow the actual dependency graph and repository workflow. If implementation constraints require a different order, preserve the declared dependencies and record the rationale.

## 6. Task commit messages

### 6.1 KR-BE-1-032 — Implement database migration baseline

```text
feat(database): implement database migration baseline [KR-BE-1-032]

Tasks: KR-BE-1-032
Acceptance: B-INC-004-AC-01
Tests: BTS-012, BTS-013
Security-Gates: SEC-GATE-011
Evidence: <sanitized evidence reference>
```

### 6.2 KR-BE-1-033 — Implement transaction boundary pattern

```text
feat(backend): implement transaction boundary pattern [KR-BE-1-033]

Tasks: KR-BE-1-033
Acceptance: B-INC-004-AC-02, B-INC-004-AC-07
Tests: BTS-014, BTS-029, BTS-031, BTS-034
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.3 KR-BE-1-034 — Implement IdempotencyRepository

```text
feat(backend): implement IdempotencyRepository [KR-BE-1-034]

Tasks: KR-BE-1-034
Acceptance: B-INC-004-AC-03
Tests: BTS-015, BTS-016
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.4 KR-BE-1-035 — Implement idempotency middleware/service

```text
feat(backend): implement idempotency middleware and service [KR-BE-1-035]

Tasks: KR-BE-1-035
Acceptance: B-INC-004-AC-04
Tests: BTS-015, BTS-016, BTS-034
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.5 KR-BE-1-036 — Define AuditRepository

```text
feat(security): define AuditRepository contract [KR-BE-1-036]

Tasks: KR-BE-1-036
Acceptance: B-INC-004-AC-05
Tests: BTS-029, BTS-030
Security-Gates: SEC-GATE-009, SEC-GATE-012
Evidence: <sanitized evidence reference>
```

### 6.6 KR-BE-1-037 — Implement AuditService

```text
feat(security): implement AuditService [KR-BE-1-037]

Tasks: KR-BE-1-037
Acceptance: B-INC-004-AC-06, B-INC-004-AC-07, B-INC-004-AC-11
Tests: BTS-014, BTS-029, BTS-030, BTS-031, BTS-034
Security-Gates: SEC-GATE-009, SEC-GATE-012, SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.7 KR-BE-1-038 — Add audit hooks to identity operations

```text
feat(security): add audit hooks to identity operations [KR-BE-1-038]

Tasks: KR-BE-1-038
Acceptance: B-INC-004-AC-08
Tests: BTS-029
Security-Gates: SEC-GATE-009, SEC-GATE-012
Evidence: <sanitized evidence reference>
```

### 6.8 KR-BE-1-039 — Add audit hooks to project operations

```text
feat(security): add audit hooks to project operations [KR-BE-1-039]

Tasks: KR-BE-1-039
Acceptance: B-INC-004-AC-09
Tests: BTS-029
Security-Gates: SEC-GATE-009, SEC-GATE-012
Evidence: <sanitized evidence reference>
```

### 6.9 KR-BE-1-040 — Add audit hooks to platform administration

```text
feat(security): add audit hooks to platform administration [KR-BE-1-040]

Tasks: KR-BE-1-040
Acceptance: B-INC-004-AC-10
Tests: BTS-029
Security-Gates: SEC-GATE-009, SEC-GATE-012
Evidence: <sanitized evidence reference>
```

### 6.10 KR-BE-1-046 — Add audit verification tests

```text
test(security): add audit verification coverage [KR-BE-1-046]

Tasks: KR-BE-1-046
Acceptance: B-INC-004-AC-11, B-INC-004-AC-13, B-INC-004-AC-16
Tests: BTS-029, BTS-030, BTS-031, BTS-034, BTS-036
Security-Gates: SEC-GATE-009, SEC-GATE-012, SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.11 KR-BE-1-047 — Add migration tests

```text
test(database): add migration regression tests [KR-BE-1-047]

Tasks: KR-BE-1-047
Acceptance: B-INC-004-AC-12
Tests: BTS-012, BTS-013
Security-Gates: SEC-GATE-011
Evidence: <sanitized evidence reference>
```

### 6.12 KR-BE-1-048 — Add API integration tests

```text
test(backend): add transaction idempotency and audit API integration tests [KR-BE-1-048]

Tasks: KR-BE-1-048
Acceptance: B-INC-004-AC-14
Tests: BTS-032, BTS-034, BTS-036
Security-Gates: SEC-GATE-009, SEC-GATE-012, SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.13 KR-BE-1-049 — Add Control Plane E2E test

```text
test(backend): add Control Plane end-to-end test [KR-BE-1-049]

Tasks: KR-BE-1-049
Acceptance: B-INC-004-AC-15
Tests: BTS-033, BTS-034, BTS-036
Security-Gates: SEC-GATE-013
Evidence: <sanitized evidence reference>
```

## 7. Evidence and status rules

For each task commit:

1. Replace the evidence placeholder with an actual sanitized reference.
2. Ensure the reference identifies real implementation or verification evidence.
3. Retain the tested revision, commands/test cases, actual results, and reviewer information where required.
4. Do not store secret-bearing payloads or raw credentials in the repository.
5. Do not state that a security gate passed until its execution and review are recorded.
6. Do not infer acceptance solely from the presence of a task commit.
7. Keep shared-task evidence scoped to the B-INC-004 slice.

## 8. Closing commit and annotated tag

Use the exact closing commit subject:

```text
increment(b-inc-004-audit-transactions-idempotency): close B-INC-004 — Audit, Transactions and Idempotency
```

Before creating the closing commit, confirm that implementation, test execution, security review, documentation, and evidence work satisfy the increment's closure requirements or have an explicitly authorized disposition. Do not use the closing commit to mask unresolved mandatory failures.

Required annotated tag:

```text
b-inc-004-audit-transactions-idempotency-closed
```

Create the tag only after verifying the closing commit and confirming that closure is permitted by the repository workflow.

## 9. Branch and Git execution

Use this branch name exactly:

```text
increment/b-inc-004-audit-transactions-idempotency
```

### 9.1 Create or switch to the increment branch

If the branch does not exist:

```bash
git switch -c increment/b-inc-004-audit-transactions-idempotency
```

If it already exists, inspect and switch to it:

```bash
git switch increment/b-inc-004-audit-transactions-idempotency
git status --short --branch
```

Confirm the current branch and working-tree state before making changes.

### 9.2 Commit task changes

Implement and verify each task in accordance with the dependencies. Use the exact commit templates in Section 6 and replace each evidence placeholder with a real sanitized reference.

Inspect the staged diff before committing:

```bash
git diff --check
git diff --cached --check
git diff --cached --stat
git diff --cached
```

Stage only intended task files and evidence. Do not stage secrets, generated build output, unrelated changes, or sensitive payloads.

After each commit, inspect the commit and trailers:

```bash
git show --stat --oneline HEAD
git show -s --format=%B HEAD
```

### 9.3 Run and record verification

Execute the checks required by the task, `TEST_PLAN.md`, and the repository's established validation workflow.

Record actual results, failures, skips, and blockers. For transaction and idempotency tests, retain relevant persisted-state assertions. For audit tests, retain sanitized event evidence. For migration tests, record the database environment and tool behavior.

### 9.4 Validate traceability before closure

Verify:

- All 16 AC traces remain aligned with their canonical BAC/BTS/SEC-GATE mappings.
- All task-to-AC links match `TASKS.md`.
- Every task's `Tests` and `Security-Gates` trailers match the exact task unions.
- All evidence references are real, sanitized, and reviewable.
- Migration-tool and DB-M01 FOUNDATION alignment is confirmed.
- Applicable security gates have actual execution and review records.
- Audit failure behavior follows the approved policy.
- Shared-task slices do not claim completion of unrelated obligations.
- KR-CA-025 remains deferred.
- No mandatory failure or unresolved blocker is represented as accepted.

### 9.5 Create the closing commit

Once the closure conditions are met, use this exact subject:

```text
increment(b-inc-004-audit-transactions-idempotency): close B-INC-004 — Audit, Transactions and Idempotency
```

Stage only the intended closure records, inspect the staged diff, and create the commit using the repository's approved identity and signing conventions.

### 9.6 Create and verify the annotated tag

After verifying the closing commit:

```bash
git tag -a b-inc-004-audit-transactions-idempotency-closed -m "Close B-INC-004 — Audit, Transactions and Idempotency"
```

Verify the tag target and annotation:

```bash
git show --no-patch --decorate HEAD
git show b-inc-004-audit-transactions-idempotency-closed --no-patch
git status --short --branch
```

Push only under the repository's approved remote and review policy:

```bash
git push origin increment/b-inc-004-audit-transactions-idempotency
git push origin b-inc-004-audit-transactions-idempotency-closed
```

Do not push if the target remote, review requirements, or release conditions have not been confirmed.

## 10. Final disposition

Record the actual closure result, closing commit hash, annotated tag, acceptance status, unresolved or accepted findings, and evidence references in the increment records.

**Current status: Proposed.** This procedure does not claim that tasks have been committed, tests or gates have passed, or the closing commit or tag exists.
