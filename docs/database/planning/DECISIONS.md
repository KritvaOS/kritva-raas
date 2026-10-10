# Database Architecture Decision Register

**Document:** `docs/database/planning/DECISIONS.md`  
**Project:** Kritva RaaS  
**Status:** Database-specific architecture decision register  
**Audience:** Database architects, backend engineers, infrastructure engineers, and technical reviewers  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document records architectural decisions specific to the database implementation of Kritva RaaS.

It preserves the rationale, alternatives, consequences, and validation expectations behind database implementation choices. Its purpose is to make persistence decisions explicit, reviewable, and traceable without duplicating product/system architecture or backend and cloud implementation decisions.

This register MUST contain only database-specific architecture decisions. Product-wide and cross-domain decisions MUST be recorded in `docs/planning/DECISIONS.md` and referenced here when they constrain database implementation.

The register MUST remain consistent with the authoritative system database architecture, PostgreSQL implementation architecture, backend implementation architecture, security documents, protocol contracts, and milestone dossiers.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns database-specific architecture decision records, including decisions about:

- PostgreSQL implementation choices.
- Database schema and namespace organization.
- Table, column, constraint, and type conventions.
- Migration tooling and migration execution strategy.
- Transaction implementation and isolation configuration.
- Row-level security implementation.
- Indexing and query-planning strategy.
- Partitioning and data-retention implementation.
- Connection pooling and connection lifecycle.
- Database access privileges and database-level roles.
- Backup, restore, and database recovery implementation.
- Database upgrade and migration safety.
- Database-specific concurrency and locking mechanisms.
- Database performance measurement and optimization.
- Database observability and diagnostic implementation.
- Database integration and migration testing.
- Database-specific tooling, dependency, and operational trade-offs.
- Database implementation compatibility and technical-debt decisions.

Each decision MUST concern database implementation. It MUST NOT redefine product-level data ownership, application authorization policy, API semantics, or cloud topology.

### 2.2 Product-Wide Decision Ownership

`docs/planning/DECISIONS.md` owns product/system-level architecture decisions and the index to domain decision registers.

This database register MUST NOT independently define or override:

- Product-wide system boundaries.
- Cross-domain ownership of business data.
- Product-level data authority and lifecycle semantics.
- Business rules for booking, execution, billing, or resource allocation.
- API, event, or artifact wire contracts.
- Application authentication and authorization policy.
- System-level tenant and trust boundaries.
- Product-wide availability and recovery objectives.
- Cloud deployment topology.
- Cross-domain compatibility requirements.
- Product-wide retention obligations.
- Service ownership and responsibilities.

When a database proposal changes one of these concerns, the proposal MUST be reviewed through `docs/planning/DECISIONS.md`.

