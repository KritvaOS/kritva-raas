# Kritva RaaS — Milestone Status Tracker

## 1. Purpose

This document is the consolidated status tracker for every frozen frontend, backend, database, and cloud milestone in the Kritva RaaS product plan.

It records each milestone's:

- canonical identifier and exact name
- phase mapping
- accountable owner
- planned and actual dates
- current status and verified progress
- dependencies and dependency readiness
- acceptance state
- exit-criteria completion
- risks, blockers, and unresolved issues
- evidence references and review decisions

The tracker is used for engineering coordination, milestone reviews, cross-domain integration, delivery forecasting, and acceptance governance.

It is a tracking document, not a substitute for detailed scope or acceptance criteria. The existing milestone dossiers under `docs/**/milestones/` remain authoritative for milestone scope.

The initial baseline sets every milestone to `NOT STARTED`, unless verified P0 FOUNDATION documentation work is explicitly recorded as in progress. No milestone is accepted or complete solely because this tracker or a planning document exists.

## 2. Canonical References

| Concern | Reference |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| Master project status | `docs/tracking/STATUS.md` |
| Phase status tracker | `docs/tracking/PHASE_STATUS.md` |
| Milestone status tracker | `docs/tracking/MILESTONE_STATUS.md` |
| Frontend milestone scope | `docs/frontend/milestones/` |
| Backend milestone scope | `docs/backend/milestones/` |
| Database milestone scope | `docs/database/milestones/` |
| Cloud milestone scope | `docs/cloud/milestones/` |
| UI delivery mapping | `docs/ui/UI_MILESTONES.md` |
| Frontend roadmap | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Frontend task backlog | `docs/frontend/planning/FRONTEND_TASKS.md` |
| Backend roadmap | `docs/backend/planning/BACKEND_ROADMAP.md` |
| Backend task backlog | `docs/backend/planning/BACKEND_TASKS.md` |
| Database roadmap | `docs/database/planning/DATABASE_ROADMAP.md` |
| Database task backlog | `docs/database/planning/DATABASE_TASKS.md` |
| Cloud roadmap | `docs/cloud/planning/CLOUD_ROADMAP.md` |
| Risk register | `docs/tracking/RISK_REGISTER.md` |
| Project decisions | `planning/DECISIONS.md` |

If a referenced file does not exist, record that as a documentation gap. Do not infer that a document, milestone, or acceptance record exists merely because its expected path appears in this table.

## 3. Authority and Tracking Rules

1. `planning/PHASES.md` is the sole canonical definition of phase names and boundaries.
2. The milestone dossiers under `docs/**/milestones/` define the scope and acceptance requirements for their respective milestones.
3. This file consolidates milestone status and does not redefine milestone scope.
4. Task backlogs track implementation tasks and their individual status.
5. The master dashboard in `docs/tracking/STATUS.md` summarizes the overall project.
6. The phase tracker in `docs/tracking/PHASE_STATUS.md` summarizes progress across P0 through P8.
7. This tracker records milestone-level progress, dependencies, and acceptance state.
8. Status changes must be supported by evidence.
9. Phase and milestone identifiers must not be renumbered locally.
10. A milestone spanning multiple phases retains its complete canonical phase mapping.

## 4. Status Vocabulary

| Status | Definition |
|---|---|
| `NOT STARTED` | No verified milestone work has started. |
| `IN PROGRESS` | Work is underway with an accountable owner and next action. |
| `BLOCKED` | A dependency, decision, resource, or approval prevents progress. |
| `IN REVIEW` | Deliverables are available for formal review. |
| `ACCEPTED` | Milestone acceptance criteria are satisfied and evidence is recorded. |
| `COMPLETE` | Acceptance and required milestone closure actions are complete. |
| `DEFERRED` | An approved decision postpones the milestone or part of its scope. |
| `NOT APPLICABLE` | A specific criterion does not apply, with approved rationale. |

### 4.1 Acceptance state

Track acceptance independently from implementation status.

| Acceptance state | Meaning |
|---|---|
| `NOT ASSESSED` | Acceptance has not been evaluated. |
| `PENDING` | Acceptance is awaiting evidence or review. |
| `BLOCKED` | A required acceptance condition is unmet. |
| `ACCEPTED` | All required acceptance conditions have passed. |
| `ACCEPTED WITH EXCEPTIONS` | Approved exceptions remain documented and controlled. |
| `REJECTED` | The submitted evidence or deliverable failed review. |

A milestone may be `IN REVIEW` while its acceptance state is `PENDING`. A milestone must not be `COMPLETE` while acceptance remains pending or blocked.

## 5. Initial Baseline

**Baseline status:** Initialized for tracking.

**Canonical model:** Frozen phases and milestone identifiers listed in this document.

**Initial milestone status:** `NOT STARTED` for all F-, B-, DB-, and C- milestones unless verified P0 FOUNDATION documentation work is explicitly recorded as in progress.

**Initial acceptance state:** `NOT ASSESSED` for every milestone.

**Initial progress:** `0%` only where no work has been verified. Otherwise use `Not baselined` until progress has been assessed against the authoritative acceptance criteria.

**Initial ownership and dates:** `TBD` until formally assigned.

### 5.1 Baseline safeguards

