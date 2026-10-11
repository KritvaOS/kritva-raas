# Database Architecture

**Document:** `docs/database/architecture/DATABASE_ARCHITECTURE.md`  
**Project:** Kritva RaaS  
**Status:** Implementation architecture contract  
**Audience:** Database engineering, backend engineering, platform engineering, cloud engineering, security, and technical leadership  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document defines the PostgreSQL implementation architecture for Kritva RaaS.

It establishes how the database is organized and operated in practice, including schema layout, migration strategy, transaction boundaries, isolation levels, row-level security, indexing, partitioning, connection management, pooling, backup and restore, and upgrade safety.

The objective is to provide a consistent, secure, maintainable, and testable relational persistence implementation that supports incremental product development without allowing database implementation choices to undermine application correctness or data integrity.

This document defines implementation contracts and engineering constraints. It does not redefine the database's system-level role, authority, or ownership of canonical application data.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns the PostgreSQL implementation architecture, including:

- Physical database and schema organization.
- Naming conventions for schemas, tables, columns, indexes, constraints, and sequences.
- Database migration tooling, ordering, versioning, and execution.
- Transaction boundaries and transaction implementation rules.
- Isolation-level selection and concurrency-control practices.
- Row-level security (RLS) implementation and policy validation.
- Index selection, query planning, and indexing conventions.
- Partitioning strategy and partition lifecycle management.
- Connection limits, connection pooling, and workload connection budgets.
- Database roles, grants, ownership, and implementation-level privilege separation.
- PostgreSQL configuration and environment-specific settings.
- Backup, point-in-time recovery, restore, and recovery testing.
- Database engine upgrades, extension upgrades, and migration safety.
- Database observability, performance diagnostics, and operational maintenance.
- Schema compatibility during application deployments.
- Database-specific testing, conformance checks, and acceptance evidence.

### 2.2 System Database Architecture Ownership

`docs/architecture/DATABASE_ARCHITECTURE.md` owns the system role and authority of the database, including:

- The database's responsibilities within Kritva RaaS.
- Canonical data ownership and system-of-record boundaries.
- Logical relationships between data domains.
- Which application or subsystem owns each data domain.
- System-level persistence requirements and architectural constraints.
- The relationship between database persistence and other system components.
- System-level consistency and durability expectations.
- Architectural rationale for data ownership and persistence boundaries.

This implementation document MUST link to the system document for role and authority. It MUST NOT duplicate or redefine those decisions.

If a proposed PostgreSQL implementation conflicts with the system-level database authority, the conflict MUST be resolved through an explicit architecture decision. The implementation MUST NOT silently redefine the system of record.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| System role and authority of the database | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| PostgreSQL implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| System backend modules and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Wire-level API contract | `docs/protocol/API_CONTRACT.md` |
| Event structure and delivery semantics | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact structure and manifest semantics | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Cloud resource provisioning and database service configuration | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Phase definitions | `planning/PHASES.md` |
| Database milestone scope and acceptance | `docs/database/milestones/` |
| Cross-discipline milestone scope | The applicable authoritative dossiers under `docs/**/milestones/` |
| Product requirements and business rules | The applicable product and system requirements documents |
| Database-specific application repositories and query implementation | The applicable backend implementation modules |

Directory references identify document families. The applicable document or milestone dossier remains authoritative for its defined subject.

### 2.4 Explicit Non-Goals

This document MUST NOT redefine:

- The system role or authority of the database.
- Canonical business entities or data-domain ownership.
- Product workflows, pricing, booking rules, or commercial policies.
- API request and response schemas.
- Event payload formats or event delivery guarantees.
- Artifact manifest formats or artifact validation rules.
- Backend module responsibilities.
- Cloud account, network, or managed-service topology.
- Frontend state management or client-side caching.
- Robot-side persistence or real-time control responsibilities.
- Phase definitions or milestone scope.

This document may specify how a canonical application contract is persisted in PostgreSQL, but the application contract itself remains owned by the corresponding system, protocol, or product document.

## 3. PostgreSQL Implementation Principles

### 3.1 Data Integrity

Data integrity MUST be enforced as close to the persistent data as practical.

Primary keys, foreign keys, unique constraints, check constraints, and appropriate non-null constraints MUST be used where they express durable invariants.

Application validation MUST NOT be treated as a substitute for database constraints protecting against concurrent writes or alternate write paths.

### 3.2 Explicit Transactions

Every multi-statement operation that requires atomicity MUST use an explicit transaction.

Transaction scope MUST be limited to the database work required for the operation.

Transactions MUST NOT remain open while waiting for user input, long-running external calls, or unbounded background work.

### 3.3 Controlled Schema Evolution

Schema changes MUST be version-controlled and reproducible.

Production schema changes MUST be applied through the approved migration mechanism rather than undocumented manual edits.

Migrations MUST account for compatibility between the old and new application versions when deployments can overlap.

### 3.4 Least Privilege

Application roles MUST receive only the privileges required for their workload.

Schema ownership, migration privileges, and runtime data-access privileges SHOULD be separated.

Application services MUST NOT use a PostgreSQL superuser account.

### 3.5 Measured Optimization

Indexes, partitioning, connection pool sizes, and database configuration MUST be justified by workload requirements, query plans, and operational evidence.

Premature partitioning or indiscriminate indexing SHOULD be avoided.

