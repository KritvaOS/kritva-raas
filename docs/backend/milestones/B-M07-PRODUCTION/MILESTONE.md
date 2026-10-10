# B-M07 — Production

## Milestone Dossier

**Milestone ID:** B-M07-PRODUCTION  
**Product:** Kritva RaaS  
**Primary Phase:** Phase 8 — PRODUCTION  
**Supporting Phases:** None  
**Primary Surface:** Backend Control Plane / Cloud / Operations  
**Technology:** Production-oriented modular monolith, PostgreSQL, object storage, queue/workers, WebSocket, WebRTC/media integration, secure Lab Protocol, provider-neutral infrastructure  
**Priority:** P0  
**Status:** PLANNED  
**Primary Outcome:** Harden the Kritva RaaS backend and supporting infrastructure for production operation with security, tenant isolation, scalability, observability, high availability, disaster recovery, performance qualification, compliance controls and release readiness.

---

# 1 Objective

## 1.1 Milestone Objective

B-M07 converts the RaaS backend from a functionally complete engineering
platform into a production-ready service that can safely operate customer
organizations, projects, robotic platforms, laboratories, bookings, jobs,
runs, results, credits and commercial workflows.

The milestone establishes the operational architecture:

    Internet
       |
       v
    DNS / Edge / TLS
       |
       v
    Load Balancer / API Gateway
       |
       v
    Stateless API Instances
       |
       +------------------+
       |                  |
       v                  v
    PostgreSQL         Queue / Workers
       |                  |
       |                  v
       |               Services
       |
       +--> Object Storage
       +--> Audit
       +--> Observability
       +--> Secrets / KMS
       |
       v
    Secure Lab Connectivity
       |
       v
    Lab Agent
       |
       v
    Kritva Runtime / Robot

## 1.2 Production Goal

The production backend must be:

- secure;
- tenant-isolated;
- observable;
- horizontally scalable where appropriate;
- resilient to instance failure;
- recoverable after infrastructure failure;
- performance-qualified;
- operationally manageable;
- auditable;
- release-controlled;
- provider-neutral at the architecture level.

## 1.3 Production Readiness Principle

Production readiness is not equivalent to:

> "The application works."

It means:

> "The application works predictably, securely, observably and recoverably
> under expected production load and known failure conditions."

## 1.4 Primary Production Invariants

B-M07 preserves the following invariants:

1. Organization remains the primary customer tenant boundary.
2. Authorization is enforced server-side.
3. PostgreSQL remains authoritative for business state.
4. Object storage remains authoritative for large binary content.
5. Queue delivery is not business truth.
6. Job and Run lifecycle state remains durable.
7. Financial state remains strongly consistent.
8. Booking/resource allocation remains strongly consistent.
9. Physical safety remains local to the lab/robot.
10. Cloud failure must not become an unsafe robot-control mechanism.
11. Secrets are never committed to source control.
12. Critical production keys are protected by KMS/HSM-equivalent controls.
13. Production changes are auditable.
14. Database migrations are version controlled.
15. Releases are reproducible and traceable.
16. Recovery procedures are tested rather than merely documented.

## 1.5 Security Objective

B-M07 operationalizes:

- authentication;
- authorization;
- tenant isolation;
- source-code privacy;
- artifact security;
- secret management;
- key management;
- audit logging;
- network security;
- workload isolation;
- vulnerability management.

## 1.6 Scalability Objective

The system must scale the dominant workloads independently where practical:

- API requests;
- WebSocket connections;
- workers;
- result processing;
- telemetry ingestion;
- log ingestion;
- media signaling;
- downloads.

The architecture remains a modular monolith rather than prematurely splitting
business domains into independent services.

## 1.7 Availability Objective

Initial production target:

- multi-zone availability where practical;
- managed PostgreSQL HA where available;
- stateless API instances;
- redundant workers;
- durable queues;
- object-storage durability;
- health checks;
- graceful degradation.

Initial database targets remain:

- RPO <= 15 minutes;
- RTO <= 4 hours.

These are initial engineering targets and must be validated against the selected
production infrastructure.

