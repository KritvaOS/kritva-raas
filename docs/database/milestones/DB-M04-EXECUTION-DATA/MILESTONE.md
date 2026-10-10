# DB-M04 EXECUTION DATA — Milestone Dossier

**Primary Phase:** P5 EXECUTION

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION

**Domain:** Database

**Milestone:** DB-M04 EXECUTION DATA (P5-P7)

**Document Type:** Database milestone dossier

**Status:** Planning baseline

**Scope Authority:** This dossier defines persistence for jobs, execution runs, telemetry and log metadata, and results. Existing milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the milestone-level objectives, scope boundaries, dependencies, deliverables, risks, and exit criteria for DB-M04 EXECUTION DATA.

DB-M04 EXECUTION DATA defines the database persistence model used to track work from job creation through execution runs, record telemetry and log metadata, and preserve results and their provenance.

Its scope covers:

- Job records and job lifecycle metadata.
- Execution-run records and run lifecycle metadata.
- Relationships between jobs, runs, projects, organizations, users, artifacts, and bookings where applicable.
- Execution attempt identity, sequencing, and retry metadata.
- Job and run status history where required.
- Correlation identifiers and traceability metadata.
- Telemetry stream and series metadata.
- Telemetry sample storage metadata and references where required.
- Log stream metadata, log segment metadata, and retrieval references.
- Result records, result types, provenance, and status.
- References to result artifacts and associated storage metadata.
- Execution summaries and outcome metadata.
- Durable relationships between runs, logs, telemetry, and results.
- Referential integrity, uniqueness constraints, and query-supporting indexes for DB-M04-owned entities.
- Tenant-scoped access-control integration for jobs, runs, telemetry metadata, logs, and results.
- Audit integration using the foundation established by DB-M01 FOUNDATION (P0-P3).
- Migration and schema verification for DB-M04-owned tables.
- Retention and lifecycle metadata required by the approved data contract.
- Consistency requirements for status changes, result publication, and metadata references.
- Handoffs to backend execution, lab, live, results, and production owners.

This dossier defines persistence requirements and data-integrity boundaries. It does not define runtime scheduling algorithms, execution orchestration, robot control, telemetry transport, log collection, result computation, or production infrastructure operations.

### What this document does not own

The following responsibilities remain with their authoritative documents and milestones:

- Canonical phase definitions: `docs/planning/PHASES.md`.
- Cross-domain architectural decisions: `docs/planning/DECISIONS.md`.
- System architecture: `docs/architecture/`.
- PostgreSQL foundation, migration tooling, identity/organization/project schema, foundational RLS, and audit schema: DB-M01 FOUNDATION (P0-P3).
- Platform, resource, artifact, and storage metadata: DB-M02 CORE DATA (P3).
- Bookings, availability, credits, ledger, plans, and invoices: DB-M03 BOOKING DATA (P4).
- Job submission, execution orchestration, and run control: B-M05 EXECUTION (P5).
- Lab Agent behavior and physical robot integration: P6 LAB & ROBOT and the applicable backend implementation owners.
- Live video and telemetry presentation: F-M06 LIVE (P7).
- Results presentation and user-facing result workflows: F-M07 RESULTS (P7).
- Results service behavior and result APIs: B-M06 RESULTS (P6-P7).
- Runtime execution dispatch and worker orchestration: B-M05 EXECUTION (P5).
- Platform and resource registration behavior: B-M03 PLATFORM (P3).
- Artifact creation and build behavior: B-M02 ARTIFACT (P2-P3) and F-M03 BUILD & ARTIFACT (P2).
- Booking authorization and commercial behavior: B-M04 BOOKING (P4).
- Application authentication and global authorization policy: P3 CONTROL PLANE and the security domain.
- Telemetry acquisition, transport, buffering, and real-time processing: the applicable execution, lab, and live service owners.
- Log generation, shipping, indexing execution, and search service behavior: the applicable backend and infrastructure owners.
- Result computation, validation algorithms, and domain-specific interpretation: the applicable backend execution and results owners.
- Object storage provisioning, retention infrastructure, and cloud resource configuration: the cloud domain.
- Production monitoring, backups, recovery, capacity, and operational access: P8 PRODUCTION and the applicable operational documents.
- Global testing policy: `docs/development/TESTING_STRATEGY.md`.
- Global release and deployment policy: `docs/development/RELEASE_PROCESS.md`.

### Ownership map

| Concern | Authoritative owner | DB-M04 EXECUTION DATA responsibility |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Follow the frozen model exactly |
| System architecture | `docs/architecture/` | Follow approved system boundaries |
| Cross-domain decisions | `docs/planning/DECISIONS.md` | Consume approved decisions |
| PostgreSQL and migration foundation | DB-M01 FOUNDATION (P0-P3) | Reuse established conventions |
| Identity, organization, and project schema | DB-M01 FOUNDATION (P0-P3) | Reference foundational entities |
| Platform and resource metadata | DB-M02 CORE DATA (P3) | Reference canonical platform and resource identifiers |
| Artifact and storage metadata | DB-M02 CORE DATA (P3) | Reference artifacts and storage metadata |
| Booking and commercial records | DB-M03 BOOKING DATA (P4) | Reference bookings and commercial context where applicable |
| Job persistence | DB-M04 EXECUTION DATA (P5-P7) | Own job records and lifecycle metadata |
| Run persistence | DB-M04 EXECUTION DATA (P5-P7) | Own run identity, status, attempts, and provenance |
| Telemetry metadata | DB-M04 EXECUTION DATA (P5-P7) | Own stream and series metadata and required references |
| Log metadata | DB-M04 EXECUTION DATA (P5-P7) | Own log stream and segment metadata |
| Results persistence | DB-M04 EXECUTION DATA (P5-P7) | Own result records, provenance, and artifact references |
| Execution orchestration | B-M05 EXECUTION (P5) | Supply persistence structures and integrity constraints |
| Lab and robot integration | P6 LAB & ROBOT and applicable backend owners | Supply durable run and result references |
| Results service behavior | B-M06 RESULTS (P6-P7) | Supply result persistence and query-supporting structures |
| Live presentation | F-M06 LIVE (P7) | Supply telemetry and log metadata through approved contracts |
| Results presentation | F-M07 RESULTS (P7) | Supply result records through approved contracts |
| Cloud infrastructure | Cloud domain | Define database requirements and environment assumptions |
| Production operations | P8 PRODUCTION and operational owners | Hand off operational data requirements |
| DB-M04 tasks | `TASKS.md` | Link to task decomposition |
| DB-M04 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to pass/fail requirements |
| DB-M04 review | `REVIEW_CHECKLIST.md` | Link to review actions |
| DB-M04 change history | `CHANGELOG.md` | Link to accepted changes |
| DB-M04 Git procedure | `GIT_COMMIT_STEP.md` | Link to repository and commit procedure |

### Sibling document ownership

The following files are maintained alongside this dossier:

- [`TASKS.md`](TASKS.md) — task decomposition, sequencing, dependencies, and task ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed pass/fail conditions and evidence requirements.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — review actions and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — accepted changes and milestone history.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This dossier defines the milestone contract. It does not duplicate task-level instructions, detailed acceptance matrices, review execution records, change history, or commit procedures.

---

## 1. Objective

DB-M04 EXECUTION DATA establishes a consistent, traceable, and access-controlled persistence model for execution jobs, execution runs, telemetry and log metadata, and results across P5 EXECUTION, P6 LAB & ROBOT, and P7 LIVE & RESULTS.

It builds on the PostgreSQL, migration, identity, organization, project, RLS, and audit foundations established by DB-M01 FOUNDATION (P0-P3). It reuses platform, resource, artifact, and storage metadata established by DB-M02 CORE DATA (P3), and booking and commercial references established by DB-M03 BOOKING DATA (P4).

The milestone must make execution history durable and queryable without taking ownership of the runtime services that create, schedule, execute, observe, or interpret that history.

### 1.1 Primary outcomes

DB-M04 EXECUTION DATA must deliver:

1. A canonical relational representation of jobs.
2. Stable execution-run identities and job-to-run relationships.
3. Explicit ownership and tenant scope for execution records.
4. Durable lifecycle metadata for jobs and runs.
5. Retry and attempt metadata that distinguishes separate execution attempts.
6. Status history and correlation metadata where required.
7. References to the booking, project, artifact, platform, and resource context relevant to a run.
8. Telemetry stream and series metadata that supports discovery and association with runs.
9. Log stream and segment metadata that supports discovery and retrieval.
10. Result records with stable identities, type, status, and provenance.
11. References to artifacts and storage locations using the authoritative storage model.
12. Integrity constraints that prevent invalid or ambiguous relationships.
13. RLS integration for tenant-scoped execution and results data.
14. Audit integration for relevant execution-data lifecycle changes.
15. Ordered migrations and repeatable schema verification.
16. Automated tests for integrity, access control, lifecycle persistence, and metadata relationships.
17. Stable cross-service references for execution, lab, live, and results workflows.
18. Clear ownership boundaries between durable metadata and transient runtime data.

### 1.2 Job persistence outcome

A job represents a durable unit of work submitted for execution or processing.

The schema must distinguish job identity from individual execution attempts. A job may have one or more runs when the accepted execution contract permits retries or repeated attempts.

Job records must support reliable lifecycle inspection, ownership validation, correlation, and downstream association without embedding runtime process state or large unstructured payloads in relational rows.

### 1.3 Run persistence outcome

A run represents a specific execution attempt or execution instance associated with a job.

The schema must provide stable run identity, clear relationship to the parent job, lifecycle state, attempt metadata, timestamps, and applicable execution context.

The model must preserve the distinction between a job's overall status and the status of any individual run. A retry must not silently overwrite the history of a prior attempt.

### 1.4 Telemetry and log metadata outcome

Telemetry and log metadata must associate observed data with the relevant run, job, resource, and time window where applicable.

The relational schema must provide durable discovery and provenance metadata while allowing the underlying high-volume data to use a suitable storage or streaming system.

DB-M04 does not require every telemetry sample or log line to be stored directly in relational tables. The approved architecture determines the physical data path and storage implementation.

### 1.5 Results persistence outcome

Results must be stored as durable records with stable identities, explicit relationships to jobs or runs, defined status, and traceable provenance.

