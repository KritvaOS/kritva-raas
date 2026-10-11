# Approval Package — KR-BINC-001-001 Runtime and Language Versions

## 1. Document Control

| Field | Value |
|---|---|
| Document | Approval Package for KR-BINC-001-001 Runtime and Language Versions |
| Path | `docs/planning/backend/decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md` |
| Status | Draft |
| Owner role | Backend Technical Lead |
| Decision ID | KR-BINC-001-001 |
| Task ID | KR-BINC-001-001 |
| Increment | B-INC-001 |
| Revision | 1 (2026-10-10) |

Status here is the package workflow status (Draft, Requested, Closed, Withdrawn). The decision disposition is recorded in the decision record.

## 2. Purpose and Requested Disposition

This package asks the Backend Technical Lead to review the runtime and language recommendation and record one of: Approved, Rejected, or Returned for revision. An approval must name the exact versions and the compatibility evidence it accepts. Nothing here is approved yet.

## 3. Canonical Decision Record

[KR-BINC-001-001 Runtime and Language Versions](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md)

The decision record is authoritative for the final disposition. The outcome is recorded in its Approval Record table and not in this package.

## 4. Decision Scope

Covers: the Node.js line and pinning rule, the TypeScript baseline and upgrade candidate, and the version policy for the backend repository.

Does not cover: the package manager (KR-BINC-001-002), the HTTP framework (KR-BINC-001-003), the migration tool (KR-BINC-001-004), or any application code. Approving this decision does not accept the task and does not close a security gate.

## 5. Recommendation Summary

Proposed until approved:

1. Node.js 24 LTS (Krypton), pinned to an exact patch version in the repository and in CI.
2. TypeScript 6.0.3 as the initial baseline, pinned exactly. TypeScript 7.0.2 is an upgrade candidate that needs its own decision record after a compatibility check.
3. One supported Node.js major at a time, recorded in one place and mirrored by package metadata, a local version file and CI. Patch and security updates are taken as reviewed changes.

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
2. Partly done: Node.js 24.21.0 was the release used, taken from the npm registry. The pin method is not decided, and the release has not been verified against the official nodejs.org checksums.
3. Done for one sample: TypeScript 7.0.2 compiled it with no deprecated or removed option reported.
4. Partly done: eslint 10.12.0 with typescript-eslint 8.71.1, vitest 5.0.3 and pg 8.23.1 ran under Node.js 24.21.0. The HTTP framework and migration tool are not decided. npm 10.9.4 was used, not the npm bundled with Node.js 24.21.0.

Approval waits for the Section 6 evidence of the decision record. The Backend Technical Lead should not approve until the pinned Node.js release, its pin method and its official checksum verification are recorded, and the package manager support is recorded under KR-BINC-001-002. The check above does not replace that evidence.

Review questions:

1. Is Node.js 24 acceptable now, or should the record switch to Node.js 26 after 2026-10-28?
2. Is TypeScript 6.0.3 the right baseline given the evidence above?
3. Which remaining Section 6 items must be recorded before approval, beyond those listed above?

## 8. Dependencies and Downstream Impact

- KR-BINC-001-002 depends on this decision.
- KR-BE-1-001 stays blocked until this decision and KR-BINC-001-002 are approved.
- KR-BINC-001-003 must support the approved versions.
- Setup and CI documentation (KR-BINC-001-016 and KR-BINC-001-017) record the exact versions once approved.
- The Node.js support dates change over time and the version policy is reviewed before the end of life of the chosen line.

## 9. Required Approvers and Review Record

| Role | Review requested | Evidence |
|---|---|---|
| Backend Technical Lead | Not yet requested | This package and the decision record |

The review request date is recorded here when the package moves to Requested. The disposition is not recorded here.

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
