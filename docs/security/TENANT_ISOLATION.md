# Kritva RaaS Tenant Isolation

## 1. Purpose

This document defines the production-grade tenant-isolation architecture for
Kritva RaaS.

Tenant isolation ensures that one organization cannot access, modify, consume,
observe, or interfere with another organization's data, compute resources,
artifacts, bookings, credits, execution environments, telemetry, results, or
operational resources except through explicitly authorized administrative or
support workflows.

The primary tenant boundary is the **Organization**.

The isolation model shall protect tenants across:

- PostgreSQL data;
- object storage;
- API and application services;
- caches;
- queues;
- background workers;
- compute/runtime environments;
- laboratory resources;
- robot execution;
- network paths;
- telemetry;
- logs;
- results;
- quotas;
- resource allocation;
- backups;
- administrative interfaces.

The architecture shall use defense in depth.

No single control, including PostgreSQL Row-Level Security (RLS), shall be
considered the sole tenant-isolation mechanism.

## 2. Scope

This document covers isolation of:

- Organization-owned users and memberships;
- Projects;
- Project settings;
- Artifacts;
- Bookings;
- Credit wallets and ledgers;
- Jobs;
- Runs;
- Results;
- Experiments;
- customer-uploaded files;
- execution metadata;
- telemetry;
- logs;
- video;
- object-storage content;
- lab resources;
- simulated resources;
- physical robot execution;
- network communication;
- background processing;
- caches;
- queues;
- temporary files;
- backups and exports.

It also covers:

- PostgreSQL schema and query isolation;
- RLS;
- application tenant context;
- object-storage prefixes/buckets;
- compute isolation;
- network segmentation;
- quotas;
- noisy-neighbour protection;
- isolation testing;
- privileged administrative access.

## 3. Non-Goals

This document does not define:

- user authentication;
- authorization role definitions;
- password security;
- secret management;
- cryptographic key hierarchy;
- artifact signing;
- physical robot safety implementation.

Those systems are defined in their respective security documents.

Tenant isolation integrates with those controls.

# 4. Tenant Isolation Principles

The following principles are mandatory:

1. Organization is the primary customer tenant boundary.
2. Tenant identity shall be established from an authenticated principal.
3. Client-supplied organization identifiers shall never be trusted without
   server-side validation.
4. Tenant ownership shall be represented explicitly in persistent data.
5. Customer data shall be tenant scoped at the application layer.
6. PostgreSQL shall provide defense-in-depth isolation using RLS where practical.
7. Object storage shall enforce tenant-scoped access.
8. Runtime environments shall not share customer filesystem state.
9. Network paths shall not permit unauthorized tenant-to-tenant communication.
10. Quotas shall prevent one tenant from monopolizing shared resources.
11. Background workers shall preserve tenant context.
12. Caches shall include tenant context in their keys.
13. Queues shall not expose cross-tenant payloads.
14. Telemetry and logs shall preserve tenant ownership.
15. Administrative access shall be explicitly controlled and audited.
16. Physical safety controls remain independent of tenant authorization.
17. Isolation failures shall fail closed.
18. Isolation shall be continuously tested.

# 5. Definitions

| Term | Definition |
|---|---|
| Tenant | Customer organization represented by an Organization |
| Organization | Primary logical tenant boundary |
| Tenant Context | Authenticated and validated organization context |
| Tenant-Owned Resource | Resource logically owned by one organization |
| Global Resource | Resource shared across tenants under controlled policy |
| RLS | PostgreSQL Row-Level Security |
| Resource Scope | Tenant ownership or access boundary |
| Noisy Neighbour | Tenant consuming disproportionate shared resources |
| Isolation Boundary | Technical control preventing unauthorized cross-tenant access |
| Tenant Data | Data belonging to a specific organization |
| Shared Infrastructure | Infrastructure serving multiple tenants |
| Dedicated Resource | Resource assigned exclusively to one tenant |
| Lab Resource | Allocatable compute/robot/simulator resource |
| Execution Sandbox | Runtime boundary containing customer execution |
| Cross-Tenant Access | Access from one organization to another organization's data/resources |

# 6. Tenant Model

The logical tenant hierarchy is:

    Organization
        |
        +--------------------+
        |                    |
        v                    v
     Projects             Memberships
        |
        +-------------------------------+
        |               |               |
        v               v               v
     Artifacts       Bookings          Jobs
                                        |
                                        v
                                      Runs
                                        |
                                        v
                                      Results

Organization is the authoritative tenant identity.

A Project belongs to exactly one Organization.

Customer-owned downstream resources shall be traceable to an Organization.

# 7. Tenant Identity

Every protected request shall resolve:

    principal_id
    organization_id
    authentication_assurance
    authorization_context

The organization context shall come from:

- authenticated session;
- validated organization membership;
- explicit organization selection where the user has multiple memberships.

It shall not be trusted merely because the client submits:

    organization_id = "org-002"

# 8. Organization Context Resolution

Preferred flow:

    Request
       |
       v
    Authenticate
       |
       v
    Resolve Principal
       |
       v
    Resolve Organization Membership
       |
       v
    Establish Tenant Context
       |
       v
    Authorize Operation
       |
       v
    Access Resource

A request without a valid tenant context shall be rejected when the operation
requires tenant scope.

# 9. Tenant Context Propagation

Tenant context shall propagate through:

    API
      |
      v
    Application Service
      |
      v
    Domain Service
      |
      v
    Repository
      |
      v
    PostgreSQL

and:

    API
      |
      v
    Job Queue
      |
      v
    Worker
      |
      v
    Repository / Object Storage

Every asynchronous operation shall preserve tenant identity.

# 10. Tenant Context Object

Conceptual structure:

    TenantContext {
        organization_id
        principal_id
        session_id
        authorization_scope
        request_id
    }

Tenant context shall be immutable during a request.

An application component shall not silently replace the organization context.

# 11. PostgreSQL Isolation

PostgreSQL is the authoritative store for structured business state.

Tenant isolation shall use multiple layers:

    API Authorization
          |
          v
    Application Tenant Context
          |
          v
    Repository Tenant Filtering
          |
          v
    PostgreSQL Constraints
          |
          v
    PostgreSQL RLS
          |
          v
    Data

RLS is defense in depth, not a replacement for application authorization.

# 12. Tenant-Owned Schemas

Logical schemas include:

    identity
    organization
    project
    platform
    artifact
    booking
    credit
    execution
    lab
    result
    experiment
    audit
    system

Not every table requires an organization ID.

Global catalog tables such as platform definitions may intentionally be
non-tenant-owned.

# 13. Tenant Ownership Matrix

