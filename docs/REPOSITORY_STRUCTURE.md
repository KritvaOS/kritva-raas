# Repository Structure and Ownership

Status: PROPOSED, pending human review. `planning/PLANNING_AUTHORITY_MATRIX.md` remains authoritative; this file is a proposed reference and is retired once its unique content is folded into that matrix.

This draft defines how `kritva-raas` is laid out and which owner role is accountable for each folder and file group. It adds no requirement of its own: authority for each kind of record stays with `planning/PLANNING_AUTHORITY_MATRIX.md`, and this draft only maps folders to owner roles. It contains roles, never named individuals, so it does not go stale when people change.

Nothing here is policy until the repository owner accepts it.

Intended home: this text is the source for a short section of `planning/PLANNING_AUTHORITY_MATRIX.md`, which stays the single canonical governance document (section 8). Until that is done it lives here as a proposed reference. It must not become a second authority document, and it is retired when its content is folded in.

Three concepts are kept apart throughout: **information architecture** (where a file belongs), **canonical authority** (which file owns a fact, contract, decision or status) and **review ownership** (who is accountable for approving a change). One accountable owner per file does not mean one reviewer for every change.

## 1. What this repository is

`kritva-raas` is the monorepo for the Kritva RaaS product software and its consolidated plan. It holds:

1. The consolidated product plan and governance for four engineering domains: frontend, backend, database and cloud (plus UI, security and protocol contracts that cut across them).
2. The backend application code (`apps/backend`).
3. The repository's own validation tooling (scripts, tests, CI, hooks).

It is a software-only repository. It contains no mechanical, electronic or hardware design, build or test flow. The lab and robot side of the product appears only as an external system boundary, described by protocol and architecture documents; hardware work is owned and recorded elsewhere.

Frontend, database and cloud currently have documentation and planning here but no application code. Only `apps/backend` exists under `apps/`. New application folders (for example a Studio or Web Console app) are added under `apps/` only after the owner approves the structure.

## 2. Architecture of the folder tree

Four layers, from stable to volatile. A file belongs to exactly one layer, and a higher layer never restates a lower layer's content; it links to it.

| Layer | Folders | Nature |
|---|---|---|
| 1. Product contract | `docs/architecture/`, `docs/protocol/`, `docs/security/`, `docs/ui/` | Stable, normative. Changes are reviewed as contract changes |
| 2. Domain design | `docs/backend/`, `docs/database/`, `docs/cloud/`, `docs/frontend/` | Per-domain architecture, development guides, schema, operations, domain planning and milestone dossiers |
| 3. Planning and execution control | `planning/`, `docs/milestones/`, `docs/tasks/`, `docs/tracking/` | What is being done, in what order, with what acceptance. Volatile |
| 4. Implementation and tooling | `apps/`, `scripts/`, `tests/`, `status/`, `.github/`, `.githooks/`, root files | Code, checks and generated output |

The layers are a navigation model, not an authority hierarchy. A higher layer does not automatically override a lower one. Each file has one primary layer, one accountable owner role, and, where it owns a canonical record, an explicitly identified authority. Other files reference the canonical record instead of restating it. Cross-layer references are allowed, and a change to a canonical record follows that record's own approval process.

## 3. Owner roles

| Role | Accountable for |
|---|---|
| Repository Owner | Repository structure, global conventions, cross-domain documentation and the planning system. Distinct from the Backend Technical Lead; one person may hold both temporarily. Does not automatically become the technical approver for every domain |
| Backend Technical Lead | Backend design, API behaviour, backend code and backend increments |
| Database Technical Lead | Schema, migrations, transactions, tenant-isolation enforcement |
| Cloud/Infrastructure Owner | Environments, deployment, IAM, secret injection, operations |
| Frontend Technical Lead | Studio and Web Console architecture, development guides, UI specification |
| Security Owner | Security requirements, security gates and reviews, secret policy, exceptions to the secret scan |
| QA Owner | Test strategy and increment test plans |
| Repository/CI Owner | Hooks, workflows, checkers, build commands, source header standard |

