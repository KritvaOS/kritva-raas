# Kritva RaaS WebSocket Contract

**Document type:** Normative protocol contract  
**Protocol:** Realtime WebSocket communication  
**Contract version:** `1.0`  
**Status:** Proposed normative baseline; implementation conformance required  
**Architecture reference:** `docs/architecture/PROTOCOL_ARCHITECTURE.md`  
**Related contracts:** `docs/protocol/LAB_PROTOCOL.md`, `docs/protocol/ARTIFACT_MANIFEST.md`

## 1. Purpose

This document defines the normative WebSocket contract for realtime communication between Kritva RaaS clients and backend services.

The contract specifies connection establishment, authentication, session negotiation, subscriptions, channel authorization, message envelopes, event delivery, ordering, replay, resume, heartbeats, backpressure, reconnection, rate limits, close behavior, and security.

The WebSocket interface is intended to support realtime updates for:

- jobs
- executions and runs
- bookings
- artifacts
- lab agents and lab resources
- telemetry
- logs

This document defines application-level WebSocket behavior. It does not replace the underlying API contract, the Lab Agent protocol, artifact integrity rules, database contracts, or the system-wide protocol architecture.

## 2. Normative Language

The terms MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, and MAY are normative.

- **MUST / MUST NOT:** Absolute requirement for conformance.
- **SHOULD / SHOULD NOT:** Recommendation that requires documented justification when not followed.
- **MAY:** Optional behavior.

A **client** is an authenticated frontend, operator interface, or authorized service that opens a WebSocket connection.

A **server** is the WebSocket endpoint responsible for authentication, authorization, subscriptions, event delivery, and protocol enforcement.

An **event** is a server-originated notification about a resource or system condition.

A **subscription** is an authorized request to receive events matching a topic and resource scope.

A **cursor** is an opaque position used to resume event delivery.

A **connection** is one active WebSocket transport.

A **session** is the authenticated application-level identity associated with a connection.

## 3. Authority and Related Contracts

The system-wide protocol architecture is defined in `docs/architecture/PROTOCOL_ARCHITECTURE.md`.

The following documents remain authoritative for their respective responsibilities:

| Concern | Authority |
|---|---|
| System-wide protocol boundaries | `docs/architecture/PROTOCOL_ARCHITECTURE.md` |
| WebSocket handshake, envelopes, and event delivery | `docs/protocol/WEBSOCKET_CONTRACT.md` |
| Lab Agent registration and execution lifecycle | `docs/protocol/LAB_PROTOCOL.md` |
| Artifact manifest validation | `docs/protocol/ARTIFACT_MANIFEST.md` |
| HTTP API behavior and response semantics | Applicable API contract |
| Resource identity and persistence | Authoritative database contracts |
| Authentication and authorization policy | Applicable security contract |
| Canonical phase definitions | `docs/planning/PHASES.md` |

The WebSocket channel MUST expose only information and operations authorized by the relevant API, domain, and security contracts.

A conflict between contracts MUST be resolved by the relevant owners. Implementations MUST NOT silently invent a precedence rule.

## 4. Design Principles

The protocol MUST follow these principles:

1. Authenticate before delivering protected events.
2. Authorize each subscription independently.
3. Treat the WebSocket as a transport, not as the source of truth for resource state.
4. Distinguish commands, acknowledgements, and events.
5. Use stable identifiers and explicit event sequence information.
6. Support reconnect and replay where the event source supports durable history.
7. Never promise exactly-once delivery unless an authoritative delivery mechanism provides it.
8. Bound queues, messages, subscription counts, and replay windows.
9. Fail closed on authentication and authorization errors.
10. Preserve resource isolation across tenants, projects, users, and agents.
11. Keep secrets out of frames, cursors, diagnostics, and logs.
12. Treat telemetry and log delivery as potentially lossy unless the applicable stream contract guarantees otherwise.

## 5. Transport Requirements

The server MUST support WebSocket over TLS using `wss://` in production.

Plain `ws://` MUST NOT be used across an untrusted network or for authenticated production sessions.

The server MUST enforce an approved TLS configuration, including certificate validation and applicable cryptographic policy.

The WebSocket handshake MUST use the standard HTTP Upgrade mechanism.

The server MUST validate the requested path, allowed origin where applicable, authentication context, and negotiated subprotocol before accepting the connection.

The server MUST NOT accept arbitrary cross-origin browser connections to authenticated endpoints.

The deployment MUST define connection limits, frame limits, idle timeouts, ping/pong behavior, and rate limits.

## 6. WebSocket Endpoint and Subprotocol

The deployment MUST publish the authoritative WebSocket endpoint through the API or service-discovery contract.

This document does not prescribe a production hostname.

The client SHOULD request the subprotocol:

    kritva-raas-ws.v1

The server MUST select a supported subprotocol before accepting the connection.

If the client requires a subprotocol that the server does not support, the server MUST reject the handshake.

A server MUST NOT negotiate an unsupported protocol by silently selecting a different version.

The subprotocol identifies the WebSocket application protocol. It is distinct from application API versions, artifact format versions, and Lab Agent protocol versions.

## 7. Connection Handshake

The client MUST establish transport security before sending application credentials.

The server MUST authenticate the client using the approved authentication mechanism defined by the security and API contracts.

