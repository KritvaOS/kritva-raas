# Kritva RaaS Logical Data Model

## 1. Document Control

| Item | Value |
|---|---|
| Document | Logical Data Model |
| Path | `docs/database/architecture/DATA_MODEL.md` |
| Product | Kritva Robotics-as-a-Service |
| Primary Persistence | PostgreSQL |
| Data Model | Relational, domain-oriented |
| Tenancy | Organization-based logical multi-tenancy |
| Primary Authority | PostgreSQL for structured business state |
| Binary Storage | Object storage |
| Realtime Delivery | WebSocket/events |
| Phase Coverage | Phase 0–Phase 8 |

# 2. Purpose

This document defines the complete logical data model for Kritva RaaS.

It establishes the entities, attributes, relationships, lifecycle states,
ownership boundaries, constraints and invariants required to support:

- users;
- organizations;
- memberships;
- roles;
- projects;
- robot platforms;
- platform versions;
- labs;
- resources;
- robots;
- artifacts;
- builds;
- credit plans;
- wallets;
- ledger transactions;
- bookings;
- Jobs;
- Runs;
- results;
- experiments;
- events;
- audit records;
- idempotency;
- reconciliation.

The model is designed to support the complete product flow:

    Login
      |
    Organization
      |
    Project
      |
    Platform
      |
    Local Build
      |
    Artifact
      |
    Credit / Booking
      |
    Job
      |
    Run
      |
    Robot Resource
      |
    Result
      |
    Experiment

# 3. Scope

This document covers the logical business data model independent of a final
ORM, migration framework or cloud-provider implementation.

It defines:

- entity ownership;
- identifiers;
- attributes;
- relationships;
- lifecycle state;
- tenancy;
- financial relationships;
- execution relationships;
- audit relationships;
- event relationships;
- data integrity.

# 4. Non-Goals

This document does not define:

- physical PostgreSQL DDL;
- exact SQL migration files;
- REST endpoint schemas;
- frontend component state;
- robot firmware data structures;
- raw high-frequency robot telemetry;
- video frame storage;
- binary artifact contents;
- final payment-provider schema;
- final cloud-provider-specific implementation.

# 5. Data Model Principles

The data model follows these principles:

1. PostgreSQL is authoritative for structured business state.
2. Every customer-owned entity has an organization ownership path.
3. Domain ownership is explicit.
4. IDs are stable and non-reused.
5. State transitions are explicit.
6. Financial history is append-oriented.
7. Booking allocation is concurrency-safe.
8. Job and Run state is durable.
9. Large binary data belongs in object storage.
10. Events are immutable facts.
11. Audit records are append-oriented.
12. Realtime delivery is not durable business state.
13. Queue state is not authoritative.
14. Idempotency prevents duplicate side effects.
15. Soft deletion is preferred where history matters.
16. Database constraints enforce critical invariants.
17. Authorization is enforced independently of data ownership.
18. Physical safety remains locally authoritative.

# 6. Domain Boundaries

The logical model is divided into domains:

| Domain | Core Entities |
|---|---|
| Identity | User, external identity |
| Organization | Organization, Membership, Role |
| Project | Project |
| Platform | Platform, Platform Version, Capability |
| Lab | Lab, Resource, Robot, Lab Agent |
| Build | Build |
| Artifact | Artifact |
| Commercial | Credit Plan, Wallet, Ledger |
| Booking | Booking |
| Execution | Job, Run |
| Results | Result |
| Experiment | Experiment |
| Event | Event |
| Audit | Audit Record |
| System | Idempotency, Reconciliation |

# 7. Identifier Strategy

All primary business entities require stable unique identifiers.

Recommended external identifier format:

    UUID / UUID-compatible identifier

Identifiers must:

- be unique;
- be immutable;
- never be reused;
- not encode mutable business meaning;
- be safe to expose through APIs;
- support distributed correlation.

# 8. Organization as Tenant

An organization is the primary tenant boundary.

Conceptually:

    Organization
       |
       +-- Members
       +-- Projects
       +-- Credit Wallets
       +-- Bookings
       +-- Jobs
       +-- Runs
       +-- Results
       +-- Experiments
       +-- Audit Records

Some shared platform/lab configuration is global rather than tenant-owned.

# 9. User Entity

The User represents an application-level human identity.

Representative attributes:

| Attribute | Description |
|---|---|
| `user_id` | Stable identifier |
| `email` | Canonical user email |
| `display_name` | Display name |
| `status` | Account lifecycle |
| `external_identity_ref` | Identity-provider reference |
| `created_at` | Creation timestamp |
| `updated_at` | Last update |
| `last_login_at` | Last successful login |

Authentication secrets should normally remain with the identity provider.

# 10. User Rules

- Email uniqueness is enforced according to account policy.
- Disabled users cannot initiate new operations.
- User deletion must preserve required audit history.
- A user may belong to multiple organizations.
- User identity is separate from organization membership.

# 11. Organization Entity

Organization represents a tenant/customer boundary.

Attributes:

| Attribute | Description |
|---|---|
| `organization_id` | Stable ID |
| `name` | Organization name |
| `slug` | Unique human-readable identifier |
| `status` | Lifecycle status |
| `billing_email` | Billing contact |
| `created_at` | Creation time |
| `updated_at` | Last update |

# 12. Organization Rules

- Organization slug is unique.
- Archived organizations cannot create new Jobs.
- Organization ownership must remain identifiable.
- Organization deletion must respect retention and financial rules.
- Organization state must not bypass authorization.

# 13. Membership Entity

Membership connects a User to an Organization.

Attributes:

| Attribute | Description |
|---|---|
| `membership_id` | Stable ID |
| `organization_id` | Tenant |
| `user_id` | User |
| `status` | Membership state |
| `role_id` | Assigned role |
| `joined_at` | Membership start |
| `updated_at` | Last update |

# 14. Membership Rules

- A user cannot have duplicate active membership in the same organization.
- Membership status controls organizational access.
- Removing membership does not delete historical activity.
- At least one organization owner should normally remain.
- Role changes are auditable.

# 15. Role Entity

Role defines organization-level authorization.

Representative attributes:

