# DB-M01-FOUNDATION — Review Checklist

Milestone: DB-M01-FOUNDATION — PostgreSQL Database Foundation

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

## 7 Test and verification plan

### 7.1 Verification layers

Testing shall follow:

    SQL/schema validation
          |
          v
    Migration tests
          |
          v
    Repository tests
          |
          v
    RLS tests
          |
          v
    Tenant isolation tests
          |
          v
    Integration tests
          |
          v
    CI verification
          |
          v
    Development validation

### 7.2 Clean bootstrap test

Start with an empty PostgreSQL database.

Execute all migrations.

Verify:

- expected schemas exist;
- expected tables exist;
- expected constraints exist;
- expected indexes exist;
- expected RLS policies exist;
- expected roles exist;
- migration history is complete.

### 7.3 Migration upgrade test

Create database at an earlier migration version.

Apply subsequent migrations.

Verify:

- migration order;
- data preservation;
- constraints;
- indexes;
- RLS;
- application compatibility.

### 7.4 Migration failure test

Introduce a controlled migration failure.

Verify:

- migration fails;
- transaction rolls back where supported;
- database is not falsely reported as upgraded;
- CI fails;
- recovery instructions work.

### 7.5 Identity tests

Test:

- create user;
- update user;
- deactivate user;
- create organization;
- create membership;
- suspend membership;
- remove membership;
- assign role;
- reject duplicate membership.

### 7.6 Project tests

Test:

- create project;
- retrieve project;
- update project;
- archive project;
- delete according to policy;
- add member;
- change project role;
- remove member;
- configure settings;
- configure platform binding.

### 7.7 Tenant isolation tests

Test at minimum:

    Organization A
        |
        +--> Project A
        |
        +--> User A

    Organization B
        |
        +--> Project B
        |
        +--> User B

Verify:

- User A can access Project A;
- User A cannot access Project B;
- User B can access Project B;
- User B cannot access Project A;
- organization filtering is enforced;
- repository filtering is enforced;
- RLS independently denies unauthorized access.

### 7.8 RLS negative test

Explicitly test:

- no tenant context;
- incorrect tenant context;
- forged tenant identifier;
- cross-tenant query;
- cross-tenant update;
- cross-tenant delete.

Expected result:

    Unauthorized operation
             |
             v
           DENY

No unauthorized rows may be returned or modified.

### 7.9 Privileged access test

Test approved service/admin behavior.

Verify:

- privileged access is explicit;
- service identity is known;
- administrative actions are auditable;
- privilege cannot be inherited accidentally by normal users.

### 7.10 Audit tests

Verify that significant operations generate audit evidence.

Test:

- user creation;
- membership changes;
- project creation;
- project access changes;
- security-sensitive administrative operations.

Verify:

- actor;
- organization;
- action;
- resource;
- timestamp;
- correlation identifier.

### 7.11 Repository tests

Repositories shall be tested against real PostgreSQL where persistence semantics matter.

Verify:

- CRUD behavior;
- constraints;
- tenant filtering;
- transactions;
- concurrency;
- error mapping.

### 7.12 Concurrency tests

At minimum test:

- simultaneous project creation with same project key;
- simultaneous membership creation;
- simultaneous project update;
- duplicate idempotency key.

Expected result:

- unique constraints remain authoritative;
- one operation succeeds where required;
- conflicts are deterministic;
- no duplicate authoritative records appear.

### 7.13 Security verification

Verify:

- least-privilege roles;
- schema grants;
- table grants;
- sequence/identity access;
- RLS;
- tenant filtering;
- credential isolation;
- audit permissions.

### 7.14 Performance baseline

DB-M01 does not establish final Production database capacity.

It shall establish a baseline for:

- normal project lookup;
- organization lookup;
- membership lookup;
- audit insertion;
- audit search;
- project listing.

Queries should be indexed according to actual access patterns.

### 7.15 Backup compatibility

The foundation shall be compatible with:

- logical backup;
- managed backup;
- point-in-time recovery;
- schema restoration.

A full Production DR test belongs to later milestones, but DB-M01 shall avoid design choices that prevent reliable recovery.

### 7.16 Evidence

Every test result shall retain:

- test name;
- database version;
- migration version;
- environment;
- input;
- expected result;
- actual result;
- pass/fail;
- evidence;
- reviewer.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate that PostgreSQL can be initialized reproducibly and provides secure identity, organization, project, audit, and tenant-isolation foundations.

### 8.2 Step 1 — Start clean database

Create an empty PostgreSQL database.

Expected result:

No application tables exist.

### 8.3 Step 2 — Run migrations

Execute the complete migration chain.

Expected result:

All migrations succeed in deterministic order.

Example command pattern:

    database-migrate up

### 8.4 Step 3 — Verify schema

Display:

- identity;
- organization;
- project;
- audit;
- system schemas.

Expected result:

Expected schemas and tables exist.

### 8.5 Step 4 — Create organization

Create Organization A.

Expected result:

Organization record is persisted.

### 8.6 Step 5 — Create users

Create User A and User B.

Expected result:

Both users exist with correct lifecycle state.

### 8.7 Step 6 — Create membership

Add User A to Organization A.

Expected result:

Membership is created with the correct role.

### 8.8 Step 7 — Create project

Create Project A under Organization A.

Expected result:

Project is persisted with organization ownership.

### 8.9 Step 8 — Add project member

Add User A to Project A.

Expected result:

Project membership is persisted.

### 8.10 Step 9 — Demonstrate tenant isolation

Create Organization B and Project B.

Attempt:

    User A -> Project B

Expected result:

Access is denied.

### 8.11 Step 10 — Demonstrate RLS

Execute the same access through a lower-level database context.

Expected result:

RLS independently prevents cross-tenant access.

### 8.12 Step 11 — Demonstrate audit

Create or modify a project.

Display the resulting audit record.

Expected result:

Audit record contains the actor, organization, action, resource, and timestamp.

### 8.13 Step 12 — Demonstrate migration repeatability

Run migration status.

Expected result:

Database is at the expected migration version and no pending migration exists.

### 8.14 Step 13 — Demonstrate CI

Run the database CI workflow.

Expected result:

Clean PostgreSQL starts, migrations run, tests execute, and the workflow passes.

### 8.15 Demo completion

The demo passes when:

> A clean PostgreSQL database can be created entirely from version-controlled migrations and securely supports identity, organization, project, tenant isolation, RLS, audit, and repository access.

---
