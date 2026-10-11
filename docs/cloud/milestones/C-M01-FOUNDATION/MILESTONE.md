# C-M01 — Cloud Foundation

## Milestone Dossier

**Milestone ID:** C-M01-FOUNDATION  
**Product:** Kritva RaaS  
**Primary Phase:** P0 FOUNDATION  
**Supporting Phases:** None  
**Primary Surface:** Cloud Infrastructure / Platform Engineering / Security / CI/CD  
**Architecture:** Provider-neutral managed cloud foundation  
**Priority:** PRI-0 (critical invariant per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** Establish a secure, reproducible, isolated and observable cloud foundation on which the Kritva RaaS Control Plane, database, object storage, queue, workers, Lab connectivity and production operations can be deployed consistently across Local, Development, Staging and Production environments.

---

# 1 Objective

## 1.1 Milestone Objective

C-M01 establishes the foundational cloud platform required for Kritva RaaS.

The milestone creates the infrastructure boundary:

    Developer
        |
        v
    Git Repository
        |
        v
    CI/CD
        |
        v
    Infrastructure as Code
        |
        v
    Cloud Account / Project
        |
        +---------------------------+
        |                           |
        v                           v
    Network                    IAM / Secrets
        |                           |
        +-------------+-------------+
                      |
                      v
              Application Platform
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
      PostgreSQL   Object      Queue
                   Storage
          |           |           |
          +-----------+-----------+
                      |
                      v
                Observability
                      |
                      v
                 Operations

The cloud foundation must exist before application services are promoted into
Development, Staging or Production.

## 1.2 Foundation Goal

The foundation must be:

- reproducible;
- secure;
- environment-isolated;
- least-privilege;
- observable;
- auditable;
- automatable;
- provider-neutral at the architecture boundary;
- suitable for controlled production evolution.

## 1.3 Environment Goal

The baseline environments are:

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

Each environment must have independent:

- configuration;
- credentials;
- secrets;
- persistence;
- deployment identity;
- observability scope;
- access policy.

Production must never depend on Development infrastructure for business
operation.

## 1.4 Infrastructure-as-Code Goal

Cloud resources must be defined through version-controlled Infrastructure as
Code.

The desired flow is:

    Change
      |
      v
    Pull Request
      |
      v
    IaC Validation
      |
      v
    Plan / Preview
      |
      v
    Review
      |
      v
    Apply
      |
      v
    Verification

Manual console changes may be required for bootstrap or emergency recovery,
but they must not become the normal configuration mechanism.

## 1.5 Security Goal

C-M01 establishes the first cloud security boundary:

- account/project isolation;
- IAM;
- least privilege;
- network segmentation;
- secret storage;
- encryption;
- audit logging;
- CI/CD identity;
- administrative access.

## 1.6 Networking Goal

The network foundation must provide controlled separation between:

    Internet
       |
       v
    Public Edge
       |
       v
    Application Tier
       |
       +--> Database
       +--> Queue
       +--> Object Storage
       +--> Secret/KMS
       |
       v
    Secure Lab Connectivity

Private resources should not be directly exposed to the public Internet.

## 1.7 CI/CD Goal

CI/CD must provide a controlled path from Git commit to cloud deployment.

At C-M01, the objective is infrastructure and platform deployment readiness,
not full application release automation.

## 1.8 Observability Goal

The foundation must expose enough infrastructure information to determine:

- whether resources are available;
- whether infrastructure is failing;
- whether capacity is being exhausted;
- whether security events are occurring;
- whether deployments succeeded.

## 1.9 Provider-Neutrality Goal

The architecture defines:

- interfaces;
- trust boundaries;
- resource classes;
- security requirements;
- environment contracts.

It does not make the product architecture dependent on one cloud provider's
proprietary service model.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

C-M01 includes:

- cloud account/project structure;
- environment isolation;
- resource naming;
- tagging/labels;
- Infrastructure as Code;
- state management;
- network foundation;
- DNS foundation;
- TLS foundation;
- IAM;
- administrative roles;
- workload identities;
- CI/CD identities;
- secret management;
- key-management integration boundary;
- encryption defaults;
- cloud audit logging;
- base monitoring;
- centralized logging foundation;
- alerting foundation;
- budget/cost visibility;
- cloud resource inventory;
- development environment bootstrap;
- staging foundation;
- production foundation;
- infrastructure deployment pipeline;
- drift detection;
- backup-policy foundation;
- infrastructure recovery documentation.

## 2.2 Explicitly Out of Scope

C-M01 does not implement:

- complete RaaS backend APIs;
- complete Studio application;
- booking business logic;
- credit ledger;
- Job orchestration;
- Run execution;
- Result processing;
- physical robot control;
- full Lab Agent;
- production customer onboarding;
- advanced autoscaling;
- active-active multi-region;
- advanced analytics;
- formal external security certification.

## 2.3 Initial Environment Model

| Environment | Purpose | Data | Access | Availability |
|---|---|---|---|---|
| Local | Developer workstation | Synthetic | Developer | Best effort |
| Development | Integration | Non-production | Engineering | Moderate |
| Staging | Production-like qualification | Synthetic/sanitized | Restricted | High |
| Production | Customer service | Production | Restricted | Production target |

## 2.4 Cloud Resource Classes

C-M01 defines these logical classes:

- Edge;
- Network;
- Compute;
- Database;
- Storage;
- Queue;
- Secrets;
- Keys;
- Observability;
- Security;
- CI/CD;
- Backup;
- Cost management.

## 2.5 Foundation Boundary

The foundation ends at the infrastructure boundary.

    Cloud Foundation
          |
          +--> Network
          +--> IAM
          +--> Secrets
          +--> Compute substrate
          +--> Database substrate
          +--> Storage substrate
          +--> Queue substrate
          +--> Observability
          +--> CI/CD
          |
          v
    Application Services

Application domain behavior belongs to backend milestones.

---

# 3 Dependencies

## 3.1 Product Dependencies

C-M01 depends on:

- Kritva RaaS repository;
- implementation roadmap;
- phases;
- architecture decisions;
- security baseline;
- database architecture;
- protocol architecture;
- development setup;
- branching strategy.

## 3.2 Architecture Dependencies

C-M01 must remain consistent with:

- provider-neutral infrastructure;
- modular monolith Control Plane;
- PostgreSQL authoritative store;
- object storage for large files;
- durable queue;
- Lab Agent boundary;
- local robot safety authority.

## 3.3 Security Dependencies

C-M01 consumes requirements from:

- AUTHENTICATION;
- AUTHORIZATION;
- SOURCE_CODE_PRIVACY;
- ARTIFACT_SECURITY;
- SECRETS_MANAGEMENT;
- KEY_MANAGEMENT;
- SECURITY_REQUIREMENTS;
- THREAT_MODEL.

## 3.4 Development Dependency

The repository must support:

- reproducible IaC;
- CI execution;
- environment configuration;
- secret references;
- deployment metadata.

## 3.5 Backend Dependency

The infrastructure must provide deployment targets for:

- API;
- workers;
- WebSocket infrastructure;
- database;
- object storage;
- queue;
- observability.

The backend is not required to be complete for C-M01.

---

# 4 Deliverables

## 4.1 Cloud Account / Project Structure

The cloud foundation must establish clear ownership.

Conceptual:

    Organization / Billing
           |
           +-------------------+
           |                   |
           v                   v
       Non-Production       Production
           |                   |
       +---+---+               |
       |       |               |
       v       v               v
      Dev   Staging          Prod

Exact cloud-provider terminology may differ.

## 4.2 Environment Isolation

Each environment must have separate:

- resource namespace;
- IAM policy;
- secrets;
- database;
- storage;
- queue;
- observability context.

## 4.3 Resource Naming

Naming must be deterministic.

Conceptual:

    <product>-<environment>-<region>-<resource>

Example:

    kritva-raas-dev-api
    kritva-raas-stg-db
    kritva-raas-prod-storage

The exact naming convention must be implemented consistently through IaC.

## 4.4 Resource Tagging

Resources should carry:

- product;
- environment;
- owner;
- cost center;
- managed-by;
- component;
- data classification;
- lifecycle.

Example:

    product=kritva-raas
    environment=production
    managed-by=iac
    component=control-plane

## 4.5 Infrastructure as Code

IaC must define:

- networking;
- IAM;
- compute substrate;
- database;
- object storage;
- queue;
- secrets integration;
- observability;
- DNS;
- TLS;
- backups where supported;
- environment configuration.

## 4.6 IaC State

IaC state must be:

- remote;
- access-controlled;
- encrypted;
- versioned where supported;
- backed up where appropriate;
- isolated by environment;
- protected from concurrent uncontrolled writes.

State must never contain plaintext secrets where avoidable.

## 4.7 Network Foundation

Logical topology:

    Internet
       |
       v
    DNS
       |
       v
    TLS / Edge
       |
       v
    Public Load Balancer
       |
       v
    Application Subnet
       |
       +-------------------+
       |                   |
       v                   v
    Worker Subnet      Private Services
                           |
                    +------+------+
                    |      |      |
                    v      v      v
                   DB    Queue   Storage

## 4.8 Network Segmentation

The baseline separates:

- public ingress;
- application workloads;
- data services;
- administrative access;
- lab connectivity.

Private data services must not accept arbitrary Internet traffic.

## 4.9 Egress Control

Outbound traffic must be controlled where practical.

Requirements:

- no unrestricted administrative egress;
- explicit dependency access;
- DNS controlled;
- package/download paths monitored where required;
- lab connectivity explicitly authorized.

## 4.10 DNS Foundation

Provide:

- production domain;
- environment subdomains;
- service records where required;
- controlled DNS access;
- change auditability.

Conceptual:

    kritvaos.in
       |
       +--> app
       +--> api
       +--> staging
       +--> dev

Exact domains and service names remain configurable.

## 4.11 TLS Foundation

TLS must be mandatory for:

- public APIs;
- Studio control-plane connections;
- administrative interfaces;
- Lab connectivity where applicable.

Certificates must be:

- managed;
- rotated;
- monitored;
- non-hardcoded.

## 4.12 IAM Foundation

Roles should follow:

    Human Administrator
          |
          v
    Administrative Role

    CI/CD
          |
          v
    Deployment Identity

    Application
          |
          v
    Workload Identity

    Lab Agent
          |
          v
    Lab Identity

No shared production administrator credential should be used by automated
workloads.

## 4.13 IAM Principles

- least privilege;
- separation of duties;
- no standing privilege where avoidable;
- environment-specific identities;
- explicit role ownership;
- periodic review;
- auditable changes;
- short-lived credentials where practical.

## 4.14 Administrative Access

Administrative access must support:

- named human identities;
- MFA;
- privileged role separation;
- logging;
- emergency/break-glass procedure.

Shared human accounts are prohibited except where technically unavoidable
and explicitly controlled.

## 4.15 CI/CD Identity

CI/CD must use workload identity or equivalent short-lived authentication.

Preferred flow:

    Git Provider
        |
        v
    CI Job
        |
        v
    Federated Identity
        |
        v
    Cloud Deployment Role
        |
        v
    IaC Apply

Long-lived cloud credentials stored in CI variables should be avoided.

## 4.16 Secrets

Secret classes:

    S0 Public
    S1 Internal
    S2 Confidential
    S3 Restricted
    S4 Critical

C-M01 establishes the secret provider integration.

Examples:

- database credentials;
- queue credentials;
- service credentials;
- webhook secrets;
- API keys;
- TLS private keys.

## 4.17 Secret Access

Secrets should flow:

    Secret Store
         |
         v
    Workload Identity
         |
         v
    Runtime Injection
         |
         v
    Application

Secrets should not flow:

    Git
      |
      v
    Container Image
      |
      v
    Application

## 4.18 Key Management

C-M01 establishes the cloud KMS integration boundary.

Key classes include:

- encryption keys;
- artifact-signing keys;
- token-signing keys;
- CA-related keys.

Production critical keys must not be freely exportable.

## 4.19 Cloud Audit

Audit logs must capture:

- IAM changes;
- resource creation/deletion;
- network changes;
- secret access where supported;
- key operations;
- deployment activity;
- administrative actions.

## 4.20 Base Observability

Required foundation:

    Cloud Resources
          |
          +--> Metrics
          +--> Logs
          +--> Audit
          +--> Events
          |
          v
    Observability Platform
          |
          +--> Dashboard
          +--> Alert
          +--> Retention

## 4.21 Base Metrics

At minimum monitor:

- CPU;
- memory;
- network;
- disk;
- database health;
- queue health;
- storage usage;
- certificate expiry;
- deployment status;
- cloud resource health.

## 4.22 Base Logging

Infrastructure logs must be:

- centralized where practical;
- structured where supported;
- environment tagged;
- timestamped;
- access controlled;
- retention controlled.

## 4.23 Alerting

Initial alerts:

- service unavailable;
- database unavailable;
- queue unavailable;
- storage capacity threshold;
- excessive error rate;
- certificate expiration;
- failed deployment;
- backup failure;
- suspicious IAM activity;
- budget threshold.

## 4.24 Cost Foundation

C-M01 establishes:

- billing account linkage;
- environment attribution;
- resource tagging;
- budget alerts;
- cost dashboards/reports.

Cost controls must not automatically terminate production workloads without
explicit policy.

## 4.25 CI Pipeline

Minimum:

    Pull Request
       |
       +--> Format
       +--> Lint
       +--> Type Check
       +--> IaC Validate
       +--> Security Scan
       +--> Test
       |
       v
    Merge
       |
       v
    Development Deploy

## 4.26 Infrastructure Deployment Pipeline

    IaC Change
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
       |
       v
    Record Evidence

## 4.27 Environment Promotion

    Development
        |
        v
    Staging
        |
        v
    Production

Production must not be deployed directly from an unreviewed developer
workstation.

## 4.28 Backup Foundation

C-M01 establishes infrastructure-level backup requirements for:

- PostgreSQL;
- IaC state;
- critical configuration;
- object storage where applicable.

Application-specific retention belongs to later milestones.

## 4.29 Recovery Foundation

Recovery must include:

- infrastructure recreation;
- state recovery;
- secret recovery;
- network recovery;
- database recovery integration;
- DNS recovery;
- certificate recovery.

---

# 9 Risks

## 9.1 R-CM01-001 — Cloud Account Misconfiguration

**Risk:** Incorrect account/project setup causes security or billing problems.

**Impact:** High.

**Mitigation:**

- account baseline;
- IaC;
- naming;
- access review;
- billing controls.

## 9.2 R-CM01-002 — Public Data Exposure

**Risk:** Database/storage accidentally becomes Internet-accessible.

**Impact:** Critical.

**Mitigation:**

- private-by-default;
- network controls;
- automated exposure scanning;
- security review.

## 9.3 R-CM01-003 — Excessive IAM Privilege

**Risk:** Human or workload identity receives unnecessary privileges.

**Impact:** Critical.

**Mitigation:**

- least privilege;
- scoped roles;
- access review;
- short-lived identity;
- audit.

## 9.4 R-CM01-004 — Long-Lived CI Credentials

**Risk:** Compromised CI credential provides persistent cloud access.

**Impact:** Critical.

**Mitigation:**

- workload federation;
- short-lived credentials;
- environment-specific roles;
- revocation.

## 9.5 R-CM01-005 — IaC State Leakage

**Risk:** Sensitive information is stored in IaC state.

**Impact:** Critical.

**Mitigation:**

- remote encrypted state;
- restricted access;
- state review;
- avoid secret values;
- secret-provider references.

## 9.6 R-CM01-006 — Environment Contamination

**Risk:** Development accesses production data or credentials.

**Impact:** Critical.

**Mitigation:**

- separate accounts/projects;
- separate IAM;
- separate secrets;
- separate data stores;
- automated tests.

## 9.7 R-CM01-007 — Infrastructure Drift

**Risk:** Manual changes diverge from IaC.

**Impact:** High.

**Mitigation:**

- drift detection;
- restricted console access;
- IaC-first policy;
- periodic reconciliation.

## 9.8 R-CM01-008 — Cloud Cost Explosion

**Risk:** Misconfiguration creates unexpected resource cost.

**Impact:** High.

**Mitigation:**

- budgets;
- alerts;
- tagging;
- quotas;
- cost review.

## 9.9 R-CM01-009 — Observability Blind Spot

**Risk:** Infrastructure failure is not detected.

**Impact:** High.

**Mitigation:**

- base metrics;
- centralized logs;
- alerts;
- health checks;
- dashboards.

## 9.10 R-CM01-010 — Single Cloud Dependency

**Risk:** Architecture becomes inseparable from one provider.

**Impact:** Medium/High.

**Mitigation:**

- provider-neutral interfaces;
- infrastructure modules;
- avoid provider-specific business semantics.

## 9.11 R-CM01-011 — Recovery Not Reproducible

**Risk:** Cloud infrastructure cannot be recreated after loss.

**Impact:** Critical.

**Mitigation:**

- IaC;
- backup;
- recovery drill;
- documented runbooks.

## 9.12 R-CM01-012 — Certificate Expiration

**Risk:** Production endpoint becomes unavailable due to expired TLS.

**Impact:** High.

**Mitigation:**

- automated certificate management;
- expiration monitoring;
- alerting.

## 9.13 R-CM01-013 — Secret Provider Outage

**Risk:** Applications cannot retrieve secrets.

**Impact:** High.

**Mitigation:**

- provider HA;
- controlled caching where safe;
- startup/readiness handling;
- incident runbook.

## 9.14 R-CM01-014 — Network Rule Regression

**Risk:** Firewall changes block critical traffic or expose private services.

**Impact:** High.

**Mitigation:**

- IaC review;
- automated network tests;
- least privilege;
- staging validation.

## 9.15 R-CM01-015 — Production Access Abuse

**Risk:** Privileged human access is misused.

**Impact:** Critical.

**Mitigation:**

- named accounts;
- MFA;
- role separation;
- audit;
- break-glass controls.

## 9.16 R-CM01-016 — Cloud Failure Affects Physical Robot

**Risk:** Cloud failure is incorrectly coupled to robot behavior.

**Impact:** Critical.

**Mitigation:**

- Lab Agent boundary;
- local runtime;
- local safety authority;
- no unsafe automatic restart.

---

# 10 Exit Criteria

## 10.1 Account Exit

- [ ] Cloud account/project hierarchy approved.
- [ ] Environment isolation implemented.
- [ ] Resource naming implemented.
- [ ] Resource ownership implemented.
- [ ] Billing attribution implemented.

## 10.2 IaC Exit

- [ ] Development IaC works.
- [ ] Staging IaC works.
- [ ] Production IaC works.
- [ ] State is protected.
- [ ] CI validates IaC.
- [ ] Plan is reviewable.
- [ ] Apply is controlled.
- [ ] Drift is detectable.
- [ ] Recovery from IaC is demonstrated.

## 10.3 Network Exit

- [ ] Public/private segmentation works.
- [ ] Database is private.
- [ ] Storage is private.
- [ ] Queue is private.
- [ ] Firewall rules are reviewed.
- [ ] Egress is controlled.
- [ ] DNS works.
- [ ] TLS works.
- [ ] Lab boundary is defined.

## 10.4 IAM Exit

- [ ] Human roles implemented.
- [ ] CI identity implemented.
- [ ] Workload identity implemented.
- [ ] Lab identity implemented.
- [ ] Least privilege reviewed.
- [ ] MFA enabled for privileged access.
- [ ] Access review process defined.
- [ ] Break-glass process defined.

## 10.5 Secrets and Keys Exit

- [ ] Secret provider integrated.
- [ ] Environment isolation verified.
- [ ] Secret rotation tested.
- [ ] KMS integration established.
- [ ] Critical key access restricted.
- [ ] Key rotation/revocation policy documented.

## 10.6 Observability Exit

- [ ] Infrastructure metrics available.
- [ ] Infrastructure logs available.
- [ ] Audit logs available.
- [ ] Dashboards available.
- [ ] Alerts available.
- [ ] Alert ownership assigned.
- [ ] Certificate monitoring enabled.
- [ ] Backup monitoring enabled.

## 10.7 CI/CD Exit

- [ ] IaC validation automated.
- [ ] IaC plan automated.
- [ ] Development apply automated.
- [ ] Staging promotion controlled.
- [ ] Production approval gate exists.
- [ ] Deployment evidence retained.
- [ ] Unauthorized production deployment is denied.

## 10.8 Recovery Exit

- [ ] IaC recovery tested.
- [ ] Database recovery foundation exists.
- [ ] Object-storage recovery foundation exists.
- [ ] Secret recovery process exists.
- [ ] DNS/TLS recovery process exists.
- [ ] Recovery runbook approved.

## 10.9 Security Exit

- [ ] Security review passed.
- [ ] IAM review passed.
- [ ] Network review passed.
- [ ] Public exposure scan passed.
- [ ] IaC security scan passed.
- [ ] No unapproved critical findings remain.

## 10.10 Operational Exit

- [ ] Cloud ownership assigned.
- [ ] Runbooks exist.
- [ ] Incident process exists.
- [ ] Cost review exists.
- [ ] Access review exists.
- [ ] Drift review exists.
- [ ] Production foundation readiness review passed.

## 10.11 Formal Milestone Status

C-M01 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    QUALIFICATION
       |
       v
    FOUNDATION_REVIEW
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

C-M01 is not COMPLETE because cloud resources merely exist.

Completion requires:

- reproducibility;
- security evidence;
- environment isolation;
- observability;
- CI/CD evidence;
- recovery evidence;
- operational ownership.

---
