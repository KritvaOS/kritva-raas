# kritva-raas

> Kritva Robotic as a Service (RaaS): the consolidated plan and architecture for the RaaS frontend, backend, database and cloud domains, the backend application code, and the planning, security and governance records that control how the work is done. The repository is intended to be private; its GitHub setting is currently public as a recorded temporary exception (see the metadata table).

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

### What the product is meant to do

The list below is the target product, not a statement of what is built. Features and their status are tracked in the planning records, not here.

1. A user creates or opens a project in Kritva Studio and selects a target platform.
2. The user compiles, tests and validates locally, and packages the result as a `.krv` execution artifact. Source code never leaves the workstation.
3. The user books an eligible system. The booking card shows the cloud-synchronized time and a countdown to the next booking, and lets the user browse up to 10 previous and 10 upcoming bookings.
4. When the booking starts, the user opens the system. The countdown only enables the button; the backend and the destination system authorize access.
5. The artifact travels directly from the workstation to the reserved system. The cloud does not receive or store it (section 3).
6. The user watches logs, video and images, then reviews saved sessions and previous runs.

The key capabilities are grouped as: develop and compile; package and transfer; book and connect; execute and monitor; save and review; manage usage, credits and access (including refunds and credit adjustments by an authorized administrator); and optional coding-agent help from Claude Code, OpenAI Codex or direct Anthropic API access, always on the user's own machine. The Studio workspace is planned as three panels (left: projects, sessions and bookings; center: the active project; right: video, images and logs), each independently expandable.

## 2. Position in the KritvaOS Ecosystem

RaaS is the service layer of KritvaOS. In the program's repository plan (PROPOSED) it is sequenced after kritva-core and kritva-skill. That is program ordering only; no build or runtime dependency on either is specified here (section 7). RaaS is meant to report status to kritva-program, but it is a planning-only workstream there: not registered as a source, not a baseline source, with no program credit. The roster, order and required checks are owned by `v2/planning/repo-pipeline.json` in kritva-program, not by this README.

## 3. Architecture

The backend architecture documents are `docs/architecture/BACKEND_ARCHITECTURE.md`, `API_ARCHITECTURE.md` and `SECURITY_ARCHITECTURE.md` (with `SYSTEM_ARCHITECTURE.md` for the whole product), and the wire contracts are under `docs/protocol/`. Each of the four architecture documents declares its own status as Architecture Baseline. That is a design baseline: it states required and target behaviour, and it is not a completed implementation and not, by itself, an owner approval. This section summarises the rules every change must respect and marks which are implemented in `apps/backend` today. Anything not marked implemented is a requirement for future work.

**Architecture documents by domain**

The architecture is split by domain. Each domain keeps its documents in its own folder, and the system-wide documents in `docs/architecture/` tie them together. Only the backend has code today; every other row describes architecture and plans, not working software. Each file declares its own status, and a status word is not an approval or evidence of implementation.

| Domain | Folder | Documents and what each is responsible for |
|---|---|---|
| System-wide | [`docs/architecture/`](docs/architecture/) | `SYSTEM_ARCHITECTURE` (the whole product), `APPLICATION_ARCHITECTURE`, `COMPONENT_ARCHITECTURE`, `DEPLOYMENT_ARCHITECTURE`, `DESKTOP_ARCHITECTURE` (Studio on the workstation), `LAB_ARCHITECTURE` (lab systems and robots), `PROTOCOL_ARCHITECTURE`, `ARTIFACT_ARCHITECTURE` (the `.krv` artifact and its lifecycle), `DIRECT_ARTIFACT_TRANSFER` (SYS-ADR-008 contract), `CODING_AGENT_INTEGRATION`, plus the system-level `API_`, `BACKEND_`, `CLOUD_`, `DATABASE_`, `DATA_` and `SECURITY_ARCHITECTURE` |
| Frontend (Studio) | [`docs/frontend/architecture/`](docs/frontend/architecture/) | `FRONTEND_ARCHITECTURE` (Studio and Web Console as a whole), `STUDIO_ARCHITECTURE` (the Studio application and its screens), `LOCAL_RUNTIME_ARCHITECTURE` (the Rust Local Runtime that builds, packages and transfers on the workstation), `IPC_ARCHITECTURE` (messages between the Studio UI and the Local Runtime), `STATE_ARCHITECTURE` (client state and its ownership) |
| UI | [`docs/ui/`](docs/ui/) | `UI_SPECIFICATION` (screens and behaviour), `UI_DESIGN_SYSTEM`, `ARTWORK_GUIDELINES`, `UI_MILESTONES`, `UI_ACCEPTANCE_CRITERIA`, `UI_REVIEW_CHECKLIST`, `DECISIONS` |
| Cloud | [`docs/cloud/architecture/`](docs/cloud/architecture/) | `CLOUD_ARCHITECTURE` (deployable cloud resources and environments), `COMPUTE_`, `NETWORK_`, `STORAGE_`, `OBSERVABILITY_` and `SECURITY_ARCHITECTURE` (one document per infrastructure concern); deployment in `docs/cloud/deployment/`, operations in `docs/cloud/operations/` |
| Backend | [`docs/backend/architecture/`](docs/backend/architecture/) | `BACKEND_ARCHITECTURE` (implementation structure and module wiring), `API_IMPLEMENTATION`, `SERVICE_ARCHITECTURE`, `JOB_ARCHITECTURE`, and one document each for the artifact, booking, credit and execution services |
| Database | [`docs/database/architecture/`](docs/database/architecture/) | `DATABASE_ARCHITECTURE` (PostgreSQL implementation), `DATA_MODEL`, `DATA_OWNERSHIP`, `ENTITY_RELATIONSHIPS`; table definitions in `docs/database/schema/` |
| Protocol and security | [`docs/protocol/`](docs/protocol/), [`docs/security/`](docs/security/) | Wire contracts (envelopes, responses, error codes, events, idempotency) and security requirements (threat model, authorization, tenant isolation, secrets and keys) |

