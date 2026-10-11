# Approval Package — KR-BINC-001-001 Runtime and Language Versions

## 1. Document Control

| Field | Value |
|---|---|
| Document | Approval Package for KR-BINC-001-001 Runtime and Language Versions |
| Path | `docs/planning/backend/decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md` |
| Status | Closed |
| Owner role | Backend Technical Lead |
| Decision ID | KR-BINC-001-001 |
| Task ID | KR-BINC-001-001 |
| Increment | B-INC-001 |
| Revision | 5 (2026-10-11) |

Status here is the package workflow status (Draft, Requested, Closed, Withdrawn). The decision disposition is recorded in the decision record.

## 2. Purpose and Requested Disposition

This package asks the Backend Technical Lead to review the runtime and language recommendation and record one of: Approved, Rejected, or Returned for revision. An approval must name the exact versions and the compatibility evidence it accepts. This package is Closed. The outcome is recorded in the decision record, which is the only source of the disposition.

## 3. Canonical Decision Record

[KR-BINC-001-001 Runtime and Language Versions](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md)

The decision record is authoritative for the final disposition. The outcome is recorded in its Approval Record table and not in this package.

## 4. Decision Scope

Covers: the Node.js line and pinning rule, the TypeScript baseline and upgrade candidate, and the version policy for the backend repository.

Does not cover: the package manager (KR-BINC-001-002), the HTTP framework (KR-BINC-001-003), the migration tool (KR-BINC-001-004), or any application code. Approving this decision does not accept the task and does not close a security gate.

## 5. Recommendation Summary

Recommendation (approved by the Backend Technical Lead on 2026-10-11, see the decision record):

1. Node.js 24 LTS (Krypton), pinned to an exact patch version in the repository and in CI.
2. TypeScript 6.0.3 as the initial baseline, pinned exactly. TypeScript 7.0.2 is an upgrade candidate that needs its own decision record after a compatibility check.
3. One supported Node.js major at a time, recorded in one place and mirrored by package metadata, a local version file and CI. Patch and security updates are taken as reviewed changes.
4. A proposed pin method (decision record Section 5.1): `.node-version` as the canonical exact pin, a matching `engines.node` and `engine-strict=true` as guards, the official distribution as the only runtime source with the checksum and signature evidence recorded, the bundled npm recorded per pin change, and a CI consistency check required of `KR-BINC-001-017`. It is a recommendation for the Backend Technical Lead, not a decision.
5. TypeScript 7.0.2 is deferred to a later decision record. The repository owner agreed to this in session on 2026-10-11. It is not a recorded approval, and this package no longer treats the TypeScript 7.0.2 check as a condition of approval.
6. Owner direction of 2026-10-11 (decision record Section 5.2), not an approval: pin method proposal A with a digest-pinned container image added later for deployment; Fastify as the preferred candidate for `KR-BINC-001-003`; node-pg-migrate, graphile-migrate and dbmate as the shortlist for `KR-BINC-001-004`. The framework and migration tool remain decisions of those tasks. Section 6.4 of the decision record lists what each shortlisted tool declares.

## 6. Options and Trade-offs

| Option | Assessment |
|---|---|
| Node.js 22 | Maintenance LTS with end of life on 2027-04-30. Too short for a new codebase |
| Node.js 24 | LTS now, supported to 2028-04-30. Recommended |
| Node.js 26 | Current today, LTS from 2026-10-28, supported to 2029-04-30. A valid alternative once it is LTS. Costs nothing to switch before application code exists |
| TypeScript 6.0.3 | Stable. Recommended baseline |
| TypeScript 7.0.2 | Latest. Not adopted until the compatibility check passes |

## 7. Required Evidence and Review Questions

Compatibility evidence gathered on 2026-10-10 from npm registry metadata. The table shows what each package declares. It is not proof that a tool works; the executed check follows the table.

| Package | Version seen | Declared Node.js range | Declared TypeScript range | Admits Node.js 24 | Admits TypeScript 6.0.3 | Admits TypeScript 7.0.2 |
|---|---|---|---|---|---|---|
| typescript | 6.0.3 | >=14.17 | Not applicable | Yes | Not applicable | Not applicable |
| typescript | 7.0.2 | >=16.20.0 | Not applicable | Yes | Not applicable | Not applicable |
| typescript-eslint | 8.71.1 | ^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0 | >=4.8.4 <6.1.0 | Yes | Yes | No (outside the declared range) |
| eslint | 10.12.0 | ^20.19.0 \|\| ^22.13.0 \|\| >=24 | None declared | Yes | Not declared | Not declared |
| vitest | 5.0.3 | ^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0 | None declared | Yes | Not declared | Not declared |
| fastify | 5.12.5 | None declared | None declared | Not declared | Not declared | Not declared |
| express | 5.3.0 | >= 18 | None declared | Yes | Not declared | Not declared |
| hono | 4.13.13 | >=16.9.0 | None declared | Yes | Not declared | Not declared |
| @nestjs/core | 12.1.2 | >= 20 | None declared | Yes | Not declared | Not declared |
| pg (PostgreSQL driver) | 8.23.1 | >= 16.0.0 | None declared | Yes | Not declared | Not declared |
| node-pg-migrate | 9.0.0 | >=20.11.0 | None declared | Yes | Not declared | Not declared |

