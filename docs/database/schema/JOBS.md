# Kritva RaaS Jobs Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Jobs Schema |
| Path | `docs/database/schema/JOBS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Logical Schema | `execution` |
| Primary Domain Owner | Execution / Job Module |
| Tenant Boundary | Organization |
| Identifier Strategy | UUIDv7 |
| Time Standard | UTC `timestamptz` |
| Execution Authority | Job / Run services |
| Scheduling Authority | Booking domain |
| Artifact Authority | Artifact domain |
| Resource Authority | Lab domain |
| Financial Authority | Credit domain |
| Phase Coverage | Phase 0–Phase 8 |

# 2. Purpose

This document defines the production-grade PostgreSQL schema for Kritva RaaS
Jobs and remote execution orchestration.

A Job is the authoritative execution request created from a valid Booking and
an eligible Artifact.

The Job domain coordinates:

- execution intent;
- Booking linkage;
- Project and Organization ownership;
- Artifact selection;
- Platform and Platform Version;
- Resource allocation;
- execution queueing;
- scheduling;
- execution attempts;
- deployment;
- startup;
- runtime execution;
- stopping;
- completion;
- failure;
- retry;
- state history;
- reconciliation;
- operational evidence.

The Job domain is the bridge between:

    Booking + Artifact
             |
             v
            Job
             |
       +-----+-----+
       |           |
       v           v
     Queue      Attempt
                   |
                   v
               Deployment
                   |
                   v
                  Run

# 3. Scope

This document defines:

- Job identity;
- Job ownership;
- Booking linkage;
- Artifact linkage;
- requested Platform;
- execution Resource;
- Job lifecycle;
- queue records;
- execution attempts;
- deployment records;
- failure information;
- Job state history;
- retry semantics;
- idempotency;
- concurrency;
- execution interfaces;
- transaction boundaries;
- reconciliation;
- retention;
- audit;
- tenancy;
- Phase 0–Phase 8 implementation mapping.

# 4. Non-Goals

This document does not define:

- source-code storage;
- Artifact binary storage;
- Artifact manifest schema;
- Booking scheduling policy;
- Credit ledger implementation;
- Platform catalog;
- Resource operational state;
- Robot hardware identity;
- Run result schema;
- telemetry payload storage;
- video storage;
- physical emergency-stop behavior.

Those concerns remain owned by their respective domains.

# 5. Goals

The Job schema must provide:

1. deterministic Job identity;
2. Organization tenancy;
3. Project provenance;
4. Booking provenance;
5. Artifact provenance;
6. immutable execution intent;
7. queue state;
8. retryable attempts;
9. deployment evidence;
10. failure classification;
11. state transition history;
12. execution reconciliation;
13. idempotency;
14. operational auditability;
15. historical reproducibility;
16. strong concurrency protection.

# 6. Job Definition

A Job is an authorized request to execute one Artifact on an eligible robotic
or computational Resource under the constraints of a Booking.

Conceptually:

    Organization
         |
      Project
         |
      Booking
         |
       Job
      / | \
     /  |  \
    v   v   v
 Artifact Platform Resource
         |
         v
       Run

# 7. Job versus Run

A Job is an execution orchestration object.

A Run is an execution instance and historical runtime record.

The intended relationship is:

    Job
      |
      +--> Run 1
      |
      +--> Run 2
      |
      +--> Run N

However, the MVP normally creates one authoritative Run for one successful
execution attempt.

Retries may create additional Attempts without necessarily creating multiple
customer-visible Runs.

The final retry-to-Run policy is explicitly controlled by the Execution
service.

# 8. Job Ownership

Every customer Job belongs to exactly one Organization.

The normal ownership chain is:

    Organization
         |
         v
      Project
         |
         v
      Booking
         |
         v
        Job
         |
         v
       Run

Organization is the tenant boundary.

# 9. Job Lifecycle

Recommended Job state machine:

    CREATED
       |
       v
    QUEUED
       |
       v
    VALIDATING
       |
       v
    ALLOCATING
       |
       v
    DEPLOYING
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

Failure and cancellation paths:

    CREATED    -> CANCELLED
    QUEUED     -> CANCELLED
    VALIDATING -> FAILED
    ALLOCATING -> FAILED
    DEPLOYING  -> FAILED
    STARTING   -> FAILED
    RUNNING    -> FAILED
    STOPPING   -> FAILED
    QUEUED     -> TIMEOUT
    RUNNING    -> TIMEOUT

Retry path:

    FAILED
       |
       v
    QUEUED

# 10. Job Status Definitions

| Status | Meaning |
|---|---|
| CREATED | Job created but not yet queued |
| QUEUED | Eligible and waiting for execution |
| VALIDATING | Artifact/runtime/policy validation |
| ALLOCATING | Resource allocation in progress |
| DEPLOYING | Artifact deployment in progress |
| STARTING | Runtime startup in progress |
| RUNNING | Application actively executing |
| STOPPING | Execution shutdown in progress |
| COMPLETED | Execution completed successfully |
| FAILED | Execution failed |
| CANCELLED | Job explicitly cancelled |
| TIMEOUT | Job exceeded configured execution deadline |

# 11. Job Table

`execution.jobs` is the aggregate root for remote execution orchestration.

It contains the immutable execution intent and current lifecycle state.

# 12. `execution.jobs` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| job_id | uuid | No | UUIDv7 | Job ID |
| organization_id | uuid | No | None | Tenant |
| project_id | uuid | No | None | Project |
| booking_id | uuid | No | None | Booking |
| artifact_id | uuid | No | None | Artifact |
| platform_id | uuid | No | None | Platform |
| platform_version_id | uuid | No | None | Platform Version |
| platform_configuration_id | uuid | Yes | NULL | Configuration |
| resource_id | uuid | Yes | NULL | Allocated Resource |
| run_id | uuid | Yes | NULL | Authoritative Run |
| job_key | varchar(100) | No | None | Customer-visible key |
| status | job_status | No | `CREATED` | Lifecycle |
| priority | smallint | No | `100` | Scheduling priority |
| requested_start_at | timestamptz | Yes | NULL | Requested execution time |
| deadline_at | timestamptz | Yes | NULL | Execution deadline |
| max_runtime_seconds | integer | No | None | Runtime limit |
| attempt_limit | smallint | No | `1` | Maximum attempts |
| attempt_count | smallint | No | `0` | Attempts started |
| idempotency_key | varchar(255) | No | None | Retry key |
| entrypoint | varchar(500) | No | None | Artifact entrypoint |
| environment | jsonb | No | `'{}'` | Bounded runtime config |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Last update |
| created_by | uuid | No | None | Creator |
| updated_by | uuid | Yes | NULL | Last updater |
| queued_at | timestamptz | Yes | NULL | Queue time |
| started_at | timestamptz | Yes | NULL | Execution start |
| completed_at | timestamptz | Yes | NULL | Completion |
| cancelled_at | timestamptz | Yes | NULL | Cancellation |

# 13. Job DDL

    CREATE SCHEMA IF NOT EXISTS execution;

    CREATE TYPE execution.job_status AS ENUM (
        'CREATED',
        'QUEUED',
        'VALIDATING',
        'ALLOCATING',
        'DEPLOYING',
        'STARTING',
        'RUNNING',
        'STOPPING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'TIMEOUT'
    );

    CREATE TABLE execution.jobs (
        job_id UUID PRIMARY KEY,
        organization_id UUID NOT NULL,
        project_id UUID NOT NULL,
        booking_id UUID NOT NULL,
        artifact_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        platform_version_id UUID NOT NULL,
        platform_configuration_id UUID NULL,
        resource_id UUID NULL,
        run_id UUID NULL,
        job_key VARCHAR(100) NOT NULL,
        status execution.job_status
            NOT NULL DEFAULT 'CREATED',
        priority SMALLINT NOT NULL DEFAULT 100,
        requested_start_at TIMESTAMPTZ NULL,
        deadline_at TIMESTAMPTZ NULL,
        max_runtime_seconds INTEGER NOT NULL,
        attempt_limit SMALLINT NOT NULL DEFAULT 1,
        attempt_count SMALLINT NOT NULL DEFAULT 0,
        idempotency_key VARCHAR(255) NOT NULL,
        entrypoint VARCHAR(500) NOT NULL,
        environment JSONB NOT NULL DEFAULT '{}'::jsonb,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NOT NULL,
        updated_by UUID NULL,
        queued_at TIMESTAMPTZ NULL,
        started_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        cancelled_at TIMESTAMPTZ NULL,
        CONSTRAINT jobs_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_project_fk
            FOREIGN KEY (project_id)
            REFERENCES project.projects(project_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES booking.bookings(booking_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_artifact_fk
            FOREIGN KEY (artifact_id)
            REFERENCES artifact.artifacts(artifact_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_configuration_fk
            FOREIGN KEY (platform_configuration_id)
            REFERENCES platform.platform_configurations(platform_configuration_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_creator_fk
            FOREIGN KEY (created_by)
            REFERENCES identity.users(user_id)
            ON DELETE RESTRICT,
        CONSTRAINT jobs_updater_fk
            FOREIGN KEY (updated_by)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT jobs_key_unique
            UNIQUE (project_id, job_key),
        CONSTRAINT jobs_idempotency_unique
            UNIQUE (organization_id, idempotency_key),
        CONSTRAINT jobs_priority_check
            CHECK (priority BETWEEN 0 AND 1000),
        CONSTRAINT jobs_runtime_check
            CHECK (max_runtime_seconds > 0),
        CONSTRAINT jobs_attempt_limit_check
            CHECK (attempt_limit > 0),
        CONSTRAINT jobs_attempt_count_check
            CHECK (attempt_count >= 0),
        CONSTRAINT jobs_environment_check
            CHECK (jsonb_typeof(environment) = 'object'),
        CONSTRAINT jobs_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 14. Job Indexes

    CREATE INDEX jobs_org_status_idx
        ON execution.jobs(organization_id, status);

    CREATE INDEX jobs_project_status_idx
        ON execution.jobs(project_id, status);

    CREATE INDEX jobs_booking_idx
        ON execution.jobs(booking_id);

    CREATE INDEX jobs_artifact_idx
        ON execution.jobs(artifact_id);

    CREATE INDEX jobs_resource_status_idx
        ON execution.jobs(resource_id, status);

    CREATE INDEX jobs_queue_idx
        ON execution.jobs(status, priority, requested_start_at);

    CREATE INDEX jobs_created_idx
        ON execution.jobs(created_at);

# 15. Job Tenant Integrity

The Job Organization must match:

    Project Organization
    Booking Organization
    Artifact ownership context

The application service must validate these relationships before Job creation.

Composite tenant foreign keys should be introduced where the referenced
schemas provide compatible composite keys.

# 16. Job Execution Intent

At creation, the Job records the execution intent:

- Artifact;
- Platform;
- Platform Version;
- configuration;
- entrypoint;
- runtime limit;
- attempt policy;
- requested time;
- Booking.

After creation, changing execution-critical fields is prohibited once the Job
enters `QUEUED`.

This preserves reproducibility.

# 17. Immutable Execution Intent

The following fields become immutable after `CREATED`:

- artifact_id;
- platform_id;
- platform_version_id;
- platform_configuration_id;
- booking_id;
- entrypoint;
- max_runtime_seconds;
- attempt_limit;
- execution environment.

Changes require cancellation and creation of a new Job.

# 18. Job State History

Every Job state transition must be recorded.

# 19. `execution.job_state_history` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| state_history_id | uuid | No | UUIDv7 | History ID |
| job_id | uuid | No | None | Job |
| organization_id | uuid | No | None | Tenant |
| from_status | job_status | Yes | NULL | Previous status |
| to_status | job_status | No | None | New status |
| reason_code | varchar(64) | Yes | NULL | Reason |
| reason | varchar(2000) | Yes | NULL | Explanation |
| actor_type | job_actor_type | No | `SYSTEM` | Actor |
| actor_id | uuid | Yes | NULL | Actor |
| attempt_id | uuid | Yes | NULL | Attempt |
| created_at | timestamptz | No | `now()` | Transition time |
| metadata | jsonb | No | `'{}'` | Evidence |

# 20. Job Actor Type

    CREATE TYPE execution.job_actor_type AS ENUM (
        'USER',
        'SYSTEM',
        'ADMIN',
        'LAB_AGENT'
    );

# 21. State History DDL

    CREATE TABLE execution.job_state_history (
        state_history_id UUID PRIMARY KEY,
        job_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        from_status execution.job_status NULL,
        to_status execution.job_status NOT NULL,
        reason_code VARCHAR(64) NULL,
        reason VARCHAR(2000) NULL,
        actor_type execution.job_actor_type
            NOT NULL DEFAULT 'SYSTEM',
        actor_id UUID NULL,
        attempt_id UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT job_history_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT job_history_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT job_history_actor_fk
            FOREIGN KEY (actor_id)
            REFERENCES identity.users(user_id)
            ON DELETE SET NULL,
        CONSTRAINT job_history_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX job_history_job_time_idx
        ON execution.job_state_history(job_id, created_at);

    CREATE INDEX job_history_org_time_idx
        ON execution.job_state_history(organization_id, created_at);

# 22. Queue Records

The queue record represents the durable scheduling work item for a Job.

The database queue is authoritative for durable work state, while an external
queue or worker transport may be used for delivery.

# 23. Queue State

    READY
      |
      v
    CLAIMED
      |
      v
    DISPATCHED
      |
      v
    ACKNOWLEDGED
      |
      v
    COMPLETED

Failure:

    CLAIMED -> READY
    CLAIMED -> DEAD
    DISPATCHED -> READY
    DISPATCHED -> DEAD

# 24. `execution.job_queue` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| queue_id | uuid | No | UUIDv7 | Queue record |
| job_id | uuid | No | None | Job |
| organization_id | uuid | No | None | Tenant |
| queue_name | varchar(100) | No | None | Logical queue |
| priority | smallint | No | `100` | Priority |
| state | queue_state | No | `READY` | Queue state |
| available_at | timestamptz | No | `now()` | Earliest delivery |
| claimed_at | timestamptz | Yes | NULL | Claim time |
| claimed_by | varchar(255) | Yes | NULL | Worker |
| lease_until | timestamptz | Yes | NULL | Lease expiry |
| dispatched_at | timestamptz | Yes | NULL | Dispatch time |
| completed_at | timestamptz | Yes | NULL | Completion |
| retry_count | integer | No | `0` | Queue retries |
| last_error | varchar(2000) | Yes | NULL | Last queue error |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 25. Queue DDL

    CREATE TYPE execution.queue_state AS ENUM (
        'READY',
        'CLAIMED',
        'DISPATCHED',
        'ACKNOWLEDGED',
        'COMPLETED',
        'DEAD'
    );

    CREATE TABLE execution.job_queue (
        queue_id UUID PRIMARY KEY,
        job_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        queue_name VARCHAR(100) NOT NULL,
        priority SMALLINT NOT NULL DEFAULT 100,
        state execution.queue_state
            NOT NULL DEFAULT 'READY',
        available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        claimed_at TIMESTAMPTZ NULL,
        claimed_by VARCHAR(255) NULL,
        lease_until TIMESTAMPTZ NULL,
        dispatched_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        retry_count INTEGER NOT NULL DEFAULT 0,
        last_error VARCHAR(2000) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT queue_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT queue_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT queue_priority_check
            CHECK (priority BETWEEN 0 AND 1000),
        CONSTRAINT queue_retry_check
            CHECK (retry_count >= 0)
    );

    CREATE UNIQUE INDEX queue_active_job_unique
        ON execution.job_queue(job_id)
        WHERE state IN (
            'READY',
            'CLAIMED',
            'DISPATCHED',
            'ACKNOWLEDGED'
        );

    CREATE INDEX queue_dispatch_idx
        ON execution.job_queue(
            state,
            priority,
            available_at
        );

    CREATE INDEX queue_lease_idx
        ON execution.job_queue(lease_until)
        WHERE state IN ('CLAIMED', 'DISPATCHED');

# 26. Queue Lease

Queue workers must use a lease.

A lease prevents indefinite ownership when a worker fails.

Conceptual:

    READY
      |
      v
    CLAIMED
      |
      +--> lease_until
      |
      +--> worker failure
               |
               v
            reclaim
               |
               v
             READY

# 27. Queue Claiming

Workers should claim work using transactional row locking.

Conceptual SQL:

    SELECT queue_id
    FROM execution.job_queue
    WHERE state = 'READY'
      AND available_at <= now()
    ORDER BY priority DESC, available_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

This avoids multiple workers claiming the same queue record.

# 28. Queue Delivery

The durable sequence is:

    Job
      |
      v
    Queue Record
      |
      v
    Worker Claim
      |
      v
    Dispatch
      |
      v
    Lab Agent

External queues may accelerate delivery, but PostgreSQL remains the durable
business-state authority.

# 29. Attempts

An Attempt represents one execution attempt against a Job.

Attempts provide retry and failure evidence without mutating the historical
record of previous attempts.

# 30. Attempt Lifecycle

    CREATED
       |
       v
    VALIDATING
       |
       v
    DEPLOYING
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
    SUCCEEDED

Failure:

    any active state -> FAILED
    any active state -> CANCELLED
    any active state -> TIMEOUT

# 31. `execution.job_attempts` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| attempt_id | uuid | No | UUIDv7 | Attempt |
| job_id | uuid | No | None | Job |
| organization_id | uuid | No | None | Tenant |
| attempt_number | smallint | No | None | Sequence |
| status | attempt_status | No | `CREATED` | Attempt lifecycle |
| resource_id | uuid | Yes | NULL | Resource |
| lab_agent_id | uuid | Yes | NULL | Lab Agent |
| run_id | uuid | Yes | NULL | Run |
| started_at | timestamptz | Yes | NULL | Start |
| ended_at | timestamptz | Yes | NULL | End |
| timeout_at | timestamptz | Yes | NULL | Timeout |
| exit_code | integer | Yes | NULL | Process exit |
| termination_signal | varchar(32) | Yes | NULL | Signal |
| retryable | boolean | No | `false` | Retry eligibility |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| metadata | jsonb | No | `'{}'` | Evidence |

# 32. Attempt Status

    CREATE TYPE execution.attempt_status AS ENUM (
        'CREATED',
        'VALIDATING',
        'DEPLOYING',
        'STARTING',
        'RUNNING',
        'STOPPING',
        'SUCCEEDED',
        'FAILED',
        'CANCELLED',
        'TIMEOUT'
    );

# 33. Attempt DDL

    CREATE TABLE execution.job_attempts (
        attempt_id UUID PRIMARY KEY,
        job_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        attempt_number SMALLINT NOT NULL,
        status execution.attempt_status
            NOT NULL DEFAULT 'CREATED',
        resource_id UUID NULL,
        lab_agent_id UUID NULL,
        run_id UUID NULL,
        started_at TIMESTAMPTZ NULL,
        ended_at TIMESTAMPTZ NULL,
        timeout_at TIMESTAMPTZ NULL,
        exit_code INTEGER NULL,
        termination_signal VARCHAR(32) NULL,
        retryable BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT attempts_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT attempts_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT attempts_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT attempts_agent_fk
            FOREIGN KEY (lab_agent_id)
            REFERENCES lab.lab_agents(lab_agent_id)
            ON DELETE RESTRICT,
        CONSTRAINT attempts_number_check
            CHECK (attempt_number > 0),
        CONSTRAINT attempts_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE UNIQUE INDEX attempts_job_number_unique
        ON execution.job_attempts(job_id, attempt_number);

    CREATE INDEX attempts_job_status_idx
        ON execution.job_attempts(job_id, status);

    CREATE INDEX attempts_org_time_idx
        ON execution.job_attempts(organization_id, created_at);

# 34. Attempt Number

Attempt numbers are one-based:

    Attempt 1
    Attempt 2
    Attempt 3

The database enforces uniqueness per Job.

# 35. Deployment Records

A Deployment records the transfer and installation of an Artifact onto the
execution Resource.

Deployment evidence is separate from Job state because deployment may fail
independently of scheduling and runtime execution.

# 36. Deployment Lifecycle

    CREATED
       |
       v
    VALIDATING
       |
       v
    TRANSFERRING
       |
       v
    INSTALLING
       |
       v
    VERIFIED

Failure:

    VALIDATING  -> FAILED
    TRANSFERRING -> FAILED
    INSTALLING -> FAILED

Cancellation:

    TRANSFERRING -> CANCELLED
    INSTALLING -> CANCELLED

# 37. `execution.job_deployments` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| deployment_id | uuid | No | UUIDv7 | Deployment |
| job_id | uuid | No | None | Job |
| attempt_id | uuid | No | None | Attempt |
| organization_id | uuid | No | None | Tenant |
| artifact_id | uuid | No | None | Artifact |
| resource_id | uuid | No | None | Target |
| lab_agent_id | uuid | Yes | NULL | Agent |
| status | deployment_status | No | `CREATED` | Lifecycle |
| artifact_version | varchar(100) | No | None | Artifact version |
| artifact_checksum | varchar(128) | No | None | Checksum |
| remote_path | varchar(1000) | Yes | NULL | Remote path |
| started_at | timestamptz | Yes | NULL | Deployment start |
| completed_at | timestamptz | Yes | NULL | Deployment end |
| verification_checksum | varchar(128) | Yes | NULL | Remote checksum |
| error_code | varchar(64) | Yes | NULL | Error |
| error_message | varchar(2000) | Yes | NULL | Error detail |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| metadata | jsonb | No | `'{}'` | Evidence |

# 38. Deployment Status

    CREATE TYPE execution.deployment_status AS ENUM (
        'CREATED',
        'VALIDATING',
        'TRANSFERRING',
        'INSTALLING',
        'VERIFIED',
        'FAILED',
        'CANCELLED'
    );

# 39. Deployment DDL

    CREATE TABLE execution.job_deployments (
        deployment_id UUID PRIMARY KEY,
        job_id UUID NOT NULL,
        attempt_id UUID NOT NULL,
        organization_id UUID NOT NULL,
        artifact_id UUID NOT NULL,
        resource_id UUID NOT NULL,
        lab_agent_id UUID NULL,
        status execution.deployment_status
            NOT NULL DEFAULT 'CREATED',
        artifact_version VARCHAR(100) NOT NULL,
        artifact_checksum VARCHAR(128) NOT NULL,
        remote_path VARCHAR(1000) NULL,
        started_at TIMESTAMPTZ NULL,
        completed_at TIMESTAMPTZ NULL,
        verification_checksum VARCHAR(128) NULL,
        error_code VARCHAR(64) NULL,
        error_message VARCHAR(2000) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT deployments_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT deployments_attempt_fk
            FOREIGN KEY (attempt_id)
            REFERENCES execution.job_attempts(attempt_id)
            ON DELETE RESTRICT,
        CONSTRAINT deployments_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT deployments_artifact_fk
            FOREIGN KEY (artifact_id)
            REFERENCES artifact.artifacts(artifact_id)
            ON DELETE RESTRICT,
        CONSTRAINT deployments_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT deployments_agent_fk
            FOREIGN KEY (lab_agent_id)
            REFERENCES lab.lab_agents(lab_agent_id)
            ON DELETE RESTRICT,
        CONSTRAINT deployments_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE UNIQUE INDEX deployments_attempt_unique
        ON execution.job_deployments(attempt_id);

    CREATE INDEX deployments_job_idx
        ON execution.job_deployments(job_id);

    CREATE INDEX deployments_resource_time_idx
        ON execution.job_deployments(
            resource_id,
            created_at
        );

# 40. Deployment Integrity

Deployment must reference the same:

    Job
    Attempt
    Artifact
    Organization

The application service must verify all four relationships.

# 41. Failure Information

Failure information is separated from Job status because one Job may have
multiple failures across attempts.

# 42. Failure Classification

Failures should distinguish:

- validation;
- compatibility;
- authorization;
- allocation;
- deployment;
- startup;
- runtime;
- timeout;
- cancellation;
- infrastructure;
- lab;
- robot;
- network;
- artifact;
- policy.

# 43. `execution.job_failures` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| failure_id | uuid | No | UUIDv7 | Failure |
| job_id | uuid | No | None | Job |
| attempt_id | uuid | Yes | NULL | Attempt |
| organization_id | uuid | No | None | Tenant |
| failure_stage | failure_stage | No | None | Stage |
| failure_code | varchar(64) | No | None | Stable code |
| severity | failure_severity | No | `ERROR` | Severity |
| retryable | boolean | No | `false` | Retryable |
| message | varchar(4000) | No | None | Safe message |
| technical_detail | text | Yes | NULL | Diagnostic detail |
| occurred_at | timestamptz | No | `now()` | Failure time |
| detected_at | timestamptz | No | `now()` | Detection |
| resolved_at | timestamptz | Yes | NULL | Resolution |
| metadata | jsonb | No | `'{}'` | Evidence |

# 44. Failure Stage

    CREATE TYPE execution.failure_stage AS ENUM (
        'VALIDATION',
        'AUTHORIZATION',
        'COMPATIBILITY',
        'QUEUE',
        'ALLOCATION',
        'DEPLOYMENT',
        'STARTUP',
        'RUNTIME',
        'TIMEOUT',
        'CANCELLATION',
        'INFRASTRUCTURE',
        'LAB',
        'ROBOT',
        'NETWORK',
        'ARTIFACT',
        'POLICY'
    );

# 45. Failure Severity

    CREATE TYPE execution.failure_severity AS ENUM (
        'INFO',
        'WARNING',
        'ERROR',
        'CRITICAL'
    );

# 46. Failure DDL

    CREATE TABLE execution.job_failures (
        failure_id UUID PRIMARY KEY,
        job_id UUID NOT NULL,
        attempt_id UUID NULL,
        organization_id UUID NOT NULL,
        failure_stage execution.failure_stage NOT NULL,
        failure_code VARCHAR(64) NOT NULL,
        severity execution.failure_severity
            NOT NULL DEFAULT 'ERROR',
        retryable BOOLEAN NOT NULL DEFAULT false,
        message VARCHAR(4000) NOT NULL,
        technical_detail TEXT NULL,
        occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        resolved_at TIMESTAMPTZ NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT failures_job_fk
            FOREIGN KEY (job_id)
            REFERENCES execution.jobs(job_id)
            ON DELETE RESTRICT,
        CONSTRAINT failures_attempt_fk
            FOREIGN KEY (attempt_id)
            REFERENCES execution.job_attempts(attempt_id)
            ON DELETE RESTRICT,
        CONSTRAINT failures_org_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT failures_resolution_check
            CHECK (resolved_at IS NULL OR resolved_at >= occurred_at),
        CONSTRAINT failures_metadata_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

    CREATE INDEX failures_job_time_idx
        ON execution.job_failures(job_id, occurred_at);

    CREATE INDEX failures_attempt_idx
        ON execution.job_failures(attempt_id);

    CREATE INDEX failures_org_time_idx
        ON execution.job_failures(
            organization_id,
            occurred_at
        );

    CREATE INDEX failures_retryable_idx
        ON execution.job_failures(retryable, occurred_at);

# 47. Failure Information Policy

Failure messages must be safe for customer exposure.

Technical diagnostic information may include:

- Lab Agent diagnostics;
- runtime output references;
- deployment identifiers;
- infrastructure identifiers.

Sensitive infrastructure credentials, secrets and tokens must never be stored
in the failure record.

# 48. Job Retry

A Job may retry only when:

- the failure is classified retryable;
- attempt count is below attempt limit;
- Booking remains valid;
- Resource remains eligible;
- Artifact remains valid;
- authorization remains valid.

Retry must create a new Attempt.

Historical failures and attempts must remain immutable.

# 49. Retry Flow

    Attempt 1
       |
       v
     FAILED
       |
    retryable?
       |
      yes
       |
       v
    Attempt 2
       |
       v
    execution

If:

    attempt_count >= attempt_limit

then the Job becomes:

    FAILED

# 50. Job Timeout

Timeout may occur at:

- queue deadline;
- validation deadline;
- allocation deadline;
- deployment deadline;
- startup deadline;
- runtime deadline.

Timeout must create a failure record with:

    failure_stage = TIMEOUT

and:

    retryable = policy-dependent

# 51. Cancellation

Job cancellation is allowed before completion subject to lifecycle policy.

Typical transitions:

    CREATED -> CANCELLED
    QUEUED -> CANCELLED
    VALIDATING -> CANCELLED
    ALLOCATING -> CANCELLED
    DEPLOYING -> CANCELLED
    STARTING -> CANCELLED
    RUNNING -> STOPPING -> CANCELLED

Physical robot safety remains the responsibility of local runtime and Lab
Agent controls.

# 52. Job and Booking

The Booking domain authorizes the execution window.

Job must not execute outside the Booking's authorized interval unless an
explicit extension policy is implemented.

The Job stores the Booking reference permanently for provenance.

# 53. Job and Artifact

The Artifact domain owns:

- Artifact identity;
- version;
- manifest;
- checksum;
- signature;
- compatibility;
- storage.

The Job stores the selected Artifact ID.

Deployment records additionally snapshot:

- artifact version;
- artifact checksum.

# 54. Job and Platform

The Job records the exact:

- Platform;
- Platform Version;
- optional Platform Configuration.

This prevents future Platform catalog changes from changing the historical
meaning of an existing Job.

# 55. Job and Resource

The requested Resource may initially be NULL.

After allocation:

    execution.jobs.resource_id

identifies the selected Resource.

The detailed allocation remains authoritative in the Booking domain.

# 56. Job and Lab Agent

The Lab Agent is the local execution gateway.

Typical flow:

    Control Plane
         |
         v
       Job
         |
         v
      Queue
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
       Robot

# 57. Job and Run

The Run records runtime execution.

Job remains the orchestration record.

Run remains the execution evidence.

Recommended relationship:

    Job 1 ---- N Attempts
      |
      +------- 1 authoritative Run

The implementation may permit one Run per successful Attempt if required.

# 58. Job State Transition Transaction

A state transition should atomically:

1. lock Job;
2. validate current state;
3. validate requested transition;
4. update Job;
5. append state history;
6. emit outbox event.

Conceptual:

    BEGIN
      SELECT job FOR UPDATE
      validate transition
      UPDATE job
      INSERT state history
      INSERT outbox event
    COMMIT

# 59. Queue Transaction

Queue insertion and Job transition to `QUEUED` should be atomic.

Conceptually:

    BEGIN
      UPDATE Job -> QUEUED
      INSERT Queue Record
      INSERT State History
      INSERT Outbox Event
    COMMIT

This prevents:

    Job = QUEUED
    Queue = missing

# 60. Deployment Transaction

Deployment state changes and corresponding Attempt state should be coordinated
transactionally where both are local database state.

External artifact transfer is not transactional and therefore requires
idempotency and reconciliation.

# 61. External Deployment

The deployment sequence is:

    Job
      |
      v
    Attempt
      |
      v
    Deployment CREATED
      |
      v
    Validate Artifact
      |
      v
    Transfer Artifact
      |
      v
    Install
      |
      v
    Verify checksum/signature
      |
      v
    VERIFIED

# 62. Deployment Verification

A deployment should verify that the remote Artifact corresponds to the
authorized Artifact.

At minimum:

    local artifact checksum
          ==
    deployment artifact checksum
          ==
    remote verification checksum

If verification fails:

    Deployment -> FAILED
    Attempt -> FAILED
    Job -> FAILED or retry

# 63. Queue Reconciliation

Reconciliation must detect:

- expired leases;
- queue records without Jobs;
- Jobs without queue records;
- duplicate active queue records;
- dispatched jobs without acknowledgements;
- stale claims.

# 64. Attempt Reconciliation

Reconciliation must detect:

- attempts stuck in active states;
- attempts without deployment;
- attempts without Run;
- stale Lab Agent ownership;
- attempts past timeout;
- orphaned runtime execution.

# 65. Deployment Reconciliation

Reconciliation must detect:

- deployment stuck in TRANSFERRING;
- deployment stuck in INSTALLING;
- deployment checksum mismatch;
- remote artifact unknown;
- deployment record without Attempt.

# 66. Job Reconciliation

The Job reconciliation model is:

    Job
      |
      +--> Queue
      |
      +--> Attempt
      |
      +--> Deployment
      |
      +--> Run
      |
      v
    consistency

Any broken invariant becomes an operational reconciliation item.

# 67. Idempotency

The following operations require idempotency:

- Job creation;
- queue insertion;
- attempt creation;
- deployment request;
- deployment completion;
- Job cancellation;
- Job retry;
- Job completion.

The Job `idempotency_key` protects initial Job creation.

Subsequent operations should use domain-specific idempotency keys or the
central `system.idempotency` table.

# 68. Queue Idempotency

A Job may have only one active queue record.

This is enforced by:

    unique active queue record per Job

Terminal historical queue records may remain for operational evidence.

# 69. Attempt Idempotency

A Job cannot have two Attempts with the same `attempt_number`.

This is enforced by:

    UNIQUE(job_id, attempt_number)

# 70. Deployment Idempotency

An Attempt may have one authoritative Deployment record.

This is enforced by:

    UNIQUE(attempt_id)

If multiple deployment phases are later required, the schema may evolve to
permit deployment steps while preserving the Attempt-level deployment identity.

# 71. Audit Requirements

Job actions requiring audit include:

- create;
- queue;
- validation;
- allocation;
- deployment;
- start;
- stop;
- retry;
- cancel;
- complete;
- fail;
- timeout;
- administrative override.

The Audit domain remains authoritative for immutable audit history.

# 72. Job Events

Recommended events:

    job.created
    job.queued
    job.validating
    job.allocating
    job.deploying
    job.starting
    job.running
    job.stopping
    job.completed
    job.failed
    job.cancelled
    job.timeout

Additional events:

    job.attempt.created
    job.attempt.failed
    job.deployment.started
    job.deployment.verified
    job.deployment.failed

# 73. Job Event Example

    {
        "protocol_version": "1.0",
        "event_id": "evt-job-001",
        "timestamp": "2026-10-10T04:32:00Z",
        "event": "job.running",
        "resource": {
            "type": "job",
            "id": "job-001"
        },
        "context": {
            "organization_id": "org-001",
            "project_id": "project-001"
        },
        "data": {
            "attempt_id": "attempt-001",
            "resource_id": "resource-001"
        }
    }

# 74. Repository Interfaces

Recommended repositories:

    JobRepository
    JobStateHistoryRepository
    JobQueueRepository
    JobAttemptRepository
    JobDeploymentRepository
    JobFailureRepository

# 75. Job Repository

Operations:

    create
    get
    get_for_update
    list_by_project
    list_by_booking
    list_by_organization
    transition_state
    cancel
    complete
    fail
    retry

# 76. Queue Repository

Operations:

    enqueue
    claim
    lease
    acknowledge
    complete
    release
    mark_dead
    reclaim_expired

# 77. Attempt Repository

Operations:

    create
    get
    get_latest
    list_by_job
    update_state
    finish

# 78. Deployment Repository

Operations:

    create
    get
    update_state
    verify
    fail
    list_by_job
    list_by_attempt

# 79. Failure Repository

Operations:

    record
    list_by_job
    list_by_attempt
    mark_resolved
    list_retryable

Failure records should not be physically deleted as part of normal operation.

# 80. Application Services

Recommended services:

    JobService
    JobScheduler
    JobValidationService
    JobDispatchService
    JobExecutionService
    JobDeploymentService
    JobRetryService
    JobReconciliationService

# 81. JobService

JobService owns:

- Job creation;
- authorization;
- lifecycle orchestration;
- cancellation;
- retry request;
- completion.

It does not own:

- Artifact contents;
- Booking policy;
- Resource health;
- Credit ledger.

# 82. Job Validation Service

Validation checks:

- Organization;
- Project;
- Booking;
- Artifact;
- Artifact signature;
- Artifact checksum;
- Platform;
- Platform Version;
- capabilities;
- architecture;
- runtime;
- SDK;
- execution policy.

# 83. Scheduler

The Scheduler selects queued Jobs according to:

- Booking window;
- Resource eligibility;
- priority;
- fairness;
- resource availability;
- deadline;
- platform;
- configuration.

Scheduler decisions are advisory until allocation succeeds.

# 84. Dispatch Service

DispatchService:

1. claims queue record;
2. validates lease;
3. creates Attempt;
4. sends work to Lab Agent;
5. records acknowledgement;
6. advances Job state.

# 85. Deployment Service

DeploymentService:

1. validates Artifact;
2. creates Deployment;
3. transfers Artifact;
4. installs Artifact;
5. verifies checksum;
6. records verification;
7. reports success/failure.

# 86. Execution Service

ExecutionService coordinates:

    Deployment
       |
       v
    Start Runtime
       |
       v
    Run
       |
       v
    Stop Runtime
       |
       v
    Release Resource
       |
       v
    Complete Job

# 87. Job Creation Flow

    Confirmed Booking
          |
          v
    Artifact selected
          |
          v
    Create Job
          |
          v
    Validate request
          |
          v
    CREATED
          |
          v
    QUEUED

# 88. Job Validation Flow

    QUEUED
       |
       v
    VALIDATING
       |
       +--> Artifact compatibility
       +--> Signature
       +--> Checksum
       +--> Platform
       +--> Runtime
       +--> SDK
       +--> Booking
       |
       v
    ALLOCATING

# 89. Allocation Flow

    ALLOCATING
       |
       v
    Resolve Booking allocation
       |
       v
    Validate Resource
       |
       v
    Create Attempt
       |
       v
    DEPLOYING

# 90. Deployment Flow

    DEPLOYING
       |
       v
    Create Deployment
       |
       v
    Transfer
       |
       v
    Install
       |
       v
    Verify
       |
       v
    STARTING

# 91. Runtime Flow

    STARTING
       |
       v
    Runtime launch
       |
       v
    RUNNING
       |
       v
    application execution
       |
       v
    STOPPING
       |
       v
    COMPLETED

# 92. Failure Flow

    Any execution stage
           |
           v
       Failure record
           |
           v
       classify failure
           |
       +---+---+
       |       |
    retry   terminal
       |       |
       v       v
    QUEUED   FAILED

# 93. Cancellation Flow

    User
      |
      v
    Cancel Job
      |
      v
    validate state
      |
      v
    request runtime stop
      |
      v
    release execution resources
      |
      v
    CANCELLED

The local runtime and safety system remain authoritative for physical stopping.

# 94. Priority

Priority is represented as a numeric value.

Higher value means higher scheduling priority.

Initial range:

    0 .. 1000

Default:

    100

Priority must not bypass:

- authorization;
- Booking;
- Resource safety;
- Platform compatibility;
- credit authorization.

# 95. Scheduling Fairness

Priority alone must not create indefinite starvation.

The Scheduler may later implement:

- organization quotas;
- weighted fairness;
- aging;
- subscription tiers;
- reserved capacity.

These policies remain outside the schema.

# 96. Job Deadline

`deadline_at` represents the latest acceptable scheduling/execution boundary.

A Job exceeding the deadline may become:

    TIMEOUT

The scheduler must not dispatch a Job that cannot reasonably complete before
its policy deadline.

# 97. Runtime Limit

`max_runtime_seconds` limits application execution.

The local runtime remains responsible for enforcing the physical execution
timeout.

Cloud/control-plane enforcement provides an additional supervisory boundary.

# 98. Safety Boundary

The database, cloud and Job service are not physical safety systems.

The safety hierarchy is:

    Physical Emergency Stop
             |
             v
    Local Robot Controller
             |
             v
       Local Runtime
             |
             v
        Lab Agent
             |
             v
       Control Plane
             |
             v
          Job DB

Cloud failure must not create an unsafe robot state.

# 99. Job Retention

Recommended retention:

| Data | Retention |
|---|---|
| Job | Long-term |
| State History | Long-term |
| Attempts | Long-term |
| Deployment records | Long-term |
| Failure records | Long-term / policy |
| Queue records | Operational retention |
| Technical diagnostics | Policy-based |
| High-volume telemetry | Separate retention |
| Video | Separate retention |

Job and execution history are commercially and operationally significant and
should not be aggressively deleted.

# 100. Queue Retention

Queue records may be compacted after:

- successful completion;
- dead-letter resolution;
- reconciliation;
- operational retention period.

The authoritative Job remains.

# 101. Failure Retention

Failure records should be retained long enough to support:

- customer support;
- reliability analysis;
- incident investigation;
- audit;
- billing disputes;
- operational debugging.

Technical details may have shorter retention than failure classifications.

# 102. Privacy

Job records may contain:

- user identity;
- organization;
- project;
- execution purpose;
- environment metadata.

Secrets must not be stored in:

    jobs.environment
    jobs.metadata
    failure technical_detail

Sensitive values must reference secret-management infrastructure instead.

# 103. Historical Reproducibility

A historical Job must retain enough information to identify:

- Artifact;
- Artifact version;
- Artifact checksum;
- Platform;
- Platform Version;
- runtime;
- SDK;
- Resource;
- Booking;
- execution Attempt.

The Artifact domain retains immutable Artifact identity and content references.

# 104. Job Configuration

`environment` is bounded execution configuration.

It may contain:

- non-secret environment variables;
- feature flags;
- execution parameters;
- application configuration references.

It must not contain:

- passwords;
- tokens;
- private keys;
- cloud credentials.

# 105. Metadata Policy

`metadata` is bounded extensibility.

Frequently queried fields must become relational columns.

Metadata must not be used to bypass:

- tenancy;
- authorization;
- billing;
- lifecycle;
- integrity;
- scheduling constraints.

# 106. Cross-Domain Write Rule

Job code must not directly mutate:

    booking.bookings
    credit.wallets
    credit.ledger_entries
    artifact.artifacts
    lab.resources
    platform.platforms

Cross-domain changes occur through owning application services.

# 107. PostgreSQL Authority

PostgreSQL is authoritative for:

- Job state;
- queue durability;
- Attempt records;
- Deployment records;
- failure records;
- state history;
- execution provenance.

External queues, WebSockets and worker caches are delivery mechanisms, not
business-state authorities.

# 108. Outbox Integration

Job transitions that require event publication should use a transactional
outbox.

Conceptually:

    BEGIN
      update Job
      insert state history
      insert outbox event
    COMMIT

The event publisher then delivers the event asynchronously.

# 109. Event Delivery

Events are at-least-once.

Consumers must use:

- event ID;
- sequence/correlation;
- idempotent handlers.

Job current state remains authoritative in PostgreSQL.

# 110. Concurrency

Critical operations require row locking or equivalent optimistic concurrency:

- Job transition;
- queue claim;
- Attempt creation;
- cancellation;
- retry;
- completion.

Queue workers should use `FOR UPDATE SKIP LOCKED`.

# 111. State Transition Integrity

Application code must use a single state-transition service.

Direct arbitrary status updates are prohibited.

Every transition must validate:

    current_state
        +
    requested_state
        +
    actor/policy
        =
    allowed transition

# 112. State History Integrity

History must reflect the authoritative Job state transition.

A state update without history is a data-integrity defect.

A history row without a corresponding valid transition is a reconciliation
defect.

# 113. Attempt History

Attempts are append-oriented.

Attempt fields may be updated only while the Attempt is active.

After terminal state:

    SUCCEEDED
    FAILED
    CANCELLED
    TIMEOUT

the Attempt is immutable except for explicitly defined operational
corrections.

# 114. Deployment History

Deployment records preserve evidence of what was transferred.

Deployment checksum values must never be overwritten to hide a failed
deployment.

A new deployment requires a new Attempt or explicitly versioned deployment
step.

# 115. Failure Evidence

Failure records preserve the original failure classification.

If a failure is later resolved:

    resolved_at

is added.

The original:

    failure_code
    failure_stage
    occurred_at
    message

must remain unchanged.

# 116. Example Job

    job_id:
      0194c7d0-8b00-7abc-9def-900000000001

    organization_id:
      0194c7d0-8b00-7abc-9def-200000000001

    project_id:
      0194c7d0-8b00-7abc-9def-300000000001

    booking_id:
      0194c7d0-8b00-7abc-9def-800000000001

    artifact_id:
      0194c7d0-8b00-7abc-9def-700000000001

    platform_id:
      0194c7d0-8b00-7abc-9def-500000000001

    platform_version_id:
      0194c7d0-8b00-7abc-9def-510000000001

    job_key:
      vision-test-run-001

    status:
      RUNNING

    priority:
      100

    max_runtime_seconds:
      1800

    attempt_limit:
      2

    attempt_count:
      1

# 117. Example Queue Record

    queue_id:
      0194c7d0-8b00-7abc-9def-900000000002

    job_id:
      0194c7d0-8b00-7abc-9def-900000000001

    queue_name:
      robot-execution

    priority:
      100

    state:
      ACKNOWLEDGED

    retry_count:
      0

# 118. Example Attempt

    attempt_id:
      0194c7d0-8b00-7abc-9def-900000000003

    job_id:
      0194c7d0-8b00-7abc-9def-900000000001

    attempt_number:
      1

    status:
      RUNNING

    resource_id:
      0194c7d0-8b00-7abc-9def-600000000001

# 119. Example Deployment

    deployment_id:
      0194c7d0-8b00-7abc-9def-900000000004

    attempt_id:
      0194c7d0-8b00-7abc-9def-900000000003

    status:
      VERIFIED

    artifact_version:
      1.2.0

    artifact_checksum:
      sha256:abc123...

    verification_checksum:
      sha256:abc123...

# 120. Example Failure

    failure_id:
      0194c7d0-8b00-7abc-9def-900000000005

    failure_stage:
      DEPLOYMENT

    failure_code:
      ARTIFACT_TRANSFER_TIMEOUT

    severity:
      ERROR

    retryable:
      true

# 121. Complete Job Relationship Diagram

    organization.organizations
              |
              v
       project.projects
              |
              v
       booking.bookings
              |
              v
       execution.jobs
        |     |      |
        |     |      +--> artifact.artifacts
        |     |
        |     +---------> platform.platforms
        |                platform.platform_versions
        |
        +--> execution.job_queue
        |
        +--> execution.job_state_history
        |
        +--> execution.job_attempts
                    |
                    +--> execution.job_deployments
                    |
                    +--> execution.job_failures
                    |
                    +--> execution.runs

# 122. Execution Architecture

    Studio
      |
      | HTTPS / WebSocket
      v
    Control Plane
      |
      v
    Job Service
      |
      +--> PostgreSQL
      |
      +--> Queue
      |
      v
    Worker
      |
      | secure Lab Protocol
      v
    Lab Agent
      |
      v
    Kritva Runtime
      |
      v
    Robot

# 123. Booking-to-Job Flow

    Booking CONFIRMED
          |
          v
    Artifact selected
          |
          v
    Job CREATED
          |
          v
    Validation
          |
          v
    Job QUEUED

A Job must not be created from an invalid or cancelled Booking.

# 124. Artifact-to-Job Flow

    Local Source
        |
        v
    Local Build
        |
        v
    .krv Artifact
        |
        v
    Artifact Registry
        |
        v
    Booking
        |
        v
    Job
        |
        v
    Deployment
        |
        v
    Runtime

# 125. Job-to-Result Flow

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
      v
    Experiment

# 126. Phase 0 Mapping

Phase 0 establishes:

- Execution domain ownership;
- Job/Run distinction;
- PostgreSQL authority;
- lifecycle model;
- tenant model;
- queue durability model;
- safety boundary.

# 127. Phase 1 Mapping

Phase 1 implements:

- Organization integration;
- Project integration;
- Job identity;
- basic Job lifecycle;
- authorization;
- Job repository.

# 128. Phase 2 Mapping

Phase 2 implements:

- Artifact integration;
- Platform integration;
- Platform Version integration;
- execution intent;
- validation.

# 129. Phase 3 Mapping

Phase 3 implements:

- queue records;
- queue claiming;
- leases;
- Attempts;
- retry policy;
- state history;
- reconciliation.

# 130. Phase 4 Mapping

Phase 4 integrates:

- Booking;
- Resource allocation;
- Credit authorization;
- Job creation from confirmed Booking;
- cancellation.

# 131. Phase 5 Mapping

Phase 5 is the primary remote execution phase:

- Job dispatch;
- Lab Agent integration;
- deployment;
- runtime startup;
- Run creation;
- completion;
- timeout;
- failure.

# 132. Phase 6 Mapping

Phase 6 integrates:

- physical robot execution;
- resource health;
- robot faults;
- local runtime safety;
- Lab Agent reconciliation;
- operational recovery.

# 133. Phase 7 Mapping

Phase 7 implements:

- Result integration;
- Experiments;
- usage analytics;
- execution history;
- customer-visible logs/results;
- operational reporting.

# 134. Phase 8 Mapping

Phase 8 completes:

- production queue scaling;
- retention;
- privacy;
- disaster recovery;
- reconciliation;
- performance;
- capacity;
- production observability;
- operational runbooks.

# 135. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate Job | Critical | Idempotency key |
| Duplicate queue work | Critical | Active queue unique constraint |
| Double execution | Critical | Queue leases + Attempt state |
| Wrong Artifact | Critical | Immutable Artifact reference + checksum |
| Wrong Platform | Critical | Compatibility validation |
| Unauthorized execution | Critical | Booking/tenant authorization |
| Stale worker lease | High | Lease expiry/reconciliation |
| Deployment corruption | Critical | Checksum verification |
| Runtime timeout | High | Local + control-plane timeout |
| Partial state transition | Critical | DB transaction + outbox |
| Lost event | High | Transactional outbox |
| Retry storm | High | Attempt limits/backoff |
| Infinite retry | Critical | attempt_limit |
| Resource failure | High | Lab Agent status + reconciliation |
| Robot fault | Critical | Local safety authority |
| Cross-tenant access | Critical | Tenant authorization/constraints |
| Secret leakage | Critical | No secrets in metadata |
| Stale Job | High | Reconciliation worker |
| Deadlock | High | Deterministic lock ordering |
| Queue starvation | Medium | Priority aging/fairness |
| Historical inconsistency | High | Immutable execution intent |

# 136. Open Questions

1. Final Job-to-Run cardinality for retries.
2. Whether every Attempt creates a Run.
3. Final queue technology.
4. Final queue lease duration.
5. Final retry backoff policy.
6. Final maximum attempt count.
7. Final Job priority policy.
8. Final scheduling fairness policy.
9. Final deadline semantics.
10. Final runtime timeout enforcement.
11. Whether Job cancellation during RUNNING creates CANCELLED or FAILED.
12. Final Lab Agent acknowledgement protocol.
13. Final deployment protocol.
14. Final remote artifact staging path policy.
15. Final Artifact encryption policy.
16. Final deployment rollback policy.
17. Whether failed deployments retain remote files.
18. Final Job/Booking cancellation interaction.
19. Final Resource allocation ownership between Booking and Execution.
20. Final multi-resource execution policy.
21. Whether one Job may generate multiple Runs.
22. Final result generation policy.
23. Final telemetry storage boundary.
24. Final log retention policy.
25. Final video retention policy.
26. Final customer-visible failure taxonomy.
27. Final administrative override policy.
28. Final worker autoscaling policy.
29. Final queue partitioning policy.
30. Final cross-region execution policy.

# 137. Acceptance Criteria — Job Identity

- [ ] `execution` schema exists.
- [ ] `jobs` table exists.
- [ ] Job ID uses UUIDv7.
- [ ] Organization ownership is mandatory.
- [ ] Project ownership is mandatory.
- [ ] Booking reference is mandatory.
- [ ] Artifact reference is mandatory.
- [ ] Platform reference is mandatory.
- [ ] Platform Version reference is mandatory.
- [ ] Job key is unique within Project.
- [ ] Idempotency key is unique within Organization.
- [ ] Audit timestamps exist.
- [ ] Creator identity exists.

# 138. Acceptance Criteria — Job Lifecycle

- [ ] CREATED exists.
- [ ] QUEUED exists.
- [ ] VALIDATING exists.
- [ ] ALLOCATING exists.
- [ ] DEPLOYING exists.
- [ ] STARTING exists.
- [ ] RUNNING exists.
- [ ] STOPPING exists.
- [ ] COMPLETED exists.
- [ ] FAILED exists.
- [ ] CANCELLED exists.
- [ ] TIMEOUT exists.
- [ ] Invalid transitions are rejected.
- [ ] Valid transitions are tested.
- [ ] State transitions create history.

# 139. Acceptance Criteria — Queue

- [ ] Durable queue record exists.
- [ ] Queue record references Job.
- [ ] Queue state machine exists.
- [ ] Priority is stored.
- [ ] Availability time is stored.
- [ ] Worker claim is stored.
- [ ] Lease expiry is stored.
- [ ] Retry count is stored.
- [ ] Active queue uniqueness is enforced.
- [ ] `SKIP LOCKED` claiming is supported.
- [ ] Expired leases can be reclaimed.
- [ ] Dead queue records are supported.

# 140. Acceptance Criteria — Attempts

- [ ] Attempt table exists.
- [ ] Attempts reference Job.
- [ ] Attempt number is unique per Job.
- [ ] Attempt lifecycle exists.
- [ ] Resource identity is captured.
- [ ] Lab Agent identity is captured.
- [ ] Run identity is captured.
- [ ] Start/end timestamps exist.
- [ ] Timeout is supported.
- [ ] Exit code is captured.
- [ ] Retryability is captured.

# 141. Acceptance Criteria — Deployment

- [ ] Deployment table exists.
- [ ] Deployment references Job.
- [ ] Deployment references Attempt.
- [ ] Deployment references Artifact.
- [ ] Deployment references Resource.
- [ ] Deployment lifecycle exists.
- [ ] Artifact version is captured.
- [ ] Artifact checksum is captured.
- [ ] Verification checksum is captured.
- [ ] Deployment failures are captured.
- [ ] Attempt-level deployment uniqueness is enforced.

# 142. Acceptance Criteria — Failures

- [ ] Failure table exists.
- [ ] Failure references Job.
- [ ] Failure may reference Attempt.
- [ ] Failure stage is constrained.
- [ ] Failure code is required.
- [ ] Severity is constrained.
- [ ] Retryability is stored.
- [ ] Safe customer message is stored.
- [ ] Technical detail is optional.
- [ ] Resolution time is supported.
- [ ] Failure history is retained.

# 143. Acceptance Criteria — State History

- [ ] State history table exists.
- [ ] Previous state is recorded.
- [ ] New state is recorded.
- [ ] Reason code is supported.
- [ ] Actor type is supported.
- [ ] Actor identity is supported.
- [ ] Attempt linkage is supported.
- [ ] Timestamp is recorded.
- [ ] History is append-oriented.
- [ ] History supports operational investigation.

# 144. Acceptance Criteria — Artifact Integration

- [ ] Job references immutable Artifact identity.
- [ ] Artifact compatibility is validated.
- [ ] Artifact checksum is verified.
- [ ] Artifact signature is verified.
- [ ] Artifact version is preserved.
- [ ] Deployment records retain checksum evidence.
- [ ] Source code is never required by the Job service.

# 145. Acceptance Criteria — Booking Integration

- [ ] Job requires valid Booking.
- [ ] Booking Organization matches Job Organization.
- [ ] Booking Project matches Job Project.
- [ ] Booking platform matches Job platform.
- [ ] Execution interval respects Booking policy.
- [ ] Booking cancellation is handled.
- [ ] Resource allocation remains authoritative.
- [ ] Job provenance remains linked to Booking.

# 146. Acceptance Criteria — Resource Integration

- [ ] Job can reference Resource.
- [ ] Resource eligibility is validated.
- [ ] Resource operational state is checked.
- [ ] Resource ownership is not duplicated.
- [ ] Lab domain remains Resource authority.
- [ ] Resource failures are recorded as Job failures.
- [ ] Historical Resource identity remains available.

# 147. Acceptance Criteria — Credit Integration

- [ ] Job does not directly mutate credit ledger.
- [ ] Booking/credit authorization is validated.
- [ ] Execution consumption is linked to the Job/Run.
- [ ] Failed execution is reconciled with credit policy.
- [ ] Cancellation is reconciled with credit policy.
- [ ] Over-consumption is detected.
- [ ] Credit evidence remains in Credit domain.

# 148. Acceptance Criteria — Concurrency

- [ ] Job transitions use transactional protection.
- [ ] Queue claims use row locking.
- [ ] Duplicate active queue records are prevented.
- [ ] Duplicate Attempts are prevented.
- [ ] Duplicate Deployments are prevented.
- [ ] Concurrent cancellation is safe.
- [ ] Concurrent retry is safe.
- [ ] Concurrent completion is safe.
- [ ] Lease expiry is recoverable.
- [ ] Deadlocks are tested.

# 149. Acceptance Criteria — Tenancy

- [ ] Job has Organization ID.
- [ ] Queue has Organization ID.
- [ ] Attempt has Organization ID.
- [ ] Deployment has Organization ID.
- [ ] Failure has Organization ID.
- [ ] State history has Organization ID.
- [ ] Cross-tenant Job access is rejected.
- [ ] Cross-tenant execution is rejected.
- [ ] Tenant isolation tests pass.

# 150. Acceptance Criteria — Safety

- [ ] Job database is not treated as a physical safety controller.
- [ ] Local runtime remains safety authority.
- [ ] Lab Agent remains local execution boundary.
- [ ] Robot emergency stop remains local.
- [ ] Cloud failure cannot command unsafe restart.
- [ ] Job timeout does not replace physical safety mechanisms.
- [ ] Robot fault is propagated to execution state.

# 151. Acceptance Criteria — Retention

- [ ] Job records follow long-term retention.
- [ ] Attempts follow execution-history retention.
- [ ] Deployments remain traceable.
- [ ] Failures remain traceable.
- [ ] State history remains traceable.
- [ ] Queue records may be compacted according to policy.
- [ ] High-volume telemetry is stored separately.
- [ ] Video retention is independent.
- [ ] Privacy retention policy is documented.

# 152. Acceptance Criteria — Reconciliation

- [ ] Queue reconciliation exists.
- [ ] Lease reconciliation exists.
- [ ] Attempt reconciliation exists.
- [ ] Deployment reconciliation exists.
- [ ] Job reconciliation exists.
- [ ] Orphaned records are detected.
- [ ] Stale active states are detected.
- [ ] Missing queue records are detected.
- [ ] Missing deployments are detected.
- [ ] Job/Run inconsistencies are detected.

# 153. Acceptance Criteria — Observability

- [ ] Job creation metrics exist.
- [ ] Queue latency metrics exist.
- [ ] Validation latency exists.
- [ ] Allocation latency exists.
- [ ] Deployment latency exists.
- [ ] Startup latency exists.
- [ ] Runtime duration exists.
- [ ] Failure counts exist.
- [ ] Retry counts exist.
- [ ] Timeout counts exist.
- [ ] Queue depth is observable.
- [ ] Stale lease alerts exist.

# 154. Acceptance Criteria — Security

- [ ] Job APIs require authentication.
- [ ] Organization authorization is enforced.
- [ ] Project authorization is enforced.
- [ ] Artifact authorization is enforced.
- [ ] Booking authorization is enforced.
- [ ] Administrative overrides are audited.
- [ ] Secrets are prohibited from metadata.
- [ ] Failure details are access-controlled.
- [ ] Cross-tenant references are rejected.

# 155. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Execution ownership accepted.
- [ ] Job/Run boundary accepted.
- [ ] Lifecycle accepted.
- [ ] Tenant model accepted.
- [ ] Safety boundary accepted.

Phase 1:

- [ ] Job identity complete.
- [ ] Repository complete.
- [ ] Basic lifecycle complete.

Phase 2:

- [ ] Artifact integration complete.
- [ ] Platform compatibility complete.
- [ ] Validation complete.

Phase 3:

- [ ] Queue complete.
- [ ] Lease handling complete.
- [ ] Attempts complete.
- [ ] Retry complete.
- [ ] Reconciliation complete.

Phase 4:

- [ ] Booking integration complete.
- [ ] Resource allocation integration complete.
- [ ] Credit authorization complete.

Phase 5:

- [ ] Deployment complete.
- [ ] Lab Agent dispatch complete.
- [ ] Run creation complete.
- [ ] Runtime lifecycle complete.
- [ ] Completion/failure complete.

Phase 6:

- [ ] Physical robot execution complete.
- [ ] Fault handling complete.
- [ ] Safety integration reviewed.
- [ ] Operational reconciliation complete.

Phase 7:

- [ ] Results integration complete.
- [ ] Experiment integration complete.
- [ ] Execution analytics complete.
- [ ] Audit integration complete.

Phase 8:

- [ ] Production scaling complete.
- [ ] Retention complete.
- [ ] Privacy complete.
- [ ] Disaster recovery validated.
- [ ] Queue recovery validated.
- [ ] Production observability validated.
- [ ] Production acceptance complete.

# 156. Final Invariants

The following invariants are mandatory:

1. Every customer Job belongs to exactly one Organization.
2. Every Job belongs to exactly one Project.
3. Every Job references a valid Booking.
4. Every Job references an immutable Artifact identity.
5. Every Job identifies Platform and Platform Version.
6. Execution-critical Job intent is immutable after queueing.
7. Job lifecycle transitions are explicitly validated.
8. Every significant state transition creates history.
9. A Job may have multiple Attempts.
10. Attempt numbers are unique within a Job.
11. Queue work is durably represented.
12. A Job has at most one active queue record.
13. Queue leases are recoverable.
14. Deployment evidence is retained.
15. Deployment checksums are preserved.
16. Failure information is append-oriented.
17. Retry occurs only when policy permits.
18. Attempt limits prevent infinite retries.
19. Job state is authoritative in PostgreSQL.
20. External queue delivery is not authoritative business state.
21. Cross-domain writes use owning application services.
22. Artifact integrity is validated before execution.
23. Booking authorization is validated before execution.
24. Resource eligibility is validated before execution.
25. Credit authorization is validated before execution.
26. Physical safety remains local to the robot/runtime.
27. Historical execution provenance remains queryable.
28. Secrets are not stored in Job metadata.
29. Reconciliation can recover interrupted workflows.
30. Job execution is auditable end-to-end.

# 157. Final Architecture Statement

> **A Kritva RaaS Job is the authoritative execution orchestration record
> connecting a confirmed Booking and immutable Artifact to an authorized
> robotic execution Resource.**
>
> **The Job domain owns execution lifecycle, queue durability, Attempts,
> Deployment evidence, failures, retries and execution orchestration. Booking
> owns scheduling authorization, Artifact owns executable content and
> compatibility, Lab owns Resource state, Credit owns financial state, and Run
> owns runtime execution evidence.**
>
> **PostgreSQL remains authoritative for durable Job state. Queue transports,
> workers, WebSockets and Lab Agent communication are delivery and execution
> mechanisms rather than substitutes for durable business state.**
>
> **A Job therefore follows the production execution path:**
>
>     Confirmed Booking
>          |
>          v
>        Job
>          |
>          v
>        Queue
>          |
>          v
>      Validation
>          |
>          v
>      Allocation
>          |
>          v
>       Attempt
>          |
>          v
>      Deployment
>          |
>          v
>        Start
>          |
>          v
>        Run
>          |
>          v
>       Stop
>          |
>          v
>      Complete
>          |
>          +--> Result
>          +--> Credit Consumption
>          +--> Booking Completion
>
> **The resulting schema provides the durable execution foundation required
> for Kritva RaaS to execute compiled `.krv` artifacts on virtual and physical
> robotic platforms while preserving tenant isolation, artifact provenance,
> scheduling integrity, retryability, operational recovery and end-to-end
> execution evidence.**
