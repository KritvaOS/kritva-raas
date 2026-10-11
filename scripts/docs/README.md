# Documentation tooling

Run from the repository root:

    python3 scripts/docs/check_docs.py        # consistency checks; exit 1 on any problem

Structural checks: retired phase/milestone names, canonical milestone folders, the standard six milestone files, broken relative links, references to non-existent `docs/...` files, missing H1 titles.

Semantic checks (errors):

- phase-to-milestone mapping tables in `PHASES.md` and `IMPLEMENTATION_ROADMAP.md` match the frozen model exactly;
- every milestone dossier declares a `**Primary Phase:**` equal to its frozen primary phase;
- milestone names are spelled canonically (and legacy milestone names are rejected);
- planning, tracking and milestone documents use `PN NAME` phase labels, never `Phase N`;
- P5 EXECUTION dossiers stay simulated-only, and P5 acceptance items never require physical capability;
- risk register phases are canonical identifiers, and physical-safety risks are not owned by P5 EXECUTION alone;
- priorities use `PRI-n`, never phase-like `Pn`;
- "MVP" in planning documents appears only as the primary product path, never as a phase or milestone.

Warnings (do not fail the run): bare `Phase N` labels in architecture, protocol, security, UI, database-schema and development documents, several of which follow a superseded phase model and need owner review.

Add it to CI so a stale phase name or broken reference fails the build.

`check_backend_approvals.py` validates the backend decision-approval packages under `planning/backend/decisions/approvals/` (file names, Document Control, required sections, package workflow status, the single canonical decision-record link, the authority sentence, task existence, and the decision-record vocabulary and consistency: an Approved record needs every required approver, each Approved with a date and evidence). Its unit tests are in `tests/backend_approvals/`. A passing run shows structural consistency only. It is not an approval and does not change any decision or task status.

`split_milestones.py` and `fix_phase_labels.py` are one-off migration helpers that were used during the documentation closure; they are kept for reference and are not part of CI.

`planning_root.py` is the one place that says where the planning documents live: `planning/` since step 3 of `planning/PLANNING_MIGRATION_PLAN.md` (it was `docs/planning/` before). `check_docs.py`, `check_backend_traceability.py` and `check_backend_approvals.py` use it, so they give the same result in either location. If both locations hold a `backend/` directory the checkers fail with a message, because that is a half-moved tree. Its tests are in `tests/planning_root/` (`make planning-root-test`).