- Do not mark an entire milestone `IN PROGRESS` merely because one planning task has started.
- Record the actual active task and owner when work begins.
- Reconcile previously implemented code against the current milestone dossier before updating status.
- Reuse historical evidence only when it directly satisfies the current acceptance criteria.
- Do not count planned work as completed work.
- Do not infer acceptance from a successful build alone.
- Do not infer production readiness from development or staging success.
- Keep unknown information explicitly marked `TBD`, `Not baselined`, or `NOT ASSESSED`.

## 6. Consolidated Milestone Dashboard

The following table is the master inventory. Detailed per-milestone records follow in the domain sections.

| ID | Exact canonical name | Phase mapping | Initial status | Initial progress | Acceptance |
|---|---|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| F-M02 | PROJECTS | P1 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| F-M03 | BUILD & ARTIFACT | P2 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| F-M04 | BOOKING | P4 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| F-M05 | EXECUTION | P5 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| F-M06 | LIVE | P7 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| F-M07 | RESULTS | P7 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M01 | CONTROL PLANE | P3 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M02 | ARTIFACT | P2-P3 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M03 | PLATFORM | P3 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M04 | BOOKING | P4 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M05 | EXECUTION | P5 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M06 | RESULTS | P6-P7 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| B-M07 | PRODUCTION | P8 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| DB-M01 | FOUNDATION | P0-P3 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| DB-M02 | CORE DATA | P3 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| DB-M03 | BOOKING DATA | P4 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| DB-M04 | EXECUTION DATA | P5-P7 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| C-M01 | FOUNDATION | P0 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| C-M02 | DEVELOPMENT | P1-P3 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| C-M03 | STAGING | P4-P7 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |
| C-M04 | PRODUCTION | P8 | NOT STARTED | 0% baseline or not baselined | NOT ASSESSED |

The progress column is a baseline instruction, not a claim that historical implementation has been audited. Reconcile actual progress before using percentages for forecasting or executive reporting.

## 7. Required Milestone Record

Maintain the following fields for every milestone.

| Field | Required content |
|---|---|
| Milestone ID | Exact frozen identifier |
| Canonical name | Exact frozen name |
| Phase mapping | Exact frozen phase identifier or range |
| Scope reference | Authoritative milestone dossier |
| Status | Approved status vocabulary |
| Progress | Evidence-based percentage or `Not baselined` |
| Acceptance state | Approved acceptance vocabulary |
| Accountable owner | Named person or role |
| Supporting owners | Contributors and dependent domain owners |
| Planned start | Approved date or `TBD` |
| Planned target | Approved date or `TBD` |
| Actual start | Observed date or `TBD` |
| Acceptance date | Recorded date or `TBD` |
| Dependencies | Milestone IDs and specific deliverables |
| Dependency readiness | Status and evidence for each dependency |
| Exit criteria | Applicable criteria and their current state |
| Risks | Relevant risk IDs |
| Blockers | Relevant blocker IDs |
| Evidence | Test, review, deployment, or decision references |
| Last reviewed | Date of last formal status reconciliation |
| Next action | Concrete next step |
| Next review | Agreed review date |

Do not remove fields simply because their current values are unknown. Use `TBD` or `Not baselined` and assign an action to establish the missing information.

## 8. Frontend Milestone Status

Frontend milestone scope is governed by the dossiers under `docs/frontend/milestones/`.

### 8.1 Frontend inventory

| ID | Canonical name | Phase mapping | Initial status | Acceptance |
|---|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | NOT STARTED | NOT ASSESSED |
| F-M02 | PROJECTS | P1 | NOT STARTED | NOT ASSESSED |
| F-M03 | BUILD & ARTIFACT | P2 | NOT STARTED | NOT ASSESSED |
| F-M04 | BOOKING | P4 | NOT STARTED | NOT ASSESSED |
| F-M05 | EXECUTION | P5 | NOT STARTED | NOT ASSESSED |
| F-M06 | LIVE | P7 | NOT STARTED | NOT ASSESSED |
| F-M07 | RESULTS | P7 | NOT STARTED | NOT ASSESSED |

### 8.2 Frontend dependency overview

| Milestone | Principal dependencies |
|---|---|
| F-M01 STUDIO FOUNDATION | B-M01 CONTROL PLANE; C-M01 FOUNDATION; C-M02 DEVELOPMENT |
| F-M02 PROJECTS | B-M01 CONTROL PLANE; DB-M02 CORE DATA; C-M02 DEVELOPMENT |
| F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT; B-M01 CONTROL PLANE; DB-M02 CORE DATA; C-M02 DEVELOPMENT |
| F-M04 BOOKING | B-M03 PLATFORM; B-M04 BOOKING; DB-M03 BOOKING DATA; C-M03 STAGING |
| F-M05 EXECUTION | B-M05 EXECUTION; B-M02 ARTIFACT; B-M04 BOOKING; DB-M04 EXECUTION DATA; C-M03 STAGING |
| F-M06 LIVE | B-M06 RESULTS and applicable execution contracts; DB-M04 EXECUTION DATA; C-M03 STAGING |
| F-M07 RESULTS | B-M06 RESULTS; B-M05 EXECUTION; DB-M04 EXECUTION DATA; C-M03 STAGING |

Dependencies must be checked against the authoritative milestone dossier and actual API contracts. This table is a coordination view, not a substitute for contract review.

### 8.3 F-M01 STUDIO FOUNDATION

**Phase mapping:** P0-P1.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track delivery of the application shell, shared design components, identity-aware entry, navigation, and foundational user-facing states within the authoritative scope.

**Required evidence:**
- approved screen inventory and design review
- navigation and route behavior
- identity and authorization integration
- loading, empty, denied-access, and unavailable-service states
- responsive and accessibility checks
- automated tests and review records

