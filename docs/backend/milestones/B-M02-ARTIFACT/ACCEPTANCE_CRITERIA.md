# B-M02-ARTIFACT — Acceptance Criteria

Milestone: B-M02 — Artifact

# 6 Acceptance Criteria

## 6.1 Artifact Registry

- [ ] Artifact registry exists.
- [ ] Artifact has stable identity.
- [ ] Artifact belongs to a Project.
- [ ] Project belongs to an Organization.
- [ ] Artifact version is explicit.
- [ ] Artifact versions are immutable.
- [ ] Artifact metadata is queryable.
- [ ] Artifact status is queryable.
- [ ] Artifact ownership is enforced.
- [ ] Registry supports pagination.
- [ ] Registry supports filtering.
- [ ] Registry does not store customer source code as normal artifact data.

## 6.2 Upload

- [ ] Upload session can be created.
- [ ] Upload is organization-scoped.
- [ ] Upload is Project-scoped.
- [ ] Upload authorization is checked.
- [ ] Upload size limits are enforced.
- [ ] Upload expiration is enforced.
- [ ] Upload completion is explicit.
- [ ] Incomplete uploads cannot become execution eligible.
- [ ] Upload checksum can be supplied.
- [ ] Upload checksum is verified.
- [ ] Failed uploads are recoverable according to policy.
- [ ] Duplicate upload requests are idempotent.
- [ ] Large payloads do not require application-memory buffering.
- [ ] Object-storage credentials are not exposed to unauthorized users.

## 6.3 Manifest

- [ ] Manifest exists.
- [ ] Manifest format version is validated.
- [ ] Required fields are validated.
- [ ] Application ID is validated.
- [ ] Application version is validated.
- [ ] Platform ID is validated.
- [ ] Platform version is validated.
- [ ] Architecture is validated.
- [ ] KritvaOS version is validated.
- [ ] SDK version is validated.
- [ ] Capabilities are validated.
- [ ] Entrypoint is validated.
- [ ] Manifest cannot escape package boundaries.
- [ ] Unknown mandatory semantics cause rejection or review.
- [ ] Manifest versioning is explicit.

## 6.4 Structural Validation

- [ ] `.krv` format is recognized.
- [ ] Package structure is validated.
- [ ] Required files are present.
- [ ] Unsupported files are rejected where policy requires.
- [ ] Path traversal is rejected.
- [ ] Symlink abuse is rejected or controlled.
- [ ] Excessive file count is rejected.
- [ ] Excessive decompression size is rejected.
- [ ] Oversized artifact is rejected.
- [ ] Malformed manifest is rejected.
- [ ] Invalid entrypoint is rejected.

## 6.5 Integrity

- [ ] Artifact checksum is calculated.
- [ ] Expected checksum is compared.
- [ ] Mismatch causes rejection.
- [ ] Checksum is persisted.
- [ ] Checksum algorithm is explicit.
- [ ] Artifact bytes correspond to recorded checksum.
- [ ] Object-storage integrity metadata is reconciled.

## 6.6 Signature Verification

- [ ] Signature metadata is parsed.
- [ ] Signature algorithm is validated.
- [ ] Signing identity is resolved.
- [ ] Trust chain is validated where applicable.
- [ ] Signature covers the correct artifact payload.
- [ ] Invalid signature causes rejection.
- [ ] Missing signature causes rejection where required.
- [ ] Revoked signing identity causes rejection.
- [ ] Expired signing identity is handled according to policy.
- [ ] Signature verification result is recorded.
- [ ] Verification evidence is auditable.
- [ ] Production signing private keys are not stored in the application worker.

## 6.7 Security Scanning

- [ ] Artifact security scan integration exists.
- [ ] Scanner result is recorded.
- [ ] High-confidence malicious content blocks approval.
- [ ] Prohibited content blocks approval.
- [ ] Scan failure does not silently produce approval.
- [ ] Scan policy is versioned or identifiable.
- [ ] Scan evidence is retained according to policy.

## 6.8 Compatibility

- [ ] Platform ID is validated.
- [ ] Platform version is validated.
- [ ] Architecture is validated.
- [ ] KritvaOS compatibility is validated.
- [ ] Runtime compatibility is validated.
- [ ] SDK compatibility is validated.
- [ ] Required capabilities are validated.
- [ ] Configuration compatibility is evaluated where applicable.
- [ ] Incompatible artifacts cannot become execution eligible.
- [ ] Unknown compatibility is distinguishable from compatible.
- [ ] Compatibility result is auditable.

