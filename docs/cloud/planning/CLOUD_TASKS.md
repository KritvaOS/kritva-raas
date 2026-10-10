# Kritva RaaS Cloud Task Backlog

## 1. Document Control

| Item | Value |
|---|---|
| Document | Cloud Task Backlog |
| Path | `docs/cloud/planning/CLOUD_TASKS.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Scope | Cloud infrastructure, deployment and operations |
| Phase Range | Phase 0–Phase 8 |
| Milestones | C-M01–C-M04 |
| Task Count | 45 |
| Planning Model | Milestone and dependency driven |
| Priority Model | PRI-0 / PRI-1 / PRI-2 |
| Estimate Unit | Person-days |
| Primary Owners | Cloud / DevOps / Security / DBA / SRE / QA / Lab Integration |
| Environment Flow | Local → Development → Staging → Production |
| Architecture | Provider-neutral modular platform |
| Production Model | Single primary region, multi-zone where practical |

## 2. Purpose

This document defines the complete cloud implementation task backlog for Kritva
RaaS.

It converts the approved cloud architecture and roadmap into executable tasks
with:

- stable task IDs;
- descriptions;
- dependencies;
- priority;
- estimates;
- owner roles;
- acceptance references;
- phase mapping;
- milestone mapping.

The backlog is intended to be used by implementation agents and engineers while
the architecture remains governed through the corresponding architecture and
milestone documents.

## 3. Scope

The backlog covers:

- cloud account/project setup;
- infrastructure as code;
- networking;
- compute;
- PostgreSQL;
- object storage;
- secrets;
- IAM;
- CI infrastructure;
- monitoring;
- development deployment;
- workers;
- queues;
- artifact storage;
- Lab Agent connectivity;
- staging;
- production;
- security hardening;
- observability;
- backup;
- restore;
- disaster recovery;
- cost controls;
- operational runbooks.

## 4. Non-Goals

This backlog does not directly implement:

- application domain services;
- frontend Studio;
- Web Console;
- robot firmware;
- robot mechanics;
- physical safety systems;
- complete database domain schema;
- final payment-provider implementation.

Cloud tasks provide infrastructure and integration capability for those systems.

## 5. Backlog Principles

1. Tasks implement approved architecture.
2. Architecture decisions precede implementation.
3. PRI-0 tasks are required for the relevant milestone gate.
4. PRI-1 tasks are important for the target production roadmap.
5. PRI-2 tasks are optimization or future capability.
6. Dependencies must be satisfied before implementation.
7. Each task has explicit acceptance evidence.
8. Tasks should be independently reviewable.
9. Production tasks must not depend on undocumented manual configuration.
10. Infrastructure should be reproducible.
11. Security is embedded in every milestone.
12. Observability is embedded in every milestone.
13. Physical robot deployment has a separate safety gate.

## 6. Priority Definitions

| Priority | Meaning |
|---|---|
| PRI-0 | Mandatory for milestone/phase completion |
| PRI-1 | Required for target production capability but may follow core path |
| PRI-2 | Optimization, scale, or future enhancement |

A PRI-1 task cannot silently become a production blocker without an explicit
planning decision.

## 7. Owner Roles

| Role | Responsibility |
|---|---|
| CLOUD-ARCH | Cloud architecture and technical governance |
| DEVOPS | IaC, CI/CD and deployment |
| CLOUD-ENG | Cloud infrastructure implementation |
| SEC-ENG | IAM, security and hardening |
| DB-ENG | PostgreSQL and database operations |
| SRE | Reliability, monitoring, DR and operations |
| QA-ENG | Infrastructure and E2E validation |
| LAB-INT | Lab Agent and lab connectivity |
| FIN-OPS | Cost and cloud financial controls |

## 8. Estimate Model

Estimates are implementation planning estimates in person-days.

They include implementation and normal engineering validation but exclude major
unplanned architectural changes.

Typical interpretation:

- 1–2 days: focused task;
- 3–5 days: moderate infrastructure task;
- 6–10 days: substantial task;
- 10+ days: complex production capability.

Estimates should be revalidated when the final cloud provider is selected.

## 9. Definition of Ready

A task is Ready when:

- [ ] purpose is understood;
- [ ] architecture exists;
- [ ] dependencies are identified;
- [ ] owner is assigned;
- [ ] estimate exists;
- [ ] acceptance criteria exist;
- [ ] required environment is identified;
- [ ] no unresolved architecture blocker exists.

## 10. Definition of Done

A task is Done when:

- [ ] implementation is complete;
- [ ] infrastructure is reproducible;
- [ ] tests pass;
- [ ] acceptance criteria pass;
- [ ] security controls are applied;
- [ ] observability is available;
- [ ] documentation is updated;
- [ ] no known P0 regression exists;
- [ ] evidence is recorded;
- [ ] commit/release evidence is available.

## 11. Task Dependency Model

The primary cloud dependency chain is:

    Cloud Foundation
          |
          v
    Network + IAM
          |
          v
    Compute + Data Services
          |
          v
    Control Plane
          |
          v
    Queue + Workers
          |
          v
    Artifacts + Resources
          |
          v
    Jobs + Runs
          |
          v
    Lab Agent
          |
          v
    Realtime + Results
          |
          v
    Production Hardening

## 12. Phase Mapping

| Phase | Cloud Objective |
|---|---|
| Phase 0 | Architecture and foundation |
| Phase 1 | Control Plane infrastructure |
| Phase 2 | Resource and artifact foundation |
| Phase 3 | Async execution |
| Phase 4 | Commercial infrastructure |
| Phase 5 | Remote execution |
| Phase 6 | Physical lab integration |
| Phase 7 | Results and realtime |
| Phase 8 | Production hardening |

## 13. Milestone Mapping

| Milestone | Name | Primary Phases |
|---|---|---|
| C-M01 | Foundation | Phase 0–1 |
| C-M02 | Development | Phase 1–3 |
| C-M03 | Staging | Phase 4–7 |
| C-M04 | Production | Phase 8 |

## 14. C-M01 Foundation

C-M01 establishes the cloud foundation required by all subsequent milestones.

Tasks:

| ID | Task | Phase | Priority | Estimate |
|---|---|---:|---:|---:|
| C01-001 | Cloud Account/Project Foundation | 0 | PRI-0 | 3d |
| C01-002 | Infrastructure-as-Code Foundation | 0 | PRI-0 | 5d |
| C01-003 | Network Foundation | 0 | PRI-0 | 7d |
| C01-004 | Compute Foundation | 1 | PRI-0 | 6d |
| C01-005 | PostgreSQL Foundation | 1 | PRI-0 | 6d |
| C01-006 | Object Storage Foundation | 1 | PRI-0 | 4d |
| C01-007 | Secrets Foundation | 0 | PRI-0 | 5d |
| C01-008 | CI Infrastructure Validation | 0 | PRI-0 | 4d |
| C01-009 | Basic Monitoring | 1 | PRI-0 | 4d |

## 15. C01-001 Cloud Account/Project Foundation

Purpose:

Establish the cloud organizational and billing foundation.

Deliverables:

- cloud account/project structure;
- environment boundaries;
- region selection placeholder;
- naming convention;
- resource tagging;
- billing ownership;
- quota review;
- administrative ownership.

Dependencies:

- None.

Owner:

- CLOUD-ARCH
- DEVOPS

Acceptance Reference:

- `C-M01/MILESTONE.md`
- `C-M01/ACCEPTANCE_CRITERIA.md`

Acceptance:

- [ ] account/project exists;
- [ ] ownership is documented;
- [ ] environments are identified;
- [ ] billing visibility exists;
- [ ] administrative access is controlled.

## 16. C01-002 Infrastructure-as-Code Foundation

Purpose:

Create the reusable IaC foundation.

Deliverables:

- repository structure;
- provider abstraction;
- environment modules;
- state management;
- validation;
- plan/apply workflow.

Dependencies:

- C01-001.

Owner:

- DEVOPS
- CLOUD-ARCH

Acceptance Reference:

- `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`
- C01 milestone acceptance.

Acceptance:

- [ ] IaC is version-controlled;
- [ ] state is protected;
- [ ] environment configuration is separated;
- [ ] CI validates changes;
- [ ] infrastructure can be recreated.

## 17. C01-003 Network Foundation

Purpose:

Implement the private-by-default network topology.

Deliverables:

- VPC/VNet;
- edge subnet;
- application subnet;
- worker subnet;
- data subnet;
- management subnet;
- routing;
- firewall/security groups;
- NAT/egress;
- private service endpoints where supported.

Dependencies:

- C01-001;
- C01-002.

Owner:

- CLOUD-ENG
- SEC-ENG

Acceptance Reference:

- `docs/cloud/architecture/NETWORK_ARCHITECTURE.md`

Acceptance:

- [ ] public edge is defined;
- [ ] application is private;
- [ ] PostgreSQL is private;
- [ ] queue is private;
- [ ] deny-by-default rules exist;
- [ ] egress is controlled.

## 18. C01-004 Compute Foundation

Purpose:

Create the baseline container/application execution environment.

Deliverables:

- container runtime;
- workload identity;
- API deployment;
- health checks;
- resource limits;
- graceful shutdown;
- private networking.

Dependencies:

- C01-003;
- C01-007.

Owner:

- CLOUD-ENG
- DEVOPS

Acceptance Reference:

- `docs/cloud/architecture/COMPUTE_ARCHITECTURE.md`

Acceptance:

- [ ] workload deploys;
- [ ] readiness/liveness checks work;
- [ ] non-root execution is supported;
- [ ] resource limits exist;
- [ ] workload identity is functional.

## 19. C01-005 PostgreSQL Foundation

Purpose:

Establish the authoritative structured data store.

Deliverables:

- managed PostgreSQL;
- private connectivity;
- encryption;
- backup;
- database identity;
- connection policy;
- monitoring.

Dependencies:

- C01-003;
- C01-007.

Owner:

- DB-ENG
- CLOUD-ENG

Acceptance Reference:

- `docs/cloud/architecture/STORAGE_ARCHITECTURE.md`
- `docs/backend/architecture/BACKEND_ARCHITECTURE.md`

Acceptance:

- [ ] PostgreSQL is private;
- [ ] encryption is enabled;
- [ ] backup is enabled;
- [ ] application connectivity works;
- [ ] administrative access is restricted.

## 20. C01-006 Object Storage Foundation

Purpose:

Create private storage for large RaaS payloads.

Deliverables:

- artifacts bucket;
- results bucket;
- logs bucket;
- video bucket;
- telemetry bucket;
- reports bucket;
- encryption;
- access policies;
- lifecycle baseline.

Dependencies:

- C01-003;
- C01-007.

Owner:

- CLOUD-ENG
- SEC-ENG

Acceptance Reference:

- `docs/cloud/architecture/STORAGE_ARCHITECTURE.md`

Acceptance:

- [ ] buckets are private;
- [ ] encryption is enabled;
- [ ] workload access is scoped;
- [ ] environment separation exists;
- [ ] lifecycle policy is defined.

## 21. C01-007 Secrets Foundation

Purpose:

Establish centralized secret and key management.

Deliverables:

- managed secret store;
- KMS;
- workload identity;
- secret access policy;
- rotation process.

Dependencies:

- C01-001;
- C01-002.

Owner:

- SEC-ENG
- DEVOPS

Acceptance Reference:

- `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`

Acceptance:

- [ ] secrets are not stored in Git;
- [ ] application identity retrieves only required secrets;
- [ ] KMS protection exists;
- [ ] rotation procedure exists;
- [ ] access is audited.

## 22. C01-008 CI Infrastructure Validation

Purpose:

Prevent insecure or invalid infrastructure from reaching environments.

Deliverables:

- IaC syntax checks;
- policy checks;
- security scanning;
- plan validation;
- environment validation.

Dependencies:

- C01-002.

Owner:

- DEVOPS
- SEC-ENG

Acceptance Reference:

- `docs/cloud/planning/CLOUD_ROADMAP.md`

Acceptance:

- [ ] CI validates IaC;
- [ ] security scans run;
- [ ] failed validation blocks promotion;
- [ ] results are retained.

## 23. C01-009 Basic Monitoring

Purpose:

Make cloud infrastructure observable from the beginning.

Deliverables:

- infrastructure metrics;
- application health;
- basic logs;
- basic dashboards;
- baseline alerts.

Dependencies:

- C01-004;
- C01-005.

Owner:

- SRE
- DEVOPS

Acceptance Reference:

- `docs/cloud/architecture/OBSERVABILITY_ARCHITECTURE.md`

Acceptance:

- [ ] compute health is visible;
- [ ] database health is visible;
- [ ] logs are collected;
- [ ] basic alerts work;
- [ ] environment is identifiable.

## 24. C-M01 Exit Criteria

- [ ] C01-001 complete.
- [ ] C01-002 complete.
- [ ] C01-003 complete.
- [ ] C01-004 complete.
- [ ] C01-005 complete.
- [ ] C01-006 complete.
- [ ] C01-007 complete.
- [ ] C01-008 complete.
- [ ] C01-009 complete.
- [ ] no unresolved P0 security blocker exists.

## 25. C-M02 Development

C-M02 creates the integrated cloud development environment.

Tasks:

| ID | Task | Phase | Priority | Estimate |
|---|---|---:|---:|---:|
| C02-001 | Development Control Plane Deployment | 1 | PRI-0 | 5d |
| C02-002 | Development Worker Deployment | 3 | PRI-0 | 4d |
| C02-003 | Development Database Migration | 1 | PRI-0 | 4d |
| C02-004 | Queue Infrastructure | 3 | PRI-0 | 5d |
| C02-005 | Artifact Storage Integration | 2 | PRI-0 | 5d |
| C02-006 | Mock Lab Agent Connectivity | 3 | PRI-0 | 6d |
| C02-007 | Development Observability | 1–3 | PRI-0 | 6d |
| C02-008 | Automated Development Deployment | 1–3 | PRI-0 | 5d |
| C02-009 | End-to-End Development Validation | 3 | PRI-0 | 6d |

## 26. C02-001 Development Control Plane Deployment

Purpose:

Deploy the production-oriented modular Control Plane to development.

Dependencies:

- C-M01;
- backend Phase 1 implementation.

Owner:

- DEVOPS
- CLOUD-ENG

Acceptance Reference:

- `docs/cloud/planning/CLOUD_ROADMAP.md`
- `docs/backend/architecture/API_IMPLEMENTATION.md`

Acceptance:

- [ ] REST API deploys;
- [ ] WebSocket endpoint deploys;
- [ ] PostgreSQL connection works;
- [ ] health checks work;
- [ ] environment configuration is externalized.

## 27. C02-002 Development Worker Deployment

Purpose:

Deploy asynchronous worker infrastructure.

Dependencies:

- C02-001;
- C02-004.

Owner:

- DEVOPS
- CLOUD-ENG

Acceptance:

- [ ] worker consumes queue;
- [ ] duplicate-safe processing is supported;
- [ ] graceful shutdown works;
- [ ] worker metrics exist.

## 28. C02-003 Development Database Migration

Purpose:

Make database schema deployment repeatable.

Dependencies:

- C01-005;
- backend database development.

Owner:

- DB-ENG
- DEVOPS

Acceptance:

- [ ] migration runner exists;
- [ ] schema version is tracked;
- [ ] migration logs exist;
- [ ] failed migration behavior is defined;
- [ ] staging promotion path exists.

## 29. C02-004 Queue Infrastructure

Purpose:

Provide durable asynchronous transport.

Dependencies:

- C01-003;
- C01-004.

Owner:

- CLOUD-ENG
- DEVOPS

Acceptance Reference:

- `docs/backend/architecture/JOB_ARCHITECTURE.md`

Acceptance:

- [ ] durable queue exists;
- [ ] retry policy exists;
- [ ] dead-letter handling exists;
- [ ] access is least privilege;
- [ ] queue health is observable.

## 30. C02-005 Artifact Storage Integration

Purpose:

Enable the build-locally/execute-remotely artifact path.

Dependencies:

- C01-006;
- backend artifact service.

Owner:

- CLOUD-ENG
- DEVOPS

Acceptance Reference:

- `docs/backend/architecture/ARTIFACT_SERVICE.md`

Acceptance:

- [ ] signed upload works;
- [ ] signed download works;
- [ ] digest is validated;
- [ ] object metadata is stored;
- [ ] artifact access is tenant-authorized.

## 31. C02-006 Mock Lab Agent Connectivity

Purpose:

Enable cloud execution development before physical lab deployment.

Dependencies:

- C02-001;
- C02-004.

Owner:

- LAB-INT
- CLOUD-ENG

Acceptance:

- [ ] mock Agent authenticates;
- [ ] heartbeat works;
- [ ] command path works;
- [ ] telemetry simulation works;
- [ ] reconnect/reconciliation works.

## 32. C02-007 Development Observability

Purpose:

Provide complete development observability.

Dependencies:

- C02-001;
- C02-002;
- C02-004;
- C02-006.

Owner:

- SRE
- DEVOPS

Acceptance Reference:

- `docs/cloud/architecture/OBSERVABILITY_ARCHITECTURE.md`

Acceptance:

- [ ] structured logs exist;
- [ ] metrics exist;
- [ ] traces exist;
- [ ] correlation IDs propagate;
- [ ] dashboards exist;
- [ ] alerts exist.

## 33. C02-008 Automated Development Deployment

Purpose:

Automate source-to-development deployment.

Flow:

    Git Push
       |
       v
    CI
       |
       +--> Test
       +--> Security Scan
       +--> Build
       +--> Image
       |
       v
    Development
       |
       v
    Smoke Tests

Dependencies:

- C01-008;
- C02-001.

Owner:

- DEVOPS

Acceptance:

- [ ] deployment is automated;
- [ ] same artifact can be promoted;
- [ ] deployment status is visible;
- [ ] failed deployment is detected.

## 34. C02-009 End-to-End Development Validation

Purpose:

Validate the first complete cloud workflow.

Flow:

    Studio
      |
      v
    API
      |
      v
    PostgreSQL
      |
      v
    Queue
      |
      v
    Worker
      |
      v
    Object Storage
      |
      v
    Mock Lab Agent

Dependencies:

- C02-001 through C02-008.

Owner:

- QA-ENG
- SRE
- CLOUD-ENG

Acceptance:

- [ ] workflow completes;
- [ ] failures are observable;
- [ ] tenant isolation is validated;
- [ ] artifact flow works;
- [ ] recovery from worker restart works.

## 35. C-M02 Exit Criteria

- [ ] development deployment is automated;
- [ ] Control Plane is operational;
- [ ] workers operate;
- [ ] queue is durable;
- [ ] database migrations operate;
- [ ] artifact storage operates;
- [ ] mock Lab Agent operates;
- [ ] observability operates;
- [ ] E2E validation passes.

## 36. C-M03 Staging

C-M03 is the release-candidate and production-readiness environment.

Tasks:

| ID | Task | Phase | Priority | Estimate |
|---|---|---:|---:|---:|
| C03-001 | Staging Network | 4–7 | PRI-0 | 6d |
| C03-002 | Staging Compute | 4–7 | PRI-0 | 5d |
| C03-003 | Staging Database | 4–7 | PRI-0 | 4d |
| C03-004 | Staging Object Storage | 4–7 | PRI-0 | 4d |
| C03-005 | Staging Queue | 4–7 | PRI-0 | 4d |
| C03-006 | Staging Secrets | 4–7 | PRI-0 | 4d |
| C03-007 | Staging Observability | 4–7 | PRI-0 | 6d |
| C03-008 | Test Lab Connectivity | 6 | PRI-0 | 7d |
| C03-009 | Release Candidate Deployment | 5–7 | PRI-0 | 5d |
| C03-010 | End-to-End Acceptance | 5–7 | PRI-0 | 8d |
| C03-011 | Production Promotion Gate | 7 | PRI-0 | 4d |

## 37. C03-001 Staging Network

Purpose:

Create production-like staging network boundaries.

Dependencies:

- C01-003;
- C02 validation.

Owner:

- CLOUD-ENG
- SEC-ENG

Acceptance:

- [ ] WAF/edge exists;
- [ ] application is private;
- [ ] database is private;
- [ ] storage is private;
- [ ] management access is restricted.

## 38. C03-002 Staging Compute

Purpose:

Deploy production-like workload classes.

Workloads:

- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- migrations.

Dependencies:

- C03-001;
- C02-002.

Owner:

- DEVOPS
- CLOUD-ENG

Acceptance:

- [ ] all workload classes deploy;
- [ ] health checks work;
- [ ] resource limits exist;
- [ ] graceful shutdown works.

## 39. C03-003 Staging Database

Purpose:

Validate production-like database operation.

Dependencies:

- C03-001;
- C01-005;
- C02-003.

Owner:

- DB-ENG
- SRE

Acceptance:

- [ ] database is isolated;
- [ ] migrations work;
- [ ] backups work;
- [ ] restore procedure is validated;
- [ ] monitoring exists.

## 40. C03-004 Staging Object Storage

Purpose:

Validate production storage workflows.

Dependencies:

- C01-006.

Owner:

- CLOUD-ENG
- SEC-ENG

Acceptance:

- [ ] artifacts work;
- [ ] results work;
- [ ] signed access works;
- [ ] lifecycle works;
- [ ] permissions are tested.

## 41. C03-005 Staging Queue

Purpose:

Validate production-like async behavior.

Dependencies:

- C02-004.

Owner:

- CLOUD-ENG
- SRE

Acceptance:

- [ ] retries work;
- [ ] duplicate delivery is safe;
- [ ] dead letters work;
- [ ] backlog alerts work;
- [ ] recovery is tested.

## 42. C03-006 Staging Secrets

Purpose:

Validate production secret-management behavior.

Dependencies:

- C01-007.

Owner:

- SEC-ENG
- DEVOPS

Acceptance:

- [ ] workload identity works;
- [ ] secrets are isolated;
- [ ] rotation works;
- [ ] revoked credentials fail safely.

## 43. C03-007 Staging Observability

Purpose:

Validate production-grade observability before production.

Dependencies:

- C02-007.

Owner:

- SRE
- SEC-ENG

Acceptance:

- [ ] logs work;
- [ ] metrics work;
- [ ] traces work;
- [ ] dashboards work;
- [ ] alerts work;
- [ ] SLOs can be calculated;
- [ ] tenant data is isolated.

## 44. C03-008 Test Lab Connectivity

Purpose:

Validate controlled cloud-to-lab communication.

Dependencies:

- C02-006;
- Phase 6 Lab Agent implementation;
- safety architecture.

Owner:

- LAB-INT
- SEC-ENG

Acceptance:

- [ ] Agent identity works;
- [ ] secure connection works;
- [ ] heartbeat works;
- [ ] resource inventory works;
- [ ] command authorization works;
- [ ] physical safety boundary is preserved.

## 45. C03-009 Release Candidate Deployment

Purpose:

Promote an immutable release candidate into staging.

Dependencies:

- C02-008;
- C03-001 through C03-007.

Owner:

- DEVOPS
- QA-ENG

Acceptance:

- [ ] security scans pass;
- [ ] image is immutable;
- [ ] SBOM exists;
- [ ] staging deployment succeeds;
- [ ] smoke tests pass.

## 46. C03-010 End-to-End Acceptance

Purpose:

Validate the complete RaaS execution path.

Flow:

    Login
      |
      v
    Project
      |
      v
    Artifact
      |
      v
    Booking
      |
      v
    Credit
      |
      v
    Job
      |
      v
    Run
      |
      v
    Lab
      |
      v
    Result

Dependencies:

- C03-001 through C03-009.

Owner:

- QA-ENG
- SRE
- LAB-INT

Acceptance:

- [ ] full flow passes;
- [ ] failure paths are validated;
- [ ] telemetry is visible;
- [ ] logs correlate;
- [ ] results are downloadable;
- [ ] security boundaries pass.

## 47. C03-011 Production Promotion Gate

Purpose:

Formally determine production readiness.

Dependencies:

- C03-010;
- security review;
- backup/restore review;
- operational review.

Owner:

- CLOUD-ARCH
- SRE
- SEC-ENG

Acceptance:

- [ ] no critical security blocker;
- [ ] restore is validated;
- [ ] SLOs are defined;
- [ ] runbooks exist;
- [ ] cost controls exist;
- [ ] production approval is recorded.

## 48. C-M03 Exit Criteria

- [ ] staging infrastructure is production-like;
- [ ] release candidate is validated;
- [ ] real/simulated lab connectivity works;
- [ ] E2E acceptance passes;
- [ ] security review passes;
- [ ] operational readiness passes;
- [ ] production promotion gate is approved.

## 49. C-M04 Production

C-M04 implements the production cloud platform.

Tasks:

| ID | Task | Phase | Priority | Estimate |
|---|---|---:|---:|---:|
| C04-001 | Production Network | 8 | PRI-0 | 8d |
| C04-002 | Production Compute | 8 | PRI-0 | 8d |
| C04-003 | Production PostgreSQL | 8 | PRI-0 | 8d |
| C04-004 | Production Object Storage | 8 | PRI-0 | 6d |
| C04-005 | Production Queue | 8 | PRI-0 | 5d |
| C04-006 | Production Secrets | 8 | PRI-0 | 5d |
| C04-007 | Security Hardening | 8 | PRI-0 | 8d |
| C04-008 | Monitoring and Dashboards | 8 | PRI-0 | 7d |
| C04-009 | Alerting | 8 | PRI-0 | 5d |
| C04-010 | Backup Automation | 8 | PRI-0 | 5d |
| C04-011 | Restore Validation | 8 | PRI-0 | 5d |
| C04-012 | Disaster Recovery | 8 | PRI-0 | 8d |
| C04-013 | Cost Controls | 8 | PRI-1 | 4d |
| C04-014 | Operational Runbooks | 8 | PRI-0 | 6d |
| C04-015 | Production Deployment | 8 | PRI-0 | 5d |
| C04-016 | Production Acceptance | 8 | PRI-0 | 7d |

## 50. C04-001 Production Network

Purpose:

Deploy hardened production network infrastructure.

Dependencies:

- C03-011;
- C03-001.

Owner:

- CLOUD-ENG
- SEC-ENG

Acceptance Reference:

- `docs/cloud/architecture/NETWORK_ARCHITECTURE.md`

Acceptance:

- [ ] edge is protected;
- [ ] application is private;
- [ ] data services are private;
- [ ] egress is controlled;
- [ ] lab network is isolated;
- [ ] management access is restricted.

## 51. C04-002 Production Compute

Purpose:

Deploy production workload capacity.

Dependencies:

- C04-001;
- C03-002.

Owner:

- CLOUD-ENG
- DEVOPS
- SRE

Acceptance Reference:

- `docs/cloud/architecture/COMPUTE_ARCHITECTURE.md`

Acceptance:

- [ ] API is highly available within target topology;
- [ ] workers are scalable;
- [ ] scheduler is protected against duplication;
- [ ] reconciliation workers operate;
- [ ] resource limits exist;
- [ ] graceful shutdown works.

## 52. C04-003 Production PostgreSQL

Purpose:

Deploy authoritative production structured storage.

Dependencies:

- C04-001;
- C04-006;
- C03-003.

Owner:

- DB-ENG
- SRE

Acceptance Reference:

- `docs/cloud/architecture/STORAGE_ARCHITECTURE.md`

Acceptance:

- [ ] HA configuration is appropriate;
- [ ] encryption is enabled;
- [ ] backups are active;
- [ ] PITR is configured where supported;
- [ ] monitoring exists;
- [ ] public access is disabled.

## 53. C04-004 Production Object Storage

Purpose:

Deploy production artifact, result and operational storage.

Dependencies:

- C04-001;
- C04-006;
- C03-004.

Owner:

- CLOUD-ENG
- SEC-ENG

Acceptance:

- [ ] private buckets exist;
- [ ] encryption is active;
- [ ] lifecycle policies exist;
- [ ] signed access is scoped;
- [ ] critical objects have appropriate protection;
- [ ] reconciliation exists.

## 54. C04-005 Production Queue

Purpose:

Deploy production durable asynchronous transport.

Dependencies:

- C04-001;
- C04-002;
- C03-005.

Owner:

- CLOUD-ENG
- SRE

Acceptance:

- [ ] durable queue exists;
- [ ] retries are configured;
- [ ] dead-letter queues exist;
- [ ] queue monitoring exists;
- [ ] worker recovery is tested.

## 55. C04-006 Production Secrets

Purpose:

Deploy production secret and key-management controls.

Dependencies:

- C04-001;
- C03-006.

Owner:

- SEC-ENG
- DEVOPS

Acceptance:

- [ ] production secrets are isolated;
- [ ] workload identity is used;
- [ ] KMS is configured;
- [ ] rotation is tested;
- [ ] emergency revocation exists.

## 56. C04-007 Security Hardening

Purpose:

Complete production cloud security controls.

Scope:

- IAM;
- WAF;
- network;
- tenant isolation;
- vulnerability scanning;
- container scanning;
- IaC scanning;
- secret scanning;
- privileged access;
- audit.

Dependencies:

- C04-001 through C04-006.

Owner:

- SEC-ENG

Acceptance Reference:

- `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`

Acceptance:

- [ ] least privilege passes review;
- [ ] WAF is active;
- [ ] critical vulnerabilities are resolved;
- [ ] tenant isolation tests pass;
- [ ] security logs are protected;
- [ ] privileged access is audited.

## 57. C04-008 Monitoring and Dashboards

Purpose:

Provide complete production observability.

Dependencies:

- C04-002;
- C04-003;
- C04-004;
- C04-005.

Owner:

- SRE

Acceptance Reference:

- `docs/cloud/architecture/OBSERVABILITY_ARCHITECTURE.md`

Acceptance:

- [ ] service dashboards exist;
- [ ] API dashboard exists;
- [ ] Job/Run dashboard exists;
- [ ] Lab dashboard exists;
- [ ] database dashboard exists;
- [ ] storage dashboard exists;
- [ ] security dashboard exists;
- [ ] cost dashboard exists.

## 58. C04-009 Alerting

Purpose:

Turn operational and security signals into actionable alerts.

Dependencies:

- C04-008.

Owner:

- SRE
- SEC-ENG

Acceptance:

- [ ] SLO alerts exist;
- [ ] database alerts exist;
- [ ] queue alerts exist;
- [ ] worker alerts exist;
- [ ] Lab Agent alerts exist;
- [ ] backup alerts exist;
- [ ] security alerts exist;
- [ ] runbooks are linked.

## 59. C04-010 Backup Automation

Purpose:

Automate production data protection.

Dependencies:

- C04-003;
- C04-004.

Owner:

- DB-ENG
- SRE

Acceptance:

- [ ] database backups run automatically;
- [ ] backup retention exists;
- [ ] object protection exists;
- [ ] backup failures alert;
- [ ] backup access is restricted.

## 60. C04-011 Restore Validation

Purpose:

Prove that production backups can actually be restored.

Dependencies:

- C04-010.

Owner:

- DB-ENG
- SRE
- QA-ENG

Acceptance:

- [ ] database restore succeeds;
- [ ] object recovery succeeds;
- [ ] schema validation succeeds;
- [ ] application validation succeeds;
- [ ] evidence is recorded.

## 61. C04-012 Disaster Recovery

Purpose:

Establish recoverability from major cloud failures.

Dependencies:

- C04-010;
- C04-011;
- C04-014.

Owner:

- SRE
- CLOUD-ARCH

Acceptance:

- [ ] RPO is documented;
- [ ] RTO is documented;
- [ ] recovery sequence exists;
- [ ] infrastructure can be recreated;
- [ ] database recovery is validated;
- [ ] object recovery is validated;
- [ ] Lab reconciliation is included.

## 62. C04-013 Cost Controls

Purpose:

Control and measure cloud economics.

Dependencies:

- C04-002;
- C04-003;
- C04-004;
- C04-008.

Owner:

- FIN-OPS
- SRE

Priority:

- P1.

Acceptance:

- [ ] budgets exist;
- [ ] cost alerts exist;
- [ ] storage cost is visible;
- [ ] egress cost is visible;
- [ ] observability cost is visible;
- [ ] platform attribution is available where practical.

## 63. C04-014 Operational Runbooks

Purpose:

Document repeatable production operations.

Required runbooks:

- deployment;
- rollback;
- database failure;
- queue failure;
- storage failure;
- credential compromise;
- Lab Agent failure;
- backup restore;
- DR;
- incident response.

Dependencies:

- C04-007 through C04-013.

Owner:

- SRE
- DEVOPS
- SEC-ENG

Acceptance:

- [ ] runbooks are version-controlled;
- [ ] owners are assigned;
- [ ] escalation paths exist;
- [ ] critical runbooks are tested.

## 64. C04-015 Production Deployment

Purpose:

Deploy the approved release into production.

Dependencies:

- C04-001 through C04-014;
- C03-011.

Owner:

- DEVOPS
- CLOUD-ARCH

Acceptance:

- [ ] approved artifact is deployed;
- [ ] migrations complete safely;
- [ ] smoke tests pass;
- [ ] monitoring is green;
- [ ] rollback plan is ready.

## 65. C04-016 Production Acceptance

Purpose:

Close the cloud production milestone.

Dependencies:

- C04-015.

Owner:

- CLOUD-ARCH
- SRE
- SEC-ENG
- QA-ENG

Acceptance:

- [ ] end-to-end production flow passes;
- [ ] security gate passes;
- [ ] SLO monitoring works;
- [ ] backups are healthy;
- [ ] DR evidence exists;
- [ ] runbooks are operational;
- [ ] production approval is recorded.

## 66. C-M04 Exit Criteria

- [ ] all P0 production tasks complete;
- [ ] security hardening complete;
- [ ] observability complete;
- [ ] backup/restore complete;
- [ ] DR validated;
- [ ] cost controls active;
- [ ] runbooks tested;
- [ ] production acceptance approved.

## 67. Complete Task Inventory

The complete cloud backlog contains 45 tasks:

    C-M01: 9 tasks
    C-M02: 9 tasks
    C-M03: 11 tasks
    C-M04: 16 tasks

    Total: 45 tasks

The planning estimates are approximately:

    C-M01: 44 person-days
    C-M02: 46 person-days
    C-M03: 58 person-days
    C-M04: 99 person-days

    Total planning estimate: 247 person-days

These estimates are cloud-only planning estimates and should not be interpreted
as total Kritva RaaS engineering effort.

## 68. Priority Summary

The current backlog is intentionally P0-heavy through production.

| Milestone | P0 | P1 | P2 |
|---|---:|---:|---:|
| C-M01 | 9 | 0 | 0 |
| C-M02 | 9 | 0 | 0 |
| C-M03 | 11 | 0 | 0 |
| C-M04 | 15 | 1 | 0 |
| Total | 44 | 1 | 0 |

C04-013 is P1 because cost optimization can begin with basic controls while
more advanced unit-economics attribution can follow.

## 69. Phase-to-Task Mapping

| Phase | Primary Tasks |
|---|---|
| Phase 0 | C01-001, C01-002, C01-003, C01-007, C01-008 |
| Phase 1 | C01-004, C01-005, C01-006, C01-009, C02-001, C02-003 |
| Phase 2 | C02-005 |
| Phase 3 | C02-002, C02-004, C02-006, C02-007, C02-008, C02-009 |
| Phase 4 | C03-001–C03-007 |
| Phase 5 | C03-009, C03-010 |
| Phase 6 | C03-008, C03-010 |
| Phase 7 | C03-007, C03-009, C03-010, C03-011 |
| Phase 8 | C04-001–C04-016 |

## 70. Critical Path Tasks

The likely critical cloud path is:

    C01-001
       |
    C01-002
       |
    C01-003
       |
    C01-007
       |
    C01-004
       |
    C01-005
       |
    C02-001
       |
    C02-004
       |
    C02-002
       |
    C02-006
       |
    C03-008
       |
    C03-010
       |
    C03-011
       |
    C04-015
       |
    C04-016

Parallel work should be used wherever dependencies permit.

## 71. Parallelizable Work

The following can proceed in parallel after foundation dependencies:

- PostgreSQL;
- object storage;
- secrets;
- CI validation;
- observability;
- compute;
- backend development;
- Studio development;
- mock Lab Agent development.

Integration remains gated by the milestone acceptance criteria.

## 72. Task Dependency Rules

A task must not:

- bypass a required architecture decision;
- introduce a conflicting cloud pattern;
- create production-only manual configuration;
- expose private services publicly;
- use unrestricted credentials;
- bypass tenant authorization;
- bypass observability requirements.

## 73. Security Task Rule

Every cloud task involving infrastructure must verify:

- IAM;
- network access;
- encryption;
- secret handling;
- auditability.

Security is part of task completion, not a separate optional review.

## 74. Observability Task Rule

Every cloud workload task must verify:

- health;
- logs;
- metrics;
- errors;
- relevant traces;
- operational alerts where appropriate.

## 75. Environment Task Rule

Every environment task must define:

- environment;
- resources;
- credentials;
- configuration;
- observability;
- cleanup/recovery behavior.

## 76. Lab Task Rule

Every Lab-related task must preserve:

- unique Agent identity;
- secure cloud connection;
- tenant authorization;
- resource authorization;
- local safety authority;
- reconciliation.

## 77. Production Task Rule

Production tasks require:

- staging validation;
- security review;
- observability;
- rollback/recovery plan;
- acceptance evidence.

## 78. Risk Register

| Risk | Affected Tasks | Mitigation |
|---|---|---|
| Provider lock-in | C01-002 | Provider-neutral interfaces |
| IAM over-privilege | C01-007, C04-007 | Least privilege review |
| Network exposure | C01-003, C04-001 | Private-by-default |
| DB failure | C01-005, C04-003 | HA + backup |
| Object loss | C01-006, C04-004 | Protection + recovery |
| Queue outage | C02-004, C04-005 | Durable queue + recovery |
| Lab outage | C02-006, C03-008 | Mock path + reconciliation |
| Security vulnerability | C01-008, C04-007 | Automated scanning |
| Observability gaps | C01-009, C02-007, C04-008 | Progressive observability |
| Cost growth | C04-013 | Budgets + attribution |
| Migration failure | C02-003, C03-003 | Staging validation |
| DR failure | C04-010–C04-012 | Restore exercises |

## 79. Open Questions

The following remain implementation decisions:

1. Final cloud provider.
2. Final IaC technology.
3. Final container orchestration platform.
4. Final managed PostgreSQL service.
5. Final object storage service.
6. Final queue service.
7. Final secret/KMS service.
8. Final identity provider.
9. Final WAF.
10. Final observability provider.
11. Final SIEM.
12. Final telemetry backend.
13. Final cloud region.
14. Final multi-zone configuration.
15. Final RPO/RTO.
16. Final production cost budget.
17. Final cross-region replication strategy.
18. Final Lab connectivity technology.
19. Final media/video infrastructure.

Open questions do not block backlog execution where provider-neutral interfaces
are sufficient.

## 80. Full Acceptance Criteria Checklist

### Backlog Governance

- [ ] All cloud tasks have stable IDs.
- [ ] All tasks have owners.
- [ ] All tasks have estimates.
- [ ] All tasks have priorities.
- [ ] All tasks have dependencies.
- [ ] All tasks have acceptance references.
- [ ] Milestone ownership is explicit.
- [ ] Phase mapping is maintained.
- [ ] Task status can be tracked independently.

### C-M01

- [ ] C01-001 complete.
- [ ] C01-002 complete.
- [ ] C01-003 complete.
- [ ] C01-004 complete.
- [ ] C01-005 complete.
- [ ] C01-006 complete.
- [ ] C01-007 complete.
- [ ] C01-008 complete.
- [ ] C01-009 complete.
- [ ] Foundation gate approved.

### C-M02

- [ ] C02-001 complete.
- [ ] C02-002 complete.
- [ ] C02-003 complete.
- [ ] C02-004 complete.
- [ ] C02-005 complete.
- [ ] C02-006 complete.
- [ ] C02-007 complete.
- [ ] C02-008 complete.
- [ ] C02-009 complete.
- [ ] Development gate approved.

### C-M03

- [ ] C03-001 complete.
- [ ] C03-002 complete.
- [ ] C03-003 complete.
- [ ] C03-004 complete.
- [ ] C03-005 complete.
- [ ] C03-006 complete.
- [ ] C03-007 complete.
- [ ] C03-008 complete.
- [ ] C03-009 complete.
- [ ] C03-010 complete.
- [ ] C03-011 complete.
- [ ] Staging gate approved.

### C-M04

- [ ] C04-001 complete.
- [ ] C04-002 complete.
- [ ] C04-003 complete.
- [ ] C04-004 complete.
- [ ] C04-005 complete.
- [ ] C04-006 complete.
- [ ] C04-007 complete.
- [ ] C04-008 complete.
- [ ] C04-009 complete.
- [ ] C04-010 complete.
- [ ] C04-011 complete.
- [ ] C04-012 complete.
- [ ] C04-013 complete.
- [ ] C04-014 complete.
- [ ] C04-015 complete.
- [ ] C04-016 complete.
- [ ] Production gate approved.

### Security

- [ ] IAM is least privilege.
- [ ] Production access is restricted.
- [ ] Network is private-by-default.
- [ ] Secrets use managed storage.
- [ ] KMS is configured.
- [ ] WAF is active in production.
- [ ] Vulnerability scans are active.
- [ ] Tenant isolation is tested.
- [ ] Security events are audited.
- [ ] Incident runbooks exist.

### Storage

- [ ] PostgreSQL is authoritative.
- [ ] Object storage is private.
- [ ] Artifacts use object storage.
- [ ] Results use object storage.
- [ ] Signed URLs are scoped.
- [ ] Encryption is enabled.
- [ ] Lifecycle policies exist.
- [ ] Backup exists.
- [ ] Restore is validated.
- [ ] Reconciliation exists.

### Observability

- [ ] Logs are structured.
- [ ] Metrics exist.
- [ ] Traces exist.
- [ ] Correlation IDs propagate.
- [ ] Dashboards exist.
- [ ] Alerts exist.
- [ ] SLOs exist before production.
- [ ] Lab telemetry is observable.
- [ ] Observability data is tenant-safe.
- [ ] Observability cost is measured.

### Deployment

- [ ] Infrastructure is reproducible.
- [ ] CI validates IaC.
- [ ] Application artifacts are immutable.
- [ ] Development deployment is automated.
- [ ] Staging deployment is automated.
- [ ] Production deployment is controlled.
- [ ] Rollback procedures exist.
- [ ] Database migration procedures exist.

### Reliability

- [ ] Health checks exist.
- [ ] Workers are restart-safe.
- [ ] Queue retries are configured.
- [ ] Dead letters are monitored.
- [ ] Reconciliation exists.
- [ ] Database backups exist.
- [ ] Restore is tested.
- [ ] DR is tested.
- [ ] Runbooks exist.

## 81. Final Task Invariants

The cloud backlog must preserve these invariants:

1. Every task implements an approved architecture boundary.
2. Every task has a stable ID.
3. Every task has explicit acceptance evidence.
4. PRI-0 tasks are required for their milestone gate.
5. Dependencies are explicit.
6. Cloud infrastructure is reproducible.
7. Production does not depend on development infrastructure.
8. Environment credentials remain isolated.
9. PostgreSQL remains authoritative for structured business state.
10. Object storage remains authoritative for large binary payloads.
11. Queue remains asynchronous transport.
12. Security controls are part of task completion.
13. Observability controls are part of task completion.
14. Lab connectivity never bypasses physical safety.
15. Production requires staging validation.
16. Production requires backup and restore evidence.
17. Production requires security acceptance.
18. Production requires observability acceptance.
19. Production requires operational runbooks.
20. Cost is part of cloud readiness.
21. Provider-specific choices must not unnecessarily leak into application
    contracts.
22. Reconciliation remains mandatory for uncertain distributed state.

## 82. Final Backlog Structure

The cloud backlog is intentionally organized as:

    C-M01 FOUNDATION
        |
        +-- C01-001 Account/Project
        +-- C01-002 IaC
        +-- C01-003 Network
        +-- C01-004 Compute
        +-- C01-005 PostgreSQL
        +-- C01-006 Object Storage
        +-- C01-007 Secrets
        +-- C01-008 CI Validation
        +-- C01-009 Monitoring
        |
        v
    C-M02 DEVELOPMENT
        |
        +-- C02-001 Control Plane
        +-- C02-002 Workers
        +-- C02-003 Migrations
        +-- C02-004 Queue
        +-- C02-005 Artifacts
        +-- C02-006 Mock Lab
        +-- C02-007 Observability
        +-- C02-008 Deployment
        +-- C02-009 E2E
        |
        v
    C-M03 STAGING
        |
        +-- C03-001 Network
        +-- C03-002 Compute
        +-- C03-003 Database
        +-- C03-004 Storage
        +-- C03-005 Queue
        +-- C03-006 Secrets
        +-- C03-007 Observability
        +-- C03-008 Test Lab
        +-- C03-009 RC Deployment
        +-- C03-010 E2E Acceptance
        +-- C03-011 Promotion Gate
        |
        v
    C-M04 PRODUCTION
        |
        +-- C04-001 Network
        +-- C04-002 Compute
        +-- C04-003 PostgreSQL
        +-- C04-004 Storage
        +-- C04-005 Queue
        +-- C04-006 Secrets
        +-- C04-007 Security
        +-- C04-008 Monitoring
        +-- C04-009 Alerting
        +-- C04-010 Backup
        +-- C04-011 Restore
        +-- C04-012 DR
        +-- C04-013 Cost
        +-- C04-014 Runbooks
        +-- C04-015 Deployment
        +-- C04-016 Acceptance

## 83. Final Cloud Execution Path

The completed backlog must enable:

    Developer
       |
       v
    Kritva RaaS Studio
       |
       v
    Secure Cloud API
       |
       +--> PostgreSQL
       +--> Object Storage
       +--> Queue
       +--> Workers
       +--> Scheduler
       +--> Observability
       |
       v
    Lab Agent
       |
       v
    Robot
       |
       v
    Results / Telemetry
       |
       v
    Storage / Analysis

The 45-task backlog therefore represents the cloud implementation path from
architecture foundation through production RaaS operation.

The intended implementation discipline is:

> **Architecture → Task → Implementation → Evidence → Review → Milestone Gate.**

No cloud milestone should be considered complete merely because resources have
been provisioned. The milestone is complete only when its infrastructure,
security, observability, reliability and acceptance criteria have been
demonstrated.
