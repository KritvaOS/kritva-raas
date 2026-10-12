# Planning Authority Matrix

## Document Control

| Field | Value |
|---|---|
| Document | Planning Authority Matrix |
| Path | `planning/PLANNING_AUTHORITY_MATRIX.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [PLANNING_ALIGNMENT_GAP_REPORT.md](PLANNING_ALIGNMENT_GAP_REPORT.md); [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md); [PHASES.md](PHASES.md) |

## 1. Purpose

Step 3 of the migration plan moved `docs/planning/` to `planning/`. The paths in this matrix are the paths after the move.

This matrix names, for each kind of planning record, the one document that is authoritative today and what happens to other documents that mention the same data. It describes the current state and the target state. It does not move or change any document.

## 2. Rules

1. One entity has one canonical record. Any other document that shows the same value is a view and MUST link to the canonical record.
2. A view MUST NOT hold a value that differs from the canonical record. Where the two differ, the canonical record is correct and the view is a defect.
3. A merged pull request, a passing CI run, a completed checklist or a status change is not acceptance. Acceptance needs the governing acceptance criteria and a recorded review decision.
4. A review by the implementation owner or by an AI agent MUST NOT be recorded as an independent human review.
5. Frozen phase names, official milestone identifiers, task identifiers and the exact commit trailers in increment dossiers are not renumbered or reworded by this alignment.

## 3. Authority by Record Type

| Record | Canonical today | Target canonical | Views and other mentions |
|---|---|---|---|
| Phase definitions (P0 to P8) | [PHASES.md](PHASES.md) | Same file, under `planning/` after the move | `docs/milestones/PHASE-*`, `PHASE_STATUS.md`: navigation and status only |
| Milestone scope and acceptance | The milestone dossier (`docs/backend/milestones/B-Mxx-*/`, other domains' equivalents) | Same | `MILESTONE_STATUS.md` shows status only |
| Increment scope, tasks, acceptance criteria, test plan, review checklist, commit contract | `planning/backend/increments/B-INC-00x-*/` | Same files | `BACKEND_TASK_REGISTER.md` is the register of identifiers and mappings; `TASK_STATUS.md` shows status |
| Task status | Increment `TASKS.md` | Same | `BACKEND_TASK_REGISTER.md`, `TASK_STATUS.md`, `STATUS.md`: views |
| Task acceptance criteria | Increment `ACCEPTANCE_CRITERIA.md` (B-INC-nnn-AC-nn) | Same | `docs/tasks/<ID>/ACCEPTANCE_CRITERIA.md` only for a task activated outside an increment |
| Test and evidence mapping | Increment `TEST_PLAN.md` (BTS-nnn) and `evidence/` | Same | Pull request comments are transcripts, not the record |
| Security gates | [BACKEND_SECURITY_GATE.md](backend/BACKEND_SECURITY_GATE.md) (SEC-GATE-nnn) and increment `SECURITY_REVIEW.md` | Same | `RISK_REGISTER.md` links to gates |
| Decision content | The decision record under `decisions/` of its domain, and `DECISIONS.md` for system-level decisions | Same | `DECISION_LOG.md` is an index and MUST NOT copy decision bodies or approval state |
| Decision approval | `planning/backend/decisions/approvals/` packages | Same | Task and increment documents link to the package |
| Planning change history | [BACKEND_CHANGELOG.md](backend/BACKEND_CHANGELOG.md) (PB-nnn) and increment `CHANGELOG.md` | Same | `CHANGE_TRACKING.md` MUST link rather than restate |
| Dependencies | `DEPENDENCY_MAP.md` and `BACKEND_DEPENDENCY_MAP.md` | Same | `DEPENDENCY_TRACKING.md` shows status only |
| Risks | `RISK_REGISTER.md` (program) and `BACKEND_RISK_REGISTER.md` (backend) | Same | Increment risk tables link to the register |
| Issues | `ISSUE_LOG.md` | Same | None |
| Next work and current plan | Not a record: [CURRENT_PLAN.md](CURRENT_PLAN.md) is a view that holds no status | Same | Links to the records that hold the status |
| Roles, reading order and agent rules | [README.md](README.md), [AGENT_RULES.md](AGENT_RULES.md), [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) | Same | They point to the owners of each rule and add no requirement |
| Roadmap and release plan | `IMPLEMENTATION_ROADMAP.md`, `RELEASE_ROADMAP.md` | Same | `PHASES.md` defines phases only |
| Resources and integration | `RESOURCE_PLAN.md`, `INTEGRATION_PLAN.md` and the backend plan | Same | None |
| Task backlog identifiers | Domain task files such as `docs/backend/planning/BACKEND_TASKS.md` | Same | `docs/tasks/README.md` documents the ID format |

## 4. Boundary Between Phase and Milestone

A phase is not a milestone. `PHASES.md` defines the frozen phase model and its relationship to milestones. Each milestone dossier owns its own scope and acceptance. A phase document MUST NOT restate the scope of a milestone.

## 5. Views That Are Candidates for Consolidation

| View | Today | Candidate disposition |
|---|---|---|
| `TASK_STATUS.md`, `MILESTONE_STATUS.md`, `PHASE_STATUS.md`, `STATUS.md` | Hand-maintained status tables | Keep a short summary linking to the canonical records, or generate it, after a consistency check exists |
| `DECISION_LOG.md` | Decision index | Keep as an index of links |
| `DEPENDENCY_TRACKING.md` | Dependency status | Keep only status that has no other home |
| `CHANGE_TRACKING.md` | Change tracking | Link to the PB entries |
| `RISK_REGISTER.md`, `ISSUE_LOG.md` | Registers with unique entries | Keep as authoritative registers |
| `docs/milestones/PHASE-*` | Phase milestone files | Keep only content that exists nowhere else; otherwise a link to `PHASES.md` and the official dossiers |
| `docs/tasks/` | README and template | See the Migration Plan |

This section is a candidate list. No disposition is final until the Migration Plan step for it is reviewed.