| Attribute | Description |
|---|---|
| `role_id` | Stable ID |
| `name` | Role name |
| `description` | Human-readable description |
| `permissions` | Permission set |
| `scope` | Role scope |
| `created_at` | Creation time |

Initial logical roles may include:

- Owner;
- Admin;
- Developer;
- Researcher;
- Viewer;
- Billing Manager.

# 16. Role Rules

Roles define permissions, not ownership.

Authorization must verify:

    User
      |
    Membership
      |
    Role
      |
    Permission
      |
    Resource Ownership

The client must never be trusted to declare its own role.

# 17. Project Entity

A Project represents a customer development workspace.

Attributes:

| Attribute | Description |
|---|---|
| `project_id` | Stable ID |
| `organization_id` | Tenant |
| `name` | Project name |
| `description` | Optional description |
| `status` | Lifecycle state |
| `created_by` | Creating user |
| `created_at` | Creation time |
| `updated_at` | Last update |
| `archived_at` | Archive timestamp |

# 18. Project Rules

- Project belongs to exactly one organization.
- Project creator must have project-creation permission.
- Archived projects cannot normally create new artifacts or Jobs.
- Existing historical Runs remain accessible according to policy.
- Project ownership cannot silently change organization.

# 19. Platform Entity

Platform represents a robotic platform offered by RaaS.

Examples:

- Humanoid-A;
- Humanoid-B;
- future mobile robot;
- future manipulation platform.

Attributes:

| Attribute | Description |
|---|---|
| `platform_id` | Stable ID |
| `name` | Platform name |
| `slug` | Unique platform identifier |
| `description` | Description |
| `status` | Platform lifecycle |
| `architecture` | Target CPU architecture |
| `os_family` | Runtime OS family |
| `kritva_version` | Compatible KritvaOS |
| `sdk_version` | Compatible SDK |
| `created_at` | Creation time |
| `updated_at` | Last update |

# 20. Platform Version Entity

A platform may have multiple versions.

Attributes:

- `platform_version_id`;
- `platform_id`;
- `version`;
- `runtime_version`;
- `sdk_version`;
- `architecture`;
- `capabilities`;
- `status`;
- `effective_from`;
- `effective_until`.

Platform version determines artifact compatibility.

# 21. Capability Entity

Capabilities represent platform/resource capabilities.

Examples:

- camera;
- depth camera;
- lidar;
- arm;
- gripper;
- humanoid locomotion;
- EtherCAT;
- GPU;
- AI accelerator.

Attributes:

- `capability_id`;
- `name`;
- `category`;
- `version`;
- `description`.

# 22. Platform Capability Relationship

Platform capability association contains:

- `platform_id`;
- `platform_version_id`;
- `capability_id`;
- `required`;
- `configuration`.

A capability may be mandatory or optional.

# 23. Lab Entity

A Lab represents a physical or controlled execution location.

Attributes:

| Attribute | Description |
|---|---|
| `lab_id` | Stable ID |
| `name` | Lab name |
| `location` | Logical location |
| `status` | Lab state |
| `timezone` | Operational timezone |
| `description` | Description |
| `created_at` | Creation time |
| `updated_at` | Last update |

# 24. Lab Rules

- Lab must have a unique identity.
- Lab operational state is independent from cloud service health.
- Lab may contain multiple resources.
- Lab can be unavailable for maintenance.
- Safety state is not inferred solely from Lab status.

# 25. Lab Agent Entity

Lab Agent is the software boundary between cloud control and local Lab
resources.

Attributes:

- `agent_id`;
- `lab_id`;
- `name`;
- `status`;
- `version`;
- `capabilities`;
- `last_heartbeat_at`;
- `registered_at`;
- `updated_at`;
- `identity_reference`.

# 26. Lab Agent Rules

- Agent identity is unique.
- Agent must authenticate.
- Heartbeat determines connectivity health, not physical safety.
- Offline agents cannot receive new deployments.
- Agent registration and capability changes are audited.

# 27. Resource Entity

Resource represents an executable physical or virtual resource.

A resource is the allocation unit used by booking and execution.

Attributes:

| Attribute | Description |
|---|---|
| `resource_id` | Stable ID |
| `lab_id` | Lab |
| `platform_id` | Supported platform |
| `resource_type` | Robot/simulator/etc. |
| `name` | Resource name |
| `status` | Operational state |
| `allocation_state` | Free/reserved/busy |
| `health_state` | Health |
| `agent_id` | Owning Lab Agent |
| `created_at` | Creation |
| `updated_at` | Last update |

# 28. Robot Entity

Robot represents physical robot identity and metadata.

A Robot is a specialized Resource.

Attributes:

- `robot_id`;
- `resource_id`;
- `platform_id`;
- `serial_reference`;
- `model`;
- `hardware_revision`;
- `firmware_version`;
- `runtime_version`;
- `safety_state`;
- `maintenance_state`;
- `created_at`;
- `updated_at`.

# 29. Robot Rules

- Robot identity is unique.
- A robot belongs to one physical Lab at a time.
- Robot safety state is informational to the cloud.
- Local safety systems remain authoritative.
- A robot in maintenance cannot be booked.
- A robot in unsafe/unknown safety state cannot be automatically started.

# 30. Resource State

Resource operational status may include:

- `AVAILABLE`;
- `UNAVAILABLE`;
- `MAINTENANCE`;
- `FAULT`;
- `OFFLINE`;
- `RETIRED`.

Allocation state may include:

- `FREE`;
- `RESERVED`;
- `BUSY`;
- `RELEASING`.

Health state may include:

- `UNKNOWN`;
- `HEALTHY`;
- `DEGRADED`;
- `UNHEALTHY`.

These dimensions should not be collapsed into one ambiguous field.

# 31. Build Entity

Build represents a local or remote build record associated with a project.

The initial product model prioritizes local builds.

Attributes:

- `build_id`;
- `project_id`;
- `initiated_by`;
- `platform_id`;
- `platform_version_id`;
- `sdk_version`;
- `toolchain_version`;
- `source_reference`;
- `status`;
- `started_at`;
- `completed_at`;
- `error_code`;
- `created_at`.

# 32. Build Rules

