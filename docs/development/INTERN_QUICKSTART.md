# Kritva RaaS Intern Quickstart

## Document Control

| Field | Value |
|---|---|
| Document | Intern Quickstart |
| Path | `docs/development/INTERN_QUICKSTART.md` |
| Audience | New human contributors and interns. AI agents follow [`planning/AGENT_RULES.md`](../../planning/AGENT_RULES.md) as well |
| Status | Proposed. Commands marked UNVERIFIED have not been run on the pinned Node.js release by the author |
| Authority | A reading guide. It owns no rule. Each rule below names the record that owns it, and that record wins if they differ |

## 1. Read this first: what exists today

| Area | Today | Where |
|---|---|---|
| Backend | Application code exists: HTTP transport, configuration, request context, response and error contract. No domain modules and no database access yet | `apps/backend/` |
| Frontend (Studio, web console) | Plans and architecture only. No code | `docs/frontend/`, `docs/ui/` |
| Database | Plans and architecture only. No code | `docs/database/` |
| Cloud | Plans and architecture only. No code | `docs/cloud/` |
| Lab Agent, robots, hardware | Outside this repository. Only the protocol and architecture boundary is described here | `docs/protocol/`, `docs/architecture/LAB_ARCHITECTURE.md` |

Do not look for Studio, Tauri, PostgreSQL, Docker or simulator setup. They are planned. [`DEVELOPMENT_SETUP.md`](DEVELOPMENT_SETUP.md) describes the planned environment, not one you can run today.

Two newer designs are not implemented and not yet reviewed in detail: direct workstation-to-destination artifact transfer (`docs/architecture/DIRECT_ARTIFACT_TRANSFER.md`, SYS-ADR-008) and direct Anthropic API access for the coding agent (`docs/architecture/CODING_AGENT_INTEGRATION.md`, Section 5.10). Some older documents still describe the superseded cloud-storage artifact route; each carries a notice saying so.

A document that describes a design is not proof that it is built, and an architecture baseline is not an owner approval. Task status lives in the increment `TASKS.md` records.

## 2. Set up (backend only)

```bash
git clone https://github.com/KritvaOS/kritva-raas.git
cd kritva-raas
git switch main
cat .node-version          # the pinned Node.js release
node --version             # must match; the install refuses another version
make help
make hooks-install         # enables the commit-message hook
```

The repository checks and the backend tests are two different things:

| Command | What it proves | What it does not prove |
|---|---|---|
| `make check` | Repository records, documentation links, source headers, traceability and approval checks pass | That the backend builds or its tests pass |
| `cd apps/backend && npm ci --ignore-scripts && npm run typecheck && npm test` | The backend type-checks and its tests pass | Anything about documentation or governance records |

`make build` and `make test` at the repository root fail on purpose until the toolchain decisions are recorded. Do not read that failure as a problem with your setup, and do not read `make check` passing as a tested application.

Verification status of these commands: UNVERIFIED on Node.js 24.21.0 by the author of this guide. Run them on a clean checkout and report the result to the repository owner so this note can be updated.

## 3. Pick a task you are allowed to start

1. Open [`planning/CURRENT_PLAN.md`](../../planning/CURRENT_PLAN.md) for the active increment, then its `TASKS.md`.
2. Only start a task whose status is READY: scope, owner, dependencies and acceptance criteria are clear ([`planning/PLANNING_STATUS_VOCABULARY.md`](../../planning/PLANNING_STATUS_VOCABULARY.md)). PROPOSED does not mean ready, even if the task looks simple.
3. Check the task's dependencies are done and read its acceptance criteria and linked tests.
4. If the task is not READY, or you are unsure, stop and ask the task owner. Do not start it and do not pick another from the roadmap.

You should be able to say, before writing code: what the task is, which files you expect to change, and how success will be shown.

## 4. Make the change

