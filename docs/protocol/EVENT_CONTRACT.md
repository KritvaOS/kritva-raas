# Kritva RaaS Event Contract

**Document:** `docs/protocol/EVENT_CONTRACT.md`  
**Status:** Normative contract  
**Contract version:** 1.0  
**Protocol family:** Kritva RaaS event protocol  
**Applies to:** Event producers, event brokers, backend services, frontend consumers, database-backed event stores, Lab Agents, execution workers, and external integrations  
**Transport alignment:** `docs/protocol/WEBSOCKET_CONTRACT.md`, `docs/protocol/LAB_PROTOCOL.md`  
**Architecture alignment:** `docs/architecture/PROTOCOL_ARCHITECTURE.md`  
**Related contract:** `docs/protocol/ARTIFACT_MANIFEST.md`  
**Canonical phase definitions:** `planning/PHASES.md`

---

## 1. Purpose

This document defines the normative event payload contract for Kritva RaaS.

It establishes the common event envelope, naming conventions, domain event types, exact payload fields, validation rules, event identity, delivery semantics, ordering, idempotency, deduplication, retention, replay, compatibility, security, and conformance requirements.

The contract is intended to let independently implemented producers and consumers exchange domain events without relying on implementation-specific database schemas, internal class names, or transport details.

An implementation conforming to this document MUST distinguish the event's public contract from its internal representation.

## 2. Normative language

The terms MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, NOT RECOMMENDED, MAY, and OPTIONAL are normative.

- MUST and MUST NOT define mandatory requirements.
- SHOULD and SHOULD NOT define recommendations that may be departed from only for a documented reason.
- MAY defines an explicitly permitted implementation choice.
- OPTIONAL identifies a field or behavior that may be absent where the schema permits it.

A field marked REQUIRED MUST be present and valid.

A field marked OPTIONAL MAY be absent. Unless explicitly stated otherwise, a present OPTIONAL field MUST satisfy its declared type and constraints.

Producers MUST NOT assume that consumers will accept undocumented fields, undocumented event types, or undocumented value encodings.

Consumers MUST NOT silently reinterpret a known field in a way that changes its documented meaning.

## 3. Contract boundaries

This document defines the event data contract, not the complete behavior of every transport.

`docs/protocol/WEBSOCKET_CONTRACT.md` defines WebSocket transport, subscription, connection, and transport-message behavior.

`docs/protocol/LAB_PROTOCOL.md` defines the Lab Agent interaction contract, including the exchange of operational messages between the Remote Control Plane and a Lab Agent.

`docs/protocol/ARTIFACT_MANIFEST.md` defines the artifact manifest contract used to identify and validate artifacts.

`docs/architecture/PROTOCOL_ARCHITECTURE.md` defines the architectural boundaries and relationships among platform components.

Implementations MUST use this event contract consistently across transports.

A transport adapter MUST NOT silently alter event identity, event type, schema version, aggregate identity, timestamps, or payload semantics.

A transport adapter MAY wrap an event in a transport-specific message envelope, provided the original event envelope remains unambiguous and recoverable.

## 4. Contract principles

The event protocol follows these principles:

1. Events describe facts that have occurred.
2. Commands request actions; events report outcomes or observations.
3. Event identifiers are globally unique within the platform's supported identifier scheme.
4. Event names are stable, machine-readable, and version-independent.
5. Payloads use explicit JSON types and UTC timestamps.
6. Events are immutable after publication.
7. Delivery may produce duplicates; consumers MUST be designed to handle them.
8. Ordering guarantees are scoped and explicit.
9. Replay MUST preserve original event identity and event content.
10. Authorization and tenant isolation apply to event publication, storage, subscription, and replay.
11. Public events MUST NOT expose internal secrets or unnecessary personal data.
12. Schema changes MUST follow the compatibility rules in this document.

## 5. JSON and serialization rules

The canonical event representation is a JSON object encoded as UTF-8.

Producers MUST serialize event objects as valid JSON.

Producers MUST NOT emit comments, trailing commas, NaN, Infinity, negative Infinity, or non-standard JSON values.

Consumers MUST reject malformed JSON before domain processing.

Object keys MUST be strings.

The JSON types used by this contract are:

| Type | Contract meaning |
|---|---|
| `string` | UTF-8 text represented as a JSON string |
| `integer` | A whole-number JSON value within the declared range |
| `number` | A finite JSON numeric value |
| `boolean` | `true` or `false` |
| `object` | A JSON object |
| `array` | A JSON array |
| `null` | An explicitly absent or unknown value only where allowed |

Unless a field explicitly permits `null`, producers MUST omit an optional field rather than send it as `null`.

Consumers MUST distinguish a missing field from a field explicitly set to `null`.

Identifiers MUST be serialized as strings, even when an implementation uses numeric database keys internally.

Currency amounts, credit quantities, and other values for which binary floating-point rounding is unacceptable MUST use integer minor units or a documented decimal string representation.

Event payloads MUST NOT rely on object-key ordering.

## 6. Event model

An event is an immutable statement that a domain fact or operational observation occurred at a particular time.

An event consists of:

- A common envelope.
- A domain-specific payload.
- An event type and schema version.
- A unique event identifier.
- Publication and causation metadata where applicable.

An event producer MUST validate the envelope and payload before accepting the event for durable publication.

An event MUST represent one logical fact. A producer MUST NOT combine unrelated domain facts into one event merely to reduce message volume.

When one business operation produces multiple facts, the producer SHOULD publish separate events linked by correlation or causation metadata.

Consumers MUST treat the payload as the authoritative event-specific data and MUST NOT infer undocumented fields from the event name.

## 7. Event naming convention

Event types MUST use the following format:

    <domain>.<subject>.<past_tense_verb>

Names MUST be lowercase ASCII, with dot separators between segments.

The domain MUST identify the principal event family.

The subject MUST identify the affected domain entity or operational concept.

The final segment MUST describe a completed fact, state transition, or observed condition.

Examples:

    artifact.created
    artifact.validated
    booking.confirmed
    credit.reserved
    job.queued
    run.started
    result.published
    lab.heartbeat_received
    telemetry.sample_received
    system.service_degraded

Event names MUST NOT contain schema version numbers.

Event names MUST NOT be reused for different meanings.

A producer MUST NOT publish a past-tense event before the fact it describes has occurred, except where the event explicitly describes an accepted request or planned transition.

An event name MUST remain stable across compatible payload schema revisions.

## 8. Canonical domains

The canonical event domains are:

| Domain | Purpose | Example |
|---|---|---|
| `artifact` | Artifact lifecycle and validation | `artifact.validated` |
| `booking` | Resource reservation and booking lifecycle | `booking.confirmed` |
| `credit` | Credit accounting and reservation lifecycle | `credit.reserved` |
| `job` | Job submission and scheduling lifecycle | `job.queued` |
| `run` | Execution lifecycle and control outcomes | `run.started` |
| `result` | Result creation, publication, and availability | `result.published` |
| `lab` | Lab Agent connectivity, capabilities, and health | `lab.heartbeat_received` |
| `telemetry` | Time-series and operational measurements | `telemetry.sample_received` |
| `system` | Platform health and administrative observations | `system.service_degraded` |

A producer MUST use a canonical domain for events covered by this contract.

A new domain MUST NOT be introduced without a documented contract change and a review of its security, retention, delivery, and compatibility requirements.

A consumer MAY subscribe to one or more domains.

Consumers MUST NOT assume that every domain is enabled in every deployment.

## 9. Common event envelope

Every published domain event MUST contain the following fields.

| Field | Type | Requirement | Constraints |
|---|---|---|---|
| `event_id` | string | REQUIRED | Globally unique event identifier |
| `event_type` | string | REQUIRED | Canonical event name |
| `schema_version` | string | REQUIRED | Semantic schema version |
| `occurred_at` | string | REQUIRED | UTC RFC 3339 timestamp |
| `published_at` | string | REQUIRED | UTC RFC 3339 timestamp |
| `producer` | object | REQUIRED | Producer identity |
| `tenant_id` | string | REQUIRED | Authorized tenant identifier |
| `aggregate` | object | REQUIRED | Aggregate identity and version |
| `correlation_id` | string | REQUIRED | Request or workflow correlation |
| `causation_id` | string or null | REQUIRED | Direct cause event or command identifier |
| `trace_id` | string or null | REQUIRED | Distributed trace identifier when available |
| `idempotency_key` | string or null | REQUIRED | Producer operation idempotency key when applicable |
| `payload` | object | REQUIRED | Event-specific payload |

The `causation_id`, `trace_id`, and `idempotency_key` fields MUST be present in the envelope. They MAY contain `null` only where this table explicitly permits it.

A producer MUST NOT add transport-specific fields to the canonical envelope unless a future contract version explicitly defines them.

A consumer MUST ignore unrecognized envelope fields only if the applicable schema policy explicitly permits extensions. The baseline version 1.0 envelope does not authorize arbitrary envelope extensions.

## 10. Event identifier

`event_id` identifies one immutable event instance.

The canonical format MUST be a lowercase UUID string in the standard hyphenated representation.

Example:

    4c99a9e1-7d1b-4df8-a48f-39c1a2d7110b

A producer MUST generate a new `event_id` for each distinct event instance.

A retry of the same event MUST preserve its original `event_id`.

A producer MUST NOT generate a new `event_id` merely because a broker delivery or network transmission is retried.

A replay MUST preserve the original `event_id`.

Consumers MUST use `event_id` as the primary event-level deduplication key within the relevant tenant and consumer scope.

An event identifier MUST NOT be reassigned to a different event, even after retention expiry.

## 11. Event type and schema version

`event_type` identifies the stable semantic event type.

`schema_version` identifies the version of the payload schema for that event type.

The initial version MUST be represented as:

    "schema_version": "1.0.0"

Schema versions MUST follow semantic versioning with three numeric components: MAJOR.MINOR.PATCH.

- MAJOR indicates an incompatible schema or semantic change.
- MINOR indicates a backward-compatible addition or relaxation.
- PATCH indicates a correction that does not change the intended interpretation of valid events.

The version number MUST be a string.

Producers MUST NOT use a schema version that is unsupported by the event registry or the configured deployment compatibility policy.

Consumers MUST validate events against the schema corresponding to their declared supported version range.

