# Backend Decision Approvals

## Document Control

| Field | Value |
|---|---|
| Document | Backend Decision Approvals README |
| Path | `docs/planning/backend/decisions/README.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; C-M01 FOUNDATION |

## Related documents

- [Backend planning README](../README.md)
- [Backend changelog](../BACKEND_CHANGELOG.md)
- [B-INC-001 readiness review](../increments/B-INC-001-SECURE-FOUNDATION/decisions/IMPLEMENTATION_READINESS.md)
- [B-INC-001 commit procedure](../increments/B-INC-001-SECURE-FOUNDATION/GIT_COMMIT_STEP.md)

## 1. Purpose and Scope

This directory is the shared entry point for requesting and tracking owner approval of backend decisions. It serves every backend increment (B-INC-001 to B-INC-004) and later backend decisions that are not tied to one increment. It adds a review workflow. It does not approve any decision, change any task status, or add a milestone.

## 2. Directory Structure

| Location | Holds |
|---|---|
| `docs/planning/backend/increments/<increment>/decisions/` | The canonical decision records. They stay where they were created |
| `docs/planning/backend/decisions/approvals/` | One approval package per decision: the review request sent to the approver |
| `docs/planning/backend/decisions/README.md` | This process description and the list of packages |

An approval package is a review brief. It is not a second decision record.

## 3. Canonical Authority

The decision record in its increment `decisions/` directory is the single source of truth for the final disposition, the approver roles, the dates, the rationale and the approval evidence. Each package links to exactly one decision record and states: "The decision record is authoritative for the final disposition."

A package never carries its own final disposition. When an approver decides, the outcome is written in the Approval Record table of the decision record only. The package then moves to Closed and keeps its link to that record. If the approver returns a decision for revision, the outcome is recorded in the decision record, the recommendation is revised, and a new review round is recorded as a new revision of the package. Earlier outcomes are kept, not overwritten.

## 4. Two Separate Vocabularies

Package workflow status (the package Document Control Status):

| Status | Meaning |
|---|---|
| Draft | The package is being prepared and is not ready for owner review |
| Requested | The required approvers have been asked to review it |
| Closed | The review round has ended. The outcome is in the decision record |
| Withdrawn | The request was withdrawn before a decision was recorded |

Decision disposition (the decision record Status):

| Disposition | Meaning |
|---|---|
| Proposed | A recommendation exists and has not been approved |
| Approved | The authorized approvers explicitly accepted the decision and its stated scope |
| Rejected | The authorized approver explicitly rejected the recommendation |
| Returned for revision | The approver requires changes before deciding |
| Superseded | A later, identified decision replaces this one |

Each row of a decision record Approval Record uses Pending, Approved, Rejected or Returned for revision. A decision becomes Approved only when every required role has recorded approval and the stated conditions are met. A pending security or cloud review is never treated as approval because another approver agreed.

## 5. Relationship to Task Statuses

The task statuses stay Proposed, Ready, In Progress, Blocked, In Review and Accepted, and they are recorded only in the increment `TASKS.md`. The approval vocabularies above are not task statuses and do not promote one. An Approved decision does not make its task Accepted. The task is accepted only when its own Definition of Done and required evidence are met.

These states stay separate: docs checks passed, decision reviewed, decision approved, task accepted, gate closed. A merged documentation pull request, a green check run or a Closed package is not an approval.

## 6. Package Naming and Template

File name: `APPROVAL-<DECISION-ID>-<slug>.md`. For a task-backed decision the Decision ID is the existing task ID. For a later decision that has no task, use its canonical decision ID, for example `SYS-ADR-004`, and set the Task ID to Not applicable. An ID in a file name is a reference to an existing task, never a new task definition.

Required Document Control fields: Document, Path, Status, Owner role, Decision ID, Task ID, Increment, Revision.

Required sections, in order:

1. Document Control
2. Purpose and Requested Disposition
3. Canonical Decision Record
4. Decision Scope
5. Recommendation Summary
6. Options and Trade-offs
7. Required Evidence and Review Questions
8. Dependencies and Downstream Impact
9. Required Approvers and Review Record
10. Approval Instructions
11. References

## 7. Current Approval Packages

| Package | Decision record | Approver roles | Package status |
|---|---|---|---|
| [APPROVAL-KR-BINC-001-001-runtime-language.md](approvals/APPROVAL-KR-BINC-001-001-runtime-language.md) | [KR-BINC-001-001](../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md) | Backend Technical Lead | Draft |
| [APPROVAL-KR-BINC-001-002-package-manager.md](approvals/APPROVAL-KR-BINC-001-002-package-manager.md) | [KR-BINC-001-002](../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-002-package-manager-lockfile.md) | Backend Technical Lead | Draft |
| [APPROVAL-KR-BINC-001-005-secret-handling.md](approvals/APPROVAL-KR-BINC-001-005-secret-handling.md) | [KR-BINC-001-005](../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-005-secret-handling-configuration.md) | Security Owner; Cloud/Infrastructure Owner review | Requested |

Recommended order: the runtime decision first, then the package-manager decision, which depends on it. The secret-handling review does not depend on either.

## 8. Change Control and Validation

`scripts/docs/check_backend_approvals.py` validates the package file names, Document Control fields, section list, status vocabulary, canonical link, task existence, the authority sentence, the absence of a package-level disposition, the decision-record vocabulary and consistency (an Approved record must have an Approval Record row for every required approver listed in its Task Record, each Approved with a date and evidence, so a Pending, Rejected, Returned for revision or missing required approver fails), and this list. `make check` and the `docs-check` workflow run it, with its unit tests under `tests/backend_approvals/`.

A passing run shows that the structure is consistent. It does not show that an owner approved a decision, that a linked test ran, or that a security gate closed.
