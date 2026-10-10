# B-M06 — Results

## Milestone Dossier

**Milestone ID:** B-M06-RESULTS  
**Product:** Kritva RaaS  
**Primary Phase:** Phase 6 — LAB & ROBOT  
**Supporting Phases:** Phase 7 — LIVE & RESULTS  
**Primary Surface:** RaaS Control Plane / Backend  
**Technology:** TypeScript/Node.js, PostgreSQL, object storage, WebSocket/realtime transport, WebRTC/media infrastructure, provider-neutral Lab Agent interfaces  
**Architecture:** Production-oriented Modular Monolith with asynchronous ingestion and processing workers  
**Priority:** P0  
**Status:** PLANNED  
**Primary Outcome:** Establish the authoritative backend result pipeline for telemetry, logs, video, execution results, experiment metadata, downloads and retention, while introducing the real Lab Agent integration boundary required for controlled laboratory execution.

---

# 1 Objective

## 1.1 Milestone Objective

B-M06 establishes the backend result and observation pipeline that converts
execution activity into durable, searchable and downloadable customer results.

The milestone connects:

    Physical / Simulated Robot
             |
             v
        Kritva Runtime
             |
             v
         Lab Agent
             |
       +-----+------+----------------+
       |            |                |
       v            v                v
    Telemetry      Logs            Video
       |            |                |
       +------------+----------------+
                    |
                    v
             Lab / Ingestion
                    |
                    v
             Control Plane
                    |
          +---------+---------+
          |                   |
          v                   v
     Live Channels       Result Service
                              |
                 +------------+------------+
                 |            |            |
                 v            v            v
              Metrics      Files      Metadata
                 |            |            |
                 +------------+------------+
                              |
                              v
                         PostgreSQL
                              |
                              v
                        Object Storage
                              |
                              v
                          Downloads
                              |
                              v
                         Experiments

The milestone establishes the backend foundations consumed by F-M06 Live and
F-M07 Results.

## 1.2 Product Goal

A customer must be able to:

1. execute a Job;
2. observe live telemetry, logs and video;
3. complete the Run;
4. retain durable execution evidence;
5. inspect generated metrics;
6. access result files;
7. create or update experiment metadata;
8. group Runs into an experiment;
9. compare Runs or experiment candidates;
10. download authorized result artifacts;
11. rerun a completed experiment through the existing execution path;
12. retain and purge data according to policy.

## 1.3 Observation vs Result Principle

Live observation and durable results are separate concerns.

    Live Observation
          |
          v
    WebSocket / WebRTC
          |
          v
    Human Observation

versus:

    Execution
       |
       v
    Durable Result
       |
       +--> Metrics
       +--> Files
       +--> Metadata
       +--> Experiment
       +--> Download

The loss of a live connection must not destroy durable execution evidence.

## 1.4 Source of Truth Principle

The system must distinguish:

- live telemetry;
- durable telemetry;
- live logs;
- durable logs;
- live video;
- stored video;
- Run state;
- Result state.

The baseline rule is:

> Live data is for observation; durable state is for truth.

## 1.5 Result Objective

A Result represents the durable outcome of a Run.

The baseline model contains:

- Result identity;
- Organization;
- Project;
- Run;
- status;
- summary;
- timestamps;
- storage references;
- metrics;
- result files;
- metadata.

The Result must not replace the Run.

The Run remains the authoritative execution lifecycle record.

## 1.6 Telemetry Objective

Telemetry provides time-series execution information such as:

- joint position;
- velocity;
- torque;
- battery;
- temperature;
- CPU utilization;
- sensor values;
- application-defined signals.

Telemetry must support:

- timestamp;
- signal identity;
- value;
- unit;
- quality;
- source;
- sequence;
- Run identity.

## 1.7 Log Objective

Logs provide execution diagnostics.

Logs must preserve:

- timestamp;
- severity;
- source;
- Run;
- sequence;
- message;
- structured metadata where applicable.

Logs may be streamed live and persisted durably.

## 1.8 Video Objective

Video provides visual evidence of execution.

The backend must distinguish:

- live video session;
- media transport;
- recording;
- recorded video result file.

WebRTC is the primary live video transport.

The application API must not become an unnecessary high-bandwidth media proxy.

## 1.9 Experiment Objective

Experiments group Runs and their associated results.

Conceptually:

    Experiment
       |
       +--> Run A
       +--> Run B
       +--> Run C
       |
       +--> Baseline
       +--> Candidate
       +--> Reference

Experiment metadata provides scientific/engineering context without changing
the underlying Run history.

## 1.10 Comparison Objective

Comparison allows users to evaluate:

- baseline vs candidate;
- control vs trial;
- reference vs candidate;
- selected metric values.

Comparison data is derived information.

It must not overwrite source Run or Result records.

## 1.11 Download Objective

Downloads provide controlled access to:

- result files;
- logs;
- telemetry exports;
- recorded video;
- experiment reports;
- comparison outputs.

Downloads must be:

- authorized;
- auditable;
- tenant-scoped;
- time-bounded where appropriate;
- protected against path/reference manipulation.

## 1.12 Retention Objective

Retention must define separate policies for:

- business metadata;
- metrics;
- logs;
- telemetry;
- video;
- result files;
- downloads;
- experiment metadata.

Large media and telemetry data must not automatically receive the same retention
period as core business records.

## 1.13 Real Lab Agent Objective

B-M06 establishes integration with a real Lab Agent.

The Lab Agent remains the boundary between:

    Cloud / Control Plane
            |
            v
        Lab Agent
            |
            v
    Local Runtime / Robot

The Lab Agent must provide secure ingestion of execution observations and
durable-result handoff without making the cloud the physical safety authority.

## 1.14 Safety Objective

B-M06 must preserve the safety principles established in B-M05:

- local safety authority;
- physical E-stop is separate;
- cloud connectivity does not define safety;
- stale safety is not safe;
- live observation does not replace local safety.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M06 includes:

- telemetry ingestion;
- telemetry normalization;
- telemetry persistence;
- telemetry aggregation;
- log ingestion;
- log persistence;
- log normalization;
- video session metadata;
- video recording metadata;
- video result files;
- result service;
- Result lifecycle;
- result files;
- result metrics;
- experiment metadata;
- experiment membership;
- comparisons;
- comparison metrics;
- downloads;
- download authorization;
- download audit;
- retention policies;
- result publication;
- result reconciliation;
- real Lab Agent integration;
- Lab Agent observation channels;
- Lab Agent heartbeat;
- ingestion authentication;
- ingestion idempotency;
- live-to-durable handoff;
- result processing workers.

## 2.2 Explicitly Out of Scope

B-M06 does not implement:

- product UI implementation;
- local source-code storage;
- local compilation;
- physical E-stop hardware;
- robot motion control;
- payment processing;
- subscription management;
- advanced machine-learning analytics;
- fleet-wide predictive maintenance;
- arbitrary user-provided executable server-side processing.

## 2.3 Live vs Durable Data

| Data | Live Path | Durable Path |
|---|---|---|
| Job state | WebSocket | PostgreSQL |
| Run state | WebSocket | PostgreSQL |
| Telemetry | WebSocket/realtime | Result/telemetry storage |
| Logs | WebSocket | Result files/log storage |
| Video | WebRTC | Object storage |
| Safety state | WebSocket | Durable snapshot |
| Lab status | WebSocket | Lab/resource state |
| Results | Not primarily live | PostgreSQL/object storage |
| Experiments | REST/events | PostgreSQL |
| Downloads | REST | Audit + object storage |

## 2.4 Result vs Run

Run answers:

> What happened to the execution lifecycle?

Result answers:

> What durable evidence and outputs did the execution produce?

Both must remain separately queryable.

## 2.5 Raw vs Derived Data

Raw:

- telemetry samples;
- raw logs;
- recorded media;
- execution files.

Derived:

- metrics;
- summaries;
- comparisons;
- reports;
- aggregates.

Derived data must preserve references to its source where practical.

---

# 3 Dependencies

## 3.1 Upstream Milestones

B-M06 depends on:

