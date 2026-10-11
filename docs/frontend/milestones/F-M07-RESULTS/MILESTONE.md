# F-M07 — Results

## Milestone Dossier

**Milestone ID:** F-M07-RESULTS  
**Product:** Kritva RaaS  
**Primary Phase:** P7 LIVE & RESULTS  
**Primary Surface:** RaaS Studio  
**Supporting Services:** Control Plane, Object Storage, Results Service, Artifact Service, Execution Service  
**Technology:** Tauri + Rust + React + TypeScript + REST + WebSocket/events  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** A production-grade results experience that converts completed
Runs into durable, discoverable and downloadable evidence, supports metrics and
result files, enables experiment comparison, and allows an authorized user to
rerun an execution without losing historical Run or Result records.

---

# 1. Objective

## 1.1 Milestone Objective

F-M07 establishes the results and experiment-analysis layer of Kritva RaaS.

F-M03 establishes the local build and `.krv` artifact.
F-M04 establishes booking and resource reservation.
F-M05 establishes Job and Run execution.
F-M06 establishes live observation.

F-M07 closes the primary MVP loop by making execution outcomes durable,
inspectable, downloadable and repeatable.

The primary product flow becomes:

    Project
       |
       v
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
       v
    Live Execution
       |
       v
    Result
       |
       +----> Result Files
       |
       +----> Metrics
       |
       +----> Experiment
       |
       +----> Comparison
       |
       +----> Download
       |
       +----> Rerun
                  |
                  v
               New Job
                  |
                  v
               New Run

The historical execution remains immutable.

A rerun creates a new execution lineage rather than replacing the original.

## 1.2 Product Intent

The user should be able to answer:

1. Did my Run complete?
2. What was the outcome?
3. What files were produced?
4. What metrics were measured?
5. What platform and configuration were used?
6. Which artifact was executed?
7. Which resource executed it?
8. Can I download the evidence?
9. Can I compare this Run with another Run?
10. Can I rerun the same experiment?
11. What changed between the original and rerun?
12. Is the result still available?
13. Who generated or downloaded the result?
14. Is a result file ready, processing, failed or archived?

## 1.3 Primary Success Definition

F-M07 is successful when an authorized user can:

1. open a completed Run;
2. view its Result;
3. inspect result status;
4. inspect summary information;
5. view result files;
6. view metrics;
7. create or open an Experiment;
8. associate Runs with an Experiment;
9. compare Runs;
10. inspect comparison metrics;
11. download result files;
12. rerun a previous Run;
13. preserve historical execution lineage;
14. observe rerun status;
15. recover from result-processing failures;
16. distinguish current results from historical results.

## 1.4 Architectural Objective

The result architecture is:

    Run
     |
     v
    Result
     |
     +---------------------+
     |                     |
     v                     v
 Result Files           Metrics
     |                     |
     +----------+----------+
                |
                v
           Results UI
                |
       +--------+--------+
       |                 |
       v                 v
    Compare            Download
       |
       v
    Experiment
       |
       v
     Rerun
       |
       v
      Job
       |
       v
      Run

The Result service owns result lifecycle and publication.

Large files belong in object storage.

Structured metadata and metrics belong in PostgreSQL.

The Studio displays and coordinates the result workflow but does not become the
authoritative store.

## 1.5 Historical Integrity Principle

A completed Run is historical evidence.

F-M07 must never mutate a historical Run merely because the user reruns it.

The relationship is:

    Original Run R-001
          |
          +--> Result RES-001
          |
          +--> Rerun Request
                    |
                    v
                 Job J-002
                    |
                    v
                 Run R-002
                    |
                    v
                 Result RES-002

The original Run and Result remain independently addressable.

## 1.6 Results as Evidence

A Result is more than a success/failure indicator.

It may contain:

- execution summary;
- output files;
- logs;
- telemetry summaries;
- measurements;
- metrics;
- generated reports;
- experiment metadata;
- execution configuration;
- artifact identity;
- platform identity;
- resource identity.

The exact content is platform- and application-dependent.

