# PHASE-3-CONTROL-PLANE — Acceptance Criteria

Milestone: PHASE-3-CONTROL-PLANE — Identity, Projects, Platforms and Artifacts

## 6 Acceptance criteria

### 6.1 Control Plane

- [ ] Backend starts.
- [ ] Configuration is validated.
- [ ] Health endpoint works.
- [ ] Readiness endpoint works.
- [ ] API v1 is available.
- [ ] Structured logging works.
- [ ] Request correlation works.
- [ ] Errors use common contract.
- [ ] Database connection is validated.
- [ ] Object-storage adapter is available.

### 6.2 Identity

- [ ] Authenticated principal is resolved.
- [ ] User record is resolved.
- [ ] User state is enforced.
- [ ] Suspended users are denied.
- [ ] Removed users are denied.
- [ ] Membership is resolved.
- [ ] Authentication failures are safe.
- [ ] Authentication events are auditable.

### 6.3 Organizations

- [ ] Organization records exist.
- [ ] Organization membership exists.
- [ ] Organization roles exist.
- [ ] Active membership is required.
- [ ] Organization context propagates to services.
- [ ] Cross-organization access is denied.
- [ ] Organization ownership is enforced.

### 6.4 Authorization

- [ ] Authorization is deny-by-default.
- [ ] API authorization is enforced.
- [ ] Application authorization is enforced.
- [ ] Repository tenant filtering is enforced.
- [ ] Organization roles are enforced.
- [ ] Project roles are enforced.
- [ ] Artifact access is authorized.
- [ ] Unauthorized access is audited where required.
- [ ] Authorization cannot be bypassed by modifying client requests.

### 6.5 Projects

- [ ] Project create works.
- [ ] Project list works.
- [ ] Project get works.
- [ ] Project update works.
- [ ] Project archive works.
- [ ] Project key is unique within organization.
- [ ] Project belongs to organization.
- [ ] Project member roles work.
- [ ] Project platform binding works.
- [ ] Project source code is never stored.

### 6.6 Platforms

- [ ] Platform list works.
- [ ] Platform detail works.
- [ ] Platform versions work.
- [ ] Architectures work.
- [ ] Capabilities work.
- [ ] Platform capability relationships work.
- [ ] Platform configurations work.
- [ ] Lifecycle states are enforced.
- [ ] Deprecated/retired states are represented.
- [ ] Platform catalog is globally scoped.

### 6.7 Artifacts

- [ ] Artifact registration works.
- [ ] Artifact belongs to organization.
- [ ] Artifact belongs to project.
- [ ] Artifact version exists.
- [ ] Artifact version is immutable.
- [ ] Artifact digest is persisted.
- [ ] Artifact storage reference is persisted.
- [ ] Artifact manifest metadata is persisted.
- [ ] Artifact validation records are persisted.
- [ ] Signature records are persisted.
- [ ] Compatibility records are persisted.
- [ ] Retention metadata exists.

### 6.8 Artifact upload

- [ ] Upload requires authentication.
- [ ] Upload requires authorization.
- [ ] Upload is tenant scoped.
- [ ] Upload accepts artifact only.
- [ ] Upload does not accept source as part of normal workflow.
- [ ] Storage upload succeeds.
- [ ] Database metadata and storage reference are consistent.
- [ ] Duplicate upload is handled idempotently.
- [ ] Interrupted upload does not create false APPROVED state.
- [ ] Server validates artifact independently.

### 6.9 Artifact lifecycle

- [ ] CREATED works.
- [ ] PACKAGED works.
- [ ] SCANNED works.
- [ ] SIGNED works.
- [ ] UPLOADED works.
- [ ] VALIDATING works.
- [ ] VALID works.
- [ ] APPROVED works.
- [ ] REJECTED works.
- [ ] QUARANTINED works.
- [ ] REVOKED works.
- [ ] EXPIRED works.
- [ ] ARCHIVED works.
- [ ] PURGED works.
- [ ] Invalid transitions are rejected.

### 6.10 Compatibility

- [ ] Platform compatibility is evaluated.
- [ ] Platform version compatibility is evaluated.
- [ ] Architecture compatibility is evaluated.
- [ ] KritvaOS compatibility is evaluated.
- [ ] SDK compatibility is evaluated.
- [ ] Capability compatibility is evaluated.
- [ ] Configuration compatibility is evaluated.
- [ ] Incompatible artifacts are rejected or prevented from approval.

### 6.11 Database integrity

- [ ] Foreign keys exist.
- [ ] Tenant ownership is represented.
- [ ] Unique constraints exist.
- [ ] Lifecycle constraints exist where practical.
- [ ] Indexes match query patterns.
- [ ] Transactions cover multi-record invariants.
- [ ] Migration is reproducible.
- [ ] Repository methods enforce organization filtering.

### 6.12 API behavior

- [ ] Request IDs are accepted/generated.
- [ ] Response includes request ID.
- [ ] Errors use stable codes.
- [ ] Validation errors identify fields.
- [ ] Pagination is consistent.
- [ ] Sorting is deterministic.
- [ ] Filtering is bounded.
- [ ] API responses do not expose internal database details.
- [ ] API versioning is explicit.

### 6.13 Audit

- [ ] Project mutations are auditable.
- [ ] Membership mutations are auditable.
- [ ] Artifact mutations are auditable.
- [ ] Artifact upload is auditable.
- [ ] Artifact validation is auditable.
- [ ] Authorization-sensitive operations are auditable.
- [ ] Audit records include actor/context.
- [ ] Audit records include request correlation.

### 6.14 Studio integration

- [ ] Studio login works.
- [ ] Organization selection works.
- [ ] Project list works.
- [ ] Project creation works.
- [ ] Platform catalog works.
- [ ] Artifact list works.
- [ ] Artifact upload works.
- [ ] Artifact status is displayed.
- [ ] Backend errors are rendered correctly.
- [ ] Studio applies the organization coding-agent policy and provider metadata from the Control Plane, with cache expiry and offline fallback to `READ_ONLY`.

### 6.15 Demo-0

Demo-0 shall satisfy:

- [ ] User logs in.
- [ ] User selects organization.
- [ ] User creates project.
- [ ] User selects platform.
- [ ] User builds locally.
- [ ] User creates `.krv`.
- [ ] User validates artifact.
- [ ] User uploads artifact.
- [ ] Control Plane records artifact.
- [ ] Artifact appears in Studio.
- [ ] Artifact digest matches.
- [ ] Artifact ownership matches organization/project.
- [ ] Source code remains local.
- [ ] Cross-tenant access fails.

### 6.16 No-go conditions

P3 CONTROL PLANE shall not close if:

- [ ] Control Plane depends on mock business state;
- [ ] PostgreSQL is bypassed for authoritative state;
- [ ] tenant isolation fails;
- [ ] artifact ownership can be bypassed;
- [ ] project ownership can be bypassed;
- [ ] artifact versions are mutable;
- [ ] source upload is required;
- [ ] object storage and database state can silently diverge;
- [ ] authorization exists only in Studio;
- [ ] the coding-agent policy or provider APIs accept source, prompts, transcripts, diffs, file names or paths;
- [ ] coding-agent providers appear in platform or compatibility results;
- [ ] Demo-0 cannot complete end-to-end.

---
