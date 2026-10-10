# Kritva RaaS Service Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Service Architecture |
| Path | `docs/backend/architecture/SERVICE_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Initial Deployment Model | Modular Monolith |
| Future Deployment Model | Selectively extracted services |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Database | PostgreSQL |
| Object Storage | S3-compatible abstraction |
| Async Transport | Queue |
| Robot Boundary | Lab Agent |
| Protocol | Versioned RaaS/Lab Protocol |

## 2. Purpose

This document defines the service and module boundaries of the Kritva RaaS
Control Plane.

The architecture identifies the business capabilities that form the backend
system:

- Identity;
- Organization;
- Project;
- Platform;
- Artifact;
- Booking;
- Credit;
- Billing;
- Job;
- Run;
- Result;
- Lab;
- Audit;
- Notification.

These capabilities are implemented initially as modules inside a production-
oriented modular monolith.

The term "service" in this document therefore means a logical business service
boundary unless explicitly stated as a separately deployed service.

## 3. Architectural Principle

The initial architecture is:

    +-------------------------------------------------------------+
    |                    RaaS Control Plane                      |
    |                                                             |
    | Identity | Organization | Project | Platform | Artifact    |
    | Booking | Credit | Billing | Job | Run | Result             |
    | Lab | Audit | Notification                                  |
    |                                                             |
    +-------------------------------------------------------------+
             |              |                 |
             v              v                 v
        PostgreSQL     Object Storage       Queue
                                             |
                                             v
                                          Workers
                                             |
                                             v
                                         Lab Agent
                                             |
                                             v
                                           Robot

The boundaries are designed so that selected modules can later become
independently deployed services without redesigning the product model.

## 4. Scope

This document defines for each logical service:

- responsibility;
- ownership;
- public interfaces;
- commands;
- queries;
- events produced;
- events consumed;
- data ownership;
- dependencies;
- transaction boundaries;
- security considerations;
- asynchronous processing;
- future service extraction considerations.

## 5. Non-Goals

This document does not define:

- detailed PostgreSQL table schemas;
- cloud-provider infrastructure;
- frontend implementation;
- desktop Tauri IPC;
- robot firmware;
- physical safety implementation;
- detailed payment-provider SDK integration;
- detailed WebRTC media architecture.

Those concerns are defined by their respective architecture documents.

## 6. Goals

The service architecture must:

1. establish explicit business ownership;
2. prevent uncontrolled cross-module dependencies;
3. define authoritative data ownership;
4. define service interfaces;
5. define event contracts;
6. support synchronous and asynchronous operations;
7. support organization-based tenancy;
8. protect financial and booking state;
9. support remote execution;
10. support future service extraction.

## 7. Non-Functional Goals

| Concern | Requirement |
|---|---|
| Correctness | Domain owner is authoritative |
| Isolation | Tenant boundaries enforced |
| Reliability | Durable state and reconciliation |
| Security | Least privilege |
| Observability | Logs, metrics, traces |
| Evolution | Versioned contracts |
| Scalability | Independent worker/service scaling |
| Testability | Module and contract isolation |
| Operations | Explicit ownership and runbooks |

## 8. Definitions

| Term | Definition |
|---|---|
| Service | Logical bounded business capability |
| Module | Service implementation inside the modular monolith |
| Service Interface | Supported API between business capabilities |
| Command | Request to perform an operation |
| Query | Request for authoritative state |
| Event | Notification that state changed |
| Data Owner | Service authoritative for a data entity |
| Consumer | Service that uses another service's contract |
| Producer | Service that emits a contract event |
| Tenant | Organization-scoped security boundary |
| Resource | Robot or execution capacity |
| Job | Requested execution operation |
| Run | Actual execution instance |
| Artifact | Signed `.krv` execution package |

## 9. Logical Service Inventory

| Service | Primary Responsibility |
|---|---|
| Identity | User identity and authentication context |
| Organization | Organizations, memberships, roles |
| Project | User project/workspace |
| Platform | Robot platform definitions and compatibility |
| Artifact | `.krv` artifact lifecycle and validation |
| Booking | Resource/time reservation |
| Credit | Platform-specific usage credits |
| Billing | Monetary transactions, invoices and payment state |
| Job | Execution request lifecycle |
| Run | Actual execution lifecycle |
| Result | Execution results and files |
| Lab | Labs, agents and resources |
| Audit | Immutable operational/security history |
| Notification | User/system notifications |

## 10. Deployment Model

Initially:

    REST / WebSocket
            |
            v
    +----------------------+
    | Control Plane        |
    |                      |
    | Service Modules       |
    | Shared Infrastructure |
    +----------------------+
            |
            +--> PostgreSQL
            +--> Queue
            +--> Object Storage
            +--> External Providers
            +--> Lab Agents

The services are logically isolated but share one application deployment and
one authoritative PostgreSQL database during the modular-monolith phase.

## 11. Service Boundary Rules

Each service must:

- own its business rules;
- own its data;
- expose explicit interfaces;
- avoid direct access to another service's repositories;
- use stable identifiers across boundaries;
- publish domain events for important state changes;
- avoid leaking infrastructure types.

## 12. Dependency Direction

Preferred:

    API
      |
      v
    Application Service
      |
      v
    Domain Service
      |
      v
    Service Interface
      |
      v
    Repository / Adapter

A service must not bypass its application/domain boundary to directly modify
another service's state.

## 13. Data Ownership Principle

One service is authoritative for each business entity.

    Identity       --> User identity
    Organization   --> Organization/membership
    Project        --> Project
    Platform       --> Platform definition
    Artifact       --> Artifact metadata
    Booking        --> Booking
    Credit         --> Credit ledger
    Billing        --> Monetary billing
    Job            --> Job
    Run            --> Run
    Result         --> Result metadata
    Lab            --> Lab/resource state
    Audit          --> Audit records
    Notification   --> Notification state

Other services reference these entities by stable IDs.

## 14. Common Interface Model

Every service interface should distinguish:

- commands;
- queries;
- events.

Conceptually:

    Command
       |
       v
    Service
       |
       +--> Domain Change
       |
       v
    Response

and:

    Domain Change
         |
         v
       Event
         |
         +--> Consumer A
         +--> Consumer B
         +--> Consumer C

## 15. Common Service Contract

Commands should carry:

- request ID;
- actor;
- organization context;
- correlation;
- idempotency key where required;
- payload.

Responses should carry:

- request ID;
- status;
- stable code;
- data;
- error.

Events should carry:

- event ID;
- event name;
- resource;
- organization context;
- sequence where applicable;
- correlation;
- event data.

## 16. Identity Service

### Responsibility

Identity owns:

- user identity;
- authentication provider integration;
- identity claims;
- user lifecycle;
- authenticated session context.

Identity does not own organization membership policy.

## 17. Identity Public Interfaces

Representative commands:

    auth.login
    auth.logout
    auth.refresh
    auth.me
    user.update

Representative queries:

    user.get
    user.get_by_identity

The actual external API may delegate authentication to an identity provider.

## 18. Identity Events

Produced:

    user.created
    user.updated
    user.disabled
    user.enabled
    session.created
    session.revoked

Consumed:

    organization.member.removed
    audit.record.requested

Identity events must not expose secrets or authentication credentials.

## 19. Identity Data Ownership

Identity owns:

- user ID;
- identity-provider reference;
- user status;
- profile attributes where applicable;
- authentication metadata.

It does not own:

- organization membership;
- credit wallet;
- project ownership;
- booking ownership.

## 20. Identity Dependencies

Identity depends on:

- external identity provider where used;
- Audit for security-sensitive actions;
- Organization for authorization context at application boundaries.

Identity should remain independently extractable because authentication is a
natural security boundary.

## 21. Organization Service

### Responsibility

Organization owns:

- organizations;
- memberships;
- roles;
- membership lifecycle;
- organization-level policies.

## 22. Organization Public Interfaces

Commands:

    organization.create
    organization.update
    organization.members.add
    organization.members.remove
    organization.members.update_role

Queries:

    organization.get
    organization.members.list
    organization.members.get

## 23. Organization Events

Produced:

    organization.created
    organization.updated
    organization.member.added
    organization.member.removed
    organization.member.role_changed

Consumed:

    user.created
    user.disabled

Membership changes may trigger authorization cache invalidation and notifications.

## 24. Organization Data Ownership

Organization owns:

- organization;
- membership;
- role;
- organization settings;
- organization status.

Other services reference `organization_id`.

## 25. Organization Dependencies

Organization depends on:

- Identity for user identity;
- Audit for administrative changes;
- Notification for membership notifications.

It must not depend on Booking, Credit, or Job business state.

## 26. Project Service

### Responsibility

Project owns the developer workspace abstraction.

It owns:

- projects;
- project metadata;
- project lifecycle;
- project ownership;
- project-to-organization relationship.

## 27. Project Public Interfaces

Commands:

    project.create
    project.update
    project.archive
    project.delete

Queries:

    project.get
    project.list

## 28. Project Events

Produced:

    project.created
    project.updated
    project.archived
    project.deleted

Consumed:

    organization.member.removed
    organization.deleted

Deletion should normally be conservative and preferably archival.

## 29. Project Data Ownership

Project owns:

- project ID;
- organization ID;
- name;
- description;
- status;
- metadata;
- lifecycle timestamps.

Project does not own source code because source remains local to Studio by
design.

## 30. Project Dependencies

Project depends on:

- Organization for tenant authorization;
- Identity for actor context;
- Audit for lifecycle actions.

Artifacts reference projects but are owned by Artifact Service.

## 31. Platform Service

### Responsibility

Platform defines what robotic platform can be executed.

It owns:

- platform identity;
- versions;
- architectures;
- capabilities;
- runtime compatibility;
- platform-level availability policy;
- platform metadata.

## 32. Platform Public Interfaces

Queries:

    platform.list
    platform.get
    platform.capabilities
    platform.compatibility

Administrative commands:

    platform.create
    platform.update
    platform.version.create
    platform.capability.update

## 33. Platform Events

Produced:

    platform.created
    platform.updated
    platform.version.created
    platform.capabilities.updated
    platform.availability.changed

Consumed:

    lab.resource.registered
    lab.resource.capabilities.updated

Platform compatibility is authoritative for artifact and resource matching.

## 34. Platform Data Ownership

Platform owns:

- platform;
- platform version;
- architecture;
- capability definitions;
- supported runtime versions;
- supported SDK versions.

It does not own physical resource health.

## 35. Platform Dependencies

Platform is primarily a reference-data service.

It is consumed by:

- Artifact;
- Booking;
- Credit;
- Job;
- Lab;
- Project;
- Studio/Web Console API.

## 36. Artifact Service

### Responsibility

Artifact manages `.krv` execution packages.

It owns:

- artifact identity;
- project association;
- digest;
- signature metadata;
- compatibility metadata;
- validation state;
- lifecycle;
- revocation.

## 37. Artifact Public Interfaces

Commands:

    artifact.create
    artifact.upload
    artifact.validate
    artifact.delete
    artifact.revoke

Queries:

    artifact.get
    artifact.list
    artifact.download

## 38. Artifact Events

Produced:

    artifact.created
    artifact.uploaded
    artifact.validating
    artifact.accepted
    artifact.rejected
    artifact.revoked
    artifact.expired

Consumed:

    platform.updated
    platform.version.created

Platform changes may trigger re-evaluation of compatibility but must not silently
invalidate already accepted immutable artifacts unless policy requires it.

## 39. Artifact Data Ownership

Artifact owns:

- artifact metadata;
- digest;
- signature;
- validation result;
- compatibility declaration;
- object-storage reference;
- lifecycle status.

Binary contents are physically stored in object storage.

## 40. Artifact Dependencies

Artifact depends on:

- Project;
- Platform;
- Object Storage;
- validation worker;
- Audit.

Artifact does not accept source-code archives as the normal execution boundary.

## 41. Booking Service

### Responsibility

Booking owns:

- availability;
- booking windows;
- reservations;
- booking lifecycle;
- cancellation;
- modification;
- quote inputs.

## 42. Booking Public Interfaces

Queries:

    availability.query
    booking.get
    booking.list
    booking.quote

Commands:

    booking.create
    booking.modify
    booking.cancel

## 43. Booking Events

Produced:

    booking.created
    booking.confirmed
    booking.modified
    booking.cancelled
    booking.started
    booking.completed
    booking.expired

Consumed:

    platform.availability.changed
    resource.available
    resource.maintenance
    resource.fault
    credit.refund.completed

## 44. Booking Data Ownership

Booking owns:

- booking;
- start/end time;
- organization;
- user;
- platform;
- resource reservation;
- booking status;
- cancellation state.

It does not own credit balances.

## 45. Booking Dependencies

Booking depends on:

- Organization;
- Platform;
- Lab/Resource;
- Credit for affordability/consumption policy;
- Audit;
- Notification.

Booking creation must be concurrency-safe.

## 46. Credit Service

### Responsibility

Credit owns platform-specific usage credits.

It manages:

- credit plans;
- credit wallets;
- credit balances;
- immutable transactions;
- consumption;
- refunds;
- credit quotes.

## 47. Credit Public Interfaces

Queries:

    credit.balance
    credit.quote
    credit.transaction.list

Commands:

    credit.consume
    credit.refund
    credit.plan.create
    credit.plan.update

## 48. Credit Events

Produced:

    credit.wallet.created
    credit.balance_changed
    credit.consumed
    credit.refunded
    credit.plan.updated

Consumed:

    booking.created
    booking.cancelled
    job.created
    job.completed
    billing.payment.completed
    billing.refund.completed

Credit consumption must be idempotent.

## 49. Credit Data Ownership

Credit owns:

- credit plan;
- platform association;
- wallet;
- transaction ledger;
- consumption record;
- refund record.

Credit balance must not be independently calculated by frontend or Job.

## 50. Credit Dependencies

Credit depends on:

- Organization;
- Platform;
- Billing for purchased credit funding where applicable;
- Booking/Job for consumption triggers;
- Audit.

Credit is a financial-control boundary even though monetary payment is owned by
Billing.

## 51. Billing Service

### Responsibility

Billing owns monetary financial state.

It manages:

- payment intents;
- payment transactions;
- invoices;
- refunds;
- payment provider references;
- billing status;
- commercial transaction history.

Credit remains the authority for usage credits.

## 52. Billing Public Interfaces

Commands:

    billing.payment.create
    billing.payment.confirm
    billing.refund.create
    billing.invoice.create

Queries:

    billing.payment.get
    billing.payment.list
    billing.invoice.get
    billing.invoice.list
    billing.refund.get

## 53. Billing Events

Produced:

    billing.payment.created
    billing.payment.pending
    billing.payment.completed
    billing.payment.failed
    billing.refund.created
    billing.refund.completed
    billing.refund.failed
    billing.invoice.created
    billing.invoice.paid

Consumed:

    credit.wallet.created
    credit.plan.updated
    booking.cancelled
    organization.created

Successful monetary payment may trigger credit allocation through an explicit
Credit command or durable event.

## 54. Billing Data Ownership

Billing owns:

- payment;
- invoice;
- refund;
- provider transaction reference;
- billing status;
- monetary amount;
- currency;
- billing metadata.

Billing does not own credit balances.

## 55. Billing Dependencies

Billing depends on:

- Organization;
- external payment provider;
- Audit;
- Notification.

Billing must not directly mutate Credit persistence.

## 56. Job Service

### Responsibility

Job represents a user's request to execute an artifact on a booked resource.

It owns:

- job identity;
- job lifecycle;
- artifact reference;
- booking reference;
- resource allocation reference;
- execution request;
- cancellation;
- timeout state.

## 57. Job Public Interfaces

Commands:

    job.create
    job.start
    job.stop
    job.cancel

Queries:

    job.get
    job.list
    job.status
    job.logs

## 58. Job Events

Produced:

    job.created
    job.queued
    job.validating
    job.allocating
    job.deploying
    job.starting
    job.running
    job.stopping
    job.completed
    job.failed
    job.cancelled
    job.timeout

Consumed:

    artifact.accepted
    booking.confirmed
    booking.started
    booking.cancelled
    resource.available
    resource.fault
    run.created
    run.running
    run.completed
    run.failed
    lab.agent.offline

## 59. Job Data Ownership

Job owns:

- job;
- requested execution;
- lifecycle state;
- references to artifact, booking, platform and resource;
- failure state;
- cancellation state.

Job does not own actual runtime telemetry history.

## 60. Job Dependencies

Job depends on:

- Project;
- Artifact;
- Platform;
- Booking;
- Credit;
- Lab;
- Run;
- Audit;
- Notification.

Execution dispatch should normally be asynchronous.

## 61. Run Service

### Responsibility

Run represents actual runtime execution.

It owns:

- run identity;
- runtime state;
- start/stop timestamps;
- execution status;
- runtime failure state;
- metrics references;
- reconciliation state.

## 62. Run Public Interfaces

Commands:

    run.start
    run.stop
    run.reconcile

Queries:

    run.get
    run.list
    run.status
    run.metrics
    run.telemetry
    run.logs

## 63. Run Events

Produced:

    run.created
    run.starting
    run.running
    run.telemetry
    run.metrics.updated
    run.logs.available
    run.stopping
    run.completed
    run.failed
    run.cancelled
    run.reconciliation_required

Consumed:

    job.created
    job.starting
    lab.job.started
    lab.job.stopped
    lab.runtime.telemetry
    lab.runtime.log
    lab.resource.fault

## 64. Run Data Ownership

Run owns:

- execution instance;
- lifecycle;
- runtime timestamps;
- status;
- runtime metadata;
- references to telemetry/log/result data.

High-rate telemetry should not necessarily reside in the transactional database.

## 65. Run Dependencies

Run depends on:

- Job;
- Lab;
- Resource;
- Artifact;
- Result;
- Audit;
- telemetry infrastructure.

Run is the primary bridge between Job intent and runtime execution state.

## 66. Result Service

### Responsibility

Result owns execution output metadata and result availability.

It manages:

- result records;
- result files;
- processing state;
- summaries;
- metrics references;
- download authorization.

## 67. Result Public Interfaces

Queries:

    result.get
    result.list
    result.files
    result.download
    result.summary
    result.metrics

Commands:

    result.create
    result.process
    result.finalize

## 68. Result Events

Produced:

    result.created
    result.processing
    result.available
    result.failed

Consumed:

    run.completed
    run.failed
    lab.result.available

## 69. Result Data Ownership

Result owns:

- result metadata;
- processing status;
- object-storage references;
- result file metadata;
- summary metadata.

Large files remain in object storage.

## 70. Result Dependencies

Result depends on:

- Run;
- Job;
- Project;
- Object Storage;
- Lab;
- Audit;
- Notification.

## 71. Lab Service

### Responsibility

Lab represents the cloud-side control boundary for physical execution.

It manages:

- labs;
- Lab Agents;
- agent identity;
- heartbeat;
- capabilities;
- resources;
- resource health;
- resource allocation;
- deployment communication.

## 72. Lab Public Interfaces

Commands:

    agent.register
    agent.configure
    resource.lock
    resource.release
    deployment.prepare
    deployment.start
    deployment.stop
    lab.job.start
    lab.job.stop
    lab.job.cancel

Queries:

    agent.status
    agent.capabilities
    agent.resources
    resource.get
    resource.list

## 73. Lab Events

Produced:

    agent.registered
    agent.online
    agent.offline
    agent.health_changed
    agent.capabilities.updated
    resource.registered
    resource.available
    resource.reserved
    resource.busy
    resource.released
    resource.maintenance
    resource.fault

Consumed:

    platform.updated
    job.allocating
    job.deploying
    job.starting
    job.stopping
    artifact.accepted
    booking.confirmed

## 74. Lab Data Ownership

Lab owns:

- lab;
- Lab Agent;
- agent health;
- agent capabilities;
- resource;
- resource health;
- resource allocation;
- connectivity state.

It does not own platform definitions.

## 75. Lab Dependencies

Lab depends on:

- Platform;
- Artifact;
- Job;
- Run;
- Booking;
- secure Lab Protocol;
- Audit;
- Notification.

Physical safety mechanisms remain local to the lab/robot.

## 76. Audit Service

### Responsibility

Audit provides authoritative historical records for security-sensitive,
administrative and important business actions.

## 77. Audit Public Interfaces

Commands:

    audit.record

Queries:

    audit.get
    audit.list
    audit.search

Audit records should normally be append-only.

## 78. Audit Events

Produced:

    audit.recorded

Consumed:

    user.*
    organization.*
    project.*
    artifact.*
    booking.*
    credit.*
    billing.*
    job.*
    run.*
    result.*
    lab.*
    notification.*

Not every event must be duplicated as an audit record. Audit policy determines
which events require durable audit history.

## 79. Audit Data Ownership

Audit owns:

- audit event;
- actor;
- organization;
- action;
- resource;
- timestamp;
- outcome;
- correlation identifiers.

Audit data should not be used as transactional business state.

## 80. Audit Dependencies

Audit should have minimal dependencies.

It should accept structured records from other services without requiring
their internal repositories.

This minimizes circular dependencies.

## 81. Notification Service

### Responsibility

Notification manages user-facing and operational notifications.

It supports:

- in-app notifications;
- email;
- future channels such as SMS or push where justified;
- notification preferences;
- delivery status;
- notification templates.

## 82. Notification Public Interfaces

Commands:

    notification.create
    notification.send
    notification.mark_read
    notification.preference.update

Queries:

    notification.list
    notification.get
    notification.preferences.get

## 83. Notification Events

Produced:

    notification.created
    notification.sent
    notification.failed
    notification.read

Consumed:

    organization.member.added
    booking.confirmed
    booking.cancelled
    credit.balance_changed
    billing.payment.completed
    billing.payment.failed
    job.completed
    job.failed
    job.cancelled
    run.completed
    result.available
    lab.agent.offline
    resource.maintenance

Notification processing should be asynchronous.

## 84. Notification Data Ownership

Notification owns:

- notification;
- recipient;
- channel;
- delivery state;
- template reference;
- preference;
- read state.

Notification does not own the business event that caused the notification.

## 85. Notification Dependencies

Notification depends on:

- Identity;
- Organization;
- event infrastructure;
- external email/provider infrastructure;
- Audit where delivery actions require audit.

## 86. Service Dependency Matrix

| Service | Primary Dependencies |
|---|---|
| Identity | Identity Provider, Audit |
| Organization | Identity, Audit, Notification |
| Project | Organization, Identity, Audit |
| Platform | Audit, Lab references |
| Artifact | Project, Platform, Storage, Audit |
| Booking | Organization, Platform, Lab, Credit, Audit |
| Credit | Organization, Platform, Billing, Audit |
| Billing | Organization, Payment Provider, Audit |
| Job | Project, Artifact, Platform, Booking, Credit, Lab, Run |
| Run | Job, Lab, Result, Audit |
| Result | Run, Project, Lab, Storage, Audit |
| Lab | Platform, Artifact, Job, Run, Booking, Audit |
| Audit | Minimal dependencies |
| Notification | Identity, Organization, Event Infrastructure |

## 87. Dependency Graph

The preferred logical graph is:

    Identity
       |
       v
    Organization
       |
       +--> Project
       |
       +--> Billing
       |
       +--> Credit
       |
       +--> Booking
       |
       +--> Platform
               |
               v
            Artifact
               |
               v
              Job
             /   \
            v     v
          Lab     Run
                   |
                   v
                 Result

    All critical services
             |
             v
           Audit

    Domain Events
             |
             v
        Notification

The actual implementation must avoid circular synchronous dependencies.

## 88. Circular Dependency Rule

A dependency cycle such as:

    Booking -> Credit -> Booking

must not be implemented as direct synchronous calls.

Use:

- explicit orchestration;
- domain/application workflow;
- command/event choreography;
- transactional records.

## 89. Orchestration

Complex workflows should have an explicit application-level orchestrator.

Example booking workflow:

    Booking Request
          |
          v
    Validate Organization
          |
          v
    Validate Platform
          |
          v
    Check Resource
          |
          v
    Quote Credits
          |
          v
    Reserve Booking
          |
          v
    Confirm Credit Policy
          |
          v
    Emit Booking Event

The exact transaction strategy depends on the final commercial model.

## 90. Job Orchestration

Execution flow:

    Job Create
       |
       v
    Validate Artifact
       |
       v
    Validate Booking
       |
       v
    Validate Credits
       |
       v
    Allocate Resource
       |
       v
    Dispatch Lab Agent
       |
       v
    Create Run
       |
       v
    Start Execution
       |
       v
    RUNNING
       |
       v
    Complete
       |
       v
    Consume / Reconcile Credits
       |
       v
    Process Result

The workflow must explicitly handle partial failures.

## 91. Event Catalogue

Core service events include:

    user.created
    user.updated
    organization.created
    organization.updated
    organization.member.added
    organization.member.removed
    project.created
    project.updated
    platform.created
    platform.updated
    platform.capabilities.updated
    artifact.created
    artifact.uploaded
    artifact.accepted
    artifact.rejected
    booking.created
    booking.confirmed
    booking.cancelled
    credit.consumed
    credit.refunded
    billing.payment.completed
    billing.payment.failed
    job.created
    job.running
    job.completed
    job.failed
    run.created
    run.running
    run.completed
    run.failed
    result.available
    agent.online
    agent.offline
    resource.available
    resource.busy
    resource.fault
    notification.created
    audit.recorded

## 92. Event Ownership

The service that changes authoritative state produces the corresponding event.

Examples:

| State | Producer |
|---|---|
| User | Identity |
| Organization | Organization |
| Project | Project |
| Platform | Platform |
| Artifact | Artifact |
| Booking | Booking |
| Credit | Credit |
| Payment | Billing |
| Job | Job |
| Run | Run |
| Result | Result |
| Resource | Lab |
| Notification | Notification |
| Audit Record | Audit |

## 93. Event Consumption Rule

Consumers must treat events as notifications, not direct database commands.

An event should cause the consumer to:

- update its own state;
- enqueue work;
- invalidate cache;
- create a notification;
- record audit;
- reconcile state.

## 94. Event Reliability

Business-critical event publication should use:

- transactional outbox where required;
- durable queue;
- event IDs;
- retry;
- dead-letter handling;
- idempotent consumers.

## 95. Event Ordering

Global ordering is not required.

Ordering should be maintained at the resource scope where state transitions
require it.

Consumers must use:

- event ID;
- sequence;
- resource version/state;
- authoritative query.

## 96. Command vs Event

Commands mean:

    "Please perform this operation."

Events mean:

    "This operation/state change occurred."

Never treat a client event as equivalent to an authorized command.

## 97. Synchronous Interface Rules

Use synchronous service calls for:

- validation;
- authoritative queries;
- short deterministic operations;
- transactional decisions.

Use asynchronous processing for:

- long-running jobs;
- external deployment;
- result processing;
- notification delivery;
- large artifact validation.

## 98. Service-Level Transactions

A transaction should normally be owned by one service.

Cross-service transactions are avoided.

If multiple services need state changes:

    Service A Transaction
          |
          v
       Event
          |
          v
    Service B Transaction

Reconciliation handles failures between stages.

## 99. Financial Workflow

Billing and Credit are separate boundaries.

    User
      |
      v
    Billing
      |
      v
    Payment Provider
      |
      v
    billing.payment.completed
      |
      v
    Credit
      |
      v
    Wallet / Ledger

Billing owns money.

Credit owns usage entitlement.

## 100. Booking and Credit Workflow

The system must prevent:

- confirmed booking without required entitlement;
- duplicate credit consumption;
- negative balance;
- duplicate refunds.

Idempotency keys and explicit transaction states are mandatory.

## 101. Job and Credit Workflow

Credit consumption policy must be explicit.

Possible model:

    Job Starts
       |
       v
    Reserve / Authorize Credits
       |
       v
    Execute
       |
       v
    Consume Actual Usage
       |
       v
    Refund Unused Reservation

The exact reservation/consumption model is a commercial decision, but it must
be owned by Credit rather than Job.

## 102. Lab and Job Workflow

Job owns execution intent.

Lab owns physical resource state.

    Job
      |
      v
    Allocation Request
      |
      v
    Lab
      |
      v
    Resource
      |
      v
    Agent
      |
      v
    Runtime

This prevents Job from directly owning hardware state.

## 103. Run and Result Workflow

    Run
      |
      +--> telemetry
      +--> logs
      +--> metrics
      |
      v
    completed
      |
      v
    Result
      |
      v
    processing
      |
      v
    available

Result availability must not be inferred solely from Run completion.

## 104. Notification Workflow

    Domain Event
        |
        v
    Notification Consumer
        |
        v
    Notification Record
        |
        v
    Delivery Worker
        |
        +--> Email
        +--> In-App
        +--> Future Channel
        |
        v
    Delivery Status

Notification failures must not roll back core business transactions.

## 105. Audit Workflow

    Business Operation
          |
          v
    State Change
          |
          v
    Audit Event
          |
          v
    Audit Store

For critical operations, audit publication should be durable and recoverable.

## 106. Service Security

Every service boundary must preserve:

- actor identity;
- organization context;
- authorization result;
- correlation ID;
- request ID.

Internal service calls must not assume that internal network location implies
authorization.

## 107. Service-to-Service Authorization

Future independently deployed services should use:

- workload identity;
- mTLS where applicable;
- signed service credentials;
- scoped permissions.

Do not reuse user access tokens as unrestricted service credentials.

## 108. Tenant Context

Every service handling tenant data must receive a trusted organization context.

The context must originate from authenticated identity and server-side membership
resolution.

## 109. Observability

Each service should emit:

- request metrics;
- operation metrics;
- latency;
- error count;
- state transition metrics;
- queue metrics where applicable;
- dependency failures.

Logs should include:

    service
    version
    request_id
    trace_id
    operation_id
    organization_id
    resource_id
    error_code

Sensitive values must be redacted.

## 110. Service Configuration

Each service should define:

- required configuration;
- optional configuration;
- secret dependencies;
- timeout;
- retry policy;
- concurrency;
- feature flags.

Configuration must be validated at startup.

## 111. Testing Strategy

Every service/module must have:

- domain unit tests;
- application tests;
- repository integration tests;
- contract tests;
- event tests;
- authorization tests;
- tenant-isolation tests where applicable.

Critical workflows additionally require end-to-end tests.

## 112. Contract Testing

Service interfaces must be tested against:

- REST contracts;
- command contracts;
- response contracts;
- event schemas;
- error codes.

Future service extraction requires contract tests to exist before extraction.

## 113. Mock Boundaries

Local and CI environments should provide mocks for:

- payment provider;
- identity provider;
- object storage;
- queue;
- Lab Agent;
- notification provider.

Mocks must conform to the same contracts as production adapters.

## 114. Service Evolution

The initial state is:

    One Deployable
        |
        +--> Identity Module
        +--> Organization Module
        +--> Project Module
        +--> Platform Module
        +--> Artifact Module
        +--> Booking Module
        +--> Credit Module
        +--> Billing Module
        +--> Job Module
        +--> Run Module
        +--> Result Module
        +--> Lab Module
        +--> Audit Module
        +--> Notification Module

Evolution may become:

    API Gateway
        |
        +--> Identity Service
        +--> Core Business Service
        +--> Execution Service
        +--> Billing/Credit Service
        +--> Lab Gateway
        +--> Notification Service

Only proven operational needs justify this transition.

## 115. Service Extraction Criteria

A module may be considered for extraction when:

- independent scaling is required;
- deployment cadence differs materially;
- fault isolation is important;
- ownership is clear;
- service contract is stable;
- data ownership is explicit;
- observability is mature;
- operational cost is justified.

## 116. Extraction Sequence

Preferred:

    Module Boundary
         |
         v
    Stable Contract
         |
         v
    Contract Tests
         |
         v
    Separate Deployment
         |
         v
    Separate Data Ownership
         |
         v
    Independent Service

Avoid extracting a module while it still depends on internal implementation
details of the monolith.

## 117. Candidate Extraction Priority

| Candidate | Reason |
|---|---|
| Lab | Physical execution boundary |
| Notification | Independent async workload |
| Billing | External payment/security boundary |
| Identity | Security boundary |
| Result | Potentially compute/storage intensive |
| Execution | Potentially high-scale workload |
| Artifact | Large-data processing |
| Booking | Potential concurrency hotspot |

This is an architectural candidate list, not a mandatory roadmap.

## 118. Phase Mapping

| Phase | Service Architecture Focus |
|---|---|
| Phase 0 | Service/module foundation |
| Phase 1 | Identity, Organization, Project |
| Phase 2 | Platform, Artifact |
| Phase 3 | Service contracts and integration |
| Phase 4 | Booking, Credit, Billing |
| Phase 5 | Job, Run |
| Phase 6 | Lab |
| Phase 7 | Result, Notification |
| Phase 8 | Hardening and service extraction readiness |

## 119. Phase 0

Establish:

- module conventions;
- dependency rules;
- common envelopes;
- error model;
- repository interfaces;
- configuration;
- logging;
- tracing;
- testing framework.

No premature independent services are required.

## 120. Phase 1

Implement:

- Identity;
- Organization;
- Project.

Primary validation:

- authentication;
- tenant isolation;
- membership;
- roles;
- project ownership.

## 121. Phase 2

Implement:

- Platform;
- Artifact.

Primary validation:

- compatibility;
- digest;
- signature;
- object storage;
- artifact lifecycle.

## 122. Phase 3

Integrate:

- REST API;
- WebSocket;
- event contracts;
- asynchronous operation model;
- idempotency;
- service-level interfaces.

The Control Plane becomes the authoritative integration layer for Studio and
Web Console.

## 123. Phase 4

Implement:

- Booking;
- Credit;
- Billing.

Production blockers include:

- booking race correctness;
- credit ledger integrity;
- payment reconciliation;
- idempotency;
- refunds.

## 124. Phase 5

Implement:

- Job;
- Run;
- queue;
- workers;
- scheduler;
- execution orchestration.

Validate full execution state transitions.

## 125. Phase 6

Implement:

- Lab;
- Lab Agent;
- resources;
- deployment;
- runtime communication;
- reconciliation.

Physical safety remains a separate human-reviewed gate.

## 126. Phase 7

Implement:

- Result;
- Notification;
- telemetry;
- live execution integration;
- result processing.

The user should be able to complete:

    Book
      |
      v
    Execute
      |
      v
    Observe
      |
      v
    Analyze
      |
      v
    Rerun

## 127. Phase 8

Complete:

- security hardening;
- operational SLOs;
- backup/recovery;
- performance;
- service boundary validation;
- extraction readiness;
- production runbooks.

## 128. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Modules become tightly coupled | Explicit dependency rules |
| Circular dependencies | Event/orchestrator patterns |
| Shared database bypass | Repository ownership |
| Premature microservices | Extraction criteria |
| Financial inconsistency | Credit/Billing ownership separation |
| Booking races | Transactional constraints |
| Duplicate jobs | Idempotency |
| Lost events | Outbox/durable queue |
| Tenant leakage | Server-side authorization |
| Lab uncertainty | Reconciliation |
| Notification failure blocks business | Async notification |
| Service extraction breaks behavior | Contract tests |
| Event schema drift | Versioned contracts |
| Excessive synchronous calls | Async workflows |
| Audit gaps | Critical-event policy |
| External provider outage | Adapter + retry + reconciliation |
| Operational complexity | Modular monolith first |

## 129. Open Questions

1. Which backend language/framework will implement the service modules?
2. Will all logical services remain in one source tree?
3. What exact internal service-interface mechanism will be used?
4. Will the outbox pattern be mandatory for all business events?
5. Which queue technology will be selected?
6. Which payment provider will Billing use?
7. Will Credit support prepaid, subscription, or both models initially?
8. What exact credit reservation model will Job execution use?
9. Will Billing and Credit eventually become one independently deployed service?
10. What exact Lab Protocol transport will be used?
11. Will Lab become the first independently deployed service?
12. What telemetry storage will Run use?
13. What result-processing workload will justify independent scaling?
14. What notification providers will be supported?
15. What audit retention policy will apply?
16. What exact service-to-service authentication model will be adopted?
17. Will tenant-aware database RLS be used?
18. What API compatibility window will be supported?
19. What event retention/replay period will be required?
20. What operational thresholds will trigger service extraction?

## 130. Full Acceptance Criteria

### Architecture

- [ ] Logical services are explicitly defined.
- [ ] Initial implementation is a modular monolith.
- [ ] Service boundaries are documented.
- [ ] Each service has one primary ownership domain.
- [ ] Cross-service dependencies are explicit.
- [ ] Circular dependencies are prohibited.
- [ ] Future extraction is supported by stable contracts.

### Identity

- [ ] Identity owns user identity.
- [ ] Authentication context is authoritative.
- [ ] Authentication secrets are never exposed.
- [ ] Identity events are defined.
- [ ] Identity security actions are auditable.

### Organization

- [ ] Organization owns organizations.
- [ ] Organization owns memberships.
- [ ] Organization owns roles.
- [ ] Tenant context is resolved server-side.
- [ ] Membership events are emitted.

### Project

- [ ] Project owns project metadata.
- [ ] Project ownership is organization-scoped.
- [ ] Project lifecycle is defined.
- [ ] Project does not require remote source storage.
- [ ] Project events are defined.

### Platform

- [ ] Platform owns platform definitions.
- [ ] Platform versions are represented.
- [ ] Capabilities are represented.
- [ ] Architecture compatibility is represented.
- [ ] Runtime compatibility is represented.
- [ ] Platform events are defined.

### Artifact

- [ ] Artifact owns artifact metadata.
- [ ] Artifact digest is authoritative.
- [ ] Signature status is represented.
- [ ] Compatibility validation is represented.
- [ ] Artifact binaries use object storage.
- [ ] Artifact lifecycle is defined.
- [ ] Artifact revocation is supported.

### Booking

- [ ] Booking owns booking state.
- [ ] Availability is represented.
- [ ] Booking creation is idempotent.
- [ ] Booking conflicts are concurrency-safe.
- [ ] Booking cancellation is defined.
- [ ] Booking events are emitted.
- [ ] Booking does not own credit balances.

### Credit

- [ ] Credit owns credit wallets.
- [ ] Credit owns immutable transactions.
- [ ] Credit is platform-specific.
- [ ] Credit consumption is atomic.
- [ ] Credit consumption is idempotent.
- [ ] Credit refunds are supported.
- [ ] Negative balances are prevented.
- [ ] Credit events are emitted.

### Billing

- [ ] Billing owns monetary transactions.
- [ ] Billing owns invoices.
- [ ] Billing owns refunds.
- [ ] Payment-provider state is reconciled.
- [ ] Billing does not directly mutate Credit state.
- [ ] Billing events are defined.
- [ ] Payment operations are idempotent.

### Job

- [ ] Job owns execution intent.
- [ ] Job lifecycle states are explicit.
- [ ] Job cancellation is supported.
- [ ] Job timeout is supported.
- [ ] Job execution is asynchronous.
- [ ] Job events are emitted.
- [ ] Job does not own physical resource state.

### Run

- [ ] Run represents actual execution.
- [ ] Run state is distinct from Job state.
- [ ] Runtime failures are represented.
- [ ] Run reconciliation is supported.
- [ ] Telemetry and logs are associated with runs.
- [ ] Run events are emitted.

### Result

- [ ] Result owns result metadata.
- [ ] Result processing is asynchronous where required.
- [ ] Result files use object storage.
- [ ] Download authorization is enforced.
- [ ] Result availability is explicit.
- [ ] Result events are emitted.

### Lab

- [ ] Lab owns Lab Agent state.
- [ ] Lab Agent registration is supported.
- [ ] Heartbeat is supported.
- [ ] Resource discovery is supported.
- [ ] Resource health is represented.
- [ ] Resource allocation is controlled.
- [ ] Deployment is asynchronous.
- [ ] Offline reconciliation is supported.
- [ ] Physical E-stop is not delegated to cloud control.

### Audit

- [ ] Audit is append-oriented.
- [ ] Critical actions are auditable.
- [ ] Actor identity is captured.
- [ ] Organization context is captured.
- [ ] Correlation identifiers are captured.
- [ ] Audit data is not used as transactional state.

### Notification

- [ ] Notification records are owned by Notification.
- [ ] Notification delivery is asynchronous.
- [ ] Delivery failures do not roll back business state.
- [ ] User preferences are supported.
- [ ] In-app notification state is supported.
- [ ] Email integration is abstracted.
- [ ] Notification events are defined.

### Cross-Service Contracts

- [ ] Commands are distinguished from events.
- [ ] Service interfaces are versioned.
- [ ] Event schemas are versioned.
- [ ] Request IDs are propagated.
- [ ] Trace IDs are propagated.
- [ ] Organization context is propagated.
- [ ] Idempotency is enforced where required.
- [ ] Stable error codes are used.
- [ ] Infrastructure-specific types do not cross domain boundaries.

### Data Ownership

- [ ] Every business entity has one authoritative owner.
- [ ] Other services reference IDs rather than duplicate authority.
- [ ] Services do not directly modify another service's tables.
- [ ] Large binary data is stored outside PostgreSQL.
- [ ] Financial state has a single authoritative ledger.
- [ ] Resource state has a single authoritative owner.

### Events

- [ ] Important state changes produce events.
- [ ] Events have unique IDs.
- [ ] At-least-once delivery is assumed.
- [ ] Consumers are idempotent.
- [ ] Durable events use appropriate persistence.
- [ ] Replay/reconciliation strategy exists.
- [ ] Event ordering requirements are documented.

### Security

- [ ] Service authorization is server-side.
- [ ] Tenant isolation is enforced.
- [ ] Service credentials are scoped.
- [ ] Secrets are externalized.
- [ ] Sensitive data is excluded from logs.
- [ ] Artifact access is authorized.
- [ ] Billing operations are protected.
- [ ] Administrative operations are audited.

### Async Processing

- [ ] Workers are independently scalable.
- [ ] Queue messages are durable.
- [ ] Retries are bounded.
- [ ] Dead-letter handling exists.
- [ ] Duplicate delivery is safe.
- [ ] Long-running operations expose durable state.
- [ ] External timeout ambiguity is reconciled.

### Testing

- [ ] Each service has domain tests.
- [ ] Each service has application tests.
- [ ] Repository boundaries have integration tests.
- [ ] API contracts are tested.
- [ ] Event contracts are tested.
- [ ] Authorization is tested.
- [ ] Tenant isolation is tested.
- [ ] Idempotency is tested.
- [ ] Critical workflows are tested end-to-end.
- [ ] Mock Lab Agent is available.
- [ ] Mock payment provider is available.

### Evolution

- [ ] Module boundaries are stable.
- [ ] Extraction criteria are documented.
- [ ] Service contracts are independently testable.
- [ ] Shared database coupling is controlled.
- [ ] Candidate extraction boundaries are identified.
- [ ] Service extraction does not require rewriting business rules.
- [ ] Independently deployed services can own their data in the future.

## 131. Final Architectural Invariants

1. The initial backend is a modular monolith.
2. A logical service is a bounded business capability.
3. One service owns each authoritative business entity.
4. Services do not directly modify another service's persistence.
5. API, application, domain and infrastructure responsibilities remain separate.
6. Identity owns user identity.
7. Organization owns memberships and roles.
8. Project owns project metadata.
9. Platform owns robotic platform definitions.
10. Artifact owns `.krv` artifact metadata and validation state.
11. Booking owns reservations.
12. Credit owns usage entitlements and the credit ledger.
13. Billing owns monetary payment state.
14. Job owns execution intent.
15. Run owns actual execution state.
16. Result owns result metadata and availability.
17. Lab owns lab, agent and resource state.
18. Audit owns historical audit records.
19. Notification owns notification state and delivery.
20. Credit and Billing remain separate authorities.
21. Job and Run remain separate concepts.
22. Platform and Lab remain separate authorities.
23. Events communicate state changes rather than replacing commands.
24. Critical side effects are idempotent.
25. Long-running work is asynchronous.
26. WebSocket is realtime synchronization, not authoritative storage.
27. PostgreSQL is authoritative for transactional business state.
28. Object storage owns large binary payloads.
29. Physical safety remains local to the robot/lab.
30. Service extraction is driven by operational need, not architectural fashion.

## 132. Completion Condition

The service architecture is complete when every production workflow can be
mapped to an explicit owner:

    User / Organization
           |
           v
       Project
           |
           v
       Artifact
           |
           v
       Platform
           |
           v
       Booking
           |
           +--> Credit
           +--> Billing
           |
           v
          Job
           |
           v
          Run
           |
           v
          Lab
           |
           v
        Resource
           |
           v
         Result
           |
           v
      Notification

with Audit providing the durable operational history across critical boundaries.

The architecture must allow the same logical service definitions to operate:

    Phase 0-8:
    Modular Monolith
           |
           v
    Production-Hardened Modules
           |
           v
    Selective Service Extraction

without changing the fundamental RaaS contracts:

> Build locally. Book remotely. Run on real robots. Observe, analyze and rerun.

The service architecture is successful when ownership is unambiguous,
dependencies are controlled, failures are recoverable, and any future
independent service can be extracted from a proven module boundary rather than
created through a premature distributed-system redesign.
