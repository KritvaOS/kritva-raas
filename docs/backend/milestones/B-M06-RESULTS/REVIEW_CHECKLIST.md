# B-M06-RESULTS — Review Checklist

Milestone: B-M06 — Results

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

    Unit Tests
       |
       v
    Schema / Repository Tests
       |
       v
    Ingestion Contract Tests
       |
       v
    Lab Agent Integration Tests
       |
       v
    Result Processing Tests
       |
       v
    Download Security Tests
       |
       v
    Retention Tests
       |
       v
    End-to-End Tests
       |
       v
    Load / Data-Volume Tests

## 7.2 Telemetry Tests

Test:

- valid sample;
- invalid sample;
- duplicate;
- gap;
- out-of-order;
- stale timestamp;
- future timestamp;
- unknown signal;
- invalid unit;
- high-rate ingestion;
- burst traffic;
- disconnect;
- reconnect.

Verify no duplicate or corrupted durable data.

## 7.3 Log Tests

Test:

- INFO;
- WARN;
- ERROR;
- structured log;
- malformed log;
- duplicate log;
- secret-containing log;
- oversized log;
- burst logging;
- disconnect;
- reconnect.

Verify redaction.

## 7.4 Video Tests

Test:

- session authorization;
- WebRTC connection;
- camera disconnect;
- recording start;
- recording stop;
- recording failure;
- file registration;
- checksum;
- download authorization;
- retention purge.

## 7.5 Result Tests

Test:

- Result creation;
- processing;
- publication;
- failure;
- archival;
- purge;
- duplicate publication;
- missing telemetry;
- missing logs;
- missing video;
- partial output.

Mandatory outputs must be clearly defined.

## 7.6 Experiment Tests

Test:

- create;
- update;
- activate;
- complete;
- archive;
- add Run;
- remove Run;
- duplicate membership;
- invalid Run;
- cross-tenant membership.

## 7.7 Comparison Tests

Test:

- baseline/candidate;
- identical metrics;
- improved;
- degraded;
- unchanged;
- missing metric;
- incompatible metric;
- failed comparison;
- duplicate comparison request.

## 7.8 Download Tests

Test:

- authorized download;
- unauthorized download;
- expired URL;
- expired file;
- purged file;
- cross-tenant access;
- object-path manipulation;
- repeated download;
- large download.

## 7.9 Retention Tests

Test:

    Active
      |
      v
    Due
      |
      v
    Archive
      |
      v
    Purge

Verify:

- correct records transition;
- policy exceptions work;
- repeated purge is safe;
- audit records remain where required;
- object storage and metadata remain consistent.

## 7.10 Lab Agent Integration Tests

Test:

- authentication;
- registration;
- heartbeat;
- telemetry;
- logs;
- result upload;
- disconnect;
- reconnect;
- buffering;
- duplicate delivery;
- sequence gap;
- malformed message;
- unauthorized message.

## 7.11 Disconnect Test

Scenario:

    Run RUNNING
       |
       v
    Lab Agent Disconnect
       |
       +--> Local Buffer
       |
       v
    Reconnect
       |
       v
    Replay / Resume
       |
       v
    Durable Result

Verify that local safety remains independent of the cloud.

## 7.12 Data Loss Test

Intentionally interrupt network during telemetry.

Expected:

- bounded loss according to configured policy;
- explicit sequence gap;
- no fabricated samples;
- Run state remains authoritative.

## 7.13 Tenant Isolation Test

Create:

    Organization A
       |
       +--> Result A
       +--> File A
       +--> Experiment A

    Organization B
       |
       +--> Result B
       +--> File B
       +--> Experiment B

Verify cross-tenant access is denied.

## 7.14 E2E Result Flow

    Artifact
       |
       v
    Booking
       |
       v
    Job
       |
       v
    Run
       |
       +--> Telemetry
       +--> Logs
       +--> Video
       |
       v
    Result
       |
       +--> Metrics
       +--> Files
       |
       v
    Experiment
       |
       v
    Comparison
       |
       v
    Download

## 7.15 Performance Targets

Initial targets:

| Operation | Target |
|---|---:|
| Result metadata read p95 | <500 ms |
| Result list p95 | <1 s |
| Metric query p95 | <1 s |
| Experiment metadata read p95 | <500 ms |
| Comparison creation p95 | <1 s excluding large processing |
| Download authorization p95 | <500 ms |
| Telemetry ingestion acknowledgement p95 | <500 ms |
| Log ingestion acknowledgement p95 | <500 ms |
| Result publication trigger p95 | <1 s |

High-rate ingestion throughput must be capacity-tested against the expected
robot/platform profile.

## 7.16 Data Volume Qualification

Qualification must measure:

- samples/second;
- log messages/second;
- bytes/second;
- concurrent Runs;
- concurrent Lab Agents;
- video recordings;
- daily object growth;
- database growth;
- retention deletion throughput.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate the complete path from a real or simulated Run through telemetry,
logs and video to a durable Result, Experiment, Comparison and Download.

## 8.2 Preparation

- [ ] Organization exists.
- [ ] Project exists.
- [ ] Platform exists.
- [ ] Booking exists.
- [ ] Artifact exists.
- [ ] Lab Agent exists.
- [ ] Result storage exists.
- [ ] Object storage exists.
- [ ] Worker is running.

## 8.3 Step 1 — Start Run

Execute an eligible Job.

Expected:

    Run = RUNNING

## 8.4 Step 2 — Generate Telemetry

Generate:

    battery.level
    cpu.utilization
    execution.duration

Expected:

- telemetry accepted;
- sequence increases;
- timestamps recorded.

## 8.5 Step 3 — Generate Logs

Generate:

    INFO
    WARN
    ERROR

Expected:

- logs accepted;
- sensitive values redacted;
- Run association preserved.

## 8.6 Step 4 — Generate Video

Start recording.

Expected:

- recording metadata created;
- camera/session associated with Run.

## 8.7 Step 5 — Complete Run

Stop execution normally.

Expected:

    Run = COMPLETED

## 8.8 Step 6 — Generate Result

Expected:

    Result = PROCESSING

then:

    Result = AVAILABLE

## 8.9 Step 7 — Inspect Result

Verify:

- summary;
- files;
- metrics;
- telemetry;
- logs;
- video metadata.

## 8.10 Step 8 — Create Experiment

Create:

    Experiment: Motor Controller Evaluation

Add:

    Run 1 = BASELINE
    Run 2 = CANDIDATE

## 8.11 Step 9 — Compare

Compare:

    execution.duration
    cpu.average
    battery.minimum

Expected:

    Comparison = AVAILABLE

with direction:

    IMPROVED
    DEGRADED
    UNCHANGED
    NOT_COMPARABLE

as appropriate.

## 8.12 Step 10 — Download

Request a result file.

Expected:

- authorization;
- controlled download;
- audit event.

## 8.13 Step 11 — Disconnect Lab Agent

Interrupt the connection during execution.

Expected:

- heartbeat failure detected;
- local buffering activates where configured;
- reconnect occurs;
- data resumes;
- no unsafe restart.

## 8.14 Step 12 — Retention

Create a test result whose retention deadline has elapsed.

Run retention processing.

Expected:

    ACTIVE
       |
       v
    ARCHIVED / PURGED

according to policy.

## 8.15 Demo Success Criteria

The demo passes when:

- telemetry is ingested;
- logs are ingested and redacted;
- video metadata is stored;
- Result becomes AVAILABLE;
- metrics are queryable;
- Experiment contains Runs;
- Comparison is generated;
- downloads are authorized and audited;
- Lab Agent reconnect works;
- retention behaves correctly.

---
