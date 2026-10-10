# DB-M02 CORE DATA — Milestone Dossier

**Primary Phase:** P3 CONTROL PLANE

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION

**Domain:** Database

**Milestone:** DB-M02 CORE DATA (P3)

**Document Type:** Database milestone dossier

**Status:** Planning baseline

**Scope Authority:** This dossier defines the control-plane core data structures for platform registration, resource representation, artifact records, and storage metadata. Existing milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the milestone-level objectives, scope boundaries, dependencies, deliverables, risks, and exit criteria for DB-M02 CORE DATA.

DB-M02 CORE DATA extends the foundational PostgreSQL, migration, identity, organization, project, RLS, and audit capabilities established by DB-M01 FOUNDATION (P0-P3).

Its implementation scope covers the persistent data model for:

- Platform definitions and registered platform records.
- Platform versions, compatibility metadata, and lifecycle state.
- Resource definitions and resource inventory metadata within the control-plane scope.
- Resource types, capabilities, and supported configuration descriptors.
- Artifact records and their relationships to projects, platforms, and builds where applicable.
- Artifact version and immutable identity metadata.
- Storage object references and storage metadata.
- Artifact-to-storage relationships and integrity requirements.
- Platform-to-artifact compatibility references where required by the approved contracts.
- Resource availability or registration state only where needed by the control-plane data model.
- Relational constraints and indexes required by these entities.
- RLS policy integration for protected platform, resource, artifact, and storage metadata.
- Migration and schema verification for the DB-M02-owned tables.
- Data integrity and lifecycle conventions for the entities owned by this milestone.
- Handoffs to downstream database milestones and application domains.

The milestone defines what must persist, the relationships between records, and the integrity and access guarantees required at the database boundary.

It does not prescribe every SQL statement, API endpoint, service method, UI screen, storage provider, or deployment configuration.

### What this document does not own

The following responsibilities remain with their authoritative documents and milestones:

- Canonical phase definitions: `docs/planning/PHASES.md`.
- Cross-domain architectural decisions: `docs/planning/DECISIONS.md`.
- System architecture: `docs/architecture/`.
- Database foundation, migration conventions, identity, organization, project schema, foundational RLS, and audit foundation: DB-M01 FOUNDATION (P0-P3).
- Booking and commercial data: DB-M03 BOOKING DATA (P4).
- Execution, lab, live, and results persistence: DB-M04 EXECUTION DATA (P5-P7).
- Platform and resource API behavior: backend architecture and the applicable backend milestone dossiers.
- Application authentication and authorization decisions: P3 CONTROL PLANE and the security domain.
- Build orchestration, build execution, and artifact production: P2 BUILD & ARTIFACT and its authoritative milestone dossiers.
- Object-store implementation, upload/download flows, and physical storage lifecycle: the applicable backend, cloud, and artifact implementation documents.
- Artifact binary content: the approved object-storage or artifact-storage implementation; DB-M02 owns metadata and references, not binary payloads.
- Runtime execution dispatch and lifecycle: B-M05 EXECUTION (P5).
- Lab Agent and physical resource integration behavior: P6 LAB & ROBOT and its authoritative milestone dossiers.
- Live video, telemetry delivery, and results presentation: P7 LIVE & RESULTS and its authoritative milestone dossiers.
- Cloud environment provisioning, networking, credentials, and storage infrastructure: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Database infrastructure operations, production backup and recovery, and capacity management: P8 PRODUCTION and the applicable operational documents.
- Global testing policy: `docs/development/TESTING_STRATEGY.md`.
- Global release and deployment policy: `docs/development/RELEASE_PROCESS.md`.

### Ownership map

| Concern | Authoritative owner | DB-M02 CORE DATA responsibility |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Use the frozen model exactly |
| System architecture | `docs/architecture/` | Follow approved system boundaries |
| Cross-domain decisions | `docs/planning/DECISIONS.md` | Consume approved decisions |
| PostgreSQL and migration foundation | DB-M01 FOUNDATION (P0-P3) | Extend established conventions |
| Identity, organization, membership, and project foundation | DB-M01 FOUNDATION (P0-P3) | Reference existing foundational entities |
| Foundational RLS and audit conventions | DB-M01 FOUNDATION (P0-P3) | Apply approved conventions to owned records |
| Platform data model | DB-M02 CORE DATA (P3) | Own platform persistence |
| Resource data model | DB-M02 CORE DATA (P3) | Own control-plane resource persistence |
| Artifact metadata model | DB-M02 CORE DATA (P3) | Own artifact records and relationships within the milestone scope |
| Artifact binary content | Artifact/storage implementation owners | Store metadata and references only |
| Object-storage infrastructure | Cloud domain | Define required storage metadata and interface assumptions |
| Platform registration services | Backend domain | Provide persistence structures and integrity constraints |
| Resource registration services | Backend domain | Provide persistence structures and integrity constraints |
| Artifact registration and discovery services | Backend domain | Provide persistence structures and integrity constraints |
| Booking persistence | DB-M03 BOOKING DATA (P4) | Provide reusable platform/resource/artifact references where applicable |
| Execution and results persistence | DB-M04 EXECUTION DATA (P5-P7) | Provide reusable references and metadata conventions |
| Production infrastructure and operations | P8 PRODUCTION and operational owners | Document requirements and handoffs |
| DB-M02 tasks | `TASKS.md` | Link to task decomposition |
| DB-M02 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to pass/fail requirements |
| DB-M02 review | `REVIEW_CHECKLIST.md` | Link to review actions |
| DB-M02 change history | `CHANGELOG.md` | Link to accepted changes |
| DB-M02 Git procedure | `GIT_COMMIT_STEP.md` | Link to repository and commit procedure |

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

DB-M02 CORE DATA establishes the persistent control-plane data model for platforms, resources, artifacts, and storage metadata.

The milestone extends DB-M01 FOUNDATION (P0-P3) and supplies consistent, secure, and verifiable data structures that backend services can use to register, identify, query, and relate these entities.

The schema must support controlled evolution as platform capabilities expand, without duplicating identity, organization, project, migration, RLS, or audit foundations.

### 1.1 Primary outcomes

DB-M02 CORE DATA must deliver the following outcomes:

1. A canonical relational representation of registered platforms.
2. A defined platform identity and lifecycle model.
3. Explicit platform version and compatibility metadata where required.
4. A consistent representation of resource definitions and resource records.
5. A documented relationship between resources and their owning organization or platform context where applicable.
6. A canonical artifact metadata model.
7. Explicit relationships between artifacts and projects, platforms, or build records where required by approved contracts.
8. A storage metadata model that refers to binary content without placing large artifact payloads in ordinary relational tables.
9. Clear artifact identity, versioning, and immutability semantics.
10. Relational integrity for platform, resource, artifact, and storage metadata.
11. Appropriate indexes for registration, discovery, ownership, and lookup.
12. RLS integration consistent with DB-M01 FOUNDATION (P0-P3).
13. A repeatable migration workflow using the conventions established by DB-M01 FOUNDATION (P0-P3).
14. Automated verification of schema constraints, metadata relationships, and access boundaries.
15. Clear ownership boundaries for later booking, execution, lab, live, and results data.
16. Documentation sufficient for backend and cloud owners to implement the corresponding services and infrastructure.

### 1.2 Platform data outcome

The database must represent platforms as identifiable and queryable records.

The model must distinguish a platform's stable identity from mutable descriptive metadata, registration state, and version-specific compatibility details.

Platform records must support the approved registration and discovery contracts without embedding API behavior or frontend-specific presentation rules into the schema.

### 1.3 Resource data outcome

The database must represent the resources that the control plane needs to describe, register, and associate with platforms.

The model must distinguish resource identity, resource type, declared capabilities, configuration descriptors, and lifecycle or registration state where these concepts are required.

The milestone does not own physical device control, motor operation, lab execution, or runtime resource scheduling. Those behaviors belong to their respective phase and milestone owners.

### 1.4 Artifact metadata outcome

The database must represent artifact identity and metadata independently from artifact binary content.

Artifact records must be able to reference their owning project and other approved relationships, describe version and content identity, and retain the metadata required for registration and discovery.

The schema must not treat a storage URI by itself as proof that an artifact exists, is valid, is immutable, or is authorized for access. Those guarantees require validation and access controls from the owning services and storage implementation.

### 1.5 Storage metadata outcome

The database must provide a consistent representation of the location and characteristics of stored artifact content.

The model must support an opaque storage reference, storage backend or namespace identification where applicable, content size, checksum or digest, media or content type where required, and integrity-relevant metadata.

Storage metadata must remain separate from cloud provisioning and physical object lifecycle. The database records what the platform needs to know about stored content; the cloud and storage owners implement the infrastructure and object operations.

### 1.6 Security outcome

The schema must follow the tenant and access conventions established by DB-M01 FOUNDATION (P0-P3).

Protected platform, resource, artifact, and storage metadata must have explicit access expectations. Organization and project ownership must not be inferred from untrusted request fields without validation by the owning service.

Database policies and relational constraints must complement, not replace, service-level authentication and authorization.

### 1.7 Completion principle

DB-M02 CORE DATA is complete when its owned entities and relationships are represented in migrations, constrained by the approved integrity rules, protected according to the accepted access model, and verified through repeatable database tests.

