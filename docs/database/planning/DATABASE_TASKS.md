# Kritva RaaS Database Task Backlog

## 1. Purpose

This document defines the consolidated database engineering backlog for Kritva RaaS across the four frozen database milestones.

It translates the database roadmap into actionable tasks with stable task IDs, schema deliverables, explicit dependencies, effort estimates, accountable owner roles, and acceptance references.

The backlog supports:

- database architecture and schema implementation
- migration tooling and schema validation
- core domain persistence
- booking and credit consistency
- execution lifecycle and Result provenance
- performance and query optimization
- security, privacy, and retention
- backup, recovery, and operational qualification
- cross-domain integration and milestone acceptance

This file is the consolidated database task inventory. Detailed implementation instructions and task-specific acceptance criteria should be maintained in task-scoped records.

## 2. Canonical References

| Concern | Authoritative source |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| Program implementation sequence | `planning/IMPLEMENTATION_ROADMAP.md` |
| Cross-domain dependencies | `planning/DEPENDENCY_MAP.md` |
| Release sequencing | `planning/RELEASE_ROADMAP.md` |
| Database sequencing | `docs/database/planning/DATABASE_ROADMAP.md` |
| Database milestone scope | `docs/database/milestones/` |
| Backend roadmap | `docs/backend/planning/BACKEND_ROADMAP.md` |
| Backend task backlog | `docs/backend/planning/BACKEND_TASKS.md` |
| Frontend roadmap | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Frontend task backlog | `docs/frontend/planning/FRONTEND_TASKS.md` |
| Cloud roadmap | `docs/cloud/planning/CLOUD_ROADMAP.md` |
| API and protocol contracts | `docs/protocol/` |
| Security requirements | `docs/security/` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |

The existing milestone dossiers under `docs/database/milestones/` are authoritative for detailed milestone scope. This backlog does not replace those dossiers or redefine their boundaries.

The canonical phase definition is maintained exclusively in `planning/PHASES.md`.

## 3. Frozen Database Milestone Mapping

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

Phase names and boundaries are defined in `planning/PHASES.md`. The table above records the frozen database milestone mapping and is not an alternative phase definition.

## 4. Task ID, Estimate, and Ownership Rules

### 4.1 Task ID Format

Every database task uses this format:

    KR-DB-<phase>-<nnn>

Examples:

- `KR-DB-P0-001`
- `KR-DB-P1-001`
- `KR-DB-P3-001`
- `KR-DB-P4-001`
- `KR-DB-P5-001`
- `KR-DB-P6-001`
- `KR-DB-P7-001`
- `KR-DB-P8-001`

The phase token identifies the canonical phase assigned to the task. It does not change the frozen phase model.

Each task has one primary database milestone assignment. A task may support several service domains, but its accountable milestone must be explicit.

### 4.2 Effort Estimates

Estimates use engineering person-days. One person-day represents approximately eight productive engineering hours.

Estimates include implementation, task-level testing, documentation, and review. They exclude external waiting time, environment provisioning delays, and work owned by other engineering domains unless stated explicitly.

Estimates are planning ranges, not delivery commitments.

### 4.3 Owner Roles

| Role | Responsibility |
|---|---|
| Database Architect | Data architecture, schema ownership, integrity rules |
| Database Engineer | Schema, queries, migrations, and database integration |
| Data Engineer | Transaction design, data consistency, reconciliation |
| Backend Engineer | Repository and service integration |
| Security Engineer | Data access, privacy, and security validation |
| SRE Engineer | Backup, recovery, monitoring, and operational readiness |
| Database Test Engineer | Migration, concurrency, integrity, and recovery tests |
| Integration Engineer | Cross-domain integration and environment validation |
| Database Lead | Task assignment, review, dependencies, acceptance |

Every task must have one accountable owner role.

### 4.4 Dependency Notation

