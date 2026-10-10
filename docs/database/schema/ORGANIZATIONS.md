# Kritva RaaS Organizations Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Organizations Schema |
| Path | `docs/database/schema/ORGANIZATIONS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `organization` |
| Primary Domain Owner | Organization Module |
| Identifier Strategy | UUIDv7 |
| Tenant Model | Organization-based logical multi-tenancy |
| Data Classification | Confidential / Restricted |
| Phase Coverage | Phase 0–Phase 8 |
| Related Identity Schema | `identity` |
| Related Domains | Project, Platform, Artifact, Booking, Credit, Execution, Result, Audit |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for Kritva RaaS
organizations and tenant authorization.

The schema establishes the authoritative persistence model for:

- organizations;
- organization memberships;
- roles;
- permissions;
- role-permission assignments;
- membership-role assignments;
- organization invitations;
- tenant settings.

The Organization domain establishes the primary tenant boundary for customer
data and provides the authorization relationship between Users and
Organizations.

# 3. Scope

This document defines:

- organization lifecycle;
- organization identity;
- organization tenancy;
- memberships;
- roles;
- permissions;
- role-permission relationships;
- membership-role relationships;
- invitations;
- tenant settings;
- ownership;
- audit metadata;
- foreign keys;
- unique constraints;
- indexes;
- check constraints;
- state machines;
- retention;
- example records;
- SQL DDL;
- application interfaces;
- cross-domain relationships;
- Phase 0–Phase 8 mapping;
- risks;
- open questions;
- acceptance criteria.

# 4. Non-Goals

This document does not define:

- User identity itself;
- password credentials;
- sessions;
- API token secrets;
- project schema;
- billing schema;
- credit ledger;
- payment-provider records;
- robot resources;
- application-level authorization middleware implementation;
- final enterprise SSO provider selection.

User identity is owned by the Identity domain.

# 5. Design Principles

The Organization schema follows these principles:

1. Organization is the primary customer tenant boundary.
2. User identity is separate from organization membership.
3. A User may belong to multiple Organizations.
4. An Organization may have many Users.
5. Membership determines participation in an Organization.
6. Roles determine collections of permissions.
7. Permissions are stable authorization capabilities.
8. Membership roles are organization-scoped.
9. Invitations do not create authorization by themselves.
10. Tenant settings belong to the Organization.
11. Organization data is isolated through application authorization and
   tenant-aware database constraints.
12. Cross-domain writes are performed through application services.
13. Historical business records are not casually cascade-deleted.
14. Authorization decisions must be based on server-controlled identity and
   membership state.
15. Organization state and membership state are authoritative in PostgreSQL.

# 6. Logical Schema

The logical Organization schema is:

    organization
        |
        +-- organizations
        |
        +-- memberships
        |
        +-- roles
        |
        +-- permissions
        |
        +-- role_permissions
        |
        +-- membership_roles
        |
        +-- invitations
        |
        +-- tenant_settings

# 7. Tenant Boundary

The primary tenancy relationship is:

    identity.users
          |
          | N:M
          v
    organization.memberships
          |
          v
    organization.organizations

A User is global.

An Organization is a tenant.

A Membership establishes the User's relationship with that tenant.

# 8. Tenant-Owned Data

Customer-owned domain records should normally carry:

    organization_id

Examples include:

- projects;
- artifacts;
- bookings;
- jobs;
- runs;
- results;
- experiments;
- credit wallets;
- audit records where applicable.

This provides an explicit tenant ownership path.

# 9. Tenant Ownership Rule

The core invariant is:

    Every tenant-owned business record
    must resolve to exactly one Organization.

Where practical:

    organization_id NOT NULL

should exist directly on tenant-owned tables.

Indirect tenant inference should not be the only isolation mechanism.

# 10. Organization Lifecycle

Recommended organization states:

    PENDING
       |
       v
    ACTIVE
       |
       +----> SUSPENDED
       |          |
       |          v
       |        ACTIVE
       |
       +----> DEACTIVATED
       |
       +----> DELETED

# 11. Organization Status Definitions

| Status | Meaning |
|---|---|
| PENDING | Organization creation is incomplete |
| ACTIVE | Organization may operate |
| SUSPENDED | Temporarily blocked from operation |
| DEACTIVATED | Organization intentionally disabled |
| DELETED | Organization lifecycle closed |

Suspension must not automatically delete memberships or business history.

# 12. Membership Lifecycle

Recommended states:

    INVITED
       |
       v
    ACTIVE
       |
       +----> SUSPENDED
       |
       +----> REMOVED

An invitation is a separate object and should not be represented solely by a
membership row.

# 13. Role Model

Roles are authorization bundles.

Conceptually:

    Role
      |
      +---- Permission
      +---- Permission
      +---- Permission

Memberships receive roles:

    User
      |
    Membership
      |
    Role
      |
    Permissions

# 14. Permission Model

A Permission represents one stable authorization capability.

Examples:

    organization:read
    organization:update
    member:read
    member:invite
    member:remove
    project:read
    project:write
    artifact:read
    artifact:write
    booking:read
    booking:write
    job:read
    job:execute
    result:read
    billing:read
    billing:manage

Permissions are not tenant records.

They are global authorization definitions.

# 15. Role Scope

Roles are represented globally but assigned within an Organization.

This permits:

    Organization A
        Admin -> organization-specific membership

    Organization B
        Admin -> different membership

The role definition remains stable.

# 16. System and Custom Roles

The initial model should support:

- system roles;
- organization-defined custom roles.

System roles are managed by Kritva.

Custom roles are managed by authorized organization administrators.

The exact custom-role policy remains an implementation decision.

# 17. Recommended System Roles

Initial roles:

| Role | Purpose |
|---|---|
| Owner | Full organization control |
| Admin | Organization administration |
| Developer | Project/build/artifact operations |
| Operator | Booking/job execution operations |
| Researcher | Research and result access |
| Viewer | Read-only access |

The exact permission assignment must be version controlled.

# 18. Organization Table

`organization.organizations` is the tenant root.

It contains:

- immutable organization ID;
- stable organization slug;
- display name;
- lifecycle state;
- creation metadata;
- lifecycle timestamps.

# 19. `organization.organizations` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| organization_id | uuid | No | UUIDv7 | Tenant identifier |
| organization_key | citext | No | None | Stable unique tenant key |
| name | varchar(200) | No | None | Organization display name |
| legal_name | varchar(300) | Yes | NULL | Legal organization name |
| status | organization_status | No | `PENDING` | Lifecycle state |
| owner_user_id | uuid | Yes | NULL | Initial/primary owner |
| created_at | timestamptz | No | `now()` | Creation time |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |
| activated_at | timestamptz | Yes | NULL | Activation time |
| suspended_at | timestamptz | Yes | NULL | Suspension time |
| deactivated_at | timestamptz | Yes | NULL | Deactivation time |
| deleted_at | timestamptz | Yes | NULL | Deletion marker |

# 20. Organization Key

`organization_key` is a stable human-compatible identifier.

It may be used for:

- URLs;
- CLI configuration;
- API references;
- support operations.

It must not be used as the relational primary key.

The UUID remains authoritative.

# 21. Organization Constraints

Required constraints:

- primary key on `organization_id`;
- unique `organization_key`;
- valid lifecycle status;
- lifecycle timestamp consistency.

# 22. Organization DDL

    CREATE TYPE organization.organization_status AS ENUM (
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED'
    );

    CREATE TABLE organization.organizations (
        organization_id UUID PRIMARY KEY,
        organization_key CITEXT NOT NULL,
        name VARCHAR(200) NOT NULL,
        legal_name VARCHAR(300) NULL,
        status organization.organization_status
            NOT NULL DEFAULT 'PENDING',
        owner_user_id UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        activated_at TIMESTAMPTZ NULL,
        suspended_at TIMESTAMPTZ NULL,
        deactivated_at TIMESTAMPTZ NULL,
        deleted_at TIMESTAMPTZ NULL,
        CONSTRAINT organizations_key_unique
            UNIQUE (organization_key),
        CONSTRAINT organizations_deleted_status_check
            CHECK (
                deleted_at IS NULL
                OR status = 'DELETED'
            ),
        CONSTRAINT organizations_suspended_status_check
            CHECK (
                suspended_at IS NULL
                OR status IN ('SUSPENDED', 'DEACTIVATED', 'DELETED')
            ),
        CONSTRAINT organizations_deactivated_status_check
            CHECK (
                deactivated_at IS NULL
                OR status IN ('DEACTIVATED', 'DELETED')
            )
    );

# 23. Organization Indexes

Required:

    PRIMARY KEY (organization_id)

    UNIQUE (organization_key)

Recommended:

    INDEX (status)

    INDEX (owner_user_id)

    INDEX (created_at)

    INDEX (deleted_at)

# 24. Membership Table

`organization.memberships` is the tenant authorization boundary between a User
and an Organization.

It represents:

    User X belongs to Organization Y

It does not represent authentication.

# 25. `organization.memberships` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| membership_id | uuid | No | UUIDv7 | Membership identifier |
| organization_id | uuid | No | None | Tenant |
| user_id | uuid | No | None | Identity User |
| status | membership_status | No | `ACTIVE` | Membership lifecycle |
| display_name | varchar(200) | Yes | NULL | Tenant-specific display label |
| joined_at | timestamptz | No | `now()` | Membership start |
| suspended_at | timestamptz | Yes | NULL | Suspension time |
| removed_at | timestamptz | Yes | NULL | Removal time |
| created_at | timestamptz | No | `now()` | Creation time |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 26. Membership Uniqueness

A User may have only one membership in an Organization.

Therefore:

    UNIQUE (
        organization_id,
        user_id
    )

# 27. Membership DDL

    CREATE TYPE organization.membership_status AS ENUM (
        'ACTIVE',
        'SUSPENDED',
        'REMOVED'
    );

    CREATE TABLE organization.memberships (
        membership_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        user_id UUID NOT NULL,
        status organization.membership_status
            NOT NULL DEFAULT 'ACTIVE',
        display_name VARCHAR(200) NULL,
        joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        suspended_at TIMESTAMPTZ NULL,
        removed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT memberships_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT memberships_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT memberships_org_user_unique
            UNIQUE (organization_id, user_id),
        CONSTRAINT memberships_suspended_check
            CHECK (
                suspended_at IS NULL
                OR status IN ('SUSPENDED', 'REMOVED')
            ),
        CONSTRAINT memberships_removed_check
            CHECK (
                removed_at IS NULL
                OR status = 'REMOVED'
            )
    );

# 28. Membership Indexes

Required:

    UNIQUE (organization_id, user_id)

Recommended:

    INDEX (organization_id, status)

    INDEX (user_id, status)

    INDEX (created_at)

# 29. Membership Tenant Rule

Every membership contains `organization_id`.

This column is the primary authorization partition key.

All organization-scoped queries should normally include:

    organization_id = authenticated_organization_id

# 30. Role Table

`organization.roles` defines authorization bundles.

Roles are global definitions that may be:

- system-managed;
- organization-owned custom roles.

# 31. `organization.roles` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| role_id | uuid | No | UUIDv7 | Role identifier |
| organization_id | uuid | Yes | NULL | Owning tenant for custom roles |
| role_key | varchar(100) | No | None | Stable role key |
| name | varchar(150) | No | None | Display name |
| description | varchar(500) | Yes | NULL | Role description |
| role_type | role_type | No | `SYSTEM` | System/custom |
| status | role_status | No | `ACTIVE` | Role lifecycle |
| created_at | timestamptz | No | `now()` | Creation time |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |
| archived_at | timestamptz | Yes | NULL | Archive time |

# 32. Role Ownership

For system roles:

    organization_id IS NULL

For custom roles:

    organization_id IS NOT NULL

This distinction must be enforced.

# 33. Role DDL

    CREATE TYPE organization.role_type AS ENUM (
        'SYSTEM',
        'CUSTOM'
    );

    CREATE TYPE organization.role_status AS ENUM (
        'ACTIVE',
        'ARCHIVED'
    );

    CREATE TABLE organization.roles (
        role_id UUID PRIMARY KEY,
        organization_id UUID NULL,
        role_key VARCHAR(100) NOT NULL,
        name VARCHAR(150) NOT NULL,
        description VARCHAR(500) NULL,
        role_type organization.role_type NOT NULL,
        status organization.role_status NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        archived_at TIMESTAMPTZ NULL,
        CONSTRAINT roles_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT roles_ownership_check
            CHECK (
                (role_type = 'SYSTEM' AND organization_id IS NULL)
                OR
                (role_type = 'CUSTOM' AND organization_id IS NOT NULL)
            ),
        CONSTRAINT roles_archive_check
            CHECK (
                archived_at IS NULL
                OR status = 'ARCHIVED'
            )
    );

# 34. Role Uniqueness

System roles use a globally unique role key.

Custom roles must be unique within an Organization.

Recommended implementation:

    CREATE UNIQUE INDEX roles_system_key_unique
        ON organization.roles(role_key)
        WHERE role_type = 'SYSTEM';

    CREATE UNIQUE INDEX roles_custom_org_key_unique
        ON organization.roles(organization_id, role_key)
        WHERE role_type = 'CUSTOM';

# 35. Role Indexes

Recommended:

    INDEX (organization_id, status)

    INDEX (role_type, status)

# 36. Permission Table

`organization.permissions` contains stable authorization capabilities.

Permissions are globally defined.

They are not copied per organization.

# 37. `organization.permissions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| permission_id | uuid | No | UUIDv7 | Permission identifier |
| permission_key | varchar(150) | No | None | Stable permission key |
| resource | varchar(80) | No | None | Resource category |
| action | varchar(80) | No | None | Action |
| description | varchar(500) | Yes | NULL | Human-readable description |
| status | permission_status | No | `ACTIVE` | Permission lifecycle |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 38. Permission DDL

    CREATE TYPE organization.permission_status AS ENUM (
        'ACTIVE',
        'DEPRECATED'
    );

    CREATE TABLE organization.permissions (
        permission_id UUID PRIMARY KEY,
        permission_key VARCHAR(150) NOT NULL,
        resource VARCHAR(80) NOT NULL,
        action VARCHAR(80) NOT NULL,
        description VARCHAR(500) NULL,
        status organization.permission_status
            NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT permissions_key_unique
            UNIQUE (permission_key),
        CONSTRAINT permissions_resource_action_unique
            UNIQUE (resource, action)
    );

