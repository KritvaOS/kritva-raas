# C-M02-DEVELOPMENT — Shared Development Environment

**Primary Phase:** P1 STUDIO  

**Supporting Phases:** P2 BUILD & ARTIFACT, P3 CONTROL PLANE  

**Milestone:** C-M02 DEVELOPMENT (P1-P3)

## 1 Objective

### 1.1 Milestone purpose

C-M02-DEVELOPMENT establishes the shared, repeatable, secure, and observable Development environment for Kritva RaaS.

The milestone converts the infrastructure foundation established by C-M01-FOUNDATION into a usable engineering environment in which backend, frontend, database, artifact, execution, and simulated-lab development can proceed against shared services without depending on production infrastructure.

The Development environment is the first shared environment in which the complete Kritva RaaS control-plane architecture can be exercised as an integrated system.

The milestone shall provide shared development instances of:

| Capability | Development requirement |
|---|---|
| Compute | Stateless API and worker execution substrate |
| PostgreSQL | Shared Development authoritative business database |
| Object storage | Artifact and result object storage |
| Queue | Durable asynchronous work transport |
| Deployment pipeline | Automated build, test, deploy, and migration workflow |
| Secrets | Development-only secret management and injection |
| Observability | Logs, metrics, traces, health, and deployment visibility |
| Dev Lab connectivity | Secure Control Plane to Development Lab Agent path |
| Network | Private-by-default service connectivity |
| DNS/TLS | Stable Development endpoints |
| IAM | Least-privilege Development identities |
| Backup | Development backup and restore capability |
| Configuration | Explicit, version-controlled, environment-specific configuration |
| Operational controls | Deployment, rollback, health checks, and recovery procedures |

### 1.2 Engineering objective

C-M02 must create an environment where an engineer can move from a reviewed repository change to a deployed Development service through an automated and reproducible path:

    Git commit
        |
        v
    CI validation
        |
        +--> lint
        +--> typecheck
        +--> unit tests
        +--> integration tests
        +--> security checks
        +--> build
        |
        v
    Development artifact
        |
        v
    Deployment pipeline
        |
        v
    Development Compute
        |
        +--> API
        +--> Worker
        +--> WebSocket infrastructure
        |
        +--> PostgreSQL
        +--> Object Storage
        +--> Queue
        +--> Secrets
        |
        v
    Development Lab Connectivity
        |
        v
    Lab Agent
        |
        v
    Simulated Robot / Development Robot

### 1.3 Milestone relationship

C-M02 consumes the foundational controls from C-M01 and makes them operational for day-to-day development.

C-M01 establishes the infrastructure foundation.

C-M02 establishes the usable shared Development environment.

C-M03 will establish Staging using the lessons, deployment mechanisms, controls, and evidence model proven here.

C-M04 will establish Production readiness and production infrastructure.

### 1.4 Primary outcome

At completion, an authorized engineer shall be able to:

1. commit a change to the Kritva RaaS repository;
2. trigger CI validation;
3. produce a versioned Development build;
4. deploy the build through the controlled pipeline;
5. apply database migrations safely;
6. connect to Development PostgreSQL through approved application paths;
7. store and retrieve artifacts/results through private object storage;
8. publish and consume asynchronous jobs through the Development queue;
9. observe API, worker, and deployment health;
10. connect the Control Plane to a Development Lab Agent;
11. execute the simulated RaaS flow;
12. diagnose failures using logs, metrics, traces, and deployment evidence;
13. roll back an application deployment without manual infrastructure reconstruction.

The Development environment is therefore an engineering system, not merely a collection of cloud resources.

---

## 2 Scope and non-scope

### 2.1 In scope

C-M02 covers the complete shared Development environment required for active Kritva RaaS implementation.

The scope includes:

- Development cloud environment configuration;
- Development compute;
- stateless API deployment;
- worker deployment;
- WebSocket-capable application infrastructure;
- Development PostgreSQL;
- Development object storage;
- Development queue;
- Development secrets;
- Development configuration;
- CI/CD integration;
- application deployment;
- database migration deployment;
- rollback;
- health checks;
- service discovery;
- DNS;
- TLS;
- observability;
- log aggregation;
- metrics;
- tracing;
- alerting for Development-critical failures;
- cost monitoring;
- Development IAM;
- Development service identities;
- Development Lab connectivity;
- Development Lab Agent identity;
- simulated robot connectivity;
- network controls;
- backup and restore validation;
- environment smoke tests;
- deployment verification;
- operational documentation;
- evidence collection.

