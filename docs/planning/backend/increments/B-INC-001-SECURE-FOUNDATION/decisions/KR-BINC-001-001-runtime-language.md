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

4. **TypeScript scope (2026-10-11).** The repository owner agreed in session to keep TypeScript 6.0.3 as the baseline and to defer TypeScript 7.0.2 to a later decision record. This approval therefore covers 6.0.3 only. It is an owner direction relayed in session and not the Backend Technical Lead's recorded approval, which is still pending in Section 9.

### 5.1 Proposed pin method (recommendation, not decided)

This is a proposal for the Backend Technical Lead to approve, change or reject before approving this record. It is not decided. The mechanisms below serve different purposes, and none substitutes for another.

| Element | Role |
|---|---|
| `.node-version` at the repository root | The canonical pin: one line holding the exact Node.js patch version. The approved release is written here when this record is approved. The file is read by several version managers and by the CI setup step. The policy is the content of the file, not a particular tool |
| `engines.node` in the backend `package.json` | The same exact version, so that the package states what it was verified with. A compatibility guard. It does not install a runtime |
| `engine-strict=true` in `.npmrc` | Makes an install fail under an incompatible runtime. A guard, not an installer |
| Runtime source | The official Node.js distribution. A pin change records the release, the source, the matching `SHASUMS256.txt` entry, the computed SHA-256, and the signature check or an explicit statement that none was done. The npm registry `node` package is not an accepted source |
| Bundled npm | npm is the one bundled with the pinned release (`KR-BINC-001-002`). Its version is recorded in each pin change and is not pinned separately |
| Consistency check | CI fails when `.node-version`, `engines.node` and the runtime in use disagree. This is a requirement for `KR-BINC-001-017`. No such check exists yet |
| Changing the pin | A patch or security update is a reviewed change that updates the three places and the lockfile and is verified by CI. A new Node.js major needs a new decision record |

Candidate release: 24.21.0 is the release used in the sandbox check and is the current candidate. The Backend Technical Lead confirms the exact patch after the official distribution is verified (Section 6). The policy is decided before this record is approved. Putting it in place in local setup and in CI belongs to `KR-BINC-001-016` and `KR-BINC-001-017`.

Rationale: Node.js 24 is eligible for production now and has the longest window among the eligible lines, 18 months. Node.js 26 has a longer window (to 2029-04-30) but is not yet LTS.

Decision point for the owner: if the owner prefers the longer window, adopting Node.js 26 after it enters LTS on 2026-10-28 is a reasonable alternative. This record then changes to Node.js 26 before KR-BE-1-001 starts. The choice costs nothing before application code exists, and it costs a migration afterwards.

### 5.2 Owner direction on 2026-10-11

The repository owner gave these directions in session. They are the owner's choices for the Backend Technical Lead to review. They are not the Backend Technical Lead's approval.

| Topic | Direction | Status |
|---|---|---|
| Pin method | Proposal A (Section 5.1) is the recommendation to take to the Backend Technical Lead. A container image pinned by digest for deployment is to be added later | Proposal A is not approved. The container image is a later addition and is not decided. It would have to reconcile with the runtime-source rule in Section 5.1, because the official Docker image is not the `nodejs.org` archive. It belongs to deployment work, not to `KR-BINC-001-016` or `KR-BINC-001-017` as written |
| HTTP framework | Fastify is the owner's preferred candidate | Not a decision. `KR-BINC-001-003` still evaluates the options and needs its own approved decision record. The other candidates are not ruled out by this record |
| Migration tool shortlist | node-pg-migrate, graphile-migrate and dbmate | Shortlist only. `KR-BINC-001-004` still decides, with Database Technical Lead review and `SEC-GATE-011` |

## 6. Compatibility Check Required Before Approval

The recommendation is not final until the following is demonstrated and recorded, because only version availability was verified. The record must name the exact Node.js release used by local development and CI, how it is pinned, and the compatibility matrix of the tools that were actually checked:

1. TypeScript 6.0.3 compiles a strict-mode sample under the proposed Node.js version. TypeScript 7.0.2 is deferred to a later decision record (Section 5, item 4) and is not a condition of this approval. The sandbox result for it below is information only.
2. The shortlisted HTTP framework, test runner, linter and PostgreSQL driver declare support for the proposed Node.js and TypeScript versions.
3. The proposed package manager (KR-BINC-001-002) supports the proposed Node.js version.
4. The Node.js release is obtained from the official distribution and verified, with the evidence fields listed in Section 6.1.

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

### 6.1 Evidence fields for the official distribution check

Recorded per verification, with the commands and outputs, and never as a conclusion alone:

| Field | Content |
|---|---|
| Release identity | Node.js version, platform, architecture, exact archive file name |
| Source | Official distribution URL, the `SHASUMS256.txt` URL and the signature URL if used |
| Checksum | The matching manifest entry, the expected SHA-256 and the computed SHA-256 |
| Command and result | The exact checksum command, exit status and output |
| Signature | Whether it was available and checked, the command and result, the release key fingerprint and how the key was authenticated, or an explicit "not performed" |
| Runtime | `node --version`, `npm --version`, executable paths, and that the binaries came from the official distribution |
| Toolchain | Exact versions of TypeScript, eslint, typescript-eslint, vitest and pg, with commands, exit statuses and scope |
| Limitations | No database connection tried, framework not selected, no CI run, unverified platforms |

A disposable `npm ci` run with the bundled npm is decision evidence of compatibility. The acceptance of reproducible install in the real repository stays with `KR-BE-1-001` and `KR-BINC-001-017`.

### 6.2 Official distribution check recorded 2026-10-11

Executed by the repository owner on a Linux x86_64 laptop with a reviewed script (`verify-node-toolchain.sh`, a throwaway script that is not part of the repository). The run used a temporary directory outside the repository, an isolated npm cache, an empty npm user configuration and only the extracted Node.js binaries on `PATH`. Run time 2026-10-11T07:45:36Z. The script output was pasted to the Claude session and is summarized here; the full output is not stored in the repository. This completes part of Section 6 and does not approve the decision.