Browser clients SHOULD use a secure, same-site session cookie or a short-lived connection credential obtained through an authenticated HTTPS request. Long-lived bearer tokens MUST NOT be placed in query parameters.

If a deployment permits an authorization header, it MUST be validated before the connection is accepted.

The server MUST reject invalid, expired, revoked, or unauthorized credentials.

The server SHOULD validate the `Origin` header for browser-based clients against an explicit allowlist.

The server MUST NOT treat the `Origin` header as an authentication credential.

A successful HTTP Upgrade MUST NOT imply that every topic or resource is authorized.

## 8. Authentication and Session Establishment

After the transport is accepted, the server MUST establish an authenticated application session.

The session MUST be associated with the authenticated principal and the applicable tenant, project, and role context.

The server MUST determine the permissions available to the principal before allowing subscriptions.

The session MUST have a bounded lifetime or a defined reauthentication policy.

If the authentication context is revoked, the server MUST stop protected event delivery and close the connection or require reauthentication according to policy.

The client MUST NOT attempt to establish identity by supplying an arbitrary user or tenant identifier in an application frame.

A client-provided identifier MAY be used as a resource selector only when the server independently authorizes access to that resource.

## 9. Connection Initialization

After the WebSocket handshake, the server MUST send a `connection.ready` frame before accepting subscription or application commands.

The ready frame MUST identify the negotiated protocol version and session properties.

Example:

    {
        "protocol_version": "1.0",
        "message_type": "connection.ready",
        "message_id": "srv-msg-001",
        "sent_at": "2026-10-09T00:00:00Z",
        "correlation_id": null,
        "payload": {
            "connection_id": "conn-001",
            "session_id": "session-001",
            "heartbeat_interval_seconds": 30,
            "heartbeat_timeout_seconds": 90,
            "max_subscriptions": 100,
            "max_frame_bytes": 1048576,
            "resume_supported": true
        }
    }

The values shown are illustrative. Production limits MUST be supplied by the deployment configuration and MUST NOT exceed server-enforced limits.

The client MUST wait for `connection.ready` before sending application frames.

If the server cannot initialize the application session, it MUST close the connection using an appropriate close code.

## 10. Protocol Version

Every application frame MUST include `protocol_version`.

For this baseline, the supported value is:

    "1.0"

The client and server MUST agree on a supported protocol version before processing application messages.

A server MUST reject unsupported protocol versions.

A server MUST NOT reinterpret a frame using a different version's field definitions.

The WebSocket subprotocol and `protocol_version` MUST be consistent. A mismatch MUST be rejected.

A new incompatible protocol version MUST define its own subprotocol identifier or an explicitly documented negotiation mechanism.

Backward-compatible extensions MUST be specified and tested before deployment.

## 11. Common Message Envelope

Every application frame MUST be a JSON object containing exactly the following top-level fields for version `1.0`:

| Field | Type | Constraint |
|---|---|---|
| `protocol_version` | string | MUST equal the negotiated version |
| `message_type` | string | Registered message type |
| `message_id` | string | Unique identifier for this frame |
| `sent_at` | string | RFC 3339 timestamp with UTC offset |
| `correlation_id` | string or null | Related request identifier |
| `payload` | object | Message-specific payload |

Unknown top-level fields MUST be rejected under protocol version `1.0`.

`message_id` MUST be non-empty and no longer than 128 characters.

`message_type` MUST be a registered type.

`sent_at` MUST contain an explicit UTC offset. Producers SHOULD use UTC with the `Z` suffix.

`correlation_id` MUST identify the request associated with a response. It MUST be `null` for unsolicited events.

Receivers MUST reject duplicate JSON object keys.

Receivers MUST reject malformed JSON, invalid UTF-8, and non-standard JSON values.

The server MUST validate the envelope before dispatching a frame.

## 12. Identifier Rules

Message, connection, session, subscription, resource, and event identifiers MUST be non-empty strings when required.

Identifiers MUST NOT exceed 128 characters unless a field explicitly permits a larger limit.

Identifiers MUST be treated as opaque values. Clients MUST NOT derive authorization from their contents.

Identifiers MUST NOT contain credentials, private keys, or other secret material.

A `subscription_id` MUST identify one subscription within the current authenticated session.

A `resource_id` MUST be interpreted within its resource type and authorization context.

A `cursor` MUST be treated as opaque. Clients MUST NOT construct or modify cursor contents.

## 13. Registered Message Types

Protocol `1.0` defines the following application message types.

| Message type | Direction | Purpose |
|---|---|---|
| `connection.ready` | Server → Client | Complete application initialization |
| `connection.ping` | Client → Server | Application-level liveness probe |
| `connection.pong` | Server → Client | Application-level liveness response |
| `subscription.create` | Client → Server | Create a topic subscription |
| `subscription.created` | Server → Client | Confirm subscription creation |
| `subscription.update` | Client → Server | Change subscription filters or delivery settings |
| `subscription.updated` | Server → Client | Confirm subscription update |
| `subscription.remove` | Client → Server | Remove a subscription |
| `subscription.removed` | Server → Client | Confirm removal |
| `subscription.resume` | Client → Server | Resume from a prior cursor |
| `subscription.resumed` | Server → Client | Confirm replay or resume outcome |
| `event` | Server → Client | Deliver a resource event |
| `command` | Client → Server | Request an explicitly supported operation |
| `command.ack` | Server → Client | Acknowledge a command |
| `error` | Either direction | Report a protocol or request error |
| `connection.notice` | Server → Client | Report a connection-level condition |

