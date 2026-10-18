# kritva-raas

Kritva Robotic as a Service (RaaS). This repository holds the consolidated plan and architecture for the RaaS frontend, backend, database and cloud domains, the backend application code, and the planning, security and governance records that control how the work is done.

This README describes structure and method. It deliberately holds no task status, dates, people or version numbers, because those change and live in canonical records. Where a fact can go stale, this file points to the record that owns it.

## 1. Where to start

Read in this order:

1. [`planning/README.md`](planning/README.md): how planning is organised and which file owns which kind of fact.
2. [`planning/CURRENT_PLAN.md`](planning/CURRENT_PLAN.md): the ordered next work and the active increment.
3. [`planning/PLANNING_AUTHORITY_MATRIX.md`](planning/PLANNING_AUTHORITY_MATRIX.md): the one canonical record for each kind of record.
4. [`planning/PLANNING_STATUS_VOCABULARY.md`](planning/PLANNING_STATUS_VOCABULARY.md): what each status word means.
5. [`AGENTS.md`](AGENTS.md) and [`planning/AGENT_RULES.md`](planning/AGENT_RULES.md): working rules for anyone, human or agent, who changes the repository.
6. [`apps/backend/README.md`](apps/backend/README.md): how the running backend is built and operated.
7. [`docs/README.md`](docs/README.md): the documentation index.
8. [`docs/REPOSITORY_STRUCTURE.md`](docs/REPOSITORY_STRUCTURE.md): proposed repository structure and ownership map, pending human review. The authority matrix remains authoritative.

## 2. Folder structure

    kritva-raas/
    ├── apps/
    │   └── backend/                 the control-plane backend (Node.js, TypeScript)
    │       ├── src/
    │       │   ├── main.ts, run.ts  entry point and process wiring
    │       │   ├── config/          the only place settings are read and validated
    │       │   ├── shared/          infrastructure with no module or framework imports (request context)
    │       │   └── transport/       HTTP layer; the only code that imports the web framework
    │       └── tests/               mirrors src/
    ├── planning/                    what is being planned and executed
    │   ├── README.md, CURRENT_PLAN.md, PHASES.md, DECISIONS.md, roadmaps, authority and status-vocabulary files
    │   └── backend/
    │       ├── BACKEND_*.md         plan, task register, acceptance criteria, test strategy, security gate, risks, changelog
    │       ├── decisions/           decision records and approval packages
    │       └── increments/B-INC-00x-*/   one execution dossier per increment
    ├── docs/                        stable requirements, contracts and architecture
    │   ├── architecture/            system-wide and per-domain architecture
    │   ├── protocol/                API contract, envelopes, responses, error codes, events, idempotency
    │   ├── security/                threat model, authorization, tenant isolation, secrets and key management
    │   ├── ui/                      UI specification, design system, UI acceptance criteria
    │   ├── backend/ database/ cloud/ frontend/   per-domain architecture, development, planning and milestone dossiers
    │   ├── milestones/              program phase dossiers
    │   ├── development/             setup, workflow, branching, code review, testing, source header standard
    │   ├── tracking/                tracking rules and templates (being consolidated into planning/)
    │   └── tasks/                   task package template for work outside an increment
    ├── scripts/
    │   ├── docs/                    documentation, traceability, approval and status checkers
    │   ├── lint/                    source header checker
    │   ├── security/                commit message checker
    │   └── status/                  generator for status/status.json
    ├── status/                      generated program status report (never edit by hand)
    ├── tests/                       unit tests for the checkers above
    ├── .github/                     CODEOWNERS and CI workflows
    ├── .githooks/                   pre-commit and commit-msg hooks
    ├── Makefile                     the local commands (run `make help`)
    ├── .node-version                the pinned Node.js version
    ├── AGENTS.md, SECURITY.md, LICENSE

Rule of thumb: `docs/` says what the backend is and must do; `planning/` says what is being done about it and in what order.

Scope: this is a software-only repository. Frontend, database and cloud have plans and architecture here; only the backend has application code today (`apps/backend`). There is no firmware, hardware, mechanical or electronic design, build or test flow here. The lab and robot side of the product appears only as an external boundary described by the protocol and architecture documents. Program-level records live elsewhere (see `AGENTS.md`).