| Field | Result |
|---|---|
| Release identity | Node.js v24.21.0, linux-x64, archive `node-v24.21.0-linux-x64.tar.gz` |
| Source | `https://nodejs.org/dist/v24.21.0/node-v24.21.0-linux-x64.tar.gz`, manifest `https://nodejs.org/dist/v24.21.0/SHASUMS256.txt`, signature `https://nodejs.org/dist/v24.21.0/SHASUMS256.txt.sig` |
| Checksum | Manifest entry and computed SHA-256 are identical: `6e1db87ef58b8819e5d5402eff1536491b18edd8eb7bee5ef7897876e88dc5ff` |
| Command and result | `grep '  node-v24.21.0-linux-x64.tar.gz$' SHASUMS256.txt \| sha256sum -c -` printed `node-v24.21.0-linux-x64.tar.gz: OK`, exit status 0 |
| Signature | **Not verified.** `gpg --verify` on `SHASUMS256.txt.sig` reported a signature made 2026-09-09 with EDDSA key `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356` and "Can't check signature: No public key" (exit status 2). The key was not in the local keyring and was not compared with the official release-keys list, so no authenticity claim is made. The checksum therefore proves only that the archive matches the manifest downloaded from the same site. Superseded for the signature question by Section 6.3 |
| Runtime | `node --version` v24.21.0 and `npm --version` 11.19.0 (the npm bundled with this release), both run from the extracted archive |
| Toolchain, with install scripts disabled (`--ignore-scripts`) | `npm install` of typescript 6.0.3, @types/node 24.19.2, eslint 10.12.0, typescript-eslint 8.71.1, vitest 5.0.3, pg 8.23.1 and @types/pg 8.23.1 added 143 packages. A second `npm ci` from a clean directory added the same 143 packages. `tsc --noEmit`, `tsc` build, `node --test` on the compiled test file, eslint and vitest 5.0.3 (one test) all exited 0. `pg` 8.23.1 imported with no database connection. Resolved versions matched the pins |
| Lockfile mismatch | With `package.json` changed to typescript 6.0.2 and the lockfile unchanged, `npm ci` exited 1 and reported that `package.json` and the lockfile are not in sync (lock file's typescript@6.0.3 does not satisfy typescript@6.0.2) |
| Limitations | Linux x64 only. A disposable sample project, not the real repository. No database connection. HTTP framework and migration tool not selected. TypeScript 7.0.2 not tested in this run (deferred). No CI run. Install scripts were disabled, so no package that needs one was exercised |

Effect on earlier rows: the "How it was obtained" and "npm" rows of the 2026-10-11 compatibility evidence describe the earlier sandbox run. This check supersedes them for the Node.js release and the bundled npm. It does not supersede the TypeScript 7.0.2 information row.

Still open before the Backend Technical Lead can decide (updated by Section 6.3, which records the key authentication): the pin decision (Section 5.1), the HTTP framework and migration tool shortlist, and the `KR-BINC-001-002` acceptance of the bundled npm.

### 6.3 Signing key authentication recorded 2026-10-11

The repository owner decided that the signing key must be authenticated. A second reviewed script (`verify-node-signature.sh`, throwaway, not in the repository) was run on the same laptop (GnuPG 2.2.27, 2026-10-11T08:00:07Z). The owner copied the expected fingerprint from the "Release keys" section of the `nodejs/node` README and passed it to the script. The script used a temporary keyring, so the owner's own keyring was untouched. The output was pasted to the Claude session and is summarized here.

| Field | Result |
|---|---|
| Expected fingerprint | `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356`, copied by the owner from the `nodejs/node` README (listed there for Antoine du Hamel as a primary release key). Claude read the same README entry through a page-reading tool but could not confirm it independently |
| Key source | `hkps://keys.openpgp.org`, requested by the full fingerprint. One public key imported: "Antoine du Hamel", primary fingerprint equal to the expected value, one signing subkey `0A178CD0FE03CB4F8780980A039F94E89826F891` |
| Fingerprint match | PASS: the imported primary key equals the expected fingerprint |
| Detached signature `SHASUMS256.txt.sig` | `gpg` exit status 0. GOODSIG and VALIDSIG, signer primary key `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356`, signature made 2026-09-09 03:19:15 IST |
| Clearsigned `SHASUMS256.txt.asc` | `gpg` exit status 0. GOODSIG and VALIDSIG from the same primary key |
| Manifest entry covered | `6e1db87ef58b8819e5d5402eff1536491b18edd8eb7bee5ef7897876e88dc5ff  node-v24.21.0-linux-x64.tar.gz`, identical to the checksum in Section 6.2 |
| gpg warning | "This key is not certified with a trusted signature" (trust level unknown). No web-of-trust path to the key was built |

What this shows: the checksum manifest from nodejs.org is validly signed by a key whose fingerprint equals the one the Node.js project publishes in its README, and the archive matches that manifest. What it does not show: independent certification of the key. The README and the keyserver are both channels of the Node.js project (the keyserver is where the README tells readers to fetch keys). The release key was checked for release v24.21.0 only. A later release signed by another releaser needs its own check.

This supersedes the signature row of Section 6.2 (not verified). The Section 6.2 text stays as the record of the first run.

Still open before the Backend Technical Lead can decide: approval of the pin method (Section 5.1, with the owner direction in Section 5.2), review of the tool shortlist metadata in Section 6.4, and the `KR-BINC-001-002` acceptance of the bundled npm.

### 6.4 Shortlisted tools: declared support (registry metadata, 2026-10-11)

Metadata read from the npm registry. It shows what each package declares, not that it works. Nothing in this table was installed or run for this record. The framework and migration tool are decided by `KR-BINC-001-003` and `KR-BINC-001-004`; the table serves Section 6, item 2 only.

| Tool | Version seen | Declared Node.js range | Admits Node.js 24 | TypeScript and types | Notes for the deciding task |
|---|---|---|---|---|---|
| fastify (preferred candidate for `KR-BINC-001-003`) | 5.12.5, published 2026-09-16 | None declared | Not declared | Ships `fastify.d.ts`; no TypeScript peer range | Node.js support must be confirmed from the project documentation in `KR-BINC-001-003`. Depends on `pino` for logging, which bears on the redaction requirements of `KR-BINC-001-005` |
| node-pg-migrate | 9.0.0, published 2026-07-17 | >=20.11.0 | Yes | Ships types; peers `pg >=4.3.0 <9.0.0` and `@types/pg >=6.0.0 <9.0.0`, which admit pg 8.23.1 | Has a CLI; dependencies `glob`, `jiti`, `yargs` |
| graphile-migrate | Stable 1.4.1, published 2022-12-20. A `2.0.0-rc.5` is on the `rc` tag, published 2026-09-08 | None declared | Not declared | Ships types; `pg` and `@types/pg` are regular dependencies, not peers | The newest stable release is almost four years old and the 2.0 line is a release candidate. This is a maintenance signal for `KR-BINC-001-004` to assess, not a conclusion |
| dbmate | 2.36.0, published 2026-09-19 | None declared | Not applicable | Ships types for its wrapper | The npm package wraps a native binary supplied through per-platform optional packages (`@dbmate/<platform>`). The metadata declares no install script. Binary provenance and platform coverage (linux x64, arm, arm64 and ia32; macOS x64 and arm64; Windows x64) are for `KR-BINC-001-004` to evaluate. It does not depend on the Node.js or TypeScript version |

None of the four declares a TypeScript peer range, so no conflict with TypeScript 6.0.3 is declared. That is not proof of compatibility. The executed compatibility check for these tools belongs to the deciding tasks.

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