Completion requires working schema changes and evidence of correct behavior, not merely design documents or table definitions.

Detailed pass/fail conditions belong in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

#### 2.1.1 Extension of the database foundation

DB-M02 CORE DATA must extend DB-M01 FOUNDATION (P0-P3) using its established conventions.

The implementation must reuse the approved:

- Identifier strategy.
- Migration tooling and history.
- Timestamp semantics.
- Constraint and index naming.
- Database roles and privilege model.
- RLS and tenant-context conventions.
- Audit persistence conventions.
- Schema verification workflow.

The milestone must not create a second migration system or a competing representation of identity, organization, membership, or project ownership.

#### 2.1.2 Platform identity

The platform schema must define a stable identifier for each registered platform.

The model must document:

- Platform identifier type.
- Required human-readable name or label.
- Optional machine-readable key or slug.
- Description or metadata fields where required.
- Lifecycle or registration status.
- Creation and update timestamps.
- Approved uniqueness rules.
- Ownership or visibility scope where applicable.

A display name must not be assumed to be a stable key unless the approved contract explicitly guarantees that behavior.

#### 2.1.3 Platform registration metadata

The schema must persist the metadata required to register and discover a platform.

The model may include approved fields for:

- Platform identity.
- Platform family or category.
- Supported target characteristics.
- Registration status.
- Metadata schema version.
- Documentation or descriptive references.
- Creation and update timestamps.
- Ownership and visibility context.

Only metadata needed by the accepted platform contract belongs in the schema. Arbitrary operational state must not be added without an identified owner and consumer.

#### 2.1.4 Platform versions

Where the approved contract supports multiple versions of a platform definition, the schema must represent version identity and compatibility explicitly.

The design must determine whether platform versions are separate records or versioned fields in a canonical record.

The selected representation must define:

- Version identifier or version value.
- Relationship to the stable platform identity.
- Version uniqueness scope.
- Compatibility metadata.
- Lifecycle and deprecation semantics.
- Whether published version records are mutable.
- How a consumer identifies the intended version.

Version representation must be consistent with the platform API contract. This dossier does not define version-negotiation behavior.

#### 2.1.5 Platform capabilities

The schema must represent platform capabilities when they are part of the registered platform contract.

Capabilities may describe supported interfaces, execution characteristics, resource classes, artifact formats, or other approved platform properties.

The model must distinguish authoritative capability metadata from transient observations or runtime health.

The schema must not claim that a platform capability is operationally available merely because it is declared in registration metadata.

#### 2.1.6 Platform lifecycle

Platform lifecycle or registration state must have explicit semantics.

Where lifecycle state is persisted, the schema must define:

- Supported values.
- Initial state.
- Permitted state changes, where enforceable at the data boundary.
- Meaning of deprecation or disablement.
- Behavior of references to unavailable platforms.
- Whether historical references remain valid after a platform is disabled.

Application-level state transitions belong to the backend service owner. The database must enforce applicable constraints and preserve the approved persistence semantics.

#### 2.1.7 Resource identity

The resource model must define stable identity for resource records required by the control plane.

The model must distinguish a resource's identifier from its mutable name, descriptive metadata, registration state, and declared capabilities.

Required fields and uniqueness rules must be documented according to the approved resource contract.

The milestone must not conflate a resource definition with a live physical resource instance unless the approved architecture explicitly defines them as the same entity.

#### 2.1.8 Resource types and descriptors

Where the approved resource contract uses resource types or descriptors, the schema must represent them consistently.

The design may include:

- Resource type or class.
- Supported interface descriptors.
- Capability metadata.
- Configuration schema references.
- Platform compatibility references.
- Lifecycle or registration state.
- Ownership or visibility scope.
- Creation and update timestamps.

Descriptors must have documented semantics and versioning rules where their structure may evolve.

The schema should avoid storing uncontrolled executable content in descriptor fields.

#### 2.1.9 Resource-to-platform relationships

Where a resource is associated with a platform, the relationship must be explicit.

The schema must define whether a resource can be associated with one platform, multiple platforms, or a platform family.

The relationship must enforce the approved cardinality and referential integrity.

A resource must not appear compatible with a platform solely because the frontend or backend submitted an unvalidated identifier.

Physical assignment, reservation, and runtime scheduling are outside this milestone.

#### 2.1.10 Resource ownership and scope

The model must identify the ownership or visibility scope of a resource when required by the approved contract.

Possible scopes may include shared platform metadata and organization-scoped records, but the accepted design must specify which applies to each entity.

The schema must reuse the organization and identity relationships established by DB-M01 FOUNDATION (P0-P3).

It must not introduce an independent organization identifier scheme or assume that every resource is globally visible.

#### 2.1.11 Resource lifecycle and registration state

Resource registration state must be explicit where persisted.

The model must distinguish declared or registered metadata from live operational availability.

A record marked registered must not imply that the resource is currently reachable, healthy, reserved, or safe to operate.

Runtime health and physical state belong to the appropriate backend, execution, lab, and robot owners.

#### 2.1.12 Artifact identity

The artifact schema must define a stable artifact identifier.

The design must distinguish:

- Logical artifact identity.
- Artifact version.
- Content identity or digest.
- Storage object reference.
- Project ownership.
- Registration or lifecycle state.
- Creation and registration timestamps.

These concepts must not be collapsed into one mutable filename or storage path.

The approved artifact contract determines which of these are separate records and which are attributes.

#### 2.1.13 Artifact metadata

Artifact records must store the metadata required for registration and discovery.

Depending on the accepted artifact contract, metadata may include:

- Stable artifact identifier.
- Display name.
- Artifact type or format.
- Version or revision.
- Project identifier.
- Platform compatibility references.
- Build provenance reference, where applicable.
- Content digest.
- Content size.
- Storage metadata reference.
- Registration status.
- Creation timestamp.
- Optional descriptive metadata.

The artifact metadata schema must avoid embedding large binary payloads in ordinary relational columns.

The artifact service defines the API and validation flow. DB-M02 defines persistence requirements and constraints.

#### 2.1.14 Artifact-to-project relationship

Where an artifact belongs to a project, the schema must use the project identity established by DB-M01 FOUNDATION (P0-P3).

The relationship must define whether project ownership is mandatory and how artifact visibility follows the approved ownership model.

The database must prevent dangling project references where the relationship is required.

An artifact's project association must not be inferred from a display name, file path, or caller-supplied organization label.

#### 2.1.15 Artifact versioning

The artifact model must define version identity and uniqueness.

The design must clarify whether a version represents a user-visible revision, a content revision, or another approved contract concept.

Where artifact versions are immutable, the database constraints and service behavior must prevent silent replacement of the content associated with a published version.

If a new revision is created, the schema must preserve a clear relationship to the logical artifact identity.

The exact versioning API and publication workflow belong to the artifact service owner.

#### 2.1.16 Artifact provenance references

Where build provenance is part of the approved contract, the artifact schema must be able to reference the relevant build or source metadata without duplicating the build system's entire data model.

The relationship must be optional or mandatory according to the artifact type and accepted contract.

The artifact metadata model must not become the owner of build jobs, build logs, build scheduling, or build execution.

Those concerns belong to P2 BUILD & ARTIFACT and the applicable backend milestone dossiers.

#### 2.1.17 Platform compatibility metadata

Where an artifact targets one or more platforms, the schema must represent the compatibility relationship explicitly.

The design must define:

- Whether compatibility references a platform or a specific platform version.
- Whether multiple compatible platforms are permitted.
- How compatibility metadata is versioned.
- How references to deprecated platforms are interpreted.
- Whether compatibility is declared by the producer or validated by a trusted service.

The schema records the approved compatibility declaration. It does not prove that an artifact executes correctly on a platform.

#### 2.1.18 Storage metadata identity

The storage metadata model must define a stable database identifier for each storage metadata record where a separate entity is needed.

It must distinguish the database identifier from the storage backend's object key or URI.

The schema must define the relationship between an artifact record and its stored content, including whether one artifact version can reference multiple content objects or only one.

The accepted design must prevent accidental ambiguity between logical artifact identity and physical object identity.

#### 2.1.19 Storage location reference

The schema must store an opaque storage reference sufficient for the trusted storage adapter to locate the object.

The reference may consist of a backend identifier, namespace or bucket reference, and object key, depending on the approved storage abstraction.

The schema must not hard-code credentials into storage references.

Presigned URLs, short-lived access tokens, and other temporary access credentials must not be persisted as durable storage identity.

Cloud architecture owns the storage infrastructure and credential delivery.

#### 2.1.20 Storage content metadata

Where available and required, storage metadata must include:

- Content digest or checksum.
- Content size.
- Media or content type.
- Content encoding where applicable.
- Object generation or revision reference where supported.
- Verification status or timestamp where required.
- Creation or registration timestamp.
- Storage backend or namespace identifier.

The exact fields must follow the approved artifact and storage contracts. The schema must not claim checksum verification occurred unless a trusted process has performed and recorded it.

#### 2.1.21 Artifact-storage relationship

The schema must define the relationship between artifact versions and stored content.

The relationship must clarify:

- Whether an artifact version has exactly one canonical content object.
- Whether multiple storage replicas or copies are represented.
- Whether the same content object can be referenced by multiple logical artifacts.
- How a missing or inaccessible object is represented.
- How object replacement or relocation affects the reference.
- Which service is responsible for verifying object existence and content integrity.

