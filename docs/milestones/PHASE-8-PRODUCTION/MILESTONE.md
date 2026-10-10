# PHASE-8-PRODUCTION — Production Hardening, Scale and Launch Readiness

## 1 Objective

### 1.1 Milestone purpose

PHASE-8-PRODUCTION is the final engineering and launch-readiness milestone for the first production release of Kritva RaaS.

The milestone converts the integrated system established through Phases 0–7 into a production-operated service capable of:

- securely serving real users;
- protecting customer source code and artifacts;
- enforcing organization and project isolation;
- operating physical robotic resources safely;
- processing bookings and credits reliably;
- executing signed artifacts;
- serving live video and telemetry;
- storing and serving results;
- surviving expected infrastructure failures;
- scaling within defined capacity limits;
- supporting operational monitoring;
- recovering from incidents;
- releasing software through controlled change management;
- supporting customer-facing production operations.

The milestone is not a new feature-development phase.

It is the transition from:

    Integrated System
          |
          v
    Production Candidate
          |
          v
    Security / Reliability / Scale Qualification
          |
          v
    Controlled Launch
          |
          v
    Production Operation

### 1.2 Primary objective

The primary objective is to establish evidence that Kritva RaaS is safe, secure, reliable, observable, recoverable and operationally supportable for controlled production use.

### 1.3 Production architecture

The target production architecture is:

    Users
      |
      v
    DNS / Edge / TLS
      |
      v
    Load Balancer / API Gateway
      |
      +---------------------------+
      |                           |
      v                           v
    API / Control Plane       WebSocket / Live
      |                           |
      +-------------+-------------+
                    |
          +---------+---------+
          |                   |
          v                   v
    PostgreSQL            Object Storage
          |
          +-------------------+
          |                   |
          v                   v
        Queue             Workers
                              |
                              v
                         Lab Protocol
                              |
                              v
                          Lab Agent
                              |
                              v
                       Kritva Runtime
                              |
                              v
                         Robot / Lab

Supporting services:

    Identity
    Authorization
    Secrets
    KMS / HSM
    Audit
    Observability
    Media / WebRTC
    Billing / Payment Adapter
    Backup / Recovery
    CI/CD
    Artifact Signing

### 1.4 Production principles

P8 PRODUCTION shall preserve the following principles:

1. PostgreSQL is authoritative for structured business state.
2. Object storage is authoritative for large binary payloads.
3. Queue delivery is not business truth.
4. Durable Job and Run state is authoritative.
5. Organization is the primary tenant boundary.
6. Source code remains local to the developer machine during normal RaaS workflows.
7. Only approved artifacts cross the remote execution boundary.
8. Artifact signatures and integrity are independently validated.
9. Physical safety remains local to the lab and robot.
10. Cloud infrastructure cannot override physical safety.
11. Financial state is strongly consistent.
12. Booking allocation is strongly consistent.
13. Critical asynchronous operations are idempotent.
14. Production changes are controlled and auditable.
15. Recovery is tested, not merely documented.

### 1.5 Production-readiness dimensions

P8 PRODUCTION evaluates:

| Dimension | Production requirement |
|---|---|
| Security | Threats controlled and security gates passed |
| Privacy | Source and customer data protected |
| Reliability | Expected failures handled |
| Availability | Defined SLOs met |
| Scalability | Capacity targets demonstrated |
| Performance | Defined latency targets met |
| Safety | Physical safety authority remains local |
| Financial integrity | Credits, bookings and payments reconcile |
| Data integrity | Durable state remains consistent |
| Observability | Failures are detectable |
| Recovery | Backup and restore are proven |
| Operations | Runbooks and ownership exist |
| Release | Rollout and rollback are proven |
| Support | Production incidents can be handled |
| Compliance | Applicable obligations are addressed |

### 1.6 Goals

P8 PRODUCTION goals are:

1. production environment qualification;
2. production security hardening;
3. tenant isolation qualification;
4. identity and authorization hardening;
5. artifact security qualification;
6. source-code privacy verification;
7. database performance qualification;
8. database backup and recovery verification;
9. object-storage protection;
10. queue reliability;
11. worker resilience;
12. WebSocket scalability;
13. WebRTC/media scalability;
14. Lab Agent fleet reliability;
15. API performance qualification;
16. load and stress testing;
17. disaster-recovery testing;
18. incident-response readiness;
19. monitoring and alerting;
20. audit readiness;
21. CI/CD production qualification;
22. migration safety;
23. release rollback;
24. production support readiness;
25. controlled customer launch.