A message type MUST be used only in its defined direction.

The server MUST NOT treat a command as successful merely because it received the frame.

The client MUST distinguish acknowledgement from completion of an asynchronous operation.

## 14. Topic Model

A subscription MUST specify a supported topic and an authorized resource scope.

Protocol `1.0` defines these topics:

| Topic | Example scope | Typical events |
|---|---|---|
| `job` | Job ID | Job state, queue position, progress |
| `run` | Execution ID | Execution state, progress, lifecycle |
| `booking` | Booking ID | Booking state, allocation, cancellation |
| `artifact` | Artifact ID | Publication, validation, availability |
| `lab` | Lab Agent or resource ID | Agent state, capability and resource updates |
| `telemetry` | Authorized telemetry scope | Metric samples and aggregated measurements |
| `logs` | Execution ID or authorized log scope | Log batches and stream status |

Topic names are case-sensitive.

The server MUST reject unsupported topics.

The server MUST authorize each requested scope independently. Authorization for one topic or resource MUST NOT imply authorization for another.

The server MUST NOT expose cross-tenant events through broad or malformed filters.

A wildcard scope MUST be supported only when explicitly defined by server policy. A client MUST NOT assume that `*` or an omitted scope means all resources.

## 15. Subscription Creation

The `subscription.create` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `topic` | string | Supported topic |
| `resource_type` | string | Registered resource type |
| `resource_id` | string or null | Resource identifier when required |
| `filters` | object | Topic-specific filters |
| `delivery_mode` | string | `live` or `replayable` |
| `starting_cursor` | string or null | Resume position when supported |
| `client_subscription_key` | string | Client-generated idempotency key |

The `client_subscription_key` MUST be unique within the session for the lifetime of the subscription request.

The server MUST validate topic, scope, filters, delivery mode, and authorization before creating the subscription.

If accepted, the server MUST return `subscription.created` with `subscription_id`, `topic`, `created_at`, and `effective_delivery_mode`.

If rejected, the server MUST return an error frame correlated to the request.

The server MUST NOT deliver protected events before confirming that the subscription is authorized and established.

## 16. Subscription Acknowledgement

The `subscription.created` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `subscription_id` | string | Server-assigned identifier |
| `topic` | string | Accepted topic |
| `created_at` | string | RFC 3339 timestamp |
| `effective_delivery_mode` | string | Accepted delivery mode |
| `initial_cursor` | string or null | Starting cursor, if available |

The acknowledged topic MUST match the requested topic.

The effective delivery mode MUST be `live` or `replayable`.

If the client requested `replayable` and the server cannot provide replay for that topic, the server MUST reject the request or explicitly negotiate `live` only if the client allowed that fallback in the request contract.

A server MUST NOT silently downgrade replay guarantees.

The client MUST store the returned `subscription_id` and cursor as opaque values.

## 17. Subscription Updates and Removal

The `subscription.update` payload MUST contain `subscription_id` and at least one supported update field.

Only explicitly mutable subscription properties MAY be changed.

The server MUST reauthorize any update that broadens resource scope or increases data visibility.

A successful update MUST produce `subscription.updated`.

The `subscription.remove` payload MUST contain `subscription_id`.

A successful removal MUST produce `subscription.removed`.

After removal is acknowledged, the server MUST NOT send new events for that subscription, except frames already queued before the acknowledgement if transport ordering makes their delivery unavoidable. Such frames MUST be identifiable by the removed `subscription_id` and MUST NOT be treated as proof that the subscription remains active.

Repeated removal requests MUST be handled idempotently.

## 18. Subscription Limits

The server MUST enforce a maximum number of active subscriptions per connection and per authenticated principal.

The effective connection limit MUST be communicated in `connection.ready`.

The server MAY enforce lower limits based on tenant, role, resource type, or operational policy.

The server MUST reject subscription creation that exceeds a configured limit with a stable error code.

A client SHOULD combine subscriptions where the server supports safe topic filters.

The server MUST NOT allow a client to bypass subscription limits by repeatedly disconnecting and reconnecting.

Subscription quotas SHOULD be enforced across concurrent connections belonging to the same principal where necessary to prevent resource exhaustion.

## 19. Event Envelope

Every `event` payload MUST contain:

| Field | Type | Constraint |
|---|---|---|
| `event_id` | string | Stable event identifier |
| `subscription_id` | string | Authorized subscription |
| `topic` | string | Topic associated with the event |
| `resource_type` | string | Resource type |
| `resource_id` | string | Resource identifier |
| `event_type` | string | Registered event name |
| `sequence_number` | integer or null | Ordered stream position |
| `occurred_at` | string | RFC 3339 timestamp |
| `cursor` | string or null | Opaque resume cursor |
| `data` | object | Event-specific data |

`event_id` MUST remain stable across retries of the same event.

`sequence_number` MUST be a non-negative integer when the topic provides ordered sequence numbers. It MUST be `null` only when the topic contract does not provide sequence ordering.

`cursor` MUST be opaque and MUST be supplied only by the server.

The event's `subscription_id` and topic MUST match an active or recently removed subscription as permitted by Section 17.

The client MUST validate the envelope before processing the event.

## 20. Event Naming and Data

`event_type` MUST use a registered event name for the relevant topic.

Event names SHOULD use lowercase dot-separated identifiers.

