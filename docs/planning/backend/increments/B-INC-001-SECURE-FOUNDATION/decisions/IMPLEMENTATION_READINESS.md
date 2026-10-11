# B-INC-001 — Implementation Readiness Review

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 Implementation Readiness Review |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/IMPLEMENTATION_READINESS.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)
- [Increment changelog](../CHANGELOG.md)
- [Backend implementation plan](../../../BACKEND_IMPLEMENTATION_PLAN.md)
- [System decision register](../../../../DECISIONS.md)

## 1. Purpose

This record states whether application implementation for B-INC-001 SECURE FOUNDATION may start, lists the exact outstanding dependencies, and tracks the decision records produced in the `decisions/` directory. It is a planning record. It does not create a milestone, rename a task or approve any technology choice.

## 2. Current Readiness Decision

**Blocked for stack-dependent implementation.**

`KR-BINC-001-001` (runtime and language) and `KR-BINC-001-002` (package manager and lockfile policy) were approved by the Backend Technical Lead on 2026-10-11 (PB-024). `KR-BE-1-001` (Create Control Plane application structure) is not started: it waits for the owner answers listed in its plan (Section 3), and every other application-code task waits for it. The framework and the migration tool are still undecided (`KR-BINC-001-003` and `KR-BINC-001-004`). A decision record with status Proposed remains a recommendation, not an approval.

Work that needs no technology choice may proceed: the secret-handling policy (`KR-BINC-001-005`) and the decision records themselves.

## 3. Batch A — Decisions and Security Policy

Batch A is one planning batch. Each task keeps its own atomic commit and its own owner approval. The order follows the task dependencies. `KR-BINC-001-008` is held out of the first commit series (see below).

| Order | Task | Decision record | Required approvers | Depends on |
|---|---|---|---|---|
| 1 | KR-BINC-001-005 Secret-handling and configuration boundary | `KR-BINC-001-005-secret-handling-configuration.md` | Security Owner; Cloud/Infrastructure Owner review | None |
| 2 | KR-BINC-001-001 Runtime and language versions | `KR-BINC-001-001-runtime-language.md` | Backend Technical Lead | None |
| 3 | KR-BINC-001-002 Package manager and lockfile policy | `KR-BINC-001-002-package-manager-lockfile.md` | Backend Technical Lead | KR-BINC-001-001 approved |
| 4 | KR-BINC-001-008 Secret scanner selection | `KR-BINC-001-008-secret-scanner.md` (held, not yet committed) | Security Owner; Repository/CI Owner review | KR-BINC-001-005 |

Trace of each task (the exact union of its linked acceptance criteria, as recorded in `../TASKS.md`):

| Task | Acceptance | Tests | Security gates |
|---|---|---|---|
| KR-BINC-001-001 | B-INC-001-AC-01 | BTS-001, BTS-036 | SEC-GATE-004, SEC-GATE-013 |
| KR-BINC-001-002 | B-INC-001-AC-01, B-INC-001-AC-02 | BTS-001, BTS-036 | SEC-GATE-003, SEC-GATE-004, SEC-GATE-013 |
| KR-BINC-001-005 | B-INC-001-AC-04, B-INC-001-AC-12, B-INC-001-AC-14 | BTS-002, BTS-003, BTS-009, BTS-010 | SEC-GATE-002, SEC-GATE-008, SEC-GATE-009 |
| KR-BINC-001-008 | B-INC-001-AC-16 | BTS-010 | SEC-GATE-004, SEC-GATE-010 |

The linked tests and gates are traceability obligations. A decision-only commit does not execute them; their status stays NOT RUN or NOT IMPLEMENTED until the implementing tasks produce evidence.

`KR-BINC-001-008` is not a documentation-only task. Its Definition of Done requires a real scanner evaluation and a demonstrated synthetic detection. It is not closed by naming a tool.

Held: the first series does not include a scanner decision. A partial trial of one candidate (detect-secrets) found fail-open behavior on a missing file argument and on plain `scan`, and the other candidates (gitleaks, trufflehog) could not be run in the cloud sandbox because release downloads and the Go module proxy are blocked there. The task is committed after a comparative evaluation that also tests the intended local-hook and CI invocation, the fail-closed behavior for missing input, scanner errors and invalid configuration, and the history-scan capability.