Large result payloads and files should be referenced through the artifact and storage model established by DB-M02 CORE DATA (P3), rather than duplicated in relational tables without a documented need.

The result model must distinguish a result record from the execution process that produced it and from the frontend view that presents it.

### 1.6 Security and audit outcome

Tenant-scoped execution records, telemetry metadata, logs, and results must follow the RLS and audit conventions established by DB-M01 FOUNDATION (P0-P3).

Access must remain consistent across parent records and related metadata. A user authorized to view one job must not automatically gain access to unrelated jobs, runs, logs, telemetry, or results.

Relevant lifecycle changes must be traceable under the approved audit policy. The database provides required relationships and persistence structures; backend services own application-level event emission and lifecycle orchestration.

### 1.7 Completion principle

DB-M04 EXECUTION DATA is complete when the owned schema is implemented through the approved migration workflow, its integrity and security rules are verified, and representative execution, telemetry, log, and result records can be persisted and retrieved using stable relationships.

Acceptance requires evidence that retries preserve attempt history, metadata references remain valid, tenant boundaries hold, and failed transactions do not leave inconsistent state.

Detailed pass/fail conditions belong in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

#### 2.1.1 Extension of the database foundation

DB-M04 must extend DB-M01 FOUNDATION (P0-P3) using its established conventions for:

- Identifiers and primary keys.
- Timestamp and time-zone semantics.
- Foreign keys and relational integrity.
- Migration tooling and migration history.
- Database roles and privileges.
- RLS and tenant context.
- Audit persistence.
- Schema verification and database testing.

It must reuse the canonical organization, identity, project, and ownership structures rather than introducing competing representations.

#### 2.1.2 Reuse of core metadata

DB-M04 must reference platform, resource, artifact, and storage metadata established by DB-M02 CORE DATA (P3).

The model must not create duplicate platform, resource, artifact, or storage identities merely to simplify execution queries.

Where execution requires a historical snapshot of mutable metadata, the snapshot must be explicit and justified. Stable references should be preferred when they preserve the required historical meaning.

#### 2.1.3 Booking references

Where a job or run is associated with a reservation, the schema must reference the booking identity established by DB-M03 BOOKING DATA (P4).

The booking relationship must not duplicate the booking lifecycle or commercial records.

The execution data model must define whether a booking reference is required, optional, or prohibited for each accepted job type.

Execution authorization and booking eligibility remain with B-M04 BOOKING (P4) and B-M05 EXECUTION (P5).

#### 2.1.4 Job identity

Each job must have a stable identifier independent of mutable labels, descriptions, or client-provided display names.

The schema must define:

- Job identifier type.
- Owning organization or tenant.
- Requesting identity or principal reference where required.
- Project reference where applicable.
- Job type or category.
- Job lifecycle status.
- Creation and update timestamps.
- Submission or acceptance timestamp where applicable.
- Correlation and idempotency references where required.
- Optional booking, artifact, platform, and resource references.
- Required uniqueness constraints.

The accepted contract must define which fields are mandatory for each supported job category.

#### 2.1.5 Job ownership and tenancy

Every tenant-scoped job must have an explicit ownership relationship.

The schema must reuse the organization and identity structures established by DB-M01 FOUNDATION (P0-P3).

A job must not rely solely on a caller-supplied organization label or an unvalidated project reference.

Where a job belongs to a project, the model must preserve the approved project ownership relationship.

RLS must protect the job and its dependent metadata consistently.

#### 2.1.6 Job type and configuration references

The schema must identify the job type and any stable references needed to interpret its accepted configuration.

Large or mutable configuration payloads should not be copied into arbitrary columns without an agreed schema and retention contract.

Where a configuration snapshot is required for reproducibility, its format, provenance, and relationship to the job or run must be explicit.

Runtime parsing and validation of execution configuration belong to B-M05 EXECUTION (P5).

#### 2.1.7 Job lifecycle state

The schema must persist the job states required by the accepted execution contract.

The contract must define the supported states and their meanings, such as submitted, queued, active, completed, failed, cancelled, or another approved state set.

The database must reject invalid status values where practical and preserve the timestamps required to interpret lifecycle progression.

The database does not decide when a job should start, which worker should receive it, or how an execution failure is handled.

#### 2.1.8 Job lifecycle timestamps

Job timestamps must use consistent semantics and suitable database types.

The model must distinguish relevant events such as creation, submission, acceptance, start, completion, cancellation, or finalization where those events are part of the accepted contract.

Optional timestamps must not be populated with misleading defaults simply to avoid null values.

The backend execution service owns the actual lifecycle transitions and must update the associated records consistently.

#### 2.1.9 Job status history

Where the accepted contract requires historical job transitions, the schema must provide durable status-history records.

A history record may contain the job identifier, previous and new state, transition timestamp, actor or system principal, correlation identifier, and applicable reason metadata.

The current job status must not be treated as a complete history when historical transitions are required.

The backend execution service owns transition validation and the transactional creation of required history records.

#### 2.1.10 Run identity

Each execution run must have a stable identifier distinct from the parent job identifier.

The schema must represent the relationship between a run and its job explicitly.

A run may also reference the applicable project, booking, artifact, platform, resource, or execution environment when required by the accepted contract.

Run identity must remain stable across status updates. A separate attempt must receive a distinct identity when the contract treats it as a new execution attempt.

#### 2.1.11 Job-to-run cardinality

The schema must define whether a job can have multiple runs and under which conditions.

Where retries are supported, the model must preserve earlier attempts rather than overwriting a single run row with the latest attempt's state.

Required constraints must prevent duplicate attempt numbering or duplicate logical attempts within the defined scope.

The backend execution service owns retry policy, scheduling, and the decision to create a new run.

#### 2.1.12 Run attempt metadata

Where execution attempts are represented separately, the schema must store the attempt number or equivalent stable ordering information.

The model must define:

- Attempt identity.
- Parent job reference.
- Attempt number or sequence.
- Run state.
- Creation and start timestamps.
- Completion timestamp where applicable.
- Failure or termination metadata where required.
- Retry or supersession reference where applicable.
- Correlation identifiers.
- Relevant execution-context references.

The schema must preserve enough information to distinguish an initial run from a retry or re-execution.

#### 2.1.13 Run lifecycle state

The run status model must distinguish the state of one execution attempt from the aggregate status of its parent job.

The accepted state set must be documented and constrained where practical.

Terminal run states must be interpretable without relying on transient worker memory.

The database must not infer that a job is complete merely because one run has completed if additional attempts or required processing remain.

#### 2.1.14 Run lifecycle history

Where required, the schema must retain run status transitions and relevant provenance.

History records must reference the run and preserve event ordering or stable identity.

The model must define how repeated events, retries, and delayed status updates are handled.

The backend execution service owns event ordering policy and transition orchestration; the database provides the durable representation and applicable constraints.

#### 2.1.15 Execution context references

A run may require references to the artifact, platform, resource, environment, or booking associated with the execution.

Each relationship must have a defined purpose and ownership source.

The schema must distinguish a reference to an authoritative entity from a snapshot of values required for historical reproducibility.

The model must not duplicate the entire resource, artifact, or booking record inside run metadata.

#### 2.1.16 Correlation and traceability identifiers

Jobs and runs must support correlation identifiers where required for tracing across backend services, Lab Agent operations, telemetry, logs, and results.

Correlation identifiers must not replace primary keys or foreign keys.

The schema must define the uniqueness and scope of each identifier, including whether it is unique globally, per tenant, per job, or per run.

Secrets, credentials, access tokens, and other sensitive values must not be stored in correlation fields.

#### 2.1.17 Execution metadata and snapshots

The model may store execution metadata needed to explain a run, including selected version references, environment labels, configuration hashes, and relevant provenance.

Any snapshot must have a defined schema or format, source, and retention expectation.

Large payloads should be referenced through approved artifact or storage metadata when appropriate.

The database must not become an unbounded store for arbitrary worker output or serialized process memory.

#### 2.1.18 Telemetry stream identity

The schema must represent telemetry streams or equivalent logical collection units associated with jobs, runs, resources, or other approved entities.

The model must define:

- Stream identity.
- Associated run or job.
- Optional resource or sensor reference.
- Stream type or data category.
- Time interval or lifecycle metadata where applicable.
- Data format or schema version reference.
- Storage or retrieval reference where required.
- Creation and finalization metadata.
- Ownership and visibility scope.

A stream record describes the data source and its association. It does not implement telemetry acquisition or transport.

#### 2.1.19 Telemetry series metadata

Where one telemetry stream contains multiple signals or series, the schema must represent the series identity and metadata needed to interpret them.

Metadata may include a stable signal key, label, unit, data type, sampling characteristics, schema version, and source reference where applicable.

The model must avoid ambiguous naming and must distinguish stable identifiers from display labels.

The approved telemetry contract determines which fields are mandatory.

#### 2.1.20 Telemetry time semantics

Telemetry metadata must use consistent time semantics.

The schema must distinguish event time from ingestion or recording time where both are needed.

Where a stream records a start and end time, the meaning of those timestamps must be documented.

Late-arriving samples, clock skew, and out-of-order data must be handled according to the approved telemetry contract.

DB-M04 stores the required metadata and references; it does not define real-time sampling or transport guarantees.

#### 2.1.21 Telemetry sample storage boundary

The schema must explicitly identify where telemetry sample data is stored or how it is retrieved.

High-volume samples may reside in a time-series store, object storage, or another approved system rather than ordinary relational tables.

If samples are stored outside PostgreSQL, the relational metadata must provide stable references, provenance, and the association with the corresponding run or stream.

The physical storage engine and data ingestion pipeline belong to the applicable telemetry and infrastructure owners.

#### 2.1.22 Telemetry completion and integrity metadata

Where streams are finalized, the schema may store completion status, time bounds, sample counts, checksums, or other integrity metadata required by the accepted contract.

Such values must have clear semantics and must not be presented as verified if they have not been produced by the trusted ingestion or finalization process.

The backend or telemetry service owns the process that calculates and records these values.

#### 2.1.23 Log stream identity

The schema must represent log streams or equivalent logical log collections associated with a job or run.

A log stream record may include:

- Stable stream identifier.
- Parent job or run reference.
- Stream category or source.
- Start and end timestamps where applicable.
- Data format or encoding metadata.
- Retrieval or storage reference.
- Finalization state.
- Required provenance and ownership metadata.

