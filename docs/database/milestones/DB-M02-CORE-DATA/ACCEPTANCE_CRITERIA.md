# DB-M02-CORE-DATA — Acceptance Criteria

Milestone: DB-M02-CORE-DATA — Platforms, Resources, Artifacts and Storage Metadata

## 6 Acceptance criteria

### 6.1 Platform schema

- [ ] `platform.platforms` exists.
- [ ] Platform IDs use the approved identifier strategy.
- [ ] Platform name is constrained.
- [ ] Platform key is unique.
- [ ] Platform type is constrained.
- [ ] Platform lifecycle is represented.
- [ ] Platform description/metadata is bounded.
- [ ] Platform audit timestamps exist.
- [ ] Platform state transitions are validated.

### 6.2 Platform versions

- [ ] `platform.platform_versions` exists.
- [ ] Each version references a platform.
- [ ] Version identity is unique within platform scope.
- [ ] Version lifecycle is represented.
- [ ] Architecture reference is supported.
- [ ] Runtime compatibility is represented.
- [ ] SDK compatibility is represented.
- [ ] OS metadata is represented.
- [ ] Version timestamps exist.
- [ ] Deprecated/retired versions remain queryable for historical references.

### 6.3 Architectures

- [ ] Architecture catalog exists.
- [ ] Architecture key is unique.
- [ ] Architecture lifecycle is represented.
- [ ] Architecture metadata is bounded.
- [ ] Platform versions can reference an architecture.
- [ ] Architecture cannot be silently deleted while referenced.

### 6.4 Capabilities

- [ ] Capability catalog exists.
- [ ] Capability key is unique.
- [ ] Capability lifecycle is represented.
- [ ] Capability metadata is bounded.
- [ ] Platform versions can declare capabilities.
- [ ] Capability support state is represented.
- [ ] Required/optional/experimental support is distinguishable.
- [ ] Historical capability relationships remain valid.

### 6.5 Platform configurations

- [ ] Configuration table exists.
- [ ] Configuration references a platform/version.
- [ ] Configuration key is unique within its scope.
- [ ] Configuration lifecycle is represented.
- [ ] Configuration JSONB is bounded to metadata/configuration.
- [ ] Configuration cannot contain source code or secrets.
- [ ] Configuration can be deprecated.
- [ ] Configuration remains historically referenceable.

### 6.6 Labs

- [ ] `lab.labs` exists.
- [ ] Lab has a stable identifier.
- [ ] Lab lifecycle is represented.
- [ ] Lab type/state are constrained.
- [ ] Organization ownership is supported where applicable.
- [ ] Lab metadata is bounded.
- [ ] Lab status supports provisioning/active/maintenance/offline/retired.
- [ ] Lab ownership is auditable.

### 6.7 Robots

- [ ] `lab.robots` exists.
- [ ] Robot has stable identity.
- [ ] Robot references a platform.
- [ ] Robot lifecycle is represented.
- [ ] Robot status is represented.
- [ ] Robot serial/identity rules are documented.
- [ ] Robot metadata is bounded.
- [ ] Robot can be placed into maintenance/fault states.
- [ ] Retired robots remain referenceable for historical records.

### 6.8 Resources

- [ ] `lab.resources` exists.
- [ ] Resource has stable identity.
- [ ] Resource type is constrained.
- [ ] Resource state is constrained.
- [ ] Resource references a Lab.
- [ ] Resource references a Platform where applicable.
- [ ] ROBOT resource linkage to Robot is validated.
- [ ] Resource operational state is represented.
- [ ] Resource capacity metadata is represented.
- [ ] Resource metadata is bounded.
- [ ] Retired resources remain historically referenceable.

### 6.9 Maintenance windows

- [ ] Maintenance windows exist.
- [ ] Maintenance references a resource or approved scope.
- [ ] Start/end timestamps are `timestamptz`.
- [ ] End is after start.
- [ ] Maintenance type is constrained.
- [ ] Maintenance status is constrained.
- [ ] Maintenance windows can be queried efficiently.
- [ ] Maintenance does not directly mutate booking state.

### 6.10 Availability windows

- [ ] Availability windows exist.
- [ ] Availability status is constrained.
- [ ] Time range is validated.
- [ ] Availability can be disabled.
- [ ] Availability is distinguishable from actual resource state.
- [ ] Availability does not itself guarantee booking availability.

### 6.11 Artifact identity

- [ ] Artifact table exists.
- [ ] Artifact belongs to a Project.
- [ ] Organization ownership is explicit or safely derivable and enforced.
- [ ] Artifact key is unique within the required scope.
- [ ] Artifact lifecycle is represented.
- [ ] Artifact type/format is represented.
- [ ] Artifact source remains local.
- [ ] Artifact metadata does not contain source code.

### 6.12 Artifact versions

- [ ] Artifact versions exist.
- [ ] Version identity is unique within artifact scope.
- [ ] Version can identify release/build.
- [ ] Immutable digest is stored.
- [ ] Artifact format/version is stored.
- [ ] Platform target is stored.
- [ ] Architecture is stored.
- [ ] Runtime version is stored.
- [ ] SDK version is stored.
- [ ] Capability requirements are representable.
- [ ] Expiration/revocation state is representable.

### 6.13 Builds

- [ ] Build metadata exists.
- [ ] Build does not store source code.
- [ ] Build identifies project.
- [ ] Build identifies target platform/version where applicable.
- [ ] Build status is represented.
- [ ] Build timestamp is represented.
- [ ] Build provenance metadata is represented.
- [ ] Build failure metadata can be stored without source exposure.

