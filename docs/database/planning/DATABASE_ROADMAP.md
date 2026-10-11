# Kritva RaaS Database Roadmap

## 1. Purpose

This document defines the database engineering roadmap for Kritva RaaS across the four frozen database milestones.

It establishes the schema delivery sequence, persistence responsibilities, data-integrity requirements, cross-domain dependencies, migration strategy, risks, and milestone acceptance criteria.

The roadmap supports:

- database architecture and schema planning
- entity and relationship definition
- transactional consistency
- schema migration and compatibility
- backend and frontend integration
- data security and tenant isolation
- backup, recovery, retention, and archival
- performance and capacity planning
- milestone acceptance and production readiness

This document describes database sequencing and delivery responsibilities. It does not replace the detailed milestone dossiers, approved data contracts, database migration specifications, security policies, or backend API contracts.

## 2. Canonical References

| Concern | Authoritative source |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| Program implementation sequence | `planning/IMPLEMENTATION_ROADMAP.md` |
| Cross-domain dependencies | `planning/DEPENDENCY_MAP.md` |
| Release sequencing | `planning/RELEASE_ROADMAP.md` |
| Database milestone scope | `docs/database/milestones/` |
| Database task backlog | `docs/database/planning/DATABASE_TASKS.md` |
| Backend roadmap | `docs/backend/planning/BACKEND_ROADMAP.md` |
| Backend task backlog | `docs/backend/planning/BACKEND_TASKS.md` |
| Frontend roadmap | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Cloud roadmap | `docs/cloud/planning/CLOUD_ROADMAP.md` |
| API and protocol contracts | `docs/protocol/` |
| Security requirements | `docs/security/` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |

The existing milestone dossiers under `docs/database/milestones/` are authoritative for the detailed scope of their respective milestones.

The canonical phase model is maintained exclusively in `planning/PHASES.md`. This roadmap references the phase model but does not redefine it.

## 3. Frozen Database Milestone Mapping

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

The mapping is fixed for planning and traceability. Changes to milestone scope must be reviewed against the authoritative milestone dossier and the canonical phase model.

## 4. Database Engineering Principles

### 4.1 Durable State

Database records are authoritative for domain state that must survive service restarts, retries, or deployment changes.

In-memory caches, event streams, and frontend state may improve performance but must not replace durable records where persistence is required.

### 4.2 Contract-Driven Schema Design

Schema design must align with approved domain contracts, including resource identity, relationships, lifecycle states, timestamps, units, authorization boundaries, and versioning.

Database-specific implementation details must not create undocumented API behavior.

### 4.3 Transactional Integrity

Operations that require atomic state changes must use an appropriate transaction or an explicitly designed consistency mechanism.

Constraints, uniqueness rules, foreign keys, and transactional boundaries should enforce invariants wherever feasible.

### 4.4 Tenant Isolation

Organization and project ownership must be represented consistently. Access control must be enforced by backend services and supported by the data model.

Database query patterns must not permit cross-organization access through missing filters, ambiguous ownership, or unvalidated identifiers.

### 4.5 Safe Schema Evolution

Schema changes must support a documented migration path, compatibility analysis, verification, and recovery.

Destructive changes must not be introduced until dependent code and data have safely moved to the new representation.

### 4.6 Traceability and Auditability

Important domain changes must retain enough history or audit evidence to support operational investigation, financial reconciliation, security review, and execution provenance.

### 4.7 Data Minimization

Persist only data required for product behavior, security, audit, reliability, or explicitly approved analysis.

Sensitive data must have defined access, retention, deletion, and backup-handling rules.

## 5. Schema Delivery Sequence

Database delivery follows four frozen milestones.