A server MUST NOT change the meaning of an existing event name without a compatible protocol revision or an explicitly versioned event schema.

The `data` object MUST conform to the schema for the selected topic and event type.

Events MUST contain only fields needed by authorized consumers.

The server MUST NOT send private internal fields, secret credentials, or unrestricted database records.

Clients MUST ignore no required semantics: an unknown event type MUST be reported as unsupported and MUST NOT be interpreted as a successful state transition.

Clients MAY safely preserve unknown optional data fields when the relevant event schema allows extensions.

## 21. Job Channel

The `job` topic reports changes to job state.

A job event SHOULD contain `job_id`, `state`, `updated_at`, and a monotonically increasing `revision`.

The job state MUST be one of the states defined by the authoritative job lifecycle contract.

The WebSocket contract MUST NOT invent an alternate job lifecycle.

If the job contract defines terminal states, the server MUST NOT emit a state regression after a terminal state unless the authoritative job contract explicitly permits a new lifecycle instance.

The client SHOULD use the event to refresh the authoritative job representation when full resource state is required.

The client MUST NOT treat a notification as a substitute for fetching a resource whose details are not included in the event.

## 22. Run Channel

The `run` topic reports execution lifecycle and progress.

A run event SHOULD contain `job_id`, `execution_id`, `state`, `updated_at`, and a monotonic `revision` or stream sequence.

The run lifecycle MUST remain consistent with `docs/protocol/LAB_PROTOCOL.md` and the authoritative execution contract.

The server MUST distinguish a state-change event from a progress update.

Clients MUST NOT infer execution success from the absence of error events or from a disconnected stream.

When an execution reaches a terminal state, the server MUST publish the terminal state if the event source and delivery policy support the event.

The client SHOULD reconcile with the authoritative execution API after reconnect or when a sequence gap is detected.

## 23. Booking Channel

The `booking` topic reports authorized booking lifecycle changes.

A booking event SHOULD contain `booking_id`, `state`, `updated_at`, and a monotonic `revision`.

Booking state and transition rules MUST follow the authoritative booking contract.

The server MUST enforce tenant and resource authorization before delivering booking events.

A booking event MUST NOT expose payment credentials, private customer data, or unrelated allocation details.

A client MUST NOT treat a booking notification as proof that an external resource remains available. It SHOULD refresh authoritative booking details when making a consequential decision.

## 24. Artifact Channel

The `artifact` topic reports artifact publication, availability, validation, and lifecycle changes.

An artifact event SHOULD contain `artifact_id`, `artifact_version`, `state`, and `updated_at`.

Artifact identity and manifest semantics MUST remain consistent with `docs/protocol/ARTIFACT_MANIFEST.md`.

An artifact event MUST NOT replace manifest signature or checksum verification.

The client MUST NOT assume that a published artifact is compatible with a particular target solely because it received an availability event.

A consumer MUST verify authorization and artifact integrity through the applicable artifact contract before using the artifact.

## 25. Lab Channel

The `lab` topic reports agent and resource state.

A lab event SHOULD identify the agent or resource, its state, and a revision or sequence number.

The Lab Agent protocol remains authoritative for registration, heartbeat, capability, and safety-state semantics.

The WebSocket server MUST NOT reinterpret an agent's liveness as proof of execution health or physical safety.

A safety-related lab event MUST preserve the meaning of the originating safety state.

Unknown or unsafe safety conditions MUST NOT be represented as healthy.

Clients MUST treat delayed lab events as observations, not as guaranteed current state, and SHOULD refresh authoritative state before consequential operations.

## 26. Telemetry Channel

The `telemetry` topic carries authorized measurements or aggregated metrics.

Telemetry data MUST conform to the metric names, units, types, and sampling policy defined by the authoritative telemetry contract.

A telemetry event SHOULD contain a stream identifier, sample timestamp, metric name, value, and unit where applicable.

Numeric values MUST be finite.

The server MUST enforce configured limits on sample size, batch size, rate, and retention.

Telemetry delivery MAY be lossy if the selected delivery mode and telemetry contract permit loss.

The server SHOULD report dropped samples or stream gaps when the applicable contract provides that information.

Telemetry MUST NOT be used as the sole source for safety-critical control unless a separate safety contract explicitly authorizes that use.

## 27. Logs Channel

The `logs` topic carries authorized log records or log batches.

A log event SHOULD contain `execution_id`, `stream_id`, `sequence_number`, `timestamp`, `level`, and `message`.