The eight roles above cover the repository. Four further responsibilities are made explicit. They are assigned to existing roles, not new permanent roles, until the owner decides otherwise:

| Responsibility | Interim holder | Scope |
|---|---|---|
| System architecture authority | Repository Owner | Cross-domain architecture decisions and system boundaries |
| Lab-boundary contract owner (provisional) | Pending decision; a protocol-focused reviewer role to be named | Maintains the interface contract with the external lab and robot system in `docs/protocol/LAB_PROTOCOL.md` and `docs/architecture/LAB_ARCHITECTURE.md`. Implies no ownership of hardware implementation |
| Acceptance authority | Backend Technical Lead today, who also holds the Repository Owner role | Approves a milestone or increment and records acceptance. Must be stated in the authority matrix, including whether it varies by scope. Authorship, code ownership, QA review and security review are never automatically acceptance |
| Release and integration responsibility | Repository Owner and Repository/CI Owner, sharing the duties | Release readiness, cross-domain integration evidence, and checking that mandatory reviews and gates are satisfied |

No separate System Architecture, Product/Requirements, Integration/Protocol or Release Manager role is added. Responsibilities sit on existing roles, and the Product/Requirements question is left open as a decision (section 7).

Roles are taken from the planning records. A role name is not a GitHub reviewer: each needs actual accounts or teams before any review rule can be enforced. The Repository/CI Owner, QA Owner and Frontend Technical Lead roles are used in planning text but their reviewer mapping is unconfirmed, and frontend ownership is planned ownership, not evidence of an active implementation team. Until confirmed, the Repository Owner is the fallback for every row below. A Product/Requirements Owner is not defined; either name one or record which existing role holds that authority.

In every table below, "Repository owner" means the Repository Owner role.

## 4. Ownership by folder

"Owner" is the role accountable for correctness and for approving changes. "Authority" says what the folder is the canonical record for. Everything else in it is a view that links to the canonical record.

### 4.1 Root

| Path | Owner | Purpose and rule |
|---|---|---|
| `README.md` | Repository owner | Entry point; structure and method only, no status |
| `AGENTS.md` | Repository owner | Rules for every contributor, human or agent. Changes need owner review |
| `SECURITY.md` | Security Owner | Vulnerability reporting policy |
| `LICENSE` | Repository owner | Proprietary licence text |
| `Makefile` | Repository/CI Owner | Local commands; `make check` mirrors the CI gate |
| `.node-version` | Repository/CI Owner | Pinned runtime version, matched by `engines.node` in the backend |
| `.gitignore` | Repository/CI Owner | Ignore rules; must never hide secrets handling |
| `.gitleaksignore` | Security Owner | Scanner exceptions. No entry is added to silence a finding without the Security Owner's approval and a reason |
| `claude/` | Repository owner | Session handoff notes for working sessions. Not authoritative; never cite as a record |

### 4.2 `.github/`, `.githooks/`

| Path | Owner | Purpose and rule |
|---|---|---|
| `.github/CODEOWNERS` | Repository owner | Maps paths to reviewers; update when a role gets a named reviewer |
| `.github/workflows/docs-check.yml` | Repository/CI Owner | Documentation, traceability and approval checks |
| `.github/workflows/source-header-check.yml` | Repository/CI Owner | Source header checks |
| `.github/workflows/status-report.yml` | Repository/CI Owner | Status report |
| `.github/workflows/secret-scan.yml` | Security Owner | Secret scan; Repository/CI Owner maintains the mechanics |
| `.github/workflows/commit-message-check.yml` | Repository/CI Owner | Commit message rules |
| `.githooks/` | Repository/CI Owner | Local pre-commit and commit-msg hooks |

### 4.3 `apps/`

