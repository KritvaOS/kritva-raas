# DB-M04-EXECUTION-DATA — Acceptance Criteria

Milestone: DB-M04-EXECUTION-DATA — Jobs, Runs, Telemetry, Logs and Results

## 6 Acceptance criteria

### 6.1 Jobs

- [ ] `execution.jobs` exists.
- [ ] Job has stable identifier.
- [ ] Job belongs to an organization.
- [ ] Job references project.
- [ ] Job references artifact.
- [ ] Job references booking where required.
- [ ] Job references platform/version/configuration.
- [ ] Job lifecycle is constrained.
- [ ] Job priority is represented.
- [ ] Job idempotency is supported.
- [ ] Job creation timestamp exists.
- [ ] Job completion timestamp exists.
- [ ] Failure classification is represented.
- [ ] Cancellation reason is represented.
- [ ] Timeout reason is represented.

### 6.2 Job lifecycle

- [ ] CREATED is supported.
- [ ] QUEUED is supported.
- [ ] VALIDATING is supported.
- [ ] ALLOCATING is supported.
- [ ] DEPLOYING is supported.
- [ ] STARTING is supported.
- [ ] RUNNING is supported.
- [ ] STOPPING is supported.
- [ ] COMPLETED is supported.
- [ ] FAILED is supported.
- [ ] CANCELLED is supported.
- [ ] TIMEOUT is supported.
- [ ] Invalid transitions are rejected.
- [ ] Terminal states cannot silently return to active states.
- [ ] State history is retained.

### 6.3 Runs

- [ ] `execution.runs` exists.
- [ ] Run has stable identifier.
- [ ] Run references Job.
- [ ] Attempt number is represented.
- [ ] Resource identity is represented.
- [ ] Robot identity is represented where applicable.
- [ ] Platform snapshot/reference is represented.
- [ ] Artifact digest is captured.
- [ ] Runtime version is captured.
- [ ] SDK version is captured.
- [ ] Lab Agent/runtime identity is captured.
- [ ] Run lifecycle is constrained.
- [ ] Start/end timestamps exist.
- [ ] Failure reason is represented.
- [ ] Termination reason is represented.

### 6.4 Run lifecycle

- [ ] CREATED is supported.
- [ ] PREPARING is supported.
- [ ] STARTING is supported.
- [ ] RUNNING is supported.
- [ ] STOPPING is supported.
- [ ] STOPPED is supported.
- [ ] COMPLETED is supported.
- [ ] FAILED is supported.
- [ ] TIMEOUT is supported.
- [ ] CANCELLED is supported.
- [ ] Invalid transitions are rejected.
- [ ] Run state history is retained.

### 6.5 Execution attempts

- [ ] Attempt records exist where retries are supported.
- [ ] Attempt number is unique per Job.
- [ ] Attempt start/end are represented.
- [ ] Attempt outcome is represented.
- [ ] Worker/Lab Agent identity is represented.
- [ ] Retry reason is represented.
- [ ] Physical execution retries require explicit policy.
- [ ] Duplicate physical actions are not blindly retried.

### 6.6 Execution events

- [ ] Execution events are persisted where durable history is required.
- [ ] Event identity is unique.
- [ ] Job/Run association is represented.
- [ ] Event timestamp exists.
- [ ] Event type is constrained.
- [ ] Correlation/trace ID is supported.
- [ ] Sequence is supported where required.
- [ ] Duplicate events can be detected.
- [ ] Events do not replace current Job/Run state.

### 6.7 Telemetry streams

- [ ] Telemetry stream table exists.
- [ ] Stream references Run.
- [ ] Stream/channel identity is represented.
- [ ] Data type is represented.
- [ ] Unit is represented.
- [ ] Sampling information is represented.
- [ ] Start/end timestamps exist.
- [ ] Sequence range is supported.
- [ ] Storage/reference metadata is supported.
- [ ] Retention state is represented.

### 6.8 Telemetry chunks

- [ ] Chunk metadata exists.
- [ ] Chunk references stream.
- [ ] Chunk time range is represented.
- [ ] Sequence range is represented.
- [ ] Size is represented.
- [ ] Checksum is represented.
- [ ] Compression is represented.
- [ ] Storage reference is represented.
- [ ] Chunk state is represented.
- [ ] Chunk retrieval is indexed by stream/time.

### 6.9 Log streams

- [ ] Log stream table exists.
- [ ] Stream references Run.
- [ ] Source identity is represented.
- [ ] Severity filtering is supported.
- [ ] Start/end timestamps exist.
- [ ] Retention is represented.
- [ ] Storage metadata is represented.

### 6.10 Log chunks

- [ ] Log chunk table exists.
- [ ] Chunk references stream.
- [ ] Sequence is represented.
- [ ] Time range is represented.
- [ ] Size is represented.
- [ ] Checksum is represented.
- [ ] Storage reference is represented.
- [ ] Chunk lifecycle is represented.
- [ ] Chunk query is indexed.

### 6.11 Video

- [ ] Video session metadata exists.
- [ ] Video session references Run.
- [ ] Session lifecycle is represented.
- [ ] Recording metadata exists where recording is enabled.
- [ ] Recording storage reference exists.
- [ ] Recording checksum exists.
- [ ] Recording retention is represented.
- [ ] Live WebRTC state is not treated as durable database truth.

### 6.12 Results