## 1.7 Source-Code Privacy

F-M07 must preserve the source-code privacy boundary established by the
architecture.

Results must not automatically contain:

- customer source code;
- source repository contents;
- compiler inputs;
- local workspace;
- Git history;
- private build files;
- developer credentials.

Result files are customer-generated outputs and must pass through the same
security and privacy policies applicable to stored execution data.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M07 includes:

- Results dashboard;
- Run result detail;
- Result lifecycle;
- result summary;
- result files;
- result file metadata;
- metrics;
- metric display;
- metric grouping;
- experiments;
- Run membership in experiments;
- experiment comparison;
- comparison metrics;
- comparison status;
- downloads;
- download authorization;
- download lifecycle;
- rerun workflow;
- rerun configuration;
- rerun lineage;
- artifact reuse;
- booking revalidation;
- result processing;
- result publication;
- result error handling;
- result refresh;
- historical results;
- result retention presentation;
- object-storage integration;
- checksums;
- audit events;
- E2E tests.

## 2.2 Explicitly Out of Scope

F-M07 does not implement:

- source-code storage;
- remote compilation;
- artifact generation;
- booking creation;
- credit pricing;
- billing calculation;
- payment processing;
- robot control;
- physical E-stop;
- video editing;
- advanced data science;
- machine-learning model training;
- fleet analytics;
- organization-wide BI;
- automated experiment optimization;
- automatic production deployment.

## 2.3 Results Dashboard Scope

The dashboard provides:

- recent Runs;
- completed Runs;
- result availability;
- result status;
- project;
- platform;
- experiment;
- outcome;
- key metrics;
- quick actions.

It must support both individual-result inspection and workflow-level navigation.

## 2.4 Result Detail Scope

The Result detail screen includes:

- Result ID;
- Run ID;
- Job ID;
- project;
- artifact;
- platform;
- platform version;
- configuration;
- resource;
- robot where permitted;
- execution time;
- result status;
- summary;
- files;
- metrics;
- experiment membership;
- comparison;
- downloads;
- rerun action.

## 2.5 Result Files

Result files may include:

- reports;
- logs;
- telemetry exports;
- video;
- images;
- datasets;
- application-generated files;
- execution summaries.

Each file requires:

- type;
- filename;
- size;
- checksum where applicable;
- status;
- storage reference;
- created timestamp;
- availability;
- authorization.

## 2.6 Metrics

Metrics may be:

- numeric;
- integer;
- boolean;
- string.

The baseline result model also supports aggregations such as:

- RAW;
- MIN;
- MAX;
- AVERAGE;
- SUM;
- COUNT;
- MEDIAN;
- P95;
- P99.

Metrics should remain structured data rather than requiring users to parse
arbitrary result files.

## 2.7 Experiment Scope

An Experiment groups Runs for controlled analysis.

Conceptually:

    Experiment E-001
       |
       +--> Run R-001
       +--> Run R-002
       +--> Run R-003
       +--> Run R-004

Run membership can have roles such as:

- BASELINE;
- CONTROL;
- TRIAL;
- CANDIDATE;
- REFERENCE.

The exact role vocabulary follows the Results schema.

## 2.8 Comparison Scope

A Comparison provides a structured analysis between selected result items.

Example:

    Baseline Run
         |
         +--> metric A = 100
         +--> metric B = 20
         |
         v
    Candidate Run
         |
         +--> metric A = 110
         +--> metric B = 18
         |
         v
    Comparison
         |
         +--> A: IMPROVED
         +--> B: IMPROVED

Comparison is a derived analytical object.

It does not modify either Result.

## 2.9 Rerun Scope

Rerun means:

> Create a new execution request using selected historical execution context,
> subject to current artifact, platform, booking, authorization and safety
> rules.

A rerun is not a duplicate Result.

A rerun must create a new Job and Run.

## 2.10 Download Scope

Downloads include:

- direct file download;
- generated download package where supported;
- download authorization;
- expiry;
- download status;
- audit.

The initial implementation may use short-lived signed download URLs or an
equivalent provider-neutral download mechanism.

