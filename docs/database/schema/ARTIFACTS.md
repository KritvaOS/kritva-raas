# Kritva RaaS Artifacts Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Artifacts Schema |
| Path | `docs/database/schema/ARTIFACTS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `artifact` |
| Primary Domain Owner | Artifact Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Binary Storage | Object Storage |
| Source Storage | Local user machine only |
| Artifact Format | `.krv` |
| Data Classification | Confidential / Restricted |
| Phase Coverage | Phase 0–Phase 8 |
| Related Domains | Identity, Organization, Project, Platform, Booking, Execution, Result, Audit |

# 2. Purpose

This document defines the production-grade PostgreSQL schema and storage
contract for Kritva RaaS executable artifacts.

An Artifact is the validated, packaged execution unit produced from source
code on the customer's local machine and uploaded to Kritva RaaS.

The architecture principle is:

    Customer Source
         |
         | stays local
         v
    Local Build
         |
    Local Test
         |
    Package
         |
    Sign
         |
         v
    .krv Artifact
         |
         v
    RaaS Artifact Registry
         |
         +--> Validate
         |
         +--> Store
         |
         +--> Compatibility Check
         |
         +--> Deploy
         |
         v
    Remote Robot / Simulator

The Artifact schema stores metadata, validation evidence, integrity information,
signatures, compatibility requirements and object-storage references.

It does not store customer source code.

# 3. Scope

This document defines:

- artifact identity;
- artifact versions;
- artifact manifests;
- checksums;
- signatures;
- compatibility records;
- object-storage objects;
- validation status;
- artifact lifecycle;
- retention;
- tenant ownership;
- project ownership;
- audit fields;
- storage state;
- upload state;
- compatibility state;
- validation state;
- repository interfaces;
- application services;
- artifact registration;
- upload;
- validation;
- deployment preparation;
- revocation;
- expiration;
- retention and deletion;
- Phase 0–Phase 8 mapping;
- risks;
- open questions;
- acceptance criteria.

# 4. Non-Goals

This document does not define:

- source-code storage;
- Git repository storage;
- remote source builds;
- compiler implementation;
- build farm architecture;
- robot deployment implementation;
- booking transactions;
- Job lifecycle;
- Run lifecycle;
- Result storage;
- Project lifecycle;
- cryptographic key-management infrastructure.

Those concerns remain in their respective domains.

# 5. Product Principle

The Artifact architecture implements:

> **Build locally, validate locally, package locally, upload only the
> execution artifact, validate remotely, and execute remotely.**

The artifact boundary minimizes customer source-code exposure.

This is a strong architectural boundary, but not an absolute guarantee of
intellectual-property protection.

A compiled artifact may still contain:

- proprietary algorithms;
- strings;
- symbols;
- embedded configuration;
- libraries;
- binary metadata.

Therefore artifact security remains important even though source code is not
uploaded.

# 6. Artifact Ownership

An Artifact belongs to:

    Organization
         |
       Project
         |
      Artifact

The Organization is the primary tenant boundary.

The Project provides the customer workspace.

The Artifact domain owns Artifact metadata and lifecycle.

Object storage owns the physical binary object.

# 7. Artifact Identity Model

The logical hierarchy is:

    Project
       |
       +-- Artifact
              |
              +-- Artifact Version
                     |
                     +-- Manifest
                     +-- Checksums
                     +-- Signatures
                     +-- Compatibility
                     +-- Storage Object
                     +-- Validation Records

An Artifact represents a logical application/package.

An Artifact Version represents one immutable executable package.

# 8. Artifact Lifecycle

Recommended Artifact Version lifecycle:

    CREATED
       |
       v
    UPLOADING
       |
       v
    UPLOADED
       |
       v
    VALIDATING
       |
       +----> REJECTED
       |
       v
    ACCEPTED
       |
       +----> REVOKED
       |
       +----> EXPIRED
       |
       v
    RETIRED

Only `ACCEPTED` artifacts may normally be used for deployment.

# 9. Artifact State Definitions

| State | Meaning |
|---|---|
| CREATED | Artifact version metadata registered |
| UPLOADING | Object upload in progress |
| UPLOADED | Upload completed, validation not complete |
| VALIDATING | Validation pipeline executing |
| ACCEPTED | Artifact passed required validation |
| REJECTED | Artifact failed validation |
| REVOKED | Previously accepted artifact explicitly blocked |
| EXPIRED | Artifact exceeded retention/validity policy |
| RETIRED | Artifact no longer operationally selectable |

# 10. Artifact Logical State

The logical Artifact itself has a separate lifecycle:

    ACTIVE
       |
       +----> ARCHIVED
       |
       +----> DELETED

Artifact Version lifecycle is independent of the logical Artifact lifecycle.

# 11. Artifact Table

`artifact.artifacts` represents the logical application/package.

It contains:

- Organization ownership;
- Project ownership;
- stable artifact key;
- name;
- description;
- lifecycle;
- metadata;
- audit information.

# 12. `artifact.artifacts` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| artifact_id | uuid | No | UUIDv7 | Logical Artifact ID |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| artifact_key | varchar(100) | No | None | Stable project-scoped key |
| name | varchar(200) | No | None | Artifact name |
| description | varchar(2000) | Yes | NULL | Description |
| status | artifact_status | No | `ACTIVE` | Lifecycle |
| latest_version_id | uuid | Yes | NULL | Current version |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| archived_at | timestamptz | Yes | NULL | Archive timestamp |
| deleted_at | timestamptz | Yes | NULL | Deletion marker |
| created_by | uuid | No | None | Creating User |
| updated_by | uuid | Yes | NULL | Updating User |

# 13. Artifact DDL

    CREATE SCHEMA IF NOT EXISTS artifact;

    CREATE TYPE artifact.artifact_status AS ENUM (
        'ACTIVE',
        'ARCHIVED',
        'DELETED'
    );

    CREATE TABLE artifact.artifacts (
        artifact_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        artifact_key VARCHAR(100) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(2000) NULL,
        status artifact.artifact_status
            NOT NULL DEFAULT 'ACTIVE',
        latest_version_id UUID NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        archived_at TIMESTAMPTZ NULL,
        deleted_at TIMESTAMPTZ NULL,
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT artifacts_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifacts_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifacts_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifacts_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT artifacts_project_key_unique
            UNIQUE (project_id, artifact_key),
        CONSTRAINT artifacts_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT artifacts_archive_check
            CHECK (
                archived_at IS NULL
                OR status IN ('ARCHIVED', 'DELETED')
            ),
        CONSTRAINT artifacts_delete_check
            CHECK (
                deleted_at IS NULL
                OR status = 'DELETED'
            )
    );

# 14. Artifact Indexes

Required:

    PRIMARY KEY (artifact_id)

    UNIQUE (project_id, artifact_key)

Recommended:

    INDEX (organization_id, status)

    INDEX (project_id, status)

    INDEX (created_at)

    INDEX (updated_at)

# 15. Tenant Integrity

`organization_id` must correspond to the Organization that owns the Project.

The preferred implementation is a tenant-aware composite foreign key where
the Project schema supports:

    (organization_id, project_id)
        REFERENCES project.projects(organization_id, project_id)

This prevents accidental cross-tenant artifact attachment.

# 16. Artifact Version Table

`artifact.artifact_versions` represents an immutable executable package.

Once an Artifact Version reaches `ACCEPTED`, its execution contents must not
be modified.

Any content change creates a new Artifact Version.

# 17. `artifact.artifact_versions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| artifact_version_id | uuid | No | UUIDv7 | Version ID |
| artifact_id | uuid | No | None | Logical Artifact |
| version | varchar(100) | No | None | Artifact version |
| status | artifact_version_status | No | `CREATED` | Lifecycle |
| format | varchar(32) | No | `'krv'` | Artifact format |
| architecture_id | uuid | Yes | NULL | Declared target architecture |
| platform_id | uuid | Yes | NULL | Declared target platform |
| platform_version_id | uuid | Yes | NULL | Declared target version |
| runtime_version | varchar(64) | Yes | NULL | Runtime requirement |
| sdk_version | varchar(64) | Yes | NULL | SDK version |
| entrypoint | varchar(500) | Yes | NULL | Execution entrypoint |
| size_bytes | bigint | Yes | NULL | Artifact size |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| accepted_at | timestamptz | Yes | NULL | Acceptance |
| rejected_at | timestamptz | Yes | NULL | Rejection |
| revoked_at | timestamptz | Yes | NULL | Revocation |
| expires_at | timestamptz | Yes | NULL | Expiration |
| created_by | uuid | No | None | Creating User |
| metadata | jsonb | No | `'{}'` | Bounded metadata |

