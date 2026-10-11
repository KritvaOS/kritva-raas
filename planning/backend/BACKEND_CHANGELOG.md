# Backend Planning Changelog

## Document Control

| Field | Value |
|---|---|
| Document | Backend Planning Changelog |
| Path | `planning/backend/BACKEND_CHANGELOG.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION; C-M02 DEVELOPMENT |

## 1. Purpose

This changelog records changes to the backend planning baseline, including planning documents, task mappings, implementation sequencing, security gates, acceptance criteria, resource assumptions, and approved decisions that affect backend delivery.

It is a planning-history record, not an implementation changelog. It does not establish that code has been implemented, tests have passed, security controls have been deployed, or a milestone has been accepted.

## 2. Change-Control Rules

1. Record each accepted planning-baseline change as a distinct entry.
2. Identify the change, reason, affected documents, source decisions, and owner role.
3. Preserve canonical phase and milestone names.
4. Preserve existing task IDs unless a formally approved change authorizes otherwise.
5. Record new task namespaces and verify repository-wide uniqueness.
6. Distinguish source decisions from recommendations and unresolved decisions.
7. Do not claim a repository file was changed unless its actual change has been verified.
8. Do not claim a test, scanner, or documentation checker passed unless its execution result has been inspected.
9. Changes affecting an established milestone, public contract, database schema, security invariant, or ownership boundary require review by the relevant owner.
10. A Proposed entry documents a candidate baseline; it does not by itself authorize implementation or spending.

## 3. Planning Baseline Entry

### PB-001 — Backend Planning Structure and B-INC-001 Preparation

| Field | Value |
|---|---|
| Change ID | PB-001 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Scope | Backend planning document set and preparation for B-INC-001 SECURE FOUNDATION |
| Reason | Establish a traceable implementation plan, measurable acceptance gates, explicit dependency ownership, role-based effort planning, and repository security controls before controlled backend implementation |
| Approval status | Proposed; review and freeze decision pending |
| Implementation status | Not established by this planning entry |

### 3.1 Files in the Planning Baseline

The proposed program-level document set comprises the following ten files:

1. `planning/backend/README.md`
2. `planning/backend/BACKEND_IMPLEMENTATION_PLAN.md`
3. `planning/backend/BACKEND_TASK_REGISTER.md`
4. `planning/backend/BACKEND_DEPENDENCY_MAP.md`
5. `planning/backend/BACKEND_SECURITY_GATE.md`
6. `planning/backend/BACKEND_TEST_STRATEGY.md`
7. `planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md`
8. `planning/backend/BACKEND_RISK_REGISTER.md`
9. `planning/backend/BACKEND_RESOURCE_PLAN.md`
10. `planning/backend/BACKEND_CHANGELOG.md`

These documents define the planning authority, implementation sequence, task mapping, dependency model, security gates, test strategy, acceptance criteria, backend-specific risks, and resource-planning approach.

The separate B-INC-001 SECURE FOUNDATION dossier is to be prepared and reviewed as a subsequent planning unit. Its acceptance is not implied by this entry.

### 3.2 Source Documents and Decisions

The baseline uses the following authoritative sources and supplied decisions.

| Source or decision | Baseline treatment |
|---|---|
| `planning/PHASES.md` | Preserve the canonical P0 FOUNDATION through P8 PRODUCTION phase model |
| Existing B-M01 CONTROL PLANE milestone dossier | Preserve existing milestone scope and task IDs |
| Existing DB-M01 FOUNDATION milestone dossier | Preserve database milestone ownership and coordinate migration, persistence, and tenant-isolation requirements |
| Existing C-M01 FOUNDATION scope | Preserve cloud ownership of infrastructure, IAM, and secret-management integration |
| `docs/backend/architecture/BACKEND_ARCHITECTURE.md` | Use as the backend architecture authority |
| `docs/protocol/API_CONTRACT.md` | Use as the API contract authority |
| `docs/architecture/CODING_AGENT_INTEGRATION.md` | Preserve the coding-agent integration boundary and unresolved decision gates |
| `docs/security/SECRETS_MANAGEMENT.md` | Preserve secret-handling requirements |
| `docs/security/KEY_MANAGEMENT.md` | Preserve key-management requirements |
| `docs/development/TESTING_STRATEGY.md` | Align test planning with established project testing guidance |
| `planning/RESOURCE_PLAN.md`, Section 23.2 | Keep staffing, hiring, cost, time-phased allocation, and approval commitments TBD until their designated owners approve the records |
| `docs/tracking/RISK_REGISTER.md` | Use the existing program risk IDs and ownership; create backend-specific risks only for distinct backend implementation exposure |
| Existing B-M01 `TASKS.md` | Reuse existing task IDs and estimates; do not create replacement IDs for established tasks |

### 3.3 Frozen Planning Decisions

The following decisions and constraints form the proposed baseline:

1. Canonical phase labels must use the `PN NAME` form defined by `planning/PHASES.md`.
2. Official milestone names remain unchanged.
3. Implementation increments are planning and execution units, not new official milestones or phases.
4. The primary product path is not a phase, milestone, or stage.
5. Existing B-M01 task IDs remain authoritative for their established work.
6. New B-INC-001 tasks use the `KR-BINC-001-nnn` namespace and must be checked for repository-wide uniqueness.
7. The established backend stack is TypeScript/Node.js, PostgreSQL, and REST API v1.
8. Exact runtime and language versions, package manager, HTTP framework, migration tool, and secret scanner remain open decisions for B-INC-001 review.
9. Backend implementation must preserve database, cloud, frontend, and coding-agent ownership boundaries.
10. Acceptance requires testable criteria and retained evidence; code existence or a commit alone is insufficient.
11. No real secrets or security-key material may be stored in the repository.
12. Security scanning must progress from the supplied manual baseline to demonstrated automated and blocking CI enforcement.
13. Resource estimates must distinguish existing task estimates, newly introduced tasks, and shared verification effort.
14. No FTE, cost, hiring date, delivery date, or other commitment is approved by this planning baseline.

### 3.4 Security Baseline and DEVELOPMENT_SETUP Placeholder Remediation

The security planning baseline records the repository scan reported at commit `2c51027`.

The supplied report states that the working tree and the available seven-commit Git history were scanned using detect-secrets and a regex sweep for private keys, cloud keys, tokens, and credential-bearing URLs. No private keys, certificates, tokens, or API keys were reported. The reported finding was a local-development database URL example in:

`docs/development/DEVELOPMENT_SETUP.md`

The reported example contained a username and password in a PostgreSQL URL. The required correction is to replace that credential-bearing example with an unmistakable, nonfunctional placeholder and document how developers supply their own local database credentials without committing them.

**Remediation acceptance requirement:** inspect the actual file diff, confirm that the replacement is nonfunctional and unambiguous, and retain the results of the required working-tree and history rescan. If investigation establishes that the original value was a real or reused credential, the Security Owner must assess exposure and require revocation or rotation where appropriate.

The baseline also records that `.gitignore` and a CI workflow were absent at the reported scan baseline. Therefore, the reported scan is manual evidence only; it is not proof of automated or blocking CI enforcement.

This entry records the required correction and its acceptance condition. It does not, by itself, establish that the source-file edit or rescan has been completed.

### 3.5 Task Mapping and Indicative Effort

The planning baseline maps existing B-M01 tasks to four proposed implementation increments:

- B-INC-001 SECURE FOUNDATION.
- B-INC-002 IDENTITY-ORGANIZATION.
- B-INC-003 PROJECTS-PLATFORM-CATALOG.
- B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY.

The existing direct implementation estimates are retained as indicative engineering-day sums. Shared test, review, documentation, and acceptance estimates remain separately visible to avoid double-counting.

New B-INC-001 security and foundation tasks remain unestimated until task refinement. Their effort must not be treated as zero.

### 3.6 Risk Management

The proposed backend risk register uses `R-BE-nnn` identifiers to avoid collisions with program-level risk IDs.

Program risks remain owned by `docs/tracking/RISK_REGISTER.md`. The backend register references applicable program risks, including secret exposure, tenant isolation, authentication, architecture boundaries, schedule dependencies, resource availability, and test quality, without creating competing records for the same risk.

Each backend-specific risk must have a canonical phase, owner role, likelihood, impact, mitigation, trigger, and linked acceptance or test gate.

### 3.7 Resource Commitments

The baseline follows Section 23.2 of `planning/RESOURCE_PLAN.md`.

The following commitments remain TBD until recorded and approved by their designated owners:

- Time-phased role allocation.
- Named accountable owners.
- Hiring dates and hiring gates.
- Salary and contractor cost assumptions.
- Infrastructure and laboratory costs.
- Monthly budget forecast.
- Dependency reconciliation.
- Leadership and Finance approval.

The indicative task estimates are not a committed schedule, staffing allocation, or budget.

### 3.8 Acceptance and Review Gates

The baseline introduces measurable security, test, and backend acceptance criteria with stable IDs.

Each criterion must define:

- A pass/fail condition.
- Evidence to retain.
- The increment or milestone it blocks.

A criterion that is not run, is blocked, fails, or lacks evidence cannot be reported as passed. Mandatory security and tenant-isolation failures block acceptance regardless of schedule pressure.

### 3.9 Files and Decisions Requiring Follow-Up

The following work remains for subsequent review or implementation:

1. Prepare and review the complete B-INC-001 SECURE FOUNDATION dossier.
2. Confirm that the DEVELOPMENT_SETUP placeholder correction exists in the actual repository and that the required rescan evidence is retained.
3. Decide and record the open technology choices.
4. Implement repository ignore rules and safe configuration examples.
5. Select and configure the secret scanner.
6. Implement and demonstrate blocking CI enforcement.
7. Refine the new B-INC-001 task estimates and role allocation.
8. Review the dependency map with the database, cloud, security, and repository/CI owner roles.
9. Reconcile the backend acceptance criteria with the authoritative B-M01 CONTROL PLANE and DB-M01 FOUNDATION dossiers.
10. Freeze B-INC-001 only after its required scope, decisions, dependencies, and acceptance evidence are reviewed.

### 3.10 Review Outcome

The baseline remains Proposed until the relevant owners have reviewed it.

No official milestone scope has been changed by this entry. No technology decision is considered approved solely because an option is recommended. No implementation, security scan, CI enforcement, or acceptance result is claimed without corresponding evidence.

## 3A. PB-002 — B-INC-001 Dossier and Traceability Correction

| Field | Value |
|---|---|
| Change ID | PB-002 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Reason | Add the B-INC-001 SECURE FOUNDATION dossier and correct cross-document traceability found in the documentation review |

Affected files: the eight files in `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/` (MILESTONE, TASKS, ACCEPTANCE_CRITERIA, REVIEW_CHECKLIST, TEST_PLAN, SECURITY_REVIEW, CHANGELOG, GIT_COMMIT_STEP).

Traceability correction: the first draft of the increment dossier cited `BAC-*`, `BTS-*` and `SEC-GATE-*` IDs by number without matching their definitions. For example, AC-04 configuration validation cited request-context tests, and AC-16 local secret scanning cited the platform-catalog contract test. The review corrected the traces as follows:

1. `ACCEPTANCE_CRITERIA.md` is the single source for each increment criterion's `BAC-*`, `BTS-*` and `SEC-GATE-*` trace, and every trace was re-matched to the definition in `BACKEND_ACCEPTANCE_CRITERIA.md`, `BACKEND_TEST_STRATEGY.md` or `BACKEND_SECURITY_GATE.md`.
2. In `TASKS.md`, each task's linked tests and security gates are derived from its linked acceptance criteria.
3. The `TEST_PLAN.md` test matrix and the `SECURITY_REVIEW.md` threat traces were regenerated from `ACCEPTANCE_CRITERIA.md`.

Validation: the documentation checker reports 0 errors. The new ID namespaces (`KR-BINC-001-*`, `R-BE-*`, `BAC-*`, `BTS-*`, `SEC-GATE-*`, `B-INC-001-*`) do not occur outside `planning/backend/`.

## 3B. PB-003 — B-INC-002 to B-INC-004 Dossiers and Commit Text

| Field | Value |
|---|---|
| Change ID | PB-003 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Reason | Close the external-audit finding that B-INC-002 to B-INC-004 had no dossiers and no per-task Git commit text |

Changes:

1. Added the eight-file dossiers for B-INC-002 IDENTITY-ORGANIZATION (18 acceptance criteria, 14 tasks), B-INC-003 PROJECTS-PLATFORM-CATALOG (17, 13) and B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY (16, 13).
2. Every task in all four increments now has ready-to-use commit text in the per-task commit section of each increment's `GIT_COMMIT_STEP.md` (Section 9 in B-INC-001 and B-INC-002; Section 6 in B-INC-003 and B-INC-004, whose Section 9 holds the branch, closing commit and tag), with an increment branch, closing commit and annotated tag matching `BACKEND_IMPLEMENTATION_PLAN.md` Section 20.
3. Updated `README.md` Section 4, `BACKEND_TASK_REGISTER.md` Sections 4 and 5 and `BACKEND_IMPLEMENTATION_PLAN.md` Sections 5.1 and 7 to 9 to point to the dossiers instead of describing them as deferred.

Validation, with the same checks applied to all four dossiers:

- Every acceptance-criteria trace uses only defined `BAC-*`, `BTS-*` and `SEC-GATE-*` IDs, reviewed for meaning.
- Each task's linked tests and gates equal the union of its linked criteria's traces.
- Each commit message's trailers equal `TASKS.md`.
- Each `TEST_PLAN.md` matrix row equals its criterion's trace.
- The documentation checker reports 0 errors.

Corrections made during validation:

- B-INC-002: three task test lists and two commit trailers were aligned to their criteria, and the `TEST_PLAN.md` AC-02 row was corrected.
- B-INC-003: `TASKS.md` and `ACCEPTANCE_CRITERIA.md` were reformatted to the common entry format.
- B-INC-004: a milestone name was corrected to `B-M01 CONTROL PLANE`.
- B-INC-001: a commit example's trailer was corrected.

Shared tasks `KR-BE-1-043` to `KR-BE-1-045` keep whole-task estimates; increments commit scoped slices. `KR-CA-022` to `KR-CA-026` remain deferred.

## 3C. PB-004 — External Repository Audit Reconciliation (RAAS-AUD-01 to RAAS-AUD-06)

| Field | Value |
|---|---|
| Change ID | PB-004 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Audited revision | `6eb8ef6` on main |
| Reason | Reconcile the external audit findings on the backend planning baseline |

| Finding | Disposition | Validation type |
|---|---|---|
| RAAS-AUD-01 | `BACKEND_IMPLEMENTATION_PLAN.md` Section 19 rewritten to state the current dossier status and the ordered next actions. | Planning |
| RAAS-AUD-02 | Remains open, as expected. B-INC-004 acceptance records stay TBD and security findings stay not assessed until implementation evidence and a security-review decision exist. No dossier claims implementation. | Implementation (not started) |
| RAAS-AUD-03 | Dates added to PB-002 and PB-003. This entry separates planning validation from implementation validation. B-INC-004 part B (TEST_PLAN, SECURITY_REVIEW, CHANGELOG, GIT_COMMIT_STEP) was saved and validated under PB-003, with 16 test-plan rows matching the criteria and 13 commit messages matching `TASKS.md`. | Planning |
| RAAS-AUD-04 | `KR-BE-1-047` is owned only by B-INC-004. The B-INC-001 migration prerequisite is `KR-BINC-001-004` with `B-INC-001-AC-13`. The task register and the B-INC-004 task entry state this. | Planning |
| RAAS-AUD-05 | Added `.github/workflows/docs-check.yml`, which runs `scripts/docs/check_docs.py` and `scripts/docs/check_backend_traceability.py` on every push and pull request and fails on any error. This is documentation CI only; the blocking secret-scan CI check remains task `KR-BINC-001-010` in B-INC-001. A successful run must be linked here after the next push. | CI wiring added; run evidence pending |
| RAAS-AUD-06 | The root `README.md` now links the documentation entry point, the backend planning index, the phase model and the checker command. | Planning |

Also corrected: references to "Section 9" for per-task commit text now name the right section in each dossier (Section 9 in B-INC-001 and B-INC-002; Section 6 in B-INC-003 and B-INC-004).

Validation evidence for this entry, recorded against base revision `6eb8ef6` plus the PB-004 working-tree changes:

| Command | Result |
|---|---|
| `python3 scripts/docs/check_docs.py` | 367 docs checked, 0 problems (exit 0) |
| `python3 scripts/docs/check_backend_traceability.py` | 4 dossiers checked, 0 problems (exit 0): B-INC-001 has 20 criteria, 27 tasks, 27 commit messages and 20 test-plan rows; B-INC-002 has 18, 14, 14 and 18; B-INC-003 has 17, 13, 13 and 17; B-INC-004 has 16, 13, 13 and 16 |

The traceability checker was confirmed to fail on a deliberately altered commit trailer. After push, replace the base revision with the pushed commit and link the CI run.

Planning validation confirms documentation consistency only. It is not implementation, test or security acceptance evidence.

## 3D. PB-005 — Re-audit Closure and Source Header Standard

| Field | Value |
|---|---|
| Change ID | PB-005 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Audited revision | `00c494a` on main |

Re-audit outcome (external review of `00c494a`):

| Finding | Status | Evidence |
|---|---|---|
| RAAS-AUD-01 | Closed (planning) | Section 19 of `BACKEND_IMPLEMENTATION_PLAN.md` |
| RAAS-AUD-02 | Open by design | Awaits implementation evidence and a security-review decision |
| RAAS-AUD-03 | Closed (planning) | PB-002 to PB-004 dated and validation types separated |
| RAAS-AUD-04 | Closed (traceability) | `KR-BE-1-047` owned only by B-INC-004 |
| RAAS-AUD-05 | Closed (CI wiring and run verified) | `docs-check` Actions run 38048607956 on `00c494a`: both checker steps succeeded |
| RAAS-AUD-06 | Closed (documentation navigation) | Root `README.md` |

Source header standard (aligned with kritva-core):

1. Added `docs/development/SOURCE_HEADER_STANDARD.md`. It keeps the Kritva Core header fields and rule IDs, uses `SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary` (owner decision: RaaS is proprietary), and defines the Component and Layer vocabularies, the Requirements and API conventions, the scope and the exemptions.
2. Ported `scripts/lint/check_source_headers.py` from kritva-core. Additions:
   - the TypeScript/JavaScript, Rust and SQL (`--`) sources are in scope;
   - build output directories and `*.min.js` are excluded (handwritten `*.d.ts` files are in scope);
   - HEADER-005 checks that the File field matches the file;
   - HEADER-007 checks the Component and Layer vocabularies;
   - Created dates must be real calendar dates.
3. Added `tests/source_header_check/test_check_source_headers.py` with 13 tests (including a non-zero CLI exit on an invalid file), the `Source Header Check` workflow (`.github/workflows/source-header-check.yml`, same command as Kritva Core), and `.githooks/pre-commit`.
4. Added standard headers to every in-scope tracked file: the four `scripts/docs/*.py` scripts and `.github/workflows/docs-check.yml`.
5. Planning: new task `KR-BINC-001-018`, criterion `B-INC-001-AC-21`, canonical test `BTS-037` and backend acceptance criterion `BAC-039` (source header compliance and enforcement, added on external-review advice), with a test-plan row, an acceptance-record row, commit text, and task-register and resource-plan rows. B-INC-001 now has 21 criteria and 28 tasks.

Local validation on the working tree:

| Command | Result |
|---|---|
| `python3 scripts/lint/check_source_headers.py --mode tracked --strict` | 8 source/config files checked, PASSED |
| `python3 -m unittest discover -s tests/source_header_check` | 13 tests, OK |
| `python3 scripts/docs/check_docs.py` | 0 problems |
| `python3 scripts/docs/check_backend_traceability.py` | 4 dossiers, 0 problems |

`B-INC-001-AC-21` is accepted only after a green `Source Header Check` run on the pushed revision.

## 3E. PB-006 — Source Header Review Corrections (review of `8b51577`)

| Field | Value |
|---|---|
| Change ID | PB-006 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Reviewed revision | `8b51577` on main; both workflows green (Source Header Check run 38050714894, docs-check run 38050714885) |

| Review finding | Disposition |
|---|---|
| P1: HEADER-001 and HEADER-003 used substring matching | The checker parses header lines and compares the SPDX identifier and copyright line exactly. Duplicates are rejected. Tests cover a suffixed SPDX value, a duplicate SPDX line and an extended copyright line. |
| P1: Author rule documented but not enforced | HEADER-007 now requires `Author : KritvaOS`, with a test. The standard separates checker-enforced rules from review-checked conventions. |
| P2: `tests/source_header_check/` wholly exempt | The exemption is narrowed to `tests/source_header_check/fixtures/`, so the test module is checked (test added). |
| P2: merge-blocking not proven | The standard now says CI blocks merges only once both checks are required status checks in `main` branch protection. Repository-owner action: configure and verify branch protection. |
| PB-005 said `*.d.ts` was excluded | Corrected above. |
| `BAC-038` range references | `TEST_PLAN.md` and the B-INC-001 changelog now cite `BAC-001` to `BAC-039`. |
| Unused `--strict` | Defined: without it the checker is report-only (exit 0); with it, exit 1. CI and the hook use `--strict`. Tested. |
| Blank lines before the header | Rejected (HEADER-008): the header must start on line 1, or line 2 after a shebang. Tested. |
| `KR-BINC-001-018` commit trace | Exception recorded below. |

Commit-trace exception for KR-BINC-001-018: the initial implementation was pushed as `44cb244` ("Git flow activation") and `8b51577` ("git flow update"), not as the planned `ci(repo): adopt source header standard and CI check [KR-BINC-001-018]`. Shared history is not rewritten. The exception is recorded here, and those two commits are the KR-BINC-001-018 implementation commits. Follow-up commits use the prescribed format, for example `fix(backend): enforce exact source header values [KR-BINC-001-018]`.

Validation on the working tree: 19 checker unit tests OK; strict tracked-file check PASSED; `check_docs.py` and `check_backend_traceability.py` report 0 problems.

Acceptance evidence for `B-INC-001-AC-21` and `BAC-039`, recorded against `350b6b754b78f47592059fe498dfa8692b43c822`:

| Evidence | Status | Reference |
|---|---|---|
| Source Header Check green on `350b6b7` | Verified. Steps "Test source header checker" and "Check source headers" both succeeded. | Run [38051684790](https://github.com/KritvaOS/kritva-raas/actions/runs/38051684790) |
| docs-check green on `350b6b7` | Verified. Steps "Run documentation checker" and "Run backend traceability checker" both succeeded. | Run [38051684651](https://github.com/KritvaOS/kritva-raas/actions/runs/38051684651) |
| Controlled failing run on a disposable branch | Verified. Branch `ci/negative-header-test` at `24544e039ceaaec6423286d029d1ef9fd4514865` added only `scripts/lint/negative_header_probe.py`, which has no header. Setup, checkout and "Test source header checker" succeeded. "Check source headers" failed with `scripts/lint/negative_header_probe.py: [HEADER-008] missing or malformed leading header block` (exit code 1). docs-check on the same commit passed (run 38052485993). The branch was then deleted, so the probe never reached `main`. | Run [38052486010](https://github.com/KritvaOS/kritva-raas/actions/runs/38052486010), job [114214231084](https://github.com/KritvaOS/kritva-raas/actions/runs/38052486010/job/114214231084) |
| Both checks required for `main` | Verified. Repository ruleset `main-protectionain` (ID 24843399) is active on the default branch. It applies four rules: required status checks `source-header-check` and `docs-check`; pull request required before merging (0 required approvals, merge, squash and rebase allowed); restricted deletion; and blocked force pushes (`non_fast_forward`). It has no bypass actors. Strict up-to-date checking is off, and the checks are not pinned to the GitHub Actions integration; both remain optional hardening. The ruleset was confirmed through `GET /repos/KritvaOS/kritva-raas/rules/branches/main` and the owner's ruleset export. | Ruleset 24843399, verified on 2026-10-10 against `main` at `066a2ae` |

`main` at `846840f` is also green (Source Header Check run 38052473705, docs-check run 38052473699).

All four evidence items are now verified. `KR-BINC-001-018`, `B-INC-001-AC-21` and `BAC-039` are ready for the owner's acceptance decision. Because the ruleset requires a pull request and has no bypass actors, every change to `main`, including this entry, goes through a pull request whose required checks must pass.

## 3F. PB-007 — KR-BINC-001-018 Accepted

| Field | Value |
|---|---|
| Change ID | PB-007 |
| Date | 2026-10-10 |
| Status | Accepted |
| Owner role | Repository owner |
| Accepted revision | `3a0d7e5` on main (merge of PR #1) |

The repository owner accepted `KR-BINC-001-018`, `B-INC-001-AC-21` and `BAC-039`, on the external reviewer's recommendation, after the evidence PR passed through the new merge gate.

| Evidence | Reference |
|---|---|
| Evidence PR passed the gate | PR [#1](https://github.com/KritvaOS/kritva-raas/pull/1): Source Header Check run 38062983863 and docs-check run 38062983880 passed on the pull request; merged as `3a0d7e5` |
| `main` green after merge | Source Header Check run [38063027471](https://github.com/KritvaOS/kritva-raas/actions/runs/38063027471); docs-check run [38063027587](https://github.com/KritvaOS/kritva-raas/actions/runs/38063027587) |
| Negative path | Run [38052486010](https://github.com/KritvaOS/kritva-raas/actions/runs/38052486010): HEADER-008, exit 1 |
| Merge gate | Ruleset 24843399: pull request required, `source-header-check` and `docs-check` required, deletion and force pushes blocked, no bypass |

Follow-ups, outside acceptance scope:
- enable strict up-to-date status checks;
- pin both required checks to the GitHub Actions integration;
- optionally correct the ruleset name `main-protectionain`.

The other B-INC-001 tasks and acceptance criteria are unaffected and remain open.

## 3G. PB-008 — KR-BINC-001-019 Repository Makefile

| Field | Value |
|---|---|
| Change ID | PB-008 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Repository/CI Owner |
| Base revision | `32321fa` on main |

The new task `KR-BINC-001-019`, "Add repository Makefile for local validation", follows the external design review.

- **Design:** modelled on the kritva-core `Makefile`: standard header, `.DEFAULT_GOAL := help` with self-documenting help, `[tag]` output, and `make check` as the pre-PR command. CMake, coverage and install targets are omitted because RaaS has no application code and its toolchain is undecided.
- **`make check`:** runs `header-test`, `header-check`, `docs-check` and `traceability-check`, exactly the commands of the two required CI workflows.
- **CI workflows:** unchanged, so the required status-check contexts `source-header-check` and `docs-check` stay the same.
- **Application targets:** `build`, `test`, `lint`, `format` and `format-check` exit non-zero with "Not configured: pending toolchain decisions KR-BINC-001-001 to KR-BINC-001-004" and are not part of `make check`. Unlike Core's TODO placeholders, which exit 0, these cannot report checks that never ran.
- **Header enforcement:** `Makefile` is now classified as source by exact file name and enforced by the header checker, with a test. `Dockerfile` stays out of scope until a naming policy is defined.
- **Trace:** `B-INC-001-AC-19` (`BAC-037`; `BTS-001`, `BTS-036`; `SEC-GATE-003` from the AC's gate trace). No new AC.
- **Local validation:**
  - `make check` passed: 20 header unit tests, the header check over 10 files, `check_docs.py` 0 problems and traceability 0 problems.
  - With a failing tool (`make check PYTHON=false`), it exited non-zero without printing the success summary.
  - `make test` exited non-zero as designed.

## 3H. PB-009 — KR-BINC-001-019 Accepted

| Field | Value |
|---|---|
| Change ID | PB-009 |
| Date | 2026-10-10 |
| Status | Accepted |
| Owner role | Repository owner |
| Accepted revision | `3c96924` on main (merge of PR #3) |

The repository owner accepted `KR-BINC-001-019`, "Add repository Makefile for local validation".

| Evidence | Reference |
|---|---|
| Local validation | Owner ran `make check` on branch `ci/repository-makefile`: 20 header unit tests OK; header check of 10 files PASSED; documentation check 0 problems; traceability check 0 problems |
| Pull request through the merge gate | PR [#3](https://github.com/KritvaOS/kritva-raas/pull/3): Source Header Check run 38064045393 and docs-check run 38064045435 passed |
| `main` green after merge | Source Header Check run [38064087028](https://github.com/KritvaOS/kritva-raas/actions/runs/38064087028); docs-check run [38064087036](https://github.com/KritvaOS/kritva-raas/actions/runs/38064087036) |
| Merged content | Identical to the reviewed commits `docs(backend): plan repository Makefile task [KR-BINC-001-019]` and `ci(backend): add repository Makefile for local validation [KR-BINC-001-019]` |

`B-INC-001-AC-19` (documentation and workflow match actual behavior) stays open: this task contributes to it, but other B-INC-001 tasks are also linked to it.

## 3I. PB-010 — B-INC-001 Batch A Plan and Readiness Record

| Field | Value |
|---|---|
| Change ID | PB-010 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |

Reason: the next B-INC-001 work is the decision and security-policy batch (`KR-BINC-001-005`, `KR-BINC-001-001`, `KR-BINC-001-002`, `KR-BINC-001-008`). The sequencing and the record location were agreed with the external reviewer before any commit. The canonical records are `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/IMPLEMENTATION_READINESS.md` and PR #5 (merge `914e555`).

| Item | Result |
|---|---|
| Order | 005, then 001, then 002 (needs 001 approved), then 008 (needs a real scanner evaluation and synthetic detection). 008 is held out of the first series until a comparative evaluation is done |
| Commits | One atomic commit per task, using the existing `GIT_COMMIT_STEP.md` text; no combined commit or combined approval |
| Record location | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/`, one record per task, plus `IMPLEMENTATION_READINESS.md` |
| Readiness decision | Blocked for stack-dependent implementation until `KR-BINC-001-001` and `KR-BINC-001-002` are approved; `KR-BE-1-001` stays blocked |
| Deferred to Batch B | `KR-BINC-001-003` (HTTP framework) and `KR-BINC-001-004` (migration tool) |
| SYS-ADR-004 | Recorded as a prerequisite for B-INC-002 only; B-INC-001 does not close it |
| Trace review | The four task traces equal the union of their linked acceptance criteria in `increments/B-INC-001-SECURE-FOUNDATION/TASKS.md` and `ACCEPTANCE_CRITERIA.md`; the commit trailers in PR #5 (merge `914e555`) match |

No task status changes in this entry. A decision record committed as Proposed is not an approval.

## 3J. PB-011 — PR #5 Follow-Up

| Field | Value |
|---|---|
| Change ID | PB-011 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PR #5 (merge `914e555`) |

Reason: an independent external audit of the merged PR #5 found its scope, trailers, task statuses and readiness decision correct and recommended no revert. It listed five documentation and governance follow-ups. This change addresses them.

| Item | Priority | Disposition |
|---|---|---|
| Make the Batch B order explicit | P1 | Done: `decisions/IMPLEMENTATION_READINESS.md` Section 4 is a dependency-ordered table (approvals, `KR-BE-1-001`, `KR-BE-1-002`, `KR-BINC-001-003`, `KR-BINC-001-004`, `KR-BINC-001-008`) |
| Replace "Commit: Pending" and fix the "Next: 008" wording | P1 | Done: the four merged entries in the increment changelog cite `c815f5b`, `d82d0d6`, `681abf0` and `2341ffd`, merged in PR #5, with the required-check run IDs. `KR-BINC-001-008` is stated as on hold |
| Remove chat references from PB-010 | P2 | Done: PB-010 now points to the readiness record and PR #5 |
| Define a planning-only commit form | P2 | Done: `GIT_COMMIT_STEP.md` Section 4.1. The historical commit is not rewritten |
| Review the `Claude-Session` trailer | P2 | Open: owner decision. The trailer is an opaque session URL in public history and is not a secret value. Until the owner decides, the existing attribution convention continues |

Evidence for PR #5: Source Header Check run 38068101282 and docs-check run 38068101275 on head `2341ffd`; Source Header Check run 38068170548 and docs-check run 38068170376 on `main` after the merge. The PR description was empty, so this entry and the increment changelog are the tracking record.

No task status changes in this entry. `KR-BINC-001-001`, `KR-BINC-001-002` and `KR-BINC-001-005` stay In Review, and `KR-BINC-001-008` stays on hold.

## 3K. PB-012 — Backend Decision-Approval Packages

| Field | Value |
|---|---|
| Change ID | PB-012 |
| Date | 2026-10-10 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PR #6 (merge `8bc4558`) |

Reason: three B-INC-001 decision records wait for owner approval, and later increments will need the same workflow. This change adds one shared, validated place for the review requests, after alignment with the external reviewer on location, naming, source of truth and vocabulary.

| Item | Disposition |
|---|---|
| Shared location | `planning/backend/decisions/` with `README.md` and `approvals/`. Decision records stay in their increment `decisions/` directories |
| Packages | Draft packages for `KR-BINC-001-001`, `KR-BINC-001-002` and `KR-BINC-001-005`, named `APPROVAL-<DECISION-ID>-<slug>.md` |
| Source of truth | The decision record Approval Record table is the only place for the final disposition. A package links to it and never records an outcome |
| Vocabularies | Package workflow: Draft, Requested, Closed, Withdrawn. Decision disposition: Proposed, Approved, Rejected, Returned for revision, Superseded. Task statuses are unchanged |
| Validation | `scripts/docs/check_backend_approvals.py` with unit tests in `tests/backend_approvals/`, run by `make check` and the `docs-check` workflow. The existing checkers are not changed |
| Compatibility evidence | The runtime package records declared Node.js and TypeScript ranges from npm registry metadata for candidate tools. It is declared metadata, not an executed test. `typescript-eslint` declares TypeScript `>=4.8.4 <6.1.0`, which supports the 6.0.3 baseline and excludes 7.0.x |

No task status changes in this entry. `KR-BINC-001-001`, `KR-BINC-001-002` and `KR-BINC-001-005` stay In Review, their records stay Proposed, and `KR-BINC-001-008` stays on hold. No decision is approved by creating a package, merging this change or a passing check. The `Claude-Session` trailer decision from PB-011 is still open.

## 3L. PB-013 — Approval Checker Consistency Hardening

| Field | Value |
|---|---|
| Change ID | PB-013 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PR #8 (merge `19e1ae4`) |

Reason: the external audit of `main` at `19e1ae4` found that `check_backend_approvals.py` rejected an Approved decision record only when an approver row was Pending. A record could pass with a Rejected or Returned for revision row, or with a required approver missing, so the secret-handling decision (Security Owner approval plus Cloud/Infrastructure Owner review) could look approved without meeting its own rule.

| Item | Disposition |
|---|---|
| Required approvers | Read from the decision record Task Record. Roles are compared ignoring case and a trailing "(review)" or "review" qualifier |
| Approved record | Needs a row for every required approver, every row Approved, and a date and evidence on every row. Missing, Pending, Rejected, Returned for revision, an empty table and undeterminable required approvers all fail |
| Proposed and other dispositions | Unchanged: only the row vocabulary is checked, so a record can show partial progress |
| Tests | 10 new negative and positive cases. Eight of them fail against the previous checker, which shows they cover the gap |
| Scope | `scripts/docs/check_backend_approvals.py`, its tests, and the two README sentences that describe it. The checker still never changes a decision or task status |

No task status changes. `KR-BINC-001-001`, `KR-BINC-001-002` and `KR-BINC-001-005` stay In Review and their records stay Proposed. A passing check is not an approval.

## 3M. PB-014 — Runtime Compatibility Evidence and Approval Wording

| Field | Value |
|---|---|
| Change ID | PB-014 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-013 |

Reason: the external audit found that the runtime approval package let the approver decide whether approval waits for the compatibility evidence, although Section 6 of the decision record already requires it before approval.

| Item | Disposition |
|---|---|
| Executed check | Node.js 24.21.0 (from the npm registry package, not nodejs.org) ran a strict TypeScript 6.0.3 sample, the same sample under TypeScript 7.0.2 with no deprecated or removed option reported, eslint 10.12.0 with typescript-eslint 8.71.1, vitest 5.0.3 and an import of pg 8.23.1. All exited with status 0 |
| Finding | TypeScript 6 needs an explicit `rootDir` (TS5011) |
| Not demonstrated | The pin method, official checksum verification, the bundled npm 11 (npm 10.9.4 was used), the HTTP framework, the migration tool, CI, and TypeScript 7.0.2 with typescript-eslint |
| Wording | The approval package now states that approval waits for the Section 6 evidence. The open question about conditional approval is replaced |
| Scope | The runtime decision record (Section 6), the runtime approval package and the changelogs |

No task status changes and no decision is approved. `KR-BINC-001-001` stays In Review and its record stays Proposed.

## 3N. PB-015 — Credential-Shaped Example Removed from Security Gate Record

| Field | Value |
|---|---|
| Change ID | PB-015 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-014 |

Reason: the external audit found that `BACKEND_SECURITY_GATE.md` quoted the credential-shaped database URL that the same document asks to be replaced elsewhere.

| Item | Disposition |
|---|---|
| Example | The literal URL is replaced by a placeholder form and a note that the value is not repeated |
| Rescan | A manual pattern-based rescan of tracked files found no remaining match. Results are recorded without values in section 4.2.1 of the security gate record |
| History | The literal remains in Git history (36 of 37 commits on `origin/main`). The Security Owner is asked to assess exposure and decide on any rotation or history action |
| Scope | `BACKEND_SECURITY_GATE.md`, this changelog and the increment changelog |

No gate is closed and no task status changes. The scan does not replace the scanner decision `KR-BINC-001-008`, which stays on hold.

## 3O. PB-016 — Secret-Handling Pre-Approval Corrections

| Field | Value |
|---|---|
| Change ID | PB-016 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-015 |

Reason: an independent review of the `KR-BINC-001-005` approval package found items to correct before the Security Owner and Cloud/Infrastructure Owner are asked to review it. Each cited program section was checked against the repository before the change.

| Item | Disposition |
|---|---|
| Security gate record Section 9 | Stale wording that still called the example an unremediated finding. It now separates the recorded working-tree rescan from the pending history assessment, the missing scanner enforcement and the unclaimed gate closure |
| Approval package | Revision 2: names the open history finding, states that policy approval does not decide it or close a gate, and adds a Security Owner question for its disposition |
| Decision record | S4 wording limited to actual critical key material; test credential requirements stated; local file protections; injection is not confidentiality; redaction covers URLs, query strings, nested errors, telemetry and health output and drops events when redaction fails; separate credentials mean distinct identities; exposure outline lists the assessment fields and the closure evidence |
| Not changed | The disposition stays Proposed. No approval row changes. Scanner selection (`KR-BINC-001-008`) stays on hold |

No task status changes. `KR-BINC-001-005` stays In Review. No security gate is closed.

## 3P. PB-017 — KR-BE-1-001 Implementation Plan

| Field | Value |
|---|---|
| Change ID | PB-017 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-016 |

Reason: `KR-BE-1-001` is the first application task and stays Blocked until `KR-BINC-001-001` and `KR-BINC-001-002` are approved. A plan lets implementation start without further design once they are.

| Item | Disposition |
|---|---|
| New document | `increments/B-INC-001-SECURE-FOUNDATION/plans/KR-BE-1-001-application-structure-plan.md` |
| Open questions | The application directory (`apps/backend` or `apps/control-plane`), the self-contained npm package against the pnpm and turbo layout in the setup document, and the ordering of ignore rules against `KR-BINC-001-006`. Each needs an owner answer |
| Review | An independent review returned the plan for a small revision, which is applied: explicit compiled-test command contract (a sandbox trial showed a directory argument to `node --test` fails), runtime pin mechanism taken from the approved record, a disposable lockfile mismatch test, and per-gate contribution against what stays open |
| Not changed | No scaffold, package metadata or lockfile exists. `KR-BE-1-001` stays Blocked. No decision approved, no task status changed, no gate closed |

## 3Q. PB-018 — Audit Follow-Up Corrections

| Field | Value |
|---|---|
| Change ID | PB-018 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-017 |

Reason: an external re-audit of `main` at `f7483db` closed the earlier findings 1 and the 005 corrections, left findings 2 and 4 partly closed for reasons that need owner action, and found four documentation issues.

| Item | Disposition |
|---|---|
| N-01 | `BACKEND_SECURITY_GATE.md` 4.2.2 records a rescan of `main` at `f7483db` with its revision, method, categories and limits, labels the placeholder forms as intentional and nonfunctional, and states that "no match" does not mean no URL-shaped template exists. The scan run on the PR #12 branch is superseded |
| N-02 | `claude/Handoff.md` refreshed to `f7483db` and the merged state of PRs #12 to #14 |
| N-03 | Six increment changelog entries now cite the real commits and merges instead of "Pending" |
| N-04 | The secret-handling record states that backend workloads use controlled cryptographic interfaces for high-value key operations and that the Cloud/Infrastructure Owner confirms the boundary |
| Not changed | No approval, no status change, no gate closed. The Git-history exposure assessment, the open `KR-BINC-001-001` evidence and `KR-BINC-001-008` (on hold) are unchanged |

## 3R. PB-019 — Approval Package Pointers After the Second Re-Audit

| Field | Value |
|---|---|
| Change ID | PB-019 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-018 |

Reason: a second external re-audit of `main` at `8f1964d` closed N-01, N-03 and N-04, and found that the `KR-BINC-001-005` approval package and record still pointed to the superseded rescan in `BACKEND_SECURITY_GATE.md` 4.2.1 and that the package said there was no scan result to review.

| Item | Disposition |
|---|---|
| Approval package (revision 3) | Points to 4.2.2, and the evidence statement now says no automated enforcement is demonstrated, the linked tests have not run, and the manual rescan is evidence of its stated scope only |
| Decision record | The exposure outline points to 4.2.2 |
| Gate record 4.2.2 | States that the history count is per commit and per pattern match, not a count of distinct credentials or exposure events |
| Changelog and handoff | The PB-018 entry cites its real commit and merge; `claude/Handoff.md` is refreshed to `8f1964d` |
| Not changed | No approval, no status change, no gate closed. The package stays Draft until the review requests are actually sent |

## 3S. PB-020 — Runtime Pin Proposal and TypeScript Scope

| Field | Value |
|---|---|
| Change ID | PB-020 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-019 |

Reason: the audit work left two items open for `KR-BINC-001-001`: the pin method was undecided and the TypeScript 7.0.2 check was a pre-approval condition although 7.0.2 is only an upgrade candidate.

| Item | Disposition |
|---|---|
| Pin method | A recommendation for the Backend Technical Lead (decision record Section 5.1): `.node-version` as the canonical exact pin, a matching `engines.node` and `engine-strict=true` as guards, the official distribution as the only accepted runtime source, the bundled npm recorded per pin change, a consistency check required of `KR-BINC-001-017`. Not decided |
| TypeScript scope | The repository owner agreed in session to keep 6.0.3 as the baseline and defer 7.0.2 to a later decision record. The Section 6 condition for 7.0.2 is removed. This is not the Backend Technical Lead's recorded approval |
| Evidence fields | Section 6.1 lists the fields a verification of the official distribution must record, including the signature check or an explicit statement that none was done |
| Not changed | No approval, no status change, no gate closed. The official checksum verification and the bundled npm check are still outstanding, so the decision is not ready to approve |

## 3T. PB-021 — Official Node.js Distribution and Bundled npm Evidence

| Field | Value |
|---|---|
| Change ID | PB-021 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-020 |

Reason: the runtime and package manager records still lacked the official checksum verification and the bundled npm check.

| Item | Disposition |
|---|---|
| Evidence | Recorded in `KR-BINC-001-001` Section 6.2 and in the `KR-BINC-001-002` record Section 3: Node.js 24.21.0 downloaded from nodejs.org with a matching SHA-256, bundled npm 11.19.0, install scripts disabled, `npm install` and a clean `npm ci`, typecheck, build, `node --test`, eslint, vitest 5.0.3, the pg 8.23.1 import, and a mismatched lockfile rejected by `npm ci` |
| Signature | Not verified. The manifest signature key `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356` was not in the keyring and was not compared with the official release-keys list. No authenticity claim is made |
| Scope | Disposable sample project, Linux x64, executed by the repository owner with a throwaway script that is not in the repository. TypeScript 7.0.2 deferred and not tested |
| Approval packages | `KR-BINC-001-001` revision 3 and `KR-BINC-001-002` revision 2 |
| Not changed | No approval, no status change, no gate closed, no task accepted. The pin decision, the key authentication decision and the framework and migration tool shortlist remain open |

## 3U. PB-022 — Node.js Release Signing Key Authentication

| Field | Value |
|---|---|
| Change ID | PB-022 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-021 |

Reason: the repository owner required the Node.js release signing key to be authenticated after PB-021 recorded the signature as not verified.

| Item | Disposition |
|---|---|
| Evidence | `KR-BINC-001-001` Section 6.3: key `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356` fetched by its full fingerprint from `keys.openpgp.org` into a temporary keyring, fingerprint equal to the value the owner copied from the `nodejs/node` README, and both `SHASUMS256.txt.sig` and `SHASUMS256.txt.asc` verified with `gpg` (exit status 0) for release v24.21.0. The signed manifest entry equals the checksum in Section 6.2 |
| Limits | No web-of-trust certification (gpg reports the key as not certified). The README and keyserver are both Node.js project channels. v24.21.0 only. The script is a throwaway and is not in the repository |
| Approval packages | `KR-BINC-001-001` revision 4 and `KR-BINC-001-002` revision 3 |
| Not changed | No approval, no status change, no gate closed, no task accepted. The pin decision and the framework and migration tool shortlist remain open |

## 3V. PB-023 — Owner Direction on Pin Method, Framework Candidate and Migration Tool Shortlist

| Field | Value |
|---|---|
| Change ID | PB-023 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-022 |

Reason: the repository owner chose a direction on the three open items of `KR-BINC-001-001` after the options were set out in session.

| Item | Disposition |
|---|---|
| Pin method | Proposal A (decision record Section 5.1) is the owner's recommendation to the Backend Technical Lead. A digest-pinned container image for deployment is to be added later and is not decided |
| HTTP framework | Fastify is the owner's preferred candidate. `KR-BINC-001-003` still decides |
| Migration tool | node-pg-migrate, graphile-migrate and dbmate are the shortlist. `KR-BINC-001-004` still decides, with Database Technical Lead review |
| Evidence | Section 6.4 of the decision record lists each tool's declared support from registry metadata (nothing installed or run). Points for the deciding tasks: graphile-migrate's newest stable release dates from 2022 and its 2.0 line is a release candidate; dbmate ships a native binary through per-platform optional packages |
| Approval package | `KR-BINC-001-001` revision 5 |
| Not changed | No approval, no status change, no gate closed, no task accepted. `KR-BINC-001-003` and `KR-BINC-001-004` are not started |

## 3W. PB-024 — Approval of KR-BINC-001-001 and KR-BINC-001-002

| Field | Value |
|---|---|
| Change ID | PB-024 |
| Date | 2026-10-11 |
| Status | Approved (decision records) |
| Owner role | Backend Technical Lead |
| Follows | PB-023 |

Reason: the repository owner, acting as Backend Technical Lead, approved the runtime and package manager decisions after the evidence in PB-021 to PB-023.

| Item | Disposition |
|---|---|
| `KR-BINC-001-001` | Approved 2026-10-11. Node.js 24 LTS pinned exactly to 24.21.0 from the official distribution, TypeScript 6.0.3, bundled npm 11.19.0, pin proposal A. Not approved: the digest-pinned container image, Node.js 26, the framework, the migration tool, any application code |
| `KR-BINC-001-002` | Approved 2026-10-11. npm with the policy of Section 5 of the record |
| Independence | The approver is also the repository owner who directed the recommendation. No independent review took part, and the records say so |
| Approval packages | Both Closed, with the outcome in the decision records only |
| Task statuses | Both tasks stay In Review. An Approved decision does not make a task Accepted. Linked tests are NOT RUN and no security gate is closed |
| `KR-BE-1-001` | Not started. Question 1 of its plan is answered (`apps/backend`). The layout part of question 2 and question 3 are open |

## 3X. PB-025 — KR-BE-1-001 Prerequisites Recorded and Task Ready

| Field | Value |
|---|---|
| Change ID | PB-025 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-024 |

Reason: after the approvals in PB-024, the repository owner answered the three open questions of the `KR-BE-1-001` plan.

| Item | Disposition |
|---|---|
| Question 1 | Directory is `apps/backend` |
| Question 2 | A self-contained `apps/backend` package with its own `package-lock.json`, npm as approved in `KR-BINC-001-002`, no root workspace and no turbo until a second package exists. `DEVELOPMENT_SETUP.md` is not changed here; `KR-BINC-001-016` aligns it |
| Question 3 | A narrow `apps/backend/.gitignore` (`node_modules`, `dist`, `coverage`). It does not complete `KR-BINC-001-006`, and it is reconciled with that task before that task is accepted |
| Task status | `KR-BE-1-001` moves to Ready in `TASKS.md`. It is not started and not accepted. Linked tests are NOT RUN and no security gate is closed |
| Not changed | No decision, no approval, no gate. The framework (003) and migration tool (004) stay undecided |

## 3Y. PB-026 — KR-BE-1-001 Application Structure Scaffold

| Field | Value |
|---|---|
| Change ID | PB-026 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-025 |

Reason: implementation of `KR-BE-1-001`, the first application code, using the approved decisions `KR-BINC-001-001` and `KR-BINC-001-002` and the owner answers recorded in PB-025.

| Item | Disposition |
|---|---|
| Added | `apps/backend`: `package.json`, `package-lock.json` (generated with the pinned toolchain by the delivery script), `.npmrc`, `.node-version`, `.gitignore`, `tsconfig.json`, `src/main.ts` (inert), `src/runtime-info.ts`, `tests/runtime-info.test.ts`, `README.md` |
| Versions | Node.js 24.21.0, bundled npm 11.19.0, TypeScript 6.0.3, `@types/node` 24.19.2, all exact. No other dependency, no framework, no configuration module, no database access, no listening port, no secrets code |
| Task status | In Progress. Not Accepted. The plan Section 6 evidence (clean-checkout transcript with the pinned toolchain, lockfile mismatch test, entry point statement, BTS-036 review) is not recorded yet; linked tests and gates are NOT RUN as task evidence |
| Gates | No gate closed. Contribution and open items per the plan Section 6.1 |
| Plan change | The plan scaffold table now lists `.node-version` and the narrow `.gitignore` as decided |
| Not changed | `DEVELOPMENT_SETUP.md` (aligned by `KR-BINC-001-016`), CI, `Makefile` targets `build`, `test`, `lint`, `format`, `format-check` (still fail on purpose; wiring is a toolchain task) |

## 3Z. PB-027 — Node.js Pin Moved to the Repository Root After the BTS-036 Review

| Field | Value |
|---|---|
| Change ID | PB-027 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-026 |

Reason: the independent review of `KR-BE-1-001` (BTS-036, reviewer ChatGPT, 2026-10-11, on merged PR #23, commit `a3b40b0`) found that the approved pin method (`KR-BINC-001-001` Section 5.1) names `.node-version` at the repository root, while PB-026 added it under `apps/backend`. The review also found that the clean-checkout transcript names a base revision (`1af7877`, before the final commit) and not the exact tested tree.

| Item | Disposition |
|---|---|
| Review finding 1 (blocker) | Accepted. `apps/backend/.node-version` is moved to the repository root (`.node-version`, `24.21.0`). `apps/backend/package.json` `engines.node` stays `24.21.0` and `apps/backend/.npmrc` keeps `engine-strict=true`. The CI consistency check remains `KR-BINC-001-017` and does not exist yet |
| Review finding 2 (blocker) | Accepted. The clean-checkout run is repeated on the merged tree of this change, recording the exact commit and tree hash. The result is recorded in the next change; the earlier transcript is kept as history, not as task evidence |
| Review finding 3 (should-fix) | Accepted. The next change records the evidence, the lockfile review, the mismatch test and the review disposition in the task records |
| Review notes 4 to 7 | No change requested by the reviewer. The malformed-input note on `runtimeInfo` is accepted as a limit of a scaffold helper and is not a validation contract |
| Task status | In Progress. Not Accepted. No gate closed |
| Changed | `.node-version` (moved), `apps/backend/README.md`, the plan scaffold table, `TASKS.md` status line, this entry, the increment `CHANGELOG.md` entry, `claude/Handoff.md` |
| Not changed | Any dependency, the lockfile, CI, `DEVELOPMENT_SETUP.md` |

## 3AA. PB-028 — KR-BE-1-001 Evidence and BTS-036 Review Record

| Field | Value |
|---|---|
| Change ID | PB-028 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-027 |

Reason: record the plan Section 6 evidence for `KR-BE-1-001` and the BTS-036 review with its disposition, as the review's third finding asked.

| Item | Disposition |
|---|---|
| Added | `evidence/KR-BE-1-001-evidence.md` (clean-checkout run on commit `ffc42d1`, tree hashes, lockfile review, mismatch test, entry point statement, gate contributions, the review record) |
| Task status | In Review. Not Accepted. Acceptance is the Backend Technical Lead's separate record |
| Gates | None closed. SEC-GATE-003 and SEC-GATE-004 receive contributions only; local secret detection is not claimed; SEC-GATE-013 keeps its open items |
| Review | ChatGPT returned "changes required"; the blockers are fixed or recorded; the reviewer has not re-reviewed the fixes |
| Changed | `TASKS.md` status line, increment `CHANGELOG.md`, this entry, `claude/Handoff.md` |
| Not changed | Code, dependencies, lockfile, CI |

## 3AB. PB-029 — KR-BE-1-001 Accepted

| Field | Value |
|---|---|
| Change ID | PB-029 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-028 |

Reason: the Backend Technical Lead accepts `KR-BE-1-001` after reviewing its Definition of Done and the evidence in `evidence/KR-BE-1-001-evidence.md`.

| Item | Disposition |
|---|---|
| Task status | Accepted on 2026-10-11 by the Backend Technical Lead |
| Basis | Definition of Done met: the clean checkout installs reproducibly under the pinned toolchain (exit 0 on commit `ffc42d1`), build and the baseline test run, the entry point is explicit and inert, no credential is embedded, and the structure matches the plan. BTS-036 review done with findings dispositioned |
| Limits | The reviewer did not re-review the fixes of the two blockers. The accepter is also the repository owner who directed the work, so the acceptance is not independent of it |
| Gates | None closed. SEC-GATE-003, SEC-GATE-004 and SEC-GATE-013 keep their open items. Local secret detection is not claimed |
| Acceptance criteria | `B-INC-001-AC-01` and `B-INC-001-AC-02` stay open; other tasks contribute to them |
| Changed | `TASKS.md` status line, the evidence record note, this entry, the increment `CHANGELOG.md` entry, `claude/Handoff.md` |
| Not changed | Code, dependencies, lockfile, CI |

## 3AC. PB-030 — KR-BE-1-002 Module Boundaries Plan

| Field | Value |
|---|---|
| Change ID | PB-030 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Architecture Owner |
| Follows | PB-029 |

Reason: prepare `KR-BE-1-002` now that `KR-BE-1-001` is Accepted.

| Item | Disposition |
|---|---|
| Added | `plans/KR-BE-1-002-module-boundaries-plan.md`: what the architecture settles and leaves open, candidate tiered one-way dependency rules, a candidate prohibited-coupling list, six pressure points, nine questions for the Architecture Owner, the evidence and the commit plan |
| Task status | Proposed, with the plan linked. Not started. Not Accepted |
| Decision | None. The candidate rules are proposals for review. Nothing is approved and no code or module directory is created |
| Gates and tests | BTS-001, BTS-004 and SEC-GATE-003 are NOT RUN |
| Changed | `TASKS.md` status line, increment `CHANGELOG.md`, this entry, `claude/Handoff.md` |

## 3AD. PB-031 — KR-BE-1-002 Module Boundaries Decision Record

| Field | Value |
|---|---|
| Change ID | PB-031 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Architecture Owner |
| Follows | PB-030 |

Reason: the Architecture Owner (the repository owner) answered the nine plan questions, so the decision record can be written.

| Item | Disposition |
|---|---|
| Added | `decisions/KR-BE-1-002-module-boundaries.md`: the fifteen modules in ten tiers, allowed dependencies per module, a shared kernel limit, nine prohibited couplings, dispositions of eight pressure points, a nine-item review checklist and an approval record (Pending) |
| Owner answers | All plan recommendations accepted; Credits owns credit plans; event types are declared by their publisher. Foreign keys across modules are referred to the Database Technical Lead |
| Plan change | Identity is placed below Organizations, which makes ten tiers. The plan table and Section 5 note are updated |
| Task status | In Progress. The decision is Proposed. The independent BTS-004 review is not done. Not Accepted |
| Gates and tests | BTS-001, BTS-004 and SEC-GATE-003 are NOT RUN. No enforcement is claimed |
| Changed | `TASKS.md` status line, the plan, increment `CHANGELOG.md`, this entry, `claude/Handoff.md` |

## 3AE. PB-032 — KR-BE-1-002 Decision Revised After the BTS-004 Review

| Field | Value |
|---|---|
| Change ID | PB-032 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Architecture Owner |
| Follows | PB-031 |

Reason: the independent review (BTS-004, reviewer ChatGPT, 2026-10-11) returned revision 1 of the decision record for revision, with four blockers on ownership and the Audit event rule, three should-fix points and two notes.

| Item | Disposition |
|---|---|
| Blockers 1 to 4 | Accepted. New Section 5.4 separates Booking from Resource Allocation, Lab observations from allocatable resources, run lifecycle (Runs) from Lab reporting, and chooses synchronous audit writes |
| Should-fix 5, 6, 8 | Accepted. Compatibility split between Artifacts, Platforms and Jobs; CreateBooking transaction contract (Section 5.6, atomicity left to `KR-BE-1-033`); reconciliation with the B-INC-002 to B-INC-004 task lists (Section 12) |
| Notes 7, 9 | Accepted. Event wording; enforcement claims stay bounded |
| New section | 5.5 lists shared infrastructure that is not a module (transaction port, idempotency, request context, configuration, migration baseline) |
| Owner confirmation | The synchronous-audit choice and the reading of architecture Section 25 are left for the Architecture Owner to confirm at approval |
| Task status | In Progress. The decision stays Proposed. The reviewer has not re-reviewed revision 2. Not Accepted |
| Changed | The decision record, `TASKS.md` status line, increment `CHANGELOG.md`, this entry, `claude/Handoff.md` |

## 3AF. PB-033 — KR-BE-1-002 Decision Approved

| Field | Value |
|---|---|
| Change ID | PB-033 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Architecture Owner |
| Follows | PB-032 |

Reason: the independent re-review (ChatGPT, 2026-10-11, on `main` `734edfa`) found revision 2 approvable, subject to the owner's confirmation of two choices. The Architecture Owner confirmed both and approved the decision in session.

| Item | Disposition |
|---|---|
| Decision | `KR-BE-1-002` module boundaries: Approved on 2026-10-11 by the Architecture Owner (revision 2) |
| Confirmed choices | Synchronous audit writes (event-driven Audit stays optional and needs a recorded exception); architecture Section 25 "execution state" means Lab-side tracking and Runs owns persisted run lifecycle |
| Re-review | Findings 1, 2, 5, 7 and 9 resolved; 3, 4 resolved once the owner confirmed; 6 resolved at design level; 8 partly resolved within the stated scope. No new blocker or should-fix finding |
| Follow-up constraints | Policy layer and tenant context stay shared application-layer capabilities (`KR-BE-1-019`); idempotency domain-neutral (`KR-BE-1-034`); migration baseline without shared repositories (`KR-BE-1-032`); transaction atomicity decided in `KR-BE-1-033` |
| Task status | In Review. Not Accepted. `B-INC-001-AC-03` not closed. BTS-004 is design-review evidence only |
| Independence | The approver is also the owner who directed the answers; the independent element is the AI review |
| Not changed | Code, dependencies, CI, `BACKEND_ARCHITECTURE.md`, the foreign-key policy (Database Technical Lead) |

## 3AG. PB-034 — KR-BINC-001-003 HTTP Framework Decision Record

| Field | Value |
|---|---|
| Change ID | PB-034 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-033 |

Reason: `KR-BINC-001-003` depends on the approved runtime and module-boundary decisions, so the options can be evaluated.

| Item | Disposition |
|---|---|
| Added | `decisions/KR-BINC-001-003-http-framework.md`: Fastify, Express and NestJS compared on typed handlers, validation, testability, module-boundary fit, maintenance and reversal cost; registry and disposable-lockfile facts; a sandbox compile-and-route check under the unchanged `tsconfig` |
| Recommendation | Fastify 5.12.5 exact, with constraints on boundary, plugins, validation and error contract, typed bodies, logging, lifecycle and tests, and the pin. Not approved |
| Evidence limits | The sandbox ran Node.js 22.22.0, not the pinned 24.21.0. Fastify declares no `engines`. Compatibility on the pinned runtime is shown in `KR-BE-1-004` |
| Rejected as recommendation | NestJS (second module system, decorator flags the scaffold does not set, largest surface); Express (no validation or test helper, separate community types) |
| Task status | In Review. Approval pending. Not Accepted |
| Changed | The decision record, `TASKS.md` status line, increment `CHANGELOG.md`, this entry, `claude/Handoff.md` |
| Not changed | `apps/backend`, dependencies, lockfile, CI |

## 3AH. PB-035 — KR-BINC-001-003 HTTP Framework Approved

| Field | Value |
|---|---|
| Change ID | PB-035 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-034 |

Reason: the Backend Technical Lead approved the recommendation of PB-034 in session.

| Item | Disposition |
|---|---|
| Decision | `KR-BINC-001-003`: Fastify, exact 5.12.5, as the HTTP framework of the API layer, with the seven constraints of the record. Approved on 2026-10-11 |
| Not selected | NestJS, Express |
| Unblocks | `KR-BE-1-004` (HTTP transport), `KR-BE-1-006` (API v1 routing) and `KR-BE-1-007` (validation and error contract) with respect to the framework choice. Their other dependencies still apply |
| Open verification | Install from the lockfile and run the representative route on Node.js 24.21.0 and npm 11.19.0 (`KR-BE-1-004`); real-module boundary check (BTS-004); error contract tests (BTS-007) |
| Independence | The approver is also the owner who stated the preference; no independent reviewer took part |
| Task status | In Review. Not Accepted. BTS-004, BTS-007 and BTS-032 are NOT RUN |
| Not changed | `apps/backend`, dependencies, lockfile, CI |

## 3AI. PB-036 — KR-BE-1-004 HTTP Transport

| Field | Value |
|---|---|
| Change ID | PB-036 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-035 |

Reason: `KR-BE-1-004` implements the initial HTTP server and lifecycle with the framework approved in `KR-BINC-001-003`.

| Item | Disposition |
|---|---|
| Dependency | `fastify` 5.12.5, exact, in `apps/backend/package.json`; lockfile generated by the delivery script under checksum-verified Node.js 24.21.0 |
| Structure | Everything that imports Fastify is in `apps/backend/src/transport` (constraint 1 of the framework record). No module directory is created |
| Behavior | API v1 prefix; 404 and 405 (with `Allow`) handlers; one error handler; 400, 413, 415 and 500 mappings; no internal message, stack or submitted value in a response; body limit 1 MiB (provisional) |
| Validation | Fastify's default validator coerces types and removes unknown properties. Both are disabled and tested, so input that does not match a schema is rejected |
| Lifecycle | `startHttpServer` and `stop` (idempotent, waits for in-flight requests, closes connections still open after a grace period); `installShutdownHandlers` for SIGINT and SIGTERM. Startup failure reports only the error code |
| Left out on purpose | Opening a port from `main.ts` (host and port need `KR-BE-1-003`); logging (`KR-BE-1-041`); request ID (`KR-BE-1-005`); health routes; the final error envelope and codes (`KR-BE-1-007`) |
| Contract conflict | `API_CONTRACT.md` Section 18 (nested `error` object, codes such as `VALIDATION_ERROR`) differs from `RESPONSES.md` and `ERROR_CODES.md` (full envelope, codes such as `INVALID_REQUEST`). This task follows `API_CONTRACT.md` and changes only `error-contract.ts` if `KR-BE-1-007` decides otherwise |
| Tests | BTS-007 and BTS-032: 19 cases (12 route and error-contract, 7 lifecycle); the suite has 20 with the baseline test. Node.js 24.21.0 transcript is posted as a PR comment by the script, not committed |
| Independence | Written by Claude and reviewed by no one else yet; the Backend Technical Lead owns the architecture |
| Task status | In Review. Not Accepted |
| Not changed | CI, other tasks' status, the framework decision |

## 3AJ. PB-037 — KR-BINC-001-005 Approval Package Requested

| Field | Value |
|---|---|
| Change ID | PB-037 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-036 |

Reason: the Backend Technical Lead reported that the review requests for `KR-BINC-001-005` were emailed to the Security Owner and the Cloud/Infrastructure Owner.

| Item | Disposition |
|---|---|
| Package | `APPROVAL-KR-BINC-001-005-secret-handling.md` moves from Draft to Requested; request date 2026-10-11 recorded in Section 9; the decisions README row follows |
| Evidence | The owner's statement in session. The emails are not in the repository |
| Not recorded | Any disposition. The decision record stays Proposed and the task In Review. The history finding is still pending with the Security Owner |
| Related, outside this package | The Database Technical Lead request on `KR-BINC-001-004` was sent the same day |
| Not changed | `apps/backend`, dependencies, CI, the decision record |

## 3AK. PB-038 — KR-BE-1-003 Configuration Boundary (Non-Secret Settings)

| Field | Value |
|---|---|
| Change ID | PB-038 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-037 |

Reason: the owner chose to start `KR-BE-1-003` with the non-secret settings while the `KR-BINC-001-005` reviews are pending, so that the entry point can open a port.

| Item | Disposition |
|---|---|
| Boundary | `apps/backend/src/config/config.ts`: `loadConfig(env)` validates and returns a frozen typed value. No dependency was added |
| Settings | `KRITVA_HTTP_PORT` (required, 1 to 65535); `KRITVA_HTTP_HOST` (default 127.0.0.1); `KRITVA_HTTP_SHUTDOWN_GRACE_MS` (default 10000, 0 to 300000); `KRITVA_HTTP_BODY_LIMIT_BYTES` (default 1048576, 1 to 104857600). Names and defaults are the implementer's proposal for the owner to confirm |
| Failure behavior | Missing, empty, malformed or out-of-range values and unknown `KRITVA_` names are rejected together. The message names the setting and the reason and never the value. Whitespace is not trimmed |
| Composition | `src/run.ts` loads configuration before the server is built; `main.ts` calls it with the process environment. Invalid configuration exits 1 before any port opens. SIGINT and SIGTERM stop the server and exit 0 |
| Example | `apps/backend/.env.example`: placeholders and defaults only; the application does not read it |
| Not done | Secret-typed values, credential and connection settings, database settings, logging settings (`KR-BE-1-041`); redaction beyond the no-value rule; the scanner-backed example check (`KR-BINC-001-007`, `-008`) |
| Dependency risk | `KR-BINC-001-005` is Requested, not approved, and `KR-BINC-001-007` is not done. If the Security Owner changes the boundary, `config.ts` changes |
| Tests | 13 configuration tests and 5 startup tests, two of which run `main.js` as a child process. Node.js 24.21.0 transcript is posted as a PR comment, not committed |
| Independence | Written by Claude; no independent review |
| Task status | In Review. Not Accepted |
| Not changed | CI, other tasks' status, the transport |

## 3AL. PB-039 — KR-BE-1-003 Hostname Validation Fix

| Field | Value |
|---|---|
| Change ID | PB-039 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-038 |

Reason: an AI design inspection by ChatGPT of `main` at `777f23f` found the hostname check of `KRITVA_HTTP_HOST` too permissive. This was confirmed by running the pattern against `api..internal` and `api.-internal`.

| Item | Disposition |
|---|---|
| Fix | A host must be an IP address or a DNS name of at most 253 characters in dot-separated labels of 1 to 63 letters, digits or hyphens; a label does not start or end with a hyphen. Empty labels, a trailing dot and underscores are rejected |
| Tests | Negative cases added (empty label, hyphen at a label edge, leading and trailing dot, 64-character label, 305-character name) and a positive list. Suite 38 tests |
| Same review, not changed here | The review also states `B-INC-001-AC-05` is not demonstrated (safe-example review, scans and Security Owner disposition are open); the early start of `KR-BE-1-003` is adequately disclosed; unknown `KRITVA_` rejection and no trimming are the right policy; no module-boundary or secret-policy violation was found. The reviewer did not rerun the tests |
| Next activity (ranked by the review) | `KR-BE-1-006` API v1 routing; decide the canonical error envelope for `KR-BE-1-007` (which depends on `KR-BE-1-006`); keep `KR-BE-1-005` in refinement until identity decisions exist |
| Independence | AI design inspection, not an independent human review |
| Task status | In Review. Not Accepted |
| Not changed | Dependencies, lockfile, CI, other tasks |

## 3AM. PB-040 — KR-BE-1-006 API v1 Routing

| Field | Value |
|---|---|
| Change ID | PB-040 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-039 |

Reason: `KR-BE-1-006` establishes versioned routing and the route-registration pattern on the transport of `KR-BE-1-004`, as ranked first among the implementation options by the ChatGPT inspection recorded in PB-039.

| Item | Disposition |
|---|---|
| Pattern | `RouteGroup { name, prefix, register }` in `apps/backend/src/transport/api-v1.ts`. A module's API layer will expose one group with one path root below `/api/v1`; routes are registered relative to the root, so a module cannot register outside it |
| Rules | Roots are lower-case hyphenated segments; names are unique; no two groups share a root or nest one in another. A violation throws `RouteRegistrationError` while the server is built, before any port opens. A duplicate route inside a group stops startup with a sanitized `HttpStartupError`. Each group is its own scope |
| Behavior | Only `/api/v1` is served; other versions and the bare prefix are 404. Exact matching: no trailing slash, doubled slash or case folding. This closes a router behavior where `/widgets/` matched `/:widget_id` with an empty value. Unsupported method on a known path: 405 with `Allow` (OPTIONS included); unknown path: 404 |
| Change to KR-BE-1-004 | The test-only `routes` callback of `buildHttpServer` becomes `groups`. No production caller used it |
| Not done | Any domain route or group; the final error envelope (`KR-BE-1-007`); request IDs (`KR-BE-1-005`); OpenAPI generation; CORS; rate limits |
| Tests | 15 routing tests; the suite has 53. Node.js 24.21.0 transcript is posted as a PR comment, not committed |
| Independence | Written by Claude; no independent review |
| Task status | In Review. Not Accepted |
| Not changed | Dependencies, lockfile, CI, the configuration boundary |

## 3AN. PB-041 — Canonical REST API v1 Error Envelope

| Field | Value |
|---|---|
| Change ID | PB-041 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-040 |

Reason: `API_CONTRACT.md` Section 18 and `RESPONSES.md` with `ERROR_CODES.md` described different error bodies and codes, and `KR-BE-1-007` needs one. The Backend Technical Lead chose the full `RESPONSES.md` envelope in session after an AI design inspection (ChatGPT, `main` at `fb01b9e`) recommended it.

| Item | Disposition |
|---|---|
| Decision | The canonical REST API v1 error envelope is the full response envelope of `RESPONSES.md` with the error model and registry of `ERROR_CODES.md`. Record: `decisions/KR-BE-1-007-error-envelope.md`. Approved 2026-10-11 |
| Document change | `API_CONTRACT.md` Section 18 rewritten; Section 20 now maps each retired code to its registry code and `status`; the idempotency, cancel-conflict, rate-limit and conformance references and three examples use registry codes |
| Proposed, not approved | Registry additions `METHOD_NOT_ALLOWED` (405), `PAYLOAD_TOO_LARGE` (413) and `RESOURCE_GONE` (410), and 405 and 410 in the HTTP mapping table |
| Open | Whether success responses are also wrapped; the request-ID source (recommend the request-ID part of `KR-BE-1-005` before `KR-BE-1-007`); the correlation field; other documents that may describe the older shape; the `SEC-GATE-009` mapping to AC-08 |
| Same inspection, recorded | BTS-032 requires HTTP, service and persistence integration, so the 53 transport tests are component evidence and BTS-032 is not satisfied. The in-repo handoff header and "main at last check" were stale and are refreshed in this change |
| Independence | Approver is also the owner who directed the work; no independent human reviewer |
| Not changed | `apps/backend`, dependencies, CI, `RESPONSES.md`, `ERROR_CODES.md`, task statuses other than the `KR-BE-1-007` note |

## 3AO. PB-042 — Request Context and Server-Generated Request IDs (KR-BE-1-005, request ID only)

| Field | Value |
|---|---|
| Change ID | PB-042 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-041 |

Reason: the canonical error envelope (PB-041) requires a non-null `request_id`, and the transport had none. The Backend Technical Lead asked for the request-ID part of `KR-BE-1-005` before `KR-BE-1-007`.

| Item | Disposition |
|---|---|
| Context | `RequestContext { requestId }` in `apps/backend/src/shared/request-context.ts`, created per request, frozen, held in `AsyncLocalStorage`. `currentRequestContext()` returns it or nothing; `requireRequestContext()` throws `RequestContextMissingError` outside a request |
| Transport | `src/transport/request-context.ts` registers the first `onRequest` hook, sets `request.requestContext`, adds the `X-Request-ID` response header and runs the rest of the request inside the context. Only this file knows Fastify, consistent with `KR-BE-1-002` |
| Policy | The server always generates `req-<uuid>`. A client `X-Request-ID` or `X-Correlation-ID` is ignored and not echoed, so callers cannot choose or forge the ID. A trusted-gateway exception would need its own decision |
| Error body | `request_id` is filled in the provisional nested body for 404, 405, validation and server errors, and equals the response header |
| Not done | Correlation ID (`KR-BE-1-008`); principal and tenant (identity tasks); log fields (`KR-BE-1-041`); the full envelope and success wrapping (`KR-BE-1-007`, wrapping undecided) |
| Tests | 14 new tests (format, uniqueness, isolation across 50 and 40 concurrent requests, propagation across awaits and timers, no leak after a request, client headers ignored); one existing 404 assertion updated; suite 67. BTS-006 and B-INC-001-AC-07 are not satisfied; `SEC-GATE-009` is not closed |
| Independence | Written by Claude; no independent review |
| Task status | In Review, request ID only. Not Accepted |
| Not changed | Dependencies, lockfile, CI, configuration |

## 3AP. PB-043 — REST API v1 Response Contract

| Field | Value |
|---|---|
| Change ID | PB-043 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-042 |

Reason: `KR-BE-1-007` needed the success-wrapping, request-ID, registry and gate-mapping questions left open by PB-041. The Backend Technical Lead chose, in session, to decide the whole response contract before implementing, after an AI design inspection (ChatGPT) ranked that option first of five.

| Item | Disposition |
|---|---|
| Decision | Every REST API v1 response with a body uses the full `RESPONSES.md` envelope, success and error. `204` has no body. Record: `decisions/KR-BE-1-007-response-contract.md`. Approved 2026-10-11 |
| Request ID | Server-generated, equal to `X-Request-ID`; client `X-Request-ID` and `X-Correlation-ID` ignored and not echoed. `RESPONSES.md` Section 11 amended for REST API v1 |
| Registry | `METHOD_NOT_ALLOWED` (405) and `PAYLOAD_TOO_LARGE` (413) added to `ERROR_CODES.md`; HTTP mapping tables updated; `RESOURCE_GONE` deferred |
| Gate mapping | `SEC-GATE-009` stated as logging redaction, not response-contract evidence; AC-08 notes added; links and merged commit trailers unchanged |
| Documents | `API_CONTRACT.md` Sections 12, 13, 15.1, 18, 20; `RESPONSES.md`; `ERROR_CODES.md`; `ACCEPTANCE_CRITERIA.md`; `TEST_PLAN.md`; `TASKS.md` (`KR-BE-1-007` note) |
| Open | Success `code` values per endpoint; correlation handling (`KR-BE-1-008`); `RESOURCE_GONE`; whether to remove the `SEC-GATE-009` link from AC-08, `KR-BE-1-006` and `KR-BE-1-007`; `BACKEND_ARCHITECTURE.md` and `API_ARCHITECTURE.md` not checked |
| Independence | Approver is also the owner who directed the work; no independent human reviewer. Details beyond the chosen option are Claude's recommendation and take effect on merge |
| Not changed | `apps/backend`, dependencies, CI, task statuses |

## 3AQ. PB-044 — Response Envelope and Error Contract (KR-BE-1-007)

| Field | Value |
|---|---|
| Change ID | PB-044 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-043 |

Reason: `KR-BE-1-007` implements the response contract decided in PB-041 and PB-043.

| Item | Disposition |
|---|---|
| Envelope | `src/transport/response-contract.ts` defines `ResponseEnvelope`, `PROTOCOL_VERSION` "1.0", whole-second UTC timestamps and `successBody(spec, data, requestId)`. `request_id` is always a string |
| Errors | `error-contract.ts` builds the full envelope with `data` null and `error { details, retryable, field_errors }`. Status and code per error: 400 `INVALID_REQUEST` (field codes `MISSING_REQUIRED_FIELD`, `FIELD_INVALID`), 404 `NOT_FOUND`/`RESOURCE_NOT_FOUND`, 405 `INVALID_REQUEST`/`METHOD_NOT_ALLOWED` with `Allow`, 413 `REJECTED`/`PAYLOAD_TOO_LARGE`, 415 `INVALID_REQUEST`/`UNSUPPORTED_CONTENT_TYPE`, 500 `FAILED`/`INTERNAL_ERROR` (retryable). Registry messages are used |
| Success | Handlers return `successBody` and choose the HTTP status; `204` has no body. No success code is defined until an endpoint exists |
| Request ID | `requestIdOf(request)` returns the context ID, with a fresh ID as a safety net so the envelope never carries null |
| Tests | 10 new tests (every error kind, field errors without echoed values, no leak of exception text, success, 202, 204, client IDs never in the body, timestamp, classification); existing tests moved to the envelope; suite 77. Node.js 24.21.0 transcript posted as a PR comment. These are component tests; BTS-032 is not satisfied |
| Open | `RESPONSES.md` Section 39 versus `ERROR_CODES.md` Section 8 on where `field_errors` lives (the code follows `ERROR_CODES.md` and `API_CONTRACT.md`); success codes per endpoint; correlation (`KR-BE-1-008`); `BACKEND_ARCHITECTURE.md` and `API_ARCHITECTURE.md` not checked |
| Independence | Written by Claude; no independent review |
| Task status | In Review. Not Accepted |
| Not changed | Dependencies, lockfile, CI, protocol documents |

## 3AR. PB-045 — External Audit Fixes for the Response Contract

| Field | Value |
|---|---|
| Change ID | PB-045 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-044 |

Reason: an AI external audit (ChatGPT, `main` at `2de2897`) found eight issues in the merged response work; none was a false closure of a task, criterion or gate.

| Item | Disposition |
|---|---|
| F-01 (P1) | `classifyError` no longer relabels every 4xx as 400. 400, 401 (`AUTH_REQUIRED`), 403 (`AUTHZ_DENIED`), 404 and 429 (`RATE_LIMIT_EXCEEDED`) map to registry codes; any other status becomes `INTERNAL_ERROR`. Tests assert HTTP status, envelope status and code agree |
| F-02 (P1) | `requestIdOf` throws without a context. `ensureRequestId(request, reply)` serves error paths: it creates the context once and sets the header, so body and header match. A `frameworkErrors` handler makes an invalid URL return the envelope with `X-Request-ID`; before, Fastify's own body repeated the URL and had no header |
| F-03 (P1) | `RESPONSES.md` Sections 38 and 39 and its 12 error examples reconciled: `code` and `message` are top-level, `error` holds `details`, `retryable`, `field_errors` and optional `causes`; `field_errors` is no longer inside `details` |
| F-04 (P2) | `API_ARCHITECTURE.md` Sections 36 to 39 and 49 to 51 reconciled with the approved envelope, the server-generated request ID and registry codes |
| F-05 (P2) | SEC-GATE-009 links qualified on `KR-BE-1-006` and `KR-BE-1-007`; not removed, because merged commit trailers carry them. Removal stays an owner decision |
| F-06 (P2) | Request context classified as shared infrastructure (`KR-BE-1-002` Section 5.5) in a decision-record note, the file header and the README |
| F-07, F-08 (P2) | Handoff main revision and next steps refreshed; `KR-BE-1-006` narrative no longer calls the body provisional |
| Tests | 4 net new; suite 81. Node.js 24.21.0 transcript posted as a PR comment. Component tests only; BTS-032 is not satisfied |
| Open | AC-05 evidence and Security Owner disposition; owner reviews of 003 to 007; removal of the gate links; success codes per endpoint; `KR-BE-1-008` correlation |
| Independence | Written by Claude; the audit is AI inspection; no independent human review |
| Task status | Unchanged: In Review. Not Accepted |
| Not changed | Dependencies, lockfile, CI |

## 3AS. PB-046 — Follow-up Audit Fixes (Router Errors and Response Examples)

| Field | Value |
|---|---|
| Change ID | PB-046 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Follows | PB-045 |

Reason: the follow-up AI audit of PR #42 (`main` at `4ab6402`) found four new issues.

| Item | Disposition |
|---|---|
| N-01 (P2) | `handleFrameworkError` classifies a router error with `classifyError` instead of always reporting 400. An invalid URL stays 400 `INVALID_REQUEST`; an unrecognized framework error is 500 `INTERNAL_ERROR` with no framework text. The envelope and `X-Request-ID` assertions are kept |
| N-02 (P2) | `RESPONSES.md` Sections 50 and 53: `retryable` moved from `details` to `error` |
| N-03 (P2) | `RESPONSES.md` examples now use registry codes: `AUTHZ_RESOURCE_DENIED`, `IDEMPOTENCY_KEY_REUSED`, `UPSTREAM_TIMEOUT`, and `INVALID_REQUEST` with a `cursor` field error in place of `INVALID_CURSOR`. A scan finds no unregistered top-level code in an error example |
| N-04 | Documented in the README: a domain error such as 409, 412 or 422 must be mapped to its registry code by its module before the generic handler, otherwise it is `INTERNAL_ERROR`. Tests come with the first mapping |
| F-07 | Handoff main pointer refreshed to the PR #42 merge |
| Tests | 1 added; suite 82. Node.js 24.21.0 transcript posted as a PR comment. Component tests only; BTS-032 is not satisfied |
| Not changed | Other protocol documents with their own codes; dependencies; CI; task statuses |
| Independence | Written by Claude; the audit is AI inspection; no independent human review |

## 3AT. PB-047 — Planning Alignment Gap Report and Migration Contract

| Field | Value |
|---|---|
| Change ID | PB-047 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-046 |

Reason: the owner asked that the planning folder be aligned with `kritva-core` and `kritvaos-community`, with the planning documents moved to a root `planning/` directory.

| Item | Disposition |
|---|---|
| Added | `PLANNING_ALIGNMENT_GAP_REPORT.md`, `PLANNING_AUTHORITY_MATRIX.md` and `PLANNING_MIGRATION_PLAN.md` under `docs/planning/` |
| Scope | Conventions and shape; RaaS-specific controls kept; overlaps in `docs/tracking/`, `docs/tasks/` and `docs/milestones/` to be consolidated in later pull requests |
| Not changed | Any path, task status, decision, identifier, commit trailer, checker, dependency or CI file |
| Review | Drafted by Claude; reviewed by ChatGPT as AI inspection; the owner chose the scope and the move. No independent human review |

## 3AU. PB-048 — Checker Planning Root Configuration (Migration Step 2)

| Field | Value |
|---|---|
| Change ID | PB-048 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-047 |

Reason: step 2 of `PLANNING_MIGRATION_PLAN.md`. The documentation, traceability and approval checkers must work with the planning documents in either `docs/planning/` or a root `planning/` before the move, so the move is a separate and reversible change.

| Item | Disposition |
|---|---|
| Added | `scripts/docs/planning_root.py` (the one definition of the planning root) and `tests/planning_root/` (13 tests) |
| Changed | `check_docs.py`, `check_backend_traceability.py` and `check_backend_approvals.py` ask the module for the location. `check_docs.py` also scans a root `planning/` for links, titles, retired names and planning rules |
| Rule | Exactly one location may hold `backend/`. If both do, each checker fails with a message |
| Tooling | New `make planning-root-test`, part of `make check`, and one new step in the `docs-check` workflow |
| Not changed | Any document path, document content, status, identifier, decision or commit trailer. Nothing is moved. A real run gives the same results as before: docs-check 0 problems and 1811 warnings, 4 dossiers, 28 approval tests and 3 packages |
| Review | Written by Claude. No independent human review |

## 3AV. PB-049 — Move Planning to the Repository Root (Migration Step 3)

| Field | Value |
|---|---|
| Change ID | PB-049 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-048 |

Reason: step 3 of `PLANNING_MIGRATION_PLAN.md`, requested by the owner to match `kritva-core` and `kritvaos-community`, which keep active planning in a root `planning/` directory.

| Item | Disposition |
|---|---|
| Moved | All 67 tracked files of `docs/planning/` to `planning/`, with `git mv`, so their history follows. Nothing was renamed inside the tree and no file was split or merged |
| Rewritten | 59 relative Markdown links that crossed the old boundary, and the text `docs/planning` to `planning` in tracked Markdown files that point at the moved documents (the same references, new path). The rewrite script is in the patch folder for review. Earlier changelog entries, decision records, increment dossiers and tracking files received this mechanical path update only; their statements, statuses and dates are unchanged. Git history holds the original text |
| Not rewritten | PB-047 and PB-048 entries, which describe the old location |
| Added | A signpost `docs/planning/README.md`; a `docs-check` rule that reports a backticked reference to a Markdown file under `planning/` that does not exist |
| Unchanged | Task, decision, acceptance and gate statuses and identifiers; frozen phase names; official milestone dossiers under `docs/`; domain planning under `docs/backend/planning/` and the other domain `planning/` folders; commit trailers and commit-message sections of the increments; dependencies; CI |
| Results | docs-check 0 problems and 1811 warnings (baseline); traceability 4 dossiers, 0 problems; approvals 28 tests and 3 packages |
| Rollback | Revert this change. The checkers accept both locations |
| Review | Written by Claude. No independent human review |

## 3AW. PB-050 — Root Planning Entry Documents (Migration Step 4)

| Field | Value |
|---|---|
| Change ID | PB-050 |
| Date | 2026-10-11 |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Follows | PB-049 |

Reason: step 4 of `PLANNING_MIGRATION_PLAN.md`. `kritva-core` and `kritvaos-community` give their `planning/` directory a README with roles, a current plan, a review checklist and agent rules. Kritva RaaS had none at program level.

| Item | Disposition |
|---|---|
| Added | `README.md` (purpose, roles, hierarchy, authority, flow), `CURRENT_PLAN.md` (ordered next work, a view with no status), `REVIEW_CHECKLIST.md` (planning and implementation pull requests) and `AGENT_RULES.md` (rules for implementation agents), all under `planning/` |
| Source | Each rule comes from a document that already holds it: the session handoff, the increment commit contracts, the approval workflow, the authority matrix and the code review process. The documents add no requirement and say so |
| Changed | The authority matrix (two rows), the migration plan (progress line) and the signpost at `docs/planning/README.md` (one row) |
| Unchanged | Task, decision, acceptance and gate statuses and identifiers; frozen phase names; checkers; commit trailers; dependencies; CI |
| Review | Written by Claude. No independent human review |

## 4. Future Entries

Future changes must be added as separate entries and include:

- Change ID.
- Status.
- Owner role.
- Reason.
- Affected files.
- Source decisions or evidence.
- Impact on tasks, dependencies, gates, and estimates.
- Required review and approval.
- Implementation or verification evidence, where applicable.

Do not rewrite the historical PB-001 entry to imply that later implementation or acceptance evidence existed when the original planning baseline was recorded.
