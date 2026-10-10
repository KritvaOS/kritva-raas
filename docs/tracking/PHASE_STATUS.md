# Kritva RaaS — Phase Status Tracker

## 1. Purpose

This document tracks the status of the Kritva RaaS product and engineering phases from P0 through P8. It provides a phase-level view of objectives, accountable ownership, planned dates, progress, exit criteria, dependencies, risks, and acceptance evidence.

The tracker is intended for project leadership, engineering leads, implementation teams, and reviewers who need a consistent view of delivery readiness and remaining work.

This document is a tracking artifact. It does not redefine phase scope, create milestones, or replace authoritative engineering plans.

The tracker must distinguish between:
- planned work and verified implementation
- implementation completion and formal acceptance
- phase progress and milestone progress
- a resolved risk and an accepted residual risk
- a staging deployment and production readiness
- documentation completion and operational capability

All progress and status claims must be supported by evidence.

## 2. Canonical References

| Concern | Authoritative reference |
|---|---|
| Phase definitions and boundaries | `docs/planning/PHASES.md` |
| Master project dashboard | `docs/tracking/STATUS.md` |
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
| Project risks | `docs/tracking/RISK_REGISTER.md` |
| Project decisions | `docs/planning/DECISIONS.md` |
| Milestone acceptance evidence | Relevant authoritative milestone dossier |
| Build and test evidence | CI reports, test reports, and build records |
| Deployment evidence | Relevant cloud and deployment records |

Directory references identify the location of authoritative material. They do not imply that every expected file is already present.

### 2.1 Authority rules

1. `docs/planning/PHASES.md` is the sole canonical definition of phase names, boundaries, and definitions.
2. Existing milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.
3. This tracker records phase status, objectives, dates, progress, risks, and exit evidence.
4. The master dashboard in `docs/tracking/STATUS.md` provides the consolidated project status.
5. Task backlogs record task-level status and assignment.
6. Phase progress must be reconciled with the actual milestone acceptance state.
7. A phase cannot be marked complete solely because its planning documents exist.
8. Where sources disagree, record the discrepancy and resolve it through project governance.

## 3. Frozen Phase Inventory

The following inventory must remain aligned with `docs/planning/PHASES.md`.

| Phase | Canonical name | Initial status |
|---|---|---|
| P0 | FOUNDATION | NOT STARTED unless verified documentation work is in progress |
| P1 | STUDIO | NOT STARTED |
| P2 | BUILD & ARTIFACT | NOT STARTED |
| P3 | CONTROL PLANE | NOT STARTED |
| P4 | BOOKING & COMMERCIAL | NOT STARTED |
| P5 | EXECUTION | NOT STARTED |
| P6 | LAB & ROBOT | NOT STARTED |
| P7 | LIVE & RESULTS | NOT STARTED |
| P8 | PRODUCTION | NOT STARTED |

Phase names and identifiers must not be changed locally in this tracker.

The objective descriptions below summarize tracking intent. They are not substitute phase definitions. For authoritative phase scope and boundaries, consult `docs/planning/PHASES.md`.

## 4. Status Vocabulary

| Status | Meaning |
|---|---|
| `NOT STARTED` | No verified work has started for the tracked phase objective. |
| `IN PROGRESS` | Verified work is underway with an accountable owner and next action. |
| `BLOCKED` | A required dependency, decision, resource, or approval prevents progress. |
| `IN REVIEW` | Required deliverables are available for formal review. |
| `ACCEPTED` | Applicable exit criteria have been satisfied and acceptance evidence is recorded. |
| `COMPLETE` | Phase closure requirements have been met and closure is approved. |
| `DEFERRED` | Work has been explicitly postponed through an approved decision. |
| `NOT APPLICABLE` | An exit criterion does not apply, with documented rationale and approval. |

### 4.1 Status transition rules

- `NOT STARTED` may change to `IN PROGRESS` when verified work begins.
- `IN PROGRESS` may change to `BLOCKED` when a material blocker prevents progress.
- `IN PROGRESS` may change to `IN REVIEW` when the required deliverables are ready for review.
- `IN REVIEW` may return to `IN PROGRESS` if review identifies required changes.
- `IN REVIEW` may change to `ACCEPTED` when all applicable acceptance conditions pass.
- `ACCEPTED` may change to `COMPLETE` after phase closure and governance requirements are satisfied.
- A status must be reopened if later evidence invalidates its acceptance basis.
- `DEFERRED` requires a decision reference, owner, rationale, and review condition.
- `NOT APPLICABLE` requires a documented rationale and approval.

Do not mark a phase `COMPLETE` merely because all currently assigned tasks appear closed. Reconcile the full exit checklist and all applicable milestone dossiers first.