These semantics must be explicit before dependent services rely on the metadata.

#### 2.1.22 Storage state and integrity

Where storage state is persisted, its values must have defined meanings.

A database record must distinguish metadata registration from actual object availability.

The schema must not treat the presence of a storage reference as proof that the object can be retrieved.

If integrity verification state is stored, the model must define who records it, when it becomes valid, and how it becomes stale after object replacement or relocation.

Object upload, download, deletion, replication, and integrity-check execution belong to the storage implementation owners.

#### 2.1.23 Metadata immutability and updates

The schema and service contract must distinguish mutable descriptive metadata from fields that define content identity or published artifact identity.

Where an artifact version is immutable, updates to content digest, size, or canonical storage identity must be constrained by the approved lifecycle model.

The design must not silently change the content associated with an existing immutable version.

If correction or replacement is allowed, the model must make the operation explicit and preserve the required provenance.

The database should enforce immutable relationships where practical; service-level authorization and workflow rules remain with the backend owner.

#### 2.1.24 Relational integrity

DB-M02 must define and implement the foreign keys, unique constraints, check constraints, and deletion behavior required by its owned entities.

The schema must prevent invalid references between:

- Platforms and platform versions.
- Platforms and resource descriptors.
- Resources and their applicable platform associations.
- Artifacts and projects.
- Artifacts and platform compatibility records.
- Artifact versions and storage metadata.
- Artifact records and approved provenance references.

Not every relationship is mandatory for every artifact or resource type. Optionality must be explicit in the approved data model.

#### 2.1.25 Indexing and discovery support

The schema must include indexes required for the accepted platform, resource, artifact, and storage metadata access patterns.

Potential access paths include:

- Platform identity and registration lookup.
- Platform version lookup.
- Resource lookup by stable identifier and approved type.
- Resource lookup within its ownership scope.
- Artifact lookup by identifier and version.
- Artifact lookup within a project.
- Artifact compatibility lookup.
- Storage metadata lookup by artifact version.
- Audit correlation where inherited conventions require it.

Indexes must support known access patterns without claiming to define query APIs or performance service objectives.

#### 2.1.26 RLS integration

DB-M02-owned tables must follow the RLS and tenant-context conventions established by DB-M01 FOUNDATION (P0-P3).

The schema review must identify which entities are globally shared metadata and which are tenant- or project-scoped.

Policies must match the approved visibility and ownership semantics.

The model must not make platform definitions globally writable merely because they are globally readable. Shared reference data and mutable registration data may require different privilege boundaries.

#### 2.1.27 Audit integration

Changes to platform, resource, artifact, and storage metadata must use the audit conventions established by DB-M01 FOUNDATION (P0-P3) where the approved audit policy requires them.

DB-M02 must define the data relationships needed for relevant audit records to identify the affected entity.

It does not independently redefine the audit-event schema or own application-level audit emission for every service operation.

The backend and security owners determine which actions require audit events and ensure that services emit them.

#### 2.1.28 Schema migrations

All DB-M02 schema changes must use the migration tooling and history established by DB-M01 FOUNDATION (P0-P3).

Migrations must be ordered, reviewable, and compatible with the supported development workflow.

The milestone must include migration tests for clean initialization and schema extension.

The migration system must not introduce an alternative history table or an independent migration execution path for these entities.

#### 2.1.29 Schema verification

The DB-M02 verification workflow must confirm that the expected tables, columns, constraints, indexes, foreign keys, and required RLS policies exist.

Verification must also check critical semantic assumptions, such as artifact version uniqueness and the required relationships between artifact records and project ownership.

A schema check must not claim to validate physical object existence unless it invokes an appropriate trusted storage verification process.

#### 2.1.30 Database tests

Tests must cover the correctness of the DB-M02 data model.

Relevant cases include:

- Platform registration metadata and uniqueness.
- Platform version identity and constraints.
- Resource identity and platform associations.
- Artifact-to-project integrity.
- Artifact version uniqueness and immutability constraints.
- Platform compatibility references.
- Storage metadata and artifact-storage relationships.
- Invalid foreign-key rejection.
- Required RLS behavior.
- Organization and project isolation.
- Migration initialization and history.
- Audit integration requirements.

Global test conventions belong to `docs/development/TESTING_STRATEGY.md`.

#### 2.1.31 Development and integration environment

The milestone must provide a documented workflow for applying DB-M02 migrations to a supported database already initialized through DB-M01 FOUNDATION (P0-P3).

The workflow must identify prerequisites, migration commands, verification commands, and test execution.

It must not require manual creation of schema objects outside the migration workflow.

Cloud provisioning and shared environment configuration remain with the cloud domain.

#### 2.1.32 Data integrity and error behavior

The database must reject invalid data that violates required constraints.

Relevant cases include:

- Duplicate platform identifiers or versions.
- Invalid resource-to-platform references.
- Artifact references to nonexistent projects.
- Duplicate immutable artifact versions.
- Invalid artifact-storage references.
- Invalid compatibility references.
- Disallowed changes to immutable metadata.
- RLS violations.

The backend owns mapping database errors to API contracts. DB-M02 must ensure that required database constraints and policy failures are observable to trusted callers and test infrastructure.

#### 2.1.33 Documentation and handoff

DB-M02 must document its owned entities, relationships, constraints, indexes, RLS assumptions, and migration requirements.

The documentation must identify which concerns belong to the platform, resource, artifact, and storage service owners.

It must also identify the schema conventions that later database milestones must follow.

Task breakdown, detailed acceptance evidence, review execution, change history, and commit procedure remain in sibling files.

### 2.2 Explicit non-scope

The following are outside DB-M02 CORE DATA unless an approved scope change explicitly assigns them to this milestone:

- PostgreSQL installation and foundational migration tooling.
- Identity, organization, membership, and project foundation schema.
- Foundational RLS and audit schema definitions.
- Booking, reservation, billing, credits, and commercial transaction tables.
- Execution jobs, dispatch state, retries, and execution history.
- Lab Agent state and physical robot inventory or control behavior beyond approved resource metadata.
- Live video sessions, telemetry streams, and results persistence.
- Build job scheduling and build execution.
- Artifact binary storage, upload, download, and deletion implementations.
- Object-store provisioning and lifecycle policy implementation.
- Presigned URL generation and credential management.
- Runtime resource allocation and reservation.
- Physical hardware control, device health, and motor safety logic.
- API routes, request validation, service methods, and frontend workflows.
- Application authentication and global authorization policy.
- Cloud infrastructure provisioning, network configuration, and secret delivery.
- Production backup, recovery, replication, high availability, and capacity management.
- Data warehouse design and analytics pipelines.
- Global CI, repository workflow, and release orchestration.
- Production-scale performance guarantees without representative measurement.

DB-M02 may define the schema relationships and interface assumptions required by these capabilities. It must not take over their implementation ownership.

### 2.3 Canonical phase relationship table

| Phase | Relationship to DB-M02 CORE DATA | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies engineering and database foundation conventions | DB-M02 follows established migration, schema, and test conventions |
| P1 STUDIO | Consumes project and organization relationships | DB-M02 does not own Studio behavior |
| P2 BUILD & ARTIFACT | Produces and consumes build/artifact information | DB-M02 owns artifact metadata persistence within its scope, not build execution or binary storage |
| P3 CONTROL PLANE | Primary phase for DB-M02 CORE DATA | DB-M02 owns platform, resource, artifact, and storage metadata schema within the approved scope |
| P4 BOOKING & COMMERCIAL | Consumes applicable platform, resource, and artifact references | DB-M03 BOOKING DATA (P4) owns booking and commercial persistence |
| P5 EXECUTION | Consumes approved platform, resource, and artifact references | DB-M04 EXECUTION DATA (P5-P7) owns execution persistence |
| P6 LAB & ROBOT | Consumes approved resource and platform metadata | DB-M04 EXECUTION DATA (P5-P7) owns applicable lab and robot persistence |
| P7 LIVE & RESULTS | Consumes applicable artifact and resource references | DB-M04 EXECUTION DATA (P5-P7) owns live and results persistence |
| P8 PRODUCTION | Uses the data model under production operational controls | Production operations and infrastructure remain with P8 PRODUCTION and the applicable operational owners |

### 2.4 Canonical database milestone relationship table

| Database milestone | Phase mapping | Relationship to DB-M02 CORE DATA |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies PostgreSQL, migration, identity, organization, project, RLS, and audit foundations |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Owns platforms, resources, artifacts, and storage metadata within this dossier's scope |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Owns booking and commercial persistence |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Owns execution, lab, live, and results persistence within its defined scope |

