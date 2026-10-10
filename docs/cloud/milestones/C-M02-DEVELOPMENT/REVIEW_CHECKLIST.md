# C-M02-DEVELOPMENT — Review Checklist

Milestone: C-M02-DEVELOPMENT — Shared Development Environment

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

### 7.1 Verification philosophy

C-M02 shall be verified at multiple levels.

    IaC validation
          |
          v
    Infrastructure tests
          |
          v
    Service tests
          |
          v
    Integration tests
          |
          v
    Security tests
          |
          v
    Deployment tests
          |
          v
    Lab connectivity tests
          |
          v
    End-to-end tests
          |
          v
    Operational recovery tests

### 7.2 Infrastructure tests

Verify:

- IaC syntax;
- dependency graph;
- plan output;
- policy compliance;
- environment isolation;
- network rules;
- IAM bindings;
- resource naming;
- tags/labels;
- secret references;
- backup configuration.

### 7.3 Deployment tests

For each Development deployment:

1. identify source commit;
2. build application;
3. publish artifact;
4. deploy API;
5. deploy worker;
6. apply compatible migrations;
7. run health checks;
8. run smoke tests;
9. verify logs;
10. verify metrics;
11. verify traces where enabled;
12. record deployment evidence.

### 7.4 Database tests

Test:

- clean migration;
- migration from prior schema;
- repeated migration command;
- migration failure handling;
- connection exhaustion behavior;
- transaction rollback;
- backup;
- restore;
- schema version verification;
- application compatibility.

### 7.5 Object-storage tests

Test:

- authenticated upload;
- authenticated download;
- unauthorized download;
- checksum verification;
- object-not-found handling;
- lifecycle policy;
- tenant isolation;
- artifact metadata/object consistency.

### 7.6 Queue tests

Test:

- publish;
- consume;
- acknowledgement;
- duplicate delivery;
- retry;
- dead-letter;
- worker restart;
- message timeout;
- correlation identifiers;
- idempotent processing.

### 7.7 Security tests

Security verification shall include:

- IAM negative tests;
- cross-tenant access tests;
- public-storage exposure test;
- public-database exposure test;
- secret scanning;
- container/image scanning where applicable;
- dependency vulnerability scanning;
- API authorization tests;
- Lab Agent authentication tests;
- credential isolation tests;
- Development-to-Production isolation tests.

### 7.8 Deployment rollback test

At least one controlled rollback shall be demonstrated.

    Version N
       |
       v
    Version N+1
       |
       v
    Inject/observe controlled failure
       |
       v
    Rollback
       |
       v
    Version N
       |
       v
    Smoke test
       |
       v
    ACCEPTED

Rollback shall not corrupt PostgreSQL authoritative state.

### 7.9 Lab connectivity test

Test:

1. Lab Agent starts.
2. Lab Agent authenticates.
3. Lab Agent registers.
4. Heartbeat becomes healthy.
5. Resource becomes available.
6. Control Plane sends authorized request.
7. Lab Agent validates request.
8. Artifact is deployed.
9. Run starts.
10. State and telemetry are returned.
11. Run completes.
12. Result is collected.
13. Lab Agent cleans up.

### 7.10 Disconnect test

Controlled disconnect scenarios shall include:

- Lab Agent disconnected before job dispatch;
- disconnected during validation;
- disconnected during deployment;
- disconnected during execution;
- disconnected during result collection;
- reconnect after timeout.

The system must not infer that a disconnected robot is safe merely because the cloud no longer sees it.

### 7.11 Observability verification

Every critical flow shall be traceable from:

    User request
       |
       v
    API request ID
       |
       v
    Application operation
       |
       v
    Job ID
       |
       v
    Run ID
       |
       v
    Lab Agent operation
       |
       v
    Result

### 7.12 Backup verification

The test shall demonstrate:

- backup exists;
- backup is discoverable;
- restore can be initiated;
- restored database can be started;
- migration/schema state can be verified;
- application can connect;
- representative records are present;
- restore evidence is retained.

### 7.13 Performance verification

C-M02 does not establish final Production capacity limits, but it shall establish baseline measurements.

