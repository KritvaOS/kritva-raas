# Kritva RaaS Artifact Service

## 1. Document Control

| Item | Value |
|---|---|
| Document | Artifact Service Architecture |
| Path | `docs/backend/architecture/ARTIFACT_SERVICE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Service | Artifact Service |
| Artifact Format | `.krv` |
| Storage | PostgreSQL metadata + Object Storage binary |
| Validation Authority | Artifact Service |
| Execution Validation | Artifact Service + Lab Agent |
| Access Model | Organization and resource scoped |
| Integrity | Digest/checksum |
| Authenticity | Digital signature |
| API | REST `/api/v1/` |
| Realtime | WebSocket events |
| Source Policy | Upload execution artifact, not source tree |

## 2. Purpose

The Artifact Service manages the complete lifecycle of Kritva RaaS execution
artifacts.

The service provides a controlled boundary between the customer's local
development environment and the remote RaaS execution infrastructure.

The primary architectural principle is:

> **Build locally. Package locally. Upload the execution artifact. Execute remotely.**

The Artifact Service therefore manages the artifact rather than the customer's
source repository.

It is responsible for:

- artifact registration;
- upload authorization;
- upload completion;
- manifest validation;
- checksum validation;
- signature validation;
- compatibility validation;
- artifact versioning;
- immutable artifact identity;
- object-storage management;
- access control;
- download authorization;
- retention;
- lifecycle events;
- artifact revocation;
- artifact expiration;
- failure handling;
- auditability.

## 3. Scope

This document defines:

- Artifact Service responsibilities;
- `.krv` artifact model;
- artifact identity;
- manifest;
- checksums;
- signatures;
- upload flow;
- validation pipeline;
- compatibility rules;
- storage architecture;
- object-storage layout;
- metadata persistence;
- versioning;
- immutable artifacts;
- access control;
- download URLs;
- Lab Agent access;
- retention;
- deletion;
- revocation;
- events;
- failure modes;
- recovery;
- security;
- observability;
- testing;
- Phase 0–8 implementation mapping.

## 4. Non-Goals

The Artifact Service does not:

- compile customer source code;
- execute arbitrary source code;
- act as a source-code repository;
- provide a general file-sharing service;
- replace Git;
- replace the local build system;
- directly control robots;
- directly allocate physical resources;
- own credit balances;
- own bookings;
- become the primary result-storage service.

## 5. Architectural Principles

The Artifact Service follows these principles:

1. Artifacts are execution packages, not source archives.
2. Artifacts are immutable after acceptance.
3. Every artifact has a cryptographic digest.
4. Production artifacts should be digitally signed.
5. Metadata is authoritative in PostgreSQL.
6. Binary payloads are stored in object storage.
7. Large binaries are never stored directly in normal API JSON.
8. Upload completion requires integrity verification.
9. Remote execution requires compatibility validation.
10. Access is organization and resource scoped.
11. Download access is authorized and time-limited.
12. Artifact lifecycle is auditable.
13. Deletion does not silently erase audit history.
14. Artifact identity is independent of filename.
15. Artifact versions are explicit.
16. Source code is not intentionally uploaded.
17. The Lab Agent must independently verify artifact integrity.
18. Backend acceptance does not eliminate runtime-side verification.

## 6. Artifact Definition

An artifact is a versioned, packaged execution payload that can be deployed to a
compatible Kritva platform.

The artifact may contain:

- manifest;
- executable;
- runtime libraries;
- configuration;
- required resources;
- checksum information;
- signature metadata.

A conceptual package is:

    application.krv
      |
      +-- manifest.json
      +-- executable
      +-- libraries/
      +-- config/
      +-- resources/
      +-- signature/
      +-- integrity metadata

The exact binary layout is defined by the artifact-format contract and is
independent of the Artifact Service API.

## 7. Artifact Identity

Artifact identity must not depend on:

- filename;
- upload URL;
- object-storage path;
- local filesystem path.

Recommended identity:

    artifact_id
        +
    content_digest

`artifact_id` identifies the registered artifact record.

`content_digest` identifies the exact binary content.

## 8. Artifact Immutability

Once an artifact is accepted, its executable content must not change.

Changing:

- binary;
- libraries;
- manifest;
- configuration;
- signing metadata;

creates a new artifact.

Example:

    Application 1.0
        |
        +--> Artifact A
        |       digest X
        |
        +--> Artifact B
                digest Y

Artifact A must remain retrievable as originally accepted.

## 9. Artifact Versioning

Artifact versioning has two related concepts:

| Concept | Meaning |
|---|---|
| Application version | Customer-defined application release |
| Artifact version | RaaS artifact revision |
| Artifact ID | Unique immutable registered object |
| Digest | Exact content identity |

Two artifacts may contain the same application version but must still have
different artifact IDs if their contents differ.

## 10. Version Policy

Recommended artifact metadata:

    application_name
    application_version
    artifact_version
    artifact_id
    digest
    platform_id
    platform_version
    sdk_version

Artifact Service must not infer semantic version meaning from filenames.

## 11. Manifest

The manifest describes the execution contract.

Minimum conceptual fields:

    {
        "format_version": "1.0",
        "application": {
            "name": "vision-demo",
            "version": "1.2.0"
        },
        "platform": {
            "id": "humanoid-a",
            "version": "1.0"
        },
        "architecture": "aarch64",
        "kritva_os": {
            "min_version": "1.0.0",
            "max_version": null
        },
        "sdk": {
            "version": "1.0.0"
        },
        "capabilities": [
            "camera",
            "imu",
            "motor_control"
        ],
        "entrypoint": "bin/application",
        "digest": "...",
        "signature": {
            "algorithm": "..."
        }
    }

The canonical manifest schema must be versioned separately from this
architecture document.

## 12. Manifest Validation

Manifest validation must verify:

- required fields;
- field types;
- supported format version;
- valid application name;
- valid version;
- valid platform;
- valid architecture;
- valid SDK version;
- valid KritvaOS constraints;
- valid capability identifiers;
- valid entrypoint;
- prohibited fields;
- size limits.

Malformed manifests must be rejected before deployment.

## 13. Manifest Trust

Manifest data is untrusted until validation completes.

The service must not:

- execute manifest values;
- construct shell commands from manifest fields;
- use arbitrary filesystem paths;
- trust declared checksums without independently verifying content.

## 14. Checksum

Every artifact must have a cryptographic content digest.

Recommended baseline:

- SHA-256 for compatibility;
- stronger algorithms may be added through a versioned contract.

Example:

    digest_algorithm = sha256
    digest = 9f86d081884c7d659a2feaa0c55ad015...

The digest must be calculated from the canonical artifact content according to
the artifact format specification.

## 15. Digest Validation

Upload validation:

    Uploaded Bytes
          |
          v
    Calculate Digest
          |
          v
    Compare Expected Digest
          |
          +--> Match --> Continue
          |
          +--> Mismatch --> Reject

A digest mismatch produces:

    ARTIFACT_DIGEST_MISMATCH

No execution may be authorized for a mismatched artifact.

## 16. Digital Signature

Production artifacts should be digitally signed.

The signature establishes artifact authenticity.

Signature validation verifies:

- supported algorithm;
- signer identity;
- certificate/key validity where applicable;
- signature over canonical artifact content;
- trust chain;
- revocation status where supported.

## 17. Signature Policy

Recommended policy:

| Environment | Signature |
|---|---|
| Local development | Optional/configurable |
| Development RaaS | Recommended |
| Staging | Required |
| Production | Required |

Unsigned production artifacts must be rejected.

Expected error:

    ARTIFACT_UNSIGNED

Invalid signatures:

    ARTIFACT_SIGNATURE_INVALID

## 18. Signing Authority

Signing keys must not be stored in:

- source repositories;
- frontend bundles;
- artifact storage;
- application configuration files;
- normal logs.

Signing infrastructure must use an appropriate secure key-management
mechanism.

## 19. Artifact Trust Chain

Production execution should follow:

    Customer Build
         |
         v
    Local Packaging
         |
         v
    Artifact Signing
         |
         v
    Upload
         |
         v
    Backend Validation
         |
         v
    Object Storage
         |
         v
    Lab Agent Download
         |
         v
    Digest Verification
         |
         v
    Signature Verification
         |
         v
    Runtime Compatibility
         |
         v
    Execution

## 20. Source-Code Boundary

The intended upload boundary is:

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
    .krv Artifact
         |
         v
    RaaS

The RaaS platform does not require the source tree.

The system must not automatically package:

- `.git/`;
- source files;
- build caches;
- IDE metadata;
- credentials;
- environment secrets;
- SSH keys;
- unrelated files.

## 21. Source Leakage Detection

The local packager should reject suspicious payloads where practical.

Examples:

- source file extensions;
- Git metadata;
- private keys;
- credentials;
- environment files.

Possible error:

    LOCAL_ARTIFACT_SOURCE_DETECTED

This is a protection mechanism, not an absolute guarantee against source
embedding inside arbitrary binaries.

## 22. Upload Architecture

Recommended flow:

    Studio
      |
      | POST artifact metadata
      v
    Artifact Service
      |
      | upload authorization
      v
    Object Storage
      |
      | upload
      v
    Completion
      |
      v
    Artifact Service
      |
      v
    Validation
      |
      v
    ACCEPTED / REJECTED

The binary should not necessarily traverse the Control Plane application
process.

## 23. Upload Initiation

The client first requests artifact registration/upload authorization.

Conceptual request:

    POST /api/v1/artifacts

    {
        "project_id": "project-001",
        "filename": "vision-demo.krv",
        "size_bytes": 10485760,
        "digest_algorithm": "sha256",
        "digest": "...",
        "platform_id": "humanoid-a"
    }

The server returns an upload session or controlled upload URL.

## 24. Upload Session

An upload session may contain:

    upload_id
    artifact_id
    object_key
    expires_at
    expected_size
    expected_digest
    upload_url

The session must be bound to:

- authenticated principal;
- organization;
- project;
- artifact;
- expected content constraints.

## 25. Download URLs

Artifact binaries should normally be downloaded through controlled,
short-lived URLs.

Conceptual:

    GET /api/v1/artifacts/{artifact_id}/download
                    |
                    v
              Authorization
                    |
                    v
              Signed URL
                    |
                    v
              Object Storage

The URL must:

- expire;
- be scoped to the artifact;
- not expose permanent credentials;
- not bypass organization authorization.

## 26. Lab Agent Downloads

The Lab Agent may receive a controlled artifact fetch authorization.

    Control Plane
         |
         v
    Artifact Authorization
         |
         v
    Lab Agent
         |
         v
    Object Storage
         |
         v
    Artifact

The Lab Agent must not receive unrestricted object-storage credentials.

## 27. Upload Completion

The client informs the service that upload has completed.

The service must not trust the client claim alone.

Completion flow:

    Upload Complete
         |
         v
    Verify Object Exists
         |
         v
    Verify Size
         |
         v
    Calculate/Verify Digest
         |
         v
    Validate Manifest
         |
         v
    Validate Signature
         |
         v
    Validate Compatibility
         |
         v
    ACCEPTED

## 28. Upload State

Recommended states:

    CREATED
    UPLOADING
    UPLOADED
    VALIDATING
    ACCEPTED
    REJECTED
    READY
    REVOKED
    EXPIRED
    DELETED

`READY` means the artifact is eligible for authorized execution.

The exact state vocabulary may be consolidated if implementation experience
shows that `ACCEPTED` and `READY` do not need separate semantics.

## 29. Artifact State Machine

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
    READY
       |
       +------> REVOKED
       |
       +------> EXPIRED
       |
       v
    DELETED

Terminal deletion must not remove required audit records.

## 30. Validation Pipeline

The canonical validation order is:

    Upload
      |
      v
    Transport / Size
      |
      v
    Package Structure
      |
      v
    Manifest Schema
      |
      v
    Digest
      |
      v
    Signature
      |
      v
    Platform Compatibility
      |
      v
    Runtime Compatibility
      |
      v
    SDK Compatibility
      |
      v
    Capability Compatibility
      |
      v
    Policy Validation
      |
      v
    ACCEPTED

## 31. Package Structure Validation

Validate:

- archive/package format;
- required files;
- prohibited files;
- duplicate entries;
- path traversal;
- absolute paths;
- symbolic links where unsupported;
- compression limits;
- unpacked-size limits;
- nested archive policy.

Path traversal must be rejected.

## 32. Compatibility Validation

Compatibility includes:

- platform ID;
- platform version;
- CPU architecture;
- KritvaOS version;
- SDK version;
- artifact format version;
- required capabilities;
- runtime requirements.

Example:

    Artifact
       |
       +-- platform = humanoid-a
       +-- arch = aarch64
       +-- KritvaOS >= 1.2
       +-- SDK = 1.1
       +-- capabilities = camera, imu

must be compatible with the selected platform and resource.

## 33. Platform Compatibility

The Platform Service remains authoritative for supported platforms and
capabilities.

Artifact Service queries Platform Service rather than duplicating platform
definitions.

Conceptual:

    Artifact Service
          |
          v
    Platform Service
          |
          v
    Compatibility Policy

## 34. Runtime Compatibility

Runtime compatibility should support:

- minimum KritvaOS;
- maximum KritvaOS where necessary;
- runtime ABI;
- artifact format;
- architecture.

An artifact must not be deployed merely because its platform ID matches.

## 35. Capability Compatibility

Example:

    Required:
      camera
      imu
      motor_control

Resource:

    Available:
      camera
      imu

Result:

    ARTIFACT_CAPABILITY_MISSING

The artifact must not be scheduled to that resource.

## 36. Validation Result

A validation record should contain:

    validation_id
    artifact_id
    validation_type
    status
    validator_version
    started_at
    completed_at
    error_code
    details

Validation history should be retained for auditability.

## 37. Validation Versioning

Validation behavior changes over time.

Therefore record:

- validator version;
- artifact format version;
- policy version;
- platform compatibility version.

This permits historical interpretation of acceptance decisions.

## 38. Artifact Storage

PostgreSQL stores metadata.

Object storage stores the binary.

    Artifact Service
         |
         +-------------------+
         |                   |
         v                   v
    PostgreSQL          Object Storage
    metadata            .krv binary

The database must never become the primary large-binary store.

## 39. Object Key

Object keys should be opaque and non-user-controlled.

Example:

    artifacts/
      org-001/
        artifact-01HXYZ/
          content.krv

The exact physical layout may be provider-specific.

Users must not be able to choose arbitrary object-storage paths.

## 40. Object Storage Security

Object storage should be:

- private by default;
- encrypted at rest;
- inaccessible through public bucket listing;
- accessed through controlled credentials;
- monitored;
- lifecycle-managed.

Public artifact buckets are prohibited for production artifacts.

## 41. Storage Metadata

Artifact metadata should include:

- artifact ID;
- project ID;
- organization ID;
- object key;
- size;
- digest;
- digest algorithm;
- manifest version;
- platform ID;
- platform version;
- architecture;
- SDK version;
- signature status;
- validation status;
- creation time;
- acceptance time;
- expiration time;
- revocation time.

## 42. Database Authority

PostgreSQL is authoritative for:

- artifact identity;
- ownership;
- lifecycle state;
- metadata;
- validation;
- authorization;
- retention policy;
- revocation.

Object storage is authoritative only for binary payload availability.

## 43. Artifact Repository

Conceptual interface:

    ArtifactRepository
        create(...)
        get(artifact_id)
        list(filter)
        updateMetadata(...)
        transitionState(...)
        deleteMetadata(...)
        findByDigest(...)
        findByProject(...)
        findExpired(...)

Repositories must not expose raw SQL to application services.

## 44. Object Storage Interface

Conceptual:

    ObjectStorage
        createUpload(...)
        completeUpload(...)
        headObject(...)
        getDownloadUrl(...)
        getObject(...)
        deleteObject(...)
        copyObject(...)
        verifyObject(...)

The interface must hide provider-specific APIs.

## 45. Validation Interface

Conceptual:

    ArtifactValidator
        validateStructure(...)
        validateManifest(...)
        validateDigest(...)
        validateSignature(...)
        validateCompatibility(...)
        validatePolicy(...)

Validation should return structured results rather than human-readable
strings only.

## 46. Artifact Service Interface

Conceptual:

    ArtifactService
        create(...)
        initiateUpload(...)
        completeUpload(...)
        validate(...)
        get(...)
        list(...)
        authorizeDownload(...)
        revoke(...)
        expire(...)
        delete(...)

These methods represent logical application contracts.

## 47. REST API

Representative endpoints:

    POST   /api/v1/artifacts
    GET    /api/v1/artifacts
    GET    /api/v1/artifacts/{artifact_id}
    POST   /api/v1/artifacts/{artifact_id}/complete
    POST   /api/v1/artifacts/{artifact_id}/validate
    GET    /api/v1/artifacts/{artifact_id}/download
    DELETE /api/v1/artifacts/{artifact_id}

Administrative endpoints may include:

    POST /api/v1/artifacts/{artifact_id}/revoke
    POST /api/v1/artifacts/{artifact_id}/restore

Restore must be restricted and policy-controlled.

## 48. Artifact Creation

Creation must enforce:

- authenticated principal;
- organization membership;
- project access;
- allowed artifact size;
- valid platform;
- valid metadata;
- idempotency where creation has side effects.

## 49. Artifact Access Control

Access should be evaluated using:

    Principal
       |
       v
    Organization
       |
       v
    Project Membership
       |
       v
    Artifact Ownership
       |
       v
    Artifact Policy
       |
       v
    ALLOW / DENY

Client-provided organization IDs are not authoritative.

## 50. Read Access

Users may access artifacts when they have:

- project access;
- organization membership;
- required role.

Read access does not imply:

- download access;
- execution access;
- deletion access;
- revocation access.

## 51. Download Access

Downloading requires:

- artifact exists;
- artifact is accessible;
- artifact is not deleted;
- artifact policy permits download;
- user/agent is authorized.

Revoked artifacts should normally not be downloadable for execution.

Administrative forensic download may be separately authorized.

## 52. Execution Access

Execution requires more than artifact read access.

The Job/Run flow must additionally validate:

- platform;
- booking;
- resource;
- compatibility;
- credit;
- execution policy.

Artifact Service provides artifact authorization; Job Service provides execution
authorization.

## 53. Lab Agent Access

A Lab Agent must be authorized based on:

- agent identity;
- lab;
- resource;
- requested artifact;
- Job;
- Run;
- platform compatibility.

A Lab Agent should not be able to enumerate arbitrary organization artifacts.

## 54. Multi-Tenancy

Every artifact must be tenant scoped.

The service must enforce:

- organization ownership;
- project ownership;
- membership;
- role;
- resource authorization.

Cross-organization access is denied by default.

## 55. Artifact Enumeration

Artifact list APIs must never expose artifacts belonging to another
organization.

Filtering must be server-side.

Pagination should be cursor-based.

## 56. Idempotency

Idempotency is required for side-effecting operations including:

- artifact creation;
- upload completion;
- artifact validation request;
- revocation;
- deletion where exposed.

Same key + same request returns the original result.

Same key + different request returns:

    IDEMPOTENCY_KEY_REUSED

## 57. Duplicate Content

The system may detect duplicate content by digest.

Possible policy:

    Same organization
       |
       v
    Same digest
       |
       +--> Existing artifact
       |
       +--> Reuse or create metadata revision

The initial implementation should favor correctness and auditability over
aggressive deduplication.

Cross-tenant binary deduplication must not leak existence information.

## 58. Retention

Retention policy should distinguish:

- active artifacts;
- expired artifacts;
- revoked artifacts;
- deleted artifacts;
- audit records.

Artifact retention may depend on:

- subscription;
- organization policy;
- project policy;
- legal requirements;
- storage policy;
- execution history.

## 59. Expiration

An artifact may expire when:

- configured retention period ends;
- project is closed;
- organization policy requires expiration;
- platform compatibility is permanently retired;
- security policy requires invalidation.

Expiration must be explicit and auditable.

## 60. Revocation

Revocation is different from expiration.

Revocation means:

> The artifact must no longer be trusted or executed.

Examples:

- compromised signing key;
- malicious artifact;
- security vulnerability;
- policy violation.

Revoked artifacts must fail execution validation.

## 61. Revocation Flow

    Artifact READY
         |
         v
      REVOKE
         |
         v
      REVOKED
         |
         +--> execution denied
         +--> new download denied
         +--> audit event

Existing running Jobs require separate execution-state handling.

Revoking an artifact does not automatically imply that a running robot must
stop unless an explicit safety/security policy requires it.

## 62. Deletion

Deletion should normally be logical first.

    READY
      |
      v
    DELETE REQUEST
      |
      v
    DELETED

Physical object deletion may occur asynchronously after retention and legal
hold requirements are satisfied.

## 63. Garbage Collection

A storage cleanup worker may process:

- abandoned uploads;
- expired artifacts;
- deleted objects;
- orphaned objects;
- failed upload sessions.

Cleanup must be conservative.

## 64. Orphan Detection

Periodic reconciliation should identify:

    Database Artifact
        |
        +--> Object exists = normal
        |
        +--> Object missing = storage failure

and:

    Object Storage Object
        |
        +--> DB record exists = normal
        |
        +--> DB record missing = orphan

Orphan deletion requires a safety window.

## 65. Upload Failure Modes

Possible failures:

- invalid authentication;
- project access denied;
- upload URL expired;
- object storage unavailable;
- upload interrupted;
- checksum mismatch;
- malformed package;
- invalid manifest;
- invalid signature;
- incompatible platform;
- artifact too large.

## 66. Upload Recovery

Interrupted uploads should be recoverable when the storage provider supports
multipart/resumable uploads.

The upload session must have an expiration time.

Expired sessions must not become accepted artifacts.

## 67. Partial Uploads

A partial object must never become executable.

Artifact state remains:

    UPLOADING

until verified completion.

## 68. Storage Failure

If object storage is unavailable:

    Upload
      |
      v
    Storage Error
      |
      v
    ARTIFACT_UPLOAD_INCOMPLETE /
    INFRA_STORAGE_UNAVAILABLE

The API must not report successful artifact acceptance.

## 69. Digest Failure

If the digest does not match:

    Uploaded Object
         |
         v
    Digest Calculation
         |
         v
    Mismatch
         |
         v
    REJECTED

The object should be quarantined or deleted according to policy.

## 70. Signature Failure

If signature verification fails:

    Signature Verification
          |
          v
    ARTIFACT_SIGNATURE_INVALID
          |
          v
       REJECTED

No execution authorization is issued.

## 71. Manifest Failure

Malformed or unsupported manifest:

    Manifest Validation
          |
          v
    ARTIFACT_INVALID
          |
          v
       REJECTED

Validation details should identify safe diagnostic fields without exposing
sensitive payload content.

## 72. Compatibility Failure

If artifact cannot run on the selected platform:

    Compatibility Check
          |
          v
    ARTIFACT_INCOMPATIBLE
          |
          v
       REJECTED

Compatibility failure should be deterministic and actionable.

## 73. Validation Failure

Transient validation infrastructure failure should be distinguishable from
artifact invalidity.

Example:

    Validator unavailable
          |
          v
    VALIDATION_FAILED
          |
          v
    Retry

This must not be confused with:

    Invalid artifact
          |
          v
    ARTIFACT_INVALID
          |
          v
    REJECT

## 74. Validation Retry

Validation may be retried when:

- storage temporarily unavailable;
- validator dependency unavailable;
- platform metadata service unavailable.

Validation must not be retried indefinitely.

## 75. Artifact Events

Required events include:

    artifact.created
    artifact.uploaded
    artifact.validating
    artifact.accepted
    artifact.rejected
    artifact.revoked
    artifact.expired

Optional:

    artifact.deleted
    artifact.validation_failed
    artifact.downloaded
    artifact.restored

## 76. Event Payload

Example:

    {
        "protocol_version": "1.0",
        "event_id": "evt-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "event": "artifact.accepted",
        "resource": {
            "type": "artifact",
            "id": "artifact-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "sequence": 5,
        "data": {
            "artifact_id": "artifact-001",
            "digest": "...",
            "platform_id": "humanoid-a"
        }
    }

## 77. Event Semantics

Events indicate state changes.

They do not replace artifact state stored in PostgreSQL.

WebSocket consumers must reconcile with:

    GET /api/v1/artifacts/{artifact_id}

after reconnect or event gaps.

## 78. Event Reliability

Business-critical artifact events should use an outbox or equivalent reliable
publication mechanism.

Preferred:

    Artifact DB Transaction
          |
          +--> Artifact State
          +--> Outbox Event
          |
          v
        Commit
          |
          v
    Event Publisher
          |
          v
    WebSocket / Consumers

## 79. Download Audit

Downloads may be audited with:

- artifact ID;
- principal;
- organization;
- purpose;
- Job/Run context where applicable;
- timestamp;
- result;
- user agent or agent identity where appropriate.

Audit logs must not contain signed URLs or credentials.

## 80. Access Logging

The service should record:

- create;
- upload;
- validate;
- accept;
- reject;
- download authorization;
- revoke;
- expire;
- delete.

Sensitive object-storage credentials must never be logged.

## 81. Observability

Metrics should include:

- uploads started;
- uploads completed;
- upload failures;
- bytes uploaded;
- validation count;
- validation latency;
- validation failures;
- digest failures;
- signature failures;
- compatibility failures;
- download count;
- download failures;
- revoked artifacts;
- expired artifacts;
- storage failures;
- orphan objects.

## 82. Performance

The Artifact Service should avoid proxying large binaries through application
servers where direct object-storage upload/download is available.

API servers should primarily process:

- metadata;
- authorization;
- validation orchestration;
- signed URL generation;
- state transitions.

## 83. Size Limits

Artifact limits must be configurable.

At minimum define:

- maximum artifact size;
- maximum manifest size;
- maximum number of package entries;
- maximum expanded size;
- maximum compression ratio;
- maximum upload duration.

Limits should be enforced before expensive processing.

## 84. Security Controls

Required controls include:

- TLS;
- authenticated API;
- server-side authorization;
- private object storage;
- signed URLs;
- digest validation;
- signature validation;
- path traversal protection;
- package bomb protection;
- malware/security scanning where required;
- rate limiting;
- audit logging.

## 85. Artifact Isolation

Validation and inspection must not execute arbitrary artifact code.

Manifest and package inspection must occur in a constrained environment.

Executable content must remain inert during validation.

## 86. Malware/Threat Scanning

Security scanning may be added as a validation stage:

    Structure
       |
       v
    Manifest
       |
       v
    Integrity
       |
       v
    Signature
       |
       v
    Security Scan
       |
       v
    Compatibility
       |
       v
    ACCEPTED

The exact scanning technology remains an implementation decision.

## 87. Download Security

Signed download URLs should have:

- short lifetime;
- artifact-specific scope;
- HTTPS;
- no write permission;
- no bucket listing;
- no broader object-storage access.

Lab Agent access should be similarly scoped.

## 88. URL Expiration

Expired download URLs must become unusable.

Clients should request a new URL rather than retrying an expired URL indefinitely.

## 89. Artifact Caching

Caching may be used for:

- manifest metadata;
- compatibility metadata;
- frequently accessed artifact metadata.

Binary caching must preserve:

- artifact identity;
- digest;
- authorization;
- revocation status.

A revoked artifact must not remain executable through stale cache.

## 90. Compatibility Cache

Platform compatibility information may be cached with explicit TTL.

When security or compatibility policy changes, cache invalidation must be
possible.

## 91. Artifact Service and Job Service

The boundary is:

    Job Service
         |
         | artifact reference / validation
         v
    Artifact Service

Artifact Service answers:

- Does artifact exist?
- Is it accepted?
- Is it compatible?
- Is it executable?
- Can this principal/agent download it?

Job Service answers:

- Is this Job authorized?
- Is booking valid?
- Are credits available?
- Which resource should run it?

## 92. Artifact Service and Platform Service

Platform Service owns:

- platform definitions;
- versions;
- capabilities;
- compatibility policies.

Artifact Service owns:

- artifact-declared requirements;
- artifact validation result.

## 93. Artifact Service and Lab Service

Lab Service owns:

- resource availability;
- Lab Agent identity;
- resource health.

Artifact Service provides:

- artifact metadata;
- compatibility;
- controlled artifact access.

## 94. Artifact Service and Result Service

Artifact Service owns executable inputs.

Result Service owns execution outputs.

The two must not share ownership of the same binary lifecycle.

## 95. Artifact Service and Billing

Artifact creation itself may be free or commercial policy may apply.

Artifact Service must not own monetary billing logic.

If storage quotas become billable, Billing Service owns the financial transaction.

## 96. Artifact Lifecycle Example

    Local Build
        |
        v
    Package .krv
        |
        v
    Sign
        |
        v
    Create Artifact
        |
        v
    Upload
        |
        v
    Validate
        |
        v
    ACCEPTED
        |
        v
    READY
        |
        v
    Book Robot
        |
        v
    Job
        |
        v
    Run
        |
        v
    Download to Lab
        |
        v
    Execute

## 97. Failure Lifecycle Example

    Upload
      |
      v
    VALIDATING
      |
      v
    Digest mismatch
      |
      v
    REJECTED
      |
      v
    artifact.rejected
      |
      v
    User fixes local package
      |
      v
    New Artifact

The original rejected artifact remains auditable.

## 98. New Artifact on Correction

Corrections should not mutate the rejected artifact.

    Artifact A
       |
       v
    REJECTED

    Corrected Build
       |
       v
    Artifact B
       |
       v
    READY

This preserves forensic and development history.

## 99. Artifact Retention and Jobs

An artifact must not be physically deleted while referenced by:

- active Job;
- active Run;
- retained Result metadata;
- legal hold;
- required audit record.

Reference-aware retention is required.

## 100. Artifact Deletion Dependency

Before physical deletion:

    Artifact
       |
       v
    Active References?
       |
       +--> Yes --> Retain
       |
       +--> No --> Retention Eligible
                       |
                       v
                    Delete Object

## 101. Administrative Override

Administrative operations must require:

- elevated role;
- explicit authorization;
- reason;
- audit record.

Examples:

- revoke;
- restore;
- delete;
- retention override.

## 102. Audit Integrity

Audit records should be append-oriented.

Deleting an artifact must not erase evidence that it existed.

## 103. API Error Mapping

Representative errors:

| Error | Meaning |
|---|---|
| `ARTIFACT_NOT_FOUND` | Artifact absent |
| `ARTIFACT_INVALID` | Package invalid |
| `ARTIFACT_TOO_LARGE` | Size exceeded |
| `ARTIFACT_DIGEST_MISMATCH` | Content differs |
| `ARTIFACT_SIGNATURE_INVALID` | Signature invalid |
| `ARTIFACT_UNSIGNED` | Required signature absent |
| `ARTIFACT_INCOMPATIBLE` | Platform incompatible |
| `ARTIFACT_RUNTIME_UNSUPPORTED` | Runtime unsupported |
| `ARTIFACT_SDK_UNSUPPORTED` | SDK unsupported |
| `ARTIFACT_CAPABILITY_MISSING` | Required capability unavailable |
| `ARTIFACT_REJECTED` | Policy rejected |
| `ARTIFACT_REVOKED` | Artifact revoked |
| `ARTIFACT_EXPIRED` | Artifact expired |
| `ARTIFACT_UPLOAD_INCOMPLETE` | Upload incomplete |

## 104. Infrastructure Errors

Infrastructure failures should use existing platform error taxonomy, including:

    INFRA_STORAGE_UNAVAILABLE
    INFRA_DATABASE_UNAVAILABLE
    UPSTREAM_TIMEOUT
    UPSTREAM_UNAVAILABLE

These must not be converted into permanent artifact-invalid errors.

## 105. API Response Semantics

Artifact creation may return:

    201 SUCCESS

Upload/validation may return:

    202 ACCEPTED

with:

    artifact_id
    operation_id

The final artifact state is retrieved through REST and/or events.

## 106. Asynchronous Validation

Large artifacts should be validated asynchronously.

Flow:

    Upload
      |
      v
    UPLOADED
      |
      v
    202 ACCEPTED
      |
      v
    VALIDATING
      |
      v
    ACCEPTED / REJECTED

This avoids holding an HTTP request open during expensive validation.

## 107. Validation Worker

Validation worker responsibilities:

- load artifact;
- verify object;
- inspect package;
- validate manifest;
- calculate digest;
- verify signature;
- check compatibility;
- apply policy;
- persist validation;
- transition state;
- emit event.

## 108. Validation Worker Idempotency

A duplicate validation message must not create conflicting acceptance records.

Validation results should be identified by:

- artifact ID;
- validation policy version;
- validator version.

## 109. Object Storage Reconciliation

Periodic reconciliation should verify:

- accepted artifact has object;
- object size matches metadata;
- digest matches metadata where practical;
- deleted artifact object is eventually removed;
- no orphaned object remains indefinitely.

## 110. Database/Object Consistency

The service must tolerate temporary inconsistency between DB and object storage.

Example:

    DB Commit
       |
       X
    Object Upload Failure

or:

    Object Upload
       |
       X
    DB Commit Failure

Recovery workers must reconcile both sides.

## 111. Upload Transaction Model

Do not hold a database transaction open during large binary upload.

Preferred:

    Create Metadata
         |
         v
    Upload Object
         |
         v
    Verify Object
         |
         v
    Commit Accepted State

Database transactions should remain short.

## 112. Artifact Metadata Transaction

State transitions must be atomic.

Example:

    UPLOADED
       |
       +--> validation result
       |
       +--> state transition
       |
       +--> outbox event
       |
       v
    COMMIT

## 113. Concurrency

Concurrent operations must be controlled.

Examples:

- validate vs revoke;
- delete vs download;
- expire vs execution;
- duplicate completion requests.

The service must use optimistic or pessimistic concurrency where appropriate.

## 114. Revocation Race

If revocation occurs while a Job is being created:

    Artifact READY
         |
       revoke
         |
         v
    Artifact REVOKED

The Job admission check must see the authoritative current state.

A revoked artifact must not receive new execution authorization.

## 115. Download Race

If revocation occurs after a signed URL is issued, the system must define
whether the URL remains usable for its short lifetime.

For production execution, Lab Agent authorization should perform a current
artifact-state check before deployment.

## 116. Artifact Security Boundary

The artifact is untrusted until:

    Structure
       |
       v
    Manifest
       |
       v
    Digest
       |
       v
    Signature
       |
       v
    Policy
       |
       v
    Compatibility
       |
       v
    Execution Authorization

## 117. Phase Mapping

| Phase | Artifact Service Scope |
|---|---|
| Phase 0 | Domain and contracts |
| Phase 1 | Metadata/API foundation |
| Phase 2 | Local artifact integration |
| Phase 3 | Upload/storage/validation |
| Phase 4 | Policy and commercial integration |
| Phase 5 | Job execution integration |
| Phase 6 | Lab Agent deployment |
| Phase 7 | Results/realtime |
| Phase 8 | Production security and lifecycle |

## 118. Phase 0

Define:

- Artifact domain;
- Artifact states;
- manifest contract;
- digest contract;
- signature contract;
- repository interfaces;
- error codes;
- events.

No physical artifact upload is required.

## 119. Phase 1

Implement:

- artifact metadata;
- organization/project ownership;
- REST CRUD;
- authorization;
- idempotency;
- database migrations;
- API contract.

## 120. Phase 2

Integrate Studio:

- local `.krv` packaging;
- manifest generation;
- local inspection;
- local checksum;
- local signing;
- source exclusion;
- artifact upload preparation.

## 121. Phase 3

Implement:

- object storage;
- upload sessions;
- completion;
- asynchronous validation;
- digest verification;
- signature verification;
- compatibility validation;
- artifact events.

## 122. Phase 4

Integrate:

- retention;
- quotas;
- storage policies;
- credit/commercial policies where required;
- administrative lifecycle controls.

## 123. Phase 5

Integrate Job Service:

    Artifact READY
         |
         v
    Job Admission
         |
         v
    Compatibility
         |
         v
    Scheduling
         |
         v
    Execution

Artifact state becomes a hard execution prerequisite.

## 124. Phase 6

Integrate Lab Agent:

- controlled download;
- digest verification;
- signature verification;
- runtime compatibility;
- deployment authorization;
- artifact fetch failures;
- agent-side verification.

## 125. Phase 7

Integrate:

- run references;
- result relationships;
- realtime artifact/job events;
- experiment workflows;
- rerun workflows.

## 126. Phase 8

Harden:

- signing key rotation;
- revocation;
- malware/security scanning;
- retention automation;
- object reconciliation;
- disaster recovery;
- load testing;
- large artifact handling;
- operational runbooks.

## 127. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Source code uploaded | Local packaging boundary + source detection |
| Artifact tampering | Digest + signature |
| Compromised signing key | Secure key management + rotation/revocation |
| Object exposure | Private storage + signed URLs |
| Cross-tenant access | Server-side authorization |
| Partial upload execution | Completion verification |
| Digest mismatch | Independent digest calculation |
| Invalid manifest | Schema validation |
| Package traversal | Secure package inspection |
| Package bomb | Size/expansion limits |
| Stale compatibility cache | Versioned policy + invalidation |
| Deleted active artifact | Reference-aware retention |
| Orphan object | Reconciliation worker |
| Validation outage | Retry + explicit infrastructure errors |
| Duplicate validation | Idempotent validation |
| Revoked artifact execution | Current-state checks |
| URL leakage | Short-lived URLs |
| Large file bottleneck | Direct object storage |
| Metadata/object inconsistency | Reconciliation |
| Audit loss | Append-oriented audit |
| Binary reverse engineering | Explicitly acknowledge artifact exposure |
| Artifact malware | Optional security scanning |
| Storage growth | Retention/lifecycle policy |

## 128. Open Questions

1. What exact `.krv` binary container specification will be standardized?
2. What is the canonical digest scope?
3. Will SHA-256 be mandatory for production?
4. Which signature algorithm will be mandatory?
5. What PKI/key-management system will be used?
6. Will customer artifacts be customer-signed, platform-signed, or both?
7. Will signing occur entirely on the developer machine?
8. Will RaaS provide optional signing infrastructure?
9. What maximum artifact size will production permit?
10. What maximum expanded package size will be permitted?
11. Will resumable uploads be required for MVP?
12. What object-storage provider will be used?
13. What exact retention periods apply to each plan?
14. How long should rejected artifacts remain available?
15. What is the legal hold mechanism?
16. Will artifact deduplication be implemented?
17. Will artifacts be encrypted individually in addition to storage encryption?
18. What security scanner will be used?
19. How frequently should object reconciliation run?
20. How will signing-key revocation propagate to Lab Agents?
21. What is the exact compatibility policy language?
22. Will platform versions use semantic versioning?
23. How will backward-compatible SDK ranges be expressed?
24. Should `ACCEPTED` and `READY` remain separate states?
25. What administrative restore policy is required after deletion?
26. What audit retention period is mandatory?
27. What download-audit granularity is required?
28. What customer-visible validation diagnostics are safe to expose?

## 129. Full Acceptance Criteria

### Artifact Model

- [ ] Artifact has a stable opaque ID.
- [ ] Artifact has immutable content identity.
- [ ] Artifact stores a cryptographic digest.
- [ ] Artifact references a project.
- [ ] Artifact references an organization.
- [ ] Artifact identifies target platform.
- [ ] Artifact records architecture.
- [ ] Artifact records runtime compatibility.
- [ ] Artifact records SDK compatibility.
- [ ] Artifact lifecycle is durable.
- [ ] Artifact history is auditable.

### Manifest

- [ ] Manifest format is versioned.
- [ ] Required fields are validated.
- [ ] Platform is validated.
- [ ] Architecture is validated.
- [ ] SDK version is validated.
- [ ] KritvaOS constraints are validated.
- [ ] Capabilities are validated.
- [ ] Entrypoint is validated.
- [ ] Manifest size is bounded.
- [ ] Unknown/prohibited fields are handled according to policy.

### Integrity

- [ ] Every accepted artifact has a digest.
- [ ] Digest algorithm is recorded.
- [ ] Digest is independently verified.
- [ ] Digest mismatch rejects the artifact.
- [ ] Digest is immutable after acceptance.
- [ ] Lab Agent verifies the digest before execution.

### Signature

- [ ] Production signature policy is defined.
- [ ] Signature algorithm is recorded.
- [ ] Signature is independently verified.
- [ ] Invalid signatures are rejected.
- [ ] Missing required signatures are rejected.
- [ ] Signing keys are not stored in application source.
- [ ] Key rotation is supported by architecture.
- [ ] Revocation can invalidate compromised artifacts.

### Upload

- [ ] Upload requires authentication.
- [ ] Upload requires project authorization.
- [ ] Upload is organization scoped.
- [ ] Upload size is limited.
- [ ] Upload sessions expire.
- [ ] Partial uploads cannot execute.
- [ ] Upload completion is independently verified.
- [ ] Object existence is checked.
- [ ] Object size is checked.
- [ ] Object digest is checked.
- [ ] Upload failure is recoverable.
- [ ] Direct object-storage upload is supported where appropriate.

### Package Security

- [ ] Package structure is validated.
- [ ] Path traversal is rejected.
- [ ] Absolute paths are rejected where unsupported.
- [ ] Malformed archives are rejected.
- [ ] Package expansion is bounded.
- [ ] Package bomb protections exist.
- [ ] Arbitrary artifact code is not executed during validation.
- [ ] Source leakage controls are implemented.

### Compatibility

- [ ] Platform ID is checked.
- [ ] Platform version is checked.
- [ ] Architecture is checked.
- [ ] KritvaOS version is checked.
- [ ] SDK version is checked.
- [ ] Artifact format version is checked.
- [ ] Required capabilities are checked.
- [ ] Compatibility failures use stable error codes.
- [ ] Compatibility policy is versioned.

### Storage

- [ ] PostgreSQL stores authoritative metadata.
- [ ] Object storage stores binary payloads.
- [ ] Object storage is private by default.
- [ ] Object keys are not user-controlled.
- [ ] Storage credentials are not exposed to clients.
- [ ] Storage encryption is enabled.
- [ ] Object lifecycle is managed.
- [ ] Orphan detection exists.
- [ ] Object/database reconciliation exists.

### Access Control

- [ ] Organization isolation is enforced.
- [ ] Project access is enforced.
- [ ] Server-side authorization is authoritative.
- [ ] Client tenant IDs are not trusted.
- [ ] Read access is distinct from download access.
- [ ] Download access is distinct from execution access.
- [ ] Lab Agent access is scoped.
- [ ] Administrative operations are separately authorized.

### Download

- [ ] Downloads require authorization.
- [ ] Download URLs are short-lived.
- [ ] Download URLs are artifact scoped.
- [ ] Download URLs do not expose storage credentials.
- [ ] Revoked artifacts cannot be used for new execution.
- [ ] Lab Agent download is controlled.
- [ ] Download activity is auditable where required.

### Lifecycle

- [ ] CREATED state exists.
- [ ] UPLOADING state exists.
- [ ] UPLOADED state exists.
- [ ] VALIDATING state exists.
- [ ] ACCEPTED state exists.
- [ ] READY state exists or equivalent semantics are documented.
- [ ] REJECTED state exists.
- [ ] REVOKED state exists.
- [ ] EXPIRED state exists.
- [ ] DELETED state exists.
- [ ] Invalid transitions are rejected.
- [ ] Accepted content is immutable.

### Retention

- [ ] Retention policy is configurable.
- [ ] Expiration is explicit.
- [ ] Revocation is distinct from expiration.
- [ ] Active Jobs protect referenced artifacts.
- [ ] Active Runs protect referenced artifacts.
- [ ] Legal holds can prevent deletion.
- [ ] Physical deletion may be asynchronous.
- [ ] Audit records survive artifact deletion.
- [ ] Garbage collection is recoverable and conservative.

### Events

- [ ] `artifact.created` is emitted.
- [ ] `artifact.uploaded` is emitted.
- [ ] `artifact.validating` is emitted.
- [ ] `artifact.accepted` is emitted.
- [ ] `artifact.rejected` is emitted.
- [ ] `artifact.revoked` is emitted.
- [ ] `artifact.expired` is emitted.
- [ ] Event IDs are unique.
- [ ] Event delivery is at least once.
- [ ] Event consumers tolerate duplicates.
- [ ] Event state can be reconciled through REST.
- [ ] Critical events use reliable publication.

### Failure Handling

- [ ] Storage failures are distinguishable from artifact failures.
- [ ] Digest failures are deterministic.
- [ ] Signature failures are deterministic.
- [ ] Manifest failures are deterministic.
- [ ] Compatibility failures are deterministic.
- [ ] Validation infrastructure failures are retryable.
- [ ] Validation retries are bounded.
- [ ] Upload sessions expire.
- [ ] Orphan objects are recoverable.
- [ ] Database/object inconsistency is reconciled.

### Integration

- [ ] Artifact integrates with Project Service.
- [ ] Artifact integrates with Platform Service.
- [ ] Artifact integrates with Job Service.
- [ ] Artifact integrates with Lab Service.
- [ ] Artifact integrates with Result Service.
- [ ] Artifact integrates with Audit Service.
- [ ] Artifact does not own booking state.
- [ ] Artifact does not own credit state.
- [ ] Artifact does not directly control robots.

### Observability

- [ ] Upload metrics exist.
- [ ] Validation metrics exist.
- [ ] Digest failure metrics exist.
- [ ] Signature failure metrics exist.
- [ ] Compatibility failure metrics exist.
- [ ] Download metrics exist.
- [ ] Storage metrics exist.
- [ ] Orphan metrics exist.
- [ ] Artifact lifecycle logs include correlation IDs.
- [ ] Secrets are excluded from logs.

### Testing

- [ ] Manifest validation is unit tested.
- [ ] Digest validation is tested.
- [ ] Signature validation is tested.
- [ ] Compatibility validation is tested.
- [ ] Upload lifecycle is integration tested.
- [ ] Object-storage failures are tested.
- [ ] Duplicate completion is tested.
- [ ] Idempotency is tested.
- [ ] Access control is tested.
- [ ] Cross-tenant isolation is tested.
- [ ] Download authorization is tested.
- [ ] Revocation is tested.
- [ ] Expiration is tested.
- [ ] Garbage collection is tested.
- [ ] Database/object reconciliation is tested.
- [ ] End-to-end artifact-to-job execution is tested.

## 130. Final Architectural Invariants

1. `.krv` is the execution artifact boundary.
2. Source code remains local by default.
3. Artifact identity is independent of filename.
4. Accepted artifacts are immutable.
5. PostgreSQL owns artifact metadata and lifecycle.
6. Object storage owns binary payloads.
7. Artifact binaries are private by default.
8. Upload completion is independently verified.
9. Every accepted artifact has a cryptographic digest.
10. Production artifacts require trusted signatures.
11. Manifest data is untrusted until validated.
12. Artifact compatibility is explicit.
13. Platform Service owns platform definitions.
14. Artifact Service owns artifact requirements and validation.
15. Job Service owns execution intent.
16. Lab Service owns physical resource state.
17. Lab Agent independently verifies artifacts before execution.
18. Download URLs are short-lived and authorized.
19. Client-provided tenant context is never authoritative.
20. Cross-tenant artifact access is denied by default.
21. Artifact validation is asynchronous for expensive operations.
22. Validation workers are idempotent.
23. Queue delivery is not authoritative artifact state.
24. Artifact events are at-least-once.
25. REST remains authoritative for durable artifact state.
26. Revocation is distinct from expiration.
27. Deletion does not erase audit history.
28. Active execution references protect required artifacts.
29. Database/object-storage consistency is reconciled.
30. Artifact failures are distinguished from infrastructure failures.
31. Physical robot execution is never performed by Artifact Service.
32. Artifact Service never replaces Job/Run orchestration.
33. Security failures fail closed.
34. Artifact lifecycle is observable and auditable.
35. The artifact boundary supports the core RaaS principle:
    **Build locally. Book remotely. Run on real robots.**

## 131. Completion Condition

The Artifact Service is complete when a developer can:

    Build locally
       |
       v
    Package .krv
       |
       v
    Sign
       |
       v
    Create Artifact
       |
       v
    Upload
       |
       v
    Validate
       |
       v
    READY
       |
       v
    Authorize Job
       |
       v
    Controlled Download
       |
       v
    Lab Verification
       |
       v
    Remote Execution

while the platform can reliably detect and handle:

- malformed artifacts;
- source leakage;
- digest mismatch;
- signature failure;
- platform incompatibility;
- SDK incompatibility;
- missing capabilities;
- interrupted uploads;
- storage failures;
- unauthorized access;
- revoked artifacts;
- expired artifacts;
- orphaned objects;
- database/object inconsistencies;
- worker crashes;
- duplicate requests;
- validation infrastructure failures.

The resulting service must provide a trustworthy execution-artifact boundary
between the customer's local development environment and the Kritva RaaS
remote robotics infrastructure.
