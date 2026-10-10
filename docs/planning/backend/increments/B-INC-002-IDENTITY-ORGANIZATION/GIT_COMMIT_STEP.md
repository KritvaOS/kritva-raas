# B-INC-002 — IDENTITY-ORGANIZATION Git Commit Step

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Git Commit Step |
| Path | `docs/planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/GIT_COMMIT_STEP.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Increment changelog](CHANGELOG.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend task register](../../BACKEND_TASK_REGISTER.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)
- [Parent B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Purpose

This document defines the branch, atomic commit, evidence, and closing-tag procedure for B-INC-002 IDENTITY-ORGANIZATION.

The commit sequence must preserve the existing B-M01 task IDs, the increment's acceptance traceability, and the distinction between this increment's slices of shared tasks and the remaining B-INC-003 work.

A commit is not proof of acceptance. Required tests, security checks, reviews, and acceptance evidence must be completed and inspected before the increment is closed.

## 2. Mandatory commit rules

### 2.1 One implementation task per commit

Create one atomic implementation commit per task listed in Section 9.

- Each implementation commit must address one task ID or one explicitly identified shared-task slice.
- Do not combine unrelated task IDs in one implementation commit.
- The shared tasks `KR-BE-1-044` and `KR-BE-1-045` retain their existing task IDs and whole-task estimates. Their B-INC-002 commit subjects must explicitly identify the increment slice.
- Do not mark a shared task fully accepted until its other allocated increment slices are accepted.
- Keep implementation, tests, documentation, and evidence for a task together where practical, without including unrelated changes.
- Use the exact acceptance and test identifiers specified in the task register.
- The `Acceptance`, `Tests`, and `Security-Gates` trailers must match the linked values in `TASKS.md` exactly.

### 2.2 No secrets or key material

Never commit real credentials or security-key material. Prohibited content includes passwords, API keys, authentication tokens, private keys, private certificates, database credentials, production identity-provider secrets, populated `.env` files, and logs or fixtures that expose such values.

Use synthetic test identities and unmistakably nonfunctional placeholders. Do not put actual secret values into commit messages, scanner exceptions, test reports, or evidence files.

### 2.3 No unsupported claims

Do not claim that tests passed, a security control was verified, a review was completed, or an acceptance criterion was accepted unless the relevant work actually occurred and its evidence was inspected.

For any test or check that could not be run:

- Record `Not run` or `Blocked` as appropriate.
- Explain the reason and identify the owner of the unresolved dependency.
- Keep the affected acceptance criterion unpassed.
- Do not use the closing commit or tag to bypass an unmet acceptance condition.

### 2.4 Preserve traceability

`ACCEPTANCE_CRITERIA.md` is the authoritative increment-level source for AC-to-BAC/BTS/SEC-GATE mappings.

Before committing a task:

1. Verify its `Linked AC` field.
2. Verify that `Linked tests` is the exact union of the linked AC test traces.
3. Verify that `Linked security gates` is the exact union of the linked AC security-gate traces.
4. Ensure the commit message trailers reproduce those values exactly.
5. Confirm that any shared-task slice is clearly identified.

The current linked security-gate traces are `Not applicable`. Do not invent a `SEC-GATE-*` identifier to populate a commit trailer.

## 3. Branch preparation

The canonical implementation branch is:

`increment/b-inc-002-identity-organization`

Before creating or switching branches, inspect the repository state and ensure the branch name agrees with the increment plan.

```bash
git status --short --branch
git branch --show-current
git fetch origin
```

If the branch does not exist locally, create it from the approved current base branch:

```bash
git switch -c increment/b-inc-002-identity-organization <approved-base-branch>
```

If it already exists, inspect its base and divergence before continuing:

```bash
git switch increment/b-inc-002-identity-organization
git status --short --branch
git log --oneline --decorate -10
```

Do not overwrite uncommitted user changes or reset the branch without explicit authorization.

## 4. Pre-commit checks

Run the checks applicable to the changed task and the repository's actual implementation state.

### 4.1 Inspect the change

```bash
git status --short
git diff --check
git diff --stat
git diff
```

Inspect staged content separately before committing:

```bash
git diff --cached --check
git diff --cached --stat
git diff --cached
```

Confirm that only the intended task's changes and evidence are staged.

### 4.2 Documentation and traceability

Run the repository's canonical documentation checker and applicable traceability validation.

Verify:

- Required increment files and links are present.
- Document Control tables use the standard five fields.
- Frozen phase and official milestone names are preserved.
- Task IDs and acceptance IDs are valid.
- The task's linked test and security-gate lists are exact AC-derived unions.
- The commit trailers match the task register.
- Shared-task slices remain distinct.
- Deferred `KR-CA-022` through `KR-CA-026` have not been scheduled or implicitly marked complete.

Record the actual command and result. Do not claim validation passed without running the checker.

### 4.3 Tests and code quality

Run the task's required tests and relevant regression tests, using the commands defined by the implementation and canonical test strategy.

As applicable, execute:

- Unit tests.
- Repository tests against the required test database.
- Authentication and authorization tests.
- Organization and membership integration tests.
- Tenant-context and cross-tenant isolation tests.
- Database-enforcement tests required by the approved DB-M01 contract.
- Lint, type checks, static analysis, and build checks supported by the repository.

Record actual results. A mock-only test must not be described as proof of required database tenant enforcement.

### 4.4 Security checks

Run the applicable repository secret checks and ensure the blocking CI controls remain enabled.

- Inspect source, configuration, fixtures, logs, and staged changes.
- Confirm that test credentials are synthetic and safe.
- Ensure no real secrets or security-key material are committed.
- Confirm scanner failures are not converted into successful results.
- Review any candidate finding with the Security Owner.
- Keep evidence sanitized.

If a possible real secret is found, stop the commit process and follow the approved exposure-response procedure. Do not merely delete the current copy and assume the issue is resolved.

## 5. Atomic commit procedure

For each task:

1. Confirm its dependencies and acceptance criteria are ready.
2. Implement only the task's approved scope.
3. Run the applicable tests and quality/security checks.
4. Inspect the complete diff.
5. Prepare sanitized evidence and update task status honestly.
6. Stage only the intended changes.
7. Verify the staged diff and exact trace values.
8. Use the corresponding Section 9 commit message.
9. Replace the evidence-path placeholder with the actual sanitized evidence path or approved issue reference before committing.
10. Commit and record the resulting commit hash.
11. Update the task record with the real status and evidence.

Example command sequence:

```bash
git add <intended-task-files>
git diff --cached --check
git diff --cached
git commit
git status --short --branch
git log -1 --format=fuller
```

Do not use a blanket `git add .` without inspecting the working tree and staged content.

## 6. Commit message format

Use this subject format:

`<type>(backend): <imperative summary> [<TASK-ID>]`

Each commit must contain these trailers:

```text
Tasks: <exact task ID or scoped shared-task slice>
Acceptance: <exact AC IDs from TASKS.md>
Tests: <exact BTS IDs from TASKS.md>
Security-Gates: <exact gate trace from TASKS.md>
Evidence: <actual sanitized evidence path or approved issue reference>
```

The `Acceptance`, `Tests`, and `Security-Gates` values must match `TASKS.md` exactly. Preserve ID ordering and use `Not applicable` where that is the task's recorded gate value.

The `Evidence` value must refer to evidence that exists or to an approved issue/reference that records the actual result. Replace the template placeholder before committing.

Do not put secret values, raw tokens, credentials, or sensitive diagnostic output in a commit subject or trailer.

## 7. Shared-task slice rules

### KR-BE-1-044 — Authorization tests

The B-INC-002 commit must identify the identity and organization slice explicitly:

`[KR-BE-1-044 B-INC-002 slice]`

Its commit does not close the project and platform-administration authorization obligations assigned to B-INC-003.

### KR-BE-1-045 — Tenant-isolation tests

The B-INC-002 commit must identify the identity and organization slice explicitly:

`[KR-BE-1-045 B-INC-002 slice]`

Its commit does not close the project-specific tenant-isolation obligation assigned to B-INC-003. Required database enforcement evidence for the B-INC-002 scope must be included where applicable.

Do not change the original task IDs or create duplicate full-task entries to represent these slices.

## 8. Commit order and dependency discipline

Use the dependency order in `TASKS.md` and the actual approved implementation contracts. The intended sequence is:

1. `KR-BE-1-010` identity domain model.
2. `KR-BE-1-011` UserRepository.
3. `KR-BE-1-012` authentication adapter boundary.
4. `KR-BE-1-013` current-user endpoint.
5. `KR-BE-1-014` Organization model.
6. `KR-BE-1-015` OrganizationRepository.
7. `KR-BE-1-016` MembershipRepository.
8. `KR-BE-1-017` OrganizationService.
9. `KR-BE-1-018` organization APIs.
10. `KR-BE-1-019` role/permission model.
11. `KR-BE-1-020` authorization policy layer.
12. `KR-BE-1-021` tenant-context enforcement.
13. `KR-BE-1-044` B-INC-002 authorization test slice.
14. `KR-BE-1-045` B-INC-002 tenant-isolation test slice.

This is the planned sequence, not permission to bypass a missing dependency. Where implementation sequencing must change, record the rationale and verify that the dependency and interface contracts remain valid.

## 9. Required commit messages, closing commit, and tag

The following messages are prepared from the linked AC, test, and security-gate values in the B-INC-002 task register. Before using each message, replace its `Evidence` placeholder with the actual sanitized evidence reference.

### 9.1 KR-BE-1-010 — Define identity domain model

```text
feat(backend): define identity domain model [KR-BE-1-010]

