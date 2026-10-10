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

`split_milestones.py` and `fix_phase_labels.py` are one-off migration helpers that were used during the documentation closure; they are kept for reference and are not part of CI.
