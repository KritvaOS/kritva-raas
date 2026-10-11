# KR-BE-1-001 — Control Plane Application Structure Implementation Plan

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-001 Implementation Plan |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/plans/KR-BE-1-001-application-structure-plan.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Readiness review](../decisions/IMPLEMENTATION_READINESS.md)
- [Runtime and language decision record](../decisions/KR-BINC-001-001-runtime-language.md)
- [Package manager and lockfile decision record](../decisions/KR-BINC-001-002-package-manager-lockfile.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)
- [Source header standard](../../../../../development/SOURCE_HEADER_STANDARD.md)
- [Development setup](../../../../../development/DEVELOPMENT_SETUP.md)

## 1. Purpose and Status

This plan prepares `KR-BE-1-001` so that implementation can start without further design work once its dependencies are approved. It is a plan, not an implementation. No application code, package metadata or lockfile exists, no task status changes, and nothing here approves a decision. It is not a task definition: the task record in `TASKS.md` remains authoritative for scope, Definition of Done and linked items.

`KR-BE-1-001` stays Blocked until `KR-BINC-001-001` (runtime and language) and `KR-BINC-001-002` (package manager and lockfile) are approved by the Backend Technical Lead. The scaffold must not be created against Proposed versions.

## 2. Task Record Summary

| Field | Value |
|---|---|
| Task | KR-BE-1-001 — Create Control Plane application structure |
| Owner role | Backend Engineer; Backend Technical Lead accountable |
| Dependencies | P0 FOUNDATION; approved `KR-BINC-001-001` and `KR-BINC-001-002` |
| Acceptance | B-INC-001-AC-01, B-INC-001-AC-02 |
| Tests | BTS-001, BTS-036 |
| Security gates | SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 |
| Definition of done | Clean checkout installs reproducibly; build and baseline tests run; application entry point is explicit; no credentials are embedded; structure matches the reviewed architecture |

## 3. Questions to Settle Before Implementation

Three inconsistencies in existing documents affect this task. Each needs an owner answer. The recommendations are not decisions.

| # | Question | Evidence | Recommendation |
|---|---|---|---|
| 1 | Directory of the application: `apps/backend` or `apps/control-plane` | `DEVELOPMENT_SETUP.md` Section 6 and `BRANCHING_STRATEGY.md` use `apps/backend`. The header standard example uses `apps/control-plane` | `apps/backend`: it appears in the ownership table and two documents. Correct the header standard example in `KR-BINC-001-016` or the scaffold commit |
| 2 | Workspace layout and manager: `DEVELOPMENT_SETUP.md` Section 6 shows a root `package.json`, `pnpm-workspace.yaml` and `turbo.json`. `KR-BINC-001-002` recommends npm | The setup document predates the package-manager decision | A self-contained `apps/backend/package.json` and `package-lock.json`, no root workspace and no turbo, until a second package exists. Align the setup document in `KR-BINC-001-016`. The setup document is not treated as obsolete until the owner's disposition is recorded; the question stays open until then |
| 3 | Minimal ignore rules: `KR-BINC-001-006` owns ignore rules, but installing dependencies creates `node_modules` and a build creates `dist` before that task may have run | `.gitignore` currently lists only Python cache files | Run `KR-BINC-001-006` first if the dependencies permit. Otherwise allow only an `apps/backend/.gitignore` with `node_modules`, `dist` and `coverage`, record that this is not the completion of `KR-BINC-001-006`, and reconcile it with that task before its acceptance. Secret and environment rules stay with `KR-BINC-001-006` |

If the owner chooses pnpm in `KR-BINC-001-002`, Sections 4 to 6 are rewritten with the equivalent commands before implementation.

## 4. Proposed Scaffold

Minimal, with no dependency that a later task has not decided. No HTTP framework (`KR-BINC-001-003`), no configuration module (`KR-BE-1-003`), no database access, no logging library, no listening port, no scanner integration and no secrets-management code. Nothing is added to make the baseline look more complete.

| Path (under `apps/backend/`) | Purpose |
|---|---|
| `package.json` | `type: module`, `engines.node` for the approved release, the three scripts below. Direct dependencies pinned exactly |
| `package-lock.json` | The single source of resolved versions. Reviewed as part of the change |
| `.npmrc` | `save-exact=true` and `engine-strict=true`. No registry token |
| `tsconfig.json` | The strict options approved in `KR-BINC-001-001`, with an explicit `rootDir` (required by TypeScript 6). It includes both `src` and `tests` |
| `src/main.ts` | The explicit entry point. It is intentionally inert: it composes nothing and opens no port. The README says so and does not describe a running service |
| `src/runtime-info.ts` | One small pure function, so the baseline test has real behavior to check |
| `tests/runtime-info.test.ts` | Baseline test using the built-in `node:test` runner, so no test-runner choice is made here |
| `README.md` | Install, build, typecheck and test commands, the entry-point semantics and the pinned versions |
| `.gitignore` | Only if question 3 is answered that way |

Every `.ts` file carries the source header (the header check scans tracked files). JSON files and the lockfile are exempt. The only development dependencies are `typescript` and `@types/node`, at the versions recorded as approved in the toolchain records. This plan does not select a version because an earlier record proposed it.

### 4.1 Command contract

