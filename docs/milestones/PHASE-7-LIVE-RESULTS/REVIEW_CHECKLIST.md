# PHASE-7-LIVE-RESULTS — Review Checklist

Milestone: PHASE-7-LIVE-RESULTS — Live Operations, Video, Telemetry and Results Experience

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

    Unit
      |
      v
    Contract
      |
      v
    Integration
      |
      +--> WebSocket
      +--> WebRTC
      +--> Telemetry
      +--> Logs
      +--> Results
      |
      v
    E2E
      |
      v
    Physical Lab

### 7.2 WebSocket tests

Test:

- connection;
- authentication;
- authorization;
- event delivery;
- duplicate events;
- sequence gaps;
- reconnect;
- snapshot recovery;
- disconnect.

### 7.3 WebRTC tests

Test:

- authorization;
- signaling;
- SDP;
- ICE;
- TURN;
- media startup;
- packet loss;
- network change;
- reconnect;
- session expiry.

### 7.4 Video failure tests

Simulate:

- camera disconnect;
- media service failure;
- network loss;
- high latency;
- packet loss;
- TURN failure.

Expected:

- video becomes unavailable;
- Run state remains authoritative;
- safety state remains independently sourced;
- UI communicates failure.

### 7.5 Telemetry tests

Verify:

- ordering;
- timestamps;
- sequence;
- freshness;
- units;
- malformed payloads;
- missing samples;
- reconnect;
- buffering.

### 7.6 Log tests

Verify:

- live delivery;
- filtering;
- ordering;
- redaction;
- reconnect;
- persistence;
- oversized log handling.

### 7.7 Results tests

Verify:

- creation;
- processing;
- availability;
- failure;
- cancellation;
- archive;
- purge.

### 7.8 Result file tests

Verify:

- object creation;
- checksum;
- metadata;
- authorization;
- download;
- expiration;
- archive;
- purge.

### 7.9 Metrics tests

Verify every supported metric type and aggregation.

For percentile calculations, test:

- small samples;
- large samples;
- duplicate values;
- missing values;
- empty datasets;
- invalid values.

### 7.10 Experiment tests

Verify:

- lifecycle;
- Run membership;
- role assignment;
- tenant isolation;
- archive;
- completion.

### 7.11 Comparison tests

Verify:

- compatible metrics;
- incompatible metrics;
- missing metrics;
- different units;
- baseline/candidate;
- derived direction;
- repeated comparison.

### 7.12 Rerun tests

Verify:

- compatible artifact;
- incompatible artifact;
- unavailable robot;
- expired booking;
- missing permissions;
- changed platform version;
- changed configuration.

### 7.13 Reconnect tests

Disconnect:

- WebSocket;
- WebRTC;
- telemetry;
- logs;
- Control Plane.

Verify independent recovery.

### 7.14 Tenant tests

Create:

    Organization A
    Organization B

Verify that all live and result resources remain isolated.

### 7.15 Security tests

Test:

- token expiration;
- session revocation;
- unauthorized video;
- unauthorized telemetry;
- unauthorized Result;
- download URL reuse;
- cross-tenant object access;
- log injection;
- event replay.

### 7.16 Performance targets

Initial targets:

| Operation | Target |
|---|---:|
| Live state retrieval | p95 < 500 ms |
| WebSocket event delivery | p95 < 500 ms under normal load |
| Video session setup | p95 < 3 s |
| Telemetry delivery | application-specific |
| Result retrieval | p95 < 500 ms |
| Download authorization | p95 < 500 ms |
| Experiment query | p95 < 750 ms |
| Comparison request acceptance | p95 < 750 ms |

Media latency depends on network topology and is separately measured.

### 7.17 Load testing

Test:

- concurrent Runs;
- concurrent WebSocket connections;
- concurrent telemetry streams;
- concurrent video sessions;
- result queries;
- downloads.

The test shall identify:

- CPU saturation;
- memory growth;
- DB connection pressure;
- queue pressure;
- WebSocket fanout;
- object storage throughput.

### 7.18 Data integrity tests

Verify:

- every Result references valid Run;
- every Result File references valid Result;
- every Run belongs to correct organization;
- every Experiment Run reference is valid;
- every Comparison reference is valid;
- object storage metadata matches object;
- checksums match.

### 7.19 Retention tests

