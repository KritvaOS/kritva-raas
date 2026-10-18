# kritva-raas

> Kritva Robotic as a Service (RaaS): the consolidated plan and architecture for the RaaS frontend, backend, database and cloud domains, the backend application code, and the planning, security and governance records that control how the work is done. This is a private repository.

| Property | Value |
|---|---|
| Project | KritvaOS |
| Repository | `KritvaOS/kritva-raas` |
| Repository Type | Service |
| Visibility Class | PRIVATE (future private; D-037, D-039 in kritva-program) |
| GitHub Setting | PUBLIC (verified 2026-10-18; temporary, D-028 in kritva-program: owner action returns it to private) |
| Lifecycle Status | ACTIVE |
| Repository Owner | Backend Technical Lead (role; see section 15) |
| Security Owner | Security Owner role ([SECURITY.md](SECURITY.md), [planning/backend/BACKEND_SECURITY_GATE.md](planning/backend/BACKEND_SECURITY_GATE.md)) |
| Architecture | [docs/architecture/BACKEND_ARCHITECTURE.md](docs/architecture/BACKEND_ARCHITECTURE.md) and [docs/architecture/SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md) |
| Milestones | [planning/PHASES.md](planning/PHASES.md) and [planning/backend/increments/](planning/backend/increments/) |
| Tasks | [planning/backend/BACKEND_TASK_REGISTER.md](planning/backend/BACKEND_TASK_REGISTER.md) |
| Acceptance Criteria | [planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md](planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md) |
| Status Reporting | [status/README.md](status/README.md) and `status/status.json` (generated) |
| License | [LICENSE](LICENSE) (proprietary, all rights reserved) |

