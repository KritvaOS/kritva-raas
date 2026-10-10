# Kritva RaaS Artifact Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Artifact Architecture |
| Path | `docs/architecture/ARTIFACT_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Artifact | `.krv` execution artifact |
| Artifact Authority | RaaS Control Plane |
| Artifact Storage | Object Storage |
| Artifact Metadata | PostgreSQL |
| Artifact Validation | Local Studio + Control Plane |
| Artifact Execution | Lab Agent + Kritva Runtime |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the architecture and lifecycle of the Kritva RaaS `.krv`
execution artifact.

The `.krv` artifact is the controlled boundary between:

- customer source code on the user's machine; and
- remote RaaS execution infrastructure.

The central architectural principle is:

> **Build locally, package locally, upload only the execution artifact, and execute remotely.**

The artifact architecture provides:

- deterministic artifact structure;
- machine-readable manifest;
- compatibility metadata;
- integrity verification;
- cryptographic signing;
- artifact lifecycle management;
- storage separation;
- validation;
- retention;
- revocation;
- execution authorization;
- source-code protection.

## 3. Scope

This document covers:

1. `.krv` format.
2. Artifact manifest.
3. Artifact payload.
4. Artifact metadata.
5. Checksums.
6. Digital signatures.
7. Compatibility metadata.
8. Local artifact generation.
9. Artifact upload.
10. Artifact registration.
11. Artifact validation.
12. Artifact storage.
13. Artifact lifecycle.
14. Artifact versioning.
15. Artifact retention.
16. Artifact revocation.
17. Artifact download.
18. Execution authorization.
19. Artifact-to-platform compatibility.
20. Artifact-to-runtime compatibility.
21. Artifact-to-SDK compatibility.
22. Artifact security.
23. Source-code privacy boundary.
24. Artifact auditability.
25. Artifact garbage collection.
26. Phase 0-8 implementation.

## 4. Goals

The artifact architecture shall:

1. Keep customer source code on the customer's machine.
2. Upload only an execution artifact.
3. Make artifact contents deterministic where practical.
4. Make artifact identity unambiguous.
5. Detect corruption.
6. Detect unauthorized modification.
7. Authenticate trusted artifact producers.
8. Validate platform compatibility.
9. Validate runtime compatibility.
10. Validate SDK compatibility.
11. Support artifact lifecycle states.
12. Support artifact revocation.
13. Support artifact retention policies.
14. Support repeatable execution.
15. Support auditability.
16. Prevent accidental source upload through the standard workflow.
17. Support future artifact format evolution.

## 5. Non-Goals

This document does not define:

- source-code compilation internals;
- complete Studio UI design;
- robot-specific application logic;
- complete runtime sandbox architecture;
- payment processing;
- booking business rules;
- detailed object-storage provider configuration.

Those concerns are defined by the relevant architecture documents.

## 6. Core Architectural Principle

The RaaS execution boundary is:

    CUSTOMER MACHINE
    ----------------
    Source
      |
      v
    Local Build
      |
      v
    Local Test
      |
      v
    Package
      |
      v
    .krv Artifact
      |
      v
    Local Validation
      |
      v
    Upload
    ----------------
          |
          | HTTPS
          v
    RAAS CONTROL PLANE
    -----------------
      |
      v
    Artifact Validation
      |
      v
    Object Storage
      |
      v
    Lab Agent
      |
      v
    Kritva Runtime
      |
      v
    Robot

Source code does not cross the normal artifact upload boundary.

## 7. Source-Code Privacy Requirement

The standard RaaS workflow SHALL NOT upload:

- source files;
- source directories;
- Git repositories;
- Git history;
- source archives;
- IDE workspaces;
- compiler source maps containing source;
- development-only source packages.

The upload operation accepts a `.krv` artifact, not a project source directory.

## 8. Source-Code-Never-Uploaded Guarantee

The architectural guarantee is defined precisely as follows:

> **The RaaS upload protocol never accepts source-code files as the execution input; the supported execution upload path accepts only a validated `.krv` artifact.**

This guarantees the product workflow does not intentionally transmit customer source.

It does not claim that a customer cannot deliberately place source text inside
an application binary, configuration file, debug section, string table, or other
artifact payload.

Therefore the system additionally uses:

- artifact manifest policy;
- payload allowlisting;
- source-file extension checks;
- package structure validation;
- optional content inspection;
- debug-symbol policy;
- artifact-size policy.

Customers remain responsible for not embedding proprietary source material into
runtime configuration or generated payloads unless required.

## 9. Artifact Definition

A `.krv` artifact is a versioned, structured, signed execution package containing
the minimum information required to deploy an application to a compatible Kritva
RaaS execution environment.

Conceptually:

    .krv
      |
      +-- Manifest
      +-- Application Payload
      +-- Runtime Dependencies
      +-- Configuration
      +-- Integrity Metadata
      +-- Signature Metadata

## 10. Artifact Properties

Every artifact has:

- artifact ID;
- artifact format version;
- application identity;
- application version;
- platform identity;
- architecture;
- operating-system/runtime requirements;
- SDK compatibility;
- protocol compatibility where applicable;
- capability requirements;
- payload metadata;
- checksums;
- signature;
- creation timestamp.

## 11. Artifact Identity

The artifact identity is distinct from:

- project ID;
- build ID;
- booking ID;
- job ID;
- run ID.

Recommended identifiers:

    project_id
    build_id
    artifact_id
    artifact_digest
    artifact_version

The artifact ID identifies the registered artifact record.

The digest identifies its immutable content.

## 12. Artifact Digest

The artifact digest is a cryptographic hash of the canonical `.krv` package.

Recommended baseline:

    SHA-256

The digest provides:

- content identity;
- corruption detection;
- deduplication support;
- auditability;
- deployment traceability.

## 13. Artifact Format

The initial `.krv` format should use a deterministic archive structure.

Conceptual structure:

    application.krv
      |
      +-- manifest.json
      +-- payload/
      |     +-- application
      |     +-- libraries/
      |     +-- resources/
      |
      +-- config/
      |     +-- runtime.json
      |
      +-- integrity/
      |     +-- checksums.json
      |
      +-- signature/
            +-- signature.json

The exact archive technology may be finalized during implementation.

## 14. Format Requirements

The format must support:

- deterministic extraction;
- safe path handling;
- explicit file ownership;
- manifest validation;
- checksum verification;
- signature verification;
- future format versions.

The runtime must reject malformed artifacts.

## 15. Canonical Packaging

Packaging should be deterministic where practical.

The packaging process should normalize:

- file ordering;
- path representation;
- metadata;
- timestamps where appropriate;
- compression settings where reproducibility requires it.

This allows the same build input to produce a predictable artifact digest.

## 16. Manifest

The manifest is the authoritative description of the artifact payload and
execution requirements.

A conceptual manifest is:

    {
        "artifact_format_version": "1",
        "artifact_id": "artifact-001",
        "application": {
            "name": "example-app",
            "version": "1.2.0"
        },
        "platform": {
            "id": "humanoid-a",
            "version": "2.0"
        },
        "architecture": "aarch64",
        "runtime": {
            "name": "kritva-runtime",
            "version": "1.0"
        },
        "sdk": {
            "name": "kritva-sdk",
            "version": "1.4"
        },
        "capabilities": [
            "camera",
            "joint_control"
        ],
        "entrypoint": "payload/application",
        "payload": {
            "size": 123456,
            "digest": "sha256:..."
        }
    }

The example is conceptual rather than a final wire schema.

## 17. Manifest Required Fields

The production manifest should contain at minimum:

| Field | Purpose |
|---|---|
| `artifact_format_version` | Format compatibility |
| `artifact_id` | Artifact identity |
| `application.name` | Application identity |
| `application.version` | Application version |
| `platform.id` | Target platform |
| `architecture` | CPU architecture |
| `runtime` | Runtime compatibility |
| `sdk` | SDK compatibility |
| `entrypoint` | Execution entrypoint |
| `capabilities` | Required capabilities |
| `payload` | Payload integrity metadata |
| `created_at` | Creation timestamp |

## 18. Optional Manifest Fields

Future fields may include:

- minimum runtime version;
- maximum runtime version;
- operating-system version;
- kernel requirements;
- ABI requirements;
- GPU requirements;
- memory requirements;
- storage requirements;
- CPU requirements;
- device requirements;
- network requirements;
- environment variables;
- execution limits;
- security profile;
- publisher identity;
- expiration;
- revocation reference.

## 19. Manifest Authority

The manifest is authoritative for artifact-declared compatibility requirements.

However, the Control Plane and Lab Agent must not blindly trust manifest claims.

They independently validate:

- signature;
- checksum;
- platform;
- runtime;
- capabilities;
- policy;
- authorization.

## 20. Payload

The payload contains executable content required for remote execution.

Examples:

- application executable;
- required shared libraries;
- runtime resources;
- static configuration;
- application assets.

The payload must contain only approved runtime material.

## 21. Payload Allowlist

The packaging tool should use an explicit allowlist.

Permitted categories may include:

- executable;
- shared library;
- configuration;
- resource;
- model;
- data required for execution.

Disallowed categories should include by default:

- source code;
- Git metadata;
- IDE files;
- build caches;
- compiler logs;
- temporary files;
- credentials;
- private keys.

## 22. Source File Detection

The local packager should reject obvious source files.

Examples:

    *.c
    *.cc
    *.cpp
    *.h
    *.hpp
    *.rs
    *.py
    *.java
    *.go
    *.sv
    *.v
    *.vhd

The final policy must be configurable because some applications may legitimately
ship interpreted resources in future releases.

## 23. Source Detection Limitation

File-extension filtering is not a cryptographic proof that no source text exists.

Therefore the architecture uses multiple controls:

1. Source directory is not an upload input.
2. Package builder allowlists runtime files.
3. Package builder rejects known source files.
4. Manifest records package contents.
5. Upload endpoint accepts `.krv`.
6. Server validates archive structure.
7. Optional content policy scanning may be enabled.
8. Production execution policy may reject non-compliant packages.

## 24. Compiler Debug Information

Debug information can unintentionally contain:

- source paths;
- symbol names;
- source references;
- line mappings.

Production packaging should therefore support:

- stripped release binaries;
- separate development symbols;
- explicit debug-build policy.

Debug symbols should not be uploaded unless a future feature explicitly requires
them.

## 25. Secrets Prohibition

The `.krv` artifact must not contain:

- cloud credentials;
- API private keys;
- user passwords;
- signing private keys;
- Lab Agent credentials;
- production database credentials.

Runtime secrets must be provisioned by the execution environment.

## 26. Configuration Separation

Configuration should be divided into:

1. Artifact configuration.
2. Environment configuration.
3. Secret configuration.

Only the first category belongs inside the `.krv` package.

## 27. Artifact Signing

Every production-executable artifact should be digitally signed.

Signing establishes:

- publisher authenticity;
- artifact integrity;
- trust;
- revocation capability.

The signature is separate from the checksum.

## 28. Checksum Versus Signature

Checksum answers:

> Did the content change?

Signature answers:

> Was this content signed by an authorized publisher and has it remained unchanged?

Both mechanisms are required.

## 29. Signing Model

Conceptually:

    Artifact
       |
       v
    Canonical Representation
       |
       v
    SHA-256 Digest
       |
       v
    Signing Key
       |
       v
    Signature
       |
       v
    Signed Artifact

## 30. Signature Metadata

Signature metadata should identify:

- signature algorithm;
- key identifier;
- signer/publisher identity;
- signed digest;
- signature;
- signing timestamp;
- signature format version.

Conceptual example:

    {
        "algorithm": "ed25519",
        "key_id": "kritva-artifact-signing-key-01",
        "digest_algorithm": "sha256",
        "artifact_digest": "sha256:...",
        "signature": "base64...",
        "signed_at": "2026-10-08T00:00:00Z"
    }

## 31. Signing Keys

Signing private keys must be protected using controlled key-management infrastructure.

Private signing keys must not be:

- committed to Git;
- embedded in Studio;
- stored in `.krv`;
- stored in CI source;
- copied to robot machines unnecessarily.

## 32. Signing Trust

The execution environment trusts configured signing authorities.

Trust should support:

- key rotation;
- key revocation;
- multiple active keys;
- old-release verification;
- emergency key invalidation.

## 33. Signature Verification

Verification occurs at multiple boundaries.

Local Studio:

    Package
      |
      v
    Sign
      |
      v
    Verify
      |
      v
    Upload

Control Plane:

    Upload
      |
      v
    Verify Signature
      |
      v
    Register

Lab Agent:

    Fetch
      |
      v
    Verify Digest
      |
      v
    Verify Signature
      |
      v
    Deploy

## 34. Trust Boundary

The artifact should not become trusted merely because it was uploaded.

Trust is established only after:

- authenticated upload;
- structural validation;
- checksum validation;
- signature validation;
- policy validation;
- compatibility validation.

## 35. Artifact Compatibility

Compatibility is evaluated against:

- platform;
- platform version;
- CPU architecture;
- operating system;
- Kritva Runtime;
- SDK;
- protocol;
- required capabilities;
- hardware resources.

## 36. Compatibility Matrix

| Artifact Requirement | Target |
|---|---|
| Platform | `humanoid-a` |
| Architecture | `aarch64` |
| Runtime | `1.x` |
| SDK | `1.x` |
| Capabilities | Camera, Motion |
| Memory | Minimum declared |
| CPU | Minimum declared |
| GPU | Optional declared requirement |
| Protocol | Supported Lab Protocol |

## 37. Compatibility Decision

The validation result should be one of:

- COMPATIBLE;
- INCOMPATIBLE;
- UNKNOWN;
- POLICY_REJECTED.

An unknown compatibility result must not silently become compatible.

## 38. Artifact Validation Pipeline

    Upload
      |
      v
    Authenticate
      |
      v
    Authorization
      |
      v
    File Type Validation
      |
      v
    Archive Structure
      |
      v
    Manifest Validation
      |
      v
    Size / Policy Checks
      |
      v
    Checksum
      |
      v
    Signature
      |
      v
    Compatibility
      |
      v
    Security Policy
      |
      v
    ACCEPTED

## 39. Local Validation

Studio should validate before upload:

- `.krv` structure;
- manifest;
- entrypoint;
- required files;
- checksums;
- signature;
- platform;
- architecture;
- runtime;
- SDK.

Local validation provides faster feedback and reduces unnecessary uploads.

## 40. Server Validation

The Control Plane independently validates all security-sensitive properties.

Client validation must never replace server validation.

The server must assume the Studio client may be compromised.

## 41. Lab Validation

The Lab Agent performs final local checks before deployment:

- artifact digest;
- signature;
- platform;
- runtime;
- available resources;
- local policy;
- resource state.

## 42. Validation Result

Validation should produce a durable record.

Example:

    artifact_validation
        artifact_id
        validator
        validator_version
        validation_time
        status
        checks
        failure_code
        details

## 43. Validation Failure

Examples:

- INVALID_ARCHIVE;
- INVALID_MANIFEST;
- UNSUPPORTED_FORMAT;
- CHECKSUM_MISMATCH;
- SIGNATURE_INVALID;
- SIGNER_UNTRUSTED;
- SOURCE_CONTENT_DETECTED;
- ARTIFACT_TOO_LARGE;
- PLATFORM_INCOMPATIBLE;
- RUNTIME_INCOMPATIBLE;
- SDK_INCOMPATIBLE;
- CAPABILITY_UNAVAILABLE;
- POLICY_REJECTED.

## 44. Artifact Upload Flow

    Studio
      |
      | artifact.create
      v
    Control Plane
      |
      | authorize upload
      v
    Upload Session
      |
      v
    Object Storage
      |
      v
    Artifact Registration
      |
      v
    Validation Worker
      |
      v
    Artifact Status

The upload authorization and artifact registration are separate logical steps.

## 45. Direct Object Upload

For large artifacts, the Control Plane may issue a short-lived upload authorization
for object storage.

Conceptually:

    Studio
      |
      v
    Create Artifact
      |
      v
    Upload Authorization
      |
      v
    Object Storage
      |
      v
    Notify / Complete Upload
      |
      v
    Validation

Studio still never uploads source files.

## 46. Upload Security

Upload authorization should be:

- short-lived;
- artifact-specific;
- tenant-scoped;
- object-key-specific;
- size-limited;
- authenticated.

The client must not be allowed to select arbitrary production object-storage paths.

## 47. Artifact Object Key

Object keys should not expose sensitive customer information.

A conceptual key:

    artifacts/{organization_id}/{artifact_id}/{digest}/artifact.krv

The exact storage layout is provider-dependent.

## 48. Artifact Storage

Object storage is authoritative for artifact binary content.

PostgreSQL is authoritative for:

- artifact metadata;
- state;
- ownership;
- validation;
- lifecycle;
- audit.

## 49. Database/Object Storage Relationship

    PostgreSQL
      |
      +-- artifact_id
      +-- digest
      +-- state
      +-- owner
      +-- metadata
      +-- object_key
      |
      v
    Object Storage
      |
      +-- artifact.krv

Neither system alone represents the complete artifact record.

## 50. Artifact Immutability

Once an artifact is accepted, its content must be immutable.

A new binary requires:

- a new artifact ID or immutable version record;
- a new digest;
- a new validation;
- a new signature.

An accepted artifact must never be silently overwritten.

## 51. Artifact Versioning

Application version and artifact version are distinct concepts.

Example:

    Application
        name = navigation-demo
        version = 2.0.0

    Artifact
        artifact_id = art-123
        format_version = 1
        digest = sha256:...

Two artifacts may contain the same application version but differ in build inputs.

## 52. Artifact Format Versioning

The artifact format itself is versioned.

Example:

    artifact_format_version = 1

A future incompatible format becomes:

    artifact_format_version = 2

Runtime support should explicitly identify supported versions.

## 53. Backward Compatibility

A newer runtime may support older artifact formats.

Example:

    Runtime 2.x
        supports artifact format 1 and 2

An older runtime must reject unsupported formats.

## 54. Artifact State Machine

Recommended lifecycle:

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
       +------> REJECTED
       |
       v
    ACCEPTED
       |
       v
    AVAILABLE
       |
       +------> REVOKED
       |
       v
    EXPIRED
       |
       v
    RETAINED / DELETED

Actual states may be simplified during initial implementation.

## 55. Artifact Lifecycle States

| State | Meaning |
|---|---|
| CREATED | Metadata exists |
| UPLOADING | Binary upload in progress |
| UPLOADED | Upload completed |
| VALIDATING | Validation running |
| ACCEPTED | Validation passed |
| AVAILABLE | Eligible for execution |
| REJECTED | Validation failed |
| REVOKED | Explicitly blocked |
| EXPIRED | Retention/validity ended |
| DELETED | Binary removed under policy |

## 56. Rejection

Rejected artifacts remain in metadata long enough to support:

- user feedback;
- audit;
- troubleshooting;
- abuse investigation.

Retention duration is policy-defined.

## 57. Revocation

An accepted artifact may be revoked because of:

- security issue;
- compromised signing key;
- malicious payload;
- discovered incompatibility;
- customer request;
- policy violation.

Revocation prevents future execution.

## 58. Existing Execution and Revocation

Revocation of an artifact must have defined semantics for active jobs.

Baseline:

> Revocation blocks new execution; active execution is handled according to the incident and safety policy.

Automatic termination of a running robot workload must not be treated as a generic
artifact-revocation operation without considering physical safety.

## 59. Artifact Expiration

Artifacts may expire based on:

- customer retention;
- project lifecycle;
- storage policy;
- security policy.

Expiration should prevent new execution.

## 60. Artifact Retention

Retention should distinguish:

1. Accepted artifacts.
2. Rejected artifacts.
3. Revoked artifacts.
4. Referenced artifacts.
5. Unreferenced artifacts.
6. Audit metadata.

Artifacts referenced by historical runs may require longer retention.

## 61. Result Traceability

A run should reference the exact artifact digest.

Example:

    run_id
      |
      +-- artifact_id
      +-- artifact_digest
      +-- platform_id
      +-- runtime_version
      +-- started_at

This ensures a historical run can be tied to the exact executable content.

## 62. Booking Traceability

A booking does not itself make an artifact trusted.

Execution requires:

    Booking
      +
    Artifact
      +
    Compatibility
      +
    Authorization
      |
      v
    Job

## 63. Job Artifact Selection

A job should reference:

- artifact ID;
- artifact digest;
- target platform;
- target resource;
- required runtime.

The job should never resolve "latest artifact" dynamically at execution time.

## 64. Artifact Download

The Lab Agent requests the exact artifact referenced by the job.

Conceptually:

    Job
      |
      v
    artifact_id + digest
      |
      v
    Control Plane
      |
      v
    Object Storage
      |
      v
    Lab Agent

## 65. Download Authorization

Artifact download should require:

- authenticated Lab Agent;
- valid lab identity;
- valid job;
- authorized resource;
- artifact availability.

A Lab Agent should not have unrestricted access to every customer's artifact.

## 66. Download Integrity

After download:

    Download
      |
      v
    Compute SHA-256
      |
      v
    Compare Expected Digest
      |
      +--> mismatch = reject
      |
      v
    Verify Signature
      |
      v
    Deploy

## 67. Local Artifact Cache

Lab Agents may cache artifacts to reduce repeated downloads.

Cache entries must be keyed by immutable digest.

Example:

    cache/
      sha256-abc...
      sha256-def...

The cache must not become an authority independent of the Control Plane.

## 68. Cache Security

Cached artifacts must:

- remain access-controlled;
- respect retention;
- be integrity-checked;
- be removable;
- not expose one tenant's artifact to another tenant.

## 69. Artifact Storage Encryption

Artifact storage should use encryption at rest.

Transport must use secure authenticated channels.

Encryption protects stored binaries but does not replace authorization.

## 70. Artifact Tenant Isolation

Artifacts are tenant-scoped.

Authorization must verify:

    authenticated user
        |
        v
    organization membership
        |
        v
    project ownership/access
        |
        v
    artifact access

## 71. Artifact Access Control

Actions should be separately authorized:

- create;
- upload;
- view metadata;
- validate;
- download;
- execute;
- revoke;
- delete;
- administer.

Read access must not automatically imply execution permission.

## 72. Artifact Audit Events

Audit events should include:

- artifact created;
- upload authorized;
- upload completed;
- validation started;
- validation passed;
- validation failed;
- artifact downloaded;
- artifact executed;
- artifact revoked;
- artifact deleted.

## 73. Artifact Interfaces

Conceptual application interfaces include:

    ArtifactService
        create()
        registerUpload()
        completeUpload()
        validate()
        get()
        list()
        revoke()
        delete()

    ArtifactRepository
        create()
        get()
        list()
        updateState()
        recordValidation()

    ArtifactStorage
        put()
        get()
        delete()
        exists()
        generateUploadUrl()
        generateDownloadUrl()

    ArtifactValidator
        validateStructure()
        validateManifest()
        validateIntegrity()
        validateSignature()
        validateCompatibility()
        validatePolicy()

## 74. Artifact Service Boundary

The Artifact Service owns artifact business rules.

It should not expose raw object-storage implementation details to the Studio.

The Studio interacts through the API contract.

## 75. Artifact Storage Interface

Conceptual interface:

    put(object_key, content)
    get(object_key)
    delete(object_key)
    exists(object_key)
    generate_upload_url(object_key, constraints)
    generate_download_url(object_key, expiry)

Storage implementation is provider-specific.

## 76. Artifact Validation Interface

Conceptual interface:

    validate(artifact)
        -> ValidationResult

ValidationResult contains:

    status
    artifact_digest
    manifest_status
    checksum_status
    signature_status
    compatibility_status
    policy_status
    errors

## 77. Artifact API Operations

The API should support:

- `artifact.create`
- `artifact.upload`
- `artifact.get`
- `artifact.list`
- `artifact.validate`
- `artifact.delete`
- `artifact.download`

Future operations may include:

- `artifact.revoke`
- `artifact.restore`
- `artifact.sign`

## 78. Artifact Create

`artifact.create` creates the server-side metadata and upload session.

It should not automatically mark the artifact executable.

## 79. Artifact Upload

`artifact.upload` represents completion of the artifact transfer.

The upload operation should result in:

    UPLOADED
        |
        v
    VALIDATING

It must not result directly in `AVAILABLE`.

## 80. Artifact Get

`artifact.get` returns:

- identity;
- version;
- state;
- manifest metadata;
- digest;
- compatibility;
- validation summary.

It should not expose unnecessary storage internals.

## 81. Artifact Download

Download authorization is controlled.

Users may download their own artifacts subject to policy.

Lab Agents receive only artifacts required for authorized execution.

## 82. Artifact Delete

Deletion should normally be a lifecycle operation.

The system must distinguish:

- logical deletion;
- binary deletion;
- audit retention.

Historical execution records should not become invalid merely because a binary
has been removed under an approved retention policy.

## 83. Artifact Data Model

Recommended metadata fields:

| Field | Description |
|---|---|
| `artifact_id` | Stable artifact identifier |
| `project_id` | Owning project |
| `organization_id` | Tenant |
| `application_name` | Application |
| `application_version` | Application release |
| `format_version` | `.krv` format |
| `digest` | SHA-256 |
| `size_bytes` | Binary size |
| `object_key` | Storage location |
| `platform_id` | Target platform |
| `architecture` | CPU architecture |
| `runtime_constraint` | Runtime requirement |
| `sdk_constraint` | SDK requirement |
| `state` | Lifecycle state |
| `created_at` | Creation |
| `validated_at` | Validation |
| `revoked_at` | Revocation |
| `expires_at` | Expiration |

## 84. Validation Data Model

Recommended fields:

| Field | Description |
|---|---|
| `artifact_id` | Artifact |
| `validator_version` | Validator version |
| `validation_status` | Result |
| `manifest_valid` | Manifest check |
| `checksum_valid` | Integrity |
| `signature_valid` | Authenticity |
| `compatibility_valid` | Compatibility |
| `policy_valid` | Policy |
| `validated_at` | Time |
| `failure_code` | Error |
| `details` | Structured details |

## 85. Artifact Storage Flow

    Studio
      |
      v
    Control Plane
      |
      +--> PostgreSQL metadata
      |
      +--> Object Storage binary
      |
      +--> Validation Queue
                  |
                  v
             Validator Worker
                  |
                  v
             PostgreSQL state

## 86. Validation Worker

Validation should be asynchronous for large artifacts.

The API may return:

    202 ACCEPTED

with an artifact ID and validation status.

The Studio can then query:

    artifact.get

or receive:

    artifact.validating
    artifact.accepted
    artifact.rejected

## 87. Idempotency

Artifact operations involving side effects should support idempotency where
appropriate.

Examples:

- artifact creation;
- upload completion;
- validation request;
- deletion;
- revocation.

An idempotency key prevents duplicate records or repeated side effects.

## 88. Artifact State Authority

PostgreSQL is authoritative for artifact lifecycle state.

Object storage availability alone does not make an artifact executable.

Queue messages are not authoritative.

## 89. Artifact Execution Gate

Before execution:

    Job
      |
      v
    Artifact Exists?
      |
      v
    ACCEPTED / AVAILABLE?
      |
      v
    Not Revoked?
      |
      v
    Signature Valid?
      |
      v
    Compatible?
      |
      v
    Authorized?
      |
      v
    Execute

## 90. Artifact Policy

Policy may enforce:

- maximum size;
- allowed platforms;
- allowed capabilities;
- signing authority;
- expiration;
- artifact format;
- resource limits;
- debug policy;
- source-content policy.

## 91. Artifact Resource Metadata

Artifacts may declare:

- minimum memory;
- minimum storage;
- CPU requirements;
- GPU requirements;
- camera requirements;
- sensor requirements;
- network requirements.

Declared requirements must be checked against target resources.

## 92. Capability Compatibility

Example:

    Artifact
      |
      +-- camera
      +-- depth_sensor
      +-- joint_control
      |
      v
    Platform Capabilities
      |
      v
    Compatible?

Missing mandatory capability causes rejection.

## 93. Platform Version Compatibility

Platform identity alone is insufficient.

Example:

    humanoid-a
        version 2.0

may not be compatible with an artifact requiring:

    humanoid-a
        version >= 3.0

Compatibility rules must be explicit.

## 94. Runtime Compatibility

The manifest may specify:

    minimum_runtime_version
    maximum_runtime_version

or an equivalent semantic version constraint.

Runtime must enforce the constraint.

## 95. SDK Compatibility

SDK version metadata is retained for traceability.

An SDK requirement may affect:

- ABI;
- API behavior;
- runtime interfaces;
- generated configuration;
- protocol compatibility.

## 96. Operating System Compatibility

Future artifacts may specify:

    os = linux
    distribution = kritvaos
    architecture = aarch64

The runtime must reject incompatible operating environments.

## 97. Artifact Security Scan

Optional deeper inspection may include:

- executable metadata;
- dependency analysis;
- known vulnerability scanning;
- prohibited file detection;
- secret detection;
- policy scanning.

Security scanning should not replace cryptographic verification.

## 98. Artifact Provenance

The artifact should preserve provenance metadata such as:

- source commit hash optionally supplied locally;
- build ID;
- build tool version;
- SDK version;
- package tool version.

Source commit information is metadata only.

The source repository itself is never uploaded as part of the standard artifact.

## 99. Build Provenance Privacy

Customers may choose whether to include source repository identifiers.

RaaS should not require:

- Git remote URL;
- source repository contents;
- Git history.

A build ID is sufficient for RaaS execution traceability.

## 100. Artifact Reproducibility

Where practical:

    Same Source
       +
    Same Toolchain
       +
    Same Dependencies
       |
       v
    Same Artifact Content

Reproducibility is desirable but not required to identify an artifact because the
digest remains the authoritative content identity.

## 101. Artifact Retention Policy

A baseline policy should distinguish:

    Active
      |
      +--> Retain

    Revoked
      |
      +--> Retain metadata
      +--> Retain binary according to policy

    Expired
      |
      +--> Retention period
      |
      v
    Delete Binary

    Audit Record
      |
      v
    Retain According To Audit Policy

## 102. Garbage Collection

Garbage collection may remove binary content only when:

- artifact retention expired;
- no active execution references it;
- legal/audit retention does not require it;
- no pending download requires it.

## 103. Orphan Detection

A reconciliation process should detect:

- database artifact without object;
- object without database record;
- accepted artifact with missing object;
- stale upload;
- incomplete validation;
- invalid cache.

## 104. Reconciliation

Artifact reconciliation should run periodically.

Conceptual flow:

    PostgreSQL
       |
       +--> Artifact Metadata
       |
       v
    Object Storage
       |
       v
    Compare
       |
       +--> Repair
       +--> Alert
       +--> Quarantine

## 105. Failed Upload Cleanup

Incomplete uploads should expire automatically.

The cleanup process should remove:

- abandoned upload sessions;
- incomplete multipart objects;
- temporary metadata.

Cleanup must not remove accepted artifacts.

## 106. Artifact Quarantine

An artifact may be quarantined when:

- security scanning fails;
- signature trust is uncertain;
- storage inconsistency exists;
- revocation is suspected.

Quarantined artifacts are not executable.

## 107. Artifact Lifecycle Audit

Every state transition should be attributable.

Example:

    UPLOADED
       |
       | validator-01
       v
    VALIDATING
       |
       | validator-01
       v
    ACCEPTED

## 108. Artifact Error Model

Artifact errors should distinguish:

- malformed input;
- authorization;
- validation;
- compatibility;
- policy;
- storage;
- transient infrastructure.

Clients should receive stable error codes rather than implementation-specific
storage errors.

## 109. Example Error

    {
        "status": "ERROR",
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is not compatible with selected platform",
        "data": null,
        "error": {
            "platform": "humanoid-a",
            "required_runtime": "2.x",
            "available_runtime": "1.x"
        }
    }

The exact API schema is defined by API architecture.

## 110. Artifact Upload Limits

The system should enforce:

- maximum artifact size;
- maximum file count;
- maximum extraction size;
- maximum path length;
- maximum nesting depth;
- maximum validation time.

These limits reduce archive-bomb and resource-exhaustion risk.

## 111. Safe Archive Extraction

Validation must protect against:

- path traversal;
- symbolic-link abuse;
- absolute paths;
- oversized decompression;
- malformed archive headers;
- nested archive abuse.

Extracted paths must remain inside a controlled temporary directory.

## 112. Temporary Validation Storage

Validation workers should use isolated temporary storage.

Temporary content must be deleted after validation unless retained for a defined
security/audit reason.

## 113. Artifact Download Limits

Download authorization may include:

- expiry;
- artifact ID;
- digest;
- recipient identity;
- Lab Agent identity;
- job identity.

## 114. Customer Artifact Isolation

Two organizations must never be able to access each other's artifacts through:

- API;
- object-storage URLs;
- cache;
- Lab Agent;
- logs;
- result references.

Tenant isolation must be tested explicitly.

## 115. Artifact Logging

Logs must not contain:

- artifact payload;
- embedded secrets;
- unnecessary customer source text.

Logs may contain:

- artifact ID;
- digest;
- size;
- validation result;
- platform;
- version;
- error code.

## 116. Artifact Observability

Metrics should include:

- uploads;
- upload failures;
- validation latency;
- validation failures;
- signature failures;
- compatibility failures;
- rejected artifacts;
- storage failures;
- download failures;
- execution references.

## 117. Artifact Metrics

Useful measurements include:

    artifact_upload_count
    artifact_validation_count
    artifact_validation_failure_count
    artifact_validation_latency
    artifact_download_count
    artifact_storage_bytes
    artifact_rejected_count
    artifact_revoked_count

## 118. Artifact Security Invariants

The following must remain true:

1. Source directories are never upload inputs.
2. `.krv` is the execution upload unit.
3. Accepted artifacts are immutable.
4. Every accepted artifact has an integrity digest.
5. Production-executable artifacts are signed.
6. Signature trust is independently validated.
7. Artifact compatibility is independently validated.
8. Artifact ownership is tenant-scoped.
9. Secrets are not packaged.
10. Artifact state is authoritative in PostgreSQL.

## 119. Phase Mapping

| Phase | Artifact Scope | Outcome |
|---|---|---|
| Phase 0 | Format foundation | `.krv` definition |
| Phase 1 | Studio packaging | Local artifact creation |
| Phase 2 | Validation/storage | Production artifact pipeline |
| Phase 3 | Control Plane | Artifact service |
| Phase 4 | Commercial | Artifact/booking linkage |
| Phase 5 | Execution | Lab deployment |
| Phase 6 | Robot | Physical compatibility |
| Phase 7 | Results | Run traceability |
| Phase 8 | Production | Full lifecycle hardening |

## 120. P0 FOUNDATION — Artifact Foundation

Deliver:

- `.krv` format definition;
- manifest schema;
- checksum scheme;
- versioning model;
- source-content policy.

Acceptance:

- package can be created;
- manifest can be parsed;
- digest can be calculated;
- malformed packages are rejected.

## 121. P1 STUDIO Artifact Creation

Deliver:

- local packaging command;
- Studio packaging workflow;
- local validation;
- source-file exclusion;
- release build policy.

Acceptance:

- source remains local;
- `.krv` is generated locally;
- obvious source files are rejected;
- debug symbols are controlled.

## 122. P2 BUILD & ARTIFACT — Artifact Storage and Validation

Deliver:

- upload;
- object storage;
- checksum verification;
- signature verification;
- validation worker.

Acceptance:

- upload succeeds;
- corrupted artifacts fail;
- unsigned production artifacts fail;
- accepted artifacts are immutable.

## 123. P3 CONTROL PLANE Integration

Deliver:

- artifact repository;
- artifact service;
- API;
- lifecycle;
- authorization;
- audit.

Acceptance:

- artifact metadata is durable;
- tenant isolation works;
- artifact state transitions are controlled;
- audit events are generated.

## 124. P4 BOOKING & COMMERCIAL — Booking Integration

Deliver:

- artifact/platform compatibility;
- artifact/booking linkage;
- execution authorization.

Acceptance:

- incompatible artifact cannot be used for a booking;
- authorized artifact can be selected;
- exact digest is recorded.

## 125. P5 EXECUTION — Remote Execution

Deliver:

- artifact download;
- Lab Agent validation;
- deployment;
- runtime launch.

Acceptance:

- exact artifact is downloaded;
- digest is verified;
- signature is verified;
- runtime compatibility is checked;
- execution starts only after validation.

## 126. P6 LAB & ROBOT — Physical Robot

Deliver:

- platform-specific artifact constraints;
- resource capability validation;
- robot deployment policy.

Acceptance:

- incompatible hardware rejects artifact;
- required capabilities are checked;
- physical deployment is controlled.

## 127. P7 LIVE & RESULTS

Deliver:

- artifact-to-run traceability;
- runtime metadata;
- result association.

Acceptance:

- every run records artifact ID;
- every run records artifact digest;
- runtime version is recorded;
- results can be traced to exact executable content.

## 128. P8 PRODUCTION Hardening

Deliver:

- signing key rotation;
- revocation;
- retention;
- reconciliation;
- quarantine;
- advanced scanning;
- artifact observability;
- DR.

Acceptance:

- compromised artifacts can be revoked;
- key rotation is supported;
- retention is enforced;
- storage inconsistencies are detected;
- recovery procedures are tested.

## 129. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Source accidentally packaged | Critical | Allowlist + source checks |
| Artifact tampering | Critical | SHA-256 + signature |
| Signing key compromise | Critical | Key management + rotation + revocation |
| Malicious artifact | Critical | Auth + signature + policy + scanning |
| Runtime incompatibility | High | Compatibility validation |
| Corrupt upload | High | Digest verification |
| Object/DB inconsistency | High | Reconciliation |
| Artifact theft | High | Tenant isolation + authorization |
| Archive bomb | High | Extraction limits |
| Debug symbols expose source paths | Medium | Release stripping |
| Secrets in artifact | Critical | Packaging policy + scanning |
| Retention deletes active artifact | Critical | Reference-aware GC |
| Old runtime cannot execute artifact | High | Version compatibility |
| Revocation during active run | High | Explicit execution policy |
| Storage growth | Medium | Retention + lifecycle |
| Cache leakage | High | Tenant/resource-scoped cache |
| Upload abuse | High | Size/rate limits |

## 130. Risk: Source Material Hidden in Payload

Mitigation:

- allowlisted package inputs;
- source extension rejection;
- debug stripping;
- secret scanning;
- optional content inspection;
- documented customer responsibility.

The system must not represent source-code exclusion as a guarantee against arbitrary
text intentionally embedded inside compiled binaries.

## 131. Risk: Signing Key Compromise

Mitigation:

- hardware-backed or managed key storage;
- restricted signing identity;
- key rotation;
- key revocation;
- trusted-key versioning;
- incident response procedure.

## 132. Risk: Artifact Storage Becomes Authoritative

Mitigation:

- PostgreSQL remains lifecycle authority;
- object storage only holds binary content;
- execution checks database state;
- reconciliation detects inconsistencies.

## 133. Risk: Artifact Replaced After Validation

Mitigation:

- immutable object key;
- content-addressed digest;
- object-storage immutability policy where available;
- server-side digest verification;
- signature verification at lab.

## 134. Risk: Old Artifact Executed After Revocation

Mitigation:

- execution-time state check;
- revocation check;
- Lab Agent policy;
- job authorization;
- audit.

## 135. Risk: Customer Cannot Reproduce Artifact

Mitigation:

- manifest;
- application version;
- build ID;
- SDK version;
- toolchain metadata;
- artifact digest.

The digest remains the definitive identity even when exact source reproduction is
not possible.

## 136. Open Questions

1. Which archive format should `.krv` use?
2. Should `.krv` use ZIP, TAR-based packaging, or a custom container?
3. Which canonicalization rules are required?
4. Which signing algorithm will be selected?
5. Which key-management system will be used?
6. Will artifact signing happen entirely locally or through a trusted signing service?
7. Will customer-signed artifacts be supported?
8. What production signing trust hierarchy will be used?
9. What is the exact manifest JSON schema?
10. Which semantic-version constraints will be supported?
11. Which source-file detection policy is mandatory?
12. Will content scanning be enabled for all artifacts?
13. What is the maximum artifact size?
14. What is the maximum decompressed size?
15. What is the maximum file count?
16. Which debug information is permitted?
17. What artifact retention period applies?
18. How long should revoked artifacts remain?
19. What legal/audit retention applies?
20. Should artifacts be deduplicated by digest?
21. Which object-storage lifecycle policies will be used?
22. How should artifact restore from backup work?
23. What is the artifact quarantine workflow?
24. Should artifacts support expiration timestamps?
25. Should execution require online revocation checks?
26. How should offline labs handle revoked artifacts?
27. What is the exact artifact/runtime compatibility algorithm?
28. Will platform compatibility use semantic version ranges?
29. Which capabilities are mandatory in the manifest?
30. What artifact security scanner will be used?
31. Will malware scanning be required?
32. Will SBOM metadata be included?
33. Will dependency vulnerability metadata be included?
34. Will artifacts support multiple architectures?
35. Will one artifact contain multiple platform variants?
36. How will artifact format migration be handled?
37. What is the artifact cache policy on Lab Agents?
38. What is the cache eviction policy?
39. How are artifact download failures retried?
40. How are incomplete uploads cleaned?
41. What exact audit retention period is required?
42. Which artifact metrics are production SLO indicators?

## 137. Full Acceptance Criteria Checklist

### Format

- [ ] `.krv` is formally defined.
- [ ] Format version is mandatory.
- [ ] Manifest is mandatory.
- [ ] Payload structure is defined.
- [ ] Archive path rules are defined.
- [ ] Malformed archives are rejected.
- [ ] Path traversal is rejected.
- [ ] Oversized extraction is rejected.
- [ ] Deterministic packaging rules are documented.

### Manifest

- [ ] Artifact ID is present.
- [ ] Application name is present.
- [ ] Application version is present.
- [ ] Platform ID is present.
- [ ] Architecture is present.
- [ ] Runtime compatibility is present.
- [ ] SDK compatibility is present.
- [ ] Entry point is present.
- [ ] Capabilities are represented.
- [ ] Payload metadata is present.
- [ ] Manifest versioning is defined.

### Integrity

- [ ] SHA-256 digest is generated.
- [ ] Digest covers canonical artifact content.
- [ ] Upload integrity is checked.
- [ ] Download integrity is checked.
- [ ] Lab integrity is checked.
- [ ] Digest is stored in PostgreSQL.
- [ ] Digest is recorded for every run.
- [ ] Artifact content cannot be silently replaced.

### Signing

- [ ] Production artifacts are signed.
- [ ] Signature algorithm is defined.
- [ ] Key identity is recorded.
- [ ] Signing keys are protected.
- [ ] Signature verification is performed server-side.
- [ ] Signature verification is performed before execution.
- [ ] Key rotation is supported.
- [ ] Key revocation is supported.
- [ ] Untrusted signatures are rejected.

### Source-Code Protection

- [ ] Source directories are never upload inputs.
- [ ] Studio upload accepts `.krv`, not source trees.
- [ ] Package inputs use an allowlist.
- [ ] Common source extensions are rejected.
- [ ] Git metadata is excluded.
- [ ] IDE metadata is excluded.
- [ ] Build caches are excluded.
- [ ] Debug-symbol policy is enforced.
- [ ] Secrets are excluded.
- [ ] Server validates package structure independently.
- [ ] Documentation accurately states the limitation that arbitrary source text
  embedded inside binaries cannot be cryptographically ruled out.

### Compatibility

- [ ] Platform compatibility is validated.
- [ ] Platform version compatibility is validated.
- [ ] CPU architecture is validated.
- [ ] Runtime compatibility is validated.
- [ ] SDK compatibility is validated.
- [ ] Required capabilities are validated.
- [ ] Resource requirements are validated where declared.
- [ ] Unsupported artifact formats are rejected.
- [ ] Unknown compatibility is not treated as compatible.

### Upload

- [ ] Artifact creation is authenticated.
- [ ] Artifact upload is authorized.
- [ ] Upload sessions are short-lived.
- [ ] Upload size is limited.
- [ ] Object keys are controlled by the service.
- [ ] Upload completion is explicit.
- [ ] Uploaded content enters validation.
- [ ] Upload cannot directly make an artifact executable.

### Storage

- [ ] Artifact binary is stored in object storage.
- [ ] Artifact metadata is stored in PostgreSQL.
- [ ] Object storage uses encryption at rest.
- [ ] Transport uses secure channels.
- [ ] Tenant isolation is enforced.
- [ ] Artifact object keys are non-guessable or access-controlled.
- [ ] Storage lifecycle is defined.
- [ ] Storage reconciliation is implemented.

### Lifecycle

- [ ] Artifact lifecycle states are defined.
- [ ] State transitions are controlled.
- [ ] Rejected artifacts are distinguishable.
- [ ] Accepted artifacts are immutable.
- [ ] Revocation is supported.
- [ ] Expiration is supported where required.
- [ ] Deletion policy is defined.
- [ ] Historical execution references remain valid.

### Execution

- [ ] Jobs reference exact artifact IDs.
- [ ] Jobs reference exact artifact digests.
- [ ] "Latest artifact" is not resolved dynamically.
- [ ] Artifact authorization is checked before execution.
- [ ] Artifact availability is checked before execution.
- [ ] Revocation is checked before execution.
- [ ] Compatibility is checked before execution.
- [ ] Lab Agent verifies integrity.
- [ ] Lab Agent verifies signature.
- [ ] Runtime verifies compatibility.

### Retention

- [ ] Accepted artifact retention is defined.
- [ ] Rejected artifact retention is defined.
- [ ] Revoked artifact retention is defined.
- [ ] Historical run references are considered.
- [ ] Garbage collection is reference-aware.
- [ ] Abandoned uploads are cleaned.
- [ ] Object/database orphan detection exists.

### Audit

- [ ] Artifact creation is audited.
- [ ] Upload is audited.
- [ ] Validation is audited.
- [ ] Download is audited.
- [ ] Execution is auditable.
- [ ] Revocation is audited.
- [ ] Deletion is audited.
- [ ] Artifact digest is included in relevant audit records.

### Security

- [ ] Secrets cannot be packaged through standard tooling.
- [ ] Signing private keys are protected.
- [ ] Artifact access is tenant-scoped.
- [ ] Lab Agent access is restricted.
- [ ] Archive extraction is sandboxed.
- [ ] Resource limits exist.
- [ ] Artifact logs do not expose payload content.
- [ ] Artifact security scanning policy is defined.

### Phase Completion

- [ ] Phase 0 artifact format foundation is complete.
- [ ] Phase 1 local packaging is complete.
- [ ] Phase 2 upload and validation are complete.
- [ ] Phase 3 Control Plane integration is complete.
- [ ] Phase 4 booking/execution authorization is complete.
- [ ] Phase 5 remote execution is complete.
- [ ] Phase 6 physical platform deployment is complete.
- [ ] Phase 7 run/result traceability is complete.
- [ ] Phase 8 production artifact lifecycle is complete.

## 138. Final Artifact Architecture Baseline

The Kritva RaaS `.krv` artifact is the controlled execution boundary between
customer development and remote robotic execution.

The complete flow is:

    Customer Source
          |
          v
    Local Build
          |
          v
    Local Test
          |
          v
    Local Package
          |
          v
    .krv
          |
          +--> Manifest
          +--> Payload
          +--> Checksums
          +--> Signature
          |
          v
    Local Validation
          |
          v
    Upload
          |
          v
    Control Plane
          |
          +--> Authentication
          +--> Authorization
          +--> Structural Validation
          +--> Checksum Validation
          +--> Signature Validation
          +--> Compatibility Validation
          +--> Policy Validation
          |
          v
    ACCEPTED
          |
          v
    Object Storage
          |
          v
    Authorized Job
          |
          v
    Lab Agent
          |
          +--> Digest Verification
          +--> Signature Verification
          +--> Platform Check
          +--> Runtime Check
          +--> Resource Check
          |
          v
    Kritva Runtime
          |
          v
    Robot

The architecture establishes the following fundamental rule:

> **Customer source code remains on the customer's machine; RaaS receives and executes a validated `.krv` artifact rather than the customer's source project.**

The artifact is immutable after acceptance, identified by a cryptographic digest,
authenticated by a trusted signature, constrained by explicit compatibility
metadata, stored separately from business metadata, and traceable through every
execution.

The authoritative relationship is:

    PostgreSQL
        |
        +--> artifact identity
        +--> ownership
        +--> lifecycle
        +--> validation
        +--> authorization
        +--> audit
        |
        v
    Object Storage
        |
        +--> immutable artifact binary

The execution relationship is:

    Artifact
       +
    Booking
       +
    Platform
       +
    Runtime
       +
    Authorization
       |
       v
    Job
       |
       v
    Run

Every run must identify the exact artifact digest used for execution.

The artifact architecture therefore provides the foundation for secure,
repeatable, auditable remote execution while preserving the central RaaS product
boundary:

> **Build locally. Upload the execution artifact. Run remotely.**
