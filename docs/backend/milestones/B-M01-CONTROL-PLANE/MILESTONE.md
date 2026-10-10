# B-M01 — Control Plane

## Milestone Dossier

**Milestone ID:** B-M01-CONTROL-PLANE  
**Product:** Kritva RaaS  
**Primary Phase:** P3 CONTROL PLANE  
**Supporting Phase:** P0 FOUNDATION  
**Primary Surface:** RaaS Control Plane / Backend  
**Technology:** TypeScript/Node.js backend, PostgreSQL, REST API v1  
**Architecture:** Production-oriented Modular Monolith  
**Priority:** PRI-0 (critical invariant per Priority Matrix; see `docs/planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** Establish the authoritative Control Plane foundation for identity,
organizations, authorization, projects, platform catalog, repositories, API v1,
and auditability.

---

# 1 Objective

## 1.1 Milestone Objective

B-M01 establishes the first production-grade backend Control Plane for Kritva RaaS.

The milestone creates the authoritative server-side foundation required by the
Studio, Web Console, later booking, credits, execution, lab, results and
commercial services.

The Control Plane is responsible for authoritative business state.

The initial dependency direction is:

    RaaS Studio
          |
          | HTTPS REST API v1
          v
    +-----------------------+
    |     Control Plane     |
    |                       |
    | API / Transport       |
    | Authentication        |
    | Authorization         |
    | Application Services  |
    | Domain Modules        |
    | Repositories          |
    | Infrastructure        |
    +-----------+-----------+
                |
        +-------+-------+
        |               |
        v               v
    PostgreSQL       Audit
        |
        +--> Organizations
        +--> Users
        +--> Memberships
        +--> Projects
        +--> Platforms
        +--> Versions
        +--> Capabilities

B-M01 deliberately establishes the reusable backend foundation rather than
implementing the complete RaaS product.

## 1.2 Product Goal

B-M01 enables the following minimum server-side flow:

    Authenticate User
          |
          v
    Resolve Organization
          |
          v
    Authorize Operation
          |
          v
    Create Project
          |
          v
    Select Platform
          |
          v
    Read Authoritative Catalog
          |
          v
    Record Audit Event

This becomes the foundation for:

    Project
       |
       v
    Artifact
       |
       v
    Booking
       |
       v
    Job
       |
       v
    Run
       |
       v
    Result

## 1.3 Architectural Objective

The Control Plane shall be:

- authoritative;
- tenant-aware;
- provider-neutral;
- API-first;
- repository-based;
- transactionally correct;
- auditable;
- testable;
- extensible;
- horizontally scalable at the application layer;
- independent of physical robot safety authority.

The Control Plane must not become responsible for hard real-time robot control.

## 1.4 API Objective

B-M01 establishes:

    /api/v1

with:

- versioned request/response contracts;
- consistent error model;
- request IDs;
- correlation IDs;
- authentication;
- authorization;
- tenant context;
- pagination;
- validation;
- idempotency foundation;
- audit hooks.

## 1.5 Identity Objective

Identity foundation must support:

- human users;
- organization membership;
- organization roles;
- project roles;
- service identities where required by later phases;
- authenticated request context.

Authentication establishes who the caller is.

Authorization establishes what the caller may do.

These responsibilities must remain distinct.

## 1.6 Organization Objective

Organization is the primary customer tenant boundary.

Conceptually:

    Organization
       |
       +--> Users / Memberships
       |
       +--> Projects
       |
       +--> Bookings
       |
       +--> Credits
       |
       +--> Jobs
       |
       +--> Runs
       |
       +--> Results

B-M01 establishes the organization boundary even though later domains are
implemented in subsequent milestones.

## 1.7 Project Objective

Projects are organization-owned logical development units.

A Project contains metadata and configuration references.

A Project does not contain customer source code in the Control Plane.

The local workspace remains on the developer machine.

## 1.8 Platform Objective

B-M01 establishes the authoritative platform catalog consumed by Studio.

The hierarchy is:

    Platform
       |
       v
    Platform Version
       |
       v
    Architecture
       |
       v
    KritvaOS Version / Runtime
       |
       v
    SDK Version
       |
       v
    Capabilities
       |
       v
    Configuration

The UI must not hard-code platform definitions.

## 1.9 Repository Objective

Repositories provide domain persistence boundaries.

Initial repository interfaces include:

- UserRepository;
- OrganizationRepository;
- MembershipRepository;
- ProjectRepository;
- PlatformRepository;
- AuditRepository;
- IdempotencyRepository.

The application layer owns business transactions.

Repositories do not contain presentation logic.

## 1.10 Audit Objective

B-M01 establishes audit foundations for security-sensitive and business-significant
operations.

Initial auditable actions include:

- authentication events;
- organization membership changes;
- project creation/update/archive;
- platform administration;
- authorization-sensitive actions;
- administrative changes.

Audit records are evidence and must not be treated as ordinary application logs.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M01 includes:

- backend repository structure;
- application bootstrap;
- configuration;
- API v1;
- request validation;
- response contracts;
- error handling;
- request correlation;
- authentication foundation;
- user identity;
- organizations;
- organization membership;
- organization roles;
- project APIs;
- project authorization;
- platform catalog;
- platform versions;
- architectures;
- capabilities;
- platform configurations;
- repository interfaces;
- PostgreSQL integration;
- migrations;
- transactions;
- idempotency foundation;
- audit foundation;
- structured logging foundation;
- health/readiness endpoints;
- unit tests;
- repository tests;
- API tests;
- authorization tests;
- tenant-isolation tests.

## 2.2 Explicitly Out of Scope

B-M01 does not implement:

- artifact packaging;
- local build;
- `.krv` generation;
- booking;
- credit wallets;
- billing;
- payments;
- Job orchestration;
- Run orchestration;
- Lab Agent protocol;
- robot execution;
- WebRTC;
- telemetry streaming;
- result processing;
- experiment comparison;
- physical robot control;
- physical E-stop;
- production payment provider integration;
- advanced analytics.

## 2.3 Authentication Boundary

B-M01 establishes the authentication contract and backend identity model.

A production external IdP integration may be delivered incrementally.

The backend must not couple the domain model to one identity provider.

## 2.4 Authorization Boundary

Authorization uses the previously established hybrid model:

    RBAC + ABAC

RBAC determines baseline permissions.

ABAC evaluates:

- principal;
- resource;
- organization;
- project;
- request;
- operational context.

## 2.5 Tenant Boundary

Every organization-owned resource must be scoped to its organization.

The backend must never rely only on a frontend-provided organization ID.

The organization context must be derived from authenticated identity and validated
against the requested resource.

## 2.6 Source Privacy Boundary

Project APIs accept metadata only.

Example:

    {
        "name": "Vision Demo",
        "project_key": "vision-demo",
        "description": "Reference vision application"
    }

They must not accept:

- source archives;
- Git repositories;
- compiler inputs;
- local workspace paths for server storage;
- credentials;
- arbitrary source blobs.

---

# 3 Dependencies

## 3.1 Internal Dependencies

| Dependency | Purpose | Status |
|---|---|---|
| Database architecture | Persistence rules | Defined |
| Projects schema | Project persistence | Defined |
| Platforms schema | Platform catalog | Defined |
| Authentication design | Identity | Defined |
| Authorization design | Access control | Defined |
| Audit logging design | Audit | Defined |
| Development setup | Local environment | Defined |
| Development workflow | Engineering process | Defined |
| Integration plan | Cross-boundary integration | Defined |
| API protocol baseline | API envelope | Defined |

## 3.2 Upstream Milestones

B-M01 depends on:

- P0 FOUNDATION repository foundation;
- development environment;
- CI foundation;
- PostgreSQL migration framework;
- test framework;
- configuration framework.

## 3.3 Downstream Consumers

B-M01 is consumed by:

- F-M01 Studio Foundation;
- F-M02 Projects;
- F-M03 Build & Artifact;
- F-M04 Booking;
- F-M05 Execution;
- F-M06 Live;
- F-M07 Results;
- booking services;
- credit services;
- execution services;
- lab services;
- results services;
- Web Console;
- Admin Console.

## 3.4 Database Dependencies

B-M01 depends on:

- PostgreSQL;
- UUIDv7-compatible identifier generation;
- `timestamptz`;
- JSONB where explicitly justified;
- transaction support;
- migration tooling;
- required extensions such as range/GIST support where later booking
  schemas require them.

B-M01 must not introduce database coupling that prevents later domain modules
from using the same PostgreSQL architecture.

---

# 4 Deliverables

## 4.1 Control Plane Application

Deliver:

- backend application bootstrap;
- dependency injection/composition root;
- configuration;
- HTTP transport;
- middleware;
- authentication middleware;
- authorization middleware;
- request context;
- error handling;
- structured logging;
- health/readiness.

## 4.2 API v1

Baseline:

    /api/v1

Initial resource families:

    /api/v1/me
    /api/v1/organizations
    /api/v1/projects
    /api/v1/platforms

Administrative platform endpoints may be separately scoped under:

    /api/v1/admin/platforms

depending on authorization architecture.

## 4.3 API Envelope

Request context should support:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T20:00:00Z",
        "command": "project.create",
        "actor": {
            "type": "user",
            "id": "user-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": null
        },
        "payload": {}
    }

The HTTP resource API may use conventional REST resource bodies while retaining
the same protocol principles.

## 4.4 Response Contract

Conceptual response:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T20:00:01Z",
        "status": "SUCCESS",
        "code": "PROJECT_CREATED",
        "message": "Project created",
        "data": {},
        "error": null
    }

Error response:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T20:00:01Z",
        "status": "FAILED",
        "code": "FORBIDDEN",
        "message": "Operation is not authorized",
        "data": null,
        "error": {
            "type": "AUTHORIZATION_ERROR",
            "details": {}
        }
    }

## 4.5 Identity Deliverables

- User model;
- authenticated principal;
- membership model;
- role model;
- organization membership APIs;
- current-user endpoint;
- session/token validation abstraction.

## 4.6 Organization Deliverables

- Organization model;
- organization repository;
- membership repository;
- organization service;
- membership service;
- organization APIs;
- tenant context resolution.

## 4.7 Project Deliverables

- Project repository;
- Project service;
- project CRUD where permitted;
- archive behavior;
- project membership foundation;
- project platform binding foundation;
- project authorization.

## 4.8 Platform Deliverables

- Platform catalog;
- platform versions;
- architectures;
- capabilities;
- platform-version capability relationships;
- platform configurations;
- catalog query APIs;
- administrative mutation boundary.

## 4.9 Audit Deliverables

Audit foundation shall support:

- event type;
- actor;
- organization;
- resource;
- action;
- timestamp;
- request ID;
- correlation ID;
- outcome;
- metadata;
- source/IP metadata where policy permits.

## 4.10 Repository Deliverables

Repository interfaces shall be explicit.

Example:

    interface ProjectRepository {
        getById(projectId): Promise<Project | null>
        listByOrganization(organizationId, query): Promise<ProjectPage>
        create(project): Promise<Project>
        update(projectId, changes): Promise<Project>
        archive(projectId): Promise<void>
    }

Concrete implementations remain infrastructure concerns.

---

# 9 Risks

## 9.1 R-BM01-001 — Control Plane Becomes a God Module

**Risk:** All business logic accumulates in one backend module.

**Impact:** High.

**Mitigation:**

- modular monolith;
- domain boundaries;
- application services;
- repository interfaces;
- dependency rules;
- architecture review.

## 9.2 R-BM01-002 — Tenant Isolation Failure

**Risk:** One organization accesses another organization's data.

**Impact:** Critical.

**Mitigation:**

- mandatory tenant context;
- repository filtering;
- service authorization;
- database constraints;
- isolation tests;
- security review.

## 9.3 R-BM01-003 — Authentication Coupling

**Risk:** Domain model becomes coupled to one IdP.

**Impact:** Medium.

**Mitigation:**

- authentication adapter;
- internal principal model;
- provider-neutral identity interfaces.

## 9.4 R-BM01-004 — Authorization Bypass

**Risk:** A route performs an operation without policy enforcement.

**Impact:** Critical.

**Mitigation:**

- centralized policy model;
- authorization at API/application/domain boundaries;
- negative tests;
- deny-by-default.

## 9.5 R-BM01-005 — Project Source Leakage

**Risk:** Project API starts accepting source files or local workspace data.

**Impact:** Critical.

**Mitigation:**

- metadata-only Project API;
- schema validation;
- source privacy tests;
- explicit source-code boundary.

## 9.6 R-BM01-006 — Platform Catalog Drift

**Risk:** Frontend and backend use different platform definitions.

**Impact:** High.

**Mitigation:**

- backend authoritative catalog;
- contract tests;
- versioned catalog;
- frontend does not hard-code catalog.

## 9.7 R-BM01-007 — Repository Leakage of Business Logic

**Risk:** Business rules become embedded in persistence implementation.

**Impact:** Medium.

**Mitigation:**

- domain/application ownership;
- repository contract review;
- unit tests independent of database.

## 9.8 R-BM01-008 — Weak Audit Evidence

**Risk:** Security-sensitive operations cannot be reconstructed.

**Impact:** High.

**Mitigation:**

- structured audit schema;
- request/correlation IDs;
- actor/resource/outcome;
- append-oriented storage;
- audit verification tests.

## 9.9 R-BM01-009 — API Contract Instability

**Risk:** Studio and backend repeatedly break compatibility.

**Impact:** High.

**Mitigation:**

- API v1;
- protocol-first contracts;
- contract tests;
- explicit breaking-change policy.

## 9.10 R-BM01-010 — Premature Microservices

**Risk:** Early decomposition creates operational complexity.

**Impact:** Medium.

**Mitigation:**

- modular monolith;
- explicit module boundaries;
- extraction only when measured need exists.

## 9.11 R-BM01-011 — Database Coupling

**Risk:** Application depends on undocumented database behavior.

**Impact:** Medium.

**Mitigation:**

- repository abstraction;
- migration ownership;
- schema documentation;
- database integration tests.

## 9.12 R-BM01-012 — Incorrect Transaction Boundaries

**Risk:** Multi-step operations leave partial state.

**Impact:** High.

**Mitigation:**

- application-service transactions;
- atomicity tests;
- explicit transaction policy.

## 9.13 R-BM01-013 — Missing Idempotency

**Risk:** Retries create duplicate resources.

**Impact:** High.

**Mitigation:**

- reusable idempotency abstraction;
- request keys;
- unique constraints;
- retry tests.

## 9.14 R-BM01-014 — Audit/Business State Divergence

**Risk:** Business operation succeeds while required audit event is lost.

**Impact:** High.

**Mitigation:**

- transactional audit strategy where required;
- outbox evolution;
- reconciliation;
- acceptance tests.

## 9.15 R-BM01-015 — Overly Broad API

**Risk:** B-M01 absorbs booking, execution or commercial behavior.

**Impact:** Medium.

**Mitigation:**

- strict scope;
- task review;
- change tracking;
- milestone acceptance.

---

# 10 Exit Criteria

## 10.1 Functional Exit

- [ ] Control Plane starts.
- [ ] API v1 is available.
- [ ] Authentication foundation works.
- [ ] Current-user endpoint works.
- [ ] Organizations work.
- [ ] Memberships work.
- [ ] Authorization works.
- [ ] Projects work.
- [ ] Platform catalog works.
- [ ] Repositories work.
- [ ] Audit foundation works.
- [ ] Idempotency foundation works.

## 10.2 Database Exit

- [ ] Migrations are version controlled.
- [ ] Fresh database setup works.
- [ ] Existing migration path works.
- [ ] Constraints are validated.
- [ ] Indexes are validated.
- [ ] Tenant ownership constraints are validated.
- [ ] Transaction behavior is tested.

## 10.3 Security Exit

- [ ] Authentication review complete.
- [ ] Authorization review complete.
- [ ] Tenant isolation review complete.
- [ ] Source privacy boundary verified.
- [ ] Secret handling verified.
- [ ] Sensitive logging reviewed.
- [ ] Administrative authorization reviewed.

## 10.4 API Exit

- [ ] API v1 contracts reviewed.
- [ ] Error model reviewed.
- [ ] Request ID propagation verified.
- [ ] Pagination conventions established.
- [ ] Validation conventions established.
- [ ] Contract tests pass.
- [ ] Breaking changes require explicit review.

## 10.5 Quality Exit

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] API tests pass.
- [ ] Authorization tests pass.
- [ ] Tenant-isolation tests pass.
- [ ] Audit tests pass.
- [ ] Idempotency tests pass.
- [ ] Integration tests pass.
- [ ] E2E test passes.
- [ ] CI passes.

## 10.6 Documentation Exit

- [ ] Control Plane architecture documented.
- [ ] API v1 documented.
- [ ] Identity documented.
- [ ] Authorization documented.
- [ ] Project APIs documented.
- [ ] Platform catalog documented.
- [ ] Repository model documented.
- [ ] Audit model documented.
- [ ] Configuration documented.
- [ ] Test evidence recorded.
- [ ] Tracking documents updated.

## 10.7 Formal Milestone Status

B-M01 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

A milestone cannot be marked COMPLETE solely because source code has been
committed.

Completion requires:

- implementation evidence;
- test evidence;
- security review;
- architecture review;
- acceptance evidence;
- documentation updates;
- tracking updates.

---
