# Kritva RaaS Data Ownership

## 1. Document Control

| Item | Value |
|---|---|
| Document | Data Ownership |
| Path | `docs/database/architecture/DATA_OWNERSHIP.md` |
| Product | Kritva Robotics-as-a-Service |
| Primary Database | PostgreSQL |
| Ownership Model | Domain-owned relational data |
| Tenancy Model | Organization-based logical multi-tenancy |
| Data Authority | PostgreSQL for structured business state |
| Binary Authority | Object Storage for large files |
| Phase Coverage | Phase 0–Phase 8 |

# 2. Purpose

This document defines who owns, reads, writes, protects, retains, exports and
deletes data in Kritva RaaS.

The objective is to prevent ambiguous ownership and uncontrolled database
access as the system grows.

The ownership model establishes:

- domain ownership;
- table ownership;
- service write authority;
- cross-domain read rules;
- cross-domain write restrictions;
- data classification;
- tenant boundaries;
- retention;
- privacy;
- export;
- deletion;
- auditability;
- operational responsibility.

# 3. Scope

This document covers:

- Users;
- Organizations;
- Memberships;
- Roles;
- Projects;
- Platforms;
- Platform Versions;
- Capabilities;
- Labs;
- Lab Agents;
- Resources;
- Robots;
- Builds;
- Artifacts;
- Credit Plans;
- Wallets;
- Ledger Entries;
- Bookings;
- Jobs;
- Runs;
- Results;
- Experiments;
- Events;
- Audit Records;
- Idempotency records;
- Reconciliation records;
- object-storage metadata;
- tenant/customer data.

# 4. Non-Goals

This document does not define:

- final legal GDPR interpretation;
- jurisdiction-specific legal advice;
- complete privacy policy;
- complete security architecture;
- physical robot safety ownership;
- cloud-provider-specific data tooling;
- exact payment-provider data ownership;
- complete API contract definitions.

# 5. Data Ownership Principles

Kritva RaaS follows these principles:

1. Every authoritative dataset has one owning domain.
2. Ownership means authority to create, change and retire the data.
3. Other domains may read through defined interfaces.
4. Direct cross-domain writes are prohibited by default.
5. PostgreSQL does not imply universal application access.
6. Tenant-owned data is scoped to an Organization.
7. Global configuration is separate from tenant data.
8. Financial history is strongly protected.
9. Audit history is append-oriented.
10. Large files are owned by object storage with database metadata.
11. Derived data must identify its source authority.
12. Data retention must be explicit.
13. Privacy operations must be auditable.
14. Export must preserve customer ownership boundaries.
15. Deletion must not violate financial, audit or security retention obligations.
16. Safety-critical robot state remains locally authoritative.

# 6. Definition of Ownership

A domain owns data when it is responsible for:

- schema definition;
- business meaning;
- write authority;
- lifecycle;
- validation;
- retention policy;
- migration;
- integrity;
- access policy;
- incident response.

Ownership does not mean that no other component may read the data.

# 7. Service Ownership Model

The initial Control Plane is a modular monolith.

Therefore "service ownership" means logical module ownership, not necessarily
a separately deployed microservice.

Recommended logical owners:

| Domain | Owner |
|---|---|
| Identity | Identity Module |
| Organization | Organization Module |
| Project | Project Module |
| Platform | Platform Module |
| Lab | Lab Module |
| Build | Build Module |
| Artifact | Artifact Module |
| Credits | Credit Module |
| Booking | Booking Module |
| Execution | Job/Run Modules |
| Results | Result Module |
| Experiments | Experiment Module |
| Events | Event Infrastructure |
| Audit | Audit Module |
| System | Platform Infrastructure |

# 8. Ownership Diagram

    RaaS Control Plane
            |
    +-------+----------------------------------+
    |       |       |       |       |          |
 Identity  Org   Project  Platform  Lab    Execution
    |       |       |       |       |          |
    +-------+-------+-------+-------+----------+
                        |
                   PostgreSQL
                        |
              Domain-owned schemas

The modular boundary exists even while the deployment remains a modular
monolith.

# 9. Database Authority

PostgreSQL is authoritative for:

- customer records;
- organization membership;
- project state;
- artifact metadata;
- bookings;
- credits;
- Jobs;
- Runs;
- results metadata;
- experiments;
- operational resource state;
- audit records.

PostgreSQL is not authoritative for:

- physical E-stop;
- robot physical safety;
- raw robot sensor state;
- video;
- large binary artifact payloads;
- high-frequency telemetry streams.

# 10. Object Storage Ownership

Object storage owns large binary payloads such as:

- `.krv` artifacts;
- result bundles;
- logs;
- video;
- telemetry archives;
- reports.

PostgreSQL owns:

- object identity;
- storage key;
- digest;
- size;
- content type;
- lifecycle state;
- ownership metadata.

# 11. Primary Ownership Matrix

| Entity | Owning Domain | Write Authority |
|---|---|---|
| User | Identity | Identity Module |
| Organization | Organization | Organization Module |
| Membership | Organization | Organization Module |
| Role | Organization/Auth | Authorization Module |
| Project | Project | Project Module |
| Platform | Platform | Platform Module |
| Platform Version | Platform | Platform Module |
| Capability | Platform | Platform Module |
| Lab | Lab | Lab Module |
| Lab Agent | Lab | Lab Module |
| Resource | Lab | Lab Module |
| Robot | Lab | Lab Module |
| Build | Build | Build Module |
| Artifact | Artifact | Artifact Module |
| Credit Plan | Credit | Credit Module |
| Wallet | Credit | Credit Module |
| Ledger | Credit | Credit Module |
| Booking | Booking | Booking Module |
| Job | Execution | Job Module |
| Run | Execution | Run Module |
| Result | Result | Result Module |
| Experiment | Experiment | Experiment Module |
| Event | Event Infrastructure | Event Module |
| Audit | Audit | Audit Module |
| Idempotency | System | Platform Infrastructure |
| Reconciliation | System/Lab/Execution | Reconciliation Worker |

