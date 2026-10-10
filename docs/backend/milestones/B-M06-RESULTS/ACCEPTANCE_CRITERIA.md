# B-M06-RESULTS — Acceptance Criteria

Milestone: B-M06 — Results

# 6 Acceptance Criteria

## 6.1 Result Domain

- [ ] Result entity exists.
- [ ] Result references Run.
- [ ] Result belongs to Organization.
- [ ] Result lifecycle is explicit.
- [ ] Result state transitions are validated.
- [ ] Result publication is asynchronous where appropriate.
- [ ] Result status is durable.
- [ ] Result processing failure is represented.
- [ ] One authoritative Result per Run is enforced unless a versioned-result
  decision supersedes it.
- [ ] Result metadata is tenant-scoped.

## 6.2 Result Files

- [ ] Result files can be registered.
- [ ] File identity is stable.
- [ ] File type is explicit.
- [ ] Content type is explicit.
- [ ] Size is recorded.
- [ ] Checksum is recorded.
- [ ] Storage reference is recorded.
- [ ] File lifecycle is explicit.
- [ ] File ownership is verified.
- [ ] Object storage path is not client-authoritative.
- [ ] File availability is validated before download.
- [ ] File deletion follows retention policy.

## 6.3 Metrics

- [ ] Numeric metrics are supported.
- [ ] Integer metrics are supported.
- [ ] Boolean metrics are supported.
- [ ] String metrics are supported.
- [ ] Units can be represented.
- [ ] Aggregation type can be represented.
- [ ] Metric source can be represented.
- [ ] Metric timestamp can be represented.
- [ ] Metrics are associated with Result/Run.
- [ ] Metrics cannot cross tenant boundaries.

## 6.4 Telemetry

- [ ] Telemetry envelope is versioned.
- [ ] Run identity is mandatory.
- [ ] Sequence is supported.
- [ ] Timestamp is recorded.
- [ ] Signal identity is recorded.
- [ ] Value is validated.
- [ ] Unit is supported.
- [ ] Quality is supported.
- [ ] Source is recorded.
- [ ] Duplicate samples are safely handled.
- [ ] Sequence gaps are detectable.
- [ ] Out-of-order samples are handled.
- [ ] Telemetry persistence does not block core Job state.
- [ ] High-rate telemetry has bounded resource consumption.
- [ ] Telemetry retention is policy-controlled.

## 6.5 Logs

- [ ] Log envelope is versioned.
- [ ] Timestamp is recorded.
- [ ] Severity is recorded.
- [ ] Source is recorded.
- [ ] Run identity is recorded.
- [ ] Sequence is supported.
- [ ] Duplicate logs are safely handled.
- [ ] Log redaction exists.
- [ ] Secrets are not persisted.
- [ ] Source code is not unintentionally persisted.
- [ ] Log volume is bounded.
- [ ] Logs can be retrieved after Run completion.
- [ ] Log retention is policy-controlled.

## 6.6 Video

- [ ] Live video authorization is integrated.
- [ ] WebRTC remains the primary live transport.
- [ ] Media is not unnecessarily proxied through application APIs.
- [ ] Video recording metadata is stored.
- [ ] Video result file can be registered.
- [ ] Video checksum is stored.
- [ ] Video duration is recorded.
- [ ] Video content type is recorded.
- [ ] Video retention is policy-controlled.
- [ ] Video download is authorized.
- [ ] Video access is auditable.

## 6.7 Experiment

- [ ] Experiment entity exists.
- [ ] Experiment belongs to Organization.
- [ ] Experiment references Project.
- [ ] Experiment lifecycle is explicit.
- [ ] Experiment metadata is bounded.
- [ ] Experiment supports tags.
- [ ] Experiment supports hypothesis/objective metadata.
- [ ] Runs can be associated with experiments.
- [ ] Membership role is explicit.
- [ ] Experiment membership is auditable.
- [ ] Experiment does not duplicate Run state.

## 6.8 Comparison

- [ ] Comparison entity exists.
- [ ] Comparison state is explicit.
- [ ] Baseline can be represented.
- [ ] Candidate can be represented.
- [ ] Comparison metrics are derived.
- [ ] Source metrics remain unchanged.
- [ ] Non-comparable metrics are represented.
- [ ] Comparison failures are represented.
- [ ] Comparison is tenant-scoped.
- [ ] Comparison output can be downloaded.

## 6.9 Downloads

- [ ] Download request is authorized.
- [ ] Download references a known Result/File.
- [ ] Arbitrary object paths are rejected.
- [ ] Download can use controlled/signed access.
- [ ] Download expiration is supported where required.
- [ ] Download is audited.
- [ ] Unauthorized download is rejected.
- [ ] Deleted/expired files cannot be downloaded.
- [ ] Cross-tenant downloads are prevented.
- [ ] Large downloads do not consume application memory unnecessarily.

## 6.10 Retention

- [ ] Retention policy is configurable.
- [ ] Result metadata retention is defined.
- [ ] Telemetry retention is defined.
- [ ] Log retention is defined.
- [ ] Video retention is defined.
- [ ] Result-file retention is defined.
- [ ] Download retention is defined.
- [ ] Experiment retention is defined.
- [ ] Archive state exists where required.
- [ ] Purge is auditable.
- [ ] Purge is idempotent.
- [ ] Legal/administrative holds can prevent purge where required.
- [ ] Retention does not silently delete authoritative business records.

## 6.11 Real Lab Agent

- [ ] Real Lab Agent protocol is defined.
- [ ] Lab Agent authentication is implemented.
- [ ] Lab Agent identity is unique.
- [ ] Telemetry channel works.
- [ ] Log channel works.
- [ ] Result upload works.
- [ ] Heartbeat works.
- [ ] Disconnect detection works.
- [ ] Local buffering is supported where required.
- [ ] Reconnect/resume is supported.
- [ ] Duplicate ingestion is safe.
- [ ] Lab Agent cannot bypass authorization.
- [ ] Lab Agent cannot override physical safety policy.

## 6.12 Live/Durable Separation

- [ ] WebSocket failure does not destroy durable results.
- [ ] WebRTC failure does not fail the Run automatically.
- [ ] Telemetry failure does not imply Run failure.
- [ ] Log-stream failure does not imply Run failure.
- [ ] Durable Run state remains authoritative.
- [ ] Result publication does not depend on a connected Studio.
- [ ] Reconnection can restore current state.

## 6.13 Security

- [ ] Tenant isolation tests pass.
- [ ] Result access is authorized.
- [ ] File access is authorized.
- [ ] Experiment access is authorized.
- [ ] Comparison access is authorized.
- [ ] Download access is authorized.
- [ ] Lab Agent authentication is verified.
- [ ] Object storage references are protected.
- [ ] Secrets are redacted from logs.
- [ ] Result audit events exist.
- [ ] Download audit events exist.

## 6.14 Safety

- [ ] Safety state is sourced from authoritative local systems.
- [ ] UNKNOWN is not treated as SAFE.
- [ ] STALE is not treated as CURRENT.
- [ ] Video availability does not imply safety.
- [ ] Telemetry availability does not imply safety.
- [ ] Cloud connectivity does not define safety.
- [ ] Result processing does not override safety state.
- [ ] Real Lab Agent integration passes safety-boundary review.

---
