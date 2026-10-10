# Kritva RaaS Idempotency Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Idempotency Specification |
| Path | `docs/protocol/IDEMPOTENCY.md` |
| Product | Kritva Robotics-as-a-Service |
| API Base | `/api/v1/` |
| Primary Transport | HTTPS REST |
| Realtime Transport | WebSocket |
| Lab Transport | Secure Lab Protocol |
| Persistence | PostgreSQL |
| Durable Payload Storage | Object Storage |
| Queue | Managed/abstracted job queue |
| Contract Location | `packages/contracts` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production idempotency model for Kritva RaaS.

Idempotency prevents retries of the same logical operation from accidentally
creating multiple resources, consuming credits multiple times, creating
duplicate bookings, starting multiple robot jobs, or performing other duplicate
side effects.

The governing principle is:

> **A client retry of the same logical operation must not create an additional
> side effect when the original operation has already been accepted or
> completed.**

Idempotency is especially important for Kritva RaaS because operations can
cross:

- Studio;
- Control Plane;
- PostgreSQL;
- object storage;
- queue infrastructure;
- Lab Agent;
- robot runtime;
- credit ledger;
- booking resources.

Network failures can occur after a server has committed an operation but before
the client receives the response. The client must therefore be able to retry
without knowing whether the first request succeeded.

## 3. Scope

This specification covers:

- idempotency keys;
- idempotent commands;
- request identity;
- duplicate detection;
- persistence;
- expiry;
- concurrency;
- retry semantics;
- response replay;
- failure handling;
- database transactions;
- queue dispatch;
- artifact upload;
- booking creation;
- job start;
- credit consumption;
- job stop/cancel;
- Lab Agent commands;
- WebSocket commands where applicable;
- client behavior;
- server behavior;
- observability;
- security;
- testing;
- migration.

## 4. Goals

The system shall:

1. prevent duplicate side effects;
2. provide deterministic retry behavior;
3. support safe client retries after network failures;
4. detect concurrent duplicate requests;
5. preserve the original operation result;
6. distinguish duplicate requests from distinct operations;
7. support long-running asynchronous commands;
8. protect financial operations;
9. protect resource allocation;
10. protect physical execution;
11. survive application-instance failover;
12. support horizontal scaling;
13. provide observable idempotency state;
14. avoid unnecessary database contention;
15. provide explicit expiration semantics.

## 5. Non-Goals

This document does not define:

- general distributed transaction design;
- complete payment-provider idempotency rules;
- database schema for every RaaS domain;
- exact queue implementation;
- complete authentication design;
- physical emergency-stop behavior;
- telemetry deduplication for every sample;
- exactly-once distributed execution guarantees.

Important:

> Idempotency does not make a distributed system exactly-once by itself.

It provides a controlled mechanism for making supported operations safe to retry.

# 6. Idempotency Principle

The basic flow is:

    Client
       |
       | request + Idempotency-Key
       v
    Control Plane
       |
       +--> lookup key
       |
       +--> existing result?
       |       |
       |       +--> replay result
       |
       +--> no existing key
               |
               v
          execute operation
               |
               v
          persist result
               |
               v
          return response

The same logical request must map to one idempotency record.

# 7. Why Idempotency Is Required

Consider:

    Studio
       |
       | booking.create
       v
    Control Plane
       |
       v
    PostgreSQL
       |
       | booking committed
       v
    Network failure
       |
       X
    Studio receives no response

Studio cannot know whether the booking exists.

If Studio retries without idempotency:

    retry
       |
       v
    second booking

This can create:

- duplicate bookings;
- double credit reservation;
- conflicting robot allocation.

With idempotency:

    retry
       |
       v
    same key
       |
       v
    original result replayed

# 8. Definition

An idempotency key is a client-generated identifier representing one logical
execution attempt of one side-effecting operation.

Example:

    Idempotency-Key: 01J8RAASBOOKING001

The key does not represent:

- a user;
- a project;
- a booking;
- a job;
- an artifact.

It represents one requested operation.

# 9. Logical Operation Identity

The effective identity is:

    (tenant, actor, command, idempotency_key)

Additional request context must be validated as part of duplicate detection.

Recommended conceptual identity:

    organization_id
    actor_id
    command
    idempotency_key

The exact authorization scope is server-derived.

# 10. Key Ownership

The client generates the idempotency key.

The server:

- validates it;
- stores it;
- associates it with the request;
- detects duplicates;
- returns the original outcome.

The server must never silently generate a replacement key for a request that
requires explicit idempotency.

# 11. Key Format

The baseline recommendation is:

- opaque string;
- 16 to 128 characters;
- cryptographically unpredictable or globally unique;
- URL/header safe;
- no sensitive information.

UUIDv4 or UUIDv7 are acceptable.

Example:

    Idempotency-Key: 0192d4b2-7e31-7a8a-9d2e-5e2c9e9d4b31

# 12. Key Header

For REST:

    Idempotency-Key: <client-generated-key>

The canonical header is:

    Idempotency-Key

Header matching is case-insensitive according to HTTP semantics.

# 13. Request Body Binding

An idempotency key must be bound to the logical request.

Example:

    key = K
    command = booking.create
    request_hash = H(request)

If the same key is later used with:

    command = booking.create
    request_hash = H(request2)

where:

    H(request2) != H(request)

the server must reject the request.

Recommended error:

    IDEMPOTENCY_KEY_REUSED

# 14. Why Request Binding Matters

Without request binding:

    Request A
       key = K
       booking = robot-A

    Request B
       key = K
       booking = robot-B

could accidentally replay Request A's result for Request B.

This would be a serious correctness and authorization problem.

# 15. Request Fingerprint

The server should compute a canonical request fingerprint.

Conceptually:

    request_hash =
        SHA-256(
            canonical(command)
            +
            canonical(parameters)
            +
            effective tenant context
        )

The implementation must use deterministic canonicalization.

# 16. Sensitive Data

Request fingerprints must not expose:

- passwords;
- access tokens;
- secrets;
- private keys;
- unnecessary personal information.

Sensitive values should either be excluded from the fingerprint according to
contract rules or represented through secure canonical placeholders.

# 17. Idempotency Record

The server stores an idempotency record.

Conceptual model:

    IdempotencyRecord
    -----------------
    id
    organization_id
    actor_id
    command
    idempotency_key
    request_hash
    status
    response_status
    response_code
    response_body
    resource_type
    resource_id
    operation_id
    created_at
    updated_at
    expires_at

# 18. Idempotency Record Purpose

The record provides:

- duplicate detection;
- request binding;
- operation state;
- response replay;
- auditability;
- recovery after process failure.

# 19. Storage Authority

Idempotency state must be stored in durable shared infrastructure.

Preferred:

    PostgreSQL

It must not rely only on:

- process memory;
- local filesystem;
- one API instance;
- browser state;
- Redis-only volatile state.

The reason is horizontal scaling and process failure.

# 20. Database Ownership

Idempotency records belong to the Control Plane infrastructure layer but are
used by application services.