The schema must distinguish a log stream from an individual log event or line.

#### 2.1.24 Log segment metadata

Where logs are stored as segments or chunks, the schema may represent segment metadata such as sequence, time bounds, size, checksum, format, and storage reference.

The accepted contract must define the uniqueness and ordering semantics for segments.

The model must not require large log payloads to be copied into relational columns unless that storage choice is explicitly approved.

Log generation, shipping, indexing execution, and search service behavior remain with their authoritative owners.

#### 2.1.25 Log retrieval references

The database must provide the stable metadata needed to retrieve logs through the approved service or storage layer.

References must not expose unrestricted internal storage credentials or public access tokens.

The service owner is responsible for validating access and generating any short-lived retrieval authorization.

The schema must preserve the association between a log reference and its parent run or job.

#### 2.1.26 Result identity

Each result must have a stable identifier independent of a display name or result description.

The schema must define the relationship to the producing run and, where required, the parent job.

A run may produce multiple results, and the accepted model must make that cardinality explicit.

Result identity must remain stable across permitted status updates and retrieval operations.

#### 2.1.27 Result type and schema version

The model must represent the result type or category and any applicable schema or format version.

Result types must be documented and validated against the accepted contract.

The schema must distinguish result type from the user-facing label.

The service owner defines the semantic interpretation and validation of the result content.

#### 2.1.28 Result lifecycle and publication metadata

Where results have a lifecycle, the schema must represent states such as pending, available, invalid, failed, or another approved set.

The model must define the relationship between result readiness and run completion.

A result must not be marked available merely because a storage reference has been created if the required validation or publication step has not completed.

The backend results service owns computation, validation, and publication workflow behavior.

#### 2.1.29 Result provenance

Result records must retain sufficient provenance to identify the run and applicable source data or artifact references.

Where required, provenance may include the producing job, run, artifact version, environment reference, schema version, generation timestamp, or correlation identifier.

The model must distinguish source provenance from result interpretation or evaluation.

Result computation and domain-specific validation remain with B-M06 RESULTS (P6-P7) and the applicable execution owners.

#### 2.1.30 Result artifact references

Large result payloads, reports, images, video files, and other generated artifacts should be referenced through the artifact and storage model established by DB-M02 CORE DATA (P3).

DB-M04 must define the relationship between a result and its artifact references without creating a competing artifact registry.

The model must support multiple artifacts per result where required by the accepted contract.

Storage location lifecycle and object-store access behavior remain with the artifact, cloud, and results service owners.

#### 2.1.31 Execution summaries

Where the approved contract requires summary fields, the schema may persist execution outcome metadata such as start time, completion time, duration, terminal status, or aggregate counters.

Summary fields must have documented provenance and consistency rules.

A summary must not silently become a second source of truth that conflicts with authoritative run records.

If summaries are derived, the model must document whether they are recomputable and how they are refreshed.

#### 2.1.32 Retention and lifecycle metadata

The schema must support retention or expiry metadata where required by the approved execution-data contract.

Retention metadata may identify eligibility for archival, deletion, or external data cleanup, but it does not itself perform those operations.

The model must distinguish a logical deletion or expiry marker from confirmed removal of the underlying data.

Retention policy, legal requirements, and production cleanup execution remain with the applicable data governance, cloud, and production owners.

#### 2.1.33 Referential integrity

All DB-M04-owned records must have valid relationships to their required parent entities.

The model must define deletion behavior, optional relationships, and retention constraints explicitly.

Foreign-key cascades must not unintentionally delete execution history, logs, telemetry metadata, or results required for audit or downstream traceability.

Where historical references must remain valid after a source entity is deactivated, the schema must define an approved lifecycle strategy.

#### 2.1.34 RLS and tenant-scoped access

All tenant-scoped jobs, runs, telemetry metadata, log metadata, and results must follow the RLS and tenant-context conventions established by DB-M01 FOUNDATION (P0-P3).

The ownership path must be explicit for every protected entity, including child records and indirect references.

Access to a result or log stream must not bypass authorization simply because the underlying object is stored outside PostgreSQL.

RLS protects relational records; the applicable service and storage layer must enforce access to external data.

#### 2.1.35 Audit integration

Relevant changes to job, run, result, and metadata lifecycle must use the audit conventions established by DB-M01 FOUNDATION (P0-P3).

The exact event set must be agreed with the security and backend owners.

DB-M04 provides the data relationships and constraints needed for traceability. It does not redefine the foundational audit schema or independently implement every application audit event.

#### 2.1.36 Indexes and query patterns

The schema must include indexes supporting the approved query patterns.

Likely access paths include:

- Jobs by tenant, project, creation time, and status.
- Runs by job, tenant, status, and creation time.
- Latest or specific attempts for a job.
- Telemetry streams by run, resource, and time bounds.
- Telemetry series by stream and stable series key.
- Log streams by run and source.
- Log segments by stream and sequence.
- Results by run, job, status, type, and creation time.
- Result artifact references by result and artifact identity.
- Correlation identifiers where operational tracing requires lookup.

Indexes must be based on expected access patterns and measured needs. DB-M04 does not establish unsupported performance guarantees.

#### 2.1.37 Migration and schema verification

All DB-M04-owned tables, constraints, indexes, and RLS policies must be introduced through the approved migration workflow.

Migrations must follow DB-M01 FOUNDATION (P0-P3) conventions and must be compatible with the schemas established by DB-M02 CORE DATA (P3) and DB-M03 BOOKING DATA (P4).

Schema verification must detect missing required entities, relationships, constraints, indexes, and policies.

Migrations must not require undocumented manual database changes.

#### 2.1.38 Automated database tests

Tests must cover the correctness of the job, run, telemetry, log, and results schema.

Relevant cases include:

- Job ownership and lifecycle values.
- Job-to-run cardinality and attempt sequencing.
- Run status history and timestamp semantics.
- Artifact, resource, and booking references.
- Telemetry stream and series metadata.
- Log stream and segment ordering.
- Result identity and provenance.
- Result-to-artifact relationships.
- RLS isolation.
- Referential integrity and deletion behavior.
- Migration initialization and history.
- Retention metadata semantics.
- Failed transaction behavior.

Global testing conventions belong to `docs/development/TESTING_STRATEGY.md`.

#### 2.1.39 Integration workflow

The milestone must provide a documented workflow for applying DB-M04 migrations after DB-M01 FOUNDATION (P0-P3), DB-M02 CORE DATA (P3), and DB-M03 BOOKING DATA (P4).

The workflow must identify prerequisites, migration commands, schema verification, and test execution.

Destructive reset commands must be restricted to disposable databases.

#### 2.1.40 Error and integrity behavior

The database must reject invalid records and relationships where constraints can enforce the accepted rules.

Representative failures include:

- A run referencing a nonexistent job.
- Duplicate attempt numbering where uniqueness is required.
- A result referencing an invalid run.
- A telemetry stream referencing an invalid parent.
- A log segment with duplicate sequence identity.
- A result artifact reference that violates required integrity.
- A tenant-scoped record with invalid ownership.
- A status value outside the accepted set.

The backend owns mapping integrity failures to public API behavior. DB-M04 must make integrity failures observable to trusted services and tests.

#### 2.1.41 Documentation and downstream handoff

DB-M04 must document its entity relationships, lifecycle fields, attempt semantics, telemetry and log metadata boundaries, result provenance, RLS assumptions, and retention metadata.

It must provide stable references for B-M05 EXECUTION (P5), P6 LAB & ROBOT, B-M06 RESULTS (P6-P7), F-M06 LIVE (P7), and F-M07 RESULTS (P7).

It must identify which data is relational metadata and which payloads reside in external storage or streaming systems.

Task decomposition, detailed acceptance evidence, review execution, change history, and commit procedure remain in sibling files.

### 2.2 Explicit non-scope

The following are outside DB-M04 EXECUTION DATA unless an approved scope change explicitly assigns them to this milestone:

- PostgreSQL foundation and migration tooling.
- Identity, organization, project, and foundational audit schema.
- Platform, resource, artifact, and storage metadata schema.
- Booking, availability, credit, ledger, plan, and invoice schema.
- Job scheduling algorithms and worker selection.
- Runtime execution orchestration and dispatch.
- Execution worker implementation.
- Job submission APIs and frontend workflows.
- Physical robot control and Lab Agent implementation.
- Real-time telemetry acquisition and transport.
- Telemetry sampling algorithms and signal processing.
- Log generation, shipping, indexing execution, and search implementation.
- Result computation, validation algorithms, and domain-specific interpretation.
- Live video processing and frontend rendering.
- Results frontend rendering and report presentation.
- Object storage provisioning and lifecycle execution.
- Cloud resource provisioning and network configuration.
- Production backup, recovery, availability, and capacity operations.
- Data warehouse, analytics, and business reporting pipelines.
- Global CI, repository workflow, and release orchestration.
- Production-scale throughput or latency guarantees without representative measurement.
- Legal retention policy and jurisdiction-specific compliance determinations.

DB-M04 may define metadata fields and references needed to support these capabilities. It must not take over their implementation ownership.

### 2.3 Canonical phase relationship table

| Phase | Relationship to DB-M04 EXECUTION DATA | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies engineering and database conventions | DB-M04 follows established migration and verification conventions |
| P1 STUDIO | Supplies foundational organization and project context | DB-M04 does not own Studio workflows |
| P2 BUILD & ARTIFACT | Supplies applicable artifact and build references | DB-M04 references authoritative artifacts and does not own build behavior |
| P3 CONTROL PLANE | Supplies identity, organization, project, platform, resource, artifact, and storage references | DB-M04 reuses foundational and core metadata |
| P4 BOOKING & COMMERCIAL | Supplies booking and commercial context where applicable | DB-M03 BOOKING DATA (P4) owns booking and commercial persistence |
| P5 EXECUTION | Primary phase for DB-M04 EXECUTION DATA | DB-M04 owns job, run, and execution metadata persistence |
| P6 LAB & ROBOT | Consumes run references and records applicable lab or robot context | DB-M04 persists agreed metadata but does not own physical control |
| P7 LIVE & RESULTS | Consumes telemetry, log, and result metadata | DB-M04 owns durable metadata; services own acquisition and presentation |
| P8 PRODUCTION | Uses execution data under production operational controls | Production operations remain with P8 PRODUCTION and applicable operational owners |

