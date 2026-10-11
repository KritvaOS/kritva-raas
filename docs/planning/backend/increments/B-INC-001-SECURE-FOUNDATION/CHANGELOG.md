# B-INC-001 — Secure Foundation Changelog

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 Secure Foundation Changelog |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/CHANGELOG.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Increment test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Commit procedure](GIT_COMMIT_STEP.md)
- [Program changelog](../../BACKEND_CHANGELOG.md)
- [Program task register](../../BACKEND_TASK_REGISTER.md)
- [Program security gate](../../BACKEND_SECURITY_GATE.md)
- [B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## Change Recording Rules

1. Record changes to this increment dossier and implementation in chronological order, newest first.
2. Each implementation entry must reference one or more task IDs (`KR-BE-1-xxx` or `KR-BINC-001-nnn`) and, where relevant, increment AC, canonical test, security-gate, and finding IDs.
3. Record actual commit SHAs only after the commits exist and have been verified.
4. Separate **planned**, **implemented**, **verified**, **reviewed**, and **accepted** states.
5. Do not describe a check as passing without recorded evidence.
6. Do not include secrets, private keys, credentials, or secret-bearing logs in this file.
7. Record a secret exposure as a sanitized incident reference, not by reproducing the value.
8. Program-level policy changes belong in the relevant program document and `../../BACKEND_CHANGELOG.md`; this file records the increment-specific impact and links to the authoritative change.

## Change History

### Unreleased — B-INC-001 SECURE FOUNDATION

**Status:** Planning dossier prepared; implementation and security verification not asserted.

#### Scope

- Define the secure backend runtime and technology decision process.
- Define configuration, validation, and safe startup behaviour.
- Define secret-handling rules, ignore rules, safe examples, scanner operation, and blocking CI expectations.
- Define repository-history assessment and leak response.
- Define structured logging and sensitive-value redaction requirements.
- Define test execution, security review, and evidence retention.
- Define atomic commit and pre-commit verification requirements.

#### Traceability

- Existing implementation tasks: `KR-BE-1-001` through `KR-BE-1-009`, and `KR-BE-1-041`.
- New increment tasks: `KR-BINC-001-001` through `KR-BINC-001-019`.
- Increment acceptance: `B-INC-001-AC-01` through `B-INC-001-AC-21`.
- Program acceptance namespace: `BAC-001` through `BAC-039`.
- Program test namespace: `BTS-001` through `BTS-037`.
- Program security-gate namespace: `SEC-GATE-001` through `SEC-GATE-013`.

The exact task-to-program-ID relationships are governed by `TASKS.md` and the canonical program registers. Do not treat the presence of an ID here as evidence that its criterion has passed.

#### Known Verification Items

- Inspect the current `docs/development/DEVELOPMENT_SETUP.md` and its history to resolve the previously reported credential-shaped PostgreSQL URL.
- Verify the current `.gitignore` and scanner configuration.
- Verify the required CI workflow exists and fails on a confirmed synthetic secret finding.
- Execute the documented history scan and record its scope and finding disposition.
- Execute available tests and clean-checkout verification.
- Complete the security review and record the applicable `SEC-GATE-*` statuses.

#### Decision Status

Runtime, language, package manager, HTTP framework, migration tooling, and secret scanner remain open pending approved decision records. Recommendations are not treated as decisions.

#### Commit and Evidence Status

| Item | Status |
|---|---|
| Planning documents | Prepared for repository validation |
| Implementation | Not asserted by this changelog |
| Secret scan | Results pending current execution |
| History scan | Results pending current execution |
| Tests and lint | Run where available; results pending evidence |
| CI enforcement | Must be verified from workflow and required-check settings |
| Security review | Not reviewed |
| Increment acceptance | Not accepted |

### 2026-10-11 — Canonical REST API v1 error envelope decided

- **State:** DECISION APPROVED (documents reconciled; no implementation)
- **Tasks:** None (decision input for KR-BE-1-007, which stays Proposed)
- **Increment ACs:** B-INC-001-AC-08 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-007 (NOT RUN against the final contract)
- **Security gates:** SEC-GATE-009 (not closed; the gate mapping is flagged for the owner)
- **Findings/risks:** The envelope needs a request ID, which the transport does not have yet (`KR-BE-1-005`). Success-response wrapping is undecided. Three registry additions are proposed, not approved. The AI design inspection that recommended the option is not an independent review
- **Files changed:** `decisions/KR-BE-1-007-error-envelope.md` (new), `docs/protocol/API_CONTRACT.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged

### 2026-10-11 — KR-BE-1-006 API v1 routing

- **State:** IN REVIEW (implementation delivered; not accepted)
- **Tasks:** KR-BE-1-006 (In Review)
- **Increment ACs:** B-INC-001-AC-06 (partly evidenced; not satisfied), B-INC-001-AC-08 (not touched)
- **Program acceptance:** Not applicable
- **Tests:** BTS-007, BTS-032 (15 routing tests added; sandbox run on Node.js 22 is feasibility only; Node.js 24.21.0 run posted by the delivery script)
- **Security gates:** SEC-GATE-009 (not closed)
- **Findings/risks:** The router let a trailing slash match a path parameter with an empty value; paths are now matched exactly. The `routes` option of `KR-BE-1-004` is replaced by `groups`; no caller outside tests used it. The error body stays provisional. No independent review
- **Files changed:** `apps/backend/src/transport/api-v1.ts` (new), `http-server.ts`, `tests/transport/api-v1.test.ts` (new), `http-server.test.ts`, `lifecycle.test.ts`, `README.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged

### 2026-10-11 — KR-BE-1-003 hostname validation fix after review

- **State:** IN REVIEW (fix; not accepted)
- **Tasks:** KR-BE-1-003 (In Review)
- **Increment ACs:** B-INC-001-AC-04 (non-secret settings evidenced; not satisfied), B-INC-001-AC-05 (not demonstrated)
- **Program acceptance:** Not applicable
- **Tests:** BTS-002 (hostname cases added; sandbox run on Node.js 22 is feasibility only; Node.js 24.21.0 run posted by the delivery script)
- **Security gates:** SEC-GATE-008 (not closed)
- **Findings/risks:** ChatGPT (AI design inspection, `main` at `777f23f`, not an independent human review) found that `KRITVA_HTTP_HOST` accepted `api..internal` and `api.-internal`; fixed. AC-05 evidence is still open
- **Files changed:** `apps/backend/src/config/config.ts`, `tests/config/config.test.ts`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged

### 2026-10-11 — KR-BE-1-003 configuration boundary (non-secret settings)

- **State:** IN REVIEW (partial implementation; not accepted)
- **Tasks:** KR-BE-1-003 (In Review)
- **Increment ACs:** B-INC-001-AC-04 (non-secret settings evidenced; not satisfied), B-INC-001-AC-05 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-002 (13 config tests and 5 startup tests written; sandbox run on Node.js 22 is feasibility only), BTS-003 and BTS-010 (NOT RUN)
- **Security gates:** SEC-GATE-003, SEC-GATE-008 (not closed)
- **Findings/risks:** Started before `KR-BINC-001-005` is approved and before `KR-BINC-001-007`; only non-secret settings are implemented. Unknown `KRITVA_` names are rejected. `.env.example` holds placeholders and defaults only. Package list reviewed in the delivery transcript
- **Files changed:** `apps/backend/src/config/config.ts`, `src/run.ts`, `src/main.ts`, `tests/config/config.test.ts`, `tests/run.test.ts`, `.env.example`, `README.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged

### 2026-10-11 — KR-BINC-001-005 approval package requested

- **State:** REQUESTED (package workflow status; decision still Proposed)
- **Tasks:** KR-BINC-001-005 (In Review)
- **Increment ACs:** B-INC-001-AC-04, B-INC-001-AC-12, B-INC-001-AC-14 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-002, BTS-003, BTS-009, BTS-010 (NOT RUN)
- **Security gates:** SEC-GATE-002, SEC-GATE-008, SEC-GATE-009 (not closed)
- **Findings/risks:** The Backend Technical Lead states the review requests were emailed to the Security Owner and the Cloud/Infrastructure Owner on 2026-10-11; the emails are not in the repository and no reply is recorded. The Git-history finding stays with the Security Owner
- **Files changed:** `decisions/approvals/APPROVAL-KR-BINC-001-005-secret-handling.md`, `decisions/README.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged

### 2026-10-11 — KR-BE-1-004 HTTP transport implemented

- **State:** IN REVIEW (implementation delivered; not accepted)
- **Tasks:** KR-BE-1-004 (In Review)
- **Increment ACs:** B-INC-001-AC-06 (partly evidenced; not satisfied until review and the Node.js 24.21.0 run)
- **Program acceptance:** Not applicable
- **Tests:** BTS-007, BTS-032 (19 node:test cases written; sandbox run on Node.js 22 is feasibility only; the Node.js 24.21.0 run is posted as a PR comment by the delivery script)
- **Security gates:** Not applicable
- **Findings/risks:** Fastify's default validator coerces types and removes unknown properties; both are switched off and tested. Error envelope differs between `API_CONTRACT.md` and `RESPONSES.md`/`ERROR_CODES.md` (`KR-BE-1-007`). `main.ts` does not open a port until configuration exists (`KR-BE-1-003`). No independent review
- **Files changed:** `apps/backend/package.json`, `apps/backend/package-lock.json`, `apps/backend/src/transport/*`, `apps/backend/tests/transport/*`, `apps/backend/README.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged

### 2026-10-11 — KR-BINC-001-003 HTTP framework approved

- **State:** DECISION APPROVED (task In Review, not accepted)
- **Tasks:** KR-BINC-001-003
- **Increment ACs:** B-INC-001-AC-03, B-INC-001-AC-06 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-004, BTS-007, BTS-032 (NOT RUN)
- **Security gates:** Not applicable
- **Findings/risks:** Compatibility of Fastify with Node.js 24.21.0 is shown in `KR-BE-1-004`; no independent review
- **Files changed:** `decisions/KR-BINC-001-003-http-framework.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** The decision record Sections 3 and 8
- **Reviewer role:** Backend Technical Lead (approver)
- **Decision and follow-up:** See PB-035. Next: `KR-BE-1-004` adds Fastify and shows the route on the pinned runtime

### 2026-10-11 — KR-BINC-001-003 HTTP framework decision record

- **State:** PROPOSED (recommendation written; owner approval pending)
- **Tasks:** KR-BINC-001-003 (In Review)
- **Increment ACs:** B-INC-001-AC-03, B-INC-001-AC-06 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-004, BTS-007, BTS-032 (NOT RUN; a sandbox route check under Node.js 22 is feasibility only)
- **Security gates:** Not applicable
- **Findings/risks:** Fastify declares no `engines`, so pinned-runtime compatibility is shown in `KR-BE-1-004`. The route body type is a cast, not derived from the schema
- **Files changed:** `decisions/KR-BINC-001-003-http-framework.md` (new), `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** The decision record Section 3
- **Reviewer role:** Backend Technical Lead
- **Decision and follow-up:** See PB-034. Next: the owner approves or returns it

### 2026-10-11 — KR-BE-1-002 decision approved

- **State:** DECISION APPROVED (task In Review, not accepted)
- **Tasks:** KR-BE-1-002
- **Increment ACs:** B-INC-001-AC-02, B-INC-001-AC-03 (AC-03 not closed by this record alone)
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-004 (design review only; no automated enforcement)
- **Security gates:** SEC-GATE-003 (not closed)
- **Findings/risks:** Re-review found no new blocker; follow-up constraints for `KR-BE-1-019`, `-032`, `-033`, `-034`; foreign-key policy with the Database Technical Lead; increments after B-INC-004 not reconciled
- **Files changed:** `decisions/KR-BE-1-002-module-boundaries.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** Decision record Sections 10, 11 and 12
- **Reviewer role:** Architecture Owner (approver, also author of the direction); ChatGPT (independent AI review)
- **Decision and follow-up:** See PB-033. Task acceptance is a separate record

### 2026-10-11 — KR-BE-1-002 decision revised after the BTS-004 review

- **State:** PROPOSED (revision 2; re-review pending)
- **Tasks:** KR-BE-1-002 (In Progress)
- **Increment ACs:** B-INC-001-AC-02, B-INC-001-AC-03 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-004 (NOT RUN as passing; review returned for revision)
- **Security gates:** SEC-GATE-003 (not closed)
- **Findings/risks:** Four reviewer blockers (reservation, inventory and run-state ownership; Audit as event consumer) answered in revision 2 and not re-reviewed. Later increments beyond B-INC-004 are not reconciled
- **Files changed:** `decisions/KR-BE-1-002-module-boundaries.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** Decision record Sections 11 and 12
- **Reviewer role:** Architecture Owner (author); ChatGPT (independent review)
- **Decision and follow-up:** See PB-032. Next: re-review of revision 2, owner confirmation of the two choices, then the decision is recorded

### 2026-10-11 — KR-BE-1-002 module boundaries decision record

- **State:** PROPOSED (decision record written; review pending)
- **Tasks:** KR-BE-1-002 (In Progress)
- **Increment ACs:** B-INC-001-AC-02, B-INC-001-AC-03 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-004 (NOT RUN)
- **Security gates:** SEC-GATE-003 (not closed)
- **Findings/risks:** The tier table had Identity and Organizations in one tier while Organizations depends on Identity; fixed by splitting them (ten tiers). Foreign-key policy is with the Database Technical Lead
- **Files changed:** `decisions/KR-BE-1-002-module-boundaries.md` (new), `plans/KR-BE-1-002-module-boundaries-plan.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** The decision record and the owner answers in its Section 3
- **Reviewer role:** Architecture Owner (author); independent reviewer to be named
- **Decision and follow-up:** See PB-031. Next: the independent review, then the Architecture Owner records the decision

### 2026-10-11 — KR-BE-1-002 module boundaries plan

- **State:** PLANNED (no decision, no code)
- **Tasks:** KR-BE-1-002 (Proposed, not started)
- **Increment ACs:** B-INC-001-AC-02, B-INC-001-AC-03 (not satisfied)
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-004 (NOT RUN)
- **Security gates:** SEC-GATE-003 (not closed)
- **Findings/risks:** Overlaps found in the architecture: credit plan ownership, resource inventory, job state authority, event declaration, cross-module foreign keys
- **Files changed:** `plans/KR-BE-1-002-module-boundaries-plan.md` (new), `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** The plan
- **Reviewer role:** Architecture Owner
- **Decision and follow-up:** See PB-030. The Architecture Owner answers the nine questions, then the decision record is written

### 2026-10-11 — KR-BE-1-001 accepted

- **State:** ACCEPTED (task only; no gate or acceptance criterion closed)
- **Tasks:** KR-BE-1-001
- **Increment ACs:** B-INC-001-AC-01, B-INC-001-AC-02 (remain open; other tasks contribute)
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-036 (evidence recorded in PB-028; no reviewer re-review of the fixes)
- **Security gates:** SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 (none closed)
- **Findings/risks:** Acceptance is by the Backend Technical Lead, who is also the owner who directed the work
- **Files changed:** `TASKS.md`, `evidence/KR-BE-1-001-evidence.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `evidence/KR-BE-1-001-evidence.md`
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-029. Next tasks: KR-BE-1-002 (module boundaries), then decisions KR-BINC-001-003 and -004

### 2026-10-11 — Evidence and BTS-036 review record (KR-BE-1-001)

- **State:** IN REVIEW (evidence recorded; not accepted)
- **Tasks:** KR-BE-1-001
- **Increment ACs:** B-INC-001-AC-01, B-INC-001-AC-02
- **Program acceptance:** Not applicable
- **Tests:** BTS-001 (clean-checkout run on `ffc42d1`, all steps exit 0), BTS-036 (review returned changes required; findings dispositioned; no re-review yet)
- **Security gates:** SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 (none closed; contributions recorded)
- **Findings/risks:** Reviewer blockers fixed or recorded; `runtimeInfo` accepts malformed input by design of a scaffold helper
- **Files changed:** `evidence/KR-BE-1-001-evidence.md` (new), `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `evidence/KR-BE-1-001-evidence.md`
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-028. Acceptance by the Backend Technical Lead is a separate step

### 2026-10-11 — Node.js pin moved to the repository root (KR-BE-1-001)

- **State:** IMPLEMENTED (correction after the BTS-036 review; evidence not yet recorded)
- **Tasks:** KR-BE-1-001
- **Increment ACs:** B-INC-001-AC-01, B-INC-001-AC-02
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-036 (review returned changes required; re-run and disposition recorded in the next change)
- **Security gates:** SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 (none closed)
- **Findings/risks:** Reviewer blockers: pin file location (fixed here) and exact tested tree in the evidence (re-run after this change merges); see `../../BACKEND_CHANGELOG.md` PB-027
- **Files changed:** `.node-version` (moved from `apps/backend`), `apps/backend/README.md`, `plans/KR-BE-1-001-application-structure-plan.md`, `TASKS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** Review text of 2026-10-11, to be recorded in full in the next change
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-027

### 2026-10-11 — Application structure scaffold (KR-BE-1-001)

- **State:** IMPLEMENTED (code; evidence with the pinned toolchain not recorded yet)
- **Tasks:** KR-BE-1-001
- **Increment ACs:** B-INC-001-AC-01, B-INC-001-AC-02
- **Program acceptance:** Not applicable
- **Tests:** BTS-001, BTS-036 (NOT RUN as task evidence; a sandbox run of typecheck, build and the test passed under Node.js 22 and is not task evidence)
- **Security gates:** SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 (none closed; contribution per plan Section 6.1)
- **Findings/risks:** The lockfile is generated by the delivery script on the owner's machine with the official Node.js 24.21.0; see `../../BACKEND_CHANGELOG.md` PB-026
- **Files changed:** `apps/backend/*` (new), `TASKS.md`, `plans/KR-BE-1-001-application-structure-plan.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** Plan Section 6 evidence is collected by the delivery script and recorded in a later change
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-026

### 2026-10-11 — KR-BE-1-001 prerequisites recorded

- **State:** PLANNED (documentation; task moved to Ready, not started)
- **Tasks:** None (status and plan update for KR-BE-1-001, which has no code yet)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** `DEVELOPMENT_SETUP.md` still shows a root pnpm and turbo layout until `KR-BINC-001-016`; see `../../BACKEND_CHANGELOG.md` PB-025
- **Files changed:** `TASKS.md`, `plans/KR-BE-1-001-application-structure-plan.md`, `decisions/IMPLEMENTATION_READINESS.md`, both decision records and both approval packages (stale "stays blocked" wording), `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-025

### 2026-10-11 — Runtime and package manager decisions approved

- **State:** IMPLEMENTED (documentation; decisions approved; no task accepted)
- **Tasks:** None (approval of decision records for KR-BINC-001-001 and KR-BINC-001-002, which stay In Review)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable (the linked tests are NOT RUN)
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** The approver is also the repository owner who directed the recommendation; see `../../BACKEND_CHANGELOG.md` PB-024
- **Files changed:** both decision records, both approval packages, `TASKS.md`, `plans/KR-BE-1-001-application-structure-plan.md`, `decisions/IMPLEMENTATION_READINESS.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-024

### 2026-10-11 — Owner direction on pin method, framework candidate and migration tool shortlist

- **State:** PLANNED (documentation; no task status change)
- **Tasks:** None (direction recorded for KR-BINC-001-001, which stays In Review; KR-BINC-001-003 and KR-BINC-001-004 are not started)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** graphile-migrate stable release dates from 2022; dbmate ships a native binary; see `../../BACKEND_CHANGELOG.md` PB-023
- **Files changed:** `decisions/KR-BINC-001-001-runtime-language.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-023

### 2026-10-11 — Node.js release signing key authenticated

- **State:** PLANNED (documentation; no task status change)
- **Tasks:** None (evidence recorded for KR-BINC-001-001 and KR-BINC-001-002, which stay In Review)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable (decision evidence, not task tests)
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** The key has no web-of-trust certification; see `../../BACKEND_CHANGELOG.md` PB-022
- **Files changed:** `decisions/KR-BINC-001-001-runtime-language.md`, `decisions/KR-BINC-001-002-package-manager-lockfile.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-002-package-manager.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-022

### 2026-10-11 — Official Node.js distribution and bundled npm evidence

- **State:** PLANNED (documentation; no task status change)
- **Tasks:** None (evidence recorded for KR-BINC-001-001 and KR-BINC-001-002, which stay In Review)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable (the checks run are decision evidence from a disposable project, not task tests)
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** The release signature was not verified; see `../../BACKEND_CHANGELOG.md` PB-021
- **Files changed:** `decisions/KR-BINC-001-001-runtime-language.md`, `decisions/KR-BINC-001-002-package-manager-lockfile.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-002-package-manager.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-021

### 2026-10-11 — Runtime pin proposal and TypeScript scope

- **State:** PLANNED (documentation; no task status change)
- **Tasks:** None (recommendation and scope change for KR-BINC-001-001, which stays In Review)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** Official checksum verification and the bundled npm check are still outstanding; see `../../BACKEND_CHANGELOG.md` PB-020
- **Files changed:** `decisions/KR-BINC-001-001-runtime-language.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-020

### 2026-10-11 — Approval package pointers corrected after the second re-audit

- **State:** IMPLEMENTED (documentation; no task status change)
- **Tasks:** None (corrections after the second external re-audit, `main` at `8f1964d`)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** The 005 package and record pointed to the superseded rescan in `BACKEND_SECURITY_GATE.md` 4.2.1 and said no scan result existed to review; see `../../BACKEND_CHANGELOG.md` PB-019. The Git-history exposure assessment remains pending with the Security Owner
- **Files changed:** `decisions/KR-BINC-001-005-secret-handling-configuration.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-005-secret-handling.md`, `../../BACKEND_SECURITY_GATE.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** Pending until this change is merged
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-019. The review requests to the two owners follow after this merges

### 2026-10-11 — Audit follow-up corrections

- **State:** IMPLEMENTED (documentation; no task status change)
- **Tasks:** None (corrections after the external re-audit of `main` at `f7483db`)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** Re-audit findings N-01 to N-04 addressed; the Git-history exposure assessment remains pending with the Security Owner; see `../../BACKEND_CHANGELOG.md` PB-018
- **Files changed:** `../../BACKEND_SECURITY_GATE.md`, `decisions/KR-BINC-001-005-secret-handling-configuration.md`, `CHANGELOG.md`, `../../BACKEND_CHANGELOG.md`, `claude/Handoff.md`
- **Commit:** `930e3ed`, merged in PR #15 (merge `8f1964d`)
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-018. The review requests to the two owners follow after this merges

### 2026-10-11 — KR-BE-1-001 implementation plan added

- **State:** PLANNED (documentation; no task status change)
- **Tasks:** None (plan for KR-BE-1-001, which stays Blocked)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** Three owner questions are open; see `../../BACKEND_CHANGELOG.md` PB-017
- **Files changed:** `plans/KR-BE-1-001-application-structure-plan.md`, `../../BACKEND_CHANGELOG.md`, `CHANGELOG.md`
- **Commit:** `cfbd051`, merged in PR #13 (merge `f8a875e`)
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-017

### 2026-10-11 — Secret-handling pre-approval corrections

- **State:** IMPLEMENTED (documentation; no task status change)
- **Tasks:** None (corrections to the KR-BINC-001-005 record and approval package)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** Independent review findings SH-01 to SH-06 addressed; the Git-history exposure assessment remains pending with the Security Owner; see `../../BACKEND_CHANGELOG.md` PB-016
- **Files changed:** `decisions/KR-BINC-001-005-secret-handling-configuration.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-005-secret-handling.md`, `../../BACKEND_SECURITY_GATE.md`, `../../BACKEND_CHANGELOG.md`, `CHANGELOG.md`
- **Commit:** `8ce6d01`, merged in PR #12 (merge `b74eda2`)
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-016. The review requests to the two owners follow after this merges

### 2026-10-11 — Credential-shaped example removed and rescan recorded

- **State:** IMPLEMENTED (documentation; no task status change)
- **Tasks:** None (security record correction)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** External audit finding 4 addressed. The literal remains in Git history; the Security Owner is asked to assess exposure; see `../../BACKEND_CHANGELOG.md` PB-015
- **Files changed:** `../../BACKEND_SECURITY_GATE.md`, `../../BACKEND_CHANGELOG.md`, `CHANGELOG.md`
- **Commit:** `93ffb58`, merged in PR #11 (merge `aa7aeb2`)
- **Evidence:** `make check` results recorded in the commit message; sanitized rescan in the security gate record section 4.2.1
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-015

### 2026-10-11 — Runtime compatibility evidence recorded

- **State:** IMPLEMENTED (documentation; no task status change)
- **Tasks:** None (evidence for KR-BINC-001-001, which stays In Review)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable (a sandbox check is recorded, no task test is advanced)
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** External audit finding 2 addressed; approval now waits for the Section 6 evidence. Open: pin method, checksum verification, package manager support; see `../../BACKEND_CHANGELOG.md` PB-014
- **Files changed:** `decisions/KR-BINC-001-001-runtime-language.md`, `../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md`, `../../BACKEND_CHANGELOG.md`, `CHANGELOG.md`
- **Commit:** `45eb1f7`, merged in PR #10 (merge `268b7b1`)
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-014

### 2026-10-11 — Approval checker consistency hardened

- **State:** IMPLEMENTED (validation tooling; no task status change)
- **Tasks:** None (validation tooling for the approval workflow)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable (the checker has its own unit tests; no task test is advanced)
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** External audit finding 1 (an Approved record could carry a Rejected, Returned or missing required approver) addressed; see `../../BACKEND_CHANGELOG.md` PB-013
- **Files changed:** `scripts/docs/check_backend_approvals.py`, `tests/backend_approvals/test_check_backend_approvals.py`, `scripts/docs/README.md`, `../../decisions/README.md`, `../../BACKEND_CHANGELOG.md`
- **Commit:** `cfee362`, merged in PR #9 (merge `c534804`)
- **Evidence:** `make check` results recorded in the commit message
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-013. The runtime compatibility evidence and the credential-shaped example fix follow as separate changes

### 2026-10-10 — Backend decision-approval packages and checker added

- **State:** IMPLEMENTED (documentation and validation tooling; no task status change)
- **Tasks:** None (cross-task approval workflow and its checker)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable (the new checker has its own unit tests; no task test is advanced)
- **Security gates:** Not applicable (no gate is closed)
- **Findings/risks:** Not assessed beyond the compatibility metadata in the runtime approval package
- **Files changed:** `../../decisions/` (README and three approval packages), `scripts/docs/check_backend_approvals.py`, `tests/backend_approvals/`, `Makefile`, `.github/workflows/docs-check.yml`, `decisions/IMPLEMENTATION_READINESS.md`, the three decision records (link only), `../../BACKEND_CHANGELOG.md` PB-012
- **Commit:** `63d9da9`, `7a9d21a` and `7a97fd2`, merged in PR #7 (merge `13c5a91`)
- **Evidence:** `make check` results recorded in the commit messages
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-012. `KR-BINC-001-001`, `KR-BINC-001-002` and `KR-BINC-001-005` stay In Review and their records stay Proposed. The packages are Draft until sent to the approvers

### 2026-10-10 — PR #5 follow-up: record references and planning-commit rule

- **State:** IMPLEMENTED (documentation correction; no task status change)
- **Tasks:** None (record correction and process rule)
- **Increment ACs:** Not applicable
- **Program acceptance:** Not applicable
- **Tests:** Not applicable
- **Security gates:** Not applicable
- **Findings/risks:** External audit of PR #5 found no reason to revert it and listed five follow-up items, all addressed here or tracked in `../../BACKEND_CHANGELOG.md` PB-011
- **Files changed:** `CHANGELOG.md`, `GIT_COMMIT_STEP.md` Section 4.1, `decisions/IMPLEMENTATION_READINESS.md`, `../../BACKEND_CHANGELOG.md`
- **Commit:** `d28f506` and `abeef74`; merged in PR #6 as `8bc4558`
- **Evidence:** `make check` results recorded in the commit messages; source-header-check runs 114264977321 and 114265167987 and docs-check runs 114264978332 and 114265167849 on head `abeef74` succeeded
- **Reviewer role:** Repository owner
- **Decision and follow-up:** See PB-011. The PR title and description were left at the default values, so this entry is the tracking record

### 2026-10-10 — KR-BINC-001-002 package manager recommendation proposed

- **State:** IMPLEMENTED (decision record Proposed; not approved)
- **Tasks:** `KR-BINC-001-002`
- **Increment ACs:** `B-INC-001-AC-01`, `B-INC-001-AC-02`
- **Program acceptance:** Not assessed
- **Tests:** `BTS-001`, `BTS-036` — NOT RUN (decision record only)
- **Security gates:** `SEC-GATE-003`, `SEC-GATE-004`, `SEC-GATE-013` — not assessed
- **Findings/risks:** Lockfile and clean-install behavior not yet demonstrated (record Section 6)
- **Files changed:** `decisions/KR-BINC-001-002-package-manager-lockfile.md`; `TASKS.md` status
- **Commit:** `2341ffd`, merged in PR #5 (merge `914e555`)
- **Evidence:** npm registry and Node.js release list queried 2026-10-10 (record Section 3). PR #5 required checks on head `2341ffd`: Source Header Check run 38068101282, docs-check run 38068101275; on `main` after the merge: Source Header Check run 38068170548, docs-check run 38068170376.
- **Reviewer role:** Backend Technical Lead (approval pending; depends on `KR-BINC-001-001`)
- **Decision and follow-up:** Recommend npm with a committed `package-lock.json` and `npm ci`; pnpm is the alternative. `KR-BINC-001-008` is on hold pending its comparative evaluation and is not the next commit.

### 2026-10-10 — KR-BINC-001-001 runtime and language recommendation proposed

- **State:** IMPLEMENTED (decision record Proposed; not approved)
- **Tasks:** `KR-BINC-001-001`
- **Increment ACs:** `B-INC-001-AC-01`
- **Program acceptance:** Not assessed
- **Tests:** `BTS-001`, `BTS-036` — NOT RUN (decision record only)
- **Security gates:** `SEC-GATE-004`, `SEC-GATE-013` — not assessed
- **Findings/risks:** Compatibility of the later toolchain with the proposed versions is not yet verified (record Section 6)
- **Files changed:** `decisions/KR-BINC-001-001-runtime-language.md`; `TASKS.md` status
- **Commit:** `681abf0`, merged in PR #5 (merge `914e555`)
- **Evidence:** Node.js release schedule and npm registry queried 2026-10-10 (record Section 3). PR #5 required checks on head `2341ffd`: Source Header Check run 38068101282, docs-check run 38068101275; on `main` after the merge: Source Header Check run 38068170548, docs-check run 38068170376.
- **Reviewer role:** Backend Technical Lead (approval pending)
- **Decision and follow-up:** Recommend Node.js 24 LTS and TypeScript 6.0.3 as the baseline, with TypeScript 7.0.2 as an upgrade candidate after a compatibility check. Node.js 26 is the alternative after it enters LTS on 2026-10-28. Next: owner approval of `KR-BINC-001-001` with the compatibility check, then `KR-BINC-001-002`.

### 2026-10-10 — KR-BINC-001-005 secret-handling policy proposed

- **State:** IMPLEMENTED (decision record Proposed; not reviewed or accepted)
- **Tasks:** `KR-BINC-001-005`
- **Increment ACs:** `B-INC-001-AC-04`, `B-INC-001-AC-12`, `B-INC-001-AC-14`
- **Program acceptance:** Not assessed
- **Tests:** `BTS-002`, `BTS-003`, `BTS-009`, `BTS-010` — NOT IMPLEMENTED (policy only; the implementing tasks provide the tests)
- **Security gates:** `SEC-GATE-002`, `SEC-GATE-008`, `SEC-GATE-009` — not assessed
- **Findings/risks:** Not assessed
- **Files changed:** `decisions/KR-BINC-001-005-secret-handling-configuration.md`; `TASKS.md` status
- **Commit:** `d82d0d6`, merged in PR #5 (merge `914e555`)
- **Evidence:** `check_docs.py` and `check_backend_traceability.py` results recorded in the commit. PR #5 required checks on head `2341ffd`: Source Header Check run 38068101282, docs-check run 38068101275; on `main` after the merge: Source Header Check run 38068170548, docs-check run 38068170376.
- **Reviewer role:** Security Owner; Cloud/Infrastructure Owner review (pending)
- **Decision and follow-up:** Policy proposed. Next: Security Owner approval and Cloud/Infrastructure Owner review. `KR-BINC-001-008` is on hold pending its comparative evaluation.

### 2026-10-10 — Batch A decisions and readiness planned

- **State:** PLANNED (planning record merged; no task status change)
- **Tasks:** None. The record plans `KR-BINC-001-001`, `KR-BINC-001-002`, `KR-BINC-001-005` and `KR-BINC-001-008`
- **Increment ACs:** `B-INC-001-AC-01`, `B-INC-001-AC-02`, `B-INC-001-AC-04`, `B-INC-001-AC-12`, `B-INC-001-AC-14`, `B-INC-001-AC-16`
- **Program acceptance:** Not assessed
- **Tests:** `BTS-001`, `BTS-002`, `BTS-003`, `BTS-009`, `BTS-010`, `BTS-036` — NOT RUN (planning only)
- **Security gates:** `SEC-GATE-002`, `SEC-GATE-003`, `SEC-GATE-004`, `SEC-GATE-008`, `SEC-GATE-009`, `SEC-GATE-010`, `SEC-GATE-013` — not assessed
- **Findings/risks:** Not assessed
- **Files changed:** `decisions/IMPLEMENTATION_READINESS.md`; see `../../BACKEND_CHANGELOG.md` PB-010
- **Commit:** `c815f5b`, merged in PR #5 (merge `914e555`)
- **Evidence:** `check_docs.py` and `check_backend_traceability.py` results recorded in the commit. PR #5 required checks on head `2341ffd`: Source Header Check run 38068101282, docs-check run 38068101275; on `main` after the merge: Source Header Check run 38068170548, docs-check run 38068170376.
- **Reviewer role:** External review; owner approval pending
- **Decision and follow-up:** Readiness is Blocked for stack-dependent implementation until `KR-BINC-001-001` and `KR-BINC-001-002` are approved. `KR-BINC-001-008` is held out of the first commit series until a comparative scanner evaluation is done. Batch B covers `KR-BINC-001-003` and `KR-BINC-001-004`.

### 2026-10-10 — KR-BINC-001-018 source header standard accepted

- **State:** ACCEPTED
- **Tasks:** `KR-BINC-001-018`
- **Increment ACs:** `B-INC-001-AC-21`
- **Program acceptance:** `BAC-039` (with supporting `BAC-031` and `BAC-037`)
- **Tests:** `BTS-037`. Source Header Check runs 38063027471 and 38062983863 passed; negative-path run 38052486010 failed as intended with HEADER-008.
- **Security gates:** Not applicable
- **Findings/risks:** None open. Optional hardening (strict up-to-date checks and pinning the checks to GitHub Actions) is tracked separately.
- **Files changed:** see `../../BACKEND_CHANGELOG.md` PB-005 to PB-007
- **Commit:** implementation `44cb244`, `8b51577`, `72b87cd`, `350b6b7`; evidence `846840f`, `066a2ae`, `c585560` (merged in PR #1 as `3a0d7e5`)
- **Evidence:** Actions runs listed above; ruleset 24843399
- **Reviewer role:** Repository owner, with external review
- **Decision and follow-up:** Accepted. The other B-INC-001 tasks remain open.

### 2026-10-10 — KR-BINC-001-019 repository Makefile accepted

- **State:** ACCEPTED (task only; `B-INC-001-AC-19` stays open because other tasks also contribute to it)
- **Tasks:** `KR-BINC-001-019`
- **Increment ACs:** `B-INC-001-AC-19` (contributing)
- **Program acceptance:** `BAC-037` (contributing)
- **Tests:** `BTS-001`, `BTS-036`. Owner's local `make check` passed on the PR branch; Source Header Check runs 38064045393 (PR) and 38064087028 (main) and docs-check runs 38064045435 (PR) and 38064087036 (main) passed.
- **Security gates:** `SEC-GATE-003` (traced through AC-19; the Makefile adds no new control)
- **Findings/risks:** None
- **Files changed:** `Makefile`; header checker and test; source header standard; planning records (PB-008)
- **Commit:** `b7f22b5`, `639a0a9`; merged in PR #3 as `3c96924`
- **Evidence:** Actions runs listed above
- **Reviewer role:** Repository owner, with external review
- **Decision and follow-up:** Accepted. The application build, test, lint and format targets are completed by the toolchain tasks `KR-BINC-001-001` to `004`.

## Entry Template

Use this template for each subsequent implementation or verification entry.

### YYYY-MM-DD — Short change title

- **State:** PLANNED / IMPLEMENTED / VERIFIED / REVIEWED / ACCEPTED
- **Tasks:** `KR-BE-1-xxx`, `KR-BINC-001-nnn`
- **Increment ACs:** `B-INC-001-AC-nn`
- **Program acceptance:** `BAC-nnn`
- **Tests:** canonical `BTS-nnn` IDs and run references
- **Security gates:** canonical `SEC-GATE-nnn` IDs and statuses
- **Findings/risks:** linked IDs or `None identified in this change`
- **Files changed:** paths or a link to the commit
- **Commit:** verified SHA, or `Pending`
- **Evidence:** sanitized file paths or immutable CI run IDs
- **Reviewer role:** as appropriate
- **Decision and follow-up:** result, unresolved items, owner

Do not use “None” for findings or risks unless they were actually assessed. Use “Not assessed” where verification has not occurred.