The architecture is:

    API
       |
       v
    Idempotency Service
       |
       v
    Idempotency Repository
       |
       v
    PostgreSQL

# 21. Transaction Boundary

For strongly idempotent operations:

    Begin Transaction
       |
       v
    Create/claim idempotency record
       |
       v
    Execute domain operation
       |
       v
    Persist domain result
       |
       v
    Persist final idempotency result
       |
       v
    Commit
       |
       v
    Return response

The operation must not become visible as successfully completed without its
idempotency state being durably recorded.

# 22. Atomicity Requirement

Where possible, the idempotency claim and domain side effect should be
protected by the same database transaction.

This prevents:

    side effect committed
        +
    idempotency record missing

which would make safe retry impossible.

# 23. Claim State

An idempotency record should support an in-progress state.

Example:

    NEW
      |
      v
    PROCESSING
      |
      +--> SUCCEEDED
      |
      +--> FAILED
      |
      +--> EXPIRED

The exact state set may be refined during implementation.

# 24. Concurrent Requests

Two identical requests may arrive simultaneously:

    Client
      |\
      | \
      |  \
      v   v
    API A API B
      |   |
      +---+
        |
        v
    PostgreSQL

Only one request may claim the idempotency key.

# 25. Concurrency Rule

The database must enforce uniqueness:

    UNIQUE(
        organization_id,
        command,
        idempotency_key
    )

The exact tenant/actor scope may be refined according to authorization policy,
but uniqueness must be enforced durably.

# 26. First Request Wins

When two concurrent requests use the same valid key:

    Request A
        |
        +--> claim succeeds

    Request B
        |
        +--> duplicate/in-progress

Request B must not execute the operation independently.

# 27. In-Progress Duplicate

If the original request is still processing, the duplicate request should
receive a deterministic response indicating that the operation is still in
progress.

Possible application status:

    IN_PROGRESS

Possible response:

    {
        "status": "IN_PROGRESS",
        "code": "IDEMPOTENCY_OPERATION_IN_PROGRESS",
        "operation_id": "op-12345"
    }

The final response can subsequently be retrieved through the operation resource
or by retrying the same request.

# 28. Waiting vs Immediate Response

The implementation may either:

1. return immediately with `IN_PROGRESS`; or
2. briefly wait for the owner request.

The server must avoid unbounded waiting.

Recommended:

- short bounded wait;
- otherwise return `IN_PROGRESS`.

# 29. Response Replay

If a request has completed, a retry with the same key should return the original
logical response.

Example:

    Original:
        201 CREATED
        BOOKING_CREATED
        booking_id = B123

    Retry:
        201 CREATED
        BOOKING_CREATED
        booking_id = B123

The retry must not create B124.

# 30. Response Fidelity

The replayed response should preserve:

- application status;
- application code;
- resource identifier;
- operation identifier where applicable;
- relevant response data.

Transport headers may differ where appropriate.

# 31. Response Storage

For replayable operations, the idempotency record should store sufficient
information to reconstruct the original response.

Preferred:

- response status;
- response code;
- response body or canonical response payload;
- resource ID;
- operation ID.

Large payloads should not be stored directly in the idempotency table.

# 32. Large Responses

If a response contains large result data:

    Idempotency Record
        |
        +--> result_id
        +--> resource_id
        +--> operation_id

The client can retrieve the durable resource using normal APIs.

# 33. Failed Operations

Failure handling depends on whether a side effect occurred.

Case A:

    validation failed
        |
        v
    no side effect

The same key may generally be retried after correcting the request only if the
request fingerprint remains identical. Otherwise the key must not be reused.

Case B:

    domain operation failed
        |
        v
    no side effect

The original failure may be replayed.

Case C:

    side effect uncertain

The operation must enter a reconciliation path rather than blindly retrying.

# 34. Unknown Outcome

A network timeout creates:

    Client
       |
       | request
       v
    Server
       |
       v
    operation
       |
       v
    unknown
       |
       X
    response lost

The client must retry with the same key.

The server determines whether:

- operation completed;
- operation is in progress;
- operation failed;
- operation requires reconciliation.

# 35. Never Generate a New Key on Timeout

Incorrect:

    timeout
       |
       v
    new key
       |
       v
    retry

Correct:

    timeout
       |
       v
    same key
       |
       v
    retry

This is one of the most important client-side rules.

# 36. Retry Semantics

For retryable transport failures:

    Same logical operation
            |
            v
    Same Idempotency-Key
            |
            v
    Retry

For a new logical operation:

    New operation
        |
        v
    New Idempotency-Key

# 37. Retryable Transport Failures

Examples:

- connection reset;
- DNS failure;
- TLS connection failure;
- timeout before response;
- HTTP 502;
- HTTP 503;
- HTTP 504.

For side-effecting requests, the client should retry using the same key.

# 38. Application Failure

If the server explicitly returns:

    IDEMPOTENCY_KEY_REUSED

the client must not retry using the same key with a different request.

If the server returns a deterministic domain failure, the client may retry only
according to the command's documented semantics.

# 39. Retry Backoff

Retries should use bounded exponential backoff.

Example:

    attempt 1 -> 250 ms
    attempt 2 -> 500 ms
    attempt 3 -> 1 s
    attempt 4 -> 2 s
    attempt 5 -> 4 s

The exact policy is configurable.

Jitter should be used to avoid synchronized retries.

# 40. Retry Limits

Clients must have bounded retry attempts or bounded retry duration.

Infinite retries are prohibited.

For long-running operations, the client should transition to status polling
rather than repeatedly creating requests.

# 41. Asynchronous Operations

For commands such as:

    job.start

the initial request may return:

    ACCEPTED

with:

    operation_id

The idempotency key protects the creation/acceptance of the operation.

The asynchronous work itself is tracked separately.

# 42. Idempotency and Operation ID

These identifiers have different meanings:

    idempotency_key
        =
    client request identity

    operation_id
        =
    server-side long-running operation identity

A retry with the same key should return the same operation ID.

# 43. Queue Interaction

Correct pattern:

    API
      |
      | claim idempotency key
      v
    DB transaction
      |
      | create job
      |
      | enqueue work
      v
    Queue

Queue messages should carry:

    operation_id
    job_id
    idempotency_key

Workers must remain safe against duplicate queue delivery.

# 44. Queue At-Least-Once Delivery

Queues commonly provide at-least-once delivery.

Therefore:

    Message A
       |
       v
    Worker
       |
       v
    operation
       |
       X
    acknowledgement lost
       |
       v
    Message A redelivered

The worker must not repeat an unsafe side effect.

# 45. Worker Idempotency

Workers must use durable operation/job state.

Example:

    job.start
       |
       v
    Job state = STARTING
       |
       v
    Worker crash
       |
       v
    message redelivered
       |
       v
    Worker checks state
       |
       v
    resume/reconcile

Workers must not assume queue delivery is exactly once.

# 46. Command Classification

