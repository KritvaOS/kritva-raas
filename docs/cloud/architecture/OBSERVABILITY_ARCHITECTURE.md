# Kritva RaaS Observability Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Observability Architecture |
| Path | `docs/cloud/architecture/OBSERVABILITY_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Observability Model | Logs + Metrics + Traces + Events |
| Trace Standard | OpenTelemetry-compatible |
| Primary Structured State | PostgreSQL |
| Realtime State | WebSocket |
| Async Transport | Durable Queue |
| Lab Boundary | Lab Agent |
| Primary Time Standard | UTC |
| Correlation | Request ID + Trace ID + Operation ID |
| Initial Deployment | Single primary region |
| Production Availability | Multi-zone where supported |
| Environment Model | Local / Development / Staging / Production |

## 2. Purpose

This document defines the production-grade observability architecture for
Kritva Robotics-as-a-Service.

Observability provides the ability to answer:

- Is the platform healthy?
- Is the user experience healthy?
- Where is a request spending time?
- Why did a Job fail?
- Which Run executed on which robot?
- Which Lab Agent handled the Run?
- What happened before and after a failure?
- Was the failure caused by cloud infrastructure, the Lab Agent, or the robot?
- Are customers experiencing degraded service?
- Is the system meeting its SLOs?
- How much observability data is being generated?
- What is the cost of retaining that data?

The central principle is:

> **Every important operation must be observable across its complete lifecycle,
> from user request through cloud services, Lab Agent, robot execution, and
> result generation.**

## 3. Scope

This document covers:

- application logging;
- infrastructure logging;
- metrics;
- distributed tracing;
- correlation identifiers;
- dashboards;
- alerting;
- Service Level Indicators;
- Service Level Objectives;
- Lab telemetry;
- robot telemetry ingestion;
- execution observability;
- WebSocket observability;
- WebRTC/media observability;
- storage and retention;
- observability security;
- observability cost management;
- incident investigation;
- operational reporting.

## 4. Non-Goals

This document does not define:

- the complete logging implementation;
- final observability vendor;
- final SIEM product;
- final telemetry time-series database;
- robot-specific sensor schemas;
- physical robot safety instrumentation;
- customer-facing analytics product design.

Those decisions are implementation-specific or remain open.

## 5. Observability Principles

Kritva RaaS follows these principles:

1. Observability is designed into the system, not added after deployment.
2. Logs explain events.
3. Metrics explain system behavior over time.
4. Traces explain request and operation paths.
5. Events describe durable domain changes.
6. PostgreSQL remains authoritative for business state.
7. WebSocket remains realtime delivery, not durable truth.
8. High-frequency telemetry is separated from control-plane observability.
9. Every important operation has a correlation path.
10. Sensitive information is never unnecessarily logged.
11. Logs and telemetry are tenant-aware.
12. Observability pipelines must not become production bottlenecks.
13. Alerting is based on actionable signals.
14. SLOs measure user-visible reliability.
15. Retention is data-class specific.
16. Observability cost is measurable.
17. Lab telemetry is distinguishable from cloud telemetry.
18. Physical safety remains local.
19. Reconciliation is observable.
20. Every critical incident should be reconstructable from retained evidence.

## 6. Observability Model

The platform uses four complementary signal classes:

| Signal | Primary Purpose |
|---|---|
| Logs | Detailed discrete events |
| Metrics | Aggregated system behavior |
| Traces | End-to-end request/operation path |
| Domain Events | Durable business state changes |

Lab telemetry is treated as a specialized fifth signal:

| Signal | Primary Purpose |
|---|---|
| Robot/Lab Telemetry | Runtime physical/system measurements |

## 7. Logical Observability Topology

    User / Studio / Web Console
              |
              v
       RaaS Control Plane
              |
       +------+------+------+
       |      |      |      |
       v      v      v      v
     Logs  Metrics Traces Events
       |      |      |      |
       +------+------+------+
              |
              v
      Observability Pipeline
              |
       +------+------+------+
       |      |      |      |
       v      v      v      v
     Log   Metrics Trace   Event
    Store   Store   Store   Store
       |      |      |      |
       +------+------+------+
              |
              v
        Dashboards / Alerts
              |
              v
          Operators

    Robot
       |
       v
    Lab Agent
       |
       +--> Runtime Telemetry
       +--> Logs
       +--> Health
       +--> Execution Events
       |
       v
    Cloud Telemetry Pipeline

## 8. Observability Layers

Observability is implemented at:

1. edge;
2. API;
3. authentication;
4. application services;
5. database;
6. queue;
7. workers;
8. scheduler;
9. object storage;
10. Lab Agent;
11. robot runtime;
12. media path;
13. infrastructure;
14. security boundary.

## 9. Correlation Model

The primary correlation identifiers are:

- `request_id`;
- `trace_id`;
- `span_id`;
- `parent_span_id`;
- `operation_id`;
- `organization_id`;
- `project_id`;
- `artifact_id`;
- `booking_id`;
- `job_id`;
- `run_id`;
- `lab_id`;
- `agent_id`;
- `resource_id`.

Identifiers must be propagated without exposing unnecessary sensitive data.

## 10. Request ID

`request_id` identifies an individual request.

It should:

- be unique;
- be returned to the caller;
- appear in structured logs;
- appear in relevant traces;
- be associated with errors.

A request ID does not replace distributed tracing.

## 11. Trace ID

`trace_id` identifies a distributed operation across service boundaries.

Example:

    Studio
      |
      | trace_id=abc
      v
    API
      |
      v
    Job Service
      |
      v
    Queue
      |
      v
    Worker
      |
      v
    Lab Agent

The same trace context should be propagated wherever technically practical.

## 12. Span ID

A `span_id` identifies one processing segment within a trace.

Examples:

- API request;
- database query;
- object-storage operation;
- queue publish;
- worker execution;
- Lab Agent command.

## 13. Operation ID

`operation_id` identifies a long-running asynchronous operation.

For example:

    POST job.start
        |
        v
    operation_id = op-123
        |
        +--> queue
        +--> worker
        +--> Lab Agent
        +--> Run
        +--> result

The operation ID may outlive the originating HTTP request.

## 14. Resource Correlation

Business resources should be correlated:

    organization_id
        |
        +--> project_id
              |
              +--> artifact_id
              +--> booking_id
              +--> job_id
                    |
                    +--> run_id
                          |
                          +--> lab_id
                          +--> agent_id
                          +--> resource_id
                          +--> result_id

This enables incident investigation without relying only on timestamps.

## 15. Trace Context

OpenTelemetry-compatible propagation is preferred.

Where applicable, use W3C Trace Context:

- `traceparent`;
- `tracestate`.

Transport headers and application envelopes remain distinct.

## 16. Correlation Across WebSocket

WebSocket events should carry:

- event ID;
- trace ID where available;
- resource ID;
- sequence;
- correlation information.

WebSocket reconnect must preserve enough context to reconcile state.

## 17. Correlation Across Queue

Queue messages should carry:

- operation ID;
- trace ID;
- originating request ID where useful;
- job ID;
- run ID;
- tenant context;
- event ID where applicable.

Queue consumers must create a new span while preserving the parent trace.

## 18. Correlation Across Lab Channel

Lab commands should carry:

- request ID;
- operation ID;
- trace ID;
- job ID;
- run ID;
- lab ID;
- agent ID;
- resource ID.

The Lab Agent should propagate trace context into local runtime operations where
supported.

## 19. Correlation Across Robot Runtime

Robot runtime telemetry should include:

- agent ID;
- resource ID;
- run ID;
- timestamp;
- sequence;
- telemetry schema version.

High-frequency telemetry need not carry a full distributed trace context for
every sample, but must remain correlated to the Run.

## 20. Logging Architecture

Logs are structured records rather than arbitrary text.

Preferred format:

    {
        "timestamp": "2026-10-08T00:00:01.123Z",
        "level": "INFO",
        "service": "job-service",
        "environment": "production",
        "request_id": "req-12345",
        "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
        "operation_id": "op-12345",
        "organization_id": "org-001",
        "job_id": "job-001",
        "event": "job.started",
        "message": "Job execution started"
    }

## 21. Structured Logging

Every production service should emit structured logs.

Recommended fields:

- timestamp;
- level;
- service;
- component;
- environment;
- region;
- instance;
- request ID;
- trace ID;
- operation ID;
- resource identifiers;
- event name;
- error code;
- duration;
- outcome.

## 22. Log Levels

| Level | Purpose |
|---|---|
| DEBUG | Detailed development diagnostics |
| INFO | Normal important operation |
| WARN | Degraded or unusual condition |
| ERROR | Failed operation requiring attention |
| FATAL | Process/service cannot continue |

DEBUG logging should generally be disabled or sampled in production.

## 23. Log Events

Recommended event categories:

- request received;
- request completed;
- authentication;
- authorization;
- artifact validation;
- booking;
- credit operation;
- Job transition;
- Run transition;
- queue operation;
- worker operation;
- Lab Agent communication;
- result processing;
- reconciliation;
- security event.

## 24. Log Error Structure

Errors should use stable protocol error codes.

Example:

    {
        "level": "ERROR",
        "event": "job.start.failed",
        "code": "JOB_START_FAILED",
        "retryable": false,
        "job_id": "job-001",
        "run_id": "run-001",
        "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
    }

Internal exception details should not automatically be exposed to clients.

## 25. Sensitive Data Logging

Never log:

- passwords;
- access tokens;
- refresh tokens;
- private keys;
- signing keys;
- database credentials;
- signed URLs;
- payment credentials.

Customer source code should not be logged by the backend.

## 26. Artifact Logging

Artifact logs should record metadata such as:

- artifact ID;
- digest;
- validation state;
- platform;
- architecture;
- result code.

Do not log artifact contents.

## 27. Logging Tenant Context

Logs should include tenant context when relevant:

- organization ID;
- project ID.

Tenant identifiers must not become authorization substitutes.

## 28. Log Sampling

Sampling may be used for high-volume logs.

Never sample away mandatory security or audit events.

Recommended:

- 100% of errors;
- 100% of security events;
- 100% of critical lifecycle events;
- sampled successful high-volume requests.

## 29. Log Pipeline

    Application
        |
        v
    Structured Log
        |
        v
    Collector
        |
        v
    Buffer / Queue
        |
        v
    Log Storage
        |
        +--> Search
        +--> Dashboard
        +--> Alerting
        +--> Archive

The application should not synchronously depend on a remote log database for
normal request completion.

## 30. Logging Backpressure

When the observability backend is unavailable:

- application functionality should continue where safe;
- local buffering may be used;
- critical audit events should use durable delivery;
- repeated logging failures must not exhaust application resources.

## 31. Metrics Architecture

Metrics provide aggregated time-series information.

Core metric categories:

- availability;
- latency;
- throughput;
- errors;
- saturation;
- queue health;
- database health;
- storage health;
- Lab health;
- Job/Run health;
- business usage.

## 32. RED Metrics

For request-oriented services:

- Rate;
- Errors;
- Duration.

Example:

    API Request Rate
    API Error Rate
    API Latency P50
    API Latency P95
    API Latency P99

## 33. USE Metrics

For infrastructure:

- Utilization;
- Saturation;
- Errors.

Examples:

- CPU utilization;
- memory utilization;
- disk utilization;
- connection pool saturation;
- queue backlog.

## 34. API Metrics

Recommended:

- requests total;
- request duration;
- request errors;
- HTTP status;
- application error code;
- endpoint;
- authentication failures;
- authorization failures.

Avoid unbounded metric labels.

## 35. Job Metrics

Recommended:

- Jobs created;
- Jobs queued;
- Jobs running;
- Jobs completed;
- Jobs failed;
- Jobs cancelled;
- Job queue time;
- validation duration;
- allocation duration;
- deployment duration;
- startup duration;
- execution duration.

## 36. Run Metrics

Recommended:

- Runs created;
- Runs started;
- Runs completed;
- Runs failed;
- Run duration;
- runtime failure rate;
- reconciliation count;
- stop latency.

## 37. Booking Metrics

Recommended:

- availability queries;
- booking requests;
- booking conflicts;
- booking confirmations;
- cancellations;
- booking utilization;
- resource utilization.

## 38. Credit Metrics

Recommended:

- credit reservations;
- credit consumption;
- credit refunds;
- insufficient-credit failures;
- ledger reconciliation failures;
- credit issuance failures.

Financial values should not be exposed unnecessarily in operational metrics.

## 39. Queue Metrics

Monitor:

- queue depth;
- oldest message age;
- processing rate;
- failure rate;
- retry count;
- dead-letter count;
- worker concurrency.

## 40. Database Metrics

Monitor:

- connections;
- connection saturation;
- query latency;
- transaction latency;
- locks;
- deadlocks;
- CPU;
- storage;
- replication lag;
- backup status.

## 41. Object Storage Metrics

Monitor:

- request rate;
- upload failures;
- download failures;
- bytes stored;
- bytes transferred;
- object count;
- lifecycle failures;
- replication status.

## 42. WebSocket Metrics

Monitor:

- active connections;
- connection failures;
- reconnect rate;
- subscription count;
- message rate;
- delivery latency;
- dropped connections.

## 43. WebRTC Metrics

Where available monitor:

- session setup success;
- connection setup latency;
- packet loss;
- jitter;
- bitrate;
- session duration;
- disconnect rate.

Media metrics should be separated from API metrics.

## 44. Lab Agent Metrics

Every Lab Agent should expose:

- online/offline state;
- heartbeat latency;
- command success rate;
- command latency;
- reconnect count;
- software version;
- CPU;
- memory;
- disk;
- local queue depth.

## 45. Robot Resource Metrics

Depending on platform capability:

- resource availability;
- runtime state;
- CPU;
- memory;
- temperature;
- battery;
- actuator health;
- communication health.

Physical safety signals should be separately classified.

## 46. Telemetry Pipeline

The Lab telemetry path is:

    Robot Runtime
         |
         v
    Local Telemetry Collector
         |
         v
    Lab Agent
         |
         +--> Local Buffer
         |
         +--> Realtime Stream
         |
         v
    Secure Cloud Ingestion
         |
         v
    Telemetry Processor
         |
         +--> Realtime Consumers
         |
         +--> Time-Series / Metrics Store
         |
         +--> Object Storage Archive

## 47. Telemetry Separation

Telemetry must be separated into:

1. control-plane metrics;
2. robot runtime telemetry;
3. high-frequency sensor data;
4. media;
5. durable experiment data.

These data types have different performance, retention and cost profiles.

## 48. Telemetry Sampling

High-frequency telemetry should support configurable sampling.

Examples:

- 1 Hz;
- 10 Hz;
- 100 Hz;
- event-driven.

The platform should not assume every signal requires the same frequency.

## 49. Telemetry Aggregation

Aggregation may include:

- min;
- max;
- average;
- percentile;
- count;
- rate;
- event occurrence.

Raw data should be retained only where justified.

## 50. Telemetry Backpressure

The Lab Agent should tolerate cloud connectivity interruption.

Recommended:

    Robot
      |
      v
    Lab Agent
      |
      v
    Local Buffer
      |
      +--> Cloud Available -> Upload
      |
      +--> Cloud Unavailable -> Buffer

Buffer limits must prevent unbounded local storage.

## 51. Telemetry Loss Policy

Telemetry loss should be explicitly classified:

- acceptable;
- degraded;
- critical.

Control-plane state must not depend on telemetry delivery.

Telemetry loss must never imply that the robot is physically safe or stopped.

## 52. Lab Offline Behavior

If cloud connectivity is lost:

- Lab Agent reports offline;
- new cloud Jobs should not be assigned;
- existing local runtime follows local policy;
- telemetry may buffer;
- physical safety remains local;
- reconnect triggers reconciliation.

## 53. Telemetry Reconnection

On reconnect:

    Lab Agent Reconnect
          |
          v
    Authenticate
          |
          v
    Heartbeat
          |
          v
    State Reconciliation
          |
          +--> Active Job
          +--> Run
          +--> Resource
          +--> Pending Results
          |
          v
    Resume Authorized Telemetry

## 54. Tracing Architecture

Tracing should use OpenTelemetry-compatible instrumentation.

Trace boundaries include:

- Studio request;
- API;
- application service;
- database;
- object storage;
- queue;
- worker;
- scheduler;
- Lab Agent;
- result processing.

## 55. Trace Example

    trace_id=abc

    API
      |
      +-- auth
      |
      +-- project.get
      |
      +-- artifact.validate
      |
      +-- booking.check
      |
      +-- job.create
            |
            +-- DB transaction
            |
            +-- queue.publish
                    |
                    +-- worker
                          |
                          +-- resource.allocate
                          +-- Lab Agent
                                |
                                +-- robot runtime

## 56. Trace Sampling

Trace sampling may be adaptive.

Recommended:

- 100% of failed critical operations;
- high sampling for slow requests;
- representative sampling for successful requests;
- configurable sampling for high-volume telemetry.

## 57. Trace Retention

Trace retention is generally shorter than business-state retention.

Trace data should be retained long enough for:

- incident investigation;
- performance analysis;
- release validation.

Audit and business records require separate retention.

## 58. Trace Security

Do not include:

- secrets;
- tokens;
- private source;
- complete artifact contents;
- unnecessary customer payloads.

Trace attributes should use IDs and metadata.

## 59. Dashboards

Dashboards should be role-specific.

Recommended dashboards:

1. Executive/Service Health.
2. Platform Operations.
3. API.
4. Job/Run.
5. Lab.
6. Database.
7. Queue/Workers.
8. Storage.
9. Security.
10. Cost.
11. Incident Investigation.

## 60. Executive Service Dashboard

Show:

- overall availability;
- active users;
- active Jobs;
- Job success rate;
- Run success rate;
- booking utilization;
- lab availability;
- major incidents;
- SLO status.

## 61. API Dashboard

Show:

- request rate;
- error rate;
- P50/P95/P99 latency;
- top error codes;
- authentication failures;
- authorization failures;
- saturation.

## 62. Job Dashboard

Show:

- Jobs by state;
- queue age;
- validation failures;
- allocation failures;
- deployment failures;
- startup failures;
- runtime failures;
- completion rate.

## 63. Lab Dashboard

Show:

- labs online;
- agents online;
- resources available;
- resources busy;
- resource faults;
- heartbeat age;
- command failures;
- active Runs.

## 64. Database Dashboard

Show:

- CPU;
- memory;
- connections;
- connection saturation;
- query latency;
- locks;
- deadlocks;
- storage;
- replication;
- backup health.

## 65. Queue Dashboard

Show:

- queue depth;
- oldest message;
- throughput;
- retries;
- dead letters;
- worker capacity.

## 66. Storage Dashboard

Show:

- PostgreSQL size;
- object storage size;
- artifact volume;
- result volume;
- log volume;
- video volume;
- telemetry volume;
- egress;
- lifecycle transitions;
- storage cost.

## 67. Security Dashboard

Show:

- authentication failures;
- authorization denials;
- WAF blocks;
- suspicious access;
- IAM changes;
- privileged actions;
- vulnerability status;
- secret rotation status.

## 68. Cost Dashboard

Show:

- database cost;
- compute cost;
- object storage cost;
- storage requests;
- network egress;
- observability cost;
- video cost;
- telemetry cost.

Where possible, costs should be attributable to organizations and platforms.

## 69. Alerting Architecture

Alerting should be driven by:

- SLO violations;
- infrastructure saturation;
- service failures;
- queue backlog;
- database health;
- Lab Agent health;
- security events;
- backup failures;
- storage failures.

## 70. Alert Quality

Alerts should be:

- actionable;
- specific;
- correlated;
- severity-classified;
- linked to runbooks;
- deduplicated.

Avoid alerting on every individual error.

## 71. Alert Severity

| Severity | Meaning |
|---|---|
| Critical | Immediate production/customer impact |
| High | Major degradation or imminent failure |
| Medium | Important degradation |
| Low | Operational attention |
| Informational | No immediate action |

## 72. SLI Definition

A Service Level Indicator is a measurable signal representing service quality.

Core SLIs include:

- API availability;
- API latency;
- Job start success;
- Job completion success;
- booking success;
- artifact upload success;
- result availability;
- Lab availability;
- realtime connection availability.

## 73. SLO Definition

Service Level Objectives define target reliability.

Initial values are examples and must be finalized after production measurement.

| SLI | Initial Target |
|---|---:|
| API availability | 99.9% |
| API successful requests | 99.9% |
| API P95 latency | < 500 ms for normal APIs |
| Job control availability | 99.9% |
| Artifact upload completion | 99.5% |
| Result availability | 99.5% |
| Control Plane WebSocket availability | 99.5% |
| Lab Agent cloud connectivity | 99.0% |

Physical robot availability is measured separately from cloud SLOs.

## 74. SLO Boundaries

SLOs must distinguish:

- cloud platform;
- lab infrastructure;
- customer network;
- robot hardware;
- external providers.

A robot hardware fault must not automatically count as a Control Plane API
availability failure.

## 75. Error Budget

Each SLO generates an error budget.

Example:

    SLO = 99.9%
    Error Budget = 0.1%

Error budget can influence:

- release frequency;
- reliability work;
- incident priority;
- capacity investment.

## 76. Job SLO

Job success should distinguish:

- platform failure;
- artifact failure;
- user cancellation;
- booking cancellation;
- resource fault;
- Lab Agent failure;
- robot runtime failure.

User-requested cancellation should not automatically count as platform failure.

## 77. Lab SLO

Lab SLOs may measure:

- Agent connectivity;
- resource availability;
- successful deployment;
- successful start;
- successful execution.

Hardware maintenance should be excluded from availability calculations where
policy defines planned maintenance.

## 78. Alert Inputs

Alerting consumes:

    Metrics
      +
    Logs
      +
    Traces
      +
    Domain Events
      +
    Lab Health
      +
    Security Events
      +
    SLO Burn Rate

## 79. Burn-Rate Alerting

For important SLOs, burn-rate alerting is preferred over static threshold
alerting alone.

This allows fast detection of severe incidents while avoiding noisy alerts
for isolated failures.

## 80. Example Critical Alerts

Critical examples:

- Control Plane availability below SLO;
- PostgreSQL unavailable;
- queue completely stalled;
- production secret store unavailable;
- critical signing key issue;
- cross-tenant access detection;
- widespread Lab Agent authentication failure.

## 81. Example High Alerts

High examples:

- sustained API latency;
- queue backlog exceeding policy;
- high Job failure rate;
- database connection saturation;
- storage failures;
- Lab Agent fleet degradation;
- backup failure.

## 82. Alert Suppression

Alerts may be suppressed during:

- approved maintenance;
- known planned outages.

Suppression must be:

- time-bounded;
- authorized;
- audited.

Safety/security alerts should not be silently suppressed.

## 83. Runbook Integration

Every production alert should link to a runbook.

Example:

    Alert
      |
      v
    Dashboard
      |
      v
    Runbook
      |
      v
    Investigation
      |
      v
    Remediation

## 84. Incident Investigation

Investigation should start with:

1. timestamp;
2. request ID;
3. trace ID;
4. operation ID;
5. Job ID;
6. Run ID;
7. Lab/Agent ID;
8. resource ID.

Then correlate:

    Request
      |
      v
    Trace
      |
      v
    Logs
      |
      v
    Job/Run
      |
      v
    Lab Agent
      |
      v
    Robot Telemetry
      |
      v
    Result

## 85. Operational Event Model

Domain events remain distinct from observability logs.

Example:

    job.running

is a business event.

A log saying:

    "worker processed job transition"

is an operational observation.

Both may reference the same Job and trace.

## 86. Event Observability

Business events should carry:

- event ID;
- resource;
- sequence;
- trace context;
- organization context;
- timestamp.

Critical event delivery should be observable through outbox metrics.

## 87. Outbox Metrics

Monitor:

- outbox depth;
- oldest event age;
- publication rate;
- publication failures;
- retry count;
- dead-letter count.

## 88. Reconciliation Metrics

Monitor:

- stale Jobs;
- stale Runs;
- resource mismatches;
- DB/object mismatches;
- credit mismatches;
- Lab state mismatches;
- reconciliation duration;
- reconciliation failures.

## 89. Storage Retention

Observability retention should be data-class specific.

Recommended conceptual policy:

| Data | Retention |
|---|---|
| Debug logs | Short |
| Application logs | Short/Medium |
| Security logs | Long |
| Audit | Long |
| Metrics | Medium |
| Traces | Short/Medium |
| Raw telemetry | Policy dependent |
| Aggregated telemetry | Long |
| Incident evidence | Long |
| Cost data | Medium/Long |

Exact periods remain open.

## 90. Hot/Warm/Cold Observability

Use tiered storage:

    Hot
      Recent searchable logs/metrics/traces
        |
        v
    Warm
      Historical operational data
        |
        v
    Cold
      Compliance/archive/incident evidence

## 91. Observability Cost

Observability cost drivers include:

- log ingestion;
- log indexing;
- metric cardinality;
- trace volume;
- telemetry rate;
- video metadata;
- retention;
- egress;
- dashboard/query load.

## 92. Cardinality Control

Metric labels must avoid unbounded values.

Do not use:

- request ID;
- trace ID;
- user ID;
- artifact digest;

as ordinary metric labels.

These belong in logs/traces.

## 93. High-Cardinality Telemetry

High-cardinality data should use:

- logs;
- traces;
- specialized telemetry stores;
- bounded dimensions.

Metric labels should use stable dimensions such as:

- service;
- environment;
- region;
- endpoint class;
- status class.

## 94. Log Cost Controls

Controls include:

- sampling;
- retention;
- compression;
- tiering;
- exclusion of noisy debug logs;
- aggregation.

Critical audit/security logs remain unsampled.

## 95. Metric Cost Controls

Controls include:

- bounded labels;
- metric review;
- aggregation;
- recording rules;
- retention tiers.

## 96. Trace Cost Controls

Controls include:

- adaptive sampling;
- tail-based sampling where supported;
- error retention;
- slow-trace retention;
- short default retention.

## 97. Telemetry Cost Controls

Controls include:

- configurable sampling;
- compression;
- aggregation;
- batching;
- retention policy;
- customer plan limits.

## 98. Observability Security

Observability systems contain sensitive information.

Protect them with:

- IAM;
- tenant-aware access;
- encryption;
- retention controls;
- audit;
- data redaction.

## 99. Tenant Observability Isolation

Customer-facing observability must never expose another organization's:

- logs;
- traces;
- telemetry;
- resource identifiers;
- Job information.

Internal operators may have broader access subject to role and audit.

## 100. Customer Logs

If customer-facing execution logs are provided, they should be filtered from
internal infrastructure logs.

Customer logs should contain relevant Run output, not internal cloud secrets
or infrastructure topology.

## 101. Customer Telemetry

Customer-facing telemetry should be scoped to:

- organization;
- project;
- Job;
- Run;
- authorized robot resource.

## 102. Metrics Authority

Operational metrics are derived observations.

They do not replace PostgreSQL state.

For example:

    job.running metric

does not determine whether the Job is actually running.

The authoritative state remains the Job/Run record.

## 103. Telemetry Authority

Robot telemetry is observational.

It does not replace:

- safety controller state;
- authoritative Job state;
- authoritative Run state;
- Lab resource state.

## 104. Clock Model

Backend timestamps use UTC.

Telemetry timestamps should include:

- event timestamp;
- observed timestamp where applicable;
- ingestion timestamp.

This helps identify clock skew and network delay.

## 105. Clock Skew

Lab Agents should synchronize clocks where practical.

Telemetry should retain ingestion time even if device time is inaccurate.

Significant clock skew should generate diagnostics.

## 106. Telemetry Schema Versioning

Telemetry schemas must be versioned.

Example:

    telemetry_schema_version = "1.0"

Schema evolution must remain backward compatible where practical.

## 107. Telemetry Interface

Logical interface:

    publishTelemetry(
        agent_id,
        resource_id,
        run_id,
        timestamp,
        schema_version,
        samples
    )

The implementation may use streaming or batched transport.

## 108. Metrics Interface

Logical application metrics include:

    counter.increment()
    gauge.set()
    histogram.observe()
    timer.record()

The implementation should map to the selected metrics backend.

## 109. Logging Interface

Logical interface:

    logger.info(event, attributes)
    logger.warn(event, attributes)
    logger.error(event, attributes)

Structured attributes should be typed and bounded.

## 110. Tracing Interface

Logical interface:

    startSpan(name, context)
    setAttribute(key, value)
    recordError(error)
    endSpan()

Trace propagation should use standard context propagation.

## 111. Observability Health

The observability system itself must be observable.

Monitor:

- collector health;
- ingestion latency;
- dropped logs;
- dropped metrics;
- dropped traces;
- storage health;
- query latency;
- alert delivery;
- pipeline backlog.

## 112. Observability Failure

If observability partially fails:

- business operations should continue where safe;
- critical audit events must remain durable;
- local buffering may protect telemetry;
- alerts should identify observability degradation.

A monitoring outage must not silently appear as system health.

## 113. Data Loss Monitoring

Track:

- log drops;
- telemetry drops;
- queue drops;
- trace sampling;
- collector failures.

Dropped telemetry should be distinguishable from zero-valued telemetry.

## 114. Dashboards as Code

Where practical, dashboards and alert definitions should be version-controlled.

Changes should be reviewed like application code.

## 115. Alert Configuration as Code

Alert thresholds and policies should be:

- versioned;
- reviewed;
- environment-aware;
- auditable.

Production alert changes should not depend exclusively on manual console edits.

## 116. Environment Observability

Development may use lower retention and lower sampling.

Staging should use production-like observability.

Production requires:

- complete security/audit logging;
- critical lifecycle events;
- SLO metrics;
- incident dashboards;
- alerting.

## 117. Local Development

Local development should provide:

- structured logs;
- local metrics;
- trace IDs;
- basic dashboards where useful.

Developers should be able to trace:

    Studio
      |
      v
    Backend
      |
      v
    Database
      |
      v
    Worker

without requiring production infrastructure.

## 118. Staging Validation

Staging should validate:

- log collection;
- metrics;
- traces;
- alerts;
- dashboards;
- correlation;
- Lab Agent telemetry;
- SLO calculations.

## 119. Production Readiness

Production readiness requires:

- observability dashboards;
- alert routing;
- SLO monitoring;
- runbooks;
- retention;
- security controls;
- cost monitoring;
- incident response.

## 120. Phase Mapping

| Phase | Observability Focus |
|---|---|
| Phase 0 | Signal model, correlation, observability interfaces |
| Phase 1 | Application logs, metrics, basic tracing |
| Phase 2 | Artifact/booking/resource metrics |
| Phase 3 | Queue, workers, async tracing, reconciliation |
| Phase 4 | Credits, billing, audit and business metrics |
| Phase 5 | Job/Run execution observability |
| Phase 6 | Lab Agent and robot telemetry |
| Phase 7 | Video, telemetry, SLOs, dashboards and alerts |
| Phase 8 | Production hardening, cost optimization, incident readiness |

## 121. Phase 0 Acceptance

- [ ] Observability signal model is defined.
- [ ] Correlation identifiers are defined.
- [ ] Trace propagation model is defined.
- [ ] Tenant observability boundaries are defined.
- [ ] Sensitive-data logging policy is defined.

## 122. Phase 1 Acceptance

- [ ] Structured application logs exist.
- [ ] Request IDs exist.
- [ ] Basic metrics exist.
- [ ] Distributed tracing is instrumented.
- [ ] API dashboards exist.
- [ ] Basic service alerts exist.

## 123. Phase 2 Acceptance

- [ ] Artifact metrics exist.
- [ ] Booking metrics exist.
- [ ] Resource metrics exist.
- [ ] Storage metrics exist.
- [ ] Tenant-aware operational correlation exists.

## 124. Phase 3 Acceptance

- [ ] Queue metrics exist.
- [ ] Worker metrics exist.
- [ ] Scheduler metrics exist.
- [ ] Async traces propagate.
- [ ] Outbox metrics exist.
- [ ] Reconciliation metrics exist.
- [ ] Dead-letter conditions alert.

## 125. Phase 4 Acceptance

- [ ] Credit metrics exist.
- [ ] Billing metrics exist.
- [ ] Credit reconciliation metrics exist.
- [ ] Financial security events are audited.
- [ ] Business dashboards exist.

## 126. Phase 5 Acceptance

- [ ] Job lifecycle is observable.
- [ ] Run lifecycle is observable.
- [ ] Execution traces cross worker boundaries.
- [ ] Job failures are classified.
- [ ] Run failures are classified.
- [ ] Execution logs are available.
- [ ] Stop/cancel operations are observable.

## 127. Phase 6 Acceptance

- [ ] Lab Agent heartbeat is monitored.
- [ ] Agent command latency is measured.
- [ ] Agent reconnects are measured.
- [ ] Resource health is measured.
- [ ] Robot telemetry reaches the cloud.
- [ ] Telemetry is correlated to Run IDs.
- [ ] Lab disconnect/reconnect is observable.

## 128. Phase 7 Acceptance

- [ ] SLOs are implemented.
- [ ] Error budgets are calculated.
- [ ] Burn-rate alerts exist.
- [ ] Video/media health is observable.
- [ ] Telemetry dashboards exist.
- [ ] Customer-visible execution telemetry is isolated.
- [ ] Cost dashboards exist.

## 129. Phase 8 Acceptance

- [ ] Production dashboards are reviewed.
- [ ] Alert fatigue is assessed.
- [ ] Runbooks are linked to alerts.
- [ ] Incident investigations can correlate end-to-end.
- [ ] Observability retention is optimized.
- [ ] Observability cost is monitored.
- [ ] Observability pipeline failure is tested.
- [ ] Incident response exercises are completed.

## 130. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Missing logs | High | Structured mandatory events |
| High log volume | High | Sampling + retention |
| Metric cardinality explosion | High | Bounded labels |
| Trace cost explosion | Medium | Adaptive sampling |
| Telemetry overload | High | Sampling + batching |
| Observability outage | High | Buffering + durable critical events |
| Cross-tenant observability leak | Critical | Tenant authorization |
| Secret leakage in logs | Critical | Redaction + scanning |
| Alert fatigue | High | SLO/burn-rate alerts |
| Missing correlation | High | Mandatory IDs |
| Clock skew | Medium | Time sync + ingestion timestamps |
| Storage cost growth | High | Tiering + retention |
| False health signal | High | Separate authoritative state |
| Lab disconnect | High | Heartbeat + reconciliation |
| Missing incident evidence | Critical | Protected retention |

## 131. Risk: Observability Becomes a Bottleneck

Mitigation:

- asynchronous collection;
- batching;
- buffering;
- rate limits;
- bounded resource consumption;
- independent observability infrastructure.

## 132. Risk: Metrics Become Too Expensive

Mitigation:

- bounded labels;
- metric ownership;
- cardinality review;
- aggregation;
- retention policy.

## 133. Risk: Telemetry Flood

Mitigation:

- per-resource rate limits;
- sampling;
- local aggregation;
- batching;
- backpressure;
- customer quotas.

## 134. Risk: Alert Fatigue

Mitigation:

- alert on symptoms;
- SLO-based alerts;
- severity levels;
- deduplication;
- maintenance suppression;
- runbook links.

## 135. Risk: Incomplete Distributed Trace

Mitigation:

- standard trace propagation;
- queue context propagation;
- Lab Agent context;
- trace integration tests;
- fallback correlation IDs.

## 136. Risk: Customer Data Leakage

Mitigation:

- tenant-scoped queries;
- tenant-scoped dashboards;
- redaction;
- separate internal/customer views;
- authorization tests.

## 137. Open Questions

The following observability decisions remain open:

1. Final observability vendor.
2. Final log backend.
3. Final metrics backend.
4. Final trace backend.
5. Final SIEM.
6. Final telemetry/time-series database.
7. Final dashboard technology.
8. Final alert-routing platform.
9. Exact production SLO values.
10. Exact error-budget policy.
11. Exact log retention.
12. Exact trace retention.
13. Exact metric retention.
14. Exact telemetry retention.
15. Final video observability architecture.
16. Final customer observability API.
17. Final cost attribution model.
18. Final cross-region observability strategy.

These decisions do not change the required signal model, correlation model,
tenant isolation or observability authority principles.

## 138. Full Acceptance Criteria Checklist

### Logging

- [ ] Production logs are structured.
- [ ] Logs include timestamp.
- [ ] Logs include service/component.
- [ ] Logs include environment.
- [ ] Logs include request ID where applicable.
- [ ] Logs include trace ID where applicable.
- [ ] Logs include operation ID where applicable.
- [ ] Logs include resource IDs where appropriate.
- [ ] Logs use stable error codes.
- [ ] Debug logging is controlled.
- [ ] Security events are retained.
- [ ] Critical lifecycle events are retained.
- [ ] Secrets are never logged.
- [ ] Customer source code is not logged.
- [ ] Log pipeline has backpressure handling.

### Metrics

- [ ] API RED metrics exist.
- [ ] Infrastructure USE metrics exist.
- [ ] Job metrics exist.
- [ ] Run metrics exist.
- [ ] Booking metrics exist.
- [ ] Credit metrics exist.
- [ ] Queue metrics exist.
- [ ] Database metrics exist.
- [ ] Storage metrics exist.
- [ ] Lab Agent metrics exist.
- [ ] Metrics have bounded cardinality.
- [ ] Metric retention is defined.

### Tracing

- [ ] OpenTelemetry-compatible instrumentation exists.
- [ ] API traces exist.
- [ ] Database spans exist.
- [ ] Queue spans exist.
- [ ] Worker spans exist.
- [ ] Scheduler spans exist.
- [ ] Lab Agent traces exist where supported.
- [ ] Trace context is propagated.
- [ ] Failed operations are retained.
- [ ] Slow operations are retained.
- [ ] Trace data is protected.

### Correlation

- [ ] Request ID exists.
- [ ] Trace ID exists.
- [ ] Span ID exists.
- [ ] Operation ID exists for asynchronous work.
- [ ] Job ID is correlated.
- [ ] Run ID is correlated.
- [ ] Lab ID is correlated.
- [ ] Agent ID is correlated.
- [ ] Resource ID is correlated.
- [ ] Correlation survives queue boundaries.
- [ ] Correlation survives Lab boundaries.
- [ ] Correlation survives reconnect/reconciliation.

### Dashboards

- [ ] Executive health dashboard exists.
- [ ] API dashboard exists.
- [ ] Job dashboard exists.
- [ ] Lab dashboard exists.
- [ ] Database dashboard exists.
- [ ] Queue dashboard exists.
- [ ] Storage dashboard exists.
- [ ] Security dashboard exists.
- [ ] Cost dashboard exists.
- [ ] Incident investigation dashboard exists.

### Alerting

- [ ] Alerts are actionable.
- [ ] Alerts have severity.
- [ ] Alerts have runbooks.
- [ ] Alerts are deduplicated.
- [ ] Critical SLO alerts exist.
- [ ] Database alerts exist.
- [ ] Queue alerts exist.
- [ ] Worker alerts exist.
- [ ] Lab Agent alerts exist.
- [ ] Backup alerts exist.
- [ ] Security alerts exist.
- [ ] Observability pipeline alerts exist.

### SLI/SLO

- [ ] API availability SLI exists.
- [ ] API latency SLI exists.
- [ ] Job success SLI exists.
- [ ] Result availability SLI exists.
- [ ] Lab connectivity SLI exists.
- [ ] Initial SLO targets are documented.
- [ ] Error budgets are calculated.
- [ ] Burn-rate alerts exist.
- [ ] Planned maintenance policy exists.
- [ ] Customer-caused failures are separated where appropriate.
- [ ] Hardware failures are separated from cloud service availability.

### Lab Telemetry

- [ ] Lab Agent collects health telemetry.
- [ ] Robot runtime telemetry is correlated to Runs.
- [ ] Telemetry schema is versioned.
- [ ] Telemetry supports sampling.
- [ ] Telemetry supports batching.
- [ ] Telemetry supports backpressure.
- [ ] Local buffering exists where required.
- [ ] Telemetry loss is detectable.
- [ ] Reconnection triggers reconciliation.
- [ ] Physical safety remains local.

### Security

- [ ] Observability systems are access-controlled.
- [ ] Customer telemetry is tenant-isolated.
- [ ] Security logs are protected.
- [ ] Secrets are redacted.
- [ ] Signed URLs are not logged.
- [ ] Tokens are not logged.
- [ ] Trace payloads are sanitized.
- [ ] Observability access is audited.

### Retention

- [ ] Log retention is defined.
- [ ] Security-log retention is defined.
- [ ] Audit retention is defined.
- [ ] Metric retention is defined.
- [ ] Trace retention is defined.
- [ ] Telemetry retention is defined.
- [ ] Incident evidence retention is defined.
- [ ] Hot/warm/cold tiers are evaluated.
- [ ] Retention is environment-specific where appropriate.

### Cost

- [ ] Log ingestion cost is measurable.
- [ ] Log storage cost is measurable.
- [ ] Metric cost is measurable.
- [ ] Trace cost is measurable.
- [ ] Telemetry cost is measurable.
- [ ] Egress cost is measurable.
- [ ] Observability cost is included in cloud cost reporting.
- [ ] High-cardinality metrics are controlled.
- [ ] Retention reduces unnecessary cost.
- [ ] Customer/platform attribution is evaluated.

### Incident Readiness

- [ ] Incident investigation can begin with a request ID.
- [ ] Incident investigation can begin with a Job ID.
- [ ] Incident investigation can begin with a Run ID.
- [ ] Cloud-to-lab tracing is supported.
- [ ] Security evidence is retained.
- [ ] Alert runbooks exist.
- [ ] Observability outage procedures exist.
- [ ] Incident exercises are performed.

## 139. Final Observability Invariants

The following invariants are mandatory:

1. Every production request is observable through logs and metrics.
2. Critical distributed operations have trace correlation.
3. Long-running operations have operation IDs.
4. Jobs and Runs are independently observable.
5. Lab Agents are observable by identity and health.
6. Robot telemetry is correlated to the executing Run.
7. PostgreSQL remains authoritative for business state.
8. Observability signals never replace authoritative state.
9. WebSocket is realtime delivery, not durable observability truth.
10. Security and audit events are not silently sampled away.
11. Metric cardinality remains bounded.
12. High-frequency telemetry has explicit rate and retention controls.
13. Logs never contain secrets.
14. Observability data is tenant-isolated.
15. Customer-facing observability is separated from internal infrastructure
    observability.
16. Critical operations remain functional during partial observability failure
    where safe.
17. Critical audit data has durable delivery.
18. Correlation survives asynchronous queue boundaries.
19. Correlation survives cloud-to-lab boundaries where supported.
20. Reconnect and reconciliation are observable.
21. SLOs measure user-visible service quality.
22. Hardware and planned maintenance are distinguished from cloud failures.
23. Alerts are actionable and linked to runbooks.
24. Observability cost is measurable.
25. Retention is data-class specific.
26. Observability infrastructure is itself monitored.
27. Incident evidence is protected.
28. Time is normalized to UTC with ingestion timestamps available.
29. Observability configuration is version-controlled where practical.
30. Security-sensitive observability changes are reviewed and audited.

## 140. Final Observability Architecture

The target architecture is:

    ┌──────────────────────────────────────────────────────────────┐
    │                     Kritva RaaS Clients                      │
    │                                                              │
    │ Studio          Web Console          Admin                   │
    └──────────────────────────┬───────────────────────────────────┘
                               |
                               v
                    ┌─────────────────────┐
                    │  RaaS Control Plane │
                    └──────────┬──────────┘
                               |
              ┌────────────────┼────────────────┐
              |                |                |
              v                v                v
            Logs            Metrics           Traces
              |                |                |
              +----------------+----------------+
                               |
                               v
                    Observability Pipeline
                               |
             ┌─────────────────┼──────────────────┐
             |                 |                  |
             v                 v                  v
          Log Store       Metrics Store       Trace Store
             |                 |                  |
             +─────────────────+──────────────────+
                               |
                    ┌──────────┴──────────┐
                    |                     |
                    v                     v
               Dashboards              Alerting
                    |                     |
                    +----------+----------+
                               |
                               v
                         Operations / SRE

    ┌──────────────────────────────────────────────────────────────┐
    │                         Lab Environment                       │
    │                                                              │
    │   Robot Runtime --> Lab Agent --> Secure Cloud Telemetry     │
    │          |                |                                  │
    │          |                +--> Health / Logs / Events        │
    │          |                                                   │
    │          +--> Runtime Telemetry                              │
    └──────────────────────────────────────────────────────────────┘

The end-to-end observability chain is:

    User
      |
      v
    Request
      |
      v
    Control Plane
      |
      v
    Job
      |
      v
    Queue
      |
      v
    Worker
      |
      v
    Run
      |
      v
    Lab Agent
      |
      v
    Robot
      |
      v
    Telemetry / Logs / Results
      |
      v
    Cloud Observability
      |
      v
    Dashboard / Alert / Incident

This architecture gives Kritva RaaS the ability to observe the complete
execution lifecycle while preserving the authority boundaries established by
the platform architecture.

The final operating principle is:

> **If a user can execute it, Kritva must be able to correlate it, observe it,
> measure it, alert on its failure, and reconstruct what happened.**