# 12. Identity Data Ownership

The Identity domain owns:

- user identity;
- identity-provider reference;
- account status;
- user profile fields;
- authentication lifecycle metadata.

Authentication secrets should remain with the identity provider wherever
possible.

# 13. Identity Write Rules

Only the Identity domain may directly change:

- user status;
- identity-provider reference;
- authentication lifecycle.

Other domains may store user IDs but may not modify identity records.

# 14. Organization Ownership

The Organization domain owns:

- organizations;
- memberships;
- organization settings;
- organizational roles.

It is responsible for:

- tenant creation;
- membership changes;
- role assignments;
- organization lifecycle.

# 15. Membership Ownership

Membership is exclusively owned by the Organization domain.

Other domains may query:

    Is user U a member of organization O?

They may not directly modify membership.

# 16. Role Ownership

Role definitions may be global configuration.

Role assignments are owned by the Organization domain.

Role changes must be audited.

# 17. Project Ownership

The Project domain owns:

- projects;
- project status;
- project metadata;
- project archival.

Other domains may reference `project_id`.

They may not modify project lifecycle directly.

# 18. Platform Ownership

The Platform domain owns:

- platform definitions;
- platform versions;
- capabilities;
- compatibility rules;
- platform lifecycle.

Platform configuration is global rather than tenant-owned.

# 19. Platform Read Access

Many domains may read platform information:

- Artifact;
- Booking;
- Credit;
- Job;
- Lab;
- Studio;
- Web Console.

Read access should use a stable application interface rather than arbitrary
table queries.

# 20. Platform Write Access

Only the Platform domain may modify:

- platform status;
- platform version;
- capabilities;
- compatibility metadata.

Administrative operations must be audited.

# 21. Lab Ownership

The Lab domain owns:

- Labs;
- Lab Agents;
- Resources;
- Robots;
- operational resource state.

The Lab domain is responsible for:

- resource registration;
- resource lifecycle;
- Agent health;
- resource availability;
- maintenance state.

# 22. Lab Agent Ownership

Lab Agent state is owned by the Lab domain.

The Lab Agent itself operates locally, but the Control Plane owns:

- registration;
- identity;
- connectivity status;
- version;
- capability metadata.

# 23. Robot Ownership

Robot physical identity is owned by the Lab domain.

The Lab domain may update:

- hardware revision;
- firmware metadata;
- maintenance state;
- operational registration.

Physical safety remains locally authoritative.

# 24. Resource Ownership

Resource is the execution/allocation abstraction.

Lab owns:

- resource identity;
- resource status;
- health;
- allocation availability;
- platform compatibility.

Booking may reserve a Resource but does not own it.

# 25. Build Ownership

Build data is owned by the Build domain.

A Build records:

- project;
- target platform;
- SDK/toolchain;
- status;
- timing;
- error metadata.

The initial product prioritizes local builds.

# 26. Source-Code Ownership

Customer source code remains on the user's local machine by default.

RaaS does not become the source-code system of record.

The system should retain only build metadata required for operation and audit.

# 27. Artifact Ownership

Artifact metadata is owned by the Artifact domain.

Artifact binary content is stored in object storage.

Artifact domain controls:

- creation;
- validation;
- acceptance;
- revocation;
- expiration.

# 28. Artifact Read Access

Artifact metadata may be read by:

- Project;
- Booking;
- Job;
- Run;
- Result;
- Lab execution components.

The Lab Agent receives only authorized artifact access for an active execution
workflow.

# 29. Artifact Write Access

Only Artifact domain may change:

- validation status;
- revocation;
- compatibility;
- artifact lifecycle.

Job execution must never mutate artifact metadata directly.

# 30. Credit Ownership

Credit domain owns:

- Credit Plans;
- Wallets;
- Ledger Entries;
- credit consumption;
- refunds;
- adjustments.

Financial integrity is a protected ownership boundary.

# 31. Credit Plan Ownership

Credit Plan is global commercial configuration.

Credit owns:

- plan definition;
- platform association;
- credit quantity;
- price;
- validity;
- effective dates.

# 32. Wallet Ownership

Wallet belongs to an Organization and Platform.

Credit domain alone may mutate:

- available balance;
- reserved balance;
- wallet status.

# 33. Ledger Ownership

Ledger is immutable financial history.

Only Credit domain may create:

- purchases;
- grants;
- consumption;
- refunds;
- reversals;
- adjustments.

Other domains request credit operations through an application interface.

# 34. Ledger Write Interface

Conceptual interface:

    CreditService.consume(
        organization_id,
        platform_id,
        amount,
        reference_type,
        reference_id,
        idempotency_key
    )

The caller does not update the ledger table directly.

# 35. Booking Ownership

Booking domain owns:

- booking;
- availability;
- reservation;
- cancellation;
- booking state.

Booking is responsible for resource-time conflict validation.

# 36. Booking Read Access

Booking information may be read by:

- Studio;
- Web Console;
- Credit;
- Job;
- Lab;
- Results;
- Audit.