## 1.8 Disaster Recovery Objective

B-M07 establishes:

- backup;
- point-in-time recovery;
- restore procedures;
- object-storage recovery;
- configuration recovery;
- secrets/key recovery;
- infrastructure recreation;
- operational runbooks;
- recovery drills.

## 1.9 Observability Objective

Every important production operation must be diagnosable using:

- logs;
- metrics;
- traces;
- audit events;
- health checks;
- alerts;
- dashboards.

A production operator must be able to answer:

> What failed?

> Which customer was affected?

> Which component failed?

> When did it start?

> What data was affected?

> What recovery action is required?

## 1.10 Performance Objective

Performance qualification covers:

- API latency;
- database latency;
- booking contention;
- credit transactions;
- job queue latency;
- artifact operations;
- result processing;
- telemetry ingestion;
- WebSocket connections;
- download authorization;
- concurrent users;
- concurrent Runs.

## 1.11 Compliance Objective

B-M07 establishes the technical foundation required for compliance programs,
including:

- auditability;
- data retention;
- access control;
- incident response;
- evidence retention;
- change management;
- backup/recovery evidence;
- vulnerability management.

Specific certification claims are out of scope until formally assessed.

## 1.12 Release Readiness Objective

A release must have:

    Source
      |
      v
    Review
      |
      v
    CI
      |
      v
    Security
      |
      v
    Migration Qualification
      |
      v
    Performance Qualification
      |
      v
    Staging
      |
      v
    Release Candidate
      |
      v
    Production
      |
      v
    Post-Release Verification

Every production release must be traceable to source, build, configuration,
database migrations and deployment evidence.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M07 includes:

- production security hardening;
- tenant isolation;
- authentication hardening;
- authorization enforcement;
- secret management;
- key management;
- network security;
- API security;
- database security;
- object-storage security;
- workload security;
- audit logging;
- observability;
- metrics;
- tracing;
- dashboards;
- alerting;
- health checks;
- autoscaling strategy;
- capacity planning;
- performance testing;
- database performance;
- connection management;
- queue resilience;
- worker resilience;
- WebSocket resilience;
- production PostgreSQL HA;
- object-storage resilience;
- backup;
- point-in-time recovery;
- disaster recovery;
- restore testing;
- incident response;
- vulnerability management;
- dependency management;
- compliance evidence;
- release readiness;
- deployment automation;
- rollback;
- migration safety;
- production runbooks;
- operational readiness.

## 2.2 Explicitly Out of Scope

B-M07 does not implement:

- a new robotics operating system;
- robot firmware;
- physical E-stop hardware;
- new robot mechanical design;
- custom cloud provider products as architecture dependencies;
- active-active multi-region architecture;
- premature microservice decomposition;
- customer source-code storage;
- unrestricted customer server-side execution;
- formal external certification without a separate compliance program.

## 2.3 Initial Production Topology

    Region
      |
      +-------------------------------------+
      |                                     |
      v                                     v
   Zone A                                 Zone B
      |                                     |
      v                                     v
   API A                                  API B
      |                                     |
      +----------------+--------------------+
                       |
                       v
                 Load Balancer
                       |
                       v
                 PostgreSQL HA
                       |
          +------------+-------------+
          |            |             |
          v            v             v
      Queue       Object Store    Secrets/KMS
          |
          v
       Workers
          |
          v
      Lab Gateway
          |
          v
      Lab Agent

## 2.4 Availability Model

The initial production architecture is:

- single primary region;
- multi-zone application deployment where practical;
- managed PostgreSQL HA where practical;
- durable object storage;
- no active-active multi-region requirement;
- tested restore path;
- documented regional recovery strategy.

---

# 3 Dependencies

## 3.1 Previous Backend Milestones

B-M07 depends on:

- B-M01 Control Plane;
- B-M02 Artifact;
- B-M03 Platform;
- B-M04 Booking;
- B-M05 Execution;
- B-M06 Results.

## 3.2 Security Dependencies

B-M07 consumes:

- Authentication;
- Authorization;
- Source Code Privacy;
- Artifact Security;
- Secrets Management;
- Key Management;
- Threat Model;
- Security Requirements;
- Tenant Isolation;
- Audit Logging.

## 3.3 Planning Dependencies

B-M07 follows:

- IMPLEMENTATION_ROADMAP;
- PHASES;
- INTEGRATION_PLAN;
- RELEASE_ROADMAP;
- DECISIONS;
- DEVELOPMENT_WORKFLOW;
- BRANCHING_STRATEGY.

## 3.4 Infrastructure Dependencies

Required infrastructure abstractions include:

- PostgreSQL;
- object storage;
- queue;
- secret store;
- key-management service;
- load balancer/API gateway;
- DNS;
- TLS;
- monitoring;
- logging;
- tracing;
- alerting.

The implementation must remain provider-neutral at the application architecture
boundary.

## 3.5 Lab Dependencies

B-M07 depends on:

- Lab Agent;
- secure Lab Protocol;
- local runtime;
- robot safety boundary;
- simulation environment;
- controlled physical lab environment.

## 3.6 Release Dependencies

B-M07 requires:

- CI;
- automated builds;
- migration validation;
- security scanning;
- artifact provenance;
- deployment automation;
- release tagging;
- rollback capability.

---

# 4 Deliverables

## 4.1 Production Security Baseline

Deliver:

- hardened authentication;
- hardened authorization;
- tenant isolation;
- secure cookies/tokens;
- API rate limiting;
- input validation;
- secure headers;
- CORS policy;
- CSRF protection where applicable;
- request-size limits;
- upload controls;
- abuse protection.

## 4.2 Tenant Isolation

Tenant boundary:

    Organization
        |
        +--> Projects
        +--> Bookings
        +--> Credits
        +--> Jobs
        +--> Runs
        +--> Results
        +--> Experiments
        +--> Downloads
        +--> Audit

Every customer-owned record must be tenant-scoped either directly or through a
strong ownership chain.

## 4.3 Database Security

Production database controls include:

- private network access;
- TLS;
- restricted credentials;
- least privilege;
- application role separation where practical;
- migration role separation;
- backup encryption;
- connection limits;
- query monitoring;
- audit where required.

## 4.4 Object Storage Security

Object storage must provide:

- private buckets/containers;
- encryption;
- least privilege;
- controlled access;
- lifecycle policies;
- versioning where justified;
- checksum validation;
- restricted public access;
- audit logging.

## 4.5 Secret Management

No production secret may be:

- committed;
- logged;
- embedded in artifacts;
- stored in source;
- passed through insecure configuration files.

Production secrets must be retrieved from a controlled secret provider.

## 4.6 Key Management

Critical keys include:

- artifact-signing keys;
- token-signing keys;
- encryption keys;
- TLS/CA keys;
- Lab Agent identity keys.

Key usage must be separated by purpose.

## 4.7 Audit Logging

Audit events must cover:

- authentication;
- authorization failures;
- organization administration;
- project access;
- artifact actions;
- booking actions;
- credit operations;
- Job/Run lifecycle;
- Result access;
- downloads;
- administrative changes;
- security events;
- configuration changes;
- production operations.

## 4.8 Observability

Production observability includes:

    Metrics
       +
    Logs
       +
    Traces
       +
    Audit
       +
    Events
       |
       v
    Observability Platform
       |
       +--> Dashboards
       +--> Alerts
       +--> Incident Response

## 4.9 Standard Correlation

Every request should carry:

- request ID;
- trace ID;
- actor identity where applicable;
- organization ID where applicable;
- project ID where applicable;
- resource ID where applicable;
- Job/Run ID where applicable.

Sensitive information must not be placed into correlation fields.

## 4.10 Health Endpoints

The service must expose separate concepts:

- liveness;
- readiness;
- dependency health;
- operational health.

Liveness:

> Is the process alive?

Readiness:

> Can this instance accept traffic?

Dependency health:

> Which required dependency is unavailable?

## 4.11 Graceful Degradation