# 39. Permission Indexes

Required:

    UNIQUE (permission_key)

    UNIQUE (resource, action)

Recommended:

    INDEX (status)

    INDEX (resource)

# 40. Role-Permission Table

`organization.role_permissions` assigns permissions to roles.

This is a pure relationship table.

# 41. `organization.role_permissions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| role_id | uuid | No | None | Role |
| permission_id | uuid | No | None | Permission |
| created_at | timestamptz | No | `now()` | Assignment time |
| created_by | uuid | Yes | NULL | Assigning actor |

# 42. Role-Permission DDL

    CREATE TABLE organization.role_permissions (
        role_id UUID NOT NULL,
        permission_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        PRIMARY KEY (role_id, permission_id),
        CONSTRAINT role_permissions_role_fk
            FOREIGN KEY (role_id)
            REFERENCES organization.roles(role_id)
            ON DELETE CASCADE,
        CONSTRAINT role_permissions_permission_fk
            FOREIGN KEY (permission_id)
            REFERENCES organization.permissions(permission_id)
            ON DELETE RESTRICT
    );

# 43. Membership-Role Table

`organization.membership_roles` assigns roles to a specific membership.

A User's effective authorization is derived from:

    Membership
        +
    Assigned Roles
        +
    Role Permissions

# 44. `organization.membership_roles` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| membership_id | uuid | No | None | Membership |
| role_id | uuid | No | None | Assigned role |
| created_at | timestamptz | No | `now()` | Assignment time |
| created_by | uuid | Yes | NULL | Assigning actor |

