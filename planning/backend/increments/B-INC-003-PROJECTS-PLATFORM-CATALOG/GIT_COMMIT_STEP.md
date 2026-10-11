# B-INC-003 — PROJECTS-PLATFORM-CATALOG Git Commit Procedure

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-003 PROJECTS-PLATFORM-CATALOG Git Commit Procedure |
| Path | `planning/backend/increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/GIT_COMMIT_STEP.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; B-M03 PLATFORM |

## Related documents

- [Milestone](MILESTONE.md)
- [Tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Changelog](CHANGELOG.md)
- [Review checklist](REVIEW_CHECKLIST.md)

## 1. Purpose

This procedure defines the expected commit sequence, task-to-commit traceability, evidence requirements, increment-closing commit, and annotated release tag for B-INC-003.

The procedure preserves the existing B-M01 task IDs, task titles, estimates, dependencies, and task-to-AC mappings. Shared tasks remain slices of their existing whole-task estimates.

## 2. Mandatory commit rules

1. Implement one task per task commit unless the approved repository workflow explicitly requires otherwise.
2. Use the exact task ID and task title from `TASKS.md`.
3. Keep `Tasks`, `Acceptance`, `Tests`, and `Security-Gates` trailers aligned with `TASKS.md`.
4. `ACCEPTANCE_CRITERIA.md` is the traceability authority. Do not independently modify commit trailer mappings to compensate for an inconsistent AC.
5. Use the exact task-to-AC links and exact test/security-gate unions in the commit messages below.
6. The shared-task commits must identify their B-INC-003 slice in the subject.
7. Do not claim a test passed unless it was actually executed and its result reviewed.
8. Do not use a successful commit as evidence that an acceptance criterion passed.
9. Do not commit secrets, credentials, tokens, private signing keys, prohibited source archives, production data, or unsanitized evidence.
10. If an AC trace changes, update and validate `ACCEPTANCE_CRITERIA.md`, recalculate the affected task unions in `TASKS.md`, and update the corresponding commit message before committing.

## 3. Required pre-commit checks

Before each task commit:

- Confirm the task ID and title match `TASKS.md`.
- Confirm all linked acceptance criteria are identified.
- Confirm the commit's `Tests` trailer equals the task's `Linked tests`.
- Confirm the commit's `Security-Gates` trailer equals the task's `Linked security gates`.
- Execute the relevant available checks and retain actual results.
- Inspect the diff for unrelated changes, generated artifacts, secrets, and prohibited files.
- Verify that evidence references are sanitized and traceable to the implementation revision.
- Record unresolved failures and blockers honestly.

Before the closing commit:

- Verify all 17 acceptance criteria have recorded outcomes supported by evidence.
- Verify that task test/gate unions and commit trailers match the saved task register.
- Review the test plan and security findings.
- Confirm the B-M03 PLATFORM ownership boundary has been reviewed by the responsible owner.
- Confirm required security gates have actual execution and review records.
- Confirm the changelog and final review disposition reflect actual status.
- Ensure no mandatory failure or unresolved blocker is hidden by a closure commit.

## 4. Commit trailer contract

Use these trailer names consistently:

- `Tasks:` — exact task ID.
- `Acceptance:` — exact AC IDs linked to that task.
- `Tests:` — exact canonical test-ID union from the linked ACs.
- `Security-Gates:` — exact canonical security-gate union from the linked ACs, or `Not applicable`.
- `Evidence:` — sanitized evidence reference associated with the task commit.

The `Evidence:` value is an execution-time placeholder in the message templates below. Replace `<sanitized evidence reference>` with the actual reviewed reference before committing. Do not use a fabricated path or claim that evidence exists when it does not.

Preserve the canonical identifiers exactly. Keep the task's linked AC list in the same order as `TASKS.md`; keep test and gate identifiers in a stable, consistent order.

## 5. Recommended commit order

Follow the dependency graph in `TASKS.md` and the parent B-M01 task register.

| Sequence | Task | Scope |
|---|---|---|
| 1 | KR-BE-1-022 | Project domain model |
| 2 | KR-BE-1-023 | Project repository |
| 3 | KR-BE-1-024 | Project service |
| 4 | KR-BE-1-025 | Project APIs |
| 5 | KR-BE-1-026 | Project authorization |
| 6 | KR-BE-1-027 | Platform-catalog model and ownership boundary |
| 7 | KR-BE-1-028 | Platform repository |
| 8 | KR-BE-1-029 | Platform-catalog service |
| 9 | KR-BE-1-030 | Platform-catalog APIs |
| 10 | KR-BE-1-031 | Platform-administration authorization |
| 11 | KR-BE-1-043 | Shared API contract test slice |
| 12 | KR-BE-1-044 | Shared authorization test slice |
| 13 | KR-BE-1-045 | Shared tenant-isolation test slice |

The sequence is a recommended implementation order. Follow the actual dependencies and repository constraints if they require a different ordering; do not change dependency declarations merely to match this list.

## 6. Task commit messages

### 6.1 KR-BE-1-022 — Define Project domain model

```text
feat(backend): define Project domain model [KR-BE-1-022]