Verify:

    ACTIVE
       |
       v
    RETENTION_DUE
       |
       v
    ARCHIVED
       |
       v
    PURGE_ELIGIBLE
       |
       v
    PURGED

No premature purge is permitted.

### 7.20 Recovery tests

Simulate:

- Control Plane restart;
- WebSocket broker restart;
- media service restart;
- Lab Agent reconnect;
- object storage transient failure;
- Result worker failure.

Verify durable state remains authoritative.

### 7.21 Evidence

Required evidence:

- WebSocket contract tests;
- WebRTC test report;
- telemetry test report;
- log security report;
- Results integration tests;
- experiment/comparison tests;
- rerun tests;
- tenant isolation report;
- performance report;
- retention/reconciliation report;
- complete E2E report.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate the complete:

    Run
      |
      v
    Live Observation
      |
      v
    Result
      |
      v
    Analyze
      |
      v
    Compare
      |
      v
    Rerun

workflow.

### 8.2 Step 1 — Start execution

Use an approved artifact and confirmed booking.

Start Run.

Expected:

    Job = RUNNING
    Run = RUNNING

### 8.3 Step 2 — Open Live view

Studio displays:

- Run ID;
- robot;
- platform;
- resource;
- status;
- safety state;
- video;
- telemetry;
- logs.

### 8.4 Step 3 — Verify video

Expected:

    Camera
       |
       v
    WebRTC
       |
       v
    Studio

Video renders with current timestamp/session state.

### 8.5 Step 4 — Verify telemetry

Display:

- joint state;
- robot state;
- selected sensors;
- runtime state;
- safety state.

Show freshness indicators.

### 8.6 Step 5 — Verify logs

Show:

- application logs;
- Runtime logs;
- lifecycle events.

Filter:

    ERROR

Expected only relevant entries.

### 8.7 Step 6 — Disconnect WebSocket

Disconnect the live event channel.

Expected:

    Live Events = DISCONNECTED
    Durable Run State = AVAILABLE

Reconnect.

Expected:

    Snapshot = REFRESHED
    Events = RESUMED

### 8.8 Step 7 — Disconnect video

Simulate video failure.

Expected:

    Video = UNAVAILABLE

but:

    Run = RUNNING
    Safety = independently displayed
    Telemetry = still available if its channel remains healthy

### 8.9 Step 8 — Complete Run

Allow execution to complete.

Expected:

    Run = COMPLETED

### 8.10 Step 9 — Open Result

Open Result.

Display:

- status;
- Run;
- artifact;
- robot;
- platform;
- duration;
- files;
- metrics.

### 8.11 Step 10 — Inspect files

Open:

- logs;
- telemetry;
- application output;
- video recording if available.

Verify checksums and metadata.

### 8.12 Step 11 — Inspect metrics

Display:

- raw;
- average;
- minimum;
- maximum;
- percentile metrics where available.

### 8.13 Step 12 — Create Experiment

Create:

    Experiment: Walking Controller Study

Add Run as:

    BASELINE

### 8.14 Step 13 — Execute second Run

Modify an allowed parameter.

Book another execution.

Run it.

Expected:

    New Job
    New Run

### 8.15 Step 14 — Add second Run

Add second Run as:

    CANDIDATE

### 8.16 Step 15 — Compare

Create Comparison.

Expected:

- baseline;
- candidate;
- comparable metrics;
- differences;
- direction.

### 8.17 Step 16 — Download

Request result bundle.

Expected:

    REQUESTED
       |
       v
    GENERATED
       |
       v
    DOWNLOADED

Audit entry is created.

### 8.18 Step 17 — Rerun

Select original Run.

Choose:

    RERUN

Expected:

- original configuration displayed;
- compatibility checked;
- booking initiated;
- new Job created.

Original Run remains unchanged.

### 8.19 Step 18 — Verify tenant isolation

Switch to another organization.

Attempt Result access.

Expected:

    DENIED

### 8.20 Demo completion

The Phase 7 demo passes when:

    Live Execution
          |
          +--> Video
          +--> Telemetry
          +--> Logs
          +--> Safety
          |
          v
       Completed
          |
          v
        Result
          |
          +--> Metrics
          +--> Files
          +--> Experiment
          +--> Comparison
          +--> Download
          +--> Rerun

works using production domain boundaries.

---