The log level MUST be one of `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, or `FATAL`, unless a separate log contract defines a compatible extension.

The server MUST enforce maximum record and batch sizes.

The server MUST redact secrets and sensitive authentication data before delivery.

Log delivery MAY be at-least-once. Clients SHOULD deduplicate records using the execution, stream, and sequence identifiers.

A client MUST NOT treat a log line as authoritative lifecycle state when the execution status contract provides the authoritative state.

## 28. Ordering Guarantees

The server MUST document the ordering guarantee for each topic.

Where a topic supplies `sequence_number`, the number MUST increase monotonically within the defined stream scope.

The stream scope MUST be stable and unambiguous, such as a resource-specific event stream or subscription-specific sequence.

The server MUST preserve event order within a stream when it claims ordered delivery.

The server MAY interleave events from different subscriptions.

Clients MUST NOT assume a total ordering across unrelated topics or resource streams.

When a client detects a sequence gap, it MUST follow the topic's replay or reconciliation policy.

The server MUST NOT renumber old events merely to conceal a gap.

## 29. Delivery Semantics

The protocol MUST distinguish:

- transport delivery
- server event publication
- client event receipt
- client event processing
- authoritative resource state

A successful WebSocket send MUST NOT be treated as proof of client processing.

The baseline delivery guarantee is at-least-once for replayable events when the event source supports durable replay.

Live-only topics MAY lose events during disconnection.

Exactly-once processing MUST NOT be claimed unless the application layer implements deduplication and durable consumer state sufficient to establish that property.

Clients SHOULD deduplicate using `event_id` and sequence information.

A duplicate event MUST NOT cause a duplicate irreversible action.

## 30. Replay and Resume

A client MAY request resume for a replayable subscription by sending `subscription.resume`.

The payload MUST contain `subscription_id`, `cursor`, and `resume_request_id`.

`cursor` MUST be a cursor previously issued by the server for that subscription or stream.

The server MUST validate the subscription's current authorization before replaying events.

The server MUST NOT treat a cursor as an authorization credential.

If the cursor remains within the retention window, the server SHOULD replay all available events after that cursor in the defined order.

If the cursor is invalid, expired, or outside retention, the server MUST return an explicit resume failure or a documented resynchronization response.

The server MUST NOT silently start at the newest event when the client requested complete replay.

The `subscription.resumed` payload MUST contain `subscription_id`, `accepted`, `resume_request_id`, `starting_cursor`, and `reason_code`.

If `accepted` is `true`, `reason_code` MUST be `null`.

If `accepted` is `false`, `reason_code` MUST identify the failure.

## 31. Replay Boundaries and Resynchronization

Replay MUST be bounded by configured event count, byte count, and time window.

If replay exceeds a configured limit, the server MUST report the limitation and require a documented recovery path.

A client receiving a replay-gap indication MUST reconcile current state using the authoritative API before relying on incremental events again.

For stateful topics, the server SHOULD support a snapshot or authoritative resource read to establish a new baseline.

A snapshot MUST identify the resource revision or event cursor to which it corresponds when the underlying system supports that information.

A client MUST NOT combine an unverified snapshot with later events in a way that can regress resource state.

The server MUST reauthorize replay requests. Authorization granted when the cursor was created MUST NOT permanently authorize future access.

## 32. Heartbeats and Ping/Pong

The WebSocket transport's native Ping and Pong control frames SHOULD be used to detect broken connections.

Application-level `connection.ping` and `connection.pong` MAY be used when application-level liveness confirmation is required.

A `connection.ping` payload MUST contain `ping_id` and `sent_at`.

A `connection.pong` payload MUST contain the same `ping_id` and a server `sent_at`.

A client MUST NOT interpret an application-level pong as confirmation that every subscription is healthy or every event has been delivered.

The server MUST close connections that exceed the configured heartbeat timeout.

The client SHOULD use bounded heartbeat intervals and MUST avoid sending application heartbeats more frequently than the server permits.

Heartbeat configuration MUST be communicated through `connection.ready` or the deployment profile.

## 33. Backpressure

The server MUST apply backpressure when a client cannot consume events at the configured rate.

The server MUST bound per-connection and per-subscription queues.

The server MAY coalesce superseded state snapshots when doing so preserves the documented event semantics.

The server MUST NOT silently coalesce ordered events when the topic promises complete replayable event history.

Telemetry and logs MAY use topic-specific drop or sampling policies where permitted by their contracts.

If a client exceeds the permitted backlog, the server MUST either throttle delivery, emit a documented gap or backpressure notice, or close the connection.

A backpressure notice SHOULD include the affected `subscription_id`, a stable reason code, and retry guidance.

The client SHOULD process events promptly and SHOULD avoid unbounded local buffering.

## 34. Reconnection

Clients SHOULD reconnect after an unexpected connection loss using bounded exponential backoff with jitter.

The client MUST stop sending frames on the failed connection.

After reconnection, the client MUST complete authentication and receive a new `connection.ready` frame before creating or resuming subscriptions.

A new connection MUST NOT be assumed to inherit subscriptions from the old connection unless the server explicitly documents durable subscription restoration.

The client SHOULD retain subscription intent and the last accepted cursor locally.

The client MUST reauthorize each restored subscription.

The client MUST resume replayable subscriptions using the last safely processed cursor, not merely the last cursor received.

For live-only topics, the client MUST reconcile authoritative state after reconnect when missed events could affect correctness.

Reconnect attempts MUST respect server retry guidance and MUST NOT create a connection storm.

## 35. Event Processing and Cursor Advancement

A client SHOULD advance its durable cursor only after the corresponding event has been processed successfully.

If processing is asynchronous, the client MUST avoid advancing past events that have not been committed to its durable consumer state.

A client MUST define whether its processing model is sequential or parallel.

When events are processed in parallel, the client MUST preserve the ordering guarantees required by the topic.

A client MUST NOT acknowledge a cursor beyond an unprocessed event when doing so would cause that event to be permanently skipped during resume.

If event processing fails, the client SHOULD retry idempotently or reconcile with authoritative state.

The server MAY redeliver events when a client resumes from an earlier cursor.

## 36. Rate Limits

The server MUST enforce rate limits for connection establishment, authentication failures, subscription creation, subscription updates, application commands, and event-producing operations where applicable.

Rate limits SHOULD be scoped by authenticated principal and tenant, with additional limits by connection and IP address where appropriate.

Unauthenticated rate limits MUST be enforced before expensive authentication or resource lookup operations.

A rate-limit failure MUST produce an explicit error frame when the connection is valid and it is safe to do so. Otherwise, the server MAY close the connection.

A rate-limit error SHOULD include `retry_after_seconds` when the value is known.

The client MUST respect retry guidance.

The server MUST NOT expose sensitive cross-tenant quota information.

## 37. Error Frame

The `error` message MUST contain the common envelope and a payload with:

| Field | Type | Constraint |
|---|---|---|
| `error_code` | string | Stable registered code |
| `message` | string | Safe diagnostic |
| `retryable` | boolean | Whether retry may succeed |
| `related_message_id` | string or null | Related request |
| `subscription_id` | string or null | Affected subscription |
| `details` | object | Bounded structured information |

An error frame MUST correlate to the initiating request when one exists.

The error message MUST NOT expose credentials, tokens, private keys, stack traces, internal hostnames, or secret-bearing payloads.

The client MUST treat an error as rejection of the related operation unless the error explicitly describes a non-fatal condition.

A client MUST NOT retry a non-retryable request without correcting the underlying cause.

## 38. Error Codes

| Error code | Meaning | Default behavior |
|---|---|---|
| `WS_INVALID_MESSAGE` | Invalid JSON or envelope | Reject frame |
| `WS_VERSION_UNSUPPORTED` | Unsupported protocol version | Close or reject handshake |
| `WS_AUTHENTICATION_FAILED` | Authentication failed | Close connection |
| `WS_AUTHORIZATION_DENIED` | Resource or topic access denied | Reject operation |
| `WS_SUBSCRIPTION_INVALID` | Invalid topic, scope, or filter | Reject subscription |
| `WS_SUBSCRIPTION_LIMIT` | Subscription quota exceeded | Reject subscription |
| `WS_SUBSCRIPTION_NOT_FOUND` | Unknown subscription | Reject operation |
| `WS_CURSOR_INVALID` | Invalid cursor | Reject resume |
| `WS_CURSOR_EXPIRED` | Cursor outside retention | Require resynchronization |
| `WS_REPLAY_LIMIT` | Replay exceeds configured limits | Require bounded recovery |
| `WS_RATE_LIMITED` | Rate limit exceeded | Retry after guidance |
| `WS_BACKPRESSURE` | Client cannot keep up | Throttle or close |
| `WS_RESOURCE_NOT_FOUND` | Requested resource is unavailable | Reject operation |
| `WS_COMMAND_UNSUPPORTED` | Requested command is unsupported | Reject operation |
| `WS_COMMAND_INVALID_STATE` | Operation invalid for current state | Reject operation |
| `WS_IDEMPOTENCY_CONFLICT` | Idempotency key reused inconsistently | Reject operation |
| `WS_SESSION_EXPIRED` | Session expired | Reauthenticate |
| `WS_INTERNAL_ERROR` | Unexpected server error | Retry only if marked retryable |

Implementations MAY define additional codes through an approved extension mechanism.

An implementation MUST NOT reuse an existing code with a different meaning.

## 39. WebSocket Close Codes

The server MUST use standard WebSocket close codes where applicable and MAY use registered application-specific codes in the permitted range.

| Code | Meaning | Usage |
|---|---|---|
| `1000` | Normal closure | Intentional normal shutdown |
| `1001` | Going away | Server shutdown or endpoint removal |
| `1002` | Protocol error | Invalid WebSocket framing or protocol violation |
| `1003` | Unsupported data | Unsupported frame data type |
| `1007` | Invalid payload data | Invalid UTF-8 or malformed payload representation |
| `1008` | Policy violation | Authorization or policy violation |
| `1009` | Message too big | Frame or message exceeds configured size |
| `1011` | Internal error | Unexpected server failure |
| `1012` | Service restart | Server is restarting |
| `1013` | Try again later | Temporary overload |
| `4001` | Authentication expired | Application session expired |
| `4002` | Rate limit exceeded | Connection-level rate limit |
| `4003` | Unsupported application version | Application protocol version unsupported |
| `4004` | Session revoked | Session or principal access revoked |

Application-specific codes MUST be documented and MUST NOT conflict with standard or reserved close codes.

A close reason MUST be brief and MUST NOT contain secrets.

After a close frame is sent, the sender MUST stop sending application data on that connection.

A client MUST NOT reconnect indefinitely after a non-retryable authentication, authorization, or policy failure.

## 40. Security Requirements

The server MUST authenticate before delivering protected data.

The server MUST authorize every subscription, replay request, and state-changing command.

The server MUST enforce tenant and resource isolation on every event delivery path.

The server MUST validate resource ownership and authorization at delivery time, not only when a subscription is created.

The server MUST prevent cross-site WebSocket hijacking through origin checks and appropriate cookie policies.

Long-lived credentials MUST NOT be included in URLs.

The server MUST apply message-size limits, subscription limits, rate limits, and bounded queues.

The client MUST treat all received event content as untrusted input.

The client MUST safely render logs, diagnostics, and event text without interpreting them as executable markup or code.

The server MUST redact sensitive values before logging frames or protocol errors.

The WebSocket channel MUST NOT bypass the authorization rules of the corresponding HTTP API.

## 41. Privacy and Data Minimization

The server MUST deliver only the fields needed for the authorized subscription.

Private customer information, credentials, internal secrets, and unrelated resource fields MUST NOT be included in events.

Telemetry and log subscriptions MUST be scoped and authorized.

The server SHOULD avoid broadcasting detailed resource data when a state-change notification and an authorized resource fetch are sufficient.

Event retention and replay retention MUST follow the applicable data-retention policy.

A client MUST protect persisted cursors and subscription metadata according to the sensitivity of the associated resources.

## 42. Observability and Audit

The server SHOULD record connection establishment, authentication outcome, subscription creation and removal, resume outcome, rate limiting, backpressure, and abnormal closure.

Audit records SHOULD include connection identity, authenticated principal, topic, safe resource reference, event or message identifier, timestamp, and error code where applicable.

The server MUST NOT record secrets or unrestricted message payloads in operational logs.

Metrics SHOULD include active connections, subscription counts, event delivery rate, replay volume, queue depth, rejected frames, reconnect frequency, and close-code distribution.

Observability MUST NOT weaken tenant isolation or disclose private data to unauthorized operators.

## 43. Compatibility Rules

The client MUST support the negotiated protocol version.

The server MUST enforce the negotiated version for the lifetime of a connection.

A server MUST NOT change message semantics without an explicit contract revision.

Unknown event types MUST be handled as unsupported data and MUST NOT be interpreted as successful state changes.

Unknown top-level envelope fields MUST be rejected under protocol `1.0`.

Topic-specific schema extensions MUST be defined explicitly and MUST NOT change the meaning of existing required fields.

A client SHOULD maintain a tested compatibility matrix for supported server protocol versions.

A deployment MUST coordinate protocol changes across frontend clients, backend services, and any event producers.

## 44. Conformance Test Matrix

| Test ID | Scenario | Expected result |
|---|---|---|
| WS-001 | Valid TLS WebSocket handshake | Connection established |
| WS-002 | Invalid server certificate | Client rejects connection |
| WS-003 | Invalid client credentials | Server rejects connection |
| WS-004 | Disallowed browser origin | Handshake rejected |
| WS-005 | Unsupported subprotocol | Handshake rejected |
| WS-006 | Unsupported `protocol_version` | Frame rejected or connection closed |
| WS-007 | Duplicate JSON key | Frame rejected |
| WS-008 | Missing envelope field | Frame rejected |
| WS-009 | Valid connection initialization | `connection.ready` received |
| WS-010 | Authorized subscription | Subscription acknowledged |
| WS-011 | Unauthorized resource subscription | Rejected without data leakage |
| WS-012 | Unsupported topic | Subscription rejected |
| WS-013 | Subscription quota exceeded | Stable error returned |
| WS-014 | Subscription update broadens scope | Reauthorization required |
| WS-015 | Repeated subscription removal | Idempotent outcome |
| WS-016 | Duplicate event delivery | Client deduplication remains correct |
| WS-017 | Event sequence gap | Replay or reconciliation triggered |
| WS-018 | Valid replay cursor | Events replayed in defined order |
| WS-019 | Expired replay cursor | Explicit resynchronization required |
| WS-020 | Cursor from another subscription | Resume rejected |
| WS-021 | Client misses heartbeat deadline | Connection declared unhealthy |
| WS-022 | Slow event consumer | Backpressure policy enforced |
| WS-023 | Frame exceeds maximum size | Rejected or connection closed |
| WS-024 | Rate limit exceeded | Explicit rejection or documented close |
| WS-025 | Reconnect with replayable subscription | Resume follows cursor rules |
| WS-026 | Reconnect with live-only subscription | Authoritative state reconciled |
| WS-027 | Session revoked during connection | Protected event delivery stops |
| WS-028 | Log event contains secret | Secret is redacted |
| WS-029 | Cross-tenant event published | Event not delivered to unauthorized client |
| WS-030 | Unknown event type received | Client does not infer success |
| WS-031 | Terminal run event followed by stale event | State does not regress |
| WS-032 | Server restart | Close and reconnect behavior follows contract |
| WS-033 | Close reason contains sensitive value | Test fails; sensitive value must be excluded |
| WS-034 | Client processes events out of order | Cursor does not advance past unprocessed required events |

Conformance tests MUST verify observable behavior and not merely internal implementation details.

## 45. Test Evidence and Determinism

The conformance suite MUST include positive and negative tests for every implemented message type and topic.

Tests MUST cover authentication, authorization, malformed frames, ordering, duplicate delivery, replay, reconnection, rate limits, and backpressure.

Replay tests MUST use deterministic event sequences and known cursor positions.

Security tests MUST verify tenant isolation and must not use production credentials.

Test evidence MUST identify the contract version, server revision, client revision, configuration, and result.

A failed required test MUST block the relevant conformance acceptance until the failure is resolved or a formally approved exception is recorded.

## 46. Acceptance Checklist

### 46.1 Connection and authentication

- [ ] Production connections use `wss://`.
- [ ] TLS certificates and peer identities are validated.
- [ ] Browser origin and cookie policies are enforced where applicable.
- [ ] Protocol subprotocol and version negotiation are deterministic.
- [ ] `connection.ready` is sent before application commands are accepted.
- [ ] Session expiration and revocation stop protected delivery.

