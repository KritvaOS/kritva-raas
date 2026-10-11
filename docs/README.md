# Kritva RaaS Documentation Guide

## 1. Purpose

This document is the entry point for the Kritva RaaS documentation repository.

It explains how the documentation is organized, where authoritative information belongs, how product and engineering work is traced through phases and milestones, and how contributors should create, review, and maintain documentation.

Use this guide to:

- locate the authoritative document for a product, architecture, interface, implementation, or delivery question
- understand the canonical documentation hierarchy
- navigate the frozen phase and milestone model
- locate milestone plans, tasks, acceptance criteria, and review evidence
- distinguish normative contracts from explanatory documentation
- understand ownership and change-control rules
- maintain consistent links across planning, engineering, and tracking documents
- identify missing documentation without inventing project state

This file is the documentation index and governance guide. It does not replace the documents it links to.

## 2. Documentation Principles

Kritva RaaS documentation follows these principles.

1. Every important subject has one authoritative document or clearly identified authoritative owner.
2. Product intent is established before implementation details.
3. System architecture defines the system-wide structure and boundaries.
4. Domain architecture defines the responsibilities and interactions of individual domains.
5. Normative contracts define behavior that implementations must follow.
6. Implementation documents explain how a specific capability is built, tested, and operated.
7. Milestone dossiers define the accepted scope and exit criteria for a delivery milestone.
8. Task directories contain the actionable work required to deliver the agreed scope.
9. Tracking documents summarize status and link to authoritative evidence.
10. Phase definitions are maintained only in `planning/PHASES.md`.
11. Existing milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.
12. Decision records remain authoritative for the decisions they document.
13. Status claims must be supported by evidence.
14. Changes must preserve traceability across requirements, contracts, tasks, milestones, and acceptance.
15. Documentation must not create a second, conflicting source of truth.

## 3. Canonical Documentation Hierarchy

The documentation hierarchy follows this order:

**Product / Planning → System architecture → Domain architecture → Normative contracts → Implementation / Development → Milestones → Tasks → Tracking**

The hierarchy expresses documentation authority and traceability. It does not imply that every document must be written sequentially or that every change requires modifying every layer.

### 3.1 Product and planning

Defines the product problem, goals, intended users, requirements, priorities, roadmap, delivery phases, and approved planning assumptions.

Primary location: `planning/`

### 3.2 System architecture

Defines the system-wide architecture, major components, responsibility boundaries, trust boundaries, and cross-domain interactions.

Primary location: `docs/architecture/`

### 3.3 Domain architecture

Defines architecture within a specific engineering domain, including component responsibilities, internal interfaces, dependencies, and design constraints.

Primary locations include:

- `docs/frontend/`
- `docs/backend/`
- `docs/database/`
- `docs/cloud/`
- `docs/ui/`
- `docs/security/`

### 3.4 Normative contracts

Defines behavior that implementations must satisfy. Examples include API contracts, protocol specifications, database schemas, event formats, and compatibility requirements.

Primary locations are the established contract and schema directories owned by the relevant domain. Use the existing repository structure and avoid creating parallel copies.

### 3.5 Implementation and development

Explains how capabilities are implemented, built, tested, integrated, deployed, and maintained.

Implementation documentation belongs with the owning domain or capability unless a repository convention specifies otherwise.

### 3.6 Milestones

Defines the scope, deliverables, dependencies, acceptance criteria, and review requirements for a canonical milestone.

Milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.

### 3.7 Tasks

Defines the actionable work required to produce milestone deliverables.

Task-specific documentation belongs in:

`docs/tasks/<TASK-ID>/`

### 3.8 Tracking

Summarizes progress, blockers, dependencies, risks, decisions, and delivery status.

Tracking documents must link to authoritative tasks, milestones, decisions, risks, and evidence. They must not replace those records.

## 4. Repository Documentation Map

The following map describes the intended documentation responsibilities. It is not a claim that every listed file or directory has already been created.

