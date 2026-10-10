# DB-M01 FOUNDATION — Milestone Dossier

**Primary Phase:** P0 FOUNDATION

**Supporting Phases:** P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION

**Domain:** Database

**Milestone:** DB-M01 FOUNDATION (P0-P3)

**Document Type:** Database milestone dossier

**Status:** Planning baseline

**Scope Authority:** This dossier defines the database foundation for PostgreSQL, schema migration tooling, identity/organization/project data structures, row-level security (RLS) baseline, and audit foundations. Existing milestone dossiers under `docs/**/milestones/` remain authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the milestone-level objectives, boundaries, dependencies, deliverables, risks, and exit criteria for DB-M01 FOUNDATION.

Its scope is the reliable and secure database foundation on which the platform's later domain data can be built.

DB-M01 FOUNDATION owns the following outcomes:

- PostgreSQL foundation and baseline database configuration requirements.
- Database connection and environment configuration conventions at the application boundary.
- Schema migration tooling, ordering, repeatability, and migration history.
- Baseline schema ownership and conventions.
- Identity, organization, membership, and project schema foundations.
- Foreign-key and relational-integrity conventions for foundational records.
- Row-level security baseline for protected foundational data.
- Tenant and organization isolation principles at the database boundary.
- Database roles and least-privilege access expectations.
- Audit-event persistence foundations and provenance requirements.
- Migration validation and schema verification requirements.
- Foundational database test and verification expectations.
- Required database documentation and handoffs to later database milestones.

This dossier describes required outcomes and ownership boundaries. It does not define every SQL statement, migration file, production parameter, API endpoint, application service, or operational runbook.

### What this document does not own

The following concerns remain with their authoritative documents or domain owners:

- Canonical phase definitions: `docs/planning/PHASES.md`.
- Cross-domain architectural decisions: `docs/planning/DECISIONS.md`.
- System architecture: `docs/architecture/`.
- Backend architecture and service boundaries: `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.
- API and wire-level contracts: `docs/protocol/API_CONTRACT.md`.
- Security architecture and global authorization policy: `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/`.
- Frontend behavior and UI implementation: `docs/frontend/`.
- Cloud provisioning, networking, managed database infrastructure, and deployment topology: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Global testing policy: `docs/development/TESTING_STRATEGY.md`.
- Global release and deployment policy: `docs/development/RELEASE_PROCESS.md`.
- Booking and commercial domain data: DB-M03 BOOKING DATA (P4).
- Execution, lab, and results data: DB-M04 EXECUTION DATA (P5-P7).
- Control-plane-specific domain data beyond the foundational schema: DB-M02 CORE DATA (P3).
- Production database availability, scaling, backups, recovery operations, and operational readiness: P8 PRODUCTION and the applicable cloud and database operational documents.

### Ownership map

| Concern | Authoritative owner | DB-M01 FOUNDATION responsibility |
|---|---|---|
| Canonical phase model | `docs/planning/PHASES.md` | Follow the frozen phase names and numbering |
| System architecture | `docs/architecture/` | Implement the database foundation consistently with approved architecture |
| Architectural decisions | `docs/planning/DECISIONS.md` | Consume approved decisions and avoid creating undocumented alternatives |
| PostgreSQL schema conventions | Database domain | Establish foundational schema conventions |
| PostgreSQL environment requirements | Database and cloud architecture documents | Define baseline requirements and configuration boundaries |
| Migration tooling and conventions | Database domain | Establish repeatable schema evolution |
| Identity and organization schema | DB-M01 FOUNDATION | Define foundational relational structures |
| Project schema foundation | DB-M01 FOUNDATION | Define foundational project records and relationships |
| RLS baseline | DB-M01 FOUNDATION, aligned with security architecture | Establish and verify foundational database access policies |
| Global authorization policy | Security and control-plane owners | Implement database enforcement consistent with approved policy |
| Audit-event persistence foundation | DB-M01 FOUNDATION | Define baseline audit persistence and provenance requirements |
| Application authentication | P3 CONTROL PLANE and security owners | Persist only the required identity relationships |
| Application API contracts | `docs/protocol/API_CONTRACT.md` | Provide persistence capabilities behind approved contracts |
| Backend service implementation | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` | Provide database interfaces and constraints |
| Booking data | DB-M03 BOOKING DATA (P4) | Provide foundation conventions for later use |
| Execution and results data | DB-M04 EXECUTION DATA (P5-P7) | Provide foundation conventions for later use |
| Production database operations | P8 PRODUCTION and applicable operational documents | Document requirements and hand off operational responsibilities |
| DB-M01 tasks | `TASKS.md` | Define phase-specific work decomposition |
| DB-M01 acceptance | `ACCEPTANCE_CRITERIA.md` | Define detailed pass/fail criteria and required evidence |
| DB-M01 review | `REVIEW_CHECKLIST.md` | Define review actions and evidence inspection |
| DB-M01 change history | `CHANGELOG.md` | Record accepted changes |
| DB-M01 Git procedure | `GIT_COMMIT_STEP.md` | Define commit and repository procedure |

### Sibling document ownership

The following files are maintained alongside this dossier:

- [`TASKS.md`](TASKS.md) — task decomposition, sequencing, dependencies, and task ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed pass/fail conditions and required evidence.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — review actions and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — accepted changes and milestone history.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

These files complement this dossier. They must not be replaced by duplicated task lists, detailed acceptance matrices, review procedures, change records, or commit instructions in `MILESTONE.md`.

---

## 1. Objective

DB-M01 FOUNDATION establishes a secure, repeatable, and maintainable PostgreSQL database foundation for Kritva RaaS.

The milestone creates the database conventions and foundational relational structures needed by P0 FOUNDATION through P3 CONTROL PLANE. It establishes how schema changes are introduced, how identity and organization boundaries are represented, how projects relate to their owners, how foundational records are protected through row-level security, and how important changes can be audited.

The foundation must be suitable for incremental development without allowing schema changes, application access patterns, or tenant boundaries to become implicit and inconsistent.

### 1.1 Primary outcomes

DB-M01 FOUNDATION is intended to deliver the following outcomes:

1. PostgreSQL is an established and documented database platform for the accepted development environment.
2. Database configuration is explicit and separated from application source code.
3. Schema changes are represented as ordered, versioned migrations.
4. A new development database can be initialized reproducibly.
5. Existing schema state can be inspected and compared with the migration history.
6. Identity records can be represented without conflating authentication credentials with application identity.
7. Organizations and organization memberships have explicit relational integrity.
8. Projects have a defined ownership and organization relationship.
9. Foundational tables follow consistent primary-key, foreign-key, uniqueness, and timestamp conventions.
10. Protected foundational records have a defined row-level security baseline.
11. Database access follows least-privilege expectations.
12. Tenant and organization isolation is tested at the database boundary.
13. Important security- and ownership-relevant changes can be recorded in an audit foundation.
14. Migration failures are detectable and do not silently leave the schema in an unknown state.
15. Schema ownership is clear enough for later database milestones to add domain-specific data without duplicating foundational concepts.
16. Required database assumptions, limitations, and operational handoffs are documented.

### 1.2 PostgreSQL foundation outcome

PostgreSQL is the relational persistence foundation for the accepted platform scope.

DB-M01 establishes the database-level conventions required for reliable development and later extension. The exact PostgreSQL version, deployment mode, connection-pooling topology, and infrastructure configuration must be recorded in the appropriate environment and architecture documents.

The milestone must not hard-code environment-specific secrets or infrastructure assumptions into migration files or application source.

### 1.3 Migration outcome

Schema evolution must be explicit, ordered, repeatable, and reviewable.

A developer or automated environment must be able to initialize a supported database using the approved migration workflow and determine which migrations have been applied.

A migration must not be treated as successfully applied merely because a tool process exited without an explicit error. The migration system must retain a reliable record of its state and expose failures clearly.

### 1.4 Foundational data outcome

The database must establish stable relationships among:

- Application identities.
- Organizations.
- Organization memberships.
- Projects.
- Foundational audit records.

These structures must use explicit ownership and referential-integrity rules. Later domain records must refer to these foundational entities through approved identifiers rather than introducing competing organization, project, or identity representations.

### 1.5 Security outcome

The database foundation must support tenant-aware access enforcement and defense in depth.

RLS policies must be designed in alignment with the approved security architecture. The system must not assume that filtering rows in application code alone provides sufficient protection for tenant-scoped data.

Database roles, policy behavior, ownership, and execution context must be defined so that application access cannot unintentionally bypass the intended isolation boundary.

RLS is one layer of the security model. It is not a replacement for application authentication, service authorization, input validation, or security review.

### 1.6 Audit outcome

The database foundation must establish how important changes and security-relevant actions can be represented in durable audit records.

The design must preserve sufficient provenance to associate an event with the relevant actor or system principal, action, target, timestamp, and applicable context.

Audit records must not become a mechanism for indiscriminately copying credentials, tokens, secrets, or sensitive payloads into persistent storage.