Tasks: KR-BE-1-010
Acceptance: B-INC-002-AC-01
Tests: BTS-017
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.2 KR-BE-1-011 — Implement UserRepository

```text
feat(backend): implement user repository [KR-BE-1-011]

Tasks: KR-BE-1-011
Acceptance: B-INC-002-AC-02
Tests: BTS-019
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.3 KR-BE-1-012 — Implement authentication adapter boundary

```text
feat(backend): implement authentication adapter boundary [KR-BE-1-012]

Tasks: KR-BE-1-012
Acceptance: B-INC-002-AC-03
Tests: BTS-017
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.4 KR-BE-1-013 — Implement current-user endpoint

```text
feat(backend): implement current-user endpoint [KR-BE-1-013]

Tasks: KR-BE-1-013
Acceptance: B-INC-002-AC-04
Tests: BTS-017, BTS-032
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.5 KR-BE-1-014 — Define Organization model

```text
feat(backend): define organization model [KR-BE-1-014]

Tasks: KR-BE-1-014
Acceptance: B-INC-002-AC-05
Tests: BTS-019
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.6 KR-BE-1-015 — Implement OrganizationRepository

```text
feat(backend): implement organization repository [KR-BE-1-015]

Tasks: KR-BE-1-015
Acceptance: B-INC-002-AC-06
Tests: BTS-019
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.7 KR-BE-1-016 — Implement MembershipRepository

```text
feat(backend): implement membership repository [KR-BE-1-016]