Access must remain organization-scoped for customer views.

# 37. Booking Write Access

Only Booking domain may directly modify:

- booking status;
- booking time;
- reservation state;
- cancellation.

Credit operations occur through Credit domain interfaces.

# 38. Execution Ownership

Execution domain owns:

- Jobs;
- Runs;
- execution lifecycle;
- deployment metadata;
- execution reconciliation.

Execution is divided logically into:

- Job lifecycle;
- Run lifecycle.

# 39. Job Ownership

Job domain owns:

- Job creation;
- queueing;
- validation state;
- allocation state;
- deployment state;
- cancellation;
- terminal status.

# 40. Run Ownership

Run domain owns:

- execution attempts;
- runtime state;
- start/stop state;
- completion state;
- runtime failure metadata.

# 41. Result Ownership

Result domain owns:

- result records;
- result processing;
- result metadata;
- result availability;
- result retention metadata.

Execution may report that a Run completed but must not directly modify
result records.

# 42. Experiment Ownership

Experiment domain owns:

- experiments;
- experiment metadata;
- experiment-to-Run relationships;
- experiment analysis state.

It may read Run and Result data but does not own them.

# 43. Event Ownership

Event infrastructure owns:

- durable event records where persistence is required;
- event identity;
- sequence;
- schema version;
- replay metadata.

Domain modules generate domain events through controlled interfaces.

# 44. Audit Ownership

Audit domain owns audit records.

Any module may request an audit entry.

No module may update or delete historical audit records except through a
controlled retention process.

# 45. Idempotency Ownership

Platform infrastructure owns idempotency records.

Application domains use the idempotency service.

They do not directly manipulate idempotency rows.

# 46. Reconciliation Ownership

Reconciliation is cross-domain infrastructure.

It may coordinate:

- Execution;
- Lab;
- Credit;
- Booking;
- Resource.

The reconciliation engine does not become the owner of business state.

It identifies and resolves state mismatches through owning-domain interfaces.

# 47. Read/Write Principle

The fundamental rule is:

    Owner Domain
        |
        +-- READ
        +-- WRITE
        +-- DELETE/RETIRE
        +-- MIGRATE
        |
    Other Domains
        |
        +-- READ through interface
        +-- REQUEST WRITE through interface

# 48. Direct SQL Access Policy

Production application modules must not directly write another module's
tables.

Disallowed:

    Job Module
        |
        +-- UPDATE credit.wallet
        +-- INSERT credit.ledger

Allowed:

    Job Module
        |
        v
    CreditService.consume()
        |
        v
    Credit Module
        |
        +-- UPDATE wallet
        +-- INSERT ledger

# 49. Cross-Domain Reads

Cross-domain reads should use:

- repository interfaces;
- application services;
- domain query interfaces;
- carefully controlled read models.

Direct SQL may be permitted internally in the owning module.

# 50. Cross-Domain Writes

Cross-domain writes require the owning domain's application service.

Examples:

    BookingService
       |
       +-- CreditService.reserve()

    JobService
       |
       +-- ArtifactService.validate()
       +-- BookingService.validate()

    ResultService
       |
       +-- RunService.mark_result_available()

# 51. Transaction Ownership

The initiating application service normally owns the business transaction.

Example:

    BookingService
       |
    BEGIN
       |
       +-- validate platform
       +-- validate resource
       +-- reserve credit
       +-- create booking
       |
    COMMIT

The final transaction design must avoid uncontrolled cross-module coupling.

# 52. Distributed Future Boundary

If modules later become separate services:

- cross-service transactions must not assume shared DB transactions;
- outbox/events must be used;
- idempotency becomes mandatory;
- eventual consistency must be explicit.

The initial modular monolith deliberately postpones this complexity.

# 53. Shared Database Principle

A shared PostgreSQL database does not mean shared write ownership.

The following distinction is mandatory:

    Physical Database
          !=
    Logical Data Ownership

# 54. Table Access Matrix

| Domain | Own Write | Cross Read | Cross Write |
|---|---:|---:|---:|
| Identity | User | Controlled | No |
| Organization | Org/Membership/Role | User | No |
| Project | Project | User/Org/Platform | No |
| Platform | Platform/Version/Capability | Broad | No |
| Lab | Lab/Agent/Resource/Robot | Platform | No |
| Build | Build | Project/Platform | No |
| Artifact | Artifact | Project/Platform/Build | No |
| Credit | Plans/Wallet/Ledger | Platform/Booking/Job | Via API |
| Booking | Booking | Org/Project/Platform/Resource | Credit API |
| Execution | Job/Run | Artifact/Booking/Resource | Credit/Artifact APIs |
| Result | Result | Run/Project | Execution API |
| Experiment | Experiment | Run/Result/Project | No |
| Event | Event | Domain state | Event interface |
| Audit | Audit | Domain state | Audit interface |
| System | Idempotency/Reconciliation | All | Controlled |

# 55. Data Classification

Kritva RaaS data should be classified into:

- Public;
- Internal;
- Confidential;
- Restricted;
- Safety-Critical Operational.

# 56. Public Data

Examples:

- public platform descriptions;
- public documentation;
- published credit-plan information;
- public availability information intentionally exposed.

Public data must not contain:

- credentials;
- private customer information;
- internal infrastructure;
- security-sensitive information.

# 57. Internal Data

Examples:

- operational metrics;
- non-sensitive configuration;
- internal platform metadata;
- aggregate utilization.

Internal data is not customer-public by default.

# 58. Confidential Data

Examples:

- organization information;
- project metadata;
- artifact metadata;
- booking history;
- Job/Run history;
- experiment data;
- customer result metadata.

Access requires authorization.

# 59. Restricted Data

Examples:

- credit ledger;
- payment references;
- security audit information;
- identity-sensitive information;
- credentials or secret references;
- incident evidence.

Restricted data requires stronger access controls and audit.

# 60. Safety-Critical Operational Data

Examples:

- safety-state indications;
- E-stop status;
- interlock state;
- robot fault state;
- safety-related Lab events.

This data is operationally sensitive.

Cloud records provide coordination and evidence but do not replace local
safety authority.

# 61. Data Classification Matrix

| Data | Classification |
|---|---|
| Public Platform Description | Public |
| User Profile | Confidential |
| Organization Data | Confidential |
| Project Metadata | Confidential |
| Artifact Metadata | Confidential |
| Artifact Binary | Confidential/Restricted |
| Credit Ledger | Restricted |
| Booking | Confidential |
| Job/Run | Confidential |
| Results | Confidential |
| Audit | Restricted |
| Security Events | Restricted |
| Safety Events | Restricted |
| Internal Metrics | Internal |

# 62. Personal Data

Potential personal data includes:

- name;
- email;
- user identity references;
- billing contacts;
- actor identifiers;
- IP-related audit information;
- organization membership.

The product should minimize collection.

# 63. Data Minimization

Only collect data required for:

- authentication;
- authorization;
- operation;
- billing;
- support;
- audit;
- security;
- legal obligations.

Do not collect customer source code by default.

# 64. Purpose Limitation

Data must be used only for legitimate product/operational purposes.

For example:

- billing data for billing;
- audit data for audit/security;
- execution data for execution and analysis.

# 65. Tenant Boundary

Organization is the primary tenant boundary.

Customer-owned data must have:

    organization_id

or an unambiguous ownership path through a parent entity.

# 66. Tenant Isolation Flow

    User
      |
    Membership
      |
    Organization
      |
    Permission
      |
    Resource Ownership
      |
    Data Access

No client-provided organization ID may override server-side authorization.

# 67. Global Versus Tenant Data

Global data:

- Platform;
- Platform Version;
- Capability;
- Credit Plan;
- Lab;
- Resource;
- Robot.

Tenant data:

- Project;
- Build;
- Artifact;
- Wallet;
- Ledger;
- Booking;
- Job;
- Run;
- Result;
- Experiment.

Mixed-context data:

- Events;
- Audit;
- Reconciliation.

# 68. Data Retention Principles

Retention must consider:

- operational usefulness;
- customer expectations;
- legal requirements;
- financial requirements;
- security;
- cost;
- recovery.

Retention periods must be configurable where appropriate.

# 69. Retention Matrix

| Data | Initial Retention Direction |
|---|---|
| User | Account lifecycle + legal requirement |
| Organization | Long-term |
| Membership | Historical |
| Project | Long-term |
| Build Metadata | Long-term/policy |
| Artifact Metadata | Long-term/policy |
| Artifact Binary | Policy-based |
| Credit Ledger | Long-term |
| Booking | Long-term |
| Job/Run | Long-term/policy |
| Result Metadata | Long-term/policy |
| Result Files | Policy-based |
| Audit | Multi-year/policy |
| Events | Domain-specific |
| Idempotency | Short TTL |
| Reconciliation | Operational TTL/history |
| Logs | Shorter operational retention |
| Video | Policy-based |
| Telemetry | Policy-based |

# 70. Retention Ownership

Each owner is responsible for:

- defining required retention;
- implementing lifecycle;
- monitoring deletion;
- preventing premature deletion.

Security and legal policies may override normal operational retention.

# 71. Deletion Principles

Deletion must distinguish:

- account deletion;
- tenant deletion;
- project archival;
- object expiration;
- legal retention;
- security preservation.

Deleting a customer account does not automatically mean deleting all
historical financial or audit data.

# 72. GDPR-Style Deletion

Kritva RaaS should support a privacy workflow capable of:

- access request;
- export request;
- correction;
- deletion request;
- restriction;
- anonymization where deletion is not legally permissible.

Exact legal obligations depend on applicable jurisdiction and customer role.

# 73. Data Subject Request

Conceptual flow:

    Request
       |
    Verify Identity
       |
    Determine Scope
       |
    Identify Data
       |
    Check Retention Exceptions
       |
    Export / Correct / Delete / Anonymize
       |
    Audit Action
       |
    Confirm Completion

# 74. Privacy Request Ownership

A privacy workflow should be coordinated by an authorized privacy/compliance
function.

Technical domains provide controlled operations.

No administrator should manually delete arbitrary customer rows.

# 75. Data Inventory

The system must be able to identify:

- where personal data exists;
- which organization owns it;
- which tables contain it;
- which object storage objects contain it;
- which retention rules apply.

# 76. User Export

A user/organization export should include data the requester is authorized
to receive.

Potential export categories:

- profile;
- organization membership;
- projects;
- artifacts metadata;
- bookings;
- credit transactions where authorized;
- Jobs;
- Runs;
- results metadata;
- experiments;
- relevant audit information subject to policy.

# 77. Export Boundary

Export must not include:

- another organization's data;
- internal security secrets;
- privileged audit information;
- other users' personal data without authorization.

# 78. Export Format

A future standard export package may contain:

    manifest.json
    identity/
    organization/
    projects/
    bookings/
    credits/
    execution/
    results/
    experiments/

Large files may be supplied through time-limited authorized downloads.

