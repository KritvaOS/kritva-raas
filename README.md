# kritva-raas

Kritva Robotic as Service

## Documentation

- [Documentation index](docs/README.md): the entry point for architecture, planning, milestones, security and tracking.
- [Phase model](planning/PHASES.md): canonical phases and milestone mapping.
- [Source header standard](docs/development/SOURCE_HEADER_STANDARD.md): the header every source file must carry.
- [Backend implementation planning](planning/backend/README.md): backend plan, task register, security gate, test strategy and increment dossiers B-INC-001 to B-INC-004.

## Validating documentation changes

Run both checkers before committing documentation changes:

    python3 scripts/docs/check_docs.py
    python3 scripts/docs/check_backend_traceability.py
    python3 scripts/lint/check_source_headers.py --mode tracked --strict

All three must pass. The second verifies that each backend increment dossier's acceptance criteria, tasks, test plan and per-task commit messages trace to each other exactly. The same checks run in CI on every push and pull request (`.github/workflows/docs-check.yml` and `.github/workflows/source-header-check.yml`). To run the header check before every commit, enable the hook with `git config core.hooksPath .githooks`.

Never commit secrets, private keys, tokens or credentials. See `planning/backend/BACKEND_SECURITY_GATE.md`.