---

# 3. Dependencies

## 3.1 Milestone Dependencies

F-M07 depends on:

- F-M01 Studio Foundation;
- F-M02 Projects;
- F-M03 Build & Artifact;
- F-M04 Booking;
- F-M05 Execution;
- F-M06 Live;
- authentication;
- authorization;
- artifact metadata;
- Job/Run model;
- object storage;
- PostgreSQL;
- Result schema;
- audit logging.

## 3.2 Documentation Dependencies

| Document | Relationship |
|---|---|
| `docs/frontend/milestones/F-M03-BUILD-ARTIFACT/MILESTONE.md` | Artifact |
| `docs/frontend/milestones/F-M04-BOOKING/MILESTONE.md` | Booking |
| `docs/frontend/milestones/F-M05-EXECUTION/MILESTONE.md` | Execution |
| `docs/frontend/milestones/F-M06-LIVE/MILESTONE.md` | Live evidence |
| `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Persistence |
| `docs/database/schema/RESULTS.md` | Result model |
| `docs/database/schema/PROJECTS.md` | Project ownership |
| `docs/database/schema/PLATFORMS.md` | Platform identity |
| `docs/security/AUTHENTICATION.md` | Identity |
| `docs/security/AUTHORIZATION.md` | Access |
| `docs/security/SOURCE_CODE_PRIVACY.md` | Privacy |
| `docs/security/ARTIFACT_SECURITY.md` | Artifact provenance |
| `docs/security/AUDIT_LOGGING.md` | Audit |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | UI acceptance |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | UI review |
| `planning/INTEGRATION_PLAN.md` | Integration |

## 3.3 Run Dependency

A Result is associated with a Run.

The Result must retain enough historical context to remain meaningful even when
the current platform catalog changes.

Historical context should include:

- platform;
- platform version;
- runtime;
- SDK;
- architecture;
- resource;
- robot where applicable;
- configuration;
- artifact identity.

## 3.4 Object Storage Dependency

Large result files are stored outside PostgreSQL.

PostgreSQL stores:

- metadata;
- status;
- checksum;
- storage reference;
- ownership;
- lifecycle.

Object storage stores:

- binary file contents;
- large exports;
- video;
- large telemetry files;
- generated packages.

## 3.5 Security Dependency

Result access requires:

- authentication;
- organization membership;
- project authorization;
- Result authorization;
- file authorization;
- download authorization.

The UI must never rely on hidden buttons as the security boundary.

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M07 shall deliver:

1. Results dashboard.
2. Result detail page.
3. Result lifecycle display.
4. Result files panel.
5. Metrics panel.
6. Experiment creation/management foundation.
7. Experiment Run membership.
8. Comparison workflow.
9. Comparison result display.
10. Rerun workflow.
11. Download workflow.
12. Download status.
13. Result-processing status.
14. Result failure handling.
15. Historical execution context.
16. Result authorization.
17. Download authorization.
18. Result audit events.
19. Object-storage integration.
20. Results E2E tests.

## 4.2 Result Lifecycle

Baseline Result states:

    CREATED
       |
       v
    PROCESSING
       |
       v
    AVAILABLE

Alternative states:

    FAILED
    CANCELLED
    ARCHIVED
    PURGED

The UI must not show a result as available until required result processing is
complete.

## 4.3 Result Dashboard

Conceptual layout:

    +--------------------------------------------------------------+
    | Results                                                       |
    +--------------------------------------------------------------+
    | Search | Project | Platform | Status | Experiment | Date      |
    +--------------------------------------------------------------+
    | Run       | Result     | Platform | Outcome | Metrics | Date |
    | R-001     | AVAILABLE  | Robot A | PASS    | 12     | ...    |
    | R-002     | PROCESSING | Robot A | --      | --     | ...    |
    +--------------------------------------------------------------+

The dashboard must distinguish:

- Run status;
- Result status;
- experiment status.

These are not interchangeable.

## 4.4 Result Detail

Conceptual layout:

    Result RES-001
    Status: AVAILABLE

    Run:       R-001
    Job:       J-001
    Project:   Vision Demo
    Artifact:  vision-app 1.2.0
    Platform:  Kritva Reference Robot
    Resource:  robot-03

    Summary
    --------------------------------
    Duration: 15:42
    Outcome: SUCCESS

    Metrics
    --------------------------------
    Accuracy       98.2%
    Avg Latency    22 ms
    P95 Latency    38 ms

    Files
    --------------------------------
    report.json
    telemetry.csv
    execution.log
    video.mp4

    Actions
    [Download] [Compare] [Rerun]

## 4.5 Result Summary

The summary should include:

- outcome;
- duration;
- start/end;
- artifact;
- platform;
- resource;
- key metrics;
- result status.

Summary data should be server-derived.

The Studio must not invent outcome values from incomplete data.

## 4.6 Result Files

File rows should include:

- filename;
- type;
- size;
- status;
- checksum;
- generated time;
- expiration if applicable;
- download action.

Example:

    telemetry.csv
    Type: TELEMETRY
    Size: 4.2 MB
    Status: AVAILABLE
    SHA-256: ...
    [Download]

## 4.7 File Processing

A file may be:

    CREATED
       |
       v
    AVAILABLE

or:

    CREATED
       |
       v
    FAILED

Archived files may transition:

    AVAILABLE
       |
       v
    ARCHIVED

Purged files must not appear downloadable.

## 4.8 Metrics

Metrics should display:

- name;
- value;
- unit where available;
- type;
- aggregation;
- source;
- timestamp or measurement window.

The UI should distinguish:

    RAW
    AVERAGE
    P95
    P99

The metric definition must remain understandable without inspecting internal
database structures.

## 4.9 Experiment

Experiment workflow:

    Create Experiment
          |
          v
    Add Runs
          |
          v
    Assign Roles
          |
          v
    Compare
          |
          v
    Review Findings

An Experiment should contain:

- name;
- description;
- project;
- status;
- Run membership;
- roles;
- metadata;
- timestamps.

## 4.10 Experiment Run Membership

A Run may participate in an Experiment with a role.

Example:

    Experiment: Camera Optimization

    BASELINE  -> Run R-001
    CANDIDATE -> Run R-002
    CANDIDATE -> Run R-003

The membership must be auditable.

## 4.11 Comparison

Comparison workflow:

    Select Baseline
         |
         v
    Select Candidate
         |
         v
    Select Metrics
         |
         v
    Generate Comparison
         |
         v
    PROCESSING
         |
         v
    AVAILABLE

Comparison output may include:

- baseline value;
- candidate value;
- delta;
- relative delta;
- direction;
- comparability;
- metric interpretation.

## 4.12 Comparison Direction

Baseline/candidate comparison may classify:

- IMPROVED;
- DEGRADED;
- UNCHANGED;
- NOT_COMPARABLE.

The UI must not assume that a numerically larger value is always better.

Metric semantics must determine interpretation.

## 4.13 Rerun Workflow

Rerun starts from historical execution context.

Conceptual flow:

    Result
      |
      v
    Rerun
      |
      v
    Review Configuration
      |
      v
    Validate Artifact
      |
      v
    Select/Confirm Booking
      |
      v
    Create New Job
      |
      v
    New Run
      |
      v
    New Result

Rerun must not silently reuse an expired booking.

Rerun must not bypass current compatibility validation.

Rerun must not bypass authorization.

## 4.14 Rerun Configuration

The UI should show:

- original artifact;
- original platform;
- original platform version;
- original configuration;
- original resource where relevant;
- proposed booking;
- proposed configuration changes;
- compatibility status.

The user must explicitly confirm material changes.

## 4.15 Rerun Lineage

Conceptual relationship:

    R-001
      |
      +--> rerun_of = null
      |
      v
    R-002
      |
      +--> rerun_of = R-001
      |
      v
    R-003
           |
           +--> rerun_of = R-002

The underlying schema may implement lineage differently, but the UI must
preserve traceability.

## 4.16 Downloads

Download flow:

    User
      |
      v
    Select File
      |
      v
    Authorization
      |
      v
    Download Request
      |
      v
    Generate/Resolve Download
      |
      v
    Short-lived Access
      |
      v
    Download
      |
      v
    Audit

The Studio must not embed permanent object-storage credentials.

## 4.17 Download States

Baseline:

    REQUESTED
       |
       v
    GENERATED
       |
       v
    DOWNLOADED

Alternative:

    FAILED
    CANCELLED

If an expiration model is implemented, expired access must not remain usable.

## 4.18 Checksums

Files should expose a checksum where available.

The checksum enables:

- integrity verification;
- support investigations;
- reproducibility;
- download validation.

The checksum does not itself prove semantic correctness.

---

# 9. Risks

## 9.1 R-FM07-001 — Historical Result Mutation

**Risk:** Rerun overwrites or alters an existing Result.

**Impact:** Critical.

**Mitigation:**

- immutable historical Result model;
- new Job/Run for every rerun;
- database constraints;
- E2E tests.

## 9.2 R-FM07-002 — Unauthorized Result Access

**Risk:** Users access another organization's results.

**Impact:** Critical.

**Mitigation:**

- tenant authorization;
- repository filtering;
- object-storage scoped access;
- isolation tests.

## 9.3 R-FM07-003 — Unauthorized Download

**Risk:** Result files are accessed without authorization.

**Impact:** Critical.

**Mitigation:**

- short-lived access;
- per-file authorization;
- no permanent credentials;
- audit.

## 9.4 R-FM07-004 — Object/Database Inconsistency

**Risk:** Database says a file exists while object storage does not.

**Impact:** High.

**Mitigation:**

- reconciliation;
- checksums;
- upload state;
- result file lifecycle;
- background consistency checks.

## 9.5 R-FM07-005 — Result Contains Source Code

**Risk:** Generated result accidentally exposes customer source.

**Impact:** Critical.

**Mitigation:**

- source privacy policy;
- result allowlist;
- security scanning;
- test fixtures;
- prohibited-content detection.

## 9.6 R-FM07-006 — Incorrect Metric Interpretation

**Risk:** UI labels a metric as improved when higher is actually worse.

**Impact:** High.

**Mitigation:**

- metric semantics;
- explicit direction metadata;
- NOT_COMPARABLE fallback;
- no hard-coded universal assumptions.

## 9.7 R-FM07-007 — Rerun Uses Invalid Booking

**Risk:** Historical booking is reused after expiration.

**Impact:** High.

**Mitigation:**

- current booking required;
- server-side validation;
- no implicit reuse.

## 9.8 R-FM07-008 — Artifact Revocation

**Risk:** Historical artifact is revoked before rerun.

**Impact:** High.

**Mitigation:**

- rerun revalidates artifact;
- revoked artifacts cannot execute;
- user receives clear explanation.

## 9.9 R-FM07-009 — Comparison Incompatibility

**Risk:** Results from incompatible platforms/configurations are compared.

**Impact:** Medium.

**Mitigation:**

- compatibility checks;
- metric metadata;
- NOT_COMPARABLE;
- explicit warning.

## 9.10 R-FM07-010 — Large Result Files

**Risk:** Large files degrade API or Studio performance.

**Impact:** High.

**Mitigation:**

- object storage;
- streaming download;
- metadata-only database;
- bounded UI rendering.

## 9.11 R-FM07-011 — Result Processing Failure

**Risk:** Run completes but result generation fails.

**Impact:** High.

**Mitigation:**

- explicit PROCESSING/FAILED states;
- retry policy;
- durable failure reason;
- reconciliation.

## 9.12 R-FM07-012 — Download Link Leakage

**Risk:** A generated download credential is shared or reused.

**Impact:** High.

**Mitigation:**

- short expiration;
- scope;
- revocation where practical;
- audit;
- no permanent links.

## 9.13 R-FM07-013 — Experiment Membership Confusion

**Risk:** Users misunderstand experiment roles and modify historical meaning.

**Impact:** Medium.

**Mitigation:**

- explicit roles;
- audit;
- clear UI;
- immutable Run identity.

## 9.14 R-FM07-014 — Rerun Safety Assumption

**Risk:** User assumes a successful historical Run guarantees a safe rerun.

**Impact:** Critical.

**Mitigation:**

- current booking validation;
- current platform/resource validation;
- current safety policy;
- no bypass of execution controls.

---

# 10. Exit Criteria

## 10.1 Functional Exit

- [ ] Results dashboard works.
- [ ] Result detail works.
- [ ] Result lifecycle works.
- [ ] Result files work.
- [ ] Metrics work.
- [ ] Experiments work.
- [ ] Comparisons work.
- [ ] Downloads work.
- [ ] Rerun works.
- [ ] Historical lineage works.

## 10.2 Result Exit

- [ ] Result state is durable.
- [ ] Result processing works.
- [ ] Result failures are visible.
- [ ] Result files are stored correctly.
- [ ] Checksums are available where applicable.
- [ ] Object/database reconciliation works.
- [ ] Archived results are handled.
- [ ] Purged results are handled.

## 10.3 Experiment Exit

- [ ] Experiment creation works.
- [ ] Run membership works.
- [ ] Roles work.
- [ ] Comparison works.
- [ ] Comparison failure works.
- [ ] Incompatible metrics are handled.
- [ ] Source Results remain unchanged.

## 10.4 Rerun Exit

- [ ] Rerun requires authorization.
- [ ] Artifact is revalidated.
- [ ] Booking is revalidated.
- [ ] Platform compatibility is revalidated.
- [ ] Configuration is reviewed.
- [ ] New Job is created.
- [ ] New Run is created.
- [ ] New Result is created.
- [ ] Historical Run is unchanged.
- [ ] Historical Result is unchanged.
- [ ] Rerun lineage is visible.

## 10.5 Download Exit

- [ ] Download authorization works.
- [ ] Short-lived access works.
- [ ] Download lifecycle works.
- [ ] Expired access fails.
- [ ] Missing object fails safely.
- [ ] Download is auditable.
- [ ] File integrity can be verified.

## 10.6 Security Exit

- [ ] Tenant isolation tests pass.
- [ ] Result access control passes.
- [ ] File access control passes.
- [ ] Download authorization passes.
- [ ] Experiment authorization passes.
- [ ] Comparison authorization passes.
- [ ] Rerun authorization passes.
- [ ] Source privacy review passes.
- [ ] Security review passes.

## 10.7 Quality Exit

- [ ] Unit tests pass.
- [ ] Result lifecycle tests pass.
- [ ] File tests pass.
- [ ] Metrics tests pass.
- [ ] Experiment tests pass.
- [ ] Comparison tests pass.
- [ ] Download tests pass.
- [ ] Rerun tests pass.
- [ ] E2E tests pass.
- [ ] Failure tests pass.
- [ ] CI passes.

## 10.8 UI Exit

- [ ] Results dashboard reviewed.
- [ ] Result detail reviewed.
- [ ] Files reviewed.
- [ ] Metrics reviewed.
- [ ] Experiment UI reviewed.
- [ ] Comparison UI reviewed.
- [ ] Rerun UI reviewed.
- [ ] Download UI reviewed.
- [ ] Loading states reviewed.
- [ ] Empty states reviewed.
- [ ] Error states reviewed.
- [ ] Accessibility reviewed.
- [ ] Dark/light themes reviewed.

## 10.9 Documentation Exit

- [ ] Result lifecycle documented.
- [ ] Result File lifecycle documented.
- [ ] Metrics documented.
- [ ] Experiment model documented.
- [ ] Comparison model documented.
- [ ] Rerun behavior documented.
- [ ] Download behavior documented.
- [ ] Security model documented.
- [ ] Source privacy model documented.
- [ ] Test evidence recorded.
- [ ] Tracking documents updated.

## 10.10 Formal Milestone Status

F-M07 follows:

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

`COMPLETE` requires evidence, review and tracking updates.

---
