# Kritva RaaS Lab Protocol Contract

**Document type:** Normative protocol contract  
**Protocol:** Control Plane ↔ Lab Agent and Lab Agent ↔ Kritva Runtime  
**Protocol version:** `1.0`  
**Status:** Proposed normative baseline; implementation conformance required  
**Architecture reference:** `docs/architecture/PROTOCOL_ARCHITECTURE.md`  
**Artifact manifest reference:** `docs/protocol/ARTIFACT_MANIFEST.md`

## 1. Purpose

This document defines the normative communication contract between the Kritva RaaS Control Plane and a Lab Agent, and between the Lab Agent and the local Kritva Runtime.

The protocol supports authenticated agent registration, health reporting, capability discovery, resource monitoring, artifact retrieval and verification, deployment, lifecycle control, execution status, log and telemetry delivery, result collection, reconnection, and safety-state reporting.

The protocol MUST provide deterministic message semantics, explicit state transitions, bounded request lifetimes, idempotent control operations, and fail-safe handling of communication failures.

This document specifies:

- exact message envelope and field names
- registration, authentication, and session lifecycle
- heartbeat and resource status
- capability discovery and compatibility
- artifact fetch, validation, and deployment
- start, stop, and cancel operations
- execution status, logs, telemetry, and results
- reconnect and delivery semantics
- local Runtime communication
- safety-state reporting and safety boundaries
- idempotency, timeouts, error behavior, and version negotiation
- conformance tests and acceptance criteria

The protocol does not replace the artifact manifest contract, execution policy, authorization policy, safety architecture, or system-wide architecture.

## 2. Normative Language

The terms MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, and MAY are normative.

- **MUST / MUST NOT:** Absolute conformance requirement.
- **SHOULD / SHOULD NOT:** Recommendation requiring a documented justification when not followed.
- **MAY:** Optional behavior.

A **Control Plane** is the trusted service that coordinates agents, workloads, desired state, and results.

A **Lab Agent** is the host-side service that registers with the Control Plane and mediates communication with the local Kritva Runtime.

A **Kritva Runtime** is the local execution service that validates and manages workloads on the target host.

A **session** is an authenticated communication relationship between a Control Plane and a Lab Agent.

A **job** is a requested unit of work with a stable `job_id`.

An **execution** is one attempt to run a job, identified by an `execution_id`.

A **command** is a requested state-changing operation.

A **result** is the structured output associated with an execution.

A **safety state** is the reported condition relevant to whether execution may safely proceed. It is not, by itself, proof that a physical system is safe.

## 3. Scope and Authority

The system-wide protocol architecture is defined by `docs/architecture/PROTOCOL_ARCHITECTURE.md`.

This contract defines the Lab protocol's message and lifecycle semantics. It MUST remain consistent with the architecture's trust boundaries, transport choices, component responsibilities, and security requirements.

The following contracts remain authoritative for their own concerns:

| Concern | Authority |
|---|---|
| System-wide protocol architecture | `docs/architecture/PROTOCOL_ARCHITECTURE.md` |
| Lab protocol messages and state machines | `docs/protocol/LAB_PROTOCOL.md` |
| Artifact manifest and integrity metadata | `docs/protocol/ARTIFACT_MANIFEST.md` |
| API transport and common error envelope | Applicable API contract |
| Data persistence and retention | Authoritative database contracts |
| Authentication and authorization policy | Applicable security contract |
| Physical safety behavior | Applicable safety contract and hardware safety design |
| Canonical phase definitions | `docs/planning/PHASES.md` |

If a conflict exists between this document and another authoritative contract, implementations MUST NOT silently choose one interpretation. The conflict MUST be resolved by the relevant contract owners before affected behavior is treated as conformant.

## 4. Protocol Overview

The protocol has two communication boundaries.

1. **Control Plane ↔ Lab Agent:** remote, authenticated control and reporting.
2. **Lab Agent ↔ Kritva Runtime:** local, authenticated or access-controlled coordination for artifact handling and execution lifecycle operations.

The Lab Agent MUST NOT bypass the Runtime's validation and execution controls to launch an artifact directly.

The Control Plane MUST NOT assume that successful delivery of a command means that the command completed.

The Lab Agent MUST distinguish command receipt, command acceptance, operation progress, and terminal outcome.

The Runtime MUST retain responsibility for local execution validation and enforcement of runtime policy.

## 5. Transport and Encoding

The remote protocol MUST use an authenticated transport providing confidentiality, integrity, and peer authentication. Mutual TLS (mTLS) MUST be used unless an explicitly approved deployment profile specifies an equivalent authenticated transport.

Application messages MUST be encoded as UTF-8 JSON objects.

The local Lab Agent ↔ Kritva Runtime protocol MUST use a local transport protected by operating-system access controls and authenticated peer identity. A deployment MAY additionally use local mTLS or an authenticated Unix-domain socket.

The transport contract MUST define message framing, maximum message size, connection limits, and keepalive behavior.

JSON messages MUST NOT contain duplicate object member names. Receivers MUST reject duplicate keys.

Receivers MUST reject malformed JSON, invalid UTF-8, and non-standard JSON values.

A successful transport write MUST NOT be treated as proof that the peer processed a message.

## 6. Protocol Versioning

The protocol version is represented by `protocol_version`.

For this baseline, the supported value is:

    "1.0"

Every protocol message MUST include `protocol_version`.

A peer MUST reject a protocol version it does not support. It MUST NOT silently reinterpret an unsupported version as `1.0`.

Version compatibility MUST be negotiated during registration before operational commands are accepted.

The protocol version identifies message semantics, state transitions, and required fields. It is distinct from the Lab Agent software version and Kritva Runtime version.

Backward-compatible additions MUST be explicitly defined by a contract revision. Under protocol `1.0`, receivers MUST reject unknown fields in the message envelope and MUST apply the message-specific rules for nested objects.

Breaking changes to required fields, message meanings, authentication, idempotency, or state transitions MUST require a new incompatible protocol version.

## 7. Common Message Envelope

Every protocol message MUST contain the following fields.

| Field | Type | Constraint |
|---|---|---|
| `protocol_version` | string | MUST equal a negotiated supported version |
| `message_id` | string | Unique identifier for this message |
| `message_type` | string | Registered message type |
| `sent_at` | string | RFC 3339 timestamp with UTC offset |
| `correlation_id` | string or null | Request/response correlation |
| `session_id` | string or null | Authenticated session identifier |
| `agent_id` | string or null | Lab Agent identity when known |
| `payload` | object | Message-specific content |

