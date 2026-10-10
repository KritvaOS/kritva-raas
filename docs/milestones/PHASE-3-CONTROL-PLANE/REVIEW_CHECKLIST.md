# PHASE-3-CONTROL-PLANE — Review Checklist

Milestone: PHASE-3-CONTROL-PLANE — Identity, Projects, Platforms and Artifacts

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

### 7.1 Test architecture

    Unit
      |
      v
    Repository
      |
      v
    Service
      |
      v
    API
      |
      v
    Integration
      |
      v
    Security
      |
      v
    Studio E2E
      |
      v
    Demo-0

### 7.2 Identity tests

Test:

- valid user;
- invalid user;
- suspended user;
- removed membership;
- active membership;
- multiple organizations;
- role resolution.

### 7.3 Organization tests

Verify:

    User A -> Org A = ALLOWED
    User A -> Org B = DENIED

Test organization switching and cached-context invalidation.

### 7.4 Project tests

Test:

- create;
- duplicate key;
- get;
- list;
- update;
- archive;
- unauthorized update;
- cross-tenant access;
- membership roles.

### 7.5 Platform tests

Test:

- active platform;
- deprecated platform;
- retired platform;
- version lookup;
- capability lookup;
- configuration lookup;
- incompatible architecture.

### 7.6 Artifact tests

Test:

- registration;
- duplicate version;
- digest mismatch;
- missing storage object;
- signature failure;
- compatibility failure;
- lifecycle transition;
- retention metadata.

### 7.7 Object-storage consistency tests

Test:

    Database
        |
        v
    Storage Upload
        |
        v
    Metadata Finalization

Simulate:

- database failure;
- storage failure;
- network timeout;
- duplicate upload.

Verify reconciliation can identify inconsistencies.

### 7.8 Authorization tests

For each protected endpoint test:

    allowed principal
    denied principal
    wrong organization
    wrong project
    wrong role
    unauthenticated request

### 7.9 API contract tests

Validate:

- request envelope;
- response envelope;
- errors;
- pagination;
- filtering;
- versioning.

### 7.10 Database tests

Verify:

- migrations;
- constraints;
- indexes;
- transactions;
- tenant filtering;
- lifecycle data;
- artifact immutability.

### 7.11 Integration test

Execute:

    Authenticate
       |
       v
    Organization
       |
       v
    Project
       |
       v
    Platform
       |
       v
    Artifact
       |
       v
    Object Storage
       |
       v
    Audit

### 7.12 Demo-0 test

Execute exactly the production-oriented path:

    Studio
      |
      v
    Control Plane
      |
      +--> PostgreSQL
      |
      +--> Object Storage
      |
      v
    Artifact Registry

No mock project, platform or artifact persistence is permitted.

### 7.13 Performance baseline

Initial targets:

| Operation | Initial target |
|---|---:|
| Health | p95 < 200 ms |
| Read API | p95 < 500 ms |
| Write API | p95 < 750 ms |
| Project create | p95 < 1 s excluding dependencies |
| Platform query | p95 < 500 ms |
| Artifact metadata query | p95 < 500 ms |
| Artifact registration | p95 < 750 ms excluding upload |
| Authorization decision | p95 < 100 ms where locally evaluated |

Targets are baseline values and shall be refined during staging.

### 7.14 Security verification

Verify:

- authentication;
- authorization;
- tenant isolation;
- artifact access;
- source privacy;
- secret handling;
- audit;
- dependency scanning;
- injection resistance.

### 7.15 Evidence

Required evidence:

- CI run;
- database migration run;
- API test report;
- security test report;
- tenant-isolation test;
- artifact integration test;
- Studio E2E;
- Demo-0 recording/evidence;
- architecture review;
- security review.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate the first real Kritva RaaS Control Plane integrated with Studio, PostgreSQL and object storage.

### 8.2 Step 1 — Start infrastructure

Start:

- PostgreSQL;
- object storage;
- Control Plane;
- Studio.

Expected:

    PostgreSQL = READY
    Object Storage = READY
    Control Plane = READY
    Studio = READY

### 8.3 Step 2 — Login

Open Studio.

Authenticate.

Expected:

    User = Authenticated
    Session = Active

### 8.4 Step 3 — Select organization

Select:

    Kritva Demo Organization

Expected:

Organization context becomes active.

### 8.5 Step 4 — Create project

Create:

    Name: Demo Robot Application
    Key: DEMO-ROBOT

Expected:

Project appears in PostgreSQL and Studio.

### 8.6 Step 5 — Select platform

Open platform catalog.

Select:

    Platform
      -> Version
      -> Architecture
      -> KritvaOS
      -> SDK

Expected:

Selected platform is stored as project metadata.

### 8.7 Step 6 — Build locally

Invoke Phase 2 local build.

Expected:

No source is sent to Control Plane.

### 8.8 Step 7 — Generate artifact

Generate:

    demo-robot-1.0.0.krv

Expected:

Artifact passes local validation.

### 8.9 Step 8 — Upload

Upload artifact.

Expected:

    Studio
      |
      | .krv + metadata
      v
    Control Plane
      |
      v
    Object Storage
      |
      v
    PostgreSQL Metadata

### 8.10 Step 9 — Validate registry

Open Artifacts.

Expected:

- artifact ID;
- project;
- organization;
- version;
- platform;
- architecture;
- digest;
- validation;
- signature;
- status.

### 8.11 Step 10 — Database verification

Query PostgreSQL.

Expected:

Artifact metadata exists.

No source files exist.

### 8.12 Step 11 — Tenant-isolation demonstration

Authenticate as another organization.

Attempt to retrieve Demo artifact.

Expected:

    FORBIDDEN / NOT_FOUND
    according to information-disclosure policy

### 8.13 Step 12 — Audit demonstration

Show audit records.

Expected:

- project creation;
- artifact registration;
- artifact upload;
- validation.

### 8.14 Step 13 — Failure demonstration

Upload an incompatible artifact.

Expected:

    VALIDATION = FAILED
    APPROVAL = BLOCKED

### 8.15 Step 14 — Demo-0 completion

Demo-0 is complete when:

    Login
      -> Organization
      -> Project
      -> Platform
      -> Local Build
      -> .krv
      -> Upload
      -> Registry
      -> Authorized Query

passes with real persistent state.

---