- Source remains on the user's machine by default.
- RaaS should not require customer source upload.
- Remote build is a future capability and must be explicitly enabled.
- Build metadata must not imply that source code was received.
- Build success alone does not imply artifact compatibility.

# 33. Artifact Entity

Artifact represents the executable package submitted for remote execution.

Attributes:

- `artifact_id`;
- `project_id`;
- `organization_id`;
- `platform_id`;
- `platform_version_id`;
- `build_id`;
- `version`;
- `format_version`;
- `digest`;
- `size_bytes`;
- `storage_key`;
- `signature_status`;
- `validation_status`;
- `runtime_version`;
- `sdk_version`;
- `created_by`;
- `created_at`;
- `expires_at`;
- `revoked_at`.

# 34. Artifact Rules

An accepted artifact must:

- have a valid digest;
- satisfy package format;
- satisfy platform compatibility;
- satisfy runtime compatibility;
- satisfy SDK compatibility;
- satisfy capability requirements;
- pass signature validation where required;
- exist in authorized object storage.

The artifact binary remains in object storage.

# 35. Artifact Lifecycle

    CREATED
       |
    UPLOADING
       |
    UPLOADED
       |
    VALIDATING
       |
    ACCEPTED
       |
    REVOKED / EXPIRED

Rejected artifacts remain historical records according to retention policy.

# 36. Credit Plan Entity

Credit Plan defines a purchasable or assigned credit package.

Attributes:

- `credit_plan_id`;
- `platform_id`;
- `name`;
- `plan_type`;
- `credits`;
- `price`;
- `currency`;
- `validity_period`;
- `min_booking_duration`;
- `max_booking_duration`;
- `cancellation_policy`;
- `status`;
- `effective_from`;
- `effective_until`.

# 37. Credit Plan Rules

A credit plan is associated with a specific robotic platform.

Initial model:

    Platform A
      |
      +-- Student Plan
      +-- Developer Plan
      +-- Research Plan

Credits are not generic across platforms unless a future commercial policy
explicitly introduces transferable credit.

# 38. Credit Wallet Entity

Wallet represents an organization's platform-specific credit balance.

Attributes:

- `wallet_id`;
- `organization_id`;
- `platform_id`;
- `currency_type`;
- `available_balance`;
- `reserved_balance`;
- `status`;
- `created_at`;
- `updated_at`.

# 39. Wallet Rules

- Wallet belongs to exactly one organization.
- Wallet is associated with one platform credit type.
- Balance cannot become negative.
- Ledger remains authoritative for historical transactions.
- Balance changes must be transactional.
- Wallet operations are idempotent.

# 40. Credit Ledger Entity

Ledger entry represents an immutable credit movement.

Attributes:

- `ledger_entry_id`;
- `wallet_id`;
- `organization_id`;
- `platform_id`;
- `transaction_type`;
- `amount`;
- `balance_after`;
- `reference_type`;
- `reference_id`;
- `idempotency_key`;
- `created_by`;
- `created_at`;
- `metadata`.

# 41. Ledger Transaction Types

Examples:

- `PURCHASE`;
- `GRANT`;
- `CONSUMPTION`;
- `REFUND`;
- `ADJUSTMENT`;
- `EXPIRATION`;
- `REVERSAL`.

# 42. Ledger Rules

Ledger entries are append-only.

Corrections create compensating entries.

Never rewrite historical financial events merely to correct a balance.

Example:

    CONSUMPTION -450
         |
    Incorrect
         |
    REVERSAL +450
         |
    Corrected transaction

# 43. Credit Consumption

Credit consumption should occur as part of a controlled transaction.

Example:

    Booking/Job Operation
          |
       Validate
          |
    Lock Wallet
          |
    Verify Balance
          |
    Create Ledger Entry
          |
    Update Balance
          |
       Commit

External execution occurs after the durable transaction.

# 44. Booking Entity

Booking reserves execution capacity for a customer.

Attributes:

- `booking_id`;
- `organization_id`;
- `project_id`;
- `platform_id`;
- `resource_id`;
- `requested_start`;
- `requested_end`;
- `actual_start`;
- `actual_end`;
- `status`;
- `credit_quote`;
- `credits_reserved`;
- `created_by`;
- `created_at`;
- `updated_at`;
- `cancelled_at`.

# 45. Booking Rules

A booking must:

- belong to an organization;
- reference a supported platform;
- reference a compatible resource;
- use a valid time window;
- satisfy minimum duration;
- satisfy maximum duration;
- have sufficient credits or valid payment state;
- not conflict with another confirmed reservation.

# 46. Booking Conflict

Booking conflict must be prevented transactionally.

Conceptually:

    Request
      |
    Find Resource
      |
    Check Time Window
      |
    Lock / Conflict Constraint
      |
    Create Booking
      |
    Commit

The exact PostgreSQL exclusion-constraint strategy is an implementation
decision but should be evaluated for time-range booking.

# 47. Booking Lifecycle

    QUOTED
      |
    CREATED
      |
    CONFIRMED
      |
    ACTIVE
      |
    COMPLETED

Alternative terminal states:

    CANCELLED
    EXPIRED
    FAILED

# 48. Job Entity

Job represents an execution request.

Attributes:

- `job_id`;
- `organization_id`;
- `project_id`;
- `artifact_id`;
- `booking_id`;
- `resource_id`;
- `platform_id`;
- `requested_by`;
- `status`;
- `priority`;
- `created_at`;
- `queued_at`;
- `started_at`;
- `completed_at`;
- `failure_code`;
- `failure_message`;
- `version`.

# 49. Job Rules

A Job requires:

- valid organization;
- active project;
- accepted artifact;
- valid booking where required;
- compatible platform;
- authorized resource;
- sufficient credits;
- valid execution state.

# 50. Job Lifecycle

    CREATED
      |
    QUEUED
      |
    VALIDATING
      |
    ALLOCATING
      |
    DEPLOYING
      |
    STARTING
      |
    RUNNING
      |
    STOPPING
      |
    COMPLETED

Terminal alternatives:

    FAILED
    CANCELLED
    TIMEOUT

# 51. Run Entity

Run represents an actual execution instance of a Job.

A Job may have one primary Run initially, with the model allowing future
multiple execution attempts where required.

Attributes:

- `run_id`;
- `job_id`;
- `organization_id`;
- `project_id`;
- `artifact_id`;
- `resource_id`;
- `booking_id`;
- `attempt_number`;
- `status`;
- `started_at`;
- `ended_at`;
- `exit_code`;
- `failure_code`;
- `failure_message`;
- `created_at`;
- `updated_at`.

# 52. Run Rules

- Run must reference a valid Job.
- Run inherits tenant scope from Job.
- Run cannot execute on an incompatible resource.
- A Run cannot be marked successful without validated completion.
- Uncertain Run state requires reconciliation.
- Duplicate execution must be prevented.

# 53. Run and Physical Robot

The database records control-plane execution state.

It does not prove physical robot state.

Therefore:

    Database Run State
          |
    Lab Agent State
          |
    Robot Runtime State
          |
    Local Safety State

must be reconciled when uncertainty exists.

# 54. Result Entity

Result represents output metadata from a Run.

Attributes:

- `result_id`;
- `run_id`;
- `organization_id`;
- `project_id`;
- `status`;
- `summary`;
- `metrics_reference`;
- `storage_prefix`;
- `size_bytes`;
- `created_at`;
- `available_at`;
- `processing_error`.

# 55. Result Lifecycle

    CREATED
      |
    PROCESSING
      |
    AVAILABLE

Terminal failure:

    FAILED

Large result files remain in object storage.

# 56. Experiment Entity

Experiment groups related Runs for analysis.

Attributes:

- `experiment_id`;
- `organization_id`;
- `project_id`;
- `name`;
- `description`;
- `status`;
- `created_by`;
- `created_at`;
- `updated_at`.

# 57. Experiment Run Relationship

Many Runs may belong to an Experiment.

Relationship:

    Experiment
       |
       +-- ExperimentRun
              |
              +-- Run
              +-- sequence
              +-- label
              +-- role

A Run may potentially participate in multiple experiments only if the product
semantics explicitly allow it. Initial implementation should prefer a clear
one-to-many association unless multiple membership is required.

# 58. Event Entity

Event represents a durable domain fact where persistence is required.

Attributes:

- `event_id`;
- `event_type`;
- `resource_type`;
- `resource_id`;
- `organization_id`;
- `project_id`;
- `sequence`;
- `trace_id`;
- `span_id`;
- `actor_id`;
- `occurred_at`;
- `data`;
- `schema_version`.

# 59. Event Rules

Events are immutable.

An event must have:

- unique event ID;
- event type;
- timestamp;
- resource identity;
- tenant context where applicable;
- schema version.

Events are not a replacement for current-state tables.

# 60. Event Examples

Examples include:

- `project.created`;
- `artifact.accepted`;
- `booking.confirmed`;
- `credit.consumed`;
- `job.running`;
- `run.completed`;
- `result.available`;
- `agent.offline`;
- `resource.maintenance`.

# 61. Event Sequence

Event sequence is resource-scoped.

Example:

    Job-123
      |
      sequence 1 -> job.created
      sequence 2 -> job.queued
      sequence 3 -> job.running
      sequence 4 -> job.completed

Global ordering is not required.

# 62. Audit Record Entity

Audit Record represents an administrative/security/business audit event.

Attributes:

- `audit_id`;
- `organization_id`;
- `actor_id`;
- `actor_type`;
- `action`;
- `resource_type`;
- `resource_id`;
- `outcome`;
- `request_id`;
- `trace_id`;
- `timestamp`;
- `ip_reference`;
- `metadata`.

# 63. Audit Rules

Audit records should be:

- append-oriented;
- tamper-resistant;
- access-controlled;
- retained according to policy.

Sensitive values must not be copied into audit records.

# 64. Idempotency Entity

Idempotency records prevent duplicate side effects.

Attributes:

- `idempotency_key`;
- `organization_id`;
- `actor_id`;
- `operation`;
- `request_hash`;
- `status`;
- `response_code`;
- `response_data`;
- `created_at`;
- `expires_at`.

# 65. Idempotency Rules

A reused key with a different request hash must fail.

A valid repeated request should return the original durable result where
possible.

# 66. Reconciliation Entity

Reconciliation records represent uncertainty between control-plane and
external state.

Attributes may include:

- `reconciliation_id`;
- `resource_type`;
- `resource_id`;
- `organization_id`;
- `expected_state`;
- `observed_state`;
- `status`;
- `reason`;
- `attempt_count`;
- `last_attempt_at`;
- `resolved_at`.

# 67. Reconciliation Rules

Reconciliation is required when:

- external command outcome is unknown;
- network disconnect occurs during execution;
- Lab Agent reconnects;
- Job state disagrees with observed runtime;
- credit/resource state is uncertain.

# 68. Entity Relationship Overview

    User
      |
      +-- Membership -- Organization
                           |
                           +-- Project
                           |     |
                           |     +-- Build
                           |     |
                           |     +-- Artifact
                           |     |
                           |     +-- Booking
                           |     |
                           |     +-- Job
                           |           |
                           |           +-- Run
                           |                 |
                           |                 +-- Result
                           |
                           +-- Wallet
                                 |
                                 +-- Ledger

    Platform
       |
       +-- Platform Version
       |
       +-- Capability
       |
       +-- Resource
             |
             +-- Robot
             |
             +-- Lab

# 69. Execution Relationship

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

Each step preserves organization ownership and authorization context.

# 70. Platform Compatibility Flow

    Artifact
       |
       +-- platform_id
       +-- platform_version_id
       +-- runtime_version
       +-- sdk_version
       +-- capabilities
                 |
                 v
            Resource
                 |
            Compatibility
                 |
          Eligible for Run

# 71. Commercial Flow

    Credit Plan
       |
    Purchase/Grant
       |
    Wallet
       |
    Ledger
       |
    Booking/Job
       |
    Consumption
       |
    Refund/Reversal if required

# 72. Booking-to-Execution Flow

    Booking
       |
    CONFIRMED
       |
    Job Created
       |
    Resource Allocated
       |
    Run Started
       |
    Run Completed
       |
    Credits Finalized
       |
    Result Available

# 73. Artifact Flow

    Local Source
       |
    Local Build
       |
    Build Record
       |
    Package
       |
    .krv Artifact
       |
    Object Storage
       |
    Artifact Metadata
       |
    Validation
       |
    ACCEPTED
       |
    Job

