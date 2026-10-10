# Kritva RaaS Production Incident Response

## 1. Document Control

| Item | Value |
|---|---|
| Document | Production Incident Response |
| Path | `docs/cloud/operations/INCIDENT_RESPONSE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Scope | Production incidents and operational response |
| Primary Environment | Production |
| Incident Model | Severity-based, role-driven, auditable |
| Safety Authority | Local Lab/Robot safety system |
| Cloud Authority | RaaS Control Plane |
| State Authority | PostgreSQL |
| Realtime Authority | WebSocket for delivery; REST/durable state for authority |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the production incident-response framework for Kritva
RaaS.

The objective is to provide a predictable method to:

- detect incidents;
- assess impact;
- classify severity;
- establish ownership;
- protect customers;
- protect physical robots;
- contain failures;
- restore service;
- communicate accurately;
- preserve evidence;
- reconcile distributed state;
- learn from failures.

Incident response must remain separate from ordinary operational support.

An incident is an event that materially affects:

- availability;
- reliability;
- security;
- data integrity;
- financial integrity;
- execution;
- laboratory operation;
- physical safety.

## 3. Scope

This document covers:

- production incidents;
- customer-impacting incidents;
- infrastructure incidents;
- application incidents;
- database incidents;
- queue incidents;
- security incidents;
- financial integrity incidents;
- Lab incidents;
- robot incidents;
- safety incidents;
- disaster incidents;
- deployment incidents;
- observability incidents;
- incident communication;
- incident command;
- postmortems;
- corrective actions.

## 4. Non-Goals

This document does not define:

- detailed robot safety-controller implementation;
- physical E-stop circuitry;
- application source-code design;
- complete cloud architecture;
- detailed backup implementation;
- detailed alert-rule syntax;
- customer contractual SLA language;
- final cloud-provider-specific incident tooling.

# 5. Incident Management Principles

Incident response follows these principles:

1. Safety takes precedence over availability.
2. Stabilize before optimizing.
3. Establish one incident commander.
4. Assign clear technical ownership.
5. Separate facts from hypotheses.
6. Prefer reversible actions.
7. Preserve evidence.
8. Protect customer data.
9. Preserve tenant isolation.
10. Protect financial integrity.
11. Never blindly restart physical robots.
12. Use PostgreSQL as authoritative business state.
13. Use reconciliation after uncertain distributed operations.
14. Use runbooks for repeatable operations.
15. Communicate early and accurately.
16. Do not wait for complete root-cause certainty before mitigating.
17. Incident closure requires validation.
18. Major incidents require postmortems.
19. Corrective actions require owners and deadlines.
20. Incident response must continuously improve.

# 6. Incident Definition

An incident is an operational event requiring coordinated action because it
causes or threatens material impact.

Examples:

- API outage;
- database outage;
- widespread Job failure;
- credit ledger inconsistency;
- security compromise;
- Lab outage;
- robot safety condition;
- regional outage;
- major deployment failure.

## 7. Event Versus Incident

An event is an observable occurrence.

An alert is an operational signal requiring evaluation.

An incident is a confirmed condition requiring coordinated response.

The progression is:

    Event
      |
    Alert
      |
    Triage
      |
    Incident?
      |
    Yes
      |
    Incident Command

Not every alert becomes an incident.

# 8. Incident Severity

| Severity | Name | Definition |
|---|---|---|
| SEV0 | Emergency | Immediate physical safety or catastrophic security/data condition |
| SEV1 | Critical | Major production/customer outage |
| SEV2 | High | Significant degradation or important subsystem failure |
| SEV3 | Medium | Limited customer or operational impact |
| SEV4 | Low | Minor/non-urgent operational condition |

Severity is based on impact, not only technical complexity.

# 9. SEV0

SEV0 is reserved for exceptional conditions.

Examples:

- immediate physical safety emergency;
- widespread unsafe robot state;
- catastrophic security compromise;
- catastrophic data integrity event.

SEV0 requires immediate coordination.

Local safety procedures always take precedence over cloud incident procedures
for physical emergencies.

# 10. SEV1

SEV1 indicates major customer or production impact.

Examples:

- Control Plane unavailable;
- PostgreSQL unavailable;
- widespread inability to create or execute Jobs;
- widespread tenant access failure;
- widespread credit integrity problem;
- major security compromise.

SEV1 requires immediate on-call engagement and incident leadership.

# 11. SEV2

SEV2 indicates significant degradation.

Examples:

- elevated API error rate;
- sustained API latency;
- major Lab unavailable;
- queue backlog;
- widespread result processing failure;
- significant execution failure.

SEV2 requires urgent response.

# 12. SEV3

SEV3 indicates limited impact.

Examples:

- isolated Lab Agent;
- isolated robot unavailable;
- non-critical worker failure;
- capacity warning;
- limited synthetic failure.

SEV3 normally follows normal on-call escalation.

# 13. SEV4

SEV4 represents low-impact conditions.

Examples:

- non-critical warning;
- documentation/configuration issue;
- capacity trend;
- low-risk operational drift.

SEV4 generally does not require paging.

# 14. Severity Escalation

Severity may be increased when:

- scope expands;
- customer impact increases;
- duration increases;
- data integrity becomes uncertain;
- security implications emerge;
- physical safety becomes involved;
- recovery is not progressing.

Severity should be reduced only with evidence and incident-owner agreement.

# 15. Incident Roles

Major incidents use explicit roles.

| Role | Responsibility |
|---|---|
| Incident Commander | Overall incident authority |
| Technical Lead | Coordinates technical diagnosis |
| Communications Lead | Internal/customer communication |
| Scribe | Timeline and evidence |
| Service Owner | Domain-specific remediation |
| SRE/Cloud | Infrastructure/recovery |
| Security Lead | Security incidents |
| Lab Lead | Lab/robot incidents |
| Safety Lead | Physical safety |
| Customer Lead | Customer impact/support |

One person may hold multiple roles for small incidents.

SEV0/SEV1 incidents should separate Incident Commander and Technical Lead
where staffing permits.

# 16. Incident Commander

The Incident Commander:

- declares incident;
- sets severity;
- assigns roles;
- establishes priorities;
- approves major mitigation;
- coordinates teams;
- controls communication;
- manages escalation;
- decides when incident is stabilized;
- approves closure.

The Incident Commander should avoid becoming the primary debugger.

# 17. Technical Lead

The Technical Lead:

- builds the technical hypothesis;
- coordinates service owners;
- selects diagnostic actions;
- manages mitigation;
- validates recovery;
- reports technical status to the Incident Commander.

# 18. Communications Lead

The Communications Lead:

- prepares internal updates;
- prepares customer updates;
- maintains status information;
- avoids speculation;
- coordinates approved messaging.

# 19. Scribe

The Scribe records:

- timestamps;
- alerts;
- actions;
- decisions;
- observations;
- changes;
- communications;
- recovery milestones.

The incident timeline is evidence.

# 20. Security Lead

Security owns incidents involving:

- compromise;
- unauthorized access;
- credentials;
- secrets;
- data exposure;
- suspicious privileged activity.

Security may require isolation before normal availability recovery.

# 21. Lab Lead

The Lab Lead owns:

- Lab Agent;
- Lab connectivity;
- resource state;
- robot operational state;
- local operator coordination.

# 22. Safety Lead

The Safety Lead is responsible for physical safety decisions.

Cloud availability must never override the Safety Lead or local safety system.

# 23. Detection Sources

Incidents may be detected through:

- production alerts;
- dashboards;
- synthetic checks;
- customer reports;
- support;
- Lab operators;
- robot telemetry;
- security monitoring;
- database monitoring;
- deployment monitoring;
- reconciliation;
- backup/DR checks.

# 24. Detection Priority

Detection sources should be treated according to reliability.

Examples:

- safety-system indication;
- security event;
- customer-impacting SLO alert;
- synthetic failure;
- infrastructure alert;
- individual log anomaly.

A customer report can be the first valid signal even when monitoring is
healthy.

# 25. Detection-to-Resolution Workflow

The standard workflow is:

    Detect
      |
    Acknowledge
      |
    Triage
      |
    Classify
      |
    Declare Incident
      |
    Assign Roles
      |
    Assess Impact
      |
    Contain
      |
    Mitigate
      |
    Recover
      |
    Validate
      |
    Communicate Resolution
      |
    Close
      |
    Postmortem
      |
    Corrective Actions

# 26. Initial Triage

Initial triage should determine:

- Is the condition real?
- Is production affected?
- Is a customer affected?
- Is data integrity affected?
- Is security involved?
- Is physical safety involved?
- Is the issue expanding?
- Is there an active deployment?
- Is there an obvious dependency failure?

# 27. First Five Minutes

For SEV0/SEV1:

1. Acknowledge alert.
2. Establish incident channel.
3. Assign Incident Commander.
4. Confirm impact.
5. Stop harmful changes.
6. Check recent deployments.
7. Check major dependencies.
8. Check safety status if robots are involved.
9. Start timeline.
10. Communicate initial status.

# 28. Incident Declaration

Incident declaration should include:

    Incident ID
    Severity
    Start Time
    Detector
    Affected Service
    Initial Impact
    Incident Commander
    Technical Lead
    Current Action
    Next Update

# 29. Incident ID

Incident IDs must be unique and stable.

Recommended format:

    INC-YYYYMMDD-NNN

The ID must be referenced in:

- incident channel;
- timeline;
- alerts;
- changes;
- postmortem;
- corrective actions.

# 30. Incident Channel

SEV0–SEV2 incidents should use a dedicated incident communication channel.

The channel should contain:

- incident ID;
- severity;
- current status;
- participants;
- dashboards;
- runbooks;
- timeline.

# 31. Incident Status

Recommended states:

- DETECTED;
- TRIAGING;
- DECLARED;
- MITIGATING;
- RECOVERING;
- MONITORING;
- RESOLVED;
- CLOSED.

## 32. Incident State Semantics

`DECLARED` means coordinated response has started.

`MITIGATING` means actions are being taken to reduce impact.

`RECOVERING` means service restoration is underway.

`MONITORING` means service appears restored but stabilization is required.

`RESOLVED` means customer/service impact has ended.

`CLOSED` means operational review and required documentation are complete.

# 33. Impact Assessment

Assess:

- affected users;
- organizations;
- projects;
- platforms;
- Labs;
- robots;
- Jobs;
- Runs;
- bookings;
- credits;
- results.

Also assess:

- duration;
- geographic scope;
- financial impact;
- security impact;
- safety impact.

# 34. Customer Impact Classification

| Impact | Example |
|---|---|
| None | Internal-only |
| Limited | One resource/user |
| Moderate | Multiple users |
| Major | Major platform/customer group |
| Widespread | Most/all customers |

# 35. Technical Investigation

Investigation should use:

- metrics;
- logs;
- traces;
- events;
- deployment history;
- configuration history;
- database state;
- queue state;
- Lab telemetry.

Avoid making irreversible changes while root cause is uncertain.

# 36. Recent Change Check

Always check:

- recent application deployment;
- database migration;
- infrastructure change;
- configuration change;
- certificate change;
- secret rotation;
- Lab Agent upgrade.

Correlation with a recent change is evidence, not proof.

# 37. Dependency Investigation

Review:

- PostgreSQL;
- queue;
- object storage;
- identity;
- secret store;
- external providers;
- Lab Agent;
- network;
- DNS;
- edge services.

# 38. Mitigation Versus Root Cause

The first objective is mitigation.

Example:

    API Error Rate High
         |
    Roll Back Recent Deployment
         |
    Customer Impact Reduced
         |
    Investigate Root Cause

Root-cause analysis may continue after service is stabilized.

# 39. Safe Mitigation

Prefer:

- reversible;
- scoped;
- observable;
- low-risk.

Examples:

- rollback deployment;
- disable affected feature;
- reduce traffic;
- isolate faulty resource;
- stop affected Jobs;
- pause booking;
- pause credit consumption.

# 40. Dangerous Mitigation

Avoid:

- blind database modification;
- uncontrolled mass deletion;
- credential sharing;
- arbitrary remote shell;
- disabling authentication;
- disabling tenant isolation;
- bypassing safety controls.

# 41. Deployment Incidents

For deployment-related incidents:

    Detect Regression
        |
    Stop Rollout
        |
    Assess Scope
        |
    Roll Back Application
        |
    Validate
        |
    Monitor
        |
    Investigate

Database rollback is separate and requires explicit recovery analysis.

# 42. Database Incidents

Database response should determine:

- availability;
- connection saturation;
- latency;
- deadlocks;
- replication state;
- corruption;
- storage;
- recent migrations.

For corruption:

- stop unsafe writes where required;
- preserve evidence;
- determine recovery point;
- use PITR/restore;
- reconcile.

# 43. Queue Incidents

Queue incidents should assess:

- availability;
- backlog;
- message age;
- consumer health;
- dead-letter growth.

Do not treat queue state as the authoritative business state.

# 44. Credit Incidents

Credit incidents require special handling.

If credit integrity is uncertain:

- stop affected financial operations;
- preserve ledger;
- identify affected transactions;
- reconcile;
- do not manually alter balances without controlled procedure.

# 45. Booking Incidents

If booking/resource state is inconsistent:

- prevent additional conflicting allocations;
- preserve booking records;
- inspect actual resource state;
- reconcile;
- restore availability only after consistency is established.

# 46. Job/Run Incidents

When execution state is uncertain:

- identify Job;
- identify Run;
- inspect Lab Agent;
- inspect resource;
- inspect runtime;
- determine actual execution state;
- classify;
- reconcile.

Do not blindly restart a non-terminal Run.

# 47. Lab Incidents

For Lab incidents:

    Detect
      |
    Check Agent
      |
    Check Network
      |
    Check Resource
      |
    Check Robot Runtime
      |
    Check Safety State
      |
    Isolate if Required
      |
    Recover
      |
    Reconcile

# 48. Robot-Safety Incidents

Robot-safety incidents are handled differently from ordinary cloud incidents.

Examples:

- E-stop;
- safety interlock;
- unsafe motion;
- safety-state unknown;
- thermal danger;
- actuator fault;
- physical obstruction;
- unexpected robot behavior.

Immediate priority:

> Protect people and equipment.

# 49. Robot Safety Response

The cloud incident process must not delay local safety action.

Local procedure:

    Unsafe Condition
         |
    Local Safety Action
         |
    E-Stop / Safe State
         |
    Human Assessment
         |
    Isolate Robot
         |
    Notify Incident Team
         |
    Preserve Evidence
         |
    Investigate

# 50. Cloud Role in Safety Incident

Cloud systems may:

- record incident;
- mark resource unavailable;
- stop application-level execution where safe;
- prevent new bookings;
- notify operators;
- preserve telemetry.

Cloud systems must not replace local safety mechanisms.

# 51. Robot Recovery

Robot recovery requires:

- local safety clearance;
- hardware inspection where necessary;
- runtime health;
- sensor/actuator validation;
- Lab Agent health;
- application validation.

Only then may the resource return to service.

# 52. Safety Incident Severity

Safety incidents are normally SEV0 or SEV1 depending on actual risk and
scope.

A safety state unknown condition must receive high priority even if no injury
has occurred.

# 53. Security Incidents

Security incidents require:

- containment;
- evidence preservation;
- credential revocation;
- scope determination;
- clean recovery;
- legal/compliance review where applicable.

Do not destroy forensic evidence during remediation.

# 54. Security Incident Isolation

Possible actions:

- revoke credentials;
- isolate workload;
- block network access;
- disable compromised integration;
- freeze affected accounts;
- preserve logs.

# 55. Data Integrity Incidents

For suspected corruption:

1. Stop further corruption.
2. Preserve evidence.
3. Determine authoritative state.
4. Identify last known-good point.
5. Restore if necessary.
6. Reconcile.
7. Validate.
8. Resume.

# 56. Observability Incidents

If monitoring itself fails:

- verify alternate signals;
- use direct service checks;
- restore observability;
- treat unknown health conservatively.

Loss of monitoring does not mean the service is healthy.

# 57. Incident Communication

Communication must be:

- factual;
- concise;
- timely;
- audience-appropriate;
- free of speculation.

# 58. Internal Update Template

    Incident: INC-YYYYMMDD-NNN
    Severity: SEV1
    Status: MITIGATING
    Start: 2026-10-08T10:00:00Z
    Impact: API requests failing for multiple customers
    Current Action: Rolling back release
    Safety: No physical safety impact identified
    Next Update: 10:30 UTC

# 59. Customer Update Template

    We are investigating an issue affecting access to Kritva RaaS.
    Some users may experience [brief impact].
    Our engineering team is actively working on recovery.
    No action is required from customers at this time.
    We will provide the next update at [time].

Do not claim full recovery until validation is complete.

# 60. Resolution Update

    Incident: INC-YYYYMMDD-NNN
    Severity: SEV1
    Status: RESOLVED
    Impact End: 2026-10-08T11:05:00Z
    Resolution: Service restored after application rollback
    Data Integrity: Validated
    Safety: No physical safety impact
    Monitoring: Stable
    Postmortem: Required

# 61. Communication Cadence

| Severity | Initial | Ongoing |
|---|---|---|
| SEV0 | Immediate | Frequent |
| SEV1 | Immediate | 30–60 min |
| SEV2 | Within response target | 1–2 hours |
| SEV3 | As needed | As needed |
| SEV4 | Operational | None normally |

Actual cadence may change based on incident dynamics.

# 62. Customer Communication Triggers

Communicate externally when:

- customer access is materially affected;
- Jobs are interrupted;
- bookings are affected;
- credits may be affected;
- results are delayed;
- customer data may be affected.

# 63. Communication Restrictions

Do not disclose:

- secrets;
- credentials;
- internal topology;
- security-sensitive detection details;
- another customer's information;
- unverified root cause.

# 64. Incident Tooling

The production incident toolchain should provide:

- alert integration;
- incident creation;
- on-call paging;
- incident channel;
- timeline;
- dashboard links;
- runbook links;
- change history;
- status communication;
- postmortem tracking.

Final vendors remain an open architectural decision.

# 65. Required Tool Integrations

At minimum:

    Monitoring
       |
    Alerting
       |
    Incident Management
       |
    Communication
       |
    Ticket / Action Tracking
       |
    Documentation

# 66. Dashboard Requirements

Incident responders need dashboards for:

- production overview;
- API;
- database;
- queue;
- workers;
- Jobs;
- Runs;
- Labs;
- robots;
- security;
- storage;
- deployment;
- cost.

# 67. Runbook Requirements

Every major incident class requires a runbook.

Runbooks must contain:

- symptoms;
- severity;
- checks;
- dashboards;
- logs;
- safe mitigation;
- escalation;
- recovery;
- validation.

# 68. Required Runbooks

Initial baseline:

| Incident | Runbook |
|---|---|
| API outage | `RB-API-001` |
| API latency | `RB-API-002` |
| Database outage | `RB-DB-001` |
| Database corruption | `RB-DB-003` |
| Queue backlog | `RB-QUEUE-001` |
| Worker failure | `RB-WORKER-001` |
| Scheduler failure | `RB-SCHED-001` |
| Reconciliation failure | `RB-RECON-001` |
| Artifact failure | `RB-ARTIFACT-001` |
| Credit integrity | `RB-CREDIT-001` |
| Booking integrity | `RB-BOOKING-001` |
| Job failure | `RB-JOB-001` |
| Lab Agent failure | `RB-LAB-001` |
| Robot fault | `RB-ROBOT-001` |
| Safety incident | `RB-SAFETY-001` |
| Security incident | `RB-SEC-001` |
| DR activation | `RB-DR-001` |

# 69. Incident Timeline

The timeline must capture:

- detection;
- acknowledgement;
- declaration;
- severity changes;
- key observations;
- mitigations;
- deployments;
- recovery;
- communication;
- resolution.

Use UTC consistently.

# 70. Evidence Preservation

Evidence may include:

- logs;
- metrics;
- traces;
- configuration versions;
- deployment IDs;
- database snapshots;
- audit records;
- Lab telemetry;
- robot telemetry;
- screenshots where appropriate.

Evidence must be protected according to security and privacy requirements.

# 71. Incident Data Model

Conceptually:

    Incident
      |
      +-- ID
      +-- Severity
      +-- Status
      +-- Start/End
      +-- Commander
      +-- Services
      +-- Impact
      +-- Timeline
      +-- Alerts
      +-- Changes
      +-- Communications
      +-- Runbooks
      +-- Postmortem
      +-- Corrective Actions

# 72. Incident Interface

A production incident record should expose:

    incident_id
    severity
    status
    detected_at
    declared_at
    resolved_at
    commander
    technical_lead
    affected_services
    affected_resources
    customer_impact
    safety_impact
    security_impact
    runbook_refs
    timeline_ref
    postmortem_ref

# 73. Incident Correlation

Incidents should correlate with:

- alert IDs;
- deployment IDs;
- trace IDs;
- Job IDs;
- Run IDs;
- Lab IDs;
- Agent IDs;
- resource IDs.

Do not put unbounded identifiers into alert labels.

# 74. Incident Access Control

Incident information must follow least privilege.

Security incidents may require restricted access.

Customer-sensitive data must not be broadly copied into incident channels.

# 75. Incident Audit

Audit:

- severity changes;
- role assignments;
- major decisions;
- access;
- communications;
- recovery actions;
- closure;
- postmortem approval.

# 76. Change Freeze

During SEV0/SEV1 incidents:

- avoid unrelated production changes;
- freeze risky deployments;
- allow only incident-related emergency changes.

Emergency changes must be documented.

# 77. Emergency Change

An emergency change requires:

- incident ID;
- change owner;
- reason;
- risk;
- expected effect;
- validation;
- rollback.

Example:

    Change ID: CHG-123
    Incident: INC-20261008-001
    Action: Roll back release
    Owner: Backend On-Call
    Validation: Synthetic API workflow

# 78. Incident Rollback

Rollback should be preferred when:

- recent deployment correlates strongly;
- rollback is known safe;
- data compatibility permits it.

Do not rollback blindly when database schema changes are incompatible.

# 79. Incident Recovery

Recovery is complete only when:

- service is available;
- customer workflows work;
- errors return to normal;
- queue backlog is controlled;
- data integrity is validated;
- Lab state is reconciled;
- safety is validated where applicable.

# 80. Stabilization Period

After apparent recovery:

- monitor elevated signals;
- validate SLOs;
- inspect dependent services;
- verify no recurring alerts;
- verify customer workflows.

# 81. Incident Resolution

Incident Commander declares resolution after:

- technical recovery;
- customer impact ended;
- required validation complete;
- no immediate rollback needed.

The incident then moves to post-incident work.

# 82. Incident Closure

Closure requires:

- final timeline;
- impact summary;
- root cause status;
- customer communication;
- evidence;
- postmortem requirement;
- corrective actions.

# 83. Root Cause

Root cause should distinguish:

- triggering event;
- contributing factors;
- systemic causes;
- detection gaps;
- recovery gaps.

Avoid simplistic statements such as "human error" without explaining system
conditions that allowed the error.

# 84. Postmortem Requirement

Postmortems are required for:

- SEV0;
- SEV1;
- major SEV2;
- repeated incidents;
- safety incidents;
- security incidents;
- data-integrity incidents;
- significant DR events.

# 85. Blameless Postmortem

Postmortems should focus on:

- systems;
- processes;
- controls;
- conditions;
- decisions.

The objective is learning and prevention, not individual blame.

# 86. Postmortem Template

    Incident ID:
    Date:
    Severity:
    Duration:
    Services:
    Customer Impact:
    Safety Impact:
    Security Impact:

    Summary:

    Detection:

    Timeline:

    Root Cause:

    Contributing Factors:

    What Went Well:

    What Went Poorly:

    Detection Gaps:

    Response Gaps:

    Recovery Gaps:

    Corrective Actions:

    Owners:

    Due Dates:

    Follow-Up Review:

# 87. Timeline Template

    HH:MM UTC - Alert fired
    HH:MM UTC - On-call acknowledged
    HH:MM UTC - Incident declared
    HH:MM UTC - Impact confirmed
    HH:MM UTC - Mitigation started
    HH:MM UTC - Mitigation effective
    HH:MM UTC - Validation started
    HH:MM UTC - Customer impact ended
    HH:MM UTC - Incident resolved

# 88. Corrective Actions

Corrective actions should be classified:

- P0: immediate risk;
- P1: important reliability/security improvement;
- P2: planned improvement;
- P3: optimization.

Each action requires:

- owner;
- due date;
- acceptance criteria.

# 89. Action Tracking

Corrective actions should be tracked outside the postmortem document where
appropriate.

Required fields:

    action_id
    description
    priority
    owner
    due_date
    status
    incident_id
    acceptance_criteria

# 90. Repeated Incident Detection

Repeated incidents should trigger review.

Examples:

- same alert three times;
- same deployment regression;
- repeated Lab Agent failure;
- repeated queue backlog;
- recurring credit mismatch.

Repeated incidents indicate systemic weakness.

# 91. Incident Metrics

Measure:

- incident count;
- incidents by severity;
- MTTD;
- MTTA;
- MTTR;
- customer impact duration;
- recurrence;
- escalation rate;
- false-positive rate;
- postmortem completion;
- corrective-action completion.

# 92. MTTD

Mean Time to Detect:

    Detection Time - Failure Start Time

Use estimates when exact failure start time is unavailable.

# 93. MTTA

Mean Time to Acknowledge:

    Acknowledgement Time - Alert Time

# 94. MTTR

Mean Time to Restore:

    Service Recovery Time - Incident Declaration

Metrics should be interpreted by severity.

# 95. Safety Incident Metrics

Track separately:

- safety events;
- E-stop events;
- safety-state unknown;
- robot faults;
- recovery time;
- repeat safety events.

Do not aggregate physical safety into ordinary application availability metrics.

# 96. Customer Impact Metrics

Track:

- affected organizations;
- affected Jobs;
- failed Runs;
- delayed results;
- affected bookings;
- affected credits.

# 97. Incident Review Cadence

| Review | Frequency |
|---|---|
| SEV0 review | Within 24–48 hours |
| SEV1 review | Within 2–5 business days |
| Major SEV2 review | Within 5–10 business days |
| Alert review | Monthly |
| Incident trend review | Monthly |
| DR review | Quarterly |
| Safety review | Quarterly or after each event |

# 98. Postmortem Approval

Postmortem approval should confirm:

- root cause understood;
- impact documented;
- corrective actions assigned;
- safety implications addressed;
- security implications addressed.

# 99. Corrective Action Verification

Actions are not complete until:

- implementation exists;
- tests pass;
- documentation is updated;
- owner validates;
- evidence is recorded.

# 100. Knowledge Management

Postmortem findings should update:

- runbooks;
- alerts;
- dashboards;
- architecture;
- tests;
- deployment controls;
- security controls.

# 101. Incident and Alert Relationship

Alerts detect.

Incidents coordinate.

Runbooks guide.

Postmortems improve.

The relationship is:

    Alert
      |
    Incident
      |
    Runbook
      |
    Mitigation
      |
    Recovery
      |
    Postmortem
      |
    Improvement
      |
    Better Alert / Runbook / Architecture

# 102. Incident and DR Relationship

Incident response determines:

- whether DR is required;
- when to declare DR;
- who controls recovery.

DR provides:

- recovery infrastructure;
- data restoration;
- failover;
- failback.

# 103. Incident and Backup Relationship

Backup provides recovery capability.

Incident response determines:

- when recovery is necessary;
- which recovery point to use;
- whether data integrity is at risk.

# 104. Incident and Safety Relationship

Physical safety remains independent.

The cloud incident system records and coordinates but does not become the
physical safety authority.

# 105. Phase Mapping

| Phase | Incident Response Objective |
|---|---|
| Phase 0 | Define incident model and roles |
| Phase 1 | Establish production detection and response |
| Phase 2 | Add resource/artifact incidents |
| Phase 3 | Add execution/reconciliation incidents |
| Phase 4 | Add commercial/data-integrity incidents |
| Phase 5 | Add remote execution incidents |
| Phase 6 | Add Lab/robot/safety incidents |
| Phase 7 | Add realtime/result incidents |
| Phase 8 | Mature incident management and continuous improvement |

# 106. Phase 0

Define:

- severity;
- roles;
- communication;
- incident IDs;
- runbooks;
- postmortems.

Acceptance:

- [ ] incident process approved;
- [ ] roles assigned;
- [ ] severity model approved.

# 107. Phase 1

Implement response for:

- API;
- authentication;
- PostgreSQL;
- queue;
- storage;
- deployment.

Acceptance:

- [ ] incident channels work;
- [ ] on-call responds;
- [ ] runbooks are usable.

# 108. Phase 2

Add:

- artifact;
- platform;
- resource;
- storage-integrity incidents.

Acceptance:

- [ ] artifact failures have runbooks;
- [ ] resource incidents are actionable.

# 109. Phase 3

Add:

- worker;
- scheduler;
- reconciliation;
- Job;
- Run incidents.

Acceptance:

- [ ] execution failures are diagnosable;
- [ ] reconciliation is part of recovery.

# 110. Phase 4

Add:

- booking;
- credits;
- financial integrity.

Acceptance:

- [ ] financial incidents have elevated handling;
- [ ] ledger integrity procedures exist.

# 111. Phase 5

Add:

- remote execution;
- deployment;
- runtime incidents.

Acceptance:

- [ ] active Jobs are reconciled;
- [ ] unsafe automatic restart is prevented.

# 112. Phase 6

Add:

- Lab;
- Lab Agent;
- robot;
- safety incidents.

Acceptance:

- [ ] safety response is locally authoritative;
- [ ] Lab response roles are assigned;
- [ ] robot recovery is controlled.

# 113. Phase 7

Add:

- WebSocket;
- telemetry;
- video;
- result incidents.

Acceptance:

- [ ] realtime failures are diagnosable;
- [ ] result failures are tracked.

# 114. Phase 8

Complete:

- mature on-call;
- postmortem program;
- DR exercises;
- security incident response;
- continuous improvement.

Acceptance:

- [ ] production incident program passes readiness review.

# 115. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| No clear commander | Critical | Explicit Incident Commander |
| Alert fatigue | High | Alert quality program |
| Slow detection | High | SLO/synthetic monitoring |
| Poor diagnosis | High | Dashboards/runbooks |
| Unsafe mitigation | Critical | Safety authority |
| Duplicate execution | Critical | Reconciliation/idempotency |
| Financial corruption | Critical | Ledger controls |
| Poor communication | High | Templates/cadence |
| Missing evidence | High | Scribe/timeline |
| Repeated incident | High | Corrective actions |
| Stale runbook | High | Periodic review |
| Stale contacts | High | Ownership review |
| Security evidence loss | Critical | Evidence preservation |
| DR delay | Critical | Tested DR |
| Customer misinformation | High | Communications lead |
| Incident overload | Medium | Severity discipline |
| Uncontrolled emergency change | High | Change linkage |
| Incomplete postmortem | Medium | Closure checklist |
| Safety incident misclassified | Critical | Safety escalation |
| Monitoring outage | High | Independent checks |

# 116. Open Questions

1. Final incident-management platform.
2. Final paging provider.
3. Final on-call scheduling system.
4. Final incident communication platform.
5. Final customer-status platform.
6. Final SEV response targets.
7. Final escalation timers.
8. Final Incident Commander rotation.
9. Final security incident escalation policy.
10. Final safety incident escalation policy.
11. Final postmortem approval authority.
12. Final corrective-action tracking system.
13. Final incident retention policy.
14. Final customer notification requirements.
15. Final regulatory notification requirements.
16. Final robot safety incident classification.
17. Final Lab incident ownership.
18. Final DR declaration authority.
19. Final emergency-change authority.
20. Final incident metrics targets.

# 117. Full Acceptance Criteria

## Incident Model

- [ ] Incident definition is documented.
- [ ] Event/alert/incident distinction is documented.
- [ ] Severity model is approved.
- [ ] Incident lifecycle is defined.
- [ ] Incident ID format is defined.
- [ ] Incident states are defined.

## Roles

- [ ] Incident Commander role exists.
- [ ] Technical Lead role exists.
- [ ] Communications Lead exists.
- [ ] Scribe role exists.
- [ ] Security Lead exists.
- [ ] Lab Lead exists.
- [ ] Safety Lead exists.
- [ ] Customer Lead exists.
- [ ] Ownership is documented.

## Detection

- [ ] Alerts can create incidents.
- [ ] Customer reports can create incidents.
- [ ] Lab operators can create incidents.
- [ ] Security events can create incidents.
- [ ] Synthetic failures can create incidents.
- [ ] Reconciliation failures can create incidents.

## Triage

- [ ] Impact assessment is defined.
- [ ] Customer scope is assessed.
- [ ] Safety impact is assessed.
- [ ] Security impact is assessed.
- [ ] Data integrity is assessed.
- [ ] Recent changes are checked.
- [ ] Dependencies are checked.

## Response

- [ ] Incident declaration procedure exists.
- [ ] Incident channel exists.
- [ ] Incident roles can be assigned.
- [ ] Timeline is maintained.
- [ ] Runbooks are linked.
- [ ] Mitigation is documented.
- [ ] Recovery is validated.
- [ ] Closure criteria are defined.

## Communications

- [ ] Internal template exists.
- [ ] Customer template exists.
- [ ] Resolution template exists.
- [ ] Communication cadence is defined.
- [ ] Communication ownership is defined.
- [ ] Sensitive information handling is defined.

## Robot Safety

- [ ] Safety incidents have dedicated procedures.
- [ ] Local safety authority is explicit.
- [ ] E-stop authority remains local.
- [ ] Cloud cannot replace physical safety.
- [ ] Unsafe automatic restart is prohibited.
- [ ] Robot recovery requires validation.
- [ ] Safety incidents are separately tracked.

## Security

- [ ] Security incident procedure exists.
- [ ] Credential revocation procedure exists.
- [ ] Evidence preservation exists.
- [ ] Clean recovery procedure exists.
- [ ] Security escalation exists.
- [ ] Customer notification requirements are defined.

## Financial Integrity

- [ ] Credit incidents have dedicated handling.
- [ ] Ledger is authoritative.
- [ ] Uncertain transactions can be frozen.
- [ ] Reconciliation is required.
- [ ] Duplicate consumption is prevented.

## Booking and Execution

- [ ] Booking incidents have runbooks.
- [ ] Resource state is reconciled.
- [ ] Job state is reconciled.
- [ ] Run state is reconciled.
- [ ] Duplicate execution is prevented.
- [ ] Unsafe restart is prevented.

## Tooling

- [ ] Alerting integrates with incidents.
- [ ] On-call integrates with incidents.
- [ ] Dashboards are linked.
- [ ] Runbooks are linked.
- [ ] Change records are linked.
- [ ] Postmortems are linked.
- [ ] Corrective actions are tracked.

## Postmortems

- [ ] SEV0 requires postmortem.
- [ ] SEV1 requires postmortem.
- [ ] Major SEV2 incidents are reviewed.
- [ ] Safety incidents are reviewed.
- [ ] Security incidents are reviewed.
- [ ] Data-integrity incidents are reviewed.
- [ ] Postmortem template exists.
- [ ] Corrective actions have owners.
- [ ] Corrective actions have deadlines.
- [ ] Completion is verified.

## Metrics

- [ ] MTTD is measured.
- [ ] MTTA is measured.
- [ ] MTTR is measured.
- [ ] Customer impact is measured.
- [ ] Recurrence is measured.
- [ ] Alert-to-incident conversion is measured.
- [ ] Postmortem completion is measured.

## Production Readiness

- [ ] On-call is staffed.
- [ ] Incident tools are available.
- [ ] Runbooks are validated.
- [ ] Contacts are current.
- [ ] Safety response is validated.
- [ ] Security response is validated.
- [ ] DR response is validated.
- [ ] Incident exercises are completed.

# 118. Incident Exercise Acceptance

A production incident exercise is successful only if:

- [ ] detection occurs;
- [ ] severity is assigned;
- [ ] Incident Commander is assigned;
- [ ] communication starts;
- [ ] technical diagnosis occurs;
- [ ] mitigation occurs;
- [ ] recovery occurs;
- [ ] validation occurs;
- [ ] incident is closed;
- [ ] timeline is complete;
- [ ] postmortem is produced.

# 119. Final Incident Response Invariants

Kritva RaaS incident response must preserve these invariants:

1. Safety takes precedence over availability.
2. One Incident Commander owns major incidents.
3. Technical ownership is explicit.
4. Communication ownership is explicit.
5. Security ownership is explicit.
6. Lab ownership is explicit.
7. Safety ownership is explicit.
8. Every major incident has an incident ID.
9. Every major incident has a timeline.
10. Every major incident has a severity.
11. Every actionable incident has a runbook.
12. Mitigation is prioritized before perfect root-cause certainty.
13. Mitigations should be reversible where possible.
14. PostgreSQL remains authoritative.
15. Reconciliation follows uncertain distributed operations.
16. Financial integrity receives elevated protection.
17. Booking integrity receives elevated protection.
18. Physical robot safety remains local.
19. Cloud failure does not imply unsafe robot recovery.
20. Non-terminal Jobs and Runs are reconciled before restart.
21. Security incidents preserve evidence.
22. Customer communications are factual.
23. Sensitive information is protected.
24. Emergency changes are linked to incidents.
25. Major incidents receive postmortems.
26. Corrective actions have owners and deadlines.
27. Repeated incidents trigger systemic review.
28. Incident response tooling is itself operationally monitored.
29. DR can be invoked through incident command.
30. Incident response continuously improves system reliability.

# 120. Final Incident Operating Model

The complete production operating model is:

    DETECT
       |
    ACKNOWLEDGE
       |
    TRIAGE
       |
    CLASSIFY
       |
    DECLARE
       |
    COMMAND
       |
    ASSESS IMPACT
       |
    PROTECT SAFETY
       |
    CONTAIN
       |
    MITIGATE
       |
    RECOVER
       |
    RECONCILE
       |
    VALIDATE
       |
    COMMUNICATE
       |
    MONITOR
       |
    RESOLVE
       |
    POSTMORTEM
       |
    CORRECTIVE ACTION
       |
    VERIFY
       |
    IMPROVE

The governing principle is:

> **Kritva RaaS incident response must provide a disciplined path from
> detection to verified recovery while protecting people, robots, customer
> data, financial integrity and tenant isolation. Every major incident must
> have clear command, technical ownership, communication, evidence,
> runbooks and measurable recovery. Physical robot safety remains locally
> authoritative, while the cloud incident system coordinates service
> containment, recovery and reconciliation. Every significant incident must
> ultimately improve the architecture, monitoring, runbooks, processes or
> controls that prevent recurrence.**