# 18. Artifact Version Uniqueness

The recommended logical uniqueness is:

    UNIQUE (artifact_id, version)

Versions are immutable after acceptance.

A new package requires a new version.

# 19. Artifact Version DDL

    CREATE TYPE artifact.artifact_version_status AS ENUM (
        'CREATED',
        'UPLOADING',
        'UPLOADED',
        'VALIDATING',
        'ACCEPTED',
        'REJECTED',
        'REVOKED',
        'EXPIRED',
        'RETIRED'
    );

    CREATE TABLE artifact.artifact_versions (
        artifact_version_id UUID PRIMARY KEY,
        artifact_id UUID NOT NULL,
        version VARCHAR(100) NOT NULL,
        status artifact.artifact_version_status
            NOT NULL DEFAULT 'CREATED',
        format VARCHAR(32) NOT NULL DEFAULT 'krv',
        architecture_id UUID NULL,
        platform_id UUID NULL,
        platform_version_id UUID NULL,
        runtime_version VARCHAR(64) NULL,
        sdk_version VARCHAR(64) NULL,
        entrypoint VARCHAR(500) NULL,
        size_bytes BIGINT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        accepted_at TIMESTAMPTZ NULL,
        rejected_at TIMESTAMPTZ NULL,
        revoked_at TIMESTAMPTZ NULL,
        expires_at TIMESTAMPTZ NULL,
        created_by UUID NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT artifact_versions_artifact_fk
            FOREIGN KEY (artifact_id)
            REFERENCES artifact.artifacts(artifact_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifact_versions_architecture_fk
            FOREIGN KEY (architecture_id)
            REFERENCES platform.architectures(architecture_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifact_versions_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifact_versions_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifact_versions_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT artifact_versions_unique
            UNIQUE (artifact_id, version),
        CONSTRAINT artifact_versions_size_check
            CHECK (size_bytes IS NULL OR size_bytes > 0),
        CONSTRAINT artifact_versions_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT artifact_versions_acceptance_check
            CHECK (
                accepted_at IS NULL
                OR status IN (
                    'ACCEPTED',
                    'REVOKED',
                    'EXPIRED',
                    'RETIRED'
                )
            )
    );

# 20. Artifact Version Indexes

Recommended:

    INDEX (artifact_id, status)

    INDEX (platform_id, platform_version_id)

    INDEX (architecture_id)

    INDEX (status, expires_at)

    INDEX (accepted_at)

# 21. Manifest Table

The manifest is the structured declaration describing the contents and
requirements of an Artifact Version.

The manifest is generated locally and independently validated remotely.

# 22. Manifest Contents

The manifest identifies:

- artifact format;
- schema version;
- application;
- version;
- target platform;
- architecture;
- runtime;
- SDK;
- required capabilities;
- entrypoint;
- files;
- checksums;
- signature references;
- package metadata.

# 23. `artifact.manifests` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| manifest_id | uuid | No | UUIDv7 | Manifest ID |
| artifact_version_id | uuid | No | None | Artifact Version |
| schema_version | varchar(32) | No | `'1.0'` | Manifest schema |
| manifest_json | jsonb | No | None | Canonical manifest |
| canonical_digest | varchar(128) | No | None | Manifest digest |
| created_at | timestamptz | No | `now()` | Creation |
| validated_at | timestamptz | Yes | NULL | Manifest validation |
| validation_status | manifest_validation_status | No | `PENDING` | Status |

# 24. Manifest DDL

    CREATE TYPE artifact.manifest_validation_status AS ENUM (
        'PENDING',
        'VALID',
        'INVALID'
    );

    CREATE TABLE artifact.manifests (
        manifest_id UUID PRIMARY KEY,
        artifact_version_id UUID NOT NULL,
        schema_version VARCHAR(32) NOT NULL DEFAULT '1.0',
        manifest_json JSONB NOT NULL,
        canonical_digest VARCHAR(128) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        validated_at TIMESTAMPTZ NULL,
        validation_status artifact.manifest_validation_status
            NOT NULL DEFAULT 'PENDING',
        CONSTRAINT manifests_version_fk
            FOREIGN KEY (artifact_version_id)
            REFERENCES artifact.artifact_versions(artifact_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT manifests_version_unique
            UNIQUE (artifact_version_id),
        CONSTRAINT manifests_object_check
            CHECK (jsonb_typeof(manifest_json) = 'object'),
        CONSTRAINT manifests_digest_check
            CHECK (length(canonical_digest) >= 32)
    );

# 25. Manifest Immutability

After validation, the canonical manifest must not be modified.

If manifest requirements change:

    new Artifact Version
        |
    new Manifest

# 26. Checksum Table

Checksums provide cryptographic integrity for:

- complete artifact package;
- manifest;
- individual package objects where required.

# 27. `artifact.checksums` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| checksum_id | uuid | No | UUIDv7 | Checksum ID |
| artifact_version_id | uuid | No | None | Artifact Version |
| scope | checksum_scope | No | None | What is hashed |
| algorithm | checksum_algorithm | No | `SHA256` | Algorithm |
| digest | varchar(256) | No | None | Hex/base encoded digest |
| created_at | timestamptz | No | `now()` | Creation |
| verified_at | timestamptz | Yes | NULL | Verification time |
| verification_status | checksum_verification_status | No | `PENDING` | Verification |

# 28. Checksum Types

Initial scope:

    ARTIFACT
    MANIFEST
    OBJECT

Algorithms initially:

    SHA256
    SHA512

# 29. Checksum DDL

    CREATE TYPE artifact.checksum_scope AS ENUM (
        'ARTIFACT',
        'MANIFEST',
        'OBJECT'
    );

    CREATE TYPE artifact.checksum_algorithm AS ENUM (
        'SHA256',
        'SHA512'
    );

    CREATE TYPE artifact.checksum_verification_status AS ENUM (
        'PENDING',
        'VALID',
        'INVALID'
    );

    CREATE TABLE artifact.checksums (
        checksum_id UUID PRIMARY KEY,
        artifact_version_id UUID NOT NULL,
        scope artifact.checksum_scope NOT NULL,
        algorithm artifact.checksum_algorithm
            NOT NULL DEFAULT 'SHA256',
        digest VARCHAR(256) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        verified_at TIMESTAMPTZ NULL,
        verification_status artifact.checksum_verification_status
            NOT NULL DEFAULT 'PENDING',
        CONSTRAINT checksums_version_fk
            FOREIGN KEY (artifact_version_id)
            REFERENCES artifact.artifact_versions(artifact_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT checksums_unique
            UNIQUE (artifact_version_id, scope, algorithm),
        CONSTRAINT checksums_digest_not_empty
            CHECK (length(digest) > 0)
    );

# 30. Signature Table

Signatures provide authenticity and integrity evidence.

The signature metadata is stored in PostgreSQL.

Private signing keys are never stored in the Artifact database.

# 31. `artifact.signatures` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| signature_id | uuid | No | UUIDv7 | Signature ID |
| artifact_version_id | uuid | No | None | Artifact Version |
| signature_type | signature_type | No | `DIGEST` | Signature model |
| algorithm | varchar(64) | No | None | Cryptographic algorithm |
| key_id | varchar(256) | No | None | Public key reference |
| signature_value | text | No | None | Encoded signature |
| signed_digest | varchar(256) | No | None | Digest covered |
| status | signature_status | No | `PENDING` | Validation status |
| signed_at | timestamptz | No | None | Signing time |
| verified_at | timestamptz | Yes | NULL | Verification time |
| created_at | timestamptz | No | `now()` | Record creation |
| created_by | uuid | Yes | NULL | Creating actor |

# 32. Signature Types

Initial:

    DIGEST
    MANIFEST
    PACKAGE

# 33. Signature DDL

    CREATE TYPE artifact.signature_type AS ENUM (
        'DIGEST',
        'MANIFEST',
        'PACKAGE'
    );

    CREATE TYPE artifact.signature_status AS ENUM (
        'PENDING',
        'VALID',
        'INVALID',
        'REVOKED'
    );

    CREATE TABLE artifact.signatures (
        signature_id UUID PRIMARY KEY,
        artifact_version_id UUID NOT NULL,
        signature_type artifact.signature_type NOT NULL,
        algorithm VARCHAR(64) NOT NULL,
        key_id VARCHAR(256) NOT NULL,
        signature_value TEXT NOT NULL,
        signed_digest VARCHAR(256) NOT NULL,
        status artifact.signature_status
            NOT NULL DEFAULT 'PENDING',
        signed_at TIMESTAMPTZ NOT NULL,
        verified_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        CONSTRAINT signatures_version_fk
            FOREIGN KEY (artifact_version_id)
            REFERENCES artifact.artifact_versions(artifact_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT signatures_signature_check
            CHECK (length(signature_value) > 0),
        CONSTRAINT signatures_key_check
            CHECK (length(key_id) > 0)
    );

# 34. Signature Uniqueness

Multiple signatures may be allowed for an Artifact Version.

This supports:

- key rotation;
- organizational signing;
- platform signing;
- future multi-signature policy.

The final uniqueness rule should prevent accidental duplicate signatures while
allowing legitimate key rotation.

# 35. Storage Object Table

The database does not store the binary `.krv` payload.

`artifact.storage_objects` stores the object-storage reference.

# 36. `artifact.storage_objects` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| storage_object_id | uuid | No | UUIDv7 | Storage record |
| artifact_version_id | uuid | No | None | Artifact Version |
| provider | varchar(64) | No | None | Storage provider abstraction |
| bucket | varchar(255) | No | None | Bucket/container |
| object_key | varchar(1024) | No | None | Object key |
| content_type | varchar(255) | No | `'application/octet-stream'` | MIME type |
| size_bytes | bigint | No | None | Stored size |
| etag | varchar(256) | Yes | NULL | Storage ETag |
| checksum_digest | varchar(256) | Yes | NULL | Storage digest |
| status | storage_object_status | No | `PENDING` | Storage state |
| created_at | timestamptz | No | `now()` | Creation |
| uploaded_at | timestamptz | Yes | NULL | Upload completion |
| verified_at | timestamptz | Yes | NULL | Integrity verification |
| deleted_at | timestamptz | Yes | NULL | Physical deletion marker |

# 37. Storage Object Lifecycle

    PENDING
       |
       v
    UPLOADING
       |
       v
    AVAILABLE
       |
       +----> QUARANTINED
       |
       +----> DELETING
       |
       v
    DELETED

# 38. Storage Object DDL

    CREATE TYPE artifact.storage_object_status AS ENUM (
        'PENDING',
        'UPLOADING',
        'AVAILABLE',
        'QUARANTINED',
        'DELETING',
        'DELETED'
    );

    CREATE TABLE artifact.storage_objects (
        storage_object_id UUID PRIMARY KEY,
        artifact_version_id UUID NOT NULL,
        provider VARCHAR(64) NOT NULL,
        bucket VARCHAR(255) NOT NULL,
        object_key VARCHAR(1024) NOT NULL,
        content_type VARCHAR(255)
            NOT NULL DEFAULT 'application/octet-stream',
        size_bytes BIGINT NOT NULL,
        etag VARCHAR(256) NULL,
        checksum_digest VARCHAR(256) NULL,
        status artifact.storage_object_status
            NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        uploaded_at TIMESTAMPTZ NULL,
        verified_at TIMESTAMPTZ NULL,
        deleted_at TIMESTAMPTZ NULL,
        CONSTRAINT storage_objects_version_fk
            FOREIGN KEY (artifact_version_id)
            REFERENCES artifact.artifact_versions(artifact_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT storage_objects_unique
            UNIQUE (provider, bucket, object_key),
        CONSTRAINT storage_objects_size_check
            CHECK (size_bytes > 0)
    );

# 39. Storage Object Indexes

Recommended:

    INDEX (artifact_version_id, status)

    INDEX (status)

    INDEX (created_at)

    INDEX (deleted_at)

# 40. Compatibility Records

Compatibility records preserve the result of validating an Artifact Version
against a Platform Version.

They are evidence, not the source of truth for current platform definitions.

# 41. `artifact.compatibility_records` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| compatibility_record_id | uuid | No | UUIDv7 | Record ID |
| artifact_version_id | uuid | No | None | Artifact Version |
| platform_id | uuid | No | None | Tested Platform |
| platform_version_id | uuid | Yes | NULL | Tested Version |
| architecture_id | uuid | Yes | NULL | Tested Architecture |
| status | compatibility_status | No | `PENDING` | Compatibility result |
| checked_runtime_version | varchar(64) | Yes | NULL | Runtime tested |
| checked_sdk_version | varchar(64) | Yes | NULL | SDK tested |
| required_capabilities | jsonb | No | `'[]'` | Required capabilities |
| missing_capabilities | jsonb | No | `'[]'` | Missing capabilities |
| details | jsonb | No | `'{}'` | Validation details |
| checked_at | timestamptz | Yes | NULL | Check time |
| checker_version | varchar(64) | Yes | NULL | Validator version |
| created_at | timestamptz | No | `now()` | Creation |

# 42. Compatibility Status

Initial values:

    PENDING
    COMPATIBLE
    INCOMPATIBLE
    UNKNOWN

# 43. Compatibility DDL

    CREATE TYPE artifact.compatibility_status AS ENUM (
        'PENDING',
        'COMPATIBLE',
        'INCOMPATIBLE',
        'UNKNOWN'
    );

    CREATE TABLE artifact.compatibility_records (
        compatibility_record_id UUID PRIMARY KEY,
        artifact_version_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        platform_version_id UUID NULL,
        architecture_id UUID NULL,
        status artifact.compatibility_status
            NOT NULL DEFAULT 'PENDING',
        checked_runtime_version VARCHAR(64) NULL,
        checked_sdk_version VARCHAR(64) NULL,
        required_capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
        missing_capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
        details JSONB NOT NULL DEFAULT '{}'::jsonb,
        checked_at TIMESTAMPTZ NULL,
        checker_version VARCHAR(64) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT compatibility_version_fk
            FOREIGN KEY (artifact_version_id)
            REFERENCES artifact.artifact_versions(artifact_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT compatibility_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT compatibility_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT compatibility_architecture_fk
            FOREIGN KEY (architecture_id)
            REFERENCES platform.architectures(architecture_id)
            ON DELETE RESTRICT,
        CONSTRAINT compatibility_required_array_check
            CHECK (jsonb_typeof(required_capabilities) = 'array'),
        CONSTRAINT compatibility_missing_array_check
            CHECK (jsonb_typeof(missing_capabilities) = 'array'),
        CONSTRAINT compatibility_details_object_check
            CHECK (jsonb_typeof(details) = 'object')
    );

# 44. Compatibility Indexes

Recommended:

    INDEX (
        artifact_version_id,
        platform_id,
        platform_version_id
    )

    INDEX (platform_id, platform_version_id, status)

    INDEX (status, checked_at)

# 45. Validation Records

Validation records provide durable evidence for the Artifact validation
pipeline.

Validation may include:

- manifest validation;
- package structure;
- checksum;
- signature;
- format;
- architecture;
- platform compatibility;
- runtime;
- SDK;
- capabilities;
- policy;
- malware/security scanning.

# 46. `artifact.validation_records` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| validation_record_id | uuid | No | UUIDv7 | Validation ID |
| artifact_version_id | uuid | No | None | Artifact Version |
| validation_type | validation_type | No | None | Validation category |
| status | validation_status | No | `PENDING` | Result |
| validator_version | varchar(64) | Yes | NULL | Validator version |
| error_code | varchar(128) | Yes | NULL | Stable error |
| message | varchar(2000) | Yes | NULL | Human-readable result |
| details | jsonb | No | `'{}'` | Structured evidence |
| started_at | timestamptz | Yes | NULL | Start |
| completed_at | timestamptz | Yes | NULL | Completion |
| created_at | timestamptz | No | `now()` | Record creation |

# 47. Validation Types

Initial:

    FORMAT
    MANIFEST
    CHECKSUM
    SIGNATURE
    STORAGE
    ARCHITECTURE
    PLATFORM
    RUNTIME
    SDK
    CAPABILITY
    POLICY
    SECURITY

# 48. Validation Status

Initial:

    PENDING
    RUNNING
    PASSED
    FAILED
    SKIPPED

# 49. Validation DDL

    CREATE TYPE artifact.validation_type AS ENUM (
        'FORMAT',
        'MANIFEST',
        'CHECKSUM',
        'SIGNATURE',
        'STORAGE',
        'ARCHITECTURE',
        'PLATFORM',
        'RUNTIME',
        'SDK',
        'CAPABILITY',
        'POLICY',
        'SECURITY'
    );

    CREATE TYPE artifact.validation_status AS ENUM (
        'PENDING',
        'RUNNING',
        'PASSED',
        'FAILED',
        'SKIPPED'
    );

    CREATE TABLE artifact.validation_records (
        validation_record_id UUID PRIMARY KEY,
        artifact_version_id UUID NOT NULL,
        validation_type artifact.validation_type NOT NULL,
        status artifact.validation_status NOT NULL DEFAULT 'PENDING',
        validator_version VARCHAR(64) NULL,
        error_code VARCHAR(128) NULL,
        message VARCHAR(2000) NULL,
        details JSONB NOT NULL DEFAULT '{}'::jsonb,
        started_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT validation_records_version_fk
            FOREIGN KEY (artifact_version_id)
            REFERENCES artifact.artifact_versions(artifact_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT validation_records_details_check
            CHECK (jsonb_typeof(details) = 'object'),
        CONSTRAINT validation_records_time_check
            CHECK (
                completed_at IS NULL
                OR started_at IS NULL
                OR completed_at >= started_at
            )
    );

# 50. Validation Indexes

Recommended:

    INDEX (artifact_version_id, validation_type)

    INDEX (artifact_version_id, status)

    INDEX (status, created_at)

# 51. Validation State Machine

The aggregate validation state is:

    CREATED
       |
    UPLOADING
       |
    UPLOADED
       |
    VALIDATING
       |
    +--+--------------------+
    |                       |
    v                       v
    ACCEPTED              REJECTED
    |
    +--> REVOKED
    |
    +--> EXPIRED
    |
    +--> RETIRED

All mandatory validation records must pass before `ACCEPTED`.

# 52. Required Validation Gate

At minimum:

    Format
      +
    Manifest
      +
    Storage Integrity
      +
    Checksum
      +
    Signature
      +
    Architecture
      +
    Platform Compatibility
      +
    Runtime Compatibility
      +
    SDK Compatibility
      +
    Capability Compatibility
      +
    Security / Policy
      |
      v
    ACCEPTED

# 53. Validation Failure

If any mandatory validation fails:

    Artifact Version
          |
          v
       REJECTED

The error code must be stable and machine-readable.

Examples:

    ARTIFACT_INVALID
    ARTIFACT_DIGEST_MISMATCH
    ARTIFACT_SIGNATURE_INVALID
    ARTIFACT_RUNTIME_UNSUPPORTED
    ARTIFACT_SDK_UNSUPPORTED
    ARTIFACT_CAPABILITY_MISSING
    ARTIFACT_INCOMPATIBLE
    ARTIFACT_REJECTED

# 54. Artifact Upload Flow

    Studio
      |
    Create Artifact Version
      |
    Request Upload
      |
    Storage Object PENDING
      |
    Upload .krv
      |
    Storage Object AVAILABLE
      |
    Verify Size / Digest
      |
    Artifact Version UPLOADED
      |
    Validation Pipeline
      |
    ACCEPTED / REJECTED

# 55. Artifact Upload Boundary

The upload service receives:

- artifact package;
- manifest;
- metadata;
- digest;
- signature.

It must not require:

- source files;
- Git history;
- local build directory;
- development workspace.

# 56. Artifact Manifest Example

    {
        "format": "krv",
        "schema_version": "1.0",
        "artifact": {
            "name": "vision-controller",
            "version": "1.2.0"
        },
        "target": {
            "platform": "humanoid-a",
            "platform_version": "1.0",
            "architecture": "arm64"
        },
        "runtime": {
            "kritva_version": "1.0"
        },
        "sdk": {
            "version": "1.0"
        },
        "entrypoint": "bin/vision_controller",
        "required_capabilities": [
            "camera",
            "imu"
        ]
    }

# 57. Artifact Storage Layout

Logical object layout should avoid exposing customer source information.

Conceptual key:

    artifacts/
      <organization_id>/
        <artifact_id>/
          <artifact_version_id>/
            package.krv

The exact object-store provider remains implementation-neutral.

# 58. Storage Security

Artifact objects must:

- use encryption at rest;
- use TLS in transit;
- use least-privilege access;
- avoid public access;
- use server-generated storage keys;
- support lifecycle policies;
- support integrity verification.

# 59. Storage Object Authority

Object storage owns binary bytes.

PostgreSQL owns:

- object identity;
- object location;
- digest;
- size;
- storage state;
- lifecycle metadata.

An object is not considered executable solely because the object exists.

# 60. Object Orphan Handling

The system must detect:

- database record without object;
- object without database record;
- incomplete object;
- unexpected object size;
- digest mismatch.

Orphan handling is reconciled through a background process.

# 61. Artifact Digest

The Artifact Version must have a canonical cryptographic digest.

Recommended default:

    SHA-256

The digest must cover a deterministic artifact representation.

The exact canonicalization rule must be defined before production acceptance.

# 62. Digest Verification

Verification compares:

    Local declared digest
          |
          +
    Uploaded object digest
          |
          v
    Expected == Actual

Mismatch:

    ARTIFACT_DIGEST_MISMATCH
        |
        v
    REJECTED / QUARANTINED

# 63. Signature Verification

The validation service resolves:

    key_id
       |
    trusted public key
       |
    signed digest
       |
    signature
       |
    verification

A private key must never be sent to the RaaS backend.

# 64. Signature Revocation

A previously valid signature may become unusable due to:

- key compromise;
- key revocation;
- certificate expiration;
- policy change.

Artifact acceptance may therefore be invalidated by a later security policy.

# 65. Compatibility Evaluation

Compatibility evaluates:

    Artifact
       |
       +-- Architecture
       +-- Platform
       +-- Platform Version
       +-- Runtime
       +-- SDK
       +-- Required Capabilities
       |
       v
    Resource
       |
       v
    Compatible / Incompatible

# 66. Compatibility Evidence

Compatibility records must identify:

- Artifact Version;
- Platform;
- Platform Version;
- Architecture;
- runtime checked;
- SDK checked;
- required capabilities;
- missing capabilities;
- checker version;
- check timestamp.

# 67. Compatibility Cache

Compatibility records may be reused when:

- Artifact Version is immutable;
- Platform Version is unchanged;
- compatibility policy version is unchanged.

If the compatibility checker changes materially, records should be
recomputed.

# 68. Compatibility Invalidation

Previously compatible artifacts may require revalidation when:

- platform version is retired;
- capability semantics change;
- runtime security policy changes;
- compatibility rules change;
- signing policy changes.

# 69. Artifact Version Immutability

After `ACCEPTED`:

- binary cannot change;
- manifest cannot change;
- checksum cannot change;
- signature target cannot change;
- compatibility requirements cannot change.

A new version is required for any content change.

# 70. Artifact Version Promotion

Promotion is:

    CREATED
      |
    UPLOADED
      |
    VALIDATING
      |
    ACCEPTED

No direct client operation may set:

    ACCEPTED

Acceptance is a server-side validation result.

# 71. Artifact Revocation

Revocation is an administrative/security action.

Flow:

    ACCEPTED
       |
    Security / Policy Event
       |
    REVOKE
       |
    REVOKED

Revoked artifacts cannot be used for new deployments.

Existing Runs require explicit reconciliation.

# 72. Artifact Expiration

Expiration may be based on:

- retention policy;
- subscription policy;
- temporary artifact policy;
- security policy.

Expired artifacts remain historically identifiable but are not executable.

# 73. Artifact Retirement

Retirement is a normal lifecycle action for artifacts that should no longer
be selected.

Retirement differs from revocation:

- retirement = planned lifecycle;
- revocation = security/policy block.

# 74. Artifact Deletion

Deletion must be controlled by retention policy.

Before physical object deletion:

1. verify no active Job depends on it;
2. verify retention period;
3. verify legal hold;
4. verify audit requirements;
5. mark storage object `DELETING`;
6. delete object;
7. mark object `DELETED`;
8. preserve required metadata/history.

# 75. Artifact Retention

Initial policy direction:

| Data | Retention |
|---|---|
| Artifact identity | Long-term / policy |
| Artifact Version metadata | Long-term / policy |
| Accepted artifact metadata | Long-term |
| Rejected artifact metadata | Policy-based |
| Manifest | Long-term / policy |
| Checksums | Long-term |
| Signatures | Long-term / security policy |
| Compatibility records | Policy / recomputable |
| Validation records | Long-term / policy |
| Artifact binary | Policy-based |
| Object metadata | Long-term while referenced |
| Deleted object marker | Policy-based |

# 76. Artifact Retention Principle

Metadata and historical evidence may outlive the binary object.

Therefore:

    Artifact Metadata
          |
          | may remain
          v
    Object Binary
          |
          | may be deleted later
          v
    Historical Record

This preserves auditability without requiring indefinite binary retention.

# 77. Tenant Retention

Organization-level policy may define artifact retention.

Project-level retention may further constrain eligible result-related data.

Global security and legal policies override customer preferences where
required.

# 78. Artifact Privacy

Artifacts may contain customer intellectual property.

Controls must include:

- tenant isolation;
- private object storage;
- access logging;
- encryption;
- signed access URLs where required;
- limited download authorization;
- retention policies;
- audit.

# 79. Artifact Download

Artifact downloads must require authorization.

A user must have:

- valid Organization membership;
- Project access;
- Artifact access.

The server must never expose storage credentials directly.

# 80. Deployment Download

Lab Agents should retrieve artifacts using short-lived, authorized access.

The Lab Agent should not receive:

- customer credentials;
- object-store root credentials.

# 81. Artifact Access Flow

    User / Lab Agent
          |
    Authorization
          |
    Artifact State Check
          |
    Storage Object Check
          |
    Short-Lived Access
          |
    Download
          |
    Digest Verification

# 82. Artifact Authorization

Access should be denied if:

- Artifact is deleted;
- Artifact Version is revoked;
- Artifact Version is expired;
- Organization is unauthorized;
- Project is unauthorized;
- Job does not reference the Artifact;
- Lab Agent is not authorized.

# 83. Project Relationship

Each Artifact belongs to one Project.

The relationship is:

    project.projects
          |
          +-- 1:N --> artifact.artifacts
                            |
                            +-- 1:N --> artifact_versions

# 84. Organization Relationship

Artifact ownership is Organization-based.

The Organization ID is retained directly to support:

- tenant filtering;
- authorization;
- indexing;
- export;
- deletion;
- analytics.

# 85. Platform Relationship

Artifact Versions may declare:

- Platform;
- Platform Version;
- Architecture.

The Platform domain remains authoritative.

# 86. Build Relationship

Build metadata is owned by Build.

A future Build table may reference:

    artifact_version_id

The Artifact schema does not own compiler state.

# 87. Booking Relationship

Bookings may reference an Artifact Version through Jobs.

The Artifact does not own Booking state.

# 88. Execution Relationship

The expected relation is:

    Artifact Version
          |
          v
        Job
          |
          v
         Run

A Job must reference an `ACCEPTED` Artifact Version.

# 89. Result Relationship

Results belong to Runs.

Artifact metadata remains available to explain which executable package
produced a result.

# 90. Audit Relationship

Artifact lifecycle events are recorded by the Audit domain.

The Artifact schema stores operational timestamps but does not replace the
immutable audit log.

# 91. Example Artifact Row

    artifact_id:
      0194c7d0-8b00-7abc-9def-623456789001

    organization_id:
      0194c7d0-8b00-7abc-9def-223456789001

    project_id:
      0194c7d0-8b00-7abc-9def-323456789001

    artifact_key:
      vision-controller

    name:
      Vision Controller

    status:
      ACTIVE

# 92. Example Artifact Version

    artifact_version_id:
      0194c7d0-8b00-7abc-9def-623456789002

    artifact_id:
      0194c7d0-8b00-7abc-9def-623456789001

    version:
      1.2.0

    status:
      ACCEPTED

    format:
      krv

    architecture:
      arm64

    platform:
      humanoid-a

# 93. Example Storage Object

    storage_object_id:
      0194c7d0-8b00-7abc-9def-623456789003

    artifact_version_id:
      0194c7d0-8b00-7abc-9def-623456789002

    object_key:
      artifacts/0194.../0194.../package.krv

    content_type:
      application/vnd.kritva.krv

    status:
      AVAILABLE

# 94. Example Checksum

    artifact_version_id:
      0194c7d0-8b00-7abc-9def-623456789002

    scope:
      ARTIFACT

    algorithm:
      SHA256

    digest:
      4e3f5f8b9a0f...

    verification_status:
      VALID

# 95. Example Signature

    signature_id:
      0194c7d0-8b00-7abc-9def-623456789004

    signature_type:
      PACKAGE

    algorithm:
      Ed25519

    key_id:
      kritva-signing-key-2026-01

    status:
      VALID

# 96. Example Compatibility Record

    artifact_version_id:
      0194c7d0-8b00-7abc-9def-623456789002

    platform_id:
      0194c7d0-8b00-7abc-9def-523456789001

    platform_version_id:
      0194c7d0-8b00-7abc-9def-523456789002

    status:
      COMPATIBLE

# 97. Example Validation Records

    FORMAT       -> PASSED
    MANIFEST     -> PASSED
    STORAGE      -> PASSED
    CHECKSUM     -> PASSED
    SIGNATURE    -> PASSED
    ARCHITECTURE -> PASSED
    PLATFORM     -> PASSED
    RUNTIME      -> PASSED
    SDK          -> PASSED
    CAPABILITY   -> PASSED
    POLICY       -> PASSED
    SECURITY     -> PASSED

# 98. Complete Artifact Relationship Diagram

    organization.organizations
              |
              v
       project.projects
              |
              v
       artifact.artifacts
              |
              v
     artifact_versions
        |       |       |
        |       |       +--> storage_objects
        |       |
        |       +----------> manifests
        |
        +-----------------> checksums
        |
        +-----------------> signatures
        |
        +-----------------> compatibility_records
        |
        +-----------------> validation_records

# 99. Platform Relationship Diagram

    artifact_versions
          |
          +----> platform.platforms
          |
          +----> platform.platform_versions
          |
          +----> platform.architectures

# 100. Execution Relationship Diagram

    Project
       |
    Artifact
       |
    Artifact Version
       |
    Compatibility
       |
    Booking
       |
    Job
       |
    Run
       |
    Result

# 101. Repository Interfaces

Recommended:

    ArtifactRepository
    ArtifactVersionRepository
    ManifestRepository
    ChecksumRepository
    SignatureRepository
    CompatibilityRepository
    ValidationRepository
    StorageObjectRepository

# 102. Artifact Repository

Operations:

    create
    get_by_id
    get_by_key
    list_by_project
    update_metadata
    archive
    restore
    delete

# 103. Artifact Version Repository

Operations:

    create
    get
    list_by_artifact
    get_accepted
    transition_state
    revoke
    expire
    retire

# 104. Manifest Repository

Operations:

    create
    get
    validate
    get_canonical_digest

Manifest updates after acceptance are prohibited.

# 105. Checksum Repository

Operations:

    create
    get
    verify
    list_for_version

# 106. Signature Repository

Operations:

    create
    verify
    revoke
    list_for_version

Private keys are never exposed through this interface.

# 107. Compatibility Repository

Operations:

    create
    get_latest
    list_for_version
    invalidate
    record_result

# 108. Validation Repository

Operations:

    create
    start
    complete
    fail
    list_for_version
    get_summary

# 109. Storage Repository

Operations:

    create_pending
    mark_uploading
    mark_available
    mark_quarantined
    mark_deleting
    mark_deleted
    reconcile

# 110. Application Services

Recommended services:

    ArtifactService
    ArtifactVersionService
    ArtifactUploadService
    ArtifactValidationService
    ArtifactCompatibilityService
    ArtifactSignatureService
    ArtifactRetentionService
    ArtifactAccessService

# 111. Artifact Registration Interface

Conceptual operation:

    createArtifact(
        organization_id,
        project_id,
        artifact_key,
        name
    )

The service validates:

- Organization access;
- Project existence;
- Project lifecycle;
- duplicate artifact key.

# 112. Version Registration Interface

Conceptual:

    createArtifactVersion(
        artifact_id,
        version,
        manifest,
        digest,
        signature
    )

The resulting Version begins in:

    CREATED

# 113. Upload Interface

Conceptual:

    beginUpload(
        artifact_version_id
    )

returns an upload session or equivalent short-lived upload authorization.

The service creates the Storage Object in `PENDING`.

# 114. Upload Completion

Conceptual:

    completeUpload(
        artifact_version_id,
        size_bytes,
        digest
    )

The server verifies:

- expected object;
- uploaded size;
- object existence;
- digest;
- storage status.

# 115. Validation Interface

Conceptual:

    validateArtifact(
        artifact_version_id
    )

The operation is asynchronous.

Response:

    ACCEPTED

does not mean:

    ACCEPTED Artifact Version

It means the validation operation has been accepted for processing.

The distinction follows the standard protocol response semantics.

# 116. Validation Completion

When all mandatory checks pass:

    Artifact Version
        VALIDATING
             |
             v
          ACCEPTED

Otherwise:

    VALIDATING
        |
        v
      REJECTED

# 117. Artifact Access Interface

Conceptual:

    authorizeArtifactDownload(
        user_id,
        artifact_version_id
    )

The service evaluates:

- tenant;
- project membership;
- artifact lifecycle;
- version lifecycle;
- policy;
- audit requirements.

# 118. Artifact Revocation Interface

Conceptual:

    revokeArtifactVersion(
        artifact_version_id,
        reason
    )

This is an administrative/security operation.

It must be audited.

# 119. Artifact Retention Interface

Conceptual:

    evaluateRetention(
        artifact_version_id
    )

The service determines:

- retention expiration;
- legal hold;
- active references;
- deletion eligibility.

# 120. Transactional Boundaries

Artifact creation should be transactional for:

    Artifact
    +
    initial Version metadata

Upload storage is an external side effect.

Therefore:

    Database transaction
          |
    Pending Storage Object
          |
    External Upload
          |
    Verification
          |
    Database transition

Reconciliation is required if the process fails between steps.

# 121. Idempotency

The following operations require idempotency:

- artifact creation where externally retried;
- version creation;
- upload completion;
- validation dispatch;
- signature verification;
- revocation;
- retention deletion.

Idempotency follows the system-wide database ADR.

# 122. Outbox

Artifact state changes that require durable events should use the transactional
outbox pattern.

Example:

    BEGIN
      UPDATE artifact_version
      SET status = 'ACCEPTED';

      INSERT outbox_event (...);
    COMMIT

The event publisher then emits:

    artifact.accepted

# 123. Artifact Events

Recommended:

    artifact.created
    artifact.updated
    artifact.archived
    artifact.deleted

    artifact.version.created
    artifact.uploading
    artifact.uploaded
    artifact.validating
    artifact.accepted
    artifact.rejected
    artifact.revoked
    artifact.expired
    artifact.retired

    artifact.validation.started
    artifact.validation.completed
    artifact.validation.failed

    artifact.compatibility.checked
    artifact.signature.verified
    artifact.storage.available
    artifact.storage.quarantined

# 124. Event Payload

Conceptual event:

    {
        "protocol_version": "1.0",
        "event_id": "evt-12345",
        "timestamp": "2026-10-08T00:00:02Z",
        "event": "artifact.accepted",
        "resource": {
            "type": "artifact_version",
            "id": "0194..."
        },
        "context": {
            "organization_id": "0194...",
            "project_id": "0194..."
        },
        "sequence": 8,
        "data": {
            "artifact_id": "0194...",
            "artifact_version_id": "0194..."
        }
    }

# 125. Audit Requirements

Audit must capture:

- artifact creation;
- version creation;
- upload;
- validation;
- acceptance;
- rejection;
- revocation;
- download;
- retention deletion;
- signature operations;
- administrative override.

Audit records must identify:

- actor;
- organization;
- project;
- artifact;
- version;
- operation;
- timestamp;
- result.

# 126. Security Scanning

Security validation may include:

- package policy;
- prohibited files;
- executable policy;
- dependency metadata;
- malware scanning;
- signature verification;
- manifest consistency.

Security scanning implementation remains separate from relational schema.

# 127. Local Artifact Validation

Studio should validate before upload:

- format;
- manifest;
- architecture;
- platform;
- SDK;
- runtime;
- required capabilities;
- checksum;
- signature.

Remote validation remains mandatory.

Local validation is an optimization and early-error mechanism, not a trust
boundary.

# 128. Remote Artifact Validation

RaaS must independently validate the artifact because:

- client validation is untrusted;
- policy may change;
- server platform definitions are authoritative;
- storage integrity must be confirmed;
- signatures must be checked against trusted keys.

# 129. Artifact Size

`size_bytes` must be positive.

The product must establish a maximum accepted `.krv` size.

The database stores actual size.

The API and object-storage layer enforce maximum limits.

# 130. Storage Provider Abstraction

The Artifact domain must use a provider-neutral interface:

    ObjectStorage
        |
        +-- put
        +-- get
        +-- head
        +-- delete
        +-- exists
        +-- checksum
        +-- signed_access

The database stores the provider reference but application code should not
depend directly on a specific cloud vendor.

# 131. Storage Consistency

A database record of `AVAILABLE` requires successful object verification.

A storage object without authoritative database metadata is considered an
orphan until reconciliation determines ownership.

# 132. Reconciliation

Artifact reconciliation must detect:

    DB record + missing object
    DB record + wrong object size
    DB record + digest mismatch
    object + missing DB record
    UPLOADING object + stale session
    DELETING object + failed deletion

Reconciliation must be safe and idempotent.

# 133. Database Migration Ordering

Recommended:

    1. artifact schema
    2. artifact enums
    3. artifacts
    4. artifact_versions
    5. manifests
    6. checksums
    7. signatures
    8. storage_objects
    9. compatibility_records
    10. validation_records
    11. indexes
    12. tenant-aware constraints
    13. outbox integration

# 134. Phase 0 Mapping

Phase 0 establishes:

- Artifact domain ownership;
- PostgreSQL authority;
- UUIDv7;
- Object Storage boundary;
- no-source-code rule;
- repository/application-service boundaries;
- retention principles.

# 135. Phase 1 Mapping

Phase 1 establishes:

- Organization ownership;
- Project ownership;
- tenant isolation;
- artifact authorization.

# 136. Phase 2 Mapping

Phase 2 implements:

- Artifact identity;
- Artifact Versions;
- Manifest;
- Storage Object;
- basic upload;
- local artifact integration.

# 137. Phase 3 Mapping

Phase 3 integrates:

- Artifact with Jobs;
- Artifact state transitions;
- idempotency;
- reconciliation;
- deployment eligibility.

# 138. Phase 4 Mapping

Phase 4 integrates:

- Artifact with platform-specific booking;
- credit-controlled execution;
- artifact eligibility before booking/execution where appropriate.

# 139. Phase 5 Mapping

Phase 5 is the primary remote execution integration:

- upload;
- validation;
- compatibility;
- signature;
- Lab Agent retrieval;
- deployment;
- Job execution.

# 140. Phase 6 Mapping

Phase 6 integrates:

- physical robot compatibility;
- resource configuration;
- runtime compatibility;
- operational artifact policy.

# 141. Phase 7 Mapping

Phase 7 integrates:

- Results;
- Experiments;
- audit;
- artifact provenance;
- event persistence;
- analytics.

# 142. Phase 8 Mapping

Phase 8 completes:

- artifact retention;
- object lifecycle;
- deletion;
- privacy;
- backup/restore;
- security hardening;
- key/signature policy;
- performance and capacity.

# 143. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Source code uploaded accidentally | Critical | Artifact-only contract and validation |
| Malicious artifact | Critical | Signature/security/policy validation |
| Digest mismatch | Critical | Cryptographic verification |
| Invalid signature | Critical | Trusted-key validation |
| Wrong platform | Critical | Compatibility validation |
| Wrong architecture | Critical | Manifest + platform validation |
| Object orphan | High | Reconciliation |
| DB/object inconsistency | High | State machine + reconciliation |
| Artifact mutation | Critical | Immutable accepted versions |
| Tenant data exposure | Critical | Organization + Project authorization |
| Premature deletion | High | Retention checks |
| Revoked artifact execution | Critical | Job admission check |
| Expired artifact execution | High | Runtime admission validation |
| Storage outage | High | Retry/reconciliation |
| Key compromise | Critical | Key revocation |
| Oversized artifact | Medium | API/storage limits |
| Metadata abuse | Medium | Bounded JSONB |

# 144. Open Questions

1. Final `.krv` binary specification.
2. Final manifest JSON Schema.
3. Final canonical artifact digest algorithm.
4. Whether SHA-256 alone is sufficient or SHA-512 is required.
5. Final signing algorithm.
6. Final public-key trust model.
7. Final key rotation model.
8. Final artifact size limit.
9. Final artifact retention period.
10. Final rejected-artifact retention.
11. Final compatibility checker versioning policy.
12. Final security scanner implementation.
13. Final malware scanning requirement.
14. Final object-store lifecycle policy.
15. Final signed download mechanism.
16. Whether customer signing keys are supported.
17. Whether Kritva signing is mandatory.
18. Whether multiple signatures are mandatory.
19. Final artifact version naming policy.
20. Whether artifact versions must use semantic versioning.
21. Final object key naming scheme.
22. Final legal-hold integration.
23. Final artifact export behavior.
24. Final cross-region object replication policy.
25. Final artifact cache policy at Labs.

# 145. Acceptance Criteria — Artifact Identity

- [ ] `artifact` schema exists.
- [ ] `artifacts` table exists.
- [ ] Artifact UUIDv7 is implemented.
- [ ] Organization ownership is mandatory.
- [ ] Project ownership is mandatory.
- [ ] Artifact key is unique within Project.
- [ ] Artifact lifecycle is implemented.
- [ ] Artifact metadata is bounded JSONB.
- [ ] Creation actor is recorded.
- [ ] Update actor is recorded.
- [ ] Archive/delete timestamps are consistent.

# 146. Acceptance Criteria — Artifact Versions

- [ ] Artifact Versions exist.
- [ ] Each Version references an Artifact.
- [ ] `(artifact_id, version)` is unique.
- [ ] Version lifecycle is implemented.
- [ ] Accepted versions are immutable.
- [ ] Architecture is represented.
- [ ] Platform is represented.
- [ ] Platform Version is represented.
- [ ] Runtime requirement is represented.
- [ ] SDK requirement is represented.
- [ ] Entrypoint is represented where required.
- [ ] Size is recorded.
- [ ] Acceptance/rejection/revocation timestamps are recorded.

# 147. Acceptance Criteria — Manifest

- [ ] Manifest table exists.
- [ ] One canonical manifest exists per Artifact Version.
- [ ] Manifest schema version is stored.
- [ ] Manifest is JSONB.
- [ ] Manifest is an object.
- [ ] Canonical digest is stored.
- [ ] Manifest validation status is stored.
- [ ] Validated manifest is immutable.
- [ ] Manifest does not contain customer source code.

# 148. Acceptance Criteria — Checksums

- [ ] Checksum records exist.
- [ ] Artifact checksum is supported.
- [ ] Manifest checksum is supported.
- [ ] Object checksum is supported.
- [ ] SHA-256 is supported.
- [ ] SHA-512 is optionally supported.
- [ ] Verification state is stored.
- [ ] Digest mismatch causes rejection/quarantine.
- [ ] Duplicate checksum scope/algorithm is prevented.

# 149. Acceptance Criteria — Signatures

- [ ] Signature records exist.
- [ ] Signature type is constrained.
- [ ] Algorithm is recorded.
- [ ] Key ID is recorded.
- [ ] Signature value is stored securely.
- [ ] Signed digest is recorded.
- [ ] Verification status is stored.
- [ ] Signature revocation is supported.
- [ ] Private signing keys are never stored in PostgreSQL.

# 150. Acceptance Criteria — Storage

- [ ] Storage Object records exist.
- [ ] Binary is stored outside PostgreSQL.
- [ ] Storage provider is abstracted.
- [ ] Bucket/container is recorded.
- [ ] Object key is recorded.
- [ ] Size is recorded.
- [ ] Digest is recorded.
- [ ] Upload state is recorded.
- [ ] Object state is reconciled.
- [ ] Public object access is disabled.
- [ ] Object lifecycle is policy controlled.

# 151. Acceptance Criteria — Compatibility

- [ ] Compatibility records exist.
- [ ] Platform is recorded.
- [ ] Platform Version is recorded.
- [ ] Architecture is recorded.
- [ ] Runtime is checked.
- [ ] SDK is checked.
- [ ] Required capabilities are recorded.
- [ ] Missing capabilities are recorded.
- [ ] Compatibility checker version is recorded.
- [ ] Compatible/incompatible result is durable.
- [ ] Compatibility can be recomputed after policy changes.

# 152. Acceptance Criteria — Validation

- [ ] Validation records exist.
- [ ] All required validation categories are represented.
- [ ] Validation lifecycle is represented.
- [ ] Validator version is recorded.
- [ ] Error code is stable.
- [ ] Validation evidence is retained.
- [ ] Mandatory failures reject the Artifact Version.
- [ ] Acceptance occurs only after all mandatory checks pass.
- [ ] Validation is server-side authoritative.
- [ ] Validation operations are idempotent.

# 153. Acceptance Criteria — State Machine

- [ ] Artifact Version starts in CREATED.
- [ ] Upload state is represented.
- [ ] Uploaded state is represented.
- [ ] Validation state is represented.
- [ ] Accepted state is protected.
- [ ] Rejected state is represented.
- [ ] Revoked state is represented.
- [ ] Expired state is represented.
- [ ] Retired state is represented.
- [ ] Invalid state transitions are rejected.

# 154. Acceptance Criteria — Source Boundary

- [ ] No source-code column exists.
- [ ] No Git repository field exists.
- [ ] No source archive is accepted.
- [ ] `.krv` is the execution boundary.
- [ ] Local build remains the normal build path.
- [ ] Remote build is not required.
- [ ] Manifest cannot be used to smuggle arbitrary source archives.
- [ ] Artifact policy rejects prohibited content where required.

# 155. Acceptance Criteria — Tenancy

- [ ] Every Artifact belongs to one Organization.
- [ ] Every Artifact belongs to one Project.
- [ ] Project Organization and Artifact Organization match.
- [ ] Artifact access checks Organization Membership.
- [ ] Artifact access checks Project authorization.
- [ ] Cross-tenant artifact queries fail.
- [ ] Object access is tenant-authorized.
- [ ] Storage keys cannot be guessed to bypass authorization.

# 156. Acceptance Criteria — Execution Integration

- [ ] Jobs can reference Artifact Versions.
- [ ] Only accepted versions are deployable.
- [ ] Revoked versions are blocked.
- [ ] Expired versions are blocked.
- [ ] Platform compatibility is rechecked at execution admission.
- [ ] Resource compatibility is checked.
- [ ] Lab retrieval is authorized.
- [ ] Historical Runs preserve Artifact Version identity.

# 157. Acceptance Criteria — Retention

- [ ] Artifact retention policy exists.
- [ ] Binary retention is separate from metadata retention.
- [ ] Rejected artifacts have bounded retention.
- [ ] Accepted metadata can be retained long-term.
- [ ] Legal holds override deletion.
- [ ] Active execution references prevent premature deletion.
- [ ] Object deletion is auditable.
- [ ] Orphan cleanup is reconciled.

# 158. Acceptance Criteria — Operations

- [ ] Empty database migration succeeds.
- [ ] CI validates schema migrations.
- [ ] Object storage integration tests pass.
- [ ] Artifact upload tests pass.
- [ ] Digest verification tests pass.
- [ ] Signature verification tests pass.
- [ ] Compatibility tests pass.
- [ ] Validation pipeline tests pass.
- [ ] Reconciliation tests pass.
- [ ] Backup/restore includes Artifact metadata.
- [ ] Object recovery is tested.

# 159. Acceptance Criteria — Security

- [ ] Artifact objects are private.
- [ ] Encryption at rest is enabled.
- [ ] TLS is required.
- [ ] Artifact access is audited.
- [ ] Signing keys are externally managed.
- [ ] Signature validation is enforced.
- [ ] Revocation is enforced.
- [ ] Tenant isolation is tested.
- [ ] Unauthorized downloads are rejected.
- [ ] Security scanning policy is enforced.

# 160. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Artifact domain boundary accepted.
- [ ] Object storage boundary accepted.
- [ ] No-source-code policy accepted.
- [ ] UUIDv7 accepted.

Phase 1:

- [ ] Organization/Project tenancy integrated.
- [ ] Artifact authorization passes.

Phase 2:

- [ ] Artifact schema implemented.
- [ ] Version implemented.
- [ ] Manifest implemented.
- [ ] Storage object integration implemented.

Phase 3:

- [ ] Artifact/Job integration passes.
- [ ] Idempotency passes.
- [ ] Reconciliation passes.

Phase 4:

- [ ] Artifact eligibility integrates with Booking/Credit workflow.

Phase 5:

- [ ] Upload passes.
- [ ] Validation passes.
- [ ] Signature passes.
- [ ] Compatibility passes.
- [ ] Lab Agent download passes.
- [ ] Deployment admission passes.

Phase 6:

- [ ] Physical resource compatibility passes.
- [ ] Resource configuration compatibility passes.

Phase 7:

- [ ] Result provenance passes.
- [ ] Audit/events pass.
- [ ] Experiment integration passes.

Phase 8:

- [ ] Retention passes.
- [ ] Object lifecycle passes.
- [ ] Privacy deletion passes.
- [ ] Backup/restore passes.
- [ ] Security hardening passes.
- [ ] Production capacity passes.

# 161. Final Invariants

The following must always remain true:

1. Customer source code remains outside RaaS by default.
2. An Artifact is a logical executable package.
3. An Artifact Version is immutable after acceptance.
4. Every Artifact belongs to exactly one Organization.
5. Every Artifact belongs to exactly one Project.
6. Artifact Organization and Project Organization must match.
7. Artifact keys are unique within Project.
8. Artifact binaries are stored outside PostgreSQL.
9. PostgreSQL stores authoritative Artifact metadata.
10. Object storage stores authoritative binary bytes.
11. Storage records identify the exact binary object.
12. Checksums provide cryptographic integrity evidence.
13. Signatures provide authenticity evidence.
14. Private signing keys are never stored in the Artifact database.
15. Manifests are canonical and validated.
16. Mandatory validation must pass before acceptance.
17. Client-side validation does not replace server validation.
18. Compatibility is evaluated against authoritative Platform records.
19. Architecture compatibility is mandatory where the target requires it.
20. Runtime compatibility is validated.
21. SDK compatibility is validated.
22. Capability compatibility is validated.
23. Revoked artifacts cannot be newly deployed.
24. Expired artifacts cannot be newly deployed.
25. Retired artifacts cannot be newly deployed.
26. Historical artifact identity remains resolvable.
27. Object deletion is controlled by retention policy.
28. Legal holds override deletion.
29. Artifact access is tenant-authorized.
30. Artifact downloads are auditable.
31. Object-store credentials are never exposed to customers.
32. Lab Agents use controlled artifact access.
33. Artifact state and object state are reconciled.
34. Cross-domain writes use application services.
35. Critical Artifact operations are idempotent.
36. PostgreSQL remains authoritative for Artifact business state.
37. Physical robot safety remains outside the Artifact database.

# 162. Final Architecture Statement

> **A Kritva RaaS Artifact is the secure execution boundary between a
> customer's local development environment and remote robotic execution.
> Source code remains on the customer's machine. The customer builds and
> tests locally, packages the application as a `.krv` artifact, signs it,
> and uploads only the executable package required for remote execution.**
>
> **The Artifact schema stores durable identity, version, manifest, checksum,
> signature, compatibility, validation and storage metadata. PostgreSQL is
> authoritative for the Artifact's business state, while object storage
> holds the immutable binary payload.**
>
> **Acceptance is a server-side trust decision. It requires successful
> validation of package structure, manifest, storage integrity, checksum,
> signature, architecture, platform, runtime, SDK, capabilities and policy.
> A client cannot mark an artifact as accepted.**
>
> **Artifact compatibility is evaluated against the authoritative Platform
> catalog and the actual execution Resource. This prevents a syntactically
> valid `.krv` package from being deployed to an incompatible robotic
> platform.**
>
> **The Artifact domain deliberately remains separate from Project, Platform,
> Booking, Credit, Execution and Result domains. It provides the immutable
> executable identity that connects these domains without turning RaaS into a
> source-code hosting or remote build platform.**
>
> **This preserves the core Kritva RaaS architecture:
> Build locally → package locally → upload the artifact → validate remotely
> → book the resource → deploy → execute → observe → retain results, while
> keeping customer source code outside the RaaS control plane.**