Examples:

    PostgreSQL unavailable
        |
        v
    Readiness = FAIL
        |
        v
    Remove instance from traffic

    Queue unavailable
        |
        v
    API may accept only operations
    that do not require asynchronous processing

    Object storage unavailable
        |
        v
    New large-file operations fail safely

The service must not silently report success when durable state cannot be
committed.

## 4.12 Autoscaling

Scale dimensions may include:

- API CPU;
- API request rate;
- queue depth;
- worker utilization;
- telemetry ingestion rate;
- WebSocket connections.

Scaling must not violate:

- database connection budget;
- robot safety;
- financial consistency;
- resource allocation constraints.

## 4.13 Database Connection Management

Application instances must use bounded connection pools.

Conceptually:

    Max DB Connections
           |
           v
    Connection Budget
           |
      +----+----+
      |         |
      v         v
     API      Workers

Scaling application instances must not multiply database connections without
limit.

## 4.14 Queue Resilience

Queue semantics:

- durable;
- at-least-once where appropriate;
- idempotent consumers;
- retry policy;
- dead-letter handling;
- visibility/lease timeout;
- monitoring.

Business state remains in PostgreSQL.

## 4.15 Worker Resilience

Workers must support:

- heartbeat;
- claim;
- lease;
- timeout;
- retry;
- recovery;
- graceful shutdown;
- dead-letter handling.

Workers must not perform unsafe duplicate physical actions.

## 4.16 WebSocket Resilience

WebSocket infrastructure must support:

- authenticated connections;
- tenant-scoped subscriptions;
- resource authorization;
- heartbeats;
- disconnect detection;
- reconnect;
- event sequence;
- deduplication;
- backpressure.

Durable REST/database state remains authoritative.

## 4.17 Performance Baseline

Initial target values:

| Area | Target |
|---|---:|
| API read p95 | <500 ms |
| API write p95 | <750 ms |
| Critical booking operation p95 | <1 s excluding external dependencies |
| Credit transaction p95 | <1 s |
| Result metadata p95 | <500 ms |
| Download authorization p95 | <500 ms |
| Health endpoint p95 | <200 ms |
| Error rate under normal load | <1% |
| Database CPU target | <70% sustained |
| Queue backlog | Within defined operational threshold |

Exact production SLOs must be finalized during qualification.

## 4.18 Disaster Recovery

Deliver:

- backup policy;
- PITR;
- restore runbook;
- recovery environment;
- restore validation;
- RPO measurement;
- RTO measurement;
- disaster drill.

## 4.19 Backup Strategy

At minimum:

    PostgreSQL
       |
       +--> Continuous WAL / PITR
       +--> Scheduled backup
       +--> Retention
       +--> Restore test

    Object Storage
       |
       +--> Versioning / replication where appropriate
       +--> Lifecycle
       +--> Recovery procedure

## 4.20 Release Automation

Production deployment:

    Git Tag
       |
       v
    CI Build
       |
       v
    Tests
       |
       v
    Security Scan
       |
       v
    Artifact
       |
       v
    Staging
       |
       v
    Qualification
       |
       v
    Production Approval
       |
       v
    Deployment
       |
       v
    Smoke Test
       |
       v
    Release Evidence

## 4.21 Migration Safety

Database changes follow:

    Expand
       |
       v
    Deploy Compatible Code
       |
       v
    Backfill
       |
       v
    Validate
       |
       v
    Contract

Destructive changes must not be coupled to a single irreversible deployment.

## 4.22 Rollback

Application rollback must be possible independently from database rollback
where practical.

    Release N
       |
       v
    Release N+1
       |
       +---- failure
       |
       v
    Roll Back Application

Database migrations must be designed so rollback of application code remains
safe.

## 4.23 Incident Response

Deliver:

- incident severity model;
- escalation;
- incident commander role;
- communication;
- containment;
- recovery;
- evidence preservation;
- postmortem;
- corrective action tracking.

## 4.24 Vulnerability Management

Pipeline:

    Dependency
       |
       v
    Scan
       |
       v
    Severity
       |
       v
    Triage
       |
       v
    Remediate
       |
       v
    Verify
       |
       v
    Close

