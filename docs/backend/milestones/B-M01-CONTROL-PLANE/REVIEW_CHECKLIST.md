# B-M01-CONTROL-PLANE — Review Checklist

Milestone: B-M01 — Control Plane

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7 Test and Verification Plan

## 7.1 Verification Pyramid

    Static Analysis
          |
          v
       Unit Tests
          |
          v
    Repository Tests
          |
          v
    API Contract Tests
          |
          v
    Integration Tests
          |
          v
    Security Tests
          |
          v
       E2E Tests
          |
          v
    Architecture Review
          |
          v
    Milestone Acceptance

## 7.2 Unit Tests

Unit-test:

- authorization policies;
- organization rules;
- membership rules;
- project rules;
- platform catalog rules;
- lifecycle validation;
- API error mapping;
- idempotency behavior;
- audit event creation.

## 7.3 Repository Tests

Verify:

- create;
- read;
- update;
- list;
- archive;
- tenant filtering;
- uniqueness;
- foreign-key integrity;
- transaction rollback.

## 7.4 API Tests

Verify:

    POST /api/v1/organizations
    GET  /api/v1/organizations
    GET  /api/v1/me
    POST /api/v1/projects
    GET  /api/v1/projects
    GET  /api/v1/projects/:id
    PATCH /api/v1/projects/:id
    POST /api/v1/projects/:id/archive
    GET  /api/v1/platforms
    GET  /api/v1/platforms/:id
    GET  /api/v1/platforms/:id/versions

Exact endpoint naming may be adjusted during API contract review, but the
resource responsibilities must remain stable.

## 7.5 Authorization Tests

Matrix:

| Actor | Organization | Project | Platform Admin | Expected |
|---|---|---|---|---|
| ORG_OWNER | Own | Own | No | Allowed for org/project |
| ORG_ADMIN | Own | Own | No | Allowed for org/project |
| ORG_MEMBER | Own | Member | No | Limited |
| ORG_VIEWER | Own | Viewer | No | Read-only |
| External user | Other | Other | No | Denied |
| PLATFORM_ADMIN | Global | N/A | Yes | Catalog admin |
| SUPPORT_AGENT | Scoped | Scoped | No | Policy-dependent |

Every matrix decision must be covered by tests.

## 7.6 Tenant Isolation Tests

Create:

    Organization A
        |
        +--> Project A

    Organization B
        |
        +--> Project B

Verify:

- A cannot read B;
- A cannot modify B;
- A cannot archive B;
- B cannot read A;
- B cannot modify A.

## 7.7 Database Tests

Test:

- migration from empty database;
- migration from previous version;
- rollback where supported;
- constraints;
- indexes;
- uniqueness;
- foreign keys;
- transaction rollback;
- concurrent access.

## 7.8 Audit Tests

For each auditable operation:

    API Request
        |
        v
    Domain Operation
        |
        v
    Audit Event

Verify the audit record contains sufficient evidence to reconstruct the
operation without relying on application logs.

## 7.9 Idempotency Tests

Submit the same request twice with the same key.

Expected:

- one logical operation;
- stable response behavior;
- no duplicate project;
- no duplicate organization where applicable.

Submit same business request with a different key.

Expected:

- normal duplicate/business conflict behavior as defined by resource rules.

## 7.10 Failure Tests

Inject:

- database unavailable;
- invalid credentials;
- authorization failure;
- malformed request;
- duplicate key;
- timeout;
- transaction rollback;
- unexpected internal error.

Expected:

- safe error;
- no sensitive leakage;
- request ID available;
- durable state remains consistent.

## 7.11 Performance Baseline

Initial target for normal development-scale workloads:

| Operation | Target |
|---|---:|
| Health endpoint p95 | <100 ms |
| Authenticated simple GET p95 | <300 ms |
| Project list p95 | <500 ms |
| Project create p95 | <500 ms |
| Platform catalog read p95 | <500 ms |
| Authorization decision overhead | <50 ms target |
| Database transaction baseline | measured |

Targets must be validated using representative data rather than empty
databases only.

## 7.12 Architecture Verification

Architect verifies:

- dependency direction;
- domain boundaries;
- repository boundaries;
- transaction ownership;
- API versioning;
- tenant enforcement;
- future extensibility;
- absence of premature microservices;
- absence of business logic in controllers.

## 7.13 Coding-Agent Policy Tests

Verify:

- default policy response;
- versioned update with `If-Match` and conflict on a stale version;
- non-administrator denial;
- cross-tenant denial;
- rejection of content fields and `require_consent: false`;
- audit event content.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate that a user can authenticate, resolve an organization, create and
manage a project, consume the authoritative platform catalog, and produce an
auditable server-side operation.

## 8.2 Preparation

- [ ] Control Plane running.
- [ ] PostgreSQL running.
- [ ] Migrations applied.
- [ ] Seed organization available.
- [ ] Seed user available.
- [ ] Seed platform catalog available.

## 8.3 Step 1 — Health

Request:

    GET /health

Expected:

    service = healthy

Request:

    GET /ready

Expected:

    database = ready
    required dependencies = ready

## 8.4 Step 2 — Authenticate

Authenticate a valid user.

Expected:

- authenticated principal established;
- user identity resolved;
- organization memberships available.

## 8.5 Step 3 — Current User

Request:

    GET /api/v1/me

Expected:

- user ID;
- user status;
- organization memberships;
- effective roles.

## 8.6 Step 4 — Organizations

Request organizations for the authenticated user.

Expected:

    Organization: Kritva Research
    Role: ORG_OWNER

Only authorized organizations are returned.

## 8.7 Step 5 — Create Project

Create:

    Name: Vision Demo
    Key: vision-demo

Expected:

    Project created
    Organization: Kritva Research
    Status: ACTIVE

No source code is uploaded.

## 8.8 Step 6 — List Projects

Request project list.

Expected:

    Vision Demo
    vision-demo
    ACTIVE

The list is organization-scoped.

## 8.9 Step 7 — Platform Catalog

Request:

    GET /api/v1/platforms

Expected:

    Kritva Reference Robot
    Platform Version
    Architecture
    Runtime
    SDK
    Capabilities

The Studio receives catalog data from the backend rather than hard-coded
platform definitions.

## 8.10 Step 8 — Authorization Test

Attempt to access another organization's Project.

Expected:

    FORBIDDEN

or policy-equivalent resource-not-found behavior.

No unauthorized metadata is leaked.

## 8.11 Step 9 — Audit

Inspect audit records.

Expected events include:

    user authentication
    project.created
    project access/administrative action where configured

Each event contains:

- actor;
- resource;
- organization;
- timestamp;
- request ID;
- outcome.

## 8.12 Step 10 — Failure

Submit malformed Project request.

Expected:

- structured validation error;
- request ID;
- no Project created;
- no misleading success audit event.

## 8.13 Demo Success Criteria

The demo passes when:

- authentication works;
- organization context works;
- authorization works;
- project creation works;
- platform catalog works;
- tenant isolation works;
- audit foundation works;
- failure handling works.

---