| Sequence | Milestone | Primary schema responsibility |
|---|---|---|
| 1 | DB-M01 FOUNDATION | Persistence infrastructure, migration conventions, shared identity and ownership foundations |
| 2 | DB-M02 CORE DATA | Project, artifact, platform, and shared control-plane data |
| 3 | DB-M03 BOOKING DATA | Availability, reservations, quotes, and credit-related records |
| 4 | DB-M04 EXECUTION DATA | Jobs, Runs, Results, telemetry metadata, experiments, and execution history |

This sequence establishes the expected delivery order. Schema work may proceed in parallel where contracts and ownership boundaries are stable.

A schema is not accepted merely because its migration applies successfully. Acceptance requires validation of constraints, application compatibility, representative data access, migration recovery, and the associated milestone criteria.

## 6. DB-M01 FOUNDATION

Phase mapping: P0-P3.

Authoritative scope: the DB-M01 FOUNDATION dossier under `docs/database/milestones/`.

### 6.1 Objective

Establish the shared database foundation, including supported database configuration, migration tooling, connection management, schema conventions, common ownership relationships, and operational safety.

### 6.2 Core Deliverables

- database technology and configuration conventions
- environment-specific connection configuration
- schema and naming conventions
- migration tooling and migration history
- shared primary-key and timestamp conventions
- common organization and ownership foundations
- transaction and isolation conventions
- connection pooling and timeout policies
- database health checks
- backup and restore foundations
- schema validation in CI
- migration review and rollback guidance

### 6.3 Expected Schema Responsibilities

The foundation must support later domain schemas without prematurely embedding every domain entity into a shared generic structure.

Shared conventions should define:

- stable primary identifiers
- organization and project ownership references where required
- creation and update timestamps
- explicit lifecycle status representation
- uniqueness and indexing conventions
- migration version and ownership
- audit metadata where applicable
- retention and deletion behavior
- data classification and sensitivity

### 6.4 Dependencies

**Upstream dependencies**

- `C-M01 FOUNDATION`
- approved database technology and deployment constraints
- initial identity and ownership requirements
- documented migration and configuration policy

**Downstream dependencies**

- `DB-M02 CORE DATA`
- `DB-M03 BOOKING DATA`
- `DB-M04 EXECUTION DATA`
- B-M01 CONTROL PLANE
- B-M02 ARTIFACT
- B-M03 PLATFORM
- all services requiring durable state

### 6.5 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Unclear schema ownership | Conflicting migrations and inconsistent domain models | Assign domain and migration ownership |
| Environment drift | Unpredictable deployment behavior | Version configuration and validate environments |
| Unsafe migration tooling | Data loss or blocked deployment | Test migration application and recovery |
| Weak tenant foundations | Cross-organization data exposure | Define ownership relationships and test isolation |
| Unbounded connections | Service instability under load | Configure pooling, limits, and timeouts |
| Incomplete backups | Irrecoverable data loss | Define backup policy and exercise restoration |
| Inconsistent identifiers | Difficult joins and API integration | Establish shared identity conventions |

### 6.6 Exit Criteria

- Database configuration conventions are documented.
- Migration tooling is reproducible and version-controlled.
- Schema naming and identifier conventions are agreed.
- Transaction and connection policies are documented.
- Health and readiness checks are available.
- CI can validate schema and migration changes.
- Backup and restore expectations are documented.
- Ownership and tenant-isolation foundations are tested.
- Initial operational failure scenarios are exercised.
- Downstream milestones can add schemas without changing the foundation contract unexpectedly.

## 7. DB-M02 CORE DATA

Phase mapping: P3.

Authoritative scope: the DB-M02 CORE DATA dossier under `docs/database/milestones/`.

### 7.1 Objective

Deliver the shared domain schemas required by control-plane, artifact, and platform services, with consistent ownership, referential integrity, and query behavior.

### 7.2 Core Data Domains

The detailed milestone dossier determines the exact schema scope. The expected domains include:

- organizations and memberships
- projects and project metadata
- artifact metadata and lifecycle state
- platform identities and versions
- capability metadata
- resource identities and relevant status records
- common audit references
- indexes supporting authorization and resource lookup

