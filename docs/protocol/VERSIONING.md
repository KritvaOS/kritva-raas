# Kritva RaaS Protocol and API Versioning Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Protocol and API Versioning Specification |
| Path | `docs/protocol/VERSIONING.md` |
| Product | Kritva Robotics-as-a-Service |
| API Base | `/api/v1/` |
| Envelope Version | `protocol_version` |
| API Contract | OpenAPI + shared contracts |
| Shared Contracts | `packages/contracts` |
| Client | `packages/api-client` |
| Primary Transports | HTTPS, WebSocket, Tauri IPC, Secure Lab Channel |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the versioning policy for Kritva RaaS protocols, APIs,
message envelopes, events, artifacts, clients, and cross-boundary compatibility.

Versioning exists to allow the platform to evolve without unexpectedly breaking:

- Kritva RaaS Studio;
- Web Console;
- Control Plane;
- Lab Agent;
- Kritva Runtime;
- robotic platforms;
- API clients;
- integrations;
- artifacts;
- event consumers.

The governing principle is:

> **Compatibility must be explicit, testable, observable, and managed at every protocol boundary.**

## 3. Scope

This specification covers:

- API versioning;
- protocol versioning;
- semantic versioning;
- envelope versioning;
- command versioning;
- response compatibility;
- event compatibility;
- WebSocket versioning;
- Lab Protocol versioning;
- Tauri IPC versioning;
- artifact format versioning;
- SDK compatibility;
- KritvaOS/runtime compatibility;
- platform compatibility;
- negotiation;
- deprecation;
- migration;
- breaking changes;
- compatible changes;
- version support windows;
- compatibility matrices;
- release governance.

## 4. Goals

The versioning architecture shall:

1. prevent silent breaking changes;
2. provide explicit compatibility rules;
3. distinguish API and protocol versions;
4. support independent component releases;
5. support older Studio versions during migration;
6. support Lab Agent upgrade windows;
7. support artifact compatibility;
8. support WebSocket version negotiation;
9. support controlled deprecation;
10. provide migration paths;
11. make compatibility machine-testable;
12. support rollback;
13. support production observability.

## 5. Non-Goals

This document does not define:

- detailed command payloads;
- detailed event schemas;
- error-code meanings;
- database migration mechanics;
- cloud provider release policies;
- robot vendor software versioning;
- source-code version control strategy.

Those are governed by their respective specifications.

# 6. Versioning Layers

Kritva RaaS has multiple versioned boundaries:

    Studio
       |
       | Tauri IPC
       v
    Local Runtime
       |
       | REST / WebSocket
       v
    Control Plane
       |
       | Lab Protocol
       v
    Lab Agent
       |
       | Runtime Protocol
       v
    Kritva Runtime
       |
       v
    Robot Platform

Additional compatibility dimensions exist:

    Artifact
       |
       +--> Platform
       +--> Architecture
       +--> KritvaOS
       +--> Runtime
       +--> SDK
       +--> Artifact Format

Versioning must not collapse these dimensions into one global version number.

# 7. Version Dimensions

| Dimension | Example | Purpose |
|---|---|---|
| API major | `v1` | Public API compatibility |
| Protocol | `1.2` | Message semantics |
| Schema | `artifact.v2` | Payload contract |
| SDK | `2.4.1` | Developer build compatibility |
| KritvaOS | `3.1.0` | Runtime platform |
| Runtime | `2.2.0` | Execution environment |
| Lab Agent | `1.5.0` | Lab software |
| Artifact format | `2.0` | `.krv` package format |
| Platform version | `humanoid-a@2.1` | Robot capability contract |
| Studio | `2.6.0` | Desktop client release |

These versions are related but independently governed.

# 8. Semantic Versioning

Software components use Semantic Versioning:

    MAJOR.MINOR.PATCH

Example:

    2.4.1

Semantics:

- MAJOR: incompatible API/contract changes;
- MINOR: backward-compatible functionality;
- PATCH: backward-compatible fixes.

Semantic Versioning applies to releasable software components.

# 9. Protocol Versioning

Protocol versions use:

    MAJOR.MINOR

Example:

    protocol_version = "1.2"

Rules:

- MAJOR identifies compatibility generation;
- MINOR identifies compatible protocol additions;
- breaking protocol changes require a new major version.

Patch-level protocol changes should normally be represented as implementation
fixes or schema corrections rather than new wire versions.

# 10. API Versioning

The public REST API uses major versioning in the URL:

    /api/v1/

A compatible release remains:

    /api/v1/

A breaking release becomes:

    /api/v2/

Minor and patch API changes do not create a new URL version.

# 11. API Version Principle

The API version represents a compatibility contract, not an application
release number.

Therefore:

    Studio 3.4.2
        |
        v
    /api/v1/

and:

    Studio 4.0.0
        |
        v
    /api/v2/

may coexist during a migration period.

# 12. Envelope Version

Every message carries:

    "protocol_version": "1.0"

This identifies the message protocol generation.

The envelope version is independent of:

    /api/v1/

because REST API compatibility and message protocol compatibility are related
but not identical concerns.

# 13. Version Relationship

Typical stack:

    HTTPS API
       |
       | /api/v1/
       v
    Protocol
       |
       | 1.2
       v
    Envelope
       |
       | schema
       v
    Domain Payload

A new API version does not automatically imply a new envelope version.

# 14. Version Ownership

| Version | Owner |
|---|---|
| API | API/Control Plane |
| Envelope | Protocol |
| Command | Domain owner + Protocol |
| Event | Domain owner + Protocol |
| Error | Protocol |
| Artifact | Artifact/Runtime |
| SDK | SDK |
| Runtime | Runtime |
| Lab Agent | Lab |
| Platform | Platform |
| Studio | Frontend |

# 15. Compatibility Terminology

### Compatible

An existing supported client can continue operating without modification.

### Breaking

An existing supported client can no longer correctly operate without
modification.

### Deprecated

A contract remains available but should no longer be used for new development.

### Retired

A contract is no longer supported.

### Negotiated

Two peers explicitly select a mutually supported version.

### Pinned

A component requires a specific version or bounded compatibility range.

# 16. Compatibility Matrix

Compatibility should be represented explicitly.

Example:

| Studio | API | Protocol | Status |
|---|---|---|---|
| 2.x | v1 | 1.x | Supported |
| 3.x | v1 | 1.x | Supported |
| 4.x | v2 | 2.x | Supported |
| 2.x | v2 | 2.x | Not supported |