## 5. Phase Tracker Overview

The initial tracker baseline is:

| Phase | Canonical name | Owner | Start date | Target date | Status | Progress |
|---|---|---|---|---|---|---|
| P0 | FOUNDATION | TBD | TBD | TBD | NOT STARTED unless verified work is in progress | Not baselined |
| P1 | STUDIO | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P2 | BUILD & ARTIFACT | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P3 | CONTROL PLANE | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P4 | BOOKING & COMMERCIAL | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P5 | EXECUTION | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P6 | LAB & ROBOT | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P7 | LIVE & RESULTS | TBD | TBD | TBD | NOT STARTED | 0% baseline |
| P8 | PRODUCTION | TBD | TBD | TBD | NOT STARTED | 0% baseline |

`TBD` means that a date or owner has not yet been formally recorded. It must not be interpreted as a commitment.

The progress baseline is not an estimate of implementation already completed. Progress percentages must be calculated from verified, weighted exit criteria after the initial assessment.

## 6. Ownership and Date Conventions

### 6.1 Ownership

Each phase must have one accountable phase owner. Supporting contributors may be recorded separately.

| Role | Responsibility |
|---|---|
| Product Lead | Product outcome, scope alignment, and business acceptance |
| Engineering Lead | Engineering delivery coordination and technical quality |
| Frontend Lead | Frontend milestone delivery and UI integration |
| Backend Lead | Backend service contracts and implementation |
| Database Lead | Persistence, migration, integrity, and recovery evidence |
| Cloud Lead | Environment, deployment, observability, and operational readiness |
| Security Reviewer | Security requirements and review evidence |
| Integration Lead | Cross-domain workflow verification |
| Phase Owner | Consolidated phase status, blockers, and exit readiness |
| Approver | Formal acceptance or closure according to governance |

One person may hold multiple roles, but accountability must remain explicit.

### 6.2 Dates

Use ISO 8601 dates: `YYYY-MM-DD`.

For each phase, record:

- planned start date
- planned target date
- actual start date
- acceptance date
- completion date
- last reviewed date

Actual dates must reflect observed events, not intended dates.

When a target date changes, record the previous date, new date, reason, approver, and schedule impact in the project tracking record.

### 6.3 Date integrity

- Do not invent start dates or target dates.
- Do not backdate acceptance.
- Do not use the date of a planning-document commit as the phase completion date.
- Record the date of the evidence supporting acceptance.
- Keep target dates consistent with the approved product plan and current dependencies.

## 7. Progress Measurement

Phase progress must be calculated from exit criteria and verified deliverables, not from raw task counts alone.

### 7.1 Recommended calculation

For each phase, assign weights to applicable exit criteria. Mark each criterion with a verified completion fraction.

    Phase Progress (%) =
        100 × sum(criterion weight × verified completion fraction)
            / sum(applicable criterion weights)

Use a completion fraction of:

- `0.0` for not started
- an agreed value between `0.0` and `1.0` for measurable partial work
- `1.0` when the criterion is fully evidenced
- exclusion from the denominator only when formally marked `NOT APPLICABLE`

Weights must be defined before using them for executive reporting. If weights are not defined, report progress as `Not baselined` instead of publishing a misleading percentage.

### 7.2 Progress controls

- Every completed criterion must have an evidence reference.
- A task marked complete does not automatically make its phase criterion complete.
- A test suite passing does not prove unrelated criteria are complete.
- Partial implementation must not be rounded up to full acceptance.
- A blocked criterion remains incomplete until the blocking condition is resolved or an approved disposition is recorded.
- Report progress and status separately.
- Phase progress must not replace the milestone-level status tables.

## 8. P0 FOUNDATION

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED unless verified documentation work is in progress.

### 8.1 Tracking objective

Establish the verified foundation required to coordinate Kritva RaaS delivery. Track the readiness of canonical planning, ownership, governance, engineering conventions, and initial development-environment requirements as specified by the authoritative phase definition and applicable milestone dossiers.

This objective is a tracking summary, not a replacement definition of P0.

### 8.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Product Lead, Engineering Lead, and relevant domain leads |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 8.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | NOT STARTED |
| DB-M01 | FOUNDATION | P0-P3 | NOT STARTED |
| C-M01 | FOUNDATION | P0 | NOT STARTED |

A milestone spanning multiple phases must retain its canonical phase mapping. Its status must not be copied blindly into every phase it touches.

### 8.4 Exit-criteria checklist

