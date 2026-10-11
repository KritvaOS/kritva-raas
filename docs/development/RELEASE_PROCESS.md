# Kritva RaaS Release Process

## 1. Purpose

This document defines the production-grade release process for Kritva RaaS.

The process governs how product changes move from integrated development
through qualification, release, staged deployment, rollback capability, and
post-release review.

The process applies to the complete Kritva RaaS product:

- RaaS Studio;
- Studio Local Runtime;
- backend Control Plane;
- shared packages;
- PostgreSQL schema and migrations;
- object storage integration;
- workers;
- Lab Agent;
- simulator;
- robot runtime integration;
- cloud infrastructure;
- APIs and protocols;
- artifact format;
- security controls;
- operational tooling.

The release process is designed around:

> Build locally. Book remotely. Run on real robots.

A release is not considered complete merely because source code has been
merged or binaries have been built.

A release is complete only when:

- scope is known;
- implementation is integrated;
- tests pass;
- security gates pass;
- compatibility is validated;
- release artifacts are reproducible;
- artifacts are signed;
- deployment is qualified;
- rollback is available;
- required approvals are complete;
- communication is prepared;
- post-release monitoring is active.

## 2. Scope

This document covers:

- release planning;
- release branches;
- release candidates;
- versioning;
- release readiness;
- build;
- signing;
- artifact publication;
- Studio distribution;
- backend deployment;
- Lab Agent distribution;
- database migrations;
- protocol compatibility;
- staged rollout;
- feature flags;
- canary deployment;
- rollback;
- hotfixes;
- release communication;
- post-release monitoring;
- post-release review;
- release evidence.

It applies to:

- internal releases;
- alpha releases;
- beta releases;
- release candidates;
- general availability;
- maintenance releases;
- security releases;
- hotfix releases.

## 3. Goals

The release process shall:

1. provide repeatable releases;
2. make release readiness explicit;
3. preserve product compatibility;
4. protect customer data;
5. protect source-code privacy;
6. protect artifact integrity;
7. protect financial correctness;
8. protect physical robot safety;
9. minimize deployment risk;
10. support rapid rollback;
11. provide release traceability;
12. provide clear stakeholder communication;
13. establish post-release accountability.

## 4. Non-Goals

This document does not define:

- detailed application architecture;
- detailed database schema;
- detailed security architecture;
- individual test cases;
- physical robot safety certification;
- cloud-provider-specific implementation;
- customer-specific deployment procedures.

Those concerns are governed by the corresponding architecture and security
documents.

# 5. Release Principles

Kritva RaaS releases follow these principles:

1. Release from a known commit.
2. Build from clean source.
3. Verify dependencies.
4. Run the required qualification suite.
5. Sign release artifacts.
6. Publish only approved artifacts.
7. Separate release preparation from production rollout.
8. Roll out progressively.
9. Monitor every rollout stage.
10. Preserve rollback capability.
11. Never weaken physical safety for release speed.
12. Database changes must be backward-compatible during rollout where required.
13. Protocol changes must respect compatibility policy.
14. Release evidence must be retained.
15. Every release must have an owner.

# 6. Release Lifecycle

The canonical lifecycle is:

    PLAN
      |
      v
    SCOPE FREEZE
      |
      v
    INTEGRATION
      |
      v
    QUALIFICATION
      |
      v
    RELEASE CANDIDATE
      |
      v
    APPROVAL
      |
      v
    BUILD
      |
      v
    SIGN
      |
      v
    PUBLISH
      |
      v
    CANARY
      |
      v
    PILOT
      |
      v
    LIMITED GA
      |
      v
    FULL GA
      |
      v
    MONITOR
      |
      v
    POST-RELEASE REVIEW

# 7. Release Families

The current roadmap defines:

| Release | Purpose |
|---|---|
| R0.1 | Foundation |
| R0.2 | Core Platform |
| R0.3 | Artifact/Execution Foundation |
| R0.4 | Integrated Simulation |
| R1.0 Alpha | First integrated product |
| R1.0 Beta | Controlled product validation |
| R1.0 RC | Release candidate |
| R1.0 GA | General availability |
| R1.1 | Stabilization |
| R1.2 | Platform and operations expansion |
| R2.0 | Commercial/ecosystem expansion |

R0 releases are engineering releases.

R1.0 establishes the first integrated RaaS product release family.

# 8. Release Types

Release types include:

- feature release;
- maintenance release;
- security release;
- hotfix;
- infrastructure release;
- database migration release;
- Studio release;
- Lab Agent release.

A coordinated product release may contain several component releases.

# 9. Versioning

Product releases use Semantic Versioning:

    MAJOR.MINOR.PATCH

Prereleases use:

    MAJOR.MINOR.PATCH-alpha.N
    MAJOR.MINOR.PATCH-beta.N
    MAJOR.MINOR.PATCH-rc.N

Example:

    v1.0.0-alpha.1
    v1.0.0-beta.2
    v1.0.0-rc.1
    v1.0.0

Product version is independent from:

- protocol version;
- database migration level;
- artifact format version;
- SDK version;
- Lab Agent version.

# 10. Release Ownership

Every release must have:

| Role | Responsibility |
|---|---|
| Release Owner | Overall coordination |
| Engineering Owner | Technical readiness |
| QA Owner | Qualification evidence |
| Security Owner | Security gate |
| Infrastructure Owner | Deployment |
| Database Owner | Migration readiness |
| Lab Owner | Lab readiness |
| Safety Owner | Physical safety approval |
| Communications Owner | Release communication |