### 1.7 Completion principle

DB-M01 FOUNDATION is complete when PostgreSQL setup, migration tooling, foundational schema, RLS baseline, and audit persistence foundations can be initialized, exercised, and verified using a documented and repeatable process.

Completion requires more than the presence of SQL files. It requires evidence that migrations work, relational constraints are enforced, access boundaries are tested, and audit behavior follows the accepted requirements.

Detailed pass/fail criteria and evidence requirements are maintained in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

#### 2.1.1 PostgreSQL baseline

DB-M01 establishes the supported PostgreSQL baseline for development and integration.

The deliverable includes:

- A documented supported PostgreSQL version or version range.
- A documented method for configuring a development instance.
- A documented connection configuration contract.
- A separation between application configuration and environment-specific secrets.
- Baseline database naming and schema conventions.
- A documented approach to database initialization.
- A documented approach to validating the running database.
- A record of assumptions that affect migration compatibility.

The exact cloud service, managed database product, production deployment topology, and infrastructure provisioning process belong to the cloud and production owner documents.

#### 2.1.2 Connection configuration

The foundation must define how applications obtain database connection settings.

Configuration should identify the required connection parameters and the approved mechanism for supplying them.

The design must address:

- Database endpoint or socket.
- Database name.
- Application database role.
- Authentication mechanism.
- Connection security requirements.
- Connection timeout behavior.
- Environment separation.
- Secret injection and rotation assumptions.
- Safe failure when required configuration is missing.

Secrets must not be committed to source control or embedded in migration definitions.

The backend architecture owns service-level connection management and pooling behavior. Cloud architecture owns infrastructure-level connectivity and secret delivery.

#### 2.1.3 Schema organization and naming conventions

DB-M01 establishes foundational schema conventions for later database work.

Conventions must address:

- Schema and table naming.
- Column naming.
- Primary-key naming and representation.
- Foreign-key naming.
- Unique constraints.
- Check constraints.
- Timestamp semantics.
- Nullability.
- Referential actions.
- Index naming.
- Migration naming.
- Ownership of tables and shared concepts.

The convention must be practical for later database milestones and must not force domain-specific tables into the foundational schema merely for convenience.

#### 2.1.4 Migration tooling

DB-M01 establishes the approved schema migration tool and workflow.

The workflow must support:

- Ordered migration files.
- Unique migration identifiers.
- Migration history tracking.
- Application of unapplied migrations.
- Detection of failed migrations.
- Repeatable initialization from a clean database.
- Validation of migration ordering.
- Reviewable schema changes.
- Clear error reporting.
- Documented recovery procedures for failed development migrations.

The exact tool choice and invocation must be recorded in the implementation and development documentation. This dossier does not prescribe a specific migration product when that choice has not been approved.

#### 2.1.5 Migration safety and repeatability

Migrations must be designed to minimize partial or ambiguous schema state.

The workflow must define:

- Whether a migration executes transactionally.
- How non-transactional operations are identified.
- How the migration history is updated.
- How a failed migration is diagnosed.
- How a migration can be retried safely, where supported.
- How a database is validated after migration.
- How destructive changes are reviewed.
- How schema changes are coordinated with application compatibility.

Migrations must not silently mark an incomplete change as successful.

Automatic rollback must not be assumed to be possible for every database operation. Where rollback is unsafe or unavailable, the recovery approach must be documented.

#### 2.1.6 Migration compatibility and ownership

The migration workflow must provide a clear ownership path for each schema change.

Every migration must be attributable to a reviewed change and its owning domain.

The workflow should make it possible to determine:

- What changed.
- Why the change was required.
- Which domain owns the affected schema.
- Which application or service versions depend on it.
- Whether the change is compatible with the deployed schema state.
- Whether data transformation or backfill is required.
- Whether a destructive operation needs special approval.

The global release process defines shared release controls. DB-M01 defines the foundational database-specific conventions and handoffs.

#### 2.1.7 Foundational identity schema

DB-M01 establishes the persistent application identity representation required by the accepted platform.

The schema must distinguish the platform's identity record from the external authentication mechanism, where external authentication is used.

The foundational identity record may include:

- Stable identity identifier.
- Display or profile attributes required by the application.
- Lifecycle or activation state where required.
- Creation and update timestamps.
- Optional external identity-provider subject references, where approved.
- Audit and ownership relationships required by the data model.

The schema must not store raw passwords, access tokens, refresh tokens, or other authentication secrets as ordinary profile attributes.

Authentication protocols, identity-provider integration, session issuance, and authentication policy belong to the control-plane and security owner documents.

#### 2.1.8 Identity uniqueness and lifecycle

The identity schema must define the uniqueness rules required to avoid ambiguous identities.

Where an external identity-provider subject is used, its uniqueness scope must be explicitly defined. A provider subject must not be assumed globally unique across providers unless the contract guarantees that property.

The schema must also define the behavior of references to inactive, disabled, or otherwise unavailable identities.

The data model must not silently reuse a stable identity identifier for a different principal.

Detailed account lifecycle and identity-provider behavior remain with P3 CONTROL PLANE and the security domain.

#### 2.1.9 Organization schema

DB-M01 establishes the organization record and its foundational attributes.

The organization schema must define:

- Stable organization identifier.
- Required organization name or label.
- Lifecycle state where required.
- Creation and update timestamps.
- Constraints on required values.
- Relationships to organization membership and project ownership.
- Any approved uniqueness rules.

The foundation must not assume that a display name is a stable identifier.

Organization-level commercial plans, quotas, billing records, and booking entitlements are not owned by DB-M01.

#### 2.1.10 Organization membership schema

The schema must represent membership between an identity and an organization.

The relationship must define:

- Membership identifier or composite-key convention.
- Identity reference.
- Organization reference.
- Membership status.
- Membership role or role reference, where required by the approved model.
- Creation and update timestamps.
- Uniqueness of the intended identity-organization relationship.
- Referential integrity for both sides of the relationship.

The model must prevent duplicate active membership records where the intended business rule permits only one membership per identity and organization.

If membership history or soft deletion is required, the schema must make the chosen semantics explicit rather than relying on ambiguous duplicate rows.

The authoritative role and authorization policy is owned by the security and control-plane documents. DB-M01 supplies the persistence structure and integrity constraints.

#### 2.1.11 Project schema foundation

DB-M01 establishes the foundational project record required by the platform.

The project schema must define:

- Stable project identifier.
- Organization ownership or an explicitly approved equivalent relationship.
- Required project name or label.
- Lifecycle state where required.
- Creation and update timestamps.
- Referential integrity to the owning organization.
- Approved uniqueness rules within the intended ownership scope.
- The relationship needed to apply organization-scoped access policies.

The foundation must make project ownership explicit. It must not infer ownership solely from a user-supplied display name or an unvalidated identifier.

Project configuration, build records, artifact records, platform registration, execution records, and result records belong to their respective domain milestones.

#### 2.1.12 Foundational foreign keys and relational integrity

DB-M01 establishes consistent referential-integrity expectations for identity, organization, membership, project, and audit-related records.

The schema must define:

- Required foreign keys.
- Uniqueness constraints.
- Check constraints for constrained states or values.
- Nullability rules.
- Deletion and update behavior.
- Indexes needed to support integrity checks and common access paths.

Cascading deletion must not be used casually where it could erase audit history or destroy records needed by other domains.

The chosen deletion and retention semantics must be documented. Application-level validation must not be treated as a substitute for database constraints when a database constraint is appropriate.

#### 2.1.13 Row-level security baseline

DB-M01 establishes the baseline RLS design for protected foundational data.

The RLS baseline must identify:

- Which foundational tables require row-level protection.
- Which database roles are subject to the policies.
- How organization or project context is supplied to database operations.
- How missing context is handled.
- How read and write policies differ where necessary.
- How privileged access is controlled.
- How policy behavior is tested.
- How future domain tables are expected to inherit the security conventions.

RLS policies must default to denial when the required tenant context is absent or invalid, unless an explicitly reviewed policy establishes another behavior.

RLS must be evaluated together with table ownership, role attributes, connection context, and any privileges that could bypass policies. Merely enabling RLS is not sufficient evidence of isolation.

#### 2.1.14 Tenant and organization isolation

The foundation must define the database-level isolation boundary for organization-scoped data.

The design must establish how a database operation is constrained to the authorized organization or project context.

It must prevent:

- Reading another organization's protected rows through an ordinary application role.
- Writing rows under an unauthorized organization.
- Associating a project with an unrelated organization through an invalid reference.
- Using absent context as a wildcard.
- Accidentally retaining one request's tenant context for a later request on a reused connection.

Connection pooling and request-context propagation require particular care. The database access layer must reliably establish and clear request-scoped context according to the approved implementation.

The backend owns request authorization and context propagation. DB-M01 owns the foundational database policy expectations and their verification.

#### 2.1.15 Database roles and least privilege

DB-M01 defines the role separation required for foundational database access.

The design must distinguish, as appropriate:

- Database administration and schema ownership.
- Migration execution.
- Ordinary application access.
- Read-only or reporting access where approved.
- Automated test access.

The ordinary application role must not receive superuser or equivalent bypass privileges.

Role membership and privileges must be explicit. The migration role must not be used as the ordinary runtime identity unless an approved architecture decision explicitly requires and justifies that arrangement.

Exact production role provisioning, secret distribution, and privileged operational procedures belong to the cloud and production owner documents.

#### 2.1.16 Audit persistence foundation

DB-M01 establishes the foundational data structure and conventions for audit records.

The audit model must support the recording of relevant actions with enough information to establish provenance.

The accepted audit record should define, as applicable:

- Stable event identifier.
- Event timestamp.
- Actor or system principal reference.
- Action or event type.
- Target entity type and identifier.
- Organization or project context where relevant.
- Outcome or status where applicable.
- Correlation identifier.
- Minimal structured metadata needed to explain the event.

Audit fields must have defined meanings and consistent timestamp semantics.

The database foundation must not indiscriminately copy full request bodies, credentials, tokens, or sensitive telemetry into audit metadata.

#### 2.1.17 Audit integrity and access

Audit records must be protected against ordinary unauthorized modification or deletion.

The design must establish:

- Which role can append audit records.
- Which roles can read them.
- Whether ordinary application roles can update or delete existing entries.
- How audit record ownership and access are constrained.
- How audit events relate to the identity, organization, and project schema.
- How failures to record required audit events are handled by the owning application service.

The database cannot by itself guarantee that every meaningful application action is audited. Backend services must emit the required events, and the security architecture defines which actions are mandatory to audit.

Audit retention, export, archival, and operational monitoring belong to the relevant security, database operations, and production documents.

#### 2.1.18 Timestamps and lifecycle conventions

DB-M01 establishes consistent timestamp semantics for foundational records.

The schema must document:

- Timestamp type and time-zone semantics.
- Creation timestamp behavior.
- Update timestamp behavior.
- Whether a value represents an event time or database-record time.
- How nullable lifecycle timestamps are interpreted.
- How timestamps are generated or validated.
- How the application handles clock differences.

The same column name must not represent different time concepts across foundational tables.

A database-record update timestamp must not be mistaken for the time at which an external event occurred.

#### 2.1.19 Identifier conventions

The foundation must establish the identifier conventions used by foundational records.

The convention must address:

- Identifier type and representation.
- Primary-key generation.
- Uniqueness guarantees.
- Foreign-key compatibility.
- Exposure through APIs.
- Migration compatibility.
- Identifier handling in audit records.

The chosen strategy must be consistent across identity, organization, membership, project, and audit entities unless an approved decision establishes a documented exception.

Identifiers must not be treated as authorization credentials.

#### 2.1.20 Indexing baseline

DB-M01 defines basic indexing conventions for foundational relational integrity and expected access paths.

Indexes should support:

- Primary-key lookups.
- Foreign-key joins and integrity operations.
- Organization membership lookup.
- Project lookup within the intended ownership scope.
- Audit retrieval using approved query patterns.
- RLS-relevant filtering where the query plan benefits from an index.

Indexes must be justified by the expected query pattern and integrity requirement. The foundation should avoid speculative indexing that creates unnecessary write overhead.

Advanced workload tuning, production capacity analysis, and performance service objectives belong to the database and production owner documents.

#### 2.1.21 Local development and test database

DB-M01 establishes a repeatable way to create a development or test database.

The documented workflow must identify:

- Required PostgreSQL version.
- Required environment configuration.
- Migration command.
- Schema verification command.
- Test command.
- Expected success evidence.
- Cleanup or reset procedure for disposable test environments.
- Safety restrictions on destructive reset commands.

The workflow must make it difficult to accidentally apply a test reset to a non-disposable database.

Cloud environment provisioning and shared environment access remain with the cloud domain.

#### 2.1.22 Migration verification and schema drift

The foundation must provide a way to detect inconsistencies between migration history and actual schema state.

Verification should identify:

- Missing migration records.
- Failed migrations.
- Unexpected migration ordering.
- Schema objects created outside the approved workflow.
- Required constraints or policies that are absent.
- Unexpected changes to protected foundational objects.

The chosen tooling may use migration checks, schema inspection, catalog queries, or automated tests. The implementation must document its limitations and must not claim complete drift detection if it checks only migration history.

#### 2.1.23 Foundational database tests

DB-M01 includes tests for the correctness of its schema and migration behavior.

The tests must cover the relevant:

- Clean database initialization.
- Migration application and history.
- Primary and foreign keys.
- Required uniqueness constraints.
- Organization and membership relationships.
- Project ownership relationships.
- RLS behavior for ordinary application roles.
- Missing or invalid tenant context.
- Cross-organization isolation.
- Audit insertion and protected mutation behavior.
- Required timestamp and identifier semantics.

Global testing conventions belong to `docs/development/TESTING_STRATEGY.md`. DB-M01 defines which foundation behaviors must be verified.

#### 2.1.24 Database error behavior

The database foundation must produce distinguishable failures for relevant invalid operations.

Examples include:

- Migration failure.
- Invalid foreign-key reference.
- Unique-constraint violation.
- Invalid constrained value.
- RLS rejection.
- Missing required configuration.
- Failed connection.
- Unauthorized database operation.

The backend owns mapping database errors to API and user-facing responses. DB-M01 must ensure that foundational constraints and policy failures are observable to the appropriate trusted caller without requiring disclosure of internal database details to end users.

#### 2.1.25 Documentation and traceability

The foundation must document its supported assumptions, migration workflow, schema conventions, RLS approach, and audit persistence expectations.

The documentation must identify the authoritative owner for each foundational concept and explain how later database milestones extend the foundation.

Detailed task plans, acceptance matrices, review records, change history, and commit steps remain in their sibling files.

### 2.2 Explicit non-scope

The following are outside DB-M01 FOUNDATION unless explicitly approved through a documented scope change:

- Application authentication protocols and identity-provider implementation.
- Session management, token issuance, credential validation, and password storage policy.
- Full control-plane service implementation.
- Complete authorization policy design beyond the database enforcement baseline.
- Booking records, reservations, commercial transactions, credits, billing, and entitlements.
- Execution records, dispatch state, retries, and execution lifecycle persistence.
- Physical robot, Lab Agent, sensor, or hardware-specific telemetry schemas.
- Live video-session state and detailed results domain schemas.
- Artifact storage implementation and object-store lifecycle.
- Production database deployment topology and infrastructure provisioning.
- Production high availability, replication architecture, scaling, and failover operations.
- Production backup execution, restore drills, and operational recovery runbooks.
- Full audit export, long-term archival, analytics, and security information management integrations.
- General-purpose data warehouse or business intelligence design.
- Frontend screens and application workflows.
- API endpoint implementation and service business logic.
- Cloud secret distribution and network security group implementation.
- Global release orchestration and repository workflow.
- Performance guarantees not backed by the accepted environment and measurements.

DB-M01 may define interfaces and prerequisites for these capabilities. It must not absorb their implementation ownership.

### 2.3 Canonical phase relationship table

| Phase | Relationship to DB-M01 FOUNDATION | Boundary |
|---|---|---|
| P0 FOUNDATION | Establishes common engineering and repository foundations | DB-M01 follows common development and verification conventions |
| P1 STUDIO | Consumes foundational identity and project data | DB-M01 supplies persistence foundations, not frontend behavior |
| P2 BUILD & ARTIFACT | Consumes identity and project relationships for artifact-related data | DB-M01 does not own artifact schemas or storage |
| P3 CONTROL PLANE | Consumes and extends identity, organization, membership, and project foundations | DB-M01 establishes the base relational and security conventions |
| P4 BOOKING & COMMERCIAL | Extends the platform with booking and commercial records | DB-M03 BOOKING DATA (P4) owns booking persistence |
| P5 EXECUTION | Extends the platform with execution data | DB-M04 EXECUTION DATA (P5-P7) owns execution persistence within its scope |
| P6 LAB & ROBOT | Extends the platform with lab and physical-resource data | DB-M04 EXECUTION DATA (P5-P7) owns the applicable persistence scope |
| P7 LIVE & RESULTS | Extends the platform with live and results data | DB-M04 EXECUTION DATA (P5-P7) owns the applicable persistence scope |
| P8 PRODUCTION | Uses the database foundation in production operation | Production readiness and operational controls remain with P8 PRODUCTION and the applicable operational owners |

### 2.4 Canonical database milestone relationship table

| Database milestone | Phase mapping | Relationship to DB-M01 FOUNDATION |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Owns PostgreSQL foundation, migrations, identity/organization/project schema, RLS baseline, and audit foundation |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Extends the foundation with control-plane-specific data structures |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Adds booking and commercial persistence |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Adds execution, lab, live, and results persistence within its defined scope |