- [ ] Canonical phase model is documented in `docs/planning/PHASES.md`.
- [ ] Master status dashboard is initialized.
- [ ] Phase owners and supporting domain owners are assigned.
- [ ] Milestone dossiers have been inventoried and reviewed.
- [ ] Initial project risks and dependencies are recorded.
- [ ] Documentation conventions and review expectations are agreed.
- [ ] Development-environment requirements are identified.
- [ ] Initial security and access assumptions are documented.
- [ ] Applicable foundation milestone acceptance criteria are satisfied.
- [ ] Required evidence and formal acceptance are recorded.

These checklist items are tracking prompts. The authoritative phase definition and milestone dossiers determine the actual required scope.

### 8.5 Risks to review

- Missing or inconsistent authoritative documents.
- Unassigned ownership or unclear decision authority.
- Unresolved engineering-toolchain requirements.
- Unrecorded dependencies between domains.
- Development configuration that cannot be reproduced.
- Security assumptions that have not been reviewed.

### 8.6 Acceptance evidence

Record the canonical planning references, assigned owners, environment checks, review outcomes, relevant tests, and the acceptance decision.

### 8.7 Exit decision

**Current decision:** NOT STARTED unless actual documentation work and its owner are recorded.

Do not mark P0 accepted merely because this tracker exists.

## 9. P1 STUDIO

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 9.1 Tracking objective

Track delivery of the Studio-facing capabilities assigned to P1, including the applicable user interface and project workflow outcomes described by the authoritative phase definition and milestone dossiers.

### 9.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Frontend Lead, Backend Lead, and Integration Lead |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 9.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | NOT STARTED |
| F-M02 | PROJECTS | P1 | NOT STARTED |
| C-M02 | DEVELOPMENT | P1-P3 | NOT STARTED |

### 9.4 Exit-criteria checklist

- [ ] Applicable P1 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] F-M01 STUDIO FOUNDATION acceptance for the applicable P1 scope is recorded.
- [ ] F-M02 PROJECTS acceptance criteria are satisfied.
- [ ] Project navigation and access behavior are verified.
- [ ] Required backend contracts are available and reviewed.
- [ ] Development environment supports the applicable integrated workflows.
- [ ] Authorization and error handling are verified.
- [ ] Automated tests and relevant integration tests pass.
- [ ] Open blockers have been resolved or formally dispositioned.
- [ ] Phase acceptance evidence is recorded.

### 9.5 Risks to review

- UI implementation advancing before API contracts stabilize.
- Inconsistent identity or authorization behavior.
- Project context not being preserved across navigation.
- Environment configuration differing between contributors.
- Empty states being confused with service failures.

### 9.6 Acceptance evidence

Record screen acceptance, API contract references, automated tests, integrated workflow evidence, security review outcomes, and approval.

### 9.7 Exit decision

**Current decision:** NOT STARTED.

Do not infer P1 completion from shell rendering or isolated project-screen implementation.

## 10. P2 BUILD & ARTIFACT

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 10.1 Tracking objective

Track the build and Artifact capabilities assigned to P2, using the authoritative phase definition and milestone dossiers to determine the exact scope and acceptance requirements.

### 10.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Backend Lead, Frontend Lead, Database Lead, and Integration Lead |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 10.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| F-M03 | BUILD & ARTIFACT | P2 | NOT STARTED |
| B-M02 | ARTIFACT | P2-P3 | NOT STARTED |
| DB-M01 | FOUNDATION | P0-P3 | NOT STARTED |
| C-M02 | DEVELOPMENT | P1-P3 | NOT STARTED |

### 10.4 Exit-criteria checklist

- [ ] Applicable P2 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] F-M03 BUILD & ARTIFACT acceptance criteria are satisfied.
- [ ] B-M02 ARTIFACT acceptance criteria for P2 are satisfied.
- [ ] Build request and lifecycle behavior are verified.
- [ ] Artifact identity and metadata are available through the defined contracts.
- [ ] Artifact validation and integrity states are authoritative.
- [ ] Required persistence and migration behavior is tested.
- [ ] Failure paths and authorization behavior are verified.
- [ ] Build and Artifact integration tests pass.
- [ ] Evidence and acceptance decision are recorded.

### 10.5 Risks to review

- Ambiguous distinction between build acknowledgement and completion.
- Artifact metadata without reliable provenance.
- Incomplete validation or integrity checks.
- API and database contract mismatches.
- Logs exposing secrets or sensitive data.
- Development artifacts not matching expected integration behavior.

### 10.6 Acceptance evidence

Record API contract versions, build workflow tests, Artifact metadata and integrity evidence, database tests where applicable, and UI integration results.

### 10.7 Exit decision

**Current decision:** NOT STARTED.

A successful build request alone does not establish phase acceptance.

