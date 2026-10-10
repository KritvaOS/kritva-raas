# Kritva RaaS Users Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Users Schema |
| Path | `docs/database/schema/USERS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `identity` |
| Primary Domain Owner | Identity Module |
| Primary Tenant Owner | Organization Module |
| Identifier Strategy | UUIDv7 |
| Data Classification | Confidential / Restricted |
| Phase Coverage | Phase 0–Phase 8 |
| Primary Tables | users, user_profiles, identity_providers, user_identities, user_credentials, user_sessions, api_tokens |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for user identity
and authentication data in Kritva RaaS.

The schema establishes the authoritative persistence model for:

- users;
- user profiles;
- external identity providers;
- provider-linked identities;
- local credential metadata;
- sessions;
- API tokens.

The schema is intentionally separated from organization membership.

A User represents an identity.

An Organization Membership represents authorization to operate within an
organization.

# 3. Scope

This document defines:

- tables;
- columns;
- PostgreSQL types;
- nullability;
- defaults;
- primary keys;
- foreign keys;
- unique constraints;
- indexes;
- check constraints;
- enumerations;
- lifecycle states;
- retention;
- ownership;
- audit fields;
- security rules;
- example rows;
- SQL DDL;
- application interfaces;
- relationships;
- migration requirements;
- Phase 0–Phase 8 mapping;
- risks;
- open questions;
- acceptance criteria.

# 4. Non-Goals

This document does not define:

- organization membership schema;
- role assignment schema;
- complete authorization policy;
- payment identity;
- billing contacts;
- customer source code;
- robot identity;
- project ownership;
- final external identity-provider selection;
- complete privacy/legal policy.

Organization membership is defined by the Organization domain.

# 5. Design Principles

The Users schema follows these principles:

1. User identity is separate from organization membership.
2. User identifiers are UUIDv7.
3. PostgreSQL stores identity metadata, not authentication secrets unless
   explicitly required.
4. External identity providers are preferred for authentication.
5. Passwords are never stored in plaintext.
6. Password-equivalent secrets are never stored directly.
7. Session tokens are stored only as hashes.
8. API tokens are stored only as hashes.
9. Token plaintext is shown only at creation time.
10. User profile data is separated from core identity state.
11. Authentication state is auditable.
12. Tenant ownership is not stored directly on User.
13. User-to-Organization relationships belong to Membership.
14. Deactivation is different from deletion.
15. Security-sensitive records have controlled retention.
16. Database access follows Identity domain ownership.
17. Direct cross-domain writes are prohibited.

# 6. Logical Schema

The PostgreSQL schema is:

    identity
        |
        +-- users
        |
        +-- user_profiles
        |
        +-- identity_providers
        |
        +-- user_identities
        |
        +-- user_credentials
        |
        +-- user_sessions
        |
        +-- api_tokens

Organization membership is outside this schema:

    identity.users
          |
          v
    organization.memberships
          |
          v
    organization.organizations

# 7. User Identity Model

The identity model is:

    User
      |
      +-- Profile
      |
      +-- External Identity
      |
      +-- Credential
      |
      +-- Session
      |
      +-- API Token

A single User may have:

- multiple provider identities;
- zero or one local credential record;
- multiple active/revoked sessions;
- multiple API tokens;
- exactly one profile.

# 8. User Versus Organization

The following distinction is mandatory:

    User
      |
      | "Who is this person?"
      |
      v
    Identity

    Membership
      |
      | "What can this person do in this organization?"
      |
      v
    Organization Authorization

A User does not become an organization tenant merely because the User exists.

# 9. Data Classification

| Table | Classification | Reason |
|---|---|---|
| users | Confidential | Identity/account data |
| user_profiles | Confidential | Personal profile data |
| identity_providers | Internal | Provider configuration |
| user_identities | Restricted | External identity linkage |
| user_credentials | Restricted | Authentication metadata |
| user_sessions | Restricted | Authentication/session security |
| api_tokens | Restricted | API access security |

# 10. Tenant Ownership

Users are global identity records.

Therefore:

    users.organization_id
        = NOT APPLICABLE

Organization ownership is represented through:

    organization.memberships.organization_id
    organization.memberships.user_id

A User may belong to:

- zero organizations;
- one organization;
- multiple organizations.

# 11. Ownership Rules

The Identity Module owns:

- User lifecycle;
- Profile lifecycle;
- Provider identity lifecycle;
- Credential lifecycle;
- Session lifecycle;
- API token lifecycle.

The Organization Module owns:

- Membership;
- Organization membership state;
- Organization role assignment.

# 12. User Lifecycle

Recommended User states:

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

Not every transition is reversible.

# 13. User State Definitions

| State | Meaning |
|---|---|
| PENDING | Identity created but activation incomplete |
| ACTIVE | User may authenticate and operate if authorized |
| SUSPENDED | Temporarily blocked from authentication |
| DEACTIVATED | Account intentionally disabled |
| DELETED | Identity lifecycle closed and personal data minimized/deleted |

The exact legal deletion implementation may use anonymization while retaining
required security or audit evidence.

# 14. Profile Lifecycle

Profile does not have an independent lifecycle state.

It follows the User lifecycle.

Deletion may:

- remove profile data;
- anonymize retained attributes;
- preserve minimal references required by legal/security retention.

# 15. Session Lifecycle

Recommended session states:

    ACTIVE
      |
      +--> REVOKED
      |
      +--> EXPIRED

A session must never return to ACTIVE after REVOKED.

# 16. API Token Lifecycle

Recommended API token states:

    ACTIVE
      |
      +--> REVOKED
      |
      +--> EXPIRED

Tokens may also be disabled indirectly when the owning User is suspended or
deactivated.

# 17. Identity Provider Model

External authentication is represented by:

    identity_providers
          |
          v
    user_identities
          |
          v
        users

One provider may authenticate many users.

One User may have identities from multiple providers.

# 18. Supported Provider Concept

The database must not hard-code a single provider.

Provider examples may include:

- enterprise OIDC;
- OAuth provider;
- SAML provider;
- internal identity provider.

The exact production provider remains an open implementation decision.

# 19. Provider Configuration Security

Provider configuration may include:

- issuer;
- client ID;
- discovery metadata;
- provider status.

Client secrets must not be stored as ordinary plaintext database columns.

Secrets belong in the managed secret store.

# 20. Local Credentials

Local credentials are optional.

The preferred production architecture is external identity-provider
authentication.

If local credentials are enabled, only a strong password hash may be stored.

Never store:

- plaintext password;
- reversible password encryption;
- password reset plaintext token;
- authentication secret in logs.

# 21. API Token Security

API tokens are bearer credentials.

The database stores:

- token ID;
- token hash;
- token prefix;
- metadata;
- creation time;
- expiration;
- revocation state.

The raw token is never stored.

# 22. Session Security

Session records should contain:

- session identifier;
- user;
- token hash;
- creation time;
- expiration;
- last activity;
- revocation;
- client metadata.

Raw session tokens must never be persisted.

# 23. Audit Columns

Identity tables use common audit fields where applicable:

- `created_at`;
- `updated_at`;
- `created_by`;
- `updated_by`.

Security token tables additionally track:

- `revoked_at`;
- `revoked_by`;
- `last_used_at`.

System-generated records may have null `created_by` or `updated_by` where no
user actor exists.

# 24. Timestamp Standard

All timestamps use:

    TIMESTAMPTZ

All timestamps represent UTC instants.

Application APIs serialize timestamps using RFC3339-compatible UTC values.

# 25. Identifier Standard

All primary keys use:

    UUID

The application generates UUIDv7 identifiers.

The database stores them using PostgreSQL's native `uuid` type.

# 26. Common Status Enumerations

Conceptual PostgreSQL enums:

    user_status
    session_status
    api_token_status
    credential_status
    identity_provider_status

Enum values should be changed carefully because PostgreSQL enum migrations
can create deployment compatibility concerns.

# 27. User Table

The `identity.users` table is the authoritative identity record.

It must contain:

- immutable user ID;
- account status;
- primary email;
- email verification state;
- lifecycle timestamps;
- audit metadata.

# 28. `identity.users` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| user_id | uuid | No | uuidv7 application value | Primary identifier |
| email | citext | No | None | Canonical primary email |
| email_verified_at | timestamptz | Yes | NULL | Verification time |
| status | user_status | No | `PENDING` | User lifecycle |
| last_authenticated_at | timestamptz | Yes | NULL | Last successful auth |
| deactivated_at | timestamptz | Yes | NULL | Deactivation time |
| deleted_at | timestamptz | Yes | NULL | Deletion/anonymization marker |
| created_at | timestamptz | No | `now()` | Creation time |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

`deleted_at` is not a universal soft-delete mechanism.

It is retained here as a lifecycle/privacy control because identity deletion
and anonymization may require asynchronous processing and evidence.

# 29. User Email Policy

`email` is the canonical application-level login/contact identifier.

Email comparison should be case-insensitive.

The database uses `citext` or an equivalent normalized representation.

The final implementation must standardize:

- Unicode normalization;
- whitespace handling;
- case handling;
- provider-specific email semantics.

# 30. User Constraints

Required constraints include:

- primary key on `user_id`;
- unique email;
- valid status;
- lifecycle timestamp consistency.

Conceptual checks:

    deleted_at IS NULL OR status = 'DELETED'

    deactivated_at IS NULL
        OR status IN ('DEACTIVATED', 'DELETED')

# 31. User Indexes

Required indexes:

    PRIMARY KEY (user_id)

    UNIQUE (email)

Additional operational indexes:

    INDEX (status)

    INDEX (created_at)

    INDEX (deleted_at)

A partial active-user index may be introduced if measured workload justifies
it.

# 32. User DDL

    CREATE TYPE identity.user_status AS ENUM (
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED'
    );

    CREATE TABLE identity.users (
        user_id UUID PRIMARY KEY,
        email CITEXT NOT NULL,
        email_verified_at TIMESTAMPTZ NULL,
        status identity.user_status NOT NULL DEFAULT 'PENDING',
        last_authenticated_at TIMESTAMPTZ NULL,
        deactivated_at TIMESTAMPTZ NULL,
        deleted_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT users_email_unique
            UNIQUE (email),
        CONSTRAINT users_deleted_status_check
            CHECK (
                deleted_at IS NULL
                OR status = 'DELETED'
            ),
        CONSTRAINT users_deactivated_status_check
            CHECK (
                deactivated_at IS NULL
                OR status IN ('DEACTIVATED', 'DELETED')
            )
    );

# 33. User Profile Table

`identity.user_profiles` stores optional personal profile attributes.

The profile is separated from `users` so that:

- identity state remains small;
- profile privacy can be managed separately;
- personal data minimization is easier;
- authentication queries do not require profile data.

# 34. `identity.user_profiles` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| user_id | uuid | No | None | User primary/foreign key |
| display_name | varchar(200) | Yes | NULL | Preferred display name |
| first_name | varchar(100) | Yes | NULL | First name |
| last_name | varchar(100) | Yes | NULL | Last name |
| avatar_object_key | text | Yes | NULL | Object storage reference |
| timezone | varchar(64) | Yes | NULL | User timezone |
| locale | varchar(16) | Yes | NULL | Preferred locale |
| metadata | jsonb | No | `'{}'` | Extensible profile metadata |
| created_at | timestamptz | No | `now()` | Creation time |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 35. Profile Constraints

The profile uses:

    PRIMARY KEY (user_id)

and:

    FOREIGN KEY (user_id)
        REFERENCES identity.users(user_id)

No profile may exist without a User.

# 36. Profile Metadata

`metadata` is JSONB but must remain bounded.

It must not contain:

- passwords;
- authentication tokens;
- payment credentials;
- security secrets;
- arbitrary unbounded logs.

Frequently queried business attributes should become relational columns.

# 37. Profile DDL

    CREATE TABLE identity.user_profiles (
        user_id UUID PRIMARY KEY,
        display_name VARCHAR(200) NULL,
        first_name VARCHAR(100) NULL,
        last_name VARCHAR(100) NULL,
        avatar_object_key TEXT NULL,
        timezone VARCHAR(64) NULL,
        locale VARCHAR(16) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT user_profiles_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_profiles_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 38. Profile Indexes

Initial indexes:

    PRIMARY KEY (user_id)

Optional indexes:

    INDEX (locale)

    INDEX (timezone)

Do not index arbitrary JSONB keys until workload evidence exists.

# 39. Identity Provider Table

`identity.identity_providers` defines trusted authentication providers.

This table represents provider configuration, not a user's provider identity.

# 40. `identity.identity_providers` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| provider_id | uuid | No | UUIDv7 | Provider ID |
| provider_key | varchar(100) | No | None | Stable provider identifier |
| provider_type | varchar(32) | No | None | OIDC/OAuth/SAML/etc. |
| display_name | varchar(200) | No | None | Human-readable name |
| issuer | text | Yes | NULL | OIDC issuer |
| client_id | text | Yes | NULL | Public client identifier |
| status | identity_provider_status | No | `ACTIVE` | Provider lifecycle |
| metadata | jsonb | No | `'{}'` | Non-secret provider metadata |
| created_at | timestamptz | No | `now()` | Creation time |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 41. Provider Constraints

`provider_key` must be globally unique.

`issuer` should be unique where present.

Provider secrets are not stored in this table.

# 42. Provider DDL

    CREATE TYPE identity.identity_provider_status AS ENUM (
        'ACTIVE',
        'DISABLED',
        'DEPRECATED'
    );

    CREATE TABLE identity.identity_providers (
        provider_id UUID PRIMARY KEY,
        provider_key VARCHAR(100) NOT NULL,
        provider_type VARCHAR(32) NOT NULL,
        display_name VARCHAR(200) NOT NULL,
        issuer TEXT NULL,
        client_id TEXT NULL,
        status identity.identity_provider_status
            NOT NULL DEFAULT 'ACTIVE',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT identity_providers_key_unique
            UNIQUE (provider_key),
        CONSTRAINT identity_providers_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 43. Provider Indexes

Required:

    UNIQUE (provider_key)

Recommended:

    INDEX (status)

    UNIQUE (issuer)
        WHERE issuer IS NOT NULL

# 44. User Identity Table

`identity.user_identities` links a User to an external identity provider.

Examples:

    User A
       |
       +-- Google identity
       |
       +-- Enterprise OIDC identity

The provider's subject identifier is the authoritative external linkage key.

# 45. `identity.user_identities` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| user_identity_id | uuid | No | UUIDv7 | Link identifier |
| user_id | uuid | No | None | User |
| provider_id | uuid | No | None | Provider |
| subject | varchar(512) | No | None | Provider subject |
| provider_email | citext | Yes | NULL | Provider-reported email |
| email_verified_at | timestamptz | Yes | NULL | Provider verification |
| claims | jsonb | No | `'{}'` | Non-sensitive normalized claims |
| last_authenticated_at | timestamptz | Yes | NULL | Last authentication |
| created_at | timestamptz | No | `now()` | Link creation |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 46. Provider Identity Constraints

The critical uniqueness rule is:

    UNIQUE (
        provider_id,
        subject
    )

This prevents one external identity from mapping to multiple users.

# 47. User Identity DDL

    CREATE TABLE identity.user_identities (
        user_identity_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        provider_id UUID NOT NULL,
        subject VARCHAR(512) NOT NULL,
        provider_email CITEXT NULL,
        email_verified_at TIMESTAMPTZ NULL,
        claims JSONB NOT NULL DEFAULT '{}'::jsonb,
        last_authenticated_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT user_identities_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_identities_provider_fk
            FOREIGN KEY (provider_id)
            REFERENCES identity.identity_providers(provider_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_identities_provider_subject_unique
            UNIQUE (provider_id, subject),
        CONSTRAINT user_identities_claims_object_check
            CHECK (jsonb_typeof(claims) = 'object')
    );

# 48. User Identity Indexes

Required:

    UNIQUE (provider_id, subject)

    INDEX (user_id)

    INDEX (provider_id)

# 49. Claims Storage

Provider claims should be minimized.

Claims should not become a general-purpose copy of every identity-provider
response.

Store only claims required for:

- identity mapping;
- display;
- authorization;
- audit;
- provider lifecycle.

# 50. Credentials Table

`identity.user_credentials` represents local credential metadata.

This table is optional when external identity providers are exclusively used.

# 51. `identity.user_credentials` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| credential_id | uuid | No | UUIDv7 | Credential record |
| user_id | uuid | No | None | User |
| credential_type | varchar(32) | No | None | Password or future type |
| secret_hash | text | No | None | Password hash |
| status | credential_status | No | `ACTIVE` | Credential lifecycle |
| password_changed_at | timestamptz | Yes | NULL | Password change time |
| last_used_at | timestamptz | Yes | NULL | Last successful use |
| failed_attempts | integer | No | `0` | Failed authentication count |
| locked_until | timestamptz | Yes | NULL | Temporary lock |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 52. Credential Constraints

Initial supported credential type:

    PASSWORD

The stored `secret_hash` must be generated using a password hashing scheme
approved by Security.

Never store a plaintext password.

# 53. Credential DDL

    CREATE TYPE identity.credential_status AS ENUM (
        'ACTIVE',
        'DISABLED',
        'REVOKED'
    );

    CREATE TABLE identity.user_credentials (
        credential_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        credential_type VARCHAR(32) NOT NULL DEFAULT 'PASSWORD',
        secret_hash TEXT NOT NULL,
        status identity.credential_status NOT NULL DEFAULT 'ACTIVE',
        password_changed_at TIMESTAMPTZ NULL,
        last_used_at TIMESTAMPTZ NULL,
        failed_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT user_credentials_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_credentials_type_check
            CHECK (credential_type = 'PASSWORD'),
        CONSTRAINT user_credentials_failed_attempts_check
            CHECK (failed_attempts >= 0)
    );

    CREATE UNIQUE INDEX user_credentials_one_password_idx
        ON identity.user_credentials(user_id)
        WHERE credential_type = 'PASSWORD';

# 54. Credential Security

The database must never expose credential hashes through ordinary User APIs.

Only the authentication subsystem may access `secret_hash`.

Credential access must be:

- restricted;
- audited;
- excluded from normal logging;
- excluded from tracing payloads.

# 55. Session Table

`identity.user_sessions` represents authenticated sessions.

A session is not a User.

A session is an authentication context associated with a User.

# 56. `identity.user_sessions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| session_id | uuid | No | UUIDv7 | Session ID |
| user_id | uuid | No | None | User |
| token_hash | text | No | None | Hash of session token |
| status | session_status | No | `ACTIVE` | Session lifecycle |
| issued_at | timestamptz | No | `now()` | Issue time |
| expires_at | timestamptz | No | None | Expiration |
| last_seen_at | timestamptz | Yes | NULL | Last activity |
| revoked_at | timestamptz | Yes | NULL | Revocation time |
| revoked_by | uuid | Yes | NULL | Revoking actor |
| ip_address | inet | Yes | NULL | Last/issued network address |
| user_agent | text | Yes | NULL | Client user agent |
| device_id | varchar(200) | Yes | NULL | Client device reference |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 57. Session Constraints