- `None`: no prerequisite task in this backlog.
- `KR-DB-...`: prerequisite database task.
- `BE:<milestone>`: backend milestone dependency.
- `FE:<milestone>`: frontend integration dependency.
- `CLOUD:<milestone>`: cloud milestone dependency.
- `API:<contract>`: required API or data contract.
- `PROTO:<contract>`: required protocol contract.
- `SEC:<requirement>`: security or data-protection requirement.
- `EXT:<dependency>`: external database service, tool, or environment.

Dependencies must be resolved or explicitly accepted as development substitutes before final integration acceptance.

## 5. DB-M01 FOUNDATION

Phase mapping: P0-P3.

Authoritative scope: the DB-M01 FOUNDATION dossier under `docs/database/milestones/`.

### KR-DB-P0-001 — Define Database Architecture and Conventions

- **Description:** Document the selected database technology, supported versions, schema ownership, naming conventions, identifier strategy, timestamp representation, and environment boundaries.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `CLOUD:C-M01 FOUNDATION`; `EXT:Database platform`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Architect
- **Acceptance reference:** DB-M01 dossier; database architecture specification; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Architecture decision, schema conventions, and ownership rules.
- **Acceptance:** Technology and conventions are reviewed; domain ownership and migration responsibilities are explicit.

### KR-DB-P0-002 — Establish Migration Tooling

- **Description:** Configure version-controlled schema migrations, migration history, repeatable local setup, and automated migration validation.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-001`; `CLOUD:C-M01 FOUNDATION`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M01 dossier; migration conventions; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Migration framework, initial baseline, and developer instructions.
- **Acceptance:** A clean database can be initialized reproducibly; migration status is inspectable and failures are visible.

### KR-DB-P0-003 — Define Connection and Transaction Policies

- **Description:** Establish connection pooling, connection limits, query timeouts, transaction duration guidance, and retry behavior for database operations.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-001`; `EXT:Database platform`
- **Estimate:** 2–4 person-days
- **Owner role:** Database Architect
- **Acceptance reference:** DB-M01 dossier; database operations specification; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Connection and transaction policy.
- **Acceptance:** Defaults and limits are documented; overload and connection-failure behavior can be tested.

### KR-DB-P0-004 — Define Shared Identifier and Timestamp Conventions

- **Description:** Define primary identifiers, reference identifiers, canonical timestamp storage, timezone handling, and creation/update metadata conventions.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-001`; `API:Shared resource identity`
- **Estimate:** 2–4 person-days
- **Owner role:** Database Architect
- **Acceptance reference:** DB-M01 dossier; shared data conventions; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Identifier and timestamp conventions.
- **Acceptance:** Backend and database owners agree on types, serialization, precision, and timezone behavior.

### KR-DB-P0-005 — Establish Database CI Validation

- **Description:** Add automated checks for migration ordering, schema validity, clean initialization, and compatibility with the supported previous schema.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-002`; `CLOUD:C-M02 DEVELOPMENT`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Test Engineer
- **Acceptance reference:** DB-M01 dossier; CI validation requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** CI jobs and representative migration tests.
- **Acceptance:** Required checks run automatically and report failures clearly.

### KR-DB-P0-006 — Define Data Ownership and Tenant Isolation

- **Description:** Define organization and project ownership conventions, relationship constraints, query-scope expectations, and data-access boundaries.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-004`; `SEC:Tenant isolation`; `BE:B-M01 CONTROL PLANE`
- **Estimate:** 3–5 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** DB-M01 dossier; security requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Ownership model and tenant-isolation test requirements.
- **Acceptance:** Ownership relationships and negative access cases are documented and testable.

### KR-DB-P0-007 — Implement Database Health Checks

- **Description:** Implement database connectivity and readiness checks appropriate for the service deployment and database platform.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-003`; `CLOUD:C-M02 DEVELOPMENT`
- **Estimate:** 2–3 person-days
- **Owner role:** SRE Engineer
- **Acceptance reference:** DB-M01 dossier; operational health requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Health-check implementation and operational notes.
- **Acceptance:** Database unavailability and readiness failures are detected without exposing credentials or sensitive configuration.

### KR-DB-P0-008 — Define Backup and Restore Baseline