# 45. Membership-Role DDL

    CREATE TABLE organization.membership_roles (
        membership_id UUID NOT NULL,
        role_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        PRIMARY KEY (membership_id, role_id),
        CONSTRAINT membership_roles_membership_fk
            FOREIGN KEY (membership_id)
            REFERENCES organization.memberships(membership_id)
            ON DELETE CASCADE,
        CONSTRAINT membership_roles_role_fk
            FOREIGN KEY (role_id)
            REFERENCES organization.roles(role_id)
            ON DELETE RESTRICT
    );

# 46. Role Assignment Constraint

A custom role may only be assigned within the Organization that owns it.

A system role may be assigned to memberships in any Organization.

Because PostgreSQL cannot express this relationship through a simple FK alone,
application-service validation and, if necessary, a composite-key constraint
or trigger must enforce it.

# 47. Invitation Table

Invitations represent pending requests to join an Organization.

An invitation is not itself a membership.

# 48. Invitation Lifecycle

Recommended:

    CREATED
       |
       v
    SENT
       |
       +----> ACCEPTED
       |
       +----> DECLINED
       |
       +----> EXPIRED
       |
       +----> REVOKED

# 49. `organization.invitations` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| invitation_id | uuid | No | UUIDv7 | Invitation identifier |
| organization_id | uuid | No | None | Target tenant |
| email | citext | No | None | Invitee email |
| invited_user_id | uuid | Yes | NULL | Existing User if known |
| status | invitation_status | No | `CREATED` | Invitation lifecycle |
| token_hash | text | No | None | Invitation token hash |
| token_prefix | varchar(16) | No | None | Non-secret token prefix |
| role_id | uuid | Yes | NULL | Initial role |
| expires_at | timestamptz | No | None | Expiration |
| sent_at | timestamptz | Yes | NULL | Delivery time |
| accepted_at | timestamptz | Yes | NULL | Acceptance time |
| declined_at | timestamptz | Yes | NULL | Decline time |
| revoked_at | timestamptz | Yes | NULL | Revocation time |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Inviting actor |

# 50. Invitation Security

Invitation tokens are bearer credentials.

The raw invitation token must never be persisted.

The database stores only a secure hash.

# 51. Invitation DDL

    CREATE TYPE organization.invitation_status AS ENUM (
        'CREATED',
        'SENT',
        'ACCEPTED',
        'DECLINED',
        'EXPIRED',
        'REVOKED'
    );

    CREATE TABLE organization.invitations (
        invitation_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        email CITEXT NOT NULL,
        invited_user_id UUID NULL,
        status organization.invitation_status
            NOT NULL DEFAULT 'CREATED',
        token_hash TEXT NOT NULL,
        token_prefix VARCHAR(16) NOT NULL,
        role_id UUID NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        sent_at TIMESTAMPTZ NULL,
        accepted_at TIMESTAMPTZ NULL,
        declined_at TIMESTAMPTZ NULL,
        revoked_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        CONSTRAINT invitations_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT invitations_user_fk
            FOREIGN KEY (invited_user_id)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT invitations_role_fk
            FOREIGN KEY (role_id)
            REFERENCES organization.roles(role_id)
            ON DELETE RESTRICT,
        CONSTRAINT invitations_expiry_check
            CHECK (expires_at > created_at),
        CONSTRAINT invitations_accepted_check
            CHECK (
                accepted_at IS NULL
                OR status = 'ACCEPTED'
            ),
        CONSTRAINT invitations_declined_check
            CHECK (
                declined_at IS NULL
                OR status = 'DECLINED'
            ),
        CONSTRAINT invitations_revoked_check
            CHECK (
                revoked_at IS NULL
                OR status = 'REVOKED'
            )
    );