The actual matrix is maintained by release documentation and automated tests.

# 17. Compatibility Rule

The platform must answer:

> Can component A communicate correctly with component B?

This must be determined using explicit compatibility metadata, not assumptions
based only on software release numbers.

# 18. Backward Compatibility

Backward compatibility means:

    New Server
        |
        +--> Old Client
        |
        +--> New Client

during the supported migration window.

The server should maintain compatibility with supported clients where practical.

# 19. Forward Compatibility

Forward compatibility means:

    Old Client
        |
        v
    New Server

can continue operating despite compatible server additions.

This is achieved by:

- optional fields;
- unknown-field tolerance where defined;
- stable semantics;
- explicit versioning.

# 20. Breaking Changes

A change is breaking if it causes a supported consumer to:

- fail parsing;
- fail validation;
- misinterpret data;
- lose required functionality;
- violate security assumptions;
- violate execution assumptions.

Examples:

- removing a required field;
- changing field type;
- changing field meaning;
- removing an event;
- changing event semantics;
- changing status meaning;
- changing identifier semantics.

# 21. Compatible Changes

Typical compatible changes include:

- adding optional response fields;
- adding optional metadata;
- adding a new event type;
- adding a new API endpoint;
- adding optional request fields with safe defaults;
- adding new error codes;
- adding non-breaking capabilities.

# 22. Potentially Breaking Changes

The following require careful review:

- changing default behavior;
- tightening validation;
- changing pagination behavior;
- reducing size limits;
- changing timeout semantics;
- changing rate limits;
- changing ordering guarantees;
- changing retry semantics.

Even if a schema remains structurally compatible, behavior can still be breaking.

# 23. Event Versioning

Events are versioned through the protocol and event schema contract.

Example:

    protocol_version = "1.2"
    event = "job.running"

A compatible event evolution may add optional fields.

A semantic change requires:

- a new event version;
- a new event name;
- or a new protocol major version,

depending on scope.

# 24. Event Name Stability

Once published:

    job.running

must continue to mean:

> The job has entered the running state.

It must not later be changed to mean:

> The job has been requested to start.

Semantic meaning must remain stable.

# 25. Event Addition

Adding:

    job.paused

is generally compatible if existing consumers are required to tolerate unknown
event types.

Consumers must not fail globally when they encounter an event they do not know.

# 26. Event Removal

Removing a previously supported event is breaking for consumers that depend on it.

Removal requires:

- deprecation;
- migration guidance;
- support window;
- compatibility testing;
- version transition.

# 27. Command Versioning

Commands are versioned through the API/protocol contract.

Example:

    artifact.validate

If the request schema gains an optional field, no new command version is
required.

If the command's required semantics change incompatibly, a new version strategy
is required.

# 28. Command Evolution

Preferred strategy:

    Existing Command
          |
          +--> optional additions
          |
          v
    Same command contract

For breaking changes:

    Existing Command
          |
          v
    Deprecate
          |
          v
    New version / replacement
          |
          v
    Retire old command

# 29. Response Evolution

Responses should be designed for additive evolution.

Example:

    v1 response:
        project_id
        name

    compatible response:
        project_id
        name
        created_at

Existing clients must continue to operate.

# 30. Request Evolution

Requests require greater caution because servers must understand client
inputs.

Optional request fields may be added when:

- omitted value has safe behavior;
- old clients remain valid;
- server behavior is backward compatible.

Making an existing optional field required is breaking.

# 31. Field Removal

Removing a field is breaking if a supported consumer may rely on it.

Process:

    Field Used
       |
       v
    Deprecate
       |
       v
    Announce
       |
       v
    Migration
       |
       v
    Stop New Usage
       |
       v
    Remove in Major Version

# 32. Field Type Changes

Changing:

    integer

to:

    string

is breaking even if the semantic value appears similar.

A new field should be introduced instead.

# 33. Enum Evolution

Adding an enum value can be breaking for clients that incorrectly assume an
exhaustive set.

Therefore enum additions require one of:

- documented unknown-value handling;
- versioned contract;
- client compatibility requirement.

Clients should include an unknown/default branch.

# 34. Status Evolution

Application statuses are protocol contracts.

Current baseline includes:

    SUCCESS
    ACCEPTED
    REJECTED
    PENDING
    IN_PROGRESS
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT
    UNAUTHORIZED
    FORBIDDEN
    NOT_FOUND
    CONFLICT
    INVALID_REQUEST
    UNAVAILABLE

Existing status meanings must not change.

# 35. Error Code Evolution

Error codes are stable contracts.

Adding:

    NEW_ERROR_CODE

is generally compatible.

Changing:

    BOOKING_CONFLICT

to mean something else is breaking.

Clients must branch on codes, not messages.

# 36. Error Message Evolution

Human-readable messages may change without a protocol version change.

Messages are not machine contracts.

Example:

    "The selected robot is unavailable."

may later become:

    "The selected robot is no longer available for this time slot."

The error code remains stable.

# 37. Envelope Evolution

Envelope changes follow strict compatibility rules.

Compatible:

- new optional metadata;
- new optional tracing information;
- new optional context.

Breaking:

- removal of `request_id`;
- change of `timestamp` semantics;
- change of `protocol_version` semantics;
- change of message identity rules.

# 38. Metadata Evolution

Metadata is designed for controlled extensibility.

New optional metadata may be introduced without breaking compatible consumers.

Security-sensitive metadata changes require explicit review.

# 39. Correlation Evolution

The following identifiers have stable meanings:

    request_id
    event_id
    operation_id
    trace_id
    span_id
    resource.id

Their semantics must not be repurposed.

# 40. Timestamp Evolution

Timestamp semantics are stable:

    timestamp
        =
    message creation time

Physical observation uses:

    observed_at

Changing these meanings is breaking.

# 41. API URL Versioning

REST major versions use:

    /api/v1/
    /api/v2/

Do not encode minor versions in URLs such as:

    /api/v1.2/

unless a future architecture explicitly requires it.

# 42. API Header Negotiation

Content negotiation may use headers where appropriate.

Example:

    Accept: application/vnd.kritva.raas+json;version=1

However, the baseline API uses URL major versioning because it is:

- visible;
- easy to route;
- easy to document;
- easy to monitor;
- easy to support simultaneously.

# 43. Protocol Negotiation