## 12. Timestamp contract

`occurred_at` records when the domain fact occurred.

`published_at` records when the event was accepted for publication by the authoritative event-producing service.

Both fields MUST use UTC RFC 3339 timestamps with a `Z` suffix.

The canonical serialization SHOULD include millisecond precision.

Example:

    "occurred_at": "2026-10-09T06:45:12.347Z"

Producers MUST NOT use local timezone offsets in the canonical event representation.

`published_at` MUST NOT precede `occurred_at` unless a documented clock-correction policy explains the difference.

Consumers MUST NOT use timestamps as the sole deduplication mechanism.

Consumers MUST NOT assume timestamps establish a total ordering across independent producers.

If an event is reconstructed from a durable outbox, `published_at` MUST represent the original accepted publication time, not the time of each retry.

## 13. Producer identity

The `producer` field MUST be an object with the following fields:

| Field | Type | Requirement | Constraints |
|---|---|---|---|
| `service` | string | REQUIRED | Registered service name |
| `instance_id` | string | REQUIRED | Unique service-instance identifier |
| `environment` | string | REQUIRED | Deployment environment |

`service` MUST be a stable logical service name, such as `control-plane`, `artifact-service`, or `execution-worker`.

`instance_id` MUST identify the emitting instance sufficiently for operational diagnosis.

`environment` MUST use a deployment-approved value, such as `development`, `staging`, or `production`.

The environment value MUST NOT be treated as an authorization boundary by itself.

Example:

    "producer": {
        "service": "execution-worker",
        "instance_id": "worker-7f39",
        "environment": "staging"
    }

A producer MUST NOT claim another service's identity.

The event ingestion path MUST authenticate producers and validate that their authenticated identity is authorized to publish the declared event types.

## 14. Tenant identity

`tenant_id` identifies the tenant owning or authorized to access the event.

It MUST be a non-empty string.

The identifier MUST use the platform's canonical tenant identifier format.

A producer MUST obtain the tenant identity from an authenticated, authorized domain context. It MUST NOT trust a client-supplied tenant identifier without authorization checks.

Consumers MUST enforce tenant isolation before delivering, replaying, storing, or exposing an event.

A tenant-scoped subscription MUST NOT receive events from another tenant unless an explicit, audited platform-level authorization permits the access.

Cross-tenant event forwarding MUST be denied by default.

## 15. Aggregate identity and version

The `aggregate` field identifies the domain entity whose state or lifecycle is affected.

It MUST contain:

| Field | Type | Requirement | Constraints |
|---|---|---|---|
| `type` | string | REQUIRED | Canonical aggregate type |
| `id` | string | REQUIRED | Stable aggregate identifier |
| `version` | integer | REQUIRED | Positive aggregate version |

The aggregate type MUST be a documented domain entity, such as `artifact`, `booking`, `credit_account`, `job`, `run`, `result`, or `lab`.

The aggregate ID MUST be stable for the aggregate's lifetime.

`version` MUST be a positive integer representing the aggregate revision associated with the event.

For a state-changing event, the producer SHOULD increment the aggregate version monotonically.

Two events for the same aggregate MAY share a version only when the contract explicitly allows multiple facts for one revision. Otherwise, the producer MUST assign a distinct version to each committed state transition.

Consumers MAY use aggregate versions to detect gaps or stale observations.

Consumers MUST NOT assume that aggregate versions order events belonging to different aggregates.

## 16. Correlation, causation, and tracing

`correlation_id` links events belonging to the same request, workflow, or business operation.

It MUST be a non-empty string.

A producer MUST preserve the correlation ID across downstream operations when the event belongs to the same logical workflow.

`causation_id` identifies the immediate cause of an event, such as a command ID or preceding event ID.

It MUST be either a non-empty string or `null`.

`trace_id` identifies the distributed trace when tracing is available.

It MUST be either a non-empty string or `null`.

A consumer MUST NOT interpret `correlation_id`, `causation_id`, or `trace_id` as authorization credentials.

A producer MUST NOT put access tokens, credentials, or other secrets into these fields.

## 17. Idempotency key

`idempotency_key` identifies the producer operation for which duplicate event creation must be prevented.

It MUST be either a non-empty string or `null`.

When an externally retriable command or operation can generate an event, the producer SHOULD set an idempotency key.

A producer MUST use a stable key across retries of the same logical operation.

The same idempotency key MUST NOT be reused for different logical operations within the same tenant, producer service, and applicable operation scope.

A consumer MUST NOT treat the idempotency key as a replacement for `event_id`.

A broker retry MUST preserve the original idempotency key.

## 18. Canonical event example

The following example illustrates the complete envelope. The event-specific payload is illustrative and is defined by the domain sections below.

    {
        "event_id": "4c99a9e1-7d1b-4df8-a48f-39c1a2d7110b",
        "event_type": "job.queued",
        "schema_version": "1.0.0",
        "occurred_at": "2026-10-09T06:45:12.347Z",
        "published_at": "2026-10-09T06:45:12.381Z",
        "producer": {
            "service": "control-plane",
            "instance_id": "cp-02",
            "environment": "staging"
        },
        "tenant_id": "tenant-001",
        "aggregate": {
            "type": "job",
            "id": "job-000123",
            "version": 3
        },
        "correlation_id": "workflow-9f2c",
        "causation_id": "command-2a61",
        "trace_id": "7a6b8c9d0e1f23456789abcdef012345",
        "idempotency_key": "submit-job-tenant-001-abc",
        "payload": {
            "job_id": "job-000123",
            "status": "QUEUED",
            "priority": 5,
            "submitted_at": "2026-10-09T06:45:12.347Z"
        }
    }

The example MUST NOT be interpreted as requiring a specific internal database schema.

## 19. Common payload conventions

Payload fields MUST use `snake_case`.

Domain identifiers MUST be strings.

Timestamps MUST use the timestamp rules in Section 12.

Enumerated fields MUST use the exact uppercase or lowercase values specified by the relevant schema.

An enum value not listed by the schema MUST be treated as unsupported.

A producer MUST NOT encode a boolean as a string or an integer.

A producer MUST NOT encode a numeric quantity as a string unless the field explicitly defines a decimal string representation.

Payloads MUST NOT contain the entire current state of an entity unless the event is explicitly defined as a snapshot event.

A state-transition event SHOULD contain the new state and the minimum additional information needed to understand the transition.

Consumers SHOULD fetch authoritative current state when they need data not guaranteed by the event contract.

## 20. Artifact domain

The `artifact` domain reports artifact registration, validation, availability, and lifecycle changes.

Artifact events MUST identify the artifact using `artifact_id`.

The event aggregate type MUST be `artifact`, and the aggregate ID MUST equal `payload.artifact_id`.

### 20.1 Supported artifact event types

| Event type | Meaning |
|---|---|
| `artifact.created` | Artifact metadata was registered |
| `artifact.validated` | Artifact validation completed successfully |
| `artifact.validation_failed` | Artifact validation completed unsuccessfully |
| `artifact.published` | Artifact became available for authorized use |
| `artifact.deprecated` | Artifact was marked as deprecated |
| `artifact.deleted` | Artifact was deleted or made unavailable under the applicable retention policy |

### 20.2 Common artifact payload

Artifact payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `artifact_id` | string | REQUIRED |
| `artifact_type` | string | REQUIRED |
| `name` | string | REQUIRED |
| `version` | string | REQUIRED |
| `status` | string | REQUIRED |

`artifact_type` MUST identify the artifact category defined by the artifact registry.

`version` MUST identify the artifact's immutable version or revision.

`status` MUST be one of `REGISTERED`, `VALIDATING`, `VALIDATED`, `PUBLISHED`, `DEPRECATED`, `FAILED`, or `DELETED`.

### 20.3 Artifact creation payload

`artifact.created` MUST include the common artifact payload and MUST include `created_by`.

`created_by` MUST be a non-empty user or service principal identifier.

Example:

    {
        "artifact_id": "artifact-001",
        "artifact_type": "robot_application",
        "name": "pick-and-place",
        "version": "1.2.0",
        "status": "REGISTERED",
        "created_by": "user-1042"
    }

### 20.4 Artifact validation payload

`artifact.validated` MUST include `validation_id` and `validated_at`.

`validation_id` MUST identify the validation operation.

`validated_at` MUST be a UTC RFC 3339 timestamp.

The successful validation event MUST NOT imply that the artifact has been published unless publication is separately defined by the artifact lifecycle contract.

`artifact.validation_failed` MUST include `validation_id`, `failure_code`, and `failure_summary`.

`failure_code` MUST be a stable machine-readable code.

`failure_summary` MUST NOT contain credentials, private keys, or unnecessary personal data.

### 20.5 Artifact publication payload

`artifact.published` MUST include `published_artifact_ref`.

`published_artifact_ref` MUST identify the immutable artifact version or content-addressed reference defined by the artifact manifest contract.

A consumer MUST NOT assume that an artifact is downloadable solely because it received an `artifact.created` event.

Artifact download authorization MUST be evaluated independently of event visibility.

### 20.6 Artifact deprecation and deletion

`artifact.deprecated` MUST include `reason_code`.

`artifact.deleted` MUST include `deletion_mode`, whose value MUST be `LOGICAL` or `PHYSICAL`.

Deletion events MUST NOT disclose private storage locations or sensitive deletion credentials.

If the artifact remains subject to legal, audit, or execution retention requirements, the producer MUST describe the effective availability accurately.

## 21. Booking domain

The `booking` domain reports resource reservation and booking lifecycle facts.

The event aggregate type MUST be `booking`, and the aggregate ID MUST equal `payload.booking_id`.

### 21.1 Supported booking event types

| Event type | Meaning |
|---|---|
| `booking.requested` | A booking request was accepted for processing |
| `booking.held` | A temporary resource hold was established |
| `booking.confirmed` | A booking was confirmed |
| `booking.rejected` | A booking request was rejected |
| `booking.cancelled` | A booking was cancelled |
| `booking.expired` | A booking or hold expired |
| `booking.rescheduled` | A confirmed booking was moved to a new interval |

### 21.2 Common booking payload

Booking payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `booking_id` | string | REQUIRED |
| `resource_id` | string | REQUIRED |
| `status` | string | REQUIRED |
| `starts_at` | string | REQUIRED |
| `ends_at` | string | REQUIRED |