- [ ] `result.results` exists.
- [ ] Result references Run.
- [ ] Result belongs to organization.
- [ ] Result lifecycle is constrained.
- [ ] Result generation timestamps exist.
- [ ] Result availability is represented.
- [ ] Result failure metadata is represented.
- [ ] One authoritative Result per Run is enforced unless explicit versioning is approved.

### 6.13 Result files

- [ ] Result file table exists.
- [ ] Result file references Result.
- [ ] File type is constrained.
- [ ] Storage reference exists.
- [ ] Size is represented.
- [ ] Checksum is represented.
- [ ] Content type is represented.
- [ ] File lifecycle is represented.
- [ ] Retention state is represented.
- [ ] Large payloads remain outside PostgreSQL.

### 6.14 Result metrics

- [ ] Result metric table exists.
- [ ] Metric references Result.
- [ ] Metric name/key is represented.
- [ ] Metric type is constrained.
- [ ] Numeric precision is sufficient.
- [ ] Aggregation is constrained.
- [ ] Unit is represented where applicable.
- [ ] Metric provenance is represented where required.
- [ ] Metric queries are indexed.

### 6.15 Experiments

- [ ] Experiment table exists.
- [ ] Experiment belongs to organization/project.
- [ ] Experiment lifecycle is constrained.
- [ ] Experiment metadata is bounded.
- [ ] Experiment can contain multiple Runs.
- [ ] Experiment membership is explicit.
- [ ] Membership role is constrained.
- [ ] Historical experiment membership is preserved.

### 6.16 Comparisons

- [ ] Comparison table exists.
- [ ] Comparison references Experiment/Results as designed.
- [ ] Comparison lifecycle is constrained.
- [ ] Comparison items exist.
- [ ] Comparison item roles are constrained.
- [ ] Comparison metrics exist.
- [ ] Comparison direction is constrained.
- [ ] Comparison remains derived data.
- [ ] Source Results are never overwritten by comparison.

### 6.17 Downloads

- [ ] Download table exists.
- [ ] Download references Result File.
- [ ] Downloading principal is represented.
- [ ] Download lifecycle is constrained.
- [ ] Request timestamp exists.
- [ ] Expiration timestamp exists.
- [ ] Download audit metadata exists.
- [ ] Repeated download requests are handled idempotently where required.

### 6.18 Retention

- [ ] Result retention metadata exists.
- [ ] Result-file retention exists.
- [ ] Telemetry retention exists.
- [ ] Log retention exists.
- [ ] Video retention exists.
- [ ] Experiment retention is defined.
- [ ] Archive state is represented.
- [ ] Purge eligibility is represented.
- [ ] Purge completion is recorded.
- [ ] Operational/legal holds are supported.
- [ ] Purge failures remain retryable.
- [ ] Purged payloads are not falsely marked AVAILABLE.

### 6.19 Archival

- [ ] Archive state is explicit.
- [ ] Archive timestamp exists.
- [ ] Archive storage reference can be represented.
- [ ] Archive operation is idempotent.
- [ ] Archived records remain queryable according to policy.
- [ ] Archived records are excluded from normal active queries where appropriate.
- [ ] Historical references remain valid.

### 6.20 Partitioning

- [ ] High-volume tables have workload assessment.
- [ ] Partitioning is justified by measured need.
- [ ] Partition key is documented.
- [ ] Partition interval is documented.
- [ ] Inserts route to correct partitions.
- [ ] Queries use partition pruning where expected.
- [ ] Retention can operate efficiently by partition.
- [ ] Partition maintenance is documented.
- [ ] No unnecessary partitioning is introduced.

### 6.21 Performance

- [ ] Job lookup is indexed.
- [ ] Run lookup is indexed.
- [ ] Active execution lookup is indexed.
- [ ] Telemetry time-range lookup is indexed.
- [ ] Log time-range lookup is indexed.
- [ ] Result lookup is indexed.
- [ ] Result-file lookup is indexed.
- [ ] Metric lookup is indexed.
- [ ] Experiment membership lookup is indexed.
- [ ] Retention queries are indexed.
- [ ] Query plans are reviewed.

### 6.22 Tenant isolation

- [ ] Job access is tenant isolated.
- [ ] Run access is tenant isolated.
- [ ] Telemetry metadata is tenant isolated.
- [ ] Log metadata is tenant isolated.
- [ ] Results are tenant isolated.
- [ ] Experiments are tenant isolated.
- [ ] Downloads are tenant isolated.
- [ ] Cross-tenant negative tests pass.

### 6.23 Idempotency

- [ ] Job creation supports idempotency.
- [ ] Run creation supports idempotency where required.
- [ ] Execution state updates are idempotent.
- [ ] Telemetry chunk ingestion can deduplicate.
- [ ] Log chunk ingestion can deduplicate.
- [ ] Result generation is idempotent.
- [ ] Archive operations are idempotent.
- [ ] Purge operations are idempotent.
- [ ] Download generation is safely retryable.

### 6.24 No-go conditions

DB-M04 shall not be accepted if:

- [ ] Job and Run are indistinguishable;
- [ ] durable execution state depends on WebSocket delivery;
- [ ] telemetry ingestion can corrupt durable execution state;
- [ ] result files require PostgreSQL binary storage;
- [ ] historical Run context is lost when platform metadata changes;
- [ ] tenant isolation fails;
- [ ] archival can destroy active results;
- [ ] purge can silently delete protected data;
- [ ] partitioning is introduced without workload justification;
- [ ] critical execution queries lack indexes.

---