### 3.6 Recoverability

Production data MUST have a defined and tested recovery strategy.

A backup is not considered sufficient evidence of recoverability until restoration has been validated.

### 3.7 Environment Consistency

Development, staging, and production MUST use compatible schema definitions and migration ordering.

Environment-specific capacity and availability settings MAY differ, but undocumented schema differences MUST NOT be introduced.

## 4. Database Engine and Deployment Assumptions

### 4.1 Reference Engine

PostgreSQL is the reference relational database engine.

The implementation SHOULD use a supported PostgreSQL major version selected through an explicit compatibility and upgrade policy.

The selected major and minor versions MUST be pinned in infrastructure configuration and documented in the environment inventory.

The database implementation MUST NOT depend on undocumented behavior specific to an unpinned server version.

### 4.2 Managed and Self-Managed Deployments

The cloud reference implementation uses Amazon RDS for PostgreSQL where the managed service satisfies the system requirements.

Managed-service provisioning, network placement, encryption, resource sizing, and cloud monitoring are owned by `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

This document owns PostgreSQL-level configuration, schema evolution, transactional behavior, access control, performance, and recovery procedures.

A self-managed PostgreSQL deployment MAY be introduced for a justified requirement, but it MUST satisfy the same logical database implementation contract and provide equivalent operational evidence.

### 4.3 Extensions

Database extensions MUST be explicitly approved, versioned where applicable, and included in the upgrade plan.

Extensions MUST NOT be introduced merely for convenience without evaluating security, availability, licensing, portability, and operational support.

Production extension installation MUST use an approved migration or infrastructure procedure.

### 4.4 Version Compatibility

Application dependencies, migration tooling, database drivers, and PostgreSQL versions MUST be tested together.

A database upgrade MUST include compatibility checks for:

- SQL syntax and query behavior.
- Extension support.
- Driver compatibility.
- Migration execution.
- Query plans for critical operations.
- Backup and restore procedures.
- Replication or recovery mechanisms where applicable.

## 5. Physical Schema Organization

### 5.1 Schema Boundaries

The database SHOULD use a small number of explicit schemas organized around stable access and ownership boundaries.

Schemas MUST NOT be created for every application class or source-code package.

Schema boundaries SHOULD reflect meaningful data-domain separation, privilege boundaries, or lifecycle requirements.

Canonical domain ownership is defined in `docs/architecture/DATABASE_ARCHITECTURE.md`.

### 5.2 Default Schema Strategy

The implementation SHOULD avoid placing all application tables into an unqualified namespace without an explicit ownership policy.

A recommended logical organization is:

| Schema category | Purpose |
|---|---|
| Application schemas | Persistent tables and database objects for approved data domains |
| Migration metadata | Schema migration version and execution metadata |
| Operational metadata | Approved database-maintenance metadata that is not application business data |

The exact application schema names MUST follow the canonical data-domain model. They MUST NOT be invented independently in this implementation document.

### 5.3 Search Path

Application database roles MUST use an explicitly controlled `search_path`.

Untrusted schemas MUST NOT appear ahead of trusted application schemas in a way that permits object shadowing.

Application SQL SHOULD schema-qualify important objects, particularly in migrations and security-sensitive queries.

### 5.4 Object Naming

Database object names MUST use a consistent, documented convention.

Recommended conventions include:

- Lowercase `snake_case` for schema objects.
- Singular or plural table names selected consistently for the repository.
- Explicit primary-key constraint names.
- Explicit foreign-key constraint names.
- Explicit unique-constraint names.
- Explicit index names.
- Clear names for check constraints.
- A consistent convention for timestamps and lifecycle columns.

PostgreSQL's identifier-length limitations MUST be considered when generating names.

Migration tooling SHOULD generate stable names rather than relying on environment-specific defaults.

### 5.5 Primary Keys

Every durable application table MUST have a primary key unless an explicitly reviewed data model establishes a justified alternative.

The key strategy MUST be consistent within the relevant data domain.

UUIDs MAY be used for identifiers that require distributed generation or should not expose sequential identifiers externally.

Identity or sequence-backed integers MAY be used when their operational characteristics and data-access boundaries are appropriate.

Primary-key selection MUST consider index size, insertion behavior, replication, and identifier-generation requirements.

### 5.6 Foreign Keys

Foreign keys MUST be used to enforce relational integrity where the relationship is within the same database and the constraint is operationally appropriate.

A foreign key MUST reference a primary key or an appropriate unique key.

`ON DELETE CASCADE` MUST NOT be used by default for durable business records. It MUST be justified against retention, audit, and lifecycle requirements.

Where application-level lifecycle rules require coordinated deletion, the migration and deletion workflow MUST make those rules explicit.

### 5.7 Check and Unique Constraints

Check constraints SHOULD enforce stable value ranges and simple invariants.

Unique constraints MUST be used where uniqueness is a persistent invariant and cannot safely rely on application pre-checks alone.

Conditional uniqueness MAY be implemented with partial unique indexes when the data semantics require it.

Constraints MUST be named explicitly where supported by the migration convention.

### 5.8 Nullability

Columns MUST be nullable only when the data model permits the absence of a value.

A nullable column MUST NOT be used merely to avoid defining lifecycle or creation behavior.

Changes from nullable to non-nullable MUST include a data validation and backfill strategy.

## 6. Column Types and Data Representation

### 6.1 Type Selection

Column types MUST reflect the semantics of the stored data.

The implementation SHOULD prefer native PostgreSQL types and explicit constraints over loosely typed text fields.

Type choices MUST account for indexing, query behavior, storage, precision, and migration compatibility.

### 6.2 Identifiers

Identifier columns MUST use a consistent type within each relationship.

Foreign-key columns MUST match the type and semantics of their referenced keys.

Identifier serialization in APIs is owned by `docs/protocol/API_CONTRACT.md`; this document defines only the persistent representation.

### 6.3 Timestamps

Time-based columns SHOULD use `timestamptz` for absolute instants.

Applications SHOULD store and compare instants consistently in UTC.

Business-local dates and times MUST be represented according to the applicable domain contract rather than inferred from a server's local time zone.

Timestamp semantics MUST be documented for creation, update, expiry, and lifecycle fields.

### 6.4 Numeric Values

Exact quantities that require decimal precision MUST use appropriate `numeric` types or an explicitly documented integer representation.

Floating-point types MUST NOT be used for values requiring exact decimal arithmetic.

Precision and scale MUST be selected from the domain's valid range and calculation requirements.

### 6.5 JSONB

`jsonb` MAY be used for variable attributes, extensible metadata, or data whose structure is intentionally flexible.

It MUST NOT be used to avoid modeling stable relational attributes that require strong constraints, joins, or frequent filtering.

JSONB structures MUST have an application-level validation contract.

If JSONB fields are indexed, the index type and operators MUST correspond to the actual query patterns.

### 6.6 Enumerated Values

Persistent status values MUST have an explicit compatibility and evolution strategy.

PostgreSQL enum types MAY be used when their operational constraints are acceptable.

Text columns with check constraints MAY be preferable when values need simpler evolution or cross-version migration.

Changing persistent status values MUST account for deployed application versions and existing rows.

### 6.7 Large Objects and Binary Data

Large artifacts, images, videos, logs, and other substantial binary payloads SHOULD be stored in object storage when the system architecture assigns that storage model.

PostgreSQL SHOULD store the metadata, references, and relationships needed by the application rather than duplicating large payloads unnecessarily.

Object identity, manifest structure, and validation remain governed by the applicable artifact contracts.

## 7. Migration Strategy

### 7.1 Migration-First Policy

All schema changes MUST be represented by version-controlled migrations.

Migrations MUST be deterministic and ordered.

A migration MUST NOT depend on an undocumented manual database modification.

Production schema changes MUST be reviewed before application.

### 7.2 Migration Tooling

The project MUST select one authoritative migration mechanism for application schema changes.

The selected tool and version MUST be pinned and documented in the repository's database implementation configuration.

Multiple independent migration systems MUST NOT modify the same schema without an explicit coordination contract.

The tool MUST support ordered migration history, failure reporting, and detection of previously applied migrations.

### 7.3 Migration Layout

The recommended migration layout is:

    database/
      migrations/
        V0001__initial_schema.sql
        V0002__add_required_constraint.sql
      seeds/
        development/
      tests/
        migrations/
        security/
        integration/
      scripts/
        validate_schema.sh
        check_migration_order.sh

The exact naming convention MUST match the selected migration tool.

Migration files MUST be immutable after application to a shared environment. Corrections SHOULD be introduced as new migrations rather than rewriting historical migration content.

### 7.4 Migration Metadata

Migration metadata MUST record enough information to determine which migrations have been applied.

The metadata MUST be protected from normal application runtime roles.

Migration execution MUST prevent concurrent migration runners from applying conflicting changes.

Migration state MUST be checked before and after execution.

### 7.5 Migration Transactionality

Migrations SHOULD execute transactionally when PostgreSQL and the selected migration operation support it.

Operations that cannot execute within a transaction MUST be isolated and documented.

A non-transactional migration MUST define how partial completion is detected and repaired.

Migration execution MUST NOT report success before the required schema changes have been verified.

### 7.6 Migration Ordering

Migration order MUST be stable and explicit.

Dependencies between migrations MUST be represented by their order or documented prerequisites.

A migration MUST NOT rely on a schema object that is created only by an untracked manual action.

Parallel development branches MUST reconcile migration ordering before integration.

### 7.7 Expand-and-Contract Changes

Schema changes that overlap with deployed application versions SHOULD use an expand-and-contract approach.

The usual sequence is:

1. Add a backward-compatible schema element.
2. Deploy application code that can operate with both old and new representations.
3. Backfill existing records when required.
4. Validate data consistency and completeness.
5. Switch reads and writes to the new representation.
6. Remove the old representation only after incompatible application versions are no longer active.

This sequence MUST be adapted to the specific change. It is not a requirement to add unnecessary intermediate steps to every migration.

### 7.8 Backfills

Large data backfills SHOULD be separated from schema-definition migrations.

Backfills MUST use bounded batches where practical.

A backfill MUST be restartable or have a documented recovery procedure.

Backfill progress, failure count, and completion criteria MUST be observable.

Long-running backfills MUST consider database load, lock contention, replication lag, and application traffic.

### 7.9 Destructive Changes

Dropping tables or columns, narrowing types, and removing constraints MUST be treated as potentially destructive operations.

Before a destructive migration, the owner MUST verify:

- No supported application version requires the old representation.
- Required data has been migrated or retained.
- Backup and recovery requirements are satisfied.
- The operation's lock and runtime impact are understood.
- A recovery or forward-fix strategy exists.

A destructive migration MUST NOT be used as a substitute for an incomplete data migration.

## 8. Transaction Boundaries and Isolation

### 8.1 Transaction Ownership

The application service or equivalent use-case boundary SHOULD own the transaction boundary.

Repositories MAY participate in an existing transaction but MUST NOT independently commit portions of a larger atomic operation.

The backend implementation rules are owned by `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