In the frontend, the Studio UI (what the user sees and does) and the Local Runtime (the workstation process that builds, packages and sends the artifact) are separate responsibilities that talk only through the IPC contract. Section 5 lists the files in each folder.

**Control path and artifact path**

The cloud Control Plane handles authentication, booking, System ID and authorization, and metadata. The execution artifact does not pass through it:

    Workstation (Studio, build, package)
        |-- control API --> Cloud Control Plane (authenticate, book, authorize, grant)
        |
        '== direct transfer, with the grant ==> Destination system (validate, store, run)

If the direct path is unavailable the transfer fails with a clear error; there is no cloud fallback. The decision is SYS-ADR-008 in `planning/DECISIONS.md` and the contract is [`docs/architecture/DIRECT_ARTIFACT_TRANSFER.md`](docs/architecture/DIRECT_ARTIFACT_TRANSFER.md). The direction is owner-approved with owner confirmation pending, the design is not reviewed, and nothing is implemented. Several other documents still describe the earlier cloud object-storage route; each carries a notice pointing to the new contract until it is revised.

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

New contributors and interns start with [`docs/development/INTERN_QUICKSTART.md`](docs/development/INTERN_QUICKSTART.md) (rows 12 and 13 below), then read in the order below. A label names a role, not an approval; where a document states its own status, it is shown.

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
| 9 | [`docs/architecture/DIRECT_ARTIFACT_TRANSFER.md`](docs/architecture/DIRECT_ARTIFACT_TRANSFER.md) | PROPOSED (direction owner-approved, confirmation pending) | How the execution artifact reaches the destination system without passing through the cloud |
| 10 | [`docs/ui/UI_SPECIFICATION.md`](docs/ui/UI_SPECIFICATION.md) | REFERENCE, PROPOSED sections | The Studio UI, including the three-panel workspace (11.1), cloud clock (14.1) and booking navigator (50.1) |
| 11 | [`docs/architecture/`](docs/architecture/) (the four architecture documents, section 3) | AUTHORITATIVE for the design baseline; status declared in each file: Architecture Baseline | The target architecture. Not proof that it is implemented, and not an owner approval |
| 12 | [`docs/development/INTERN_QUICKSTART.md`](docs/development/INTERN_QUICKSTART.md) | REFERENCE, PROPOSED (a reading guide; its commands are marked UNVERIFIED until run) | What exists today, how to set up the backend, which task to pick, and how to commit and open a pull request |
| 13 | [`docs/development/DEVELOPMENT_SETUP.md`](docs/development/DEVELOPMENT_SETUP.md) | REFERENCE for the planned environment, not runnable today (its status table says which sections apply now) | The planned full local environment: Studio, database, object storage, queue and simulated lab |

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
│   ├── backend/                 architecture/ development/ planning/
│   ├── database/                architecture/ planning/ schema/ (one file per table group)
│   ├── frontend/                architecture/ development/ planning/ milestones/ (F-M01 to F-M07)
│   ├── cloud/                   architecture/ deployment/ operations/ planning/ milestones/ (C-M01 to C-M04)
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

