# KR-BINC-001-001 — Runtime and Language Versions

## Document Control

| Field | Value |
|---|---|
| Document | KR-BINC-001-001 Runtime and Language Versions Decision Record |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Readiness review](IMPLEMENTATION_READINESS.md)
- [Approval package](../../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md)
- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)
- [Backend implementation plan](../../../BACKEND_IMPLEMENTATION_PLAN.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | KR-BINC-001-001 — Decide runtime and language versions |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead |
| Acceptance | B-INC-001-AC-01 |
| Tests | BTS-001, BTS-036 |
| Security gates | SEC-GATE-004, SEC-GATE-013 |
| Decision status | Proposed — not approved |

This is a recommendation. It is not an approval, and no dependent task may rely on it until the Backend Technical Lead records approval in Section 9. The linked tests and gates are NOT RUN: the decision produces no executable code.

## 2. Context and Constraints

- The baseline is TypeScript on Node.js, PostgreSQL and REST API v1 (`BACKEND_IMPLEMENTATION_PLAN.md` Section 4). Only the exact versions are open.
- The plan asks for a supported LTS release with a documented support window, and a stable TypeScript version pinned consistently.
- Production applications should use only Active LTS or Maintenance LTS Node.js releases (Node.js release policy).
- This is a greenfield repository with no application code, so there is no legacy compatibility constraint.
- Compatibility of the later toolchain (HTTP framework, test runner, linter, PostgreSQL driver and migration tool) is not yet evaluated. Those tasks must confirm the selected versions.

## 3. Evidence (queried 2026-10-10)

Node.js release schedule (`nodejs.org` release list and the official `nodejs/Release` `schedule.json`):

| Line | Codename | Status on 2026-10-10 | Maintenance LTS from | End of life | Latest release seen |
|---|---|---|---|---|---|
| v22 | Jod | LTS (Maintenance) | 2025-10-21 | 2027-04-30 | v22.23.3 (2026-09-23) |
| v24 | Krypton | LTS (Active; Maintenance from 2026-10-20) | 2026-10-20 | 2028-04-30 | v24.21.0 (2026-09-07) |
| v26 | none | Current; becomes LTS on 2026-10-28 | 2027-10-20 | 2029-04-30 | v26.11.1 (2026-10-07) |

Other lines (v20 and v25) are end of life.

TypeScript on the npm registry:

| Version | Published | Note |
|---|---|---|
| 5.9.3 | 2025-09-30 | Last 5.x release |
| 6.0.3 | 2026-04-16 | Last 6.x release |
| 7.0.2 | 2026-07-08 | Current `latest` tag; package engines `node >=16.20.0` |

`@types/node` has a `latest` tag of 26.6.5. This evidence shows version availability and support windows only. It does not show that any later tool supports these versions.

## 4. Options Considered

Node.js:

| Option | Assessment |
|---|---|
| v22 (Jod) | Already in Maintenance. Support ends 2027-04-30, about 6 months away. Rejected: too short for a new codebase |
| v24 (Krypton) | LTS now, mature patch line, supported to 2028-04-30 (about 18 months). Maintenance phase starts 2026-10-20 but remains within the production-use rule |
| v26 | Current today and not yet production-grade by the release policy. Becomes LTS on 2026-10-28 and supported to 2029-04-30. Not eligible until it enters LTS |
| v25 | End of life. Rejected |

TypeScript:

| Option | Assessment |
|---|---|
| 5.9.x | Oldest option and no longer the newest major. Rejected unless a later tool requires it |
| 6.0.x | Stable, latest 6.x release 2026-04-16. Recommended initial baseline |
| 7.0.x | Current `latest`, published 2026-07-08. Upgrade candidate once the compatibility check in Section 6 passes. TypeScript 6.0 is described by its release notes as a transition toward the 7.0 compiler, with some options deprecated before 7.0, so adopting 7.0 needs the evidence in Section 6 |

## 5. Recommendation

1. **Node.js 24 LTS (Krypton)**, pinned to an exact patch version in the repository and in CI, starting from the latest 24.x patch at the time of KR-BE-1-001.
2. **TypeScript 6.0.3** as the initial baseline, pinned to an exact version. **TypeScript 7.0.2** is an upgrade candidate, adopted by a new decision record only after the compatibility check in Section 6 passes for it. The baseline is 6.0.3 and not 7.0.x because no evidence yet shows that the framework, test runner, linter and build tools support 7.0.
3. **Version policy:** one supported Node.js major at a time, recorded in a single place and mirrored by the package metadata `engines` field, a version file for local use and CI. Exact pins give reproducibility, not a frozen patch level: patch and security updates are taken deliberately as reviewed changes that touch the lockfile and are verified by CI, and the pinned Node.js patch is reviewed at least when a security release is published. A new Node.js major is adopted by a new decision record, not silently.

Rationale: Node.js 24 is eligible for production now and has the longest window among the eligible lines, 18 months. Node.js 26 has a longer window (to 2029-04-30) but is not yet LTS.

Decision point for the owner: if the owner prefers the longer window, adopting Node.js 26 after it enters LTS on 2026-10-28 is a reasonable alternative. This record then changes to Node.js 26 before KR-BE-1-001 starts. The choice costs nothing before application code exists, and it costs a migration afterwards.

## 6. Compatibility Check Required Before Approval

The recommendation is not final until the following is demonstrated and recorded, because only version availability was verified. The record must name the exact Node.js release used by local development and CI, how it is pinned, and the compatibility matrix of the tools that were actually checked:

1. TypeScript 6.0.3 compiles a strict-mode sample under the proposed Node.js version. For the 7.0.2 upgrade candidate, the same check passes and any deprecated or removed configuration option is listed.
2. The shortlisted HTTP framework, test runner, linter and PostgreSQL driver declare support for the proposed Node.js and TypeScript versions.
3. The proposed package manager (KR-BINC-001-002) supports the proposed Node.js version.

If a tool does not support the proposed Node.js version, the approver chooses a different Node.js version or tool before approval, and the reason is recorded here.

### Compatibility evidence recorded 2026-10-11

This is a partial result from an executed check in a disposable sandbox. It does not complete Section 6 and does not approve the decision.

| Check | Result |
|---|---|
| Node.js release used | 24.21.0 |
| How it was obtained | The `node@24.21.0` package from the npm registry. It was not downloaded from nodejs.org, so the official checksums were not verified |
| How it would be pinned | Not decided. Candidates are an exact `engines.node` value in `package.json`, a `.node-version` file read by local tooling and CI, and `engine-strict` in `.npmrc`. The choice belongs to KR-BINC-001-016 and KR-BINC-001-017 |
| TypeScript 6.0.3, strict sample | Compiled and ran under Node.js 24.21.0 with exit status 0. Options used: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax`, `skipLibCheck: false`, `module` and `moduleResolution` NodeNext, target ES2023, with `@types/node` 24.19.2 |
| TypeScript 6.0 migration finding | The first compile failed with TS5011 until `rootDir` was set explicitly. Any TypeScript 6 project configuration must set `rootDir` |
| TypeScript 7.0.2, same sample and options | `tsc --noEmit` exited with status 0. No deprecated or removed option was reported for this option set. The result covers only this sample and these options |
| eslint 10.12.0 with typescript-eslint 8.71.1 (recommended rules) | Ran on the sample under TypeScript 6.0.3 with exit status 0 |
| vitest 5.0.3 | One trivial test ran and passed |
| pg 8.23.1 | Installed and imported under Node.js 24.21.0. No database connection was attempted |
| npm | 10.9.4 was used. The npm bundled with Node.js 24.21.0 was not used. Package manager support is therefore not demonstrated (KR-BINC-001-002 stays open) |

Not demonstrated by this check: the HTTP framework (not decided), the migration tool, TypeScript 7.0.2 together with typescript-eslint (its declared range excludes 7.0.x), the pinned Node.js release from the official distribution with verified checksums, Node.js 26, and any CI run.

## 7. Consequences and Dependencies

- KR-BINC-001-002 (package manager) depends on this decision.
- KR-BE-1-001 (application structure) stays blocked until this record and KR-BINC-001-002 are approved.
- KR-BINC-001-003 (HTTP framework) must support the selected versions.
- CI and setup documentation (KR-BINC-001-016 and 017) record the exact versions once approved.
- The Node.js support dates are an input that changes over time. The version policy should be reviewed before the end-of-life date of the selected line.

## 8. Security Notes

- Only supported lines receive security fixes. Choosing a line near end of life is a security cost.
- Exact version pins and a committed lockfile support SEC-GATE-004 and SEC-GATE-013 traceability. Execution evidence arrives with the implementing tasks.

## 9. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Pending | — | — |

Approval evidence must record the approver role, the date and the chosen versions. The task stays Proposed until then.