`message_id` MUST be non-empty and MUST NOT exceed 128 characters.

`message_type` MUST be a registered type defined by this contract or an explicitly negotiated extension.

`sent_at` MUST contain an explicit UTC offset. Producers SHOULD use UTC and the `Z` suffix.

`correlation_id` MUST identify the initiating request for a response or asynchronous event associated with a request. It MUST be `null` only when no request correlation exists.

`session_id` and `agent_id` MAY be `null` only before authenticated registration completes or where the message is explicitly permitted outside a session.

A receiver MUST validate the envelope before dispatching the message to its handler.

## 8. Identifier Rules

Identifiers MUST be non-empty strings and MUST NOT exceed 128 characters unless a field specifies a different limit.

The fields `agent_id`, `session_id`, `job_id`, `execution_id`, `command_id`, `artifact_id`, and `result_id` MUST be treated as opaque identifiers.

A receiver MUST NOT derive authorization from an identifier's textual content.

Identifiers MUST NOT contain secrets, access tokens, private keys, or other credentials.

A Lab Agent MUST have a stable `agent_id` provisioned or assigned through an authenticated registration process.

A new authenticated session MUST use a new `session_id`. A reconnect MUST NOT reuse a session that has expired or been revoked.

## 9. Message Types

Protocol `1.0` defines the following message types.

| Message type | Direction | Purpose |
|---|---|---|
| `register` | Agent → Control Plane | Request agent registration |
| `register_ack` | Control Plane → Agent | Accept or reject registration |
| `heartbeat` | Agent → Control Plane | Report liveness |
| `heartbeat_ack` | Control Plane → Agent | Confirm liveness and session |
| `capabilities_report` | Agent → Control Plane | Advertise supported capabilities |
| `resource_status` | Agent → Control Plane | Report current resource state |
| `artifact_fetch` | Agent → Control Plane | Request an authorized artifact reference |
| `artifact_fetch_ack` | Control Plane → Agent | Return artifact location and metadata |
| `deploy` | Control Plane → Agent | Request artifact validation and deployment |
| `deploy_status` | Agent → Control Plane | Report deployment progress and outcome |
| `start` | Control Plane → Agent | Request execution start |
| `stop` | Control Plane → Agent | Request graceful execution stop |
| `cancel` | Control Plane → Agent | Request cancellation |
| `command_ack` | Agent → Control Plane | Report command acceptance or rejection |
| `execution_status` | Agent → Control Plane | Report execution lifecycle state |
| `log_batch` | Agent → Control Plane | Deliver ordered log records |
| `telemetry_batch` | Agent → Control Plane | Deliver telemetry samples |
| `result_manifest` | Agent → Control Plane | Report completed result metadata |
| `result_fetch` | Control Plane → Agent | Request result retrieval |
| `result_fetch_ack` | Agent → Control Plane | Return result location and metadata |
| `session_close` | Either direction | Close a session |
| `protocol_error` | Either direction | Report a protocol-level error |
| `safety_state_report` | Agent → Control Plane | Report local safety state |

A message type MUST be used only in its defined direction and state.

An implementation MUST NOT interpret an unknown message type as a successful no-op for a required operation.

## 10. Registration Request

A Lab Agent MUST register before it can receive operational commands.

The `register` payload MUST contain exactly the following fields:

| Field | Type | Constraint |
|---|---|---|
| `agent_version` | string | Non-empty, maximum 128 characters |
| `runtime_version` | string | Non-empty, maximum 128 characters |
| `supported_protocol_versions` | array of strings | Non-empty, unique values |
| `platform_id` | string | Valid platform identifier |
| `platform_version` | string | Non-empty version |
| `architecture` | string | Non-empty architecture identifier |
| `capabilities` | array of strings | Unique capability identifiers |
| `requested_lease_seconds` | integer | Range 10–300 |
| `agent_instance_id` | string | Stable identity for this installed agent instance |

The agent MUST authenticate at the transport layer before the Control Plane accepts registration.

The Control Plane MUST verify that the authenticated peer is authorized to register the claimed `agent_id`.

The Control Plane MUST validate supported protocol versions, platform identity, and registration policy before accepting the request.

The Control Plane MUST NOT trust capability declarations merely because they appear in the registration payload. Capabilities MUST be validated against policy and verified agent/runtime information where applicable.

Example request:

    {
        "protocol_version": "1.0",
        "message_id": "msg-register-001",
        "message_type": "register",
        "sent_at": "2026-10-09T00:00:00Z",
        "correlation_id": null,
        "session_id": null,
        "agent_id": "lab-agent-001",
        "payload": {
            "agent_version": "1.0.0",
            "runtime_version": "1.0.0",
            "supported_protocol_versions": ["1.0"],
            "platform_id": "kritva-edge",
            "platform_version": "2.0.0",
            "architecture": "aarch64",
            "capabilities": ["artifact.verify", "execution.control"],
            "requested_lease_seconds": 60,
            "agent_instance_id": "agent-instance-001"
        }
    }

## 11. Registration Acknowledgement

The `register_ack` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `accepted` | boolean | Registration decision |
| `reason_code` | string or null | Stable rejection code, if rejected |
| `negotiated_protocol_version` | string or null | Selected version when accepted |
| `session_id` | string or null | New session identifier when accepted |
| `lease_seconds` | integer or null | Granted lease duration |
| `heartbeat_interval_seconds` | integer or null | Heartbeat interval |
| `server_time` | string | RFC 3339 timestamp |
| `policy_revision` | string | Policy revision used for registration |

If `accepted` is `true`, `negotiated_protocol_version`, `session_id`, `lease_seconds`, and `heartbeat_interval_seconds` MUST be non-null and valid.

The granted lease MUST be between 10 and 300 seconds.

The heartbeat interval MUST be positive and MUST be less than the granted lease duration.

If `accepted` is `false`, `reason_code` MUST identify the rejection and the session fields MUST be `null`.

A rejected registration MUST NOT establish an operational session.

