# PHASE-2-BUILD-ARTIFACT — Acceptance Criteria

Milestone: PHASE-2-BUILD-ARTIFACT — Local Build and Secure `.krv` Artifact

## 6 Acceptance criteria

### 6.1 Local source

- [ ] Source remains on developer machine.
- [ ] Build reads source through Local Runtime.
- [ ] Studio UI does not directly upload source.
- [ ] Backend has no source-upload requirement.
- [ ] Compiler inputs are not transmitted remotely.
- [ ] Git metadata is not included in `.krv`.
- [ ] Source maps are excluded unless explicitly required and approved.
- [ ] Secrets are excluded.
- [ ] Unrelated workspace files are excluded.

### 6.2 Toolchain

- [ ] Toolchain discovery works.
- [ ] Toolchain version is reported.
- [ ] Target architecture is reported.
- [ ] KritvaOS compatibility is checked.
- [ ] SDK compatibility is checked.
- [ ] Missing toolchain produces actionable error.
- [ ] Unsupported target produces actionable error.
- [ ] Toolchain mismatch blocks release artifact generation.

### 6.3 Build

- [ ] Debug build works.
- [ ] Release build works.
- [ ] Test build works where supported.
- [ ] Build progress is visible.
- [ ] Build logs are visible.
- [ ] Build diagnostics identify file/line where available.
- [ ] Build cancellation works.
- [ ] Build timeout is handled.
- [ ] Failed builds do not produce a valid deployable artifact.
- [ ] Build output remains local until upload.

### 6.4 Testing

- [ ] Tests can run locally.
- [ ] Test results are captured.
- [ ] Failed tests block artifact approval according to policy.
- [ ] Test logs remain local unless explicitly included in permitted metadata.
- [ ] Test cancellation works.
- [ ] Test timeout works.

### 6.5 Package

- [ ] `.krv` package is generated.
- [ ] Package structure is deterministic.
- [ ] Required manifest exists.
- [ ] Executable exists.
- [ ] Required libraries are included.
- [ ] Required resources are included.
- [ ] Runtime configuration is included only when permitted.
- [ ] Integrity metadata exists.
- [ ] Signature metadata exists where signing is enabled.

### 6.6 Manifest

- [ ] Artifact ID exists.
- [ ] Application ID exists.
- [ ] Artifact version exists.
- [ ] Artifact format version exists.
- [ ] Platform ID exists.
- [ ] Platform version exists.
- [ ] Architecture exists.
- [ ] KritvaOS version exists.
- [ ] SDK version exists.
- [ ] Entrypoint exists.
- [ ] Required capabilities are declared.
- [ ] Build profile is declared.
- [ ] Digest is declared.
- [ ] Signature metadata is declared where applicable.
- [ ] Manifest schema is versioned.
- [ ] Manifest does not contain source code.

### 6.7 Integrity

- [ ] SHA-256 or approved integrity algorithm is supported.
- [ ] Digest is calculated over a defined artifact representation.
- [ ] Digest verification detects modification.
- [ ] Manifest digest cannot silently disagree with package digest.
- [ ] Upload verifies integrity.
- [ ] Registry stores authoritative digest.

### 6.8 Privacy scanning

- [ ] Source file detection exists.
- [ ] Git metadata detection exists.
- [ ] Source-map detection exists.
- [ ] Private-key detection exists.
- [ ] Credential detection exists.
- [ ] `.env` detection exists.
- [ ] prohibited archive detection exists.
- [ ] scanner failure blocks upload.
- [ ] high-confidence privacy violation blocks artifact.
- [ ] scan result is recorded.

### 6.9 Dependency scanning

- [ ] Dependencies can be enumerated.
- [ ] Dependency metadata is recorded.
- [ ] Unsupported dependency is detected.
- [ ] Policy-violating dependency blocks approval where required.
- [ ] Dependency scanning does not require source upload.
- [ ] Dependency result is associated with the artifact/build.

### 6.10 Signing

- [ ] Signing interface exists.
- [ ] Development signing works.
- [ ] Production signing boundary is documented.
- [ ] Signing keys are not embedded in source.
- [ ] Signing keys are not uploaded as artifact content.
- [ ] Signature verification works.
- [ ] Invalid signature is rejected.
- [ ] Signature metadata is recorded.
- [ ] Revoked signature/artifact can be rejected by policy.

### 6.11 Artifact validation

