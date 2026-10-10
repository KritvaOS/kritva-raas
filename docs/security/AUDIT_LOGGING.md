# Kritva RaaS Audit Logging

## 1. Purpose

This document defines the production-grade audit logging architecture for
Kritva RaaS.

Audit logging provides an authoritative security and operational record of
significant actions affecting:

- identities;
- organizations;
- authorization;
- projects;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- laboratories;
- robots;
- resources;
- secrets;
- cryptographic keys;
- administrative configuration;
- security controls;
- tenant isolation;
- compliance-relevant operations.

Audit logging shall answer:

1. Who performed the action?
2. What action occurred?
3. What resource was affected?
4. Which organization was involved?
5. When did it occur?
6. From which request/session/device/service did it originate?
7. What was the outcome?
8. What changed?
9. Which policy or authorization decision permitted or denied it?
10. Can the evidence be trusted as unmodified?

Audit logging is a security control and an evidentiary record.

It is not merely application debugging.

## 2. Scope

This specification covers:

- audit event taxonomy;
- audit event schema;
- event generation;
- request correlation;
- actor identity;
- effective identity;
- tenant context;
- resource identity;
- before/after state;
- authorization decisions;
- authentication events;
- administrative actions;
- security events;
- booking and credit events;
- artifact events;
- execution events;
- laboratory events;
- configuration changes;
- object access;
- export;
- retention;
- tamper evidence;
- audit storage;
- audit access control;
- alerting;
- compliance reporting;
- audit integrity verification;
- audit ingestion failures;
- audit monitoring;
- audit incident response;
- audit testing.

## 3. Non-Goals

This document does not define:

- authentication protocols in detail;
- authorization policy in detail;
- secret-management implementation;
- cryptographic key-management implementation;
- general application logging;
- high-frequency telemetry;
- robot control telemetry;
- business analytics.

Those systems may produce events that are separately referenced by audit
records.

## 4. Audit Logging Principles

Kritva RaaS shall follow these principles:

1. Security-significant actions must be auditable.
2. Audit events must identify the actor whenever known.
3. Audit events must identify the effective organization whenever applicable.
4. Audit events must identify the affected resource.
5. Audit events must have a trusted timestamp.
6. Audit events must correlate to requests or jobs where applicable.
7. Audit records must be tamper evident.
8. Audit records must be protected from ordinary application modification.
9. Audit retention shall be policy driven.
10. Audit access shall be least privilege.
11. Sensitive secrets must never be written to audit logs.
12. Audit logging must fail safely for security-critical operations.
13. Audit records shall be append oriented.
14. Audit events shall not be used as the authoritative source of mutable
    business state.
15. Business state remains authoritative in domain tables.
16. Audit records provide historical evidence of actions and state changes.
17. Administrative access to audit records shall itself be auditable.
18. Audit export shall preserve integrity and provenance.
19. Compliance reports shall be reproducible from authoritative audit data.
20. Audit controls shall be continuously tested.

# 5. Definitions

| Term | Definition |
|---|---|
| Audit Event | Immutable security or business-significant record |
| Audit Record | Persisted representation of an audit event |
| Actor | Identity that initiated an action |
| Effective Principal | Identity whose permissions apply to the action |
| Organization | Primary customer tenant |
| Resource | Object affected by an action |
| Correlation ID | Identifier connecting related operations |
| Request ID | Identifier for one API/request operation |
| Trace ID | Identifier connecting distributed operations |
| Session ID | Identifier for authenticated session |
| Event ID | Globally unique audit event identifier |
| Event Type | Controlled classification of an audit action |
| Outcome | SUCCESS, FAILURE, DENIED, etc. |
| Tamper Evidence | Ability to detect unauthorized modification |
| Audit Export | Controlled extraction of audit records |
| Retention | Required period for preserving audit evidence |
| Compliance Report | Structured report generated from audit evidence |

# 6. Audit Architecture

The conceptual architecture is:

    User / Studio / Admin / Service / Lab Agent
                    |
                    v
             API / Application
                    |
                    v
             Audit Event API
                    |
          +---------+---------+
          |                   |
          v                   v
    Audit Transaction     Security Events
          |                   |
          +---------+---------+
                    |
                    v
             Audit Storage
                    |
          +---------+---------+
          |                   |
          v                   v
     Tamper Evidence     Audit Index
          |                   |
          +---------+---------+
                    |
                    v
            Reporting / SIEM
                    |
                    v
             Alerting / SOC

# 7. Audit Authority

The Audit domain owns:

- audit event identity;
- audit persistence;
- event classification;
- audit retention metadata;
- audit integrity metadata;
- audit export;
- audit query interfaces;
- audit access policy.

Domain services remain authoritative for their own business state.

For example:

    Booking Service
          |
          +----> Booking State
          |
          +----> Audit Event

The Booking domain owns booking state.

The Audit domain owns the audit record.

# 8. Audit Event Generation

Security-sensitive operations shall emit audit events at the application
service boundary.

Preferred:

    API Request
       |
       v
    Authenticate
       |
       v
    Authorize
       |
       v
    Application Service
       |
       +--------> Domain State Change
       |
       +--------> Audit Event
       |
       v
    Response

The audit event shall describe the actual result of the operation.

# 9. Transactional Audit Requirement

For critical state changes, domain mutation and audit creation should be
transactionally consistent.

Example:

    BEGIN
       |
       +-- Update Booking
       |
       +-- Insert Audit Event
       |
    COMMIT

If the business state commits but the required audit event cannot be
persisted, the operation should fail or enter a controlled reconciliation
state.

The exact behavior depends on event criticality.

# 10. Audit Event Criticality

Audit events shall have a criticality classification.

| Criticality | Example |
|---|---|
| CRITICAL | Key operation, tenant isolation event, security policy change |
| HIGH | Login failure, role change, artifact approval, credit mutation |
| MEDIUM | Project change, booking change, job lifecycle |
| LOW | Informational administrative activity |

Critical and high-value events require stronger delivery guarantees.

# 11. Audit Event Taxonomy

Primary categories:

- AUTHENTICATION;
- AUTHORIZATION;
- ORGANIZATION;
- USER;
- PROJECT;
- ARTIFACT;
- BOOKING;
- CREDIT;
- JOB;
- RUN;
- RESULT;
- EXPERIMENT;
- LAB;
- ROBOT;
- RESOURCE;
- SECURITY;
- TENANT_ISOLATION;
- SECRET;
- KEY;
- CONFIGURATION;
- ADMINISTRATION;
- EXPORT;
- COMPLIANCE;
- SYSTEM.

# 12. Authentication Events

The following shall be auditable:

- login success;
- login failure;
- logout;
- session creation;
- session revocation;
- MFA enrollment;
- MFA challenge;
- MFA failure;
- MFA recovery;
- password change;
- password reset request;
- password reset completion;
- SSO login;
- SSO failure;
- API key creation;
- API key revocation;
- service identity creation;
- Lab Agent enrollment;
- certificate issuance;
- certificate revocation;
- suspicious authentication activity.

# 13. Authorization Events

Audit:

- authorization success for sensitive operations;
- authorization denial;
- role assignment;
- role removal;
- permission change;
- delegation;
- delegation expiration;
- break-glass activation;
- impersonation;
- support access;
- policy change;
- policy version activation.

