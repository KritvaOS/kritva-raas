# F-M07-RESULTS — Review Checklist

Milestone: F-M07 — Results

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7. Test and Verification Plan

## 7.1 Test Pyramid

    Unit
      |
      v
    Result Domain
      |
      v
    API Contract
      |
      v
    Database/Object Storage
      |
      v
    Experiment/Comparison
      |
      v
    Rerun
      |
      v
    Download
      |
      v
    End-to-End

## 7.2 Result Lifecycle Tests

Test:

- CREATED → PROCESSING;
- PROCESSING → AVAILABLE;
- PROCESSING → FAILED;
- AVAILABLE → ARCHIVED;
- ARCHIVED → PURGED.

Verify invalid transitions are rejected.

## 7.3 Result File Tests

Test:

- file creation;
- upload;
- metadata persistence;
- checksum;
- availability;
- archive;
- purge;
- missing object;
- object-storage failure.

## 7.4 Metric Tests

Test:

- NUMBER;
- INTEGER;
- BOOLEAN;
- STRING;
- RAW;
- MIN;
- MAX;
- AVERAGE;
- SUM;
- COUNT;
- MEDIAN;
- P95;
- P99.

Verify metric values are not silently converted or rounded incorrectly.

## 7.5 Experiment Tests

Test:

- create;
- update;
- add Run;
- remove Run;
- role assignment;
- duplicate membership;
- unauthorized membership;
- cross-project Run;
- cross-tenant Run.

## 7.6 Comparison Tests

Test:

- compatible metrics;
- incompatible metrics;
- baseline/candidate;
- multiple candidates;
- missing metric;
- missing Result;
- processing;
- failure;
- successful comparison.

## 7.7 Rerun Tests

Test:

1. Completed Run.
2. Open Result.
3. Select Rerun.
4. Review original configuration.
5. Select valid booking.
6. Confirm.
7. Create new Job.
8. Create new Run.
9. Execute.
10. Produce new Result.

Verify:

- original Run unchanged;
- original Result unchanged;
- new Run distinct;
- new Result distinct;
- lineage preserved.

## 7.8 Download Tests

Test:

- valid download;
- unauthorized download;
- expired access;
- missing object;
- large file;
- failed generation;
- cancelled request;
- repeated download request.

Verify download audit.

## 7.9 Tenant Isolation Tests

Verify organization A cannot:

- list organization B Results;
- view organization B Result;
- view organization B files;
- download organization B files;
- compare organization B Runs;
- rerun organization B Runs;
- add organization B Runs to experiments.

## 7.10 Source Privacy Tests

Create result artifacts containing prohibited source-like content in the test
environment.

Verify policy enforcement according to artifact/result security policy.

The normal Result flow must not automatically collect:

- source directories;
- Git metadata;
- compiler inputs;
- developer secrets.

## 7.11 Object Storage Consistency Tests

Test:

    PostgreSQL metadata exists
       |
       v
    Object exists

and:

    PostgreSQL metadata exists
       |
       v
    Object missing

The second condition must be detectable and reconciled.

## 7.12 Idempotency Tests

Repeat:

    createResult
    createComparison
    requestDownload
    createRerun

Expected:

- no duplicate logical operation;
- stable idempotency behavior;
- audit trail remains coherent.

## 7.13 E2E Results Test

Primary flow:

    Completed Run
       |
       v
    Result AVAILABLE
       |
       +--> Files
       +--> Metrics
       |
       v
    Experiment
       |
       v
    Comparison
       |
       v
    Download
       |
       v
    Rerun
       |
       v
    New Job
       |
       v
    New Run
       |
       v
    New Result

## 7.14 Failure Injection

Inject:

- result processor failure;
- object-storage failure;
- missing result file;
- comparison failure;
- download failure;
- booking expiration;
- artifact revocation;
- authorization change;
- database timeout.

Verify safe and understandable recovery.

## 7.15 UI Verification

Verify:

- dashboard;
- detail;
- files;
- metrics;
- experiment;
- comparison;
- rerun;
- download;
- loading;
- empty;
- error;
- archived;
- purged.

## 7.16 Performance Qualification

Initial targets:

| Operation | Target |
|---|---:|
| Results dashboard p95 | <= 1 s for normal page |
| Result detail p95 | <= 1 s excluding large files |
| Metric load p95 | <= 1 s |
| Comparison creation acknowledgement | <= 500 ms |
| Download request acknowledgement | <= 500 ms |
| Rerun creation acknowledgement | <= 1 s |
| Large file download | network dependent |
| Result list pagination | bounded |

Targets are engineering baselines and must be validated with measured
qualification data.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate the complete customer lifecycle from a completed Run to result
inspection, comparison, download and rerun.

## 8.2 Preparation

- [ ] Project exists.
- [ ] Artifact exists.
- [ ] Booking exists.
- [ ] Completed Run exists.
- [ ] Result is available.
- [ ] Result contains files.
- [ ] Result contains metrics.
- [ ] At least two Runs exist for comparison.
- [ ] Valid booking is available for rerun.

## 8.3 Step 1 — Open Results

Navigate to Results.

Expected:

    Results
    R-001
    R-002
    R-003

Statuses and summary metrics are visible.

## 8.4 Step 2 — Open Result

Open R-001.

Expected:

    Result: AVAILABLE
    Run: R-001
    Job: J-001
    Outcome: SUCCESS

Execution context is visible.

## 8.5 Step 3 — Inspect Files

Open Files.

Expected:

    report.json
    telemetry.csv
    execution.log
    video.mp4

Each file shows status and metadata.

## 8.6 Step 4 — Inspect Metrics

Open Metrics.

Expected:

    Accuracy       98.2 %
    Avg Latency    22 ms
    P95 Latency    38 ms

Metric type and aggregation are clear.

## 8.7 Step 5 — Create Experiment

Create:

    Camera Optimization

Add:

    R-001 -> BASELINE
    R-002 -> CANDIDATE

Expected membership is visible.

## 8.8 Step 6 — Compare

Create comparison.

Expected:

    Baseline      Candidate     Direction
    98.2          99.1          IMPROVED
    22 ms         19 ms         IMPROVED

The comparison does not alter either Result.

## 8.9 Step 7 — Download

Download `report.json`.

Expected:

- download request accepted;
- access generated;
- file downloaded;
- audit recorded.

## 8.10 Step 8 — Rerun

Select Rerun from R-001.

Expected:

    Original Artifact: vision-app 1.2
    Platform: Reference Robot
    Configuration: Original

Select a current booking.

Confirm.

Expected:

    New Job: J-004
    New Run: R-004

Original R-001 remains unchanged.

## 8.11 Step 9 — Inspect Rerun

Open R-004.

Expected:

- new execution state;
- new Result after completion;
- lineage indicates R-004 is a rerun of R-001.

## 8.12 Step 10 — Compare Original and Rerun

Create comparison:

    R-001 -> BASELINE
    R-004 -> CANDIDATE

Expected:

- metrics compared;
- delta shown;
- direction shown;
- original remains immutable.

## 8.13 Demo Success Criteria

The demo passes when:

- results dashboard works;
- result detail works;
- files work;
- metrics work;
- experiment works;
- comparison works;
- download works;
- rerun creates a new Job/Run;
- historical integrity is preserved.

---