### 1.7 Non-goals

This milestone does not attempt to:

- implement unrestricted global multi-region active-active operation;
- introduce premature microservices;
- redesign the product architecture;
- add major customer features;
- replace local robot safety systems;
- certify hardware safety independently of the applicable robot/lab process;
- guarantee zero downtime;
- guarantee unlimited scale;
- remove operational controls for convenience.

### 1.8 Production launch principle

The launch shall follow:

    Internal Qualification
            |
            v
    Internal Production
            |
            v
    Canary
            |
            v
    Pilot Customers
            |
            v
    Limited GA
            |
            v
    Full GA

Progression requires evidence.

No launch stage is entered solely because implementation is complete.

### 1.9 Availability principle

The initial production architecture shall use:

- one primary cloud region;
- multi-zone deployment where practical;
- managed PostgreSQL HA where available;
- redundant application instances;
- scalable workers;
- durable queue;
- private database;
- private object storage;
- secure lab connectivity.

Active-active multi-region is not an initial launch requirement.

### 1.10 Recovery targets

Initial production targets are:

    Database RPO <= 15 minutes
    Platform RTO <= 4 hours

These are launch targets, not guarantees that every individual robot execution can be recovered transparently.

Physical robot state remains locally authoritative.

### 1.11 Safety principle

A cloud failure must not become a physical robot safety failure.

If the cloud becomes unavailable:

- the robot does not depend on cloud connectivity for safety;
- the Lab Agent follows local policy;
- Runtime follows local execution policy;
- safety controller remains authoritative;
- physical E-stop remains local;
- no unsafe automatic restart occurs.

### 1.12 Success definition

P8 PRODUCTION succeeds when:

    Customer
       |
       v
    Authenticate
       |
       v
    Create Project
       |
       v
    Build Locally
       |
       v
    Generate Signed .krv
       |
       v
    Select Robot
       |
       v
    Book Resource
       |
       v
    Execute
       |
       +--> Video
       +--> Telemetry
       +--> Logs
       |
       v
    Result
       |
       v
    Rerun

operates in production with defined security, reliability, observability, recovery and operational controls.

---

## 2 Scope and non-scope

### 2.1 Production infrastructure

Production shall include:

- DNS;
- TLS;
- edge protection;
- load balancing;
- API compute;
- WebSocket infrastructure;
- worker compute;
- PostgreSQL;
- object storage;
- queue;
- secrets;
- KMS/HSM-equivalent;
- audit logging;
- monitoring;
- alerting;
- backup;
- recovery;
- CI/CD.

### 2.2 Environment isolation

Production shall be isolated from:

- local development;
- shared development;
- staging;
- test labs.

Production credentials shall not be reused in lower environments.

Production data shall not be copied into lower environments unless explicitly approved and appropriately sanitized.

### 2.3 Application deployment

Control Plane deployment shall be:

- stateless where practical;
- horizontally scalable;
- health checked;
- versioned;
- rollback capable.

No application instance shall depend on local persistent business state.

### 2.4 Database

PostgreSQL remains the authoritative store for:

- identity metadata;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- Jobs;
- Runs;
- Results;
- experiments;
- audit;
- idempotency;
- reconciliation.

### 2.5 Database high availability

The production database shall support:

- managed HA where available;
- automated backups;
- point-in-time recovery;
- controlled failover;
- connection management;
- monitoring;
- restore verification.

### 2.6 Database performance

Performance work shall prioritize:

1. query correctness;
2. indexes;
3. query plans;
4. connection management;
5. transaction scope;
6. lock contention;
7. application caching where appropriate;
8. vertical scaling;
9. read replicas where justified;
10. partitioning where measured need exists.

Partitioning shall not be introduced merely for theoretical scale.

### 2.7 Partitioning

Candidate high-volume tables include:

- execution events;
- telemetry metadata;
- audit records;
- log metadata;
- result metrics where justified;
- other measured high-growth tables.