Initial Development targets should be approximately:

| Metric | Development target |
|---|---:|
| Health endpoint p95 | < 500 ms |
| Normal API read p95 | < 1 s |
| Normal API write p95 | < 1.5 s |
| Queue publish p95 | < 500 ms |
| Queue consumption startup | < 2 s |
| Database normal query p95 | < 500 ms |
| Deployment smoke-test completion | < 5 min |
| Lab heartbeat freshness | <= configured heartbeat interval + tolerance |

These are engineering baselines, not Production SLO commitments.

### 7.14 Evidence requirements

Each accepted task shall retain enough evidence to answer:

- What changed?
- Which commit introduced it?
- Which environment was changed?
- Which resource was created/updated?
- Which test executed?
- What was the result?
- Who reviewed it?
- What rollback exists?
- What documentation was updated?

---

## 8 Demo script

### 8.1 Demo objective

The C-M02 demonstration proves that the Development environment is usable as a shared engineering environment and can execute the integrated simulated RaaS path.

### 8.2 Demo preparation

Confirm:

- Development environment is healthy;
- API is deployed;
- worker is deployed;
- PostgreSQL is healthy;
- object storage is available;
- queue is healthy;
- observability dashboards are available;
- Lab Agent is registered;
- simulated resource is available.

### 8.3 Demonstration sequence

#### Step 1 — Show environment

Display:

- Development environment inventory;
- compute;
- PostgreSQL;
- object storage;
- queue;
- secrets;
- network;
- dashboards.

Expected result:

Development environment is clearly separated from other environments.

#### Step 2 — Show deployment provenance

Display:

- Git commit;
- CI run;
- build artifact;
- deployment identifier;
- deployed version.

Expected result:

The running service can be traced to a repository commit.

#### Step 3 — Authenticate

Log in through the Development application.

Expected result:

User receives a valid Development session.

#### Step 4 — Create project

Create a Development project.

Expected result:

Project is persisted in PostgreSQL.

#### Step 5 — Register/upload artifact

Generate or use a valid `.krv` artifact.

Expected result:

Artifact metadata is persisted and binary is stored in private object storage.

#### Step 6 — Validate artifact

Run artifact validation.

Expected result:

Manifest, checksum, platform compatibility, signature state, and policy are evaluated.

#### Step 7 — Submit execution

Create an execution request.

Expected result:

Job is persisted with a durable Job ID.

#### Step 8 — Observe queue

Show queue message flow.

Expected result:

Job is published and consumed by the Development worker.

#### Step 9 — Show worker processing

Display worker logs and traces.

Expected result:

Worker validates eligibility and communicates with the Lab Agent.

#### Step 10 — Show Lab Agent

Display Lab Agent registration and heartbeat.

Expected result:

Lab Agent reports healthy.

#### Step 11 — Start simulated run

Start the Run.

Expected result:

Job transitions through the approved lifecycle and Run begins.

#### Step 12 — Observe live state

Display:

- Job state;
- Run state;
- logs;
- telemetry;
- resource status.

Expected result:

Live observation is available while PostgreSQL remains the durable source of truth.

#### Step 13 — Complete execution

Allow the simulated execution to finish.

Expected result:

Run completes and Result is generated.

#### Step 14 — Show Result

Open the Result.

Expected result:

Result metadata and associated files are available.

#### Step 15 — Demonstrate observability

Show a trace from request to Job/Run/Lab Agent.

Expected result:

The execution path is diagnosable.

#### Step 16 — Demonstrate failure recovery

Trigger a controlled worker restart or Lab Agent disconnect.

Expected result:

The system detects the failure, preserves durable state, and recovers according to the defined retry/reconciliation rules.

#### Step 17 — Demonstrate rollback

Deploy the previous application version.

Expected result:

Rollback completes and smoke tests pass.

### 8.4 Demo success statement

The milestone passes the demonstration when:

> A developer can deploy, operate, observe, and recover the shared Development RaaS environment without manually reconstructing cloud infrastructure or bypassing the approved security and deployment boundaries.

---