This document defines the PostgreSQL behavior required to implement those rules.

### 8.2 Transaction Scope

Transactions MUST be as short as practical.

External network calls, long-running computation, and user interaction MUST NOT occur while holding database locks unless a reviewed design establishes a necessary and bounded exception.

The application MUST handle transaction failure as an all-or-nothing result where transactional semantics require it.

### 8.3 Isolation-Level Selection

PostgreSQL's default `READ COMMITTED` isolation MAY be used for operations that remain correct under statement-level snapshots and explicit concurrency controls.

`REPEATABLE READ` MAY be used where a stable transaction snapshot is required and the application can handle serialization-related conflicts.

`SERIALIZABLE` SHOULD be used when the invariant requires serializable behavior and the application can safely retry transactions that fail with serialization errors.

Isolation-level selection MUST be based on correctness requirements, not on a blanket assumption that the highest level is always preferable.

### 8.4 Concurrent Updates

Concurrent updates to the same logical record MUST have defined behavior.

The implementation SHOULD use conditional updates, optimistic concurrency checks, or row locks where appropriate.

Applications MUST NOT assume that a read followed by a write is atomic without an explicit locking, constraint, or isolation strategy.

Lost-update risks MUST be considered for counters, quotas, state transitions, and resource allocation.

### 8.5 Optimistic Concurrency