### 2.4 Canonical database milestone relationship table

| Database milestone | Phase mapping | Relationship to DB-M04 EXECUTION DATA |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies PostgreSQL, migration, identity, organization, project, RLS, and audit foundations |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Supplies platform, resource, artifact, and storage metadata |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Supplies booking and commercial references where applicable |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Owns jobs, runs, telemetry/log metadata, and results persistence |

### 2.5 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to DB-M04 EXECUTION DATA |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Consumes foundational application context |
| Frontend | F-M02 PROJECTS (P1) | Consumes project and organization context |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Consumes artifact information through approved contracts |
| Frontend | F-M04 BOOKING (P4) | Consumes booking and commercial data |
| Frontend | F-M05 EXECUTION (P5) | Consumes job and run lifecycle information through approved contracts |
| Frontend | F-M06 LIVE (P7) | Consumes telemetry and log metadata through approved contracts |
| Frontend | F-M07 RESULTS (P7) | Consumes result records and artifact references |
| Backend | B-M01 CONTROL PLANE (P3) | Supplies identity and ownership foundations |
| Backend | B-M02 ARTIFACT (P2-P3) | Supplies artifact-related service contracts |
| Backend | B-M03 PLATFORM (P3) | Supplies platform and resource references |
| Backend | B-M04 BOOKING (P4) | Supplies booking references and commercial context |
| Backend | B-M05 EXECUTION (P5) | Owns execution orchestration and consumes job/run persistence |
| Backend | B-M06 RESULTS (P6-P7) | Owns results service behavior and consumes result persistence |
| Backend | B-M07 PRODUCTION (P8) | Uses execution data under production operational controls |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies the foundational schema and security conventions |
| Database | DB-M02 CORE DATA (P3) | Supplies platform, resource, artifact, and storage metadata |
| Database | DB-M03 BOOKING DATA (P4) | Supplies booking and commercial references |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Owns this execution data model |
| Cloud | C-M01 FOUNDATION (P0) | Supplies cloud foundation conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development environment infrastructure |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and deployment controls |

### 2.6 Required data invariants

All DB-M04 implementations must preserve these invariants:

- **Stable job identity:** job identifiers remain stable across lifecycle updates.
- **Distinct run identity:** each execution attempt has a stable identity distinct from its parent job.
- **Explicit cardinality:** job-to-run and run-to-result relationships follow the accepted contract.
- **Attempt preservation:** a retry does not silently overwrite the history of an earlier attempt.
- **Explicit ownership:** every tenant-scoped record has an unambiguous ownership path.
- **Valid lifecycle values:** persisted statuses follow the accepted contract.
- **Timestamp clarity:** event time, ingestion time, creation time, and update time are not conflated.
- **Reference integrity:** jobs, runs, telemetry streams, log streams, and results use valid relationships.
- **Artifact reuse:** result payloads reference the authoritative artifact and storage model where applicable.
- **Telemetry separation:** telemetry metadata is distinguished from high-volume sample storage.
- **Log separation:** log metadata is distinguished from raw log payloads.
- **Result provenance:** results retain sufficient source and run references to establish provenance.
- **Tenant isolation:** RLS protects execution and results metadata across tenant boundaries.
- **Audit traceability:** required changes use the audit foundation established by DB-M01 FOUNDATION (P0-P3).
- **Historical preservation:** required execution and result history is not removed through unintended cascading deletion.
- **Retention clarity:** metadata marking expiry does not imply successful deletion of external payloads.
- **Domain ownership:** booking, resource, artifact, and commercial data remain owned by their authoritative database milestones.
- **Operational separation:** schema correctness does not imply production readiness or physical robot safety.
- **Documented limitations:** unsupported telemetry guarantees, retention guarantees, and performance claims are not implied by the schema.

---

## 3. Dependencies

### 3.1 DB-M01 FOUNDATION (P0-P3)

DB-M04 depends on DB-M01 FOUNDATION for:

- PostgreSQL baseline and supported environment assumptions.
- Migration tooling and history.
- Identity, organization, membership, and project schema.
- Identifier and timestamp conventions.
- Foreign-key and constraint conventions.
- Database roles and least-privilege expectations.
- RLS and tenant-context conventions.
- Audit persistence and provenance conventions.
- Schema verification and database testing workflow.

DB-M04 must extend these foundations without creating competing identity or ownership representations.

### 3.2 DB-M02 CORE DATA (P3)

DB-M04 depends on DB-M02 CORE DATA where execution records reference platforms, resources, artifacts, or storage metadata.

Required alignment includes:

- Stable platform and resource identifiers.
- Artifact identity and version references where applicable.
- Storage metadata and approved retrieval references.
- Resource lifecycle semantics.
- Artifact deprecation and availability assumptions.
- Ownership and visibility scope.
- Rules for preserving historical references.

DB-M04 must not introduce duplicate platform, resource, artifact, or storage registries.

### 3.3 DB-M03 BOOKING DATA (P4)

DB-M04 may require a booking reference to associate an execution job or run with a reservation or commercial context.

Required alignment includes:

- Stable booking identifier.
- Booking lifecycle semantics relevant to execution.
- Rules for cancelled, expired, or otherwise invalid bookings.
- Optional versus mandatory booking references for each job type.
- Retention and deletion behavior for historical booking references.
- Tenant ownership consistency.

DB-M03 BOOKING DATA owns booking persistence. DB-M04 owns the execution-side reference and does not duplicate booking state or commercial records.

### 3.4 B-M05 EXECUTION (P5)

B-M05 EXECUTION consumes job and run persistence to support submission, orchestration, dispatch, retries, cancellation, and execution lifecycle behavior.

Required alignment includes:

- Job identity and ownership.
- Job-to-run cardinality.
- Run identity and attempt numbering.
- Status values and lifecycle timestamps.
- Retry semantics.
- Correlation identifiers.
- Booking and artifact references.
- Transaction boundaries for status changes.
- Required history and audit behavior.

DB-M04 owns the persistent schema and integrity constraints. B-M05 EXECUTION owns the execution workflow and runtime orchestration.

### 3.5 P6 LAB & ROBOT

P6 LAB & ROBOT may produce or consume execution context, robot state references, lab session references, and related provenance.

Required alignment includes:

- Stable run references.
- Lab or robot association semantics.
- Correlation identifiers.
- Relevant start and completion timestamps.
- Result provenance.
- References to telemetry and log metadata.
- Retention requirements for physical execution records.

DB-M04 persists only the agreed metadata and references. It does not own physical robot control, hardware safety policy, or Lab Agent implementation.

### 3.6 B-M06 RESULTS (P6-P7)

B-M06 RESULTS consumes the result schema and its relationships to jobs, runs, and artifacts.

Required alignment includes:

- Result identity and type.
- Result lifecycle and publication status.
- Provenance requirements.
- Result-to-run cardinality.
- Artifact references.
- Validation and publication semantics.
- Tenant access and retention requirements.
- Query patterns for result retrieval.

DB-M04 owns result persistence. B-M06 RESULTS owns result computation, validation, publication workflow, and service behavior.

### 3.7 F-M06 LIVE (P7)

F-M06 LIVE consumes approved contracts for telemetry and log metadata.

Required alignment includes:

- Stream identity and association with runs.
- Signal or series metadata.
- Time-bound metadata.
- Log stream and segment references.
- Finalization state.
- Access-controlled retrieval references.
- Schema version and format information where required.

DB-M04 does not define visual presentation, chart behavior, live transport, or frontend refresh mechanisms.

### 3.8 F-M07 RESULTS (P7)

F-M07 RESULTS consumes result records and artifact references through the approved backend contract.

Required alignment includes:

- Stable result identifiers.
- Result type and status.
- Result provenance fields intended for display.
- Artifact references and retrieval authorization.
- Result availability semantics.
- Pagination and query requirements where applicable.

DB-M04 does not define frontend rendering or result interpretation.

### 3.9 Telemetry data contract

The telemetry contract must define the distinction between metadata stored in PostgreSQL and high-volume samples stored in another approved system where applicable.

Required decisions include:

- Stream and series identity.
- Data format and schema version.
- Event time and ingestion time.
- Stream finalization semantics.
- Storage reference format.
- Sample count or integrity metadata where required.
- Retention and deletion responsibilities.
- Handling of late or out-of-order data.
- Access-control expectations.

DB-M04 must not assume that relational storage alone satisfies real-time acquisition, ingestion throughput, or long-term sample retention requirements.

### 3.10 Log metadata contract

The log contract must define how log streams and segments are represented and retrieved.

Required decisions include:

- Stream identity and parent run.
- Source or category.
- Segment sequence and uniqueness.
- Time-bound semantics.
- Storage or retrieval references.
- Encoding and format.
- Finalization state.
- Retention and cleanup responsibilities.
- Access-control enforcement.

DB-M04 persists metadata and references. Log generation, transport, indexing, and search execution remain with the applicable service owners.

### 3.11 Result provenance contract

The result contract must define what evidence is required to establish how a result was produced.

Required decisions include:

- Parent job and run.
- Result type and schema version.
- Artifact references.
- Source configuration or environment references where applicable.
- Generation timestamp.
- Validation or publication state.
- Required correlation identifiers.
- Retention expectations.

The contract must distinguish stored provenance from a claim that the result is correct. Result validation remains with the relevant backend owner.

### 3.12 Retention and deletion contract

The milestone depends on an agreed retention model for execution records, telemetry metadata, logs, and results.

Required decisions include:

- Which records must be retained.
- Which metadata may be deleted.
- Whether records are archived or logically deleted.
- How references to external payloads are handled.
- How legal or contractual holds are represented where required.
- How deletion failures are recorded.
- Which service executes cleanup.
- How audit and historical traceability are preserved.

DB-M04 may store retention metadata but does not own legal retention policy or production cleanup execution.

### 3.13 RLS and authorization contract

DB-M04 must follow the RLS and tenant-context conventions established by DB-M01 FOUNDATION (P0-P3).

The security contract must define:

- Ownership path for each DB-M04 entity.
- Access to jobs and runs.
- Access to telemetry and log metadata.
- Access to results and artifact references.
- Privileged service roles.
- Tenant context propagation.
- RLS behavior for related records.
- Access enforcement for external payload retrieval.