- Work on a branch named by type, for example `docs/short-description` or `feat/short-description`. Never push to `main`. Never force-push a shared branch.
- Keep the change to one task or one concern. Do not refactor unrelated code or record an architecture decision inside a task change.
- Add or update tests for behavior you change. Update the authoritative document in the same change when a fact moves; do not copy facts into a second file.
- Do not send source code or prompts to an external service without the consent and policy the architecture requires. Keep physical-robot work simulation-first unless an approved task and its safety gate say otherwise.
- Never commit secrets, keys, tokens, production data or personal data. If you do by mistake, tell the Security Owner at once. Removing it later does not make it safe.

## 5. Commit and pull request text

The commit rule is owned by [`AGENTS.md`](../../AGENTS.md) and the increment `GIT_COMMIT_STEP.md` (Section 4). In short:

```text
<type>(<scope>): <imperative summary> [<TASK-ID>]

Optional short reason.

Tasks: <TASK-ID>
Acceptance: <acceptance criteria IDs>
Tests: <test IDs, or NOT-RUN with the reason>
Security-Gates: <gate IDs, or NOT-APPLICABLE with the reason>
Evidence: <checks you actually ran and inspected>
```

- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `perf`, `revert`, `security`.
- The `Tasks`, `Acceptance`, `Tests` and `Security-Gates` lines must equal the task's entry in its `TASKS.md`. The traceability checker enforces it.
- A docs or chore commit that implements no task uses `Tasks: None (reason)` and `Not applicable` for the other trace lines.
- Never write that a test or gate passed unless you ran it.
- Do not add `Claude-Session:` trailers or session links. A `Co-Authored-By:` line is allowed.

Check before you push:

```bash
make check
python3 scripts/security/check_commit_format.py --range origin/main..HEAD
python3 scripts/security/check_commit_messages.py --range origin/main..HEAD
```

Open the pull request with the repository's template (`.github/PULL_REQUEST_TEMPLATE.md`). Fill every heading: say what is out of scope, which acceptance criteria the change meets with evidence, what you actually ran, and what remains. Write "Not applicable" instead of deleting a heading. State plainly when linked tests were not run.

## 6. Review, merge and acceptance

- A pull request needs the required checks (`secret-scan`, `commit-message-check`) and Code Owner review. You cannot approve your own pull request.
- Passing CI does not mean the task is accepted. Merging a pull request does not mean the task is accepted.
- Acceptance of a task is a separate record made by the accountable owner in the task and acceptance records. A change that needs acceptance says so in the pull request and leaves the status to that owner.
- Who reviews: architecture changes need the architecture and domain reviewer; changes to artifact transfer, authentication, or the coding agent need the Security Owner; changes to cloud or Lab protocol contracts need the matching domain reviewer. The repository owner or named acceptance authority records acceptance. An AI review is advice, not a review or acceptance.
- Contributors do not close security gates, and do not change a task's status inside an unrelated change.

## 7. Evidence and handoff

Record in the pull request what you ran (command, Node version, exit status, short result), what you could not run and why, open decisions, known limits, and the next action. Never mark a check PASS that you did not run. A command in this guide is unverified on Node.js 24.21.0 until you have run it there.

## 8. First-week check

A new contributor should be able to do the following without verbal help beyond access:

1. Say which areas have code and which have plans only.
2. Set up the backend from a clean checkout and explain the difference between `make check` and the backend tests.
3. Find one READY task, its dependencies, acceptance criteria and linked tests.
4. Make one small change on a branch that follows the commit and pull request rules above.
5. Say who reviews the change and who records acceptance.

If any step needs guessing, the documentation has a gap. Report it to the repository owner rather than working around it.

## 9. Where to go next

| Need | Document |
|---|---|
| How planning is organised and which file owns which fact | [`planning/README.md`](../../planning/README.md) |
| Backend structure, commands and pins | [`apps/backend/README.md`](../../apps/backend/README.md) |
| Folder layout and owner roles (proposed) | [`docs/REPOSITORY_STRUCTURE.md`](../REPOSITORY_STRUCTURE.md) |
| Branching and review rules | [`BRANCHING_STRATEGY.md`](BRANCHING_STRATEGY.md), [`CODE_REVIEW.md`](CODE_REVIEW.md) |
| Testing strategy | [`TESTING_STRATEGY.md`](TESTING_STRATEGY.md) |
| Security reporting | [`SECURITY.md`](../../SECURITY.md) |