# 74. Result Flow

    Robot Runtime
       |
    Lab Agent
       |
    Run
       |
    Result Processing
       |
    Object Storage
       |
    Result Metadata
       |
    Web Console / Studio

# 75. Event Flow

    Transaction
       |
    Business State Update
       |
    Outbox/Event
       |
    Event Delivery
       |
    WebSocket / Consumers
       |
    Client

The durable database state remains authoritative.

# 76. Tenant Ownership Matrix

| Entity | Tenant-Owned | Global |
|---|---:|---:|
| User | No | Yes |
| Organization | Yes, root | No |
| Membership | Yes | No |
| Role | Usually shared/configurable | Yes |
| Project | Yes | No |
| Platform | No | Yes |
| Platform Version | No | Yes |
| Capability | No | Yes |
| Lab | No/administrative | Yes |
| Resource | No/administrative | Yes |
| Robot | No/administrative | Yes |
| Build | Yes | No |
| Artifact | Yes | No |
| Credit Plan | No | Yes |
| Wallet | Yes | No |
| Ledger | Yes | No |
| Booking | Yes | No |
| Job | Yes | No |
| Run | Yes | No |
| Result | Yes | No |
| Experiment | Yes | No |
| Event | Context-dependent | Yes |
| Audit | Tenant-scoped where applicable | Yes |
| Idempotency | Yes where operation is tenant-scoped | No |
| Reconciliation | Usually resource/system scoped | Yes |

# 77. Cross-Tenant Rules

No tenant-owned record may be returned merely because its ID is known.

Every request must establish:

    authenticated user
        |
    organization membership
        |
    permission
        |
    resource ownership
        |
    operation

# 78. Deletion Strategy

Entities fall into three categories:

1. immutable historical;
2. soft-deletable;
3. operationally deletable.

Examples:

- Ledger: immutable;
- Audit: append-only;
- Event: immutable;
- Project: soft archive;
- Artifact: revoke rather than erase where history matters;
- Idempotency: TTL deletion;
- temporary reconciliation records: retention policy.

# 79. State Versus History

Current state tables answer:

> What is true now?

Events/audit/ledger answer:

> What happened?

The model must preserve this distinction.

# 80. Derived Data

Derived fields may include:

- wallet available balance;
- resource health summary;
- project Run count;
- Job duration;
- platform utilization.

Derived data must be recomputable where practical.

# 81. Financial Derived State

`available_balance` is an operationally useful value.

The ledger remains the historical source of truth.

Periodic reconciliation should verify:

    Opening Balance
      + Credits
      - Consumption
      + Refunds
      + Adjustments
      = Current Balance

# 82. Resource Derived State

Resource allocation state may be derived from active bookings/Jobs but should
be persisted when required for efficient coordination.

Periodic reconciliation should compare:

    Database Resource State
            vs
    Lab Agent Observed State

# 83. Job Derived State

Job status should reflect the durable control-plane state.

Physical runtime state may differ temporarily and requires reconciliation.

# 84. Data Consistency Classes

| Data | Consistency |
|---|---|
| Credit ledger | Strong |
| Wallet balance | Strong |
| Booking allocation | Strong |
| Job state | Strong |
| Run state | Strong |
| Tenant ownership | Strong |
| Artifact metadata | Strong |
| Platform configuration | Strong |
| Audit | Durable |
| Events | Durable where required |
| Telemetry | Eventual/streaming |
| Video | Eventual/object storage |
| Analytics | Eventual |

# 85. Query Model

Queries should be designed around supported product use cases.

Common queries include:

- projects for organization;
- artifacts for project;
- compatible platforms;
- available resources;
- bookings for organization;
- Jobs for project;
- Runs for Job;
- results for Run;
- credit balance;
- ledger history;
- experiment Runs.

# 86. API Data Boundaries

The database model must not be exposed directly as an API contract.

Application DTOs should:

- select required fields;
- enforce authorization;
- hide internal metadata;
- avoid accidental schema coupling.

# 87. Repository Interfaces

Representative interfaces include:

    UserRepository
    OrganizationRepository
    MembershipRepository
    RoleRepository
    ProjectRepository
    PlatformRepository
    PlatformVersionRepository
    CapabilityRepository
    LabRepository
    LabAgentRepository
    ResourceRepository
    RobotRepository
    BuildRepository
    ArtifactRepository
    CreditPlanRepository
    WalletRepository
    LedgerRepository
    BookingRepository
    JobRepository
    RunRepository
    ResultRepository
    ExperimentRepository
    EventRepository
    AuditRepository
    IdempotencyRepository
    ReconciliationRepository

# 88. Repository Transaction Interface

Repositories should accept a transaction/context abstraction.

Conceptually:

    transaction {
        booking.create()
        wallet.reserve()
        audit.record()
    }

The application service controls commit or rollback.

# 89. Domain Invariants

Core invariants include:

- project belongs to one organization;
- membership connects valid user and organization;
- artifact belongs to one project;
- artifact platform compatibility is explicit;
- wallet belongs to one organization/platform;
- ledger belongs to one wallet;
- booking references compatible resource;
- Job references accepted artifact;
- Run references Job;
- Result references Run;
- tenant IDs remain consistent across relationships.

# 90. Cross-Entity Tenant Invariant

For tenant-owned entities:

    child.organization_id
        ==
    parent.organization_id

Where practical, this should be enforced through application validation and
database constraints.

# 91. Platform Compatibility Invariant

A Run may execute only if:

    Artifact Platform
        ==
    Resource Platform

and:

    Artifact Runtime
        compatible with
    Resource Runtime

and required capabilities exist.

# 92. Booking Invariant

A confirmed booking must not overlap another confirmed booking for the same
exclusive resource.

# 93. Credit Invariant

Wallet balance must never become negative.

A transaction consuming credits must either:

- fully succeed;
- or fully roll back.

# 94. Job Invariant

A Job cannot start without:

- valid artifact;
- valid authorization;
- valid booking when required;
- compatible resource;
- sufficient commercial authorization;
- valid resource state.

# 95. Run Invariant