### 2.5 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to DB-M02 CORE DATA |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Consumes foundational application context |
| Frontend | F-M02 PROJECTS (P1) | Consumes project and organization relationships |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Consumes artifact metadata through approved backend contracts |
| Frontend | F-M04 BOOKING (P4) | Consumes booking data owned by the booking domain |
| Frontend | F-M05 EXECUTION (P5) | Consumes execution data owned by the execution domain |
| Frontend | F-M06 LIVE (P7) | Consumes live data through approved service contracts |
| Frontend | F-M07 RESULTS (P7) | Consumes result data through approved service contracts |
| Backend | B-M01 CONTROL PLANE (P3) | Uses platform, resource, artifact, and storage metadata persistence |
| Backend | B-M02 ARTIFACT (P2-P3) | Uses artifact metadata and storage references; owns the corresponding service behavior |
| Backend | B-M03 PLATFORM (P3) | Uses platform and resource persistence |
| Backend | B-M04 BOOKING (P4) | Uses applicable references while owning booking service behavior |
| Backend | B-M05 EXECUTION (P5) | Uses applicable references while owning execution service behavior |
| Backend | B-M06 RESULTS (P6-P7) | Uses applicable references while owning results service behavior |
| Backend | B-M07 PRODUCTION (P8) | Uses the schema under production operational controls |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies the foundational schema and security conventions |
| Database | DB-M02 CORE DATA (P3) | Owns the core control-plane data model described here |
| Database | DB-M03 BOOKING DATA (P4) | Owns booking and commercial persistence |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Owns execution, lab, live, and results persistence |
| Cloud | C-M01 FOUNDATION (P0) | Supplies cloud foundation conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development environment infrastructure |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for downstream integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and deployment controls |

### 2.6 Required data invariants

All DB-M02 implementations must preserve these invariants:

- **Stable platform identity:** platform identifiers are stable and separate from display names.
- **Explicit resource identity:** resource identity is not inferred from mutable descriptive metadata.
- **Defined relationships:** resource-to-platform and artifact-to-project relationships follow explicit cardinality and integrity rules.
- **Artifact identity separation:** logical artifact identity, artifact version, content digest, and storage object reference are distinct concepts.
- **Metadata-content separation:** binary content is not stored in ordinary metadata records without an explicit approved design.
- **Immutable version semantics:** published immutable artifact versions cannot be silently rebound to different content.
- **Storage-reference integrity:** storage metadata has defined identity and cannot be mistaken for proof of object availability.
- **Foundational reuse:** identity, organization, membership, project, RLS, audit, and migration conventions come from DB-M01 FOUNDATION (P0-P3).
- **Least privilege:** access to protected metadata follows the approved database role and RLS model.
- **Tenant isolation:** organization- and project-scoped records remain protected by the approved access boundary.
- **Auditable changes:** relevant metadata changes use the established audit conventions.
- **Migration traceability:** all schema changes are recorded in the approved migration history.
- **Domain ownership:** booking and execution schemas remain with their respective database milestones.
- **No implied runtime state:** registered metadata does not prove that a resource or stored object is currently available.
- **Documented limitations:** the schema does not claim guarantees that depend on unimplemented services or infrastructure.

---

## 3. Dependencies

### 3.1 DB-M01 FOUNDATION (P0-P3)

DB-M02 depends on DB-M01 FOUNDATION for:

- PostgreSQL baseline and supported environment assumptions.
- Migration tooling and migration history.
- Identifier conventions.
- Timestamp conventions.
- Primary-key, foreign-key, and index conventions.
- Identity and organization relationships.
- Project ownership and identity references.
- RLS and tenant-context conventions.
- Database role and privilege expectations.
- Audit persistence and provenance conventions.
- Schema verification and database test workflow.

DB-M02 must extend these foundations rather than create competing conventions.

If a required foundational contract is not yet available, the dependency must be recorded and the affected DB-M02 deliverable must not be accepted based on an undocumented assumption.

### 3.2 P2 BUILD & ARTIFACT

Artifact metadata may depend on build provenance and artifact identity conventions established by P2 BUILD & ARTIFACT.

The required contract must identify:

- Which build or source references may be persisted.
- Whether an artifact can exist without a build record.
- How artifact version identity is represented.
- Which metadata is supplied by the producer.
- Which metadata must be verified by a trusted service.
- How platform compatibility is expressed.

DB-M02 owns the artifact metadata persistence within its defined scope. Build execution, job lifecycle, and artifact production remain with P2 BUILD & ARTIFACT and the applicable backend milestone owners.

### 3.3 P3 CONTROL PLANE

P3 CONTROL PLANE provides the service and authorization context in which platform, resource, artifact, and storage metadata are managed.

The schema must align with the approved contracts for:

- Platform registration and discovery.
- Resource registration and discovery.
- Artifact registration and metadata retrieval.
- Project ownership.
- Organization visibility.
- Lifecycle state.
- Metadata validation.
- Audit requirements.

DB-M02 owns the persistent data model. The backend domain owns endpoint behavior, request validation, business rules, and service-level authorization.

### 3.4 P1 STUDIO

P1 STUDIO consumes project and organization records established by DB-M01 FOUNDATION (P0-P3).

DB-M02 must ensure that artifact and platform-related metadata can reference these stable foundational identifiers where required.

DB-M02 does not own project creation workflows, Studio UI state, or project navigation.

### 3.5 Backend platform and artifact services

The backend requires a stable schema contract for platform, resource, artifact, and storage metadata.

Required alignment includes:

- Entity identifiers and versioning.
- Relationship cardinality.
- Required and optional fields.
- Lifecycle state semantics.
- Uniqueness rules.
- Transaction boundaries where cross-record consistency is required.
- Error behavior for constraint violations.
- RLS and tenant-context propagation.
- Audit-event emission responsibilities.

The backend architecture and applicable backend milestone dossiers own service implementation. DB-M02 supplies persistence structures and integrity guarantees.

### 3.6 Cloud storage architecture

The storage metadata model depends on an approved storage abstraction.

Required inputs include:

- Stable storage backend identification.
- Object key or opaque reference semantics.
- Namespace or bucket reference semantics where applicable.
- Content digest and size representation.
- Object version or generation semantics where supported.
- Expected object verification behavior.
- Separation of durable object identity from temporary access URLs.
- Handling of missing, inaccessible, or replaced objects.

Cloud architecture owns storage infrastructure, credentials, networking, and lifecycle operations. DB-M02 owns the relational metadata and references required by the platform.

### 3.7 Artifact immutability contract

Artifact versioning and storage metadata depend on an approved immutability contract.

The contract must define:

- Whether published versions are immutable.
- Which metadata may change after registration.
- Whether content can be replaced in place.
- How a new revision is represented.
- How content digests are calculated and verified.
- How object relocation affects the database reference.
- How corrections are recorded without losing required provenance.

If immutability semantics are unresolved, the schema must not imply that mutable content references are immutable.

### 3.8 Platform compatibility contract

The schema depends on an agreed representation of platform compatibility.

The contract must identify whether compatibility references a platform, a platform version, or another stable target identity.

It must also define the expected behavior when a referenced platform is deprecated or disabled.

DB-M02 persists compatibility metadata. It does not guarantee runtime compatibility or execute compatibility validation.

### 3.9 Resource model contract

The resource schema depends on an agreed distinction between resource definitions, registered resources, and physical resource instances.

Required decisions include:

- Stable resource identity.
- Resource type and capability semantics.
- Platform association cardinality.
- Ownership and visibility scope.
- Registration and lifecycle state.
- Whether descriptors are versioned.
- Which fields are authoritative declarations versus runtime observations.

Physical hardware control, lab scheduling, live health, and execution-time resource assignment remain outside DB-M02.

### 3.10 Security architecture

The schema must follow the security conventions established by DB-M01 FOUNDATION (P0-P3) and the authoritative security architecture.

Required alignment includes:

- Which platform records are globally readable.
- Which registration records are organization-scoped.
- Which artifact records are project-scoped.
- How storage metadata access follows artifact authorization.
- Which roles may create, update, or disable records.
- How privileged service operations are constrained.
- Which metadata changes require audit events.

RLS must be tested against the actual database role model. Application-level authorization remains mandatory.

### 3.11 Migration and schema verification tooling

DB-M02 depends on the migration and verification tooling established by DB-M01 FOUNDATION (P0-P3).

The workflow must support:

- Applying DB-M02 migrations after the foundation.
- Tracking migration history.
- Detecting failures.
- Verifying expected tables and constraints.
- Validating required indexes and RLS policies.
- Running isolated database tests.
- Reproducing the schema in a clean supported environment.

DB-M02 must not create a separate migration history or require undocumented manual schema modifications.

### 3.12 Database test environment

DB-M02 requires an isolated PostgreSQL environment capable of exercising the owned schema.

The environment must provide the required roles and policies to test:

- Valid platform and resource records.
- Invalid references.
- Artifact and storage metadata relationships.
- Version uniqueness and immutable content identity.
- Tenant and project isolation.
- Migration ordering.
- Audit integration.

Tests must not mutate shared or production databases.

### 3.13 Downstream domain dependencies

Later database milestones may reference platform, resource, artifact, and storage metadata.

DB-M02 must publish stable identifiers and relationships that downstream owners can use without creating duplicate concepts.

- DB-M03 BOOKING DATA (P4) may reference eligible platforms or resources in booking-related records.
- DB-M04 EXECUTION DATA (P5-P7) may reference platforms, resources, artifacts, or storage metadata where required by execution and results contracts.

The downstream milestones own their own data structures and lifecycle semantics.

### 3.14 Dependency readiness criteria

A dependency is ready when:

- Its authoritative owner is identified.
- Required data or service contracts are documented.
- Schema ownership is clear.
- Required identifiers and relationship semantics are agreed.
- Security implications are reviewed.
- Unresolved assumptions are explicitly recorded.
- DB-M02 can test the relevant database-level behavior.