Tasks: KR-BE-1-016
Acceptance: B-INC-002-AC-07
Tests: BTS-019
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.8 KR-BE-1-017 — Implement OrganizationService

```text
feat(backend): implement organization service [KR-BE-1-017]

Tasks: KR-BE-1-017
Acceptance: B-INC-002-AC-08
Tests: BTS-018, BTS-019
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.9 KR-BE-1-018 — Implement organization APIs

```text
feat(backend): implement organization APIs [KR-BE-1-018]

Tasks: KR-BE-1-018
Acceptance: B-INC-002-AC-09
Tests: BTS-018, BTS-019, BTS-032
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.10 KR-BE-1-019 — Define role/permission model

```text
feat(backend): define role and permission model [KR-BE-1-019]

Tasks: KR-BE-1-019
Acceptance: B-INC-002-AC-10
Tests: BTS-018
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.11 KR-BE-1-020 — Implement authorization policy layer

```text
feat(backend): implement authorization policy layer [KR-BE-1-020]

Tasks: KR-BE-1-020
Acceptance: B-INC-002-AC-11
Tests: BTS-018
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.12 KR-BE-1-021 — Implement tenant context enforcement

```text
feat(backend): enforce tenant context [KR-BE-1-021]

Tasks: KR-BE-1-021
Acceptance: B-INC-002-AC-12, B-INC-002-AC-13
Tests: BTS-020, BTS-021, BTS-022
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.13 KR-BE-1-044 — Authorization test slice

```text
test(backend): add identity and organization authorization tests [KR-BE-1-044 B-INC-002 slice]

