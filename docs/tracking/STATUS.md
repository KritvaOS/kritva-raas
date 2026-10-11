# Kritva RaaS — Master Project Status

## 1. Purpose

This document is the master status dashboard for Kritva RaaS. It provides a consolidated view of phase progress, frontend milestones, backend milestones, database milestones, cloud milestones, cross-domain dependencies, blockers, review gates, and delivery evidence.

The dashboard is the central coordination reference for product and engineering execution. It helps the team distinguish planned work from work in progress, completed work, blocked work, and formally accepted deliverables.

This document is a status record, not an implementation specification. Detailed scope and acceptance criteria remain in the authoritative milestone dossiers under `docs/**/milestones/`.

The dashboard is initialized against the frozen canonical phase and milestone model. Unless explicitly recorded in the P0 FOUNDATION documentation baseline, all phases and milestones begin with status `NOT STARTED`.

The dashboard must not imply that implementation, integration, testing, or production readiness has been achieved without supporting evidence.

## 2. Canonical References

| Concern | Authoritative reference |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| Frontend milestone scope | `docs/frontend/milestones/` |
| Backend milestone scope | `docs/backend/milestones/` |
| Database milestone scope | `docs/database/milestones/` |
| Cloud milestone scope | `docs/cloud/milestones/` |
| UI delivery status and scope | `docs/ui/UI_MILESTONES.md` |
| Frontend roadmap | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Frontend task backlog | `docs/frontend/planning/FRONTEND_TASKS.md` |
| Backend roadmap | `docs/backend/planning/BACKEND_ROADMAP.md` |
| Backend task backlog | `docs/backend/planning/BACKEND_TASKS.md` |
| Database roadmap | `docs/database/planning/DATABASE_ROADMAP.md` |
| Database task backlog | `docs/database/planning/DATABASE_TASKS.md` |
| Cloud roadmap | `docs/cloud/planning/CLOUD_ROADMAP.md` |
| Project risks | `docs/tracking/RISK_REGISTER.md` |
| Project decisions | `planning/DECISIONS.md` |
| Product plan | `planning/` |
| Acceptance evidence | Relevant milestone dossier and test reports |

A reference to a directory does not establish that every expected file exists. Missing documents must be tracked explicitly.

### 2.1 Source-of-truth rules

1. `planning/PHASES.md` is the sole authority for phase definitions.
2. Milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope and milestone-specific acceptance criteria.
3. Task backlogs are authoritative for task-level assignment and execution status.
4. This dashboard consolidates status and does not redefine phase or milestone scope.
5. When sources disagree, record the discrepancy and resolve it with the responsible owner.
6. A status must not be upgraded merely because a task was merged or a screen was implemented.
7. A milestone is complete only when its required acceptance evidence and approval are recorded.

## 3. Status Vocabulary

Use the following status values consistently.

| Status | Meaning |
|---|---|
| `NOT STARTED` | Work has not started; no active implementation is claimed. |
| `IN PROGRESS` | Work has started and has an identifiable owner and current activity. |
| `BLOCKED` | Work cannot progress because a required dependency, decision, or resource is unavailable. |
| `IN REVIEW` | Implementation is available for review, but acceptance is not complete. |
| `ACCEPTED` | Required acceptance criteria are satisfied and acceptance evidence is recorded. |
| `COMPLETE` | The milestone or phase is formally closed under its governing completion rules. |
| `DEFERRED` | Work has been explicitly postponed through an approved decision. |
| `NOT APPLICABLE` | The requirement does not apply, with documented rationale and approval. |

`ACCEPTED` means the defined scope has passed acceptance. `COMPLETE` means the governing closure requirements have also been satisfied.

Do not use `COMPLETE` as a substitute for `IN PROGRESS`, `IN REVIEW`, or `ACCEPTED`.

## 4. Dashboard Baseline

**Baseline status:** Initialized.

**Canonical model:** Frozen phase and milestone identifiers listed in this document.

