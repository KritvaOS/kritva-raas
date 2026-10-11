# F-M07-RESULTS — Changelog

Milestone: F-M07 — Results

# 11. Changelog

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

- Initial F-M07 milestone dossier.
- No implementation is implied by this document.
- F-M07 closes the primary RaaS MVP execution loop.
- Results are durable execution evidence.
- Large result files belong in object storage.
- Structured result metadata and metrics belong in PostgreSQL.
- Reruns always create new execution identities.
- Historical Runs and Results must remain traceable and must not be silently
  overwritten.

---

# Appendix A — Phase Mapping

The canonical mapping for F-M07 RESULTS (P7) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Upstream dependency; outputs consumed by this milestone |  |
| P4 BOOKING & COMMERCIAL | Upstream dependency; outputs consumed by this milestone |  |
| P5 EXECUTION | Upstream dependency; outputs consumed by this milestone | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Upstream dependency; outputs consumed by this milestone | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Owning phase |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Results Architecture

    +--------------------+
    |        Run         |
    +---------+----------+
              |
              v
    +--------------------+
    |       Result       |
    +----+----------+----+
         |          |
         v          v
      Files       Metrics
         |          |
         +----+-----+
              |
              v
       +-------------+
       |    Studio   |
       +------+------+ 
              |
       +------+-------+
       |              |
       v              v
    Compare         Download
       |
       v
    Experiment
       |
       v
      Rerun
       |
       v
      Job

---

# Appendix C — Data Ownership

| Data | Authoritative Owner | Storage |
|---|---|---|
| Run | Execution domain | PostgreSQL |
| Result | Result domain | PostgreSQL |
| Result metadata | Result domain | PostgreSQL |
| Result file metadata | Result domain | PostgreSQL |
| Large result binary | Result/object storage adapter | Object storage |
| Metrics | Result domain | PostgreSQL |
| Experiment | Result/experiment domain | PostgreSQL |
| Comparison | Result domain | PostgreSQL |
| Download record | Result domain | PostgreSQL |
| Download binary | Object storage | Object storage |
| Audit | Audit domain | PostgreSQL/append-oriented store |

The exact logical schema for Experiments remains subject to the existing
database decision regarding whether experiment entities reside under `result`
or a dedicated `experiment` schema.

---

# Appendix D — Result File Architecture

    Application / Runtime
             |
             v
       Result Generator
             |
             v
       Result File Created
             |
             v
       Security / Validation
             |
             v
        Object Storage
             |
             v
       Metadata in DB
             |
             v
         AVAILABLE
             |
             v
          Download

Large binaries must not be copied through the Studio unless explicitly
required.

---

# Appendix E — Result Metadata

Conceptual result record:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "job_id": "job-001",
        "project_id": "project-001",
        "status": "AVAILABLE",
        "outcome": "SUCCESS",
        "started_at": "...",
        "completed_at": "...",
        "platform_id": "platform-001",
        "platform_version_id": "platform-version-001",
        "artifact_id": "artifact-001"
    }

The Result metadata must not be treated as a substitute for the historical
Run record.

---

# Appendix F — Result File Metadata

Conceptual record:

    {
        "result_file_id": "file-001",
        "result_id": "result-001",
        "filename": "telemetry.csv",
        "file_type": "TELEMETRY",
        "status": "AVAILABLE",
        "size_bytes": 4212345,
        "checksum": "sha256:...",
        "storage_reference": "provider-neutral-reference",
        "created_at": "...",
        "expires_at": null
    }

The storage reference must not expose infrastructure credentials.

---

# Appendix G — Metric Model

Conceptual metric:

    {
        "metric_id": "metric-001",
        "result_id": "result-001",
        "name": "p95_latency",
        "metric_type": "NUMBER",
        "aggregation": "P95",
        "value": 38.2,
        "unit": "ms"
    }

Metric definitions should eventually support comparison semantics such as:

- higher is better;
- lower is better;
- target range;
- exact match;
- not comparable.

These semantics must be explicit rather than inferred by the UI.

---

# Appendix H — Experiment Model

    +--------------------------+
    |       Experiment         |
    |                          |
    | name                     |
    | project                  |
    | status                   |
    | description              |
    +------------+-------------+
                 |
        +--------+--------+
        |        |        |
        v        v        v
      BASELINE CONTROL CANDIDATE
        |        |        |
        v        v        v
       Run      Run      Run

An Experiment groups executions for analysis.

It does not become the owner of the Run.

---

# Appendix I — Comparison Model

    Baseline
       |
       +--> Metric A = 100
       +--> Metric B = 20
       |
       v
    Candidate
       |
       +--> Metric A = 110
       +--> Metric B = 18
       |
       v
    Comparison
       |
       +--> A delta = +10
       +--> B delta = -2
       +--> direction = metric-dependent

