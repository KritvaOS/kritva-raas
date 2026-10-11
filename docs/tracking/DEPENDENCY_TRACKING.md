# Kritva RaaS — Dependency Tracking

## 1. Purpose

This document defines the project-wide process for identifying, recording, monitoring, resolving, and escalating dependencies across Kritva RaaS.

It provides a consistent view of dependencies that affect engineering work, phase readiness, milestone acceptance, integration, and delivery commitments.

The tracker covers:

- internal dependencies between tasks, teams, components, and domains
- cross-domain dependencies between frontend, backend, database, cloud, UI, and security
- external dependencies on vendors, services, infrastructure, tools, and third parties
- dependencies between phases and canonical milestones
- dependency readiness, ownership, blockers, risks, and escalation
- evidence required before a dependent task or milestone can proceed
- changes to dependency assumptions and delivery commitments

This file defines the tracking process and register structure. It does not replace task backlogs, milestone dossiers, architecture decision records, risk registers, or implementation plans.

## 2. Canonical References

| Concern | Authoritative reference |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| Project-wide decisions | `planning/DECISIONS.md` |
| Project status | `docs/tracking/STATUS.md` |
| Phase status | `docs/tracking/PHASE_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Decision index | `docs/tracking/DECISION_LOG.md` |
| Risk register | `docs/tracking/RISK_REGISTER.md` |
| Frontend decisions and plans | `docs/frontend/planning/` |
| Backend decisions and plans | `docs/backend/planning/` |
| Database decisions and plans | `docs/database/planning/` |
| Cloud decisions and plans | `docs/cloud/planning/` |
| UI decisions and plans | `docs/ui/` |
| Security decisions and plans | `docs/security/` |
| Milestone scope and acceptance | `docs/**/milestones/` |

The canonical phase definition is maintained only in `planning/PHASES.md`. This document references the canonical phase identifiers and names for traceability; it does not establish alternative phase definitions.

Existing milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope, deliverables, dependencies, and acceptance criteria.

## 3. Dependency Management Principles

1. Every material dependency must have a unique identifier.
2. Every open dependency must have an accountable owner.
3. Every dependency must identify the work or decision that it blocks or enables.
4. Dependencies must be recorded before they threaten a committed milestone.
5. A dependency is not complete merely because implementation has started.
6. Completion requires the evidence or acceptance condition defined in the dependency record.
7. External dependencies must identify a supplier, service, or responsible external party where known.
8. Cross-domain dependencies must identify both the providing and consuming domains.
9. Dependency status must reflect verified evidence rather than optimistic estimates.
10. Blocked work must be visible in the relevant task and milestone trackers.
11. Dependencies affecting dates, scope, cost, safety, or acceptance must be escalated.
12. Changes to a dependency must be traceable to the affected tasks, milestones, risks, and decisions.
13. Do not infer milestone scope from its name; consult the authoritative dossier.
14. Do not create duplicate dependency records for the same relationship unless separate owners or acceptance conditions require them.
15. Do not mark a dependency resolved until the consuming owner confirms that the required outcome is available.

## 4. Dependency Categories

| Category | Description | Example |
|---|---|---|
| Task-to-task | One task requires another task's output | A client integration requires an approved API contract |
| Component-to-component | One component requires another component's interface or behavior | An execution service requires a stable artifact interface |
| Cross-domain | Work in one domain requires work in another domain | Frontend work requires backend API readiness |
| Data | Work requires a schema, migration, data contract, or persistence capability | Booking behavior requires an agreed data model |
| Infrastructure | Work requires an environment, network, compute resource, or deployment configuration | Integration tests require a provisioned test environment |
| Security | Work requires a security decision, control, credential, or review | A deployment requires an approved access policy |
| External | Work requires a third party, supplier, hosted service, or external approval | A service integration requires vendor credentials |
| Phase | Readiness of one phase depends on verified outputs from another phase | A later phase requires accepted foundational capabilities |
| Milestone | One milestone depends on an output from another milestone | A consuming milestone requires an accepted provider deliverable |
| Decision | Work requires an approved architecture, product, or governance decision | Implementation requires a resolved interface choice |
| Validation | Work requires test evidence, review, or acceptance | A release gate requires passing integration tests |
| Operational | Work requires monitoring, support, recovery, or operational readiness | A production change requires a verified rollback procedure |

Choose the most useful primary category. Add secondary classification in the dependency description only when it materially improves reporting.

## 5. Dependency ID Convention

Use a stable identifier for each dependency.

Recommended convention:

`KR-DEP-<NNN>`

Examples:

- `KR-DEP-001`
- `KR-DEP-002`
- `KR-DEP-003`

Identifiers are examples of the convention, not pre-existing dependency records.

Do not reuse an identifier after a dependency is resolved, cancelled, or superseded.

If the project already has a dependency identifier convention in an authoritative tracker, preserve it and document the mapping rather than renumbering existing records.

## 6. Dependency Register

The following register is the project-wide index of material dependencies.

Populate it only with dependencies verified against current plans, task records, milestone dossiers, decisions, or external commitments. Do not treat illustrative rows or examples as confirmed project facts.

| Dependency ID | Category | Provider | Consumer | Phase / milestone | Status | Owner | Target date | Evidence / reference |
|---|---|---|---|---|---|---|---|---|
| No verified dependencies indexed | — | — | — | — | — | — | — | Reconcile plans and milestone dossiers |

Each dependency should have a detailed record in the owning tracker when the summary row cannot capture the required acceptance condition, blocker, evidence, and escalation history.

The project-wide register must remain concise enough to review regularly.

## 7. Required Dependency Record

Each detailed dependency record must contain the following fields.

| Field | Requirement |
|---|---|
| Dependency ID | Stable unique identifier |
| Title | Short, specific description |
| Category | Primary dependency category |
| Provider | Team, task, component, service, or external party providing the prerequisite |
| Consumer | Team, task, component, or milestone requiring the prerequisite |
| Providing domain | Domain responsible for delivering the prerequisite |
| Consuming domain | Domain responsible for using or accepting the prerequisite |
| Phase | Applicable canonical phase identifier and name |
| Milestone | Applicable canonical milestone identifier and name, when known |
| Status | Current dependency workflow status |
| Owner | One accountable individual or role |
| Target date | Required date, or `TBD` if not established |
| Acceptance condition | Observable condition required for resolution |
| Evidence | Link to a test, decision, contract, deliverable, or accepted task |
| Blocker | Description of the current obstruction, if any |
| Risk reference | Related risk ID, if applicable |
| Escalation level | Current escalation state |
| Last updated | Date of the most recent verified update |
| Notes | Brief operational notes, without duplicating authoritative documents |

A dependency must not be considered ready for closure if its acceptance condition is missing or ambiguous.

## 8. Dependency Status Workflow

Use the following status vocabulary consistently.

| Status | Meaning |
|---|---|
| `IDENTIFIED` | The dependency has been recorded but not yet fully assessed. |
| `ASSESSING` | Scope, ownership, impact, or acceptance conditions are being clarified. |
| `OPEN` | The dependency is understood and awaits delivery or satisfaction. |
| `IN PROGRESS` | The provider is actively working on the prerequisite. |
| `AT RISK` | The prerequisite may miss its required date or acceptance condition. |
| `BLOCKED` | Progress cannot continue because a specific obstruction remains unresolved. |
| `READY FOR VALIDATION` | The provider reports delivery and evidence is available for consumer validation. |
| `RESOLVED` | The consumer has verified that the acceptance condition is satisfied. |
| `CANCELLED` | The dependency is no longer required, with the reason recorded. |
| `SUPERSEDED` | A different dependency or approved design replaces this record. |

### 8.1 Status transition rules

- `IDENTIFIED` may move to `ASSESSING`, `OPEN`, or `CANCELLED`.
- `ASSESSING` may move to `OPEN`, `BLOCKED`, or `CANCELLED`.
- `OPEN` may move to `IN PROGRESS`, `AT RISK`, `BLOCKED`, or `CANCELLED`.
- `IN PROGRESS` may move to `READY FOR VALIDATION`, `AT RISK`, or `BLOCKED`.
- `AT RISK` may return to `IN PROGRESS` when a credible recovery plan is approved.
- `BLOCKED` may return to `OPEN` or `IN PROGRESS` when the obstruction is removed.
- `READY FOR VALIDATION` may move to `RESOLVED` after consumer acceptance, or return to `IN PROGRESS` if evidence fails validation.
- `RESOLVED` may be reopened if new evidence shows that the acceptance condition was not met.
- `CANCELLED` and `SUPERSEDED` records remain available for historical traceability.

Do not use `RESOLVED` to mean that the provider has finished coding. Resolution requires consumer verification.

## 9. Internal Dependencies

Internal dependencies exist between work items or capabilities managed within the project.

Examples include:

- a task depending on another task
- one component requiring a stable interface from another component
- a test requiring an implemented capability
- a milestone requiring accepted deliverables from another milestone
- an implementation requiring an approved architecture decision
- a domain requiring an available test environment

For every internal dependency:

1. Identify the provider and consumer.
2. Record the expected deliverable.
3. Record the required date or sequencing constraint.
4. Define the acceptance condition.
5. Identify the owner on each side when ownership differs.
6. Link the dependency to the relevant tasks and milestone dossiers.
7. Record evidence when the dependency is resolved.

Internal dependencies should be agreed directly between the provider and consumer owners before escalation, unless the dependency creates an immediate safety, security, or release concern.

## 10. Cross-Domain Dependencies

Cross-domain dependencies must be visible in both the project-wide register and the relevant domain planning records when they affect delivery commitments.

### 10.1 Frontend dependencies

Frontend work may depend on:

- approved user-facing workflows
- stable API contracts
- authentication and authorization behavior
- backend capability availability
- database-backed behavior exposed through services
- cloud environment availability
- agreed error and loading behavior
- integration test fixtures and test evidence

Use the canonical frontend milestones:

| ID | Milestone | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

These mappings support dependency traceability only. The authoritative milestone dossier determines the actual scope and acceptance conditions.

### 10.2 Backend dependencies

Backend work may depend on:

- approved domain contracts
- database schemas and migration behavior
- artifact storage or retrieval interfaces
- external service access
- security decisions and access controls
- infrastructure and environment readiness
- frontend integration requirements
- validation and operational evidence

Use the canonical backend milestones:

| ID | Milestone | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

Use the milestone dossiers to confirm provider outputs, consumers, and acceptance conditions.

### 10.3 Database dependencies

Database work may depend on:

- approved data ownership
- domain and API contracts
- schema review
- migration strategy
- integrity constraints
- transaction semantics
- test data and migration evidence
- backup and recovery requirements where applicable

Use the canonical database milestones:

| ID | Milestone | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

Database readiness must be based on the required schema, migration, validation, and integration evidence, not simply the existence of a schema file.

### 10.4 Cloud dependencies

Cloud work may depend on:

- approved environment requirements
- network and access policies
- compute and storage capacity
- secrets and credential provisioning
- deployment configuration
- monitoring and logging
- service connectivity
- recovery and operational validation

Use the canonical cloud milestones:

| ID | Milestone | Phase mapping |
|---|---|---|
| C-M01 | FOUNDATION | P0 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

Environment availability must be validated against the consuming team's actual requirements.

### 10.5 UI, security, and shared services

UI, security, and shared-service dependencies must be linked to their authoritative decisions, plans, or task records.

Do not create new milestone identifiers for these concerns in this tracker. Use the canonical frontend, backend, database, and cloud milestones when those milestones are the actual delivery owners or consumers.

## 11. External Dependencies

External dependencies require explicit ownership because the project may not control the provider's schedule, service behavior, or approval process.

Examples include:

- third-party APIs and hosted services
- cloud account or service enablement
- vendor support and credentials
- external approvals
- supplier deliverables
- external software or hardware availability
- service quotas or account limits
- licensing or contractual obligations

Each external dependency must record:

- the external provider or organization
- the internal accountable owner
- the required external deliverable
- the date by which it is needed
- the evidence that will demonstrate availability
- any known service, contractual, security, or availability constraints
- a fallback or contingency when the dependency is material
- the escalation route and next escalation date

External dependency dates must not be treated as guaranteed unless the responsible provider has confirmed them.

Where the provider does not give a reliable date, use `TBD`, record the follow-up date, and assess the impact on the consumer's schedule.

## 12. Phase and Milestone Dependencies

Phase and milestone dependencies describe delivery sequencing and readiness relationships. They must not redefine the phases or milestones.

The canonical phase names are maintained in `planning/PHASES.md`.

| Phase ID | Canonical phase name |
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

The table is a reference to the frozen identifiers and names. It is not a separate phase definition.

### 12.1 Recording phase dependencies

When a task or milestone depends on an output from another phase:

1. Identify the exact provider task or milestone.
2. Identify the consuming task or milestone.
3. Confirm the relationship against the authoritative milestone dossiers.
4. Define the required evidence and acceptance condition.
5. Record any sequencing constraint.
6. Identify the owner responsible for verifying readiness.
7. Track unresolved issues through the dependency workflow.

Do not assume that every earlier phase output is a dependency of every later phase. Record actual dependencies rather than inferring them solely from phase order.

### 12.2 Recording milestone dependencies

Milestone dependencies must reference canonical milestone IDs and names.

A milestone dependency is resolved only when the provider has supplied the required output and the consumer has verified the acceptance condition.

If a milestone dossier changes, review all dependency records that reference that milestone and update them through the approved change process.

## 13. Dependency Readiness and Evidence

Evidence must demonstrate that the prerequisite is available and fit for its intended consumer.

Acceptable evidence may include:

- an accepted task or milestone
- an approved decision or interface contract
- a passing automated test
- an integration test report
- a validated schema or migration
- a successful deployment or environment check
- a security review outcome
- a supplier confirmation
- an approved external access request
- a signed acceptance record

Evidence must be linked to its authoritative location.

A status update such as "done," "implemented," or "merged" is not sufficient by itself when the dependency requires integration, testing, review, or acceptance.

For each dependency, distinguish:

- provider completion
- evidence availability
- consumer validation
- final resolution

These are separate events when the acceptance condition requires independent verification.

## 14. Blocking and Impact Assessment

When a dependency becomes blocked, identify the impact immediately.

The impact assessment must cover:

- affected tasks
- affected milestones
- affected phases, where applicable
- downstream consumers
- expected schedule impact
- scope or cost implications
- security, safety, or operational implications
- available workarounds
- decision or approval needed
- owner and next action

Update `docs/tracking/TASK_STATUS.md` for blocked tasks and `docs/tracking/MILESTONE_STATUS.md` when milestone readiness or delivery is affected.

Update `docs/tracking/RISK_REGISTER.md` when the dependency introduces or materially changes a project risk.

Do not duplicate full risk analysis in this document. Maintain the dependency record and link to the authoritative risk record.

## 15. Escalation Levels

| Level | Description | Typical trigger | Expected action |
|---|---|---|---|
| L0 | Owner-managed | Dependency is progressing within the agreed plan | Provider and consumer coordinate directly |
| L1 | Domain escalation | Delivery is uncertain or a commitment may be missed | Domain owner agrees a recovery plan |
| L2 | Cross-domain escalation | Multiple domains or milestones are affected | Project leadership assigns priorities and resolves conflicts |
| L3 | Executive or governance escalation | Material delivery, financial, contractual, security, or safety impact | Accountable leadership makes or obtains the required decision |

Escalation level reflects the coordination and decision authority required. It does not replace dependency status.

A dependency may be `OPEN` at L0 or `BLOCKED` at L2, depending on the situation.

## 16. Escalation Triggers

Escalate a dependency when any of the following applies:

- the required date is likely to be missed
- the provider has not acknowledged the dependency
- the acceptance condition cannot be agreed
- a cross-domain interface is disputed
- the dependency blocks a milestone commitment
- a required decision remains unresolved beyond its agreed date
- an external provider has not delivered a critical prerequisite
- a workaround introduces significant technical debt
- the dependency threatens security or contractual obligations
- the dependency creates a potential safety concern
- the consumer rejects the delivered evidence
- the provider and consumer cannot agree on readiness
- the dependency changes scope, cost, or delivery commitments materially

For safety-critical concerns, follow the project's applicable safety review and release-gate process. Do not waive a required human safety review through dependency-status changes or schedule pressure.

## 17. Escalation Procedure

### Step 1: Confirm the facts

Verify the dependency status, owner, required date, acceptance condition, and current evidence.

### Step 2: Notify the provider and consumer

Ensure both sides understand the impact and immediate next action.

### Step 3: Establish the impact

Identify affected tasks, milestones, phases, risks, and external commitments.

### Step 4: Agree recovery options

Document viable options in the owning task, risk, or decision record. Consider resequencing, an alternative provider, scope adjustment, or a controlled workaround where appropriate.

### Step 5: Escalate to the required level

Escalate when the responsible owners cannot resolve the dependency within their authority or when the impact warrants immediate intervention.

### Step 6: Record the outcome

Record the decision, owner, due date, and evidence required to recover the dependency.

### Step 7: Verify resolution

Return the dependency to normal tracking and mark it `RESOLVED` only after consumer acceptance.

## 18. Dependency Review Cadence

Review dependencies as part of regular project execution and milestone planning.

| Review | Minimum focus | Participants |
|---|---|---|
| Task review | Immediate prerequisites, owners, blockers, evidence | Task owners |
| Domain review | Cross-task and domain-level dependencies | Domain owners |
| Milestone review | Readiness, acceptance, downstream consumers | Milestone owners and reviewers |
| Cross-domain review | Interfaces, sequencing, shared resources, conflicts | Relevant domain owners |
| Project review | Material delivery, external, cost, security, and safety dependencies | Project leadership and accountable owners |

Increase review frequency when a dependency is blocked, at risk, close to its required date, or on the critical path.

Review cadence should be based on project needs and current commitments. This document does not impose unverified calendar dates.

## 19. Dependency Change Control

A dependency may change because of scope updates, interface changes, revised plans, external constraints, or new evidence.

When a dependency changes:

1. Preserve the existing dependency ID if the relationship remains materially the same.
2. Update the record with the new facts and date.
3. Explain the reason for the change.
4. Reassess affected consumers and delivery commitments.
5. Update task and milestone references.
6. Update related risk records where required.
7. Link to any relevant ADR or approved change.
8. Escalate material impacts.
9. Retain historical traceability.

Create a new dependency record only when the relationship, provider, consumer, or acceptance condition is materially different enough to warrant separate tracking.

When a dependency is no longer needed, use `CANCELLED` and record the reason. When another dependency replaces it, use `SUPERSEDED` and link the replacement.

## 20. Relationship to Other Trackers

| Tracker | Relationship |
|---|---|
| `STATUS.md` | Summarizes project-wide progress and material dependency concerns |
| `PHASE_STATUS.md` | Tracks phase readiness and phase-level blockers |
| `MILESTONE_STATUS.md` | Tracks milestone readiness, acceptance, and delivery impact |
| `TASK_STATUS.md` | Tracks task execution and task-level blocking |
| `DECISION_LOG.md` | Indexes authoritative decisions affecting dependencies |
| `RISKS.md` | Records uncertainty, exposure, impact, and mitigation |
| Domain backlogs | Track implementation work required to satisfy dependencies |
| Milestone dossiers | Define authoritative milestone scope and acceptance conditions |
| Owning `DECISIONS.md` files | Record decision content and approved outcomes |

This dependency tracker is not a replacement for any of these records.

Keep the detailed explanation in the authoritative source and use dependency records to connect the provider, consumer, acceptance condition, and evidence.

## 21. Initial Reconciliation Register

The initial dependency inventory must be populated by reviewing existing project documentation and implementation evidence.

| Source | Reconciliation activity | Status | Owner |
|---|---|---|---|
| `planning/PHASES.md` | Verify canonical phase references | PENDING | TBD |
| `docs/tracking/TASK_STATUS.md` | Identify task prerequisites and blockers | PENDING | TBD |
| `docs/tracking/MILESTONE_STATUS.md` | Identify milestone dependencies and acceptance gates | PENDING | TBD |
| `docs/tracking/PHASE_STATUS.md` | Identify phase readiness constraints | PENDING | TBD |
| `docs/tracking/RISK_REGISTER.md` | Link dependency-related risks | PENDING | TBD |
| `planning/DECISIONS.md` | Identify decisions that block implementation | PENDING | TBD |
| `docs/frontend/` | Review frontend dependencies | PENDING | TBD |
| `docs/backend/` | Review backend dependencies | PENDING | TBD |
| `docs/database/` | Review database dependencies | PENDING | TBD |
| `docs/cloud/` | Review cloud dependencies | PENDING | TBD |
| `docs/ui/` | Review UI dependencies | PENDING | TBD |
| `docs/security/` | Review security dependencies | PENDING | TBD |
| `docs/**/milestones/` | Validate dependencies against authoritative dossiers | PENDING | TBD |

`PENDING` means that reconciliation has not been verified. It does not mean that dependencies have been discovered, accepted, or resolved.

Do not infer that no dependencies exist merely because the register has no verified entries.

## 22. Dependency Acceptance Checklist

Before marking a dependency `RESOLVED`, verify that:

- [ ] The provider has supplied the required deliverable.
- [ ] The deliverable matches the agreed acceptance condition.
- [ ] Required evidence is available and linked.
- [ ] The consumer has validated the deliverable.
- [ ] Relevant tests or reviews have passed.
- [ ] Required approvals have been obtained.
- [ ] Affected tasks can proceed.
- [ ] Affected milestone readiness has been reviewed.
- [ ] Related blockers have been updated.
- [ ] Related risk records have been updated where necessary.
- [ ] The dependency owner has recorded the resolution.
- [ ] The status reflects verified completion.

If any required item remains incomplete, keep the dependency open or in validation, or record the appropriate blocked or at-risk status.

## 23. Operating Rules

- Maintain one accountable owner for each dependency.
- Make the provider and consumer explicit.
- Keep acceptance conditions observable and testable.
- Record evidence rather than relying on verbal confirmation.
- Use frozen phase and milestone identifiers.
- Refer to `planning/PHASES.md` for canonical phase definitions.
- Refer to milestone dossiers for scope and acceptance.
- Keep external commitments distinct from internal estimates.
- Escalate based on impact, not only elapsed time.
- Record decisions and recovery plans in their authoritative locations.
- Keep resolved and superseded dependencies for traceability.
- Do not invent dates, owners, commitments, or evidence.
- Do not create new phase or milestone names in this tracker.
- Do not mark a dependency resolved without consumer verification.

## 24. Baseline Acceptance

The dependency tracking process is ready for routine use when:

- the dependency register format is established
- dependency categories and statuses are documented
- internal and external dependencies have defined handling
- provider and consumer ownership is explicit
- acceptance conditions and evidence are required
- escalation levels and triggers are defined
- links to task, milestone, phase, risk, and decision trackers are established
- canonical phase and milestone references are used consistently
- initial reconciliation has been completed or its gaps are explicitly assigned
- dependency status reflects verified evidence
- historical traceability is retained

Baseline acceptance confirms that the tracking process is defined. It does not imply that the dependency inventory has been fully reconciled or that any dependency has been resolved.

## 25. Changelog

### Initial Frozen-Model Baseline

- Established a project-wide dependency tracking process.
- Defined internal, cross-domain, phase, milestone, and external dependency categories.
- Established a dependency record format and status workflow.
- Defined readiness evidence and consumer verification requirements.
- Defined escalation levels, triggers, and recovery workflow.
- Added cross-domain references using the frozen frontend, backend, database, and cloud milestone identifiers.
- Established `planning/PHASES.md` as the canonical phase definition.
- Preserved milestone dossiers under `docs/**/milestones/` as authoritative for scope and acceptance.
- Added reconciliation, review, change-control, and acceptance checklists.
- Avoided inventing dependency records, owners, dates, or commitments.

### Future Updates

Future updates must preserve the frozen phase and milestone model, keep dependency records evidence-based, and maintain links to authoritative task, milestone, risk, decision, and external-provider records.