- [ ] Package structure is validated.
- [ ] Manifest is validated.
- [ ] Digest is validated.
- [ ] Signature is validated.
- [ ] Platform compatibility is validated.
- [ ] Architecture compatibility is validated.
- [ ] KritvaOS compatibility is validated.
- [ ] SDK compatibility is validated.
- [ ] Required capabilities are validated.
- [ ] Artifact size limits are enforced.
- [ ] Policy checks are enforced.

### 6.12 Artifact registry

- [ ] Artifact upload endpoint exists.
- [ ] Artifact identity is stable.
- [ ] Artifact version is immutable.
- [ ] Organization ownership is stored.
- [ ] Project ownership is stored.
- [ ] Storage reference is stored.
- [ ] Digest is stored.
- [ ] Validation state is stored.
- [ ] Signature state is stored.
- [ ] Compatibility state is stored.
- [ ] Retention metadata is stored.
- [ ] Audit record is created.

### 6.13 Upload

- [ ] Upload requires authentication.
- [ ] Upload requires authorization.
- [ ] Upload is organization scoped.
- [ ] Upload is project scoped.
- [ ] Upload sends artifact only.
- [ ] Upload does not send source.
- [ ] Upload supports retry for safe/idempotent stages.
- [ ] Duplicate upload is handled deterministically.
- [ ] Interrupted upload can recover safely.
- [ ] Server validates uploaded artifact independently.

### 6.14 Studio UX

- [ ] Build screen exists.
- [ ] Build configuration is visible.
- [ ] Build status is visible.
- [ ] Logs are visible.
- [ ] Test status is visible.
- [ ] Artifact generation status is visible.
- [ ] Validation status is visible.
- [ ] Upload status is visible.
- [ ] Artifact details are visible.
- [ ] Failure states are actionable.
- [ ] Cancellation is explicit.
- [ ] No UI operation implies successful upload before server confirmation.

### 6.15 Artifact lifecycle

- [ ] CREATED is supported.
- [ ] PACKAGED is supported.
- [ ] SCANNED is supported.
- [ ] SIGNED is supported.
- [ ] UPLOADED is supported.
- [ ] VALIDATING is supported.
- [ ] VALID is supported.
- [ ] APPROVED is supported.
- [ ] REJECTED is supported.
- [ ] QUARANTINED is supported.
- [ ] REVOKED is supported.
- [ ] EXPIRED is supported.
- [ ] ARCHIVED is supported.
- [ ] PURGED is supported.
- [ ] Invalid lifecycle transitions are rejected.

### 6.16 Audit

- [ ] Build request is auditable.
- [ ] Build completion is auditable.
- [ ] Artifact generation is auditable.
- [ ] Artifact validation is auditable.
- [ ] Upload is auditable.
- [ ] Rejection is auditable.
- [ ] Approval is auditable.
- [ ] Revocation is auditable.

### 6.17 Cross-domain exit criteria

The complete flow must pass:

    Studio
       |
       v
    Project
       |
       v
    Platform Selection
       |
       v
    Local Runtime
       |
       v
    Toolchain Detection
       |
       v
    Build
       |
       v
    Test
       |
       v
    Package
       |
       v
    Privacy Scan
       |
       v
    Manifest
       |
       v
    Digest
       |
       v
    Sign
       |
       v
    Validate
       |
       v
    Upload Artifact Only
       |
       v
    Control Plane
       |
       v
    Artifact Registry

Acceptance requires:

- [ ] source remains local;
- [ ] build executes locally;
- [ ] test executes locally;
- [ ] `.krv` is generated locally;
- [ ] privacy scan passes;
- [ ] manifest is valid;
- [ ] digest is valid;
- [ ] signature is valid where enabled;
- [ ] artifact uploads successfully;
- [ ] Control Plane records artifact;
- [ ] artifact can be retrieved by authorized metadata query;
- [ ] no source payload crosses the network boundary.

### 6.18 No-go conditions

Phase 2 shall not close if:

- [ ] source is uploaded during build;
- [ ] source is required for artifact registration;
- [ ] artifact can be generated with a privacy violation;
- [ ] signature validation can be bypassed;
- [ ] artifact versions are mutable;
- [ ] cross-organization artifact access succeeds;
- [ ] artifact compatibility is not checked;
- [ ] failed builds can produce APPROVED artifacts;
- [ ] upload success is assumed without server confirmation.

---