Comparison direction must be based on metric semantics.

---

# Appendix J — Rerun Architecture

    Historical Result
           |
           v
      Rerun Request
           |
           +--> Authorization
           |
           +--> Artifact Validation
           |
           +--> Platform Validation
           |
           +--> Booking Validation
           |
           +--> Configuration Validation
           |
           v
        New Job
           |
           v
        New Run
           |
           v
      New Result

A rerun is a new execution.

Historical evidence remains immutable.

---

# Appendix K — Rerun Lineage

Conceptual lineage:

    R-001
      |
      +---- Rerun ----> R-002
                           |
                           +---- Rerun ----> R-003

Each Run retains its own:

- artifact;
- platform;
- configuration;
- resource;
- timestamps;
- Job;
- Result.

This ensures reproducibility and historical traceability.

---

# Appendix L — Download Architecture

    Studio
      |
      v
    Download Request
      |
      v
    Authorization
      |
      v
    Download Service
      |
      v
    Object Storage
      |
      v
    Short-Lived Access
      |
      v
    User

The Control Plane should not become a large-file proxy unless required by
security or infrastructure constraints.

---

# Appendix M — Retention Model

Baseline retention categories:

| Data | Baseline |
|---|---|
| Result metadata | Long-term |
| Result metrics | Long-term |
| Experiment metadata | Long-term |
| Comparison metadata | Long-term |
| Result files | Policy-defined |
| Video | Policy-defined |
| Logs | Policy-defined |
| Telemetry exports | Policy-defined |
| Download records | Long-term/audit policy |
| Temporary download access | Short-lived |

Retention must account for:

- customer policy;
- regulatory requirements;
- storage cost;
- incident investigation;
- experiment reproducibility.

---

# Appendix N — Reconciliation

Result reconciliation should detect:

    DB Result File
          |
          v
    Object Storage
          |
          +--> PRESENT
          |
          +--> MISSING
          |
          +--> CORRUPTED
          |
          +--> UNEXPECTED

Checks include:

- existence;
- checksum where applicable;
- metadata consistency;
- lifecycle state;
- retention policy.

Reconciliation must produce actionable evidence.

---

# Appendix O — Failure Scenarios

## Result Processor Failure

    Run COMPLETED
         |
         v
    Result PROCESSING
         |
         v
    Result FAILED

The Run remains historical.

The Result may be retried according to policy.

## Missing Object

    Result File AVAILABLE
         |
         v
    Object Missing
         |
         v
    Reconciliation Finding

The UI must not silently offer a download that cannot succeed.

## Download Failure

    Download REQUESTED
         |
         v
    FAILED

The user receives a recoverable error where policy permits.

## Comparison Failure

    Comparison PROCESSING
         |
         v
    FAILED

Source Results remain unchanged.

---

# Appendix P — Security and Privacy Boundary

    Customer Source
          |
          X
    RaaS Result Store

    Application Output
          |
          v
    Result Validation
          |
          v
    Result Store

Results may contain customer-generated data, so access must be tenant- and
project-scoped.

The system must not assume that "result" means "public."

---

# Appendix Q — Observability

F-M07 should expose operational metrics for:

- result processing latency;
- result processing failures;
- result file failures;
- object-storage failures;
- download failures;
- comparison processing latency;
- comparison failures;
- rerun creation failures;
- reconciliation findings;
- result storage volume;
- download volume.

Correlations should use:

- organization;
- project;
- Run;
- Result;
- Result File;
- Experiment;
- Comparison;
- Download.

---

# Appendix R — Open Questions

The following require explicit decisions before production completion:

1. Should `Experiment` remain under the `result` schema or move to the
   dedicated `experiment` logical schema?
2. Is one authoritative Result allowed per Run permanently, or will Result
   versioning be introduced?