| Location | Purpose |
|---|---|
| `docs/README.md` | Documentation entry point and governance guide |
| `planning/` | Product planning, canonical phases, and project-wide decisions |
| `docs/architecture/` | System architecture and cross-domain design |
| `docs/contracts/` | Shared normative contracts, where maintained centrally |
| `docs/protocol/` | Protocol specifications, where maintained separately |
| `docs/database/schema/` | Normative database schema, if this directory is used by the repository |
| `docs/frontend/` | Frontend architecture, implementation, and planning |
| `docs/backend/` | Backend architecture, implementation, and planning |
| `docs/database/` | Database architecture, schema ownership, and migrations |
| `docs/cloud/` | Infrastructure, environments, deployment, and operations |
| `docs/ui/` | UI standards, screen specifications, and design decisions |
| `docs/security/` | Security requirements, reviews, and controls |
| `docs/tasks/` | Task-specific documentation directories |
| `docs/tracking/` | Consolidated status, dependency, decision, and risk tracking |
| `docs/**/milestones/` | Authoritative milestone dossiers within their owning domains |

Before creating a new directory, check whether the repository already has an established location for the subject.

Do not move or rename existing authoritative documents solely to make the directory layout resemble this map. Preserve working paths unless a reviewed repository change requires restructuring.

## 5. Canonical Phase Model

The canonical phase definition is:

`planning/PHASES.md`

That file is the sole authority for phase definitions and boundaries. Other documents may reference the frozen identifiers and names, but must not establish alternative phase definitions.

| Phase ID | Canonical name |
|---|---|
| P0 | FOUNDATION |
| P1 | STUDIO |
| P2 | BUILD & ARTIFACT |
| P3 | CONTROL PLANE |
| P4 | BOOKING & COMMERCIAL |
| P5 | EXECUTION |
| P6 | LAB & ROBOT |
| P7 | LIVE & RESULTS |
| P8 | PRODUCTION |

### 5.1 Phase reference rules

- Use the phase ID and name exactly as shown.
- Link to `planning/PHASES.md` when a phase definition or boundary needs clarification.
- Do not define alternative phase names in domain documentation.
- Do not infer phase boundaries from a milestone title.
- Update the canonical phase definition only through the approved planning change process.
- Review affected milestone dossiers and tracking documents when a canonical phase change is approved.

The table above is a navigation reference, not a replacement for `PHASES.md`.

## 6. Canonical Frontend Milestones

Frontend milestone scope is defined by the relevant authoritative dossiers under `docs/**/milestones/`.

| Milestone ID | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

Use these identifiers and names consistently in planning, task records, status reports, and cross-domain references.

## 7. Canonical Backend Milestones

Backend milestone scope is defined by the relevant authoritative dossiers under `docs/**/milestones/`.

| Milestone ID | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

Use the milestone dossier to determine actual scope, deliverables, dependencies, and acceptance criteria.

## 8. Canonical Database Milestones

Database milestone scope is defined by the relevant authoritative dossiers under `docs/**/milestones/`.

| Milestone ID | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

Database contracts and schemas must remain consistent with the authoritative architecture and normative contract documents.

## 9. Canonical Cloud Milestones

Cloud milestone scope is defined by the relevant authoritative dossiers under `docs/**/milestones/`.

| Milestone ID | Canonical name | Phase mapping |
|---|---|---|
| C-M01 | FOUNDATION | P0 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

Cloud implementation documentation should identify the relevant environment, deployment assumptions, configuration, validation evidence, and operational dependencies.

## 10. Standard Milestone Folder

Every milestone dossier should follow the repository's standard milestone structure.

The standard contents are:

- `MILESTONE.md`
- `TASKS.md`
- `ACCEPTANCE_CRITERIA.md`
- `REVIEW_CHECKLIST.md`
- `CHANGELOG.md`
- `GIT_COMMIT_STEP.md`

Place these files in the milestone's established directory under the owning domain's `milestones/` hierarchy.

### 10.1 `MILESTONE.md`

Purpose:

- identify the milestone and its canonical ID
- state the objective and scope
- define deliverables and exclusions
- identify dependencies and owners
- link to relevant architecture and contracts
- record milestone status and important constraints