# 52. Invitation Indexes

Required:

    UNIQUE (token_hash)

Recommended:

    INDEX (organization_id, status)

    INDEX (email, status)

    INDEX (invited_user_id)

    INDEX (expires_at)

# 53. Active Invitation Uniqueness

The application should prevent multiple conflicting active invitations for
the same Organization and normalized email.

A partial unique index may be used:

    CREATE UNIQUE INDEX invitations_active_org_email_unique
        ON organization.invitations(organization_id, email)
        WHERE status IN ('CREATED', 'SENT');

# 54. Tenant Settings Table

`organization.tenant_settings` stores Organization-specific configuration.

Settings are tenant-owned.

They must not become a generic unbounded configuration dump.

# 55. `organization.tenant_settings` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| organization_id | uuid | No | None | Tenant |
| timezone | varchar(64) | No | `'UTC'` | Default tenant timezone |
| locale | varchar(16) | No | `'en-US'` | Default locale |
| default_project_visibility | varchar(32) | No | `'PRIVATE'` | Project default |
| default_artifact_retention_days | integer | Yes | NULL | Tenant override |
| default_result_retention_days | integer | Yes | NULL | Tenant override |
| allow_member_invites | boolean | No | `true` | Invitation policy |
| require_approved_domains | boolean | No | `false` | Domain policy |
| approved_email_domains | jsonb | No | `'[]'` | Allowed domains |
| settings | jsonb | No | `'{}'` | Bounded extensible settings |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 56. Tenant Settings Ownership

Exactly one settings row exists for each Organization.

Therefore:

    PRIMARY KEY (organization_id)

The settings row cannot exist without an Organization.

# 57. Tenant Settings DDL

    CREATE TABLE organization.tenant_settings (
        organization_id UUID PRIMARY KEY,
        timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
        locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
        default_project_visibility VARCHAR(32)
            NOT NULL DEFAULT 'PRIVATE',
        default_artifact_retention_days INTEGER NULL,
        default_result_retention_days INTEGER NULL,
        allow_member_invites BOOLEAN NOT NULL DEFAULT TRUE,
        require_approved_domains BOOLEAN NOT NULL DEFAULT FALSE,
        approved_email_domains JSONB NOT NULL DEFAULT '[]'::jsonb,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT tenant_settings_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT tenant_settings_artifact_retention_check
            CHECK (
                default_artifact_retention_days IS NULL
                OR default_artifact_retention_days > 0
            ),
        CONSTRAINT tenant_settings_result_retention_check
            CHECK (
                default_result_retention_days IS NULL
                OR default_result_retention_days > 0
            ),
        CONSTRAINT tenant_settings_domains_array_check
            CHECK (
                jsonb_typeof(approved_email_domains) = 'array'
            ),
        CONSTRAINT tenant_settings_settings_object_check
            CHECK (
                jsonb_typeof(settings) = 'object'
            )
    );

# 58. Tenant Settings Policy

Tenant settings may control tenant defaults.

They must not override global platform safety policies.

They must not disable:

- platform safety controls;
- physical E-stop behavior;
- server-side authorization;
- billing integrity;
- security controls;
- mandatory retention;
- audit requirements.

# 59. Example Organization

    organization_id:
      0194c7d0-8b00-7abc-9def-223456789001

    organization_key:
      kritva-labs

    name:
      Kritva Robotics Lab

    legal_name:
      Kritva Robotics Private Limited

    status:
      ACTIVE

    owner_user_id:
      0194c7d0-8b00-7abc-9def-123456789001

# 60. Example Membership

    membership_id:
      0194c7d0-8b00-7abc-9def-223456789002

    organization_id:
      0194c7d0-8b00-7abc-9def-223456789001

    user_id:
      0194c7d0-8b00-7abc-9def-123456789001

    status:
      ACTIVE

# 61. Example Role

    role_id:
      0194c7d0-8b00-7abc-9def-223456789003

    role_key:
      developer

    name:
      Developer

    role_type:
      SYSTEM

    status:
      ACTIVE

# 62. Example Permission

    permission_id:
      0194c7d0-8b00-7abc-9def-223456789004

    permission_key:
      artifact:write

    resource:
      artifact

    action:
      write

# 63. Example Invitation

    invitation_id:
      0194c7d0-8b00-7abc-9def-223456789005

    organization_id:
      0194c7d0-8b00-7abc-9def-223456789001

    email:
      engineer@example.invalid

    status:
      SENT

    token_prefix:
      krv_inv_91A2

# 64. Example Tenant Settings

    organization_id:
      0194c7d0-8b00-7abc-9def-223456789001

    timezone:
      Asia/Kolkata

    locale:
      en-IN

    default_project_visibility:
      PRIVATE

    allow_member_invites:
      true

# 65. Complete Relationship Diagram

    identity.users
          |
          | 1:N
          v
    organization.memberships
          |
          | N:1
          v
    organization.organizations
          |
          +--------------------+
          |                    |
          v                    v
    tenant_settings       invitations
          |
          |
          +--------------------------+
                                     |
                                     v
                               membership_roles
                                     |
                                     v
                                   roles
                                     |
                                     v
                              role_permissions
                                     |
                                     v
                                permissions

# 66. Organization-to-Domain Relationships

The Organization is the root tenant for:

    organization.organizations
              |
              +--> projects
              +--> artifacts
              +--> bookings
              +--> credit wallets
              +--> jobs
              +--> runs
              +--> results
              +--> experiments
              +--> audit records

The exact foreign keys are owned by those domains.

# 67. Project Relation

Expected relation:

    organization.organizations
          |
          | 1:N
          v
    project.projects

Project records should contain:

    organization_id

Project authorization requires:

    authenticated User
        +
    active Membership
        +
    applicable Permission

# 68. Credit Relation

Expected relation:

    organization.organizations
          |
          v
    credit.wallets

The wallet is tenant-owned.

The Organization schema does not modify the credit ledger.

# 69. Booking Relation

Expected relation:

    organization.organizations
          |
          v
    booking.bookings

Booking authorization is Organization-scoped.

Credit consumption remains owned by the Credit domain.

# 70. Execution Relation

Expected relation:

    organization.organizations
          |
          v
    execution.jobs
          |
          v
    execution.runs

The Organization schema provides authorization context but does not own Job
or Run lifecycle.

# 71. Result Relation

Expected relation:

    organization.organizations
          |
          v
    result.results