- **Description:** Define backup frequency, retention, encryption, access controls, restore expectations, and restoration verification.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-001`; `CLOUD:C-M02 DEVELOPMENT`
- **Estimate:** 3–5 person-days
- **Owner role:** SRE Engineer
- **Acceptance reference:** DB-M01 dossier; backup and recovery policy; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Backup and restore procedures.
- **Acceptance:** Backup scope and restore verification are documented; a representative restoration procedure is tested.

### KR-DB-P0-009 — Define Schema Review and Change Control

- **Description:** Establish schema review requirements, migration ownership, compatibility analysis, approval records, and deprecation rules.
- **Milestone:** DB-M01 FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-DB-P0-002`; `KR-DB-P0-005`
- **Estimate:** 2–3 person-days
- **Owner role:** Database Lead
- **Acceptance reference:** DB-M01 dossier; schema change policy; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Schema review checklist and change record template.
- **Acceptance:** Every schema change has an accountable owner, review evidence, and a defined deployment sequence.

## 6. DB-M02 CORE DATA

Phase mapping: P3.

Authoritative scope: the DB-M02 CORE DATA dossier under `docs/database/milestones/`.

### KR-DB-P3-010 — Implement Organization and Membership Schema

- **Description:** Create the durable organization and membership records required by the approved identity and authorization model.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P0-006`; `KR-DB-P0-004`; `BE:B-M01 CONTROL PLANE`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M02 dossier; organization data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Schema migration, constraints, and repository tests.
- **Acceptance:** Membership relationships are consistent; duplicate identities and invalid references are rejected.

### KR-DB-P3-011 — Implement Project Schema

- **Description:** Persist project identity, organization ownership, metadata, lifecycle fields, and required timestamps.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P3-010`; `BE:B-M01 CONTROL PLANE`; `API:Project`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M02 dossier; project data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Project schema and repository integration.
- **Acceptance:** Project ownership is enforced; project queries support authorized organization-scoped access.

### KR-DB-P3-012 — Implement Artifact Metadata Schema

- **Description:** Persist artifact identity, project association, version metadata, manifest reference, integrity status, and lifecycle state.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P3-011`; `BE:B-M02 ARTIFACT`; `API:Artifact manifest`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M02 dossier; artifact data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Artifact schema, constraints, and migration tests.
- **Acceptance:** Artifact ownership and identity are stable; required metadata and lifecycle constraints are enforced.

### KR-DB-P3-013 — Implement Platform and Capability Schema

- **Description:** Persist platform identities, versions, capability metadata, and compatibility attributes required by platform catalog operations.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P0-004`; `BE:B-M03 PLATFORM`; `API:Platform catalog`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M02 dossier; platform data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Platform and capability schema.
- **Acceptance:** Platform identity and versioning rules are explicit; duplicate identities and invalid relationships are rejected.

### KR-DB-P3-014 — Implement Resource Identity and Status Schema

- **Description:** Persist authorized resource identities and the resource-state metadata required by platform and scheduling services.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P3-013`; `BE:B-M03 PLATFORM`; `SEC:Resource identity`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M02 dossier; resource data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Resource schema and status repository.
- **Acceptance:** Resource identity is stable; status includes appropriate observation timestamps and explicit state representation.

### KR-DB-P3-015 — Add Core Data Constraints and Indexes

- **Description:** Add primary keys, foreign keys, uniqueness constraints, and indexes supporting organization, project, artifact, platform, and resource access.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P3-010`; `KR-DB-P3-011`; `KR-DB-P3-012`; `KR-DB-P3-013`; `KR-DB-P3-014`
- **Estimate:** 4–7 person-days
- **Owner role:** Database Architect
- **Acceptance reference:** DB-M02 dossier; query and integrity requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Constraint and index migrations.
- **Acceptance:** Required integrity rules are enforced; representative query plans are reviewed.

### KR-DB-P3-016 — Validate Core Data Tenant Isolation