| Domain | Tenant-Owned | Isolation Requirement |
|---|---|---|
| Organization | Yes | Mandatory |
| Membership | Yes | Mandatory |
| Project | Yes | Mandatory |
| Artifact | Yes | Mandatory |
| Booking | Yes | Mandatory |
| Credit | Yes | Mandatory |
| Job | Yes | Mandatory |
| Run | Yes | Mandatory |
| Result | Yes | Mandatory |
| Experiment | Yes | Mandatory |
| Platform Catalog | No | Global policy |
| Capability Catalog | No | Global policy |
| Lab | Optional | Organization-scoped where applicable |
| Robot | Operational | Controlled lab scope |
| Resource | Operational | Controlled lab scope |

# 14. Organization ID on Data

Customer-owned tables should contain:

    organization_id

where practical.

This makes:

- authorization;
- filtering;
- indexing;
- auditing;
- RLS;
- incident investigation

more reliable.

# 15. Composite Tenant Integrity

Where practical, cross-domain foreign keys should preserve tenant identity.

Example:

    (organization_id, project_id)
        ->
    project.projects(
        organization_id,
        project_id
    )

This prevents an application defect from associating:

    org-A booking -> org-B project

# 16. Repository Isolation

Repositories shall prefer tenant-scoped interfaces.

Preferred:

    projectRepository.get(
        organization_id,
        project_id
    )

Avoid:

    projectRepository.get(project_id)

for tenant-owned resources.

Repositories shall not rely solely on callers remembering to add filters.

# 17. PostgreSQL Row-Level Security

RLS shall be evaluated for production customer-owned tables where practical.

Conceptual policy:

    USING (
        organization_id = current_setting(
            'app.organization_id',
            true
        )::uuid
    )

The exact implementation shall account for PostgreSQL connection pooling
and safe tenant-context lifecycle.

# 18. RLS Context

The database tenant context shall be established only from a trusted
application connection path.

The application shall not directly expose arbitrary SQL session-setting
capability to untrusted users.

Tenant context shall be reset between pooled database requests.

# 19. Connection Pooling

Connection pooling creates a specific RLS risk.

A connection previously used for:

    organization_id = org-A

must never accidentally retain that context for:

    organization_id = org-B

The application shall use transaction-scoped tenant context or equivalent
safe isolation.

# 20. RLS Default Deny

RLS shall default to deny when tenant context is absent or invalid.

Conceptual:

    organization_id = NULL
            |
            v
          DENY

A missing tenant context must not result in unrestricted table access.

# 21. RLS and Service Roles

Database roles that bypass RLS shall be tightly restricted.

Application runtime roles should not routinely bypass RLS.

Administrative migration roles may require elevated privileges but shall not be
used by normal application traffic.

# 22. RLS and Migrations

Schema migrations may require elevated privileges.

Migration credentials shall be separate from runtime application credentials.

Migrations shall not weaken RLS permanently.

Every migration changing tenant isolation shall receive security review.

# 23. Tenant Constraints

Database constraints shall enforce:

- mandatory organization IDs where required;
- valid organization references;
- valid project ownership;
- valid resource relationships;
- valid composite tenant relationships.

Constraints are a structural defense against cross-tenant corruption.

# 24. Tenant-Scoped Unique Constraints

Customer identifiers should normally be unique within a tenant.

Example:

    UNIQUE (
        organization_id,
        project_key
    )

rather than:

    UNIQUE (project_key)

unless the identifier is intentionally global.

# 25. Tenant-Scoped Indexing

Indexes shall reflect common tenant-scoped queries.

Examples:

    (organization_id, created_at)
    (organization_id, project_id)
    (organization_id, status)
    (organization_id, resource_id)

Indexes should support both performance and predictable tenant filtering.

# 26. PostgreSQL Query Safety

Application queries shall avoid unrestricted tenant-owned scans.

Code review shall reject queries that access tenant-owned tables without a
validated tenant boundary unless the operation is explicitly global.

# 27. Cross-Tenant Joins

Joins shall preserve tenant ownership.

Example:

    booking.organization_id
        =
    project.organization_id

Cross-tenant joins shall not be used for ordinary customer requests.

# 28. Global Catalog Data

Global platform data may be shared:

    platform.platforms
    platform.platform_versions
    platform.capabilities

Customer access to global catalog data does not imply access to another
tenant's operational data.

# 29. Tenant-Owned Labs

A Lab may optionally belong to an organization.

If:

    lab.organization_id != NULL

then customer access shall be restricted to that organization.

Global/shared labs require explicit resource-allocation policy.

# 30. Shared Lab Resources

A shared resource may serve multiple tenants sequentially.

The resource allocation boundary shall guarantee:

- no simultaneous unauthorized execution;
- isolated filesystem state;
- isolated process state;
- isolated credentials;
- isolated network policy;
- isolated logs/telemetry.

# 31. Object Storage Isolation

Large artifacts, results, logs, video, and telemetry may reside in object
storage.

Object storage shall enforce tenant isolation independently of PostgreSQL.

Conceptual:

    Organization
         |
         v
    Object Namespace
         |
         +-- artifacts/
         +-- results/
         +-- video/
         +-- logs/
         +-- telemetry/

# 32. Object Storage Namespace

Preferred logical key:

    <organization_id>/<resource-type>/<resource-id>/<object>

Example:

    org-001/artifacts/artifact-123/package.krv

Tenant IDs shall not be the sole security control.

They provide traceability and defense in depth.

# 33. Object Storage Authorization

Object access shall require:

- authenticated principal;
- organization membership;
- resource authorization;
- object ownership;
- operation permission.

Direct public access shall be prohibited for private tenant objects.

# 34. Signed Object URLs

If signed URLs are used:

- they shall be short-lived;
- scoped to one object or tightly bounded set;
- generated only after authorization;
- non-shareable by design where possible;
- logged as access events without recording the URL secret.

# 35. Object Storage Bucket Policy

Bucket/container policies shall prevent:

- anonymous access;
- cross-tenant listing;
- unrestricted application access;
- public artifact downloads.

Application authorization remains required before generating object access.

# 36. Object Listing Isolation

A tenant shall not be able to enumerate another tenant's object namespace.

Object listing APIs shall always apply tenant scope.

# 37. Object Metadata

Object metadata shall not expose:

- another tenant ID unnecessarily;
- customer-private names;
- private artifact information;
- credentials.

Metadata returned through the API shall follow authorization policy.

# 38. Object Deletion

Deletion shall verify:

    authenticated principal
       +
    organization
       +
    object ownership
       +
    delete permission

Object deletion shall be audited.

# 39. Object Storage Lifecycle

Retention policies shall preserve tenant ownership.

Archived or replicated objects must retain the same tenant isolation controls.

Backup copies shall not become globally accessible.

# 40. Object Storage Encryption

Tenant objects shall be encrypted at rest.