`status` MUST be one of `REQUESTED`, `HELD`, `CONFIRMED`, `REJECTED`, `CANCELLED`, or `EXPIRED`.

`starts_at` and `ends_at` MUST be UTC RFC 3339 timestamps.

`ends_at` MUST be later than `starts_at`.

### 21.3 Booking request and hold

`booking.requested` MUST include `requested_by`.

`booking.held` MUST include `hold_expires_at`.

`requested_by` MUST identify the authorized user or service principal requesting the booking.

`hold_expires_at` MUST be a UTC RFC 3339 timestamp later than the event's effective hold time.

A hold MUST NOT be represented as a confirmed booking.

### 21.4 Booking confirmation

`booking.confirmed` MUST include `confirmed_at`.

`confirmed_at` MUST be a UTC RFC 3339 timestamp.

If a booking consumes credits, `booking.confirmed` MAY include `credit_reservation_id`.

A booking confirmation MUST NOT imply that a robot has started execution.

### 21.5 Booking rejection and cancellation

`booking.rejected` MUST include `reason_code`.

`booking.cancelled` MUST include `cancelled_at` and `reason_code`.

`reason_code` MUST be a stable machine-readable code.

A cancellation event MUST describe the booking cancellation, not claim that an associated running job has already stopped unless the execution state confirms that outcome.

### 21.6 Booking expiration and rescheduling

`booking.expired` MUST include `expired_at`.

`booking.rescheduled` MUST include `previous_starts_at`, `previous_ends_at`, `starts_at`, and `ends_at`.

All rescheduling timestamps MUST be valid UTC RFC 3339 values.

A rescheduling event MUST identify the same booking aggregate and MUST increment its aggregate version.

## 22. Credit domain

The `credit` domain reports credit reservations, releases, consumption, grants, and adjustments.

Credit events affect financial or quota-related accounting and therefore require stronger integrity controls.

The event aggregate type MUST be `credit_account`, and the aggregate ID MUST equal `payload.credit_account_id`.

### 22.1 Supported credit event types

| Event type | Meaning |
|---|---|
| `credit.granted` | Credits were granted to an account |
| `credit.reserved` | Credits were reserved for an operation |
| `credit.released` | A prior reservation was released |
| `credit.consumed` | Reserved credits were consumed |
| `credit.adjusted` | An authorized accounting adjustment was committed |
| `credit.refunded` | Previously consumed credits were refunded under policy |

### 22.2 Common credit payload

Credit payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `credit_account_id` | string | REQUIRED |
| `transaction_id` | string | REQUIRED |
| `quantity` | integer | REQUIRED |
| `unit` | string | REQUIRED |
| `balance_after` | integer | REQUIRED |
| `reason_code` | string | REQUIRED |

`quantity` MUST be greater than zero.

`balance_after` MUST be zero or greater unless the account policy explicitly permits a negative balance.

`unit` MUST identify the credit unit defined by the platform accounting contract.

A producer MUST NOT use floating-point values for credit quantity or balance.

### 22.3 Credit grants and reservations

`credit.granted` MUST include `granted_by`.

`credit.reserved` MUST include `reservation_id` and `reservation_expires_at`.

`reservation_expires_at` MUST be a UTC RFC 3339 timestamp.

`reservation_id` MUST be unique within the applicable credit accounting scope.

A reservation MUST NOT be counted as consumed credit.

### 22.4 Credit release and consumption

`credit.released` MUST include `reservation_id`.

`credit.consumed` MUST include `reservation_id` and `consumed_at`.

`consumed_at` MUST be a UTC RFC 3339 timestamp.

A reservation MUST NOT be consumed more than once.

A duplicate delivery of `credit.consumed` MUST NOT result in duplicate accounting.

A producer MUST ensure that balance updates and the corresponding accounting event are committed consistently, using a transactional outbox or an equivalent atomic publication mechanism.

### 22.5 Adjustments and refunds

`credit.adjusted` MUST include `adjustment_id` and `adjusted_by`.

`credit.refunded` MUST include `refund_id` and `original_transaction_id`.

A refund MUST reference the transaction whose value is being refunded.

A producer MUST NOT publish an adjustment or refund event before the accounting change is durably committed.

Credit events MUST be retained according to the financial audit policy, even when ordinary operational events have expired.

## 23. Job domain

The `job` domain reports the lifecycle of a submitted unit of work.

The event aggregate type MUST be `job`, and the aggregate ID MUST equal `payload.job_id`.

### 23.1 Supported job event types

| Event type | Meaning |
|---|---|
| `job.submitted` | A job submission was accepted |
| `job.queued` | A job entered the scheduling queue |
| `job.scheduled` | A scheduling decision assigned a target execution resource |
| `job.rejected` | A job was rejected |
| `job.cancel_requested` | Cancellation was requested |
| `job.cancelled` | The job reached its cancelled state |
| `job.failed` | The job failed before or outside a run outcome |
| `job.completed` | The job lifecycle completed successfully |
| `job.priority_changed` | The effective scheduling priority changed |

### 23.2 Common job payload

Job payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `job_id` | string | REQUIRED |
| `status` | string | REQUIRED |
| `job_type` | string | REQUIRED |
| `priority` | integer | REQUIRED |
| `submitted_at` | string | REQUIRED |

`status` MUST be one of `SUBMITTED`, `QUEUED`, `SCHEDULED`, `RUNNING`, `CANCEL_REQUESTED`, `CANCELLED`, `FAILED`, or `COMPLETED`.

`priority` MUST be an integer in the configured platform priority range.

`submitted_at` MUST be a UTC RFC 3339 timestamp.

### 23.3 Job submission and scheduling

`job.submitted` MUST include `submitted_by`.

`job.queued` MUST include `queued_at`.

`job.scheduled` MUST include `scheduled_at` and `resource_id`.

All event-specific timestamps MUST be valid UTC RFC 3339 values.

A scheduling event MUST identify the resource assignment made by the scheduler, not imply that the run has started.

### 23.4 Job rejection and cancellation

`job.rejected` MUST include `reason_code`.

`job.cancel_requested` MUST include `requested_at` and `requested_by`.

`job.cancelled` MUST include `cancelled_at`.

`job.failed` MUST include `failure_code` and `failed_at`.

A cancellation request MUST NOT be treated as confirmation of cancellation.

The `job.cancelled` event MUST be published only after the authoritative job state records cancellation.

### 23.5 Job completion and priority changes

`job.completed` MUST include `completed_at`.

`job.priority_changed` MUST include `previous_priority`, `priority`, and `changed_at`.

The new priority MUST be within the configured platform priority range.

A job may produce multiple run attempts. Job completion MUST NOT be used as a substitute for run-level status or result publication.

## 24. Run domain

The `run` domain reports an individual execution attempt.

A run is distinct from a job. A job MAY have multiple runs when retries or explicit reruns are supported.

The event aggregate type MUST be `run`, and the aggregate ID MUST equal `payload.run_id`.

### 24.1 Supported run event types

| Event type | Meaning |
|---|---|
| `run.created` | An execution attempt was created |
| `run.queued` | An execution attempt entered the run queue |
| `run.dispatched` | An execution attempt was assigned for execution |
| `run.started` | Execution began |
| `run.paused` | Execution entered a paused state |
| `run.resumed` | Execution resumed |
| `run.stop_requested` | A stop was requested |
| `run.stopped` | Execution reached a stopped state |
| `run.completed` | Execution completed successfully |
| `run.failed` | Execution failed |
| `run.timed_out` | Execution exceeded its permitted duration |
| `run.lost` | The platform could no longer confirm the execution state |

### 24.2 Common run payload

Run payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `run_id` | string | REQUIRED |
| `job_id` | string | REQUIRED |
| `attempt` | integer | REQUIRED |
| `status` | string | REQUIRED |
| `resource_id` | string or null | REQUIRED |
| `created_at` | string | REQUIRED |

`attempt` MUST be a positive integer.

`resource_id` MUST be either a non-empty string or `null`.

`created_at` MUST be a UTC RFC 3339 timestamp.

`status` MUST be one of `CREATED`, `QUEUED`, `DISPATCHED`, `RUNNING`, `PAUSED`, `STOP_REQUESTED`, `STOPPED`, `COMPLETED`, `FAILED`, `TIMED_OUT`, or `LOST`.

### 24.3 Run creation and dispatch

`run.created` MUST include `created_by`.

`run.dispatched` MUST include `dispatched_at` and a non-null `resource_id`.

A dispatch event MUST identify the execution target selected by the platform.

The event MUST NOT claim that the target has begun execution.

### 24.4 Run start, pause, and resume

`run.started` MUST include `started_at`.

`run.paused` MUST include `paused_at` and `reason_code`.

`run.resumed` MUST include `resumed_at`.

All timestamps MUST be UTC RFC 3339 timestamps.

A consumer MUST treat run state as a state machine rather than infer transitions from arrival order alone.

### 24.5 Run stop and terminal outcomes

`run.stop_requested` MUST include `requested_at` and `requested_by`.

`run.stopped` MUST include `stopped_at`.

`run.completed` MUST include `completed_at`.

`run.failed` MUST include `failed_at` and `failure_code`.

`run.timed_out` MUST include `timed_out_at` and `timeout_seconds`.

`timeout_seconds` MUST be a positive integer.

`run.lost` MUST include `detected_at` and `reason_code`.

A `run.lost` event indicates that the platform cannot currently confirm execution state. It MUST NOT be interpreted as proof that physical motion or external side effects have stopped.

A late-arriving authoritative status observation MAY resolve a lost state through an explicitly documented recovery transition.

## 25. Result domain

The `result` domain reports execution outputs and their availability.

The event aggregate type MUST be `result`, and the aggregate ID MUST equal `payload.result_id`.

### 25.1 Supported result event types

| Event type | Meaning |
|---|---|
| `result.created` | A result record was created |
| `result.validated` | Result integrity and required metadata were validated |
| `result.published` | A result became available for authorized consumption |
| `result.validation_failed` | Result validation failed |
| `result.expired` | Result availability expired under policy |
| `result.deleted` | Result data was deleted or made unavailable |

### 25.2 Common result payload