Every command must be classified as:

    READ_ONLY
    IDEMPOTENT_BY_RESOURCE
    IDEMPOTENCY_KEY_REQUIRED
    NON_RETRYABLE

Side-effecting operations should generally require explicit idempotency.

# 47. Commands Requiring Idempotency

The following baseline commands require idempotency keys:

| Command | Requirement |
|---|---|
| `organization.create` | Required |
| `organization.members.add` | Required |
| `organization.members.remove` | Required |
| `project.create` | Required |
| `project.update` | Required where non-conditional |
| `project.archive` | Required |
| `project.delete` | Required |
| `build.start` | Required |
| `build.cancel` | Required |
| `artifact.create` | Required |
| `artifact.upload` | Required |
| `artifact.delete` | Required |
| `booking.create` | Required |
| `booking.modify` | Required |
| `booking.cancel` | Required |
| `credit.consumption` | Required |
| `credit.refund` | Required |
| `job.create` | Required |
| `job.start` | Required |
| `job.stop` | Required |
| `job.cancel` | Required |
| `experiment.create` | Required |
| `experiment.update` | Required |
| Lab deployment commands | Required |

# 48. Read-Only Commands

Read-only commands normally do not require idempotency keys:

    project.list
    project.get
    platform.list
    platform.get
    booking.get
    booking.list
    credit.balance
    job.get
    job.list
    run.get
    run.list
    result.get
    result.list

They should still support normal request IDs and tracing.

# 49. Why Reads Do Not Require Idempotency

A repeated read does not normally create a business side effect.

Example:

    project.get

can safely be retried with a new request ID.

Idempotency keys may still be accepted for diagnostics but are not mandatory.

# 50. Resource-Idempotent Commands

Some operations are naturally idempotent by resource state.

Example:

    project.archive(project_id)

If already archived:

    return PROJECT_ARCHIVED

However, explicit idempotency is still recommended for public side-effecting
commands where network uncertainty is likely.

# 51. Conditional Operations

Conditional operations may use:

    resource_id
    expected_version

For example:

    project.update
        expected_version = 7

This protects against lost updates but does not replace idempotency.

# 52. Idempotency vs Optimistic Concurrency

They solve different problems.

Idempotency:

> Did I already perform this logical request?

Optimistic concurrency:

> Did someone change this resource since I last read it?

Both may be required.

# 53. Idempotency vs Deduplication

Idempotency:

    Same request
        |
        v
    Same logical result

Deduplication:

    Detect duplicate messages/events.

The mechanisms are related but not identical.

# 54. Artifact Upload

Artifact upload is a high-value idempotency operation because uploads may be
large and may fail after storage has partially completed.

Flow:

    Studio
       |
       | artifact.upload
       | Idempotency-Key = K
       v
    Control Plane
       |
       v
    Upload session
       |
       v
    Object Storage
       |
       v
    Digest validation
       |
       v
    Artifact record
       |
       v
    ACCEPTED

# 55. Artifact Upload Identity

Artifact identity should include:

    artifact_id
    digest

The idempotency key identifies the upload request.

The digest identifies the immutable content.

These must not be conflated.

# 56. Artifact Upload Retry

Example:

    Upload K
       |
       v
    70% transferred
       |
       X
    network failure

Studio retries:

    same artifact
    same Idempotency-Key
    same digest

The server should resume or safely reuse the upload session.

# 57. Artifact Upload Duplicate

If the original upload completed:

    retry K
       |
       v
    existing idempotency record
       |
       v
    original artifact response

No duplicate artifact should be created.

# 58. Artifact Content Mismatch

If:

    same key
    different digest

the server must reject:

    IDEMPOTENCY_KEY_REUSED

or an artifact-specific conflict code.

The client must generate a new key for a genuinely different artifact upload.

# 59. Artifact Upload Transaction

Recommended:

    Begin
       |
       v
    Claim idempotency key
       |
       v
    Validate upload session
       |
       v
    Verify object digest
       |
       v
    Create artifact metadata
       |
       v
    Persist idempotency result
       |
       v
    Commit

Object storage completion may require a reconciliation mechanism because
object storage is external to the database transaction.

# 60. Artifact Storage Reconciliation

Possible uncertain state:

    Object exists
        +
    DB record missing

Reconciliation should identify and either:

- associate the object;
- mark it orphaned;
- quarantine it;
- delete it according to lifecycle policy.

The API must not create duplicate artifacts simply because an earlier response
was lost.

# 61. Booking Creation

Booking creation is a mandatory idempotency use case.

Flow:

    Studio
       |
       | booking.create
       | key = K
       v
    Control Plane
       |
       v
    Idempotency Claim
       |
       v
    Availability Check
       |
       v
    Resource Lock / Constraint
       |
       v
    Booking Commit
       |
       v
    Credit Reservation
       |
       v
    Response

# 62. Booking Atomicity

Booking creation may affect:

- booking record;
- resource allocation;
- credit reservation;
- audit record.

The transaction boundary must protect against duplicate booking creation.

Where external payment systems are involved, provider-specific idempotency must
also be used.

# 63. Booking Retry

Scenario:

    booking.create
       |
       v
    booking committed
       |
       X
    response lost

Retry:

    same key
       |
       v
    original booking returned

No second slot is created.

# 64. Concurrent Booking

Two different keys are different logical requests:

    Request A
        key = A
        slot = 10:00

    Request B
        key = B
        slot = 10:00

Idempotency does not make both succeed.

Normal booking conflict rules apply.

Result:

    A -> BOOKING_CREATED
    B -> BOOKING_CONFLICT

# 65. Important Distinction

Same key:

    duplicate logical request
        ->
    same outcome

Different key:

    separate logical requests
        ->
    normal domain concurrency rules

Idempotency must never be used to bypass resource locking.

# 66. Credit Consumption

Credit consumption must always be idempotent.

Example:

    job.start
       |
       v
    quote = 450 credits
       |
       v
    credit consumption
       |
       v
    ledger transaction

A retry must not consume another 450 credits.

# 67. Credit Ledger

Credit transactions should be immutable.

Example:

    transaction_id
    wallet_id
    operation_id
    idempotency_key
    amount
    type
    created_at

A uniqueness constraint should prevent duplicate consumption for the same
logical operation.

# 68. Job Start

`job.start` is one of the most critical idempotent commands because duplicate
execution could start multiple processes or cause unsafe robot behavior.

Flow:

    Studio
       |
       | job.start
       | key = K
       v
    Control Plane
       |
       v
    Validate booking
       |
       v
    Validate artifact
       |
       v
    Claim resource
       |
       v
    Create/transition job
       |
       v
    Dispatch to Lab Agent
       |
       v
    Start runtime
       |
       v
    RUNNING

# 69. Job Start Retry

Scenario:

    job.start
       |
       v
    Lab Agent receives command
       |
       v
    Runtime starts
       |
       X
    response lost

Studio retries with same key.

Control Plane must determine:

    job already started
       |
       v
    return original job/run identity

It must not issue a second physical start.

# 70. Job Start Identity

The job/run model should include:

    job_id
    run_id
    operation_id
    idempotency_key