# 79. Export Audit

Every export must record:

- requester;
- organization;
- scope;
- timestamp;
- export ID;
- result;
- expiration.

# 80. Deletion Workflow

Customer deletion should use a controlled job:

    Delete Request
       |
    Verify Authorization
       |
    Build Deletion Plan
       |
    Identify Dependencies
       |
    Apply Policy
       |
    Anonymize/Delete
       |
    Remove Eligible Objects
       |
    Verify
       |
    Audit Completion

# 81. Deletion Dependency Rules

Before deleting:

- User → memberships;
- Organization → projects;
- Project → artifacts;
- Project → bookings;
- Project → Jobs;
- Jobs → Runs;
- Runs → results;
- Wallet → ledger;
- audit → actor references.

Historical data may require anonymization rather than deletion.

# 82. Financial Deletion

Credit ledger records generally must not be deleted merely because a user
requests account deletion if financial/audit retention requires them.

Instead:

- retain required transaction record;
- remove/minimize unnecessary personal attributes;
- preserve legal/accounting references.

# 83. Audit Deletion

Audit records should not be deleted merely to satisfy an ordinary account
deletion workflow when security or legal retention requires preservation.

Personal fields may be anonymized according to approved policy.

# 84. Artifact Deletion

Artifact binary deletion must consider:

- active Jobs;
- historical Runs;
- retention;
- customer request;
- legal hold.

Database metadata may remain after binary expiration.

# 85. Result Deletion

Result files may be deleted according to retention policy while retaining
minimal metadata required for audit or execution history.

# 86. Tenant Deletion

Organization deletion is a controlled lifecycle.

Possible sequence:

    Suspend
      |
    Stop New Activity
      |
    Resolve Active Jobs
      |
    Resolve Bookings
      |
    Financial Reconciliation
      |
    Export
      |
    Retention Evaluation
      |
    Delete/Anonymize
      |
    Verify
      |
    Close Tenant

# 87. Active Job Protection

Tenant deletion must not blindly delete active Jobs or Runs.

Active physical execution must first be handled through safe execution and
Lab procedures.

# 88. Safety Data Retention

Safety incidents may require longer retention for:

- investigation;
- safety improvement;
- legal requirements.

Deletion must not remove evidence of safety events prematurely.

# 89. Privacy and Object Storage

Deletion/export must cover both:

    PostgreSQL
        +
    Object Storage

An object-storage-only record is still customer data if it is tenant-owned.

# 90. Object Ownership

Object keys should encode ownership safely.

Example:

    organizations/{organization_id}/projects/{project_id}/artifacts/{artifact_id}/...

Authorization must still be checked; object key structure is not an access
control mechanism.

# 91. Object Access

Object access should use:

- short-lived signed URLs;
- scoped authorization;
- server-controlled object keys;
- digest validation.

# 92. Cross-Domain Read Interfaces

Examples:

    PlatformService.getCompatibility(...)
    OrganizationService.getMembership(...)
    ProjectService.getProject(...)
    ArtifactService.validate(...)
    BookingService.getBooking(...)
    CreditService.getBalance(...)
    LabService.getResource(...)
    RunService.getRun(...)
    ResultService.getResult(...)

# 93. Cross-Domain Write Interfaces

Examples:

    CreditService.consume(...)
    CreditService.refund(...)
    BookingService.confirm(...)
    BookingService.cancel(...)
    ArtifactService.revoke(...)
    ExecutionService.start(...)
    ExecutionService.stop(...)
    ResultService.create(...)

# 94. Interface Principle

Interfaces should expose business operations, not tables.

Bad:

    update_credit_wallet_row(...)

Good:

    CreditService.consume(...)

Bad:

    update_job_status(...)

Good:

    JobService.transition(job_id, target_state)

# 95. Repository Ownership

Repositories belong to their owning domain.

Examples:

    CreditRepository
        -> credit schema

    BookingRepository
        -> booking schema

    JobRepository
        -> execution schema

Cross-domain modules should not instantiate another domain's repository for
writes unless the architecture explicitly defines an internal application
boundary.

# 96. Read Models

Read models may combine data from multiple domains.

Examples:

- Dashboard summary;
- Robot availability;
- Job details;
- Billing summary.

A read model is derived and does not become the authority for source data.

# 97. Dashboard Ownership

Dashboard data may combine:

    Organization
    Project
    Booking
    Job
    Run
    Credit
    Result

The dashboard service may read all required domains through controlled query
interfaces.

# 98. Materialized Views

Materialized views may be introduced for expensive read patterns.

They are derived data.

The owning source tables remain authoritative.

# 99. Data Synchronization

When derived data becomes stale:

- source state remains authoritative;
- refresh/rebuild is possible;
- correctness must not depend on the derived copy.

# 100. Event-Based Propagation

Cross-domain derived state may use events:

    Booking.confirmed
          |
          v
    Execution Availability
          |
          v
    Derived Read Model

Event delivery is at-least-once.

Consumers must deduplicate.

# 101. Audit Ownership Across Modules

Any module may produce an audit request:

    AuditService.record(
        actor,
        action,
        resource,
        outcome
    )

Audit module owns persistence.

# 102. Data Access Logging

Restricted data access should be auditable.

Examples:

- credit ledger access;
- administrative customer data access;
- exports;
- privacy deletion;
- security investigation.

# 103. Administrative Access

Administrative users do not automatically receive unrestricted database
access.

Application-level administration must use audited APIs.

Direct SQL access should be emergency/operational-only and separately
controlled.

# 104. Break-Glass Access

