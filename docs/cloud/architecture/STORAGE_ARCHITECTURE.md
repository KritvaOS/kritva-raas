# Kritva RaaS Storage Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Storage Architecture |
| Path | `docs/cloud/architecture/STORAGE_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Structured Store | PostgreSQL |
| Binary Store | S3-compatible Object Storage |
| Queue | Durable Queue |
| Realtime | WebSocket |
| Lab Boundary | Lab Agent |
| Artifact Format | `.krv` |
| Primary Database Authority | PostgreSQL |
| Large Payload Authority | Object Storage |
| Initial Region | Single primary region |
| Production Availability | Multi-zone where supported |
| Backup | Managed DB Backup + Object Storage Protection |
| Encryption | Encryption at rest + TLS in transit |
| Access Model | Application authorization + scoped signed access |
| Environments | Local, Development, Staging, Production |

## 2. Purpose

This document defines the production-grade storage architecture for Kritva
RaaS.

The storage architecture separates authoritative structured business state from
large binary payloads and transient asynchronous transport.

The central principle is:

> **PostgreSQL owns business truth; object storage owns large immutable payloads;
> queues transport work but own no business state.**

The architecture supports:

- users;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- Jobs;
- Runs;
- results;
- logs;
- telemetry;
- experiment data;
- robot video;
- audit records;
- operational metadata.

## 3. Scope

This document covers:

- PostgreSQL storage;
- object storage;
- bucket/container layout;
- object key conventions;
- artifact storage;
- result storage;
- log storage;
- video storage;
- telemetry storage;
- encryption;
- access control;
- signed URLs;
- lifecycle policies;
- retention;
- backups;
- replication;
- disaster recovery;
- storage tiers;
- cost management;
- data integrity;
- reconciliation.

## 4. Non-Goals

This document does not define:

- complete PostgreSQL schema;
- application domain models;
- API command contracts;
- cloud-provider-specific IaC;
- final database migration tool;
- robot-local storage;
- final telemetry time-series database;
- final video streaming provider.

Those are defined or deferred in the relevant architecture documents.

## 5. Storage Principles

The architecture follows these principles:

1. PostgreSQL is authoritative for structured business state.
2. Object storage holds large binary payloads.
3. Queues are not storage authority.
4. WebSocket is not storage authority.
5. Database records reference objects rather than embedding large binaries.
6. Accepted artifacts are immutable.
7. Object access requires authorization.
8. Signed URLs are short-lived and scoped.
9. Encryption is required at rest and in transit.
10. Retention is data-class specific.
11. Backups are tested through restoration.
12. Object integrity uses checksums.
13. Cross-tenant access is prohibited.
14. Production storage is private by default.
15. Storage cost is measurable.
16. Reconciliation is required for distributed storage state.
17. Deletion is controlled and auditable.
18. Physical safety data remains local where required.

## 6. Logical Storage Topology

The target topology is:

    RaaS Control Plane
          |
          +--------------------+
          |                    |
          v                    v
      PostgreSQL          Object Storage
          |                    |
          |          +---------+---------+
          |          |         |         |
          |          v         v         v
          |       Artifacts   Results   Media
          |
          +--> Idempotency
          +--> Audit
          +--> Outbox
          |
       Durable Queue
          |
          v
       Workers

The queue transports work but does not replace either PostgreSQL or object
storage.

## 7. Storage Classes

The architecture has five conceptual storage classes:

| Class | Primary Store | Examples |
|---|---|---|
| Structured business state | PostgreSQL | bookings, Jobs, credits |
| Binary payloads | Object Storage | `.krv`, result files |
| Operational logs | Log/Object Storage | execution logs |
| Media | Object Storage/Media System | video recordings |
| Transient work | Local/ephemeral | validation workspace |

## 8. Authority Model

| Data | Authority |
|---|---|
| User | PostgreSQL |
| Organization | PostgreSQL |
| Project | PostgreSQL |
| Platform | PostgreSQL |
| Artifact metadata | PostgreSQL |
| Artifact binary | Object Storage |
| Booking | PostgreSQL |
| Credit ledger | PostgreSQL |
| Job | PostgreSQL |
| Run | PostgreSQL |
| Result metadata | PostgreSQL |
| Result binary | Object Storage |
| Audit | PostgreSQL |
| Object access token | Application-controlled |
| Queue message | Queue, not authority |
| Realtime event | WebSocket, not authority |

## 9. PostgreSQL Role

PostgreSQL is the authoritative structured data store.

It contains:

- identity metadata;
- organization state;
- memberships;
- projects;
- platform definitions;
- artifact metadata;
- artifact validation state;
- booking records;
- credit wallets;
- credit ledger;
- Jobs;
- Runs;
- labs;
- resources;
- results metadata;
- audit records;
- idempotency records;
- optional outbox events.

## 10. PostgreSQL Storage Boundaries

The database should not be used as a general-purpose binary store.

Avoid storing large:

- `.krv` packages;
- videos;
- raw telemetry archives;
- large logs;
- experiment datasets;

directly in PostgreSQL.

Instead store metadata and object references.

## 11. PostgreSQL Object Reference

Conceptual artifact record:

    artifact_id
    organization_id
    project_id
    object_key
    object_size
    content_type
    sha256
    status
    created_at
    updated_at

The object key is an opaque storage reference, not a public URL.

## 12. PostgreSQL Transaction Authority

Transactions must protect:

- booking conflicts;
- credit balances;
- credit reservations;
- Job state;
- Run state;
- resource allocations;
- idempotency;
- audit records where required.

External object-storage operations must not be assumed to participate in the
same database transaction.

## 13. Object Storage Role

Object storage is used for large or immutable payloads.

Primary categories include:

- execution artifacts;
- result files;
- execution logs;
- video recordings;
- telemetry archives;
- generated reports;
- diagnostic bundles.

## 14. Object Storage Characteristics

Object storage should provide:

- high durability;
- scalable capacity;
- versioning where appropriate;
- encryption;
- lifecycle policies;
- access control;
- checksum support;
- multipart upload;
- replication where required.

The exact provider remains open.

## 15. Storage Buckets

Production should use logically separated buckets or equivalent storage
containers.

Recommended:

    raas-prod-artifacts
    raas-prod-results
    raas-prod-logs
    raas-prod-video
    raas-prod-telemetry
    raas-prod-reports
    raas-prod-backups

Equivalent prefix-based separation may be used where operationally justified.

## 16. Environment Isolation

Development, staging and production must not share normal application data.

Example:

    raas-dev-artifacts
    raas-staging-artifacts
    raas-prod-artifacts

The same principle applies to results, logs and media.

## 17. Bucket Security

Buckets should be private by default.

Public anonymous object access must be disabled.

Access should occur through:

- application-authorized signed URLs;
- trusted workload identities;
- Lab Agent credentials;
- controlled internal access.

## 18. Object Key Layout

Object keys should be deterministic and tenant-scoped.

Example:

    artifacts/
      org/<org_id>/
        project/<project_id>/
          artifact/<artifact_id>/
            <digest>.krv

Results:

    results/
      org/<org_id>/
        project/<project_id>/
          run/<run_id>/
            <file>

Logs:

    logs/
      org/<org_id>/
        project/<project_id>/
          run/<run_id>/
            <timestamp>-<sequence>.log

The exact layout may evolve without exposing keys as a public API contract.

## 19. Object Key Rules

Object keys should:

- avoid user-controlled path traversal;
- use opaque IDs;
- use normalized names;
- avoid sensitive information;
- avoid email addresses;
- avoid secrets;
- remain stable after creation.

User-provided filenames may be stored as metadata rather than trusted path
components.

## 20. Artifact Storage

`.krv` artifacts are immutable execution packages.

Storage flow:

    Local Build
        |
        v
    .krv
        |
        v
    Upload
        |
        v
    Object Storage
        |
        v
    Validation
        |
        v
    ACCEPTED / READY

## 21. Artifact Identity

Artifact identity is:

    artifact_id + content_digest

The digest should use SHA-256 or an approved cryptographic equivalent.

The same binary must not silently become a different artifact.

## 22. Artifact Immutability

Once an artifact reaches an accepted state:

- its binary cannot be replaced;
- its digest cannot change;
- its manifest cannot change.

A modified artifact creates a new artifact record.

## 23. Artifact Storage Metadata

PostgreSQL should retain:

- artifact ID;
- project;
- organization;
- object key;
- size;
- content type;
- digest;
- signature status;
- platform;
- architecture;
- runtime compatibility;
- SDK version;
- lifecycle state.

## 24. Artifact Upload Flow

Preferred:

    Studio
      |
      v
    Create Artifact Metadata
      |
      v
    Receive Upload Authorization
      |
      v
    Object Storage
      |
      v
    Upload Completion
      |
      v
    Digest Validation
      |
      v
    Manifest Validation
      |
      v
    Signature Validation
      |
      v
    Compatibility Validation
      |
      v
    READY

## 25. Signed Upload URLs

Where supported, direct object upload should use short-lived signed URLs.

The application first authorizes the upload.

The storage service then receives the binary directly.

The backend records completion only after validation.

## 26. Signed URL Requirements

Signed URLs must:

- expire;
- be scoped to a specific object;
- use least privilege;
- restrict HTTP method where supported;
- restrict content length where supported;
- not expose reusable credentials.

## 27. Artifact Download

Lab Agent or authorized user flow:

    Request Download
          |
          v
    Authorization
          |
          v
    Generate Short-Lived URL
          |
          v
    Object Storage
          |
          v
    Download
          |
          v
    Digest Verification

## 28. Lab Artifact Access

The Lab Agent must receive access only to artifacts required for an authorized
Job.

Artifact access should be:

- scoped;
- time-limited;
- auditable;
- revocable where practical.

## 29. Result Storage

Result files are associated with Runs.

Typical results include:

- metrics;
- experiment outputs;
- generated files;
- datasets;
- reports;
- diagnostic data.

Metadata belongs in PostgreSQL.

Large result payloads belong in object storage.

## 30. Result Flow

    Run
      |
      v
    Result Generated
      |
      v
    Lab Agent
      |
      v
    Object Storage
      |
      v
    Result Metadata
      |
      v
    RESULT_AVAILABLE

## 31. Result File Metadata

Store:

- result ID;
- run ID;
- organization;
- project;
- object key;
- size;
- MIME type;
- checksum;
- creation time;
- retention class;
- processing state.

## 32. Result Downloads

Users should access result files through controlled URLs.

The application verifies:

- identity;
- organization;
- project;
- result ownership;
- file authorization.

Then it issues short-lived access.

## 33. Execution Logs

Execution logs may be high volume.

The preferred architecture is:

    Runtime
       |
       v
    Lab Agent
       |
       v
    Log Collector
       |
       +--> Realtime Stream
       |
       +--> Log Storage

Short-lived realtime logs may remain in operational log systems while durable
execution logs are archived to object storage where required.

## 34. Log Storage Layout

Recommended:

    logs/
      org/<org_id>/
        project/<project_id>/
          run/<run_id>/
            yyyy/mm/dd/
              segment-0001.log
              segment-0002.log

Segments should be bounded by size or time.

## 35. Log Retention

Operational logs may have shorter retention than audit or results.

Example policy:

| Data | Initial Retention Class |
|---|---|
| Application logs | Short |
| Execution logs | Medium |
| Audit | Long |
| Artifacts | Customer/contract dependent |
| Results | Customer/contract dependent |
| Video | Short/medium |
| Telemetry archive | Medium |
| Backups | Long |

Exact retention periods remain open.

## 36. Video Storage

Video has a distinct bandwidth and storage profile.

Live video should normally use WebRTC.

Recorded video, if enabled, belongs in object storage.

Flow:

    Robot Camera
         |
         v
    Lab Media Gateway
         |
         +--> WebRTC Live
         |
         +--> Object Storage Recording

## 37. Video Object Layout

Example:

    video/
      org/<org_id>/
        project/<project_id>/
          run/<run_id>/
            yyyy/mm/dd/
              camera-01/
                segment-0001.mp4

Recordings should be segmented to avoid excessively large objects.

## 38. Video Retention

Video is potentially the highest-cost storage category.

Retention should be configurable by:

- platform;
- plan;
- organization;
- experiment;
- recording type.

Live streaming without recording should not automatically create persistent
video objects.

## 39. Telemetry Storage

Telemetry should be treated separately from durable business state.

High-frequency telemetry may use:

- object storage;
- time-series storage;
- compressed batches;
- specialized telemetry systems.

The final time-series database decision remains open.

## 40. Telemetry Flow

    Robot
      |
      v
    Lab Agent
      |
      v
    Telemetry Aggregator
      |
      +--> Realtime
      |
      +--> Durable Batch
      |
      v
    Storage

Telemetry should be bounded and aggregated before long-term storage.

## 41. Telemetry Retention

Retention may use tiers:

    Hot
      |
      v
    Recent Telemetry

    Warm
      |
      v
    Aggregated Telemetry

    Cold
      |
      v
    Historical Archive

Raw high-frequency telemetry should not be retained indefinitely by default.

## 42. Reports

Generated reports may be stored as objects.

Examples:

- experiment report;
- run summary;
- usage report;
- audit export.

Metadata is retained in PostgreSQL.

## 43. Database Backups

Production PostgreSQL requires:

- automated backups;
- point-in-time recovery where supported;
- retention policy;
- restore testing.

Backups must be protected from accidental deletion.

## 44. Backup Flow

    PostgreSQL
        |
        v
    Managed Backup
        |
        +--> Point-in-Time Recovery
        |
        +--> Backup Retention
        |
        v
    Recovery Storage

## 45. Backup Validation

A backup is not considered operationally valid until restore is tested.

Restore flow:

    Backup
      |
      v
    Restore
      |
      v
    Schema Validation
      |
      v
    Data Validation
      |
      v
    Application Validation
      |
      v
    Recovery Accepted

## 46. Object Storage Backup

Object storage protection may use:

- versioning;
- replication;
- object lock where required;
- backup/replication;
- lifecycle retention.

The exact combination depends on data criticality.

## 47. Artifact Backup

Accepted production artifacts should have strong durability requirements.

Recommended:

- versioning where supported;
- checksum;
- immutable metadata;
- retention policy;
- optional cross-region replication.

## 48. Result Backup

Results should be protected according to customer retention requirements.

Important results may require:

- versioning;
- replication;
- long-term archive;
- customer export capability.

## 49. Log Backup

Logs generally have lower durability requirements than:

- credit ledger;
- bookings;
- artifacts;
- customer results.

Long-term log storage should therefore be cost-optimized.

## 50. Audit Storage

Audit records are authoritative business history.

They belong in PostgreSQL or an equivalent durable authoritative store.

Audit exports may additionally be written to immutable object storage.

## 51. Credit Ledger Storage

The credit ledger must remain in PostgreSQL.

It must not depend on:

- object storage;
- logs;
- event streams.

The ledger must remain transactionally consistent.

## 52. Idempotency Storage

Idempotency records belong in PostgreSQL because they participate in
transactional business operations.

Example:

    Request
      |
      v
    Idempotency Record
      |
      v
    Domain Transaction
      |
      v
    Stored Result

## 53. Outbox Storage

If the transactional outbox pattern is used:

    Business Transaction
         |
         +--> Domain State
         |
         +--> Outbox Event

Both are committed in the same database transaction.

The outbox is durable until successfully published.

## 54. Cache

A cache may be introduced later.

Cache must never become authoritative for:

- credits;
- bookings;
- Jobs;
- Runs;
- tenant authorization.

Cache failures should degrade to authoritative storage.

## 55. Storage Encryption

All production storage must be encrypted at rest where supported.

Encryption applies to:

- PostgreSQL;
- object storage;
- backups;
- persistent volumes;
- log archives.

## 56. Key Management

Encryption keys should be managed through a cloud KMS or equivalent.

Key responsibilities include:

- creation;
- rotation;
- access control;
- auditing;
- revocation where supported.

## 57. Application-Level Encryption

Application-level encryption may be used for especially sensitive fields.

It is not a substitute for infrastructure-level encryption.

Candidate data may include:

- sensitive integration credentials;
- customer secrets;
- special administrative data.

## 58. Encryption in Transit

Use TLS for:

- Studio → Control Plane;
- Web Console → Control Plane;
- Control Plane → PostgreSQL;
- Control Plane → object storage;
- workers → storage;
- Lab Agent → cloud;
- administrative connections.

## 59. Bucket-Level Encryption

Object storage should use provider-managed or customer-managed encryption keys
according to environment and security requirements.

Production key access should be tightly scoped.

## 60. Object Access Control

Storage access must be authorized through workload identity or scoped access
mechanisms.

Avoid long-lived access keys in application configuration.

## 61. Tenant Isolation

Object keys are tenant-scoped.

However, key structure alone is not a security boundary.

Every access requires:

    Principal
       |
       v
    Organization
       |
       v
    Resource Authorization
       |
       v
    Object Access

## 62. Object Ownership

Every durable object should map to a PostgreSQL record.

The database record establishes:

- owner;
- organization;
- project;
- resource;
- lifecycle;
- retention.

This prevents storage objects from becoming orphaned business data.

## 63. Orphan Detection

Periodic reconciliation should find:

- DB record without object;
- object without DB record;
- incorrect checksum;
- incorrect size;
- inaccessible object;
- expired object retained unexpectedly.

## 64. Reconciliation Flow

    PostgreSQL Metadata
          |
          +------+
                 |
                 v
         Storage Reconciliation
                 |
          +------+------+
          |             |
          v             v
       Consistent    Inconsistent
                         |
                         v
                    Repair / Alert

## 65. Object Integrity

At upload:

- calculate checksum;
- verify expected size;
- verify content type;
- validate package where applicable.

At download:

- verify checksum where appropriate.

For `.krv` artifacts, digest verification is mandatory before execution.

## 66. Multipart Upload

Large files should use multipart/resumable upload where supported.

This applies particularly to:

- large artifacts;
- result files;
- video;
- telemetry archives.

Multipart upload must not mark the object complete until final validation.

## 67. Interrupted Upload

If upload is interrupted:

    Upload
      |
      X
    Interrupted
      |
      v
    Incomplete Object
      |
      v
    Resume / Abort
      |
      v
    Cleanup

Incomplete multipart uploads should have automatic expiration.

## 68. Storage Lifecycle

Object lifecycle should be data-class specific.

Typical lifecycle:

    Hot
      |
      v
    Warm
      |
      v
    Cold
      |
      v
    Archive
      |
      v
    Delete

Not every data class requires every tier.

## 69. Storage Tiers

| Tier | Use | Cost | Access |
|---|---|---|---|
| Hot | Recent artifacts/results | Highest | Immediate |
| Warm | Older active data | Medium | Fast |
| Cold | Historical data | Low | Delayed |
| Archive | Long-term retention | Lowest | Slow |

Exact provider tier names are implementation-specific.

## 70. Artifact Lifecycle

Recommended:

    CREATED
       |
    UPLOADING
       |
    UPLOADED
       |
    VALIDATING
       |
    ACCEPTED
       |
    READY
       |
    REVOKED / EXPIRED
       |
    DELETED

Accepted artifacts should remain available according to policy.

## 71. Result Lifecycle

Recommended:

    CREATED
       |
    UPLOADING
       |
    PROCESSING
       |
    AVAILABLE
       |
    ARCHIVED
       |
    DELETED

The exact lifecycle may differ for customer-retained results.

## 72. Log Lifecycle

Recommended:

    LIVE
      |
      v
    RECENT
      |
      v
    ARCHIVED
      |
      v
    DELETED

Operational logs may have shorter retention.

## 73. Video Lifecycle

Recommended:

    LIVE
      |
      v
    RECORDED
      |
      v
    RECENT
      |
      v
    ARCHIVED
      |
      v
    DELETED

Recording must be explicitly enabled.

## 74. Deletion

Deletion should be controlled.

Application deletion should normally mean:

    Logical Delete
         |
         v
    Retention Period
         |
         v
    Physical Delete

Legal/customer retention requirements override normal deletion.

## 75. Artifact Deletion

Accepted artifacts should not be physically deleted while referenced by:

- active Jobs;
- historical Runs;
- required audit records.

Deletion policy must preserve reproducibility where required.

## 76. Result Deletion

Result deletion should verify:

- no legal hold;
- no customer retention requirement;
- no active experiment dependency;
- no required audit reference.

Metadata may remain after object deletion for audit purposes.

## 77. Object Versioning

Versioning is recommended for:

- critical artifacts where operationally useful;
- important result data;
- backups.

However, accepted artifacts remain logically immutable even if storage versioning
is enabled.

## 78. Object Lock

Object lock or WORM controls may be used for:

- compliance archives;
- audit exports;
- regulatory records;
- protected backups.

This is not required for every object.

## 79. Replication

Replication strategy should vary by data class.

| Data | Replication Priority |
|---|---|
| Credit ledger | Database HA + backup |
| Booking | Database HA + backup |
| Artifacts | High |
| Customer Results | High |
| Audit Archive | High |
| Logs | Medium |
| Temporary Data | Low |
| Video | Policy-dependent |

## 80. Cross-Region Replication

Initial production may remain single-region.

Cross-region replication should be introduced for:

- disaster recovery;
- critical customer artifacts;
- high-value results;
- backups.

Active-active multi-region storage is not required initially.

## 81. Region Failure

If the primary region fails:

    Region A Failure
          |
          v
    Recover Database
          |
          v
    Recover Object References
          |
          v
    Restore / Promote Storage
          |
          v
    Reconstruct Compute
          |
          v
    Reconcile Labs
          |
          v
    Resume Service

## 82. Database/Object Consistency

Database and object storage do not participate in one distributed transaction.

Therefore workflows must tolerate:

    DB record exists
    Object missing

or:

    Object exists
    DB record missing

Reconciliation and controlled lifecycle operations resolve these cases.

## 83. Storage Transaction Pattern

Preferred upload sequence:

    Create DB Record
       |
       v
    Upload Object
       |
       v
    Verify Object
       |
       v
    Mark DB Record COMPLETE
       |
       v
    Publish Event

If any stage fails, recovery is explicit.

## 84. Object Completion State

A database record must distinguish:

- upload requested;
- upload in progress;
- upload complete;
- validating;
- accepted;
- rejected;
- orphaned;
- deleted.

This prevents incomplete objects from being treated as valid artifacts.

## 85. Signed URL Expiration

Typical signed access should be short-lived.

The exact TTL depends on:

- artifact size;
- result size;
- network conditions;
- security sensitivity.

Long-lived URLs should not be used as permanent credentials.

## 86. Signed URL Revocation

Object storage signed URLs may be difficult to revoke individually.

Therefore authorization must also use:

- short TTL;
- object immutability;
- credential rotation;
- object lifecycle;
- application-level access checks before issuing URLs.

## 87. Storage Monitoring

Monitor:

- capacity;
- object count;
- upload failures;
- download failures;
- incomplete uploads;
- storage latency;
- egress;
- replication lag;
- lifecycle failures;
- backup status.

## 88. PostgreSQL Monitoring

Monitor:

- database size;
- table growth;
- index growth;
- connection count;
- query latency;
- slow queries;
- locks;
- deadlocks;
- replication status;
- backup status.

## 89. Object Storage Monitoring

Monitor:

- bucket size;
- request count;
- object count;
- lifecycle transitions;
- failed requests;
- egress;
- replication status.

## 90. Storage Cost

Storage costs include:

- PostgreSQL;
- object capacity;
- request operations;
- data transfer;
- backup storage;
- replication;
- archive retrieval;
- video storage.

## 91. Cost Attribution

Storage cost should be attributable to:

- environment;
- organization where practical;
- platform;
- lab;
- project;
- data class.

This supports RaaS unit economics.

## 92. Video Cost

Video can become a major cost driver.

Controls include:

- maximum recording duration;
- resolution;
- frame rate;
- retention;
- compression;
- storage tiering.

## 93. Telemetry Cost

Telemetry cost can grow rapidly with sampling rate.

Controls include:

- sampling;
- aggregation;
- compression;
- retention;
- tiering;
- customer-specific policies.

## 94. Artifact Cost

Artifacts are generally lower volume but should still use lifecycle policy.

Duplicate artifacts can be identified by digest.

Future deduplication may be introduced without changing artifact identity.

## 95. Result Cost

Result retention should be aligned with:

- customer plan;
- experiment lifecycle;
- regulatory requirements;
- product value.

## 96. Storage Quotas

Organizations may have quotas for:

- artifact storage;
- result storage;
- video storage;
- telemetry storage;
- total retained data.

Quota enforcement belongs in application policy.

## 97. Storage Quota Flow

    User Upload
       |
       v
    Authorization
       |
       v
    Storage Quota Check
       |
       +--> Allowed
       |
       +--> Rejected
       |
       v
    Upload

Storage infrastructure limits are separate from product quotas.

## 98. Data Classification

Recommended classifications:

    CRITICAL
      Credit Ledger
      Booking
      Audit

    IMPORTANT
      Artifacts
      Results

    OPERATIONAL
      Logs
      Telemetry

    TRANSIENT
      Temporary Processing Data

Each class receives appropriate retention and recovery controls.

## 99. Sensitive Data

Storage architecture must identify sensitive data before persistence.

Do not store:

- plaintext secrets;
- access tokens;
- private keys;
- unnecessary personal data.

Sensitive fields should use encryption or tokenization where required.

## 100. Storage Access Interfaces

| Interface | Purpose |
|---|---|
| Repository | PostgreSQL domain state |
| ObjectStore | Object operations |
| SignedAccess | Controlled file access |
| Backup | Database/object protection |
| Lifecycle | Retention and archival |
| Reconciliation | DB/object consistency |
| Quota | Storage limits |
| Audit | Storage access history |

## 101. ObjectStore Interface

Logical operations:

    putObject
    getObject
    deleteObject
    headObject
    createMultipartUpload
    completeMultipartUpload
    abortMultipartUpload
    createSignedUpload
    createSignedDownload

The implementation remains provider-neutral.

## 102. Repository Interface

Database access should use domain-specific repositories.

Examples:

    ArtifactRepository
    ResultRepository
    JobRepository
    RunRepository
    BookingRepository
    CreditRepository
    AuditRepository
    IdempotencyRepository

Generic unrestricted database access is discouraged.

## 103. Storage Authorization

Authorization sequence:

    Request
      |
      v
    Authenticate
      |
      v
    Tenant Resolve
      |
      v
    Resource Authorization
      |
      v
    Storage Authorization
      |
      v
    Signed Access / Repository Operation

## 104. No Direct Client Database Access

Neither:

- Studio;
- Web Console;
- Lab Agent

may connect directly to PostgreSQL.

All business state access goes through authorized services.

## 105. Lab Agent Storage Access

Lab Agent may access:

- authorized artifacts;
- authorized deployment packages;
- result upload destinations.

It must not receive broad bucket credentials.

## 106. Lab Result Upload

Prefer scoped upload authorization:

    Lab Agent
       |
       v
    Result Upload Authorization
       |
       v
    Short-Lived Upload
       |
       v
    Object Storage

## 107. Storage Credentials

Avoid static access keys.

Prefer:

- workload identity;
- role-based access;
- short-lived credentials;
- signed URLs.

## 108. Backup Security

Backups must be:

- encrypted;
- access-controlled;
- separately permissioned;
- retained;
- monitored.

Production operators should not automatically receive unrestricted backup
access.

## 109. Backup Isolation

Backups should be protected against:

- application compromise;
- accidental deletion;
- operator error.

Where possible, use separate backup accounts/projects or equivalent isolation.

## 110. Disaster Recovery

Recovery requires both:

    Structured State
        +
    Binary State

Recovering only PostgreSQL without required objects is incomplete.

Recovering objects without metadata is also incomplete.

## 111. Recovery Ordering

Recommended:

    1. Network
    2. Secret Management
    3. PostgreSQL
    4. Object Storage
    5. Queue
    6. Control Plane
    7. Workers
    8. Lab Connectivity
    9. Reconciliation

## 112. Recovery Validation

After recovery verify:

- database consistency;
- object accessibility;
- artifact digests;
- result references;
- Job state;
- Run state;
- credit ledger;
- Lab Agent state.

## 113. Retention Governance

Every stored data class must have:

- owner;
- retention period;
- deletion rule;
- archive rule;
- recovery class;
- security classification.

## 114. Lifecycle Automation

Lifecycle automation should handle:

- old logs;
- incomplete uploads;
- expired temporary objects;
- archived results;
- obsolete telemetry;
- old backups.

Lifecycle failures must generate alerts for important data classes.

## 115. Storage Schema Evolution

Database schema changes must follow the database release process.

Object metadata changes must remain backward compatible during rolling
deployment.

Object key layout changes should use migration or dual-read/dual-write
strategies where required.

## 116. Object Metadata Compatibility

Objects should carry metadata sufficient to support future processing.

Examples:

- schema version;
- artifact format;
- content type;
- producer version;
- checksum.

## 117. Storage API Compatibility

Object keys and storage layout are implementation details.

Public APIs should expose:

- artifact ID;
- result ID;
- file ID;

rather than raw bucket names.

This allows storage migration without breaking clients.

## 118. Storage Migration

Storage migration flow:

    Old Storage
        |
        v
    Copy / Replicate
        |
        v
    Verify Digest
        |
        v
    Update Metadata
        |
        v
    Switch Read Path
        |
        v
    Observe
        |
        v
    Retire Old Storage

No object should be deleted before successful verification.

## 119. Phase Mapping

| Phase | Storage Focus |
|---|---|
| Phase 0 | Storage authority and interfaces |
| Phase 1 | PostgreSQL and basic object storage |
| Phase 2 | Artifact/result storage |
| Phase 3 | Worker storage workflows and outbox |
| Phase 4 | Credit/audit durability and quotas |
| Phase 5 | Job/Run logs and execution results |
| Phase 6 | Lab artifact/result transfer |
| Phase 7 | Telemetry/video/results scaling |
| Phase 8 | Backup, replication, lifecycle, DR and cost optimization |

## 120. Phase 0 Acceptance

- [ ] PostgreSQL authority defined.
- [ ] Object storage authority defined.
- [ ] Queue non-authority defined.
- [ ] Storage interfaces defined.
- [ ] Data classifications defined.

## 121. Phase 1 Acceptance

- [ ] PostgreSQL is deployed.
- [ ] Object storage exists.
- [ ] Environment storage is isolated.
- [ ] Encryption is enabled.
- [ ] Access controls are implemented.
- [ ] Backup policy exists.

## 122. Phase 2 Acceptance

- [ ] `.krv` artifacts use object storage.
- [ ] Artifact metadata is in PostgreSQL.
- [ ] Artifact digests are verified.
- [ ] Signed upload URLs work.
- [ ] Signed download URLs work.
- [ ] Artifact immutability is enforced.

## 123. Phase 3 Acceptance

- [ ] Workers process object-storage jobs.
- [ ] Outbox is durable where used.
- [ ] Reconciliation detects orphan objects.
- [ ] Multipart uploads are handled.
- [ ] Incomplete uploads expire.

## 124. Phase 4 Acceptance

- [ ] Credit ledger is durably stored in PostgreSQL.
- [ ] Audit records are durable.
- [ ] Storage quotas exist.
- [ ] Financial data is protected.
- [ ] Backup and recovery are tested.

## 125. Phase 5 Acceptance

- [ ] Run logs are stored.
- [ ] Run results are stored.
- [ ] Result metadata is authoritative in PostgreSQL.
- [ ] Result files are protected.
- [ ] Job/Run references remain durable.

## 126. Phase 6 Acceptance

- [ ] Lab Agent can fetch authorized artifacts.
- [ ] Lab Agent can upload authorized results.
- [ ] Access is short-lived/scoped.
- [ ] Artifact digest verification works.
- [ ] Lab storage access is auditable.

## 127. Phase 7 Acceptance

- [ ] Telemetry storage is operational.
- [ ] Video storage is operational if recording is enabled.
- [ ] Realtime and durable paths are separated.
- [ ] Large data flows do not overload API compute.
- [ ] Storage cost is measurable.

## 128. Phase 8 Acceptance

- [ ] Database backup/restore is tested.
- [ ] Object storage protection is tested.
- [ ] Replication is validated where required.
- [ ] Lifecycle policies are active.
- [ ] Retention is enforced.
- [ ] Disaster recovery is tested.
- [ ] Storage costs are optimized.
- [ ] Reconciliation is operational.

## 129. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Database loss | Critical | HA + backups + PITR |
| Object loss | Critical | Versioning + replication |
| Cross-tenant object access | Critical | Authorization + scoped URLs |
| Storage cost growth | High | Lifecycle + quotas |
| Video cost explosion | High | Recording/retention controls |
| Telemetry explosion | High | Sampling + aggregation |
| Orphan objects | Medium | Reconciliation |
| Missing object | High | Integrity checks + reconciliation |
| Backup failure | Critical | Restore tests |
| Key compromise | Critical | KMS + least privilege |
| Signed URL leakage | High | Short TTL + scope |
| Migration incompatibility | High | Backward-compatible metadata |
| Incomplete upload | Medium | Multipart cleanup |

## 130. Risk: Object/Data Inconsistency

Mitigation:

- explicit upload state;
- checksums;
- reconciliation;
- idempotent completion;
- delayed deletion.

## 131. Risk: Storage Cost Explosion

Mitigation:

- data-class retention;
- lifecycle transitions;
- quotas;
- cost attribution;
- video controls;
- telemetry aggregation.

## 132. Risk: Backup Appears Healthy but Cannot Restore

Mitigation:

- scheduled restore tests;
- checksum verification;
- application-level validation;
- documented RTO/RPO.

## 133. Risk: Signed URL Misuse

Mitigation:

- short expiration;
- object-specific scope;
- method restriction;
- no reusable credentials;
- authorization before issuance.

## 134. Risk: Tenant Data Leakage

Mitigation:

- server-side authorization;
- opaque IDs;
- private buckets;
- short-lived URLs;
- tenant-scoped object keys;
- integration tests for cross-tenant access.

## 135. Open Questions

The following storage decisions remain open:

1. Final PostgreSQL provider.
2. Final object-storage provider.
3. Final bucket versus prefix strategy.
4. Final storage encryption key model.
5. Customer-managed versus provider-managed keys.
6. Exact artifact retention policy.
7. Exact result retention policy.
8. Exact video retention policy.
9. Exact telemetry retention policy.
10. Final telemetry/time-series storage.
11. Cross-region replication strategy.
12. Final backup retention.
13. Exact archive tiers.
14. Final storage quota model.
15. Final object lifecycle tooling.
16. Final video recording architecture.
17. Final object deduplication strategy.
18. Final storage cost allocation model.

These questions do not change the fundamental authority and separation model.

## 136. Full Acceptance Criteria Checklist

### PostgreSQL

- [ ] PostgreSQL is authoritative for structured business state.
- [ ] Database is private.
- [ ] Database access is through repository/application boundaries.
- [ ] Credit ledger is transactional.
- [ ] Booking state is durable.
- [ ] Job/Run state is durable.
- [ ] Idempotency records are durable.
- [ ] Audit records are durable.
- [ ] Database backups exist.
- [ ] Restore testing exists.

### Object Storage

- [ ] Object storage is private.
- [ ] Buckets/containers are environment-specific.
- [ ] Object keys are tenant-scoped.
- [ ] Object keys do not expose sensitive information.
- [ ] Large files are stored outside PostgreSQL.
- [ ] Object integrity is verified.
- [ ] Object lifecycle is configured.

### Artifacts

- [ ] `.krv` is the execution artifact.
- [ ] Artifact metadata is stored in PostgreSQL.
- [ ] Artifact binary is stored in object storage.
- [ ] SHA-256 or equivalent digest is stored.
- [ ] Accepted artifacts are immutable.
- [ ] Signed uploads are used where appropriate.
- [ ] Signed downloads are scoped.
- [ ] Lab Agent verifies artifact integrity.
- [ ] Artifact retention is defined.

### Results

- [ ] Result metadata is in PostgreSQL.
- [ ] Large result files are in object storage.
- [ ] Result files have checksums.
- [ ] Result access is authorized.
- [ ] Result retention is defined.
- [ ] Result deletion is controlled.

### Logs

- [ ] Execution logs are stored appropriately.
- [ ] Log segments are bounded.
- [ ] Log retention is defined.
- [ ] Logs do not contain secrets.
- [ ] Archived logs use cost-appropriate storage.

### Video

- [ ] Live video is separated from durable storage.
- [ ] Recorded video uses object storage.
- [ ] Recording is explicitly controlled.
- [ ] Video retention is configurable.
- [ ] Video cost is monitored.
- [ ] Video access is authorized.

### Telemetry

- [ ] Telemetry is observational.
- [ ] High-frequency telemetry is bounded.
- [ ] Aggregation is supported.
- [ ] Retention is defined.
- [ ] Durable telemetry does not overload PostgreSQL.
- [ ] Realtime telemetry is separate from archival telemetry.

### Encryption

- [ ] PostgreSQL is encrypted at rest.
- [ ] Object storage is encrypted at rest.
- [ ] Backups are encrypted.
- [ ] TLS is used in transit.
- [ ] Key management is controlled.
- [ ] Key rotation is supported.

### Access Control

- [ ] Anonymous object access is disabled.
- [ ] Workload identities are used.
- [ ] Signed URLs are short-lived.
- [ ] Object access is tenant-authorized.
- [ ] Lab Agent access is scoped.
- [ ] Backup access is restricted.

### Lifecycle

- [ ] Data classes have retention policies.
- [ ] Hot/warm/cold tiers are defined where appropriate.
- [ ] Incomplete uploads expire.
- [ ] Temporary objects are cleaned.
- [ ] Archived data is managed.
- [ ] Deletion is controlled.
- [ ] Legal/customer retention can override deletion.

### Backup and Recovery

- [ ] PostgreSQL backup exists.
- [ ] PITR exists where supported.
- [ ] Object storage protection exists.
- [ ] Restore is tested.
- [ ] Recovery ordering is documented.
- [ ] Application validation follows restore.
- [ ] RPO/RTO are defined before production commitment.

### Replication

- [ ] Database HA is configured where appropriate.
- [ ] Critical object replication is evaluated.
- [ ] Cross-region strategy is defined.
- [ ] Replication health is monitored.
- [ ] Failover/recovery is tested.

### Reconciliation

- [ ] DB/object mismatch detection exists.
- [ ] Missing object detection exists.
- [ ] Orphan object detection exists.
- [ ] Digest mismatch detection exists.
- [ ] Repair workflow exists.
- [ ] Reconciliation failures are alerted.

### Cost

- [ ] Storage cost is measurable.
- [ ] Egress cost is measurable.
- [ ] Video cost is measurable.
- [ ] Telemetry cost is measurable.
- [ ] Lifecycle reduces long-term cost.
- [ ] Storage quotas are enforced.
- [ ] Cost attribution exists.

## 137. Final Storage Invariants

The following invariants are mandatory:

1. PostgreSQL is authoritative for structured business state.
2. Object storage is authoritative for large binary payloads.
3. Queues are not storage authority.
4. WebSocket is not storage authority.
5. Large artifacts are not stored directly in PostgreSQL.
6. Accepted `.krv` artifacts are immutable.
7. Artifact identity includes a cryptographic digest.
8. Object storage is private by default.
9. Anonymous object access is disabled.
10. Signed URLs are short-lived and scoped.
11. Object access requires authorization.
12. Tenant isolation is enforced server-side.
13. Lab Agents never receive unrestricted storage credentials.
14. Encryption at rest is mandatory for production storage.
15. Encryption in transit is mandatory for sensitive traffic.
16. Backups are encrypted and access-controlled.
17. Backups are periodically restored for validation.
18. Object/database consistency is reconciled.
19. Incomplete uploads cannot become valid artifacts.
20. Lifecycle policies are data-class specific.
21. Video retention is explicitly controlled.
22. High-frequency telemetry is bounded and aggregated.
23. Credit ledger data remains in PostgreSQL.
24. Audit records remain durable.
25. Storage cost is measurable.
26. Data deletion is controlled and auditable.
27. Production storage is environment-isolated.
28. Storage migration verifies object integrity before deletion.
29. Recovery requires both structured state and referenced binary data.
30. Storage architecture remains provider-neutral at the application boundary.

## 138. Final Storage Architecture

The target architecture is:

    ┌─────────────────────────────────────────────────────────────┐
    │                         RaaS Clients                        │
    │                                                             │
    │ Studio       Web Console       Admin       Lab Agent        │
    └───────────────┬───────────────────────┬────────────────────┘
                    │                       │
                    │ HTTPS / WSS           │ Secure Lab Channel
                    v                       v
          ┌────────────────────┐    ┌──────────────────┐
          │ RaaS Control Plane │    │    Lab Agent     │
          └─────────┬──────────┘    └────────┬─────────┘
                    │                        │
          ┌─────────┴───────────┐            │
          │                     │            │
          v                     v            │
    ┌──────────────┐      ┌──────────────┐   │
    │ PostgreSQL   │      │ Object       │<──┘
    │              │      │ Storage      │
    │ Business     │      │              │
    │ State        │      │ Artifacts    │
    │              │      │ Results      │
    │ Bookings     │      │ Logs         │
    │ Credits      │      │ Video        │
    │ Jobs/Runs    │      │ Telemetry    │
    │ Audit        │      │ Reports      │
    └──────────────┘      └──────────────┘
            ^
            |
       Durable Queue
            |
      ┌─────┴───────────────┐
      │                     │
      v                     v
    Workers             Reconciliation

    Backup / Replication
       |
       +--> PostgreSQL Protection
       |
       +--> Object Storage Protection

The storage architecture deliberately separates:

    Authoritative State
        PostgreSQL

    Large Durable Payloads
        Object Storage

    Asynchronous Transport
        Queue

    Realtime Delivery
        WebSocket

    Live Media
        WebRTC

    Physical/Local Execution
        Lab Agent + Robot

This separation allows Kritva RaaS to scale storage independently from compute,
protect customer artifacts and results, control video and telemetry costs,
support reliable recovery, and preserve a clear authority model across the
entire RaaS platform.

> **Store business truth in PostgreSQL, store large payloads in object storage,
> and never confuse transport with durable state.**