RLS on metadata tables does not automatically secure data held in an external storage or streaming system. The applicable service must enforce equivalent access controls.

### 3.14 Migration and verification tooling

DB-M04 depends on the migration and schema verification workflow established by DB-M01 FOUNDATION (P0-P3).

The workflow must support:

- Applying DB-M04 migrations after DB-M01 FOUNDATION (P0-P3).
- Applying dependencies from DB-M02 CORE DATA (P3) and DB-M03 BOOKING DATA (P4).
- Tracking migration history.
- Detecting migration failures.
- Verifying foreign keys and uniqueness constraints.
- Verifying indexes and RLS policies.
- Running isolated database tests.
- Reproducing the expected schema in a clean supported environment.

### 3.15 Database test environment

The test environment must support realistic relational integrity, transactions, and role-based access behavior.

It must be capable of exercising:

- Multiple runs associated with a job.
- Duplicate attempt-number rejection where required.
- Lifecycle status updates and history.
- Concurrent status or finalization operations where applicable.
- Telemetry stream and log segment metadata.
- Result-to-run and result-to-artifact relationships.
- Tenant isolation across parent and child records.
- Retention metadata behavior.
- Migration initialization and history.

Tests must use an isolated database and must not perform destructive operations against shared or production environments.

### 3.16 Cloud and storage dependencies

The cloud domain supplies environment assumptions for database connectivity and any external systems referenced by telemetry, log, and result metadata.

Required alignment includes:

- Development and staging database connectivity.
- Approved object or stream storage reference semantics.
- Secret and credential delivery boundaries.
- Environment-specific storage configuration.
- Required integration test dependencies.
- Production handoff requirements.

DB-M04 must not define cloud provisioning, storage credentials, or infrastructure lifecycle procedures.

### 3.17 Production operational dependencies

P8 PRODUCTION and the applicable operational owners define production requirements for:

- Database availability.
- Backup and recovery.
- Retention execution.
- Capacity and index maintenance.
- Data cleanup and archival.
- Monitoring and alerting.
- Privileged access.
- Incident response.
- Data restoration and integrity verification.

DB-M04 must provide the data-model requirements and known constraints needed for that handoff. It must not claim these operational capabilities are complete merely because schema tests pass.

### 3.18 Dependency readiness criteria

A dependency is ready when:

- Its authoritative owner is identified.
- Required contracts are documented.
- Data ownership and relationship semantics are agreed.
- Security implications are reviewed.
- Transaction and lifecycle assumptions are explicit where relevant.
- Retention and external-storage boundaries are documented.
- Unresolved policy decisions are recorded.
- DB-M04 can verify the applicable database-level behavior.

Dependencies must be classified as blocking, conditionally blocking, or non-blocking.

- **Blocking:** the schema cannot be correctly or securely established without the dependency.
- **Conditionally blocking:** implementation can proceed, but acceptance of the affected capability must wait.
- **Non-blocking:** the dependency affects a later or optional capability without invalidating the accepted core schema.

Detailed dependency assignments and sequencing belong in `TASKS.md`.

### 3.19 Cross-phase handoff table

| Handoff | Producing phase or milestone | Consuming phase or milestone | Required evidence |
|---|---|---|---|
| Foundational identity and ownership schema | DB-M01 FOUNDATION (P0-P3) | DB-M04 EXECUTION DATA (P5-P7) | Execution records use approved identifiers and ownership paths |
| Platform and resource metadata | DB-M02 CORE DATA (P3) | DB-M04 EXECUTION DATA (P5-P7) | Runs reference canonical platform and resource identities |
| Artifact and storage metadata | DB-M02 CORE DATA (P3) | DB-M04 EXECUTION DATA (P5-P7) | Results reference canonical artifacts and storage metadata |
| Booking references | DB-M03 BOOKING DATA (P4) | DB-M04 EXECUTION DATA (P5-P7) | Jobs or runs reference bookings where required |
| Job and run persistence | DB-M04 EXECUTION DATA (P5-P7) | B-M05 EXECUTION (P5) | Execution service can persist lifecycle state and attempts |
| Telemetry and log metadata | DB-M04 EXECUTION DATA (P5-P7) | F-M06 LIVE (P7) | Live experience can discover authorized streams and logs |
| Result persistence | DB-M04 EXECUTION DATA (P5-P7) | B-M06 RESULTS (P6-P7) | Results service can persist and retrieve result records |
| Result presentation data | B-M06 RESULTS (P6-P7) | F-M07 RESULTS (P7) | Frontend receives stable result status and artifact references |
| Lab execution context | P6 LAB & ROBOT | DB-M04 EXECUTION DATA (P5-P7) | Agreed lab or robot references are associated with runs |
| Database environment requirements | Database domain | C-M03 STAGING (P4-P7) | Staging satisfies the documented database requirements |
| Production data requirements | Database domain | P8 PRODUCTION | Operational requirements and known limitations are handed off |

### 3.20 Dependency change control

Changes to job identity, run cardinality, retry semantics, telemetry metadata, log references, result provenance, or retention behavior may affect multiple services and downstream records.

A proposed change must identify:

- The affected entity or relationship.
- The business or technical reason.
- The affected migrations and constraints.
- The impact on execution history.
- The impact on telemetry and log discovery.
- The impact on result provenance and artifact references.
- The impact on RLS and audit behavior.
- The impact on external storage and retention.
- The affected backend and frontend contracts.
- The migration and compatibility strategy.
- The owners required to review the change.

Changes must follow the accepted review and release process. DB-M04 must not silently redefine execution lifecycle semantics to accommodate a single service.

---

## 4. Deliverables

### 4.1 Execution data schema specification

Deliver a schema specification for jobs, runs, telemetry metadata, log metadata, and results.

The specification must identify entity ownership, relationships, lifecycle fields, references to external metadata, and retention boundaries.

**Completion evidence:** the schema is reviewable and aligned with the accepted execution and results contracts.

### 4.2 Job schema

Deliver job records and constraints for stable identity, ownership, type, lifecycle status, timestamps, and required context references.

The schema must distinguish job-level state from run-level state.

**Completion evidence:** tests verify job creation, required ownership, valid state values, and required relationship integrity.

### 4.3 Job lifecycle history

Where required by the accepted contract, deliver job status-history persistence.

The model must preserve transitions and relevant provenance without treating the current status field as a complete history.

**Completion evidence:** tests verify history relationships and deterministic retrieval.

### 4.4 Run schema

Deliver execution-run records with stable identity, parent job relationship, lifecycle status, timestamps, and applicable context references.

**Completion evidence:** tests verify run identity, valid parent relationships, and accepted lifecycle fields.

### 4.5 Run attempt metadata

Deliver attempt numbering or equivalent sequencing metadata where retries are supported.

The model must preserve prior attempts and enforce the accepted uniqueness rules.

**Completion evidence:** tests verify attempt ordering, duplicate rejection where required, and retention of earlier run records after a retry.

### 4.6 Run lifecycle history

Where required by the accepted contract, deliver run status-history persistence.

The model must define event identity, ordering, timestamps, and relationship to the run.

**Completion evidence:** tests verify history integrity and representative lifecycle transitions.

### 4.7 Execution context references

Deliver required references from jobs and runs to projects, bookings, artifacts, platforms, resources, and environments where applicable.

The schema must reuse the authoritative entities established by DB-M01 FOUNDATION (P0-P3), DB-M02 CORE DATA (P3), and DB-M03 BOOKING DATA (P4).

**Completion evidence:** tests verify foreign keys and documented optional or mandatory relationship rules.

### 4.8 Correlation and provenance fields

Deliver the correlation and provenance fields required to connect jobs and runs with telemetry, logs, and results.

The model must define scope and uniqueness semantics where applicable.

**Completion evidence:** integration-oriented schema tests verify that related records can be correlated through stable references.

### 4.9 Telemetry stream metadata

Deliver telemetry stream records with stable identity, parent relationships, type or category, applicable time bounds, and storage or retrieval references where required.

**Completion evidence:** tests verify stream identity, valid parent references, and required metadata constraints.

### 4.10 Telemetry series metadata

Where a stream contains multiple series, deliver series records or equivalent metadata with stable keys and the fields required by the approved contract.

**Completion evidence:** tests verify series identity, uniqueness within the defined scope, and valid stream relationships.

### 4.11 Telemetry storage boundary

Deliver documentation of the boundary between relational metadata and high-volume telemetry sample storage.

The schema must use approved storage references where sample payloads reside outside PostgreSQL.

**Completion evidence:** the metadata model identifies how an authorized service locates the relevant telemetry data without embedding unrestricted credentials.

### 4.12 Telemetry integrity metadata

Where required, deliver metadata for stream finalization, time bounds, sample counts, checksums, or other integrity indicators.

The meaning and trusted source of each field must be documented.

**Completion evidence:** tests verify valid metadata transitions and required relationships.

### 4.13 Log stream metadata

Deliver log stream records associated with jobs or runs.

The schema must identify source or category, relevant time bounds, format metadata, retrieval references, and finalization state where required.

**Completion evidence:** tests verify log stream identity, ownership, and parent relationships.

### 4.14 Log segment metadata

Where logs are segmented, deliver metadata for sequence, time bounds, size, checksum, format, and storage references as required.

**Completion evidence:** tests verify ordering, uniqueness, and valid stream relationships.

### 4.15 Log retrieval metadata

Deliver stable and access-controlled metadata references for retrieving logs through the approved service or storage layer.

The schema must not expose storage credentials or unrestricted access tokens.

**Completion evidence:** schema and integration tests verify the association with the parent run and the required authorization boundary.

### 4.16 Result schema

Deliver result records with stable identity, parent job or run relationship, result type, status, timestamps, and required provenance.

**Completion evidence:** tests verify result identity, accepted status values, and required parent relationships.

### 4.17 Result provenance

Deliver the fields and relationships needed to identify the run and applicable source artifact, configuration, environment, or schema version where required.

**Completion evidence:** tests verify that each result can be traced to its producing run and required source references.

### 4.18 Result artifact references

Deliver the result-to-artifact relationships using the authoritative artifact and storage metadata established by DB-M02 CORE DATA (P3).

The model must support the accepted cardinality without creating a competing artifact registry.