Peer protocols such as Lab Channel should negotiate supported versions.

Conceptual handshake:

    Client
      |
      | supported: 1.0, 1.1
      v
    Server
      |
      | selected: 1.1
      v
    Client

The selected version must be mutually supported.

# 44. Protocol Handshake

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-handshake-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "command": "protocol.negotiate",
        "payload": {
            "supported_versions": [
                "1.0",
                "1.1"
            ]
        }
    }

Response:

    {
        "protocol_version": "1.1",
        "request_id": "req-handshake-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "status": "SUCCESS",
        "code": "PROTOCOL_VERSION_SELECTED",
        "message": "Protocol version selected.",
        "data": {
            "selected_version": "1.1"
        },
        "error": null
    }

# 45. Negotiation Failure

If no mutually supported version exists:

    PROTOCOL_VERSION_UNSUPPORTED

The peer must not silently downgrade to an incompatible version.

# 46. Negotiation Rules

Version negotiation must:

1. authenticate the peer where required;
2. advertise supported versions;
3. select an explicitly compatible version;
4. reject unsupported combinations;
5. record selected version;
6. expose compatibility diagnostics.

# 47. Lab Protocol Versioning

The Lab Agent is a long-lived deployment component and therefore requires
explicit version compatibility.

Example:

    Control Plane
        supports Lab Protocol:
            1.0
            1.1

    Lab Agent
        supports:
            1.0
            1.1

    Selected:
        1.1

# 48. Lab Agent Compatibility

Lab Agent compatibility should consider:

- Lab Protocol;
- Control Plane version;
- Agent version;
- Kritva Runtime;
- platform integration;
- security capabilities.

A Lab Agent software version must not be assumed compatible merely because it
shares a major version with the Control Plane.

# 49. Lab Agent Upgrade

Recommended process:

    Current Agent
         |
         v
    Verify compatible Control Plane
         |
         v
    Upgrade Agent
         |
         v
    Handshake
         |
         v
    Health Check
         |
         v
    Capability Check
         |
         v
    Enable Scheduling

# 50. Runtime Compatibility

A Lab Agent may support multiple Kritva Runtime versions.

Compatibility must be expressed explicitly.

Example:

    Agent 1.5
        supports Runtime:
            2.0
            2.1
            2.2

# 51. Artifact Compatibility

Artifact compatibility is multidimensional.

A `.krv` artifact may specify:

    artifact_format_version
    platform_id
    platform_version
    architecture
    kritva_os_version
    runtime_version
    sdk_version
    required_capabilities

An artifact must only be executed when all required compatibility conditions
are satisfied.

# 52. Artifact Format Versioning

Artifact format uses:

    MAJOR.MINOR

Example:

    artifact_format = "2.1"

Compatible changes:

- optional manifest fields;
- optional package metadata.

Breaking changes:

- changed manifest semantics;
- changed binary layout;
- incompatible loader behavior.

# 53. SDK Versioning

The Kritva SDK follows:

    MAJOR.MINOR.PATCH

An SDK major version may require:

- source changes;
- artifact rebuild;
- new runtime compatibility.

An SDK patch release should remain source-compatible.

# 54. KritvaOS Versioning

KritvaOS follows:

    MAJOR.MINOR.PATCH

Runtime compatibility is separately declared.

Example:

    KritvaOS 3.2.1
    Runtime 2.4.0
    SDK 4.1.2

The artifact manifest records required versions.

# 55. Platform Versioning

Robot platforms are versioned independently.

Example:

    humanoid-a@2.1

A platform version identifies:

- hardware;
- interfaces;
- capabilities;
- runtime assumptions;
- safety constraints.

A platform update must not silently change capability semantics.

# 56. Studio Versioning

Studio uses Semantic Versioning.

Example:

    3.4.1

Studio compatibility is determined by:

- API version;
- protocol version;
- artifact format;
- authentication contract;
- platform metadata;
- feature compatibility.

# 57. Web Console Versioning

Web Console releases independently from backend implementation releases.

The browser client must use a supported API major version.

The Control Plane may temporarily support multiple API versions during migration.

# 58. API Client Versioning

`packages/api-client` should track the API contract it targets.

Example:

    api-client 2.x
        targets API v1

The package version is not required to equal the API major version.

Compatibility metadata should make the relationship explicit.

# 59. Compatibility Matrix Example

| Component | Version | Compatible With |
|---|---|---|
| Studio | 3.x | API v1, Protocol 1.x |
| Control Plane | 4.x | API v1/v2, Protocol 1.x/2.x |
| Lab Agent | 1.5 | Lab Protocol 1.x |
| Runtime | 2.2 | Artifact Format 2.x |
| SDK | 4.1 | Runtime 2.x |
| Artifact | Format 2.1 | Runtime 2.x |

This is illustrative; production matrices must be generated from tested
compatibility declarations.

# 60. Compatibility Declaration

Components should expose machine-readable compatibility information.

Example:

    {
        "component": "lab-agent",
        "version": "1.5.0",
        "supported_protocols": [
            "1.0",
            "1.1"
        ],
        "supported_runtime_versions": [
            "2.1",
            "2.2"
        ]
    }

# 61. Capability vs Version

Version compatibility is not sufficient.

A peer may be version-compatible but lack a required capability.

Therefore:

    Version Compatibility
          +
    Capability Compatibility
          =
    Operational Compatibility

# 62. Capability Negotiation

Example:

    supported_capabilities:
        telemetry.v2
        artifacts.v2
        live_video.v1

A client should use capability negotiation where feature availability is
independent of version.

# 63. Version vs Feature Flags

Versioning answers:

> Is the contract compatible?

Feature flags answer:

> Is this feature enabled?

Do not create protocol versions solely for rollout controls.

# 64. Deprecation

Deprecation means:

> The contract remains supported but should no longer be used for new work.

Deprecation must include:

- reason;
- replacement;
- migration guidance;
- support period;
- planned retirement.

# 65. Deprecation Lifecycle

    ACTIVE
       |
       v
    DEPRECATED
       |
       v
    MIGRATION WINDOW
       |
       v
    RETIRED

A deprecated contract remains operational until its announced retirement point.

# 66. Deprecation Notice

API responses may include:

    metadata:
        deprecation:
            deprecated: true
            replacement: "/api/v2/..."
            sunset_at: "2027-06-30T00:00:00Z"

HTTP deprecation headers may also be used where appropriate.