Dependencies must be classified as blocking, conditionally blocking, or non-blocking.

- **Blocking:** the schema cannot be correctly or securely established without the dependency.
- **Conditionally blocking:** implementation can proceed, but acceptance of the affected capability must wait.
- **Non-blocking:** the dependency affects an optional or later capability without invalidating the accepted core schema.

Detailed dependency assignments and sequencing belong in `TASKS.md`.

### 3.15 Cross-phase handoff table

| Handoff | Producing phase or milestone | Consuming phase or milestone | Required evidence |
|---|---|---|---|
| Foundational identifiers and migration conventions | DB-M01 FOUNDATION (P0-P3) | DB-M02 CORE DATA (P3) | Owned schema extends the established foundation |
| Project ownership references | DB-M01 FOUNDATION (P0-P3) | DB-M02 CORE DATA (P3) | Artifact metadata references approved project identifiers |
| Build and artifact contract | P2 BUILD & ARTIFACT | DB-M02 CORE DATA (P3) | Artifact metadata fields and provenance relationships are agreed |
| Platform and resource registration contracts | P3 CONTROL PLANE | DB-M02 CORE DATA (P3) | Required platform and resource entities and relationships are documented |
| Artifact metadata persistence | DB-M02 CORE DATA (P3) | P2 BUILD & ARTIFACT | Approved artifact identifiers and metadata relationships are available |
| Platform and resource persistence | DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Platform and resource services can use stable records and constraints |
| Project-facing metadata access | DB-M02 CORE DATA (P3) | P1 STUDIO | Approved backend contracts can retrieve applicable metadata |
| Booking reference integration | DB-M02 CORE DATA (P3) | DB-M03 BOOKING DATA (P4) | Eligible references and their lifecycle semantics are documented |
| Execution and results reference integration | DB-M02 CORE DATA (P3) | DB-M04 EXECUTION DATA (P5-P7) | Eligible references and their lifecycle semantics are documented |
| Storage environment requirements | Database domain | C-M02 DEVELOPMENT (P1-P3) | Development environment can provide required storage connectivity |
| Storage metadata contract | DB-M02 CORE DATA (P3) | Cloud and artifact implementation owners | Durable object references and content metadata semantics are documented |
| Production data requirements | Database domain | P8 PRODUCTION | Operational constraints and unresolved requirements are handed off |

### 3.16 Dependency change control

Changes to platform identity, resource identity, artifact versioning, or storage reference semantics may affect several services and later database milestones.

A proposed change must identify:

- The entity or relationship being changed.
- The reason for the change.
- The affected migrations and constraints.
- The affected API and service contracts.
- The effect on artifact immutability.
- The effect on RLS and ownership.
- The effect on downstream references.
- The compatibility and migration strategy.
- The owners who must review the change.

Foundational changes must be coordinated with DB-M01 FOUNDATION (P0-P3). Changes to booking and execution records must be reviewed with DB-M03 BOOKING DATA (P4) and DB-M04 EXECUTION DATA (P5-P7), respectively.

---

## 4. Deliverables

### 4.1 Core data schema specification

Deliver a schema specification covering platform, resource, artifact, and storage metadata entities.

The specification must identify table ownership, identifiers, required attributes, relationships, uniqueness rules, lifecycle semantics, and security scope.

**Completion evidence:** the schema is reviewable and aligned with the approved backend and system contracts.

### 4.2 Platform schema

Deliver platform identity and registration metadata persistence.

The schema must define stable platform identifiers, required fields, lifecycle or registration state, and approved uniqueness constraints.

Where platform versions are separate records, their relationship and uniqueness rules must be explicit.

**Completion evidence:** automated tests verify valid platform records, uniqueness behavior, and invalid relationship rejection.

### 4.3 Platform version and compatibility schema

Deliver version and compatibility metadata where required by the approved contract.

The model must define how a platform version relates to the stable platform identity and how compatibility records reference the relevant platform or version.

**Completion evidence:** tests verify version uniqueness and referential integrity for compatibility references.

### 4.4 Platform lifecycle constraints

Deliver the database constraints required for persisted platform lifecycle or registration state.

The schema must define valid values and prevent invalid values where practical.

Service-level transition rules remain with the backend owner.

**Completion evidence:** tests verify accepted and rejected state values and required lifecycle fields.

### 4.5 Resource schema

Deliver resource identity and metadata persistence for the approved control-plane resource model.

The schema must define stable identifiers, required descriptive fields, type or class representation, ownership or visibility scope, and registration state where required.

**Completion evidence:** tests verify resource identity, required attributes, and applicable uniqueness constraints.

### 4.6 Resource type and capability metadata

Deliver the approved persistence representation for resource types, capability descriptors, and configuration schema references.

The model must define versioning and validation expectations where descriptor structures can evolve.

**Completion evidence:** schema and service-contract tests verify that the stored representation follows the approved descriptor contract.

### 4.7 Resource-to-platform relationships

Deliver explicit relational links between resources and platforms where required.

The schema must enforce the accepted cardinality and prevent invalid platform references.

**Completion evidence:** tests verify valid associations, invalid reference rejection, and the intended handling of multiple platform associations.

### 4.8 Resource ownership and access scope

Deliver ownership and visibility relationships for resources where required by the approved model.

The implementation must reuse foundational organization and identity identifiers and apply the approved RLS conventions.

**Completion evidence:** tests demonstrate that protected resource metadata cannot be read or modified outside the authorized scope.

### 4.9 Artifact metadata schema

Deliver artifact records and required metadata fields.

The schema must distinguish artifact identity, version, content identity, project relationship, platform compatibility, and storage metadata reference as required by the approved contract.

**Completion evidence:** tests verify artifact creation, required metadata, uniqueness, and relational integrity.

### 4.10 Artifact-to-project relationship

Deliver the artifact relationship to the project schema established by DB-M01 FOUNDATION (P0-P3).

The model must enforce the required ownership reference and support the approved project-scoped access policy.

**Completion evidence:** tests reject nonexistent project references and verify applicable ownership constraints.

### 4.11 Artifact versioning and immutability

Deliver the schema constraints and lifecycle conventions needed for artifact version identity.

Where versions are immutable, the design must prevent silent reassignment of an existing published version to different content.

**Completion evidence:** tests verify version uniqueness and the accepted behavior for attempted content-identity changes.

### 4.12 Artifact provenance reference

Deliver the optional or mandatory provenance reference required by the approved artifact contract.

The schema must reference the appropriate source or build entity without duplicating the build system's complete data model.

**Completion evidence:** tests verify the intended optionality, reference integrity, and invalid reference behavior.

### 4.13 Platform compatibility relationships

Deliver artifact compatibility relationships to platforms or platform versions.

The schema must represent multiple compatible targets where required and enforce referential integrity.

**Completion evidence:** tests verify valid compatibility records, uniqueness where required, and rejection of invalid references.

### 4.14 Storage metadata schema

Deliver storage metadata records and the relationships needed to locate stored artifact content through the approved storage abstraction.

The schema must distinguish a durable storage reference from temporary access credentials or URLs.

**Completion evidence:** schema inspection and tests verify storage identity, required metadata, and artifact relationship integrity.

### 4.15 Content integrity metadata

Deliver persistence for content digest, size, content type, and other approved integrity-relevant metadata.

The schema must not claim that content verification occurred merely because a digest value exists.

**Completion evidence:** tests verify field constraints and the distinction between declared metadata and recorded verification state.

### 4.16 Artifact-storage relationship

Deliver the approved relationship between artifact versions and storage metadata.

The relationship must define cardinality, optionality, and the handling of missing or replaced object references.

**Completion evidence:** tests verify valid associations, invalid reference rejection, and the approved behavior for shared or version-specific content objects.

### 4.17 Storage metadata lifecycle

Deliver persistence semantics for storage metadata state where the approved contract requires it.

The schema must distinguish metadata registration from object availability and integrity verification.

**Completion evidence:** tests verify that state values have defined meanings and that invalid transitions or values are rejected where the database can enforce them.

### 4.18 Relational constraints

Deliver required primary keys, foreign keys, unique constraints, and check constraints for all DB-M02-owned entities.

Deletion behavior must be explicit where references may be retained by downstream records or audit history.

**Completion evidence:** automated tests exercise representative valid and invalid relational operations.

### 4.19 Indexes for core data

Deliver indexes required for platform lookup, resource lookup, artifact version lookup, project-scoped discovery, compatibility lookup, and storage metadata retrieval.

The indexes must correspond to known access patterns.

**Completion evidence:** schema inspection confirms the required indexes exist and their purposes are documented.

### 4.20 RLS integration

Deliver RLS policies or policy extensions required for DB-M02-owned tables, following DB-M01 FOUNDATION (P0-P3).

The implementation must distinguish shared reference metadata from tenant- or project-scoped records.

**Completion evidence:** tests under the ordinary application role verify the approved visibility and write boundaries, including negative cross-organization cases where applicable.

### 4.21 Audit integration

Deliver the required schema relationships and metadata fields needed to use the established audit foundation for relevant platform, resource, artifact, and storage metadata changes.

The milestone must not redefine the foundational audit schema.

**Completion evidence:** schema and service integration tests verify that the affected entities can be referenced by required audit records and that audit responsibilities are documented.