Tasks: KR-BE-1-022
Acceptance: B-INC-003-AC-01
Tests: BTS-023, BTS-025
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.2 KR-BE-1-023 — Implement ProjectRepository

```text
feat(backend): implement ProjectRepository [KR-BE-1-023]

Tasks: KR-BE-1-023
Acceptance: B-INC-003-AC-02
Tests: BTS-023, BTS-025
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.3 KR-BE-1-024 — Implement ProjectService

```text
feat(backend): implement ProjectService [KR-BE-1-024]

Tasks: KR-BE-1-024
Acceptance: B-INC-003-AC-03
Tests: BTS-023
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.4 KR-BE-1-025 — Implement project APIs

```text
feat(backend): implement project APIs [KR-BE-1-025]

Tasks: KR-BE-1-025
Acceptance: B-INC-003-AC-04, B-INC-003-AC-12
Tests: BTS-025, BTS-026, BTS-028, BTS-032
Security-Gates: SEC-GATE-009, SEC-GATE-012
Evidence: <sanitized evidence reference>
```

### 6.5 KR-BE-1-026 — Implement project authorization

```text
feat(security): implement project authorization [KR-BE-1-026]

Tasks: KR-BE-1-026
Acceptance: B-INC-003-AC-05, B-INC-003-AC-06
Tests: BTS-020, BTS-021, BTS-022, BTS-023
Security-Gates: SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.6 KR-BE-1-027 — Define platform catalog model

```text
feat(backend): define platform catalog model [KR-BE-1-027]

Tasks: KR-BE-1-027
Acceptance: B-INC-003-AC-07
Tests: BTS-027
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.7 KR-BE-1-028 — Implement PlatformRepository

```text
feat(backend): implement PlatformRepository [KR-BE-1-028]

Tasks: KR-BE-1-028
Acceptance: B-INC-003-AC-08
Tests: BTS-027
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.8 KR-BE-1-029 — Implement platform catalog service

```text
feat(backend): implement platform catalog service [KR-BE-1-029]

Tasks: KR-BE-1-029
Acceptance: B-INC-003-AC-09
Tests: BTS-027, BTS-028
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.9 KR-BE-1-030 — Implement platform catalog APIs

```text
feat(backend): implement platform catalog APIs [KR-BE-1-030]

Tasks: KR-BE-1-030
Acceptance: B-INC-003-AC-10
Tests: BTS-027, BTS-028, BTS-032
Security-Gates: Not applicable
Evidence: <sanitized evidence reference>
```

### 6.10 KR-BE-1-031 — Implement platform administration authorization

```text
feat(security): implement platform administration authorization [KR-BE-1-031]

Tasks: KR-BE-1-031
Acceptance: B-INC-003-AC-11
Tests: BTS-024
Security-Gates: SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.11 KR-BE-1-043 — Add API contract tests (B-INC-003 slice)

```text
test(backend): add project and platform catalog API contract coverage [KR-BE-1-043 B-INC-003 slice]

Tasks: KR-BE-1-043
Acceptance: B-INC-003-AC-04, B-INC-003-AC-10, B-INC-003-AC-12, B-INC-003-AC-13, B-INC-003-AC-16
Tests: BTS-025, BTS-026, BTS-027, BTS-028, BTS-032, BTS-036
Security-Gates: SEC-GATE-009, SEC-GATE-012, SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.12 KR-BE-1-044 — Add authorization tests (B-INC-003 slice)

```text
test(security): add project and platform administration authorization coverage [KR-BE-1-044 B-INC-003 slice]

Tasks: KR-BE-1-044
Acceptance: B-INC-003-AC-05, B-INC-003-AC-11, B-INC-003-AC-14, B-INC-003-AC-17
Tests: BTS-023, BTS-024, BTS-036
Security-Gates: SEC-GATE-012, SEC-GATE-013
Evidence: <sanitized evidence reference>
```

### 6.13 KR-BE-1-045 — Add tenant-isolation tests (B-INC-003 slice)