Example acknowledgement:

    {
        "protocol_version": "1.0",
        "message_id": "msg-register-ack-001",
        "message_type": "register_ack",
        "sent_at": "2026-10-09T00:00:01Z",
        "correlation_id": "msg-register-001",
        "session_id": "session-001",
        "agent_id": "lab-agent-001",
        "payload": {
            "accepted": true,
            "reason_code": null,
            "negotiated_protocol_version": "1.0",
            "session_id": "session-001",
            "lease_seconds": 60,
            "heartbeat_interval_seconds": 20,
            "server_time": "2026-10-09T00:00:01Z",
            "policy_revision": "policy-001"
        }
    }

## 12. Session and Authentication Rules

Remote communication MUST use mTLS with a certificate chain accepted by the deployment trust configuration.

The Control Plane MUST authenticate the client certificate and map the authenticated identity to an authorized agent identity.

The Lab Agent MUST authenticate the Control Plane certificate and validate the expected service identity.

Implementations MUST validate certificate validity, trust chain, applicable key usage, and revocation policy.

Certificate validation MUST NOT be disabled as a fallback when authentication fails.

The `agent_id` in a message MUST match the identity bound to the authenticated session.

A message containing a mismatched `agent_id` or `session_id` MUST be rejected.

Session credentials MUST NOT be written into logs or telemetry.

The Lab Agent MUST store private key material using the approved host security mechanism. Private keys MUST NOT be embedded in registration messages or configuration artifacts.

The local Lab Agent ↔ Kritva Runtime connection MUST authenticate the peer through operating-system credentials, an approved local credential, or another explicitly configured authenticated mechanism.

A local connection MUST NOT be considered trusted merely because it originates from the loopback interface.

## 13. Session State Machine

A session MUST follow these states:

| State | Meaning |
|---|---|
| `DISCONNECTED` | No active authenticated session |
| `AUTHENTICATING` | Transport authentication is in progress |
| `REGISTERING` | Registration has been submitted |
| `ACTIVE` | Registration accepted and lease valid |
| `SUSPECT` | Heartbeat or connection failure indicates possible loss |
| `EXPIRED` | Lease elapsed without renewal |
| `REVOKED` | Session or agent access revoked |
| `CLOSING` | Session shutdown is in progress |

Permitted normal transitions are:

- `DISCONNECTED` → `AUTHENTICATING`
- `AUTHENTICATING` → `REGISTERING`
- `REGISTERING` → `ACTIVE` or `DISCONNECTED`
- `ACTIVE` → `SUSPECT`, `CLOSING`, or `REVOKED`
- `SUSPECT` → `ACTIVE`, `EXPIRED`, `CLOSING`, or `REVOKED`
- `EXPIRED` → `AUTHENTICATING`
- `CLOSING` → `DISCONNECTED`
- `REVOKED` → `DISCONNECTED`

A revoked session MUST NOT return directly to `ACTIVE`.

An expired session MUST NOT be renewed by sending a heartbeat. The agent MUST authenticate and register again.

Operational commands MUST be accepted only in `ACTIVE`.

The Control Plane MUST treat a `SUSPECT`, `EXPIRED`, or `REVOKED` agent as unavailable for new work.

## 14. Heartbeat

The `heartbeat` message MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `sequence_number` | integer | Non-negative and monotonically increasing per session |
| `agent_state` | string | Current agent lifecycle state |
| `runtime_connected` | boolean | Whether the local Runtime is reachable |
| `active_execution_count` | integer | Non-negative |
| `timestamp` | string | RFC 3339 timestamp |

The `agent_state` value MUST be one of `STARTING`, `READY`, `BUSY`, `DEGRADED`, or `SHUTTING_DOWN`.

The Control Plane MUST validate the heartbeat's session and sequence number.

A repeated heartbeat sequence number MAY be acknowledged as a duplicate but MUST NOT extend a lease beyond the session policy's defined renewal rules.

A heartbeat MUST NOT implicitly acknowledge or complete an outstanding command.

The `heartbeat_ack` payload MUST contain `sequence_number`, `server_time`, `lease_expires_at`, and `session_state`.

The returned sequence number MUST match the heartbeat being acknowledged.

The Control Plane MUST update liveness state only from authenticated, valid heartbeats.

A heartbeat interval SHOULD be no greater than one-third of the granted lease duration.

The agent MUST treat the session as uncertain when it misses the configured heartbeat deadline. It MUST stop accepting new commands from that session until connectivity and session validity are re-established.

## 15. Capability Reporting

The `capabilities_report` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `revision` | integer | Positive, monotonically increasing |
| `reported_at` | string | RFC 3339 timestamp |
| `capabilities` | array of objects | Unique capability names |
| `runtime_version` | string | Current Runtime version |

Each capability object MUST contain `name`, `supported`, and `details`.

- `name` MUST be a valid capability identifier.
- `supported` MUST be boolean.
- `details` MUST be an object and MUST NOT contain secrets.

The Control Plane MUST store the latest accepted capability revision for the session.

A report with a lower revision MUST be rejected or ignored as stale. It MUST NOT overwrite a newer accepted report.

A capability becoming unavailable MUST be reported promptly and MUST trigger compatibility reassessment for affected work.

Capability reporting MUST NOT grant permissions or override authorization policy.

## 16. Resource Status

The `resource_status` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `reported_at` | string | RFC 3339 timestamp |
| `revision` | integer | Positive, increasing revision |
| `cpu_utilization_percent` | number or null | Range 0–100 |
| `memory_total_bytes` | integer | Positive |
| `memory_available_bytes` | integer | Between zero and total |
| `storage_available_bytes` | integer | Non-negative |
| `active_execution_count` | integer | Non-negative |
| `resource_state` | string | Enumerated state |

`resource_state` MUST be one of `AVAILABLE`, `CONSTRAINED`, `UNAVAILABLE`, or `UNKNOWN`.

If CPU utilization is unavailable, `cpu_utilization_percent` MUST be `null`.

The Lab Agent MUST report measured values or `null` where explicitly allowed. It MUST NOT fabricate resource values to appear healthy.

The Control Plane SHOULD use resource status for scheduling and admission decisions but MUST NOT treat reported resources as a guarantee that a workload will succeed.

A consumer MUST reject impossible values, including available memory greater than total memory.

The resource report MUST NOT include unrelated host files, process command lines, credentials, or other data not required by the operational contract.

## 17. Artifact Fetch

The `artifact_fetch` message requests an authorized artifact reference.

Its payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `request_id` | string | Unique request identifier |
| `artifact_id` | string | Valid artifact identifier |
| `artifact_version` | string | Requested immutable version |
| `purpose` | string | `deploy` or `validate` |