**Initial milestone status:** All milestones are `NOT STARTED`, unless P0 FOUNDATION documentation work is explicitly recorded as `IN PROGRESS` with an owner and evidence.

**Initial production status:** `NOT STARTED`.

**Initial acceptance status:** No milestone is considered accepted solely because this dashboard has been initialized.

### 4.1 Initialization rules

- P0 FOUNDATION documentation work may be marked `IN PROGRESS` only when actual work has started.
- Do not infer that every P0 FOUNDATION task is active because one documentation task is active.
- Do not infer that any milestone is accepted from the existence of a roadmap or planning document.
- Existing code or previously completed work must be reconciled against the current milestone dossier before its status is upgraded.
- Historical evidence may be reused only when it directly satisfies the current acceptance criteria.
- If evidence is missing, retain the existing status and record the missing evidence.
- Production deployment remains `NOT STARTED` until the relevant production milestone is formally authorized and executed.

## 5. Executive Status Summary

Update this section at each formal status review.

| Indicator | Initial status | Update rule |
|---|---|---|
| Overall product delivery | NOT STARTED | Based on phase progress and critical-path readiness |
| Phase progress | NOT STARTED, except documented P0 FOUNDATION work | Based on phase acceptance evidence |
| Frontend delivery | NOT STARTED | Based on F-M01 through F-M07 |
| Backend delivery | NOT STARTED | Based on B-M01 through B-M07 |
| Database delivery | NOT STARTED | Based on DB-M01 through DB-M04 |
| Cloud delivery | NOT STARTED | Based on C-M01 through C-M04 |
| Cross-domain integration | NOT STARTED | Based on verified integrated workflows |
| Security acceptance | NOT STARTED | Based on documented security requirements and evidence |
| Production readiness | NOT STARTED | Based on B-M07 PRODUCTION and C-M04 PRODUCTION requirements |
| Open blockers | Not yet baselined | Record each blocker with owner and target resolution |
| Critical risks | Not yet baselined | Record in `docs/tracking/RISK_REGISTER.md` |
| Latest review | Pending initial review | Record date and attendees |

This summary is a starting baseline, not a claim that the underlying engineering work has been independently audited.

## 6. Canonical Phase Status

Phase definitions are maintained only in `planning/PHASES.md`. The following table records status and milestone coverage without redefining phase scope.

| Phase | Canonical name | Initial status | Status evidence |
|---|---|---|---|
| P0 | FOUNDATION | NOT STARTED unless documentation work is verified in progress | Foundation documentation and acceptance records |
| P1 | STUDIO | NOT STARTED | Studio and project workflow evidence |
| P2 | BUILD & ARTIFACT | NOT STARTED | Build and Artifact workflow evidence |
| P3 | CONTROL PLANE | NOT STARTED | Control Plane and core service evidence |
| P4 | BOOKING & COMMERCIAL | NOT STARTED | Booking, quote, and commercial workflow evidence |
| P5 | EXECUTION | NOT STARTED | Job submission and execution lifecycle evidence |
| P6 | LAB & ROBOT | NOT STARTED | Lab and robot capability evidence |
| P7 | LIVE & RESULTS | NOT STARTED | Live and Results workflow evidence |
| P8 | PRODUCTION | NOT STARTED | Production qualification and operational acceptance evidence |

### 6.1 Phase status rules

- Phase status must be derived from the authoritative phase definition and the relevant milestone acceptance evidence.
- A phase may contain milestones owned by multiple engineering domains.
- A milestone spanning more than one phase must retain its canonical mapping.
- Phase progress must not be calculated by counting tasks alone.
- A phase cannot be marked `COMPLETE` while required acceptance evidence is missing.
- A phase may be blocked even when some of its constituent tasks are complete.
- P8 PRODUCTION production work must not be represented as complete based only on staging success.

## 7. Frontend Milestone Status

Frontend milestone scope is governed by the dossiers under `docs/frontend/milestones/`.