Tasks: KR-BE-1-044 B-INC-002 slice
Acceptance: B-INC-002-AC-11, B-INC-002-AC-14, B-INC-002-AC-16
Tests: BTS-018, BTS-019, BTS-032, BTS-036
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.14 KR-BE-1-045 — Tenant-isolation test slice

```text
test(backend): add identity and organization tenant-isolation tests [KR-BE-1-045 B-INC-002 slice]

Tasks: KR-BE-1-045 B-INC-002 slice
Acceptance: B-INC-002-AC-13, B-INC-002-AC-15
Tests: BTS-020, BTS-021, BTS-022
Security-Gates: Not applicable
Evidence: <actual sanitized evidence path or approved issue reference>
```

### 9.15 Closing commit

Create the closing commit only after the authorized acceptance authority has reviewed the completed acceptance matrix, task records, test results, security review, required database evidence, and finding dispositions.

Required closing commit subject:

```text
increment(b-inc-002-identity-organization): close B-INC-002 — Identity and Organization
```

The closing commit must include or reference the final reviewed acceptance record, completed review outcomes, actual test/evidence summary, task dispositions, and any explicitly permitted non-blocking actions.

Do not close the increment if a mandatory acceptance condition remains failed, blocked, or unsupported by evidence.

### 9.16 Annotated tag

After the closing commit has been created and verified, create the required annotated tag:

`b-inc-002-identity-organization-closed`

Example:

```bash
git tag -a b-inc-002-identity-organization-closed -m "Close B-INC-002 — Identity and Organization"
git show --no-patch --decorate b-inc-002-identity-organization-closed
```

Verify that the tag points to the intended closing commit. Do not create or move the closing tag before acceptance, and do not force-update it to conceal an incorrect target.

## 10. Post-commit verification

After each implementation commit:

```bash
git status --short --branch
git log -1 --format=fuller
```

Before the closing commit:

- [ ] All 14 task/slice commits are present or their explicitly approved disposition is recorded.
- [ ] Each commit has the required task, acceptance, test, security-gate, and evidence trailers.
- [ ] The `Acceptance`, `Tests`, and `Security-Gates` trailers match `TASKS.md`.
- [ ] All applicable acceptance criteria have reviewed evidence and explicit results.
- [ ] Required authorization and tenant-isolation tests have been run and reviewed.
- [ ] Required database tenant-enforcement evidence is available.
- [ ] Shared task slices remain correctly scoped.
- [ ] Deferred coding-agent policy tasks remain deferred.
- [ ] Mandatory findings are closed with evidence or otherwise resolved under the governing acceptance rules.
- [ ] No prohibited secret or key material has been introduced.
- [ ] The repository documentation and traceability checks have been run and their actual results recorded.
- [ ] The authorized acceptance authority has approved increment closure.

After closure:

- [ ] The closing commit subject matches Section 9.15.
- [ ] The annotated tag is `b-inc-002-identity-organization-closed`.
- [ ] The tag points to the intended closing commit.
- [ ] The branch and tag are pushed only according to the repository's approved workflow.
- [ ] The final commit hash, tag target, evidence reference, and acceptance disposition are recorded.

## 11. Status

**Status: Proposed.**

This procedure defines the intended commit discipline. It does not claim that the branch, task commits, closing commit, tag, tests, or acceptance currently exist.