This README follows the Kritva README standard (`v2/planning/standards/README_STANDARD.md` in [kritva-program](https://github.com/KritvaOS/kritva-program)). It describes structure and method. It deliberately holds no task status, milestone dates, individual people or release numbers, because those change and live in canonical records. Where a fact can go stale, this file points to the record that owns it. Two things are allowed: stable interface and schema identifiers (for example REST API v1 and status schema 2.0), which are contract names and not versions of this repository, and the dated GitHub-setting verification in the metadata table, owned by the program's visibility decisions. That exception covers only that field.

## 1. Purpose and Scope

RaaS lets a user build locally, book remotely and run on real robots. This repository owns the plan and architecture of the RaaS product domains (frontend, backend, database, cloud), the backend application code, and the planning, security and governance records for that work.

This is a software-only repository. Frontend, database and cloud have plans and architecture here; only the backend has application code today (`apps/backend`). There is no firmware, hardware, mechanical or electronic design, build or test flow here. The lab and robot side of the product appears only as an external boundary described by the protocol and architecture documents. Program-level records live elsewhere (see `AGENTS.md`).

It does not own program-level decisions, the program baseline, approvals or program credit. Those live in kritva-program (section 10).

## 2. Position in the KritvaOS Ecosystem

RaaS is the service layer of KritvaOS. In the program's repository plan (PROPOSED) it is sequenced after kritva-core and kritva-skill. That is program ordering only; no build or runtime dependency on either is specified here (section 7). RaaS is meant to report status to kritva-program, but it is a planning-only workstream there: not registered as a source, not a baseline source, with no program credit. The roster, order and required checks are owned by `v2/planning/repo-pipeline.json` in kritva-program, not by this README.

## 3. Architecture

The backend architecture documents are `docs/architecture/BACKEND_ARCHITECTURE.md`, `API_ARCHITECTURE.md` and `SECURITY_ARCHITECTURE.md` (with `SYSTEM_ARCHITECTURE.md` for the whole product), and the wire contracts are under `docs/protocol/`. Each of the four architecture documents declares its own status as Architecture Baseline. That is a design baseline: it states required and target behaviour, and it is not a completed implementation and not, by itself, an owner approval. This section summarises the rules every change must respect and marks which are implemented in `apps/backend` today. Anything not marked implemented is a requirement for future work.

**Layers, from the outside in**

| Layer | Location | Rule (implementation state) |
|---|---|---|
| Transport | `apps/backend/src/transport` | The only code that imports the web framework. Builds the server, mounts route groups, owns the response and error contracts, and the request-context hook (implemented in `apps/backend/src/transport`) |
| Domain modules | added per task | Each exposes one route group with one path root (lower-case, hyphen-separated; roots may not overlap). A module maps its own domain errors to registry error codes before they reach the transport (required rule; no domain module exists yet) |
| Shared infrastructure | `apps/backend/src/shared` | Imports no module and no framework. Holds request-scoped context carried through `AsyncLocalStorage` (implemented) |
| Configuration | `apps/backend/src/config` | The only place settings are read. Invalid configuration fails before the server listens, and failure messages name the setting, never its value (implemented in `apps/backend/src/config`) |
| Persistence | per the database decision records | PLANNED, decision-dependent: no database access is implemented in the backend yet. The target is PostgreSQL; check the decision record's own status before treating it as settled. When implemented, tests of database behaviour must use the real database, not only mocks |

**API conventions (REST API v1)**

These are the contract from `API_ARCHITECTURE.md` and `docs/protocol/`. The transport layer implements the envelope, request ID, error and routing rules below; the domain routes that would use them do not exist yet.

- Everything is served under `/api/v1`; any other prefix is 404.
- Every response with a body, success or error, uses one envelope defined in `docs/protocol/RESPONSES.md`. Error codes come from `docs/protocol/ERROR_CODES.md`.
- The server generates a request ID per request and returns it in a response header and in the body. Client-supplied IDs are ignored.
- Error bodies never carry internal messages, stack traces or submitted values.
- Matching is exact: no trailing slash, no case folding. A known path with the wrong method is 405; an unknown path is 404.

**Cross-cutting rules**

- Secrets, keys and credentials are governed by `docs/security/SECRETS_MANAGEMENT.md`, `docs/security/KEY_MANAGEMENT.md` and `planning/backend/BACKEND_SECURITY_GATE.md`. Do not build secrets handling that those records have not approved.
- Technology choices are decisions. A choice is not a project standard until its decision record is approved (`planning/backend/decisions/`).
- Tenant isolation, authorization and audit behaviour are defined in `docs/security/` as requirements for future work; none is implemented yet. Features touching them need negative tests.

## 4. Documents to Read First

Read in this order. A label names a role, not an approval; where a document states its own status, it is shown.

| # | Document | Label, status | What it answers |
|---|---|---|---|
| 1 | [`planning/README.md`](planning/README.md) | REFERENCE | How planning is organised and which file owns which kind of fact |
| 2 | [`planning/CURRENT_PLAN.md`](planning/CURRENT_PLAN.md) | REFERENCE (a view), PROPOSED | The ordered next work and the active increment. It holds no task status or acceptance: task status is in the increment `TASKS.md`, acceptance in the acceptance records |
| 3 | [`planning/PLANNING_AUTHORITY_MATRIX.md`](planning/PLANNING_AUTHORITY_MATRIX.md) | AUTHORITATIVE role, PROPOSED (not accepted policy until the owner accepts it) | The intended map of which file is the canonical record for each kind of record |
| 4 | [`planning/PLANNING_STATUS_VOCABULARY.md`](planning/PLANNING_STATUS_VOCABULARY.md) | AUTHORITATIVE | What each status word means |
| 5 | [`AGENTS.md`](AGENTS.md) and [`planning/AGENT_RULES.md`](planning/AGENT_RULES.md) | AUTHORITATIVE | Working rules for anyone, human or agent, who changes the repository |
| 6 | [`apps/backend/README.md`](apps/backend/README.md) | REFERENCE | How the running backend is built and operated |
| 7 | [`docs/README.md`](docs/README.md) | REFERENCE | The documentation index |
| 8 | [`docs/REPOSITORY_STRUCTURE.md`](docs/REPOSITORY_STRUCTURE.md) | REFERENCE, PROPOSED, pending human review | Proposed repository structure and ownership map; the authority matrix remains authoritative |
| 9 | [`docs/architecture/`](docs/architecture/) (the four architecture documents, section 3) | AUTHORITATIVE for the design baseline; status declared in each file: Architecture Baseline | The target architecture. Not proof that it is implemented, and not an owner approval |

## 5. Repository Structure and File Responsibilities

The tree is a navigation map of what is checked in now, not a statement that every domain has code. Only `apps/backend` holds application code; the frontend, database and cloud domains exist as plans and architecture under `docs/`. Paths described below as being consolidated are TRANSITIONAL; `docs/REPOSITORY_STRUCTURE.md` (PROPOSED) holds the proposed full path-to-owner map.

```
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
└── AGENTS.md, SECURITY.md, LICENSE
```

Rule of thumb: `docs/` says what the backend is and must do; `planning/` says what is being done about it and in what order.

| Path | Responsibility | Label | Edit by hand? |
|---|---|---|---|
| [`apps/backend/`](apps/backend/) | Control-plane backend source and tests | INPUT | yes, per task |
| [`planning/`](planning/) | Plans, phases, task registers, increment dossiers, decision records | MIXED: AUTHORITATIVE per document (see the authority matrix) | per document |
| [`docs/`](docs/) | Stable requirements, contracts and architecture | MIXED: AUTHORITATIVE and REFERENCE per document | per document |
| [`status/status.json`](status/status.json) | Program status report | GENERATED by `scripts/status/gen_status.py` | no: regenerate |
| [`status/status.schema.json`](status/status.schema.json) | Vendored status schema, checked by SHA-256 | SNAPSHOT of the program schema | no: refresh from kritva-program |
| [`scripts/`](scripts/) | Checkers, status generator, commit checks | INPUT | yes, with tests |
| [`tests/`](tests/) | Unit tests for the checkers | EVIDENCE | extend with changes |
| [`.github/`](.github/) | CODEOWNERS and CI workflows | AUTHORITATIVE | owner review |
| [`Makefile`](Makefile) | The local commands (`make help`) | INPUT | yes |
| [`SECURITY.md`](SECURITY.md), [`AGENTS.md`](AGENTS.md), [`LICENSE`](LICENSE) | Security policy, agent rules, license | AUTHORITATIVE | owner decision |

Rule of thumb: `docs/` says what the backend is and must do; `planning/` says what is being done about it and in what order.

Who owns each folder and file group is defined in [`planning/PLANNING_AUTHORITY_MATRIX.md`](planning/PLANNING_AUTHORITY_MATRIX.md) (the ownership section is proposed and pending owner acceptance).

## 6. Toolchain and Development Workflow

| Tool | Purpose | Version | Check |
|---|---|---|---|
| Node.js | Backend build and tests | pinned in [`.node-version`](.node-version) | `node --version` |
| npm | Backend dependencies (`npm ci --ignore-scripts`) | with Node | `npm --version` |
| Python 3 | Repository checkers and the status generator | 3 | `python3 --version` |
| GNU make | Local commands | any | `make help` |
| gitleaks | Secret scan (CI) | CI-managed | the `secret-scan` workflow |

| Command | Effect | Preview |
|---|---|---|
| `make hooks-install` | modify: enables the Git hooks in this clone | none |
| `make check` | check: all repository checks required by CI | n/a |
| `make status-gen-check`, `make status-report` | check: read-only status comparisons | n/a |
| `python3 scripts/status/gen_status.py` | generate: rewrites `status/status.json` | `--check` compares without writing |
| `npm ci --ignore-scripts`, `npm run build` (in `apps/backend`) | generate: installs dependencies, writes `dist/` | n/a |

The repository has two kinds of check that must not be confused: repository-governance checks (`make check`, `make status-gen-check`, section 11), and application checks that exist only for the backend (the `apps/backend` commands). There is no full frontend, database, cloud or robot end-to-end suite. `make build`, `make test`, `make lint`, `make format` and `make format-check` at the repository root are placeholders that fail by design until an application toolchain is configured; use the `apps/backend` commands in section 11. The full workflow is in [`docs/development/DEVELOPMENT_WORKFLOW.md`](docs/development/DEVELOPMENT_WORKFLOW.md) and [`docs/development/DEVELOPMENT_SETUP.md`](docs/development/DEVELOPMENT_SETUP.md).

## 7. Dependencies and Interfaces

| Dependency | Direction | Kind | Contract | State |
|---|---|---|---|---|
| kritva-program | upstream | governance | status schema 2.0 ([`status/README.md`](status/README.md)) | Two separate facts. The schema and the generator are established and checked locally. Program ingestion is NOT integrated: this repository is not registered as a program source, so nothing here is consumed for accepted progress or credit (see [`AGENTS.md`](AGENTS.md)) |
| kritva-core | upstream | build or runtime (not yet specified here) | none in this repository | PROPOSED: ordered before RaaS in the program's repository plan |
| kritva-skill | upstream | build or runtime (not yet specified here) | none in this repository | PROPOSED: ordered before RaaS in the program's repository plan |
| PostgreSQL | upstream | runtime | the database decision records under `planning/backend/decisions/` | PROPOSED until the decision record shows owner approval; not yet used by the backend code |
| Lab and robot side | downstream | external boundary | [`docs/protocol/`](docs/protocol/) and the architecture documents | PLANNED: appears only as a boundary today |

Phase and milestone dependencies are in [`planning/DEPENDENCY_MAP.md`](planning/DEPENDENCY_MAP.md) and [`planning/backend/BACKEND_DEPENDENCY_MAP.md`](planning/backend/BACKEND_DEPENDENCY_MAP.md); integration sequencing is in [`planning/INTEGRATION_PLAN.md`](planning/INTEGRATION_PLAN.md). A PROPOSED dependency is not an integration that exists. Three kinds of relationship are kept apart: program ordering (the repository plan), build or runtime dependency (none specified for kritva-core or kritva-skill), and governance or status reporting (section 10).

## 8. Milestones and Implementation Plan

Work is organised in three levels, each with one owner document. The frozen phase model (P0 to P8) is defined only in `planning/PHASES.md` and is not repeated here.

| Level | What it is | Canonical record |
|---|---|---|
| Phase | A program stage | `planning/PHASES.md`; dossiers in `docs/milestones/` |
| Milestone | A domain deliverable: `B-M01` to `B-M07` (backend), `DB-M01` to `DB-M04` (database), `C-M01` to `C-M04` (cloud), `F-M01` to `F-M07` (frontend) | The milestone's own `MILESTONE.md` under `docs/<domain>/milestones/` |
| Increment | The unit of backend execution: `B-INC-001 SECURE FOUNDATION`, `B-INC-002 IDENTITY ORGANIZATION`, `B-INC-003 PROJECTS PLATFORM CATALOG`, `B-INC-004 AUDIT TRANSACTIONS IDEMPOTENCY` | `planning/backend/increments/B-INC-00x-*/` |

The increment dossiers are planning records: that an increment is listed or has a dossier does not authorise starting it, and the backend task register and acceptance criteria are themselves PROPOSED. Each increment dossier holds the same files: `MILESTONE.md`, `TASKS.md`, `ACCEPTANCE_CRITERIA.md`, `TEST_PLAN.md`, `SECURITY_REVIEW.md`, `REVIEW_CHECKLIST.md`, `GIT_COMMIT_STEP.md` and `CHANGELOG.md`.

Which increment is active, and what comes next, is in `planning/CURRENT_PLAN.md`. Do not start a later increment until the work and dependencies before it have been reviewed (`planning/backend/README.md`).

| Plan | Status and meaning of dates |
|---|---|
| [`planning/PHASES.md`](planning/PHASES.md) | The frozen phase model; names, not a schedule |
| [`planning/IMPLEMENTATION_ROADMAP.md`](planning/IMPLEMENTATION_ROADMAP.md), [`planning/RELEASE_ROADMAP.md`](planning/RELEASE_ROADMAP.md) | Sequencing; read each file's own status line before treating a date as a commitment |

## 9. Tasks and Acceptance Criteria

- **Where tasks live.** The task list for an increment is its `TASKS.md`. That file owns each task's scope, linked acceptance criteria, tests and security gates, and its status. The program-level register is `planning/backend/BACKEND_TASK_REGISTER.md`.
- **Task IDs.** Task ID namespaces are defined in `planning/backend/BACKEND_TASK_REGISTER.md` and each increment `TASKS.md`; use those files for the current list instead of copying IDs from here.
- **Related IDs.** `B-INC-001-AC-nn` (acceptance criteria), `BTS-nnn` (test specifications), `SEC-GATE-nnn` (security gates), `PB-nnn` (planning changes in the changelog), `OD-n` and decision IDs (owner decisions).
- **Reading status.** Use the status words defined in `planning/PLANNING_STATUS_VOCABULARY.md`. Keep these states separate: checks passed, decision reviewed, decision approved, task accepted, gate closed. A merged pull request or a green check is none of the last three.
- **Program view.** `status/status.json` is generated by `scripts/status/gen_status.py`. Regenerate it; never edit it by hand. `make status-report` prints status differences between records and views.
- **Picking up work.** Take the next item in `planning/CURRENT_PLAN.md`, open its task in the increment `TASKS.md`, and implement only what that task and its acceptance criteria say. If the scope is unclear, ask the Backend Technical Lead instead of widening it.
- **Acceptance criteria.** Increment-level criteria are `ACCEPTANCE_CRITERIA.md` in each increment dossier; the backend register of criteria is [`planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md`](planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md). Work is not accepted because code, a commit, a merged pull request or a local test exists.

## 10. Status Reporting and Program Integration

`status/status.json` (schema 2.0) is written by `scripts/status/gen_status.py` from the planning records, in the format a kritva-program consolidator could read. This repository is not registered as a program source today ([`AGENTS.md`](AGENTS.md)), so the program does not read it. The statuses are derived from planning records, and every evidence entry is a record path with no commit, CI run or hash, so the report cannot support PASS or any acceptance claim. How it is generated, its scope and how planning statuses map to reported execution are in [`status/README.md`](status/README.md).

- **Execution** is what this repository reports: a task's reported state, derived from its planning record.
- **Evidence** names the commit and the validation result behind a claim, with its scope.
- **Acceptance** is recorded only in the canonical record by the Backend Technical Lead, never by the status report.
- **Release readiness** is the result of the release gates in [`docs/development/RELEASE_PROCESS.md`](docs/development/RELEASE_PROCESS.md).

This repository reports facts only. Its tasks are not in the approved kritva-program baseline, so the report earns no program credit and claims no program approval. A generated view is a derived snapshot that can lag its inputs.

## 11. Build, Test, Regression and Validation

Every change passes the same gates in this order. A failure at any gate stops the change. The gates cover what exists: the backend package's typecheck, build and tests, and the repository's governance checks. They are not a full product regression or end-to-end suite, and a check is described as run in CI only for the scope its workflow actually covers.

1. **Before you edit.** Work on a branch cut from the current `main`. Install the hooks once with `make hooks-install`.
2. **While you work.** Run the focused tests for what you touch. For the backend, from `apps/backend`:

       npm ci --ignore-scripts   # install exactly from package-lock.json
       npm run typecheck         # tsc --noEmit
       npm run build             # compile to dist/
       npm test                  # build, then run every compiled test

3. **Before you commit.** The `pre-commit` hook runs the source header check, and the `commit-msg` hook rejects forbidden message content. Inspect your change with `git status --short`, `git diff --check` and `git diff --cached`; the staged set must contain only the intended task's files.
4. **Before you open a pull request.** From the repository root:

       make check            # governance: header, docs, traceability, approvals, planning-root and status tests (no application tests)
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

## 12. Git Workflow and Review

The controlling form for task commits is this repository's own contract, set out below and in the increment's `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/GIT_COMMIT_STEP.md`; the checks actually enforced are the workflows listed in section 11. The Kritva commit standard in kritva-program is NOT adopted here (PD-019 in kritva-program) and is advisory reference only until the owner opts this repository in. The `Tasks:` and `Task:` footer rules are compatible with it.

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

## 13. Safety and Security

This is a software-only repository: it has no actuators and no hardware, so there are no physical safety gates here. The lab and robot side is an external boundary, and its safety is governed where it is built, not by tests in this repository.

**Reporting a vulnerability:** follow [`SECURITY.md`](SECURITY.md); its reporting route is not yet verified as a dedicated private channel, and it says so. Never put details of an unfixed vulnerability in a public issue, pull request or commit message.

- Never commit secrets, private keys, tokens, passwords, certificates with sensitive material, production data or personal data. Use obviously fake placeholders and mark them as fake.
- Do not copy a credential-shaped value into a document, issue, chat or log, even when reporting it. Name the file and line instead.
- If a secret is committed by mistake, tell the Security Owner at once. Removing it in a later commit does not make it safe; it must be revoked or rotated.
- Never use a scanner suppression to hide a confirmed secret.
- A clean working tree and green tests do not prove history is free of earlier secrets.
- Read `planning/backend/BACKEND_SECURITY_GATE.md` before changing logging, configuration or anything that touches credentials. A security gate is closed only by its owner, never by a merge.

## 14. Release and Versioning

[`docs/development/RELEASE_PROCESS.md`](docs/development/RELEASE_PROCESS.md) defines the release process (qualification, release, staged deployment, rollback, post-release review) and [`planning/RELEASE_ROADMAP.md`](planning/RELEASE_ROADMAP.md) the release sequencing. A release is complete only when the criteria in that process are met, not when code is merged. Versions, tags and release notes follow that process; this README records no release state. Branching is in [`docs/development/BRANCHING_STRATEGY.md`](docs/development/BRANCHING_STRATEGY.md).

## 15. Ownership and Escalation

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

## 16. Related Repositories and References

| Repository | Relationship |
|---|---|
| [kritva-program](https://github.com/KritvaOS/kritva-program) | Program plan, baseline, decisions, status consolidation, README standard |
| [kritva-core](https://github.com/KritvaOS/kritva-core), [kritva-skill](https://github.com/KritvaOS/kritva-skill) | Upstream in the program's repository plan (PROPOSED) |

### Keeping this README current

Update this file in the same pull request that changes the folder layout, the commands, the workflows or the commit contract. Do not add status, dates, version numbers, people or pull request numbers here; link to the record that owns them.

## 17. License

Proprietary and confidential. Copyright (c) 2026 Kritvaos. All rights reserved. See [LICENSE](LICENSE).