A Run cannot transition directly from `CREATED` to `COMPLETED`.

Required intermediate states must follow the execution contract.

# 96. Result Invariant

A result cannot become `AVAILABLE` unless its Run has reached a valid
completion state or an explicitly supported partial-result state.

# 97. Audit Invariant

Security-sensitive operations must generate audit records.

Examples:

- role changes;
- credit adjustments;
- refunds;
- booking cancellation;
- artifact revocation;
- administrative resource changes.

# 98. Event Invariant

Event IDs are globally unique.

Replay must preserve event identity.

Duplicate delivery must not corrupt current state.

# 99. Temporal Data

Time-bearing entities must use explicit UTC timestamps.

Booking windows require:

- start;
- end;
- timezone interpretation at API boundary where necessary.

Persist normalized UTC values.

# 100. Data Validation

Validation occurs in layers:

    API Validation
       |
    Application Validation
       |
    Repository Validation
       |
    Database Constraints

Database constraints remain the final persistence integrity boundary.

# 101. Schema Naming

Recommended naming:

- lowercase;
- snake_case;
- singular or consistently plural table convention;
- explicit foreign-key names;
- stable semantic names.

The exact physical naming convention must be standardized before migrations
begin.

# 102. JSON Fields

JSON/JSONB may be used for:

- extensible metadata;
- capability configuration;
- event data;
- provider-specific non-authoritative attributes.

Do not place core relational business invariants exclusively inside JSON.

# 103. Enumerations

Business state values should be controlled through:

- PostgreSQL enums;
- lookup tables;
- constrained strings.

The final mechanism should consider migration flexibility.

# 104. Configuration Versus State

Configuration entities:

- Platform;
- Platform Version;
- Capability;
- Credit Plan.

Operational state entities:

- Resource;
- Booking;
- Job;
- Run;
- Lab Agent.

Historical entities:

- Ledger;
- Audit;
- Event.

The distinction informs retention and update rules.

# 105. Administrative Data

Administrative changes to:

- platform;
- resource;
- credit plan;
- credit rates;
- Lab;
- Robot

must be auditable.

# 106. Commercial Rate Model

The data model supports:

    Platform
       |
    Credit Plan
       |
    Resource / Configuration
       |
    Rate
       |
    Booking Duration
       |
    Credit Quote

A future explicit rate entity may be introduced when pricing complexity
requires it.

# 107. Platform-Specific Credit Rule

Initial invariant:

    wallet.platform_id
        ==
    booking.platform_id
        ==
    job.platform_id
        ==
    artifact.platform_id

unless an explicitly approved compatibility/credit policy says otherwise.

# 108. Resource Allocation

Allocation should persist enough information to answer:

- who owns the reservation;
- which project;
- which resource;
- when;
- which Job;
- current state.

# 109. Robot Identity and Resource Identity

The model intentionally separates:

    Resource
       |
       +-- Robot identity

Resource is the execution/allocation abstraction.

Robot is the physical identity.

This permits:

- simulators;
- virtual resources;
- replacement robots;
- future resource types.

# 110. Lab Agent and Resource Relationship

One Lab Agent may manage multiple resources.

Conceptually:

    Lab
      |
    Lab Agent
      |
      +-- Resource
      +-- Resource
      +-- Resource

Agent failure should not delete resource identity.

# 111. Replacement Robot

If a physical robot is replaced:

- create or register new Robot identity;
- preserve historical Runs against the old Robot/resource;
- do not rewrite history to point at the replacement.

# 112. Platform Retirement

Retired platforms remain in historical records.

They cannot normally receive new bookings or artifacts unless explicitly
reactivated.

# 113. Artifact Revocation

Revocation must not delete historical execution records.

A revoked artifact cannot be newly deployed.

Existing active execution must be handled according to safety and operational
policy.

# 114. Booking Cancellation

Cancellation must record:

- who cancelled;
- when;
- reason;
- refund/credit outcome.

Do not erase the booking.

# 115. Job Cancellation

Cancellation records:

- actor;
- timestamp;
- reason;
- final state.

If physical execution may continue, the Job enters a reconciliation workflow
rather than being marked safely completed immediately.

# 116. Result Retention

Result metadata should remain available according to project/customer
policy even if large result files expire.

Expired object references must be represented explicitly.

# 117. Event Retention

Business-critical events may require longer retention than operational
high-frequency telemetry.

Event retention should be domain-specific.

# 118. Audit Retention

Audit records require controlled retention and restricted deletion.

Security and financial audit requirements take precedence over convenience.

# 119. Phase Mapping Overview

| Phase | Data Model Expansion |
|---|---|
| Phase 0 | Core model and conventions |
| Phase 1 | Identity, organization, project |
| Phase 2 | Platforms, Labs, resources, artifacts |
| Phase 3 | Jobs, Runs, idempotency, reconciliation |
| Phase 4 | Credits, ledger, bookings |
| Phase 5 | Remote execution |
| Phase 6 | Robots, Lab Agents, physical resources |
| Phase 7 | Results, experiments, events |
| Phase 8 | Scale, retention, partitioning, analytics |

# 120. Phase 0

Define:

- identifiers;
- naming;
- schema boundaries;
- tenancy;
- common timestamps;
- repository interfaces;
- migration conventions.

Acceptance:

- [ ] data model approved;
- [ ] ownership matrix approved;
- [ ] tenant model approved.

# 121. Phase 1

Implement:

- User;
- Organization;
- Membership;
- Role;
- Project;
- Audit foundation.

Acceptance:

- [ ] tenant isolation works;
- [ ] role assignment works;
- [ ] project ownership is enforced.

# 122. Phase 2

Implement:

- Platform;
- Platform Version;
- Capability;
- Lab;
- Resource;
- Build;
- Artifact.

Acceptance:

- [ ] compatibility is represented;
- [ ] artifacts reference object storage;
- [ ] resources can be discovered.

# 123. Phase 3

Implement:

- Job;
- Run;
- Idempotency;
- Reconciliation;
- execution events.

Acceptance:

- [ ] Job lifecycle persists;
- [ ] Run lifecycle persists;
- [ ] retries are safe;
- [ ] uncertain state is reconcilable.

# 124. Phase 4

Implement:

- Credit Plan;
- Wallet;
- Ledger;
- Booking.

Acceptance:

- [ ] credit consumption is atomic;
- [ ] balances remain valid;
- [ ] booking conflicts are prevented;
- [ ] refunds are auditable.

# 125. Phase 5

Implement:

- remote deployment metadata;
- execution state;
- Lab integration state;
- reconciliation.

Acceptance:

- [ ] remote execution is durable;
- [ ] control-plane state is distinct from physical state;
- [ ] duplicate execution is prevented.

# 126. Phase 6

Implement:

- Robot;
- Lab Agent;
- resource health;
- safety state references.

Acceptance:

- [ ] robot identity is durable;
- [ ] agent heartbeat is recorded;
- [ ] resource state is reconcilable;
- [ ] safety remains locally authoritative.

# 127. Phase 7

Implement:

- Result;
- Experiment;
- Event;
- extended audit;
- telemetry metadata.

Acceptance:

- [ ] result lifecycle works;
- [ ] experiment grouping works;
- [ ] event persistence is durable where required;
- [ ] PostgreSQL is protected from telemetry overload.

# 128. Phase 8

Implement:

- partitioning where justified;
- read scaling;
- retention automation;
- archival;
- advanced audit;
- analytics integration.

Acceptance:

- [ ] database scale targets are validated;
- [ ] retention works;
- [ ] restore works;
- [ ] DR works;
- [ ] performance is measured.

# 129. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cross-tenant leakage | Critical | Explicit tenant ownership and tests |
| Duplicate credit consumption | Critical | Idempotency + transactions |
| Booking race | Critical | Constraints/locking |
| Duplicate execution | Critical | Job/Run state + reconciliation |
| Lost events | High | Outbox/durable events |
| Incorrect financial history | Critical | Append-only ledger |
| Platform mismatch | High | Compatibility model |
| Resource identity confusion | High | Resource/Robot separation |
| Excessive JSON | Medium | Relational core model |
| Telemetry overload | High | Specialized storage |
| Data deletion breaks audit | High | Retention rules |
| Schema coupling | Medium | Domain boundaries |
| Migration failure | Critical | Expand/contract |
| Stale replica reads | High | Primary for critical reads |
| Unbounded growth | High | Retention/partitioning |
| Object/DB inconsistency | High | Reconciliation |
| Weak authorization | Critical | Server-side policy |
| Historical rewriting | High | Immutable history |
| Premature complexity | Medium | Phase-driven evolution |

# 130. Open Questions

1. Final physical table naming convention.
2. UUID implementation choice.
3. Final PostgreSQL enum versus lookup-table policy.
4. Final RLS decision.
5. Final role/permission representation.
6. Exact platform capability model.
7. Exact Robot-to-Resource cardinality policy.
8. Whether one Run can belong to multiple experiments.
9. Final build metadata retained for local builds.
10. Final artifact signature model.
11. Final credit rate entity model.
12. Exact wallet reservation semantics.
13. Exact booking exclusion-constraint design.
14. Final payment transaction model.
15. Final event persistence scope.
16. Final event retention.
17. Final audit retention.
18. Final telemetry metadata retention.
19. Final result retention.
20. Final partition thresholds.
21. Final reconciliation record lifecycle.
22. Final soft-delete policy by entity.
23. Final reporting/analytics model.
24. Final identity-provider integration.
25. Final migration framework.

# 131. Full Acceptance Criteria

## General Model

- [ ] All core entities are defined.
- [ ] Every entity has a clear owner.
- [ ] Every entity has a stable identifier.
- [ ] Lifecycle state is explicit.
- [ ] Relationships are documented.
- [ ] Domain invariants are documented.
- [ ] Historical versus current state is distinguished.

## Identity

- [ ] User entity is defined.
- [ ] User lifecycle is defined.
- [ ] External identity reference is defined.
- [ ] Authentication secrets are not part of normal application data.
- [ ] User-to-organization membership is defined.

## Organizations and Roles

- [ ] Organization is the tenant boundary.
- [ ] Membership entity exists.
- [ ] Role entity exists.
- [ ] Role assignment is auditable.
- [ ] Duplicate membership is prevented.
- [ ] Organization ownership rules are defined.

## Projects

- [ ] Project has organization ownership.
- [ ] Project lifecycle is defined.
- [ ] Project archive behavior is defined.
- [ ] Project authorization is enforced.
- [ ] Historical project data is preserved.

## Platforms

- [ ] Platform entity exists.
- [ ] Platform version entity exists.
- [ ] Capability model exists.
- [ ] Platform compatibility is represented.
- [ ] Platform retirement is supported.
- [ ] Platform configuration changes are auditable.

## Labs and Resources

- [ ] Lab entity exists.
- [ ] Lab Agent entity exists.
- [ ] Resource entity exists.
- [ ] Robot entity exists.
- [ ] Resource state dimensions are separated.
- [ ] Robot physical identity is preserved.
- [ ] Resource replacement is supported.
- [ ] Maintenance state is represented.

## Builds and Artifacts

- [ ] Build entity exists.
- [ ] Local-build model is supported.
- [ ] Source-code privacy boundary is preserved.
- [ ] Artifact entity exists.
- [ ] Artifact digest is stored.
- [ ] Artifact signature state is stored.
- [ ] Artifact compatibility is represented.
- [ ] Artifact lifecycle is defined.
- [ ] Artifact binary remains in object storage.

## Credits

- [ ] Credit Plan exists.
- [ ] Wallet exists.
- [ ] Ledger exists.
- [ ] Wallet is platform-specific.
- [ ] Ledger is append-oriented.
- [ ] Consumption is transactional.
- [ ] Refund is auditable.
- [ ] Balance cannot become negative.
- [ ] Duplicate consumption is prevented.

## Booking

- [ ] Booking entity exists.
- [ ] Booking belongs to organization.
- [ ] Booking references project.
- [ ] Booking references platform.
- [ ] Booking references resource.
- [ ] Booking time window is explicit.
- [ ] Booking lifecycle is defined.
- [ ] Resource conflicts are prevented.
- [ ] Cancellation is auditable.

## Jobs