Critical vulnerabilities affecting production must have explicit release
blocking policy.

---

# 9 Risks

## 9.1 R-BM07-001 — Security Misconfiguration

**Risk:** Production infrastructure is deployed with insecure defaults.

**Impact:** Critical.

**Mitigation:**

- hardened baseline;
- infrastructure review;
- security scan;
- least privilege;
- production checklist.

## 9.2 R-BM07-002 — Tenant Data Leakage

**Risk:** Incorrect query or authorization exposes another organization's data.

**Impact:** Critical.

**Mitigation:**

- tenant-scoped repositories;
- application authorization;
- database constraints/RLS where appropriate;
- automated isolation tests;
- security review.

## 9.3 R-BM07-003 — Database Saturation

**Risk:** Application scaling exhausts PostgreSQL connections.

**Impact:** High.

**Mitigation:**

- connection budget;
- bounded pools;
- queue workers;
- query optimization;
- load testing.

## 9.4 R-BM07-004 — Queue Backlog

**Risk:** Asynchronous workloads grow faster than workers process them.

**Impact:** High.

**Mitigation:**

- queue metrics;
- autoscaling;
- worker concurrency;
- backlog alerts;
- priority policy.

## 9.5 R-BM07-005 — Observability Blind Spot

**Risk:** Production failure cannot be diagnosed.

**Impact:** High.

**Mitigation:**

- structured logs;
- metrics;
- traces;
- correlation;
- dashboards;
- runbooks.

## 9.6 R-BM07-006 — Backup Failure

**Risk:** Backups exist nominally but cannot be restored.

**Impact:** Critical.

**Mitigation:**

- restore drills;
- automated backup verification;
- PITR tests;
- evidence retention.

## 9.7 R-BM07-007 — RPO/RTO Miss

**Risk:** Recovery takes longer than required or loses excessive data.

**Impact:** Critical.

**Mitigation:**

- measure actual values;
- capacity planning;
- recovery automation;
- periodic DR drills.

## 9.8 R-BM07-008 — Migration Failure

**Risk:** Production migration causes outage or data corruption.

**Impact:** Critical.

**Mitigation:**

- expand-contract;
- staging qualification;
- backup;
- migration testing;
- rollback/forward plan.

## 9.9 R-BM07-009 — Supply-Chain Compromise

**Risk:** Vulnerable or malicious dependency enters production.

**Impact:** Critical.

**Mitigation:**

- dependency scanning;
- SBOM;
- provenance;
- lockfiles;
- signed builds;
- review.

## 9.10 R-BM07-010 — Key Compromise

**Risk:** Production signing or encryption key is compromised.

**Impact:** Critical.

**Mitigation:**

- KMS/HSM;
- non-exportable keys where practical;
- key separation;
- rotation;
- revocation;
- incident procedure.

## 9.11 R-BM07-011 — Cloud Failure Affects Robot Safety

**Risk:** Cloud outage causes unsafe robot behavior.

**Impact:** Critical.

**Mitigation:**

- local Lab Agent;
- local runtime;
- local safety;
- no unsafe automatic restart;
- explicit physical safety review.

## 9.12 R-BM07-012 — Noisy Neighbour

**Risk:** One organization consumes disproportionate shared capacity.

**Impact:** High.

**Mitigation:**

- quotas;
- rate limits;
- queue isolation;
- concurrency limits;
- monitoring.

## 9.13 R-BM07-013 — Media/Telemetry Cost Explosion

**Risk:** High-volume data causes uncontrolled storage cost.

**Impact:** High.

**Mitigation:**

- quotas;
- retention;
- lifecycle policies;
- usage dashboards;
- alerts.

## 9.14 R-BM07-014 — WebSocket Reconnect Storm

**Risk:** Infrastructure restart creates massive simultaneous reconnect traffic.

**Impact:** High.

**Mitigation:**

- exponential backoff;
- jitter;
- connection limits;
- admission control;
- load testing.

## 9.15 R-BM07-015 — Incident Response Delay

**Risk:** Operators cannot identify ownership or recovery procedure.

**Impact:** High.

**Mitigation:**