- **Description:** Test organization and project scoping across core entities, including negative cases for invalid or cross-organization references.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P3-010`; `KR-DB-P3-011`; `KR-DB-P3-012`; `KR-DB-P3-014`; `SEC:Tenant isolation`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Test Engineer
- **Acceptance reference:** DB-M02 dossier; tenant-isolation test plan; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Automated ownership and isolation tests.
- **Acceptance:** Cross-organization references and unauthorized data access are rejected by the integrated service and repository path.

### KR-DB-P3-017 — Validate Core Schema Migration Compatibility

- **Description:** Test clean installation, upgrade from the supported previous schema, and application compatibility for core data migrations.
- **Milestone:** DB-M02 CORE DATA
- **Phase:** P3 CONTROL PLANE
- **Dependencies:** `KR-DB-P3-015`; `KR-DB-P3-016`; `KR-DB-P0-005`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Test Engineer
- **Acceptance reference:** DB-M02 dossier; migration compatibility checklist; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Migration compatibility evidence.
- **Acceptance:** Supported upgrade paths preserve required records and constraints; failed migration behavior is documented.

## 7. DB-M03 BOOKING DATA

Phase mapping: P4.

Authoritative scope: the DB-M03 BOOKING DATA dossier under `docs/database/milestones/`.

### KR-DB-P4-018 — Implement Booking and Reservation Schema

- **Description:** Persist booking identity, resource references, reservation windows, lifecycle state, organization ownership, and audit metadata.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P3-014`; `KR-DB-P3-015`; `BE:B-M04 BOOKING`; `API:Booking`
- **Estimate:** 5–7 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M03 dossier; booking data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Booking schema and repository integration.
- **Acceptance:** Required booking fields, ownership relationships, and lifecycle representation are enforced.

### KR-DB-P4-019 — Implement Reservation Conflict Protection

- **Description:** Implement and validate the database-side conflict protection required to prevent incompatible concurrent reservations.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P4-018`; `BE:B-M04 BOOKING`
- **Estimate:** 4–7 person-days
- **Owner role:** Database Architect
- **Acceptance reference:** DB-M03 dossier; reservation consistency requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Conflict-prevention constraints or transaction strategy.
- **Acceptance:** Concurrent booking tests demonstrate that prohibited overlapping reservations cannot both commit.

### KR-DB-P4-020 — Implement Quote Persistence

- **Description:** Persist quote identity, calculation version, applicable units, validity period, and association with the booking workflow.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P4-018`; `BE:B-M04 BOOKING`; `API:Booking quote`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M03 dossier; quote data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Quote schema and expiry tests.
- **Acceptance:** Quote validity is explicit; expired or invalid quotes cannot be treated as current by the booking service.

### KR-DB-P4-021 — Implement Credit Reservation and Adjustment Records

- **Description:** Persist auditable credit reservations, consumption, releases, and adjustments with stable references to the associated booking operations.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P4-018`; `KR-DB-P4-020`; `BE:B-M04 BOOKING`; `SEC:Financial data integrity`
- **Estimate:** 5–8 person-days
- **Owner role:** Data Engineer
- **Acceptance reference:** DB-M03 dossier; credit accounting contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Credit schema and accounting integrity tests.
- **Acceptance:** Duplicate requests cannot silently duplicate credit effects; records support reconciliation.

### KR-DB-P4-022 — Implement Booking Idempotency Records

- **Description:** Persist idempotency keys and operation outcomes for applicable booking and credit-changing requests.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P4-018`; `KR-DB-P4-021`; `BE:B-M04 BOOKING`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M03 dossier; idempotency requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Idempotency schema, uniqueness rules, and retry tests.
- **Acceptance:** Repeated requests with the same scoped idempotency key do not create duplicate business effects.

### KR-DB-P4-023 — Implement Cancellation and Refund State

