# Planning Status Vocabulary and Legacy Mapping

## Document Control

| Field | Value |
|---|---|
| Document | Planning Status Vocabulary and Legacy Mapping |
| Path | `planning/PLANNING_STATUS_VOCABULARY.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md) (step 5); [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md); [PLANNING_ALIGNMENT_GAP_REPORT.md](PLANNING_ALIGNMENT_GAP_REPORT.md); [BACKEND_TASK_REGISTER.md](backend/BACKEND_TASK_REGISTER.md) |

## 1. Purpose

The repository and the two sibling repositories use several status lists. The same word can mean different things, and different words can mean the same thing. This document names one vocabulary per kind of entity, says where it is defined, and maps every other value in use to it.

It defines nothing new where the repository already has a vocabulary. It changes no status. No file is rewritten to use a different spelling. A mapping here is a reading rule, not an instruction to edit a record.

## 2. Rules

1. Each entity type has one vocabulary. A value from another entity type is not used for it (a decision is not ACCEPTED in the task sense, a task is not Approved).
2. Spelling and meaning are separate steps. First, values are compared ignoring case and treating a space, an underscore and a hyphen as the same (In Review, IN REVIEW and IN_REVIEW are one value). Second, an explicit mapping by entity type gives the meaning. There is no fuzzy matching. A value that is not in the mapping is reported as unknown, never turned into a convenient one. A displayed or normalized value never replaces the source status.
3. A status is changed only when evidence supports it. A merged pull request, a branch or a passing subset of tests is not evidence of acceptance.
4. Acceptance is its own state. Task status and acceptance state are tracked separately where the tracking records do so.
5. FROZEN, RELEASED and CLOSED describe a gate, a release or a formal closure. They are not synonyms for ACCEPTED.
6. A value whose meaning is unclear is not converted. It stays as written, with a note, until the owner says what it meant.
7. A status that records a review states who reviewed. Owner review and AI inspection are not independent human review.

## 3. Task

Canonical vocabulary: [TASK_STATUS.md](../docs/tracking/TASK_STATUS.md) Section 7. Acceptance state is Section 8 of the same file.

| Status | Meaning in short |
|---|---|
| NOT STARTED | Work has not started |
| READY | Scope, owner, dependencies and acceptance criteria are clear enough to begin |
| IN PROGRESS | Work is being done |
| BLOCKED | A named dependency, decision or resource prevents progress |
| IN REVIEW | Implementation and evidence are available for review. Acceptance is pending |
| CHANGES REQUESTED | Review found changes needed before acceptance |
| ACCEPTED | The acceptance criteria pass and the acceptance is recorded |
| COMPLETE | Accepted and every closure action done |
| DEFERRED | An approved decision postpones the task |
| CANCELLED | An approved decision removes the task |

Acceptance state: NOT ASSESSED, PENDING, BLOCKED, ACCEPTED, ACCEPTED WITH EXCEPTIONS, REJECTED, NOT APPLICABLE.

Legacy values and how to read them:

| Where | Value | Read as | Note |
|---|---|---|---|
| [BACKEND_TASK_REGISTER.md](backend/BACKEND_TASK_REGISTER.md) Section 3 and the increment `TASKS.md` files | Proposed | NOT STARTED | In a progress view only, and with the note "not approved for execution" kept. NOT STARTED says nothing about authorization. Ready reads as READY, so the two stay distinct |
| same | Ready, In Progress, Blocked, In Review, Accepted, Deferred | READY, IN PROGRESS, BLOCKED, IN REVIEW, ACCEPTED, DEFERRED | Same meaning, different case |
| same | Rejected | Not converted | Rejected can mean a proposal was declined or planned work was stopped. It reads as CANCELLED only where the recorded disposition shows that planned work was stopped (OD-2). Otherwise it stays Rejected and is reported for the owner to reconcile |
| [docs/tasks/README.md](../docs/tasks/README.md) | BACKLOG | NOT STARTED | |
| same | READY, BLOCKED, ACCEPTED | READY, BLOCKED, ACCEPTED | |
| same | IN_PROGRESS, REVIEW | IN PROGRESS, IN REVIEW | |
| same | CANCELLED | CANCELLED | |
| kritva-core `MASTER_TRACKER.md` | NOT DEFINED, PLANNED | NOT STARTED | PLANNED there means scope is defined but not started |
| same | IN PROGRESS, REVIEW, ACCEPTED, BLOCKED | IN PROGRESS, IN REVIEW, ACCEPTED, BLOCKED | |
| same | FROZEN, RELEASED | Not a task status | They describe a gate or a release (Section 5) |
| kritvaos-community `TASKS.md` | PLANNED | NOT STARTED | |
| same | Done | Not converted | Check the evidence first. It can mean implemented, reviewed or accepted |

The backend register has no CHANGES REQUESTED or COMPLETE. Per OD-1 (Section 8) backend tasks use CHANGES REQUESTED and do not use COMPLETE. The review loop is IN REVIEW, then CHANGES REQUESTED, then IN PROGRESS, then IN REVIEW. A task returns to IN REVIEW only when the requested corrections are done and the evidence is resubmitted. A new commit or a merged pull request does not move it. Task status and acceptance state stay separate: a task can be IN REVIEW while acceptance is PENDING, and a rejected review is never recorded as acceptance.

Current values stay as written: for example the backend tasks that read In Review are IN REVIEW, and KR-BE-1-001, which reads Accepted, is ACCEPTED by the owner's record and is not an independent acceptance.

## 4. Decision

Four separate lists exist, and they describe different things.

| List | Where | Values | Describes |
|---|---|---|---|
| Decision disposition | The decision record `Status`, checked by `check_backend_approvals.py` | Proposed, Approved, Rejected, Returned for revision, Superseded | The outcome of a decision under the approval workflow |
| Approval package workflow | The approval package `Status` ([decisions/README.md](backend/decisions/README.md) Section 4) | Draft, Requested, Closed, Withdrawn | The state of the request for approval. It never carries a disposition |
| System decision register | [DECISIONS.md](DECISIONS.md) Section 3.4 | Proposed, Accepted, Rejected, Superseded, Withdrawn | System-level architecture decisions |
| Decision index | [DECISION_LOG.md](../docs/tracking/DECISION_LOG.md) Section 4 | PROPOSED, UNDER REVIEW, ACCEPTED, REJECTED, SUPERSEDED, WITHDRAWN, RETIRED | The index of decisions |

Mapping between them:

| Decision record | System register | Index |
|---|---|---|
| Proposed | Proposed | PROPOSED, or UNDER REVIEW once the approvers have been asked |
| Approved | Accepted | ACCEPTED |
| Rejected | Rejected | REJECTED |
| Returned for revision | Proposed | PROPOSED, with the revision noted |
| Superseded | Superseded | SUPERSEDED |
| Not applicable | Withdrawn | WITHDRAWN |

Approved (a decision) and ACCEPTED (a task) are different things. An Approved decision does not make a task ACCEPTED, and a task being ACCEPTED does not approve a decision. The index may not copy a decision body or an approval state that differs from the decision record.

## 5. Milestone, Phase, Gate and Release

Canonical vocabularies: [MILESTONE_STATUS.md](../docs/tracking/MILESTONE_STATUS.md) Section 4 and [PHASE_STATUS.md](../docs/tracking/PHASE_STATUS.md) Section 4 (the same eight values), and [STATUS.md](../docs/tracking/STATUS.md) Section 3.

| Status | Meaning in short |
|---|---|
| NOT STARTED | No verified work has started |
| IN PROGRESS | Work is underway with an owner and a next action |
| BLOCKED | A dependency, decision, resource or approval prevents progress |
| IN REVIEW | Deliverables are available for formal review |
| ACCEPTED | The exit criteria are met and the acceptance is recorded |
| COMPLETE | Accepted and closure requirements met |
| DEFERRED | An approved decision postpones the work |
| NOT APPLICABLE | A criterion does not apply, with an approved reason |

A milestone also has an acceptance state (NOT ASSESSED, PENDING, BLOCKED, ACCEPTED, ACCEPTED WITH EXCEPTIONS, REJECTED). A milestone may be IN REVIEW while acceptance is PENDING. It is not COMPLETE while acceptance is pending or blocked.

| Where | Value | Read as |
|---|---|---|
| kritva-core `MASTER_TRACKER.md` | NOT DEFINED, PLANNED | NOT STARTED |
| same | IN PROGRESS, REVIEW, ACCEPTED, BLOCKED | IN PROGRESS, IN REVIEW, ACCEPTED, BLOCKED |
| same | FROZEN | A gate: a contract or boundary was formally frozen. Not a milestone status |
| same | RELEASED | A release: the release and remote-verification steps are done. Not a milestone status |
| kritvaos-community milestone `Status` | PLANNED | NOT STARTED |
| Increment `MILESTONE.md` files | Proposed | Document status (Section 7), not a milestone status. An increment is a planning unit, not an official milestone |

## 6. Dependency, Risk, Issue and Change

Each already has its own list. They are kept as written and are not mapped to the task list.

| Entity | Where | Values |
|---|---|---|
| Dependency | [DEPENDENCY_TRACKING.md](../docs/tracking/DEPENDENCY_TRACKING.md) Section 8 | IDENTIFIED, ASSESSING, OPEN, IN PROGRESS, AT RISK, BLOCKED, READY FOR VALIDATION, RESOLVED, CANCELLED, SUPERSEDED |
| Dependency readiness for a task | [MILESTONE_STATUS.md](../docs/tracking/MILESTONE_STATUS.md) Section 12.1 | NOT STARTED, IN PROGRESS, BLOCKED, AVAILABLE FOR INTEGRATION, ACCEPTED, NOT APPLICABLE |
| Risk | [RISK_REGISTER.md](../docs/tracking/RISK_REGISTER.md) Section 24 | IDENTIFIED, ASSESSED, MITIGATION_PLANNED, MITIGATION_IN_PROGRESS, MONITORED, MATERIALIZED, ESCALATED, ACCEPTED, CLOSED, RETIRED, SUPERSEDED |
| Issue | [ISSUE_LOG.md](../docs/tracking/ISSUE_LOG.md) Section 18 | OPEN, TRIAGED, ASSIGNED, IN_PROGRESS, RESOLVED, VERIFIED, CLOSED, DUPLICATE, REJECTED, DEFERRED, WONT_FIX, REOPENED |
| Change request | [CHANGE_TRACKING.md](../docs/tracking/CHANGE_TRACKING.md) Section 11 | PROPOSED, TRIAGED, ASSESSMENT, APPROVAL_PENDING, APPROVED, REJECTED, DEFERRED, IMPLEMENTING, VERIFICATION, COMPLETED, CANCELLED, SUPERSEDED |

Words that appear in more than one list do not carry over. ACCEPTED in the risk list means the residual risk was accepted. RESOLVED in the dependency list means the consumer verified the condition. A planning change entry in [BACKEND_CHANGELOG.md](backend/BACKEND_CHANGELOG.md) (PB-nnn) uses the document status below.

## 7. Document Status

The `Status` field in a Document Control table describes the document, not the work.

| Value | Meaning | Use |
|---|---|---|
| Proposed | The document is under review and is not authority for implementation where a contract, decision or security review is unresolved | Most planning documents and PB entries |
| Planning baseline | A baseline for planning, with the limits stated in the document | `INTEGRATION_PLAN.md`, `RESOURCE_PLAN.md` |
| Draft, Requested, Closed, Withdrawn | Approval package workflow | Approval packages only (Section 4) |
| Approved, Accepted | An approval or acceptance recorded in the document itself, with its date and who | Decision records and the acceptance notes in tasks |

A Proposed document does not become authority because the pull request that carries it is merged.

## 8. Owner Decisions

Decided by the Backend Technical Lead on 2026-10-12, after the recommendations were reviewed by ChatGPT (AI inspection, not independent human review). The review added the refinements shown.

| ID | Question | Decision |
|---|---|---|
| OD-1 | Do backend tasks adopt CHANGES REQUESTED and COMPLETE from the tracking list? | Adopt CHANGES REQUESTED, with the exit rule in Section 3. Do not use COMPLETE for a backend task. A task ends at ACCEPTED and closure belongs to the milestone |
| OD-2 | Does Proposed in the backend register become NOT STARTED in written form? | No. The written forms stay. Proposed reads as NOT STARTED only in a progress view and keeps its authorization note. Rejected reads as CANCELLED only where the recorded disposition shows that planned work was stopped |
| OD-3 | How does the status consistency check compare written forms? | Normalize spelling, then apply an explicit mapping by entity type. Never infer ACCEPTED. Report mismatches, unknown values, duplicates and missing records separately. Start report-only. Move to strict mode only after the owner has reviewed the findings and the canonical record of each type is clear |

The report is `scripts/docs/check_status_consistency.py` (`make status-report`). It is read-only and runs in report mode. Strict mode (`--strict`) exists and is not enabled in CI.
