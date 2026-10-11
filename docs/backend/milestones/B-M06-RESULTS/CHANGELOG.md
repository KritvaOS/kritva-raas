# B-M06-RESULTS — Changelog

Milestone: B-M06 — Results

# 11 Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Fixed

- Date:
- Issue:
- Task:
- Author:
- Evidence:

## Removed

- Date:
- Change:
- Reason:
- Task:
- Author:
- Evidence:

## Notes

- Initial B-M06 milestone dossier.
- No implementation is implied by this document.
- Live data is for observation; durable state is for truth.
- Job/Run state remains authoritative over live channels.
- Result data is separate from execution lifecycle state.
- Large files belong in object storage; PostgreSQL stores authoritative metadata.
- Telemetry and logs must be ingestible at higher rates without blocking core
  execution transactions.
- WebRTC remains the preferred live video transport.
- Real Lab Agent integration does not transfer physical safety authority to the
  cloud.
- Retention and purge must be policy-driven and auditable.

---

# Appendix A — Phase Mapping

The canonical mapping for B-M06 RESULTS (P6-P7) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Upstream dependency; outputs consumed by this milestone |  |
| P4 BOOKING & COMMERCIAL | Upstream dependency; outputs consumed by this milestone |  |
| P5 EXECUTION | Upstream dependency; outputs consumed by this milestone | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Owning phase (start) | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Owning phase (completion) |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Result Architecture

    +----------------------+
    |        Run           |
    +----------+-----------+
               |
               v
    +----------------------+
    |   Result Service     |
    +----------+-----------+
               |
       +-------+-------+--------+
       |               |        |
       v               v        v
    Metrics          Files   Metadata
       |               |        |
       +---------------+--------+
                       |
                       v
                 PostgreSQL /
                 Object Storage
                       |
                       v
                  Downloads

The Result Service owns lifecycle and publication.

---

# Appendix C — Live and Durable Architecture

    +--------------------+
    |      Lab Agent     |
    +---------+----------+
              |
      +-------+--------+
      |       |        |
      v       v        v
 Telemetry  Logs     Video
      |       |        |
      v       v        v
   WebSocket  |     WebRTC
      |       |        |
      +-------+--------+
              |
              v
         Live Session

Separately:

    Lab Agent
       |
       +--> Telemetry Buffer
       +--> Log Buffer
       +--> Recording
       +--> Result Upload
               |
               v
          Durable Storage

Live and durable paths may share source data but must not share a single
failure domain unnecessarily.

---

# Appendix D — Telemetry Architecture

    Runtime
       |
       v
    Lab Agent
       |
       v
    Telemetry Channel
       |
       v
    Ingestion Gateway
       |
       +--> Authentication
       +--> Validation
       +--> Sequence
       +--> Buffer
       |
       v
    Telemetry Storage
       |
       +--> Raw
       +--> Aggregates
       +--> Result Metrics

The ingestion path must remain independent from transactional Job updates.

---

# Appendix E — Log Architecture

    Runtime
       |
       v
    Lab Agent
       |
       v
    Log Channel
       |
       v
    Log Ingestion
       |
       +--> Validate
       +--> Redact
       +--> Sequence
       +--> Persist
       |
       v
    Durable Logs

Logs may be streamed to the Studio separately through the live WebSocket
channel.

---

# Appendix F — Video Architecture

    +-------------+
    | Lab Camera  |
    +------+------+
           |
           +------------------+
           |                  |
           v                  v
       WebRTC             Recorder
           |                  |
           v                  v
       Live Studio       Object Storage
                              |
                              v
                         Result File

The Control Plane authorizes sessions and records metadata.

The media plane transports video.

---

# Appendix G — Result Lifecycle

    CREATED
       |
       v
    PROCESSING
       |
       +------> FAILED
       |
       v
    AVAILABLE
       |
       v
    ARCHIVED
       |
       v
    PURGED

Cancellation may be allowed only before publication according to policy.

---

# Appendix H — Result File Lifecycle

    CREATED
       |
       v
    AVAILABLE
       |
       v
    ARCHIVED
       |
       v
    PURGED

Alternative:

    CREATED
       |
       v
    FAILED

A Result File must not be downloadable unless its state permits access.

---

# Appendix I — Experiment Architecture

    Experiment
       |
       +--> Metadata
       |
       +--> Run Membership
       |       |
       |       +--> Baseline
       |       +--> Control
       |       +--> Trial
       |       +--> Candidate
       |       +--> Reference
       |
       +--> Comparisons
       |
       +--> Reports