Emergency database access should:

- require strong authentication;
- be time limited;
- be audited;
- have a reason;
- be reviewed.

# 105. Migration Ownership

Each domain owns migrations for its schema.

Cross-schema migrations require:

- coordination;
- dependency ordering;
- compatibility review.

# 106. Schema Access Roles

Logical database roles may include:

- application runtime;
- migration;
- reporting;
- operations;
- recovery.

The application runtime must not have unrestricted DDL access.

# 107. Data Classification and Access

Access policy should map classification to privilege.

| Classification | Default Access |
|---|---|
| Public | Public |
| Internal | Authorized staff/services |
| Confidential | Tenant-authorized users/services |
| Restricted | Explicitly authorized roles |
| Safety-Critical | Authorized Lab/Safety personnel |

# 108. Privacy by Design

Privacy controls should be built into:

- schema;
- APIs;
- repositories;
- object storage;
- logging;
- audit;
- export;
- deletion.

Privacy should not depend solely on operational discipline.

# 109. Logging Restrictions

Do not log:

- passwords;
- tokens;
- secret values;
- full artifact contents;
- customer source code;
- unnecessary personal data;
- payment credentials.

# 110. Trace Restrictions

Distributed tracing must use identifiers rather than sensitive payloads.

Trace attributes may include:

- organization ID;
- project ID;
- Job ID;
- Run ID.

Sensitive request bodies must not be copied into traces.

# 111. Backup Ownership

Database backup is owned operationally by the cloud/database infrastructure
team.

Application domains remain responsible for:

- recoverability requirements;
- data integrity validation;
- retention requirements.

# 112. Backup Privacy

Backups contain customer data and must therefore follow:

- encryption;
- access control;
- retention;
- deletion/legal-hold policies;
- restore security.

A deleted customer record may remain in protected backups until backup
retention expires, subject to applicable legal requirements.

# 113. Data Residency

Data residency requirements must be configurable according to deployment
jurisdiction.

The logical data model should avoid assuming one permanent geography.

# 114. Tenant Export and Backup

Customer export is distinct from infrastructure backup.

Backup:

- operational recovery;
- controlled internal access.

Export:

- customer-authorized data portability.

They must not be conflated.

# 115. Incident Data Ownership

During incidents:

- owning domain remains authoritative;
- Incident Commander coordinates;
- Security controls restricted data;
- Lab controls physical state;
- Audit records actions.

Incident response must not bypass ownership boundaries unnecessarily.

# 116. Security Incident Ownership

Security may temporarily restrict access or isolate data.

However, permanent data changes remain subject to owning-domain controls and
approved recovery procedures.

# 117. Data Correction

Corrections should use domain operations.

Examples:

    Credit adjustment
    Booking correction
    Organization metadata update
    Artifact revocation

Avoid direct SQL edits except controlled emergency procedures.

# 118. Manual Data Fixes

Manual production data fixes require:

- incident/change ID;
- owner approval;
- exact scope;
- backup/recovery confidence;
- audit;
- post-change validation.

# 119. Data Integrity Reconciliation

Reconciliation should validate relationships such as:

    Job.organization_id
        ==
    Project.organization_id

    Artifact.project_id
        belongs to
    Artifact.organization_id

    Wallet.platform_id
        ==
    Booking.platform_id

    Run.organization_id
        ==
    Job.organization_id

# 120. Ownership During Service Evolution

If the modular monolith becomes microservices later:

    Existing Domain Owner
          |
    Service Extraction
          |
    Database Ownership Transfer
          |
    API/Event Boundary
          |
    Independent Persistence

The logical owner should not change merely because deployment changes.

# 121. Phase Mapping

| Phase | Ownership Objective |
|---|---|
| Phase 0 | Establish ownership model |
| Phase 1 | Identity/tenant ownership |
| Phase 2 | Platform/resource/artifact ownership |
| Phase 3 | Execution ownership |
| Phase 4 | Commercial ownership |
| Phase 5 | Remote execution ownership |
| Phase 6 | Lab/robot ownership |
| Phase 7 | Results/events/audit |
| Phase 8 | Privacy, scale and governance |

# 122. Phase 0

Define:

- owner matrix;
- classification;
- access rules;
- retention principles;
- privacy workflow.

Acceptance:

- [ ] ownership approved;
- [ ] data classification approved;
- [ ] tenant boundary approved.

# 123. Phase 1

Implement:

- User;
- Organization;
- Membership;
- Role;
- Project.

Acceptance:

- [ ] only owning modules write identity/organization data;
- [ ] tenant isolation works;
- [ ] membership changes are audited.

# 124. Phase 2

Implement:

- Platform;
- Lab;
- Resource;
- Robot;
- Build;
- Artifact.

Acceptance:

- [ ] global versus tenant data is clear;
- [ ] artifact ownership is enforced;
- [ ] source remains local.

# 125. Phase 3

Implement:

- Job;
- Run;
- Idempotency;
- Reconciliation.

Acceptance:

- [ ] execution data has one owner;
- [ ] cross-domain writes use interfaces;
- [ ] uncertain state is reconciled.

# 126. Phase 4

Implement:

- Credit Plan;
- Wallet;
- Ledger;
- Booking.

Acceptance:

- [ ] Credit domain owns financial state;
- [ ] Booking owns reservation state;
- [ ] direct financial table writes are prohibited.

# 127. Phase 5

Implement:

- remote deployment;
- execution coordination;
- artifact delivery.

Acceptance:

- [ ] Lab Agent receives scoped access;
- [ ] execution does not mutate credit tables directly;
- [ ] remote state remains auditable.

# 128. Phase 6

Implement:

- Lab Agent;
- Robot;
- safety-state records;
- physical resource lifecycle.

Acceptance:

- [ ] Lab owns robot data;
- [ ] physical safety remains local;
- [ ] cloud state is clearly classified.

# 129. Phase 7

Implement:

- Result;
- Experiment;
- Event;
- Audit;
- export foundation.

Acceptance:

- [ ] result ownership is separate from execution;
- [ ] events are durable where required;
- [ ] audit ownership is explicit;
- [ ] exports can be scoped.

# 130. Phase 8

Implement:

- retention automation;
- deletion workflows;
- privacy export;
- anonymization;
- advanced access governance;
- data lifecycle monitoring.

Acceptance:

- [ ] privacy workflows are tested;
- [ ] retention is enforced;
- [ ] data inventory is maintained;
- [ ] production access is audited.

# 131. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Multiple writers | Critical | Single domain write authority |
| Cross-tenant access | Critical | Tenant enforcement |
| Direct SQL coupling | High | Repository/application interfaces |
| Data deletion loss | Critical | Retention/restrict policy |
| Financial corruption | Critical | Credit ownership |
| Privacy breach | Critical | Classification/minimization |
| Orphaned objects | High | DB/object reconciliation |
| Unclear service boundary | High | Ownership matrix |
| Microservice extraction complexity | Medium | Stable domain contracts |
| Excessive admin access | High | Least privilege |
| Backup privacy leakage | High | Encrypted restricted backups |
| Audit tampering | Critical | Append-only controls |
| Excessive personal data | Medium | Data minimization |
| Incorrect export | Critical | Tenant-scoped export |
| Incomplete deletion | High | Data inventory |
| Safety data loss | Critical | Safety retention |
| Stale derived data | Medium | Source-of-truth model |
| Manual production edits | High | Change-controlled fixes |

# 132. Open Questions

1. Final identity provider.
2. Final privacy/compliance ownership.
3. Exact applicable GDPR/data-protection jurisdictions.
4. Final data residency requirements.
5. Final user deletion policy.
6. Final organization deletion policy.
7. Exact legal retention periods.
8. Final export format.
9. Final privacy-request tooling.
10. Final anonymization strategy.
11. Final RLS adoption.
12. Final database role model.
13. Final reporting read model.
14. Final service extraction boundaries.
15. Final object-storage deletion workflow.
16. Final backup deletion/legal-hold policy.
17. Final audit retention.
18. Final safety data retention.
19. Final payment-provider data boundary.
20. Final administrative break-glass process.

# 133. Full Acceptance Criteria

## Ownership

- [ ] Every major entity has one owner.
- [ ] Every schema has an owner.
- [ ] Write authority is explicit.
- [ ] Read access is explicit.
- [ ] Cross-domain writes are controlled.
- [ ] Migration ownership is defined.
- [ ] Retention ownership is defined.

## Identity

- [ ] Identity owns User.
- [ ] Identity credentials remain appropriately external.
- [ ] Other domains cannot modify User state directly.
- [ ] User deletion policy is defined.

## Organization

- [ ] Organization owns Membership.
- [ ] Role assignment is controlled.
- [ ] Organization is tenant boundary.
- [ ] Membership changes are audited.
- [ ] Tenant deletion is controlled.

## Project

- [ ] Project owns project lifecycle.
- [ ] Other domains reference projects without modifying them.
- [ ] Project archive is supported.
- [ ] Project data is tenant-scoped.

## Platform

- [ ] Platform owns platform configuration.
- [ ] Platform versions are owned by Platform.
- [ ] Capabilities are owned by Platform.
- [ ] Administrative changes are audited.
- [ ] Customer domains cannot mutate platform configuration.

## Lab

- [ ] Lab owns Lab Agent.
- [ ] Lab owns Resource.
- [ ] Lab owns Robot.
- [ ] Physical safety authority remains local.
- [ ] Resource status is controlled by Lab.

## Build and Artifact

- [ ] Build ownership is explicit.
- [ ] Customer source remains local by default.
- [ ] Artifact metadata is owned by Artifact domain.
- [ ] Artifact binary ownership is represented in object storage.
- [ ] Artifact lifecycle is controlled by Artifact domain.

## Credits

- [ ] Credit Plan is owned by Credit domain.
- [ ] Wallet is owned by Credit domain.
- [ ] Ledger is owned by Credit domain.
- [ ] Ledger is append-oriented.
- [ ] Other domains cannot directly modify credit tables.
- [ ] Financial operations are audited.

## Booking

- [ ] Booking domain owns reservation state.
- [ ] Resource reservation is controlled.
- [ ] Booking cancellation is controlled.
- [ ] Credit operations use Credit interfaces.
- [ ] Booking history is retained.

## Execution

- [ ] Job ownership is explicit.
- [ ] Run ownership is explicit.
- [ ] Execution does not directly mutate external domain tables.
- [ ] Artifact access is authorized.
- [ ] Resource state is queried through Lab.
- [ ] Uncertain execution is reconciled.

## Results

- [ ] Result domain owns result metadata.
- [ ] Large result files use object storage.
- [ ] Execution does not directly own result lifecycle.
- [ ] Result retention is defined.

## Events and Audit

- [ ] Event ownership is explicit.
- [ ] Event persistence is controlled.
- [ ] Audit ownership is explicit.
- [ ] Audit records cannot be casually deleted.
- [ ] Domain actions can generate audit records.