Small releases may combine roles, except required independent security or
safety approval.

# 11. Release Scope

Every release must define:

- release version;
- target date;
- included tasks;
- excluded tasks;
- known limitations;
- affected components;
- affected APIs;
- database changes;
- protocol changes;
- artifact changes;
- security changes;
- operational changes;
- physical robot impact.

# 12. Release Scope Freeze

Before qualification, the release enters scope freeze.

After scope freeze:

- new features require explicit approval;
- release-blocking defects may be fixed;
- security defects may be fixed;
- documentation corrections may be made;
- release configuration may be corrected.

Material scope changes require requalification.

# 13. Release Branch

The normal development model is trunk-based.

For release stabilization:

    main
      |
      v
    release/1.0.0
      |
      +--> release fixes
      |
      v
    v1.0.0-rc.1

Release branches are temporary.

There is no permanent `develop` branch.

# 14. Release Branch Rules

Release branches may contain:

- release-blocking fixes;
- security fixes;
- regression fixes;
- compatibility fixes;
- documentation required for release;
- deployment fixes.

Release branches should not receive unrelated features.

# 15. Release Candidate

An RC represents a build intended to be release-qualified.

An RC must have:

- frozen source scope;
- known commit;
- completed required tests;
- known dependency versions;
- migration plan;
- compatibility assessment;
- security assessment;
- release notes draft.

# 16. Release Candidate Qualification

Qualification verifies:

- functional correctness;
- contracts;
- integration;
- E2E;
- simulation;
- security;
- performance where required;
- migration;
- deployment;
- rollback.

# 17. Release Readiness

A release is READY only when all mandatory gates are satisfied.

Readiness state:

    NOT_READY
       |
       v
    QUALIFICATION
       |
       v
    READY_FOR_APPROVAL
       |
       v
    APPROVED
       |
       v
    RELEASED

# 18. Release Readiness Checklist

The release owner must confirm:

- [ ] scope approved;
- [ ] release branch/tag identified;
- [ ] CI green;
- [ ] tests qualified;
- [ ] security gates passed;
- [ ] compatibility verified;
- [ ] database migrations verified;
- [ ] artifacts built;
- [ ] artifacts signed;
- [ ] rollback verified;
- [ ] monitoring ready;
- [ ] documentation ready;
- [ ] release notes ready;
- [ ] approvals complete.

# 19. Functional Readiness

The release must verify all affected requirements.

For RaaS MVP releases, the primary journey is:

    Login
      |
      v
    Project
      |
      v
    Platform
      |
      v
    Local Build
      |
      v
    .krv Artifact
      |
      v
    Booking
      |
      v
    Upload
      |
      v
    Job
      |
      v
    Live Execution
      |
      v
    Result
      |
      v
    Rerun

# 20. Testing Readiness

Testing follows `TESTING_STRATEGY.md`.

Required testing depends on release scope.

At minimum, release qualification must include:

- unit;
- component;
- contract;
- integration;
- relevant E2E;
- relevant simulation;
- security;
- migration.

Physical releases additionally require HIL and physical qualification where
applicable.

# 21. Code Review Readiness

Every release change must have completed code review according to
`CODE_REVIEW.md`.

No release may contain unreviewed production code.

# 22. Architecture Readiness

Architecture changes must be reconciled with:

    planning/DECISIONS.md

If implementation differs from an accepted decision, the decision must be
updated or superseded before release.

# 23. Security Readiness

Security readiness includes:

- authentication;
- authorization;
- tenant isolation;
- source-code privacy;
- artifact integrity;
- secrets;
- key management;
- audit;
- dependency security;
- vulnerability review.

Critical unresolved security findings block release.

# 24. Safety Readiness

Physical robot releases require:

- simulator qualification;
- HIL qualification where applicable;
- physical test procedure;
- safety review;
- operator assignment;
- emergency stop verification;
- rollback/stop procedure.

Cloud or software approval cannot override local safety controls.

# 25. Database Readiness

Database readiness includes:

- migration reviewed;
- clean migration tested;
- upgrade migration tested;
- representative data tested;
- locking assessed;
- expand-contract strategy verified;
- rollback/recovery procedure defined.

# 26. Protocol Readiness

Protocol changes require:

- schema validation;
- producer testing;
- consumer testing;
- compatibility testing;
- version assessment;
- migration/deprecation plan.

# 27. Artifact Readiness

Release artifacts must include:

- version;
- build identity;
- manifest;
- checksum;
- signature;
- compatibility metadata;
- provenance.

Unsigned production artifacts must not be accepted.

# 28. Dependency Readiness

The release must record:

- direct dependencies;
- relevant transitive dependencies;
- versions;
- vulnerability status;
- license status.

Dependency updates that materially affect runtime behavior require qualification.

# 29. Build Reproducibility

Release builds must be reproducible from:

- tagged source;
- locked dependencies;
- controlled build environment;
- declared configuration.

The release artifact must be traceable to the source commit.

# 30. Build Provenance

The release provenance chain is:

    Release Tag
        |
        v
    Commit
        |
        v
    Source
        |
        v
    Build
        |
        v
    Artifact
        |
        v
    Signature
        |
        v
    Published Artifact

# 31. Build Environment

Production builds should use controlled CI environments.

Build workers must not require:

- developer workstation state;
- undocumented local files;
- personal credentials;
- production secrets.

# 32. Studio Release

RaaS Studio consists of:

- Tauri shell;
- React/TypeScript UI;
- Rust native layer;
- shared packages;
- local runtime functionality.