# 67. Deprecation Policy

A production deprecation should provide:

- announcement;
- documentation update;
- replacement contract;
- migration guide;
- telemetry;
- support timeline;
- retirement date.

# 68. Minimum Deprecation Window

For public production APIs, the target minimum deprecation window should be
defined as part of the release policy.

A longer window may be required for:

- physical lab deployments;
- educational users;
- enterprise integrations;
- long-lived Lab Agents.

# 69. Internal Contracts

Internal implementation contracts may have shorter migration windows.

However, shared protocols crossing:

- Studio;
- Control Plane;
- Lab Agent;
- Runtime;

must follow explicit compatibility policy.

# 70. Breaking Change Process

A breaking change follows:

    Proposal
       |
       v
    Impact Analysis
       |
       v
    Architecture Review
       |
       v
    Version Decision
       |
       v
    Compatibility Implementation
       |
       v
    Migration Support
       |
       v
    Deprecation
       |
       v
    Release
       |
       v
    Retirement

# 71. Change Classification

Every protocol change must be classified:

    PATCH
    MINOR
    MAJOR

and:

    COMPATIBLE
    POTENTIALLY_BREAKING
    BREAKING

The stricter classification wins.

# 72. Change Review Table

| Change | Classification |
|---|---|
| Fix typo in documentation | Patch |
| Add optional response field | Minor |
| Add new endpoint | Minor |
| Add new event | Minor |
| Add new error code | Minor |
| Remove required field | Major |
| Change field type | Major |
| Change event meaning | Major |
| Remove event | Major |
| Change status meaning | Major |
| Tighten validation | Review required |
| Reduce message limit | Review required |
| Change ordering guarantee | Major |
| Change retry semantics | Major/review |

# 73. Migration Strategy

Migration should support coexistence when practical.

Example:

    Client v1
       |
       +----> API v1
       |
       +----> migration
       |
       +----> API v2
       |
       v
    Client v2

The server may temporarily support both APIs.

# 74. Dual-Version Server

During migration:

    Control Plane
       |
       +--> /api/v1
       |
       +--> /api/v2
       |
       +--> shared domain services
       |
       v
    PostgreSQL

The API versions should converge on common domain logic where semantics remain
equivalent.

# 75. Avoid Duplicate Business Logic

Version adapters should translate contracts:

    API v1
       |
       v
    Adapter
       |
       v
    Domain Service

    API v2
       |
       v
    Adapter
       |
       v
    Domain Service

Do not maintain independent business logic for each API version unless
absolutely necessary.

# 76. Migration Adapter

A compatibility adapter may translate:

    v1 Request
        |
        v
    Canonical Domain Request
        |
        v
    Domain Service
        |
        v
    v1 Response

This isolates version-specific wire behavior.

# 77. Event Migration

Event consumers should support old and new event contracts during migration.

Example:

    Producer
       |
       +--> Event v1
       |
       +--> Event v2
       |
       v
    Consumers

Dual publication should only be used when operationally necessary and must
avoid duplicate business actions.

# 78. Event Translation

Where possible:

    Event v1
       |
       v
    Canonical Event Model
       |
       v
    Event v2

This avoids duplicating business state transitions.

# 79. Protocol Migration

For peer protocols:

    Old Protocol
        |
        | compatibility window
        v
    New Protocol

The new peer should initially support the old protocol.

Once all peers migrate:

    Old Protocol
        |
        v
    Retire

# 80. Lab Migration

Recommended:

    Control Plane supports:
        1.0
        1.1

    Agent A:
        1.0

    Agent B:
        1.1

After migration:

    Control Plane:
        1.1

    All agents:
        1.1

Then retire 1.0.

# 81. Studio Migration

Recommended:

    Backend
        supports API v1 + v2

    Studio
        initially v1

    Studio update
        moves to v2

    Telemetry
        confirms v1 usage declines

    API v1
        deprecated

    API v1
        retired

# 82. Artifact Migration

Artifact format migrations require special care because artifacts may persist
longer than software releases.

Strategy:

    Artifact Format 1.x
        |
        v
    Reader supports 1.x + 2.x
        |
        v
    New builds produce 2.x
        |
        v
    Existing 1.x artifacts remain executable
        |
        v
    1.x retirement

Retirement must consider stored customer artifacts.

# 83. Database Independence

API versioning must not expose database schema versioning.

For example:

    API v1
    API v2
       |
       v
    Domain Model
       |
       v
    Database

Database migrations can occur without changing API versions when the external
contract remains compatible.

# 84. Rollback

Every version migration should define rollback behavior.

Example:

    Release v2
       |
       v
    Detect issue
       |
       v
    Roll back application
       |
       v
    Continue API v1
       |
       v
    Investigate

Breaking database changes must not make application rollback impossible.

# 85. Forward Rollback Strategy

Production deployments should prefer:

- backward-compatible database changes;
- expand/contract migrations;
- feature flags;
- dual-read/dual-write only where necessary;
- staged rollout.

# 86. Version Observability

The Control Plane should record:

- client version;
- API version;
- protocol version;
- schema version;
- Lab Agent version;
- Runtime version;
- artifact format version;
- platform version.

This allows compatibility failures to be diagnosed.

# 87. Version Metrics

Recommended metrics:

    requests_by_api_version
    websocket_connections_by_protocol
    lab_agents_by_protocol
    artifacts_by_format_version
    clients_by_version
    deprecated_api_usage
    unsupported_version_attempts
    negotiation_failures

# 88. Version Dashboard

Production dashboards should show:

    API v1 usage
    API v2 usage
    Protocol 1.x usage
    Protocol 2.x usage
    Deprecated client count
    Deprecated agent count
    Unsupported-version errors

This allows retirement decisions to be evidence-based.

# 89. Compatibility Testing

CI should test:

    Old Client -> New Server
    New Client -> Supported Server
    Old Agent -> New Control Plane
    New Agent -> Supported Control Plane
    Old Artifact -> Supported Runtime
    New Artifact -> Supported Runtime

Only combinations declared supported should be required to pass.

# 90. Contract Test Matrix

Example:

| Producer | Consumer | Contract |
|---|---|---|
| Studio | Control Plane | API |
| Studio | Local Runtime | IPC |
| Control Plane | Studio | Events |
| Control Plane | Agent | Lab Protocol |
| Agent | Control Plane | Lab Protocol |
| Runtime | Agent | Runtime contract |
| Builder | Runtime | Artifact format |