Experiments organize evidence; they do not replace execution records.

---

# Appendix J — Comparison Architecture

    Result A
       |
       +--> Metric A
       +--> Metric B
       |
       v
    Comparison Engine
       ^
       |
       +--> Metric A
       +--> Metric B
       |
    Result B

Output:

    Metric A -> IMPROVED
    Metric B -> UNCHANGED

Comparison must preserve:

- source Result;
- metric;
- comparison method;
- direction;
- generated timestamp.

---

# Appendix K — Download Architecture

    User
      |
      v
    Download Request
      |
      v
    Authorization
      |
      v
    Result/File Lookup
      |
      v
    Retention Check
      |
      v
    Generate Controlled Access
      |
      v
    Object Storage
      |
      v
    Download

The user must never provide a raw object-storage key as authoritative access
control.

---

# Appendix L — Retention Architecture

    Active Data
       |
       v
    Retention Evaluation
       |
       +--> Retain
       |
       +--> Archive
       |
       +--> Purge
               |
               v
          Object Storage
               +
          Metadata State

Retention must be deterministic and repeatable.

---

# Appendix M — Real Lab Agent Architecture

    Physical Robot
          |
          v
    Kritva Runtime
          |
          v
       Lab Agent
          |
          +--> mTLS / Identity
          |
          +--> Telemetry
          +--> Logs
          +--> Result Upload
          +--> Heartbeat
          +--> Media Metadata
          |
          v
    Lab Gateway / Secure Protocol
          |
          v
      Control Plane

The Lab Agent remains the trusted local boundary for robot communication.

---

# Appendix N — Lab Agent Disconnect Model

    CONNECTED
       |
       v
    DEGRADED
       |
       v
    DISCONNECTED
       |
       +--> Local Buffer
       |
       v
    RECONNECTING
       |
       v
    AUTHENTICATE
       |
       v
    RESYNC
       |
       v
    CONNECTED

Resync must use:

- last acknowledged sequence;
- durable Run state;
- replay where available;
- explicit gap reporting.

---

# Appendix O — Result Publication Gate

A Result may become AVAILABLE only after mandatory processing succeeds.

Conceptual gate:

    Run COMPLETED
        |
        v
    Result CREATED
        |
        v
    Mandatory Inputs
        |
        +--> Run Summary
        +--> Required Metrics
        +--> Required Logs
        +--> Required Files
        |
        v
    Validation
        |
        v
    AVAILABLE

Optional outputs may remain unavailable without blocking publication if product
policy explicitly permits them.

---

# Appendix P — Result and Run Relationship

Run:

    "Did execution complete?"

Result:

    "What durable evidence did execution produce?"

Therefore:

    Run COMPLETED
       |
       v
    Result PROCESSING
       |
       v
    Result AVAILABLE

Run completion does not necessarily mean Result processing is already
complete.

---

# Appendix Q — Result APIs

Initial conceptual API surface:

    GET  /api/v1/runs/:runId/result
    GET  /api/v1/results
    GET  /api/v1/results/:resultId
    GET  /api/v1/results/:resultId/files
    GET  /api/v1/results/:resultId/metrics
    GET  /api/v1/results/:resultId/telemetry
    GET  /api/v1/results/:resultId/logs
    POST /api/v1/results/:resultId/downloads
    GET  /api/v1/experiments
    POST /api/v1/experiments
    GET  /api/v1/experiments/:experimentId
    POST /api/v1/experiments/:experimentId/runs
    POST /api/v1/comparisons
    GET  /api/v1/comparisons/:comparisonId

Exact endpoint semantics remain subject to API v1 contract review.

---

# Appendix R — Result Response

Conceptual:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "status": "AVAILABLE",
        "created_at": "2026-10-08T20:00:00Z",
        "published_at": "2026-10-08T20:02:00Z",
        "metrics_count": 12,
        "files_count": 4
    }

Result metadata must not expose unauthorized storage references.

---

# Appendix S — Experiment Response

Conceptual:

    {
        "experiment_id": "exp-001",
        "project_id": "project-001",
        "name": "Motor Controller Evaluation",
        "status": "ACTIVE",
        "run_count": 4,
        "tags": [
            "motor",
            "controller",
            "baseline"
        ]
    }

---

# Appendix T — Comparison Response

