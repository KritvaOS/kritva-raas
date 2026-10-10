# Kritva RaaS Development Environment Deployment

## 1. Document Control

| Item | Value |
|---|---|
| Document | Development Environment Deployment |
| Path | `docs/cloud/deployment/DEVELOPMENT.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Environment | Shared Development |
| Primary Purpose | Team integration and continuous validation |
| Deployment Model | Managed cloud development environment |
| Application Model | Modular Control Plane |
| Database | Managed PostgreSQL |
| Storage | Private object storage |
| Queue | Managed durable queue |
| Compute | Managed container platform |
| Lab Integration | Mock Lab Agent initially |
| Physical Lab | Optional development integration |
| Primary Users | Engineering team, CI, QA |
| Environment Flow | Local → Development → Staging → Production |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the architecture, provisioning, deployment, operation,
access control, data policy, cost controls and reset procedures for the shared
Kritva RaaS Development environment.

The Development environment is the first persistent cloud environment shared by
the engineering team.

It is intended to answer:

- Does the integrated Control Plane work outside an individual workstation?
- Does the application work against real managed infrastructure?
- Do API, workers, queue and database interact correctly?
- Does object storage behave correctly?
- Does the Lab Agent protocol work over a real network boundary?
- Do deployment pipelines operate reproducibly?
- Do migrations work against a persistent environment?
- Does observability work across multiple workloads?
- Can multiple developers safely share the environment?

The Development environment is therefore more than a remote copy of local
Compose.

It is the integration environment between developer workstations and Staging.

## 3. Scope

This document covers:

- Development cloud topology;
- environment provisioning;
- network configuration;
- compute;
- PostgreSQL;
- object storage;
- queue;
- secret management;
- IAM;
- deployment pipeline;
- database migration pipeline;
- artifact deployment;
- configuration;
- access control;
- tenant/data policy;
- seed data;
- test data;
- shared environment rules;
- Lab Agent connectivity;
- observability;
- cost controls;
- environment reset;
- recovery;
- operational procedures;
- Phase 0–Phase 8 mapping;
- acceptance criteria.

## 4. Non-Goals

The Development environment is not intended to provide:

- production availability;
- production capacity;
- production customer data;
- production payment settlement;
- final production security posture;
- production RPO/RTO;
- production DR;
- unrestricted physical robot control;
- production credentials;
- customer-facing service guarantees.

## 5. Development Environment Principles

The Development environment follows these principles:

1. Infrastructure is managed as code.
2. Development is isolated from production.
3. Development is persistent enough for integration work.
4. Developers do not manually modify infrastructure where IaC applies.
5. Production credentials never enter Development.
6. Production data never enters Development.
7. Shared Development data is disposable.
8. Database state remains authoritative.
9. Object storage remains private.
10. Queue remains asynchronous transport.
11. REST remains durable state authority.
12. WebSocket remains realtime transport.
13. Workers remain idempotent.
14. Reconciliation remains enabled.
15. Observability is enabled by default.
16. Cost is actively controlled.
17. The same application artifact should progress toward Staging.
18. Development does not bypass production architectural boundaries.
19. Physical safety remains local to any connected robot.
20. Reset procedures must be safe and repeatable.

# 6. Development Environment Role

The environment progression is:

    Developer Workstation
           |
           v
        Local
           |
           v
      Development
           |
           v
       Staging
           |
           v
      Production

The Development environment answers integration questions that Local cannot
answer, including:

- managed database behavior;
- real cloud networking;
- workload identity;
- managed object storage;
- managed queue;
- cloud observability;
- shared concurrency;
- CI/CD;
- deployment rollback;
- persistent asynchronous execution.

## 7. Development Topology

The logical topology is:

    Internet / Developer
           |
           v
    Identity / Access
           |
           v
    Development Edge
           |
           v
    Development Load Balancer / Gateway
           |
           v
    Private Application Network
           |
           +------------------+
           |                  |
           v                  v
       API / WS            Workers
           |                  |
           +---------+--------+
                     |
          +----------+----------+
          |          |          |
          v          v          v
       PostgreSQL  Queue    Object Storage
          |
          +-------------------+
                              |
                              v
                       Reconciliation
                              |
                              v
                       Development Lab
                              |
                              v
                       Mock Lab Agent
                              |
                              v
                      Simulated Resources

All components are isolated within the Development cloud environment.

## 8. Development Network Zones

Recommended logical network zones:

| Zone | Purpose |
|---|---|
| Edge | HTTPS/WSS ingress |
| Application | API/WebSocket |
| Worker | Async workloads |
| Data | PostgreSQL |
| Private Services | Queue, object storage endpoints, secret services |
| Management | Controlled administrative access |
| Lab Connectivity | Development Lab Agent connection |

The database and queue must not be directly exposed to the Internet.

## 9. Development Compute

Development compute should use the same workload classes as the production
architecture:

- API;
- WebSocket;
- Worker;
- Scheduler;
- Reconciliation;
- Migration;
- Administrative tasks.

The workloads may share compute capacity when cost-efficient.

Logical separation must remain visible even if physical deployment is compact.

## 10. Development Application Model

The backend remains a modular monolith.

The following are logical modules:

    Identity
    Organizations
    Projects
    Platforms
    Artifacts
    Booking
    Credits
    Billing
    Jobs
    Runs
    Results
    Lab
    Audit
    Notification

The Development environment must not introduce microservices merely because it
is deployed to multiple containers.

## 11. Development Workload Layout

Recommended baseline:

| Workload | Scaling | Criticality |
|---|---|---|
| API | 1–2 replicas | High |
| WebSocket | 1–2 replicas | High |
| Worker | 1–2 replicas | High |
| Scheduler | 1 replica | High |
| Reconciler | 1 replica | High |
| Migration | On demand | Controlled |
| Admin | On demand | Controlled |

Scaling values are initial defaults, not production capacity targets.

## 12. PostgreSQL

Development uses a managed PostgreSQL service where practical.

The database is authoritative for:

- users;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- labs;
- resources;
- results;
- audit;
- idempotency;
- outbox records.

The Development database must be independent of Local and Production.

## 13. PostgreSQL Development Policy

The database should be:

- private;
- encrypted;
- accessible only through approved workload identities/network paths;
- backed up according to development retention;
- monitored;
- migration-managed.

Development backups are for recovery from operational mistakes, not long-term
data retention.

## 14. Object Storage

Development object storage must be isolated from production.

Logical buckets or equivalent namespaces include:

    raas-dev-artifacts
    raas-dev-results
    raas-dev-logs
    raas-dev-video
    raas-dev-telemetry
    raas-dev-reports

The final provider-specific naming convention may differ.

Objects remain private.

## 15. Queue

Development uses a managed durable queue or provider-equivalent service.

Queue responsibilities include:

- artifact validation;
- Job processing;
- result processing;
- notification;
- reconciliation;
- asynchronous maintenance.

The queue is not the source of truth for Job or Run state.

## 16. Secret Management

Development secrets are stored in the Development secret store.

Examples:

- database credentials;
- queue credentials where required;
- object storage credentials;
- identity configuration;
- development signing keys;
- Lab Agent credentials;
- observability credentials.

Production secrets must never be copied into Development.

## 17. Identity and Access

Access follows:

    Developer
       |
       v
    Identity Provider
       |
       v
    Development Role
       |
       v
    Cloud / Application Authorization

Cloud IAM and application authorization are separate controls.

Cloud IAM controls infrastructure access.

Application authorization controls RaaS resources.

## 18. Development Roles

Recommended cloud roles:

| Role | Access |
|---|---|
| Developer | Application logs/status, limited deployment |
| Senior Developer | Development deployment and diagnostics |
| DevOps | Infrastructure/deployment |
| Security | Security configuration/audit |
| DBA | Database administration |
| SRE | Reliability/operations |
| Admin | Controlled full administrative access |
| CI Identity | Automated deployment only |

Human access must use individual identities.

Shared administrator accounts are prohibited.

## 19. Application Roles

Application-level roles remain:

- user;
- organization administrator;
- platform/lab administrator;
- system administrator.

A developer's cloud IAM permissions must not automatically grant application
administrator privileges.

## 20. Least Privilege

Development access must follow least privilege.

Developers should not receive:

- production credentials;
- production database access;
- unrestricted cloud administrator access;
- unrestricted object storage access;
- arbitrary Lab Agent shell access.

Emergency elevated access must be time-bounded and audited where supported.

## 21. Development Tenant Model

Development supports multiple organizations.

The environment should include:

- dedicated test organizations;
- developer sandbox organizations;
- automated test organizations.

Tenant isolation must remain active.

A developer must not access another organization merely because the environment
is shared.

## 22. Development Data Classification

| Data Class | Development Policy |
|---|---|
| Production customer data | Prohibited |
| Production credentials | Prohibited |
| Real payment credentials | Prohibited |
| Synthetic user data | Allowed |
| Synthetic robot data | Allowed |
| Synthetic telemetry | Allowed |
| Developer source code | Local by default |
| `.krv` artifacts | Allowed |
| Test results | Allowed |
| Logs | Allowed if sanitized |
| Security test data | Controlled |

## 23. Production Data Prohibition

Production data must never be copied into Development without an explicit,
approved data-sanitization process.

The default answer to:

> “Can we copy production data into Development?”

is:

> No.

Synthetic or anonymized data should be used instead.

## 24. Developer Source-Code Policy

The core RaaS development model remains:

> Build locally, execute remotely.

The Development Control Plane should receive `.krv` artifacts rather than
requiring developers to upload project source code.

Exceptions may exist for backend development where source code is necessarily
built by CI, but customer robotics source code is not required by the RaaS
execution platform.

## 25. Development Artifact Policy

Development artifacts may be:

- unsigned;
- development-signed;
- synthetic;
- short-lived.

The exact local-development signing policy must be explicit.

Production signing keys must never be reused.

Accepted development artifacts remain immutable once accepted.

## 26. Seed Data

Development must have deterministic seed data.

Seed data should include:

- development users;
- test organizations;
- platforms;
- platform versions;
- capabilities;
- credit plans;
- wallets;
- labs;
- Lab Agents;
- resources;
- sample projects;
- sample artifacts.

Seed data must not be treated as customer data.

## 27. Seed Profiles

Recommended profiles:

| Profile | Purpose |
|---|---|
| `minimal` | Basic backend integration |
| `developer` | Normal engineering |
| `e2e` | Automated end-to-end testing |
| `demo` | Complete RaaS demonstration |
| `failure` | Failure/recovery scenarios |

Example:

    make dev-seed PROFILE=developer

## 28. Seed Idempotency

Seed operations must be idempotent.

Repeated execution must not create uncontrolled duplicates.

The preferred mechanism is:

    Stable Seed Identifier
           |
           v
    Existing Record?
       /         \
     Yes          No
      |            |
      v            v
    Reuse        Create

Seed data should be clearly marked as synthetic.

## 29. Development Database Reset

Development database reset is a controlled operation.

Possible reset levels:

| Reset | Scope |
|---|---|
| Data Reset | Application data |
| Schema Reset | Schema + data |
| Storage Reset | Object storage |
| Queue Reset | Queued work |
| Full Reset | Entire environment |

A reset command must require an explicit Development environment identifier.

## 30. Full Development Reset

Conceptual flow:

    Confirm Environment = Development
             |
             v
    Stop Application Workloads
             |
             v
    Drain / Disable Queue
             |
             v
    Reset Database
             |
             v
    Reset Object Storage
             |
             v
    Reset Queue State
             |
             v
    Run Migrations
             |
             v
    Seed Data
             |
             v
    Start Application
             |
             v
    Health Validation

A production environment must never be eligible for this command.

## 31. Deployment Source

Development deployments originate from:

- Git repository;
- approved branch;
- CI pipeline.

Developers should not manually upload application containers to the shared
environment.

The preferred flow is:

    Git Push
       |
       v
    CI
       |
       +--> Build
       +--> Unit Tests
       +--> Integration Tests
       +--> Security Scan
       +--> Container Build
       |
       v
    Image Registry
       |
       v
    Development Deployment
       |
       v
    Smoke / Integration Tests

## 32. Branch Policy

The exact branch strategy may evolve, but the Development environment should
be associated with a clearly defined integration branch or approved merge
flow.

A recommended baseline is:

    feature/*
        |
        v
    pull request
        |
        v
    main
        |
        v
    Development

Direct production deployment from arbitrary feature branches is prohibited.

## 33. CI Build

The CI pipeline should perform:

- source checkout;
- dependency installation;
- static checks;
- unit tests;
- integration tests where practical;
- security scans;
- container build;
- image tagging;
- SBOM generation;
- provenance metadata;
- artifact publication.

A failed mandatory check must block Development deployment.

## 34. Container Image Policy

Development images should be immutable.

Each image must be traceable to:

- Git commit;
- build;
- CI run;
- source repository;
- dependency set.

Example conceptual identifier:

    kritva-raas/control-plane:<git-sha>

The digest is the stronger deployment identity.

## 35. Image Registry

The container registry must be private.

Registry access should use CI workload identity or short-lived credentials.

Developers should not share registry passwords.

Images must be scanned for vulnerabilities.

## 36. Development Deployment

Deployment should be automated after CI acceptance.

Flow:

    CI Success
       |
       v
    Publish Image
       |
       v
    Update Development Manifest
       |
       v
    Deploy
       |
       v
    Wait for Readiness
       |
       v
    Smoke Tests
       |
       v
    Development Ready

## 37. Same Artifact Promotion

The Development image is the candidate for higher environments.

The intended progression is:

    Build Once
       |
       v
    Development
       |
       v
    Staging
       |
       v
    Production

The image should not be rebuilt between environments.

Environment-specific configuration and secrets are injected separately.

## 38. Database Migration Pipeline

Database migrations require special treatment.

Recommended sequence:

    Build Application
          |
    Validate Migration
          |
    Deploy Migration Job
          |
    Apply Migration
          |
    Verify Schema
          |
    Deploy Application
          |
    Smoke Test

Migration compatibility must be considered when API and workers are deployed
at different times.

## 39. Migration Safety

Development should use the same migration mechanism intended for Staging and
Production.

Developers must not manually edit shared Development schema as the normal
workflow.

Emergency manual intervention must be:

- documented;
- reviewed;
- reproducible;
- followed by a migration where appropriate.

## 40. Deployment Health

After deployment, CI or deployment automation must verify:

- API health;
- readiness;
- database connectivity;
- queue connectivity;
- object storage connectivity;
- worker health;
- scheduler health;
- reconciler health;
- WebSocket connectivity.

## 41. Development Smoke Tests

Minimum smoke tests:

    GET /health
    GET /ready
    GET /version
    Authentication
    Project Create
    Platform List
    Artifact Metadata Create
    Booking Quote
    Job Create

A full E2E suite may run separately.

## 42. Development E2E Flow

The shared Development environment should periodically validate:

    Login
      |
    Project
      |
    Platform
      |
    Artifact
      |
    Booking
      |
    Credits
      |
    Job
      |
    Lab Agent
      |
    Run
      |
    Telemetry
      |
    Result

This test must use synthetic data.

## 43. Development Lab Connectivity

Initial Development should use a Mock Lab Agent.

Optional later integration may use a controlled physical development lab.

The preferred path remains:

    Development Control Plane
            |
       Secure Channel
            |
       Development Lab Agent
            |
       Simulated Resource

If a physical robot is connected, all physical safety controls remain local.

## 44. Mock Lab Agent

The Mock Lab Agent should support:

- registration;
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

This allows Development CI to test the complete execution path without physical
hardware.

## 45. Development Network Access to Lab

If a physical Development Lab is used:

    Cloud Development
          |
    Secure outbound connection
          |
    Lab Agent
          |
    Private robot network

Direct public Internet access to the robot is prohibited.

## 46. Development Observability

Development must provide enough observability to diagnose integration failures.

Minimum:

- application logs;
- infrastructure logs;
- API metrics;
- worker metrics;
- queue metrics;
- database health;
- deployment status;
- Job/Run correlation.

Recommended:

- OpenTelemetry traces;
- centralized log search;
- dashboards;
- queue-depth metrics;
- deployment markers.

## 47. Development Logging

Logs must be structured.

Recommended fields:

    timestamp
    level
    service
    environment
    request_id
    trace_id
    operation_id
    organization_id
    project_id
    artifact_id
    booking_id
    job_id
    run_id
    lab_id
    agent_id
    resource_id
    message

Secrets and credentials must never be logged.

## 48. Development Alerts

Development alerts should focus on integration failures rather than production
SLO burn rates.

Examples:

- API unavailable;
- deployment failed;
- database unavailable;
- queue backlog;
- worker crash;
- Lab Agent offline;
- storage unavailable;
- repeated E2E failure.

Alerts should not create unnecessary operational noise.

## 49. Development Cost Model

Development is shared infrastructure and therefore must be cost-controlled.

Primary cost drivers:

- compute;
- PostgreSQL;
- object storage;
- queue;
- observability;
- network egress;
- video;
- idle resources.

## 50. Cost Controls

Development should use:

- minimum viable compute;
- autoscaling limits;
- small database tier;
- lifecycle policies;
- telemetry retention limits;
- video retention limits;
- log retention limits;
- budgets;
- cost alerts;
- resource tagging;
- scheduled shutdown where practical.

## 51. Development Resource Schedule

Where supported, non-critical Development compute may be automatically scaled
down or stopped during prolonged inactivity.

However, automated shutdown must not silently interrupt:

- scheduled integration tests;
- active developer experiments;
- approved physical lab sessions.

The exact policy should be configurable.

## 52. Development Storage Policy

Development storage should have shorter retention than Production.

Example policy:

| Data | Suggested Retention |
|---|---|
| Logs | 7–14 days |
| Telemetry | 7–14 days |
| Video | 1–7 days |
| Temporary artifacts | 7–14 days |
| Results | 14–30 days |
| Audit records | Longer if required for testing |

Final values should be established based on cost and testing needs.

## 53. Cost Attribution

Resources should carry tags/labels such as:

    product=kritva-raas
    environment=development
    component=api
    owner=raas
    cost_center=engineering

Additional platform/resource tags may be added.

## 54. Cost Alerts

Development should have:

- monthly budget;
- threshold alerts;
- unexpected resource alerts;
- storage growth alerts;
- egress monitoring.

Cost alerts should be routed to the responsible engineering channel.

## 55. Shared Environment Rules

Developers must not:

- delete shared infrastructure manually;
- change production-like configuration without review;
- insert arbitrary database data without reason;
- use production credentials;
- expose internal services publicly;
- disable security controls permanently;
- modify another team's test data without authorization;
- create untracked cloud resources.

## 56. Development Change Management

Infrastructure changes follow:

    Change
       |
       v
    Git Commit
       |
       v
    Review
       |
       v
    CI Validation
       |
       v
    Development
       |
       v
    Evidence
       |
       v
    Staging Candidate

Emergency changes must be documented after the fact if immediate action is
required.

## 57. Manual Operations

Manual operations are allowed only for:

- diagnostics;
- emergency recovery;
- approved administrative actions;
- controlled database inspection;
- operational troubleshooting.

Manual changes to infrastructure must be followed by IaC reconciliation.

## 58. Development Access to Database

Default application access is through repositories and services.

Direct developer database access should be:

- read-only where possible;
- time-bounded;
- audited where supported;
- limited to approved engineers.

Direct production database access is governed separately.

## 59. Development Object Access

Developers may inspect development objects for debugging.

Direct object deletion should be restricted because it can interfere with active
tests.

The preferred deletion path is through application APIs or controlled cleanup
jobs.

## 60. Queue Administration

Queue administration is restricted to:

- DevOps;
- SRE;
- approved senior developers.

Developers should normally inspect queue state rather than manually deleting
messages.

Deleting a message can invalidate an active Job workflow.

## 61. Development Reset Types

Recommended commands:

    make dev-reset-data
    make dev-reset-storage
    make dev-reset-queue
    make dev-reset-all

Each command must display the target environment before destructive action.

Example:

    TARGET ENVIRONMENT: development
    THIS OPERATION IS DESTRUCTIVE.
    Continue? [y/N]

## 62. Development Reset Validation

After reset:

    Verify Database
       |
    Run Migrations
       |
    Seed Data
       |
    Verify Object Storage
       |
    Verify Queue
       |
    Start Workers
       |
    Verify Lab Agent
       |
    Run Smoke Tests

Reset is complete only when the environment is healthy.

## 63. Development Backup Policy

Development backups are primarily for:

- accidental deletion;
- migration recovery;
- infrastructure testing.

They are not intended to satisfy production business continuity.

Backup retention may therefore be substantially shorter than Production.

## 64. Development Recovery

Development recovery must test:

- database restore;
- object storage recovery where applicable;
- queue recreation;
- secret recreation;
- application redeployment;
- Lab Agent reconnection;
- Job/Run reconciliation.

The recovery procedure should use IaC rather than manual reconstruction.

## 65. Development Disaster Simulation

The Development environment may be used for controlled failure exercises:

- worker termination;
- API restart;
- queue delay;
- Lab Agent disconnect;
- database failover where supported;
- object storage failure simulation;
- invalid artifact;
- resource fault.

Physical safety testing remains outside cloud-only simulation.

## 66. Development Security Testing

Development is the first persistent environment where integrated security
controls should be exercised.

Tests should include:

- authentication;
- authorization;
- tenant isolation;
- artifact authorization;
- result authorization;
- role enforcement;
- invalid token;
- expired token;
- Lab Agent authentication;
- invalid protocol version.

## 67. Development Protocol Compatibility

The Development environment must use the shared contracts defined under:

    packages/contracts/
    docs/protocol/

Protocol compatibility includes:

- request envelope;
- response envelope;
- event envelope;
- error codes;
- command names;
- event names;
- versioning;
- idempotency.

## 68. Development API Versioning

Development uses the same API versioning scheme as higher environments.

Baseline:

    /api/v1/

Breaking changes require explicit versioning or compatibility strategy.

Development must not silently remove production contracts.

## 69. Development Event Handling

Events use:

- event ID;
- resource ID;
- sequence;
- correlation;
- timestamp;
- tenant context.

WebSocket delivery is at-least-once.

Clients must support:

- duplicate detection;
- reconnect;
- REST reconciliation.

## 70. Development Job Recovery

If a worker fails after a Job state transition:

    PostgreSQL State
         |
    Queue Redelivery
         |
    Worker Restart
         |
    State Inspection
         |
    Lab State Inspection
         |
    Reconciliation
         |
    Continue / Recover / Mark Failed

The Development environment should reproduce this failure mode.

## 71. Development Credit Safety

Development credit wallets are synthetic.

However, the accounting rules remain real:

- immutable ledger;
- reservation;
- release;
- consumption;
- refund;
- idempotency;
- platform-specific credit types.

Developers must not bypass the credit service to make Jobs executable.

## 72. Development Booking Safety

Booking conflicts should be tested against concurrent requests.

Example:

    User A ----+
              |
              v
          Booking Lock
              |
              +--> Confirm A
              |
    User B ----+
              |
              v
          Conflict

The database remains authoritative for conflict prevention.

## 73. Development Artifact Safety

Artifact validation should occur before deployment.

The Development Lab Agent must independently verify the artifact where the
protocol requires it.

This tests defense in depth.

## 74. Development Deployment Rollback

Rollback flow:

    Failed Deployment
          |
          v
    Identify Last Good Image
          |
          v
    Restore Application
          |
          v
    Health Check
          |
          v
    Smoke Test
          |
          v
    Record Incident

Database rollback is more complex and should normally use forward-compatible
migration strategies rather than destructive rollback.

## 75. Development Migration Failure

If a migration fails:

1. Stop application rollout.
2. Preserve logs.
3. Inspect database migration state.
4. Determine whether transaction rollback occurred.
5. Repair migration safely.
6. Re-run validation.
7. Record the result.

Blindly deleting migration history is prohibited.

## 76. Development Configuration Promotion

Configuration follows:

    Code
      |
      v
    Environment-neutral Defaults
      |
      +--> Development Configuration
      +--> Staging Configuration
      +--> Production Configuration

Secrets are injected independently.

No Development secret should be copied to Production.

## 77. Development Environment Ownership

Primary ownership:

- CLOUD-ARCH: architecture;
- DEVOPS: deployment/IaC;
- SRE: reliability/monitoring;
- SEC-ENG: security;
- DB-ENG: database;
- LAB-INT: Lab Agent;
- QA-ENG: validation.

A clear owner must exist for each incident.

## 78. Development Support Model

Development failures should be classified:

| Class | Example | Owner |
|---|---|---|
| Application | API bug | Backend |
| Infrastructure | Network failure | Cloud |
| Database | Migration issue | DBA/Backend |
| Security | Access denied unexpectedly | Security |
| Lab | Agent offline | Lab Integration |
| CI/CD | Deployment failure | DevOps |
| Cost | Unexpected spend | FinOps/SRE |

## 79. Development Documentation

The environment must document:

- architecture;
- deployment;
- configuration;
- access;
- migrations;
- reset;
- troubleshooting;
- incident handling;
- cost controls.

This document is complemented by:

    docs/cloud/architecture/
    docs/cloud/planning/
    docs/cloud/operations/
    docs/backend/development/

## 80. Phase Mapping

| Phase | Development Environment Objective |
|---|---|
| Phase 0 | Foundation and IaC |
| Phase 1 | Control Plane deployment |
| Phase 2 | Database, storage, artifacts |
| Phase 3 | Queue/workers/scheduler |
| Phase 4 | Credits/booking/commercial integration |
| Phase 5 | Remote execution |
| Phase 6 | Lab Agent integration |
| Phase 7 | Realtime/results |
| Phase 8 | Reliability/security hardening |

## 81. Phase 0 Development

Deliver:

- cloud account/project;
- Development environment boundary;
- IaC;
- network;
- IAM;
- secrets.

Acceptance:

- [ ] environment can be provisioned from code;
- [ ] access is controlled;
- [ ] environment is isolated.

## 82. Phase 1 Development

Deliver:

- API;
- WebSocket;
- PostgreSQL;
- migrations;
- health checks.

Acceptance:

- [ ] Control Plane deploys;
- [ ] DB connection works;
- [ ] migration works;
- [ ] API health passes.

## 83. Phase 2 Development

Deliver:

- object storage;
- platform/resource data;
- artifact service.

Acceptance:

- [ ] artifact upload works;
- [ ] object storage works;
- [ ] compatibility validation works.

## 84. Phase 3 Development

Deliver:

- queue;
- workers;
- scheduler;
- reconciliation;
- asynchronous Job execution.

Acceptance:

- [ ] Job flow works;
- [ ] workers are restart-safe;
- [ ] queue is observable;
- [ ] reconciliation works.

## 85. Phase 4 Development

Deliver:

- credit plans;
- wallets;
- booking;
- credit reservation;
- consumption;
- refunds.

Acceptance:

- [ ] booking/credit integration works;
- [ ] concurrency is tested;
- [ ] financial state is immutable.

## 86. Phase 5 Development

Deliver:

- remote Job execution;
- Run management;
- artifact deployment;
- resource allocation.

Acceptance:

- [ ] simulated execution works;
- [ ] failures are recoverable.

## 87. Phase 6 Development

Deliver:

- secure Lab Agent connectivity;
- Agent registration;
- heartbeat;
- resource inventory;
- command execution.

Acceptance:

- [ ] Agent connectivity works;
- [ ] Agent disconnect/reconnect works;
- [ ] reconciliation works.

## 88. Phase 7 Development

Deliver:

- telemetry;
- WebSocket;
- results;
- live execution observability.

Acceptance:

- [ ] realtime events work;
- [ ] telemetry is visible;
- [ ] results are available;
- [ ] reconnect works.

## 89. Phase 8 Development

Deliver:

- production-like security;
- failure injection;
- recovery;
- operational controls;
- cost governance.

Acceptance:

- [ ] recovery exercises pass;
- [ ] security validation passes;
- [ ] cost controls operate;
- [ ] operational runbooks are validated.

# 90. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Shared environment instability | High | Ownership + observability |
| Developers overwrite data | Medium | Tenant/test data policy |
| Production data leakage | Critical | Explicit prohibition |
| Credential leakage | Critical | Managed secrets |
| Cost growth | High | Budgets + autoscaling |
| Deployment drift | High | IaC + CI/CD |
| Migration failure | High | Controlled migrations |
| Queue corruption | High | Durable queue + recovery |
| Object storage growth | Medium | Lifecycle policies |
| Excessive logging cost | Medium | Retention/cardinality |
| Lab outage | High | Mock Agent + reconciliation |
| False production confidence | High | Staging gate |
| Shared DB contention | Medium | Resource sizing + monitoring |
| Broken seed data | Medium | Versioned deterministic seeds |
| Unauthorized access | Critical | IAM + application AuthZ |

# 91. Open Questions

1. Final cloud provider.
2. Final Development region.
3. Final container platform.
4. Final IaC tool.
5. Final identity provider.
6. Final observability platform.
7. Final queue service.
8. Final object storage service.
9. Final managed PostgreSQL tier.
10. Final development monthly budget.
11. Final automated shutdown schedule.
12. Final seed dataset implementation.
13. Final Lab Agent tunnel technology.
14. Whether Development includes physical lab access.
15. Final Development retention policy.
16. Final deployment approval threshold.
17. Final rollback automation level.
18. Final CI runner platform.
19. Final image registry.
20. Final cost allocation model.

These questions do not invalidate the approved architecture.

# 92. Full Acceptance Criteria Checklist

## Provisioning

- [ ] Development environment is provisioned through IaC.
- [ ] Environment is uniquely identifiable.
- [ ] Network is isolated.
- [ ] IAM is configured.
- [ ] Secrets are configured.
- [ ] PostgreSQL exists.
- [ ] Object storage exists.
- [ ] Queue exists.
- [ ] Compute exists.
- [ ] Observability exists.

## Access

- [ ] Individual human identities are used.
- [ ] Shared administrator accounts are prohibited.
- [ ] Least privilege is applied.
- [ ] Developer access is documented.
- [ ] CI has separate workload identity.
- [ ] Production credentials are inaccessible.
- [ ] Administrative access is auditable.

## Network

- [ ] Public edge is controlled.
- [ ] Database is private.
- [ ] Queue is private.
- [ ] Workers are private.
- [ ] Object storage is private.
- [ ] Egress is controlled.
- [ ] Lab connectivity is secure.
- [ ] Robots are not directly Internet exposed.

## Database

- [ ] PostgreSQL is managed.
- [ ] Database is private.
- [ ] Encryption is enabled.
- [ ] Migrations are automated.
- [ ] Schema version is tracked.
- [ ] Backup policy exists.
- [ ] Restore procedure exists.
- [ ] Development data is synthetic.

## Storage

- [ ] Artifact storage exists.
- [ ] Result storage exists.
- [ ] Log storage exists.
- [ ] Telemetry storage exists.
- [ ] Video storage is controlled.
- [ ] Lifecycle policies exist.
- [ ] Access is private.
- [ ] Object/database reconciliation is available.

## Queue

- [ ] Queue is durable.
- [ ] Workers consume messages.
- [ ] Retries operate.
- [ ] Dead-letter behavior exists.
- [ ] Duplicate delivery is safe.
- [ ] Queue metrics exist.

## Deployment

- [ ] CI builds application artifacts.
- [ ] Unit tests run.
- [ ] Integration tests run.
- [ ] Security scans run.
- [ ] Container image is immutable.
- [ ] SBOM is generated where required.
- [ ] Development deployment is automated.
- [ ] Smoke tests run after deployment.
- [ ] Deployment evidence is retained.

## Database Migration

- [ ] Migration validation runs in CI.
- [ ] Migration is applied before incompatible application rollout.
- [ ] Migration status is visible.
- [ ] Migration failures block unsafe rollout.
- [ ] Manual schema changes are controlled.

## Application

- [ ] API deploys.
- [ ] WebSocket deploys.
- [ ] Workers deploy.
- [ ] Scheduler deploys.
- [ ] Reconciler deploys.
- [ ] Health checks work.
- [ ] Readiness checks work.
- [ ] Configuration is externalized.

## Authentication and Authorization

- [ ] Authentication works.
- [ ] Authorization works.
- [ ] Tenant isolation works.
- [ ] Role enforcement works.
- [ ] Invalid credentials are rejected.
- [ ] Expired sessions are rejected.
- [ ] Administrative access is controlled.

## Artifact

- [ ] Artifact metadata is created.
- [ ] Artifact upload works.
- [ ] Digest validation works.
- [ ] Manifest validation works.
- [ ] Compatibility validation works.
- [ ] Object storage access is authorized.
- [ ] Lab Agent verifies artifact integrity.

## Booking and Credits

- [ ] Availability works.
- [ ] Booking works.
- [ ] Booking conflict is enforced.
- [ ] Platform-specific credits work.
- [ ] Reservation is idempotent.
- [ ] Consumption is recorded.
- [ ] Refund is recorded.
- [ ] Ledger remains immutable.

## Jobs and Runs

- [ ] Job creation works.
- [ ] Job queueing works.
- [ ] Validation works.
- [ ] Allocation works.
- [ ] Deployment works.
- [ ] Run starts.
- [ ] Run telemetry works.
- [ ] Run logs work.
- [ ] Stop/cancel works.
- [ ] Result generation works.
- [ ] Job reaches correct terminal state.

## Lab Agent

- [ ] Agent registers.
- [ ] Agent authenticates.
- [ ] Agent heartbeat works.
- [ ] Agent capabilities work.
- [ ] Resource inventory works.
- [ ] Artifact retrieval works.
- [ ] Deployment works.
- [ ] Start works.
- [ ] Stop works.
- [ ] Reconnect works.
- [ ] Reconciliation works.

## Observability

- [ ] Structured logs exist.
- [ ] Request IDs exist.
- [ ] Trace IDs exist where enabled.
- [ ] Job/Run correlation exists.
- [ ] Database health is visible.
- [ ] Queue health is visible.
- [ ] Worker health is visible.
- [ ] Lab Agent health is visible.
- [ ] Deployment health is visible.
- [ ] Alerts exist for critical failures.

## Cost

- [ ] Development budget exists.
- [ ] Cost alerts exist.
- [ ] Resources are tagged.
- [ ] Idle compute is controlled.
- [ ] Storage lifecycle exists.
- [ ] Log retention is bounded.
- [ ] Telemetry retention is bounded.
- [ ] Video retention is bounded.
- [ ] Egress is monitored.

## Reset

- [ ] Data reset exists.
- [ ] Storage reset exists.
- [ ] Queue reset exists.
- [ ] Full reset exists.
- [ ] Reset requires Development targeting.
- [ ] Reset is destructive-operation protected.
- [ ] Reset runs migrations.
- [ ] Reset seeds deterministic data.
- [ ] Reset runs smoke tests.

## Recovery

- [ ] API restart is safe.
- [ ] Worker restart is safe.
- [ ] Scheduler restart is safe.
- [ ] Reconciler restart is safe.
- [ ] Lab Agent restart is safe.
- [ ] Queue redelivery is safe.
- [ ] WebSocket reconnect works.
- [ ] Job reconciliation works.
- [ ] Run reconciliation works.
- [ ] Object/database reconciliation works.

## Security

- [ ] No production credentials are present.
- [ ] No production data is present.
- [ ] Secrets are managed.
- [ ] IAM is least privilege.
- [ ] Application AuthZ is enforced.
- [ ] Tenant isolation is tested.
- [ ] Artifact access is protected.
- [ ] Result access is protected.
- [ ] Lab commands are authorized.
- [ ] Arbitrary remote shell is unavailable.

# 93. Development Environment Exit Criteria

The Development environment is considered operational when:

- [ ] infrastructure is reproducibly provisioned;
- [ ] deployment is automated;
- [ ] PostgreSQL is healthy;
- [ ] object storage is healthy;
- [ ] queue is healthy;
- [ ] API is healthy;
- [ ] workers are healthy;
- [ ] scheduler is healthy;
- [ ] reconciler is healthy;
- [ ] Mock Lab Agent is healthy;
- [ ] seed data is available;
- [ ] full E2E flow passes;
- [ ] observability is operational;
- [ ] access controls are validated;
- [ ] cost controls are active;
- [ ] reset procedure is tested;
- [ ] recovery procedure is tested.

# 94. Final Development Invariants

The Development environment must preserve these invariants:

1. Development is separate from Production.
2. Development infrastructure is managed as code.
3. PostgreSQL remains authoritative.
4. Object storage holds large binary objects.
5. Queue remains transport, not state authority.
6. REST remains durable state authority.
7. WebSocket remains realtime notification transport.
8. Workers are idempotent.
9. Reconciliation remains enabled.
10. Source code remains local for customer RaaS execution.
11. `.krv` remains the execution artifact boundary.
12. Lab Agent remains the cloud/lab boundary.
13. Physical safety remains local.
14. Development data is synthetic.
15. Production credentials are prohibited.
16. Human access uses individual identities.
17. IAM and application authorization remain separate.
18. Environment reset cannot target Production.
19. Development deployments originate from CI.
20. Immutable artifacts are promoted toward Staging.
21. Database migrations are controlled.
22. Observability is enabled by default.
23. Cost controls are mandatory.
24. Shared environment changes are reviewable.
25. Local success is not production acceptance.

# 95. Final Development Deployment Path

The intended complete path is:

    Developer Commit
          |
          v
    Pull Request
          |
          v
    CI Validation
          |
          +--> Unit Tests
          +--> Integration Tests
          +--> Security Scans
          +--> Container Build
          +--> SBOM / Provenance
          |
          v
    Private Registry
          |
          v
    Development Deployment
          |
          v
    Database Migration
          |
          v
    Health / Readiness
          |
          v
    Smoke Tests
          |
          v
    E2E Validation
          |
          v
    Development Environment
          |
          +--> API
          +--> WebSocket
          +--> Workers
          +--> Scheduler
          +--> Reconciler
          +--> PostgreSQL
          +--> Object Storage
          +--> Queue
          +--> Lab Agent
          |
          v
    Synthetic Robot Execution
          |
          v
    Results / Telemetry / Logs

The Development environment therefore serves as the shared engineering
integration layer between reproducible local development and controlled
Staging.

The governing principle is:

> **Development must be shared, reproducible, observable, secure and disposable:
> close enough to Production to expose integration problems, but isolated
> enough that developers can experiment without risking customer data,
> production infrastructure or physical robot safety.**