# 91. Version Compatibility CI

CI should fail when:

- a required field is removed;
- a type changes;
- an enum meaning changes;
- an event disappears without versioning;
- an API endpoint breaks;
- an old supported client cannot communicate;
- artifact compatibility is broken.

# 92. Schema Diff

Every contract release should produce a schema diff.

Example:

    Added optional field:
        compatible

    Removed required field:
        breaking

    Changed integer -> string:
        breaking

    Added event:
        compatible

The classification should be reviewed automatically and manually where needed.

# 93. Release Gate

A release cannot be marked production-ready until:

- compatibility tests pass;
- deprecations are documented;
- migration documentation exists;
- version matrix is updated;
- rollback plan exists;
- observability is available.

# 94. Version Negotiation Flow

    Peer A
       |
       | supported = [1.0, 1.1]
       v
    Peer B
       |
       | supported = [1.1, 1.2]
       v
    Common = [1.1]
       |
       v
    Select 1.1
       |
       v
    Communication

# 95. Negotiation Failure Flow

    Peer A
       |
       | [1.0]
       v
    Peer B
       |
       | [2.0]
       v
    No common version
       |
       v
    PROTOCOL_VERSION_UNSUPPORTED
       |
       v
    Stop communication

No unsafe compatibility assumption is permitted.

# 96. API Migration Flow

    API v1
       |
       v
    v1 deprecated
       |
       v
    v2 introduced
       |
       +--> v1 supported
       |
       v
    Clients migrate
       |
       v
    v1 usage approaches zero
       |
       v
    v1 retired

# 97. Artifact Migration Flow

    Format 1
       |
       v
    Runtime reads 1 + 2
       |
       v
    Builder produces 2
       |
       v
    New artifacts use 2
       |
       v
    Existing 1 retained
       |
       v
    Format 1 retired when policy permits

# 98. Version Metadata Example

    {
        "component": "studio",
        "version": "3.2.1",
        "api_versions": [
            "v1"
        ],
        "protocol_versions": [
            "1.0",
            "1.1"
        ],
        "artifact_formats": [
            "2.0"
        ]
    }

# 99. Runtime Compatibility Example

    {
        "component": "kritva-runtime",
        "version": "2.3.0",
        "artifact_formats": [
            "2.0",
            "2.1"
        ],
        "platform_versions": [
            "humanoid-a@2.0",
            "humanoid-a@2.1"
        ]
    }

# 100. Lab Agent Compatibility Example

    {
        "component": "lab-agent",
        "version": "1.5.0",
        "protocol_versions": [
            "1.0",
            "1.1"
        ],
        "runtime_versions": [
            "2.2",
            "2.3"
        ]
    }

# 101. Compatibility API

The Control Plane may expose a compatibility query:

    platform.compatibility

The response can evaluate:

    artifact
       +
    platform
       +
    runtime
       +
    SDK
       +
    artifact format

before execution.

# 102. Preflight Compatibility

Recommended execution flow:

    Artifact
       |
       v
    Compatibility Check
       |
       +--> compatible
       |       |
       |       v
       |     Booking
       |
       +--> incompatible
               |
               v
        ARTIFACT_INCOMPATIBLE

# 103. Protocol Preflight

Before Lab execution:

    Control Plane
       |
       v
    Agent capability/version
       |
       v
    Compatibility
       |
       +--> pass
       |
       +--> fail
              |
              v
       AGENT_VERSION_UNSUPPORTED

# 104. Version Pinning

Critical physical execution environments should pin compatible versions.

Example:

    Robot Resource
        requires:
            Runtime >=2.2,<3.0
            Agent >=1.5,<2.0
            Protocol 1.x

This prevents unexpected upgrades from changing robot behavior.

# 105. Version Ranges

Version ranges may be used for software compatibility.

Example:

    >=1.5.0 <2.0.0

Ranges must be interpreted according to the component's versioning policy.

For physical systems, narrower ranges are preferred.

# 106. Exact Pinning

Exact versions are appropriate when:

- safety validation depends on a specific version;
- certification requires a fixed release;
- hardware behavior is version-sensitive;
- a controlled experiment requires reproducibility.

# 107. Reproducibility

Experiments should record:

- Studio version;
- SDK version;
- artifact format;
- KritvaOS version;
- Runtime version;
- Lab Agent version;
- platform version;
- protocol version.

This enables rerunning an experiment with the same environment.

# 108. Experiment Version Record

Example:

    {
        "studio_version": "3.2.1",
        "sdk_version": "4.1.0",
        "artifact_format": "2.1",
        "kritva_os_version": "3.2.0",
        "runtime_version": "2.3.0",
        "agent_version": "1.5.0",
        "platform_version": "humanoid-a@2.1",
        "protocol_version": "1.1"
    }

# 109. Version Audit

Execution records should retain relevant versions.

This is required for:

- debugging;
- reproducibility;
- security investigations;
- customer support;
- result interpretation.

# 110. Security Versioning

Security fixes may require accelerated retirement.

A vulnerable protocol or component may be:

    ACTIVE
       |
       v
    SECURITY DEPRECATED
       |
       v
    BLOCKED
       |
       v
    RETIRED

Security deprecation may override normal migration windows.

# 111. Emergency Version Retirement

The platform must support emergency disabling of:

- vulnerable API versions;
- vulnerable protocol versions;
- compromised artifact formats;
- vulnerable Lab Agents;
- revoked runtimes.

Execution should fail with a stable compatibility/security error rather than
silently continuing.

# 112. Security Compatibility

Compatibility must not override security policy.

Example:

    Protocol 1.0
       |
       v
    Technically compatible
       |
       X
    Security policy blocks it
       |
       v
    PROTOCOL_VERSION_BLOCKED

# 113. Proposed Additional Error Codes

The error registry should include:

    PROTOCOL_VERSION_UNSUPPORTED
    PROTOCOL_VERSION_BLOCKED
    PROTOCOL_NEGOTIATION_FAILED
    PROTOCOL_SCHEMA_UNSUPPORTED
    ARTIFACT_FORMAT_UNSUPPORTED
    RUNTIME_VERSION_UNSUPPORTED
    SDK_VERSION_UNSUPPORTED
    API_VERSION_UNSUPPORTED
    VERSION_MIGRATION_REQUIRED

These codes should be formally registered in `ERROR_CODES.md` when implemented.

