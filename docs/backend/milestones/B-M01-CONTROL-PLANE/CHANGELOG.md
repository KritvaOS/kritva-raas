# B-M01-CONTROL-PLANE — Changelog

Milestone: B-M01 — Control Plane

# 11 Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date: 2026-10-10
- Change: Added organization coding-agent policy scope (Section 2.7, risk R-BM01-016, tasks KR-CA-022 to KR-CA-026, acceptance Section 6.16, review Section 7.13) per SYS-ADR-007 and BE-ADR-011 (Proposed).
- Task: KR-CA-022 to KR-CA-026
- Author: Planning update
- Evidence: `docs/architecture/CODING_AGENT_INTEGRATION.md`

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Fixed

- Date:
- Issue:
- Task:
- Author:
- Evidence:

## Removed

- Date:
- Change:
- Reason:
- Task:
- Author:
- Evidence:

## Notes

- Initial B-M01 milestone dossier.
- No implementation is implied by this document.
- B-M01 establishes the authoritative Control Plane foundation.
- Organization is the primary tenant boundary.
- Authentication and authorization remain distinct concerns.
- Project APIs carry metadata only and must preserve source-code privacy.
- Platform catalog data is authoritative on the backend.
- PostgreSQL is the authoritative structured business store.
- The Control Plane is a modular monolith, not a temporary throwaway backend.
- Physical robot safety remains outside cloud Control Plane authority.

---

# Appendix A — Phase Mapping

The canonical mapping for B-M01 CONTROL PLANE (P3) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Owning phase |  |
| P4 BOOKING & COMMERCIAL | Downstream consumer of this milestone's outputs |  |
| P5 EXECUTION | Downstream consumer of this milestone's outputs | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Downstream consumer of this milestone's outputs | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Downstream consumer of this milestone's outputs |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Control Plane Module Architecture

    +------------------------------------------------------+
    |                  API / Transport                     |
    +--------------------------+---------------------------+
                               |
                               v
    +------------------------------------------------------+
    |              Authentication / Authorization          |
    +--------------------------+---------------------------+
                               |
                               v
    +------------------------------------------------------+
    |                Application Services                  |
    |                                                      |
    | Identity | Organization | Project | Platform | Audit |
    +--------------------------+---------------------------+
                               |
                               v
    +------------------------------------------------------+
    |                    Domain Model                      |
    +--------------------------+---------------------------+
                               |
                               v
    +------------------------------------------------------+
    |                 Repository Interfaces                |
    +--------------------------+---------------------------+
                               |
                               v
    +------------------------------------------------------+
    |                Infrastructure Adapters               |
    | PostgreSQL | Identity Provider | Object Storage ...  |
    +------------------------------------------------------+

Dependencies should flow downward.

Infrastructure must not dictate domain semantics.

---

# Appendix C — Identity and Authorization Flow

    HTTP Request
         |
         v
    Authentication
         |
         v
    Principal
         |
         v
    Organization Context
         |
         v
    Resource Resolution
         |
         v
    Authorization Policy
         |
     +---+---+
     |       |
    DENY    ALLOW
     |       |
     v       v
   Error   Application
              |
              v
          Repository
              |
              v
           Database

Authorization must occur before sensitive business operations.

---

# Appendix D — Project Flow

    User
      |
      v
    POST /projects
      |
      v
    Authentication
      |
      v
    Organization Membership
      |
      v
    Project Authorization
      |
      v
    ProjectService
      |
      v
    Transaction
      |
      +--> ProjectRepository
      |
      +--> AuditService
      |
      v
    Commit
      |
      v
    Response

If the transaction fails, the operation must not produce partially committed
Project state.

---

# Appendix E — Platform Catalog Flow

    Studio
      |
      v
    GET /api/v1/platforms
      |
      v
    Authentication
      |
      v
    Platform Authorization
      |
      v
    PlatformService
      |
      v
    PlatformRepository
      |
      v
    PostgreSQL
      |
      v
    Platform Catalog
      |
      v
    Studio

The Studio uses the returned catalog to construct platform-selection UI.

---

# Appendix F — Organization Model

Conceptually:

    Organization
       |
       +---- Membership ---- User
       |
       +---- Project
       |
       +---- Project Member
       |
       +---- Booking
       |
       +---- Credit Wallet
       |
       +---- Job
       |
       +---- Run
       |
       +---- Result

Organization is the logical tenant.

Global resources such as Platforms may be shared across organizations.

Tenant-owned resources must carry sufficient ownership information to enforce
authorization and integrity.

---

# Appendix G — Project Model

Conceptual Project:

    {
        "project_id": "project-001",
        "organization_id": "org-001",
        "project_key": "vision-demo",
        "name": "Vision Demo",
        "description": "Reference vision application",
        "status": "ACTIVE",
        "default_platform_id": "platform-001"
    }

The object contains metadata only.

No source archive is part of the normal Project API.

---

# Appendix H — Platform Model

Conceptual hierarchy:

    Platform
       |
       +--> Platform Version
               |
               +--> Architecture
               |
               +--> Runtime
               |
               +--> SDK Compatibility
               |
               +--> Capabilities
               |
               +--> Configurations