The Control Plane MUST authorize the requesting agent and verify that the requested artifact is permitted for that agent's deployment context.

The `artifact_fetch_ack` payload MUST contain `request_id`, `accepted`, `reason_code`, and `artifact`.

If accepted, `artifact` MUST contain `artifact_id`, `artifact_version`, `download_uri`, `manifest_sha256`, and `expires_at`.

The URI MUST be delivered only over an authenticated channel and MUST use an approved transport. A short-lived download credential MAY be embedded in the URI only if deployment policy permits it and the credential is scoped and time-limited.

If rejected, `artifact` MUST be `null` and `reason_code` MUST be non-null.

The Lab Agent MUST NOT fetch arbitrary URLs supplied by an untrusted manifest. It MUST enforce the configured artifact source allowlist and redirect policy.

## 18. Artifact Validation

Before deployment, the Lab Agent MUST ask the local Kritva Runtime to validate the artifact or invoke the approved shared validation implementation.

Validation MUST include:

- manifest schema and semantic validation
- supported `artifact_format_version`
- signature and trusted-key validation
- payload checksum verification
- safe payload path validation
- source-exclusion policy checks
- platform and architecture compatibility
- Kritva OS and runtime compatibility
- dependency resolution
- capability availability and authorization
- expiration and revocation checks

The artifact manifest MUST conform to `docs/protocol/ARTIFACT_MANIFEST.md`.

A successful download MUST NOT be treated as successful validation.

The Lab Agent MUST reject an artifact if any mandatory validation step fails.

The Runtime MUST independently enforce the validation requirements assigned to it by the architecture and security contracts. It MUST NOT trust an agent-supplied `validated: true` flag without verifiable evidence or a trusted validation boundary.

## 19. Deploy Command

The `deploy` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `command_id` | string | Stable idempotency identifier |
| `job_id` | string | Job identifier |
| `artifact_id` | string | Artifact identifier |
| `artifact_version` | string | Exact artifact version |
| `deployment_id` | string | Unique deployment identifier |
| `requested_at` | string | RFC 3339 timestamp |
| `deadline_at` | string or null | Operation deadline |
| `parameters` | object | Non-secret deployment parameters |

The deployment request MUST reference an exact artifact version. The consumer MUST NOT silently substitute a newer version.

`parameters` MUST NOT carry secrets unless a separate approved secret-injection contract explicitly permits them. Secret material MUST NOT be persisted in deployment logs.

The Lab Agent MUST validate the request and delegate deployment to the Runtime.

The agent MUST acknowledge acceptance or rejection promptly. Deployment completion MUST be reported separately through `deploy_status`.

A deployment MUST NOT be considered successful until the Runtime confirms that the artifact is validated and deployed according to the applicable installation semantics.

## 20. Deployment State Machine

Deployment state MUST be one of:

- `REQUESTED`
- `ACCEPTED`
- `FETCHING`
- `VALIDATING`
- `DEPLOYING`
- `DEPLOYED`
- `FAILED`
- `CANCELLED`

Permitted transitions are:

- `REQUESTED` → `ACCEPTED`, `FAILED`, or `CANCELLED`
- `ACCEPTED` → `FETCHING`, `FAILED`, or `CANCELLED`
- `FETCHING` → `VALIDATING`, `FAILED`, or `CANCELLED`
- `VALIDATING` → `DEPLOYING`, `FAILED`, or `CANCELLED`
- `DEPLOYING` → `DEPLOYED`, `FAILED`, or `CANCELLED`

`DEPLOYED`, `FAILED`, and `CANCELLED` are terminal states for a given `deployment_id`.

A new deployment attempt MUST use a new `deployment_id` if it represents a distinct attempt. Retries of the same command MUST preserve the original `command_id` and `deployment_id`.

The agent MUST NOT report `DEPLOYED` before validation and deployment operations have completed successfully.

A failed deployment MUST include a stable error code and a safe diagnostic message.

## 21. Command Acknowledgement

The `command_ack` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `command_id` | string | Matches the requested command |
| `accepted` | boolean | Whether the command was accepted |
| `reason_code` | string or null | Required when rejected |
| `received_at` | string | RFC 3339 timestamp |
| `operation_id` | string or null | Identifier for asynchronous work |

An accepted asynchronous command SHOULD include an `operation_id`.

A rejected command MUST NOT begin the requested state change.

An acknowledgement confirms acceptance, not completion.

The Control Plane MUST wait for a terminal status or query the operation before considering a command complete.

## 22. Start Command

The `start` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `command_id` | string | Idempotency identifier |
| `job_id` | string | Job identifier |
| `execution_id` | string | Unique execution attempt |
| `deployment_id` | string | Successfully deployed artifact |
| `requested_at` | string | RFC 3339 timestamp |
| `deadline_at` | string or null | Start deadline |
| `parameters` | object | Runtime input parameters |

The Lab Agent MUST verify that the referenced deployment exists and is in `DEPLOYED`.

The Runtime MUST independently verify that the artifact can be started under current policy and resource conditions.

A start request MUST be rejected if the artifact is not deployed, required dependencies are unavailable, the session is invalid, authorization fails, or the safety policy denies the operation.

A duplicate start command with the same `command_id` MUST return the original acceptance or outcome and MUST NOT create another execution.

A new execution attempt MUST use a new `execution_id`.

## 23. Stop Command

The `stop` payload MUST contain `command_id`, `execution_id`, `requested_at`, `deadline_at`, and `reason`.

`reason` MUST be a non-empty string no longer than 512 characters.

A stop command requests a controlled termination of an active execution.

The Runtime SHOULD attempt graceful shutdown within the defined deadline.

If graceful shutdown cannot complete within the deadline, the Runtime MUST follow its approved escalation policy. The Lab Agent MUST report the actual outcome rather than claim that graceful shutdown succeeded.

A stop request for an already terminal execution MUST be handled idempotently.

The stop command MUST NOT disable independent hardware safety mechanisms.

## 24. Cancel Command

The `cancel` payload MUST contain `command_id`, `operation_id`, `requested_at`, and `reason`.

Cancellation requests termination of a pending or active operation when cancellation is supported.

The consumer MUST distinguish cancellation accepted from cancellation completed.

If the operation has already completed, the consumer MUST return its existing terminal state rather than rewrite history.

If cancellation is unsupported or cannot be completed, the consumer MUST return a stable reason code.

A cancellation request MUST NOT be treated as a safety-rated emergency stop. Any emergency-stop behavior MUST use the independently defined safety mechanism.

