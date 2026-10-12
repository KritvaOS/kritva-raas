# Kritva RaaS — Task Status Tracker

## 1. Purpose

This document is the consolidated task-level status tracker for Kritva RaaS across frontend, backend, database, and cloud engineering.

It defines how tasks are identified, assigned, prioritized, started, reviewed, accepted, blocked, deferred, and closed. It also provides initial task tables seeded from the canonical domain backlogs.

The tracker supports:

- consistent task identifiers across engineering domains
- traceability from tasks to phases and milestones
- accountable ownership and target dates
- dependency and blocker management
- implementation and review status
- acceptance evidence and closure decisions
- reconciliation with milestone and phase status
- cross-domain delivery forecasting

This document is a tracking artifact. It does not replace domain task backlogs, milestone dossiers, acceptance criteria, or engineering specifications.

The existing milestone dossiers under `docs/**/milestones/` remain authoritative for milestone scope. Domain task backlogs remain the source of detailed task definitions and estimates. This file consolidates task status and cross-domain traceability.

The initial task baseline must reflect the actual task backlogs. A task must not be marked complete simply because it appears in a planning document.

## 2. Canonical References

| Concern | Authoritative reference |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| Master project status | `docs/tracking/STATUS.md` |
| Phase status | `docs/tracking/PHASE_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |
| Frontend milestone scope | `docs/frontend/milestones/` |
| Frontend task backlog | `docs/frontend/planning/FRONTEND_TASKS.md` |
| Frontend roadmap | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Backend milestone scope | `docs/backend/milestones/` |
| Backend task backlog | `docs/backend/planning/BACKEND_TASKS.md` |
| Backend roadmap | `docs/backend/planning/BACKEND_ROADMAP.md` |
| Database milestone scope | `docs/database/milestones/` |
| Database task backlog | `docs/database/planning/DATABASE_TASKS.md` |
| Database roadmap | `docs/database/planning/DATABASE_ROADMAP.md` |
| Cloud milestone scope | `docs/cloud/milestones/` |
| Cloud task backlog | `docs/cloud/planning/CLOUD_TASKS.md` |
| Cloud roadmap | `docs/cloud/planning/CLOUD_ROADMAP.md` |
| Risk register | `docs/tracking/RISK_REGISTER.md` |
| Project decisions | `planning/DECISIONS.md` |

If a referenced backlog or document does not exist, record it as a documentation gap. Do not fabricate task details or claim that a backlog has been reconciled when it has not been inspected.

## 3. Source-of-Truth Rules

1. `planning/PHASES.md` is the sole canonical definition of phase names and boundaries.
2. Existing milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.
3. Domain task backlogs are authoritative for detailed task definitions, planned effort, and domain-specific acceptance conditions.
4. This tracker consolidates task status and traceability.
5. `docs/tracking/MILESTONE_STATUS.md` is authoritative for the consolidated milestone status view.
6. `docs/tracking/PHASE_STATUS.md` is authoritative for the phase status view.
7. The master project dashboard in `docs/tracking/STATUS.md` provides the overall project summary.
8. A task may reference a milestone but must not redefine that milestone's scope.
9. A task's phase and milestone mappings must follow the frozen canonical model.
10. All task status claims must be supported by current evidence.

If two sources disagree, preserve the discrepancy, identify the responsible owner, and resolve it through the project's review process.

## 4. Frozen Phase Inventory

Use these exact phase identifiers and names in task records.

| Phase | Canonical name |
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

This table is an index to `planning/PHASES.md`, not an independent phase definition.

Do not create alternative phase names, renumber phases, or infer phase boundaries from task identifiers.

## 5. Frozen Milestone Inventory

### 5.1 Frontend milestones

| ID | Exact name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

### 5.2 Backend milestones

| ID | Exact name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

### 5.3 Database milestones

| ID | Exact name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

### 5.4 Cloud milestones

| ID | Exact name | Phase mapping |
|---|---|---|
| C-M01 | FOUNDATION | P0 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

These mappings are frozen. Task assignment must follow the relevant domain backlog and authoritative milestone dossier.

## 6. Task Identifier Convention

Use the task identifier format:

    KR-<DOMAIN>-<PHASE>-<NNN>

Where:

- `KR` identifies the Kritva RaaS task namespace.
- `DOMAIN` is `FE`, `BE`, `DB`, or `CL`.
- `PHASE` is the canonical phase identifier, such as `P0` or `P4`.
- `NNN` is a three-digit sequence unique within the domain and phase.

Examples:

- `KR-FE-P0-001`
- `KR-BE-P3-001`
- `KR-DB-P4-001`
- `KR-CL-P0-001`

The identifier is stable after assignment. A task must not be renumbered merely because its priority, owner, target date, or status changes.

### 6.1 Identifier rules

- Use `FE` for frontend tasks.
- Use `BE` for backend tasks.
- Use `DB` for database tasks.
- Use `CL` for cloud tasks.
- Use the canonical phase identifier in the task ID.
- Use a sequence number that does not collide with an existing task in the same domain and phase.
- Never reuse an identifier after a task is cancelled or deferred.
- Preserve the original ID when a task is moved within the same phase.
- If a task's phase assignment genuinely changes, update the phase field and review whether the ID remains semantically correct; document any approved identifier change and retain the old ID as an alias in the change record.
- Do not encode milestone names into task IDs.
- Do not use task IDs to imply a milestone mapping that has not been confirmed.

## 7. Task Status Vocabulary

| Status | Meaning |
|---|---|
| `NOT STARTED` | Work has not started. |
| `READY` | Scope, dependencies, owner, and acceptance conditions are sufficiently clear to begin. |
| `IN PROGRESS` | Work is actively being implemented. |
| `BLOCKED` | A dependency, decision, resource, or technical issue prevents progress. |
| `IN REVIEW` | Implementation is available for review. |
| `CHANGES REQUESTED` | Review identified required changes before acceptance. |
| `ACCEPTED` | Task acceptance conditions are satisfied and evidence is recorded. |
| `COMPLETE` | Required implementation, review, acceptance, and closure actions are complete. |
| `DEFERRED` | An approved decision postpones the task. |
| `CANCELLED` | An approved decision removes the task from the active scope. |

### 7.1 Status rules

- `NOT STARTED` is the default when work has not begun.
- `READY` requires a clear scope, owner, dependencies, and acceptance criteria.
- `IN PROGRESS` requires actual work and an identified next action.
- `BLOCKED` requires a specific blocking condition and a resolution owner.
- `IN REVIEW` requires reviewable deliverables and available evidence.
- `CHANGES REQUESTED` returns to `IN PROGRESS` after the required changes are accepted for implementation.
- `ACCEPTED` requires passing acceptance criteria.
- `COMPLETE` requires acceptance plus any required closure actions.
- `DEFERRED` and `CANCELLED` require an approved rationale.
- A completed task must be reopened if its evidence is invalidated by a material change.

## 8. Acceptance State

Track acceptance separately from implementation status.

| Acceptance state | Meaning |
|---|---|
| `NOT ASSESSED` | Acceptance has not been evaluated. |
| `PENDING` | Acceptance awaits implementation evidence or review. |
| `BLOCKED` | An acceptance condition cannot be satisfied because of an unresolved blocker. |
| `ACCEPTED` | All applicable task acceptance conditions pass. |
| `ACCEPTED WITH EXCEPTIONS` | Approved exceptions remain documented. |
| `REJECTED` | The deliverable failed acceptance review. |
| `NOT APPLICABLE` | Formal approval establishes that acceptance is not required for the task. |

Do not infer acceptance from a merged change, successful build, or passing unit test alone when the task requires additional evidence.

## 9. Priority and Effort

### 9.1 Priority

| Priority | Meaning |
|---|---|
| `PRI-0` | Immediate prerequisite, critical blocker, or essential foundation task. |
| `PRI-1` | High-priority task required for planned milestone progress. |
| `PRI-2` | Important task that can follow higher-priority dependencies. |
| `PRI-3` | Lower-priority improvement or follow-up task. |

Task priority is distinct from the canonical phase identifier. Use the `Priority` field for task urgency and the `Phase` field for phase assignment.

### 9.2 Effort

Record effort in the unit used by the authoritative domain backlog. Where effort is expressed in person-days, preserve that unit.

Each task should include:

- original estimate
- current estimate
- actual effort where available
- remaining effort where available
- estimate owner
- reason for material estimate changes

Do not invent estimates to make the initial tracker appear complete. Use `TBD` where the source backlog has no estimate.

## 10. Required Task Record

Each task record must contain the following fields.

| Field | Required content |
|---|---|
| Task ID | Stable canonical task identifier |
| Title | Short action-oriented task title |
| Domain | FE, BE, DB, or CL |
| Phase | Canonical phase ID and name |
| Milestone | Exact milestone ID and name, or `TBD` pending reconciliation |
| Status | Approved task status |
| Priority | PRI-0, PRI-1, PRI-2, or PRI-3 |
| Owner | Accountable person or role |
| Dependencies | Task IDs, milestone IDs, or external deliverables |
| Acceptance state | Approved acceptance state |
| Acceptance criteria | Source reference or concise task-specific criteria |
| Planned start | Approved date or `TBD` |
| Target date | Approved date or `TBD` |
| Actual start | Observed date or `TBD` |
| Completion date | Verified date or `TBD` |
| Estimate | Source estimate or `TBD` |
| Evidence | Commit, pull request, test report, document, or review |
| Blocker | Specific blocker or `None` |
| Next action | Concrete next step |
| Last reviewed | Date of last reconciliation |

## 11. Initial Task Baseline Rules

The initial tables below provide tracking rows for the frozen domain backlogs. They are not a substitute for importing and reconciling every task in the source backlogs.

When an authoritative backlog is available:

1. Preserve each existing task ID.
2. Preserve the exact task title and scope.
3. Preserve the canonical phase assignment.
4. Map the task to its authoritative milestone dossier.
5. Import owner, priority, dependencies, estimates, and dates where available.
6. Preserve actual implementation and acceptance evidence.
7. Record missing fields as `TBD` or `Not assessed`.
8. Do not mark work complete based on an inferred status.
9. Identify duplicate or conflicting task IDs before merging records.
10. Record reconciliation completion and source revision.

### 11.1 Source reconciliation status

| Domain | Source backlog | Initial reconciliation state |
|---|---|---|
| Frontend | `docs/frontend/planning/FRONTEND_TASKS.md` | Pending source reconciliation |
| Backend | `docs/backend/planning/BACKEND_TASKS.md` | Pending source reconciliation |
| Database | `docs/database/planning/DATABASE_TASKS.md` | Pending source reconciliation |
| Cloud | `docs/cloud/planning/CLOUD_TASKS.md` | Pending source reconciliation |

If the cloud task backlog is not present, create or approve it through the project planning process before claiming that the cloud task inventory is complete.

## 12. Frontend Task Status

Frontend task details remain governed by `docs/frontend/planning/FRONTEND_TASKS.md` and the authoritative frontend milestone dossiers.

### 12.1 Frontend seed inventory

The rows below are initial tracking placeholders. During reconciliation, replace them with the exact task records from the authoritative backlog and preserve its task IDs.

| Task ID | Phase | Milestone | Task title | Initial status | Acceptance |
|---|---|---|---|---|---|
| KR-FE-P0-001 | P0 FOUNDATION | F-M01 STUDIO FOUNDATION | Reconcile foundation UI tasks | NOT STARTED | NOT ASSESSED |
| KR-FE-P1-001 | P1 STUDIO | F-M02 PROJECTS | Reconcile project UI tasks | NOT STARTED | NOT ASSESSED |
| KR-FE-P2-001 | P2 BUILD & ARTIFACT | F-M03 BUILD & ARTIFACT | Reconcile build and Artifact UI tasks | NOT STARTED | NOT ASSESSED |
| KR-FE-P4-001 | P4 BOOKING & COMMERCIAL | F-M04 BOOKING | Reconcile booking UI tasks | NOT STARTED | NOT ASSESSED |
| KR-FE-P5-001 | P5 EXECUTION | F-M05 EXECUTION | Reconcile execution UI tasks | NOT STARTED | NOT ASSESSED |
| KR-FE-P7-001 | P7 LIVE & RESULTS | F-M06 LIVE | Reconcile Live UI tasks | NOT STARTED | NOT ASSESSED |
| KR-FE-P7-002 | P7 LIVE & RESULTS | F-M07 RESULTS | Reconcile Results UI tasks | NOT STARTED | NOT ASSESSED |

**Important:** These seed IDs must be checked against the actual frontend backlog before use. If any ID already exists, preserve the authoritative task and assign a non-colliding ID to the placeholder or remove the placeholder after reconciliation.

### 12.2 Frontend acceptance evidence

For each frontend task, track relevant evidence:

- approved screen or component scope
- design review where applicable
- API contract readiness
- implementation review
- automated tests
- authorization and error-state behavior
- accessibility checks where applicable
- integration test results
- acceptance decision

### 12.3 Frontend status rules

- A screen implemented against a mock does not establish backend integration.
- A rendered component does not establish correct authorization.
- Loading, empty, error, and recovery states are part of task acceptance where applicable.
- A task spanning F-M01 STUDIO FOUNDATION and F-M02 PROJECTS must retain a documented primary milestone and any secondary relationship.
- Do not assign frontend work to a milestone solely because the screen is visually related to its name; follow the authoritative dossier.

## 13. Backend Task Status

Backend task details remain governed by `docs/backend/planning/BACKEND_TASKS.md` and the authoritative backend milestone dossiers.

### 13.1 Backend seed inventory

The seed rows that were here were placeholders ("Reconcile ... tasks", all NOT STARTED and NOT ASSESSED), not task records. Every seed ID is also listed in [docs/backend/planning/BACKEND_TASKS.md](../backend/planning/BACKEND_TASKS.md), which holds the authoritative task records with the authoritative milestone dossiers. Task IDs are not reused or renumbered.

Current backend task status is recorded in the increment task records under `planning/backend/increments/`, one `TASKS.md` per increment, and is compared with its milestone views by `make status-report`. See [PLANNING_AUTHORITY_MATRIX.md](../../planning/PLANNING_AUTHORITY_MATRIX.md).

### 13.2 Backend acceptance evidence

Track relevant evidence:

- API and domain contract
- implementation and code review
- validation and authorization tests
- state-transition tests
- persistence and transaction tests
- idempotency and retry tests where required
- observability and diagnostics
- integration and failure-path tests
- acceptance decision

### 13.3 Backend status rules

- A successful HTTP response does not prove domain correctness.
- A state transition must be tested against the authoritative contract.
- Booking, execution, and Results responsibilities must remain distinct.
- A persistence-dependent task must identify its database dependency.
- A task must not be accepted without its required failure-path and authorization evidence.
- Tasks associated with B-M07 PRODUCTION must follow the production dossier's acceptance requirements.

## 14. Database Task Status

Database task details remain governed by `docs/database/planning/DATABASE_TASKS.md` and the authoritative database milestone dossiers.

### 14.1 Database seed inventory

The seed rows that were here were placeholders ("Reconcile ... tasks", all NOT STARTED and NOT ASSESSED), not task records. Every seed ID is also listed in [docs/database/planning/DATABASE_TASKS.md](../database/planning/DATABASE_TASKS.md), which holds the authoritative task records with the authoritative milestone dossiers. Task IDs are not reused or renumbered.

### 14.2 Database acceptance evidence

Track relevant evidence:

- schema definitions and constraints
- migration scripts and execution results
- transaction and concurrency tests
- tenant and organization isolation
- query and index validation
- compatibility tests
- integrity and recovery tests
- backup and restore evidence where required
- acceptance decision

### 14.3 Database status rules

- A schema file does not prove that its migration works.
- Concurrency-sensitive operations require transaction and conflict evidence.
- Tenant isolation must be verified.
- Execution data must preserve required relationships among Jobs, Runs, events, and Results.
- Database production qualification must follow the existing frozen milestone model and applicable production dossiers.
- Do not invent a database milestone to represent production work.

## 15. Cloud Task Status

Cloud task details should be maintained in `docs/cloud/planning/CLOUD_TASKS.md` and governed by the authoritative cloud milestone dossiers.

If the cloud backlog is missing, treat its inventory as a planning dependency. Do not claim that a complete cloud task inventory has been seeded until the backlog is reconciled.

### 15.1 Cloud seed inventory

The rows below are initial tracking placeholders, not a substitute for an approved cloud task backlog.

| Task ID | Phase | Milestone | Task title | Initial status | Acceptance |
|---|---|---|---|---|---|
| KR-CL-P0-001 | P0 FOUNDATION | C-M01 FOUNDATION | Reconcile cloud foundation tasks | NOT STARTED | NOT ASSESSED |
| KR-CL-P1-001 | P1 STUDIO | C-M02 DEVELOPMENT | Reconcile development environment tasks | NOT STARTED | NOT ASSESSED |
| KR-CL-P4-001 | P4 BOOKING & COMMERCIAL | C-M03 STAGING | Reconcile staging tasks | NOT STARTED | NOT ASSESSED |
| KR-CL-P8-001 | P8 PRODUCTION | C-M04 PRODUCTION | Reconcile production environment tasks | NOT STARTED | NOT ASSESSED |

**Important:** Check these seed IDs against the actual cloud backlog before use. Preserve authoritative IDs and titles where they already exist.

### 15.2 Cloud acceptance evidence

Track relevant evidence:

- infrastructure definitions
- deployment and configuration procedures
- secrets and access handling
- network and service connectivity
- logging, metrics, and alerting
- deployment repeatability
- rollback procedures
- recovery tests where required
- security review
- acceptance decision

### 15.3 Cloud status rules

- A development deployment does not establish staging readiness.
- A staging deployment does not establish production readiness.
- Configuration and secret handling must follow approved security requirements.
- Deployment procedures must be repeatable and documented.
- Production tasks require explicit production acceptance evidence.

## 16. Task Dependencies

Every dependency must identify the deliverable that blocks or enables the task.

Examples include:

- API contract approval
- database schema or migration readiness
- environment availability
- security review
- test fixture availability
- upstream implementation
- a design decision
- milestone acceptance
- an external integration

### 16.1 Dependency fields

| Field | Description |
|---|---|
| Dependency ID | Unique identifier |
| Dependent task | Task waiting on the dependency |
| Provider task or milestone | Authoritative provider ID |
| Required deliverable | Specific contract, implementation, or decision |
| Owner | Accountable provider or resolver |
| Status | NOT STARTED, IN PROGRESS, BLOCKED, AVAILABLE, ACCEPTED |
| Required-by date | Approved date or `TBD` |
| Evidence | Link to contract, review, test, or artifact |
| Next action | Concrete resolution step |

### 16.2 Dependency rules

- Do not write vague dependencies such as “backend work” or “database ready.”
- Identify the API, schema, environment, or decision that is required.
- A provider task being complete does not automatically satisfy the consumer.
- Record the evidence needed to prove readiness.
- If a dependency changes, review all affected downstream tasks.
- Escalate dependencies that threaten milestone acceptance or target dates.

## 17. Task Workflow

Use the following workflow for every task.

### Step 1: Intake

- Confirm the task exists in the authoritative domain backlog.
- Verify the task ID and title.
- Confirm the phase and milestone mapping.
- Identify the source requirement or milestone acceptance criterion.

### Step 2: Readiness

- Confirm the scope is actionable.
- Identify the accountable owner.
- Record dependencies.
- Confirm acceptance criteria.
- Record priority and estimate where available.
- Resolve ambiguities before implementation begins.

### Step 3: Implementation

- Move the task to `IN PROGRESS`.
- Record the actual start date.
- Maintain a concrete next action.
- Update blockers when they arise.
- Link implementation artifacts and relevant commits.

### Step 4: Review

- Submit the deliverable for review.
- Move the task to `IN REVIEW`.
- Record test evidence.
- Address review feedback.
- Use `CHANGES REQUESTED` if required changes remain.

### Step 5: Acceptance

- Verify the task-specific acceptance criteria.
- Confirm required tests and reviews have passed.
- Record exceptions and their approvals.
- Set the acceptance state to `ACCEPTED` only when supported by evidence.

### Step 6: Closure

- Set the task to `COMPLETE` after required closure actions.
- Record the completion date.
- Link the acceptance evidence.
- Update dependent tasks and relevant milestone status.
- Include the change in the next status reconciliation.

## 18. Blocker Management

A blocker is a current condition that prevents task progress or acceptance.

Record:

- blocker ID
- affected task ID
- affected milestone ID
- date raised
- exact blocking condition
- owner
- required resolution
- target resolution date
- escalation owner
- current status
- resolution evidence

### 18.1 Blocker rules

- A blocked task must identify the action needed to unblock it.
- The blocker must have an accountable resolver.
- Update the task's next action while blocked.
- If the blocker affects a milestone target, update the milestone tracker.
- Escalate overdue blockers.
- Close a blocker only after its resolution is verified.
- If a blocker is accepted as a risk, retain the risk record and approval reference.

## 19. Review and Acceptance Rules

Task review must evaluate the actual deliverable against its acceptance criteria.

Depending on the task, required evidence may include:

- code review
- unit tests
- integration tests
- contract tests
- schema or migration tests
- security review
- accessibility review
- deployment evidence
- documentation review
- manual acceptance
- performance or recovery tests

### 19.1 Acceptance safeguards

- A merged pull request is not sufficient evidence by itself.
- A passing unit test suite does not prove cross-domain integration.
- Documentation tasks require review of the resulting content.
- Database tasks require relevant migration and integrity evidence.
- Cloud tasks require deployment or configuration evidence as applicable.
- Security-sensitive tasks require the appropriate security review.
- A task must not be accepted if mandatory criteria remain unmet.
- Approved exceptions must be recorded with an owner and review condition.

## 20. Task-to-Milestone Traceability

Every active task must be associated with one primary milestone where applicable.

If a task supports multiple milestones:

- record one primary milestone
- record additional milestone relationships separately
- avoid duplicating the task as multiple independent deliverables
- identify the acceptance criterion served by each relationship
- ensure that closing the task does not automatically close every associated milestone

### 20.1 Traceability fields

| Field | Description |
|---|---|
| Task ID | Stable task identifier |
| Source requirement | Requirement, decision, or specification |
| Phase | Canonical phase |
| Primary milestone | Frozen milestone ID and name |
| Secondary milestones | Additional relevant milestones |
| Acceptance criterion | Criterion supported by the task |
| Evidence | Implementation and test evidence |
| Status | Current task status |

### 20.2 Traceability rules

- Do not assign a task to a milestone based solely on a similar title.
- Follow the authoritative dossier.
- If the task's milestone mapping is uncertain, use `TBD` and create a reconciliation action.
- Do not change a phase mapping merely to simplify reporting.
- Resolve inconsistent mappings through the relevant domain owner and project governance.

## 21. Initial Task Status Summary

Until the domain backlogs are reconciled, report the following state.

| Domain | Seed inventory | Source reconciliation | Acceptance baseline |
|---|---|---|---|
| Frontend | Placeholder rows for applicable milestones | Pending | NOT ASSESSED |
| Backend | Placeholder rows for applicable milestones | Pending | NOT ASSESSED |
| Database | Placeholder rows for applicable milestones | Pending | NOT ASSESSED |
| Cloud | Placeholder rows for applicable milestones | Pending | NOT ASSESSED |

The seed tables are deliberately conservative. They do not assert that the listed placeholder tasks represent the complete domain backlog.

### 21.1 Reconciliation exit criteria

- [ ] Frontend source backlog has been reviewed.
- [ ] Backend source backlog has been reviewed.
- [ ] Database source backlog has been reviewed.
- [ ] Cloud source backlog exists or its absence is recorded as a blocker.
- [ ] Existing task IDs have been preserved.
- [ ] Placeholder IDs have been checked for collisions.
- [ ] Every active task has a canonical phase.
- [ ] Every applicable task has a milestone mapping.
- [ ] Dependencies and owners are reconciled.
- [ ] Estimates and dates are imported only when supported by source data.
- [ ] Acceptance criteria and evidence references are traceable.
- [ ] Duplicate and conflicting records are resolved.
- [ ] Reconciliation date and source revision are recorded.

## 22. Reporting Cadence

| Review | Suggested cadence | Focus |
|---|---|---|
| Task status review | Weekly | Active work, review state, blockers, and next actions |
| Cross-domain dependency review | Weekly during active integration | API, schema, and environment readiness |
| Milestone readiness review | Before milestone acceptance | Task completion and acceptance evidence |
| Risk review | Weekly and on material changes | Risk mitigation and escalation |
| Phase review | At phase transition | Milestone acceptance and unresolved dependencies |

The cadence may be adjusted by project governance. Task status must remain current whenever a material change occurs.

## 23. Task Status Update Procedure

For each status update:

1. Verify the task ID against the source backlog.
2. Confirm the canonical phase and milestone.
3. Check the current implementation or document.
4. Review test and acceptance evidence.
5. Update status, acceptance state, owner, and dates.
6. Record blockers and dependency changes.
7. Update the next action.
8. Reconcile affected milestone and phase status.
9. Record the update date and reviewer.
10. Preserve a change history for material status changes.

Do not change multiple tasks to `COMPLETE` based on a broad verbal update without checking their individual evidence.

## 24. Task Review Record Template

| Field | Value |
|---|---|
| Task ID | Exact canonical task identifier |
| Title | Authoritative task title |
| Domain | FE, BE, DB, or CL |
| Phase | Frozen phase ID and name |
| Milestone | Frozen milestone ID and name |
| Review date | `YYYY-MM-DD` |
| Previous status | Recorded prior state |
| Current status | Approved status vocabulary |
| Acceptance state | Approved acceptance vocabulary |
| Owner | Accountable owner |
| Evidence | Commit, report, document, or review reference |
| Criteria passed | Verified criteria |
| Criteria remaining | Outstanding criteria and owners |
| Dependencies | Current dependency state |
| Blockers | Blocker IDs |
| Decision | Accept, reject, continue, defer, or cancel |
| Next action | Concrete follow-up |
| Next review | Agreed date |

## 25. Change Control

Changes to task status, owners, dates, dependencies, effort, and evidence may be made through routine tracking.

Changes to phase definitions must be made only in `planning/PHASES.md`.

Changes to milestone scope must be made in the relevant authoritative dossier under `docs/**/milestones/`.

Changes to detailed task definitions must be made in the applicable domain backlog and then reconciled into this tracker.

For each material change, record:

- date
- author
- task ID
- previous and new values
- rationale
- evidence
- dependency impact
- approval where required

Never reuse a task ID. If a task is cancelled or superseded, preserve its record and link the replacement where appropriate.

## 26. Tracker Maintenance Checklist

- [ ] Task IDs follow `KR-<DOMAIN>-<PHASE>-<NNN>`.
- [ ] Domain codes use FE, BE, DB, and CL.
- [ ] Phase IDs match `planning/PHASES.md`.
- [ ] Milestone identifiers and names match the frozen model.
- [ ] Existing milestone dossiers remain authoritative.
- [ ] Source backlog tasks are reconciled before placeholders are treated as implementation tasks.
- [ ] Duplicate IDs have been resolved.
- [ ] Owners and dates are accurate or marked `TBD`.
- [ ] Dependencies identify specific deliverables.
- [ ] Acceptance state is separate from implementation status.
- [ ] Evidence supports every accepted or completed task.
- [ ] Blockers have owners and resolution actions.
- [ ] Deferred and cancelled tasks retain approval records.
- [ ] Milestone and phase trackers are reconciled.
- [ ] No retired phase or milestone names are used in active records.

## 27. Baseline Acceptance

The task tracker is ready for routine use when:

- the canonical phase and milestone inventories are present
- task identifier rules are understood
- task status and acceptance state are distinguished
- source backlogs are identified
- placeholder rows are clearly marked as provisional
- existing task IDs and titles are preserved during reconciliation
- owners, dependencies, and acceptance criteria can be tracked
- evidence and closure rules are defined
- milestone and phase status reconciliation is established
- the initial reconciliation review is scheduled

Baseline acceptance confirms that the tracking process is established. It does not mean that any task, milestone, phase, or product capability has been accepted.

## 28. Changelog

### Initial Frozen-Model Baseline

- Initialized task tracking across frontend, backend, database, and cloud domains.
- Established `planning/PHASES.md` as the canonical phase definition.
- Added the frozen milestone inventory for all four domains.
- Defined the `KR-<DOMAIN>-<PHASE>-<NNN>` task identifier convention.
- Defined task status, acceptance state, priority, and effort rules.
- Added provisional seed rows for each domain and applicable milestone area.
- Required source-backlog reconciliation before placeholder tasks are treated as authoritative.
- Added dependency, blocker, review, acceptance, and traceability workflows.
- Established evidence-based task closure and dashboard reconciliation.
- Added reporting, change-control, and maintenance procedures.

### Future Updates

Future updates must preserve the frozen phase and milestone identifiers, exact names, and phase mappings unless the canonical model is formally changed through project governance.