### 2.5 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to DB-M01 FOUNDATION |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Consumes foundational application context |
| Frontend | F-M02 PROJECTS (P1) | Consumes project and organization relationships |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Consumes project context for artifact workflows |
| Frontend | F-M04 BOOKING (P4) | Consumes booking data owned by the booking domain |
| Frontend | F-M05 EXECUTION (P5) | Consumes execution data owned by the execution domain |
| Frontend | F-M06 LIVE (P7) | Consumes live-session and telemetry data owned by the applicable domain |
| Frontend | F-M07 RESULTS (P7) | Consumes result data owned by the applicable domain |
| Backend | B-M01 CONTROL PLANE (P3) | Uses identity, organization, membership, and project foundations |
| Backend | B-M02 ARTIFACT (P2-P3) | Uses foundational ownership relationships where required |
| Backend | B-M03 PLATFORM (P3) | Uses approved foundational identity and organization relationships |
| Backend | B-M04 BOOKING (P4) | Extends the schema through the booking data owner |
| Backend | B-M05 EXECUTION (P5) | Extends the schema through the execution data owner |
| Backend | B-M06 RESULTS (P6-P7) | Uses execution and results persistence defined by the applicable database milestone |
| Backend | B-M07 PRODUCTION (P8) | Consumes the database under production operational controls |
| Database | DB-M01 FOUNDATION (P0-P3) | Owns this foundation milestone |
| Database | DB-M02 CORE DATA (P3) | Extends foundational control-plane data |
| Database | DB-M03 BOOKING DATA (P4) | Owns booking and commercial persistence |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Owns execution, lab, live, and results persistence within its defined scope |
| Cloud | C-M01 FOUNDATION (P0) | Supplies cloud foundation conventions and environment assumptions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development environment infrastructure |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure used by downstream integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and deployment controls |

### 2.6 Required database invariants

All DB-M01 implementations must preserve these invariants:

- **Explicit identity:** foundational application identities have stable identifiers and defined uniqueness semantics.
- **Explicit ownership:** every project has an unambiguous owning organization or an explicitly approved alternative relationship.
- **Referential integrity:** required relationships are enforced by database constraints where appropriate.
- **Migration traceability:** schema changes are ordered, recorded, and reviewable.
- **Repeatable initialization:** a clean supported database can be initialized using the documented workflow.
- **Least privilege:** ordinary application roles do not receive unnecessary privileged database access.
- **Tenant isolation:** protected foundational records are isolated according to approved RLS policies.
- **Fail-closed context:** absent or invalid tenant context does not silently grant broad access.
- **Connection-context hygiene:** request-specific database context does not leak between operations on reused connections.
- **Audit provenance:** required audit records retain meaningful actor, action, target, time, and correlation context.
- **Audit protection:** ordinary application roles cannot silently rewrite protected audit history.
- **Secret minimization:** credentials and tokens are not stored in ordinary profile or audit fields.
- **Schema ownership:** later domain milestones extend foundational concepts rather than creating competing identity or organization models.
- **Documented limitations:** unimplemented operational guarantees are not implied by the existence of the schema foundation.

---

## 3. Dependencies

### 3.1 P0 FOUNDATION dependencies

DB-M01 depends on the common engineering foundation established by P0 FOUNDATION.

Required inputs include:

- Repository conventions.
- Build and test execution conventions.
- Environment configuration practices.
- Code review expectations.
- Common documentation and change-management conventions.
- An agreed method to run database-related tests in development and automation.

DB-M01 must document database-specific prerequisites without duplicating the global development workflow.

### 3.2 P1 STUDIO dependencies

P1 STUDIO consumes the identity and project foundations established by DB-M01.

Required alignment includes:

- Stable project identity.
- Organization ownership.
- Identity references.
- Membership relationships where needed.
- Consistent timestamps and lifecycle semantics.
- Clear constraints for required project attributes.

DB-M01 must provide a stable persistence contract. It does not own Studio screens, navigation, or frontend workflows.

### 3.3 P2 BUILD & ARTIFACT dependencies

P2 BUILD & ARTIFACT may need foundational identity and project references for ownership and access association.

DB-M01 must provide stable identifiers and relational conventions that later artifact records can reference.

The artifact domain remains responsible for its own records, object-storage references, metadata, and lifecycle. DB-M01 does not define the artifact schema.

### 3.4 P3 CONTROL PLANE dependencies

P3 CONTROL PLANE consumes the foundational identity, organization, membership, and project schema.

The control-plane implementation must establish how authenticated principals map to application identity records and how organization/project context is authorized.

Required alignment includes:

- Identity-provider subject mapping, where applicable.
- Membership and role semantics.
- Organization and project ownership.
- Authorization context propagation.
- Application service roles.
- Audit events required by control-plane actions.

DB-M01 provides persistence structures and database policy foundations. The control-plane and security owners remain responsible for application identity, authorization decisions, and service behavior.

### 3.5 PostgreSQL environment dependency

The database domain requires an available PostgreSQL instance compatible with the selected migration tooling and supported schema features.

The environment must provide:

- A documented PostgreSQL version.
- A reachable development or test database.
- A controlled database name and schema.
- A migration-capable role for initialization.
- An ordinary application role for runtime access tests.
- A test role or isolated test database for automated verification.
- A documented way to supply credentials securely.

A local or disposable test instance may be used during development. Passing tests against such an instance does not establish production infrastructure readiness.

### 3.6 Migration-tool dependency

The selected migration tool must support the required workflow and be compatible with the repository's development and automation environment.

The tool must provide sufficient capabilities for:

- Ordered migrations.
- Migration history.
- Failure reporting.
- Reproducible initialization.
- CI or automated verification.
- Documented handling of migration failures.

If the selected tool cannot safely roll back a migration, the project must document an appropriate recovery approach rather than assuming rollback support.

### 3.7 Backend integration dependency

The backend requires a documented database access pattern consistent with the schema and security model.

Required alignment includes:

- Runtime database role.
- Connection lifecycle and pooling.
- Transaction boundaries.
- Tenant-context propagation.
- Error mapping.
- Audit-event emission.
- Data access conventions.
- Schema compatibility expectations.

The backend architecture owns service boundaries and implementation. DB-M01 supplies the database contracts and constraints that the implementation must respect.

### 3.8 Security architecture dependency

The RLS baseline must be consistent with the approved security architecture.

Required decisions include:

- Which tables are tenant-scoped.
- Which roles are subject to RLS.
- How tenant context is established.
- How privileged operations are separated.
- Whether table owners or privileged roles can bypass policies.
- How missing context behaves.
- How application and database authorization responsibilities interact.
- Which actions require audit records.

If these decisions are unresolved, DB-M01 must record the dependency and avoid treating the security baseline as accepted.

### 3.9 Identity-provider dependency

If an external identity provider is used, DB-M01 requires an approved representation of the external subject and its relationship to the application identity.

The schema must not assume that email address alone is a stable identity key. Email addresses may change, may be reused, or may not be verified.

Identity-provider configuration, authentication protocols, account linking, and token validation belong to the control-plane and security owners.

### 3.10 Database migration and release dependency

Schema changes must fit the repository's accepted release and compatibility practices.

The migration workflow must define how changes are reviewed, tested, and coordinated with the backend version that consumes them.

The global release process owns release sequencing and deployment policy. DB-M01 owns the foundational migration conventions and database-specific validation requirements.

### 3.11 Test automation dependency

DB-M01 requires an automated environment capable of applying migrations and verifying database behavior.

The test setup must be able to exercise:

- A clean database.
- A database with migrations already applied.
- Constraint violations.
- RLS behavior under ordinary application roles.
- Different organization contexts.
- Audit insertion and mutation restrictions.
- Migration failure reporting.

Tests must not run destructive initialization against a shared or production database.

### 3.12 Cloud environment dependency

Development and integration environments may rely on cloud-managed PostgreSQL or related infrastructure.

The cloud domain owns provisioning, networking, environment isolation, and secret distribution. DB-M01 defines the database-level requirements that those environments must satisfy.

The migration and RLS workflow must be tested in a representative environment when cloud-specific behavior affects the database contract.

### 3.13 Dependency readiness criteria

A dependency is considered ready when:

- Its authoritative owner is identified.
- Required decisions are recorded.
- Its contract is documented or otherwise reviewable.
- DB-M01 can verify the relevant assumptions.
- Unresolved behavior is explicitly identified.
- No security-critical assumption depends solely on undocumented behavior.

Dependencies must be classified as blocking, conditionally blocking, or non-blocking.

- **Blocking:** the foundation cannot be correctly or securely established without the dependency.
- **Conditionally blocking:** work can proceed, but the affected capability cannot be accepted until the dependency is resolved.
- **Non-blocking:** the dependency affects an optional or later capability without invalidating the accepted foundation.

Dependency assignments and task sequencing belong in `TASKS.md`.

### 3.14 Cross-phase handoff table