A version column or equivalent compare-and-swap mechanism MAY be used to detect conflicting updates.

The update MUST verify the expected version or prior state.

A failed concurrency check MUST be represented as a controlled conflict rather than silently overwriting a newer value.

Versioning conventions MUST be consistent within the relevant data domain.

### 8.6 Row-Level Locks

`SELECT ... FOR UPDATE` and related locking operations MAY be used when an operation requires exclusive coordination over selected rows.

Locks MUST be acquired in a consistent order when multiple rows may be locked by competing transactions.

The application MUST handle lock timeout and deadlock errors safely.

Locking queries MUST use selective predicates and suitable indexes to avoid unnecessarily broad lock footprints.

### 8.7 Advisory Locks

Advisory locks MAY be used for database-coordinated operations that do not map naturally to a row lock.

The lock key convention, scope, release behavior, and collision assumptions MUST be documented.

Advisory locks MUST NOT replace declarative constraints where a constraint can enforce the invariant more reliably.

### 8.8 Deadlocks and Retries

The application MUST be prepared to handle deadlock detection and serialization failures where the chosen transaction strategy can produce them.

Retries MUST be bounded.

A transaction MUST be retried as a whole when its correctness depends on the entire transaction being reevaluated.

Non-idempotent external side effects MUST NOT be repeated as part of a blind database retry.

## 9. Row-Level Security and Tenant Isolation

### 9.1 RLS Use

PostgreSQL row-level security SHOULD be used where tenant or ownership isolation benefits from database-enforced row visibility.

RLS MUST NOT be treated as the sole authorization mechanism for the entire application.

Application authorization and system-level tenant ownership remain governed by the applicable architecture and product contracts.

### 9.2 Tenant Context

If RLS policies depend on tenant context, the application MUST establish that context safely for each transaction or connection scope.

Tenant context MUST come from a trusted, authenticated application boundary.

The database MUST NOT trust an arbitrary tenant identifier supplied by an unvalidated client.

Connection pooling MUST ensure that tenant context cannot leak between requests.

### 9.3 Policy Design

RLS policies MUST explicitly define permitted operations and row visibility.

Policies MUST be tested for:

- Normal authorized access.
- Cross-tenant read attempts.
- Cross-tenant update attempts.
- Cross-tenant delete attempts.
- Missing tenant context.
- Invalid tenant context.
- Background worker access.
- Administrative and migration access.

A policy MUST NOT accidentally permit all rows when tenant context is missing or invalid.

### 9.4 Table Configuration

Tables requiring RLS MUST have row security enabled through a migration.

Where the threat model requires it, `FORCE ROW LEVEL SECURITY` SHOULD be evaluated so that table owners do not unintentionally bypass the intended policy behavior.

Superusers and roles with `BYPASSRLS` privileges MUST NOT be used as normal application identities.

### 9.5 Connection Pool Safety

Session-level tenant state MUST NOT be assumed to persist safely across pooled requests.

Transaction-local settings SHOULD be used where suitable.

Every request or transaction MUST establish the required security context before accessing protected tables.

The context MUST be cleared or reset by a reliable pool lifecycle mechanism before a connection is reused.

### 9.6 RLS Testing

RLS tests MUST execute using representative application roles.

Tests performed only as a database owner or superuser are insufficient evidence of tenant isolation.

Policy changes MUST be validated against both intended access and prohibited access.

## 10. Indexing Strategy

### 10.1 Index Selection

Indexes MUST be added to support measured query patterns, uniqueness constraints, foreign-key access patterns, and operational requirements.