## 11. P3 CONTROL PLANE

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 11.1 Tracking objective

Track the Control Plane capabilities assigned to P3 and the relevant cross-domain dependencies defined by the authoritative phase definition and milestone dossiers.

### 11.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Backend Lead, Database Lead, Cloud Lead, Security Reviewer, and Integration Lead |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 11.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| B-M01 | CONTROL PLANE | P3 | NOT STARTED |
| B-M02 | ARTIFACT | P2-P3 | NOT STARTED |
| B-M03 | PLATFORM | P3 | NOT STARTED |
| DB-M01 | FOUNDATION | P0-P3 | NOT STARTED |
| DB-M02 | CORE DATA | P3 | NOT STARTED |
| C-M02 | DEVELOPMENT | P1-P3 | NOT STARTED |

### 11.4 Exit-criteria checklist

- [ ] Applicable P3 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] B-M01 CONTROL PLANE acceptance criteria are satisfied.
- [ ] B-M02 ARTIFACT acceptance criteria for P3 are satisfied.
- [ ] B-M03 PLATFORM acceptance criteria are satisfied.
- [ ] DB-M02 CORE DATA acceptance criteria are satisfied.
- [ ] Required identity, authorization, and service contracts are verified.
- [ ] Resource and capability data behavior is tested where applicable.
- [ ] Tenant and organization isolation is verified.
- [ ] Database constraints and migrations pass applicable tests.
- [ ] Development deployment and integration checks pass.
- [ ] Cross-domain dependencies are accepted or formally dispositioned.
- [ ] Phase acceptance evidence is recorded.

### 11.5 Risks to review

- Inconsistent authorization across APIs.
- Unclear ownership of resource and capability state.
- Missing persistence constraints or migration tests.
- Incompatible service contracts.
- Insufficient observability for diagnosing integration failures.
- Dependency assumptions not reflected in milestone dossiers.

### 11.6 Acceptance evidence

Record service and API tests, persistence tests, tenant-isolation evidence, development deployment results, and cross-domain acceptance.

### 11.7 Exit decision

**Current decision:** NOT STARTED.

Phase acceptance requires evidence for all applicable P3 scope, not merely the completion of one backend service.

## 12. P4 BOOKING & COMMERCIAL

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 12.1 Tracking objective

Track the booking and commercial capabilities assigned to P4, including applicable resource availability, reservation, quote, credit, cancellation, and related workflows as specified by the authoritative phase definition and milestone dossiers.

### 12.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Backend Lead, Frontend Lead, Database Lead, Cloud Lead, and Integration Lead |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 12.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| F-M04 | BOOKING | P4 | NOT STARTED |
| B-M04 | BOOKING | P4 | NOT STARTED |
| DB-M03 | BOOKING DATA | P4 | NOT STARTED |
| C-M03 | STAGING | P4-P7 | NOT STARTED |

### 12.4 Exit-criteria checklist

- [ ] Applicable P4 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] F-M04 BOOKING acceptance criteria are satisfied.
- [ ] B-M04 BOOKING acceptance criteria are satisfied.
- [ ] DB-M03 BOOKING DATA acceptance criteria are satisfied.
- [ ] Resource eligibility and availability behavior is verified.
- [ ] Quote validity and pricing presentation are verified.
- [ ] Reservation conflicts are handled correctly.
- [ ] Credit reservation and adjustment behavior is tested where applicable.
- [ ] Cancellation outcomes follow authoritative service state.
- [ ] Idempotency and retry behavior are tested for consequential operations.
- [ ] Integrated staging workflow tests pass.
- [ ] Phase acceptance evidence is recorded.

### 12.5 Risks to review

- Conflicting reservations under concurrent requests.
- Quote expiration not enforced consistently.
- Incorrect credit reservation or adjustment.
- Duplicate operations caused by client retries.
- Inconsistent booking state across UI and backend.
- Staging configuration that does not represent intended deployment behavior.

### 12.6 Acceptance evidence

Record API and database transaction tests, concurrency tests, quote and credit behavior, cancellation tests, staging integration results, and acceptance approval.

### 12.7 Exit decision

**Current decision:** NOT STARTED.

A resource appearing available in the UI does not establish a confirmed reservation.

## 13. P5 EXECUTION

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 13.1 Tracking objective

Track the execution capabilities assigned to P5, including eligible submission, Job and Run lifecycle behavior, dispatch, command outcomes, recovery, and persistence requirements defined by the authoritative phase definition and milestone dossiers.