## Access

- [ ] Direct cross-domain writes are prohibited.
- [ ] Cross-domain reads use defined interfaces.
- [ ] Database access roles are controlled.
- [ ] Administrative access is audited.
- [ ] Break-glass access is controlled.

## Data Classification

- [ ] Public data is identified.
- [ ] Internal data is identified.
- [ ] Confidential data is identified.
- [ ] Restricted data is identified.
- [ ] Safety-critical data is identified.
- [ ] Classification maps to access controls.

## Privacy

- [ ] Personal data inventory exists.
- [ ] Data minimization is applied.
- [ ] Purpose limitation is documented.
- [ ] Tenant isolation is enforced.
- [ ] Export is supported.
- [ ] Deletion is supported.
- [ ] Anonymization is supported where required.
- [ ] Financial/legal retention exceptions are documented.

## Export

- [ ] Export requester is authenticated.
- [ ] Export scope is authorized.
- [ ] Cross-tenant data is excluded.
- [ ] Large files can be exported securely.
- [ ] Export actions are audited.
- [ ] Export artifacts expire appropriately.

## Deletion

- [ ] Deletion requests are authenticated.
- [ ] Dependencies are evaluated.
- [ ] Active Jobs are handled safely.
- [ ] Financial history is protected.
- [ ] Audit history is protected.
- [ ] Object storage is included.
- [ ] Deletion completion is verified.
- [ ] Deletion is audited.

## Retention

- [ ] Every major entity has a retention direction.
- [ ] Financial retention is defined.
- [ ] Audit retention is defined.
- [ ] Result retention is defined.
- [ ] Artifact retention is defined.
- [ ] Operational data retention is defined.
- [ ] Backup retention is considered.
- [ ] Legal holds can override deletion.

## Operations

- [ ] Data ownership is included in incident response.
- [ ] Data reconciliation exists.
- [ ] Backup ownership is defined.
- [ ] Restore responsibilities are defined.
- [ ] Production data fixes are controlled.
- [ ] Database migrations have owners.

# 134. Final Ownership Invariants

Kritva RaaS must preserve these ownership invariants:

1. Every authoritative dataset has exactly one logical owner.
2. Shared PostgreSQL does not imply shared write authority.
3. Cross-domain writes use owner-controlled interfaces.
4. Tenant-owned data belongs to an Organization.
5. Organization is the primary customer boundary.
6. User identity is separate from membership.
7. Platform configuration is globally owned.
8. Lab and Robot state is operationally owned by the Lab domain.
9. Customer source code remains local by default.
10. Artifact metadata is owned by Artifact.
11. Artifact binary content is owned by object storage.
12. Credit and ledger state is exclusively owned by Credit.
13. Booking state is owned by Booking.
14. Job and Run state is owned by Execution.
15. Result state is owned by Result.
16. Experiment state is owned by Experiment.
17. Events are durable facts, not mutable source-of-truth state.
18. Audit records are protected historical evidence.
19. Idempotency is infrastructure-owned.
20. Reconciliation coordinates domains without owning their business state.
21. Direct cross-domain table writes are prohibited.
22. Tenant context cannot be supplied blindly by the client.
23. Financial history cannot be casually deleted.
24. Audit history cannot be casually deleted.
25. Physical safety state remains locally authoritative.
26. Privacy workflows must cover PostgreSQL and object storage.
27. Export must be tenant-scoped.
28. Deletion must respect retention and legal obligations.
29. Backups are protected customer data.
30. Ownership boundaries remain valid even if modules later become separate
    services.

# 135. Final Data Ownership Model

The complete ownership model is:

    IDENTITY
       |
       +-- User

    ORGANIZATION
       |
       +-- Organization
       +-- Membership
       +-- Role

    PROJECT
       |
       +-- Project

    PLATFORM
       |
       +-- Platform
       +-- Platform Version
       +-- Capability

    LAB
       |
       +-- Lab
       +-- Lab Agent
       +-- Resource
       +-- Robot

    BUILD
       |
       +-- Build

    ARTIFACT
       |
       +-- Artifact
       +-- Object Storage Payload

    CREDIT
       |
       +-- Credit Plan
       +-- Wallet
       +-- Ledger

    BOOKING
       |
       +-- Booking

    EXECUTION
       |
       +-- Job
       +-- Run

    RESULT
       |
       +-- Result

    EXPERIMENT
       |
       +-- Experiment

    EVENT
       |
       +-- Event

    AUDIT
       |
       +-- Audit

    SYSTEM
       |
       +-- Idempotency
       +-- Reconciliation

# 136. Final Data Governance Flow

    Data Created
         |
    Classify
         |
    Assign Owner
         |
    Assign Tenant Scope
         |
    Define Read/Write Policy
         |
    Define Retention
         |
    Store Authoritatively
         |
    Audit Sensitive Operations
         |
    Export/Delete Under Policy
         |
    Verify Lifecycle

# 137. Final Principle

> **Kritva RaaS must treat data ownership as an architectural boundary, not
> merely a database convention. Each domain owns the meaning, lifecycle and
> write authority of its data; other domains interact through controlled
> interfaces; organization ownership defines the customer boundary; global
> platform and laboratory configuration remains separate from tenant data;
> financial, execution and audit history is protected from destructive
> operations; large customer files remain in object storage; and privacy,
> export, deletion and retention workflows must operate across every
> authoritative storage system. This model preserves integrity in the
> current modular monolith and provides a clean path to future service
> decomposition without changing the fundamental ownership of the data.**