Required:

    expires_at > issued_at

Revoked sessions must have:

    revoked_at IS NOT NULL

Active sessions must not have expired timestamps at authentication time.

# 58. Session DDL

    CREATE TYPE identity.session_status AS ENUM (
        'ACTIVE',
        'REVOKED',
        'EXPIRED'
    );

    CREATE TABLE identity.user_sessions (
        session_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        token_hash TEXT NOT NULL,
        status identity.session_status NOT NULL DEFAULT 'ACTIVE',
        issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        expires_at TIMESTAMPTZ NOT NULL,
        last_seen_at TIMESTAMPTZ NULL,
        revoked_at TIMESTAMPTZ NULL,
        revoked_by UUID NULL,
        ip_address INET NULL,
        user_agent TEXT NULL,
        device_id VARCHAR(200) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT user_sessions_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_sessions_expiry_check
            CHECK (expires_at > issued_at),
        CONSTRAINT user_sessions_revocation_check
            CHECK (
                (status = 'REVOKED' AND revoked_at IS NOT NULL)
                OR status <> 'REVOKED'
            )
    );

# 59. Session Indexes

Required:

    INDEX (user_id)

    INDEX (status, expires_at)

    INDEX (expires_at)

Token lookup requires:

    UNIQUE (token_hash)