### 13.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Backend Lead, Frontend Lead, Database Lead, Cloud Lead, and Integration Lead |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 13.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| F-M05 | EXECUTION | P5 | NOT STARTED |
| B-M05 | EXECUTION | P5 | NOT STARTED |
| DB-M04 | EXECUTION DATA | P5-P7 | NOT STARTED |
| C-M03 | STAGING | P4-P7 | NOT STARTED |

### 13.4 Exit-criteria checklist

- [ ] Applicable P5 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] F-M05 EXECUTION acceptance criteria are satisfied.
- [ ] B-M05 EXECUTION acceptance criteria are satisfied.
- [ ] DB-M04 EXECUTION DATA acceptance criteria for P5 are satisfied.
- [ ] Execution eligibility and prerequisite checks are verified.
- [ ] Job submission and acknowledgement behavior are verified.
- [ ] Job and Run remain distinct in contracts, persistence, and UI.
- [ ] Dispatch and lifecycle state transitions are tested.
- [ ] Retry, idempotency, and uncertain-outcome handling are verified.
- [ ] Cancellation semantics are tested and documented.
- [ ] Required staging integration tests pass.
- [ ] Phase acceptance evidence is recorded.

### 13.5 Risks to review

- Duplicate Jobs caused by retries.
- Inconsistent Job and Run state.
- Uncertain command outcomes after connection failure.
- Incorrect cancellation assumptions.
- Missing execution events or reconciliation evidence.
- Insufficient observability for diagnosing failed dispatch.
- UI controls exposing unsupported or unauthorized operations.

### 13.6 Acceptance evidence

Record lifecycle tests, dispatch tests, database integrity tests, recovery scenarios, API integration tests, and end-to-end workflow results.

### 13.7 Exit decision

**Current decision:** NOT STARTED.

An accepted submission is not equivalent to a successful Run or a successful Result.

## 14. P6 LAB & ROBOT

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 14.1 Tracking objective

Track the lab and robot capabilities assigned to P6. Use the authoritative phase definition and milestone dossiers to identify the required capabilities, interfaces, validation activities, and acceptance evidence.

This tracker does not authorize physical deployment or substitute for any required human safety review.

### 14.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Engineering Lead, Backend Lead, Cloud Lead, Integration Lead, and designated safety reviewer |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 14.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| B-M06 | RESULTS | P6-P7 | NOT STARTED |
| DB-M04 | EXECUTION DATA | P5-P7 | NOT STARTED |
| C-M03 | STAGING | P4-P7 | NOT STARTED |

The table identifies milestones whose canonical phase mapping includes P6. It does not assert that every listed milestone is exclusively a P6 deliverable.

### 14.4 Exit-criteria checklist

- [ ] Applicable P6 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] Required lab and robot interfaces are identified in the authoritative dossiers.
- [ ] Relevant backend and data contracts are verified.
- [ ] Hardware or robot capability assumptions are documented.
- [ ] Applicable simulation, lab, or integration tests are completed.
- [ ] Failure handling and recovery behavior are verified.
- [ ] Required telemetry and diagnostic evidence is available.
- [ ] Any required human safety review is completed and recorded before the relevant activity.
- [ ] Physical deployment restrictions and approvals are explicit.
- [ ] Cross-domain dependencies are accepted or formally dispositioned.
- [ ] Phase acceptance evidence is recorded.

### 14.5 Risks to review

- Unverified hardware or robot capability assumptions.
- Incomplete interface validation.
- Missing telemetry needed to diagnose failures.
- Lab behavior differing from the simulated environment.
- Unresolved operational or safety review requirements.
- Acceptance claims that exceed the available test environment.

### 14.6 Acceptance evidence

Record relevant simulation and lab reports, interface validation, integration tests, operational diagnostics, safety-review records where applicable, and the formal acceptance decision.

### 14.7 Exit decision

**Current decision:** NOT STARTED.

Software validation does not automatically establish suitability for physical deployment.

## 15. P7 LIVE & RESULTS

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 15.1 Tracking objective

Track the Live and Results capabilities assigned to P7, including live-session behavior, telemetry freshness, Result provenance, file access, metrics, and supported comparisons as defined by the authoritative phase definition and milestone dossiers.

### 15.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Frontend Lead, Backend Lead, Database Lead, Cloud Lead, and Integration Lead |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 15.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| F-M06 | LIVE | P7 | NOT STARTED |
| F-M07 | RESULTS | P7 | NOT STARTED |
| B-M06 | RESULTS | P6-P7 | NOT STARTED |
| DB-M04 | EXECUTION DATA | P5-P7 | NOT STARTED |
| C-M03 | STAGING | P4-P7 | NOT STARTED |

### 15.4 Exit-criteria checklist