### 7.3 Schema Delivery Sequence

The recommended delivery sequence is:

1. Confirm entity ownership and identifier conventions.
2. Define organization and membership relationships.
3. Define project identity, ownership, and metadata.
4. Define artifact metadata and project association.
5. Define platform identity, versioning, and capability relationships.
6. Add indexes for high-frequency access paths.
7. Add constraints for uniqueness and referential integrity.
8. Add migration and rollback validation.
9. Integrate repositories with backend services.
10. Validate representative queries and tenant-isolation behavior.

The sequence may be adjusted by the authoritative dossier, but schema dependencies must remain explicit.

### 7.4 Dependencies

**Upstream dependencies**

- `DB-M01 FOUNDATION`
- B-M01 CONTROL PLANE contracts
- B-M02 ARTIFACT contracts
- B-M03 PLATFORM contracts
- approved organization, project, artifact, and platform schemas

**Downstream dependencies**

- `DB-M03 BOOKING DATA`
- `DB-M04 EXECUTION DATA`
- B-M01 CONTROL PLANE
- B-M02 ARTIFACT
- B-M03 PLATFORM
- B-M04 BOOKING
- B-M05 EXECUTION

### 7.5 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Ambiguous ownership | Incorrect access decisions | Define ownership and membership relationships explicitly |
| Artifact metadata mismatch | Invalid artifact retrieval or execution | Align persisted fields with the artifact manifest contract |
| Platform version drift | Incorrect compatibility evaluation | Store explicit version identity and capability metadata |
| Missing indexes | Slow catalog and project operations | Profile query patterns and validate query plans |
| Migration ordering errors | Deployment failures | Declare schema dependencies and test clean upgrades |
| Uncontrolled deletion | Broken references and audit gaps | Define retention and referential actions per entity |

### 7.6 Exit Criteria

- Core entity schemas match approved contracts.
- Ownership and relationship constraints are enforced.
- Artifact metadata supports validation and retrieval workflows.
- Platform data supports compatibility evaluation.
- Required indexes exist for documented access patterns.
- Migration ordering is deterministic.
- Repository tests cover normal and invalid operations.
- Tenant-isolation tests cover representative queries.
- Schema changes are compatible with the intended service deployment sequence.
- Audit and retention behavior is documented.

## 8. DB-M03 BOOKING DATA

Phase mapping: P4.

Authoritative scope: the DB-M03 BOOKING DATA dossier under `docs/database/milestones/`.

### 8.1 Objective

Provide durable and transactionally consistent persistence for availability, reservations, quotes, credit-related records, and booking lifecycle transitions.

### 8.2 Core Data Domains

The authoritative milestone dossier determines the precise entities. Expected domains include:

- booking and reservation identity
- resource and platform references
- reservation start and end timestamps
- booking lifecycle state
- quote identity, amount, units, and validity
- credit reservation and adjustment references
- idempotency keys for applicable operations
- cancellation and refund status
- booking audit records
- reconciliation metadata where needed

### 8.3 Schema Delivery Sequence

1. Define booking and reservation identity.
2. Define resource references and time-window representation.
3. Define booking lifecycle states and legal transitions.
4. Define uniqueness and overlap-protection strategy.
5. Define quote identity and expiry behavior.
6. Define credit reservation and adjustment records.
7. Define idempotency persistence for state-changing requests.
8. Define cancellation and refund references.
9. Add indexes for availability, booking lookup, and operational reconciliation.
10. Test concurrency, transaction boundaries, and failure recovery.

### 8.4 Transactional Requirements

The data model must support the approved booking consistency rules.

Depending on the chosen database and scheduling model, enforce reservation conflicts using an appropriate combination of:

- transaction isolation
- locking
- uniqueness constraints
- exclusion or equivalent constraints where supported
- serialized resource-window allocation
- durable reservation state
- idempotency records

Do not assume application-level pre-checks alone prevent concurrent conflicting reservations.

