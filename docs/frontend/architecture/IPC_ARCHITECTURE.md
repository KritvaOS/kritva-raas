# Kritva RaaS Studio IPC Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Studio IPC Architecture |
| Path | `docs/frontend/architecture/IPC_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Application | Kritva RaaS Studio |
| IPC Technology | Tauri IPC |
| UI Runtime | React + TypeScript |
| Native Runtime | Rust |
| Contract Model | Typed command/event contract |
| Local Boundary | React ↔ Rust Local Runtime |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production-grade Inter-Process Communication (IPC)
architecture between the React frontend and the Rust Studio Local Runtime.

The IPC layer is the controlled boundary through which the React application
requests privileged local operations and receives results, status, and streamed
events.

The architectural boundary is:

    +-----------------------------+
    | React / TypeScript UI       |
    +-------------+---------------+
                  |
                  | Tauri IPC
                  v
    +-----------------------------+
    | Rust Local Runtime          |
    +-----------------------------+
                  |
          +-------+-------+
          |       |       |
          v       v       v
      Filesystem Build  Process
      Toolchain   Test  Artifact

The IPC boundary must remain explicit, typed, capability-restricted, and
independent of arbitrary operating-system command execution.

## 3. Scope

This document covers:

- Tauri IPC architecture;
- command contracts;
- command naming;
- request/response envelopes;
- asynchronous operations;
- operation IDs;
- events;
- event delivery;
- event subscriptions;
- typing;
- contract generation;
- TypeScript/Rust synchronization;
- error handling;
- error codes;
- log streaming;
- cancellation;
- permissions;
- Tauri capabilities;
- filesystem access;
- process execution boundaries;
- versioning;
- compatibility;
- testing;
- observability;
- security;
- lifecycle;
- Phase 0–8 implementation mapping.

It specifically covers local IPC commands such as:

    studio.project.*
    toolchain.*
    build.*
    test.*
    artifact.*
    system.*

It does not define:

- REST API contracts;
- WebSocket contracts to the Control Plane;
- Lab Agent protocol;
- cloud APIs;
- database schema;
- physical robot safety protocols.

## 4. Goals

The IPC architecture shall:

1. expose only explicit local operations;
2. provide strong typing across React and Rust;
3. prevent arbitrary shell execution;
4. validate all inputs at the Rust boundary;
5. provide structured responses;
6. provide stable error codes;
7. support asynchronous long-running operations;
8. support streamed build/test logs;
9. support cancellation;
10. support operation status queries;
11. support capability-based permissions;
12. support version compatibility;
13. support contract testing;
14. remain auditable;
15. remain extensible without breaking existing Studio features.

## 5. Non-Goals

IPC is not:

- a generic command shell;
- a backend API;
- a remote execution protocol;
- a robot-control protocol;
- a database interface;
- an authorization replacement for the Control Plane;
- a mechanism for arbitrary filesystem access;
- a mechanism for arbitrary process execution.

## 6. Definitions

| Term | Definition |
|---|---|
| IPC | Communication between React and Rust inside Studio |
| Command | Request from React to Rust |
| Response | Result returned by Rust for a command |
| Event | Asynchronous notification emitted by Rust |
| Operation | Long-running local activity |
| Operation ID | Stable identifier for an operation |
| Capability | Explicit permission granted to an IPC surface |
| Contract | Typed request/response/event definition |
| Handler | Rust implementation of an IPC command |
| Local Runtime | Rust native Studio subsystem |
| Tauri | Desktop framework providing the IPC boundary |

## 7. Architectural Principle

The IPC contract follows:

    UI intent
       |
       v
    Typed command
       |
       v
    Tauri IPC
       |
       v
    Rust validation
       |
       v
    Application service
       |
       v
    Infrastructure
       |
       v
    Typed response/event

The React layer must not know implementation details of filesystem or process
management.

The Rust layer must not contain presentation logic.

## 8. Command Categories

Primary command namespaces are:

| Namespace | Purpose |
|---|---|
| `studio.project.*` | Project/workspace operations |
| `toolchain.*` | Tool discovery and validation |
| `build.*` | Local build orchestration |
| `test.*` | Local test execution |
| `artifact.*` | Package/inspect/validate/sign |
| `system.*` | Runtime and host diagnostics |

Future namespaces must be reviewed before introduction.

## 9. Command Naming

Command names use:

    <domain>.<operation>

Examples:

    studio.project.open
    studio.project.create
    studio.project.validate
    toolchain.detect
    build.configure
    build.start
    build.status
    build.cancel
    test.start
    test.status
    test.cancel
    artifact.package
    artifact.inspect
    artifact.validate
    system.info

Names are stable contract identifiers.

Implementation function names may differ internally.

## 10. Command Lifecycle

A synchronous command:

    React
      |
      | command
      v
    Rust
      |
      | response
      v
    React

An asynchronous command:

    React
      |
      | start
      v
    Rust
      |
      | ACCEPTED + operation_id
      v
    React
      |
      +<---- events ---- Rust
      |
      | status query
      v
    Rust
      |
      v
    final result

## 11. Synchronous Commands

Synchronous commands are appropriate for:

- lightweight validation;
- metadata lookup;
- diagnostics;
- non-blocking inspection.

Examples:

    studio.project.validate
    artifact.inspect
    system.info

Synchronous commands must not perform unbounded work on the Tauri command
handler thread.

## 12. Asynchronous Commands

Long-running operations must return an operation identifier.

Examples:

    build.start
    test.start
    artifact.package
    artifact.sign

Conceptual response:

    {
        "operation_id": "op-12345",
        "status": "ACCEPTED",
        "code": "OPERATION_ACCEPTED",
        "data": null,
        "error": null
    }

## 13. Operation Identity

Every long-running operation has:

- `operation_id`;
- operation type;
- project/workspace;
- creation timestamp;
- state;
- cancellation capability;
- result;
- error.

Operation IDs must be unique within the Studio runtime and preferably globally
unique.

## 14. Operation States

Baseline states:

    CREATED
    QUEUED
    RUNNING
    CANCELLING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

The state machine must reject invalid transitions.

## 15. Operation State Machine

    CREATED
       |
       v
    QUEUED
       |
       v
    RUNNING
       |
       +-----------> FAILED
       |
       +-----------> TIMEOUT
       |
       +-----------> COMPLETED
       |
       v
    CANCELLING
       |
       v
    CANCELLED

An operation must not transition from a terminal state back to `RUNNING`.

## 16. Request Contract

Each command request should contain a typed payload.

Conceptual request:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "operation_id": null,
        "command": "studio.project.open",
        "payload": {
            "path": "/workspace/example"
        }
    }

The exact transport representation may use Tauri's command invocation
mechanism while preserving these semantic fields.

## 17. Response Contract

Conceptual response:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "operation_id": null,
        "status": "SUCCESS",
        "code": "PROJECT_OPENED",
        "message": "Project opened",
        "data": {},
        "error": null
    }

Responses must remain serializable and versioned.

## 18. Response Statuses

Local IPC may use:

    SUCCESS
    ACCEPTED
    IN_PROGRESS
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT
    INVALID_REQUEST
    CONFLICT
    UNAVAILABLE

`ACCEPTED` means the operation was accepted for asynchronous execution.

`COMPLETED` means an asynchronous operation has reached successful terminal
completion.

## 19. Request IDs

Every invocation should have a request ID.

Request IDs support:

- UI diagnostics;
- correlation;
- logging;
- error reporting;
- debugging.

A response must echo the request ID.

## 20. Operation IDs versus Request IDs

They have different meanings:

    request_id
        = one IPC invocation

    operation_id
        = one long-running activity

Example:

    build.start request
        |
        +--> request_id = req-001
        |
        +--> operation_id = op-build-001

A status query may have a new request ID while referring to the same operation
ID.

## 21. Event Contract

Events are asynchronous messages emitted by Rust.

Conceptual event:

    {
        "protocol_version": "1.0",
        "event_id": "evt-123",
        "operation_id": "op-build-001",
        "timestamp": "2026-10-08T00:00:01Z",
        "event": "build.log",
        "data": {
            "stream": "stdout",
            "severity": "INFO",
            "message": "Compiling..."
        }
    }

Events are notifications, not the sole source of operation state.

## 22. Event Categories

Baseline local events:

    project.opened
    project.validation_failed
    toolchain.detected
    build.started
    build.log
    build.completed
    build.failed
    build.cancelled
    test.started
    test.log
    test.completed
    test.failed
    test.cancelled
    artifact.packaging
    artifact.packaged
    artifact.validation_failed
    artifact.signed
    operation.failed

## 23. Event Naming

Events use:

    <domain>.<resource/state>

Examples:

    build.started
    build.log
    build.completed
    artifact.packaged

Event names are stable contract identifiers.

## 24. Event Identity

Each event should contain an `event_id`.

The event ID supports:

- deduplication;
- diagnostics;
- event tracing;
- testing.

The UI must tolerate duplicate events.

## 25. Event Ordering

Ordering is guaranteed only where explicitly defined.

For a single operation, the runtime should preserve logical event order.

Example:

    build.started
    build.log
    build.log
    build.completed

The UI must not depend on global ordering between unrelated operations.

## 26. Event Loss

Events are not the authoritative durable state.

If an event is missed:

    UI
      |
      v
    build.status
      |
      v
    Runtime
      |
      v
    Current Operation State

This allows the UI to recover after reconnect, reload, or event loss.

## 27. Event Subscription

Subscriptions should be scoped to:

- operation;
- workspace;
- event type.

Example:

    subscribe(build.log, operation_id)

The UI should not subscribe globally to every local event unnecessarily.

## 28. Event Cleanup

When a feature unmounts:

    Unsubscribe
        |
        v
    Release listener
        |
        v
    Remove handler

The runtime and UI must avoid accumulating event listeners.

## 29. Typing Strategy

The IPC contract must be strongly typed.

Both sides must share:

- command names;
- request structures;
- response structures;
- event names;
- event payloads;
- enums;
- error codes.

Type drift is a release-blocking defect for production commands.

## 30. Contract Source of Truth

The preferred source of truth is a versioned contract definition independent
of React component implementation.

Possible implementation:

    packages/contracts/
        ipc/
          commands/
          events/
          errors/
          schemas/

Rust and TypeScript bindings should be generated or validated from this
contract.

## 31. Code Generation

Where practical:

    Canonical Contract
          |
          +----------------+
          |                |
          v                v
    TypeScript Types     Rust Types
          |                |
          v                v
       React             Tauri

Generated code must not be manually edited.

## 32. Generated Code Boundary

Generated code should live in dedicated directories.

Example:

    packages/contracts/generated/typescript/
    apps/studio/src-tauri/src/generated/

Hand-written adapters convert generated types into application/domain types
where necessary.

## 33. Serialization

JSON is the baseline IPC semantic representation.

Requirements:

- UTF-8;
- explicit schemas;
- stable field names;
- explicit optionality;
- predictable null behavior.

Binary payloads should not be embedded in normal command envelopes.

## 34. Large Data

Large artifacts, logs, and files must not be transported as giant IPC JSON
payloads.

Preferred patterns:

    metadata through IPC
    data through controlled file/path or stream mechanism

For example:

    artifact.inspect
        |
        v
    metadata response

rather than transferring the entire artifact through React memory.

## 35. Filesystem References

When IPC returns a local file reference, the reference must be:

- scoped;
- validated;
- explicit;
- non-ambiguous.

A returned path must not automatically grant arbitrary future filesystem
access.

## 36. Project Commands

Baseline project commands:

    studio.project.create
    studio.project.open
    studio.project.validate
    studio.project.close

Optional future commands:

    studio.project.inspect
    studio.project.repair

## 37. `studio.project.create`

Inputs:

- destination path;
- project name;
- project type;
- optional target platform.

Validation:

- path allowed;
- destination safe;
- project name valid;
- destination state acceptable.

Output:

- project identity;
- workspace path;
- configuration status.

## 38. `studio.project.open`

Input:

- local path.

Flow:

    IPC Request
       |
       v
    Path Validation
       |
       v
    Workspace Discovery
       |
       v
    Configuration Validation
       |
       v
    Workspace Response

The response must not expose unrestricted filesystem privileges.

## 39. `studio.project.validate`

Validation includes:

- path;
- project structure;
- configuration;
- target;
- build metadata.

It should return structured findings:

    ERROR
    WARNING
    INFO

## 40. Build Commands

Baseline:

    build.configure
    build.start
    build.status
    build.cancel
    build.logs
    build.result

The exact command naming must remain synchronized with the Local Runtime
architecture.

## 41. `build.configure`

Purpose:

- validate selected build configuration;
- resolve toolchain;
- prepare build plan.

It should not necessarily execute the build.

Output may include:

- target;
- compiler;
- SDK;
- build profile;
- expected output;
- warnings.

## 42. `build.start`

Input includes:

- project/workspace;
- build configuration;
- profile;
- target.

Output:

    ACCEPTED
    operation_id

The actual compiler process is started asynchronously by Rust.

## 43. `build.status`

Input:

    operation_id

Output:

- state;
- progress where measurable;
- timestamps;
- result reference;
- error.

Status queries are authoritative for current local operation state.

## 44. `build.cancel`

Input:

    operation_id

Behavior:

    Validate Operation
        |
        v
    Mark CANCELLING
        |
        v
    Graceful Process Termination
        |
        v
    Cleanup
        |
        v
    CANCELLED

Repeated cancellation requests are idempotent.

## 45. Test Commands

Baseline:

    test.discover
    test.start
    test.status
    test.cancel
    test.result

Tests use the same operation and process-management infrastructure as builds.

## 46. Artifact Commands

Baseline:

    artifact.inspect
    artifact.package
    artifact.validate
    artifact.sign
    artifact.verify

Optional future:

    artifact.list-local
    artifact.delete-local

## 47. `artifact.inspect`

Inspection should return:

- manifest;
- file list summary;
- size;
- platform;
- architecture;
- runtime;
- SDK;
- capabilities;
- signature state;
- digest.

Inspection should avoid transferring unnecessary package bytes to React.

## 48. `artifact.package`

Packaging is asynchronous where it may involve significant I/O.

Flow:

    Build Output
       |
       v
    Allowlist
       |
       v
    Staging
       |
       v
    Manifest
       |
       v
    Package
       |
       v
    Digest
       |
       v
    Validation
       |
       v
    Result

## 49. `artifact.validate`

Validation should check:

- format;
- manifest;
- contents;
- digest;
- signature policy;
- target;
- architecture;
- runtime;
- SDK;
- capabilities.

## 50. `artifact.sign`

Signing must be an explicit operation.

The runtime should:

1. validate package;
2. resolve signing policy;
3. access approved signing key;
4. sign canonical content;
5. verify signature;
6. return signed artifact metadata.

## 51. `artifact.verify`

Verification confirms:

- signature;
- digest;
- trust policy;
- artifact integrity.

Verification must not silently repair or modify the artifact.

## 52. System Commands

Baseline:

    system.info
    system.health
    system.toolchains

System information may include:

- Studio version;
- runtime version;
- OS;
- host architecture;
- available disk;
- runtime status.

Sensitive system information must be filtered.

## 53. Error Model

Every IPC failure must map to a stable error code.

Conceptual:

    {
        "code": "LOCAL_BUILD_FAILED",
        "message": "The local build failed.",
        "operation_id": "op-001",
        "retryable": false,
        "details": {}
    }

The `message` is not a machine-readable contract.

The `code` is the machine-readable contract.

## 54. Error Categories

Baseline categories:

| Category | Examples |
|---|---|
| Request | `INVALID_REQUEST` |
| Workspace | `LOCAL_WORKSPACE_INVALID` |
| Path | `LOCAL_PATH_DENIED` |
| Toolchain | `LOCAL_TOOLCHAIN_NOT_FOUND` |
| Build | `LOCAL_BUILD_FAILED` |
| Test | `LOCAL_TEST_FAILED` |
| Process | `LOCAL_PROCESS_START_FAILED` |
| Cancellation | `LOCAL_PROCESS_CANCEL_FAILED` |
| Artifact | `LOCAL_ARTIFACT_INVALID` |
| Signing | `LOCAL_SIGNATURE_FAILED` |
| Permission | `LOCAL_PERMISSION_DENIED` |
| Conflict | `LOCAL_OPERATION_CONFLICT` |
| Runtime | `LOCAL_RUNTIME_UNAVAILABLE` |

## 55. Error Mapping

Rust implementation errors follow:

    OS / Library Error
          |
          v
    Internal Rust Error
          |
          v
    Domain Error
          |
          v
    Stable IPC Error
          |
          v
    React Error Handler

Raw filesystem or process errors must not become the long-term IPC contract.

## 56. Retryability

Errors should identify whether retry is safe.

Examples:

    LOCAL_TOOLCHAIN_NOT_FOUND
        retryable = false

    LOCAL_RUNTIME_BUSY
        retryable = true

    LOCAL_BUILD_FAILED
        retryable = usually false

Retry behavior remains operation-specific.

## 57. Error Details

Details may include:

- field;
- executable;
- exit code;
- stderr reference;
- path category;
- tool version;
- remediation hint.

Sensitive details must be redacted.

## 58. Log Streaming Architecture

The log path is:

    Child Process
        |
        +--> stdout
        +--> stderr
                |
                v
           Process Manager
                |
                v
            Log Manager
                |
                v
          Normalize/Redact
                |
                v
          Bounded Buffer
                |
                v
            Tauri Event
                |
                v
              React

## 59. Log Event Schema

Conceptual:

    {
        "event_id": "evt-001",
        "operation_id": "op-001",
        "stream": "stdout",
        "severity": "INFO",
        "timestamp": "2026-10-08T00:00:01Z",
        "message": "Compiling module..."
    }

Logs must be safe to render and must not contain executable interpretation.

## 60. Log Batching

High-volume logs should be batched.

Instead of:

    one process line
       ->
    one IPC event

the runtime may use:

    multiple lines
       ->
    bounded batch
       ->
    one IPC event

Batch size and latency must remain bounded.

## 61. Log Backpressure

When the consumer is slower than the producer:

    Process
       |
       v
    Buffer Limit
       |
       +--> batch
       +--> throttle
       +--> spill to file
       +--> drop only explicitly classified non-critical data

Critical error messages must not be silently discarded.

## 62. Log Redaction

Before UI delivery, logs should be checked for:

- tokens;
- credentials;
- private keys;
- secret environment values.

Redaction is defense in depth; build tools should also avoid printing secrets.

## 63. Cancellation Interface

All cancellable commands should accept an operation ID.

The cancellation path is:

    React
      |
      | command.cancel
      v
    Rust Operation Manager
      |
      v
    Cancellation Token
      |
      v
    Process Manager
      |
      v
    Process Tree
      |
      v
    Final State

## 64. Permission Model

Tauri capabilities define what the application can access.

The principle is:

> Grant the minimum native capability required by each feature.

Capabilities should be scoped by:

- filesystem;
- process;
- window;
- dialog;
- shell/native API where required.

## 65. Filesystem Permissions

Studio requires controlled access to user-selected project directories.

It should not have unrestricted read/write access to the entire filesystem.

Recommended policy:

    User-selected Workspace
           |
           v
    Approved Filesystem Scope
           |
           v
    Local Runtime

The exact Tauri capability configuration must reflect the supported Tauri
version.

## 66. Process Permissions

Process execution should be restricted to approved operation paths.

The application must not expose a generic process execution capability to
React.

Rust services determine:

- executable;
- arguments;
- working directory;
- environment.

## 67. Dialog Permissions

User-driven directory/file selection may use native dialogs.

Dialog results must still be validated by Rust.

A user-selected path is not automatically a trusted path.

## 68. Capability Separation

Where practical, capabilities should be separated between:

    UI capabilities
        |
        +--> project dialogs
        +--> UI events

    Native service capabilities
        |
        +--> filesystem
        +--> process
        +--> secure storage
        +--> signing

React should not directly access the more privileged capability set.

## 69. Capability Failure

If a native capability is unavailable:

    IPC Request
       |
       v
    Capability Check
       |
       X
    LOCAL_CAPABILITY_DENIED
       |
       v
    UI Remediation

The application must fail safely rather than attempting a broader fallback
privilege.

## 70. Security Boundary

The security boundary is:

    Untrusted UI Input
           |
           v
    IPC Validation
           |
           v
    Capability Check
           |
           v
    Domain Policy
           |
           v
    Native Operation

Validation must happen even if the UI already validated the input.

## 71. Versioning

IPC contracts require explicit versioning.

Baseline:

    protocol_version = 1.0

Versioning follows MAJOR.MINOR semantics.

Major changes indicate incompatible contract behavior.

Minor changes indicate backward-compatible additions.

## 72. Version Negotiation

At runtime initialization:

    React Client Version
          |
          v
    Runtime Capability/Version
          |
          v
    Compatibility Check
          |
          +--> Compatible
          |
          +--> Unsupported

The Studio application should fail clearly if its UI and Rust runtime are
incompatible.

## 73. Command Compatibility

Adding an optional field should normally be compatible.

Changing:

    required field
    field type
    command semantics
    error meaning

may be breaking.

Breaking IPC changes require a versioned migration.

## 74. Event Compatibility

Event consumers should tolerate additive fields.

Unknown event types should be handled safely.

Unknown fields should be ignored unless the contract marks them mandatory for
correct interpretation.

## 75. Contract Version Header

Every canonical IPC request/response/event should identify its protocol
version.

Example:

    "protocol_version": "1.0"

The transport implementation may omit redundant fields internally where the
version is guaranteed by the registered contract, but the semantic version
remains explicit.

## 76. Version Migration

Preferred migration:

    Contract v1
       |
       v
    Additive v1.1
       |
       v
    Migrate React
       |
       v
    Migrate Rust
       |
       v
    Retire deprecated fields

A breaking v2 contract requires explicit migration rather than silent behavior
change.

## 77. Deprecation

Deprecated commands/events should have:

- deprecation version;
- replacement;
- migration guidance;
- removal target.

Example:

    artifact.old_sign
        deprecated in 1.2
        replacement: artifact.sign

## 78. Contract Validation

CI should validate:

- TypeScript types;
- Rust types;
- schema compatibility;
- command registry;
- event registry;
- error registry.

A contract-breaking change requires explicit review.

## 79. TypeScript API Wrapper

React should consume typed functions such as:

    project.open(request)
    build.start(request)
    build.cancel(operationId)
    artifact.inspect(request)

rather than raw Tauri invocation calls scattered throughout components.

## 80. Rust Handler Wrapper

Rust should register explicit handlers that delegate to services.

Conceptual:

    #[command]
    fn build_start(request: BuildStartRequest)
        -> Result<AcceptedOperation, IpcError>
    {
        build_service.start(request)
    }

The handler should not contain the build implementation.

## 81. Frontend IPC Service

Recommended architecture:

    React Feature
        |
        v
    IPC Hook
        |
        v
    Typed IPC Client
        |
        v
    Tauri Invoke
        |
        v
    Rust Handler

This provides a stable frontend boundary.

## 82. IPC Client Responsibilities

The TypeScript IPC client handles:

- command invocation;
- serialization;
- timeout where appropriate;
- request IDs;
- typed responses;
- event subscriptions;
- error conversion.

It should not implement build or packaging logic.

## 83. Rust IPC Layer Responsibilities

The Rust IPC layer handles:

- input deserialization;
- schema validation;
- capability checks;
- request correlation;
- service dispatch;
- output serialization;
- error translation.

## 84. Request Validation

Validation order:

    Deserialize
        |
        v
    Schema Validation
        |
        v
    Capability Check
        |
        v
    Workspace/Path Policy
        |
        v
    Domain Validation
        |
        v
    Execute

Invalid requests must fail before privileged operations begin.

## 85. Response Validation

Responses emitted by Rust should conform to the canonical schema.

Tests should verify:

- required fields;
- enum values;
- nullability;
- error structure;
- operation identity.

## 86. Event Validation

Events must be generated from typed Rust structures where practical.

The TypeScript consumer must validate or safely parse event payloads at the
boundary rather than trusting arbitrary data.

## 87. Command Timeout

Not every command requires a timeout.

Long-running operations use operation status instead of holding a single IPC
call open indefinitely.

Example:

    build.start
       |
       v
    ACCEPTED
       |
       +--> event stream
       +--> status query
       |
       v
    final result

## 88. UI Reload Behavior

If React reloads while Rust remains active:

    React Reload
        |
        v
    Reinitialize IPC
        |
        v
    Query Active Operations
        |
        v
    Reattach Listeners
        |
        v
    Reconcile State

This is important for long-running builds and tests.

## 89. Runtime Restart Behavior

If Rust runtime restarts:

- active operation state may be lost unless persisted;
- orphan process recovery must be attempted;
- incomplete operations must be marked appropriately;
- UI must not assume prior operation state remains valid.

Production behavior must define recovery policy explicitly.

## 90. IPC Security Logging

Audit/debug logs may record:

- command name;
- request ID;
- operation ID;
- duration;
- result code.

They must not record:

- tokens;
- credentials;
- private keys;
- full source;
- secret environment variables.

## 91. Performance

IPC must remain lightweight.

Targets:

| Operation | Target |
|---|---:|
| Simple command round trip | <100 ms target |
| Status query | <100 ms target |
| Event propagation | <250 ms target |
| Log batch latency | bounded |
| Large file transfer | not through JSON envelope |

These are engineering targets subject to profiling.

## 92. Memory Management

The IPC layer must avoid:

- retaining complete build logs indefinitely;
- copying large artifacts into React memory;
- unbounded event queues;
- duplicate operation state.

Large data must use controlled streams/files/references.

## 93. Concurrency

Concurrent commands are allowed only where safe.

Examples:

    system.info + toolchain.detect
        = allowed

    build.start + build.start same workspace
        = conflict

    build.start + artifact.package same build output
        = conflict unless explicitly coordinated

## 94. Operation Locking

The runtime should expose conflict errors such as:

    LOCAL_OPERATION_CONFLICT

The UI can then display:

    A build is already running for this project.

## 95. Atomic Operations

Operations affecting final artifacts should use atomic commit semantics.

For example:

    package.temp
        |
        v
    validate
        |
        v
    final artifact

A partial `.krv` must never be reported as complete.

## 96. Cancellation and Events

Cancellation should emit:

    build.cancelling
        |
        v
    build.cancelled

If cancellation fails:

    build.cancellation_failed

The final operation status remains authoritative.

## 97. Error and Event Relationship

An operation failure should provide both:

    final status
        +
    error information

Events may notify the UI immediately, but the final status query remains
authoritative.

## 98. IPC Testing Strategy

Testing layers:

    Contract Tests
        |
        v
    Rust Handler Tests
        |
        v
    TypeScript Client Tests
        |
        v
    IPC Integration Tests
        |
        v
    Tauri Integration
        |
        v
    Studio E2E

## 99. Contract Tests

Contract tests verify:

- command names;
- request schemas;
- response schemas;
- event schemas;
- error codes;
- enum compatibility;
- versioning.

## 100. Rust Handler Tests

Rust tests verify:

- validation;
- capability checks;
- service dispatch;
- error mapping;
- cancellation;
- operation state.

## 101. TypeScript Tests

TypeScript tests verify:

- typed wrapper behavior;
- serialization;
- event parsing;
- error mapping;
- listener cleanup;
- operation reconciliation.

## 102. Integration Tests

Integration tests should execute real Tauri IPC where practical.

Examples:

    project.open
    toolchain.detect
    build.start
    build.status
    build.cancel
    artifact.inspect

## 103. Security Tests

Security tests must verify:

- unauthorized filesystem path;
- traversal;
- symlink escape;
- unauthorized process;
- malformed arguments;
- oversized payload;
- capability denial;
- secret redaction.

## 104. Fuzz Testing

Suitable IPC inputs should be fuzz-tested for:

- path fields;
- manifest fields;
- command arguments;
- artifact metadata;
- configuration.

The goal is to prevent malformed input from causing crashes or privilege
escalation.

## 105. Cross-Platform IPC Testing

IPC behavior must be tested on supported host platforms.

At minimum:

    Linux x86_64
    Windows x86_64

Planned:

    macOS Apple Silicon

Platform-specific filesystem and process semantics must be covered.

## 106. Diagnostics

`system.info` should provide safe runtime information.

Example:

    {
        "studio_version": "x.y.z",
        "runtime_version": "x.y.z",
        "protocol_version": "1.0",
        "host_os": "linux",
        "host_arch": "x86_64",
        "runtime_state": "READY"
    }

No credentials or private paths should be exposed unnecessarily.

## 107. Health

The IPC runtime may expose:

    READY
    DEGRADED
    ERROR

Examples:

    READY
      all required services available

    DEGRADED
      optional tool unavailable

    ERROR
      native runtime cannot safely execute required operations

## 108. Runtime Initialization

Initialization flow:

    Tauri Startup
        |
        v
    Load IPC Contract Version
        |
        v
    Load Security Policy
        |
        v
    Initialize Services
        |
        v
    Register Commands
        |
        v
    Register Events
        |
        v
    READY

## 109. Runtime Shutdown

Shutdown flow:

    Shutdown
        |
        v
    Stop Accepting New Operations
        |
        v
    Notify UI
        |
        v
    Cancel/Finish Active Operations
        |
        v
    Cleanup
        |
        v
    Unregister Resources
        |
        v
    Exit

## 110. Protocol Documentation

IPC contracts should be documented in:

    packages/contracts/ipc/

while architecture remains documented under:

    docs/frontend/architecture/

Implementation-specific Rust details belong under the Studio source tree and
development documentation.

## 111. Phase Mapping

| Phase | IPC Work |
|---|---|
| Phase 0 | IPC foundation and contracts |
| Phase 1 | Project/session/system commands |
| Phase 2 | Build/test/artifact commands |
| Phase 3 | API client integration boundary |
| Phase 4 | Remote workflow coordination |
| Phase 5 | Execution integration |
| Phase 6 | Platform compatibility |
| Phase 7 | Live/results integration |
| Phase 8 | Production hardening |

## 112. P0 FOUNDATION — IPC Foundation

Implement:

- Tauri IPC setup;
- command registry;
- event registry;
- contract package;
- typed client;
- Rust handler framework;
- error model;
- capability policy.

Acceptance:

- typed command executes;
- malformed request is rejected;
- arbitrary shell command is impossible through IPC.

## 113. P1 STUDIO — Project and Runtime

Implement:

    studio.project.create
    studio.project.open
    studio.project.validate
    system.info
    system.health
    toolchain.detect

Acceptance:

- project can be opened;
- paths are validated;
- runtime diagnostics work.

## 114. P2 BUILD & ARTIFACT — Build/Test/Artifact

Implement:

    build.configure
    build.start
    build.status
    build.cancel
    test.start
    test.status
    test.cancel
    artifact.package
    artifact.inspect
    artifact.validate
    artifact.sign

Acceptance:

    Source
      |
      v
    Build
      |
      v
    Test
      |
      v
    Package
      |
      v
    Validate
      |
      v
    Sign

## 115. P3 CONTROL PLANE Boundary

IPC remains local while Studio integrates the resulting artifact with the
Control Plane.

Implement local support for:

- artifact metadata;
- upload preparation;
- upload progress;
- remote error mapping.

The IPC layer must not become a proxy for REST.

## 116. P4 BOOKING & COMMERCIAL — Booking

The local runtime supplies:

- artifact identity;
- platform metadata;
- compatibility information.

Booking remains a Control Plane operation.

The boundary is:

    React
       |
       +--> Local IPC for artifact/toolchain state
       |
       +--> API Client for booking state

## 117. P5 EXECUTION

The Local Runtime supports artifact readiness and diagnostics.

Remote job operations remain:

    React
       |
       v
    API Client
       |
       v
    Control Plane

The Local Runtime does not directly start remote robot processes.

## 118. P6 LAB & ROBOT

IPC provides local compatibility and artifact information.

Remote robot state remains outside the local IPC boundary.

No local IPC command should bypass the Control Plane to access a production
robot.

## 119. P7 LIVE & RESULTS

Live video, telemetry, and remote logs use the remote communication architecture.

Local IPC continues to support:

- local diagnostics;
- artifact metadata;
- local build provenance.

## 120. P8 PRODUCTION

Complete:

- contract freeze;
- capability audit;
- cross-platform validation;
- security testing;
- fuzzing;
- performance;
- crash recovery;
- version migration;
- operational diagnostics.

## 121. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Arbitrary native execution | Critical | Explicit command allowlist |
| Contract drift | High | Shared schema/code generation |
| Capability overreach | Critical | Minimal Tauri capabilities |
| Path traversal | Critical | Canonicalization/root checks |
| Event loss | High | Status reconciliation |
| Event flood | High | Batching/backpressure |
| Process leaks | High | Process-tree lifecycle |
| Secret leakage | Critical | Redaction/filtering |
| Version mismatch | High | Protocol versioning |
| UI/runtime mismatch | High | Contract tests |
| Large payloads | Medium | File/reference transport |
| Duplicate cancellation | Medium | Idempotent operation control |

## 122. Risk — Generic Shell API

A generic command such as:

    shell.execute(command)

would create a critical security boundary violation.

Mitigation:

- no generic shell IPC;
- explicit build/test/package commands;
- Rust constructs executable and arguments;
- capability restrictions.

## 123. Risk — Contract Drift

React and Rust may evolve independently.

Mitigation:

- canonical contracts;
- generated types;
- compile-time checks;
- contract tests;
- CI compatibility validation.

## 124. Risk — Event Flood

Large builds may produce huge logs.

Mitigation:

- bounded buffers;
- batching;
- throttling;
- disk-backed logs;
- severity-aware handling.

## 125. Risk — Capability Escalation

A future Tauri plugin could accidentally grant broad permissions.

Mitigation:

- capability review;
- least privilege;
- explicit ownership;
- security tests;
- CI configuration audit.

## 126. Risk — Version Mismatch

React bundle and Rust binary may not support the same IPC contract.

Mitigation:

- bundled version metadata;
- startup compatibility check;
- atomic application packaging;
- migration policy;
- fail-safe incompatibility behavior.

## 127. Open Questions

1. Which exact Tauri version will be pinned?
2. Which exact Rust toolchain will be pinned?
3. Which contract schema format will be authoritative?
4. Which Rust/TypeScript code-generation mechanism will be used?
5. Will IPC payloads use JSON directly or generated Tauri argument structures?
6. What exact capability configuration will be used?
7. What exact filesystem scope model will be used?
8. Which process APIs will be permitted?
9. Will operation state survive Rust runtime restart?
10. What exact event buffering mechanism will be used?
11. What exact maximum log event size will be enforced?
12. What exact maximum IPC payload size will be enforced?
13. Which errors are retryable?
14. What exact IPC protocol compatibility window will be supported?
15. Will command deprecation be required before removal?
16. What exact signing-key integration will be exposed through IPC?
17. Which operations require explicit user confirmation?
18. What exact diagnostics may be uploaded?
19. Which IPC events require durable local persistence?
20. What exact fuzzing framework will be used?
21. Which native capabilities are required on each supported OS?
22. How will macOS sandboxing affect the filesystem model?
23. What exact process-tree implementation will be standardized?
24. What exact crash-recovery behavior will be guaranteed?
25. Which IPC performance thresholds become release gates?

## 128. Full Acceptance Criteria — Contract

- [ ] IPC contract is documented.
- [ ] Command names are stable.
- [ ] Event names are stable.
- [ ] Request schemas are typed.
- [ ] Response schemas are typed.
- [ ] Event schemas are typed.
- [ ] Error codes are typed.
- [ ] Protocol version is defined.
- [ ] Contract source of truth exists.
- [ ] Contract compatibility is CI-tested.

## 129. Full Acceptance Criteria — Commands

- [ ] `studio.project.create` exists.
- [ ] `studio.project.open` exists.
- [ ] `studio.project.validate` exists.
- [ ] `toolchain.detect` exists.
- [ ] `build.configure` exists.
- [ ] `build.start` exists.
- [ ] `build.status` exists.
- [ ] `build.cancel` exists.
- [ ] `test.start` exists.
- [ ] `test.status` exists.
- [ ] `test.cancel` exists.
- [ ] `artifact.inspect` exists.
- [ ] `artifact.package` exists.
- [ ] `artifact.validate` exists.
- [ ] `artifact.sign` exists.
- [ ] `system.info` exists.

## 130. Full Acceptance Criteria — Operations

- [ ] Long-running commands return operation IDs.
- [ ] Operation state is queryable.
- [ ] Operation states are validated.
- [ ] Cancellation is supported where applicable.
- [ ] Cancellation is idempotent.
- [ ] Terminal states are immutable.
- [ ] Operation conflicts are detected.
- [ ] Operation cleanup is implemented.
- [ ] Operation status survives UI reload where runtime remains active.
- [ ] Orphaned operations are handled safely.

## 131. Full Acceptance Criteria — Events

- [ ] Events have stable names.
- [ ] Events have event IDs.
- [ ] Events identify operations where applicable.
- [ ] Events are typed.
- [ ] Event payloads are validated.
- [ ] Event listeners are cleaned up.
- [ ] Duplicate events are tolerated.
- [ ] Event loss can be reconciled through status queries.
- [ ] Event ordering rules are documented.
- [ ] High-volume events are bounded.

## 132. Full Acceptance Criteria — Logs

- [ ] stdout is captured.
- [ ] stderr is captured.
- [ ] Log events are typed.
- [ ] Operation ID is included.
- [ ] Logs are timestamped.
- [ ] Log batching exists.
- [ ] Backpressure exists.
- [ ] Buffers are bounded.
- [ ] Secrets are redacted.
- [ ] Large logs do not exhaust UI memory.

## 133. Full Acceptance Criteria — Typing

- [ ] TypeScript types are generated or validated.
- [ ] Rust types are generated or validated.
- [ ] Generated code is separated.
- [ ] Hand-written adapters are explicit.
- [ ] Enums remain synchronized.
- [ ] Optional fields remain synchronized.
- [ ] Error codes remain synchronized.
- [ ] Event payloads remain synchronized.
- [ ] Contract drift fails CI.
- [ ] Breaking changes require explicit review.

## 134. Full Acceptance Criteria — Security

- [ ] IPC input is untrusted.
- [ ] Input validation occurs in Rust.
- [ ] Capability checks occur before privileged operations.
- [ ] Filesystem access is scoped.
- [ ] Process access is scoped.
- [ ] Generic shell execution is unavailable.
- [ ] Path traversal is rejected.
- [ ] Symlink escapes are controlled.
- [ ] Secrets are not logged.
- [ ] Sensitive capabilities are not exposed directly to React.

## 135. Full Acceptance Criteria — Error Model

- [ ] Errors use stable codes.
- [ ] Messages are user-readable.
- [ ] Retryability is represented.
- [ ] Operation ID is included where applicable.
- [ ] Raw OS errors are translated.
- [ ] Validation errors are structured.
- [ ] Process failures are structured.
- [ ] Cancellation failures are structured.
- [ ] Artifact failures are structured.
- [ ] Permission failures are structured.

## 136. Full Acceptance Criteria — Versioning

- [ ] IPC protocol version exists.
- [ ] Version compatibility is checked.
- [ ] Additive changes are defined.
- [ ] Breaking changes are defined.
- [ ] Deprecated commands can be identified.
- [ ] Deprecated events can be identified.
- [ ] Migration process is documented.
- [ ] Unsupported versions fail safely.
- [ ] React/Rust version mismatch is detected.
- [ ] Contract versions are visible in diagnostics.

## 137. Full Acceptance Criteria — Permissions

- [ ] Tauri capabilities are explicitly configured.
- [ ] Filesystem capability is restricted.
- [ ] Process capability is restricted.
- [ ] Dialog capability is restricted.
- [ ] Native services use least privilege.
- [ ] React does not receive unrestricted native privileges.
- [ ] Capability denial produces a stable error.
- [ ] Capability configuration is reviewed.
- [ ] Capability changes are tested.
- [ ] Capability inventory is documented.

## 138. Full Acceptance Criteria — Testing

- [ ] Contract tests exist.
- [ ] Rust handler tests exist.
- [ ] TypeScript client tests exist.
- [ ] IPC integration tests exist.
- [ ] Event tests exist.
- [ ] Cancellation tests exist.
- [ ] Log streaming tests exist.
- [ ] Security tests exist.
- [ ] Fuzz tests exist for selected inputs.
- [ ] Cross-platform tests exist.

## 139. Full Acceptance Criteria — Lifecycle

- [ ] Runtime startup is defined.
- [ ] Runtime shutdown is defined.
- [ ] Commands are rejected during shutdown.
- [ ] Active operations are handled during shutdown.
- [ ] Event listeners are cleaned.
- [ ] Child processes are cleaned.
- [ ] Temporary files are cleaned.
- [ ] Runtime restart behavior is defined.
- [ ] UI reload behavior is supported.
- [ ] Crash recovery is tested.

## 140. Full Acceptance Criteria — Integration

- [ ] React invokes commands through typed wrappers.
- [ ] Components do not call raw Tauri APIs directly.
- [ ] Rust handlers delegate to services.
- [ ] Local filesystem operations remain native.
- [ ] Builds remain local.
- [ ] Tests remain local.
- [ ] Artifact packaging remains local.
- [ ] Artifact upload remains a separate Control Plane operation.
- [ ] Remote execution does not bypass the Control Plane.
- [ ] Local IPC and remote protocol remain separate boundaries.

## 141. Architectural Invariants

The following rules are mandatory:

1. Tauri IPC is the only normal React-to-native application boundary.
2. React cannot invoke arbitrary shell commands.
3. Rust validates every IPC input.
4. Tauri capabilities enforce least privilege.
5. Long-running operations have operation IDs.
6. Operation state is queryable.
7. Cancellation is idempotent.
8. Events are notifications, not the sole source of state.
9. Logs are bounded and backpressured.
10. Large binary payloads do not travel through normal JSON envelopes.
11. Filesystem access is scoped.
12. Process execution is explicitly controlled.
13. Signing is an explicit privileged operation.
14. Artifact packaging uses the defined artifact boundary.
15. Error codes are stable.
16. Protocol versions are explicit.
17. Contract drift is detected by CI.
18. UI reload must not corrupt active local operations.
19. Remote execution remains outside the local IPC boundary.
20. Local IPC cannot bypass backend authorization or robot safety architecture.

## 142. Final Architecture

The production IPC architecture is:

    +----------------------------------------------------------------+
    |                     React / TypeScript                        |
    |                                                                |
    |  Feature Hooks                                                 |
    |       |                                                        |
    |       v                                                        |
    |  Typed IPC Client                                              |
    |       |                                                        |
    |       +--> Command Invocation                                  |
    |       +--> Event Subscription                                  |
    |       +--> Error Mapping                                       |
    +---------------------------+------------------------------------+
                                |
                           Tauri IPC
                                |
    +---------------------------v------------------------------------+
    |                     Rust Local Runtime                         |
    |                                                                |
    |  IPC Handlers                                                  |
    |       |                                                        |
    |       v                                                        |
    |  Validation + Capability Checks                                |
    |       |                                                        |
    |       v                                                        |
    |  Application Services                                          |
    |       |                                                        |
    |       +--> Workspace                                           |
    |       +--> Toolchain                                           |
    |       +--> Build                                               |
    |       +--> Test                                                |
    |       +--> Artifact                                            |
    |       +--> Signing                                             |
    |       +--> Process                                             |
    |       +--> Logging                                             |
    +---------------------------+------------------------------------+
                                |
                 +--------------+---------------+
                 |              |               |
                 v              v               v
             Filesystem     Toolchains      Processes
                 |                              |
                 +--------------+---------------+
                                |
                                v
                         Validated `.krv`

The fundamental command path is:

    React Intent
        |
        v
    Typed IPC Command
        |
        v
    Rust Validation
        |
        v
    Capability Check
        |
        v
    Application Service
        |
        v
    Native Operation
        |
        v
    Typed Response / Events
        |
        v
    React UI

The fundamental asynchronous path is:

    build.start
        |
        v
    ACCEPTED + operation_id
        |
        +------ build.started
        |
        +------ build.log
        |
        +------ build.log
        |
        +------ build.completed
        |
        v
    build.status
        |
        v
    Final Result

The IPC architecture therefore provides a secure, typed, versioned and
testable bridge between the Kritva RaaS Studio user interface and its native
Rust Local Runtime, while preserving the critical separation between local
development capabilities and remote RaaS execution.