- [ ] Applicable P7 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] F-M06 LIVE acceptance criteria are satisfied.
- [ ] F-M07 RESULTS acceptance criteria are satisfied.
- [ ] B-M06 RESULTS acceptance criteria for P7 are satisfied.
- [ ] DB-M04 EXECUTION DATA acceptance criteria for P7 are satisfied.
- [ ] Live connection and reconnection states are verified.
- [ ] Telemetry freshness, timestamps, and units are presented correctly.
- [ ] Stale data is not represented as current.
- [ ] Result provenance and Job/Run associations are verified.
- [ ] File access, metrics, and supported comparisons are tested.
- [ ] Retention and unavailable-content behavior are handled where applicable.
- [ ] Integrated staging tests pass.
- [ ] Phase acceptance evidence is recorded.

### 15.5 Risks to review

- Stale telemetry presented as current.
- Missing signals presented as zero.
- Incorrect association between a Result and its execution record.
- File availability differing from displayed metadata.
- Comparisons between incompatible measurements.
- Reconnection behavior creating duplicate operations.
- Retention rules not reflected in the interface.

### 15.6 Acceptance evidence

Record live-session tests, telemetry freshness tests, Result provenance checks, file-access tests, metric and comparison validation, and integrated workflow results.

### 15.7 Exit decision

**Current decision:** NOT STARTED.

The presence of live data or a Result record alone does not establish complete phase acceptance.

## 16. P8 PRODUCTION

**Canonical reference:** `docs/planning/PHASES.md`.

**Initial status:** NOT STARTED.

### 16.1 Tracking objective

Track production qualification and operational acceptance as defined by the authoritative phase definition and milestone dossiers. This includes the required production deployment, security, observability, recovery, support, and approval evidence applicable to the product.

### 16.2 Ownership and dates

| Field | Initial value |
|---|---|
| Phase owner | TBD |
| Supporting owners | Engineering Lead, Backend Lead, Cloud Lead, Security Reviewer, Database Lead, and Operations Owner |
| Planned start | TBD |
| Planned target | TBD |
| Actual start | TBD |
| Acceptance date | TBD |
| Last reviewed | Pending initial review |

### 16.3 Milestone coverage

| Milestone | Canonical name | Phase mapping | Initial status |
|---|---|---|---|
| B-M07 | PRODUCTION | P8 | NOT STARTED |
| C-M04 | PRODUCTION | P8 | NOT STARTED |

Database, frontend, and other domain acceptance evidence may be required by the production dossiers. Such evidence must be tracked under the existing canonical milestone model rather than by inventing additional milestone identifiers.

### 16.4 Exit-criteria checklist

- [ ] Applicable P8 scope is confirmed against `docs/planning/PHASES.md`.
- [ ] B-M07 PRODUCTION acceptance criteria are satisfied.
- [ ] C-M04 PRODUCTION acceptance criteria are satisfied.
- [ ] Production deployment and rollback procedures are documented and tested.
- [ ] Security requirements and production access controls are reviewed.
- [ ] Secrets and configuration are handled according to approved requirements.
- [ ] Monitoring, logs, metrics, and alerting are operational.
- [ ] Database backup and restoration evidence meets approved requirements.
- [ ] Recovery objectives and incident procedures are documented and validated where required.
- [ ] Capacity and reliability requirements are evaluated against the approved target.
- [ ] Required operational ownership and support procedures are assigned.
- [ ] Open critical defects and risks are resolved or formally dispositioned.
- [ ] Required approvals are recorded before production authorization.
- [ ] Production acceptance evidence is complete.
- [ ] Formal phase closure is approved.

### 16.5 Risks to review

- Unverified deployment or rollback procedures.
- Incomplete security review or excessive access privileges.
- Insufficient monitoring and alerting.
- Backup procedures without successful restoration evidence.
- Unclear incident ownership.
- Unvalidated capacity or recovery assumptions.
- Production acceptance based only on staging results.
- Unapproved exceptions or unresolved critical defects.

### 16.6 Acceptance evidence

Record production deployment results, security review, monitoring verification, recovery tests, operational runbooks, required approvals, and formal acceptance.

### 16.7 Exit decision

**Current decision:** NOT STARTED.

Production deployment and production acceptance are separate decisions. Neither may be inferred from development or staging success.

## 17. Cross-Phase Dependency Tracking

Dependencies must be recorded against the canonical milestone IDs and phase mappings.