These are candidates that were looked up. They are not a shortlist, because the HTTP framework and migration tool tasks are not decided.

Findings:

1. Every declared Node.js range that was found admits Node.js 24. Fastify declares none.
2. The one declared TypeScript limit found is typescript-eslint, whose range includes 6.0.3 and excludes 7.0.x. This supports keeping 6.0.3 as the baseline until a later release declares support for 7.0.

Executed check, recorded 2026-10-11 in Section 6 of the decision record (sandbox, partial):

1. Done: a strict-mode TypeScript 6.0.3 sample compiled and ran under Node.js 24.21.0. TypeScript 6 requires an explicit `rootDir`.
2. Partly done: Node.js 24.21.0 was first used from the npm registry in a sandbox. It was then downloaded from nodejs.org and its SHA-256 matched the official manifest (decision record Section 6.2). The first run did not verify the manifest signature (key not in the keyring). A second run (Section 6.3) fetched the key by the full fingerprint copied from the `nodejs/node` README, confirmed that it equals the signing key, and verified both the detached and the clearsigned signature (valid, exit status 0). The key is not certified by a trusted signature in a web of trust, and its source and the README are both Node.js project channels. A pin method is proposed in Section 5.1 of the decision record and is not decided.
3. Information only: TypeScript 7.0.2 compiled the sample with no deprecated or removed option reported. TypeScript 7.0.2 is deferred and is not a condition of this approval.
4. Partly done: eslint 10.12.0 with typescript-eslint 8.71.1, vitest 5.0.3 and pg 8.23.1 ran under Node.js 24.21.0. The HTTP framework and migration tool are not decided. The first run used npm 10.9.4. A second run on the official distribution used the bundled npm 11.19.0 with install scripts disabled: `npm install`, a clean `npm ci`, typecheck, build, tests, eslint, vitest and the pg import all exited 0, and a mismatched lockfile made `npm ci` fail (Section 6.2). Linux x64 only, disposable project.

Approval waits for the Section 6 evidence of the decision record. The official checksum verification and the bundled npm check are now recorded. The repository owner required the signing key to be authenticated, and that is now recorded. The Backend Technical Lead should decide whether the recorded authentication is sufficient, the pin method and the framework and migration tool shortlist before approving, and the package manager support is recorded under KR-BINC-001-002. The check above does not replace that evidence.

Review questions:

1. Is Node.js 24 acceptable now, or should the record switch to Node.js 26 after 2026-10-28?
2. Do you confirm TypeScript 6.0.3 as the baseline with 7.0.2 deferred to a later decision record?
3. Do you approve, change or reject the proposed pin method (proposal A, with a digest-pinned container image as a later deployment addition) in Section 5.1 of the decision record, and which remaining Section 6 items must be recorded before approval?
4. The checksum matched and the manifest signature is valid for the key fingerprint published in the `nodejs/node` README (Section 6.3). The key has no web-of-trust certification. Is this level of authentication sufficient, and how should later releases signed by other releasers be handled?

## 8. Dependencies and Downstream Impact

- KR-BINC-001-002 depends on this decision.
- KR-BE-1-001 was blocked until this decision and KR-BINC-001-002 were approved. Both were approved on 2026-10-11.
- KR-BINC-001-003 must support the approved versions.
- Setup and CI documentation (KR-BINC-001-016 and KR-BINC-001-017) record the exact versions once approved.
- The Node.js support dates change over time and the version policy is reviewed before the end of life of the chosen line.

## 9. Required Approvers and Review Record

| Role | Review requested | Evidence |
|---|---|---|
| Backend Technical Lead | 2026-10-11 | This package and the decision record. The requester and the reviewer are the same person (Dinesh Annayya, acting as Backend Technical Lead). The outcome is recorded in the decision record, Approval Record, and not here |

The review round ended on 2026-10-11 and the package is Closed. The disposition is recorded in the decision record only: [KR-BINC-001-001 decision record, Approval Record](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md).

## 10. Approval Instructions

1. Review this package and the decision record.
2. Record the disposition, the approver role, the date, the accepted versions and the evidence in the Approval Record table of the decision record.
3. Keep the task In Review. The task changes status only under its own Definition of Done.
4. Set this package to Closed with a link to the recorded outcome.

## 11. References

- Task: KR-BINC-001-001 in the [B-INC-001 task register](../../increments/B-INC-001-SECURE-FOUNDATION/TASKS.md)
- Acceptance criterion: B-INC-001-AC-01 in the [acceptance criteria](../../increments/B-INC-001-SECURE-FOUNDATION/ACCEPTANCE_CRITERIA.md)
- Linked tests: BTS-001, BTS-036 (NOT RUN; this decision produces no executable code)
- Linked security gates: SEC-GATE-004, SEC-GATE-013 (not closed)
- [Readiness review](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/IMPLEMENTATION_READINESS.md)
- [Decision approvals README](../README.md)