| Handoff | Producing phase | Consuming phase | Required evidence |
|---|---|---|---|
| Common engineering conventions | P0 FOUNDATION | DB-M01 FOUNDATION | Database development and test workflow follows common conventions |
| Identity and project persistence | DB-M01 FOUNDATION | P1 STUDIO | Stable identity and project relationships are available |
| Foundational ownership references | DB-M01 FOUNDATION | P2 BUILD & ARTIFACT | Artifact-related records can reference the approved project and identity model |
| Identity, organization, membership, and project foundations | DB-M01 FOUNDATION | P3 CONTROL PLANE | Schema and database access conventions support the control-plane implementation |
| Foundational schema extension | DB-M01 FOUNDATION | DB-M02 CORE DATA (P3) | Migration, identifier, and RLS conventions are documented |
| Booking data foundation | DB-M01 FOUNDATION | DB-M03 BOOKING DATA (P4) | Later booking records can follow the established schema and migration conventions |
| Execution and results data foundation | DB-M01 FOUNDATION | DB-M04 EXECUTION DATA (P5-P7) | Later execution, lab, live, and results records can use the foundational identifiers and conventions |
| Database environment requirements | Database domain | C-M02 DEVELOPMENT (P1-P3) | Development infrastructure can provide the required PostgreSQL environment |
| Database security baseline | DB-M01 FOUNDATION | Security and control-plane owners | RLS assumptions, role boundaries, and verification requirements are documented |
| Production database requirements | Database domain | P8 PRODUCTION | Operational requirements and unresolved production concerns are handed off without claiming production readiness |

### 3.15 Dependency change control

Changes to foundational identity, organization, project, RLS, or audit assumptions can affect every later database milestone.

A proposed change must identify:

- The foundational concept being changed.
- The reason for the change.
- The affected schema and migrations.
- The affected services and consumers.
- The effect on RLS and tenant isolation.
- The effect on audit provenance.
- The compatibility and migration implications.
- The relevant domain owners who must review it.

Changes must follow the established review and release process. DB-M01 must not silently change foundational semantics to accommodate one downstream service.

---

## 4. Deliverables

### 4.1 PostgreSQL foundation documentation

Deliver a documented PostgreSQL baseline for supported development and integration use.

The documentation must identify the supported version, connection requirements, initialization prerequisites, environment variables or configuration inputs, and verification workflow.

It must distinguish database-level configuration from cloud infrastructure provisioning and production operations.

**Completion evidence:** a developer can identify the required database environment and verify connectivity using the documented process.

### 4.2 Database configuration contract

Deliver an explicit configuration contract for database access.

It must document required connection settings, environment separation, secret handling expectations, connection security assumptions, and behavior when required settings are absent.

Secrets must not be committed to the repository.

**Completion evidence:** configuration validation can detect missing required settings without exposing secret values.

### 4.3 Schema conventions

Deliver foundational schema conventions for identifiers, naming, timestamps, constraints, indexes, and ownership.

The conventions must be specific enough for later database milestones to extend the schema without creating inconsistent foundational representations.

**Completion evidence:** the conventions are documented and applied consistently to the foundational schema.

### 4.4 Migration tooling and history

Deliver a configured migration workflow with ordered migration files and persistent migration history.

The workflow must support initialization of a clean supported database and report migration failures clearly.

**Completion evidence:** automated or repeatable verification demonstrates successful initialization and reliable migration-history tracking.

### 4.5 Migration safety documentation

Deliver the database-specific migration safety conventions.

The documentation must cover transaction behavior, failed migrations, retry conditions, destructive changes, compatibility considerations, and recovery from partially applied operations.

**Completion evidence:** migration failure and recovery behavior are documented and validated for the operations used by the foundation.

### 4.6 Foundational identity schema

Deliver the application identity schema and required constraints.

The schema must use stable identifiers and explicitly defined uniqueness rules. It must distinguish application identity from authentication credentials and external identity-provider state.

**Completion evidence:** schema tests verify required fields, identifier uniqueness, and approved external subject mapping constraints.

### 4.7 Organization schema

Deliver the organization record and its foundational constraints.

The schema must support stable organization identity, required attributes, lifecycle semantics where applicable, and references from membership and project records.

**Completion evidence:** schema tests verify required fields, uniqueness rules, and relationship integrity.

### 4.8 Organization membership schema

Deliver the organization membership relationship between identities and organizations.

The schema must define the intended membership uniqueness rule, membership state, required references, and approved role representation.

**Completion evidence:** tests verify valid membership creation, duplicate relationship handling, and rejection of invalid identity or organization references.

### 4.9 Project schema foundation

Deliver the project record and its ownership relationship.

The schema must enforce the approved organization or ownership reference and required project attributes.

**Completion evidence:** tests verify project ownership integrity, required values, and the intended uniqueness rules.

### 4.10 Foundational relational constraints

Deliver primary keys, foreign keys, unique constraints, check constraints, and indexes required by the foundational model.

Deletion and update behavior must be explicit, particularly where cascading changes could remove protected audit records or invalidate downstream references.

**Completion evidence:** database tests verify representative valid and invalid operations against the foundational constraints.

### 4.11 RLS baseline

Deliver the foundational row-level security policies for the protected tables identified by the approved security design.

The baseline must define which roles are subject to RLS and how organization or project context constrains reads and writes.

**Completion evidence:** tests executed under the ordinary application role demonstrate the expected access boundaries, including denied access when required context is absent or invalid.

### 4.12 Tenant-context handling requirements

Deliver documented requirements for how tenant context is established and isolated for each database operation.

The requirements must address transaction scope, pooled connections, missing context, and context cleanup.

**Completion evidence:** tests demonstrate that one operation's organization context cannot unintentionally authorize access during a subsequent operation using a reused connection.

### 4.13 Database role and privilege baseline

Deliver a documented role and privilege model for schema migration, ordinary application access, and automated testing.

The ordinary application role must not have unnecessary administrative or RLS-bypass privileges.

**Completion evidence:** role and privilege inspection confirms that the intended separation exists in the supported test environment.

### 4.14 Audit persistence schema

Deliver the foundational audit record structure and constraints.

The record must support event identity, timestamp, actor or system principal, action, target, relevant organization or project context, and correlation metadata where required.

**Completion evidence:** tests demonstrate that valid audit events can be persisted and associated with the appropriate context.

### 4.15 Audit protection baseline

Deliver the database-level protections required to prevent ordinary application roles from silently rewriting protected audit history.

The access model must document which roles may append, read, or administer audit records.

**Completion evidence:** tests demonstrate the intended insertion and read behavior and verify that unauthorized updates or deletes are rejected.

### 4.16 Timestamp and identifier conventions

Deliver documented and implemented timestamp and identifier conventions for the foundational schema.

The conventions must distinguish event timestamps from database-record timestamps and maintain consistent identifier types across required relationships.

**Completion evidence:** schema inspection and automated tests verify the approved conventions.

### 4.17 Indexing baseline

Deliver indexes required for primary-key lookups, relationship integrity, membership lookup, project ownership lookup, and approved audit queries.

Indexes must be justified by integrity or expected access requirements rather than speculative optimization.

**Completion evidence:** schema inspection confirms required indexes exist and their purposes are documented.

### 4.18 Schema verification and drift checks

Deliver a repeatable verification method for the migration history and critical foundational schema objects.

The check must identify missing required constraints, policies, or migration records within its documented scope.

**Completion evidence:** verification succeeds on the expected schema and detects a representative intentionally introduced inconsistency.

### 4.19 Automated foundation tests

Deliver automated tests for the database foundation.

The test suite must cover migration initialization, relational constraints, organization/project relationships, RLS behavior, role boundaries, and audit protections as applicable.

**Completion evidence:** the tests execute against an isolated supported database and produce repeatable results.

### 4.20 Development initialization workflow

Deliver a documented workflow for initializing and verifying a development database.

The workflow must state prerequisites, configuration, migration commands, verification commands, and safe cleanup procedures.

Destructive reset operations must be clearly restricted to disposable databases.

**Completion evidence:** a developer can follow the workflow from a clean environment without undocumented manual database changes.

### 4.21 Error and failure visibility

Deliver clear database-level failure behavior for the foundational operations.

Migration failures, integrity violations, RLS rejections, and missing configuration must be detectable by the trusted caller and test infrastructure.

The backend remains responsible for mapping these failures to public API responses.

**Completion evidence:** tests verify representative failure conditions and confirm that error reporting does not disclose secrets.

### 4.22 Foundational schema handoff

Deliver a documented handoff for later database milestones.

The handoff must identify:

- Foundational table ownership.
- Identifier conventions.
- Foreign-key expectations.
- Migration workflow.
- RLS requirements.
- Tenant-context assumptions.
- Audit conventions.
- Required schema verification.
- Known limitations and unresolved decisions.

**Completion evidence:** the owners of DB-M02 CORE DATA (P3), DB-M03 BOOKING DATA (P4), and DB-M04 EXECUTION DATA (P5-P7) can identify the conventions they must follow without duplicating foundational ownership.

### 4.23 Security handoff

Deliver a database-specific security handoff covering the RLS baseline, role separation, tenant-context assumptions, and audit protections.