| Script | Does |
|---|---|
| `build` | `tsc -p tsconfig.json`: compiles `src` and `tests` to `dist` |
| `typecheck` | `tsc -p tsconfig.json --noEmit` |
| `test` | Runs `build`, then `node --test` on the explicit compiled test file path, for example `dist/tests/runtime-info.test.js` |

Test sources are compiled first and the emitted JavaScript is executed. Direct execution of TypeScript is not relied on. The contract was tried in a disposable sandbox with Node.js 24.21.0, npm 10.9.4 and TypeScript 6.0.3 on a sample project: typecheck, build and the test passed from a copy that ran `npm ci`. One finding: passing the directory `dist/tests/` to `node --test` failed (the directory was treated as a module), so the explicit file path form is the one to use. This sandbox run is not task evidence and the approved versions may differ.

### 4.2 Runtime pin mechanism

`engines.node` expresses compatibility. It does not select or install a runtime, and `engine-strict=true` only refuses to install under an incompatible runtime. `save-exact=true` pins versions saved later, and the resolved graph is committed only through `package-lock.json`. None of these substitutes for another. The approved runtime record must state how a developer or CI obtains the exact Node.js and npm releases and where the integrity evidence comes from (the open Section 6 items of `KR-BINC-001-001`). This task consumes that mechanism and does not invent one.

## 5. Order of Work

1. Resolve the prerequisites: the approvals of `KR-BINC-001-001` and `KR-BINC-001-002` and the answers to questions 1 to 3. Do not implement against Proposed versions.
2. Freeze the contract: the approved Node.js and npm releases and pin mechanism, the compatible `typescript` and `@types/node` versions, the strict compiler options and the command contract in 4.1.
3. Implement only the agreed scaffold, with the agreed ignore strategy. Installing dependencies uses the npm bundled with the pinned Node.js release. Review the lockfile.
4. Collect evidence (Section 6), run `make check` at the repository root and inspect the final diff for credentials.
5. Request acceptance only when the evidence is complete. The Backend Technical Lead records acceptance. Task status and gate status are updated separately, each by its own criteria.

If the owner chooses a different manager in `KR-BINC-001-002`, Sections 4 and 5 are rewritten first.

## 6. Evidence Needed Before the Task Can Be Accepted

| Item | Evidence |
|---|---|
| Clean checkout (AC-02, BTS-001) | Transcript of a fresh clone, with no reused `node_modules`: `npm ci`, `typecheck`, `build`, `test`, each with its exit code, the Node.js and npm versions and the revision, sanitized |
| Lockfile discipline | Lockfile review note. A mismatch test run in a disposable copy: change one direct dependency version in `package.json` there and show that `npm ci` fails. The task checkout is shown clean afterwards |
| Entry point | `src/main.ts`, the script that builds it, and a statement of what it does (nothing yet) |
| Review (BTS-036) | The completed test matrix entry, and a reviewer record that states the review done, its findings and their disposition. A generic "reviewed" is not enough |

### 6.1 Security gates: contribution and what stays open

Task evidence may contribute to a gate without closing it. Each gate is judged against its canonical definition in `BACKEND_SECURITY_GATE.md`.

| Gate | This task contributes | Stays open |
|---|---|---|
| SEC-GATE-003 | A sanitized inspection and rescan of the change showing no populated credential value. The scaffold adds no configuration example and says so | Safe example configuration and the documented way to obtain local values (`KR-BINC-001-007`). Not satisfied by an artifact that does not exist |
| SEC-GATE-004 | The approved toolchain records the gate also cites | A demonstrated local secret check. That is `KR-BINC-001-009`, which needs the scanner from `KR-BINC-001-008` (on hold). The task must not claim local detection is enforced |
| SEC-GATE-013 | Its own evidence rows for this task | The full gate matrix, evidence inspection, reviewer disposition and the outstanding-findings list for the increment |

Not claimed: the task is Accepted only when its Definition of Done and the evidence above exist and the Backend Technical Lead records acceptance. A merged pull request, a passing check or an approved decision is not acceptance, and no gate is closed by this task.

## 7. Commit Plan

One atomic commit for the task, using the task's entry in `GIT_COMMIT_STEP.md` Section 9.3:

```text
feat(backend): create Control Plane application structure [KR-BE-1-001]

Tasks: KR-BE-1-001
Acceptance: B-INC-001-AC-01, B-INC-001-AC-02
Tests: BTS-001, BTS-036
Security-Gates: SEC-GATE-003, SEC-GATE-004, SEC-GATE-013
Evidence: <replace with sanitized evidence reference>
```

The Evidence line is filled with the real, sanitized reference at commit time. The attribution trailers follow the commit rules in force then.

## 8. Risks

| Risk | Mitigation |
|---|---|
| The scaffold is built on versions that are later changed | Do not start before both decisions are approved |
| The npm bundled with the pinned Node.js differs from the one used in the compatibility check and the sandbox command check (10.9.4 was used, not the bundled 11) | Step 3 and the evidence use the bundled npm, and the version is printed |
| The test command silently runs nothing or the wrong files | Explicit compiled test file path; the transcript shows the pass count |
| Header check fails on a new file | Add the header in the same step and run `make check` before committing. If the standard's example path is corrected, it follows the documentation process |
| A dependency pulls an install script | Install with scripts disabled in CI as the package-manager policy requires, and list any exception |
| `node_modules` is committed by accident | Question 3 |