Result payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `result_id` | string | REQUIRED |
| `job_id` | string | REQUIRED |
| `run_id` | string | REQUIRED |
| `status` | string | REQUIRED |
| `created_at` | string | REQUIRED |

`status` MUST be one of `CREATED`, `VALIDATED`, `PUBLISHED`, `FAILED`, `EXPIRED`, or `DELETED`.

`created_at` MUST be a UTC RFC 3339 timestamp.

### 25.3 Result validation and publication

`result.validated` MUST include `validation_id` and `validated_at`.

`result.validation_failed` MUST include `validation_id`, `failure_code`, and `failure_summary`.

`result.published` MUST include `published_at` and `manifest_ref`.

`manifest_ref` MUST identify the result manifest using the artifact or result storage contract applicable to the deployment.

A consumer MUST NOT assume that result data is publicly accessible because a result event is visible.

Result retrieval MUST apply tenant and resource authorization.

### 25.4 Result expiration and deletion

`result.expired` MUST include `expired_at` and `retention_policy_id`.

`result.deleted` MUST include `deleted_at` and `deletion_mode`.

`deletion_mode` MUST be `LOGICAL` or `PHYSICAL`.

A result deletion event MUST NOT expose sensitive storage credentials or private infrastructure details.

## 26. Lab domain

The `lab` domain reports Lab Agent registration, availability, capability, and health observations.

The event aggregate type MUST be `lab`, and the aggregate ID MUST equal `payload.lab_id`.

### 26.1 Supported lab event types

| Event type | Meaning |
|---|---|
| `lab.registered` | A Lab Agent registered successfully |
| `lab.heartbeat_received` | A valid heartbeat was received |
| `lab.capabilities_updated` | Reported capabilities changed |
| `lab.health_changed` | The reported health state changed |
| `lab.disconnected` | Connectivity was lost or closed |
| `lab.reconnected` | Connectivity was restored |
| `lab.deregistered` | The Lab Agent was removed from active service |

### 26.2 Common lab payload

Lab payloads MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `lab_id` | string | REQUIRED |
| `agent_id` | string | REQUIRED |
| `status` | string | REQUIRED |
| `observed_at` | string | REQUIRED |

`status` MUST be one of `REGISTERED`, `ONLINE`, `DEGRADED`, `OFFLINE`, or `DEREGISTERED`.

`observed_at` MUST be a UTC RFC 3339 timestamp.

### 26.3 Registration and heartbeat

`lab.registered` MUST include `registered_at` and `agent_version`.

`lab.heartbeat_received` MUST include `heartbeat_id` and `heartbeat_at`.

`heartbeat_id` MUST identify the heartbeat observation.

`heartbeat_at` MUST be a UTC RFC 3339 timestamp.

A heartbeat event reports receipt of a heartbeat. It MUST NOT be treated as proof that every attached device is healthy or that a robot is safe to operate.

### 26.4 Capability and health updates

`lab.capabilities_updated` MUST include `capability_revision` and `capabilities`.

`capability_revision` MUST be a positive integer.

`capabilities` MUST be an array of documented capability identifiers.

A producer MUST NOT publish secrets or private configuration values in capability data.

`lab.health_changed` MUST include `previous_health`, `health`, and `observed_at`.

`health` and `previous_health` MUST use the health values defined by the applicable platform contract.

### 26.5 Connectivity lifecycle

`lab.disconnected` MUST include `detected_at` and `reason_code`.

`lab.reconnected` MUST include `reconnected_at`.

`lab.deregistered` MUST include `deregistered_at` and `reason_code`.

Connectivity events MUST be interpreted with their timestamps and aggregate versions. A consumer MUST NOT assume that a delayed disconnect event describes the current connection state.

## 27. Telemetry domain

The `telemetry` domain reports measurements and observations from platform services, Lab Agents, simulated devices, or connected hardware.

Telemetry payloads may be high volume. Implementations MUST apply explicit limits and access controls.

The event aggregate type MUST be `lab`, `run`, `resource`, or another registered telemetry source type, and the aggregate ID MUST identify the source represented by the event.

### 27.1 Supported telemetry event types

| Event type | Meaning |
|---|---|
| `telemetry.sample_received` | A measurement sample was received |
| `telemetry.batch_received` | A batch of measurement samples was received |
| `telemetry.threshold_crossed` | A configured threshold was crossed |
| `telemetry.stream_started` | A telemetry stream started |
| `telemetry.stream_stopped` | A telemetry stream stopped |

### 27.2 Sample payload

`telemetry.sample_received` MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `source_id` | string | REQUIRED |
| `metric` | string | REQUIRED |
| `value` | number | REQUIRED |
| `unit` | string | REQUIRED |
| `sampled_at` | string | REQUIRED |
| `quality` | string | REQUIRED |

`value` MUST be finite.

`sampled_at` MUST be a UTC RFC 3339 timestamp.

`quality` MUST be one of `VALID`, `ESTIMATED`, `DEGRADED`, or `INVALID`.

The unit MUST be defined by the metric's registered measurement contract.

A producer MUST NOT silently change the meaning or unit of a metric while keeping the same metric identifier.

### 27.3 Batch payload

`telemetry.batch_received` MUST include `source_id`, `batch_id`, `sample_count`, and `samples`.

`batch_id` MUST uniquely identify the batch within the producer's applicable scope.

`sample_count` MUST be a positive integer equal to the number of entries in `samples`.

Each sample MUST satisfy the sample field requirements in Section 27.2.

A batch MUST NOT exceed the deployment's configured maximum event size or sample count.

If a batch exceeds a limit, the producer MUST split it into smaller batches or reject it with a documented error.

### 27.4 Threshold events

`telemetry.threshold_crossed` MUST include `source_id`, `metric`, `threshold`, `observed_value`, `direction`, and `observed_at`.

`threshold` and `observed_value` MUST be finite numbers.

`direction` MUST be `ABOVE` or `BELOW`.

Threshold events MUST NOT be interpreted as safety authorization or as a substitute for a hardware-level safety interlock.

### 27.5 Stream lifecycle

`telemetry.stream_started` MUST include `stream_id` and `started_at`.

`telemetry.stream_stopped` MUST include `stream_id`, `stopped_at`, and `reason_code`.

Stream lifecycle events MUST use stable stream identifiers.

A consumer MUST be able to distinguish the lifecycle of a stream from the delivery lifecycle of an individual telemetry event.

## 28. System domain

The `system` domain reports platform-level service and operational conditions.

The event aggregate type MUST be `service`, `deployment`, or another registered system aggregate type.

The aggregate ID MUST identify the relevant system entity.

### 28.1 Supported system event types

| Event type | Meaning |
|---|---|
| `system.service_started` | A service started |
| `system.service_stopped` | A service stopped |
| `system.service_degraded` | A service entered a degraded state |
| `system.service_recovered` | A service recovered from a degraded state |
| `system.deployment_started` | A deployment began |
| `system.deployment_completed` | A deployment completed |
| `system.deployment_failed` | A deployment failed |
| `system.configuration_changed` | An authorized configuration change was applied |
| `system.security_event_detected` | A security-relevant event was detected |

### 28.2 Service lifecycle payload

Service lifecycle payloads MUST contain `service_name`, `status`, and `observed_at`.

`status` MUST be one of `STARTING`, `RUNNING`, `DEGRADED`, `STOPPING`, `STOPPED`, or `FAILED`.

`observed_at` MUST be a UTC RFC 3339 timestamp.

`system.service_degraded` MUST include `reason_code` and `severity`.

`system.service_recovered` MUST include `recovered_at`.

`severity` MUST be one of `INFO`, `WARNING`, `ERROR`, or `CRITICAL`.

### 28.3 Deployment payload

Deployment lifecycle payloads MUST contain `deployment_id`, `service_name`, and `version`.

`system.deployment_started` MUST include `started_at`.

`system.deployment_completed` MUST include `completed_at`.

`system.deployment_failed` MUST include `failed_at` and `failure_code`.

A deployment event MUST NOT expose credentials, private image pull secrets, or sensitive infrastructure configuration.

### 28.4 Configuration changes

`system.configuration_changed` MUST include `configuration_revision`, `changed_at`, and `changed_by`.

`configuration_revision` MUST be a positive integer.

The payload SHOULD identify the configuration category and a redacted summary of changed keys.

The event MUST NOT include secret values or full sensitive configuration documents.

### 28.5 Security events

`system.security_event_detected` MUST include `security_event_id`, `category`, `severity`, and `detected_at`.

`category` MUST be a stable machine-readable security event category.

The payload MUST contain only the minimum data required for authorized investigation.

Consumers MUST NOT expose security-event details to ordinary tenant users unless the access policy explicitly permits it.

## 29. Required fields by event type

The domain sections define shared payload fields and event-specific fields. The following rules apply to all event types.

A payload MUST include every field explicitly marked REQUIRED for the selected event type.

Fields required by the common domain payload MUST remain required unless a later compatible schema version explicitly relaxes the requirement.

Fields defined only for a particular event type MUST NOT be assumed present on another event type in the same domain.

A consumer MUST validate `event_type` before validating the event-specific payload schema.

A producer MUST NOT publish an event whose `event_type` and payload schema disagree.

An event that does not conform to its schema MUST be rejected before publication or quarantined before consumer side effects occur.

## 30. Event size and collection limits

The canonical event size limit MUST be configurable by deployment.

The baseline recommended maximum serialized event size is 256 KiB.

A deployment MAY set a lower limit when required by transport constraints.

Events larger than the configured limit MUST NOT be silently truncated.

Producers SHOULD store large artifacts, logs, result bundles, and telemetry datasets outside the event payload and publish authorized immutable references.

Array lengths MUST be bounded by the schema or deployment policy.

A producer MUST NOT publish an unbounded array in a single event.

If a payload exceeds a configured limit, the producer MUST either split the data into contract-compliant events or reject publication with a stable error code.

Consumers MUST validate payload size before expensive parsing or downstream processing.

## 31. Event immutability

Once an event is durably accepted, its canonical envelope and payload MUST be immutable.

A correction MUST be represented by a new event that identifies the corrected entity and, where appropriate, references the earlier event.

A producer MUST NOT edit an already published event in place.

A broker MUST NOT mutate the canonical payload during retries or replay.

A consumer MAY maintain a materialized view derived from events, but that view is not the canonical event record.

