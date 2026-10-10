# Kritva RaaS Projects Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Projects Schema |
| Path | `docs/database/schema/PROJECTS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `project` |
| Primary Domain Owner | Project Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Data Classification | Confidential |
| Phase Coverage | Phase 0–Phase 8 |
| Source Code Storage | Not stored by RaaS |
| Related Domains | Identity, Organization, Platform, Build, Artifact, Booking, Execution, Result, Experiment |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for Kritva RaaS
Projects.

A Project is the primary customer workspace for organizing robotics
development, artifacts, bookings, executions, experiments and results.

The Project schema provides:

- project identity;
- organization ownership;
- project lifecycle;
- project settings;
- project members;
- target platform bindings;
- bounded project metadata.

The Project schema deliberately does not store customer source code.

# 3. Scope

This document defines:

- projects;
- project settings;
- project members;
- target platform bindings;
- project metadata;
- lifecycle states;
- ownership;
- tenant isolation;
- foreign keys;
- unique constraints;
- indexes;
- check constraints;
- audit fields;
- example rows;
- SQL DDL;
- repository interfaces;
- application services;
- project flows;
- relations to other domains;
- Phase 0–Phase 8 mapping;
- retention;
- risks;
- open questions;
- acceptance criteria.

# 4. Non-Goals

This document does not define:

- source-code storage;
- source-code version control;
- local filesystem layout;
- local Git repositories;
- build implementation;
- artifact binary storage;
- robot hardware;
- booking implementation;
- execution implementation;
- result storage;
- experiment storage;
- organization membership implementation.

Build, Artifact, Booking, Execution and Result remain separate domains.

# 5. Product Principle

The central Project principle is:

> **A Project is a RaaS workspace, not a source-code repository.**

The customer's source remains on the user's local machine.

The Project stores metadata required to identify and operate the customer's
RaaS workflow.

# 6. Source-Code Boundary

The architecture is:

    User Machine
        |
        +-- Source Code
        |
        +-- Local Build
        |
        +-- Local Tests
        |
        +-- .krv Artifact
        |
        v
    Kritva RaaS
        |
        +-- Project Metadata
        +-- Artifact Metadata
        +-- Booking
        +-- Job
        +-- Run
        +-- Result

RaaS does not store:

- `.cpp`;
- `.c`;
- `.py`;
- `.rs`;
- `.hpp`;
- ROS source workspaces;
- Git repositories;
- source archives;

unless a future product decision explicitly adds such a capability.

# 7. Project Tenant Model

Every Project belongs to exactly one Organization.

The relationship is:

    identity.users
          |
          v
    organization.memberships
          |
          v
    organization.organizations
          |
          | 1:N
          v
    project.projects

The authenticated User must have an active Membership before accessing a
Project.

# 8. Project Ownership

The Organization owns the Project.

A User may be recorded as:

- creator;
- updater;
- project member;
- project administrator.

A User does not personally own a Project independently of the Organization.

# 9. Project Lifecycle

Recommended lifecycle:

    ACTIVE
       |
       +----> ARCHIVED
       |          |
       |          v
       |       ACTIVE
       |
       +----> DELETED

A Project is created as `ACTIVE`.

Archived Projects remain readable according to authorization policy but should
not accept normal new operational activity.

# 10. Project Status Definitions

| Status | Meaning |
|---|---|
| ACTIVE | Normal project operations allowed |
| ARCHIVED | Historical/inactive project |
| DELETED | Project lifecycle closed and eligible for deletion/anonymization |

Deletion is a controlled lifecycle operation and is not a generic database
soft-delete mechanism.

# 11. Project Goals

The schema must support:

1. multi-tenant project isolation;
2. project-level authorization;
3. target robot platform selection;
4. project-specific settings;
5. project collaboration;
6. artifact association;
7. booking association;
8. execution association;
9. result association;
10. future experiment association;
11. bounded extensible metadata;
12. project archival;
13. project retention;
14. complete auditability.

# 12. Project Non-Goals

Projects do not:

- compile source code on the server;
- contain source repositories;
- store customer source;
- directly control robots;
- own platform definitions;
- own artifact binaries;
- own credit wallets;
- own booking resources.

# 13. Logical Schema

The Project schema contains:

    project
        |
        +-- projects
        |
        +-- project_settings
        |
        +-- project_members
        |
        +-- project_platform_bindings

Project metadata is stored in the bounded `metadata` column of `projects`.

# 14. Projects Table

`project.projects` is the authoritative project identity record.

It contains:

- project identifier;
- Organization tenant;
- project key;
- project name;
- description;
- lifecycle status;
- creator;
- lifecycle timestamps;
- bounded metadata.

# 15. `project.projects` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| project_id | uuid | No | UUIDv7 | Project identifier |
| organization_id | uuid | No | None | Tenant Organization |
| project_key | varchar(100) | No | None | Organization-scoped stable key |
| name | varchar(200) | No | None | Project display name |
| description | varchar(2000) | Yes | NULL | Project description |
| status | project_status | No | `ACTIVE` | Project lifecycle |
| created_by | uuid | No | None | Creating User |
| updated_by | uuid | Yes | NULL | Last modifying User |
| created_at | timestamptz | No | `now()` | Creation timestamp |
| updated_at | timestamptz | No | `now()` | Last update |
| archived_at | timestamptz | Yes | NULL | Archive timestamp |
| deleted_at | timestamptz | Yes | NULL | Deletion marker |
| metadata | jsonb | No | `'{}'` | Bounded project metadata |

# 16. Project Key

`project_key` is unique within an Organization.

The stable identifier is:

    (organization_id, project_key)

The Project UUID remains the authoritative database/API identifier.

Project keys may be used for:

- CLI workflows;
- Studio display;
- URLs;
- automation;
- human support references.

# 17. Project Status Enum

    CREATE TYPE project.project_status AS ENUM (
        'ACTIVE',
        'ARCHIVED',
        'DELETED'
    );

# 18. Project DDL

    CREATE SCHEMA IF NOT EXISTS project;

    CREATE TYPE project.project_status AS ENUM (
        'ACTIVE',
        'ARCHIVED',
        'DELETED'
    );

    CREATE TABLE project.projects (
        project_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_key VARCHAR(100) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(2000) NULL,
        status project.project_status NOT NULL DEFAULT 'ACTIVE',
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        archived_at TIMESTAMPTZ NULL,
        deleted_at TIMESTAMPTZ NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT projects_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT projects_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT projects_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT projects_org_key_unique
            UNIQUE (organization_id, project_key),
        CONSTRAINT projects_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT projects_archive_check
            CHECK (
                archived_at IS NULL
                OR status IN ('ARCHIVED', 'DELETED')
            ),
        CONSTRAINT projects_delete_check
            CHECK (
                deleted_at IS NULL
                OR status = 'DELETED'
            )
    );

# 19. Project Indexes

Required:

    PRIMARY KEY (project_id)

    UNIQUE (organization_id, project_key)

Recommended:

    INDEX (organization_id, status)

    INDEX (organization_id, created_at)

    INDEX (created_by)

    INDEX (updated_at)

    INDEX (deleted_at)

# 20. Tenant-Aware Project Queries

Project queries should normally include:

    organization_id = :authenticated_organization_id

The organization context must be obtained from authenticated server state.

A client-provided Organization ID must not override authorization context.

# 21. Project Settings

`project.project_settings` stores project-specific configuration.

Settings are separate from the project identity record so that:

- project queries remain small;
- configuration can evolve independently;
- operational settings remain clearly separated;
- policy enforcement is easier.

# 22. `project.project_settings` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| project_id | uuid | No | None | Project |
| default_platform_id | uuid | Yes | NULL | Preferred platform |
| default_platform_version_id | uuid | Yes | NULL | Preferred platform version |
| default_artifact_format | varchar(64) | No | `'krv'` | Default artifact format |
| default_runtime_version | varchar(64) | Yes | NULL | Preferred runtime |
| default_sdk_version | varchar(64) | Yes | NULL | Preferred SDK |
| allow_remote_execution | boolean | No | `true` | Project execution policy |
| require_artifact_signature | boolean | No | `true` | Artifact policy |
| default_result_retention_days | integer | Yes | NULL | Project retention override |
| settings | jsonb | No | `'{}'` | Bounded extensible settings |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 23. Project Settings Ownership

Settings belong exclusively to the Project.

The Organization remains the higher-level tenant boundary.

Therefore:

    Organization
        |
        +-- Project
              |
              +-- Project Settings

Project settings cannot weaken mandatory Organization or platform security
policies.

# 24. Project Settings DDL

    CREATE TABLE project.project_settings (
        project_id UUID PRIMARY KEY,
        default_platform_id UUID NULL,
        default_platform_version_id UUID NULL,
        default_artifact_format VARCHAR(64)
            NOT NULL DEFAULT 'krv',
        default_runtime_version VARCHAR(64) NULL,
        default_sdk_version VARCHAR(64) NULL,
        allow_remote_execution BOOLEAN NOT NULL DEFAULT TRUE,
        require_artifact_signature BOOLEAN NOT NULL DEFAULT TRUE,
        default_result_retention_days INTEGER NULL,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT project_settings_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT project_settings_result_retention_check
            CHECK (
                default_result_retention_days IS NULL
                OR default_result_retention_days > 0
            ),
        CONSTRAINT project_settings_settings_object_check
            CHECK (
                jsonb_typeof(settings) = 'object'
            )
    );

# 25. Project Settings Indexes

The primary key provides the main lookup:

    PRIMARY KEY (project_id)

Optional indexes on platform defaults should only be introduced if workload
requires them.

# 26. Project Member Table

`project.project_members` defines project-level collaboration.

A Project Member must already be an active Organization Membership.

The relationship is:

    User
      |
    Organization Membership
      |
    Project Member
      |
    Project

# 27. Project Membership Model

Project membership allows finer-grained access than Organization membership.

Examples:

    Organization Membership
        Developer

    Project Membership
        Project Administrator

or:

    Organization Membership
        Researcher

    Project Membership
        Project Viewer

Project authorization must never grant access to a User who is not a valid
Organization member.

# 28. `project.project_members` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| project_member_id | uuid | No | UUIDv7 | Membership identifier |
| project_id | uuid | No | None | Project |
| organization_membership_id | uuid | No | None | Organization membership |
| status | project_member_status | No | `ACTIVE` | Project membership state |
| member_role | project_member_role | No | `MEMBER` | Project role |
| joined_at | timestamptz | No | `now()` | Membership start |
| suspended_at | timestamptz | Yes | NULL | Suspension |
| removed_at | timestamptz | Yes | NULL | Removal |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 29. Project Member State Machine

    ACTIVE
       |
       +----> SUSPENDED
       |          |
       |          v
       |        ACTIVE
       |
       +----> REMOVED

A removed member must not regain access without a new membership operation.

# 30. Project Member Roles

Initial roles:

| Role | Purpose |
|---|---|
| OWNER | Full Project control |
| ADMIN | Project administration |
| MEMBER | Normal project participation |
| VIEWER | Read-only project access |

These roles are project-level roles and do not replace Organization roles.

# 31. Project Member DDL

    CREATE TYPE project.project_member_status AS ENUM (
        'ACTIVE',
        'SUSPENDED',
        'REMOVED'
    );

    CREATE TYPE project.project_member_role AS ENUM (
        'OWNER',
        'ADMIN',
        'MEMBER',
        'VIEWER'
    );

    CREATE TABLE project.project_members (
        project_member_id UUID PRIMARY KEY,
        project_id UUID NOT NULL,
        organization_membership_id UUID NOT NULL,
        status project.project_member_status
            NOT NULL DEFAULT 'ACTIVE',
        member_role project.project_member_role
            NOT NULL DEFAULT 'MEMBER',
        joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        suspended_at TIMESTAMPTZ NULL,
        removed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT project_members_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT project_members_membership_fk
            FOREIGN KEY (organization_membership_id)
            REFERENCES organization.memberships(membership_id)
            ON DELETE RESTRICT,
        CONSTRAINT project_members_unique
            UNIQUE (project_id, organization_membership_id),
        CONSTRAINT project_members_suspended_check
            CHECK (
                suspended_at IS NULL
                OR status IN ('SUSPENDED', 'REMOVED')
            ),
        CONSTRAINT project_members_removed_check
            CHECK (
                removed_at IS NULL
                OR status = 'REMOVED'
            )
    );

# 32. Project Member Indexes

Required:

    UNIQUE (project_id, organization_membership_id)

Recommended:

    INDEX (project_id, status)

    INDEX (organization_membership_id, status)

    INDEX (created_at)

# 33. Project Member Tenant Integrity

A Project Member's Organization Membership must belong to the same
Organization as the Project.

The relationship is:

    project.project_members
          |
          +--> project.projects.organization_id
          |
          +--> organization.memberships.organization_id

A simple foreign key on `membership_id` does not enforce the Organization
equality by itself.

The final implementation must enforce this through one of:

- composite foreign keys;
- a database trigger;
- application-service transaction validation.

Composite tenant-aware foreign keys are preferred where practical.

# 34. Target Platform Bindings

A Project may target one or more robotic platforms.

The relationship is:

    Project
      |
      +--> Platform A
      |
      +--> Platform B

This allows a single Project to support multiple compatible robotic
platforms while preserving an explicit target configuration.

# 35. Binding Purpose

A target platform binding identifies:

- supported platform;
- optional platform version;
- preferred/default target;
- compatibility intent;
- project-specific metadata.

It does not duplicate Platform definitions.

# 36. `project.project_platform_bindings` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| binding_id | uuid | No | UUIDv7 | Binding identifier |
| project_id | uuid | No | None | Project |
| platform_id | uuid | No | None | Target platform |
| platform_version_id | uuid | Yes | NULL | Optional target version |
| binding_type | platform_binding_type | No | `SUPPORTED` | Binding purpose |
| status | platform_binding_status | No | `ACTIVE` | Binding lifecycle |
| is_default | boolean | No | `false` | Default target |
| compatibility_constraints | jsonb | No | `'{}'` | Bounded constraints |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 37. Platform Binding Types

Initial values:

    SUPPORTED
    PREFERRED

A Project may have multiple supported platforms but at most one effective
default platform binding.

# 38. Platform Binding Lifecycle

    ACTIVE
       |
       +----> DISABLED

Disabled bindings remain as history but cannot be selected for new execution.

# 39. Platform Binding DDL

    CREATE TYPE project.platform_binding_type AS ENUM (
        'SUPPORTED',
        'PREFERRED'
    );

    CREATE TYPE project.platform_binding_status AS ENUM (
        'ACTIVE',
        'DISABLED'
    );

    CREATE TABLE project.project_platform_bindings (
        binding_id UUID PRIMARY KEY,
        project_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        platform_version_id UUID NULL,
        binding_type project.platform_binding_type
            NOT NULL DEFAULT 'SUPPORTED',
        status project.platform_binding_status
            NOT NULL DEFAULT 'ACTIVE',
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        compatibility_constraints JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT project_platform_bindings_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT project_platform_bindings_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT project_platform_bindings_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT project_platform_bindings_unique
            UNIQUE (project_id, platform_id, platform_version_id),
        CONSTRAINT project_platform_bindings_constraints_object_check
            CHECK (
                jsonb_typeof(compatibility_constraints) = 'object'
            )
    );

# 40. Default Platform Constraint

A Project may have only one default active binding.

Recommended:

    CREATE UNIQUE INDEX project_platform_one_default_idx
        ON project.project_platform_bindings(project_id)
        WHERE is_default = TRUE
          AND status = 'ACTIVE';

# 41. Platform Binding Indexes

Recommended:

    INDEX (project_id, status)

    INDEX (platform_id, status)

    INDEX (platform_version_id)

    INDEX (project_id, is_default)

# 42. Platform Ownership

Platforms are global platform definitions owned by the Platform domain.

Projects reference them.

Projects must not copy platform definitions into project records.

The relationship is:

    platform.platforms
          |
          v
    project.project_platform_bindings
          |
          v
    project.projects

# 43. Platform Version Compatibility

If `platform_version_id` is supplied, it must belong to the referenced
`platform_id`.

This is another tenant-independent integrity rule.

The implementation should use composite references where the Platform schema
supports them.

# 44. Project Metadata

The `projects.metadata` field is bounded JSONB.

Valid uses include:

- UI display metadata;
- external reference identifiers;
- non-authoritative project annotations;
- integration metadata.

It must not become a substitute for relational project attributes.

# 45. Metadata Restrictions

Project metadata must not contain:

- source code;
- source archives;
- credentials;
- passwords;
- API tokens;
- session tokens;
- payment credentials;
- arbitrary logs;
- high-volume telemetry;
- video;
- artifact binaries.

# 46. Example Project Metadata

    {
        "customer_reference": "LAB-2026-042",
        "tags": [
            "vision",
            "humanoid",
            "research"
        ]
    }

The JSON is illustrative and must remain bounded.

# 47. Project Settings Metadata

The `project_settings.settings` JSONB field is for bounded configuration
extensions.

Examples may include:

    {
        "preferred_build_profile": "release",
        "telemetry_profile": "standard"
    }

Security and billing policies must remain relational or centrally governed.

# 48. Project Platform Compatibility Metadata

`compatibility_constraints` may contain bounded requirements such as:

    {
        "required_capabilities": [
            "camera",
            "imu",
            "arm_control"
        ],
        "minimum_runtime_version": "1.2"
    }

These are declarative requirements.

Actual compatibility remains authoritative in the Platform and Artifact
domains.

# 49. Project Creation Flow

    Authenticated User
          |
    Resolve Organization
          |
    Verify Membership
          |
    Verify project:create
          |
    Create Project
          |
    Create Project Settings
          |
    Create Default Membership
          |
    Optional Platform Binding
          |
    Commit
          |
    Emit project.created

# 50. Project Provisioning Transaction

The initial Project transaction should create:

1. Project;
2. Project Settings;
3. creator Project Member.

The transaction may additionally create a default target platform binding if
one is supplied during creation.

# 51. Project Access Flow

    User
      |
    Authenticate
      |
    Organization Membership
      |
    Project Membership / Organization Permission
      |
    Project Status Check
      |
    Resource Authorization
      |
    Operation

# 52. Project Authorization Model

Project access may be granted through:

- Organization-level permission;
- explicit Project Membership;
- project-level role.

The implementation must define precedence and avoid accidental privilege
escalation.

Recommended rule:

    Organization authorization
          +
    Project authorization
          |
          v
    Effective project access

# 53. Project Member Creation

A Project Member can only be created for an existing Organization Membership.

Flow:

    Project Admin
        |
    Validate project
        |
    Validate membership
        |
    Verify same organization
        |
    Create project member
        |
    Audit
        |
    Event

# 54. Project Member Removal

Removal should:

- mark membership `REMOVED`;
- retain history;
- revoke project-level access;
- not remove the Organization Membership.

The User may remain an Organization member.

# 55. Project Archival

Archival is intended for projects no longer under active development.

When archived:

- new builds may be blocked;
- new bookings may be blocked;
- new Jobs may be blocked;
- historical artifacts remain visible;
- historical runs remain visible;
- results remain accessible according to policy.

The exact operational restrictions are enforced by respective domains.

# 56. Project Restoration

An archived Project may return to `ACTIVE` if authorized.

Restoration must verify:

- Organization is active;
- Project is not deleted;
- required platform bindings remain valid;
- project settings remain valid.

# 57. Project Deletion

Deletion must be controlled.

Recommended flow:

    Request Delete
        |
    Verify Permission
        |
    Check Active Jobs
        |
    Check Active Bookings
        |
    Apply Retention Policy
        |
    Disable Project
        |
    Revoke New Operations
        |
    Mark DELETED
        |
    Retain Required History

A Project with active execution should not be silently deleted.

# 58. Source-Code Protection

The Project schema must not provide a server-side source-code field.

There must be no columns such as:

    source
    source_code
    repository_url
    git_repository
    source_archive

unless a future architectural decision explicitly introduces source
management.

# 59. Build Relationship

Build metadata belongs to the Build domain.

Expected relation:

    project.projects
          |
          v
    build.builds

A Build may reference:

- project;
- local build metadata;
- build result metadata.

Source code remains local.

# 60. Artifact Relationship

Artifact metadata belongs to Artifact.

Expected relation:

    project.projects
          |
          v
    artifact.artifacts

The `.krv` binary resides in object storage.

Project stores no artifact binary.

# 61. Booking Relationship

Expected relation:

    project.projects
          |
          v
    booking.bookings

A Booking may reference:

- Project;
- Organization;
- Platform;
- Resource;
- time window.

The Project schema does not own booking state.

# 62. Job Relationship

Expected relation:

    project.projects
          |
          v
    execution.jobs

Jobs remain owned by Execution.

Project authorization determines whether the User may initiate or observe
Jobs.

# 63. Run Relationship

Expected relation:

    project.projects
          |
          v
    execution.runs

A Run should preserve sufficient historical project identity even if the
Project later changes state.

# 64. Result Relationship

Expected relation:

    project.projects
          |
          v
    result.results

Result ownership remains in Result.

Project access is part of the result authorization path.

# 65. Experiment Relationship

Expected future relation:

    project.projects
          |
          v
    experiment.experiments
          |
          v
    execution.runs

Experiments are grouped under Projects but are not part of this schema.

# 66. Organization Relationship

Every Project must have:

    project.organization_id

The Organization must exist.

Project creation must validate the creator's Organization Membership.

# 67. Identity Relationship

The following columns may reference Identity Users:

    projects.created_by
    projects.updated_by
    project_settings.created_by
    project_settings.updated_by
    project_members.created_by
    project_members.updated_by
    project_platform_bindings.created_by
    project_platform_bindings.updated_by

These are actor references, not ownership.

# 68. Audit Columns

Project domain tables use:

- `created_at`;
- `updated_at`;
- `created_by`;
- `updated_by`.

Lifecycle-specific fields include:

- `archived_at`;
- `deleted_at`;
- `removed_at`;
- `suspended_at`.

Audit history itself is owned by the Audit domain.

# 69. Foreign-Key Delete Policy

Recommended:

| Relationship | Delete Policy |
|---|---|
| Project → Organization | RESTRICT |
| Project → Creator | RESTRICT |
| Project → Updater | SET NULL |
| Settings → Project | RESTRICT |
| Member → Project | RESTRICT |
| Member → Organization Membership | RESTRICT |
| Binding → Project | RESTRICT |
| Binding → Platform | RESTRICT |
| Binding → Platform Version | RESTRICT |

Business history must not disappear through cascading deletion.

# 70. Project Example Row

    project_id:
      0194c7d0-8b00-7abc-9def-323456789001

    organization_id:
      0194c7d0-8b00-7abc-9def-223456789001

    project_key:
      humanoid-vision

    name:
      Humanoid Vision Experiment

    status:
      ACTIVE

    created_by:
      0194c7d0-8b00-7abc-9def-123456789001

# 71. Project Settings Example

    project_id:
      0194c7d0-8b00-7abc-9def-323456789001

    default_artifact_format:
      krv

    allow_remote_execution:
      true

    require_artifact_signature:
      true

    default_runtime_version:
      1.0

# 72. Project Member Example

    project_member_id:
      0194c7d0-8b00-7abc-9def-323456789002

    project_id:
      0194c7d0-8b00-7abc-9def-323456789001

    organization_membership_id:
      0194c7d0-8b00-7abc-9def-423456789001

    status:
      ACTIVE

    member_role:
      ADMIN

# 73. Platform Binding Example

    binding_id:
      0194c7d0-8b00-7abc-9def-323456789003

    project_id:
      0194c7d0-8b00-7abc-9def-323456789001

    platform_id:
      0194c7d0-8b00-7abc-9def-523456789001

    binding_type:
      PREFERRED

    status:
      ACTIVE

    is_default:
      true

# 74. Complete Project Relationship Diagram

    +-----------------------------+
    | organization.organizations |
    |-----------------------------|
    | organization_id PK         |
    +-------------+---------------+
                  |
                  | 1:N
                  v
    +-----------------------------+
    | project.projects            |
    |-----------------------------|
    | project_id PK              |
    | organization_id FK        |
    | project_key               |
    | status                    |
    +----+-----------+-----------+
         |           |
         |           |
         v           v
    project_       project_
    settings       members
         |
         |
         v
    project_platform_bindings
         |
         v
    platform.platforms

# 75. Complete Product Relationship

    Organization
         |
         +-- Project
               |
               +-- Project Settings
               |
               +-- Project Members
               |
               +-- Platform Bindings
               |
               +-- Builds
               |
               +-- Artifacts
               |
               +-- Bookings
               |
               +-- Jobs
               |
               +-- Runs
               |
               +-- Results
               |
               +-- Experiments

# 76. Repository Interfaces

Recommended:

    ProjectRepository
    ProjectSettingsRepository
    ProjectMemberRepository
    ProjectPlatformBindingRepository

# 77. Project Repository Interface

Conceptual operations:

    create
    get_by_id
    get_by_key
    list_by_organization
    update
    archive
    restore
    mark_deleted

Every read must support tenant authorization.

# 78. Project Settings Interface

Conceptual operations:

    get
    create_defaults
    update
    reset_defaults

Settings mutation requires project-level authorization.

# 79. Project Member Interface

Conceptual operations:

    add
    get
    list
    suspend
    reactivate
    remove
    update_role

Member operations require:

    Project authorization
    +
    Organization membership validation

# 80. Platform Binding Interface

Conceptual operations:

    bind
    list
    get
    set_default
    disable
    enable
    unbind

Unbinding must not invalidate historical artifacts or runs.

# 81. Application Services

Recommended services:

    ProjectService
    ProjectSettingsService
    ProjectMembershipService
    ProjectPlatformService
    ProjectAuthorizationService

These services define:

- validation;
- authorization;
- transactions;
- lifecycle;
- cross-domain coordination.

# 82. Authorization Service

Project authorization should conceptually expose:

    authorizeProject(
        user_id,
        project_id,
        required_permission
    )

The service must:

1. authenticate User;
2. resolve Organization;
3. verify active Organization Membership;
4. resolve Project;
5. verify Project status;
6. evaluate Project Membership/role;
7. evaluate Organization permissions;
8. return authorization decision.

# 83. Project Creation API Contract

Conceptual request:

    {
        "organization_id": "0194...",
        "project_key": "humanoid-vision",
        "name": "Humanoid Vision Experiment",
        "description": "Vision development project",
        "platform_id": "0194..."
    }

The Organization ID must be validated against the authenticated context.

# 84. Project Creation Response

Conceptual response:

    {
        "project_id": "0194...",
        "organization_id": "0194...",
        "project_key": "humanoid-vision",
        "status": "ACTIVE"
    }

No source code is included.

# 85. Project Update Rules

Mutable:

- name;
- description;
- metadata;
- project settings;
- target platform bindings;
- project members.

Normally immutable:

- project_id;
- organization_id;
- project_key.

Changing tenant ownership is not a normal Project update.

# 86. Project Transfer

Project transfer between Organizations should not be supported as a simple
UPDATE.

If future business requirements need transfer, it must be an explicit,
transactional workflow covering:

- authorization;
- target Organization;
- project members;
- artifacts;
- bookings;
- jobs;
- runs;
- results;
- credits;
- audit.

Until defined, Organization ownership is immutable.

# 87. Project Metadata Limits

Recommended initial limits:

| Field | Limit |
|---|---:|
| Project key | 100 characters |
| Name | 200 characters |
| Description | 2000 characters |
| Metadata | bounded implementation limit |
| Settings | bounded implementation limit |
| Compatibility constraints | bounded implementation limit |

Exact JSONB byte limits remain an implementation decision.

# 88. Project Retention

Initial retention direction:

| Data | Retention |
|---|---|
| Project identity | Long-term / policy |
| Project settings | Project lifecycle |
| Project membership | Long-term historical policy |
| Platform bindings | Project lifecycle + history |
| Project metadata | Project lifecycle |
| Deleted project metadata | Policy-based |
| Audit events | Multi-year / policy |

Project history may need to outlive active Project status.

# 89. Deleted Project Handling

A deleted Project must not be returned in ordinary active-project queries.

Historical references may still resolve to a deleted Project when required for:

- audit;
- financial records;
- execution history;
- compliance;
- customer support.

# 90. Archive Versus Delete

Archive:

    Project remains part of tenant history.

Delete:

    Project lifecycle is closed and deletion/retention processing may begin.

Archive must not be interpreted as privacy deletion.

# 91. Data Privacy

Project metadata may contain customer information.

Therefore:

- metadata should be minimized;
- export should include project metadata;
- deletion should include eligible metadata;
- retention policies must be enforced;
- legal holds may override deletion.

# 92. Backup and Restore

Project tables are part of PostgreSQL authoritative business state.

They must be included in:

- automated backups;
- PITR;
- snapshots;
- restore testing;
- disaster recovery.

Initial database targets remain:

    RPO <= 15 minutes
    RTO <= 4 hours

# 93. Performance

Primary access patterns are:

    Project by ID
    Project by Organization
    Project by Organization + key
    Members by Project
    Platforms by Project
    Projects by User membership

Indexes are designed around these access patterns.

# 94. Tenant-Aware Indexing

Recommended patterns:

    (organization_id, status)
    (organization_id, created_at)
    (organization_id, project_key)
    (project_id, status)

This supports both authorization and query performance.

# 95. Concurrency

Concurrent operations requiring protection include:

- duplicate Project creation;
- simultaneous archive/restore;
- concurrent member removal;
- simultaneous default-platform selection;
- duplicate platform binding;
- concurrent project deletion;
- owner/member changes.

Unique constraints and transactions provide primary protection.

# 96. Default Platform Selection

Setting a default platform should be transactional.

Flow:

    Lock Project
       |
    Validate Binding ACTIVE
       |
    Clear Existing Default
       |
    Set New Default
       |
    Commit

The partial unique index provides final database protection.

# 97. Project Member Owner Protection

Every active Project should have an effective Owner or equivalent administrative
authority.

Removing the final Owner must be blocked unless another Owner is assigned in
the same transaction.

# 98. Project Member Organization Protection

A Project Member cannot reference a Membership from another Organization.

This is a critical tenant-isolation invariant.

# 99. Platform Binding Validation

When adding a binding:

1. Project must exist.
2. Project must be ACTIVE.
3. Platform must exist.
4. Platform must be available for selection.
5. Platform version must belong to Platform.
6. Project authorization must permit the change.
7. Duplicate binding must be rejected.

# 100. Artifact Compatibility

Project platform bindings are not sufficient to guarantee artifact
compatibility.

Final execution compatibility is determined by:

    Artifact Manifest
        +
    Platform
        +
    Platform Version
        +
    Runtime
        +
    Required Capabilities

The Project binding expresses intended targets.

# 101. Build Relationship

A Build may reference Project.

The Project schema does not own Build lifecycle.

The local workflow remains:

    Project
      |
    Local Source
      |
    Local Build
      |
    Local Test
      |
    .krv Artifact
      |
    RaaS Artifact Registration

# 102. Remote Execution Boundary

Project metadata crosses into RaaS.

Source code does not.

The intended security boundary remains:

    Local Source
        |
        X  not uploaded
        |
        v
    Local Build
        |
        v
    Signed .krv
        |
        v
    Project / Artifact
        |
        v
    Remote Execution

# 103. Events

Recommended Project events:

    project.created
    project.updated
    project.archived
    project.restored
    project.deleted

    project.member_added
    project.member_suspended
    project.member_removed
    project.member_role_changed

    project.platform_bound
    project.platform_unbound
    project.platform_default_changed

    project.settings_updated

Events must contain:

- event ID;
- resource;
- organization context;
- sequence;
- correlation;
- timestamp.

# 104. Event Authority

Events are not authoritative state.

PostgreSQL remains authoritative.

If event delivery fails:

    durable database state
        |
        v
    event publication/retry
        |
        v
    consumers

Consumers must be idempotent.

# 105. Audit Requirements

Audit records should include:

- project creation;
- project updates;
- archival;
- restoration;
- deletion;
- membership changes;
- platform binding changes;
- settings changes;
- ownership-sensitive operations.

Audit belongs to the Audit domain.

# 106. Migration Ordering

Recommended migration order:

    1. project schema
    2. project status enums
    3. project member enums
    4. platform binding enums
    5. projects
    6. project_settings
    7. project_members
    8. project_platform_bindings
    9. indexes
    10. tenant-aware composite constraints/triggers

Cross-domain foreign keys should be introduced only after referenced schemas
exist.

# 107. Phase 0 Mapping

Phase 0 defines:

- Project domain ownership;
- Organization tenant relationship;
- UUIDv7 strategy;
- repository boundaries;
- migration strategy;
- no-source-code policy.

# 108. Phase 1 Mapping

Phase 1 establishes:

- Organization integration;
- authenticated User context;
- Project creation;
- Project membership;
- project authorization.

# 109. Phase 2 Mapping

Phase 2 is the primary Project implementation phase.

It includes:

- Project schema;
- Project settings;
- platform bindings;
- project metadata;
- Studio project workspace;
- project/artifact integration;
- project/build integration.

# 110. Phase 3 Mapping

Phase 3 integrates Projects with:

- Jobs;
- Runs;
- execution authorization;
- reconciliation.

Project identity must remain stable throughout execution.

# 111. Phase 4 Mapping

Phase 4 integrates Projects with:

- Bookings;
- Credits;
- platform-specific credit consumption.

Project ownership must not override Organization financial ownership.

# 112. Phase 5 Mapping

Phase 5 integrates Projects with:

- artifact upload;
- remote deployment;
- execution;
- live telemetry;
- logs;
- results.

The source-code boundary remains unchanged.

# 113. Phase 6 Mapping

Phase 6 integrates Projects with:

- Lab resources;
- physical robot execution;
- operational permissions.

Project metadata does not become robot state.

# 114. Phase 7 Mapping

Phase 7 integrates Projects with:

- Results;
- Experiments;
- event persistence;
- audit;
- analytics.

# 115. Phase 8 Mapping

Phase 8 completes:

- project retention;
- privacy deletion;
- export;
- backup/restore;
- performance;
- production tenant isolation;
- operational hardening.

# 116. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cross-tenant Project access | Critical | organization_id + authorization |
| Source-code leakage | Critical | No source columns/storage |
| Wrong Organization membership | Critical | Tenant-aware constraints |
| Unauthorized project member | High | Active membership validation |
| Platform mismatch | High | Platform binding + artifact validation |
| Duplicate default platform | Medium | Partial unique index |
| Project deletion during execution | High | Lifecycle guards |
| Owner lockout | High | Owner protection |
| Metadata abuse | Medium | Bounded JSONB |
| Stale platform binding | Medium | Platform validation |
| Cascade deletion | High | RESTRICT business relationships |
| Missing tenant filter | Critical | Repository tests |
| Project transfer corruption | High | Transfer disabled initially |
| Archive misuse | Medium | Explicit lifecycle semantics |

# 117. Open Questions

1. Should Project roles remain enum-based or move to reusable Organization
   roles?
2. Should Project Membership support custom roles?
3. Should Project Membership be mandatory when Organization permissions
   already grant access?
4. Final precedence between Organization and Project permissions.
5. Final project key normalization rules.
6. Final project metadata size limit.
7. Final settings schema validation strategy.
8. Final target platform compatibility model.
9. Whether Projects may bind to platform versions only or also platform
   families.
10. Whether a Project can have multiple preferred platforms.
11. Whether Project transfer will ever be supported.
12. Final archived-project operational restrictions.
13. Final deleted-project retention period.
14. Whether Project source integration may be introduced in a future product
    phase.
15. Final RLS decision.
16. Final project-level audit retention.
17. Final API representation of Project Membership.
18. Final default project role model.

# 118. Acceptance Criteria — Schema

- [ ] `project` PostgreSQL schema exists.
- [ ] `projects` table exists.
- [ ] `project_settings` table exists.
- [ ] `project_members` table exists.
- [ ] `project_platform_bindings` table exists.
- [ ] Project status enum exists.
- [ ] Project member status enum exists.
- [ ] Project member role enum exists.
- [ ] Platform binding type enum exists.
- [ ] Platform binding status enum exists.
- [ ] All primary keys use UUID.
- [ ] UUIDv7 generation is standardized.
- [ ] Required foreign keys exist.
- [ ] Required unique constraints exist.
- [ ] Required indexes exist.
- [ ] Required check constraints exist.

# 119. Acceptance Criteria — Projects

- [ ] Every Project belongs to exactly one Organization.
- [ ] Organization ownership is immutable under normal updates.
- [ ] Project key is unique within Organization.
- [ ] Project status lifecycle is enforced.
- [ ] Creator is recorded.
- [ ] Update actor is recorded.
- [ ] Creation and update timestamps are maintained.
- [ ] Archive state is represented.
- [ ] Deletion state is represented.
- [ ] Metadata is JSONB object.
- [ ] Metadata does not contain source code.
- [ ] Project lookup by Organization is indexed.

# 120. Acceptance Criteria — Project Settings

- [ ] One settings row exists per Project.
- [ ] Settings are tenant-scoped through Project.
- [ ] Default artifact format is defined.
- [ ] Remote execution policy is defined.
- [ ] Artifact signature policy is defined.
- [ ] Result retention override is validated.
- [ ] JSON settings are bounded.
- [ ] Settings cannot weaken global security policy.
- [ ] Settings changes are audited.

# 121. Acceptance Criteria — Project Members

- [ ] Project member references an Organization Membership.
- [ ] Duplicate Project Membership is prevented.
- [ ] Member lifecycle is enforced.
- [ ] Project roles are constrained.
- [ ] Cross-Organization membership is prevented.
- [ ] Removed members lose access.
- [ ] Member history is retained according to policy.
- [ ] Membership changes are audited.
- [ ] Final Project Owner protection is implemented.

# 122. Acceptance Criteria — Platform Bindings

- [ ] Project can bind to multiple Platforms.
- [ ] Duplicate Platform bindings are prevented.
- [ ] Optional Platform Version is supported.
- [ ] Platform Version compatibility is validated.
- [ ] Binding lifecycle is enforced.
- [ ] Only one default active binding exists.
- [ ] Platform definitions remain owned by Platform domain.
- [ ] Historical bindings remain traceable.
- [ ] Binding changes are audited.

# 123. Acceptance Criteria — Source Boundary

- [ ] No Project source-code column exists.
- [ ] No Project source archive is stored.
- [ ] No Git repository is required by Project schema.
- [ ] Source remains local to Studio.
- [ ] `.krv` artifact metadata is separate from Project.
- [ ] Artifact binary is stored outside PostgreSQL.
- [ ] Server-side Project metadata cannot contain source by contract.

# 124. Acceptance Criteria — Tenancy

- [ ] Organization is mandatory on Project.
- [ ] Tenant-aware queries are used.
- [ ] Client Organization IDs cannot override authenticated context.
- [ ] Project access requires Organization authorization.
- [ ] Project Members cannot cross Organizations.
- [ ] Cross-tenant integration tests pass.
- [ ] Repository methods require tenant context where applicable.

# 125. Acceptance Criteria — Lifecycle

- [ ] ACTIVE state is implemented.
- [ ] ARCHIVED state is implemented.
- [ ] DELETED state is implemented.
- [ ] Archive timestamp is consistent.
- [ ] Delete timestamp is consistent.
- [ ] Archive blocks configured operational actions.
- [ ] Delete workflow validates active operations.
- [ ] Restore is authorized and transactional.
- [ ] Lifecycle events are emitted.

# 126. Acceptance Criteria — Integration

- [ ] Identity User integration passes.
- [ ] Organization Membership integration passes.
- [ ] Build integration passes.
- [ ] Artifact integration passes.
- [ ] Platform integration passes.
- [ ] Booking integration passes.
- [ ] Credit integration passes.
- [ ] Job integration passes.
- [ ] Run integration passes.
- [ ] Result integration passes.
- [ ] Experiment integration passes.
- [ ] Audit integration passes.
- [ ] Event integration passes.

# 127. Acceptance Criteria — Security

- [ ] Project authorization is deny-by-default.
- [ ] Active Organization Membership is checked.
- [ ] Project-level authorization is checked where required.
- [ ] Project metadata cannot contain secrets.
- [ ] Source code is not stored.
- [ ] Tenant filters are enforced server-side.
- [ ] Administrative actions are audited.
- [ ] Project member role changes are audited.
- [ ] Platform binding changes are audited.

# 128. Acceptance Criteria — Data Integrity

- [ ] No Project exists without Organization.
- [ ] No Project Member exists without Project.
- [ ] No Project Member exists without Organization Membership.
- [ ] Project Member Organization matches Project Organization.
- [ ] No Project Settings row exists without Project.
- [ ] No binding exists without Project.
- [ ] No binding exists without Platform.
- [ ] Platform Version belongs to Platform.
- [ ] Only one default active binding exists.
- [ ] No duplicate Project key exists within Organization.

# 129. Acceptance Criteria — Operations

- [ ] Empty database migration succeeds.
- [ ] CI validates migrations.
- [ ] Seed data is deterministic.
- [ ] Default Project settings are deterministic.
- [ ] Schema drift is detectable.
- [ ] Backup includes Project schema.
- [ ] Restore includes Project schema.
- [ ] Database observability includes Project queries.
- [ ] Tenant isolation tests run in CI.
- [ ] Migration production runbook exists.

# 130. Acceptance Criteria — Privacy and Retention

- [ ] Project metadata is exportable.
- [ ] Project deletion policy is documented.
- [ ] Project archive is distinct from deletion.
- [ ] Historical references remain resolvable where required.
- [ ] Project membership retention is documented.
- [ ] Platform binding retention is documented.
- [ ] Legal holds can prevent deletion.
- [ ] Customer source code is not retained by Project.

# 131. Acceptance Criteria — Performance

- [ ] Project lookup by ID is efficient.
- [ ] Project lookup by Organization is indexed.
- [ ] Project key lookup is indexed.
- [ ] Member lookup by Project is indexed.
- [ ] Member lookup by Organization Membership is indexed.
- [ ] Platform binding lookup by Project is indexed.
- [ ] Platform lookup is indexed.
- [ ] Default binding lookup is indexed.
- [ ] Tenant-scoped query plans are validated.

# 132. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Project domain boundary accepted.
- [ ] Tenant model accepted.
- [ ] UUIDv7 strategy accepted.
- [ ] No-source-code policy accepted.

Phase 1:

- [ ] Organization integration passes.
- [ ] Identity integration passes.
- [ ] Project authorization passes.

Phase 2:

- [ ] Projects implemented.
- [ ] Settings implemented.
- [ ] Members implemented.
- [ ] Platform bindings implemented.
- [ ] Project/Artifact integration passes.
- [ ] Project/Build integration passes.

Phase 3:

- [ ] Project/Job integration passes.
- [ ] Project/Run integration passes.
- [ ] Execution authorization passes.

Phase 4:

- [ ] Project/Booking integration passes.
- [ ] Project/Credit authorization passes.

Phase 5:

- [ ] Project/Artifact/Execution flow passes.
- [ ] Remote execution authorization passes.
- [ ] Result access is tenant-safe.

Phase 6:

- [ ] Physical robot execution remains project-authorized.
- [ ] Lab operations remain Organization-controlled.

Phase 7:

- [ ] Results and Experiments integrate correctly.
- [ ] Audit and Events integrate correctly.

Phase 8:

- [ ] Retention passes.
- [ ] Privacy deletion passes.
- [ ] Export passes.
- [ ] Backup/restore passes.
- [ ] Production tenant isolation passes.
- [ ] Performance acceptance passes.

# 133. Final Invariants

The following must always remain true:

1. Every Project has exactly one Organization.
2. `organization_id` is mandatory on Project.
3. Project ownership is Organization-based.
4. User identity is separate from Project ownership.
5. Project key is unique within Organization.
6. Project UUID is immutable.
7. Organization ownership is not changed by normal Project updates.
8. Project lifecycle is explicit.
9. Archive is not deletion.
10. Deletion is a controlled workflow.
11. Project Members must reference Organization Membership.
12. Project Members cannot cross Organization boundaries.
13. Project authorization cannot bypass Organization authorization.
14. Project Settings belong to exactly one Project.
15. Target Platforms are references, not copied definitions.
16. Platform Version must belong to Platform.
17. Only one active default platform binding may exist.
18. Project metadata is bounded JSONB.
19. Project metadata does not contain source code.
20. RaaS does not store Project source code.
21. Artifact binaries remain outside PostgreSQL.
22. Build lifecycle is owned by Build.
23. Artifact lifecycle is owned by Artifact.
24. Booking lifecycle is owned by Booking.
25. Job and Run lifecycle are owned by Execution.
26. Result lifecycle is owned by Result.
27. Experiment lifecycle is owned by Experiment.
28. Audit lifecycle is owned by Audit.
29. Cross-domain writes use application services.
30. PostgreSQL is authoritative for Project state.
31. Events do not replace durable Project state.
32. Business history is protected from accidental cascade deletion.
33. Project authorization is tenant-aware.
34. All security-sensitive Project operations are auditable.
35. Project deletion must not accidentally delete Organization history.
36. Source-code confidentiality remains a first-class architecture boundary.

# 134. Final Architecture Statement

> **A Kritva RaaS Project is the customer's durable robotics workspace inside
> an Organization. It provides the stable identity and authorization context
> that connects local development with remote robotics execution without
> requiring RaaS to store customer source code.**
>
> **The Project owns metadata, configuration, collaboration membership and
> target-platform intent. Build, Artifact, Booking, Execution, Result,
> Experiment and Lab domains remain independently authoritative for their
> respective data and lifecycle.**
>
> **The Project schema therefore forms a critical integration boundary:
> Organization establishes tenancy, Identity establishes the User, Project
> establishes the workspace, Platform establishes the intended robotic
> target, Artifact establishes the executable package, and Execution
> establishes the remote run. The source remains local.**
>
> **This separation preserves the agreed Kritva RaaS principle:
> Build locally, upload only the validated execution artifact, execute
> remotely, observe the run, and retain project-level history without
> requiring customer source-code storage in the RaaS platform.**