Example:

    Platform:
      Kritva Reference Robot

    Version:
      1.0

    Architecture:
      arm64

    Runtime:
      KritvaOS 1.0

    SDK:
      1.0

    Capabilities:
      vision
      motion
      navigation

This hierarchy is authoritative and versioned.

---

# Appendix I — Authorization Model

Baseline roles include:

    ORGANIZATION
      ORG_OWNER
      ORG_ADMIN
      ORG_MEMBER
      ORG_VIEWER

    PROJECT
      PROJECT_OWNER
      PROJECT_ADMIN
      PROJECT_MEMBER
      PROJECT_VIEWER

    PLATFORM
      PLATFORM_ADMIN
      PLATFORM_OPERATOR
      PLATFORM_VIEWER

    LAB
      LAB_ADMIN
      LAB_OPERATOR
      LAB_VIEWER

    GLOBAL
      SUPPORT_AGENT
      SYSTEM_ADMIN

B-M01 primarily implements the identity, organization, project and platform
portions required by later milestones.

Permissions follow:

    <resource>.<action>

Examples:

    organization.read
    organization.manage
    project.create
    project.read
    project.update
    project.archive
    platform.read
    platform.manage

---

# Appendix J — Audit Model

Conceptual audit event:

    {
        "audit_id": "audit-001",
        "timestamp": "2026-10-08T20:00:01Z",
        "actor_type": "USER",
        "actor_id": "user-001",
        "organization_id": "org-001",
        "action": "project.create",
        "resource_type": "project",
        "resource_id": "project-001",
        "outcome": "SUCCESS",
        "request_id": "req-12345",
        "correlation_id": "trace-001",
        "metadata": {}
    }

Audit records must not contain unnecessary secrets or sensitive payloads.

---

# Appendix K — Error Taxonomy

Baseline API error categories:

    UNAUTHENTICATED
    FORBIDDEN
    NOT_FOUND
    INVALID_REQUEST
    CONFLICT
    VALIDATION_ERROR
    RATE_LIMITED
    UNAVAILABLE
    INTERNAL_ERROR

Business-specific error codes should be stable enough for clients to react to
without parsing human-readable messages.

Examples:

    PROJECT_NOT_FOUND
    PROJECT_KEY_CONFLICT
    ORGANIZATION_MEMBERSHIP_REQUIRED
    PLATFORM_NOT_AVAILABLE
    PLATFORM_VERSION_NOT_FOUND
    FORBIDDEN

---

# Appendix L — Configuration Principles

Configuration is separated into:

    Public Configuration
        |
        +--> API base settings
        +--> feature flags
        +--> environment identity

    Sensitive Configuration
        |
        +--> database credentials
        +--> identity provider secrets
        +--> signing credentials
        +--> cloud credentials

Sensitive configuration must be injected through the approved secrets
mechanism.

No production secrets are committed to source control.

---

# Appendix M — Logging Principles

Application logs answer:

> What happened operationally?

Audit records answer:

> What security or business action occurred?

They are different.

Logs may contain:

- request ID;
- correlation ID;
- route;
- duration;
- status;
- internal operation;
- error classification.

Logs must not contain:

- access tokens;
- refresh tokens;
- passwords;
- private keys;
- secrets;
- unnecessary source data.

---

# Appendix N — API Versioning

B-M01 establishes:

    /api/v1

Breaking API changes require:

- explicit review;
- decision record;
- change tracking;
- migration plan;
- compatibility assessment.

A future:

    /api/v2

must not be introduced merely to hide implementation instability.

API versioning represents a deliberate contract change.

---

# Appendix O — Database Transaction Principle

Application service:

    Begin Transaction
          |
          v
    Validate Business Rules
          |
          v
    Repository Writes
          |
          v
    Audit / Outbox as Required
          |
          v
    Commit
          |
          v
    Response

The repository should not independently commit business transactions when the
application service requires multiple coordinated writes.

---

# Appendix P — Idempotency Architecture

    Client
      |
      | Idempotency-Key
      v
    API
      |
      v
    IdempotencyService
      |
      +--> Existing Key?
      |       |
      |      YES
      |       |
      |       v
      |   Return Stored Outcome
      |
      NO
      |
      v
    Business Transaction
      |
      v
    Store Outcome
      |
      v
    Response

This abstraction will later be reused by:

- booking;
- credit reservation;
- Job creation;
- artifact upload;
- result generation;
- downloads.

---

# Appendix Q — Integration Boundaries

B-M01 establishes these boundaries:

    Studio
      |
      | HTTPS REST
      v
    Control Plane
      |
      +--> PostgreSQL
      |
      +--> Identity Provider Adapter
      |
      +--> Object Storage Adapter
      |
      +--> Audit
      |
      +--> Future Queue/Event Infrastructure

Future boundaries:

    Control Plane
          |
          v
       Lab Agent
          |
          v
       Runtime
          |
          v
        Robot

B-M01 does not implement the latter execution path.

---

# Appendix R — Observability Baseline

Control Plane operational metrics should include:

- request count;
- request latency;
- HTTP error rate;
- authentication failures;
- authorization denials;
- database latency;
- database errors;
- transaction rollback count;
- idempotency conflicts;
- audit write failures;
- repository errors;
- readiness failures.

At minimum every request should be traceable through a request ID and,
where distributed operations exist, a correlation/trace ID.

---

# Appendix S — Open Questions

The following questions must be resolved through the normal decision process
before they become implementation blockers:

1. Which external identity provider is used for the first production release?
2. Is password authentication required for the initial release?
3. Which MFA methods are mandatory?
4. Is organization creation self-service or administrative?
5. Is the first organization created during signup or onboarding?
6. Can a user belong to multiple organizations in the MVP?
7. Can an organization have multiple owners?
8. Which organization roles are editable by customers?
9. Which support actions require break-glass access?
10. Is project membership implemented fully in B-M01 or completed in B-M02?
11. What exact project deletion policy applies?
12. Is deletion soft-delete only?
13. Which platform catalog records are globally managed?
14. Can customers define private platform configurations?
15. Which platform fields are immutable after publication?
16. Which platform changes require version creation?
17. What is the exact API pagination convention?
18. What is the maximum page size?
19. Which endpoints require idempotency?
20. What is the initial idempotency retention period?
21. Is audit written transactionally with business state?
22. When is the outbox required?
23. Which audit data requires long-term retention?
24. Which database extensions are approved?
25. What connection pool limits apply per environment?
26. What API rate limits apply to identity operations?
27. What API rate limits apply to catalog queries?
28. Which API documentation format is authoritative?
29. Which API compatibility checks run in CI?
30. Which administrative APIs are exposed through the same service?
31. What support-agent access model is required?
32. Which actions require step-up authentication?
33. Which actions require explicit confirmation?
34. Is organization-level RLS enabled in the first production release?
35. What database service account separation is required?
36. What production API gateway is used?
37. What initial production deployment topology is required?
38. What initial availability SLO applies to the Control Plane?
39. What API request timeout policy applies?
40. Which asynchronous operations require a queue from the first release?

Open questions must not be silently resolved through implementation when they
materially affect architecture, security, tenancy or compatibility.

---

# Appendix T — Definition of Done

B-M01 is Done when the following flow works end-to-end:

    Authenticated User
          |
          v
    Organization Context
          |
          v
    Authorization
          |
          v
    Create Project
          |
          v
    Read Project
          |
          v
    Read Platform Catalog
          |
          v
    Audit Operation
          |
          v
    Verify Tenant Isolation

The implementation must be backed by:

- code;
- migrations;
- tests;
- security review;
- architecture review;
- API evidence;
- audit evidence;
- CI evidence;
- documentation.

---

# Appendix U — Final Milestone Invariants

1. Control Plane is authoritative for structured RaaS business state.
2. API v1 is explicitly versioned.
3. Authentication and authorization are separate concerns.
4. Authorization is server-side.
5. Authorization defaults to deny.
6. Organization is the primary tenant boundary.
7. Organization ownership is explicit.
8. Organization membership is explicit.
9. Project always belongs to an organization.
10. Project key is unique within an organization.
11. Project APIs do not upload source code.
12. Source code remains outside the Control Plane in normal development flow.
13. Platform catalog is backend-authoritative.
14. Platform and Platform Version are distinct.
15. Architecture is explicit.
16. Capabilities are explicit.
17. Platform configuration is explicit.
18. Repositories do not own HTTP concerns.
19. Application services define business transaction boundaries.
20. PostgreSQL is authoritative for structured state.
21. Idempotency is reusable across later domains.
22. Audit is distinct from operational logging.
23. Security-sensitive actions are auditable.
24. Tenant isolation is explicitly tested.
25. Cross-tenant access is denied.
26. Administrative operations require elevated authorization.
27. API errors are structured and stable.
28. Request IDs are propagated.
29. Sensitive information is not logged.
30. Production secrets are not stored in source control.
31. Database migrations are version controlled.
32. Database constraints enforce important invariants.
33. Tests cover both positive and negative authorization cases.
34. API contracts are tested.
35. Repository behavior is tested.
36. Failure behavior is tested.
37. The Control Plane remains a modular monolith unless measured requirements
    justify later decomposition.
38. B-M01 does not implement physical robot safety authority.
39. B-M01 does not bypass later artifact, booking, credit, execution or lab
    boundaries.
40. Completion requires evidence rather than source-code presence alone.

# Appendix V — Milestone Principle

> B-M01 establishes the authoritative foundation of Kritva RaaS Control Plane.
> Identity establishes who is acting; organization establishes whose data is
> involved; authorization establishes what the actor may do; repositories and
> PostgreSQL establish durable business state; the platform catalog establishes
> the authoritative robotic platform vocabulary; and audit establishes
> evidence of important actions. The Control Plane is intentionally a
> production-oriented modular monolith with explicit domain boundaries rather
> than a temporary backend or premature microservice system. Projects carry
> metadata and references, not customer source code. All later booking, credits,
> execution, lab and results capabilities build on this foundation while
> preserving tenant isolation, security, source-code privacy, transactional
> correctness and auditable behavior.