Studio release must validate:

- installation;
- startup;
- login;
- project management;
- local source handling;
- local build;
- artifact creation;
- upload;
- booking;
- execution monitoring;
- result access.

# 33. Studio Build Flow

The Studio release flow is:

    Source
      |
      v
    Clean Build
      |
      v
    Unit / Component Tests
      |
      v
    Tauri Build
      |
      v
    Platform Packaging
      |
      v
    Security Scan
      |
      v
    Sign
      |
      v
    Publish
      |
      v
    Staged Distribution

# 34. Studio Platforms

Initial production targets:

- Linux x86_64;
- Windows x86_64.

Future target:

- macOS Apple Silicon.

Platform-specific release artifacts must be independently validated.

# 35. Studio Signing

Studio installers/packages must be signed according to the platform
distribution requirements.

Signing keys must be protected using the key-management architecture.

Signing credentials must not be embedded in source or distributed build
workers.

# 36. Studio Publishing

Studio packages are published only after:

- build qualification;
- security scan;
- signing;
- release approval.

Published artifacts must be immutable.

# 37. Studio Rollout

Studio rollout should follow:

    Internal
       |
       v
    Engineering
       |
       v
    Pilot
       |
       v
    Limited GA
       |
       v
    Full GA

# 38. Studio Rollback

Studio rollback options include:

- previous installer;
- previous application version;
- feature flag;
- server-side compatibility fallback.

A Studio rollback must not leave the application incompatible with the Control
Plane.

# 39. Studio Compatibility

The release must define:

- supported backend versions;
- protocol version;
- artifact format;
- minimum runtime;
- migration requirements.

# 40. Backend Release

Backend release includes:

- API;
- application services;
- repositories;
- workers;
- schedulers;
- database integration;
- authorization;
- event handling.

# 41. Backend Build Flow

    Source
      |
      v
    Build
      |
      v
    Unit Tests
      |
      v
    Integration
      |
      v
    Contract Tests
      |
      v
    Security Scan
      |
      v
    Container/Image
      |
      v
    Sign
      |
      v
    Registry
      |
      v
    Deployment

# 42. Backend Deployment

Backend deployments should use:

- immutable build artifacts;
- controlled configuration;
- environment-specific secrets;
- health checks;
- migration coordination;
- progressive rollout.

# 43. Backend Rollout

Preferred:

    New Version
        |
        v
    Canary Instances
        |
        v
    Health Check
        |
        v
    Smoke Test
        |
        v
    Expanded Deployment
        |
        v
    Full Deployment

# 44. Backend Rollback

Rollback should normally use the previous known-good artifact.

Rollback must consider:

- database schema;
- queued messages;
- object formats;
- protocol compatibility;
- active jobs.

Database rollback is not assumed to be automatic.

# 45. Lab Agent Release

Lab Agent releases are safety-sensitive.

They must include:

- binary/package;
- version;
- supported protocol;
- supported runtime;
- platform compatibility;
- identity behavior;
- update procedure;
- rollback procedure.

# 46. Lab Agent Build Flow

    Source
      |
      v
    Build
      |
      v
    Unit Tests
      |
      v
    Integration
      |
      v
    Simulation
      |
      v
    Security Scan
      |
      v
    Package
      |
      v
    Sign
      |
      v
    Lab Qualification
      |
      v
    Staged Deployment

# 47. Lab Agent Rollout

Lab Agent rollout should progress:

    Simulator
       |
       v
    Development Lab
       |
       v
    Internal Lab
       |
       v
    Pilot Lab
       |
       v
    Production Lab Pool

# 48. Lab Agent Rollback

Rollback must preserve:

- robot safety;
- identity;
- protocol compatibility;
- configuration;
- local state.

If an update fails, the Lab Agent must enter the defined safe operational
state.

No automatic restart should create unsafe physical motion.

# 49. Database Release Flow

Database changes follow:

    Migration
       |
       v
    Local
       |
       v
    CI
       |
       v
    Development
       |
       v
    Staging
       |
       v
    Production

Production migration requires explicit approval.

# 50. Expand-Contract Strategy

For changes requiring application compatibility:

    Expand
      |
      v
    Deploy Compatible Code
      |
      v
    Migrate / Backfill
      |
      v
    Verify
      |
      v
    Contract
      |
      v
    Remove Old Structure

This reduces deployment coupling.

# 51. Queue Compatibility

During rolling deployment, old and new workers may coexist.

Therefore messages should remain compatible for the supported transition window.

# 52. Object Compatibility

Artifacts and result files must remain readable by supported consumers.

Storage schema changes must not invalidate existing customer data.

# 53. Feature Flags

Feature flags may be used to separate deployment from activation.

Flags must have:

- owner;
- default;
- scope;
- rollout percentage where applicable;
- expiration/removal plan.

Feature flags must not permanently replace architectural cleanup.

# 54. Release Configuration

Release configuration must distinguish:

- public configuration;
- operational configuration;
- restricted configuration;
- secrets.

Secrets are injected through approved secret-management mechanisms.

# 55. Release Security Controls

Release pipelines must enforce:

- protected branches;
- required reviews;
- CI gates;
- secret scanning;
- signed artifacts;
- restricted publishing;
- deployment authorization.

# 56. Signing Architecture

The conceptual flow is:

    Build System
         |
         v
    Release Artifact
         |
         v
    Signing Service
         |
         v
    Signature
         |
         v
    Artifact Registry

