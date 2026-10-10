# B-M02-ARTIFACT — Review Checklist

Milestone: B-M02 — Artifact

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7 Test and Verification Plan

## 7.1 Test Pyramid

    Manifest Unit Tests
            |
            v
    Validation Unit Tests
            |
            v
    Repository Tests
            |
            v
    Object Storage Integration
            |
            v
    Security Verification
            |
            v
    API Contract Tests
            |
            v
    Artifact E2E
            |
            v
    Execution-Readiness E2E

## 7.2 Valid Artifact Test

Use a known-good `.krv`.

Verify:

    Upload
      |
      v
    Complete
      |
      v
    Validate
      |
      v
    Checksum
      |
      v
    Signature
      |
      v
    Security
      |
      v
    Compatibility
      |
      v
    APPROVED

## 7.3 Invalid Manifest Tests

Test:

- missing manifest;
- malformed JSON;
- unsupported format version;
- missing platform;
- missing architecture;
- missing entrypoint;
- invalid capability;
- invalid version;
- invalid checksum;
- invalid signature metadata.

Expected result:

    REJECTED

or:

    QUARANTINED / REQUIRES_REVIEW

according to policy.

## 7.4 Package Security Tests

Test:

- path traversal;
- absolute paths;
- unsafe symlinks;
- excessive decompression;
- decompression bombs;
- executable content outside allowed paths;
- prohibited libraries;
- unexpected source files;
- malicious test fixtures.

The test harness must use safe synthetic fixtures.

## 7.5 Checksum Tests

Test:

1. Correct expected checksum.
2. Incorrect expected checksum.
3. Missing expected checksum where optional.
4. Recalculated checksum after storage.
5. Object-storage metadata mismatch.

Expected mismatch:

    REJECTED

## 7.6 Signature Tests

Test:

- valid signature;
- invalid signature;
- wrong signing key;
- revoked key;
- expired key;
- unsupported algorithm;
- missing signature;
- altered artifact after signing.

Only the valid case may satisfy signature verification.

## 7.7 Compatibility Tests

Create combinations:

| Artifact | Platform | Expected |
|---|---|---|
| arm64 | arm64 | Compatible |
| arm64 | x86_64 | Incompatible |
| SDK 1.x | SDK-compatible | Compatible |
| SDK 2.x | SDK 1-only | Incompatible |
| Missing capability | Required capability | Incompatible |
| Unknown platform | Unknown | Unknown/Rejected |

## 7.8 Authorization Tests

Verify:

- owner can upload;
- authorized project member can read;
- viewer cannot upload;
- unauthorized member cannot revoke;
- cross-project access denied;
- cross-tenant access denied;
- platform admin access follows policy.

## 7.9 Upload Failure Tests

Inject:

- upload timeout;
- interrupted upload;
- object-storage unavailable;
- checksum mismatch;
- expired upload session;
- duplicate completion;
- missing object;
- incomplete object.

Expected:

- no execution approval;
- consistent database state;
- recoverable state where policy permits.

## 7.10 Retention Tests

Test:

    ACTIVE
      |
      v
    ARCHIVED
      |
      v
    PURGED

Verify:

- policy enforcement;
- authorization;
- audit;
- object deletion;
- metadata behavior;
- historical execution references.

## 7.11 Revocation Tests

Test:

    APPROVED
       |
       v
    REVOKED

Then attempt execution eligibility.

Expected:

    NOT_EXECUTION_ELIGIBLE

Historical Run references remain valid.

## 7.12 Idempotency Tests

Repeat:

    createUploadSession
    completeUpload
    registerArtifact

with identical idempotency keys.

Expected:

- no duplicate artifact;
- no duplicate version;
- stable response.

## 7.13 Reconciliation Tests

Simulate:

    DB metadata exists
    Object missing

and:

    DB checksum = A
    Object checksum = B

Expected:

- reconciliation finding;
- artifact not silently promoted to approved;
- operator-visible evidence.

## 7.14 E2E Test

Primary path:

    Authenticated User
          |
          v
    Project
          |
          v
    Create Upload Session
          |
          v
    Upload `.krv`
          |
          v
    Complete
          |
          v
    Validate
          |
          v
    Verify Signature
          |
          v
    Compatibility
          |
          v
    APPROVED
          |
          v
    Registry
          |
          v
    Execution Eligibility

## 7.15 Security Verification

Security review must cover:

- package trust;
- signature validation;
- key handling;
- object storage;
- authorization;
- tenant isolation;
- source privacy;
- malicious packages;
- revocation;
- retention;
- download access.

## 7.16 Performance Baseline

Initial engineering targets:

| Operation | Target |
|---|---:|
| Create upload session p95 | <500 ms |
| Complete upload registration p95 | <1 s |
| Metadata read p95 | <500 ms |
| Artifact list p95 | <1 s |
| Validation acknowledgement | <1 s |
| Signature verification | measured by artifact size |
| Security scan | asynchronous |
| Large upload | network dependent |

Validation and scanning should not block HTTP workers unnecessarily.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate a complete trusted artifact lifecycle from upload through approval,
registry inspection, revocation and retention.

## 8.2 Preparation

- [ ] Control Plane running.
- [ ] PostgreSQL running.
- [ ] Object storage available.
- [ ] Project exists.
- [ ] Valid `.krv` artifact exists.
- [ ] Signing identity available.
- [ ] Platform catalog populated.

## 8.3 Step 1 — Create Upload Session

Request:

    POST /api/v1/artifacts/uploads

Expected:

    upload_id
    artifact_id
    upload location
    expiration
    expected checksum

## 8.4 Step 2 — Upload Artifact

Upload valid `.krv`.

Expected:

    UPLOADED

The binary is stored in object storage.

## 8.5 Step 3 — Complete Upload

Complete the upload.

Expected:

    VALIDATING

## 8.6 Step 4 — Validate Manifest

Expected:

    Manifest valid
    Format valid
    Platform valid
    Architecture valid

## 8.7 Step 5 — Verify Integrity

Expected:

    Expected checksum = Calculated checksum
    Result = PASS

## 8.8 Step 6 — Verify Signature

Expected:

    Signature = VALID
    Signing identity = TRUSTED

## 8.9 Step 7 — Compatibility

Expected:

    Platform = Compatible
    Architecture = Compatible
    SDK = Compatible
    Runtime = Compatible

## 8.10 Step 8 — Approval

Expected:

    Artifact Status: APPROVED
    Execution Eligible: YES

## 8.11 Step 9 — Registry

Open artifact registry.

Expected:

    vision-demo
    1.2.0
    arm64
    KritvaOS 1.0
    SDK 1.0
    APPROVED

## 8.12 Step 10 — Version

Upload version:

    1.3.0

Expected:

    1.2.0 -> immutable
    1.3.0 -> new artifact version

No binary replacement occurs.

## 8.13 Step 11 — Revocation

Revoke 1.2.0.

Expected:

    Status: REVOKED
    Execution Eligible: NO

## 8.14 Step 12 — Retention

Archive an old version.

Expected:

    ACTIVE -> ARCHIVED

A purge operation must require policy and authorization.

## 8.15 Step 13 — Tenant Isolation

Authenticate as another organization.

Attempt to access artifact.

Expected:

    FORBIDDEN

or policy-equivalent resource-not-found response.

## 8.16 Demo Success Criteria

The demo passes when:

- upload works;
- validation works;
- checksum works;
- signature verification works;
- compatibility works;
- registry works;
- versioning works;
- revocation works;
- retention works;
- tenant isolation works.

---