**Completion evidence:** tests verify valid artifact references and the required result association.

### 4.19 Result lifecycle and publication metadata

Where required, deliver result status and publication metadata.

The model must distinguish stored or generated content from content approved for consumption.

**Completion evidence:** tests verify valid state values and required relationships between result status and the producing run.

### 4.20 Execution summary metadata

Where required, deliver summary fields for execution outcome, duration, terminal status, or aggregate counters.

The model must document provenance and consistency requirements.

**Completion evidence:** tests verify the agreed summary semantics and prevent unsupported assumptions about summary completeness.

### 4.21 Retention and lifecycle metadata

Deliver the retention or expiry fields required by the approved data contract.

The model must distinguish logical expiry or deletion status from confirmed removal of external payloads.

**Completion evidence:** tests verify required retention metadata and relationships without claiming that external cleanup has executed.

### 4.22 Referential integrity

Deliver foreign keys, uniqueness constraints, check constraints, and deletion semantics for DB-M04-owned entities.

The design must preserve required history and prevent unintended cascades into related execution or results data.

**Completion evidence:** tests verify valid relationships and rejection of representative invalid references.

### 4.23 RLS integration

Deliver RLS policies or policy extensions for DB-M04-owned tables using DB-M01 FOUNDATION (P0-P3) conventions.

The policy design must cover jobs, runs, status history, telemetry metadata, log metadata, results, and related references as applicable.

**Completion evidence:** tests under the ordinary application role verify authorized access and reject cross-organization access.

### 4.24 Audit integration

Deliver the required relationships and integration points for job, run, and result lifecycle audit events.

The implementation must reuse the foundational audit schema and must not create a competing audit data model.

**Completion evidence:** schema and service integration tests verify that relevant lifecycle operations can be associated with the required audit context.

### 4.25 Indexes and query-supporting structures

Deliver indexes for the approved job, run, telemetry, log, and result access patterns.

The index set must support common parent lookups, status filtering, time-range queries, attempt retrieval, and result-to-artifact lookup as applicable.

**Completion evidence:** schema verification confirms the required indexes. Any performance claims must be supported by separate representative measurements.

### 4.26 Migration set

Deliver ordered migrations for all DB-M04-owned tables, constraints, indexes, and RLS policies.

Migrations must use the tooling and history established by DB-M01 FOUNDATION (P0-P3).

**Completion evidence:** a clean supported database can apply the full migration sequence after its prerequisites without undocumented manual changes.

### 4.27 Schema verification

Deliver repeatable verification for the expected DB-M04 schema.

The checks must cover required entities, columns, constraints, foreign keys, indexes, and RLS policies within the documented verification scope.

**Completion evidence:** verification passes against the expected schema and detects representative missing or altered objects.

### 4.28 Automated database tests

Deliver automated tests for job, run, telemetry, log, and results persistence.

The suite must include lifecycle, relationship, tenant isolation, attempt sequencing, retention metadata, and migration cases as applicable.

**Completion evidence:** tests execute against an isolated supported PostgreSQL environment and produce repeatable results.

### 4.29 Development initialization and upgrade workflow

Deliver a documented workflow for applying DB-M04 migrations after DB-M01 FOUNDATION (P0-P3), DB-M02 CORE DATA (P3), and DB-M03 BOOKING DATA (P4).

The workflow must identify prerequisites, commands, schema verification, and test execution.

**Completion evidence:** a developer can initialize or upgrade the database using the documented workflow without manual schema changes.

### 4.30 Database error and integrity behavior

Deliver constraints and tests for invalid job, run, telemetry, log, and result operations.

The backend remains responsible for translating database failures into public API responses.

**Completion evidence:** representative invalid operations fail predictably and can be diagnosed by trusted service and test infrastructure without exposing secrets.

### 4.31 Downstream execution and lab handoff

Deliver stable job and run references and document the lifecycle semantics required by B-M05 EXECUTION (P5) and P6 LAB & ROBOT.

The handoff must identify which references are authoritative and which lifecycle transitions remain owned by runtime services.

**Completion evidence:** downstream owners can associate execution and lab records with persisted jobs and runs without duplicating execution-data ownership.

### 4.32 Live and results handoff

Deliver the telemetry, log, and result metadata relationships required by F-M06 LIVE (P7), B-M06 RESULTS (P6-P7), and F-M07 RESULTS (P7).

The handoff must identify how authorized services discover stream metadata and result artifacts.

**Completion evidence:** consuming services can use stable references without requiring duplicated metadata registries.

### 4.33 Cloud and production handoff

Deliver the database and external-storage requirements needed by C-M03 STAGING (P4-P7) and P8 PRODUCTION.

The handoff must distinguish development-level schema validation from production requirements for backup, recovery, retention, capacity, and operational access.

**Completion evidence:** the relevant owners can identify the database assumptions and unresolved operational requirements.

### 4.34 Deliverable ownership summary

| Deliverable | Authoritative owner | DB-M04 EXECUTION DATA responsibility |
|---|---|---|
| PostgreSQL and migration foundation | DB-M01 FOUNDATION (P0-P3) | Reuse the foundation |
| Platform, resource, artifact, and storage metadata | DB-M02 CORE DATA (P3) | Reference approved identifiers |
| Booking and commercial records | DB-M03 BOOKING DATA (P4) | Reference bookings where applicable |
| Job schema | DB-M04 EXECUTION DATA (P5-P7) | Own job persistence |
| Run schema and attempt metadata | DB-M04 EXECUTION DATA (P5-P7) | Own run and attempt persistence |
| Telemetry stream and series metadata | DB-M04 EXECUTION DATA (P5-P7) | Own telemetry metadata |
| Log stream and segment metadata | DB-M04 EXECUTION DATA (P5-P7) | Own log metadata |
| Result and provenance schema | DB-M04 EXECUTION DATA (P5-P7) | Own result persistence |
| Execution orchestration | B-M05 EXECUTION (P5) | Supply persistence structures and constraints |
| Lab and robot integration | P6 LAB & ROBOT and applicable backend owners | Persist agreed references and metadata |
| Results service behavior | B-M06 RESULTS (P6-P7) | Supply result persistence |
| Live presentation | F-M06 LIVE (P7) | Supply stream and log metadata through contracts |
| Results presentation | F-M07 RESULTS (P7) | Supply result records through contracts |
| External storage infrastructure | Cloud and storage owners | Define stable metadata references |
| Production database operations | P8 PRODUCTION and operational owners | Hand off database requirements |
| Detailed DB-M04 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to authoritative criteria |
| DB-M04 task sequencing | `TASKS.md` | Link to authoritative task plan |

### 4.35 Required milestone records

The DB-M04 EXECUTION DATA directory maintains these sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, sequencing, dependencies, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail conditions and evidence requirements |
| `REVIEW_CHECKLIST.md` | Review actions and evidence inspection |
| `CHANGELOG.md` | Accepted changes and milestone history |
| `GIT_COMMIT_STEP.md` | Repository and commit procedure |

These records are complementary. The milestone dossier establishes the scope contract. The sibling files own task-level planning, acceptance evidence, review execution, accepted history, and commit procedure.

---

## 9. Risks

### 9.1 Ambiguous job and run identity

**Risk:** Job identifiers and run identifiers are conflated, or mutable labels are used as stable keys.

**Impact:** Retry history becomes ambiguous, references break, and execution results cannot be reliably associated with the correct attempt.

**Mitigation:**

- Define stable identifiers for jobs and runs.
- Enforce required parent relationships.
- Keep display labels separate from primary keys.
- Test identity and relationship integrity.
- Document identifier scope and uniqueness.

**Owner:** Database domain and B-M05 EXECUTION (P5).

### 9.2 Retry overwrites prior attempt history

**Risk:** A retry updates the existing run record rather than creating a distinct attempt when the accepted contract requires separate attempts.

**Impact:** Historical failures disappear and results or logs may be associated with the wrong execution attempt.

**Mitigation:**

- Define job-to-run cardinality.
- Use stable run identifiers.
- Store attempt number or equivalent sequencing metadata.
- Enforce uniqueness within the accepted scope.
- Test retries with multiple persisted attempts.

**Owner:** Database domain and B-M05 EXECUTION (P5).

### 9.3 Job and run states diverge

**Risk:** The parent job status conflicts with the states of its runs without a defined aggregate-state rule.

**Impact:** Frontend and service consumers observe inconsistent execution status.

**Mitigation:**

- Document job-level and run-level status semantics.
- Keep state transition ownership with B-M05 EXECUTION (P5).
- Define which status is authoritative for each query.
- Test representative retry and terminal-state combinations.
- Avoid assuming one completed run always completes its parent job.

**Owner:** Backend execution domain, with database support.

### 9.4 Invalid lifecycle transitions are persisted

**Risk:** Status values are valid individually but represent an invalid or inconsistent lifecycle progression.

**Impact:** Execution history becomes difficult to interpret and downstream services make incorrect decisions.

**Mitigation:**

- Define accepted status values.
- Enforce check constraints where appropriate.
- Validate transitions in the owning service.
- Persist required history consistently.
- Test invalid transitions at the service boundary.

**Owner:** B-M05 EXECUTION (P5), with database support.

### 9.5 Missing ownership relationships

**Risk:** Jobs, runs, or results lack an unambiguous tenant or project ownership path.

**Impact:** Authorization decisions become inconsistent and data may be exposed across organizations.

**Mitigation:**

- Reuse DB-M01 FOUNDATION (P0-P3) identity and project structures.
- Enforce required ownership relationships.
- Validate cross-entity ownership in the service layer.
- Apply RLS to all relevant tables.
- Test missing and mismatched ownership references.

**Owner:** Database and security domains.

### 9.6 Invalid or stale artifact references

**Risk:** A run or result references an artifact that has been removed, superseded, or made inaccessible.

**Impact:** Reproducibility and result retrieval fail.

**Mitigation:**

- Reuse DB-M02 CORE DATA (P3) artifact identity.
- Define artifact lifecycle and retention behavior.
- Preserve historical references where required.
- Enforce foreign keys or approved reference integrity.
- Test missing and deactivated artifact cases.

**Owner:** Database and artifact service owners.

### 9.7 Invalid booking references

**Risk:** A job or run references a booking that does not authorize or correspond to the intended execution context.

**Impact:** Execution history becomes commercially or operationally inconsistent.