A consumer MUST be able to rebuild a view from retained events when replay access is permitted and all required event schemas remain available.

## 32. Publication atomicity

For state-changing domain operations, the authoritative state change and event record SHOULD be committed atomically.

A producer SHOULD implement the transactional outbox pattern or an equivalent mechanism.

If atomic storage and publication are not available, the producer MUST document its recovery mechanism and MUST prevent silent loss of committed domain events.

A producer MUST NOT publish a success event before the corresponding domain state is committed.

A producer MUST NOT report successful publication if the event was only placed in volatile memory and is not recoverable under the deployment's durability contract.

The event ingestion service MUST validate authorization, schema, size, and event identity before accepting an event.

## 33. Delivery guarantees

The platform event delivery model is at-least-once for durable events unless a specific transport or subscription contract explicitly states otherwise.

Producers MUST assume that publication attempts can be retried.

Consumers MUST assume that an event can be delivered more than once.

The platform MUST NOT claim exactly-once end-to-end business processing solely because a broker provides exactly-once features.

A consumer that performs side effects MUST make the side effect and its deduplication record atomic where feasible.

For example, a consumer updating a database projection SHOULD store the processed event ID in the same transaction as the projection update.

A consumer MUST acknowledge successful processing only after the processing result and deduplication state are durable.

## 34. Event ordering

The platform MUST NOT promise a global total order across all events.

Ordering guarantees are scoped to the producer and aggregate.

For state-changing events belonging to the same aggregate, producers SHOULD publish events in aggregate-version order.

When a broker supports partitioning, the aggregate ID SHOULD be used as the partition key.

Consumers MUST use aggregate versions to detect missing or stale transitions where aggregate-version semantics apply.

If a consumer receives a higher aggregate version before a lower one, it MUST follow one of these policies:

- Buffer the later event while waiting for the gap to be filled.
- Fetch authoritative aggregate state and reconcile.
- Record the gap and continue only when the event type permits out-of-order processing.

The selected policy MUST be documented per consumer.

Consumers MUST NOT reorder events from different aggregates based solely on `occurred_at`.

Telemetry samples MAY arrive out of sample-time order. Consumers MUST use `sampled_at` when analyzing sample chronology.

## 35. Duplicate delivery and deduplication

Consumers MUST implement deduplication for durable domain events.

The primary deduplication key MUST be `event_id`, scoped at minimum by tenant.

A consumer MUST NOT apply the same event's domain side effect twice.

A consumer MAY use `aggregate.id`, `aggregate.version`, and `event_type` as additional consistency checks, but MUST NOT replace event identity with an assumed composite key.

If the same `event_id` is received with different canonical content, the consumer MUST treat it as an integrity violation.

The consumer MUST quarantine or reject the conflicting event, emit an operational alert, and MUST NOT apply its side effects.

A duplicate with identical content MAY be acknowledged without repeating side effects.

Deduplication records MUST be retained for at least the maximum supported replay horizon of the consumer or until the consumer can prove that the event cannot be delivered again.

## 36. Idempotent producer behavior

A producer MUST define the operation boundary for each idempotency key it accepts.

Repeated requests with the same idempotency key and equivalent request content MUST resolve to the same logical operation outcome.

Repeated requests with the same idempotency key but conflicting request content MUST be rejected with a stable conflict error.

Where a producer creates an event from an idempotent operation, it MUST preserve the same event ID for retries of that operation.

A producer MUST NOT create a second credit consumption, booking confirmation, or execution-start event solely because a request was retried.

Idempotency records MUST be retained for at least the operation's documented retry and recovery horizon.

## 37. Consumer processing transaction

A durable consumer SHOULD process each event using the following logical sequence:

1. Validate the envelope and event-specific schema.
2. Validate tenant and authorization context.
3. Check whether the event ID has already been processed.
4. Validate aggregate version and transition preconditions.
5. Apply the domain side effect or projection update.
6. Persist the deduplication record and processing outcome.
7. Acknowledge the event.

When the consumer cannot make steps 5 and 6 atomic, it MUST use an equivalent recovery strategy that prevents duplicate business effects.

If processing fails transiently, the consumer SHOULD retry with bounded exponential backoff and jitter.

If processing fails permanently, the consumer MUST route the event to a dead-letter or quarantine mechanism where supported, record a stable failure reason, and alert according to operational policy.

A consumer MUST NOT silently discard a durable event that it is contractually responsible for processing.

## 38. Retry and backoff

Retries MUST be bounded by an explicit policy.

A retry policy MUST define at least:

- The retryable error classes.
- The maximum retry duration or attempt count.
- The backoff algorithm.
- The behavior after exhaustion.
- The alerting or escalation behavior.

Schema violations, authorization failures, and integrity conflicts MUST NOT be retried indefinitely as transient errors.

Transient broker or network errors SHOULD use exponential backoff with jitter.

A consumer MUST avoid retry storms by applying concurrency limits and backpressure.

A producer MUST NOT publish a new logical event for every transport retry.

## 39. Replay and cursor semantics

Replay allows a consumer to recover missed events or rebuild a projection from retained event history.

A replay request MUST be scoped by tenant, authorized event types, and a supported time or cursor range.

A replay cursor MUST be opaque to the consumer unless the applicable transport contract explicitly defines its structure.

A cursor MUST be bound to the event stream and relevant tenant or authorization scope.

A consumer MUST NOT reuse a cursor across unrelated tenants or subscriptions.

Replay MUST preserve the original `event_id`, `event_type`, `schema_version`, `occurred_at`, `published_at`, `aggregate`, and `payload`.

A replay service MAY attach transport-specific delivery metadata outside the canonical event.

A replay service MUST NOT rewrite the original event to reflect current aggregate state.

If the requested cursor is outside the available retention range, the service MUST return a stable `REPLAY_WINDOW_EXPIRED` error and identify the earliest available cursor or timestamp when authorized.

If a consumer rebuilds a projection, it SHOULD record the replay checkpoint only after all events preceding that checkpoint have been durably processed.

## 40. Retention policy

Event retention MUST be defined by event domain, tenant policy, compliance obligations, and operational needs.

A deployment MUST publish its retention policy to administrators and relevant consumers.

The baseline policy SHOULD distinguish:

- High-volume telemetry events.
- Operational lifecycle events.
- Credit and financial audit events.
- Security events.
- Events required for execution reconstruction or result provenance.

Telemetry may use a shorter retention period than financial audit records, provided consumers are informed of the limit.

Credit and security events MUST follow applicable audit and compliance retention requirements.

Retention expiry MUST NOT be disguised as successful replay.

When events are removed from the replay store, the system MUST preserve any required audit evidence or immutable accounting record through the appropriate authoritative mechanism.

A retention policy change MUST be documented and MUST NOT retroactively imply that expired events remain replayable.

## 41. Subscription filtering

Subscriptions MAY filter by domain, event type, aggregate type, aggregate ID, or authorized tenant scope.

A filter MUST be validated against the subscription contract.

A subscription MUST NOT be allowed to widen its own authorization scope by changing a filter.

Unknown event types MUST NOT be delivered to a consumer unless the subscription explicitly allows unknown types and the consumer is prepared to handle them.

A subscription MUST define its behavior for schema versions outside the consumer's supported range.

A consumer MUST NOT rely on client-side filtering as a tenant-isolation control.

## 42. Backpressure and slow consumers

A delivery service MUST define limits for pending messages, unacknowledged events, and replay throughput.

A slow consumer MUST NOT be allowed to exhaust shared broker resources without bound.

When a consumer exceeds configured limits, the service MAY pause delivery, reduce throughput, disconnect the consumer, or require replay from a durable cursor.

A delivery service MUST communicate a stable reason when it rejects, pauses, or terminates delivery.

A consumer MUST process acknowledgements and replay checkpoints according to the applicable transport contract.

High-volume telemetry SHOULD be isolated from critical control and accounting event delivery so that telemetry pressure cannot indefinitely block essential domain events.

## 43. Error model

Event producers, brokers, and consumers MUST use stable machine-readable error codes.

An error response SHOULD contain:

| Field | Type | Requirement |
|---|---|---|
| `code` | string | REQUIRED |
| `message` | string | REQUIRED |
| `retryable` | boolean | REQUIRED |
| `correlation_id` | string or null | REQUIRED |

The error response MUST NOT include secrets, access tokens, or sensitive internal stack traces.

The `message` field SHOULD be suitable for operational diagnosis and MUST NOT be the only machine-readable error indicator.

### 43.1 Required error codes

| Code | Meaning | Retry guidance |
|---|---|---|
| `INVALID_EVENT_ENVELOPE` | Common envelope is malformed | No |
| `INVALID_EVENT_SCHEMA` | Payload does not match the declared schema | No |
| `UNSUPPORTED_SCHEMA_VERSION` | Schema version is unsupported | No, until compatibility changes |
| `UNKNOWN_EVENT_TYPE` | Event type is not registered or permitted | No |
| `UNAUTHORIZED_PRODUCER` | Producer is not authorized to publish | No |
| `TENANT_SCOPE_VIOLATION` | Event crosses an unauthorized tenant boundary | No |
| `EVENT_ID_CONFLICT` | Same event ID has conflicting content | No; security or integrity review |
| `IDEMPOTENCY_CONFLICT` | Idempotency key was reused with conflicting input | No |
| `AGGREGATE_VERSION_GAP` | Required aggregate version is missing | Usually after reconciliation |
| `REPLAY_WINDOW_EXPIRED` | Requested history is no longer retained | No |
| `EVENT_TOO_LARGE` | Event exceeds configured size limits | No, unless payload is reduced |
| `RATE_LIMITED` | Producer or consumer exceeded an enforced rate | Yes, after backoff |
| `TEMPORARY_UNAVAILABLE` | A transient dependency is unavailable | Yes |
| `INTERNAL_EVENT_ERROR` | An unexpected event-processing failure occurred | Policy-dependent |

An implementation MAY define additional error codes under a documented namespace.

## 44. Error handling requirements

A producer MUST reject an invalid event before durable publication.

A consumer MUST validate an event before performing domain side effects.

An event that fails schema validation MUST NOT be silently coerced into a valid event.

A transient delivery failure SHOULD be retried according to the retry policy.

A permanent validation or authorization failure MUST be recorded with the event identity and stable failure code.