- B-M01 Control Plane;
- B-M02 Artifact;
- B-M03 Platform;
- B-M04 Booking;
- B-M05 Execution;
- PostgreSQL;
- object storage;
- authentication;
- authorization;
- audit;
- queue/worker infrastructure.

## 3.2 B-M05 Dependency

B-M05 provides:

- Job;
- Run;
- execution state;
- execution identity;
- Lab Agent contract;
- simulated Lab Agent;
- timeout;
- cancellation;
- execution events.

B-M06 consumes these without redefining the execution lifecycle.

## 3.3 B-M03 Dependency

B-M03 provides:

- Lab;
- Resource;
- Robot;
- Platform;
- Platform Version;
- capability;
- operational state.

B-M06 associates observations with the historical execution context.

## 3.4 B-M04 Dependency

B-M04 provides:

- booking;
- resource allocation;
- credit reservation;
- consumption policy.

Result processing may reference booking and credit evidence but does not mutate
commercial state directly.

## 3.5 Object Storage Dependency

Large data belongs in object storage:

- video;
- large logs;
- telemetry exports;
- result packages;
- experiment reports.

PostgreSQL stores:

- metadata;
- ownership;
- status;
- checksum;
- content type;
- storage reference;
- lifecycle state.

## 3.6 Real Lab Agent Dependency

The real Lab Agent must support:

- authenticated connection;
- Run association;
- telemetry channel;
- log channel;
- video/media integration;
- durable result upload;
- heartbeat;
- disconnect handling;
- local buffering where required.

---

# 4 Deliverables

## 4.1 Telemetry Ingestion Service

The service receives:

    Lab Agent
       |
       v
    Telemetry Ingestion
       |
       +--> Validate
       +--> Normalize
       +--> Sequence Check
       +--> Buffer
       +--> Persist
       +--> Aggregate
       |
       v
    Durable Telemetry

The service must support high-rate data without blocking core Job/Run
transactions.

## 4.2 Telemetry Envelope

Conceptual:

    {
        "protocol_version": "1.0",
        "run_id": "run-001",
        "sequence": 1001,
        "timestamp": "2026-10-08T20:00:01.123Z",
        "signal": "battery.level",
        "value": 82.5,
        "unit": "percent",
        "quality": "GOOD",
        "source": "runtime"
    }

Supported quality values should include:

    GOOD
    DEGRADED
    STALE
    INVALID
    UNKNOWN

## 4.3 Telemetry Sequence Handling

Sequence numbers allow:

- duplicate detection;
- gap detection;
- ordering analysis;
- replay/resynchronization.

Example:

    1001
    1002
    1003
    1007

The system detects:

    Gap = 1004-1006

A gap must not silently imply zero-valued samples.

## 4.4 Telemetry Storage

High-rate telemetry must use a storage design appropriate to volume.

The authoritative business database must not be overloaded with individual
samples when volume makes that inappropriate.

Possible architecture:

    PostgreSQL
       |
       +--> metadata
       +--> stream definitions
       +--> summary metrics

    Time-series / Object Storage
       |
       +--> raw samples
       +--> partitioned exports

The implementation must preserve provider neutrality.

## 4.5 Log Ingestion

    Lab Agent
       |
       v
    Log Ingestion
       |
       +--> Validate
       +--> Normalize
       +--> Redact
       +--> Sequence
       +--> Persist
       |
       v
    Durable Logs

Logs must support:

- severity;
- source;
- timestamp;
- Run;
- sequence;
- message;
- structured metadata.

## 4.6 Log Redaction

The ingestion path must prevent accidental persistence of:

- access tokens;
- private keys;
- passwords;
- API keys;
- credentials;
- source code where prohibited.

Sensitive content must be redacted according to the security policy.

## 4.7 Video Architecture

Live:

    Studio
       |
       | WebRTC
       v
    Media Endpoint
       |
       v
    Lab Camera

Recorded:

    Lab Camera
       |
       v
    Recording Service
       |
       v
    Object Storage
       |
       v
    Result File

The application API should provide authorization and metadata rather than
proxying the full video stream.