Routine low-risk authorization checks need not all create durable audit records
if they generate excessive volume, but security-relevant denials and policy
changes must be recorded.

# 14. Organization Events

Audit:

- organization creation;
- organization update;
- organization suspension;
- organization reactivation;
- organization deletion;
- membership creation;
- membership suspension;
- membership removal;
- organization ownership change;
- organization policy change.

# 15. Project Events

Audit:

- project creation;
- project modification;
- project archive;
- project deletion;
- project member change;
- project role change;
- platform binding change;
- project policy change.

# 16. Artifact Events

Audit:

- artifact creation;
- upload;
- checksum verification;
- malware scan;
- policy scan;
- signature generation;
- signature verification;
- approval;
- rejection;
- quarantine;
- revocation;
- expiration;
- deletion;
- download;
- deployment;
- execution;
- compatibility rejection.

# 17. Booking Events

Audit:

- booking creation;
- booking modification;
- booking confirmation;
- booking rejection;
- booking cancellation;
- booking expiration;
- resource allocation;
- resource release;
- booking activation;
- booking completion;
- booking failure;
- refund decision.

# 18. Credit Events

Credit operations require strong audit evidence.

Audit:

- wallet creation;
- credit grant;
- credit purchase;
- credit reservation;
- credit consumption;
- credit release;
- credit refund;
- ledger adjustment;
- invoice creation;
- invoice update;
- financial transaction;
- administrative credit adjustment.

The audit record must not replace the credit ledger.

# 19. Job Events

Audit:

- job creation;
- queue;
- validation;
- allocation;
- deployment;
- start;
- stop;
- cancellation;
- timeout;
- failure;
- completion;
- retry;
- policy rejection.

# 20. Run Events

Audit:

- run creation;
- execution start;
- execution stop;
- runtime failure;
- safety-related stop;
- resource reassignment;
- result generation;
- result publication;
- run cancellation.

# 21. Result Events

Audit:

- result creation;
- result processing;
- result publication;
- result download;
- result archive;
- result purge;
- result comparison;
- experiment association.

# 22. Lab Events

Audit:

- lab registration;
- lab activation;
- lab maintenance;
- lab offline;
- Lab Agent enrollment;
- Lab Agent certificate rotation;
- Lab Agent revocation;
- resource registration;
- resource state change;
- robot registration;
- robot maintenance;
- robot fault;
- resource quarantine.

# 23. Security Events

Audit:

- suspicious access;
- failed authorization;
- tenant boundary violation;
- runtime escape attempt;
- network policy violation;
- secret exposure detection;
- key misuse;
- signing failure;
- certificate failure;
- integrity failure;
- policy bypass attempt;
- abnormal administrative activity.

# 24. Tenant Isolation Events

Tenant-isolation events are high priority.

Examples:

- cross-tenant authorization attempt;
- cross-tenant object access attempt;
- RLS denial;
- invalid tenant context;
- tenant context mismatch;
- foreign project reference;
- foreign artifact reference;
- foreign job reference;
- foreign result reference;
- cross-tenant network attempt;
- runtime isolation violation;
- resource cleanup failure;
- cross-tenant telemetry query.

# 25. Configuration Events

Audit changes to:

- security policies;
- tenant quotas;
- platform configuration;
- credit rates;
- booking policies;
- runtime policies;
- network policy;
- artifact policy;
- retention policy;
- authentication configuration;
- authorization configuration;
- audit configuration.

# 26. Administrative Events

Administrative actions shall be strongly auditable.

Examples:

- admin login;
- organization impersonation;
- user suspension;
- tenant data access;
- resource override;
- quota override;
- credit adjustment;
- booking override;
- artifact override;
- policy override;
- break-glass action.

# 27. Audit Event Schema

Canonical event structure:

    {
        "event_id": "evt-01...",
        "event_version": 1,
        "event_type": "artifact.approved",
        "category": "ARTIFACT",
        "severity": "HIGH",
        "occurred_at": "2026-10-08T20:00:00.123Z",
        "recorded_at": "2026-10-08T20:00:00.456Z",
        "organization_id": "org-001",
        "actor": {
            "type": "USER",
            "id": "user-001"
        },
        "effective_principal": {
            "type": "USER",
            "id": "user-001"
        },
        "session_id": "sess-001",
        "request_id": "req-001",
        "trace_id": "trace-001",
        "span_id": "span-001",
        "resource": {
            "type": "artifact",
            "id": "artifact-001"
        },
        "action": "APPROVE",
        "outcome": "SUCCESS",
        "reason_code": "ARTIFACT_POLICY_PASSED",
        "source": {
            "component": "artifact-service",
            "environment": "production"
        },
        "metadata": {},
        "integrity": {}
    }

# 28. Event ID

Every audit event shall have a globally unique event ID.

UUIDv7 is preferred because it provides:

- uniqueness;
- sortable timestamps;
- distributed generation.

# 29. Event Version

Audit event schemas shall be versioned.

Example:

    event_version = 1

Schema evolution shall preserve historical readability.

# 30. Event Type

Event types shall be controlled vocabulary values.

Preferred naming:

    <domain>.<action>

Examples:

    user.login_succeeded
    authorization.denied
    artifact.approved
    booking.cancelled
    credit.consumed
    job.started
    result.downloaded
    tenant.cross_access_denied

# 31. Severity

Severity values:

    INFO
    LOW
    MEDIUM
    HIGH
    CRITICAL

Severity shall describe security/operational importance, not merely error
status.

# 32. Actor

Actor fields identify who initiated the action.

Types may include:

    USER
    SERVICE
    LAB_AGENT
    ADMINISTRATOR
    SYSTEM
    SUPPORT_AGENT

# 33. Effective Principal

Effective principal is required for delegated or impersonated operations.

Example:

    actor = support-agent-001
    effective_principal = user-001

This prevents administrative access from being misrepresented as customer
activity.

# 34. Organization

Tenant-scoped events shall include:

    organization_id

Global events may omit organization ID when no tenant applies.

Cross-tenant administrative events should include:

    actor organization
    target organization

where applicable.

# 35. Resource

Resource identity should contain:

    resource.type
    resource.id

Optional:

    resource.version

Resource identifiers shall be stable and non-secret.

# 36. Action

Action should be a controlled verb:

    CREATE
    READ
    UPDATE
    DELETE
    LOGIN
    LOGOUT
    APPROVE
    REJECT
    EXECUTE
    DOWNLOAD
    EXPORT
    GRANT
    REVOKE
    ROTATE
    START
    STOP

# 37. Outcome

Standard outcomes:

    SUCCESS
    FAILURE
    DENIED
    REJECTED
    CANCELLED
    TIMEOUT
    PARTIAL

# 38. Reason Code

Reason codes provide machine-readable explanations.

Examples:

    INVALID_CREDENTIALS
    AUTHORIZATION_DENIED
    TENANT_MISMATCH
    ARTIFACT_POLICY_FAILED
    INSUFFICIENT_CREDITS
    RESOURCE_UNAVAILABLE
    QUOTA_EXCEEDED
    SAFETY_GATE_FAILED

# 39. Request Correlation

Every request-driven audit event should contain:

    request_id
    trace_id
    session_id

where available.

Distributed execution may additionally contain:

    job_id
    run_id
    booking_id