Conceptual:

    {
        "comparison_id": "cmp-001",
        "status": "AVAILABLE",
        "baseline_result_id": "result-001",
        "candidate_result_id": "result-002",
        "metrics": [
            {
                "name": "execution.duration_seconds",
                "baseline": 120.0,
                "candidate": 105.0,
                "direction": "IMPROVED"
            }
        ]
    }

Comparison outputs must identify their source records.

---

# Appendix U — Result Ingestion Idempotency

A telemetry sample may be identified using:

    run_id
    +
    source
    +
    sequence

A log entry may use:

    run_id
    +
    source
    +
    sequence

A Result file may use:

    result_id
    +
    file identity
    +
    checksum

The exact uniqueness strategy must be validated against expected producer
behavior.

---

# Appendix V — Data Integrity

For durable result files:

    Content
       |
       v
    SHA-256
       |
       v
    Stored Checksum
       |
       v
    Verification

For telemetry:

    Sequence
       |
       v
    Duplicate Detection
       |
       v
    Gap Detection
       |
       v
    Durable Samples

For Results:

    Run
       |
       v
    Result
       |
       v
    Files / Metrics
       |
       v
    Reconciliation

---

# Appendix W — Operational Metrics

Recommended metrics:

- active Lab Agents;
- disconnected Lab Agents;
- telemetry ingestion rate;
- telemetry rejection rate;
- telemetry gap count;
- telemetry persistence latency;
- log ingestion rate;
- log redaction count;
- video sessions;
- video recording failures;
- Result processing backlog;
- Result publication latency;
- Result failures;
- result-file count;
- storage bytes;
- download requests;
- download failures;
- experiment count;
- comparison processing time;
- retention backlog;
- purge failures.

Operational metrics must be separated from customer-visible metrics where
necessary.

---

# Appendix X — Open Questions

1. What telemetry storage technology is used for the first production release?
2. What is the maximum expected telemetry rate per robot?
3. What is the maximum expected number of concurrent robots?
4. Which telemetry signals are mandatory?
5. Are telemetry schemas platform-specific?
6. Can users define custom telemetry signals?
7. How are units normalized?
8. What timestamp authority is used?
9. How is clock drift handled?
10. What telemetry loss percentage is acceptable during disconnect?
11. How long must Lab Agent buffer telemetry locally?
12. How long must Lab Agent buffer logs?
13. Which logs are retained permanently?
14. What is the maximum log message size?
15. What is the maximum log volume per Run?
16. What secrets must the redactor recognize?
17. Should customer-defined sensitive patterns be supported?
18. What video codecs are required at launch?
19. What recording resolutions are supported?
20. Is recording always enabled?
21. Who pays for recorded video storage?
22. Can users request recordings after a Run?
23. Can video be deleted independently?
24. What is the default media retention period?
25. What result files are mandatory?
26. What metrics are generated automatically?
27. Can users upload custom result files?
28. If custom result files are supported, how are they scanned?
29. Can one Run have multiple Result versions?
30. What constitutes the authoritative Result?
31. Should experiments belong to `result` schema or the logical `experiment`
    schema?
32. Can a Run belong to multiple experiments?
33. Can a Run have multiple roles within an experiment?
34. What comparison algorithms are supported first?
35. How are incompatible metrics handled?
36. Should comparison results be cached?
37. Can users export entire experiments?
38. What download formats are supported?
39. How long should signed download access remain valid?
40. Are download links single-use?
41. What download activity must be audited?
42. Which records are retained indefinitely?
43. What are the exact retention periods for telemetry, logs and video?
44. How are legal holds represented?
45. What happens when a Project is deleted while Results are retained?
46. What happens when an Organization is deleted?
47. How are storage-cost quotas enforced?
48. What happens when storage quota is exceeded?
49. What is the real Lab Agent deployment model?
50. How are Lab Agent certificates provisioned?
51. How are Lab Agent certificates rotated?
52. What happens during Lab Agent certificate expiration?
53. How is Lab Agent software upgraded?
54. Can multiple Lab Agents serve one Lab?
55. How is failover between Lab Agents handled?
56. How is camera identity managed?
57. How are safety-state observations persisted?
58. What safety signals must be included in Results?
59. Which result data is considered personally identifiable?
60. Which result data may cross geographic regions?
61. What is the first production storage region?
62. What backup policy applies to result metadata?
63. Are raw telemetry exports backed up?
64. Are video recordings backed up?
65. What is the disaster-recovery policy for object storage?
66. What is the result reconciliation interval?
67. How are partially uploaded files recovered?
68. How are corrupt result files detected?
69. How are orphaned objects detected?
70. What evidence is required before physical-lab production approval?