**Dependencies:**
- B-M01 CONTROL PLANE
- C-M01 FOUNDATION
- C-M02 DEVELOPMENT

**Exit checklist:**
- [ ] Authoritative dossier scope reviewed.
- [ ] Required screens and shared components accepted.
- [ ] Identity and access behavior verified.
- [ ] Navigation and error handling tested.
- [ ] Accessibility review completed.
- [ ] Required API contracts confirmed.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Incomplete identity contracts, inconsistent navigation, inaccessible shared components, or unverified service-error behavior.

### 8.4 F-M02 PROJECTS

**Phase mapping:** P1.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track project discovery, creation, details, editing, access handling, and project context as specified by the authoritative dossier.

**Required evidence:**
- project list and detail screens
- create and edit validation
- authorization and tenant-scope behavior
- empty and failure states
- navigation and context tests
- integrated API evidence

**Dependencies:**
- B-M01 CONTROL PLANE
- DB-M02 CORE DATA
- C-M02 DEVELOPMENT

**Exit checklist:**
- [ ] Scope and supported actions confirmed.
- [ ] List, details, and forms implemented.
- [ ] Server validation and authorization behavior verified.
- [ ] Empty and failure states tested.
- [ ] Project context behavior reviewed.
- [ ] Required automated and integration tests pass.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Inconsistent project access, API mismatch, or project context loss during navigation.

### 8.5 F-M03 BUILD & ARTIFACT

**Phase mapping:** P2.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track build submission, progress, history, logs, Artifact discovery, and Artifact metadata presentation.

**Required evidence:**
- build configuration and submission screens
- authoritative build lifecycle display
- failure and retry behavior
- Artifact metadata and provenance
- integrity and validation state presentation
- integration tests

**Dependencies:**
- B-M02 ARTIFACT
- B-M01 CONTROL PLANE
- DB-M02 CORE DATA
- C-M02 DEVELOPMENT

**Exit checklist:**
- [ ] Build and Artifact screen scope reviewed.
- [ ] API contracts confirmed.
- [ ] Build acknowledgement and completion are distinguished.
- [ ] Artifact metadata and validation states are accurate.
- [ ] Failure and retry scenarios are tested.
- [ ] Logs do not expose secrets.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Misleading build state, incomplete provenance, or UI assumptions that bypass backend validation.

### 8.6 F-M04 BOOKING

**Phase mapping:** P4.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track resource discovery, availability search, quote review, reservation, booking details, and cancellation interactions.

**Required evidence:**
- resource and availability screens
- quote validity and credit-impact presentation
- reservation confirmation behavior
- conflict, expiration, and cancellation tests
- staging integration evidence

**Dependencies:**
- B-M03 PLATFORM
- B-M04 BOOKING
- DB-M03 BOOKING DATA
- C-M03 STAGING

**Exit checklist:**
- [ ] Booking scope and supported actions confirmed.
- [ ] Availability is based on backend state.
- [ ] Quote validity and units are displayed correctly.
- [ ] Reservation success requires backend confirmation.
- [ ] Conflict and cancellation paths are tested.
- [ ] Retry behavior is safe and understandable.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** False availability claims, duplicate submissions, expired quotes, or confusing credit-impact behavior.

### 8.7 F-M05 EXECUTION

**Phase mapping:** P5.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track execution eligibility, submission, Job and Run views, lifecycle feedback, supported commands, and recovery states.

**Required evidence:**
- eligibility and submission screens
- Job and Run details
- lifecycle and command feedback
- retry and uncertain-outcome handling
- authorization tests
- end-to-end execution evidence

**Dependencies:**
- B-M05 EXECUTION
- B-M02 ARTIFACT
- B-M04 BOOKING
- DB-M04 EXECUTION DATA
- C-M03 STAGING

**Exit checklist:**
- [ ] Execution scope and commands reviewed.
- [ ] Job and Run remain distinct.
- [ ] Submission acknowledgement is not treated as successful execution.
- [ ] Lifecycle states reflect backend responses.
- [ ] Cancellation and recovery behavior are tested.
- [ ] Duplicate submission behavior is verified.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Duplicate Jobs, misleading lifecycle states, or unsafe recovery behavior.

### 8.8 F-M06 LIVE

**Phase mapping:** P7.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track live-session entry, connection states, telemetry presentation, freshness indicators, and recovery behavior.

**Required evidence:**
- live session screen and connection states
- telemetry units and timestamps
- stale-data handling
- reconnect and disconnect behavior
- relevant integration and accessibility tests

**Dependencies:**
- B-M06 RESULTS and applicable execution contracts
- DB-M04 EXECUTION DATA
- C-M03 STAGING

**Exit checklist:**
- [ ] Live-session scope reviewed.
- [ ] Connection state is visible.
- [ ] Telemetry units, timestamps, and freshness are correct.
- [ ] Stale and missing data are distinguished.
- [ ] Reconnection behavior is tested.
- [ ] Accessibility and integration reviews pass.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Stale data presented as current, confusing missing signals, or reconnect behavior causing duplicate operations.

### 8.9 F-M07 RESULTS

**Phase mapping:** P7.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track Result discovery, details, files, metrics, provenance, experiments, and supported comparisons.

**Required evidence:**
- Result list and details
- Job and Run associations
- file metadata and authorized access
- metric units and provenance
- comparison validity
- archived or unavailable content handling