# 40. Correlation Flow

    Client
      |
      | request_id
      v
    API
      |
      | trace_id
      v
    Application
      |
      +----> Database
      |
      +----> Queue
      |          |
      |          v
      |       Worker
      |          |
      |          v
      |       Lab Agent
      |          |
      |          v
      |        Robot
      |
      +----> Audit Event

All related events should preserve the correlation chain.

# 41. Request ID

Request ID identifies a single request.

It shall be:

- unique;
- safe to expose to customers;
- included in audit records;
- included in error responses where appropriate.

# 42. Trace ID

Trace ID links distributed operations.

Example:

    Studio
      |
      v
    API
      |
      v
    Job Service
      |
      v
    Worker
      |
      v
    Lab Agent

The same trace context should be propagated where technically practical.

# 43. Idempotency Correlation

Where operations use idempotency keys, the audit record may include a
non-secret idempotency identifier.

Secrets or bearer tokens must never be logged.

# 44. Before and After State

For important configuration changes, audit records should capture:

    before
    after

Only security-safe fields shall be included.

Passwords, private keys, tokens, credentials and secrets shall never appear.

# 45. Change Representation

Preferred representation:

    changed_fields = [
        "quota.concurrent_jobs",
        "quota.storage_bytes"
    ]

Optional:

    before = {
        "concurrent_jobs": 5
    }

    after = {
        "concurrent_jobs": 10
    }

# 46. Sensitive Data Redaction

Audit logging shall redact:

- passwords;
- access tokens;
- refresh tokens;
- API secrets;
- private keys;
- certificate private material;
- database credentials;
- cloud credentials;
- encryption keys;
- signing keys;
- recovery secrets.

# 47. Source Code Privacy

Audit events must not contain customer source code.

They must not capture:

- source snippets;
- compiler input;
- source archives;
- repository contents;
- source-map contents.

Audit metadata may identify artifact/build IDs without recording source.

# 48. Personal Data Minimization

Audit events shall collect only data required for:

- security;
- operations;
- compliance;
- investigation.

Avoid storing unnecessary:

- IP addresses;
- device fingerprints;
- personal profile information;
- request payloads.

Where retained, such data must have defined purpose and retention.

# 49. IP Address

IP address may be retained for security investigation where justified.

It shall have:

- defined retention;
- access restrictions;
- privacy classification.

# 50. User Agent

User-agent information may be retained for authentication and security
investigation.

It should not be stored indiscriminately for every high-volume event.

# 51. Request Payloads

Full request payloads shall not normally be stored in audit events.

Instead store:

- action;
- resource;
- selected changed fields;
- outcome;
- reason;
- correlation IDs.

# 52. Audit Database

Audit records should reside in a dedicated logical schema:

    audit

The audit domain should own:

    audit.events
    audit.event_integrity
    audit.exports
    audit.retention_policies

Additional tables may be introduced as implementation requires.

# 53. Audit Storage Model

Conceptual table:

    audit.events

Key fields:

    event_id
    event_version
    event_type
    category
    severity
    occurred_at
    recorded_at
    organization_id
    actor_type
    actor_id
    effective_principal_type
    effective_principal_id
    session_id
    request_id
    trace_id
    resource_type
    resource_id
    action
    outcome
    reason_code
    source_component
    environment
    metadata
    previous_hash
    event_hash

# 54. Append-Only Model

Audit records shall be append-oriented.

Ordinary application services shall not:

- update historical audit events;
- delete historical audit events;
- rewrite historical events.

Corrections should be represented as new audit events.

# 55. Audit Database Permissions

Normal application roles should have:

    INSERT audit events

but not unrestricted:

    UPDATE audit events
    DELETE audit events

Audit readers shall have separate read permissions.

# 56. Tamper Evidence

Audit storage shall provide tamper evidence.

Preferred mechanism:

    Event N-1 Hash
          |
          v
    Event N Hash
          |
          v
    Event N+1 Hash

Each event includes a hash derived from:

- canonical event contents;
- previous event hash;
- integrity metadata.

# 57. Hash Chain

Conceptual:

    H0
     |
     v
    Event 1 -> H1
     |
     v
    Event 2 -> H2
     |
     v
    Event 3 -> H3

Modification of Event 2 causes:

    H2 != expected H2

and therefore invalidates subsequent chain verification.

# 58. Partitioning and Hash Chains

Because audit data may be partitioned by time, each partition or audit stream
shall have a defined integrity boundary.

A chain may be maintained:

- globally;
- per partition;
- per organization;
- per logical audit stream.

The chosen model must support independent verification.

# 59. Merkle or Checkpoint Evidence

For large audit volumes, periodic signed checkpoints may be used.

Example:

    Hourly Events
          |
          v
      Merkle Root
          |
          v
      Signed Checkpoint

This provides scalable external integrity evidence.

# 60. Integrity Metadata

Integrity records may contain:

    algorithm
    previous_hash
    event_hash
    key_id
    signature
    checkpoint_id

Cryptographic implementation shall follow the Key Management architecture.

# 61. Integrity Verification

Verification shall detect:

- modified event;
- deleted event;
- reordered event;
- inserted event;
- broken chain;
- invalid checkpoint;
- invalid signature.

# 62. External Evidence

For higher assurance, integrity checkpoints may be copied to an independent
security-controlled system.

The independent copy shall not be writable by ordinary audit administrators.

# 63. Audit Storage Durability

Audit storage shall use durable persistence.

Production audit data shall be backed up.

Backup retention shall satisfy the audit retention policy.

# 64. Audit Replication

Audit data may be replicated to:

- secondary database;
- security analytics system;
- SIEM;
- immutable archive.

Replicas shall preserve tenant and event identity.

# 65. Immutable Archive

Critical audit records should be archived into immutable or write-once
storage where available.

The archive shall preserve:

- original event;
- integrity evidence;
- schema version;
- export metadata;
- timestamps.

# 66. Audit Retention

Retention shall be policy driven.

Initial recommended baseline:

| Audit Type | Retention |
|---|---|
| Security events | Multi-year |
| Authentication | Multi-year |
| Authorization changes | Multi-year |
| Financial/credit audit | Long-term |
| Administrative events | Multi-year |
| Tenant isolation events | Multi-year |
| Configuration changes | Multi-year |
| Routine operational audit | Policy-based |
| Temporary debug events | Short-term |

Exact legal and contractual periods remain policy decisions.

# 67. Retention Classes

Each audit event should have a retention class.

Example:

    STANDARD
    SECURITY
    FINANCIAL
    COMPLIANCE
    CRITICAL

Retention class determines lifecycle policy.

# 68. Legal Hold

The system should support legal or investigation holds.

A held event shall not be deleted by normal retention processing.

Legal hold access shall be restricted and audited.

# 69. Retention Enforcement

Retention jobs shall:

- identify eligible events;
- exclude legal holds;
- verify retention policy;
- archive or delete as permitted;
- record lifecycle actions.

# 70. Audit Deletion

Deletion of audit records shall be exceptional.

If deletion is legally required, the deletion itself must be audited.

Immutable security evidence may require archival rather than deletion.

# 71. Audit Access Control

Audit access follows least privilege.

Roles may include:

    AUDIT_VIEWER
    SECURITY_ANALYST
    COMPLIANCE_AUDITOR
    AUDIT_ADMIN
    SYSTEM_ADMIN