Results must not be readable by Users without appropriate Organization
membership and permissions.

# 72. Tenant Query Pattern

A tenant-scoped query should conceptually be:

    SELECT ...
    FROM project.projects
    WHERE organization_id = :authenticated_organization_id
      AND project_id = :project_id;

The `organization_id` must come from trusted authenticated server context.

It must not be trusted solely from a client-supplied payload.

# 73. Authorization Evaluation

Conceptual flow:

    Request
       |
       v
    Authenticate User
       |
       v
    Resolve Organization
       |
       v
    Resolve Membership
       |
       v
    Check Membership ACTIVE
       |
       v
    Resolve Roles
       |
       v
    Resolve Permissions
       |
       v
    Authorize Resource
       |
       v
    Execute Operation

# 74. Membership Creation Flow

    Authorized Admin
          |
    Validate Organization ACTIVE
          |
    Validate User
          |
    Check Existing Membership
          |
    Create Membership
          |
    Assign Initial Role
          |
    Audit
          |
    Event

# 75. Invitation Flow

    Admin
      |
    Validate member:invite
      |
    Validate email
      |
    Create invitation
      |
    Hash token
      |
    Send invitation
      |
    status = SENT
      |
    User accepts
      |
    Create/resolve User
      |
    Create Membership
      |
    Assign Role
      |
    Invitation = ACCEPTED

# 76. Invitation Acceptance

Acceptance must be transactional.

The transaction should:

1. validate token;
2. validate expiration;
3. validate invitation state;
4. resolve or create User;
5. verify email policy;
6. create Membership if absent;
7. assign role;
8. mark invitation accepted.

The operation must be idempotent.

# 77. Role Assignment Flow

    Administrator
          |
    Authorization Check
          |
    Membership Active
          |
    Role Valid
          |
    Organization Compatibility
          |
    Insert membership_roles
          |
    Audit
          |
    Event

# 78. Permission Resolution

Effective permissions are:

    Permissions(User, Organization)
      =
    UNION(
        Permissions(Role1),
        Permissions(Role2),
        ...
    )

There is no implicit permission simply because a User is a member.

# 79. Owner Role

Every active Organization should have at least one Owner-equivalent
authorization path.

The implementation must prevent removal of the final effective owner unless
ownership transfer is completed.

This is an application-level transactional invariant.

# 80. Owner Transfer

Recommended flow:

    Current Owner
        |
    Select New Owner
        |
    Verify New Owner Membership
        |
    Assign Owner
        |
    Remove Previous Owner
        |
    Commit Atomically
        |
    Audit

The system must not create an organization with zero effective owners unless
an explicit system-managed state allows it.

# 81. Organization Suspension

    Organization = SUSPENDED
          |
          +--> New Jobs blocked
          +--> New Bookings blocked
          +--> New Artifacts optionally blocked
          +--> Existing history retained
          +--> Authentication may remain valid
          +--> Tenant operations denied

The exact behavior of authentication during suspension is a policy decision.

# 82. Organization Deactivation

Deactivation is a stronger lifecycle state.

It should block normal tenant operations while preserving:

- membership history;
- credit history;
- booking history;
- job/run history;
- audit evidence.

# 83. Organization Deletion

Organization deletion must not blindly cascade into customer business data.

Recommended workflow:

    Organization DELETED
          |
    Disable Access
          |
    Revoke Active Invitations
          |
    Revoke/Invalidate Tenant Tokens
          |
    Apply Retention Policy
          |
    Delete/Anonymize Eligible Data
          |
    Retain Required Financial/Audit Evidence

# 84. Cascade Policy

Default policy:

| Relationship | Delete Policy |
|---|---|
| Membership → Organization | RESTRICT |
| Membership → User | RESTRICT |
| Role → Organization | RESTRICT |
| Role Permission → Role | CASCADE |
| Membership Role → Membership | CASCADE |
| Invitation → Organization | RESTRICT |
| Invitation → User | SET NULL |
| Tenant Settings → Organization | RESTRICT |

Business history must not disappear through accidental cascade.

# 85. Audit Requirements

Organization operations requiring audit include:

- organization creation;
- organization activation;
- organization suspension;
- organization reactivation;
- organization deactivation;
- organization deletion;
- member invitation;
- invitation acceptance;
- invitation revocation;
- member creation;
- member suspension;
- member removal;
- role assignment;
- role removal;
- role creation;
- role modification;
- permission changes;
- tenant setting changes;
- ownership transfer.

# 86. Event Requirements

Recommended Organization events:

    organization.created
    organization.activated
    organization.suspended
    organization.deactivated
    organization.deleted

    membership.created
    membership.suspended
    membership.removed

    invitation.created
    invitation.sent
    invitation.accepted
    invitation.declined
    invitation.expired
    invitation.revoked

    role.created
    role.updated
    role.archived

    membership.role_assigned
    membership.role_removed

    tenant_settings.updated

Events are notifications/facts, not authorization state.

# 87. Retention

Initial retention policy:

| Data | Retention |
|---|---|
| Organization | Long-term / legal policy |
| Membership | Long-term historical record |
| Roles | Long-term while referenced |
| Permissions | Versioned/global long-term |
| Role permissions | Long-term audit-sensitive |
| Membership roles | Long-term historical evidence where required |
| Invitations | Short-to-medium operational retention |
| Tenant settings | Organization lifecycle |
| Audit | Multi-year / policy |
| Financial references | Long-term / legal |
| Business history | Long-term / policy |

Exact periods are governed by the product retention policy.

# 88. Invitation Retention

Expired, declined, and revoked invitations should be retained for a bounded
period for:

- abuse investigation;
- audit;
- operational troubleshooting.

After retention expiry, token hashes and unnecessary personal data may be
deleted.

# 89. Role Retention

System permissions and roles should not be physically deleted if historical
authorization interpretation requires them.

Prefer:

    ACTIVE
    DEPRECATED
    ARCHIVED

over destructive deletion.

# 90. Tenant Settings Retention

Tenant settings remain with the Organization lifecycle.

When an Organization is deleted, settings may be removed once retention and
audit dependencies have been satisfied.

# 91. Security Model

Organization authorization must implement:

- deny by default;
- explicit membership;
- active membership requirement;
- explicit permission;
- server-controlled tenant context;
- least privilege;
- auditability.

# 92. Tenant Isolation

Tenant isolation is defense in depth:

    API Authentication
          |
    Organization Context
          |
    Membership Authorization
          |
    Permission Authorization
          |
    Repository Tenant Filter
          |
    Database Foreign Keys
          |
    Optional PostgreSQL RLS
          |
    Tests