Credit-related changes must be auditable and protected against duplicate application. A retry must not silently create another credit reservation or adjustment.

### 8.5 Dependencies

**Upstream dependencies**

- `DB-M01 FOUNDATION`
- `DB-M02 CORE DATA`
- B-M03 PLATFORM
- B-M04 BOOKING contracts
- approved availability, quote, booking, and credit rules

**Downstream dependencies**

- `DB-M04 EXECUTION DATA`
- B-M04 BOOKING
- B-M05 EXECUTION
- frontend F-M04 BOOKING

### 8.6 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Concurrent reservation race | Double booking | Enforce conflict rules transactionally |
| Time-zone ambiguity | Incorrect reservation windows | Store canonical timestamps and define conversion rules |
| Duplicate credit effects | Incorrect balances | Use idempotency and auditable accounting records |
| Quote expiry mismatch | Unexpected reservation terms | Persist validity and revalidate on booking |
| Cancellation inconsistency | Resource remains unavailable or is released incorrectly | Define atomic transitions and reconciliation |
| Missing query indexes | Slow availability searches | Validate plans against representative datasets |
| Partial failure | Booking and credit state diverge | Use transaction boundaries or documented recovery workflows |

### 8.7 Exit Criteria

- Booking and reservation schemas are versioned.
- Time-window semantics are explicit.
- Required uniqueness and integrity constraints are present.
- Booking lifecycle transitions are represented and validated.
- Credit-related records support audit and reconciliation.
- Idempotency records are durable where required.
- Concurrent booking operations are tested.
- Cancellation and refund-state transitions are tested.
- Migrations preserve existing data and are recoverable.
- Backend booking operations can maintain the approved consistency guarantees.

## 9. DB-M04 EXECUTION DATA

Phase mapping: P5-P7.

Authoritative scope: the DB-M04 EXECUTION DATA dossier under `docs/database/milestones/`.

### 9.1 Objective

Provide durable persistence for Jobs, Runs, Results, execution events, telemetry metadata, result-file references, experiments, comparisons, and related lifecycle information.

### 9.2 Core Data Domains

The exact schema scope is governed by the authoritative dossier. Expected domains include:

- Job identity and lifecycle
- Run identity and attempt lifecycle
- Job-to-Run relationships
- artifact and booking references
- dispatch and reconciliation records
- execution event metadata
- Result identity and provenance
- result-file metadata and storage references
- metric definitions and metric values where appropriate
- experiment membership
- comparison metadata
- retention and archival state
- audit and correlation references

### 9.3 Schema Delivery Sequence

1. Define distinct Job and Run entities.
2. Define relationships between Jobs, Runs, artifacts, bookings, and platform resources.
3. Define legal lifecycle states and terminal outcomes.
4. Define dispatch and reconciliation records.
5. Define durable event and correlation metadata where required.
6. Define Result identity and immutable provenance references.
7. Define result-file metadata and storage references.
8. Define metric and experiment schemas.
9. Define comparison and retention metadata.
10. Add indexes for lifecycle queries, execution history, and Result access.
11. Validate transaction and consistency behavior.
12. Test retention, archival, and recovery.

### 9.4 Job and Run Separation

Job and Run must be represented as distinct entities.

A Job records an orchestration request and its lifecycle. A Run records an execution attempt and its outcome.

The schema must preserve:

- stable Job and Run identifiers
- the relationship between a Job and its Runs
- separate lifecycle state
- timestamps for meaningful transitions
- execution attempt history
- references to the approved artifact and applicable booking
- correlation identifiers for dispatch and runtime observations
- durable terminal outcomes

A new Run must not overwrite the outcome of a previous Run. A rerun must preserve historical provenance and create the appropriate new execution records.

### 9.5 Result Integrity and Provenance

Result records must remain associated with the correct Job and Run.