**Dependencies:**
- B-M06 RESULTS
- B-M05 EXECUTION
- DB-M04 EXECUTION DATA
- C-M03 STAGING

**Exit checklist:**
- [ ] Results screen scope reviewed.
- [ ] Provenance and execution links verified.
- [ ] File access behavior tested.
- [ ] Metric units and context are correct.
- [ ] Incompatible comparisons are handled.
- [ ] Authorization and retention behavior are verified.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Incorrect provenance, unauthorized file access, or misleading comparisons.

## 9. Backend Milestone Status

Backend milestone scope is governed by the dossiers under `docs/backend/milestones/`.

### 9.1 Backend inventory

| ID | Canonical name | Phase mapping | Initial status | Acceptance |
|---|---|---|---|---|
| B-M01 | CONTROL PLANE | P3 | NOT STARTED | NOT ASSESSED |
| B-M02 | ARTIFACT | P2-P3 | NOT STARTED | NOT ASSESSED |
| B-M03 | PLATFORM | P3 | NOT STARTED | NOT ASSESSED |
| B-M04 | BOOKING | P4 | NOT STARTED | NOT ASSESSED |
| B-M05 | EXECUTION | P5 | NOT STARTED | NOT ASSESSED |
| B-M06 | RESULTS | P6-P7 | NOT STARTED | NOT ASSESSED |
| B-M07 | PRODUCTION | P8 | NOT STARTED | NOT ASSESSED |

### 9.2 Backend dependency overview

| Milestone | Principal dependencies |
|---|---|
| B-M01 CONTROL PLANE | DB-M01 FOUNDATION; DB-M02 CORE DATA; C-M02 DEVELOPMENT |
| B-M02 ARTIFACT | B-M01 CONTROL PLANE; DB-M02 CORE DATA; C-M02 DEVELOPMENT |
| B-M03 PLATFORM | B-M01 CONTROL PLANE; DB-M02 CORE DATA; C-M02 DEVELOPMENT |
| B-M04 BOOKING | B-M03 PLATFORM; DB-M03 BOOKING DATA; C-M03 STAGING |
| B-M05 EXECUTION | B-M02 ARTIFACT; B-M04 BOOKING where applicable; DB-M04 EXECUTION DATA; C-M03 STAGING |
| B-M06 RESULTS | B-M05 EXECUTION; DB-M04 EXECUTION DATA; C-M03 STAGING |
| B-M07 PRODUCTION | Accepted relevant service capabilities; C-M04 PRODUCTION; applicable security and operations evidence |

### 9.3 B-M01 CONTROL PLANE

**Phase mapping:** P3.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track the Control Plane service capabilities defined by the authoritative dossier, including applicable identity, project, access, and service coordination contracts.

**Required evidence:**
- API and domain contracts
- authorization and validation tests
- service-level error behavior
- integration tests
- security review
- operational diagnostics

**Dependencies:** DB-M01 FOUNDATION; DB-M02 CORE DATA; C-M02 DEVELOPMENT.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Required APIs and schemas reviewed.
- [ ] Authorization and tenant isolation verified.
- [ ] Error and retry behavior tested.
- [ ] Required persistence behavior validated.
- [ ] Observability requirements satisfied.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Inconsistent authorization, incomplete contracts, and missing auditability.

### 9.4 B-M02 ARTIFACT

**Phase mapping:** P2-P3.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track Artifact identity, metadata, validation, integrity, access, and provenance capabilities within the authoritative scope.

**Required evidence:**
- Artifact API contracts
- metadata validation
- integrity and provenance tests
- authorized access behavior
- relevant persistence and storage integration

**Dependencies:** B-M01 CONTROL PLANE; DB-M02 CORE DATA; C-M02 DEVELOPMENT.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Artifact metadata contract validated.
- [ ] Integrity and validation states are authoritative.
- [ ] Access controls are tested.
- [ ] Provenance requirements are met.
- [ ] Error and recovery paths are tested.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Incomplete integrity checks, missing provenance, and incorrect Artifact eligibility.

### 9.5 B-M03 PLATFORM

**Phase mapping:** P3.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track resource and capability services and the platform contracts defined by the authoritative dossier.

**Required evidence:**
- resource catalog and capability contracts
- resource state behavior
- authorization tests
- persistence and consistency tests
- integration evidence

**Dependencies:** B-M01 CONTROL PLANE; DB-M02 CORE DATA; C-M02 DEVELOPMENT.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Resource and capability contracts verified.
- [ ] Resource identity and state are consistent.
- [ ] Authorization behavior tested.
- [ ] Persistence requirements satisfied.
- [ ] Integration evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Stale resource state, inconsistent capability metadata, and unclear resource ownership.

### 9.6 B-M04 BOOKING

**Phase mapping:** P4.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track availability, booking, quote, cancellation, and applicable credit operations.

**Required evidence:**
- booking API contracts
- transaction and concurrency tests
- quote validity checks
- idempotency and retry tests
- cancellation and credit adjustment evidence

**Dependencies:** B-M03 PLATFORM; DB-M03 BOOKING DATA; C-M03 STAGING.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Availability and reservation behavior verified.
- [ ] Conflicting reservations are handled correctly.
- [ ] Quote and credit behavior is validated.
- [ ] Idempotency is tested.
- [ ] Cancellation and failure paths are verified.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Reservation conflicts, incorrect credit accounting, and duplicate operations.

### 9.7 B-M05 EXECUTION