Encryption keys shall be governed by the key-management architecture.

Encryption does not replace authorization.

# 41. Temporary Object Storage

Temporary upload/download locations shall:

- be tenant scoped;
- expire;
- have short-lived access;
- not become public;
- be deleted after retention period.

# 42. Compute Isolation

RaaS execution shall treat customer execution as untrusted workload.

The conceptual model is:

    Tenant Artifact
          |
          v
    Compatibility Validation
          |
          v
    Resource Allocation
          |
          v
    Isolated Runtime
          |
          v
    Robot / Simulator

One tenant's runtime shall not access another tenant's runtime state.

# 43. Runtime Isolation Requirements

Execution environments shall isolate:

- filesystem;
- process namespace;
- environment variables;
- credentials;
- temporary files;
- IPC;
- network;
- shared memory;
- runtime configuration;
- telemetry;
- logs.

# 44. Shared Runtime

Shared physical hardware may host sequential customer workloads only if the
runtime is securely reset between jobs.

Required cleanup includes:

- processes;
- files;
- temporary directories;
- environment state;
- network state;
- IPC state;
- credentials;
- caches.

# 45. Dedicated Runtime

High-risk workloads or customers may require dedicated execution resources.

Dedicated resources should provide stronger isolation and predictable
performance.

The resource model shall support:

    SHARED
    DEDICATED

where policy requires.

# 46. Runtime Identity

Each execution shall receive a unique runtime identity.

Example:

    run_id
    job_id
    organization_id
    resource_id

The runtime shall not receive another tenant's credentials.

# 47. Runtime Filesystem

Each run shall receive an isolated filesystem namespace.

Example:

    /runtime/runs/<run-id>/

A run shall not access:

    /runtime/runs/<other-run-id>/

Filesystem permissions shall be enforced by the runtime boundary, not merely by
application convention.

# 48. Runtime Cleanup

After execution:

    STOP
      |
      v
    Collect Approved Results
      |
      v
    Terminate Processes
      |
      v
    Delete Temporary State
      |
      v
    Remove Credentials
      |
      v
    Reset Resource

Cleanup failure shall mark the resource unsafe for reuse until remediation.

# 49. Container/VM Isolation

The implementation may use:

- containers;
- virtual machines;
- sandboxed processes;
- dedicated hosts.

The choice shall be based on workload risk.

Container isolation shall not be assumed equivalent to a VM without security
validation.

# 50. Privilege Restrictions

Customer workloads shall run with least privilege.

They shall not receive:

- host root;
- unrestricted device access;
- host filesystem access;
- host network access;
- unrelated tenant storage;
- host secrets.

# 51. Hardware Access

Physical hardware access shall be mediated.

A workload shall access only:

- allocated robot;
- allocated peripherals;
- approved interfaces;
- approved capabilities.

Direct access to another robot or host controller shall be prohibited.

# 52. Device Isolation

Device paths shall be mapped only to the assigned runtime.

Example:

    Run A -> /dev/robot-A-controller

Run A shall not receive:

    /dev/robot-B-controller

# 53. GPU Isolation

If GPUs are shared:

- GPU allocation shall be explicit;
- memory/resource limits shall be enforced;
- workloads shall not access another workload's memory;
- GPU reset/isolation capabilities shall be evaluated.

Dedicated GPU resources may be required for high-assurance isolation.

# 54. Runtime Credentials

Credentials injected into a runtime shall be:

- run-specific;
- tenant-scoped;
- short-lived;
- least privilege;
- removed after execution.

They shall never be copied into result bundles.

# 55. Network Isolation

Network isolation shall prevent unauthorized communication between tenants.

Conceptual:

    Tenant A Runtime
          |
          X
          |
    Tenant B Runtime

and:

    Tenant A Runtime
          |
          v
    Approved Service
          |
          v
    Control Plane

# 56. Network Policy

Runtime network access shall be deny-by-default.

Permitted destinations should be explicit:

- Control Plane;
- approved artifact service;
- approved telemetry endpoint;
- required robot controller;
- explicitly authorized external endpoint.

# 57. Tenant-to-Tenant Network Isolation

A runtime shall not directly communicate with another tenant runtime.

Tenant-specific network namespaces or equivalent segmentation shall be used.

# 58. Lab Network Segmentation

Laboratory networks should separate:

    Management Network
    Lab Agent Network
    Robot Control Network
    Customer Execution Network
    Guest/Administrative Network

Exact segmentation depends on lab topology.

# 59. Robot Control Network

Robot control networks shall be isolated from general customer networks.

Cloud services shall not receive direct unrestricted access to robot control
networks.

The Lab Agent remains the controlled boundary.

# 60. Egress Control

Customer workloads shall have explicit egress policy.

Default:

    Egress = DENY

Allow only required destinations.

Egress controls also reduce data-exfiltration risk.

# 61. Ingress Control

Customer execution environments shall not accept arbitrary inbound connections.

Inbound connections shall be:

- authenticated;
- authorized;
- required;
- scoped.

# 62. DNS Isolation

DNS access shall be controlled where required.

Tenant runtimes should not be able to resolve or discover private infrastructure
belonging to another tenant.

# 63. Network Metadata Leakage

Network telemetry shall not reveal another tenant's:

- internal addresses;
- resource identifiers;
- endpoints;
- credentials;
- private service names.

# 64. Queue Isolation

Queues shall preserve tenant context.

Conceptual:

    {
        "organization_id": "org-001",
        "job_id": "job-001",
        "command": "execute"
    }

Workers shall validate tenant ownership before processing the message.

# 65. Queue Authorization

A worker receiving a message shall not trust the message's organization ID.

It shall validate:

    message
       |
       v
    Job Lookup
       |
       v
    Authoritative Organization
       |
       v
    Process

# 66. Cross-Tenant Queue Protection

A tenant shall not be able to:

- publish arbitrary commands into another tenant's queue;
- consume another tenant's queue;
- inject job IDs belonging to another organization.

# 67. Cache Isolation

Cache keys shall include tenant identity where data is tenant scoped.

Unsafe:

    project:<project-id>

Preferred:

    org:<organization-id>:project:<project-id>

Authorization shall still be performed where required.

# 68. Distributed Cache

Distributed caches shall prevent:

- cross-tenant reads;
- cross-tenant invalidation;
- tenant-controlled key collisions.

Cache namespaces should be logically and, where practical, physically isolated.

# 69. Search Index Isolation

If search infrastructure is introduced, every indexed tenant-owned document
shall contain tenant identity.

Search queries shall enforce tenant filters before returning results.

# 70. Telemetry Isolation

Telemetry shall carry:

    organization_id
    project_id
    job_id
    run_id
    resource_id

Telemetry ingestion shall validate ownership.

A tenant shall not query another tenant's telemetry.