| ID | Frozen milestone name | Phase mapping | Initial status |
|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | NOT STARTED |
| F-M02 | PROJECTS | P1 | NOT STARTED |
| F-M03 | BUILD & ARTIFACT | P2 | NOT STARTED |
| F-M04 | BOOKING | P4 | NOT STARTED |
| F-M05 | EXECUTION | P5 | NOT STARTED |
| F-M06 | LIVE | P7 | NOT STARTED |
| F-M07 | RESULTS | P7 | NOT STARTED |

### 7.1 Frontend status evidence

For each frontend milestone, track:

- screen inventory and delivery status
- design deliverables and review outcome
- API contract readiness
- frontend implementation and code review
- component and screen test results
- integrated workflow test results
- accessibility review
- authorization and error-state behavior
- open defects and limitations
- acceptance decision and evidence reference

### 7.2 Frontend status rules

- Screens implemented against mocks do not establish production API integration.
- A successful render does not prove that authorization is correct.
- Empty states, errors, retries, and recovery states are part of the deliverable.
- A frontend milestone remains blocked if a critical backend contract is unresolved and no approved development arrangement exists.
- Live and Results behavior must reflect authoritative backend state.
- Milestone scope and acceptance must follow the corresponding frontend dossier.

## 8. Backend Milestone Status

Backend milestone scope is governed by the dossiers under `docs/backend/milestones/`.

| ID | Frozen milestone name | Phase mapping | Initial status |
|---|---|---|---|
| B-M01 | CONTROL PLANE | P3 | NOT STARTED |
| B-M02 | ARTIFACT | P2-P3 | NOT STARTED |
| B-M03 | PLATFORM | P3 | NOT STARTED |
| B-M04 | BOOKING | P4 | NOT STARTED |
| B-M05 | EXECUTION | P5 | NOT STARTED |
| B-M06 | RESULTS | P6-P7 | NOT STARTED |
| B-M07 | PRODUCTION | P8 | NOT STARTED |

### 8.1 Backend status evidence

For each backend milestone, track:

- service and API implementation
- contract definitions and versioning
- authentication and authorization
- domain-state validation
- persistence and transaction behavior
- idempotency and retry behavior where required
- unit and integration tests
- observability and operational diagnostics
- security review
- acceptance evidence and known limitations

### 8.2 Backend status rules

- An API endpoint is not accepted solely because it returns a successful response for one request.
- State transitions must be validated against the authoritative domain model.
- Booking, execution, and Result operations must preserve their distinct responsibilities.
- A backend feature requiring durable state must identify its persistence dependency.
- A service must not be marked accepted without the required failure-path and authorization tests.
- B-M07 PRODUCTION acceptance must follow its authoritative dossier.

## 9. Database Milestone Status

Database milestone scope is governed by the dossiers under `docs/database/milestones/`.

| ID | Frozen milestone name | Phase mapping | Initial status |
|---|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 | NOT STARTED |
| DB-M02 | CORE DATA | P3 | NOT STARTED |
| DB-M03 | BOOKING DATA | P4 | NOT STARTED |
| DB-M04 | EXECUTION DATA | P5-P7 | NOT STARTED |

### 9.1 Database status evidence

For each database milestone, track:

- schema and migration definitions
- primary and foreign key constraints
- tenant and organization isolation
- indexes and query behavior
- transaction and concurrency semantics
- migration compatibility
- migration rollback or recovery strategy where supported
- backup and restore evidence where applicable
- retention and archival requirements
- integrity tests and review outcomes

### 9.2 Database status rules

- Schema files alone do not prove that migrations work.
- Migration success must be tested against supported database environments.
- Concurrency-sensitive booking operations require transaction and conflict evidence.
- Execution data must preserve relationships among Jobs, Runs, events, and Results.
- Tenant isolation must be enforced and tested at the appropriate service and persistence boundaries.
- Production qualification work must be tracked under the applicable production plan and must not alter the frozen DB-M04 phase mapping.
- Database production readiness must not be represented as a separate database milestone because no such milestone exists in the frozen model.