The database design must prevent accidental reassignment of an existing Result to an unrelated execution. Any permitted correction or administrative intervention must be auditable.

Result-file metadata must be reconciled with the associated storage system. The database must not report a file as available when the authoritative storage state shows it is missing or no longer accessible.

### 9.6 Dependencies

**Upstream dependencies**

- `DB-M01 FOUNDATION`
- `DB-M02 CORE DATA`
- `DB-M03 BOOKING DATA`
- B-M02 ARTIFACT
- B-M03 PLATFORM
- B-M04 BOOKING
- B-M05 EXECUTION
- B-M06 RESULTS contracts

**Downstream consumers**

- B-M05 EXECUTION
- B-M06 RESULTS
- frontend F-M05 EXECUTION
- frontend F-M06 LIVE
- frontend F-M07 RESULTS
- operational reporting and reconciliation

### 9.7 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Job and Run conflation | Lost execution history | Maintain distinct tables, identifiers, and state transitions |
| Lost dispatch state | Uncertain execution outcome | Persist dispatch attempts and reconciliation evidence |
| Result provenance corruption | Incorrect analysis and audit history | Enforce immutable references and integrity checks |
| High event volume | Storage and query degradation | Define retention, partitioning, and bounded ingestion strategies |
| Telemetry growth | Capacity and cost pressure | Separate high-volume data strategy from transactional metadata where appropriate |
| File metadata drift | Broken downloads | Reconcile metadata and object storage |
| Incomplete retention rules | Excessive storage or premature deletion | Define retention per data category and validate deletion behavior |
| Long-running migrations | Deployment interruption | Test representative data volumes and use staged migration where needed |

### 9.8 Exit Criteria

- Job and Run entities are separate and durable.
- Lifecycle and transition metadata are documented.
- Dispatch and reconciliation data support recovery.
- Results preserve their execution provenance.
- Result-file metadata supports authorized retrieval and reconciliation.
- Experiment and comparison records preserve Result references.
- Query indexes support expected operational access patterns.
- Retention and archival behavior is defined.
- Migration and recovery tests pass.
- Backend execution and Results services pass integration tests against the schema.

## 10. Cross-Domain Schema Coordination

### 10.1 Backend Integration

| Database milestone | Backend consumers | Coordination requirement |
|---|---|---|
| DB-M01 FOUNDATION | B-M01 CONTROL PLANE and all database-backed services | Shared migration, identifier, ownership, and transaction conventions |
| DB-M02 CORE DATA | B-M01 CONTROL PLANE; B-M02 ARTIFACT; B-M03 PLATFORM | Entity schemas, access patterns, artifact and platform references |
| DB-M03 BOOKING DATA | B-M04 BOOKING | Reservation consistency, quotes, credits, and lifecycle |
| DB-M04 EXECUTION DATA | B-M05 EXECUTION; B-M06 RESULTS | Job/Run lifecycle, dispatch recovery, Results, and provenance |

Backend services must own domain operations and enforce their business rules. Database constraints provide an additional integrity boundary; they do not replace service authorization.

### 10.2 Frontend Integration

Frontend behavior depends on backend APIs, not direct database access.

| Frontend milestone | Database dependency | Expected outcome |
|---|---|---|
| F-M01 STUDIO FOUNDATION | DB-M01 FOUNDATION | Consistent identity-aware service behavior |
| F-M02 PROJECTS | DB-M02 CORE DATA | Durable project and platform metadata |
| F-M03 BUILD & ARTIFACT | DB-M02 CORE DATA | Artifact metadata and validation status |
| F-M04 BOOKING | DB-M03 BOOKING DATA | Booking and credit status |
| F-M05 EXECUTION | DB-M04 EXECUTION DATA | Durable Job and Run state |
| F-M06 LIVE | DB-M04 EXECUTION DATA | Execution correlation and live-state reconciliation |
| F-M07 RESULTS | DB-M04 EXECUTION DATA | Durable Results, files, metrics, and experiments |