**Documentation domains in detail**

Every row is a documentation folder. A file's label is the role it plays, the status it declares is in the file itself, and neither is an approval. "Edit by hand" means a person edits the file in a reviewed pull request; no file in these folders is generated.

| Folder | Files | Responsibility |
|---|---|---|
| [`docs/frontend/architecture/`](docs/frontend/architecture/) | `FRONTEND_`, `STUDIO_`, `LOCAL_RUNTIME_`, `IPC_`, `STATE_ARCHITECTURE.md` | Frontend design baseline; each declares status Production Architecture Baseline. Not implemented |
| [`docs/frontend/development/`](docs/frontend/development/) | `CODE_STYLE`, `DEVELOPMENT_SETUP`, `DEVELOPMENT_WORKFLOW`, `TESTING`, `RELEASE_PROCESS` | How frontend code is written, set up, handed off, tested and released (`CODE_STYLE` declares Engineering Baseline). Planned: no frontend code exists |
| [`docs/frontend/planning/`](docs/frontend/planning/) | `FRONTEND_ROADMAP`, `FRONTEND_TASKS`, `DECISIONS` | Frontend sequencing, the task backlog across F-M01 to F-M07, and frontend decision records |
| [`docs/frontend/milestones/`](docs/frontend/milestones/) | `F-M01-STUDIO-FOUNDATION`, `F-M02-PROJECTS`, `F-M03-BUILD-ARTIFACT`, `F-M04-BOOKING`, `F-M05-EXECUTION`, `F-M06-LIVE`, `F-M07-RESULTS` | One dossier per frontend milestone, each with the six files described below |
| [`docs/ui/`](docs/ui/) | `UI_SPECIFICATION`, `UI_DESIGN_SYSTEM`, `ARTWORK_GUIDELINES`, `UI_MILESTONES`, `UI_ACCEPTANCE_CRITERIA`, `UI_REVIEW_CHECKLIST`, `DECISIONS` | What the Studio looks like and how it must behave, how it is reviewed, and the UI decisions |
| [`docs/cloud/architecture/`](docs/cloud/architecture/) | `CLOUD_`, `COMPUTE_`, `NETWORK_`, `STORAGE_`, `OBSERVABILITY_`, `SECURITY_ARCHITECTURE.md` | Cloud infrastructure design, one file per concern. Several carry a SYS-ADR-008 notice because the cloud no longer holds execution artifacts |
| [`docs/cloud/deployment/`](docs/cloud/deployment/) | `LOCAL_DEPLOYMENT`, `DEVELOPMENT`, `STAGING`, `PRODUCTION` | The planned deployment of each environment. Nothing is deployed |
| [`docs/cloud/operations/`](docs/cloud/operations/) | `MONITORING`, `ALERTING`, `INCIDENT_RESPONSE`, `BACKUP`, `DISASTER_RECOVERY` | The planned operating procedures for the cloud service |
| [`docs/cloud/planning/`](docs/cloud/planning/) | `CLOUD_ROADMAP`, `CLOUD_TASKS`, `DECISIONS` | Cloud sequencing (C-M01 to C-M04), task backlog and decision records |
| [`docs/cloud/milestones/`](docs/cloud/milestones/) | `C-M01-FOUNDATION`, `C-M02-DEVELOPMENT`, `C-M03-STAGING`, `C-M04-PRODUCTION` | One dossier per cloud milestone, same six files |
| [`docs/backend/`](docs/backend/) | `architecture/` (8), `development/` (5), `planning/` (3) | Backend implementation architecture, setup and workflow, roadmap, tasks and decisions. `apps/backend` is the code these describe |
| [`docs/database/`](docs/database/) | `architecture/` (4), `planning/` (3), `schema/` (10) | PostgreSQL design, data model and ownership, roadmap and tasks, and one schema file per table group. No database code exists |
| [`docs/development/`](docs/development/) | `INTERN_QUICKSTART`, `DEVELOPMENT_SETUP`, `DEVELOPMENT_WORKFLOW`, `BRANCHING_STRATEGY`, `CODE_REVIEW`, `TESTING_STRATEGY`, `RELEASE_PROCESS`, `SOURCE_HEADER_STANDARD` | Repository-wide contributor guidance |

**Milestone dossier files**

Each folder under `docs/frontend/milestones/` and `docs/cloud/milestones/` follows the same pattern. The pattern is a convention: the folders for other workstreams (for example `B-M01` to `B-M07` and `DB-M01` to `DB-M04`) are not required to have identical files, and a planned milestone is not an active one.