Access shall be organization scoped where the audit data is tenant scoped.

# 72. Customer Audit Access

Customers may access their own audit events where product policy permits.

Customer audit queries shall enforce:

    organization_id = current organization

# 73. Internal Audit Access

Internal security personnel may access broader data only according to their
role and purpose.

Cross-tenant queries require explicit authorization.

# 74. Audit Administration

Audit administrators may configure:

- retention;
- event categories;
- export policy;
- integrity verification;
- alert rules.

These operations are themselves audited.

# 75. Audit Export

Audit export shall support controlled export of:

- time range;
- organization;
- event category;
- event type;
- actor;
- resource;
- outcome.

# 76. Export Authorization

Exports require:

- authenticated principal;
- appropriate audit permission;
- tenant scope;
- valid query;
- export purpose where required.

# 77. Export Integrity

Exports should contain:

- export ID;
- generation timestamp;
- query parameters;
- event count;
- schema version;
- integrity checksum;
- source audit range.

# 78. Export Example

Conceptual metadata:

    {
        "export_id": "exp-001",
        "organization_id": "org-001",
        "generated_at": "2026-10-08T21:00:00Z",
        "from": "2026-10-01T00:00:00Z",
        "to": "2026-10-08T21:00:00Z",
        "event_count": 1823,
        "schema_version": 1,
        "checksum": "sha256:..."
    }

# 79. Export Formats

Initial supported format may include:

- JSON Lines;
- CSV for compliance reporting;
- structured signed archive.

JSON Lines is preferred for machine processing.

# 80. Export Data Safety

Exports shall not include secrets.

Sensitive personal data should be minimized.

Exported data shall inherit the classification of the source audit data.

# 81. Export Audit

Every export must create an audit event:

    audit.export.created

Include:

- actor;
- organization;
- query scope;
- export ID;
- event count;
- outcome.

# 82. Compliance Reporting

Audit data shall support reports such as:

- authentication activity;
- failed login activity;
- privileged access;
- role changes;
- tenant administration;
- artifact approvals;
- credit adjustments;
- booking changes;
- administrative actions;
- security incidents;
- tenant-isolation violations;
- key-management events;
- export activity.

# 83. Compliance Report Model

    Audit Events
         |
         v
    Validated Query
         |
         v
    Report Dataset
         |
         v
    Aggregation
         |
         v
    Compliance Report
         |
         v
    Signed / Exported Evidence

# 84. Report Reproducibility

Compliance reports shall record:

- report ID;
- reporting period;
- query definition;
- data version;
- generation timestamp;
- event count;
- filters;
- generator version.

This allows the report to be reproduced.

# 85. Compliance Evidence

Reports should link back to:

- event IDs;
- export IDs;
- integrity checkpoints.

A compliance report must not become an unsupported summary detached from
underlying evidence.

# 86. Alerting on Audit Events

Security-relevant audit events may trigger alerts.

Examples:

- repeated login failures;
- MFA failures;
- privileged role assignment;
- break-glass use;
- cross-tenant access attempt;
- artifact signing anomaly;
- key misuse;
- unexpected credit adjustment;
- unexpected policy change;
- Lab Agent certificate failure;
- runtime isolation violation.

# 87. Alert Flow

    Audit Event
         |
         v
    Rule Evaluation
         |
         +---- Normal ----> Store
         |
         +---- Suspicious -> Alert
         |
         +---- Critical ---> Incident Response

# 88. Alert Rules

Rules shall support:

- event type;
- severity;
- actor;
- organization;
- resource;
- count;
- time window;
- sequence;
- threshold.

Example:

    10 failed logins
    from one principal
    within 5 minutes
        ->
    security alert

# 89. Critical Alerts

Critical events may require immediate notification.

Examples:

- suspected tenant isolation breach;
- production signing-key misuse;
- unauthorized break-glass access;
- audit integrity failure;
- repeated runtime escape attempts.

# 90. Alert Deduplication

Alerting shall avoid flooding.

Events may be grouped by:

- organization;
- actor;
- resource;
- event type;
- time window.

The original audit events remain immutable.

# 91. Alert Auditability

Alert creation, acknowledgement, escalation and closure shall themselves be
audited.

# 92. SIEM Integration

Audit events may be forwarded to a SIEM.

The SIEM is a derived security analytics system.

Kritva RaaS audit storage remains authoritative for retained audit evidence.

# 93. SIEM Delivery

Delivery should include:

    event_id
    event_type
    severity
    organization_id
    actor
    resource
    occurred_at
    request_id
    trace_id
    outcome
    integrity metadata

# 94. Delivery Failure

If SIEM delivery fails:

- authoritative audit storage must continue operating;
- events must not be silently lost;
- retry or durable outbox mechanisms should be used.

# 95. Outbox Pattern

For external audit/event publication:

    Domain Transaction
          |
          +-- Business State
          |
          +-- Audit Event / Outbox
          |
       COMMIT
          |
          v
       Publisher
          |
          v
       SIEM / Archive

# 96. Audit Event Ordering

Audit events should preserve ordering where meaningful.

Ordering may be based on:

- event timestamp;
- sequence;
- aggregate sequence;
- database transaction ordering.

Distributed events cannot always guarantee global ordering.

# 97. Event Sequence

For resource-specific event streams, an optional sequence can be used:

    resource_id
    sequence = 42

Sequence gaps can indicate:

- missing events;
- delayed delivery;
- processing issues.

# 98. Timestamp Sources

Audit events shall distinguish:

    occurred_at
    recorded_at

`occurred_at` represents when the action happened.

`recorded_at` represents when the audit service persisted the event.

# 99. Clock Synchronization

Production systems shall use synchronized clocks.

Time synchronization shall be monitored.

Audit investigations must account for small clock differences across distributed
components.

# 100. Audit Event Storage API

Conceptual interface:

    AuditEventRepository.append(event)
    AuditEventRepository.get(event_id)
    AuditEventRepository.query(criteria)
    AuditEventRepository.verify_integrity(range)
    AuditEventRepository.export(criteria)

# 101. Audit Service Interface

Conceptual:

    AuditService.record(
        event_type,
        actor,
        organization,
        resource,
        action,
        outcome,
        correlation,
        metadata
    )

The service shall enforce:

- schema validation;
- redaction;
- tenant scope;
- event classification;
- integrity metadata.

# 102. Audit Query Interface

Conceptual request:

    {
        "organization_id": "org-001",
        "from": "2026-10-01T00:00:00Z",
        "to": "2026-10-08T23:59:59Z",
        "event_types": [
            "artifact.approved",
            "artifact.rejected"
        ],
        "outcomes": [
            "SUCCESS",
            "REJECTED"
        ]
    }

Authorization shall be evaluated before query execution.

# 103. Audit Pagination

Audit queries shall use stable pagination.

Preferred:

- cursor-based pagination;
- event ID/time ordering.

Large offset scans should be avoided.

# 104. Audit Search Indexing

Indexes should support:

    organization_id
    occurred_at
    event_type
    actor_id
    resource_id
    request_id
    trace_id
    outcome
    severity

Index design shall be based on actual query patterns.

# 105. Audit Partitioning

High-volume audit tables may be partitioned by time.

Example:

    audit.events
        |
        +-- 2026-10
        +-- 2026-11
        +-- 2026-12