RLS remains an implementation decision and is not required by this schema
document unless later accepted.

# 93. Cross-Tenant Protection

The system must prevent:

- reading another tenant's Project;
- modifying another tenant's Artifact;
- viewing another tenant's Booking;
- consuming another tenant's Credits;
- starting another tenant's Job;
- reading another tenant's Results.

The Organization ID must be part of the authorization path.

# 94. Repository Interfaces

Recommended Organization repositories:

    OrganizationRepository
    MembershipRepository
    RoleRepository
    PermissionRepository
    RolePermissionRepository
    MembershipRoleRepository
    InvitationRepository
    TenantSettingsRepository

# 95. Organization Repository

Recommended operations:

    create
    get_by_id
    get_by_key
    list_for_user
    update
    activate
    suspend
    deactivate
    mark_deleted

# 96. Membership Repository

Recommended operations:

    create
    get
    get_by_user_and_organization
    list_for_organization
    list_for_user
    suspend
    reactivate
    remove

Every operation must preserve tenant ownership.

# 97. Role Repository

Recommended operations:

    create
    get
    list
    update
    archive
    get_permissions

Custom roles require organization authorization.

# 98. Permission Repository

Recommended operations:

    get_by_key
    list
    list_for_role
    list_effective_permissions

Permission definitions are controlled system data.

# 99. Invitation Repository

Recommended operations:

    create
    get_by_token_hash
    list_for_organization
    revoke
    expire
    accept

Token lookup must use the token hash.

# 100. Tenant Settings Repository

Recommended operations:

    get
    create_defaults
    update
    reset_to_defaults

Tenant settings access always requires Organization authorization.

# 101. Application Services

Recommended services:

    OrganizationService
    MembershipService
    RoleService
    PermissionService
    InvitationService
    TenantSettingsService
    AuthorizationService

Application services define:

- authorization;
- transaction boundaries;
- validation;
- lifecycle transitions;
- cross-domain orchestration.

# 102. Transaction Boundaries

The following operations should be transactional:

- organization creation;
- membership creation;
- owner assignment;
- invitation acceptance;
- role assignment;
- owner transfer;
- organization suspension;
- organization deletion initiation.

# 103. Idempotency

Idempotency is required for externally retried side-effecting operations:

- organization creation where an idempotency key is supported;
- invitation creation;
- invitation acceptance;
- membership creation;
- role assignment;
- ownership transfer;
- tenant-setting mutation where retries may produce ambiguity.

# 104. Organization Creation Flow

    User
      |
    Authenticate
      |
    Create Organization
      |
    Create Tenant Settings
      |
    Create Owner Membership
      |
    Assign Owner Role
      |
    Commit
      |
    Publish organization.created

All required records should be created atomically.

# 105. Default Tenant Provisioning

A new Organization should receive:

- default tenant settings;
- required system roles available to it;
- owner membership;
- owner role assignment.

System roles need not be copied into every tenant if the implementation uses
global role definitions.

# 106. Role Initialization

Recommended initial global roles:

    owner
    admin
    developer
    operator
    researcher
    viewer

Each receives a version-controlled permission set.

# 107. Example Permission Catalogue

| Permission | Meaning |
|---|---|
| organization:read | Read tenant details |
| organization:update | Modify tenant settings |
| member:read | List members |
| member:invite | Invite members |
| member:update | Modify membership |
| member:remove | Remove members |
| role:read | Read roles |
| role:manage | Manage custom roles |
| project:read | Read projects |
| project:write | Modify projects |
| artifact:read | Read artifacts |
| artifact:write | Manage artifacts |
| booking:read | Read bookings |
| booking:write | Manage bookings |
| job:read | Read jobs |
| job:execute | Execute jobs |
| result:read | Read results |
| billing:read | Read billing |
| billing:manage | Manage billing |

# 108. Phase 0 Mapping

Phase 0 establishes:

- Organization schema ownership;
- UUIDv7 identifiers;
- migration framework;
- logical schema;
- tenancy principles;
- repository/application-service boundaries.

Relevant database tasks:

    DB01-001
    DB01-002
    DB01-003
    DB01-004
    DB01-006

# 109. Phase 1 Mapping

Phase 1 implements:

- organizations;
- memberships;
- roles;
- permissions;
- role relationships;
- invitations;
- tenant settings;
- Identity integration;
- tenant isolation.

# 110. Phase 2 Mapping

Phase 2 uses Organizations for:

- Project ownership;
- Platform access;
- Artifact ownership;
- local Studio organization context.

Every tenant-owned resource must resolve to an Organization.

# 111. Phase 3 Mapping

Phase 3 uses Organization authorization for:

- Job creation;
- Run access;
- execution control;
- resource authorization;
- reconciliation visibility.

# 112. Phase 4 Mapping

Phase 4 uses Organizations for:

- Credit wallet ownership;
- Booking ownership;
- billing authorization;
- platform-specific credit access.

# 113. Phase 5 Mapping

Phase 5 uses Organization context for:

- artifact upload;
- remote execution;
- job control;
- result access;
- Lab interaction authorization.

The Lab Agent receives only the minimum required tenant context.

# 114. Phase 6 Mapping

Phase 6 uses Organizations for:

- Lab administration;
- robot/resource operations;
- operational access;
- organization-scoped monitoring.

# 115. Phase 7 Mapping

Phase 7 uses Organizations for:

- experiments;
- results;
- event authorization;
- analytics;
- audit.

# 116. Phase 8 Mapping

Phase 8 completes:

- tenant export;
- tenant deletion;
- retention;
- privacy;
- authorization hardening;
- performance;
- backup/restore;
- disaster recovery;
- production security.

# 117. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cross-tenant data leakage | Critical | Explicit organization_id + authz |
| Owner lockout | Critical | Owner-transfer transaction |
| Privilege escalation | Critical | Server-side role/permission checks |
| Stale membership | High | Explicit membership lifecycle |
| Invitation abuse | High | Token hashing + expiry + rate limits |
| Role drift | High | Version-controlled system permissions |
| Accidental cascade | High | RESTRICT business relationships |
| Tenant deletion errors | High | Controlled deletion workflow |
| Custom-role complexity | Medium | Bounded role model |
| Settings misuse | Medium | Typed settings + policy enforcement |
| Orphaned memberships | High | FK constraints |
| Provider/user mismatch | High | Identity-domain validation |
| Admin misuse | High | Audit + least privilege |
| Token replay | High | Hashing + expiry + revocation |
| Missing tenant filter | Critical | Repository tests + tenant-aware indexes |

