# DB-M01-FOUNDATION — Acceptance Criteria

Milestone: DB-M01-FOUNDATION — PostgreSQL Database Foundation

## 6 Acceptance criteria

### 6.1 PostgreSQL foundation

- [ ] Supported PostgreSQL version is documented.
- [ ] Version is pinned or bounded according to policy.
- [ ] Local PostgreSQL can be initialized.
- [ ] CI PostgreSQL can be initialized.
- [ ] Development PostgreSQL can be initialized.
- [ ] Database naming convention is documented.
- [ ] Schema ownership is documented.
- [ ] Required extensions are explicitly documented.
- [ ] No undocumented extension is required by application code.
- [ ] Database roles are defined.
- [ ] Application privileges are least privilege.
- [ ] Migration privileges are separately controlled.

### 6.2 Migration tooling

- [ ] Migration tool is selected.
- [ ] Migration directory is version controlled.
- [ ] Migration naming convention is documented.
- [ ] Migration ordering is deterministic.
- [ ] Migrations are immutable after shared use.
- [ ] Migration history is recorded.
- [ ] Clean database migration succeeds.
- [ ] Existing database migration succeeds.
- [ ] CI executes migrations automatically.
- [ ] Migration failure fails the CI stage.
- [ ] Migration status can be inspected.
- [ ] Migration recovery procedure is documented.
- [ ] Destructive changes require explicit review.
- [ ] Expand-contract strategy is documented.
- [ ] Migration files are reviewed as source code.

### 6.3 Database conventions

- [ ] Tables use approved naming convention.
- [ ] Columns use approved naming convention.
- [ ] Primary-key convention is consistent.
- [ ] UUIDv7 strategy is documented and implemented consistently.
- [ ] Timestamps use `timestamptz`.
- [ ] UTC is the persistence convention.
- [ ] Created/updated timestamps are consistent.
- [ ] Actor columns follow approved convention.
- [ ] Foreign keys are explicit.
- [ ] Referential actions are explicit.
- [ ] Unique constraints are explicit.
- [ ] Check constraints are used where appropriate.
- [ ] Indexes are based on query patterns.
- [ ] JSONB is bounded to metadata/configuration use cases.
- [ ] Large binary payloads are not stored in PostgreSQL.
- [ ] Sensitive secrets are not stored in normal tables.
- [ ] Soft deletion is not used without a documented domain requirement.

### 6.4 Identity

- [ ] Users table exists.
- [ ] User IDs are unique.
- [ ] User lifecycle is represented.
- [ ] User identity fields have appropriate constraints.
- [ ] Organizations table exists.
- [ ] Organization IDs are unique.
- [ ] Organization lifecycle is represented.
- [ ] Membership table exists.
- [ ] Membership references valid user and organization.
- [ ] Duplicate active membership is prevented.
- [ ] Membership lifecycle is represented.
- [ ] Role model is defined.
- [ ] Role assignment is constrained.
- [ ] Deactivated users cannot be treated as active principals.
- [ ] Identity records do not contain passwords in plaintext.
- [ ] Authentication secrets are handled outside ordinary database metadata where appropriate.

### 6.5 Organization tenancy

- [ ] Organization is the primary tenant boundary.
- [ ] Customer-owned resources include organization ownership directly or through an approved ownership chain.
- [ ] Tenant ownership is queryable.
- [ ] Cross-organization access is testable.
- [ ] Organization membership is required for tenant operations.
- [ ] Tenant context is available to the database layer.
- [ ] Tenant context cannot be silently omitted for protected operations.
- [ ] Administrative/system behavior is explicitly defined.

### 6.6 Projects

The implementation shall align with the approved project schema.

- [ ] `project.projects` exists.
- [ ] Projects reference an organization.
- [ ] Project key is unique within an organization.
- [ ] Project lifecycle supports ACTIVE, ARCHIVED, DELETED as defined.
- [ ] Project metadata is bounded JSONB.
- [ ] Project settings exist.
- [ ] Project members exist.
- [ ] Project members reference organization membership.
- [ ] Project roles support OWNER, ADMIN, MEMBER, VIEWER.
- [ ] Project platform bindings exist.
- [ ] Platform bindings reference the global platform catalog when that catalog is available.
- [ ] Project default-platform behavior supports the approved model.
- [ ] Project member organization consistency is enforced.
- [ ] Project source code is not stored.
- [ ] Project settings do not contain customer source code.
- [ ] Project records are tenant isolated.