The handoff must identify what is enforced in PostgreSQL and what remains the responsibility of application services and the global security architecture.

**Completion evidence:** security and backend owners can review the database boundary and identify the remaining application-level controls.

### 4.24 Cloud and production handoff

Deliver the database environment requirements needed by the cloud and production owners.

The handoff must distinguish development and integration requirements from production requirements such as high availability, backup, restore, failover, monitoring, capacity, and operational access.

**Completion evidence:** the cloud and production owners can identify required database capabilities and outstanding production decisions without treating DB-M01 acceptance as production readiness.

### 4.25 Documentation and traceability

Deliver the authoritative documentation links for the database foundation, including schema conventions, migration tooling, RLS assumptions, audit requirements, and verification procedures.

The documentation must identify the owner of each concern and link to global architecture, security, testing, and release documents instead of duplicating their full contents.

**Completion evidence:** required documentation is present, internally consistent, and linked to the authoritative sibling and domain documents.

### 4.26 Deliverable ownership summary

| Deliverable | Phase-level owner | Implementation owner |
|---|---|---|
| PostgreSQL foundation requirements | DB-M01 FOUNDATION | Database domain |
| Migration tooling and history | DB-M01 FOUNDATION | Database domain |
| Foundational schema conventions | DB-M01 FOUNDATION | Database domain |
| Identity schema | DB-M01 FOUNDATION | Database domain, aligned with control-plane owner |
| Organization schema | DB-M01 FOUNDATION | Database domain |
| Membership schema | DB-M01 FOUNDATION | Database domain, aligned with security owner |
| Project schema foundation | DB-M01 FOUNDATION | Database domain, aligned with project owner |
| RLS baseline | DB-M01 FOUNDATION | Database domain with security and backend review |
| Runtime tenant-context propagation | Backend domain | Backend domain |
| Global authorization policy | P3 CONTROL PLANE and security owner documents | Security and backend domains |
| Audit persistence foundation | DB-M01 FOUNDATION | Database domain |
| Application audit-event emission | Backend domain | Backend services |
| Booking persistence | DB-M03 BOOKING DATA (P4) | Database domain and booking owner |
| Execution and results persistence | DB-M04 EXECUTION DATA (P5-P7) | Database domain and applicable domain owners |
| Cloud database provisioning | Cloud domain | Cloud domain |
| Production database operations | P8 PRODUCTION and applicable operational owners | Production and cloud domains |
| Detailed DB-M01 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Task owners and reviewers |

### 4.27 Required milestone records

The DB-M01 FOUNDATION directory maintains these sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, sequencing, dependencies, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail conditions and evidence requirements |
| `REVIEW_CHECKLIST.md` | Review checks and evidence inspection |
| `CHANGELOG.md` | Accepted changes and milestone history |
| `GIT_COMMIT_STEP.md` | Repository and commit procedure |

These records are complementary. The milestone dossier establishes the scope contract; the sibling files own task-level planning, acceptance evidence, review execution, accepted history, and commit procedure.

---

## 9. Risks

### 9.1 Migration history diverges from the actual schema

**Risk:** The recorded migration history does not match the database schema.

**Impact:** New environments may initialize differently, and later migrations may fail or produce inconsistent structures.

**Mitigation:**

- Use ordered and uniquely identified migrations.
- Verify migration history after initialization.
- Include schema checks for critical constraints and policies.
- Restrict undocumented manual schema changes.
- Document recovery procedures for failed migrations.

**Owner:** Database domain.

### 9.2 Migration failure leaves partial state

**Risk:** A migration fails after some operations have taken effect.

**Impact:** The schema may be neither at the previous version nor at the intended version.

**Mitigation:**

- Define transaction behavior for the selected tool.
- Identify operations that cannot be safely rolled back.
- Verify the post-failure migration state.
- Document repair and retry procedures.
- Never mark an incomplete migration as successful.

**Owner:** Database domain.

### 9.3 Destructive migration removes required data

**Risk:** A schema change drops or rewrites data without an approved compatibility or recovery plan.

**Impact:** Irrecoverable loss or corruption of foundational records.

**Mitigation:**

- Review destructive operations explicitly.
- Document required transformations and data backfills.
- Consider compatibility with application versions.
- Establish recovery expectations before execution.
- Keep production change approval with the global release and production processes.

**Owner:** Database domain and affected domain owners.

### 9.4 Inconsistent foundational identifiers

**Risk:** Identity, organization, membership, or project tables use incompatible identifier types or semantics.

**Impact:** Broken relationships, duplicated concepts, and expensive downstream schema changes.

**Mitigation:**

- Define identifier conventions before adding foundational tables.
- Apply consistent types across primary and foreign keys.
- Document approved exceptions.
- Verify schema consistency automatically.
- Review downstream references before changing established identifiers.

**Owner:** Database domain.

### 9.5 Ambiguous identity uniqueness

**Risk:** The schema uses an unstable attribute, such as an unverified email address, as the sole identity key.

**Impact:** Account collisions, accidental identity reassignment, or broken external identity mapping.

**Mitigation:**

- Use a stable application identity identifier.
- Define external provider and subject uniqueness explicitly.
- Avoid assuming email is immutable.
- Prevent silent reuse of an identity identifier.
- Align identity mapping with the control-plane and security owners.

**Owner:** Database domain with P3 CONTROL PLANE and security review.

### 9.6 Organization membership duplicates

**Risk:** The schema allows duplicate membership relationships that contradict the approved model.

**Impact:** Ambiguous access decisions and inconsistent organization membership.

**Mitigation:**

- Define the uniqueness scope.
- Enforce the intended relationship constraint.
- Specify soft-deletion and membership-history semantics.
- Test duplicate creation and reactivation behavior.
- Keep role and authorization semantics aligned with the security owner.

**Owner:** Database domain.

### 9.7 Project ownership is ambiguous

**Risk:** A project can exist without a valid organization or approved ownership relationship.

**Impact:** Inconsistent authorization and cross-organization data exposure.

**Mitigation:**

- Enforce the required ownership relationship.
- Use foreign keys and appropriate constraints.
- Avoid inferring ownership from display fields.
- Test invalid and mismatched ownership references.
- Review any exception through the approved architecture process.

**Owner:** Database domain and project/control-plane owners.

### 9.8 RLS is enabled but ineffective

**Risk:** RLS policies exist but do not enforce the intended isolation for ordinary application access.

**Impact:** Protected records may be visible or writable across organization boundaries.

**Mitigation:**

- Test under the actual ordinary application role.
- Review table ownership and bypass privileges.
- Test both read and write policies.
- Verify missing and invalid tenant context.
- Include cross-organization negative tests.

**Owner:** Database domain and security owner.

### 9.9 Privileged role bypasses RLS

**Risk:** An application role has privileges that bypass RLS or access controls.

**Impact:** Database isolation can be bypassed despite the presence of policies.

**Mitigation:**

- Separate migration and runtime roles.
- Avoid superuser or equivalent bypass privileges for ordinary services.
- Inspect role attributes and memberships.
- Test with the deployed runtime role configuration.
- Restrict privileged access to approved operational paths.

**Owner:** Database and cloud domains, with security review.

### 9.10 Tenant context leaks across pooled connections

**Risk:** Organization context from one request remains active when a connection is reused for another request.

**Impact:** A subsequent request may read or modify records under the wrong tenant context.

**Mitigation:**

- Define transaction and session-context semantics.
- Set context explicitly for each operation or transaction.
- Clear request-scoped state reliably.
- Test connection reuse across different organizations.
- Review behavior under rollback and exception paths.

**Owner:** Backend domain and database domain.

### 9.11 Missing tenant context grants broad access

**Risk:** RLS policies interpret absent context as unrestricted access.

**Impact:** A configuration error or incomplete request can expose protected data.

**Mitigation:**

- Define fail-closed behavior.
- Test missing, malformed, and unauthorized context.
- Avoid permissive fallback expressions.
- Review every protected policy.
- Require explicit review for any exception.

**Owner:** Database domain and security owner.

### 9.12 RLS policy does not protect writes

**Risk:** Read access is constrained but insert, update, or delete operations can cross organization boundaries.

**Impact:** Unauthorized data creation, reassignment, or modification.

**Mitigation:**

- Review policies for each required operation.
- Test insert, update, and delete behavior.
- Verify organization ownership cannot be changed to an unauthorized value.
- Use constraints and policies together where appropriate.
- Include negative tests for mismatched tenant context.

**Owner:** Database domain.

### 9.13 RLS policy and application authorization disagree

**Risk:** The application permits an operation that the database rejects, or the database permits a row access that the application should deny.

**Impact:** Inconsistent behavior and potentially exploitable authorization gaps.

**Mitigation:**

- Define the responsibility of each enforcement layer.
- Align tenant context and role semantics.
- Test end-to-end authorization cases.
- Avoid duplicating authorization rules without traceability.
- Keep global policy with the security and control-plane owners.

**Owner:** Security, backend, and database domains.