- **Description:** Persist cancellation decisions, reservation release state, refund or credit-adjustment references, and relevant audit metadata.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P4-018`; `KR-DB-P4-021`; `BE:B-M04 BOOKING`
- **Estimate:** 4–6 person-days
- **Owner role:** Data Engineer
- **Acceptance reference:** DB-M03 dossier; cancellation and refund contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Cancellation persistence and consistency tests.
- **Acceptance:** Cancellation and credit states remain consistent under retries and injected failures.

### KR-DB-P4-024 — Validate Booking Transactions and Migrations

- **Description:** Test transaction boundaries, competing reservations, expired quotes, duplicate requests, cancellation races, and migration compatibility.
- **Milestone:** DB-M03 BOOKING DATA
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-DB-P4-019`; `KR-DB-P4-020`; `KR-DB-P4-021`; `KR-DB-P4-022`; `KR-DB-P4-023`
- **Estimate:** 5–8 person-days
- **Owner role:** Database Test Engineer
- **Acceptance reference:** DB-M03 dossier; booking data test plan; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Concurrency, recovery, and migration test evidence.
- **Acceptance:** Required consistency invariants survive competing operations and supported failure scenarios.

## 8. DB-M04 EXECUTION DATA

Phase mapping: P5-P7.

Authoritative scope: the DB-M04 EXECUTION DATA dossier under `docs/database/milestones/`.

### KR-DB-P5-025 — Implement Job Schema

- **Description:** Persist Job identity, ownership, lifecycle state, artifact and booking references, timestamps, and orchestration metadata.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-DB-P3-012`; `KR-DB-P4-018`; `BE:B-M05 EXECUTION`; `API:Job`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M04 dossier; Job data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Job schema and repository tests.
- **Acceptance:** Job identity and required prerequisite references are durable and constrained.

### KR-DB-P5-026 — Implement Run Schema and Job Relationships

- **Description:** Persist Run identity, execution-attempt lifecycle, Job relationship, runtime correlation identifiers, and terminal outcome metadata.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-DB-P5-025`; `BE:B-M05 EXECUTION`; `API:Run`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M04 dossier; Run data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Run schema, foreign-key constraints, and lifecycle tests.
- **Acceptance:** Multiple Runs can be associated with one Job where permitted; each Run retains its own state and history.

### KR-DB-P5-027 — Implement Dispatch and Reconciliation Records

- **Description:** Persist dispatch attempts, correlation identifiers, retry metadata, and reconciliation evidence required to recover uncertain execution outcomes.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-DB-P5-025`; `KR-DB-P5-026`; `BE:B-M05 EXECUTION`
- **Estimate:** 4–7 person-days
- **Owner role:** Data Engineer
- **Acceptance reference:** DB-M04 dossier; execution recovery requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Dispatch and reconciliation schema.
- **Acceptance:** Recovery workflows can distinguish known outcomes from ambiguous outcomes without creating duplicate attempts.

### KR-DB-P5-028 — Implement Execution Event Metadata

- **Description:** Persist the event metadata needed for reliable state reconciliation, audit, and correlation according to the approved event architecture.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-DB-P5-025`; `KR-DB-P5-026`; `API:Execution events`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M04 dossier; event data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Event metadata schema and consistency tests.
- **Acceptance:** Required event identifiers and ordering or version information are retained according to contract requirements.

### KR-DB-P6-029 — Implement Result Schema and Provenance

- **Description:** Persist Result identity, Job and Run references, outcome metadata, creation time, and provenance information.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P6 LAB & ROBOT
- **Dependencies:** `KR-DB-P5-026`; `BE:B-M06 RESULTS`; `API:Result`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M04 dossier; Result data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Result schema and provenance constraints.
- **Acceptance:** Each Result references the correct execution records; existing Result provenance cannot be silently reassigned.

### KR-DB-P6-030 — Implement Result File Metadata

- **Description:** Persist result-file identity, storage reference, content type, size, integrity metadata, availability state, and retention information.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P6 LAB & ROBOT
- **Dependencies:** `KR-DB-P6-029`; `CLOUD:C-M03 STAGING`; `SEC:Result file access`
- **Estimate:** 4–6 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M04 dossier; result-file contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Result-file schema and storage reconciliation tests.
- **Acceptance:** Metadata distinguishes available, missing, archived, and deleted content according to the approved lifecycle.