# 114. Version Deprecation Error

When a version is retired:

    API_VERSION_RETIRED

HTTP:

    410

Message:

    "This API version is no longer supported. Upgrade to a supported version."

Retryable:

    false

# 115. Migration Required Error

If a component must upgrade before operation:

    VERSION_MIGRATION_REQUIRED

HTTP:

    409

Message:

    "This component must be upgraded before the operation can continue."

Phase:

    Phase 8.

# 116. Version Negotiation Error

If peers cannot agree:

    PROTOCOL_NEGOTIATION_FAILED

HTTP/transport:

    400/409 or protocol-level failure

Message:

    "The connected components do not support a compatible protocol version."

# 117. Version Blocked Error

If security policy blocks a version:

    PROTOCOL_VERSION_BLOCKED

HTTP:

    403 or 409

Message:

    "This protocol version is no longer permitted."

# 118. Version Registry

The repository should maintain a version registry containing:

| Field | Purpose |
|---|---|
| Component | Component name |
| Current Version | Current production release |
| Supported Versions | Compatibility window |
| Deprecated Versions | Migration window |
| Retired Versions | Unsupported |
| Protocols | Supported protocol versions |
| Owner | Responsible team |
| Sunset | Planned retirement |
| Security State | Active/blocked |

# 119. Version Registry Location

Recommended:

    docs/protocol/
        VERSIONING.md
        VERSION_MATRIX.md

And machine-readable compatibility data may reside under:

    packages/contracts/
        compatibility/

The exact machine-readable registry format is an implementation decision.

# 120. Release Documentation

Every versioned release should document:

- version;
- compatible APIs;
- protocol versions;
- artifact format;
- SDK compatibility;
- runtime compatibility;
- Lab Agent compatibility;
- platform compatibility;
- deprecated contracts;
- migration requirements.

# 121. Migration Guide

A breaking migration guide should contain:

1. current version;
2. target version;
3. breaking changes;
4. compatible changes;
5. required code changes;
6. required configuration changes;
7. artifact rebuild requirements;
8. Lab Agent upgrade requirements;
9. rollback process;
10. validation steps.

# 122. Migration Example

    Current:
        Studio 3.x
        API v1
        Protocol 1.x

    Target:
        Studio 4.x
        API v2
        Protocol 2.x

Steps:

    1. Upgrade Control Plane
    2. Enable v1 + v2
    3. Upgrade Lab Agents
    4. Validate protocol 2.x
    5. Upgrade Studio
    6. Validate execution
    7. Monitor v1 usage
    8. Deprecate v1
    9. Retire v1

# 123. Production Rollout

Breaking version rollouts should be staged:

    Development
        |
        v
    Staging
        |
        v
    Canary
        |
        v
    Limited Production
        |
        v
    Full Production

Compatibility tests must run before each gate.

# 124. Canary Compatibility

Canary deployment should verify:

- old client compatibility;
- new client compatibility;
- Lab Agent compatibility;
- event delivery;
- artifact validation;
- booking;
- credits;
- job execution;
- results.

# 125. Version Rollback

Rollback should restore application versions without invalidating durable state.

Where possible:

    v2 application
       |
       X
    rollback
       |
       v
    v1 application

must continue reading/writing the same compatible database state.

# 126. Expand/Contract

Database and protocol migrations should prefer:

    EXPAND
       |
       v
    COMPATIBLE
       |
       v
    MIGRATE
       |
       v
    CONTRACT

This minimizes the period where old and new components cannot coexist.

# 127. Version Retirement

Retirement requires:

- no supported clients remain;
- usage metrics confirm migration;
- documentation updated;
- monitoring confirms no traffic;
- rollback plan evaluated;
- support team informed;
- security implications reviewed.

# 128. Retirement Flow

    Deprecated
       |
       v
    Monitor Usage
       |
       v
    Migration Complete
       |
       v
    Freeze New Usage
       |
       v
    Retire
       |
       v
    Reject With Version Error

# 129. Phase Mapping

| Phase | Versioning Work |
|---|---|
| Phase 0 | Protocol/API version foundation |
| Phase 1 | Studio/API compatibility |
| Phase 2 | Artifact format compatibility |
| Phase 3 | Control Plane/API evolution |
| Phase 4 | Commercial compatibility |
| Phase 5 | Job/Lab protocol negotiation |
| Phase 6 | Runtime/platform compatibility |
| Phase 7 | Event/telemetry compatibility |
| Phase 8 | Deprecation, migration, retirement |

# 130. P0 FOUNDATION

Implement:

- semantic versioning rules;
- API major versioning;
- protocol major/minor;
- envelope version;
- schema compatibility rules;
- version registry.

Acceptance:

- version semantics are documented;
- compatible/breaking changes are classified;
- contract tests exist.

# 131. P1 STUDIO

Implement:

- Studio/API compatibility;
- IPC versioning;
- client version metadata;
- API client compatibility.

Acceptance:

- Studio identifies its supported API versions;
- unsupported API versions are rejected cleanly.

# 132. P2 BUILD & ARTIFACT — Artifact

Implement:

- artifact format version;
- manifest compatibility;
- SDK/runtime compatibility;
- artifact preflight.

Acceptance:

- incompatible artifacts are rejected before execution;
- existing supported artifacts remain executable.

# 133. P3 CONTROL PLANE

Implement:

- API v1 contract;
- OpenAPI versioning;
- response compatibility;
- event compatibility;
- version observability.

Acceptance:

- API v1 remains stable;
- schema compatibility is CI-tested.

# 134. P4 BOOKING & COMMERCIAL — Commercial

Implement:

- booking compatibility;
- credit contract compatibility;
- payment integration compatibility;
- idempotency behavior across versions.

Acceptance:

- old supported clients cannot accidentally double-charge;
- booking operations remain compatible.

# 135. P5 EXECUTION

Implement:

- Lab Protocol negotiation;
- Lab Agent compatibility;
- job contract versions;
- resource compatibility.

Acceptance:

- incompatible agents cannot receive execution commands;
- supported old agents continue to operate during migration.

# 136. P6 LAB & ROBOT — Physical Robot

Implement:

- Runtime compatibility;
- platform version compatibility;
- safety-sensitive version pinning;
- emergency version blocking.

Acceptance:

- robot execution only occurs on approved compatible versions;
- blocked versions cannot execute.

# 137. P7 LIVE & RESULTS