**Phase mapping:** P5.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track execution eligibility, Job and Run lifecycle, dispatch, commands, and recovery contracts.

**Required evidence:**
- Job and Run API contracts
- lifecycle and dispatch tests
- command authorization
- idempotency and reconciliation tests
- persistence integrity and recovery evidence

**Dependencies:** B-M02 ARTIFACT; B-M04 BOOKING where applicable; DB-M04 EXECUTION DATA; C-M03 STAGING.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Job and Run contracts are distinct.
- [ ] Eligibility and dispatch behavior verified.
- [ ] Lifecycle transitions tested.
- [ ] Retry and uncertain-outcome handling verified.
- [ ] Recovery and reconciliation evidence recorded.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Duplicate dispatch, inconsistent lifecycle state, and incomplete reconciliation.

### 9.8 B-M06 RESULTS

**Phase mapping:** P6-P7.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track Result, file metadata, metrics, experiment, comparison, and applicable live-session contracts defined by the authoritative dossier.

**Required evidence:**
- Result API contracts
- provenance and execution linkage
- file access and metadata tests
- metric and comparison validation
- retention and availability behavior

**Dependencies:** B-M05 EXECUTION; DB-M04 EXECUTION DATA; C-M03 STAGING.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Result provenance is verified.
- [ ] Job and Run relationships are preserved.
- [ ] File access is authorized.
- [ ] Metrics and comparison semantics are tested.
- [ ] Applicable live-session requirements are validated.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Incorrect Result association, inconsistent metrics, and unauthorized file access.

### 9.9 B-M07 PRODUCTION

**Phase mapping:** P8.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track backend production qualification and operational requirements defined by the authoritative dossier.

**Required evidence:**
- production configuration and deployment evidence
- security and access review
- observability and operational diagnostics
- reliability and recovery tests
- incident and support procedures
- formal production acceptance

**Dependencies:** Relevant accepted service capabilities; C-M04 PRODUCTION; applicable database, security, and operations evidence.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Production configuration validated.
- [ ] Security requirements satisfied.
- [ ] Monitoring and diagnostics verified.
- [ ] Recovery and operational procedures tested.
- [ ] Critical defects resolved or formally dispositioned.
- [ ] Production acceptance recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Incomplete production qualification, insufficient monitoring, and untested recovery procedures.

## 10. Database Milestone Status

Database milestone scope is governed by the dossiers under `docs/database/milestones/`.

### 10.1 Database inventory

| ID | Canonical name | Phase mapping | Initial status | Acceptance |
|---|---|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 | NOT STARTED | NOT ASSESSED |
| DB-M02 | CORE DATA | P3 | NOT STARTED | NOT ASSESSED |
| DB-M03 | BOOKING DATA | P4 | NOT STARTED | NOT ASSESSED |
| DB-M04 | EXECUTION DATA | P5-P7 | NOT STARTED | NOT ASSESSED |

### 10.2 DB-M01 FOUNDATION

**Phase mapping:** P0-P3.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track the database conventions, migration tooling, connection and transaction policies, shared data conventions, validation, isolation, health checks, and other requirements defined by the authoritative dossier.

**Dependencies:** Applicable foundation requirements and C-M01 FOUNDATION.

**Exit checklist:**
- [ ] Database architecture and conventions reviewed.
- [ ] Migration tooling and validation procedures tested.
- [ ] Connection and transaction policies documented.
- [ ] Identifier and timestamp conventions agreed.
- [ ] Data ownership and isolation requirements documented.
- [ ] Health-check behavior verified.
- [ ] Backup and restore baseline documented where required.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Inconsistent migration practice, unclear ownership, and unreproducible database configuration.

### 10.3 DB-M02 CORE DATA

**Phase mapping:** P3.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track core project, Artifact, platform, capability, resource, and related data structures within the authoritative dossier's scope.

**Dependencies:** DB-M01 FOUNDATION; B-M01 CONTROL PLANE; B-M02 ARTIFACT; B-M03 PLATFORM.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Required core schemas and constraints implemented.
- [ ] Indexes and query patterns reviewed.
- [ ] Tenant and organization isolation tested.
- [ ] Migration compatibility validated.
- [ ] Integrity tests pass.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Incorrect relationships, weak isolation, and incompatible migrations.

### 10.4 DB-M03 BOOKING DATA

**Phase mapping:** P4.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track booking, reservation, quote, credit, cancellation, and idempotency persistence as specified by the authoritative dossier.

**Dependencies:** DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M04 BOOKING.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Booking and reservation schemas validated.
- [ ] Concurrency and conflict protection tested.
- [ ] Quote and credit records preserve required history.
- [ ] Idempotency records support required retry behavior.
- [ ] Cancellation and adjustment integrity is tested.
- [ ] Migration and transaction evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Duplicate reservations, incorrect credit adjustments, and transaction inconsistency.

### 10.5 DB-M04 EXECUTION DATA

**Phase mapping:** P5-P7.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track Job, Run, execution event, Result, file metadata, metric, experiment, comparison, and retention data within the authoritative dossier's scope.

**Dependencies:** DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M05 EXECUTION; B-M06 RESULTS.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Job and Run relationships are correct.
- [ ] Execution and dispatch records preserve required state.
- [ ] Result provenance is preserved.
- [ ] File metadata and metrics meet contract requirements.
- [ ] Query indexes support expected access patterns.
- [ ] Integrity and recovery tests pass.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Lost execution history, broken Result provenance, and insufficient query performance.

## 11. Cloud Milestone Status