| Path | Owner | Purpose and rule |
|---|---|---|
| `apps/backend/src/transport/` | Backend Technical Lead | HTTP layer; the only code importing the web framework |
| `apps/backend/src/shared/` | Backend Technical Lead | Shared infrastructure; imports no module and no framework |
| `apps/backend/src/config/` | Backend Technical Lead | Only place settings are read. Security Owner review is required for secret handling, authentication and authorization, cryptography, sensitive logging and security controls, not for every incidental mention of a secret |
| `apps/backend/tests/` | Backend Technical Lead | Mirrors `src/`; QA Owner reviews test adequacy against the increment test plan. Database Technical Lead reviews changes affecting schema or migration contracts |
| `apps/backend/` package files, lockfile, `.env.example` | Backend Technical Lead | Pinned dependencies; no credential-shaped values |

### 4.4 `planning/`

| Path | Owner | Authority |
|---|---|---|
| `planning/README.md`, `CURRENT_PLAN.md`, `AGENT_RULES.md`, `REVIEW_CHECKLIST.md` | Repository owner | Entry point, next-work view, agent rules, review checklist |
| `planning/PHASES.md` | Repository owner | The only definition of the frozen phase model |
| `planning/PLANNING_AUTHORITY_MATRIX.md`, `PLANNING_STATUS_VOCABULARY.md`, `PLANNING_MIGRATION_PLAN.md`, `PLANNING_ALIGNMENT_GAP_REPORT.md`, `TRACKING_CONSOLIDATION_DISPOSITION.md` | Repository owner | Who owns which record; status words; planning-structure migration |
| `planning/IMPLEMENTATION_ROADMAP.md`, `RELEASE_ROADMAP.md`, `DEPENDENCY_MAP.md`, `INTEGRATION_PLAN.md`, `RESOURCE_PLAN.md`, `DECISIONS.md` | Repository owner | Program sequencing, dependencies, resources, system-level decisions |
| `planning/backend/BACKEND_*.md` | Backend Technical Lead | Backend plan, task register, dependency map, risk register, changelog (PB entries), resource plan |
| `planning/backend/BACKEND_SECURITY_GATE.md` | Security Owner | Security gates (`SEC-GATE-nnn`) |
| `planning/backend/BACKEND_TEST_STRATEGY.md`, `BACKEND_ACCEPTANCE_CRITERIA.md` | QA Owner (strategy), Backend Technical Lead (criteria) | Test levels and `BTS-nnn` gates; backend criteria |
| `planning/backend/decisions/` | Decision owner named in each record is accountable for content; the Repository Owner governs record structure, indexing and required metadata | Decision records. Approval authority is separate from authorship: approvals in `approvals/` belong to the approvers listed in each package |
| `planning/backend/increments/B-INC-00x-*/` | Backend Technical Lead | One execution dossier per increment (see section 5) |

### 4.5 `docs/`: product contract and cross-cutting

| Path | Owner | Authority |
|---|---|---|
| `docs/README.md` | Repository owner | Documentation index and governance |
| `docs/architecture/` | System architecture authority (interim: Repository Owner) | System-wide architecture and boundaries. Cross-domain changes need review from every affected domain lead; domain-specific files are reviewed by that domain's lead |
| `docs/architecture/LAB_ARCHITECTURE.md` | Lab-boundary contract owner (provisional); system architecture authority reviews | Describes the external lab and robot boundary only. Software review never accepts physical lab or robot safety, which remains an external gate |
| `docs/protocol/` (except lab protocol) | Backend Technical Lead, with Frontend Technical Lead as required reviewer | Normative API, envelope, error, event and idempotency contracts. Protocol ownership follows the behaviour specified, not the folder |
| `docs/protocol/LAB_PROTOCOL.md` | Lab-boundary contract owner (provisional), with Backend and Security review where it affects remote execution, authentication, authorization or trust boundaries | External lab boundary. The permanent owner is a pending decision |
| `docs/security/` | Security Owner | Threat model, authorization, tenant isolation, secrets and key management |
| `docs/ui/` | Frontend Technical Lead | UI specification, design system, UI acceptance criteria |
| `docs/development/` | Repository/CI Owner | Setup, workflow, branching, code review, release, source header standard. `TESTING_STRATEGY.md` is co-owned by the QA Owner |