A retry must resolve to the existing job/run.

# 71. Lab Agent Job Start

The Control Plane should pass idempotency identity downstream.

Example:

    {
        "command": "job.start",
        "operation_id": "op-001",
        "job_id": "job-001",
        "run_id": "run-001",
        "idempotency_key": "K",
        "artifact_id": "artifact-001"
    }

The Lab Agent must use durable job/run state to prevent duplicate execution.

# 72. Physical Execution Rule

If the outcome of a physical start is uncertain:

> Do not blindly issue another physical start command.

Instead:

    Query/Reconcile
         |
         v
    Determine runtime state
         |
         +--> RUNNING
         |
         +--> NOT_STARTED
         |
         +--> UNKNOWN
                 |
                 v
             Safety review /
             reconciliation

# 73. Safety Boundary

Idempotency does not replace physical safety controls.

The following remain separate:

- application stop;
- job cancellation;
- runtime state;
- robot safety state;
- physical E-stop.

Cloud retries must never bypass local safety interlocks.

# 74. Job Stop

`job.stop` should be idempotent.

If already stopped:

    return JOB_STOPPED

If stop is in progress:

    return operation state

If physical state is uncertain:

    reconcile before issuing another control command.

# 75. Job Cancel

`job.cancel` should be idempotent.

Repeated cancellation should not create additional cancellation actions.

A terminal cancelled job should return its existing terminal state.

# 76. Booking Cancellation

Repeated cancellation:

    booking.cancel
        |
        v
    already cancelled
        |
        v
    same logical result

No second refund should occur.

Refund operations themselves require independent idempotency.

# 77. Refunds

A refund must have:

- idempotency key;
- credit transaction identity;
- payment-provider idempotency where supported;
- reconciliation.

Never assume that a timeout means a refund failed.

# 78. Payment Provider Boundary

Flow:

    RaaS
       |
       | idempotent payment request
       v
    Payment Provider
       |
       v
    provider result
       |
       v
    RaaS transaction

RaaS must use provider-native idempotency if available.

# 79. Idempotency Expiry

Idempotency records should have an expiration policy.

Expiry must be based on operation risk and expected retry window.

Suggested initial policy:

| Operation | Suggested Retention |
|---|---|
| Project mutation | 24 hours |
| Artifact creation/upload | 7 days |
| Booking creation | 7 days |
| Booking modification/cancel | 7 days |
| Credit consumption | 30 days |
| Credit refund | 30 days |
| Job create/start/stop/cancel | 7 days |
| Payment operation | Provider-defined + reconciliation window |
| Lab deployment | 7 days |

These values are policy defaults and remain configurable.

# 80. Why Expiry Is Necessary

Without expiry:

    millions of requests
        |
        v
    permanent idempotency records
        |
        v
    unnecessary database growth

Expiry allows controlled cleanup.

# 81. Why Expiry Is Dangerous

If a key expires too soon:

    original operation
        |
        v
    delayed retry
        |
        v
    key no longer known
        |
        v
    duplicate side effect

Therefore expiry must exceed the realistic uncertainty/retry period.

# 82. Retention Principle

For high-risk operations:

> Prefer longer retention over aggressive cleanup.

Financial and physical execution operations require longer protection.

# 83. Cleanup

Expired records may be deleted asynchronously.

Example:

    Idempotency Record
        |
        expires_at
        |
        v
    cleanup worker
        |
        v
    delete/archive

Cleanup must never occur while an operation is still processing.

# 84. Processing Record Expiry

A `PROCESSING` record must not simply disappear because its nominal expiry
passed.

The system must determine whether:

- owner is still active;
- operation completed;
- operation failed;
- operation requires reconciliation.

# 85. Stale Processing Records

A stale processing record may enter:

    RECONCILIATION_REQUIRED

rather than being blindly deleted.

This is especially important for:

- job start;
- credit consumption;
- booking;
- artifact upload;
- lab deployment.

# 86. Lease

An implementation may use a processing lease:

    processing_started_at
    lease_expires_at
    owner_instance_id

The lease allows recovery after worker/API failure.

The lease must not allow two workers to perform the same physical side effect.

# 87. Ownership

The idempotency record may contain:

    operation_id
    worker_id
    lease_id

Ownership is implementation metadata, not client identity.

# 88. Client-Side Storage

Studio should persist idempotency keys for requests that may be retried after
application restart.

For example:

    Local Operation
       |
       +--> operation_id
       +--> idempotency_key
       +--> state

If Studio crashes after sending `booking.create`, it can retry with the same
key.

# 89. Browser Client

Web Console should also preserve pending idempotent operations sufficiently to
recover from:

- tab refresh;
- browser restart;
- network loss.

Server state remains authoritative.

# 90. Idempotency and WebSocket

WebSocket messages that create side effects should include an idempotency key.

Example:

    {
        "command": "job.start",
        "idempotency_key": "K",
        "payload": {
            "job_id": "job-001"
        }
    }

The server must apply the same idempotency rules as REST.

# 91. WebSocket Reconnect

After disconnect:

    WebSocket
       |
       X
    disconnect
       |
       v
    reconnect
       |
       v
    REST state reconciliation
       |
       v
    resume events

The client must not resend side-effecting commands with new keys merely because
the WebSocket was reconnected.

# 92. Local Tauri IPC

Tauri IPC commands that produce durable or externally visible side effects
should also support operation identity.

Example:

    artifact.package

The local runtime may use an idempotency key to avoid duplicate package
creation.

# 93. Local vs Server Idempotency

Local IPC idempotency and server idempotency are separate boundaries.

Example:

    Studio
       |
       | IPC key A
       v
    Local Runtime
       |
       | API key B
       v
    Control Plane

The keys may be related through operation metadata but should not be assumed to
be globally interchangeable.

# 94. Correlation

Recommended relationship:

    client_operation_id
          |
          v
    idempotency_key
          |
          v
    operation_id
          |
          v
    trace_id

This allows troubleshooting without confusing identity semantics.

# 95. Audit

Idempotency events should be auditable for high-risk operations.

Audit information should include:

- command;
- actor;
- organization;
- idempotency key hash or safe identifier;
- operation ID;
- resource ID;
- result;
- timestamps.

Raw sensitive request data must not be stored unnecessarily.

# 96. Privacy

Idempotency keys should be treated as opaque identifiers.

Do not place:

- passwords;
- payment data;
- source code;
- secrets;
- personal information;

inside keys.

Logs should avoid exposing full keys if keys may be user-controlled.

# 97. Key Hashing

For observability, the system may store:

    idempotency_key_hash = SHA-256(key)

while retaining the raw key only where necessary for protocol processing.

This reduces accidental exposure.

# 98. Authorization

Idempotency lookup must occur within the effective authorization context.

A user must not be able to reuse another organization's idempotency key to
retrieve an operation result.

Tenant isolation must be enforced server-side.

# 99. Cross-Organization Collision

Even if keys are UUIDs, uniqueness must be scoped correctly.