Every additional index introduces storage, write amplification, and maintenance cost.

Indexes SHOULD be justified by expected query behavior and validated against actual or representative query plans.

### 10.2 Primary and Unique Indexes

Primary keys and unique constraints MUST use the index structures required by PostgreSQL to enforce their invariants.

Additional indexes MUST NOT duplicate an existing index without a documented reason.

### 10.3 Foreign-Key Indexes

PostgreSQL does not automatically create an index on every referencing foreign-key column.

Foreign-key columns SHOULD be indexed when joins, parent-row deletion checks, updates, or frequent lookup patterns justify it.

The decision MUST consider table size and write overhead.

### 10.4 Composite Indexes

Composite index column order MUST reflect query predicates, sorting requirements, and selectivity.

An index MUST NOT be added merely because its columns appear together in a table.

Representative queries SHOULD be validated with `EXPLAIN` and, where appropriate, `EXPLAIN ANALYZE` in a controlled environment.

### 10.5 Partial Indexes

Partial indexes MAY be used when queries consistently target a well-defined subset of rows.

The index predicate MUST align with query semantics.

Changes to status values or lifecycle rules MUST consider the continued usefulness and correctness of partial indexes.

### 10.6 JSONB Indexes

JSONB indexes MUST be selected according to the operators and access patterns used by the application.

A GIN index SHOULD NOT be added automatically to every JSONB column.

Expression indexes MAY be used for stable, frequently queried attributes where their write and storage cost is justified.

### 10.7 Index Build Safety

Large production indexes SHOULD be created using a method that minimizes disruptive locking, such as `CREATE INDEX CONCURRENTLY`, when supported and appropriate.

Operations that cannot run inside a migration transaction MUST follow a documented execution procedure.

Failed concurrent index creation MUST be detected and reconciled before retrying.

### 10.8 Index Review

Slow queries SHOULD be reviewed using query statistics and execution plans.

Unused or redundant indexes SHOULD be considered for removal after validating workload coverage.

Index removal MUST consider infrequent queries, constraints, and operational jobs that may not appear in short observation windows.

## 11. Partitioning Strategy

### 11.1 Partitioning Criteria

Partitioning MAY be introduced when table size, retention operations, query patterns, or maintenance requirements justify it.

Partitioning MUST NOT be introduced solely because a table is expected to grow.

A partitioning decision MUST identify the partition key, expected data distribution, query constraints, retention behavior, and operational procedures.

### 11.2 Supported Approaches

PostgreSQL range, list, or hash partitioning MAY be used when the chosen strategy matches the data lifecycle and access patterns.

Time-based range partitioning MAY be appropriate for high-volume append-oriented records with explicit retention needs.

Hash partitioning MAY be considered for specific distribution or maintenance requirements when other strategies do not fit.

### 11.3 Partition Keys

Partition keys MUST be chosen based on workload and lifecycle semantics.

Frequently queried records SHOULD include predicates that allow partition pruning where practical.

The design MUST consider PostgreSQL's partitioned-table uniqueness and foreign-key limitations for the selected version.

### 11.4 Partition Lifecycle

Partition creation MUST be automated or performed through a controlled operational process.

The system MUST alert before expected writes reach a period for which no suitable partition exists.

Partition creation and removal procedures MUST be tested.

Retention-driven partition removal MUST preserve any data required by audit, legal, recovery, or product obligations.

### 11.5 Partitioning Migration

Converting a large existing table to a partitioned design MUST have a migration plan covering data movement, write continuity, index creation, validation, and rollback or forward recovery.

The plan MUST quantify expected lock duration and operational impact.

Partitioning MUST NOT be introduced without verifying the migration against representative data volumes.

## 12. Connection Management and Pooling

### 12.1 Connection Budget

A connection budget MUST be defined for every environment.

The budget MUST account for:

- API tasks.
- Background worker tasks.
- Scheduled jobs.
- Migration jobs.
- Operational access.
- Monitoring and maintenance connections.
- Failover and recovery headroom.

The sum of possible application connections MUST remain within the database's safe connection capacity.

### 12.2 Application Pooling

Application services SHOULD use bounded connection pools.

Pool maximums MUST be explicitly configured.

The pool configuration MUST include connection acquisition timeout, connection lifetime or recycling behavior where appropriate, and failure handling.

An application MUST NOT create an unbounded number of database connections under load.

### 12.3 Pooling Proxy

RDS Proxy or another suitable pooling layer MAY be introduced when connection churn, failover behavior, or connection pressure justifies it.

The implementation MUST validate compatibility with transaction behavior, session state, prepared statements, and any RLS context mechanism.

A proxy MUST NOT be assumed to eliminate the need for application-side connection limits.

### 12.4 Pool Sizing

Pool sizing MUST be based on expected concurrency and measured query duration.

Larger pools are not inherently faster and can reduce database performance through excessive concurrent work.

Autoscaling policies MUST account for aggregate pool size across all possible replicas.

### 12.5 Connection Lifecycle

Connections MUST be returned to the pool after use.

Transactions MUST be committed or rolled back before a connection is reused.

Connections that encounter protocol errors or unusable session state MUST be discarded or reset safely.

Tenant-specific and request-specific session state MUST NOT leak across pooled requests.

### 12.6 Timeouts

The implementation SHOULD configure appropriate values for:

- Connection establishment timeout.
- Connection acquisition timeout.
- Statement timeout.
- Lock timeout.
- Idle-in-transaction timeout.
- Application request deadline.

Timeouts MUST be coordinated so that database operations do not continue indefinitely after the caller has abandoned the operation.

Timeouts MUST NOT be set so aggressively that normal workload variation creates persistent failures.

## 13. Backup and Restore

### 13.1 Recovery Objectives

Production database recovery MUST define an approved RPO and RTO.

These objectives MUST be recorded with the responsible data and service owners.

The chosen backup and recovery configuration MUST be capable of meeting the approved objectives under the documented recovery scenario.

### 13.2 Backup Configuration

The managed database implementation MUST configure automated backups and retention according to the approved recovery policy.

Where supported and required, point-in-time recovery MUST be enabled.

Backup encryption and access controls MUST be explicit.

Backup retention MUST account for operational recovery, contractual requirements, and applicable compliance obligations.

### 13.3 Logical and Physical Recovery

The recovery strategy MAY combine managed snapshots, point-in-time recovery, and logical exports.

The selected method MUST match the required recovery scope and time objective.

Logical exports SHOULD be tested where they provide portability or selective restoration that managed backups alone do not provide.

### 13.4 Restore Validation

Restore tests MUST verify:

- Successful database restoration.
- Expected schema and migration version.
- Required data integrity.
- Referential integrity.
- Application connectivity.
- Required extensions and permissions.
- RLS policy behavior.
- Recovery duration.
- Observed recovery point.

Restore evidence MUST be recorded.

### 13.5 Recovery Access

Backup and restore permissions MUST be restricted.

Normal application runtime roles MUST NOT be able to delete or alter the recovery mechanisms protecting production data.

Recovery credentials and procedures MUST remain available to authorized responders during an incident.

### 13.6 Backup Failure

Backup failures MUST generate actionable alerts.

The responsible owner MUST investigate missed backup windows or failed recovery points.

The absence of a successful backup MUST be treated as a recovery risk rather than silently ignored.

## 14. Database Upgrades and Compatibility

### 14.1 Upgrade Policy

PostgreSQL upgrades MUST follow a documented version-support policy.

Security and maintenance updates SHOULD be applied within the project's approved response windows.

Major-version upgrades MUST have a tested plan covering compatibility, data migration, downtime or failover behavior, extensions, application drivers, and recovery.

### 14.2 Pre-Upgrade Validation

Before an upgrade, the team MUST verify:

- Application and driver compatibility.
- Migration-tool compatibility.
- Extension availability and version compatibility.
- Critical query plans.
- Database configuration compatibility.
- Backup and restore readiness.
- Available storage and operational capacity.
- Expected downtime or failover behavior.
- Rollback or forward-recovery limitations.

### 14.3 Staging Rehearsal

A production major-version upgrade SHOULD be rehearsed in staging using representative schema, configuration, and data volume.

Where production data cannot be copied, a suitably representative dataset MUST be used.

The rehearsal MUST capture duration, observed issues, validation results, and required adjustments.

### 14.4 Upgrade Execution

Upgrade execution MUST have a named owner and a documented maintenance or failover procedure.

The team MUST monitor database health, application error rates, connection behavior, and critical query performance during and after the upgrade.

A successful engine upgrade MUST be followed by schema and application compatibility validation.

### 14.5 Rollback Limitations

Some database upgrades and data migrations cannot be safely reversed.

The plan MUST distinguish between a supported rollback, a restore-based recovery, and a forward-fix strategy.

The team MUST NOT promise an instant rollback when data has been irreversibly transformed or when the managed service does not support the required operation.

## 15. Database Security and Privilege Management

### 15.1 Role Separation

Database roles SHOULD separate:

- Database administration.
- Schema and migration ownership.
- Application runtime access.
- Read-only operational access.
- Monitoring access.
- Backup and recovery access.
- Test and development access.

The exact roles MAY vary by environment, but their privileges MUST be documented.

### 15.2 Runtime Privileges

Runtime roles MUST NOT own application tables unless an explicit, reviewed design requires it.

Runtime roles MUST NOT have superuser privileges or `BYPASSRLS`.

Privileges MUST be granted on the specific schemas, tables, sequences, and functions required.

New objects MUST receive appropriate privileges through a controlled default-privilege policy where applicable.

### 15.3 Migration Privileges

Migration credentials MUST be separate from normal application runtime credentials.

Migration credentials MUST be available only to approved migration execution paths.

Migration jobs MUST NOT expose credentials in logs or command output.

### 15.4 Transport Security

Database connections MUST use TLS according to the environment security policy.

Production clients MUST verify the server identity using the approved certificate-validation mechanism.

Disabling certificate verification MUST NOT be accepted as a production workaround.

### 15.5 Sensitive Data

Sensitive application data MUST be handled according to the applicable system data classification and security policy.

Database logs, query logs, diagnostics, and test fixtures MUST NOT expose sensitive values unnecessarily.

Production data MUST NOT be copied into development or staging without an approved sanitization and access-control process.

## 16. Performance and Maintenance

### 16.1 Query Performance

Critical queries MUST have measurable performance expectations appropriate to their workload.

Query performance SHOULD be validated using representative data volumes and execution plans.

A query MUST NOT be considered optimized solely because it performs well against an empty development database.