## 4.8 Video Result Metadata

Video result metadata includes:

- Result;
- Run;
- camera;
- start time;
- end time;
- duration;
- resolution;
- codec;
- frame rate;
- content type;
- checksum;
- storage reference;
- retention state.

## 4.9 Result Service

The Result Service owns:

- Result creation;
- processing;
- publication;
- failure;
- archival;
- purge;
- result files;
- result metrics;
- result metadata.

Baseline Result states:

    CREATED
       |
       v
    PROCESSING
       |
       v
    AVAILABLE

Alternative:

    FAILED
    CANCELLED
    ARCHIVED
    PURGED

## 4.10 Result Creation

A Result is associated with a Run.

Baseline invariant:

    One authoritative Result per Run

A future versioned-result model may be introduced through an explicit
architecture decision.

## 4.11 Result Files

Supported file categories include:

- VIDEO;
- LOG;
- TELEMETRY;
- METRIC_EXPORT;
- REPORT;
- ARTIFACT_OUTPUT;
- OTHER.

Each file must include:

- file identity;
- Result identity;
- type;
- name;
- content type;
- size;
- checksum;
- storage reference;
- status;
- retention information.

## 4.12 Result Metrics

Metrics support:

- numeric;
- integer;
- boolean;
- string.

Examples:

    execution.duration_seconds
    battery.minimum_percent
    cpu.average_percent
    error.count
    success

Metrics may have:

- unit;
- aggregation;
- source;
- timestamp;
- comparison role.

## 4.13 Experiment Metadata

Experiment contains:

- Organization;
- Project;
- name;
- description;
- hypothesis;
- objective;
- tags;
- metadata;
- lifecycle.

Experiment lifecycle:

    DRAFT
       |
       v
    ACTIVE
       |
       v
    COMPLETED
       |
       v
    ARCHIVED

## 4.14 Experiment Run Membership

An Experiment may contain many Runs.

    Experiment E1
       |
       +--> Run R1 BASELINE
       +--> Run R2 CONTROL
       +--> Run R3 TRIAL
       +--> Run R4 CANDIDATE

Membership must be explicit and auditable.

## 4.15 Comparison Service

Comparison produces derived information.

Conceptually:

    Baseline Result
          |
          +--> Metric A
          +--> Metric B
          |
          v
       Comparison
          ^
          |
          +--> Candidate Result
                  |
                  +--> Metric A
                  +--> Metric B

Comparison must never overwrite source metrics.

## 4.16 Comparison States

    CREATED
       |
       v
    PROCESSING
       |
       v
    AVAILABLE

Alternative:

    FAILED
    ARCHIVED

## 4.17 Download Service

Download flow:

    User
      |
      v
    Authorization
      |
      v
    Result File
      |
      v
    Download Authorization
      |
      v
    Signed / Controlled URL
      |
      v
    Object Storage
      |
      v
    Download

The backend must never allow arbitrary object-storage paths supplied by the
client.

## 4.18 Download Audit

Each download request must record:

- Organization;
- Project;
- user/service;
- Result;
- file;
- request time;
- completion status;
- IP/device metadata where policy permits;
- expiration;
- correlation ID.

## 4.19 Retention Service

Retention applies independently to:

    Business Metadata
    Result Metadata
    Metrics
    Logs
    Telemetry
    Video
    Result Files
    Download Records

Retention decisions must be policy-driven.

## 4.20 Retention Lifecycle

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

Deletion must be auditable.

## 4.21 Result Publication

Result generation:

    Run Completed
       |
       v
    Result CREATED
       |
       v
    PROCESSING
       |
       +--> Ingest telemetry
       +--> Persist logs
       +--> Register video
       +--> Generate metrics
       +--> Generate files
       |
       v
    AVAILABLE

The Result must not be marked AVAILABLE until all required mandatory outputs
are complete.

## 4.22 Real Lab Agent Integration

The real Lab Agent path is:

    Robot / Runtime
          |
          v
       Lab Agent
          |
          +--> Telemetry
          +--> Logs
          +--> Video Metadata
          +--> Result Files
          +--> Heartbeat
          |
          v
    Secure Lab Protocol
          |
          v
      Control Plane