# 60. API Token Table

`identity.api_tokens` represents long-lived programmatic access.

API tokens must be revocable and scoped.

# 61. `identity.api_tokens` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| token_id | uuid | No | UUIDv7 | Token ID |
| user_id | uuid | No | None | Token owner |
| token_hash | text | No | None | Hash of raw token |
| token_prefix | varchar(16) | No | None | Non-secret identification prefix |
| name | varchar(200) | No | None | User-visible token name |
| status | api_token_status | No | `ACTIVE` | Token lifecycle |
| scopes | jsonb | No | `'[]'` | Allowed scopes |
| organization_id | uuid | Yes | NULL | Optional default org scope |
| expires_at | timestamptz | Yes | NULL | Optional expiration |
| last_used_at | timestamptz | Yes | NULL | Last use |
| revoked_at | timestamptz | Yes | NULL | Revocation |
| revoked_by | uuid | Yes | NULL | Revoking actor |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 62. API Token Tenancy

A token belongs to a User.

An optional `organization_id` can constrain the token's default operating
scope.

This does not grant organization membership.

Authorization still requires:

    User
      +
    Organization Membership
      +
    Token Scope
      +
    Requested Resource

# 63. API Token DDL

    CREATE TYPE identity.api_token_status AS ENUM (
        'ACTIVE',
        'REVOKED',
        'EXPIRED'
    );

    CREATE TABLE identity.api_tokens (
        token_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        token_hash TEXT NOT NULL,
        token_prefix VARCHAR(16) NOT NULL,
        name VARCHAR(200) NOT NULL,
        status identity.api_token_status NOT NULL DEFAULT 'ACTIVE',
        scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
        organization_id UUID NULL,
        expires_at TIMESTAMPTZ NULL,
        last_used_at TIMESTAMPTZ NULL,
        revoked_at TIMESTAMPTZ NULL,
        revoked_by UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT api_tokens_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT api_tokens_scopes_array_check
            CHECK (jsonb_typeof(scopes) = 'array'),
        CONSTRAINT api_tokens_revocation_check
            CHECK (
                (status = 'REVOKED' AND revoked_at IS NOT NULL)
                OR status <> 'REVOKED'
            )
    );