Who owns each folder and file group is defined in [`planning/PLANNING_AUTHORITY_MATRIX.md`](planning/PLANNING_AUTHORITY_MATRIX.md) (the ownership section is proposed and pending owner acceptance).

## 3. Architecture definition

The authoritative backend architecture documents are `docs/architecture/BACKEND_ARCHITECTURE.md`, `API_ARCHITECTURE.md` and `SECURITY_ARCHITECTURE.md`, and the wire contracts under `docs/protocol/`. This section summarises the rules every change must respect.

**Layers, from the outside in**

| Layer | Location | Rule |
|---|---|---|
| Transport | `apps/backend/src/transport` | The only code that imports the web framework. Builds the server, mounts route groups, owns the response and error contracts, and the request-context hook |
| Domain modules | added per task | Each exposes one route group with one path root (lower-case, hyphen-separated; roots may not overlap). A module maps its own domain errors to registry error codes before they reach the transport |
| Shared infrastructure | `apps/backend/src/shared` | Imports no module and no framework. Holds request-scoped context carried through `AsyncLocalStorage` |
| Configuration | `apps/backend/src/config` | The only place settings are read. Invalid configuration fails before the server listens, and failure messages name the setting, never its value |
| Persistence | per the database decision records | PostgreSQL. Tests of database behaviour must use the real database, not only mocks |

**API conventions (REST API v1)**

- Everything is served under `/api/v1`; any other prefix is 404.
- Every response with a body, success or error, uses one envelope defined in `docs/protocol/RESPONSES.md`. Error codes come from `docs/protocol/ERROR_CODES.md`.
- The server generates a request ID per request and returns it in a response header and in the body. Client-supplied IDs are ignored.
- Error bodies never carry internal messages, stack traces or submitted values.
- Matching is exact: no trailing slash, no case folding. A known path with the wrong method is 405; an unknown path is 404.

**Cross-cutting rules**

- Secrets, keys and credentials are governed by `docs/security/SECRETS_MANAGEMENT.md`, `docs/security/KEY_MANAGEMENT.md` and `planning/backend/BACKEND_SECURITY_GATE.md`. Do not build secrets handling that those records have not approved.
- Technology choices are decisions. A choice is not a project standard until its decision record is approved (`planning/backend/decisions/`).
- Tenant isolation, authorization and audit behaviour are defined in `docs/security/`; features touching them need negative tests.

## 4. Milestones and increments

Work is organised in three levels, each with one owner document. The frozen phase model (P0 to P8) is defined only in `planning/PHASES.md` and is not repeated here.

| Level | What it is | Canonical record |
|---|---|---|
| Phase | A program stage | `planning/PHASES.md`; dossiers in `docs/milestones/` |
| Milestone | A domain deliverable: `B-M01` to `B-M07` (backend), `DB-M01` to `DB-M04` (database), `C-M01` to `C-M04` (cloud), `F-M01` to `F-M07` (frontend) | The milestone's own `MILESTONE.md` under `docs/<domain>/milestones/` |
| Increment | The unit of backend execution: `B-INC-001 SECURE FOUNDATION`, `B-INC-002 IDENTITY ORGANIZATION`, `B-INC-003 PROJECTS PLATFORM CATALOG`, `B-INC-004 AUDIT TRANSACTIONS IDEMPOTENCY` | `planning/backend/increments/B-INC-00x-*/` |

Each increment dossier holds the same files: `MILESTONE.md`, `TASKS.md`, `ACCEPTANCE_CRITERIA.md`, `TEST_PLAN.md`, `SECURITY_REVIEW.md`, `REVIEW_CHECKLIST.md`, `GIT_COMMIT_STEP.md` and `CHANGELOG.md`.

Which increment is active, and what comes next, is in `planning/CURRENT_PLAN.md`. Do not start a later increment until the work and dependencies before it have been reviewed (`planning/backend/README.md`).

## 5. Task list

