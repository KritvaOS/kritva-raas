# DB-M04-EXECUTION-DATA — Review Checklist

Milestone: DB-M04-EXECUTION-DATA — Jobs, Runs, Telemetry, Logs and Results

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

## 7 Test and verification plan

### 7.1 Test architecture

Testing shall proceed through:

    Schema
      |
      v
    Lifecycle
      |
      v
    Concurrency
      |
      v
    Ingestion
      |
      v
    Result generation
      |
      v
    Retention
      |
      v
    Partitioning
      |
      v
    Performance
      |
      v
    Tenant isolation
      |
      v
    End-to-end execution

### 7.2 Job lifecycle test

Create Job.

Verify:

    CREATED
      -> QUEUED
      -> VALIDATING
      -> ALLOCATING
      -> DEPLOYING
      -> STARTING
      -> RUNNING
      -> STOPPING
      -> COMPLETED

Attempt invalid transition.

Expected:

    REJECTED

### 7.3 Run lifecycle test

Create Run.

Verify:

    CREATED
      -> PREPARING
      -> STARTING
      -> RUNNING
      -> STOPPING
      -> STOPPED

Verify alternative:

    RUNNING -> FAILED

### 7.4 Retry test

Create Job.

Cause controlled deployment failure.

Create second Run according to retry policy.

Verify:

- attempts are distinct;
- original failure remains immutable;
- no duplicate physical action is performed without policy;
- Job references the relevant Run state.

### 7.5 Disconnect test

Simulate Lab Agent disconnect during RUNNING.

Verify:

- Run does not silently become COMPLETED;
- connection state is represented;
- execution recovery follows policy;
- durable state remains available;
- safety state remains local to the Lab Agent/runtime.

### 7.6 Telemetry ingestion test

Create telemetry stream.

Ingest chunks with:

- sequence;
- timestamp;
- checksum.

Verify:

- duplicate chunk is detectable;
- out-of-order chunk is represented;
- missing sequence range is detectable;
- time-range queries work.

### 7.7 Log ingestion test

Ingest log chunks.

Verify:

- severity metadata;
- source;
- sequence;
- timestamps;
- duplicate detection;
- retrieval ordering.

### 7.8 Result generation test

Complete Run.

Create Result.

Verify:

    Run
      |
      v
    Result CREATED
      |
      v
    PROCESSING
      |
      v
    AVAILABLE

Failure path:

    PROCESSING -> FAILED

### 7.9 Result file test

Attach:

- summary;
- log archive;
- telemetry export;
- video recording.

Verify each file has:

- storage reference;
- checksum;
- size;
- lifecycle;
- retention metadata.

### 7.10 Experiment test

Create Experiment.

Add:

    Run 1 = BASELINE
    Run 2 = CANDIDATE
    Run 3 = TRIAL

Verify:

- many-to-many membership works;
- roles are valid;
- Runs remain unchanged.

### 7.11 Comparison test

Create Comparison.

Process comparison metrics.

Verify:

- source Results remain immutable;
- comparison state is independent;
- comparison metrics are queryable.

### 7.12 Download test

Request Result File download.

Verify:

    REQUESTED
      -> GENERATED
      -> DOWNLOADED

Test:

    GENERATED -> EXPIRED

through the expiration policy without inventing an unsupported status if the final schema keeps expiration as timestamp state.

### 7.13 Retention test

Create records with different retention states.

Verify:

- active data remains;
- retention-due data is selected;
- protected data remains;
- archived data is excluded from active views;
- purge is idempotent;
- failed purge is retryable.

### 7.14 Partition test

For partitioned tables:

- insert records across partition boundaries;
- verify correct partition;
- query time range;
- inspect partition pruning;
- archive/drop eligible partitions only through approved lifecycle;
- verify indexes on partitions.

### 7.15 Performance test

Representative queries:

1. current Job by ID;
2. active Jobs by organization;
3. Run history by Job;
4. active Runs by Resource;
5. telemetry chunks by Run/time;
6. logs by Run/time;
7. Result by Run;
8. Result Files by Result;
9. Metrics by Result;
10. retention-eligible records.

