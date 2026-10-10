# Kritva RaaS Database Development Practices

## 1. Document Control

| Item | Value |
|---|---|
| Document | Database Development Practices |
| Path | `docs/backend/development/DATABASE_DEVELOPMENT.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Database | PostgreSQL |
| Database Role | Authoritative structured business state |
| Binary Storage | S3-compatible Object Storage |
| Async Transport | Durable Queue |
| Multi-Tenancy | Organization-based |
| Time Standard | UTC |
| Primary Key Strategy | Opaque stable IDs, recommended UUID |
| Migration Model | Versioned migrations |
| Deployment Model | Expand / Backfill / Contract |
| Phases | Phase 0–8 |

## 2. Purpose

This document defines the production-grade database development practices for
the Kritva RaaS backend.

It establishes how engineers design, modify, test, review, migrate, seed,
restore and operate the PostgreSQL database throughout development.

The database is a critical system boundary because it stores authoritative
business state for:

- users;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- labs;
- resources;
- results;
- audit records;
- idempotency records;
- optional outbox records.

The objective is to ensure that database evolution remains safe as the RaaS
Control Plane progresses from Phase 0 through production.

## 3. Scope

This document covers:

- PostgreSQL development;
- schema design;
- naming conventions;
- table ownership;
- column conventions;
- identifiers;
- timestamps;
- constraints;
- indexes;
- migrations;
- migration tooling;
- migration review;
- seed data;
- test fixtures;
- local databases;
- test databases;
- zero-downtime migration practices;
- backfills;
- database performance review;
- transactions;
- locking;
- concurrency;
- backup and restore in development;
- database CI validation;
- schema drift detection;
- database acceptance criteria.

## 4. Non-Goals

This document does not define:

- final production cloud topology;
- final production PostgreSQL provider;
- final database migration framework;
- complete production disaster recovery architecture;
- application-domain ownership beyond database implications;
- physical robot data acquisition.

Production cloud database operations are additionally governed by:

    docs/cloud/architecture/
    docs/cloud/deployment/
    docs/cloud/operations/

## 5. Database Authority Principle

PostgreSQL is the authoritative system of record for structured business state.

The following are not authoritative replacements for PostgreSQL:

- queue messages;
- WebSocket events;
- application memory;
- caches;
- object storage metadata;
- Lab Agent state;
- client state.

The authoritative flow is:

    Client
      |
      v
    Control Plane
      |
      v
    Application Service
      |
      v
    PostgreSQL
      |
      +--> Outbox
      +--> Queue
      +--> Realtime Event

## 6. Database Architecture Context

The initial backend uses one PostgreSQL database with logical module boundaries.

Logical ownership includes:

    Identity
    Organization
    Project
    Platform
    Artifact
    Booking
    Credit
    Billing
    Job
    Run
    Result
    Lab
    Audit
    Notification
    Idempotency
    Outbox

The deployment remains a modular monolith.

Logical ownership must therefore be preserved even though modules share one
physical PostgreSQL instance.

## 7. Goals

The database development process must provide:

- deterministic schema evolution;
- safe migrations;
- strong transactional integrity;
- explicit ownership;
- tenant isolation;
- concurrency correctness;
- reproducible development databases;
- deterministic test data;
- predictable performance;
- recoverable changes;
- zero-downtime migration discipline;
- schema traceability;
- CI validation.

## 8. Core Database Principles

1. PostgreSQL is authoritative.
2. Schema changes are versioned.
3. Migrations are code.
4. No undocumented manual schema changes.
5. Constraints enforce critical invariants.
6. Application code does not replace database integrity.
7. Cross-module ownership is explicit.
8. Large binaries remain in object storage.
9. Financial records are immutable.
10. Booking conflicts are transactionally enforced.
11. Time is stored in UTC.
12. Transactions remain short.
13. External calls do not normally occur inside transactions.
14. Production migrations must be backward compatible where required.
15. Every migration must be tested before merge.

## 9. Definitions

### Schema

The relational definition of tables, columns, indexes, constraints, views and
other database objects.

### Migration

A versioned change that moves a database from one known schema state to another.

### Seed

Deterministic development data used to make a local environment usable.

### Fixture

Test-specific data created for a deterministic automated test.

### Backfill

A controlled operation that populates or transforms existing data after a
schema change.

### Expand

A backward-compatible schema addition.

### Contract

The final removal of an obsolete schema element after application migration.

## 10. Database Logical Domains

| Domain | Representative Data |
|---|---|
| Identity | Users, identity references |
| Organization | Organizations, memberships |
| Project | Projects |
| Platform | Platforms, versions, capabilities |
| Artifact | Artifacts, validations |
| Booking | Bookings |
| Credit | Wallets, ledger, reservations |
| Billing | Monetary transaction references |
| Job | Jobs |
| Run | Runs |
| Lab | Labs, agents, resources |
| Result | Results, files |
| Audit | Audit records |
| Idempotency | Idempotency keys/results |
| Outbox | Pending domain events |

## 11. Table Ownership

Each table has one logical owning module.

Example:

    Credit Service
         |
         +--> credit_wallet
         +--> credit_ledger
         +--> credit_reservation

Other modules must use Credit Service interfaces rather than directly mutating
these tables.

This rule applies even though all modules initially share PostgreSQL.

## 12. Cross-Module Access

Cross-module access should follow:

    Module A
       |
       v
    Application Interface
       |
       v
    Module B
       |
       v
    Module B Repository
       |
       v
    PostgreSQL

Avoid:

    Module A
       |
       +----> Direct UPDATE of Module B table

Direct cross-module table mutation requires explicit architecture approval.

## 13. Naming Conventions

Database names should use `snake_case`.

Recommended:

    organizations
    organization_memberships
    platform_versions
    credit_wallets
    credit_transactions
    resource_allocations

Avoid mixed-case identifiers.

## 14. Table Naming

Tables should normally use plural nouns.

Preferred:

    users
    projects
    bookings
    jobs
    runs
    results

Join/association tables should clearly describe the relationship.

Example:

    organization_memberships

## 15. Column Naming

Columns use `snake_case`.

Preferred:

    organization_id
    project_id
    created_at
    updated_at
    start_time
    end_time

Avoid abbreviations unless they are universally understood.

## 16. Primary Keys

Opaque stable identifiers are recommended.

UUID is the baseline recommendation.

Examples:

    user_id
    organization_id
    project_id
    artifact_id
    booking_id
    job_id
    run_id

Clients must not depend on sequential database identifiers.

## 17. Foreign Keys

Foreign key columns should use the referenced entity name.

Examples:

    organization_id
    project_id
    booking_id
    artifact_id
    job_id
    run_id

Foreign keys should be explicit unless there is a documented performance or
lifecycle reason not to enforce them.

## 18. Timestamp Convention

Backend timestamps use UTC.

PostgreSQL should use:

    TIMESTAMPTZ

Recommended columns:

    created_at
    updated_at
    started_at
    completed_at
    expires_at

Application APIs use RFC3339-compatible UTC timestamps.

## 19. Time Semantics

The database must distinguish:

- creation time;
- update time;
- requested time;
- effective time;
- observed time;
- expiration time.

Do not overload `created_at` to represent domain time.

For example:

    created_at = when booking record was created
    start_time = when booking is intended to begin
    end_time = when booking is intended to end

## 20. Booking Interval

Booking intervals use:

    [start_time, end_time)

This means:

- start is inclusive;
- end is exclusive.

Adjacent bookings are therefore valid:

    Booking A: 10:00 -> 11:00
    Booking B: 11:00 -> 12:00

They do not overlap.

## 21. Status Storage

Domain states should use explicit stable representations.

Example:

    CREATED
    QUEUED
    VALIDATING
    RUNNING
    COMPLETED
    FAILED

The exact PostgreSQL representation may be:

- constrained text;
- PostgreSQL enum;
- lookup table.

The choice must consider migration flexibility and application compatibility.

## 22. Status Transition Integrity

Database constraints should prevent obviously invalid values.

Application/domain logic should enforce legal transitions.

The preferred split is:

    Database
      |
      +--> Valid value
      +--> Referential integrity
      +--> Uniqueness
      +--> Structural invariants

    Application
      |
      +--> Business transition
      +--> Policy
      +--> Authorization

## 23. Nullability

Columns should be `NOT NULL` whenever the domain requires a value.

Nullable fields should have explicit semantic meaning.

Avoid nullable columns merely because they are convenient during implementation.

Every nullable field should answer:

> What does NULL mean?

## 24. Boolean Columns

Boolean columns should represent clear facts.

Examples:

    is_active
    is_revoked

Avoid ambiguous flags such as:

    status_flag
    enabled_value

Where a field represents a lifecycle state, use a status rather than multiple
booleans.

## 25. JSONB Usage

JSONB is permitted for genuinely flexible metadata.

Examples:

- provider metadata;
- optional capability metadata;
- external references;
- extensible configuration.

JSONB must not replace relational modeling for core business invariants.

Avoid storing:

    organization_id
    booking_start
    credit_balance

inside generic JSONB when they are authoritative relational fields.

## 26. Large Data

Large binaries must not be stored directly in PostgreSQL unless explicitly
approved.

Examples:

- `.krv` artifacts;
- video;
- large result files;
- large telemetry archives.

Use:

    PostgreSQL
        |
        +--> object_key
        +--> content_digest
        +--> size
        +--> metadata

    Object Storage
        |
        +--> actual binary

## 27. Database-to-Object Storage Boundary

The database stores authoritative metadata about an object.

Example:

    result_files
      |
      +--> result_file_id
      +--> result_id
      +--> object_key
      +--> digest
      +--> size
      +--> content_type

Object storage holds the actual bytes.

## 28. Constraints

Use database constraints for invariants that must never be violated.

Examples:

- `NOT NULL`;
- unique constraints;
- foreign keys;
- check constraints;
- exclusion constraints;
- referential integrity.

Constraints are preferable to relying only on application checks.

## 29. Unique Constraints

Use unique constraints for identity rules.

Examples:

- unique membership;
- unique idempotency key within scope;
- unique artifact digest where required;
- unique platform/version combination.

Application pre-checks do not replace unique constraints.

## 30. Booking Conflict Enforcement

Booking conflict must be protected transactionally.

Preferred PostgreSQL mechanisms include:

- exclusion constraints;
- appropriate indexes;
- transaction locking.

The exact mechanism must be selected according to resource capacity and
booking model.

## 31. Resource Allocation Constraints

Resource allocation must prevent incompatible simultaneous allocations.

Example conceptual rule:

    resource_id + active_time_interval

must not produce conflicting exclusive allocations.

## 32. Credit Ledger Constraints

Credit ledger data must be append-oriented.

Transactions must not be edited to repair historical state.

Corrections use compensating transactions.

The ledger must preserve:

    Sum(Debits) = Sum(Credits)

## 33. Financial Data Immutability

Credit transactions are immutable.

Do not execute:

    UPDATE credit_transactions
       SET amount = ...

to correct historical data.

Instead:

    Original Transaction
           |
           v
    Compensating Transaction
           |
           v
    Corrected Balance

## 34. Audit Data

Audit records should be append-oriented.

Audit data should include sufficient references to reconstruct:

- actor;
- organization;
- action;
- resource;
- timestamp;
- outcome;
- correlation.

Sensitive credentials must never be stored in audit records.

## 35. Idempotency Data

Idempotency records should preserve:

- principal;
- organization;
- operation;
- idempotency key;
- request fingerprint;
- result;
- status;
- timestamps;
- expiration.

A reused key with a different request must be rejected.

## 36. Outbox Data

If transactional outbox is implemented, outbox records belong to the same
transaction as the authoritative state change.

Conceptually:

    BEGIN
       |
       +--> Domain State Change
       |
       +--> Outbox Event
       |
    COMMIT

The publisher processes the outbox after commit.

## 37. Migration Tooling

The final migration framework remains an implementation decision.

The selected tool must support:

- versioned migrations;
- ordered execution;
- migration status;
- transactional migrations where supported;
- repeatable CI execution;
- migration validation;
- clear failure reporting.

## 38. Migration Source of Truth

Migration files are the authoritative schema evolution history.

The current database schema is derived from:

    Base Schema
       +
    Ordered Migrations

Developers must not treat a manually modified local database as authoritative.

## 39. Migration Directory

Migrations belong under:

    database/migrations/

Optional supporting data scripts may reside under:

    database/seeds/
    database/backfills/

The exact structure may be refined with the selected migration tool.

## 40. Migration Naming

Migration names should be:

- ordered;
- unique;
- descriptive;
- stable.

Example:

    0001_create_organizations
    0002_create_projects
    0003_add_project_archived_at

The exact numbering mechanism depends on the selected tool.

## 41. Migration Rules

Every migration must:

- have a clear purpose;
- be reviewable;
- be deterministic;
- be tested;
- identify data impact;
- identify locking impact;
- identify rollback/recovery strategy;
- be safe for the deployment model.

## 42. Migration Transaction Policy

Prefer transactional migrations for operations that can safely run inside a
transaction.

Some PostgreSQL operations have restrictions or operational implications.

Where a migration cannot safely be transactional, the migration documentation
must explain:

- why;
- expected duration;
- lock behavior;
- failure handling;
- recovery strategy.

## 43. Migration Review

Every migration requires database-aware review.

Reviewers must inspect:

- SQL;
- constraints;
- indexes;
- locking;
- data volume;
- query plans where applicable;
- backward compatibility;
- deployment order.

A migration must not be approved solely because application tests pass.

## 44. Migration Review Questions

Reviewers should ask:

1. Does this lock a large table?
2. Does this rewrite existing rows?
3. Can it run while production traffic exists?
4. Is the new schema backward compatible?
5. Is a backfill required?
6. Can the backfill be paused?
7. Does it introduce a new index?
8. Is index creation concurrent where required?
9. Does it change constraints?
10. What happens if deployment stops halfway?

## 45. Expand / Backfill / Contract

Production schema evolution should normally follow:

    Existing Schema
          |
          v
       EXPAND
          |
          v
    Compatible Code
          |
          v
      BACKFILL
          |
          v
    Switch Reads/Writes
          |
          v
      CONTRACT

This avoids requiring an application and database to change incompatibly at
the same instant.

## 46. Expand Migration

An expand migration should normally:

- add nullable columns;
- add new tables;
- add new indexes;
- add compatible structures.

Avoid removing or renaming columns in the expand step.

## 47. Backfill

Backfills should be:

- resumable;
- bounded;
- observable;
- idempotent;
- batch-oriented where large;
- safe under concurrent application activity.

Example:

    Rows
      |
      +--> Batch 1
      +--> Batch 2
      +--> Batch 3
      +--> ...
      |
      v
    Completed

## 48. Backfill Progress

Large backfills should expose:

- total rows;
- processed rows;
- failed rows;
- current batch;
- estimated completion;
- last successful checkpoint.

A failed backfill should be restartable.

## 49. Contract Migration

Only after application code no longer depends on the old structure should
contract migration remove it.

Example:

    Add new_column
         |
         v
    Write both
         |
         v
    Backfill
         |
         v
    Read new_column
         |
         v
    Stop old writes
         |
         v
    Remove old_column

## 50. Column Rename

A direct rename can break old application versions.

Preferred production strategy:

    Add new column
       |
       v
    Dual write if required
       |
       v
    Backfill
       |
       v
    Switch reads
       |
       v
    Remove old column later

## 51. Column Type Change

Changing a large column type requires explicit review.

Preferred:

    New Compatible Column
       |
       v
    Backfill
       |
       v
    Validate
       |
       v
    Switch Application
       |
       v
    Remove Old Column

## 52. Index Creation

Large production indexes should be evaluated for concurrent creation.

Where appropriate:

    CREATE INDEX CONCURRENTLY ...

must be used according to PostgreSQL constraints and migration-tool support.

The developer must understand that concurrent index creation has its own failure
and cleanup semantics.

## 53. Index Review

Every index should have a reason.

Review:

- query pattern;
- selectivity;
- write overhead;
- storage size;
- composite column order;
- uniqueness;
- tenant filtering.

Avoid indexing every column automatically.

## 54. Multi-Tenant Indexing

Organization-scoped queries are common.

Indexes should reflect actual access patterns.

Example:

    organization_id
    project_id

or:

    organization_id, created_at

depending on query requirements.

Do not assume `organization_id` alone is sufficient for every query.

## 55. Foreign Key Indexing

Foreign keys should be evaluated for supporting indexes.

Example:

    organization_memberships.organization_id

may require an index if frequently queried or used in joins.

## 56. Query Review

Database queries should be reviewed for:

- correctness;
- tenant filtering;
- index usage;
- unnecessary joins;
- N+1 behavior;
- row count;
- sorting;
- pagination;
- locking;
- transaction duration.

## 57. Query Plan Review

Performance-sensitive queries should use:

    EXPLAIN
    EXPLAIN ANALYZE

only against appropriate environments.

Never run destructive or expensive `EXPLAIN ANALYZE` operations against
production without operational approval.

## 58. N+1 Query Detection

Application code should avoid:

    Query Projects
       |
       +--> Query Owner
       +--> Query Owner
       +--> Query Owner
       +--> ...

Use appropriate joins, batching or repository methods.

## 59. Pagination

Large collections should use cursor-based pagination.

Offset pagination may be acceptable for bounded administrative views but should
not be the default for large operational collections.

## 60. Locking

Database locks should be deliberate.

Critical locking cases include:

- credit reservations;
- wallet updates;
- resource allocation;
- booking conflict resolution;
- idempotency records.

Lock acquisition order must be consistent to reduce deadlock risk.

## 61. Deadlock Testing

Concurrency-sensitive modules should include tests that:

- run competing transactions;
- detect deadlocks;
- verify retry policy where appropriate;
- preserve business correctness.

Deadlocks should be diagnosed, not hidden by arbitrary infinite retries.

## 62. Transaction Duration

Transactions should remain short.

Avoid:

    BEGIN
      |
      +--> Database update
      |
      +--> HTTP call
      |
      +--> Lab Agent call
      |
      +--> Object storage call
      |
    COMMIT

Prefer:

    Validate
       |
       v
    Short DB Transaction
       |
       v
    Commit
       |
       v
    External Operation
       |
       v
    Reconciliation if uncertain

## 63. Isolation Level

The default PostgreSQL transaction isolation should be used unless a domain
requires stronger semantics.

Any non-default isolation level requires documented justification.

## 64. Optimistic Concurrency

Optimistic concurrency may be used for entities where simultaneous updates
must be detected.

Possible mechanism:

    version

or:

    updated_at

or another explicit revision.

The mechanism must be consistent within the module.

## 65. Pessimistic Concurrency

Pessimistic locking is appropriate where correctness requires serializing
hotspot operations.

Examples:

- credit wallet;
- resource allocation;
- booking conflicts.

The lock must be acquired for the shortest practical duration.

## 66. Database Performance Baseline

The development process should track:

- query latency;
- transaction duration;
- connection usage;
- lock waits;
- deadlocks;
- rows scanned;
- index usage.

Performance regressions should be investigated before production acceptance.

## 67. Slow Query Review

Slow queries should be captured with:

- SQL identity;
- endpoint/module;
- duration;
- frequency;
- rows;
- plan where appropriate.

Do not log sensitive parameter values.

## 68. Connection Pooling

The backend must use bounded database connections.

Pool configuration should consider:

- API workers;
- background workers;
- test concurrency;
- PostgreSQL limits.

Connection exhaustion must be observable.

## 69. Schema Drift

Schema drift occurs when a database differs from the committed migration state.

Detection should compare:

    Repository Migrations
            |
            v
    Expected Schema
            |
            v
    Actual Database
            |
            v
    Drift Detection

Manual drift should fail CI or development validation where practical.

## 70. Local Database Model

Developers should have:

    raas_dev

and tests should have:

    raas_test

They must be isolated.

Development database data may persist between sessions.

Test databases should normally be disposable.

## 71. Local Database Initialization

Standard flow:

    Start PostgreSQL
       |
       v
    Create Database
       |
       v
    Apply Migrations
       |
       v
    Seed
       |
       v
    Verify

No manual schema editing should be required.

## 72. Local Database Reset

Approved reset flow:

    Stop Application
       |
       v
    Drop / Recreate Dev DB
       |
       v
    Apply Migrations
       |
       v
    Seed
       |
       v
    Restart Application

The repository should provide a standard command for this operation.

## 73. Test Database Lifecycle

Recommended:

    Create Test DB
       |
       v
    Apply Migrations
       |
       v
    Run Tests
       |
       v
    Destroy / Reset

The lifecycle must be safe for parallel CI jobs.

## 74. Seed Data

Development seeds should provide enough data to exercise:

- authentication;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- labs;
- resources;
- jobs;
- runs;
- results.

Seeds must be synthetic.

## 75. Seed Data Determinism

Repeated seed execution should produce predictable results.

Where possible:

- use stable identifiers;
- use upsert or reset semantics;
- avoid random production-like values;
- document dependencies.

## 76. Seed Data Example

Conceptually:

    Organization
       |
       +--> Developer User
       +--> Project
       +--> Humanoid-A Platform
       +--> Credit Wallet
       +--> Development Lab
               |
               +--> Resource-A
               +--> Resource-B

## 77. Seed Data and Migrations

Seed scripts must run only after required migrations.

A migration must not silently depend on development seed data.

Migrations operate on schema/data state that may exist in production.

## 78. Test Fixtures

Fixtures are test-specific and should be created by the test framework or
fixture builder.

Fixtures must not depend on the developer's seed state.

Preferred:

    Test
      |
      v
    Fixture Builder
      |
      v
    Test Data
      |
      v
    Assertion

## 79. Fixture Isolation

Fixtures should be isolated by:

- transaction rollback;
- unique IDs;
- isolated schema/database;
- cleanup.

The strategy must be compatible with testing real transaction semantics.

## 80. Development Backup Principle

Development backups exist to validate backup/restore procedures and provide
recovery from accidental local data loss.

They are not a substitute for production backup systems.

## 81. Local Backup

A local PostgreSQL backup should be reproducible using the selected PostgreSQL
backup tooling.

Conceptually:

    PostgreSQL
       |
       v
    Logical Backup
       |
       v
    Local Backup Artifact

The backup must not contain production data.

## 82. Local Restore

Restore testing should follow:

    Backup
      |
      v
    Fresh PostgreSQL
      |
      v
    Restore
      |
      v
    Migration / Compatibility Validation
      |
      v
    Application Verification

The restored database must be queryable and structurally valid.

## 83. Backup Verification

A backup is not considered valid merely because the backup command succeeded.

Verification must include:

- restore succeeds;
- expected tables exist;
- row counts are plausible;
- constraints exist;
- representative queries work;
- application can connect.

## 84. Development Restore Drill

At least periodically:

    Create Backup
        |
        v
    Destroy Test DB
        |
        v
    Recreate DB
        |
        v
    Restore Backup
        |
        v
    Run Validation
        |
        v
    Record Result

This provides confidence in the recovery procedure.

## 85. Production Backup Separation

Development backups must never be confused with production backups.

Production backup requirements are governed separately by:

    docs/cloud/operations/BACKUP.md

Development tooling must use development credentials and storage.

## 86. Database Security

Database development must enforce:

- least privilege;
- development-only credentials;
- TLS where required by environment;
- no credentials in source;
- no credentials in logs;
- no production access from developer databases.

## 87. Database Roles

At minimum, environments should distinguish application access from administrative
migration access where practical.

The application should not require unrestricted superuser privileges.

## 88. Migration Credentials

Migration execution may require stronger privileges than normal application
runtime.

The migration role must not automatically become the runtime role.

This separation should be preserved in staging and production.

## 89. Database CI Gates

CI must validate:

- migrations;
- schema consistency;
- constraints;
- indexes;
- database integration tests;
- concurrency tests;
- fixture setup;
- tenant isolation.

A migration failure blocks the PR.

## 90. Migration CI Flow

    Checkout
       |
       v
    Start PostgreSQL
       |
       v
    Apply All Migrations
       |
       v
    Validate Schema
       |
       v
    Seed / Fixtures
       |
       v
    Integration Tests
       |
       v
    Destroy

## 91. Migration Compatibility CI

For production-sensitive migrations, CI should test:

    Previous Application
          +
    Expanded Schema

and:

    New Application
          +
    Expanded Schema

where both application versions may coexist during deployment.

## 92. Zero-Downtime Migration Principle

A migration is zero-downtime compatible when application availability can be
maintained while schema evolution occurs.

Preferred sequence:

    Version N
       |
       v
    Expand Schema
       |
       v
    Version N+1 Compatible Code
       |
       v
    Backfill
       |
       v
    Switch Behavior
       |
       v
    Contract Schema

## 93. Zero-Downtime Add Column

Preferred:

    ALTER TABLE ...
    ADD COLUMN new_column ...

with safe null/default semantics.

Avoid introducing a mandatory column that old application versions cannot
populate.

## 94. Zero-Downtime Constraint Addition

For large tables, constraint validation may need to be separated from
constraint creation.

The migration should avoid unexpectedly blocking production traffic.

The exact PostgreSQL mechanism must be reviewed per constraint type.

## 95. Zero-Downtime Index Addition

Large indexes should be evaluated for:

    CREATE INDEX CONCURRENTLY

where appropriate.

Migration tooling must support the operational constraints of this command.

## 96. Zero-Downtime Column Removal

Never remove a column simply because new code no longer reads it.

First verify:

- no old application version writes it;
- no background worker reads it;
- no report depends on it;
- no integration depends on it.

Then remove it in a later migration.

## 97. Zero-Downtime Table Changes

Large table changes require:

- data-volume estimate;
- lock analysis;
- query impact;
- deployment sequencing;
- rollback/recovery strategy.

Schema design must avoid unnecessary table rewrites.

## 98. Migration Rollback

Rollback strategy must be explicit.

Possible strategies:

- backward migration;
- forward corrective migration;
- application rollback;
- restore from backup.

For data-transforming migrations, forward correction is often safer than
attempting to reconstruct deleted data.

## 99. Destructive Migration Review

Destructive changes require elevated review.

Examples:

- dropping a table;
- dropping a column;
- deleting historical financial records;
- changing a primary key;
- removing a constraint;
- destructive data transformation.

A destructive migration must document data-loss implications.

## 100. Production Migration Readiness

Before a migration reaches production, verify:

- tested against realistic data volume;
- lock behavior understood;
- runtime compatibility validated;
- backup available;
- monitoring available;
- rollback/recovery plan known;
- migration duration estimated.

## 101. Database Observability

Database monitoring should include:

- connection count;
- active transactions;
- long-running transactions;
- lock waits;
- deadlocks;
- slow queries;
- database size;
- table/index growth;
- replication health where applicable.

## 102. Long Transaction Detection

Long-running transactions can block:

- vacuum;
- schema changes;
- other transactions.

Development and CI should detect unexpected long transactions in integration
tests.

## 103. Vacuum Awareness

PostgreSQL maintenance must be considered during performance review.

Large update/delete workloads should consider:

- vacuum behavior;
- table bloat;
- index bloat;
- transaction age.

Application design should avoid unnecessary update churn.

## 104. Soft Delete

Soft deletion may be used where historical traceability is required.

If used, define:

    deleted_at

or equivalent.

Queries must consistently account for active versus deleted records.

Do not add soft deletion automatically to every table.

## 105. Historical Records

Financial, audit and execution records generally require stronger retention
than ephemeral records.

Deletion policies must respect:

- auditability;
- financial reconciliation;
- result retention;
- legal requirements;
- operational recovery.

## 106. Data Retention

Retention should be defined per data class.

Example:

| Data | Retention Principle |
|---|---|
| Credit ledger | Long-lived/immutable |
| Audit | Long-lived |
| Job history | Policy-driven |
| Telemetry | Bounded |
| Temporary idempotency | Expiring |
| Outbox | Short-lived after publication |
| Results | Commercial policy |
| Artifacts | Lifecycle policy |

## 107. Database Cleanup Jobs

Cleanup must be asynchronous and controlled.

Candidates include:

- expired idempotency records;
- processed outbox events;
- temporary artifacts;
- expired sessions;
- old telemetry metadata.

Cleanup must never silently delete authoritative financial or audit records.

## 108. Performance Review Checklist

For every significant schema change:

- [ ] query pattern identified;
- [ ] expected row count estimated;
- [ ] index reviewed;
- [ ] query plan reviewed;
- [ ] lock behavior reviewed;
- [ ] transaction duration considered;
- [ ] write amplification considered;
- [ ] storage impact considered.

## 109. Database Change Workflow

The complete workflow is:

    Requirement
       |
       v
    Domain Change
       |
       v
    Ownership Review
       |
       v
    Schema Design
       |
       v
    Migration
       |
       v
    Repository
       |
       v
    Tests
       |
       v
    Performance Review
       |
       v
    Documentation
       |
       v
    PR Review
       |
       v
    CI
       |
       v
    Merge

## 110. Database Change Review Template

Every significant database PR should answer:

    What changes?
    Why is it needed?
    Which module owns it?
    What data already exists?
    What migration runs?
    What locks are possible?
    What indexes are added?
    What backfill is required?
    Is it backward compatible?
    What is the rollback/recovery strategy?
    How is it tested?
    What documentation changed?

## 111. Phase Mapping

| Phase | Database Development Focus |
|---|---|
| Phase 0 | Schema conventions, migration framework, repository boundaries |
| Phase 1 | PostgreSQL, core entities, migrations, tenant isolation |
| Phase 2 | Platform, artifact, booking persistence |
| Phase 3 | Jobs, workers, outbox, idempotency |
| Phase 4 | Credit ledger, wallets, reservations, billing references |
| Phase 5 | Jobs, Runs, execution persistence |
| Phase 6 | Labs, agents, resources, allocations, reconciliation |
| Phase 7 | Results, telemetry metadata, events |
| Phase 8 | Performance, security, backup, restore, hardening |

## 112. Phase 0 Acceptance

- [ ] PostgreSQL version selected.
- [ ] Migration framework selected or implementation decision recorded.
- [ ] Naming conventions established.
- [ ] Ownership boundaries established.
- [ ] Local database procedure documented.
- [ ] Test database procedure documented.
- [ ] Schema CI foundation established.

## 113. Phase 1 Acceptance

- [ ] Core migrations execute from empty database.
- [ ] Identity schema works.
- [ ] Organization schema works.
- [ ] Project schema works.
- [ ] Tenant isolation is enforced.
- [ ] Repository tests pass.
- [ ] Migration CI passes.

## 114. Phase 2 Acceptance

- [ ] Platform schema implemented.
- [ ] Artifact schema implemented.
- [ ] Booking schema implemented.
- [ ] Booking conflict constraints tested.
- [ ] Object-storage references tested.
- [ ] Indexes reviewed.

## 115. Phase 3 Acceptance

- [ ] Job schema implemented.
- [ ] Idempotency schema implemented.
- [ ] Outbox schema implemented where selected.
- [ ] Worker integration tested.
- [ ] Duplicate processing tested.
- [ ] Transaction boundaries tested.

## 116. Phase 4 Acceptance

- [ ] Credit wallet schema implemented.
- [ ] Ledger schema implemented.
- [ ] Reservation schema implemented.
- [ ] Double-entry invariants tested.
- [ ] Concurrent wallet operations tested.
- [ ] Immutable transaction policy enforced.

## 117. Phase 5 Acceptance

- [ ] Run persistence implemented.
- [ ] Job/Run relationship tested.
- [ ] Execution state transitions tested.
- [ ] Resource allocation persistence tested.
- [ ] Timeout state persistence tested.

## 118. Phase 6 Acceptance

- [ ] Lab schema implemented.
- [ ] Agent schema implemented.
- [ ] Resource schema implemented.
- [ ] Allocation schema implemented.
- [ ] Reconciliation persistence tested.
- [ ] Safety-related state is represented correctly.

## 119. Phase 7 Acceptance

- [ ] Result schema implemented.
- [ ] Result files reference object storage correctly.
- [ ] Telemetry metadata strategy validated.
- [ ] Event/outbox persistence validated.
- [ ] Retention strategy documented.

## 120. Phase 8 Acceptance

- [ ] Performance review completed.
- [ ] Slow-query monitoring established.
- [ ] Backup tested.
- [ ] Restore tested.
- [ ] Migration recovery tested.
- [ ] Security review completed.
- [ ] Schema drift detection works.
- [ ] Production migration checklist passes.

## 121. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Unsafe migration | Critical | Expand/contract + review |
| Table lock | Critical | Lock analysis |
| Data loss | Critical | Backup + destructive review |
| Schema drift | High | Migration CI |
| Cross-module mutation | High | Ownership boundaries |
| Credit corruption | Critical | Immutable ledger |
| Booking race | Critical | DB constraints/locking |
| Slow query | High | Query plan review |
| Index bloat | Medium | Index review |
| Test contamination | High | Isolated DBs |
| Seed drift | Medium | Deterministic seeds |
| Restore failure | Critical | Restore drills |
| Zero-downtime failure | Critical | Compatibility testing |

## 122. Risk: Unsafe Migration

Mitigation:

- migration review;
- realistic data testing;
- lock analysis;
- expand/contract;
- backup;
- explicit recovery plan.

## 123. Risk: Data Loss

Mitigation:

- immutable financial history;
- backups;
- destructive migration review;
- restore tests;
- compensating transactions.

## 124. Risk: Performance Regression

Mitigation:

- query plans;
- realistic datasets;
- indexes;
- load tests;
- slow-query monitoring;
- regression baselines.

## 125. Risk: Incorrect Concurrency

Mitigation:

- database constraints;
- explicit locking;
- transaction tests;
- concurrent integration tests;
- deadlock analysis.

## 126. Risk: Development Drift

Mitigation:

- migrations as source of truth;
- disposable test DB;
- schema validation;
- deterministic seeds;
- CI from empty database.

## 127. Open Questions

The following remain implementation decisions:

1. Final PostgreSQL major version.
2. Final migration framework.
3. Final ORM/query layer.
4. Whether PostgreSQL enums or constrained text are preferred.
5. Exact UUID generation strategy.
6. Exact schema namespace strategy.
7. Exact RLS strategy.
8. Exact database backup toolchain for development.
9. Exact local PostgreSQL container image.
10. Exact migration rollback policy.
11. Exact production migration execution mechanism.
12. Exact database performance thresholds.
13. Exact connection pool limits.
14. Exact partitioning thresholds.
15. Exact telemetry storage strategy.

These questions do not change the database ownership and correctness principles
defined in this document.

## 128. RLS Consideration

Row-Level Security may be used as defense in depth for tenant isolation.

If enabled, it must be applied consistently.

RLS must not be treated as a replacement for application authorization.

The authoritative security flow remains:

    Authentication
       |
       v
    Authorization
       |
       v
    Tenant Scope
       |
       v
    Database Query

## 129. Database Schema Versioning

Every deployed schema must correspond to a known migration version.

The application should expose or record:

    application_version
    schema_version

This assists incident diagnosis and compatibility verification.

## 130. Application/Schema Compatibility

During rolling deployment:

    Application N
        |
        +--> Schema N
        +--> Schema N+1-compatible

    Application N+1
        |
        +--> Schema N+1

The schema must not be changed in a way that makes the currently running
application immediately invalid unless deployment architecture guarantees
otherwise.

## 131. Database Interface Boundary

Application code should access PostgreSQL through:

    Application Service
       |
       v
    Repository / Query Interface
       |
       v
    Database Adapter
       |
       v
    PostgreSQL

This prevents SQL details from leaking into domain logic.

## 132. Query Interface

Complex read models may use dedicated query interfaces.

Example:

    BookingAvailabilityQuery
    JobStatusQuery
    CreditBalanceQuery
    ResultSummaryQuery

Read optimization must not weaken domain ownership.

## 133. Write Interface

Writes should be domain-specific.

Preferred:

    CreditService.reserve(...)

rather than:

    Database.updateWallet(...)

The latter bypasses business invariants.

## 134. Database Error Mapping

Database errors must be translated into stable application errors.

Examples:

    Unique Constraint
        -> CONFLICT / domain-specific code

    Serialization Failure
        -> controlled retry where safe

    Deadlock
        -> controlled retry where safe

    Connection Failure
        -> INFRA_DATABASE_UNAVAILABLE

Raw PostgreSQL error strings must not become client contracts.

## 135. Database Retry Rules

Database retries must be selective.

Retry may be appropriate for:

- transient connection failure;
- serialization failure;
- deadlock.

Do not blindly retry:

- constraint violations;
- invalid input;
- authorization failures;
- business conflicts.

## 136. Database Shutdown Testing

The application should handle database shutdown predictably.

Test:

    Backend Running
       |
       v
    PostgreSQL Stops
       |
       v
    Controlled Errors
       |
       v
    PostgreSQL Restarts
       |
       v
    Readiness Restored

No corrupted business state should result.

## 137. Restore Compatibility Testing

A restored database must be tested against the application version intended
to use it.

Example:

    Backup at Schema N
          |
          v
    Restore
          |
          v
    Schema Validation
          |
          v
    Application N
          |
          v
    Smoke Tests

## 138. Backup Data Classification

Backups may contain sensitive data even in development.

Therefore:

- access must be restricted;
- storage must be controlled;
- backup files must be ignored by source control;
- sharing requires approval.

## 139. Local Backup Exclusion

Backup files must not accidentally enter:

    Git
    Docker image
    Application artifact
    `.krv` package

The repository `.gitignore` should explicitly exclude local database dumps
where appropriate.

## 140. Database Change Acceptance

A database change is accepted only when:

    Schema
       +
    Migration
       +
    Repository
       +
    Tests
       +
    Performance Review
       +
    Documentation
       |
       v
    ACCEPTED

## 141. Full Acceptance Criteria Checklist

### Schema Design

- [ ] Table has a clear owner.
- [ ] Table name follows convention.
- [ ] Column names use `snake_case`.
- [ ] Primary key is stable and opaque.
- [ ] Foreign keys are explicit.
- [ ] Required fields are `NOT NULL`.
- [ ] Nullable fields have defined semantics.
- [ ] Timestamps use UTC semantics.
- [ ] Large binaries use object storage.
- [ ] JSONB is used only where appropriate.
- [ ] Constraints enforce critical invariants.

### Naming

- [ ] Tables use approved naming.
- [ ] Columns use approved naming.
- [ ] Foreign keys use `<entity>_id`.
- [ ] Timestamp fields use clear suffixes.
- [ ] Index names are descriptive.
- [ ] Constraint names are descriptive.

### Ownership

- [ ] One module owns each table.
- [ ] Cross-module access uses explicit interfaces.
- [ ] No unauthorized direct mutation exists.
- [ ] Financial data remains owned by Credit/Billing boundaries.
- [ ] Physical resource data remains owned by Lab.

### Migrations

- [ ] Migration is versioned.
- [ ] Migration has a clear purpose.
- [ ] Migration is deterministic.
- [ ] Migration is tested from empty DB.
- [ ] Migration is tested against existing data.
- [ ] Migration lock behavior is reviewed.
- [ ] Migration performance is reviewed.
- [ ] Rollback/recovery strategy is documented.
- [ ] Destructive changes receive elevated review.

### Zero Downtime

- [ ] Backward compatibility considered.
- [ ] Expand/contract pattern used where appropriate.
- [ ] Backfill is controlled.
- [ ] Backfill is observable.
- [ ] Backfill is resumable.
- [ ] Index creation strategy reviewed.
- [ ] Column removal is delayed until safe.
- [ ] Rolling deployment compatibility is validated.

### Database Performance

- [ ] Query patterns identified.
- [ ] Indexes justified.
- [ ] Composite indexes reviewed.
- [ ] Query plans inspected where required.
- [ ] N+1 behavior checked.
- [ ] Pagination strategy reviewed.
- [ ] Locking reviewed.
- [ ] Transaction duration reviewed.
- [ ] Connection pool impact reviewed.

### Local Development

- [ ] `raas_dev` or equivalent exists.
- [ ] Database starts reproducibly.
- [ ] Migrations run automatically.
- [ ] Seed data loads.
- [ ] Reset procedure works.
- [ ] No production credentials are used.
- [ ] No production data is used.

### Fixtures

- [ ] Fixtures are synthetic.
- [ ] Fixtures are deterministic.
- [ ] Fixtures are isolated.
- [ ] Fixture builders are reusable.
- [ ] Fixtures do not depend on seed state.

### Testing

- [ ] Repository tests pass.
- [ ] Constraint tests pass.
- [ ] Transaction tests pass.
- [ ] Concurrency tests pass.
- [ ] Booking conflict tests pass.
- [ ] Credit concurrency tests pass.
- [ ] Migration tests pass.
- [ ] Tenant isolation tests pass.
- [ ] Performance-sensitive queries are tested.

### Backup and Restore

- [ ] Development backup can be created.
- [ ] Backup is excluded from source control.
- [ ] Backup can be restored.
- [ ] Restored database passes schema validation.
- [ ] Restored database passes application smoke tests.
- [ ] Restore drill is documented.

### CI

- [ ] Fresh PostgreSQL starts in CI.
- [ ] All migrations run.
- [ ] Schema validation passes.
- [ ] Integration tests pass.
- [ ] Concurrency tests pass.
- [ ] Drift detection passes.
- [ ] Backup/restore checks run where required.

### Security

- [ ] Runtime does not use superuser unnecessarily.
- [ ] Migration role is separated where practical.
- [ ] Secrets are not committed.
- [ ] Secrets are not logged.
- [ ] Tenant isolation is tested.
- [ ] Sensitive backup access is controlled.

### Documentation

- [ ] Architecture document updated if needed.
- [ ] Task documentation updated.
- [ ] Migration documented.
- [ ] Seed data updated.
- [ ] Performance impact documented.
- [ ] Recovery implications documented.
- [ ] Tracking updated.

## 142. Final Database Development Invariants

The following are mandatory:

1. PostgreSQL is authoritative for structured business state.
2. Schema evolution occurs through versioned migrations.
3. Manual schema changes are not accepted as permanent solutions.
4. Every table has an explicit logical owner.
5. Cross-module mutation is prohibited without architectural approval.
6. Critical invariants are enforced by database constraints where practical.
7. Credit ledger records are immutable.
8. Booking conflicts are transactionally protected.
9. Tenant scoping is mandatory.
10. Large binaries are stored outside PostgreSQL.
11. Timestamps use UTC semantics.
12. Transactions remain short.
13. External calls do not normally occur inside transactions.
14. Side-effecting database operations are idempotent where required.
15. Migrations are reviewed for locking and performance.
16. Production schema changes use backward-compatible sequencing where required.
17. Backfills are controlled and observable.
18. Development and test databases are isolated.
19. Seeds and fixtures are deterministic and synthetic.
20. Backup procedures are periodically tested.
21. Restore success is verified, not assumed.
22. Database performance is part of design review.
23. Schema drift is detected.
24. Database changes are represented in CI.
25. A database change is not complete until migration, tests, review and
    documentation are complete.

## 143. Final Database Development Flow

The canonical workflow is:

    Requirement
       |
       v
    Domain / Ownership Review
       |
       v
    Schema Design
       |
       v
    Migration Design
       |
       v
    Expand / Backfill / Contract Plan
       |
       v
    Implementation
       |
       v
    Repository + Tests
       |
       v
    Performance Review
       |
       v
    Backup / Recovery Review
       |
       v
    Pull Request
       |
       v
    CI
       |
       v
    Review
       |
       v
    Merge
       |
       v
    Migration Execution
       |
       v
    Verification

## 144. Final Principle

The Kritva RaaS database must be treated as a production system from the first
schema migration.

The development process therefore follows one fundamental rule:

> **A database change is not merely a SQL change; it is a controlled evolution
> of authoritative business state.**

Every schema change must preserve:

- data integrity;
- tenant isolation;
- transactional correctness;
- concurrency safety;
- performance;
- recoverability;
- deployment compatibility;
- and traceability.

This discipline is essential because the PostgreSQL database ultimately records
the authoritative state behind the Kritva RaaS Control Plane.