Partitioning strategy shall be:

- time-based where appropriate;
- operationally maintainable;
- compatible with retention;
- tested under production-like load.

### 2.8 Object storage

Object storage shall hold:

- `.krv` artifacts;
- result files;
- video recordings;
- telemetry datasets;
- logs where applicable;
- reports;
- generated downloads.

Object storage shall be:

- private by default;
- encrypted;
- tenant scoped through authorization;
- lifecycle managed;
- checksum verified;
- reconciled against PostgreSQL metadata.

### 2.9 Queue

The production queue shall provide:

- durable delivery;
- acknowledgement;
- retry;
- dead-letter handling;
- visibility timeout or equivalent;
- monitoring;
- backlog alerts.

The queue shall never become the only record of a business operation.

### 2.10 Worker architecture

Workers shall support:

- idempotent processing;
- bounded concurrency;
- graceful shutdown;
- heartbeat;
- retry policy;
- dead-letter handling;
- metrics;
- structured logs;
- job correlation.

### 2.11 API

The production API shall provide:

- authentication;
- authorization;
- tenant enforcement;
- validation;
- rate limiting;
- request IDs;
- correlation IDs;
- structured errors;
- idempotency where required;
- health endpoints;
- versioning.

### 2.12 WebSocket

Production WebSocket infrastructure shall support:

- authenticated connections;
- authorization;
- tenant scoping;
- connection limits;
- heartbeat;
- reconnect;
- event deduplication;
- sequence handling;
- horizontal scaling.

### 2.13 WebRTC

Production live video shall support:

- authorized sessions;
- time-limited credentials;
- appropriate media relay;
- TURN where required;
- session monitoring;
- connection limits;
- quality metrics;
- recording policy.

### 2.14 Lab connectivity

Lab connectivity shall use:

- authenticated Lab Agents;
- secure channels;
- unique identities;
- certificate rotation;
- revocation;
- network segmentation;
- explicit authorization.

### 2.15 Security hardening

Security hardening includes:

- MFA;
- strong authentication;
- secure session management;
- RBAC + ABAC;
- tenant isolation;
- rate limiting;
- secrets management;
- key management;
- artifact signing;
- vulnerability scanning;
- dependency management;
- SBOM;
- security headers;
- secure cookies;
- encryption;
- audit logging.

### 2.16 Source-code privacy

The production system shall preserve:

> Customer source code does not leave the developer machine as part of the normal RaaS build and execution workflow.

Production qualification shall test:

- network egress;
- package contents;
- logs;
- telemetry;
- object storage;
- API payloads;
- crash reports;
- diagnostics.

### 2.17 Artifact security

Production artifacts shall be:

- signed;
- integrity checked;
- versioned;
- traceable;
- revocable;
- compatible with platform/runtime;
- validated by Lab Agent.

Production signing keys shall not be distributed to ordinary build workers.

### 2.18 Tenant isolation

Tenant isolation shall exist at:

- API;
- application;
- repository;
- database;
- object storage;
- WebSocket;
- WebRTC;
- queue;
- Lab Agent;
- results;
- audit.

### 2.19 Financial integrity

Production financial state shall enforce:

- balanced ledger;
- atomic wallet updates;
- idempotent reservations;
- idempotent payment callbacks;
- immutable ledger entries;
- historical rate preservation;
- reconciliation.

### 2.20 Booking integrity

Production booking shall enforce:

- no active resource overlap;
- authorization;
- platform compatibility;
- resource eligibility;
- credit reservation;
- cancellation policy;
- allocation reconciliation.

### 2.21 Physical safety

Production launch shall not change the P6 LAB & ROBOT safety model.

    Cloud
      |
      | request
      v
    Lab Agent
      |
      | local policy
      v
    Kritva Runtime
      |
      | application request
      v
    Safety / Robot

The local safety system remains authoritative.

### 2.22 Incident management

Production shall define:

- severity;
- ownership;
- escalation;
- incident commander;
- communication;
- containment;
- recovery;
- evidence preservation;
- post-incident review.

### 2.23 Change management

Production changes shall require:

- change record;
- impact assessment;
- approval;
- deployment plan;
- rollback plan;
- validation;
- audit trail.

### 2.24 Non-scope

The following remain future work unless explicitly approved:

- active-active multi-region;
- global robot fleet federation;
- unrestricted third-party marketplace;
- arbitrary customer containers on production infrastructure;
- autonomous cloud safety;
- unrestricted remote shell access.

---

## 3 Dependencies

### 3.1 Product dependencies

Requires completed or accepted:

- P0 FOUNDATION Foundation;
- P1 STUDIO Studio;
- P2 BUILD & ARTIFACT Build & Artifact;
- P3 CONTROL PLANE Control Plane;
- P4 BOOKING & COMMERCIAL Booking & Commercial;
- P5 EXECUTION Execution;
- P6 LAB & ROBOT Lab & Robot;
- P7 LIVE & RESULTS Live & Results.

### 3.2 Cloud dependencies

Requires:

- C-M01 Foundation;
- C-M02 Development;
- C-M03 Staging;
- C-M04 Production.

### 3.3 Database dependencies

Requires:

- DB-M01 Foundation;
- DB-M02 Core Data;
- DB-M03 Booking Data;
- execution data;
- results data;
- production database hardening.

### 3.4 Security dependencies

Requires:

- authentication;
- authorization;
- tenant isolation;
- source privacy;
- artifact security;
- secrets management;
- key management;
- threat model;
- security requirements;
- audit logging.

### 3.5 Operations dependencies

Requires:

- monitoring;
- alerting;
- dashboards;
- incident response;
- runbooks;
- on-call ownership;
- backup/restore procedures;
- release process.

### 3.6 Commercial dependencies

Requires:

- credit plans;
- rate cards;
- wallet;
- booking;
- payment abstraction;
- reconciliation;
- refund policy.

### 3.7 Safety dependencies

Requires:

- approved physical lab;
- approved robot;
- safety procedure;
- E-stop;
- interlocks;
- local operator procedure;
- human safety approval.

---

## 4 Deliverables

### 4.1 Production infrastructure

Deliver:

- production network;
- production compute;
- production PostgreSQL;
- object storage;
- queue;
- secrets;
- KMS/HSM-equivalent;
- DNS/TLS;
- observability;
- backups.

### 4.2 Production deployment

Deliver:

- repeatable deployment;
- versioned images/artifacts;
- CI/CD;
- migration execution;
- rollback;
- health checks;
- deployment verification.

### 4.3 Security qualification

Deliver:

- security test report;
- dependency scan;
- SBOM;
- secret scan;
- vulnerability report;
- penetration-test or equivalent assessment;
- tenant isolation evidence;
- artifact-security evidence.

### 4.4 Reliability qualification

Deliver:

- failure-injection results;
- worker recovery evidence;
- database failover evidence;
- queue recovery evidence;
- WebSocket recovery evidence;
- media recovery evidence;
- Lab Agent reconnect evidence.

### 4.5 Performance qualification

Deliver:

- API benchmark;
- database benchmark;
- queue throughput;
- worker throughput;
- WebSocket concurrency;
- WebRTC concurrency;
- telemetry throughput;
- result processing throughput.

### 4.6 Disaster recovery

Deliver:

- backup verification;
- restore verification;
- PITR verification;
- database recovery;
- object-storage recovery;
- infrastructure recreation;
- RTO/RPO evidence.

### 4.7 Operational readiness

Deliver:

- runbooks;
- dashboards;
- alerts;
- on-call procedures;
- incident templates;
- escalation matrix;
- support procedures.

### 4.8 Production release

Deliver:

- release candidate;
- production qualification report;
- launch checklist;
- rollout plan;
- rollback plan;
- customer communication;
- support readiness.

### 4.9 Launch stages

Deliver evidence for:

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

---

## 9 Risks

### 9.1 Security vulnerability

Risk:
A production vulnerability compromises customer data or execution.

Mitigation:

- security testing;
- dependency scanning;
- penetration testing;
- least privilege;
- rapid patch process.

### 9.2 Tenant isolation failure

Risk:
Customer data crosses organization boundaries.

Mitigation:

- defense-in-depth;
- repository filtering;
- DB controls;
- object-storage policy;
- automated cross-tenant tests.

### 9.3 Source-code leakage

Risk:
Customer source reaches cloud unintentionally.

Mitigation:

- source-local architecture;
- package scanning;
- network egress testing;
- telemetry/log review;
- privacy tests.

### 9.4 Signing-key compromise

Risk:
Attacker signs malicious artifacts.

Mitigation:

- KMS/HSM;
- restricted signing service;
- separation of duties;
- key rotation;
- revocation;
- signing audit.

### 9.5 Database failure

Risk:
Authoritative business state becomes unavailable.

Mitigation:

- HA;
- backups;
- PITR;
- restore drills;
- connection management.

### 9.6 Data corruption

Risk:
Incorrect financial or booking state.

Mitigation:

- constraints;
- transactions;
- idempotency;
- reconciliation;
- immutable ledger.

### 9.7 Database scaling

Risk:
Database becomes production bottleneck.

Mitigation:

- query optimization;
- indexes;
- pooling;
- measured partitioning;
- capacity planning.

### 9.8 Queue backlog

Risk:
Async work accumulates faster than workers process it.

Mitigation:

- backlog alerts;
- autoscaling;
- bounded retries;
- dead-letter queues;
- capacity testing.

### 9.9 WebSocket overload

Risk:
Large connection volume affects API reliability.

Mitigation:

- dedicated infrastructure;
- connection limits;
- horizontal scaling;
- backpressure;
- event scoping.

### 9.10 Video overload

Risk:
Media traffic exceeds lab/cloud/network capacity.

Mitigation:

- bandwidth controls;
- adaptive bitrate;
- session limits;
- media capacity planning.

### 9.11 Telemetry growth

Risk:
Telemetry creates uncontrolled storage and processing costs.

Mitigation:

- rate limits;
- retention;
- downsampling;
- object storage;
- quotas.

### 9.12 Operational complexity

Risk:
System becomes difficult to operate.

Mitigation:

- runbooks;
- dashboards;
- automation;
- clear ownership;
- limited service boundaries.

### 9.13 Premature microservices

Risk:
Operational complexity grows without corresponding benefit.

Mitigation:

- retain modular monolith;
- extract domains only when measured need exists.

### 9.14 Deployment failure

Risk:
New release causes production outage.

Mitigation:

- canary;
- health checks;
- rollback;
- feature flags;
- automated smoke tests.

### 9.15 Migration failure

Risk:
Database migration causes outage or corruption.

Mitigation:

- expand-contract;
- staging rehearsal;
- lock analysis;
- backup;
- rollback/forward procedure.

### 9.16 Cloud outage

Risk:
Cloud infrastructure becomes unavailable.

Mitigation:

- HA;
- retry;
- local lab autonomy;
- documented degraded mode;
- DR procedure.

### 9.17 Lab outage

Risk:
Physical lab becomes unavailable.

Mitigation:

- resource state;
- maintenance status;
- booking reconciliation;
- customer communication;
- credit/refund policy.

### 9.18 Physical safety failure

Risk:
Production operations create physical hazard.

Mitigation:

- local safety authority;
- E-stop;
- interlocks;
- operator procedures;
- safety review;
- no cloud safety override.

### 9.19 Financial loss

Risk:
Credits or payments are incorrectly charged.

Mitigation:

- strong consistency;
- idempotency;
- immutable ledger;
- reconciliation;
- payment callback deduplication.

### 9.20 Support overload

Risk:
Production launch creates more support demand than expected.

Mitigation:

- pilot;
- staged launch;
- support runbooks;
- usage limits;
- clear escalation.

### 9.21 Capacity underestimation

Risk:
Actual customer workload exceeds initial capacity.

Mitigation:

- load testing;
- capacity thresholds;
- autoscaling;
- launch quotas;
- measured expansion.

### 9.22 Observability blind spots

Risk:
Production failure occurs without actionable alerts.

Mitigation:

- SLOs;
- dashboards;
- synthetic checks;
- alert testing;
- incident drills.

### 9.23 Recovery failure

Risk:
Backup exists but cannot restore service.

Mitigation:

> Restore drills are mandatory evidence, not optional documentation.

### 9.24 Launch pressure

Risk:
Schedule pressure causes unresolved critical issues to be accepted.

Mitigation:

- explicit go/no-go authority;
- mandatory blockers;
- risk acceptance process;
- evidence-based release criteria.

---

## 10 Exit criteria