### 4.22 Migration set

Deliver versioned migrations for all DB-M02-owned tables, constraints, indexes, and required RLS policies.

Migrations must use the established DB-M01 FOUNDATION (P0-P3) tooling and history.

**Completion evidence:** the schema can be initialized and upgraded using the approved migration workflow without undocumented manual changes.

### 4.23 Schema verification

Deliver repeatable checks for the required DB-M02 schema objects and critical constraints.

The verification must identify missing or incorrect tables, foreign keys, unique constraints, indexes, and RLS policies within its documented scope.

**Completion evidence:** verification passes against the expected schema and detects representative missing or altered objects.

### 4.24 Automated database tests

Deliver tests for platform, resource, artifact, and storage metadata behavior.

The suite must cover constraints, versioning, relationships, RLS integration, and migration behavior.

**Completion evidence:** tests execute against an isolated supported PostgreSQL instance and produce repeatable results.

### 4.25 Development initialization and upgrade workflow

Deliver a documented workflow for applying DB-M02 migrations after DB-M01 FOUNDATION (P0-P3) has initialized the database.

The workflow must identify prerequisites, commands, expected outcomes, and schema verification.

**Completion evidence:** a clean environment can reach the expected DB-M02 schema through the documented migration workflow.

### 4.26 Error and integrity behavior

Deliver database constraints and tests for invalid platform, resource, artifact, and storage metadata operations.

The backend owns mapping database failures to API responses.

**Completion evidence:** representative invalid operations fail predictably and can be diagnosed by trusted test and service infrastructure without exposing secrets.

### 4.27 Domain handoff documentation

Deliver a handoff for the platform, resource, artifact, and storage metadata schema.

The handoff must identify stable identifiers, ownership rules, lifecycle semantics, versioning behavior, RLS assumptions, and migration conventions.

**Completion evidence:** backend and downstream database owners can identify the authoritative data model and its constraints without duplicating ownership.

### 4.28 Downstream reference contract

Deliver a documented reference contract for DB-M03 BOOKING DATA (P4) and DB-M04 EXECUTION DATA (P5-P7).

The contract must identify which platform, resource, artifact, and storage identifiers are suitable for downstream references and which lifecycle or immutability guarantees apply.

**Completion evidence:** downstream owners can reference the core entities without creating competing identifiers or assuming unsupported runtime guarantees.

### 4.29 Cloud and storage handoff

Deliver storage metadata requirements for the cloud and storage implementation owners.

The handoff must distinguish database metadata from object storage, access credentials, object lifecycle operations, and production infrastructure.

**Completion evidence:** storage implementation owners can map the durable storage reference and content metadata contract to the approved infrastructure without adding secrets to database records.

### 4.30 Deliverable ownership summary

| Deliverable | Authoritative owner | DB-M02 CORE DATA responsibility |
|---|---|---|
| PostgreSQL and migration foundation | DB-M01 FOUNDATION (P0-P3) | Reuse the foundation |
| Platform schema | DB-M02 CORE DATA (P3) | Own platform persistence |
| Platform version and compatibility metadata | DB-M02 CORE DATA (P3) | Own the relevant data model |
| Resource schema | DB-M02 CORE DATA (P3) | Own resource metadata persistence within scope |
| Artifact metadata schema | DB-M02 CORE DATA (P3) | Own artifact records and relationships within scope |
| Storage metadata schema | DB-M02 CORE DATA (P3) | Own durable storage metadata and references |
| Binary artifact content | Artifact/storage implementation owners | Do not store binary payloads as ordinary metadata |
| Platform registration service | Backend domain | Supply persistence and integrity constraints |
| Resource registration service | Backend domain | Supply persistence and integrity constraints |
| Artifact registration service | Backend domain | Supply persistence and integrity constraints |
| Object storage infrastructure | Cloud domain | Define database metadata requirements |
| Booking data | DB-M03 BOOKING DATA (P4) | Supply stable references where applicable |
| Execution, lab, live, and results data | DB-M04 EXECUTION DATA (P5-P7) | Supply stable references where applicable |
| Detailed DB-M02 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to the authoritative criteria |
| DB-M02 task sequencing | `TASKS.md` | Link to the authoritative task plan |

### 4.31 Required milestone records

The DB-M02 CORE DATA directory maintains these sibling records:

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

### 9.1 Duplicate platform identities

**Risk:** Different records represent the same platform because identity is based on mutable names or inconsistent keys.

**Impact:** Duplicate registration, ambiguous discovery, and inconsistent compatibility references.

**Mitigation:**

- Define a stable platform identifier.
- Establish uniqueness rules for machine-readable keys.
- Separate display names from stable identity.
- Test duplicate registration attempts.
- Review identifier changes for downstream impact.

**Owner:** Database domain.

### 9.2 Ambiguous platform version semantics

**Risk:** Platform versions are stored without a clear definition of whether the value represents a revision, compatibility target, or mutable label.

**Impact:** Artifact compatibility becomes unreliable and references may resolve to unintended platform definitions.

**Mitigation:**

- Define platform version identity.
- Establish uniqueness scope.
- Document mutability and deprecation semantics.
- Link compatibility records to the approved version representation.
- Validate the model against the platform contract.

**Owner:** Database and backend platform domains.

### 9.3 Resource identity conflates definition and instance

**Risk:** The schema uses one record to represent both a resource definition and a physical resource instance without an approved model.

**Impact:** Registration metadata becomes coupled to runtime state and physical operations.

**Mitigation:**

- Define resource identity and type semantics.
- Clarify whether the schema represents definitions, registered resources, instances, or an approved combination.
- Keep live health and physical control outside the core metadata model.
- Review relationships with P6 LAB & ROBOT owners where applicable.

**Owner:** Database and backend platform domains.

### 9.4 Invalid resource-to-platform relationship

**Risk:** A resource references a nonexistent or incompatible platform record.

**Impact:** Discovery and compatibility results become inconsistent.

**Mitigation:**

- Define relationship cardinality.
- Enforce foreign keys.
- Validate compatibility through the owning service.
- Test invalid references.
- Document platform deprecation behavior.

**Owner:** Database domain.

### 9.5 Resource metadata leaks across organizations

**Risk:** Organization-scoped resource metadata is accessible to unauthorized tenants.

**Impact:** Exposure of private resource registrations or configuration metadata.

**Mitigation:**

- Define resource visibility scope.
- Reuse foundational organization identifiers.
- Apply RLS according to the approved access model.
- Test cross-organization reads and writes under the ordinary application role.
- Review privileged access paths.

**Owner:** Database and security domains.

### 9.6 Declared capabilities are mistaken for operational readiness

**Risk:** A registered platform or resource is treated as available because capability metadata exists.

**Impact:** Services may advertise unsupported operations or attempt to use unavailable resources.

**Mitigation:**

- Separate declared capabilities from runtime health.
- Document registration-state semantics.
- Keep runtime health and availability with the relevant service owners.
- Avoid using static metadata as a live readiness signal.

**Owner:** Backend platform domain.

### 9.7 Artifact identity is conflated with a filename

**Risk:** Filenames or mutable paths become the primary artifact identifier.

**Impact:** Renames, collisions, and object relocation break references.

**Mitigation:**

- Use stable artifact identifiers.
- Separate display names, versions, digests, and storage references.
- Enforce approved uniqueness constraints.
- Test artifact lookup independently of display names.

**Owner:** Database and artifact domains.

### 9.8 Artifact versions can be silently overwritten

**Risk:** A published artifact version can be rebound to different content without an explicit revision or correction workflow.

**Impact:** Consumers may retrieve content different from the content they originally referenced.

**Mitigation:**

- Define immutable version semantics.
- Constrain updates to content identity and canonical storage references.
- Require an explicit new version or approved correction procedure.
- Test prohibited mutation.
- Preserve required provenance.

**Owner:** Database and artifact service domains.

### 9.9 Artifact-to-project ownership is invalid

**Risk:** An artifact references an incorrect, nonexistent, or unauthorized project.

**Impact:** Data exposure, broken ownership, and incorrect discovery behavior.

**Mitigation:**

- Enforce project foreign keys.
- Reuse DB-M01 FOUNDATION (P0-P3) project identifiers.
- Apply the approved RLS policy.
- Validate ownership in the service layer.
- Test invalid and cross-organization relationships.

**Owner:** Database and backend domains.

### 9.10 Compatibility metadata is treated as proof of execution compatibility

**Risk:** A declared platform compatibility record is assumed to prove that the artifact works on that platform.

**Impact:** Invalid execution attempts or misleading discovery results.

**Mitigation:**

- Document compatibility as metadata unless independently verified.
- Define whether references target platforms or specific versions.
- Keep runtime validation with the applicable execution and platform services.
- Preserve verification provenance where required.

**Owner:** Backend platform and artifact domains.

### 9.11 Storage reference does not match the stored object

**Risk:** A storage reference points to an absent, replaced, or incorrect object.

**Impact:** Retrieval failure or incorrect artifact content.

**Mitigation:**

- Define durable object reference semantics.
- Store content digests and sizes where required.
- Record verification state only after a trusted check.
- Define object replacement behavior.
- Test missing-object handling in the storage integration layer.

**Owner:** Storage implementation domain, with database support.

### 9.12 Temporary access URL is stored as durable identity