**Mitigation:**

- Reuse booking identity from DB-M03 BOOKING DATA (P4).
- Define when booking references are required.
- Validate eligibility in B-M04 BOOKING (P4) and B-M05 EXECUTION (P5).
- Enforce referential integrity.
- Test cancelled or expired booking scenarios where relevant.

**Owner:** Backend booking and execution domains, with database support.

### 9.8 Telemetry metadata is incomplete

**Risk:** A telemetry stream lacks the run, resource, time, or schema metadata required to interpret its samples.

**Impact:** Live views and historical analysis cannot reliably associate data with the correct execution.

**Mitigation:**

- Define required stream and series fields.
- Enforce parent relationships.
- Distinguish event time from ingestion time.
- Document schema version and unit semantics.
- Test representative metadata records.

**Owner:** Database and telemetry service owners.

### 9.9 Telemetry samples are confused with metadata

**Risk:** The relational schema is treated as the storage location for all high-volume samples without an approved capacity or query design.

**Impact:** Database growth, query degradation, and unclear retention behavior.

**Mitigation:**

- Define the metadata-to-payload boundary.
- Use the approved storage or streaming system for high-volume data where applicable.
- Keep stable retrieval references in the relational schema.
- Document retention and deletion ownership.
- Measure performance separately before making throughput claims.

**Owner:** Telemetry and infrastructure owners, with database support.

### 9.10 Event time and ingestion time are conflated

**Risk:** Telemetry metadata records only one timestamp when the contract requires both sample event time and ingestion time.

**Impact:** Late or out-of-order samples are interpreted incorrectly.

**Mitigation:**

- Define timestamp semantics.
- Store separate timestamps where required.
- Document clock-skew assumptions.
- Test out-of-order metadata updates.
- Keep sample transport behavior with the telemetry service owner.

**Owner:** Telemetry service and database domains.

### 9.11 Log segment ordering is ambiguous

**Risk:** Log segments have no stable sequence or deterministic ordering rule.

**Impact:** Retrieved logs can be incomplete, duplicated, or displayed in the wrong order.

**Mitigation:**

- Define segment identity and sequence semantics.
- Enforce uniqueness within the stream.
- Preserve time-bound and checksum metadata where required.
- Test duplicate and out-of-order segment registration.
- Keep indexing and search execution with the applicable service owner.

**Owner:** Log service and database domains.

### 9.12 External payload references expose credentials

**Risk:** Telemetry, log, or result metadata stores unrestricted access tokens or long-lived storage credentials.

**Impact:** Unauthorized access to execution data and potential cross-tenant exposure.

**Mitigation:**

- Store stable object or stream references, not secrets.
- Generate short-lived retrieval authorization in the owning service.
- Apply access checks before payload retrieval.
- Restrict database privileges.
- Test unauthorized reference access.

**Owner:** Security, cloud, and backend service owners.

### 9.13 Result provenance is insufficient

**Risk:** A result cannot be traced to the run, artifact version, configuration, or environment that produced it.

**Impact:** Results cannot be reproduced or reliably interpreted.

**Mitigation:**

- Define required provenance fields.
- Reference stable job and run identifiers.
- Reuse canonical artifact references.
- Preserve required configuration snapshots or hashes.
- Test provenance completeness for supported result types.

**Owner:** B-M06 RESULTS (P6-P7), with database support.

### 9.14 Result availability is asserted too early

**Risk:** A result is marked available before its payload is complete, validated, or accessible.

**Impact:** Consumers retrieve incomplete or invalid results.

**Mitigation:**

- Define result lifecycle and publication semantics.
- Distinguish generated, validated, and published states where required.
- Validate artifact references before publication.
- Keep publication orchestration with B-M06 RESULTS (P6-P7).
- Test incomplete and failed publication cases.

**Owner:** Backend results domain, with database support.

### 9.15 Unintended cascading deletion

**Risk:** Deleting a job, run, or related entity removes records needed for execution history, audit, or result provenance.

**Impact:** Historical traceability is lost and external payload references become orphaned.

**Mitigation:**

- Define deletion and retention semantics.
- Review every cascading relationship.
- Prefer explicit lifecycle markers where history must remain.
- Test deletion effects on child records.
- Coordinate external payload cleanup with the authoritative storage owner.

**Owner:** Database and data governance domains.

### 9.16 Retention metadata is mistaken for completed cleanup

**Risk:** An expired or deletion-requested record is assumed to mean its external telemetry, log, or result payload has been deleted.

**Impact:** Sensitive data may remain accessible after expected expiry.

**Mitigation:**

- Distinguish requested, in-progress, and completed deletion states where required.
- Define the trusted cleanup owner.
- Record external cleanup outcomes where applicable.
- Test failure and retry semantics.
- Keep production cleanup execution with the cloud and production owners.

**Owner:** Data governance, cloud, and production domains.

### 9.17 RLS protects parent rows but not child metadata

**Risk:** A user cannot access a job but can query its run history, telemetry metadata, log references, or results through another access path.

**Impact:** Cross-tenant information leakage.

**Mitigation:**

- Define ownership and RLS for every protected entity.
- Test direct access to child tables.
- Test indirect queries and joins.
- Use approved tenant context.
- Verify policies under the ordinary application role.

**Owner:** Database and security domains.

### 9.18 Tenant context leaks across pooled connections

**Risk:** A reused connection retains a previous request's tenant context.

**Impact:** A subsequent request can access another tenant's execution records.

**Mitigation:**

- Establish context for each transaction or operation.
- Clear request-scoped context reliably.
- Test connection reuse across tenants.
- Review exception and rollback paths.
- Align backend context propagation with the database policy.

**Owner:** Backend and database domains.

### 9.19 Missing audit coverage

**Risk:** Important job, run, or result lifecycle changes are not associated with required audit events.

**Impact:** Execution disputes and unauthorized changes become difficult to investigate.

**Mitigation:**

- Identify required audit events with security and backend owners.
- Reuse DB-M01 FOUNDATION (P0-P3) audit conventions.
- Test representative service operations.
- Document behavior when required audit persistence fails.
- Do not treat audit-table existence as proof of complete coverage.

**Owner:** Backend and security domains, with database support.

### 9.20 Migration breaks downstream references

**Risk:** A migration changes job, run, result, or artifact relationships without preserving compatibility.

**Impact:** Execution services and results consumers fail or lose historical associations.

**Mitigation:**

- Review compatibility before changing stable identifiers.
- Define migration and backfill requirements.
- Test with representative historical records.
- Coordinate with B-M05 EXECUTION (P5) and B-M06 RESULTS (P6-P7).
- Preserve references required by DB-M04 and its consumers.

**Owner:** Database domain and affected service owners.

### 9.21 Missing query-supporting indexes

**Risk:** Common job, run, telemetry, log, or result queries require expensive scans as data grows.

**Impact:** Slow history retrieval and increased database load.

**Mitigation:**

- Identify expected query patterns.
- Add indexes for required access paths.
- Validate index definitions through schema checks.
- Measure representative query behavior.
- Avoid claiming production-scale performance without evidence.

**Owner:** Database domain.

### 9.22 Metadata becomes an unbounded payload store

**Risk:** Arbitrary serialized worker output, log text, telemetry samples, or large result payloads accumulate in relational columns.

**Impact:** Excessive storage use, expensive queries, and unclear retention behavior.

**Mitigation:**

- Define the metadata-to-payload boundary.
- Reference the authoritative artifact or storage model.
- Set explicit size and format expectations for relational fields.
- Document payload retention and deletion ownership.
- Review exceptions before introducing large payload columns.

**Owner:** Database, backend, and infrastructure domains.

### 9.23 Summary fields diverge from authoritative run data

**Risk:** Cached job summaries or aggregate counters conflict with the underlying run records.

**Impact:** Status queries and reports return inconsistent information.

**Mitigation:**

- Define authoritative sources for each summary field.
- Document recomputation and refresh behavior.
- Update summaries consistently where required.
- Test summary values against representative run histories.
- Avoid introducing duplicate state without a clear purpose.

**Owner:** Backend execution domain, with database support.

### 9.24 Development tests are mistaken for production readiness

**Risk:** Passing schema tests is interpreted as proof of production retention, recovery, availability, or telemetry throughput.

**Impact:** Execution data is deployed without the required operational controls.

**Mitigation:**

- Record the environment used for verification.
- Separate schema correctness from operational readiness.
- Hand off requirements to P8 PRODUCTION.
- Require separate infrastructure and load validation.
- Avoid unsupported availability, recovery, or throughput claims.

**Owner:** P8 PRODUCTION and operational owners.

### 9.25 Documentation diverges from the schema

**Risk:** Job/run lifecycle, telemetry metadata, log references, or result provenance changes without corresponding documentation updates.

**Impact:** Services implement incompatible assumptions and persisted data becomes difficult to interpret.

**Mitigation:**

- Review schema documentation with migrations.
- Keep entity ownership explicit.
- Link changes to tasks and acceptance evidence.
- Record accepted changes in `CHANGELOG.md`.
- Review downstream impact before changing stable references.

**Owner:** Database domain and DB-M04 milestone owner.

---

## 10. Exit criteria

DB-M04 EXECUTION DATA may be declared complete only when the job, run, telemetry/log metadata, and results schema is implemented through the approved migration workflow and verified against the accepted integrity, lifecycle, provenance, and access-control requirements.

Acceptance requires evidence that retries preserve distinct attempts, metadata references remain valid, results retain required provenance, tenant boundaries hold, and failed transactions do not leave inconsistent records. The presence of tables alone is insufficient.

Detailed pass/fail conditions and evidence requirements belong in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection belong in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The implemented scope matches this dossier.
- [ ] Job and run persistence have explicit ownership.
- [ ] Attempt identity and retry-history semantics are documented.
- [ ] Telemetry stream and series metadata have explicit ownership.
- [ ] Log stream and segment metadata have explicit ownership.
- [ ] Result identity, lifecycle, and provenance have explicit ownership.
- [ ] DB-M01 FOUNDATION (P0-P3) remains authoritative for foundational identity, organization, project, migration, RLS, and audit conventions.
- [ ] DB-M02 CORE DATA (P3) remains authoritative for platform, resource, artifact, and storage metadata.
- [ ] DB-M03 BOOKING DATA (P4) remains authoritative for booking and commercial persistence.
- [ ] Execution orchestration remains with B-M05 EXECUTION (P5).
- [ ] Results service behavior remains with B-M06 RESULTS (P6-P7).
- [ ] Frontend presentation remains with F-M06 LIVE (P7) and F-M07 RESULTS (P7).
- [ ] External payload storage and production operations remain with their authoritative owners.
- [ ] Canonical phase and milestone references follow the frozen model.
- [ ] Sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Job schema