### 4.6 `docs/`: domain folders

Each domain folder has the same shape: `architecture/`, `development/` or `deployment/` and `operations/` where relevant, `planning/` (roadmap, tasks, decisions) and `milestones/` (dossiers).

| Path | Owner | Notes |
|---|---|---|
| `docs/backend/` | Backend Technical Lead | Backend architecture, development guides, `planning/`, `milestones/B-M01` to `B-M07` |
| `docs/database/` | Database Technical Lead | Architecture, data model and ownership, `schema/` (normative schema), planning, milestones `DB-M01` to `DB-M04` |
| `docs/cloud/` | Cloud/Infrastructure Owner | Architecture, deployment, operations, planning, milestones `C-M01` to `C-M04` |
| `docs/frontend/` | Frontend Technical Lead | Studio and Web Console architecture, development, planning, milestones `F-M01` to `F-M07` |

The owner of a domain folder is accountable for the files in it, with these explicit exceptions: a milestone's `MILESTONE.md` is canonical for that milestone's scope and dependencies (acceptance criteria stay in its `ACCEPTANCE_CRITERIA.md`), and a domain `DECISIONS.md` is canonical only for the decisions assigned to that domain. Domain-specific contracts, such as the database schema, are canonical in the domain folder or in a clearly designated schema artifact. Folder ownership never makes every file in the folder authoritative for every subject it mentions.

### 4.7 `docs/`: planning views and trackers

| Path | Owner | Rule |
|---|---|---|
| `docs/milestones/PHASE-*/` | Repository owner for templates, indexes and navigation; domain leads for phase-specific content | Keep only content that exists nowhere else, link to `PHASES.md` for the model. The Repository Owner does not unilaterally own domain acceptance decisions or technical task content |
| `docs/tasks/` | Repository owner (template and conventions) | Task package template for work outside an increment. Never create a second acceptance file for a task governed by an increment |
| `docs/tracking/` | Repository owner for templates, summaries and conventions | Status, risk, issue, decision and change views. The authority matrix prevails: values held in canonical records are linked, not restated. Being consolidated one file per change |
| `docs/planning/README.md` | Repository owner | Signpost to `planning/`. `planning/` is the only active planning location; keep this folder as a signpost only, or remove it once links no longer need it |
| `docs/tracking/AUDIT_RESPONSE_*.md` | Repository owner | A point-in-time audit-response record, not a live view; keep unchanged unless its owner corrects it |

### 4.8 Tooling and generated output

| Path | Owner | Rule |
|---|---|---|
| `scripts/docs/` | Repository/CI Owner | Documentation, traceability, approval and status-consistency checkers |
| `scripts/lint/` | Repository/CI Owner | Source header checker |
| `scripts/security/` | Security Owner | Commit-message checker and other security controls |
| `scripts/status/` | Repository/CI Owner | Generator for `status/status.json` |
| `tests/` | Repository/CI Owner | Unit tests for the checkers, one folder per checker |
| `status/` | Repository/CI Owner | Generated. Regenerate with the script; never edit by hand |

## 5. File ownership inside a dossier

Every increment and milestone dossier uses the same file set. Within it:

| File | Owner | Canonical for |
|---|---|---|
| `MILESTONE.md` | Domain lead | Scope, objectives, exit criteria |
| `TASKS.md` | Domain lead | Task scope, linked criteria, tests and gates, task status |
| `ACCEPTANCE_CRITERIA.md` | Domain lead | `AC` identifiers and their traces |
| `TEST_PLAN.md` | QA Owner | `BTS` mapping and evidence |
| `SECURITY_REVIEW.md` | Security Owner | Security review findings and sign-off |
| `REVIEW_CHECKLIST.md` | Domain lead | Review checklist |
| `GIT_COMMIT_STEP.md` | Domain lead | Commit contract and per-task commit text |
| `CHANGELOG.md` | Domain lead | Increment-level planning changes |