Example:

    org-A + booking.create + K
    org-B + booking.create + K

These must not collide semantically.

# 100. Actor Changes

Whether actor identity participates in uniqueness must be determined by the
authorization model.

At minimum, tenant context must be included.

If a key is intentionally shared by service actors, the service authorization
identity must be used consistently.

# 101. Request Hash Canonicalization

Canonicalization must:

- normalize JSON object field order;
- preserve array order;
- normalize approved equivalent representations;
- exclude transport-only headers;
- include semantic payload fields;
- include command;
- include relevant tenant context.

# 102. Headers

The following normally do not affect request identity:

    User-Agent
    traceparent
    Accept

The following may affect operation semantics and must be considered:

    command
    API version
    relevant content type
    authorization scope
    semantic request headers

# 103. API Version and Idempotency

The same key should not silently cross incompatible API versions.

For example:

    /api/v1/booking/create
       key = K

followed by:

    /api/v2/booking/create
       key = K

should either:

- resolve to the same canonical operation when explicitly supported; or
- be rejected as a key conflict.

The safer baseline is to bind the key to the API major version.

# 104. Recommended Idempotency Scope

Recommended uniqueness:

    organization_id
    api_major
    command
    idempotency_key

Request hash additionally binds:

    effective actor
    semantic payload
    relevant context

# 105. Database Constraint

Conceptual:

    UNIQUE(
        organization_id,
        api_major,
        command,
        idempotency_key
    )

The final schema should use the repository's canonical identifiers and naming.

# 106. Idempotency Repository

Recommended interface:

    IdempotencyRepository

Operations:

    create_or_claim()
    get()
    mark_processing()
    mark_succeeded()
    mark_failed()
    mark_reconciliation_required()
    release_or_expire()
    purge_expired()

# 107. Idempotency Service

Recommended interface:

    IdempotencyService

Responsibilities:

- validate key;
- compute fingerprint;
- claim request;
- detect duplicates;
- enforce scope;
- coordinate processing;
- persist outcome;
- replay response;
- detect conflicts.

# 108. Conceptual Interface

    begin(
        tenant,
        api_version,
        command,
        key,
        request_hash
    )

returns:

    NEW
    IN_PROGRESS
    COMPLETED
    CONFLICT
    RECONCILIATION_REQUIRED

# 109. Completion Interface

    complete(
        idempotency_id,
        response,
        resource_reference,
        operation_id
    )

The completion operation must be atomic with the domain state whenever
practical.

# 110. Failure Interface

    fail(
        idempotency_id,
        response,
        retryable
    )

The record should retain the logical result sufficiently to replay it.

# 111. Idempotency State Machine

    ABSENT
       |
       | claim
       v
    PROCESSING
       |
       +------------------+
       |                  |
       v                  v
    COMPLETED            FAILED
       |                  |
       |                  |
       +--------+---------+
                |
                v
             REPLAY

Exceptional:

    PROCESSING
       |
       v
    RECONCILIATION_REQUIRED

# 112. Duplicate Detection Flow

    Request
       |
       v
    Validate key
       |
       v
    Compute request hash
       |
       v
    Lookup/claim
       |
       +--> absent
       |      |
       |      v
       |   process
       |
       +--> completed
       |      |
       |      v
       |   replay
       |
       +--> processing
       |      |
       |      v
       |   in-progress
       |
       +--> hash mismatch
              |
              v
          reject

# 113. Race Condition

Two requests:

    A ---> INSERT key
    B ---> INSERT key

Database unique constraint guarantees one succeeds.

The loser must reload the existing record rather than executing the operation.

# 114. Isolation

The implementation should choose transaction isolation appropriate to the
operation.

The baseline requirement is that concurrent claims cannot both become owners.

Serializing all idempotent requests globally is prohibited because it would
create unnecessary contention.

# 115. Deadlocks

Transactions must avoid holding idempotency locks while performing slow
external operations.

Preferred:

    short DB transaction
        |
        v
    durable state transition
        |
        v
    external asynchronous work

For operations requiring external calls, use explicit state/reconciliation
patterns rather than long database locks.

# 116. External Side Effects

External side effects include:

- payment provider;
- object storage;
- Lab Agent;
- robot runtime.

Database idempotency cannot make external systems transactional.

Therefore use:

- provider-native idempotency;
- operation IDs;
- durable state;
- reconciliation;
- state queries;
- outbox/worker patterns.

# 117. Outbox

Where an operation commits domain state and must publish work:

    DB Transaction
       |
       +--> domain state
       +--> idempotency result/state
       +--> outbox event
       |
       v
    Commit
       |
       v
    Outbox Worker
       |
       v
    Queue

This prevents loss of the dispatch intent.

# 118. Outbox Deduplication

Outbox workers may retry publishing.

The downstream consumer must tolerate duplicate messages.

Messages should carry:

    event_id
    operation_id
    resource_id

# 119. Lab Command Deduplication

Lab Agent should maintain enough durable state to identify:

    operation_id
    job_id
    run_id

If the same command arrives again, it should:

- return current state;
- acknowledge the already-applied action;
- reconcile uncertain state.

# 120. Job Start State Machine

    CREATED
       |
       v
    QUEUED
       |
       v
    VALIDATING
       |
       v
    ALLOCATING
       |
       v
    DEPLOYING
       |
       v
    STARTING
       |
       v
    RUNNING

A repeated `job.start` must never create a second run for the same operation.

# 121. Booking State Machine

    CREATED
       |
       v
    CONFIRMED
       |
       v
    ACTIVE
       |
       v
    COMPLETED

Cancellation paths:

    CONFIRMED -> CANCELLED
    ACTIVE    -> CANCELLED

Repeated cancellation should return the existing state.

# 122. Artifact State Machine

    CREATED
       |
       v
    UPLOADING
       |
       v
    UPLOADED
       |
       v
    VALIDATING
       |
       v
    ACCEPTED
       |
       v
    READY

A retry must preserve artifact identity when it is the same logical upload.

# 123. Idempotency and Resource Locks

Idempotency prevents duplicate logical requests.

Resource locks prevent conflicting requests.

Both are required:

    Idempotency
        |
        +--> same request protection

    Resource Lock
        |
        +--> competing request protection

# 124. Idempotency and Credits

Credit consumption must be tied to a unique logical operation.

Recommended:

    UNIQUE(
        wallet_id,
        operation_id,
        transaction_type
    )

This prevents duplicate ledger entries.

# 125. Idempotency and Audit

Audit events should not be duplicated because a client retries.

The logical operation should produce one authoritative business audit event.

Retry metadata may be recorded separately if operationally useful.

# 126. API Response Header

The server may return:

    Idempotency-Key: K

This is optional because the request already supplied the key, but can help
diagnostics.

A response may also include:

    X-Operation-Id: op-001

if an operation is asynchronous.

# 127. Idempotency Status Metadata

A replayed response may expose metadata such as:

    "metadata": {
        "idempotent_replay": true
    }

This is useful for diagnostics but should not alter business semantics.