- [ ] Job records have stable identifiers.
- [ ] Required tenant and project ownership relationships are explicit.
- [ ] Job type or category follows the accepted contract.
- [ ] Job lifecycle values are documented and constrained where practical.
- [ ] Required lifecycle timestamps have clear semantics.
- [ ] Required context references are explicit.
- [ ] Invalid ownership or parent references are rejected.
- [ ] Job status history exists where required.
- [ ] Deletion and retention semantics preserve required history.
- [ ] Job-level state is distinct from individual run state.

### 10.3 Run schema and attempt history

- [ ] Run records have stable identifiers distinct from job identifiers.
- [ ] Each run references a valid parent job.
- [ ] Job-to-run cardinality follows the accepted contract.
- [ ] Attempt numbering or equivalent sequence metadata exists where required.
- [ ] Duplicate attempts are rejected where uniqueness is required.
- [ ] Retries preserve earlier run records.
- [ ] Run lifecycle values are documented and constrained where practical.
- [ ] Required lifecycle timestamps have clear semantics.
- [ ] Run status history exists where required.
- [ ] Correlation identifiers have documented scope.
- [ ] Required booking, artifact, platform, resource, and environment references are explicit.
- [ ] Invalid run relationships are rejected.

### 10.4 Telemetry metadata

- [ ] Telemetry streams have stable identities.
- [ ] Stream ownership and parent relationships are explicit.
- [ ] Required resource or signal references are defined.
- [ ] Series metadata has stable keys where applicable.
- [ ] Data type, unit, and schema version semantics are documented where required.
- [ ] Event time and ingestion time are distinguished where required.
- [ ] Stream start, end, and finalization semantics are documented.
- [ ] External sample storage is distinguished from relational metadata.
- [ ] Storage references do not expose unrestricted credentials.
- [ ] Integrity metadata has documented provenance where required.
- [ ] Retention and deletion responsibilities are explicit.

### 10.5 Log metadata

- [ ] Log streams have stable identities.
- [ ] Stream-to-job or stream-to-run relationships are explicit.
- [ ] Source, category, and format semantics are documented where required.
- [ ] Segment identity and ordering are deterministic where applicable.
- [ ] Required uniqueness constraints are implemented.
- [ ] Time bounds and checksum metadata follow the accepted contract where required.
- [ ] Retrieval references are stable and access-controlled.
- [ ] Raw log payload storage is distinguished from metadata.
- [ ] Retention and external cleanup responsibilities are explicit.
- [ ] RLS and service authorization protect log metadata and payload retrieval.

### 10.6 Results and provenance

- [ ] Results have stable identifiers.
- [ ] Result-to-run and result-to-job relationships follow the accepted contract.
- [ ] Result type and schema version are explicit where required.
- [ ] Result lifecycle values are documented and constrained where practical.
- [ ] Publication readiness is distinguished from simple payload creation.
- [ ] Required provenance references are present.
- [ ] Result artifact references use DB-M02 CORE DATA (P3) conventions.
- [ ] Multiple artifacts per result are supported where required.
- [ ] Historical result records remain interpretable under the accepted retention model.
- [ ] Result validation and publication behavior remain with B-M06 RESULTS (P6-P7).

### 10.7 Referential integrity and lifecycle

- [ ] Required foreign keys are implemented.
- [ ] Required uniqueness and check constraints are implemented.
- [ ] Optional versus mandatory relationships are documented.
- [ ] Deletion behavior is explicitly reviewed.
- [ ] Cascading deletion does not remove required execution or result history.
- [ ] Retention metadata distinguishes expiry from confirmed external cleanup.
- [ ] Status updates preserve required history.
- [ ] Failed operations do not leave partial or inconsistent relationships.

### 10.8 RLS, roles, and tenant isolation

- [ ] Every DB-M04-owned table has a documented ownership and visibility scope.
- [ ] Required RLS policies are present.
- [ ] Child records such as history, streams, segments, and results are protected.
- [ ] Policies are tested under the ordinary application role.
- [ ] Cross-organization access attempts are rejected.
- [ ] Missing or invalid tenant context fails closed where required.
- [ ] Privileged role and RLS-bypass assumptions are reviewed.
- [ ] Tenant context cannot leak across reused database connections.
- [ ] External payload retrieval has an authorization boundary outside PostgreSQL where required.

### 10.9 Audit integration

- [ ] DB-M04 reuses the audit conventions established by DB-M01 FOUNDATION (P0-P3).
- [ ] Required job, run, and result lifecycle audit actions are documented with the relevant owners.
- [ ] Relevant records can be associated with the required audit context.
- [ ] Application-level event emission remains assigned to the backend owner.
- [ ] Sensitive payloads and credentials are not copied unnecessarily into audit metadata.
- [ ] Audit integration does not introduce a competing audit schema.
- [ ] Representative audit-related integration tests pass.

### 10.10 Migration and schema verification

- [ ] DB-M04 migrations use the approved migration tooling and history.
- [ ] Migration identifiers and ordering are valid.
- [ ] A clean supported database can apply the full migration sequence.
- [ ] Dependencies on DB-M01 FOUNDATION (P0-P3), DB-M02 CORE DATA (P3), and DB-M03 BOOKING DATA (P4) are explicit.
- [ ] Migration failures are reported clearly.
- [ ] Migration history matches the expected schema state.
- [ ] Required tables and columns exist.
- [ ] Required foreign keys, unique constraints, and check constraints exist.
- [ ] Required indexes exist.
- [ ] Required RLS policies exist.
- [ ] Schema verification detects representative missing or altered objects.
- [ ] No undocumented manual schema changes are required.

### 10.11 Automated verification

- [ ] Tests run against an isolated supported PostgreSQL environment.
- [ ] Job identity and ownership tests pass.
- [ ] Run identity, cardinality, and attempt-sequencing tests pass.
- [ ] Lifecycle and history tests pass where required.
- [ ] Telemetry stream and series metadata tests pass.
- [ ] Log stream and segment metadata tests pass.
- [ ] Result identity, provenance, and artifact-reference tests pass.
- [ ] Referential integrity and deletion-behavior tests pass.
- [ ] RLS and cross-organization isolation tests pass.
- [ ] Retention metadata tests pass where required.
- [ ] Migration initialization and history tests pass.
- [ ] Failed transactions do not leave partial inconsistent state.
- [ ] Test results and required evidence are recorded in the sibling acceptance and review documents.

### 10.12 Downstream handoff

- [ ] B-M05 EXECUTION (P5) can use the schema for jobs, runs, and attempt history.
- [ ] P6 LAB & ROBOT can associate applicable lab and robot context with stable run references.
- [ ] B-M06 RESULTS (P6-P7) can persist and retrieve result records with required provenance.
- [ ] F-M06 LIVE (P7) can discover authorized telemetry and log metadata through approved contracts.
- [ ] F-M07 RESULTS (P7) can obtain stable result fields and artifact references through approved contracts.
- [ ] C-M03 STAGING (P4-P7) can satisfy the documented database and external-storage integration assumptions.
- [ ] P8 PRODUCTION receives the database, retention, and operational requirements.
- [ ] Known lifecycle, retention, and external-storage limitations are documented.
- [ ] No unresolved ownership conflict blocks downstream integration.

### 10.13 Documentation and traceability

- [ ] Job and run identity and lifecycle semantics are documented.
- [ ] Attempt sequencing and retry-history semantics are documented.
- [ ] Telemetry metadata and external sample-storage boundaries are documented.
- [ ] Log stream, segment, and retrieval-reference semantics are documented.
- [ ] Result identity, lifecycle, provenance, and artifact relationships are documented.
- [ ] RLS and tenant-context assumptions are documented.
- [ ] Retention and deletion boundaries are documented.
- [ ] Migration and schema verification workflows are documented.
- [ ] Known limitations and unresolved dependencies are explicit.
- [ ] Authoritative architecture, backend, security, cloud, testing, and release documents are linked.
- [ ] `TASKS.md` contains the detailed task decomposition.
- [ ] `ACCEPTANCE_CRITERIA.md` contains detailed pass/fail conditions and evidence requirements.
- [ ] `REVIEW_CHECKLIST.md` contains review actions and evidence inspection.
- [ ] `CHANGELOG.md` contains accepted change history.
- [ ] `GIT_COMMIT_STEP.md` contains the repository and commit procedure.

### 10.14 Final milestone acceptance

DB-M04 EXECUTION DATA is ready for formal acceptance when:

1. Jobs and runs have stable identities, explicit ownership, and valid relationships.
2. Attempt sequencing and retry history preserve distinct execution attempts according to the accepted contract.
3. Lifecycle status and timestamp semantics are documented and verified.
4. Telemetry and log metadata have stable identities, valid parent references, and clear external-storage boundaries.
5. Result records preserve the required run association, status, provenance, and artifact references.
6. Referential integrity, uniqueness, and lifecycle constraints are implemented and verified.
7. Required RLS policies protect execution and results metadata across tenant boundaries.
8. Required audit integration follows DB-M01 FOUNDATION (P0-P3) conventions.
9. Migrations and schema verification use the established database foundation.
10. Required automated tests pass, including representative retry, integrity, and tenant-isolation cases.
11. Backend and downstream owners can use the schema without duplicating job, run, telemetry, log, or result ownership.
12. Retention metadata and external payload cleanup boundaries are explicit.
13. Critical risks are mitigated or formally dispositioned by the relevant owners.
14. Required acceptance and review evidence is available through the sibling files.
15. No unresolved issue invalidates execution history, metadata integrity, result provenance, or tenant isolation.

Acceptance of DB-M04 EXECUTION DATA does not establish runtime execution correctness, physical robot safety, real-time telemetry guarantees, external storage durability, production recovery, or production-scale throughput. Those outcomes remain with the applicable backend, lab, cloud, and P8 PRODUCTION owners.