```text
test(security): add project tenant isolation coverage [KR-BE-1-045 B-INC-003 slice]

Tasks: KR-BE-1-045
Acceptance: B-INC-003-AC-06, B-INC-003-AC-15, B-INC-003-AC-17
Tests: BTS-020, BTS-021, BTS-022, BTS-036
Security-Gates: SEC-GATE-012, SEC-GATE-013
Evidence: <sanitized evidence reference>
```

## 7. Evidence and status rules

For each task commit:

1. Replace the evidence placeholder with an actual sanitized evidence reference.
2. Ensure the reference identifies the task's real implementation or verification evidence.
3. Retain the revision, executed command/test, actual result, and reviewer information where required by the test plan.
4. Do not store secret-bearing payloads or raw credentials in the repository.
5. Do not state that a security gate passed until its execution and review are recorded.
6. If evidence is not yet available, do not create a misleading evidence trailer. Complete the required work or follow the repository's approved incomplete-work procedure.

Task commits record changes. They do not independently confer acceptance.

## 8. Closing commit and annotated tag

Use the exact closing commit subject requested for this increment:

```text
increment(b-inc-003-projects-platform-catalog): close B-INC-003 — Projects and Platform Catalog
```

Before creating the closing commit, confirm that all required implementation, test, security-review, documentation, and evidence work has been completed or has an explicitly approved disposition.

The closing commit should contain the final increment records and any final status updates required by the repository workflow. Do not mark the increment accepted if mandatory acceptance criteria remain unresolved.

Create the annotated tag only after the closing commit has been reviewed and the increment is eligible for closure.

Required tag:

```text
b-inc-003-projects-platform-catalog-closed
```

## 9. Branch and Git execution

Use this branch name exactly:

```text
increment/b-inc-003-projects-platform-catalog
```

### 9.1 Create or switch to the increment branch

```bash
git switch -c increment/b-inc-003-projects-platform-catalog
```

If the branch already exists, inspect it and switch to it rather than attempting to create a duplicate:

```bash
git switch increment/b-inc-003-projects-platform-catalog
git status --short --branch
```

Confirm that the working tree and current branch are appropriate before proceeding.

### 9.2 Commit task changes

Implement and verify each task according to the dependency graph. Use the exact message template in Section 6 for each task and replace the evidence placeholder with the actual sanitized reference.

Review the staged diff before each commit:

```bash
git diff --check
git diff --cached --check
git diff --cached --stat
git diff --cached
```

Stage only the intended task files and evidence. Do not stage secrets, generated build output, unrelated changes, or prohibited source material.

After each commit, verify the commit and its trailers:

```bash
git show --stat --oneline HEAD
git show -s --format=%B HEAD
```

### 9.3 Run and record verification

Run the checks required by the applicable task, `TEST_PLAN.md`, and the repository's existing validation workflow.

Record actual outcomes and evidence references. Do not replace an unexecuted test with a presumed pass or infer database enforcement from an application-only test.

### 9.4 Validate traceability before closure

Verify:

- All 17 AC entries remain aligned with their canonical BAC/BTS/SEC-GATE traces.
- All 13 task-to-AC links match `TASKS.md`.
- Every task's `Tests` and `Security-Gates` trailers match the exact unions in `TASKS.md`.
- Shared-task commits retain the correct B-INC-003 slice labels.
- Evidence references are real, sanitized, and reviewable.
- Security findings and gate records reflect actual status.
- B-M03 PLATFORM ownership confirmation is retained.
- No mandatory acceptance failure or unresolved blocker is represented as accepted.

### 9.5 Create the closing commit

Once closure conditions are met, use the exact subject:

```text
increment(b-inc-003-projects-platform-catalog): close B-INC-003 — Projects and Platform Catalog
```

Stage only the final increment records and intended closure changes, inspect the staged diff, and create the commit using the repository's approved identity and signing conventions.

### 9.6 Create the annotated tag

After verifying the closing commit:

```bash
git tag -a b-inc-003-projects-platform-catalog-closed -m "Close B-INC-003 — Projects and Platform Catalog"
```

Verify the tag target and annotation:

```bash
git show --no-patch --decorate HEAD
git show b-inc-003-projects-platform-catalog-closed --no-patch
git status --short --branch
```

Push the branch and tag only under the repository's approved remote and review policy:

```bash
git push origin increment/b-inc-003-projects-platform-catalog
git push origin b-inc-003-projects-platform-catalog-closed
```

Do not push if the target remote, review requirements, or release conditions have not been confirmed.

## 10. Final disposition

Record the actual closure result in the increment records. Include the closing commit hash, annotated tag, final acceptance status, unresolved or accepted findings, and evidence references.

**Current status: Proposed.** This procedure defines the planned workflow; it does not claim that any task has been committed, that tests or gates have passed, or that the closing commit or tag exists.