### 10.1 Production infrastructure

- [ ] Production infrastructure is deployed.
- [ ] Infrastructure is reproducible.
- [ ] Environment isolation is verified.
- [ ] Network security is verified.
- [ ] TLS is verified.
- [ ] IAM is verified.
- [ ] Secrets are verified.
- [ ] KMS/key management is verified.

### 10.2 Security

- [ ] Authentication qualification passes.
- [ ] Authorization qualification passes.
- [ ] Tenant isolation passes.
- [ ] Source privacy passes.
- [ ] Artifact security passes.
- [ ] Vulnerability assessment passes.
- [ ] Dependency review passes.
- [ ] SBOM exists.
- [ ] Security assessment is accepted.

### 10.3 Database

- [ ] HA is operational.
- [ ] Indexes are reviewed.
- [ ] Queries are tuned.
- [ ] Connections are bounded.
- [ ] Partitioning decision is evidence-based.
- [ ] Backups operate.
- [ ] PITR operates where supported.
- [ ] Restore drill passes.
- [ ] RPO <=15m is demonstrated or formally accepted.
- [ ] RTO <=4h is demonstrated or formally accepted.

### 10.4 Data integrity

- [ ] Booking reconciliation passes.
- [ ] Credit reconciliation passes.
- [ ] Job reconciliation passes.
- [ ] Run reconciliation passes.
- [ ] Result reconciliation passes.
- [ ] Object-storage reconciliation passes.
- [ ] Audit integrity checks pass.

### 10.5 Performance

- [ ] API targets pass.
- [ ] Booking targets pass.
- [ ] Credit targets pass.
- [ ] Result targets pass.
- [ ] Health targets pass.
- [ ] WebSocket capacity passes.
- [ ] WebRTC capacity passes.
- [ ] Telemetry capacity passes.
- [ ] Worker capacity passes.
- [ ] Database capacity passes.

### 10.6 Reliability

- [ ] API restart recovery passes.
- [ ] Worker recovery passes.
- [ ] Queue recovery passes.
- [ ] Database failover passes.
- [ ] Object-storage failure handling passes.
- [ ] WebSocket recovery passes.
- [ ] WebRTC recovery passes.
- [ ] Lab Agent reconnect passes.
- [ ] Result worker recovery passes.

### 10.7 Disaster recovery

- [ ] Backup verification passes.
- [ ] Restore verification passes.
- [ ] PITR verification passes.
- [ ] Infrastructure recovery passes.
- [ ] Recovery runbooks are approved.
- [ ] DR evidence is retained.

### 10.8 Operations

- [ ] Monitoring exists.
- [ ] Dashboards exist.
- [ ] Alerts exist.
- [ ] On-call exists.
- [ ] Runbooks exist.
- [ ] Incident response exists.
- [ ] Escalation exists.
- [ ] Support process exists.

### 10.9 Release

- [ ] Release candidate exists.
- [ ] Release notes exist.
- [ ] Migration plan exists.
- [ ] Rollback exists.
- [ ] Canary procedure exists.
- [ ] Pilot procedure exists.
- [ ] Go/no-go checklist is complete.
- [ ] Production tag is created only after acceptance.

### 10.10 Safety

- [ ] Physical safety architecture remains unchanged.
- [ ] E-stop is verified.
- [ ] Interlocks are verified.
- [ ] Local safety authority is verified.
- [ ] Cloud cannot bypass safety.
- [ ] Lab Agent safety behavior is verified.
- [ ] Disconnect behavior is verified.
- [ ] Physical operator procedure is approved.
- [ ] Human safety gate is closed.

### 10.11 Commercial

- [ ] Credit plans are configured.
- [ ] Platform-specific credit types are configured.
- [ ] Rate cards are configured.
- [ ] Booking is operational.
- [ ] Payment integration is operational where applicable.
- [ ] Refund policy is operational.
- [ ] Financial reconciliation is operational.
- [ ] Customer invoices/financial records are auditable.

### 10.12 Launch readiness

Launch stages shall be:

    Internal Production
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

Each stage requires:

- [ ] no open critical security issue;
- [ ] no open critical safety issue;
- [ ] no unresolved financial-integrity issue;
- [ ] monitoring operational;
- [ ] rollback available;
- [ ] support available;
- [ ] owner approval.