# 71. Video Isolation

Live and recorded video shall be tenant-scoped.

Video access shall require:

- authorized organization;
- project/run access;
- valid session;
- short-lived access where applicable.

# 72. Log Isolation

Logs shall be classified by ownership.

Customer-visible logs shall be filtered to:

    organization_id
    project_id
    job_id
    run_id

Internal infrastructure logs may contain operational metadata but shall not
expose unnecessary customer information.

# 73. Result Isolation

Results shall inherit the Run's organization boundary.

A Result lookup shall validate:

    result.organization_id
       ==
    authorized.organization_id

# 74. Experiment Isolation

Experiments shall be tenant scoped through their associated Project.

Adding a Run to an Experiment shall require access to both objects.

# 75. Backup Isolation

Backups shall preserve tenant boundaries.

A restore process shall not expose all customer data to ordinary application
users.

Administrative restore access shall be separately authorized and audited.

# 76. Export Isolation

Tenant exports shall include only:

- authorized organization data;
- authorized object files;
- authorized metadata.

Export generation shall validate organization ownership.

# 77. Deletion Isolation

Tenant deletion shall not delete another organization's data.

Deletion workflows shall be tenant-scoped and transactionally controlled.

# 78. Administrative Access

Global administrators may require cross-tenant access for operational
purposes.

Such access shall:

- require explicit administrative authorization;
- be auditable;
- use least privilege;
- preserve target organization identity;
- support break-glass controls.

# 79. Support Access

Support personnel shall not receive implicit cross-tenant access.

Support access should be:

- delegated;
- scoped;
- time limited;
- case-linked;
- audited.

# 80. Noisy-Neighbour Control

Shared infrastructure must prevent one tenant from exhausting resources.

Controls include:

- CPU quotas;
- memory quotas;
- storage quotas;
- object upload limits;
- API rate limits;
- queue limits;
- concurrent job limits;
- booking limits;
- network bandwidth limits;
- GPU quotas.

# 81. Tenant Resource Quotas

Each organization may have policy-controlled quotas:

| Resource | Example Quota |
|---|---|
| Concurrent jobs | 5 |
| CPU | 16 cores |
| Memory | 32 GB |
| Storage | 100 GB |
| Artifact size | 2 GB |
| API requests | 1,000/min |
| Video streams | 2 |
| Active bookings | Policy-based |
| Credits | Wallet-based |

Exact values shall be configurable.

# 82. Quota Enforcement

Quota checks shall occur before resource allocation.

Example:

    Job Request
       |
       v
    Tenant Quota
       |
       +---- Exceeded -> DENY
       |
       v
    Resource Availability
       |
       v
    Allocate

# 83. Concurrent Execution Limits

Concurrent jobs shall be enforced transactionally or through a reliable
resource-allocation mechanism.

A race condition must not allow:

    quota = 5
    actual = 8

unless explicitly permitted by a controlled burst policy.

# 84. Storage Quotas

Storage quotas shall account for:

- artifacts;
- result files;
- video;
- logs;
- telemetry;
- temporary objects.

Temporary data shall have expiration policies.

# 85. API Rate Limits

API rate limits shall be tenant-aware.

A high-volume tenant shall not consume the entire API capacity available to
other organizations.

Limits may also apply by:

- principal;
- endpoint;
- IP;
- project;
- resource.

# 86. Queue Fairness

Background processing should implement fair scheduling.

A single tenant should not indefinitely occupy all workers.

Possible mechanisms:

- per-tenant concurrency;
- weighted queues;
- fair scheduling;
- priority classes.

# 87. Lab Resource Fairness

Shared robots should not be monopolized through excessive job submission.

Controls include:

- booking limits;
- concurrent execution limits;
- queue fairness;
- credit policy;
- per-organization quotas.

# 88. Credit Isolation

Credits are organization-owned financial/usage state.

A tenant shall not:

- read another tenant's wallet;
- consume another tenant's credits;
- alter another tenant's ledger;
- create unauthorized refunds.

The credit ledger remains authoritative.

# 89. Booking Isolation

Bookings shall be scoped to organization/project.

Resource allocation must prevent one tenant from observing or modifying
another tenant's booking details beyond permitted availability information.

# 90. Availability Privacy

Availability APIs may reveal:

    AVAILABLE
    UNAVAILABLE

without exposing:

- another organization's identity;
- private booking purpose;
- private project;
- private user.

# 91. Artifact Isolation

Artifact identifiers shall be non-guessable.

Even if an attacker learns another artifact ID, access shall require:

    organization authorization
       +
    artifact permission

# 92. Artifact Execution Isolation

An artifact from Organization A shall never execute using:

- Organization B credentials;
- Organization B filesystem;
- Organization B network policy;
- Organization B project context.

# 93. Job Isolation

A Job shall contain authoritative:

    organization_id
    project_id
    artifact_id
    booking_id

The execution service shall validate all relationships before execution.

# 94. Run Isolation

A Run shall retain historical tenant identity.

Example:

    Run
      |
      +-- organization_id
      +-- project_id
      +-- job_id
      +-- artifact_id
      +-- platform
      +-- resource
      +-- robot

Historical records shall not change tenant identity merely because a resource
is later reassigned.

# 95. Resource Reassignment

When a shared lab resource changes organizational ownership:

- previous runtime state must be removed;
- credentials must be rotated or cleared;
- cached data must be removed;
- temporary files must be deleted;
- network policy must be reset.

# 96. Physical Robot Reassignment

Before assigning a physical robot to another tenant:

    Stop Previous Run
       |
       v
    Collect Approved Results
       |
       v
    Terminate Processes
       |
       v
    Clear Credentials
       |
       v
    Reset Runtime
       |
       v
    Validate Robot State
       |
       v
    Allocate New Tenant

# 97. Runtime Reset Verification

A resource shall not become AVAILABLE until cleanup verification succeeds.

If cleanup fails:

    RESOURCE = FAULT / QUARANTINED

rather than:

    RESOURCE = AVAILABLE

# 98. Tenant Isolation During Failure

Failures shall not cause fallback to shared unrestricted state.

Examples:

- failed cleanup;
- missing tenant context;
- unavailable authorization service;
- stale runtime;
- object-store policy failure;
- RLS configuration failure.

Default response is fail closed or quarantine.

# 99. Tenant Isolation and Safety

Tenant isolation does not replace robot safety.

Final execution gate:

    Tenant Authorization
          |
          v
    Resource Isolation
          |
          v
    Local Safety Policy
          |
          v
    Hardware Safety
          |
          v
    Physical Motion

Safety remains authoritative.

# 100. Isolation Testing Strategy

Isolation testing shall be continuous.

Testing categories:

- unit;
- integration;
- API;
- database;
- object storage;
- runtime;
- network;
- queue;
- cache;
- lab;
- adversarial;
- penetration testing.

# 101. Cross-Tenant Database Tests

Tests shall attempt:

    Org A -> read Org B
    Org A -> update Org B
    Org A -> delete Org B
    Org A -> list Org B
    Org A -> join Org B records

All unauthorized attempts shall fail.

# 102. RLS Tests

Tests shall verify:

- correct organization context returns own rows;
- wrong organization returns zero rows;
- missing organization context returns zero rows;
- invalid organization context fails;
- pooled connections cannot leak context;
- administrative bypass is restricted.

# 103. Object Storage Tests

Tests shall verify:

- Org A cannot download Org B object;
- Org A cannot list Org B objects;
- signed URL cannot be generated without authorization;
- expired signed URL fails;
- object metadata does not leak tenant data.

# 104. API Isolation Tests

Every tenant-owned endpoint shall be tested with:

- correct tenant;
- wrong tenant;
- missing tenant;
- manipulated tenant ID;
- manipulated resource ID.

Expected result is denial or indistinguishable not-found behavior according to
resource policy.

# 105. Runtime Isolation Tests

Runtime tests shall attempt:

- cross-filesystem access;
- process inspection;
- cross-runtime IPC;
- cross-tenant credential access;
- host filesystem access;
- unauthorized device access;
- cross-tenant network access.

All prohibited operations shall fail.

# 106. Network Isolation Tests

Tests shall verify:

- runtime A cannot connect to runtime B;
- runtime A cannot scan tenant B;
- runtime A cannot access internal management networks;
- egress policy is enforced;
- ingress is restricted.

# 107. Queue Isolation Tests

Tests shall verify:

- tenant A cannot inject tenant B job commands;
- workers validate authoritative ownership;
- queue payload manipulation is rejected;
- tenant A cannot consume tenant B queue data.

# 108. Cache Isolation Tests

Tests shall verify:

- tenant A cannot retrieve tenant B cached object;
- cache key collisions cannot cross tenants;
- invalidation is tenant scoped.

# 109. Telemetry Isolation Tests

Tests shall verify:

- tenant A cannot query tenant B telemetry;
- tenant identifiers cannot be manipulated;
- dashboards enforce tenant scope;
- live streams enforce tenant authorization.

# 110. Noisy-Neighbour Tests

Tests shall intentionally stress one tenant.

Expected behavior:

- other tenants retain service availability;
- quotas are enforced;
- queues remain fair;
- shared resources remain usable;
- rate limits engage;
- alerts are generated.

# 111. Runtime Escape Tests

Security testing shall attempt:

- container escape;
- privilege escalation;
- host filesystem access;
- host network access;
- device escape;
- shared-memory leakage;
- credential extraction.

The exact test suite shall depend on the runtime technology.

# 112. Resource Reuse Tests

Tests shall execute:

    Tenant A
       |
       v
    Cleanup
       |
       v
    Tenant B

and verify that Tenant B cannot observe:

- files;
- processes;
- credentials;
- logs;
- telemetry;
- network state;
- caches;
- previous environment variables.

# 113. Tenant Deletion Tests

Tenant deletion shall verify:

- only tenant-owned database rows are affected;
- only tenant-owned objects are deleted;
- shared global catalogs remain;
- audit records remain according to policy;
- other tenants remain unaffected.

# 114. Backup Isolation Tests

Restore testing shall verify:

- customer exports contain only authorized data;
- restored data does not bypass authorization;
- backup access is restricted;
- tenant deletion semantics are preserved.

# 115. Penetration Testing

Tenant isolation shall be included in penetration tests.

Priority areas:

- IDOR;
- broken access control;
- RLS bypass;
- object-storage enumeration;
- runtime escape;
- network traversal;
- cache poisoning;
- queue injection;
- admin/support abuse.

# 116. Isolation Test Matrix

| Boundary | Attack | Expected |
|---|---|---|
| API | Cross-tenant ID | DENY |
| PostgreSQL | Wrong org context | DENY |
| RLS | Missing context | DENY |
| Object Store | Foreign object | DENY |
| Cache | Foreign key | MISS/DENY |
| Queue | Foreign job | DENY |
| Runtime | Foreign file | DENY |
| Network | Foreign runtime | DENY |
| Device | Foreign robot | DENY |
| Telemetry | Foreign run | DENY |
| Admin | Unauthorized tenant | DENY |
| Support | Expired delegation | DENY |

# 117. Isolation Failure Detection

The platform shall detect:

- cross-tenant access attempts;
- RLS violations;
- authorization mismatches;
- object-storage policy violations;
- runtime escape attempts;
- network policy violations;
- abnormal quota usage.

# 118. Isolation Incident Response

If tenant isolation is suspected to be breached:

1. Identify affected tenants.
2. Stop affected execution if necessary.
3. Disable compromised resource.
4. Preserve evidence.
5. Revoke relevant credentials.
6. Determine data exposure.
7. Patch isolation control.
8. Re-test.
9. Notify affected parties according to policy.
10. Perform post-incident review.

# 119. Tenant Isolation Audit

Security audits shall examine:

- database policies;
- repository filters;
- object-storage policies;
- runtime configuration;
- network segmentation;
- quota configuration;
- support access;
- administrative access;
- test evidence.

# 120. Performance Considerations

Tenant isolation controls shall not unnecessarily degrade performance.

Optimization shall never remove a security boundary.

Preferred order:

    Correctness
       |
       v
    Isolation
       |
       v
    Observability
       |
       v
    Performance Optimization

# 121. RLS Performance

RLS policies shall be indexed appropriately.

Common tenant predicates should use indexed organization IDs.

Query plans shall be reviewed for high-volume tables.

# 122. Tenant-Aware Partitioning

Partitioning may be considered for very large tenant-owned tables.

Partitioning is an optimization, not the primary isolation mechanism.

Possible partitioning dimensions:

- organization;
- time;
- organization + time.

Partitioning shall not create operational fragmentation without measured need.

# 123. Large Tenant Isolation

Large tenants may require:

- dedicated compute;
- dedicated storage;
- dedicated network;
- dedicated database resources.

The architecture shall support migration from shared to dedicated resources
without changing application tenant semantics.

# 124. Dedicated Database Option

Future high-assurance tenants may use:

    Organization
        |
        v
    Dedicated PostgreSQL
        |
        v
    Tenant Data

The application still uses Organization as the logical tenant identity.

# 125. Dedicated Storage Option

High-assurance tenants may use dedicated buckets/containers.

Access policy shall still validate organization ownership.

# 126. Dedicated Compute Option

High-assurance tenants may receive dedicated:

- robot;
- simulator;
- GPU;
- workstation;
- lab resource.