For increments, the domain lead is the Backend Technical Lead. These per-file owners are an explicit rule, not a general "domain lead owns everything" rule with informal exceptions. Additional review applies: QA reviews the testability of acceptance criteria, Security reviews the mandatory security conditions in them, and the Repository Owner governs task-ID and status conventions. The checklist owner is never the sole authority for independent review requirements, and the changelog records meaningful changes without competing with a decision or acceptance record.

## 6. Rules that apply to every owner

1. One canonical record per fact; everything else links to it.
2. A merge, a green check or a status change is not acceptance. Acceptance and approval are recorded by the accountable owner in the canonical record.
3. A task that crosses backend, database, cloud or frontend ownership is flagged for explicit review by every affected owner.
4. Generated files are never edited by hand.
5. Owners are roles. Named individuals appear only in `.github/CODEOWNERS`.
6. An AI review or an implementation owner's review is never recorded as independent human review, and software review never stands in for physical safety approval.

### 6.1 Review by change type

A file's location is not the only thing that decides who reviews a consequential change.

| Change type | Accountable owner | Additional required review |
|---|---|---|
| Backend business logic | Backend Technical Lead | QA Owner according to test impact |
| Schema or migration behaviour | Database Technical Lead | Backend Technical Lead and QA Owner as applicable |
| Authentication, authorization, secrets or security gates | Security Owner (for the security disposition) | The relevant implementation owner |
| Cross-domain contract or architecture boundary | System architecture authority | Every affected domain lead |
| Test strategy or test-plan coverage | QA Owner | The relevant domain lead |
| CI mechanics | Repository/CI Owner | Security Owner if scanner or security enforcement changes |
| Lab boundary protocol | Lab-boundary contract owner (provisional) | Backend and Security where applicable; external physical safety approval stays separate |

## 7. Gaps to resolve

1. `.github/CODEOWNERS` assigns every path to one reviewer. Section 4 becomes path rules only once each role has a named account or team. GitHub CODEOWNERS takes usernames or team slugs, not role labels, and cannot by itself express "both reviewers must approve"; combined review requirements need a ruleset policy. Until then the single owner is the fallback, and merging needs a second reviewer or an owner bypass.
2. The Repository/CI Owner, QA Owner and frontend roles are not confirmed as accountable roles for every path above.
3. The lab protocol and lab architecture owners are provisional (section 4.5). Record the decision that appoints permanent owners.
4. The documentation guide (`docs/README.md`) and `docs/tracking/STATUS.md` still call the tracking dashboard authoritative for status, while the authority matrix says increment `TASKS.md` owns task status and tracking files are views. This is a real governance conflict: the authority matrix prevails, and the guide and tracking files need updating, one file per change.
5. `docs/milestones/PHASE-*` hold phase-specific material that is not duplicated elsewhere. Inventory each file, separating unique facts from repeated views of `PHASES.md` and milestone dossiers, before any becomes a link stub.
6. No Product/Requirements Owner is defined. Name one or record which role holds that authority. Do not add a role only to fill the chart.
7. Cross-domain files say "reviewed by that domain lead" without an enforced rule. Section 6.1 states the intended rule; enforcement needs a ruleset policy.
8. Acceptance authority is not stated in the authority matrix. It must say who approves a milestone or increment and whether that varies by scope (section 3).
9. Generated `status/` output: declare which input records are authoritative, who changes the schema, and how stale or hand-edited output is detected. The repository already has `make status-gen-check` for the facts check; confirm it covers staleness.
10. Hooks in `.githooks/` are convenience controls and are bypassable. Treat required CI checks and the ruleset, not hooks, as the enforcement.
11. Dependency and supply-chain changes in `apps/backend` need Security review when material. Material licence changes need an appropriate legal or organisational check.
12. Path coverage: this map was compared with the file tree of `main` observed in this session. Every top-level path and the groups under `apps/`, `planning/`, `docs/`, `scripts/`, `tests/`, `status/`, `.github/` and `.githooks/` have an owner row. New folders and files added later need an owner row in the same change, and the coverage check should be repeated before the map is adopted.