# 128. Replay Semantics

A replayed response must not:

- create a new resource;
- consume credits again;
- send duplicate business notifications;
- start another robot run;
- allocate another resource.

It may produce normal transport-level logging.

# 129. Notifications

Notifications generated by idempotent operations should themselves be
deduplicated using:

    event_id
    operation_id

Consumers must handle at-least-once event delivery.

# 130. Idempotency and Webhooks

If RaaS later consumes external webhooks, inbound webhook processing must also
be idempotent.

Use:

    provider_event_id

as the primary deduplication identity.

Do not rely solely on timestamps or payload equality.

# 131. Client Guidance

Studio and Web Console clients must:

1. generate a key before sending;
2. persist it while the operation is pending;
3. reuse it for retries;
4. stop retrying after terminal success/failure;
5. query operation state when appropriate;
6. generate a new key for a new logical request.

# 132. Client Example

    operation = create_booking_request()

    key = UUID()

    persist_pending_operation(
        key,
        operation
    )

    send(
        operation,
        Idempotency-Key = key
    )

On timeout:

    retry(
        same operation,
        same key
    )

# 133. Incorrect Client Example

    timeout
       |
       v
    generate new UUID
       |
       v
    booking.create

This may create a duplicate booking.

# 134. Server Example

Request:

    POST /api/v1/bookings
    Idempotency-Key: K

    {
        "platform_id": "humanoid-a",
        "resource_id": "robot-01",
        "start_time": "2026-10-10T10:00:00Z",
        "duration_minutes": 30
    }

First response:

    {
        "status": "SUCCESS",
        "code": "BOOKING_CREATED",
        "data": {
            "booking_id": "booking-001"
        }
    }

Retry with same key:

    same logical response
    booking_id = booking-001

# 135. Job Start Example

Request:

    POST /api/v1/jobs/job-001/start
    Idempotency-Key: K

    {
        "artifact_id": "artifact-001"
    }

Response:

    {
        "status": "ACCEPTED",
        "code": "JOB_START_ACCEPTED",
        "data": {
            "job_id": "job-001",
            "run_id": "run-001",
            "operation_id": "op-001"
        }
    }

Retry:

    same key
       |
       v
    same operation_id
    same run_id

# 136. Artifact Upload Example

Request:

    POST /api/v1/artifacts/upload
    Idempotency-Key: K

    {
        "artifact_name": "vision-demo.krv",
        "digest": "sha256:abc123",
        "size": 1843200,
        "project_id": "project-001"
    }

Retry:

    same key
    same digest

Result:

    same artifact_id

# 137. Key Reuse Example

First:

    key = K
    booking = robot-A

Second:

    key = K
    booking = robot-B

Result:

    IDEMPOTENCY_KEY_REUSED

No second booking is created.

# 138. Expired Key Example

    key = K
    |
    v
    operation completed
    |
    v
    retention period expires
    |
    v
    record removed

If the client later sends the same key, behavior is no longer guaranteed by
idempotency retention policy.

Therefore clients must not intentionally reuse expired keys.

# 139. Operation State Query

For asynchronous operations:

    GET /api/v1/operations/{operation_id}

This allows clients to recover after timeout without repeatedly submitting the
same command.

The operation resource is authoritative for long-running state.

# 140. Reconciliation

Reconciliation is required when:

    idempotency state
       !=
    external state

Examples:

- job marked processing but runtime is running;
- credit marked processing but provider result is unknown;
- artifact upload marked processing but object exists;
- booking marked processing but resource allocation exists.

# 141. Reconciliation Flow

    Unknown State
        |
        v
    Query authoritative systems
        |
        v
    Determine actual outcome
        |
        +--> success
        |
        +--> failure
        |
        +--> retry safely
        |
        +--> manual review

# 142. Manual Review

High-risk unresolved cases may enter:

    RECONCILIATION_REQUIRED

Manual review is preferred over an unsafe automatic duplicate action.

This is particularly important for:

- robot execution;
- payment;
- credit ledger;
- resource allocation.

# 143. Idempotency Metrics

Recommended metrics:

    idempotency.requests_total
    idempotency.replays_total
    idempotency.conflicts_total
    idempotency.in_progress_total
    idempotency.expired_total
    idempotency.reconciliation_total
    idempotency.processing_duration
    idempotency.storage_errors

# 144. Operational Alerts

Alert on:

- high conflict rate;
- high reconciliation rate;
- stale processing records;
- database uniqueness failures;
- idempotency storage failures;
- abnormal replay rate;
- credit duplicate-detection anomalies;
- repeated job-start uncertainty.

# 145. Storage Failure

If idempotency storage is unavailable for a command that requires idempotency,
the server must not execute the side effect blindly.

Return:

    IDEMPOTENCY_STORAGE_UNAVAILABLE

or an appropriate infrastructure error.

The operation should not proceed unless a safe alternative is explicitly
designed.

# 146. Availability vs Safety

For non-critical read operations:

    storage failure
        |
        v
    request may continue

For financial/booking/physical execution operations:

    idempotency storage failure
        |
        v
    fail closed

Safety and duplicate prevention take precedence over availability.

# 147. Security Considerations

Idempotency must not become a data-leak mechanism.

A duplicate request must still pass:

- authentication;
- authorization;
- tenant validation.

The server may then return the stored result only if the requester is
authorized to access it.

# 148. Authorization Change

If the original requester had access but the retrying requester does not,
the server must not expose the original response merely because the key matches.

Authorization is evaluated on every request.

# 149. Logging

Logs should include:

    request_id
    operation_id
    idempotency_key_hash
    command
    resource_id
    status
    retry/replay indicator

Avoid logging sensitive request payloads.

# 150. Tracing

Distributed traces should preserve:

    trace_id
    span_id
    operation_id

The idempotency key hash may be included as a low-cardinality-safe diagnostic
attribute only if cardinality and privacy are acceptable.

# 151. Performance

Idempotency lookup must be efficient.

Required:

- indexed key lookup;
- bounded record size;
- efficient expiration cleanup;
- no global lock;
- no global serialization.

Recommended index:

    organization_id
    api_major
    command
    idempotency_key

# 152. Database Growth

The cleanup worker should:

- process expired records in batches;
- avoid large table locks;
- monitor table size;
- archive records if required;
- preserve financial/audit retention independently.

# 153. High Throughput

High-frequency telemetry should not use ordinary REST idempotency records for
every sample.

Telemetry requires specialized sequence/deduplication mechanisms.

Idempotency is primarily for business operations.

# 154. Idempotency and Streaming

For streamed operations:

    stream_id
    sequence_number

may provide the required duplicate protection.

A new idempotency record for every telemetry packet is prohibited.

# 155. Protocol Command Catalogue Mapping

| Command Family | Idempotency |
|---|---|
| Auth login | Conditional/provider-specific |
| Project create | Required |
| Project update | Required/conditional |
| Build start | Required |
| Artifact upload | Required |
| Booking create | Required |
| Credit consumption | Required |
| Credit refund | Required |
| Job create | Required |
| Job start | Required |
| Job stop | Required |
| Job cancel | Required |
| Run state transitions | Required |
| Result processing | Worker idempotent |
| Experiment create | Required |
| Lab deployment | Required |
| Resource lock | Required |
| Resource release | Required |

