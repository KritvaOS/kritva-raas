# PHASE-7-LIVE-RESULTS — Acceptance Criteria

Milestone: PHASE-7-LIVE-RESULTS — Live Operations, Video, Telemetry and Results Experience

## 6 Acceptance criteria

### 6.1 Live execution

- [ ] Active Run can be opened.
- [ ] Job state is displayed.
- [ ] Run state is displayed.
- [ ] Robot is identified.
- [ ] Resource is identified.
- [ ] Artifact is identified.
- [ ] Booking context is available.
- [ ] Elapsed execution time is displayed.
- [ ] Durable state can be refreshed.

### 6.2 Live events

- [ ] Events are received.
- [ ] Events use protocol version.
- [ ] Event IDs are unique.
- [ ] Duplicate events are deduplicated.
- [ ] Sequence numbers are processed.
- [ ] Gaps are detectable.
- [ ] Reconnect is supported.
- [ ] Durable snapshot repairs missed events.

### 6.3 WebRTC

- [ ] Video session requires authentication.
- [ ] Video session requires authorization.
- [ ] Signaling works.
- [ ] SDP exchange works.
- [ ] ICE works.
- [ ] TURN fallback is supported where required.
- [ ] Video renders in Studio.
- [ ] Video reconnect works.
- [ ] Video failure is displayed.
- [ ] Video failure does not alter Run state.
- [ ] Video session expires appropriately.

### 6.4 Video privacy

- [ ] Unauthorized users cannot view video.
- [ ] Cross-organization video access is denied.
- [ ] Recording policy is enforced.
- [ ] Retained recordings are access controlled.
- [ ] Recording metadata is linked to Run.
- [ ] Video storage uses approved object storage.
- [ ] Recording lifecycle is auditable.

### 6.5 Telemetry

- [ ] Telemetry is received.
- [ ] Telemetry has timestamp.
- [ ] Telemetry has source.
- [ ] Telemetry sequence is available where required.
- [ ] Units are defined.
- [ ] Quality is represented.
- [ ] Freshness is calculated.
- [ ] Stale telemetry is visibly marked.
- [ ] Telemetry loss is detectable.
- [ ] Reconnect restores observation.

### 6.6 Telemetry safety

- [ ] Telemetry is not safety authority.
- [ ] Stale safety telemetry is marked stale.
- [ ] Unknown safety is not shown as safe.
- [ ] Telemetry cannot issue robot commands.
- [ ] High-frequency control remains local.

### 6.7 Logs

- [ ] Live logs appear.
- [ ] Log severity is shown.
- [ ] Log source is shown.
- [ ] Log timestamps are shown.
- [ ] Logs can be filtered.
- [ ] Logs can be correlated to Run.
- [ ] Sensitive values are redacted.
- [ ] Log stream reconnects.
- [ ] Historical logs remain available after Run completion.

### 6.8 Results

- [ ] Result is created for completed execution.
- [ ] Result lifecycle is durable.
- [ ] Result is linked to Run.
- [ ] Result is linked to organization.
- [ ] Result is linked to project.
- [ ] Result identifies artifact.
- [ ] Result identifies platform.
- [ ] Result identifies robot/resource.
- [ ] Result processing state is visible.
- [ ] Result availability is deterministic.

### 6.9 Result files

- [ ] Result files are linked to Result.
- [ ] File type is recorded.
- [ ] Size is recorded.
- [ ] Checksum is recorded.
- [ ] Storage reference is recorded.
- [ ] Access is authorized.
- [ ] Large files are stored outside PostgreSQL.
- [ ] File lifecycle is enforced.
- [ ] Purged files cannot be downloaded.

### 6.10 Metrics

- [ ] Numeric metrics work.
- [ ] Integer metrics work.
- [ ] Boolean metrics work.
- [ ] String metrics work.
- [ ] Raw metrics work.
- [ ] Minimum works.
- [ ] Maximum works.
- [ ] Average works.
- [ ] Sum works.
- [ ] Count works.
- [ ] Median works.
- [ ] P95 works.
- [ ] P99 works.
- [ ] Metric units are represented where applicable.
- [ ] Derived metrics are identified.