A database decision MAY describe how an approved system requirement is implemented in PostgreSQL, but MUST NOT create a competing definition of that requirement.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Product/system-level decisions | `docs/planning/DECISIONS.md` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Product/system database role and authority | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| PostgreSQL implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Database-specific architecture decisions | `docs/database/planning/DECISIONS.md` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| System backend responsibilities and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend-specific decisions | `docs/backend/planning/DECISIONS.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Product/system cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud and infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Application security model and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Frontend implementation and decisions | Applicable documents under `docs/frontend/` |
| Cloud-specific decisions | `docs/cloud/planning/DECISIONS.md` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

The referenced documents are authoritative for their named responsibilities. This register MUST link to them rather than reproduce their complete content.

### 2.4 Decision Register Versus Database Architecture

This register records why a database implementation choice was made and the consequences of that choice.

`docs/architecture/DATABASE_ARCHITECTURE.md` owns the product/system role and authority of the database.

`docs/database/architecture/DATABASE_ARCHITECTURE.md` owns PostgreSQL implementation architecture, including schema layout, migrations, transaction and isolation configuration, row-level security implementation, indexing, partitioning, connection pooling, backup and restore, and upgrade safety.

Backend implementation documents own how application code invokes persistence operations and coordinates application workflows.

Cloud implementation documents own managed database resources, infrastructure networking, cloud identity integration, and infrastructure-level availability configuration.

These documents SHOULD link to relevant accepted decisions when a decision materially constrains their contents. This register MUST NOT duplicate their complete architecture specifications.

### 2.5 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Product/system architecture decisions.
- Complete database schema specifications.
- Product-wide entity and data-ownership definitions.
- API, event, or artifact wire contracts.
- Backend repository implementation instructions.
- Cloud database deployment topology.
- Application authentication and authorization design.
- Business rules or domain lifecycle definitions.
- Detailed migration runbooks.
- Operational incident records.
- Milestone acceptance criteria.
- General SQL coding guidelines that do not represent a consequential architecture decision.

When content belongs elsewhere, this register MUST link to the authoritative owner.

## 3. Database Decision Principles

### 3.1 Single Authority

Each database architecture decision MUST have one authoritative record.

An accepted decision MUST NOT be independently recreated in another document with conflicting wording or status.

Other documents MAY summarize a decision where necessary, but MUST link to this register.

### 3.2 Implementation Scope

A database decision MUST identify the database implementation concern it governs.

A decision SHOULD be as narrow as possible while solving the stated problem.

A database-specific choice MUST NOT silently impose a product-wide architectural constraint.

### 3.3 Data Integrity

Database implementation MUST preserve the approved data model and integrity requirements.

Constraints SHOULD be enforced at the database boundary when they protect persistent invariants that must hold across all writers.

Application validation and database constraints serve different purposes and MUST NOT be treated as interchangeable.

### 3.4 Transaction Correctness

Transaction decisions MUST identify the required atomicity and concurrency behavior.

The selected transaction and isolation strategy MUST be appropriate to the operation's correctness requirements.

A decision MUST NOT assume that application-level checks alone prevent concurrent updates from violating persistent invariants.

### 3.5 Migration Safety

Schema changes MUST have a controlled migration strategy.

Changes that can affect existing application versions, stored data, availability, or rollback behavior MUST identify those risks and the required deployment sequence.

### 3.6 Security Alignment

Database implementation MUST follow the approved application security model and system trust boundaries.

Database-level roles and row-level security MAY enforce approved access constraints, but MUST NOT create a competing definition of application identity, authorization policy, or tenant ownership.

### 3.7 Performance Evidence

Performance-related decisions SHOULD be supported by representative query plans, benchmarks, workload measurements, or documented assumptions.

An index, partitioning scheme, or query optimization MUST have a clear expected benefit and an appropriate validation method.

### 3.8 Recovery

Database recovery decisions MUST distinguish backup availability from verified restoration.

Recovery procedures SHOULD be tested and MUST satisfy the applicable product/system recovery requirements.

### 3.9 Reversibility

A decision SHOULD identify whether it can be reversed locally or requires a costly schema, data, or application migration.

High-cost decisions SHOULD receive stronger review and explicit migration planning.

### 3.10 No Implied Approval

A proposed decision is not an approved database implementation requirement.

Its presence in this register MUST NOT be interpreted as evidence that the choice has been accepted, implemented, or validated.

## 4. Decision Record Format

### 4.1 Required Fields

Every accepted database decision MUST include:

- **ID:** Stable, unique identifier.
- **Title:** Concise decision name.
- **Status:** Proposed, Accepted, Rejected, Superseded, or Withdrawn.
- **Date:** Date of the decision or latest status transition.
- **Context:** Problem, requirement, and relevant constraints.
- **Decision:** Selected database implementation approach.
- **Rationale:** Reasons for selecting the approach.
- **Alternatives:** Material alternatives considered.
- **Consequences:** Benefits, limitations, and obligations.
- **Affected areas:** Schemas, tables, migrations, queries, roles, or operational procedures.
- **Related decisions:** IDs of decisions that constrain or depend on this decision.
- **References:** Links to architecture documents, provider documentation, tests, and milestone dossiers.
- **Review triggers:** Conditions that would require reconsideration.
- **Validation evidence:** Tests, measurements, or implementation references where applicable.

A proposed decision MAY have incomplete implementation evidence. Required evidence MUST be completed before implementation is declared conformant.

### 4.2 Stable IDs

Database decision IDs MUST use the prefix `DB-ADR-` followed by a zero-padded numeric identifier.

Examples:

- `DB-ADR-001`
- `DB-ADR-002`
- `DB-ADR-003`

An ID MUST NOT be reused after rejection, withdrawal, or supersession.

Product/system decision IDs MUST follow the convention defined in `docs/planning/DECISIONS.md`.

### 4.3 Status Definitions

| Status | Meaning |
|---|---|
| Proposed | Under discussion; not an approved database implementation constraint |
| Accepted | Approved and authoritative until superseded or withdrawn |
| Rejected | Reviewed and not selected |
| Superseded | Replaced by a later decision |
| Withdrawn | No longer applicable and not replaced by a direct successor |

A proposed decision MUST NOT be described as an established database requirement.

A rejected decision SHOULD record its rejection rationale.

A superseded decision MUST identify its successor.

### 4.4 Scope and Impact

Every decision MUST identify the database implementation areas it affects.

When a decision affects multiple schemas or environments, the record MUST distinguish common requirements from environment-specific configuration.

When a decision affects application behavior or cloud infrastructure, it MUST identify the boundary and reference the appropriate owner.

### 4.5 Alternatives

Material alternatives SHOULD be documented with their trade-offs.

The analysis SHOULD consider correctness, operational complexity, migration cost, performance, and maintainability.

A concise alternatives analysis MAY be used for low-risk and easily reversible decisions.

### 4.6 Consequences

Consequences MUST identify material effects on:

- Data integrity.
- Transaction and concurrency behavior.
- Schema evolution.
- Query performance.
- Operational complexity.
- Security and access control.
- Recovery and backup.
- Application compatibility.
- Migration and rollback.
- Storage and resource consumption.
- Testing and observability.
- Development workflow.

Follow-up work SHOULD be linked to its authoritative task or milestone dossier.

## 5. Database Decision Index

### 5.1 Index Purpose

The index provides a discoverable entry point for database implementation decisions.

The entries below are proposed placeholders for review. They do not establish that a particular schema, isolation level, indexing strategy, or database implementation choice has already been approved or deployed.

Each entry MUST be completed, rejected, withdrawn, or removed from the active index through the decision workflow.

### 5.2 Initial Register

| ID | Decision title | Status | Scope | Record |
|---|---|---|---|---|
| DB-ADR-001 | Database decision governance and ownership | Proposed | Decision boundaries and record maintenance | Section 6 |
| DB-ADR-002 | PostgreSQL schema and namespace organization | Proposed | Schema boundaries and object organization | Section 7 |
| DB-ADR-003 | Schema migration and versioning strategy | Proposed | Migration tooling and deployment safety | Section 8 |
| DB-ADR-004 | Transaction and isolation implementation | Proposed | Atomicity and concurrency | Section 9 |
| DB-ADR-005 | Row-level security implementation | Proposed | Database access isolation | Section 10 |
| DB-ADR-006 | Indexing and query performance strategy | Proposed | Indexes, query plans, and optimization | Section 11 |
| DB-ADR-007 | Partitioning and data-retention implementation | Proposed | Large datasets and lifecycle management | Section 12 |
| DB-ADR-008 | Connection pooling and lifecycle | Proposed | Connection management | Section 13 |
| DB-ADR-009 | Backup, restore, and database recovery | Proposed | Recovery implementation | Section 14 |
| DB-ADR-010 | Database upgrade and migration safety | Proposed | Compatibility and operational upgrades | Section 15 |

These entries identify decision areas that may need explicit records. They MUST NOT be interpreted as a mandate to adopt any particular database extension, migration framework, pooling service, or schema design.

### 5.3 Index Maintenance

When a decision is accepted, the index MUST link to its complete record and show its current status.

When a decision is superseded, the index MUST identify its successor.

When a decision depends on a product/system decision, the full record SHOULD link to the relevant entry in `docs/planning/DECISIONS.md`.

The index MUST NOT duplicate product-wide decision content.

## 6. DB-ADR-001 — Database Decision Governance and Ownership

**Status:** Proposed  
**Scope:** Database-specific architecture decision records

### 6.1 Context

Database implementation choices can be repeated across architecture documents, migration scripts, application code, and milestone dossiers.

Without explicit ownership, implementation details may be mistaken for product-wide requirements, and database code may become the only record of a consequential architectural choice.

### 6.2 Proposed Decision

Database-specific architecture decisions MUST be recorded in this register.

Product/system-level decisions MUST be recorded in `docs/planning/DECISIONS.md`.

The product/system role and authority of the database MUST be documented in `docs/architecture/DATABASE_ARCHITECTURE.md`.

PostgreSQL implementation architecture MUST be documented in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Database milestone scope and acceptance MUST remain in the authoritative dossiers under `docs/database/milestones/`.

### 6.3 Rationale

This separation preserves the rationale and history of database choices while keeping system data authority, database implementation, and application persistence behavior in their proper locations.

### 6.4 Consequences

- Database decisions require stable IDs and explicit status.
- Cross-domain decisions must be escalated to the product-wide register.
- Database architecture documents MUST link to relevant accepted decisions.
- Migration scripts and database configuration MUST remain consistent with accepted decisions.
- Milestone dossiers remain authoritative for acceptance.
- Superseded decisions remain discoverable.

### 6.5 Review Triggers

Review this decision if the repository documentation structure, database ownership model, or decision workflow changes materially.

## 7. DB-ADR-002 — PostgreSQL Schema and Namespace Organization

**Status:** Proposed  
**Scope:** Database schema and namespace organization

### 7.1 Context

Schema and namespace organization influences object ownership, privileges, migrations, application access, and long-term maintainability.

A schema structure that is too fragmented can increase operational complexity. A structure that is too broad can obscure ownership and create unintended coupling.

### 7.2 Proposed Decision

The database implementation MUST define explicit rules for schema and namespace organization.

The selected organization MUST be documented in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Schema boundaries MUST support the approved system data ownership model and MUST NOT independently redefine domain ownership.

### 7.3 Rationale

Explicit schema boundaries improve discoverability, privilege management, and migration control.

### 7.4 Consequences

- Database objects MUST have identifiable ownership.
- Schema naming MUST be consistent.
- Cross-schema dependencies SHOULD be explicit and reviewable.
- Schema privileges MUST follow the approved access model.
- Database object names SHOULD remain stable unless a migration justifies a change.
- Schema organization MUST account for migration and test isolation.

### 7.5 Alternatives

Possible approaches include a single application schema, multiple schemas organized by domain, or a hybrid arrangement.

The chosen approach MUST be justified by actual ownership boundaries, privilege requirements, migration needs, and operational complexity.

### 7.6 Ownership Boundary

The product/system meaning and authority of persistent data belong to `docs/architecture/DATABASE_ARCHITECTURE.md`.

The PostgreSQL schema implementation belongs to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

This record owns the rationale for the selected schema organization.

### 7.7 Review Triggers

Review this decision if schema ownership becomes unclear, cross-schema coupling grows materially, or privilege management becomes difficult to audit.

## 8. DB-ADR-003 — Schema Migration and Versioning Strategy

**Status:** Proposed  
**Scope:** Database schema migration implementation

### 8.1 Context

Database schemas evolve as application features are added, corrected, and retired.

Uncontrolled schema changes can make deployments non-reproducible, break application compatibility, or make rollback unsafe.

### 8.2 Proposed Decision

Database schema changes MUST use a documented, versioned migration strategy.

The selected migration tooling, migration ordering, execution model, and recovery procedures MUST be documented in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Manual production schema changes MUST NOT become an untracked alternative to the migration process.

### 8.3 Rationale

Versioned migrations make schema evolution reviewable, repeatable, and traceable to application changes.

### 8.4 Consequences

- Each migration MUST have a stable identity and ordering.
- Migration execution MUST detect and report failure.
- Applied migration history MUST be maintained.
- Destructive changes MUST receive explicit review.
- Long-running changes SHOULD consider locking and availability impact.
- Migration scripts SHOULD be tested against representative data.
- Migration and application compatibility MUST be considered during deployment.
- Recovery from a partially completed migration MUST be documented where relevant.

### 8.5 Alternatives

Possible approaches include versioned migration files, declarative schema reconciliation, or a controlled hybrid model.

The chosen mechanism MUST be justified by the deployment model, review workflow, rollback needs, and schema complexity.

### 8.6 Ownership Boundary

This decision covers database migration tooling and implementation strategy.

Product-level compatibility requirements belong to `docs/planning/DECISIONS.md` and the relevant system architecture documents.

Cloud deployment sequencing belongs to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 8.7 Review Triggers

Review this decision if migrations become difficult to reproduce, production drift recurs, or migration failures create unacceptable recovery risk.

## 9. DB-ADR-004 — Transaction and Isolation Implementation

**Status:** Proposed  
**Scope:** Database transaction and concurrency behavior

### 9.1 Context

Concurrent operations can read and update the same persistent state. Incorrect transaction boundaries or isolation assumptions can cause lost updates, inconsistent reads, duplicate effects, or violated invariants.

### 9.2 Proposed Decision

The database implementation MUST define transaction and isolation behavior appropriate to the required correctness guarantees.

Transaction boundaries MUST be explicit for operations that require atomic changes.

The selected isolation configuration, locking strategy, and concurrency controls MUST be documented in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

### 9.3 Rationale

Explicit transaction behavior makes concurrency assumptions reviewable and reduces the risk of data corruption under concurrent workloads.

### 9.4 Consequences

- Persistent invariants MUST be protected by appropriate constraints, transactions, or concurrency controls.
- Application code MUST handle expected concurrency failures.
- Locking behavior SHOULD be documented for operations with material contention risk.
- Transactions SHOULD be limited to the work required for atomicity.
- External network calls SHOULD NOT be included inside long-running database transactions without explicit justification.
- Retry behavior MUST account for transaction rollback and uncertain outcomes.
- Concurrency tests SHOULD exercise realistic interleavings where correctness depends on them.

### 9.5 Alternatives

Possible strategies include constraint-based enforcement, optimistic concurrency, explicit row locking, and stronger transaction isolation.

The selected approach MUST reflect the operation's correctness requirements, contention profile, and failure-handling strategy.

### 9.6 Ownership Boundary

This record owns the database-specific transaction and isolation implementation decision.

Backend orchestration and application-level retry behavior belong to the backend implementation architecture.

Product-level atomicity requirements remain owned by the relevant system architecture and product-wide decision register.

### 9.7 Review Triggers

Review this decision if concurrency defects recur, transaction contention becomes material, or measured workload behavior invalidates the selected isolation strategy.

## 10. DB-ADR-005 — Row-Level Security Implementation

**Status:** Proposed  
**Scope:** PostgreSQL row-level security and database access isolation

### 10.1 Context

Shared database tables may contain records associated with different tenants or access scopes.

Database-level row isolation can provide defense in depth, but incorrect policy design or connection-context handling can expose data or block legitimate operations.

### 10.2 Proposed Decision

Where row-level security is required by the approved system security model, its PostgreSQL implementation MUST be explicitly documented and tested.

The database implementation MUST NOT independently define tenant identity, application permissions, or the authoritative trust boundary.

### 10.3 Rationale

Explicit row-level security decisions make policy enforcement and its operational assumptions reviewable.

### 10.4 Consequences

- Policies MUST be tested for both permitted and prohibited access.
- Database roles MUST be considered when evaluating policy enforcement.
- Connection-context handling MUST be explicit where policies depend on session state.
- Connection pooling MUST NOT allow context from one operation to leak into another.
- Administrative and migration access MUST be controlled.
- Tests MUST cover missing, invalid, and unexpected access context.
- Policy changes MUST be reviewed for compatibility with existing queries and jobs.

### 10.5 Ownership Boundary

Application identity, authorization policy, and tenant trust boundaries belong to `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/`.

The database implementation of row-level security belongs to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Backend request-context propagation belongs to the relevant backend implementation documents.

### 10.6 Review Triggers

Review this decision if access-isolation tests fail, pooled connections retain unexpected context, or changes to application identity handling affect database policy assumptions.

## 11. DB-ADR-006 — Indexing and Query Performance Strategy

**Status:** Proposed  
**Scope:** Database indexing and query optimization

### 11.1 Context

Indexes can reduce query latency but add storage, write amplification, maintenance cost, and migration complexity.

Optimizations made without representative measurements can increase cost without improving application performance.

### 11.2 Proposed Decision

Material indexing and query-optimization decisions SHOULD be supported by representative workload evidence.

The database implementation MUST document the indexing strategy, query-analysis approach, and relevant performance constraints in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

### 11.3 Rationale

Evidence-based indexing balances read performance with storage, write throughput, and maintenance costs.

### 11.4 Consequences

- Indexes SHOULD correspond to known query or integrity requirements.
- Query plans SHOULD be inspected for performance-sensitive paths.
- Index creation and removal MUST consider locking and migration impact.
- Redundant indexes SHOULD be avoided.
- Query performance tests SHOULD use representative data volumes where practical.
- Index changes MUST be reviewed for write-path impact.
- Performance assumptions SHOULD be revisited when workload characteristics change.

### 11.5 Alternatives

Possible approaches include conventional indexes, composite indexes, partial indexes, specialized PostgreSQL index types, query restructuring, and caching at a higher layer.

The chosen approach MUST be justified by measured workload behavior and correctness requirements.

### 11.6 Ownership Boundary

This record owns the rationale for database indexing and query optimization.

Backend query invocation and application caching belong to the backend implementation architecture.

Cloud compute sizing and managed database resource configuration belong to the cloud implementation architecture.

### 11.7 Review Triggers

Review this decision if query latency regresses, index maintenance becomes costly, write performance degrades, or actual query plans differ materially from prior assumptions.

## 12. DB-ADR-007 — Partitioning and Data-Retention Implementation

**Status:** Proposed  
**Scope:** Database partitioning and data lifecycle implementation

### 12.1 Context

Growing datasets can increase query latency, maintenance effort, backup duration, and storage cost.

Partitioning and retention mechanisms can help manage growth, but introduce operational and query-planning complexity.

### 12.2 Proposed Decision

Partitioning MUST be introduced only when justified by workload characteristics, data volume, retention requirements, or operational constraints.

The database architecture MUST define partition keys, lifecycle behavior, maintenance procedures, and compatibility implications where partitioning is selected.

### 12.3 Rationale

An explicit decision avoids introducing partitioning complexity before it provides a measurable operational benefit.

### 12.4 Consequences

- Partition keys MUST align with supported query and lifecycle requirements.
- Partition creation and maintenance MUST have a defined strategy.
- Queries MUST be tested for expected partition pruning where relevant.
- Retention and deletion behavior MUST preserve approved system requirements.
- Partition operations MUST be considered in backup, restore, and migration planning.
- Unique constraints and foreign-key behavior MUST be evaluated against the selected partitioning model.
- Partitioning MUST NOT be used to redefine business data ownership.

### 12.5 Alternatives

Alternatives include an unpartitioned table, scheduled archival, controlled deletion, or partitioning based on an appropriate key.

The chosen strategy MUST reflect observed data growth, query patterns, retention obligations, and operational capability.

### 12.6 Ownership Boundary

Product-level retention and data lifecycle requirements belong to the product/system architecture and applicable policy documents.

Database partitioning and retention implementation belong to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Cloud storage lifecycle implementation belongs to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 12.7 Review Triggers

Review this decision if data volume grows beyond validated assumptions, retention requirements change, or partition maintenance becomes a material operational risk.

## 13. DB-ADR-008 — Connection Pooling and Lifecycle

**Status:** Proposed  
**Scope:** Database connection management

### 13.1 Context

Database connections consume server resources and are affected by workload concurrency, application process count, transaction duration, and connection setup overhead.

Unbounded connection creation can exhaust database capacity, while overly restrictive pools can cause avoidable queueing and latency.

### 13.2 Proposed Decision

Database connection management MUST use a documented pooling and lifecycle strategy appropriate to the application deployment model.

Pool sizing, timeout behavior, connection limits, and lifecycle configuration MUST be documented in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

### 13.3 Rationale

Explicit connection management protects database capacity and makes queueing and resource limits predictable.

### 13.4 Consequences

- Connection limits MUST account for all relevant application processes and workers.
- Pool acquisition timeouts MUST be explicit.
- Idle and maximum connection lifetimes SHOULD be configured where appropriate.
- Connections MUST be returned safely after successful and failed operations.
- Transaction and session state MUST NOT leak across pooled connection reuse.
- Pool saturation SHOULD be observable.
- Configuration changes MUST be validated under representative concurrency.

### 13.5 Alternatives

Possible approaches include application-local pools, a shared database proxy, or a combination of application and infrastructure pooling.

The selected approach MUST reflect deployment topology, database limits, session-state requirements, and operational cost.

### 13.6 Ownership Boundary

This record owns the rationale for database connection-pooling implementation.

Application process scaling belongs to the backend and cloud implementation architectures.

Cloud network connectivity and managed proxy resources belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 13.7 Review Triggers

Review this decision if connection exhaustion, excessive acquisition latency, session-state leakage, or pool contention occurs.

## 14. DB-ADR-009 — Backup, Restore, and Database Recovery

**Status:** Proposed  
**Scope:** Database backup and recovery implementation

### 14.1 Context

Database recovery may be required after accidental deletion, migration defects, corruption, infrastructure failure, or operational error.

The existence of backup artifacts does not prove that data can be restored correctly or within required limits.

### 14.2 Proposed Decision

The database implementation MUST define backup, restoration, integrity validation, and recovery verification procedures appropriate to the approved system requirements.

The implementation strategy MUST be documented in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

### 14.3 Rationale

Explicit recovery decisions reduce the risk of prolonged disruption and irreversible data loss.

### 14.4 Consequences

- Backup scope and retention MUST be explicit.
- Backup access MUST be restricted.
- Encryption requirements MUST be applied through approved controls.
- Restoration procedures SHOULD be tested periodically.
- Recovery validation MUST include database consistency checks.
- Recovery procedures MUST identify dependencies on schema versions and application compatibility.
- Recovery tests SHOULD record elapsed time, failures, and corrective actions.
- Backup protection MUST consider accidental deletion and unauthorized modification.

### 14.5 Ownership Boundary

This record owns database backup and restoration implementation choices.

Cloud backup infrastructure and storage configuration belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Product-level recovery objectives belong to the product/system architecture and `docs/planning/DECISIONS.md`.

### 14.6 Review Triggers

Review this decision if restoration tests fail, data-retention requirements change, recovery times exceed approved limits, or database architecture changes materially affect the recovery procedure.

## 15. DB-ADR-010 — Database Upgrade and Migration Safety

**Status:** Proposed  
**Scope:** PostgreSQL upgrades and compatibility-sensitive changes

### 15.1 Context

Database engine upgrades, extensions, configuration changes, and schema migrations can affect query behavior, compatibility, performance, and recovery.

An upgrade that succeeds technically may still introduce application incompatibility or unacceptable operational risk.

### 15.2 Proposed Decision

Database upgrades MUST use a documented compatibility and validation process.

The process MUST consider the database version, extensions, schema migrations, application compatibility, backup availability, rollback limitations, and post-upgrade verification.

### 15.3 Rationale

Explicit upgrade decisions make compatibility risks and recovery constraints visible before changes are applied to critical environments.

### 15.4 Consequences

- Supported database versions MUST be documented.
- Extension compatibility MUST be evaluated.
- Upgrade plans SHOULD be tested in a representative non-production environment.
- Backup and recovery readiness MUST be verified before a high-risk upgrade.
- Query plans and performance-sensitive paths SHOULD be checked after upgrade.
- Schema migrations MUST be coordinated with application compatibility requirements.
- Rollback limitations MUST be documented.
- Post-upgrade health and integrity checks MUST be defined.

### 15.5 Alternatives

Possible approaches include an in-place upgrade, logical migration, controlled replica promotion, or another supported transition strategy.

The selected approach MUST be justified by database size, downtime constraints, data integrity, compatibility, and recovery requirements.

### 15.6 Ownership Boundary

This record owns the rationale for PostgreSQL upgrade and migration-safety implementation.

Cloud maintenance windows and infrastructure deployment sequencing belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Application compatibility requirements belong to the relevant system and backend architecture documents.

### 15.7 Review Triggers

Review this decision when the database support window changes, an extension becomes incompatible, upgrade tests reveal regressions, or the existing recovery path no longer supports the planned transition.

## 16. Database Decision Workflow

### 16.1 Proposal

A database decision proposal MUST identify:

- The affected database capability.
- The problem or requirement.
- Relevant current database architecture.
- Constraints imposed by product/system decisions.
- Material alternatives.
- Expected data-integrity implications.
- Expected performance and operational implications.
- Migration and recovery implications.
- Validation requirements.
- The accountable owner.
- Relevant milestone dependencies.

A proposal MUST distinguish measured facts from estimates and assumptions.

### 16.2 Review

The database owner responsible for the affected implementation MUST review the proposal.

Backend, cloud, and security owners SHOULD participate when the decision affects their implementation responsibilities, contracts, or operational assumptions.

A proposal that changes product-wide data authority or another cross-domain constraint MUST be escalated to `docs/planning/DECISIONS.md`.

### 16.3 Acceptance

A decision MAY be marked Accepted only after approval by the authorized database owner.

Acceptance MUST identify the selected approach and any material conditions.

A decision dependent on unresolved product/system approval MUST remain Proposed.

### 16.4 Implementation

Implementation MUST follow the accepted decision or record a justified deviation for review.

The database implementation architecture and migration artifacts SHOULD be updated to reflect the resulting design.

Database configuration and migration scripts MUST NOT silently override an accepted decision.

### 16.5 Verification

Verification MUST confirm that the implementation satisfies the decision's stated requirements.

Evidence MAY include migration tests, integrity checks, transaction tests, query plans, benchmarks, recovery exercises, or implementation revision references.

Milestone completion MUST follow the applicable authoritative milestone dossier.

### 16.6 Closure

A decision MAY be marked implemented when the required database changes and validation are complete.

The record SHOULD link to the relevant migration revision, configuration change, and verification evidence.

Implementation completion does not prevent a future decision from superseding the choice.

## 17. Relationship to Phases and Milestones

### 17.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This register MUST NOT redefine phase meaning or use phase references to expand milestone scope.

Database decisions MAY reference phases to indicate applicability or expected delivery context.

### 17.2 Canonical Phases

| Phase | Canonical name |
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

These names MUST be used exactly whenever phases are referenced in this register.

### 17.3 Database Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

Database milestone scope and acceptance MUST be taken from the authoritative dossiers under `docs/database/milestones/`.

### 17.4 Cross-Domain Milestone References

Database decisions MAY affect frontend, backend, or cloud implementation milestones.

When a decision affects multiple domains, the record SHOULD identify those dependencies and link to the applicable authoritative dossiers.

This register MUST NOT reproduce frontend, backend, or cloud milestone scope.

Each domain dossier remains authoritative for its own acceptance criteria.

### 17.5 Milestone Traceability

When a database decision is required to deliver a milestone, the relevant milestone dossier SHOULD reference the decision ID.

When implementation reveals that an accepted decision must change, the decision record MUST be reviewed through the defined workflow.

A decision's presence in a milestone dossier does not automatically make it Accepted or implemented.

## 18. Change Control and Supersession

### 18.1 Changes to Accepted Decisions

An accepted decision MUST NOT be silently changed to represent a materially different choice.

A material change MUST create a successor decision or use an explicit review process when the decision's identity and historical meaning remain unchanged.

The record MUST preserve the previous decision and explain the change.

### 18.2 Supersession

A superseding decision MUST:

- Have a new stable ID.
- Reference the decision it supersedes.
- Explain why the earlier choice is no longer appropriate.
- State the replacement choice.
- Identify affected database objects and operational procedures.
- Document migration, compatibility, and recovery implications.
- Link to updated architecture documents and validation evidence.

The previous record MUST remain available for historical traceability.

### 18.3 Rejected Decisions

A rejected decision MUST remain distinguishable from an accepted decision.

The rejection rationale SHOULD be recorded so future proposals can reuse the analysis.

A rejected ID MUST NOT be reused.

### 18.4 Withdrawn Decisions

A decision MAY be withdrawn when its context no longer applies and no direct successor is required.

The withdrawal MUST state why the decision is no longer relevant.

### 18.5 Conflicting Records

If the database implementation architecture conflicts with an accepted database decision, the database owner MUST resolve the inconsistency.

If a database decision conflicts with a product/system decision, the product/system decision remains authoritative until formally changed.

A migration script or copied description in another document MUST NOT override the authoritative decision record.

## 19. Review and Maintenance

### 19.1 Decision Ownership

Every database decision MUST have an accountable owner.

The owner is responsible for status, rationale, references, validation evidence, and review triggers.

The owner SHOULD ensure that the current database architecture reflects accepted decisions without duplicating the complete decision record.

### 19.2 Review Triggers

Database decisions SHOULD be reviewed when:

- Schema boundaries change materially.
- A database engine, extension, or migration-tool change is proposed.
- Transaction or concurrency behavior reveals a correctness issue.
- Row-level security policies or identity-context assumptions change.
- Query performance invalidates prior assumptions.
- Data volume makes partitioning or retention changes necessary.
- Connection pooling causes resource or correctness problems.
- Recovery tests reveal a material weakness.
- A product/system decision changes.
- A milestone dossier identifies a blocker requiring a database architecture change.

### 19.3 Periodic Review

The database decision register SHOULD be reviewed at major database architecture and release checkpoints.

The review SHOULD identify:

- Decisions that remain valid.
- Decisions that need implementation evidence.
- Decisions that should be superseded.
- Proposed decisions that are no longer relevant.
- Database implementation deviations requiring formal review.
- Database concerns that expose a missing product/system decision.

Periodic review MUST NOT become a duplicate review of every table or query.

### 19.4 Decision Quality

A database decision SHOULD be:

- Specific and actionable.
- Narrowly scoped.
- Clear about assumptions.
- Honest about alternatives and trade-offs.
- Verifiable through tests or measurements.
- Traceable to affected database implementation.
- Consistent with product/system and protocol contracts.
- Explicit about migration and recovery implications.

### 19.5 Exceptions

A deviation from an accepted database decision MUST be documented when it materially affects data integrity, security, performance, recovery, or compatibility.

The exception MUST identify the scope, rationale, owner, approval, and review date.

A temporary deviation MUST NOT silently become the permanent database design.

## 20. Database Decision Register Checklist

### 20.1 Ownership

- [ ] Database-specific decisions are recorded here.
- [ ] Product/system decisions link to `docs/planning/DECISIONS.md`.
- [ ] Product/system database role and authority remain in `docs/architecture/DATABASE_ARCHITECTURE.md`.
- [ ] PostgreSQL implementation architecture remains in `docs/database/architecture/DATABASE_ARCHITECTURE.md`.
- [ ] Backend persistence invocation remains in backend implementation documents.
- [ ] Cloud database infrastructure remains in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Application security policy remains in its authoritative security documents.
- [ ] API, event, and artifact contracts remain in their protocol documents.
- [ ] No product-wide decision content has been duplicated.

### 20.2 Record Quality

- [ ] Every accepted decision has a stable ID.
- [ ] Status and date are explicit.
- [ ] Context, decision, rationale, and consequences are recorded.
- [ ] Material alternatives are documented.
- [ ] Affected database objects and operational procedures are identified.
- [ ] Related decisions and architecture documents are linked.
- [ ] Review triggers are defined.
- [ ] Superseded decisions identify their successors.

### 20.3 Implementation and Verification

- [ ] Accepted decisions are reflected in the current database architecture.
- [ ] Migration artifacts are consistent with accepted decisions.
- [ ] Validation criteria are explicit.
- [ ] Evidence links identify relevant tests, migrations, or measurements.
- [ ] Deviations are reviewed.
- [ ] Data integrity and concurrency implications are considered.
- [ ] Security, recovery, and performance implications are considered where applicable.

### 20.4 Phase and Milestone Traceability

- [ ] Phase references use the canonical model in `docs/planning/PHASES.md`.
- [ ] Database milestone identifiers and names use the frozen canonical model.
- [ ] Milestone scope is obtained from authoritative database milestone dossiers.
- [ ] Cross-domain impacts link to relevant domain dossiers.
- [ ] Milestone acceptance criteria are not duplicated in this register.

## 21. Definition of Done

The database decision register is ready for ongoing use when:

1. Its database-only ownership boundary is explicit.
2. Product/system decisions are referenced through `docs/planning/DECISIONS.md`.
3. Database decisions have stable IDs, statuses, owners, and review triggers.
4. Current PostgreSQL implementation architecture remains documented in the appropriate architecture document.
5. Product/system data authority remains documented in its designated system architecture.
6. Backend, cloud, frontend, and application-security decisions are not duplicated here.
7. Decision history and supersession relationships remain traceable.
8. Database milestone scope remains governed by authoritative dossiers.
9. Phase and milestone references use the frozen canonical model.
10. Decisions can be verified without turning this register into a migration runbook or implementation task tracker.

This document owns database-specific architecture decisions only. Product-wide decisions remain owned by `docs/planning/DECISIONS.md`, and all other domain decisions remain in their respective authoritative registers, architecture documents, contracts, and milestone dossiers. All changes MUST preserve this ownership boundary.