# 64. API Token Indexes

Required:

    UNIQUE (token_hash)

    INDEX (user_id)

    INDEX (organization_id)

    INDEX (status, expires_at)

    INDEX (expires_at)

# 65. Organization Foreign Key

If `organization_id` is included in `api_tokens`, the final implementation
must add the cross-schema foreign key:

    FOREIGN KEY (organization_id)
        REFERENCES organization.organizations(organization_id)

This is a controlled cross-domain reference.

The Organization domain still owns the referenced organization record.

# 66. Token Scope Model

Scopes should use stable identifiers.

Examples:

    project:read
    project:write
    artifact:read
    artifact:write
    booking:read
    booking:write
    job:read
    job:execute
    result:read

Scope semantics belong to the authorization layer, not the database.

# 67. Token Creation Flow

    User Authenticated
          |
    Authorize Token Creation
          |
    Generate Random Token
          |
    Hash Token
          |
    Store Hash + Prefix
          |
    Return Raw Token Once
          |
    Never Store Raw Token

# 68. Session Creation Flow

    Authentication Request
          |
    Identity Provider / Credential Validation
          |
    Resolve User
          |
    Check User Status
          |
    Create Session
          |
    Store Token Hash
          |
    Return Session Credential

# 69. External Identity Login Flow

    Provider
       |
    Subject + Claims
       |
    identity.user_identities
       |
    Resolve User
       |
    Validate User Status
       |
    Create Session
       |
    RaaS Access

# 70. User Registration Flow

    Registration
        |
    Normalize Email
        |
    Create User PENDING
        |
    Create Profile
        |
    External Identity / Credential
        |
    Verify Identity
        |
    Activate User
        |
    Organization Membership

Organization membership is a separate transaction/domain operation.

# 71. User Authentication Flow

    Request
      |
    Provider/Credential
      |
    Resolve User
      |
    Check Status
      |
    Check Credential/Identity
      |
    Create Session
      |
    Update last_authenticated_at
      |
    Audit

# 72. Session Validation Flow

    Session Credential
          |
    Hash
          |
    Lookup token_hash
          |
    Check status
          |
    Check expires_at
          |
    Check user status
          |
    Establish identity context

# 73. API Token Validation Flow

    API Token
       |
    Hash
       |
    Lookup token_hash
       |
    Check token status
       |
    Check expiration
       |
    Resolve User
       |
    Check User status
       |
    Resolve Organization Membership
       |
    Validate Scope
       |
    Authorize Resource

# 74. User Read Interface

Conceptual application interface:

    UserService.getUser(user_id)

Returns approved identity metadata.

It must not expose:

- password hash;
- session token hash;
- API token hash;
- internal security metadata.

# 75. User Authentication Interface

Conceptual interface:

    IdentityService.authenticate(
        authentication_request
    )

The result should contain an authenticated identity context rather than raw
database records.

# 76. Provider Identity Interface

Conceptual interface:

    IdentityService.resolveExternalIdentity(
        provider_id,
        subject
    )

The operation returns the associated User or an appropriate registration
state.

# 77. Session Interface

Conceptual operations:

    SessionService.create(...)
    SessionService.validate(...)
    SessionService.revoke(...)
    SessionService.revokeAllForUser(...)
    SessionService.expire(...)

# 78. API Token Interface

Conceptual operations:

    ApiTokenService.create(...)
    ApiTokenService.list(...)
    ApiTokenService.revoke(...)
    ApiTokenService.validate(...)

Raw tokens must only exist in memory during creation/validation.

# 79. Repository Interfaces

Recommended repositories:

    UserRepository
    UserProfileRepository
    IdentityProviderRepository
    UserIdentityRepository
    UserCredentialRepository
    UserSessionRepository
    ApiTokenRepository

# 80. User Repository Operations

Recommended:

    create
    get_by_id
    get_by_email
    update_status
    update_email
    mark_authenticated
    mark_deleted

All operations must enforce identity-domain ownership.

# 81. Profile Repository Operations

Recommended:

    get_by_user
    create
    update
    delete_or_anonymize

Profile deletion must follow privacy policy.

