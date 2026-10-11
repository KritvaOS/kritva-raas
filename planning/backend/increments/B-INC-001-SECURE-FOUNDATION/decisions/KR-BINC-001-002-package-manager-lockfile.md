# KR-BINC-001-002 — Package Manager and Lockfile Policy

## Document Control

| Field | Value |
|---|---|
| Document | KR-BINC-001-002 Package Manager and Lockfile Policy Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-002-package-manager-lockfile.md` |
| Status | Approved |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Readiness review](IMPLEMENTATION_READINESS.md)
- [Approval package](../../../decisions/approvals/APPROVAL-KR-BINC-001-002-package-manager.md)
- [Runtime and language decision record](KR-BINC-001-001-runtime-language.md)
- [Secret-handling and configuration boundary](KR-BINC-001-005-secret-handling-configuration.md)
- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | KR-BINC-001-002 — Decide package manager and lockfile policy |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead |
| Depends on | KR-BINC-001-001 approved |
| Acceptance | B-INC-001-AC-01, B-INC-001-AC-02 |
| Tests | BTS-001, BTS-036 |
| Security gates | SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 |
| Decision status | Approved on 2026-10-11 by the Backend Technical Lead, within the scope in Section 8. The task stays In Review |

This decision is approved within the scope recorded in Section 8. It depends on the runtime decision `KR-BINC-001-001`, which is approved. The linked tests and gates are NOT RUN. The reproducible-install claim is verified later by KR-BE-1-001 and KR-BINC-001-017.

## 2. Context and Constraints

- The plan prefers reproducible installs, a committed lockfile and CI consistency (`BACKEND_IMPLEMENTATION_PLAN.md` Section 6.3).
- A clean checkout must install from the lockfile without undocumented manual steps (`B-INC-001-AC-02`).
- The runtime recommendation is Node.js 24 LTS (KR-BINC-001-001, approved 2026-10-11).
- The repository's existing tooling is Python and Make. The root `Makefile` reserves `build`, `test`, `lint` and `format` until this decision and KR-BINC-001-001 to 004 are made.
- Supply-chain exposure through dependency install scripts and unpinned versions bears on the secret-protection posture (KR-BINC-001-005).

## 3. Evidence (queried 2026-10-10)

| Item | Value |
|---|---|
| npm, registry `latest` | 12.2.0, published 2026-09-30; package engines `node ^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0` |
| npm bundled with Node.js 24.21.0 (`nodejs.org` release list) | 11.19.0 |
| npm bundled with Node.js 26.11.1 | 11.20.0 |
| pnpm, registry `latest` | 12.11.2, published 2026-10-09; package engines `node >=18` |

The table above shows versions and Node.js engine ranges only.

Executed check, 2026-10-11 (disposable sample project, Linux x86_64, Node.js v24.21.0 from nodejs.org with its checksum matched; see Section 6.2 of the KR-BINC-001-001 record, which also records the release signature: first not verified, then verified against the key fingerprint published by the Node.js project in Section 6.3): the npm bundled with that release reports 11.19.0. With install scripts disabled, `npm install` created a lockfile for seven exact-pinned packages (143 packages in total), and `npm ci` from a clean directory installed the same 143 packages. A deliberately mismatched `package.json` (typescript 6.0.2 against a lockfile with 6.0.3) made `npm ci` exit 1 with an "in sync" error. This demonstrates the behavior in a disposable project with the bundled npm only. It does not replace the clean-checkout and CI evidence in Section 6.

## 4. Options Considered

| Criterion | npm | pnpm |
|---|---|---|
| Installation | Bundled with Node.js, so no extra bootstrap step in a clean checkout | Needs a separate install or a version-manager step, which adds one pinned tool to the setup |
| Lockfile | `package-lock.json` | `pnpm-lock.yaml` |
| Reproducible install | `npm ci` installs exactly from the lockfile and fails when `package.json` and the lockfile disagree | `pnpm install --frozen-lockfile` is the equivalent |
| Strictness of dependency resolution | Flat `node_modules`, so undeclared imports can resolve | Isolated layout, so undeclared imports fail |
| Install-script control | Configurable with `ignore-scripts` | Configurable, with its own policy for dependency scripts |
| Team and CI familiarity | Highest | Moderate |

Both options meet the requirements. The comparison turns on setup simplicity against dependency strictness.

## 5. Recommendation

**npm**, using the version bundled with the approved Node.js release, with this policy:

1. One package manager only. A different manager's lockfile is rejected in review and in CI.
2. `package-lock.json` is committed and is the single source of resolved versions.
3. CI and clean-checkout verification install with `npm ci`, never `npm install`. A mismatch between `package.json` and the lockfile fails the build.
4. Direct dependencies are pinned to exact versions (the `save-exact` setting in a committed `.npmrc`).
5. `engines` in `package.json` and the repository version file match the approved Node.js version (KR-BINC-001-001). The `engine-strict` setting is enabled.
6. Dependency install scripts run only when reviewed. The default for CI installs is to disable them, with a documented allowlist for packages that need them.
7. A dependency update is a normal reviewed change that touches the lockfile, and each update is scanned by the CI checks that KR-BINC-001-008 and 010 define.
8. No registry credential or token is committed. Any private-registry token comes from the CI secret store under KR-BINC-001-005.

Rationale: npm adds no bootstrap step and matches the clean-checkout criterion most simply. The strictness advantage of pnpm is real. The owner may prefer it, and the cost of switching is lowest before the first lockfile exists.

## 6. Verification Required Before This Is Treated as Settled

The following are demonstrated by later tasks, not by this record:

1. A clean checkout installs with `npm ci` and runs the baseline build and tests (`B-INC-001-AC-02`, KR-BE-1-001 and KR-BINC-001-017).
2. A deliberately mismatched lockfile fails the install in CI. (Demonstrated locally with the bundled npm 11.19.0 in a disposable project on 2026-10-11, see Section 3. The CI check remains for a later task.)
3. The CI workflow for the application checks, added by a later task, calls the Make targets that this decision unblocks, and `make check` keeps its current scope until then.

## 7. Consequences and Dependencies

- KR-BE-1-001 was blocked until this record and KR-BINC-001-001 were approved. Both were approved on 2026-10-11.
- The `build`, `test`, `lint`, `format` and `format-check` Make targets are wired to npm scripts by KR-BE-1-001 and the toolchain tasks, and they keep failing until then.
- If the owner chooses pnpm, Section 5 is rewritten with the equivalent commands (`pnpm install --frozen-lockfile`, a committed `pnpm-lock.yaml`, a pinned pnpm version) before approval.
- Setup documentation (KR-BINC-001-016) uses the approved commands only.

## 8. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Approved | 2026-10-11 | Dinesh Annayya, acting as Backend Technical Lead, approved the scope below in session on 2026-10-11, after approving `KR-BINC-001-001`. Reviewed: this record (Sections 3, 5 and 6) and approval package revision 3 |

### 8.1 Approved scope

npm, using the version bundled with the approved Node.js release (24.21.0 bundles npm 11.19.0), with the eight policy points of Section 5: one package manager, a committed `package-lock.json`, `npm ci` in CI and clean-checkout verification, exact pins with `save-exact`, `engines` and `engine-strict` matching the approved Node.js version, install scripts disabled by default with a documented allowlist, dependency updates as reviewed changes, and no registry credential in the repository. pnpm is not adopted.

Evidence accepted: the executed check of Section 3 (disposable project, Linux x64, bundled npm 11.19.0, install scripts disabled, a mismatched lockfile rejected by `npm ci`).

### 8.2 Not approved by this record

- The clean-checkout install in the real repository and the CI lockfile check. They are demonstrated later by `KR-BE-1-001` and `KR-BINC-001-017` (Section 6).
- The scanning of dependency updates in CI (`KR-BINC-001-008` and `KR-BINC-001-010` define it; `KR-BINC-001-008` is on hold).
- Any application code, lockfile or `.npmrc`.

### 8.3 Independence of this approval

The approver is also the repository owner who directed the recommendation, and no independent reviewer took part. `KR-BINC-001-002` stays In Review. An Approved decision does not make the task Accepted.