### 46.2 Envelope and subscriptions

- [ ] Every frame conforms to the common envelope.
- [ ] Duplicate keys and malformed JSON are rejected.
- [ ] Topic names and event types are registered.
- [ ] Each subscription is authorized independently.
- [ ] Subscription quotas are enforced.
- [ ] Updates and removals are handled idempotently.

### 46.3 Ordering and recovery

- [ ] Sequence and cursor semantics are documented per topic.
- [ ] Duplicate events can be identified.
- [ ] Replay and resume are bounded.
- [ ] Expired cursors require explicit resynchronization.
- [ ] Reconnect does not assume prior messages were processed.
- [ ] Durable cursor advancement follows successful processing.

### 46.4 Reliability and limits

- [ ] Heartbeat and idle-timeout behavior is tested.
- [ ] Per-connection and per-subscription queues are bounded.
- [ ] Backpressure and rate-limit behavior is deterministic.
- [ ] Message and batch limits are enforced.
- [ ] Close codes and retry behavior are documented.
- [ ] Client reconnect uses bounded backoff.

### 46.5 Security and conformance

- [ ] Tenant and resource isolation are tested.
- [ ] Sensitive values are redacted from diagnostics.
- [ ] Unknown messages cannot cause false success.
- [ ] Required conformance tests pass.
- [ ] Observability does not disclose protected data.
- [ ] Acceptance evidence is linked from the authoritative milestone dossier.