## 8. Where this should live

Do not create a second authority document that restates the authority matrix, because the map defines who decides, who reviews, where acceptance is recorded and who owns status, and those are governance rules.

| Content | Location |
|---|---|
| The four layers, canonical-record registry, role responsibilities, ownership rules, review requirements, acceptance authority, status authority and CODEOWNERS policy | A section of `planning/PLANNING_AUTHORITY_MATRIX.md`, the single canonical governance source |
| Executable path-to-reviewer map | `.github/CODEOWNERS`, using real GitHub users or teams. It implements the policy and never replaces it |
| Directory tree and contributor onboarding | `README.md`, with a link to the matrix. This file, `docs/REPOSITORY_STRUCTURE.md`, is carried as a proposed reference until its content is folded into the matrix; it defines no rule of its own and is retired at that point |
| Entry points | `README.md` and `docs/README.md` carry short links only; the ownership table is not copied into either |

The matrix is currently marked Proposed, so adding this section does not by itself make the ownership map accepted policy. The recommended sequence is: freeze authority definitions in the matrix; resolve the role and acceptance-authority gaps; reconcile the file inventory; implement CODEOWNERS with verified handles and test overlapping rules; check that status and evidence flows cannot infer acceptance from a merge; then request human review from the domain owners and the repository owner.

## 9. Future CODEOWNERS template

An illustrative template for when named teams exist. It is not to be merged before then, and team slugs below are placeholders.

Cautions: the last matching rule wins and replaces the owner set chosen by an earlier rule, so a security or QA rule placed lower does not add that team to broader paths; where two teams must both review a path, list both owners on that line. Do not give Security ownership to every backend file to compensate for an undefined review policy; define the security-sensitive paths and content-based triggers separately. CODEOWNERS cannot express "both reviewers must approve" by itself, so mandatory QA, security and acceptance gates need ruleset or CI controls. Protect `.github/CODEOWNERS` itself so the policy cannot be weakened without the intended review. Keep the dossier rules specific so that not every dossier gets the same owner. Workflow file names and the `planning/backend/increments/` path below match the current tree and must be rechecked before merging.

    *                                           @KritvaOS/repository-owners
    /README.md /AGENTS.md /claude/ /planning/   @KritvaOS/repository-owners
    /docs/architecture/                         @KritvaOS/repository-owners
    /.github/CODEOWNERS                         @KritvaOS/repository-owners
    /Makefile /.node-version /.gitignore        @KritvaOS/repository-ci
    /.githooks/ /scripts/docs/ /scripts/lint/   @KritvaOS/repository-ci
    /scripts/status/ /tests/ /status/           @KritvaOS/repository-ci
    /.github/workflows/docs-check.yml           @KritvaOS/repository-ci
    /.github/workflows/source-header-check.yml  @KritvaOS/repository-ci
    /.github/workflows/status-report.yml        @KritvaOS/repository-ci
    /.github/workflows/commit-message-check.yml @KritvaOS/repository-ci
    /SECURITY.md /.gitleaksignore               @KritvaOS/security
    /scripts/security/ /docs/security/          @KritvaOS/security
    /.github/workflows/secret-scan.yml          @KritvaOS/security
    /apps/backend/ /docs/backend/               @KritvaOS/backend
    /planning/backend/ /docs/protocol/          @KritvaOS/backend
    /docs/database/                             @KritvaOS/database
    /docs/cloud/                                @KritvaOS/cloud-infrastructure
    /docs/frontend/ /docs/ui/                   @KritvaOS/frontend
    /planning/backend/BACKEND_TEST_STRATEGY.md  @KritvaOS/qa
    /planning/backend/increments/*/TEST_PLAN.md @KritvaOS/qa
    /planning/backend/BACKEND_SECURITY_GATE.md  @KritvaOS/security
    /planning/backend/increments/*/SECURITY_REVIEW.md @KritvaOS/security