### 6.14 Storage objects

- [ ] Storage metadata table exists.
- [ ] Object reference is unique within provider/storage scope.
- [ ] Storage class/type is represented.
- [ ] Object size is stored.
- [ ] Content type is stored.
- [ ] Checksum is stored.
- [ ] Encryption state is represented.
- [ ] Object lifecycle is represented.
- [ ] Storage provider is abstracted.
- [ ] Bucket/container is represented where required.
- [ ] Object key/reference is stored.
- [ ] Object metadata does not expose secrets.
- [ ] Object storage is not assumed to be publicly accessible.

### 6.15 Validation records

- [ ] Validation records exist.
- [ ] Validation type is represented.
- [ ] Validation result is represented.
- [ ] Validator identity/version is represented.
- [ ] Validation timestamp exists.
- [ ] Validation failure reason can be represented.
- [ ] Validation history is preserved.
- [ ] Latest validation can be efficiently queried.

### 6.16 Signature records

- [ ] Signature metadata exists.
- [ ] Signature algorithm is represented.
- [ ] Key/trust reference is represented without exposing private keys.
- [ ] Signature verification result is represented.
- [ ] Signature timestamp exists.
- [ ] Revocation state is representable.
- [ ] Production signing keys are never stored as database payloads.

### 6.17 Compatibility

- [ ] Compatibility metadata exists.
- [ ] Artifact can reference target platform/version.
- [ ] Architecture compatibility is represented.
- [ ] Runtime compatibility is represented.
- [ ] SDK compatibility is represented.
- [ ] Capability requirements are representable.
- [ ] Compatibility results are auditable.
- [ ] Compatibility records are tenant isolated where appropriate.

### 6.18 Retention

- [ ] Retention policy table exists.
- [ ] Artifact retention is configurable.
- [ ] Effective date is represented.
- [ ] Retention expiration can be calculated.
- [ ] Legal/operational hold can prevent purge.
- [ ] Archive state is represented.
- [ ] Purge eligibility is represented.
- [ ] Purge timestamp is recorded.
- [ ] Object and metadata retention can be coordinated.
- [ ] Purged objects cannot remain falsely marked AVAILABLE.

### 6.19 Indexing

- [ ] Platform discovery queries are indexed.
- [ ] Platform-version lookup is indexed.
- [ ] Capability filtering is indexed.
- [ ] Resource status queries are indexed.
- [ ] Lab/resource lookup is indexed.
- [ ] Maintenance-window lookup is indexed.
- [ ] Project artifact lookup is indexed.
- [ ] Artifact digest lookup is indexed.
- [ ] Artifact compatibility lookup is indexed.
- [ ] Storage-object lookup is indexed.
- [ ] Retention processing queries are indexed.
- [ ] Indexes have documented query rationale.

### 6.20 Tenant isolation

- [ ] Tenant-owned artifacts are protected by RLS.
- [ ] Cross-tenant artifact lookup fails.
- [ ] Cross-tenant artifact version lookup fails.
- [ ] Cross-tenant storage metadata lookup fails.
- [ ] Lab tenant ownership is enforced where applicable.
- [ ] Global platform catalog remains globally discoverable according to authorization policy.
- [ ] Administrative access is explicit and auditable.

### 6.21 Storage consistency

- [ ] Database metadata can identify the object payload.
- [ ] Missing object state can be represented.
- [ ] Deleted object state can be represented.
- [ ] Orphan object detection is possible.
- [ ] Orphan metadata detection is possible.
- [ ] Checksum mismatch is detectable.
- [ ] Storage reconciliation is documented.

### 6.22 Retention consistency

- [ ] Retention processing can identify eligible objects.
- [ ] Legal/operational holds prevent deletion.
- [ ] Database metadata is updated after successful deletion.
- [ ] Failed deletion does not falsely mark object PURGED.
- [ ] Repeated purge operations are idempotent.
- [ ] Retention actions are auditable.

### 6.22a Coding-agent catalogue and policy

- [ ] `coding_agent_providers` exists with a stable `provider_id` key and the fields in DB-ADR-011.
- [ ] `claude-code` and `openai-codex` are seeded by migration.
- [ ] `organization_coding_agent_policies` holds one current policy per organization.
- [ ] `allowed_providers` values reference existing providers.
- [ ] `require_consent` cannot be false.
- [ ] Organization policies are protected by tenant RLS.
- [ ] Policy changes are captured by the DB-M01 FOUNDATION audit conventions.
- [ ] No coding-agent table has a column for source, prompts, transcripts, diffs, file names or paths.
- [ ] Coding-agent providers are not stored in platform, capability or compatibility tables.

### 6.23 No-go conditions

DB-M02 shall not be accepted if:

- [ ] artifact binaries are required to be stored in PostgreSQL;
- [ ] tenant-owned artifacts can cross tenant boundaries;
- [ ] platform versions cannot be historically identified;
- [ ] resources cannot be reliably distinguished from robots;
- [ ] storage metadata cannot identify payloads;
- [ ] retention can delete an object while metadata remains incorrectly AVAILABLE;
- [ ] object deletion is non-idempotent;
- [ ] critical indexes are missing;
- [ ] compatibility metadata is insufficient to validate an artifact;
- [ ] source code enters the database through normal artifact workflows.

---
