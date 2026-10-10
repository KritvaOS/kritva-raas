# Documentation tooling

Run from the repository root:

    python3 scripts/docs/check_docs.py        # consistency checks; exit 1 on any problem

Checks: retired phase/milestone names, canonical milestone folders, the standard six milestone files, broken relative links, references to non-existent `docs/...` files, missing H1 titles.

Add it to CI so a stale phase name or broken reference fails the build.

`split_milestones.py` and `fix_phase_labels.py` are one-off migration helpers that were used during the documentation closure; they are kept for reference and are not part of CI.