Cloud milestone scope is governed by the dossiers under `docs/cloud/milestones/`.

### 11.1 Cloud inventory

| ID | Canonical name | Phase mapping | Initial status | Acceptance |
|---|---|---|---|---|
| C-M01 | FOUNDATION | P0 | NOT STARTED | NOT ASSESSED |
| C-M02 | DEVELOPMENT | P1-P3 | NOT STARTED | NOT ASSESSED |
| C-M03 | STAGING | P4-P7 | NOT STARTED | NOT ASSESSED |
| C-M04 | PRODUCTION | P8 | NOT STARTED | NOT ASSESSED |

### 11.2 C-M01 FOUNDATION

**Phase mapping:** P0.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track the initial cloud and environment foundation required by the authoritative dossier.

**Dependencies:** Approved foundation requirements and project decisions.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Environment and access requirements documented.
- [ ] Initial infrastructure and configuration conventions reviewed.
- [ ] Secrets-handling expectations documented.
- [ ] Required health checks and diagnostics identified.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Unreproducible setup, inconsistent configuration, and unclear access controls.

### 11.3 C-M02 DEVELOPMENT

**Phase mapping:** P1-P3.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track development environment configuration, integration access, deployment repeatability, and diagnostics defined by the authoritative dossier.

**Dependencies:** C-M01 FOUNDATION; applicable backend and database integration requirements.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Development deployment procedures tested.
- [ ] Configuration and secrets handling verified.
- [ ] Required service connectivity verified.
- [ ] Logging and health checks are usable.
- [ ] Development environment limitations are documented.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Environment drift, missing diagnostics, and differences between local and integrated behavior.

### 11.4 C-M03 STAGING

**Phase mapping:** P4-P7.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track staging deployment and integrated workflow readiness for the capabilities assigned to P4-P7.

**Dependencies:** C-M02 DEVELOPMENT; relevant accepted or integration-ready frontend, backend, and database capabilities.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Staging deployment is repeatable.
- [ ] Configuration and access controls are verified.
- [ ] Required service connectivity is tested.
- [ ] Booking and execution workflows are exercised as applicable.
- [ ] Live and Results integration is tested as applicable.
- [ ] Monitoring and diagnostics are verified.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Staging environment drift, incomplete cross-domain integration, and insufficient diagnostic coverage.

### 11.5 C-M04 PRODUCTION

**Phase mapping:** P8.

**Initial status:** `NOT STARTED`.

**Objective summary:** Track production infrastructure, configuration, deployment, security, monitoring, and operational acceptance requirements defined by the authoritative dossier.

**Dependencies:** C-M03 STAGING; B-M07 PRODUCTION; applicable security, database, and operations evidence.

**Exit checklist:**
- [ ] Dossier scope reviewed.
- [ ] Production infrastructure and configuration are validated.
- [ ] Production access and secrets handling are reviewed.
- [ ] Deployment and rollback procedures are tested.
- [ ] Monitoring, alerting, and diagnostics are operational.
- [ ] Backup and recovery requirements are verified where applicable.
- [ ] Operational ownership and incident procedures are assigned.
- [ ] Required production approvals are recorded.
- [ ] Acceptance evidence recorded.

**Acceptance state:** `NOT ASSESSED`.

**Owner:** TBD.

**Risks:** Unsafe configuration changes, incomplete rollback procedures, insufficient monitoring, and untested recovery.

## 12. Dependency Readiness

A milestone dependency must be recorded at the level of a specific deliverable.

Examples include:

- an API contract and its error semantics
- a schema migration and its compatibility evidence
- a resource capability contract
- a booking transaction guarantee
- an execution lifecycle contract
- a staging environment capability
- a security review or production approval

### 12.1 Dependency status

| Status | Meaning |
|---|---|
| `NOT STARTED` | Provider work has not started. |
| `IN PROGRESS` | Provider work is underway. |
| `BLOCKED` | Provider work cannot progress. |
| `AVAILABLE FOR INTEGRATION` | The deliverable exists and is ready for consumer testing. |
| `ACCEPTED` | The consuming requirement has been verified. |
| `NOT APPLICABLE` | Approved rationale establishes that the dependency is not required. |

A provider's implementation status and a consumer's dependency readiness are separate facts. A dependency is not accepted simply because the provider reports its task complete.

### 12.2 Dependency record template

| Field | Required content |
|---|---|
| Dependency ID | Unique identifier |
| Provider milestone | Exact frozen milestone ID |
| Consumer milestone | Exact frozen milestone ID |
| Deliverable | Specific API, schema, environment, or decision |
| Required-by date | Approved date or `TBD` |
| Provider owner | Accountable provider |
| Consumer owner | Accountable consumer |
| Status | Approved dependency status |
| Evidence | Contract, test, or review reference |
| Blocker | Related blocker ID if applicable |
| Next action | Concrete action to reach acceptance |

## 13. Progress and Acceptance Measurement

Progress must be measured against the milestone's authoritative exit criteria.

### 13.1 Progress calculation

    Milestone Progress (%) =
        100 × sum(weight × verified completion fraction)
            / sum(applicable criterion weights)

Use agreed criterion weights. If weights are not established, report `Not baselined`.

A completion fraction may be:

- `0.0` for not started
- a justified value between `0.0` and `1.0` for measurable partial work
- `1.0` for a criterion fully supported by evidence

Exclude a criterion from the denominator only when it is formally approved as `NOT APPLICABLE`.

