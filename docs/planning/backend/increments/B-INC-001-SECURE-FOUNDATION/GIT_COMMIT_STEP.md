# B-INC-001 — Git Commit and Verification Procedure

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 Git Commit and Verification Procedure |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/GIT_COMMIT_STEP.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Increment test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Increment changelog](CHANGELOG.md)
- [Program task register](../../BACKEND_TASK_REGISTER.md)
- [Program security gate](../../BACKEND_SECURITY_GATE.md)
- [Program test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Program changelog](../../BACKEND_CHANGELOG.md)
- [B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## 1. Mandatory Rules

1. Use one atomic implementation commit per task wherever practical.
2. Every implementation commit must identify its task ID or IDs.
3. Never commit a real secret, private key, credential, token, password, certificate containing sensitive material, or signing/encryption key material.
4. Never use a scanner suppression to conceal a confirmed secret.
5. Never claim tests, lint, documentation checks, scanner checks, or security gates passed unless the command ran and its result was inspected.
6. Keep generated logs and evidence sanitized. Do not commit raw output that contains credentials or other sensitive values.
7. Keep technology decisions open until approved. Do not encode an unapproved choice as an undocumented project standard.
8. A failed required security check blocks the commit or merge path until the finding is investigated and resolved.
9. A clean working tree and successful tests do not prove that repository history is free of previously committed secrets.
10. The commit procedure never overrides a blocking `SEC-GATE-*` requirement.

## 2. Pre-Commit Checks

Run all applicable checks before committing. Commands below are illustrative until the runtime, package manager, and script names are approved. Replace them with the exact commands recorded in the repository's development documentation; do not silently omit a check.

### 2.1 Inspect repository state and diff

```bash
git status --short
git diff --check
git diff --stat
git diff
git diff --cached
```

Review staged content independently from unstaged changes. Confirm the staged set contains only the intended task's files.

### 2.2 Documentation checker

Run the repository's canonical documentation checker once its actual path and invocation are confirmed.

The check must validate, at minimum:

- Markdown and document structure where supported.
- Required document-control fields, including the full `docs/` path.
- Internal links and relative paths.
- Task, acceptance, test, and security-gate references where supported.
- Frozen phase and milestone names.
- Unique IDs within their defined namespaces, where supported.

Record the actual command, exit code, and concise result. A checker result from an earlier commit does not validate the current diff.

### 2.3 Secret scanning

Run the approved secret scanner against staged changes or the complete working tree, according to the scanner's supported modes. Also run the documented repository-history scan at the designated security checkpoints.

The scanner must:

- Detect a controlled synthetic positive fixture.
- Return a failing status for a confirmed finding.
- Produce no secret-bearing console or CI output.
- Use only reviewed, narrow exceptions.
- Include the relevant tracked-file scope.

Do not commit a scanner-positive fixture accidentally. Use an isolated test directory or controlled temporary branch, then remove the fixture and verify the final diff.

Inspect every finding. Do not blindly accept an automated scanner result as proof that a finding is either real or false.

### 2.4 Tests

Once the selected stack and test scripts exist:

- Run relevant unit tests.
- Run component and integration tests for the changed task.
- Run applicable canonical `BTS-*` tests.
- Run the full required suite at increment acceptance.
- Retain exit codes and sanitized output.

If the test framework or test command does not exist yet, record **NOT IMPLEMENTED** and link the task responsible for providing it. Do not label it PASS.

### 2.5 Lint, types, and static checks

Once available for the selected stack, run the repository's canonical:

- Lint command.
- Type-check command.
- Formatting check, if required.
- Static analysis, if required.

Use the exact approved package-manager scripts. Do not invent or mix npm/pnpm commands before the package-manager decision is approved.

### 2.6 Build and configuration checks

For tasks that change runtime or configuration:

- Verify lockfile consistency.
- Run the documented build or compile step.
- Test valid configuration.
- Test missing and invalid required configuration.
- Verify unsafe defaults are rejected.
- Confirm logs and error messages do not disclose secret values.

### 2.7 CI verification

Before increment acceptance, verify the required CI workflow actually runs on the intended changes and blocks the required merge path when the secret scanner fails.

Retain the workflow file reference, run identifier, result, and evidence that the check is required by repository policy. A workflow that exists but is optional or never runs is not sufficient evidence of blocking enforcement.

## 3. Atomic Commit Boundaries

Create one implementation commit per task by default. If a task requires multiple inseparable files, include those files together. Do not combine unrelated tasks simply to reduce the number of commits.

| Task group | Atomic boundary | Required review focus |
|---|---|---|
| `KR-BE-1-001` | Application structure | Minimal scaffold and reproducible entry point |
| `KR-BE-1-002` | Module boundaries | Dependencies and ownership boundaries |
| `KR-BE-1-003` | Configuration framework | Safe defaults, validation, no secret values |
| `KR-BE-1-004` | HTTP transport | Framework decision and transport tests |
| `KR-BE-1-005` | Request context | Context lifecycle and propagation |
| `KR-BE-1-006` | API v1 routing | Versioned route structure and tests |
| `KR-BE-1-007` | Validation/error contract | Stable errors and safe error content |
| `KR-BE-1-008` | Request correlation | Correlation IDs without sensitive payload logging |
| `KR-BE-1-009` | Health/readiness | Safe status semantics and tests |
| `KR-BE-1-041` | Structured logging | Redaction, field allowlisting, and sensitive-data tests |
| `KR-BINC-001-001` through `KR-BINC-001-004` | One commit per decision task | Decision records; no unapproved choice encoded as final |
| `KR-BINC-001-005` through `KR-BINC-001-008` | One commit per policy/configuration task | Secret policy, ignore rules, examples, scanner selection |
| `KR-BINC-001-009` through `KR-BINC-001-010` | One commit per enforcement task | Local scanning and blocking CI |
| `KR-BINC-001-011` through `KR-BINC-001-012` | One commit per history/response task | History assessment and leak response |
| `KR-BINC-001-013` through `KR-BINC-001-015` | One commit per verification task | Safe configuration, redaction, exception verification |
| `KR-BINC-001-016` through `KR-BINC-001-017` | One commit per documentation/reproducibility task | Security documentation and clean-checkout procedure |
| `KR-BINC-001-018` | One commit | Source header standard, checker, tests, workflow and hook |
| `KR-BINC-001-019` | One commit | Root Makefile and its header-check coverage |

The ranges above are grouping guidance, not permission to combine all tasks in a range into one commit. Each `KR-BINC-001-nnn` task is a separate atomic boundary unless the task register explicitly documents an inseparable dependency and the reviewer approves the exception.

### Shared and cross-cutting work

- Keep each task's implementation commit focused on that task.
- Put increment-wide acceptance evidence in a separate evidence/acceptance commit only if the repository workflow requires versioned evidence or acceptance records.
- Do not fabricate commits for tests or reviews that did not occur.
- If a single fix necessarily spans multiple tasks, document the reason, include all task IDs in the commit message, and update each affected task and acceptance record.

## 4. Commit Message Format

Use this format:

```text
<type>(backend): <imperative summary> [<TASK-ID>]

Optional concise explanation of why the change is needed.

Tasks: <TASK-ID>[, <TASK-ID>...]
Acceptance: <B-INC-001-AC-ID>[, ...]
Tests: <BTS-ID>[, ...] or NOT-RUN with reason
Security-Gates: <SEC-GATE-ID>[, ...] or NOT-APPLICABLE with reason
Evidence: <sanitized path or CI run reference>
```

Allowed types:

- `feat` — new runtime or application behaviour.
- `fix` — correction of existing behaviour.
- `test` — tests or test infrastructure.
- `build` — package, build, or CI tooling.
- `docs` — documentation-only change.
- `security` — security control or remediation.
- `refactor` — structural change without intended behaviour change.
- `chore` — maintenance that does not fit the categories above.

Example:

```text
security(backend): enforce local secret scan [KR-BINC-001-009]

Fail the local verification command when the approved scanner detects a
confirmed secret-pattern finding.

Tasks: KR-BINC-001-009
Acceptance: B-INC-001-AC-16
Tests: BTS-010
Security-Gates: SEC-GATE-004, SEC-GATE-010
Evidence: <sanitized test result reference>
```

This is a format example only. Replace placeholder references with actual canonical IDs and evidence before committing. Do not claim a test or gate passed when it was not run or evaluated.

If repository policy requires a co-author trailer or other commit metadata, follow the approved repository convention in addition to this format.

## 5. Evidence to Retain

For every task commit, retain or reference:

- Task ID and commit SHA.
- List of changed files.
- Documentation checker result, when relevant.
- Scanner result and configuration/version, when relevant.
- Test IDs, commands, exit codes, and sanitized result references.
- Lint/type/static-check results when available.
- Applicable increment AC and canonical `BTS-*`/`SEC-GATE-*` IDs.
- Reviewer decision and open follow-ups.
- Any exception, with approver and rationale.

At increment acceptance, retain the consolidated evidence package described in `TEST_PLAN.md` and the sign-off record in `SECURITY_REVIEW.md`.

Do not commit raw CI logs, environment dumps, secret-bearing scanner output, or production-like credentials as evidence. Prefer sanitized summaries and immutable CI run references.

## 6. If a Secret or Key Is Found

**Never commit the secret. Never push it “temporarily.” Never include the value in a commit message, test output, issue, or review comment.**

If the value is staged but not committed:

1. Stop the commit.
2. Unstage and remove the secret from the working tree.
3. Replace the value with a safe placeholder or use an approved secret-management mechanism.
4. Inspect the diff and staged files.
5. Rerun the scanner and inspect the finding disposition.
6. If the value was real or exposure cannot be ruled out, follow the incident procedure below.

If the value was committed or pushed, or a real exposure is plausible:

1. Stop further commits, merges, releases, and distribution of affected artifacts.
2. Notify the designated security owner through the approved private incident channel.
3. Revoke or rotate the credential/key and verify the old value is no longer valid where applicable.
4. Identify affected branches, tags, CI logs, artifacts, caches, and downstream copies.
5. Remove the value from current files and assess coordinated history cleanup with the repository owner.
6. Rerun current-file and history scans, inspect all findings, and retain sanitized evidence.
7. Complete incident disposition and obtain explicit security-owner approval before resuming the blocked workflow.

A deletion commit alone does not remediate a leaked credential. A history rewrite alone does not revoke it. Rotation and exposure assessment remain necessary.

## 7. Increment Acceptance Commit

Do not create an acceptance commit until:

- All applicable pre-commit checks have been run and recorded.
- `B-INC-001-AC-01` through `B-INC-001-AC-21` have explicit results.
- The canonical `BTS-*` tests have been verified and traced.
- Applicable `SEC-GATE-*` statuses are explicit.
- Blocking findings are resolved.
- The security review has a recorded decision.
- The changelog and task register reflect actual states.
- The final working tree and staged diff contain no secret or key material.

A suitable acceptance commit, if repository policy calls for one, must identify the increment and record the verified evidence references. It must not imply that a blocked criterion passed.

## 8. Final Commit Checklist

- [ ] Task ID is valid and exists in the task register.
- [ ] Commit boundary contains one task or an explicitly approved inseparable change.
- [ ] Full staged diff reviewed.
- [ ] `git diff --check` passed.
- [ ] Documentation checker run; findings resolved or explicitly dispositioned.
- [ ] Secret scanner run; findings investigated.
- [ ] No real secret, private key, credential, or key material is staged or committed.
- [ ] Relevant tests run and results recorded.
- [ ] Lint/type/static checks run where implemented.
- [ ] CI behaviour and required-check status verified where applicable.
- [ ] Canonical test, acceptance, and security-gate references are correct.
- [ ] Evidence is sanitized and retained.
- [ ] Changelog/task status updated truthfully.
- [ ] Review and security-gate requirements satisfied before acceptance.

If any required security check fails or remains unverified, do not mark the task or increment accepted.

## 9. Branch, Per-Task Commit Text and Closing Commit

### 9.1 Increment branch

- Increment: `B-INC-001 — Secure Foundation`
- Parent milestone: `B-M01 CONTROL PLANE`
- Branch: `increment/b-inc-001-secure-foundation`
- Branch creation:

```bash
git switch -c increment/b-inc-001-secure-foundation
```

Create the branch from the agreed integration base. Do not create a replacement official milestone or change the frozen milestone names.

### 9.2 Per-task commit convention

Use one atomic implementation commit per task. The commit subject must identify the task, and the body must retain the task's acceptance, test, security-gate, and evidence trace.

The messages below use the task-to-acceptance, task-to-test, and task-to-security-gate mappings supplied for this increment. Do not substitute IDs from memory or infer replacement IDs.

For each commit:

- `Tasks` identifies the task being committed.
- `Acceptance` lists the linked `B-INC-001-AC-*` criteria.
- `Tests` lists the linked `BTS-*` definitions.
- `Security-Gates` lists the linked `SEC-GATE-*` definitions or explicitly says `Not applicable`.
- `Evidence` must be replaced with a real, sanitized evidence reference before committing. Do not claim a test or gate passed without recorded evidence.

### 9.3 Ready-to-use per-task commit messages

#### KR-BE-1-001 — Create Control Plane application structure

```text
feat(backend): create Control Plane application structure [KR-BE-1-001]

Tasks: KR-BE-1-001
Acceptance: B-INC-001-AC-01, B-INC-001-AC-02
Tests: BTS-001, BTS-036
Security-Gates: SEC-GATE-003, SEC-GATE-004, SEC-GATE-013
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-002 — Define backend module boundaries

```text
feat(backend): define backend module boundaries [KR-BE-1-002]

Tasks: KR-BE-1-002
Acceptance: B-INC-001-AC-02, B-INC-001-AC-03
Tests: BTS-001, BTS-004
Security-Gates: SEC-GATE-003
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-003 — Establish configuration framework

```text
feat(backend): establish configuration framework [KR-BE-1-003]

Tasks: KR-BE-1-003
Acceptance: B-INC-001-AC-04, B-INC-001-AC-05
Tests: BTS-002, BTS-003, BTS-010
Security-Gates: SEC-GATE-003, SEC-GATE-008
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-004 — Establish HTTP transport

```text
feat(backend): establish HTTP transport [KR-BE-1-004]

Tasks: KR-BE-1-004
Acceptance: B-INC-001-AC-06
Tests: BTS-007, BTS-032
Security-Gates: Not applicable
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-005 — Implement request context

```text
feat(backend): implement request context [KR-BE-1-005]

Tasks: KR-BE-1-005
Acceptance: B-INC-001-AC-07
Tests: BTS-005, BTS-006
Security-Gates: SEC-GATE-009
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-006 — Implement API v1 routing

```text
feat(backend): implement API v1 routing [KR-BE-1-006]

Tasks: KR-BE-1-006
Acceptance: B-INC-001-AC-06, B-INC-001-AC-08
Tests: BTS-007, BTS-032
Security-Gates: SEC-GATE-009
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-007 — Implement validation/error contract

```text
feat(backend): implement validation and error contract [KR-BE-1-007]

Tasks: KR-BE-1-007
Acceptance: B-INC-001-AC-08, B-INC-001-AC-09
Tests: BTS-007
Security-Gates: SEC-GATE-009
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-008 — Implement request correlation

```text
feat(backend): implement request correlation [KR-BE-1-008]

Tasks: KR-BE-1-008
Acceptance: B-INC-001-AC-07, B-INC-001-AC-10
Tests: BTS-005, BTS-006, BTS-009
Security-Gates: SEC-GATE-009
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-009 — Implement health/readiness endpoints

```text
feat(backend): implement health and readiness endpoints [KR-BE-1-009]

Tasks: KR-BE-1-009
Acceptance: B-INC-001-AC-11
Tests: BTS-008
Security-Gates: SEC-GATE-008
Evidence: <replace with sanitized evidence reference>
```

#### KR-BE-1-041 — Implement structured backend logging

```text
feat(backend): implement structured backend logging [KR-BE-1-041]

Tasks: KR-BE-1-041
Acceptance: B-INC-001-AC-10, B-INC-001-AC-12
Tests: BTS-003, BTS-006, BTS-009
Security-Gates: SEC-GATE-009
Evidence: <replace with sanitized evidence reference>
```

#### KR-BINC-001-001 — Decide runtime and language versions

```text
docs(backend): decide runtime and language versions [KR-BINC-001-001]

Tasks: KR-BINC-001-001
Acceptance: B-INC-001-AC-01
Tests: BTS-001, BTS-036
Security-Gates: SEC-GATE-004, SEC-GATE-013
Evidence: <replace with sanitized decision and review reference>
```

#### KR-BINC-001-002 — Decide package manager and lockfile policy

```text
docs(backend): decide package manager and lockfile policy [KR-BINC-001-002]

Tasks: KR-BINC-001-002
Acceptance: B-INC-001-AC-01, B-INC-001-AC-02
Tests: BTS-001, BTS-036
Security-Gates: SEC-GATE-003, SEC-GATE-004, SEC-GATE-013
Evidence: <replace with sanitized decision and review reference>
```

#### KR-BINC-001-003 — Decide HTTP framework

```text
docs(backend): decide HTTP framework [KR-BINC-001-003]

Tasks: KR-BINC-001-003
Acceptance: B-INC-001-AC-03, B-INC-001-AC-06
Tests: BTS-004, BTS-007, BTS-032
Security-Gates: Not applicable
Evidence: <replace with sanitized decision and review reference>
```

#### KR-BINC-001-004 — Decide database migration tool

```text
docs(backend): decide database migration tool [KR-BINC-001-004]

Tasks: KR-BINC-001-004
Acceptance: B-INC-001-AC-13
Tests: BTS-011, BTS-012, BTS-013
Security-Gates: SEC-GATE-011
Evidence: <replace with sanitized decision and review reference>
```

#### KR-BINC-001-005 — Define secret-handling and configuration boundary

```text
docs(backend): define secret-handling and configuration boundary [KR-BINC-001-005]

Tasks: KR-BINC-001-005
Acceptance: B-INC-001-AC-04, B-INC-001-AC-12, B-INC-001-AC-14
Tests: BTS-002, BTS-003, BTS-009, BTS-010
Security-Gates: SEC-GATE-002, SEC-GATE-008, SEC-GATE-009
Evidence: <replace with sanitized policy and review reference>
```

#### KR-BINC-001-006 — Establish repository ignore rules

```text
chore(backend): establish repository ignore rules [KR-BINC-001-006]

Tasks: KR-BINC-001-006
Acceptance: B-INC-001-AC-14
Tests: BTS-010
Security-Gates: SEC-GATE-002
Evidence: <replace with sanitized diff and verification reference>
```

#### KR-BINC-001-007 — Provide safe configuration examples and fix DEVELOPMENT_SETUP placeholder

```text
docs(backend): provide safe configuration examples [KR-BINC-001-007]

Tasks: KR-BINC-001-007
Acceptance: B-INC-001-AC-05, B-INC-001-AC-15
Tests: BTS-003, BTS-010
Security-Gates: SEC-GATE-001, SEC-GATE-003, SEC-GATE-011
Evidence: <replace with sanitized diff and verification reference>
```

#### KR-BINC-001-008 — Select secret scanner

```text
docs(backend): select secret scanner [KR-BINC-001-008]

Tasks: KR-BINC-001-008
Acceptance: B-INC-001-AC-16
Tests: BTS-010
Security-Gates: SEC-GATE-004, SEC-GATE-010
Evidence: <replace with sanitized tool evaluation and decision reference>
```

#### KR-BINC-001-009 — Configure local secret scanning

```text
feat(backend): configure local secret scanning [KR-BINC-001-009]

Tasks: KR-BINC-001-009
Acceptance: B-INC-001-AC-16
Tests: BTS-010
Security-Gates: SEC-GATE-004, SEC-GATE-010
Evidence: <replace with sanitized positive and negative test evidence>
```

#### KR-BINC-001-010 — Add blocking CI secret scanning

```text
ci(backend): add blocking CI secret scanning [KR-BINC-001-010]

Tasks: KR-BINC-001-010
Acceptance: B-INC-001-AC-17
Tests: BTS-010
Security-Gates: SEC-GATE-005, SEC-GATE-010
Evidence: <replace with sanitized CI run and failure-blocking evidence>
```

#### KR-BINC-001-011 — Assess agreed Git history for secret exposure

```text
security(backend): assess agreed Git history for secret exposure [KR-BINC-001-011]

Tasks: KR-BINC-001-011
Acceptance: B-INC-001-AC-18
Tests: BTS-010
Security-Gates: SEC-GATE-006, SEC-GATE-007
Evidence: <replace with sanitized history-scan report and assessed scope>
```

#### KR-BINC-001-012 — Document secret-exposure response

```text
docs(backend): document secret-exposure response [KR-BINC-001-012]

Tasks: KR-BINC-001-012
Acceptance: B-INC-001-AC-18
Tests: BTS-010
Security-Gates: SEC-GATE-006, SEC-GATE-007
Evidence: <replace with sanitized procedure and review reference>
```

#### KR-BINC-001-013 — Test fail-fast configuration validation

```text
test(backend): verify fail-fast configuration validation [KR-BINC-001-013]

Tasks: KR-BINC-001-013
Acceptance: B-INC-001-AC-04, B-INC-001-AC-05
Tests: BTS-002, BTS-003, BTS-010
Security-Gates: SEC-GATE-003, SEC-GATE-008
Evidence: <replace with sanitized test results>
```

#### KR-BINC-001-014 — Test logging redaction

```text
test(backend): verify logging redaction [KR-BINC-001-014]

Tasks: KR-BINC-001-014
Acceptance: B-INC-001-AC-10, B-INC-001-AC-12
Tests: BTS-003, BTS-006, BTS-009
Security-Gates: SEC-GATE-009
Evidence: <replace with sanitized redaction test results>
```

#### KR-BINC-001-015 — Verify scanner exceptions and failure behavior

```text
test(backend): verify scanner exceptions and failure behavior [KR-BINC-001-015]

Tasks: KR-BINC-001-015
Acceptance: B-INC-001-AC-16, B-INC-001-AC-17
Tests: BTS-010
Security-Gates: SEC-GATE-004, SEC-GATE-005, SEC-GATE-010
Evidence: <replace with sanitized exception and failure-path test results>
```

#### KR-BINC-001-016 — Update security and setup documentation

```text
docs(backend): update security and setup documentation [KR-BINC-001-016]

Tasks: KR-BINC-001-016
Acceptance: B-INC-001-AC-14, B-INC-001-AC-19
Tests: BTS-001, BTS-010, BTS-036
Security-Gates: SEC-GATE-002, SEC-GATE-003
Evidence: <replace with sanitized documentation review and checker results>
```

#### KR-BINC-001-017 — Verify clean-checkout workflow and retain evidence

```text
test(backend): verify clean-checkout workflow [KR-BINC-001-017]

Tasks: KR-BINC-001-017
Acceptance: B-INC-001-AC-02, B-INC-001-AC-19, B-INC-001-AC-20
Tests: BTS-001, BTS-032, BTS-035, BTS-036
Security-Gates: SEC-GATE-003, SEC-GATE-012, SEC-GATE-013
Evidence: <replace with sanitized clean-checkout, test, and audit evidence>
```

#### KR-BINC-001-018 — Adopt source header standard and CI check

```text
ci(repo): adopt source header standard and CI check [KR-BINC-001-018]

Tasks: KR-BINC-001-018
Acceptance: B-INC-001-AC-21
Tests: BTS-037
Security-Gates: Not applicable
Evidence: <replace with sanitized evidence reference>
```

#### KR-BINC-001-019 — Add repository Makefile for local validation

```text
ci(backend): add repository Makefile for local validation [KR-BINC-001-019]

Tasks: KR-BINC-001-019
Acceptance: B-INC-001-AC-19
Tests: BTS-001, BTS-036
Security-Gates: SEC-GATE-003
Evidence: <replace with sanitized evidence reference>
```

### 9.4 Commit execution requirements

Before creating each task commit:

1. Confirm the working tree contains only the intended task's changes.
2. Run the applicable tests and checks defined by the linked acceptance criteria and test IDs.
3. Verify the linked security gates and record evidence. If a required check cannot be run, state that limitation explicitly and do not mark the task accepted.
4. Inspect the staged diff for credentials, private keys, tokens, real configuration secrets, and sensitive evidence.
5. Replace the evidence placeholder with an actual sanitized evidence reference.
6. Commit only the task's atomic changes.

Do not commit real secret or key material. A scanner exception must not be used to conceal a genuine finding. If secret exposure is detected, stop and follow the documented exposure-response process.

### 9.5 Closing commit

Create the closing commit only after all 29 tasks have been reviewed against their linked acceptance criteria, applicable tests, and security gates. Do not close the increment merely because all task commits exist.

Closing commit subject:

```text
increment(b-inc-001-secure-foundation): close B-INC-001 — Secure Foundation
```

Closing commit body:

```text
Tasks accepted:
- KR-BE-1-001 through KR-BE-1-009
- KR-BE-1-041
- KR-BINC-001-001 through KR-BINC-001-019

Acceptance:
- B-INC-001-AC-01 through B-INC-001-AC-21 reviewed against the saved acceptance criteria.
- Record the actual acceptance result and evidence reference below.

Review:
- Record the completed review checklist and security-review evidence.
- Record the applicable test-plan results and any approved, explicitly documented limitations.
- Confirm required security gates are satisfied; unresolved mandatory gates block closure.

Tracking:
- Update the increment changelog and task status.
- Record the closing commit hash and closure evidence.
- Confirm the backend implementation plan and parent milestone tracking are consistent.

Evidence: <replace with sanitized closure evidence reference>
```

Before closure, verify that every task is either accepted with evidence or remains explicitly open. Do not describe an incomplete task as accepted. If a mandatory acceptance criterion or security gate remains unsatisfied, defer the closing commit.

### 9.6 Annotated closure tag

After the closing commit has been reviewed and accepted, create the annotated tag:

```bash
git tag -a b-inc-001-secure-foundation-closed \
  -m "B-INC-001-SECURE-FOUNDATION closed"
```

Verify the tag points to the intended closing commit:

```bash
git show --no-patch --decorate b-inc-001-secure-foundation-closed
git rev-parse b-inc-001-secure-foundation-closed^{}
git rev-parse HEAD
```

The peeled tag commit and `HEAD` must match when the tag is created from the current closing commit. Push the branch and tag only under the repository's agreed review and release procedure.

The branch, closing commit, and tag establish increment-level traceability; they do not replace the official parent milestone's acceptance or closure requirements.