- runbooks;
- on-call ownership;
- severity model;
- incident drills.

## 9.16 R-BM07-016 — Compliance Overclaim

**Risk:** Product claims certification without evidence.

**Impact:** High.

**Mitigation:**

- control mapping;
- evidence-based statements;
- legal/compliance review.

---

# 10 Exit Criteria

## 10.1 Security Exit

- [ ] Production security review completed.
- [ ] Tenant isolation verified.
- [ ] Authentication hardened.
- [ ] Authorization hardened.
- [ ] Secret management operational.
- [ ] Key management operational.
- [ ] Security scanning operational.
- [ ] Critical findings resolved or formally accepted.
- [ ] Security incident runbook tested.

## 10.2 Availability Exit

- [ ] Multi-instance API deployment works.
- [ ] Load balancer health checks work.
- [ ] Database HA works.
- [ ] Queue resilience works.
- [ ] Worker recovery works.
- [ ] WebSocket reconnect works.
- [ ] Object storage resilience validated.
- [ ] No critical single-instance dependency remains.

## 10.3 Performance Exit

- [ ] API performance targets measured.
- [ ] Booking contention tested.
- [ ] Credit concurrency tested.
- [ ] Execution load tested.
- [ ] Result/telemetry load tested.
- [ ] WebSocket load tested.
- [ ] Soak test completed.
- [ ] Capacity model documented.

## 10.4 Disaster Recovery Exit

- [ ] Backup configured.
- [ ] PITR configured.
- [ ] Restore tested.
- [ ] RPO measured.
- [ ] RTO measured.
- [ ] Object-storage recovery tested.
- [ ] Infrastructure recreation tested.
- [ ] DR runbook approved.
- [ ] DR evidence retained.

## 10.5 Observability Exit

- [ ] Structured logging operational.
- [ ] Metrics operational.
- [ ] Tracing operational.
- [ ] Dashboards operational.
- [ ] Alerts operational.
- [ ] Critical alert runbooks exist.
- [ ] Correlation works across API/Job/Run/Lab Agent.
- [ ] Audit logging is operational.

## 10.6 Release Exit

- [ ] CI gates active.
- [ ] Security gates active.
- [ ] SBOM generated.
- [ ] Build provenance recorded.
- [ ] Migration qualification passed.
- [ ] Staging qualification passed.
- [ ] Deployment automation passed.
- [ ] Rollback tested.
- [ ] Release evidence generated.
- [ ] Production smoke tests passed.

## 10.7 Compliance Exit

- [ ] Data classification completed.
- [ ] Retention policies documented.
- [ ] Audit retention verified.
- [ ] Access-control evidence available.
- [ ] Backup evidence available.
- [ ] Change-control evidence available.
- [ ] Vulnerability evidence available.
- [ ] Incident evidence process exists.
- [ ] Compliance mapping reviewed.

## 10.8 Operational Exit

- [ ] On-call ownership assigned.
- [ ] Incident response tested.
- [ ] Backup restore tested.
- [ ] Scaling procedure tested.
- [ ] Rollback procedure tested.
- [ ] Production deployment rehearsal completed.
- [ ] Monitoring ownership assigned.
- [ ] Cost monitoring enabled.
- [ ] Capacity review completed.

## 10.9 Physical Lab Exit

- [ ] Lab Agent production identity works.
- [ ] Secure connectivity works.
- [ ] Cloud disconnect behavior is understood.
- [ ] Local safety authority is verified.
- [ ] Physical safety review is complete.
- [ ] No unsafe automatic restart path exists.
- [ ] Production physical deployment approval is separate from cloud
  production approval.

## 10.10 Formal Milestone Status

B-M07 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    HARDENING
       |
       v
    QUALIFICATION
       |
       v
    PRODUCTION_READINESS_REVIEW
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

B-M07 cannot be marked COMPLETE solely because all implementation tasks are
merged.

Completion requires:

- implementation evidence;
- security evidence;
- performance evidence;
- availability evidence;
- DR evidence;
- release evidence;
- operational readiness;
- physical safety boundary review.

---