### 13.2 Progress controls

- Do not calculate progress from task counts alone.
- Do not count documentation and implementation of the same deliverable twice.
- Do not mark a criterion complete without evidence.
- Keep acceptance state separate from progress percentage.
- A milestone may have high implementation progress while remaining blocked on integration or acceptance.
- Recalculate progress when scope changes through an approved decision.
- Preserve a record of material changes to the progress calculation.

### 13.3 Acceptance evidence

Evidence may include:

- code review and commit references
- automated test reports
- integration test reports
- API contract review
- migration test results
- environment and deployment records
- security review
- accessibility review where applicable
- manual acceptance records
- approval decisions
- documented exceptions and residual risks

Evidence must be relevant to the current milestone scope and implementation version.

## 14. Risk and Blocker Tracking

Detailed risks are maintained in `docs/tracking/RISK_REGISTER.md` where available.

Each milestone record must link relevant risks and blockers rather than duplicating their full descriptions.

### 14.1 Risk fields

- risk ID
- affected milestone IDs
- description
- likelihood and impact
- mitigation
- contingency
- accountable owner
- review date
- status
- evidence or decision reference

### 14.2 Blocker fields

- blocker ID
- affected milestone ID
- date raised
- blocking condition
- required resolution
- accountable owner
- target resolution date
- escalation owner
- status
- resolution evidence

### 14.3 Resolution rules

- A blocker is resolved only after its resolution is verified.
- A risk is closed only after residual exposure is reassessed.
- A risk accepted by governance remains visible in the tracking record.
- An approved exception must identify its scope, rationale, owner, and review condition.
- Material blockers affecting a dependent milestone must be reflected in both records.
- Do not mark acceptance complete while a mandatory criterion remains unmet.

## 15. Milestone Review Procedure

Perform a formal review when a milestone approaches acceptance, when a critical dependency changes, or when a material risk affects delivery.

### Step 1: Confirm canonical identity

Verify the milestone identifier, exact name, and phase mapping against this inventory and `planning/PHASES.md`.

### Step 2: Read the authoritative dossier

Review the applicable dossier under `docs/**/milestones/`. Confirm scope and acceptance requirements.

### Step 3: Reconcile tasks

Review the relevant task backlog, code changes, tests, documentation, and open work.

### Step 4: Verify dependencies

Confirm that provider deliverables are available and consumer requirements have been tested.

### Step 5: Review exit criteria

Record each criterion as pending, passed, blocked, or formally not applicable.

### Step 6: Reassess progress

Calculate evidence-based progress or retain `Not baselined`.

### Step 7: Review risks and blockers

Confirm owners, actions, target dates, escalation, and residual risk.

### Step 8: Record acceptance state

Use the acceptance vocabulary defined in this document and link the evidence.

### Step 9: Update dashboards

Update `docs/tracking/STATUS.md`, `docs/tracking/PHASE_STATUS.md`, and this tracker as appropriate.

## 16. Milestone Acceptance Record Template

| Field | Value |
|---|---|
| Milestone ID | Exact frozen identifier |
| Canonical name | Exact frozen name |
| Phase mapping | Exact frozen mapping |
| Review date | `YYYY-MM-DD` |
| Accountable owner | Assigned owner |
| Current status | Status vocabulary value |
| Progress | Verified percentage or `Not baselined` |
| Acceptance state | Acceptance vocabulary value |
| Criteria passed | Count and evidence |
| Criteria remaining | Count and owner |
| Dependencies | Dependency IDs and current state |
| Open blockers | Blocker IDs |
| Material risks | Risk IDs |
| Test evidence | Reports and relevant revisions |
| Integration evidence | Workflow test references |
| Exceptions | Approved exceptions or none |
| Decision | Accept, reject, defer, or continue work |
| Reviewers | Accountable roles |
| Next action | Concrete follow-up |
| Next review | Agreed date |

## 17. Cross-Domain Milestone Inventory Validation

### 17.1 Frontend

- [ ] F-M01 STUDIO FOUNDATION — P0-P1
- [ ] F-M02 PROJECTS — P1
- [ ] F-M03 BUILD & ARTIFACT — P2
- [ ] F-M04 BOOKING — P4
- [ ] F-M05 EXECUTION — P5
- [ ] F-M06 LIVE — P7
- [ ] F-M07 RESULTS — P7

### 17.2 Backend

- [ ] B-M01 CONTROL PLANE — P3
- [ ] B-M02 ARTIFACT — P2-P3
- [ ] B-M03 PLATFORM — P3
- [ ] B-M04 BOOKING — P4
- [ ] B-M05 EXECUTION — P5
- [ ] B-M06 RESULTS — P6-P7
- [ ] B-M07 PRODUCTION — P8

### 17.3 Database

- [ ] DB-M01 FOUNDATION — P0-P3
- [ ] DB-M02 CORE DATA — P3
- [ ] DB-M03 BOOKING DATA — P4
- [ ] DB-M04 EXECUTION DATA — P5-P7

### 17.4 Cloud

- [ ] C-M01 FOUNDATION — P0
- [ ] C-M02 DEVELOPMENT — P1-P3
- [ ] C-M03 STAGING — P4-P7
- [ ] C-M04 PRODUCTION — P8

The inventory contains 22 canonical milestones: seven frontend, seven backend, four database, and four cloud milestones.

Do not add alternate milestone identifiers to compensate for cross-domain work. Track additional work in the applicable task backlog or authoritative milestone dossier.