Initial targets:

- Job/Run normal read p95 < 500 ms;
- Result read p95 < 500 ms;
- execution state update p95 < 750 ms under expected development/staging load.

Targets shall be revalidated against production sizing.

### 7.16 Tenant isolation test

Organization A and B each create:

- Jobs;
- Runs;
- Results;
- Experiments;
- Downloads.

Verify:

    A -> A = ALLOWED
    A -> B = DENIED
    B -> A = DENIED
    B -> B = ALLOWED

### 7.17 Migration test

Verify:

- clean migration;
- upgrade migration;
- indexes;
- constraints;
- RLS;
- partitions where applicable;
- seed data;
- rollback/recovery strategy.

### 7.18 Reconciliation test

Simulate:

- Job without Run;
- Run without expected Job;
- Result without completed Run;
- Result File without object;
- telemetry metadata without storage payload;
- duplicate chunk;
- missing chunk.

Expected:

- discrepancy detected;
- discrepancy recorded;
- no silent data corruption.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate a complete durable execution-data lifecycle from booking through Job, Run, telemetry/log metadata, Result, experiment, comparison, download, and archival.

### 8.2 Step 1 — Start from confirmed booking

Select:

    Organization
    Project
    Artifact
    Booking
    Resource

Expected:

Booking is CONFIRMED.

### 8.3 Step 2 — Create Job

Create execution Job.

Expected:

    Job = CREATED

### 8.4 Step 3 — Queue and validate

Transition:

    CREATED
      -> QUEUED
      -> VALIDATING

Verify artifact, booking, platform and resource references.

### 8.5 Step 4 — Create Run

Create Run.

Expected:

Run contains execution snapshot metadata.

### 8.6 Step 5 — Start execution

Transition:

    Run
      -> PREPARING
      -> STARTING
      -> RUNNING

Expected:

Job and Run state remain consistent.

### 8.7 Step 6 — Ingest telemetry

Create telemetry stream and chunks.

Expected:

Sequence and time ranges are persisted.

### 8.8 Step 7 — Ingest logs

Create log stream and chunks.

Expected:

Logs are associated with the Run.

### 8.9 Step 8 — Record video

Create video session.

Expected:

Live video is represented through metadata without storing live media in PostgreSQL.

### 8.10 Step 9 — Complete execution

Transition:

    Run -> STOPPING -> COMPLETED
    Job -> STOPPING -> COMPLETED

### 8.11 Step 10 — Generate Result

Create Result and move:

    CREATED -> PROCESSING -> AVAILABLE

### 8.12 Step 11 — Add files

Add:

- summary;
- telemetry export;
- logs;
- video recording.

Expected:

All large payloads are stored externally with database metadata.

### 8.13 Step 12 — Add metrics

Record:

    execution_time
    success_rate
    average_latency
    max_temperature
    energy_consumption

Expected:

Metrics are queryable by Result.

### 8.14 Step 13 — Create experiment

Create Experiment.

Add:

    Run 1 = BASELINE
    Run 2 = CANDIDATE

### 8.15 Step 14 — Compare

Create Comparison.

Expected:

Comparison metrics are generated without modifying source Results.

### 8.16 Step 15 — Download

Request Result File.

Expected:

Download metadata is recorded and access is controlled.

### 8.17 Step 16 — Archive

Move Result through archival workflow.

Expected:

    AVAILABLE
      -> RETENTION_DUE
      -> ARCHIVED

### 8.18 Step 17 — Performance evidence

Show:

- relevant indexes;
- query plan;
- partitioning evidence if enabled;
- retention query;
- tenant-isolation test.

### 8.19 Demo completion

The demo passes when:

> A confirmed booking produces durable Job and Run state, associated telemetry/log/video metadata, a complete Result, structured metrics, experiment/comparison data, controlled downloads, and a deterministic archival lifecycle.

---