### 2.2 Explicitly in scope

The milestone shall support the following Development architecture:

    Internet / Developer
            |
            v
    Development DNS / TLS
            |
            v
    Development Edge / Load Balancer
            |
            v
    Stateless API
            |
       +----+--------------------+
       |    |        |           |
       v    v        v           v
      DB   Queue   Object      Secrets
       |             Storage
       |               |
       +---------------+
               |
               v
          Worker Pool
               |
               v
        Execution Services
               |
               v
       Development Lab
               |
               v
         Lab Agent
               |
               v
       Simulator / Robot

### 2.3 Development environment boundaries

Development is an independently isolated environment.

The following shall not be shared directly with Production:

- PostgreSQL database;
- database credentials;
- object-storage buckets;
- object-storage credentials;
- queue;
- queue credentials;
- application secrets;
- signing keys;
- token-signing keys;
- TLS private keys where environment-specific;
- service identities;
- Lab Agent identity;
- production user data;
- production artifacts;
- production billing records;
- production credit ledger;
- production bookings;
- production robot credentials.

Development may use the same provider family as Production, but environment isolation must remain explicit.

### 2.4 Out of scope

The following are not required to be production-complete in C-M02:

- Production deployment;
- production customer traffic;
- Production payment processing;
- Production billing settlement;
- active-active multi-region;
- global traffic management;
- production-grade multi-region disaster recovery;
- physical robot fleet deployment;
- autonomous robot safety authority;
- production artifact-signing key ceremony;
- customer-scale capacity;
- production compliance certification;
- production support operations;
- commercial SLA commitments;
- production payment-provider certification;
- production subscription billing;
- final production data-retention policies;
- production customer migration;
- public marketplace;
- production CDN optimization;
- advanced autoscaling based on historical production load.

### 2.5 Development versus Production

Development must not become a disguised Production environment.

The Development environment shall be:

- isolated;
- disposable where practical;
- representative enough for integration;
- safe for engineering experimentation;
- observable;
- reproducible;
- migration-capable;
- deployment-capable;
- operationally realistic.

It may use smaller resource sizes and lower availability targets than Production, but it shall preserve the same architectural boundaries.

### 2.6 Development environment principle

The governing principle is:

> Development must be cheaper and safer than Production, but structurally similar enough that Production deployment does not require a different architecture.

---

## 3 Dependencies

### 3.1 Milestone dependencies

C-M02 depends on:

| Dependency | Required state | Reason |
|---|---|---|
| C-M01-FOUNDATION | Accepted | Network, IAM, IaC, secrets, observability and environment foundation |
| Repository | Available | CI/CD source |
| Backend architecture | Defined | API/worker deployment boundaries |
| Database architecture | Defined | PostgreSQL schema and migration strategy |
| Protocol architecture | Defined | API, WebSocket, Lab Protocol contracts |
| Security architecture | Defined | Authn, authz, secrets, tenant isolation |
| Artifact security | Defined | Artifact upload and storage controls |
| Booking schema | Defined | Shared DB migration integration |
| Execution architecture | Defined | Worker and Lab Agent requirements |
| Results architecture | Defined | Object storage and result processing |
| Development setup | Defined | Local-to-shared environment parity |
| Integration plan | Defined | End-to-end validation |

### 3.2 C-M01 dependency

C-M02 assumes C-M01 has established:

- Development cloud account/project boundary;
- environment naming;
- base network;
- IAM baseline;
- secret-management mechanism;
- KMS foundation;
- DNS ownership;
- TLS mechanism;
- logging destination;
- basic monitoring;
- infrastructure-as-code repository structure;
- backup foundation;
- cost-accounting foundation.

C-M02 shall not silently redesign these foundations.

### 3.3 Application dependencies

C-M02 depends on application modules progressively delivered by the backend and frontend milestones.

Relevant backend dependencies include:

- B-M01 Control Plane;
- B-M02 Artifact;
- B-M03 Platform;
- B-M04 Booking;
- B-M05 Execution;
- B-M06 Results;
- B-M07 Production hardening.

C-M02 may initially deploy a subset of modules, but the deployment architecture must accommodate the complete modular-monolith design.

### 3.4 Infrastructure dependencies

Required infrastructure abstractions include:

- compute adapter;
- PostgreSQL adapter;
- object-storage adapter;
- queue adapter;
- secret provider;
- observability provider;
- DNS/TLS provider;
- identity provider;
- Lab connectivity adapter.

The infrastructure implementation may use a concrete provider in Development, but application code shall not become irreversibly coupled to provider-specific APIs.

### 3.5 Development Lab dependencies

The Development Lab requires:

- Development Lab Agent;
- unique Lab Agent identity;
- secure outbound or approved bidirectional connectivity;
- heartbeat;
- registration;
- resource inventory;
- simulated or development resource;
- artifact validation;
- deployment endpoint;
- execution endpoint;
- status reporting;
- telemetry path;
- log path;
- cleanup capability.

### 3.6 Dependency rule

No task shall be marked READY unless its required infrastructure, application, contract, security, and database dependencies are explicitly identified.

---

## 4 Deliverables

### 4.1 Development environment

The milestone shall deliver an operational Development environment containing:

- shared API compute;
- shared worker compute;
- PostgreSQL;
- object storage;
- queue;
- secrets;
- network;
- DNS;
- TLS;
- IAM;
- observability;
- CI/CD;
- Development Lab connectivity.

### 4.2 Infrastructure as Code

All repeatable infrastructure shall be represented in version-controlled IaC.

The repository shall provide:

- environment configuration;
- reusable modules;
- Development variables;
- network definitions;
- compute definitions;
- database definitions;
- object-storage definitions;
- queue definitions;
- IAM definitions;
- monitoring definitions;
- DNS/TLS configuration;
- backup configuration;
- deployment configuration.

No critical Development resource shall exist solely because an engineer manually created it in a console.

### 4.3 Deployment pipeline

The pipeline shall support:

    Commit
      |
      v
    CI
      |
      +--> Static validation
      +--> Tests
      +--> Security checks
      +--> Build
      |
      v
    Development artifact
      |
      v
    Deployment approval/control
      |
      v
    Deploy API
      |
      v
    Deploy Worker
      |
      v
    Migrate DB
      |
      v
    Smoke tests
      |
      v
    Deployment evidence

### 4.4 Database environment

The Development PostgreSQL deployment shall provide:

- isolated database;
- controlled connectivity;
- migrations;
- schema ownership;
- application credentials;
- migration credentials;
- connection pooling;
- backups;
- restore verification;
- monitoring;
- audit visibility;
- controlled administrative access.

### 4.5 Object storage

Development object storage shall provide separate logical locations for:

- artifacts;
- result files;
- logs where applicable;
- video recordings where applicable;
- temporary processing objects;
- deployment/build evidence.

Object storage shall remain private by default.

### 4.6 Queue

The Development queue shall provide:

- publish;
- consume;
- acknowledgement;
- retry;
- dead-letter handling;
- visibility timeout or equivalent;
- message correlation;
- observability;
- access control.

Queue state shall not be the authoritative business state.

### 4.7 Dev Lab

The milestone shall deliver a Development Lab connection capable of executing the simulated end-to-end RaaS flow.

The preferred initial path is:

    Studio
      |
      v
    Development Control Plane
      |
      v
    Job Service
      |
      v
    Development Queue
      |
      v
    Worker
      |
      v
    Lab Protocol
      |
      v
    Development Lab Agent
      |
      v
    Simulated Robot

### 4.8 Documentation

The milestone shall deliver:

- Development environment runbook;
- deployment runbook;
- rollback runbook;
- migration runbook;
- database access policy;
- object-storage policy;
- queue operations guide;
- Lab connectivity guide;
- troubleshooting guide;
- observability guide;
- cost guide;
- environment inventory;
- ownership matrix.

### 4.9 Evidence

The milestone shall retain evidence for:

- successful IaC deployment;
- CI execution;
- application deployment;
- database migration;
- object upload/download;
- queue publish/consume;
- service health;
- Lab Agent registration;
- simulated execution;
- logs;
- metrics;
- traces;
- rollback;
- backup;
- restore.

---

## 9 Risks

### 9.1 Infrastructure drift

Risk:
Manual console changes create divergence from IaC.

Mitigation:

- IaC ownership;
- drift detection;
- restricted administrative permissions;
- documented emergency-change procedure;
- periodic plan review.

### 9.2 Development becomes Production-like in cost

Risk:
Shared Development resources become unnecessarily expensive.

Mitigation:

- right-sized compute;
- environment labels;
- budget alerts;
- idle-resource policies;
- scheduled scale-down where practical;
- cost dashboards.

### 9.3 Development differs materially from Production

Risk:
Production deployment exposes failures not visible in Development.

Mitigation:

- preserve architectural boundaries;
- use same deployment mechanisms;
- use same migration approach;
- use same object-storage and queue abstractions;
- use same authentication/authorization contracts;
- avoid Development-only application architecture.

### 9.4 Shared environment becomes unstable

Risk:
One developer's experiment affects all developers.

Mitigation:

- tenant isolation;
- quotas;
- resource limits;
- worker concurrency controls;
- namespace separation;
- test-data isolation;
- operational ownership.

### 9.5 Database migration failure

Risk:
An incompatible migration breaks Development.

Mitigation:

- migration review;
- expand-contract;
- backups;
- migration smoke tests;
- schema version tracking;
- restore procedure.

### 9.6 Queue duplicate processing

Risk:
At-least-once delivery produces duplicate work.

Mitigation:

- idempotency keys;
- durable Job/Run state;
- command deduplication;
- worker reconciliation;
- dead-letter queue.

### 9.7 Object-storage leakage

Risk:
Artifact or result objects become publicly accessible.

Mitigation:

- private buckets;
- IAM policies;
- signed/time-bound access;
- automated public-access tests;
- storage policy scanning.

### 9.8 Secret leakage

Risk:
Development secrets appear in Git, logs, artifacts, or CI output.

Mitigation:

- secret manager;
- secret scanning;
- log redaction;
- runtime injection;
- CI masking;
- no `.env` secrets in repository.

### 9.9 Lab connectivity instability

Risk:
Development Lab Agent disconnects frequently.

Mitigation:

- heartbeat;
- reconnect;
- durable state;
- retry policies;
- health dashboards;
- explicit timeout behavior;
- local safety authority.

### 9.10 Cloud control-plane failure

Risk:
Development cloud becomes unavailable during execution.

Mitigation:

- local Lab Agent/runtime authority;
- no assumption that cloud connectivity equals robot safety;
- durable run state;
- reconciliation;
- controlled reconnect;
- explicit unknown/disconnected state.

### 9.11 Unauthorized Development-to-Production access

Risk:
Development identities accidentally receive Production permissions.

Mitigation:

- separate identities;
- separate secrets;
- separate accounts/projects where practical;
- policy tests;
- deny-by-default IAM;
- periodic access review.

### 9.12 Inadequate observability

Risk:
Failures require manual investigation across multiple systems.

Mitigation:

- correlation IDs;
- centralized logs;
- metrics;
- traces;
- dashboards;
- deployment evidence;
- run-level identifiers.

### 9.13 Pipeline bypass

Risk:
Developers manually deploy untested builds.

Mitigation:

- controlled deployment permissions;
- CI gates;
- artifact provenance;
- deployment audit;
- documented emergency path.

### 9.14 Resource exhaustion

Risk:
Development workloads exhaust compute, database, queue, or storage resources.

Mitigation:

- resource limits;
- quotas;
- monitoring;
- alerts;
- cleanup jobs;
- capacity baseline.

### 9.15 Test data contamination

Risk:
Development contains real customer or Production information.

Mitigation:

- synthetic seed data;
- anonymization where data import is unavoidable;
- explicit approval;
- automated data classification checks;
- Production access denial.

### 9.16 Provider lock-in

Risk:
Application code becomes tightly coupled to one infrastructure provider.

Mitigation:

- provider adapters;
- interface-driven infrastructure integration;
- portable PostgreSQL;
- object-storage abstraction;
- queue abstraction;
- documented provider-specific boundary.

