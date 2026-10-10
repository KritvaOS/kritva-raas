# Kritva RaaS Staging Environment Deployment

## 1. Document Control

| Item | Value |
|---|---|
| Document | Staging Environment Deployment |
| Path | `docs/cloud/deployment/STAGING.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Environment | Shared Staging |
| Primary Purpose | Production-readiness and release validation |
| Deployment Model | Production-like managed cloud environment |
| Application Model | Modular Control Plane |
| Database | Managed PostgreSQL |
| Storage | Private object storage |
| Queue | Managed durable queue |
| Compute | Managed container platform |
| Lab Integration | Controlled test Lab Agent |
| Production Data | Prohibited |
| Primary Users | QA, Engineering, SRE, Security, Release Management |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the architecture, deployment process, data policy, access
model, test strategy, performance validation, release promotion criteria and
operational controls for the Kritva RaaS Staging environment.

Staging is the final controlled environment before Production.

Its purpose is to demonstrate that a release candidate can operate using
production-like infrastructure, configuration, security controls, data flows,
asynchronous processing, Lab Agent connectivity and operational procedures.

Staging must answer:

- Can the exact release candidate run in a production-like environment?
- Are database migrations safe?
- Are API and WebSocket contracts compatible?
- Do asynchronous workers operate correctly?
- Does the queue behave correctly?
- Does object storage behave correctly?
- Does artifact validation work?
- Do booking and credit flows remain consistent?
- Can Jobs and Runs execute correctly?
- Does the Lab Agent boundary work?
- Are telemetry, logs and results correct?
- Can the system survive expected failures?
- Does the system meet defined performance targets?
- Are security controls effective?
- Is the release ready for Production?

## 3. Scope

This document covers:

- staging topology;
- production parity;
- infrastructure provisioning;
- deployment;
- release candidates;
- database migration;
- configuration;
- test data;
- access control;
- functional acceptance;
- integration testing;
- end-to-end testing;
- performance testing;
- resilience testing;
- security validation;
- Lab Agent validation;
- observability;
- rollback;
- promotion criteria;
- release approval;
- staging reset;
- Phase 0–Phase 8 mapping.

## 4. Non-Goals

Staging is not:

- a customer production environment;
- a source-code hosting service;
- a production data warehouse;
- a permanent experiment environment;
- a replacement for physical safety certification;
- a substitute for Production monitoring;
- a place to validate arbitrary unreviewed infrastructure changes;
- a place to use production credentials.

## 5. Staging Principles

Staging follows these principles:

1. Staging should closely resemble Production.
2. Production configuration should differ only where environment isolation
   requires it.
3. The exact release candidate should be tested.
4. The same immutable application artifact must be promoted from Development.
5. Production data is prohibited.
6. Synthetic and controlled test data is mandatory.
7. Security validation occurs before promotion.
8. Performance validation occurs before promotion.
9. Failure and recovery paths are tested.
10. Observability is production-like.
11. Database migrations are production-like.
12. Lab connectivity is controlled.
13. Physical safety remains local.
14. Access is more restricted than Development.
15. Promotion requires explicit evidence.
16. Failed acceptance blocks Production promotion.
17. Staging reset must be controlled and auditable.

# 6. Staging Role in the Environment Pipeline

The release path is:

    Developer
       |
       v
    Local
       |
       v
    Development
       |
       v
    Release Candidate
       |
       v
    Staging
       |
       v
    Production

Staging is the final validation gate.

## 7. Production Parity Objective

Staging should be structurally equivalent to Production in:

- network topology;
- workload types;
- authentication;
- authorization;
- database engine;
- object storage semantics;
- queue semantics;
- deployment model;
- secrets model;
- observability;
- backup behavior;
- Lab Agent protocol;
- API contracts;
- WebSocket behavior;
- application configuration structure.

Staging may differ in:

- scale;
- capacity;
- domain names;
- cloud account/project;
- credentials;
- test data;
- production traffic;
- production customer integrations.

## 8. Parity Matrix

| Area | Development | Staging | Production |
|---|---|---|---|
| Cloud provider | Same logical | Same | Same |
| Network model | Similar | Production-like | Production |
| Compute platform | Same | Same | Same |
| PostgreSQL | Managed | Managed | Managed |
| Object Storage | Managed | Managed | Managed |
| Queue | Managed | Managed | Managed |
| Secrets | Managed | Managed | Managed |
| IaC | Same | Same | Same |
| API | Same | Same artifact | Same artifact |
| Workers | Same | Same | Same |
| Scheduler | Same | Same | Same |
| Reconciler | Same | Same | Same |
| Observability | Similar | Production-like | Production |
| Lab Agent | Mock/Test | Controlled | Real |
| Data | Synthetic | Synthetic | Customer |
| Scale | Small | Representative | Production |

## 9. Staging Topology

The logical topology is:

    Internet
       |
       v
    DNS / Edge / WAF
       |
       v
    Load Balancer / API Gateway
       |
       v
    Private Application Network
       |
       +------------------------+
       |                        |
       v                        v
      API                  WebSocket
       |                        |
       +------------+-----------+
                    |
          +---------+---------+
          |         |         |
          v         v         v
      PostgreSQL  Queue   Object Storage
          |         |         |
          +---------+---------+
                    |
                    v
             Worker / Scheduler
                    |
                    v
             Reconciliation
                    |
                    v
             Staging Lab Agent
                    |
                    v
          Simulated/Test Resources

## 10. Staging Network

Staging uses production-like network isolation:

- public edge only where necessary;
- private application workloads;
- private database;
- private queue;
- private storage;
- controlled management access;
- controlled Lab connectivity;
- deny-by-default firewall policy.

Direct Internet access to PostgreSQL, queue or robot resources is prohibited.

## 11. Staging Compute

The staging workload model should match Production:

- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- migration;
- administrative workload.

Where Production uses separate workload classes, Staging must use the same
logical deployment structure.

## 12. Staging Database

Staging uses a dedicated managed PostgreSQL instance.

The database must never share Production data or Production credentials.

The schema must be created through the same migration mechanism intended for
Production.

Staging should use a representative database tier sufficient to expose:

- query performance issues;
- locking issues;
- migration issues;
- connection pool issues;
- index problems.

## 13. Staging Object Storage

Staging storage must be isolated.

Recommended logical namespaces:

    raas-staging-artifacts
    raas-staging-results
    raas-staging-logs
    raas-staging-video
    raas-staging-telemetry
    raas-staging-reports

Storage behavior must be equivalent to Production.

## 14. Staging Queue

Staging uses the same queue technology and semantics as Production.

Tests must validate:

- durable delivery;
- retries;
- duplicate delivery;
- dead-letter behavior;
- visibility/lease timeout;
- queue backlog;
- worker recovery.

The queue is not authoritative for Job/Run state.

## 15. Staging Secrets

Staging uses separate secrets.

Required categories:

- database credentials;
- object storage credentials;
- queue credentials;
- identity configuration;
- signing keys;
- Lab Agent credentials;
- observability credentials.

Production secrets must never be reused in Staging.

## 16. Staging Identity

Staging should use the same identity model as Production where practical.

The identity provider may use a dedicated Staging tenant/project.

Test accounts should be created explicitly.

No Production users should be automatically imported.

## 17. Staging Access Model

Access is more restrictive than Development.

Recommended roles:

| Role | Access |
|---|---|
| QA | Application testing |
| Developer | Diagnostics and assigned testing |
| Release Manager | Release validation/promotion |
| DevOps | Deployment |
| SRE | Operations |
| Security | Security validation |
| DBA | Database operations |
| Lab Integration | Lab resources |
| Administrator | Controlled elevated access |

All human users must use individual identities.

## 18. Staging Application Roles

Application roles remain:

- user;
- organization administrator;
- platform/lab administrator;
- system administrator.

Staging test users should represent each role.

Authorization must be validated before promotion.

## 19. Staging Data Policy

Staging must contain only:

- synthetic data;
- approved anonymized data;
- generated test artifacts;
- simulated telemetry;
- controlled test results.

Production customer data is prohibited by default.

## 20. Production Data Import

Production data may not be copied directly into Staging.

If production-like data is required:

    Production
         |
    Approved Export
         |
    Sanitization
         |
    Validation
         |
    Staging Import

The process must remove:

- personal information;
- credentials;
- secrets;
- payment information;
- customer proprietary data;
- security tokens.

## 21. Test Data Categories

Staging data should include:

| Category | Purpose |
|---|---|
| Baseline | Normal workflows |
| Boundary | Limits and constraints |
| Invalid | Error handling |
| Concurrent | Race conditions |
| Large | Size testing |
| Long-running | Timeout/recovery |
| Security | Authorization |
| Failure | Resilience |
| Performance | Load testing |

## 22. Test Organization Model

Recommended organizations:

    staging-e2e
    staging-performance
    staging-security
    staging-demo
    staging-regression

Each automated test suite should have isolated ownership where practical.

## 23. Test Data Lifecycle

Test data should be:

- generated;
- tagged;
- traceable;
- disposable;
- reproducible.

Example metadata:

    environment=staging
    test_run_id=<identifier>
    dataset=<profile>
    generated_at=<timestamp>

## 24. Test Data Reset

Staging reset should be controlled.

A full reset may be performed:

- after major release cycles;
- when test contamination is detected;
- before formal release-candidate validation.

A reset must not remove infrastructure definitions.

## 25. Staging Deployment Source

Only approved release candidates may be deployed to Staging.

The normal path is:

    Development
        |
    Candidate Selection
        |
        v
    Immutable Image Digest
        |
        v
    Staging
        |
    Validation
        |
        v
    Production

The application image must not be rebuilt for Staging.

## 26. Release Candidate Definition

A Release Candidate must have:

- Git commit;
- immutable container digest;
- version;
- changelog;
- dependency metadata;
- SBOM where required;
- test evidence;
- security scan results;
- migration plan;
- rollback plan.

## 27. Staging Deployment Pipeline

The deployment pipeline is:

    Merge / Release Candidate
             |
             v
          CI Build
             |
             +--> Unit Tests
             +--> Integration Tests
             +--> Security Scan
             +--> SBOM
             |
             v
        Immutable Image
             |
             v
        Development
             |
             v
       Candidate Gate
             |
             v
          Staging
             |
             +--> Migration
             +--> Smoke
             +--> Regression
             +--> Security
             +--> Performance
             +--> E2E
             |
             v
       Promotion Review
             |
             v
        Production

## 28. Staging Deployment Controls

Deployment must verify:

- correct environment;
- correct image digest;
- correct configuration;
- correct secret references;
- migration version;
- expected replica count;
- health checks;
- readiness;
- observability.

## 29. Database Migration in Staging

Every Production-bound migration must first execute in Staging.

Flow:

    Release Candidate
          |
          v
    Migration Validation
          |
          v
    Staging Database Backup
          |
          v
    Apply Migration
          |
          v
    Schema Verification
          |
          v
    Application Deployment
          |
          v
    E2E Validation

## 30. Migration Acceptance

Migration acceptance must verify:

- forward execution;
- expected schema;
- application compatibility;
- rollback/forward recovery strategy;
- performance impact;
- lock duration;
- data correctness.

Destructive migrations require explicit approval.

## 31. Zero-Downtime Migration Consideration

Where Production requires availability, migrations should follow:

    Expand
      |
    Backfill
      |
    Deploy Compatible Application
      |
    Validate
      |
    Contract

Staging should validate this sequence where applicable.

## 32. Staging Configuration

Configuration should mirror Production structure.

Differences should primarily be:

- endpoint;
- credentials;
- scale;
- data retention;
- test flags;
- Lab Agent target.

Production-only feature flags must not be accidentally enabled.

## 33. Feature Flags

Feature flags should be:

- explicit;
- environment-scoped;
- auditable;
- versioned where appropriate.

Staging may enable experimental features for validation, but the promotion
decision must record which flags were active.

## 34. Staging Smoke Tests

Every deployment must run:

- API health;
- readiness;
- authentication;
- authorization;
- database connectivity;
- queue connectivity;
- storage connectivity;
- WebSocket connectivity;
- worker health;
- scheduler health;
- Lab Agent health.

A failed smoke test blocks further promotion.

## 35. Functional Acceptance Testing

Functional testing must cover:

- Identity;
- Organizations;
- Projects;
- Platforms;
- Artifacts;
- Booking;
- Credits;
- Jobs;
- Runs;
- Results;
- Lab;
- Audit.

## 36. End-to-End Acceptance Flow

The primary E2E scenario is:

    Login
      |
      v
    Create Project
      |
      v
    Select Platform
      |
      v
    Build / Package Locally
      |
      v
    Upload .krv
      |
      v
    Validate Artifact
      |
      v
    Quote Credits
      |
      v
    Create Booking
      |
      v
    Start Job
      |
      v
    Allocate Resource
      |
      v
    Deploy Artifact
      |
      v
    Run
      |
      v
    Observe Telemetry
      |
      v
    Observe Logs
      |
      v
    Stop / Complete
      |
      v
    Process Result
      |
      v
    Download Result

## 37. E2E Negative Tests

The release candidate must also test:

- invalid authentication;
- unauthorized organization;
- invalid artifact;
- incompatible artifact;
- insufficient credits;
- booking conflict;
- unavailable resource;
- Agent offline;
- deployment failure;
- runtime failure;
- stop failure;
- result processing failure;
- duplicate request.

## 38. API Contract Testing

Staging must validate:

- REST routes;
- request schemas;
- response schemas;
- error codes;
- HTTP status mapping;
- idempotency;
- pagination;
- authorization;
- tenant isolation.

OpenAPI contract validation should run in CI and/or Staging.

## 39. WebSocket Testing

Tests must cover:

- connection;
- authentication;
- subscription;
- event delivery;
- duplicate event handling;
- ordering;
- reconnect;
- replay where supported;
- REST reconciliation.

WebSocket must not become the durable state authority.

## 40. Event Contract Testing

Critical events include:

    artifact.accepted
    booking.confirmed
    credit.reserved
    credit.consumed
    job.queued
    job.running
    job.completed
    job.failed
    run.running
    run.completed
    result.available
    agent.online
    agent.offline
    resource.busy
    resource.released

Event IDs and correlation fields must be validated.

## 41. Artifact Acceptance Testing

Staging must validate:

- valid `.krv`;
- invalid package;
- malformed manifest;
- checksum mismatch;
- invalid signature;
- unsupported platform;
- unsupported architecture;
- unsupported runtime;
- missing capability;
- revoked artifact;
- expired artifact.

## 42. Booking Acceptance Testing

Staging must validate:

- valid booking;
- overlapping booking;
- minimum duration;
- maximum duration;
- unavailable window;
- cancellation;
- modification;
- credit reservation;
- credit release;
- concurrent booking requests.

## 43. Credit Acceptance Testing

Staging must validate:

- quote;
- reservation;
- release;
- consumption;
- refund;
- insufficient credits;
- platform mismatch;
- expired reservation;
- duplicate transaction;
- concurrent reservation;
- ledger integrity.

## 44. Job Acceptance Testing

Staging must validate every Job state:

    CREATED
    QUEUED
    VALIDATING
    ALLOCATING
    DEPLOYING
    STARTING
    RUNNING
    STOPPING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

Invalid state transitions must be rejected.

## 45. Run Acceptance Testing

Run tests must validate:

- creation;
- start;
- telemetry;
- logs;
- stop;
- failure;
- timeout;
- reconciliation;
- terminal state.

## 46. Lab Agent Acceptance

The Staging Lab Agent must validate:

- registration;
- authentication;
- heartbeat;
- capabilities;
- resource inventory;
- artifact fetch;
- deployment;
- start;
- stop;
- cancel;
- telemetry;
- logs;
- results;
- disconnect;
- reconnect.

## 47. Physical Lab Policy

The preferred Staging path is a controlled simulated or dedicated test lab.

If physical robots are connected:

- only approved resources may be used;
- physical safety review is required;
- robot networks remain isolated;
- cloud does not own E-stop;
- test windows are explicitly scheduled;
- operators are identified.

Physical deployment must not be treated as a normal automated CI operation.

## 48. Performance Testing Objectives

Staging is the primary environment for release-level performance validation.

Performance tests should measure:

- API latency;
- API throughput;
- WebSocket connection behavior;
- event delivery;
- queue throughput;
- worker processing;
- database latency;
- object storage performance;
- artifact upload;
- result download;
- Job scheduling;
- Lab Agent command latency.

## 49. Initial Performance Targets

Initial engineering targets include:

| Metric | Target |
|---|---:|
| Normal API P95 | <500 ms |
| API availability | 99.9% target |
| Job control availability | 99.9% target |
| Artifact upload availability | 99.5% target |
| Result availability | 99.5% target |
| WebSocket availability | 99.5% target |
| Lab Agent cloud connectivity | 99.0% target |

These are initial targets and may be refined after real workload measurements.

## 50. Load Test Categories

Required categories:

- baseline;
- normal load;
- peak load;
- burst load;
- sustained load;
- concurrency;
- large artifact;
- long-running Jobs;
- reconnect storms;
- queue backlog.

## 51. API Load Testing

API tests should cover:

- read-heavy workload;
- project operations;
- platform queries;
- artifact metadata;
- booking availability;
- booking creation;
- credit quote;
- Job status.

Write-heavy tests must account for database locking.

## 52. Booking Concurrency Test

Example:

    100 concurrent booking requests
              |
              v
       Same Resource/Window
              |
              v
      Database Conflict Control
              |
              +--> One or allowed capacity
              |
              +--> Conflicts rejected

The test must verify that overbooking does not occur.

## 53. Credit Concurrency Test

Example:

    Wallet Balance = 1000

    Request A = 700
    Request B = 500

Expected:

    A -> HELD
    B -> INSUFFICIENT_CREDITS

The resulting wallet and ledger must remain balanced.

## 54. Queue Performance Test

Measure:

- enqueue rate;
- processing rate;
- message age;
- retry rate;
- dead-letter rate;
- worker concurrency;
- recovery time.

The queue must not be treated as the source of Job state.

## 55. Worker Performance Test

Measure:

- artifact validation throughput;
- Job processing throughput;
- result processing throughput;
- worker CPU;
- worker memory;
- queue latency.

Workers must remain duplicate-safe under load.

## 56. Database Performance Test

Measure:

- connection utilization;
- query latency;
- lock waits;
- deadlocks;
- CPU;
- memory;
- storage latency;
- transaction throughput.

The database connection budget must remain within safe capacity.

## 57. Artifact Performance Test

Test:

- small artifact;
- typical artifact;
- large artifact;
- concurrent uploads;
- validation throughput;
- digest calculation;
- object storage throughput.

Large artifact data must not be embedded in normal API envelopes.

## 58. WebSocket Performance Test

Measure:

- concurrent connections;
- event rate;
- connection churn;
- reconnect behavior;
- event latency;
- duplicate handling;
- resource-scoped ordering.

High-frequency telemetry must use an appropriate bounded mechanism.

## 59. Lab Agent Performance Test

Measure:

- concurrent resources;
- heartbeat rate;
- command rate;
- telemetry rate;
- reconnect rate;
- command latency;
- Agent CPU/memory.

Physical robot control performance must be tested separately.

## 60. Soak Testing

Long-running staging tests should validate:

- memory stability;
- connection stability;
- queue stability;
- storage growth;
- log growth;
- telemetry growth;
- reconciliation;
- scheduled cleanup.

A soak test should run long enough to expose leaks or gradual degradation.

## 61. Resilience Testing

Staging should test controlled failures:

- API instance restart;
- worker restart;
- scheduler restart;
- reconciler restart;
- queue disruption;
- database failover where supported;
- object storage temporary failure;
- Lab Agent disconnect;
- WebSocket disconnect.

## 62. Recovery Acceptance

After a failure:

- durable state remains correct;
- duplicate processing is safe;
- Jobs do not silently disappear;
- Runs are reconciled;
- credits remain correct;
- resources are released or marked uncertain;
- results are eventually consistent.

## 63. Security Testing

Staging must validate:

- authentication;
- authorization;
- tenant isolation;
- object access;
- artifact access;
- result access;
- API input validation;
- rate limiting;
- secret handling;
- TLS;
- security headers;
- container vulnerabilities;
- IaC policy;
- dependency vulnerabilities.

## 64. Security Scan Gates

Production promotion must be blocked for:

- critical unresolved vulnerabilities;
- unacceptable high-risk findings;
- exposed secrets;
- public database access;
- broken tenant isolation;
- privileged container violations;
- critical dependency vulnerabilities.

Exceptions require documented security approval.

## 65. Staging Observability

Staging must be close to Production observability.

Required:

- structured logs;
- metrics;
- distributed traces;
- dashboards;
- alerts;
- request correlation;
- Job/Run correlation;
- Lab correlation.

## 66. Staging Dashboards

Recommended dashboards:

- API;
- WebSocket;
- Jobs;
- Runs;
- queue;
- database;
- object storage;
- Lab Agent;
- security;
- deployment;
- cost.

## 67. Staging Alerting

Alerts should include:

- API outage;
- error rate;
- latency;
- queue backlog;
- worker failures;
- DB saturation;
- storage failures;
- Lab Agent offline;
- deployment failure;
- security findings.

## 68. Staging Logs

Logs must not contain:

- passwords;
- tokens;
- signing keys;
- payment credentials;
- private secrets.

Logs should contain safe correlation identifiers.

## 69. Staging Deployment Rollback

Rollback should follow:

    Failed Release
         |
         v
    Stop Promotion
         |
         v
    Identify Last Known Good Digest
         |
         v
    Deploy Previous Digest
         |
         v
    Verify Health
         |
         v
    Run Smoke Tests
         |
         v
    Record Result

Database migrations must follow their documented compatibility strategy.

## 70. Migration Rollback Policy

Database rollback is not assumed to be automatic.

Preferred strategy:

- backward-compatible migration;
- restore/forward-fix if required;
- controlled rollback only when safe.

Every migration must document its recovery strategy.

## 71. Promotion Criteria

A Staging release candidate may be promoted only when:

- functional tests pass;
- integration tests pass;
- E2E tests pass;
- API contract tests pass;
- security gates pass;
- performance targets are acceptable;
- migration is validated;
- observability is healthy;
- backup/recovery requirements are satisfied;
- no unresolved P0/P1 blocker remains;
- release documentation is complete.

## 72. Promotion Gate

The gate is:

    Release Candidate
          |
          v
    Functional
          |
          v
    Integration
          |
          v
    E2E
          |
          v
    Security
          |
          v
    Performance
          |
          v
    Resilience
          |
          v
    Operational Review
          |
          v
    Promotion Approval
          |
          v
    Production

Any mandatory gate failure blocks promotion.

## 73. P0/P1 Promotion Rules

| Issue | Promotion |
|---|---|
| P0 open | Block |
| Critical security finding | Block |
| Broken E2E flow | Block |
| Data corruption | Block |
| Incorrect credit accounting | Block |
| Overbooking | Block |
| Unsafe Lab behavior | Block |
| P1 functional defect | Normally block |
| Minor UI defect | Case-by-case |
| Non-critical observability improvement | May defer |
| Optimization opportunity | May defer |

## 74. Release Approval

Production promotion requires explicit approval from appropriate owners.

Minimum approval domains:

- Engineering;
- QA/Release;
- Security;
- SRE/Operations.

Physical robot deployment additionally requires the separate human safety gate.

## 75. Staging Access During Release

During formal release validation:

- changes are frozen;
- only release-related deployments are permitted;
- test data is controlled;
- administrative changes are restricted;
- performance tests are coordinated;
- Lab resources are reserved.

A release candidate should not be modified during final acceptance.

## 76. Staging Change Freeze

The staging freeze begins when formal acceptance starts.

Only:

- approved release candidate;
- approved configuration;
- approved test data;

may change during the gate.

Unrelated development changes are prohibited.

## 77. Staging Environment Reset

After release validation, Staging may be reset.

Reset should:

- archive test evidence;
- remove disposable test data;
- remove temporary objects;
- clear queues;
- reseed baseline data;
- verify migrations;
- run smoke tests.

Reset must preserve required release evidence.

## 78. Staging Test Evidence

Evidence should include:

- CI run;
- image digest;
- migration version;
- test results;
- security scan;
- performance results;
- resilience results;
- observability status;
- release notes;
- approval record.

Evidence must be linked to the release candidate.

## 79. Staging Data Retention

Retention should be long enough to support release analysis.

Recommended starting policy:

| Data | Retention |
|---|---|
| Test results | 30–90 days |
| Logs | 14–30 days |
| Telemetry | 14–30 days |
| Video | 7–14 days |
| Temporary artifacts | 14–30 days |
| Release evidence | Release-defined |
| Security findings | Longer per policy |

Final values depend on cost and compliance requirements.

## 80. Staging Cost Controls

Staging should be cost-controlled but not aggressively optimized at the expense
of production parity.

Controls include:

- budget;
- alerts;
- resource limits;
- lifecycle policies;
- bounded observability retention;
- scheduled non-test shutdown where safe;
- storage cleanup.

## 81. Performance Test Cost Control

Performance testing can temporarily increase cloud costs.

Before a major performance run:

- expected duration;
- expected compute;
- expected database load;
- expected storage;
- expected egress;
- expected observability volume

should be estimated.

Performance tests must not run indefinitely.

## 82. Staging Capacity

Staging should be sized to represent expected Production behavior sufficiently
to identify architectural problems.

It does not need to match Production capacity one-for-one.

Capacity differences must be documented so that performance results are not
misinterpreted.

## 83. Performance Result Interpretation

Performance results must record:

- workload;
- request rate;
- concurrency;
- dataset size;
- artifact size;
- environment capacity;
- database tier;
- worker count;
- resource limits;
- latency;
- errors;
- saturation.

A simple statement such as “performance passed” is insufficient evidence.

## 84. Production Parity Exceptions

Any deliberate Staging/Production difference must be documented.

Example:

    Production API replicas = 4
    Staging API replicas = 2

The exception must explain:

- why;
- expected impact;
- how results are interpreted.

## 85. Staging Lab Model

Preferred hierarchy:

    Automated CI
        |
    Simulated Lab Agent
        |
    Controlled Test Lab
        |
    Production Lab

The simulated Lab Agent remains mandatory for automated tests.

Physical test labs are supplementary.

## 86. Physical Staging Lab

If used, the physical lab must provide:

- isolated network;
- dedicated resources;
- identified operators;
- safety procedures;
- maintenance state;
- Agent identity;
- resource inventory;
- telemetry;
- local E-stop.

Cloud commands must not replace local safety systems.

## 87. Staging Job Lifecycle Validation

Every release candidate must demonstrate:

    CREATED
       |
    QUEUED
       |
    VALIDATING
       |
    ALLOCATING
       |
    DEPLOYING
       |
    STARTING
       |
    RUNNING
       |
    STOPPING
       |
    COMPLETED

Failure branches must also be validated.

## 88. Staging Reconciliation

The release candidate must validate reconciliation for:

- stale Job;
- stale Run;
- stale resource allocation;
- Lab Agent disconnect;
- queue redelivery;
- incomplete artifact;
- missing result;
- object/database mismatch.

## 89. Staging Credit Reconciliation

Credit tests must verify:

- ledger balance;
- wallet projection;
- reservation state;
- consumption;
- release;
- refund;
- duplicate requests.

The ledger must remain immutable.

## 90. Staging Booking Reconciliation

Booking tests must verify:

- booking state;
- resource allocation;
- cancellation;
- expiration;
- Job relationship;
- credit relationship.

Booking remains entitlement; resource allocation remains execution capacity.

## 91. Staging API Authority

REST remains authoritative for:

- project;
- artifact;
- booking;
- credit;
- Job;
- Run;
- result;
- Lab state.

WebSocket is used to notify clients of changes.

## 92. Staging Security Boundary

Staging must preserve the same high-level trust boundaries:

    User / Studio
          |
        HTTPS
          |
    Control Plane
          |
    Internal Services
          |
       Lab Agent
          |
    Robot / Simulator

No direct user-to-robot control path is permitted.

## 93. Staging Protocol Compatibility

Staging must validate:

- protocol version;
- envelope schema;
- commands;
- responses;
- events;
- errors;
- idempotency;
- correlation;
- timestamps.

Protocol changes must be backward-compatible where required for rolling
deployment.

## 94. Staging Release Documentation

Every release candidate must have:

- version;
- change summary;
- known issues;
- migration notes;
- configuration changes;
- security findings;
- test evidence;
- rollback plan.

## 95. Staging Incident Handling

If a staging incident occurs:

1. Stop the affected validation.
2. Preserve logs and evidence.
3. Identify release/configuration.
4. Assess data integrity.
5. Recover environment.
6. Re-run failed validation.
7. Record root cause.
8. Determine whether Production promotion remains possible.

## 96. Staging Environment Ownership

| Area | Owner |
|---|---|
| Architecture | CLOUD-ARCH |
| Deployment | DEVOPS |
| Reliability | SRE |
| Database | DB-ENG |
| Security | SEC-ENG |
| Testing | QA-ENG |
| Lab | LAB-INT |
| Release | Release Manager |
| Cost | FIN-OPS |

# 97. Phase Mapping

| Phase | Staging Objective |
|---|---|
| Phase 0 | Staging architecture and environment |
| Phase 1 | Control Plane deployment |
| Phase 2 | Resource/artifact validation |
| Phase 3 | Async execution |
| Phase 4 | Commercial flows |
| Phase 5 | Remote execution |
| Phase 6 | Physical/test lab |
| Phase 7 | Results/realtime |
| Phase 8 | Production readiness |

## 98. Phase 0

Staging establishes:

- production-like network;
- IaC;
- IAM;
- secrets;
- environment isolation.

Acceptance:

- [ ] Staging is reproducibly provisioned.
- [ ] Production remains isolated.

## 99. Phase 1

Validate:

- API;
- WebSocket;
- PostgreSQL;
- migrations;
- deployment.

Acceptance:

- [ ] Control Plane deploys.
- [ ] migrations pass.
- [ ] smoke tests pass.

## 100. Phase 2

Validate:

- platform;
- resources;
- artifact storage;
- artifact validation.

Acceptance:

- [ ] artifact path passes.
- [ ] compatibility rules pass.

## 101. Phase 3

Validate:

- queue;
- workers;
- scheduler;
- reconciliation.

Acceptance:

- [ ] async Job flow passes.
- [ ] failure recovery passes.

## 102. Phase 4

Validate:

- booking;
- credit plans;
- reservations;
- consumption;
- refunds.

Acceptance:

- [ ] commercial state is correct.
- [ ] concurrency tests pass.

## 103. Phase 5

Validate:

- remote execution;
- Job/Run;
- resource allocation.

Acceptance:

- [ ] complete execution passes.
- [ ] failure paths pass.

## 104. Phase 6

Validate:

- Lab Agent;
- controlled physical lab where approved.

Acceptance:

- [ ] Agent connectivity passes.
- [ ] reconciliation passes.
- [ ] safety review is separate.

## 105. Phase 7

Validate:

- telemetry;
- WebSocket;
- results;
- video where applicable.

Acceptance:

- [ ] realtime works.
- [ ] result flow works.
- [ ] reconnect works.

## 106. Phase 8

Validate:

- security;
- performance;
- resilience;
- backup;
- restore;
- DR;
- operations.

Acceptance:

- [ ] production readiness gate passes.

# 107. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Staging differs from Production | Critical | Parity matrix |
| Production data leakage | Critical | Synthetic data policy |
| Release candidate drift | High | Immutable image digest |
| Migration failure | Critical | Staging-first migration |
| False performance confidence | High | Record capacity/workload |
| Inadequate load | High | Representative tests |
| Test data contamination | Medium | Reset and isolated datasets |
| Shared access misuse | High | RBAC |
| Physical lab incident | Critical | Local safety authority |
| Queue behavior mismatch | High | Same technology/semantics |
| Observability gap | High | Production-like stack |
| Cost growth | Medium | Budget and lifecycle |
| Security finding | Critical | Promotion gate |
| Recovery failure | Critical | Resilience testing |
| Incomplete rollback | High | Release rollback plan |

# 108. Open Questions

1. Final staging cloud region.
2. Final staging capacity.
3. Final production-to-staging scale ratio.
4. Exact performance targets after baseline measurement.
5. Final load-testing tool.
6. Final staging identity provider.
7. Final physical staging lab.
8. Final Lab Agent connectivity method.
9. Final video testing strategy.
10. Final staging data retention.
11. Final performance test schedule.
12. Final release approval workflow.
13. Final staging budget.
14. Final automated reset schedule.
15. Final backup retention.
16. Final DR test scope.
17. Final security penetration-testing scope.
18. Final observability retention.
19. Final canary/promotion strategy.
20. Final production migration execution process.

# 109. Full Acceptance Criteria Checklist

## Environment

- [ ] Staging is separately provisioned.
- [ ] Staging has separate credentials.
- [ ] Staging has separate database.
- [ ] Staging has separate object storage.
- [ ] Staging has separate queue.
- [ ] Staging has separate secrets.
- [ ] Staging has production-like networking.
- [ ] Staging has production-like compute.

## Production Parity

- [ ] Same application architecture.
- [ ] Same container model.
- [ ] Same PostgreSQL technology.
- [ ] Same object storage semantics.
- [ ] Same queue technology.
- [ ] Same secret model.
- [ ] Same deployment process.
- [ ] Same API contracts.
- [ ] Same event contracts.
- [ ] Same Lab Agent protocol.
- [ ] Same observability model.
- [ ] Differences are documented.

## Access

- [ ] Individual identities are used.
- [ ] RBAC is enforced.
- [ ] Developer access is limited.
- [ ] QA access is appropriate.
- [ ] Security access is available.
- [ ] DBA access is controlled.
- [ ] Production credentials are unavailable.
- [ ] Administrative actions are auditable.

## Data

- [ ] Production data is prohibited.
- [ ] Synthetic data exists.
- [ ] Test datasets are reproducible.
- [ ] Test data is tagged.
- [ ] Sensitive data is excluded.
- [ ] Data reset exists.
- [ ] Data retention is defined.

## Deployment

- [ ] Release candidate is immutable.
- [ ] Image digest is recorded.
- [ ] SBOM/provenance exists where required.
- [ ] CI validation passes.
- [ ] Deployment is automated.
- [ ] Migration is automated.
- [ ] Smoke tests pass.
- [ ] Deployment evidence is recorded.

## Functional Testing

- [ ] Authentication passes.
- [ ] Authorization passes.
- [ ] Organization isolation passes.
- [ ] Project flow passes.
- [ ] Platform flow passes.
- [ ] Artifact flow passes.
- [ ] Booking flow passes.
- [ ] Credit flow passes.
- [ ] Job flow passes.
- [ ] Run flow passes.
- [ ] Result flow passes.
- [ ] Lab flow passes.

## Negative Testing

- [ ] Invalid authentication tested.
- [ ] Authorization failure tested.
- [ ] Artifact rejection tested.
- [ ] Booking conflict tested.
- [ ] Insufficient credits tested.
- [ ] Resource unavailable tested.
- [ ] Agent offline tested.
- [ ] Deployment failure tested.
- [ ] Runtime failure tested.
- [ ] Stop failure tested.
- [ ] Result failure tested.
- [ ] Duplicate requests tested.

## API and Protocol

- [ ] REST contracts pass.
- [ ] OpenAPI validation passes.
- [ ] Error codes pass.
- [ ] Idempotency passes.
- [ ] Pagination passes.
- [ ] WebSocket authentication passes.
- [ ] WebSocket reconnect passes.
- [ ] Event duplication is safe.
- [ ] Event correlation is valid.
- [ ] Protocol version is validated.

## Performance

- [ ] Baseline load tested.
- [ ] Normal load tested.
- [ ] Peak load tested.
- [ ] Burst load tested.
- [ ] Sustained load tested.
- [ ] Booking concurrency tested.
- [ ] Credit concurrency tested.
- [ ] Queue throughput tested.
- [ ] Worker throughput tested.
- [ ] Database performance tested.
- [ ] Artifact upload tested.
- [ ] WebSocket scale tested.
- [ ] Lab Agent scale tested.
- [ ] Results documented with workload/capacity.

## Resilience

- [ ] API restart tested.
- [ ] Worker restart tested.
- [ ] Scheduler restart tested.
- [ ] Reconciler restart tested.
- [ ] Queue disruption tested.
- [ ] Lab Agent disconnect tested.
- [ ] WebSocket reconnect tested.
- [ ] Database recovery tested where applicable.
- [ ] Object storage recovery tested where applicable.
- [ ] Job reconciliation tested.
- [ ] Run reconciliation tested.
- [ ] Credit reconciliation tested.

## Security

- [ ] Vulnerability scanning passes.
- [ ] Dependency scanning passes.
- [ ] Container scanning passes.
- [ ] IaC scanning passes.
- [ ] Secret scanning passes.
- [ ] Tenant isolation passes.
- [ ] Object authorization passes.
- [ ] Artifact authorization passes.
- [ ] Result authorization passes.
- [ ] TLS is enabled.
- [ ] No critical unresolved security issue exists.

## Observability

- [ ] Logs are structured.
- [ ] Metrics exist.
- [ ] Traces exist.
- [ ] Request IDs exist.
- [ ] Job/Run IDs correlate.
- [ ] Lab IDs correlate.
- [ ] Dashboards exist.
- [ ] Alerts exist.
- [ ] Release markers exist.
- [ ] Observability is sufficient for incident diagnosis.

## Operations

- [ ] Rollback procedure exists.
- [ ] Migration recovery procedure exists.
- [ ] Backup exists.
- [ ] Restore is tested.
- [ ] Runbooks exist.
- [ ] Incident procedure exists.
- [ ] Release evidence is retained.
- [ ] Promotion decision is recorded.

## Cost

- [ ] Staging budget exists.
- [ ] Cost alerts exist.
- [ ] Resources are tagged.
- [ ] Storage lifecycle exists.
- [ ] Log retention is bounded.
- [ ] Telemetry retention is bounded.
- [ ] Performance test cost is controlled.
- [ ] Idle resources are controlled.

# 110. Promotion Checklist

Before Production promotion:

- [ ] Release candidate identified by immutable digest.
- [ ] Changelog approved.
- [ ] Migration plan approved.
- [ ] Rollback/recovery plan approved.
- [ ] Smoke tests pass.
- [ ] Regression tests pass.
- [ ] E2E tests pass.
- [ ] Security scans pass.
- [ ] Performance tests pass.
- [ ] Resilience tests pass.
- [ ] Observability is healthy.
- [ ] No P0 defect remains.
- [ ] No critical security issue remains.
- [ ] Credit ledger validation passes.
- [ ] Booking concurrency validation passes.
- [ ] Lab Agent validation passes.
- [ ] Result validation passes.
- [ ] Operational runbooks are ready.
- [ ] Production configuration has been reviewed.
- [ ] Human safety review is separately complete if physical robots are involved.
- [ ] Promotion approval is recorded.

# 111. Final Staging Invariants

The Staging environment must preserve these invariants:

1. Staging is isolated from Production.
2. Staging uses production-like architecture.
3. The release candidate is immutable.
4. The same artifact is promoted toward Production.
5. Production data is prohibited.
6. Test data is reproducible.
7. PostgreSQL remains authoritative.
8. Object storage remains authoritative for large binaries.
9. Queue remains transport.
10. REST remains durable state authority.
11. WebSocket remains realtime notification transport.
12. Workers remain idempotent.
13. Reconciliation remains enabled.
14. Booking and allocation remain separate.
15. Job and Run remain separate.
16. Credit accounting remains immutable.
17. Lab Agent remains the cloud/lab boundary.
18. Physical safety remains local.
19. Performance tests are evidence-based.
20. Security gates can block promotion.
21. Failed acceptance blocks promotion.
22. Production credentials never enter Staging.
23. Staging access is more restricted than Development.
24. Reset is controlled and auditable.
25. Release evidence is retained.
26. Production readiness requires explicit approval.

# 112. Final Staging Validation Path

The complete staging path is:

    Development
         |
         v
    Release Candidate
         |
         v
    Immutable Artifact
         |
         v
    Staging Deployment
         |
         v
    Database Migration
         |
         v
    Smoke Tests
         |
         v
    Functional Tests
         |
         v
    Integration Tests
         |
         v
    E2E Tests
         |
         v
    Security Tests
         |
         v
    Performance Tests
         |
         v
    Resilience Tests
         |
         v
    Operational Review
         |
         v
    Promotion Approval
         |
         v
    Production

The governing principle is:

> **Staging is the final engineering proof that the exact immutable release
> candidate can operate on production-like infrastructure, with controlled
> synthetic data, validated security, performance, resilience, observability
> and Lab integration, before it is permitted to operate real customer
> workloads or physical production robots.**