| Dependency area | Example evidence to track | Owner |
|---|---|---|
| UI and backend contracts | Reviewed schemas, authorization, errors, and versioning | Frontend Lead and Backend Lead |
| Backend and database | Schema compatibility, transactions, and migration tests | Backend Lead and Database Lead |
| Booking and persistence | Conflict protection, idempotency, and transaction evidence | Backend Lead and Database Lead |
| Execution and persistence | Job, Run, event, and Result integrity | Backend Lead and Database Lead |
| Backend and cloud | Network, configuration, secrets, and deployment verification | Backend Lead and Cloud Lead |
| Live and Results | Connection, freshness, provenance, and access behavior | Backend Lead and Frontend Lead |
| Production and operations | Monitoring, recovery, deployment, and support evidence | Cloud Lead and Operations Owner |

### 17.1 Dependency acceptance

A dependency may be marked accepted when:

- the required interface or capability is available
- the contract or implementation is reviewed
- required tests pass
- known limitations are documented
- the consuming milestone's requirements are met
- acceptance evidence is linked from the tracking record

A provider milestone being `IN PROGRESS` does not imply that all its consumers are blocked. Each dependency must be assessed individually.

## 18. Risk Register Integration

Maintain detailed risks in `docs/tracking/RISK_REGISTER.md`.

For each phase, identify the most significant risks affecting:

- scope and requirements
- staffing and ownership
- API and data contracts
- implementation and test quality
- cross-domain integration
- infrastructure and environment readiness
- security and privacy
- operational recovery
- schedule and critical-path dependencies

Each risk must include:

| Field | Required content |
|---|---|
| Risk ID | Unique identifier |
| Phase | Canonical phase ID |
| Affected milestones | Exact frozen milestone IDs |
| Description | Specific possible adverse outcome |
| Likelihood | Agreed rating |
| Impact | Agreed rating |
| Mitigation | Concrete prevention or reduction action |
| Contingency | Action if the risk occurs |
| Owner | Accountable person or role |
| Review date | Next review |
| Status | Open, mitigating, closed, or accepted |
| Evidence | Supporting assessment or decision |

A risk is not closed solely because its mitigation task is complete. The residual risk must be reassessed.

## 19. Blocker Tracking

A blocker must identify a current condition that prevents progress or acceptance.

Record:

- blocker ID
- affected phase
- affected milestone IDs
- date raised
- specific blocking condition
- owner
- required resolution
- target resolution date
- escalation owner
- current status
- resolution evidence

### 19.1 Blocker escalation rules

- Escalate when the agreed resolution date is missed.
- Escalate immediately when a blocker threatens a critical dependency or approved release condition.
- Record the impact on dependent milestones and phases.
- Update forecasts when a blocker changes the critical path.
- Close the blocker only after the resolution is verified.
- Keep accepted residual risks visible even when they no longer block work.

## 20. Phase Review Procedure

Perform a formal review when a phase is approaching acceptance, when a material dependency changes, or when project leadership requests a status reconciliation.

### Step 1: Verify scope

Read `docs/planning/PHASES.md` and the relevant milestone dossiers.

### Step 2: Reconcile milestone status

Verify every applicable milestone's current status, owner, dependencies, and acceptance evidence.

### Step 3: Reconcile task status

Review task backlogs, implementation records, tests, and open work.

### Step 4: Validate exit criteria

Mark each criterion complete only when evidence supports it. Record exceptions explicitly.

### Step 5: Review risks and blockers

Confirm owners, target dates, mitigations, escalation, and residual exposure.

### Step 6: Calculate progress

Use the agreed criterion weights and evidence-based completion fractions.

### Step 7: Record the decision

Record the status, review date, reviewers, evidence references, unresolved conditions, and next actions.

### Step 8: Synchronize dashboards

Update `docs/tracking/STATUS.md` and other relevant tracking records.

## 21. Phase Review Record Template

Use the following structure for each formal review.

| Field | Value |
|---|---|
| Phase ID and canonical name | Exact frozen identifier and name |
| Review date | `YYYY-MM-DD` |
| Phase owner | Assigned owner |
| Current status | Status vocabulary value |
| Progress | Verified percentage or `Not baselined` |
| Planned target date | Approved target or `TBD` |
| Forecast target date | Evidence-based forecast or `TBD` |
| Milestones reviewed | Applicable canonical milestone IDs |
| Exit criteria passed | Count and evidence |
| Exit criteria remaining | Count and owner |
| Open blockers | Blocker IDs |
| Top risks | Risk IDs |
| Dependency status | Accepted, open, or blocked dependencies |
| Decision | Continue, blocked, accept, or close |
| Reviewers | Names or accountable roles |
| Evidence references | Links to reports, tests, commits, and approvals |
| Next review | Agreed date |

The review record must describe the actual state at the time of review and must not rely on a stale dashboard snapshot.

## 22. Phase Closure Requirements

A phase can be closed only after:

- applicable scope is reconciled with `docs/planning/PHASES.md`
- applicable milestone dossiers are satisfied
- required milestone acceptance decisions are recorded
- exit criteria are satisfied or formally dispositioned
- required integration tests pass
- security and operational requirements are addressed
- critical blockers are resolved
- residual risks are explicitly accepted by the authorized role
- documentation and evidence are current
- the phase owner recommends closure
- the designated approver records the decision

If an exit criterion is `NOT APPLICABLE`, retain the rationale and approval in the evidence record.

Phase closure does not automatically authorize physical robot deployment, external service availability, commercial commitments, or production deployment unless the relevant authorization requirements are separately satisfied.

## 23. Reporting Rules

Executive reporting must be concise, evidence-based, and consistent with the detailed tracker.

For each reporting period, summarize:

- current phase statuses
- milestone changes since the previous review
- verified progress
- completed acceptance gates
- critical-path dependencies
- new or escalated blockers
- changes to material risks
- forecast date changes
- decisions required from leadership
- planned work before the next review

Do not report only a single overall percentage. The summary must preserve the distinction between implementation, integration, acceptance, and completion.

### 23.1 Reporting integrity

- Use canonical phase and milestone identifiers.
- Distinguish forecast dates from approved target dates.
- Do not count the same deliverable multiple times across domains.
- Explain material changes in progress calculations.
- Include blockers that affect schedule or acceptance.
- Identify assumptions behind any estimate.
- Correct inaccurate status claims promptly.

## 24. Initial Tracker Maintenance Checklist

- [ ] Phase names and boundaries match `docs/planning/PHASES.md`.
- [ ] P0 FOUNDATION through P8 PRODUCTION are present.
- [ ] All applicable frontend milestones are listed.
- [ ] All applicable backend milestones are listed.
- [ ] All applicable database milestones are listed.
- [ ] All applicable cloud milestones are listed.
- [ ] Initial statuses are recorded without unsupported completion claims.
- [ ] P0 documentation work is `IN PROGRESS` only where verified.
- [ ] Phase owners and dates are recorded or explicitly marked `TBD`.
- [ ] Progress is evidence-based or marked `Not baselined`.
- [ ] Exit criteria are reviewed against authoritative documents.
- [ ] Risks and blockers are linked to their registers.
- [ ] Milestone dependencies are recorded.
- [ ] Acceptance evidence is traceable.
- [ ] Review cadence and ownership are agreed.
- [ ] Production readiness remains `NOT STARTED` until supported by evidence.
- [ ] No retired phase or milestone names are used.

## 25. Change Control

This tracker may be updated to reflect verified progress, ownership, target dates, forecast dates, blockers, risks, acceptance evidence, and review decisions.

Changes to canonical phase definitions must be made only in `docs/planning/PHASES.md` through the approved governance process.

Changes to milestone scope must be made in the relevant authoritative dossier under `docs/**/milestones/`.

Changes to task-level assignments must be reflected in the applicable task backlog.

For material changes, record:

- change date
- author
- affected phase
- affected milestone IDs
- previous and new values
- rationale
- schedule and dependency impact
- evidence
- reviewer or approver

Do not create alternate phase definitions or substitute milestone names within this tracker.

## 26. Baseline Acceptance

The initial tracker baseline is ready for operational use when:

- the canonical phase inventory is present
- phase owners and dates are assigned or explicitly marked `TBD`
- initial statuses are recorded
- any active P0 documentation work is supported by a task and evidence
- the exit criteria are reconciled with authoritative documents
- milestone mappings match the frozen model
- risk and blocker tracking is established
- progress measurement rules are agreed
- the review procedure is understood
- the first formal status review is scheduled

Baseline readiness does not mean that any phase has been accepted or completed.

## 27. Changelog

### Initial Frozen-Model Baseline

- Initialized the phase tracker for P0 FOUNDATION through P8 PRODUCTION.
- Added phase-level objective summaries, ownership fields, and date fields.
- Added phase progress and status rules.
- Added exit-criteria checklists for all nine phases.
- Added phase-specific risk prompts and evidence requirements.
- Mapped the applicable frontend, backend, database, and cloud milestones using the frozen identifiers and names.
- Established `docs/planning/PHASES.md` as the sole canonical phase definition.
- Preserved the authoritative role of milestone dossiers under `docs/**/milestones/`.
- Added dependency, blocker, risk, review, and closure procedures.
- Established evidence-based progress reporting and phase acceptance requirements.
- Set all milestones to `NOT STARTED` as the initial baseline, subject only to verified P0 FOUNDATION documentation work.

### Future Updates

Future updates must preserve the frozen phase and milestone identifiers, exact names, and phase mappings unless the canonical model is formally changed through project governance.