Implement:

- run/event compatibility;
- telemetry schema evolution;
- result compatibility;
- experiment reproducibility metadata.

Acceptance:

- older supported consumers tolerate new optional event fields;
- experiment records retain relevant version information.

# 138. P8 PRODUCTION

Implement:

- deprecation monitoring;
- migration dashboards;
- retirement;
- security blocking;
- compatibility SLOs;
- release governance.

Acceptance:

- deprecated usage is measurable;
- retirement is controlled;
- unsupported versions receive stable errors.

# 139. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Silent breaking change | Critical | Contract testing |
| Too many versions | High | Defined support window |
| Version fragmentation | High | Compatibility matrix |
| Old Lab Agent | Critical | Negotiation + minimum version |
| Old artifacts | High | Format compatibility |
| Hidden semantic break | Critical | Behavioral tests |
| Client/server mismatch | High | API versioning |
| Event incompatibility | High | Event compatibility rules |
| Security vulnerability | Critical | Emergency retirement |
| Rollback failure | Critical | Expand/contract |
| Unsupported downgrade | High | Explicit negotiation |
| Version drift | Medium | Machine-readable registry |
| Migration fatigue | Medium | Clear tooling/guides |
| Database coupling | High | Domain/API abstraction |

# 140. Risk — Version Explosion

Supporting too many historical versions increases:

- test matrix;
- implementation complexity;
- operational cost;
- security exposure.

Mitigation:

- explicit support windows;
- deprecation;
- retirement;
- limited concurrent major versions.

# 141. Risk — Hidden Breaking Behavior

A schema may remain compatible while behavior changes.

Example:

    booking.create

still validates successfully but now rejects durations previously allowed.

Mitigation:

- behavioral compatibility tests;
- documented policy changes;
- deprecation when necessary;
- migration review.

# 142. Risk — Physical Robot Compatibility

A software upgrade may be technically compatible but operationally unsafe.

Mitigation:

- explicit runtime/platform matrix;
- version pinning;
- staged deployment;
- human safety review;
- physical validation.

# 143. Risk — Long-Lived Artifacts

Artifacts may outlive the runtime that created them.

Mitigation:

- explicit artifact format;
- compatibility metadata;
- supported reader window;
- artifact migration/rebuild tools.

# 144. Risk — Long-Lived Lab Agents

Labs may not be upgraded as frequently as cloud services.

Mitigation:

- negotiated Lab Protocol;
- compatibility window;
- health reporting;
- upgrade readiness status;
- controlled retirement.

# 145. Risk — Event Consumer Fragility

Clients may assume exhaustive event enums.

Mitigation:

- forward-compatible event handling;
- unknown-event tolerance;
- REST reconciliation;
- event compatibility tests.

# 146. Risk — Security and Compatibility Conflict

An old version may remain technically compatible but insecure.

Mitigation:

    Compatibility
        +
    Security Policy
        |
        v
    Allowed Version Set

Security policy can override technical compatibility.

# 147. Open Questions

1. What exact Semantic Versioning implementation will be used across all
   repositories?
2. What exact API v1 support window will be adopted?
3. How many API major versions may coexist in production?
4. What exact protocol support window will be required?
5. Will protocol negotiation be mandatory for all Lab Agent connections?
6. What exact JSON Schema version will be used?
7. Will event schemas have independent semantic versions?
8. What exact artifact-format compatibility window will be supported?
9. What exact runtime/SDK compatibility matrix will be published?
10. What exact Lab Agent upgrade SLA will apply?
11. How will version metadata be exposed through APIs?
12. Will a machine-readable compatibility endpoint be provided?
13. What exact deprecation duration will apply to public APIs?
14. What exact deprecation duration will apply to Lab Agents?
15. What exact retirement procedure is required for security vulnerabilities?
16. How will emergency version blocking be propagated to offline labs?
17. How will old artifacts be handled after runtime retirement?
18. What exact compatibility tests will run in CI?
19. What exact canary policy will be used for protocol upgrades?
20. How will API v1 and v2 share domain services?
21. Will WebSocket protocol versions be URL-based or handshake-negotiated?
22. What exact capability-negotiation model will be used?
23. How will protocol versions be represented in Lab Agent health?
24. What exact version matrix is required for enterprise customers?
25. What exact rollback guarantees are required?
26. What exact RaaS release train governs API retirement?
27. How will deprecated API usage be communicated to customers?
28. What exact version information should be retained in run records?
29. What exact security policy can force version retirement?
30. What exact support policy applies to archived experiments and artifacts?

# 148. Version Registry Acceptance

- [ ] Every versioned component has an owner.
- [ ] Every component has a current version.
- [ ] Supported versions are documented.
- [ ] Deprecated versions are documented.
- [ ] Retired versions are documented.
- [ ] Security-blocked versions are documented.
- [ ] Compatibility ranges are documented.
- [ ] Version registry is machine-readable where practical.

# 149. Semantic Versioning Acceptance

- [ ] Software uses MAJOR.MINOR.PATCH.
- [ ] Major changes identify breaking changes.
- [ ] Minor releases remain compatible.
- [ ] Patch releases remain compatible.
- [ ] Protocol uses MAJOR.MINOR.
- [ ] API major versions use `/api/vN/`.
- [ ] Envelope version semantics are documented.

# 150. API Versioning Acceptance

- [ ] API v1 contract is defined.
- [ ] API version is visible.
- [ ] API major changes create a new major path.
- [ ] Minor changes do not unnecessarily create new paths.
- [ ] API version compatibility is tested.
- [ ] Old supported clients are tested against new servers.
- [ ] API retirement is controlled.
- [ ] API retirement returns a stable error.

# 151. Protocol Acceptance

- [ ] Protocol version is present in envelopes.
- [ ] Protocol major changes are explicit.
- [ ] Compatible minor changes are supported.
- [ ] Version negotiation exists where required.
- [ ] Unsupported versions are rejected.
- [ ] Blocked versions are rejected.
- [ ] Selected protocol version is observable.
- [ ] Lab Protocol compatibility is tested.

# 152. Envelope Acceptance

- [ ] Request envelope version is defined.
- [ ] Response envelope version is defined.
- [ ] Event envelope version is defined.
- [ ] Envelope semantics are stable.
- [ ] Request IDs remain stable.
- [ ] Event IDs remain stable.
- [ ] Correlation semantics remain stable.
- [ ] Timestamp semantics remain stable.