Production signing keys must not be freely distributed to build workers.

# 57. Artifact Registry

Published artifacts should be immutable.

The registry must support:

- version;
- checksum;
- signature;
- provenance;
- compatibility;
- publication status;
- revocation.

# 58. Release Manifest

A release manifest should identify:

    {
        "product": "kritva-raas",
        "version": "1.0.0",
        "commit": "<commit>",
        "protocol_version": "1.0",
        "artifact_format": "krv-1",
        "components": [],
        "migration": "<migration>",
        "release_channel": "stable"
    }

# 59. Release Evidence

The release record should include:

- release version;
- commit;
- branch;
- build ID;
- artifact digest;
- signature;
- test report;
- security report;
- migration report;
- approval record;
- deployment record;
- rollout metrics;
- known issues.

# 60. Release Approval

Approval requires:

| Gate | Required |
|---|---|
| Engineering | Yes |
| QA | Yes |
| Security | Scope-dependent |
| Database | Scope-dependent |
| Infrastructure | Deployment-dependent |
| Lab | Lab-dependent |
| Safety | Physical-dependent |
| Release Owner | Yes |

# 61. Approval Rules

A release cannot proceed when:

- critical tests fail;
- critical security issue is unresolved;
- migration is unsafe;
- artifact signing fails;
- required approval is missing;
- physical safety gate is open.

# 62. Known Issues

Known issues may be accepted only when:

- documented;
- risk assessed;
- impact understood;
- owner assigned where necessary;
- explicitly accepted by release authority.

Critical safety or security issues cannot be accepted merely as known issues.

# 63. Staged Rollout

The default rollout model is:

    Internal
       |
       v
    Canary
       |
       v
    Pilot
       |
       v
    Limited GA
       |
       v
    Full GA

Each stage has:

- entry criteria;
- monitoring;
- duration;
- exit criteria;
- rollback trigger.

# 64. Internal Rollout

Internal rollout validates:

- installation;
- startup;
- core workflows;
- telemetry;
- logs;
- compatibility.

Internal users should be the first real users of the release.

# 65. Canary Rollout

Canary deployment exposes the release to a small controlled population.

Canary should measure:

- error rate;
- latency;
- resource usage;
- authentication failures;
- job failures;
- booking failures;
- artifact failures.

# 66. Pilot Rollout

Pilot rollout expands to selected:

- organizations;
- labs;
- platforms;
- robots.

Physical pilots require explicit safety approval.

# 67. Limited GA

Limited GA allows controlled customer use.

The release should have:

- active monitoring;
- support readiness;
- rollback capability;
- known issue communication.

# 68. Full GA

Full GA is permitted only after staged rollout exit criteria are satisfied.

The release then becomes the default supported production version.

# 69. Rollout Stop Conditions

Rollout must stop when:

- error rate exceeds threshold;
- critical security issue appears;
- data corruption is suspected;
- tenant isolation issue appears;
- credit integrity issue appears;
- booking integrity issue appears;
- artifact integrity issue appears;
- safety issue appears;
- severe performance regression appears.

# 70. Rollback Decision

Rollback decision should consider:

- severity;
- customer impact;
- data integrity;
- safety;
- recovery complexity.

For safety-critical issues, stop physical rollout immediately.

# 71. Rollback Flow

    Incident
       |
       v
    Assess
       |
       +--> Safe to Continue
       |
       +--> Stop Rollout
                |
                v
             Rollback
                |
                v
             Verify
                |
                v
             Monitor
                |
                v
             Root Cause

# 72. Application Rollback

Application rollback should use the previous immutable artifact.

Verification must confirm:

- health;
- API;
- authentication;
- critical workflow;
- queue processing.

# 73. Studio Rollback

Studio rollback must account for:

- local state;
- protocol compatibility;
- backend compatibility;
- artifact compatibility.

# 74. Lab Agent Rollback

Lab Agent rollback must account for:

- protocol;
- runtime;
- robot state;
- identity;
- configuration.

Physical safety takes priority over rollback speed.

# 75. Database Rollback

Database rollback is handled carefully.

Preferred recovery approaches may include:

- backward-compatible application deployment;
- forward-fix migration;
- restore from backup where necessary.

Blind destructive rollback is prohibited.

# 76. Artifact Rollback

Artifact rollback may include:

- revoke current artifact;
- restore previous artifact;
- block new deployments;
- preserve existing run evidence.

# 77. Feature Rollback

If a feature flag is used, rollback may be achieved by disabling the feature.

The flag must not bypass mandatory safety controls.

# 78. Emergency Stop

Emergency stop is not a software release rollback mechanism.

Physical emergency stop remains an independent safety mechanism.

# 79. Hotfix Process

Hotfixes originate from the affected production version:

    Production Tag
         |
         v
    hotfix/<version>-<issue>
         |
         v
    Minimal Fix
         |
         v
    Regression Test
         |
         v
    Review
         |
         v
    CI
         |
         v
    Build / Sign
         |
         v
    Staged Release

# 80. Hotfix Scope

Hotfixes should be minimal.

They may include:

- production defect;
- critical security issue;
- release-blocking issue;
- urgent compatibility issue.

Unrelated refactoring is prohibited.

# 81. Communication

Release communication must be appropriate to the audience.

Audiences include:

- engineering;
- operations;
- support;
- administrators;
- pilot users;
- customers.

# 82. Internal Release Communication

Internal communication should include:

- version;
- release date;
- summary;
- major changes;
- known issues;
- deployment status;
- rollback status.

# 83. Customer Communication

