# Kritva RaaS Production Alerting

## 1. Document Control

| Item | Value |
|---|---|
| Document | Production Alerting |
| Path | `docs/cloud/operations/ALERTING.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Scope | Production alerting and operational escalation |
| Primary Environment | Production |
| Alert Sources | Metrics, logs, traces, events, telemetry, synthetic checks |
| Primary State Authority | PostgreSQL |
| Physical Safety Authority | Local Lab/Robot |
| Alert Model | Actionable, owned, routed, runbook-linked |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the production alerting architecture and operating
model for Kritva RaaS.

Alerting converts observable system conditions into actionable operational
signals.

The alerting system must answer:

- What is wrong?
- How severe is it?
- Who owns it?
- What customer or operational impact exists?
- What should the responder do first?
- Where is the runbook?
- When should the issue escalate?
- When can the alert be resolved?
- What evidence must be retained?

Alerting is not intended to report every abnormal metric.

The objective is to generate a small set of high-value signals that require
human or automated action.

## 3. Scope

This document covers alerting for:

- API;
- WebSocket;
- workers;
- scheduler;
- reconciliation;
- PostgreSQL;
- queue;
- object storage;
- authentication;
- authorization;
- bookings;
- credits;
- Jobs;
- Runs;
- results;
- Lab Agents;
- Labs;
- robotic resources;
- robot health;
- safety state;
- telemetry;
- video;
- backups;
- disaster recovery;
- security;
- deployments;
- infrastructure;
- capacity;
- cost;
- synthetic checks.

## 4. Non-Goals

This document does not define:

- detailed application implementation;
- robot safety controller behavior;
- complete incident-response policy;
- final cloud-provider-specific alert syntax;
- final monitoring vendor;
- customer contractual SLA language;
- detailed dashboard layouts.

## 5. Alerting Principles

Production alerting follows these principles:

1. Alert on actionable conditions.
2. Prefer customer-impact signals over low-level symptoms.
3. Every alert has an owner.
4. Every actionable alert has a runbook.
5. Every alert has a defined severity.
6. Every alert has routing.
7. Critical alerts have escalation.
8. Alerts must be deduplicated.
9. Alerts must be correlated.
10. Alerts must avoid excessive cardinality.
11. Alerts must distinguish symptoms from causes.
12. Alerts must be measurable.
13. Alerts must be reviewable.
14. Alerts must be auditable.
15. Safety alerts must not be hidden by ordinary suppression.
16. Monitoring failure must itself be observable.
17. Alert thresholds should be based on SLOs where possible.
18. Alerts must not expose secrets or customer source code.
19. Cloud alerts must not be treated as physical E-stop commands.
20. Alert noise is a reliability problem and must be actively managed.

# 6. Alerting Architecture

The logical architecture is:

    Services / Infrastructure / Labs / Robots
                    |
                    v
             Telemetry Signals
                    |
       +------------+------------+
       |            |            |
     Metrics      Logs         Events
       |            |            |
       +------------+------------+
                    |
                    v
             Rule Evaluation
                    |
                    v
             Alert Generation
                    |
                    v
             Alert Normalization
                    |
                    v
             Deduplication
                    |
                    v
             Grouping / Correlation
                    |
                    v
             Routing / Escalation
                    |
          +---------+---------+
          |                   |
       On-Call            Incident System
          |                   |
          +---------+---------+
                    |
                 Runbook
                    |
                 Response
                    |
                Recovery

## 7. Alert Sources

Alerts may originate from:

- metrics;
- logs;
- traces;
- domain events;
- synthetic checks;
- infrastructure health;
- security systems;
- backup systems;
- deployment systems;
- Lab Agent telemetry;
- robot telemetry;
- reconciliation;
- cost monitoring.

Metrics should be the preferred source for stable service-health alerts.

## 8. Alert Lifecycle

The alert lifecycle is:

    Condition
       |
    Detection
       |
    Pending / Confirmation
       |
    FIRING
       |
    Routing
       |
    Acknowledgement
       |
    Investigation
       |
    Mitigation
       |
    Recovery
       |
    RESOLVED
       |
    Review

Not every alert requires human acknowledgement, but every actionable alert
must have a defined response path.

# 9. Alert Taxonomy

Alerts are classified by operational domain.

| Category | Examples |
|---|---|
| Availability | API unavailable |
| Performance | API latency |
| Capacity | DB/storage saturation |
| Dependency | Queue unavailable |
| Data Integrity | Credit mismatch |
| Execution | Job failure |
| Lab | Agent offline |
| Robot | Resource fault |
| Safety | E-stop/interlock |
| Security | Unauthorized access anomaly |
| Deployment | Rollout failure |
| Backup | Backup failure |
| DR | Restore failure |
| Cost | Budget anomaly |
| Synthetic | Customer journey failure |
| Observability | Monitoring pipeline failure |

## 10. Availability Alerts

Availability alerts detect inability to perform a required function.

Examples:

- API unavailable;
- authentication unavailable;
- WebSocket unavailable;
- object storage unavailable;
- database unavailable;
- queue unavailable;
- Lab Agent connectivity unavailable.

Availability alerts generally have higher priority than isolated performance
alerts.

## 11. Performance Alerts

Performance alerts detect significant degradation.

Examples:

- API P95 above target;
- database query latency;
- queue processing latency;
- artifact upload latency;
- Job allocation latency;
- result processing latency.

Performance alerts should normally use sustained windows to avoid transient
noise.

## 12. Capacity Alerts

Capacity alerts detect approaching exhaustion.

Examples:

- DB storage;
- DB connections;
- CPU;
- memory;
- queue backlog;
- object storage;
- telemetry ingestion;
- network bandwidth.

Capacity alerts should normally warn before service impact occurs.

## 13. Data Integrity Alerts

Data integrity alerts detect mismatches in authoritative state.

Examples:

- credit ledger mismatch;
- booking/resource mismatch;
- Job/Run mismatch;
- PostgreSQL/object-storage mismatch;
- Lab resource state mismatch.

Data integrity alerts are normally high severity because silent corruption can
be worse than temporary unavailability.

## 14. Execution Alerts

Execution alerts cover:

- Job start failures;
- Job timeout;
- Run failure;
- deployment failure;
- repeated execution failure;
- resource allocation failure.

Execution alerts should distinguish one customer failure from systemic failure.

## 15. Lab Alerts

Lab alerts cover:

- Agent offline;
- heartbeat timeout;
- Agent authentication failure;
- capability mismatch;
- resource unavailable;
- lab connectivity degradation.

## 16. Robot Alerts

Robot alerts cover:

- robot offline;
- runtime unhealthy;
- temperature threshold;
- battery threshold;
- sensor failure;
- actuator failure;
- network failure;
- resource fault.

Robot alerts must remain distinct from cloud service alerts.

## 17. Safety Alerts

Safety alerts cover:

- E-stop active;
- interlock active;
- safety state unknown;
- safety controller fault;
- motion inhibited unexpectedly.

Safety alerts require local operational response.

Cloud alerting must never attempt to replace physical E-stop functionality.

## 18. Security Alerts

Security alerts include:

- authentication anomaly;
- repeated authorization failure;
- privileged access anomaly;
- secret access anomaly;
- suspicious traffic;
- WAF attack pattern;
- critical vulnerability;
- certificate failure.

Security routing must include the Security owner.

# 19. Alert Severity Model

The baseline severity model is:

| Severity | Name | Meaning |
|---|---|---|
| SEV0 | Emergency | Immediate safety or catastrophic systemic condition |
| SEV1 | Critical | Major customer or production outage |
| SEV2 | High | Significant degradation or important subsystem failure |
| SEV3 | Medium | Limited operational impact |
| SEV4 | Low | Informational or non-urgent condition |

Severity must describe impact, not merely the underlying metric value.

## 20. SEV0

SEV0 is reserved for conditions requiring immediate coordinated action.

Examples:

- physical safety emergency;
- widespread unsafe robot state;
- catastrophic data integrity event;
- systemic security compromise.

SEV0 response is immediate.

## 21. SEV1

SEV1 indicates major customer impact.

Examples:

- complete API outage;
- widespread inability to execute Jobs;
- database unavailable;
- complete production control-plane outage;
- widespread tenant isolation failure.

Target response is immediate on-call engagement.

## 22. SEV2

SEV2 indicates significant degradation.

Examples:

- sustained API latency degradation;
- queue backlog affecting Jobs;
- large Lab outage;
- significant artifact failures;
- result pipeline degradation.

Response is urgent but may not require the same coordination as SEV1.

## 23. SEV3

SEV3 indicates limited impact.

Examples:

- isolated Lab Agent;
- non-critical worker degradation;
- low-capacity warning;
- limited synthetic failure;
- non-critical operational drift.

Normal on-call response applies.

## 24. SEV4

SEV4 is informational.

Examples:

- certificate expiration warning;
- capacity trend;
- planned maintenance condition;
- low-risk configuration drift.

SEV4 should not page an engineer unless explicitly justified.

# 25. Severity Decision Model

Severity should consider:

    Customer Impact
          +
    Scope
          +
    Duration
          +
    Data Integrity
          +
    Security
          +
    Physical Safety
          +
    Recoverability
          =
    Alert Severity

The highest applicable safety or security consequence takes precedence over
simple service availability.

# 26. Alert Identity

Each alert should have a stable identity.

Recommended fields:

    alert_name
    alert_id
    category
    severity
    service
    environment
    region
    owner
    runbook
    dashboard
    source
    condition

## 27. Alert Labels

Recommended low-cardinality labels:

- environment;
- region;
- service;
- team;
- category;
- severity;
- alert name;
- platform where bounded.

Avoid unbounded labels such as:

- request ID;
- trace ID;
- user ID;
- artifact ID;
- Job ID;
- Run ID.

Those belong in alert annotations or linked traces/logs.

# 28. Alert Annotations

An alert should provide enough context to act.

Recommended annotations:

- summary;
- description;
- impact;
- start time;
- current value;
- threshold;
- dashboard URL;
- runbook reference;
- owner;
- escalation target;
- related service.

Example:

    {
        "alert": "APIHighErrorRate",
        "severity": "SEV1",
        "service": "raas-api",
        "environment": "production",
        "summary": "API error rate exceeds critical threshold",
        "owner": "backend-sre",
        "runbook": "RB-API-001",
        "dashboard": "Production Overview"
    }

# 29. Threshold Model

Thresholds should use one or more of:

- static threshold;
- rate threshold;
- ratio threshold;
- percentile threshold;
- burn-rate threshold;
- anomaly detection;
- absence detection;
- sustained duration.

Thresholds must be documented.

# 30. Static Thresholds

Static thresholds are appropriate for:

- disk capacity;
- certificate expiry;
- temperature;
- battery;
- connection count.

Example:

    DB Storage > 80% for 15 minutes

Thresholds must reflect actual operational capacity.

# 31. Ratio Thresholds

Ratios are preferred for service error rates.

Example:

    API 5xx Rate > 2% for 5 minutes

A ratio avoids false conclusions caused by low request volume.

# 32. Percentile Thresholds

Latency alerts should use:

- P95;
- P99;
- or equivalent percentile.

Example:

    API P95 > 500 ms for 10 minutes

Latency thresholds should reflect SLO definitions.

# 33. Burn-Rate Alerts

SLO burn rate is preferred for major customer-facing services.

Conceptually:

    Error Budget Consumption Rate
            /
    Allowed Error Rate
            =
    Burn Rate

Fast burn indicates urgent customer impact.

# 34. Absence Alerts

Absence alerts detect missing expected signals.

Examples:

- no Agent heartbeat;
- no worker heartbeat;
- no telemetry;
- no synthetic result;
- no backup completion.

Absence thresholds must account for expected intervals.

# 35. Sustained Conditions

Transient failures should normally not page.

Example:

    Error > threshold for 1 minute
        -> warning / observation

    Error > threshold for 10 minutes
        -> actionable alert

Duration depends on the failure mode.

# 36. Multi-Window Alerting

Critical SLO alerts should preferably use multiple windows.

Example:

    Short window:
    rapid severe degradation

    Long window:
    sustained customer impact

This reduces noise while detecting both sudden and persistent failures.

# 37. Alert Routing

Routing follows:

    Alert
      |
    Severity
      |
    Category
      |
    Service Owner
      |
    On-Call
      |
    Escalation

Routing must be deterministic.

## 38. Primary Routing

| Domain | Primary Route |
|---|---|
| API | Backend/SRE |
| Workers | Backend/SRE |
| DB | DBA/SRE |
| Queue | SRE |
| Storage | Cloud/SRE |
| Security | Security |
| Booking | Backend |
| Credits | Backend/Finance |
| Jobs/Runs | Backend |
| Lab Agent | Lab Integration |
| Robots | Lab Operations |
| Safety | Local Safety/Lab |
| Deployment | Release/SRE |
| Cost | Cloud/SRE |

# 39. Secondary Routing

Every SEV0–SEV2 alert should have a secondary escalation path.

Example:

    Primary On-Call
          |
      Timeout
          |
    Secondary On-Call
          |
      Timeout
          |
    Incident Lead

# 40. On-Call Model

On-call must provide:

- primary responder;
- secondary responder;
- escalation owner;
- incident commander availability for SEV0/SEV1.

On-call ownership must be explicit and current.

# 41. On-Call Requirements

The on-call responder must have access to:

- alert system;
- dashboards;
- logs;
- traces;
- runbooks;
- deployment history;
- incident history;
- required operational credentials.

Access must follow least privilege.

# 42. Acknowledgement

Acknowledgement means:

> A responder has accepted responsibility for investigating the alert.

Acknowledgement does not mean:

> The incident is resolved.

The alert remains active until recovery conditions are satisfied.

# 43. Response Targets

Initial operational targets:

| Severity | Initial Acknowledgement |
|---|---|
| SEV0 | Immediate |
| SEV1 | ≤ 5 minutes |
| SEV2 | ≤ 15 minutes |
| SEV3 | ≤ 1 hour |
| SEV4 | No paging |

Final targets may be refined by the operational team.

# 44. Escalation Timers

Example model:

    SEV1
      |
    5 min
      |
    Primary On-Call
      |
    10 min
      |
    Secondary
      |
    15 min
      |
    Incident Lead

Exact timers should be configurable.

# 45. Escalation Conditions

Escalate when:

- alert is not acknowledged;
- mitigation is not progressing;
- impact is increasing;
- SLO burn accelerates;
- data integrity is involved;
- security impact is suspected;
- physical safety is involved.

# 46. Alert Grouping

Related alerts should be grouped.

Example:

    PostgreSQL Outage
        |
        +--> API Errors
        +--> Worker Errors
        +--> Job Failures
        +--> Synthetic Failures

The database outage is the likely primary incident.

Grouping prevents alert storms.

# 47. Alert Deduplication

Repeated evaluations of the same condition must produce one logical alert.

Deduplication key should use bounded identity such as:

    environment
    service
    alert_name
    bounded resource

Do not include request IDs.

# 48. Dependency Suppression

Dependent symptoms may be suppressed when a known root cause exists.

Example:

    PostgreSQL unavailable
          |
          +--> suppress repetitive API dependency alerts
          +--> retain customer-impact summary

Suppression must not hide independent failures.

# 49. Alert Correlation

Alerts should correlate through:

- deployment ID;
- service;
- trace;
- resource;
- lab;
- Job;
- Run;
- incident.

Correlation helps distinguish:

- one root cause;
- multiple unrelated failures;
- deployment regression.

# 50. Alert Storm Protection

The alerting system must protect operators from alert storms.

Controls include:

- grouping;
- deduplication;
- rate limiting;
- dependency correlation;
- suppression;
- maintenance windows;
- incident-based alert aggregation.

# 51. Noise Reduction

Noise reduction techniques:

1. Use SLO-based alerts.
2. Require sustained conditions.
3. Group related alerts.
4. Deduplicate.
5. Suppress dependent symptoms.
6. Use meaningful thresholds.
7. Review false positives.
8. Remove stale alerts.
9. Avoid paging on informational events.
10. Separate warning from paging alerts.

# 52. Alert Quality Metric

Alert quality should be measured.

Metrics include:

- pages per day;
- pages per service;
- false-positive rate;
- alert acknowledgement time;
- alert resolution time;
- repeat alert rate;
- unowned alert count;
- alerts without runbooks.

# 53. False Positive Definition

A false positive occurs when an alert fires without a condition requiring the
defined response.

False positives must be tracked.

Repeated false positives should trigger alert redesign.

# 54. Alert Fatigue

Alert fatigue occurs when responders receive too many low-value alerts.

Symptoms include:

- delayed acknowledgement;
- ignored pages;
- repeated manual suppression;
- high false-positive rate.

Alert fatigue is treated as an operational reliability issue.

# 55. Maintenance Windows

Planned maintenance may suppress selected alerts.

Maintenance must specify:

- scope;
- owner;
- start;
- end;
- affected alerts;
- reason.

Maintenance suppression must be time-bounded.

# 56. Deployment Windows

Deployment-related alerts may be grouped with the deployment event.

However:

- safety alerts remain active;
- security alerts remain active;
- data-integrity alerts remain active.

Deployment context should be visible in alerts.

# 57. Alert-to-Runbook Mapping

Every actionable alert must map to a runbook.

Minimum mapping:

| Alert Domain | Runbook |
|---|---|
| API outage | `RB-API-001` |
| API latency | `RB-API-002` |
| WebSocket outage | `RB-WS-001` |
| DB outage | `RB-DB-001` |
| DB saturation | `RB-DB-002` |
| Queue backlog | `RB-QUEUE-001` |
| Worker failure | `RB-WORKER-001` |
| Scheduler failure | `RB-SCHED-001` |
| Reconciliation failure | `RB-RECON-001` |
| Storage failure | `RB-STORAGE-001` |
| Lab Agent offline | `RB-LAB-001` |
| Robot fault | `RB-ROBOT-001` |
| Safety alert | `RB-SAFETY-001` |
| Deployment failure | `RB-DEPLOY-001` |
| Backup failure | `RB-BACKUP-001` |
| Security incident | `RB-SEC-001` |

# 58. Runbook Requirements

Every runbook must include:

- purpose;
- alert meaning;
- impact;
- severity;
- immediate checks;
- dashboard;
- logs;
- traces;
- mitigation;
- rollback if applicable;
- escalation;
- recovery;
- validation;
- post-incident action.

# 59. Runbook Link Integrity

Runbook links must be tested periodically.

Broken runbook references are treated as monitoring defects.

# 60. Alert Threshold Ownership

Thresholds must have an owner.

Threshold changes must be reviewed.

Threshold rationale should be documented.

# 61. Adaptive Thresholds

Adaptive/anomaly thresholds may be used where:

- traffic is highly variable;
- static thresholds produce noise;
- seasonal patterns exist.

Critical safety conditions should retain deterministic thresholds.

# 62. Safety Alert Exception

Safety alerts must use explicit platform-defined thresholds.

Do not replace:

    E-Stop Active

with:

    General anomaly detected

Safety conditions require deterministic visibility.

# 63. Lab Agent Alerts

Baseline alerts:

| Alert | Condition | Severity |
|---|---|---|
| AgentOffline | Heartbeat absent | SEV2/SEV3 |
| AgentAuthFailure | Repeated auth failure | SEV2 |
| AgentUnhealthy | Health degraded | SEV2/SEV3 |
| AgentVersionUnsupported | Unsupported version | SEV2 |
| AgentCapabilityMismatch | Required capability missing | SEV2 |
| AgentHeartbeatTimeout | Sustained timeout | SEV2 |

Severity depends on customer/resource impact.

# 64. Robot Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| RobotOffline | Resource unexpectedly offline | SEV2 |
| RobotTemperatureHigh | Above safe operating threshold | SEV1/SEV2 |
| RobotBatteryCritical | Below operating threshold | SEV2 |
| RobotRuntimeUnhealthy | Runtime unhealthy | SEV2 |
| RobotSafetyUnknown | Safety state unknown | SEV0/SEV1 |
| RobotEstop | E-stop active | SEV0/SEV1 |
| RobotFault | Resource fault | SEV1/SEV2 |

Final severity depends on the physical operating context.

# 65. API Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| APIUnavailable | Availability failure | SEV1 |
| APIHighErrorRate | Sustained elevated errors | SEV1/SEV2 |
| APIHighLatency | Sustained SLO breach | SEV2 |
| APICapacityPressure | Resource saturation | SEV2/SEV3 |
| APIAuthFailureSpike | Authentication anomaly | SEV2 |

# 66. Database Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| DBUnavailable | Database unavailable | SEV1 |
| DBConnectionSaturation | Connections near limit | SEV1/SEV2 |
| DBStorageHigh | Storage pressure | SEV2 |
| DBDeadlockSpike | Sustained deadlocks | SEV2 |
| DBReplicationLag | Excessive lag | SEV2 |
| DBBackupFailure | Backup failure | SEV2 |
| DBRestoreTestFailure | Restore validation failure | SEV1/SEV2 |

# 67. Queue Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| QueueUnavailable | Queue unavailable | SEV1/SEV2 |
| QueueBacklogHigh | Sustained backlog | SEV2 |
| QueueMessageAgeHigh | Oldest message too old | SEV2 |
| QueueDeadLetterGrowth | DLQ growth | SEV2 |
| QueueConsumerMissing | No active consumers | SEV1/SEV2 |

# 68. Job Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| JobStartFailureRate | Elevated failures | SEV2 |
| JobTimeoutSpike | Elevated timeouts | SEV2 |
| JobAllocationFailure | Resource allocation failure | SEV2 |
| JobStuck | State exceeds limit | SEV2 |
| JobSystemicFailure | Broad execution failure | SEV1 |

# 69. Credit Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| CreditLedgerMismatch | Reconciliation mismatch | SEV1 |
| CreditConsumptionFailure | Sustained failure | SEV2 |
| CreditRefundFailure | Refund failure | SEV2 |
| NegativeBalanceAttempt | Invalid financial state | SEV2 |
| CreditReconciliationBacklog | Unresolved mismatch | SEV1/SEV2 |

# 70. Booking Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| BookingConflictSpike | Unexpected conflicts | SEV2 |
| BookingAllocationFailure | Allocation failure | SEV2 |
| BookingStateMismatch | DB/resource mismatch | SEV1/SEV2 |
| BookingServiceUnavailable | Service outage | SEV1 |

# 71. Reconciliation Alerts

Baseline:

| Alert | Condition | Severity |
|---|---|---|
| ReconciliationStopped | No successful cycle | SEV2 |
| ReconciliationBacklog | Growing backlog | SEV2 |
| CriticalMismatch | Critical state mismatch | SEV1 |
| ReconciliationErrorRate | Sustained failures | SEV2 |

# 72. Security Alerts

Security alerts should include:

- repeated failed authentication;
- privilege escalation;
- unexpected admin access;
- secret access anomaly;
- WAF critical event;
- exposed service;
- critical vulnerability.

Security routing should bypass ordinary low-priority application queues when
required.

# 73. Backup Alerts

Alert when:

- scheduled backup fails;
- backup is older than policy;
- backup storage is unavailable;
- PITR is not healthy;
- restore test fails.

# 74. Certificate Alerts

Suggested thresholds:

    30 days -> warning
    14 days -> high
     7 days -> critical

Exact thresholds may depend on automated renewal.

# 75. Cost Alerts

Cost alerts include:

- budget threshold;
- abnormal daily spend;
- unexpected resource creation;
- storage growth;
- telemetry cost spike.

Cost alerts normally route to Cloud/SRE rather than customer on-call.

# 76. Synthetic Alerts

Synthetic alerts should identify:

- test;
- failed step;
- expected behavior;
- actual behavior;
- region;
- environment.

Repeated failure should route according to the impacted customer journey.

# 77. Alert Recovery

An alert resolves only when the underlying condition returns to normal.

For stateful conditions, resolution should also verify:

- no backlog;
- no stale resources;
- no unreconciled state;
- customer path restored.

# 78. Auto-Resolution

Auto-resolution is acceptable when:

- recovery condition is objective;
- alert state can be reliably evaluated.

Auto-resolution does not eliminate post-incident review for SEV0/SEV1 events.

# 79. Incident Creation

SEV0 and SEV1 alerts should automatically create or attach to an incident.

SEV2 may create incidents depending on duration and impact.

SEV3/SEV4 generally remain operational alerts.

# 80. Incident Correlation

Multiple alerts should attach to one incident when they share:

- service;
- deployment;
- resource;
- trace;
- known dependency;
- incident identifier.

# 81. Incident Commander

For major incidents, an Incident Commander should coordinate:

- technical response;
- communication;
- escalation;
- decision making;
- recovery;
- evidence collection.

The Incident Commander should not necessarily perform all technical work.

# 82. Communication

SEV0/SEV1 incidents should have defined communication paths for:

- engineering;
- operations;
- security;
- management;
- customer support where appropriate.

Customer communication must not expose sensitive internal details.

# 83. Post-Incident Alert Review

After major incidents, review:

- Did the alert fire?
- Did it fire early enough?
- Was severity correct?
- Was routing correct?
- Was the runbook useful?
- Was escalation timely?
- Were dependent alerts noisy?
- Was any critical signal missing?

# 84. Alert Review Cadence

Recommended cadence:

| Review | Frequency |
|---|---|
| Critical alert review | Weekly |
| Alert quality review | Monthly |
| Threshold review | Monthly |
| SLO review | Monthly |
| Runbook review | Quarterly |
| Ownership review | Monthly |
| Full alert architecture review | Quarterly |

Major incidents trigger an immediate review regardless of cadence.

# 85. Alert Change Management

Changes to alert rules require:

- reason;
- owner;
- test evidence;
- expected impact;
- severity assessment.

Critical alert changes should receive peer review.

# 86. Alert Testing

Alert rules must be tested using:

- synthetic conditions;
- test environments;
- controlled production tests where safe.

Do not intentionally trigger physical safety conditions solely to test cloud
alerting.

# 87. Alert Rule CI

Alert definitions should be version-controlled.

CI should validate:

- syntax;
- duplicate names;
- missing owners;
- missing runbooks;
- invalid severity;
- invalid routing;
- missing thresholds;
- unsupported labels.

# 88. Alert Configuration as Code

Where practical:

    Alert Rule
       |
    Git
       |
    Review
       |
    CI
       |
    Staging
       |
    Production

Manual production-only alert rules should be minimized.

# 89. Alert Ownership Metadata

Every alert must declare:

    owner_team
    escalation_team
    severity
    runbook_id
    dashboard_id

Alerts missing these fields should fail validation.

# 90. Alert Dependency Graph

Important dependency relationships should be documented.

Example:

    PostgreSQL
       |
       +--> API
       +--> Workers
       +--> Scheduler
       +--> Reconciliation
       |
       +--> Booking
       +--> Credits
       +--> Jobs

This supports intelligent alert grouping.

# 91. Root Cause Preference

When possible, alert on root cause rather than downstream symptoms.

For example:

    DB unavailable

is preferable to paging separately for:

    API failure
    Worker failure
    Scheduler failure
    Booking failure

However, customer-impact information must remain visible.

# 92. Alert Correlation With Deployment

Every production deployment should emit a deployment event.

Alerts occurring immediately after deployment should be correlated with:

- release version;
- deployment ID;
- candidate version;
- rollout percentage.

# 93. Alert Correlation With Lab Operations

Lab alerts should include:

- lab ID;
- Agent ID;
- resource ID;
- platform;
- current Job/Run if any.

This allows responders to distinguish:

- one robot fault;
- one Lab outage;
- platform-wide resource failure.

# 94. Alert Correlation With Financial Operations

Credit alerts should include:

- organization scope where authorized;
- platform;
- credit plan;
- ledger operation;
- reconciliation class.

Never include payment secrets or sensitive financial credentials.

# 95. Alert Suppression Rules

Suppression must be:

- explicit;
- scoped;
- time-limited;
- audited.

Never suppress:

- physical safety;
- critical security;
- critical data integrity

without explicit incident authority.

# 96. Alert Escalation Matrix

| Severity | Primary | Secondary | Incident |
|---|---|---|---|
| SEV0 | Immediate safety/on-call | Executive/incident lead | Immediate |
| SEV1 | Primary on-call | Secondary/SRE | Required |
| SEV2 | Service on-call | Team lead | Conditional |
| SEV3 | Team queue | Team lead | No |
| SEV4 | Informational | None | No |

# 97. Alert-to-Runbook Operating Flow

    Alert Fires
        |
    Severity Identified
        |
    Route
        |
    Acknowledge
        |
    Open Runbook
        |
    Verify Impact
        |
    Identify Root Cause
        |
    Mitigate
        |
    Validate
        |
    Resolve
        |
    Review

# 98. Monitoring and Alerting Boundary

Monitoring answers:

> What is happening?

Alerting answers:

> What requires attention?

Incident response answers:

> What should we do?

Runbooks answer:

> How do we do it safely?

These responsibilities must remain distinct.

# 99. Alert Data Retention

Alert history should retain:

- alert identity;
- severity;
- start time;
- resolution time;
- acknowledgement;
- owner;
- incident ID;
- condition;
- annotations;
- routing;
- escalation.

Retention must support operational analysis and applicable compliance.

# 100. Alert Auditability

Production must be able to determine:

- who changed an alert;
- what changed;
- when;
- why;
- approval;
- resulting behavior.

# 101. On-Call Health

The alerting program must monitor:

- pages per engineer;
- overnight page volume;
- acknowledgement latency;
- escalation rate;
- repeated incidents;
- unowned alerts.

Excessive on-call load should trigger operational improvement.

# 102. Alert Budget

Teams should maintain a practical alert budget.

A service producing excessive pages must be reviewed.

The goal is:

> fewer, higher-confidence pages with clearer remediation.

# 103. Alert Naming

Alert names should be:

- stable;
- descriptive;
- machine-friendly;
- domain-oriented.

Examples:

    APIUnavailable
    APIHighErrorRate
    DBUnavailable
    QueueMessageAgeHigh
    AgentHeartbeatTimeout
    CreditLedgerMismatch

# 104. Alert Documentation

Each alert should document:

- condition;
- rationale;
- threshold;
- severity;
- owner;
- runbook;
- dashboard;
- escalation;
- expected false-positive behavior.

# 105. Phase Mapping

| Phase | Alerting Objective |
|---|---|
| Phase 0 | Define alert model and ownership |
| Phase 1 | Alert Control Plane failures |
| Phase 2 | Alert artifact/resource failures |
| Phase 3 | Alert asynchronous execution failures |
| Phase 4 | Alert commercial/data integrity failures |
| Phase 5 | Alert remote execution failures |
| Phase 6 | Alert Lab/robot/safety conditions |
| Phase 7 | Alert realtime/result degradation |
| Phase 8 | Mature SLO-based production alerting |

# 106. Phase 0

Define:

- taxonomy;
- severity;
- routing;
- ownership;
- runbook conventions;
- threshold model.

Acceptance:

- [ ] alert taxonomy approved;
- [ ] severity model approved;
- [ ] ownership model approved.

# 107. Phase 1

Implement alerts for:

- API;
- authentication;
- database;
- storage;
- queue;
- deployment.

Acceptance:

- [ ] critical alerts page correctly;
- [ ] runbooks exist;
- [ ] routing is tested.

# 108. Phase 2

Add:

- artifact failures;
- resource availability;
- platform failures;
- storage integrity.

Acceptance:

- [ ] resource alerts are operational;
- [ ] artifact alerts are operational.

# 109. Phase 3

Add:

- queue backlog;
- worker failures;
- scheduler;
- reconciliation;
- Job failures.

Acceptance:

- [ ] async failure paths alert;
- [ ] alert storms are controlled.

# 110. Phase 4

Add:

- booking;
- credits;
- billing;
- financial reconciliation.

Acceptance:

- [ ] credit mismatch pages;
- [ ] booking integrity alerts;
- [ ] commercial alerts have escalation.

# 111. Phase 5

Add:

- Job/Run execution;
- deployment failures;
- execution timeouts.

Acceptance:

- [ ] systemic execution failure alerts;
- [ ] Run failure monitoring works.

# 112. Phase 6

Add:

- Lab Agents;
- labs;
- robot resources;
- safety conditions.

Acceptance:

- [ ] Agent heartbeat alerts work;
- [ ] resource faults alert;
- [ ] safety alerts route correctly;
- [ ] local safety response is documented.

# 113. Phase 7

Add:

- WebSocket;
- telemetry;
- video;
- results;
- synthetic execution.

Acceptance:

- [ ] realtime failures alert;
- [ ] result failures alert;
- [ ] synthetic critical journeys alert.

# 114. Phase 8

Complete:

- SLO burn-rate alerts;
- alert quality;
- escalation;
- cost alerts;
- security alerts;
- DR alerts;
- continuous review.

Acceptance:

- [ ] production alerting readiness review passes.

# 115. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Alert fatigue | High | Noise reduction/review |
| Missing alert | Critical | SLO and journey coverage |
| Wrong severity | High | Severity review |
| Wrong routing | High | Ownership validation |
| Missing runbook | High | CI gate |
| Alert storm | High | Grouping/deduplication |
| False positives | Medium | Sustained thresholds |
| Hidden safety alert | Critical | Safety suppression prohibition |
| Stale ownership | High | Monthly ownership review |
| Broken runbook | High | Link validation |
| Threshold drift | Medium | Monthly review |
| Monitoring outage | Critical | Monitor observability |
| High cardinality | Medium | Label governance |
| Sensitive telemetry | Critical | Redaction/access control |
| Deployment noise | Medium | Deployment correlation |
| Lab noise | Medium | Resource-aware grouping |
| Security alert overload | High | Severity/routing discipline |
| Cost alert delay | Medium | Daily anomaly checks |

# 116. Open Questions

1. Final alert-management platform.
2. Final incident-management platform.
3. Final paging provider.
4. Final on-call scheduling mechanism.
5. Final escalation timers.
6. Final severity definitions and response targets.
7. Final SLO burn-rate thresholds.
8. Final alert suppression implementation.
9. Final maintenance-window mechanism.
10. Final alert configuration-as-code format.
11. Final alert retention.
12. Final compliance retention.
13. Final synthetic monitoring provider.
14. Final Lab Agent heartbeat interval.
15. Final robot safety alert thresholds.
16. Final temperature thresholds per platform.
17. Final battery thresholds per platform.
18. Final cost-alert thresholds.
19. Final security escalation process.
20. Final incident commander policy.
21. Final customer communication process.
22. Final alert review ownership.

# 117. Full Acceptance Criteria

## Alert Architecture

- [ ] Alerting architecture is documented.
- [ ] Alert sources are defined.
- [ ] Alert lifecycle is defined.
- [ ] Alert taxonomy is defined.
- [ ] Alert identity is defined.
- [ ] Alert ownership is defined.
- [ ] Routing is defined.
- [ ] Escalation is defined.

## Severity

- [ ] SEV0 is defined.
- [ ] SEV1 is defined.
- [ ] SEV2 is defined.
- [ ] SEV3 is defined.
- [ ] SEV4 is defined.
- [ ] Severity is impact-based.
- [ ] Safety can override ordinary severity.
- [ ] Security severity is considered.
- [ ] Data integrity severity is considered.

## Thresholds

- [ ] Static thresholds are supported.
- [ ] Ratio thresholds are supported.
- [ ] Percentile thresholds are supported.
- [ ] Burn-rate thresholds are supported.
- [ ] Absence detection is supported.
- [ ] Sustained-duration conditions are supported.
- [ ] Threshold ownership is defined.
- [ ] Threshold changes are reviewed.

## Routing

- [ ] Every alert has a primary route.
- [ ] SEV0–SEV2 have escalation.
- [ ] Security alerts route to Security.
- [ ] Lab alerts route to Lab Integration.
- [ ] Robot alerts route to Lab Operations.
- [ ] Safety alerts route to local safety ownership.
- [ ] Financial alerts route to the correct owner.
- [ ] Deployment alerts route to Release/SRE.

## On-Call

- [ ] Primary on-call exists.
- [ ] Secondary on-call exists.
- [ ] Escalation owner exists.
- [ ] SEV0/SEV1 incident leadership exists.
- [ ] On-call access is provisioned.
- [ ] On-call response targets are defined.
- [ ] On-call load is monitored.

## Noise Reduction

- [ ] Deduplication is implemented.
- [ ] Grouping is implemented.
- [ ] Dependency suppression is implemented.
- [ ] Alert storms are controlled.
- [ ] Maintenance suppression is time-bounded.
- [ ] Safety alerts are protected.
- [ ] False positives are measured.
- [ ] Alert fatigue is reviewed.

## Runbooks

- [ ] Every actionable alert has a runbook.
- [ ] Runbooks contain remediation.
- [ ] Runbooks contain validation.
- [ ] Runbooks contain escalation.
- [ ] Runbook links are tested.
- [ ] Runbooks have owners.
- [ ] Runbooks are periodically reviewed.

## Services

- [ ] API alerts exist.
- [ ] WebSocket alerts exist.
- [ ] Worker alerts exist.
- [ ] Scheduler alerts exist.
- [ ] Reconciliation alerts exist.
- [ ] Authentication alerts exist.
- [ ] Deployment alerts exist.

## Data Services

- [ ] PostgreSQL alerts exist.
- [ ] Queue alerts exist.
- [ ] Object storage alerts exist.
- [ ] Backup alerts exist.
- [ ] Restore alerts exist.
- [ ] Capacity alerts exist.

## Business Services

- [ ] Booking alerts exist.
- [ ] Credit alerts exist.
- [ ] Job alerts exist.
- [ ] Run alerts exist.
- [ ] Result alerts exist.
- [ ] Artifact alerts exist.
- [ ] Financial reconciliation alerts exist.

## Lab and Robot

- [ ] Lab Agent alerts exist.
- [ ] Heartbeat alerts exist.
- [ ] Lab availability alerts exist.
- [ ] Resource alerts exist.
- [ ] Robot health alerts exist.
- [ ] Safety alerts exist.
- [ ] Telemetry alerts exist.
- [ ] Video alerts exist where applicable.

## Security

- [ ] Authentication anomalies alert.
- [ ] Authorization anomalies alert.
- [ ] Privileged access is monitored.
- [ ] Secret access is monitored.
- [ ] Security incidents route correctly.
- [ ] Sensitive information is excluded from alerts.

## Deployment

- [ ] Deployment events correlate with alerts.
- [ ] Canary alerts exist.
- [ ] Blue/green alerts exist where used.
- [ ] Rollback alerts exist.
- [ ] Version distribution is visible.
- [ ] Release regressions are detectable.

## Review

- [ ] Critical alerts are reviewed weekly.
- [ ] Alert quality is reviewed monthly.
- [ ] Thresholds are reviewed monthly.
- [ ] Runbooks are reviewed quarterly.
- [ ] Ownership is reviewed monthly.
- [ ] Major incidents trigger immediate alert review.

## Alerting System Health

- [ ] Alert evaluation is monitored.
- [ ] Alert delivery is monitored.
- [ ] Alert routing is monitored.
- [ ] Paging failures are detected.
- [ ] Monitoring backend failure is detected.
- [ ] Observability degradation is itself alertable.

## Production Readiness

- [ ] All critical alerts have owners.
- [ ] All critical alerts have runbooks.
- [ ] All critical alerts have tested routes.
- [ ] Escalation has been tested.
- [ ] Alert storm behavior has been tested.
- [ ] Synthetic alerts have been tested.
- [ ] Safety alerts have been reviewed.
- [ ] Production alerting readiness review is approved.

# 118. Final Alerting Invariants

Kritva RaaS alerting must preserve these invariants:

1. Every actionable alert has an owner.
2. Every actionable alert has a runbook.
3. Every alert has a severity.
4. Every critical alert has escalation.
5. Customer impact determines severity.
6. SLOs drive customer-facing alerts.
7. Infrastructure alerts complement, not replace, SLO alerts.
8. Alert noise is actively controlled.
9. Related alerts are grouped.
10. Duplicate alerts are deduplicated.
11. Root causes are preferred over repetitive symptoms.
12. Safety alerts are never casually suppressed.
13. Security alerts receive appropriate routing.
14. Financial integrity alerts receive high priority.
15. Lab Agent failures are observable.
16. Robot health is observable.
17. Physical safety remains local.
18. WebSocket failure does not imply durable state loss.
19. PostgreSQL remains authoritative.
20. Reconciliation failures are alertable.
21. Alert configuration is reviewable.
22. Alert ownership is periodically reviewed.
23. Runbooks are periodically validated.
24. On-call load is measurable.
25. Monitoring and alerting are themselves monitored.
26. Sensitive customer information is protected.
27. Production deployments are correlated with alerts.
28. Alert history is auditable.
29. Major incidents improve alert definitions.
30. Alerting exists to enable reliable action, not merely generate notifications.

# 119. Final Alerting Operating Model

The complete operating loop is:

    Detect
      |
    Classify
      |
    Deduplicate
      |
    Group
      |
    Route
      |
    Page / Notify
      |
    Acknowledge
      |
    Runbook
      |
    Investigate
      |
    Mitigate
      |
    Validate
      |
    Resolve
      |
    Review
      |
    Improve

The governing principle is:

> **Kritva RaaS alerting must produce fewer, higher-confidence and actionable
> signals. Every important production condition must have a defined severity,
> owner, route, escalation path and runbook. Alerting must protect operators
> from noise while ensuring that customer-impacting failures, financial
> integrity problems, security incidents, Lab failures, robot faults and
> physical safety conditions are surfaced quickly and handled by the correct
> authority.**