## 47. Implementation Guidance

Implementations SHOULD separate:

- transport and handshake handling
- authentication and session management
- envelope parsing and validation
- subscription authorization
- topic-specific event filtering
- event ordering and cursor management
- replay and resynchronization
- heartbeat and connection health
- rate limiting and backpressure
- error handling and close behavior
- audit and operational metrics

The internal module structure MAY differ, provided externally observable behavior conforms to this contract.

The implementation MUST keep transport concerns separate from authoritative resource state. A WebSocket event is a notification or stream record, not automatically the authoritative resource representation.

## 48. Contract Dependencies and Open Items

Before production acceptance, the owning teams MUST verify the authoritative definitions for:

- [ ] HTTP API authentication and session issuance
- [ ] Resource authorization and tenant isolation
- [ ] Job and execution lifecycle semantics
- [ ] Booking lifecycle semantics
- [ ] Artifact lifecycle and manifest validation
- [ ] Lab Agent and safety-state semantics
- [ ] Telemetry names, units, and sampling limits
- [ ] Log structure, redaction, and retention
- [ ] Event retention, replay windows, and cursor persistence
- [ ] Production rate limits, message sizes, and queue limits
- [ ] Deployment-specific close-code and retry policy

These items MUST be marked complete only when the corresponding authoritative document or implementation evidence has been verified.