If the event cannot be safely processed, the consumer MUST quarantine it or route it to a dead-letter mechanism where supported.

Quarantine records MUST be access-controlled and MUST preserve enough information for diagnosis without unnecessarily duplicating sensitive payload data.

An event-processing error MUST NOT be represented as a successful domain event.

## 45. Versioning policy

The event protocol uses independent schema versions per event type.

A schema registry or equivalent authoritative catalogue MUST map each event type and version to its canonical schema.

Producers MUST publish only versions supported by the deployment policy.

Consumers MUST declare the versions they support or provide an equivalent capability declaration.

Schema version changes MUST follow these rules:

- PATCH changes MUST preserve the interpretation of every previously valid event.
- MINOR changes MAY add optional fields or relax constraints without changing existing field meanings.
- MAJOR changes MUST be used for incompatible field changes, incompatible enum changes, or changed event semantics.

Removing a required field, changing a field's type, changing an enum's meaning, or redefining an event's semantics MUST be treated as a breaking change.

A producer MUST NOT introduce a new required field in a MINOR version unless every consumer in the declared compatibility set can safely operate without it and the schema explicitly defines the fallback behavior.

A breaking event contract MUST use a documented migration plan.

## 46. Compatibility rules

A consumer MUST tolerate unknown optional fields only when the schema's extension policy permits them.

A consumer MUST NOT silently ignore an unknown required semantic condition.

A consumer MUST reject an unsupported major schema version or route it to a compatibility handler.

A consumer MAY support multiple schema versions concurrently.

During migration, producers SHOULD support the documented overlap period for old and new consumers.

A producer MUST NOT change the meaning of an existing event type without a major contract change.

A new enum value can be breaking for exhaustive consumers. Adding enum values MUST be reviewed as a compatibility change and MUST be introduced only when consumers can safely handle unknown values or a coordinated version transition is in place.

A consumer SHOULD implement a safe fallback for unknown non-critical enum values only where the schema explicitly permits that behavior.

## 47. Unknown event types

A consumer receiving an unknown event type MUST NOT apply domain side effects based on guesses about the event's meaning.

If the subscription permits unknown types, the consumer MAY store or forward the event as opaque data.

The consumer MUST preserve the original event bytes or canonical JSON content when opaque forwarding is required.

If unknown event types are not permitted, the consumer MUST reject or quarantine the event and record `UNKNOWN_EVENT_TYPE`.

An unknown event type MUST NOT be silently relabeled as a known event.

## 48. Unknown fields

For schema version 1.0, producers MUST emit only documented fields.

Consumers MAY accept unknown optional fields if the schema registry marks the relevant object as extensible.

Consumers MUST NOT assume that arbitrary additional fields are safe to expose to end users.

Unknown fields MUST NOT override recognized fields.

If an unknown field conflicts with a known field or violates an integrity rule, the consumer MUST reject or quarantine the event.

A consumer performing a read-modify-write operation MUST preserve unknown fields only if the applicable schema and security policy require preservation and the consumer can do so without changing their meaning.

## 49. Schema registry requirements

The platform MUST maintain an authoritative registry of supported event types and schema versions.

For each event type, the registry MUST define:

- Event name and semantic meaning.
- Domain and aggregate type.
- Canonical schema.
- Required and optional payload fields.
- Field types, constraints, and enum values.
- Compatibility classification.
- Producer authorization requirements.
- Retention classification.
- Replay eligibility.
- Deprecation status.
- Conformance examples and negative examples.

The registry MUST NOT expose sensitive implementation details or secrets.

Schema changes MUST be reviewed before being accepted for publication in a production deployment.

A producer MUST NOT publish an event schema version that is absent from the authoritative registry.

## 50. Security and authorization

All event publication and subscription operations MUST be authenticated.

Authorization MUST be enforced at the producer, broker or event service, and consumer boundary as appropriate to the architecture.

The event service MUST authorize publication by producer identity, tenant, domain, and event type.

The event service MUST authorize subscription and replay by tenant, role, resource, and event sensitivity.

A consumer MUST NOT assume that possession of an event ID grants access to the event.

Event payloads MUST NOT contain passwords, private keys, access tokens, session cookies, or other authentication secrets.

Sensitive fields MUST be omitted or redacted before publication.

A system security event MUST be protected from unauthorized modification and access.

Administrative replay and export operations SHOULD be auditable.

## 51. Privacy and data minimization

Producers MUST include only data needed for event interpretation, auditing, or authorized downstream processing.

User identifiers SHOULD be represented by stable platform identifiers rather than unnecessary personal details.

Payloads MUST NOT include full user profiles, credentials, or unrelated personal information.

If a domain requires sensitive data, the schema MUST explicitly identify the field, its access classification, retention requirements, and permitted consumers.

A consumer MUST NOT expose event payloads directly to a user interface without applying the relevant authorization and redaction policy.

Deletion or anonymization requirements MUST be handled according to the authoritative data-retention policy without compromising mandatory audit obligations.

## 52. Event observability

Event infrastructure MUST expose operational metrics for publication, delivery, processing, retries, deduplication, replay, and dead-letter handling.

At minimum, the system SHOULD measure:

- Published events by domain and event type.
- Publication failures by stable error code.
- Delivery latency.
- Consumer processing latency.
- Duplicate delivery count.
- Schema validation failures.
- Aggregate-version gaps.
- Replay requests and replay failures.
- Dead-letter or quarantine volume.
- Oldest unprocessed event age.

Metrics MUST avoid high-cardinality labels containing unbounded user-provided values.

Logs SHOULD include `event_id`, `event_type`, `tenant_id` where authorized, `correlation_id`, and the processing outcome.

Logs MUST NOT include secrets or unnecessarily duplicate sensitive payload fields.

## 53. Operational recovery

Event producers MUST have a documented recovery procedure for pending outbox records and publication failures.

Consumers MUST have a documented recovery procedure for failed processing and replay.

Recovery procedures MUST preserve event identity and idempotency guarantees.

An operator MUST be able to distinguish a temporarily delayed event from an event that was permanently rejected or expired from retention.

Manual event replay MUST be authorized and auditable.

Manual correction of a domain state MUST NOT require rewriting immutable historical events.

If a replay or recovery operation may trigger external side effects, the operator workflow MUST identify those side effects and enforce idempotency controls.

## 54. Event deprecation

An event type MAY be deprecated when a replacement is available or the domain behavior is no longer supported.

Deprecation MUST be documented in the schema registry.

A deprecation notice MUST identify the affected event type, supported replacement if any, and the planned removal conditions.

A deprecated event MUST remain supported during the published compatibility period unless a security or legal requirement requires earlier removal.

A producer MUST NOT silently stop publishing an event that an active consumer contract requires.

A consumer SHOULD migrate away from deprecated event types before their removal.

Removal of an event type MUST be treated as a breaking compatibility change.

## 55. Domain transition consistency

Events represent committed domain facts, but they do not replace the authoritative state machine for their domain.

A producer MUST publish state-transition events only for transitions permitted by the relevant domain contract.

A consumer MUST validate transitions when it maintains a stateful projection.

A consumer MUST distinguish a request event from an outcome event.

Examples:

- `booking.requested` does not imply `booking.confirmed`.
- `job.cancel_requested` does not imply `job.cancelled`.
- `run.stop_requested` does not imply `run.stopped`.
- `artifact.created` does not imply `artifact.validated`.
- `result.created` does not imply `result.published`.
- `lab.heartbeat_received` does not imply that attached hardware is safe.

If a transition is invalid or its preconditions are unknown, the consumer MUST reconcile with authoritative state or quarantine the event according to its policy.

## 56. Relationship between job, run, and result events

A job represents the requested work.

A run represents one execution attempt for that work.

A result represents output produced by a run.

A job MAY have more than one run.

A run MUST reference exactly one `job_id`.

A result MUST reference exactly one `job_id` and one `run_id`.

A consumer MUST NOT infer that a result exists merely because a run completed.

A consumer MUST NOT infer that a job is completed solely because one run completed if retry or aggregation policy remains unresolved.

A result publication event MUST refer to an identifiable result and its originating run.

## 57. Relationship between booking and execution events

Booking events represent resource allocation and reservation facts.

Job and run events represent work scheduling and execution facts.

A booking confirmation MAY be a precondition for job scheduling, depending on the deployment policy.

A booking confirmation MUST NOT be interpreted as an execution authorization unless the applicable domain policy explicitly establishes that relationship.

A booking cancellation MUST NOT be interpreted as confirmation that a run stopped.

If cancellation requires stopping active execution, the system MUST emit the appropriate job or run events when those transitions are confirmed.

Consumers MUST preserve these distinctions in user-visible status and audit history.

## 58. Relationship between credit and domain events

Credit events are accounting facts.

A booking or job event MAY reference a credit reservation, but MUST NOT independently modify the credit ledger.

A credit reservation MUST be created and released or consumed according to the authoritative accounting service's transaction rules.

A consumer MUST NOT derive a credit balance by counting booking events.

A consumer MUST use the authoritative credit ledger or its validated event projection for balance calculations.

Duplicate credit events MUST NOT result in duplicate ledger entries.

Any correction to accounting MUST be represented by a new authorized accounting event.

## 59. Event snapshots and state reconstruction

The baseline contract defines individual domain events, not a universal snapshot format.

A deployment MAY define snapshot events for large or frequently changing aggregates.

A snapshot event MUST have an explicitly registered event type and schema.

A snapshot MUST identify the aggregate version represented by the snapshot.

A consumer MUST NOT interpret a partial event payload as a complete aggregate snapshot.

If snapshots are used for replay optimization, the replay service MUST ensure that the selected snapshot and subsequent events form a consistent reconstruction sequence.

A snapshot MUST NOT replace immutable accounting or security audit records where those records are required.

## 60. WebSocket transport alignment

When events are delivered through the WebSocket contract, the transport MUST follow `docs/protocol/WEBSOCKET_CONTRACT.md`.

The canonical event envelope MUST remain distinguishable from the WebSocket transport envelope.

Transport message IDs and event IDs MUST NOT be conflated.

A transport delivery ID MAY identify one delivery attempt. It MUST NOT replace `event_id`.

WebSocket subscription filters MUST enforce the same authorization and tenant-isolation requirements as other delivery mechanisms.

