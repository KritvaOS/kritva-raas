# B-M02 — Artifact

## Milestone Dossier

**Milestone ID:** B-M02-ARTIFACT  
**Product:** Kritva RaaS  
**Primary Phase:** P2 BUILD & ARTIFACT  
**Supporting Phases:** P3 CONTROL PLANE  
**Primary Surface:** RaaS Control Plane / Backend  
**Technology:** TypeScript/Node.js, PostgreSQL, provider-neutral object storage,
REST API v1, artifact security/signing services  
**Architecture:** Production-oriented Modular Monolith  
**Priority:** PRI-0 (critical invariant per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** Establish the authoritative backend artifact registry and
secure artifact lifecycle for `.krv` packages, including upload, validation,
versioning, signing verification, authorization, retention, revocation and
execution-readiness checks.

---

# 1 Objective

## 1.1 Milestone Objective

B-M02 establishes the backend artifact management boundary for Kritva RaaS.

The artifact is the primary software object that crosses the developer-machine
boundary into the RaaS Control Plane.

The architectural boundary is:

    Customer Source Code
            |
            v
      Developer Machine
            |
            v
       RaaS Studio
            |
            v
     Local Build/Test
            |
            v
      Package + Scan
            |
            v
       Sign Artifact
            |
            | .krv artifact only
            v
      RaaS Control Plane
            |
            v
      Artifact Registry
            |
            v
    Compatibility Validation
            |
            v
       Booking / Job
            |
            v
          Lab

B-M02 does not perform local compilation.

B-M02 does not receive source code as part of the normal artifact upload flow.

B-M02 owns the server-side lifecycle and trust boundary for artifacts.

## 1.2 Product Goal

The user should be able to:

1. build an application locally;
2. generate a `.krv` package;
3. validate the package locally;
4. sign the artifact;
5. upload the artifact;
6. register it with a Project;
7. inspect artifact metadata;
8. verify integrity and signature;
9. inspect compatibility;
10. create artifact versions;
11. revoke an artifact when necessary;
12. download or retrieve authorized metadata;
13. retain or archive artifacts according to policy;
14. use an approved artifact for later execution.

## 1.3 Backend Responsibility

B-M02 establishes the authoritative server-side record for:

- artifact identity;
- artifact version;
- Project ownership;
- organization ownership;
- manifest metadata;
- artifact format;
- architecture;
- platform compatibility;
- runtime compatibility;
- SDK compatibility;
- capabilities;
- checksum;
- signature metadata;
- validation state;
- trust state;
- lifecycle;
- retention;
- revocation.

The binary artifact itself is stored in object storage.

PostgreSQL stores authoritative metadata and lifecycle state.

## 1.4 Security Objective

The artifact boundary must protect against:

- unauthorized artifact upload;
- cross-tenant access;
- artifact tampering;
- checksum mismatch;
- signature mismatch;
- revoked signing identity;
- malformed package;
- unsupported artifact format;
- incompatible platform;
- malicious package contents;
- prohibited source content;
- artifact substitution;
- stale or revoked artifacts being executed.

## 1.5 Source-Code Privacy Objective

The normal upload contract is:

    Source
      |
      X
      |
    Control Plane

    Artifact
      |
      v
    Control Plane

The backend must not require:

- source repository;
- source archive;
- Git metadata;
- compiler input files;
- local workspace;
- build logs containing source;
- developer credentials.

The backend may inspect the artifact package for security and policy validation.

This inspection must not be interpreted as permission to upload arbitrary source.

## 1.6 Trust Objective

The artifact trust model is:

    Package
       |
       v
    Structural Validation
       |
       v
    Security Scan
       |
       v
    Integrity Verification
       |
       v
    Signature Verification
       |
       v
    Compatibility Validation
       |
       v
    Policy Approval
       |
       v
    Execution Eligible

Execution eligibility is a server-side state.

A client-side "valid" indicator is never authoritative.

## 1.7 Artifact Lifecycle Objective

Baseline lifecycle:

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
       +----> QUARANTINED
       |
       v
    VALID
       |
       v
    APPROVED
       |
       +----> REVOKED
       |
       +----> EXPIRED
       |
       v
    ARCHIVED
       |
       v
    PURGED

The exact transition implementation may be refined during implementation, but
the state model must remain explicit.

## 1.8 Versioning Objective

Artifacts are immutable versioned objects.

Conceptually:

    Application
        |
        +--> Version 1.0.0
        |
        +--> Version 1.1.0
        |
        +--> Version 1.2.0

A new artifact binary must produce a new artifact version.

An uploaded artifact must not silently replace an existing immutable artifact.

## 1.9 Registry Objective

The registry provides:

- searchable artifact metadata;
- artifact versions;
- lifecycle status;
- validation status;
- trust status;
- compatibility information;
- ownership;
- retention state;
- revocation state.

The registry is not a general source-code repository.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M02 includes:

- artifact domain model;
- artifact registry;
- artifact versioning;
- artifact upload;
- resumable upload foundation where supported;
- object-storage integration;
- manifest parsing;
- structural validation;
- checksum validation;
- signature verification;
- signing metadata;
- security scan integration boundary;
- compatibility validation;
- artifact authorization;
- Project association;
- organization ownership;
- artifact lifecycle;
- artifact retention;
- artifact archival;
- artifact revocation;
- artifact listing;
- artifact detail;
- artifact metadata download;
- authorized artifact retrieval;
- audit events;
- idempotent upload registration;
- artifact reconciliation;
- execution-readiness state.

## 2.2 Explicitly Out of Scope

B-M02 does not implement:

- local compiler;
- local build system;
- local package creation;
- Studio build UI;
- booking;
- credit consumption;
- Job creation;
- Run orchestration;
- Lab Agent execution;
- robot control;
- physical E-stop;
- WebRTC;
- telemetry;
- result generation;
- experiment comparison;
- payment processing;
- full CI/CD platform;
- public artifact marketplace.

## 2.3 Upload Boundary

The backend accepts:

    `.krv` artifact

It does not accept:

    source repository
    source archive
    arbitrary compiler workspace
    Git repository
    developer home directory

## 2.4 Registry Boundary

The registry owns metadata.

Object storage owns binary payloads.

Conceptually:

    PostgreSQL
       |
       +--> artifact_id
       +--> version
       +--> project
       +--> organization
       +--> manifest
       +--> checksum
       +--> signature
       +--> validation state
       +--> lifecycle
       +--> retention

    Object Storage
       |
       +--> artifact binary
       +--> package content
       +--> optional SBOM
       +--> optional security evidence

## 2.5 Security Boundary

B-M02 must integrate with:

- authentication;
- authorization;
- secrets management;
- key management;
- audit logging;
- source-code privacy;
- threat model.

Artifact signing keys must not be distributed to ordinary upload workers.

---

# 3 Dependencies

## 3.1 Upstream Dependencies

B-M02 depends on:

- B-M01 Control Plane;
- API v1;
- identity;
- organization;
- authorization;
- Project domain;
- PostgreSQL;
- migration framework;
- object-storage abstraction;
- audit foundation;
- idempotency foundation.

## 3.2 Security Dependencies

B-M02 depends on:

- `docs/security/ARTIFACT_SECURITY.md`;
- `docs/security/SOURCE_CODE_PRIVACY.md`;
- `docs/security/AUTHENTICATION.md`;
- `docs/security/AUTHORIZATION.md`;
- `docs/security/SECRETS_MANAGEMENT.md`;
- `docs/security/KEY_MANAGEMENT.md`;
- `docs/security/THREAT_MODEL.md`.

## 3.3 Frontend Dependencies

F-M03 Build & Artifact consumes B-M02 for:

- artifact upload;
- artifact registry;
- validation status;
- signature status;
- artifact detail;
- compatibility status;
- artifact version list.

## 3.4 Execution Dependencies

F-M05 Execution later consumes:

- artifact authorization;
- execution eligibility;
- artifact compatibility;
- artifact immutability;
- revocation state.

## 3.5 Database Dependencies

B-M02 uses:

- `artifact` logical schema;
- `project` ownership;
- `organization` ownership;
- `platform` catalog;
- `audit`;
- `system` idempotency;
- object-storage references.

## 3.6 Object Storage Dependency

Object storage must provide or support:

- unique object keys;
- immutable object references;
- checksum metadata;
- controlled access;
- lifecycle management;
- server-side encryption where applicable;
- retention controls;
- deletion controls;
- integrity verification.

The backend must not depend on a specific cloud provider.

---

# 4 Deliverables

## 4.1 Artifact Registry

The registry provides:

- artifact identity;
- application identity;
- version;
- Project;
- organization;
- platform target;
- architecture;
- runtime;
- SDK;
- capabilities;
- checksum;
- signature;
- validation state;
- trust state;
- lifecycle;
- retention.

## 4.2 Artifact Domain

Conceptual model:

    Artifact
       |
       +--> Artifact Version
               |
               +--> Manifest
               +--> Binary
               +--> Signature
               +--> Validation
               +--> Compatibility
               +--> Retention

The exact database representation may use an artifact table plus version and
supporting tables.

## 4.3 Upload Workflow

The preferred flow is:

    Create Upload Session
             |
             v
       Upload Binary
             |
             v
       Complete Upload
             |
             v
       Register Artifact
             |
             v
          Validate
             |
             v
          Approve
             |
             v
        Execution Ready

The binary upload should not require routing large payloads through application
memory.

## 4.4 Upload Session

An upload session should contain:

- upload ID;
- artifact/version identity;
- organization;
- Project;
- expected size;
- expected checksum where available;
- object-storage location;
- expiration;
- status;
- actor;
- idempotency key.

## 4.5 Manifest

Baseline manifest fields:

    {
        "artifact_format": "krv",
        "artifact_format_version": "1.0",
        "application_id": "vision-demo",
        "application_version": "1.2.0",
        "platform_id": "kritva-reference-robot",
        "platform_version": "1.0",
        "architecture": "arm64",
        "kritva_os_version": "1.0",
        "sdk_version": "1.0",
        "capabilities": [
            "vision",
            "camera"
        ],
        "entrypoint": "bin/app",
        "checksum": "sha256:...",
        "signature": {
            "algorithm": "..."
        }
    }

The exact manifest schema is versioned independently of the product release.

## 4.6 Structural Validation

Validation includes:

- package format;
- manifest existence;
- manifest schema;
- required fields;
- supported artifact format;
- valid entrypoint;
- expected directory structure;
- file path safety;
- size limits;
- prohibited package members;
- checksum.

## 4.7 Integrity Validation

The backend verifies:

    Expected SHA-256
           |
           v
      Uploaded Bytes
           |
           v
      Calculated SHA-256
           |
        +--+--+
        |     |
      MATCH  MISMATCH
        |     |
        v     v
      VALID  REJECT

A checksum mismatch must prevent approval.

## 4.8 Signature Verification

Signature verification validates:

- signature presence where required;
- algorithm;
- signer identity;
- certificate/key trust;
- signature over the correct payload;
- certificate/key status;
- revocation;
- expiration;
- trust policy.

A valid checksum does not prove authenticity.

A valid signature does not prove platform compatibility.

Both checks are required where policy requires them.

## 4.9 Compatibility Validation

Compatibility is evaluated against:

    Artifact Manifest
          |
          v
    Platform Version
          |
          +--> Architecture
          +--> KritvaOS
          +--> Runtime
          +--> SDK
          +--> Capabilities
          +--> Configuration
          |
          v
    Compatibility Result

The compatibility result may be:

    COMPATIBLE
    INCOMPATIBLE
    UNKNOWN
    REQUIRES_REVIEW

## 4.10 Artifact Approval

An artifact becomes execution eligible only when:

- upload is complete;
- structure is valid;
- checksum is valid;
- signature is valid where required;
- security scan passes;
- compatibility is valid;
- authorization permits use;
- retention/lifecycle permits use;
- artifact is not revoked;
- artifact is not expired.

## 4.11 Registry Search

Supported filters should include:

- Project;
- application ID;
- version;
- platform;
- architecture;
- lifecycle status;
- validation status;
- approval status;
- created date;
- actor.

Search remains tenant-scoped.

## 4.12 Artifact Access Control

Access is controlled by:

- organization membership;
- Project membership;
- role;
- artifact ownership;
- administrative permissions.

The backend must verify access independently of the Studio.

## 4.13 Retention

Retention applies to:

- artifact metadata;
- binary;
- validation evidence;
- signature evidence;
- security evidence.

Baseline states:

    ACTIVE
      |
      v
    ARCHIVED
      |
      v
    PURGED

Retention policy may depend on:

- organization policy;
- Project policy;
- artifact lifecycle;
- legal requirements;
- execution history;
- operational policy.

## 4.14 Revocation

An artifact may be revoked because of:

- compromised signing key;
- malicious content;
- critical vulnerability;
- incorrect artifact;
- policy violation;
- platform incompatibility discovered after approval.

Revocation must prevent new execution.

Historical execution records remain intact.

## 4.15 Artifact Versioning

Version identity must be immutable.

Example:

    vision-demo
       |
       +--> 1.0.0 -> artifact A
       +--> 1.1.0 -> artifact B
       +--> 1.2.0 -> artifact C

A new binary must not overwrite artifact A.

---

# 9 Risks

## 9.1 R-BM02-001 — Malicious Artifact

**Risk:** A malicious package reaches a robot.

**Impact:** Critical.

**Mitigation:**

- structural validation;
- security scanning;
- signature verification;
- execution eligibility gate;
- Lab Agent independent validation.

## 9.2 R-BM02-002 — Signing Key Compromise

**Risk:** Compromised key produces apparently trusted artifacts.

**Impact:** Critical.

**Mitigation:**

- KMS/HSM-equivalent protection;
- controlled signing service;
- key rotation;
- revocation;
- separation of duties;
- audit.

## 9.3 R-BM02-003 — Artifact Tampering

**Risk:** Binary changes after signing.

**Impact:** Critical.

**Mitigation:**

- checksum;
- immutable object;
- signature;
- object-store integrity;
- reconciliation.

## 9.4 R-BM02-004 — Cross-Tenant Artifact Access

**Risk:** Customer downloads another customer's artifact.

**Impact:** Critical.

**Mitigation:**

- tenant authorization;
- repository filtering;
- object-storage scoped access;
- security tests.

## 9.5 R-BM02-005 — Source Code Leakage

**Risk:** Artifact flow becomes a source-upload mechanism.

**Impact:** Critical.

**Mitigation:**

- strict package boundary;
- allowlist;
- source privacy scanner;
- API contract restrictions;
- tests.

## 9.6 R-BM02-006 — Incompatible Artifact Execution

**Risk:** Artifact approved despite incompatible architecture/runtime.

**Impact:** High.

**Mitigation:**

- compatibility validation;
- authoritative platform catalog;
- execution-readiness gate.

## 9.7 R-BM02-007 — Object Storage Inconsistency

**Risk:** Metadata and binary disagree.

**Impact:** High.

**Mitigation:**

- reconciliation;
- checksum;
- immutable storage references;
- state machine.

## 9.8 R-BM02-008 — Artifact Replacement

**Risk:** New upload silently replaces historical artifact.

**Impact:** High.

**Mitigation:**

- immutable version;
- digest identity;
- database constraints;
- no overwrite policy.

## 9.9 R-BM02-009 — Revocation Failure

**Risk:** Revoked artifact remains execution eligible.

**Impact:** Critical.

**Mitigation:**

- centralized eligibility check;
- revocation state;
- execution-side validation;
- tests.

## 9.10 R-BM02-010 — Retention Deletes Required Evidence

**Risk:** Artifact is purged while required historical execution evidence remains.

**Impact:** High.

**Mitigation:**

- retention policy;
- execution-reference awareness;
- legal/operational retention rules;
- controlled purge.

## 9.11 R-BM02-011 — Scanner Failure

**Risk:** Scan failure interpreted as clean.

**Impact:** Critical.

**Mitigation:**

- fail closed;
- explicit scan state;
- asynchronous processing;
- approval requires successful scan.

## 9.12 R-BM02-012 — Large Upload Resource Exhaustion

**Risk:** Large package consumes application memory or storage resources.

**Impact:** High.

**Mitigation:**

- direct/object-storage upload;
- size limits;
- streaming;
- quotas;
- bounded validation.

## 9.13 R-BM02-013 — Manifest Abuse

**Risk:** Malicious manifest causes path traversal or unsafe execution.

**Impact:** Critical.

**Mitigation:**

- schema validation;
- canonical path validation;
- entrypoint allowlist;
- package isolation.

## 9.14 R-BM02-014 — Version Confusion

**Risk:** Same version is associated with multiple binaries.

**Impact:** High.

**Mitigation:**

- immutable version;
- digest;
- conflict detection;
- explicit replacement through new version.

## 9.15 R-BM02-015 — Premature Execution Trust

**Risk:** Later Job service treats upload success as execution approval.

**Impact:** Critical.

**Mitigation:**

- explicit execution eligibility;
- server-side eligibility API;
- approval state;
- documented integration contract.

---

# 10 Exit Criteria

## 10.1 Functional Exit

- [ ] Artifact registry works.
- [ ] Upload session works.
- [ ] Upload completion works.
- [ ] Manifest validation works.
- [ ] Checksum verification works.
- [ ] Signature verification works.
- [ ] Security scanning integration works.
- [ ] Compatibility validation works.
- [ ] Artifact approval works.
- [ ] Artifact versioning works.
- [ ] Artifact revocation works.
- [ ] Artifact retention works.
- [ ] Artifact authorization works.
- [ ] Artifact reconciliation works.
- [ ] Execution eligibility works.

## 10.2 Security Exit

- [ ] Security review complete.
- [ ] Signing verification reviewed.
- [ ] Key management reviewed.
- [ ] Source privacy reviewed.
- [ ] Tenant isolation tested.
- [ ] Object-storage access reviewed.
- [ ] Malicious artifact tests pass.
- [ ] Revocation tests pass.
- [ ] Approval fail-closed behavior verified.

## 10.3 Database Exit

- [ ] Artifact schema migrated.
- [ ] Version constraints verified.
- [ ] Organization ownership verified.
- [ ] Project ownership verified.
- [ ] Digest/checksum fields verified.
- [ ] Lifecycle constraints verified.
- [ ] Indexes verified.
- [ ] Migration tests pass.

## 10.4 Object Storage Exit

- [ ] Provider-neutral adapter exists.
- [ ] Artifact upload works.
- [ ] Artifact retrieval works.
- [ ] Integrity metadata is recorded.
- [ ] Unauthorized access is denied.
- [ ] Retention policy is represented.
- [ ] Reconciliation works.
- [ ] Large artifact path is tested.

## 10.5 API Exit

- [ ] Artifact APIs reviewed.
- [ ] Upload APIs reviewed.
- [ ] Validation APIs reviewed.
- [ ] Compatibility APIs reviewed.
- [ ] Versioning behavior documented.
- [ ] Revocation behavior documented.
- [ ] Retention behavior documented.
- [ ] Error model documented.
- [ ] Contract tests pass.

## 10.6 Quality Exit

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] Manifest tests pass.
- [ ] Checksum tests pass.
- [ ] Signature tests pass.
- [ ] Security tests pass.
- [ ] Compatibility tests pass.
- [ ] Retention tests pass.
- [ ] Revocation tests pass.
- [ ] Tenant tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] CI passes.

## 10.7 Documentation Exit

- [ ] Artifact lifecycle documented.
- [ ] `.krv` manifest documented.
- [ ] Upload contract documented.
- [ ] Validation contract documented.
- [ ] Signature contract documented.
- [ ] Compatibility contract documented.
- [ ] Retention policy documented.
- [ ] Revocation policy documented.
- [ ] Execution eligibility documented.
- [ ] Security evidence documented.
- [ ] Tracking documents updated.

## 10.8 Formal Milestone Status

B-M02 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

Completion requires implementation, evidence, review and tracking updates.

---