**Risk:** A short-lived URL or credential is persisted as the permanent storage reference.

**Impact:** Broken retrieval, credential exposure, and dependence on expired access tokens.

**Mitigation:**

- Persist durable backend and object references.
- Generate temporary access URLs through the approved service.
- Never store credentials as storage identity.
- Review metadata fields for accidental secret persistence.

**Owner:** Cloud and storage domains.

### 9.13 Content digest is not verified

**Risk:** The database contains a digest that was never checked against the stored object.

**Impact:** Metadata appears trustworthy without evidence of content integrity.

**Mitigation:**

- Distinguish declared digest from verified digest state.
- Define which trusted process performs verification.
- Record verification provenance where required.
- Avoid marking content verified based only on metadata insertion.
- Test the applicable verification workflow at the service boundary.

**Owner:** Artifact and storage implementation domains.

### 9.14 Storage metadata and object lifecycle diverge

**Risk:** Objects are moved or deleted without updating the corresponding metadata, or metadata is removed while referenced content remains.

**Impact:** Orphaned objects, broken references, and inconsistent storage accounting.

**Mitigation:**

- Define object lifecycle ownership.
- Document metadata state semantics.
- Coordinate object operations with metadata updates.
- Define reconciliation requirements with the storage owner.
- Avoid implying atomicity across PostgreSQL and object storage without an explicit mechanism.

**Owner:** Storage implementation and cloud domains.

### 9.15 Shared content references have ambiguous semantics

**Risk:** Multiple artifacts reference one object without a defined sharing or deletion policy.

**Impact:** Deleting or relocating one artifact may break another artifact's content.

**Mitigation:**

- Define whether content objects may be shared.
- Separate logical artifact versions from content identity.
- Specify object deletion ownership and reference checks.
- Test the approved cardinality.
- Keep object garbage collection with the storage implementation owner.

**Owner:** Database and storage domains.

### 9.16 Missing RLS policy on a new table

**Risk:** A new platform, resource, artifact, or storage table is introduced without the required RLS policy.

**Impact:** Protected metadata may become accessible outside the intended tenant boundary.

**Mitigation:**

- Include policy review in schema verification.
- Identify each table's visibility scope.
- Test using the ordinary application role.
- Fail acceptance when required policies are absent.
- Reuse the DB-M01 FOUNDATION (P0-P3) security conventions.

**Owner:** Database and security domains.

### 9.17 Overly broad access to shared platform metadata

**Risk:** A globally readable platform record is also globally writable without authorization.

**Impact:** Unauthorized modification of platform definitions or compatibility information.

**Mitigation:**

- Separate read and write privileges.
- Define ownership of platform registration.
- Apply role restrictions and policies.
- Test unauthorized mutation attempts.
- Audit relevant changes according to the approved policy.

**Owner:** Database and security domains.

### 9.18 Excessive metadata flexibility

**Risk:** Arbitrary JSON or unvalidated descriptor fields become the primary representation for important relationships.

**Impact:** Weak constraints, inconsistent semantics, and difficult migrations.

**Mitigation:**

- Keep identity and integrity-critical fields relational.
- Use flexible metadata only where justified.
- Define descriptor schemas and versioning.
- Validate fields in the owning service.
- Add database constraints for critical invariants where practical.

**Owner:** Database and backend domains.

### 9.19 Missing indexes degrade discovery

**Risk:** Core lookup patterns require scans across growing platform, resource, artifact, or storage metadata tables.

**Impact:** Slow discovery and increased database load.

**Mitigation:**

- Identify expected query patterns.
- Index primary keys and required relationships.
- Review project-scoped and versioned lookups.
- Verify required indexes automatically.
- Measure before adding speculative indexes.

**Owner:** Database domain.

### 9.20 Excessive indexing increases write cost

**Risk:** The schema adds redundant indexes without clear query or integrity justification.

**Impact:** Increased storage, slower writes, and additional migration complexity.

**Mitigation:**

- Document each required index's purpose.
- Review indexes against existing constraints.
- Avoid duplicating equivalent indexes.
- Use representative query plans when available.
- Keep performance tuning evidence-based.

**Owner:** Database domain.

### 9.21 Migration ordering breaks dependent services

**Risk:** A schema change removes or renames a field while a dependent service still expects the old schema.

**Impact:** Integration failures or runtime errors.

**Mitigation:**

- Review schema compatibility before destructive changes.
- Identify service consumers.
- Prefer compatible staged changes where appropriate.
- Test migration sequences.
- Coordinate release sequencing through the global release process.

**Owner:** Database and affected backend domains.

### 9.22 Duplicate migration ownership

**Risk:** A later milestone independently creates a competing platform, resource, artifact, or storage table.

**Impact:** Duplicated records, inconsistent identifiers, and unclear schema authority.

**Mitigation:**

- Publish the DB-M02 ownership map.
- Require downstream references to use canonical identifiers.
- Review new domain migrations against existing schema ownership.
- Resolve ownership conflicts before adding duplicate structures.
- Keep booking and execution data with their authoritative database milestones.

**Owner:** Database domain and affected milestone owners.

### 9.23 Audit provenance is incomplete

**Risk:** Relevant metadata changes cannot be associated with an actor, action, target, or correlation context.

**Impact:** Reduced traceability and difficulty investigating unauthorized or incorrect changes.

**Mitigation:**

- Reuse the audit foundation from DB-M01 FOUNDATION (P0-P3).
- Identify required audit actions with security and backend owners.
- Ensure services emit the required events.
- Test representative metadata changes.
- Avoid treating the existence of an audit table as proof of complete event coverage.

**Owner:** Backend and security domains, with database support.

### 9.24 Migration tests use an unrealistic role

**Risk:** Tests run only as a privileged database owner and fail to reveal ordinary application access problems.

**Impact:** RLS and privilege defects appear after integration.

**Mitigation:**

- Test schema and policy behavior using the ordinary application role.
- Inspect role memberships and bypass attributes.
- Include negative access tests.
- Separate migration tests from runtime access tests.
- Record the role and environment used for verification.

**Owner:** Database and security domains.

### 9.25 Downstream lifecycle assumptions differ

**Risk:** Booking or execution records assume that platforms, resources, or artifacts remain permanently available when the core schema allows deprecation or disablement.

**Impact:** Invalid references or unexpected behavior in later phases.

**Mitigation:**

- Define lifecycle and deprecation semantics.
- Preserve stable historical references where required.
- Document whether disabled entities remain queryable.
- Review downstream assumptions before changing lifecycle rules.
- Coordinate changes with DB-M03 BOOKING DATA (P4) and DB-M04 EXECUTION DATA (P5-P7).

**Owner:** Database domain and downstream milestone owners.

### 9.26 Production readiness is inferred from schema acceptance

**Risk:** Successful schema tests are interpreted as proof of production object durability, backup, recovery, or availability.

**Impact:** Deployment proceeds without necessary infrastructure and operational controls.

**Mitigation:**

- Document the environment used for verification.
- Separate metadata correctness from storage availability.
- Hand off production requirements to P8 PRODUCTION.
- Require cloud and operational verification for production guarantees.
- Avoid unsupported availability or recovery claims.

**Owner:** P8 PRODUCTION and cloud/storage operational owners.

### 9.27 Documentation diverges from implementation

**Risk:** Schema changes alter identifiers, versioning, or storage semantics without updating the authoritative documentation.

**Impact:** Services implement incompatible assumptions and later milestones use incorrect references.

**Mitigation:**

- Review documentation with schema changes.
- Keep entity ownership explicit.
- Link migration changes to their tasks.
- Maintain acceptance evidence in the sibling file.
- Record accepted changes in `CHANGELOG.md`.

**Owner:** Database domain and DB-M02 milestone owner.

---

## 10. Exit criteria

DB-M02 CORE DATA may be declared complete only when its platform, resource, artifact, and storage metadata schema is implemented through the approved migration workflow and verified against the accepted data, integrity, and security requirements.

Acceptance requires evidence that the schema can be initialized and exercised in an isolated supported PostgreSQL environment. The existence of tables or migration files alone is insufficient.

Detailed pass/fail conditions and evidence requirements belong in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection belong in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The implemented scope matches this dossier.
- [ ] Platform persistence has a clear owner.
- [ ] Resource persistence has a clear owner.
- [ ] Artifact metadata and storage metadata have explicit boundaries.
- [ ] Binary content and object operations remain with the applicable storage implementation owners.
- [ ] DB-M01 FOUNDATION (P0-P3) remains the authority for foundational identifiers, migrations, identity, organization, project, RLS, and audit conventions.
- [ ] DB-M03 BOOKING DATA (P4) owns booking and commercial persistence.
- [ ] DB-M04 EXECUTION DATA (P5-P7) owns execution, lab, live, and results persistence.
- [ ] Backend service behavior and database persistence responsibilities are distinguished.
- [ ] Cloud infrastructure and database schema responsibilities are distinguished.
- [ ] Canonical phase and milestone references follow the frozen model.
- [ ] Sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Platform schema

- [ ] Platform records have stable identifiers.
- [ ] Display names are distinct from stable identity.
- [ ] Required platform attributes are documented.
- [ ] Platform registration or lifecycle state has defined semantics.
- [ ] Approved uniqueness constraints are implemented.
- [ ] Platform version representation is explicit where required.
- [ ] Platform version uniqueness and relationship constraints are tested.
- [ ] Compatibility metadata references the approved platform or version identity.
- [ ] Invalid platform and version references are rejected.
- [ ] Runtime availability is not inferred from static registration metadata.