### 6.7 RLS baseline

- [ ] RLS strategy is documented.
- [ ] Protected tenant tables have RLS enabled where applicable.
- [ ] Tenant context is explicitly established.
- [ ] Tenant context cannot be derived from untrusted client-supplied identifiers alone.
- [ ] Same-tenant access succeeds.
- [ ] Cross-tenant access fails.
- [ ] Missing tenant context fails safely.
- [ ] Privileged service access is explicitly controlled.
- [ ] Administrative access is auditable.
- [ ] RLS policies are version controlled.
- [ ] RLS policies have automated tests.
- [ ] RLS is treated as defense in depth.
- [ ] Application authorization remains mandatory.

### 6.8 Audit

- [ ] Audit schema exists.
- [ ] Audit records are append-oriented.
- [ ] Audit record contains timestamp.
- [ ] Audit record identifies actor where available.
- [ ] Audit record identifies organization where applicable.
- [ ] Audit record identifies action.
- [ ] Audit record identifies resource.
- [ ] Audit outcome is represented.
- [ ] Request/correlation identifiers can be recorded.
- [ ] Metadata is bounded.
- [ ] Audit indexes support investigation.
- [ ] Normal application roles cannot silently rewrite historical audit records.
- [ ] Audit access is restricted.
- [ ] Audit events can be correlated with API operations.

### 6.9 Idempotency foundation

- [ ] Idempotency storage model is defined.
- [ ] Request key is unique within its intended scope.
- [ ] Request ownership/context is recorded.
- [ ] Stored result/state can be associated with the key.
- [ ] Expiration/retention policy is defined.
- [ ] Duplicate request behavior is deterministic.
- [ ] Idempotency state cannot bypass authorization.
- [ ] Financial/resource operations can later use the foundation.

### 6.10 Transactions

- [ ] Default isolation policy is documented.
- [ ] `READ COMMITTED` is the default unless a stronger level is required.
- [ ] Transaction boundaries are defined by application services.
- [ ] Repository methods do not silently create inappropriate transaction boundaries.
- [ ] Row locking rules are documented.
- [ ] Optimistic concurrency strategy is documented.
- [ ] Cross-domain transaction policy is documented.
- [ ] Transaction rollback is tested.
- [ ] Partial writes are prevented for protected invariants.

### 6.11 Repository interfaces

- [ ] Repository interfaces exist.
- [ ] Application services do not depend directly on SQL implementation details.
- [ ] Repositories enforce tenant filtering.
- [ ] Repository methods have explicit transaction expectations.
- [ ] Repository errors are mapped consistently.
- [ ] Repository tests exist.
- [ ] Database-specific behavior is isolated where practical.

### 6.12 CI and verification

- [ ] Clean PostgreSQL starts in CI.
- [ ] All migrations execute in CI.
- [ ] Schema verification executes.
- [ ] RLS tests execute.
- [ ] Tenant isolation tests execute.
- [ ] Repository integration tests execute.
- [ ] Audit tests execute.
- [ ] Migration failure is detected.
- [ ] CI reports database test failures clearly.

### 6.13 Security

- [ ] Database is not exposed unnecessarily.
- [ ] Application credentials have minimum privileges.
- [ ] Migration credentials are controlled.
- [ ] Administrative credentials are separate.
- [ ] Database secrets are not committed.
- [ ] Database secrets are not logged.
- [ ] Service identities are environment-specific.
- [ ] Production credentials cannot be used in Development.
- [ ] RLS negative tests pass.
- [ ] Tenant isolation tests pass.

### 6.14 Documentation

- [ ] Database conventions are documented.
- [ ] Migration guide exists.
- [ ] Identity schema is documented.
- [ ] Project schema is documented.
- [ ] RLS behavior is documented.
- [ ] Audit schema is documented.
- [ ] Repository conventions are documented.
- [ ] Local setup is documented.
- [ ] CI database setup is documented.
- [ ] Recovery procedures are documented.

### 6.15 No-go conditions

DB-M01 shall not be accepted if:

- [ ] clean database bootstrap fails;
- [ ] migration ordering is nondeterministic;
- [ ] tenant isolation can be bypassed;
- [ ] RLS policies are untested;
- [ ] project ownership can cross organization boundaries;
- [ ] audit records can be silently modified by ordinary application roles;
- [ ] database credentials are exposed;
- [ ] source code can enter the project database through normal APIs;
- [ ] migration history cannot be reproduced;
- [ ] CI does not validate the database foundation.

---