## 25. Idempotency

Every state-changing command MUST include a stable `command_id`.

The idempotency scope MUST include the authenticated agent identity and command type.

For a given scope, reusing a `command_id` with an identical canonical payload MUST return the previously recorded acknowledgement or operation outcome.

Reusing a `command_id` with a different payload MUST be rejected with `IDEMPOTENCY_CONFLICT`.

The receiver MUST persist idempotency records for at least the configured command-retention interval and SHOULD retain them for the full period during which a retry may be issued.

After a receiver restart, a repeated command MUST NOT create a duplicate deployment or execution when a durable idempotency record exists.

The Control Plane MUST use the same `command_id` when retrying delivery of the same logical command.

A new `command_id` MUST be used for a new logical operation.

## 26. Execution Status

The `execution_status` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `job_id` | string | Job identifier |
| `execution_id` | string | Execution attempt identifier |
| `deployment_id` | string | Deployment identifier |
| `state` | string | Execution lifecycle state |
| `sequence_number` | integer | Increasing per execution |
| `reported_at` | string | RFC 3339 timestamp |
| `progress_percent` | number or null | Range 0–100 |
| `error_code` | string or null | Required on failure |
| `message` | string or null | Safe diagnostic |

`state` MUST be one of `QUEUED`, `STARTING`, `RUNNING`, `STOPPING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, or `UNKNOWN`.

`SUCCEEDED`, `FAILED`, and `CANCELLED` are terminal states.

A status sequence number MUST increase whenever a new state snapshot is emitted for the same execution. Receivers MUST ignore stale updates and MUST NOT regress a terminal execution to a non-terminal state.

`progress_percent` MAY be `null` when progress cannot be measured reliably.

The agent MUST report the Runtime's actual execution state. It MUST NOT synthesize success merely because a process exited.

A `FAILED` state MUST include `error_code`.

A consumer MUST distinguish `UNKNOWN` from success, failure, or cancellation.

## 27. Execution State Machine

Permitted normal transitions are:

- `QUEUED` → `STARTING`, `CANCELLED`, or `FAILED`
- `STARTING` → `RUNNING`, `STOPPING`, `CANCELLED`, or `FAILED`
- `RUNNING` → `STOPPING`, `SUCCEEDED`, `FAILED`, or `CANCELLED`
- `STOPPING` → `SUCCEEDED`, `FAILED`, or `CANCELLED`

A transition to a terminal state MUST be recorded durably before it is reported as final, subject to the Runtime's durability guarantees.

A terminal state MUST NOT be overwritten by a later status message.

If the agent cannot determine the execution state after a Runtime disconnect or host restart, it MUST report `UNKNOWN` or an explicit recovery error until it can reconcile authoritative state.

A consumer MUST NOT infer that an execution succeeded because heartbeats continue after the execution's last status report.

## 28. Logs

The `log_batch` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `execution_id` | string | Execution identifier |
| `batch_id` | string | Unique batch identifier |
| `first_sequence_number` | integer | Non-negative |
| `records` | array of objects | Non-empty, bounded batch |
| `truncated` | boolean | Whether records were omitted |

Each record MUST contain `sequence_number`, `timestamp`, `level`, and `message`.

`level` MUST be one of `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, or `FATAL`.

Log sequence numbers MUST be monotonically increasing within an execution's log stream.

Log messages MUST NOT include credentials, private keys, authentication headers, or secret parameter values.

Receivers SHOULD deduplicate records using execution identity and sequence number.

Log delivery MAY be at-least-once. Consumers MUST NOT assume exactly-once delivery unless a separate transport contract provides it.

The sender MUST respect configured batch-size and record-size limits.

## 29. Telemetry

The `telemetry_batch` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `execution_id` | string or null | Associated execution, if any |
| `batch_id` | string | Unique batch identifier |
| `sequence_number` | integer | Increasing per telemetry stream |
| `samples` | array of objects | Non-empty and bounded |
| `reported_at` | string | RFC 3339 timestamp |

Each sample MUST contain `name`, `value`, `unit`, and `timestamp`.

`name` MUST be a registered telemetry identifier.

`value` MUST be a finite JSON number or a string only when the registered metric definition explicitly permits categorical values.

`unit` MUST match the registered metric definition.

A consumer MUST reject non-finite numeric values and invalid unit combinations.

Telemetry MUST NOT be used as the sole source for safety-critical control unless a separate safety contract explicitly qualifies that telemetry path for the purpose.

The agent MUST apply configured buffering and rate limits. It MUST report dropped telemetry where the applicable operational contract supports drop accounting.

## 30. Result Collection

The `result_manifest` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `result_id` | string | Stable result identifier |
| `job_id` | string | Job identifier |
| `execution_id` | string | Execution identifier |
| `result_version` | string | Result format version |
| `created_at` | string | RFC 3339 timestamp |
| `status` | string | Result lifecycle status |
| `files` | array of objects | Result file inventory |
| `metadata` | object | Non-secret result metadata |

`status` MUST be `AVAILABLE`, `PARTIAL`, or `UNAVAILABLE`.

Each file object MUST contain `path`, `size_bytes`, `algorithm`, and `digest`.

`path` MUST be a safe relative path. `size_bytes` MUST be a non-negative integer. `algorithm` MUST be `sha256` for protocol `1.0`. `digest` MUST be a lowercase hexadecimal SHA-256 digest.

The result manifest MUST NOT contain the result payload itself.

The agent MUST NOT report a result as `AVAILABLE` until the files and checksums are complete and stable.

A consumer MUST verify the result file checksums before accepting the collected result.

Result collection MUST be associated with the correct `job_id` and `execution_id`. A result from one execution MUST NOT be attributed to another.

## 31. Result Fetch

The `result_fetch` payload MUST contain `request_id`, `result_id`, and `requested_at`.

The `result_fetch_ack` payload MUST contain `request_id`, `accepted`, `reason_code`, and `result`.

If accepted, `result` MUST contain `result_id`, `download_uri`, `manifest_sha256`, and `expires_at`.

If rejected, `result` MUST be `null` and `reason_code` MUST be non-null.

Result download links MUST be scoped, time-limited, and delivered over the authenticated protocol.

The consumer MUST validate the result manifest and every downloaded file before persisting the result as accepted.

A result fetch MUST NOT provide access to unrelated executions or other agents' results.