### 9.14 Audit records can be modified by ordinary roles

**Risk:** Ordinary application access can update or delete protected audit records.

**Impact:** Loss of provenance and reduced confidence in investigations.

**Mitigation:**

- Define explicit audit-table privileges.
- Separate append, read, and administrative operations.
- Test update and delete restrictions.
- Restrict privileged administrative access.
- Document any approved retention or correction mechanism.

**Owner:** Database domain and security owner.

### 9.15 Required actions are not audited

**Risk:** The schema exists but application services fail to emit required audit events.

**Impact:** Important changes cannot be reconstructed reliably.

**Mitigation:**

- Define required audit actions with the security and backend owners.
- Establish event-emission responsibilities.
- Test representative end-to-end actions.
- Avoid treating table existence as proof of audit completeness.
- Document failure behavior when an audit event cannot be recorded.

**Owner:** Backend and security domains, with database support.

### 9.16 Sensitive information is copied into audit metadata

**Risk:** Audit payloads contain tokens, credentials, or unnecessary sensitive data.

**Impact:** Persistent exposure of information that should not be retained in logs or audit records.

**Mitigation:**

- Define an explicit metadata allowlist or equivalent schema policy.
- Avoid indiscriminate request-body capture.
- Review audit event fields.
- Apply the data-classification policy.
- Test representative audit payloads for secret leakage.

**Owner:** Security and backend domains.

### 9.17 Foreign-key deletion removes important history

**Risk:** Cascading deletion removes audit or ownership history needed for traceability.

**Impact:** Loss of evidence and broken references for later domain records.

**Mitigation:**

- Define deletion behavior per relationship.
- Avoid broad cascading deletes by default.
- Separate lifecycle deactivation from physical deletion where required.
- Review retention obligations.
- Test deletion effects on related records.

**Owner:** Database domain and affected domain owners.

### 9.18 Schema conventions are inconsistently applied

**Risk:** Foundational tables use inconsistent naming, timestamp, identifier, or nullability conventions.

**Impact:** Increased maintenance cost and inconsistent application behavior.

**Mitigation:**

- Document conventions before broad schema expansion.
- Apply review checks to migrations.
- Add automated schema inspections where practical.
- Record approved exceptions.
- Use the same conventions in later database milestones unless explicitly superseded.

**Owner:** Database domain.

### 9.19 Development reset affects a non-disposable database

**Risk:** A destructive initialization or reset command runs against a shared or production database.

**Impact:** Data loss and service disruption.

**Mitigation:**

- Clearly separate disposable test configuration.
- Require explicit environment selection for destructive commands.
- Validate target database identity before reset.
- Restrict privileges on shared environments.
- Document safe cleanup procedures.

**Owner:** Database and development-tooling owners.

### 9.20 Connection credentials leak

**Risk:** Database credentials are committed, logged, or exposed in error output.

**Impact:** Unauthorized database access and possible data exposure.

**Mitigation:**

- Keep secrets outside source control.
- Use approved secret injection.
- Redact sensitive connection information.
- Avoid logging full connection strings.
- Rotate exposed credentials through the relevant operational process.

**Owner:** Security and cloud domains, with database and backend support.

### 9.21 Runtime role has excessive privileges

**Risk:** The ordinary application role can alter schema, manage roles, or perform unrelated administrative actions.

**Impact:** An application compromise can cause wider database damage.

**Mitigation:**

- Grant only required privileges.
- Separate migration execution from runtime access.
- Inspect role memberships.
- Test privilege boundaries.
- Review changes to grants as part of migration review.

**Owner:** Database and security domains.

### 9.22 Migration tooling differs across environments

**Risk:** Local, automated, and shared environments apply migrations differently.

**Impact:** Environment drift and failures that appear only after deployment.

**Mitigation:**

- Pin or document the supported tooling version.
- Use the same migration entry point where practical.
- Verify clean initialization in automation.
- Document environment-specific differences.
- Avoid undocumented manual schema changes.

**Owner:** Database and development-tooling owners.

### 9.23 Audit timestamps are ambiguous

**Risk:** Audit records confuse event occurrence time with database insertion or update time.

**Impact:** Incorrect ordering and misleading investigations.

**Mitigation:**

- Define timestamp semantics explicitly.
- Use consistent time-zone conventions.
- Preserve source event time when it differs from persistence time.
- Document clock assumptions.
- Test timestamp serialization and retrieval.

**Owner:** Database and backend domains.

### 9.24 Indexing is insufficient or excessive

**Risk:** Foundational queries become inefficient, or excessive indexes add unnecessary write and maintenance cost.

**Impact:** Slower operations and unpredictable performance as data grows.

**Mitigation:**

- Index primary keys and required relationship paths.
- Review expected membership, project, and audit queries.
- Verify indexes required by the accepted schema.
- Measure before introducing speculative indexes.
- Leave production capacity tuning to the appropriate owner.

**Owner:** Database domain.

### 9.25 Database errors expose internal details

**Risk:** Raw database errors, schema details, or sensitive values are returned to end users.

**Impact:** Information leakage and poor user-facing behavior.

**Mitigation:**

- Separate trusted diagnostic details from public API responses.
- Redact sensitive values.
- Map database failures through the backend error contract.
- Test representative constraint and RLS failures.
- Preserve enough internal diagnostic context for authorized troubleshooting.

**Owner:** Backend and security domains, with database support.

### 9.26 Foundational schema becomes overloaded with domain data

**Risk:** Booking, execution, lab, or results tables are placed into the foundation without clear ownership.

**Impact:** Duplicate ownership, coupled migrations, and difficult future changes.

**Mitigation:**

- Keep DB-M01 focused on identity, organization, project, RLS, audit, and migration foundations.
- Assign domain tables to the appropriate database milestone.
- Use explicit foreign-key references to foundational entities.
- Review cross-domain schema additions with the owning domain.
- Keep milestone dossiers authoritative for scope.

**Owner:** Database domain and milestone owners.

### 9.27 Schema change breaks downstream consumers

**Risk:** A foundational migration changes an identifier, relationship, or column semantic used by later phases.

**Impact:** Runtime failures or corrupted relationships in dependent services.

**Mitigation:**

- Identify consumers before changing foundational semantics.
- Review compatibility and migration sequencing.
- Use additive changes where appropriate.
- Test representative consumers.
- Coordinate changes through the global release process.

**Owner:** Database domain and affected backend/domain owners.

### 9.28 Production readiness is inferred from development success

**Risk:** Passing local migration and RLS tests is interpreted as proof of production backup, availability, recovery, or capacity.

**Impact:** Production deployment proceeds without required operational controls.

**Mitigation:**

- Record the exact environment used for verification.
- Keep production requirements explicit and separately owned.
- Hand off unresolved operational requirements to P8 PRODUCTION.
- Require production-specific verification by the appropriate owner.
- Avoid unsupported availability or recovery claims.

**Owner:** P8 PRODUCTION and cloud/database operational owners.

### 9.29 Documentation and implementation diverge

**Risk:** The migration workflow, RLS design, or audit behavior changes without corresponding documentation updates.

**Impact:** Developers rely on outdated assumptions and later milestones implement incompatible schemas.

**Mitigation:**

- Review documentation with schema changes.
- Link migration changes to their owning tasks.
- Verify required documentation during milestone review.
- Keep task and acceptance details in sibling files.
- Record accepted changes in `CHANGELOG.md`.

**Owner:** Database domain and DB-M01 milestone owner.

---

## 10. Exit criteria

DB-M01 FOUNDATION may be declared complete only when the PostgreSQL foundation, migration workflow, foundational identity/organization/project schema, RLS baseline, and audit persistence foundation are implemented and verified against the accepted requirements.

Acceptance requires evidence from an isolated supported PostgreSQL environment. The presence of migration files or RLS declarations alone is not sufficient.

Detailed pass/fail conditions and required evidence belong in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection belong in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The implemented scope matches this dossier.
- [ ] PostgreSQL foundation, migration tooling, identity/organization/project schema, RLS baseline, and audit foundation have explicit ownership.
- [ ] DB-M01 does not absorb booking, execution, lab, live, or results domain schemas.
- [ ] DB-M02 CORE DATA (P3) extends the foundation rather than duplicating it.
- [ ] DB-M03 BOOKING DATA (P4) owns booking and commercial persistence.
- [ ] DB-M04 EXECUTION DATA (P5-P7) owns execution, lab, live, and results persistence within its scope.
- [ ] Backend, security, cloud, and database responsibilities are distinguished.
- [ ] Canonical phase and milestone references follow the frozen model.
- [ ] Sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 PostgreSQL and configuration

- [ ] The supported PostgreSQL version or version range is documented.
- [ ] Development and test database prerequisites are documented.
- [ ] Required connection configuration is explicit.
- [ ] Environment-specific configuration is separated from application source.
- [ ] Secrets are not committed to the repository.
- [ ] Missing required configuration fails clearly.
- [ ] The documented verification workflow confirms database connectivity.
- [ ] Development database setup is repeatable.