- **Where tasks live.** The task list for an increment is its `TASKS.md`. That file owns each task's scope, linked acceptance criteria, tests and security gates, and its status. The program-level register is `planning/backend/BACKEND_TASK_REGISTER.md`.
- **Task IDs.** `KR-BINC-001-nnn` for increment-level foundation tasks and `KR-BE-1-nnn` for backend feature tasks, so one ID is unique across the repository. - **Related IDs.** `B-INC-001-AC-nn` (acceptance criteria), `BTS-nnn` (test specifications), `SEC-GATE-nnn` (security gates), `PB-nnn` (planning changes in the changelog), `OD-n` and decision IDs (owner decisions).
- **Reading status.** Use the status words defined in `planning/PLANNING_STATUS_VOCABULARY.md`. Keep these states separate: checks passed, decision reviewed, decision approved, task accepted, gate closed. A merged pull request or a green check is none of the last three.
- **Program view.** `status/status.json` is generated by `scripts/status/gen_status.py`. Regenerate it; never edit it by hand. `make status-report` prints status differences between records and views.
- **Picking up work.** Take the next item in `planning/CURRENT_PLAN.md`, open its task in the increment `TASKS.md`, and implement only what that task and its acceptance criteria say. If the scope is unclear, ask the Backend Technical Lead instead of widening it.

## 6. Regression flow

Every change passes the same gates in this order. A failure at any gate stops the change.

1. **Before you edit.** Work on a branch cut from the current `main`. Install the hooks once with `make hooks-install`.
2. **While you work.** Run the focused tests for what you touch. For the backend, from `apps/backend`:

       npm ci --ignore-scripts   # install exactly from package-lock.json
       npm run typecheck         # tsc --noEmit
       npm run build             # compile to dist/
       npm test                  # build, then run every compiled test

3. **Before you commit.** The `pre-commit` hook runs the source header check, and the `commit-msg` hook rejects forbidden message content. Inspect your change with `git status --short`, `git diff --check` and `git diff --cached`; the staged set must contain only the intended task's files.
4. **Before you open a pull request.** From the repository root:

       make check            # header, docs, traceability, approvals, planning-root and status tests
       make status-gen-check # checks status/status.json against the planning records

   `make status-report` is read-only and shows status differences between records and views. Both `make check` and the report prove that documents and records agree with each other. They do not prove a decision was approved, a gate closed or a task accepted.
5. **In CI.** The workflows in `.github/workflows/` run on every push and pull request: `docs-check`, `source-header-check`, `secret-scan` (gitleaks), `commit-message-check` and `status-report`. Which checks are required on `main` is set in the repository ruleset; see `AGENTS.md`. Do not add allowlist entries to silence the secret scan; propose them to the owner with the reason.
6. **Review.** Use `planning/REVIEW_CHECKLIST.md`. An AI review is recorded as an AI review, never as independent human review, and each reviewer's claim is verified against the files before it is applied.
7. **Acceptance.** Only the Backend Technical Lead accepts a task or approves a decision, in the canonical record, after the governing criteria are met and evidence is recorded.

**Test levels and evidence.** `planning/backend/BACKEND_TEST_STRATEGY.md` defines the levels (static checks, unit, contract, integration, security, end-to-end, performance baseline, manual review) and the numbered gates `BTS-001` onward. Rules that apply to every test:

- A test that is skipped, blocked or not run is never reported as passing; write NOT-RUN with the reason.
- Test results record the revision, command, environment and tool versions.
- Security and authorization tests include negative cases; tests of failure behaviour are required, not optional.
- Fixtures use synthetic data only, never real credentials or production data.
- At increment acceptance, the full required suite runs and the evidence package in the increment `TEST_PLAN.md` is assembled.

## 7. Git commit text and method

**Method**

- Work on a branch and open a pull request. Never push to `main`; never force-push a shared branch or rewrite history without the owner's explicit approval.
- One atomic implementation commit per task wherever practical. Do not combine unrelated tasks to reduce commit count. If one fix must span tasks, list every task ID and update each task's record.
- Keep planning-only changes and record corrections separate from implementation commits.
- A change to a task's status or acceptance record goes in a task or acceptance commit, never in a planning-only commit.
- Never claim a test, lint, documentation, scanner or gate result unless you ran the command and inspected the result.