# 82. Session Repository Operations

Recommended:

    create
    get_by_token_hash
    list_by_user
    revoke
    revoke_all
    expire
    delete_expired_after_retention

# 83. API Token Repository Operations

Recommended:

    create
    get_by_token_hash
    list_by_user
    revoke
    expire
    delete_after_retention

# 84. Cross-Domain Read Rules

Other domains may need:

- User display name;
- user ID;
- account status;
- organization membership.

They should use application interfaces.

They must not query authentication tables directly.

# 85. Cross-Domain Write Rules

Other domains cannot directly modify:

    identity.users
    identity.user_profiles
    identity.user_identities
    identity.user_credentials
    identity.user_sessions
    identity.api_tokens

Identity operations go through Identity services.

# 86. Organization Relation

The expected relationship is:

    identity.users
          |
          | 1:N
          v
    organization.memberships
          |
          | N:1
          v
    organization.organizations

Membership is the tenant relationship.

# 87. Project Relation

Projects should reference the organization, not necessarily the User.

A Project may additionally retain creator/owner user references.

If `created_by` is used as a foreign key to User, deletion policy must permit
identity privacy operations.

# 88. Audit Relation

Identity-sensitive operations should produce Audit records.

Examples:

- login;
- failed authentication;
- password change;
- provider linking;
- session revocation;
- API token creation;
- API token revocation;
- account suspension;
- account deletion.

Audit persistence is owned by the Audit domain.

# 89. Event Relation

Identity events may include:

    user.created
    user.activated
    user.suspended
    user.deactivated
    user.deleted
    user.identity_linked
    user.identity_unlinked
    user.session.created
    user.session.revoked
    user.api_token.created
    user.api_token.revoked

Event persistence is not the source of truth for User state.

# 90. Audit Columns and Actor References

`created_by` and `updated_by` should use UUID references where practical.

Self-referencing foreign keys may be added:

    created_by -> identity.users.user_id
    updated_by -> identity.users.user_id
    revoked_by -> identity.users.user_id

However, these references must support deletion/anonymization policies.

A SET NULL policy may be required for retained historical records.

# 91. Foreign-Key Policy

Default identity-domain relationship behavior:

| Relationship | Delete Policy |
|---|---|
| Profile → User | RESTRICT |
| Identity → User | RESTRICT |
| Credential → User | RESTRICT |
| Session → User | RESTRICT |
| Token → User | RESTRICT |
| Token → Organization | RESTRICT |
| Actor → User | SET NULL where required |

Identity deletion is therefore an explicit workflow rather than a cascade.

# 92. Example User Rows

Conceptual example:

    user_id:
      0194c7d0-8b00-7abc-9def-123456789001

    email:
      dinesh@example.invalid

    status:
      ACTIVE

    email_verified_at:
      2026-10-08T10:00:00Z

# 93. Example Profile Row

    user_id:
      0194c7d0-8b00-7abc-9def-123456789001

    display_name:
      Dinesh

    first_name:
      Dinesh

    last_name:
      A

    locale:
      en-IN

    timezone:
      Asia/Kolkata

    metadata:
      {
          "theme": "system"
      }

# 94. Example Identity Row

    user_identity_id:
      0194c7d0-8b00-7abc-9def-123456789002

    user_id:
      0194c7d0-8b00-7abc-9def-123456789001

    provider_id:
      0194c7d0-8b00-7abc-9def-123456789003

    subject:
      external-subject-12345

# 95. Example Session Row

    session_id:
      0194c7d0-8b00-7abc-9def-123456789004

    user_id:
      0194c7d0-8b00-7abc-9def-123456789001

    token_hash:
      <cryptographic-hash>

    status:
      ACTIVE

    expires_at:
      2026-10-15T10:00:00Z

# 96. Example API Token Row

    token_id:
      0194c7d0-8b00-7abc-9def-123456789005

    user_id:
      0194c7d0-8b00-7abc-9def-123456789001

    token_prefix:
      krv_live_8F2A

    name:
      CI Deployment

    scopes:
      [
        "artifact:read",
        "job:execute",
        "result:read"
      ]

# 97. Complete Relationship Diagram

    +----------------------+
    | identity.users       |
    |----------------------|
    | user_id PK           |
    | email                |
    | status               |
    +----------+-----------+
               |
       +-------+-------+---------+---------+
       |               |         |         |
       v               v         v         v
    profiles      identities  credentials sessions
       |               |         |         |
       |               v         |         |
       |       identity_providers |         |
       |                         |         |
       +-------------------------+---------+
                         |
                         v
                     api_tokens
                         |
                         v
                  organization_id
                         |
                         v
              organization.organizations

# 98. Schema DDL Ordering

DDL migration order should be:

    1. identity enum types
    2. identity_providers
    3. users
    4. user_profiles
    5. user_identities
    6. user_credentials
    7. user_sessions
    8. api_tokens
    9. indexes
    10. audit/actor foreign keys where applicable

Cross-schema Organization foreign keys should be added only after the
Organization schema exists.

# 99. Complete Baseline DDL