Customer communication should include:

- meaningful changes;
- impact;
- action required;
- compatibility;
- downtime where applicable;
- known limitations.

Internal implementation details should not be unnecessarily exposed.

# 84. Release Notes

Release notes should contain:

- highlights;
- new capabilities;
- improvements;
- fixes;
- security updates where appropriate;
- compatibility;
- known issues;
- migration requirements.

# 85. Deprecation Communication

Deprecations must provide:

- affected feature;
- reason;
- replacement;
- timeline;
- migration guidance.

# 86. Release Calendar

The release calendar should identify:

- scope freeze;
- RC;
- qualification;
- approval;
- deployment;
- pilot;
- GA;
- post-release review.

Emergency releases may bypass normal calendar cadence but not mandatory safety
or security controls.

# 87. Operational Readiness

Before production rollout:

- dashboards exist;
- alerts exist;
- on-call ownership exists;
- deployment access is verified;
- rollback artifact exists;
- runbooks exist;
- support knows the release.

# 88. Monitoring

Release monitoring should cover:

- API error rate;
- latency;
- database health;
- queue health;
- worker health;
- authentication;
- booking;
- credits;
- jobs;
- artifact operations;
- Lab Agent connectivity;
- result generation.

# 89. Robot Monitoring

Physical rollout monitoring should additionally include:

- Lab Agent state;
- runtime state;
- robot state;
- faults;
- communication;
- emergency-stop state.

# 90. Release Health Dashboard

A release dashboard should provide:

    Release
       |
       +--> Version
       +--> Commit
       +--> Deployment
       +--> Error Rate
       +--> Latency
       +--> Jobs
       +--> Bookings
       +--> Credits
       +--> Labs
       +--> Robots
       +--> Incidents

# 91. Post-Release Monitoring Window

Every production release should have an explicit heightened-monitoring period.

The duration depends on risk.

Higher-risk releases require longer observation.

# 92. Post-Release Review

The post-release review should examine:

- deployment;
- incidents;
- rollback;
- customer impact;
- performance;
- security;
- support;
- monitoring;
- test gaps.

# 93. Post-Release Questions

The team should ask:

1. Did the release behave as expected?
2. Did any rollback occur?
3. Were alerts effective?
4. Were there unexpected failures?
5. Were test gaps exposed?
6. Were customers affected?
7. Did performance change?
8. Did security findings emerge?
9. Did operational procedures work?
10. What should change before the next release?

# 94. Incident Integration

If a release causes an incident:

    Release
       |
       v
    Incident
       |
       v
    Stabilize
       |
       v
    Recover
       |
       v
    Root Cause
       |
       v
    Corrective Actions
       |
       v
    Release Process Improvement

# 95. Release Defect Classification

Post-release defects should be classified:

- P0 critical;
- P1 high;
- P2 medium;
- P3 low.

P0 includes:

- safety issue;
- tenant isolation failure;
- critical security breach;
- financial corruption;
- catastrophic data loss.

# 96. Release Metrics

Track:

- deployment frequency;
- lead time;
- release success rate;
- rollback rate;
- escaped defects;
- change failure rate;
- mean time to recovery;
- release duration;
- test pass rate.

Metrics should improve reliability rather than encourage risky deployment speed.

# 97. Release Evidence Retention

Release evidence should be retained according to product and security policy.

Important evidence includes:

- source commit;
- tag;
- build logs;
- artifact digest;
- signature;
- test results;
- approvals;
- migration results;
- deployment records;
- rollout metrics;
- incident records.

# 98. Release Auditability

The release chain should be reconstructable:

    Requirement
       |
       v
    Task
       |
       v
    Commit
       |
       v
    Build
       |
       v
    Artifact
       |
       v
    Signature
       |
       v
    Release
       |
       v
    Deployment
       |
       v
    Runtime
       |
       v
    Customer / Robot

# 99. Environment Promotion

Promotion should be controlled:

    Development
        |
        v
    Staging
        |
        v
    Production

The exact same immutable release artifact should be promoted where practical,
rather than rebuilt separately for each environment.

# 100. Configuration Promotion

Application binaries should remain stable across environments.

Environment-specific configuration should be injected separately.

This reduces environment-specific build drift.

# 101. Infrastructure Release

Infrastructure changes follow the same release principles.

They require:

- review;
- automated validation;
- security review;
- staging;
- rollback/recovery plan;
- production approval.

# 102. Cloud Release

Cloud changes must validate:

- network;
- IAM;
- secrets;
- databases;
- storage;
- queues;
- monitoring;
- autoscaling where applicable.

# 103. Provider Neutrality

Release processes must not unnecessarily couple the product to a specific
cloud provider.

Provider-specific deployment logic belongs behind infrastructure abstractions
or deployment modules.

# 104. Release and Tenant Safety

A deployment must not accidentally:

- change tenant ownership;
- disable authorization;
- expose objects;
- mix environments;
- reset production business state.

# 105. Release and Credits

Credit-related releases require:

- ledger compatibility;
- reservation compatibility;
- rate-card compatibility;
- invoice compatibility where applicable;
- refund compatibility.

No release may silently alter customer credit balances.

# 106. Release and Booking

Booking releases must preserve:

- overlap prevention;
- resource ownership;
- platform compatibility;
- credit reservation;
- cancellation policy;
- historical booking state.

# 107. Release and Jobs

Job releases must preserve:

- lifecycle;
- idempotency;
- retry behavior;
- resource allocation;
- Lab Agent compatibility.