## 10. Cloud Milestone Status

Cloud milestone scope is governed by the dossiers under `docs/cloud/milestones/`.

| ID | Frozen milestone name | Phase mapping | Initial status |
|---|---|---|---|
| C-M01 | FOUNDATION | P0 | NOT STARTED |
| C-M02 | DEVELOPMENT | P1-P3 | NOT STARTED |
| C-M03 | STAGING | P4-P7 | NOT STARTED |
| C-M04 | PRODUCTION | P8 | NOT STARTED |

### 10.1 Cloud status evidence

For each cloud milestone, track:

- environment configuration
- infrastructure definitions
- deployment and configuration procedures
- secrets and identity integration
- network and service connectivity
- logging, metrics, and alerting
- artifact and data access
- environment-specific configuration
- recovery and operational procedures
- security review and acceptance evidence

### 10.2 Cloud status rules

- A developer environment does not establish staging readiness.
- A staging deployment does not establish production readiness.
- Configuration and secret handling must follow approved security requirements.
- Deployment procedures must be repeatable and documented.
- Environment acceptance must include evidence for relevant service dependencies.
- C-M04 PRODUCTION must not be marked complete before required production approval and operational checks.

## 11. Cross-Domain Dependency Status

The following table identifies major coordination relationships. The authoritative dossiers define the detailed dependencies and their ordering.

| Frontend milestone | Backend milestones | Database milestones | Cloud milestones |
|---|---|---|---|
| F-M01 STUDIO FOUNDATION | B-M01 CONTROL PLANE | DB-M01 FOUNDATION | C-M01 FOUNDATION; C-M02 DEVELOPMENT |
| F-M02 PROJECTS | B-M01 CONTROL PLANE | DB-M02 CORE DATA | C-M02 DEVELOPMENT |
| F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT; B-M01 CONTROL PLANE | DB-M02 CORE DATA | C-M02 DEVELOPMENT |
| F-M04 BOOKING | B-M03 PLATFORM; B-M04 BOOKING | DB-M02 CORE DATA; DB-M03 BOOKING DATA | C-M03 STAGING |
| F-M05 EXECUTION | B-M05 EXECUTION; B-M02 ARTIFACT; B-M04 BOOKING | DB-M04 EXECUTION DATA | C-M03 STAGING |
| F-M06 LIVE | B-M06 RESULTS; B-M05 EXECUTION where applicable | DB-M04 EXECUTION DATA | C-M03 STAGING |
| F-M07 RESULTS | B-M06 RESULTS; B-M05 EXECUTION | DB-M04 EXECUTION DATA | C-M03 STAGING |

These relationships are coordination references, not substitutes for the milestone dossiers. A team may develop against a contract-approved mock while a dependency is being implemented, but final integration status must reflect real integrated behavior.

## 12. Dependency Register

Maintain a dependency register with one row per actionable dependency.

| Field | Description |
|---|---|
| Dependency ID | Unique tracking identifier |
| Provider milestone | Milestone supplying the capability |
| Consumer milestone | Milestone requiring the capability |
| Dependency description | Specific API, schema, environment, or decision |
| Required-by milestone | Earliest milestone acceptance that needs it |
| Owner | Person or role responsible for resolution |
| Status | NOT STARTED, IN PROGRESS, BLOCKED, or ACCEPTED |
| Evidence | Contract, test, deployment, or decision reference |
| Target date | Agreed resolution date |
| Escalation | Required escalation if the date is missed |

### 12.1 Dependency management rules

- Dependencies must describe a specific deliverable, not just a team name.
- Each dependency must have one accountable owner.
- A dependency is accepted only when the consumer's stated requirement is met.
- Changes to API contracts must be communicated to affected consumers.
- Unresolved dependencies that threaten acceptance must be escalated before the milestone review.
- A milestone must not be marked accepted based on an undocumented assumption that a dependency will be completed later.

