# kritva-raas

Kritva Robotic as Service

## Documentation

- [Documentation index](docs/README.md): the entry point for architecture, planning, milestones, security and tracking.
- [Phase model](docs/planning/PHASES.md): canonical phases and milestone mapping.
- [Backend implementation planning](docs/planning/backend/README.md): backend plan, task register, security gate, test strategy and increment dossiers B-INC-001 to B-INC-004.

## Validating documentation changes

Run both checkers before committing documentation changes:

    python3 scripts/docs/check_docs.py
    python3 scripts/docs/check_backend_traceability.py

Both must report 0 problems. The second verifies that each backend increment dossier's acceptance criteria, tasks, test plan and per-task commit messages trace to each other exactly. The same checks run in CI (`.github/workflows/docs-check.yml`) on every push and pull request.

Never commit secrets, private keys, tokens or credentials. See `docs/planning/backend/BACKEND_SECURITY_GATE.md`.
