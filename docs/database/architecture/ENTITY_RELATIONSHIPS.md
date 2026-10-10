# Kritva RaaS Entity Relationships

## 1. Document Control

| Item | Value |
|---|---|
| Document | Entity Relationships |
| Path | `docs/database/architecture/ENTITY_RELATIONSHIPS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Relationship Model | Relational, domain-oriented |
| Tenancy | Organization-based logical multi-tenancy |
| Primary Authority | PostgreSQL for structured business state |
| Phase Coverage | Phase 0–Phase 8 |
| Relationship Principle | Explicit ownership, controlled references, auditable state |

# 2. Purpose

This document defines the production-grade relationship model for Kritva RaaS.

It complements:

    docs/database/architecture/DATABASE_ARCHITECTURE.md
    docs/database/architecture/DATA_MODEL.md

The purpose is to make the relationships between all major entities explicit,
including:

- cardinality;
- ownership;
- foreign keys;
- aggregate boundaries;
- cascade behavior;
- restriction behavior;
- cross-domain references;
- relationship tables;
- tenant propagation;
- lifecycle dependencies.

# 3. Scope

This document covers relationships among:

- Users;
- Organizations;
- Memberships;
- Roles;
- Projects;
- Platforms;
- Platform Versions;
- Capabilities;
- Labs;
- Lab Agents;
- Resources;
- Robots;
- Builds;
- Artifacts;
- Credit Plans;
- Wallets;
- Ledger Entries;
- Bookings;
- Jobs;
- Runs;
- Results;
- Experiments;
- Events;
- Audit Records;
- Idempotency records;
- Reconciliation records.

# 4. Non-Goals

This document does not define:

- physical SQL DDL;
- complete API schemas;
- frontend relationships;
- final ORM mappings;
- cloud-provider-specific database topology;
- raw telemetry schema;
- video storage;
- binary artifact internals.

# 5. Relationship Principles

The relationship architecture follows these principles:

1. Ownership must be explicit.
2. Tenant ownership must be unambiguous.
3. Aggregate roots control their dependent entities.
4. Historical records are preserved.
5. Destructive cascades are avoided for business history.
6. Foreign keys protect referential integrity.
7. Cross-domain references use stable IDs.
8. Cross-domain business operations are coordinated by application services.
9. Relationship tables are used for true many-to-many associations.
10. Platform configuration is globally owned.
11. Customer execution state is organization-owned.
12. Physical robot identity is operationally owned.
13. Financial history is append-oriented.
14. Events and audit records are not ordinary child records.
15. Database deletion must not erase required historical truth.
16. Physical safety state is not owned by cloud relationship state.

# 6. Relationship Vocabulary

| Term | Meaning |
|---|---|
| Parent | Referenced entity |
| Child | Entity holding a relationship to parent |
| FK | Foreign key |
| Cardinality | Number of related records |
| Aggregate | Transactional consistency boundary |
| Aggregate Root | Entity controlling an aggregate |
| Composition | Strong lifecycle ownership |
| Association | Independent relationship |
| Restrict | Prevent deletion while references exist |
| Cascade | Delete dependent records automatically |
| Set Null | Remove optional reference |
| Cross-Domain Reference | Relationship across logical module boundaries |

# 7. Cardinality Notation

The diagrams use:

    1       exactly one
    0..1    zero or one
    1..N    one or more
    0..N    zero or more

Examples:

    Organization 1 ---- 0..N Project

means one Organization may own zero or many Projects.

# 8. Global Relationship Architecture

The high-level model is:

    User
      |
      | 0..N
      v
    Membership
      |
      | N..1
      v
    Organization
      |
      +---- 0..N Project
      |
      +---- 0..N Wallet
      |
      +---- 0..N Booking
      |
      +---- 0..N Job
      |
      +---- 0..N Run
      |
      +---- 0..N Result
      |
      +---- 0..N Experiment
      |
      +---- 0..N Audit Record

# 9. Execution Relationship

The principal execution chain is:

    Organization
         |
         +-- Project
               |
               +-- Artifact
               |
               +-- Booking
               |     |
               |     +-- Resource
               |
               +-- Job
                     |
                     +-- Run
                           |
                           +-- Result

The chain preserves tenant ownership while connecting customer work to
physical execution resources.

# 10. Platform Relationship

The platform hierarchy is:

    Platform
       |
       +-- Platform Version
       |
       +-- Capability
       |
       +-- Resource
             |
             +-- Robot

A Platform is globally defined.

A Resource is an execution allocation unit.

A Robot is a physical identity.

# 11. Lab Relationship

The Lab hierarchy is:

    Lab
      |
      +-- Lab Agent
      |
      +-- Resource
            |
            +-- Robot

One Lab may have multiple Lab Agents.

One Lab Agent may manage multiple Resources.

A Resource belongs to one Lab at a time.

# 12. Commercial Relationship

The commercial model is:

    Platform
       |
    Credit Plan
       |
    Wallet
       |
    Ledger Entry

The wallet belongs to an Organization and a Platform.

# 13. Booking Relationship

Booking connects customer intent with execution capacity:

    Organization
       |
    Project
       |
    Booking
       |
    Platform
       |
    Resource

Booking must reference a resource compatible with the requested Platform.

# 14. Job Relationship

A Job connects:

    Organization
       |
    Project
       |
    Artifact
       |
    Booking
       |
    Resource
       |
    Job
       |
    Run

A Job represents the control-plane execution request.

# 15. Run Relationship

Run represents an execution attempt:

    Job 1 ---- 0..N Run

The initial product may constrain this to one primary Run, while preserving
the data model's ability to support retries or attempts.

# 16. Result Relationship

    Run 1 ---- 0..N Result

The initial execution model may normally produce one primary result set, but
multiple result records may be needed for partial results, processing stages,
or future experiment outputs.

# 17. Experiment Relationship

An Experiment groups Runs:

    Experiment 1 ---- 0..N ExperimentRun
                              |
                              N
                              |
                              1
                             Run

The relationship is represented by a dedicated relationship table.

# 18. User and Organization

Cardinality:

    User 1 ---- 0..N Membership
    Organization 1 ---- 0..N Membership

This creates a many-to-many logical relationship:

    User N ---- N Organization

implemented through:

    Membership

# 19. Membership Relationship

Membership attributes include:

- `membership_id`;
- `user_id`;
- `organization_id`;
- `role_id`;
- `status`;
- `joined_at`;
- `updated_at`.

Relationship rules:

- User must exist.
- Organization must exist.
- Role must exist.
- Active duplicate membership is prohibited.

# 20. Membership Foreign Keys

    membership.user_id
        -> identity.user.user_id

    membership.organization_id
        -> organization.organization_id

    membership.role_id
        -> organization.role.role_id

# 21. Membership Delete Policy

Recommended:

- User deletion: RESTRICT while historical references require identity.
- Organization deletion: RESTRICT where memberships exist.
- Role deletion: RESTRICT if assigned.

Historical membership should normally be retained rather than cascaded away.

# 22. Role Relationship

A Role may be assigned to many Memberships:

    Role 1 ---- 0..N Membership

Role is configuration.

Membership is the assignment.

Role deletion should therefore be restricted while active or historical
references require it.

# 23. Organization and Project

Cardinality:

    Organization 1 ---- 0..N Project

Foreign key:

    project.organization_id
        -> organization.organization_id

Deletion:

    Organization -> Project: RESTRICT

Projects should not disappear because an organization record is removed.

# 24. Project and Build

Cardinality:

    Project 1 ---- 0..N Build

Foreign key:

    build.project_id
        -> project.project_id

A Build is subordinate to a Project.

Build records are historical execution metadata and should normally not be
automatically deleted.

# 25. Project and Artifact

Cardinality:

    Project 1 ---- 0..N Artifact

Foreign key:

    artifact.project_id
        -> project.project_id

Artifact history should survive project archival.

Project deletion should therefore be RESTRICTED where artifacts exist.

# 26. Project and Booking

Cardinality:

    Project 1 ---- 0..N Booking

Foreign key:

    booking.project_id
        -> project.project_id

A Booking cannot exist without a Project.

# 27. Project and Job

Cardinality:

    Project 1 ---- 0..N Job

Foreign key:

    job.project_id
        -> project.project_id

Historical Jobs must not disappear when a project is archived.

# 28. Project and Experiment

Cardinality:

    Project 1 ---- 0..N Experiment

Foreign key:

    experiment.project_id
        -> project.project_id

Experiments remain historical project data.

# 29. Platform and Platform Version

Cardinality:

    Platform 1 ---- 1..N Platform Version

Foreign key:

    platform_version.platform_id
        -> platform.platform_id

Platform deletion should be restricted while versions exist.

# 30. Platform Version and Capability

A platform version may provide many capabilities.

A capability may be provided by many platform versions.

Therefore:

    Platform Version N ---- N Capability

implemented using:

    platform_version_capability

# 31. Platform Capability Relationship Table

Representative attributes:

    platform_version_id
    capability_id
    required
    configuration
    created_at

Foreign keys:

    platform_version_capability.platform_version_id
        -> platform_version.platform_version_id

    platform_version_capability.capability_id
        -> capability.capability_id

# 32. Capability Delete Policy

A Capability cannot be deleted while referenced by a platform version.

Recommended:

    capability -> relationship: RESTRICT

Retirement should be represented through status rather than destructive
deletion.

# 33. Platform and Resource

Cardinality:

    Platform 1 ---- 0..N Resource

Foreign key:

    resource.platform_id
        -> platform.platform_id

A platform can have multiple physical or virtual execution resources.

# 34. Platform Version and Resource

A resource may identify its supported platform version where required.

Cardinality:

    Platform Version 1 ---- 0..N Resource

The exact relationship may be optional if Resource compatibility is modeled
through a separate capability/version table.

# 35. Resource and Lab

Cardinality:

    Lab 1 ---- 0..N Resource

Foreign key:

    resource.lab_id
        -> lab.lab_id

Lab deletion should be restricted while resources exist.

# 36. Lab and Lab Agent

Cardinality:

    Lab 1 ---- 0..N Lab Agent

Foreign key:

    lab_agent.lab_id
        -> lab.lab_id

Lab Agent deletion should normally be soft/administrative rather than
cascading resource history.

# 37. Lab Agent and Resource

Cardinality:

    Lab Agent 1 ---- 0..N Resource

Foreign key:

    resource.agent_id
        -> lab_agent.agent_id

Agent may be optional for a resource during registration or transition.

# 38. Lab Agent Delete Policy

A Lab Agent must not be deleted if resources depend on it.

Preferred:

    Lab Agent -> Resource: RESTRICT

Retire or deactivate the Agent instead.

# 39. Resource and Robot

Initial model:

    Resource 1 ---- 0..1 Robot

A Resource may represent:

- physical robot;
- simulator;
- virtual execution environment.

Robot is therefore optional.

# 40. Robot and Resource

Foreign key:

    robot.resource_id
        -> lab.resource_id

The relationship should be unique where one Resource represents one physical
Robot.

# 41. Robot Replacement

When a robot is replaced:

    Old Robot
       |
    Historical Runs
       |
    Retired

    New Robot
       |
    New Resource Identity or controlled reassignment

Historical Runs must not be rewritten to reference the new robot.

# 42. Build and Platform

Cardinality:

    Platform 1 ---- 0..N Build

Foreign key:

    build.platform_id
        -> platform.platform_id

Build metadata identifies the intended target.

# 43. Build and Platform Version

Cardinality:

    Platform Version 1 ---- 0..N Build

Foreign key:

    build.platform_version_id
        -> platform_version.platform_version_id

This supports compatibility traceability.

# 44. Build and Artifact

Cardinality:

    Build 1 ---- 0..N Artifact

An initial workflow may produce one artifact.

The relationship remains one-to-many to support:

- different packaging variants;
- retries;
- platform targets;
- artifact versions.

# 45. Artifact and Platform

Cardinality:

    Platform 1 ---- 0..N Artifact

Foreign key:

    artifact.platform_id
        -> platform.platform_id

Artifact and resource platform compatibility must be validated before
execution.

# 46. Artifact and Platform Version

Cardinality:

    Platform Version 1 ---- 0..N Artifact

Foreign key:

    artifact.platform_version_id
        -> platform_version.platform_version_id

# 47. Artifact and Object Storage

The binary object is not a relational child record.

Relationship:

    Artifact 1 ---- 1 Object Storage Object

The database stores the reference.

Object storage owns the binary payload.

# 48. Artifact Deletion

Artifacts should normally be:

- archived;
- revoked;
- expired.

Hard deletion should be restricted where historical Jobs or Runs reference
the artifact.

# 49. Credit Plan and Platform

Cardinality:

    Platform 1 ---- 0..N Credit Plan

Foreign key:

    credit_plan.platform_id
        -> platform.platform_id

A credit plan belongs to one platform credit type.

# 50. Credit Plan and Wallet

A wallet may be associated with a plan for commercial tracking, but the
authoritative relationship is:

    Organization + Platform -> Wallet

A plan is a product offering, not the permanent identity of a wallet.

# 51. Organization and Wallet

Cardinality:

    Organization 1 ---- 0..N Wallet

Foreign key:

    wallet.organization_id
        -> organization.organization_id

A typical organization has one active wallet per platform.

# 52. Wallet and Platform

Cardinality:

    Platform 1 ---- 0..N Wallet

Foreign key:

    wallet.platform_id
        -> platform.platform_id

Recommended uniqueness:

    UNIQUE(organization_id, platform_id)

for one active wallet per platform.

# 53. Wallet and Ledger

Cardinality:

    Wallet 1 ---- 0..N Ledger Entry

Foreign key:

    ledger_entry.wallet_id
        -> wallet.wallet_id

Ledger entries are dependent for relationship integrity but must not be
deleted automatically.

# 54. Ledger Delete Policy

    Wallet -> Ledger: RESTRICT

Wallet archival must preserve financial history.

# 55. Booking and Wallet

Booking may reserve or consume credits associated with a Wallet.

This is a business relationship rather than necessarily a direct FK.

If persisted, the booking should reference:

    wallet_id

This improves financial traceability.

# 56. Booking and Platform

Cardinality:

    Platform 1 ---- 0..N Booking

Foreign key:

    booking.platform_id
        -> platform.platform_id

# 57. Booking and Resource

Cardinality:

    Resource 1 ---- 0..N Booking

Foreign key:

    booking.resource_id
        -> resource.resource_id

The resource must support the booking platform.

# 58. Booking and Project

Cardinality:

    Project 1 ---- 0..N Booking

A booking must remain inside the project's organization.

# 59. Booking and User

Cardinality:

    User 1 ---- 0..N Booking

The creator/actor reference should be retained:

    booking.created_by
        -> user.user_id

The actor does not necessarily own the booking.

# 60. Booking Time Relationship

Booking is a temporal relationship with Resource:

    Resource
       |
       +-- Booking [start, end]
       +-- Booking [start, end]
       +-- Booking [start, end]

Confirmed bookings for an exclusive resource must not overlap.

# 61. Booking Delete Policy

Bookings should not be hard-deleted.

Use status:

- CANCELLED;
- EXPIRED;
- COMPLETED.

Historical booking records are required for commercial and operational
analysis.

# 62. Job and Artifact

Cardinality:

    Artifact 1 ---- 0..N Job

Foreign key:

    job.artifact_id
        -> artifact.artifact_id

An artifact may be used by multiple Jobs.

# 63. Job and Booking

Cardinality:

    Booking 1 ---- 0..N Job

The initial model may enforce:

    Booking 1 ---- 0..1 active Job

but should allow historical retries where product semantics require them.

# 64. Job and Resource

Cardinality:

    Resource 1 ---- 0..N Job

Foreign key:

    job.resource_id
        -> resource.resource_id

Resource assignment may occur after Job creation.

Therefore the FK may initially be nullable.

# 65. Job and Organization

Cardinality:

    Organization 1 ---- 0..N Job

The Job must retain direct organization scope even when ownership can be
derived through Project.

# 66. Job and Project

Cardinality:

    Project 1 ---- 0..N Job

The database should validate consistency:

    job.organization_id
        ==
    project.organization_id

# 67. Job and Run

Cardinality:

    Job 1 ---- 0..N Run

Run is historically dependent on Job.

Deleting a Job should therefore be RESTRICTED.

# 68. Run and Resource

Cardinality:

    Resource 1 ---- 0..N Run

The resource identifies where execution occurred.

Historical Runs must preserve the resource identity even after the resource
is retired.

# 69. Run and Robot

Robot identity may be derived through Resource.

A direct `robot_id` snapshot/reference may also be retained when physical
traceability is critical.

Recommended execution record:

    run.resource_id
    run.robot_id [nullable for virtual resources]

This avoids losing physical identity after resource reassignment.

# 70. Run and Result

Cardinality:

    Run 1 ---- 0..N Result

Result deletion should normally be controlled by retention policy rather than
automatic cascade.

# 71. Experiment and Project

Cardinality:

    Project 1 ---- 0..N Experiment

An Experiment is a customer-owned analytical entity.

# 72. Experiment and Run

Logical cardinality:

    Experiment N ---- N Run

Implemented by:

    experiment_run

# 73. Experiment Run Relationship Table

Representative attributes:

    experiment_id
    run_id
    label
    sequence
    role
    added_by
    added_at

Foreign keys:

    experiment_run.experiment_id
        -> experiment.experiment_id

    experiment_run.run_id
        -> execution.run.run_id

# 74. Experiment Run Delete Policy

Removing an experiment/run association must not delete the Run.

Therefore:

    Experiment -> ExperimentRun: CASCADE

but:

    ExperimentRun -> Run: RESTRICT/no delete cascade

In practice the relationship row may simply be deleted.

# 75. Event Relationships

Events reference resources rather than owning them.

Example:

    event.resource_type = "job"
    event.resource_id   = job_id

The Event does not become a child of the Job lifecycle.

Therefore event deletion must not be tied to domain-row deletion.

# 76. Event Tenant Context

Tenant-aware events may contain:

    organization_id
    project_id

Global platform events may have no organization.

The event schema must support both.

# 77. Audit Relationships

Audit records reference:

- actor;
- organization;
- resource type;
- resource ID.

Audit records are historical evidence, not lifecycle children.

Deleting a business entity must not cascade-delete its audit history.

# 78. Idempotency Relationships

Idempotency records reference the actor and organization where applicable.

They do not own the business entity.

Example:

    idempotency_key
       |
    operation
       |
    resulting Job / Booking / Ledger operation

The resulting entity must survive idempotency-record expiration.

# 79. Reconciliation Relationships

Reconciliation references:

- resource;
- Job;
- Run;
- Lab Agent;
- other externally controlled entities.

It represents an operational state comparison.

It does not own the referenced entity.

# 80. Foreign Key Map

| Child | FK | Parent | Delete |
|---|---|---|---|
| Membership | user_id | User | RESTRICT |
| Membership | organization_id | Organization | RESTRICT |
| Membership | role_id | Role | RESTRICT |
| Project | organization_id | Organization | RESTRICT |
| Build | project_id | Project | RESTRICT |
| Build | platform_id | Platform | RESTRICT |
| Build | platform_version_id | Platform Version | RESTRICT |
| Artifact | project_id | Project | RESTRICT |
| Artifact | build_id | Build | RESTRICT |
| Artifact | platform_id | Platform | RESTRICT |
| Artifact | platform_version_id | Platform Version | RESTRICT |
| Platform Version | platform_id | Platform | RESTRICT |
| Platform Capability | platform_version_id | Platform Version | CASCADE |
| Platform Capability | capability_id | Capability | RESTRICT |
| Lab Agent | lab_id | Lab | RESTRICT |
| Resource | lab_id | Lab | RESTRICT |
| Resource | agent_id | Lab Agent | RESTRICT/SET NULL |
| Resource | platform_id | Platform | RESTRICT |
| Robot | resource_id | Resource | RESTRICT |
| Credit Plan | platform_id | Platform | RESTRICT |
| Wallet | organization_id | Organization | RESTRICT |
| Wallet | platform_id | Platform | RESTRICT |
| Ledger | wallet_id | Wallet | RESTRICT |
| Booking | organization_id | Organization | RESTRICT |
| Booking | project_id | Project | RESTRICT |
| Booking | platform_id | Platform | RESTRICT |
| Booking | resource_id | Resource | RESTRICT |
| Booking | created_by | User | RESTRICT/SET NULL |
| Job | organization_id | Organization | RESTRICT |
| Job | project_id | Project | RESTRICT |
| Job | artifact_id | Artifact | RESTRICT |
| Job | booking_id | Booking | RESTRICT |
| Job | resource_id | Resource | RESTRICT |
| Run | job_id | Job | RESTRICT |
| Run | resource_id | Resource | RESTRICT |
| Run | robot_id | Robot | RESTRICT |
| Result | run_id | Run | RESTRICT |
| Experiment | project_id | Project | RESTRICT |
| Experiment Run | experiment_id | Experiment | CASCADE |
| Experiment Run | run_id | Run | RESTRICT |
| Audit | organization_id | Organization | RESTRICT |
| Audit | actor_id | User | RESTRICT/SET NULL |
| Idempotency | organization_id | Organization | RESTRICT |
| Reconciliation | resource_id | Resource | RESTRICT |

# 81. Cascade Philosophy

The default rule is:

> Do not cascade-delete business history.

Cascade is appropriate mainly for pure relationship rows whose deletion
cannot destroy independent business meaning.

Good candidate:

    Platform Version
        |
    Platform Capability
        |
    CASCADE

Good candidate:

    Experiment
        |
    Experiment Run relationship
        |
    CASCADE

Poor candidate:

    Organization
        |
    Jobs
        |
    CASCADE

# 82. Restrict Philosophy

RESTRICT is preferred for:

- financial history;
- bookings;
- Jobs;
- Runs;
- results;
- audit;
- artifacts;
- resources;
- historical identity.

This forces explicit archival/retirement decisions.

# 83. Set Null Philosophy

SET NULL is appropriate for optional actor or operational references where
history must remain but the referenced entity may become inactive.

Example:

    booking.created_by -> User

may use SET NULL only if policy permits user deletion/anonymization.

# 84. Aggregate Boundaries

Recommended aggregate roots:

| Aggregate Root | Main Members |
|---|---|
| Organization | Memberships |
| Project | Project configuration |
| Platform | Platform versions/capabilities |
| Lab | Lab configuration |
| Resource | Resource operational state |
| Wallet | Current balance |
| Booking | Booking state |
| Job | Job state |
| Run | Run state |
| Experiment | Experiment relationships |

Some dependent records remain separate aggregates because of lifecycle and
retention requirements.

# 85. Organization Aggregate

Organization controls:

- memberships;
- organization settings.

Projects, Jobs and financial records are organization-owned but should not
be loaded as one transactional aggregate.

# 86. Project Aggregate

Project controls project-level configuration.

It does not own the complete lifecycle of:

- Artifacts;
- Bookings;
- Jobs;
- Runs.

Those entities require independent transaction boundaries.

# 87. Platform Aggregate

Platform controls:

- versions;
- capability configuration.

Platform should not own physical resource lifecycle.

# 88. Resource Aggregate

Resource controls operational resource metadata.

Robot is a physical identity associated with Resource.

Bookings and Runs reference Resource but are separate aggregates.

# 89. Wallet Aggregate

Wallet controls:

- balance;
- transactional credit operations.

Ledger history is part of the financial consistency boundary.

# 90. Booking Aggregate

Booking controls:

- time window;
- resource assignment;
- booking state;
- reservation-related credit state.

It should not directly perform robot operations.

# 91. Job Aggregate

Job controls:

- execution request;
- state;
- artifact reference;
- booking reference;
- resource assignment.

Run is separate enough to support execution-attempt history.

# 92. Run Aggregate

Run controls:

- execution attempt;
- execution state;
- terminal result relationship.

It references external robot/resource state without owning physical safety.

# 93. Experiment Aggregate

Experiment controls its membership relationship to Runs.

It does not own the Runs.

# 94. Cross-Domain Boundary

Cross-domain relationships should be represented through stable IDs.

Example:

    Booking Service
        |
        +-- platform_id
        +-- resource_id
        +-- project_id
        +-- wallet_id

The Booking module does not directly manipulate Platform or Wallet internal
tables outside defined repository/application contracts.

# 95. Domain Reference Rules

A cross-domain reference must:

- identify the referenced entity;
- validate authorization;
- validate compatibility;
- preserve tenant consistency;
- avoid hidden cascade behavior.

# 96. Tenant Consistency

For customer-owned relationships:

    Booking.organization_id
        ==
    Project.organization_id

    Job.organization_id
        ==
    Project.organization_id

    Artifact.organization_id
        ==
    Project.organization_id

    Run.organization_id
        ==
    Job.organization_id

Database constraints should enforce these relationships where practical.

# 97. Tenant-Scoped Foreign Keys

Where strong integrity is required, composite references may be considered:

    (organization_id, project_id)
        ->
    project(organization_id, project_id)

This prevents accidental cross-tenant references at the database level.

# 98. Rationale for Composite Tenant Keys

Composite tenant-aware foreign keys provide defense in depth.

They make invalid states such as:

    Job.organization_id = A
    Job.project_id      = ProjectOwnedByB

harder to represent.

The tradeoff is additional index and schema complexity.

# 99. Global Entity References

Global entities such as Platform do not require tenant IDs.

Examples:

- Platform;
- Platform Version;
- Capability;
- Lab;
- Resource.

Authorization still applies to administrative operations.

# 100. Resource Access Relationship

A customer does not own a physical Resource merely because it has a Booking.

The relationship is:

    Organization
        |
    Booking
        |
    Resource

The Booking grants temporary execution rights.

# 101. Resource Ownership

Resource ownership belongs to the RaaS/Lab administrative domain.

Customer ownership should not be inferred from booking.

# 102. Artifact Access

A customer owns/controls its Artifact through Project ownership.

The Lab may access the artifact only through an authorized execution workflow.

# 103. Credit Access

A user accesses a Wallet through organization membership and role.

The wallet itself belongs to the Organization.

# 104. Financial Relationship to Job

Credit consumption should reference the business operation:

    Ledger Entry
       |
       +-- reference_type = JOB
       +-- reference_id   = job_id

This provides traceability without tightly coupling ledger schema to every
commercial workflow.

# 105. Financial Relationship to Booking

A ledger entry may instead reference a Booking when credits are reserved or
consumed at booking time.

The exact consumption point must be consistent across product policy.

# 106. Booking-to-Credit Flow

    Booking Request
         |
    Quote Credits
         |
    Validate Wallet
         |
    Reserve/Consume
         |
    Confirm Booking
         |
    Ledger Entry
         |
    Booking Confirmed

The transaction boundary must be explicit.

# 107. Execution-to-Credit Flow

If credits are consumed at execution:

    Job Start
       |
    Validate Wallet
       |
    Consume Credits
       |
    Start Run

If execution fails before actual consumption, policy determines whether the
transaction is reversed/refunded.

# 108. Relationship State Validation

Application services must validate:

- parent exists;
- parent is active;
- relationship is allowed;
- tenant matches;
- lifecycle state permits operation.

# 109. Historical References

Historical records should retain references to:

- Project;
- Artifact;
- Platform;
- Resource;
- Robot;
- User;
- Organization.

If anonymization is required, immutable internal IDs should remain while
personally identifying attributes are minimized or anonymized.

# 110. Archive Instead of Delete

Preferred lifecycle:

    ACTIVE
      |
    ARCHIVED / RETIRED
      |
    HISTORICAL

rather than:

    ACTIVE
      |
    DELETE

This is particularly important for:

- Projects;
- Platforms;
- Resources;
- Robots;
- Artifacts;
- Bookings;
- Jobs.

# 111. Relationship Versioning

Relationships involving configuration may need effective dates.

Examples:

- Platform Version capability;
- Credit Plan rates;
- Resource platform compatibility.

Historical execution must preserve the effective configuration used at the
time.

# 112. Snapshot Versus Reference

Where historical accuracy is critical, retain both:

- stable reference ID;
- relevant execution snapshot.

For example, Run may store:

    platform_id
    platform_version_id
    runtime_version
    sdk_version

This avoids historical ambiguity after configuration changes.

# 113. Resource Snapshot

A Run may store:

    resource_id
    robot_id
    platform_id
    platform_version_id

This preserves the execution context.

# 114. Artifact Snapshot

Job/Run should reference immutable Artifact identity.

If artifact metadata changes, the digest remains the execution truth.

# 115. User Actor References

Actor relationships should be retained where important:

- `created_by`;
- `cancelled_by`;
- `approved_by`;
- `adjusted_by`.

Actor fields may be nullable where user lifecycle policies require
anonymization.

# 116. Relationship Audit

Relationship-changing actions requiring audit include:

- organization membership;
- role assignment;
- platform capability changes;
- resource registration;
- robot replacement;
- artifact revocation;
- booking cancellation;
- credit adjustment;
- Job cancellation;
- administrative configuration.

# 117. Relationship Query Patterns

Important relationship queries:

    Organization -> Projects

    Organization -> Wallets

    Project -> Artifacts

    Project -> Bookings

    Project -> Jobs

    Job -> Runs

    Run -> Results

    Experiment -> Runs

    Platform -> Resources

    Lab -> Resources

    Resource -> Bookings

    Resource -> Runs

# 118. Relationship Index Requirements

Foreign-key columns require indexes where parent-to-child queries are
expected.

Examples:

    project.organization_id

    artifact.project_id

    booking.resource_id

    job.project_id

    run.job_id

    result.run_id

    experiment_run.experiment_id

    experiment_run.run_id

# 119. Relationship Integrity Testing

Tests should verify:

- valid parent/child creation;
- invalid parent references;
- cross-tenant references;
- deletion restrictions;
- allowed cascades;
- state-dependent relationships.

# 120. Phase Mapping

| Phase | Relationship Focus |
|---|---|
| Phase 0 | Relationship conventions |
| Phase 1 | Identity and tenancy |
| Phase 2 | Platform/resource/artifact |
| Phase 3 | Job/Run/reconciliation |
| Phase 4 | Credit/booking |
| Phase 5 | Remote execution |
| Phase 6 | Lab/robot |
| Phase 7 | Result/experiment/events |
| Phase 8 | Scale and historical evolution |

# 121. Phase 0

Define:

- FK naming;
- cardinality notation;
- aggregate boundaries;
- cascade policy;
- tenant relationship strategy.

Acceptance:

- [ ] relationship architecture approved;
- [ ] delete policy approved;
- [ ] ownership map approved.

# 122. Phase 1

Implement:

- User;
- Organization;
- Membership;
- Role;
- Project.

Acceptance:

- [ ] many-to-many User/Organization works;
- [ ] tenant relationships are enforced;
- [ ] role assignment is valid.

# 123. Phase 2

Implement:

- Platform;
- Platform Version;
- Capability;
- Lab;
- Lab Agent;
- Resource;
- Robot;
- Build;
- Artifact.

Acceptance:

- [ ] platform/resource relationships work;
- [ ] capability relationships work;
- [ ] artifact compatibility is enforceable.

# 124. Phase 3

Implement:

- Job;
- Run;
- Result preparation;
- Idempotency;
- Reconciliation references.

Acceptance:

- [ ] Job/Run relationships work;
- [ ] resource assignment is consistent;
- [ ] historical execution is preserved.

# 125. Phase 4

Implement:

- Credit Plan;
- Wallet;
- Ledger;
- Booking.

Acceptance:

- [ ] platform-specific wallets work;
- [ ] ledger references are auditable;
- [ ] bookings cannot overlap;
- [ ] tenant consistency is enforced.

# 126. Phase 5

Implement remote execution relationship:

    Booking
       |
    Job
       |
    Run
       |
    Resource
       |
    Lab Agent

Acceptance:

- [ ] remote execution references are durable;
- [ ] uncertain state is represented;
- [ ] duplicate execution is prevented.

# 127. Phase 6

Implement physical Lab relationships:

    Lab
      |
    Agent
      |
    Resource
      |
    Robot

Acceptance:

- [ ] robot identity remains historical;
- [ ] resource replacement works;
- [ ] safety state remains locally authoritative.

# 128. Phase 7

Implement:

- Result;
- Experiment;
- Experiment Run;
- Event;
- extended Audit.

Acceptance:

- [ ] Runs can be grouped;
- [ ] Results trace to Runs;
- [ ] events correlate to resources;
- [ ] audit records preserve history.

# 129. Phase 8

Optimize:

- relationship indexes;
- partitioning;
- historical retention;
- reporting;
- read scaling.

Acceptance:

- [ ] high-volume relationships are measured;
- [ ] query plans are validated;
- [ ] historical data remains consistent.

# 130. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect cardinality | High | Explicit ER review |
| Cascading deletion | Critical | Restrict by default |
| Cross-tenant FK | Critical | Tenant-aware validation |
| Orphaned records | High | Foreign keys |
| Excessive coupling | High | Aggregate boundaries |
| Historical loss | Critical | Archive/restrict |
| Resource ambiguity | High | Resource/Robot separation |
| Platform mismatch | High | Compatibility relationships |
| Booking race | Critical | Transactional conflict control |
| Duplicate execution | Critical | Job/Run/reconciliation |
| Financial inconsistency | Critical | Wallet/ledger aggregate |
| Event lifecycle coupling | Medium | Event as independent fact |
| Audit deletion | Critical | Restrict |
| Large relationship tables | Medium | Index/partition planning |
| Overuse of JSON | Medium | Relational core |
| Premature composite keys | Medium | Use selectively |
| Migration complexity | Medium | Controlled evolution |

# 131. Open Questions

1. Final physical FK naming convention.
2. Composite tenant FK adoption scope.
3. Final RLS strategy.
4. Exact Role permission model.
5. Exact Platform Version relationship to Resource.
6. Whether Resource may change Platform over its lifetime.
7. Final Robot/Resource one-to-one policy.
8. Whether Run stores a direct Robot FK.
9. Final Booking/Job cardinality.
10. Exact credit reservation relationship.
11. Final ledger reference model.
12. Whether Experiment-to-Run is many-to-many permanently.
13. Final event persistence scope.
14. Final audit actor deletion policy.
15. Final anonymization policy.
16. Final soft-delete rules.
17. Final snapshot strategy.
18. Final partition strategy for relationship tables.
19. Final relationship migration framework.
20. Final reporting relationship model.

# 132. Full Acceptance Criteria

## Cardinality

- [ ] User/Organization many-to-many is explicit.
- [ ] Organization/Project one-to-many is explicit.
- [ ] Project/Build one-to-many is explicit.
- [ ] Project/Artifact one-to-many is explicit.
- [ ] Platform/Version one-to-many is explicit.
- [ ] Platform Version/Capability many-to-many is explicit.
- [ ] Lab/Agent one-to-many is explicit.
- [ ] Lab/Resource one-to-many is explicit.
- [ ] Agent/Resource one-to-many is explicit.
- [ ] Resource/Robot one-to-zero-or-one is explicit.
- [ ] Platform/Resource one-to-many is explicit.
- [ ] Wallet/Ledger one-to-many is explicit.
- [ ] Resource/Booking one-to-many is explicit.
- [ ] Artifact/Job one-to-many is explicit.
- [ ] Job/Run one-to-many is explicit.
- [ ] Run/Result one-to-many is explicit.
- [ ] Experiment/Run many-to-many is explicit.

## Foreign Keys

- [ ] All required FKs are identified.
- [ ] Parent ownership is clear.
- [ ] Optional FKs are identified.
- [ ] Historical FKs are protected.
- [ ] Tenant consistency is enforced.
- [ ] Cross-domain references use stable IDs.

## Cascade Rules

- [ ] Cascade is not used for business history.
- [ ] Relationship-table cascades are explicitly identified.
- [ ] Financial history uses RESTRICT.
- [ ] Audit history uses RESTRICT.
- [ ] Jobs/Runs use RESTRICT.
- [ ] Artifacts use RESTRICT.
- [ ] Resources use RESTRICT.
- [ ] Optional actor references may use SET NULL.
- [ ] Platform capability relationship may use CASCADE.

## Aggregates

- [ ] Organization aggregate is defined.
- [ ] Project aggregate is defined.
- [ ] Platform aggregate is defined.
- [ ] Resource aggregate is defined.
- [ ] Wallet aggregate is defined.
- [ ] Booking aggregate is defined.
- [ ] Job aggregate is defined.
- [ ] Run aggregate is defined.
- [ ] Experiment aggregate is defined.
- [ ] Cross-aggregate transactions are controlled.

## Tenant Isolation

- [ ] Organization ownership is explicit.
- [ ] Cross-tenant references are prevented.
- [ ] Tenant context is server-derived.
- [ ] Composite tenant FKs are evaluated.
- [ ] Cross-tenant tests are required.
- [ ] Administrative relationships are separately controlled.

## Commercial Relationships

- [ ] Platform-to-plan relationship exists.
- [ ] Organization-to-wallet relationship exists.
- [ ] Wallet-to-platform relationship exists.
- [ ] Wallet-to-ledger relationship exists.
- [ ] Booking-to-credit traceability exists.
- [ ] Credit consumption is auditable.
- [ ] Refund relationships are auditable.

## Execution Relationships

- [ ] Project-to-artifact relationship exists.
- [ ] Artifact-to-Job relationship exists.
- [ ] Booking-to-Job relationship exists.
- [ ] Job-to-Run relationship exists.
- [ ] Run-to-Result relationship exists.
- [ ] Resource-to-Run relationship exists.
- [ ] Robot execution identity can be preserved.
- [ ] Uncertain execution can be reconciled.

## Platform and Lab

- [ ] Platform/version relationship exists.
- [ ] Platform/capability relationship exists.
- [ ] Platform/resource relationship exists.
- [ ] Lab/resource relationship exists.
- [ ] Lab/agent relationship exists.
- [ ] Agent/resource relationship exists.
- [ ] Resource/robot relationship exists.
- [ ] Robot replacement preserves history.

## Historical Integrity

- [ ] Booking history is preserved.
- [ ] Credit history is preserved.
- [ ] Job history is preserved.
- [ ] Run history is preserved.
- [ ] Result metadata is preserved.
- [ ] Artifact history is preserved.
- [ ] Audit history is preserved.
- [ ] Event identity is preserved.
- [ ] Resource history is preserved.

## Relationship Tables

- [ ] Membership table is defined.
- [ ] Platform Version Capability table is defined.
- [ ] Experiment Run table is defined.
- [ ] Other many-to-many relationships are explicitly justified.
- [ ] Relationship tables have appropriate uniqueness constraints.
- [ ] Relationship rows do not own independent business state unless specified.

## Queryability

- [ ] Parent-to-child queries are indexed.
- [ ] Child-to-parent lookups are indexed.
- [ ] Tenant-scoped queries are indexed.
- [ ] Booking/resource queries are indexed.
- [ ] Job/run queries are indexed.
- [ ] Experiment/run queries are indexed.

## Lifecycle

- [ ] Archive versus delete policy is defined.
- [ ] Retirement is supported.
- [ ] Historical references remain valid.
- [ ] Deletion cannot silently destroy business history.
- [ ] Relationship state transitions are explicit.

# 133. Final Relationship Invariants

The Kritva RaaS relationship model must preserve these invariants:

1. Every tenant-owned entity has an unambiguous organization path.
2. A User may belong to many Organizations through Membership.
3. A Membership belongs to exactly one User and Organization.
4. A Project belongs to exactly one Organization.
5. A Build belongs to a Project.
6. An Artifact belongs to a Project and identifies its target Platform.
7. A Platform may have many Versions.
8. A Platform Version may provide many Capabilities.
9. A Capability may belong to many Platform Versions.
10. A Lab may contain many Resources.
11. A Lab Agent may manage many Resources.
12. A Resource belongs to one Lab at a time.
13. A Resource represents a Robot only when physical identity exists.
14. A Robot must preserve historical identity.
15. A Credit Plan belongs to one Platform.
16. A Wallet belongs to one Organization and Platform.
17. Ledger entries belong to one Wallet.
18. Ledger history is not cascade-deleted.
19. A Booking references one Resource and Platform.
20. Confirmed bookings for an exclusive Resource cannot overlap.
21. A Job references an accepted Artifact.
22. A Job belongs to one Organization and Project.
23. A Run belongs to a Job.
24. A Result belongs to a Run.
25. An Experiment groups Runs through a relationship table.
26. Events describe facts and do not own domain entities.
27. Audit records preserve history and do not cascade-delete.
28. Idempotency records protect operations but do not own results.
29. Reconciliation records describe uncertainty but do not own resources.
30. Cross-domain references are validated by application services.
31. Foreign keys protect persistence integrity.
32. RESTRICT is the default policy for historical business entities.
33. CASCADE is limited primarily to pure relationship rows.
34. SET NULL is limited to optional historical actor/reference relationships.
35. Physical safety state remains locally authoritative.

# 134. Final ER Diagram

The complete logical model is:

    +----------------+
    |      USER      |
    +----------------+
             |
             | 1:N
             v
    +----------------+
    |   MEMBERSHIP   |
    +----------------+
             |
             | N:1
             v
    +----------------+          +----------------+
    | ORGANIZATION   |----------|     WALLET     |
    +----------------+   1:N   +----------------+
       |       |                       |
       |       |                       | 1:N
       |       |                       v
       |       |                +----------------+
       |       |                |    LEDGER      |
       |       |                +----------------+
       |       |
       |       +----------------+
       |                        |
       | 1:N                    | 1:N
       v                        v
    +---------+             +---------+
    | PROJECT |             | BOOKING |
    +---------+             +---------+
       |   |                    |
       |   |                    | N:1
       |   |                    v
       |   |               +-----------+
       |   |               | RESOURCE  |
       |   |               +-----------+
       |   |
       |   +---------> BUILD
       |                |
       |                v
       |             ARTIFACT
       |                |
       |                | 1:N
       |                v
       |               JOB
       |                |
       |                | 1:N
       |                v
       |               RUN
       |                |
       |                | 1:N
       |                v
       |              RESULT
       |
       +---------> EXPERIMENT
                        |
                        | N:M
                        v
                   EXPERIMENT_RUN
                        |
                        v
                       RUN


    +----------------+
    |    PLATFORM    |
    +----------------+
       |       |
       |       +--------------------+
       |                            |
       | 1:N                        | 1:N
       v                            v
    PLATFORM VERSION          CREDIT PLAN
       |                            |
       | N:M                        |
       v                            |
    CAPABILITY                     |
                                    |
    +----------------+              |
    |    RESOURCE    |<-------------+
    +----------------+
       |
       | 0:1
       v
    +----------------+
    |     ROBOT      |
    +----------------+

    +----------------+
    |      LAB       |
    +----------------+
       |          |
       | 1:N      | 1:N
       v          v
    RESOURCE   LAB AGENT
                  |
                  | 1:N
                  v
               RESOURCE

# 135. Final Relationship Model

The complete relationship strategy is therefore:

    Identity
       |
    Organization
       |
    Project
       |
    Artifact
       |
    Booking
       |
    Job
       |
    Run
       |
    Result

with execution capability supplied independently by:

    Platform
       |
    Platform Version
       |
    Capability
       |
    Lab
       |
    Lab Agent
       |
    Resource
       |
    Robot

and commercial authorization supplied by:

    Platform
       |
    Credit Plan
       |
    Organization Wallet
       |
    Credit Ledger

while historical accountability is preserved through:

    Events
    Audit Records
    Idempotency Records
    Reconciliation Records

The governing principle is:

> **Kritva RaaS relationships must make ownership, tenant boundaries,
> execution dependencies and historical responsibility explicit. Business
> history must not disappear through cascading deletes; financial,
> booking and execution relationships must be transactionally safe;
> cross-domain references must preserve tenant and compatibility
> invariants; relationship tables must represent genuine many-to-many
> associations; and the database must distinguish customer intent,
> platform capability, physical resource identity and actual execution
> state.**