### 10.13 Phase mapping

| Phase | P8 PRODUCTION contribution |
|---|---|
| P0 FOUNDATION | Engineering process, contracts, CI, repository and quality baseline |
| P1 STUDIO | Production desktop client |
| P2 BUILD & ARTIFACT | Secure local build and signed `.krv` artifacts |
| P3 CONTROL PLANE | Production identity, projects, platforms and artifacts |
| P4 BOOKING & COMMERCIAL | Production resources, booking, credits and commercial operations |
| P5 EXECUTION | Production Job/Run orchestration |
| P6 LAB & ROBOT | Qualified Lab Agent and physical robot execution |
| P7 LIVE & RESULTS | Production live operations and results experience |
| P8 PRODUCTION | Primary milestone; production hardening, scale and launch |

### 10.14 Cross-domain final path

The final production path shall be demonstrable:

    Customer
       |
       v
    Studio
       |
       v
    Authentication
       |
       v
    Organization / Project
       |
       v
    Local Build
       |
       v
    Signed .krv
       |
       v
    Control Plane
       |
       +--> Artifact Validation
       +--> Authorization
       |
       v
    Platform
       |
       v
    Booking
       |
       v
    Credit Reservation
       |
       v
    Job
       |
       v
    Lab Agent
       |
       v
    Runtime
       |
       v
    Robot
       |
       +--> Video
       +--> Telemetry
       +--> Logs
       |
       v
    Run
       |
       v
    Result
       |
       +--> Metrics
       +--> Files
       +--> Experiment
       +--> Comparison
       +--> Download
       +--> Rerun

### 10.15 Production evidence package

The final evidence package shall include:

- architecture baseline;
- infrastructure inventory;
- security assessment;
- tenant isolation report;
- source privacy report;
- artifact security report;
- SBOM;
- vulnerability report;
- performance report;
- load test report;
- failure-injection report;
- backup/restore report;
- DR report;
- database qualification;
- financial reconciliation report;
- booking reconciliation report;
- physical safety report;
- observability report;
- incident-response drill;
- rollback report;
- canary report;
- pilot report;
- support readiness report;
- final go/no-go decision.

### 10.16 Mandatory launch blockers

The following are absolute launch blockers unless explicitly resolved through an authorized risk-acceptance process where such acceptance is permitted:

- [ ] critical security vulnerability;
- [ ] tenant-isolation failure;
- [ ] source-code privacy failure;
- [ ] artifact-signing compromise;
- [ ] financial ledger inconsistency;
- [ ] active booking double allocation;
- [ ] inability to recover authoritative database state;
- [ ] inability to perform required rollback;
- [ ] unresolved critical physical safety issue;
- [ ] cloud architecture capable of bypassing local robot safety;
- [ ] missing production monitoring for critical services;
- [ ] unknown ownership for critical incidents.

### 10.17 Open questions

1. What is the initial production customer capacity?
2. What is the target number of concurrent Studio users?
3. What is the target number of concurrent Jobs?
4. What is the target number of concurrent physical robots?
5. What is the target number of concurrent video sessions?
6. What is the target telemetry rate?
7. What is the expected daily artifact volume?
8. What is the expected daily Result volume?
9. What is the expected monthly object-storage growth?
10. What is the final API SLO?
11. What is the final availability SLO?
12. What is the final WebRTC quality target?
13. What is the final WebSocket capacity target?
14. Which tables require partitioning at launch?
15. What partition maintenance automation is required?
16. Which read replicas, if any, are required?
17. When should the modular monolith be split?
18. What is the first scaling trigger for additional application instances?
19. What is the first scaling trigger for workers?
20. What is the first scaling trigger for database vertical scaling?
21. What is the first scaling trigger for read replicas?
22. What is the first scaling trigger for a second region?
23. What is the final DR topology?
24. What is the final backup retention period?
25. What is the final audit retention period?
26. What is the final Result retention policy?
27. What is the final video retention policy?
28. What is the final telemetry retention policy?
29. What are the customer support hours?
30. What is the production on-call model?
31. What is the target incident response time by severity?
32. What customer communication mechanism is final?
33. What payment provider is used for the first GA?
34. What taxation/invoicing requirements apply?
35. What compliance certifications are required?
36. What privacy obligations apply to recorded robot video?
37. What regions/countries are supported at launch?
38. What data residency requirements apply?
39. What is the production artifact signing ceremony?
40. What is the production key-recovery procedure?
41. What is the final break-glass procedure?
42. Which administrative actions require dual approval?
43. What is the final vulnerability remediation SLA?
44. What is the final release cadence?
45. What is the final canary duration?
46. What is the minimum pilot duration?
47. What metrics determine promotion from pilot to GA?
48. What customer usage quotas apply?
49. What robot resource quotas apply?
50. What conditions trigger automatic launch rollback?
51. What conditions trigger temporary booking suspension?
52. What conditions trigger a lab shutdown?
53. What conditions trigger credit/refund reconciliation?
54. What conditions require customer notification?
55. What is the first production expansion milestone after GA?