- [ ] Job entity exists.
- [ ] Job references artifact.
- [ ] Job references booking where required.
- [ ] Job references resource.
- [ ] Job lifecycle is defined.
- [ ] Invalid transitions are prevented.
- [ ] Job cancellation is durable.
- [ ] Job state can be reconciled.

## Runs

- [ ] Run entity exists.
- [ ] Run references Job.
- [ ] Run state is durable.
- [ ] Run attempt is identifiable.
- [ ] Duplicate execution is prevented.
- [ ] Uncertain execution is reconciled.
- [ ] Physical robot state is not assumed from database state.

## Results

- [ ] Result entity exists.
- [ ] Result references Run.
- [ ] Result lifecycle is defined.
- [ ] Result files use object storage.
- [ ] Result metadata remains queryable.
- [ ] Result expiration is represented.

## Experiments

- [ ] Experiment entity exists.
- [ ] Experiment belongs to organization/project.
- [ ] Experiment-to-Run relationship exists.
- [ ] Experiment state is defined.
- [ ] Experiment results can be queried.

## Events

- [ ] Event entity is defined.
- [ ] Event IDs are unique.
- [ ] Event schema version is defined.
- [ ] Resource correlation exists.
- [ ] Tenant context is included where appropriate.
- [ ] Events are immutable.
- [ ] Replay preserves event identity.
- [ ] Events do not replace current-state records.

## Audit

- [ ] Audit Record entity exists.
- [ ] Actor is recorded.
- [ ] Resource is recorded.
- [ ] Timestamp is recorded.
- [ ] Request/trace correlation is supported.
- [ ] Sensitive values are excluded.
- [ ] Audit retention is defined.

## System

- [ ] Idempotency entity exists.
- [ ] Request hash is supported.
- [ ] Idempotency expiration is supported.
- [ ] Reconciliation entity exists.
- [ ] Reconciliation state is explicit.
- [ ] Uncertain external operations can be represented.

## Tenancy

- [ ] Organization is the primary tenant.
- [ ] Tenant ownership is explicit.
- [ ] Cross-tenant access is prevented.
- [ ] Tenant IDs are server-derived.
- [ ] Authorization precedes data access.
- [ ] Cross-tenant automated tests exist.
- [ ] Administrative access is separately controlled.

## Consistency

- [ ] Financial operations are strongly consistent.
- [ ] Booking operations are strongly consistent.
- [ ] Job state is durable.
- [ ] Run state is durable.
- [ ] Tenant ownership is strongly enforced.
- [ ] Idempotency is implemented.
- [ ] Reconciliation is implemented.

## Retention

- [ ] Core data retention is defined.
- [ ] Ledger retention is defined.
- [ ] Audit retention is defined.
- [ ] Booking retention is defined.
- [ ] Job/Run retention is defined.
- [ ] Event retention is defined.
- [ ] Result metadata retention is defined.
- [ ] Temporary data retention is defined.

## Evolution

- [ ] Phase 0 model is defined.
- [ ] Phase 1 entities are defined.
- [ ] Phase 2 entities are defined.
- [ ] Phase 3 entities are defined.
- [ ] Phase 4 entities are defined.
- [ ] Phase 5 entities are defined.
- [ ] Phase 6 entities are defined.
- [ ] Phase 7 entities are defined.
- [ ] Phase 8 evolution is defined.

# 132. Final Data Model Invariants

The Kritva RaaS data model must preserve these invariants:

1. Every tenant-owned record has an unambiguous organization ownership path.
2. Users and memberships are separate concepts.
3. Roles define permissions, not ownership.
4. Projects belong to organizations.
5. Platforms are globally managed configuration.
6. Resources are execution allocation units.
7. Robots are physical identities.
8. Labs contain resources.
9. Lab Agents manage local resources.
10. Artifacts identify their target platform and runtime compatibility.
11. Artifact binaries are not stored as normal relational business data.
12. Credit wallets are platform-specific.
13. Credit ledger history is append-oriented.
14. Credit balances cannot become negative.
15. Booking conflicts are prevented transactionally.
16. Jobs require valid execution prerequisites.
17. Runs represent actual execution attempts.
18. Results belong to Runs.
19. Experiments group Runs for analysis.
20. Events represent immutable facts.
21. Audit records preserve important actions.
22. Idempotency prevents duplicate side effects.
23. Reconciliation represents uncertainty between control-plane and external
    state.
24. Database state does not prove physical robot safety.
25. Large telemetry/video data does not overwhelm PostgreSQL.
26. Historical truth is not rewritten merely to simplify current state.
27. Current state and historical events remain conceptually distinct.
28. Database constraints complement application authorization.
29. Production schema evolves through controlled migrations.
30. Data architecture grows from a coherent relational foundation rather than
    prematurely introducing distributed databases.

# 133. Final Logical Model

The complete logical relationship is:

    USER
      |
      | membership
      v
    ORGANIZATION
      |
      +---------------- PROJECT ----------------+
      |                                          |
      |                                          +-- BUILD
      |                                          |     |
      |                                          |     +-- ARTIFACT
      |                                          |
      |                                          +-- BOOKING
      |                                          |     |
      |                                          |     +-- JOB
      |                                          |           |
      |                                          |           +-- RUN
      |                                          |                 |
      |                                          |                 +-- RESULT
      |                                          |
      |                                          +-- EXPERIMENT
      |
      +-- WALLET
      |     |
      |     +-- CREDIT LEDGER
      |
      +-- AUDIT
      |
      +-- EVENTS

    PLATFORM
      |
      +-- PLATFORM VERSION
      |
      +-- CAPABILITY
      |
      +-- RESOURCE
            |
            +-- ROBOT
            |
            +-- LAB
            |
            +-- LAB AGENT

The governing principle is:

> **The Kritva RaaS data model must provide one coherent source of truth
> for customer, commercial, booking and execution state while preserving
> clear domain ownership and tenant isolation. Platform and physical-resource
> identity must remain distinct from customer execution state; artifacts
> must remain separate from their object-storage payloads; credits and
> bookings must be transactionally safe; Jobs and Runs must be durable and
> reconcilable; events and audit records must preserve history; and the
> entire model must evolve incrementally from the Phase 0 foundation to
> production-scale operation without prematurely introducing distributed
> database complexity.**