## 6.9 Approval

- [ ] Approval requires successful required validation.
- [ ] Approval state is server-authoritative.
- [ ] Client cannot directly set APPROVED.
- [ ] Failed validation cannot be bypassed through API parameters.
- [ ] Approval is auditable.
- [ ] Revoked artifacts cannot return to approved execution state without
  explicit controlled revalidation.
- [ ] Expired artifacts cannot execute.

## 6.10 Versioning

- [ ] Artifact version is immutable.
- [ ] New binary creates a new version.
- [ ] Existing artifact binary cannot be replaced.
- [ ] Version metadata is immutable after approval except explicitly allowed
  administrative metadata.
- [ ] Artifact history is preserved.
- [ ] Version ordering is deterministic.
- [ ] Same version conflict is handled explicitly.
- [ ] Different artifact digest with same immutable version is rejected or
  requires a new version.

## 6.11 Access Control

- [ ] Artifact reads require authorization.
- [ ] Artifact writes require authorization.
- [ ] Artifact uploads require authorization.
- [ ] Artifact metadata updates require authorization.
- [ ] Artifact revocation requires elevated permission.
- [ ] Artifact retention changes require elevated permission.
- [ ] Artifact download requires authorization.
- [ ] Cross-tenant artifact access is denied.
- [ ] Cross-project access is denied unless explicitly authorized.
- [ ] Administrative access is audited.

## 6.12 Retention

- [ ] Artifact retention policy exists.
- [ ] Artifact lifecycle is explicit.
- [ ] Archive is supported.
- [ ] Purge is controlled.
- [ ] Purge does not occur before required retention period.
- [ ] Legal/operational retention overrides are supported where required.
- [ ] Purged artifacts cannot be executed.
- [ ] Historical execution references remain understandable after purge.
- [ ] Object-storage lifecycle is reconciled with database state.

## 6.13 Revocation

- [ ] Artifact can be revoked.
- [ ] Revocation reason is recorded.
- [ ] Revocation actor is recorded.
- [ ] Revocation timestamp is recorded.
- [ ] Revoked artifact cannot be newly executed.
- [ ] Existing historical Runs remain intact.
- [ ] Revocation is audited.
- [ ] Revoked artifact remains discoverable according to policy.

## 6.14 Audit

- [ ] Upload is auditable.
- [ ] Validation outcome is auditable.
- [ ] Approval is auditable.
- [ ] Revocation is auditable.
- [ ] Archive is auditable.
- [ ] Purge is auditable.
- [ ] Download/access events are auditable where required.
- [ ] Security scan failures are auditable.
- [ ] Signature failures are auditable.

## 6.15 Source Privacy

- [ ] Artifact API does not require source.
- [ ] Upload API does not accept source archives as a normal input.
- [ ] Source paths are not persisted as artifact metadata.
- [ ] Git metadata is not required.
- [ ] Build workspace is not uploaded.
- [ ] Secrets are not accepted as artifact metadata.
- [ ] Artifact scanning does not silently expand the source boundary.
- [ ] Source privacy tests pass.

## 6.16 Reconciliation

- [ ] Database/object-storage consistency is detectable.
- [ ] Missing binary is detected.
- [ ] Unexpected binary is detectable where applicable.
- [ ] Checksum mismatch is detected.
- [ ] Reconciliation findings are recorded.
- [ ] Reconciliation does not silently approve artifacts.
- [ ] Repair operations are controlled and auditable.

## 6.17 Execution Readiness

- [ ] Execution eligibility is server-derived.
- [ ] Valid artifact is distinguishable from execution-ready artifact.
- [ ] Revoked artifact is not execution-ready.
- [ ] Expired artifact is not execution-ready.
- [ ] Incompatible artifact is not execution-ready.
- [ ] Unsigned artifact is not execution-ready when signing is required.
- [ ] Failed security scan blocks execution.
- [ ] Incomplete upload blocks execution.
- [ ] Future Job service can query eligibility without duplicating validation.

## 6.18 Testing

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] Upload tests pass.
- [ ] Manifest tests pass.
- [ ] Checksum tests pass.
- [ ] Signature tests pass.
- [ ] Security scan tests pass.
- [ ] Compatibility tests pass.
- [ ] Retention tests pass.
- [ ] Revocation tests pass.
- [ ] Tenant-isolation tests pass.
- [ ] E2E artifact lifecycle test passes.
- [ ] CI passes.

---
