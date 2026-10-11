# KR-BE-1-001 — Evidence and BTS-036 Review Record

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-001 Evidence and Review Record |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/evidence/KR-BE-1-001-evidence.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Implementation plan, Section 6 (evidence needed)](../plans/KR-BE-1-001-application-structure-plan.md)
- [Increment tasks](../TASKS.md)
- [Runtime and language decision record](../decisions/KR-BINC-001-001-runtime-language.md)
- [Package manager and lockfile decision record](../decisions/KR-BINC-001-002-package-manager-lockfile.md)

## 1. Purpose and Status

This record holds the plan Section 6 evidence for `KR-BE-1-001` and the BTS-036 review with the disposition of each finding. It is evidence, not acceptance. The Backend Technical Lead records acceptance separately. No security gate is closed by this record.

## 2. Clean-Checkout Evidence (AC-02, BTS-001)

The run was made by the repository owner on 2026-10-11 at 09:24:12Z on linux-x64, with `verify-clean-checkout.sh` against the committed tree of `main`. The script refuses to run unless `HEAD` equals `origin/main` and tracked files are unmodified, and it works from a `git archive` of the commit, so no `node_modules` or build output is reused.

| Item | Value |
|---|---|
| Commit | `ffc42d17182514a663332ec64b466475397e3dc2` (merge of PR #24, equal to `origin/main`) |
| Tree, whole repository | `6369cd4dac5266dddf8515cca281172b76a2b476` |
| Tree, `apps/backend` | `5b8c6556a5e2c8306bfd4f66335e28b0ef93d0d4` |
| Pin files | Root `.node-version` `24.21.0`; `apps/backend/package.json` `engines.node` `24.21.0` |
| Node.js archive | `https://nodejs.org/dist/v24.21.0/node-v24.21.0-linux-x64.tar.gz`; SHA-256 equals the official manifest value `6e1db87ef58b8819e5d5402eff1536491b18edd8eb7bee5ef7897876e88dc5ff` |
| Versions in use | node v24.21.0, npm 11.19.0, both from the extracted archive |
| Signature | Not checked by the script. The signing key was authenticated for v24.21.0 in `KR-BINC-001-001` Section 6.3 |
| Clean checkout files | `.gitignore`, `.npmrc`, `package.json`, `package-lock.json`, `README.md`, `src/main.ts`, `src/runtime-info.ts`, `tests/runtime-info.test.ts`, `tsconfig.json` |

| Step | Command | Exit status |
|---|---|---|
| 1 | `npm ci --ignore-scripts` (added 3 packages) | 0 |
| 2 | `npm run typecheck` | 0 |
| 3 | `npm run build` | 0 |
| 4 | `npm test` (1 test, 1 pass, 0 fail) | 0 |
| 5 | Lockfile mismatch in a disposable copy (see Section 3) | 1, as required |

The first run of 2026-10-11 09:00:34Z used base revision `1af7877`, before the final commit existed. It is kept as history and is not task evidence (review finding 2). Its PR comment is `https://github.com/KritvaOS/kritva-raas/pull/23#issuecomment-6107413546`.

## 3. Lockfile Review and Mismatch Test

- **Lockfile review note:** `package-lock.json` has 3 packages (`@types/node` 24.19.2, `typescript` 6.0.3 and the transitive `undici-types` 7.24.6). All three resolve from `https://registry.npmjs.org`, all three carry integrity hashes, none declares an install script. The direct dependencies are exact in `package.json`, and `.npmrc` sets `save-exact=true` and `engine-strict=true`.
- **Mismatch test:** in a disposable copy, `typescript` was changed to `6.0.2` with the lockfile unchanged. `npm ci` exited with status 1 and said `Invalid: lock file's typescript@6.0.3 does not satisfy typescript@6.0.2`. Result: PASS. The task checkout is not touched by the script, which works only in a temporary directory.

## 4. Entry Point Statement

`apps/backend/src/main.ts` is built by `npm run build` to `dist/src/main.js`. It defines and calls `main()`, which does nothing yet. It opens no port, reads no configuration and composes no module.

## 5. Gate Contributions (none closed)

| Gate | Contribution recorded | Stays open |
|---|---|---|
| SEC-GATE-003 | A sanitized credential scan of the tracked tree at `ffc42d1` (URL credentials, private keys, cloud and token shapes, populated secret assignments) found no match. The scaffold adds no configuration example and no registry token | Safe example configuration and the documented way to obtain local values (`KR-BINC-001-007`) |
| SEC-GATE-004 | The toolchain records: Node.js 24.21.0 with the official checksum and authenticated key, bundled npm 11.19.0, exact TypeScript 6.0.3 and `@types/node` 24.19.2, committed lockfile | A demonstrated local secret check (`KR-BINC-001-009`, which needs the held `KR-BINC-001-008` scanner). Local detection is not claimed |
| SEC-GATE-013 | The evidence rows of this task are this record | The full gate matrix, evidence inspection, reviewer disposition and outstanding findings of the increment |

## 6. BTS-036 Review Record

| Field | Value |
|---|---|
| Test | BTS-036 independent review |
| Reviewer | ChatGPT (external AI reviewer chosen by the repository owner), 2026-10-11 |
| Subject | Merged PR #23, commit `a3b40b0`, `main` at `379e2f1`; scope `apps/backend`, with the decision records and task evidence |
| Material given | The `apps/backend` files, a lockfile summary and the evidence summary of the first run |
| Verdict | Changes required before acceptance |
| Independence note | The reviewer is an AI assistant working from the material it was given. It is not a human security reviewer. The repository owner directed the review and also records the disposition |

| # | Severity | Finding (reviewer) | Disposition |
|---|---|---|---|
| 1 | Blocker | `.node-version` is in `apps/backend`; approved pin method A (`KR-BINC-001-001` Section 5.1) names the repository root | Accepted and fixed in PR #24 (PB-027). Root `.node-version` holds `24.21.0`; the nested file is removed; `engines.node` and `engine-strict` stay. The CI consistency check remains `KR-BINC-001-017` and does not exist |
| 2 | Blocker | The transcript names base revision `1af7877`, not the exact tested tree | Accepted. The run is repeated on the committed tree and recorded in Section 2 with commit and tree hashes |
| 3 | Should-fix | The evidence and the review are not in the canonical task records | Accepted. This record, the `TASKS.md` status, PB-028 and the changelog entry |
| 4 | Note | Lockfile and npm policy consistent | No change. Confirmed again by the repeat run |
| 5 | Note | `tsconfig.json` appropriately strict | No change |
| 6 | Note | Baseline test adequate for setup; `runtimeInfo` returns `NaN` for malformed input | Accepted as a limit of a scaffold helper. Not a validation contract. Later configuration validation needs its own tests |
| 7 | Note | No scope creep or embedded secret found | No change |

The reviewer has not re-reviewed the fixes of findings 1 and 2. The Backend Technical Lead may ask for a short re-review before accepting. Reviewer text is a record of what was said, not an approval.

## 7. Status

Plan Section 6 evidence and the BTS-036 review with its disposition are recorded. The task moves to In Review. At the time of this record it was not Accepted. The Backend Technical Lead recorded acceptance on 2026-10-11 in PB-029, without a re-review of the fixes by the reviewer. No gate is closed.