## 13. Blocker Register

A blocker is an issue that prevents an identified task, milestone, or phase from progressing or being accepted.

| Field | Description |
|---|---|
| Blocker ID | Unique identifier |
| Date raised | Date first recorded |
| Affected phase or milestone | Canonical identifier |
| Description | Observable problem and impact |
| Blocking condition | Exact requirement preventing progress |
| Owner | Accountable resolver |
| Required action | Concrete resolution |
| Target resolution | Agreed date |
| Escalation owner | Person responsible if unresolved |
| Status | OPEN, IN PROGRESS, RESOLVED, or ACCEPTED RISK |
| Resolution evidence | Link to fix, test, decision, or approval |

### 13.1 Blocker rules

- Do not record vague entries such as “waiting on backend” without naming the missing API or decision.
- Record the affected milestone using its exact frozen identifier.
- A blocker is resolved only after its resolution is verified.
- If a blocker is accepted as a risk, record the approving role and residual impact.
- Reopen the blocker if the same condition recurs or the original evidence is invalidated.

## 14. Risk and Issue Coordination

Risk records are maintained in `docs/tracking/RISK_REGISTER.md` where available.

Each material risk must identify:

- risk ID
- affected phase and milestones
- likelihood and impact
- mitigation
- contingency
- owner
- review date
- trigger or warning condition
- residual risk
- acceptance authority where applicable

Risks and blockers must not be conflated. A risk describes a possible future adverse outcome; a blocker describes a current impediment.

Security, resource safety, data integrity, tenant isolation, financial correctness, and production recovery risks require explicit review and must not be closed solely because the primary user journey succeeds.

## 15. Acceptance and Closure Evidence

A milestone's acceptance record must link to evidence appropriate to its scope.

Minimum evidence categories include:

- approved scope and design where applicable
- implementation review
- automated test results
- integration test results
- security and authorization tests
- migration and persistence evidence where applicable
- deployment evidence where applicable
- failure and recovery tests
- known-defect disposition
- reviewer and acceptance date

### 15.1 Acceptance rules

- Acceptance must be traceable to the milestone dossier.
- Test evidence must identify the tested commit or build where practical.
- A passing test suite does not replace required manual review.
- Manual review does not replace required automated tests.
- Deferred requirements must have explicit approval and a tracked disposition.
- Any exception must identify its scope, owner, rationale, and expiry or review condition.
- A milestone must not be marked `COMPLETE` until all closure requirements are satisfied.

## 16. Product Workflow Readiness

The product workflow should be assessed as a chain of independently verifiable capabilities.

| Workflow segment | Required evidence |
|---|---|
| Application entry | Identity, navigation, and authorization behavior |
| Project management | Project creation, access, and context behavior |
| Build and Artifact | Build lifecycle, Artifact metadata, and validation state |
| Resource booking | Availability, quote, reservation, and cancellation behavior |
| Execution | Job submission, Run tracking, and recovery behavior |
| Live interaction | Connection state, telemetry freshness, and session behavior |
| Results analysis | Result provenance, files, metrics, and comparison behavior |
| Production operation | Deployment, security, monitoring, backup, and recovery evidence |

Workflow readiness must be based on the relevant frontend, backend, database, and cloud evidence. The existence of a screen does not prove that the complete workflow is operational.

## 17. Initial Work-In-Progress Rules

During initialization, use these rules to prevent accidental overstatement of progress.

- Record actual P0 FOUNDATION documentation work as `IN PROGRESS` only when a concrete task has started.
- Record its task identifier, owner, evidence, and next action.
- Leave other P0 FOUNDATION work `NOT STARTED` unless there is separate evidence of activity.
- Keep all frontend, backend, database, and cloud milestones `NOT STARTED` until verified work justifies a status change.
- Do not mark a milestone `IN REVIEW` until the implementation is available and review has formally started.
- Do not mark a milestone `ACCEPTED` without the required acceptance evidence.
- Do not mark a phase `COMPLETE` because its planning documents are complete.
- Do not infer current status from old commits without checking the current branch, tests, dossier, and acceptance requirements.

