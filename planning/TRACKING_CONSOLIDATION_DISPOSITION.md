# Tracking Consolidation Disposition

## Document Control

| Field | Value |
|---|---|
| Document | Tracking Consolidation Disposition |
| Path | `planning/TRACKING_CONSOLIDATION_DISPOSITION.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md) (step 7); [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md); [PLANNING_STATUS_VOCABULARY.md](PLANNING_STATUS_VOCABULARY.md) |

## 1. Purpose

Step 7 of the migration plan replaces restated status in `docs/tracking/` with links to canonical records. This document is the first pull request of step 7. It records, file by file, what each tracking file holds, which parts restate another record, what is proposed, and what the owner must decide first. It changes no tracking file and no status value.

## 2. Findings

1. The ten files in `docs/tracking/` total about 11,000 lines. Most of that is process text (purpose, scope, templates, escalation, cadence, checklists) and "initial baseline" tables in which every phase and milestone is NOT STARTED or NOT ASSESSED.
2. The same frozen phase and milestone inventory is restated in `STATUS.md` (Sections 6 to 10 and 21), `TASK_STATUS.md` (Sections 4 and 5), `MILESTONE_STATUS.md` (Sections 5, 6 and 8 to 11) and `PHASE_STATUS.md` (Sections 3 and 8 to 16). `PHASES.md` and the official milestone dossiers are the canonical records of that inventory.
3. The tracking files hold no task rows for the increment tasks (KR-BE-1-xxx). The increment `TASKS.md` files own them, so nothing there is duplicated for task status.
4. The risk register (about 56 initial risks) has unique entries. `ISSUE_LOG.md` holds only a structure and examples. `CHANGE_TRACKING.md` holds a structure and one change row, while the real change history is the PB entries in `BACKEND_CHANGELOG.md`. `DECISION_LOG.md` is an index with no verified entries yet.
5. The tracking baseline says NOT STARTED for milestones, while `docs/backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md` says `PLANNED` and defines its own READY, IN_PROGRESS lifecycle, and increment B-INC-001 work is in progress. Under [PLANNING_STATUS_VOCABULARY.md](PLANNING_STATUS_VOCABULARY.md) Section 5, PLANNED reads as NOT STARTED, so the two files agree today, but neither shows the work that is under way. This is a visibility gap, not a conflicting value.
6. Inbound links are many (CHANGE_TRACKING 36 files, RISK_REGISTER 17, TASK_STATUS 15, MILESTONE_STATUS 14, STATUS 13, others fewer). No file is moved or deleted in step 7, so no link changes.

## 3. Disposition by File

| File | Unique content | Restated content | Proposed disposition | Risk |
|---|---|---|---|---|
| `STATUS.md` | Status vocabulary, update procedure, review cadence, closure evidence rules | Sections 6 to 10 and 21: the phase and milestone inventory with initial statuses | Replace the inventory tables with links to `PHASES.md` and the dossiers; keep the rules and the dashboard frame | Medium: most-linked dashboard. Needs OD-TD-1 |
| `TASK_STATUS.md` | Task vocabulary (Section 7), acceptance rules, templates | Sections 4, 5 and 12 to 15: inventories and empty per-domain tables | Replace the inventories and empty tables with links; keep vocabulary and rules; add a link to the increment `TASKS.md` and the status report | Low: no task rows exist here |
| `MILESTONE_STATUS.md` | Vocabulary, review procedure, acceptance template | Sections 5, 6 and 8 to 11: per-domain baselines, all NOT STARTED or NOT ASSESSED | Replace the baselines with a link per domain to the dossier folders; keep rules | Medium: needs OD-TD-1 |
| `PHASE_STATUS.md` | Vocabulary, closure requirements, review template | Sections 3 and 8 to 16: per-phase baselines | Replace the baselines with links to `PHASES.md`; keep rules | Medium: needs OD-TD-1 |
| `DECISION_LOG.md` | Indexing rules, workflow, reconciliation checklist | Nothing indexed yet | Keep as an index of links. Populate only from verified ADRs (a separate change) | Low |
| `DEPENDENCY_TRACKING.md` | Dependency registers (Sections 9 to 12), escalation | Overlaps `planning/DEPENDENCY_MAP.md` and the backend dependency register | Keep registers; add a link to each canonical dependency record; no entry removed | Medium: needs a check of overlap first |
| `RISK_REGISTER.md` | The initial risk register (Sections 31 onward) | Scale and definition text only | Keep unchanged as the authoritative register | None |
| `ISSUE_LOG.md` | Structure; no real issues | Examples (Sections 24 to 29) | Keep unchanged. Mark examples as examples only if not already so | Low |
| `CHANGE_TRACKING.md` | Structure; one change row | Restates PB entries in intent | Keep unchanged. Add a link to `BACKEND_CHANGELOG.md` as the change history | Low |
| `AUDIT_RESPONSE_2026-10-10.md` | Dated audit response | None | Keep unchanged. Dated record | None |

## 4. What Does Not Change

Status values and their spelling, identifiers, phase names, milestone IDs, the risk, issue, change and audit records, the commit trailers, and the inbound links. Rules and templates stay in their files. `make check` and `make status-report` must give the same result before and after each pull request of step 7, apart from the changed file.

## 5. Proposed Pull Requests

| Pull request | Contents | Gate |
|---|---|---|
| 7a (this one) | This document, PB-053 | Owner decides OD-TD-1 to OD-TD-3 |
| 7b | `TASK_STATUS.md` | Link-only replacement of Sections 4, 5, 12 to 15; checks pass |
| 7c | `PHASE_STATUS.md` | After OD-TD-1 |
| 7d | `MILESTONE_STATUS.md` | After OD-TD-1 |
| 7e | `STATUS.md` | After 7b to 7d |
| 7f | `DEPENDENCY_TRACKING.md`, `DECISION_LOG.md`, `CHANGE_TRACKING.md` links | After the dependency overlap check |

Each pull request changes one file, is revertible on its own, and is checked by `make check` before and after.

## 6. Owner Decisions

| ID | Question | Recommendation |
|---|---|---|
| OD-TD-1 | Where is the canonical current status of a milestone and a phase? Today the tracking files show a NOT STARTED baseline and the dossiers show their own status | Milestone dossiers own milestone status and scope; `PHASES.md` owns the phase inventory; the tracking files keep rules and link to them. The dossier status is then updated when work starts, as a separate owner-reviewed change |
| OD-TD-2 | Replace baseline tables with links, or keep them as dated snapshots? | Replace with links. History stays in git and in the PB entries |
| OD-TD-3 | Should B-M01 show that B-INC-001 work is in progress? | Raise as a separate owner change after OD-TD-1. It is not part of step 7 |

## 7. Review

Written by Claude. No independent human review.