Retention operations become easier with controlled partition lifecycle.

# 106. Tenant-Aware Audit Query

Customer query flow:

    Request
       |
       v
    Authenticate
       |
       v
    Authorize audit.read
       |
       v
    Resolve organization
       |
       v
    Query organization-scoped audit events
       |
       v
    Return results

# 107. Audit Data Classification

Audit records may contain:

- confidential operational information;
- personal information;
- security information;
- tenant metadata.

Audit data shall therefore be treated as protected information.

# 108. Audit Encryption

Audit data shall be encrypted in transit and at rest.

Encryption keys shall follow the Key Management architecture.

# 109. Audit Secrets Protection

Audit pipelines must have automated redaction.

Example prohibited fields:

    password
    access_token
    refresh_token
    private_key
    api_secret
    client_secret

# 110. Audit Logging in Studio

Studio may generate client-side security events such as:

- login;
- logout;
- local session changes;
- artifact signing request;
- upload;
- download.

The authoritative security audit record remains server-side.

Studio logs shall not be treated as authoritative evidence.

# 111. Audit Logging in Local Runtime

Local Runtime may report:

- build;
- package;
- scan;
- signing;
- execution preparation.

Only approved metadata should cross the source-code privacy boundary.

# 112. Audit Logging in Lab Agent

Lab Agent shall audit:

- authentication;
- connection;
- artifact validation;
- resource allocation;
- deployment;
- execution;
- stop;
- cleanup;
- policy rejection;
- device access;
- safety-related stop.

Lab Agent audit events must not expose secrets.

# 113. Robot Audit Boundary

Robot hardware may produce local safety events.

The cloud audit system may receive summarized safety events, but physical safety
records remain subject to local robot/lab requirements.

# 114. Audit and Physical Safety

Audit logging must never delay an emergency stop.

Correct priority:

    Emergency Stop
         >
    Robot Safety
         >
    Runtime Control
         >
    Audit Delivery

Safety-critical stop actions shall succeed even if cloud audit services are
temporarily unavailable.

# 115. Audit Failure Modes

Possible failures:

- database unavailable;
- storage unavailable;
- queue unavailable;
- SIEM unavailable;
- integrity service unavailable;
- clock synchronization failure.

Each event class shall define failure behavior.

# 116. Critical Audit Failure

For operations requiring mandatory audit evidence:

    Business Operation
          |
          v
    Audit Persistence
          |
          +---- FAIL ----> Reject / Controlled Failure
          |
          v
        Commit

For non-critical informational events:

    Event
      |
      v
    Durable Queue
      |
      v
    Retry

# 117. Audit Reconciliation

A reconciliation process should detect:

- missing audit events;
- duplicate event IDs;
- broken hash chains;
- failed SIEM delivery;
- out-of-order sequences;
- retention inconsistencies.

# 118. Audit Integrity Monitoring

Integrity monitoring shall periodically verify:

- hash chains;
- signed checkpoints;
- archive checksums;
- event counts;
- partition consistency.

Failures shall generate high-severity security events.

# 119. Audit Metrics

Operational metrics should include:

- audit events/sec;
- failed writes;
- delayed writes;
- queue depth;
- SIEM delivery failures;
- integrity verification failures;
- export count;
- query latency;
- retention processing failures;
- alert volume.

# 120. Security Metrics

Security monitoring should track:

- authentication failures;
- authorization denials;
- privileged operations;
- break-glass events;
- tenant isolation violations;
- key operations;
- secret detection;
- abnormal exports;
- unusual administrative access.

# 121. Audit Storage Isolation

Audit storage itself shall be protected from tenant tampering.

Customer organizations must not be able to:

- modify audit records;
- delete audit records;
- alter integrity metadata;
- change retention policies;
- disable audit logging.

# 122. Tenant Audit Isolation

Customers may query only their own audit records.

RLS or equivalent tenant filtering shall protect customer-facing audit queries.

# 123. Administrative Audit Isolation

Internal administrators may have broader access according to role.

Administrative cross-tenant access must be:

- authorized;
- reasoned;
- logged;
- monitored.

# 124. Audit Configuration Protection

Changes to audit configuration shall require elevated authorization.

Examples:

- disable event type;
- reduce retention;
- change alert threshold;
- change export policy;
- modify integrity configuration.

# 125. Preventing Audit Bypass

Critical application operations shall use centralized audit APIs or enforced
domain integration.

Developers should not be able to bypass audit requirements by calling database
repositories directly.

# 126. Audit Event Contracts

Event contracts shall be version controlled.

Each event type should define:

- required fields;
- optional fields;
- severity;
- retention class;
- privacy classification;
- tenant scope;
- alert policy;
- compliance relevance.

# 127. Event Contract Example

    event_type:
        artifact.approved

    required:
        event_id
        occurred_at
        organization_id
        actor
        resource
        action
        outcome
        request_id

    retention_class:
        SECURITY

    severity:
        HIGH

    tenant_scoped:
        true

# 128. Audit Schema Evolution

Changes shall be backward compatible where possible.

Historical events must remain interpretable.

Event version changes shall not invalidate old evidence.

# 129. Audit Export Integrity Verification

An exported dataset shall be independently verifiable using:

- event IDs;
- event hashes;
- export checksum;
- signed checkpoint where applicable.

# 130. Compliance Access

Compliance auditors may receive read-only access to approved audit datasets.

They must not receive:

- signing private keys;
- database write access;
- secrets;
- unrestricted production credentials.

# 131. Compliance Report Scheduling

Reports may be generated:

- monthly;
- quarterly;
- annually;
- on demand;
- after security incidents.

Scheduling shall be policy driven.

# 132. Compliance Report Examples

Reports may include:

    Authentication Summary
    Privileged Access Report
    Authorization Change Report
    Artifact Security Report
    Credit Adjustment Report
    Booking Administration Report
    Tenant Isolation Report
    Security Incident Report
    Audit Integrity Report

# 133. Tenant Isolation Report

A tenant-isolation report should summarize:

- cross-tenant access attempts;
- RLS denials;
- object access violations;
- runtime isolation violations;
- network policy violations;
- affected resources;
- investigation status.

# 134. Privileged Access Report

The report should identify:

- administrative users;
- privileged actions;
- target organizations;
- target resources;
- reason;
- approval/delegation;
- timestamps;
- outcomes.

# 135. Audit Incident Response

If audit evidence is suspected to be compromised:

1. Protect current audit storage.
2. Freeze affected retention/deletion processes.
3. Verify integrity checkpoints.
4. Identify affected records.
5. Preserve independent copies.
6. Investigate privileged access.
7. Rotate relevant credentials/keys if required.
8. Restore trustworthy evidence.
9. Document impact.
10. Perform corrective action.

# 136. Audit Disaster Recovery

Audit storage shall be included in disaster recovery planning.

Targets shall align with production database RPO/RTO:

    Initial RPO <= 15 minutes
    Initial RTO <= 4 hours

Audit recovery shall preserve integrity metadata.

# 137. Audit Backup Testing

Backups shall be restored periodically.

Testing shall verify:

- event readability;
- tenant filtering;
- integrity verification;
- retention metadata;
- export capability.

# 138. Audit Retention and Backups

Expired primary records shall not remain indefinitely in unmanaged backups.

Backup retention shall have a defined lifecycle and legal policy.