**Task commit**

    <type>(backend): <imperative summary> [<TASK-ID>]

    Optional short explanation of why the change is needed.

    Tasks: <TASK-ID>[, <TASK-ID>...]
    Acceptance: <B-INC-001-AC-nn>[, ...]
    Tests: <BTS-nnn>[, ...] or NOT-RUN with reason
    Security-Gates: <SEC-GATE-nnn>[, ...] or NOT-APPLICABLE with reason
    Evidence: <sanitized path or CI run reference>

Allowed types: `feat`, `fix`, `test`, `build`, `docs`, `security`, `refactor`, `chore`. The scope is always `backend` for backend work.

The `Tasks`, `Acceptance`, `Tests` and `Security-Gates` lines must equal the task's entry in the increment `TASKS.md`. Derive them from the union of the task's linked criteria; do not copy IDs from elsewhere without checking. The traceability checker enforces this.

**Planning-only or record-correction commit** (changes records without implementing a task):

    docs(backend): <imperative summary>

    <What changed and why, with the scope and what is excluded.>

    Tasks: None (<short reason>)
    Acceptance: Not applicable (no acceptance criterion is advanced)
    Tests: Not applicable
    Security-Gates: Not applicable
    Evidence: <checks actually run and inspected, or "no task tests or gates run">

Omit the `[<TASK-ID>]` suffix on this form, and never attach a task ID to a commit that does not implement that task. The full procedure, examples and commit boundaries are in the increment's `GIT_COMMIT_STEP.md`.

**Forbidden in a commit message or pull request description:** a `Claude-Session:` trailer or any session link (the `commit-message-check` workflow rejects them). A `Co-Authored-By:` line is allowed.

**Pull request description:** summary, scope and exclusions, the commit list, a table of tasks, acceptance criteria, tests and security gates where tasks are involved, what validation was actually run, and what remains pending. State plainly that linked tests are not run unless they were.

**Merging.** `main` requires a pull request, the required checks and code-owner review. The author does not merge their own work without the required review.

## 8. Security rules

- Never commit secrets, private keys, tokens, passwords, certificates with sensitive material, production data or personal data. Use obviously fake placeholders and mark them as fake.
- Do not copy a credential-shaped value into a document, issue, chat or log, even when reporting it. Name the file and line instead.
- If a secret is committed by mistake, tell the Security Owner at once. Removing it in a later commit does not make it safe; it must be revoked or rotated.
- Never use a scanner suppression to hide a confirmed secret.
- A clean working tree and green tests do not prove history is free of earlier secrets.
- Read `planning/backend/BACKEND_SECURITY_GATE.md` before changing logging, configuration or anything that touches credentials. A security gate is closed only by its owner, never by a merge.

## 9. Roles

| Role | Responsibility |
|---|---|
| Backend Technical Lead (repository owner) | Directs the work, decides, approves, and records acceptance |
| Security Owner | Dispositions security gates and findings |
| Database Technical Lead | Owns `docs/database/`; reviews database decisions |
| Cloud/Infrastructure Owner | Owns `docs/cloud/`; reviews deployment and secret-injection decisions |
| Frontend Technical Lead | Owns `docs/frontend/` and `docs/ui/`; reviews API contract changes |
| QA Owner | Owns test strategy and increment test plans |
| Implementers (people and agents) | Implement approved scope, write tests, record evidence, follow `AGENTS.md` |
| Reviewers | Review against `planning/REVIEW_CHECKLIST.md`; AI review is labelled as such |

When unsure which file is authoritative, check `planning/PLANNING_AUTHORITY_MATRIX.md`. When unsure about anything else, say what you do not know and ask the Backend Technical Lead; do not invent evidence, results or approvals.

## 10. Keeping this README current

Update this file in the same pull request that changes the folder layout, the commands, the workflows or the commit contract. Do not add status, dates, version numbers, people or pull request numbers here; link to the record that owns them.