### 6.11 Experiments

- [ ] Experiment can be created.
- [ ] Experiment lifecycle is enforced.
- [ ] Run can be added.
- [ ] Run role can be assigned.
- [ ] Run can be removed where policy permits.
- [ ] Experiment can be completed.
- [ ] Experiment can be archived.
- [ ] Original Run remains authoritative.

### 6.12 Comparisons

- [ ] Comparison can be created.
- [ ] Source Runs are authorized.
- [ ] Comparison is derived.
- [ ] Comparison processing is visible.
- [ ] Metrics are comparable.
- [ ] Non-comparable metrics are identified.
- [ ] Direction is shown.
- [ ] Source Runs remain unchanged.

### 6.13 Downloads

- [ ] Download request is authorized.
- [ ] Download generation is tracked.
- [ ] Download URL/session is time limited.
- [ ] Download is auditable.
- [ ] Expired download cannot be reused.
- [ ] Cross-tenant download is denied.
- [ ] Failed download is represented.

### 6.14 Rerun

- [ ] Prior Run can be selected.
- [ ] Original artifact is identified.
- [ ] Compatibility is checked.
- [ ] User permissions are checked.
- [ ] New booking is required where appropriate.
- [ ] New Job is created.
- [ ] New Run is created.
- [ ] Original Run remains unchanged.
- [ ] Rerun relationship is recorded.

### 6.15 Retention

- [ ] Retention policy is evaluated.
- [ ] Retention state is durable.
- [ ] Archive works.
- [ ] Purge eligibility works.
- [ ] Object storage is reconciled.
- [ ] Metadata is reconciled.
- [ ] Purged files cannot be accessed.
- [ ] Retention actions are auditable.

### 6.16 Reconnect

- [ ] WebSocket disconnect is detected.
- [ ] Video disconnect is detected.
- [ ] Telemetry disconnect is detected.
- [ ] Logs disconnect is detected.
- [ ] UI displays connection state.
- [ ] Durable Run state remains available.
- [ ] Reconnect does not restart Run.
- [ ] Reconnect rehydrates state.
- [ ] Missed events are reconciled.

### 6.17 Tenant isolation

- [ ] Organization A cannot see Organization B Results.
- [ ] Organization A cannot see Organization B video.
- [ ] Organization A cannot see Organization B telemetry.
- [ ] Organization A cannot see Organization B logs.
- [ ] Organization A cannot download Organization B files.
- [ ] Organization A cannot add Organization B Run to Experiment.
- [ ] Repository tenant filtering is enforced.
- [ ] API authorization is enforced.

### 6.18 Performance

- [ ] Live event delivery meets target.
- [ ] WebSocket reconnect meets target.
- [ ] Video session setup meets target.
- [ ] Telemetry ingestion meets target.
- [ ] Result retrieval meets target.
- [ ] Download authorization meets target.
- [ ] Database query plans are reviewed.
- [ ] Object storage is not used through database proxying.

### 6.19 Observability

- [ ] Live connection metrics exist.
- [ ] Video metrics exist.
- [ ] Telemetry metrics exist.
- [ ] Log ingestion metrics exist.
- [ ] Result processing metrics exist.
- [ ] Download metrics exist.
- [ ] Errors are correlated.
- [ ] Alerts exist for critical failures.

### 6.20 No-go conditions

P7 LIVE & RESULTS shall not close if:

- [ ] live state is treated as authoritative;
- [ ] reconnect can restart execution;
- [ ] stale telemetry is presented as current;
- [ ] unknown safety is presented as safe;
- [ ] unauthorized video is accessible;
- [ ] cross-tenant Results are accessible;
- [ ] Result files cannot be reconciled with object storage;
- [ ] original Runs can be modified through comparison/rerun;
- [ ] download authorization can be bypassed;
- [ ] result retention leaves orphaned sensitive data;
- [ ] live failures are indistinguishable from robot failures;
- [ ] video is required for robot safety.

---