3. Which Result Files are mandatory for every platform?
4. Which Result Files are platform-specific?
5. Are videos retained by default?
6. What is the default result retention period?
7. What is the maximum Result File size?
8. What is the maximum number of files per Result?
9. Are result packages generated on demand?
10. Should large downloads support resumable transfer?
11. What checksum algorithm is mandatory?
12. Are customer-provided checksums accepted?
13. How are result files scanned for malware?
14. How are prohibited source files detected?
15. What result metadata must be immutable?
16. What result metadata may be corrected?
17. What is the formal result-processing retry policy?
18. Who may retry a failed Result?
19. Can users manually trigger result processing?
20. What metrics are platform-standard?
21. What metrics are application-defined?
22. What metadata describes whether a metric is better when higher or lower?
23. Can comparisons cross platform versions?
24. Can comparisons cross hardware configurations?
25. Can comparisons cross different artifacts?
26. What constitutes a valid baseline?
27. Can an Experiment contain Runs from multiple Projects?
28. Can an Experiment contain Runs from multiple Platforms?
29. Can one Run belong to multiple Experiments?
30. Can an Experiment be archived?
31. Can Experiment membership be changed after comparison?
32. Are comparisons immutable after publication?
33. Can a comparison be rerun after metric definitions change?
34. Should comparison results retain the metric-definition version?
35. Can users compare more than two candidates?
36. What is the maximum number of Runs per Experiment?
37. What is the maximum number of metrics per comparison?
38. What is the exact rerun eligibility policy?
39. Can rerun use a different artifact?
40. Can rerun use a different platform version?
41. Can rerun use a different configuration?
42. Can rerun use a different resource?
43. Which changes require explicit confirmation?
44. How is rerun lineage stored?
45. How is rerun related to experiment membership?
46. What happens if the source artifact is revoked?
47. What happens if the source platform is retired?
48. What happens if the original configuration is retired?
49. How are expired bookings handled during rerun?
50. How are credits reserved for rerun?
51. How are failed reruns reconciled financially?
52. Are download records retained indefinitely?
53. Should downloaded files be revalidated after download?
54. What download expiration is appropriate?
55. Can support staff access customer Results?
56. What support-access audit is required?
57. What regulatory retention applies to video and telemetry?
58. What customer deletion workflow applies to Results?
59. How are Results removed while preserving financial/audit records?
60. Which F-M07 capabilities are P0 versus P1?

Open questions must be converted into tracked decisions before implementation
depends on them.

---

# Appendix S — Definition of Done

F-M07 is Done when the complete workflow is demonstrable:

    Completed Run
         |
         v
    Result AVAILABLE
         |
         +--> Inspect Files
         |
         +--> Inspect Metrics
         |
         +--> Add to Experiment
         |
         +--> Compare
         |
         +--> Download
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

The original execution must remain intact throughout the entire workflow.

---

# Appendix T — Final Milestone Invariants

1. Result is associated with a Run.
2. Historical Run identity is preserved.
3. Historical Result identity is preserved.
4. Rerun creates a new Job.
5. Rerun creates a new Run.
6. Rerun creates a new Result.
7. Historical results are not overwritten.
8. Result metadata is tenant-scoped.
9. Result files are tenant-scoped.
10. Downloads are authorization-controlled.
11. Download access is short-lived.
12. Permanent object-storage credentials are never exposed.
13. Large files use object storage.
14. Structured metrics use PostgreSQL.
15. Result state is durable.
16. Result availability is not inferred from file existence alone.
17. Result processing failures are visible.
18. Result file failures are visible.
19. Object/database inconsistency is detectable.
20. Reconciliation is required.
21. Metrics remain structured.
22. Metric aggregation semantics remain explicit.
23. Comparison does not mutate source Results.
24. Comparison direction is metric-dependent.
25. NOT_COMPARABLE is supported.
26. Experiment membership is authorized.
27. Experiment membership is auditable.
28. Rerun revalidates current artifact policy.
29. Rerun revalidates current platform compatibility.
30. Rerun revalidates current booking.
31. Rerun revalidates current authorization.
32. Rerun does not bypass safety policy.
33. Source code is not stored as normal Result data.
34. Result files are treated as customer data.
35. Result downloads are audited.
36. Tenant isolation is explicitly tested.
37. Historical execution context remains understandable.
38. Result retention is policy-driven.
39. Purged files cannot be downloaded.
40. F-M07 completes the primary RaaS MVP loop from execution to evidence and
    rerun.
41. Milestone completion requires evidence, review and tracking updates.

# Appendix U — Milestone Principle

> F-M07 closes the core Kritva RaaS customer workflow by turning remote
> execution into durable evidence. A completed Run produces a Result whose
> metadata, files and metrics can be inspected, compared, downloaded and used
> to initiate another execution. Results are historical evidence and must not
> be overwritten by reruns. A rerun always becomes a new Job and Run and must
> pass current artifact, platform, booking, authorization and safety
> validation. Large files remain in object storage while structured business
> state and metrics remain authoritative in PostgreSQL. Experiment and
> comparison capabilities provide a controlled analytical layer without
> mutating source Results. Downloads are scoped, short-lived and auditable.
> Source-code privacy remains intact throughout the result lifecycle. F-M07
> therefore completes the primary MVP loop: Build Locally, Book Remotely, Run
> on Real Robots, Observe Live, Inspect Results, Download Evidence and Run
> Again.
