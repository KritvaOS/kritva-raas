# Kritva RaaS Deployment Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Deployment Architecture |
| Path | `docs/architecture/DEPLOYMENT_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Deployment Model | Environment-isolated, CI/CD-driven |
| Application Model | Desktop + Control Plane + Workers + Lab Agent |
| Backend Model | Production-oriented modular monolith |
| Primary Database | PostgreSQL |
| Primary Object Store | Object Storage |
| Lab Boundary | Lab Agent |
| Robot Runtime | Kritva Runtime |
| Status | Architecture Baseline |

## 2. Purpose

This document defines how Kritva RaaS software is packaged, deployed, upgraded,
validated, rolled back, and operated across local, development, staging, and
production environments.

The architecture covers:

- RaaS Studio;
- Web Console where applicable;
- Control Plane;
- background workers;
- PostgreSQL;
- object storage;
- queue;
- cloud infrastructure;
- Lab Agent;
- Kritva Runtime;
- robot platform software;
- configuration;
- secrets;
- CI/CD;
- release promotion;
- rollout;
- rollback;
- disaster recovery deployment.

The fundamental deployment principle is:

> **Build once, validate progressively, promote immutable releases, and deploy physical robot software only through a controlled lab boundary.**

## 3. Scope

This document covers:

1. Deployment environments.
2. Environment isolation.
3. Repository and build inputs.
4. CI/CD.
5. Studio packaging.
6. Backend packaging.
7. Worker deployment.
8. Database migration deployment.
9. Cloud infrastructure deployment.
10. Lab Agent deployment.
11. Kritva Runtime deployment.
12. Robot platform deployment.
13. Configuration management.
14. Secret management.
15. Artifact registries.
16. Release promotion.
17. Canary deployment.
18. Rolling deployment.
19. Rollback.
20. Database rollback strategy.
21. Lab rollback.
22. Version compatibility.
23. Health checks.
24. Observability.
25. Disaster recovery.
26. Phase 0-8 implementation.

## 4. Goals

The deployment architecture shall:

1. Separate development from production.
2. Make releases reproducible.
3. Make deployed versions identifiable.
4. Prevent unvalidated software from reaching production.
5. Support automated CI/CD.
6. Support independent Studio releases.
7. Support backend and worker releases.
8. Support controlled Lab Agent releases.
9. Support controlled Kritva Runtime releases.
10. Support rollback.
11. Protect production credentials.
12. Support database migration safety.
13. Support staged robot deployment.
14. Preserve execution compatibility.
15. Minimize service downtime.
16. Provide deployment auditability.

## 5. Non-Goals

This document does not define:

- application business logic;
- detailed UI architecture;
- detailed database schema;
- detailed API resource definitions;
- robot mechanical design;
- physical safety certification;
- exact cloud-provider-specific resource names.

Those concerns are covered by the corresponding architecture documents.

## 6. Deployment Principles

The deployment model follows:

1. Immutable releases.
2. Environment isolation.
3. Build once, promote many.
4. Automated validation.
5. Least privilege.
6. Explicit production approval.
7. Reversible deployments.
8. Backward-compatible migrations.
9. Version compatibility checks.
10. Observable deployments.
11. Controlled physical deployment.
12. Fail-safe lab rollout.
13. No direct production modification from developer workstations.

## 7. Deployment Topology

    Developer
       |
       v
    Git Repository
       |
       v
    CI Pipeline
       |
       +--> Test
       +--> Security Scan
       +--> Build
       +--> Package
       +--> Sign
       |
       v
    Artifact Registry
       |
       +-------------------+
       |                   |
       v                   v
    Development         Staging
                           |
                           v
                       Acceptance
                           |
                           v
                       Production
                           |
             +-------------+-------------+
             |                           |
             v                           v
        Control Plane                 Lab Agent
                                           |
                                           v
                                      Kritva Runtime
                                           |
                                           v
                                         Robot

## 8. Environment Model

The baseline environments are:

1. Local.
2. Development.
3. Staging.
4. Production.

Environment boundaries are security and operational boundaries.

## 9. Local Environment

Local is the developer environment.

It supports:

- Studio development;
- backend development;
- worker development;
- database development;
- mock object storage;
- mock queue;
- mock Lab Agent;
- simulated robot execution.

Local must not require production credentials.

## 10. Development Environment

Development is the shared integration environment.

It supports:

- branch integration;
- CI validation;
- API integration;
- Studio/backend integration;
- database migrations;
- mock or development Lab Agent;
- simulated robots.

Development may contain unstable software.

No production customer data should be used by default.

## 11. Staging Environment

Staging is production-like.

It supports:

- release candidate validation;
- production-like infrastructure;
- production-like authentication;
- realistic database behavior;
- realistic object storage;
- realistic queue behavior;
- test lab;
- end-to-end acceptance.

Staging is the final software promotion gate before production.

## 12. Production Environment

Production hosts:

- customer Control Plane;
- production workers;
- production database;
- production object storage;
- production queue;
- production observability;
- production Lab connectivity.

Production must be isolated from development and staging.

## 13. Environment Matrix

| Property | Local | Development | Staging | Production |
|---|---|---|---|---|
| Purpose | Developer | Integration | Release validation | Customer service |
| Data | Synthetic | Synthetic/Test | Controlled | Production |
| Auth | Dev | Dev | Production-like | Production |
| DB | Local | Managed/isolated | Managed/isolated | Managed/HA |
| Queue | Local/mock | Dev | Staging | Production |
| Object Store | Local/mock | Dev | Staging | Production |
| Lab | Mock | Simulated | Test Lab | Physical Labs |
| Deployment | Manual/local | Automated | Automated | Controlled |
| Approval | None | CI | Release gate | Explicit |
| Monitoring | Developer | Integration | Production-like | Full |

## 14. Environment Isolation

Each environment should have separate:

- database;
- object-storage namespace;
- queue;
- secrets;
- credentials;
- network;
- configuration;
- observability namespace.

A development service must not accidentally connect to production.

## 15. Environment Naming

A consistent environment naming scheme should be used.

Example:

    kritva-raas-local
    kritva-raas-dev
    kritva-raas-staging
    kritva-raas-prod

Resource names should make environment ownership unambiguous.

## 16. Repository Model

The repository is:

    KritvaOS/kritva-raas

The monorepo contains:

    apps/
        studio/
        backend/

    packages/
        ui/
        contracts/
        api-client/
        auth/
        config/
        utils/

    database/
    cloud/
    tests/
    docs/

Deployment configuration belongs with the software it deploys, while secrets remain
outside source control.

## 17. Build Reproducibility

Builds should be reproducible from:

- source commit;
- lockfiles;
- build configuration;
- dependency versions;
- toolchain version.

Every release should be traceable to an immutable source revision.

## 18. Version Identity

Every deployable component must have a version.

Examples:

    Studio 0.1.0
    Control Plane 0.1.0
    Worker 0.1.0
    Lab Agent 0.1.0
    Kritva Runtime 0.1.0

Where appropriate, releases may share a platform release identifier.

## 19. Release Manifest

A release manifest should identify:

    release_version
    git_commit
    build_timestamp
    component_versions
    database_schema_version
    protocol_version
    artifact_format_version
    supported_platform_versions

This allows compatibility verification.

## 20. CI/CD Overview

The target pipeline is:

    Commit
       |
       v
    Pull Request
       |
       +--> Lint
       +--> Unit Tests
       +--> Integration Tests
       +--> Security Scans
       |
       v
    Merge
       |
       v
    Build
       |
       v
    Package
       |
       v
    Sign
       |
       v
    Publish
       |
       v
    Development
       |
       v
    Staging
       |
       v
    Production Approval
       |
       v
    Production

## 21. CI Stages

Minimum CI stages:

1. Source validation.
2. Formatting/linting.
3. Unit tests.
4. Integration tests.
5. Contract tests.
6. Security scanning.
7. Build.
8. Packaging.
9. Artifact signing.
10. Deployment validation.

## 22. Pull Request Validation

Pull requests should run:

- frontend lint;
- frontend unit tests;
- backend unit tests;
- contract tests;
- database migration validation;
- integration tests;
- security scans;
- build validation.

Pull requests must not have access to production secrets.

## 23. Merge Validation

After merge:

- build immutable artifacts;
- run integration tests;
- publish versioned artifacts;
- deploy development;
- execute smoke tests.

## 24. Artifact Registry

The deployment system should use a controlled registry for:

- container images;
- Studio packages;
- backend packages where applicable;
- Lab Agent packages;
- Runtime packages;
- signed release manifests.

Artifacts must be versioned and immutable.

## 25. Registry Security

The registry should enforce:

- authenticated publishing;
- least-privilege access;
- immutable versions;
- vulnerability scanning;
- retention policies;
- audit logging.

Developers should not have unrestricted production artifact deletion rights.

## 26. Build Once, Promote Many

A release should be built once.

The same immutable artifact should be promoted:

    Development
        |
        v
    Staging
        |
        v
    Production

Environment-specific configuration is injected at deployment time.

The binary itself should not be rebuilt merely because the environment changes.

## 27. Configuration Separation

Configuration is separated from application packages.

Example:

    Application Binary
          +
    Environment Configuration
          +
    Secret References
          |
          v
    Deployment

This prevents environment-specific secrets from entering release artifacts.

## 28. Configuration Categories

Configuration includes:

- environment;
- API endpoints;
- database connection references;
- queue configuration;
- object-storage configuration;
- feature flags;
- platform policies;
- runtime policies;
- observability configuration.

Secrets are not ordinary configuration.

## 29. Secret Deployment

Secrets are retrieved from the environment's secret manager.

Production secrets must never be stored in:

- Git;
- CI logs;
- container images;
- Studio installers;
- Lab Agent packages.

## 30. Infrastructure as Code

Cloud infrastructure should be defined using Infrastructure as Code.

IaC should cover:

- networking;
- compute;
- database;
- object storage;
- queue;
- secrets integration;
- monitoring;
- alerting;
- load balancing.

## 31. IaC Pipeline

    IaC Source
       |
       v
    Validate
       |
       v
    Plan
       |
       v
    Review
       |
       v
    Apply
       |
       v
    Verify

Production changes require controlled approval.

## 32. Infrastructure State

Infrastructure state must be:

- remotely managed where appropriate;
- access-controlled;
- backed up;
- versioned;
- protected from unauthorized modification.

## 33. Database Deployment

Database schema changes use versioned migrations.

Deployment sequence:

    Release
       |
       v
    Migration Validation
       |
       v
    Backup / Readiness
       |
       v
    Expand Migration
       |
       v
    Application Deployment
       |
       v
    Backfill
       |
       v
    Contract Migration

## 34. Migration Principle

Production migrations should follow:

> **Expand → Migrate → Switch → Contract**

Avoid destructive changes in the same deployment that first requires the new schema.

## 35. Database Compatibility

The application should remain compatible with the database during rolling deployments.

Example:

    Old Backend
          \
           +--> Compatible Schema
          /
    New Backend

This allows rollback without immediate schema reversal.

## 36. Database Rollback

Database rollback should not normally mean reverting destructive schema changes.

Preferred strategy:

- deploy backward-compatible schema;
- deploy application;
- correct application version;
- defer destructive cleanup.

This makes application rollback safer.

## 37. Studio Packaging

RaaS Studio is a desktop application based on:

- Tauri;
- React;
- TypeScript;
- Rust native layer.

Packages are generated for supported host platforms.

Initial targets:

- Linux x86_64;
- Windows x86_64.

Future targets:

- macOS Apple Silicon;
- other supported platforms as required.

## 38. Studio Release Pipeline

    Studio Source
       |
       v
    Frontend Build
       |
       v
    Rust/Tauri Build
       |
       v
    Package
       |
       v
    Sign
       |
       v
    Publish
       |
       v
    Update Metadata

## 39. Studio Package Types

The exact installer format may vary by platform.

Examples:

    Linux
        AppImage / deb / rpm

    Windows
        MSI / installer

    macOS
        DMG / signed application bundle

The release system should retain platform-specific package metadata.

## 40. Studio Code Signing

Studio packages should be signed for production distribution.

Signing protects against:

- package tampering;
- unofficial redistribution;
- supply-chain modification.

Signing keys must be protected separately from developer workstations.

## 41. Studio Update Model

Studio should support controlled updates.

An update flow may be:

    Studio
       |
       v
    Check Release Metadata
       |
       v
    Verify Signature
       |
       v
    Download Package
       |
       v
    Install
       |
       v
    Restart
       |
       v
    Health Check

Updates must not silently downgrade to an untrusted version.

## 42. Studio Version Compatibility

Studio must validate compatibility with:

- API version;
- protocol version;
- artifact format;
- authentication requirements.

A newer Studio may communicate with an older backend only when compatibility is
explicitly supported.

## 43. Backend Packaging

The Control Plane is packaged as a production deployment unit.

It includes:

- API server;
- domain modules;
- repository adapters;
- configuration;
- health endpoints;
- metrics;
- structured logging.

The architecture remains a modular monolith initially.

## 44. Worker Packaging

Workers may be packaged separately from the API process.

Worker categories may include:

- artifact validation;
- scheduling;
- job dispatch;
- result processing;
- cleanup;
- reconciliation.

Workers share application/domain contracts with the Control Plane.

## 45. Backend Deployment Topology

    Load Balancer
          |
          v
    API Instances
       |       |
       +---+---+
           |
     +-----+------+
     |            |
     v            v
 PostgreSQL    Queue
                  |
                  v
               Workers
                  |
                  v
             Object Storage

## 46. Backend Scaling

The Control Plane should be horizontally scalable.

API instances should be stateless with respect to durable business state.

State belongs in:

- PostgreSQL;
- object storage;
- queue;
- appropriate cache where introduced.

## 47. Health Endpoints

Backend deployments should expose:

- liveness;
- readiness;
- version;
- dependency health where appropriate.

Example conceptual endpoints:

    /health/live
    /health/ready
    /health/version

Detailed endpoint names are implementation-defined.

## 48. Readiness Semantics

An instance is ready only when it can safely serve requests.

Readiness may validate:

- database connectivity;
- required configuration;
- required secret availability;
- critical dependency state.

Non-critical dependencies should not necessarily make the entire API unavailable.

## 49. Worker Health

Workers should expose:

- process health;
- queue consumption status;
- version;
- dependency status.

Worker failures should be detected without making the entire API unavailable.

## 50. Deployment Health Checks

Every deployment should verify:

1. Process starts.
2. Configuration loads.
3. Database connectivity works.
4. Queue connectivity works.
5. Object storage access works.
6. API readiness succeeds.
7. Smoke tests succeed.
8. Metrics are visible.
9. Logs are visible.

## 51. Rolling Backend Deployment

Recommended default:

    Instance 1  Old
    Instance 2  Old
    Instance 3  Old

          |
          v

    Instance 1  New
    Instance 2  Old
    Instance 3  Old

          |
          v

    Instance 1  New
    Instance 2  New
    Instance 3  Old

          |
          v

    All New

Traffic remains available if sufficient capacity is maintained.

## 52. Canary Deployment

For high-risk production releases:

    Existing Fleet
          |
          +--> 90% Old
          |
          +--> 10% New
                  |
                  v
              Observe
                  |
          +-------+-------+
          |               |
        Healthy         Failure
          |               |
          v               v
      Increase         Rollback

Canary percentage should be configurable.

## 53. Production Promotion

Production promotion requires:

- successful staging;
- acceptance criteria;
- security checks;
- migration readiness;
- rollback plan;
- release approval.

The release record must identify the promoted version.

## 54. Release Approval

Production approval should verify:

- release version;
- source commit;
- CI status;
- staging status;
- known issues;
- database migration;
- compatibility;
- rollback procedure;
- operational readiness.

## 55. Backend Rollback

If the new backend is unhealthy:

1. Stop promotion.
2. Reduce traffic to new version.
3. Restore previous application version.
4. Confirm readiness.
5. Confirm critical API flows.
6. Investigate.
7. Record incident.

Database rollback should follow the migration compatibility strategy.

## 56. Worker Rollback

Workers should be version-compatible with queued messages.

During rollback:

- stop new worker version;
- drain or preserve compatible work;
- start previous worker;
- reconcile failed jobs.

Messages must not assume only one worker version exists unless explicitly controlled.

## 57. Queue Deployment Safety

Queue messages should use versioned schemas where necessary.

A worker must reject or safely ignore incompatible messages rather than silently
processing them incorrectly.

## 58. API Contract Deployment

API contracts are versioned.

Production deployment should ensure:

    Studio Version
          |
          v
    API Version
          |
          v
    Contract Version

Breaking changes require an explicit compatibility strategy.

## 59. Protocol Deployment

Lab Protocol versions are independently identified.

The Control Plane must not send unsupported commands to an older Lab Agent.

Compatibility should be negotiated or validated during agent connection.

## 60. Lab Agent Packaging

Lab Agent is a security-sensitive deployment unit.

Packages should contain:

- agent executable;
- configuration schema;
- service definition;
- protocol version;
- version metadata;
- signature.

Secrets are provisioned separately.

## 61. Lab Agent Deployment Flow

    Release
       |
       v
    Sign
       |
       v
    Registry
       |
       v
    Lab Operator / Update Agent
       |
       v
    Verify Signature
       |
       v
    Install
       |
       v
    Health Check
       |
       v
    Register
       |
       v
    Enable Scheduling

## 62. Lab Agent Installation

The initial installation should:

1. Install trusted package.
2. Configure lab identity.
3. Provision credentials.
4. Configure cloud endpoint.
5. Configure local runtime.
6. Verify connectivity.
7. Verify resource discovery.
8. Report health.

## 63. Lab Agent Upgrade

Upgrades should support:

- version validation;
- signature verification;
- configuration compatibility;
- graceful shutdown;
- installation;
- restart;
- health validation;
- rollback.

## 64. Lab Agent Rollback

If an upgrade fails:

1. Disable scheduling.
2. Preserve active execution state.
3. Restore previous agent version.
4. Restart.
5. Re-authenticate.
6. Reconcile resources/jobs.
7. Resume only after health verification.

A rollback must not accidentally start an unknown or unauthorized workload.

## 65. Kritva Runtime Deployment

Kritva Runtime is deployed to the target execution environment.

Deployment must validate:

- hardware platform;
- OS;
- runtime version;
- kernel compatibility where relevant;
- required drivers;
- device interfaces;
- security policy.

## 66. Runtime Versioning

Runtime versions should be immutable releases.

Example:

    Kritva Runtime
        1.0.0
        1.1.0
        1.1.1

A platform should declare its supported runtime versions.

## 67. Runtime Compatibility

Execution requires:

    Artifact
       +
    Platform
       +
    Runtime
       +
    SDK
       |
       v
    Compatible

Otherwise execution is rejected.

## 68. Robot Platform Deployment

A platform deployment may contain:

- operating system;
- Kritva Runtime;
- drivers;
- platform adapter;
- robot-specific services;
- safety integration;
- configuration.

Platform-specific deployment should be tested in staging/test labs before production.

## 69. Robot Software Release

Robot software should use staged deployment:

    Development Robot
          |
          v
    Test Robot
          |
          v
    Staging Lab
          |
          v
    Production Lab
          |
          v
    Production Fleet

Not every release should automatically reach every physical robot.

## 70. Physical Deployment Gate

Physical deployment requires:

- software validation;
- compatibility validation;
- safety validation;
- rollback plan;
- human approval where required.

The software pipeline must not bypass the human safety gate.

## 71. Lab Deployment Groups

Production resources may be grouped:

    LAB-A
      |
      +--> Canary Robot
      +--> General Fleet

A release should first deploy to a canary resource where practical.

## 72. Robot Canary

Canary deployment:

    New Runtime
       |
       v
    Robot A
       |
       +--> Health
       +--> Safety
       +--> Telemetry
       +--> Test Job
       |
       v
    Approval
       |
       v
    Robots B..N

## 73. Robot Rollback

Robot rollback must account for:

- active execution;
- runtime compatibility;
- configuration;
- drivers;
- safety;
- hardware state.

Rollback should first place the resource into a controlled state.

## 74. No Blind Robot Rollback

A robot should not automatically revert software merely because a cloud deployment
failed.

Physical deployment state must be evaluated locally.

## 75. Deployment State Machine

Conceptual deployment lifecycle:

    REQUESTED
       |
       v
    VALIDATING
       |
       v
    APPROVED
       |
       v
    DEPLOYING
       |
       v
    VERIFYING
       |
       +----> FAILED
       |
       v
    ACTIVE
       |
       v
    RETIRED

## 76. Deployment Record

Every production deployment should record:

- deployment ID;
- release version;
- component;
- target;
- environment;
- operator/automation identity;
- start time;
- completion time;
- result;
- rollback information.

## 77. Deployment Audit

Deployment events must be auditable.

Examples:

- release promoted;
- infrastructure changed;
- database migration applied;
- Lab Agent upgraded;
- Runtime upgraded;
- robot platform updated;
- rollback executed.

## 78. Configuration Deployment

Configuration changes should follow a controlled process.

    Change
       |
       v
    Validate
       |
       v
    Review
       |
       v
    Deploy
       |
       v
    Observe
       |
       v
    Rollback if required

High-risk security configuration should require stronger approval.

## 79. Feature Flags

Feature flags may be used for gradual activation.

Flags should support:

- environment scope;
- organization scope where appropriate;
- platform scope;
- controlled rollout;
- audit.

Feature flags must not be used to bypass security controls.

## 80. Production Data Protection

Production deployments must never use destructive test data operations.

Examples prohibited by default:

- database reset;
- test seed overwrite;
- production object deletion;
- broad tenant data modification.

## 81. Deployment Windows

High-risk infrastructure and robot deployments may use controlled maintenance windows.

Emergency fixes may use expedited procedures with full audit.

## 82. Zero-Downtime Objective

For stateless API deployments, the target is minimal or zero planned downtime.

This requires:

- rolling deployment;
- readiness checks;
- backward-compatible schema;
- sufficient capacity.

Physical robot deployment has different availability semantics.

## 83. Backend Maintenance

If maintenance is unavoidable:

- announce maintenance;
- prevent new bookings/jobs where necessary;
- allow active operations to reach safe boundaries;
- perform deployment;
- validate;
- reopen scheduling.

## 84. Lab Maintenance

Before lab maintenance:

1. Stop new scheduling.
2. Identify active bookings.
3. Complete or safely stop active jobs.
4. Place resources into maintenance state.
5. Perform deployment.
6. Verify.
7. Re-enable scheduling.

## 85. Production Rollout Sequence

Recommended sequence:

    Release Candidate
       |
       v
    Staging
       |
       v
    Acceptance
       |
       v
    Production Infrastructure
       |
       v
    Database Expand
       |
       v
    Backend Canary
       |
       v
    Worker Rollout
       |
       v
    Backend Fleet
       |
       v
    Lab Canary
       |
       v
    Robot Fleet
       |
       v
    Production Verification

## 86. Rollback Decision

Rollback triggers may include:

- readiness failure;
- elevated error rate;
- latency regression;
- queue failure;
- database errors;
- authentication failures;
- security alert;
- lab connectivity failure;
- robot health failure;
- safety concern.

## 87. Automated Rollback

Automation may roll back software when objective thresholds are exceeded.

Physical robot rollback should normally require stronger controls because hardware
and safety state are involved.

## 88. Deployment Observability

Monitor:

- deployment state;
- API errors;
- latency;
- CPU;
- memory;
- database connections;
- queue depth;
- worker failures;
- object storage failures;
- lab connectivity;
- robot health.

## 89. Deployment Correlation

Every deployment should have a deployment ID.

Logs and metrics should be correlatable to:

    deployment_id
    release_version
    git_commit
    environment

## 90. Release Verification

After deployment verify:

- version endpoint;
- health;
- API authentication;
- project flow;
- artifact flow;
- booking flow where appropriate;
- job flow;
- WebSocket;
- object storage;
- queue;
- Lab Agent connectivity.

## 91. Smoke Test

A production smoke test should use a controlled test path that does not affect
customer data or consume uncontrolled physical resources.

Example:

    Health
      |
      v
    Login
      |
      v
    Platform Query
      |
      v
    Controlled Test Job
      |
      v
    Result
      |
      v
    Verify

## 92. Deployment Compatibility Matrix

| Component | Must Be Compatible With |
|---|---|
| Studio | API + Auth + Contract |
| Backend | DB Schema + Queue + Object Store |
| Worker | Queue + DB + Domain Contract |
| Lab Agent | Lab Protocol + Runtime |
| Runtime | Platform + Kernel/OS |
| Artifact | Platform + Runtime + SDK |
| Robot Platform | Runtime + Drivers + Safety |

## 93. Release Train

A release may contain:

- Studio version;
- backend version;
- worker version;
- protocol version;
- Lab Agent version;
- Runtime version.

Not all components must be released simultaneously.

## 94. Independent Studio Releases

Studio can be released independently when:

- API compatibility is preserved;
- artifact format is compatible;
- authentication is compatible.

This reduces coupling between desktop and backend releases.

## 95. Independent Backend Releases

Backend releases may include:

- API;
- domain logic;
- workers;
- migrations.

Worker compatibility must be maintained during rollout.

## 96. Independent Lab Releases

Lab Agent and Runtime may have separate release cycles.

Protocol compatibility must be explicitly managed.

## 97. Artifact Format Versioning

The `.krv` artifact format must have a version.

Example:

    artifact_format_version = 1

A runtime must reject unsupported artifact formats safely.

## 98. Protocol Versioning

Lab Protocol versions must be explicit.

Example:

    protocol_version = 1

Agent and Control Plane should negotiate or validate compatibility.

## 99. API Versioning

REST uses:

    /api/v1/

Breaking API changes require a new major version.

Compatible additions should remain within the supported major version.

## 100. Deployment Dependency Ordering

Preferred order:

    Infrastructure
       |
       v
    Database Expand
       |
       v
    Backend
       |
       v
    Workers
       |
       v
    Lab Agent
       |
       v
    Runtime
       |
       v
    Robot Platform

Actual ordering may differ when compatibility permits parallel deployment.

## 101. Cloud Infrastructure Deployment

Cloud infrastructure should be provisioned before application deployment.

Baseline resources include:

- network;
- load balancer;
- compute;
- PostgreSQL;
- object storage;
- queue;
- secrets;
- observability.

## 102. Cloud Infrastructure Rollback

Infrastructure changes should be reversible where practical.

Destructive changes require:

- backup;
- migration plan;
- explicit approval;
- recovery procedure.

## 103. Production Database Deployment

Production database changes require:

- migration review;
- backup readiness;
- lock analysis;
- execution time estimate;
- compatibility check;
- monitoring;
- rollback strategy.

## 104. Object Storage Deployment

Object storage changes include:

- bucket/container creation;
- policies;
- encryption;
- lifecycle;
- access rules.

Changes must preserve existing customer objects.

## 105. Queue Deployment

Queue deployment includes:

- queues;
- retry policy;
- dead-letter queues;
- visibility timeout;
- access policy.

Changes must preserve active work where required.

## 106. Lab Gateway Deployment

The cloud-to-lab gateway should be deployed independently from robot networks.

It provides:

- secure connection termination;
- agent authentication;
- protocol handling;
- routing;
- observability.

## 107. Lab Agent Connection

After deployment:

    Lab Agent
       |
       v
    Authenticate
       |
       v
    Register
       |
       v
    Heartbeat
       |
       v
    Capability Discovery
       |
       v
    Ready

The Control Plane must not schedule an agent before successful registration.

## 108. Resource Discovery

Lab deployment must verify:

- robot identity;
- platform;
- runtime;
- capabilities;
- health;
- safety state;
- maintenance state.

Only eligible resources become schedulable.

## 109. Deployment and Resource State

Resource states may include:

    UNKNOWN
    OFFLINE
    ONLINE
    READY
    BUSY
    MAINTENANCE
    ERROR
    SAFETY_LOCKED

A resource in maintenance or safety-locked state cannot receive ordinary jobs.

## 110. Deployment Failure Handling

If deployment fails:

    Deployment Failed
          |
          +--> Preserve Evidence
          |
          +--> Keep Resource Unschedulable
          |
          +--> Attempt Controlled Recovery
          |
          +--> Alert Operator
          |
          v
       Manual Review

## 111. Offline Lab Deployment

A lab may temporarily lose cloud connectivity.

Existing software should continue only within locally permitted policy.

New cloud-authorized deployments should not proceed without required authorization.

## 112. Lab Reconnection

After reconnect:

1. Authenticate.
2. Report software version.
3. Report resource state.
4. Report active jobs.
5. Report deployment status.
6. Reconcile cloud state.
7. Re-enable scheduling only if healthy.

## 113. Disaster Recovery Deployment

Recovery follows:

    Restore Infrastructure
       |
       v
    Restore Database
       |
       v
    Restore Object Access
       |
       v
    Restore Queue
       |
       v
    Deploy Control Plane
       |
       v
    Deploy Workers
       |
       v
    Reconnect Labs
       |
       v
    Reconcile Execution
       |
       v
    Resume Service

## 114. DR Execution Safety

After cloud recovery, the system must not blindly restart previously active jobs.

Active physical executions require reconciliation with actual lab state.

## 115. Backup Verification

Deployment readiness requires verified backups.

Before high-risk production changes:

- verify backup recency;
- verify backup success;
- verify restore capability according to policy.

## 116. Release Rollback Strategy

Rollback levels are:

1. Feature flag rollback.
2. Application rollback.
3. Worker rollback.
4. Configuration rollback.
5. Infrastructure rollback.
6. Lab Agent rollback.
7. Runtime rollback.

Database rollback is handled through compatibility rather than destructive reversal
where possible.

## 117. Emergency Deployment

Emergency releases may bypass normal timing but must retain:

- code review where feasible;
- automated tests;
- security validation;
- release identity;
- deployment audit;
- post-deployment review.

## 118. Production Freeze

Production freeze may be activated during:

- major incidents;
- infrastructure instability;
- security investigation;
- financial reconciliation;
- robot fleet safety investigation.

During freeze, only approved emergency changes proceed.

## 119. Deployment Security

CI/CD must enforce:

- signed releases;
- protected credentials;
- least privilege;
- protected branches;
- immutable artifacts;
- audit logs.

## 120. Deployment Secrets

CI jobs should receive only the credentials required for their stage.

For example:

    PR Job
        = no production credentials

    Staging Deployment
        = staging credentials

    Production Deployment
        = production deployment identity

## 121. Deployment Identity

Every deployment should be attributable to:

- automated pipeline identity;
- approving user;
- release version;
- source commit.

Anonymous production changes are prohibited.

## 122. Production Access

Production infrastructure should not require routine SSH access from developer
machines.

Where administrative access is necessary:

- use controlled access;
- MFA;
- audit;
- short-lived credentials;
- break-glass procedure.

## 123. Deployment Testing

Tests should include:

- package installation;
- startup;
- migration;
- rollback;
- compatibility;
- health;
- authentication;
- API;
- WebSocket;
- queue;
- object storage;
- Lab Agent;
- runtime.

## 124. Deployment Test Pyramid

    Unit
      |
      v
    Component
      |
      v
    Integration
      |
      v
    Contract
      |
      v
    End-to-End
      |
      v
    Staging
      |
      v
    Physical Lab

Each layer catches a different class of failure.

## 125. Release Acceptance

A release is acceptable only when:

- CI passes;
- staging passes;
- security checks pass;
- compatibility passes;
- deployment plan exists;
- rollback plan exists;
- operational monitoring exists.

## 126. Release Metadata

The release should retain:

- version;
- commit;
- build number;
- package checksums;
- signing metadata;
- deployment history;
- migration version.

## 127. Release Retention

Production releases should be retained long enough to support rollback.

At minimum, the currently deployed and immediately previous known-good versions
should remain available.

Longer retention should follow operational policy.

## 128. Artifact Promotion

Promotion should use immutable artifact references.

Example:

    registry/kritva/backend@sha256:...

A mutable `latest` tag should not be the production deployment authority.

## 129. Container Image Promotion

If containers are used:

    Build
      |
      v
    Scan
      |
      v
    Sign
      |
      v
    Registry
      |
      v
    Dev
      |
      v
    Staging
      |
      v
    Production

## 130. Deployment Configuration Promotion

Application binaries are immutable.

Environment-specific configuration is promoted separately.

Production configuration changes must be auditable.

## 131. Feature Rollout

Features may be released disabled.

Example:

    New Execution UI
         |
         v
    Deploy Code
         |
         v
    Feature Disabled
         |
         v
    Validate
         |
         v
    Enable Gradually

Feature flags must not be used to bypass security or safety checks.

## 132. Production Monitoring Window

After deployment, monitor:

- error rate;
- latency;
- authentication;
- database;
- queue;
- worker;
- object storage;
- WebSocket;
- lab connections;
- active runs.

A deployment should not be considered complete until the defined observation period
passes.

## 133. Deployment Completion

Deployment is complete only after:

1. New version is active.
2. Health checks pass.
3. Smoke tests pass.
4. Metrics are normal.
5. Logs are normal.
6. No critical alerts exist.
7. Lab resources are healthy where applicable.
8. Deployment record is closed.

## 134. Phase Mapping

| Phase | Deployment Scope | Primary Outcome |
|---|---|---|
| Phase 0 | Local + CI foundation | Reproducible builds |
| Phase 1 | Studio + development | Developer delivery |
| Phase 2 | Artifact pipeline | Signed packages |
| Phase 3 | Backend deployment | Control Plane |
| Phase 4 | Commercial production | Booking/credits |
| Phase 5 | Execution infrastructure | Workers/lab |
| Phase 6 | Physical deployment | Robot fleet |
| Phase 7 | Live/results | Full runtime |
| Phase 8 | Production operations | Hardened deployment |

## 135. P0 FOUNDATION — Deployment Foundation

Deliver:

- repository build system;
- package manager;
- CI;
- local environment;
- development environment;
- artifact registry;
- basic IaC.

Acceptance:

- clean checkout builds;
- tests execute;
- artifacts are reproducible;
- development deployment is automated.

## 136. P1 STUDIO Deployment

Deliver:

- Studio packaging;
- signing;
- development distribution;
- update mechanism;
- platform-specific packages.

Acceptance:

- Linux package installs;
- Windows package installs;
- application starts;
- authentication works;
- update path works.

## 137. P2 BUILD & ARTIFACT — Artifact Deployment

Deliver:

- `.krv` packaging;
- artifact registry;
- checksum;
- signing;
- validation.

Acceptance:

- artifact is immutable;
- tampering is detected;
- correct platform metadata is present;
- artifact can be promoted.

## 138. P3 CONTROL PLANE Deployment

Deliver:

- backend packaging;
- worker deployment;
- PostgreSQL migration pipeline;
- queue;
- object storage;
- staging.

Acceptance:

- backend deploys automatically;
- migrations are versioned;
- workers process jobs;
- rollback is demonstrated.

## 139. P4 BOOKING & COMMERCIAL — Commercial Deployment

Deliver:

- booking;
- credits;
- billing integration where applicable;
- production-like staging.

Acceptance:

- financial operations are tested;
- idempotency works;
- production promotion includes commercial checks.

## 140. P5 EXECUTION Deployment

Deliver:

- Lab Agent;
- lab gateway;
- runtime deployment;
- job workers;
- deployment reconciliation.

Acceptance:

- Lab Agent registers;
- jobs deploy;
- runtime starts;
- results return;
- failures are recoverable.

## 141. P6 LAB & ROBOT — Physical Robot Deployment

Deliver:

- robot software deployment;
- canary process;
- runtime compatibility;
- safety gate;
- rollback.

Acceptance:

- test robot passes;
- staging lab passes;
- production canary passes;
- human safety review is complete.

## 142. P7 LIVE & RESULTS Deployment

Deliver:

- WebSocket;
- telemetry;
- video;
- results;
- observation infrastructure.

Acceptance:

- live execution works;
- telemetry streams;
- video works;
- results persist;
- reconnect works.

## 143. P8 PRODUCTION Deployment

Deliver:

- production CI/CD;
- canary deployment;
- monitoring;
- rollback;
- DR;
- backup;
- security hardening;
- operational runbooks.

Acceptance:

- production deployment is repeatable;
- rollback is demonstrated;
- DR is tested;
- deployment audit is complete.

## 144. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Production deployment failure | Critical | Staging + canary + rollback |
| Database migration failure | Critical | Expand/migrate/switch/contract |
| Incompatible Studio/backend | High | Contract/version checks |
| Lab Agent incompatibility | Critical | Protocol negotiation |
| Runtime incompatibility | Critical | Platform compatibility matrix |
| Robot deployment failure | Critical | Canary + safety gate |
| Secret leakage | Critical | Secret manager |
| Mutable artifact | High | Immutable registry |
| CI compromise | Critical | Protected pipelines |
| Infrastructure drift | High | IaC |
| Rollback failure | Critical | Regular rollback tests |
| Queue incompatibility | High | Versioned messages |
| Configuration drift | High | Versioned configuration |
| Offline lab state | High | Reconciliation |
| Deployment observability gap | High | Deployment telemetry |

## 145. Risk: Database Migration Cannot Roll Back

Mitigation:

- backward-compatible schema;
- expand/migrate/contract;
- backups;
- migration testing;
- delayed destructive changes.

## 146. Risk: Robot Runtime Upgrade Breaks Hardware

Mitigation:

- hardware compatibility matrix;
- test robot;
- staging lab;
- canary robot;
- health validation;
- controlled rollback;
- human safety approval.

## 147. Risk: CI/CD Credential Compromise

Mitigation:

- short-lived credentials;
- workload identity;
- protected environments;
- no production secrets in PR jobs;
- audit;
- least privilege.

## 148. Risk: Lab Agent Upgrade Disconnects Lab

Mitigation:

- signed packages;
- compatibility validation;
- local rollback;
- staged rollout;
- maintenance state;
- operator verification.

## 149. Risk: Backend Rollback Leaves Schema Incompatible

Mitigation:

- expand first;
- preserve backward compatibility;
- deploy old version before contract migration;
- perform destructive cleanup only after stabilization.

## 150. Risk: Release Artifact Drift

Mitigation:

- immutable artifact digest;
- build-once promotion;
- release manifest;
- registry immutability.

## 151. Risk: Configuration Drift

Mitigation:

- IaC;
- configuration versioning;
- deployment audit;
- periodic drift detection.

## 152. Open Questions

1. Which CI/CD platform will be selected?
2. Which artifact registry will be used?
3. Which IaC technology will be used?
4. Which container runtime will be used?
5. Will backend deployment use Kubernetes or managed container compute?
6. What exact Studio update mechanism will be used?
7. Which code-signing infrastructure will be used for Studio?
8. Which signing mechanism will be used for Lab Agent?
9. Which signing mechanism will be used for Kritva Runtime?
10. Will production releases require manual approval?
11. What is the required production canary duration?
12. What automated rollback thresholds will be used?
13. What staging environment size is required?
14. How closely must staging mirror production?
15. Which database migration framework will be used?
16. Which database backup mechanism will be used?
17. What is the production RPO/RTO?
18. What release cadence is expected?
19. What maintenance windows are permitted?
20. How will emergency releases be governed?
21. What platforms are included in the first Studio release?
22. What exact robot runtime update mechanism will be used?
23. Can Runtime rollback be fully automated on each platform?
24. What hardware-specific deployment checks are mandatory?
25. What physical safety approval process will be used?
26. Which lab deployment model will support remote updates?
27. How will offline labs receive security updates?
28. What is the minimum supported Lab Agent version?
29. How long will previous releases remain available?
30. Which deployment metrics define a successful rollout?

## 153. Deployment Architectural Invariants

The following invariants must remain true:

1. Development and production environments are isolated.
2. Production credentials are never used in local development.
3. Production releases originate from controlled CI/CD.
4. Production artifacts are immutable.
5. Releases are traceable to source commits.
6. Production promotion requires staging validation.
7. Application deployment supports rollback.
8. Database migrations favor backward compatibility.
9. Workers remain compatible with queued work during rollout.
10. API compatibility is explicitly versioned.
11. Lab Protocol compatibility is explicitly versioned.
12. Lab Agent software is signed.
13. Kritva Runtime releases are identifiable and verifiable.
14. Physical robot deployment requires controlled rollout.
15. Physical deployment cannot bypass safety review.
16. Lab resources remain unschedulable during unsafe deployment states.
17. Production changes are auditable.
18. Deployment configuration is separated from application binaries.
19. Secrets are never packaged into releases.
20. Build-once promotion is preferred.
21. Production deployment is observable.
22. Rollback procedures are tested.
23. Disaster recovery includes deployment recovery.
24. Offline lab state is reconciled after reconnect.
25. No production robot is upgraded solely because a cloud build succeeded.

## 154. Full Acceptance Criteria Checklist

### Environment Architecture

- [ ] Local environment is defined.
- [ ] Development environment is defined.
- [ ] Staging environment is defined.
- [ ] Production environment is defined.
- [ ] Environments have separate credentials.
- [ ] Environments have separate databases.
- [ ] Environments have separate object storage.
- [ ] Environments have separate queues.
- [ ] Production data is isolated.
- [ ] Development cannot accidentally access production.

### CI/CD

- [ ] Pull-request validation exists.
- [ ] Unit tests execute in CI.
- [ ] Integration tests execute in CI.
- [ ] Contract tests execute in CI.
- [ ] Security scanning executes in CI.
- [ ] Build artifacts are generated automatically.
- [ ] Artifacts are immutable.
- [ ] Releases are traceable to commits.
- [ ] Production credentials are protected.
- [ ] Production deployment is auditable.

### Artifact Registry

- [ ] Registry is authenticated.
- [ ] Publishing is restricted.
- [ ] Artifacts are immutable.
- [ ] Artifact checksums are available.
- [ ] Artifact signing is supported.
- [ ] Vulnerability scanning is enabled where applicable.
- [ ] Artifact retention is defined.
- [ ] Previous production releases remain available.

### Studio

- [ ] Linux package is generated.
- [ ] Windows package is generated.
- [ ] Production packages are signed.
- [ ] Package version is identifiable.
- [ ] Package source commit is traceable.
- [ ] Studio update mechanism is defined.
- [ ] Studio verifies update integrity.
- [ ] Studio/API compatibility is validated.
- [ ] Failed updates can be recovered.

### Backend

- [ ] Backend package is reproducible.
- [ ] Backend is deployable independently.
- [ ] Backend is stateless with respect to durable state.
- [ ] Health checks exist.
- [ ] Readiness checks exist.
- [ ] Rolling deployment works.
- [ ] Canary deployment is supported where required.
- [ ] Backend rollback is documented.
- [ ] Deployment version is observable.

### Workers

- [ ] Workers are packaged.
- [ ] Worker health is observable.
- [ ] Worker queue compatibility is defined.
- [ ] Worker deployment is controlled.
- [ ] Worker rollback is supported.
- [ ] Duplicate work is handled safely.
- [ ] Failed jobs can be reconciled.

### Database

- [ ] Database migrations are versioned.
- [ ] Migrations are tested.
- [ ] Expand/migrate/switch/contract is supported.
- [ ] Production backups are verified.
- [ ] Destructive migrations require approval.
- [ ] Application rollback remains schema-compatible.
- [ ] Migration execution is audited.

### Cloud Infrastructure

- [ ] Infrastructure is defined as code.
- [ ] Infrastructure changes are reviewed.
- [ ] Infrastructure state is protected.
- [ ] Network is environment-isolated.
- [ ] Production infrastructure is protected.
- [ ] Infrastructure drift can be detected.
- [ ] Infrastructure rollback/recovery is documented.

### Lab Agent

- [ ] Lab Agent package is versioned.
- [ ] Lab Agent package is signed.
- [ ] Installation is documented.
- [ ] Registration is supported.
- [ ] Heartbeat is supported.
- [ ] Capability discovery is supported.
- [ ] Upgrade is supported.
- [ ] Rollback is supported.
- [ ] Credential rotation is supported.
- [ ] Offline behavior is defined.

### Kritva Runtime

- [ ] Runtime package is versioned.
- [ ] Runtime package is signed.
- [ ] Platform compatibility is defined.
- [ ] Runtime update is controlled.
- [ ] Runtime rollback is supported where technically feasible.
- [ ] Runtime health is validated.
- [ ] Runtime security policy is validated.

### Robot Platform

- [ ] Robot software package is versioned.
- [ ] Hardware compatibility is validated.
- [ ] Test robot deployment exists.
- [ ] Staging lab deployment exists.
- [ ] Canary deployment exists.
- [ ] Production deployment requires approval.
- [ ] Rollback procedure exists.
- [ ] Safety state is validated.
- [ ] Maintenance state prevents scheduling.

### Release Promotion

- [ ] Development deployment succeeds.
- [ ] Staging deployment succeeds.
- [ ] Staging acceptance passes.
- [ ] Security validation passes.
- [ ] Release manifest exists.
- [ ] Production approval exists.
- [ ] Production canary succeeds.
- [ ] Production rollout succeeds.
- [ ] Post-deployment verification succeeds.

### Rollback

- [ ] Studio rollback/update recovery exists.
- [ ] Backend rollback exists.
- [ ] Worker rollback exists.
- [ ] Configuration rollback exists.
- [ ] Infrastructure recovery exists.
- [ ] Lab Agent rollback exists.
- [ ] Runtime rollback is defined.
- [ ] Robot rollback is controlled.
- [ ] Database rollback strategy is documented.
- [ ] Rollback is periodically tested.

### Observability

- [ ] Deployment IDs are recorded.
- [ ] Release versions are observable.
- [ ] Git commits are observable.
- [ ] API health is monitored.
- [ ] Database health is monitored.
- [ ] Queue health is monitored.
- [ ] Worker health is monitored.
- [ ] Lab connectivity is monitored.
- [ ] Robot health is monitored.
- [ ] Deployment alerts exist.

### Security

- [ ] CI credentials are protected.
- [ ] Production secrets are protected.
- [ ] Release artifacts are signed.
- [ ] Production access is restricted.
- [ ] Deployment actions are audited.
- [ ] Artifact registries are protected.
- [ ] Infrastructure access is least privilege.
- [ ] Emergency deployment is controlled.

### Disaster Recovery

- [ ] Infrastructure recovery is documented.
- [ ] Database recovery is documented.
- [ ] Object storage recovery is documented.
- [ ] Queue recovery is documented.
- [ ] Backend redeployment is documented.
- [ ] Worker redeployment is documented.
- [ ] Lab reconnection is documented.
- [ ] Active job reconciliation is documented.
- [ ] Recovery is tested.

### Phase Completion

- [ ] Phase 0 deployment foundation is complete.
- [ ] Phase 1 Studio deployment is complete.
- [ ] Phase 2 artifact deployment is complete.
- [ ] Phase 3 Control Plane deployment is complete.
- [ ] Phase 4 commercial deployment is complete.
- [ ] Phase 5 execution deployment is complete.
- [ ] Phase 6 physical robot deployment is complete.
- [ ] Phase 7 live/results deployment is complete.
- [ ] Phase 8 production deployment hardening is complete.

## 155. Final Deployment Architecture Baseline

Kritva RaaS deployment architecture is based on controlled promotion of immutable
software through progressively more production-like environments.

The overall model is:

    Developer
       |
       v
    Git
       |
       v
    CI
       |
       +--> Test
       +--> Security
       +--> Build
       +--> Package
       +--> Sign
       |
       v
    Artifact Registry
       |
       v
    Development
       |
       v
    Staging
       |
       +--> Acceptance
       +--> Security
       +--> E2E
       |
       v
    Production Approval
       |
       v
    Production
       |
       +--> Control Plane
       +--> Workers
       +--> Database
       +--> Object Storage
       +--> Queue
       |
       v
    Lab Gateway
       |
       v
    Lab Agent
       |
       v
    Kritva Runtime
       |
       v
    Robot

The deployment architecture intentionally separates software deployment from physical
robot activation.

A successful cloud deployment does not automatically authorize a robot fleet rollout.

The physical rollout is:

    Software Release
       |
       v
    Test Robot
       |
       v
    Staging Lab
       |
       v
    Canary Robot
       |
       v
    Human / Operational Approval
       |
       v
    Production Fleet

The primary production release principle is:

> **Build once, validate progressively, promote immutable artifacts, and deploy physical robot software only after controlled compatibility and safety validation.**

The primary rollback principle is:

> **Rollback the smallest affected layer first, preserve durable state, avoid destructive database reversal, and never perform an uncontrolled physical robot rollback.**

The deployment architecture therefore provides a controlled path from a developer
commit to a production RaaS service and ultimately to a physical robot while preserving:

- reproducibility;
- environment isolation;
- software provenance;
- security;
- compatibility;
- observability;
- rollback capability;
- lab isolation;
- physical safety.

The final deployment chain is:

    Source Commit
        |
        v
    CI Validation
        |
        v
    Immutable Release
        |
        v
    Development
        |
        v
    Staging
        |
        v
    Production
        |
        v
    Lab
        |
        v
    Robot

No stage may be skipped merely because a release appears technically correct.

This staged model is the deployment foundation for scaling Kritva RaaS from a
development system to a production multi-platform, multi-lab Robotics-as-a-Service
platform.