## 32. Safety-State Reporting

The `safety_state_report` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `reported_at` | string | RFC 3339 timestamp |
| `revision` | integer | Positive, increasing |
| `safety_state` | string | Enumerated state |
| `source` | string | Reporting subsystem |
| `reason_code` | string or null | Diagnostic classification |
| `interlocks_active` | array of strings | Active interlock identifiers |
| `requires_human_review` | boolean | Whether human review is required |

`safety_state` MUST be one of `UNKNOWN`, `SAFE_TO_PROCEED`, `RESTRICTED`, `STOP_REQUESTED`, or `UNSAFE`.

`source` MUST identify the subsystem reporting the state.

A Lab Agent MUST report `UNKNOWN` when the safety state cannot be established reliably.

A Lab Agent MUST report `UNSAFE` when the authoritative local safety subsystem reports an unsafe condition.

The Control Plane MUST treat `UNKNOWN` and `UNSAFE` as prohibiting new execution unless an explicitly approved policy defines a more restrictive or specialized behavior.

A `SAFE_TO_PROCEED` report is advisory to the Control Plane and MUST NOT override local safety interlocks.

The Runtime MUST enforce its local safety checks immediately before starting work and throughout execution where required by the safety design.

The protocol MUST NOT be treated as a replacement for a hardware emergency stop, safety-rated controller, physical interlock, or independent protection mechanism.

If `requires_human_review` is `true`, the relevant operation MUST remain gated until the required human review is recorded through the applicable safety process.

A safety report MUST NOT be downgraded or suppressed because it conflicts with a schedule, job priority, or commercial requirement.

## 33. Local Lab Agent ↔ Kritva Runtime Protocol

The local protocol MUST preserve the same command semantics, idempotency, and state distinctions as the remote protocol.

The local request envelope MUST contain:

- `protocol_version`
- `message_id`
- `message_type`
- `sent_at`
- `correlation_id`
- `payload`

The local channel MUST bind requests to the authenticated Lab Agent and Runtime identities.

The local Runtime MUST validate every request, including requests originating from a trusted Lab Agent.

The Lab Agent MUST NOT bypass Runtime policy by directly launching binaries, modifying Runtime state, or writing execution results into protected storage.

The local Runtime MUST expose only the operations permitted by its local authorization policy.

A local request MUST be rejected if the peer identity is invalid, the protocol version is unsupported, the payload is malformed, or the operation is unauthorized.

The local protocol MUST support registration or health handshake, capability discovery, artifact validation, deployment, start, stop, cancel, status, result metadata, and safety-state retrieval as required by the deployment profile.

## 34. Reconnection and Recovery

After a connection failure, the Lab Agent MUST mark the remote session as unavailable and stop accepting new remote commands.

The agent MAY continue local safety supervision and an already authorized execution according to local policy. Network loss MUST NOT disable local safety mechanisms.

On reconnect, the agent MUST authenticate and register a new session.

The Control Plane MUST reconcile the agent's reported active executions, deployments, capability revision, and safety state before issuing new commands.

The agent MUST report the last known sequence numbers for status, logs, and telemetry when supported by the negotiated profile.

The Control Plane MUST tolerate duplicate reports and MUST reject stale reports that would regress authoritative state.

The protocol MUST NOT assume that messages sent before a disconnect were processed by the receiver.

State-changing commands MUST be retried with their original `command_id` if the sender cannot determine whether the original request was accepted.

If durable local state is unavailable after restart, the agent MUST report the state as unknown and MUST NOT invent a successful outcome.

The Control Plane MUST NOT automatically restart an execution solely because its previous session disconnected.

## 35. Timeouts and Deadlines

Every operation MUST have a bounded timeout or deadline determined by the command and deployment policy.

| Operation | Required timeout behavior |
|---|---|
| Registration | Fail if negotiation does not complete within configured registration timeout |
| Heartbeat | Mark session suspect after configured missed-heartbeat threshold |
| Artifact fetch | Abort or fail when the request deadline expires |
| Validation | Return a timeout or validation failure if the deadline is exceeded |
| Deployment | Report pending progress and a terminal timeout outcome according to policy |
| Start | Return acceptance or rejection within the command acknowledgement timeout |
| Stop | Escalate according to local shutdown policy if the deadline expires |
| Cancel | Report accepted, completed, unsupported, or timed out |
| Result fetch | Fail or expire the request when its deadline is exceeded |

Timeouts MUST use monotonic clocks for local elapsed-time measurement.

RFC 3339 timestamps are for protocol interchange and audit. They MUST NOT be the sole basis for measuring local timeout duration.

A timeout MUST NOT be reported as successful completion.

If the outcome of a state-changing command is unknown after timeout, the sender MUST reconcile state or retry idempotently. It MUST NOT issue a new logical command merely to discover the previous outcome.

## 36. Backpressure and Resource Limits

Implementations MUST define bounded queues for commands, logs, telemetry, and results.

A receiver MAY reject or throttle non-critical log and telemetry traffic when configured limits are exceeded.

A receiver MUST NOT silently discard command acknowledgements or terminal execution status without applying the delivery and recovery policy.

The sender MUST honor explicit backpressure responses and SHOULD use bounded exponential backoff with jitter for retryable transport failures.

Retry policies MUST have a maximum delay and MUST NOT create unbounded request storms.

Implementations MUST enforce limits on:

- message size
- batch size
- outstanding commands
- concurrent executions
- artifact download size
- result download size
- log and telemetry buffering
- dependency resolution work

The applicable deployment profile MUST set concrete limits for production. Implementations MUST NOT treat unbounded resource consumption as conformant behavior.

## 37. Error Envelope

A `protocol_error` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `error_code` | string | Stable code |
| `message` | string | Safe diagnostic |
| `retryable` | boolean | Whether retry may succeed |
| `related_message_id` | string or null | Message that caused the error |
| `details` | object | Safe structured details |

The error code MUST be one of the defined codes or an explicitly registered extension.

The `message` field MUST NOT contain credentials, private key material, secret payload values, or sensitive internal configuration.

The `details` object MUST be bounded and MUST NOT include arbitrary stack traces by default.

An error response MUST preserve the original request's correlation identifier when the error relates to a request.

## 38. Error Codes and Behavior

