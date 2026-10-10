# DB-M02-CORE-DATA — Review Checklist

Milestone: DB-M02-CORE-DATA — Platforms, Resources, Artifacts and Storage Metadata

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

### 7.1 Verification model

Testing shall follow:

    Migration
       |
       v
    Schema
       |
       v
    Constraints
       |
       v
    Repository
       |
       v
    RLS
       |
       v
    Query Performance
       |
       v
    Storage Consistency
       |
       v
    Retention
       |
       v
    Integration

### 7.2 Platform tests

Test:

- create platform;
- version platform;
- retire version;
- add architecture;
- add capability;
- bind capability;
- create configuration;
- deprecate configuration;
- retrieve historical version.

### 7.3 Resource tests

Test:

- create lab;
- create robot;
- create resource;
- associate robot/resource;
- transition resource state;
- create maintenance;
- create availability;
- retire resource.

### 7.4 Constraint tests

Verify:

- invalid platform references fail;
- invalid architecture references fail;
- invalid capability references fail;
- invalid robot/resource references fail;
- invalid lifecycle transitions fail where enforced;
- duplicate keys fail;
- invalid time ranges fail.

### 7.5 Artifact tests

Test:

- create build;
- create artifact;
- create version;
- register storage object;
- validate artifact;
- record signature;
- record compatibility;
- revoke artifact;
- expire artifact.

### 7.6 Storage consistency tests

Test:

    Database Object Metadata
            |
            v
       Object Exists
            |
       +----+----+
       |         |
      YES        NO
       |         |
       v         v
    AVAILABLE  MISSING

Verify:

- existing object is AVAILABLE;
- missing object becomes MISSING/UNAVAILABLE;
- checksum mismatch is detected;
- deletion updates metadata only after confirmed deletion.

### 7.7 Retention tests

Create objects at different lifecycle states.

Verify:

- active objects are retained;
- protected objects are retained;
- expired objects become eligible;
- purge executes once;
- failed purge remains retryable;
- successful purge updates metadata;
- audit record exists.

### 7.8 RLS tests

Test:

- organization A artifact;
- organization B artifact;
- User A access;
- User B access;
- administrator access;
- missing tenant context;
- forged tenant context.

### 7.9 Query performance tests

Measure representative queries:

1. active platform discovery;
2. platform version lookup;
3. capability filtering;
4. resource availability metadata;
5. artifact list by project;
6. artifact lookup by digest;
7. latest artifact version;
8. retention-eligible objects;
9. storage object lookup;
10. compatibility lookup.

Use `EXPLAIN`/`EXPLAIN ANALYZE` during qualification.

### 7.10 Index verification

For important queries:

- verify index selection;
- verify selectivity;
- verify no unnecessary sequential scan under expected dataset;
- verify write overhead remains reasonable;
- document accepted exceptions.

### 7.11 Migration tests

Verify:

- clean migration;
- upgrade migration;
- rollback/recovery strategy;
- schema version;
- constraints;
- indexes;
- RLS.

### 7.12 Integration tests

Validate:

    Project
       |
       v
    Artifact
       |
       v
    Platform Version
       |
       v
    Architecture
       |
       v
    Capabilities
       |
       v
    Storage Object
       |
       v
    Compatibility

### 7.13 Reconciliation tests

Simulate:

- database metadata with missing object;
- object without metadata;
- checksum mismatch;
- stale storage state;
- duplicate object reference.

Expected result:

- inconsistency is detectable;
- reconciliation produces deterministic outcome;
- no silent data loss occurs.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate that the core RaaS catalog and artifact metadata model can support platform discovery, resource identification, artifact registration, storage metadata, compatibility, and retention.

### 8.2 Step 1 — Create platform

Create a simulated Kritva platform.

Expected result:

Platform exists in the global catalog.

### 8.3 Step 2 — Create platform version

Add a platform version with:

- architecture;
- KritvaOS version;
- runtime;
- SDK.

Expected result:

Version is queryable and uniquely identified.

### 8.4 Step 3 — Add capabilities

Associate:

- camera;
- IMU;
- motor control;
- EtherCAT.

Expected result:

Platform capability query returns the expected capabilities.

### 8.5 Step 4 — Create configuration

Create a supported platform configuration.

Expected result:

Configuration is active and references the correct platform version.

### 8.6 Step 5 — Create Lab

Create a Development/Staging lab.

Expected result:

Lab is registered.

### 8.7 Step 6 — Create robot and resource

Create a robot and its allocatable resource.

Expected result:

Robot identity and resource identity remain distinct.

### 8.8 Step 7 — Create artifact

Register an artifact associated with a project.

Expected result:

Artifact metadata is stored without source code.

### 8.9 Step 8 — Register storage object

Register the `.krv` payload in object storage.

Expected result:

Database contains object metadata and checksum.

### 8.10 Step 9 — Validate artifact

Record:

- validation;
- signature;
- platform target;
- architecture;
- SDK;
- runtime.

Expected result:

Artifact becomes eligible for compatibility evaluation.

### 8.11 Step 10 — Compatibility query

Query:

    Artifact
       |
       v
    Platform Version
       |
       +--> Architecture
       +--> Runtime
       +--> SDK
       +--> Capabilities

Expected result:

Compatibility metadata supports the execution decision.

### 8.12 Step 11 — Demonstrate tenant isolation

Create artifacts in two organizations.

Expected result:

Each organization can access only its own artifact metadata.

### 8.13 Step 12 — Demonstrate retention

Mark an artifact as retention-due.

Expected result:

The retention workflow identifies it for purge without immediately deleting active data.

### 8.14 Step 13 — Demonstrate reconciliation

Simulate a missing object.

Expected result:

Database/object inconsistency is detected and represented.

### 8.15 Demo completion

The demo passes when:

> Platform, resource, artifact, storage, compatibility, tenant, and retention metadata can be managed consistently through PostgreSQL without storing customer source code or large binary payloads in the database.

---
