# Backend Planning Changelog

## Document Control

| Field | Value |
|---|---|
| Document | Backend Planning Changelog |
| Path | `docs/planning/backend/BACKEND_CHANGELOG.md` |
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

1. `docs/planning/backend/README.md`
2. `docs/planning/backend/BACKEND_IMPLEMENTATION_PLAN.md`
3. `docs/planning/backend/BACKEND_TASK_REGISTER.md`
4. `docs/planning/backend/BACKEND_DEPENDENCY_MAP.md`
5. `docs/planning/backend/BACKEND_SECURITY_GATE.md`
6. `docs/planning/backend/BACKEND_TEST_STRATEGY.md`
7. `docs/planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md`
8. `docs/planning/backend/BACKEND_RISK_REGISTER.md`
9. `docs/planning/backend/BACKEND_RESOURCE_PLAN.md`
10. `docs/planning/backend/BACKEND_CHANGELOG.md`

These documents define the planning authority, implementation sequence, task mapping, dependency model, security gates, test strategy, acceptance criteria, backend-specific risks, and resource-planning approach.

The separate B-INC-001 SECURE FOUNDATION dossier is to be prepared and reviewed as a subsequent planning unit. Its acceptance is not implied by this entry.

### 3.2 Source Documents and Decisions

The baseline uses the following authoritative sources and supplied decisions.

| Source or decision | Baseline treatment |
|---|---|
| `docs/planning/PHASES.md` | Preserve the canonical P0 FOUNDATION through P8 PRODUCTION phase model |
| Existing B-M01 CONTROL PLANE milestone dossier | Preserve existing milestone scope and task IDs |
| Existing DB-M01 FOUNDATION milestone dossier | Preserve database milestone ownership and coordinate migration, persistence, and tenant-isolation requirements |
| Existing C-M01 FOUNDATION scope | Preserve cloud ownership of infrastructure, IAM, and secret-management integration |
| `docs/backend/architecture/BACKEND_ARCHITECTURE.md` | Use as the backend architecture authority |
| `docs/protocol/API_CONTRACT.md` | Use as the API contract authority |
| `docs/architecture/CODING_AGENT_INTEGRATION.md` | Preserve the coding-agent integration boundary and unresolved decision gates |
| `docs/security/SECRETS_MANAGEMENT.md` | Preserve secret-handling requirements |
| `docs/security/KEY_MANAGEMENT.md` | Preserve key-management requirements |
| `docs/development/TESTING_STRATEGY.md` | Align test planning with established project testing guidance |
| `docs/planning/RESOURCE_PLAN.md`, Section 23.2 | Keep staffing, hiring, cost, time-phased allocation, and approval commitments TBD until their designated owners approve the records |
| `docs/tracking/RISK_REGISTER.md` | Use the existing program risk IDs and ownership; create backend-specific risks only for distinct backend implementation exposure |
| Existing B-M01 `TASKS.md` | Reuse existing task IDs and estimates; do not create replacement IDs for established tasks |

### 3.3 Frozen Planning Decisions

The following decisions and constraints form the proposed baseline:

1. Canonical phase labels must use the `PN NAME` form defined by `docs/planning/PHASES.md`.
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

The baseline follows Section 23.2 of `docs/planning/RESOURCE_PLAN.md`.

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

Affected files: the eight files in `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/` (MILESTONE, TASKS, ACCEPTANCE_CRITERIA, REVIEW_CHECKLIST, TEST_PLAN, SECURITY_REVIEW, CHANGELOG, GIT_COMMIT_STEP).

Traceability correction: the first draft of the increment dossier cited `BAC-*`, `BTS-*` and `SEC-GATE-*` IDs by number without matching their definitions. For example, AC-04 configuration validation cited request-context tests, and AC-16 local secret scanning cited the platform-catalog contract test. The review corrected the traces as follows:

1. `ACCEPTANCE_CRITERIA.md` is the single source for each increment criterion's `BAC-*`, `BTS-*` and `SEC-GATE-*` trace, and every trace was re-matched to the definition in `BACKEND_ACCEPTANCE_CRITERIA.md`, `BACKEND_TEST_STRATEGY.md` or `BACKEND_SECURITY_GATE.md`.
2. In `TASKS.md`, each task's linked tests and security gates are derived from its linked acceptance criteria.
3. The `TEST_PLAN.md` test matrix and the `SECURITY_REVIEW.md` threat traces were regenerated from `ACCEPTANCE_CRITERIA.md`.

Validation: the documentation checker reports 0 errors. The new ID namespaces (`KR-BINC-001-*`, `R-BE-*`, `BAC-*`, `BTS-*`, `SEC-GATE-*`, `B-INC-001-*`) do not occur outside `docs/planning/backend/`.

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
| Both checks required for `main` | Not configured. Rechecked on 2026-10-10 after the negative run: `GET /repos/KritvaOS/kritva-raas/branches/main` returns `protected: false` with no required status checks, and `GET /repos/KritvaOS/kritva-raas/rules/branches/main` returns no rules. | Owner action: add a branch protection rule or ruleset for `main` requiring `source-header-check` and `docs-check`, then record the evidence here. |

`main` at `846840f` is also green (Source Header Check run 38052473705, docs-check run 38052473699).

`KR-BINC-001-018`, `B-INC-001-AC-21` and `BAC-039` stay open until branch protection requires both checks on `main` and that is verified through the API.

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