The Lab Agent is responsible for local buffering when network interruption
could otherwise cause unacceptable data loss.

---

# 9 Risks

## 9.1 R-BM06-001 — Telemetry Overload

**Risk:** High-rate telemetry overwhelms PostgreSQL or application workers.

**Impact:** High.

**Mitigation:**

- asynchronous ingestion;
- buffering;
- batching;
- specialized storage where required;
- quotas;
- load testing.

## 9.2 R-BM06-002 — Data Loss During Disconnect

**Risk:** Network failure causes telemetry/log loss.

**Impact:** High.

**Mitigation:**

- Lab Agent local buffering;
- sequence numbers;
- replay;
- bounded-loss policy;
- explicit gaps.

## 9.3 R-BM06-003 — Duplicate Ingestion

**Risk:** Retries duplicate telemetry or logs.

**Impact:** Medium/High.

**Mitigation:**

- Run + source + sequence identity;
- idempotent ingestion;
- deduplication.

## 9.4 R-BM06-004 — Video Storage Growth

**Risk:** Video consumes excessive storage.

**Impact:** High.

**Mitigation:**

- retention policy;
- storage quotas;
- lifecycle policies;
- recording controls;
- monitoring.

## 9.5 R-BM06-005 — Cross-Tenant Result Leakage

**Risk:** Customer sees another organization's result/file.

**Impact:** Critical.

**Mitigation:**

- tenant-scoped repositories;
- object authorization;
- signed URL controls;
- security tests.

## 9.6 R-BM06-006 — Download Path Manipulation

**Risk:** Client accesses arbitrary object storage.

**Impact:** Critical.

**Mitigation:**

- server-side object references;
- controlled download authorization;
- no raw path acceptance;
- audit.

## 9.7 R-BM06-007 — Result Incompleteness

**Risk:** Result becomes AVAILABLE while required outputs are missing.

**Impact:** High.

**Mitigation:**

- processing state;
- required-output checklist;
- publication gate;
- reconciliation.

## 9.8 R-BM06-008 — Retention Deletes Required Data

**Risk:** Data is purged before policy/legal requirement expires.

**Impact:** Critical.

**Mitigation:**

- policy versioning;
- retention holds;
- dry-run mode;
- audit;
- explicit purge authorization.

## 9.9 R-BM06-009 — Live/Durable Confusion

**Risk:** Users interpret live stream failure as execution failure.

**Impact:** High.

**Mitigation:**

- separate states;
- durable Run state;
- explicit connection status;
- UI/backend contracts.

## 9.10 R-BM06-010 — Lab Agent Compromise

**Risk:** Compromised Lab Agent injects unauthorized data.

**Impact:** Critical.

**Mitigation:**

- mTLS/service identity;
- authorization;
- protocol validation;
- replay protection;
- audit;
- revocation.

## 9.11 R-BM06-011 — Log Secret Leakage

**Risk:** Logs contain credentials or sensitive information.

**Impact:** Critical.

**Mitigation:**

- ingestion redaction;
- runtime guidance;
- secret scanning;
- access controls;
- retention controls.

## 9.12 R-BM06-012 — Experiment Data Misinterpretation

**Risk:** Derived comparison is treated as authoritative execution evidence.

**Impact:** Medium.

**Mitigation:**

- preserve source Results;
- identify derived metrics;
- record comparison method;
- preserve source references.

## 9.13 R-BM06-013 — Real Lab Agent Divergence

**Risk:** Simulated Lab Agent and physical Lab Agent behave differently.

**Impact:** High.

**Mitigation:**

- contract tests;
- protocol versioning;
- HIL qualification;
- real Lab Agent readiness review.

## 9.14 R-BM06-014 — Storage Cost Growth

**Risk:** Results and media create uncontrolled cloud cost.

**Impact:** High.

**Mitigation:**

- retention;
- quotas;
- usage metrics;
- storage lifecycle;
- platform-specific policy.

## 9.15 R-BM06-015 — Result Processing Backlog