This reduces noisy-neighbour risk but does not remove authorization requirements.

# 127. Tenant Quota Management

Quota policy shall be data-driven.

Quota configuration may include:

    organization_id
    resource_type
    limit
    burst_limit
    effective_at
    expires_at
    policy_version

Quota changes shall be audited.

# 128. Quota Bypass Prevention

Clients shall not bypass quotas by:

- creating multiple projects;
- creating multiple API keys;
- using multiple users;
- submitting duplicate jobs;
- manipulating IDs.

Where appropriate, quotas shall aggregate at Organization level.

# 129. Fairness Model

The default fairness boundary shall be Organization.

Within an organization, project/user limits may be applied.

Conceptual:

    Organization Quota
          |
          +---- Project Quota
          |
          +---- User Quota
          |
          +---- Resource Quota

# 130. Burst Policy

Short bursts may be allowed if capacity exists.

Burst policy shall specify:

- maximum burst;
- duration;
- priority;
- fairness impact.

Bursting must not bypass hard safety or capacity constraints.

# 131. Tenant Isolation and Credits

Credit availability is tenant scoped.

Quota and credit controls may both apply:

    Authorization
       +
    Quota
       +
    Credits
       +
    Booking
       =
    Execution Eligibility

# 132. Tenant Isolation and Booking

Booking allocation shall be transactional.

Resource exclusion constraints prevent conflicting allocations.

Tenant identity shall remain attached to the booking and allocation.

# 133. Tenant Isolation and Results

Result files and metrics shall inherit tenant scope.

Derived comparisons shall only combine Runs that the caller is authorized to
access.

Cross-tenant comparisons are prohibited by default.

# 134. Tenant Isolation and Experiments

Experiments shall not reference Runs from another organization.

Database and application validation should both enforce this invariant.

# 135. Tenant Isolation and Audit

Audit records shall preserve target organization identity.

Administrative cross-tenant actions shall explicitly record:

    actor
    effective organization
    target resource
    reason
    authorization context

# 136. Tenant Isolation and Support

Support access shall never silently merge customer context into the support
agent's own organization.

The effective tenant shall remain explicit.

# 137. Tenant Isolation and Service Identities

Service identities shall have explicit tenant scope where applicable.

A global service may access multiple tenants only through controlled
application authorization.

# 138. Global Service Risk

Global workers represent a high-value isolation boundary.

A compromised worker could potentially access many tenants.

Controls include:

- least privilege;
- RLS;
- service authorization;
- workload isolation;
- audit;
- tenant-scoped queries;
- short-lived credentials.

# 139. Background Worker Pattern

Preferred:

    Queue Message
         |
         v
    Validate Job
         |
         v
    Resolve Organization
         |
         v
    Set Tenant Context
         |
         v
    Authorize
         |
         v
    Execute
         |
         v
    Tenant-Scoped Result

# 140. Tenant Context in Events

Events shall include organization identity where applicable.

Example:

    {
        "event": "job.completed",
        "organization_id": "org-001",
        "project_id": "project-001",
        "job_id": "job-001"
    }

Consumers shall not trust the event alone for authorization.

# 141. Event Isolation

Event consumers shall validate authoritative resource ownership before acting.

An event containing:

    organization_id = org-A

must not authorize access to an object actually owned by org-B.

# 142. Multi-Tenant Metrics

Operational metrics may aggregate across tenants.

Customer-facing metrics shall be tenant filtered.

Internal aggregate metrics shall avoid exposing unnecessary customer identity.

# 143. Error Isolation

Error messages shall not reveal another tenant's:

- resource existence;
- project name;
- artifact name;
- job details;
- robot identity;
- private metadata.

# 144. Timing and Enumeration

Tenant isolation should consider indirect enumeration.

Examples:

- different response timing;
- object existence errors;
- resource availability;
- booking metadata.

Responses should minimize unnecessary cross-tenant information disclosure.

# 145. Tenant Isolation During Maintenance

Maintenance operations shall preserve tenant boundaries.

Temporary migration scripts must use explicit tenant filters.

Operational scripts shall not use:

    DELETE FROM tenant_table;

without a controlled and reviewed tenant scope.

# 146. Production Scripts

Production administrative scripts shall:

- require explicit organization scope where applicable;
- log actor and reason;
- support dry-run;
- validate affected rows;
- avoid unrestricted tenant mutation.

# 147. Schema Migration Safety

Tenant-affecting migrations shall include:

- pre-migration validation;
- migration;
- post-migration tenant checks;
- rollback strategy where possible.

# 148. Tenant Isolation Review Cadence

Isolation shall be reviewed:

- before Production;
- after database architecture changes;
- after runtime changes;
- after network changes;
- after object-storage changes;
- after authorization changes;
- after major infrastructure changes;
- after incidents;
- periodically during production.

# 149. Phase Mapping

| Phase | Tenant Isolation Focus |
|---|---|
| Phase 0 | Tenant model and isolation architecture |
| Phase 1 | PostgreSQL tenant boundaries and RLS |
| Phase 2 | Object storage and application isolation |
| Phase 3 | Queue/cache/worker tenant propagation |
| Phase 4 | Quotas and noisy-neighbour controls |
| Phase 5 | Runtime and lab isolation |
| Phase 6 | Physical robot/resource isolation |
| Phase 7 | Isolation monitoring and adversarial testing |
| Phase 8 | Production hardening and penetration testing |

# 150. Phase 0 Requirements

Define:

- Organization tenant model;
- ownership matrix;
- tenant context;
- trust boundaries;
- isolation invariants;
- test strategy.

# 151. Phase 1 Requirements

Implement:

- organization IDs;
- tenant-scoped repositories;
- composite tenant constraints;
- PostgreSQL RLS;
- RLS tests;
- connection-pool safety.

# 152. Phase 2 Requirements

Implement:

- object-storage namespace;
- object authorization;
- signed URL controls;
- artifact/result isolation;
- API tenant enforcement.

# 153. Phase 3 Requirements

Implement:

- queue tenant context;
- worker validation;
- cache isolation;
- event tenant propagation;
- telemetry/log isolation.

# 154. Phase 4 Requirements

Implement:

- organization quotas;
- concurrent-job limits;
- API rate limits;
- storage limits;
- fair scheduling;
- noisy-neighbour monitoring.

# 155. Phase 5 Requirements

Implement:

- runtime filesystem isolation;
- process isolation;
- network isolation;
- credential isolation;
- runtime cleanup;
- Lab Agent tenant enforcement.

# 156. Phase 6 Requirements

Implement:

- hardware/device isolation;
- robot reassignment reset;
- resource quarantine;
- device-access controls;
- dedicated-resource options.

# 157. Phase 7 Requirements

Implement:

- isolation monitoring;
- cross-tenant anomaly detection;
- continuous isolation tests;
- runtime escape tests;
- object-storage tests;
- network penetration tests.

# 158. Phase 8 Requirements

Implement:

- formal tenant-isolation review;
- independent penetration testing;
- database security review;
- runtime security review;
- noisy-neighbour testing;
- incident exercises.

# 159. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Missing organization filter | RLS + repository scope |
| RLS bypass | Restricted DB roles |
| Connection context leak | Transaction-scoped context |
| Object enumeration | Tenant-scoped object access |
| Signed URL leakage | Short TTL + object scope |
| Worker context loss | Authoritative job lookup |
| Cache collision | Tenant-aware cache keys |
| Queue injection | Authoritative ownership validation |
| Runtime escape | Sandbox/VM isolation |
| Credential leakage | Run-specific credentials |
| Network traversal | Segmentation + egress control |
| Noisy neighbour | Quotas + fair scheduling |
| Resource reuse leak | Mandatory cleanup/quarantine |
| Admin overreach | Scoped audited access |
| Support abuse | Time-limited delegation |
| Backup exposure | Protected restore access |
| Cross-tenant analytics | Tenant filters |
| IDOR | Server-side authorization |
| Stale policy | Cache invalidation |
| Isolation regression | Continuous testing |

# 160. Open Questions

The following require final implementation decisions:

1. Which PostgreSQL tables will have RLS enabled from the first production
   release?
2. Will RLS be mandatory for every tenant-owned table?
3. Which database role will own runtime application connections?
4. How will transaction-scoped tenant context be implemented with the chosen
   connection pool?
5. Will object storage use shared buckets or dedicated tenant buckets?
6. Which object types require dedicated storage for high-assurance tenants?
7. What runtime technology will provide the execution sandbox?
8. When are containers sufficient versus VMs?
9. What hardware isolation is available for GPU workloads?
10. What network segmentation technology will be used in labs?
11. What maximum cross-tenant network exposure is acceptable?
12. What are the initial organization quota values?
13. Which quotas are hard limits versus soft limits?
14. What fair-scheduling algorithm will be used?
15. How will tenant isolation work during Lab Agent disconnection?
16. What runtime cleanup guarantees are required before resource reuse?
17. What evidence is required before a quarantined resource returns to service?
18. Will high-assurance organizations receive dedicated resources?
19. What exact tenant-isolation penetration test scope is required?
20. What customer notification threshold applies to a suspected isolation breach?

# 161. Acceptance Criteria: Tenant Model

- [ ] Organization is the primary tenant boundary.
- [ ] Tenant-owned resources have explicit organization ownership.
- [ ] Tenant context is derived from authenticated identity.
- [ ] Client organization IDs are not trusted directly.
- [ ] Organization switching validates membership.
- [ ] Cross-organization access is denied by default.
- [ ] Tenant ownership is auditable.

# 162. Acceptance Criteria: PostgreSQL

- [ ] Tenant-owned tables have organization ownership.
- [ ] Appropriate tables use RLS.
- [ ] RLS defaults to deny without valid tenant context.
- [ ] Repository interfaces are tenant scoped.
- [ ] Composite tenant constraints exist where required.
- [ ] Tenant-scoped unique constraints are used appropriately.
- [ ] Tenant indexes exist for common access patterns.
- [ ] Runtime DB roles cannot casually bypass RLS.
- [ ] Connection pooling cannot leak tenant context.
- [ ] Cross-tenant database tests pass.

# 163. Acceptance Criteria: Object Storage

- [ ] Private tenant objects use tenant-scoped namespaces.
- [ ] Object access requires authorization.
- [ ] Public access is disabled for private objects.
- [ ] Object listing is tenant scoped.
- [ ] Signed URLs are short-lived.
- [ ] Signed URLs are generated only after authorization.
- [ ] Object metadata does not leak tenant information.
- [ ] Object deletion is tenant scoped.
- [ ] Temporary objects expire.
- [ ] Object-storage cross-tenant tests pass.

# 164. Acceptance Criteria: API

- [ ] All tenant-owned API operations enforce tenant scope.
- [ ] Resource IDs cannot bypass tenant checks.
- [ ] Cross-tenant IDs are denied.
- [ ] Enumeration is minimized.
- [ ] Errors do not unnecessarily reveal foreign resources.
- [ ] API tests cover manipulated tenant IDs.
- [ ] Administrative APIs have separate authorization controls.

# 165. Acceptance Criteria: Queues and Workers

- [ ] Queue messages carry tenant context where applicable.
- [ ] Workers validate authoritative resource ownership.
- [ ] Tenant context is propagated to database operations.
- [ ] Cross-tenant job injection is rejected.
- [ ] Workers cannot consume unauthorized tenant data.
- [ ] Background jobs preserve organization identity.
- [ ] Event consumers validate ownership independently.

# 166. Acceptance Criteria: Cache

- [ ] Tenant identity is included in tenant-scoped cache keys.
- [ ] Cache invalidation is tenant scoped.
- [ ] Cross-tenant cache reads fail.
- [ ] Cache poisoning tests pass.
- [ ] Shared cache infrastructure cannot bypass authorization.

# 167. Acceptance Criteria: Runtime

- [ ] Each execution has an isolated runtime context.
- [ ] Filesystem state is isolated.
- [ ] Processes are isolated.
- [ ] IPC is isolated.
- [ ] Environment variables are isolated.
- [ ] Credentials are run scoped.
- [ ] Host filesystem access is restricted.
- [ ] Host root access is prohibited.
- [ ] Unauthorized device access is prohibited.
- [ ] Runtime cleanup is mandatory.

# 168. Acceptance Criteria: Runtime Reuse

- [ ] Previous tenant processes are terminated.
- [ ] Previous tenant temporary files are removed.
- [ ] Previous credentials are removed.
- [ ] Network state is reset.
- [ ] Runtime caches are cleared.
- [ ] Telemetry state is reset.
- [ ] Cleanup failure quarantines the resource.
- [ ] Resource is not reused until cleanup verification succeeds.

# 169. Acceptance Criteria: Network

- [ ] Runtime network access is deny-by-default.
- [ ] Tenant-to-tenant runtime communication is blocked.
- [ ] Egress destinations are controlled.
- [ ] Ingress is restricted.
- [ ] Robot control networks are isolated.
- [ ] Management networks are protected.
- [ ] Network policy violations are detected.
- [ ] Cross-tenant network tests pass.

# 170. Acceptance Criteria: Lab Hardware

- [ ] Robot access is explicitly allocated.
- [ ] Device mappings are tenant/run scoped.
- [ ] One tenant cannot access another tenant's robot controller.
- [ ] Robot reassignment clears previous state.
- [ ] Resource cleanup is verified.
- [ ] Failed cleanup causes quarantine.
- [ ] Local safety remains independent of tenant authorization.

