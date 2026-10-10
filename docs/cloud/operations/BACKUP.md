# Kritva RaaS Production Backup and Recovery

## 1. Document Control

| Item | Value |
|---|---|
| Document | Production Backup and Recovery |
| Path | `docs/cloud/operations/BACKUP.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Scope | Production backup, retention, verification and restore |
| Primary Environment | Production |
| Primary Database | Managed PostgreSQL |
| Binary Storage | Private Object Storage |
| Configuration | Version-controlled configuration + managed configuration store |
| Secrets | Managed Secret Store / KMS-backed secret system |
| Backup Authority | Defined per data class |
| Recovery Authority | Durable state + reconciliation |
| Initial Region Model | Single primary region |
| DR Model | Restore/recovery-oriented |
| Phase Coverage | Phase 0–Phase 8 |

## 2. Purpose

This document defines the production backup and recovery strategy for Kritva
RaaS.

The objective is to ensure that critical production state can be recovered
after:

- accidental deletion;
- application failure;
- database corruption;
- storage failure;
- credential compromise;
- operator error;
- infrastructure failure;
- regional outage;
- deployment failure;
- ransomware or destructive security incident;
- other catastrophic operational events.

Backup is not considered complete merely because a backup job reports success.

The production backup system must provide:

- defined scope;
- defined ownership;
- scheduled execution;
- encryption;
- retention;
- integrity verification;
- restore testing;
- recovery objectives;
- auditability;
- operational monitoring;
- documented recovery procedures.

## 3. Scope

This document covers backup and recovery for:

- PostgreSQL;
- PostgreSQL point-in-time recovery;
- object storage;
- artifacts;
- results;
- logs;
- telemetry;
- reports;
- configuration;
- infrastructure definitions;
- deployment metadata;
- critical operational state;
- secrets and key material;
- backup metadata;
- audit records where required.

## 4. Non-Goals

This document does not define:

- detailed application schema;
- detailed cloud-provider backup implementation;
- robot firmware backup;
- complete source-code repository backup policy;
- physical robot configuration procedures;
- payment-provider internal backup mechanisms;
- final legal retention periods.

## 5. Backup Principles

Production backup follows these principles:

1. Critical data must have an explicit recovery strategy.
2. PostgreSQL remains authoritative for structured business state.
3. Object storage remains authoritative for large binary objects.
4. Backups must be encrypted.
5. Backup access must be least privilege.
6. Backups must be isolated from normal application access.
7. Backup success must be independently verified.
8. Restore tests are mandatory.
9. RPO must be measurable.
10. RTO must be measurable.
11. Backup retention must be policy-driven.
12. Production backups must not depend on the application being healthy.
13. Backup failures must generate alerts.
14. Restore failures must generate alerts.
15. Critical backups must survive ordinary operator mistakes.
16. Recovery must include reconciliation.
17. Secrets must not be copied into ordinary backup repositories.
18. Backup metadata must be auditable.
19. Backup procedures must be reviewed periodically.
20. Disaster recovery must be tested, not merely documented.

# 6. Recovery Model

The recovery architecture is:

    Production
       |
       +----------------------+
       |                      |
       v                      v
    PostgreSQL           Object Storage
       |                      |
    PITR / Backup         Versioning /
       |                  Replication /
       |                    Backup
       +----------+-----------+
                  |
                  v
          Protected Backup Store
                  |
             Verification
                  |
                  v
           Restore Environment
                  |
            Validation
                  |
                  v
          Production Recovery
                  |
                  v
            Reconciliation
                  |
                  v
          Normal Operations

## 7. Recovery Philosophy

Recovery must restore the authoritative state first.

The preferred order is:

    Infrastructure
        |
    Identity / Secrets
        |
    PostgreSQL
        |
    Object Storage
        |
    Application
        |
    Queue / Workers
        |
    Lab Connectivity
        |
    Reconciliation
        |
    Customer Operations

External state must not be assumed to match restored cloud state.

## 8. Recovery Domains

Recovery is divided into:

- database recovery;
- object recovery;
- configuration recovery;
- secret recovery;
- infrastructure recovery;
- application recovery;
- Lab/robot reconciliation.

Each domain has a separate owner and validation procedure.

# 9. Data Classification for Backup

| Data Class | Example | Backup Requirement |
|---|---|---|
| Critical Structured | PostgreSQL business state | Mandatory |
| Critical Binary | Accepted `.krv` artifacts | Mandatory |
| Critical Results | Customer result files | Mandatory |
| Operational | Logs, reports | Policy-based |
| Telemetry | Robot telemetry | Policy-based |
| Configuration | Runtime configuration | Mandatory |
| Infrastructure | IaC | Version-controlled + backup |
| Secrets | Credentials/keys | Managed secure recovery |
| Audit | Audit records | Retention-driven |

# 10. PostgreSQL Backup

PostgreSQL is the highest-priority application backup target.

It contains:

- users and organizations;
- memberships;
- projects;
- platforms;
- artifacts metadata;
- bookings;
- credit wallets;
- credit ledger;
- Jobs;
- Runs;
- Labs;
- resources;
- results metadata;
- idempotency records;
- audit records;
- reconciliation state.

## 11. PostgreSQL Recovery Mechanisms

Production should use:

- managed automated backups;
- point-in-time recovery;
- transaction/WAL-based recovery where supported;
- periodic logical backups where operationally useful.

The managed database backup facility is the primary recovery mechanism.

Logical exports provide an additional recovery path.

## 12. PostgreSQL Backup Schedule

Initial baseline:

| Backup | Schedule |
|---|---|
| Continuous/WAL | Continuous where supported |
| Automated snapshot | Daily |
| Logical export | Daily or policy-defined |
| Extended snapshot | Weekly |
| Recovery validation | Periodic |
| Full DR restore | Quarterly or risk-based |

Exact schedules may be adjusted after production validation.

## 13. PostgreSQL Point-in-Time Recovery

PITR must support recovery to a selected point within the configured retention
window.

PITR is required because the most recent snapshot alone may not protect
against:

- accidental deletion;
- bad migration;
- application corruption;
- erroneous administrative action.

## 14. PostgreSQL Backup Consistency

Backups must be transactionally consistent.

A backup must not produce a database state that cannot be recovered into a
valid PostgreSQL instance.

## 15. PostgreSQL Backup Verification

Verification should include:

- backup completion;
- backup metadata;
- checksum/integrity where supported;
- expected database size;
- WAL continuity where applicable;
- restore test.

A successful backup status alone is insufficient.

## 16. PostgreSQL Logical Backup

Logical backup should be retained as an additional recovery mechanism.

It may be used for:

- table-level recovery;
- schema inspection;
- migration recovery;
- data extraction;
- forensic investigation.

Logical backup is not a replacement for PITR.

## 17. PostgreSQL Restore

Restore flow:

    Select Recovery Point
          |
    Provision Restore Instance
          |
    Restore Snapshot / PITR
          |
    Validate PostgreSQL
          |
    Validate Schema
          |
    Validate Critical Tables
          |
    Validate Constraints
          |
    Validate Ledger
          |
    Validate Booking State
          |
    Application Compatibility Check

## 18. PostgreSQL Critical Validation

After restore verify:

- schema version;
- migrations;
- users;
- organizations;
- projects;
- bookings;
- credit ledger;
- Jobs;
- Runs;
- Labs;
- resources;
- artifacts metadata;
- result metadata;
- audit records.

## 19. PostgreSQL Recovery Point Objective

Initial target:

> **RPO: up to 15 minutes for critical PostgreSQL business state, subject to
> final provider capabilities and production architecture validation.**

The target must be measured against actual backup/WAL capability.

The final approved RPO remains an operational decision.

## 20. PostgreSQL Recovery Time Objective

Initial planning target:

> **RTO: within 4 hours for a major database recovery event.**

The final RTO must be validated through restore testing.

## 21. Object Storage Backup

Object storage contains large immutable or semi-immutable data.

Important classes include:

- `.krv` artifacts;
- result files;
- reports;
- logs;
- video;
- telemetry;
- operational exports.

## 22. Object Storage Recovery Model

Object storage recovery should combine:

- versioning;
- lifecycle policies;
- replication where required;
- backup/copy;
- deletion protection where available.

Not every object requires identical retention.

## 23. Artifact Protection

Accepted `.krv` artifacts are immutable.

Protection includes:

- object versioning;
- checksum;
- artifact ID;
- SHA-256 digest;
- retention;
- restricted deletion;
- optional object lock/immutability where justified.

## 24. Result Protection

Results may be regenerated in some cases, but customer-visible results must
be treated as recoverable data.

Critical result files should have:

- versioning;
- retention;
- checksum;
- metadata relationship to Run.

## 25. Logs and Telemetry

Logs and telemetry are generally lower priority than authoritative business
state.

Retention may use:

- hot storage;
- warm storage;
- cold/archive storage.

Long-term retention should be driven by:

- compliance;
- incident investigation;
- product requirements;
- cost.

## 26. Video

Video may be high-volume.

The backup policy must distinguish:

- required result video;
- temporary live stream data;
- retained experiment recordings.

Not all live-stream data requires long-term backup.

## 27. Object Storage Schedule

Initial baseline:

| Data | Protection |
|---|---|
| Accepted Artifacts | Continuous + versioning |
| Results | Continuous + versioning |
| Critical Reports | Continuous |
| Logs | Lifecycle/archive |
| Telemetry | Lifecycle/archive |
| Video | Policy-based |
| Backups | Separate protected storage |

## 28. Object Storage Verification

Verification should periodically check:

- object count;
- expected prefixes;
- checksums;
- metadata references;
- missing objects;
- orphan objects;
- inaccessible objects.

## 29. Database/Object Reconciliation

A reconciliation process should detect:

    PostgreSQL Artifact Metadata
              |
              v
       Expected Object
              |
              v
        Object Storage
              |
         +----+----+
         |         |
       FOUND     MISSING
         |         |
      VALID      ALERT

The same principle applies to result files.

## 30. Configuration Backup

Configuration includes:

- environment configuration;
- application configuration;
- deployment configuration;
- protocol configuration;
- platform configuration;
- resource definitions;
- monitoring configuration;
- alert rules;
- infrastructure configuration.

## 31. Configuration Authority

Configuration should have an explicit source of truth.

Preferred sources:

- Git;
- IaC;
- controlled configuration store.

Production runtime configuration must not exist only as undocumented manual
changes.

## 32. Configuration Backup

Configuration recovery should use:

- version-controlled Git history;
- protected repository;
- configuration snapshots where required;
- encrypted backup for non-Git configuration.

## 33. Infrastructure-as-Code

Production infrastructure definitions must be version-controlled.

Backup/recovery must preserve:

- network;
- compute;
- database;
- storage;
- queue;
- secrets integration;
- monitoring;
- alerting;
- deployment configuration.

## 34. Secret Recovery

Secrets require special handling.

Secrets must not be copied into ordinary application backup archives.

Secret recovery should use:

- managed Secret Store;
- KMS/HSM-backed keys;
- provider-supported secure backup;
- documented recovery procedures.

## 35. Secret Backup Scope

Secret recovery may include:

- database credentials;
- API credentials;
- Lab Agent credentials;
- signing keys;
- encryption keys;
- provider credentials;
- identity configuration.

Only necessary secret material should be recoverable.

## 36. Secret Recovery Separation

Secret backup access must be separated from ordinary application backup access.

Example:

    Backup Operator
        |
      Data
        |
    DB/Object Storage

    Security Operator
        |
      Secrets
        |
    KMS / Secret Store

This reduces compromise blast radius.

## 37. Encryption at Rest

All production backups must be encrypted at rest.

Preferred model:

- provider-managed encryption;
- customer-managed keys where justified;
- KMS-backed key management.

## 38. Encryption in Transit

Backup transfers must use encrypted channels.

No backup data may traverse untrusted networks in plaintext.

## 39. Key Management

Encryption keys require:

- restricted access;
- rotation policy;
- audit logging;
- recovery procedure;
- separation of duties where practical.

Loss of encryption keys must be treated as a recovery incident.

## 40. Backup Isolation

Backup storage should be isolated from application runtime permissions.

The application should not be able to:

- delete all backups;
- modify historical backups;
- disable retention;
- access backup encryption keys directly.

## 41. Immutable Backups

Where supported and justified, critical backups should use immutability or
write-once retention controls.

This protects against:

- ransomware;
- malicious deletion;
- operator error.

## 42. Backup Account Separation

Critical backups should preferably reside in a protected account/project or
logically isolated backup boundary.

The production application identity should not have unrestricted access to
backup repositories.

## 43. Retention Model

Retention should be policy-based.

Initial example:

| Backup Type | Retention |
|---|---:|
| PITR | 14–30 days |
| Daily DB snapshots | 30 days |
| Weekly snapshots | 12 weeks |
| Monthly snapshots | 12 months |
| Logical exports | 30–90 days |
| Critical artifacts | Product-defined |
| Results | Product/compliance-defined |
| Audit data | Compliance-defined |

Final retention must be approved before production launch.

## 44. Retention Principles

Retention must balance:

- recoverability;
- compliance;
- customer expectations;
- cost;
- privacy;
- security.

Retention must not be indefinite by default.

## 45. Backup Expiration

Backup expiration must be automated.

Manual deletion of protected backups should require elevated authorization.

## 46. Backup Lifecycle

    Hot
      |
    Recent
      |
    Warm
      |
    Archive
      |
    Expire

Lifecycle policies should be version-controlled where possible.

## 47. Cross-Region Protection

Critical backups should have a cross-region recovery strategy where supported.

Initial production may remain single-region for active operation.

Backup copies should not necessarily depend on the same failure domain as
primary production.

## 48. Regional Recovery

Regional recovery flow:

    Primary Region Failure
            |
       Activate DR
            |
    Provision Infrastructure
            |
    Restore Database
            |
    Restore Object Data
            |
    Restore Configuration
            |
    Restore Secrets
            |
    Deploy Application
            |
    Validate
            |
    Reconcile External State
            |
    Resume Service

## 49. Backup Monitoring

Monitor:

- backup success;
- backup failure;
- backup age;
- backup duration;
- backup size;
- storage usage;
- encryption status;
- replication status;
- restore-test status.

## 50. Backup Alerts

Critical alerts include:

- database backup failure;
- backup older than RPO;
- PITR unavailable;
- backup storage unavailable;
- restore test failure;
- encryption/key failure;
- object replication failure.

## 51. Backup SLI

A useful backup SLI is:

    Backup Freshness =
    Current Time - Latest Valid Recovery Point

Alert when freshness exceeds the approved RPO.

## 52. Backup SLO

Initial target:

> 99.9% of required backup intervals should have a valid recoverable recovery
> point within the approved RPO window.

This metric must be refined after operational data is available.

## 53. Backup Verification

Verification has multiple levels:

1. Job completion.
2. Backup metadata validation.
3. Integrity validation.
4. Restore validation.
5. Application validation.

Level 1 alone is insufficient.

## 54. Restore Testing

Restore tests must be performed regularly.

Restore testing must include:

- database;
- critical object data;
- configuration;
- application startup;
- critical workflows.

## 55. Restore Test Environment

Restore tests should preferably use isolated infrastructure.

Example:

    Production Backup
          |
          v
    Isolated Restore Environment
          |
    PostgreSQL + Object Storage
          |
    Application
          |
    Smoke / Integrity Tests
          |
    Destroy Test Environment

Production must not be modified during normal restore testing.

## 56. Restore Test Schedule

Initial baseline:

| Test | Frequency |
|---|---|
| Automated backup verification | Every backup |
| Automated integrity checks | Daily/continuous |
| Database restore test | Monthly |
| Object restore test | Monthly |
| Full application recovery | Quarterly |
| DR exercise | Quarterly or risk-based |

## 57. Restore Test Evidence

Record:

- test ID;
- backup ID;
- recovery point;
- start time;
- restore duration;
- validation results;
- failures;
- corrective actions;
- operator;
- environment.

## 58. Restore Success Criteria

A restore test succeeds only if:

- infrastructure starts;
- database restores;
- schema is valid;
- critical data is present;
- objects are accessible;
- application starts;
- critical health checks pass;
- key workflows pass;
- recovery duration is measured.

## 59. RPO Definition

Recovery Point Objective defines:

> The maximum acceptable amount of data that may be lost measured backward
> from the incident.

For Kritva RaaS, RPO must be defined separately where useful for:

- PostgreSQL;
- artifacts;
- results;
- telemetry;
- logs;
- video.

## 60. Initial RPO Targets

| Data | Initial RPO |
|---|---:|
| PostgreSQL business state | ≤15 min |
| Accepted artifacts | Near-zero / version-protected |
| Critical results | ≤15–60 min |
| Audit data | ≤15 min |
| Telemetry | Policy-based |
| Logs | Policy-based |
| Video | Policy-based |

These are planning targets until formally approved.

## 61. RTO Definition

Recovery Time Objective defines:

> The maximum acceptable time to restore the service after a defined failure.

RTO should be defined separately for:

- control plane;
- database;
- artifact access;
- customer results;
- Lab connectivity.

## 62. Recovery Priority

Priority order:

    1. Identity / Access
    2. PostgreSQL
    3. Object Storage
    4. Control Plane
    5. Queue / Workers
    6. Booking / Credits
    7. Lab Connectivity
    8. Realtime / Telemetry
    9. Non-critical Historical Data

## 63. Queue Recovery

Queue contents may be recoverable through provider mechanisms, but business
state remains in PostgreSQL.

After recovery:

- inspect pending operations;
- replay safe messages;
- reconcile Jobs;
- reconcile Runs;
- prevent duplicate financial effects.

## 64. Idempotency During Recovery

Recovery must preserve idempotency.

Operations such as:

- credit consumption;
- refund;
- booking;
- resource allocation;
- Job start

must not execute twice because of recovery replay.

## 65. Outbox Recovery

Transactional outbox records must be included in PostgreSQL recovery.

After restore:

    PostgreSQL Restore
          |
      Outbox State
          |
      Re-publish Safely
          |
      Idempotent Consumers
          |
      Durable Event Delivery

## 66. Event Recovery

Critical event delivery should be reconstructable from durable state.

WebSocket events may be replayed or regenerated.

Durable state remains authoritative.

## 67. Booking Recovery

After restore:

- identify active bookings;
- identify expired bookings;
- query actual resource state;
- reconcile allocation;
- prevent duplicate reservation.

## 68. Credit Recovery

After restore:

- validate ledger;
- calculate balances;
- compare with external payment records where applicable;
- reconcile pending transactions;
- freeze affected operations if integrity is uncertain.

## 69. Job Recovery

After restore:

- identify non-terminal Jobs;
- identify non-terminal Runs;
- compare with Lab Agent/resource state;
- classify as recoverable, failed, cancelled or reconciliation-required.

## 70. Lab Recovery

After cloud recovery:

    Cloud Restored
         |
    Lab Agent Reconnect
         |
    Agent Authentication
         |
    Resource Inventory
         |
    Actual Robot State
         |
    Reconcile
         |
    Resume / Stop / Manual Review

## 71. Robot Recovery

Cloud restoration must not automatically assume a robot is safe to resume.

The Lab Agent and local safety system remain authoritative for physical state.

A recovered Job may require manual review before restarting.

## 72. Backup Ownership

| Area | Primary Owner | Secondary |
|---|---|---|
| PostgreSQL | DBA/SRE | Cloud |
| Object Storage | Cloud/SRE | Backend |
| Configuration | DevOps/SRE | Architecture |
| IaC | DevOps/Cloud | SRE |
| Secrets | Security | SRE |
| Artifacts | Backend | Cloud |
| Results | Backend | SRE |
| Audit | Security | Backend |
| Lab State | Lab Integration | SRE |
| DR | SRE | Architecture |

## 73. Backup Operator Responsibilities

Operators must:

- monitor backup jobs;
- investigate failures;
- verify backup freshness;
- review alerts;
- execute approved restore tests;
- maintain evidence;
- escalate failures.

## 74. Application Team Responsibilities

Application teams must:

- define critical data;
- ensure migrations are recoverable;
- maintain compatibility;
- validate restored workflows;
- provide recovery scripts where required;
- support reconciliation.

## 75. Security Responsibilities

Security owns:

- secret recovery controls;
- encryption policies;
- key protection;
- access reviews;
- backup access auditing;
- security incident recovery requirements.

## 76. Database Responsibilities

Database ownership includes:

- backup configuration;
- PITR;
- database integrity;
- restore testing;
- retention;
- performance;
- recovery evidence.

## 77. Lab Responsibilities

Lab operations owns:

- Lab Agent state;
- resource inventory;
- robot state;
- physical safety;
- post-DR reconciliation.

## 78. Access Control

Backup access must be least privilege.

Roles should distinguish:

- backup observer;
- backup operator;
- restore operator;
- database administrator;
- security administrator.

## 79. Restore Authorization

Production restore requires explicit authorization.

Restore to a test environment may have a lower approval threshold.

Production destructive restore requires incident or change authority.

## 80. Backup Audit

Audit:

- backup creation;
- deletion;
- retention changes;
- restore;
- access;
- encryption changes;
- key changes;
- policy changes.

## 81. Backup Integrity

Integrity verification should include:

- checksums;
- object digests;
- database consistency;
- backup metadata;
- restore validation.

## 82. Artifact Digest

Artifacts should retain:

    artifact_id
    sha256_digest
    object_location
    creation_time
    version
    platform_id

The digest allows verification after recovery.

## 83. Object Versioning

Object versioning protects against accidental overwrite/deletion.

Versioning must be paired with lifecycle controls to prevent uncontrolled storage
growth.

## 84. Deletion Protection

Critical data should use deletion protection where supported.

Administrative deletion must require stronger authorization than normal object
access.

## 85. Backup Repository Security

Backup repositories should:

- remain private;
- use encryption;
- restrict network access;
- restrict identities;
- log access;
- support retention policy;
- resist application compromise.

## 86. Backup Credentials

Backup credentials must:

- be unique;
- be scoped;
- not be embedded in source code;
- not be shared;
- be rotated.

## 87. Backup Failure Handling

When a backup fails:

    Backup Failure
         |
    Alert
         |
    Determine Last Valid Recovery Point
         |
    Compare With RPO
         |
    Retry / Repair
         |
    Escalate if RPO at Risk
         |
    Verify New Backup
         |
    Close

## 88. RPO Breach

If latest valid recovery point exceeds the RPO:

- SEV2 or higher operational alert;
- notify backup owner;
- investigate;
- restore backup capability;
- document exposure window.

If critical data may be lost, escalate according to incident severity.

## 89. Restore Failure

Restore failure requires:

- preserve evidence;
- identify failed layer;
- retry in isolated environment;
- escalate to owner;
- determine whether alternate backup exists;
- assess RPO/RTO impact.

A backup that cannot be restored is not considered operationally valid.

## 90. Backup Capacity

Monitor:

- backup volume;
- snapshot count;
- object storage;
- archive storage;
- backup growth rate;
- retention cost.

Capacity must be planned before backup retention causes exhaustion.

## 91. Cost Management

Backup cost should be controlled through:

- lifecycle policies;
- compression;
- deduplication where available;
- appropriate retention;
- archive tiers;
- removal of expired backups.

Cost controls must never silently violate retention policy.

## 92. Compliance

Backup and retention policies must support applicable:

- privacy requirements;
- customer agreements;
- security obligations;
- financial records requirements;
- audit requirements.

Final compliance retention remains subject to legal and contractual review.

## 93. Data Deletion

Customer deletion requests must be reconciled with backup retention.

Deletion from active systems does not necessarily imply immediate deletion from
protected backups.

Retention policy must define when deleted data naturally expires from backups.

## 94. Backup Testing During Releases

High-risk releases should verify:

- backup freshness;
- migration recovery;
- rollback capability;
- restore compatibility.

Database schema changes must be tested against recovery procedures.

## 95. Migration Recovery

Database migrations should follow:

    Expand
      |
    Deploy Compatible Version
      |
    Validate
      |
    Backfill
      |
    Contract Later

This reduces dependence on destructive database rollback.

## 96. Backup Before Migration

Critical schema migrations should confirm a valid recovery point before
execution.

For high-risk migrations, an explicit backup or snapshot may be required.

## 97. Monitoring Integration

Backup metrics should integrate with production monitoring.

Monitor:

- last successful backup;
- backup age;
- backup duration;
- backup size;
- restore-test age;
- restore-test result.

## 98. Alerting Integration

Alerting should include:

- `DBBackupFailed`;
- `BackupFreshnessExceeded`;
- `PITRUnavailable`;
- `ObjectBackupFailed`;
- `RestoreTestFailed`;
- `BackupEncryptionFailure`;
- `BackupStorageCapacityHigh`.

Each alert must have an owner and runbook.

## 99. Runbooks

Required runbooks include:

- PostgreSQL backup failure;
- PostgreSQL PITR recovery;
- object restore;
- secret recovery;
- full application recovery;
- regional DR;
- restore-test failure;
- RPO breach;
- backup repository compromise.

## 100. Backup Runbook Structure

Each backup runbook should contain:

- purpose;
- symptoms;
- prerequisites;
- access requirements;
- validation;
- commands/procedures;
- rollback;
- escalation;
- evidence;
- post-recovery checks.

## 101. Backup Documentation

Recovery documentation must be version-controlled.

Production operators must not depend on undocumented individual knowledge.

## 102. Backup Configuration as Code

Where supported:

    Backup Policy
        |
      Git
        |
      Review
        |
       CI
        |
    Development
        |
    Staging Validation
        |
    Production

Manual backup-policy changes must be audited.

## 103. Recovery Environment

A recovery environment should be reproducible through IaC.

It should provide:

- network;
- compute;
- PostgreSQL;
- object storage;
- queue;
- secrets integration;
- observability.

## 104. Recovery Validation Workflow

    Restore
      |
    Infrastructure Health
      |
    Database Health
      |
    Storage Health
      |
    Application Health
      |
    Authentication
      |
    Project Access
      |
    Booking Query
      |
    Artifact Access
      |
    Job State
      |
    Result Access
      |
    Reconciliation

## 105. Production Recovery Cutover

Production cutover after DR requires:

- incident approval;
- recovery validation;
- DNS/traffic strategy;
- database authority confirmation;
- object availability;
- secrets availability;
- application validation;
- Lab Agent reconnection.

## 106. Recovery Evidence

Every real recovery must record:

- incident ID;
- recovery point;
- restore source;
- start time;
- end time;
- operators;
- affected services;
- data validation;
- reconciliation;
- customer impact;
- lessons learned.

## 107. Backup Review Cadence

| Activity | Frequency |
|---|---|
| Backup job review | Daily |
| Backup freshness review | Daily |
| Backup storage review | Weekly |
| Retention review | Monthly |
| Restore test | Monthly |
| Access review | Monthly |
| Full recovery test | Quarterly |
| DR exercise | Quarterly/risk-based |
| Policy review | Quarterly |

## 108. Backup Access Review

Review:

- backup operators;
- restore operators;
- database administrators;
- security administrators;
- service identities.

Remove unnecessary privileges.

## 109. Backup Policy Review

Review:

- RPO;
- RTO;
- retention;
- encryption;
- restore success;
- cost;
- storage growth;
- compliance requirements.

## 110. Phase Mapping

| Phase | Backup Objective |
|---|---|
| Phase 0 | Define recovery architecture |
| Phase 1 | Establish PostgreSQL/object/config backup |
| Phase 2 | Protect artifacts/resources |
| Phase 3 | Protect async execution state |
| Phase 4 | Protect commercial state |
| Phase 5 | Protect remote execution state |
| Phase 6 | Enable Lab/robot reconciliation |
| Phase 7 | Protect realtime/result data |
| Phase 8 | Full DR and production recovery maturity |

## 111. Phase 0

Define:

- data classes;
- ownership;
- RPO;
- RTO;
- retention;
- encryption;
- restore strategy.

Acceptance:

- [ ] recovery architecture approved;
- [ ] critical data identified;
- [ ] RPO/RTO targets documented.

## 112. Phase 1

Implement:

- PostgreSQL backup;
- PITR;
- object storage protection;
- configuration recovery;
- secret recovery.

Acceptance:

- [ ] backups complete;
- [ ] encryption enabled;
- [ ] restore test passes.

## 113. Phase 2

Add:

- artifact protection;
- platform/resource metadata;
- object reconciliation.

Acceptance:

- [ ] accepted artifacts are recoverable;
- [ ] missing objects are detectable.

## 114. Phase 3

Add:

- queue recovery;
- outbox recovery;
- Job/Run reconciliation.

Acceptance:

- [ ] asynchronous state survives restore;
- [ ] duplicate execution is prevented.

## 115. Phase 4

Add:

- booking recovery;
- credit ledger recovery;
- billing reconciliation.

Acceptance:

- [ ] financial integrity survives restore;
- [ ] booking integrity survives restore.

## 116. Phase 5

Add:

- execution-state recovery;
- artifact deployment recovery;
- Job/Run reconciliation.

Acceptance:

- [ ] active Jobs are classified correctly;
- [ ] recovery cannot create unsafe duplicate execution.

## 117. Phase 6

Add:

- Lab Agent recovery;
- resource reconciliation;
- robot-state reconciliation.

Acceptance:

- [ ] Agents reconnect securely;
- [ ] resource state is reconciled;
- [ ] safety authority remains local.

## 118. Phase 7

Add:

- result recovery;
- telemetry recovery;
- video policy.

Acceptance:

- [ ] critical results recover;
- [ ] telemetry policy is validated;
- [ ] realtime systems reconcile.

## 119. Phase 8

Complete:

- full restore;
- DR;
- cross-region protection where required;
- operational evidence;
- compliance.

Acceptance:

- [ ] RPO tested;
- [ ] RTO tested;
- [ ] full recovery test passes.

# 120. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Backup job succeeds but data is corrupt | Critical | Restore testing |
| RPO exceeded | Critical | Freshness monitoring |
| Backup deletion | Critical | Isolation/immutability |
| Encryption key loss | Critical | Key recovery |
| Ransomware | Critical | Isolated immutable backups |
| Wrong retention | High | Policy review |
| Restore incompatibility | Critical | Regular restore tests |
| Object/database mismatch | High | Reconciliation |
| Secret loss | Critical | Secure secret recovery |
| Backup storage exhaustion | High | Capacity monitoring |
| Regional outage | Critical | DR/cross-region protection |
| Duplicate execution after recovery | Critical | Idempotency/reconciliation |
| Credit duplication | Critical | Immutable ledger/idempotency |
| Booking duplication | High | Transactional constraints |
| Incomplete audit data | High | Retention policy |
| Excessive backup cost | Medium | Lifecycle management |
| Undocumented recovery process | High | Runbooks/testing |
| Privileged backup misuse | High | IAM/audit |
| Stale backup | Critical | Freshness alerts |
| Restore test not representative | High | Full workflow validation |

# 121. Open Questions

1. Final PostgreSQL backup provider and tier.
2. Final PITR retention.
3. Final PostgreSQL RPO.
4. Final PostgreSQL RTO.
5. Final object-storage replication policy.
6. Final cross-region backup strategy.
7. Final backup region.
8. Final backup encryption-key ownership.
9. Final KMS/HSM strategy.
10. Final immutable backup mechanism.
11. Final logical backup schedule.
12. Final snapshot retention.
13. Final artifact retention.
14. Final result retention.
15. Final telemetry retention.
16. Final video retention.
17. Final audit retention.
18. Final secret recovery mechanism.
19. Final restore-test environment.
20. Final DR environment.
21. Final DR cutover procedure.
22. Final compliance requirements.
23. Final customer deletion/backup retention policy.
24. Final backup cost budget.
25. Final recovery approval authority.

# 122. Full Acceptance Criteria

## Scope

- [ ] PostgreSQL is covered.
- [ ] PITR is covered.
- [ ] Object storage is covered.
- [ ] Artifacts are covered.
- [ ] Results are covered.
- [ ] Logs are covered.
- [ ] Telemetry is covered.
- [ ] Configuration is covered.
- [ ] Infrastructure definitions are covered.
- [ ] Secrets are covered.
- [ ] Audit data is covered.

## PostgreSQL

- [ ] Automated backups are enabled.
- [ ] PITR is enabled where supported.
- [ ] Daily snapshots are configured.
- [ ] Retention is configured.
- [ ] Backup freshness is monitored.
- [ ] Logical backup strategy exists.
- [ ] Restore test is successful.
- [ ] Critical tables are validated after restore.
- [ ] Credit ledger is validated.
- [ ] Booking state is validated.
- [ ] Job/Run state is validated.

## Object Storage

- [ ] Versioning is enabled where required.
- [ ] Critical artifacts are protected.
- [ ] Results are protected.
- [ ] Checksums are validated.
- [ ] Lifecycle policies exist.
- [ ] Backup/replication policy exists.
- [ ] Missing-object detection exists.
- [ ] Object restore is tested.

## Configuration

- [ ] Production configuration has an authoritative source.
- [ ] IaC is version-controlled.
- [ ] Monitoring configuration is version-controlled.
- [ ] Alert configuration is version-controlled.
- [ ] Recovery environment can be recreated.

## Secrets

- [ ] Secrets are stored in managed secret infrastructure.
- [ ] Secrets are excluded from ordinary backups.
- [ ] Secret recovery is documented.
- [ ] Encryption keys are protected.
- [ ] Secret access is audited.
- [ ] Secret recovery has an owner.

## Encryption

- [ ] Backups are encrypted at rest.
- [ ] Backup transfers are encrypted.
- [ ] Encryption keys are managed securely.
- [ ] Key access is least privilege.
- [ ] Key recovery is documented.
- [ ] Key rotation is defined.

## Retention

- [ ] PITR retention is defined.
- [ ] Daily snapshot retention is defined.
- [ ] Weekly retention is defined.
- [ ] Monthly retention is defined.
- [ ] Object retention is defined.
- [ ] Audit retention is defined.
- [ ] Expiration is automated.
- [ ] Retention changes are auditable.

## Verification

- [ ] Backup completion is verified.
- [ ] Backup integrity is verified.
- [ ] Object checksums are verified.
- [ ] Database consistency is verified.
- [ ] Restore tests are performed.
- [ ] Restore evidence is retained.

## Restore

- [ ] Database restore is tested.
- [ ] PITR restore is tested.
- [ ] Object restore is tested.
- [ ] Configuration restore is tested.
- [ ] Application recovery is tested.
- [ ] Critical workflows are tested.
- [ ] Recovery duration is measured.
- [ ] Recovery failures are escalated.

## RPO/RTO

- [ ] PostgreSQL RPO is defined.
- [ ] Artifact RPO is defined.
- [ ] Result RPO is defined.
- [ ] Audit RPO is defined.
- [ ] Control Plane RTO is defined.
- [ ] Database RTO is defined.
- [ ] Artifact recovery RTO is defined.
- [ ] Lab recovery expectations are defined.
- [ ] RPO is tested.
- [ ] RTO is tested.

## Security

- [ ] Backup repositories are private.
- [ ] Application identities cannot delete all backups.
- [ ] Backup access is least privilege.
- [ ] Backup access is audited.
- [ ] Immutable protection is used where required.
- [ ] Backup credentials are protected.

## Monitoring

- [ ] Backup failures alert.
- [ ] Backup freshness alerts.
- [ ] PITR failures alert.
- [ ] Restore failures alert.
- [ ] Storage capacity alerts.
- [ ] Encryption failures alert.
- [ ] Backup replication failures alert.

## Operations

- [ ] Backup runbooks exist.
- [ ] Restore runbooks exist.
- [ ] DR runbook exists.
- [ ] RPO breach runbook exists.
- [ ] Secret recovery runbook exists.
- [ ] Owners are assigned.
- [ ] Access reviews are performed.
- [ ] Policy reviews are performed.

## Disaster Recovery

- [ ] DR architecture exists.
- [ ] Recovery infrastructure is reproducible.
- [ ] Database recovery is tested.
- [ ] Object recovery is tested.
- [ ] Configuration recovery is tested.
- [ ] Secret recovery is tested.
- [ ] Application recovery is tested.
- [ ] Lab Agent recovery is tested.
- [ ] Job/Run reconciliation is tested.
- [ ] Credit reconciliation is tested.
- [ ] Booking reconciliation is tested.

## Production Readiness

- [ ] Backup freshness meets approved RPO.
- [ ] Restore tests meet approved RTO.
- [ ] Backup encryption is validated.
- [ ] Retention policies are active.
- [ ] Backup alerts are active.
- [ ] Recovery runbooks are approved.
- [ ] Backup ownership is documented.
- [ ] DR recovery test is approved.

# 123. Final Backup Invariants

Kritva RaaS backup must preserve these invariants:

1. PostgreSQL business state is recoverable.
2. PostgreSQL supports PITR where required.
3. Critical artifacts are recoverable.
4. Critical results are recoverable.
5. Configuration is reproducible.
6. Infrastructure is reproducible through IaC.
7. Secrets have a secure recovery mechanism.
8. Backups are encrypted.
9. Backup access is least privilege.
10. Critical backups are isolated from application permissions.
11. Retention is explicit.
12. Backup freshness is monitored.
13. Restore tests are mandatory.
14. A successful backup job is not considered sufficient evidence.
15. RPO is measurable.
16. RTO is measurable.
17. Database and object state can be reconciled.
18. Credit state can be reconciled.
19. Booking state can be reconciled.
20. Job/Run state can be reconciled.
21. Lab state can be reconciled.
22. Physical robot safety remains local.
23. Recovery cannot silently duplicate financial operations.
24. Recovery cannot silently duplicate resource allocation.
25. Backup failures generate actionable alerts.
26. Restore failures generate actionable alerts.
27. Backup access is audited.
28. Recovery evidence is retained.
29. DR is tested periodically.
30. Backup policy is reviewed periodically.

# 124. Final Recovery Operating Model

The complete recovery operating model is:

    Detect Failure
         |
    Determine Scope
         |
    Select Recovery Point
         |
    Validate Backup
         |
    Restore Infrastructure
         |
    Restore PostgreSQL
         |
    Restore Object Data
         |
    Restore Configuration
         |
    Restore Secrets
         |
    Deploy Application
         |
    Validate Health
         |
    Reconcile Queue / Events
         |
    Reconcile Bookings
         |
    Reconcile Credits
         |
    Reconcile Jobs / Runs
         |
    Reconnect Labs
         |
    Validate Robot State
         |
    Resume Customer Operations
         |
    Record Evidence
         |
    Post-Recovery Review

The governing principle is:

> **A backup is valuable only when it can produce a verified, usable recovery
> state. Kritva RaaS must therefore protect authoritative PostgreSQL state,
> critical object data, reproducible configuration and securely recoverable
> secrets; continuously monitor backup freshness; maintain explicit RPO and RTO
> targets; and regularly prove recovery through isolated restore and disaster
> recovery tests. Recovery must restore durable state first and then reconcile
> all external systems, including Labs and robots, before normal execution is
> resumed.**