# 118. Performance Considerations

Primary tenant query patterns should use:

    organization_id

Important composite indexes should begin with tenant identity where queries
are tenant-scoped.

Examples:

    (organization_id, status)
    (organization_id, created_at)
    (organization_id, user_id)

Do not create indexes without a query pattern or measured requirement.

# 119. Concurrency Considerations

Concurrent operations must protect:

- final owner removal;
- invitation acceptance;
- duplicate membership creation;
- role assignment;
- organization lifecycle transitions.

Use:

- unique constraints;
- row locking;
- transactions;
- optimistic concurrency where appropriate.

# 120. Migration Strategy

Schema changes follow:

    Development
        |
    CI validation
        |
    Staging
        |
    Production

Production migrations must follow the expand-and-contract strategy for
incompatible changes.

Released migrations are immutable.

# 121. Example Tenant-Scoped SQL

    SELECT
        m.membership_id,
        m.user_id,
        m.status
    FROM organization.memberships AS m
    WHERE m.organization_id = :organization_id
      AND m.status = 'ACTIVE';

The `organization_id` must originate from trusted server authorization context.

# 122. Example Permission Resolution SQL

    SELECT DISTINCT p.permission_key
    FROM organization.memberships AS m
    JOIN organization.membership_roles AS mr
      ON mr.membership_id = m.membership_id
    JOIN organization.roles AS r
      ON r.role_id = mr.role_id
    JOIN organization.role_permissions AS rp
      ON rp.role_id = r.role_id
    JOIN organization.permissions AS p
      ON p.permission_id = rp.permission_id
    WHERE m.organization_id = :organization_id
      AND m.user_id = :user_id
      AND m.status = 'ACTIVE'
      AND r.status = 'ACTIVE'
      AND p.status = 'ACTIVE';

# 123. Data Ownership Matrix

| Data | Owner |
|---|---|
| Organization | Organization |
| Membership | Organization |
| Role | Organization |
| Permission | Organization |
| Role-Permission | Organization |
| Membership-Role | Organization |
| Invitation | Organization |
| Tenant Settings | Organization |
| User | Identity |
| Credential | Identity |
| Session | Identity |
| API Token | Identity |
| Project | Project |
| Artifact | Artifact |
| Booking | Booking |
| Credit Wallet | Credit |
| Job | Execution |
| Run | Execution |
| Result | Result |
| Audit | Audit |

# 124. Privacy and Data Minimization

The Organization schema should store only data required for:

- tenant identification;
- authorization;
- organization configuration;
- membership;
- invitation;
- operational management.

Personal information should remain in the Identity domain where possible.

# 125. Final Invariants

The following must always remain true:

1. Every Organization has one immutable `organization_id`.
2. Organization identifiers use UUIDv7 semantics.
3. Organization is the primary tenant boundary.
4. User identity is separate from tenancy.
5. A User may belong to multiple Organizations.
6. A membership belongs to exactly one Organization and one User.
7. An Organization/User membership is unique.
8. Only active memberships authorize tenant operations.
9. Roles contain permissions.
10. Memberships receive roles.
11. Permissions are stable global definitions.
12. Custom roles belong to exactly one Organization.
13. System roles are not tenant-owned.
14. Invitations do not equal memberships.
15. Invitation tokens are never stored in plaintext.
16. Tenant settings belong to exactly one Organization.
17. Business history is not accidentally cascade-deleted.
18. Organization deletion is a controlled lifecycle operation.
19. Tenant authorization is server-controlled.
20. Client-supplied organization IDs cannot override authenticated tenant context.
21. Financial records remain owned by the Credit domain.
22. Project records remain owned by the Project domain.
23. Job/Run records remain owned by Execution.
24. Result records remain owned by Result.
25. Audit records remain owned by Audit.
26. Cross-domain writes use application services.
27. Critical mutations are transactional and idempotent.
28. Authorization changes are auditable.
29. Tenant isolation is tested continuously.
30. PostgreSQL remains authoritative for organization state.

# 126. Acceptance Criteria — Organization Schema

- [ ] `organization` PostgreSQL schema exists.
- [ ] `organizations` table exists.
- [ ] `memberships` table exists.
- [ ] `roles` table exists.
- [ ] `permissions` table exists.
- [ ] `role_permissions` table exists.
- [ ] `membership_roles` table exists.
- [ ] `invitations` table exists.
- [ ] `tenant_settings` table exists.
- [ ] UUID primary keys are used.
- [ ] UUIDv7 generation is standardized.
- [ ] Required enums are defined.
- [ ] All foreign keys are validated.
- [ ] All required unique constraints are validated.
- [ ] All required indexes are validated.
- [ ] All lifecycle checks are validated.

# 127. Acceptance Criteria — Tenancy

- [ ] Organization is the primary tenant boundary.
- [ ] User is not treated as a tenant.
- [ ] Membership establishes tenant participation.
- [ ] Tenant-owned tables contain organization_id where practical.
- [ ] Cross-tenant access tests exist.
- [ ] Server-controlled tenant context is enforced.
- [ ] Client-supplied tenant context cannot bypass authorization.
- [ ] Repository queries are tenant-aware.

# 128. Acceptance Criteria — Membership

- [ ] User/Organization uniqueness is enforced.
- [ ] Membership lifecycle is implemented.
- [ ] Active membership is required for normal authorization.
- [ ] Membership suspension is supported.
- [ ] Membership removal is supported.
- [ ] Membership changes are audited.
- [ ] Membership role assignments are transactional.
- [ ] Removed memberships cannot authorize new operations.

# 129. Acceptance Criteria — Roles

- [ ] System roles are supported.
- [ ] Custom roles are supported or explicitly disabled by product decision.
- [ ] System role ownership is global.
- [ ] Custom role ownership is tenant-specific.
- [ ] Role keys are unique within their applicable scope.
- [ ] Role lifecycle is supported.
- [ ] Role assignments are auditable.
- [ ] Permission sets are deterministic.
- [ ] Role drift is controlled.

# 130. Acceptance Criteria — Permissions

- [ ] Permission keys are globally unique.
- [ ] Resource/action pairs are unique.
- [ ] Permission lifecycle is supported.
- [ ] Permission definitions are version controlled.
- [ ] Deprecated permissions cannot be newly assigned where prohibited.
- [ ] Permission resolution is tested.
- [ ] Effective permissions are derived from active memberships and roles.

# 131. Acceptance Criteria — Invitations

