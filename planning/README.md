# Kritva RaaS Planning

## Document Control

| Field | Value |
|---|---|
| Document | Kritva RaaS Planning README |
| Path | `planning/README.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [CURRENT_PLAN.md](CURRENT_PLAN.md); [AGENT_RULES.md](AGENT_RULES.md); [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md); [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md); [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md) |

## 1. Purpose

This directory holds the active planning and execution control for Kritva RaaS: program planning, the backend increments that carry task execution, decisions and their approvals, security gates, and the change record. It is the entry point for anyone planning or reviewing work.

Stable requirements, contracts and architecture belong under `docs/`. This directory holds what is being planned and executed. This is the same split used by `kritva-core` and `kritvaos-community`.

This README adds no requirement. It points to the documents that own each rule.

## 2. Roles

| Role | Who | Responsibility |
|---|---|---|
| Owner and decision maker | Backend Technical Lead, who is also the repository owner | Directs the work, decides, approves, and records acceptance. Owns the architecture |
| Implementation and evidence | Claude (and other implementation agents) | Implements approved scope, writes tests, records evidence, prepares commits and patch folders. Follows [AGENT_RULES.md](AGENT_RULES.md) |
| External AI review | ChatGPT | Reviews proposals and merged work and gives findings. This is AI inspection. It is not an independent human review and it is not acceptance |
| Named owners | Security Owner, Cloud/Infrastructure Owner, Database lead and others named in the approval packages | Approve or review the decisions assigned to them |

A review by the owner or by an AI agent is recorded with that role. It is never recorded as an independent human review.

## 3. Hierarchy

```text
planning/
├── README.md                     this file
├── CURRENT_PLAN.md               ordered next work (links to status, holds none)
├── AGENT_RULES.md                rules for implementation agents
├── REVIEW_CHECKLIST.md           checklist for planning and implementation pull requests
├── PHASES.md                     frozen phase definitions
├── IMPLEMENTATION_ROADMAP.md     program sequencing
├── RELEASE_ROADMAP.md            release plan
├── DEPENDENCY_MAP.md             cross-domain dependencies
├── INTEGRATION_PLAN.md           integration strategy
├── RESOURCE_PLAN.md              resources
├── DECISIONS.md                  system-level decision register
├── PLANNING_ALIGNMENT_GAP_REPORT.md
├── PLANNING_AUTHORITY_MATRIX.md  one canonical record per record type
├── PLANNING_MIGRATION_PLAN.md    steps that align this directory with the other repositories
└── backend/                      backend program plan, register, gates, decisions, increments
    ├── BACKEND_*.md
    ├── decisions/                decision-approval workflow and packages
    └── increments/B-INC-00x-*/   task execution dossiers
```

Official milestone dossiers stay under `docs/` (`docs/backend/milestones/` and the equivalents for the other domains, and `docs/milestones/` for phases). Domain task backlogs stay under `docs/<domain>/planning/`.

## 4. Authority

[PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md) names the one canonical record for each kind of record. In short:

1. [PHASES.md](PHASES.md) owns the frozen phase model. Each milestone dossier owns its own scope and acceptance.
2. The increment `TASKS.md` owns task scope and task status. The increment `ACCEPTANCE_CRITERIA.md`, `TEST_PLAN.md` and `GIT_COMMIT_STEP.md` own the criteria, the test mapping and the commit contract.
3. A decision record owns the decision. An approval package under `backend/decisions/approvals/` carries the approval workflow. Approved is a decision disposition and is not task Accepted.
4. [BACKEND_CHANGELOG.md](backend/BACKEND_CHANGELOG.md) owns the planning change history (PB-nnn).
5. A file that shows a value owned elsewhere is a view and links to its owner.
6. A merged pull request, a passing check or a status change is not acceptance. Acceptance needs the governing criteria and a recorded review decision.

## 5. How Work Flows

Task scope and acceptance criteria, then implementation and tests, then evidence, then a commit in the form the increment `GIT_COMMIT_STEP.md` defines, then a pull request, then review, then the owner's acceptance record. `make check` runs the repository checks before every pull request. The checks show structural consistency only. They do not approve anything.

## 6. Current State

[CURRENT_PLAN.md](CURRENT_PLAN.md) lists the next work in order and links to the records that hold the status. Read it first when you start a session, then read [backend/README.md](backend/README.md).