This is the milestone overview. It must not conflict with the authoritative acceptance criteria.

### 10.2 `TASKS.md`

Purpose:

- list the tasks required to deliver the milestone
- assign task IDs and ownership
- identify dependencies and sequencing
- link to task-specific directories
- summarize task status

Detailed task execution instructions belong in `docs/tasks/<TASK-ID>/` when that task directory is used.

### 10.3 `ACCEPTANCE_CRITERIA.md`

Purpose:

- define observable, testable milestone acceptance conditions
- specify required verification and evidence
- identify mandatory reviews and approvals
- define conditions that prevent acceptance
- describe the evidence required for closure

The filename must remain `ACCEPTANCE_CRITERIA.md` within the milestone directory. Do not encode the task or milestone ID into this filename.

### 10.4 `REVIEW_CHECKLIST.md`

Purpose:

- guide architecture, implementation, testing, security, and documentation review
- verify conformance to requirements and contracts
- identify outstanding issues
- record review outcomes and follow-up actions

A checklist does not replace the formal acceptance criteria.

### 10.5 `CHANGELOG.md`

Purpose:

- record meaningful changes to milestone scope or documentation
- preserve a concise history of accepted updates
- reference relevant commits or decisions when available

Do not use the changelog as a substitute for Git history or the project decision register.

### 10.6 `GIT_COMMIT_STEP.md`

Purpose:

- describe the expected commit and validation sequence for milestone work
- identify required local checks
- explain how changes should be grouped and reviewed
- record the expected relationship between implementation, evidence, and commits

Do not claim that a commit or test exists until verified.

## 11. Task Documentation

Task-specific documentation belongs in:

`docs/tasks/<TASK-ID>/`

Use the task ID assigned by the authoritative task tracker. Do not invent a second ID for the same task.

A task directory may contain the following documents when the task requires them:

| Document | Purpose |
|---|---|
| `TASK.md` | Task objective, scope, implementation notes, and dependencies |
| `ACCEPTANCE_CRITERIA.md` | Task-specific acceptance conditions |
| `REVIEW_CHECKLIST.md` | Task review requirements |
| `CHANGELOG.md` | Task-level documentation or scope changes, when needed |
| `GIT_COMMIT_STEP.md` | Commit and validation instructions, when needed |
| `EVIDENCE.md` | Links to test output, review records, and other acceptance evidence, when needed |

The contents of a task directory should be proportionate to the work. Not every task needs every optional document.

### 11.1 Task-to-milestone traceability

Each task must identify its owning milestone when applicable.

Task records should link to:

- the milestone dossier
- task dependencies
- relevant requirements
- normative contracts
- applicable architecture documents
- acceptance criteria
- test or review evidence

The task tracker records status; the task directory records task-specific execution information.

## 12. Documentation Ownership

Every document must have a clear ownership rule.