- [ ] Invitation belongs to exactly one Organization.
- [ ] Invitation lifecycle is implemented.
- [ ] Invitation token is stored only as a hash.
- [ ] Invitation expires.
- [ ] Invitation can be revoked.
- [ ] Invitation acceptance is transactional.
- [ ] Duplicate active invitations are prevented.
- [ ] Invitation acceptance is idempotent.
- [ ] Invitation role assignment is validated.
- [ ] Invitation events are emitted.
- [ ] Invitation operations are audited.

# 132. Acceptance Criteria — Tenant Settings

- [ ] Exactly one settings row can exist per Organization.
- [ ] Default settings are provisioned.
- [ ] Tenant settings are organization-owned.
- [ ] Settings are bounded and documented.
- [ ] JSONB settings contain objects.
- [ ] Approved email domains contain arrays.
- [ ] Retention values are positive where supplied.
- [ ] Security-critical global policies cannot be disabled by tenant settings.
- [ ] Settings updates are audited.

# 133. Acceptance Criteria — Organization Lifecycle

- [ ] Organization creation is transactional.
- [ ] Owner membership is created during provisioning.
- [ ] Owner role is assigned during provisioning.
- [ ] Default tenant settings are created.
- [ ] Organization activation is controlled.
- [ ] Suspension is supported.
- [ ] Deactivation is supported.
- [ ] Deletion is controlled.
- [ ] Final owner protection is implemented.
- [ ] Lifecycle changes are audited.
- [ ] Lifecycle events are emitted.

# 134. Acceptance Criteria — Security

- [ ] Invitation raw tokens are never persisted.
- [ ] Tenant authorization is deny-by-default.
- [ ] Membership is checked before permissions.
- [ ] Organization context is server controlled.
- [ ] Role assignment cannot cross tenant boundaries.
- [ ] Custom roles cannot escape their Organization.
- [ ] Administrative operations are audited.
- [ ] Security-sensitive data is restricted.
- [ ] Authentication secrets remain in Identity, not Organization.

# 135. Acceptance Criteria — Data Integrity

- [ ] No orphaned memberships.
- [ ] No orphaned role assignments.
- [ ] No orphaned invitation organization references.
- [ ] No tenant settings without an Organization.
- [ ] No custom role without an Organization.
- [ ] No system role with an Organization.
- [ ] No duplicate active Organization/User membership.
- [ ] No duplicate provider-independent role key within scope.
- [ ] No duplicate permission key.
- [ ] Foreign-key integrity tests pass.

# 136. Acceptance Criteria — Integration

- [ ] Identity User integrates with Membership.
- [ ] Membership integrates with Project authorization.
- [ ] Organization integrates with Credit.
- [ ] Organization integrates with Booking.
- [ ] Organization integrates with Execution.
- [ ] Organization integrates with Results.
- [ ] Organization integrates with Audit.
- [ ] Organization integrates with Events.
- [ ] Organization integrates with Lab administration.
- [ ] Organization integrates with Studio session context.

# 137. Acceptance Criteria — Operations

- [ ] Empty-database migration succeeds.
- [ ] CI validates schema migrations.
- [ ] Seed data is deterministic.
- [ ] Default roles and permissions are deterministic.
- [ ] Tenant provisioning is repeatable.
- [ ] Backup includes Organization schema.
- [ ] Restore includes Organization schema.
- [ ] Migration rollback/forward-fix policy is documented.
- [ ] Schema drift detection exists.
- [ ] Production database observability covers Organization queries.

# 138. Acceptance Criteria — Privacy

- [ ] Organization export behavior is documented.
- [ ] Organization deletion behavior is documented.
- [ ] User deletion does not accidentally delete shared tenant history.
- [ ] Invitation personal data has bounded retention.
- [ ] Membership history retention is documented.
- [ ] Legal holds can prevent deletion.
- [ ] Financial and audit retention rules override ordinary deletion where
  required.

# 139. Acceptance Criteria — Performance

- [ ] Organization lookup by key is indexed.
- [ ] Membership lookup by Organization is indexed.
- [ ] Membership lookup by User is indexed.
- [ ] Role lookup by Organization is indexed.
- [ ] Invitation lookup by token hash is indexed.
- [ ] Invitation lookup by Organization/status is indexed.
- [ ] Tenant settings use Organization primary key.
- [ ] Permission resolution has an acceptable query plan.
- [ ] Tenant isolation indexes are measured under representative workloads.

# 140. Acceptance Criteria — Phase Gate

Phase 0:

- [ ] Logical schema ownership accepted.
- [ ] UUIDv7 strategy accepted.
- [ ] Migration strategy accepted.
- [ ] Tenant model accepted.

Phase 1:

- [ ] Organization schema implemented.
- [ ] Identity integration implemented.
- [ ] Membership implemented.
- [ ] Authorization model implemented.
- [ ] Invitations implemented.
- [ ] Tenant settings implemented.
- [ ] Tenant isolation tests pass.

Phase 2:

- [ ] Project integration passes.
- [ ] Artifact ownership passes.
- [ ] Platform authorization passes.

Phase 3:

- [ ] Job authorization passes.
- [ ] Run access isolation passes.
- [ ] Execution control is tenant-safe.

Phase 4:

- [ ] Credit and Booking tenant ownership passes.
- [ ] Financial operations cannot cross tenants.

Phase 5:

- [ ] Remote execution authorization passes.
- [ ] Result access is tenant-safe.

Phase 6:

- [ ] Lab administrative authorization passes.
- [ ] Resource operations are tenant-safe.

Phase 7:

- [ ] Experiment/result/event/audit integration passes.

Phase 8:

- [ ] Privacy deletion/export passes.
- [ ] Retention automation passes.
- [ ] Backup/restore passes.
- [ ] Production authorization tests pass.
- [ ] Security review passes.

# 141. Final Architecture Statement

> **Kritva RaaS uses Organization as the primary tenant boundary. Identity
> answers "who is the user"; Membership answers "which organizations does
> the user belong to"; Roles and Permissions answer "what may that user do
> within the organization." This separation is fundamental to tenant
> isolation and must remain intact across every RaaS domain.**
>
> **Organizations own tenant configuration and the authorization relationship
> to customer data, while Project, Artifact, Booking, Credit, Execution,
> Result, Lab and Audit domains remain responsible for their own authoritative
> data. Cross-domain writes are coordinated through application services, not
> direct table manipulation.**
>
> **The resulting schema provides a durable foundation for multi-tenant RaaS,
> enterprise administration, role-based access control, invitations,
> organization-specific settings, tenant isolation, auditability and future
> enterprise identity integrations without prematurely coupling the
> organization model to any specific authentication provider or cloud
> implementation.**
