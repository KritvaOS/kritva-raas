# Kritva RaaS Results Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Results Schema |
| Path | `docs/database/schema/RESULTS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `result` |
| Primary Domain Owner | Result / Experiment Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Time Standard | UTC `timestamptz` |
| Business-State Authority | PostgreSQL |
| Large-Object Authority | Provider-neutral object storage |
| Phase Coverage | Phase 0–Phase 8 |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for Kritva RaaS
execution results.

A Result represents the customer-visible and operationally meaningful output
of a completed or otherwise terminal Run.

The Result domain converts execution evidence into durable, discoverable
outputs:

    Job
      |
      v
    Attempt
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
      +--> Result Files
      +--> Metrics
      +--> Experiment
      +--> Comparison
      +--> Downloads

# 3. Scope

This document defines:

- Result identity;
- Result ownership;
- Run linkage;
- Project linkage;
- Result lifecycle;
- Result files;
- result metrics;
- experiments;
- experiment Runs;
- comparisons;
- comparison metrics;
- download records;
- artifact/object references;
- result retention;
- audit;
- tenancy;
- authorization;
- reproducibility;
- result generation;
- result publication.

# 4. Non-Goals

This document does not define:

- source-code storage;
- Artifact construction;
- Job scheduling;
- Booking;
- Credit accounting;
- raw telemetry storage;
- raw log storage;
- raw video storage;
- physical robot safety;
- payment processing;
- subscription management.

Those concerns remain owned by their respective domains.

# 5. Goals

The Results schema must provide:

1. durable execution outputs;
2. Run traceability;
3. tenant isolation;
4. result lifecycle;
5. result file discovery;
6. metric summaries;
7. experiment grouping;
8. experiment comparison;
9. customer download tracking;
10. retention;
11. reproducibility;
12. auditability;
13. provider-neutral storage;
14. efficient result discovery.

# 6. Result Definition

A Result is a durable representation of the outcome and associated evidence of
a Run.

A Result may contain:

- summary;
- status;
- execution statistics;
- metrics;
- output files;
- reports;
- generated artifacts;
- references to telemetry;
- references to logs;
- references to video;
- experiment membership.

# 7. Result Relationship

The primary relationship is:

    Organization
         |
         v
       Project
         |
         v
        Job
         |
         v
        Run
         |
         v
       Result
       / | \
      /  |  \
     v   v   v
   Files Metrics Experiment
                    |
                    v
                Comparison

# 8. Result Lifecycle

Recommended lifecycle:

    CREATED
       |
       v
    PROCESSING
       |
       v
    AVAILABLE
       |
       v
    ARCHIVED

Failure:

    PROCESSING -> FAILED

Cancellation:

    CREATED / PROCESSING -> CANCELLED

Deletion:

    ARCHIVED -> PURGED

# 9. Result Status

| Status | Meaning |
|---|---|
| CREATED | Result record created |
| PROCESSING | Result generation in progress |
| AVAILABLE | Result is customer-accessible |
| FAILED | Result generation failed |
| CANCELLED | Generation cancelled |
| ARCHIVED | Retained but no longer actively served |
| PURGED | Result data has been purged according to policy |

# 10. Result State Machine

    CREATED
       |
       v
    PROCESSING
       |
       v
    AVAILABLE
       |
       v
    ARCHIVED
       |
       v
    PURGED

Failure:

    CREATED / PROCESSING
           |
           v
         FAILED

# 11. Result Status Enum

    CREATE TYPE result.result_status AS ENUM (
        'CREATED',
        'PROCESSING',
        'AVAILABLE',
        'FAILED',
        'CANCELLED',
        'ARCHIVED',
        'PURGED'
    );

# 12. Result Domain Tables

The Result domain contains:

| Table | Purpose |
|---|---|
| `result.results` | Result aggregate |
| `result.result_files` | Output file metadata |
| `result.result_metrics` | Metric summaries |
| `result.experiments` | Experiment grouping |
| `result.experiment_runs` | Experiment-to-Run membership |
| `result.comparisons` | Experiment/Run comparisons |
| `result.comparison_items` | Comparison participants |
| `result.comparison_metrics` | Comparison metric values |
| `result.downloads` | Download history |

# 13. `result.results`

`result.results` is the primary Result aggregate.

It represents the customer-visible result associated with one Run.

# 14. Result Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| result_id | uuid | No | UUIDv7 | Result |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| run_id | uuid | No | None | Run |
| job_id | uuid | No | None | Job |
| result_key | varchar(100) | No | None | Human-readable key |
| status | result_status | No | `CREATED` | Lifecycle |
| result_type | varchar(100) | No | `execution` | Type |
| title | varchar(255) | Yes | NULL | Display title |
| summary | text | Yes | NULL | Summary |
| generated_at | timestamptz | Yes | NULL | Generation completion |
| available_at | timestamptz | Yes | NULL | Publication |
| archived_at | timestamptz | Yes | NULL | Archive time |
| purged_at | timestamptz | Yes | NULL | Purge time |
| failure_code | varchar(64) | Yes | NULL | Generation failure |
| failure_message | varchar(4000) | Yes | NULL | Safe message |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Creator |
| updated_by | uuid | Yes | NULL | Updater |

# 15. Results DDL

    CREATE SCHEMA IF NOT EXISTS result;

    CREATE TABLE result.results (
        result_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        run_id UUID NOT NULL,
        job_id UUID NOT NULL,
        result_key VARCHAR(100) NOT NULL,
        status result.result_status
            NOT NULL DEFAULT 'CREATED',
        result_type VARCHAR(100)
            NOT NULL DEFAULT 'execution',
        title VARCHAR(255) NULL,
        summary TEXT NULL,
        generated_at TIMESTAMPTZ NULL,
        available_at TIMESTAMPTZ NULL,
        archived_at TIMESTAMPTZ NULL,
        purged_at TIMESTAMPTZ NULL,
        failure_code VARCHAR(64) NULL,
        failure_message VARCHAR(4000) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT results_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT results_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT results_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT results_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT results_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT results_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT results_key_unique
            UNIQUE (project_id, result_key),
        CONSTRAINT results_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT results_available_time_check
            CHECK (
                available_at IS NULL
                OR generated_at IS NULL
                OR available_at >= generated_at
            ),
        CONSTRAINT results_archive_time_check
            CHECK (
                archived_at IS NULL
                OR available_at IS NULL
                OR archived_at >= available_at
            ),
        CONSTRAINT results_purge_time_check
            CHECK (
                purged_at IS NULL
                OR archived_at IS NULL
                OR purged_at >= archived_at
            )
    );

# 16. Result Indexes

    CREATE INDEX results_org_status_idx
        ON result.results(organization_id, status);

    CREATE INDEX results_project_status_idx
        ON result.results(project_id, status);

    CREATE INDEX results_run_idx
        ON result.results(run_id);

    CREATE INDEX results_job_idx
        ON result.results(job_id);

    CREATE INDEX results_created_idx
        ON result.results(created_at);

    CREATE INDEX results_available_idx
        ON result.results(available_at);

# 17. Result-to-Run Uniqueness

The default model is one authoritative Result per Run.

    CREATE UNIQUE INDEX results_run_unique
        ON result.results(run_id);

If future requirements permit multiple independently generated Result
representations per Run, this constraint may be replaced with a unique
combination involving `result_type`.

# 18. Result Ownership

Every Result is owned by one Organization and one Project.

The Result directly stores `organization_id` to support:

- tenant filtering;
- authorization;
- indexing;
- defense in depth.

The application service must verify that Run, Job and Project belong to the
same Organization.

# 19. Result Creation

A Result is normally created after a Run reaches a terminal state.

Typical flow:

    Run
      |
      v
    terminal state
      |
      v
    Result CREATED
      |
      v
    PROCESSING
      |
      v
    AVAILABLE

# 20. Result Generation

Result generation may include:

- execution summary;
- metrics aggregation;
- telemetry analysis;
- log analysis;
- video references;
- generated reports;
- downloadable data;
- application-generated output files.

# 21. Result Availability

A Result becomes `AVAILABLE` only after:

- generation completes;
- required metadata exists;
- required files are finalized;
- integrity checks succeed;
- customer-accessible authorization is established.

# 22. Result Failure

Result generation failure does not change the historical Run state.

Example:

    Run = COMPLETED
    Result = FAILED

The execution succeeded, but post-processing failed.

The Result can be regenerated without re-running the robot.

# 23. Result Files

Result Files represent downloadable or viewable outputs associated with a
Result.

Large binary content is stored outside PostgreSQL.

# 24. Result File Types

Recommended file types:

    REPORT
    DATA
    MODEL_OUTPUT
    IMAGE
    VIDEO
    LOG
    TELEMETRY
    METRICS
    ARCHIVE
    OTHER

# 25. Result File Status

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

Failure:

    CREATED -> FAILED

# 26. Result File Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| result_file_id | uuid | No | UUIDv7 | File |
| result_id | uuid | No | None | Result |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| file_key | varchar(150) | No | None | File key |
| file_name | varchar(500) | No | None | Display filename |
| file_type | result_file_type | No | `OTHER` | Type |
| mime_type | varchar(255) | No | None | MIME |
| storage_reference | varchar(1000) | No | None | Object reference |
| checksum | varchar(128) | Yes | NULL | Integrity checksum |
| byte_size | bigint | Yes | NULL | File size |
| status | result_file_status | No | `CREATED` | Lifecycle |
| generated_at | timestamptz | Yes | NULL | Generation |
| available_at | timestamptz | Yes | NULL | Availability |
| archived_at | timestamptz | Yes | NULL | Archive |
| purged_at | timestamptz | Yes | NULL | Purge |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 27. Result File Enums

    CREATE TYPE result.result_file_type AS ENUM (
        'REPORT',
        'DATA',
        'MODEL_OUTPUT',
        'IMAGE',
        'VIDEO',
        'LOG',
        'TELEMETRY',
        'METRICS',
        'ARCHIVE',
        'OTHER'
    );

    CREATE TYPE result.result_file_status AS ENUM (
        'CREATED',
        'AVAILABLE',
        'FAILED',
        'ARCHIVED',
        'PURGED'
    );

# 28. Result File DDL

    CREATE TABLE result.result_files (
        result_file_id UUID PRIMARY KEY,
        result_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        file_key VARCHAR(150) NOT NULL,
        file_name VARCHAR(500) NOT NULL,
        file_type result.result_file_type
            NOT NULL DEFAULT 'OTHER',
        mime_type VARCHAR(255) NOT NULL,
        storage_reference VARCHAR(1000) NOT NULL,
        checksum VARCHAR(128) NULL,
        byte_size BIGINT NULL,
        status result.result_file_status
            NOT NULL DEFAULT 'CREATED',
        generated_at TIMESTAMPTZ NULL,
        available_at TIMESTAMPTZ NULL,
        archived_at TIMESTAMPTZ NULL,
        purged_at TIMESTAMPTZ NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT result_files_result_fk
            FOREIGN KEY (result_id)
            REFERENCES result.results(result_id)
            ON DELETE RESTRICT,
        CONSTRAINT result_files_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT result_files_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT result_files_key_unique
            UNIQUE (result_id, file_key),
        CONSTRAINT result_files_size_check
            CHECK (
                byte_size IS NULL OR byte_size >= 0
            ),
        CONSTRAINT result_files_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX result_files_result_idx
        ON result.result_files(result_id, status);

    CREATE INDEX result_files_org_idx
        ON result.result_files(
            organization_id,
            created_at
        );

    CREATE INDEX result_files_type_idx
        ON result.result_files(result_id, file_type);

# 29. Result File Integrity

A Result File should contain a checksum whenever technically available.

Recommended checksum:

    SHA-256

The checksum is evidence of the exact file associated with the Result.

# 30. Result File Storage

The PostgreSQL row stores:

- file identity;
- filename;
- type;
- MIME type;
- checksum;
- byte size;
- storage reference;
- lifecycle.

The binary content is stored in provider-neutral object storage.

# 31. Result Metrics

Metrics provide structured numerical or categorical summaries of execution.

Examples:

    task_success_rate
    inference_latency_ms
    average_joint_error
    energy_wh
    cpu_utilization
    frame_rate
    collision_count
    execution_duration_seconds

# 32. Metric Types

Recommended metric value types:

    NUMBER
    INTEGER
    BOOLEAN
    STRING

For the initial implementation, numeric metrics should be the primary
analytics type.

# 33. Metric Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| metric_id | uuid | No | UUIDv7 | Metric |
| result_id | uuid | No | None | Result |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| metric_key | varchar(150) | No | None | Metric name |
| metric_type | metric_type | No | `NUMBER` | Value type |
| numeric_value | numeric(30,12) | Yes | NULL | Numeric |
| integer_value | bigint | Yes | NULL | Integer |
| boolean_value | boolean | Yes | NULL | Boolean |
| string_value | varchar(4000) | Yes | NULL | String |
| unit | varchar(100) | Yes | NULL | Unit |
| aggregation | metric_aggregation | Yes | NULL | Aggregation |
| sample_count | bigint | Yes | NULL | Samples |
| min_value | numeric(30,12) | Yes | NULL | Minimum |
| max_value | numeric(30,12) | Yes | NULL | Maximum |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 34. Metric Enums

    CREATE TYPE result.metric_type AS ENUM (
        'NUMBER',
        'INTEGER',
        'BOOLEAN',
        'STRING'
    );

    CREATE TYPE result.metric_aggregation AS ENUM (
        'RAW',
        'MIN',
        'MAX',
        'AVERAGE',
        'SUM',
        'COUNT',
        'MEDIAN',
        'P95',
        'P99'
    );

# 35. Metrics DDL

    CREATE TABLE result.result_metrics (
        metric_id UUID PRIMARY KEY,
        result_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        metric_key VARCHAR(150) NOT NULL,
        metric_type result.metric_type
            NOT NULL DEFAULT 'NUMBER',
        numeric_value NUMERIC(30,12) NULL,
        integer_value BIGINT NULL,
        boolean_value BOOLEAN NULL,
        string_value VARCHAR(4000) NULL,
        unit VARCHAR(100) NULL,
        aggregation result.metric_aggregation NULL,
        sample_count BIGINT NULL,
        min_value NUMERIC(30,12) NULL,
        max_value NUMERIC(30,12) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT result_metrics_result_fk
            FOREIGN KEY (result_id)
            REFERENCES result.results(result_id)
            ON DELETE RESTRICT,
        CONSTRAINT result_metrics_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT result_metrics_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT result_metrics_key_unique
            UNIQUE (result_id, metric_key),
        CONSTRAINT result_metrics_sample_check
            CHECK (
                sample_count IS NULL OR sample_count >= 0
            ),
        CONSTRAINT result_metrics_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT result_metrics_value_check
            CHECK (
                (metric_type = 'NUMBER' AND numeric_value IS NOT NULL)
                OR
                (metric_type = 'INTEGER' AND integer_value IS NOT NULL)
                OR
                (metric_type = 'BOOLEAN' AND boolean_value IS NOT NULL)
                OR
                (metric_type = 'STRING' AND string_value IS NOT NULL)
            )
    );

    CREATE INDEX result_metrics_result_idx
        ON result.result_metrics(result_id);

    CREATE INDEX result_metrics_org_key_idx
        ON result.result_metrics(
            organization_id,
            metric_key
        );

# 36. Metric Design Rationale

Metrics are relational because they are:

- frequently queried;
- used for comparison;
- used for dashboards;
- used for experiment analysis.

Unbounded arbitrary metric payloads should remain in external analytical
storage and be referenced through Result Files or metadata.

# 37. Experiments

An Experiment groups related Runs for repeatable research or development.

Examples:

- compare model versions;
- compare robot configurations;
- test controller parameters;
- evaluate algorithm changes;
- benchmark platforms;
- run parameter sweeps.

# 38. Experiment Lifecycle

    DRAFT
      |
      v
    ACTIVE
      |
      v
    COMPLETED

Alternative:

    DRAFT -> ARCHIVED
    ACTIVE -> ARCHIVED

# 39. Experiment Status

    CREATE TYPE result.experiment_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'COMPLETED',
        'ARCHIVED'
    );

# 40. Experiment Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| experiment_id | uuid | No | UUIDv7 | Experiment |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| experiment_key | varchar(100) | No | None | Key |
| name | varchar(255) | No | None | Name |
| description | text | Yes | NULL | Description |
| status | experiment_status | No | `DRAFT` | Lifecycle |
| objective | text | Yes | NULL | Objective |
| methodology | text | Yes | NULL | Methodology |
| started_at | timestamptz | Yes | NULL | Start |
| completed_at | timestamptz | Yes | NULL | Completion |
| archived_at | timestamptz | Yes | NULL | Archive |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Creator |
| updated_by | uuid | Yes | NULL | Updater |

# 41. Experiment DDL

    CREATE TABLE result.experiments (
        experiment_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        experiment_key VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status result.experiment_status
            NOT NULL DEFAULT 'DRAFT',
        objective TEXT NULL,
        methodology TEXT NULL,
        started_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        archived_at TIMESTAMPTZ NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT experiments_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiments_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiments_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiments_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT experiments_key_unique
            UNIQUE (project_id, experiment_key),
        CONSTRAINT experiments_time_check
            CHECK (
                completed_at IS NULL
                OR started_at IS NULL
                OR completed_at >= started_at
            ),
        CONSTRAINT experiments_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX experiments_org_status_idx
        ON result.experiments(organization_id, status);

    CREATE INDEX experiments_project_status_idx
        ON result.experiments(project_id, status);

# 42. Experiment Runs

Experiment membership is many-to-many.

One Run may participate in multiple Experiments when authorized.

One Experiment may contain many Runs.

# 43. `result.experiment_runs` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| experiment_run_id | uuid | No | UUIDv7 | Membership |
| experiment_id | uuid | No | None | Experiment |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| role | experiment_run_role | No | `TRIAL` | Role |
| label | varchar(255) | Yes | NULL | Display label |
| parameter_set | jsonb | No | `'{}'` | Experiment parameters |
| sequence_number | integer | Yes | NULL | Ordering |
| created_at | timestamptz | No | `now()` | Creation |
| created_by | uuid | No | None | Creator |

# 44. Experiment Run Role

    CREATE TYPE result.experiment_run_role AS ENUM (
        'BASELINE',
        'CONTROL',
        'TRIAL',
        'CANDIDATE',
        'REFERENCE'
    );

# 45. Experiment Runs DDL

    CREATE TABLE result.experiment_runs (
        experiment_run_id UUID PRIMARY KEY,
        experiment_id UUID NOT NULL,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        role result.experiment_run_role
            NOT NULL DEFAULT 'TRIAL',
        label VARCHAR(255) NULL,
        parameter_set JSONB NOT NULL DEFAULT '{}'::jsonb,
        sequence_number INTEGER NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        CONSTRAINT experiment_runs_experiment_fk
            FOREIGN KEY (experiment_id)
            REFERENCES result.experiments(experiment_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiment_runs_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiment_runs_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiment_runs_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT experiment_runs_unique
            UNIQUE (experiment_id, run_id),
        CONSTRAINT experiment_runs_sequence_check
            CHECK (
                sequence_number IS NULL
                OR sequence_number > 0
            ),
        CONSTRAINT experiment_runs_parameters_check
            CHECK (
                jsonb_typeof(parameter_set) = 'object'
            )
    );

    CREATE INDEX experiment_runs_experiment_idx
        ON result.experiment_runs(experiment_id, sequence_number);

    CREATE INDEX experiment_runs_run_idx
        ON result.experiment_runs(run_id);

    CREATE INDEX experiment_runs_org_idx
        ON result.experiment_runs(organization_id, created_at);

# 46. Experiment Parameter Set

`parameter_set` stores bounded experimental parameters.

Examples:

    {
        "model_version": "vision-v4",
        "confidence_threshold": 0.75,
        "controller_gain": 1.20
    }

Secrets and credentials must never be stored here.

# 47. Comparisons

A Comparison evaluates two or more Runs within an Experiment or Project.

A Comparison may compare:

- metrics;
- execution duration;
- success rate;
- controller performance;
- model performance;
- resource efficiency.

# 48. Comparison Lifecycle

    CREATED
       |
       v
    PROCESSING
       |
       v
    AVAILABLE
       |
       v
    ARCHIVED

Failure:

    PROCESSING -> FAILED

# 49. Comparison Status

    CREATE TYPE result.comparison_status AS ENUM (
        'CREATED',
        'PROCESSING',
        'AVAILABLE',
        'FAILED',
        'ARCHIVED'
    );

# 50. Comparison Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| comparison_id | uuid | No | UUIDv7 | Comparison |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| experiment_id | uuid | Yes | NULL | Experiment |
| comparison_key | varchar(100) | No | None | Key |
| name | varchar(255) | No | None | Name |
| description | text | Yes | NULL | Description |
| status | comparison_status | No | `CREATED` | Lifecycle |
| methodology | text | Yes | NULL | Comparison method |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Creator |
| updated_by | uuid | Yes | NULL | Updater |
| metadata | jsonb | No | `'{}'` | Metadata |

# 51. Comparison DDL

    CREATE TABLE result.comparisons (
        comparison_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        experiment_id UUID NULL,
        comparison_key VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status result.comparison_status
            NOT NULL DEFAULT 'CREATED',
        methodology TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT comparisons_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparisons_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparisons_experiment_fk
            FOREIGN KEY (experiment_id)
            REFERENCES result.experiments(experiment_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparisons_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparisons_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT comparisons_key_unique
            UNIQUE (project_id, comparison_key),
        CONSTRAINT comparisons_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX comparisons_org_status_idx
        ON result.comparisons(organization_id, status);

    CREATE INDEX comparisons_project_idx
        ON result.comparisons(project_id, created_at);

    CREATE INDEX comparisons_experiment_idx
        ON result.comparisons(experiment_id);

# 52. Comparison Items

A Comparison contains participating Runs.

# 53. Comparison Item Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| comparison_item_id | uuid | No | UUIDv7 | Item |
| comparison_id | uuid | No | None | Comparison |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| label | varchar(255) | Yes | NULL | Label |
| role | comparison_item_role | No | `CANDIDATE` | Role |
| sequence_number | integer | No | None | Ordering |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| created_by | uuid | No | None | Creator |

# 54. Comparison Item Role

    CREATE TYPE result.comparison_item_role AS ENUM (
        'BASELINE',
        'CONTROL',
        'CANDIDATE',
        'REFERENCE'
    );

# 55. Comparison Items DDL

    CREATE TABLE result.comparison_items (
        comparison_item_id UUID PRIMARY KEY,
        comparison_id UUID NOT NULL,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        label VARCHAR(255) NULL,
        role result.comparison_item_role
            NOT NULL DEFAULT 'CANDIDATE',
        sequence_number INTEGER NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        CONSTRAINT comparison_items_comparison_fk
            FOREIGN KEY (comparison_id)
            REFERENCES result.comparisons(comparison_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparison_items_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparison_items_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparison_items_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparison_items_unique
            UNIQUE (comparison_id, run_id),
        CONSTRAINT comparison_items_sequence_check
            CHECK (sequence_number > 0),
        CONSTRAINT comparison_items_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE UNIQUE INDEX comparison_items_sequence_unique
        ON result.comparison_items(comparison_id, sequence_number);

    CREATE INDEX comparison_items_run_idx
        ON result.comparison_items(run_id);

# 56. Comparison Metrics

Comparison Metrics store derived values between participating Runs.

Examples:

    latency_delta
    accuracy_delta
    energy_delta
    success_rate_delta
    improvement_percent

# 57. Comparison Metric Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| comparison_metric_id | uuid | No | UUIDv7 | Metric |
| comparison_id | uuid | No | None | Comparison |
| organization_id | uuid | No | None | Tenant |
| metric_key | varchar(150) | No | None | Metric |
| baseline_value | numeric(30,12) | Yes | NULL | Baseline |
| candidate_value | numeric(30,12) | Yes | NULL | Candidate |
| delta_value | numeric(30,12) | Yes | NULL | Difference |
| percent_change | numeric(30,12) | Yes | NULL | Percentage |
| unit | varchar(100) | Yes | NULL | Unit |
| direction | comparison_direction | Yes | NULL | Better/worse |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |

# 58. Comparison Direction

    CREATE TYPE result.comparison_direction AS ENUM (
        'IMPROVED',
        'DEGRADED',
        'UNCHANGED',
        'NOT_COMPARABLE'
    );

# 59. Comparison Metrics DDL

    CREATE TABLE result.comparison_metrics (
        comparison_metric_id UUID PRIMARY KEY,
        comparison_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        metric_key VARCHAR(150) NOT NULL,
        baseline_value NUMERIC(30,12) NULL,
        candidate_value NUMERIC(30,12) NULL,
        delta_value NUMERIC(30,12) NULL,
        percent_change NUMERIC(30,12) NULL,
        unit VARCHAR(100) NULL,
        direction result.comparison_direction NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT comparison_metrics_comparison_fk
            FOREIGN KEY (comparison_id)
            REFERENCES result.comparisons(comparison_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparison_metrics_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT comparison_metrics_unique
            UNIQUE (comparison_id, metric_key),
        CONSTRAINT comparison_metrics_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX comparison_metrics_comparison_idx
        ON result.comparison_metrics(comparison_id);

    CREATE INDEX comparison_metrics_org_key_idx
        ON result.comparison_metrics(
            organization_id,
            metric_key
        );

# 60. Downloads

Download records provide operational and audit evidence for customer downloads
of Result Files.

They do not store the downloaded binary.

# 61. Download Lifecycle

    REQUESTED
       |
       v
    GENERATED
       |
       v
    DOWNLOADED

Failure:

    REQUESTED / GENERATED -> FAILED

Cancellation:

    REQUESTED / GENERATED -> CANCELLED

# 62. Download Status

    CREATE TYPE result.download_status AS ENUM (
        'REQUESTED',
        'GENERATED',
        'DOWNLOADED',
        'FAILED',
        'CANCELLED'
    );

# 63. Download Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| download_id | uuid | No | UUIDv7 | Download |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| result_id | uuid | No | None | Result |
| result_file_id | uuid | No | None | File |
| requested_by | uuid | No | None | User |
| status | download_status | No | `REQUESTED` | Lifecycle |
| requested_at | timestamptz | No | `now()` | Request |
| generated_at | timestamptz | Yes | NULL | URL/package generated |
| downloaded_at | timestamptz | Yes | NULL | Download |
| expires_at | timestamptz | Yes | NULL | Download URL expiry |
| byte_size | bigint | Yes | NULL | Transferred size |
| failure_code | varchar(64) | Yes | NULL | Failure |
| failure_message | varchar(2000) | Yes | NULL | Safe message |
| storage_reference | varchar(1000) | Yes | NULL | Temporary object |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |

# 64. Download DDL

    CREATE TABLE result.downloads (
        download_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        result_id UUID NOT NULL,
        result_file_id UUID NOT NULL,
        requested_by UUID NOT NULL,
        status result.download_status
            NOT NULL DEFAULT 'REQUESTED',
        requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        generated_at TIMESTAMPTZ NULL,
        downloaded_at TIMESTAMPTZ NULL,
        expires_at TIMESTAMPTZ NULL,
        byte_size BIGINT NULL,
        failure_code VARCHAR(64) NULL,
        failure_message VARCHAR(2000) NULL,
        storage_reference VARCHAR(1000) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT downloads_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT downloads_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT downloads_result_fk
            FOREIGN KEY (result_id)
            REFERENCES result.results(result_id)
            ON DELETE RESTRICT,
        CONSTRAINT downloads_file_fk
            FOREIGN KEY (result_file_id)
            REFERENCES result.result_files(result_file_id)
            ON DELETE RESTRICT,
        CONSTRAINT downloads_user_fk
            FOREIGN KEY (requested_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT downloads_size_check
            CHECK (
                byte_size IS NULL OR byte_size >= 0
            ),
        CONSTRAINT downloads_expiry_check
            CHECK (
                expires_at IS NULL
                OR expires_at >= requested_at
            ),
        CONSTRAINT downloads_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX downloads_org_time_idx
        ON result.downloads(
            organization_id,
            requested_at
        );

    CREATE INDEX downloads_result_idx
        ON result.downloads(result_id, requested_at);

    CREATE INDEX downloads_file_idx
        ON result.downloads(result_file_id, requested_at);

    CREATE INDEX downloads_user_idx
        ON result.downloads(requested_by, requested_at);

# 65. Download Security

Download URLs should be:

- short-lived;
- scoped to one Result File;
- authorization-checked before issuance;
- non-guessable;
- independently revocable where supported.

The URL itself must not become the authorization source.

# 66. Download Audit

Every download request provides evidence of:

- Organization;
- Project;
- Result;
- Result File;
- User;
- request time;
- generation time;
- download time;
- status.

The central Audit domain may additionally record sensitive download actions.

# 67. Result Relations

The principal relationship graph is:

    organization.organizations
             |
             v
      project.projects
             |
             v
      execution.runs
             |
             v
       result.results
          /    |    \
         /     |     \
        v      v      v
     files  metrics  experiments
                       |
                       v
                  experiment_runs
                       |
                       v
                      Runs

    result.results
         |
         v
    comparisons
         |
         +--> comparison_items --> Runs
         |
         +--> comparison_metrics

    result_files
         |
         v
      downloads

# 68. Cross-Domain Ownership

| Data | Owner |
|---|---|
| Organization | Organization domain |
| Project | Project domain |
| Run | Execution domain |
| Result | Result domain |
| Result File | Result domain |
| Metric Summary | Result domain |
| Experiment | Result domain |
| Comparison | Result domain |
| Download | Result domain |
| Artifact | Artifact domain |
| Raw Telemetry | Telemetry infrastructure |
| Raw Logs | Logging infrastructure |
| Raw Video | Object/video infrastructure |

# 69. Cross-Domain Write Rule

Result services must not directly mutate:

    execution.runs
    execution.jobs
    booking.bookings
    credit.wallets
    credit.ledger_entries
    artifact.artifacts
    lab.resources

Cross-domain changes use application-service interfaces.

# 70. Result Authorization

Access to a Result requires authorization through:

    Organization
        |
        v
      Project
        |
        v
      Result

The Result domain must reject access where the requesting principal does not
have access to the Organization and Project.

# 71. Result Creation Transaction

Creation should use:

    BEGIN
      INSERT result
      INSERT outbox event
    COMMIT

Result generation itself may be asynchronous.

# 72. Result Processing

Recommended flow:

    Run COMPLETED
         |
         v
    Result CREATED
         |
         v
    PROCESSING
         |
       +---+---+
       |       |
       v       v
    AVAILABLE FAILED

# 73. Result Processing Inputs

Result generation may consume:

- Run metadata;
- Run state history;
- Run events;
- telemetry summaries;
- log summaries;
- video metadata;
- application outputs;
- runtime statistics.

# 74. Result Processing Output

Processing can create:

- Result Files;
- Result Metrics;
- summary text;
- analysis metadata;
- experiment associations;
- comparison inputs.

# 75. Result Regeneration

A Result may be regenerated without re-running the robot.

The implementation should preserve historical Result versions if regeneration
can change customer-visible output.

If versioning becomes necessary, a future `result_versions` table may be
introduced.

# 76. Result Immutability

Once a Result becomes AVAILABLE:

- execution identity cannot change;
- Run reference cannot change;
- Project cannot change;
- Organization cannot change.

Metric and file additions may be permitted according to Result lifecycle
policy.

# 77. Metric Immutability

Published metric values should be immutable.

If a metric calculation changes:

    new metric version
    or
    regenerated Result

must be created rather than silently overwriting historical values.

# 78. Experiment Design

Experiments are logical research containers.

They may contain Runs from:

- the same Artifact;
- different Artifacts;
- different Platforms;
- different Platform Versions;
- different configurations;
- different robot resources.

# 79. Experiment Ownership

Experiments belong to one Organization and Project.

Runs included in an Experiment must be accessible to the same Organization.

# 80. Experiment Membership Integrity

Before creating `experiment_runs`, the service must validate:

    Experiment.organization_id
        ==
    Run.organization_id

and:

    Experiment.project_id
        ==
    Run.project_id

unless cross-project experiments are explicitly introduced later.

# 81. Comparison Design

Comparisons are derived analytical objects.

They do not modify Runs or Metrics.

A comparison can compare:

    Run A
       versus
    Run B

or:

    Baseline Group
       versus
    Candidate Group

# 82. Comparison Integrity

Comparison Items must belong to the same Organization as the Comparison.

Where an Experiment is specified:

    Comparison.experiment_id

must reference the same Organization and Project.

# 83. Comparison Metrics

Comparison metrics should normally be generated from Result Metrics.

Example:

    baseline latency = 100 ms
    candidate latency = 80 ms

Derived:

    delta = -20 ms
    percent_change = -20%

Direction depends on metric semantics.

# 84. Result Files and Downloads

The relationship is:

    Result
      |
      v
    Result File
      |
      v
    Download

A Download does not transfer ownership.

It only records access to the file.

# 85. Retention

Recommended retention model:

| Data | Retention |
|---|---|
| Result metadata | Long-term |
| Result Metrics | Long-term |
| Experiments | Long-term |
| Comparisons | Long-term |
| Result File metadata | Long-term |
| Raw Result Files | Policy-based |
| Download records | Long-term / audit policy |
| Temporary download objects | Short-lived |
| Derived reports | Policy-based |

# 86. Purging

When a Result is purged:

- metadata may remain;
- sensitive content may be removed;
- Result Files may become PURGED;
- storage objects may be deleted;
- Download records remain for audit;
- historical Run remains intact.

# 87. Result Retention Boundary

Purging Result data must never delete:

- Run;
- Job;
- Booking;
- Artifact;
- Credit ledger evidence.

Those domains have independent retention policies.

# 88. Object Storage

Result Files should use provider-neutral object storage.

Conceptually:

    PostgreSQL
        |
        | metadata
        v
    Result File
        |
        | storage_reference
        v
    Object Storage
        |
        v
    Binary Result

# 89. Integrity

Result File integrity should use:

    checksum
    byte_size
    MIME type
    storage reference

Where files are generated dynamically, checksum should be calculated before
publication.

# 90. Result File Publication

Recommended sequence:

    create file metadata
          |
          v
    write object
          |
          v
    calculate checksum
          |
          v
    verify object
          |
          v
    mark AVAILABLE

# 91. Result Availability Rule

A Result should not become AVAILABLE if a mandatory Result File is missing or
failed.

Optional files may be generated asynchronously according to product policy.

# 92. Metrics Publication

Metrics become customer-visible only after validation:

- metric key;
- metric type;
- value;
- unit;
- aggregation;
- source;
- calculation status.

# 93. Metrics and Units

Units should be standardized where practical.

Examples:

    milliseconds
    seconds
    meters
    degrees
    radians
    watts
    watt_hours
    percentage
    frames_per_second

Unit semantics must not be hidden solely in metadata.

# 94. Metric Precision

`numeric(30,12)` is used for deterministic analytical values.

Application code must define rounding rules for display and comparison.

Financial values must not use Result Metrics as their source of truth.

# 95. Experiment Reproducibility

Experiment metadata should preserve:

- objective;
- methodology;
- parameter set;
- Run references;
- metric selection;
- comparison method.

Source code remains local and is not stored in Results.

# 96. Experiment Parameters

Parameter sets may identify:

- model version;
- controller parameters;
- threshold;
- configuration;
- test condition.

They must not contain secrets.

# 97. Download Package

A download may represent:

- one Result File;
- generated report;
- multi-file archive;
- experiment package.

The initial schema associates a Download with one Result File.

Multi-file package support can be introduced through a future download package
entity without changing Result ownership.

# 98. Download Expiration

Generated download references should expire.

The `expires_at` field records the expected expiry.

After expiration, a new Download record should be generated rather than
reusing an expired authorization reference.

# 99. Reconciliation

Result reconciliation must identify:

- Run without expected Result;
- Result without Run;
- Result File without Result;
- Result File marked AVAILABLE but object missing;
- Result marked AVAILABLE with failed mandatory file;
- metric references without Result;
- Experiment membership without valid Run;
- Comparison item without Run;
- stale download;
- expired temporary object.

# 100. Result Reconciliation Flow

    Run terminal
        |
        v
    Result expected
        |
        +--> exists?
        |       |
        |      no
        |       |
        |       v
        |     create
        |
        v
    validate files
        |
        v
    validate metrics
        |
        v
    AVAILABLE

# 101. Result Events

Recommended events:

    result.created
    result.processing
    result.available
    result.failed
    result.archived
    result.purged

Additional:

    result.file.created
    result.file.available
    result.file.failed
    result.download.requested
    result.download.completed

Experiment events:

    experiment.created
    experiment.completed
    experiment.archived
    comparison.created
    comparison.available

# 102. Event Delivery

Result events should use at-least-once delivery.

Consumers must deduplicate using event IDs.

PostgreSQL remains authoritative for current Result state.

# 103. Repository Interfaces

Recommended repositories:

    ResultRepository
    ResultFileRepository
    ResultMetricRepository
    ExperimentRepository
    ExperimentRunRepository
    ComparisonRepository
    ComparisonItemRepository
    ComparisonMetricRepository
    DownloadRepository

# 104. Result Repository

Operations:

    create
    get
    get_for_update
    list_by_project
    list_by_run
    list_by_organization
    transition_state
    archive
    purge

# 105. Result File Repository

Operations:

    create
    get
    list_by_result
    mark_available
    mark_failed
    archive
    purge

# 106. Metric Repository

Operations:

    create
    get
    list_by_result
    replace_generation_set
    list_by_metric_key

Published metric updates must follow explicit versioning or regeneration
policy.

# 107. Experiment Repository

Operations:

    create
    get
    list_by_project
    activate
    complete
    archive

# 108. Experiment Run Repository

Operations:

    add_run
    remove_run
    list_runs
    set_role
    update_parameters

# 109. Comparison Repository

Operations:

    create
    get
    process
    publish
    archive

# 110. Download Repository

Operations:

    create
    get
    mark_generated
    mark_downloaded
    mark_failed
    cancel
    expire

# 111. Application Services

Recommended services:

    ResultService
    ResultGenerationService
    ResultFileService
    ResultMetricService
    ExperimentService
    ComparisonService
    DownloadService
    ResultReconciliationService

# 112. Result Service

ResultService owns:

- Result creation;
- lifecycle;
- publication;
- archive;
- purge.

# 113. Result Generation Service

ResultGenerationService:

1. reads terminal Run;
2. gathers execution evidence;
3. generates metrics;
4. creates Result Files;
5. validates outputs;
6. publishes Result.

# 114. Experiment Service

ExperimentService owns:

- experiment lifecycle;
- Run membership;
- parameter sets;
- experiment metadata.

It does not modify Run lifecycle.

# 115. Comparison Service

ComparisonService:

- validates participating Runs;
- reads Result Metrics;
- calculates derived metrics;
- stores comparison evidence;
- publishes Comparison.

# 116. Download Service

DownloadService:

- authorizes access;
- creates Download record;
- generates temporary access;
- records download completion;
- records failures.

# 117. Result API Flow

    Studio
      |
      v
    GET /results/{result_id}
      |
      v
    Authorization
      |
      v
    Result Service
      |
      v
    PostgreSQL
      |
      v
    Result response

# 118. Result Detail Response

Conceptual response:

    {
        "result_id": "result-001",
        "run_id": "run-001",
        "status": "AVAILABLE",
        "title": "Vision Test Result",
        "metrics": [
            {
                "key": "inference_latency_ms",
                "value": 12.45,
                "unit": "ms"
            }
        ],
        "files": [
            {
                "file_id": "file-001",
                "name": "report.pdf",
                "type": "REPORT"
            }
        ]
    }

# 119. Result List Query

Typical query:

    SELECT result_id,
           project_id,
           run_id,
           status,
           title,
           available_at
    FROM result.results
    WHERE organization_id = :organization_id
      AND project_id = :project_id
    ORDER BY created_at DESC
    LIMIT :limit;

# 120. Experiment Query

Typical query:

    SELECT e.experiment_id,
           e.name,
           e.status,
           COUNT(er.run_id)
    FROM result.experiments e
    LEFT JOIN result.experiment_runs er
      ON er.experiment_id = e.experiment_id
    WHERE e.organization_id = :organization_id
    GROUP BY e.experiment_id
    ORDER BY e.created_at DESC;

# 121. Comparison Query

Typical query:

    SELECT comparison_id,
           metric_key,
           baseline_value,
           candidate_value,
           delta_value,
           percent_change,
           direction
    FROM result.comparison_metrics
    WHERE comparison_id = :comparison_id
    ORDER BY metric_key;

# 122. Download Authorization

Before creating a Download:

1. authenticate user;
2. verify Organization;
3. verify Project access;
4. verify Result access;
5. verify Result File belongs to Result;
6. verify Result File is AVAILABLE;
7. generate temporary access;
8. record Download.

# 123. Download Integrity

A downloaded file should correspond exactly to:

    result_file.checksum

The download subsystem should not silently substitute a different object.

# 124. Security Classification

Result data may contain:

    Public
    Internal
    Confidential
    Restricted

The Result schema may store classification metadata, but authorization
remains enforced by application policy.

# 125. Sensitive Result Data

Potentially sensitive content includes:

- robot camera recordings;
- sensor data;
- logs;
- application outputs;
- experiment parameters.

Access must be controlled by Organization and Project authorization.

# 126. Tenant Isolation

All customer-owned Result records carry:

    organization_id

The application must enforce:

    requesting_user.organization
        ==
    result.organization_id

Defense in depth may include PostgreSQL Row-Level Security in later phases.

# 127. Audit

Auditable Result actions include:

- create;
- publish;
- archive;
- purge;
- download;
- experiment create;
- experiment membership changes;
- comparison creation;
- administrative access.

The central Audit domain remains authoritative for security audit.

# 128. Performance

Primary query patterns:

    organization + status
    project + status
    run
    job
    result files by result
    metrics by result
    experiments by project
    runs by experiment
    comparisons by experiment
    downloads by result

Indexes are designed around these patterns.

# 129. Partitioning

Result metadata should not be partitioned initially.

Potential future partition candidates:

- downloads by time;
- events if introduced into this schema;
- very large metric tables.

Partitioning requires measured evidence.

# 130. Large-Scale Analytics

If metric volume becomes large, Result Metrics may be replicated or exported
to analytical infrastructure.

PostgreSQL remains the authoritative customer-visible metric summary.

# 131. Result Versioning

A future Result Version model may be introduced when:

- analysis algorithms evolve;
- results are regenerated;
- derived metrics change;
- customer-visible reports need historical versions.

Until then, one Result represents the authoritative published interpretation
of a Run.

# 132. Result and Source Privacy

RaaS does not store source code in the Result domain.

A Result may contain generated outputs from compiled execution, but source
code remains on the customer's local development environment.

# 133. Result and Artifact Privacy

Artifact references identify what was executed.

The Result does not copy the Artifact binary.

The Artifact domain remains responsible for Artifact storage and lifecycle.

# 134. Result and Video

Result Files may reference video generated during a Run.

The preferred chain is:

    Run
      |
      v
    Video Metadata
      |
      v
    Result File
      |
      v
    Download

This avoids duplicating large video metadata unnecessarily.

# 135. Result and Telemetry

Result Metrics may summarize telemetry.

Example:

    telemetry:
      100,000 joint samples

    result metric:
      average_joint_error = 0.021 rad

The raw telemetry remains independently retained.

# 136. Result and Logs

Result generation may summarize logs:

    errors = 3
    warnings = 12

Raw logs remain independently stored.

# 137. Result and Experiment

An Experiment should normally reference completed or sufficiently mature
Runs.

Incomplete Runs may be included for active experiments.

# 138. Experiment Completion

An Experiment can be marked COMPLETED only when its required Runs and analyses
are complete according to Experiment policy.

This policy belongs to ExperimentService.

# 139. Comparison Publication

A Comparison becomes AVAILABLE only after:

- all required comparison items exist;
- required Results are available;
- metric calculations complete;
- comparison validation succeeds.

# 140. Example Experiment

    experiment_id:
      0194c7d0-8b00-7abc-9def-920000000001

    experiment_key:
      vision-model-comparison

    name:
      Vision Model Comparison

    status:
      ACTIVE

    objective:
      Compare two object detection models on the same robot workload.

# 141. Example Experiment Run

    experiment_run_id:
      0194c7d0-8b00-7abc-9def-920000000002

    experiment_id:
      0194c7d0-8b00-7abc-9def-920000000001

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    role:
      CANDIDATE

    label:
      model-v4

# 142. Example Comparison

    comparison_id:
      0194c7d0-8b00-7abc-9def-920000000003

    comparison_key:
      model-v4-vs-v3

    name:
      Model V4 versus V3

    status:
      AVAILABLE

# 143. Example Comparison Metric

    comparison_metric_id:
      0194c7d0-8b00-7abc-9def-920000000004

    metric_key:
      inference_latency_ms

    baseline_value:
      14.2

    candidate_value:
      11.8

    delta_value:
      -2.4

    percent_change:
      -16.90140845

    direction:
      IMPROVED

# 144. Example Result

    result_id:
      0194c7d0-8b00-7abc-9def-920000000005

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    result_key:
      vision-run-001-result

    status:
      AVAILABLE

    result_type:
      execution

    title:
      Vision Run 001 Result

# 145. Example Result File

    result_file_id:
      0194c7d0-8b00-7abc-9def-920000000006

    result_id:
      0194c7d0-8b00-7abc-9def-920000000005

    file_key:
      execution-report

    file_name:
      execution-report.pdf

    file_type:
      REPORT

    mime_type:
      application/pdf

    status:
      AVAILABLE

# 146. Example Metric

    metric_id:
      0194c7d0-8b00-7abc-9def-920000000007

    result_id:
      0194c7d0-8b00-7abc-9def-920000000005

    metric_key:
      inference_latency_ms

    metric_type:
      NUMBER

    numeric_value:
      11.8

    unit:
      ms

    aggregation:
      AVERAGE

# 147. Example Download

    download_id:
      0194c7d0-8b00-7abc-9def-920000000008

    result_id:
      0194c7d0-8b00-7abc-9def-920000000005

    result_file_id:
      0194c7d0-8b00-7abc-9def-920000000006

    status:
      DOWNLOADED

# 148. Phase 0 Mapping

Phase 0 establishes:

- Result domain ownership;
- Run-to-Result relationship;
- PostgreSQL authority;
- object storage boundary;
- retention principles;
- tenant model.

# 149. Phase 1 Mapping

Phase 1 implements:

- Result identity;
- Organization;
- Project;
- Run linkage;
- basic lifecycle;
- Result repository.

# 150. Phase 2 Mapping

Phase 2 implements:

- Result File metadata;
- Artifact/output integration;
- storage references;
- checksums;
- basic metrics.

# 151. Phase 3 Mapping

Phase 3 implements:

- Result generation;
- asynchronous processing;
- Result reconciliation;
- idempotency;
- publication state.

# 152. Phase 4 Mapping

Phase 4 integrates:

- Booking provenance;
- Credit usage evidence;
- execution metadata;
- Result authorization.

# 153. Phase 5 Mapping

Phase 5 implements:

- Run result generation;
- telemetry summaries;
- log summaries;
- video references;
- downloadable outputs.

# 154. Phase 6 Mapping

Phase 6 integrates:

- physical robot outputs;
- hardware-specific metrics;
- robot execution evidence;
- safety-related execution summaries.

# 155. Phase 7 Mapping

Phase 7 is the primary Results and Experiment phase:

- Experiments;
- Experiment Runs;
- Comparisons;
- Comparison Metrics;
- result analytics;
- customer dashboards;
- downloads.

# 156. Phase 8 Mapping

Phase 8 completes:

- retention;
- privacy;
- object lifecycle;
- download security;
- production analytics;
- performance;
- disaster recovery;
- production acceptance.

# 157. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Result without Run | Critical | Mandatory Run FK |
| Duplicate Result | High | Unique Run constraint |
| Missing output file | High | File publication validation |
| Wrong output object | Critical | Checksum |
| Tenant leakage | Critical | Organization checks |
| Metric corruption | High | Typed metrics + immutability |
| Experiment cross-tenant | Critical | Tenant validation |
| Comparison mismatch | High | Validated Run membership |
| Download authorization bypass | Critical | Authorization before URL |
| Expired object access | Medium | Download expiration |
| Database growth | High | External large objects |
| Raw data privacy | Critical | Retention + access controls |
| Result generation failure | Medium | Retry/regeneration |
| Stale Result | Medium | Reconciliation |
| Object loss | Critical | Object versioning/backups |
| Analytics drift | Medium | Result regeneration/versioning |
| Duplicate processing | High | Idempotency |
| Excessive metric cardinality | High | Bounded metric model |

# 158. Open Questions

1. Final Result versioning model.
2. Whether one Run may produce multiple Result types.
3. Final mandatory Result Files.
4. Final result-generation worker architecture.
5. Final telemetry aggregation backend.
6. Final log aggregation backend.
7. Final video processing backend.
8. Final Result File retention by plan.
9. Final Experiment permission model.
10. Final cross-project Experiment policy.
11. Final comparison statistical methods.
12. Whether comparisons support grouped populations.
13. Whether metric definitions become a global catalog.
14. Whether metrics require schema versioning.
15. Final download package model.
16. Final bulk-download support.
17. Final report generation format.
18. Final customer export format.
19. Final privacy deletion semantics.
20. Final Result regeneration/versioning behavior.

# 159. Acceptance Criteria — Results Core

- [ ] `result` schema exists.
- [ ] `results` table exists.
- [ ] Result ID uses UUIDv7.
- [ ] Organization ownership is mandatory.
- [ ] Project ownership is mandatory.
- [ ] Run reference is mandatory.
- [ ] Job reference is mandatory.
- [ ] Result key is unique within Project.
- [ ] One authoritative Result per Run is enforced.
- [ ] Result lifecycle is implemented.
- [ ] Audit columns exist.
- [ ] Result metadata is bounded JSONB.

# 160. Acceptance Criteria — Result Lifecycle

- [ ] CREATED exists.
- [ ] PROCESSING exists.
- [ ] AVAILABLE exists.
- [ ] FAILED exists.
- [ ] CANCELLED exists.
- [ ] ARCHIVED exists.
- [ ] PURGED exists.
- [ ] Invalid transitions are rejected.
- [ ] Published Results preserve execution identity.
- [ ] Purging does not delete Run history.

# 161. Acceptance Criteria — Result Files

- [ ] Result File table exists.
- [ ] File belongs to Result.
- [ ] File belongs to Organization.
- [ ] File belongs to Project.
- [ ] File key is unique within Result.
- [ ] MIME type is stored.
- [ ] File type is constrained.
- [ ] Storage reference is mandatory.
- [ ] Checksum is supported.
- [ ] Byte size is supported.
- [ ] File lifecycle is implemented.
- [ ] Raw binary is not stored in PostgreSQL.

# 162. Acceptance Criteria — Metrics

- [ ] Metric table exists.
- [ ] Metric belongs to Result.
- [ ] Metric key is unique within Result.
- [ ] Metric type is constrained.
- [ ] Typed value constraint exists.
- [ ] Units are supported.
- [ ] Aggregation is supported.
- [ ] Sample count is supported.
- [ ] Min/max are supported.
- [ ] Metric metadata is bounded.
- [ ] Published metrics are protected from silent mutation.

# 163. Acceptance Criteria — Experiments

- [ ] Experiment table exists.
- [ ] Experiment belongs to Organization.
- [ ] Experiment belongs to Project.
- [ ] Experiment key is unique within Project.
- [ ] Experiment lifecycle exists.
- [ ] Objective is supported.
- [ ] Methodology is supported.
- [ ] Experiment Run membership exists.
- [ ] Experiment membership is unique.
- [ ] Experiment parameters are supported.
- [ ] Cross-tenant membership is rejected.

# 164. Acceptance Criteria — Comparisons

- [ ] Comparison table exists.
- [ ] Comparison belongs to Organization.
- [ ] Comparison belongs to Project.
- [ ] Optional Experiment reference exists.
- [ ] Comparison key is unique within Project.
- [ ] Comparison lifecycle exists.
- [ ] Comparison Items exist.
- [ ] Comparison Items reference Runs.
- [ ] Comparison Item sequence is unique.
- [ ] Comparison Metrics exist.
- [ ] Comparison Metrics support delta.
- [ ] Comparison Metrics support percentage change.
- [ ] Comparison direction is constrained.

# 165. Acceptance Criteria — Downloads

- [ ] Download table exists.
- [ ] Download references Result.
- [ ] Download references Result File.
- [ ] Download references User.
- [ ] Download lifecycle exists.
- [ ] Request time is recorded.
- [ ] Generation time is recorded.
- [ ] Download time is recorded.
- [ ] Expiration time is supported.
- [ ] Temporary storage reference is supported.
- [ ] Download failures are recorded.
- [ ] Download actions are auditable.

# 166. Acceptance Criteria — Relationships

- [ ] Result references Run.
- [ ] Result references Job.
- [ ] Result Files reference Result.
- [ ] Metrics reference Result.
- [ ] Experiments reference Projects.
- [ ] Experiment Runs reference Runs.
- [ ] Comparisons reference Projects.
- [ ] Comparison Items reference Runs.
- [ ] Comparison Metrics reference Comparisons.
- [ ] Downloads reference Result Files.
- [ ] Cross-domain ownership remains explicit.

# 167. Acceptance Criteria — Tenancy

- [ ] Every customer-owned Result table has Organization ID.
- [ ] Project ownership is recorded where applicable.
- [ ] Cross-tenant Result access is rejected.
- [ ] Cross-tenant Result File access is rejected.
- [ ] Cross-tenant Experiment membership is rejected.
- [ ] Cross-tenant Comparison membership is rejected.
- [ ] Cross-tenant Download access is rejected.
- [ ] Tenant isolation tests pass.

# 168. Acceptance Criteria — Storage

- [ ] Large files use object storage.
- [ ] Storage references are provider-neutral.
- [ ] Checksums are supported.
- [ ] Object publication is verified.
- [ ] Missing objects are detectable.
- [ ] Purged objects remain identifiable.
- [ ] Database metadata remains durable.
- [ ] Object retention is independently configurable.

# 169. Acceptance Criteria — Reconciliation

- [ ] Result without Run is detectable.
- [ ] Run without Result is detectable when Result is required.
- [ ] Result File without Result is detectable.
- [ ] Missing object is detectable.
- [ ] Published Result with failed mandatory file is detectable.
- [ ] Experiment membership mismatch is detectable.
- [ ] Comparison membership mismatch is detectable.
- [ ] Stale download is detectable.
- [ ] Expired download reference is detectable.
- [ ] Reconciliation is repeatable and idempotent.

# 170. Acceptance Criteria — Security

- [ ] Result access requires authentication.
- [ ] Organization authorization is enforced.
- [ ] Project authorization is enforced.
- [ ] Result File authorization is enforced.
- [ ] Download authorization is enforced.
- [ ] Download URLs are short-lived.
- [ ] Secrets are prohibited from metadata.
- [ ] Administrative access is audited.
- [ ] Sensitive video/log access is controlled.

# 171. Acceptance Criteria — Retention

- [ ] Result metadata has long-term retention.
- [ ] Metrics have long-term retention.
- [ ] Experiment metadata has long-term retention.
- [ ] Comparison metadata has long-term retention.
- [ ] Download records follow audit retention.
- [ ] Raw files have policy-based retention.
- [ ] Temporary download objects expire.
- [ ] Purging raw files does not delete Run history.

# 172. Acceptance Criteria — Performance

- [ ] Organization/status queries are indexed.
- [ ] Project/status queries are indexed.
- [ ] Run queries are indexed.
- [ ] Result File queries are indexed.
- [ ] Metric queries are indexed.
- [ ] Experiment queries are indexed.
- [ ] Comparison queries are indexed.
- [ ] Download queries are indexed.
- [ ] Large binaries are not stored in PostgreSQL.
- [ ] Partitioning is deferred until measured need.

# 173. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Result architecture accepted.
- [ ] Run/Result boundary accepted.
- [ ] Storage boundary accepted.
- [ ] retention policy accepted.

Phase 1:

- [ ] Result core schema complete.
- [ ] Run integration complete.
- [ ] Result lifecycle complete.

Phase 2:

- [ ] Result Files complete.
- [ ] Object storage integration complete.
- [ ] Metrics foundation complete.

Phase 3:

- [ ] Result generation complete.
- [ ] Processing/retry complete.
- [ ] Reconciliation complete.

Phase 4:

- [ ] Booking provenance complete.
- [ ] Credit usage evidence complete.
- [ ] Authorization complete.

Phase 5:

- [ ] Runtime evidence integration complete.
- [ ] telemetry summaries complete.
- [ ] log summaries complete.
- [ ] video references complete.
- [ ] downloads complete.

Phase 6:

- [ ] physical robot results complete.
- [ ] hardware metrics complete.
- [ ] robot evidence complete.

Phase 7:

- [ ] Experiments complete.
- [ ] Experiment Runs complete.
- [ ] Comparisons complete.
- [ ] Comparison Metrics complete.
- [ ] analytics complete.

Phase 8:

- [ ] retention complete.
- [ ] privacy complete.
- [ ] object lifecycle complete.
- [ ] DR complete.
- [ ] production performance complete.
- [ ] production acceptance complete.

# 174. Final Invariants

The following invariants are mandatory:

1. Every Result belongs to exactly one Organization.
2. Every Result belongs to exactly one Project.
3. Every Result references exactly one Run.
4. Every Result references the originating Job.
5. One authoritative Result exists per Run unless explicitly versioned later.
6. Result lifecycle transitions are controlled.
7. Result publication requires valid required outputs.
8. Result Files belong to exactly one Result.
9. Result File keys are unique within Result.
10. Result binaries are stored outside PostgreSQL.
11. Result File integrity is represented by checksum where available.
12. Metrics belong to exactly one Result.
13. Metric keys are unique within Result.
14. Metric value types are validated.
15. Experiments belong to one Organization and Project.
16. Experiment Run membership is tenant-safe.
17. Comparisons belong to one Organization and Project.
18. Comparison Items reference valid Runs.
19. Comparison Metrics belong to one Comparison.
20. Downloads reference valid Result Files.
21. Download access is authorization-controlled.
22. Download authorization expires.
23. Result metadata remains after raw-object purge where policy requires it.
24. Run history is never deleted as a consequence of Result purge.
25. Result generation is idempotent.
26. Result publication is auditable.
27. Cross-domain writes use owning application services.
28. PostgreSQL remains authoritative for Result business state.
29. Object storage remains authoritative for large Result binaries.
30. Raw telemetry/log/video remain outside the Result relational schema.
31. Experiments do not mutate Run lifecycle.
32. Comparisons do not mutate Run or Result source data.
33. Historical metrics cannot be silently rewritten.
34. Tenant isolation is enforced.
35. Reconciliation can detect incomplete Result generation.
36. Result retention is explicit.
37. Download history remains auditable.
38. Secrets are never stored in Result metadata.
39. Customer source code is never stored in Results.
40. Result design supports reproducible RaaS execution analysis.

# 175. Final Architecture Statement

> **A Kritva RaaS Result is the durable, customer-visible representation of
> the outcome and evidence produced by a Run.**
>
> **The Result domain owns result lifecycle, output-file metadata, metric
> summaries, experiments, comparisons and download history. It does not own
> execution itself, source code, Artifact contents, raw telemetry, raw logs,
> raw video, Booking, Credits or robot safety.**
>
> The production result flow is:
>
>     Job
>       |
>       v
>     Run
>       |
>       +--> Telemetry
>       +--> Logs
>       +--> Video
>       |
>       v
>     Result
>       |
>       +--> Result Files
>       |
>       +--> Metrics
>       |
>       +--> Experiment
>       |      |
>       |      v
>       |   Comparisons
>       |
>       v
>     Download
>
> **PostgreSQL remains authoritative for Result metadata and business state,
> while large result files remain in provider-neutral object storage. Result
> metrics provide structured analytical summaries, Experiments organize
> repeatable Runs, Comparisons derive meaningful differences between Runs, and
> Downloads provide controlled and auditable customer access to generated
> outputs.**
>
> **This schema therefore provides the durable result-analysis foundation
> required for Kritva RaaS to transform remote robotic execution into
> reproducible experiments, measurable engineering outcomes and customer-
> accessible execution results without exposing the customer's local source
> code.**