### 10.3 Migration tooling

- [ ] The selected migration tool and supported invocation are documented.
- [ ] Migration identifiers are unique and ordered.
- [ ] Migration history is persisted and inspectable.
- [ ] A clean database can be initialized through the approved workflow.
- [ ] Reapplying the workflow does not silently corrupt or duplicate schema state.
- [ ] Failed migrations are reported clearly.
- [ ] Migration transaction behavior is documented.
- [ ] Retry and recovery limitations are documented.
- [ ] Destructive changes have explicit review and compatibility expectations.
- [ ] Schema verification can detect required missing objects or policies within its documented scope.

### 10.4 Foundational identity schema

- [ ] Application identity has a stable identifier.
- [ ] Required identity fields and lifecycle semantics are documented.
- [ ] Identity uniqueness constraints are implemented.
- [ ] External identity-provider subject mapping, if used, has explicit uniqueness scope.
- [ ] Email is not assumed to be an immutable identity key without an approved decision.
- [ ] Authentication credentials and tokens are not stored in ordinary identity profile fields.
- [ ] Identity references maintain referential integrity.
- [ ] Tests cover valid and invalid identity records.

### 10.5 Organization and membership schema

- [ ] Organization records have stable identifiers.
- [ ] Required organization fields and uniqueness rules are defined.
- [ ] Membership references valid identity and organization records.
- [ ] Membership uniqueness semantics are explicit.
- [ ] Membership status and role representation are documented.
- [ ] Duplicate membership behavior is tested.
- [ ] Invalid membership references are rejected.
- [ ] Deactivation and deletion behavior is documented.
- [ ] Organization and membership relationships can support the approved access model.

### 10.6 Project schema foundation

- [ ] Project records have stable identifiers.
- [ ] Project ownership is explicit.
- [ ] Required project attributes are constrained.
- [ ] Project-to-organization relationships enforce referential integrity.
- [ ] Intended uniqueness rules are implemented.
- [ ] Invalid ownership references are rejected.
- [ ] Project data can be isolated using the approved organization or project context.
- [ ] Tests cover valid and invalid project ownership.

### 10.7 Relational integrity and conventions

- [ ] Foundational primary keys are defined.
- [ ] Required foreign keys are defined.
- [ ] Unique constraints reflect approved semantics.
- [ ] Check constraints enforce applicable state and value requirements.
- [ ] Nullability is intentional and documented.
- [ ] Referential actions are explicit.
- [ ] Cascading deletion does not unintentionally remove protected audit history.
- [ ] Identifier types are consistent across required relationships.
- [ ] Timestamp semantics are documented.
- [ ] Required indexes exist and their purposes are known.
- [ ] Foundational schema naming conventions are applied consistently.

### 10.8 RLS baseline

- [ ] Tables requiring RLS are identified.
- [ ] RLS is enabled where required.
- [ ] Policies cover the required read operations.
- [ ] Policies cover the required write operations.
- [ ] Missing tenant context fails closed where required.
- [ ] Invalid or unauthorized context does not grant broader access.
- [ ] Organization and project relationships are respected.
- [ ] Policy behavior is tested using the ordinary application role.
- [ ] Privileged roles and RLS-bypass capabilities are reviewed.
- [ ] Table ownership and role attributes are included in the security review.
- [ ] Cross-organization read and write attempts are tested.
- [ ] RLS behavior remains consistent with the approved security architecture.

### 10.9 Role separation and tenant-context hygiene

- [ ] Migration and runtime roles are separated where required by the approved design.
- [ ] The ordinary application role has only required privileges.
- [ ] The ordinary application role does not have unnecessary superuser or RLS-bypass privileges.
- [ ] Tenant context is established according to the approved database access pattern.
- [ ] Request-scoped context is isolated across operations.
- [ ] Reused connections do not retain unauthorized tenant context.
- [ ] Error and rollback paths do not leave unsafe context behind.
- [ ] Tests cover missing context, invalid context, and context changes across requests.
- [ ] Role and privilege configuration is inspectable and documented.

### 10.10 Audit persistence and protection

- [ ] The foundational audit schema is implemented.
- [ ] Audit events have stable identifiers and documented timestamp semantics.
- [ ] Actor or system-principal references are represented as required.
- [ ] Action and target fields have defined meanings.
- [ ] Organization/project and correlation context are preserved where required.
- [ ] Audit metadata avoids unnecessary secrets and sensitive payloads.
- [ ] Insert and read privileges are explicitly defined.
- [ ] Ordinary application roles cannot silently modify or delete protected audit history.
- [ ] Audit-related foreign-key and deletion behavior is documented.
- [ ] Tests cover valid audit insertion and prohibited mutation.
- [ ] Application-level responsibilities for emitting required events are documented.
- [ ] The existence of the audit table is not treated as proof of complete application audit coverage.

### 10.11 Migration and schema verification

- [ ] Migration history matches the expected schema version.
- [ ] Required foundational tables exist.
- [ ] Required constraints and indexes exist.
- [ ] Required RLS policies exist.
- [ ] Role and privilege assumptions are verified in the supported test environment.
- [ ] A representative schema inconsistency is detected by the verification workflow.
- [ ] Failed migration behavior is documented and tested where practical.
- [ ] Clean initialization is repeatable.
- [ ] No undocumented manual schema changes are required for successful initialization.

### 10.12 Automated verification

- [ ] Database tests run against an isolated supported PostgreSQL instance.
- [ ] Migration initialization tests pass.
- [ ] Migration history tests pass.
- [ ] Primary- and foreign-key tests pass.
- [ ] Identity uniqueness tests pass.
- [ ] Organization and membership tests pass.
- [ ] Project ownership tests pass.
- [ ] RLS positive and negative tests pass.
- [ ] Tenant-context isolation tests pass.
- [ ] Role privilege tests pass.
- [ ] Audit insertion and mutation-protection tests pass.
- [ ] Error behavior for representative constraint and policy failures is verified.
- [ ] Test results are recorded according to the sibling acceptance and review documents.
- [ ] Tests do not perform destructive operations against shared or production databases.

### 10.13 Documentation and traceability

- [ ] PostgreSQL baseline requirements are documented.
- [ ] Connection configuration requirements are documented.
- [ ] Migration tooling and recovery limitations are documented.
- [ ] Foundational identity, organization, membership, and project ownership are documented.
- [ ] RLS and tenant-context assumptions are documented.
- [ ] Database role and privilege expectations are documented.
- [ ] Audit schema and access expectations are documented.
- [ ] Schema verification and test workflows are documented.
- [ ] Known limitations and unresolved dependencies are explicit.
- [ ] The authoritative architecture, protocol, security, backend, cloud, testing, and release documents are linked.
- [ ] `TASKS.md` contains the detailed task decomposition.
- [ ] `ACCEPTANCE_CRITERIA.md` contains detailed pass/fail conditions and evidence requirements.
- [ ] `REVIEW_CHECKLIST.md` contains review actions and evidence inspection.
- [ ] `CHANGELOG.md` contains accepted change history.
- [ ] `GIT_COMMIT_STEP.md` contains the repository and commit procedure.

### 10.14 Downstream readiness

- [ ] DB-M02 CORE DATA (P3) can extend the foundation without creating duplicate identity or organization structures.
- [ ] DB-M03 BOOKING DATA (P4) can reference the approved foundational identifiers.
- [ ] DB-M04 EXECUTION DATA (P5-P7) can reference the approved foundational identifiers.
- [ ] Downstream owners understand the migration workflow.
- [ ] Downstream owners understand the RLS and tenant-context conventions.
- [ ] Downstream owners understand the audit and timestamp conventions.
- [ ] Any unresolved downstream dependency has an identified owner and disposition.
- [ ] No unresolved foundational defect blocks safe extension of the schema.

### 10.15 Final milestone acceptance

DB-M01 FOUNDATION is ready for formal acceptance when:

1. PostgreSQL development and test prerequisites are documented and verifiable.
2. The migration workflow initializes a clean supported database repeatably.
3. Migration history and failure behavior are inspectable.
4. Identity, organization, membership, and project schema foundations are implemented with appropriate constraints.
5. The RLS baseline enforces the intended database-level isolation for ordinary application access.
6. Database roles and tenant-context handling follow the approved least-privilege model.
7. Audit persistence and protection satisfy the foundational requirements.
8. Required automated database and security tests pass.
9. Critical risks are mitigated or formally dispositioned by the relevant owners.
10. Schema, migration, RLS, and audit documentation is complete and consistent.
11. Later database milestones can extend the schema without duplicating foundational ownership.
12. Required acceptance and review evidence is available through the sibling files.
13. No unresolved issue invalidates migration integrity, foundational relational integrity, tenant isolation, or audit protection.

Acceptance of DB-M01 FOUNDATION does not establish production database readiness, production availability, backup and recovery compliance, or production-scale performance. Those outcomes remain with P8 PRODUCTION and the authoritative database and cloud operational documents.