### 16.2 Statistics and Vacuum

PostgreSQL statistics and autovacuum behavior MUST be monitored.

Autovacuum MUST NOT be disabled globally without an explicit, reviewed reason.

Tables with high update or delete rates SHOULD be evaluated for vacuum pressure, bloat, and statistics freshness.

Maintenance settings MUST be tuned based on measured workload behavior.

### 16.3 Slow Queries

Slow-query monitoring SHOULD identify the query, duration, database context, and useful diagnostic metadata without exposing sensitive parameters.

The team SHOULD review query latency distributions rather than relying only on averages.

Repeated slow queries MUST be investigated for missing indexes, inefficient plans, lock contention, excessive result sets, and connection pressure.

### 16.4 Table and Index Growth

Table, index, and database storage growth MUST be monitored.

Unexpected growth MUST trigger investigation.

Capacity planning MUST account for index overhead, dead tuples, migration headroom, temporary files, and backup needs where applicable.

### 16.5 Lock Monitoring

Long-running transactions and lock waits MUST be observable.

Operational procedures SHOULD identify the blocking transaction and provide a safe remediation path.

Terminating a database session MUST consider transaction rollback time and application recovery behavior.

### 16.6 Maintenance Windows

Maintenance procedures MUST consider active transactions, expected load, backup status, and deployment activity.

Operations with material lock or I/O impact SHOULD be scheduled during an appropriate maintenance window unless urgency requires otherwise.

## 17. Testing and Conformance

### 17.1 Migration Tests

Every migration MUST be tested against the supported starting schema.

Tests SHOULD verify both successful application and relevant data transformations.

Migrations that modify existing data MUST include validation of the resulting data state.

### 17.2 Fresh-Database Tests

The complete migration chain MUST be tested against a clean database.

A new environment MUST be able to reach the expected schema version without manual SQL changes.

### 17.3 Upgrade-Path Tests

For material schema changes, tests SHOULD validate the supported upgrade path from the current released schema.

Compatibility MUST be assessed when old and new application versions may run concurrently.

### 17.4 Constraint Tests

Tests MUST validate important primary-key, foreign-key, unique, and check constraints.

Concurrency-sensitive invariants MUST be tested under competing transactions where practical.

### 17.5 RLS Tests

RLS tests MUST run using representative runtime roles.

The test suite MUST include prohibited cross-tenant operations when tenant isolation is applicable.

Tests MUST cover absent or malformed tenant context.

### 17.6 Transaction Tests

Tests SHOULD cover:

- Successful commit.
- Rollback after failure.
- Concurrent update behavior.
- Deadlock or serialization retry behavior where applicable.
- Idempotent retry behavior.
- Transaction timeout handling.
- Constraint violation mapping.

### 17.7 Performance Tests

Critical queries SHOULD be tested with representative data volumes.

Connection pool behavior SHOULD be validated under concurrent load.

Large-table migration and index operations SHOULD be rehearsed where their production impact is material.

### 17.8 Recovery Tests

Backup and restore tests MUST be performed according to the approved recovery policy.

A test MUST validate more than the existence of a snapshot or backup file.

### 17.9 Acceptance Evidence

Database implementation acceptance evidence SHOULD include:

- PostgreSQL version and configuration.
- Migration revision and validation result.
- Constraint and RLS test results.
- Representative query-plan evidence for critical paths.
- Connection budget and pool settings.
- Backup and restore test evidence.
- Upgrade rehearsal evidence where applicable.
- Outstanding exceptions and their owners.

## 18. Environment-Specific Requirements

### 18.1 Development

Development databases MAY use smaller capacity and reduced availability.

Development schema changes MUST still use the authoritative migration mechanism.

Development data SHOULD be synthetic or non-sensitive.

Developer privileges MUST NOT be reused as production runtime privileges.

### 18.2 Staging

Staging MUST use the same migration chain and compatible PostgreSQL major version as production.

Staging SHOULD validate release-candidate migrations before production application.

Staging MAY use smaller compute and storage resources when those differences do not invalidate the test.

Security policies and RLS behavior MUST remain representative of production.

### 18.3 Production

Production MUST have controlled schema changes, restricted administrative access, approved recovery settings, monitoring, and tested restore procedures.

Production schema drift MUST be detected and reconciled.

Production data MUST NOT be modified through undocumented manual SQL.

Emergency repair operations MUST be recorded and reconciled into migration or operational procedures afterward.

## 19. Phase and Milestone Traceability

The canonical phase definitions are owned by `planning/PHASES.md`. Database milestone scope and acceptance are defined by the authoritative dossiers under `docs/database/milestones/`.

The following table identifies the database implementation emphasis for each canonical database milestone without redefining its scope.

| Phase | Database milestone | Implementation emphasis |
|---|---|---|
| P0 FOUNDATION | DB-M01 FOUNDATION | Database conventions, migration tooling, role strategy, and implementation foundations |
| P1 STUDIO | DB-M01 FOUNDATION | Development database provisioning and reproducible schema setup |
| P2 BUILD & ARTIFACT | DB-M01 FOUNDATION | Schema and migration foundations required by the applicable artifact contracts |
| P3 CONTROL PLANE | DB-M01 FOUNDATION; DB-M02 CORE DATA | Core relational schema, constraints, transactions, and access controls |
| P4 BOOKING & COMMERCIAL | DB-M03 BOOKING DATA | Booking-domain persistence implementation, transactional correctness, and relevant constraints |
| P5 EXECUTION | DB-M04 EXECUTION DATA | Execution-related persistence, concurrency controls, and operational query behavior |
| P6 LAB & ROBOT | DB-M04 EXECUTION DATA | Database implementation support for applicable lab and robot integration workflows |
| P7 LIVE & RESULTS | DB-M04 EXECUTION DATA | Persistence performance, results data handling, and operational lifecycle requirements |
| P8 PRODUCTION | DB-M04 EXECUTION DATA | Production migration safety, backup and restore, upgrade readiness, and performance controls |