Reconnect and resume behavior MUST preserve event identity and use the cursor semantics defined by the WebSocket contract.

A consumer reconnecting after a connection failure MUST deduplicate events that were delivered before the disconnect and replayed afterward.

## 61. Lab protocol alignment

When events are derived from Lab Agent messages, the integration MUST follow `docs/protocol/LAB_PROTOCOL.md`.

A Lab Agent message MUST NOT automatically become a domain event without validation and authorization by the receiving platform service.

The platform MUST distinguish a reported observation from a verified platform state transition.

Heartbeat receipt may produce `lab.heartbeat_received`.

A Lab Agent's report of a failure MAY produce a health-related event only after the applicable validation and state-transition policy has been applied.

Lab-derived events MUST preserve the originating observation timestamp when trustworthy and available.

The platform MUST record the time at which it received or accepted the observation separately from the original observation time.

## 62. Artifact manifest alignment

Artifact and result events MUST use the artifact manifest contract defined in `docs/protocol/ARTIFACT_MANIFEST.md` wherever a manifest reference is required.

A manifest reference MUST resolve to an immutable, versioned, or content-addressed object.

A consumer MUST validate the manifest and artifact access rights before retrieving associated data.

An event MUST NOT embed an entire artifact manifest unless the event schema explicitly permits that representation.

The existence of an artifact event MUST NOT override the manifest's integrity, authorization, or lifecycle rules.

## 63. Phase and milestone traceability

The event contract supports the frozen Kritva RaaS delivery model. Phase and milestone definitions remain authoritative in `planning/PHASES.md` and the corresponding milestone dossiers under `docs/**/milestones/`.

| Phase | Event-contract relevance |
|---|---|
| P0 FOUNDATION | Establish common event identity, schema, and governance requirements |
| P1 STUDIO | Support project and workspace-facing event consumption where defined by milestone scope |
| P2 BUILD & ARTIFACT | Support artifact and build-related lifecycle events |
| P3 CONTROL PLANE | Support event publication, routing, authorization, and core domain integration |
| P4 BOOKING & COMMERCIAL | Support booking and credit lifecycle events |
| P5 EXECUTION | Support job and run lifecycle events |
| P6 LAB & ROBOT | Support lab, robot, telemetry, and execution-observation events |
| P7 LIVE & RESULTS | Support live event delivery, result publication, and replay-facing consumption |
| P8 PRODUCTION | Support production hardening, operational controls, retention, and audit requirements |

### 63.1 Frontend milestone traceability

| Milestone | Contract relevance |
|---|---|
| F-M01 STUDIO FOUNDATION | Establish shared event-consumption and error-handling conventions |
| F-M02 PROJECTS | Consume project-related events only where defined by the applicable domain contract |
| F-M03 BUILD & ARTIFACT | Consume artifact lifecycle events |
| F-M04 BOOKING | Consume booking and credit-related status events |
| F-M05 EXECUTION | Consume job and run lifecycle events |
| F-M06 LIVE | Consume authorized live event streams |
| F-M07 RESULTS | Consume result lifecycle events |

### 63.2 Backend milestone traceability

| Milestone | Contract relevance |
|---|---|
| B-M01 CONTROL PLANE | Enforce common envelope, schema validation, authorization, and event routing |
| B-M02 ARTIFACT | Publish and consume artifact lifecycle events |
| B-M03 PLATFORM | Integrate domain event publication and consumption |
| B-M04 BOOKING | Publish booking and credit lifecycle events |
| B-M05 EXECUTION | Publish job and run lifecycle events |
| B-M06 RESULTS | Publish result and Lab/Robot-related events within the milestone's scope |
| B-M07 PRODUCTION | Enforce production durability, retention, recovery, and operational controls |

### 63.3 Database milestone traceability

| Milestone | Contract relevance |
|---|---|
| DB-M01 FOUNDATION | Establish durable event storage and shared metadata requirements |
| DB-M02 CORE DATA | Persist event-related core domain identities and projections |
| DB-M03 BOOKING DATA | Preserve booking and credit accounting consistency |
| DB-M04 EXECUTION DATA | Support job, run, result, telemetry, and replay data requirements |

### 63.4 Cloud milestone traceability

| Milestone | Contract relevance |
|---|---|
| C-M01 FOUNDATION | Establish event infrastructure and baseline access controls |
| C-M02 DEVELOPMENT | Support schema validation, producer integration, and consumer testing |
| C-M03 STAGING | Validate cross-service delivery, replay, compatibility, and failure recovery |
| C-M04 PRODUCTION | Enforce production security, durability, retention, and observability |

This table provides traceability only. It MUST NOT override the authoritative milestone dossiers or expand milestone scope.

## 64. Conformance levels

An implementation MAY declare one or more conformance roles:

- **Producer:** creates and publishes canonical events.
- **Consumer:** validates and processes canonical events.
- **Broker or event service:** accepts, stores, routes, and replays events.
- **Schema registry:** manages event types and schema versions.
- **Replay service:** provides retained event history under authorization.
- **Administrative operator:** manages authorized recovery, replay, and retention operations.

A role MUST satisfy all mandatory requirements applicable to that role.

A deployment MUST NOT claim full event-contract conformance if a required role violates the relevant mandatory requirements.

## 65. Producer conformance tests

A conforming producer MUST pass tests that verify:

1. Every event contains all required envelope fields.
2. Every event ID is a valid lowercase UUID.
3. Every event type follows the canonical naming convention.
4. Every schema version is registered and supported.
5. Every timestamp is a valid UTC RFC 3339 value.
6. Every producer identity is authenticated and authorized.
7. Every tenant identity is derived from an authorized context.
8. Every aggregate ID matches the domain payload's primary entity ID.
9. Every aggregate version satisfies the documented constraints.
10. Every event-specific payload validates against its registered schema.
11. Invalid events are rejected before durable publication.
12. Publication retries preserve event identity.
13. State-changing events are emitted only after the authoritative state commits.
14. Credit-related events cannot be duplicated by request retries.
15. Events exceeding size limits are rejected or split without truncation.

## 66. Consumer conformance tests

A conforming consumer MUST pass tests that verify:

1. Malformed JSON is rejected.
2. Invalid envelopes are rejected.
3. Unsupported schema versions are handled according to policy.
4. Unknown event types do not trigger guessed side effects.
5. Duplicate event IDs do not duplicate domain side effects.
6. Conflicting content for the same event ID is quarantined.
7. Tenant authorization is checked before exposure or processing.
8. Aggregate-version gaps are detected where required.
9. Out-of-order delivery follows the consumer's documented policy.
10. Transient failures use bounded retries.
11. Permanent failures are recorded and quarantined or dead-lettered.
12. Replay preserves the original canonical event.
13. Consumer checkpoints advance only after durable processing.
14. Unknown fields are handled according to the registered extension policy.
15. Sensitive payload fields are not leaked into logs or user interfaces.

## 67. Broker and replay conformance tests

A conforming broker or event service MUST pass tests that verify:

1. Unauthorized producers cannot publish events.
2. Unauthorized consumers cannot subscribe to protected event streams.
3. Events are durably accepted according to the declared durability contract.
4. Retry delivery preserves the original event ID and content.
5. Event ordering behavior matches the declared aggregate-scoped policy.
6. Tenant isolation is enforced in storage, delivery, and replay.
7. Replay returns the original event identity and payload.
8. Expired replay cursors return `REPLAY_WINDOW_EXPIRED`.
9. Backpressure limits are enforced.
10. Retention policies are applied without silently altering retained event content.
11. Event-size limits are enforced.
12. Operational metrics expose delivery and processing failures.
13. Dead-letter or quarantine records are access-controlled.
14. Replay and administrative recovery actions are auditable.
15. High-volume telemetry does not indefinitely block critical event classes.

## 68. Negative conformance cases

The test suite MUST include invalid and adversarial events, including:

- Missing `event_id`.
- Invalid UUID representation.
- Missing `event_type`.
- Unknown or malformed schema version.
- Invalid timestamp.
- Missing tenant identity.
- Unauthorized producer identity.
- Aggregate ID inconsistent with the payload entity ID.
- Invalid aggregate version.
- Wrong JSON type for a required field.
- Unsupported enum value.
- Negative credit quantity.
- Credit consumption without a valid reservation reference.
- Booking end time not later than start time.
- Invalid run attempt number.
- Telemetry value that is not finite.
- Telemetry batch count inconsistent with its sample array.
- Oversized event payload.
- Reused event ID with different content.
- Reused idempotency key with conflicting request content.
- Cross-tenant replay attempt.
- Replay cursor outside retention.
- Unknown event type delivered to a strict consumer.

Each negative test MUST verify that no unauthorized or duplicate domain side effect occurs.

## 69. Example: booking confirmation event

The following example illustrates a valid booking confirmation event.

    {
        "event_id": "f1b7c0aa-6f35-4db9-a421-93f71d211001",
        "event_type": "booking.confirmed",
        "schema_version": "1.0.0",
        "occurred_at": "2026-10-09T07:00:00.000Z",
        "published_at": "2026-10-09T07:00:00.025Z",
        "producer": {
            "service": "booking-service",
            "instance_id": "booking-03",
            "environment": "staging"
        },
        "tenant_id": "tenant-001",
        "aggregate": {
            "type": "booking",
            "id": "booking-0091",
            "version": 4
        },
        "correlation_id": "workflow-booking-91",
        "causation_id": "command-confirm-91",
        "trace_id": null,
        "idempotency_key": "confirm-booking-0091",
        "payload": {
            "booking_id": "booking-0091",
            "resource_id": "robot-cell-02",
            "status": "CONFIRMED",
            "starts_at": "2026-10-10T09:00:00.000Z",
            "ends_at": "2026-10-10T10:00:00.000Z",
            "confirmed_at": "2026-10-09T07:00:00.000Z",
            "credit_reservation_id": "credit-reservation-81"
        }
    }

A consumer MUST validate the booking status, time interval, tenant scope, aggregate identity, and event schema before applying the event to a projection.

## 70. Example: run completion event