| Error code | Meaning | Default retry behavior |
|---|---|---|
| `PROTOCOL_INVALID_MESSAGE` | Malformed envelope or payload | No |
| `PROTOCOL_VERSION_UNSUPPORTED` | Unsupported protocol version | No |
| `AUTHENTICATION_FAILED` | Peer authentication failed | No |
| `AUTHORIZATION_DENIED` | Operation not permitted | No |
| `SESSION_INVALID` | Session missing, expired, or invalid | Re-authenticate |
| `AGENT_NOT_REGISTERED` | Agent registration incomplete | Register first |
| `CAPABILITY_UNAVAILABLE` | Required capability unavailable | No, unless environment changes |
| `RESOURCE_UNAVAILABLE` | Required resource unavailable | Policy-dependent |
| `ARTIFACT_NOT_FOUND` | Requested artifact does not exist or is inaccessible | No, unless availability changes |
| `ARTIFACT_VALIDATION_FAILED` | Artifact validation failed | No |
| `ARTIFACT_INCOMPATIBLE` | Artifact cannot run on the target | No |
| `DEPENDENCY_UNSATISFIED` | Required dependency unavailable | Policy-dependent |
| `COMMAND_INVALID_STATE` | Operation invalid for current state | No |
| `IDEMPOTENCY_CONFLICT` | Same command ID reused with different payload | No |
| `OPERATION_NOT_FOUND` | Referenced operation is unknown | No |
| `OPERATION_TIMEOUT` | Operation exceeded its deadline | Reconcile first |
| `CANCEL_UNSUPPORTED` | Cancellation is not supported | No |
| `SAFETY_INTERLOCK_ACTIVE` | Local safety policy blocks the operation | No automatic retry |
| `SAFETY_STATE_UNKNOWN` | Safety condition cannot be established | No automatic retry |
| `RESULT_UNAVAILABLE` | Requested result is unavailable | Policy-dependent |
| `RATE_LIMITED` | Receiver is applying backpressure | Yes, after delay |
| `INTERNAL_ERROR` | Unexpected internal failure | Only when marked retryable |

A receiver MUST distinguish retryable transport failures from non-retryable validation, authentication, authorization, and safety failures.

A retry MUST NOT be used to bypass a failed policy check.

## 39. Logging and Audit Requirements

The Lab Agent and Control Plane SHOULD record registration outcomes, command acknowledgements, state transitions, validation failures, reconnects, and terminal results.

Audit records SHOULD include the relevant message ID, correlation ID, agent identity, command ID, execution ID, event time, and error code where applicable.

Implementations MUST NOT log private keys, access tokens, full credential-bearing URIs, or secret parameters.

Log retention and access control MUST follow the applicable security and operational policies.

A log entry MUST NOT be treated as proof of successful execution unless the authoritative state transition and required evidence are available.

## 40. Compatibility and Negotiation

During registration, the Lab Agent MUST provide `supported_protocol_versions`.

The Control Plane MUST select a version supported by both peers.

If no compatible version exists, registration MUST be rejected with `PROTOCOL_VERSION_UNSUPPORTED`.

The selected version MUST be bound to the session. All subsequent messages MUST use that version.

A peer MUST NOT change protocol versions mid-session without a new negotiated session.

Agent software version, Runtime version, platform version, and protocol version MUST remain distinct fields with distinct meanings.

Compatibility checks MUST include the required local Runtime protocol version. The Lab Agent MUST NOT send an operation the local Runtime does not support.

If the remote protocol is compatible but the local Runtime protocol is not, the agent MUST report the incompatibility and MUST NOT claim the requested operation succeeded.

## 41. Conformance Test Matrix

| Test ID | Scenario | Expected result |
|---|---|---|
| LP-001 | Valid registration | Session becomes `ACTIVE` |
| LP-002 | Unsupported protocol version | Registration rejected |
| LP-003 | Invalid client certificate | Authentication rejected |
| LP-004 | Agent identity mismatch | Message rejected |
| LP-005 | Heartbeat with stale sequence | Stale state not applied |
| LP-006 | Lease expires | Session becomes `EXPIRED` |
| LP-007 | Reconnect after expiry | New authentication and registration required |
| LP-008 | Invalid capability report | Report rejected |
| LP-009 | Impossible resource values | Report rejected |
| LP-010 | Unauthorized artifact fetch | Request rejected |
| LP-011 | Artifact signature invalid | Deployment rejected |
| LP-012 | Artifact checksum mismatch | Deployment rejected |
| LP-013 | Unsafe entrypoint path | Deployment rejected |
| LP-014 | Required dependency missing | Deployment rejected |
| LP-015 | Start before deployment | Command rejected |
| LP-016 | Duplicate start command | No duplicate execution created |
| LP-017 | Same command ID with different payload | `IDEMPOTENCY_CONFLICT` |
| LP-018 | Stop terminal execution | Existing terminal state preserved |
| LP-019 | Cancel completed operation | Existing outcome preserved |
| LP-020 | Stale execution status | State not regressed |
| LP-021 | Duplicate log batch | Duplicate records handled idempotently |
| LP-022 | Invalid telemetry unit | Batch rejected |
| LP-023 | Result checksum mismatch | Result rejected |
| LP-024 | Unknown safety state | New execution denied by default |
| LP-025 | Safety interlock active | Start denied |
| LP-026 | Remote disconnect during execution | Local safety remains active |
| LP-027 | Retry after uncertain command delivery | Original command ID reused |
| LP-028 | Local Runtime peer unauthorized | Local request rejected |
| LP-029 | Command deadline expires | No false success reported |
| LP-030 | Secret appears in a diagnostic | Test fails; secret must be redacted |
| LP-031 | Invalid error envelope | Error message rejected |
| LP-032 | Reconnect with stale state sequence | Stale report ignored |
| LP-033 | Agent restart with unknown execution state | State reported unknown pending reconciliation |
| LP-034 | Result belongs to another execution | Result rejected |
| LP-035 | Unsupported local Runtime protocol | Operation denied |
| LP-036 | Safety report requires human review | Gated operation remains blocked |

Conformance tests MUST verify externally observable outcomes, not merely internal function return values.

## 42. Test Determinism and Evidence

The conformance suite MUST include positive and negative cases for every message type used by the implementation.

Tests MUST cover field boundaries, malformed messages, duplicate identifiers, invalid state transitions, timeouts, retries, reconnects, and session expiration.

Tests MUST use test certificates and test signing keys. Production credentials MUST NOT be used in automated test fixtures.

Tests involving safety states MUST verify that a protocol message cannot bypass local safety enforcement.