### 9.17 Physical safety confusion

Risk:
Cloud Development status is incorrectly treated as robot safety state.

Mitigation:

- Lab Agent/local runtime safety authority;
- explicit safety state;
- no remote E-stop claim;
- cloud disconnect does not imply safe;
- safety review before physical robot use.

### 9.18 Incomplete rollback

Risk:
Application rollback succeeds while database state remains incompatible.

Mitigation:

- migration compatibility rules;
- expand-contract;
- forward-compatible migrations;
- rollback tests;
- database backup.

### 9.19 Development environment becomes a hidden dependency

Risk:
Local development becomes impossible without the shared Development environment.

Mitigation:

- maintain local Docker/disposable infrastructure;
- keep Development optional for unit work;
- document local fallback;
- use contract and integration tests.

### 9.20 Insufficient ownership

Risk:
Cloud resources exist without a clear operational owner.

Mitigation:

- ownership matrix;
- task owner;
- service owner;
- escalation path;
- operational runbooks.

---

## 10 Exit criteria

C-M02-DEVELOPMENT shall be considered complete only when all of the following are true.

### 10.1 Infrastructure

- [ ] Development environment exists.
- [ ] Environment is isolated.
- [ ] Network is configured.
- [ ] DNS and TLS work.
- [ ] Compute is operational.
- [ ] PostgreSQL is operational.
- [ ] Object storage is operational.
- [ ] Queue is operational.
- [ ] Secrets are operational.
- [ ] IaC represents the environment.

### 10.2 Application

- [ ] API deploys automatically.
- [ ] Worker deploys automatically.
- [ ] Health/readiness checks work.
- [ ] Database migrations work.
- [ ] Artifact storage works.
- [ ] Result storage works.
- [ ] Queue processing works.
- [ ] Application logs are visible.

### 10.3 Lab

- [ ] Lab Agent identity works.
- [ ] Lab Agent registration works.
- [ ] Heartbeat works.
- [ ] Simulated resource is visible.
- [ ] Artifact deployment works.
- [ ] Job execution works.
- [ ] Run lifecycle is observable.
- [ ] Result collection works.
- [ ] Disconnect/reconnect behavior is verified.

### 10.4 Security

- [ ] Development credentials are isolated.
- [ ] Production credentials are absent.
- [ ] Tenant isolation tests pass.
- [ ] IAM least-privilege review is complete.
- [ ] Object-storage access tests pass.
- [ ] Database network isolation tests pass.
- [ ] Secret exposure tests pass.
- [ ] Security findings are resolved or formally accepted.

### 10.5 Operations

- [ ] Deployment runbook exists.
- [ ] Rollback runbook exists.
- [ ] Database migration runbook exists.
- [ ] Backup/restore runbook exists.
- [ ] Lab connectivity runbook exists.
- [ ] Troubleshooting guide exists.
- [ ] Dashboards exist.
- [ ] Critical alerts exist.
- [ ] Cost monitoring exists.

### 10.6 Evidence

- [ ] CI evidence retained.
- [ ] Deployment evidence retained.
- [ ] Migration evidence retained.
- [ ] Object-storage evidence retained.
- [ ] Queue evidence retained.
- [ ] Lab connectivity evidence retained.
- [ ] End-to-end execution evidence retained.
- [ ] Backup/restore evidence retained.
- [ ] Rollback evidence retained.

### 10.7 Review

- [ ] Cloud architecture review completed.
- [ ] Security review completed.
- [ ] Database review completed.
- [ ] Deployment review completed.
- [ ] Lab connectivity review completed.
- [ ] QA acceptance completed.
- [ ] Open critical risks are zero.
- [ ] No unresolved S0/S1 blocker remains.
- [ ] Any accepted residual risks are documented.
- [ ] C-M02 status is updated in tracking documentation.

### 10.8 Final milestone invariant

The following invariant must hold:

> Kritva RaaS has a repeatable, isolated, observable Development environment in which application services, PostgreSQL, object storage, queue, deployment automation, and the Development Lab Agent operate together through the approved architecture.

The following must also remain true:

> Cloud Development infrastructure is not the authority for physical robot safety.

---