The following is the conceptual baseline and must be adapted to the selected
migration tooling.

    CREATE SCHEMA IF NOT EXISTS identity;

    CREATE EXTENSION IF NOT EXISTS citext;

    CREATE TYPE identity.user_status AS ENUM (
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED'
    );

    CREATE TYPE identity.identity_provider_status AS ENUM (
        'ACTIVE',
        'DISABLED',
        'DEPRECATED'
    );

    CREATE TYPE identity.credential_status AS ENUM (
        'ACTIVE',
        'DISABLED',
        'REVOKED'
    );

    CREATE TYPE identity.session_status AS ENUM (
        'ACTIVE',
        'REVOKED',
        'EXPIRED'
    );

    CREATE TYPE identity.api_token_status AS ENUM (
        'ACTIVE',
        'REVOKED',
        'EXPIRED'
    );

    CREATE TABLE identity.users (
        user_id UUID PRIMARY KEY,
        email CITEXT NOT NULL,
        email_verified_at TIMESTAMPTZ NULL,
        status identity.user_status NOT NULL DEFAULT 'PENDING',
        last_authenticated_at TIMESTAMPTZ NULL,
        deactivated_at TIMESTAMPTZ NULL,
        deleted_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT users_email_unique UNIQUE (email),
        CONSTRAINT users_deleted_status_check CHECK (
            deleted_at IS NULL OR status = 'DELETED'
        ),
        CONSTRAINT users_deactivated_status_check CHECK (
            deactivated_at IS NULL
            OR status IN ('DEACTIVATED', 'DELETED')
        )
    );

    CREATE TABLE identity.user_profiles (
        user_id UUID PRIMARY KEY,
        display_name VARCHAR(200) NULL,
        first_name VARCHAR(100) NULL,
        last_name VARCHAR(100) NULL,
        avatar_object_key TEXT NULL,
        timezone VARCHAR(64) NULL,
        locale VARCHAR(16) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT user_profiles_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_profiles_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE TABLE identity.identity_providers (
        provider_id UUID PRIMARY KEY,
        provider_key VARCHAR(100) NOT NULL,
        provider_type VARCHAR(32) NOT NULL,
        display_name VARCHAR(200) NOT NULL,
        issuer TEXT NULL,
        client_id TEXT NULL,
        status identity.identity_provider_status
            NOT NULL DEFAULT 'ACTIVE',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT identity_providers_key_unique
            UNIQUE (provider_key),
        CONSTRAINT identity_providers_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE TABLE identity.user_identities (
        user_identity_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        provider_id UUID NOT NULL,
        subject VARCHAR(512) NOT NULL,
        provider_email CITEXT NULL,
        email_verified_at TIMESTAMPTZ NULL,
        claims JSONB NOT NULL DEFAULT '{}'::jsonb,
        last_authenticated_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT user_identities_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_identities_provider_fk
            FOREIGN KEY (provider_id)
            REFERENCES identity.identity_providers(provider_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_identities_provider_subject_unique
            UNIQUE (provider_id, subject),
        CONSTRAINT user_identities_claims_object_check
            CHECK (jsonb_typeof(claims) = 'object')
    );

    CREATE TABLE identity.user_credentials (
        credential_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        credential_type VARCHAR(32) NOT NULL DEFAULT 'PASSWORD',
        secret_hash TEXT NOT NULL,
        status identity.credential_status NOT NULL DEFAULT 'ACTIVE',
        password_changed_at TIMESTAMPTZ NULL,
        last_used_at TIMESTAMPTZ NULL,
        failed_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT user_credentials_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_credentials_type_check
            CHECK (credential_type = 'PASSWORD'),
        CONSTRAINT user_credentials_failed_attempts_check
            CHECK (failed_attempts >= 0)
    );

    CREATE TABLE identity.user_sessions (
        session_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        token_hash TEXT NOT NULL,
        status identity.session_status NOT NULL DEFAULT 'ACTIVE',
        issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        expires_at TIMESTAMPTZ NOT NULL,
        last_seen_at TIMESTAMPTZ NULL,
        revoked_at TIMESTAMPTZ NULL,
        revoked_by UUID NULL,
        ip_address INET NULL,
        user_agent TEXT NULL,
        device_id VARCHAR(200) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT user_sessions_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT user_sessions_expiry_check
            CHECK (expires_at > issued_at),
        CONSTRAINT user_sessions_revocation_check
            CHECK (
                (status = 'REVOKED' AND revoked_at IS NOT NULL)
                OR status <> 'REVOKED'
            )
    );

    CREATE TABLE identity.api_tokens (
        token_id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        token_hash TEXT NOT NULL,
        token_prefix VARCHAR(16) NOT NULL,
        name VARCHAR(200) NOT NULL,
        status identity.api_token_status NOT NULL DEFAULT 'ACTIVE',
        scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
        organization_id UUID NULL,
        expires_at TIMESTAMPTZ NULL,
        last_used_at TIMESTAMPTZ NULL,
        revoked_at TIMESTAMPTZ NULL,
        revoked_by UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT api_tokens_user_fk
            FOREIGN KEY (user_id)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT api_tokens_scopes_array_check
            CHECK (jsonb_typeof(scopes) = 'array'),
        CONSTRAINT api_tokens_revocation_check
            CHECK (
                (status = 'REVOKED' AND revoked_at IS NOT NULL)
                OR status <> 'REVOKED'
            )
    );

# 100. Complete Baseline Index DDL

    CREATE INDEX users_status_idx
        ON identity.users(status);

    CREATE INDEX users_created_at_idx
        ON identity.users(created_at);

    CREATE INDEX users_deleted_at_idx
        ON identity.users(deleted_at);

    CREATE INDEX user_identities_user_idx
        ON identity.user_identities(user_id);

    CREATE INDEX user_identities_provider_idx
        ON identity.user_identities(provider_id);

    CREATE INDEX identity_providers_status_idx
        ON identity.identity_providers(status);

    CREATE INDEX user_credentials_user_idx
        ON identity.user_credentials(user_id);

    CREATE UNIQUE INDEX user_credentials_one_password_idx
        ON identity.user_credentials(user_id)
        WHERE credential_type = 'PASSWORD';

    CREATE UNIQUE INDEX user_sessions_token_hash_idx
        ON identity.user_sessions(token_hash);

    CREATE INDEX user_sessions_user_idx
        ON identity.user_sessions(user_id);

    CREATE INDEX user_sessions_status_expiry_idx
        ON identity.user_sessions(status, expires_at);

    CREATE INDEX user_sessions_expiry_idx
        ON identity.user_sessions(expires_at);

    CREATE UNIQUE INDEX api_tokens_token_hash_idx
        ON identity.api_tokens(token_hash);

    CREATE INDEX api_tokens_user_idx
        ON identity.api_tokens(user_id);

    CREATE INDEX api_tokens_status_expiry_idx
        ON identity.api_tokens(status, expires_at);

    CREATE INDEX api_tokens_expires_idx
        ON identity.api_tokens(expires_at);

# 101. Updated-at Handling

`updated_at` must be maintained consistently.

The implementation may use:

- application-level updates;
- database trigger;
- shared persistence utility.

The chosen approach must guarantee that updates cannot silently leave
`updated_at` stale.

# 102. Email Change Flow

Changing email must not simply overwrite the email field.

Recommended flow:

    Request Email Change
          |
    Verify Current Identity
          |
    Validate New Email
          |
    Verify New Email
          |
    Update User
          |
    Audit
          |
    Event

The final implementation may introduce a separate email-verification table
if the product requires multi-step pending changes.

# 103. Account Suspension Flow

    Security/Admin Action
          |
    Authorize
          |
    User.status = SUSPENDED
          |
    Revoke Sessions
          |
    Disable Tokens if Required
          |
    Audit
          |
    Event

Suspension must not silently delete organization memberships.

# 104. Account Deactivation Flow

    Deactivate User
          |
    Revoke Sessions
          |
    Revoke API Tokens
          |
    Disable Credentials
          |
    Retain Required History
          |
    Audit

Membership handling remains an Organization-domain decision.

# 105. Account Deletion Flow

    Deletion Request
          |
    Verify Authority
          |
    Export if Required
          |
    Evaluate Retention
          |
    Revoke Sessions
          |
    Revoke Tokens
          |
    Remove/Anonymize Profile
          |
    Remove/Anonymize Identity Data
          |
    Retain Required Security/Audit Evidence
          |
    Mark User DELETED
          |
    Audit Completion

# 106. Retention

Initial retention direction:

| Data | Retention |
|---|---|
| User core record | Account lifecycle + policy |
| Profile | Account lifecycle + policy |
| External identities | Account lifecycle + security policy |
| Credentials | Until disabled/deleted + security policy |
| Sessions | Short operational retention |
| API Tokens | Until revoked/expired + bounded history |
| Provider configuration | Operational lifecycle |
| Audit references | Multi-year/policy |

Exact periods remain a policy decision.

# 107. Session Retention

Expired/revoked sessions should be periodically cleaned according to security
and audit requirements.

The cleanup process must not remove evidence required for an active security
investigation.

# 108. API Token Retention

Revoked/expired tokens may be removed after a bounded retention period.

Token hashes must not be retained indefinitely without purpose.

# 109. Credential Retention

When a User is deleted:

- password hash should be removed where legally and operationally possible;
- credential lifecycle evidence may be retained through Audit;
- credential secrets must never be exported.

# 110. Profile Privacy

Profile data is customer personal data.

Privacy operations must support:

- export;
- correction;
- deletion;
- anonymization.

# 111. Security Logging

Authentication failures should not store passwords or raw tokens.

Security logs may contain:

- user ID;
- event ID;
- timestamp;
- result;
- provider;
- network metadata where justified.

# 112. Rate Limiting Data

Rate limiting counters should not be stored in the Users schema unless required
for durable policy.

High-frequency rate limiting belongs in the appropriate operational
infrastructure.

# 113. Password Reset

Password reset tokens must not be stored in plaintext.

If password reset persistence is required, a future dedicated table should
store:

- token hash;
- User;
- expiry;
- consumed timestamp.

This document intentionally does not add a reset-token table until local
credentials are confirmed as a product requirement.

# 114. MFA

MFA is not yet represented as a committed table.

If required, future schema may include:

- authenticators;
- recovery codes;
- MFA challenges.

Secrets must follow Security-approved storage rules.

# 115. API Token Scopes and Authorization

Token scopes are authentication metadata.

Actual authorization remains determined by:

- User;
- Organization Membership;
- role;
- resource ownership;
- token scopes.

A token must never bypass Organization authorization.

# 116. Data Export

User export may include:

- user profile;
- identity-provider linkage metadata where appropriate;
- sessions metadata if policy allows;
- API token metadata excluding token secrets;
- organization membership through the Organization domain;
- audit data according to policy.

Never export:

- password hash;
- session token hash;
- API token hash;
- provider secrets.

# 117. GDPR-Style Deletion

Deletion must distinguish:

    Personal Data
        |
    Eligible for Deletion
        |
        +--> Delete

    Required Evidence
        |
        +--> Anonymize / Retain

The Users schema must support controlled lifecycle processing rather than
unrestricted row deletion.

# 118. Phase 0 Mapping

Phase 0 defines:

- UUIDv7;
- identity schema ownership;
- status model;
- security boundaries;
- migration order;
- credential policy.

Tasks:

    DB01-001
    DB01-002
    DB01-003
    DB01-004
    DB01-006

# 119. Phase 1 Mapping

Phase 1 implements:

- users;
- profiles;
- provider identities;
- sessions;
- credentials if enabled;
- API tokens;
- identity repositories.

Acceptance requires identity and tenant integration.

# 120. Phase 2 Mapping

Phase 2 consumes User identity for:

- project creation;
- artifact ownership;
- platform workflows;
- local Studio authentication.

The Users schema should not acquire project-specific columns.

# 121. Phase 3 Mapping

Phase 3 uses User identity for:

- Job actor;
- Run actor;
- execution authorization;
- audit actor.

User data remains owned by Identity.

# 122. Phase 4 Mapping

Phase 4 uses User identity for:

- booking actor;
- credit operations;
- billing actions.

Financial ownership remains with Credit.

# 123. Phase 5 Mapping

Phase 5 uses authenticated User context for:

- artifact upload;
- Job creation;
- execution control;
- result access.

The Lab Agent must not receive unnecessary personal identity data.

# 124. Phase 6 Mapping

Phase 6 uses User identity for:

- administrative Lab actions;
- resource administration;
- operational audit.

Robot identity remains in Lab.

# 125. Phase 7 Mapping

Phase 7 uses User identity for:

- experiment creation;
- result access;
- audit actor;
- event actor context.

# 126. Phase 8 Mapping

Phase 8 completes:

- retention;
- export;
- deletion;
- anonymization;
- authentication security;
- token cleanup;
- production access audit.

# 127. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Credential leakage | Critical | Hashing + restricted access |
| Token leakage | Critical | Hash-only storage |
| Cross-tenant authorization | Critical | Membership boundary |
| User deletion inconsistency | High | Controlled lifecycle |
| Provider account collision | High | Unique provider/subject |
| Session accumulation | Medium | Retention cleanup |
| Token accumulation | Medium | Expiry/revocation cleanup |
| Profile privacy leak | High | Separate profile controls |
| Excessive claims storage | Medium | Claim minimization |
| Admin misuse | High | Audit + least privilege |
| Identity provider outage | High | Operational resilience |
| Email collision | High | Canonical unique email |
| UUID implementation error | Medium | Library + validation |
| Direct table access | High | Domain repository boundary |

# 128. Open Questions

1. Final external identity provider.
2. Whether local password authentication is enabled.
3. Final password hashing algorithm.
4. Final password policy.
5. Final MFA requirements.
6. Final session duration.
7. Final refresh-token architecture.
8. Final API token format.
9. Final API token maximum lifetime.
10. Final token scope catalogue.
11. Final email normalization rules.
12. Final account recovery flow.
13. Final password reset workflow.
14. Final privacy retention periods.
15. Final data residency requirements.
16. Final RLS decision.
17. Final identity audit retention.
18. Final provider secret storage mechanism.
19. Final user deletion SLA.
20. Final external identity linking policy.

# 129. Acceptance — Schema

- [ ] `identity` schema exists.
- [ ] `users` exists.
- [ ] `user_profiles` exists.
- [ ] `identity_providers` exists.
- [ ] `user_identities` exists.
- [ ] `user_credentials` exists if local credentials are enabled.
- [ ] `user_sessions` exists.
- [ ] `api_tokens` exists.
- [ ] All primary keys use UUID.
- [ ] UUIDs are generated as UUIDv7.
- [ ] All foreign keys use matching UUID types.

# 130. Acceptance — Users

- [ ] Email is canonical and unique.
- [ ] User status is constrained.
- [ ] Lifecycle timestamps are consistent.
- [ ] Creation/update timestamps exist.
- [ ] User ownership is Identity.
- [ ] User does not directly contain organization tenancy.
- [ ] Deletion lifecycle is explicit.

# 131. Acceptance — Profiles

- [ ] One profile per User is enforced.
- [ ] Profile is optional only if product policy permits it.
- [ ] Profile metadata is JSONB.
- [ ] JSONB must contain an object.
- [ ] No secrets are stored in profile metadata.
- [ ] Profile deletion/anonymization is supported.

# 132. Acceptance — Identity Providers

- [ ] Provider key is unique.
- [ ] Provider status is constrained.
- [ ] Provider secrets are not stored as plaintext.
- [ ] Provider configuration is auditable.
- [ ] Disabled providers cannot create new sessions.

# 133. Acceptance — User Identities

- [ ] Provider/subject is unique.
- [ ] User foreign key exists.
- [ ] Provider foreign key exists.
- [ ] Claims are bounded and minimized.
- [ ] External identity linking is auditable.
- [ ] Unlinking cannot orphan authentication unexpectedly.

# 134. Acceptance — Credentials

- [ ] Passwords are never stored plaintext.
- [ ] Credential hash is restricted.
- [ ] Credential status is constrained.
- [ ] Failed attempts are bounded.
- [ ] Lock state is supported.
- [ ] Credential changes are audited.
- [ ] Disabled users cannot authenticate through credentials.

# 135. Acceptance — Sessions

- [ ] Raw session tokens are not stored.
- [ ] Token hash is unique.
- [ ] Expiration is mandatory.
- [ ] Revocation is supported.
- [ ] User status is checked during validation.
- [ ] Session cleanup exists.
- [ ] Session creation/revocation is audited.

# 136. Acceptance — API Tokens

- [ ] Raw API tokens are never stored.
- [ ] Token hash is unique.
- [ ] Token prefix is non-secret.
- [ ] Token scopes are represented.
- [ ] Token expiration is supported.
- [ ] Token revocation is supported.
- [ ] Organization scope does not bypass membership.
- [ ] Token creation is audited.
- [ ] Token plaintext is returned only once.

# 137. Acceptance — Security

- [ ] Authentication secrets are excluded from logs.
- [ ] Authentication secrets are excluded from traces.
- [ ] Credential tables have restricted access.
- [ ] Session tables have restricted access.
- [ ] Token tables have restricted access.
- [ ] Administrative access is audited.
- [ ] Break-glass access is controlled.

# 138. Acceptance — Tenancy

- [ ] User is separate from Organization.
- [ ] Membership owns tenant relationship.
- [ ] API token organization scope is validated through membership.
- [ ] Other domains cannot infer authorization from User existence alone.
- [ ] Cross-tenant authorization tests exist.

# 139. Acceptance — Lifecycle

- [ ] PENDING state is defined.
- [ ] ACTIVE state is defined.
- [ ] SUSPENDED state is defined.
- [ ] DEACTIVATED state is defined.
- [ ] DELETED state is defined.
- [ ] Session lifecycle is defined.
- [ ] Token lifecycle is defined.
- [ ] Credential lifecycle is defined.

# 140. Acceptance — Privacy

- [ ] User export is supported.
- [ ] Profile export is supported.
- [ ] Sensitive authentication secrets are excluded.
- [ ] User deletion is controlled.
- [ ] Profile deletion/anonymization is supported.
- [ ] Identity-provider linkage deletion is supported.
- [ ] Required audit evidence can be retained.
- [ ] Retention exceptions are documented.

# 141. Acceptance — Operations

- [ ] Migrations are version controlled.
- [ ] Schema creation works from empty database.
- [ ] CI validates migrations.
- [ ] Indexes are validated.
- [ ] Foreign keys are validated.
- [ ] Constraint tests pass.
- [ ] Backup includes Users schema.
- [ ] Restore includes Users schema.
- [ ] Production monitoring exists.

# 142. Acceptance — Integration

- [ ] User creation integrates with authentication.
- [ ] User creation integrates with Organization membership.
- [ ] User identity integrates with Project authorization.
- [ ] User identity integrates with Booking.
- [ ] User identity integrates with Credit.
- [ ] User identity integrates with Job execution.
- [ ] User identity integrates with Results.
- [ ] User identity integrates with Audit.
- [ ] User identity integrates with Events.

# 143. Acceptance — Final Invariants

The following must always remain true:

1. Every User has one immutable `user_id`.
2. `user_id` uses UUIDv7 semantics.
3. User identity is independent of Organization membership.
4. A User may belong to multiple Organizations.
5. A User may have multiple external identities.
6. A provider/subject maps to at most one User.
7. A User has at most one active local password credential.
8. Raw passwords are never persisted.
9. Raw session tokens are never persisted.
10. Raw API tokens are never persisted.
11. Session validation requires User status validation.
12. API token authorization requires Organization membership where applicable.
13. Identity providers do not own Users.
14. Identity Module owns User lifecycle.
15. Organization Module owns Membership.
16. Profile data is separable from authentication data.
17. Authentication secrets are restricted.
18. Identity events do not replace database state.
19. Audit records do not replace database state.
20. User deletion is a controlled privacy workflow.
21. Financial records are not deleted merely because a User is deleted.
22. Required security/audit evidence may be retained or anonymized.
23. No other domain directly writes identity tables.
24. Database backups include identity data.
25. Restore validation includes identity data.

# 144. Final Users Schema Model

The complete conceptual model is:

    +-----------------------+
    | identity.users        |
    |-----------------------|
    | user_id PK            |
    | email                 |
    | status                |
    | lifecycle             |
    +-----------+-----------+
                |
        +-------+-------+---------+---------+
        |               |         |         |
        v               v         v         v
    user_profiles   user_identities  credentials sessions
                        |               |         |
                        v               |         |
                 identity_providers     |         |
                                        |         |
                                        +----+----+
                                             |
                                             v
                                         api_tokens
                                             |
                                             v
                                  organization_id
                                             |
                                             v
                                  organizations

# 145. Final Architecture Principle

> **The Kritva RaaS Users schema represents identity, not tenancy. A User is
> a global identity record that can participate in multiple organizations;
> authorization within an organization is established separately through
> Organization Membership. Authentication providers, credentials, sessions
> and API tokens are subordinate to the User identity and are protected as
> restricted security data. Profile data is intentionally separated from
> authentication state to support privacy and lifecycle management.**
>
> **The schema uses UUIDv7 identifiers, PostgreSQL native UUID columns,
> relational integrity, selective JSONB, explicit lifecycle states and
> controlled deletion. Raw credentials are never persisted, cross-domain
> writes are prohibited, and identity operations are auditable. This design
> provides the identity foundation required by every subsequent Kritva RaaS
> phase while preserving tenant isolation, security, privacy and a clean
> path toward future enterprise identity integrations.**