# 139. Audit Access Monitoring

Reads of sensitive audit records should themselves be auditable.

Examples:

    audit.query
    audit.export
    audit.integrity_verified
    audit.configuration_changed

# 140. Audit Query Privacy

Customer audit queries shall not reveal whether a foreign tenant has records.

Internal audit searches may use broader capabilities under strict access control.

# 141. Audit and Source Privacy

Audit logging must preserve the source-code privacy guarantee.

No audit event may become an accidental source-code exfiltration channel.

Examples of prohibited content:

- source code;
- source file names when sensitive;
- source snippets;
- compiler command lines containing source;
- repository URLs containing secrets.

# 142. Audit and Artifact Security

Audit records should establish artifact provenance:

    Build
      |
      v
    Artifact
      |
      v
    Scan
      |
      v
    Sign
      |
      v
    Upload
      |
      v
    Validate
      |
      v
    Deploy
      |
      v
    Execute

Each significant security boundary should be auditable.

# 143. Audit and Authorization

Authorization decisions for sensitive operations should be correlated to the
resulting audit event.

Example:

    authorization.decision
          |
          v
    artifact.approved

The audit record may include:

    policy_version
    decision_id
    reason_code

# 144. Audit and Secrets

Secret lifecycle events may be audited:

- secret created;
- rotated;
- revoked;
- accessed where policy permits;
- leak detected.

Secret values must never be recorded.

# 145. Audit and Key Management

Key events may include:

- key generated;
- key activated;
- key rotated;
- key revoked;
- key retired;
- signing operation;
- integrity verification failure.

Private key material must never be logged.

# 146. Audit and Tenant Isolation

Tenant isolation violations shall have high audit priority.

They shall include enough information for investigation without exposing the
foreign tenant's sensitive information unnecessarily.

# 147. Audit and Quotas

Quota events should include:

- organization;
- resource;
- quota type;
- requested amount;
- configured limit;
- outcome;
- actor;
- correlation.

# 148. Audit and Noisy-Neighbour Events

Abnormal resource consumption may generate:

    quota.exceeded
    resource.rate_limited
    scheduling.throttled

These events support capacity and abuse investigations.

# 149. Audit and Billing

Financially significant operations require durable audit records.

Credit ledger remains authoritative for financial balances.

Audit records provide the operational history of actions affecting those
balances.

# 150. Audit and Idempotency

Repeated requests with the same idempotency key should not produce misleading
duplicate business actions.

Audit records should distinguish:

    original request
    idempotent replay

# 151. Audit Event Deduplication

Event IDs must be unique.

Consumers must tolerate at-least-once delivery.

Duplicate delivery shall not create duplicate financial or security effects.

# 152. Audit Delivery Semantics

Preferred semantics:

    Local Audit Persistence
        = Durable

    External Delivery
        = At-Least-Once

Consumers should deduplicate using event_id.

# 153. Audit Event Ordering

Where strict ordering is needed, consumers should use:

    aggregate_id
    sequence

rather than relying only on wall-clock timestamps.

# 154. Audit Query Performance

Audit queries shall be bounded by:

- time range;
- tenant;
- indexed filters;
- pagination.

Unbounded production audit queries should be prohibited.

# 155. Large Audit Exports

Large exports should run asynchronously.

Flow:

    Export Request
       |
       v
    Authorization
       |
       v
    Create Export Job
       |
       v
    Generate Dataset
       |
       v
    Integrity Check
       |
       v
    Store Protected Export
       |
       v
    Notify User

# 156. Export Expiration

Generated exports should expire.

Expiration shall remove or disable access according to retention policy.

# 157. Compliance Evidence Chain

A defensible evidence chain is:

    Action
      |
      v
    Audit Event
      |
      v
    Integrity Hash
      |
      v
    Checkpoint
      |
      v
    Immutable Archive
      |
      v
    Compliance Report

# 158. Development Environment

Development may use reduced retention.

However, audit schema and event contracts shall remain representative.

Production-only security controls shall be explicitly documented.

# 159. Environment Isolation

Audit storage must be environment isolated:

    Local
    Development
    Staging
    Production

Production audit events shall never be written to development storage.

# 160. Production Audit Access

Production audit access shall use production-specific identities.

Development credentials shall not access production audit data.

# 161. Testing Environment

Automated tests shall create synthetic audit events.

Test data must not contain production customer information.

# 162. Audit Test Fixtures

Fixtures should include:

- multiple organizations;
- multiple users;
- administrators;
- support users;
- service identities;
- Lab Agents;
- privileged operations;
- denied operations.

# 163. Audit Security Tests

Tests shall verify:

- event generation;
- required fields;
- tenant identity;
- actor identity;
- correlation IDs;
- redaction;
- immutability;
- hash verification;
- authorization;
- retention;
- export;
- alerts.

# 164. Tamper Tests

Tests shall modify:

- event contents;
- event order;
- event deletion;
- event insertion;
- integrity metadata.

Verification must detect each unauthorized modification.

# 165. Audit Access Tests

Tests shall verify:

- customer sees own events;
- customer cannot see another tenant;
- support access is scoped;
- expired delegation fails;
- audit administrator privileges are enforced;
- audit reads are themselves recorded.

# 166. Export Tests

Tests shall verify:

- authorized export succeeds;
- unauthorized export fails;
- tenant scope is preserved;
- secrets are absent;
- checksum verifies;
- export expiration works.

# 167. Retention Tests

Tests shall verify:

- eligible events expire;
- retained events remain;
- legal holds prevent deletion;
- financial/security retention is preserved;
- retention actions are audited.

# 168. Alert Tests

Tests shall verify:

- critical events generate alerts;
- thresholds work;
- duplicate alerts are controlled;
- alert acknowledgement is audited;
- alert closure is audited.

# 169. Compliance Tests

Tests shall verify:

- reports are reproducible;
- event counts match source;
- filters are preserved;
- report period is correct;
- report references underlying evidence;
- integrity checks pass.

# 170. Audit Load Tests

Load testing shall measure:

- event ingestion;
- query latency;
- export generation;
- partition maintenance;
- integrity verification;
- alert throughput.

Audit logging must not become an availability bottleneck.

# 171. Audit Backpressure

If audit volume increases unexpectedly:

- queue durable events;
- apply controlled backpressure;
- preserve critical events;
- avoid silently dropping security events.

# 172. Audit Storage Exhaustion

Storage exhaustion shall generate a critical operational alert.

The platform shall not silently continue with unbounded loss of audit evidence.

# 173. Audit Event Sampling

Security-critical events shall not be sampled.

Sampling may be considered for high-volume low-risk operational events if their
loss does not compromise compliance or investigation requirements.

# 174. Audit and Telemetry Separation

High-frequency telemetry should not be stored as individual audit events.

Instead:

    Telemetry
       |
       v
    Telemetry System

and significant state transitions:

    Telemetry/Event Condition
       |
       v
    Audit Event

# 175. Audit and Application Logs

Application logs are optimized for troubleshooting.

Audit events are optimized for:

- accountability;
- security;
- compliance;
- evidence.

Application logs must not be treated as a substitute for audit events.

# 176. Phase Mapping