## 18. Phase-to-Milestone Coverage

This table supports phase-level reconciliation. It does not redefine phase scope.

| Phase | Canonical name | Milestones whose mapping includes the phase |
|---|---|---|
| P0 | FOUNDATION | F-M01 STUDIO FOUNDATION; DB-M01 FOUNDATION; C-M01 FOUNDATION |
| P1 | STUDIO | F-M01 STUDIO FOUNDATION; F-M02 PROJECTS; DB-M01 FOUNDATION; C-M02 DEVELOPMENT |
| P2 | BUILD & ARTIFACT | F-M03 BUILD & ARTIFACT; B-M02 ARTIFACT; DB-M01 FOUNDATION; C-M02 DEVELOPMENT |
| P3 | CONTROL PLANE | B-M01 CONTROL PLANE; B-M02 ARTIFACT; B-M03 PLATFORM; DB-M01 FOUNDATION; DB-M02 CORE DATA; C-M02 DEVELOPMENT |
| P4 | BOOKING & COMMERCIAL | F-M04 BOOKING; B-M04 BOOKING; DB-M03 BOOKING DATA; C-M03 STAGING |
| P5 | EXECUTION | F-M05 EXECUTION; B-M05 EXECUTION; DB-M04 EXECUTION DATA; C-M03 STAGING |
| P6 | LAB & ROBOT | B-M06 RESULTS; DB-M04 EXECUTION DATA; C-M03 STAGING |
| P7 | LIVE & RESULTS | F-M06 LIVE; F-M07 RESULTS; B-M06 RESULTS; DB-M04 EXECUTION DATA; C-M03 STAGING |
| P8 | PRODUCTION | B-M07 PRODUCTION; C-M04 PRODUCTION |

The phase-to-milestone table is a coverage view based on frozen mappings. It must not be used to infer that a milestone is exclusively owned by one phase when its canonical mapping spans multiple phases.

## 19. Reporting and Forecasting

At each project review, summarize:

- milestone status changes
- verified progress changes
- acceptance decisions
- dependencies that became available or blocked
- risks added, mitigated, or escalated
- blockers opened or resolved
- changes to planned or forecast dates
- next milestone review
- decisions required from leadership

Forecasts must identify assumptions and dependencies. A target date is not a forecast unless the delivery assessment supports it.

Do not publish a consolidated progress percentage unless the weighting methodology is agreed and applied consistently.

## 20. Tracker Maintenance Checklist

- [ ] Every frozen milestone is present exactly once in the consolidated inventory.
- [ ] All identifiers and names match the canonical model.
- [ ] Phase mappings match the frozen model.
- [ ] Initial statuses are explicit.
- [ ] Acceptance states are explicit.
- [ ] Owners and dates are recorded or marked `TBD`.
- [ ] Progress is evidence-based or marked `Not baselined`.
- [ ] Dependencies name specific deliverables.
- [ ] Dependency readiness is verified.
- [ ] Exit criteria are linked to authoritative dossiers.
- [ ] Risks and blockers have owners and next actions.
- [ ] Acceptance evidence is linked.
- [ ] Phase and master dashboards are reconciled.
- [ ] No retired phase or milestone names appear in active tracking references.
- [ ] No new milestone identifiers have been invented.

## 21. Change Control

Changes to status, progress, ownership, dates, dependencies, evidence, risks, and blockers may be made as part of normal tracking.

Changes to phase definitions must be made only in `planning/PHASES.md` through the approved governance process.

Changes to milestone scope must be made in the relevant authoritative dossier under `docs/**/milestones/`.

Changes to task-level scope and ownership must be reflected in the applicable task backlog.

For each material status change, record:

- date
- author
- milestone ID
- previous status and acceptance state
- new status and acceptance state
- rationale
- evidence
- dependency impact
- approver where required

Do not create substitute phase names, alternative milestone names, or additional milestone identifiers in this file.

## 22. Baseline Acceptance

The milestone tracker is ready for routine use when:

- all 22 canonical milestones are listed
- the phase mappings match `planning/PHASES.md`
- initial statuses and acceptance states are recorded
- actual P0 FOUNDATION documentation work is identified without overstating progress
- milestone owners and dates are assigned or explicitly marked `TBD`
- authoritative milestone dossiers are identified
- dependency tracking is established
- acceptance and progress rules are understood
- risks and blockers are linked to the relevant registers
- the first reconciliation review is scheduled

Baseline acceptance confirms the tracking structure is ready. It does not accept or complete any product milestone.

## 23. Changelog

### Initial Frozen-Model Baseline

- Initialized the consolidated milestone tracker for all frozen frontend, backend, database, and cloud milestones.
- Added all 22 milestone identifiers with their exact canonical names and phase mappings.
- Established `planning/PHASES.md` as the canonical phase definition.
- Preserved milestone dossiers under `docs/**/milestones/` as authoritative for scope.
- Defined implementation status and acceptance state separately.
- Added per-milestone objectives, dependencies, exit checklists, owners, and risk prompts.
- Added dependency readiness and evidence-based progress rules.
- Added phase-to-milestone coverage for reconciliation.
- Established milestone review, acceptance, reporting, and change-control procedures.
- Set the initial milestone baseline to `NOT STARTED` and acceptance to `NOT ASSESSED`, subject only to verified P0 FOUNDATION documentation work.

### Future Updates

Future updates must preserve the frozen phase and milestone identifiers, exact names, and phase mappings unless the canonical model is formally changed through project governance.