**Risk:** Completed Runs wait too long for Result publication.

**Impact:** Medium/High.

**Mitigation:**

- asynchronous workers;
- queue monitoring;
- worker scaling;
- priority policies;
- backlog alerts.

## 9.16 R-BM06-016 — Safety State Staleness

**Risk:** Old safety information is displayed as current.

**Impact:** Critical.

**Mitigation:**

- freshness timestamps;
- explicit STALE/UNKNOWN states;
- local safety authority;
- safety review.

---

# 10 Exit Criteria

## 10.1 Result Exit

- [ ] Result domain implemented.
- [ ] Result lifecycle implemented.
- [ ] Result publication implemented.
- [ ] Result files implemented.
- [ ] Result metrics implemented.
- [ ] Result reconciliation implemented.

## 10.2 Telemetry Exit

- [ ] Telemetry contract implemented.
- [ ] Ingestion implemented.
- [ ] Validation implemented.
- [ ] Sequencing implemented.
- [ ] Persistence implemented.
- [ ] Aggregation implemented.
- [ ] High-rate load test passed.
- [ ] Retention implemented.

## 10.3 Log Exit

- [ ] Log contract implemented.
- [ ] Ingestion implemented.
- [ ] Redaction implemented.
- [ ] Persistence implemented.
- [ ] Retrieval implemented.
- [ ] Retention implemented.

## 10.4 Video Exit

- [ ] Live video authorization integrated.
- [ ] WebRTC boundary preserved.
- [ ] Recording metadata implemented.
- [ ] Video Result registration implemented.
- [ ] Download implemented.
- [ ] Retention implemented.
- [ ] Media architecture review passed.

## 10.5 Experiment Exit

- [ ] Experiment implemented.
- [ ] Experiment lifecycle implemented.
- [ ] Run membership implemented.
- [ ] Experiment APIs implemented.
- [ ] Comparison implemented.
- [ ] Comparison metrics implemented.

## 10.6 Download Exit

- [ ] Download authorization implemented.
- [ ] Controlled object access implemented.
- [ ] Download audit implemented.
- [ ] Expiration implemented where required.
- [ ] Cross-tenant access tests pass.

## 10.7 Retention Exit

- [ ] Retention policies implemented.
- [ ] Archive implemented.
- [ ] Purge implemented.
- [ ] Retention holds supported where required.
- [ ] Purge audit implemented.
- [ ] Storage/database consistency verified.

## 10.8 Real Lab Agent Exit

- [ ] Real Lab Agent identity established.
- [ ] Authentication established.
- [ ] Heartbeat established.
- [ ] Telemetry integration works.
- [ ] Log integration works.
- [ ] Result upload works.
- [ ] Disconnect/reconnect works.
- [ ] Local buffering works where required.
- [ ] Protocol contract tests pass.
- [ ] Safety boundary review passes.

## 10.9 Security Exit

- [ ] Tenant isolation verified.
- [ ] Download security verified.
- [ ] Object storage access verified.
- [ ] Lab Agent authentication verified.
- [ ] Log redaction verified.
- [ ] Result audit verified.
- [ ] Retention authorization verified.

## 10.10 Quality Exit

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] Ingestion tests pass.
- [ ] Lab Agent integration tests pass.
- [ ] Fault/reconnect tests pass.
- [ ] Retention tests pass.
- [ ] Download tests pass.
- [ ] E2E tests pass.
- [ ] Load tests pass.
- [ ] CI passes.

## 10.11 Documentation Exit

- [ ] Result model documented.
- [ ] Telemetry contract documented.
- [ ] Log contract documented.
- [ ] Video architecture documented.
- [ ] Experiment model documented.
- [ ] Comparison model documented.
- [ ] Download model documented.
- [ ] Retention policy documented.
- [ ] Lab Agent integration documented.
- [ ] Safety boundary documented.
- [ ] Tracking documents updated.

## 10.12 Formal Milestone Status

B-M06 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

Completion requires implementation evidence, data-volume qualification,
security review, media review, real Lab Agent readiness review and acceptance
evidence.

---
