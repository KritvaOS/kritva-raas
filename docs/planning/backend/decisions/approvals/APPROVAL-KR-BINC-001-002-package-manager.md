# Approval Package — KR-BINC-001-002 Package Manager and Lockfile Policy

## 1. Document Control

| Field | Value |
|---|---|
| Document | Approval Package for KR-BINC-001-002 Package Manager and Lockfile Policy |
| Path | `docs/planning/backend/decisions/approvals/APPROVAL-KR-BINC-001-002-package-manager.md` |
| Status | Closed |
| Owner role | Backend Technical Lead |
| Decision ID | KR-BINC-001-002 |
| Task ID | KR-BINC-001-002 |
| Increment | B-INC-001 |
| Revision | 3 (2026-10-11) |

Status here is the package workflow status (Draft, Requested, Closed, Withdrawn). The decision disposition is recorded in the decision record.

## 2. Purpose and Requested Disposition

This package asks the Backend Technical Lead to review the package manager and lockfile recommendation and record one of: Approved, Rejected, or Returned for revision. The review follows the runtime decision (KR-BINC-001-001), and an approval must reference the approved runtime. This package is Closed. The outcome is recorded in the decision record, which is the only source of the disposition.

## 3. Canonical Decision Record

[KR-BINC-001-002 Package Manager and Lockfile Policy](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-002-package-manager-lockfile.md)

The decision record is authoritative for the final disposition. The outcome is recorded in its Approval Record table and not in this package.

## 4. Decision Scope

Covers: the choice of one package manager, the lockfile and install rules, the exact-pin rule and the install-script policy.

Does not cover: the runtime versions, any application dependency choice, or the CI workflow, which a later task adds. Approving this decision does not accept the task and does not close a security gate.

## 5. Recommendation Summary

Recommendation (approved by the Backend Technical Lead on 2026-10-11, see the decision record): npm, using the version bundled with the approved Node.js release.

1. One package manager only, and a different manager's lockfile is rejected.
2. A committed `package-lock.json` is the single source of resolved versions.
3. CI and clean-checkout verification use `npm ci`, never `npm install`.
4. Direct dependencies are pinned to exact versions, `engines` match the approved Node.js version and `engine-strict` is enabled.
5. Dependency install scripts run only when reviewed, and CI installs disable them by default with a documented allowlist.
6. No registry credential is committed. A private-registry token comes from the CI secret store.

## 6. Options and Trade-offs

| Criterion | npm | pnpm |
|---|---|---|
| Setup | Bundled with Node.js, so no extra bootstrap step | Needs a separate pinned install |
| Reproducible install | `npm ci` fails when the lockfile and `package.json` disagree | `pnpm install --frozen-lockfile` is the equivalent |
| Dependency strictness | Flat layout, so undeclared imports can resolve | Isolated layout, so undeclared imports fail |
| Familiarity | Highest | Moderate |

Both meet the requirements. The choice is setup simplicity against dependency strictness. The cost of switching is lowest before the first lockfile exists.

## 7. Required Evidence and Review Questions

Evidence in the decision record (2026-10-10): npm 12.2.0 is the registry latest with a declared Node.js range of `^22.22.2 || ^24.15.0 || >=26.0.0`; Node.js 24.21.0 bundles npm 11.19.0; pnpm 12.11.2 is the registry latest and declares Node.js >=18. The evidence is version and range metadata only. It does not show lockfile behavior.

Executed check (2026-10-11, disposable project, Linux x64, bundled npm 11.19.0 of the official Node.js 24.21.0; decision record Section 3): `npm install` and a clean `npm ci` with install scripts disabled both worked, and a mismatched lockfile made `npm ci` exit 1 with an "in sync" error. The release signature behind that Node.js was first not verified and was then verified against the key fingerprint published by the Node.js project (KR-BINC-001-001 record, Sections 6.2 and 6.3).

Not yet demonstrated, and produced by later tasks: a clean checkout that installs with `npm ci` and runs the baseline build and tests (KR-BE-1-001 and KR-BINC-001-017), and a mismatched lockfile that fails in CI (the local behavior is shown above).

Review questions:

1. Is npm acceptable, or does the owner prefer pnpm for its stricter dependency resolution?
2. Is the bundled npm version acceptable, or should a separately pinned npm version be used?
3. Is approval conditional on the later clean-checkout evidence?

## 8. Dependencies and Downstream Impact

- Depends on KR-BINC-001-001 being approved first.
- KR-BE-1-001 stays blocked until this decision and KR-BINC-001-001 are approved.
- The `build`, `test`, `lint`, `format` and `format-check` Make targets are wired to npm scripts later and keep failing until then.
- If pnpm is chosen, Section 5 of the decision record is rewritten before approval.
- Setup documentation (KR-BINC-001-016) uses the approved commands only.

## 9. Required Approvers and Review Record

| Role | Review requested | Evidence |
|---|---|---|
| Backend Technical Lead | 2026-10-11 | This package and the decision record. The requester and the reviewer are the same person (Dinesh Annayya, acting as Backend Technical Lead). The outcome is recorded in the decision record, Approval Record, and not here |

The review round ended on 2026-10-11 and the package is Closed. The disposition is recorded in the decision record only: [KR-BINC-001-002 decision record, Approval Record](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-002-package-manager-lockfile.md).

## 10. Approval Instructions

1. Wait for the runtime decision outcome, then review this package and the decision record.
2. Record the disposition, the approver role, the date, the chosen package manager and the evidence in the Approval Record table of the decision record, referencing the approved runtime.
3. Keep the task In Review. The task changes status only under its own Definition of Done.
4. Set this package to Closed with a link to the recorded outcome.

## 11. References

- Task: KR-BINC-001-002 in the [B-INC-001 task register](../../increments/B-INC-001-SECURE-FOUNDATION/TASKS.md)
- Acceptance criteria: B-INC-001-AC-01 and B-INC-001-AC-02 in the [acceptance criteria](../../increments/B-INC-001-SECURE-FOUNDATION/ACCEPTANCE_CRITERIA.md)
- Linked tests: BTS-001, BTS-036 (NOT RUN)
- Linked security gates: SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 (not closed)
- [Readiness review](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/IMPLEMENTATION_READINESS.md)
- [Decision approvals README](../README.md)