# 108. Release and Results

Result releases must preserve:

- historical Runs;
- result files;
- checksums;
- retention;
- download authorization.

# 109. Release and Experiments

Experiment releases must preserve:

- experiment identity;
- Run membership;
- comparison history;
- historical results.

# 110. Release and Protocol Versioning

Protocol versions must be tracked independently.

A product release may support multiple protocol versions where required.

Deprecation must be explicit.

# 111. Release and Artifact Format

Artifact format changes require:

- version update;
- parser compatibility;
- signer compatibility;
- Lab Agent compatibility;
- runtime compatibility;
- migration/upgrade strategy.

# 112. Release and SDK

SDK changes require:

- compatibility testing;
- example validation;
- artifact generation validation;
- supported platform matrix update.

# 113. Release Compatibility Matrix

A release should maintain a matrix covering:

| Component | Supported Versions |
|---|---|
| Studio | Defined supported range |
| Backend | Current supported range |
| Protocol | Supported versions |
| Artifact | Supported formats |
| Lab Agent | Supported versions |
| Runtime | Supported versions |
| SDK | Supported versions |
| Platform | Supported versions |

# 114. Release Branch Closure

After GA:

- release branch may be retained temporarily;
- fixes are merged back;
- tag remains immutable;
- release evidence remains retained.

The release branch should be deleted when no longer required.

# 115. Tagging

Release tags must be immutable.

Preferred format:

    v1.0.0

Prerelease:

    v1.0.0-rc.1

Tags must point to the exact qualified release commit.

# 116. Merge-Back

Hotfixes and release fixes must be merged back into `main` and maintained
release branches where applicable.

This prevents divergence.

# 117. Release Checklist — Planning

- [ ] Release owner assigned.
- [ ] Scope defined.
- [ ] Version defined.
- [ ] Target date defined.
- [ ] Release type defined.
- [ ] Affected components identified.
- [ ] Risks identified.
- [ ] Dependencies identified.
- [ ] Communication owner assigned.

# 118. Release Checklist — Engineering

- [ ] All release tasks integrated.
- [ ] Code review complete.
- [ ] Architecture review complete where required.
- [ ] CI green.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Contract tests pass.
- [ ] E2E tests pass.
- [ ] Simulation passes.

# 119. Release Checklist — Security

- [ ] SAST passes.
- [ ] Dependency scan passes.
- [ ] Secret scan passes.
- [ ] Tenant isolation passes.
- [ ] Authentication passes.
- [ ] Authorization passes.
- [ ] Artifact verification passes.
- [ ] Source privacy passes.
- [ ] Security approval complete where required.

# 120. Release Checklist — Database

- [ ] Migration reviewed.
- [ ] Migration tested.
- [ ] Upgrade tested.
- [ ] Lock impact assessed.
- [ ] Backfill assessed.
- [ ] Rollback/recovery strategy defined.
- [ ] Production migration owner assigned.

# 121. Release Checklist — Studio

- [ ] Linux build passes.
- [ ] Windows build passes.
- [ ] macOS build passes if in scope.
- [ ] Installer/package generated.
- [ ] Installer tested.
- [ ] Package signed.
- [ ] Compatibility verified.
- [ ] Distribution tested.

# 122. Release Checklist — Backend

- [ ] Backend artifact built.
- [ ] Image/package scanned.
- [ ] Artifact signed.
- [ ] Configuration verified.
- [ ] Migration verified.
- [ ] Deployment tested.
- [ ] Health checks verified.
- [ ] Rollback tested.

# 123. Release Checklist — Lab Agent

- [ ] Agent artifact built.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Simulation passes.
- [ ] Identity tested.
- [ ] Protocol compatibility tested.
- [ ] Package signed.
- [ ] Pilot lab validated.
- [ ] Rollback tested.
- [ ] Safety approval complete where required.

# 124. Release Checklist — Rollout

- [ ] Internal rollout complete.
- [ ] Canary complete.
- [ ] Pilot complete.
- [ ] Limited GA complete.
- [ ] Metrics reviewed.
- [ ] No stop condition triggered.
- [ ] Rollback remains available.
- [ ] Full GA approved.

# 125. Release Checklist — Communication

- [ ] Internal release notes ready.
- [ ] Customer notes ready.
- [ ] Known issues documented.
- [ ] Compatibility documented.
- [ ] Migration instructions ready.
- [ ] Support briefing complete.
- [ ] Incident contacts known.

# 126. Release Checklist — Post-Release

- [ ] Monitoring active.
- [ ] Error rates reviewed.
- [ ] Performance reviewed.
- [ ] Security reviewed.
- [ ] Customer impact reviewed.
- [ ] Incidents reviewed.
- [ ] Rollback status reviewed.
- [ ] Post-release review completed.
- [ ] Corrective actions assigned.

# 127. Phase 0 Release Mapping

Phase 0 establishes release foundations:

- repository;
- CI;
- versioning;
- branch strategy;
- artifact build;
- test framework;
- release documentation.

Exit requires reproducible engineering builds.

# 128. Phase 1 Release Mapping

Phase 1 releases establish:

- identity;
- organization;
- project;
- platform;
- database;
- authorization.

Release gates emphasize data integrity and tenant isolation.

# 129. Phase 2 Release Mapping

Phase 2 releases establish:

- Studio;
- local build;
- artifact;
- upload.

Release gates emphasize source privacy, artifact integrity and Studio
compatibility.

# 130. Phase 3 Release Mapping

Phase 3 establishes:

- simulated lab;
- Job;
- Run;
- Result;
- E2E execution.

Release gates emphasize protocol compatibility and execution reliability.

# 131. Phase 4 Release Mapping

Phase 4 establishes:

- booking;
- resource allocation;
- credits.

Release gates emphasize concurrency, financial correctness and booking
integrity.

# 132. Phase 5 Release Mapping

Phase 5 establishes:

- Lab Agent;
- real resources;
- HIL;
- physical robots.

Release gates emphasize safety, hardware compatibility and controlled rollout.

# 133. Phase 6 Release Mapping

Phase 6 establishes:

- production security;
- tenant isolation;
- secrets;
- keys;
- disaster recovery;
- production observability.

Release gates become production-grade.

# 134. Phase 7 Release Mapping

Phase 7 establishes:

- scale;
- multiple labs;
- multiple resources;
- operations.

Release gates emphasize capacity, resilience and operational reliability.

# 135. Phase 8 Release Mapping

Phase 8 establishes:

- production launch.

Release requires complete qualification across:

- Studio;
- backend;
- database;
- cloud;
- Lab Agent;
- simulator;
- physical robotics where applicable.

# 136. Release Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Unqualified release | Critical | Readiness gate |
| Unsigned artifact | Critical | Mandatory signing |
| Database incompatibility | Critical | Expand-contract |
| Protocol break | High | Contract tests |
| Studio/backend mismatch | High | Compatibility matrix |
| Lab Agent mismatch | Critical | Lab qualification |
| Safety regression | Critical | Human safety gate |
| Rollback failure | Critical | Rollback testing |
| Tenant leakage | Critical | Security qualification |
| Credit corruption | Critical | Ledger testing |
| Booking corruption | Critical | Concurrency testing |
| Release drift | High | Immutable artifacts |
| Configuration drift | High | Environment promotion |
| Poor communication | Medium | Release communication plan |
| Inadequate monitoring | High | Operational readiness |

# 137. Release Risk Management

Each high-risk release must have:

- identified owner;
- mitigation;
- verification;
- contingency.

Risk acceptance must be explicit.

# 138. Release Stop Conditions

Release must stop for:

- critical security vulnerability;
- tenant isolation failure;
- data corruption;
- financial corruption;
- artifact integrity failure;
- critical migration failure;
- unsafe physical behavior;
- failed mandatory test;
- missing required approval.

# 139. Open Questions

The following implementation details remain to be finalized:

1. Exact release cadence.
2. Exact release owner rotation.
3. Exact CI/CD provider.
4. Exact artifact registry.
5. Exact signing infrastructure.
6. Exact Studio distribution channels.
7. Exact installer update mechanism.
8. Exact backend deployment platform.
9. Exact Lab Agent update mechanism.
10. Exact rollout percentages.
11. Exact monitoring thresholds.
12. Exact rollback automation.
13. Exact support SLA.
14. Exact release evidence retention period.
15. Exact release communication channels.
16. Exact production synthetic-test design.
17. Exact physical robot rollout matrix.

These questions do not alter the mandatory release controls defined here.

# 140. Full Acceptance Criteria — Planning

- [ ] Release lifecycle is defined.
- [ ] Release types are defined.
- [ ] Release ownership is defined.
- [ ] Scope process is defined.
- [ ] Scope freeze is defined.
- [ ] Release branch process is defined.
- [ ] RC process is defined.
- [ ] Approval process is defined.

# 141. Full Acceptance Criteria — Readiness

- [ ] Functional readiness is defined.
- [ ] Test readiness is defined.
- [ ] Code review readiness is defined.
- [ ] Architecture readiness is defined.
- [ ] Security readiness is defined.
- [ ] Safety readiness is defined.
- [ ] Database readiness is defined.
- [ ] Protocol readiness is defined.
- [ ] Artifact readiness is defined.

# 142. Full Acceptance Criteria — Studio

- [ ] Studio builds reproducibly.
- [ ] Linux package is validated.
- [ ] Windows package is validated.
- [ ] macOS package is validated when in scope.
- [ ] Studio artifact is signed.
- [ ] Studio compatibility is tested.
- [ ] Studio rollout is staged.
- [ ] Studio rollback is available.

# 143. Full Acceptance Criteria — Backend

- [ ] Backend builds reproducibly.
- [ ] Backend artifact is scanned.
- [ ] Backend artifact is signed.
- [ ] Database migration is qualified.
- [ ] Deployment is tested.
- [ ] Health checks exist.
- [ ] Canary deployment is supported.
- [ ] Rollback is available.

# 144. Full Acceptance Criteria — Lab Agent

- [ ] Lab Agent builds reproducibly.
- [ ] Agent package is signed.
- [ ] Simulation qualification passes.
- [ ] Development lab qualification passes.
- [ ] Protocol compatibility passes.
- [ ] Identity behavior passes.
- [ ] Rollback is available.
- [ ] Physical safety review is complete where required.

# 145. Full Acceptance Criteria — Rollout

- [ ] Internal rollout exists.
- [ ] Canary rollout exists.
- [ ] Pilot rollout exists.
- [ ] Limited GA exists.
- [ ] Full GA criteria exist.
- [ ] Rollout monitoring exists.
- [ ] Stop conditions exist.
- [ ] Rollback decision process exists.

# 146. Full Acceptance Criteria — Rollback