### 10.3 Resource schema

- [ ] Resource records have stable identifiers.
- [ ] Resource type and capability semantics are documented.
- [ ] Definition-versus-instance semantics are explicit.
- [ ] Required ownership or visibility scope is represented.
- [ ] Platform association cardinality is defined.
- [ ] Resource-to-platform relationships enforce referential integrity.
- [ ] Descriptor fields follow the approved contract.
- [ ] Registration state is distinct from runtime health or availability.
- [ ] Invalid resource references are rejected.
- [ ] Protected resource metadata follows the approved RLS model.

### 10.4 Artifact metadata schema

- [ ] Artifact records have stable identifiers.
- [ ] Logical artifact identity is distinct from filename and storage reference.
- [ ] Required artifact metadata is documented.
- [ ] Artifact-to-project relationships use DB-M01 FOUNDATION (P0-P3) identifiers.
- [ ] Project references enforce referential integrity.
- [ ] Artifact version identity and uniqueness semantics are explicit.
- [ ] Content identity is distinguishable from descriptive metadata.
- [ ] Published immutable versions cannot be silently rebound to different content where immutability is required.
- [ ] Platform compatibility relationships are explicit where required.
- [ ] Build provenance references follow the approved artifact contract.
- [ ] Artifact binary content is not stored in ordinary metadata records without an explicit approved design.

### 10.5 Storage metadata

- [ ] Durable storage references are distinct from temporary access URLs and credentials.
- [ ] Storage backend and namespace semantics are documented where applicable.
- [ ] Artifact-to-storage relationship cardinality is explicit.
- [ ] Content digest and size fields follow the approved contract.
- [ ] Content type and other required metadata are represented.
- [ ] Verification state is not set merely because metadata was inserted.
- [ ] Missing-object and object-replacement semantics are documented.
- [ ] Object lifecycle and deletion ownership are explicit.
- [ ] Invalid storage metadata references are rejected.
- [ ] The schema does not claim object availability solely from a stored reference.

### 10.6 Relational integrity and constraints

- [ ] Primary keys are defined for DB-M02-owned entities.
- [ ] Required foreign keys are defined.
- [ ] Unique constraints match the accepted identity and versioning rules.
- [ ] Check constraints enforce applicable value and state requirements.
- [ ] Nullability is intentional and documented.
- [ ] Referential actions are explicit.
- [ ] Platform, resource, artifact, and storage relationships are validated.
- [ ] Invalid references are rejected by the database where appropriate.
- [ ] Deletion behavior does not unintentionally remove protected history.
- [ ] Identifier and timestamp conventions follow DB-M01 FOUNDATION (P0-P3).

### 10.7 Indexes and discovery support

- [ ] Required platform lookup indexes exist.
- [ ] Required platform version indexes exist.
- [ ] Required resource lookup and relationship indexes exist.
- [ ] Required artifact and project-scoped lookup indexes exist.
- [ ] Required compatibility lookup indexes exist.
- [ ] Required storage metadata indexes exist.
- [ ] Index purposes are documented.
- [ ] Redundant indexes have been reviewed.
- [ ] The accepted index set is verified by schema inspection.

### 10.8 RLS and access control

- [ ] Every DB-M02-owned table has a documented visibility scope.
- [ ] Required RLS policies are present.
- [ ] Shared metadata read access is distinguished from write privileges.
- [ ] Organization- and project-scoped records follow the approved tenant model.
- [ ] Policies are tested under the ordinary application role.
- [ ] Missing or invalid tenant context fails closed where required.
- [ ] Cross-organization access attempts are tested.
- [ ] Unauthorized artifact and storage metadata access is rejected.
- [ ] Privileged role and RLS-bypass assumptions are reviewed.
- [ ] Database policy behavior aligns with the approved security architecture.

### 10.9 Audit integration

- [ ] DB-M02 reuses the audit conventions established by DB-M01 FOUNDATION (P0-P3).
- [ ] Relevant entities can be identified in required audit records.
- [ ] Audit-event requirements for metadata changes are documented with the relevant owners.
- [ ] Application-level event emission remains assigned to the backend owner.
- [ ] Sensitive data is not copied unnecessarily into metadata or audit fields.
- [ ] Audit integration does not introduce a competing audit schema.
- [ ] Required audit relationships and constraints are verified.

### 10.10 Migration and schema verification

- [ ] DB-M02 migrations use the approved migration tool and history.
- [ ] Migration identifiers and ordering are valid.
- [ ] A clean supported database can apply the full migration sequence.
- [ ] Migration failures are reported clearly.
- [ ] Migration history matches the expected schema state.
- [ ] Required tables and columns exist.
- [ ] Required constraints and indexes exist.
- [ ] Required foreign keys exist.
- [ ] Required RLS policies exist.
- [ ] A representative schema inconsistency is detected by the verification workflow.
- [ ] No undocumented manual schema changes are required.

### 10.11 Automated verification

- [ ] Tests execute against an isolated supported PostgreSQL environment.
- [ ] Platform identity and uniqueness tests pass.
- [ ] Platform version and compatibility tests pass.
- [ ] Resource identity and relationship tests pass.
- [ ] Artifact-to-project integrity tests pass.
- [ ] Artifact version uniqueness and immutability tests pass where required.
- [ ] Artifact-storage relationship tests pass.
- [ ] Storage metadata constraint tests pass.
- [ ] RLS positive and negative tests pass.
- [ ] Cross-organization access tests pass where applicable.
- [ ] Audit integration tests pass.
- [ ] Migration initialization and history tests pass.
- [ ] Tests do not perform destructive operations against shared or production databases.
- [ ] Test results and required evidence are recorded in the sibling acceptance and review documents.

### 10.12 Backend and storage handoff

- [ ] Backend platform services can use stable platform identifiers.
- [ ] Backend resource services can use stable resource identifiers.
- [ ] Artifact services can use the approved artifact identity and version model.
- [ ] Storage services can resolve durable storage metadata references through the approved abstraction.
- [ ] API behavior and service authorization remain with their authoritative backend owners.
- [ ] Object upload, retrieval, deletion, and integrity verification remain with the storage implementation owners.
- [ ] Error mapping from database failures to API responses is documented by the backend owner.
- [ ] Required audit-event emission responsibilities are documented.

### 10.13 Downstream readiness

- [ ] DB-M03 BOOKING DATA (P4) can reference eligible core entities without duplicating their identity.
- [ ] DB-M04 EXECUTION DATA (P5-P7) can reference eligible core entities without duplicating their identity.
- [ ] Downstream lifecycle assumptions are documented.
- [ ] Platform deprecation and artifact immutability semantics are clear.
- [ ] Storage reference semantics are documented for downstream consumers.
- [ ] Required RLS and tenant-context conventions are available to downstream owners.
- [ ] No unresolved schema ownership conflict blocks safe extension.

### 10.14 Documentation and traceability

- [ ] Platform schema and lifecycle semantics are documented.
- [ ] Resource schema and ownership semantics are documented.
- [ ] Artifact identity, versioning, and provenance semantics are documented.
- [ ] Storage metadata and durable reference semantics are documented.
- [ ] Relational constraints and required indexes are documented.
- [ ] RLS and access assumptions are documented.
- [ ] Migration and schema verification workflows are documented.
- [ ] Known limitations and unresolved dependencies are explicit.
- [ ] Authoritative architecture, backend, security, cloud, testing, and release documents are linked.
- [ ] `TASKS.md` contains the detailed task decomposition.
- [ ] `ACCEPTANCE_CRITERIA.md` contains detailed pass/fail conditions and evidence requirements.
- [ ] `REVIEW_CHECKLIST.md` contains review actions and evidence inspection.
- [ ] `CHANGELOG.md` contains accepted change history.
- [ ] `GIT_COMMIT_STEP.md` contains the repository and commit procedure.

### 10.15 Final milestone acceptance

DB-M02 CORE DATA is ready for formal acceptance when:

1. The platform, resource, artifact, and storage metadata entities have explicit schema ownership.
2. Stable identifiers, versioning semantics, and required relationships are implemented.
3. Project ownership and foundational identity relationships follow DB-M01 FOUNDATION (P0-P3).
4. Required relational constraints and indexes are present.
5. Artifact version and storage-reference semantics are explicit and tested.
6. Required RLS policies enforce the approved database access boundaries.
7. Migrations and schema verification use the established database foundation.
8. Required automated database tests pass.
9. Audit integration follows the foundational audit conventions.
10. Backend and storage owners can implement their respective service behavior without relying on undocumented schema assumptions.
11. Downstream database milestones can reference core entities without duplicating ownership.
12. Critical risks are mitigated or formally dispositioned by the relevant owners.
13. Required acceptance and review evidence is available through the sibling files.
14. No unresolved issue invalidates core data integrity, artifact identity, storage metadata integrity, or tenant isolation.

Acceptance of DB-M02 CORE DATA does not establish that artifact objects are available, that platform capabilities work at runtime, that resources are physically operational, or that production storage meets availability or recovery objectives. Those guarantees remain with the applicable backend, storage, cloud, and production owners.