All unresolved questions that materially affect production architecture, security, financial integrity or physical safety shall be resolved through the established decision and change-management process before GA.

### 10.18 Final invariants

The following invariants are mandatory for production:

> Production is evidence-based, not implementation-based.

> Production credentials are isolated from lower environments.

> Organization is the primary tenant boundary.

> Authorization is enforced server-side.

> Database constraints remain authoritative for business invariants.

> PostgreSQL is authoritative for structured business state.

> Object storage is authoritative for large binary payloads.

> Queue state is not business truth.

> Job and Run state remain durable and authoritative.

> Financial ledger state is immutable and balanced.

> Booking allocations cannot overlap.

> Artifact signatures are independently verified.

> Customer source code remains outside the normal cloud execution path.

> Production signing keys are protected from ordinary build workers.

> Critical secrets are not stored in source control.

> Production changes are auditable.

> Database migrations are controlled.

> Backups are tested by restoration.

> RPO and RTO are measured.

> Monitoring and alerting are tested.

> Rollback is tested before production promotion.

> Live data is observational.

> Durable state is authoritative.

> Video is not a safety channel.

> Telemetry is not a safety authority.

> Safety UNKNOWN is not SAFE.

> Cloud failure does not become physical robot safety authority.

> Physical E-stop remains local.

> Physical robot restart after uncertain state is never automatic.

> Customer financial state is reconciled.

> Customer result data is tenant isolated.

> Production incidents have clear ownership.

> Critical launch blockers prevent promotion.

### 10.19 Final go/no-go statement

The Production Release Board shall authorize GA only when:

    Engineering Complete
           AND
    Security Accepted
           AND
    Tenant Isolation Accepted
           AND
    Privacy Accepted
           AND
    Financial Integrity Accepted
           AND
    Database Recovery Accepted
           AND
    Performance Accepted
           AND
    Observability Accepted
           AND
    Operational Readiness Accepted
           AND
    Physical Safety Accepted
           AND
    Rollback Accepted
           AND
    Pilot Accepted
           |
           v
        GO FOR GA

If any mandatory gate is not satisfied:

    NO-GO

The no-go decision shall not be treated as a project failure.

It is the intended safety and quality mechanism for production release.

### 10.20 Final P8 PRODUCTION acceptance statement

PHASE-8-PRODUCTION shall transition:

    NOT_STARTED
        |
        v
    IN_PROGRESS
        |
        v
    IMPLEMENTED
        |
        v
    REVIEW
        |
        v
    CI
        |
        v
    ACCEPTED
        |
        v
    INTEGRATED
        |
        v
    RELEASE_CANDIDATE
        |
        v
    CANARY
        |
        v
    PILOT
        |
        v
    LIMITED_GA
        |
        v
    GA

only after all mandatory production, security, reliability, scale, recovery, financial, operational and safety gates are satisfied.

The final acceptance statement is:

> Kritva RaaS is production ready when the complete Build Locally → Book Remotely → Run on Real Robots → Observe → Analyze → Rerun lifecycle operates securely and reliably for authorized customers, with strong tenant and source-code isolation, signed artifact execution, consistent booking and financial state, resilient cloud infrastructure, tested backup and disaster recovery, scalable live operations, comprehensive observability, controlled release and rollback, operational support readiness, and physical robot safety remaining authoritative at the local lab and robot boundary.

---