Milestone scope MUST be determined from the authoritative dossier. This traceability table MUST NOT be used to expand milestone scope or imply that every implementation concern must be completed in a single phase.

## 20. Change Control

### 20.1 Changes Requiring Review

Database architecture review MUST be required for changes involving:

- A new schema ownership boundary.
- A change to canonical key strategy.
- A material change in transaction or isolation requirements.
- New or changed RLS policies.
- Large-table partitioning.
- A destructive schema migration.
- A new database extension.
- A material change to connection pooling or database connection budgets.
- A change to backup, recovery, or retention settings.
- A major PostgreSQL upgrade.
- A material change in query performance or storage expectations.

### 20.2 Migration Review

Migration reviews MUST consider correctness, locking, data volume, compatibility, failure behavior, and recovery.

Reviewers MUST examine both the migration itself and its interaction with supported application versions.

Large backfills, concurrent index creation, and non-transactional changes MUST receive specific operational review.

### 20.3 System Ownership Changes

If a proposed change modifies which system component owns canonical data or which database is authoritative, the proposal MUST be reviewed against `docs/architecture/DATABASE_ARCHITECTURE.md`.

The system architecture document MUST be updated when the role or authority changes.

This implementation document MUST then record the corresponding PostgreSQL changes without duplicating the system-level decision.

### 20.4 Documentation Updates

A database implementation change MUST update the relevant migration, configuration, test, and operational documentation.

A change MUST NOT be considered complete if the implementation has changed but the required recovery or deployment procedure remains inaccurate.

## 21. Implementation Checklist

### 21.1 Schema and Migrations

- [ ] Schema layout follows the canonical data-domain model.
- [ ] Naming conventions are consistent.
- [ ] Primary keys and required constraints are defined.
- [ ] Migration tooling and versions are pinned.
- [ ] Migrations are deterministic and ordered.
- [ ] Migration metadata is protected.
- [ ] Fresh-database migration tests pass.
- [ ] Upgrade-path compatibility is assessed.
- [ ] Destructive changes have a documented recovery strategy.
- [ ] Backfills are bounded, observable, and restartable where practical.

### 21.2 Transactions and Security

- [ ] Transaction ownership and scope are explicit.
- [ ] Isolation levels match correctness requirements.
- [ ] Concurrent updates have defined behavior.
- [ ] Deadlock and serialization failures are handled safely.
- [ ] RLS is configured where required.
- [ ] RLS tests use representative runtime roles.
- [ ] Runtime and migration privileges are separated.
- [ ] Connection-level security context cannot leak between requests.
- [ ] Database transport security is enabled.
- [ ] Sensitive data is excluded from unnecessary logs and test fixtures.

### 21.3 Performance and Operations

- [ ] Critical indexes are justified by query patterns.
- [ ] Query plans are validated for critical workloads.
- [ ] Partitioning is used only where justified.
- [ ] Connection budgets and pool limits are documented.
- [ ] Timeouts and retry policies are bounded.
- [ ] Slow queries, lock waits, and storage growth are observable.
- [ ] Backup retention and recovery objectives are defined.
- [ ] Restore procedures have been tested.
- [ ] PostgreSQL upgrade compatibility is documented.
- [ ] Production maintenance procedures are reviewed.

### 21.4 Governance

- [ ] System database role and authority link to `docs/architecture/DATABASE_ARCHITECTURE.md`.
- [ ] Backend implementation follows `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.
- [ ] API and event contracts remain owned by their protocol documents.
- [ ] Cloud-managed resource configuration follows `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Phase definitions link to `planning/PHASES.md`.
- [ ] Database milestone acceptance follows the authoritative milestone dossiers.
- [ ] No duplicate system-level data ownership decisions have been introduced.

## 22. Definition of Done

The PostgreSQL implementation architecture is ready for implementation when:

1. Physical schema conventions and boundaries are explicit.
2. Migration tooling, ordering, and compatibility rules are defined.
3. Transaction and concurrency requirements are testable.
4. RLS and privilege boundaries are defined where required.
5. Indexing and partitioning decisions follow measurable workload needs.
6. Connection limits and pooling behavior are bounded.
7. Backup, restore, and upgrade procedures are documented and testable.
8. Database performance and operational health are observable.
9. Environment-specific implementation differences are explicit.
10. Ownership boundaries with system architecture, backend implementation, cloud architecture, protocol contracts, and milestone dossiers are clear.
11. Phase and milestone references use the frozen canonical model.
12. Required implementation evidence can be reviewed and reproduced.

This document owns the PostgreSQL implementation architecture. The system role and authority of the database remain owned by `docs/architecture/DATABASE_ARCHITECTURE.md`. Implementation decisions MUST preserve that boundary.