- [ ] Previous artifacts are retained.
- [ ] Application rollback is tested.
- [ ] Studio rollback is defined.
- [ ] Backend rollback is defined.
- [ ] Lab Agent rollback is defined.
- [ ] Database recovery is defined.
- [ ] Artifact revocation is defined.
- [ ] Feature-flag rollback is defined where applicable.
- [ ] Physical safety stop remains independent.

# 147. Full Acceptance Criteria — Communication

- [ ] Internal release notes exist.
- [ ] Customer release notes exist where applicable.
- [ ] Compatibility information exists.
- [ ] Migration information exists.
- [ ] Known issues exist.
- [ ] Support is briefed.
- [ ] Rollout status is communicated.
- [ ] Deprecations are communicated.

# 148. Full Acceptance Criteria — Post-Release

- [ ] Monitoring is active.
- [ ] Release health is measured.
- [ ] Incidents are recorded.
- [ ] Customer impact is reviewed.
- [ ] Performance is reviewed.
- [ ] Security is reviewed.
- [ ] Rollback outcome is reviewed.
- [ ] Test gaps are identified.
- [ ] Corrective actions are assigned.
- [ ] Post-release review is completed.

# 149. Full Acceptance Criteria — Phase Gates

- [ ] Phase 0 release foundation gate passes.
- [ ] Phase 1 platform/data gate passes.
- [ ] Phase 2 Studio/artifact gate passes.
- [ ] Phase 3 simulation/execution gate passes.
- [ ] Phase 4 booking/credit gate passes.
- [ ] Phase 5 Lab/HIL/physical gate passes.
- [ ] Phase 6 LAB & ROBOT safety gate passes.
- [ ] Phase 8 PRODUCTION security and operations gate passes.
- [ ] Phase 8 production-launch gate passes.

# 150. Full Acceptance Criteria — Final

- [ ] Release is traceable to source.
- [ ] Release is reproducible.
- [ ] Release artifacts are signed.
- [ ] Release artifacts are immutable.
- [ ] Tests provide qualification evidence.
- [ ] Security gates are satisfied.
- [ ] Safety gates are satisfied.
- [ ] Database migrations are qualified.
- [ ] Compatibility is documented.
- [ ] Rollback is available.
- [ ] Monitoring is active.
- [ ] Communication is complete.
- [ ] Release approval is recorded.
- [ ] Post-release review is scheduled.

# 151. Final Release Invariants

The following invariants are mandatory:

1. A release is always traceable to a known source commit.
2. A production release is built through a controlled process.
3. Production artifacts are signed.
4. Published artifacts are immutable.
5. The same qualified artifact is promoted wherever practical.
6. Database changes are migration-controlled.
7. Protocol changes are compatibility-controlled.
8. Studio/backend compatibility is explicit.
9. Lab Agent/runtime compatibility is explicit.
10. Security gates cannot be bypassed for convenience.
11. Physical safety gates cannot be bypassed for release speed.
12. Rollback capability exists before production rollout.
13. Production rollout is staged where practical.
14. Release stop conditions are explicit.
15. Customer-impacting changes are communicated.
16. Release health is monitored after deployment.
17. Incidents are fed back into engineering.
18. Release evidence is retained.
19. Hotfixes remain minimal and reviewed.
20. Release tags remain immutable.

# 152. Final Release Architecture

The complete release system is:

    Requirement
        |
        v
    Task
        |
        v
    Implementation
        |
        v
    Code Review
        |
        v
    CI
        |
        v
    Integration
        |
        v
    Qualification
        |
        v
    Release Candidate
        |
        v
    Approval
        |
        v
    Reproducible Build
        |
        v
    Sign
        |
        v
    Publish
        |
        v
    Internal
        |
        v
    Canary
        |
        v
    Pilot
        |
        v
    Limited GA
        |
        v
    Full GA
        |
        v
    Monitor
        |
        v
    Post-Release Review
        |
        v
    Continuous Improvement

# 153. Final Product Component Flow

    +-------------------+
    |     RaaS Studio   |
    +---------+---------+
              |
              | HTTPS / WebSocket
              v
    +-------------------+
    |   Control Plane   |
    +----+---------+----+
         |         |
         |         +----------------+
         |                          |
         v                          v
    +---------+              +-------------+
    |Database |              |Object Store |
    +---------+              +-------------+
         |
         v
    +-------------------+
    | Queue / Workers   |
    +---------+---------+
              |
              v
    +-------------------+
    |     Lab Agent     |
    +---------+---------+
              |
              v
    +-------------------+
    | Kritva Runtime    |
    +---------+---------+
              |
              v
    +-------------------+
    | Robot / Simulator |
    +-------------------+

Every component in this flow has an explicit release and compatibility
responsibility.

# 154. Final Principle

> Kritva RaaS releases shall be treated as controlled engineering events, not
> as simple source-code publication. Every release must progress from a known
> source state through review, automated qualification, integration testing,
> security and compatibility validation, reproducible build, cryptographic
> signing, controlled publication, staged rollout, monitoring and post-release
> review. Studio, backend and Lab Agent releases must each have explicit build,
> signing, compatibility and rollback procedures. Database and protocol
> changes must remain compatible throughout the deployment transition.
> Production rollout shall proceed progressively from internal validation
> through canary, pilot and limited GA before full availability wherever the
> risk profile permits. Rollback must be considered before deployment rather
> than after failure. Physical robot releases require additional simulation,
> HIL and human safety gates, and no cloud or release mechanism may override
> local physical safety authority. The final objective is a release process
> that is repeatable, observable, auditable and safe while allowing Kritva
> RaaS to evolve rapidly without sacrificing product integrity.