### KR-DB-P6-031 — Implement Metrics and Experiment Schema

- **Description:** Persist supported metric definitions and values, experiment metadata, and experiment-to-Result relationships.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P6 LAB & ROBOT
- **Dependencies:** `KR-DB-P6-029`; `BE:B-M06 RESULTS`; `API:Metrics`; `API:Experiment`
- **Estimate:** 5–8 person-days
- **Owner role:** Data Engineer
- **Acceptance reference:** DB-M04 dossier; metrics and experiment contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Metrics and experiment schema.
- **Acceptance:** Metric type and unit metadata are explicit; experiment membership preserves Result provenance.

### KR-DB-P7-032 — Implement Comparison Metadata

- **Description:** Persist comparison identity, selected Results, metric alignment information, compatibility outcomes, and creation metadata.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-DB-P6-029`; `KR-DB-P6-031`; `BE:B-M06 RESULTS`; `API:Comparison`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Engineer
- **Acceptance reference:** DB-M04 dossier; comparison data contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Comparison schema and relationship tests.
- **Acceptance:** Comparison records preserve selected Result identities and do not imply incompatible metrics are equivalent.

### KR-DB-P7-033 — Implement Retention and Archival Metadata

- **Description:** Persist retention policy references, archival status, deletion eligibility, and the audit information required to reconcile data lifecycle actions.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-DB-P6-029`; `KR-DB-P6-030`; `SEC:Data retention`
- **Estimate:** 4–6 person-days
- **Owner role:** Data Engineer
- **Acceptance reference:** DB-M04 dossier; retention policy; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Retention metadata and lifecycle tests.
- **Acceptance:** Retention and archival states are explicit; lifecycle operations are auditable and consistent with storage behavior.

### KR-DB-P7-034 — Add Execution Query Indexes

- **Description:** Optimize documented access patterns for Job history, Run lookup, Result listing, file metadata, experiment membership, and retention operations.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-DB-P5-025`; `KR-DB-P5-026`; `KR-DB-P6-029`; `KR-DB-P6-031`
- **Estimate:** 3–6 person-days
- **Owner role:** Database Architect
- **Acceptance reference:** DB-M04 dossier; query performance requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Index migrations and query-plan evidence.
- **Acceptance:** Representative query plans meet agreed performance expectations without excessive index overhead.

### KR-DB-P7-035 — Validate Execution Data Integrity and Recovery

- **Description:** Test Job/Run separation, Result provenance, event reconciliation, storage metadata consistency, retention, and migration recovery.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-DB-P5-027`; `KR-DB-P5-028`; `KR-DB-P6-029`; `KR-DB-P6-030`; `KR-DB-P6-031`; `KR-DB-P7-033`
- **Estimate:** 5–8 person-days
- **Owner role:** Database Test Engineer
- **Acceptance reference:** DB-M04 dossier; execution data test plan; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Integrity, reconciliation, and recovery test evidence.
- **Acceptance:** Required invariants hold after supported failures and retries; historical execution records remain intact.

## 9. Cross-Milestone Database Tasks

### KR-DB-P8-036 — Validate Production Migration Compatibility

- **Description:** Validate database migration order and compatibility with production deployment and supported application versions.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-DB-P0-005`; `KR-DB-P3-017`; `KR-DB-P4-024`; `KR-DB-P7-035`; `CLOUD:C-M04 PRODUCTION`
- **Estimate:** 4–7 person-days
- **Owner role:** Database Test Engineer
- **Acceptance reference:** DB-M01 and DB-M04 dossiers; release roadmap; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Production migration qualification report.
- **Acceptance:** Supported upgrade paths are tested against representative data; unresolved migration risks block production acceptance.

### KR-DB-P8-037 — Validate Backup Restoration and Recovery Objectives

- **Description:** Exercise backup restoration, validate critical relationships, and measure recovery against approved recovery time and recovery point objectives.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-DB-P0-008`; `KR-DB-P7-035`; `CLOUD:C-M04 PRODUCTION`
- **Estimate:** 4–7 person-days
- **Owner role:** SRE Engineer
- **Acceptance reference:** DB-M01 and DB-M04 dossiers; recovery plan; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Restoration exercise report and corrective actions.
- **Acceptance:** Restoration is verified against the agreed objectives; deviations are recorded and explicitly dispositioned.

