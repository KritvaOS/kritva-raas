# Kritva RaaS Runs Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Runs Schema |
| Path | `docs/database/schema/RUNS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `execution` |
| Primary Domain Owner | Execution / Run Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Time Standard | UTC `timestamptz` |
| Business-State Authority | PostgreSQL |
| Runtime Execution Authority | Kritva Runtime / Lab Agent |
| Phase Coverage | Phase 0–Phase 8 |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for Kritva RaaS
runtime Runs.

A Run represents an actual execution instance of a Job.

The Job defines execution orchestration and intent.

The Run records what actually executed, where it executed, when it executed,
which runtime and resource were used, and the resulting operational evidence.

The relationship is:

    Booking
       |
       v
      Job
       |
       v
    Attempt
       |
       v
      Run
       |
       +----> Telemetry Metadata
       |
       +----> Log Metadata
       |
       +----> Event Metadata
       |
       +----> Video Metadata
       |
       +----> Result

# 3. Scope

This document defines:

- Run identity;
- Run ownership;
- Job and Attempt linkage;
- Platform execution snapshot;
- Resource execution snapshot;
- Lab Agent assignment;
- Runtime identity;
- Run lifecycle;
- Run state history;
- telemetry metadata;
- log metadata;
- event metadata;
- video recording metadata;
- execution timing;
- exit information;
- failure information;
- retention;
- tenancy;
- audit;
- reconciliation;
- observability;
- production acceptance.

# 4. Non-Goals

This document does not define:

- Job scheduling;
- Booking availability;
- credit accounting;
- Artifact binary storage;
- source-code storage;
- robot physical safety control;
- high-volume telemetry payload storage;
- raw log object contents;
- raw video object contents;
- Result business schema;
- Experiment grouping semantics.

Those concerns remain owned by their respective domains.

# 5. Goals

The Run schema must provide:

1. immutable execution provenance;
2. tenant isolation;
3. Job-to-Run traceability;
4. Attempt-to-Run traceability;
5. Resource traceability;
6. Lab Agent traceability;
7. runtime traceability;
8. lifecycle state management;
9. operational evidence metadata;
10. execution timing;
11. failure classification;
12. telemetry/log/video discovery;
13. historical reproducibility;
14. reconciliation;
15. retention controls;
16. auditability.

# 6. Run Definition

A Run is the authoritative record of an actual execution instance initiated
by a Job Attempt.

Conceptually:

    Project
       |
       v
    Booking
       |
       v
      Job
       |
       v
    Attempt
       |
       v
      Run
       |
       +--> Runtime
       +--> Resource
       +--> Lab Agent
       +--> Telemetry
       +--> Logs
       +--> Events
       +--> Video
       +--> Result

# 7. Job versus Run

The distinction is mandatory.

| Job | Run |
|---|---|
| Execution request | Actual execution |
| Orchestration | Runtime evidence |
| Contains execution intent | Contains execution snapshot |
| Can have multiple Attempts | Represents one execution instance |
| Queueable | Executing/completed |
| Scheduling object | Runtime object |

The Job domain controls orchestration.

The Run domain controls execution history.

# 8. Run Lifecycle

Recommended lifecycle:

    CREATED
       |
       v
    PREPARING
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       v
    STOPPING
       |
       v
    COMPLETED

Failure paths:

    CREATED   -> FAILED
    PREPARING -> FAILED
    STARTING  -> FAILED
    RUNNING   -> FAILED
    STOPPING  -> FAILED

Other terminal states:

    CANCELLED
    TIMEOUT
    ABORTED

# 9. Run Status Definitions

| Status | Meaning |
|---|---|
| CREATED | Run record created |
| PREPARING | Runtime/resources being prepared |
| STARTING | Application process starting |
| RUNNING | Application actively executing |
| STOPPING | Runtime shutdown in progress |
| COMPLETED | Successful execution |
| FAILED | Execution failed |
| CANCELLED | Execution cancelled |
| TIMEOUT | Runtime exceeded execution limit |
| ABORTED | Runtime forcibly terminated due to operational condition |

# 10. Run State Machine

    CREATED
       |
       v
    PREPARING
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       v
    STOPPING
       |
       +---------> COMPLETED
       |
       +---------> FAILED
       |
       +---------> CANCELLED

Timeout:

    RUNNING
       |
       v
    TIMEOUT

Operational abort:

    PREPARING / STARTING / RUNNING
       |
       v
    ABORTED

# 11. Run Status Enum

    CREATE TYPE execution.run_status AS ENUM (
        'CREATED',
        'PREPARING',
        'STARTING',
        'RUNNING',
        'STOPPING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'TIMEOUT',
        'ABORTED'
    );

# 12. `execution.runs` Overview

`execution.runs` is the primary aggregate root for runtime execution history.

A Run contains both references to authoritative domain objects and immutable
snapshots needed to preserve historical meaning.

# 13. `execution.runs` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| run_id | uuid | No | UUIDv7 | Run ID |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| job_id | uuid | No | None | Job |
| attempt_id | uuid | No | None | Attempt |
| booking_id | uuid | No | None | Booking |
| artifact_id | uuid | No | None | Artifact |
| platform_id | uuid | No | None | Platform |
| platform_version_id | uuid | No | None | Platform Version |
| platform_configuration_id | uuid | Yes | NULL | Configuration |
| resource_id | uuid | No | None | Resource |
| robot_id | uuid | Yes | NULL | Robot |
| lab_id | uuid | Yes | NULL | Lab |
| lab_agent_id | uuid | Yes | NULL | Lab Agent |
| status | run_status | No | `CREATED` | Lifecycle |
| run_key | varchar(100) | No | None | Human-readable key |
| runtime_name | varchar(255) | No | None | Runtime |
| runtime_version | varchar(100) | Yes | NULL | Runtime version |
| sdk_version | varchar(100) | Yes | NULL | SDK version |
| architecture | varchar(100) | No | None | Execution architecture |
| os_name | varchar(100) | Yes | NULL | Host OS |
| os_version | varchar(100) | Yes | NULL | Host OS version |
| entrypoint | varchar(500) | No | None | Executed entrypoint |
| requested_at | timestamptz | No | `now()` | Request time |
| prepared_at | timestamptz | Yes | NULL | Preparation complete |
| started_at | timestamptz | Yes | NULL | Runtime start |
| stopped_at | timestamptz | Yes | NULL | Runtime stop |
| completed_at | timestamptz | Yes | NULL | Terminal time |
| max_runtime_seconds | integer | No | None | Runtime limit |
| exit_code | integer | Yes | NULL | Process exit code |
| termination_signal | varchar(32) | Yes | NULL | Signal |
| failure_code | varchar(64) | Yes | NULL | Final failure |
| failure_message | varchar(4000) | Yes | NULL | Safe failure message |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | No | None | Creator |
| updated_by | uuid | Yes | NULL | Updater |

# 14. Run DDL

    CREATE TABLE execution.runs (
        run_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        job_id UUID NOT NULL,
        attempt_id UUID NOT NULL,
        booking_id UUID NOT NULL,
        artifact_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        platform_version_id UUID NOT NULL,
        platform_configuration_id UUID NULL,
        resource_id UUID NOT NULL,
        robot_id UUID NULL,
        lab_id UUID NULL,
        lab_agent_id UUID NULL,
        status execution.run_status
            NOT NULL DEFAULT 'CREATED',
        run_key VARCHAR(100) NOT NULL,
        runtime_name VARCHAR(255) NOT NULL,
        runtime_version VARCHAR(100) NULL,
        sdk_version VARCHAR(100) NULL,
        architecture VARCHAR(100) NOT NULL,
        os_name VARCHAR(100) NULL,
        os_version VARCHAR(100) NULL,
        entrypoint VARCHAR(500) NOT NULL,
        requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        prepared_at TIMESTAMPTZ NULL,
        started_at TIMESTAMPTZ NULL,
        stopped_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        max_runtime_seconds INTEGER NOT NULL,
        exit_code INTEGER NULL,
        termination_signal VARCHAR(32) NULL,
        failure_code VARCHAR(64) NULL,
        failure_message VARCHAR(4000) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        CONSTRAINT runs_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_attempt_fk
            FOREIGN KEY (attempt_id)
            REFERENCES execution.job_attempts(attempt_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES booking.bookings(booking_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_artifact_fk
            FOREIGN KEY (artifact_id)
            REFERENCES artifact.artifacts(artifact_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_configuration_fk
            FOREIGN KEY (platform_configuration_id)
            REFERENCES platform.platform_configurations(platform_configuration_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_robot_fk
            FOREIGN KEY (robot_id)
            REFERENCES lab.robots(robot_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_lab_fk
            FOREIGN KEY (lab_id)
            REFERENCES lab.labs(lab_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_agent_fk
            FOREIGN KEY (lab_agent_id)
            REFERENCES lab.lab_agents(lab_agent_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT runs_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT runs_key_unique
            UNIQUE (project_id, run_key),
        CONSTRAINT runs_runtime_check
            CHECK (max_runtime_seconds > 0),
        CONSTRAINT runs_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object'),
        CONSTRAINT runs_completion_time_check
            CHECK (
                completed_at IS NULL
                OR completed_at >= requested_at
            )
    );

# 15. Run Indexes

    CREATE INDEX runs_org_status_idx
        ON execution.runs(organization_id, status);

    CREATE INDEX runs_project_status_idx
        ON execution.runs(project_id, status);

    CREATE INDEX runs_job_idx
        ON execution.runs(job_id);

    CREATE INDEX runs_attempt_idx
        ON execution.runs(attempt_id);

    CREATE INDEX runs_booking_idx
        ON execution.runs(booking_id);

    CREATE INDEX runs_resource_time_idx
        ON execution.runs(resource_id, requested_at);

    CREATE INDEX runs_agent_status_idx
        ON execution.runs(lab_agent_id, status);

    CREATE INDEX runs_created_idx
        ON execution.runs(created_at);

# 16. Run Uniqueness

The default model is:

    One Job
       |
       +--> many Attempts
                    |
                    +--> one Run per execution Attempt

Therefore:

    UNIQUE(attempt_id)

is recommended when the implementation chooses one Run per Attempt.

    CREATE UNIQUE INDEX runs_attempt_unique
        ON execution.runs(attempt_id);

This prevents duplicate Run creation caused by retry or worker races.

# 17. Run Ownership

Run ownership follows:

    Organization
         |
         v
       Project
         |
         v
        Job
         |
         v
      Attempt
         |
         v
        Run

The Run stores `organization_id` directly for efficient tenant filtering and
defense in depth.

# 18. Historical Snapshot

The Run preserves execution-time values for:

- Platform;
- Platform Version;
- Resource;
- Robot;
- Lab;
- Lab Agent;
- runtime;
- runtime version;
- SDK;
- architecture;
- operating system;
- entrypoint;
- runtime limit.

These values must not depend solely on mutable current catalog state.

# 19. Run State History

Every Run lifecycle transition must produce an append-oriented history record.

# 20. `execution.run_state_history` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| state_history_id | uuid | No | UUIDv7 | History |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| from_status | run_status | Yes | NULL | Previous state |
| to_status | run_status | No | None | New state |
| reason_code | varchar(64) | Yes | NULL | Reason |
| reason | varchar(2000) | Yes | NULL | Explanation |
| actor_type | run_actor_type | No | `SYSTEM` | Actor |
| actor_id | uuid | Yes | NULL | Actor |
| created_at | timestamptz | No | `now()` | Time |
| metadata | jsonb | No | `'{}'` | Evidence |

# 21. Run Actor Type

    CREATE TYPE execution.run_actor_type AS ENUM (
        'USER',
        'SYSTEM',
        'ADMIN',
        'LAB_AGENT',
        'RUNTIME'
    );

# 22. State History DDL

    CREATE TABLE execution.run_state_history (
        state_history_id UUID PRIMARY KEY,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        from_status execution.run_status NULL,
        to_status execution.run_status NOT NULL,
        reason_code VARCHAR(64) NULL,
        reason VARCHAR(2000) NULL,
        actor_type execution.run_actor_type
            NOT NULL DEFAULT 'SYSTEM',
        actor_id UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT run_history_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT run_history_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT run_history_actor_fk
            FOREIGN KEY (actor_id)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT run_history_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX run_history_run_time_idx
        ON execution.run_state_history(run_id, created_at);

    CREATE INDEX run_history_org_time_idx
        ON execution.run_state_history(
            organization_id,
            created_at
        );

# 23. State Transition Integrity

Run transitions must be controlled by the Run service.

Example valid transitions:

    CREATED -> PREPARING
    PREPARING -> STARTING
    STARTING -> RUNNING
    RUNNING -> STOPPING
    STOPPING -> COMPLETED
    STOPPING -> FAILED

Terminal states:

    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT
    ABORTED

No terminal state may transition to another state.

# 24. Run Event Metadata

Run events are lifecycle and operational events associated with a Run.

High-volume event payloads are not stored in PostgreSQL by default.

PostgreSQL stores searchable metadata and references.

# 25. `execution.run_events` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| event_id | uuid | No | UUIDv7 | Event |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| event_type | varchar(100) | No | None | Event type |
| severity | event_severity | No | `INFO` | Severity |
| source | varchar(100) | No | None | Source |
| occurred_at | timestamptz | No | None | Event time |
| sequence_number | bigint | Yes | NULL | Per-run sequence |
| correlation_id | varchar(255) | Yes | NULL | Correlation |
| external_reference | varchar(1000) | Yes | NULL | External payload |
| metadata | jsonb | No | `'{}'` | Structured metadata |
| created_at | timestamptz | No | `now()` | Persistence time |

# 26. Event Severity

    CREATE TYPE execution.event_severity AS ENUM (
        'DEBUG',
        'INFO',
        'WARNING',
        'ERROR',
        'CRITICAL'
    );

# 27. Run Events DDL

    CREATE TABLE execution.run_events (
        event_id UUID PRIMARY KEY,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        severity execution.event_severity
            NOT NULL DEFAULT 'INFO',
        source VARCHAR(100) NOT NULL,
        occurred_at TIMESTAMPTZ NOT NULL,
        sequence_number BIGINT NULL,
        correlation_id VARCHAR(255) NULL,
        external_reference VARCHAR(1000) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT run_events_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT run_events_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT run_events_sequence_check
            CHECK (
                sequence_number IS NULL
                OR sequence_number > 0
            ),
        CONSTRAINT run_events_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE UNIQUE INDEX run_events_sequence_unique
        ON execution.run_events(run_id, sequence_number)
        WHERE sequence_number IS NOT NULL;

    CREATE INDEX run_events_run_time_idx
        ON execution.run_events(run_id, occurred_at);

    CREATE INDEX run_events_type_time_idx
        ON execution.run_events(event_type, occurred_at);

    CREATE INDEX run_events_org_time_idx
        ON execution.run_events(
            organization_id,
            occurred_at
        );

# 28. Event Metadata Policy

Events may describe:

- runtime started;
- process started;
- process stopped;
- sensor subsystem connected;
- controller warning;
- robot fault;
- Lab Agent disconnect;
- network degradation;
- runtime restart;
- safety state change.

Raw high-frequency event streams should use dedicated telemetry or event
transport rather than unbounded relational rows.

# 29. Telemetry Metadata

Telemetry is high-volume operational data.

The RaaS database stores telemetry stream metadata, not necessarily every
telemetry sample.

# 30. `execution.run_telemetry_streams` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| telemetry_stream_id | uuid | No | UUIDv7 | Stream |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| stream_key | varchar(100) | No | None | Stream key |
| stream_type | varchar(100) | No | None | Type |
| source | varchar(100) | No | None | Producer |
| schema_version | varchar(50) | No | None | Payload schema |
| sampling_rate_hz | numeric(12,3) | Yes | NULL | Sampling rate |
| unit | varchar(50) | Yes | NULL | Unit |
| storage_reference | varchar(1000) | Yes | NULL | External storage |
| first_sample_at | timestamptz | Yes | NULL | First sample |
| last_sample_at | timestamptz | Yes | NULL | Last sample |
| sample_count | bigint | No | `0` | Count |
| status | telemetry_stream_status | No | `ACTIVE` | State |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 31. Telemetry Stream Status

    CREATE TYPE execution.telemetry_stream_status AS ENUM (
        'ACTIVE',
        'PAUSED',
        'COMPLETED',
        'FAILED',
        'PURGED'
    );

# 32. Telemetry DDL

    CREATE TABLE execution.run_telemetry_streams (
        telemetry_stream_id UUID PRIMARY KEY,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        stream_key VARCHAR(100) NOT NULL,
        stream_type VARCHAR(100) NOT NULL,
        source VARCHAR(100) NOT NULL,
        schema_version VARCHAR(50) NOT NULL,
        sampling_rate_hz NUMERIC(12,3) NULL,
        unit VARCHAR(50) NULL,
        storage_reference VARCHAR(1000) NULL,
        first_sample_at TIMESTAMPTZ NULL,
        last_sample_at TIMESTAMPTZ NULL,
        sample_count BIGINT NOT NULL DEFAULT 0,
        status execution.telemetry_stream_status
            NOT NULL DEFAULT 'ACTIVE',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT telemetry_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT telemetry_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT telemetry_stream_unique
            UNIQUE (run_id, stream_key),
        CONSTRAINT telemetry_rate_check
            CHECK (
                sampling_rate_hz IS NULL
                OR sampling_rate_hz > 0
            ),
        CONSTRAINT telemetry_count_check
            CHECK (sample_count >= 0),
        CONSTRAINT telemetry_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX telemetry_run_status_idx
        ON execution.run_telemetry_streams(run_id, status);

    CREATE INDEX telemetry_org_time_idx
        ON execution.run_telemetry_streams(
            organization_id,
            created_at
        );

# 33. Telemetry Storage Boundary

Telemetry payloads may be stored in:

- time-series infrastructure;
- object storage;
- streaming systems;
- specialized telemetry databases.

The relational record identifies:

- stream;
- schema;
- source;
- unit;
- rate;
- time range;
- count;
- storage reference;
- lifecycle.

# 34. Log Metadata

Logs may be high-volume and are therefore represented through metadata and
storage references.

# 35. `execution.run_log_streams` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| log_stream_id | uuid | No | UUIDv7 | Stream |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| stream_key | varchar(100) | No | None | Stream |
| source | varchar(100) | No | None | Source |
| format | varchar(50) | No | None | Format |
| storage_reference | varchar(1000) | Yes | NULL | External log |
| first_log_at | timestamptz | Yes | NULL | First log |
| last_log_at | timestamptz | Yes | NULL | Last log |
| line_count | bigint | No | `0` | Lines |
| byte_count | bigint | No | `0` | Bytes |
| status | log_stream_status | No | `ACTIVE` | State |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 36. Log Stream Status

    CREATE TYPE execution.log_stream_status AS ENUM (
        'ACTIVE',
        'COMPLETED',
        'FAILED',
        'PURGED'
    );

# 37. Log DDL

    CREATE TABLE execution.run_log_streams (
        log_stream_id UUID PRIMARY KEY,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        stream_key VARCHAR(100) NOT NULL,
        source VARCHAR(100) NOT NULL,
        format VARCHAR(50) NOT NULL,
        storage_reference VARCHAR(1000) NULL,
        first_log_at TIMESTAMPTZ NULL,
        last_log_at TIMESTAMPTZ NULL,
        line_count BIGINT NOT NULL DEFAULT 0,
        byte_count BIGINT NOT NULL DEFAULT 0,
        status execution.log_stream_status
            NOT NULL DEFAULT 'ACTIVE',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT logs_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT logs_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT logs_stream_unique
            UNIQUE (run_id, stream_key),
        CONSTRAINT logs_line_count_check
            CHECK (line_count >= 0),
        CONSTRAINT logs_byte_count_check
            CHECK (byte_count >= 0),
        CONSTRAINT logs_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX logs_run_status_idx
        ON execution.run_log_streams(run_id, status);

    CREATE INDEX logs_org_time_idx
        ON execution.run_log_streams(
            organization_id,
            created_at
        );

# 38. Log Storage Boundary

Raw logs may be stored in:

- object storage;
- log aggregation systems;
- searchable logging infrastructure.

The database stores discovery and retention metadata.

# 39. Video Recordings

Video recordings are large binary objects and must not be stored directly in
PostgreSQL.

The database stores recording metadata and object references.

# 40. `execution.run_video_recordings` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| recording_id | uuid | No | UUIDv7 | Recording |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| camera_id | varchar(100) | No | None | Camera |
| recording_type | video_recording_type | No | `EXECUTION` | Type |
| format | varchar(50) | No | None | Container |
| codec | varchar(50) | Yes | NULL | Codec |
| resolution_width | integer | Yes | NULL | Width |
| resolution_height | integer | Yes | NULL | Height |
| frame_rate | numeric(8,3) | Yes | NULL | FPS |
| started_at | timestamptz | Yes | NULL | Start |
| ended_at | timestamptz | Yes | NULL | End |
| duration_seconds | numeric(14,3) | Yes | NULL | Duration |
| byte_size | bigint | Yes | NULL | Size |
| checksum | varchar(128) | Yes | NULL | Integrity |
| storage_reference | varchar(1000) | No | None | Object reference |
| status | video_status | No | `RECORDING` | Lifecycle |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 41. Video Recording Type

    CREATE TYPE execution.video_recording_type AS ENUM (
        'EXECUTION',
        'DEBUG',
        'CALIBRATION',
        'SAFETY',
        'REPLAY'
    );

# 42. Video Status

    CREATE TYPE execution.video_status AS ENUM (
        'RECORDING',
        'COMPLETED',
        'FAILED',
        'PURGED'
    );

# 43. Video DDL

    CREATE TABLE execution.run_video_recordings (
        recording_id UUID PRIMARY KEY,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        camera_id VARCHAR(100) NOT NULL,
        recording_type execution.video_recording_type
            NOT NULL DEFAULT 'EXECUTION',
        format VARCHAR(50) NOT NULL,
        codec VARCHAR(50) NULL,
        resolution_width INTEGER NULL,
        resolution_height INTEGER NULL,
        frame_rate NUMERIC(8,3) NULL,
        started_at TIMESTAMPTZ NULL,
        ended_at TIMESTAMPTZ NULL,
        duration_seconds NUMERIC(14,3) NULL,
        byte_size BIGINT NULL,
        checksum VARCHAR(128) NULL,
        storage_reference VARCHAR(1000) NOT NULL,
        status execution.video_status
            NOT NULL DEFAULT 'RECORDING',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT video_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT video_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT video_resolution_check
            CHECK (
                (resolution_width IS NULL AND resolution_height IS NULL)
                OR
                (resolution_width > 0 AND resolution_height > 0)
            ),
        CONSTRAINT video_frame_rate_check
            CHECK (
                frame_rate IS NULL OR frame_rate > 0
            ),
        CONSTRAINT video_duration_check
            CHECK (
                duration_seconds IS NULL
                OR duration_seconds >= 0
            ),
        CONSTRAINT video_size_check
            CHECK (
                byte_size IS NULL OR byte_size >= 0
            ),
        CONSTRAINT video_time_check
            CHECK (
                ended_at IS NULL
                OR started_at IS NULL
                OR ended_at >= started_at
            ),
        CONSTRAINT video_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX video_run_time_idx
        ON execution.run_video_recordings(run_id, started_at);

    CREATE INDEX video_org_time_idx
        ON execution.run_video_recordings(
            organization_id,
            created_at
        );

    CREATE INDEX video_status_idx
        ON execution.run_video_recordings(status);

# 44. Lab Agent Assignment

A Run may identify the Lab Agent responsible for execution.

The Lab Agent assignment records the execution gateway rather than ownership of
the Resource.

Resource ownership remains with the Lab domain.

# 45. `execution.run_agent_assignments` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| assignment_id | uuid | No | UUIDv7 | Assignment |
| run_id | uuid | No | None | Run |
| organization_id | uuid | No | None | Tenant |
| lab_agent_id | uuid | No | None | Agent |
| assignment_role | agent_assignment_role | No | `PRIMARY` | Role |
| assigned_at | timestamptz | No | `now()` | Assignment |
| connected_at | timestamptz | Yes | NULL | Connection |
| disconnected_at | timestamptz | Yes | NULL | Disconnect |
| status | agent_assignment_status | No | `ASSIGNED` | Status |
| disconnect_reason | varchar(1000) | Yes | NULL | Reason |
| metadata | jsonb | No | `'{}'` | Metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 46. Agent Assignment Role

    CREATE TYPE execution.agent_assignment_role AS ENUM (
        'PRIMARY',
        'SECONDARY',
        'OBSERVER'
    );

# 47. Agent Assignment Status

    CREATE TYPE execution.agent_assignment_status AS ENUM (
        'ASSIGNED',
        'CONNECTED',
        'DISCONNECTED',
        'RELEASED'
    );

# 48. Agent Assignment DDL

    CREATE TABLE execution.run_agent_assignments (
        assignment_id UUID PRIMARY KEY,
        run_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        lab_agent_id UUID NOT NULL,
        assignment_role execution.agent_assignment_role
            NOT NULL DEFAULT 'PRIMARY',
        assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        connected_at TIMESTAMPTZ NULL,
        disconnected_at TIMESTAMPTZ NULL,
        status execution.agent_assignment_status
            NOT NULL DEFAULT 'ASSIGNED',
        disconnect_reason VARCHAR(1000) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT agent_assignment_run_fk
            FOREIGN KEY (run_id)
            REFERENCES execution.runs(run_id)
            ON DELETE RESTRICT,
        CONSTRAINT agent_assignment_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT agent_assignment_agent_fk
            FOREIGN KEY (lab_agent_id)
            REFERENCES lab.lab_agents(lab_agent_id)
            ON DELETE RESTRICT,
        CONSTRAINT agent_assignment_time_check
            CHECK (
                disconnected_at IS NULL
                OR connected_at IS NULL
                OR disconnected_at >= connected_at
            ),
        CONSTRAINT agent_assignment_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE UNIQUE INDEX run_primary_agent_unique
        ON execution.run_agent_assignments(run_id)
        WHERE assignment_role = 'PRIMARY'
          AND status IN (
              'ASSIGNED',
              'CONNECTED'
          );

    CREATE INDEX run_agent_assignment_run_idx
        ON execution.run_agent_assignments(run_id);

    CREATE INDEX run_agent_assignment_agent_idx
        ON execution.run_agent_assignments(
            lab_agent_id,
            assigned_at
        );

# 49. Lab Agent Connection Flow

    Run
      |
      v
    PRIMARY Agent Assigned
      |
      v
    Agent CONNECTED
      |
      v
    Runtime Starts
      |
      v
    Agent Streams Evidence
      |
      v
    Agent DISCONNECTED
      |
      v
    Assignment RELEASED

A disconnected Lab Agent does not automatically imply that the Run failed.
The execution service must determine whether runtime execution remains alive.

# 50. Run Runtime Identity

A Run should identify the exact runtime used.

Minimum identity:

- runtime name;
- runtime version;
- SDK version;
- architecture;
- operating system;
- operating system version.

This is required for historical debugging.

# 51. Run Timing

Timing fields represent:

    requested_at
        |
        v
    prepared_at
        |
        v
     started_at
        |
        v
     stopped_at
        |
        v
    completed_at

Not every stage is guaranteed to have a timestamp if execution terminates
unexpectedly.

# 52. Timing Constraints

Expected relationships:

    requested_at <= prepared_at
    prepared_at <= started_at
    started_at <= stopped_at
    stopped_at <= completed_at

The application layer should enforce lifecycle-specific timing constraints.

# 53. Runtime Exit Information

A successful process normally records:

    exit_code = 0

A failed process may record:

    exit_code != 0

Signal-based termination may record:

    termination_signal

The schema preserves both because operating systems differ in termination
semantics.

# 54. Run Failure

A Run failure may originate from:

- application;
- artifact;
- runtime;
- compatibility;
- startup;
- deployment;
- Lab Agent;
- Resource;
- Robot;
- network;
- timeout;
- cancellation;
- infrastructure.

The Run stores the final customer-safe failure classification.

Detailed failure evidence may remain in `execution.job_failures`.

# 55. Run Events and State History

State history answers:

    "What lifecycle state was the Run in?"

Run events answer:

    "What happened during the Run?"

They must not be conflated.

# 56. Telemetry Relationship

    Run
      |
      +--> telemetry stream: joint_state
      |
      +--> telemetry stream: imu
      |
      +--> telemetry stream: cpu
      |
      +--> telemetry stream: temperature
      |
      +--> telemetry stream: network

The telemetry stream metadata identifies where the high-volume data resides.

# 57. Log Relationship

    Run
      |
      +--> stdout
      +--> stderr
      +--> runtime
      +--> lab-agent
      +--> application

Each stream can point to a separate log object or log aggregation source.

# 58. Video Relationship

    Run
      |
      +--> front_camera
      +--> head_camera
      +--> wrist_camera
      +--> debug_camera

Video metadata identifies recording boundaries and object storage.

# 59. Storage References

Storage references must be opaque identifiers or provider-neutral object
references.

The database must not assume a specific cloud provider.

Examples:

    object://runs/run-001/video/front-001
    telemetry://runs/run-001/stream/joint-state
    logs://runs/run-001/stdout

Actual URI semantics are implementation-specific.

# 60. Run Creation

A Run is created only after:

- Job validation succeeds;
- Attempt is valid;
- Resource is allocated;
- execution authorization remains valid.

The normal sequence is:

    Job Attempt
        |
        v
    Resource allocated
        |
        v
    Run CREATED
        |
        v
    PREPARING

# 61. Preparation

Preparation may include:

- Lab Agent connection;
- Resource validation;
- runtime environment setup;
- deployment verification;
- runtime initialization;
- telemetry setup;
- video setup.

# 62. Starting

Starting includes:

- process launch;
- runtime handshake;
- health validation;
- execution identity confirmation.

Only after successful startup should the Run enter:

    RUNNING

# 63. Running

RUNNING means the execution environment has accepted the application and
execution is active.

The Run may receive:

- telemetry;
- logs;
- events;
- video;
- runtime status;
- health events.

# 64. Stopping

Stopping may be initiated by:

- normal completion;
- user cancellation;
- timeout;
- resource fault;
- robot fault;
- administrator;
- safety system.

# 65. Completion

A Run may become COMPLETED only when:

- runtime termination is confirmed;
- required execution evidence is finalized;
- terminal state is recorded.

Result generation may occur synchronously or asynchronously afterward.

# 66. Cancellation

Cancellation is a control-plane state.

Physical termination must be performed through the local Lab Agent/runtime.

The database must never be interpreted as an emergency-stop controller.

# 67. Timeout

Timeout occurs when:

    runtime_duration > max_runtime_seconds

or another configured execution deadline is exceeded.

Timeout should cause:

- local runtime stop request;
- Run TIMEOUT;
- Job timeout/failure policy;
- resource release;
- credit reconciliation.

# 68. Abort

ABORTED represents forced termination due to operational conditions such as:

- unrecoverable Lab Agent failure;
- Resource fault;
- Robot fault;
- infrastructure intervention;
- safety-related local termination.

Safety state remains owned by the local system.

# 69. Run State Transaction

Every state transition should be transactional:

    BEGIN
      SELECT Run FOR UPDATE
      validate transition
      UPDATE Run
      INSERT Run State History
      INSERT Outbox Event
    COMMIT

External runtime communication occurs outside the database transaction.

# 70. Runtime Communication

The runtime communication path is:

    Control Plane
         |
         v
       Worker
         |
         v
     Lab Agent
         |
         v
    Kritva Runtime
         |
         v
      Process

The database records durable state around this communication.

# 71. Lab Agent Assignment Transaction

Assignment should be created before runtime startup.

The system must prevent two active PRIMARY assignments for one Run.

The partial unique index enforces this invariant.

# 72. Agent Failure

If the primary Lab Agent disconnects:

1. record disconnect;
2. emit Run event;
3. inspect runtime state;
4. determine whether execution remains active;
5. attempt controlled recovery if policy permits;
6. otherwise terminate/abort Run;
7. reconcile Resource and Job state.

# 73. Telemetry Lifecycle

Telemetry stream lifecycle:

    ACTIVE
      |
      +--> PAUSED
      |
      +--> COMPLETED
      |
      +--> FAILED
      |
      +--> PURGED

Telemetry payload retention may be shorter than Run metadata retention.

# 74. Log Lifecycle

Log stream lifecycle:

    ACTIVE
      |
      v
    COMPLETED

Failure path:

    ACTIVE -> FAILED

Retention path:

    COMPLETED -> PURGED

# 75. Video Lifecycle

Video recording lifecycle:

    RECORDING
        |
        v
    COMPLETED

Failure:

    RECORDING -> FAILED

Retention:

    COMPLETED -> PURGED

# 76. Metadata Immutability

After a Run reaches a terminal state:

    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT
    ABORTED

execution identity fields must not change.

Only controlled operational metadata updates may remain permitted.

# 77. Audit Columns

Primary Run records contain:

- created_at;
- updated_at;
- created_by;
- updated_by.

Append-oriented history records contain:

- created_at;
- actor identity where applicable.

High-volume evidence metadata does not require generic user update fields.

# 78. Audit Domain

Run lifecycle actions should also produce records in the central Audit domain.

Examples:

    run.created
    run.cancelled
    run.aborted
    run.completed
    run.failed
    run.timeout

# 79. Idempotency

Run creation must be idempotent.

The preferred idempotency identity is:

    attempt_id

combined with an application-level creation request key where required.

The `UNIQUE(attempt_id)` constraint prevents duplicate Run creation.

# 80. Duplicate Runtime Start

A worker must not start a runtime merely because it receives a duplicate
dispatch request.

It must first query authoritative Run state.

If:

    Run = RUNNING

then a duplicate start request must be rejected or treated as already
completed.

# 81. Duplicate Completion

Completion must be idempotent.

If Run is already terminal:

    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT
    ABORTED

a repeated completion message must not create a new terminal transition.

# 82. Run Reconciliation

Reconciliation must compare:

    Job
    Attempt
    Run
    Lab Agent
    Runtime
    Resource

and identify inconsistencies.

# 83. Reconciliation Examples

Examples:

    Job = RUNNING
    Run = missing

or:

    Run = RUNNING
    Lab Agent = disconnected
    Runtime = unknown

or:

    Run = COMPLETED
    Job = RUNNING

or:

    Run = RUNNING
    Resource = OFFLINE

These conditions require reconciliation policy.

# 84. Run and Result

The Run is the source execution record.

The Result domain owns customer-facing result artifacts.

Relationship:

    Run
      |
      v
    Result

Result records may reference:

- Run;
- telemetry;
- logs;
- video;
- generated files;
- metrics.

# 85. Run and Experiment

An Experiment may group multiple Runs.

Conceptually:

    Experiment
       |
       +--> Run 1
       +--> Run 2
       +--> Run 3

Experiment grouping must not change Run ownership or lifecycle.

# 86. Run and Credits

Credit consumption is associated with execution usage.

The Credit domain owns:

- credit reservation;
- consumption;
- refunds;
- ledger.

Run provides usage evidence:

- start time;
- stop time;
- duration;
- platform;
- resource;
- execution outcome.

# 87. Run and Booking

Run retains Booking identity for historical traceability.

Booking determines authorization and reservation.

Run does not alter Booking state directly.

# 88. Run and Artifact

Run identifies the exact Artifact executed.

The Artifact remains immutable.

Run metadata should preserve the Artifact version and checksum when required
for historical evidence.

# 89. Run and Resource

Run identifies the actual Resource used.

This is distinct from requested Resource eligibility.

The historical Resource reference allows post-run analysis.

# 90. Run and Robot

For physical robot execution, Run may identify:

- Robot;
- Resource;
- Lab.

The Robot is the physical identity.

The Resource is the allocatable execution unit.

# 91. Run and Simulator

For simulated execution:

    robot_id may be NULL
    resource_id remains mandatory

The Resource can be a simulator or virtual execution resource.

# 92. Run and Architecture

Run records actual execution architecture.

Examples:

    x86_64
    aarch64
    riscv64

This is important for debugging compatibility failures.

# 93. Run Runtime Snapshot

Example:

    runtime_name:
      kritva-runtime

    runtime_version:
      1.0.0

    sdk_version:
      1.0.0

    architecture:
      aarch64

    os_name:
      KritvaOS

    os_version:
      1.0

# 94. Example Run Row

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    organization_id:
      0194c7d0-8b00-7abc-9def-200000000001

    project_id:
      0194c7d0-8b00-7abc-9def-300000000001

    job_id:
      0194c7d0-8b00-7abc-9def-900000000001

    attempt_id:
      0194c7d0-8b00-7abc-9def-900000000003

    status:
      RUNNING

    runtime_name:
      kritva-runtime

    runtime_version:
      1.0.0

    sdk_version:
      1.0.0

    architecture:
      aarch64

# 95. Example State History

    state_history_id:
      0194c7d0-8b00-7abc-9def-910000000002

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    from_status:
      STARTING

    to_status:
      RUNNING

    actor_type:
      RUNTIME

    reason_code:
      RUNTIME_READY

# 96. Example Telemetry Stream

    telemetry_stream_id:
      0194c7d0-8b00-7abc-9def-910000000003

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    stream_key:
      joint_state

    stream_type:
      sensor.joint_state

    source:
      kritva-motion

    schema_version:
      1.0

    sampling_rate_hz:
      100.0

# 97. Example Log Stream

    log_stream_id:
      0194c7d0-8b00-7abc-9def-910000000004

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    stream_key:
      stdout

    source:
      application

    format:
      jsonl

    status:
      ACTIVE

# 98. Example Video Recording

    recording_id:
      0194c7d0-8b00-7abc-9def-910000000005

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    camera_id:
      front-camera

    recording_type:
      EXECUTION

    format:
      mp4

    codec:
      h264

    resolution_width:
      1920

    resolution_height:
      1080

    frame_rate:
      30.0

# 99. Example Lab Agent Assignment

    assignment_id:
      0194c7d0-8b00-7abc-9def-910000000006

    run_id:
      0194c7d0-8b00-7abc-9def-910000000001

    lab_agent_id:
      0194c7d0-8b00-7abc-9def-610000000001

    assignment_role:
      PRIMARY

    status:
      CONNECTED

# 100. Repository Interfaces

Recommended repositories:

    RunRepository
    RunStateHistoryRepository
    RunEventRepository
    TelemetryStreamRepository
    LogStreamRepository
    VideoRecordingRepository
    RunAgentAssignmentRepository

# 101. Run Repository

Operations:

    create
    get
    get_for_update
    list_by_project
    list_by_job
    list_by_attempt
    list_by_resource
    list_by_organization
    transition_state
    complete
    fail
    cancel
    timeout
    abort

# 102. State History Repository

Operations:

    append
    list_by_run
    list_by_organization
    get_latest

State history is append-only.

# 103. Telemetry Repository

Operations:

    create_stream
    get_stream
    list_streams
    update_stream_status
    update_sample_statistics
    mark_purged

# 104. Log Repository

Operations:

    create_stream
    get_stream
    list_streams
    update_stream
    complete_stream
    mark_purged

# 105. Video Repository

Operations:

    create_recording
    get_recording
    list_by_run
    finalize_recording
    mark_failed
    mark_purged

# 106. Agent Assignment Repository

Operations:

    assign
    connect
    disconnect
    release
    list_by_run
    get_primary

# 107. Application Services

Recommended services:

    RunService
    RunLifecycleService
    RunAgentService
    RunTelemetryService
    RunLogService
    RunVideoService
    RunReconciliationService

# 108. RunService

RunService owns:

- Run creation;
- lifecycle;
- completion;
- failure;
- cancellation;
- timeout;
- abort.

It does not own:

- Job scheduling;
- Booking allocation;
- Credit ledger;
- Artifact contents;
- robot safety.

# 109. Run Lifecycle Service

RunLifecycleService owns:

- transition validation;
- state history;
- terminal-state enforcement;
- timestamps;
- lifecycle events.

# 110. Run Agent Service

RunAgentService owns:

- Lab Agent assignment;
- connection state;
- disconnect tracking;
- reassignment policy;
- agent evidence.

# 111. Telemetry Service

TelemetryService owns:

- stream registration;
- schema metadata;
- storage references;
- sample statistics;
- retention state.

It does not become the authoritative storage engine for high-frequency samples.

# 112. Log Service

LogService owns:

- stream metadata;
- storage references;
- log statistics;
- retention lifecycle.

# 113. Video Service

VideoService owns:

- recording metadata;
- camera identity;
- codec;
- resolution;
- frame rate;
- storage reference;
- checksum;
- retention state.

# 114. Reconciliation Service

RunReconciliationService identifies:

- stale Runs;
- missing state history;
- orphaned telemetry;
- orphaned logs;
- orphaned video;
- stale agent assignments;
- Run/Job mismatch;
- Run/Attempt mismatch.

# 115. Execution Flow

The complete flow is:

    Booking CONFIRMED
          |
          v
         Job
          |
          v
       Attempt
          |
          v
      Run CREATED
          |
          v
      PREPARING
          |
          v
       STARTING
          |
          v
       RUNNING
          |
       +--+--+
       |     |
       v     v
    STOPPING TIMEOUT
       |
       v
    COMPLETED

# 116. Evidence Flow

    Run
     |
     +--> State History
     |
     +--> Events
     |
     +--> Telemetry Streams
     |
     +--> Log Streams
     |
     +--> Video Recordings
     |
     +--> Result

# 117. Live Execution Flow

    Lab Agent
       |
       +--> Runtime status
       |
       +--> Telemetry
       |
       +--> Logs
       |
       +--> Events
       |
       +--> Video
       |
       v
    Control Plane
       |
       v
    RaaS Studio

High-frequency data may bypass PostgreSQL and use streaming transports.

# 118. WebSocket Boundary

WebSocket is a delivery channel for live UI updates.

It is not authoritative for Run state.

If the WebSocket disconnects:

    Run continues independently.

The UI must recover by querying durable Run state.

# 119. Event Delivery

Run events should use at-least-once delivery.

Consumers must deduplicate by:

    event_id

Per-run sequence numbers may be used for gap detection.

# 120. Outbox Integration

Run lifecycle transitions should publish through a transactional outbox:

    BEGIN
      update runs
      insert run_state_history
      insert outbox event
    COMMIT

The publisher then delivers the event to:

- WebSocket layer;
- analytics;
- notification systems;
- monitoring;
- downstream services.

# 121. Consistency Model

Strong consistency is required for:

- Run lifecycle;
- Attempt linkage;
- tenant ownership;
- Lab Agent assignment;
- terminal state;
- Run identity.

Eventual consistency is acceptable for:

- dashboards;
- analytics;
- telemetry summaries;
- log indexing;
- video processing;
- derived metrics.

# 122. Concurrency Rules

Critical operations use row locks or optimistic concurrency.

Examples:

    SELECT *
    FROM execution.runs
    WHERE run_id = :run_id
    FOR UPDATE;

Only one worker may perform a terminal transition.

# 123. Terminal-State Rule

Once a Run reaches:

    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT
    ABORTED

no further lifecycle transition is permitted.

# 124. Agent Assignment Concurrency

The partial unique index prevents multiple active PRIMARY agents.

Agent replacement must be:

    disconnect old agent
    assign new agent
    connect new agent

The policy must not create two simultaneous primary execution authorities.

# 125. Resource Release

Run completion should trigger Resource release through the Lab/Booking
application services.

Run itself does not directly mutate Resource state.

The flow is:

    Run COMPLETED
         |
         v
    Execution Service
         |
         v
    Resource release request
         |
         v
    Lab domain

# 126. Booking Completion

Run completion may trigger Booking completion.

The Booking domain owns its state transition.

Run only provides execution evidence.

# 127. Credit Consumption

Run duration and resource usage may be supplied to the Credit service.

Conceptually:

    Run started
        |
        v
    usage measurement
        |
        v
    Run stopped
        |
        v
    final usage
        |
        v
    Credit consumption

Credit ledger mutation remains outside the Run schema.

# 128. Retention Model

Recommended retention:

| Data | Default Policy |
|---|---|
| Run | Long-term |
| Run state history | Long-term |
| Run events | Long-term or policy |
| Telemetry metadata | Long-term |
| Raw telemetry | Policy-based |
| Log metadata | Long-term |
| Raw logs | Policy-based |
| Video metadata | Long-term |
| Raw video | Policy-based |
| Agent assignments | Long-term |
| External evidence | Policy-based |

# 129. Large Object Retention

Large objects must have independent lifecycle controls.

Example:

    Run metadata       = long-term
    Video              = 30/90/365 days by policy
    Raw telemetry      = 30/90/365 days by policy
    Raw logs           = 30/90/365 days by policy

Exact commercial retention remains configurable.

# 130. Purging

Purging raw evidence must not delete the Run itself.

Instead:

    storage_reference
         |
         v
       PURGED

The Run continues to provide historical execution metadata.

# 131. Privacy

Run data may include:

- user identity;
- project identity;
- robot information;
- execution metadata;
- logs;
- video.

Video and logs may contain personal or sensitive information.

Retention and access controls must therefore be enforced.

# 132. Customer Access

Customers may access Runs only when they have authorization for the
corresponding Organization and Project.

Access to:

- logs;
- telemetry;
- video;
- results

must inherit Run authorization.

# 133. Administrative Access

Administrative access must be:

- authenticated;
- authorized;
- audited.

Break-glass access should be separately recorded.

# 134. Security

The Run schema must not store:

- passwords;
- access tokens;
- private keys;
- cloud credentials;
- robot authentication secrets.

Sensitive runtime configuration must reference a secret-management system.

# 135. Performance

Primary Run query patterns include:

    organization + status
    project + status
    job
    attempt
    resource + time
    lab agent + status
    created_at
    run_id

Indexes must follow measured query patterns.

# 136. Partitioning

Runs should not be partitioned initially unless measured workload requires it.

Potential future partitioning key:

    created_at

or:

    organization_id + time

Partitioning must not be introduced before observing:

- row volume;
- retention pressure;
- query performance;
- vacuum behavior;
- operational complexity.

# 137. Observability

Required metrics include:

- Runs created;
- Runs started;
- Runs completed;
- Runs failed;
- Runs cancelled;
- Runs timed out;
- Runs aborted;
- execution duration;
- startup latency;
- preparation latency;
- Lab Agent disconnects;
- telemetry stream failures;
- video failures;
- log failures.

# 138. Operational Alerts

Recommended alerts:

- Run stuck in PREPARING;
- Run stuck in STARTING;
- Run exceeds runtime limit;
- Run without active Lab Agent;
- Run with offline Resource;
- Run/Job state mismatch;
- Run/Attempt mismatch;
- high failure rate;
- high timeout rate;
- video pipeline failure;
- telemetry pipeline failure.

# 139. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate Run | Critical | Unique Attempt constraint |
| Lost Run transition | Critical | Transaction + history |
| Agent disconnect | High | Assignment + reconciliation |
| Runtime orphan | Critical | Runtime heartbeat + reconciliation |
| Wrong Resource | Critical | Immutable snapshot |
| Wrong Artifact | Critical | Artifact reference/checksum |
| Missing telemetry | High | Stream metadata + health monitoring |
| Video loss | Medium | External storage + metadata |
| Log loss | Medium | External log storage |
| Duplicate events | Medium | Event IDs |
| State divergence | Critical | Reconciliation |
| Tenant leakage | Critical | Organization checks |
| Excess database growth | High | External payload storage |
| Raw-data privacy exposure | Critical | Access control + retention |
| Infinite Run | Critical | Timeout + reconciliation |
| Unsafe stop | Critical | Local runtime/safety authority |

# 140. Open Questions

1. Final Job-to-Run cardinality policy.
2. Whether every retry Attempt creates a Run.
3. Final runtime heartbeat interval.
4. Final Run stale threshold.
5. Final Lab Agent reconnect policy.
6. Whether Agent reassignment is permitted during RUNNING.
7. Final telemetry backend.
8. Final log backend.
9. Final video backend.
10. Final live video transport.
11. Final video retention by subscription.
12. Final telemetry retention.
13. Final log retention.
14. Whether raw telemetry is downloadable.
15. Whether raw logs are downloadable.
16. Final event sequence semantics.
17. Final runtime identity format.
18. Final runtime health protocol.
19. Final Run cancellation semantics.
20. Final ABORTED semantics.
21. Final Resource fault behavior.
22. Final robot fault behavior.
23. Final result generation timing.
24. Final Run-to-Experiment integration.
25. Final cross-region Run execution policy.

# 141. Phase 0 Mapping

Phase 0 establishes:

- Run definition;
- Job/Run boundary;
- lifecycle;
- ownership;
- safety boundary;
- PostgreSQL authority;
- evidence-storage separation.

# 142. Phase 1 Mapping

Phase 1 implements:

- Run identity;
- Organization;
- Project;
- Job;
- Attempt references;
- repository;
- lifecycle.

# 143. Phase 2 Mapping

Phase 2 implements:

- Artifact snapshot;
- Platform snapshot;
- Platform Version snapshot;
- runtime identity;
- execution configuration.

# 144. Phase 3 Mapping

Phase 3 implements:

- Run creation;
- state history;
- Run reconciliation;
- idempotency;
- terminal-state enforcement.

# 145. Phase 4 Mapping

Phase 4 integrates:

- Booking;
- Resource;
- Lab;
- Credit usage evidence;
- execution authorization.

# 146. Phase 5 Mapping

Phase 5 implements:

- Lab Agent assignment;
- runtime startup;
- Run execution;
- telemetry metadata;
- logs;
- video;
- completion;
- failure.

# 147. Phase 6 Mapping

Phase 6 implements:

- physical robot execution;
- robot identity;
- Resource health;
- Lab Agent recovery;
- robot faults;
- safety-related abort handling.

# 148. Phase 7 Mapping

Phase 7 implements:

- Result integration;
- Experiment integration;
- execution analytics;
- searchable events;
- customer evidence;
- run history.

# 149. Phase 8 Mapping

Phase 8 implements:

- retention;
- privacy;
- large-object lifecycle;
- production observability;
- capacity;
- DR;
- reconciliation;
- performance optimization;
- production acceptance.

# 150. Acceptance Criteria — Run Core

- [ ] `execution` schema exists.
- [ ] `runs` table exists.
- [ ] Run ID uses UUIDv7.
- [ ] Organization ID is mandatory.
- [ ] Project ID is mandatory.
- [ ] Job ID is mandatory.
- [ ] Attempt ID is mandatory.
- [ ] Booking ID is mandatory.
- [ ] Artifact ID is mandatory.
- [ ] Platform ID is mandatory.
- [ ] Platform Version ID is mandatory.
- [ ] Resource ID is mandatory.
- [ ] Run key is unique within Project.
- [ ] Runtime identity is captured.
- [ ] Architecture is captured.
- [ ] Entry point is captured.
- [ ] Runtime limit is captured.
- [ ] Audit columns exist.

# 151. Acceptance Criteria — Lifecycle

- [ ] CREATED exists.
- [ ] PREPARING exists.
- [ ] STARTING exists.
- [ ] RUNNING exists.
- [ ] STOPPING exists.
- [ ] COMPLETED exists.
- [ ] FAILED exists.
- [ ] CANCELLED exists.
- [ ] TIMEOUT exists.
- [ ] ABORTED exists.
- [ ] Valid transitions are enforced.
- [ ] Invalid transitions are rejected.
- [ ] Terminal states cannot transition.
- [ ] State history is created for every transition.
- [ ] Completion timing is validated.

# 152. Acceptance Criteria — State History

- [ ] State history table exists.
- [ ] Previous status is recorded.
- [ ] New status is recorded.
- [ ] Actor type is recorded.
- [ ] Actor identity is supported.
- [ ] Reason code is supported.
- [ ] Reason text is supported.
- [ ] Attempt evidence is available through Run.
- [ ] History is append-oriented.
- [ ] History is tenant-scoped.

# 153. Acceptance Criteria — Lab Agent

- [ ] Agent assignment table exists.
- [ ] Lab Agent identity is captured.
- [ ] Primary assignment is supported.
- [ ] Secondary assignment is supported.
- [ ] Observer assignment is supported.
- [ ] Assignment connection time is captured.
- [ ] Disconnect time is captured.
- [ ] Disconnect reason is captured.
- [ ] Only one active primary agent is permitted.
- [ ] Agent disconnect is observable.
- [ ] Agent reassignment is auditable.

# 154. Acceptance Criteria — Telemetry

- [ ] Telemetry stream table exists.
- [ ] Stream key is unique within Run.
- [ ] Stream type is recorded.
- [ ] Source is recorded.
- [ ] Schema version is recorded.
- [ ] Sampling rate is supported.
- [ ] Unit is supported.
- [ ] Storage reference is supported.
- [ ] First sample time is supported.
- [ ] Last sample time is supported.
- [ ] Sample count is maintained.
- [ ] Stream lifecycle is supported.
- [ ] Raw telemetry is not required to reside in PostgreSQL.

# 155. Acceptance Criteria — Logs

- [ ] Log stream table exists.
- [ ] Stream key is unique within Run.
- [ ] Source is recorded.
- [ ] Format is recorded.
- [ ] Storage reference is supported.
- [ ] First log time is recorded.
- [ ] Last log time is recorded.
- [ ] Line count is maintained.
- [ ] Byte count is maintained.
- [ ] Log lifecycle is supported.
- [ ] Raw logs are independently retained.

# 156. Acceptance Criteria — Video

- [ ] Video recording table exists.
- [ ] Recording references Run.
- [ ] Camera identity is recorded.
- [ ] Recording type is constrained.
- [ ] Container format is recorded.
- [ ] Codec is supported.
- [ ] Resolution is supported.
- [ ] Frame rate is supported.
- [ ] Start/end time is supported.
- [ ] Duration is supported.
- [ ] Byte size is supported.
- [ ] Checksum is supported.
- [ ] Storage reference is mandatory.
- [ ] Recording lifecycle is supported.
- [ ] Raw video is not stored in PostgreSQL.

# 157. Acceptance Criteria — Events

- [ ] Run event table exists.
- [ ] Event type is recorded.
- [ ] Severity is constrained.
- [ ] Source is recorded.
- [ ] Event timestamp is recorded.
- [ ] Sequence number is supported.
- [ ] Duplicate sequence numbers are prevented.
- [ ] Correlation ID is supported.
- [ ] External payload references are supported.
- [ ] Metadata is bounded JSONB.
- [ ] Event retention is documented.

# 158. Acceptance Criteria — Runtime Evidence

- [ ] Runtime name is captured.
- [ ] Runtime version is captured.
- [ ] SDK version is captured.
- [ ] Architecture is captured.
- [ ] OS name is captured.
- [ ] OS version is captured.
- [ ] Entry point is captured.
- [ ] Exit code is captured where available.
- [ ] Termination signal is captured where available.
- [ ] Failure code is supported.
- [ ] Failure message is customer-safe.

# 159. Acceptance Criteria — Cross-Domain Relations

- [ ] Run references Job.
- [ ] Run references Attempt.
- [ ] Run references Booking.
- [ ] Run references Artifact.
- [ ] Run references Platform.
- [ ] Run references Platform Version.
- [ ] Run references Resource.
- [ ] Run may reference Robot.
- [ ] Run may reference Lab.
- [ ] Run may reference Lab Agent.
- [ ] Run does not directly own Resource state.
- [ ] Run does not directly mutate Booking.
- [ ] Run does not directly mutate Credit ledger.
- [ ] Run does not own Artifact contents.

# 160. Acceptance Criteria — Tenancy

- [ ] Run contains Organization ID.
- [ ] State history contains Organization ID.
- [ ] Events contain Organization ID.
- [ ] Telemetry streams contain Organization ID.
- [ ] Log streams contain Organization ID.
- [ ] Video recordings contain Organization ID.
- [ ] Agent assignments contain Organization ID.
- [ ] Cross-tenant Run access is rejected.
- [ ] Cross-tenant evidence access is rejected.
- [ ] Tenant isolation tests pass.

# 161. Acceptance Criteria — Concurrency

- [ ] Run creation is idempotent.
- [ ] Duplicate Attempt-to-Run creation is prevented.
- [ ] Concurrent state transitions are serialized.
- [ ] Concurrent completion is safe.
- [ ] Concurrent cancellation is safe.
- [ ] Concurrent timeout handling is safe.
- [ ] Concurrent agent assignment is safe.
- [ ] Duplicate events are deduplicable.
- [ ] Reconciliation detects races.

# 162. Acceptance Criteria — Reconciliation

- [ ] Run without Job is detectable.
- [ ] Run without valid Attempt is detectable.
- [ ] Job without expected Run is detectable.
- [ ] Run without Agent is detectable when Agent is required.
- [ ] Stale PREPARING Runs are detectable.
- [ ] Stale STARTING Runs are detectable.
- [ ] Stale RUNNING Runs are detectable.
- [ ] Agent disconnects are reconciled.
- [ ] Resource faults are reconciled.
- [ ] Runtime orphan conditions are detectable.
- [ ] Terminal-state divergence is detectable.

# 163. Acceptance Criteria — Retention

- [ ] Run metadata has long-term retention.
- [ ] State history has long-term retention.
- [ ] Event retention is defined.
- [ ] Telemetry metadata retention is defined.
- [ ] Raw telemetry retention is independently defined.
- [ ] Log retention is independently defined.
- [ ] Video retention is independently defined.
- [ ] Purging raw evidence does not delete Run metadata.
- [ ] Purged objects remain identifiable as purged.

# 164. Acceptance Criteria — Security

- [ ] Authentication is required.
- [ ] Organization authorization is enforced.
- [ ] Project authorization is enforced.
- [ ] Evidence access inherits Run authorization.
- [ ] Administrative access is audited.
- [ ] Secrets cannot be stored in Run metadata.
- [ ] Secrets cannot be stored in telemetry metadata.
- [ ] Secrets cannot be stored in log metadata.
- [ ] Secrets cannot be stored in video metadata.

# 165. Acceptance Criteria — Safety

- [ ] PostgreSQL is not treated as a safety controller.
- [ ] Lab Agent remains local execution boundary.
- [ ] Runtime remains local execution authority.
- [ ] Physical E-stop remains local.
- [ ] Cloud failure cannot create unsafe robot restart.
- [ ] Robot faults can terminate or abort execution.
- [ ] Safety-related termination is auditable.
- [ ] Run timeout is not a substitute for physical safety.

# 166. Acceptance Criteria — Performance

- [ ] Organization/status queries are indexed.
- [ ] Project/status queries are indexed.
- [ ] Job queries are indexed.
- [ ] Attempt queries are indexed.
- [ ] Resource/time queries are indexed.
- [ ] Agent/status queries are indexed.
- [ ] Event queries are indexed.
- [ ] Evidence streams are indexed.
- [ ] Large payloads are not stored in PostgreSQL.
- [ ] Partitioning is deferred until measured need.

# 167. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Run architecture accepted.
- [ ] Job/Run boundary accepted.
- [ ] lifecycle accepted.
- [ ] safety boundary accepted.

Phase 1:

- [ ] Run core schema implemented.
- [ ] tenant ownership implemented.
- [ ] lifecycle implemented.

Phase 2:

- [ ] execution snapshots implemented.
- [ ] Artifact integration implemented.
- [ ] Platform integration implemented.

Phase 3:

- [ ] Run state history implemented.
- [ ] reconciliation implemented.
- [ ] idempotency implemented.

Phase 4:

- [ ] Booking integration implemented.
- [ ] Resource integration implemented.
- [ ] Lab integration implemented.

Phase 5:

- [ ] Lab Agent assignment implemented.
- [ ] runtime execution implemented.
- [ ] telemetry metadata implemented.
- [ ] log metadata implemented.
- [ ] video metadata implemented.
- [ ] completion/failure implemented.

Phase 6:

- [ ] physical robot execution implemented.
- [ ] robot faults implemented.
- [ ] Agent recovery implemented.
- [ ] safety review completed.

Phase 7:

- [ ] Results integration implemented.
- [ ] Experiment integration implemented.
- [ ] execution analytics implemented.

Phase 8:

- [ ] retention implemented.
- [ ] privacy controls implemented.
- [ ] DR validated.
- [ ] performance validated.
- [ ] observability validated.
- [ ] production acceptance completed.

# 168. Final Invariants

The following invariants are mandatory:

1. Every Run belongs to exactly one Organization.
2. Every Run belongs to exactly one Project.
3. Every Run references exactly one Job.
4. Every Run references exactly one Attempt.
5. Every Run references exactly one Booking.
6. Every Run identifies the Artifact executed.
7. Every Run identifies Platform and Platform Version.
8. Every physical Run identifies the execution Resource.
9. Every Run preserves execution-time runtime identity.
10. Every Run has a controlled lifecycle.
11. Every lifecycle transition is recorded.
12. Terminal Runs cannot transition again.
13. An Attempt cannot create duplicate Runs.
14. Lab Agent assignment is explicitly recorded.
15. Only one active PRIMARY Lab Agent exists per Run.
16. Telemetry payloads are not required to reside in PostgreSQL.
17. Log payloads are not required to reside in PostgreSQL.
18. Video payloads are not stored in PostgreSQL.
19. Evidence metadata remains linked to the Run.
20. High-volume evidence uses independent retention.
21. Raw evidence may be purged without deleting Run history.
22. Run state remains authoritative in PostgreSQL.
23. WebSocket delivery is not authoritative.
24. Runtime communication is not authoritative business state.
25. Cross-domain writes use owning application services.
26. Credit ledger remains owned by Credit.
27. Booking state remains owned by Booking.
28. Resource state remains owned by Lab.
29. Artifact content remains owned by Artifact.
30. Physical safety remains local to the robot/runtime.
31. Reconciliation can detect interrupted execution.
32. Secrets are not stored in Run metadata.
33. Historical execution provenance remains queryable.
34. Run completion is idempotent.
35. Run cancellation is idempotent.
36. Run timeout is idempotent.
37. Run failure is auditable.
38. Evidence access is tenant-authorized.
39. Retention policy is explicit.
40. The schema supports production-scale remote robot execution.

# 169. Final Architecture Statement

> **A Kritva RaaS Run is the authoritative historical record of an actual
> execution instance created from a Job Attempt.**
>
> **The Run records what actually executed, on which Platform, Platform
> Version, Resource, Robot, Lab and Lab Agent, using which runtime and SDK,
> and provides the durable metadata required to locate telemetry, logs,
> events, video and results.**
>
> **The Run domain does not replace the Job, Booking, Artifact, Credit or Lab
> domains. Job owns orchestration; Booking owns scheduling authorization;
> Artifact owns executable content; Lab owns physical resources; Credit owns
> financial state; Run owns runtime execution evidence.**
>
> The production execution chain is:
>
>     Confirmed Booking
>          |
>          v
>         Job
>          |
>          v
>       Attempt
>          |
>          v
>       Run CREATED
>          |
>          v
>       PREPARING
>          |
>          v
>       STARTING
>          |
>          v
>       RUNNING
>          |
>       +--+------------------+
>       |                     |
>       v                     v
>    STOPPING              TIMEOUT
>       |
>       v
>    COMPLETED
>       |
>       +--> Telemetry
>       +--> Logs
>       +--> Events
>       +--> Video
>       +--> Results
>
> **PostgreSQL remains authoritative for durable Run state and execution
> provenance. High-volume telemetry, logs and video are represented through
> metadata and provider-neutral storage references. The local Lab Agent and
> Kritva Runtime remain authoritative for actual robot execution and safety.**
>
> **This schema therefore provides the execution-history foundation required
> for Kritva RaaS to deliver reproducible, auditable and recoverable remote
> execution across simulated and physical robotic platforms.**