# 171. Acceptance Criteria: Quotas

- [ ] Organization quotas are defined.
- [ ] Concurrent job limits are enforced.
- [ ] Storage limits are enforced.
- [ ] API rate limits are tenant aware.
- [ ] Queue consumption is controlled.
- [ ] Resource usage is monitored.
- [ ] Quota bypass through multiple users/projects is prevented.
- [ ] Noisy-neighbour tests pass.

# 172. Acceptance Criteria: Data Domains

- [ ] Projects are tenant isolated.
- [ ] Artifacts are tenant isolated.
- [ ] Bookings are tenant isolated.
- [ ] Credits are tenant isolated.
- [ ] Jobs are tenant isolated.
- [ ] Runs are tenant isolated.
- [ ] Results are tenant isolated.
- [ ] Experiments are tenant isolated.
- [ ] Telemetry is tenant isolated.
- [ ] Video is tenant isolated.
- [ ] Logs are tenant isolated.

# 173. Acceptance Criteria: Administration

- [ ] Global admin access is explicit.
- [ ] Cross-tenant admin access is audited.
- [ ] Support access is scoped.
- [ ] Support access can expire.
- [ ] Break-glass access is controlled.
- [ ] Administrative scripts require explicit scope.
- [ ] Production tenant mutations are auditable.

# 174. Acceptance Criteria: Backup and Recovery

- [ ] Backups preserve tenant boundaries.
- [ ] Restore access is restricted.
- [ ] Tenant exports contain only authorized data.
- [ ] Tenant deletion does not affect other organizations.
- [ ] Restore testing includes tenant isolation.
- [ ] Backup isolation is periodically reviewed.

# 175. Acceptance Criteria: Testing

- [ ] Cross-tenant PostgreSQL tests pass.
- [ ] RLS tests pass.
- [ ] API IDOR tests pass.
- [ ] Object-storage tests pass.
- [ ] Queue tests pass.
- [ ] Cache tests pass.
- [ ] Runtime isolation tests pass.
- [ ] Network isolation tests pass.
- [ ] Telemetry isolation tests pass.
- [ ] Resource reuse tests pass.
- [ ] Noisy-neighbour tests pass.
- [ ] Penetration tests cover tenant isolation.

# 176. Acceptance Criteria: Production

- [ ] Tenant isolation is documented.
- [ ] Production RLS is validated.
- [ ] Object-storage policies are validated.
- [ ] Runtime isolation is validated.
- [ ] Network segmentation is validated.
- [ ] Quotas are operational.
- [ ] Monitoring is operational.
- [ ] Isolation alerts are operational.
- [ ] Incident response is tested.
- [ ] Independent security review is complete.

# 177. Final Tenant Isolation Invariants

The following invariants are mandatory:

1. Organization is the primary customer tenant boundary.
2. Every customer-owned resource has an authoritative organization relationship.
3. Tenant context originates from authenticated identity.
4. Client-provided tenant identity cannot override server-derived identity.
5. PostgreSQL access is tenant scoped.
6. RLS provides database-level defense in depth.
7. Missing tenant context fails closed.
8. Connection pools cannot leak tenant context.
9. Object storage is tenant isolated.
10. Object listing cannot enumerate another tenant's data.
11. Signed object URLs are short-lived and authorization-gated.
12. Background workers preserve tenant context.
13. Caches preserve tenant context.
14. Queues preserve tenant context.
15. Telemetry preserves tenant context.
16. Runtime filesystem state is isolated.
17. Runtime credentials are tenant/run scoped.
18. Customer workloads cannot access host secrets.
19. Customer workloads cannot access another tenant's devices.
20. Tenant runtimes cannot directly communicate with one another.
21. Robot control networks remain protected from general customer networks.
22. Shared resources are reset before tenant reassignment.
23. Failed cleanup causes resource quarantine.
24. Organization quotas prevent uncontrolled resource monopolization.
25. Tenant isolation controls are continuously tested.
26. Administrative cross-tenant access is explicit and audited.
27. Support access is delegated and time limited.
28. Backup and restore operations preserve tenant boundaries.
29. Cross-tenant security failures trigger incident response.
30. Tenant isolation never overrides local physical robot safety.

# 178. Final Tenant Isolation Architecture

    +-----------------------------------------------------------------------+
    |                         KRITVA RAAS                                  |
    +-----------------------------------------------------------------------+
                              |
                              v
                     +-------------------+
                     | Authentication    |
                     +---------+---------+
                               |
                               v
                     +-------------------+
                     | Tenant Context    |
                     | organization_id   |
                     +---------+---------+
                               |
                +--------------+---------------+
                |                              |
                v                              v
        +---------------+              +---------------+
        | Authorization |              | Quota Policy  |
        +-------+-------+              +-------+-------+
                |                              |
                +--------------+---------------+
                               |
                               v
                    +---------------------+
                    | Application Layer  |
                    +----------+----------+
                               |
                +--------------+---------------+
                |              |                |
                v              v                v
          PostgreSQL      Object Storage      Queue
             |                 |                |
             v                 v                v
            RLS          Tenant Namespace   Tenant Context
             |                 |                |
             +-----------------+----------------+
                               |
                               v
                     +-------------------+
                     | Execution Control |
                     +---------+---------+
                               |
                +--------------+---------------+
                |                              |
                v                              v
          Runtime Sandbox                Lab Agent
                |                              |
                v                              v
          Isolated Run                 Isolated Resource
                                               |
                                               v
                                            Robot

    Shared Resource Reuse:

    Tenant A
       |
       v
    Execution
       |
       v
    Stop
       |
       v
    Cleanup
       |
       v
    Credential Removal
       |
       v
    Filesystem Reset
       |
       v
    Network Reset
       |
       v
    Verification
       |
       +---- FAIL ----> QUARANTINE
       |
       v
    Tenant B Allocation

The definitive tenant-isolation principle is:

> Kritva RaaS shall treat the Organization as the primary customer isolation
> boundary and shall enforce that boundary consistently across PostgreSQL,
> object storage, APIs, asynchronous workers, caches, queues, telemetry,
> runtime environments, laboratory networks, physical resources and shared
> infrastructure. PostgreSQL RLS, application authorization, repository
> filtering, object-storage policy, runtime sandboxing and network segmentation
> shall operate as defense-in-depth controls rather than relying on a single
> mechanism. Every asynchronous and physical execution path shall preserve
> tenant identity, shared resources shall be securely reset before reuse, and
> quotas shall prevent noisy neighbours from compromising service availability.
> Cross-tenant access shall fail closed, isolation shall be continuously tested,
> and any suspected isolation breach shall trigger immediate containment,
> investigation and remediation.