| Document type | Canonical authority |
|---|---|
| Product intent and requirements | Product/planning documents |
| Phase definitions | `planning/PHASES.md` |
| Project-wide decisions | `planning/DECISIONS.md` |
| System architecture | Authoritative system architecture document |
| Domain architecture | Architecture documents owned by the relevant domain |
| API or protocol behavior | Normative contract or protocol specification |
| Database structure and constraints | Authoritative schema and database contract |
| Implementation procedures | Owning domain's implementation documentation |
| Milestone scope | Milestone dossier under `docs/**/milestones/` |
| Milestone acceptance | `ACCEPTANCE_CRITERIA.md` in the milestone dossier |
| Task execution details | `docs/tasks/<TASK-ID>/` |
| Current project status | `docs/tracking/STATUS.md` |
| Phase status | `docs/tracking/PHASE_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Dependency status | `docs/tracking/DEPENDENCY_TRACKING.md` |
| Decision index | `docs/tracking/DECISION_LOG.md` |
| Risk status | `docs/tracking/RISK_REGISTER.md`, when present |

If two documents disagree, resolve the conflict through the owner of the authoritative document rather than editing both independently.

## 13. Tracking Documentation Index

Tracking documents provide a consolidated operational view. They must link to authoritative evidence and avoid duplicating detailed content.

| File | Purpose |
|---|---|
| `docs/tracking/STATUS.md` | Master project status dashboard |
| `docs/tracking/PHASE_STATUS.md` | Phase progress, readiness, and exit evidence |
| `docs/tracking/MILESTONE_STATUS.md` | Milestone progress, dependencies, and acceptance |
| `docs/tracking/TASK_STATUS.md` | Task status, owners, and execution blockers |
| `docs/tracking/DEPENDENCY_TRACKING.md` | Internal and external dependency management |
| `docs/tracking/DECISION_LOG.md` | Index of authoritative architecture and project decisions |
| `docs/tracking/RISK_REGISTER.md` | Project risk register, where maintained |

### 13.1 Tracking rules

- Use canonical phase and milestone identifiers.
- Keep status values consistent across related trackers.
- Distinguish planned, in-progress, blocked, accepted, and completed work.
- Link to evidence rather than copying entire reports.
- Record unknown values as `TBD` or the approved equivalent.
- Never infer completion from a planned date or an implementation claim alone.
- Reconcile affected trackers when a task, milestone, or dependency changes.

## 14. Planning Documentation Index

Primary planning documents include:

| File or directory | Purpose |
|---|---|
| `planning/PHASES.md` | Sole canonical phase definition |
| `planning/DECISIONS.md` | Project-wide decision records |
| `planning/` | Product planning, roadmap, requirements, and planning artifacts |
| `docs/**/milestones/` | Authoritative milestone scope and acceptance dossiers |
| `docs/tasks/<TASK-ID>/` | Task-specific execution documentation |

Before adding a planning document, determine whether the information belongs in an existing canonical file.

Do not create another phase definition, competing milestone catalog, or duplicate decision register.

## 15. Architecture Documentation Index

Architecture documentation defines system and domain responsibilities.

| Location | Expected responsibility |
|---|---|
| `docs/architecture/` | System-wide structure, component boundaries, and major interactions |
| `docs/frontend/` | Frontend architecture and client integration |
| `docs/backend/` | Service architecture, APIs, and backend behavior |
| `docs/database/` | Data architecture, schema ownership, and migration design |
| `docs/cloud/` | Infrastructure and deployment architecture |
| `docs/ui/` | UI structure, interaction standards, and design decisions |
| `docs/security/` | Security architecture, controls, and reviews |

The directory layout is a navigation aid. Confirm the actual file names in the repository before creating links or adding new documents.

## 16. Normative Contracts

Normative contracts define behavior that implementations must follow.

Examples include:

- API request and response formats
- protocol message structure and versioning
- database schema and constraints
- event names and payloads
- authentication and authorization requirements
- error semantics
- compatibility and versioning rules
- required safety or security constraints

A contract must have an identifiable owner and review process.

### 16.1 Contract ownership

The domain that owns the behavior is responsible for maintaining the authoritative contract unless the system architecture assigns ownership elsewhere.

Cross-domain consumers should reference the same contract rather than copying it into their own documentation.

### 16.2 Contract changes

A contract change must include:

- the reason for the change
- affected providers and consumers
- compatibility implications
- migration or rollout requirements, when applicable
- required validation evidence
- affected tasks and milestone dossiers
- an ADR when the change requires an architectural or governance decision

Update tracking documents to reflect delivery impact without copying the full contract.

## 17. Glossary

| Term | Definition |
|---|---|
| ADR | Architecture Decision Record: a structured record of a decision, its rationale, and consequences |
| Acceptance criteria | Observable conditions that must be satisfied for a task or milestone to be accepted |
| Authoritative document | The designated source of truth for a particular subject |
| Blocker | An unresolved issue that prevents required work from proceeding |
| Canonical phase | A phase identifier and name defined by `planning/PHASES.md` |
| Consumer | A task, component, domain, or milestone that requires a dependency's output |
| Contract | A normative specification of behavior or compatibility requirements |
| Dependency | A prerequisite, output, decision, resource, or approval required by another item of work |
| Domain | A bounded area of responsibility, such as frontend, backend, database, or cloud |
| Evidence | Verifiable output supporting a status or acceptance claim |
| Exit criteria | Conditions required to close a phase or milestone |
| Milestone | A bounded delivery unit identified by a canonical milestone ID |
| Milestone dossier | The authoritative set of documents defining milestone scope, tasks, and acceptance |
| Normative | Required behavior that implementations must conform to |
| Phase | A canonical project delivery phase defined in `planning/PHASES.md` |
| Provider | A task, component, domain, or external party supplying a required dependency |
| Reconciliation | Comparing documentation against authoritative records and resolving inconsistencies |
| Requirement | A product or engineering need that must be satisfied |
| Risk | An uncertain event or condition that may affect objectives |
| Source of truth | The document or system designated as authoritative for a particular subject |
| Task | An actionable unit of work with an owner, scope, and acceptance conditions |
| Traceability | Links connecting requirements, architecture, contracts, tasks, milestones, and evidence |

## 18. How to Add a Document

Before creating a new document:

1. Identify the question the document must answer.
2. Find the existing authoritative document for that subject.
3. Determine whether the information belongs in that document or a separate artifact.
4. Identify the owner and reviewers.
5. Choose a location consistent with the documentation hierarchy.
6. Link to related canonical documents.
7. Use the frozen phase and milestone identifiers where applicable.
8. Avoid copying material from another authoritative document.
9. Add the new file to this README if it is a significant navigation entry.
10. Validate all links before committing.

Create a new source of truth only when the existing hierarchy cannot appropriately own the information.

## 19. How to Update Existing Documentation

When updating documentation:

1. Read the current authoritative source.
2. Check the relevant milestone dossier and task records.
3. Identify all documents that reference the changed behavior.
4. Update the canonical owner first.
5. Update dependent documentation only where necessary.
6. Reconcile phase, milestone, task, and dependency references.
7. Update acceptance criteria if the required behavior has changed.
8. Update decision records when an approval or architectural decision changes.
9. Update status trackers based on verified evidence.
10. Run link and terminology checks.
11. Review the changes for consistency and completeness.
12. Commit the change with a clear description.

Do not update a tracking summary to conceal a disagreement in an authoritative contract or milestone dossier. Resolve the underlying conflict first.

## 20. Documentation Review Checklist

Before accepting a documentation change, verify:

- [ ] The document has a clear purpose.
- [ ] The owning domain or project authority is identifiable.
- [ ] The document follows the canonical hierarchy.
- [ ] The canonical phase definition is referenced rather than duplicated.
- [ ] Phase IDs and names match `planning/PHASES.md`.
- [ ] Milestone IDs and names match the frozen model.
- [ ] Milestone scope agrees with the authoritative dossier.
- [ ] Normative contracts are clearly distinguished from explanatory material.
- [ ] Dependencies identify providers, consumers, and acceptance conditions.
- [ ] Acceptance criteria are testable.
- [ ] Status claims are supported by evidence.
- [ ] Cross-references point to existing documents.
- [ ] No duplicate source of truth has been introduced.
- [ ] Retired terminology has not been reintroduced.
- [ ] Changelog and decision references are updated when applicable.
- [ ] The documentation index has been updated when necessary.

## 21. Link and Naming Conventions

Use relative Markdown links for documents within the repository where practical.

Examples:

- `[Canonical phases](../planning/PHASES.md)`
- `[Project status](tracking/STATUS.md)`
- `[Milestone status](tracking/MILESTONE_STATUS.md)`
- `[Dependency tracking](tracking/DEPENDENCY_TRACKING.md)`
- `[Decision log](tracking/DECISION_LOG.md)`

For task-specific documents, link to the relevant directory or file under `docs/tasks/<TASK-ID>/`.

For milestone documents, link to the actual existing dossier path. Do not infer or invent a directory name based only on a milestone ID.

Use exact canonical phase and milestone identifiers in headings, tables, task records, and cross-references.

Do not introduce alternative abbreviations or unofficial aliases for canonical identifiers.

## 22. Change Control and Governance

Changes to documentation follow the authority of the subject being changed.

| Change | Required authority |
|---|---|
| Phase definitions or boundaries | `planning/PHASES.md` owner and approved project governance |
| Milestone scope | Owning milestone dossier and its approved review process |
| Product requirements | Product/planning owner |
| System architecture | System architecture owner and relevant reviewers |
| Domain architecture | Owning domain and required reviewers |
| Normative contract | Contract owner and affected consumers |
| Database schema | Database owner and affected consumers |
| Decision content | Owning `DECISIONS.md` or ADR |
| Task scope and acceptance | Task owner and relevant milestone owner |
| Status and progress | Tracker owner, based on verified evidence |
| Risk status | Risk owner and relevant project governance |

A documentation update must not silently change an approved commitment, contract, or acceptance condition.

If a change affects multiple domains, identify the affected owners and obtain the required reviews before treating the change as accepted.

## 23. Documentation Health and Reconciliation

Periodically check documentation for:

- missing canonical files
- broken relative links
- duplicate source-of-truth documents
- mismatched phase or milestone identifiers
- stale task and milestone references
- missing owners or acceptance criteria
- status claims without evidence
- contracts that conflict with implementation
- dependencies without accountable owners
- unresolved decisions affecting committed work

Record significant gaps as explicit actions with an owner and a target date where one has been agreed.

Do not report a reconciliation as complete until the relevant files and references have been verified.

## 24. Initial Documentation Reconciliation

Use this checklist when applying the frozen model to an existing repository.

- [ ] Confirm `planning/PHASES.md` contains the canonical phase definitions.
- [ ] Confirm project-wide planning and decision documents link to the canonical phase file.
- [ ] Inventory all milestone dossiers under `docs/**/milestones/`.
- [ ] Verify that milestone identifiers and names match the frozen model.
- [ ] Confirm every milestone dossier contains the standard six files or an explicitly approved exception.
- [ ] Verify that task-specific documentation uses `docs/tasks/<TASK-ID>/`.
- [ ] Confirm tracking documents use canonical phase and milestone references.
- [ ] Verify that dependency records link to their provider and consumer work.
- [ ] Verify that decision indexes link to authoritative ADRs.
- [ ] Confirm that schemas and protocols have identifiable normative owners.
- [ ] Check all links in this README against the actual repository.
- [ ] Identify missing documents without assuming they exist.
- [ ] Record remaining reconciliation gaps with owners.
- [ ] Review changes before committing.

## 25. Completion Criteria for This Guide

This guide is ready for use when:

- the canonical documentation hierarchy is clear
- the phase reference points to `planning/PHASES.md`
- the frozen phase and milestone tables are consistent
- milestone dossier authority is explicit
- the standard milestone folder contents are documented
- task documentation locations are defined
- document ownership is clear
- tracking and planning indexes are available
- the glossary explains essential terms
- update and review procedures are documented
- repository links have been verified or identified as pending reconciliation
- no retired phase or milestone names appear in active documentation

Completion of this guide does not establish that every indexed document exists or that every repository reference has already been reconciled.

## 26. Changelog

### Frozen-Model Documentation Baseline

- Established `docs/README.md` as the documentation entry point.
- Documented the canonical documentation hierarchy.
- Established `planning/PHASES.md` as the sole authority for phase definitions.
- Added the frozen phase reference table.
- Added canonical frontend, backend, database, and cloud milestone tables.
- Confirmed milestone dossiers under `docs/**/milestones/` as authoritative for scope.
- Defined the standard milestone folder contents.
- Defined task-specific documentation under `docs/tasks/<TASK-ID>/`.
- Documented document ownership and tracking responsibilities.
- Added a glossary, update workflow, review checklist, and reconciliation checklist.
- Avoided claiming that unverified files, decisions, or milestones exist.

### Future Updates

Future updates must preserve the frozen phase and milestone identifiers, maintain the documentation hierarchy, and keep each subject's authoritative source clearly identified.