## 49. Phase and Milestone Traceability

Canonical phase definitions are maintained in `docs/planning/PHASES.md`. This contract MUST NOT redefine those phases.

The following frozen milestone references may be relevant to implementation and validation:

| Milestone ID | Canonical name | Phase mapping |
|---|---|---|
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |
| B-M01 | CONTROL PLANE | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

These references support traceability only. They do not assert that any milestone is complete or redefine its scope.

The authoritative milestone dossiers under `docs/**/milestones/` determine the required deliverables, dependencies, reviews, and acceptance criteria.

## 50. Versioning and Change Control

This document defines WebSocket protocol version `1.0`.

Changes to the envelope, authentication, topic authorization, replay semantics, cursor handling, ordering guarantees, or close behavior MUST undergo contract review.

A change that breaks a previously conforming `1.0` client MUST NOT be introduced silently under the same protocol version.

Every normative change MUST update the relevant examples, error codes, conformance tests, and compatibility notes.

A revision MUST assess the impact on frontend clients, backend services, event producers, event storage, and deployment configuration.

Migration plans MUST define supported version overlap, rollout order, rollback behavior, and treatment of active connections.

## 51. Contract Acceptance

This contract may be used as the implementation baseline after review by the architecture, API, security, and owning domain teams.

Production conformance additionally requires:

- implemented handshake and authentication
- validated envelopes and topic schemas
- enforced per-subscription authorization
- tested ordering, replay, and cursor behavior
- bounded rate, message, and queue limits
- reliable reconnect and session revocation behavior
- appropriate security logging and redaction
- passing conformance tests
- acceptance evidence linked from the authoritative milestone dossier

The existence of this document MUST NOT be represented as proof that realtime delivery, replay, or production security has already been implemented or accepted.

## 52. Changelog

### Initial Normative Baseline

- Defined the Kritva RaaS WebSocket transport and application protocol.
- Established the handshake, authentication, and connection initialization requirements.
- Defined the common message envelope and protocol version rules.
- Defined subscription creation, update, removal, and authorization.
- Established the `job`, `run`, `booking`, `artifact`, `lab`, `telemetry`, and `logs` topics.
- Defined event ordering, duplicate handling, replay, resume, and resynchronization.
- Established heartbeat, backpressure, reconnect, and rate-limit requirements.
- Defined error frames, close codes, and security constraints.
- Added conformance tests and acceptance criteria.
- Identified supporting contracts and deployment policies requiring verification.

### Future Updates

Future revisions MUST preserve explicit topic semantics, resource isolation, bounded delivery behavior, deterministic recovery, and conformance evidence for every supported protocol version.