### 10.3 Cloud Integration

| Cloud milestone | Database coordination |
|---|---|
| C-M01 FOUNDATION | Database connectivity, network access, and initial configuration |
| C-M02 DEVELOPMENT | Development schema deployment and migration validation |
| C-M03 STAGING | Representative booking, execution, and Results data validation |
| C-M04 PRODUCTION | Backup, recovery, migration controls, capacity, and operational monitoring |

Database credentials must be scoped to required operations. Production database access must not be granted to frontend clients.

## 11. Migration Strategy

### 11.1 Migration Requirements

Every schema change must include:

- a unique migration identifier
- a clear description of the schema change
- affected entities and constraints
- compatibility implications
- expected data volume and locking considerations
- validation queries or automated checks
- recovery or forward-fix guidance
- application deployment dependencies
- review and acceptance evidence

### 11.2 Expand and Contract

For changes requiring compatibility across application versions, use a staged approach:

1. Expand the schema with backward-compatible additions.
2. Deploy code that can use the new schema while preserving compatibility.
3. Backfill existing data where necessary.
4. Validate data completeness and integrity.
5. Switch dependent code to the new representation.
6. Confirm all consumers have moved.
7. Remove obsolete schema elements only after approval.

Destructive schema changes must not precede the migration of dependent code and data.

### 11.3 Migration Testing

Test migrations against:

- an empty database
- the supported previous schema version
- representative existing data
- expected uniqueness and foreign-key conflicts
- interrupted migration conditions where relevant
- the intended application deployment order

A migration that works only against an empty database is insufficient evidence for production readiness.

### 11.4 Rollback and Recovery

A rollback plan must distinguish between reversing a schema change and restoring data.

If a migration performs irreversible data transformation, document a tested recovery or forward-fix strategy. Do not assume that rolling back application code automatically reverses data changes.

## 12. Data Integrity and Transaction Design

### 12.1 Constraints

Use database constraints for invariants such as:

- primary-key uniqueness
- required fields
- valid references
- unique domain identifiers
- valid status representation where practical
- ownership relationships
- idempotency-key uniqueness within the correct scope

### 12.2 Transactions

Document the transaction boundary for operations that change multiple related records.

Examples include:

- booking creation and credit reservation
- Job creation and initial lifecycle state
- Run creation and dispatch metadata
- terminal execution state and Result creation
- retention state changes and deletion metadata

When an operation spans multiple services or storage systems, use an explicit consistency and reconciliation strategy instead of implying that a single database transaction covers every system.

### 12.3 Concurrency

Concurrency-sensitive operations require tests for competing updates, duplicate submissions, stale writes, and transaction retries.

Optimistic locking, row locking, serializable transactions, uniqueness constraints, or other controls should be selected based on the actual invariant and database capabilities.

### 12.4 Audit Records

For security-sensitive or commercially significant changes, record the required actor, action, resource identity, timestamp, and correlation information.

Audit retention must follow the approved policy and must not accidentally preserve data that policy requires to be deleted.

## 13. Performance and Capacity

### 13.1 Query Planning

Identify expected query patterns for each domain before finalizing indexes.

Representative queries include:

- organization and project listing
- artifact lookup and compatibility
- platform catalog and resource status
- booking availability and history
- Job and Run lifecycle lookup
- Result listing and detail
- experiment membership and comparison

Validate indexes with realistic query plans and data distributions.

### 13.2 Connection Management

Define connection limits, pooling, timeouts, retry behavior, and transaction duration. Avoid retry loops that amplify database overload.

### 13.3 High-Volume Data

Telemetry, logs, and other high-volume records may require partitioning, retention tiers, or a separate storage strategy. The decision must preserve the required relationship to execution identity and Result provenance.

### 13.4 Capacity Evidence

Before production acceptance, record:

- representative data volumes
- query latency measurements
- index and storage growth
- connection-pool utilization
- migration duration
- backup size and restore duration
- retention and archival throughput