Test evidence MUST identify the protocol version, implementation revision, test environment, and result.

The owning milestone dossier MUST link to the required conformance evidence.

## 43. Acceptance Checklist

### 43.1 Protocol and registration

- [ ] All messages use the common envelope.
- [ ] JSON parsing rejects malformed input and duplicate keys.
- [ ] Registration authenticates and authorizes the agent.
- [ ] Protocol version negotiation is deterministic.
- [ ] Session lease and heartbeat behavior are implemented.
- [ ] Session expiration and revocation are enforced.

### 43.2 Commands and execution

- [ ] Deploy, start, stop, and cancel use exact field names and types.
- [ ] Command acknowledgement is distinct from operation completion.
- [ ] Idempotency is durable across supported restart conditions.
- [ ] Invalid state transitions are rejected.
- [ ] Terminal execution state cannot regress.
- [ ] Deadlines and timeouts do not produce false success.

### 43.3 Artifacts and results

- [ ] Artifact fetch is authorized and source-restricted.
- [ ] Manifest validation follows `docs/protocol/ARTIFACT_MANIFEST.md`.
- [ ] Signatures and checksums are verified.
- [ ] Platform, runtime, dependency, and capability checks are enforced.
- [ ] Result manifests and payload checksums are validated.
- [ ] Result access is restricted to authorized consumers.

### 43.4 Observability and safety

- [ ] Logs and telemetry are bounded and validated.
- [ ] Secret values are excluded from diagnostics.
- [ ] Safety-state reporting is implemented.
- [ ] Unknown or unsafe safety state blocks new execution by default.
- [ ] Local safety controls remain effective during network failure.
- [ ] Human review requirements cannot be bypassed through protocol messages.

### 43.5 Recovery and conformance

- [ ] Reconnect creates a newly authenticated session when required.
- [ ] Outstanding operations are reconciled after reconnect.
- [ ] Duplicate messages and retries are handled safely.
- [ ] All required conformance tests pass.
- [ ] Error codes are stable and documented.
- [ ] Required evidence is linked from the authoritative milestone dossier.

## 44. Security and Safety Limitations

This protocol provides communication semantics and application-level controls. It does not independently certify functional safety, guarantee deterministic physical behavior, or replace hardware-level protections.

The Control Plane MUST NOT be treated as the sole enforcement point for local execution safety.

The Lab Agent MUST NOT suppress an unsafe or unknown safety state to satisfy an orchestration request.

The Runtime MUST retain local authority to reject unsafe, unauthorized, incompatible, or invalid operations.

A deployment requiring a safety-rated stop MUST use the independently specified safety mechanism.

No successful heartbeat, valid signature, successful deployment, or accepted command establishes that a robot or other physical system is safe to operate.

## 45. Phase and Milestone Traceability

The canonical phase definitions are maintained in `docs/planning/PHASES.md`. This protocol MUST NOT redefine those phases.

The following frozen milestone references may be relevant to implementation and validation:

| Milestone ID | Canonical name | Phase mapping |
|---|---|---|
| B-M03 | PLATFORM | P3 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| DB-M04 | EXECUTION DATA | P5-P7 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

These references support navigation and traceability only. They do not assert milestone completion or redefine scope.

The authoritative dossiers under `docs/**/milestones/` determine the required deliverables, dependencies, reviews, and acceptance criteria.

## 46. Contract Dependencies and Open Items

Before production acceptance, the owning teams MUST verify that the following supporting contracts or policies exist and are consistent with this document:

- [ ] The transport and framing contract defines message size and connection limits.
- [ ] The authentication policy defines certificate issuance, rotation, and revocation.
- [ ] The API contract defines transport-specific error response mapping.
- [ ] The artifact contract defines manifest validation and packaging behavior.
- [ ] The Runtime contract defines local lifecycle and safety enforcement.
- [ ] The security policy defines agent authorization and capability permissions.
- [ ] The telemetry contract defines metric names, units, and retention.
- [ ] The result contract defines result persistence and retrieval guarantees.
- [ ] The operational policy defines production timeout and backpressure values.
- [ ] The safety process defines human-review gates and escalation.

A checkbox MUST be marked complete only when the relevant authoritative document or implementation evidence has been verified.

## 47. Versioning and Change Control

This document defines protocol version `1.0`.

Changes to message field names, types, required fields, authentication semantics, idempotency, state transitions, safety behavior, or error classification MUST undergo protocol contract review.

A change that causes a previously conforming `1.0` peer to reject a previously valid message MUST NOT be introduced silently under the same version.

Every normative change MUST update the applicable schema, examples, state-machine tables, error definitions, and conformance tests.

The owner MUST assess compatibility across the Control Plane, Lab Agent, and Kritva Runtime before accepting a change.

A protocol revision MUST document migration requirements, supported version overlap, rollback behavior, and the treatment of in-flight operations.

## 48. Contract Acceptance

The protocol may be accepted as an implementation baseline when the architecture, protocol, security, and Runtime owners have reviewed the normative rules and resolved any conflicts.

Production conformance additionally requires:

- implemented message schemas and validation
- authenticated remote and local channels
- tested registration and session lifecycle
- durable idempotency and operation reconciliation
- validated artifact and result handling
- compatibility and dependency enforcement
- safety-state propagation and local enforcement
- timeout, reconnect, and backpressure behavior
- passing conformance tests
- evidence linked from the relevant milestone dossier

The existence of this document MUST NOT be represented as proof that the protocol has been implemented, safety-reviewed, or accepted for physical deployment.

## 49. Changelog

### Initial Normative Baseline

- Defined the Control Plane ↔ Lab Agent and Lab Agent ↔ Kritva Runtime boundaries.
- Established the common message envelope and protocol version negotiation.
- Defined registration, authentication, session, and heartbeat semantics.
- Defined capability and resource reporting.
- Defined artifact fetch, validation, and deployment behavior.
- Defined start, stop, cancel, acknowledgement, and idempotency requirements.
- Defined execution status, logs, telemetry, and result collection.
- Established reconnect, timeout, and backpressure behavior.
- Defined safety-state reporting and local enforcement boundaries.
- Added stable error codes, conformance tests, and acceptance checklists.
- Identified supporting contracts and policies that must be verified before production acceptance.

### Future Updates

Future revisions MUST preserve explicit message semantics, compatibility requirements, fail-closed validation, idempotency, safety boundaries, and conformance evidence for every supported protocol version.
