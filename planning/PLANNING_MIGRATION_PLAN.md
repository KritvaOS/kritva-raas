# Planning Migration Plan

## Document Control

| Field | Value |
|---|---|
| Document | Planning Migration Plan |
| Path | `planning/PLANNING_MIGRATION_PLAN.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [PLANNING_ALIGNMENT_GAP_REPORT.md](PLANNING_ALIGNMENT_GAP_REPORT.md); [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md); [BACKEND_CHANGELOG.md](backend/BACKEND_CHANGELOG.md) (PB-047) |

## 1. Purpose

This plan sets the order of the pull requests that align the Kritva RaaS planning folder with `kritva-core` and `kritvaos-community`, the rules each pull request follows, and the checks that must pass before and after each one. It is a plan. Adopting it moves nothing.

## 2. Principles

1. Each pull request does one kind of change: a path move, a vocabulary change, or a consolidation. They are never combined.
2. Each pull request can be reverted on its own.
3. `make check` passes from a clean checkout before and after every pull request, and the transcript is posted as a pull request comment.
4. Nothing is renumbered or reworded in: frozen phase names, official milestone identifiers, task identifiers (KR-BINC, KR-BE, B-INC, BTS, SEC-GATE, PB), and the per-task commit-message sections of the increments. B-INC-001 and B-INC-002 use Section 9 for per-task commit messages; B-INC-003 and B-INC-004 use Section 6.
5. No status is changed because of a path move, and no acceptance is inferred from a merge or a label.
6. Where the meaning of an old status is unclear, the old value stays with a note. It is not converted.

## 3. Pull Request Sequence

| Step | Pull request | Contents | Gate |
|---|---|---|---|
| 1 | Gap report, authority matrix and migration plan (this change) | Three documents and PB-047. No move, no status change | Owner reviews the plan |
| 2 | Checker path configuration | `check_docs.py`, `check_backend_traceability.py`, `check_backend_approvals.py` and their tests read the planning root from one setting and accept both `docs/planning` and `planning`. No document moves | `make check` unchanged; new tests cover both locations |
| 3 | Move planning to the root | Move `docs/planning/` to `planning/` with `git mv`; rewrite links and `docs/planning/...` references with a script; leave a short stub README at the old location that points to `planning/`; update `Makefile`, workflows, README files and the handoff. Official milestone dossiers, architecture and protocol stay under `docs/` | `make check` passes before and after; the script's rewrite list is reviewed; the link count to moved files is zero outside the stub |
| 4 | Root entry documents | A README at the root of `planning/` (roles, reading order, authority), `CURRENT_PLAN.md`, `REVIEW_CHECKLIST.md`, `AGENT_RULES.md`, in the style of the other two repositories, drawn from existing rules | The files add no new requirement; each links to its source |
| 5 | Status vocabulary and legacy mapping | Define one vocabulary per entity (Section 4) and map every legacy value; update the backend task register and tasks lifecycle text to it. No task status changes | Every legacy value has a mapping or an explicit "not converted" note. Done in the vocabulary document |
| 6 | Status consistency check | A read-only report of task status differences between the increment records and their views, with explicit mappings. Report mode first; strict mode after the owner has reviewed the findings (OD-3) | The report runs on the repository without error; unit tests cover every mapping, unknown and legacy values, missing records, mismatches and non-promotion of ACCEPTED |
| 7 | Consolidate tracking | Replace restated status in `docs/tracking/` with links to canonical records or generated views, one file per pull request, using the dispositions in the Authority Matrix | Checker from step 6 passes; no register with unique entries is removed |
| 8 | Consolidate phase milestone folders and task folders | Reduce `docs/milestones/PHASE-*` to navigation where they hold no unique content; resolve `docs/tasks/` (Section 5) | Phase and milestone identifiers and acceptance requirements unchanged |
| 9 | Increment relocation, if wanted | Only if step 3 left the increments under `planning/backend/` in a shape that still differs from the other repositories | Traceability and approvals checks pass before and after |

**Progress:** step 1 merged (PR #44, PB-047), step 2 merged (PR #45, PB-048), steps 3 and 4 merged (PR #46 PB-049, PR #47 PB-050), step 5 merged (PR #48, PB-051), step 6 merged (PR #49, PB-052), step 7a is PB-053 ([TRACKING_CONSOLIDATION_DISPOSITION.md](TRACKING_CONSOLIDATION_DISPOSITION.md)). Steps 7b to 9 are not started.

Steps 2 and 3 are first because the later changes are then made once, in the final location.

## 4. Status Vocabulary (step 5)

Step 5 is [PLANNING_STATUS_VOCABULARY.md](PLANNING_STATUS_VOCABULARY.md). It adopts the vocabularies the repository already defines in `docs/tracking/` for tasks, milestones and phases, and maps the backend register, the tasks lifecycle and the two sibling repositories to them. It differs from the list first drafted in this plan in three ways: it keeps COMPLETE and CHANGES REQUESTED from the tracking task list (open owner decision OD-1 asks whether backend tasks use them), it keeps the decision lists as they are with a mapping between them, and it rewrites no written form of any status.

Task statuses in the repository today are not changed by the mapping. For example KR-BE-1-003 to KR-BE-1-007 stay In Review.

## 5. The `docs/tasks/` Folder

Per-task folders were never created, although tasks KR-BE-1-001 to KR-BE-1-007 are implemented and their scope and criteria already live in the increment dossier. Creating seven folders would make a second editable copy. The plan is:

1. Increment `TASKS.md` and `ACCEPTANCE_CRITERIA.md` stay canonical for tasks inside an increment.
2. `docs/tasks/<ID>/` is used for a task that is activated outside an increment, and is described that way in its README.
3. If a task is moved into a task folder, the increment keeps a link in place of the content. Two copies never stay authoritative.
4. KR-BE-1-008 is a reasonable first candidate for a pilot because it is not yet started. This is a decision for a later review.

## 6. Validation Required Before Each Step

| Check | Command |
|---|---|
| Source headers | `make header-test header-check` |
| Documentation structure, phases, milestones, links | `make docs-check` (0 problems; the warning count is recorded as a baseline and must not increase without a note) |
| Backend traceability | `make traceability-check` |
| Approval packages | `make approvals-test approvals-check` |
| Whole set | `make check` |

Evidence for each step is `make check` output on Node.js 24.21.0 from a clean checkout, posted as a pull request comment. A sandbox run on another Node.js version is feasibility only.

## 7. Rollback

Each pull request is one revert. The path move in step 3 is a rename plus a rewrite script. The rollback is a revert of that merge, which restores `docs/planning/` and the previous links, because step 2 keeps the checkers reading both locations.

## 8. Excluded From Early Steps

| Item | Reason |
|---|---|
| Renumbering task, acceptance, test, gate or change identifiers | Traceability and trailers depend on them |
| Changing commit-message sections or trailers | Contractual for the increments |
| Rewriting historical statuses or the historical PB-001 entry | Would imply evidence that did not exist at the time |
| Removing registers with unique entries | Risk and issue records have no other home |
| Changing decisions, approvals or any task acceptance | Owner decisions; not part of a structure change |

## 9. Review Record

This plan was drafted by Claude and reviewed by ChatGPT as an AI inspection. The owner made the scope and location decisions. No independent human review has taken place.