These questions must become explicit product, architecture, security, data,
commercial or safety decisions before they affect production behavior.

---

# Appendix Y — Definition of Done

B-M06 is Done when the following end-to-end path is demonstrable:

    Run COMPLETED
         |
         v
    Telemetry / Logs / Video
         |
         v
    Ingestion
         |
         v
    Result Processing
         |
         +--> Metrics
         +--> Files
         +--> Metadata
         |
         v
    Result AVAILABLE
         |
         v
    Experiment
         |
         v
    Comparison
         |
         v
    Authorized Download

And:

    Real Lab Agent
         |
         +--> Telemetry
         +--> Logs
         +--> Results
         |
         v
    Secure Control Plane

with disconnect, buffering, replay and retention behavior qualified.

---

# Appendix Z — Final Milestone Invariants

1. Run remains the authoritative execution lifecycle record.
2. Result remains the authoritative durable execution-output record.
3. Live data is not the authoritative business state.
4. WebSocket failure does not imply Run failure.
5. WebRTC failure does not imply Run failure.
6. Telemetry failure does not imply Run failure.
7. Durable Results do not depend on Studio remaining connected.
8. Result belongs to an Organization.
9. Result references a Run.
10. Result lifecycle is explicit.
11. Result files are separately identifiable.
12. Result files have integrity metadata.
13. Large files are stored outside PostgreSQL where appropriate.
14. PostgreSQL remains authoritative for Result metadata and ownership.
15. Metrics are associated with their source Result/Run.
16. Derived comparison data does not overwrite source metrics.
17. Experiments organize Runs but do not replace them.
18. Experiment membership is explicit.
19. Downloads are authorized server-side.
20. Clients cannot directly authorize arbitrary object-storage paths.
21. Downloads are auditable.
22. Retention is policy-driven.
23. Purge is auditable and idempotent.
24. Telemetry sequence gaps are detectable.
25. Duplicate telemetry is handled safely.
26. Log secrets are redacted.
27. Video live transport is independent from durable recording.
28. Video is not unnecessarily proxied through application APIs.
29. Real Lab Agent identity is authenticated.
30. Lab Agent data is tenant- and Run-scoped.
31. Lab Agent disconnect is explicitly represented.
32. Local buffering protects against expected network interruption.
33. Reconnect does not restart execution.
34. Reconnect does not alter physical safety state.
35. UNKNOWN safety state is not SAFE.
36. STALE safety state is not CURRENT.
37. Cloud connectivity does not define physical safety.
38. Physical safety remains local.
39. Result processing is asynchronous where required.
40. High-rate telemetry does not block core Job/Run transactions.
41. Result publication requires mandatory-output validation.
42. Reconciliation identifies incomplete or inconsistent result state.
43. Cross-tenant result access is prohibited.
44. Cross-tenant download access is prohibited.
45. Result and media retention are independently controllable.
46. Real Lab Agent behavior is contract-tested against the same protocol
    abstraction used by simulation.
47. Physical deployment remains subject to separate safety qualification.
48. B-M06 provides the backend foundation for F-M06 Live and F-M07 Results.
49. Completion requires implementation, ingestion qualification, Lab Agent
    integration, security review, retention verification, load testing and
    acceptance evidence.

# Appendix AA — Milestone Principle

> B-M06 establishes the durable observation and result foundation of Kritva
> RaaS. Execution produces more than a terminal Run state: it produces
> telemetry, logs, video, metrics, files and engineering evidence that must
> remain useful after the live session ends. The architecture therefore
> separates live observation from durable truth. WebSocket and WebRTC provide
> responsive observation, while PostgreSQL and object storage preserve
> authoritative metadata and large result data. Telemetry and logs use
> sequence-aware, idempotent ingestion so network interruption, duplication and
> reordering are explicit conditions rather than silent corruption. Results
> are processed asynchronously and published only after required outputs have
> been validated. Experiments organize multiple Runs without replacing their
> historical execution records, while comparisons remain derived evidence that
> never overwrites source data. Downloads are tenant-authorized, controlled and
> audited, and retention is independently applied to metadata, telemetry,
> logs, video and result files. The real Lab Agent establishes the production
> boundary between the cloud control plane and the physical laboratory while
> retaining local authority over robot communication and safety. This
> milestone therefore turns Kritva RaaS from an execution system into a
> durable robotics experimentation platform in which every remote execution
> can produce trustworthy, recoverable and reusable engineering evidence.