# 156. Phase Mapping Overview

| Phase | Idempotency Scope |
|---|---|
| Phase 0 | Core model and contracts |
| Phase 1 | Studio/client retries |
| Phase 2 | Artifact operations |
| Phase 3 | Control Plane persistence |
| Phase 4 | Booking/credits/payments |
| Phase 5 | Jobs/runs |
| Phase 6 | Lab/robot execution |
| Phase 7 | Results/events |
| Phase 8 | Production operations |

# 157. Phase 0 — Foundation

Implement:

- Idempotency-Key contract;
- request fingerprint;
- repository interface;
- database schema;
- state machine;
- error codes;
- retention policy;
- concurrency rules.

Acceptance:

- duplicate requests cannot both claim a key;
- request hash mismatch is detected.

# 158. Phase 1 — Studio

Implement:

- client key generation;
- persistence of pending operations;
- retry reuse;
- timeout recovery;
- operation status recovery.

Acceptance:

- Studio never generates a new key for an automatic retry.

# 159. Phase 2 — Artifact

Implement:

- artifact upload idempotency;
- digest binding;
- resumable upload;
- storage reconciliation.

Acceptance:

- repeated upload cannot create duplicate artifact identities.

# 160. Phase 3 — Control Plane

Implement:

- PostgreSQL-backed idempotency repository;
- transactional claim;
- response replay;
- worker integration;
- observability.

Acceptance:

- horizontally scaled API instances produce one logical result.

# 161. Phase 4 — Commercial

Implement:

- booking idempotency;
- credit ledger idempotency;
- refund idempotency;
- payment-provider idempotency;
- financial reconciliation.

Acceptance:

- retries cannot double-book or double-charge.

# 162. Phase 5 — Execution

Implement:

- job creation;
- job start;
- stop;
- cancel;
- operation IDs;
- queue deduplication;
- worker state checks.

Acceptance:

- job start retry cannot create a second run.

# 163. Phase 6 — Lab and Robot

Implement:

- Lab Agent command idempotency;
- runtime state reconciliation;
- physical execution protection;
- version-aware operation recovery.

Acceptance:

- uncertain physical execution is reconciled before retrying.

# 164. Phase 7 — Live and Results

Implement:

- result-processing idempotency;
- event deduplication;
- run result reconciliation;
- experiment repeatability.

Acceptance:

- duplicate worker messages cannot create duplicate result records.

# 165. Phase 8 — Production

Implement:

- cleanup;
- dashboards;
- alerts;
- reconciliation tooling;
- retention enforcement;
- incident runbooks;
- security controls.

Acceptance:

- idempotency behavior is observable and operationally supportable.

# 166. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate booking | Critical | Durable key + DB constraint |
| Double credit charge | Critical | Immutable ledger + idempotency |
| Duplicate robot start | Critical | Job/run identity + reconciliation |
| Lost response | High | Same-key retry |
| Key collision | High | Strong unique keys |
| Key reuse mismatch | Critical | Request fingerprint |
| Premature expiry | High | Risk-based retention |
| Stale processing | High | Lease + reconciliation |
| Queue duplicate | High | Worker idempotency |
| Object storage uncertainty | High | Reconciliation |
| Payment uncertainty | Critical | Provider idempotency |
| Cross-tenant leakage | Critical | Tenant-scoped records |
| DB failure | Critical | Fail closed for side effects |
| Version mismatch | Medium | Version-bound keys |
| Storage growth | Medium | Batched cleanup |

# 167. Open Questions

1. What exact idempotency-key length and character set will be enforced?
2. UUIDv7 or opaque random identifiers?
3. What exact API version participates in uniqueness?
4. Should actor identity participate directly in the unique constraint?
5. What exact canonical JSON algorithm will be used?
6. Which request fields are excluded from request fingerprints?
7. What exact response payload is persisted?
8. Which operations require full response replay?
9. What exact retention period applies to each command?
10. Should completed financial idempotency records be retained longer for audit?
11. What exact stale-processing timeout applies?
12. Should processing leases be implemented?
13. What exact maximum client retry duration is recommended?
14. Which commands may return `IN_PROGRESS`?
15. Should duplicate requests wait briefly or return immediately?
16. What exact queue deduplication strategy will be used?
17. Which external providers support native idempotency?
18. What exact payment-provider reconciliation workflow is required?
19. How should offline Lab Agents reconcile uncertain commands?
20. How should artifact upload sessions interact with idempotency records?
21. Should WebSocket commands share the same idempotency store?
22. Should local Tauri IPC use the same persistence abstraction?
23. What exact idempotency metrics become production SLOs?
24. What exact audit retention is required?
25. Should idempotency records be encrypted at rest separately from PostgreSQL?
26. What exact administrative tooling is needed to inspect/reconcile records?
27. Can operators safely force-complete or invalidate a processing record?
28. What safeguards prevent operator actions from causing duplicate execution?
29. How should emergency security blocking interact with retries?
30. What exact compatibility behavior applies when an idempotency key crosses
    API major versions?

# 168. Full Acceptance Criteria — Core Model

- [ ] `Idempotency-Key` is defined.
- [ ] Key format is defined.
- [ ] Key ownership is defined.
- [ ] Logical operation identity is defined.
- [ ] Request fingerprinting is defined.
- [ ] Request canonicalization is defined.
- [ ] Key scope is defined.
- [ ] Database uniqueness is defined.
- [ ] Processing state is defined.
- [ ] Completion state is defined.
- [ ] Failure state is defined.
- [ ] Reconciliation state is defined.

# 169. Full Acceptance Criteria — Storage

- [ ] Idempotency state is durable.
- [ ] State survives API process restart.
- [ ] State survives API instance failover.
- [ ] State is shared across API instances.
- [ ] Records are indexed.
- [ ] Records have timestamps.
- [ ] Records have expiration.
- [ ] Cleanup is batched.
- [ ] Cleanup does not delete active processing records.
- [ ] Storage failures are detectable.

# 170. Full Acceptance Criteria — Concurrency

- [ ] Concurrent identical requests cannot both execute.
- [ ] Database uniqueness enforces key ownership.
- [ ] Race losers reload the existing state.
- [ ] Duplicate processing is prevented across API instances.
- [ ] No global lock is used.
- [ ] Database transactions remain bounded.
- [ ] Stale processing state is recoverable.
- [ ] Physical commands are not retried blindly.

# 171. Full Acceptance Criteria — Retry

- [ ] Client retries reuse the same key.
- [ ] New logical operations use new keys.
- [ ] Timeout does not cause automatic new-key generation.
- [ ] Retry backoff is bounded.
- [ ] Retry count/duration is bounded.
- [ ] Completed operations replay results.
- [ ] In-progress operations return deterministic state.
- [ ] Failed operations have defined retry semantics.
- [ ] Unknown outcomes trigger reconciliation where required.