| Phase | Audit Logging Focus |
|---|---|
| Phase 0 | Audit architecture and event taxonomy |
| Phase 1 | Core audit schema and persistence |
| Phase 2 | Authentication/authorization audit |
| Phase 3 | Domain events and request correlation |
| Phase 4 | Integrity, retention and export |
| Phase 5 | Lab, runtime and robot audit |
| Phase 6 | Security alerting and SIEM integration |
| Phase 7 | Compliance reporting and audit analytics |
| Phase 8 | Production hardening and independent review |

# 177. Phase 0 Requirements

Define:

- event taxonomy;
- schema;
- criticality;
- retention classes;
- access model;
- integrity model;
- compliance requirements.

# 178. Phase 1 Requirements

Implement:

- audit.events;
- append-only permissions;
- event IDs;
- timestamps;
- tenant identity;
- actor identity;
- request correlation;
- database indexes.

# 179. Phase 2 Requirements

Implement audit coverage for:

- authentication;
- MFA;
- sessions;
- authorization;
- role changes;
- administrative access.

# 180. Phase 3 Requirements

Implement:

- Project events;
- Artifact events;
- Booking events;
- Credit events;
- Job events;
- Run events;
- Result events;
- Experiment events.

# 181. Phase 4 Requirements

Implement:

- hash chaining;
- integrity verification;
- retention policies;
- protected archive;
- export;
- legal hold.

# 182. Phase 5 Requirements

Implement:

- Lab Agent audit;
- robot/resource events;
- runtime events;
- cleanup;
- safety-related audit integration;
- tenant isolation events.

# 183. Phase 6 Requirements

Implement:

- alerting;
- security rules;
- SIEM integration;
- event anomaly detection;
- privileged-access monitoring.

# 184. Phase 7 Requirements

Implement:

- compliance reports;
- scheduled reporting;
- evidence packages;
- audit analytics;
- independent integrity verification.

# 185. Phase 8 Requirements

Implement:

- production audit review;
- penetration testing;
- retention validation;
- disaster recovery testing;
- integrity incident exercise;
- compliance readiness review.

# 186. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Missing critical event | Mandatory event contracts |
| Event modification | Append-only + hash chain |
| Event deletion | Restricted roles + immutable archive |
| Secret leakage | Redaction + schema validation |
| Missing tenant ID | Tenant validation |
| Incorrect actor | Effective principal model |
| Correlation loss | Request/trace propagation |
| Audit database outage | Durable queue / controlled failure |
| SIEM outage | Durable authoritative storage |
| Excessive audit volume | Classification + partitioning |
| Storage exhaustion | Capacity monitoring |
| Retention error | Policy-driven lifecycle |
| Unauthorized audit access | RBAC + tenant scope |
| Export leakage | Authorization + redaction |
| Compliance report mismatch | Reproducible report metadata |
| Hash-chain break | Integrity monitoring |
| Clock drift | Time synchronization |
| Admin abuse | Privileged audit + break-glass |
| Cross-tenant audit access | RLS + authorization |
| Audit bypass | Centralized service integration |
| Performance degradation | Async delivery + indexing |

# 187. Open Questions

1. Which exact audit events are mandatory for the first production release?
2. Which events require transactionally coupled audit persistence?
3. Will the initial implementation use hash chains, signed checkpoints, or
   both?
4. Will immutable object storage be required for all security audit events?
5. What exact retention periods apply to each compliance class?
6. Which jurisdictions and contractual obligations must be supported?
7. Which SIEM integration will be used first?
8. What alerting platform will be authoritative for security alerts?
9. What customer-facing audit history will be exposed?
10. What audit event volume is expected at 5, 10 and 100 robots?
11. Will audit partitioning be time based from the first production release?
12. What legal-hold workflow is required?
13. Will customer audit exports be signed?
14. What independent integrity checkpoint storage will be used?
15. Which administrative operations require dual approval?
16. What exact audit RPO is required independently of general database RPO?
17. How long should audit events remain searchable versus archived?
18. Which personal-data fields require masking or pseudonymization?
19. What audit events should trigger immediate notification?
20. What evidence format will be used for external compliance audits?

# 188. Acceptance Criteria: Event Coverage

- [ ] Authentication events are audited.
- [ ] Authorization events are audited.
- [ ] Organization changes are audited.
- [ ] Membership changes are audited.
- [ ] Project changes are audited.
- [ ] Artifact lifecycle events are audited.
- [ ] Booking lifecycle events are audited.
- [ ] Credit operations are audited.
- [ ] Job lifecycle events are audited.
- [ ] Run lifecycle events are audited.
- [ ] Result lifecycle events are audited.
- [ ] Experiment changes are audited.
- [ ] Lab events are audited.
- [ ] Robot/resource events are audited.
- [ ] Security events are audited.
- [ ] Tenant-isolation violations are audited.
- [ ] Secret lifecycle events are audited without secret values.
- [ ] Key-management events are audited without private key material.
- [ ] Administrative actions are audited.
- [ ] Audit exports are audited.
- [ ] Audit configuration changes are audited.

# 189. Acceptance Criteria: Event Schema

- [ ] Every event has a unique event ID.
- [ ] Event schema is versioned.
- [ ] Event type is controlled.
- [ ] Severity is defined.
- [ ] Timestamp is recorded.
- [ ] Actor is identified where known.
- [ ] Effective principal is represented where applicable.
- [ ] Organization ID is present for tenant-scoped events.
- [ ] Resource identity is represented.
- [ ] Action is represented.
- [ ] Outcome is represented.
- [ ] Reason code is available where appropriate.
- [ ] Request ID is captured where applicable.
- [ ] Trace ID is captured where applicable.
- [ ] Session ID is captured where applicable.
- [ ] Job/run/booking correlation is supported.
- [ ] Metadata is bounded.
- [ ] Sensitive fields are rejected or redacted.

# 190. Acceptance Criteria: Correlation

- [ ] API requests have request IDs.
- [ ] Distributed operations propagate trace IDs.
- [ ] Background jobs retain correlation.
- [ ] Lab Agent operations retain correlation.
- [ ] Run events can be correlated to Jobs.
- [ ] Jobs can be correlated to Bookings.
- [ ] Artifact execution can be correlated to Artifact IDs.
- [ ] Administrative operations preserve actor and effective principal.
- [ ] Idempotent replays are distinguishable.

# 191. Acceptance Criteria: PostgreSQL

- [ ] Audit records have durable PostgreSQL persistence.
- [ ] Audit storage uses an appropriate logical schema.
- [ ] Normal application roles cannot update audit history.
- [ ] Normal application roles cannot delete audit history.
- [ ] Audit readers have explicit permissions.
- [ ] Customer audit queries are tenant scoped.
- [ ] RLS is applied where required.
- [ ] Audit indexes support expected query patterns.
- [ ] Large audit tables have a documented partition strategy.
- [ ] Audit storage is included in backup and recovery.

# 192. Acceptance Criteria: Tamper Evidence

- [ ] Audit records are append oriented.
- [ ] Event hashes are generated correctly.
- [ ] Hash-chain or equivalent integrity verification works.
- [ ] Tampering with event contents is detected.
- [ ] Event deletion is detectable.
- [ ] Event insertion is detectable.
- [ ] Event reordering is detectable where the chosen scheme supports it.
- [ ] Integrity checkpoints are protected.
- [ ] Integrity verification failures generate security alerts.
- [ ] Independent evidence is preserved where required.