## 14. Security, Privacy, and Retention

Database security requirements include:

- least-privilege database roles
- protected connection credentials
- encrypted transport where required
- environment separation
- controlled administrative access
- tenant-isolation verification
- audit coverage
- sensitive-field classification
- retention and deletion rules
- backup access controls
- secure handling of exported data

Data retention must be defined by category. Project metadata, artifact metadata, booking records, execution history, telemetry, logs, and result files may have different retention requirements.

Deletion workflows must account for related records, object storage, backups, audit requirements, and legal or contractual obligations. The authoritative policy determines the required outcome.

## 15. Backup, Recovery, and Operational Readiness

### 15.1 Backup Requirements

Define backup frequency, retention, encryption, access controls, and verification. Backup completion alone does not prove recoverability.

### 15.2 Restore Testing

Exercise restoration in a representative environment. Verify record counts, constraints, critical relationships, and service-level data access after restoration.

### 15.3 Recovery Objectives

Agree on recovery time and recovery point objectives with the system owners. The required values must be based on product and operational needs rather than assumed by the database team.

### 15.4 Operational Monitoring

Monitor:

- database availability
- connection saturation
- query latency
- lock waits and deadlocks
- transaction failures
- storage utilization
- replication or recovery status where applicable
- migration failures
- backup and restore outcomes
- retention and archival jobs

Alerts must have clear ownership and actionable response guidance.

## 16. Risk Management

Maintain a risk register linked to the milestone and task responsible for each mitigation.

Each risk record should include:

- risk identifier
- affected milestone
- probability and impact
- early-warning indicator
- mitigation action
- contingency plan
- accountable owner
- target resolution date
- residual risk and acceptance authority

Risks involving tenant isolation, booking consistency, credit integrity, execution provenance, data loss, migration safety, or unrecoverable storage failures must be treated as release-relevant.

A risk is closed only when mitigation evidence is available or an authorized decision explicitly accepts the remaining exposure.

## 17. Milestone Readiness and Acceptance

A database milestone is ready for implementation when:

- [ ] Its authoritative dossier is available.
- [ ] Domain and schema ownership are identified.
- [ ] Upstream contracts are available or tracked as blockers.
- [ ] Entity relationships and lifecycle requirements are understood.
- [ ] Migration and deployment dependencies are identified.
- [ ] Security and retention implications are documented.
- [ ] Acceptance criteria are testable.
- [ ] Representative data and query patterns are known.

A database milestone is accepted when:

- [ ] Required schemas and migrations are implemented.
- [ ] Constraints and indexes are validated.
- [ ] Migration tests pass.
- [ ] Repository and integration tests pass.
- [ ] Concurrency and transaction behavior is verified where applicable.
- [ ] Tenant-isolation tests pass.
- [ ] Retention and deletion behavior is documented and tested where in scope.
- [ ] Operational and recovery requirements are met.
- [ ] Documentation is current.
- [ ] Acceptance evidence is recorded.

## 18. Critical Path and Parallel Work

### 18.1 Critical Schema Dependencies

The main data dependency sequence is:

1. DB-M01 FOUNDATION establishes migration, identifier, and ownership conventions.
2. DB-M02 CORE DATA establishes project, artifact, and platform relationships.
3. DB-M03 BOOKING DATA establishes reservation and credit consistency.
4. DB-M04 EXECUTION DATA establishes execution lifecycle, provenance, and Results persistence.

The exact implementation schedule depends on contract maturity, database platform constraints, service ownership, and migration readiness.

### 18.2 Parallel Work

Parallel work is appropriate when contracts and migration ownership are stable.

Examples include:

- schema tooling and domain-model review
- project schema design and artifact contract design
- platform catalog schema and API contract tests
- booking schema design and availability query analysis
- Job/Run schema design and execution lifecycle tests
- Result metadata design and object-storage integration
- performance analysis and retention policy definition