### KR-DB-P8-038 — Validate Database Security and Privacy

- **Description:** Review database access roles, tenant isolation, sensitive data handling, audit coverage, retention, and backup access controls.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-DB-P0-006`; `KR-DB-P3-016`; `KR-DB-P4-024`; `KR-DB-P7-035`; `SEC:Database security`
- **Estimate:** 4–7 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** DB-M01 through DB-M04 dossiers; security requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Database security assessment and remediation evidence.
- **Acceptance:** Blocking findings are resolved; residual risks have explicit owners and approved dispositions.

### KR-DB-P8-039 — Complete Database Operational Acceptance

- **Description:** Consolidate schema, migration, performance, backup, recovery, security, and operational evidence for database release acceptance.
- **Milestone:** DB-M04 EXECUTION DATA
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-DB-P8-036`; `KR-DB-P8-037`; `KR-DB-P8-038`
- **Estimate:** 3–5 person-days
- **Owner role:** Database Lead
- **Acceptance reference:** Database roadmap; release roadmap; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Database operational acceptance record.
- **Acceptance:** Required evidence is complete; blockers are resolved or explicitly prevent acceptance; residual risks are documented.

## 10. Task Summary

| Milestone | Task range | Task count | Primary outcome |
|---|---|---:|---|
| DB-M01 FOUNDATION | KR-DB-P0-001 to KR-DB-P0-009 | 9 | Database conventions, migrations, ownership, and operational foundations |
| DB-M02 CORE DATA | KR-DB-P3-010 to KR-DB-P3-017 | 8 | Organization, project, artifact, platform, and resource schemas |
| DB-M03 BOOKING DATA | KR-DB-P4-018 to KR-DB-P4-024 | 7 | Booking, reservation, quote, credit, and consistency schemas |
| DB-M04 EXECUTION DATA | KR-DB-P5-025 to KR-DB-P7-035 | 11 | Job, Run, Result, files, metrics, experiments, and retention |
| Cross-milestone production qualification | KR-DB-P8-036 to KR-DB-P8-039 | 4 | Migration, recovery, security, and operational acceptance |
| **Total** | **KR-DB-P0-001 to KR-DB-P8-039** | **39** | **Database delivery and production qualification** |

The task count describes the inventory in this document. It is not a completion or acceptance count.

## 11. Effort Summary

Estimates are expressed in engineering person-days.

| Milestone or group | Low estimate | High estimate |
|---|---:|---:|
| DB-M01 FOUNDATION | 23 | 39 |
| DB-M02 CORE DATA | 27 | 42 |
| DB-M03 BOOKING DATA | 29 | 46 |
| DB-M04 EXECUTION DATA | 39 | 62 |
| Cross-milestone production qualification | 11 | 19 |
| **Total estimated effort** | **129** | **208** |

The totals are planning estimates and must be recalculated if schema scope, database technology, deployment requirements, or migration complexity changes.

They exclude backend, frontend, cloud-platform, external vendor, and general program management effort not explicitly represented by database tasks.

## 12. Definition of Ready

A database task is ready for implementation when:

- [ ] The task ID is stable and unique.
- [ ] The milestone and phase match the frozen model.
- [ ] The authoritative milestone dossier has been reviewed.
- [ ] Schema ownership is explicit.
- [ ] Required domain and API contracts are available or tracked as blockers.
- [ ] Migration dependencies are identified.
- [ ] Transaction and integrity requirements are understood.
- [ ] Security, privacy, and retention implications are reviewed.
- [ ] Acceptance criteria are testable.
- [ ] An accountable owner role is assigned.
- [ ] Estimate and deliverables are recorded.

## 13. Definition of Done

A database task is done when:

- [ ] The schema or operational change matches the accepted scope.
- [ ] Migration tests pass.
- [ ] Required constraints and indexes are validated.
- [ ] Repository and integration tests pass.
- [ ] Transaction and concurrency behavior is tested where applicable.
- [ ] Tenant-isolation requirements are satisfied.
- [ ] Migration compatibility is verified.
- [ ] Recovery and retention behavior is tested where applicable.
- [ ] Security and privacy expectations are satisfied.
- [ ] Code and schema reviews are complete.
- [ ] Documentation is current.
- [ ] Acceptance evidence is recorded.
- [ ] The task status is updated in the tracking system.

## 14. Backlog Maintenance

The Database Lead maintains this task inventory and coordinates changes with the owners of affected milestone dossiers.

New tasks must:

1. Use the `KR-DB-<phase>-<nnn>` format.
2. Use an unused task ID.
3. Name one frozen database milestone.
4. Use a canonical phase token.
5. Include explicit dependencies and estimates.
6. Identify one accountable owner role.
7. Reference testable acceptance criteria.
8. Identify affected schemas, migrations, and service contracts.

Task-specific execution records belong in task-scoped directories, for example:

    docs/tasks/<TASK-ID>/TASK.md
    docs/tasks/<TASK-ID>/ACCEPTANCE_CRITERIA.md

Avoid duplicate acceptance files for the same task.

## 15. Backlog Acceptance Checklist

- [ ] DB-M01 FOUNDATION tasks are represented.
- [ ] DB-M02 CORE DATA tasks are represented.
- [ ] DB-M03 BOOKING DATA tasks are represented.
- [ ] DB-M04 EXECUTION DATA tasks are represented.
- [ ] Every task has a stable ID, title, and description.
- [ ] Every task has a milestone and phase.
- [ ] Every task lists dependencies.
- [ ] Every task has an estimate and owner role.
- [ ] Every task has an acceptance reference.
- [ ] Schema delivery sequence is explicit.
- [ ] Migration and compatibility requirements are covered.
- [ ] Tenant isolation and data integrity are covered.
- [ ] Booking and credit consistency are covered.
- [ ] Job and Run remain separate.
- [ ] Result provenance and retention are covered.
- [ ] Backup, restoration, and operational acceptance are covered.
- [ ] Backend and cloud dependencies use canonical milestone names.
- [ ] `planning/PHASES.md` remains the canonical phase definition.
- [ ] Existing database milestone dossiers remain authoritative for milestone scope.

## 16. Final Invariants

1. This file is the consolidated database task inventory.
2. `planning/PHASES.md` is the sole canonical phase definition.
3. The milestone dossiers under `docs/database/milestones/` govern detailed milestone scope.
4. Task IDs follow `KR-DB-<phase>-<nnn>`.
5. Every task has a title, description, milestone, phase, dependencies, estimate, owner role, and acceptance reference.
6. Schema changes are versioned and reviewed.
7. Database constraints support required domain invariants.
8. Tenant and ownership boundaries are explicit and tested.
9. Booking and credit operations preserve consistency under concurrency and retry.
10. Job and Run remain distinct entities.
11. Result provenance is preserved.
12. Retention and deletion behavior is explicit.
13. Backup and recovery procedures are tested.
14. Security, privacy, and operational readiness are part of acceptance.
15. No task changes the frozen phase or milestone model.

## 17. Changelog

### Current Baseline

- Established a consolidated database task backlog.
- Organized tasks under DB-M01 through DB-M04.
- Aligned phase tokens with the frozen canonical model.
- Added schema delivery sequencing and explicit migration dependencies.
- Added task IDs, estimates, owner roles, and acceptance references.
- Added booking, credit, Job/Run, Result, and retention integrity tasks.
- Added cross-milestone production qualification tasks.
- Delegated phase definitions to `planning/PHASES.md`.
- Delegated detailed milestone scope to authoritative database milestone dossiers.

### Future Updates

For each approved change, record:

- date
- affected task ID
- affected milestone and phase
- change summary
- schema and migration impact
- dependency impact
- estimate impact
- acceptance impact
- review status