# 193. Acceptance Criteria: Retention

- [ ] Every audit class has a retention policy.
- [ ] Security events have multi-year retention or approved policy.
- [ ] Financial events have long-term retention.
- [ ] Tenant-isolation events have extended retention.
- [ ] Legal holds prevent deletion.
- [ ] Retention processing is audited.
- [ ] Expired data is removed or archived according to policy.
- [ ] Backups have defined retention.
- [ ] Retention does not bypass compliance obligations.

# 194. Acceptance Criteria: Access Control

- [ ] Audit access is least privilege.
- [ ] Customer users can access only authorized tenant events.
- [ ] Internal audit users have explicit roles.
- [ ] Cross-tenant access requires elevated authorization.
- [ ] Support access is scoped and time limited.
- [ ] Break-glass audit access is controlled.
- [ ] Audit reads of sensitive data are themselves audited.
- [ ] Audit configuration changes are audited.

# 195. Acceptance Criteria: Export

- [ ] Audit export is authorization protected.
- [ ] Export is tenant scoped.
- [ ] Export IDs are unique.
- [ ] Export metadata is recorded.
- [ ] Export event count is recorded.
- [ ] Export checksum is generated.
- [ ] Export contains no secrets.
- [ ] Export access is audited.
- [ ] Large exports execute asynchronously.
- [ ] Export links expire.
- [ ] Export integrity can be independently verified.

# 196. Acceptance Criteria: Alerting

- [ ] Critical security audit events trigger alerts.
- [ ] Tenant-isolation violations trigger alerts.
- [ ] Break-glass events trigger alerts.
- [ ] Key misuse events trigger alerts.
- [ ] Suspicious authentication patterns trigger alerts.
- [ ] Alert thresholds are configurable.
- [ ] Alert deduplication is implemented.
- [ ] Alert acknowledgement is audited.
- [ ] Alert closure is audited.
- [ ] Alert delivery failures are monitored.

# 197. Acceptance Criteria: Compliance

- [ ] Compliance reports can be generated from authoritative audit data.
- [ ] Reports record reporting periods.
- [ ] Reports record filters.
- [ ] Reports record generation time.
- [ ] Reports record event counts.
- [ ] Reports reference underlying evidence.
- [ ] Reports are reproducible.
- [ ] Integrity verification is available for evidence.
- [ ] Privileged-access reports are supported.
- [ ] Authentication reports are supported.
- [ ] Tenant-isolation reports are supported.
- [ ] Security-event reports are supported.

# 198. Acceptance Criteria: Runtime and Lab

- [ ] Lab Agent events are audited.
- [ ] Resource allocation events are audited.
- [ ] Robot lifecycle events are audited.
- [ ] Runtime deployment is audited.
- [ ] Runtime start/stop is audited.
- [ ] Runtime cleanup is audited.
- [ ] Isolation failures are audited.
- [ ] Device access violations are audited.
- [ ] Safety-related stops are represented appropriately.
- [ ] Emergency-stop operation never depends on cloud audit availability.

# 199. Acceptance Criteria: Reliability

- [ ] Critical audit events cannot be silently dropped.
- [ ] Audit delivery failures are detectable.
- [ ] SIEM failures do not destroy authoritative audit evidence.
- [ ] Audit backpressure is controlled.
- [ ] Storage exhaustion generates alerts.
- [ ] Audit reconciliation detects gaps.
- [ ] Duplicate event IDs are detected.
- [ ] Event integrity failures are detected.
- [ ] Audit recovery is tested.

# 200. Acceptance Criteria: Testing

- [ ] Unit tests cover event construction.
- [ ] Integration tests cover event persistence.
- [ ] RLS tests cover customer audit queries.
- [ ] Cross-tenant audit access tests pass.
- [ ] Redaction tests pass.
- [ ] Correlation tests pass.
- [ ] Hash-integrity tests pass.
- [ ] Tamper tests pass.
- [ ] Retention tests pass.
- [ ] Legal-hold tests pass.
- [ ] Export tests pass.
- [ ] Alert tests pass.
- [ ] Compliance report tests pass.
- [ ] Runtime audit tests pass.
- [ ] Lab Agent audit tests pass.
- [ ] Load tests establish acceptable audit throughput.
- [ ] Disaster recovery tests include audit evidence.
- [ ] Penetration testing includes audit access and tampering.

# 201. Final Audit Logging Invariants

The following invariants are mandatory:

1. Significant security and business actions are auditable.
2. Audit events have stable unique identities.
3. Audit schemas are versioned.
4. Tenant-scoped events identify their organization.
5. Actor identity is preserved.
6. Effective identity is preserved for delegation and impersonation.
7. Sensitive operations are correlated with request and trace identifiers.
8. Audit records are append oriented.
9. Ordinary application users cannot rewrite audit history.
10. Audit records are tamper evident.
11. Integrity failures are detectable.
12. Audit retention is policy controlled.
13. Legal holds override normal deletion.
14. Audit access is least privilege.
15. Customer audit access is tenant isolated.
16. Cross-tenant administrative access is explicit and audited.
17. Audit exports are authorization controlled.
18. Audit exports preserve integrity and provenance.
19. Secrets and private cryptographic material are never logged.
20. Customer source code never enters the audit system.
21. Security-critical audit events are not silently dropped.
22. External SIEM failure does not destroy authoritative audit evidence.
23. Critical audit events can trigger security alerts.
24. Audit configuration changes are themselves audited.
25. Compliance reports are reproducible from authoritative evidence.
26. Audit evidence is included in backup and disaster recovery.
27. Audit logging never compromises physical robot safety.
28. Audit controls are continuously tested.

# 202. Final Audit Architecture

    +-----------------------------------------------------------------------+
    |                         KRITVA RAAS                                  |
    +-----------------------------------------------------------------------+
                                  |
                 +----------------+----------------+
                 |                |                |
                 v                v                v
              Studio          Web/API          Lab Agent
                 |                |                |
                 +----------------+----------------+
                                  |
                                  v
                         +------------------+
                         | Audit Event API  |
                         +--------+---------+
                                  |
                   +--------------+--------------+
                   |                             |
                   v                             v
             Audit Database                Durable Outbox
                   |                             |
                   v                             v
             Integrity Layer              SIEM / Security
                   |                             |
                   v                             v
            Immutable Archive                Alerting
                   |
          +--------+--------+
          |                 |
          v                 v
       Customer          Compliance
        Audit             Reports

The definitive audit-logging principle is:

> Kritva RaaS shall maintain an authoritative, append-oriented and
> tamper-evident audit trail for security-significant and materially
> consequential operations across identity, authorization, tenant
> administration, projects, artifacts, bookings, credits, execution,
> laboratory resources, robots, security controls and administrative
> activity. Every tenant-scoped event shall preserve organization identity,
> actor identity, effective principal where applicable, resource identity,
> timestamp and request correlation. Audit evidence shall be protected from
> ordinary modification, retained according to explicit policy, accessible
> only through least-privilege controls, exportable with integrity evidence,
> and capable of supporting security investigation and reproducible
> compliance reporting. Audit storage shall remain authoritative even when
> downstream SIEM or analytics systems are unavailable, and critical audit
> evidence shall not be silently dropped. Audit logging shall never become a
> dependency for emergency robot safety or physical emergency-stop behavior.