| File | Responsibility | Is it an approval? |
|---|---|---|
| `MILESTONE.md` | Scope, objective, status (for example PLANNED) and exit conditions | No |
| `TASKS.md` | The task list for the milestone | No: a listed task is not a started or finished one |
| `ACCEPTANCE_CRITERIA.md` | The conditions that must hold for the milestone to be accepted | No: criteria are not evidence that they are met |
| `REVIEW_CHECKLIST.md` | The checklist reviewers work through | No: a ticked checklist supports review and is not itself sign-off |
| `GIT_COMMIT_STEP.md` | The branch and commit step done after the review gate | No |
| `CHANGELOG.md` | The record of changes to the milestone dossier | No |

Names are upper-case with underscores for documents. Milestone folders are named by prefix and number (`F-Mnn-NAME`, `C-Mnn-NAME`).

**Documents that share a name**

Four names appear in more than one folder. The system-level document sets the cross-domain view; the domain document gives detail for its own domain. Where they disagree, the conflict is raised in a review and is not settled by the broader-sounding file name. These scope assignments come from each file's own scope statement.

| Name | System-level document | Domain document |
|---|---|---|
| `CLOUD_ARCHITECTURE` | `docs/architecture/`: the cloud's role and boundaries in the product | `docs/cloud/architecture/`: the deployable cloud resources, environments and infrastructure as code |
| `SECURITY_ARCHITECTURE` | `docs/architecture/`: product-wide trust boundaries and security model | `docs/cloud/architecture/`: cloud and infrastructure security controls |
| `BACKEND_ARCHITECTURE` | `docs/architecture/`: the Control Plane as a system | `docs/backend/architecture/`: backend implementation structure and module wiring |
| `DEVELOPMENT_SETUP` | `docs/development/`: repository-wide environment (planned) | `docs/frontend/development/` for the frontend and `docs/backend/development/` for the backend |

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
5. **In CI.** The workflows in `.github/workflows/` run on every push and pull request: `docs-check`, `source-header-check`, `secret-scan` (gitleaks), `commit-message-check` and `status-report`; the `readme-check` workflow (D-067) runs the README checker's tests and the README check on pull requests and on pushes to `main`, and is not a required check yet. Which checks are required on `main` is set in the repository ruleset; see `AGENTS.md`. Do not add allowlist entries to silence the secret scan; propose them to the owner with the reason.
6. **Review.** Use `planning/REVIEW_CHECKLIST.md`. An AI review is recorded as an AI review, never as independent human review, and each reviewer's claim is verified against the files before it is applied.
7. **Acceptance.** Only the Backend Technical Lead accepts a task or approves a decision, in the canonical record, after the governing criteria are met and evidence is recorded.

**Test levels and evidence.** `planning/backend/BACKEND_TEST_STRATEGY.md` defines the levels (static checks, unit, contract, integration, security, end-to-end, performance baseline, manual review) and the numbered gates `BTS-001` onward. Rules that apply to every test:

- A test that is skipped, blocked or not run is never reported as passing; write NOT-RUN with the reason.
- Test results record the revision, command, environment and tool versions.
- Security and authorization tests include negative cases; tests of failure behaviour are required, not optional.
- Fixtures use synthetic data only, never real credentials or production data.
- At increment acceptance, the full required suite runs and the evidence package in the increment `TEST_PLAN.md` is assembled.

## 12. Git Workflow and Review

The controlling form for task commits is this repository's own contract, set out below and in the increment's `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/GIT_COMMIT_STEP.md`; the checks actually enforced are the workflows listed in section 11. The Kritva commit standard in kritva-program (D-053) is adopted here under D-070, which completes PD-019: `commit-message-check` also runs `scripts/security/check_commit_format.py` on every commit in a pull request. This repository's task-commit contract extends it: the `type(backend): summary [TASK-ID]` header and the `Tasks:` footer satisfy the standard, and the extra `Acceptance:`, `Tests:`, `Security-Gates:` and `Evidence:` trailers are kept.

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

**Reporting a vulnerability:** follow [SECURITY.md](SECURITY.md). It names GitHub private vulnerability reporting as the first route and gives a direct-contact fallback. The Security Owner reports having tested the reporting route on 18 October 2026 (D-068); that is ATTESTED, not independently verified, and nothing here promises a response time. Never put details of an unfixed vulnerability in a public issue, pull request or commit message.

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
