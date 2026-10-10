# Kritva RaaS Production Monitoring

## 1. Document Control

| Item | Value |
|---|---|
| Document | Production Monitoring |
| Path | `docs/cloud/operations/MONITORING.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Scope | Cloud, Control Plane, Lab and Robot monitoring |
| Primary Environment | Production |
| Architecture | Modular Control Plane |
| Observability Model | Logs + Metrics + Traces + Events + Telemetry |
| Metrics Standard | OpenTelemetry-compatible |
| Primary State Authority | PostgreSQL |
| Realtime Transport | WebSocket |
| Large Data | Object Storage |
| Async Transport | Durable Queue |
| Physical Safety | Local to Lab/Robot |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the production monitoring architecture and operating
model for Kritva RaaS.

Monitoring must provide sufficient visibility to determine:

- whether the platform is available;
- whether customer requests are succeeding;
- whether asynchronous work is progressing;
- whether bookings are being honored;
- whether credits are correct;
- whether artifacts are available;
- whether Labs are connected;
- whether robotic resources are healthy;
- whether Jobs and Runs are executing correctly;
- whether results are being produced;
- whether security controls are functioning;
- whether capacity is approaching limits;
- whether incidents require human intervention.

Monitoring is an operational control, not merely a collection of graphs.

## 3. Scope

This document covers monitoring for:

- Internet-facing endpoints;
- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- PostgreSQL;
- object storage;
- queue;
- authentication;
- credits;
- bookings;
- Jobs;
- Runs;
- results;
- Lab Agents;
- labs;
- robotic resources;
- telemetry;
- video infrastructure where applicable;
- cloud infrastructure;
- security;
- backups;
- disaster recovery;
- capacity;
- cost;
- synthetic monitoring.

## 4. Non-Goals

This document does not define:

- detailed application implementation;
- robot firmware diagnostics;
- physical safety controller implementation;
- complete protocol schemas;
- complete incident-response policy;
- customer contractual SLA language;
- provider-specific monitoring configuration;
- final observability vendor selection.

## 5. Monitoring Principles

Monitoring follows these principles:

1. Monitor customer outcomes, not only infrastructure.
2. Monitor every critical production boundary.
3. PostgreSQL remains the durable-state authority.
4. WebSocket is monitored but is not state authority.
5. Queue health includes age and backlog, not only availability.
6. Lab health includes connectivity and capability.
7. Robot health remains distinguishable from cloud health.
8. Physical safety remains local.
9. Every alert must have an owner.
10. Every actionable alert should have a runbook.
11. Dashboards must support incident diagnosis.
12. Metrics must have controlled cardinality.
13. Sensitive data must not enter telemetry.
14. Monitoring must itself be monitored.
15. SLOs must be based on user-visible outcomes.
16. Synthetic checks must exercise critical paths.
17. Durable state must be reconciled against external state.
18. Alerts must avoid unnecessary noise.
19. Historical trends must support capacity planning.
20. Production monitoring must support audit and compliance.

# 6. Observability Model

Kritva RaaS uses five complementary observability signals:

    Logs
      |
    Metrics
      |
    Traces
      |
    Domain Events
      |
    Lab / Robot Telemetry
      |
      v
    Observability Platform
      |
      +--> Dashboards
      +--> Alerts
      +--> SLOs
      +--> Incident Response
      +--> Capacity Planning

No single signal is sufficient.

## 7. Logs

Logs describe discrete processing events.

Examples:

- authentication attempt;
- API request;
- artifact validation;
- booking transaction;
- Job transition;
- worker failure;
- Lab Agent connection;
- database error;
- deployment event.

Logs must be structured.

## 8. Metrics

Metrics describe measurable behavior over time.

Examples:

- request rate;
- error rate;
- latency;
- queue depth;
- Job duration;
- Run failure rate;
- database connections;
- Agent heartbeat age;
- resource utilization.

Metrics are the primary signal for alerting and SLOs.

## 9. Traces

Distributed traces connect operations across:

    Studio
      |
    API
      |
    Application Service
      |
    PostgreSQL / Queue / Storage
      |
    Worker
      |
    Lab Agent

Traces must carry:

- trace ID;
- span ID;
- parent span ID;
- request ID;
- operation ID where applicable.

## 10. Domain Events

Domain events describe durable business transitions.

Examples:

- `booking.confirmed`;
- `credit.consumed`;
- `job.running`;
- `run.completed`;
- `result.available`;
- `agent.offline`.

Events support operational correlation but do not replace metrics.

## 11. Robot Telemetry

Robot telemetry is specialized runtime information.

Examples:

- CPU;
- memory;
- temperature;
- battery;
- joint state;
- motor state;
- actuator state;
- encoder health;
- network state;
- sensor status.

High-frequency telemetry must not overload the normal API/event pipeline.

# 12. Monitoring Architecture

The logical production architecture is:

    Application / Infrastructure
              |
              v
    Local Instrumentation
              |
              v
    OpenTelemetry-Compatible Collection
              |
       +------+------+------+
       |      |      |      |
      Logs  Metrics Traces Events
       |      |      |      |
       +------+------+------+
              |
              v
       Observability Backend
              |
       +------+------+------+
       |      |      |      |
    Alerts Dashboards SLOs Analysis
              |
              v
       Operators / On-Call

Lab telemetry follows:

    Robot Runtime
         |
    Local Collector
         |
    Lab Agent
         |
    Secure Cloud Ingestion
         |
    Telemetry Processor
         |
    +----+---------+---------+
    |              |         |
 Realtime       Metrics    Archive
    |              |         |
 WebSocket      Monitor   Object Storage

# 13. Monitoring Domains

Monitoring is organized into:

| Domain | Primary Owner |
|---|---|
| Edge/API | Backend + SRE |
| WebSocket | Backend + SRE |
| Workers | Backend + SRE |
| Database | DBA/SRE |
| Queue | SRE |
| Object Storage | Cloud/SRE |
| Identity | Security + Backend |
| Booking | Backend |
| Credits | Backend + Finance Engineering |
| Jobs/Runs | Backend |
| Lab Agents | Lab Integration + SRE |
| Robots | Lab Operations |
| Telemetry | Lab Integration |
| Security | Security Engineering |
| Backups | SRE |
| DR | SRE |
| Cost | Cloud/SRE |
| Deployment | Release Engineering |

# 14. Ownership Model

Every monitored component must have:

- primary owner;
- secondary owner;
- escalation group;
- runbook;
- dashboard;
- alert policy.

Ownership must be represented in monitoring metadata.

Recommended metadata:

    service.name
    service.owner
    service.team
    environment
    region
    version
    deployment_id

# 15. Service Health Model

Every production service should expose:

- liveness;
- readiness;
- dependency health where appropriate;
- version;
- build/release identity.

Health must distinguish:

- process alive;
- service ready;
- dependency healthy;
- customer functionality healthy.

## 16. Liveness

Liveness answers:

> Is the process capable of continuing execution?

A liveness failure may trigger restart.

Liveness checks must not perform expensive dependency calls.

## 17. Readiness

Readiness answers:

> Can this instance safely receive production traffic?

Readiness may include:

- database connectivity;
- required configuration;
- critical dependency availability.

A service may be alive but not ready.

## 18. Dependency Health

Dependency health should be measured separately.

Example:

    API
     |
     +--> PostgreSQL HEALTHY
     +--> Queue DEGRADED
     +--> Storage HEALTHY

The API should not report itself healthy merely because its process exists.

# 19. API Monitoring

Monitor:

- request rate;
- success rate;
- error rate;
- latency;
- status codes;
- application error codes;
- request size;
- response size;
- saturation;
- authentication failures;
- rate limiting.

Primary dimensions:

- route;
- method;
- status class;
- error code;
- service;
- environment.

Avoid high-cardinality dimensions such as raw user ID by default.

## 20. API SLIs

Core API SLIs:

    Availability =
    successful eligible requests / total eligible requests

    Error Rate =
    failed eligible requests / total eligible requests

    Latency =
    distribution of successful eligible request duration

The exact SLI definition must exclude intentional client cancellations and
approved health-check traffic where appropriate.

# 21. API SLO Baseline

Initial target:

| SLI | SLO |
|---|---:|
| API Availability | 99.9% |
| API Success | 99.9% |
| Normal API P95 | <500 ms |

Final SLOs may be refined using production evidence.

# 22. WebSocket Monitoring

Monitor:

- connection count;
- connection rate;
- disconnect rate;
- authentication failures;
- reconnect rate;
- subscription failures;
- event delivery latency;
- event processing failures;
- replay requests;
- sequence gaps.

WebSocket health does not replace REST reconciliation.

## 23. WebSocket SLO

Initial target:

| SLI | SLO |
|---|---:|
| Control Plane WebSocket availability | 99.5% |

A disconnected WebSocket must not cause loss of durable Job or Run state.

# 24. Worker Monitoring

Monitor:

- queue consumption;
- processing rate;
- processing latency;
- retry count;
- dead-letter count;
- failure rate;
- concurrency;
- CPU;
- memory;
- active operations.

Worker metrics should be separated by logical worker class.

Examples:

- artifact worker;
- Job worker;
- result worker;
- notification worker;
- reconciliation worker.

# 25. Worker SLIs

Important worker SLIs include:

- successful processing ratio;
- message age;
- processing latency;
- retry ratio;
- dead-letter ratio.

Queue availability alone is insufficient.

# 26. Scheduler Monitoring

Monitor:

- scheduling cycles;
- allocation decisions;
- scheduling latency;
- allocation conflicts;
- failed locks;
- stale reservations;
- scheduler leadership;
- scheduler heartbeat.

Critical alert:

> Scheduler is running but not making progress.

## 27. Reconciliation Monitoring

Monitor:

- reconciliation cycles;
- records scanned;
- discrepancies detected;
- discrepancies resolved;
- unresolved discrepancies;
- processing age;
- retry count.

A growing unresolved discrepancy count is a production health signal.

# 28. PostgreSQL Monitoring

Monitor:

- availability;
- connections;
- connection saturation;
- CPU;
- memory;
- storage;
- IOPS;
- latency;
- locks;
- deadlocks;
- transaction rate;
- query latency;
- replication where applicable;
- failover state;
- backup status.

## 29. PostgreSQL SLIs

Important database indicators:

- availability;
- transaction success;
- query latency;
- connection utilization;
- storage headroom;
- replication lag where applicable.

Database health is not equivalent to API health.

# 30. Database Capacity

Alert thresholds should be based on sustained utilization.

Monitor:

    Connection Utilization
    CPU Utilization
    Memory Pressure
    Storage Utilization
    I/O Latency
    Transaction Rate
    Lock Wait Time

Capacity alerts should normally precede exhaustion.

# 31. Object Storage Monitoring

Monitor:

- availability;
- request failures;
- upload failures;
- download failures;
- object count;
- storage volume;
- multipart upload failures;
- egress;
- lifecycle execution;
- authorization failures.

# 32. Object Storage SLIs

Initial target:

| SLI | SLO |
|---|---:|
| Artifact upload availability | 99.5% |
| Result availability | 99.5% |

Large-object operations should be monitored independently from normal API
latency.

# 33. Queue Monitoring

Monitor:

- queue depth;
- oldest message age;
- enqueue rate;
- dequeue rate;
- processing rate;
- retry rate;
- dead-letter count;
- consumer count;
- consumer lag.

## 34. Queue Health Interpretation

Examples:

| Condition | Meaning |
|---|---|
| Low depth + normal processing | Healthy |
| Rising depth | Capacity pressure |
| High oldest age | Processing delay |
| High retry rate | Worker/problem dependency |
| Dead letters increasing | Persistent processing failure |
| No consumers | Worker outage |

# 35. Authentication Monitoring

Monitor:

- successful login;
- failed login;
- expired session;
- invalid token;
- revoked token;
- MFA failures where applicable;
- unusual authentication volume;
- administrative authentication.

Security alerts should be correlated with identity and audit logs.

# 36. Authorization Monitoring

Monitor:

- denied requests;
- cross-tenant access attempts;
- role failures;
- privileged action failures;
- suspicious access patterns.

Repeated authorization failures may indicate abuse or configuration errors.

# 37. Booking Monitoring

Monitor:

- availability queries;
- booking requests;
- successful bookings;
- conflicts;
- cancellations;
- modifications;
- expired bookings;
- allocation failures.

Business health indicator:

    Confirmed Booking
         |
    Resource Allocation
         |
    Job Start

Failures at each transition should be measurable.

# 38. Credit Monitoring

Monitor:

- wallet balance operations;
- reservations;
- consumption;
- refunds;
- ledger errors;
- reconciliation mismatches;
- negative-balance attempts.

Critical condition:

> Credit ledger and execution consumption disagree.

# 39. Job Monitoring

Monitor Job state transitions:

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
    COMPLETED / FAILED / CANCELLED / TIMEOUT

Measure duration in each state.

# 40. Job SLIs

Important Job SLIs:

- Job acceptance success;
- queue-to-start time;
- allocation latency;
- deployment success;
- start success;
- completion rate;
- failure rate;
- timeout rate.

Initial Job control availability target:

    99.9%

# 41. Run Monitoring

Runs represent actual execution.

Monitor:

- Run creation;
- start latency;
- execution duration;
- stop latency;
- failure rate;
- runtime errors;
- telemetry availability;
- result creation.

## 42. Run Health

A Run should be considered healthy when:

- runtime reports healthy;
- expected telemetry is received;
- no safety block exists;
- resource remains allocated;
- application heartbeat is valid.

## 43. Lab Agent Monitoring

Monitor every production Agent for:

- online/offline state;
- heartbeat;
- version;
- authentication;
- capabilities;
- CPU;
- memory;
- connectivity;
- command latency;
- command failures;
- reconnect count.

Initial Lab Agent cloud connectivity target:

    99.0%

# 44. Agent Heartbeat

Heartbeat should provide:

- Agent ID;
- timestamp;
- software version;
- lab ID;
- health state;
- resource summary.

The monitoring system must distinguish:

- no heartbeat;
- delayed heartbeat;
- authenticated but unhealthy;
- healthy.

# 45. Lab Monitoring

Monitor each Lab for:

- Agent connectivity;
- resource count;
- available resources;
- busy resources;
- maintenance resources;
- faulted resources;
- network health;
- power/environment status where integrated.

Lab availability is separate from cloud availability.

# 46. Resource Monitoring

Every robotic resource should expose a logical state:

- AVAILABLE;
- RESERVED;
- BUSY;
- MAINTENANCE;
- FAULT;
- OFFLINE;
- UNKNOWN.

Unexpected transitions must be observable.

# 47. Robot Monitoring

Robot monitoring may include:

- power;
- battery;
- CPU;
- memory;
- temperature;
- network;
- sensor health;
- actuator health;
- motor state;
- encoder state;
- runtime health.

Robot telemetry must be treated as observational data.

# 48. Physical Safety Monitoring

Monitor safety state where the robot platform exposes it.

Examples:

- E-stop active;
- interlock active;
- safety controller fault;
- motion inhibited;
- safety state unknown.

Cloud monitoring must not attempt to replace the local safety controller.

# 49. Safety Alerting

Safety-related alerts should be high priority.

Examples:

- unexpected safety fault;
- safety state unknown during active Run;
- E-stop activation;
- interlock activation;
- unsafe state reported.

Automatic retries must not bypass safety state.

# 50. Telemetry Monitoring

Monitor telemetry itself:

- sample rate;
- latency;
- missing samples;
- malformed samples;
- drop rate;
- ingestion rate;
- processing latency;
- storage rate.

Telemetry pipeline:

    Robot
      |
    Collector
      |
    Lab Agent
      |
    Cloud Ingestion
      |
    Processor
      |
    Realtime / Metrics / Archive

# 51. Video Monitoring

Where live video is provided, monitor:

- stream availability;
- connection establishment;
- bitrate;
- frame rate;
- latency;
- packet loss;
- session duration;
- stream failures.

Video health must be distinguished from Job health.

# 52. Results Monitoring

Monitor:

- result creation;
- processing time;
- processing failures;
- result availability;
- file generation;
- download failures.

Result creation should correlate with Run completion.

# 53. Backup Monitoring

Monitor:

- backup success;
- backup duration;
- backup age;
- backup storage;
- PITR status;
- restore-test status.

A successful backup job does not prove recoverability.

# 54. Restore Monitoring

Track:

- last successful restore test;
- restore duration;
- restored data validation;
- application validation.

Alert when restore validation exceeds the approved interval.

# 55. Security Monitoring

Monitor:

- authentication anomalies;
- authorization anomalies;
- privileged actions;
- secret access;
- security policy violations;
- vulnerability findings;
- suspicious network traffic;
- WAF events;
- unusual artifact behavior.

# 56. Deployment Monitoring

Monitor:

- deployment status;
- rollout progress;
- failed replicas;
- readiness failures;
- restart count;
- error-rate change;
- latency change;
- resource usage;
- version distribution.

Version distribution is especially important during rolling/canary releases.

# 57. Infrastructure Monitoring

Monitor:

- CPU;
- memory;
- disk;
- network;
- container restarts;
- node health where applicable;
- load balancer;
- DNS;
- certificates;
- NAT/egress;
- network errors.

# 58. Certificate Monitoring

Monitor:

- certificate expiry;
- renewal status;
- failed renewal;
- hostname mismatch;
- TLS errors.

Expiry warnings must occur sufficiently before expiration.

# 59. Cost Monitoring

Monitor:

- compute spend;
- database spend;
- storage spend;
- network spend;
- observability spend;
- Lab connectivity cost;
- backup cost.

Cost anomalies should be visible before month-end.

# 60. SLI/SLO Model

SLIs measure service behavior.

SLOs define target performance.

SLIs should map to user-visible outcomes.

Example:

    User
      |
    Upload Artifact
      |
    Artifact Accepted
      |
    Artifact SLI

not merely:

    Object Storage CPU < 70%

Infrastructure metrics remain useful but are not the primary customer SLI.

# 61. Initial SLO Catalogue

| Service | SLI | Initial Target |
|---|---|---:|
| API | Availability | 99.9% |
| API | Success | 99.9% |
| API | P95 latency | <500 ms |
| WebSocket | Availability | 99.5% |
| Artifact | Upload availability | 99.5% |
| Job Control | Availability | 99.9% |
| Results | Availability | 99.5% |
| Lab Agent | Cloud connectivity | 99.0% |

These values are initial operational targets and must be validated against
production evidence.

# 62. Error Budgets

Each SLO produces an error budget.

Example:

    SLO = 99.9%

    Error Budget = 0.1%

Error budget consumption should influence release risk.

A rapidly exhausted budget should trigger:

- investigation;
- reliability work;
- release caution;
- potential change freeze.

# 63. Dashboard Architecture

Dashboards should be organized by operational question.

Recommended dashboards:

1. Executive Health
2. Production Overview
3. API
4. WebSocket
5. Workers
6. Scheduler
7. Database
8. Queue
9. Storage
10. Security
11. Jobs
12. Runs
13. Labs
14. Robots
15. Telemetry
16. Video
17. Results
18. Backups
19. Cost
20. Deployments

# 64. Executive Health Dashboard

Must show:

- overall production status;
- active incidents;
- API SLO;
- Job success;
- active Jobs;
- active Runs;
- Lab availability;
- robot availability;
- queue health;
- database health;
- security alerts.

The dashboard should answer:

> Can customers successfully use RaaS right now?

# 65. Production Overview Dashboard

Show:

- request rate;
- error rate;
- P50/P95/P99 latency;
- API replicas;
- queue depth;
- DB health;
- worker health;
- active bookings;
- active Jobs;
- active Runs;
- Lab Agents online;
- resources available.

# 66. API Dashboard

Show:

- requests/sec;
- errors/sec;
- error percentage;
- latency distributions;
- top application error codes;
- route health;
- saturation;
- authentication failures.

# 67. Job Dashboard

Show:

- Jobs by state;
- Jobs/minute;
- success rate;
- failure rate;
- queue-to-start latency;
- allocation latency;
- deployment latency;
- execution duration;
- timeout count.

# 68. Lab Dashboard

Show:

- Labs online;
- Agents online;
- Agents offline;
- resource availability;
- busy resources;
- maintenance resources;
- faulted resources;
- heartbeat age;
- command failure rate.

# 69. Robot Dashboard

Show per platform/resource:

- online state;
- battery;
- temperature;
- CPU;
- memory;
- network;
- runtime health;
- safety state;
- current Run;
- telemetry freshness.

# 70. Database Dashboard

Show:

- availability;
- connections;
- CPU;
- memory;
- storage;
- I/O;
- transaction rate;
- slow queries;
- locks;
- deadlocks;
- replication/failover state.

# 71. Queue Dashboard

Show:

- queue depth;
- oldest message;
- processing rate;
- consumer count;
- retries;
- dead letters;
- backlog trend.

# 72. Security Dashboard

Show:

- failed authentication;
- authorization failures;
- privileged actions;
- WAF events;
- vulnerability status;
- secret-access anomalies;
- suspicious traffic.

# 73. Deployment Dashboard

Show:

- current version;
- candidate version;
- rollout percentage;
- failed instances;
- restart count;
- error-rate comparison;
- latency comparison;
- canary status.

# 74. Dashboard Design Rules

Dashboards should:

- show current state first;
- show trends second;
- provide drill-down;
- link to logs;
- link to traces;
- link to runbooks;
- show ownership;
- show environment;
- show deployment version.

Avoid dashboards that contain only infrastructure utilization without service
context.

# 75. Synthetic Monitoring

Synthetic monitoring tests critical customer workflows continuously.

Synthetic checks should use controlled test identities and resources.

They must not consume real customer credits unless explicitly designed for it.

# 76. Synthetic Checks

Minimum checks:

1. Authentication.
2. Project creation.
3. Platform discovery.
4. Availability query.
5. Booking quote.
6. Artifact registration.
7. Artifact validation.
8. Job creation.
9. Job status.
10. WebSocket connection.
11. Result availability.
12. Lab Agent heartbeat.
13. Controlled simulated execution.

# 77. Synthetic Execution

Production synthetic execution should initially use a designated safe resource
or simulation.

If a physical robot is used:

- dedicated test resource;
- explicit safety controls;
- bounded duration;
- controlled schedule;
- no customer workload interference.

# 78. Synthetic Data

Synthetic monitoring data must be clearly identifiable.

Recommended metadata:

    synthetic=true
    synthetic_test_id=<id>
    environment=production

Synthetic activity must not contaminate customer analytics.

# 79. Synthetic Alerting

A single failed synthetic check may indicate a transient issue.

Repeated failures should trigger service alerts.

Critical workflows should have multiple independent checks where practical.

# 80. Health Check Hierarchy

Monitoring should distinguish:

    Liveness
       |
    Readiness
       |
    Service Health
       |
    Customer Journey
       |
    Physical Resource Health

A higher layer cannot be considered healthy merely because a lower layer is
healthy.

# 81. Runbook Integration

Every actionable alert should link to a runbook.

Runbook structure:

    Alert
      |
    Meaning
      |
    Impact
      |
    Immediate Checks
      |
    Mitigation
      |
    Recovery
      |
    Escalation
      |
    Post-Incident Validation

# 82. Runbook Catalogue

Expected runbooks include:

- API outage;
- API elevated latency;
- WebSocket outage;
- PostgreSQL unavailable;
- PostgreSQL saturation;
- queue backlog;
- worker failure;
- scheduler failure;
- reconciliation backlog;
- object storage failure;
- artifact validation failure;
- credit reconciliation mismatch;
- booking conflict spike;
- Lab Agent offline;
- robot offline;
- telemetry degradation;
- video outage;
- deployment rollback;
- backup failure;
- restore failure;
- security incident;
- certificate expiry.

# 83. Runbook Metadata

Every runbook should contain:

| Field | Requirement |
|---|---|
| Owner | Required |
| Severity | Required |
| Alert | Required |
| Symptoms | Required |
| Impact | Required |
| Checks | Required |
| Mitigation | Required |
| Escalation | Required |
| Recovery | Required |
| Validation | Required |
| Last Review | Required |

# 84. Alert Severity

Suggested levels:

| Severity | Meaning |
|---|---|
| SEV0 | Safety/critical systemic emergency |
| SEV1 | Major customer outage |
| SEV2 | Significant degradation |
| SEV3 | Limited impact |
| SEV4 | Informational |

Physical safety incidents may require immediate local response independent
of cloud incident severity.

# 85. Alert Ownership

An alert must have:

- owner team;
- on-call destination;
- severity;
- runbook;
- dashboard;
- escalation policy.

Alerts without ownership are considered incomplete.

# 86. Alert Quality

Alerts should be:

- actionable;
- specific;
- deduplicated;
- correlated;
- rate-limited;
- documented.

Avoid alerts that fire only because an individual low-level metric crosses a
threshold without customer impact.

# 87. Alert Suppression

Suppression may be used during:

- approved maintenance;
- controlled deployments;
- known provider incidents.

Suppression must be:

- time-bounded;
- auditable;
- scoped.

Safety alerts must not be suppressed without explicit authorization.

# 88. Monitoring Data Retention

Retention should be tiered.

Example:

| Signal | Retention Strategy |
|---|---|
| Hot metrics | Short-term |
| Aggregated metrics | Long-term |
| Logs | Hot/Warm/Cold |
| Traces | Shorter high-value retention |
| Audit events | Compliance-driven |
| Robot telemetry | Hot + archive |
| Video | Short hot retention + policy archive |

Final retention depends on cost, operations and compliance.

# 89. Cardinality Management

Avoid uncontrolled metric labels.

Do not use unrestricted:

- user IDs;
- request IDs;
- artifact IDs;
- Run IDs;
- raw error messages

as metric labels.

Those values belong in logs/traces.

# 90. Sensitive Data

Monitoring must not capture:

- passwords;
- tokens;
- private keys;
- authentication secrets;
- payment secrets;
- customer source code;
- unapproved personal information.

Artifacts must not be logged as raw payloads.

# 91. Monitoring Security

Observability systems require access control.

Users should see only authorized information.

Customer-specific operational data must respect tenant boundaries.

Operators require appropriate privileged access.

# 92. Monitoring Availability

The observability system itself must be monitored.

Monitor:

- collector health;
- ingestion failures;
- dropped telemetry;
- backend availability;
- alert evaluation;
- dashboard availability;
- storage capacity.

A silent monitoring system is a production risk.

# 93. Monitoring Failure Mode

If monitoring is degraded:

- core application state remains authoritative;
- application operation should continue where safe;
- critical alerts may use independent fallback channels;
- operators must know that observability is degraded.

Monitoring failure must not be mistaken for application failure.

# 94. Event-to-Metric Correlation

Business events should support operational diagnosis.

Example:

    booking.confirmed
          |
    resource.reserved
          |
    job.created
          |
    job.queued
          |
    job.allocating
          |
    job.running
          |
    run.completed
          |
    result.available

Monitoring should expose latency between these transitions.

# 95. State Reconciliation Monitoring

Reconciliation should expose:

- pending discrepancies;
- discrepancy age;
- resolved count;
- unresolved count;
- reconciliation failures.

Critical discrepancy classes must generate alerts.

# 96. Release Monitoring

During deployment, compare:

    Stable Version
         vs
    Candidate Version

Metrics:

- error rate;
- latency;
- resource usage;
- Job failure;
- Run failure;
- queue behavior;
- database behavior.

# 97. Canary Dashboard

The canary dashboard must show:

- traffic percentage;
- candidate version;
- stable version;
- request volume;
- error rate;
- P95/P99;
- Job failure rate;
- Run failure rate;
- infrastructure health.

# 98. Post-Deployment Monitoring

After promotion:

- monitor elevated error rate;
- monitor SLO burn;
- monitor Jobs;
- monitor database;
- monitor queue;
- monitor Labs;
- monitor customer support signals.

A deployment is not complete when traffic reaches 100%.

# 99. Production Monitoring Ownership

Ownership model:

| Area | Primary | Escalation |
|---|---|---|
| API | Backend | SRE |
| Workers | Backend | SRE |
| DB | DBA/SRE | Cloud |
| Queue | SRE | Backend |
| Storage | Cloud/SRE | Backend |
| Security | Security | SRE |
| Booking | Backend | Product |
| Credits | Backend/Finance | Product |
| Jobs/Runs | Backend | Lab |
| Lab Agent | Lab Integration | SRE |
| Robot | Lab Operations | Safety |
| Telemetry | Lab Integration | SRE |
| Deployment | Release Engineering | SRE |

# 100. Operational Interfaces

Monitoring consumes standard interfaces:

    /health/live
    /health/ready
    /metrics

Application telemetry uses OpenTelemetry-compatible instrumentation.

Domain events use the RaaS event envelope.

Lab monitoring consumes authenticated Agent health and telemetry channels.

# 101. Health Response Model

A conceptual health response is:

    {
        "status": "HEALTHY",
        "service": "raas-api",
        "version": "1.2.3",
        "environment": "production",
        "checks": {
            "database": "HEALTHY",
            "queue": "HEALTHY",
            "storage": "HEALTHY"
        }
    }

Health endpoints must not expose secrets or sensitive internals.

# 102. Monitoring Data Flow

The standard flow is:

    Service
      |
    Instrumentation
      |
    Collector
      |
    Observability Backend
      |
    Rule Evaluation
      |
    Alert
      |
    On-Call
      |
    Runbook
      |
    Remediation
      |
    Validation

# 103. Incident Correlation

Operators should be able to navigate:

    Alert
      -> Dashboard
      -> Trace
      -> Logs
      -> Job / Run
      -> Resource
      -> Lab
      -> Deployment
      -> Runbook

Correlation identifiers make this possible.

# 104. Production Review Cadence

Monitoring should be reviewed:

- continuously during incidents;
- after deployments;
- weekly for operational trends;
- monthly for capacity and SLO trends;
- periodically for alert quality;
- periodically for security;
- before major releases.

# 105. Alert Review

Periodic review should remove:

- noisy alerts;
- duplicate alerts;
- obsolete thresholds;
- unowned alerts;
- alerts without useful remediation.

It should add alerts for newly discovered failure modes.

# 106. Capacity Review

Capacity reviews should examine:

- growth;
- peak traffic;
- peak Jobs;
- peak Runs;
- storage growth;
- telemetry growth;
- video growth;
- DB growth;
- queue backlog.

Forecast capacity before exhaustion.

# 107. Cost Review

Cost monitoring should compare:

- actual;
- budget;
- forecast;
- cost per user;
- cost per Job;
- cost per Run;
- cost per platform;
- storage cost;
- observability cost.

# 108. Phase Mapping

| Phase | Monitoring Objective |
|---|---|
| Phase 0 | Define observability architecture |
| Phase 1 | Monitor Control Plane |
| Phase 2 | Monitor resources and artifacts |
| Phase 3 | Monitor asynchronous execution |
| Phase 4 | Monitor commercial operations |
| Phase 5 | Monitor remote execution |
| Phase 6 | Monitor Labs and robots |
| Phase 7 | Monitor realtime and results |
| Phase 8 | Full production observability |

# 109. Phase 0

Establish:

- monitoring architecture;
- signal model;
- ownership;
- SLI/SLO definitions;
- alert principles;
- dashboard standards.

Acceptance:

- [ ] architecture reviewed;
- [ ] ownership defined;
- [ ] initial SLOs approved.

# 110. Phase 1

Implement monitoring for:

- API;
- authentication;
- PostgreSQL;
- storage;
- queue foundation;
- deployment.

Acceptance:

- [ ] health checks work;
- [ ] metrics collected;
- [ ] dashboards exist;
- [ ] critical alerts work.

# 111. Phase 2

Add:

- artifact monitoring;
- platform monitoring;
- resource monitoring;
- storage integrity;
- compatibility failures.

Acceptance:

- [ ] artifact failures are visible;
- [ ] resource state is visible.

# 112. Phase 3

Add:

- workers;
- scheduler;
- reconciliation;
- queue backlog;
- Job lifecycle.

Acceptance:

- [ ] queue health is observable;
- [ ] Job latency is measurable;
- [ ] reconciliation failures alert.

# 113. Phase 4

Add:

- booking;
- credit;
- billing integration;
- financial reconciliation.

Acceptance:

- [ ] credit mismatches are visible;
- [ ] booking failures are visible;
- [ ] commercial integrity alerts exist.

# 114. Phase 5

Add:

- remote execution;
- Job/Run monitoring;
- artifact deployment;
- execution telemetry.

Acceptance:

- [ ] complete Job lifecycle is observable;
- [ ] Run failures are measurable.

# 115. Phase 6

Add:

- Lab Agents;
- Labs;
- physical resources;
- robot health;
- safety state.

Acceptance:

- [ ] Agent heartbeat monitored;
- [ ] resource state monitored;
- [ ] robot health visible;
- [ ] safety alerts operational.

# 116. Phase 7

Add:

- realtime telemetry;
- WebSocket;
- video;
- results;
- experiment monitoring.

Acceptance:

- [ ] realtime health is visible;
- [ ] result pipeline is observable;
- [ ] video health is measurable.

# 117. Phase 8

Complete:

- SLOs;
- error budgets;
- synthetic monitoring;
- DR monitoring;
- cost monitoring;
- security monitoring;
- production dashboards.

Acceptance:

- [ ] production monitoring review passes;
- [ ] on-call runbooks are complete;
- [ ] monitoring failure is itself detectable.

# 118. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Alert fatigue | High | Actionable alerts and review |
| Missing critical metric | High | SLO-driven coverage |
| Monitoring outage | Critical | Monitor observability |
| High cardinality | Medium | Label governance |
| Sensitive data leakage | Critical | Redaction and access control |
| False health signal | High | Layered health checks |
| Stale dashboard | Medium | Ownership/review |
| Missing runbook | High | Alert acceptance gate |
| Lab disconnect unnoticed | Critical | Heartbeat monitoring |
| Robot safety state unknown | Critical | Safety alerting |
| Queue backlog | High | Age/depth monitoring |
| DB saturation | Critical | Capacity alerts |
| Cost explosion | Medium | Cost monitoring |
| Synthetic test interference | High | Dedicated resources |
| Telemetry overload | Medium | Rate limits/backpressure |
| SLO gaming | Medium | User-outcome SLIs |
| Alert suppression abuse | High | Time-bounded/audited suppression |
| Poor correlation | High | Standard IDs |
| Deployment regression | High | Canary monitoring |
| Reconciliation failure | Critical | Discrepancy alerts |

# 119. Open Questions

1. Final observability backend.
2. Final metrics backend.
3. Final log backend.
4. Final tracing backend.
5. Final alert manager.
6. Final incident-management integration.
7. Final dashboard technology.
8. Final metric retention.
9. Final log retention.
10. Final trace retention.
11. Final telemetry retention.
12. Final video retention.
13. Final audit retention.
14. Final synthetic monitoring provider.
15. Final production synthetic execution resource.
16. Final SLO windows.
17. Final SLO exclusions.
18. Final error-budget policy.
19. Final on-call schedule.
20. Final escalation policy.
21. Final alert severity thresholds.
22. Final cost alert thresholds.
23. Final Lab Agent heartbeat interval.
24. Final robot telemetry sampling rates.
25. Final compliance retention requirements.

# 120. Full Acceptance Criteria

## Architecture

- [ ] Monitoring architecture is documented.
- [ ] Logs are included.
- [ ] Metrics are included.
- [ ] Traces are included.
- [ ] Domain events are included.
- [ ] Lab/robot telemetry is included.
- [ ] Monitoring boundaries are defined.
- [ ] Ownership is defined.

## Services

- [ ] API monitoring exists.
- [ ] WebSocket monitoring exists.
- [ ] Worker monitoring exists.
- [ ] Scheduler monitoring exists.
- [ ] Reconciliation monitoring exists.
- [ ] Authentication monitoring exists.
- [ ] Deployment monitoring exists.

## Data Services

- [ ] PostgreSQL monitoring exists.
- [ ] Queue monitoring exists.
- [ ] Object storage monitoring exists.
- [ ] Backup monitoring exists.
- [ ] Restore monitoring exists.

## Business Services

- [ ] Booking monitoring exists.
- [ ] Credit monitoring exists.
- [ ] Job monitoring exists.
- [ ] Run monitoring exists.
- [ ] Result monitoring exists.
- [ ] Artifact monitoring exists.

## Labs and Robots

- [ ] Lab Agent monitoring exists.
- [ ] Lab health monitoring exists.
- [ ] Resource health monitoring exists.
- [ ] Robot health monitoring exists.
- [ ] Safety state monitoring exists.
- [ ] Telemetry monitoring exists.
- [ ] Video monitoring exists where applicable.

## Health

- [ ] Liveness checks exist.
- [ ] Readiness checks exist.
- [ ] Dependency health exists.
- [ ] Customer journey health exists.
- [ ] Health endpoints do not expose secrets.
- [ ] Health status distinguishes process and service health.

## SLOs

- [ ] API SLO exists.
- [ ] WebSocket SLO exists.
- [ ] Artifact SLO exists.
- [ ] Job SLO exists.
- [ ] Result SLO exists.
- [ ] Lab connectivity SLO exists.
- [ ] Error budgets are defined.
- [ ] SLO ownership is defined.

## Dashboards

- [ ] Executive dashboard exists.
- [ ] Production dashboard exists.
- [ ] API dashboard exists.
- [ ] Worker dashboard exists.
- [ ] Database dashboard exists.
- [ ] Queue dashboard exists.
- [ ] Job dashboard exists.
- [ ] Lab dashboard exists.
- [ ] Robot dashboard exists.
- [ ] Security dashboard exists.
- [ ] Deployment dashboard exists.
- [ ] Cost dashboard exists.

## Alerts

- [ ] Critical alerts exist.
- [ ] Alerts have owners.
- [ ] Alerts have severity.
- [ ] Alerts have runbooks.
- [ ] Alerts have escalation.
- [ ] Alerts are deduplicated.
- [ ] Alerts are reviewed periodically.
- [ ] Alert suppression is controlled.

## Synthetic Monitoring

- [ ] Authentication synthetic check exists.
- [ ] Platform discovery synthetic check exists.
- [ ] Booking synthetic check exists.
- [ ] Artifact synthetic check exists.
- [ ] Job synthetic check exists.
- [ ] WebSocket synthetic check exists.
- [ ] Result synthetic check exists.
- [ ] Lab synthetic check exists.
- [ ] Synthetic data is identifiable.
- [ ] Synthetic activity does not consume customer resources unexpectedly.

## Security

- [ ] Monitoring access is authenticated.
- [ ] Tenant isolation is enforced.
- [ ] Sensitive data is redacted.
- [ ] Secrets are excluded.
- [ ] Security events are monitored.
- [ ] Privileged actions are monitored.
- [ ] Audit events are retained.

## Operations

- [ ] Runbooks exist.
- [ ] Runbooks identify owners.
- [ ] Runbooks include remediation.
- [ ] Runbooks include validation.
- [ ] Runbooks include escalation.
- [ ] On-call ownership exists.
- [ ] Incident correlation works.
- [ ] Deployment correlation works.

## Capacity

- [ ] API capacity is monitored.
- [ ] Worker capacity is monitored.
- [ ] DB capacity is monitored.
- [ ] Queue capacity is monitored.
- [ ] Storage growth is monitored.
- [ ] Telemetry growth is monitored.
- [ ] Video growth is monitored.
- [ ] Cost growth is monitored.

## Reliability

- [ ] Monitoring backend health is monitored.
- [ ] Collector health is monitored.
- [ ] Dropped telemetry is measurable.
- [ ] Alert evaluation is monitored.
- [ ] Dashboard availability is monitored.
- [ ] Backup monitoring is operational.
- [ ] DR monitoring is operational.

## Production Readiness

- [ ] All critical production services have dashboards.
- [ ] All critical production services have alerts.
- [ ] All critical alerts have runbooks.
- [ ] All critical alerts have owners.
- [ ] All SLOs have owners.
- [ ] Synthetic checks run continuously.
- [ ] Lab Agent monitoring is operational.
- [ ] Robot monitoring is operational.
- [ ] Physical safety remains local.
- [ ] Production monitoring has passed readiness review.

# 121. Final Monitoring Invariants

Kritva RaaS monitoring must preserve these invariants:

1. Customer outcomes are monitored.
2. Infrastructure health is monitored.
3. PostgreSQL health is monitored.
4. Queue depth and age are monitored.
5. Object storage is monitored.
6. Jobs and Runs are monitored.
7. Credits and bookings are monitored.
8. Labs and Agents are monitored.
9. Robots are monitored.
10. Physical safety remains local.
11. WebSocket is not treated as durable authority.
12. REST and durable state remain authoritative.
13. Reconciliation is observable.
14. Every actionable alert has an owner.
15. Every critical alert has a runbook.
16. SLOs are measurable.
17. Error budgets are actionable.
18. Synthetic tests validate customer journeys.
19. Monitoring data respects tenant isolation.
20. Sensitive information is not exposed.
21. Monitoring itself is monitored.
22. Capacity trends are visible.
23. Deployment impact is measurable.
24. Security events are observable.
25. Backup and restore health are observable.
26. Lab disconnection is detectable.
27. Robot safety-state loss is detectable.
28. High-frequency telemetry is bounded.
29. Alert noise is actively managed.
30. Production monitoring supports incident response and recovery.

# 122. Final Operating Model

The complete production monitoring loop is:

    Production Services
          |
    Infrastructure + Application Signals
          |
    Metrics / Logs / Traces / Events / Telemetry
          |
    Observability Platform
          |
    SLI / SLO Evaluation
          |
    Dashboard + Alert
          |
    On-Call Owner
          |
    Runbook
          |
    Mitigation
          |
    Recovery
          |
    Validation
          |
    Post-Incident Review
          |
    Architecture / Capacity / Reliability Improvement

The governing principle is:

> **Kritva RaaS monitoring must make the health of the complete customer
> execution path visible—from API and durable state, through booking, credits,
> Jobs and Runs, to Lab Agents and real robotic resources—while preserving the
> distinction between cloud service health and physical robot safety. Every
> critical signal must have an owner, every actionable alert must have a
> runbook, and every production SLO must represent a measurable customer or
> operational outcome.**
