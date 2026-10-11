# Planning Alignment Gap Report

## Document Control

| Field | Value |
|---|---|
| Document | Planning Alignment Gap Report |
| Path | `planning/PLANNING_ALIGNMENT_GAP_REPORT.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md); [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md); [PHASES.md](PHASES.md); [BACKEND_CHANGELOG.md](backend/BACKEND_CHANGELOG.md) (PB-047) |
| Compared repositories | `KritvaOS/kritva-core` (`planning/`), `KritvaOS/kritvaos-community` (`planning/`) |

## 1. Purpose and Scope

This report was written before step 3 of the migration plan moved `docs/planning/` to `planning/`. File paths below were updated to the new location. The comparison table keeps the old location because it describes the state that was compared.

The owner asked that the planning folder and files of Kritva RaaS be aligned with the other Kritva repositories. This report records what was compared, where Kritva RaaS differs, what it must keep, and what the owner decided.

Owner decisions:

| Decision | Choice |
|---|---|
| Scope | Conventions and shape: file set, headings, status vocabulary, per-increment layout, task and acceptance-criteria structure, and the README and index. RaaS-specific content stays |
| Location | Move the planning documents to a root `planning/` directory, as in the other two repositories |
| Overlaps | Consolidate `docs/tracking/`, `docs/tasks/` and `docs/milestones/` |
| Delivery | This report and migration contract first, then small follow-up pull requests per change area |

This report changes no path, no status and no identifier. It is a contract for later changes.

## 2. Review Basis and Limits

| Item | State |
|---|---|
| Method | Structure and status-vocabulary comparison of the three repositories, read from clean clones, and an AI review by ChatGPT of the live files |
| Reviewers | Claude (author) and ChatGPT (external AI reviewer). The owner is the decision maker |
| Independence | This is AI inspection plus an owner decision. It is not an independent human review |
| Not done | `make check` was not run against the other two repositories. Not every file in every directory was audited |

## 3. What Was Compared

| Area | kritva-core | kritvaos-community | kritva-raas |
|---|---|---|---|
| Planning location | `planning/` at the root | `planning/` at the root | `docs/planning/` plus `docs/planning/backend/` (before the move in PB-049) |
| Entry point | `README.md` (roles, reading order) and `MASTER_TRACKER.md` | `README.md` (current milestone) and `CURRENT_PLAN.md` | `planning/backend/README.md`; no root entry point |
| Agent and review rules | `REVIEW_CHECKLIST.md`, `GIT_COMMIT_STEP.md` | `AGENT_RULES.md`, `REVIEW_CHECKLIST.md` | Per increment: `REVIEW_CHECKLIST.md`, `GIT_COMMIT_STEP.md`. No program-level file |
| Roadmap and dependencies | In the master tracker and milestone files | `ROADMAP.md`, `DEPENDENCIES.md`, `DECISIONS.md` | `IMPLEMENTATION_ROADMAP.md`, `DEPENDENCY_MAP.md`, `DECISIONS.md` (large, several thousand lines) |
| Milestone package | `milestones/KF-CORE-Rnn/` with milestone, sequence, requirements, design, review, freeze and gate files | `milestones/KOS-In/` with milestone, tasks table, implementation plan, test plan, acceptance, architecture, demo plan, changelog | Official dossiers under `docs/backend/milestones/` and `docs/milestones/`; execution under `planning/backend/increments/B-INC-00x/` |
| Per-task folders | `tasks/<ID>/TASK.md` and `ACCEPTANCE_CRITERIA.md` | Acceptance per increment | `docs/tasks/` has a README and `_TEMPLATE` only; no task folder exists |
| Status tracking | `MASTER_TRACKER.md` | `TASKS.md` table | `docs/tracking/` (ten files, about 11,000 lines) and increment `TASKS.md` |
| Change history | Per milestone | `CHANGELOG.md` | `BACKEND_CHANGELOG.md` with PB-nnn entries, plus increment changelogs |

## 4. Gaps, Ranked

| Rank | Gap | Effect | Planned fix |
|---|---|---|---|
| 1 High | The same status can be held in several places: increment `TASKS.md`, `BACKEND_TASK_REGISTER.md`, `docs/tracking/TASK_STATUS.md`, `MILESTONE_STATUS.md`, `PHASE_STATUS.md` and `STATUS.md` | Values drift. A merged change can update one copy only | One canonical record per entity. Other files become short views or are generated (Section 5 of the Authority Matrix) |
| 2 High | Several status vocabularies (Section 6) | The same word means different things; a mapping error can read as acceptance | One vocabulary per entity type, with a legacy mapping that never converts a historical value without evidence |
| 3 Medium | No root `planning/` and no program-level current plan, review checklist, agent rules or commit-step file | A reader cannot find the active plan; the roles of Claude, ChatGPT and the owner are only in the handoff | Root `planning/` with README, CURRENT_PLAN, REVIEW_CHECKLIST, AGENT_RULES |
| 4 Medium | `docs/tasks/` promises per-task folders that were never created, although KR-BE-1-001 to KR-BE-1-007 are implemented | The documented structure does not match the repository | Resolve per Section 5 of the Migration Plan; do not create seven empty duplicates |
| 5 Medium | `docs/tracking/` is large and hand-maintained | Review cost is high and some content is a re-statement of planning documents | Consolidate: keep unique registers, replace restated status with links or generated views |
| 6 Medium | `docs/milestones/PHASE-*` and `docs/backend/milestones/` overlap in scope | Two dossiers can describe the same work | Keep official milestone identities; reduce phase folders to navigation unless they hold unique content |
| 7 Low | No per-increment implementation plan or sequence file as in kritva-core | Sequencing is in the backend plan and increment `MILESTONE.md` only | Not needed now. Revisit when B-INC-002 starts |

## 5. What RaaS Keeps

Kritva RaaS is stricter than both comparison repositories in the following areas. They are not reduced by this alignment.

| Control | Where it lives |
|---|---|
| Decision-approval packages with owner roles, evidence and unresolved dispositions | `planning/backend/decisions/approvals/`, checked by `check_backend_approvals.py` |
| Task to acceptance criterion to test to security-gate traceability and exact commit trailers | Increment `TASKS.md`, checked by `check_backend_traceability.py` |
| Security gates (SEC-GATE-nnn) and increment security reviews | `BACKEND_SECURITY_GATE.md`, increment `SECURITY_REVIEW.md` |
| PB-nnn planning change records and per-increment changelogs | `BACKEND_CHANGELOG.md`, increment `CHANGELOG.md` |
| Frozen P0 to P8 phase names and official milestone identities | `PHASES.md`, checked by `check_docs.py` |
| Honest review labels: a merged pull request or a status change is not acceptance, and an AI or owner review is not independent human review | Increment review checklists and the approval packages |

## 6. Status Vocabularies in Use Today

| Location | Entity | Values |
|---|---|---|
| `docs/tracking/TASK_STATUS.md` Section 7 | Task | NOT STARTED, READY, IN PROGRESS, BLOCKED, IN REVIEW, CHANGES REQUESTED, ACCEPTED, COMPLETE, DEFERRED, CANCELLED |
| `docs/tracking/MILESTONE_STATUS.md` Section 4 | Milestone | NOT STARTED, IN PROGRESS, BLOCKED, IN REVIEW, ACCEPTED, COMPLETE, DEFERRED, NOT APPLICABLE; separate acceptance state NOT ASSESSED, PENDING, BLOCKED, ACCEPTED, ACCEPTED WITH EXCEPTIONS, REJECTED |
| `planning/backend/BACKEND_TASK_REGISTER.md` | Backend task | Proposed, Ready, In Progress, Blocked, In Review, Accepted, Deferred, Rejected |
| `docs/tasks/README.md` | Task lifecycle | BACKLOG, READY, IN_PROGRESS, REVIEW, ACCEPTED, BLOCKED, CANCELLED |
| `planning/DECISIONS.md` Section 3.4 | System decision | Proposed, Accepted, Rejected, Superseded, Withdrawn |
| `docs/tracking/DECISION_LOG.md` Section 4 | Decision index | PROPOSED, UNDER REVIEW, ACCEPTED, REJECTED, SUPERSEDED, WITHDRAWN, RETIRED |
| kritva-core `MASTER_TRACKER.md` | Milestone and task | NOT DEFINED, PLANNED, IN PROGRESS, REVIEW, ACCEPTED, FROZEN, RELEASED, BLOCKED |
| kritvaos-community `TASKS.md` | Task | PLANNED, Done |

The internal finding is that the tracking folder already defines a fuller task and milestone vocabulary than the backend register uses. The migration plan therefore starts from the tracking vocabulary and does not invent a new one.

## 7. Findings From the Review

ChatGPT recommended borrowing the comparison repositories' conventions (one planning entry point, milestone packages, explicit roles, stable documents separated from active planning) while keeping the stricter RaaS controls, and starting with a documentation-only contract. ChatGPT placed the move to a root `planning/` last. The owner decided to move it, so the Migration Plan moves it early, after the checkers can read both locations and before the vocabulary and consolidation changes, so those changes are made once in the final location.

ChatGPT's proposed vocabulary was not based on the vocabularies already present in `docs/tracking/`. The Migration Plan corrects that by building on the existing ones.