# 153. Event Acceptance

- [ ] Existing event meanings remain stable.
- [ ] New events are additive where possible.
- [ ] Event removal requires deprecation.
- [ ] Event consumers tolerate unknown events.
- [ ] Event schemas are compatibility-tested.
- [ ] Event replay preserves original event identity.
- [ ] Event version migrations are documented.

# 154. Error Acceptance

- [ ] Error codes are stable.
- [ ] New error codes are additive.
- [ ] Error semantics do not change silently.
- [ ] Error messages may evolve.
- [ ] Clients branch on codes.
- [ ] Version errors use stable codes.
- [ ] Security-blocked versions have explicit errors.

# 155. Artifact Acceptance

- [ ] Artifact format has explicit version.
- [ ] Manifest records artifact format.
- [ ] Runtime compatibility is declared.
- [ ] SDK compatibility is declared.
- [ ] Platform compatibility is declared.
- [ ] Unsupported formats are rejected.
- [ ] Existing supported artifacts remain executable.
- [ ] Artifact migration is documented.

# 156. Lab Acceptance

- [ ] Lab Agent reports version.
- [ ] Lab Agent reports protocol support.
- [ ] Protocol negotiation is tested.
- [ ] Unsupported agents are rejected.
- [ ] Supported old agents work during migration.
- [ ] Runtime compatibility is verified.
- [ ] Platform compatibility is verified.
- [ ] Security-blocked agents cannot execute.

# 157. Runtime Acceptance

- [ ] Runtime versions are explicit.
- [ ] Artifact/runtime compatibility is tested.
- [ ] Platform/runtime compatibility is tested.
- [ ] Physical deployments use approved versions.
- [ ] Version pinning is supported.
- [ ] Runtime upgrades are staged.
- [ ] Runtime rollback is defined.

# 158. Migration Acceptance

- [ ] Every breaking change has a migration plan.
- [ ] Migration includes impact analysis.
- [ ] Migration includes compatibility window.
- [ ] Migration includes validation steps.
- [ ] Migration includes rollback.
- [ ] Deprecated contracts are measurable.
- [ ] Retirement requires usage evidence.
- [ ] Migration documentation is published.

# 159. Deprecation Acceptance

- [ ] Deprecated status is documented.
- [ ] Replacement is documented.
- [ ] Sunset date is documented.
- [ ] Usage is monitored.
- [ ] Customers can identify affected versions.
- [ ] Migration guide exists.
- [ ] Retirement is announced.
- [ ] Retired versions return stable errors.

# 160. Security Acceptance

- [ ] Security vulnerabilities can trigger emergency retirement.
- [ ] Blocked protocol versions cannot connect.
- [ ] Blocked runtime versions cannot execute.
- [ ] Blocked artifacts cannot execute.
- [ ] Security policy overrides technical compatibility.
- [ ] Offline labs reconcile blocked versions after reconnect.
- [ ] Version policy is auditable.

# 161. Testing Acceptance

- [ ] Schema compatibility tests exist.
- [ ] API compatibility tests exist.
- [ ] Event compatibility tests exist.
- [ ] Lab compatibility tests exist.
- [ ] Artifact compatibility tests exist.
- [ ] Runtime compatibility tests exist.
- [ ] Old-client/new-server tests exist.
- [ ] New-client/old-server supported tests exist.
- [ ] Negotiation tests exist.
- [ ] Retirement tests exist.

# 162. Observability Acceptance

- [ ] API version is observable.
- [ ] Protocol version is observable.
- [ ] Client version is observable.
- [ ] Lab Agent version is observable.
- [ ] Runtime version is observable.
- [ ] Artifact format is observable.
- [ ] Platform version is observable.
- [ ] Deprecated usage is measured.
- [ ] Negotiation failures are measured.
- [ ] Unsupported-version failures are alerted.

# 163. Release Acceptance

- [ ] Release version follows policy.
- [ ] Compatibility matrix is updated.
- [ ] Schema diff is reviewed.
- [ ] Breaking changes are identified.
- [ ] Migration guide is available.
- [ ] Deprecations are documented.
- [ ] Rollback plan is validated.
- [ ] Production rollout is staged.
- [ ] Canary compatibility is validated.
- [ ] Post-release compatibility is monitored.

# 164. Architectural Invariants

The following are mandatory:

1. Version numbers must have explicit semantics.
2. API version and protocol version are separate dimensions.
3. Software versions do not automatically determine compatibility.
4. Breaking changes require explicit versioning.
5. Compatible additions should not create unnecessary major versions.
6. Existing event meanings must remain stable.
7. Existing error-code meanings must remain stable.
8. Envelope semantics must remain stable within a supported protocol generation.
9. API major versions are explicit in the URL.
10. Lab Protocol versions are explicitly negotiated or otherwise validated.
11. Artifact compatibility is multidimensional.
12. Capability compatibility is distinct from version compatibility.
13. Physical execution requires explicit runtime/platform compatibility.
14. Security policy can override technical compatibility.
15. Deprecated contracts remain supported until retirement.
16. Retirement must be observable and controlled.
17. Old supported clients must be tested against new supported servers.
18. Migration must include rollback planning.
19. Database schema version is not an API version.
20. Version compatibility must be machine-testable.

# 165. Final Production Baseline

Kritva RaaS versioning is based on explicit compatibility boundaries:

    Studio
       |
       | API v1
       v
    Control Plane
       |
       | Protocol 1.x
       v
    Lab Agent
       |
       | Runtime Contract
       v
    Kritva Runtime
       |
       | Platform Compatibility
       v
    Robot

while artifacts carry independent requirements:

    .krv
       |
       +--> Artifact Format
       +--> Platform
       +--> Architecture
       +--> KritvaOS
       +--> Runtime
       +--> SDK
       +--> Capabilities

The migration model is:

    ACTIVE
       |
       v
    COMPATIBLE EVOLUTION
       |
       v
    DEPRECATION
       |
       v
    MIGRATION
       |
       v
    RETIREMENT

The production rule is:

> **Never silently break a supported consumer, never assume compatibility from a version number alone, and never perform physical execution without explicit compatibility validation.**

This versioning architecture allows Kritva RaaS to evolve independently across
Studio, Web Console, Control Plane, Lab Agent, Runtime, artifacts, and robotic
platforms while preserving a controlled and observable compatibility boundary
from local development through real-robot execution.