The following example illustrates a successful run completion event.

    {
        "event_id": "e18db14c-c73e-42a2-9946-6b5df88bb018",
        "event_type": "run.completed",
        "schema_version": "1.0.0",
        "occurred_at": "2026-10-09T07:12:32.000Z",
        "published_at": "2026-10-09T07:12:32.040Z",
        "producer": {
            "service": "execution-worker",
            "instance_id": "worker-7f39",
            "environment": "staging"
        },
        "tenant_id": "tenant-001",
        "aggregate": {
            "type": "run",
            "id": "run-00077",
            "version": 8
        },
        "correlation_id": "job-workflow-123",
        "causation_id": "command-complete-run-77",
        "trace_id": "7a6b8c9d0e1f23456789abcdef012345",
        "idempotency_key": "complete-run-00077",
        "payload": {
            "run_id": "run-00077",
            "job_id": "job-000123",
            "attempt": 1,
            "status": "COMPLETED",
            "resource_id": "robot-cell-02",
            "created_at": "2026-10-09T07:10:00.000Z",
            "completed_at": "2026-10-09T07:12:32.000Z"
        }
    }

A run completion event MUST NOT imply that result publication has occurred. The result lifecycle MUST be represented by its own events.

## 71. Example: telemetry sample event

The following example illustrates a valid telemetry sample.

    {
        "event_id": "c03d44e7-9f47-49c4-b4b9-0a4e4c9d9a17",
        "event_type": "telemetry.sample_received",
        "schema_version": "1.0.0",
        "occurred_at": "2026-10-09T07:13:02.100Z",
        "published_at": "2026-10-09T07:13:02.120Z",
        "producer": {
            "service": "lab-agent-gateway",
            "instance_id": "lab-gateway-02",
            "environment": "staging"
        },
        "tenant_id": "tenant-001",
        "aggregate": {
            "type": "lab",
            "id": "lab-004",
            "version": 12
        },
        "correlation_id": "run-00077",
        "causation_id": "heartbeat-telemetry-302",
        "trace_id": null,
        "idempotency_key": null,
        "payload": {
            "source_id": "joint-03",
            "metric": "joint.temperature",
            "value": 42.7,
            "unit": "degC",
            "sampled_at": "2026-10-09T07:13:02.100Z",
            "quality": "VALID"
        }
    }

The metric identifier and unit MUST agree with the registered telemetry schema.

## 72. Example: credit consumption event

The following example illustrates a committed credit consumption event.

    {
        "event_id": "a4c04e93-b2ef-4f77-a28e-04a9c14b7f55",
        "event_type": "credit.consumed",
        "schema_version": "1.0.0",
        "occurred_at": "2026-10-09T07:15:00.000Z",
        "published_at": "2026-10-09T07:15:00.015Z",
        "producer": {
            "service": "credit-service",
            "instance_id": "credit-01",
            "environment": "staging"
        },
        "tenant_id": "tenant-001",
        "aggregate": {
            "type": "credit_account",
            "id": "credit-account-001",
            "version": 18
        },
        "correlation_id": "job-workflow-123",
        "causation_id": "run-00077",
        "trace_id": null,
        "idempotency_key": "consume-run-00077",
        "payload": {
            "credit_account_id": "credit-account-001",
            "transaction_id": "credit-txn-991",
            "quantity": 25,
            "unit": "CREDIT",
            "balance_after": 975,
            "reason_code": "RUN_USAGE",
            "reservation_id": "credit-reservation-81",
            "consumed_at": "2026-10-09T07:15:00.000Z"
        }
    }

The example MUST be processed as one accounting transaction. A duplicate delivery MUST NOT reduce the balance a second time.

## 73. Example: result publication event

The following example illustrates a published result.

    {
        "event_id": "b81230aa-1d5f-4c3d-8df4-2b32c02f28c7",
        "event_type": "result.published",
        "schema_version": "1.0.0",
        "occurred_at": "2026-10-09T07:16:00.000Z",
        "published_at": "2026-10-09T07:16:00.025Z",
        "producer": {
            "service": "result-service",
            "instance_id": "result-02",
            "environment": "staging"
        },
        "tenant_id": "tenant-001",
        "aggregate": {
            "type": "result",
            "id": "result-00077",
            "version": 3
        },
        "correlation_id": "job-workflow-123",
        "causation_id": "command-publish-result-77",
        "trace_id": null,
        "idempotency_key": "publish-result-00077",
        "payload": {
            "result_id": "result-00077",
            "job_id": "job-000123",
            "run_id": "run-00077",
            "status": "PUBLISHED",
            "created_at": "2026-10-09T07:14:00.000Z",
            "published_at": "2026-10-09T07:16:00.000Z",
            "manifest_ref": "manifest://tenant-001/result-00077/v1"
        }
    }

The manifest reference MUST be resolved and authorized using the applicable manifest and result retrieval contracts.

## 74. Example: invalid event handling

An event with an unsupported schema version MUST be rejected or quarantined before domain side effects occur.

    {
        "code": "UNSUPPORTED_SCHEMA_VERSION",
        "message": "The declared event schema version is not supported.",
        "retryable": false,
        "correlation_id": "workflow-9f2c"
    }

An implementation MUST NOT retry a permanently unsupported schema indefinitely.

## 75. Implementation guidance

The following practices are RECOMMENDED:

- Use a schema registry as the authoritative source of event schemas.
- Use a transactional outbox for state-changing domain operations.
- Partition ordered event streams by aggregate ID.
- Maintain durable consumer deduplication records.
- Use bounded exponential backoff with jitter.
- Separate high-volume telemetry from critical control events.
- Keep payloads small and use immutable references for large data.
- Make replay checkpoints durable and observable.
- Test schema compatibility in continuous integration.
- Audit administrative replay and recovery actions.

These recommendations do not replace the normative requirements in earlier sections.

## 76. Acceptance checklist

An implementation MUST satisfy every applicable item before claiming conformance.

### 76.1 Envelope and schema

- [ ] Every event uses the canonical JSON envelope.
- [ ] Every event contains a valid unique `event_id`.
- [ ] Every event uses a registered `event_type`.
- [ ] Every event declares a supported `schema_version`.
- [ ] All timestamps use UTC RFC 3339 serialization.
- [ ] Producer identity and tenant identity are validated.
- [ ] Aggregate identity matches the domain payload.
- [ ] Correlation, causation, tracing, and idempotency fields follow this contract.
- [ ] Payloads validate against event-specific schemas.
- [ ] Payload size and collection limits are enforced.

### 76.2 Domain payloads

- [ ] Artifact events implement the required lifecycle fields.
- [ ] Booking events implement the required reservation fields and transition semantics.
- [ ] Credit events preserve accounting integrity and integer quantity rules.
- [ ] Job events distinguish submission, scheduling, cancellation, failure, and completion.
- [ ] Run events distinguish individual execution attempts and terminal outcomes.
- [ ] Result events distinguish creation, validation, publication, expiration, and deletion.
- [ ] Lab events distinguish heartbeat observations from health and connectivity state.
- [ ] Telemetry events validate metrics, units, timestamps, and sample quality.
- [ ] System events use documented status, severity, and security-event fields.

### 76.3 Delivery and recovery

- [ ] Durable event delivery follows the declared at-least-once model.
- [ ] Consumers deduplicate by `event_id`.
- [ ] Conflicting content for an existing event ID is quarantined.
- [ ] Aggregate-version gaps and out-of-order delivery are handled.
- [ ] Publication retries preserve event identity.
- [ ] Side effects and deduplication records are transactionally consistent or equivalently recoverable.
- [ ] Replay preserves the canonical event.
- [ ] Retention and replay-window behavior are documented.
- [ ] Backpressure and bounded retries are implemented.
- [ ] Dead-letter and quarantine paths are operationally supported.

### 76.4 Security and compatibility

- [ ] Producer and consumer authorization is enforced.
- [ ] Tenant isolation applies to publication, delivery, and replay.
- [ ] Secrets and unnecessary personal data are excluded from payloads.
- [ ] Schema changes follow the versioning policy.
- [ ] Unknown event types and fields follow explicit compatibility rules.
- [ ] Administrative replay is authorized and auditable.
- [ ] Event-processing metrics and logs support diagnosis without leaking sensitive data.

### 76.5 Integration and traceability

- [ ] WebSocket delivery follows `docs/protocol/WEBSOCKET_CONTRACT.md`.
- [ ] Lab Agent integration follows `docs/protocol/LAB_PROTOCOL.md`.
- [ ] Artifact and result references follow `docs/protocol/ARTIFACT_MANIFEST.md`.
- [ ] Architecture responsibilities align with `docs/architecture/PROTOCOL_ARCHITECTURE.md`.
- [ ] Phase references align with `planning/PHASES.md`.
- [ ] Milestone scope remains governed by the authoritative milestone dossiers.
- [ ] Producer, consumer, broker, replay, and negative conformance tests pass.

## 77. Release gate

The event contract MUST be reviewed before an implementation is declared production-conformant.

The review MUST verify schema completeness, cross-domain consistency, delivery and replay behavior, tenant isolation, compatibility behavior, and conformance test coverage.

A production deployment MUST NOT claim conformance while known event-integrity failures, cross-tenant delivery defects, duplicate accounting effects, or unrecoverable loss of required durable events remain unresolved.

Changes to this document MUST be reviewed alongside affected event schemas, producer implementations, consumer implementations, and relevant transport contracts.

The authoritative milestone dossiers determine when this contract is required by a milestone. This document defines the event contract and does not independently redefine milestone scope.

## 78. Change control

Every normative change MUST identify:

- The affected event types and schema versions.
- Whether the change is compatible or breaking.
- The affected producers and consumers.
- The migration or compatibility strategy.
- The required conformance tests.
- The effect on retention, replay, and historical event interpretation.

A breaking change MUST NOT be deployed without a documented migration plan and an explicit decision about old-event consumption.

Historical events MUST retain their original schema version and semantics.

Schema corrections MUST NOT cause consumers to reinterpret retained events silently.

The event contract version and the individual event schema versions MUST remain independently identifiable.

## 79. Final contract statement

This document is the normative baseline for Kritva RaaS event envelopes and domain event payloads.

Every conforming producer, consumer, broker, registry, and replay service MUST implement the requirements applicable to its role.

The event protocol MUST preserve immutable event identity, tenant isolation, schema validity, accounting integrity, explicit delivery semantics, bounded replay, and backward-compatibility discipline.

No implementation-specific behavior may override these requirements unless a formally reviewed contract revision explicitly changes them.