Parallel work must not create duplicate ownership of the same schema objects or incompatible definitions of shared identifiers.

### 18.3 Integration Gates

Use integration gates before dependent services rely on a schema:

- migration conventions and ownership before domain schema integration
- core entity constraints before dependent API acceptance
- artifact metadata validation before execution eligibility acceptance
- booking and credit constraints before execution reservation checks
- Job and Run relationships before dispatch integration
- Result provenance before Results API acceptance
- retention and recovery validation before production acceptance

## 19. Roadmap Change Control

Changes to this roadmap must preserve the frozen database milestone identifiers and canonical phase mapping.

For every material change, record:

- reason for change
- affected milestone and phase
- affected schema and data contracts
- migration and compatibility impact
- upstream and downstream dependencies
- performance and capacity impact
- security and retention implications
- estimate and schedule impact
- reviewer and decision
- required updates to milestone dossiers and task tracking

Do not redefine phase boundaries in this file. Refer to `planning/PHASES.md`.

Do not duplicate detailed milestone acceptance requirements. Refer to the authoritative dossier under `docs/database/milestones/`.

## 20. Database Roadmap Acceptance Checklist

- [ ] DB-M01 FOUNDATION is represented with phase mapping P0-P3.
- [ ] DB-M02 CORE DATA is represented with phase mapping P3.
- [ ] DB-M03 BOOKING DATA is represented with phase mapping P4.
- [ ] DB-M04 EXECUTION DATA is represented with phase mapping P5-P7.
- [ ] Every milestone includes objectives, schema sequence, dependencies, risks, and exit criteria.
- [ ] Schema delivery order is explicit.
- [ ] Backend and frontend integration dependencies use canonical milestone names.
- [ ] Cloud integration dependencies use canonical milestone names.
- [ ] Migration and compatibility requirements are covered.
- [ ] Transactional integrity and concurrency risks are covered.
- [ ] Tenant isolation and authorization support are covered.
- [ ] Job and Run remain distinct.
- [ ] Result provenance and retention are covered.
- [ ] Backup and recovery are covered.
- [ ] `planning/PHASES.md` remains the canonical phase definition.
- [ ] Existing database milestone dossiers remain authoritative for detailed scope.

## 21. Final Invariants

1. The canonical phase model is defined only in `planning/PHASES.md`.
2. The frozen database milestones are DB-M01 through DB-M04 with the names and mappings specified in this roadmap.
3. The milestone dossiers under `docs/database/milestones/` are authoritative for detailed milestone scope.
4. Database schema delivery follows approved domain contracts.
5. Durable records are authoritative for state that must survive failures.
6. Tenant and ownership boundaries are enforced and tested.
7. Migrations are versioned, reviewed, and recoverable.
8. Booking and credit records preserve transactional consistency.
9. Job and Run are distinct and preserve execution history.
10. Results retain provenance to their originating execution.
11. Retention and deletion behavior is explicit.
12. Performance and capacity claims require representative evidence.
13. Backup and recovery procedures are tested.
14. Security, privacy, integrity, and operational readiness are part of acceptance.
15. No database task changes the frozen phase or milestone model.

## 22. Changelog

### Current Baseline

- Established the consolidated database roadmap for DB-M01 through DB-M04.
- Aligned database milestone names and phase mappings with the frozen canonical model.
- Delegated phase definitions to `planning/PHASES.md`.
- Delegated detailed milestone scope to authoritative database milestone dossiers.
- Defined the expected schema delivery sequence across the four database milestones.
- Added schema dependencies, transaction requirements, risks, and exit criteria.
- Added migration, security, retention, performance, backup, and recovery guidance.
- Added cross-domain coordination with backend, frontend, and cloud work.

### Future Updates

For each approved roadmap update, record:

- date
- affected milestone
- affected phase
- change summary
- schema and migration impact
- dependency impact
- risk impact
- acceptance impact
- review status