## 18. Status Update Procedure

Update this dashboard whenever a material status change occurs and during each scheduled project review.

### Step 1: Reconcile task status

Review the applicable task backlog and identify:

- newly started work
- completed implementation tasks
- tasks awaiting review
- blockers
- failed or incomplete tests
- missing dependencies
- changes to target dates

### Step 2: Verify evidence

Confirm the status against current artifacts:

- commits and pull requests
- build and test reports
- API contract references
- integration test results
- deployment evidence
- review records
- acceptance decisions

### Step 3: Update milestone status

Update the affected milestone row and its evidence references. Preserve the frozen identifier, name, and phase mapping.

### Step 4: Update phase status

Reassess the phase using `planning/PHASES.md` and the applicable milestone dossiers. Do not redefine the phase or change its canonical boundaries.

### Step 5: Update risks and blockers

Create or update the corresponding entries in the risk and blocker registers. Assign owners and next actions.

### Step 6: Record review metadata

Record the update date, reviewer, relevant commit or report, and any decisions made.

## 19. Status Review Cadence

| Review | Suggested cadence | Focus |
|---|---|---|
| Engineering status | Weekly | Task progress, tests, implementation, and blockers |
| Cross-domain integration | Weekly during active integration | API readiness, environment health, and end-to-end workflows |
| Milestone acceptance | At milestone exit | Acceptance criteria and evidence |
| Risk review | Weekly and on material changes | Risks, mitigations, and escalation |
| Phase review | At phase transition | Cross-domain acceptance and unresolved dependencies |
| Production readiness review | Before production authorization | Security, operations, recovery, and approval evidence |

The cadence may be adjusted by project governance, but acceptance and production authorization remain evidence-driven.

## 20. Status Change History

Maintain a concise history of material dashboard changes.

| Date | Item | Previous status | New status | Evidence | Updated by |
|---|---|---|---|---|---|
| Baseline initialization | Master dashboard | — | Initialized | Frozen phase and milestone inventory | Project team |
| Pending | Phase and milestone reconciliation | — | NOT STARTED | Initial reconciliation required | Unassigned |

Replace the pending row with actual review evidence when the first reconciliation is performed.

Do not record a status change as complete until the underlying artifact or acceptance evidence exists.

## 21. Phase and Milestone Inventory Validation

Before each formal project review, verify that the dashboard contains exactly the canonical inventory.

### 21.1 Phase inventory

- [ ] P0 FOUNDATION
- [ ] P1 STUDIO
- [ ] P2 BUILD & ARTIFACT
- [ ] P3 CONTROL PLANE
- [ ] P4 BOOKING & COMMERCIAL
- [ ] P5 EXECUTION
- [ ] P6 LAB & ROBOT
- [ ] P7 LIVE & RESULTS
- [ ] P8 PRODUCTION

### 21.2 Frontend milestone inventory

- [ ] F-M01 STUDIO FOUNDATION — P0-P1
- [ ] F-M02 PROJECTS — P1
- [ ] F-M03 BUILD & ARTIFACT — P2
- [ ] F-M04 BOOKING — P4
- [ ] F-M05 EXECUTION — P5
- [ ] F-M06 LIVE — P7
- [ ] F-M07 RESULTS — P7

### 21.3 Backend milestone inventory

- [ ] B-M01 CONTROL PLANE — P3
- [ ] B-M02 ARTIFACT — P2-P3
- [ ] B-M03 PLATFORM — P3
- [ ] B-M04 BOOKING — P4
- [ ] B-M05 EXECUTION — P5
- [ ] B-M06 RESULTS — P6-P7
- [ ] B-M07 PRODUCTION — P8