# 172. Full Acceptance Criteria — API

- [ ] All side-effecting API commands are classified.
- [ ] Commands requiring idempotency are documented.
- [ ] Required commands reject missing keys.
- [ ] Duplicate requests are detected.
- [ ] Key reuse with different request data is rejected.
- [ ] Read-only commands do not require keys.
- [ ] Error codes are stable.
- [ ] Response semantics are documented.

# 173. Full Acceptance Criteria — Artifact Upload

- [ ] Upload requires idempotency.
- [ ] Artifact digest is validated.
- [ ] Same key returns same artifact.
- [ ] Different digest with same key is rejected.
- [ ] Partial uploads can recover safely.
- [ ] Object storage uncertainty is reconciled.
- [ ] Duplicate artifact metadata is prevented.
- [ ] Artifact identity remains immutable.

# 174. Full Acceptance Criteria — Booking

- [ ] Booking creation requires idempotency.
- [ ] Booking retry returns original booking.
- [ ] Concurrent different keys obey resource conflict rules.
- [ ] Duplicate credit reservation is prevented.
- [ ] Booking cancellation is idempotent.
- [ ] Duplicate refunds are prevented.
- [ ] Booking state remains authoritative in PostgreSQL.
- [ ] Resource locking remains independent of idempotency.

# 175. Full Acceptance Criteria — Job Start

- [ ] Job start requires idempotency.
- [ ] Job start creates one operation.
- [ ] Job start creates one run.
- [ ] Retry returns the existing operation/run.
- [ ] Queue redelivery cannot create another run.
- [ ] Lab Agent receives operation identity.
- [ ] Runtime state is checked before uncertain retry.
- [ ] Physical duplicate starts are prevented.
- [ ] Stop/cancel operations are idempotent.

# 176. Full Acceptance Criteria — Credits and Payments

- [ ] Credit consumption is idempotent.
- [ ] Credit refunds are idempotent.
- [ ] Ledger entries cannot duplicate.
- [ ] Payment provider idempotency is used where supported.
- [ ] Unknown payment outcomes are reconciled.
- [ ] Financial operations fail closed if idempotency state is unavailable.

# 177. Full Acceptance Criteria — Lab

- [ ] Lab commands carry operation identity.
- [ ] Lab Agent handles duplicate commands.
- [ ] Agent state is durable.
- [ ] Agent reconnect does not duplicate execution.
- [ ] Runtime state is reconciled.
- [ ] Offline labs do not blindly replay unsafe commands.
- [ ] Safety controls remain independent.
- [ ] Physical E-stop is never implemented through idempotency.

# 178. Full Acceptance Criteria — WebSocket and IPC

- [ ] Side-effecting WebSocket commands support idempotency.
- [ ] Reconnect does not generate duplicate operations.
- [ ] REST reconciliation is supported.
- [ ] Tauri IPC side-effecting operations have operation identity.
- [ ] Local and server idempotency boundaries remain distinct.

# 179. Full Acceptance Criteria — Security

- [ ] Idempotency records are tenant-scoped.
- [ ] Authorization is evaluated on retries.
- [ ] Cross-tenant key reuse cannot expose data.
- [ ] Keys are not secrets.
- [ ] Sensitive request data is not unnecessarily stored.
- [ ] Logs do not expose sensitive payloads.
- [ ] Security-blocked operations cannot bypass idempotency.

# 180. Full Acceptance Criteria — Observability

- [ ] Request ID is logged.
- [ ] Operation ID is logged.
- [ ] Idempotency key hash is available where appropriate.
- [ ] Replay is observable.
- [ ] Conflict is observable.
- [ ] Reconciliation is observable.
- [ ] Stale processing is observable.
- [ ] Storage failures are observable.
- [ ] Metrics exist for key lifecycle.

# 181. Full Acceptance Criteria — Operations

- [ ] Cleanup process exists.
- [ ] Retention policy is documented.
- [ ] Reconciliation tooling exists.
- [ ] Incident procedures exist.
- [ ] Stale records can be diagnosed.
- [ ] Operators cannot accidentally duplicate physical actions.
- [ ] Backup/restore preserves required idempotency state.
- [ ] Production dashboards expose idempotency health.

# 182. Architectural Invariants

The following are mandatory:

1. Side-effecting operations must be explicitly classified for idempotency.
2. Required idempotency keys are client-generated.
3. Automatic retries reuse the same key.
4. New logical operations use new keys.
5. Keys are bound to request semantics.
6. Duplicate keys with different request semantics are rejected.
7. Durable storage is authoritative.
8. Database uniqueness prevents concurrent duplicate claims.
9. Completed operations replay their logical result.
10. In-progress operations have deterministic behavior.
11. Queue delivery is treated as at-least-once.
12. Workers are idempotent.
13. Financial operations are idempotent.
14. Booking/resource operations are idempotent.
15. Physical execution commands are idempotent and reconciliation-aware.
16. Idempotency does not replace resource locking.
17. Idempotency does not replace optimistic concurrency.
18. Idempotency does not provide exactly-once distributed execution.
19. External systems require provider-specific idempotency or reconciliation.
20. Security authorization applies to every retry.
21. Expiry must be risk-based.
22. Processing records cannot be blindly expired.
23. Unknown physical outcomes must be reconciled before retry.
24. The cloud must never bypass local robot safety controls.
25. Idempotency state must remain observable and auditable.

# 183. Final Production Baseline

The Kritva RaaS idempotency architecture is:

    Client
       |
       | command + Idempotency-Key
       v
    Control Plane
       |
       v
    Idempotency Service
       |
       +--> PostgreSQL
       |
       +--> Domain Transaction
       |
       +--> Operation
       |
       v
    Durable Result
       |
       v
    Client

For asynchronous execution:

    Client
       |
       v
    Idempotency Claim
       |
       v
    Domain Transaction
       |
       +--> Job / Booking / Credit / Artifact
       |
       +--> Outbox
       |
       v
    Queue
       |
       v
    Worker
       |
       v
    Lab Agent
       |
       v
    Runtime / Robot

The essential retry rule is:

> **Same logical operation = same idempotency key.**

The essential duplicate rule is:

> **Same key + same request semantics = same logical result.**

The essential conflict rule is:

> **Same key + different request semantics = reject.**

The essential concurrency rule is:

> **Only one request may claim an idempotency key, regardless of how many
> Control Plane instances receive the request concurrently.**

The essential physical-execution rule is:

> **An uncertain robot operation must be reconciled before another physical
> command is issued.**

The essential architecture rule is:

> **Idempotency prevents duplicate logical side effects; transactions,
> resource locks, queues, reconciliation, and local safety controls solve the
> other parts of distributed correctness.**

This model provides the foundation for safe retries across Kritva RaaS Studio,
Web Console, Control Plane, cloud infrastructure, Lab Agent, Kritva Runtime,
credit accounting, artifact management, bookings, and real-robot execution.