Approval packages for the three decision records are in [`docs/planning/backend/decisions/approvals/`](../../../decisions/approvals/). They are review requests and are Draft. The decision records stay authoritative for the final disposition, and this review is not an approval register:

- [KR-BINC-001-001 runtime and language](../../../decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md)
- [KR-BINC-001-002 package manager and lockfile](../../../decisions/approvals/APPROVAL-KR-BINC-001-002-package-manager.md)
- [KR-BINC-001-005 secret handling and configuration](../../../decisions/approvals/APPROVAL-KR-BINC-001-005-secret-handling.md)

## 4. Batch B — Dependency Order

Batch B follows the task dependencies in `../TASKS.md`. It does not wait for every Batch A task, only for the approvals named in each step. Framework selection must not start before the application scaffold and the module-boundary review exist.

| Step | Work | Depends on | Notes |
|---|---|---|---|
| 1 | Approvals: `KR-BINC-001-001`, `KR-BINC-001-002` (Backend Technical Lead, with the compatibility check in the runtime record Section 6); `KR-BINC-001-005` (Security Owner, Cloud/Infrastructure Owner review) | Batch A records | 001 and 002 approved on 2026-10-11; `KR-BE-1-001` waits for the open plan answers |
| 2 | `KR-BE-1-001` Create Control Plane application structure | Step 1 approvals of 001 and 002 | Minimal reproducible scaffold; clean-checkout evidence retained before any criterion is claimed |
| 3 | `KR-BE-1-002` Define backend module boundaries | `KR-BE-1-001`; architecture review input | Architecture Owner review; unlocks the module-boundary dependency of 003 |
| 4 | `KR-BINC-001-003` Decide HTTP framework | `KR-BINC-001-001`; `KR-BE-1-002` | Decision record only; a representative route proves the boundaries. Full transport and routing come in `KR-BE-1-004` and `KR-BE-1-006` |
| 5 | `KR-BINC-001-004` Decide database migration tool | Database Technical Lead review; runtime and package compatibility | May run in parallel with step 4 unless a concrete compatibility dependency is found. A decision record is not an executed migration test |
| 6 | `KR-BINC-001-008` Secret scanner comparative evaluation | `KR-BINC-001-005` | May start at any time, in parallel. Held: needs gitleaks and trufflehog trials, the real local-hook and CI invocations, fail-closed behavior for missing input, scanner errors and invalid configuration, and the history-scan decision. Security Owner and Repository/CI Owner review before committing |

## 5. Outstanding Dependencies

| # | Dependency | Owner role | State |
|---|---|---|---|
| 1 | Runtime and language approval (KR-BINC-001-001) | Backend Technical Lead | Not recorded |
| 2 | Package-manager and lockfile approval (KR-BINC-001-002) | Backend Technical Lead | Not recorded |
| 3 | HTTP framework approval (KR-BINC-001-003) | Backend Technical Lead | Not recorded |
| 4 | Migration-tool approval (KR-BINC-001-004) | Database Technical Lead with Backend Technical Lead | Not recorded |
| 5 | Secret-handling policy review (KR-BINC-001-005) | Security Owner; Cloud/Infrastructure Owner | Not recorded |
| 6 | Secret scanner selection (KR-BINC-001-008) | Security Owner with Repository/CI Owner | Not recorded |

## 6. SYS-ADR-004

SYS-ADR-004 (Cross-domain security boundary enforcement) is Proposed in `docs/planning/DECISIONS.md` and requires Security Owner disposition before P3 CONTROL PLANE identity and authorization implementation starts. It is a prerequisite for B-INC-002 IDENTITY-ORGANIZATION. It is not a gate for the B-INC-001 foundation tasks, and B-INC-001 does not satisfy or close it.

## 7. Update Rules

1. Update this record when an outstanding dependency changes state, citing the approval evidence (approver role, date and record).
2. Change the readiness decision only when every dependency of the affected task is satisfied.
3. Do not mark a task Accepted because its decision record exists.
4. Keep this record free of secrets and credential-shaped values.