### 21.4 Database milestone inventory

- [ ] DB-M01 FOUNDATION — P0-P3
- [ ] DB-M02 CORE DATA — P3
- [ ] DB-M03 BOOKING DATA — P4
- [ ] DB-M04 EXECUTION DATA — P5-P7

### 21.5 Cloud milestone inventory

- [ ] C-M01 FOUNDATION — P0
- [ ] C-M02 DEVELOPMENT — P1-P3
- [ ] C-M03 STAGING — P4-P7
- [ ] C-M04 PRODUCTION — P8

Any discrepancy must be corrected against the frozen canonical model. Do not introduce substitute names, additional milestone identifiers, or alternative phase boundaries into this dashboard.

## 22. Governance and Change Control

Changes to this dashboard may update status, owners, evidence, blockers, risks, and target dates. They must not independently change canonical phase or milestone definitions.

Changes to phase definitions must be made in `planning/PHASES.md` through the project governance process.

Changes to milestone scope must be made in the relevant authoritative dossier under `docs/**/milestones/`. This dashboard must then be reconciled with the approved change.

Changes to task assignments must be reflected in the applicable task backlog.

If an approved change affects multiple domains, record the impact on frontend, backend, database, cloud, integration, and acceptance planning.

### 22.1 Required change record

Each material change should identify:

- change date
- change author
- affected phase or milestone
- previous and new status or scope reference
- rationale
- dependency impact
- acceptance impact
- supporting evidence
- required reviewer or approval

## 23. Dashboard Maintenance Checklist

- [ ] Canonical phase names and identifiers match `planning/PHASES.md`.
- [ ] All frozen frontend milestones are listed.
- [ ] All frozen backend milestones are listed.
- [ ] All frozen database milestones are listed.
- [ ] All frozen cloud milestones are listed.
- [ ] Each milestone status has a defensible evidence basis.
- [ ] In-progress work has an owner and next action.
- [ ] Blockers have owners, resolution actions, and target dates.
- [ ] Risks have mitigation and review dates.
- [ ] Dependencies identify provider and consumer milestones.
- [ ] Accepted milestones link to acceptance evidence.
- [ ] Production readiness is not inferred from staging readiness.
- [ ] Cross-domain integration status reflects real integrated tests.
- [ ] Status history records material changes.
- [ ] No retired phase or milestone names appear in active planning references.
- [ ] Detailed scope remains delegated to authoritative milestone dossiers.

## 24. Baseline Acceptance

The dashboard baseline is accepted for tracking purposes when:

- the canonical phase inventory is present
- all frozen milestone identifiers and names are present
- initial statuses are explicitly recorded
- P0 FOUNDATION documentation work is marked `IN PROGRESS` only where verified
- authoritative references are identified
- status vocabulary is defined
- dependency and blocker tracking rules are established
- acceptance evidence requirements are documented
- status update procedures are defined
- project governance owns subsequent updates

Baseline acceptance does not mean that any product milestone, phase, or production deployment has been accepted.

## 25. Changelog

### Initial Frozen-Model Baseline

- Initialized the master status dashboard against P0 through P8.
- Added all frozen frontend milestones F-M01 through F-M07.
- Added all frozen backend milestones B-M01 through B-M07.
- Added all frozen database milestones DB-M01 through DB-M04.
- Added all frozen cloud milestones C-M01 through C-M04.
- Established initial `NOT STARTED` statuses, subject to verified P0 FOUNDATION documentation work.
- Defined status vocabulary and evidence-driven status transitions.
- Added cross-domain dependency, blocker, risk, and acceptance tracking rules.
- Established `planning/PHASES.md` as the canonical phase definition.
- Preserved the authoritative role of milestone dossiers under `docs/**/milestones/`.
- Added dashboard update, validation, and governance procedures.

### Future Updates

Future changes must preserve the frozen phase and milestone identifiers, exact names, and phase mappings unless the canonical model is formally changed through project governance.
